"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Globe,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Tag,
  ShieldCheck,
  LayoutList,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import {
  SubscriptionPlanItem,
  CountryPricing,
  BillingPeriod,
  PlanStatus,
} from "@/lib/types";
import {
  loadStoredSubscriptionPlans,
  saveStoredSubscriptionPlans,
  resetStoredSubscriptionPlans,
} from "@/lib/subscription-storage";
import {
  SUPPORTED_COUNTRIES,
  getCountryConfig,
  formatPriceWithCurrency,
} from "@/lib/mock-data/subscriptions";
import { StatusBadge } from "@/components/admin/subscriptions/status-badge";
import { CountryFilterTabs } from "@/components/admin/subscriptions/country-filter-tabs";
import { PlanDetailsModal } from "@/components/admin/subscriptions/plan-details-modal";
import { PlanFormModal } from "@/components/admin/subscriptions/plan-form-modal";
import { DeleteConfirmDialog } from "@/components/admin/subscriptions/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function AdminSubscriptionsPage() {
  // 1. Core State
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. Filters & View Mode State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("all");
  const [viewMode, setViewMode] = useState<"grouped" | "flattened">("grouped");

  // 3. Modals & Drawer State
  const [detailsPlan, setDetailsPlan] = useState<SubscriptionPlanItem | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<SubscriptionPlanItem | null>(null);
  const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>({});

  // 4. Toast / Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load plans from localStorage on mount
  useEffect(() => {
    const loaded = loadStoredSubscriptionPlans();
    setPlans(loaded);
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage whenever plans state changes
  const updatePlans = (newPlans: SubscriptionPlanItem[]) => {
    setPlans(newPlans);
    saveStoredSubscriptionPlans(newPlans);
  };

  // Reset to default mock plans
  const handleResetDefaults = () => {
    if (confirm("Reset subscription plans back to default initial configurations?")) {
      const reset = resetStoredSubscriptionPlans();
      setPlans(reset);
      showToast("Subscription plans reset to platform defaults.");
    }
  };

  // 5. Dashboard Summary Calculations
  const totalPlansCount = plans.length;
  const activePlansCount = useMemo(
    () => plans.filter((p) => p.status === "active").length,
    [plans]
  );

  const countriesConfiguredCount = useMemo(() => {
    const countrySet = new Set<string>();
    plans.forEach((p) => {
      p.countryPricing.forEach((cp) => {
        if (cp.country) countrySet.add(cp.country.toLowerCase());
      });
    });
    return countrySet.size;
  }, [plans]);

  const activeSubscribersCount = useMemo(() => {
    return plans.reduce((sum, p) => sum + (p.subscribersCount || 0), 0);
  }, [plans]);

  // 6. Filtering Logic
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // 1. Search filter: Matches plan name, slug, description, or features
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = plan.name.toLowerCase().includes(query);
        const matchesSlug = plan.slug.toLowerCase().includes(query);
        const matchesDesc = plan.description.toLowerCase().includes(query);
        const matchesFeatures = plan.features.some(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            (f.value && f.value.toLowerCase().includes(query))
        );
        const matchesCountry = plan.countryPricing.some((cp) =>
          cp.country.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesSlug && !matchesDesc && !matchesFeatures && !matchesCountry) {
          return false;
        }
      }

      // 2. Status filter
      if (selectedStatus !== "all" && plan.status !== selectedStatus) {
        return false;
      }

      // 3. Billing period filter
      if (selectedBillingPeriod !== "all" && plan.billingPeriod !== selectedBillingPeriod) {
        return false;
      }

      // 4. Country filter: Plan must have this country configured and active
      if (selectedCountry !== "all") {
        const hasCountry = plan.countryPricing.some(
          (cp) => cp.country.toLowerCase() === selectedCountry.toLowerCase()
        );
        if (!hasCountry) {
          return false;
        }
      }

      return true;
    });
  }, [plans, searchQuery, selectedCountry, selectedStatus, selectedBillingPeriod]);

  // Flattened Country Pricing Rows (for Country Matrix View)
  const flattenedCountryRows = useMemo(() => {
    const rows: {
      plan: SubscriptionPlanItem;
      pricing: CountryPricing;
    }[] = [];

    filteredPlans.forEach((plan) => {
      plan.countryPricing.forEach((pricing) => {
        // If country filter is applied, only include matching country rows
        if (
          selectedCountry !== "all" &&
          pricing.country.toLowerCase() !== selectedCountry.toLowerCase()
        ) {
          return;
        }
        rows.push({ plan, pricing });
      });
    });

    return rows;
  }, [filteredPlans, selectedCountry]);

  // Clear filters
  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedCountry !== "all" ||
      selectedStatus !== "all" ||
      selectedBillingPeriod !== "all"
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedStatus("all");
    setSelectedBillingPeriod("all");
  };

  // 7. Plan Actions
  const handleCreatePlan = () => {
    setEditingPlan(null);
    setFormModalOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setDetailsPlan(null);
    setFormModalOpen(true);
  };

  const handleSavePlan = (savedPlan: SubscriptionPlanItem) => {
    const exists = plans.some((p) => p.id === savedPlan.id);
    if (exists) {
      updatePlans(plans.map((p) => (p.id === savedPlan.id ? savedPlan : p)));
      showToast(`Subscription plan "${savedPlan.name}" updated successfully.`);
    } else {
      updatePlans([savedPlan, ...plans]);
      showToast(`Subscription plan "${savedPlan.name}" created successfully.`);
    }
  };

  const handleDuplicatePlan = (sourcePlan: SubscriptionPlanItem) => {
    const copyName = `${sourcePlan.name} (Copy)`;
    let copySlug = `${sourcePlan.slug}-copy`;
    // Ensure unique slug
    let counter = 1;
    while (plans.some((p) => p.slug === copySlug)) {
      counter++;
      copySlug = `${sourcePlan.slug}-copy-${counter}`;
    }

    const duplicatedPlan: SubscriptionPlanItem = {
      ...JSON.parse(JSON.stringify(sourcePlan)),
      id: `plan-${Date.now()}`,
      name: copyName,
      slug: copySlug,
      subscribersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft", // Start as draft for safety
    };

    setEditingPlan(duplicatedPlan);
    setDetailsPlan(null);
    setFormModalOpen(true);
    showToast(`Duplicating "${sourcePlan.name}". Review and save.`);
  };

  const handleToggleStatus = (plan: SubscriptionPlanItem) => {
    const newStatus: PlanStatus = plan.status === "active" ? "inactive" : "active";
    const updated = plans.map((p) =>
      p.id === plan.id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p
    );
    updatePlans(updated);
    showToast(`Plan "${plan.name}" status changed to ${newStatus}.`);
    if (detailsPlan && detailsPlan.id === plan.id) {
      setDetailsPlan({ ...detailsPlan, status: newStatus });
    }
  };

  const handleDeletePlan = (plan: SubscriptionPlanItem) => {
    setDeleteConfirmPlan(plan);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmPlan) return;
    const updated = plans.filter((p) => p.id !== deleteConfirmPlan.id);
    updatePlans(updated);
    showToast(`Plan "${deleteConfirmPlan.name}" deleted.`);
    setDeleteConfirmPlan(null);
    setDetailsPlan(null);
  };

  const toggleExpandPlan = (planId: string) => {
    setExpandedPlanIds((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-800 dark:border-slate-200 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header: Title, Description, Reset, Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15803D] dark:text-emerald-400">
              FEAT-039 • Commercial Engine
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
              Country-Independent Multi-Currency
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2.5 tracking-tight">
            <CreditCard className="h-7 w-7 text-[#008235] dark:text-emerald-400" />
            <span>Subscription Management</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl">
            Manage subscription plans, pricing, features, and country-specific availability.
            Configure localized currencies and independent prices without affecting other regions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#131B2A] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Reset plans to default catalog configuration"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <Button
            variant="forest"
            onClick={handleCreatePlan}
            className="gap-2 h-11 px-5 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.01] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subscription Plan</span>
          </Button>
        </div>
      </div>

      {/* 4 Compact Dashboard Summary Cards (Visually secondary) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Plans */}
        <div className="p-4 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs hover:shadow-sm transition-all flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-400 border border-[#BDE0CA] dark:border-emerald-900/60 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block truncate">
              Total Plans
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono leading-tight">
              {totalPlansCount} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Plans</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Plans */}
        <div className="p-4 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs hover:shadow-sm transition-all flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block truncate">
              Active Plans
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#15803D] dark:text-emerald-400 font-mono leading-tight">
              {activePlansCount} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Live</span>
            </div>
          </div>
        </div>

        {/* Card 3: Countries Configured */}
        <div className="p-4 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs hover:shadow-sm transition-all flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block truncate">
              Countries Configured
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono leading-tight">
              {countriesConfiguredCount} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Regions</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Subscribers */}
        <div className="p-4 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs hover:shadow-sm transition-all flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-900/60 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block truncate">
              Active Subscribers
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono leading-tight">
              {activeSubscribersCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Top-Level Controls Bar (Country, Status, Billing, Search, View Switcher) */}
      <CountryFilterTabs
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedBillingPeriod={selectedBillingPeriod}
        onBillingPeriodChange={setSelectedBillingPeriod}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalFilteredCount={filteredPlans.length}
      />

      {/* Active Country Filter Notification Banner */}
      {selectedCountry !== "all" && (
        <div className="p-3 rounded-2xl bg-[#EAF5ED] dark:bg-emerald-950/40 border border-[#BDE0CA] dark:border-emerald-600/50 text-xs text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#15803D] dark:text-emerald-300 shrink-0" />
            <span className="font-medium">
              Showing subscription plans configured for{" "}
              <strong className="text-[#15803D] dark:text-emerald-300 font-bold">
                {selectedCountry} ({getCountryConfig(selectedCountry).currency})
              </strong>
              . Prices and currencies below reflect this selected market.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCountry("all")}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline shrink-0"
          >
            Show All Countries &rarr;
          </button>
        </div>
      )}

      {/* SUBSCRIPTION PLAN LIST TABLE / MATRIX */}
      {filteredPlans.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/70 dark:bg-[#131B2A]/40 space-y-3">
          <CreditCard className="h-10 w-10 mx-auto text-slate-500 dark:text-slate-500" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              No matching subscription plans found
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
              No subscription plans match your active filter criteria. Try selecting another country or clearing filters.
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs mt-2 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : viewMode === "grouped" ? (
        /* MODE A: GROUPED BY PLAN TABLE VIEW */
        <div className="rounded-3xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-zinc-800 text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Plan Name</th>
                  <th className="py-3.5 px-4">Country Availability</th>
                  <th className="py-3.5 px-4">
                    {selectedCountry !== "all" ? `${selectedCountry} Price` : "Pricing Range"}
                  </th>
                  <th className="py-3.5 px-4">Billing</th>
                  <th className="py-3.5 px-4">Features</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Subscribers</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80">
                {filteredPlans.map((plan) => {
                  const isExpanded = expandedPlanIds[plan.id];
                  // If a specific country is chosen, resolve that country's pricing
                  const selectedCountryPricing =
                    selectedCountry !== "all"
                      ? plan.countryPricing.find(
                          (cp) => cp.country.toLowerCase() === selectedCountry.toLowerCase()
                        )
                      : null;

                  return (
                    <React.Fragment key={plan.id}>
                      <tr
                        onClick={() => setDetailsPlan(plan)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                      >
                        {/* 1. Plan Name & Badges */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 max-w-[200px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors text-sm">
                                {plan.name}
                              </span>
                              {plan.badge && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border border-blue-300 dark:border-blue-800 shrink-0">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block truncate">
                              slug: {plan.slug}
                            </span>
                          </div>
                        </td>

                        {/* 2. Country Availability */}
                        <td className="py-3.5 px-4">
                          {selectedCountry !== "all" && selectedCountryPricing ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">
                                {getCountryConfig(selectedCountryPricing.country).flag}
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {selectedCountryPricing.country}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                {selectedCountryPricing.currency}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 flex-wrap">
                                {plan.countryPricing.slice(0, 4).map((cp) => (
                                  <span
                                    key={cp.id}
                                    title={`${cp.country} (${cp.currency} ${cp.price})`}
                                    className="text-sm select-none"
                                  >
                                    {getCountryConfig(cp.country).flag}
                                  </span>
                                ))}
                                {plan.countryPricing.length > 4 && (
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    +{plan.countryPricing.length - 4}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandPlan(plan.id);
                                }}
                                className="text-[10px] text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                              >
                                <span>{isExpanded ? "Hide matrix" : `${plan.countryPricing.length} countries`}</span>
                                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* 3. Price & Currency */}
                        <td className="py-3.5 px-4 font-mono">
                          {selectedCountryPricing ? (
                            <div>
                              <div className="font-bold text-slate-950 dark:text-white text-sm">
                                {formatPriceWithCurrency(
                                  selectedCountryPricing.discountedPrice !== undefined
                                    ? selectedCountryPricing.discountedPrice
                                    : selectedCountryPricing.price,
                                  selectedCountryPricing.currencySymbol
                                )}
                              </div>
                              {selectedCountryPricing.discountedPrice !== undefined && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-through">
                                  {formatPriceWithCurrency(
                                    selectedCountryPricing.price,
                                    selectedCountryPricing.currencySymbol
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-slate-950 dark:text-white">
                                {plan.countryPricing.length > 0
                                  ? `${formatPriceWithCurrency(
                                      plan.countryPricing[0].price,
                                      plan.countryPricing[0].currencySymbol
                                    )}*`
                                  : "—"}
                              </span>
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-sans font-medium">
                                (varies by country)
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 4. Billing Period */}
                        <td className="py-3.5 px-4 capitalize font-semibold text-slate-900 dark:text-slate-200">
                          {plan.billingPeriod}
                        </td>

                        {/* 5. Features Count */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-zinc-700 px-2 py-0.5 rounded-lg text-[11px]">
                            <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{plan.features.filter((f) => f.enabled).length} Features</span>
                          </span>
                        </td>

                        {/* 6. Status Badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={plan.status} />
                        </td>

                        {/* 7. Subscribers */}
                        <td className="py-3.5 px-4 font-mono font-black text-slate-950 dark:text-white">
                          {plan.subscribersCount.toLocaleString()}
                        </td>

                        {/* 8. Created Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {new Date(plan.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* 9. Actions Menu */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right" className="w-48 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-zinc-800 shadow-xl">
                              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono font-bold">
                                Manage Plan
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setDetailsPlan(plan)}
                                className="gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditPlan(plan)}
                                className="gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                <Edit className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Edit Plan</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicatePlan(plan)}
                                className="gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                <Copy className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                <span>Duplicate Plan</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(plan)}
                                className="gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                <span>
                                  {plan.status === "active" ? "Deactivate Plan" : "Activate Plan"}
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-200 dark:bg-zinc-800" />
                              <DropdownMenuItem
                                onClick={() => handleDeletePlan(plan)}
                                className="gap-2 text-rose-700 dark:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Plan</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>

                      {/* Expandable Country Pricing Rows inside Grouped View */}
                      {isExpanded && (
                        <tr className="bg-slate-50 dark:bg-slate-950/80 border-y border-slate-300 dark:border-zinc-800">
                          <td colSpan={9} className="p-4 pl-10">
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                                Independent Country Pricing Configurations for {plan.name}:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                {plan.countryPricing.map((cp) => (
                                  <div
                                    key={cp.id}
                                    className="p-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">
                                        {getCountryConfig(cp.country).flag}
                                      </span>
                                      <div>
                                        <span className="font-bold block text-slate-950 dark:text-white">
                                          {cp.country}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
                                          {cp.currency} • {cp.tax || "Included"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right font-mono font-bold">
                                      <span className="text-emerald-800 dark:text-emerald-400 text-sm">
                                        {formatPriceWithCurrency(cp.price, cp.currencySymbol)}
                                      </span>
                                      <span className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">
                                        {cp.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Subscription Cards (Grouped Mode) */}
          <div className="divide-y divide-slate-200 dark:divide-zinc-800/80 md:hidden">
            {filteredPlans.map((plan) => {
              const selectedCountryPricing =
                selectedCountry !== "all"
                  ? plan.countryPricing.find(
                      (cp) => cp.country.toLowerCase() === selectedCountry.toLowerCase()
                    )
                  : plan.countryPricing[0];

              return (
                <div
                  key={plan.id}
                  onClick={() => setDetailsPlan(plan)}
                  className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-950 dark:text-white text-base">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">
                        slug: {plan.slug}
                      </span>
                    </div>

                    <StatusBadge status={plan.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-normal line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Primary Row: Price and Country */}
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-zinc-800 flex items-center justify-between">
                    {selectedCountryPricing ? (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-950 dark:text-white block">
                            {selectedCountryPricing.country}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                            {selectedCountryPricing.currency}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {plan.countryPricing.length} Countries
                      </span>
                    )}

                    <div className="text-right">
                      {selectedCountryPricing && (
                        <span className="text-base font-black font-mono text-slate-950 dark:text-white">
                          {formatPriceWithCurrency(
                            selectedCountryPricing.discountedPrice || selectedCountryPricing.price,
                            selectedCountryPricing.currencySymbol
                          )}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 block capitalize font-medium">
                        / {plan.billingPeriod}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions Toolbar */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                      {plan.subscribersCount.toLocaleString()} subscribers
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="h-8 px-2.5 text-xs font-semibold border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicatePlan(plan)}
                        className="h-8 px-2.5 text-xs font-semibold border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Copy className="h-3 w-3 mr-1 text-purple-600 dark:text-purple-400" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODE B: COUNTRY ROWS MATRIX VIEW (As requested in prompt example) */
        <div className="rounded-3xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-zinc-800 text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Currency</th>
                  <th className="py-3.5 px-4">Billing Period</th>
                  <th className="py-3.5 px-4">Features</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Subscribers</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80 font-mono">
                {flattenedCountryRows.map(({ plan, pricing }) => {
                  const countryConfig = getCountryConfig(pricing.country);

                  return (
                    <tr
                      key={`${plan.id}-${pricing.id}`}
                      onClick={() => setDetailsPlan(plan)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    >
                      {/* Plan Name */}
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>{plan.name}</span>
                          {plan.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 dark:text-slate-100">
                        <span>{pricing.country}</span>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3.5 px-4 font-bold text-slate-950 dark:text-white">
                        {formatPriceWithCurrency(
                          pricing.discountedPrice !== undefined ? pricing.discountedPrice : pricing.price,
                          pricing.currencySymbol
                        )}
                        {pricing.discountedPrice !== undefined && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 line-through block font-normal">
                            {formatPriceWithCurrency(pricing.price, pricing.currencySymbol)}
                          </span>
                        )}
                      </td>

                      {/* Currency */}
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {pricing.currency}
                      </td>

                      {/* Billing Period */}
                      <td className="py-3.5 px-4 font-sans capitalize text-slate-800 dark:text-slate-200 font-semibold">
                        {pricing.billingPeriod || plan.billingPeriod}
                      </td>

                      {/* Features */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          {plan.features.filter((f) => f.enabled).length}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={pricing.status === "active" ? plan.status : "inactive"}
                          size="sm"
                        />
                      </td>

                      {/* Subscribers */}
                      <td className="py-3.5 px-4 font-black text-slate-950 dark:text-white">
                        {plan.subscribersCount.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditPlan(plan)}
                            className="p-1 rounded-lg text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
                            title="Edit plan"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicatePlan(plan)}
                            className="p-1 rounded-lg text-slate-600 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
                            title="Duplicate plan"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PLAN DETAILS MODAL */}
      <PlanDetailsModal
        plan={detailsPlan}
        isOpen={Boolean(detailsPlan)}
        onClose={() => setDetailsPlan(null)}
        onEdit={handleEditPlan}
        onDuplicate={handleDuplicatePlan}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeletePlan}
      />

      {/* PLAN CREATE / EDIT MODAL (6-STEP WIZARD) */}
      <PlanFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        initialPlan={editingPlan}
        existingPlans={plans}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        plan={deleteConfirmPlan}
        isOpen={Boolean(deleteConfirmPlan)}
        onClose={() => setDeleteConfirmPlan(null)}
        onConfirm={handleConfirmDelete}
        mode="delete"
      />
    </div>
  );
}
