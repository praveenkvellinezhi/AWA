"use client";

import React, { useState } from "react";
import {
  Presentation,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Sliders,
  FileText,
  Eye,
  Check,
  Layout,
  MessageSquare,
  HelpCircle,
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
import { PromptEditor } from "./PromptEditor";
import { SlidesBuilderData, BuilderSlideItem, ValidationErrors } from "./types";

interface SlidesBuilderProps {
  data: SlidesBuilderData;
  onChange: (updated: Partial<SlidesBuilderData>) => void;
  errors?: ValidationErrors;
}

const PRESENTATION_TYPES = [
  "Startup Pitch Deck (Seed / Series A)",
  "Executive Board Review",
  "Product Demo & Sales Deck",
  "Keynote Conference Presentation",
  "Quarterly Business Review (QBR)",
  "Technical Workshop & Training",
  "Investor Update Memo",
];

const TONE_OPTIONS = [
  "Persuasive, High-Stakes & Data-Backed",
  "Visionary & Inspiring",
  "Clean, Formal & Analytical",
  "Dynamic, High-Energy & Bold",
  "Educational & Empathetic",
];

const LAYOUT_OPTIONS = [
  "Hero Title & Visual",
  "Split 2-Column Problem vs Solution",
  "3-Card Value Pillar",
  "Big Metric & Data Highlight",
  "Timeline & Strategic Roadmap",
  "Comparison Matrix / Grid",
  "Quote & Customer Callout",
  "Closing CTA & Contact",
];

export function SlidesBuilder({ data, onChange, errors }: SlidesBuilderProps) {
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(
    data.slides[0]?.id || null
  );

  const handleAddSlide = () => {
    const nextNumber = data.slides.length + 1;
    const newSlide: BuilderSlideItem = {
      id: `slide-${Date.now()}`,
      slideNumber: nextNumber,
      title: `Slide ${nextNumber.toString().padStart(2, "0")} Title`,
      purpose: "Define the specific outcome and message for this slide.",
      layout: "3-Card Value Pillar",
      prompt: `Generate Slide ${nextNumber} content for [TOPIC]. Focus on clear visual hierarchy, concise bullet points, and data credibility.`,
      visualDirection: "Clean minimalist layout with high contrast typography and brand accent container cards.",
      contentRequirements: "Max 3 concise bullet points with 1 highlighted callout metric.",
      speakerNotes: "Speaker notes explaining the narrative transition into this slide.",
    };

    const nextSlides = [...data.slides, newSlide];
    onChange({
      slides: nextSlides,
      numberOfSlides: nextSlides.length,
    });
    setExpandedSlideId(newSlide.id);
  };

  const handleDuplicateSlide = (index: number) => {
    const target = data.slides[index];
    if (!target) return;

    const duplicated: BuilderSlideItem = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };

    const nextSlides = [
      ...data.slides.slice(0, index + 1),
      duplicated,
      ...data.slides.slice(index + 1),
    ].map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

    onChange({
      slides: nextSlides,
      numberOfSlides: nextSlides.length,
    });
    setExpandedSlideId(duplicated.id);
  };

  const handleDeleteSlide = (index: number) => {
    if (data.slides.length <= 1) {
      alert("A presentation template must have at least one slide.");
      return;
    }

    const nextSlides = data.slides
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

    onChange({
      slides: nextSlides,
      numberOfSlides: nextSlides.length,
    });

    if (expandedSlideId === data.slides[index]?.id) {
      setExpandedSlideId(nextSlides[0]?.id || null);
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.slides.length) return;

    const nextSlides = [...data.slides];
    const [moved] = nextSlides.splice(index, 1);
    nextSlides.splice(targetIndex, 0, moved);

    const renumbered = nextSlides.map((s, idx) => ({
      ...s,
      slideNumber: idx + 1,
    }));

    onChange({ slides: renumbered });
  };

  const handleUpdateSlide = (
    index: number,
    updated: Partial<BuilderSlideItem>
  ) => {
    const nextSlides = [...data.slides];
    nextSlides[index] = { ...nextSlides[index], ...updated };
    onChange({ slides: nextSlides });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Presentation Architecture & Slide Manager
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Build deck narratives, configure global deck parameters, and define prompts for individual slides.
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Information Grid */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-emerald-500" />
          <span>Presentation Deck Parameters</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Presentation Title
            </label>
            <Input
              value={data.presentationTitle}
              onChange={(e) => onChange({ presentationTitle: e.target.value })}
              placeholder="e.g. Seed Pitch Deck: Next-Gen AI Platform"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Deck Type
            </label>
            <Select
              value={data.presentationType}
              onValueChange={(val) => onChange({ presentationType: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PRESENTATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Primary Topic / Thesis
            </label>
            <Input
              value={data.topic}
              onChange={(e) => onChange({ topic: e.target.value })}
              placeholder="e.g. Raising $2.5M Seed for AI Workflow Engine"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Target Audience
            </label>
            <Input
              value={data.audience}
              onChange={(e) => onChange({ audience: e.target.value })}
              placeholder="e.g. Angel & Venture Capital Investors"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Tone of Voice
            </label>
            <Select
              value={data.tone}
              onValueChange={(val) => onChange({ tone: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((tn) => (
                  <SelectItem key={tn} value={tn}>
                    {tn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Primary Objective
            </label>
            <Input
              value={data.objective}
              onChange={(e) => onChange({ objective: e.target.value })}
              placeholder="e.g. Secure $2.5M Seed commitment by demonstrating high creator retention"
              className="text-xs"
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Language
            </label>
            <Input
              value={data.language}
              onChange={(e) => onChange({ language: e.target.value })}
              placeholder="English (US)"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Presentation Context Prompt Editor */}
      <PromptEditor
        label="Presentation Context & Narrative Arc"
        value={data.presentationContext}
        onChange={(val) => onChange({ presentationContext: val })}
        placeholder="Comprehensive narrative context for the entire deck..."
        helperText="Explains the overarching story, key business drivers, metrics, and problem-solution dynamic."
        suggestedVariables={[
          "[TOPIC]",
          "[AUDIENCE]",
          "[OBJECTIVE]",
          "[PRESENTATION_TYPE]",
          "[TONE]",
          "[NUMBER_OF_SLIDES]",
        ]}
        error={errors?.presentationContext}
        minRows={4}
        highlightCategory="Deck Narrative Context"
      />

      {/* Global Presentation Prompt */}
      <PromptEditor
        label="Global Presentation Master Prompt"
        value={data.globalPrompt}
        onChange={(val) => onChange({ globalPrompt: val })}
        placeholder="Act as a world-class pitch deck designer and venture partner..."
        helperText="Master prompt used to generate or re-theme the entire presentation in Gamma, Beautiful.ai, or Claude."
        suggestedVariables={[
          "[TOPIC]",
          "[AUDIENCE]",
          "[TONE]",
          "[NUMBER_OF_SLIDES]",
          "[STYLE]",
        ]}
        minRows={4}
        highlightCategory="Master Deck Prompt"
      />

      {/* Individual Slide Builder & Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Slide-by-Slide Pipeline ({data.slides.length} Slides)
            </h4>
          </div>

          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleAddSlide}
            className="text-xs font-bold gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Slide</span>
          </Button>
        </div>

        {errors?.slides && (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {errors.slides}
          </p>
        )}

        {/* Slide List */}
        <div className="space-y-3">
          {data.slides.map((slide, index) => {
            const isExpanded = expandedSlideId === slide.id;
            return (
              <div
                key={slide.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "border-emerald-500/80 dark:border-emerald-500/80 bg-white dark:bg-[#131B2A] shadow-md"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#101625] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Slide Card Header Bar */}
                <div
                  onClick={() =>
                    setExpandedSlideId(isExpanded ? null : slide.id)
                  }
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {slide.slideNumber.toString().padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {slide.title}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                          {slide.layout}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {slide.purpose || "No purpose specified"}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Move Up, Move Down, Duplicate, Delete, Expand */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSlide(index, "up")}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move slide up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === data.slides.length - 1}
                      onClick={() => handleMoveSlide(index, "down")}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move slide down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateSlide(index)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Duplicate slide"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(index)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Slide Detail Editor */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#131B2A] space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Slide Title */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Slide Title / Header
                        </label>
                        <Input
                          value={slide.title}
                          onChange={(e) =>
                            handleUpdateSlide(index, { title: e.target.value })
                          }
                          placeholder="e.g. 01 Cover & Mission"
                          className="text-xs"
                        />
                      </div>

                      {/* Layout */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Slide Visual Layout
                        </label>
                        <Select
                          value={slide.layout}
                          onValueChange={(val) =>
                            handleUpdateSlide(index, { layout: val })
                          }
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                          <SelectContent>
                            {LAYOUT_OPTIONS.map((lo) => (
                  <SelectItem key={lo} value={lo}>
                                {lo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Purpose */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Slide Strategic Purpose
                        </label>
                        <Input
                          value={slide.purpose}
                          onChange={(e) =>
                            handleUpdateSlide(index, { purpose: e.target.value })
                          }
                          placeholder="What decision or takeaway must this slide achieve?"
                          className="text-xs"
                        />
                      </div>
                    </div>

                    {/* Individual Slide Prompt */}
                    <PromptEditor
                      label={`Slide ${slide.slideNumber} Generation Prompt`}
                      value={slide.prompt}
                      onChange={(val) =>
                        handleUpdateSlide(index, { prompt: val })
                      }
                      placeholder={`Generate Slide ${slide.slideNumber} content...`}
                      helperText="Dedicated prompt for this individual slide that users can copy to build it."
                      suggestedVariables={[
                        "[TOPIC]",
                        "[STYLE]",
                        "[AUDIENCE]",
                        "[HEADLINE]",
                        "[METRIC]",
                      ]}
                      minRows={4}
                      highlightCategory={`Slide ${slide.slideNumber}`}
                    />

                    {/* Visual Direction & Content Requirements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Visual & Art Direction
                        </label>
                        <Textarea
                          rows={2}
                          value={slide.visualDirection}
                          onChange={(e) =>
                            handleUpdateSlide(index, {
                              visualDirection: e.target.value,
                            })
                          }
                          placeholder="e.g. Dark minimalist canvas with deep emerald radial glow..."
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Content & Data Requirements
                        </label>
                        <Textarea
                          rows={2}
                          value={slide.contentRequirements}
                          onChange={(e) =>
                            handleUpdateSlide(index, {
                              contentRequirements: e.target.value,
                            })
                          }
                          placeholder="e.g. Limit to 3 bullets, 1 bold CAGR metric..."
                          className="text-xs"
                        />
                      </div>
                    </div>

                    {/* Speaker Notes */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Speaker Notes & Script</span>
                      </label>
                      <Textarea
                        rows={2}
                        value={slide.speakerNotes}
                        onChange={(e) =>
                          handleUpdateSlide(index, {
                            speakerNotes: e.target.value,
                          })
                        }
                        placeholder="Conversational script or talking points for this slide..."
                        className="text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
