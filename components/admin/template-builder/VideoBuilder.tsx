"use client";

import React, { useState } from "react";
import {
  Film,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Video,
  Play,
  Layers,
  Music,
  Maximize2,
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
import { VideoBuilderData, ValidationErrors } from "./types";

interface VideoBuilderProps {
  data: VideoBuilderData;
  onChange: (updated: Partial<VideoBuilderData>) => void;
  errors?: ValidationErrors;
}

const VIDEO_TYPES = [
  "Text-to-Video",
  "Image-to-Video",
  "Start & End Frame Keyframing",
  "Reference-to-Video",
  "Character Motion Reference",
  "Product Showcase Video",
];

const DURATIONS = [
  { label: "4 Seconds (Runway standard)", value: "4s" },
  { label: "5 Seconds (Luma / Kling standard)", value: "5s" },
  { label: "10 Seconds (Extended)", value: "10s" },
  { label: "15 Seconds (Long form loop)", value: "15s" },
];

const ASPECT_RATIOS = [
  { label: "16:9 Landscape (Cinematic)", value: "16:9" },
  { label: "9:16 Vertical (Reels / TikTok)", value: "9:16" },
  { label: "1:1 Square (Social)", value: "1:1" },
  { label: "21:9 Ultra-widescreen Widescreen", value: "21:9" },
];

const CAMERA_MOVEMENTS = [
  "Smooth Dolly In & Tracking",
  "Dynamic 360 Orbit",
  "Slow Pan Left to Right",
  "FPV Drone Flythrough",
  "Static Locked-Off Camera",
  "Crane / Jib Shot Descending",
  "Handheld Kinetic Shaky Cam",
  "Zoom Out Reveal",
];

const MOTION_INTENSITIES = [
  "Subtle Natural (Low motion drift)",
  "Cinematic Flow (Balanced pace)",
  "High Speed Action (Dynamic velocity)",
  "Slow Motion 60fps (Fluid deceleration)",
];

const FRAME_RATES = [
  "24 fps (Cinematic Film Standard)",
  "30 fps (Broadcast & Web)",
  "60 fps (Ultra Smooth Interpolated)",
];

const VISUAL_STYLES = [
  "Hyper-realistic Cinema (35mm Anamorphic)",
  "Commercial Advertisement (Ultra Clean)",
  "Anime & Stylized 2D/3D Animation",
  "Sci-Fi CGI Motion Graphics",
  "Documentary Realism (Natural Ambient)",
];

export function VideoBuilder({ data, onChange, errors }: VideoBuilderProps) {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Video Generation Prompt & Motion Direction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure motion vectors, camera paths, temporal duration, and video prompt tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Main Video Prompt Editor */}
      <PromptEditor
        label="Video Generation Prompt"
        value={data.prompt}
        onChange={(val) => onChange({ prompt: val })}
        placeholder="Cinematic wide-angle tracking shot of [SUBJECT] moving across [SCENE]..."
        helperText="Supports tokens: [SUBJECT], [SCENE], [ACTION], [CAMERA_MOVEMENT], [LIGHTING], [STYLE], [DURATION], [ASPECT_RATIO]."
        suggestedVariables={[
          "[SUBJECT]",
          "[SCENE]",
          "[ACTION]",
          "[CAMERA_MOVEMENT]",
          "[LIGHTING]",
          "[STYLE]",
          "[DURATION]",
          "[ASPECT_RATIO]",
          "[MOTION_INTENSITY]",
          "[FRAME_RATE]",
        ]}
        error={errors?.mainPrompt}
        minRows={5}
        highlightCategory="Video Generation"
      />

      {/* Video Motion Configuration Grid */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>Motion Parameters & Camera Path</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Optimized for Runway Gen-3, Kling, Luma Dream Machine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Video Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Video Pipeline Type
            </label>
            <Select
              value={data.videoType}
              onValueChange={(val) => onChange({ videoType: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Duration
            </label>
            <Select
              value={data.duration}
              onValueChange={(val) => onChange({ duration: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
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

          {/* Camera Movement */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Camera Movement
            </label>
            <Select
              value={data.cameraMovement}
              onValueChange={(val) => onChange({ cameraMovement: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Camera path" />
              </SelectTrigger>
              <SelectContent>
                {CAMERA_MOVEMENTS.map((cm) => (
                  <SelectItem key={cm} value={cm}>
                    {cm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motion Intensity */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Motion Intensity
            </label>
            <Select
              value={data.motionIntensity}
              onValueChange={(val) => onChange({ motionIntensity: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Motion intensity" />
              </SelectTrigger>
              <SelectContent>
                {MOTION_INTENSITIES.map((mi) => (
                  <SelectItem key={mi} value={mi}>
                    {mi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frame Rate */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Frame Rate
            </label>
            <Select
              value={data.frameRate}
              onValueChange={(val) => onChange({ frameRate: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Frame rate" />
              </SelectTrigger>
              <SelectContent>
                {FRAME_RATES.map((fr) => (
                  <SelectItem key={fr} value={fr}>
                    {fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visual Style */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Visual Cinematic Style
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

          {/* Audio */}
          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Music className="w-3 h-3 text-purple-500" />
              <span>Audio & Ambience</span>
            </label>
            <Input
              value={data.audio}
              onChange={(e) => onChange({ audio: e.target.value })}
              placeholder="e.g. Ambient Cinematic Drone, Wind"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Expandable Optional Settings: Keyframing, Reference Images, Negative Prompt */}
      <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
          className="flex items-center justify-between w-full p-3.5 bg-white dark:bg-[#111726] text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span>Optional Keyframing & Assets</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Start Frame, End Frame, Reference Image, Negative Prompt)
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Frame */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Start Frame Image URL (Optional)
                </label>
                <Input
                  value={data.startFrameUrl}
                  onChange={(e) => onChange({ startFrameUrl: e.target.value })}
                  placeholder="https://... initial keyframe"
                  className="text-xs font-mono"
                />
              </div>

              {/* End Frame */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  End Frame Image URL (Optional)
                </label>
                <Input
                  value={data.endFrameUrl}
                  onChange={(e) => onChange({ endFrameUrl: e.target.value })}
                  placeholder="https://... final keyframe interpolation"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Reference Image */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Character / Asset Reference URL
              </label>
              <Input
                value={data.referenceImageUrl}
                onChange={(e) => onChange({ referenceImageUrl: e.target.value })}
                placeholder="https://... character consistency reference"
                className="text-xs font-mono"
              />
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Negative Motion Prompt (Avoid in motion)
              </label>
              <Textarea
                rows={2}
                value={data.negativePrompt}
                onChange={(e) => onChange({ negativePrompt: e.target.value })}
                placeholder="jerky motion, morphing distortions, glitch, jittery frame, unnatural limb bending..."
                className="text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
