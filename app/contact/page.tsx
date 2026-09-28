"use client";

import React, { useState, useRef } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Send,
  CheckCircle2,
  Paperclip,
  X,
  FileText,
  Clock,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  User,
  ShieldCheck,
  Search,
  ExternalLink,
  Download,
} from "lucide-react";
import { useSupport } from "@/lib/support-context";
import {
  SupportCategory,
  SupportAttachment,
  SupportStatus,
  SupportPriority,
  SupportRequest,
} from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  SupportStatusBadge,
  SupportCategoryBadge,
} from "@/components/admin/support/SupportBadges";
import { useDemo } from "@/lib/demo-context";

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

const ALLOWED_EXTENSIONS = [
  "png", "jpg", "jpeg", "webp", "gif",
  "pdf",
  "txt", "log", "json", "csv",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export default function ContactPage() {
  const { user } = useDemo();
  const { requests, createRequest, addMessage } = useSupport();

  // Active tab: "submit" | "history"
  const [activeTab, setActiveTab] = useState<string>("submit");

  // Form State
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState<SupportCategory>("AI Generation");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Submission Success State
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Active selected ticket for viewing conversation
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // User reply composer inside ticket view
  const [userReplyText, setUserReplyText] = useState("");
  const [userReplyAttachments, setUserReplyAttachments] = useState<SupportAttachment[]>([]);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // History search filter
  const [historySearch, setHistorySearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Filter requests for the user
  const userEmail = (email || user?.email || "").toLowerCase().trim();
  const userTickets = requests.filter((r) => {
    // Show tickets matching email or show demo tickets if no match
    if (!userEmail) return true;
    return r.user.email.toLowerCase().trim() === userEmail || r.id === submittedRequestId;
  });

  const filteredTickets = userTickets.filter((r) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  });

  // Handle file uploads with validation
  const handleFileUpload = (
    files: FileList | null,
    target: "form" | "reply"
  ) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const newAttachments: SupportAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "";

      // Validate extension
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrorMsg(
          `Unsafe or unsupported file type: .${ext}. Allowed formats: PNG, JPG, WEBP, PDF, TXT, LOG, JSON.`
        );
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMsg(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      // Create preview object URL for images or icon reference
      const url = URL.createObjectURL(file);

      newAttachments.push({
        id: `att-${Date.now()}-${i}`,
        name: file.name,
        url,
        type: file.type || `application/${ext}`,
        sizeFormatted: formattedSize,
        sizeBytes: file.size,
      });
    }

    if (target === "form") {
      setAttachments((prev) => [...prev, ...newAttachments]);
    } else {
      setUserReplyAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Please fill out both Subject and Message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newId = await createRequest({
        category,
        subject: subject.trim(),
        message: message.trim(),
        attachments,
        userName: name.trim() || undefined,
        userEmail: email.trim() || undefined,
      });

      setSubmittedRequestId(newId);
      // Reset form
      setSubject("");
      setMessage("");
      setAttachments([]);
    } catch (err) {
      setErrorMsg("Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send reply in ticket view
  const handleSendUserReply = async (ticketId: string) => {
    if (!userReplyText.trim() && userReplyAttachments.length === 0) return;

    setIsSendingReply(true);
    try {
      await addMessage(
        ticketId,
        userReplyText.trim() || "Uploaded attachments.",
        "user",
        userReplyAttachments
      );
      setUserReplyText("");
      setUserReplyAttachments([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingReply(false);
    }
  };

  const selectedTicket = requests.find((r) => r.id === selectedTicketId) || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d0f] text-slate-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>AWA SUPPORT DESK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Contact & Support
          </h1>

          <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Manage your requests, issues, and inquiries. Our engineering and support team reviews every request and responds promptly.
          </p>
        </div>

        {/* Tab Switcher */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-slate-200/70 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 p-1 rounded-xl">
              <TabsTrigger
                value="submit"
                className="rounded-lg text-xs font-semibold px-5 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                <Send className="h-3.5 w-3.5 mr-2" />
                Submit Request
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg text-xs font-semibold px-5 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                My Support Requests
                {userTickets.length > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[10px] h-4">
                    {userTickets.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: SUBMIT SUPPORT REQUEST                            */}
          {/* ======================================================== */}
          <TabsContent value="submit" className="space-y-6">
            {submittedRequestId ? (
              /* Success Confirmation Card (Section 20) */
              <Card className="border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-lg text-center p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Your request has been submitted successfully.
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
                    A support engineer has been notified. You can track this request and exchange follow-up messages anytime under My Support Requests.
                  </p>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-xs">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Request ID:
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {submittedRequestId}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setSelectedTicketId(submittedRequestId);
                      setActiveTab("history");
                    }}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-5 shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Track This Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSubmittedRequestId(null)}
                    className="w-full sm:w-auto text-xs font-semibold h-10 px-5 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </Card>
            ) : (
              /* Request Submission Form (Section 20) */
              <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-md">
                <CardHeader className="border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    New Support Request
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
                    Provide detailed information to help our technical team investigate and resolve your issue faster.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  {errorMsg && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold">Check Required Fields</AlertTitle>
                      <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* User Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          Your Name
                        </label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="h-10 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          Your Email <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="h-10 text-xs"
                        />
                      </div>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                        <span>
                          Category <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                          Select the area relevant to your issue
                        </span>
                      </label>
                      <Select
                        value={category}
                        onValueChange={(val) => setCategory(val as SupportCategory)}
                      >
                        <SelectTrigger className="h-10 text-xs font-medium">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What is the issue?"
                        className="h-10 text-xs"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <Textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue... Include error messages, reproduction steps, or tool names."
                        className="text-xs min-h-[120px]"
                      />
                    </div>

                    {/* Attachments Section (Section 25) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <Paperclip className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                          <span>Attachments</span>
                        </label>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                          PNG, JPG, PDF, TXT, LOG up to 10MB
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.log,.json,.csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, "form")}
                      />

                      {/* Attached Items List */}
                      {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs"
                            >
                              <FileText className="h-3.5 w-3.5 text-indigo-500" />
                              <span className="font-medium text-slate-800 dark:text-zinc-200 max-w-[140px] truncate">
                                {att.name}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                {att.sizeFormatted}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAttachments((prev) =>
                                    prev.filter((a) => a.id !== att.id)
                                  )
                                }
                                className="text-slate-400 hover:text-rose-500 ml-1"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium border-dashed border-slate-300 dark:border-zinc-700 hover:border-slate-400 h-9"
                      >
                        <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                        Upload File
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs h-11 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Request</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 2: MY SUPPORT REQUESTS (Section 21)                  */}
          {/* ======================================================== */}
          <TabsContent value="history" className="space-y-6">
            {/* Search Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search by Request ID, subject, or category..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
              {historySearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistorySearch("")}
                  className="text-xs h-10 text-slate-500"
                >
                  Clear
                </Button>
              )}
            </div>

            {filteredTickets.length === 0 ? (
              <Card className="text-center p-12 border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316]">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <LifeBuoy className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Support Requests Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
                  {historySearch
                    ? "No requests match your current search term."
                    : "You haven't submitted any support requests yet."}
                </p>
                <Button
                  onClick={() => setActiveTab("submit")}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Submit a Request
                </Button>
              </Card>
            ) : (
              /* Request History List (Section 21) */
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="p-4 sm:p-5 border-slate-200 dark:border-zinc-800/90 bg-white dark:bg-[#121316] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {ticket.id}
                          </span>
                          <SupportCategoryBadge category={ticket.category} />
                          <SupportStatusBadge status={ticket.status} />
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {ticket.subject}
                        </h4>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</span>
                          {ticket.resolutionSummary && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Resolved
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-slate-600 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white"
                        >
                          View Conversation
                          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ======================================================== */}
      {/* DIALOG: USER-SIDE SUPPORT DETAIL & CONVERSATION (Sec 24) */}
      {/* ======================================================== */}
      <Dialog
        open={Boolean(selectedTicketId)}
        onOpenChange={(open) => !open && setSelectedTicketId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#121316] border-slate-200 dark:border-zinc-800">
          {selectedTicket && (
            <>
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedTicket.id}
                    </span>
                    <SupportStatusBadge status={selectedTicket.status} />
                    <SupportCategoryBadge category={selectedTicket.category} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedTicket.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Opened on {new Date(selectedTicket.createdAt).toLocaleDateString()} at{" "}
                    {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Scrollable Conversation Content */}
              <ScrollArea className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[50vh]">
                <div className="space-y-4 pr-3">
                  {/* Resolution Banner if Resolved (Section 22 & 24) */}
                  {selectedTicket.resolutionSummary && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Resolution Summary</span>
                      </div>
                      <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-200">
                        {selectedTicket.resolutionSummary}
                      </p>
                      {selectedTicket.resolvedAt && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
                          Marked resolved on {new Date(selectedTicket.resolvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Chronological Messages (Section 13 & 24) */}
                  {selectedTicket.messages.map((msg, index) => {
                    const isAdmin = msg.senderType === "admin";

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex gap-3 ${
                          isAdmin ? "justify-start" : "justify-end"
                        }`}
                      >
                        {isAdmin && (
                          <Avatar className="h-8 w-8 shrink-0 ring-1 ring-emerald-500/30">
                            <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold">
                              AWA
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs shadow-xs ${
                            isAdmin
                              ? "bg-slate-100 dark:bg-zinc-800/90 text-slate-900 dark:text-zinc-100 rounded-tl-sm border border-slate-200 dark:border-zinc-700/60"
                              : "bg-indigo-600 text-white rounded-tr-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-semibold">
                            <span>
                              {isAdmin ? "AWA Support Engineer" : "You"}
                            </span>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          {/* Message Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="pt-2 border-t border-current/10 space-y-1.5">
                              <span className="text-[10px] font-semibold opacity-80 block">
                                Attachments:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.attachments.map((att) => (
                                  <a
                                    key={att.id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                                      isAdmin
                                        ? "bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                                  >
                                    <FileText className="h-3 w-3" />
                                    <span className="truncate max-w-[120px]">{att.name}</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {!isAdmin && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
                              YOU
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* User Reply Composer (Section 24) */}
              <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-3">
                {selectedTicket.status === "closed" ? (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-center text-xs text-slate-600 dark:text-zinc-400">
                    This support ticket has been closed. If you have additional inquiries, please submit a new support request.
                  </div>
                ) : (
                  <>
                    {/* User Reply Attachments Preview */}
                    {userReplyAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {userReplyAttachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-[11px]"
                          >
                            <FileText className="h-3 w-3 text-indigo-500" />
                            <span className="truncate max-w-[120px]">{att.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setUserReplyAttachments((prev) =>
                                  prev.filter((a) => a.id !== att.id)
                                )
                              }
                              className="text-slate-400 hover:text-rose-500 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Textarea
                        rows={3}
                        value={userReplyText}
                        onChange={(e) => setUserReplyText(e.target.value)}
                        placeholder="Write a message..."
                        className="text-xs bg-white dark:bg-[#121316]"
                      />

                      {/* Hidden File Input for replies */}
                      <input
                        ref={replyFileInputRef}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.log,.json,.csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, "reply")}
                      />

                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => replyFileInputRef.current?.click()}
                          className="text-xs h-8 px-3 border-slate-300 dark:border-zinc-700"
                        >
                          <Paperclip className="h-3.5 w-3.5 mr-1" />
                          Attach File
                        </Button>

                        <Button
                          type="button"
                          disabled={isSendingReply || (!userReplyText.trim() && userReplyAttachments.length === 0)}
                          onClick={() => handleSendUserReply(selectedTicket.id)}
                          className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                          {isSendingReply ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1.5" />
                              Send
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
