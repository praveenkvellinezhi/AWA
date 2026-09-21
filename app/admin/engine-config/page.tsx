"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Sliders, Mic, DollarSign, Gift, Coins, CheckCircle2, Save } from "lucide-react";

export default function AdminEngineConfigPage() {
  const { adminConfig, updateAdminConfig, categories } = useDemo();

  const [voiceEnabled, setVoiceEnabled] = useState(adminConfig.voiceCustomizationEnabled);
  const [spendCap, setSpendCap] = useState(adminConfig.monthlySpendCap);
  const [freeCredits, setFreeCredits] = useState(adminConfig.freeCreditsAllotment);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      voiceCustomizationEnabled: voiceEnabled,
      monthlySpendCap: Number(spendCap),
      freeCreditsAllotment: Number(freeCredits),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            FEAT-037 • Platform Controls
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 mt-1">
            <Sliders className="h-7 w-7 text-amber-400" />
            Customization Engine Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control AI spending limits, voice input availability, free starter credits, and category overrides.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Voice Input Toggle */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Voice Customization Input (FEAT-011)</h3>
            </div>
            <p className="text-xs text-slate-400">
              When enabled, subscribers see a microphone icon to dictate change requests instead of typing on mobile.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Monthly Spend Cap */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Monthly AI Spend Cap (FEAT-037)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Hard budget ceiling in USD. Once reached, customization requests are suspended platform-wide to protect unit economics.
          </p>
          <div className="flex items-center gap-3 max-w-xs pt-1">
            <span className="text-sm font-bold text-slate-300">$</span>
            <input
              type="number"
              min="10"
              max="5000"
              value={spendCap}
              onChange={(e) => setSpendCap(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <span className="text-xs text-slate-400 font-mono">USD/mo</span>
          </div>
          <p className="text-[11px] text-purple-400 font-mono">
            Current consumption this billing cycle: ${adminConfig.currentMonthlySpend.toFixed(2)} USD
          </p>
        </div>

        {/* Free Starter Credits Allotment */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Free Customization Starter Allotment (FEAT-027)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Number of free prompt rewrites granted to a subscriber immediately upon new yearly/lifetime subscription.
          </p>
          <div className="flex items-center gap-3 max-w-xs pt-1">
            <input
              type="number"
              min="0"
              max="50"
              value={freeCredits}
              onChange={(e) => setFreeCredits(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <span className="text-xs text-slate-400">Credits</span>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Configuration saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Engine Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
