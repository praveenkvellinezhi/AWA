"use client";

import React from "react";
import { Template } from "@/lib/types";
import { TemplateMasonryCard } from "./home/TemplateMasonryCard";

interface TemplateCardProps {
  template: Template;
  priority?: boolean;
}

export function TemplateCard({ template, priority }: TemplateCardProps) {
  return <TemplateMasonryCard template={template} priority={priority} />;
}
