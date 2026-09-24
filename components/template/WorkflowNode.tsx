"use client";

import React from "react";
import { TemplateStep } from "@/lib/types";
import { Check } from "lucide-react";

interface WorkflowNodeProps {
  step: TemplateStep;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function WorkflowNode({
  step,
  isActive = false,
  isCompleted = false,
  onClick,
  className = "",
}: WorkflowNodeProps) {
  const orderFormatted = String(step.order || step.stepNumber || 1).padStart(2, "0");

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
        isActive
          ? "border-cyan-400 bg-white dark:bg-[#111624] shadow-lg ring-1 ring-cyan-400/40"
          : isCompleted
          ? "border-emerald-400/70 bg-emerald-50/40 dark:bg-[#0E151A]"
          : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#10131B] hover:border-slate-300"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-8 h-8 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-emerald-600 text-white"
              : isActive
              ? "bg-cyan-600 text-white"
              : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
          }`}
        >
          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : orderFormatted}
        </span>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {step.title}
          </h4>
          {step.description && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
              {step.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
