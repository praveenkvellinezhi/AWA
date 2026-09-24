"use client";

import React, { useState } from "react";
import {
  Camera,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Palette,
  Sun,
  Eye,
  Layers,
  HelpCircle,
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
import { ImageBuilderData, ValidationErrors } from "./types";

interface ImageBuilderProps {
  data: ImageBuilderData;
  onChange: (updated: Partial<ImageBuilderData>) => void;
  errors?: ValidationErrors;
}

const IMAGE_TYPES = [
  "Product Photography",
  "Portraits & Characters",
  "Architecture & Interiors",
  "Conceptual & Landscapes",
  "3D Render & CGI",
  "Vector & Graphic Art",
  "Editorial Fashion",
  "Macro Photography",
];

const VISUAL_STYLES = [
  "Commercial Minimalist",
  "Cinematic Realism",
  "Moody Dark Editorial",
  "Clean Scandinavian",
  "Cyberpunk & Neon",
  "Surrealist Dreamscape",
  "Analog Vintage 35mm",
  "Hyper-detailed Studio",
];

const ASPECT_RATIOS = [
  { label: "1:1 Square (Default)", value: "1:1" },
  { label: "16:9 Landscape Widescreen", value: "16:9" },
  { label: "9:16 Vertical Story / Reel", value: "9:16" },
  { label: "4:3 Classic Standard", value: "4:3" },
  { label: "3:4 Editorial Portrait", value: "3:4" },
  { label: "21:9 Ultra-widescreen Cinema", value: "21:9" },
];

const LIGHTING_OPTIONS = [
  "Soft Diffused Studio Lighting",
  "Golden Hour Natural Sunlight",
  "Dramatic Rim & Chiaroscuro",
  "Volumetric Atmospheric Neon",
  "Overcast Soft Daylight",
  "High-Key Commercial Studio",
];

const CAMERA_OPTIONS = [
  "85mm f/1.4 Portrait Prime Lens",
  "50mm f/1.2 Standard Prime",
  "35mm Street Documentary Lens",
  "100mm f/2.8 Macro Lens",
  "24mm Wide Angle Architectural",
  "Hasselblad Medium Format Studio",
];

const QUALITY_OPTIONS = [
  "Ultra-High 8K Studio --v 6.1 --style raw",
  "Standard Photorealistic --v 6.1",
  "Artistic Stylized --v 6.1 --s 250",
  "Raw Cinematic Film Grain --v 6.1",
];

export function ImageBuilder({ data, onChange, errors }: ImageBuilderProps) {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Image Generation Prompt & Parameters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure the primary generation prompt, variable slots, optical settings, and rendering parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Main Image Prompt Editor with Variable Pills */}
      <PromptEditor
        label="Main Generation Prompt"
        value={data.prompt}
        onChange={(val) => onChange({ prompt: val })}
        placeholder="A high-end editorial studio photograph of [SUBJECT]..."
        helperText="Supports bracket tokens like [SUBJECT], [STYLE], [ENVIRONMENT], [LIGHTING], [CAMERA], [ASPECT_RATIO]."
        suggestedVariables={[
          "[SUBJECT]",
          "[STYLE]",
          "[ENVIRONMENT]",
          "[LIGHTING]",
          "[CAMERA]",
          "[ASPECT_RATIO]",
          "[COLOR_PALETTE]",
          "[MOOD]",
        ]}
        error={errors?.mainPrompt}
        minRows={5}
        highlightCategory="Image Generation"
      />

      {/* Image Configuration Grid */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Image Parameters & Optics</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Tuned for Midjourney, FLUX, and SDXL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Image Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Image Type
            </label>
            <Select
              value={data.imageType}
              onValueChange={(val) => onChange({ imageType: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visual Style */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Visual Style
            </label>
            <Select
              value={data.visualStyle}
              onValueChange={(val) => onChange({ visualStyle: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select visual style" />
              </SelectTrigger>
              <SelectContent>
                {VISUAL_STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Aspect Ratio
            </label>
            <Select
              value={data.aspectRatio}
              onValueChange={(val) => onChange({ aspectRatio: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ar) => (
                  <SelectItem key={ar.value} value={ar.value}>
                    {ar.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lighting */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Lighting Setup
            </label>
            <Select
              value={data.lighting}
              onValueChange={(val) => onChange({ lighting: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select lighting" />
              </SelectTrigger>
              <SelectContent>
                {LIGHTING_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Camera / Lens */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Camera / Lens Spec
            </label>
            <Select
              value={data.cameraLens}
              onValueChange={(val) => onChange({ cameraLens: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select lens" />
              </SelectTrigger>
              <SelectContent>
                {CAMERA_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality & Model Flags */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Quality & Engine Flags
            </label>
            <Select
              value={data.quality}
              onValueChange={(val) => onChange({ quality: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Quality profile" />
              </SelectTrigger>
              <SelectContent>
                {QUALITY_OPTIONS.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mood */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Atmospheric Mood
            </label>
            <Input
              value={data.mood}
              onChange={(e) => onChange({ mood: e.target.value })}
              placeholder="e.g. Clean, Luxurious, Serene"
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
              placeholder="e.g. Neutral Warm Alabaster, Matte Slate, Sandstone Accents"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Expandable Optional Directives: Negative Prompt, Inpainting, Variants */}
      <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
          className="flex items-center justify-between w-full p-3.5 bg-white dark:bg-[#111726] text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Optional Image Refinement Settings</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Negative Prompt, Reference Image, Variation Guidelines)
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
            {/* Negative Prompt */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Negative Prompt (What to exclude)
              </label>
              <Textarea
                rows={2}
                value={data.negativePrompt}
                onChange={(e) => onChange({ negativePrompt: e.target.value })}
                placeholder="low quality, blur, noise, plastic skin, distorted proportions, watermark..."
                className="text-xs font-mono"
              />
            </div>

            {/* Reference Image URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Reference Image URL (Image-to-Image / Style Reference)
              </label>
              <Input
                value={data.referenceImageUrl}
                onChange={(e) => onChange({ referenceImageUrl: e.target.value })}
                placeholder="https://... (Optional style reference image URL)"
                className="text-xs font-mono"
              />
            </div>

            {/* Editing & Variation Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Image Editing / Inpainting Instructions
                </label>
                <Textarea
                  rows={2}
                  value={data.editingInstructions}
                  onChange={(e) => onChange({ editingInstructions: e.target.value })}
                  placeholder="Maintain clean background reflections and preserve authentic material textures..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Variation Instructions
                </label>
                <Textarea
                  rows={2}
                  value={data.variationInstructions}
                  onChange={(e) => onChange({ variationInstructions: e.target.value })}
                  placeholder="Generate variations with subtle shifts in camera angle or rim light..."
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
