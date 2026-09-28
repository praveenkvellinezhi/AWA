"use client";

import React from "react";
import { EngagementSummary } from "@/lib/types/template-engagement";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Bookmark, Flame, CheckCircle2 } from "lucide-react";

interface EngagementSummaryCardsProps {
  summary: EngagementSummary | null;
  isLoading: boolean;
}

export function EngagementSummaryCards({
  summary,
  isLoading,
}: EngagementSummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Likes",
      value: summary.totalLikes.toLocaleString(),
      icon: <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />,
      description: "Across all templates",
    },
    {
      title: "Total Saves",
      value: summary.totalSaves.toLocaleString(),
      icon: <Bookmark className="h-4 w-4 text-blue-500 fill-blue-500/20" />,
      description: "Saved for quick access",
    },
    {
      title: "Templates Liked",
      value: summary.templatesLikedCount.toLocaleString(),
      icon: <Flame className="h-4 w-4 text-amber-500" />,
      description: "Templates with 1+ likes",
    },
    {
      title: "Templates Saved",
      value: summary.templatesSavedCount.toLocaleString(),
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      description: "Templates with 1+ saves",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border-border bg-card text-card-foreground shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {card.title}
              </span>
              <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
