"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import {
  FolderTree,
  FileText,
  Cpu,
  BarChart3,
  DollarSign,
  MessageSquare,
  ThumbsUp,
  Shield,
  ArrowRight,
  TrendingUp,
  Sliders,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { categories, templates, aiTools, feedbackList, adminConfig } = useDemo();

  const thumbsUpCount = feedbackList.filter((f) => f.rating === "up").length;
  const satisfactionRate =
    feedbackList.length > 0
      ? Math.round((thumbsUpCount / feedbackList.length) * 100)
      : 100;

  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + (cat.subcategories?.length || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            AWA Content & Platform Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Administrator Overview Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time view of catalog templates, AI model tags, customization engine spend, and user feedback.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Categories</span>
            <FolderTree className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{categories.length}</div>
          <p className="text-[11px] text-slate-400">
            {totalSubcategories} subcategories configured
          </p>
        </div>

        {/* Templates */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Templates</span>
            <FileText className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{templates.length}</div>
          <p className="text-[11px] text-slate-400">
            100% finished prompts (0 blanks)
          </p>
        </div>

        {/* AI Models */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Active Tools</span>
            <Cpu className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {aiTools.filter((t) => !t.isRetired).length}
          </div>
          <p className="text-[11px] text-slate-400">
            Midjourney, Runway, Sora, Flux, etc.
          </p>
        </div>

        {/* Satisfaction */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">User Signal</span>
            <ThumbsUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {satisfactionRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {feedbackList.length} verified feedback reviews
          </p>
        </div>
      </div>

      {/* AI Spend Cap Monitor (FEAT-037) */}
      <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-400" />
              Monthly AI Customization Spend & Safety Cap (FEAT-037)
            </h3>
            <p className="text-xs text-slate-400">
              Protects platform against unmetered API costs. If cap is hit, rewrites are safely suspended while base prompts remain accessible.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-purple-300">
              ${adminConfig.currentMonthlySpend.toFixed(2)} / ${adminConfig.monthlySpendCap}.00 USD
            </span>
          </div>
        </div>

        {/* Spend progress bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all"
            style={{
              width: `${(adminConfig.currentMonthlySpend / adminConfig.monthlySpendCap) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/templates"
          className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/40 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <FileText className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white">Template & Prompt Authoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create or edit finished prompt text. Explicitly enforces zero guided blank fields per FEAT-030.
          </p>
        </Link>

        <Link
          href="/admin/insights"
          className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/40 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <BarChart3 className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white">Customization Insights Report</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            View recurring user customization patterns to discover content gaps and author new templates (FEAT-035).
          </p>
        </Link>

        <Link
          href="/admin/engine-config"
          className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/40 transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <Sliders className="h-6 w-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white">Engine & Spend Configuration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Toggle voice input, set free credit allotments, and configure monthly spending limits (FEAT-037).
          </p>
        </Link>
      </div>
    </div>
  );
}
