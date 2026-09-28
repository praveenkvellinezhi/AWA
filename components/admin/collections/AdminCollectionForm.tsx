"use client";

import React, { useState } from "react";
import {
  AdminCollection,
  CollectionTemplateItem,
  CollectionStatus,
  CreateAdminCollectionDTO,
  UpdateAdminCollectionDTO,
} from "@/lib/types/collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateSelector } from "./TemplateSelector";
import { SelectedTemplates } from "./SelectedTemplates";
import { CollectionPreview } from "./CollectionPreview";
import { ArrowLeft, Save, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface AdminCollectionFormProps {
  initialCollection?: AdminCollection | null;
  onSubmit: (dto: CreateAdminCollectionDTO | UpdateAdminCollectionDTO) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AdminCollectionForm({
  initialCollection,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminCollectionFormProps) {
  const isEditing = Boolean(initialCollection);

  const [name, setName] = useState(initialCollection?.name || "");
  const [description, setDescription] = useState(initialCollection?.description || "");
  const [status, setStatus] = useState<CollectionStatus>(initialCollection?.status || "active");
  const [templates, setTemplates] = useState<CollectionTemplateItem[]>(
    initialCollection?.templates || []
  );

  const [nameError, setNameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleAddTemplate = (template: CollectionTemplateItem) => {
    // Check duplicate
    if (templates.some((t) => t.id === template.id)) {
      setGeneralError("This template is already included in this collection.");
      return;
    }
    setGeneralError(null);
    setTemplates((prev) => [...prev, template]);
  };

  const handleRemoveTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  const handleReorderTemplates = (reordered: CollectionTemplateItem[]) => {
    setTemplates(reordered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setGeneralError(null);

    if (!name.trim()) {
      setNameError("Collection Name is required.");
      return;
    }

    if (templates.length === 0) {
      setGeneralError("Please select at least one template to include in this collection.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status,
        templates,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to save collection.";
      setGeneralError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </Button>

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? "Edit Curated Collection" : "Create New Admin Collection"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isEditing
                ? `Modifying collection: ${initialCollection?.name}`
                : "Curate a set of templates to feature in user recommendation feeds."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl font-bold bg-[#008235] hover:bg-[#006e2c] text-white shadow-sm gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Update Collection" : "Create Collection"}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* General error alert */}
      {generalError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-semibold">{generalError}</span>
        </div>
      )}

      {/* Core Fields Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
          Collection Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Collection Name */}
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="col-name" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Collection Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="col-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. Business Presentation Templates"
              className={`h-10 text-xs sm:text-sm bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl ${
                nameError ? "border-rose-500 focus:ring-rose-500" : ""
              }`}
            />
            {nameError && (
              <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="col-status" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Recommendation Status
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as CollectionStatus)}
            >
              <SelectTrigger id="col-status" className="h-10 text-xs bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="active" className="text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Active (In Recommendations)</span>
                  </div>
                </SelectItem>
                <SelectItem value="inactive" className="text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Inactive (Hidden)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="col-desc" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            Description <span className="text-slate-400 font-normal">(Optional guidance for users)</span>
          </Label>
          <Textarea
            id="col-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Curated templates for business workflows, executive slide decks, and marketing sprints..."
            rows={2}
            className="text-xs sm:text-sm bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl resize-none"
          />
        </div>
      </div>

      {/* Live Recommendation Preview (Requirement 13) */}
      <CollectionPreview
        name={name}
        description={description}
        status={status}
        templates={templates}
      />

      {/* Selected Templates & Ordering Section (Requirements 10 & 12) */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-4">
        <SelectedTemplates
          templates={templates}
          onReorder={handleReorderTemplates}
          onRemove={handleRemoveTemplate}
        />
      </div>

      {/* Template Selection Catalogue (Requirements 10 & 11) */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-4">
        <TemplateSelector
          selectedTemplates={templates}
          onAddTemplate={handleAddTemplate}
          onRemoveTemplate={handleRemoveTemplate}
        />
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 px-5 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 rounded-xl font-bold bg-[#008235] hover:bg-[#006e2c] text-white shadow-sm gap-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving Collection...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Save & Update Collection" : "Create Collection"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
