"use client";

import React from "react";
import Link from "next/link";
import { Template } from "@/lib/types";
import { useDemo } from "@/lib/demo-context";
import { Heart, Bookmark } from "lucide-react";
import { getTemplatePrimaryImage } from "@/lib/template-images";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const { isLiked, isSaved, toggleLike, toggleSave } = useDemo();

  const liked = isLiked(template.id);
  const saved = isSaved(template.id);
  const currentLikes = liked ? template.likesCount + 1 : template.likesCount;
  const demoImage = getTemplatePrimaryImage(template);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(template.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(template.id);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#141518] hover:border-slate-300 dark:hover:border-zinc-650 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg dark:shadow-black/40 overflow-hidden">
      <Link href={`/templates/${template.id}`} className="block">
        {/* Visual Preview Container with Demo Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-zinc-900">
          <img
            src={demoImage}
            alt={template.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Dark gradient overlay at bottom and subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

          {/* Bottom Left Category/Subcategory Pill */}
          <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-zinc-200 border border-white/15 shadow-sm">
              {template.subcategoryName || template.categoryName}
            </span>
          </div>

          {/* Top-Left Bookmark Save Button */}
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 left-3 z-20 flex items-center justify-center h-7 w-7 rounded-full backdrop-blur-md transition-all ${
              saved
                ? "bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-900/30 opacity-100"
                : "bg-black/60 text-white/80 border border-white/15 hover:bg-black/80 hover:text-white opacity-0 group-hover:opacity-100"
            }`}
            title={saved ? "Remove from saved" : "Save template"}
            aria-label={saved ? "Saved template" : "Save template"}
          >
            <Bookmark
              className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                saved ? "fill-amber-400 text-amber-400" : "text-white/80"
              }`}
            />
          </button>

          {/* Top-Right Like Count Pill Button */}
          <button
            onClick={handleLikeClick}
            className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-all ${
              liked
                ? "bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-900/30"
                : "bg-black/60 text-white/90 border border-white/15 hover:bg-black/80 hover:text-white"
            }`}
            title={liked ? "Unlike this template" : "Like this template"}
            aria-label={`Like template, currently ${currentLikes} likes`}
          >
            <span className="text-white">{currentLikes}</span>
            <Heart
              className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                liked ? "fill-rose-400 text-rose-400" : "text-white/80"
              }`}
            />
          </button>
        </div>

        {/* Card Body / Metadata */}
        <div className="px-3.5 py-3 border-t border-slate-100 dark:border-zinc-800/60 bg-white dark:bg-[#121316]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
            {template.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mt-1">
            <span
              className="truncate font-medium text-slate-700 dark:text-zinc-300"
              title={`Recommended Tool: ${template.recommendedTools[0]?.toolName || "AI Guided"}`}
            >
              {template.recommendedTools[0]?.toolName || "AI Guided"}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono shrink-0 ml-2">{template.difficulty}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
