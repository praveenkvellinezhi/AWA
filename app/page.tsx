"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { CategoryCard } from "@/components/category-card";
import { TemplateCard } from "@/components/template-card";
import { DesignRocketCard } from "@/components/design-rocket-card";
import { LandingHero } from "@/components/landing-hero";
import {
  Search,
  ChevronDown,
  Flame,
  Check,
  ArrowRight,
  Lock,
} from "lucide-react";

// Category tabs for AWA template catalog
const CATEGORY_TABS = [
  "All",
  "Image Generation",
  "Video Generation",
  "Website Making",
  "Slides & Presentations",
  "Poster & Design",
];

const SORT_OPTIONS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "most-liked", label: "Most Liked" },
  { id: "most-saved", label: "Most Saved" },
];

const PRICING_OPTIONS = [
  { id: "all", label: "Pricing" },
  { id: "free", label: "Free" },
  { id: "unlimited", label: "Unlimited" },
];

// Screenshot showcase order
const SHOWCASE_PRIORITY = [
  "template-consentinel",
  "template-anchor-ai",
  "template-3d-portfolio",
  "template-c-la-jewelry",
  "template-amber-editorial",
  "template-agent-wave",
  "template-subway-sanctuary",
  "template-finpulse-global",
  "template-nomad-luxe",
  "template-aura-mind",
];

