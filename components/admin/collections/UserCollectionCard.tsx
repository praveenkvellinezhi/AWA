"use client";

import React from "react";
import { UserCollection } from "@/lib/types/collection";
import { ReadOnlyBadge, TemplateCountBadge } from "./CollectionBadges";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Calendar, User, Mail, Layers } from "lucide-react";

interface UserCollectionCardProps {
  collection: UserCollection;
  onView: (col: UserCollection) => void;
}

export function UserCollectionCard({
  collection,
  onView,
}: UserCollectionCardProps) {
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

  const userInitials = collection.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={() => onView(collection)}
      className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-2xs space-y-3 cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
    >
      {/* Top row: Read Only badge + Template count */}
      <div className="flex items-center justify-between gap-2">
        <ReadOnlyBadge />
        <TemplateCountBadge count={collection.templateCount} />
      </div>

      {/* Collection name */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {collection.name}
        </h4>
        {collection.description && (
          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
            {collection.description}
          </p>
        )}
      </div>

      {/* Owner Info */}
      <div className="flex items-center gap-2.5 pt-1">
        <Avatar className="h-7 w-7 ring-1 ring-slate-200 dark:ring-zinc-800">
          {collection.userAvatar && (
            <AvatarImage src={collection.userAvatar} alt={collection.userName} />
          )}
          <AvatarFallback className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block truncate">
            {collection.userName}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {collection.userEmail}
          </span>
        </div>
      </div>

      {/* Footer: Date & View Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formatDate(collection.createdAt)}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView(collection);
          }}
          className="h-7 px-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 gap-1 rounded-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </Button>
      </div>
    </div>
  );
}
