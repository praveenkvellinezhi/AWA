"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { useDemo } from "@/lib/demo-context";

interface HardLockCardProps {
  safePreviewText?: string;
}

export function HardLockCard({ safePreviewText }: HardLockCardProps) {
  const { adminConfig } = useDemo();
  const isSafePreview = adminConfig.nonSubscriberVisibility === "safe_preview" && safePreviewText;

  return (
    <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-awa-card to-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* If Safe Preview is enabled by Admin (FEAT-039), show safe truncated snippet with blur mask */}
      {isSafePreview && (
        <div className="relative mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-400 select-none overflow-hidden">
          <p className="line-clamp-2 blur-[1.5px] opacity-60">
            {safePreviewText}
          </p>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950 flex items-end justify-center pb-1">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
              [ Safe Preview — Text Gated ]
            </span>
          </div>
        </div>
      )}

      {/* Main Lock Card Content */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        {/* Lock Icon */}
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10">
          <Lock className="h-7 w-7" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            🔒 Premium Content Gate
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Subscribe to Unlock Full Prompt
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            This finished, expert-authored prompt is protected. Subscribe to read, copy, and customize with AI.
          </p>
        </div>

        {/* Benefits Checklist - 4 columns on desktop for beautiful alignment */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Finished ready prompt</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>1-Click external copy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>AI prompt rewriter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>5 free AI credits</span>
          </div>
        </div>

        {/* Plan Pricing Pills & Primary Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/unlimited"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Unlock for ₹199 / year</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-xs text-slate-400 font-medium">
            or ₹999 lifetime access
          </span>
        </div>

        {/* Trust badge */}
        <p className="text-xs text-slate-400 pt-1">
          Zero-risk test checkout simulated • Instant unlock upon confirmation
        </p>
      </div>
    </div>
  );
}
