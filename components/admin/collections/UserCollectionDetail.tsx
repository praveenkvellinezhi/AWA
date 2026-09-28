"use client";

import React from "react";
import Link from "next/link";
import { UserCollection } from "@/lib/types/collection";
import { ReadOnlyBadge, TemplateCountBadge } from "./CollectionBadges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Layers,
  ShieldAlert,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react";

interface UserCollectionDetailProps {
  collection: UserCollection;
  onBack: () => void;
}

export function UserCollectionDetail({
  collection,
  onBack,
}: UserCollectionDetailProps) {
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

  const userInitials = collection.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

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
                User Collection Inspection
              </span>
              <ReadOnlyBadge />
              <TemplateCountBadge count={collection.templateCount} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {collection.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="text-xs rounded-xl"
          >
            Done Inspecting
          </Button>
        </div>
      </div>

      {/* Read-Only Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs sm:text-sm">
          <span className="font-bold">Admin Read-Only Mode:</span>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            This collection was saved by a registered platform user. Administrators can inspect template usage, user activity, and curation patterns, but cannot edit, reorder, delete, or alter user collections to maintain user privacy and autonomy.
          </p>
        </div>
      </div>

      {/* Owner & Collection Metadata Panel (Full Width) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
          Customer & Collection Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Column 1: Owner Details */}
          <div className="flex items-start gap-3.5">
            <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-zinc-800 shrink-0">
              {collection.userAvatar && (
                <AvatarImage src={collection.userAvatar} alt={collection.userName} />
              )}
              <AvatarFallback className="bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Saved By
              </span>
              <span className="font-bold text-base text-slate-900 dark:text-white block truncate">
                {collection.userName}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{collection.userEmail}</span>
              </span>
            </div>
          </div>

          {/* Column 2: System Identifiers */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 pt-3 md:pt-0 md:pl-6 text-xs font-mono">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Collection Metadata
            </span>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Collection ID:</span>
              <span className="font-bold text-slate-700 dark:text-zinc-300">{collection.id}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">User ID:</span>
              <span className="font-bold text-slate-700 dark:text-zinc-300">{collection.userId}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Total Items:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {collection.templateCount} Guides
              </span>
            </div>
          </div>

          {/* Column 3: Timestamps */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 pt-3 md:pt-0 md:pl-6 text-xs font-mono">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Timeline Records
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

        {/* User Description / Notes */}
        {collection.description && (
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              User Collection Notes
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed p-3.5 rounded-xl bg-slate-50/60 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800">
              {collection.description}
            </p>
          </div>
        )}
      </div>

      {/* Included Templates (Full Width Showcase) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Included Templates ({collection.templates.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Ordered as saved by user
          </span>
        </div>

        {collection.templates.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No templates currently saved in this collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
            {collection.templates.map((tpl, index) => {
              const orderNum = (index + 1).toString().padStart(2, "0");

              return (
                <div
                  key={tpl.id || index}
                  className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/40 dark:bg-[#16181f] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Thumbnail with sequence badge */}
                  <div className="relative h-32 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    {tpl.thumbnail ? (
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Layers className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-black/70 text-white backdrop-blur-xs">
                      #{orderNum}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 dark:bg-zinc-900/95 text-slate-800 dark:text-zinc-200 backdrop-blur-xs">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {tpl.name}
                      </h4>
                      {tpl.description && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {tpl.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400 text-[10px]">
                        {tpl.id.substring(0, 18)}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Active Guide</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
