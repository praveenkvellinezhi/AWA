"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  EngagementDateRange,
  EngagementSortOption,
} from "@/lib/types/template-engagement";
import {
  useEngagementSummary,
  useTemplateEngagement,
  useTemplateEngagementDetail,
  useEngagementCategories,
} from "@/lib/hooks/use-template-engagement";
import { templateEngagementService } from "@/lib/services/template-engagement-service";
import { EngagementHeader } from "@/components/admin/engagement/EngagementHeader";
import { EngagementSummaryCards } from "@/components/admin/engagement/EngagementSummaryCards";
import {
  EngagementTabs,
  EngagementActiveTab,
} from "@/components/admin/engagement/EngagementTabs";
import { EngagementFilters } from "@/components/admin/engagement/EngagementFilters";
import { EngagementTable } from "@/components/admin/engagement/EngagementTable";
import { EngagementCardList } from "@/components/admin/engagement/EngagementCardList";
import { EngagementPagination } from "@/components/admin/engagement/EngagementPagination";
import { TemplateEngagementDetail } from "@/components/admin/engagement/TemplateEngagementDetail";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function TemplateEngagementPage() {
  // 1. Date Range State
  const [dateRange, setDateRange] = useState<EngagementDateRange>("allTime");

  // 2. Active Tab State ("mostLiked" | "mostSaved" | "all")
  const [activeTab, setActiveTab] = useState<EngagementActiveTab>("mostLiked");

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userSortBy, setUserSortBy] = useState<EngagementSortOption>("likes");

  // 4. Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 5. Selected Template for Full-Page Detail View
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // 6. Refreshing indicator state
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Available categories
  const categories = useEngagementCategories();

  // Determine effective sorting based on active tab or user selection
  const effectiveSortBy: EngagementSortOption = useMemo(() => {
    if (activeTab === "mostLiked") return "likes";
    if (activeTab === "mostSaved") return "saves";
    return userSortBy;
  }, [activeTab, userSortBy]);

  // Hook 1: Summary metrics
  const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useEngagementSummary(dateRange);

  // Hook 2: Paginated & filtered template engagement
  const {
    items,
    total,
    totalPages,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchList,
  } = useTemplateEngagement({
    searchQuery,
    category: selectedCategory,
    dateRange,
    sortBy: effectiveSortBy,
    page,
    pageSize,
  });

  // Hook 3: Single template engagement detail (when selected)
  const {
    item: selectedTemplateItem,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useTemplateEngagementDetail(selectedTemplateId, dateRange);

  // Handle Tab Switch
  const handleTabChange = useCallback((tab: EngagementActiveTab) => {
    setActiveTab(tab);
    setPage(1);
    if (tab === "mostLiked") {
      setUserSortBy("likes");
    } else if (tab === "mostSaved") {
      setUserSortBy("saves");
    }
  }, []);

  // Handle Date Range Change
  const handleDateRangeChange = useCallback((range: EngagementDateRange) => {
    setDateRange(range);
    setPage(1);
  }, []);

  // Handle Manual Refresh
  const handleRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    await Promise.all([refetchSummary(), refetchList(), refetchDetail()]);
    setIsManualRefreshing(false);
  }, [refetchSummary, refetchList, refetchDetail]);

  // Handle CSV Export
  const handleExportCSV = useCallback(async () => {
    try {
      const csvString = await templateEngagementService.exportEngagementCSV({
        searchQuery,
        category: selectedCategory,
        dateRange,
        sortBy: effectiveSortBy,
      });

      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `awa-template-engagement-${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export engagement CSV. Please try again.");
    }
  }, [searchQuery, selectedCategory, dateRange, effectiveSortBy]);

  // Handle Filter Reset
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPage(1);
  }, []);

  const isFiltered = Boolean(searchQuery.trim() || selectedCategory !== "all");

  // Determine section description and highlight metric
  const sectionMeta = useMemo(() => {
    if (activeTab === "mostLiked") {
      return {
        title: "Most Liked Templates",
        description: "Templates with the highest number of user likes.",
        highlight: "likes" as const,
      };
    }
    if (activeTab === "mostSaved") {
      return {
        title: "Most Saved Templates",
        description: "Templates with the highest number of user saves.",
        highlight: "saves" as const,
      };
    }
    return {
      title: "Template Engagement",
      description: "Comprehensive engagement metrics sorted by your selected priority.",
      highlight: effectiveSortBy === "saves" ? ("saves" as const) : effectiveSortBy === "engagement" ? ("engagement" as const) : ("likes" as const),
    };
  }, [activeTab, effectiveSortBy]);

  // If a template is selected, render the dedicated full-page detail view
  if (selectedTemplateId) {
    return (
      <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
        <TemplateEngagementDetail
          item={selectedTemplateItem}
          isLoading={isDetailLoading}
          onBack={() => setSelectedTemplateId(null)}
          dateRange={dateRange}
        />
      </div>
    );
  }

  // Error State Display
  const hasError = summaryError || listError;

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background space-y-6">
      {/* 1. Header with Title & Date Range selector */}
      <EngagementHeader
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isManualRefreshing}
      />

      {/* Error Banner if service fails */}
      {hasError && (
        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Unable to load template engagement data.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <EngagementSummaryCards
        summary={summary}
        isLoading={isSummaryLoading}
      />

      {/* 3. Section Controls & Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <EngagementTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Section title & subtitle */}
        <div className="pb-1">
          <h2 className="text-base font-semibold text-foreground">
            {sectionMeta.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sectionMeta.description}
          </p>
        </div>

        {/* Search & Category & Sort Filters */}
        <EngagementFilters
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setPage(1);
          }}
          categories={categories}
          sortBy={effectiveSortBy}
          onSortChange={(s) => {
            setUserSortBy(s);
            if (activeTab !== "all") {
              setActiveTab("all");
            }
          }}
          onReset={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* 4. Desktop Table View */}
        <div className="hidden md:block">
          <EngagementTable
            items={items}
            isLoading={isListLoading}
            onSelectTemplate={(id) => setSelectedTemplateId(id)}
            highlightMetric={sectionMeta.highlight}
            startRank={(page - 1) * pageSize + 1}
            emptyStateTitle={
              isFiltered ? "No templates match your search" : "No Engagement Data"
            }
            emptyStateDescription={
              isFiltered
                ? "Try adjusting your search query or category filter."
                : "Template engagement data will appear here when users start liking or saving templates."
            }
          />
        </div>

        {/* 5. Mobile Card List View */}
        <div className="block md:hidden">
          <EngagementCardList
            items={items}
            isLoading={isListLoading}
            onSelectTemplate={(id) => setSelectedTemplateId(id)}
            startRank={(page - 1) * pageSize + 1}
            emptyStateTitle={
              isFiltered ? "No templates match your search" : "No Engagement Data"
            }
            emptyStateDescription={
              isFiltered
                ? "Try adjusting your search query or category filter."
                : "Template engagement data will appear here when users start liking or saving templates."
            }
          />
        </div>

        {/* 6. Pagination */}
        <EngagementPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isListLoading}
        />
      </div>
    </div>
  );
}
