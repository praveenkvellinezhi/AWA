"use client";

import React from "react";
import { Cpu, Globe, Video, Presentation, Palette, Camera } from "lucide-react";

interface ToolItem {
  name: string;
  category: string;
  badge?: string;
}

const SUPPORTED_TOOLS: ToolItem[] = [
  { name: "v0 by Vercel", category: "Web Apps", badge: "Next.js" },
  { name: "Lovable", category: "Fullstack", badge: "React + DB" },
  { name: "Bolt.new", category: "Web Apps", badge: "Vite" },
  { name: "Midjourney v6.1", category: "Imagery", badge: "Photo" },
  { name: "Gamma", category: "Presentations", badge: "AI Decks" },
  { name: "Runway Gen-3", category: "Video", badge: "Cinematic" },
  { name: "Kling AI", category: "Video", badge: "Motion" },
  { name: "Canva Magic", category: "Design", badge: "Graphics" },
  { name: "Beautiful.ai", category: "Presentations", badge: "Smart Slides" },
  { name: "Pitch", category: "Presentations", badge: "Keynotes" },
  { name: "Ideogram 2.0", category: "Design", badge: "Typography" },
  { name: "Framer AI", category: "Websites", badge: "No-Code" },
  { name: "Luma Dream", category: "Video", badge: "3D Camera" },
  { name: "Adobe Firefly", category: "Imagery", badge: "Commercial" },
  { name: "Copilot (PPT)", category: "Presentations", badge: "Enterprise" },
];

export function ToolTicker() {
  return (
    <div className="w-full border-y border-slate-200 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-[#0e1013]/90 py-5 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-mono">
              Supported Generative AI Engines & Frameworks
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 hidden sm:inline">
            23 Pre-Tested Tools • Automatic Workflow Adapters
          </span>
        </div>

        {/* Scrollable Tool Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {SUPPORTED_TOOLS.map((tool, idx) => (
            <div
              key={`${tool.name}-${idx}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-medium shrink-0 shadow-xs hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all hover:scale-[1.02]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 dark:text-white">{tool.name}</span>
              {tool.badge && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700">
                  {tool.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
