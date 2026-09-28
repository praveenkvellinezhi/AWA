"use client";

import React, { useState, useMemo } from "react";
import { UserCollection } from "@/lib/types/collection";
import { ReadOnlyBadge, TemplateCountBadge } from "./CollectionBadges";
import { UserCollectionCard } from "./UserCollectionCard";
import { UserCollectionDetail } from "./UserCollectionDetail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Layers, Lock, Calendar, X, User } from "lucide-react";

interface UserCollectionListProps {
  collections: UserCollection[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUserId: string;
  onUserFilterChange: (userId: string) => void;
  dateRange: "all" | "last7days" | "last30days" | "thisYear";
  onDateRangeChange: (range: "all" | "last7days" | "last30days" | "thisYear") => void;
  onSelectCollection: (col: UserCollection) => void;
}

export function UserCollectionList({
  collections,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedUserId,
  onUserFilterChange,
  dateRange,
  onDateRangeChange,
  onSelectCollection,
}: UserCollectionListProps) {
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

  // Distinct list of users for the filter dropdown
  const distinctUsers = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    collections.forEach((c) => {
      if (!map.has(c.userId)) {
        map.set(c.userId, { id: c.userId, name: c.userName });
      }
    });
    return Array.from(map.values());
  }, [collections]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 w-full">
          {/* Search by collection name, user name, email (Full width without max-w constraint) */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by collection, user name, or email..."
              className="h-10 pl-9 pr-8 text-xs sm:text-sm bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User filter */}
          <div className="w-full sm:w-44">
            <Select
              value={selectedUserId}
              onValueChange={onUserFilterChange}
            >
              <SelectTrigger className="h-10 text-xs bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="all" className="text-xs">
                  All Users
                </SelectItem>
                {distinctUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id} className="text-xs">
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range filter */}
          <div className="w-full sm:w-36">
            <Select
              value={dateRange}
              onValueChange={(val) =>
                onDateRangeChange(val as "all" | "last7days" | "last30days" | "thisYear")
              }
            >
              <SelectTrigger className="h-10 text-xs bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="all" className="text-xs">
                  All Time
                </SelectItem>
                <SelectItem value="last7days" className="text-xs">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="last30days" className="text-xs">
                  Last 30 Days
                </SelectItem>
                <SelectItem value="thisYear" className="text-xs">
                  This Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Read Only indication pill */}
        <div className="shrink-0 flex items-center gap-2">
          <ReadOnlyBadge />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316]">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      ) : collections.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery || selectedUserId !== "all" || dateRange !== "all"
                ? "No user collections match your filters"
                : "No user collections found"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mx-auto">
              {searchQuery || selectedUserId !== "all" || dateRange !== "all"
                ? "Try clearing search queries or switching user/date filters."
                : "User collections saved by platform users will appear here in read-only mode for audit and usage inspection."}
            </p>
          </div>
          {(searchQuery || selectedUserId !== "all" || dateRange !== "all") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onSearchChange("");
                onUserFilterChange("all");
                onDateRangeChange("all");
              }}
              className="text-xs rounded-xl"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#121316] overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-zinc-900/60 border-b border-slate-200/80 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Collection Name
                  </TableHead>
                  <TableHead className="w-[26%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Owner
                  </TableHead>
                  <TableHead className="w-[16%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Template Count
                  </TableHead>
                  <TableHead className="w-[14%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Created Date
                  </TableHead>
                  <TableHead className="w-[14%] text-right text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Last Updated
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {collections.map((col) => {
                  const userInitials = col.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <TableRow
                      key={col.id}
                      onClick={() => onSelectCollection(col)}
                      className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors group"
                    >
                      {/* Collection Name */}
                      <TableCell className="py-3.5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                            {col.name}
                          </span>
                          {col.description && (
                            <span className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 block">
                              {col.description}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Owner */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 ring-1 ring-slate-200 dark:ring-zinc-800 shrink-0">
                            {col.userAvatar && (
                              <AvatarImage src={col.userAvatar} alt={col.userName} />
                            )}
                            <AvatarFallback className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block truncate">
                              {col.userName}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate font-mono">
                              {col.userEmail}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Template Count */}
                      <TableCell className="py-3.5">
                        <TemplateCountBadge count={col.templateCount} />
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="py-3.5">
                        <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(col.createdAt)}</span>
                        </div>
                      </TableCell>

                      {/* Last Updated & Inspect Indicator */}
                      <TableCell className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {formatDate(col.updatedAt)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {collections.map((col) => (
              <UserCollectionCard
                key={col.id}
                collection={col}
                onView={(c) => onSelectCollection(c)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
