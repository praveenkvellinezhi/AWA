"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FolderTree,
  FileText,
  Sliders,
  Users,
  DollarSign,
  TrendingUp,
  Zap,
  BarChart3,
  ArrowRight,
  Tag,
  Activity,
  Trophy,
  Calendar,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { categories, templates, aiTools, feedbackList, adminConfig } = useDemo();
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const thumbsUpCount = feedbackList.filter((f) => f.rating === "up").length;
  const satisfactionRate =
    feedbackList.length > 0
      ? Math.round((thumbsUpCount / feedbackList.length) * 100)
      : 83;

  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + (cat.subcategories?.length || 0),
    0
  );


  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#008235] dark:text-emerald-400">
            AWA CONTENT & PLATFORM MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Administrator Overview <span className="text-[#008235] dark:text-emerald-400">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time view of catalog templates, AI model tags, platform reports, and user feedback.
          </p>
        </div>

        {/* Top right inspirational quote box */}
        <div className="hidden lg:block text-right">
          <p className="text-sm font-semibold italic text-slate-800 dark:text-slate-200">
            &ldquo;Create. Customize. Empower.&rdquo;
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Smarter content for a brighter tomorrow.
          </p>
        </div>
      </div>

      {/* Top Metric Cards Row (4 cards in 1 row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Categories */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#008235] dark:text-emerald-400 flex items-center gap-0.5">
              ↗ +0%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              CATEGORIES
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {categories.length || 5}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {totalSubcategories || 16} subcategories configured
          </p>
        </div>

        {/* 2. Templates */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#008235] dark:text-emerald-400 flex items-center gap-0.5">
              ↗ +12%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              TEMPLATES
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {templates.length || 55}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            100% finished prompts (0 blanks)
          </p>
        </div>

        {/* 3. Active Tools */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sliders className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#008235] dark:text-emerald-400 flex items-center gap-0.5">
              ↗ +25%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              ACTIVE TOOLS
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {aiTools.filter((t) => !t.isRetired).length || 10}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Midjourney, Runway, Sora, Flux, etc.
          </p>
        </div>

        {/* 4. User Signal */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#008235] dark:text-emerald-400 flex items-center gap-0.5">
              ↗ +8%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              USER SIGNAL
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {satisfactionRate}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {feedbackList.length || 6} verified feedback reviews
          </p>
        </div>
      </div>


      {/* Middle Section: Usage Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Usage Overview Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Usage Overview
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Template usage, customizations, and user activity over the last 30 days.
                </p>
              </div>
            </div>

            {/* Time range selector using Shadcn Select */}
            <div className="w-[140px]">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-8">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <SelectValue placeholder="Time range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SVG Multi-Line Chart with Hover Tooltip at Sep 09 */}
          <div className="relative w-full pt-2">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#008235" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#008235" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis values */}
              {[
                { val: 200, y: 25 },
                { val: 150, y: 65 },
                { val: 100, y: 105 },
                { val: 50, y: 145 },
                { val: 0, y: 185 },
              ].map((g) => (
                <g key={g.val}>
                  <text
                    x="20"
                    y={g.y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {g.val}
                  </text>
                  <line
                    x1="30"
                    y1={g.y}
                    x2="590"
                    y2={g.y}
                    className="stroke-slate-100 dark:stroke-slate-800/80 stroke-1"
                  />
                </g>
              ))}

              {/* Area fill for Template Views */}
              <path
                d="M 35 155 Q 85 130 135 140 T 235 110 T 335 65 T 435 95 T 535 80 L 585 90 L 585 185 L 35 185 Z"
                fill="url(#areaGradient)"
              />

              {/* 1. Template Views Line (Dark Green #008235) */}
              <path
                d="M 35 155 Q 85 130 135 140 T 235 110 T 335 65 T 435 95 T 535 80 L 585 90"
                fill="none"
                stroke="#008235"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* 2. Customizations Line (Medium Green #10B981) */}
              <path
                d="M 35 170 Q 85 152 135 158 T 235 140 T 335 115 T 435 130 T 535 125 L 585 130"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* 3. User Feedback Line (Light Green #6EE7B7) */}
              <path
                d="M 35 180 Q 85 172 135 174 T 235 165 T 335 155 T 435 162 T 535 158 L 585 160"
                fill="none"
                stroke="#6EE7B7"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Vertical Dashed Guide Line at Sep 09 (x=335) */}
              <line
                x1="335"
                y1="35"
                x2="335"
                y2="185"
                stroke="#008235"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Nodes at Sep 09 */}
              <circle cx="335" cy="65" r="4.5" fill="#008235" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="335" cy="115" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="335" cy="155" r="3.5" fill="#6EE7B7" stroke="#FFFFFF" strokeWidth="2" />

              {/* X-Axis dates */}
              {[
                { label: "Aug 24", x: 40 },
                { label: "Aug 28", x: 110 },
                { label: "Sep 01", x: 185 },
                { label: "Sep 05", x: 260 },
                { label: "Sep 09", x: 335 },
                { label: "Sep 13", x: 410 },
                { label: "Sep 17", x: 485 },
                { label: "Sep 21", x: 560 },
              ].map((xItem) => (
                <text
                  key={xItem.label}
                  x={xItem.x}
                  y="205"
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {xItem.label}
                </text>
              ))}
            </svg>

            {/* Active Tooltip Popover positioned at Sep 09 matching screenshot */}
            <div
              className="absolute left-[54%] top-4 -translate-x-1/2 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-lg text-[11px] space-y-1 z-10 pointer-events-none min-w-[130px]"
            >
              <div className="font-bold text-slate-800 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                Sep 09, 2026
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#008235]" />
                  <span>Template Views</span>
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">145</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span>Customizations</span>
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">82</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#6EE7B7]" />
                  <span>User Feedback</span>
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">36</span>
              </div>
            </div>
          </div>

          {/* Bottom Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#008235]" />
              <span>Template Views</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <span>Customizations</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
              <span>User Feedback</span>
            </span>
          </div>
        </div>

        {/* Quick Actions (5 Cols) matching 2x2 grid in screenshot */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                <Zap className="h-5 w-5 fill-amber-500/30 dark:fill-amber-400/30" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Quick Actions
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Frequently used administrative tasks.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAF5ED] dark:bg-emerald-950/50 text-[#008235] dark:text-emerald-400 border border-[#D1E7DD] dark:border-emerald-900/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#008235] animate-pulse" />
              Active
            </span>
          </div>

          {/* 2x2 Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto py-2">
            {/* 1. Create Template */}
            <Link
              href="/admin/templates"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-[#EAF5ED]/50 dark:hover:bg-emerald-950/30 hover:border-[#008235]/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-xs min-h-[96px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center border border-[#D1E7DD] dark:border-emerald-900/60 shrink-0 shadow-2xs group-hover:border-[#008235]/60 group-hover:scale-105 transition-all duration-200">
                  <FileText className="h-4.5 w-4.5 text-[#008235] dark:text-emerald-400" />
                </div>
                <div className="h-7 w-7 rounded-lg bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 group-hover:bg-[#EAF5ED] group-hover:text-[#008235] group-hover:border-[#008235]/30 dark:group-hover:bg-emerald-950/50 dark:group-hover:text-emerald-300 transition-all duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#008235] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  Create Template
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Add new prompt template
                </div>
              </div>
            </Link>

            {/* 2. Manage Categories */}
            <Link
              href="/admin/categories"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-[#EAF5ED]/50 dark:hover:bg-emerald-950/30 hover:border-[#008235]/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-xs min-h-[96px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center border border-[#D1E7DD] dark:border-emerald-900/60 shrink-0 shadow-2xs group-hover:border-[#008235]/60 group-hover:scale-105 transition-all duration-200">
                  <Tag className="h-4.5 w-4.5 text-[#008235] dark:text-emerald-400" />
                </div>
                <div className="h-7 w-7 rounded-lg bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 group-hover:bg-[#EAF5ED] group-hover:text-[#008235] group-hover:border-[#008235]/30 dark:group-hover:bg-emerald-950/50 dark:group-hover:text-emerald-300 transition-all duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#008235] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  Manage Categories
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Organize taxonomy &amp; tags
                </div>
              </div>
            </Link>

            {/* 3. AI Tools Master */}
            <Link
              href="/admin/tools"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-[#EAF5ED]/50 dark:hover:bg-emerald-950/30 hover:border-[#008235]/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-xs min-h-[96px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center border border-[#D1E7DD] dark:border-emerald-900/60 shrink-0 shadow-2xs group-hover:border-[#008235]/60 group-hover:scale-105 transition-all duration-200">
                  <Sliders className="h-4.5 w-4.5 text-[#008235] dark:text-emerald-400" />
                </div>
                <div className="h-7 w-7 rounded-lg bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 group-hover:bg-[#EAF5ED] group-hover:text-[#008235] group-hover:border-[#008235]/30 dark:group-hover:bg-emerald-950/50 dark:group-hover:text-emerald-300 transition-all duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#008235] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  AI Tools Master
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Configure models &amp; capabilities
                </div>
              </div>
            </Link>

            {/* 4. Reports & Analytics */}
            <Link
              href="/admin/reports"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-[#EAF5ED]/50 dark:hover:bg-emerald-950/30 hover:border-[#008235]/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-xs min-h-[96px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center border border-[#D1E7DD] dark:border-emerald-900/60 shrink-0 shadow-2xs group-hover:border-[#008235]/60 group-hover:scale-105 transition-all duration-200">
                  <BarChart3 className="h-4.5 w-4.5 text-[#008235] dark:text-emerald-400" />
                </div>
                <div className="h-7 w-7 rounded-lg bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/60 group-hover:bg-[#EAF5ED] group-hover:text-[#008235] group-hover:border-[#008235]/30 dark:group-hover:bg-emerald-950/50 dark:group-hover:text-emerald-300 transition-all duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#008235] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  Reports &amp; Analytics
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Multi-metric platform reports
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Card Footer Status */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#008235] dark:bg-emerald-400" />
              <span>Catalog synced &amp; operational</span>
            </span>
            <Link
              href="/admin/templates"
              className="text-[11px] font-semibold text-[#008235] dark:text-emerald-400 hover:underline flex items-center gap-1 group"
            >
              <span>All shortcuts</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Top Performing Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Latest actions from the platform.
                </p>
              </div>
            </div>
            <Link
              href="/admin/feedback"
              className="text-xs font-semibold text-[#008235] dark:text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {/* Activity Item 1 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    New template added
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    &ldquo;Product Launch Ad&rdquo; was created
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                <span>10 minutes ago</span>
                <span className="h-2 w-2 rounded-full bg-[#008235]" />
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    User feedback received
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    5 star review on &ldquo;Blog Generator&rdquo;
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                <span>32 minutes ago</span>
                <span className="h-2 w-2 rounded-full bg-[#008235]" />
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    Platform Reports refreshed
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Customization insights &amp; template metrics updated
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                <span>2 hours ago</span>
                <span className="h-2 w-2 rounded-full bg-[#008235]" />
              </div>
            </div>

            {/* Activity Item 4 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    Locale added
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    German (de) translation activated
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                <span>1 day ago</span>
                <span className="h-2 w-2 rounded-full bg-[#008235]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Performing Templates (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 flex items-center justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Top Performing Templates
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Most used templates this month.
                </p>
              </div>
            </div>
            <Link
              href="/admin/templates"
              className="text-xs font-semibold text-[#008235] dark:text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {[
              { rank: 1, name: "Blog Post Generator", uses: 342, barWidth: "85%", growth: "+12%" },
              { rank: 2, name: "Product Description", uses: 289, barWidth: "70%", growth: "+8%" },
              { rank: 3, name: "Social Media Post", uses: 201, barWidth: "50%", growth: "+5%" },
              { rank: 4, name: "Architectural Dusk Villa", uses: 176, barWidth: "42%", growth: "+4%" },
            ].map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono font-bold text-slate-400 dark:text-slate-500 w-3 text-center">
                    {item.rank}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate min-w-[130px]">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {item.uses} uses
                  </span>

                  {/* Horizontal mini bar */}
                  <div className="w-24 sm:w-28 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-800 hidden sm:block">
                    <div
                      className="bg-[#008235]/40 dark:bg-emerald-500/40 h-full rounded-full"
                      style={{ width: item.barWidth }}
                    />
                  </div>

                  <span className="font-mono text-xs font-semibold text-[#008235] dark:text-emerald-400 flex items-center w-12 justify-end">
                    ↗ {item.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
