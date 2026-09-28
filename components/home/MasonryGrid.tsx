"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Template } from "@/lib/types";
import { TemplateMasonryCard } from "./TemplateMasonryCard";
import {
  getTemplateAspectRatio,
  getRelativeCardHeight,
} from "@/lib/template-aspect-ratio";

interface MasonryGridProps {
  templates: Template[];
  inFeedCard?: React.ReactNode;
  inFeedIndex?: number;
}

export function MasonryGrid({
  templates,
  inFeedCard,
  inFeedIndex = 2,
}: MasonryGridProps) {
  const [columnCount, setColumnCount] = useState<number>(4);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(2);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else if (width < 1280) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute items into columns using the greedy shortest-column algorithm
  const columns = useMemo(() => {
    const cols: Array<
      Array<{
        type: "template" | "custom";
        template?: Template;
        customNode?: React.ReactNode;
        id: string;
      }>
    > = Array.from({ length: columnCount }, () => []);

    const colHeights = new Array(columnCount).fill(0);

    let templateIdx = 0;
    const totalItems = templates.length + (inFeedCard ? 1 : 0);

    for (let i = 0; i < totalItems; i++) {
      // Find the column with minimum height
      let targetCol = 0;
      let minHeight = colHeights[0];
      for (let c = 1; c < columnCount; c++) {
        if (colHeights[c] < minHeight) {
          minHeight = colHeights[c];
          targetCol = c;
        }
      }

      // Check if this slot belongs to the in-feed card
      if (inFeedCard && i === inFeedIndex) {
        cols[targetCol].push({
          type: "custom",
          customNode: inFeedCard,
          id: "in-feed-custom-card",
        });
        colHeights[targetCol] += 1.2; // approx height for promo card
        continue;
      }

      if (templateIdx < templates.length) {
        const t = templates[templateIdx++];
        const ratio = getTemplateAspectRatio(t);
        const relHeight = getRelativeCardHeight(ratio);

        cols[targetCol].push({
          type: "template",
          template: t,
          id: t.id,
        });
        colHeights[targetCol] += relHeight;
      }
    }

    return cols;
  }, [templates, columnCount, inFeedCard, inFeedIndex]);

  // SSR Fallback (before client mount)
  if (!isMounted) {
    return (
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-2.5 sm:gap-3 space-y-2.5 sm:space-y-3 w-full">
        {templates.map((template) => (
          <div key={template.id} className="break-inside-avoid pb-2.5 sm:pb-3">
            <TemplateMasonryCard template={template} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 sm:gap-3 items-start w-full transition-all">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex-1 flex flex-col gap-2.5 sm:gap-3 min-w-0">
          {colItems.map((item) => {
            if (item.type === "custom" && item.customNode) {
              return <div key={item.id}>{item.customNode}</div>;
            }
            if (item.template) {
              return (
                <TemplateMasonryCard
                  key={item.id}
                  template={item.template}
                  priority={colIdx === 0 && colItems.indexOf(item) === 0}
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
