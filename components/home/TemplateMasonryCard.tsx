"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Template } from "@/lib/types";
import { useDemo } from "@/lib/demo-context";
import { Heart, Bookmark, ArrowUpRight } from "lucide-react";
import { getTemplatePrimaryImage } from "@/lib/template-images";
import {
  getTemplateAspectRatio,
  getAspectRatioCss,
} from "@/lib/template-aspect-ratio";

interface TemplateMasonryCardProps {
  template: Template;
  priority?: boolean;
}

export function TemplateMasonryCard({ template, priority = false }: TemplateMasonryCardProps) {
  const { isLiked, isSaved, toggleLike, toggleSave } = useDemo();
  const [imageLoaded, setImageLoaded] = useState(false);

  const liked = isLiked(template.id);
  const saved = isSaved(template.id);
  const currentLikes = liked ? template.likesCount + 1 : template.likesCount;
  const demoImage = getTemplatePrimaryImage(template);
  const aspectRatio = getTemplateAspectRatio(template);
  const cssAspectRatio = getAspectRatioCss(aspectRatio);

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
    <div className="group relative flex flex-col w-full transition-all duration-300">
      <Link
        href={`/templates/${template.id}`}
        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
        aria-label={`Open template ${template.name}`}
      >
        {/* Visual Preview Container with Exact Natural Aspect Ratio */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900/90 shadow-xs hover:shadow-xl transition-all duration-300"
          style={{ aspectRatio: cssAspectRatio }}
        >
          {/* Skeleton placeholder while loading image */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-200/70 dark:bg-zinc-800/60 animate-pulse" />
          )}

          {/* Actual Template Preview Image */}
          <img
            src={demoImage}
            alt={template.name}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Subtle gradient vignette for hover and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Top-Left Subtle Aspect Ratio Tag */}
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-xs">
              {aspectRatio}
            </span>
          </div>

          {/* Top-Right Floating Bookmark/Save Action */}
          <button
            type="button"
            onClick={handleSaveClick}
            className={`absolute top-2.5 right-2.5 z-20 flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              saved
                ? "bg-amber-500 text-white shadow-md shadow-amber-900/40 opacity-100 scale-100"
                : "bg-black/55 text-white hover:bg-black/80 hover:scale-105 opacity-0 group-hover:opacity-100 border border-white/20"
            }`}
            title={saved ? "Remove bookmark" : "Save template"}
            aria-label={saved ? "Bookmark saved" : "Bookmark template"}
          >
            <Bookmark
              className={`h-4 w-4 transition-transform ${
                saved ? "fill-white text-white" : "text-white"
              }`}
            />
          </button>

          {/* Bottom-Right Floating Like Action (Appears on Hover or When Liked) */}
          <button
            type="button"
            onClick={handleLikeClick}
            className={`absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer ${
              liked
                ? "bg-rose-600 text-white shadow-md shadow-rose-900/40 opacity-100"
                : "bg-black/55 text-white hover:bg-black/80 hover:scale-105 opacity-0 group-hover:opacity-100 border border-white/20"
            }`}
            title={liked ? "Unlike template" : "Like template"}
            aria-label={`Like template, currently ${currentLikes} likes`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                liked ? "fill-white text-white" : "text-white"
              }`}
            />
            <span className="font-mono text-[11px]">{currentLikes}</span>
          </button>

          {/* Bottom-Left Quick Open Hint (Desktop Hover) */}
          <div className="absolute bottom-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/95 text-slate-900 dark:bg-zinc-900/95 dark:text-zinc-100 shadow-md backdrop-blur-xs">
              <span>Open</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Minimalist Card Metadata Under the Image */}
        <div className="pt-1.5 pb-0.5 px-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 truncate font-medium">
            <span>{template.subcategoryName || template.categoryName}</span>
            <span className="mx-1 text-slate-300 dark:text-zinc-600">·</span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-400">
              {aspectRatio}
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
}
