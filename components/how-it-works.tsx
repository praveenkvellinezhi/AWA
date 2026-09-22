"use client";

import React from "react";
import {
  Layers,
  Cpu,
  CheckCircle2,
  Rocket,
  ArrowRight,
  Code2,
  FileDown,
  Workflow,
} from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  details: string[];
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Choose Your Creative Track",
    description:
      "Explore 150+ production-grade templates across Websites, Slide Decks, Videos, Posters, and Commercial Photography.",
    icon: Layers,
    badge: "Specialized Tracks",
    details: [
      "Filter by difficulty, pricing, and category",
      "Tailored for real-world projects & startups",
      "Includes asset blueprints and wireframes",
    ],
  },
  {
    number: "02",
    title: "AI Engine Matching & Rationale",
    description:
      "Zero guesswork. Every workflow is benchmark-matched to the optimal generative AI engine with clear technical rationales.",
    icon: Cpu,
    badge: "23 AI Engines",
    details: [
      "v0 & Lovable for interactive React apps",
      "Gamma & Pitch for presentation decks",
      "Runway & Kling for cinematic motion",
    ],
  },
  {
    number: "03",
    title: "Interactive Step-by-Step Guide",
    description:
      "Execute like a pro with tool-specific visual steps, prompt parameters, lighting tokens, and camera directives.",
    icon: Workflow,
    badge: "Checklist Workflow",
    details: [
      "Pre-tested prompt directives & token weights",
      "Required assets checklist & dimensions",
      "Interactive completion tracking",
    ],
  },
  {
    number: "04",
    title: "Export Code & Production Assets",
    description:
      "Take your outputs straight to production with clean React/Tailwind source code, PPTX decks, or 4K video renders.",
    icon: Rocket,
    badge: "Zero Lock-In",
    details: [
      "Full ownership of prompts & code exports",
      "Deploy directly to Vercel or GitHub",
      "Export high-res vector & print formats",
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-[#0b0c0e]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono uppercase tracking-widest">
            <span>How AWA Works</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            From Blank Prompt to{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Production Output
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Generic AI prompts fail because tools operate differently. AWA gives you the exact prompt architecture, matched engine, and step-by-step guidance for reliable results.
          </p>
        </div>

        {/* 4-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {STEPS.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all hover:scale-[1.01] group"
              >
                <div className="space-y-4">
                  {/* Top Row: Step Number + Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                      STEP {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 border border-indigo-100/80 dark:border-zinc-750 flex items-center justify-center text-indigo-600 dark:text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-2xs">
                      <IconComp className="h-4 w-4 text-indigo-600 dark:text-zinc-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Checklist Details */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-zinc-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
