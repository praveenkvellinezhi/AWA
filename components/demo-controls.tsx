"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Shield,
  Coins,
  CreditCard,
  UserCheck,
  UserX,
  AlertTriangle,
  Play,
  CheckCircle2,
  Lock,
  Unlock,
  FastForward,
  Rewind,
  Eye,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function DemoControls() {
  const router = useRouter();
  const {
    role,
    setRole,
    subscriptionPlan,
    setSubscriptionPlan,
    credits,
    setCredits,
    addCredits,
    adminConfig,
    updateAdminConfig,
    simulateAIFailure,
    setSimulateAIFailure,
    simulatePaymentFailure,
    setSimulatePaymentFailure,
    guidedDemoStep,
    setGuidedDemoStep,
    isDemoControlsExpanded,
    setIsDemoControlsExpanded,
    resetDemoState,
    isSubscriber,
  } = useDemo();

  const [activeTab, setActiveTab] = useState<"roles" | "simulation" | "script">("roles");

  // 14-DEMO.md 10-step scenario definition
  const demoScriptSteps = [
    {
      step: 1,
      title: "Browse Screen: Entry",
      role: "public",
      url: "/",
      cue: "Presenter: 'Here's someone who wants a product photo for their online shop but has never touched an AI image tool. They open AWA — no account needed yet.'",
    },
    {
      step: 2,
      title: "Select Category & Template",
      role: "public",
      url: "/categories/cat-image-gen",
      cue: "Presenter: 'They pick Image Generation, and find a template already built for exactly this — product photography.'",
    },
    {
      step: 3,
      title: "Free Evaluation",
      role: "public",
      url: "/templates/template-candle-photo",
      cue: "Presenter: 'Before paying for anything, they can read exactly what this template is for and see it's tagged for Midjourney — so they know up front whether it's even relevant.'",
    },
    {
      step: 4,
      title: "Prompt Access Gate (Hard Lock)",
      role: "public",
      url: "/templates/template-candle-photo#prompt-section",
      cue: "Presenter: 'The actual prompt text is what AWA charges for. Right now it's hard locked — no prompt text is leaked in the DOM.'",
    },
    {
      step: 5,
      title: "Subscription Screen",
      role: "authenticated",
      url: "/unlimited",
      cue: "Presenter: 'They pick the yearly plan (₹199) and pay through Razorpay. Notice the pay button locks while processing.'",
    },
    {
      step: 6,
      title: "Full Prompt Delivery",
      role: "subscriber",
      url: "/templates/template-candle-photo",
      cue: "Presenter: 'This is the whole point of AWA. They didn't write a single word of this prompt — it's ready to use, exactly as an admin wrote it.'",
    },
    {
      step: 7,
      title: "Tool & Usage Steps",
      role: "subscriber",
      url: "/templates/template-candle-photo#steps-section",
      cue: "Presenter: 'AWA doesn't just hand over a prompt and leave them guessing — it tells them exactly which tool to use, why, and what to click.'",
    },
    {
      step: 8,
      title: "Copy Action & Feedback Prompt",
      role: "subscriber",
      url: "/templates/template-candle-photo",
      cue: "Presenter: 'One click, and the exact prompt text is on their clipboard — ready to paste into Midjourney.'",
    },
    {
      step: 9,
      title: "AI Customization with Credits",
      role: "subscriber",
      url: "/templates/template-candle-photo#customize-section",
      cue: "Presenter: 'They want black obsidian and smoke — they type or speak a request. AI rewrites the prompt, consuming 1 credit.'",
    },
    {
      step: 10,
      title: "Feedback Submission",
      role: "subscriber",
      url: "/templates/template-candle-photo#feedback-section",
      cue: "Presenter: 'They come back and leave a quick thumbs-up. That's the signal that tells the team this prompt is working.'",
    },
  ];

  const handleRunScriptStep = (stepNumber: number) => {
    const target = demoScriptSteps.find((s) => s.step === stepNumber);
    if (!target) return;

    setGuidedDemoStep(stepNumber);
    setRole(target.role as any);
    if (target.role === "subscriber" && !subscriptionPlan) {
      setSubscriptionPlan("yearly");
    }
    router.push(target.url);
  };

  return (
    <aside
      aria-label="Demo Controls"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end print:hidden pointer-events-auto"
    >
      {/* Collapsed Toggle Pill */}
      {!isDemoControlsExpanded ? (
        <button
          onClick={() => setIsDemoControlsExpanded(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 border-2 border-dashed border-amber-400 text-amber-300 font-mono text-xs font-bold shadow-2xl shadow-black/80 hover:bg-slate-800 hover:border-amber-300 hover:scale-105 transition-all"
        >
          <Sliders className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>DEMO CONTROLS</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-200 uppercase tracking-wider">
            {role}
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        </button>
      ) : (
        /* Expanded Control Panel */
        <div className="w-[360px] sm:w-[400px] rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-dashed border-amber-400/80 shadow-2xl shadow-black text-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="font-mono text-xs font-bold text-amber-300 tracking-wider uppercase">
                Demo Control Deck
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetDemoState}
                title="Reset all demo state to pristine defaults"
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={() => setIsDemoControlsExpanded(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-medium">
            <button
              onClick={() => setActiveTab("roles")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "roles"
                  ? "border-amber-400 text-amber-300 bg-amber-500/5 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Role & Credits
            </button>
            <button
              onClick={() => setActiveTab("simulation")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "simulation"
                  ? "border-amber-400 text-amber-300 bg-amber-500/5 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Simulations
            </button>
            <button
              onClick={() => setActiveTab("script")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "script"
                  ? "border-amber-400 text-amber-300 bg-amber-500/5 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Guided Script
            </button>
          </div>

          {/* Tab 1: Roles & Entitlements */}
          {activeTab === "roles" && (
            <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
              {/* Access Level Picker */}
              <div>
                <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-2 block">
                  1. Viewer Access Level (11-UI-UX.md §1)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setRole("public")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === "public"
                        ? "bg-slate-800 border-amber-400 text-amber-300 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <UserX className="h-3.5 w-3.5" />
                    Public (Anon)
                  </button>

                  <button
                    onClick={() => setRole("authenticated")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === "authenticated"
                        ? "bg-slate-800 border-amber-400 text-amber-300 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Signed In (Unsub)
                  </button>

                  <button
                    onClick={() => setRole("subscriber")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === "subscriber"
                        ? "bg-indigo-950/80 border-indigo-400 text-indigo-300 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    Subscriber
                  </button>

                  <button
                    onClick={() => setRole("admin")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      role === "admin"
                        ? "bg-purple-950/80 border-purple-400 text-purple-300 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 text-purple-400" />
                    Administrator
                  </button>
                </div>
              </div>

              {/* Subscription Plan Picker */}
              <div>
                <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-2 block">
                  2. Subscription Plan
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSubscriptionPlan("yearly")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      subscriptionPlan === "yearly"
                        ? "bg-emerald-950/80 border-emerald-400 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    ₹199 / Year
                  </button>
                  <button
                    onClick={() => setSubscriptionPlan("lifetime")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      subscriptionPlan === "lifetime"
                        ? "bg-emerald-950/80 border-emerald-400 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    ₹999 Lifetime
                  </button>
                  <button
                    onClick={() => setSubscriptionPlan(null)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      subscriptionPlan === null
                        ? "bg-rose-950/80 border-rose-400 text-rose-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Credits Adjuster */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">
                    3. AI Customization Credits
                  </label>
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {credits} remaining
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCredits(Math.max(0, credits - 1))}
                    className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setCredits(credits + 1)}
                    className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => setCredits(5)}
                    className="px-2.5 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs"
                  >
                    Set to 5
                  </button>
                  <button
                    onClick={() => setCredits(0)}
                    className="px-2.5 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs"
                  >
                    Set to 0
                  </button>
                </div>
              </div>

              {/* Theme Appearance */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-2 block">
                  4. Theme Appearance
                </label>
                <ThemeToggle variant="row" />
              </div>

              {/* Admin Console Shortcut */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsDemoControlsExpanded(false);
                    router.push("/admin");
                  }}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/40 transition-all hover:scale-[1.01] active:scale-95"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Jump to Admin Console
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Simulation Toggles */}
          {activeTab === "simulation" && (
            <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
              <p className="text-xs text-slate-400">
                Test failure resilience and paywall options deterministically during presentations:
              </p>

              {/* AI Failure Simulation */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    Simulate AI Rewrite Failure
                  </span>
                  <input
                    type="checkbox"
                    checked={simulateAIFailure}
                    onChange={(e) => setSimulateAIFailure(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Triggers &quot;We couldn&apos;t customize this prompt. [Try Again]&quot; per 11-UI-UX.md §21 without consuming credits.
                </p>
              </div>

              {/* Payment Failure Simulation */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-rose-400" />
                    Simulate Payment Failure
                  </span>
                  <input
                    type="checkbox"
                    checked={simulatePaymentFailure}
                    onChange={(e) => setSimulatePaymentFailure(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-0"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulates a Razorpay gateway failure, never optimistically unlocking content per 11-UI-UX.md §10.
                </p>
              </div>

              {/* Non-Subscriber Visibility Mode */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-indigo-400" />
                    Paywall Mode (FEAT-039)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {adminConfig.nonSubscriberVisibility === "hard_lock" ? "Hard Lock" : "Safe Preview"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => updateAdminConfig({ nonSubscriberVisibility: "hard_lock" })}
                    className={`py-1.5 px-2 rounded text-xs font-medium border ${
                      adminConfig.nonSubscriberVisibility === "hard_lock"
                        ? "bg-indigo-900/60 border-indigo-400 text-indigo-200"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    Hard Lock (Confirmed)
                  </button>
                  <button
                    onClick={() => updateAdminConfig({ nonSubscriberVisibility: "safe_preview" })}
                    className={`py-1.5 px-2 rounded text-xs font-medium border ${
                      adminConfig.nonSubscriberVisibility === "safe_preview"
                        ? "bg-indigo-900/60 border-indigo-400 text-indigo-200"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    Safe Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Guided Demo Script Player (14-DEMO.md Steps 1-10) */}
          {activeTab === "script" && (
            <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-amber-300 uppercase">
                  14-DEMO.md Presenter Script
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Step {guidedDemoStep || 1} of 10
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.max(10, (guidedDemoStep / 10) * 100)}%` }}
                />
              </div>

              {/* Step Selector Pills */}
              <div className="grid grid-cols-5 gap-1 pt-1">
                {demoScriptSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => handleRunScriptStep(s.step)}
                    className={`py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                      guidedDemoStep === s.step
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                    title={s.title}
                  >
                    #{s.step}
                  </button>
                ))}
              </div>

              {/* Current Step Detail & Speaker Cue */}
              {(() => {
                const current = demoScriptSteps.find((s) => s.step === (guidedDemoStep || 1))!;
                return (
                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/40 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        Step {current.step}: {current.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                        Role: {current.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                      &ldquo;{current.cue}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleRunScriptStep(Math.max(1, (guidedDemoStep || 1) - 1))}
                        disabled={(guidedDemoStep || 1) <= 1}
                        className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200"
                      >
                        Previous Step
                      </button>
                      <button
                        onClick={() => handleRunScriptStep(Math.min(10, (guidedDemoStep || 1) + 1))}
                        disabled={(guidedDemoStep || 1) >= 10}
                        className="flex-1 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
