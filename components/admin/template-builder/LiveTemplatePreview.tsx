"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  Camera,
  Film,
  Globe,
  Presentation,
  Palette,
  Layers,
  Code2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Lock,
  Bookmark,
  Heart,
  Share2,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BuilderBasicInfo,
  ImageBuilderData,
  VideoBuilderData,
  WebsiteBuilderData,
  SlidesBuilderData,
  PosterBuilderData,
  WorkflowStepItem,
} from "./types";
import { combinePrompts } from "@/lib/prompt-utils";
import { StepAiWorkflowDisplay } from "@/components/template/StepAiWorkflowDisplay";
import { VIDEO_METHODS, IMAGE_METHODS } from "./ai-workflow-defaults";

interface LiveTemplatePreviewProps {
  basicInfo: BuilderBasicInfo;
  imageData: ImageBuilderData;
  videoData: VideoBuilderData;
  websiteData: WebsiteBuilderData;
  slidesData: SlidesBuilderData;
  posterData: PosterBuilderData;
  workflowSteps: WorkflowStepItem[];
  isDraft?: boolean;
}

export function LiveTemplatePreview({
  basicInfo,
  imageData,
  videoData,
  websiteData,
  slidesData,
  posterData,
  workflowSteps,
  isDraft = true,
}: LiveTemplatePreviewProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedKind, setCopiedKind] = useState<"combined" | "ui" | "context" | null>(null);
  const [promptViewMode, setPromptViewMode] = useState<"combined" | "ui" | "context">("combined");
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"workflow" | "details">("workflow");

  const getPrompts = () => {
    let ui = "";
    let context = "";
    switch (basicInfo.categoryKey) {
      case "image":
        ui = imageData.uiPrompt || imageData.prompt;
        context = imageData.contextPrompt;
        break;
      case "video":
        ui = videoData.uiPrompt || videoData.prompt;
        context = videoData.contextPrompt;
        break;
      case "website":
        ui = websiteData.uiPrompt;
        context = websiteData.contextPrompt;
        break;
      case "slides":
        ui = slidesData.uiPrompt || slidesData.globalPrompt;
        context = slidesData.contextPrompt || slidesData.presentationContext;
        break;
      case "poster":
        ui = posterData.uiPrompt || posterData.prompt;
        context = posterData.contextPrompt;
        break;
    }
    const combined = combinePrompts(ui, context);
    return { ui, context, combined };
  };

  const handleCopyPromptByKind = async (kind: "combined" | "ui" | "context") => {
    const { ui, context, combined } = getPrompts();
    const textToCopy = kind === "combined" ? combined : kind === "ui" ? ui : context;
    if (!textToCopy) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch (e) {
      console.warn("Failed to copy prompt:", e);
    }
    setCopiedKind(kind);
    setTimeout(() => setCopiedKind(null), 2000);
  };

  const { ui: activeUiPrompt, context: activeContextPrompt, combined: activeCombinedPrompt } = getPrompts();

  const handleCopyStep = (promptText: string, index: number) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopiedStepIndex(index);
    setTimeout(() => setCopiedStepIndex(null), 2000);
  };

  const DEFAULT_SLIDE_IMAGES = [
    "/templates/slides-seed-pitch.webp",
    "/templates/slides-qbr.webp",
    "/templates/slides-keynote-launch.webp",
    "/templates/slides-vc-series-a.webp",
    "/templates/slides-data-copilot.webp",
    "/templates/slides-doc-to-deck.webp",
    "/templates/slides-branded-canva.webp",
  ];

  const isSlidesCategory = basicInfo.categoryKey === "slides";
  const slidesList = slidesData.slides || [];
  const currentSlide = slidesList[selectedSlideIndex] || slidesList[0];

  const getSlideImageUrl = (slide: typeof slidesList[0] | undefined, idx: number) => {
    if (slide?.imageUrl) return slide.imageUrl;
    if (idx === 0 && basicInfo.thumbnailUrl) return basicInfo.thumbnailUrl;
    return (
      DEFAULT_SLIDE_IMAGES[idx % DEFAULT_SLIDE_IMAGES.length] ||
      basicInfo.thumbnailUrl ||
      "/templates/slides-seed-pitch.webp"
    );
  };

  const activeDisplayImageUrl = isSlidesCategory
    ? getSlideImageUrl(currentSlide, selectedSlideIndex)
    : basicInfo.thumbnailUrl;

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slidesList.length <= 1) return;
    setSelectedSlideIndex((prev) => (prev > 0 ? prev - 1 : slidesList.length - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slidesList.length <= 1) return;
    setSelectedSlideIndex((prev) => (prev < slidesList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="h-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111726] shadow-md overflow-hidden flex flex-col">
      {/* Preview Header Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-wide">
            Live Template Preview
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Public User View
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Preview Card with Multi-Slide Support */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 group shadow-xs">
          {activeDisplayImageUrl ? (
            <img
              src={activeDisplayImageUrl}
              alt={currentSlide?.title || basicInfo.name || "Template Preview"}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <Camera className="w-8 h-8 opacity-40" />
              <span className="text-xs">No cover image uploaded</span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white border border-white/20">
              {basicInfo.categoryName}
            </span>
            {isSlidesCategory && slidesList.length > 0 ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white shadow-xs">
                Slide {selectedSlideIndex + 1} of {slidesList.length}
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white">
                {basicInfo.difficulty}
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-xs px-2 py-1 rounded-md text-white text-[10px] font-mono z-10">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{basicInfo.recommendedModel || "AI Optimized"}</span>
          </div>

          {/* Slides Carousel Navigation Arrows Overlay */}
          {isSlidesCategory && slidesList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 z-10"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 z-10"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Slide Caption Bottom Banner (Slides Only) */}
          {isSlidesCategory && currentSlide && (
            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs font-mono pointer-events-none">
              <span className="text-[11px] font-bold text-white truncate max-w-[210px]">
                {currentSlide.title}
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                {currentSlide.layout}
              </span>
            </div>
          )}
        </div>

        {/* Multi-Slide Interactive Thumbnail Carousel Strip (When category is Slides) */}
        {isSlidesCategory && slidesList.length > 0 && (
          <div className="space-y-1.5 rounded-xl p-2.5 bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 text-emerald-500" />
                <span>Multi-Slide Gallery ({slidesList.length} Slides)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click slide to preview
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              {slidesList.map((slide, idx) => {
                const isCurrent = selectedSlideIndex === idx;
                const slideImg = getSlideImageUrl(slide, idx);
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={`group relative h-14 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-slate-900 ${
                      isCurrent
                        ? "border-emerald-500 ring-2 ring-emerald-500/50 shadow-md scale-105"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-500"
                    }`}
                    title={`Slide ${idx + 1}: ${slide.title}`}
                  >
                    <img
                      src={slideImg}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold font-mono text-white truncate max-w-[65px]">
                      Slide {idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Template Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {basicInfo.subcategoryName || "Creative Template"}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              By {basicInfo.author || "AWA Official"}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {basicInfo.name || "Untitled Template"}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {basicInfo.description || "No description provided yet."}
          </p>

          {/* Tags */}
          {basicInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {basicInfo.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category Specific Previews */}
        {/* 1. SLIDES CATEGORY PREVIEW */}
        {basicInfo.categoryKey === "slides" && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 text-emerald-500" />
                <span>Slide Deck ({slidesData.slides.length} Slides)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {slidesData.presentationType}
              </span>
            </div>

            {/* Slide Selector Carousel Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {slidesData.slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-all ${
                    selectedSlideIndex === idx
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {s.slideNumber.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Active Slide Card */}
            {currentSlide && (
              <div className="p-3 rounded-lg bg-white dark:bg-[#131B2A] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentSlide.title}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {currentSlide.layout}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentSlide.purpose}
                </p>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed relative group">
                  <div className="line-clamp-3">{currentSlide.prompt}</div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyStep(currentSlide.prompt, 999)}
                    className="h-6 text-[10px] mt-1.5 gap-1"
                  >
                    {copiedStepIndex === 999 ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied Slide Prompt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Slide Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DUAL PROMPT PREVIEW CARD (FOR ALL CATEGORIES) */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 space-y-2.5">
          {/* Header with Category Badge & Parameter Pill */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prompt Pipeline</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {basicInfo.categoryKey === "website"
                ? websiteData.framework
                : basicInfo.categoryKey === "image"
                ? `${imageData.aspectRatio} • ${imageData.imageType}`
                : basicInfo.categoryKey === "video"
                ? `${videoData.duration} • ${videoData.aspectRatio}`
                : basicInfo.categoryKey === "slides"
                ? `${slidesData.numberOfSlides} Slides • ${slidesData.presentationType}`
                : `${posterData.canvasSize}`}
            </span>
          </div>

          {/* Quick Specs Chips for Website */}
          {basicInfo.categoryKey === "website" && (
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                CSS: {websiteData.styling}
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate">
                DB: {websiteData.database}
              </div>
            </div>
          )}

          {/* Prompt Selector Pills: Combined / UI Prompt / Context Prompt */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPromptViewMode("combined")}
              className={`flex-1 py-1 px-2 rounded-md transition-all ${
                promptViewMode === "combined"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Combined
            </button>
            <button
              type="button"
              onClick={() => setPromptViewMode("ui")}
              className={`flex-1 py-1 px-2 rounded-md transition-all ${
                promptViewMode === "ui"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              UI Prompt
            </button>
            <button
              type="button"
              onClick={() => setPromptViewMode("context")}
              className={`flex-1 py-1 px-2 rounded-md transition-all ${
                promptViewMode === "context"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Context
            </button>
          </div>

          {/* Active Prompt Preview Textbox */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 line-clamp-4 leading-relaxed">
            {promptViewMode === "combined"
              ? activeCombinedPrompt || "No prompt configured"
              : promptViewMode === "ui"
              ? activeUiPrompt || "No UI prompt configured"
              : activeContextPrompt || "No context prompt configured"}
          </div>

          {/* Action Buttons: Copy Combined or Copy Selected */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="forest"
              size="sm"
              onClick={() => handleCopyPromptByKind("combined")}
              className="flex-1 h-8 text-xs font-bold gap-1.5"
            >
              {copiedKind === "combined" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Combined Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Combined Prompt</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopyPromptByKind("ui")}
              title="Copy UI Prompt only"
              className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-200"
            >
              {copiedKind === "ui" ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <span className="font-semibold text-[10px]">UI</span>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopyPromptByKind("context")}
              title="Copy Context Prompt only"
              className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-200"
            >
              {copiedKind === "context" ? (
                <Check className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <span className="font-semibold text-[10px]">Context</span>
              )}
            </Button>
          </div>
        </div>

        {/* Execution Steps Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Execution Steps ({workflowSteps.length} Steps)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              How-to guide
            </span>
          </div>

          <div className="space-y-2">
            {workflowSteps.map((step) => {
              const stepImg = step.image?.url || step.imageUrl;
              const stepVideo = step.videoUrl;
              return (
                <div
                  key={step.id}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5 min-w-0 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {step.aiWorkflow?.generationType === "video" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {VIDEO_METHODS.find((m) => m.id === step.aiWorkflow?.videoMethod)?.badge || "Video Gen"}
                        </span>
                      ) : step.aiWorkflow?.generationType === "image" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {IMAGE_METHODS.find((m) => m.id === step.aiWorkflow?.imageMethod)?.badge || "Image Gen"}
                        </span>
                      ) : null}

                      {stepVideo ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <Video className="w-2.5 h-2.5" />
                          <span>VID</span>
                        </span>
                      ) : stepImg ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>IMG</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {step.aiWorkflow && step.aiWorkflow.generationType !== "normal" ? (
                    <StepAiWorkflowDisplay
                      aiWorkflow={step.aiWorkflow}
                      stepNumber={step.stepNumber || 1}
                    />
                  ) : (
                    <>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {step.description || step.instruction}
                      </p>

                      {/* Thumbnail / Video preview if present */}
                      {stepVideo ? (
                        <div className="rounded-md overflow-hidden bg-black max-h-32 border border-slate-200 dark:border-slate-800">
                          <video
                            src={stepVideo}
                            controls
                            className="max-h-32 w-full object-contain"
                          />
                        </div>
                      ) : stepImg ? (
                        <div className="relative h-24 w-full rounded-md overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <img
                            src={stepImg}
                            alt={step.title}
                            className="w-full h-full object-cover"
                          />
                          {step.imageCaption && (
                            <span
                              data-overlay-badge
                              className="absolute bottom-1 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[9px] font-mono !text-white text-white font-bold border border-white/20 truncate"
                            >
                              {step.imageCaption}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
