"use client";

import React, { useState } from "react";
import {
  SupportRequest,
  SupportStatus,
  SupportPriority,
  SupportCategory,
  SupportAttachment,
} from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SupportStatusBadge,
  SupportPriorityBadge,
  SupportCategoryBadge,
} from "./SupportBadges";
import {
  ArrowLeft,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileText,
  Lock,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  X,
  UploadCloud,
} from "lucide-react";

interface SupportRequestDetailProps {
  request: SupportRequest;
  onBack: () => void;
  onUpdateStatus: (requestId: string, status: SupportStatus, resolutionSummary?: string) => void;
  onUpdatePriority: (requestId: string, priority: SupportPriority) => void;
  onUpdateCategory: (requestId: string, category: SupportCategory) => void;
  onAssign: (requestId: string, adminId: string, adminName?: string) => void;
  onSendMessage: (
    requestId: string,
    message: string,
    senderType: "admin" | "user",
    attachments?: SupportAttachment[]
  ) => Promise<void>;
  onAddInternalNote: (requestId: string, note: string) => void;
  onRequestResolve: (request: SupportRequest) => void;
}

const CATEGORIES: SupportCategory[] = [
  "General",
  "Technical",
  "Account",
  "Billing",
  "Subscription",
  "AI Generation",
  "Template / Guide",
  "Bug Report",
  "Feature Request",
  "Other",
];

const PRIORITIES: SupportPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: SupportStatus[] = ["open", "in-progress", "pending", "resolved", "closed"];

const ADMIN_ASSIGNEES = [
  { id: "unassigned", name: "Unassigned" },
  { id: "adm-1", name: "Praveen (Lead Admin)" },
  { id: "adm-2", name: "Alex (Engineering Lead)" },
  { id: "adm-3", name: "Sarah (Support Specialist)" },
  { id: "team", name: "Support Team" },
];

