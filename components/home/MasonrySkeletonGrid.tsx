"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAspectRatioCss } from "@/lib/template-aspect-ratio";

// Sequence of mixed aspect ratios for organic skeleton appearance
const SKELETON_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
  "4:5",
  "16:9",
  "3:4",
  "1:1",
  "2:3",
  "16:9",
  "4:5",
  "9:16",
  "4:3",
  "1:1",
  "16:9",
  "3:4",
];

interface MasonrySkeletonGridProps {
  count?: number;
}

export function MasonrySkeletonGrid({ count = 12 }: MasonrySkeletonGridProps) {
  const items = SKELETON_RATIOS.slice(0, count);

  return (
    <div className="w-full">
      {/* 5-Column Responsive Column-Gap Masonry Skeleton */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-2.5 sm:gap-3 space-y-2.5 sm:space-y-3">
        {items.map((ratio, idx) => {
          const cssRatio = getAspectRatioCss(ratio);
          return (
            <div key={idx} className="break-inside-avoid flex flex-col gap-1.5 pb-1.5">
              {/* Aspect Ratio Skeleton Box */}
              <div
                className="w-full rounded-2xl overflow-hidden bg-slate-200/60 dark:bg-zinc-800/50 relative"
                style={{ aspectRatio: cssRatio }}
              >
                <Skeleton className="w-full h-full rounded-2xl" />
              </div>

              {/* Title & Category Skeletons */}
              <div className="space-y-1.5 px-1 pt-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
