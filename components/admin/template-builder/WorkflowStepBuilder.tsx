"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Video,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  // Map of step ID to active media editor tab ("image" | "video")
  const [openMediaDrafts, setOpenMediaDrafts] = useState<
    Record<string, "image" | "video">
  >({});

  const handleAddStep = () => {
    const nextNumber = steps.length + 1;
    const newStep: WorkflowStepItem = {
      id: `step-${Date.now()}`,
      order: nextNumber,
      stepNumber: nextNumber,
      step: nextNumber,
      title: `Step ${nextNumber.toString().padStart(2, "0")} — Action Directive`,
      description: "Establish the actionable instructions for completing this step.",
      instruction: "Establish the actionable instructions for completing this step.",
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
    ].map((s, idx) => ({
      ...s,
      order: idx + 1,
      stepNumber: idx + 1,
      step: idx + 1,
    }));

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
      .map((s, idx) => ({
        ...s,
        order: idx + 1,
        stepNumber: idx + 1,
        step: idx + 1,
      }));

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
      order: idx + 1,
      stepNumber: idx + 1,
      step: idx + 1,
    }));

    onChange(renumbered);
  };

  const handleUpdateStep = (
    index: number,
    updated: Partial<WorkflowStepItem>
  ) => {
    const nextSteps = [...steps];
    const current = nextSteps[index];

    // Maintain backward compatibility with legacy fields while preserving untouched metadata
    const synced: Partial<WorkflowStepItem> = { ...updated };
    if (updated.title !== undefined) {
      synced.title = updated.title;
    }
    if (updated.description !== undefined) {
      synced.description = updated.description;
      synced.instruction = updated.description;
    }

    nextSteps[index] = { ...current, ...synced };
    onChange(nextSteps);
  };

  const handleMediaUrlChange = (
    index: number,
    type: "image" | "video",
    url: string
  ) => {
    const cleanUrl = url.trim();
    const current = steps[index];
    if (type === "image") {
      handleUpdateStep(index, {
        imageUrl: cleanUrl || undefined,
        videoUrl: undefined,
        mediaType: cleanUrl ? "image" : undefined,
        image: cleanUrl
          ? {
              url: cleanUrl,
              alt: current.title,
              caption: current.imageCaption || current.image?.caption || "",
            }
          : undefined,
      });
    } else {
      handleUpdateStep(index, {
        videoUrl: cleanUrl || undefined,
        imageUrl: undefined,
        image: undefined,
        mediaType: cleanUrl ? "video" : undefined,
      });
    }
  };

  const handleFileUpload = (
    index: number,
    type: "image" | "video",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "video" && file.size > 25 * 1024 * 1024) {
      alert(
        "Video file exceeds 25MB. For large videos, we recommend pasting an external URL (S3, Cloudinary, Vimeo, YouTube embed, etc.)."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;
      const current = steps[index];
      if (type === "image") {
        handleUpdateStep(index, {
          imageUrl: result,
          videoUrl: undefined,
          mediaType: "image",
          image: {
            url: result,
            alt: current.title,
            caption: current.imageCaption || current.image?.caption || "",
          },
        });
      } else {
        handleUpdateStep(index, {
          videoUrl: result,
          imageUrl: undefined,
          image: undefined,
          mediaType: "video",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const current = steps[index];
    handleUpdateStep(index, {
      imageCaption: caption,
      image: current.imageUrl
        ? {
            url: current.imageUrl,
            alt: current.title,
            caption,
          }
        : undefined,
    });
  };

  const handleRemoveMedia = (index: number, stepId: string) => {
    handleUpdateStep(index, {
      imageUrl: undefined,
      videoUrl: undefined,
      mediaType: undefined,
      image: undefined,
      imageCaption: undefined,
    });
    setOpenMediaDrafts((prev) => {
      const copy = { ...prev };
      delete copy[stepId];
      return copy;
    });
  };

  const toggleAll = () => {
    if (expandedStepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(steps[0]?.id || null);
    }
  };

  return (
    <section className="p-4 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            03
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Workflow Steps ({steps.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actionable step-by-step instructions for executing this workflow in {categoryName}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="h-8 text-xs font-medium"
          >
            {expandedStepId ? "Collapse All" : "Expand First"}
          </Button>

          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleAddStep}
            className="h-8 text-xs font-bold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Step</span>
          </Button>
        </div>
      </div>

      {/* Step Cards List */}
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isExpanded = expandedStepId === step.id;
          const stepNumStr = (step.order || step.stepNumber || index + 1)
            .toString()
            .padStart(2, "0");

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "border-emerald-500/80 dark:border-emerald-500/80 bg-white dark:bg-[#111726] shadow-sm"
                  : "border-slate-200/90 dark:border-slate-800/90 bg-slate-50/40 dark:bg-[#0E1422] hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Compact Card Header */}
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                className="px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
              >
                {/* Step Number + Title + Media Indicator */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                    {stepNumStr}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {step.title || `Step ${stepNumStr}`}
                  </span>

                  {/* Media Indicator Badges */}
                  {step.videoUrl ? (
                    <span
                      title="Video attached"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0"
                    >
                      <Video className="w-3 h-3" />
                      <span>VID</span>
                    </span>
                  ) : (step.imageUrl || step.image?.url) ? (
                    <span
                      title="Image attached"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>IMG</span>
                    </span>
                  ) : null}
                </div>

                {/* Header Actions: Up, Down, Duplicate, Delete, Chevron */}
                <div
                  className="flex items-center gap-0.5 sm:gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveStep(index, "up")}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                    title="Move step up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === steps.length - 1}
                    onClick={() => handleMoveStep(index, "down")}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                    title="Move step down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateStep(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate step"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

                  <button
                    type="button"
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Step Expanded Body: ONLY 2 ESSENTIAL FIELDS + OPTIONAL MEDIA */}
              {isExpanded && (
                <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#131B2A] space-y-3.5 animate-in fade-in duration-150">
                  {/* Field 1: Step Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Step Title</span>
                      <span className="text-emerald-500">*</span>
                    </label>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        handleUpdateStep(index, { title: e.target.value })
                      }
                      placeholder="e.g. Define Image Concept & Subject"
                      className="h-9 text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus-visible:ring-emerald-500"
                    />
                  </div>

                  {/* Field 2: Step Instructions */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Step Instructions</span>
                      <span className="text-emerald-500">*</span>
                    </label>
                    <Textarea
                      value={step.description || step.instruction || ""}
                      onChange={(e) =>
                        handleUpdateStep(index, {
                          description: e.target.value,
                          instruction: e.target.value,
                        })
                      }
                      placeholder="Establish the core subject, focal point, composition, and narrative concept for the image."
                      rows={5}
                      className="text-xs sm:text-sm leading-relaxed border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus-visible:ring-emerald-500 font-normal min-h-[110px]"
                    />
                  </div>

                  {/* Field 3: Optional Media Attachment (Image or Video) */}
                  {(() => {
                    const stepImg = step.image?.url || step.imageUrl || "";
                    const stepVideo = step.videoUrl || "";
                    const hasExistingMedia = Boolean(stepImg || stepVideo);
                    const draftType = openMediaDrafts[step.id];
                    const isMediaOpen = hasExistingMedia || Boolean(draftType);
                    const activeMediaType: "image" | "video" =
                      step.mediaType || (stepVideo ? "video" : stepImg ? "image" : draftType || "image");

                    if (!isMediaOpen) {
                      return (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMediaDrafts((prev) => ({ ...prev, [step.id]: "image" }))
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700/80 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50/50 dark:bg-[#0E1422]/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all duration-150 group"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            <span>+ Add Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMediaDrafts((prev) => ({ ...prev, [step.id]: "video" }))
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700/80 hover:border-blue-500/80 dark:hover:border-blue-500/80 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50/50 dark:bg-[#0E1422]/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all duration-150 group"
                          >
                            <Video className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span>+ Add Video</span>
                          </button>
                        </div>
                      );
                    }

                    const currentMediaUrl = activeMediaType === "video" ? stepVideo : stepImg;

                    return (
                      <div className="pt-1.5">
                        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#0E1422] space-y-3">
                          {/* Media Header: Mode Toggle + Remove */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 pb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span>Step Media</span>
                                <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                              </span>

                              {/* Segmented Type Toggle: Image vs Video */}
                              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[11px] font-semibold ml-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMediaDrafts((prev) => ({ ...prev, [step.id]: "image" }));
                                    if (activeMediaType !== "image") {
                                      handleUpdateStep(index, {
                                        mediaType: "image",
                                        imageUrl: currentMediaUrl || undefined,
                                        videoUrl: undefined,
                                        image: currentMediaUrl
                                          ? {
                                              url: currentMediaUrl,
                                              alt: step.title,
                                              caption: step.imageCaption || step.image?.caption || "",
                                            }
                                          : undefined,
                                      });
                                    }
                                  }}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                                    activeMediaType === "image"
                                      ? "bg-white dark:bg-[#131B2A] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Image</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMediaDrafts((prev) => ({ ...prev, [step.id]: "video" }));
                                    if (activeMediaType !== "video") {
                                      handleUpdateStep(index, {
                                        mediaType: "video",
                                        videoUrl: currentMediaUrl || undefined,
                                        imageUrl: undefined,
                                        image: undefined,
                                      });
                                    }
                                  }}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                                    activeMediaType === "video"
                                      ? "bg-white dark:bg-[#131B2A] text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Video</span>
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(index, step.id)}
                              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1 rounded"
                              title="Remove media from step"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>

                          {/* Inputs: URL & Upload File */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2 relative">
                              <Input
                                value={currentMediaUrl}
                                onChange={(e) =>
                                  handleMediaUrlChange(index, activeMediaType, e.target.value)
                                }
                                placeholder={
                                  activeMediaType === "video"
                                    ? "Paste video URL (mp4, webm, embed link...)"
                                    : "Paste image URL (https://...)"
                                }
                                className="h-8 text-xs border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#131B2A] text-slate-900 dark:text-white focus-visible:ring-emerald-500 pr-8"
                              />
                              {currentMediaUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMediaUrlChange(index, activeMediaType, "")
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div>
                              <label className="h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#131B2A] hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                                <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                                <span className="truncate">
                                  Upload {activeMediaType === "video" ? "Video" : "Image"}
                                </span>
                                <input
                                  type="file"
                                  accept={activeMediaType === "video" ? "video/*" : "image/*"}
                                  onChange={(e) => handleFileUpload(index, activeMediaType, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {/* Optional Caption */}
                          <div className="space-y-1">
                            <Input
                              value={step.imageCaption || step.image?.caption || ""}
                              onChange={(e) => handleCaptionChange(index, e.target.value)}
                              placeholder="Media caption or guideline note (e.g. 'Reference composition benchmark')"
                              className="h-7 text-[11px] border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#131B2A] text-slate-900 dark:text-white focus-visible:ring-emerald-500"
                            />
                          </div>

                          {/* Live Visual Preview */}
                          {currentMediaUrl && (
                            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-900 p-1">
                              {activeMediaType === "video" ? (
                                <video
                                  src={currentMediaUrl}
                                  controls
                                  className="max-h-48 w-full object-contain mx-auto rounded"
                                />
                              ) : (
                                <div className="relative max-h-48 w-full flex items-center justify-center overflow-hidden rounded bg-slate-950/60">
                                  <img
                                    src={currentMediaUrl}
                                    alt={step.title}
                                    className="max-h-48 w-auto object-contain"
                                    onError={(e) => {
                                      // graceful broken image fallback
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Step dashed button at end of list */}
        <button
          type="button"
          onClick={handleAddStep}
          className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors group"
        >
          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Add Step {(steps.length + 1).toString().padStart(2, "0")}</span>
        </button>
      </div>
    </section>
  );
}
