"use client";

import React from "react";
import { CollectionStatus } from "@/lib/types/collection";
import { CheckCircle2, CircleSlash, Lock, Layers } from "lucide-react";

export function CollectionStatusBadge({ status }: { status: CollectionStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shadow-2xs">
      <CircleSlash className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
      <span>Inactive</span>
    </span>
  );
}

export function ReadOnlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono shadow-2xs">
      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
      <span>Read Only</span>
    </span>
  );
}

export function TemplateCountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80">
      <Layers className="w-3 h-3 text-slate-500" />
      <span>{count} {count === 1 ? "Template" : "Templates"}</span>
    </span>
  );
}
