"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Eye, Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminVisibilityPage() {
  const { adminConfig, updateAdminConfig } = useDemo();

  const [visibility, setVisibility] = useState<"hard_lock" | "safe_preview">(
    adminConfig.nonSubscriberVisibility
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelect = (mode: "hard_lock" | "safe_preview") => {
    setVisibility(mode);
    updateAdminConfig({ nonSubscriberVisibility: mode });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            FEAT-039 • Monetization & Security Gating
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 mt-1">
            <Eye className="h-7 w-7 text-indigo-400" />
            Non-Subscriber Prompt Visibility Rule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure how protected prompt cards are presented to unauthorized visitors before subscription.
          </p>
        </div>
      </div>

      {/* Confirmation Callout */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
        <span>
          <strong>11-UI-UX.md §4 Confirmed Resolution:</strong> Hard Lock is the active production standard. Under Hard Lock, absolutely no prompt text reaches the browser DOM or network payload.
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Paywall visibility rule set to {visibility === "hard_lock" ? "Hard Lock" : "Safe Preview"}.</span>
        </div>
      )}

      {/* Two Modes Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Mode 1: Hard Lock (Confirmed Standard) */}
        <div
          onClick={() => handleSelect("hard_lock")}
          className={`cursor-pointer rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-all ${
            visibility === "hard_lock"
              ? "bg-gradient-to-b from-indigo-950/50 via-awa-card to-slate-950 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500"
              : "bg-awa-card border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Option A (Confirmed Standard)
              </span>
              {visibility === "hard_lock" && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  ACTIVE RULE
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-400" />
              Hard Lock Card
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Completely gates the prompt box. Renders a secure locked card with &quot;Subscribe to unlock the full expert prompt&quot; and pricing pills.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block">Security & UX Benefits:</span>
              <p>• Zero prompt text delivered in DOM (100% leak-proof)</p>
              <p>• Eliminates CSS blur inspection exploits</p>
              <p>• High-converting clear call-to-action</p>
            </div>
          </div>

          <div
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-center border transition-colors ${
              visibility === "hard_lock"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            {visibility === "hard_lock" ? "Active Standard" : "Switch to Hard Lock"}
          </div>
        </div>

        {/* Mode 2: Safe Preview */}
        <div
          onClick={() => handleSelect("safe_preview")}
          className={`cursor-pointer rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-all ${
            visibility === "safe_preview"
              ? "bg-gradient-to-b from-indigo-950/50 via-awa-card to-slate-950 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500"
              : "bg-awa-card border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Option B (Preview Alternative)
              </span>
              {visibility === "safe_preview" && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  ACTIVE RULE
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-400" />
              Safe Preview Snippet
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Displays a server-truncated 1-sentence safe excerpt with a gradient fade overlay and a lock banner below it.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block">Considerations:</span>
              <p>• Shows first 12–15 words as an appetite-whetter</p>
              <p>• Only truncated excerpt is sent, never full prompt</p>
              <p>• Reversible anytime via this toggle</p>
            </div>
          </div>

          <div
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-center border transition-colors ${
              visibility === "safe_preview"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            {visibility === "safe_preview" ? "Active Rule" : "Switch to Safe Preview"}
          </div>
        </div>
      </div>
    </div>
  );
}
