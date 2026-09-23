"use client";

import React from "react";
import Link from "next/link";
import { initialCustomizationInsights } from "@/lib/mock-data/insights";
import { BarChart3, TrendingUp, Lightbulb, FileText, ArrowRight } from "lucide-react";

export default function AdminInsightsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#15803D] dark:text-emerald-400">
            FEAT-035 • Strategic Content Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <BarChart3 className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            Customization Insights Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated analysis of recorded user customization requests to identify systematic content gaps and new template candidates.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/30 border border-[#D1E7DD] dark:border-emerald-500/30 flex items-center gap-3 text-xs text-[#15803D] dark:text-emerald-200">
        <Lightbulb className="h-5 w-5 text-[#15803D] dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Product Value Note:</strong> This is AWA&apos;s highest-leverage feedback report. If many users rewrite the same template for dark lighting, an admin can author a dark variant directly into the catalog.
        </span>
      </div>

      {/* Insights Cards */}
      <div className="space-y-6">
        {initialCustomizationInsights.map((insight) => (
          <div
            key={insight.templateId}
            className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-4 shadow-xs transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#15803D] dark:text-emerald-400">
                  {insight.categoryName}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{insight.templateName}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-300 font-bold border border-slate-200 dark:border-slate-700">
                  {insight.totalCustomizations} Total Rewrites
                </span>
              </div>
            </div>

            {/* Recurring Patterns Table */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Surfaced Recurring Request Clusters:
              </span>
              <div className="space-y-2">
                {insight.recurringPatterns.map((pat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{pat.patternText}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-300 font-mono text-[10px] font-bold border border-[#D1E7DD] dark:border-emerald-500/30">
                          {pat.count} occurrences
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        <strong>Recommendation:</strong> {pat.actionSuggestion}
                      </p>
                    </div>

                    <Link
                      href="/admin/templates"
                      className="px-3 py-1.5 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#15803D] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-800/40 text-xs font-semibold shrink-0 flex items-center gap-1 self-start sm:self-auto transition-colors"
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
  );
}
