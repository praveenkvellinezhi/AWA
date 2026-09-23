"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { AITool } from "@/lib/types";
import { Cpu, Plus, Edit2, Archive, CheckCircle2, ExternalLink, X } from "lucide-react";

export default function AdminToolsPage() {
  const { aiTools, addAITool, updateAITool, toggleRetireAITool } = useDemo();

  const [isCreating, setIsCreating] = useState(false);
  const [toolName, setToolName] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("Image");
  const [description, setDescription] = useState("");
  const [defaultModel, setDefaultModel] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    const newTool: AITool = {
      id: `tool-${Date.now()}`,
      name: toolName.trim(),
      vendor: vendor.trim() || "Independent",
      category,
      description: description.trim() || "Generative AI system for production workflows.",
      isRetired: false,
      externalUrl: externalUrl.trim() || undefined,
      models: [
        {
          id: `mod-${Date.now()}`,
          name: defaultModel.trim() || `${toolName} v1.0`,
          isDefault: true,
        },
      ],
    };

    addAITool(newTool);
    setToolName("");
    setVendor("");
    setDefaultModel("");
    setDescription("");
    setExternalUrl("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-8">
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
            Maintain the master registry of external generative AI models, versions, and active/retired status.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Register New AI Tool</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl border border-[#D1E7DD] dark:border-emerald-500/40 bg-white dark:bg-[#131B2A] space-y-4 shadow-xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register New External AI Tool / Model</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tool Name</label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. Luma Dream Machine"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vendor / Creator</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g. Luma AI"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Model Name</label>
              <input
                type="text"
                required
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                placeholder="e.g. Dream Machine 1.5"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Code / Web">Code / Web</option>
                <option value="Design / Slides">Design / Slides</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">External Web URL</label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://lumalabs.ai"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs shadow-xs transition-all"
            >
              Save Tool to Registry
            </button>
          </div>
        </form>
      )}

      {/* Master List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool) => (
          <div
            key={tool.id}
            className={`rounded-2xl border p-5 space-y-3 flex flex-col justify-between transition-all ${
              tool.isRetired
                ? "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60"
                : "bg-white dark:bg-[#131B2A] border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-xs"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  {tool.category}
                </span>
                {tool.isRetired ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Retired
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{tool.name}</span>
                {tool.externalUrl && (
                  <a
                    href={tool.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#15803D] dark:hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{tool.description}</p>

              {/* Models list */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                  Registered Models:
                </span>
                <div className="flex flex-wrap gap-1">
                  {tool.models.map((mod) => (
                    <span
                      key={mod.id}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {mod.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Retire action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">By {tool.vendor}</span>
              <button
                onClick={() => toggleRetireAITool(tool.id)}
                className={`flex items-center gap-1 font-semibold transition-colors ${
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
        ))}
      </div>
    </div>
  );
}
