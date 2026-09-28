"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SupportRequest,
  SupportStatus,
  SupportPriority,
  SupportCategory,
  SupportAttachment,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Lock,
  ExternalLink,
  Plus,
  X,
  CheckCheck,
  User,
  SlidersHorizontal,
  Clock,
  ChevronRight,
  Shield,
  MessageSquare,
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
  { id: "adm-2", name: "Amina" },
  { id: "adm-3", name: "Rohit" },
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

  // Mobile tab state: "chat" or "info"
  const [activeMobileView, setActiveMobileView] = useState<"chat" | "info">("chat");

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat on new message or when opening a ticket
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [request.id, request.messages.length]);

  // Send Admin Reply
  const handleSendReply = async () => {
    if (!replyText.trim() && replyAttachments.length === 0) return;
    setIsSending(true);
    try {
      await onSendMessage(
        request.id,
        replyText.trim() || "Uploaded attachments.",
        "admin",
        replyAttachments.length > 0 ? replyAttachments : undefined
      );
      setReplyText("");
      setReplyAttachments([]);
    } finally {
      setIsSending(false);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl+Enter or Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
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
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const userInitials = request.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full flex-1 min-h-0 rounded-2xl bg-white dark:bg-[#121316] border border-slate-200/90 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
      {/* ========================================================================= */}
      {/* 1. UNIFIED TOP BAR (WHATSAPP-STYLE CHAT HEADER)                           */}
      {/* ========================================================================= */}
      <div className="px-4 py-3 sm:px-5 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121316] flex items-center justify-between gap-3 shrink-0">
        {/* Left: Back button + User details & Subject */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold">Back</span>
          </Button>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* User Avatar with online indicator */}
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 ring-1 ring-slate-200/80 dark:ring-zinc-800">
              {request.user.avatarUrl && (
                <AvatarImage src={request.user.avatarUrl} alt={request.user.name} />
              )}
              <AvatarFallback className="text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
          </div>

          {/* User Name & Ticket Subject */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {request.user.name}
              </span>
              <span className="font-mono font-bold text-[11px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                {request.id}
              </span>
              <div className="hidden md:inline-flex">
                <SupportCategoryBadge category={request.category} />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[280px] sm:max-w-[460px] font-normal">
              {request.subject}
            </p>
          </div>
        </div>

        {/* Right: Status / Priority & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <SupportPriorityBadge priority={request.priority} />
            <SupportStatusBadge status={request.status} />
          </div>

          {request.status !== "resolved" && request.status !== "closed" && (
            <Button
              type="button"
              size="sm"
              onClick={() => onRequestResolve(request)}
              className="h-8 text-xs gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resolve</span>
            </Button>
          )}

          {/* Toggle details on mobile or toggle sidebar */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveMobileView(activeMobileView === "chat" ? "info" : "chat")}
            className="lg:hidden h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Toggle ticket details"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN UNIFIED WORKSPACE: WHATSAPP CHAT CANVAS + SIDEBAR PANEL           */}
      {/* ========================================================================= */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* ======================================================================= */}
        {/* LEFT / CENTER: WHATSAPP CHAT INTERFACE                                  */}
        {/* ======================================================================= */}
        <div
          className={`flex-1 min-h-0 flex flex-col bg-[#F3F4F6] dark:bg-[#0B0F17] relative overflow-hidden ${
            activeMobileView === "info" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Scrollable Conversation Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4"
          >
            {/* Date divider in middle */}
            <div className="flex justify-center my-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/80 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 shadow-2xs backdrop-blur-xs">
                {formatDate(request.createdAt)}
              </span>
            </div>

            {/* In-stream messages */}
            {request.messages.map((msg, idx) => {
              const isAdmin = msg.senderType === "admin";
              const isFirstMsg = idx === 0;

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  {/* WhatsApp-style Chat Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-3.5 space-y-1.5 shadow-xs transition-all ${
                      isAdmin
                        ? "bg-[#E7F8E8] dark:bg-[#005C4B] text-slate-900 dark:text-white rounded-2xl rounded-tr-xs border border-emerald-200/50 dark:border-emerald-700/30"
                        : "bg-white dark:bg-[#1A2234] text-slate-900 dark:text-zinc-100 rounded-2xl rounded-tl-xs border border-slate-200/40 dark:border-zinc-800/50"
                    }`}
                  >
                    {/* Bubble Header: Sender Name & Role */}
                    <div className="flex items-center justify-between gap-3 text-[11px] pb-0.5">
                      <span
                        className={`font-bold ${
                          isAdmin
                            ? "text-emerald-800 dark:text-emerald-200"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {msg.sender}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                          isAdmin
                            ? "bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100"
                            : "bg-blue-100/70 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200"
                        }`}
                      >
                        {isAdmin ? "Admin" : isFirstMsg ? "Initial" : "User"}
                      </span>
                    </div>

                    {/* Bubble Text */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                      {msg.message}
                    </p>

                    {/* Message Attachments (Pill with Border Shadow) */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="pt-1.5 space-y-1.5">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-3 rounded-xl bg-white dark:bg-[#121824] border border-slate-200/70 dark:border-zinc-700/60 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Paperclip className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white truncate block">
                                  {att.name}
                                </span>
                                {att.sizeFormatted && (
                                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                                    {att.sizeFormatted}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              title="Open attachment"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Delivered Double Check */}
                    <div className="flex items-center justify-end gap-1 pt-0.5">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-400">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isAdmin && (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Resolution Banner in Chat Stream if Resolved */}
            {request.resolutionSummary && (
              <div className="flex justify-center my-3">
                <div className="max-w-md px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Resolution: {request.resolutionSummary}</span>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* DOCKED BOTTOM COMPOSER (WHATSAPP CHAT INPUT BAR)                      */}
          {/* ===================================================================== */}
          <div className="p-3 sm:p-3.5 bg-white dark:bg-[#121316] border-t border-slate-200/80 dark:border-zinc-800/80 shrink-0">
            {/* Draft Attachments Preview */}
            {replyAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                {replyAttachments.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-mono flex items-center gap-2 border-0"
                  >
                    <Paperclip className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[140px] text-slate-800 dark:text-zinc-200">
                      {att.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyAttachments((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2.5">
              {/* Paperclip Button */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleAttachMockFile}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Chat Input / Textarea */}
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an admin reply... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="min-h-[42px] max-h-[120px] rounded-2xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 px-4 py-2.5 text-xs sm:text-sm resize-none flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
              />

              {/* Circular Send Button */}
              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSending || (!replyText.trim() && replyAttachments.length === 0)}
                className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
                title="Send reply"
              >
                {isSending ? (
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4 ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT: INTEGRATED DETAILS & INTERNAL NOTES PANEL (NO SEPARATE CARDS)    */}
        {/* ======================================================================= */}
        <div
          className={`w-full lg:w-[350px] xl:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121316] flex flex-col min-h-0 overflow-y-auto shrink-0 ${
            activeMobileView === "chat" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Ticket Overview
            </span>
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveMobileView("chat")}
                className="h-7 text-xs text-emerald-600 font-semibold"
              >
                Back to Chat
              </Button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Section 1: Ticket Metadata */}
            <div className="space-y-3.5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-mono block">
                Manage Request
              </span>

              {/* Status Select */}
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">Status</span>
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
                  <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
                <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">Priority</span>
                <Select
                  value={request.priority}
                  onValueChange={(val) => onUpdatePriority(request.id, val as SupportPriority)}
                >
                  <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
                <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">Category</span>
                <Select
                  value={request.category}
                  onValueChange={(val) => onUpdateCategory(request.id, val as SupportCategory)}
                >
                  <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
                <span className="text-xs text-slate-500 dark:text-zinc-400 block font-medium">Assigned Admin</span>
                <Select
                  value={request.assignedTo || "unassigned"}
                  onValueChange={(val) => {
                    const found = ADMIN_ASSIGNEES.find((a) => a.id === val);
                    onAssign(request.id, val, found?.name);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                    <SelectValue placeholder="Assign To" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    {ADMIN_ASSIGNEES.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="text-xs">
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Timestamps */}
              <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-slate-800 dark:text-zinc-200">{formatDate(request.createdAt)} {formatTime(request.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="text-slate-800 dark:text-zinc-200">{formatDate(request.updatedAt)} {formatTime(request.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Customer Profile */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-mono block">
                Customer Record
              </span>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-1 ring-slate-200 dark:ring-zinc-800">
                  {request.user.avatarUrl && (
                    <AvatarImage src={request.user.avatarUrl} alt={request.user.name} />
                  )}
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block truncate">
                    {request.user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 block truncate">
                    {request.user.email}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {request.user.plan || "Free Tier"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Country:</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">
                    {request.user.country || "Global"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer ID:</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {request.user.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Internal Admin Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Internal Notes</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold">
                  Admin Only
                </span>
              </div>

              {/* Notes list */}
              <div className="space-y-2">
                {request.internalNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No internal notes yet.</p>
                ) : (
                  request.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                        <span className="font-bold text-slate-800 dark:text-zinc-200">{note.author}</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-sans">
                        {note.note}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note input */}
              <div className="space-y-2 pt-1">
                <Textarea
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Add private note for team..."
                  rows={2}
                  className="text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl resize-none"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddNote}
                  disabled={isAddingNote || !internalNoteText.trim()}
                  className="w-full h-8 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Internal Note</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
