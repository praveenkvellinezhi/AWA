"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { CategoryOption } from "./types";

interface CategoryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetCategory: CategoryOption | null;
  currentCategoryName: string;
}

export function CategoryChangeModal({
  isOpen,
  onClose,
  onConfirm,
  targetCategory,
  currentCategoryName,
}: CategoryChangeModalProps) {
  if (!isOpen || !targetCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-[#131B2A] border border-amber-500/30 dark:border-amber-500/30 rounded-2xl shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Switch Category to {targetCategory.name}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adapting builder fields
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          Switching from <strong>{currentCategoryName}</strong> to <strong>{targetCategory.name}</strong> will adapt the builder fields and reset category-specific configuration (such as prompts, parameters, and workflow steps) to the defaults for {targetCategory.name}.
          <br /><br />
          Your basic information (Template Name, Description, Tags, and Cover Image) will be preserved.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl font-medium"
          >
            Keep {currentCategoryName}
          </Button>
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white border-none"
          >
            Confirm & Switch Builder
          </Button>
        </div>
      </div>
    </div>
  );
}
