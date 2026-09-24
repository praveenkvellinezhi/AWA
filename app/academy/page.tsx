"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, CheckCircle2, Rocket, Clock, BookOpen, ArrowRight } from "lucide-react";

export default function AcademyPage() {
  const [enrolled, setEnrolled] = useState(false);

  const modules = [
    {
      number: "01",
      title: "Mastering AI-Powered Web Aesthetics",
      duration: "35 mins",
      lessons: 6,
      description: "Why generic AI templates fail. Learn dark-mode glassmorphism, micro-animations, and balanced typography.",
    },
    {
      number: "02",
      title: "Fullstack Scaffolding with Lovable & Bolt",
      duration: "45 mins",
      lessons: 8,
      description: "Step-by-step guidance on structuring complex apps, state managers, and database integrations in 1 prompt.",
    },
    {
      number: "03",
      title: "Precision Prompt Engineering for Midjourney v6.1",
      duration: "30 mins",
      lessons: 5,
      description: "Controlling focal lengths, volumetric light rays, studio backdrops, and photorealistic product materials.",
    },
    {
      number: "04",
      title: "Deploying AWA MCP with Cursor",
      duration: "40 mins",
      lessons: 7,
      description: "Wiring our local Model Context Protocol agent to generate real-time pages while you code in VS Code or Cursor.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
            <Rocket className="h-3.5 w-3.5 text-blue-400" />
            <span>DESIGN ROCKET ACADEMY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Learn to Design Beautiful Websites{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Using AI Tools
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing prompts. Master AI-assisted frontend engineering, design systems, and rapid prototyping with industry practitioners.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setEnrolled(true)}
              className="px-6 py-3 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-sm transition-all shadow-xl active:scale-95"
            >
              {enrolled ? "✓ You are Enrolled — Start Lesson 01" : "Start Learning for Free"}
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span>Curriculum Overview</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map((m) => (
              <div
                key={`academy-module-${m.number}`}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 space-y-3 shadow-md dark:shadow-lg hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">MODULE {m.number}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{m.duration}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{m.description}</p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <span>{m.lessons} Lessons included</span>
                  <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:underline">
                    Watch Preview <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
