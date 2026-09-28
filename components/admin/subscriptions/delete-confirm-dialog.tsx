import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { SubscriptionPlanItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  plan: SubscriptionPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode?: "delete" | "deactivate";
}

export function DeleteConfirmDialog({
  plan,
  isOpen,
  onClose,
  onConfirm,
  mode = "delete",
}: DeleteConfirmDialogProps) {
  if (!isOpen || !plan) return null;

  const hasSubscribers = plan.subscribersCount > 0;
  const isDelete = mode === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#111827] shadow-2xl p-6 space-y-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 flex items-center justify-center shrink-0">
            {isDelete ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {isDelete ? `Delete "${plan.name}"?` : `Deactivate "${plan.name}"?`}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {isDelete
                ? "This will permanently remove this subscription plan configuration from the admin catalog."
                : "Deactivating this plan will prevent new customers from subscribing across all configured countries."}
            </p>
          </div>
        </div>

        {/* Warning if plan has active subscribers */}
        {hasSubscribers && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-950 dark:text-amber-100">Active Subscribers Warning</span>
              <p className="text-[11px] leading-tight text-amber-900 dark:text-amber-300">
                This plan currently has <strong>{plan.subscribersCount.toLocaleString()}</strong> active subscribers.
                Their historical subscription records will be preserved in database logs.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-9 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
              isDelete
                ? "bg-rose-600 hover:bg-rose-700 active:scale-95"
                : "bg-amber-600 hover:bg-amber-700 active:scale-95"
            }`}
          >
            {isDelete ? "Confirm Delete" : "Confirm Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}
