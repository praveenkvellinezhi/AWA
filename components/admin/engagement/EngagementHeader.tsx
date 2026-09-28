"use client";

import React from "react";
import { EngagementDateRange } from "@/lib/types/template-engagement";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, RefreshCw, Calendar } from "lucide-react";

interface EngagementHeaderProps {
  dateRange: EngagementDateRange;
  onDateRangeChange: (value: EngagementDateRange) => void;
  onExport: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function EngagementHeader({
  dateRange,
  onDateRangeChange,
  onExport,
  onRefresh,
  isRefreshing = false,
}: EngagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
      {/* Title & Description */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Template Engagement
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor template likes and saves to understand which templates are most popular with users.
        </p>
      </div>

      {/* Date Filter & Export Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Date Filter Dropdown */}
        <div className="w-[155px]">
          <Select
            value={dateRange}
            onValueChange={(val) => onDateRangeChange(val as EngagementDateRange)}
          >
            <SelectTrigger className="h-9 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent align="right">
              <SelectItem value="today" className="text-xs">
                Today
              </SelectItem>
              <SelectItem value="last7days" className="text-xs">
                Last 7 Days
              </SelectItem>
              <SelectItem value="last30days" className="text-xs">
                Last 30 Days
              </SelectItem>
              <SelectItem value="last90days" className="text-xs">
                Last 90 Days
              </SelectItem>
              <SelectItem value="thisYear" className="text-xs">
                This Year
              </SelectItem>
              <SelectItem value="allTime" className="text-xs">
                All Time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
            title="Refresh engagement data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </Button>
        )}

        {/* CSV Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-9 text-xs font-medium gap-1.5"
          title="Export aggregate engagement CSV"
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
}
