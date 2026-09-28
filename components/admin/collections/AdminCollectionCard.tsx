"use client";

import React from "react";
import { AdminCollection, CollectionStatus } from "@/lib/types/collection";
import { CollectionStatusBadge, TemplateCountBadge } from "./CollectionBadges";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Power, PowerOff, Layers, Calendar } from "lucide-react";

interface AdminCollectionCardProps {
  collection: AdminCollection;
  onEdit: (col: AdminCollection) => void;
  onView: (col: AdminCollection) => void;
  onToggleStatus: (col: AdminCollection) => void;
}

export function AdminCollectionCard({
  collection,
  onEdit,
  onView,
  onToggleStatus,
}: AdminCollectionCardProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const isActive = collection.status === "active";

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-3.5">
      {/* Top row: Status badge + Template count */}
      <div className="flex items-center justify-between gap-2">
        <CollectionStatusBadge status={collection.status} />
        <TemplateCountBadge count={collection.templateCount} />
      </div>

      {/* Collection name & description */}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {collection.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
          {collection.description || "No description provided."}
        </p>
      </div>

      {/* Template thumbnails strip */}
      {collection.templates.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {collection.templates.slice(0, 4).map((tpl, i) => (
            <div
              key={tpl.id || i}
              className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800"
              title={tpl.name}
            >
              {tpl.thumbnail ? (
                <img src={tpl.thumbnail} alt={tpl.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
          {collection.templates.length > 4 && (
            <div className="h-10 px-2 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
              +{collection.templates.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Footer: Date & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formatDate(collection.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(collection)}
            className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 gap-1 rounded-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(collection)}
            className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 gap-1 rounded-lg"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(collection)}
            className={`h-8 px-2.5 text-xs font-semibold rounded-lg gap-1 ${
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
                <Power className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Activate</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
