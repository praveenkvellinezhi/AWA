"use client";

import React, { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { Template } from "@/lib/types";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Search,
  Eye,
} from "lucide-react";

export default function AdminTemplatesPage() {
  const { templates, categories, aiTools, addTemplate, updateTemplate, deleteTemplate } = useDemo();

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "cat-image-gen");
  const [formDescription, setFormDescription] = useState("");
  const [formPromptText, setFormPromptText] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [formStyle, setFormStyle] = useState("");
  const [formMood, setFormMood] = useState("");
  const [formToolId, setFormToolId] = useState("tool-midjourney");
  const [formToolModel, setFormToolModel] = useState("Midjourney v6.1");
  const [formToolReason, setFormToolReason] = useState("Best for photorealistic studio lighting");

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openNewEditor = () => {
    setEditingTemplateId(null);
    setFormName("");
    setFormCategoryId(categories[0]?.id || "cat-image-gen");
    setFormDescription("");
    setFormPromptText("");
    setFormTags("Commercial, Studio, Editorial");
    setFormDifficulty("Beginner");
    setFormStyle("Editorial Studio");
    setFormMood("Warm & Organic");
    setFormToolId("tool-midjourney");
    setFormToolModel("Midjourney v6.1");
    setFormToolReason("Best for photorealistic studio lighting");
    setIsEditorOpen(true);
  };

  const openEditEditor = (template: Template) => {
    setEditingTemplateId(template.id);
    setFormName(template.name);
    setFormCategoryId(template.categoryId);
    setFormDescription(template.description);
    setFormPromptText(template.promptText);
    setFormTags(template.tags.join(", "));
    setFormDifficulty(template.difficulty);
    setFormStyle(template.style);
    setFormMood(template.mood);
    if (template.recommendedTools[0]) {
      setFormToolId(template.recommendedTools[0].toolId);
      setFormToolModel(template.recommendedTools[0].modelName);
      setFormToolReason(template.recommendedTools[0].reason);
    }
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPromptText.trim()) return;

    const category = categories.find((c) => c.id === formCategoryId);
    const categoryName = category?.name || "Image Generation";
    const tags = formTags.split(",").map((t) => t.trim()).filter(Boolean);

    const recommendedTools = [
      {
        toolId: formToolId,
        toolName: aiTools.find((t) => t.id === formToolId)?.name || "Midjourney",
        modelName: formToolModel,
        reason: formToolReason,
      },
    ];

    if (editingTemplateId) {
      updateTemplate(editingTemplateId, {
        name: formName.trim(),
        categoryId: formCategoryId,
        categoryName,
        description: formDescription.trim(),
        promptText: formPromptText.trim(),
        tags,
        difficulty: formDifficulty,
        style: formStyle.trim(),
        mood: formMood.trim(),
        recommendedTools,
      });
    } else {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: formName.trim(),
        slug: formName.toLowerCase().replace(/\s+/g, "-"),
        categoryId: formCategoryId,
        categoryName,
        description: formDescription.trim(),
        promptText: formPromptText.trim(),
        tags,
        difficulty: formDifficulty,
        style: formStyle.trim(),
        mood: formMood.trim(),
        recommendedTools,
        usageSteps: [
          { stepNumber: 1, title: "Access Prompt Command", instruction: "Open tool and start new prompt." },
          { stepNumber: 2, title: "Paste Prompt", instruction: "Paste exact copied text from AWA." },
          { stepNumber: 3, title: "Render & Upscale", instruction: "Pick cleanest output and export." },
        ],
        thumbnailGradient: "from-indigo-900 via-purple-900 to-slate-900",
        likesCount: 1,
        savesCount: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
      };
      addTemplate(newTemplate);
    }

    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            FEAT-030 • Authoring Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 mt-1">
            <FileText className="h-7 w-7 text-indigo-400" />
            Templates & Prompts Authoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author finished, ready-to-use prompt text. No guided input fields or fill-in-the-blanks.
          </p>
        </div>

        <button
          onClick={openNewEditor}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Author New Template</span>
        </button>
      </div>

      {/* Authoring Guidelines Notice (FEAT-030 Rule) */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-200">
        <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
        <span>
          <strong>Strict Authoring Standard:</strong> All AWA prompts must be 100% complete and ready-to-run verbatim. Never use placeholder brackets like &quot;[Insert Brand Name Here]&quot; or guided blanks.
        </span>
      </div>

      {/* Editor Modal / Drawer */}
      {isEditorOpen && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl border border-purple-500/40 bg-slate-900 shadow-2xl space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              {editingTemplateId ? "Edit Template & Prompt" : "Author New Finished Template"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Template Name
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Architectural Dusk Villa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Public Description (Free evaluation before paywall)
            </label>
            <textarea
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="What this template creates and what tools it is intended for..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Finished Prompt Field (FEAT-030) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-300 uppercase font-mono">
                🔒 Finished Prompt Text (Subscriber Protected)
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">
                NO guided/blank fields
              </span>
            </div>
            <textarea
              required
              value={formPromptText}
              onChange={(e) => setFormPromptText(e.target.value)}
              placeholder="Paste finished ready-to-run prompt text, camera lenses, lighting parameters, and aspect ratio flags..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Metadata attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Style / Aesthetic
              </label>
              <input
                type="text"
                value={formStyle}
                onChange={(e) => setFormStyle(e.target.value)}
                placeholder="e.g. Editorial Studio"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mood
              </label>
              <input
                type="text"
                value={formMood}
                onChange={(e) => setFormMood(e.target.value)}
                placeholder="e.g. Warm & Organic"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Recommended Tool Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recommended AI Model (FEAT-031)
              </label>
              <input
                type="text"
                value={formToolModel}
                onChange={(e) => setFormToolModel(e.target.value)}
                placeholder="e.g. Midjourney v6.1 or Runway Gen-3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                One-Line Rationale (FEAT-017)
              </label>
              <input
                type="text"
                value={formToolReason}
                onChange={(e) => setFormToolReason(e.target.value)}
                placeholder="e.g. Best for studio lighting and waxy texture"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Save Template
            </button>
          </div>
        </form>
      )}

      {/* Templates Table */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter templates..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Model Tag</th>
                  <th className="py-3 px-4">Likes / Saves</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{template.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono line-clamp-1 max-w-xs">
                        {template.promptText}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[11px]">
                        {template.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-300">
                        {template.recommendedTools[0]?.modelName || "None"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      👍 {template.likesCount} • 🔖 {template.savesCount}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditEditor(template)}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit template"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
