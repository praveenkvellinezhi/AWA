import React from "react";
import { Search, Globe, Calendar, CheckCircle2, RotateCcw, LayoutList, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { SUPPORTED_COUNTRIES, getCountryConfig } from "@/lib/mock-data/subscriptions";

interface CountryFilterTabsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCountry: string;
  onCountryChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedBillingPeriod: string;
  onBillingPeriodChange: (val: string) => void;
  viewMode: "grouped" | "flattened";
  onViewModeChange: (val: "grouped" | "flattened") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

export function CountryFilterTabs({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedStatus,
  onStatusChange,
  selectedBillingPeriod,
  onBillingPeriodChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters,
  totalFilteredCount,
}: CountryFilterTabsProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-300/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
      {/* Top Row: Search and Country Filter Quick Chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search plans by name, slug, features, or country..."
            className="pl-10 h-10 text-xs sm:text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-zinc-800 text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-emerald-600 focus-visible:border-emerald-600 rounded-xl shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Toggle: Plan Grouped vs Country Rows Matrix */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange("grouped")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grouped"
                ? "bg-white dark:bg-[#1E293B] text-slate-950 dark:text-white shadow-xs border border-slate-300/80 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
            title="View grouped by subscription plans"
          >
            <Layers className="h-3.5 w-3.5 text-[#008235] dark:text-emerald-400" />
            <span className="hidden sm:inline">By Plan</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("flattened")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "flattened"
                ? "bg-white dark:bg-[#1E293B] text-slate-950 dark:text-white shadow-xs border border-slate-300/80 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
            title="View each country pricing configuration as an individual row"
          >
            <LayoutList className="h-3.5 w-3.5 text-[#008235] dark:text-emerald-400" />
            <span className="hidden sm:inline">Country Matrix</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Primary Filter Selectors */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
        {/* Country Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-[#008235] dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Country:</span>
          <div className="w-[195px] sm:w-[220px]">
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
                <SelectValue placeholder="Select Country">
                  {selectedCountry === "all"
                    ? "All Countries"
                    : `${selectedCountry} (${getCountryConfig(selectedCountry).currency})`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[230px]">
                <SelectItem value="all">All Countries</SelectItem>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Primary Regions</SelectLabel>
                  <SelectItem value="India">India (INR)</SelectItem>
                  <SelectItem value="UAE">UAE (AED)</SelectItem>
                  <SelectItem value="Saudi Arabia">Saudi Arabia (SAR)</SelectItem>
                  <SelectItem value="Qatar">Qatar (QAR)</SelectItem>
                  <SelectItem value="Kuwait">Kuwait (KWD)</SelectItem>
                  <SelectItem value="Oman">Oman (OMR)</SelectItem>
                  <SelectItem value="Bahrain">Bahrain (BHD)</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>International Markets</SelectLabel>
                  <SelectItem value="United States">United States (USD)</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom (GBP)</SelectItem>
                  <SelectItem value="Singapore">Singapore (SGD)</SelectItem>
                  <SelectItem value="Germany / EU">Germany / EU (EUR)</SelectItem>
                  <SelectItem value="Canada">Canada (CAD)</SelectItem>
                  <SelectItem value="Australia">Australia (AUD)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Billing Period Selector */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Billing:</span>
          <div className="w-[130px]">
            <Select value={selectedBillingPeriod} onValueChange={onBillingPeriodChange}>
              <SelectTrigger className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-2xs">
                <SelectValue placeholder="All Periods">
                  {selectedBillingPeriod === "all"
                    ? "All Periods"
                    : selectedBillingPeriod === "monthly"
                    ? "Monthly"
                    : "Lifetime"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[140px]">
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Status:</span>
          <div className="w-[130px]">
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-2xs">
                <SelectValue placeholder="All Statuses">
                  {selectedStatus === "all"
                    ? "All Statuses"
                    : selectedStatus === "active"
                    ? "Active Only"
                    : selectedStatus === "draft"
                    ? "Draft Only"
                    : "Inactive Only"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[140px]">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="draft">Draft Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters CTA */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-9 text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 border-rose-300 dark:border-rose-900/60 bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/30 gap-1.5 ml-auto shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {/* Bottom Quick Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Quick Country:
        </span>
        {[
          { label: "All", value: "all" },
          { label: "India", value: "India" },
          { label: "UAE", value: "UAE" },
          { label: "Saudi Arabia", value: "Saudi Arabia" },
          { label: "Qatar", value: "Qatar" },
          { label: "Kuwait", value: "Kuwait" },
          { label: "Oman", value: "Oman" },
          { label: "Bahrain", value: "Bahrain" },
          { label: "USA", value: "United States" },
        ].map((chip) => {
          const active = selectedCountry === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => onCountryChange(chip.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                active
                  ? "bg-[#EAF5ED] text-[#166534] border-[#BDE0CA] dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-950 hover:bg-slate-50 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
