"use client";

import React, { useState, useEffect } from "react";
import { Search, X, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportCategory, SupportPriority, SupportStatus } from "@/lib/types";

export interface SupportFilterValues {
  searchQuery: string;
  status: SupportStatus | "all";
  category: SupportCategory | "all";
  priority: SupportPriority | "all";
  assignedTo: string; // "all" | "unassigned" | admin id
}

interface SupportFiltersProps {
  filters: SupportFilterValues;
  onChange: (updated: Partial<SupportFilterValues>) => void;
  onClear: () => void;
  totalFiltered: number;
}

const CATEGORIES: { label: string; value: SupportCategory | "all" }[] = [
  { label: "All Categories", value: "all" },
  { label: "AI Generation", value: "AI Generation" },
  { label: "Template / Guide", value: "Template / Guide" },
  { label: "Billing", value: "Billing" },
  { label: "Subscription", value: "Subscription" },
  { label: "Technical", value: "Technical" },
  { label: "Account", value: "Account" },
  { label: "Bug Report", value: "Bug Report" },
  { label: "Feature Request", value: "Feature Request" },
  { label: "General", value: "General" },
  { label: "Other", value: "Other" },
];

const PRIORITIES: { label: string; value: SupportPriority | "all" }[] = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

const STATUSES: { label: string; value: SupportStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const ASSIGNEES = [
  { label: "All Assignees", value: "all" },
  { label: "Unassigned", value: "unassigned" },
  { label: "Praveen (Lead Admin)", value: "adm-1" },
  { label: "Alex (Engineering Lead)", value: "adm-2" },
  { label: "Sarah (Support Specialist)", value: "adm-3" },
];

export function SupportFilters({
  filters,
  onChange,
  onClear,
  totalFiltered,
}: SupportFiltersProps) {
  // Local search query for smooth debouncing
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);

  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        onChange({ searchQuery: localSearch });
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [localSearch, filters.searchQuery, onChange]);

  const hasActiveFilters =
    filters.searchQuery.trim().length > 0 ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.priority !== "all" ||
    filters.assignedTo !== "all";

  return (
    <div className="space-y-3 p-3 sm:p-4 rounded-2xl border border-border/80 dark:border-zinc-800 bg-card shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input (Debounced) */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search support requests (ID, user, email, subject, text)..."
            className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-background border-border/90"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onChange({ searchQuery: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="w-[130px] sm:w-[140px]">
            <Select
              value={filters.status}
              onValueChange={(val) => onChange({ status: val as SupportStatus | "all" })}
            >
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-border/90">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-xs">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div className="w-[145px] sm:w-[160px]">
            <Select
              value={filters.category}
              onValueChange={(val) => onChange({ category: val as SupportCategory | "all" })}
            >
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-border/90">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-xs">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Select */}
          <div className="w-[125px] sm:w-[135px]">
            <Select
              value={filters.priority}
              onValueChange={(val) => onChange({ priority: val as SupportPriority | "all" })}
            >
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-border/90">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To Select */}
          <div className="w-[150px] sm:w-[170px]">
            <Select
              value={filters.assignedTo}
              onValueChange={(val) => onChange({ assignedTo: val })}
            >
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-border/90">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {ASSIGNEES.map((a) => (
                  <SelectItem key={a.value} value={a.value} className="text-xs">
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClear}
              className="h-9 text-xs gap-1.5 border-border hover:bg-muted font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter status indicator count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
        <span className="font-mono text-[11px]">
          Showing <strong>{totalFiltered}</strong> matching support requests
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            • Filtered results active
          </span>
        )}
      </div>
    </div>
  );
}
