"use client";

import React from "react";
import { TemplateEngagementItem } from "@/lib/types/template-engagement";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Bookmark, ChevronRight, SearchX, Layers } from "lucide-react";

interface EngagementCardListProps {
  items: TemplateEngagementItem[];
  isLoading: boolean;
  onSelectTemplate: (templateId: string) => void;
  startRank?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function EngagementCardList({
  items,
  isLoading,
  onSelectTemplate,
  startRank = 1,
  emptyStateTitle = "No templates found",
  emptyStateDescription = "No templates match your current filters.",
}: EngagementCardListProps) {
  const formatRank = (idx: number) => {
    const num = startRank + idx;
    return num < 10 ? `0${num}` : `${num}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
          <SearchX className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{emptyStateTitle}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {emptyStateDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <Card
          key={item.templateId}
          onClick={() => onSelectTemplate(item.templateId)}
          className="border-border bg-card hover:border-slate-300 dark:hover:border-zinc-700 transition-colors cursor-pointer active:scale-[0.99]"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-muted-foreground pt-0.5">
                  #{formatRank(idx)}
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {item.templateName}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="font-normal text-[10px] mt-1 py-0 px-2 rounded-md"
                  >
                    {item.category}
                  </Badge>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>

            {/* Metrics */}
            <div className="mt-3.5 pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                  {item.likes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Bookmark className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
                  {item.saves.toLocaleString()}
                </span>
              </div>

              <div className="text-xs">
                <span className="text-muted-foreground mr-1">Engagement:</span>
                <span className="font-bold text-foreground">
                  {item.totalEngagement.toLocaleString()}
                </span>
              </div>
            </div>

            {item.associatedCollections && item.associatedCollections.length > 0 && (
              <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                <Layers className="h-2.5 w-2.5" />
                <span>In: {item.associatedCollections.join(", ")}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
