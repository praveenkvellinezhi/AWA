"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DesignRocketCard() {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111215] p-6 shadow-xl overflow-hidden min-h-[280px]">
      {/* Radiant Electric Blue/Cyan Glow on center-right */}
      <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500/35 via-cyan-400/20 to-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white font-sans">
          <span>🚀</span>
          <span className="italic tracking-widest text-zinc-100">DESIGN ROCKET</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 my-auto py-4">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
          Learn to design beautiful Websites using AI tools.
        </h3>
        <p className="mt-2 text-sm text-zinc-400 font-medium">
          Master AI-powered <span className="text-zinc-200">design</span>
        </p>
      </div>

      {/* Bottom CTA Button */}
      <div className="relative z-10 pt-2">
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95 group"
        >
          <span>Start Learning for Free</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
