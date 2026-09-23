"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { ListOrdered, Video, Plus, Trash2, Save, CheckCircle2 } from "lucide-react";

export default function AdminUsagePage() {
  const { templates, updateTemplate } = useDemo();

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "");
  const [videoUrl, setVideoUrl] = useState(templates[0]?.videoUrl || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const [steps, setSteps] = useState(activeTemplate.usageSteps || []);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const found = templates.find((t) => t.id === id);
    if (found) {
      setSteps(found.usageSteps || []);
      setVideoUrl(found.videoUrl || "");
    }
  };

  const handleStepChange = (index: number, field: "title" | "instruction", val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    setSteps(updated);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        title: `Step ${steps.length + 1} Title`,
        instruction: "Describe user action on external tool...",
      },
    ]);
  };

  const handleDeleteStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(updated);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateTemplate(activeTemplate.id, {
      usageSteps: steps,
      videoUrl: videoUrl.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#15803D] dark:text-emerald-400">
            FEAT-033 • Guidance Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <ListOrdered className="h-7 w-7 text-[#15803D] dark:text-emerald-400" />
            Usage Guidance & Video Content
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Author sequential written steps (4–7 steps) and attach video walkthrough links for external tools.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Template Picker */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] shadow-xs transition-colors">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Template to Edit Guidance Content:
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.categoryName})
              </option>
            ))}
          </select>
        </div>

        {/* Video Embed URL */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-2 shadow-xs transition-colors">
          <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="h-4 w-4 text-[#15803D] dark:text-emerald-400" />
            Optional Walkthrough Video Embed URL (FEAT-019)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube-nocookie.com/embed/..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Steps Editor */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] space-y-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-[#15803D] dark:text-emerald-400" />
              Sequential Usage Steps ({steps.length} steps configured)
            </h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#EAF5ED] dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008235] text-xs font-bold text-white shrink-0 mt-1 shadow-xs">
                  {idx + 1}
                </span>

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                    placeholder="Step Title (e.g. Access Prompt Command)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                  />
                  <textarea
                    value={step.instruction}
                    onChange={(e) => handleStepChange(idx, "instruction", e.target.value)}
                    placeholder="Detailed instruction on what to click on external tool..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteStep(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 mt-1 transition-colors"
                  title="Delete step"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Usage steps updated!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#008235] hover:bg-[#006e2c] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Guidance Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
