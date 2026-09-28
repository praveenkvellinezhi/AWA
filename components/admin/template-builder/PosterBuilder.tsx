"use client";

import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layout,
  Type,
  Maximize2,
  FileText,
  Image as ImageIcon,
  Code2,
  Copy,
  Check,
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
import { PosterBuilderData, ValidationErrors } from "./types";
import { combinePrompts } from "@/lib/prompt-utils";

interface PosterBuilderProps {
  data: PosterBuilderData;
  onChange: (updated: Partial<PosterBuilderData>) => void;
  errors?: ValidationErrors;
}

const DESIGN_TYPES = [
  "Event & Conference Poster",
  "Social Media Graphic (Instagram / Twitter)",
  "Marketing Flyer & Leaflet",
  "Digital Display Ad & Banner",
  "Billboard & Print Signage",
  "Album Cover & Vinyl Artwork",
  "Book & Magazine Cover",
];

const CANVAS_SIZES = [
  { label: "Instagram Portrait (1080x1350 px)", value: "Instagram Portrait (1080x1350)", dims: "1080 x 1350 px" },
  { label: "Instagram Square (1080x1080 px)", value: "Instagram Square (1080x1080)", dims: "1080 x 1080 px" },
  { label: "Story / Reel (1080x1920 px)", value: "Story / Reel (1080x1920)", dims: "1080 x 1920 px" },
  { label: "A4 International Print (210x297 mm)", value: "A4 Print (210x297mm)", dims: "2480 x 3508 px (300dpi)" },
  { label: "US Letter Print (8.5x11 in)", value: "US Letter Print", dims: "2550 x 3300 px (300dpi)" },
  { label: "Twitter / Web Header (1500x500 px)", value: "Twitter Header (1500x500)", dims: "1500 x 500 px" },
];

const VISUAL_STYLES = [
  "Swiss Modern Minimal with Structured Grid",
  "Brutalist High Impact & Raw Typography",
  "Retro 90s Cyberpunk Holographic",
  "Luxury Editorial & Monochrome",
  "Bauhaus Geometric Abstract",
  "Psychedelic Acid Graphic Art",
  "Clean Corporate Flat Graphic",
];