export default function HomePage() {
  const { categories, templates, isSubscriber } = useDemo();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [pricingFilter, setPricingFilter] = useState("all");

  const handleHeroExplore = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroFree = () => {
    setPricingFilter("free");
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dropdown controls
  const [sortOpen, setSortOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (pricingRef.current && !pricingRef.current.contains(e.target as Node)) {
        setPricingOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and Sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // 1. Tab filtering
    if (selectedTab !== "All") {
      const lowerTab = selectedTab.toLowerCase();
      result = result.filter((t) => {
        if (selectedTab === "Image Generation") {
          return (
            t.categoryId === "cat-image-gen" ||
            t.categoryName.toLowerCase().includes("image") ||
            t.tags.some((tag) => tag.toLowerCase().includes("image"))
          );
        }
        if (selectedTab === "Video Generation") {
          return (
            t.categoryId === "cat-video-gen" ||
            t.categoryName.toLowerCase().includes("video") ||
            t.tags.some((tag) => tag.toLowerCase().includes("video"))
          );
        }
        if (selectedTab === "Website Making" || selectedTab === "Website") {
          return (
            t.categoryId === "cat-website-making" ||
            t.categoryId === "cat-web-code" ||
            t.categoryName.toLowerCase().includes("website") ||
            t.tags.some((tag) => tag.toLowerCase().includes("website") || tag.toLowerCase() === "web") ||
            t.description.toLowerCase().includes("website") ||
            t.description.toLowerCase().includes("landing page") ||
            t.categoryName === "Saas" ||
            t.categoryName === "Portfolio"
          );
        }
        if (selectedTab === "Slides & Presentations" || selectedTab === "Slides") {
          return (
            t.categoryId === "cat-slides-presentations" ||
            t.categoryName.toLowerCase().includes("slide") ||
            t.tags.some((tag) => tag.toLowerCase().includes("slide"))
          );
        }
        if (selectedTab === "Poster & Design" || selectedTab === "Poster") {
          return (
            t.categoryId === "cat-poster-design" ||
            t.categoryName.toLowerCase().includes("poster") ||
            t.tags.some((tag) => tag.toLowerCase().includes("poster"))
          );
        }
        return (
          t.tags.some((tag) => tag.toLowerCase() === lowerTab) ||
          t.categoryName.toLowerCase().includes(lowerTab) ||
          (t.subcategoryName && t.subcategoryName.toLowerCase().includes(lowerTab)) ||
          t.name.toLowerCase().includes(lowerTab)
        );
      });
    }

    // 2. Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.categoryName.toLowerCase().includes(q)
      );
    }

    // 3. Pricing filter
    if (pricingFilter === "free") {
      result = result.filter((t) => t.difficulty === "Beginner");
    } else if (pricingFilter === "unlimited") {
      result = result.filter((t) => t.difficulty !== "Beginner");
    }

    // 4. Sorting
    if (sortBy === "popular") {
      // Default: screenshot showcase templates first in exact order, followed by remainder by likes
      result.sort((a, b) => {
        const aIndex = SHOWCASE_PRIORITY.indexOf(a.id);
        const bIndex = SHOWCASE_PRIORITY.indexOf(b.id);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return b.likesCount - a.likesCount;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "most-liked") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === "most-saved") {
      result.sort((a, b) => b.savesCount - a.savesCount);
    }

    return result;
  }, [templates, selectedTab, searchQuery, pricingFilter, sortBy]);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Popular";
  const currentPricingLabel =
    PRICING_OPTIONS.find((p) => p.id === pricingFilter)?.label || "Pricing";

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 pb-24">
      {/* 1. Hero Section */}
      <LandingHero
        onExploreClick={handleHeroExplore}
        onFreeClick={handleHeroFree}
      />

      {/* 4. Core Creation Categories */}
      <section id="disciplines" className="w-full px-4 sm:px-6 lg:px-8 pt-16 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400 block mb-1">
              Core Disciplines
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

      {/* 5. Category Tabs & Controls Bar (Sticky for Template Browsing) */}
      <section id="catalog" className="sticky top-16 z-30 w-full border-y border-zinc-800/80 bg-[#0c0d0f]/95 backdrop-blur-md mt-16 scroll-mt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Horizontal Scrollable Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm font-medium hover:bg-indigo-700"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Right Dropdown Filters: Popular ▾ and Pricing ▾ */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Search Toggle button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-1.5 rounded-full transition-colors ${
                  searchOpen
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
                title="Search templates"
                aria-label="Toggle search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Popular Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => {
                    setSortOpen(!sortOpen);
                    setPricingOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900/90 hover:bg-indigo-50/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-zinc-800 shadow-sm transition-all"
                  aria-label="Sort options"
                >
                  <span>{currentSortLabel}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 dark:text-zinc-400" />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#141518] p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          sortBy === opt.id
                            ? "bg-indigo-50 dark:bg-zinc-800 text-indigo-700 dark:text-white font-bold"
                            : "text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50/50 dark:hover:bg-zinc-850"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="h-3 w-3 text-indigo-600 dark:text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Dropdown */}
              <div className="relative" ref={pricingRef}>
                <button
                  onClick={() => {
                    setPricingOpen(!pricingOpen);
                    setSortOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900/90 hover:bg-indigo-50/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-zinc-800 shadow-sm transition-all"
                  aria-label="Pricing filter"
                >
                  <span>{currentPricingLabel}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 dark:text-zinc-400" />
                </button>

                {pricingOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#141518] p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
                    {PRICING_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setPricingFilter(opt.id);
                          setPricingOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          pricingFilter === opt.id
                            ? "bg-indigo-50 dark:bg-zinc-800 text-indigo-700 dark:text-white font-bold"
                            : "text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50/50 dark:hover:bg-zinc-850"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {pricingFilter === opt.id && <Check className="h-3 w-3 text-indigo-600 dark:text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapsible Search Drawer */}
          {searchOpen && (
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs, prompts, or tools (e.g. 'ConSentinel', 'Portfolio', '3D')..."
                  className="w-full bg-[#121316] border border-zinc-700/80 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="px-3 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. 4-Column Template Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-6">
        {filteredTemplates.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-zinc-800 bg-[#121316]">
            <p className="text-base font-bold text-zinc-200">
              No templates found for &quot;{selectedTab}&quot;
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Try switching back to &quot;All&quot; or resetting your search.
            </p>
            <button
              onClick={() => {
                setSelectedTab("All");
                setSearchQuery("");
                setPricingFilter("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-slate-950 text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Show All Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTemplates.map((template, idx) => {
              // Insert the Design Rocket card at index 2 (Card 3 in Row 1) when on 'All' tab and no search
              if (selectedTab === "All" && !searchQuery && idx === 2) {
                return (
                  <React.Fragment key="in-feed-rocket">
                    <DesignRocketCard />
                    <TemplateCard template={template} />
                  </React.Fragment>
                );
              }

              return <TemplateCard key={template.id} template={template} />;
            })}
          </div>
        )}
      </section>

      {/* 6. Featured Flagship Walkthrough Spotlight */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 max-w-7xl mx-auto">
        <div className="dark-surface relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#121316] via-[#15171e] to-indigo-950/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
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
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-2 rounded-full border border-zinc-800">
                  <span>Matched Tool:</span>
                  <strong className="text-zinc-200 font-semibold">Midjourney v6.1</strong>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-2 rounded-full border border-zinc-800">
                  <span>Category:</span>
                  <strong className="text-zinc-200 font-semibold">Image Generation</strong>
                </div>
              </div>
            </div>

            {/* Quick Teaser Box */}
            <div className="lg:col-span-5">
              <Link
                href="/templates/template-candle-photo"
                className="block relative rounded-2xl border border-zinc-800 bg-[#0e0f12] p-3 overflow-hidden group/preview hover:border-amber-500/40 transition-all shadow-xl"
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
                      <p className="text-[11px] text-zinc-400 font-mono">Aspect Ratio: 4:5 • Hasselblad 100c</p>
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

      {/* 7. High-Converting Bottom CTA Banner */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 max-w-7xl mx-auto">
        <div className="dark-surface relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-[#111318] to-purple-950/60 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
              <span>START BUILDING PRODUCTION ASSETS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to 10x Your AI Creative Output?
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Join 12,000+ creators, designers, and engineers using AWA to deploy websites, generate slide decks, render cinematic video, and craft high-res graphics without prompt guesswork.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              {isSubscriber ? (
                <button
                  onClick={handleHeroExplore}
                  className="px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Workflow Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href="/unlimited"
                  className="px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <span>Get Unlimited Access</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              <Link
                href="/academy"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <span>Explore Design Rocket Academy</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
