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
} from "lucide-react";
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
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

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
              Set typographic hierarchies, canvas specifications, headline copy, and design prompts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Design Prompt */}
      <PromptEditor
        label="Graphic Design Generation Prompt"
        value={data.prompt}
        onChange={(val) => onChange({ prompt: val })}
        placeholder="Design a museum-grade typographic event poster for [HEADLINE]..."
        helperText="Supports tokens: [HEADLINE], [SUPPORTING_TEXT], [CTA], [VISUAL_STYLE], [COLOR_PALETTE], [CANVAS_SIZE], [DIMENSIONS]."
        suggestedVariables={[
          "[HEADLINE]",
          "[SUPPORTING_TEXT]",
          "[CTA]",
          "[VISUAL_STYLE]",
          "[COLOR_PALETTE]",
          "[CANVAS_SIZE]",
          "[DIMENSIONS]",
          "[TARGET_AUDIENCE]",
        ]}
        error={errors?.mainPrompt}
        minRows={5}
        highlightCategory="Graphic Design"
      />

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
