"use client";

import React, { useState, useEffect } from "react";
import { Search, X, RotateCcw } from "lucide-react";
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
  { label: "Billing", value: "Billing" },
  { label: "Subscription", value: "Subscription" },
  { label: "Technical", value: "Technical" },
  { label: "Account", value: "Account" },
  { label: "Template / Guide", value: "Template / Guide" },
  { label: "Bug Report", value: "Bug Report" },
  { label: "Feature Request", value: "Feature Request" },
  { label: "General", value: "General" },
  { label: "Other", value: "Other" },
];

const PRIORITIES: { label: string; value: SupportPriority | "all" }[] = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "Urgent", value: "urgent" },
];

const STATUSES: { label: string; value: SupportStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const ASSIGNEES = [
  { label: "All Assignees", value: "all" },
  { label: "Unassigned", value: "unassigned" },
  { label: "Praveen (Lead Admin)", value: "adm-1" },
  { label: "Amina", value: "adm-2" },
  { label: "Rohit", value: "adm-3" },
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
    <div className="space-y-3 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
        {/* Search Input (Debounced) */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search support requests (ID, user, email, subject, text)..."
            className="pl-10 pr-8 h-10 sm:h-11 text-xs sm:text-sm bg-white dark:bg-[#131418] border-slate-200/90 dark:border-zinc-800 rounded-xl shadow-2xs placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onChange({ searchQuery: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters in same row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="w-[130px] sm:w-[140px]">
            <Select
              value={filters.status}
              onValueChange={(val) => onChange({ status: val as SupportStatus | "all" })}
            >
              <SelectTrigger className="h-10 sm:h-11 text-xs font-medium bg-white dark:bg-[#131418] border-slate-200/90 dark:border-zinc-800 rounded-xl shadow-2xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
              <SelectTrigger className="h-10 sm:h-11 text-xs font-medium bg-white dark:bg-[#131418] border-slate-200/90 dark:border-zinc-800 rounded-xl shadow-2xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
              <SelectTrigger className="h-10 sm:h-11 text-xs font-medium bg-white dark:bg-[#131418] border-slate-200/90 dark:border-zinc-800 rounded-xl shadow-2xs">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To Select */}
          <div className="w-[140px] sm:w-[155px]">
            <Select
              value={filters.assignedTo}
              onValueChange={(val) => onChange({ assignedTo: val })}
            >
              <SelectTrigger className="h-10 sm:h-11 text-xs font-medium bg-white dark:bg-[#131418] border-slate-200/90 dark:border-zinc-800 rounded-xl shadow-2xs">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
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
              className="h-10 sm:h-11 text-xs gap-1.5 border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium text-slate-600 dark:text-zinc-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Matching Count text exactly like screenshot */}
      <div className="text-xs text-slate-500 dark:text-zinc-400">
        <span>Showing <strong className="font-bold text-slate-900 dark:text-white">{totalFiltered}</strong> matching support requests</span>
      </div>
    </div>
  );
}
