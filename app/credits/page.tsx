"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Coins,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function CreditsPage() {
  const router = useRouter();
  const { credits, addCredits, adminConfig } = useDemo();

  const [selectedPackId, setSelectedPackId] = useState<string>("pack-25");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const packs = adminConfig.creditPacks;
  const selectedPack = packs.find((p) => p.id === selectedPackId) || packs[1];

  const handlePurchase = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSuccessMessage(null);

    // Simulate 1.2s checkout
    await new Promise((resolve) => setTimeout(resolve, 1200));

    addCredits(selectedPack.credits);
    setIsProcessing(false);
    setSuccessMessage(`Successfully purchased ${selectedPack.credits} AI customization credits!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono uppercase">
          <Coins className="h-3.5 w-3.5" />
          AI Customization Metering (FEAT-028)
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Purchase Customization Credits
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Base prompt reading and copying are always unlimited with your subscription. Credits are only consumed when you ask our AI engine to rewrite or adapt a prompt.
        </p>

        {/* Current Balance */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-bold text-amber-300 font-mono">
            <Coins className="h-4 w-4 text-amber-400" />
            Current Balance: {credits} Credits
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center text-xs text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
          <Link
            href="/templates/template-candle-photo"
            className="ml-2 font-bold underline text-emerald-200 hover:text-white"
          >
            Return to Template
          </Link>
        </div>
      )}

      {/* Credit Pack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map((pack) => {
          const isSelected = selectedPackId === pack.id;
          return (
            <div
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`cursor-pointer rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                isSelected
                  ? "bg-gradient-to-b from-indigo-950/40 via-awa-card to-slate-950 border-indigo-500 shadow-xl shadow-indigo-500/15 scale-105"
                  : "bg-awa-card border-awa-border hover:border-slate-700"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {pack.label}
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{pack.credits}</span>
                  <span className="text-xs text-slate-400 font-medium">Credits</span>
                </div>

                <div className="text-lg font-black text-amber-300">
                  ₹{pack.priceInr} INR
                </div>

                <p className="text-xs text-slate-400">
                  ₹{(pack.priceInr / pack.credits).toFixed(1)} per prompt customization rewrite.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center border transition-colors ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  {isSelected ? "Selected" : "Select Pack"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Summary Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Pack Selected:</span>
          <strong className="text-white">
            {selectedPack.credits} Credits ({selectedPack.label})
          </strong>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Amount to Pay:</span>
          <strong className="text-amber-300 text-base font-mono">
            ₹{selectedPack.priceInr} INR
          </strong>
        </div>

        <div className="pt-2">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>Simulating Payment Handshake...</span>
              </>
            ) : (
              <>
                <span>Complete Purchase of ₹{selectedPack.priceInr}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Credits never expire during an active subscription. Metered per successful rewrite (FEAT-015).
        </p>
      </div>
    </div>
  );
}
