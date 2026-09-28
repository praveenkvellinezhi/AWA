"use client";

import React, { useState } from "react";
import { CollectionTemplateItem } from "@/lib/types/collection";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Layers,
  GripVertical,
  CheckCircle2,
} from "lucide-react";

interface SelectedTemplatesProps {
  templates: CollectionTemplateItem[];
  onReorder: (templates: CollectionTemplateItem[]) => void;
  onRemove: (templateId: string) => void;
}

export function SelectedTemplates({
  templates,
  onReorder,
  onRemove,
}: SelectedTemplatesProps) {
  const [templatePendingRemoval, setTemplatePendingRemoval] = useState<CollectionTemplateItem | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...templates];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    onReorder(next);
  };

  const moveDown = (index: number) => {
    if (index === templates.length - 1) return;
    const next = [...templates];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    onReorder(next);
  };

  const handleConfirmRemove = () => {
    if (templatePendingRemoval) {
      onRemove(templatePendingRemoval.id);
      setTemplatePendingRemoval(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Selected Templates in Collection</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold ml-1">
              {templates.length}
            </span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Use the Move Up and Move Down buttons to order templates as they should appear to users.
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] text-center space-y-2">
          <Layers className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            No templates selected yet.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mx-auto">
            Choose templates from the catalogue below to include them in this curated collection.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((tpl, index) => {
            const isFirst = index === 0;
            const isLast = index === templates.length - 1;
            const orderNum = (index + 1).toString().padStart(2, "0");

            return (
              <div
                key={tpl.id}
                className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#14161c] flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
              >
                {/* Order Index & Thumbnail & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-black px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {orderNum}
                    </span>
                  </div>

                  <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80">
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
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tpl.name}
                    </h5>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium truncate block">
                      {tpl.category}
                    </span>
                  </div>
                </div>

                {/* Actions: Move Up, Move Down, Remove */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isFirst}
                    onClick={() => moveUp(index)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isLast}
                    onClick={() => moveDown(index)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTemplatePendingRemoval(tpl)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Remove template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Template Removal (Requirement 28) */}
      <AlertDialog
        open={Boolean(templatePendingRemoval)}
        onOpenChange={(open) => !open && setTemplatePendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this template from the collection?</AlertDialogTitle>
            <AlertDialogDescription>
              {templatePendingRemoval && (
                <span>
                  &ldquo;{templatePendingRemoval.name}&rdquo; will be removed from this collection. It can be re-added at any time.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
