"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  UploadCloud,
  X,
  Sliders,
  Settings2,
  CheckCircle2,
  FileText,
  Camera,
  Play,
  Copy,
  Info,
  Link as LinkIcon,
  HelpCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  WorkflowStepItem,
  StepAiWorkflowConfig,
  StepGenerationType,
  VideoGenerationMethod,
  ImageGenerationMethod,
  AssetSourceType,
  StepReferenceImage,
  StepStoryboardImage,
  StepInputAsset,
  StepMotionInstructions,
  StepSettings,
  StepOutputConfig,
} from "./types";
import {
  AI_VIDEO_TOOLS,
  AI_IMAGE_TOOLS,
  VIDEO_METHODS,
  IMAGE_METHODS,
  REFERENCE_PURPOSES,
  IMAGE_USAGES,
  TRANSFORMATION_OPTIONS,
  createInitialAiWorkflow,
  getDefaultInstructionsForVideoMethod,
  getDefaultInstructionsForImageMethod,
} from "./ai-workflow-defaults";

interface StepAiWorkflowEditorProps {
  step: WorkflowStepItem;
  stepIndex: number;
  allSteps: WorkflowStepItem[];
  onChange: (updated: Partial<WorkflowStepItem>) => void;
}

export function StepAiWorkflowEditor({
  step,
  stepIndex,
  allSteps,
  onChange,
}: StepAiWorkflowEditorProps) {
  // Current AI Workflow config or initialize default
  const aiWorkflow: StepAiWorkflowConfig =
    step.aiWorkflow || {
      generationType: "normal",
      expectedOutput: step.output || "",
    };

  const genType = aiWorkflow.generationType || "normal";
  const videoMethod = aiWorkflow.videoMethod || "text-to-video";
  const imageMethod = aiWorkflow.imageMethod || "text-to-image";

  // Available previous steps for dependency link
  const previousSteps = allSteps.slice(0, stepIndex);
  // Available next steps for output handoff
  const nextSteps = allSteps.slice(stepIndex + 1);

  // Helper to commit updates to step & aiWorkflow
  const updateAiWorkflow = (
    updater: Partial<StepAiWorkflowConfig> | ((prev: StepAiWorkflowConfig) => StepAiWorkflowConfig)
  ) => {
    const nextConfig =
      typeof updater === "function" ? updater(aiWorkflow) : { ...aiWorkflow, ...updater };

    const stepUpdates: Partial<WorkflowStepItem> = {
      aiWorkflow: nextConfig,
    };

    // Keep primary legacy fields in sync for backward compatibility
    if (nextConfig.generationType === "normal") {
      stepUpdates.output = nextConfig.expectedOutput || step.output;
    } else {
      if (nextConfig.output?.name) {
        stepUpdates.output = nextConfig.output.name;
      }
      if (nextConfig.prompt) {
        stepUpdates.prompt = nextConfig.prompt;
      }
      if (nextConfig.generationType === "video") {
        stepUpdates.mediaType = "video";
      } else if (nextConfig.generationType === "image") {
        stepUpdates.mediaType = "image";
      }
    }

    onChange(stepUpdates);
  };

  // Generation Type Switch Handler
  const handleGenerationTypeChange = (newType: StepGenerationType) => {
    if (newType === genType) return;
    const initial = createInitialAiWorkflow(newType, stepIndex + 1);
    updateAiWorkflow(initial);
  };

  // Video Method Switch Handler
  const handleVideoMethodChange = (newMethod: VideoGenerationMethod) => {
    const defaultInstructions = getDefaultInstructionsForVideoMethod(
      newMethod,
      aiWorkflow.aiTool || "Kling"
    );

    updateAiWorkflow((prev) => {
      const stepNumStr = (stepIndex + 1).toString().padStart(2, "0");
      const nextNumStr = (stepIndex + 2).toString().padStart(2, "0");

      let updatedInputAsset: StepInputAsset | undefined = prev.inputAsset;
      let updatedRefs: StepReferenceImage[] | undefined = prev.referenceImages;
      let updatedStoryboards: StepStoryboardImage[] | undefined = prev.storyboardImages;

      // Ensure input image exists for image-dependent methods
      if (
        (newMethod === "image-to-video" || newMethod === "text-image-to-video") &&
        !updatedInputAsset
      ) {
        const prevStep = previousSteps[previousSteps.length - 1];
        updatedInputAsset = {
          sourceType: prevStep ? "previous-step" : "upload",
          sourceStepId: prevStep?.id,
          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
          sourceStepTitle: prevStep?.title,
          assetName: prevStep?.output || `hero-image-${stepNumStr}.png`,
          usage: "starting-frame",
        };
      }

      // Ensure reference images exist for reference-dependent methods
      if (
        (newMethod === "reference-image-to-video" || newMethod === "text-reference-images-to-video") &&
        (!updatedRefs || updatedRefs.length === 0)
      ) {
        updatedRefs = [
          {
            id: `ref-1-${Date.now()}`,
            label: "Reference Image 01",
            purpose: "character",
            instruction: "Upload this image as the character reference. Use it to preserve facial features, hairstyle, and wardrobe.",
          },
          {
            id: `ref-2-${Date.now() + 1}`,
            label: "Reference Image 02",
            purpose: "environment",
            instruction: "Upload this image as the environment reference for lighting direction, spatial setting, and atmosphere.",
          },
        ];
      }

      // Ensure storyboard images exist for multiple images method
      if (newMethod === "multiple-images-to-video" && (!updatedStoryboards || updatedStoryboards.length === 0)) {
        updatedStoryboards = [
          {
            id: `sb-1-${Date.now()}`,
            order: 1,
            label: "Image 01",
            purpose: "Opening scene establishing shot",
            durationSeconds: "2.5s",
            transitionInstruction: "Camera begins pushing slowly forward.",
          },
          {
            id: `sb-2-${Date.now() + 1}`,
            order: 2,
            label: "Image 02",
            purpose: "Middle scene action climax",
            durationSeconds: "3.0s",
            transitionInstruction: "Cross-dissolve matching character momentum.",
          },
          {
            id: `sb-3-${Date.now() + 2}`,
            order: 3,
            label: "Image 03",
            purpose: "Ending scene closing resolution",
            durationSeconds: "2.5s",
            transitionInstruction: "Slow fade to key focal point.",
          },
        ];
      }

      // Ensure video-to-video has source video asset
      if (newMethod === "video-to-video" && !updatedInputAsset) {
        const prevStep = previousSteps[previousSteps.length - 1];
        updatedInputAsset = {
          sourceType: prevStep ? "previous-step" : "upload",
          sourceStepId: prevStep?.id,
          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
          sourceStepTitle: prevStep?.title,
          assetName: prevStep?.output || `source-footage-${stepNumStr}.mp4`,
          usage: "source-video",
        };
      }

      return {
        ...prev,
        videoMethod: newMethod,
        inputAsset: updatedInputAsset,
        referenceImages: updatedRefs,
        storyboardImages: updatedStoryboards,
        generationInstructions: defaultInstructions,
        output: prev.output || {
          type: "video",
          format: "MP4",
          name: `scene-${stepNumStr}-animation.mp4`,
          usage: `Save this video and use it as the visual input in Step ${nextNumStr}.`,
          nextStepNumber: stepIndex + 2,
        },
      };
    });
  };

  // Image Method Switch Handler
  const handleImageMethodChange = (newMethod: ImageGenerationMethod) => {
    const defaultInstructions = getDefaultInstructionsForImageMethod(
      newMethod,
      aiWorkflow.aiTool || "Midjourney v6.1"
    );

    updateAiWorkflow((prev) => {
      const stepNumStr = (stepIndex + 1).toString().padStart(2, "0");
      let updatedInputAsset: StepInputAsset | undefined = prev.inputAsset;
      let updatedRefs: StepReferenceImage[] | undefined = prev.referenceImages;

      if (newMethod === "image-to-image" && !updatedInputAsset) {
        const prevStep = previousSteps[previousSteps.length - 1];
        updatedInputAsset = {
          sourceType: prevStep ? "previous-step" : "upload",
          sourceStepId: prevStep?.id,
          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
          sourceStepTitle: prevStep?.title,
          assetName: prevStep?.output || `input-art-${stepNumStr}.png`,
          usage: "starting-frame",
        };
      }

      if (
        (newMethod === "reference-image-to-image" ||
          newMethod === "multiple-reference-images" ||
          newMethod === "text-reference-image") &&
        (!updatedRefs || updatedRefs.length === 0)
      ) {
        updatedRefs = [
          {
            id: `ref-img-1-${Date.now()}`,
            label: "Reference Image 01",
            purpose: "character",
            instruction: "Upload as the subject reference. Preserves likeness, hair, and clothing.",
          },
        ];
      }

      return {
        ...prev,
        imageMethod: newMethod,
        inputAsset: updatedInputAsset,
        referenceImages: updatedRefs,
        generationInstructions: defaultInstructions,
      };
    });
  };

  // Update Settings helper
  const updateSettings = (key: keyof StepSettings, value: string) => {
    updateAiWorkflow((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  // Update Motion Instructions helper
  const updateMotion = (key: keyof StepMotionInstructions, value: string) => {
    updateAiWorkflow((prev) => ({
      ...prev,
      motion: {
        ...prev.motion,
        [key]: value,
      },
    }));
  };

  // Update Output Config helper
  const updateOutput = (key: keyof StepOutputConfig, value: any) => {
    updateAiWorkflow((prev) => ({
      ...prev,
      output: {
        type: prev.output?.type || (genType === "video" ? "video" : "image"),
        format: prev.output?.format || (genType === "video" ? "MP4" : "PNG"),
        name: prev.output?.name || "",
        usage: prev.output?.usage || "",
        ...prev.output,
        [key]: value,
      },
    }));
  };

  // Update Input Asset helper
  const updateInputAsset = (patch: Partial<StepInputAsset>) => {
    updateAiWorkflow((prev) => ({
      ...prev,
      inputAsset: {
        sourceType: "upload",
        ...prev.inputAsset,
        ...patch,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. STEP TYPE / GENERATION TYPE SELECTOR (REQUIRED) */}
      {/* ========================================================================= */}
      <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E1422] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Step Generation Type</span>
              <span className="text-emerald-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select whether this step is a standard manual instruction, an AI image generation, or a video generation workflow.
            </p>
          </div>

          {/* Segmented Generation Type Selector */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => handleGenerationTypeChange("normal")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                genType === "normal"
                  ? "bg-white dark:bg-[#131B2A] text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Normal Instruction</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerationTypeChange("image")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                genType === "image"
                  ? "bg-white dark:bg-[#131B2A] text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Image Generation</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerationTypeChange("video")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                genType === "video"
                  ? "bg-white dark:bg-[#131B2A] text-purple-600 dark:text-purple-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5 text-purple-500" />
              <span>Video Generation</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NORMAL INSTRUCTION MODE: SHOW ONLY TITLE, INSTRUCTIONS, EXPECTED OUTPUT */}
      {/* ========================================================================= */}
      {genType === "normal" && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {/* Step Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Step Title</span>
              <span className="text-emerald-500">*</span>
            </label>
            <Input
              value={step.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Set Up Project Workspace & Environment"
              className="h-9 text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus-visible:ring-emerald-500"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Instructions</span>
              <span className="text-emerald-500">*</span>
            </label>
            <Textarea
              value={step.description || step.instruction || ""}
              onChange={(e) =>
                onChange({
                  description: e.target.value,
                  instruction: e.target.value,
                })
              }
              placeholder="Provide clear, actionable, step-by-step instructions for completing this manual step."
              rows={4}
              className="text-xs sm:text-sm leading-relaxed border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus-visible:ring-emerald-500 min-h-[90px]"
            />
          </div>

          {/* Expected Output */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Expected Output / Deliverable</span>
            </label>
            <Input
              value={aiWorkflow.expectedOutput || step.output || ""}
              onChange={(e) => {
                const val = e.target.value;
                updateAiWorkflow({ expectedOutput: val });
                onChange({ output: val });
              }}
              placeholder="e.g. Clean workspace configured with all required dependencies installed."
              className="h-9 text-xs border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus-visible:ring-emerald-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIDEO GENERATION MODE */}
      {/* ========================================================================= */}
      {genType === "video" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Section: Video Method & AI Tool Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10">
            {/* Field: Generation Method */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Video Generation Method</span>
                  <span className="text-purple-500">*</span>
                </span>
                <Badge variant="outline" className="text-[10px] font-mono text-purple-600 dark:text-purple-400 border-purple-500/30">
                  {VIDEO_METHODS.find((m) => m.id === videoMethod)?.badge || "Video Method"}
                </Badge>
              </label>

              <Select
                value={videoMethod}
                onValueChange={(val) => handleVideoMethodChange(val as VideoGenerationMethod)}
              >
                <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-[#0E1422] border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select Video Method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700">
                  {VIDEO_METHODS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{m.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{m.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field: AI Video Tool */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>AI Video Tool</span>
                <span className="text-purple-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Select
                  value={aiWorkflow.aiTool || "Kling"}
                  onValueChange={(val) => updateAiWorkflow({ aiTool: val })}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-[#0E1422] border-slate-200 dark:border-slate-700 flex-1">
                    <SelectValue placeholder="Select AI Tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700">
                    {AI_VIDEO_TOOLS.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={aiWorkflow.aiTool || ""}
                  onChange={(e) => updateAiWorkflow({ aiTool: e.target.value })}
                  placeholder="Or custom tool name..."
                  className="h-9 text-xs flex-1 border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422]"
                />
              </div>
            </div>
          </div>

          {/* Step Title for Video Step */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Step Title</span>
              <span className="text-purple-500">*</span>
            </label>
            <Input
              value={step.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Generate Hero Scene with Kling"
              className="h-9 text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white"
            />
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC SUBSECTION: INPUT / REFERENCE ASSET */}
          {/* ========================================================================= */}

          {/* 1. Single Input Image (for Image to Video & Text + Image to Video) */}
          {(videoMethod === "image-to-video" || videoMethod === "text-image-to-video") && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                  <span>Input Image Configuration</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Required input for {VIDEO_METHODS.find((m) => m.id === videoMethod)?.badge}
                </span>
              </div>

              {/* Asset Source & Step Dependency Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Input Source
                  </label>
                  <Select
                    value={aiWorkflow.inputAsset?.sourceType || "previous-step"}
                    onValueChange={(val: string) => {
                      const srcType = val as AssetSourceType;
                      if (srcType === "previous-step") {
                        const prevStep = previousSteps[previousSteps.length - 1];
                        updateInputAsset({
                          sourceType: "previous-step",
                          sourceStepId: prevStep?.id,
                          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
                          sourceStepTitle: prevStep?.title,
                          assetName: prevStep?.output || prevStep?.title || "Output from Previous Step",
                        });
                      } else {
                        updateInputAsset({ sourceType: srcType });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827]">
                      <SelectItem value="previous-step" className="text-xs">Previous Step Output</SelectItem>
                      <SelectItem value="specific-step" className="text-xs">Specific Step</SelectItem>
                      <SelectItem value="upload" className="text-xs">Upload New Asset</SelectItem>
                      <SelectItem value="library" className="text-xs">Existing Library Asset</SelectItem>
                      <SelectItem value="user-provided" className="text-xs">User Provided Asset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* If Specific Step or Previous Step is selected */}
                {aiWorkflow.inputAsset?.sourceType === "specific-step" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Select Dependency Step
                    </label>
                    <Select
                      value={aiWorkflow.inputAsset?.sourceStepId || ""}
                      onValueChange={(val) => {
                        const target = previousSteps.find((s) => s.id === val);
                        if (target) {
                          updateInputAsset({
                            sourceStepId: target.id,
                            sourceStepNumber: target.order || target.stepNumber,
                            sourceStepTitle: target.title,
                            assetName: target.output || `${target.title}.png`,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Pick a previous step..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#111827]">
                        {previousSteps.map((ps) => (
                          <SelectItem key={ps.id} value={ps.id} className="text-xs">
                            Step {(ps.order || ps.stepNumber).toString().padStart(2, "0")} — {ps.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : aiWorkflow.inputAsset?.sourceType === "previous-step" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Automatic Dependency
                    </label>
                    <div className="h-8 px-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        Output from Step{" "}
                        {previousSteps.length > 0
                          ? (previousSteps[previousSteps.length - 1].order || previousSteps.length).toString().padStart(2, "0")
                          : "01"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Asset File Name / URL
                    </label>
                    <Input
                      value={aiWorkflow.inputAsset?.assetName || aiWorkflow.inputAsset?.url || ""}
                      onChange={(e) => updateInputAsset({ assetName: e.target.value, url: e.target.value })}
                      placeholder="e.g. hero-image.png or URL"
                      className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                    />
                  </div>
                )}
              </div>

              {/* Image Usage and Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Image Usage in Video
                  </label>
                  <Select
                    value={aiWorkflow.inputAsset?.usage || "starting-frame"}
                    onValueChange={(val) => updateInputAsset({ usage: val })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select Usage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827]">
                      {IMAGE_USAGES.map((u) => (
                        <SelectItem key={u.value} value={u.value} className="text-xs">
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Guideline / Usage Note
                  </label>
                  <Input
                    value={aiWorkflow.inputAsset?.notes || ""}
                    onChange={(e) => updateInputAsset({ notes: e.target.value })}
                    placeholder="e.g. Use the image generated in Step 03 as starting frame."
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Reference Images (for Reference Image to Video & Text + Reference Images to Video) */}
          {(videoMethod === "reference-image-to-video" || videoMethod === "text-reference-images-to-video") && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>Reference Images ({aiWorkflow.referenceImages?.length || 0})</span>
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Define each reference image, its exact role (character, environment, style), and how to use it.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextNum = (aiWorkflow.referenceImages?.length || 0) + 1;
                    const newRef: StepReferenceImage = {
                      id: `ref-${Date.now()}`,
                      label: `Reference Image ${nextNum.toString().padStart(2, "0")}`,
                      purpose: nextNum === 1 ? "character" : nextNum === 2 ? "environment" : "style",
                      instruction: `Upload this reference image to preserve the designated ${nextNum === 1 ? "character identity" : "environment"}.`,
                    };
                    updateAiWorkflow((prev) => ({
                      ...prev,
                      referenceImages: [...(prev.referenceImages || []), newRef],
                    }));
                  }}
                  className="h-7 text-xs gap-1 border-purple-500/30 text-purple-600 dark:text-purple-400"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Reference Image</span>
                </Button>
              </div>

              {/* Reference Cards */}
              <div className="space-y-2.5">
                {(aiWorkflow.referenceImages || []).map((ref, rIdx) => (
                  <div
                    key={ref.id || rIdx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          REF {String(rIdx + 1).padStart(2, "0")}
                        </span>
                        <Input
                          value={ref.label || `Reference Image ${String(rIdx + 1).padStart(2, "0")}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, label: val } : item
                              ),
                            }));
                          }}
                          className="h-7 text-xs font-semibold max-w-[200px]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Purpose Selector */}
                        <Select
                          value={ref.purpose}
                          onValueChange={(val) => {
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, purpose: val } : item
                              ),
                            }));
                          }}
                        >
                          <SelectTrigger className="h-7 text-xs w-[180px] bg-slate-50 dark:bg-[#0E1422]">
                            <SelectValue placeholder="Select Purpose" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#111827]">
                            {REFERENCE_PURPOSES.map((p) => (
                              <SelectItem key={p.value} value={p.value} className="text-xs">
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <button
                          type="button"
                          onClick={() => {
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.filter((_, idx) => idx !== rIdx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          title="Remove reference image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image URL / Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <Input
                          value={ref.url || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, url: val } : item
                              ),
                            }));
                          }}
                          placeholder="Paste reference image URL or upload..."
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                          <UploadCloud className="w-3 h-3 text-slate-400" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                if (!result) return;
                                updateAiWorkflow((prev) => ({
                                  ...prev,
                                  referenceImages: prev.referenceImages?.map((item, idx) =>
                                    idx === rIdx ? { ...item, url: result } : item
                                  ),
                                }));
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Explicit Usage Instruction */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        Explicit Guide Instruction for this Reference:
                      </label>
                      <Input
                        value={ref.instruction || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateAiWorkflow((prev) => ({
                            ...prev,
                            referenceImages: prev.referenceImages?.map((item, idx) =>
                              idx === rIdx ? { ...item, instruction: val } : item
                            ),
                          }));
                        }}
                        placeholder="e.g. Upload Reference Image 01 as the character reference to preserve facial features."
                        className="h-7 text-xs bg-slate-50/50 dark:bg-[#0E1422]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Multiple Storyboard Images (for Multiple Images to Video) */}
          {videoMethod === "multiple-images-to-video" && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    <span>Storyboard Keyframe Images ({aiWorkflow.storyboardImages?.length || 0})</span>
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Define opening, middle, and ending keyframes with durations and transition instructions.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextNum = (aiWorkflow.storyboardImages?.length || 0) + 1;
                    const newSb: StepStoryboardImage = {
                      id: `sb-${Date.now()}`,
                      order: nextNum,
                      label: `Image ${nextNum.toString().padStart(2, "0")}`,
                      purpose: nextNum === 1 ? "Opening scene" : nextNum === 2 ? "Middle scene" : "Ending scene",
                      durationSeconds: "2.5s",
                      transitionInstruction: "Smooth camera motion into next frame.",
                    };
                    updateAiWorkflow((prev) => ({
                      ...prev,
                      storyboardImages: [...(prev.storyboardImages || []), newSb],
                    }));
                  }}
                  className="h-7 text-xs gap-1 border-purple-500/30 text-purple-600 dark:text-purple-400"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Keyframe</span>
                </Button>
              </div>

              {/* Keyframe Cards */}
              <div className="space-y-2.5">
                {(aiWorkflow.storyboardImages || []).map((sb, sbIdx) => (
                  <div
                    key={sb.id || sbIdx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {sbIdx + 1}
                        </span>
                        <Input
                          value={sb.label || `Image ${String(sbIdx + 1).padStart(2, "0")}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              storyboardImages: prev.storyboardImages?.map((item, idx) =>
                                idx === sbIdx ? { ...item, label: val } : item
                              ),
                            }));
                          }}
                          className="h-7 text-xs font-semibold max-w-[140px]"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <Input
                          value={sb.purpose || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              storyboardImages: prev.storyboardImages?.map((item, idx) =>
                                idx === sbIdx ? { ...item, purpose: val } : item
                              ),
                            }));
                          }}
                          placeholder="Purpose: e.g. Opening scene"
                          className="h-7 text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Input
                          value={sb.durationSeconds || "2.5s"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              storyboardImages: prev.storyboardImages?.map((item, idx) =>
                                idx === sbIdx ? { ...item, durationSeconds: val } : item
                              ),
                            }));
                          }}
                          placeholder="Duration"
                          className="h-7 text-xs w-20 text-center font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              storyboardImages: prev.storyboardImages?.filter((_, idx) => idx !== sbIdx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={sb.url || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateAiWorkflow((prev) => ({
                            ...prev,
                            storyboardImages: prev.storyboardImages?.map((item, idx) =>
                              idx === sbIdx ? { ...item, url: val } : item
                            ),
                          }));
                        }}
                        placeholder="Image URL or filename..."
                        className="h-7 text-xs font-mono"
                      />
                      <Input
                        value={sb.transitionInstruction || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateAiWorkflow((prev) => ({
                            ...prev,
                            storyboardImages: prev.storyboardImages?.map((item, idx) =>
                              idx === sbIdx ? { ...item, transitionInstruction: val } : item
                            ),
                          }));
                        }}
                        placeholder="Transition / motion between images..."
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Video-to-Video Source & Transformation */}
          {videoMethod === "video-to-video" && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-purple-500" />
                  <span>Source Video & Transformation</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Video-to-Video Transformation Controls
                </span>
              </div>

              {/* Source Video Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Source Video Input
                  </label>
                  <Select
                    value={aiWorkflow.inputAsset?.sourceType || "previous-step"}
                    onValueChange={(val: string) => {
                      const srcType = val as AssetSourceType;
                      if (srcType === "previous-step") {
                        const prevStep = previousSteps[previousSteps.length - 1];
                        updateInputAsset({
                          sourceType: "previous-step",
                          sourceStepId: prevStep?.id,
                          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
                          sourceStepTitle: prevStep?.title,
                          assetName: prevStep?.output || "Source Video Footage",
                          usage: "source-video",
                        });
                      } else {
                        updateInputAsset({ sourceType: srcType, usage: "source-video" });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A]">
                      <SelectValue placeholder="Select Video Source" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827]">
                      <SelectItem value="previous-step" className="text-xs">Previous Step Video Output</SelectItem>
                      <SelectItem value="specific-step" className="text-xs">Specific Step Video</SelectItem>
                      <SelectItem value="upload" className="text-xs">Upload Video File</SelectItem>
                      <SelectItem value="library" className="text-xs">Existing Video Asset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Video URL or Asset Name
                  </label>
                  <Input
                    value={aiWorkflow.inputAsset?.assetName || aiWorkflow.inputAsset?.url || ""}
                    onChange={(e) => updateInputAsset({ assetName: e.target.value, url: e.target.value })}
                    placeholder="e.g. source-footage.mp4"
                    className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                  />
                </div>
              </div>

              {/* Optional Style Reference Image */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Reference / Style Image (Optional)</span>
                  <span className="text-[10px] text-slate-400">Used to guide target aesthetic</span>
                </label>
                <Input
                  value={aiWorkflow.styleReferenceImage?.url || ""}
                  onChange={(e) =>
                    updateAiWorkflow((prev) => ({
                      ...prev,
                      styleReferenceImage: {
                        ...prev.styleReferenceImage,
                        url: e.target.value,
                      },
                    }))
                  }
                  placeholder="Paste style guide image URL (e.g. anime target visual or painting)..."
                  className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                />
              </div>

              {/* Transformation Instructions */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Transformation Instructions
                </label>
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {TRANSFORMATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const curr = aiWorkflow.transformationInstructions || "";
                        const updated = curr ? `${curr}; ${opt}` : opt;
                        updateAiWorkflow({ transformationInstructions: updated });
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      + {opt}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={aiWorkflow.transformationInstructions || ""}
                  onChange={(e) => updateAiWorkflow({ transformationInstructions: e.target.value })}
                  placeholder="e.g. Transform source video into 35mm film noir styling with high contrast shadows..."
                  rows={2}
                  className="text-xs bg-white dark:bg-[#131B2A]"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PROMPT & NEGATIVE PROMPT (UNIVERSAL FOR VIDEO) */}
          {/* ========================================================================= */}
          <div className="space-y-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Video Prompt</span>
                  <span className="text-purple-500">*</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Large Prompt Editor</span>
              </label>
              <Textarea
                value={aiWorkflow.prompt || ""}
                onChange={(e) => updateAiWorkflow({ prompt: e.target.value })}
                placeholder="Cinematic prompt establishing subject action, lighting atmosphere, camera physics, and environmental dynamics..."
                rows={4}
                className="text-xs sm:text-sm font-mono leading-relaxed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#131B2A] text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Negative Prompt (Optional)</span>
                <span className="text-[10px] text-slate-400">Avoid unwanted distortions</span>
              </label>
              <Input
                value={aiWorkflow.negativePrompt || ""}
                onChange={(e) => updateAiWorkflow({ negativePrompt: e.target.value })}
                placeholder="e.g. blur, morphing, jerky camera movements, distorted hands, flickering"
                className="h-8 text-xs font-mono bg-slate-50/50 dark:bg-[#131B2A]"
              />
            </div>
          </div>          {/* ========================================================================= */}
          {/* MOTION INSTRUCTIONS (CONDITIONALLY SHOWN ONLY FOR METHODS REQUIRING MOTION) */}
          {/* ========================================================================= */}
          {(videoMethod === "image-to-video" ||
            videoMethod === "reference-image-to-video" ||
            videoMethod === "text-image-to-video" ||
            videoMethod === "text-reference-images-to-video") && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-500" />
                <span>Motion Instructions</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Camera Movement
                  </label>
                  <Input
                    value={aiWorkflow.motion?.cameraMovement || ""}
                    onChange={(e) => updateMotion("cameraMovement", e.target.value)}
                    placeholder="e.g. Slow push-in toward subject"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Subject Movement
                  </label>
                  <Input
                    value={aiWorkflow.motion?.subjectMovement || ""}
                    onChange={(e) => updateMotion("subjectMovement", e.target.value)}
                    placeholder="e.g. Natural subtle walking pace"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Object Movement
                  </label>
                  <Input
                    value={aiWorkflow.motion?.objectMovement || ""}
                    onChange={(e) => updateMotion("objectMovement", e.target.value)}
                    placeholder="e.g. Floating dust particles, vehicle momentum"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Environmental Movement
                  </label>
                  <Input
                    value={aiWorkflow.motion?.environmentalMovement || ""}
                    onChange={(e) => updateMotion("environmentalMovement", e.target.value)}
                    placeholder="e.g. Subtle breeze through foliage, golden hour lighting"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIDEO SETTINGS (DYNAMICALLY CONFIGURED PER METHOD) */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Video Settings</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Duration</label>
                <Input
                  value={aiWorkflow.settings?.duration || "5 sec"}
                  onChange={(e) => updateSettings("duration", e.target.value)}
                  placeholder="5 sec"
                  className="h-8 text-xs bg-white dark:bg-[#131B2A] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Aspect Ratio</label>
                <Input
                  value={aiWorkflow.settings?.aspectRatio || "16:9"}
                  onChange={(e) => updateSettings("aspectRatio", e.target.value)}
                  placeholder="16:9"
                  className="h-8 text-xs bg-white dark:bg-[#131B2A] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Resolution</label>
                <Input
                  value={aiWorkflow.settings?.resolution || "1080p"}
                  onChange={(e) => updateSettings("resolution", e.target.value)}
                  placeholder="1080p"
                  className="h-8 text-xs bg-white dark:bg-[#131B2A] font-mono"
                />
              </div>

              {/* Motion Strength only for non-v2v methods */}
              {videoMethod !== "video-to-video" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Motion Strength</label>
                  <Input
                    value={aiWorkflow.settings?.motionStrength || "5"}
                    onChange={(e) => updateSettings("motionStrength", e.target.value)}
                    placeholder="5"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A] font-mono"
                  />
                </div>
              )}

              {/* Camera Movement for text-to-video or storyboard */}
              {(videoMethod === "text-to-video" || videoMethod === "multiple-images-to-video") && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Camera Movement</label>
                  <Input
                    value={aiWorkflow.settings?.cameraMovement || "Slow Push-In"}
                    onChange={(e) => updateSettings("cameraMovement", e.target.value)}
                    placeholder="Slow Push-In"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>
              )}

              {/* Transformation Strength for video-to-video */}
              {videoMethod === "video-to-video" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Strength (0.1 - 1.0)
                  </label>
                  <Input
                    value={aiWorkflow.settings?.transformationStrength || "0.65"}
                    onChange={(e) => updateSettings("transformationStrength", e.target.value)}
                    placeholder="0.65"
                    className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                  />
                </div>
              )}

              {/* Style for relevant methods */}
              {(videoMethod === "text-to-video" ||
                videoMethod === "reference-image-to-video" ||
                videoMethod === "text-reference-images-to-video" ||
                videoMethod === "video-to-video") && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Visual Style</label>
                  <Input
                    value={aiWorkflow.settings?.style || "Cinematic Photorealistic"}
                    onChange={(e) => updateSettings("style", e.target.value)}
                    placeholder="Cinematic"
                    className="h-8 text-xs bg-white dark:bg-[#131B2A]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ACTIONABLE GENERATION INSTRUCTIONS */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Actionable Generation Instructions (User-Facing Steps)</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const curr = aiWorkflow.generationInstructions || [];
                  updateAiWorkflow({
                    generationInstructions: [...curr, "New actionable instruction step..."],
                  });
                }}
                className="h-7 text-xs"
              >
                + Add Instruction
              </Button>
            </div>

            <div className="space-y-1.5">
              {(aiWorkflow.generationInstructions || []).map((inst, iIdx) => (
                <div key={iIdx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {iIdx + 1}
                  </span>
                  <Input
                    value={inst}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateAiWorkflow((prev) => ({
                        ...prev,
                        generationInstructions: prev.generationInstructions?.map((item, idx) =>
                          idx === iIdx ? val : item
                        ),
                      }));
                    }}
                    className="h-8 text-xs bg-slate-50/50 dark:bg-[#131B2A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateAiWorkflow((prev) => ({
                        ...prev,
                        generationInstructions: prev.generationInstructions?.filter((_, idx) => idx !== iIdx),
                      }));
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OUTPUT CONFIGURATION & NEXT STEP (SECTION 13) */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
              <span>Output Asset Configuration & Next Step Dependency</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Output Format
                </label>
                <Select
                  value={aiWorkflow.output?.format || "MP4"}
                  onValueChange={(val: any) => updateOutput("format", val)}
                >
                  <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#111827]">
                    <SelectItem value="MP4" className="text-xs">MP4 (Video)</SelectItem>
                    <SelectItem value="WEBP" className="text-xs">WEBP (Animated)</SelectItem>
                    <SelectItem value="GIF" className="text-xs">GIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Generated Asset Name
                </label>
                <Input
                  value={aiWorkflow.output?.name || ""}
                  onChange={(e) => updateOutput("name", e.target.value)}
                  placeholder="e.g. hero-animation.mp4"
                  className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                What to do with the output (Output Usage Description)
              </label>
              <Input
                value={aiWorkflow.output?.usage || ""}
                onChange={(e) => updateOutput("usage", e.target.value)}
                placeholder="e.g. Save this video and use it as the hero animation in Step 06."
                className="h-8 text-xs bg-white dark:bg-[#131B2A]"
              />
            </div>

            {/* Next Step Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                Where is this asset used next? (Next Step Link)
              </label>
              <Select
                value={aiWorkflow.output?.nextStepId || ""}
                onValueChange={(val) => {
                  const target = nextSteps.find((s) => s.id === val);
                  if (target) {
                    updateOutput("nextStepId", target.id);
                    updateOutput("nextStepNumber", target.order || target.stepNumber);
                    updateOutput("nextStepTitle", target.title);
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A]">
                  <SelectValue placeholder="Select Next Step..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#111827]">
                  {nextSteps.map((ns) => (
                    <SelectItem key={ns.id} value={ns.id} className="text-xs">
                      Step {(ns.order || ns.stepNumber).toString().padStart(2, "0")} — {ns.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. IMAGE GENERATION MODE */}
      {/* ========================================================================= */}
      {genType === "image" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Section: Image Method & AI Tool Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10">
            {/* Field: Image Generation Method */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Image Generation Method</span>
                  <span className="text-amber-500">*</span>
                </span>
                <Badge variant="outline" className="text-[10px] font-mono text-amber-600 dark:text-amber-400 border-amber-500/30">
                  {IMAGE_METHODS.find((m) => m.id === imageMethod)?.badge || "Image Method"}
                </Badge>
              </label>

              <Select
                value={imageMethod}
                onValueChange={(val) => handleImageMethodChange(val as ImageGenerationMethod)}
              >
                <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-[#0E1422] border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select Image Method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700">
                  {IMAGE_METHODS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{m.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{m.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field: AI Image Tool */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>AI Image Tool</span>
                <span className="text-amber-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Select
                  value={aiWorkflow.aiTool || "Midjourney v6.1"}
                  onValueChange={(val) => updateAiWorkflow({ aiTool: val })}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-[#0E1422] border-slate-200 dark:border-slate-700 flex-1">
                    <SelectValue placeholder="Select AI Tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700">
                    {AI_IMAGE_TOOLS.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={aiWorkflow.aiTool || ""}
                  onChange={(e) => updateAiWorkflow({ aiTool: e.target.value })}
                  placeholder="Or custom tool name..."
                  className="h-9 text-xs flex-1 border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422]"
                />
              </div>
            </div>
          </div>

          {/* Step Title for Image Step */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Step Title</span>
              <span className="text-amber-500">*</span>
            </label>
            <Input
              value={step.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Generate Hero Visual with Midjourney"
              className="h-9 text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white"
            />
          </div>

          {/* Source Image for Image-to-Image (Rich Input Asset Source + Usage + Strength) */}
          {imageMethod === "image-to-image" && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Source Image Configuration (Image → Image)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Input image dependency & transformation weight
                </span>
              </div>

              {/* Source Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Input Source
                  </label>
                  <Select
                    value={aiWorkflow.inputAsset?.sourceType || "previous-step"}
                    onValueChange={(val: string) => {
                      const srcType = val as AssetSourceType;
                      if (srcType === "previous-step") {
                        const prevStep = previousSteps[previousSteps.length - 1];
                        updateInputAsset({
                          sourceType: "previous-step",
                          sourceStepId: prevStep?.id,
                          sourceStepNumber: prevStep ? (prevStep.order || prevStep.stepNumber) : undefined,
                          sourceStepTitle: prevStep?.title,
                          assetName: prevStep?.output || prevStep?.title || "Output from Previous Step",
                        });
                      } else {
                        updateInputAsset({ sourceType: srcType });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827]">
                      <SelectItem value="previous-step" className="text-xs">Previous Step Output</SelectItem>
                      <SelectItem value="specific-step" className="text-xs">Specific Step</SelectItem>
                      <SelectItem value="upload" className="text-xs">Upload New Asset</SelectItem>
                      <SelectItem value="library" className="text-xs">Existing Library Asset</SelectItem>
                      <SelectItem value="user-provided" className="text-xs">User Provided Asset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Step Dependency or Filename */}
                {aiWorkflow.inputAsset?.sourceType === "specific-step" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Select Dependency Step
                    </label>
                    <Select
                      value={aiWorkflow.inputAsset?.sourceStepId || ""}
                      onValueChange={(val) => {
                        const target = previousSteps.find((s) => s.id === val);
                        if (target) {
                          updateInputAsset({
                            sourceStepId: target.id,
                            sourceStepNumber: target.order || target.stepNumber,
                            sourceStepTitle: target.title,
                            assetName: target.output || `${target.title}.png`,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Pick a previous step..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#111827]">
                        {previousSteps.map((ps) => (
                          <SelectItem key={ps.id} value={ps.id} className="text-xs">
                            Step {(ps.order || ps.stepNumber).toString().padStart(2, "0")} — {ps.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : aiWorkflow.inputAsset?.sourceType === "previous-step" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Automatic Dependency
                    </label>
                    <div className="h-8 px-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        Output from Step{" "}
                        {previousSteps.length > 0
                          ? (previousSteps[previousSteps.length - 1].order || previousSteps.length).toString().padStart(2, "0")
                          : "01"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      Asset File Name / URL
                    </label>
                    <Input
                      value={aiWorkflow.inputAsset?.assetName || aiWorkflow.inputAsset?.url || ""}
                      onChange={(e) => updateInputAsset({ assetName: e.target.value, url: e.target.value })}
                      placeholder="e.g. source-render.png"
                      className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                    />
                  </div>
                )}
              </div>

              {/* Usage & Transformation Strength */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Image Usage
                  </label>
                  <Select
                    value={aiWorkflow.inputAsset?.usage || "starting-frame"}
                    onValueChange={(val) => updateInputAsset({ usage: val })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A] border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select Usage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827]">
                      {IMAGE_USAGES.map((u) => (
                        <SelectItem key={u.value} value={u.value} className="text-xs">
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Transformation Strength / Weight (0.10 to 1.00)
                  </label>
                  <Input
                    value={aiWorkflow.settings?.transformationStrength || "0.60"}
                    onChange={(e) => updateSettings("transformationStrength", e.target.value)}
                    placeholder="0.60"
                    className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reference Images for Reference Image to Image */}
          {(imageMethod === "reference-image-to-image" ||
            imageMethod === "multiple-reference-images" ||
            imageMethod === "text-reference-image") && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reference Images ({aiWorkflow.referenceImages?.length || 0})</span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextNum = (aiWorkflow.referenceImages?.length || 0) + 1;
                    const newRef: StepReferenceImage = {
                      id: `ref-img-${Date.now()}`,
                      label: `Reference 0${nextNum}`,
                      purpose: nextNum === 1 ? "character" : nextNum === 2 ? "style" : "composition",
                      instruction: `Upload this reference image to preserve the designated ${nextNum === 1 ? "character identity" : "aesthetic style"}.`,
                    };
                    updateAiWorkflow((prev) => ({
                      ...prev,
                      referenceImages: [...(prev.referenceImages || []), newRef],
                    }));
                  }}
                  className="h-7 text-xs gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Reference</span>
                </Button>
              </div>

              <div className="space-y-2">
                {(aiWorkflow.referenceImages || []).map((ref, rIdx) => (
                  <div
                    key={ref.id || rIdx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          REF 0{rIdx + 1}
                        </span>
                        <Input
                          value={ref.label || `Reference 0${rIdx + 1}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, label: val } : item
                              ),
                            }));
                          }}
                          className="h-7 text-xs font-semibold max-w-[160px]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={ref.purpose}
                          onValueChange={(val) => {
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, purpose: val } : item
                              ),
                            }));
                          }}
                        >
                          <SelectTrigger className="h-7 text-xs w-[170px] bg-slate-50 dark:bg-[#0E1422]">
                            <SelectValue placeholder="Purpose" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#111827]">
                            {REFERENCE_PURPOSES.map((p) => (
                              <SelectItem key={p.value} value={p.value} className="text-xs">
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <button
                          type="button"
                          onClick={() => {
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.filter((_, idx) => idx !== rIdx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <Input
                          value={ref.url || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateAiWorkflow((prev) => ({
                              ...prev,
                              referenceImages: prev.referenceImages?.map((item, idx) =>
                                idx === rIdx ? { ...item, url: val } : item
                              ),
                            }));
                          }}
                          placeholder="Paste reference image URL or upload..."
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="h-7 px-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                          <UploadCloud className="w-3 h-3 text-slate-400" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                if (!result) return;
                                updateAiWorkflow((prev) => ({
                                  ...prev,
                                  referenceImages: prev.referenceImages?.map((item, idx) =>
                                    idx === rIdx ? { ...item, url: result } : item
                                  ),
                                }));
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        Explicit Guide Instruction for this Reference:
                      </label>
                      <Input
                        value={ref.instruction || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateAiWorkflow((prev) => ({
                            ...prev,
                            referenceImages: prev.referenceImages?.map((item, idx) =>
                              idx === rIdx ? { ...item, instruction: val } : item
                            ),
                          }));
                        }}
                        placeholder="e.g. Upload Reference 01 to preserve facial structure and lighting direction."
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt & Settings for Image */}
          <div className="space-y-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Image Prompt</span>
                  <span className="text-amber-500">*</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Large Prompt Editor</span>
              </label>
              <Textarea
                value={aiWorkflow.prompt || ""}
                onChange={(e) => updateAiWorkflow({ prompt: e.target.value })}
                placeholder="Editorial photographic prompt with subject description, lighting, composition, and medium..."
                rows={4}
                className="text-xs sm:text-sm font-mono leading-relaxed bg-slate-50/50 dark:bg-[#131B2A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Negative Prompt (Optional)</span>
                <span className="text-[10px] text-slate-400">Exclude unwanted artifacts</span>
              </label>
              <Input
                value={aiWorkflow.negativePrompt || ""}
                onChange={(e) => updateAiWorkflow({ negativePrompt: e.target.value })}
                placeholder="e.g. plastic skin, extra fingers, cartoonish, oversaturated, deformed"
                className="h-8 text-xs font-mono bg-slate-50/50 dark:bg-[#131B2A]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Aspect Ratio</label>
                <Input
                  value={aiWorkflow.settings?.aspectRatio || "16:9"}
                  onChange={(e) => updateSettings("aspectRatio", e.target.value)}
                  placeholder="16:9"
                  className="h-8 text-xs font-mono bg-slate-50/50 dark:bg-[#131B2A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Resolution</label>
                <Input
                  value={aiWorkflow.settings?.resolution || "4K UHD"}
                  onChange={(e) => updateSettings("resolution", e.target.value)}
                  placeholder="4K UHD"
                  className="h-8 text-xs font-mono bg-slate-50/50 dark:bg-[#131B2A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Style</label>
                <Input
                  value={aiWorkflow.settings?.style || "Photorealistic"}
                  onChange={(e) => updateSettings("style", e.target.value)}
                  placeholder="Photorealistic"
                  className="h-8 text-xs bg-slate-50/50 dark:bg-[#131B2A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Quality</label>
                <Input
                  value={aiWorkflow.settings?.quality || "High"}
                  onChange={(e) => updateSettings("quality", e.target.value)}
                  placeholder="High"
                  className="h-8 text-xs bg-slate-50/50 dark:bg-[#131B2A]"
                />
              </div>
            </div>
          </div>

          {/* Actionable Generation Instructions for Image Generation */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0E1422] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Actionable Generation Instructions (User-Facing Steps)</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const curr = aiWorkflow.generationInstructions || [];
                  updateAiWorkflow({
                    generationInstructions: [...curr, "New actionable instruction step..."],
                  });
                }}
                className="h-7 text-xs"
              >
                + Add Instruction
              </Button>
            </div>

            <div className="space-y-1.5">
              {(aiWorkflow.generationInstructions || []).map((inst, iIdx) => (
                <div key={iIdx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {iIdx + 1}
                  </span>
                  <Input
                    value={inst}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateAiWorkflow((prev) => ({
                        ...prev,
                        generationInstructions: prev.generationInstructions?.map((item, idx) =>
                          idx === iIdx ? val : item
                        ),
                      }));
                    }}
                    className="h-8 text-xs bg-slate-50/50 dark:bg-[#131B2A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateAiWorkflow((prev) => ({
                        ...prev,
                        generationInstructions: prev.generationInstructions?.filter((_, idx) => idx !== iIdx),
                      }));
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Output & Next Step */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0E1422] space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              <span>Output Asset Configuration & Next Step Dependency</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Format</label>
                <Select
                  value={aiWorkflow.output?.format || "PNG"}
                  onValueChange={(val: any) => updateOutput("format", val)}
                >
                  <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#111827]">
                    <SelectItem value="PNG" className="text-xs">PNG</SelectItem>
                    <SelectItem value="JPG" className="text-xs">JPG</SelectItem>
                    <SelectItem value="WEBP" className="text-xs">WEBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Output Asset Name</label>
                <Input
                  value={aiWorkflow.output?.name || ""}
                  onChange={(e) => updateOutput("name", e.target.value)}
                  placeholder="e.g. hero-image.png"
                  className="h-8 text-xs font-mono bg-white dark:bg-[#131B2A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Output Usage</label>
              <Input
                value={aiWorkflow.output?.usage || ""}
                onChange={(e) => updateOutput("usage", e.target.value)}
                placeholder="e.g. Save this image and use it as the starting frame in Step 04."
                className="h-8 text-xs bg-white dark:bg-[#131B2A]"
              />
            </div>

            {/* Next Step Selector for Image */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                Where is this asset used next? (Next Step Link)
              </label>
              <Select
                value={aiWorkflow.output?.nextStepId || ""}
                onValueChange={(val) => {
                  const target = nextSteps.find((s) => s.id === val);
                  if (target) {
                    updateOutput("nextStepId", target.id);
                    updateOutput("nextStepNumber", target.order || target.stepNumber);
                    updateOutput("nextStepTitle", target.title);
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-[#131B2A]">
                  <SelectValue placeholder="Select Next Step..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#111827]">
                  {nextSteps.map((ns) => (
                    <SelectItem key={ns.id} value={ns.id} className="text-xs">
                      Step {(ns.order || ns.stepNumber).toString().padStart(2, "0")} — {ns.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
