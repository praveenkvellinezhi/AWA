"use client";

import React, { useState, useEffect } from "react";
import { EngagementSortOption } from "@/lib/types/template-engagement";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUpDown, Filter } from "lucide-react";

interface EngagementFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  sortBy: EngagementSortOption;
  onSortChange: (value: EngagementSortOption) => void;
  onReset?: () => void;
  isFiltered?: boolean;
}

export function EngagementFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  onReset,
  isFiltered,
}: EngagementFiltersProps) {
  // Local state for debounced search input
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search templates or category..."
          className="pl-9 pr-8 h-9 text-xs"
        />
        {localSearch && (
          <button
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category & Sorting Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Filter */}
        <div className="w-[160px] sm:w-[170px]">
          <Select
            value={selectedCategory}
            onValueChange={(val) => onCategoryChange(val)}
          >
            <SelectTrigger className="h-9 text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
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

        {/* Sort Filter */}
        <div className="w-[160px] sm:w-[175px]">
          <Select
            value={sortBy}
            onValueChange={(val) => onSortChange(val as EngagementSortOption)}
          >
            <SelectTrigger className="h-9 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="right">
              <SelectItem value="likes" className="text-xs">
                Most Likes
              </SelectItem>
              <SelectItem value="saves" className="text-xs">
                Most Saves
              </SelectItem>
              <SelectItem value="engagement" className="text-xs">
                Highest Engagement
              </SelectItem>
              <SelectItem value="recent" className="text-xs">
                Recently Updated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters button if filtered */}
        {isFiltered && onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
