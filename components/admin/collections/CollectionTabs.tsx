"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Users, Sparkles, History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionTabsProps {
  activeTab: "admin" | "user";
  onTabChange: (tab: "admin" | "user") => void;
  adminCount: number;
  userCount: number;
  activeRecommendedCount: number;
  onOpenAuditLogs?: () => void;
  onResetDemo?: () => void;
}

export function CollectionTabs({
  activeTab,
  onTabChange,
  adminCount,
  userCount,
  activeRecommendedCount,
  onOpenAuditLogs,
  onResetDemo,
}: CollectionTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/90 dark:border-zinc-800">
      {/* 2 Clear Tabs (Requirement 6) */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as "admin" | "user")}
        className="w-full sm:w-auto"
      >
        <TabsList className="bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl h-11 border border-slate-200/80 dark:border-zinc-800 w-full sm:w-auto">
          <TabsTrigger
            value="admin"
            className="flex-1 sm:flex-initial h-9 px-4 text-xs sm:text-sm font-bold gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#16181f] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-2xs transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Admin Collections</span>
            <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
              {adminCount}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="user"
            className="flex-1 sm:flex-initial h-9 px-4 text-xs sm:text-sm font-bold gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#16181f] data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-2xs transition-all"
          >
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>User Collections</span>
            <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold">
              {userCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Right meta controls: Active Recommendations status pill & Audit & Reset */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Recommendation Feed Indicator */}

        {/* Audit Log Drawer Toggle */}
        {onOpenAuditLogs && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAuditLogs}
            className="h-8 px-2.5 text-xs rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 gap-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
            title="View client audit log history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Log</span>
          </Button>
        )}

        {/* Reset Demo Data */}
        {onResetDemo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetDemo}
            className="h-8 px-2.5 text-xs rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 gap-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
            title="Reset to default mock collections dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </Button>
        )}
      </div>
    </div>
  );
}
