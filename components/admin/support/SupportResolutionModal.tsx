"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportRequest } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface SupportResolutionModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmResolve: (requestId: string, resolutionSummary: string) => void;
}

export function SupportResolutionModal({
  request,
  isOpen,
  onClose,
  onConfirmResolve,
}: SupportResolutionModalProps) {
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleResolve = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmResolve(request.id, resolutionSummary.trim());
      setIsSubmitting(false);
      setResolutionSummary("");
      onClose();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Resolve Support Request</DialogTitle>
              <DialogDescription className="font-mono text-xs">
                {request.id} • {request.subject}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Marking this request as <strong>Resolved</strong> indicates that the issue has been addressed and the user has been provided with a solution.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Resolution Summary</span>
              <span className="text-[10px] text-muted-foreground font-normal">(Recommended)</span>
            </label>
            <Textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="e.g. Provided instructions for uploading the correct reference image and configured camera parameters."
              rows={3}
              className="text-xs bg-background resize-none"
            />
            <p className="text-[10px] text-muted-foreground">
              This summary will be recorded in the support audit trail and displayed in the user resolution card.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleResolve}
            disabled={isSubmitting}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? "Resolving..." : "Confirm & Resolve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
