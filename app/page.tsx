"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { CategoryCard } from "@/components/category-card";
import { LandingHero } from "@/components/landing-hero";
import { TemplateDiscoverySection } from "@/components/home/TemplateDiscoverySection";
import { Flame, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { categories, templates, isSubscriber } = useDemo();

  const handleHeroExplore = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroFree = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Curated category filter list
  const categoryNames = useMemo(() => {
    const defaultList = [
      "Image Generation",
      "Video Generation",
      "Website Making",
      "Slides & Presentations",
      "Poster & Design",
    ];
    const fromEntities = categories.map((c) => c.name);
    return Array.from(new Set([...defaultList, ...fromEntities]));
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0c0d0f] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* 1. Hero / Welcome Section */}
      <section id="hero" aria-label="Welcome to AWA">
        <LandingHero
          onExploreClick={handleHeroExplore}
          onFreeClick={handleHeroFree}
        />
      </section>

      {/* 2. Core Creation Categories */}
      <section id="disciplines" aria-label="Creative discipline categories" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
              Creative Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore the 5 Creative Tracks
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md">
            Specialized prompt engineering and tool matching tailored for each distinct creative discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 xl:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>


      {/* 4. Template Discovery (Masonry Grid & Interactive Filters) */}
      <section id="template-discovery" aria-label="Discover AI prompt templates" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-16">
        <TemplateDiscoverySection
          initialTemplates={templates}
          categories={categoryNames}
        />
      </section>

      {/* 5. Featured Flagship Walkthrough Spotlight */}
      <section id="flagship-walkthrough" aria-label="Featured flagship template walkthrough" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-20">
        <div className="dark-surface relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 dark:from-[#121316] dark:via-[#15171e] dark:to-indigo-950/30 p-6 sm:p-10 shadow-2xl overflow-hidden text-white">
          {/* Ambient Glows */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
                <span>Featured Flagship Walkthrough</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Product Photography — Handmade Candle
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                The exact showcase scenario from the official AWA product demonstration. Crafted for e-commerce shop owners needing stunning studio shots without photography equipment or prompt-writing knowledge.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/templates/template-candle-photo"
                  className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 group/btn"
                >
                  <span>Launch Flagship Demo</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-zinc-300 bg-white/10 px-3.5 py-2 rounded-full border border-white/15 backdrop-blur-xs">
                  <span className="text-zinc-400">Matched Tool:</span>
                  <strong className="text-white font-semibold">Midjourney v6.1</strong>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300 bg-white/10 px-3.5 py-2 rounded-full border border-white/15 backdrop-blur-xs">
                  <span className="text-zinc-400">Format:</span>
                  <strong className="text-white font-semibold font-mono">Aspect Ratio 4:5</strong>
                </div>
              </div>
            </div>

            {/* Quick Teaser Box */}
            <div className="lg:col-span-5">
              <Link
                href="/templates/template-candle-photo"
                className="block relative rounded-2xl border border-zinc-700/60 dark:border-zinc-800 bg-[#0e0f12] p-3 overflow-hidden group/preview hover:border-amber-500/40 transition-all shadow-xl"
              >
                <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden">
                  <img
                    src="/images/categories/image-gen.jpg"
                    alt="Product Photography — Handmade Candle"
                    className="w-full h-full object-cover object-center group-hover/preview:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
                      Image Generation
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Handmade Soy Candle on Travertine</p>
                      <p className="text-[11px] text-zinc-400 font-mono">Aspect Ratio 4:5, Hasselblad 100c</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Ready to Copy
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Production Callout */}
      <section id="production-cta" aria-label="Get started with production-ready prompts" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-16">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#121316] p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Production-ready prompts for your next build.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
              Tested on active production models. Copy directly to Cursor, v0, Midjourney, or Figma and start creating immediately.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {isSubscriber ? (
                <button
                  onClick={handleHeroExplore}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.99]"
                >
                  Explore Workflow Catalog
                </button>
              ) : (
                <Link
                  href="/unlimited"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.99]"
                >
                  Get Unlimited Access
                </Link>
              )}

              <Link
                href="/academy"
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold text-sm transition-colors"
              >
                Read Academy Playbooks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
