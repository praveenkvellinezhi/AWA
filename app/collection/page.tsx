"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { TemplateCard } from "@/components/template-card";
import {
  Bookmark,
  Heart,
  Search,
  ChevronRight,
  Compass,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

export default function CollectionPage() {
  const { templates, likedTemplateIds, savedTemplateIds } = useDemo();
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "liked">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "alphabetical">("recent");

  // Derived lists
  const likedTemplates = useMemo(
    () => templates.filter((t) => likedTemplateIds.includes(t.id)),
    [templates, likedTemplateIds]
  );

  const savedTemplates = useMemo(
    () => templates.filter((t) => savedTemplateIds.includes(t.id)),
    [templates, savedTemplateIds]
  );

  const allCollectionTemplates = useMemo(() => {
    const allIds = Array.from(new Set([...likedTemplateIds, ...savedTemplateIds]));
    return templates.filter((t) => allIds.includes(t.id));
  }, [templates, likedTemplateIds, savedTemplateIds]);

  // Filtered and sorted collection
  const displayedTemplates = useMemo(() => {
    let list: typeof templates = [];

    if (activeTab === "saved") {
      list = [...savedTemplates];
    } else if (activeTab === "liked") {
      list = [...likedTemplates];
    } else {
      list = [...allCollectionTemplates];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.categoryName.toLowerCase().includes(q)
      );
    }

    if (sortBy === "popular") {
      list.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [activeTab, savedTemplates, likedTemplates, allCollectionTemplates, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-zinc-200 font-semibold">My Collection</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Personal Creative Vault
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-850 text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                {allCollectionTemplates.length} Items
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Saved &amp; Liked Templates</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
              Your private collection of bookmarked UI templates and appreciated creative prompts.
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Compass className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>Browse Catalog</span>
          </Link>
        </div>

        {/* Control Bar: Tabs + Search + Sort */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#121316] p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-850"
              }`}
            >
              All ({allCollectionTemplates.length})
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "saved"
                  ? "bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-sm font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-850"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
              <span>Saved ({savedTemplates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("liked")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "liked"
                  ? "bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 shadow-sm font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-850"
              }`}
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" />
              <span>Liked ({likedTemplates.length})</span>
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 dark:focus:border-zinc-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-zinc-400 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 dark:focus:border-zinc-700 cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="popular">Most Liked</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {displayedTemplates.length === 0 ? (
          <div className="p-16 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-[#121316]/50 text-center space-y-4 max-w-lg mx-auto shadow-sm dark:shadow-none">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center mx-auto text-slate-500 dark:text-zinc-500">
              {activeTab === "saved" ? (
                <Bookmark className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              ) : activeTab === "liked" ? (
                <Heart className="h-8 w-8 text-rose-500 dark:text-rose-400" />
              ) : (
                <Bookmark className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {searchQuery
                  ? "No matching templates found in your collection"
                  : activeTab === "saved"
                  ? "No saved templates yet"
                  : activeTab === "liked"
                  ? "No liked templates yet"
                  : "Your collection is empty"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? "Try resetting your search query to see all items."
                  : "Browse the catalog and click the bookmark or heart icon on any template to add it to your personal collection."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <span>Explore Template Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedTemplates.map((template) => (
              <TemplateCard key={`col-page-${template.id}`} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
