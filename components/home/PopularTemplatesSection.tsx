"use client";

import React, { useMemo } from "react";
import { Template } from "@/lib/types";
import { TemplateMasonryCard } from "./TemplateMasonryCard";
import { Flame, Sparkles } from "lucide-react";

interface PopularTemplatesSectionProps {
  templates: Template[];
}

export function PopularTemplatesSection({ templates }: PopularTemplatesSectionProps) {
  // Pick top 4-5 templates with diverse aspect ratios (e.g. 16:9, 9:16, 1:1, 4:5)
  const popularTemplates = useMemo(() => {
    // Sort by likes + saves
    const sorted = [...templates].sort(
      (a, b) => b.likesCount + b.savesCount - (a.likesCount + a.savesCount)
    );
    // Take top 4 for a clean responsive row
    return sorted.slice(0, 4);
  }, [templates]);

  if (popularTemplates.length === 0) return null;

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Flame className="h-3.5 w-3.5 fill-rose-500/30" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Popular Templates
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Highest community engagement across all formats
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Curated Picks</span>
        </div>
      </div>

      {/* Grid of Popular Templates reusing the exact same TemplateMasonryCard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
        {popularTemplates.map((template) => (
          <TemplateMasonryCard key={`popular-${template.id}`} template={template} />
        ))}
      </div>
    </section>
  );
}
