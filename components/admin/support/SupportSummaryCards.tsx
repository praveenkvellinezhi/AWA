"use client";

import React from "react";
import { SupportRequest, SupportStatus } from "@/lib/types";
import {
  Inbox,
  AlertCircle,
  Clock,
  PlayCircle,
  CheckCircle2,
  BarChart2,
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
      id: "all" as const,
      label: "Total Requests",
      count: totalCount,
      icon: <Inbox className="h-5 w-5" />,
      rightIcon: <BarChart2 className="h-4 w-4 text-emerald-500/70" />,
      bg: "bg-[#F2FBF7] dark:bg-emerald-950/30",
      activeRing: "ring-2 ring-emerald-500/50",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      textColor: "text-slate-900 dark:text-white",
    },
    {
      id: "open" as const,
      label: "Open",
      count: openCount,
      icon: <AlertCircle className="h-5 w-5" />,
      bg: "bg-[#FEF2F2] dark:bg-rose-950/30",
      activeRing: "ring-2 ring-rose-500/50",
      iconBg: "bg-rose-100/80 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "pending" as const,
      label: "Pending",
      count: pendingCount,
      icon: <Clock className="h-5 w-5" />,
      bg: "bg-[#FFFBEB] dark:bg-amber-950/30",
      activeRing: "ring-2 ring-amber-500/50",
      iconBg: "bg-amber-100/80 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "in-progress" as const,
      label: "In Progress",
      count: inProgressCount,
      icon: <PlayCircle className="h-5 w-5" />,
      bg: "bg-[#EFF6FF] dark:bg-blue-950/30",
      activeRing: "ring-2 ring-blue-500/50",
      iconBg: "bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "resolved" as const,
      label: "Resolved",
      count: resolvedCount,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bg: "bg-[#F0FDF4] dark:bg-emerald-950/30",
      activeRing: "ring-2 ring-emerald-500/50",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
      {cards.map((card) => {
        const isSelected = selectedStatus === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectStatus(card.id)}
            className={`rounded-2xl p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer transition-all border-0 shadow-2xs hover:shadow-xs active:scale-[0.99] ${
              card.bg
            } ${isSelected ? card.activeRing : ""}`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Left Icon Container */}
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                {card.icon}
              </div>

              {/* Text: Label & Number */}
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400 block truncate">
                  {card.label}
                </span>
                <span className={`text-2xl font-black tracking-tight leading-none mt-1 block ${card.textColor}`}>
                  {card.count}
                </span>
              </div>
            </div>

            {/* Optional Right Action/Indicator */}
            {card.rightIcon && (
              <div className="shrink-0 self-start mt-0.5">
                {card.rightIcon}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