export function SupportRequestDetail({
  request,
  onBack,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateCategory,
  onAssign,
  onSendMessage,
  onAddInternalNote,
  onRequestResolve,
}: SupportRequestDetailProps) {
  // Reply composer state
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyAttachments, setReplyAttachments] = useState<SupportAttachment[]>([]);

  // Internal note composer state
  const [internalNoteText, setInternalNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Send Admin Reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await onSendMessage(
        request.id,
        replyText.trim(),
        "admin",
        replyAttachments.length > 0 ? replyAttachments : undefined
      );
      setReplyText("");
      setReplyAttachments([]);
    } finally {
      setIsSending(false);
    }
  };

  // Add Internal Admin Note
  const handleAddNote = () => {
    if (!internalNoteText.trim()) return;
    setIsAddingNote(true);
    onAddInternalNote(request.id, internalNoteText.trim());
    setInternalNoteText("");
    setIsAddingNote(false);
  };

  // Mock File Attachment
  const handleAttachMockFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAtt: SupportAttachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type || "application/octet-stream",
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    setReplyAttachments((prev) => [...prev, newAtt]);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const userInitials = request.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION & ACTION BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Requests</span>
          </Button>

          <div className="h-4 w-[1px] bg-border hidden sm:block" />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/80">
              {request.id}
            </span>
            <SupportStatusBadge status={request.status} />
            <SupportPriorityBadge priority={request.priority} />
            <SupportCategoryBadge category={request.category} />
          </div>
        </div>

        {/* Quick Resolution Action */}
        <div className="flex items-center gap-2 shrink-0">
          {request.status !== "resolved" && request.status !== "closed" && (
            <Button
              type="button"
              size="sm"
              onClick={() => onRequestResolve(request)}
              className="h-8 text-xs gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Request</span>
            </Button>
          )}

          {request.status !== "closed" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(request.id, "closed")}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Title & Subject Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base sm:text-xl font-bold text-foreground leading-snug">
            {request.subject}
          </h2>
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            Reported {formatDate(request.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Assigned to: <strong className="text-foreground">{request.assignedAdminName || "Unassigned"}</strong> • Last updated: {formatDate(request.updatedAt)}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN WORKSPACE (SECTION 23 DESKTOP LAYOUT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CONVERSATION & REPLY (2 COLS ON DESKTOP) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-2 space-y-4">
          {/* Conversation History Card */}
          <Card className="p-4 sm:p-5 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Conversation Thread ({request.messages.length})</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Order: Chronological
              </span>
            </div>

            {/* Messages Timeline */}
            <div className="space-y-4">
              {request.messages.map((msg, idx) => {
                const isAdmin = msg.senderType === "admin";
                const isFirstMsg = idx === 0;

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isAdmin
                        ? "bg-muted/40 dark:bg-[#121A2A] border-border/90 dark:border-zinc-800"
                        : "bg-background border-border/90 shadow-2xs"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {isAdmin ? (
                            <AvatarFallback className="bg-emerald-600 text-white text-[10px]">
                              AD
                            </AvatarFallback>
                          ) : (
                            <>
                              {request.user.avatarUrl && (
                                <AvatarImage src={request.user.avatarUrl} alt={request.user.name} />
                              )}
                              <AvatarFallback>{userInitials}</AvatarFallback>
                            </>
                          )}
                        </Avatar>

                        <div>
                          <span className="text-xs font-bold text-foreground">
                            {msg.sender}
                          </span>
                          <span
                            className={`ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              isAdmin
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                            }`}
                          >
                            {isAdmin ? "ADMIN RESPONSE" : isFirstMsg ? "INITIAL USER INQUIRY" : "USER MESSAGE"}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>

                    {/* Message Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                          Attachments ({msg.attachments.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="p-2 rounded-lg bg-card border border-border flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-xs font-mono font-semibold text-foreground truncate block">
                                    {att.name}
                                  </span>
                                  {att.sizeFormatted && (
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                      {att.sizeFormatted}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                                title="Open attachment"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Resolution Banner if resolved */}
            {request.resolutionSummary && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Official Resolution Summary</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed pl-5">
                  {request.resolutionSummary}
                </p>
                {request.resolvedAt && (
                  <span className="text-[10px] font-mono text-muted-foreground pl-5 block">
                    Resolved on {formatDate(request.resolvedAt)}
                  </span>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* ADMIN REPLY COMPOSER (SECTION 14) */}
            {/* =================================================================== */}
            <div className="pt-3 border-t border-border/70 space-y-3">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Respond to User as Administrator</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  User will receive reply in portal
                </span>
              </label>

              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write an official administrator reply with clear actionable guidance..."
                rows={4}
                className="text-xs sm:text-sm bg-background border-border/90 resize-none leading-relaxed"
              />

              {/* Uploaded draft attachments */}
              {replyAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {replyAttachments.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      className="px-2.5 py-1 rounded-md bg-muted text-xs font-mono flex items-center gap-2 border border-border"
                    >
                      <Paperclip className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate max-w-[160px]">{att.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setReplyAttachments((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAttachMockFile}
                  />
                </label>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Sending..." : "Send Reply"}</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* ======================================================================= */}
          {/* INTERNAL NOTES CARD (SECTION 15 — STRICTLY NOT VISIBLE TO USER) */}
          {/* ======================================================================= */}
          <Card className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-50/15 dark:bg-amber-950/10 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider font-mono">
                  Internal Notes
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                INTERNAL — NOT VISIBLE TO USER
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use internal notes for team investigations, backend logs analysis, customer billing history checks, or handoff comments. These notes are completely stripped from user-facing views.
            </p>

            {/* List of Internal Notes */}
            <div className="space-y-2">
              {request.internalNotes.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-amber-500/30 text-center text-xs text-muted-foreground font-mono">
                  No internal notes recorded yet. Add your investigation notes below.
                </div>
              ) : (
                request.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-card border border-amber-500/20 space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span className="font-bold text-foreground">{note.author}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                      {note.note}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Internal Note Composer */}
            <div className="pt-2 space-y-2 border-t border-amber-500/20">
              <Textarea
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                placeholder="Write internal note (e.g. Checked user's generation telemetry logs...)"
                rows={2}
                className="text-xs bg-card border-border resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddNote}
                  disabled={isAddingNote || !internalNoteText.trim()}
                  className="h-8 text-xs gap-1.5 font-semibold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: REQUEST INFO & USER CARD (1 COL ON DESKTOP) */}
        {/* ======================================================================= */}
        <div className="space-y-4">
          {/* Request Information Card (Section 10) */}
          <Card className="p-4 sm:p-5 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card space-y-4 shadow-xs">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono block border-b border-border/60 pb-2.5">
              Request Information
            </span>

            <div className="space-y-3 text-xs">
              {/* Request ID */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Request ID:</span>
                <span className="font-mono font-bold text-foreground">{request.id}</span>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <span className="text-muted-foreground block">Status:</span>
                <Select
                  value={request.status}
                  onValueChange={(val) => {
                    if (val === "resolved") {
                      onRequestResolve(request);
                    } else {
                      onUpdateStatus(request.id, val as SupportStatus);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Select */}
              <div className="space-y-1">
                <span className="text-muted-foreground block">Priority:</span>
                <Select
                  value={request.priority}
                  onValueChange={(val) => onUpdatePriority(request.id, val as SupportPriority)}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="text-xs">
                        {p.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <span className="text-muted-foreground block">Category:</span>
                <Select
                  value={request.category}
                  onValueChange={(val) => onUpdateCategory(request.id, val as SupportCategory)}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned Admin Select */}
              <div className="space-y-1">
                <span className="text-muted-foreground block">Assigned Admin:</span>
                <Select
                  value={request.assignedTo || "unassigned"}
                  onValueChange={(val) => {
                    const found = ADMIN_ASSIGNEES.find((a) => a.id === val);
                    onAssign(request.id, val, found?.name);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Assign To" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {ADMIN_ASSIGNEES.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="text-xs">
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-1.5 font-mono text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-foreground">{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Activity:</span>
                  <span className="text-foreground">{formatDate(request.updatedAt)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* User Information Card (Section 11) */}
          <Card className="p-4 sm:p-5 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card space-y-3.5 shadow-xs">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono block border-b border-border/60 pb-2.5">
              Customer Information
            </span>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                {request.user.avatarUrl && (
                  <AvatarImage src={request.user.avatarUrl} alt={request.user.name} />
                )}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm text-foreground block truncate">
                  {request.user.name}
                </span>
                <span className="text-xs text-muted-foreground block truncate">
                  {request.user.email}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {request.user.plan || "Free Tier"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country:</span>
                <span className="text-foreground font-medium">
                  {request.user.country || "Global"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {request.user.id}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => alert(`Navigating to customer record: ${request.user.email}`)}
              className="w-full h-8 text-xs font-semibold gap-1.5 mt-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>View Customer Record</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
