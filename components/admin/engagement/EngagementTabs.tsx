"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, BarChart3 } from "lucide-react";

export type EngagementActiveTab = "mostLiked" | "mostSaved" | "all";

interface EngagementTabsProps {
  activeTab: EngagementActiveTab;
  onTabChange: (tab: EngagementActiveTab) => void;
  mostLikedCount?: number;
  mostSavedCount?: number;
  allCount?: number;
}

export function EngagementTabs({
  activeTab,
  onTabChange,
  mostLikedCount,
  mostSavedCount,
  allCount,
}: EngagementTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as EngagementActiveTab)}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full sm:w-auto grid-cols-3 h-9 p-1 bg-muted">
          <TabsTrigger
            value="mostLiked"
            className="flex items-center gap-1.5 text-xs font-medium px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
            <span>Most Liked</span>
            {mostLikedCount !== undefined && (
              <span className="ml-1 text-[10px] py-0.2 px-1.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                {mostLikedCount}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="mostSaved"
            className="flex items-center gap-1.5 text-xs font-medium px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Bookmark className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
            <span>Most Saved</span>
            {mostSavedCount !== undefined && (
              <span className="ml-1 text-[10px] py-0.2 px-1.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                {mostSavedCount}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="all"
            className="flex items-center gap-1.5 text-xs font-medium px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>All Templates</span>
            {allCount !== undefined && (
              <span className="ml-1 text-[10px] py-0.2 px-1.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                {allCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
