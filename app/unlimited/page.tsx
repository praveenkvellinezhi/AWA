"use client";

import React from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import {
  Check,
  Shield,
  Zap,
  ArrowRight,
  CreditCard,
  Lock,
  Crown,
  HelpCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function UnlimitedPage() {
  const { isSubscriber, subscriptionPlan } = useDemo();

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-purple-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold font-mono">
            <span>AWA UNLIMITED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Unlock Full Access to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 dark:from-orange-400 dark:via-rose-400 dark:to-purple-400 bg-clip-text text-transparent">
              Every Prompt &amp; Shader
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Get instant unmasked access to all 500+ production prompts, animated canvas backgrounds, private MCP endpoint, and weekly drops.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Free Starter */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-zinc-400">Free Starter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹0</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Explore catalogs, view safe preview snippets, and inspect template designs.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                  <span>Browse 5 Core Disciplines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                  <span>Public safe preview snippets</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                  <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-600 shrink-0" />
                  <span>Masked prompts &amp; AI tool links</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                  <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-600 shrink-0" />
                  <span>Locked step-by-step guides</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                  <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-600 shrink-0" />
                  <span>No MCP server API key</span>
                </li>
              </ul>
            </div>

            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-center text-xs font-bold text-slate-800 dark:text-white transition-colors block"
            >
              Current Access
            </Link>
          </div>

          {/* Card 2: Unlimited Annual (Popular) */}
          <div className="relative rounded-2xl border-2 border-rose-500/60 bg-gradient-to-b from-rose-50/70 via-white to-white dark:from-[#18151f] dark:to-[#121316] p-6 flex flex-col justify-between space-y-6 shadow-xl dark:shadow-2xl shadow-rose-950/10 dark:shadow-rose-950/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-[10px] font-black uppercase tracking-wider text-white shadow">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-300">Unlimited Annual</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹199</span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">/ year</span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 line-through ml-1.5">₹999</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300">
                Complete unrestricted access for designers, indie builders, and prompt engineers.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-800 dark:text-zinc-200 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span><strong>100% Unmasked Prompts</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span><strong>Recommended AI Tools</strong> &amp; direct launch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span><strong>Step-by-Step Guides</strong> for every template</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>One-click copy for Midjourney &amp; v0</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>MCP Server with private API key</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>Animated Backgrounds code export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>3 Device simultaneous sessions</span>
                </li>
              </ul>
            </div>

            {isSubscriber && subscriptionPlan === "yearly" ? (
              <div className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-bold text-xs text-center">
                Current Active Plan
              </div>
            ) : (
              <Link
                href="/payment?plan=yearly"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700 font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Upgrade to Annual (₹199)</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Card 3: Founder Lifetime */}
          <div className="rounded-2xl border border-purple-300 dark:border-purple-500/40 bg-white dark:bg-[#121316] p-6 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-300">Founder Lifetime</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹999</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">/ one-time</span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 line-through ml-1.5">₹2999</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Pay once, own all future updates, models, and academy playbooks forever.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Everything in Unlimited Annual</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Lifetime access with 0 renewals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Design Rocket Academy VIP pass</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Priority Discord &amp; email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Commercial rights for client sites</span>
                </li>
              </ul>
            </div>

            {isSubscriber && subscriptionPlan === "lifetime" ? (
              <div className="w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-600 dark:text-purple-300 font-bold text-xs text-center">
                Active Lifetime Pass
              </div>
            ) : (
              <Link
                href="/payment?plan=lifetime"
                className="w-full py-2.5 rounded-xl border border-purple-500/50 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-center text-xs font-bold text-purple-700 dark:text-purple-200 transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Get Lifetime Pass (₹999)</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] text-center text-xs text-slate-600 dark:text-zinc-400 shadow-sm dark:shadow-none">
          <div className="flex flex-col items-center gap-1.5">
            <Lock className="h-5 w-5 text-rose-500 dark:text-rose-400" />
            <span className="font-bold text-slate-800 dark:text-zinc-200">256-Bit SSL</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500">Bank-grade encryption</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <QrCode className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-zinc-200">Instant UPI &amp; Cards</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500">GPay, PhonePe, Cards</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-bold text-slate-800 dark:text-zinc-200">7-Day Guarantee</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500">100% money back</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <span className="font-bold text-slate-800 dark:text-zinc-200">Instant Activation</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500">Zero wait time</span>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-8 space-y-6 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200">What do I get with AWA Unlimited?</h3>
              <p className="text-slate-600 dark:text-zinc-400">
                You receive complete, unmasked access to every prompt, shader code, and step-by-step implementation guide across all 5 disciplines. Plus access to the private MCP server and background code exports.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200">What payment methods are accepted?</h3>
              <p className="text-slate-600 dark:text-zinc-400">
                We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit cards (Visa, Mastercard, RuPay, Amex), and Net Banking across all Indian banks.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200">Can I use these prompts for commercial client projects?</h3>
              <p className="text-slate-600 dark:text-zinc-400">
                Yes! All prompts and exported code can be used freely for your personal, client, or commercial software deployments with zero additional royalties.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200">How does the 7-day refund guarantee work?</h3>
              <p className="text-slate-600 dark:text-zinc-400">
                If AWA Unlimited doesn&apos;t save you countless hours of design and prompt crafting, simply contact our support within 7 days for a prompt, courteous full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
