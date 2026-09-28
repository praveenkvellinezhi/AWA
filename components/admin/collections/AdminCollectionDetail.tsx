"use client";

import React from "react";
import { AdminCollection, CollectionStatus } from "@/lib/types/collection";
import { CollectionStatusBadge, TemplateCountBadge } from "./CollectionBadges";
import { CollectionPreview } from "./CollectionPreview";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  Power,
  PowerOff,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface AdminCollectionDetailProps {
  collection: AdminCollection;
  onBack: () => void;
  onEdit: (col: AdminCollection) => void;
  onToggleStatus: (col: AdminCollection) => void;
}

export function AdminCollectionDetail({
  collection,
  onBack,
  onEdit,
  onToggleStatus,
}: AdminCollectionDetailProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const isActive = collection.status === "active";

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 gap-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </Button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Admin Curated Collection
              </span>
              <CollectionStatusBadge status={collection.status} />
              <TemplateCountBadge count={collection.templateCount} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {collection.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(collection)}
            className={`h-9 px-3 rounded-xl text-xs font-semibold gap-1.5 ${
              isActive
                ? "text-slate-500 hover:text-slate-900 border-slate-200 dark:border-zinc-800"
                : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
            }`}
          >
            {isActive ? (
              <>
                <PowerOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <Power className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activate in Recommendations</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => onEdit(collection)}
            className="h-9 px-4 rounded-xl font-bold bg-[#008235] hover:bg-[#006e2c] text-white shadow-sm gap-1.5 text-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Collection</span>
          </Button>
        </div>
      </div>

      {/* Overview Metadata Bar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Collection Description
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              {collection.description || "No description provided."}
            </p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 pt-3 md:pt-0 md:pl-6 text-xs font-mono">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Recommendation Engine Status
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                {isActive ? "Actively Served in Recommendations" : "Inactive (Hidden from users)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans pt-1">
              {isActive
                ? "This collection is eligible for user home page recommendation feeds."
                : "This collection will not appear in recommendation queries until activated."}
            </p>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 pt-3 md:pt-0 md:pl-6 text-xs font-mono">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Lifecycle Timestamps
            </span>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Created:</span>
              <span className="text-slate-700 dark:text-zinc-300">{formatDate(collection.createdAt)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Last Modified:</span>
              <span className="text-slate-700 dark:text-zinc-300">{formatDate(collection.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Preview */}
      <CollectionPreview
        name={collection.name}
        description={collection.description}
        status={collection.status}
        templates={collection.templates}
      />
    </div>
  );
}
