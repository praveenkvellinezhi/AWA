"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Terminal, Save, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminAIInstructionPage() {
  const { adminConfig, updateAdminConfig } = useDemo();

  const [instruction, setInstruction] = useState(adminConfig.standingSystemInstruction);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({ standingSystemInstruction: instruction });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#15803D] dark:text-emerald-400">
            FEAT-036 • AI System Prompt
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Terminal className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            AI Rewriting Standing Instruction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure the standing system instruction sent to the AI rewriting service alongside user customization requests.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/20 border border-[#D1E7DD] dark:border-emerald-500/30 text-xs text-[#15803D] dark:text-emerald-200 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[#15803D] dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Security Boundary (09-AI-DESIGN.md §3):</strong> This standing instruction is trusted system configuration. User requests are treated as untrusted input and delimited separately to prevent system prompt injection.
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
            Standing System Prompt (Plain Text)
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {instruction.length} characters
          </span>
        </div>

        <textarea
          required
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={12}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-[#15803D] dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> System instruction saved!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Subsequent customization requests will use this updated directive.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save System Instruction</span>
          </button>
        </div>
      </form>
    </div>
  );
}
