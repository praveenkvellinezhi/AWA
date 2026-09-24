import { UsageStep } from "./types";
import { generateCategoryToolSteps } from "./category-guide-config";

export interface GuideContext {
  templateName?: string;
  promptText?: string;
  style?: string;
  categoryId?: string;
  hasReferenceImage?: boolean;
}

/**
 * Determines whether a template is an image-generation template.
 */
export function isImageGenerationTemplate(template: {
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
  recommendedTools?: { toolName: string }[];
}): boolean {
  const catId = (template.categoryId || "").toLowerCase();
  const catName = (template.categoryName || "").toLowerCase();
  if (catId.includes("image") || catName.includes("image")) return true;

  const imageTools = [
    "midjourney",
    "chatgpt",
    "dall-e",
    "gemini",
    "imagen",
    "firefly",
    "leonardo",
    "ideogram",
    "flux",
    "stable diffusion",
    "sdxl",
    "recraft",
    "playground",
  ];

  return (template.recommendedTools || []).some((tool) =>
    imageTools.some((it) => tool.toolName.toLowerCase().includes(it))
  );
}

/**
 * Dynamically generates 8 tool-specific steps for AI image generation.
 */
export function generateImageGuide(
  toolName: string,
  modelName?: string,
  context?: GuideContext
): UsageStep[] {
  return generateCategoryToolSteps("image-generation", toolName, modelName, {
    name: context?.templateName,
    promptText: context?.promptText,
    style: context?.style,
    categoryId: context?.categoryId,
  });
}
