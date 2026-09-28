"use client";

import React from "react";
import { AuditLogEntry } from "@/lib/types/collection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, X, Clock, Terminal } from "lucide-react";

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogModal({ logs, isOpen, onClose }: AuditLogModalProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getActionColor = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "create":
        return "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "activate":
        return "text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800";
      case "deactivate":
        return "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "reorder":
        return "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800";
      default:
        return "text-slate-700 bg-slate-50 dark:text-zinc-300 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Client Audit Log Activity
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                Lightweight client-side audit recording for collection lifecycle actions.
              </DialogDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Log stream */}
        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-center py-8 text-slate-400 italic">No audit records logged yet.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/30 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white font-sans text-xs">
                      {log.collectionName || log.collectionId}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(log.timestamp)}</span>
                  </span>
                </div>

                {log.details && (
                  <p className="text-[11px] text-slate-600 dark:text-zinc-300 font-sans pl-1">
                    {log.details}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-xl"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
