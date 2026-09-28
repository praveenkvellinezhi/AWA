"use client";

import React from "react";
import { TemplateEngagementItem } from "@/lib/types/template-engagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Bookmark, Eye, Layers, SearchX } from "lucide-react";

interface EngagementTableProps {
  items: TemplateEngagementItem[];
  isLoading: boolean;
  onSelectTemplate: (templateId: string) => void;
  highlightMetric?: "likes" | "saves" | "engagement";
  startRank?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function EngagementTable({
  items,
  isLoading,
  onSelectTemplate,
  highlightMetric = "likes",
  startRank = 1,
  emptyStateTitle = "No templates found",
  emptyStateDescription = "No templates match your current filters.",
}: EngagementTableProps) {
  // Format rank as 2 digits: 01, 02, etc.
  const formatRank = (idx: number) => {
    const num = startRank + idx;
    return num < 10 ? `0${num}` : `${num}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Saves</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-20 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-14 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{emptyStateTitle}</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {emptyStateDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent text-xs">
            <TableHead className="w-14 text-center font-mono text-[11px]">Rank</TableHead>
            <TableHead className="font-semibold text-foreground">Template</TableHead>
            <TableHead className="font-semibold text-foreground">Category</TableHead>
            <TableHead className="text-right font-semibold text-foreground">
              <span className="inline-flex items-center gap-1 justify-end">
                <Heart className="h-3 w-3 text-rose-500 fill-rose-500/20" />
                Likes
              </span>
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground">
              <span className="inline-flex items-center gap-1 justify-end">
                <Bookmark className="h-3 w-3 text-blue-500 fill-blue-500/20" />
                Saves
              </span>
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground">
              Total Engagement
            </TableHead>
            <TableHead className="font-semibold text-foreground">Last Updated</TableHead>
            <TableHead className="w-24 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => {
            const isTopRank = startRank + idx <= 3;

            return (
              <TableRow
                key={item.templateId}
                onClick={() => onSelectTemplate(item.templateId)}
                className="cursor-pointer hover:bg-muted/40 transition-colors text-xs"
              >
                {/* Rank */}
                <TableCell className="text-center font-mono font-bold text-muted-foreground">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-[11px] ${
                      isTopRank
                        ? "bg-primary/10 text-primary font-black"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatRank(idx)}
                  </span>
                </TableCell>

                {/* Template Name & Details */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.templateName}
                    </span>
                    {item.associatedCollections && item.associatedCollections.length > 0 && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Layers className="h-2.5 w-2.5 text-muted-foreground" />
                        In: {item.associatedCollections.join(", ")}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-normal text-[11px] py-0 px-2 rounded-md"
                  >
                    {item.category}
                  </Badge>
                </TableCell>

                {/* Likes */}
                <TableCell className="text-right font-mono font-medium">
                  <span
                    className={`inline-flex items-center gap-1 justify-end ${
                      highlightMetric === "likes"
                        ? "font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.likes.toLocaleString()}
                  </span>
                </TableCell>

                {/* Saves */}
                <TableCell className="text-right font-mono font-medium">
                  <span
                    className={`inline-flex items-center gap-1 justify-end ${
                      highlightMetric === "saves"
                        ? "font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.saves.toLocaleString()}
                  </span>
                </TableCell>

                {/* Total Engagement */}
                <TableCell className="text-right font-mono">
                  <span
                    className={`inline-flex items-center justify-end px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      highlightMetric === "engagement"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {item.totalEngagement.toLocaleString()}
                  </span>
                </TableCell>

                {/* Last Updated */}
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {new Date(item.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectTemplate(item.templateId)}
                    className="h-8 text-xs font-medium text-primary hover:text-primary/90 hover:bg-primary/10"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
