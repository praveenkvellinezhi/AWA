import React from "react";
import { Badge } from "@/components/ui/badge";
import { SupportPriority, SupportStatus, SupportCategory } from "@/lib/types";
import {
  AlertCircle,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Flame,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  switch (status) {
    case "open":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
          <span>Open</span>
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <PlayCircle className="w-3 h-3 text-blue-500 shrink-0" />
          <span>In Progress</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <Clock className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Pending</span>
        </Badge>
      );
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Resolved</span>
        </Badge>
      );
    case "closed":
      return (
        <Badge
          variant="outline"
          className="bg-slate-500/10 text-slate-700 dark:text-zinc-300 border-slate-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <XCircle className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Closed</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function SupportPriorityBadge({ priority }: { priority: SupportPriority }) {
  switch (priority) {
    case "urgent":
      return (
        <Badge
          variant="outline"
          className="bg-rose-600/15 text-rose-800 dark:text-rose-300 border-rose-600/40 gap-1 text-[11px] font-mono font-bold uppercase tracking-wider"
        >
          <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Urgent</span>
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 gap-1 text-[11px] font-mono font-bold"
        >
          <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>High</span>
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/30 gap-1 text-[11px] font-mono font-bold"
        >
          <span>Medium</span>
        </Badge>
      );
    case "low":
      return (
        <Badge
          variant="outline"
          className="bg-slate-200/60 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700 gap-1 text-[11px] font-mono font-medium"
        >
          <ArrowDown className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Low</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

export function SupportCategoryBadge({ category }: { category: SupportCategory }) {
  return (
    <Badge
      variant="outline"
      className="bg-muted/60 text-foreground border-border/80 text-[10px] font-mono font-medium"
    >
      {category}
    </Badge>
  );
}
