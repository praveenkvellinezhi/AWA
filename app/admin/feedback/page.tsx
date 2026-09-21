"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { MessageSquare, ThumbsUp, ThumbsDown, Search, Sparkles, Filter } from "lucide-react";

export default function AdminFeedbackPage() {
  const { feedbackList, templates } = useDemo();

  const [ratingFilter, setRatingFilter] = useState<"all" | "up" | "down">("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeedback = feedbackList.filter((entry) => {
    if (ratingFilter !== "all" && entry.rating !== ratingFilter) return false;
    if (templateFilter !== "all" && entry.templateId !== templateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = entry.comment?.toLowerCase().includes(q);
      const matchEmail = entry.userEmail.toLowerCase().includes(q);
      const matchTemplate = entry.templateName.toLowerCase().includes(q);
      if (!matchComment && !matchEmail && !matchTemplate) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            FEAT-020, FEAT-021 • Quality Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 mt-1">
            <MessageSquare className="h-7 w-7 text-indigo-400" />
            User Ratings & External Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review thumbs up/down signals, user comments, and verified external AI tools used with AWA prompts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback by comment, user, or template..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value as any)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="all">All Ratings (Up & Down)</option>
          <option value="up">👍 Thumbs Up Only</option>
          <option value="down">👎 Thumbs Down Only</option>
        </select>

        <select
          value={templateFilter}
          onChange={(e) => setTemplateFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white max-w-[220px]"
        >
          <option value="all">All Templates</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Template & Version</th>
                <th className="py-3 px-4">Tool Used</th>
                <th className="py-3 px-4">User Comment</th>
                <th className="py-3 px-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredFeedback.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    {entry.rating === "up" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                        <ThumbsUp className="h-3 w-3" /> Worked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30">
                        <ThumbsDown className="h-3 w-3" /> Issue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{entry.templateName}</span>
                    <span className="text-[10px] font-mono text-indigo-400">
                      Type: {entry.promptType === "customized" ? "AI Customized Version" : "Base Expert Prompt"}
                    </span>
                    {entry.customizationRequestText && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">
                        &quot;{entry.customizationRequestText}&quot;
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {entry.toolUsed || "Not specified"}
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    {entry.comment ? (
                      <span className="text-slate-200">{entry.comment}</span>
                    ) : (
                      <span className="text-slate-500 italic">No written comment</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                    {entry.userEmail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
