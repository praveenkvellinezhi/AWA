"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Languages, Plus, CheckCircle2, Globe } from "lucide-react";

export default function AdminLanguagesPage() {
  const { adminConfig, updateAdminConfig } = useDemo();

  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newFlag, setNewFlag] = useState("🌐");

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    updateAdminConfig({
      supportedLanguages: [
        ...adminConfig.supportedLanguages,
        {
          code: newCode.trim().toLowerCase(),
          name: newName.trim(),
          flag: newFlag.trim() || "🌐",
          completeness: 15,
        },
      ],
    });

    setNewCode("");
    setNewName("");
    setNewFlag("🌐");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#15803D] dark:text-emerald-400">
            FEAT-034 • Localization Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Languages className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            Language & Translation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage supported catalog languages and track translation completeness indicators across categories and templates.
          </p>
        </div>
      </div>

      {/* Languages List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adminConfig.supportedLanguages.map((lang) => (
          <div
            key={lang.code}
            className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{lang.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    Code: {lang.code}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#15803D] dark:text-emerald-300 px-2 py-0.5 rounded-lg bg-[#EAF5ED] dark:bg-emerald-950/60 border border-[#D1E7DD] dark:border-emerald-500/30">
                {lang.completeness}% translated
              </span>
            </div>

            {/* Completeness Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className="bg-[#008235] dark:bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${lang.completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang.completeness === 100
                  ? "Fully localized base prompts & descriptions."
                  : "Automatic English fallback for untranslated prompts."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Language Form */}
      <form
        onSubmit={handleAddLanguage}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] shadow-sm space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-[#15803D] dark:text-emerald-400" />
          Add Supported Locale
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Language Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. German (Deutsch)"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">ISO Code</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. de"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Flag Emoji</label>
            <input
              type="text"
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              placeholder="🇩🇪"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs shadow-xs transition-all"
          >
            Register Locale
          </button>
        </div>
      </form>
    </div>
  );
}
