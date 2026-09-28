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
  MoreVertical,
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
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } catch {
      return dateStr;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-8">
        <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching Requests</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          There are no support requests matching your current filters. Try changing or clearing your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW: SHADCN TABLE (EXACT MATCH TO USER SCREENSHOT)            */}
      {/* ========================================================================= */}
      <div className="hidden md:block rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#121316] overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-transparent border-b border-slate-100 dark:border-zinc-800/80">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[100px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider pl-5 py-3.5">
                ID
              </TableHead>
              <TableHead className="min-w-[190px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                USER
              </TableHead>
              <TableHead className="min-w-[280px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                SUBJECT
              </TableHead>
              <TableHead className="w-[130px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                CATEGORY
              </TableHead>
              <TableHead className="w-[110px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                PRIORITY
              </TableHead>
              <TableHead className="w-[130px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                STATUS
              </TableHead>
              <TableHead className="w-[140px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                ASSIGNED
              </TableHead>
              <TableHead className="w-[120px] text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider py-3.5">
                CREATED AT
              </TableHead>
              <TableHead className="w-[60px] text-right text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider pr-5 py-3.5">
                ACTIONS
              </TableHead>
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

              const idParts = r.id.split("-");
              const idPrefix = idParts[0] ? `${idParts[0]}-` : "SUP-";
              const idSuffix = idParts[1] || r.id;

              return (
                <TableRow
                  key={r.id}
                  onClick={() => onSelectRequest(r)}
                  className="cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800/60 group"
                >
                  {/* Request ID (2-line split like screenshot) */}
                  <TableCell className="pl-5 py-4 align-middle">
                    <div className="font-mono font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      <div className="text-slate-800 dark:text-zinc-200">{idPrefix}</div>
                      <div>{idSuffix}</div>
                    </div>
                  </TableCell>

                  {/* User (Avatar + Name + Email) */}
                  <TableCell className="py-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 shrink-0 ring-1 ring-slate-200/80 dark:ring-zinc-800">
                        {r.user.avatarUrl && (
                          <AvatarImage src={r.user.avatarUrl} alt={r.user.name} />
                        )}
                        <AvatarFallback className="text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {r.user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {r.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Subject with Attachment icon & snippet */}
                  <TableCell className="py-4 align-middle">
                    <div className="space-y-0.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block max-w-[340px]">
                          {r.subject}
                        </span>
                        {hasAttachments && (
                          <Paperclip className="h-3 w-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                        )}
                      </div>
                      {lastMsg && (
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-[340px]">
                          <span className="font-medium text-slate-600 dark:text-zinc-400">
                            {lastMsg.senderType === "user" ? "User" : "Admin"}:
                          </span>{" "}
                          {lastMsg.message}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Category Pill Badge */}
                  <TableCell className="py-4 align-middle">
                    <SupportCategoryBadge category={r.category} />
                  </TableCell>

                  {/* Priority Pill Badge */}
                  <TableCell className="py-4 align-middle">
                    <SupportPriorityBadge priority={r.priority} />
                  </TableCell>

                  {/* Status Pill Badge */}
                  <TableCell className="py-4 align-middle">
                    <SupportStatusBadge status={r.status} />
                  </TableCell>

                  {/* Assigned Admin */}
                  <TableCell className="py-4 align-middle">
                    <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                      {r.assignedAdminName || (r.assignedTo === "unassigned" ? "Unassigned" : r.assignedTo)}
                    </span>
                  </TableCell>

                  {/* Created At (Date on line 1, Time on line 2) */}
                  <TableCell className="py-4 align-middle">
                    <div className="text-xs text-slate-800 dark:text-zinc-200 leading-tight">
                      <div className="font-medium">{formatDate(r.createdAt)}</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        {formatTime(r.createdAt)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions: Vertical 3 dots */}
                  <TableCell className="text-right pr-5 py-4 align-middle" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right" className="w-48 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-lg">
                        <DropdownMenuLabel className="text-[11px] text-slate-400 font-mono">
                          Actions for {r.id}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onSelectRequest(r)}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSelectRequest(r)}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply to User</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                        {/* Status changes */}
                        {r.status !== "in-progress" && (
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(r.id, "in-progress")}
                            className="text-xs cursor-pointer gap-2"
                          >
                            <span>Mark In Progress</span>
                          </DropdownMenuItem>
                        )}
                        {r.status !== "resolved" && (
                          <DropdownMenuItem
                            onClick={() => onRequestResolve(r)}
                            className="text-xs cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve Request...</span>
                          </DropdownMenuItem>
                        )}
                        {r.status !== "closed" && (
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(r.id, "closed")}
                            className="text-xs cursor-pointer gap-2 text-slate-500"
                          >
                            <span>Close Request</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                        {/* Assign submenu actions */}
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-1", "Praveen (Lead Admin)")}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign to Praveen</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-2", "Amina")}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign to Amina</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAssign(r.id, "adm-3", "Rohit")}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign to Rohit</span>
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
      {/* 2. MOBILE VIEW: CARD LIST (SECTION 6)                                     */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3">
        {requests.map((r) => {
          const hasAttachments =
            (r.attachments && r.attachments.length > 0) ||
            r.messages.some((m) => m.attachments && m.attachments.length > 0);

          return (
            <Card
              key={r.id}
              onClick={() => onSelectRequest(r)}
              className="p-4 rounded-2xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] space-y-3 cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {r.id}
                </span>
                <span className="text-[11px] text-slate-500">
                  {formatRelativeTime(r.updatedAt)}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{r.subject}</span>
                  {hasAttachments && <Paperclip className="h-3 w-3 text-slate-400 shrink-0" />}
                </h4>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {r.user.avatarUrl && (
                      <AvatarImage src={r.user.avatarUrl} alt={r.user.name} />
                    )}
                    <AvatarFallback className="text-[9px]">
                      {r.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">
                    {r.user.name}
                  </span>
                </div>
                <SupportCategoryBadge category={r.category} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <SupportStatusBadge status={r.status} />
                  <SupportPriorityBadge priority={r.priority} />
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
