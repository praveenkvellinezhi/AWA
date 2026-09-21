"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import {
  User,
  CreditCard,
  Coins,
  Bookmark,
  Heart,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Sliders,
} from "lucide-react";

export default function ProfilePage() {
  const {
    role,
    user,
    setRole,
    isSubscriber,
    subscriptionPlan,
    credits,
    savedTemplateIds,
    likedTemplateIds,
    setIsDemoControlsExpanded,
  } = useDemo();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            User Profile & Subscription
          </h1>
        </div>

        <button
          onClick={() => setIsDemoControlsExpanded(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Sliders className="h-3.5 w-3.5 text-amber-400" />
          <span>Demo State Controls</span>
        </button>
      </div>

      {/* Account Identity Card */}
      <div className="p-6 rounded-2xl border border-awa-border bg-awa-card shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
            {user?.displayName ? user.displayName.charAt(0) : "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {user?.displayName || "Guest Visitor"}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {user?.email || "No email associated (Public mode)"}
            </p>
          </div>
        </div>

        {/* Role action */}
        {role !== "public" ? (
          <button
            onClick={() => setRole("public")}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out (Switch to Public)</span>
          </button>
        ) : (
          <button
            onClick={() => setRole("subscriber")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Sign In as Subscriber
          </button>
        )}
      </div>

      {/* Subscription & Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Status */}
        <div className="p-6 rounded-2xl border border-awa-border bg-awa-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-indigo-400" />
                Subscription Status
              </span>
              {isSubscriber ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white capitalize">
                {subscriptionPlan ? `${subscriptionPlan} Plan` : "Free Catalog Browsing"}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isSubscriber
                ? "Full prompt reading, copying, and tool workflow access is completely unlocked across all 5 categories."
                : "Prompts are currently gated behind the Hard Lock paywall. Subscribe to unlock full prompt text."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            {isSubscriber ? (
              <Link
                href="/unlimited"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Manage Subscription Plan</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <Link
                href="/unlimited"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Subscribe for ₹199/yr</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Customization Credits Meter */}
        <div className="p-6 rounded-2xl border border-awa-border bg-awa-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-amber-400" />
                AI Customization Balance
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                Metered per rewrite
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-300 font-mono">
                {credits}
              </span>
              <span className="text-xs text-slate-400 font-medium">Credits Remaining</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Each AI prompt rewrite (typed or voice) consumes exactly 1 credit. Reverting to original prompts never consumes credits.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/credits"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <span>Buy More Credits (from ₹49)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Device Session Limits (FEAT-026) */}
      <div className="p-6 rounded-2xl border border-awa-border bg-awa-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Device Session Limit (FEAT-026)
            </h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            1 of 2 Devices Active
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your account is authorized for up to 2 active devices simultaneously to protect your subscription.
        </p>
      </div>

      {/* Personal Collections Shortcuts */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Link
          href="/saved"
          className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Saved Templates</h4>
              <p className="text-[11px] text-slate-400">{savedTemplateIds.length} bookmarked</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </Link>

        <Link
          href="/liked"
          className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-rose-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Liked Templates</h4>
              <p className="text-[11px] text-slate-400">{likedTemplateIds.length} liked</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </Link>
      </div>
    </div>
  );
}
