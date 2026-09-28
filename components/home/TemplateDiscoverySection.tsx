"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Template } from "@/lib/types";
import {
  TemplateAspectRatio,
  TemplateOrientation,
  filterAndSortTemplates,
} from "@/lib/template-aspect-ratio";
import { TemplateFilterBar } from "./TemplateFilterBar";
import { MasonryGrid } from "./MasonryGrid";
import { MasonrySkeletonGrid } from "./MasonrySkeletonGrid";
import { DesignRocketCard } from "@/components/design-rocket-card";
import { Button } from "@/components/ui/button";
import { SearchX, ChevronDown } from "lucide-react";

interface TemplateDiscoverySectionProps {
  initialTemplates: Template[];
  categories: string[];
  isLoading?: boolean;
}

export function TemplateDiscoverySection({
  initialTemplates,
  categories,
  isLoading = false,
}: TemplateDiscoverySectionProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orientation, setOrientation] = useState<"all" | TemplateOrientation>("all");
  const [aspectRatio, setAspectRatio] = useState<"all" | TemplateAspectRatio>("all");
  const [sortBy, setSortBy] = useState<
    "recommended" | "popular" | "most-liked" | "most-saved" | "newest"
  >("recommended");

  // Pagination / Load more state
  const [visibleCount, setVisibleCount] = useState(20);

  // Clear all filters handler
  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
    setOrientation("all");
    setAspectRatio("all");
    setSortBy("recommended");
    setVisibleCount(20);
  }, []);

  // Filter & sort templates
  const filteredTemplates = useMemo(() => {
    return filterAndSortTemplates(initialTemplates, {
      searchQuery,
      category: selectedCategory,
      orientation,
      aspectRatio,
      sortBy,
    });
  }, [initialTemplates, searchQuery, selectedCategory, orientation, aspectRatio, sortBy]);

  // Paginated slice
  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  const hasMore = visibleCount < filteredTemplates.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  // Check if promo rocket card should be inserted (only when on All category and no search)
  const showPromoCard = selectedCategory === "All" && !searchQuery.trim() && orientation === "all" && aspectRatio === "all";

  return (
    <section id="catalog" className="w-full space-y-6 scroll-mt-24">
      {/* Filter Bar Controls */}
      <TemplateFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(20);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setVisibleCount(20);
        }}
        categories={categories}
        orientation={orientation}
        onOrientationChange={(o) => {
          setOrientation(o);
          setVisibleCount(20);
        }}
        aspectRatio={aspectRatio}
        onAspectRatioChange={(r) => {
          setAspectRatio(r);
          setVisibleCount(20);
        }}
        sortBy={sortBy}
        onSortByChange={(s) => {
          setSortBy(s);
          setVisibleCount(20);
        }}
        onClearAll={handleClearAll}
        totalResults={filteredTemplates.length}
      />

      {/* Loading State with diverse aspect-ratio skeletons (Requirement 18) */}
      {isLoading ? (
        <MasonrySkeletonGrid count={12} />
      ) : filteredTemplates.length === 0 ? (
        /* Empty State (Requirement 19) */
        <div className="py-16 px-4 text-center rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-zinc-500">
            <SearchX className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            No templates found
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try changing your search keywords or resetting your orientation and aspect ratio filters.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs font-semibold rounded-full px-4 border-slate-300 dark:border-zinc-700"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        /* Masonry Grid (Requirement 1, 2, 3, 4, 16) */
        <div className="space-y-8">
          <MasonryGrid
            templates={visibleTemplates}
            inFeedCard={showPromoCard ? <DesignRocketCard /> : null}
            inFeedIndex={2}
          />

          {/* Load More Button if results exceed initial visibleCount */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                className="h-9 px-6 text-xs font-semibold rounded-full gap-2 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-all shadow-xs"
              >
                <span>Load More Templates ({filteredTemplates.length - visibleCount} remaining)</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
