"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  SupportStatusBadge,
  SupportPriorityBadge,
  SupportCategoryBadge,
} from "./SupportBadges";
import {
  SupportRequest,
  SupportStatus,
  SupportPriority,
} from "@/lib/types";
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  ArrowRight,
  Paperclip,
} from "lucide-react";

interface SupportRequestTableProps {
  requests: SupportRequest[];
  onSelectRequest: (request: SupportRequest) => void;
  onUpdateStatus: (requestId: string, status: SupportStatus) => void;
  onUpdatePriority: (requestId: string, priority: SupportPriority) => void;
  onAssign: (requestId: string, adminId: string, adminName: string) => void;
  onRequestResolve: (request: SupportRequest) => void;
}

export function SupportRequestTable({
  requests,
  onSelectRequest,
  onUpdateStatus,
  onUpdatePriority,
  onAssign,
  onRequestResolve,
}: SupportRequestTableProps) {
  // Format relative timestamp
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSecs < 60) return "Just now";
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return dateStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card p-8">
        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-bold text-foreground">No Matching Requests</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          There are no support requests matching your current filters. Try changing or clearing your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW: SHADCN TABLE */}
      {/* ========================================================================= */}
      <div className="hidden md:block rounded-2xl border border-border/80 dark:border-zinc-800 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40 dark:bg-[#0E1422]">
            <TableRow>
              <TableHead className="w-[110px]">ID</TableHead>
              <TableHead className="min-w-[190px]">User</TableHead>
              <TableHead className="min-w-[240px]">Subject</TableHead>
              <TableHead className="w-[130px]">Category</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">Assigned</TableHead>
              <TableHead className="w-[100px]">Updated</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => {
              const lastMsg = r.messages[r.messages.length - 1];
              const initials = r.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              const hasAttachments =
                (r.attachments && r.attachments.length > 0) ||
                r.messages.some((m) => m.attachments && m.attachments.length > 0);

              return (
                <TableRow
                  key={r.id}
                  onClick={() => onSelectRequest(r)}
                  className="cursor-pointer transition-colors group"
                >
                  {/* Request ID */}
                  <TableCell className="font-mono font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    {r.id}
                  </TableCell>

                  {/* User Column */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        {r.user.avatarUrl && (
                          <AvatarImage src={r.user.avatarUrl} alt={r.user.name} />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground block truncate">
                          {r.user.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {r.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Subject Column */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-foreground truncate block max-w-[320px]">
                          {r.subject}
                        </span>
                        {hasAttachments && (
                          <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      {lastMsg && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[320px]">
                          <span className="font-medium text-slate-700 dark:text-zinc-300">
                            {lastMsg.senderType === "admin" ? "Admin: " : "User: "}
                          </span>
                          {lastMsg.message}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <SupportCategoryBadge category={r.category} />
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    <SupportPriorityBadge priority={r.priority} />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <SupportStatusBadge status={r.status} />
                  </TableCell>

                  {/* Assigned Admin */}
                  <TableCell>
                    <span className="text-xs font-medium text-muted-foreground truncate block font-mono">
                      {r.assignedAdminName || "Unassigned"}
                    </span>
                  </TableCell>

                  {/* Last Updated */}
                  <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(r.updatedAt)}
                  </TableCell>

                  {/* Row Actions Menu */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right" className="w-48 bg-popover border-border">
                        <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                          Request Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onSelectRequest(r)}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Conversation</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSelectRequest(r)}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Reply to User</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                          Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(r.id, "open")}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <span>Mark as Open</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(r.id, "in-progress")}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <span>Mark as In Progress</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(r.id, "pending")}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <span>Mark as Pending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRequestResolve(r)}
                          className="text-xs gap-2 cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve Request...</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(r.id, "closed")}
                          className="text-xs gap-2 cursor-pointer text-muted-foreground"
                        >
                          <span>Close Request</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                          Quick Assign
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-1", "Praveen (Lead Admin)")}
                          className="text-xs cursor-pointer"
                        >
                          Assign to Praveen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-2", "Alex (Engineering Lead)")}
                          className="text-xs cursor-pointer"
                        >
                          Assign to Alex
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-3", "Sarah (Support Specialist)")}
                          className="text-xs cursor-pointer"
                        >
                          Assign to Sarah
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW: RESPONSIVE SHADCN CARDS (SECTION 6) */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-2.5">
        {requests.map((r) => {
          const initials = r.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          return (
            <Card
              key={r.id}
              onClick={() => onSelectRequest(r)}
              className="p-3.5 rounded-xl border border-border/80 dark:border-zinc-800 bg-card hover:bg-muted/40 transition-colors cursor-pointer space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs text-primary">
                  {r.id}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatTimeAgo(r.updatedAt)}
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                  {r.subject}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.user.name}</span>
                  <span>•</span>
                  <span>{r.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <SupportStatusBadge status={r.status} />
                  <SupportPriorityBadge priority={r.priority} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
