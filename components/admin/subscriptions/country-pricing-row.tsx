import React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { CountryPricing, BillingPeriod } from "@/lib/types";
import { SUPPORTED_COUNTRIES, getCountryConfig } from "@/lib/mock-data/subscriptions";
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

interface CountryPricingRowProps {
  index: number;
  data: CountryPricing;
  onChange: (updated: CountryPricing) => void;
  onRemove: () => void;
  error?: string;
  defaultBillingPeriod: BillingPeriod;
}

export function CountryPricingRow({
  index,
  data,
  onChange,
  onRemove,
  error,
  defaultBillingPeriod,
}: CountryPricingRowProps) {
  const handleCountrySelect = (countryName: string) => {
    const config = getCountryConfig(countryName);
    onChange({
      ...data,
      country: config.name,
      countryCode: config.code,
      currency: config.currency,
      currencySymbol: config.currencySymbol,
      tax: data.tax || config.defaultTax || "",
    });
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-3 ${
        error
          ? "border-rose-400 bg-rose-50/70 dark:bg-rose-950/20"
          : "border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-slate-400 dark:hover:border-zinc-700"
      }`}
    >
      {/* Top Header of Row: Country Flag, Name, Status, and Delete */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base select-none">
            {getCountryConfig(data.country).flag}
          </span>
          <span className="text-xs font-bold text-slate-950 dark:text-white truncate">
            {data.country || "Select Country"}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold">
            {data.currency} ({data.currencySymbol.trim()})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Toggle for this specific country */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                status: data.status === "active" ? "inactive" : "active",
              })
            }
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-colors border shadow-2xs ${
              data.status === "active"
                ? "bg-[#EAF5ED] text-[#166534] border-[#BDE0CA] dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60"
                : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
            title="Toggle availability in this country"
          >
            {data.status === "active" ? "● Active" : "○ Inactive"}
          </button>

          {/* Remove Country Button */}
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Remove country pricing"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid Inputs for Pricing Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* 1. Country Selection */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
            Country <span className="text-rose-500">*</span>
          </label>
          <Select value={data.country} onValueChange={handleCountrySelect}>
            <SelectTrigger className="w-full h-9 px-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-semibold text-xs shadow-2xs">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent className="w-[220px]">
              <SelectGroup>
                <SelectLabel>GCC & South Asia</SelectLabel>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                <SelectItem value="Qatar">Qatar</SelectItem>
                <SelectItem value="Kuwait">Kuwait</SelectItem>
                <SelectItem value="Oman">Oman</SelectItem>
                <SelectItem value="Bahrain">Bahrain</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Global Regions</SelectLabel>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Germany / EU">Germany / EU</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Currency Code (Auto-selected, editable) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
            Currency
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={data.currency}
              onChange={(e) =>
                onChange({
                  ...data,
                  currency: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. INR"
              className="w-full h-9 px-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono font-bold text-xs uppercase focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
            <input
              type="text"
              value={data.currencySymbol}
              onChange={(e) =>
                onChange({
                  ...data,
                  currencySymbol: e.target.value,
                })
              }
              placeholder="Sym"
              className="w-14 h-9 px-1.5 text-center rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
              title="Currency symbol, e.g. ₹ or AED"
            />
          </div>
        </div>

        {/* 3. Base Price */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
            Regular Price <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 select-none">
              {data.currencySymbol.trim()}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={data.price === 0 ? "0" : data.price || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="w-full h-9 pl-8 pr-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        {/* 4. Discounted Price (Optional) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
            Discounted Price (Opt)
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 select-none">
              {data.currencySymbol.trim()}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={data.discountedPrice !== undefined ? data.discountedPrice : ""}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  ...data,
                  discountedPrice: val === "" ? undefined : parseFloat(val) || 0,
                });
              }}
              placeholder="Optional discount"
              className="w-full h-9 pl-8 pr-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Secondary Line: Tax Configuration and Billing Period Override */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Tax Configuration Note
          </label>
          <input
            type="text"
            value={data.tax || ""}
            onChange={(e) => onChange({ ...data, tax: e.target.value })}
            placeholder="e.g. 18% GST Included or 5% VAT Included"
            className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Billing Frequency Override (Optional)
          </label>
          <Select
            value={data.billingPeriod || defaultBillingPeriod}
            onValueChange={(val) =>
              onChange({
                ...data,
                billingPeriod: val as BillingPeriod,
              })
            }
          >
            <SelectTrigger className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold shadow-2xs">
              <SelectValue placeholder="Billing Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-medium pt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
