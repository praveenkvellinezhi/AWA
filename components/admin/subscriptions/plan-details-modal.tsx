import React from "react";
import {
  X,
  Edit,
  Copy,
  Trash2,
  Globe,
  CheckCircle2,
  Tag,
  Sparkles,
} from "lucide-react";
import { SubscriptionPlanItem } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { getCountryConfig, formatPriceWithCurrency } from "@/lib/mock-data/subscriptions";
import { Button } from "@/components/ui/button";

interface PlanDetailsModalProps {
  plan: SubscriptionPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onDuplicate: (plan: SubscriptionPlanItem) => void;
  onToggleStatus: (plan: SubscriptionPlanItem) => void;
  onDelete: (plan: SubscriptionPlanItem) => void;
}

export function PlanDetailsModal({
  plan,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: PlanDetailsModalProps) {
  if (!isOpen || !plan) return null;

  const activeCountriesCount = plan.countryPricing.filter((c) => c.status === "active").length;
  const enabledFeatures = plan.features.filter((f) => f.enabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#111827] shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="space-y-1.5 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight break-words">
                {plan.name}
              </h2>
              <StatusBadge status={plan.status} />
              {plan.badge && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {plan.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-0.5 font-mono">
              <span className="flex items-center gap-1 font-semibold">
                <Tag className="h-3.5 w-3.5 text-[#008235] dark:text-emerald-400" />
                <span>slug: {plan.slug}</span>
              </span>
              <span>•</span>
              <span className="capitalize font-semibold text-slate-800 dark:text-slate-200">
                Billing: {plan.billingPeriod}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800 dark:text-slate-200">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-300/90 dark:border-zinc-800 space-y-0.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
                Active Subscribers
              </span>
              <span className="text-xl font-mono font-black text-slate-950 dark:text-white">
                {plan.subscribersCount.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-300/90 dark:border-zinc-800 space-y-0.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
                Configured Countries
              </span>
              <span className="text-xl font-mono font-black text-[#15803D] dark:text-emerald-400">
                {plan.countryPricing.length} ({activeCountriesCount} Active)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-300/90 dark:border-zinc-800 space-y-0.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
                Total Features
              </span>
              <span className="text-xl font-mono font-black text-slate-950 dark:text-white">
                {plan.features.length} Features
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-300/90 dark:border-zinc-800 space-y-0.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
                Created Date
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block truncate mt-1">
                {new Date(plan.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Section 1: Country Pricing Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#008235] dark:text-emerald-400" />
                <span>Country-Specific Pricing Matrix</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                {plan.countryPricing.length} region configs
              </span>
            </div>

            <div className="rounded-2xl border border-slate-300 dark:border-zinc-800 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-900/90 border-b border-slate-300 dark:border-zinc-800 text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Discount</th>
                    <th className="py-2.5 px-3">Tax Policy</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80 font-mono text-[11px]">
                  {plan.countryPricing.map((cp) => {
                    const countryConfig = getCountryConfig(cp.country);
                    return (
                      <tr
                        key={cp.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-950 dark:text-white">
                          <span>{cp.country}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-bold">
                          {cp.currency}
                        </td>
                        <td className="py-2.5 px-3 font-black text-slate-950 dark:text-white">
                          {formatPriceWithCurrency(cp.price, cp.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3">
                          {cp.discountedPrice !== undefined ? (
                            <span className="text-[#166534] dark:text-emerald-400 font-black">
                              {formatPriceWithCurrency(cp.discountedPrice, cp.currencySymbol)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                          {cp.tax || "Included"}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
                              cp.status === "active"
                                ? "bg-[#EAF5ED] text-[#166534] border-[#BDE0CA] dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700"
                                : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                            }`}
                          >
                            {cp.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Features Included List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#008235] dark:text-emerald-400" />
                <span>Configured Plan Features & Limits</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                {enabledFeatures.length} active features
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plan.features.map((feat) => (
                <div
                  key={feat.id}
                  className={`p-3 rounded-2xl border flex items-start gap-2.5 shadow-2xs ${
                    feat.enabled
                      ? "bg-white dark:bg-slate-900/60 border-slate-300 dark:border-zinc-800"
                      : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-zinc-900 opacity-60"
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      feat.enabled
                        ? "text-[#15803D] dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-950 dark:text-white truncate">
                        {feat.name}
                      </span>
                      {feat.value && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shrink-0">
                          {feat.value}
                        </span>
                      )}
                    </div>
                    {feat.description && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                        {feat.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleStatus(plan)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors shadow-2xs ${
                plan.status === "active"
                  ? "border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:bg-amber-950/50"
                  : "border-emerald-300 text-emerald-900 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-200 dark:bg-emerald-950/50"
              }`}
            >
              {plan.status === "active" ? "Deactivate Plan" : "Activate Plan"}
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(plan)}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Duplicate Plan</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(plan)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-300 dark:hover:border-rose-800 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs font-bold border-slate-300 dark:border-zinc-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
            >
              Close
            </Button>

            <Button
              variant="forest"
              size="sm"
              onClick={() => onEdit(plan)}
              className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Plan</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
