"use client";

import React from "react";
import { TemplateStep } from "@/lib/types";
import { WorkflowStep } from "./WorkflowStep";

interface WorkflowStepPreviewProps {
  step: TemplateStep;
  mode?: "preview" | "user" | "compact";
  className?: string;
}

export function WorkflowStepPreview({
  step,
  mode = "preview",
  className = "",
}: WorkflowStepPreviewProps) {
  return (
    <WorkflowStep
      step={step}
      mode={mode}
      className={className}
    />
  );
}
