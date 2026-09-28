"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { SupportRequest, SupportStatus } from "@/lib/types";
import {
  Inbox,
  AlertCircle,
  Clock,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

interface SupportSummaryCardsProps {
  requests: SupportRequest[];
  selectedStatus: SupportStatus | "all";
  onSelectStatus: (status: SupportStatus | "all") => void;
}

export function SupportSummaryCards({
  requests,
  selectedStatus,
  onSelectStatus,
}: SupportSummaryCardsProps) {
  const totalCount = requests.length;
  const openCount = requests.filter((r) => r.status === "open").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in-progress").length;
  const resolvedCount = requests.filter((r) => r.status === "resolved").length;

  const cards = [
    {
      id: "all",
      label: "Total Requests",
      count: totalCount,
      icon: <Inbox className="h-4 w-4" />,
      color: "text-slate-700 dark:text-zinc-300",
      activeBorder: "border-slate-500/80 dark:border-slate-400/80 bg-slate-50/80 dark:bg-slate-800/40",
      badgeColor: "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200",
    },
    {
      id: "open",
      label: "Open",
      count: openCount,
      icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
      color: "text-rose-600 dark:text-rose-400",
      activeBorder: "border-rose-500/80 dark:border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/20",
      badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    },
    {
      id: "pending",
      label: "Pending",
      count: pendingCount,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      color: "text-amber-600 dark:text-amber-400",
      activeBorder: "border-amber-500/80 dark:border-amber-500/80 bg-amber-50/50 dark:bg-amber-950/20",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    },
    {
      id: "in-progress",
      label: "In Progress",
      count: inProgressCount,
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
      color: "text-blue-600 dark:text-blue-400",
      activeBorder: "border-blue-500/80 dark:border-blue-500/80 bg-blue-50/50 dark:bg-blue-950/20",
      badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    },
    {
      id: "resolved",
      label: "Resolved",
      count: resolvedCount,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      color: "text-emerald-600 dark:text-emerald-400",
      activeBorder: "border-emerald-500/80 dark:border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20",
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const isSelected = selectedStatus === c.id;

        return (
          <Card
            key={c.id}
            onClick={() => onSelectStatus(c.id as SupportStatus | "all")}
            className={`p-3 sm:p-3.5 cursor-pointer transition-all duration-150 select-none border rounded-xl hover:shadow-xs ${
              isSelected
                ? `${c.activeBorder} shadow-2xs ring-1 ring-border/50`
                : "border-border/70 dark:border-zinc-800/80 bg-card hover:bg-accent/40"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                {c.label}
              </span>
              <div className="p-1 rounded-md bg-muted/60 dark:bg-zinc-800">
                {c.icon}
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${c.color}`}>
                {c.count}
              </span>
              {isSelected && (
                <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                  Active Filter
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
