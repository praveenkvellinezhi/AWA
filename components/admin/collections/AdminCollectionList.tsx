"use client";

import React, { useState } from "react";
import { AdminCollection, CollectionStatus } from "@/lib/types/collection";
import { CollectionStatusBadge, TemplateCountBadge } from "./CollectionBadges";
import { AdminCollectionCard } from "./AdminCollectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  Edit2,
  Eye,
  Power,
  PowerOff,
  Layers,
  Sparkles,
  X,
  Calendar,
} from "lucide-react";

interface AdminCollectionListProps {
  collections: AdminCollection[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: "all" | CollectionStatus;
  onStatusFilterChange: (st: "all" | CollectionStatus) => void;
  onCreateNew: () => void;
  onEdit: (col: AdminCollection) => void;
  onView: (col: AdminCollection) => void;
  onUpdateStatus: (id: string, newStatus: CollectionStatus) => Promise<AdminCollection>;
}

export function AdminCollectionList({
  collections,
  isLoading,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateNew,
  onEdit,
  onView,
  onUpdateStatus,
}: AdminCollectionListProps) {
  const [collectionPendingDeactivation, setCollectionPendingDeactivation] = useState<AdminCollection | null>(null);

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

  const handleStatusToggle = (col: AdminCollection) => {
    if (col.status === "active") {
      // Prompt confirmation dialog before deactivating (Requirement 28)
      setCollectionPendingDeactivation(col);
    } else {
      // Activating can happen directly
      onUpdateStatus(col.id, "active");
    }
  };

  const handleConfirmDeactivate = () => {
    if (collectionPendingDeactivation) {
      onUpdateStatus(collectionPendingDeactivation.id, "inactive");
      setCollectionPendingDeactivation(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter, and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 w-full">
          {/* Search collections... */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search collections by title, description, or template..."
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

          {/* Status filter: All, Active, Inactive */}
          <div className="w-full sm:w-44">
            <Select
              value={statusFilter}
              onValueChange={(val) => onStatusFilterChange(val as "all" | CollectionStatus)}
            >
              <SelectTrigger className="h-10 text-xs bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="all" className="text-xs">
                  All Statuses
                </SelectItem>
                <SelectItem value="active" className="text-xs">
                  Active Only
                </SelectItem>
                <SelectItem value="inactive" className="text-xs">
                  Inactive Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Create collection button */}
        <Button
          type="button"
          onClick={onCreateNew}
          className="h-10 px-4 rounded-xl font-bold bg-[#008235] hover:bg-[#006e2c] text-white shadow-sm gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </Button>
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
        /* Empty States */
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery || statusFilter !== "all"
                ? "No collections match your search"
                : "No curated collections yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try clearing filters or searching for different keywords."
                : "Curate sets of templates to recommend to users on the platform home page."}
            </p>
          </div>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onSearchChange("");
                onStatusFilterChange("all");
              }}
              className="text-xs rounded-xl"
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onCreateNew}
              className="h-9 px-4 rounded-xl font-bold bg-[#008235] hover:bg-[#006e2c] text-white text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Collection</span>
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#121316] overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-zinc-900/60 border-b border-slate-200/80 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[38%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Collection Name
                  </TableHead>
                  <TableHead className="w-[14%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Status
                  </TableHead>
                  <TableHead className="w-[16%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Template Count
                  </TableHead>
                  <TableHead className="w-[14%] text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-[18%] text-right text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {collections.map((col) => {
                  const isActive = col.status === "active";
                  return (
                    <TableRow
                      key={col.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      {/* Name & description */}
                      <TableCell className="py-3.5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white block">
                            {col.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 block">
                            {col.description || "No description"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5">
                        <CollectionStatusBadge status={col.status} />
                      </TableCell>

                      {/* Template Count */}
                      <TableCell className="py-3.5">
                        <TemplateCountBadge count={col.templateCount} />
                      </TableCell>

                      {/* Last Updated */}
                      <TableCell className="py-3.5">
                        <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(col.updatedAt)}</span>
                        </div>
                      </TableCell>

                      {/* Actions: View, Edit, Activate/Deactivate */}
                      <TableCell className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(col)}
                            className="h-8 px-2.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg gap-1"
                            title="Preview user recommendation appearance"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View</span>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(col)}
                            className="h-8 px-2.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg gap-1"
                            title="Edit collection"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(col)}
                            className={`h-8 px-2.5 text-xs font-semibold rounded-lg gap-1.5 ${
                              isActive
                                ? "text-slate-500 hover:text-rose-600 hover:border-rose-300 border-slate-200 dark:border-zinc-800"
                                : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70"
                            }`}
                            title={isActive ? "Deactivate collection" : "Activate collection"}
                          >
                            {isActive ? (
                              <>
                                <PowerOff className="w-3 h-3 text-slate-400" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Power className="w-3 h-3 text-emerald-600" />
                                <span>Activate</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {collections.map((col) => (
              <AdminCollectionCard
                key={col.id}
                collection={col}
                onEdit={onEdit}
                onView={onView}
                onToggleStatus={handleStatusToggle}
              />
            ))}
          </div>
        </>
      )}

      {/* Confirmation Dialog on Deactivate (Requirement 28) */}
      <AlertDialog
        open={Boolean(collectionPendingDeactivation)}
        onOpenChange={(open) => !open && setCollectionPendingDeactivation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this collection?</AlertDialogTitle>
            <AlertDialogDescription>
              {collectionPendingDeactivation && (
                <span>
                  &ldquo;{collectionPendingDeactivation.name}&rdquo; will no longer appear in recommendations. Its templates and configuration will remain completely safe and intact.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
