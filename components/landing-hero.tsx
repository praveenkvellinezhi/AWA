"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Zap,
  FileText,
  Users,
  Image as ImageIcon,
  Video,
  Globe,
  Presentation,
  Palette,
} from "lucide-react";

interface LandingHeroProps {
  onExploreClick?: () => void;
  onFreeClick?: () => void;
}

export function LandingHero({ onExploreClick }: LandingHeroProps) {
  const scrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-8 sm:pt-12 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-[600px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Main Value Proposition & Actions               */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-7 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-mono font-medium tracking-wide shadow-2xs">
            <span>YOUR AI CREATIVE PARTNER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.06]">
            Create Anything.<br />
            With the{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Right AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-lg leading-relaxed">
            Find the right tools, prompts, and workflows to turn your ideas into finished work.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={scrollToCatalog}
              className="px-6 py-3.5 rounded-full bg-[#3b5bfd] hover:bg-[#314ed8] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <span>Explore AI Workflows</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bottom 3 Feature Indicators */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-xs">
                <Zap className="h-4 w-4 text-amber-500 dark:text-amber-400 fill-amber-400/20" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white leading-tight">Curated</p>
                <p className="text-slate-600 dark:text-zinc-400 leading-tight">AI Tools</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-xs">
                <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white leading-tight">Step-by-Step</p>
                <p className="text-slate-600 dark:text-zinc-400 leading-tight">Guides</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-xs">
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white leading-tight">Real Results</p>
                <p className="text-slate-600 dark:text-zinc-400 leading-tight">for Creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: 3D Floating Creative Cards Composition         */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 relative w-full h-[540px] sm:h-[600px] select-none dark-surface">
          {/* Ambient Glowing Curved Ribbons & Path */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/15 via-indigo-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

          {/* SVG 3D Flow Ribbons & Connecting Gradient Curves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 600 580"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 120 180 C 180 80, 420 100, 520 220 C 620 340, 480 460, 360 480 C 240 500, 100 440, 160 320 C 200 240, 380 260, 440 340"
              stroke="url(#ribbon-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              className="opacity-75 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            />
            <defs>
              <linearGradient id="ribbon-gradient" x1="100" y1="100" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="0.5" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="1" stopColor="#EC4899" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Hand-Drawn Annotation: "Ideas" (Top Right - positioned above Website card) */}
          <div className="absolute top-[0%] right-[6%] sm:right-[10%] flex items-center gap-1.5 z-30 pointer-events-none">
            <span className="font-serif italic text-purple-300 text-sm sm:text-base tracking-wide drop-shadow-md">
              Ideas
            </span>
            <svg className="w-7 h-7 text-purple-400 -rotate-12" viewBox="0 0 40 40" fill="none">
              <path
                d="M 6 22 C 14 18, 24 12, 32 6 M 32 6 L 24 7 M 32 6 L 30 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* 1. TOP-LEFT CARD: Image                                      */}
          {/* ------------------------------------------------------------ */}
          <Link
            href="/categories/cat-image-gen"
            className="absolute left-[1%] sm:left-[3%] top-[6%] sm:top-[8%] w-[150px] sm:w-[170px] rounded-2xl overflow-hidden border border-white/15 dark:border-zinc-700/80 bg-[#121316] shadow-2xl z-10 transition-all duration-300 hover:scale-105 hover:z-30 group rotate-[-6deg]"
          >
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/10 bg-[#17191f]">
              <ImageIcon className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[11px] font-bold text-white font-sans">Image</span>
            </div>
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-zinc-900">
              <img
                src="/images/categories/image-gen.jpg"
                alt="AI Image"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </Link>

          {/* ------------------------------------------------------------ */}
          {/* 2. TOP-MIDDLE CARD: Video                                    */}
          {/* ------------------------------------------------------------ */}
          <Link
            href="/categories/cat-video-gen"
            className="absolute left-[33%] sm:left-[35%] top-[0%] sm:top-[2%] w-[155px] sm:w-[180px] rounded-2xl overflow-hidden border border-white/15 dark:border-zinc-700/80 bg-[#121316] shadow-2xl z-10 transition-all duration-300 hover:scale-105 hover:z-30 group rotate-[2deg]"
          >
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/10 bg-[#17191f]">
              <Video className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[11px] font-bold text-white font-sans">Video</span>
            </div>
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
              <img
                src="/images/categories/video-gen.jpg"
                alt="AI Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="relative z-10 w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-md">
                <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
              </div>
            </div>
          </Link>

          {/* ------------------------------------------------------------ */}
          {/* 3. TOP-RIGHT CARD: Website                                   */}
          {/* ------------------------------------------------------------ */}
          <Link
            href="/categories/cat-website-making"
            className="absolute right-[0%] sm:right-[2%] top-[12%] sm:top-[14%] w-[170px] sm:w-[195px] rounded-2xl overflow-hidden border border-white/15 dark:border-zinc-700/80 bg-[#121316] shadow-2xl z-10 transition-all duration-300 hover:scale-105 hover:z-30 group rotate-[7deg]"
          >
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/10 bg-[#17191f]">
              <Globe className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[11px] font-bold text-white font-sans">Website</span>
            </div>
            <div className="p-3 bg-[#faf9f6] dark:bg-[#15171b] text-slate-900 dark:text-white space-y-1.5">
              <div className="flex items-center gap-1 pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] font-black tracking-tight leading-tight">
                Build without limits
              </p>
              <div className="h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
                <img
                  src="/images/categories/website-making.jpg"
                  alt="Website preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Link>

          {/* ------------------------------------------------------------ */}
          {/* 4. CENTER CARD: AWA Logo & Slogan                            */}
          {/* ------------------------------------------------------------ */}
          <div className="absolute left-[24%] sm:left-[26%] top-[33%] sm:top-[35%] w-[210px] sm:w-[245px] rounded-2xl border border-white/20 dark:border-zinc-700 bg-gradient-to-br from-[#1b1e26] via-[#12141a] to-[#0a0b0e] p-6 text-center shadow-2xl z-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-wider block font-sans">
              AWA
            </span>
            <span className="text-[11px] text-zinc-400 font-mono tracking-widest uppercase block mt-1">
              Ideas into Reality
            </span>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* 5. BOTTOM-LEFT CARD: Slides                                  */}
          {/* ------------------------------------------------------------ */}
          <Link
            href="/categories/cat-slides-presentations"
            className="absolute left-[6%] sm:left-[9%] top-[54%] sm:top-[56%] w-[155px] sm:w-[180px] rounded-2xl overflow-hidden border border-white/15 dark:border-zinc-700/80 bg-[#121316] shadow-2xl z-20 transition-all duration-300 hover:scale-105 hover:z-30 group rotate-[-5deg]"
          >
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/10 bg-[#17191f]">
              <Presentation className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[11px] font-bold text-white font-sans">Slides</span>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-[#1e1f2b] to-[#12131a] text-white space-y-2 h-28 sm:h-32 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Pitch Deck
                </span>
                <p className="text-xs font-black tracking-tight mt-0.5 leading-snug">
                  Ideas to Impact
                </p>
              </div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/10" />
            </div>
          </Link>

          {/* ------------------------------------------------------------ */}
          {/* 6. BOTTOM-RIGHT CARD: Designs                                */}
          {/* ------------------------------------------------------------ */}
          <Link
            href="/categories/cat-poster-design"
            className="absolute right-[2%] sm:right-[5%] top-[51%] sm:top-[53%] w-[185px] sm:w-[215px] rounded-2xl overflow-hidden border border-white/15 dark:border-zinc-700/80 bg-[#121316] shadow-2xl z-20 transition-all duration-300 hover:scale-105 hover:z-30 group rotate-[4deg]"
          >
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/10 bg-[#17191f]">
              <Palette className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-[11px] font-bold text-white font-sans">Designs</span>
            </div>
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-zinc-900">
              <img
                src="/images/categories/poster.jpg"
                alt="AI Designs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                <span className="text-[10px] font-bold tracking-tight">LUMERA</span>
                <span className="text-[8.5px] font-mono text-zinc-400">Poster / Brand</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
