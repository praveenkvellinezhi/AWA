"use client";

import React, { useState, useMemo } from "react";
import { CollectionTemplateItem } from "@/lib/types/collection";
import { useAvailableTemplates } from "@/lib/hooks/use-collections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check, AlertCircle, Layers, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemplateSelectorProps {
  selectedTemplates: CollectionTemplateItem[];
  onAddTemplate: (template: CollectionTemplateItem) => void;
  onRemoveTemplate: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplates,
  onAddTemplate,
  onRemoveTemplate,
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const { templates: availableCatalog, isLoading } = useAvailableTemplates(searchQuery);

  const selectedIds = useMemo(() => {
    return new Set(selectedTemplates.map((t) => t.id));
  }, [selectedTemplates]);

  const handleToggle = (tpl: CollectionTemplateItem) => {
    setDuplicateWarning(null);

    if (selectedIds.has(tpl.id)) {
      // If already selected, user can uncheck/remove
      onRemoveTemplate(tpl.id);
    } else {
      // Validate duplicate prevention explicitly
      if (selectedTemplates.some((existing) => existing.id === tpl.id)) {
        setDuplicateWarning("This template is already included in this collection.");
        return;
      }
      onAddTemplate(tpl);
    }
  };

  const handleAttemptDuplicate = (tpl: CollectionTemplateItem) => {
    if (selectedIds.has(tpl.id)) {
      setDuplicateWarning("This template is already included in this collection.");
      setTimeout(() => setDuplicateWarning(null), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Available Templates Catalogue</span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Browse and add templates to this collection. Duplicates are automatically prevented.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name, category..."
            className="h-9 pl-9 pr-8 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Duplicate warning banner */}
      {duplicateWarning && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{duplicateWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setDuplicateWarning(null)}
            className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Templates Grid List */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 p-3 max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading templates catalogue...</div>
        ) : availableCatalog.length === 0 ? (
          <div className="p-8 text-center space-y-1">
            <Layers className="w-5 h-5 text-slate-300 dark:text-zinc-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No templates found.</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableCatalog.map((tpl) => {
              const isSelected = selectedIds.has(tpl.id);
              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    if (isSelected) {
                      handleAttemptDuplicate(tpl);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                    isSelected
                      ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs"
                      : "bg-white dark:bg-[#16181f] border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs"
                  }`}
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700/60">
                      {tpl.thumbnail ? (
                        <img
                          src={tpl.thumbnail}
                          alt={tpl.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <Layers className="w-4 h-4" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-600/80 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tpl.name}
                      </h6>
                      <span className="inline-block text-[10px] font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                        {tpl.category}
                      </span>
                    </div>
                  </div>

                  {/* Add / Selected button */}
                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(tpl);
                        }}
                        className="h-7 px-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 gap-1 rounded-lg"
                        title="Already selected in collection (click to remove)"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Included</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(tpl);
                        }}
                        className="h-7 px-2 text-[11px] font-semibold bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 gap-1 rounded-lg"
                        title="Add to collection"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
