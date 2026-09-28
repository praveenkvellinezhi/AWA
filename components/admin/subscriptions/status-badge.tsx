import React from "react";
import { PlanStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: PlanStatus | "active" | "inactive" | "draft";
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const isSm = size === "sm";

  if (status === "active") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded-full border transition-colors ${
          isSm ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5"
        } bg-[#EAF5ED] text-[#166534] border-[#BDE0CA] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600/50 shadow-2xs ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] dark:bg-emerald-400 animate-pulse shrink-0" />
        <span>Active</span>
      </span>
    );
  }

  if (status === "draft") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded-full border transition-colors ${
          isSm ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5"
        } bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-600/50 shadow-2xs ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
        <span>Draft</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded-full border transition-colors ${
        isSm ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5"
      } bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/90 dark:text-slate-300 dark:border-slate-700 shadow-2xs ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 dark:bg-slate-400 shrink-0" />
      <span>Inactive</span>
    </span>
  );
}
