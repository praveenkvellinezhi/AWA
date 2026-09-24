"use client";

import React, { useState } from "react";
import {
  Camera,
  Film,
  Globe,
  Presentation,
  Palette,
  Check,
  Sparkles,
} from "lucide-react";
import { CategoryOption, TemplateCategoryKey } from "./types";
import { CATEGORY_OPTIONS } from "./defaults";
import { CategoryChangeModal } from "./CategoryChangeModal";

interface CategorySelectorProps {
  selectedCategoryKey: TemplateCategoryKey;
  onSelectCategory: (category: CategoryOption) => void;
  isDirty?: boolean;
}

export function CategorySelector({
  selectedCategoryKey,
  onSelectCategory,
  isDirty = false,
}: CategorySelectorProps) {
  const [pendingCategory, setPendingCategory] = useState<CategoryOption | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentCategory =
    CATEGORY_OPTIONS.find((c) => c.key === selectedCategoryKey) || CATEGORY_OPTIONS[0];

  const handleCardClick = (category: CategoryOption) => {
    if (category.key === selectedCategoryKey) return;

    if (isDirty) {
      setPendingCategory(category);
      setShowModal(true);
    } else {
      onSelectCategory(category);
    }
  };

  const getCategoryIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-5 h-5 transition-transform duration-300 ${
      isSelected ? "scale-110" : ""
    }`;
    switch (iconName) {
      case "Camera":
        return <Camera className={className} />;
      case "Film":
        return <Film className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "Presentation":
        return <Presentation className={className} />;
      case "Palette":
        return <Palette className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Template Category</span>
            <span className="text-emerald-500">*</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            The category dynamically adapts the builder fields, prompt architecture, and workflow tools.
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Selected: {currentCategory.name}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CATEGORY_OPTIONS.map((category) => {
          const isSelected = category.key === selectedCategoryKey;
          return (
            <button
              type="button"
              key={category.key}
              onClick={() => handleCardClick(category)}
              className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-500 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#161F33]"
              }`}
            >
              {/* Top Row: Icon + Badge + Check */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  }`}
                >
                  {getCategoryIcon(category.iconName, isSelected)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {category.badge}
                  </span>

                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-700 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  className={`text-xs font-bold transition-colors ${
                    isSelected
                      ? "text-emerald-900 dark:text-emerald-200"
                      : "text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}
                >
                  {category.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {category.tagline}
                </p>
              </div>

              {/* Bottom active pill indicator */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span
                  className={
                    isSelected
                      ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {isSelected ? "Active Builder" : "Switch to this"}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <CategoryChangeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (pendingCategory) {
            onSelectCategory(pendingCategory);
          }
        }}
        targetCategory={pendingCategory}
        currentCategoryName={currentCategory.name}
      />
    </div>
  );
}
