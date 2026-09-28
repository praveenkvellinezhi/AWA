"use client";

import React from "react";
import { CollectionTemplateItem, CollectionStatus } from "@/lib/types/collection";
import { Sparkles, Eye, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CollectionPreviewProps {
  name: string;
  description: string;
  status: CollectionStatus;
  templates: CollectionTemplateItem[];
}

export function CollectionPreview({
  name,
  description,
  status,
  templates,
}: CollectionPreviewProps) {
  const displayName = name.trim() || "Untitled Collection";
  const displayDescription =
    description.trim() || "Add a description to guide users through this curated template set.";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-5 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Recommendation Preview
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Live view of how users will see this recommendation block in the app
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "active" ? (
            <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
              Eligible for Recommendations
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700">
              Hidden from Recommendations (Inactive)
            </Badge>
          )}
        </div>
      </div>

      {/* Simulated User App Recommendation Card Container */}
      <div className="rounded-xl border border-slate-200/90 dark:border-zinc-800/80 bg-gradient-to-b from-slate-50/70 to-white dark:from-[#0f1115] dark:to-[#14171d] p-5 space-y-4">
        {/* Collection Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Featured Collection
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                • {templates.length} {templates.length === 1 ? "Guide" : "Guides"}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {displayDescription}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-default">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Template Cards Horizontal Grid */}
        {templates.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center space-y-2 bg-white/50 dark:bg-zinc-900/30">
            <Layers className="w-6 h-6 text-slate-300 dark:text-zinc-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              No templates added to this collection yet.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              Select templates from the catalogue below to preview their cards here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
            {templates.map((tpl, index) => (
              <div
                key={tpl.id}
                className="group rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#1a1c22] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Thumbnail with category pill */}
                <div className="relative h-28 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  {tpl.thumbnail ? (
                    <img
                      src={tpl.thumbnail}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Layers className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 backdrop-blur-xs">
                    {tpl.category}
                  </span>
                </div>

                {/* Card Content (Strictly privacy safe - no prompts) */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {tpl.name}
                    </h5>
                    {tpl.description && (
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                        {tpl.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">ID: {tpl.id.substring(0, 16)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
