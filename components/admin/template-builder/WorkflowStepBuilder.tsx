"use client";

import React, { useState } from "react";
import {
  ListOrdered,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Eye,
  Check,
  Sparkles,
  Tag,
  Image as ImageIcon,
  Sliders,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PromptEditor } from "./PromptEditor";
import { WorkflowStepItem } from "./types";

interface WorkflowStepBuilderProps {
  steps: WorkflowStepItem[];
  onChange: (updatedSteps: WorkflowStepItem[]) => void;
  categoryName: string;
}

export function WorkflowStepBuilder({
  steps,
  onChange,
  categoryName,
}: WorkflowStepBuilderProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(
    steps[0]?.id || null
  );

  const handleAddStep = () => {
    const nextNumber = steps.length + 1;
    const newStep: WorkflowStepItem = {
      id: `step-${Date.now()}`,
      stepNumber: nextNumber,
      title: `Step ${nextNumber.toString().padStart(2, "0")} Directive`,
      description: "Define the specific action and prompt execution for this workflow step.",
      prompt: `Execute step ${nextNumber}: Focus on [SUBJECT] and refine with [STYLE] parameters.`,
      inputVariables: ["[SUBJECT]", "[STYLE]"],
      output: "Expected artifact or generation output.",
      example: "High-fidelity candidate seed.",
    };

    const nextSteps = [...steps, newStep];
    onChange(nextSteps);
    setExpandedStepId(newStep.id);
  };

  const handleDuplicateStep = (index: number) => {
    const target = steps[index];
    if (!target) return;

    const duplicated: WorkflowStepItem = {
      ...target,
      id: `step-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };

    const nextSteps = [
      ...steps.slice(0, index + 1),
      duplicated,
      ...steps.slice(index + 1),
    ].map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    onChange(nextSteps);
    setExpandedStepId(duplicated.id);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert("A workflow must have at least one step.");
      return;
    }

    const nextSteps = steps
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    onChange(nextSteps);

    if (expandedStepId === steps[index]?.id) {
      setExpandedStepId(nextSteps[0]?.id || null);
    }
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const nextSteps = [...steps];
    const [moved] = nextSteps.splice(index, 1);
    nextSteps.splice(targetIndex, 0, moved);

    const renumbered = nextSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }));

    onChange(renumbered);
  };

  const handleUpdateStep = (
    index: number,
    updated: Partial<WorkflowStepItem>
  ) => {
    const nextSteps = [...steps];
    nextSteps[index] = { ...nextSteps[index], ...updated };
    onChange(nextSteps);
  };

  const toggleAll = () => {
    if (expandedStepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(steps[0]?.id || null);
    }
  };

  return (
    <section className="p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            03
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Prompt Workflow Builder ({steps.length} Steps)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every step holds an actual usable copyable AI prompt representing the creation journey.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="text-xs font-medium"
          >
            {expandedStepId ? "Collapse All" : "Expand First"}
          </Button>

          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleAddStep}
            className="text-xs font-bold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Workflow Step</span>
          </Button>
        </div>
      </div>

      {/* Step Cards List */}
      <div className="space-y-3.5">
        {steps.map((step, index) => {
          const isExpanded = expandedStepId === step.id;
          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "border-emerald-500/80 dark:border-emerald-500/80 bg-white dark:bg-[#111726] shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1422] hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Step Summary Header Bar */}
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {step.stepNumber.toString().padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {step.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Actions: Up, Down, Duplicate, Delete */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveStep(index, "up")}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move step up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === steps.length - 1}
                    onClick={() => handleMoveStep(index, "down")}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move step down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateStep(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Duplicate step"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#131B2A] space-y-4 animate-in fade-in duration-200">
                  {/* Step Title & Directive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Step Title / Objective
                      </label>
                      <Input
                        value={step.title}
                        onChange={(e) =>
                          handleUpdateStep(index, { title: e.target.value })
                        }
                        placeholder="e.g. Define Concept & Subject"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Directive & User Instructions
                      </label>
                      <Input
                        value={step.description}
                        onChange={(e) =>
                          handleUpdateStep(index, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief instruction on what this prompt generates..."
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Reusable PromptEditor for this Step */}
                  <PromptEditor
                    label={`Step ${step.stepNumber} Usable AI Prompt`}
                    value={step.prompt}
                    onChange={(val) =>
                      handleUpdateStep(index, { prompt: val })
                    }
                    placeholder={`Enter usable copyable prompt for Step ${step.stepNumber}...`}
                    helperText="This is the actual prompt users copy from AWA to run this workflow step."
                    suggestedVariables={[
                      "[SUBJECT]",
                      "[STYLE]",
                      "[ENVIRONMENT]",
                      "[TOPIC]",
                      "[AUDIENCE]",
                    ]}
                    minRows={4}
                    highlightCategory={`Step ${step.stepNumber}`}
                  />

                  {/* Output & Example */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Expected Output / Artifact
                      </label>
                      <Input
                        value={step.output}
                        onChange={(e) =>
                          handleUpdateStep(index, { output: e.target.value })
                        }
                        placeholder="e.g. Detailed concept breakdown or 4K candidate render"
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Output Example / Demonstration
                      </label>
                      <Input
                        value={step.example}
                        onChange={(e) =>
                          handleUpdateStep(index, { example: e.target.value })
                        }
                        placeholder="e.g. Ceramic espresso cup on volcanic rock"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Optional Preview Image & Pro Tip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Step Preview / Diagram Image URL (Optional)</span>
                      </label>
                      <Input
                        value={step.imageUrl || ""}
                        onChange={(e) =>
                          handleUpdateStep(index, { imageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pro Tip / Best Practice Note (Optional)</span>
                      </label>
                      <Input
                        value={step.notes || ""}
                        onChange={(e) =>
                          handleUpdateStep(index, { notes: e.target.value })
                        }
                        placeholder="e.g. Keep seed consistent across prompt passes for coherence."
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
