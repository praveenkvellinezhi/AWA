"use client";

import React, { useState } from "react";
import {
  Globe,
  Code2,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layout,
  Layers,
  Copy,
  Check,
  Tag,
  Plus,
  X,
  Server,
  Database,
  Shield,
  Palette,
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
import { WebsiteBuilderData, ValidationErrors } from "./types";
import { combinePrompts } from "@/lib/prompt-utils";

interface WebsiteBuilderProps {
  data: WebsiteBuilderData;
  onChange: (updated: Partial<WebsiteBuilderData>) => void;
  errors?: ValidationErrors;
}

const FRAMEWORKS = [
  "Next.js 14 App Router (React)",
  "React + Vite SPA",
  "HTML5 + Vanilla CSS + JS",
  "Astro Static / SSR",
  "Vue 3 + Nuxt",
  "SvelteKit",
];

const STYLING_OPTIONS = [
  "TailwindCSS v3",
  "Vanilla Modern CSS Tokens",
  "CSS Modules",
  "Styled Components",
  "Sass / SCSS",
];

const DATABASES = [
  "Supabase PostgreSQL",
  "Prisma ORM (PostgreSQL)",
  "MongoDB / Mongoose",
  "LocalStorage / In-Memory Mock",
  "None / Static Presentation",
];

const AUTHS = [
  "Supabase Auth (Magic Link, OAuth)",
  "NextAuth.js / Auth.js",
  "Clerk Authentication",
  "None / Public Open Access",
];

const APIS = [
  "REST Route Handlers (Next.js)",
  "React Server Actions",
  "tRPC End-to-End Type-Safe",
  "External GraphQL / REST API",
];

const ANIMATION_OPTIONS = [
  "CSS Transitions & Keyframes",
  "Framer Motion Smooth Spring",
  "GSAP ScrollTrigger",
  "Lucide Animated SVGs",
];

const NAVIGATION_OPTIONS = [
  "Sticky Glassmorphism Header with Blur",
  "Clean Floating Dock Nav",
  "Minimalist Centered Navigation",
  "Side Navigation Drawer",
];

export function WebsiteBuilder({ data, onChange, errors }: WebsiteBuilderProps) {
  const [activePromptTab, setActivePromptTab] = useState<"separate" | "combined">("separate");
  const [copiedCombined, setCopiedCombined] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const [sectionInput, setSectionInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const combinedPrompt = combinePrompts(data.uiPrompt, data.contextPrompt);

  const handleCopyCombined = () => {
    navigator.clipboard.writeText(combinedPrompt);
    setCopiedCombined(true);
    setTimeout(() => setCopiedCombined(false), 2000);
  };

  const handleAddPage = () => {
    if (!pageInput.trim() || data.pages.includes(pageInput.trim())) return;
    onChange({ pages: [...data.pages, pageInput.trim()] });
    setPageInput("");
  };

  const handleRemovePage = (page: string) => {
    onChange({ pages: data.pages.filter((p) => p !== page) });
  };

  const handleAddSection = () => {
    if (!sectionInput.trim() || data.sections.includes(sectionInput.trim())) return;
    onChange({ sections: [...data.sections, sectionInput.trim()] });
    setSectionInput("");
  };

  const handleRemoveSection = (section: string) => {
    onChange({ sections: data.sections.filter((s) => s !== section) });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || data.features.includes(featureInput.trim())) return;
    onChange({ features: [...data.features, featureInput.trim()] });
    setFeatureInput("");
  };

  const handleRemoveFeature = (feature: string) => {
    onChange({ features: data.features.filter((f) => f !== feature) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Website & Web Application Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulate project context, page requirements, technical stack, and dual UI/Context prompts.
            </p>
          </div>
        </div>
      </div>

      {/* Project Context Box */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-blue-500" />
            <span>Project & Product Context</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Informs the AI of business domain & audience
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Project / App Name
            </label>
            <Input
              value={data.projectName}
              onChange={(e) => onChange({ projectName: e.target.value })}
              placeholder="e.g. Aura SaaS Platform"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Industry / Vertical
            </label>
            <Input
              value={data.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
              placeholder="e.g. Developer Tools / FinTech / E-Commerce"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Target Audience
            </label>
            <Input
              value={data.targetAudience}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              placeholder="e.g. SaaS Founders, Engineers, Creators"
              className="text-xs"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Business / Product Proposition
            </label>
            <Input
              value={data.businessProduct}
              onChange={(e) => onChange({ businessProduct: e.target.value })}
              placeholder="e.g. Next-generation AI creation workspace with 1-click execution"
              className="text-xs"
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Primary Objective
            </label>
            <Input
              value={data.purpose}
              onChange={(e) => onChange({ purpose: e.target.value })}
              placeholder="e.g. Conversion to free trial signups"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Website Structure Requirements (Pages, Sections, Features) */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span>Page Structure & Interactive Requirements</span>
        </h4>

        {/* Pages Tags */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            Pages Included
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPage();
                }
              }}
              placeholder="Add page (e.g. Landing Page, Pricing, Dashboard)..."
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPage}
              disabled={!pageInput.trim()}
              className="text-xs shrink-0"
            >
              Add Page
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.pages.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePage(p)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Sections Tags */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            Page Sections
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSection();
                }
              }}
              placeholder="Add section (e.g. Hero Banner, Feature Matrix, FAQ Accordion)..."
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSection}
              disabled={!sectionInput.trim()}
              className="text-xs shrink-0"
            >
              Add Section
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.sections.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSection(s)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features Tags */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            Interactive Features
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="Add feature (e.g. Dark Mode Toggle, Stripe Checkout, Live Prompt Copy)..."
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              disabled={!featureInput.trim()}
              className="text-xs shrink-0"
            >
              Add Feature
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <span>{f}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(f)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Navigation, Forms, Integrations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Navigation Style
            </label>
            <Select
              value={data.navigation}
              onValueChange={(val) => onChange({ navigation: val })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Nav style" />
              </SelectTrigger>
              <SelectContent>
                {NAVIGATION_OPTIONS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Forms & Capture
            </label>
            <Input
              value={data.forms}
              onChange={(e) => onChange({ forms: e.target.value })}
              placeholder="e.g. Email Waitlist Capture"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Integrations
            </label>
            <Input
              value={data.integrations}
              onChange={(e) => onChange({ integrations: e.target.value })}
              placeholder="e.g. Stripe Checkout & Supabase"
              className="text-xs"
            />
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
                  ? "bg-blue-600 text-white shadow-xs"
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
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Combined Prompt</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Separates Visual UI from Business Logic
          </span>
        </div>

        {activePromptTab === "separate" ? (
          <div className="space-y-5">
            {/* UI Prompt */}
            <PromptEditor
              label="UI Generation Prompt (Visual & Interface)"
              value={data.uiPrompt}
              onChange={(val) => onChange({ uiPrompt: val })}
              placeholder="Build a cutting-edge SaaS landing page with dark mode aesthetics..."
              helperText="Specifies interface visual components, layout, animations, Tailwind styling, and responsive layout."
              suggestedVariables={[
                "[PROJECT_NAME]",
                "[STYLE]",
                "[COLOR_PALETTE]",
                "[FRAMEWORK]",
                "[STYLING]",
              ]}
              error={errors?.uiPrompt}
              minRows={5}
              highlightCategory="UI & Visuals"
            />

            {/* Context Prompt */}
            <PromptEditor
              label="Context Prompt (System Logic, Personas & Purpose)"
              value={data.contextPrompt}
              onChange={(val) => onChange({ contextPrompt: val })}
              placeholder="Project context: A developer-first AI creation tool named AWA..."
              helperText="Explains target personas, user stories, business proposition, data schemas, and requirements."
              suggestedVariables={[
                "[PROJECT_NAME]",
                "[BUSINESS_PRODUCT]",
                "[TARGET_AUDIENCE]",
                "[PURPOSE]",
                "[INDUSTRY]",
              ]}
              error={errors?.contextPrompt}
              minRows={5}
              highlightCategory="Context & Logic"
            />
          </div>
        ) : (
          /* Live Combined Prompt View */
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Live Combined Prompt (What users copy from AWA)
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

      {/* Technical Requirements Grid */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E1422] border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Technical Stack Requirements</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Framework */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Framework
            </label>
            <Select
              value={data.framework}
              onValueChange={(val) => onChange({ framework: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Styling */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Styling & CSS
            </label>
            <Select
              value={data.styling}
              onValueChange={(val) => onChange({ styling: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select styling" />
              </SelectTrigger>
              <SelectContent>
                {STYLING_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Database */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Database
            </label>
            <Select
              value={data.database}
              onValueChange={(val) => onChange({ database: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select database" />
              </SelectTrigger>
              <SelectContent>
                {DATABASES.map((db) => (
                  <SelectItem key={db} value={db}>
                    {db}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Authentication */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Authentication
            </label>
            <Select
              value={data.authentication}
              onValueChange={(val) => onChange({ authentication: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select auth" />
              </SelectTrigger>
              <SelectContent>
                {AUTHS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              API Architecture
            </label>
            <Select
              value={data.api}
              onValueChange={(val) => onChange({ api: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select API" />
              </SelectTrigger>
              <SelectContent>
                {APIS.map((api) => (
                  <SelectItem key={api} value={api}>
                    {api}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Animation */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Animation Library
            </label>
            <Select
              value={data.animation}
              onValueChange={(val) => onChange({ animation: val })}
            >
              <SelectTrigger className="text-xs font-mono">
                <SelectValue placeholder="Select animation" />
              </SelectTrigger>
              <SelectContent>
                {ANIMATION_OPTIONS.map((an) => (
                  <SelectItem key={an} value={an}>
                    {an}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
