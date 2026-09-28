"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { AITool } from "@/lib/types";
import { AI_TOOL_PRESETS, getToolLogo } from "@/lib/tool-logos";
import {
  Cpu,
  Plus,
  Archive,
  ExternalLink,
  X,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";

export default function AdminToolsPage() {
  const { aiTools, addAITool, toggleRetireAITool } = useDemo();

  const [isCreating, setIsCreating] = useState(false);
  const [toolName, setToolName] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("Image");
  const [description, setDescription] = useState("");
  const [defaultModel, setDefaultModel] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof AI_TOOL_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setToolName(preset.name);
    setVendor(preset.vendor);
    setCategory(preset.category);
    setDefaultModel(preset.defaultModel);
    setExternalUrl(preset.externalUrl);
    setImageUrl(preset.logoUrl);
    setDescription(preset.description);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    const finalLogo = imageUrl.trim() || getToolLogo(toolName.trim(), category);

    const newTool: AITool = {
      id: `tool-${Date.now()}`,
      name: toolName.trim(),
      vendor: vendor.trim() || "Independent",
      category,
      description: description.trim() || "Generative AI system for production workflows.",
      isRetired: false,
      externalUrl: externalUrl.trim() || undefined,
      imageUrl: finalLogo,
      logoUrl: finalLogo,
      models: [
        {
          id: `mod-${Date.now()}`,
          name: defaultModel.trim() || `${toolName.trim()} v1.0`,
          isDefault: true,
        },
      ],
    };

    addAITool(newTool);
    resetForm();
    setIsCreating(false);
  };

  const resetForm = () => {
    setToolName("");
    setVendor("");
    setDefaultModel("");
    setDescription("");
    setExternalUrl("");
    setImageUrl("");
    setSelectedPreset(null);
  };

  return (
    <div className="space-y-8 admin-scope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15803D] dark:text-emerald-400">
            FEAT-032 • Master Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Cpu className="h-7 w-7 text-amber-500 dark:text-amber-400" />
            AI Tools & Models Master List
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain the master registry of external generative AI models, logo assets, versions, and active/retired status.
          </p>
        </div>

        <button
          onClick={() => {
            if (isCreating) {
              setIsCreating(false);
            } else {
              resetForm();
              setIsCreating(true);
            }
          }}
          className="px-4 py-2.5 rounded-none bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{isCreating ? "Close Form" : "Register New AI Tool"}</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-none border border-[#D1E7DD] dark:border-emerald-500/40 bg-white dark:bg-[#131B2A] space-y-5 shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Register New External AI Tool / Model
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick-Pick Presets Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Quick-Fill from Popular AI Tools</span>
              </label>
              {selectedPreset && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {AI_TOOL_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={preset.logoUrl}
                      alt={preset.name}
                      className="w-4 h-4 object-contain shrink-0"
                    />
                    <span>{preset.name}</span>
                    {isSelected && <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tool Name *
              </label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. Luma Dream Machine"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Creator
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g. Luma AI"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Model Name *
              </label>
              <input
                type="text"
                required
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                placeholder="e.g. Dream Machine 1.5"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Code / Web">Code / Web</option>
                <option value="Design / Slides">Design / Slides</option>
                <option value="Poster & Design">Poster & Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                External Web URL
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://lumalabs.ai"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Tool Logo / Image URL & Live Preview */}
          <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-none space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tool Logo / Image Asset</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                URL, WebP, PNG, or SVG Data URI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-3 space-y-1.5">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/logo.svg or pick from quick-presets above"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 font-mono text-[11px]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tip: If left blank, a standard brand or category icon will be automatically assigned.
                </p>
              </div>

              {/* Live Preview Swatch */}
              <div className="flex items-center gap-3 md:justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-12 w-12 border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center p-1.5 shadow-2xs">
                    <img
                      src={imageUrl.trim() || getToolLogo(toolName || "AI", category)}
                      alt="Light preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Light</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="h-12 w-12 border border-slate-700 bg-[#0B0F19] flex items-center justify-center p-1.5 shadow-2xs">
                    <img
                      src={imageUrl.trim() || getToolLogo(toolName || "AI", category)}
                      alt="Dark preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Dark</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of capabilities, architecture, and optimal workflows..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-none bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              Save Tool to Registry
            </button>
          </div>
        </form>
      )}

      {/* Master List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiTools.map((tool) => {
          const logoSrc = tool.imageUrl || tool.logoUrl || getToolLogo(tool.name, tool.category);

          return (
            <div
              key={tool.id}
              className={`rounded-none border p-5 space-y-4 flex flex-col justify-between transition-all ${
                tool.isRetired
                  ? "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60"
                  : "bg-white dark:bg-[#131B2A] border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-xs"
              }`}
            >
              <div className="space-y-3">
                {/* Header row with Tool Image and Badges */}
                <div className="flex items-start gap-3">
                  {/* Tool Image / Logo container (Admin 0px radius) */}
                  <div className="w-12 h-12 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-none flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={logoSrc}
                      alt={tool.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getToolLogo(tool.name, tool.category);
                      }}
                    />
                  </div>

                  {/* Title and Category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono truncate">
                        {tool.category}
                      </span>
                      {tool.isRetired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                          Retired
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{tool.name}</span>
                      {tool.externalUrl && (
                        <a
                          href={tool.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[#15803D] dark:hover:text-emerald-400 transition-colors shrink-0"
                          title="Open website"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      By {tool.vendor}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                {/* Models list */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                    Registered Models:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tool.models.map((mod) => (
                      <span
                        key={mod.id}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {mod.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Retire action */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  ID: {tool.id.replace("tool-", "")}
                </span>
                <button
                  onClick={() => toggleRetireAITool(tool.id)}
                  className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    tool.isRetired
                      ? "text-emerald-600 dark:text-emerald-400 hover:underline"
                      : "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                  }`}
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>{tool.isRetired ? "Reactivate" : "Retire Tool"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
