"use client";

import React from "react";
import { TemplateStep } from "@/lib/types";
import { WorkflowStep } from "./WorkflowStep";
import { ListOrdered, CheckCircle2 } from "lucide-react";

export interface TemplateWorkflowProps {
  steps: TemplateStep[];
  mode?: "user" | "admin" | "preview" | "compact";
  activeStepIndex?: number;
  completedSteps?: number[];
  onToggleComplete?: (stepOrder: number) => void;
  onSelectStep?: (index: number) => void;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
  className?: string;
  showSummaryHeader?: boolean;
}

export function TemplateWorkflow({
  steps,
  mode = "user",
  activeStepIndex = 0,
  completedSteps = [],
  onToggleComplete,
  onSelectStep,
  onImageClick,
  className = "",
  showSummaryHeader = true,
}: TemplateWorkflowProps) {
  // Always sort by order to guarantee workflow sequence
  const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));

  const completedCount = completedSteps.filter((order) =>
    sortedSteps.some((s) => (s.order || s.stepNumber) === order)
  ).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Optional Summary Header Bar */}
      {showSummaryHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Workflow & Execution Steps</span>
                <span className="text-xs font-mono font-normal text-slate-500 dark:text-zinc-400">
                  ({sortedSteps.length} Steps)
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Detailed step-by-step instructions on how to create this asset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {mode === "user" && onToggleComplete && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {completedCount}/{sortedSteps.length} Done
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Render Steps */}
      <div className="space-y-3.5">
        {sortedSteps.map((step, idx) => {
          const stepOrder = step.order || step.stepNumber || idx + 1;
          const isCompleted = completedSteps.includes(stepOrder);
          const isActive = activeStepIndex === idx;

          return (
            <WorkflowStep
              key={step.id || `step-${stepOrder}-${idx}`}
              step={step}
              mode={mode}
              isActive={isActive}
              isCompleted={isCompleted}
              onToggleComplete={onToggleComplete}
              onSelectStep={() => onSelectStep?.(idx)}
              onImageClick={onImageClick}
            />
          );
        })}
      </div>
    </div>
  );
}
