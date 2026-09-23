"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { CreditCard, Save, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function AdminPaymentsPage() {
  const { adminConfig, updateAdminConfig } = useDemo();

  const [rzpKey, setRzpKey] = useState(adminConfig.razorpayConfig.keyId);
  const [rzpMode, setRzpMode] = useState(adminConfig.razorpayConfig.mode);
  const [stripeKey, setStripeKey] = useState(adminConfig.stripeConfig.publishableKey);
  const [stripeMode, setStripeMode] = useState(adminConfig.stripeConfig.mode);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      razorpayConfig: {
        ...adminConfig.razorpayConfig,
        keyId: rzpKey,
        mode: rzpMode,
      },
      stripeConfig: {
        ...adminConfig.stripeConfig,
        publishableKey: stripeKey,
        mode: stripeMode,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15803D] dark:text-emerald-400">
            FEAT-038 • Payment Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <CreditCard className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            Payment Gateway Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure launch payment provider (Razorpay) and live second adapter (Stripe) credentials and webhooks.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#F2F8F4] dark:bg-emerald-950/20 border border-[#D1E7DD] dark:border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[#15803D] dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Dual-Provider Architecture (10-TECH-STACK.md §10):</strong> Both Razorpay and Stripe adapters share a unified transaction interface. Client-side callbacks are never trusted alone.
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Razorpay Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Razorpay Gateway (Launch Default)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold">
                ACTIVE
              </span>
            </div>
            <select
              value={rzpMode}
              onChange={(e) => setRzpMode(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            >
              <option value="test">Sandbox / Test Mode</option>
              <option value="live">Production Live</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Key ID</label>
              <input
                type="text"
                value={rzpKey}
                onChange={(e) => setRzpKey(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Webhook Endpoint</label>
              <input
                type="text"
                readOnly
                value={adminConfig.razorpayConfig.webhookUrl}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-500 dark:text-slate-400 select-all"
              />
            </div>
          </div>
        </div>

        {/* Stripe Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Stripe Gateway Adapter</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAF5ED] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-500/30 font-bold">
                STANDBY ADAPTER
              </span>
            </div>
            <select
              value={stripeMode}
              onChange={(e) => setStripeMode(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            >
              <option value="test">Test Mode</option>
              <option value="live">Live Mode</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Publishable Key</label>
              <input
                type="text"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Webhook Endpoint</label>
              <input
                type="text"
                readOnly
                value={adminConfig.stripeConfig.webhookUrl}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-500 dark:text-slate-400 select-all"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Gateway settings updated!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Provider Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
