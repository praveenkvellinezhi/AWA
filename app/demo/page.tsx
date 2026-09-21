"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Sparkles,
  Play,
  CheckCircle2,
  Shield,
  Lock,
  Unlock,
  CreditCard,
  Copy,
  Sliders,
  ExternalLink,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DemoGuidePage() {
  const router = useRouter();
  const { setRole, setSubscriptionPlan, setGuidedDemoStep } = useDemo();

  const steps = [
    {
      number: 1,
      title: "Browse Screen: Entry (No Auth)",
      desc: "Open AWA directly as anonymous public visitor. No login prompt or barrier. 5 core categories immediately visible.",
      role: "public",
      url: "/",
    },
    {
      number: 2,
      title: "Category & Template Selection",
      desc: "Drill into Image Generation → Product Photography → Open 'Product Photography — Handmade Candle' template.",
      role: "public",
      url: "/categories/cat-image-gen",
    },
    {
      number: 3,
      title: "Template Detail: Free Evaluation",
      desc: "Read description, tags, and preview layouts while observing locked premium prompt, AI tools, and step-by-step guide.",
      role: "public",
      url: "/templates/template-candle-photo",
    },
    {
      number: 4,
      title: "Prompt Access Gate: Hard Lock",
      desc: "Observe the Hard Lock card (11-UI-UX.md §4). Zero prompt text is rendered or leaked in the DOM.",
      role: "public",
      url: "/templates/template-candle-photo",
    },
    {
      number: 5,
      title: "Subscription Checkout Simulation",
      desc: "Select ₹199/yr plan. Observe double-tap button lockout during processing and verified payment transition.",
      role: "authenticated",
      url: "/unlimited",
    },
    {
      number: 6,
      title: "Full Prompt Delivery",
      desc: "Return to candle template. Full, unblurred, expert-written prompt is now completely readable.",
      role: "subscriber",
      url: "/templates/template-candle-photo",
    },
    {
      number: 7,
      title: "Tool Match & Sequential Usage Steps",
      desc: "Review Midjourney v6.1 recommendation and 5 concrete numbered steps for the external tool.",
      role: "subscriber",
      url: "/templates/template-candle-photo#steps-section",
    },
    {
      number: 8,
      title: "Copy Action & Feedback Signal",
      desc: "Click 'Copy Prompt'. Instant clipboard confirmation appears and feedback widget emerges.",
      role: "subscriber",
      url: "/templates/template-candle-photo",
    },
    {
      number: 9,
      title: "AI Customization with Metered Credits",
      desc: "Use typed or voice input to request black obsidian & candle flame. Observe rewrite and credit deduction.",
      role: "subscriber",
      url: "/templates/template-candle-photo#customize-section",
    },
    {
      number: 10,
      title: "Feedback Submission",
      desc: "Submit thumbs-up feedback with optional tool tag, recorded into Admin Insights telemetry.",
      role: "subscriber",
      url: "/templates/template-candle-photo#feedback-section",
    },
  ];

  const handleLaunchStep = (step: (typeof steps)[0]) => {
    setGuidedDemoStep(step.number);
    setRole(step.role as any);
    if (step.role === "subscriber") {
      setSubscriptionPlan("yearly");
    }
    router.push(step.url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold uppercase">
          <BookOpen className="h-3.5 w-3.5" />
          Demonstration Baseline (14-DEMO.md)
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AWA Live Product Walkthrough
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This demo showcases the complete product end-to-end without real backend dependencies. Use the 1-click step buttons below or the floating Demo Controls at any time.
        </p>
      </div>

      {/* Access Model Matrix Card (11-UI-UX.md §1) */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-400" />
          The 4 UI Access Levels (11-UI-UX.md §1)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-200 block">1. Public (Anon)</span>
            <p className="text-slate-400 text-[11px]">
              Browse 5 categories, search templates, read descriptions, see tools & steps. Prompt is Hard Locked.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-200 block">2. Authenticated</span>
            <p className="text-slate-400 text-[11px]">
              Same as public, plus Like and Save templates to personal collection and view account profile.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-1">
            <span className="font-bold text-indigo-300 block">3. Subscriber</span>
            <p className="text-slate-400 text-[11px]">
              Full unblurred prompt text, 1-click copy, and AI prompt customization (subject to credits).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40 space-y-1">
            <span className="font-bold text-purple-300 block">4. Administrator</span>
            <p className="text-slate-400 text-[11px]">
              Separate admin console for categories, prompts authoring, AI tool master list, insights, and configs.
            </p>
          </div>
        </div>
      </div>

      {/* 10-Step Sequential Script */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Official 10-Step Walkthrough Sequence (14-DEMO.md §6)
        </h2>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30 shrink-0 mt-0.5">
                  #{step.number}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      Role: {step.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl">{step.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleLaunchStep(step)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Jump to Step {step.number}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
