"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Tags, Cpu, CheckCircle2, ArrowRight, Save, Info } from "lucide-react";

export default function AdminRecommendationsPage() {
  const { templates, categories, aiTools, updateTemplate } = useDemo();

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "");
  const [reason, setReason] = useState("");
  const [selectedModel, setSelectedModel] = useState("Midjourney v6.1");
  const [isSaved, setIsSaved] = useState(false);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;

    const matchedTool = aiTools.find((tool) =>
      tool.models.some((m) => m.name === selectedModel)
    ) || aiTools[0];

    const newRecommendation = {
      toolId: matchedTool.id,
      toolName: matchedTool.name,
      modelName: selectedModel,
      reason: reason.trim() || "Optimal prompt compatibility and lighting accuracy",
      badge: "Curated Match",
    };

    updateTemplate(activeTemplate.id, {
      recommendedTools: [newRecommendation, ...(activeTemplate.recommendedTools.slice(1) || [])],
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15803D] dark:text-emerald-400">
            FEAT-031 • Tagging & Inheritance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Tags className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            Tool/Model Assignment & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign 1–3 AI tools and specific models to templates, each paired with an expert one-line reason (FEAT-017).
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#F2F8F4] dark:bg-emerald-950/20 border border-[#D1E7DD] dark:border-emerald-500/30 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
        <Info className="h-5 w-5 text-[#15803D] dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Inheritance Model:</strong> Templates inherit tool recommendations assigned to their parent category unless individually overridden here.
        </span>
      </div>

      {/* Editor Form */}
      <form
        onSubmit={handleUpdate}
        className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-6 shadow-xs transition-colors"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Template to Configure
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                const t = templates.find((tem) => tem.id === e.target.value);
                if (t?.recommendedTools[0]) {
                  setSelectedModel(t.recommendedTools[0].modelName);
                  setReason(t.recommendedTools[0].reason);
                }
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.categoryName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            >
              <option value="Midjourney v6.1">Midjourney v6.1</option>
              <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
              <option value="OpenAI Sora">OpenAI Sora</option>
              <option value="FLUX.1 Schnell">FLUX.1 Schnell</option>
              <option value="Pika 1.5">Pika 1.5</option>
              <option value="v0 React / Tailwind">v0 React / Tailwind</option>
              <option value="Framer AI 2.0">Framer AI 2.0</option>
              <option value="Gamma Presentation AI">Gamma Presentation AI</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            One-Line Rationale (Displayed directly to users under FEAT-017)
          </label>
          <input
            type="text"
            required
            value={reason || activeTemplate.recommendedTools[0]?.reason || ""}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Best for photorealistic studio lighting and warm waxy textures"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Current Live Preview */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
            User-Facing Recommendation Card Preview:
          </span>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#D1E7DD] dark:border-emerald-500/40 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Recommended Tool</span>
                <span className="text-xs font-mono text-[#15803D] dark:text-emerald-300 px-2 py-0.5 rounded bg-[#EAF5ED] dark:bg-emerald-950/60 border border-[#D1E7DD] dark:border-emerald-800/40 font-semibold">
                  {selectedModel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Why this tool:</strong> {reason || activeTemplate.recommendedTools[0]?.reason}
              </p>
            </div>
            <Cpu className="h-5 w-5 text-[#15803D] dark:text-emerald-400 shrink-0" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          {isSaved ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Recommendation saved!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes apply instantly to template views.
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Tool Assignment</span>
          </button>
        </div>
      </form>
    </div>
  );
}
