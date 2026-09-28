"use client";

import React, { useState } from "react";
import {
  TemplateAspectRatio,
  TemplateOrientation,
  ALL_ASPECT_RATIOS,
  ORIENTATION_OPTIONS,
} from "@/lib/template-aspect-ratio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Ratio,
  Compass,
} from "lucide-react";

export interface TemplateFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  orientation: "all" | TemplateOrientation;
  onOrientationChange: (orientation: "all" | TemplateOrientation) => void;
  aspectRatio: "all" | TemplateAspectRatio;
  onAspectRatioChange: (ratio: "all" | TemplateAspectRatio) => void;
  sortBy: "recommended" | "popular" | "most-liked" | "most-saved" | "newest";
  onSortByChange: (sort: "recommended" | "popular" | "most-liked" | "most-saved" | "newest") => void;
  onClearAll: () => void;
  totalResults: number;
}

export function TemplateFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  orientation,
  onOrientationChange,
  aspectRatio,
  onAspectRatioChange,
  sortBy,
  onSortByChange,
  onClearAll,
  totalResults,
}: TemplateFilterBarProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Count active filters (excluding default values)
  const activeFiltersCount =
    (orientation !== "all" ? 1 : 0) +
    (aspectRatio !== "all" ? 1 : 0) +
    (selectedCategory !== "All" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="w-full space-y-3.5">
      {/* Top Header Row: Section Title + Search + Mobile Filter Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Templates
            </h2>
            <Badge
              variant="secondary"
              className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-semibold"
            >
              {totalResults}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Discover production-ready prompts and workflows in any natural aspect ratio.
          </p>
        </div>

        {/* Search input + Mobile Filter Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search templates, categories, or keywords..."
              className="h-9 pl-9 pr-8 text-xs rounded-full bg-slate-100/80 dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button (visible on < md screens) */}
          <div className="block md:hidden">
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger className="h-9 px-3 text-xs rounded-full inline-flex items-center gap-1.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto px-6 py-6 bg-white dark:bg-[#121316] border-slate-200 dark:border-zinc-800">
                <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Filter Templates
                    </SheetTitle>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={onClearAll}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                </SheetHeader>

                <div className="py-5 space-y-6">
                  {/* Mobile Orientation Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ORIENTATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onOrientationChange(opt.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition-all ${
                            orientation === opt.id
                              ? "bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs"
                              : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Aspect Ratio Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => onAspectRatioChange("all")}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          aspectRatio === "all"
                            ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                            : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        All Ratios
                      </button>
                      {ALL_ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => onAspectRatioChange(ratio)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                            aspectRatio === ratio
                              ? "bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs"
                              : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Category Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Category
                    </label>
                    <div className="w-full">
                      <Select
                        value={selectedCategory}
                        onValueChange={(val) => onCategoryChange(val)}
                      >
                        <SelectTrigger className="w-full h-10 rounded-xl text-xs">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent align="left">
                          <SelectItem value="All" className="text-xs">
                            All Categories
                          </SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-xs">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mobile Sort Option */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Sort By
                    </label>
                    <div className="w-full">
                      <Select
                        value={sortBy}
                        onValueChange={(val) =>
                          onSortByChange(
                            val as "recommended" | "popular" | "most-liked" | "most-saved" | "newest"
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-10 rounded-xl text-xs">
                          <SelectValue placeholder="Sort option" />
                        </SelectTrigger>
                        <SelectContent align="left">
                          <SelectItem value="recommended" className="text-xs">
                            Recommended
                          </SelectItem>
                          <SelectItem value="popular" className="text-xs">
                            Most Popular
                          </SelectItem>
                          <SelectItem value="most-liked" className="text-xs">
                            Most Liked
                          </SelectItem>
                          <SelectItem value="most-saved" className="text-xs">
                            Most Saved
                          </SelectItem>
                          <SelectItem value="newest" className="text-xs">
                            Recently Added
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <SheetFooter className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-row gap-2">
                  <SheetClose className="w-full h-10 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer transition-colors">
                    Apply Filters ({totalResults} Results)
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Desktop Controls Bar: Quick Orientation Pills + Aspect Ratio + Category + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Quick Orientation Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {ORIENTATION_OPTIONS.map((opt) => {
            const isActive = orientation === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onOrientationChange(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-zinc-900/80 hover:bg-slate-200/80 dark:hover:bg-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Right Dropdowns: Aspect Ratio, Category, Sort */}
        <div className="hidden md:flex items-center gap-2">
          {/* Aspect Ratio Dropdown */}
          <div className="w-[145px]">
            <Select
              value={aspectRatio}
              onValueChange={(val) => onAspectRatioChange(val as "all" | TemplateAspectRatio)}
            >
              <SelectTrigger className="h-8 text-xs rounded-full border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium">
                <Ratio className="h-3 w-3 mr-1 text-slate-400 dark:text-zinc-500 shrink-0" />
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent align="right">
                <SelectItem value="all" className="text-xs font-medium">
                  All Aspect Ratios
                </SelectItem>
                {ALL_ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio} value={ratio} className="text-xs font-mono">
                    {ratio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Dropdown */}
          <div className="w-[155px]">
            <Select
              value={selectedCategory}
              onValueChange={(val) => onCategoryChange(val)}
            >
              <SelectTrigger className="h-8 text-xs rounded-full border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium">
                <Filter className="h-3 w-3 mr-1 text-slate-400 dark:text-zinc-500 shrink-0" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent align="right">
                <SelectItem value="All" className="text-xs font-medium">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-[140px]">
            <Select
              value={sortBy}
              onValueChange={(val) =>
                onSortByChange(
                  val as "recommended" | "popular" | "most-liked" | "most-saved" | "newest"
                )
              }
            >
              <SelectTrigger className="h-8 text-xs rounded-full border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium">
                <ArrowUpDown className="h-3 w-3 mr-1 text-slate-400 dark:text-zinc-500 shrink-0" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="right">
                <SelectItem value="recommended" className="text-xs">
                  Recommended
                </SelectItem>
                <SelectItem value="popular" className="text-xs">
                  Most Popular
                </SelectItem>
                <SelectItem value="most-liked" className="text-xs">
                  Most Liked
                </SelectItem>
                <SelectItem value="most-saved" className="text-xs">
                  Most Saved
                </SelectItem>
                <SelectItem value="newest" className="text-xs">
                  Recently Added
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Row (Requirement 9) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs animate-in fade-in-50 duration-150">
          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 mr-1">
            Active filters:
          </span>

          {/* Orientation Pill */}
          {orientation !== "all" && (
            <button
              type="button"
              onClick={() => onOrientationChange("all")}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Compass className="h-3 w-3" />
              <span className="capitalize">{orientation}</span>
              <X className="h-3 w-3 ml-0.5" />
            </button>
          )}

          {/* Aspect Ratio Pill */}
          {aspectRatio !== "all" && (
            <button
              type="button"
              onClick={() => onAspectRatioChange("all")}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Ratio className="h-3 w-3" />
              <span>{aspectRatio}</span>
              <X className="h-3 w-3 ml-0.5" />
            </button>
          )}

          {/* Category Pill */}
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => onCategoryChange("All")}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <span>{selectedCategory}</span>
              <X className="h-3 w-3 ml-0.5" />
            </button>
          )}

          {/* Search Query Pill */}
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="truncate max-w-[120px]">&quot;{searchQuery}&quot;</span>
              <X className="h-3 w-3 ml-0.5" />
            </button>
          )}

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white px-1.5 py-0.5 underline transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
