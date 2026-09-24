"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  FileText,
  Layers,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Search,
  Download,
  Filter,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Star,
  Sparkles,
  ExternalLink,
  Eye,
  Copy,
  Lock,
  RefreshCw,
  AlertCircle,
  Check,
  Zap,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { initialCustomizationInsights } from "@/lib/mock-data/insights";
import {
  mockTemplatePerformance,
  mockModelAdoption,
  mockGuideFunnel,
  mockCategorySatisfaction,
  mockUserReviewLogs,
} from "@/lib/mock-data/reports";

type ReportTab =
  | "overview"
  | "customization"
  | "performance"
  | "models"
  | "funnel"
  | "feedback";

export default function AdminReportsPage() {
  const { categories, templates, aiTools, feedbackList } = useDemo();

  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filtered Performance Data
  const filteredPerformance = useMemo(() => {
    return mockTemplatePerformance.filter((item) => {
      const matchCat =
        selectedCategory === "all" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryTool.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filtered Customization Insights
  const filteredInsights = useMemo(() => {
    return initialCustomizationInsights.filter((item) => {
      const matchCat =
        selectedCategory === "all" ||
        item.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch =
        searchQuery === "" ||
        item.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recurringPatterns.some((p) =>
          p.patternText.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filtered AI Models
  const filteredModels = useMemo(() => {
    return mockModelAdoption.filter((item) => {
      const matchCat =
        selectedCategory === "all" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch =
        searchQuery === "" ||
        item.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Export Report action
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      // Trigger dummy download
      const reportPayload = {
        exportedAt: new Date().toISOString(),
        timeRange,
        categoryFilter: selectedCategory,
        activeReport: activeTab,
        summary: {
          totalTemplates: templates.length,
          totalCategories: categories.length,
          totalPerformanceRecords: filteredPerformance.length,
          insightsCount: filteredInsights.length,
        },
      };
      const blob = new Blob([JSON.stringify(reportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `awa-admin-report-${activeTab}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#008235] dark:text-emerald-400">
            AWA Intelligence &amp; Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 mt-1">
            <BarChart3 className="h-7 w-7 text-[#008235] dark:text-emerald-400" />
            Platform Reports &amp; Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Multi-dimensional analysis of user prompt adaptations, template performance, AI model adoption, and guide completion.
          </p>
        </div>

        {/* Global Controls & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs focus:outline-none"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="All Time">All Time</option>
          </select>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-[#008235] hover:bg-[#00702e] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            {exportSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Exported!</span>
              </>
            ) : isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Bar with Search and Category Dropdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, models, or patterns..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#008235]"
          />
        </div>

        {/* Category Pill / Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:inline" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs focus:outline-none"
          >
            <option value="all">All Disciplines</option>
            <option value="image">Image Generation</option>
            <option value="video">Video Generation</option>
            <option value="website">Website Making</option>
            <option value="slides">Slides &amp; Presentations</option>
            <option value="poster">Poster &amp; Design</option>
          </select>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "overview"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("customization")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "customization"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span>Customization Insights (FEAT-035)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {filteredInsights.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("performance")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "performance"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Template Performance</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">
            {filteredPerformance.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("models")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "models"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>AI Models Adoption</span>
        </button>

        <button
          onClick={() => setActiveTab("funnel")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "funnel"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Workflow Funnel</span>
        </button>

        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "feedback"
              ? "bg-[#008235] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>User Feedback Signals</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXECUTIVE OVERVIEW REPORT */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-bold text-[11px]">Total Prompt Copies</span>
                <span className="text-[#008235] dark:text-emerald-400 font-bold font-mono">↗ +24.1%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                38,920
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct copy-to-clipboard actions across all templates
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-bold text-[11px]">AI Customization Requests</span>
                <span className="text-[#008235] dark:text-emerald-400 font-bold font-mono">↗ +18.7%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                14,210
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Adapted rewrites powered by smart customization
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-bold text-[11px]">Guide Completion Rate</span>
                <span className="text-[#008235] dark:text-emerald-400 font-bold font-mono">↗ +6.2%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                79.4%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Subscribers executing all 8 workflow checkpoints
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-bold text-[11px]">Net User Satisfaction</span>
                <span className="text-[#008235] dark:text-emerald-400 font-bold font-mono">↗ +3.5%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                95.2%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Positive rating ratio from 1,200+ verified ratings
              </p>
            </div>
          </div>

          {/* Highlights & Quick Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Share Distribution */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Usage Volume by Creative Discipline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Engagement share across platform categories
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {timeRange}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: "Image Generation", pct: 36, color: "bg-emerald-500" },
                  { name: "Video Generation", pct: 26, color: "bg-blue-500" },
                  { name: "Website Making", pct: 20, color: "bg-cyan-500" },
                  { name: "Slides & Presentations", pct: 11, color: "bg-amber-500" },
                  { name: "Poster & Design", pct: 7, color: "bg-rose-500" },
                ].map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {cat.name}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {cat.pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Action Items based on Data */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Automated Content Intelligence Actions
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recommendations derived from recent user customization clusters
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#008235] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-slate-800 dark:text-slate-200">High Demand:</strong>{" "}
                      58 users requested dark/black onyx lighting for the Candle template.
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Authoring a dedicated dark studio variant will improve customer retention.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#008235] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-slate-800 dark:text-slate-200">Model Compatibility:</strong>{" "}
                      Flux.1 Pro prompt fidelity reached 96.2% across portrait templates.
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Recommend setting Flux.1 Pro as default model for all human aesthetic templates.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#008235] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-slate-800 dark:text-slate-200">Workflow Checkpoints:</strong>{" "}
                      Step 4 parameter configuration is the #1 drop-off point in video templates.
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Include explicit parameter cheat-sheets directly in Step 4 instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Engine Model: Claude 3.7 Sonnet + Analytics Cluster
                </span>
                <button
                  onClick={() => setActiveTab("customization")}
                  className="text-xs font-semibold text-[#008235] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore all insights</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOMIZATION INSIGHTS REPORT (FEAT-035) */}
      {/* ========================================================================= */}
      {activeTab === "customization" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/30 border border-[#D1E7DD] dark:border-emerald-500/30 flex items-center gap-3 text-xs text-[#008235] dark:text-emerald-200">
            <Lightbulb className="h-5 w-5 text-[#008235] dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Strategic Content Gap Intelligence (FEAT-035):</strong> This report groups user prompt adaptation requests into semantic clusters. If many users adapt a template in the same way, an admin can author that variant directly into the public catalog.
            </span>
          </div>

          <div className="space-y-6">
            {filteredInsights.map((insight) => (
              <div
                key={insight.templateId}
                className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#008235] dark:text-emerald-400">
                      {insight.categoryName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {insight.templateName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-300 font-bold font-mono text-xs border border-slate-200 dark:border-slate-700">
                      {insight.totalCustomizations} Total Rewrites
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Surfaced Recurring Request Clusters:
                  </span>
                  <div className="space-y-2.5">
                    {insight.recurringPatterns.map((pat, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {pat.patternText}
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-300 font-mono text-[10px] font-bold border border-[#D1E7DD] dark:border-emerald-500/30">
                              {pat.count} occurrences
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            <strong>Recommendation:</strong> {pat.actionSuggestion}
                          </p>
                        </div>

                        <Link
                          href="/admin/templates"
                          className="px-3 py-1.5 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#008235] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-800/40 text-xs font-semibold shrink-0 flex items-center gap-1 self-start sm:self-auto transition-colors"
                        >
                          <span>Author New Variant</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TEMPLATE PERFORMANCE REPORT */}
      {/* ========================================================================= */}
      {activeTab === "performance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Catalog Templates Engagement &amp; Conversion Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track prompt copy rates, full-screen inspections, and subscription unlocks per template.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Showing {filteredPerformance.length} templates
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Template &amp; Discipline</th>
                    <th className="pb-3 font-bold">Primary Model</th>
                    <th className="pb-3 font-bold text-right">Views</th>
                    <th className="pb-3 font-bold text-right">Prompt Copies</th>
                    <th className="pb-3 font-bold text-right">Unlock Conv.</th>
                    <th className="pb-3 font-bold text-right">Satisfaction</th>
                    <th className="pb-3 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredPerformance.map((tpl) => (
                    <tr
                      key={tpl.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {tpl.name}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {tpl.category}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                          {tpl.primaryTool}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {tpl.views.toLocaleString()}
                      </td>

                      <td className="py-3.5 pr-3 text-right font-mono text-[#008235] dark:text-emerald-400 font-bold">
                        {tpl.promptCopies.toLocaleString()}
                      </td>

                      <td className="py-3.5 pr-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {tpl.conversionRate}%
                      </td>

                      <td className="py-3.5 pr-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {tpl.satisfactionScore}%
                      </td>

                      <td className="py-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            tpl.status === "trending"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : tpl.status === "stable"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {tpl.status === "trending"
                            ? "Trending"
                            : tpl.status === "stable"
                            ? "Healthy"
                            : "Needs Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AI TOOLS & MODELS ADOPTION REPORT */}
      {/* ========================================================================= */}
      {activeTab === "models" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModels.map((tool) => (
              <div
                key={tool.toolId}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400">
                      {tool.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        tool.status === "recommended"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {tool.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {tool.modelName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Engine Provider: {tool.toolName}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/70 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Templates Assigned:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tool.assignedTemplatesCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Platform Market Share:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tool.marketShare}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Prompt Fidelity Score:</span>
                    <span className="font-mono font-bold text-[#008235] dark:text-emerald-400">
                      {tool.compatibilityScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Average User Rating:</span>
                    <span className="font-mono font-bold text-amber-500 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {tool.userRating} / 5.0
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Official Docs</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <Link
                    href="/admin/tools"
                    className="text-xs font-semibold text-[#008235] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Manage Tool</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. WORKFLOW STEP FUNNEL REPORT */}
      {/* ========================================================================= */}
      {activeTab === "funnel" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  8-Step Interactive Workflow Funnel &amp; Drop-off Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Measures user progression across each step of the creation guide to pinpoint friction points.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#008235] dark:text-emerald-400">
                Avg Funnel Completion: 63.5%
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {mockGuideFunnel.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-slate-500 dark:text-slate-400">
                        Avg: {step.avgTimeSpentSec}s
                      </span>
                      <span className="text-rose-500 dark:text-rose-400 font-bold">
                        Drop-off: {step.dropOffRate}%
                      </span>
                      <span className="text-[#008235] dark:text-emerald-400 font-bold">
                        {step.avgCompletionRate}% completed
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#008235] transition-all"
                      style={{ width: `${step.avgCompletionRate}%` }}
                    />
                  </div>

                  {step.commonFrictionPoint && (
                    <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-300">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong>Identified friction point:</strong> {step.commonFrictionPoint}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. USER FEEDBACK SIGNALS REPORT */}
      {/* ========================================================================= */}
      {activeTab === "feedback" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category Satisfaction Breakdown */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Satisfaction Signals by Creative Discipline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {mockCategorySatisfaction.map((cat) => (
                <div
                  key={cat.categoryName}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {cat.categoryName}
                  </span>
                  <div className="text-xl font-black text-[#008235] dark:text-emerald-400 font-mono">
                    {cat.satisfactionRate}%
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-[#008235]" /> {cat.thumbsUp}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3 text-rose-500" /> {cat.thumbsDown}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Subscriber Reviews Log */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Verified Subscriber Reviews &amp; Testimonials
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Feedback captured directly on template walkthrough pages
                </p>
              </div>
              <Link
                href="/admin/feedback"
                className="text-xs font-semibold text-[#008235] dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>All Feedback</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockUserReviewLogs.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white">{rev.userName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">({rev.userRole})</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">{rev.templateName}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                      <span className="text-amber-500 flex items-center">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500" />
                        ))}
                      </span>
                      <span>{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span className="text-[10px] text-[#008235] dark:text-emerald-400 uppercase font-bold">
                      {rev.category}
                    </span>
                    <span>{rev.helpfulCount} subscribers found this helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
