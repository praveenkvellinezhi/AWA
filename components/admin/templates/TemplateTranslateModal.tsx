"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Template } from "@/lib/types";
import { TemplateTranslateTab } from "./TemplateTranslateTab";

interface TemplateTranslateModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotice?: (msg: string) => void;
}

export function TemplateTranslateModal({
  template,
  open,
  onOpenChange,
  onNotice,
}: TemplateTranslateModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F17] border-slate-200 dark:border-zinc-800 p-6">
        <TemplateTranslateTab
          template={template}
          onSavedNotice={onNotice}
        />
      </DialogContent>
    </Dialog>
  );
}
