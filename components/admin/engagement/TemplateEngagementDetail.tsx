"use client";

import React from "react";
import { TemplateEngagementItem, EngagementDateRange } from "@/lib/types/template-engagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  TrendingUp,
  Layers,
  Calendar,
  ShieldCheck,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";

interface TemplateEngagementDetailProps {
  item: TemplateEngagementItem | null;
  isLoading: boolean;
  onBack: () => void;
  dateRange: EngagementDateRange;
}

export function TemplateEngagementDetail({
  item,
  isLoading,
  onBack,
  dateRange,
}: TemplateEngagementDetailProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-in fade-in-50 duration-200">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center w-full">
        <h3 className="text-base font-semibold text-foreground">Template Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          The requested template engagement record could not be loaded.
        </p>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Template Engagement
        </Button>
      </div>
    );
  }

  // Calculate engagement percentages for the ratio bar
  const total = item.totalEngagement || 1;
  const likesPercentage = Math.round((item.likes / total) * 100);
  const savesPercentage = 100 - likesPercentage;

  // Format date range label for context
  const dateRangeLabels: Record<EngagementDateRange, string> = {
    today: "Today",
    last7days: "Last 7 Days",
    last30days: "Last 30 Days",
    last90days: "Last 90 Days",
    thisYear: "This Year",
    allTime: "All Time",
  };

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 px-3 text-xs gap-1.5 shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {item.templateName}
              </h1>
              <Badge variant="secondary" className="text-xs font-normal">
                {item.category}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                {dateRangeLabels[dateRange]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                Created {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Likes Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Likes</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Heart className="h-4 w-4 fill-rose-500/30" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {item.likes.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Direct user upvotes
            </p>
          </CardContent>
        </Card>

        {/* Saves Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Saves</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Bookmark className="h-4 w-4 fill-blue-500/30" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {item.saves.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Saved to personal libraries
            </p>
          </CardContent>
        </Card>

        {/* Total Engagement */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Engagement</span>
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {item.totalEngagement.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Combined likes + saves
            </p>
          </CardContent>
        </Card>

        {/* Like/Save Ratio */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Like / Save Ratio</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                {item.likeSaveRatio}:1
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {item.likeSaveRatio >= 1 ? "Likes lead saves" : "Saves lead likes"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Breakdown & Ratio Bar */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Engagement Distribution
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Relative balance between user likes and bookmark saves for this template.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Stack Bar */}
          <div className="w-full bg-muted rounded-full h-3 flex overflow-hidden">
            <div
              style={{ width: `${likesPercentage}%` }}
              className="bg-rose-500 transition-all duration-500 h-full"
              title={`Likes: ${item.likes} (${likesPercentage}%)`}
            />
            <div
              style={{ width: `${savesPercentage}%` }}
              className="bg-blue-500 transition-all duration-500 h-full"
              title={`Saves: ${item.saves} (${savesPercentage}%)`}
            />
          </div>

          {/* Ratio Legend & Numbers */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-500 inline-block" />
              <span className="font-medium text-foreground">Likes</span>
              <span className="text-muted-foreground font-mono">
                {item.likes.toLocaleString()} ({likesPercentage}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-blue-500 inline-block" />
              <span className="font-medium text-foreground">Saves</span>
              <span className="text-muted-foreground font-mono">
                {item.saves.toLocaleString()} ({savesPercentage}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Associated Admin Collections (Read-Only Context) */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-foreground">
                Associated Admin Collections
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Read-Only
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Curated collections in which this template is currently featured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {item.associatedCollections && item.associatedCollections.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.associatedCollections.map((colName) => (
                <div
                  key={colName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs font-medium text-foreground"
                >
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{colName}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              This template is not currently assigned to any curated collections.
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-3">
            Note: Collection curation is managed independently under the{" "}
            <span className="font-medium text-foreground">Collection Management</span> section.
          </p>
        </CardContent>
      </Card>

      {/* Historical Trend Analytics Notice (Requirement 14) */}
      <Card className="border-border bg-muted/20">
        <CardContent className="p-5 flex items-start gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-medium text-foreground">Engagement Over Time</h4>
            <p className="text-muted-foreground">
              Engagement trends will appear once historical analytics data is available.
            </p>
            <p className="text-[11px] text-muted-foreground">
              The analytics service is prepared to ingest time-series daily event streams as soon as the production analytics telemetry pipeline connects.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Privacy & Aggregation Guarantee (Requirement 18) */}
      <Card className="border-border bg-card">
        <CardContent className="p-5 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-medium text-foreground">Privacy &amp; Data Safeguards</h4>
            <p className="text-muted-foreground">
              All metrics shown reflect strictly anonymized aggregate user interactions. In compliance with privacy standards, individual user profiles, user IDs, private custom prompts, and personal collection names are not stored or displayed in the Template Analytics suite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