export function PosterBuilder({ data, onChange, errors }: PosterBuilderProps) {
  const [activePromptTab, setActivePromptTab] = useState<"separate" | "combined">("separate");
  const [copiedCombined, setCopiedCombined] = useState(false);
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  const uiPromptValue = data.uiPrompt || data.prompt || "";
  const contextPromptValue = data.contextPrompt || "";
  const combinedPrompt = combinePrompts(uiPromptValue, contextPromptValue);

  const handleCopyCombined = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(combinedPrompt);
        setCopiedCombined(true);
        setTimeout(() => setCopiedCombined(false), 2000);
      }
    } catch (e) {
      console.warn("Failed to copy combined prompt:", e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Posters & Graphic Design Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure the visual layout prompt, brand marketing context, canvas specifications, and typography.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Prompt Editor: UI Prompt + Context Prompt with Combined View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePromptTab("separate")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activePromptTab === "separate"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Dual Prompt Editors (UI + Context)
            </button>
            <button
              type="button"
              onClick={() => setActivePromptTab("combined")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activePromptTab === "combined"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Combined Prompt</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Separates Visual Layout from Brand Brief
          </span>
        </div>

        {activePromptTab === "separate" ? (
          <div className="space-y-5">
            {/* UI / Design Generation Prompt */}
            <PromptEditor
              label="UI Generation Prompt (Visual Layout & Typography)"
              value={uiPromptValue}
              onChange={(val) => onChange({ uiPrompt: val, prompt: val })}
              placeholder="Design a museum-grade typographic event poster for [HEADLINE] with structured Swiss grid..."
              helperText="Specifies visual layout directives, typographic scale, grid hierarchy, hero elements, color palette, and canvas format."
              suggestedVariables={[
                "[HEADLINE]",
                "[SUPPORTING_TEXT]",
                "[CTA]",
                "[VISUAL_STYLE]",
                "[COLOR_PALETTE]",
                "[CANVAS_SIZE]",
                "[DIMENSIONS]",
              ]}
              error={errors?.uiPrompt || errors?.mainPrompt}
              minRows={5}
              highlightCategory="Visual Layout & Typography"
            />

            {/* Context Prompt */}
            <PromptEditor
              label="Context Prompt (Campaign Brief & Brand Strategy)"
              value={contextPromptValue}
              onChange={(val) => onChange({ contextPrompt: val })}
              placeholder="Marketing context: Annual tech symposium brand campaign targeting creative technologists..."
              helperText="Explains marketing objectives, brand persona, target demographic, promotional messaging, and conversion goals."
              suggestedVariables={[
                "[BRAND_NAME]",
                "[CAMPAIGN_OBJECTIVE]",
                "[TARGET_AUDIENCE]",
                "[EVENT_DATE]",
                "[TONE_OF_VOICE]",
                "[PRIMARY_OFFER]",
              ]}
              error={errors?.contextPrompt}
              minRows={4}
              highlightCategory="Marketing & Brand Context"
            />
          </div>
        ) : (
          /* Live Combined Prompt View */
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-rose-400" />
                Live Combined Design Prompt (Standard AWA Prompt)
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyCombined}
                className="h-7 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:text-white"
              >
                {copiedCombined ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Full Combined Prompt</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto text-slate-300">
              {combinedPrompt}
            </pre>
          </div>
        )}
      </div>

      {/* Canvas & Typography Parameters Grid */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-rose-500" />
          <span>Canvas Dimensions & Typographic Copy</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Design Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Design Medium Type
            </label>
            <Select
              value={data.designType}
              onValueChange={(val) => onChange({ designType: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DESIGN_TYPES.map((dt) => (
                  <SelectItem key={dt} value={dt}>
                    {dt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canvas Size */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Canvas Preset & Aspect Ratio
            </label>
            <Select
              value={data.canvasSize}
              onValueChange={(val) => {
                const found = CANVAS_SIZES.find((c) => c.value === val);
                onChange({
                  canvasSize: val,
                  dimensions: found?.dims || data.dimensions,
                });
              }}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Canvas size" />
              </SelectTrigger>
              <SelectContent>
                {CANVAS_SIZES.map((cs) => (
                  <SelectItem key={cs.value} value={cs.value}>
                    {cs.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dimensions */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Pixel / Print Dimensions
            </label>
            <Input
              value={data.dimensions}
              onChange={(e) => onChange({ dimensions: e.target.value })}
              placeholder="e.g. 1080 x 1350 px"
              className="text-xs font-mono"
            />
          </div>

          {/* Headline */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-rose-500" />
              <span>Main Headline Text</span>
            </label>
            <Input
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="e.g. THE FUTURE OF DIGITAL FORM"
              className="text-xs font-bold"
            />
          </div>

          {/* Call to Action */}
          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Call to Action (CTA)
            </label>
            <Input
              value={data.cta}
              onChange={(e) => onChange({ cta: e.target.value })}
              placeholder="e.g. Register at awa.guide/conference • Oct 14-16"
              className="text-xs"
            />
          </div>

          {/* Supporting Text */}
          <div className="space-y-1 sm:col-span-3">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Supporting Body Copy / Sub-Headline
            </label>
            <Textarea
              rows={2}
              value={data.supportingText}
              onChange={(e) => onChange({ supportingText: e.target.value })}
              placeholder="A 3-day immersive conference exploring algorithmic design, neural graphics, and synthetic media..."
              className="text-xs"
            />
          </div>

          {/* Visual Style */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Visual Graphic Style
            </label>
            <Select
              value={data.visualStyle}
              onValueChange={(val) => onChange({ visualStyle: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Visual style" />
              </SelectTrigger>
              <SelectContent>
                {VISUAL_STYLES.map((vs) => (
                  <SelectItem key={vs} value={vs}>
                    {vs}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Target Audience
            </label>
            <Input
              value={data.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              placeholder="e.g. Creative technologists & designers"
              className="text-xs"
            />
          </div>

          {/* Color Palette */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Color Palette Direction
            </label>
            <Input
              value={data.colorPalette}
              onChange={(e) => onChange({ colorPalette: e.target.value })}
              placeholder="e.g. Deep Obsidian Black, Electric Cobalt (#2563EB), Neon Mint (#10B981)"
              className="text-xs"
            />
          </div>

          {/* Typography Directives */}
          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Typography Specification
            </label>
            <Input
              value={data.typography}
              onChange={(e) => onChange({ typography: e.target.value })}
              placeholder="e.g. Display: Neue Haas Bold. Body: Inter Medium"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Expandable Optional Settings: Brand Assets & Image Direction */}
      <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
          className="flex items-center justify-between w-full p-3.5 bg-white dark:bg-[#111726] text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-rose-500" />
            <span>Brand Information & Visual Asset Placement</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Logo Placement, Focal Asset Direction, Safe Margins)
            </span>
          </div>
          {isOptionalOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isOptionalOpen && (
          <div className="p-4 bg-slate-50/50 dark:bg-[#0E1422]/60 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Brand Information & Safe Margins
              </label>
              <Input
                value={data.brandInformation}
                onChange={(e) => onChange({ brandInformation: e.target.value })}
                placeholder="e.g. Logo in top-right corner. Swiss modern grid with 32px safe margins."
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Focal Visual / Graphic Direction
              </label>
              <Textarea
                rows={2}
                value={data.imageDirection}
                onChange={(e) => onChange({ imageDirection: e.target.value })}
                placeholder="e.g. Central abstract 3D metallic fluid sculpture floating over dark grid field..."
                className="text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
