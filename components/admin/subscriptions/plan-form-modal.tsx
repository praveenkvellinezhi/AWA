"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  SubscriptionPlanItem,
  CountryPricing,
  PlanFeature,
  BillingPeriod,
  PlanStatus,
} from "@/lib/types";
import {
  SUPPORTED_COUNTRIES,
  getCountryConfig,
} from "@/lib/mock-data/subscriptions";
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

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: SubscriptionPlanItem) => void;
  initialPlan?: SubscriptionPlanItem | null;
  existingPlans: SubscriptionPlanItem[];
}

interface CurrencyDisplayInfo {
  code: string;
  symbol: string;
  displayText: string;
}

// Pre-defined country options
const PRIMARY_REGIONS = [
  { name: "India", label: "India" },
  { name: "United Arab Emirates", label: "United Arab Emirates" },
  { name: "Saudi Arabia", label: "Saudi Arabia" },
  { name: "Qatar", label: "Qatar" },
  { name: "Kuwait", label: "Kuwait" },
  { name: "Oman", label: "Oman" },
  { name: "Bahrain", label: "Bahrain" },
];

const INTERNATIONAL_REGIONS = [
  { name: "United States", label: "United States" },
  { name: "United Kingdom", label: "United Kingdom" },
  { name: "Singapore", label: "Singapore" },
  { name: "Germany / EU", label: "Germany / EU" },
  { name: "Canada", label: "Canada" },
  { name: "Australia", label: "Australia" },
];

function getCountryCurrencyInfo(countryName: string): CurrencyDisplayInfo {
  const norm = countryName.trim().toLowerCase();
  if (norm === "india") return { code: "INR", symbol: "₹", displayText: "INR (₹)" };
  if (norm === "uae" || norm === "united arab emirates") return { code: "AED", symbol: "د.إ", displayText: "AED (د.إ)" };
  if (norm === "saudi arabia") return { code: "SAR", symbol: "ر.س", displayText: "SAR (ر.س)" };
  if (norm === "qatar") return { code: "QAR", symbol: "ر.ق", displayText: "QAR (ر.ق)" };
  if (norm === "kuwait") return { code: "KWD", symbol: "د.ك", displayText: "KWD (د.ك)" };
  if (norm === "oman") return { code: "OMR", symbol: "ر.ع.", displayText: "OMR (ر.ع.)" };
  if (norm === "bahrain") return { code: "BHD", symbol: ".د.ب", displayText: "BHD (.د.ب)" };
  if (norm === "united states") return { code: "USD", symbol: "$", displayText: "USD ($)" };
  if (norm === "united kingdom") return { code: "GBP", symbol: "£", displayText: "GBP (£)" };
  if (norm === "singapore") return { code: "SGD", symbol: "S$", displayText: "SGD (S$)" };
  if (norm.includes("germany") || norm.includes("eu")) return { code: "EUR", symbol: "€", displayText: "EUR (€)" };
  if (norm === "canada") return { code: "CAD", symbol: "CA$", displayText: "CAD (CA$)" };
  if (norm === "australia") return { code: "AUD", symbol: "A$", displayText: "AUD (A$)" };

  const cfg = getCountryConfig(countryName);
  return {
    code: cfg.currency,
    symbol: cfg.currencySymbol.trim(),
    displayText: `${cfg.currency} (${cfg.currencySymbol.trim()})`,
  };
}

