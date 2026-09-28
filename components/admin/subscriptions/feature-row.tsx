import React, { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, CheckCircle2 } from "lucide-react";
import { PlanFeature } from "@/lib/types";

interface FeatureRowProps {
  feature: PlanFeature;
  index: number;
  totalCount: number;
  onChange: (updated: PlanFeature) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function FeatureRow({
  feature,
  index,
  totalCount,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: FeatureRowProps) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div
      className={`p-3 rounded-2xl border transition-all space-y-2.5 shadow-2xs ${
        feature.enabled
          ? "border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-900/60"
          : "border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950/40 opacity-70"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Reorder Buttons */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-0.5 rounded text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
            title="Move feature up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={onMoveDown}
            className="p-0.5 rounded text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
            title="Move feature down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Enabled / Disabled Toggle Checkbox */}
        <button
          type="button"
          onClick={() => onChange({ ...feature, enabled: !feature.enabled })}
          className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 border transition-all shadow-2xs ${
            feature.enabled
              ? "bg-[#EAF5ED] text-[#166534] border-[#BDE0CA] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600/60"
              : "bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
          }`}
          title={feature.enabled ? "Feature enabled (included)" : "Feature disabled"}
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>

        {/* Feature Name Input */}
        <div className="flex-1 min-w-[140px]">
          <input
            type="text"
            value={feature.name}
            onChange={(e) => onChange({ ...feature, name: e.target.value })}
            placeholder="e.g. AI Generations"
            className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
          />
        </div>

        {/* Feature Value / Limit Input */}
        <div className="w-32 sm:w-44 shrink-0">
          <input
            type="text"
            value={feature.value || ""}
            onChange={(e) => onChange({ ...feature, value: e.target.value })}
            placeholder="e.g. 100 / month, Unlimited"
            className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
          />
        </div>

        {/* Actions: Toggle Description & Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className={`px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-xs font-bold ${
              showDescription || feature.description
                ? "text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800"
            }`}
            title="Add or edit optional feature description"
          >
            <span className="hidden sm:inline text-[11px]">
              {showDescription ? "Hide Info" : "Info"}
            </span>
            <span className="sm:hidden">ℹ</span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete feature"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expandable Optional Description */}
      {(showDescription || feature.description) && (
        <div className="pl-12 pr-2">
          <input
            type="text"
            value={feature.description || ""}
            onChange={(e) => onChange({ ...feature, description: e.target.value })}
            placeholder="Optional helper text or explanatory note for customer view..."
            className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
          />
        </div>
      )}
    </div>
  );
}
