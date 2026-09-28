import React from "react";
import { SupportPriority, SupportStatus, SupportCategory } from "@/lib/types";
import {
  AlertCircle,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Flame,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/90 dark:border-rose-800/60 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Open</span>
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/90 dark:border-blue-800/60 shadow-2xs">
          <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>In Progress</span>
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFBEB] dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/60 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case "resolved":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/60 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Resolved</span>
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shadow-2xs">
          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Closed</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted text-muted-foreground">
          {status}
        </span>
      );
  }
}

export function SupportPriorityBadge({ priority }: { priority: SupportPriority }) {
  switch (priority) {
    case "urgent":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF2F2] dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/90 dark:border-rose-800/60 shadow-2xs uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" />
          <span>URGENT</span>
        </span>
      );
    case "high":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FFFBEB] dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/60 shadow-2xs">
          <span className="text-amber-600 dark:text-amber-400 font-bold">↑</span>
          <span>High</span>
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50 shadow-2xs">
          <span>Medium</span>
        </span>
      );
    case "low":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/60 shadow-2xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">↓</span>
          <span>Low</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted text-muted-foreground">
          {priority}
        </span>
      );
  }
}

export function SupportCategoryBadge({ category }: { category: SupportCategory | string }) {
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/90 dark:border-zinc-700 shadow-2xs">
      {category}
    </span>
  );
}
