"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialBackgrounds } from "@/lib/mock-data/backgrounds";
import { Copy, Check, Maximize2, Sliders } from "lucide-react";

export default function BackgroundsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Aurora", "Cyber", "Mesh", "Particles", "Glass", "Matrix"];

  const filtered = selectedCategory === "All"
    ? initialBackgrounds
    : initialBackgrounds.filter((b) => b.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
            <span>INTERACTIVE MOTION SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Animated Backgrounds &amp; Canvas Shaders
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Production-grade CSS keyframe loops and WebGL canvas animations. Copy drop-in React and Tailwind code with a single click.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-950 text-white font-bold shadow-md"
                    : "bg-white text-slate-600 dark:bg-zinc-900 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Backgrounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bg) => (
            <div
              key={bg.id}
              className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#141518] overflow-hidden flex flex-col justify-between shadow-md dark:shadow-xl group hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
            >
              {/* Live Preview Area */}
              <div
                className={`h-52 w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${bg.gradientClass}`}
              >
                {/* Radial glow simulation */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse" />

                <div className="relative z-10 text-center p-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {bg.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 drop-shadow-md">
                    {bg.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 dark:bg-[#111215] border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Tailwind + CSS</span>
                </div>

                <button
                  onClick={() => handleCopy(bg.id, bg.codeSnippet)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-transparent shadow-xs"
                >
                  {copiedId === bg.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy CSS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