export function PlanFormModal({
  isOpen,
  onClose,
  onSave,
  initialPlan,
  existingPlans,
}: PlanFormModalProps) {
  const isEditing = Boolean(initialPlan && initialPlan.id);

  // 1. Plan Information State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 2. Country & Pricing State (Single Country)
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  // 3. Status State
  const [status, setStatus] = useState<PlanStatus>("active");

  // 4. Validation & Loading State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize state when modal opens or initialPlan changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialPlan) {
      setName(initialPlan.name || "");
      setDescription(initialPlan.description || "");
      setStatus(initialPlan.status === "inactive" ? "inactive" : "active");

      if (initialPlan.countryPricing && initialPlan.countryPricing.length > 0) {
        const first = initialPlan.countryPricing[0];
        setCountry(first.country === "UAE" ? "United Arab Emirates" : first.country);
        setPrice(first.price.toString());
        setBillingPeriod(first.billingPeriod || initialPlan.billingPeriod || "monthly");
      } else {
        setCountry("");
        setPrice("");
        setBillingPeriod(initialPlan.billingPeriod || "monthly");
      }
    } else {
      // Create Mode Defaults
      setName("");
      setDescription("");
      setCountry("");
      setPrice("");
      setBillingPeriod("monthly");
      setStatus("active");
    }

    setErrors({});
    setIsSaving(false);
  }, [isOpen, initialPlan]);

  if (!isOpen) return null;

  // Country Selection Change Handler
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);

    // Pre-fill default price for selected region if currently empty
    if (!price) {
      const cfg = getCountryConfig(newCountry);
      if (cfg.currency === "INR") setPrice("999");
      else if (cfg.currency === "AED" || cfg.currency === "SAR") setPrice("59");
      else if (cfg.currency === "KWD") setPrice("5");
      else if (cfg.currency === "USD") setPrice("19");
      else setPrice("29");
    }

    if (errors.country) {
      const nextErrors = { ...errors };
      delete nextErrors.country;
      setErrors(nextErrors);
    }
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    if (errors.price) {
      const nextErrors = { ...errors };
      delete nextErrors.price;
      setErrors(nextErrors);
    }
  };

  // Form Submit Handler
  const handleSavePlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: Record<string, string> = {};

    // 1. Validate Plan Name
    if (!name.trim()) {
      newErrors.name = "Plan Name is required.";
    }

    // 2. Validate Country
    if (!country || !country.trim()) {
      newErrors.country = "Please select a country.";
    }

    // 3. Validate Price
    if (country) {
      const numPrice = Number(price);
      if (price === "" || isNaN(numPrice) || numPrice < 0) {
        newErrors.price = "Price is required and must be 0 or higher.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const cfg = getCountryConfig(country);
      const singleCountryPricing: CountryPricing = {
        id: `cp-${Date.now()}`,
        country,
        countryCode: cfg.code,
        currency: cfg.currency,
        currencySymbol: cfg.currencySymbol,
        price: Number(price) || 0,
        billingPeriod,
        tax: cfg.defaultTax || "Tax included",
        status: "active",
      };

      // Preserve existing features or provide standard base access features
      const planFeatures: PlanFeature[] =
        initialPlan?.features && initialPlan.features.length > 0
          ? initialPlan.features
          : [
              { id: "feat-1", name: "Full platform access", enabled: true },
              { id: "feat-2", name: "Unlimited workflow access", enabled: true },
            ];

      const generatedSlug =
        initialPlan?.slug ||
        name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
        `plan-${Date.now()}`;

      // Update or set country pricing
      let updatedCountryPricing: CountryPricing[] = [];
      if (initialPlan?.countryPricing && initialPlan.countryPricing.length > 0) {
        const matchIdx = initialPlan.countryPricing.findIndex(
          (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        if (matchIdx >= 0) {
          updatedCountryPricing = initialPlan.countryPricing.map((c, i) =>
            i === matchIdx ? singleCountryPricing : c
          );
        } else {
          updatedCountryPricing = [singleCountryPricing, ...initialPlan.countryPricing];
        }
      } else {
        updatedCountryPricing = [singleCountryPricing];
      }

      const finalPlan: SubscriptionPlanItem = {
        id: initialPlan?.id || `plan-${Date.now()}`,
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        status,
        billingPeriod,
        countryPricing: updatedCountryPricing,
        features: planFeatures,
        subscribersCount: initialPlan?.subscribersCount || 0,
        createdAt: initialPlan?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(finalPlan);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const currencyInfo = country ? getCountryCurrencyInfo(country) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] max-h-[90vh] flex flex-col rounded-3xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#111827] shadow-2xl overflow-hidden transition-all text-slate-950 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#131B2A] shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
              {isEditing ? "Edit Subscription Plan" : "Add Subscription Plan"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal">
              Create a subscription plan and configure localized pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
            title="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
          {/* 1. PLAN INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Plan Information
            </h3>

            {/* Plan Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-950 dark:text-slate-100">
                Plan Name <span className="text-rose-600 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    const next = { ...errors };
                    delete next.name;
                    setErrors(next);
                  }
                }}
                placeholder="Pro Plan"
                className={`w-full h-11 px-3.5 rounded-xl border bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all ${
                  errors.name
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 dark:border-zinc-700"
                }`}
              />
              {errors.name && (
                <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Plan Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-950 dark:text-slate-100">
                Plan Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this subscription plan provides..."
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all resize-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800" />

          {/* 2. COUNTRY */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Country
            </h3>

            <div className="space-y-1.5">
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger
                  className={`h-11 px-3.5 rounded-xl border bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white font-semibold text-sm ${
                    errors.country
                      ? "border-rose-500 focus:ring-rose-500"
                      : "border-slate-300 dark:border-zinc-700 hover:border-slate-400"
                  }`}
                >
                  <SelectValue placeholder="Select Country">
                    {country || "Select Country"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[320px] max-h-64 border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#111827]">
                  <SelectGroup>
                    <SelectLabel>Primary Regions</SelectLabel>
                    {PRIMARY_REGIONS.map((region) => (
                      <SelectItem key={region.name} value={region.name}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>International Markets</SelectLabel>
                    {INTERNATIONAL_REGIONS.map((region) => (
                      <SelectItem key={region.name} value={region.name}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.country && (
                <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.country}</span>
                </p>
              )}
            </div>
          </div>

          {/* 3. DYNAMIC PRICING BASED ON SELECTED COUNTRY */}
          {country && currencyInfo && (
            <>
              <div className="border-t border-slate-200 dark:border-zinc-800" />

              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Pricing
                </h3>

                {/* Currency (Auto-determined) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                    Currency
                  </label>
                  <div className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100/90 dark:bg-slate-900/90 text-slate-950 dark:text-white font-mono font-bold text-sm flex items-center">
                    {currencyInfo.displayText}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-950 dark:text-slate-100">
                      Price <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {currencyInfo.symbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="999"
                        className={`w-full h-11 pl-12 pr-3.5 rounded-xl border bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.price
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-slate-300 dark:border-zinc-700"
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 mt-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.price}</span>
                      </p>
                    )}
                  </div>

                  {/* Billing Period Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-950 dark:text-slate-100">
                      Billing Period <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <Select
                      value={billingPeriod}
                      onValueChange={(val) => setBillingPeriod(val as BillingPeriod)}
                    >
                      <SelectTrigger className="h-11 px-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white font-semibold text-sm">
                        <SelectValue placeholder="Billing Period">
                          {billingPeriod === "yearly"
                            ? "Yearly"
                            : billingPeriod === "lifetime"
                            ? "Lifetime"
                            : "Monthly"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-[180px] border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#111827]">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-slate-200 dark:border-zinc-800" />

          {/* 4. STATUS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Status
            </h3>

            <div className="w-full sm:w-64">
              <Select value={status} onValueChange={(val) => setStatus(val as PlanStatus)}>
                <SelectTrigger className="h-11 px-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#0B0F17] text-slate-950 dark:text-white font-bold text-sm">
                  <SelectValue placeholder="Status">
                    {status === "active" ? "Active" : "Inactive"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[180px] border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#111827]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 5. SAVE FOOTER (STICKY) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#131B2A] shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="h-11 px-6 text-xs font-bold rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </Button>

          <button
            type="button"
            onClick={() => handleSavePlan()}
            disabled={isSaving}
            className="h-11 px-7 rounded-xl bg-[#008235] hover:bg-[#006e2c] active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Plan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
