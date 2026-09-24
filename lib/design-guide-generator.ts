import {
  DesignWorkflowConfig,
  DesignGenerationType,
  DesignAsset,
  UsageStep,
  Template,
} from "./types";
import { getTemplateCategoryKey, generateCategoryToolSteps } from "./category-guide-config";

/**
 * Checks if a given template is an AI Poster or Graphic Design tutorial.
 */
export function isDesignGenerationTemplate(template: {
  categoryId?: string;
  categoryName?: string;
  category?: string;
  slug?: string;
  tags?: string[];
  recommendedTools?: { toolName: string }[];
  description?: string;
  name?: string;
  designWorkflow?: unknown;
}): boolean {
  return getTemplateCategoryKey(template) === "poster-design";
}

/**
 * Human-readable title for each design generation workflow.
 */
export function getDesignWorkflowTitle(type: DesignGenerationType): string {
  switch (type) {
    case "prompt-to-poster":
      return "Prompt → Master Poster";
    case "prompt-to-social-post":
      return "Prompt → Social Media Creative";
    case "prompt-to-banner":
      return "Prompt → Digital Banner";
    case "prompt-to-flyer":
      return "Prompt → High-Impact Flyer";
    case "prompt-to-ad":
      return "Prompt → Advertising Graphic";
    case "product-to-poster":
      return "Product Image → Promotional Poster";
    case "image-to-design":
      return "Image + Typography → Complete Design";
    case "reference-to-design":
      return "Reference Design → New Creative";
    case "screenshot-to-design":
      return "Design Screenshot → Editable Layout";
    case "template-to-design":
      return "Template → Custom Graphic";
    case "existing-design-redesign":
      return "Existing Design → Modern Redesign";
    case "brand-design":
      return "Brand Assets → Consistent Graphic Design";
    case "multi-format-design":
      return "Master Design → Multi-Format Campaign";
    default:
      return "AI Graphic Design Workflow";
  }
}

/**
 * Human-readable short description for each workflow type.
 */
export function getDesignWorkflowDescription(
  type: DesignGenerationType,
  toolName: string
): string {
  switch (type) {
    case "prompt-to-poster":
      return `Generate a professional, high-resolution poster with curated typography, layout balance, and visual hierarchy in ${toolName}.`;
    case "prompt-to-social-post":
      return `Create a scroll-stopping social media post optimized for mobile engagement and platform aspect ratios in ${toolName}.`;
    case "prompt-to-banner":
      return `Produce a high-converting digital banner with clean typography, clear CTA placement, and safe margins in ${toolName}.`;
    case "prompt-to-flyer":
      return `Design an eye-catching promotional flyer with bold headlines, date/venue details, and print-ready margins in ${toolName}.`;
    case "prompt-to-ad":
      return `Build a high-performance commercial advertisement highlighting key value propositions and visual focal points in ${toolName}.`;
    case "product-to-poster":
      return `Place your product image into a bespoke commercial poster with realistic lighting, shadows, and luxury aesthetic in ${toolName}.`;
    case "image-to-design":
      return `Combine a generative hero visual with vector typography, badges, and layout elements in ${toolName}.`;
    case "reference-to-design":
      return `Use an existing design as inspiration for composition, color harmony, and visual balance to build original creative in ${toolName}.`;
    case "screenshot-to-design":
      return `Reconstruct layout grids, card styles, and visual direction from a design screenshot into an editable canvas in ${toolName}.`;
    case "template-to-design":
      return `Customize a proven graphic design template with your own copy, assets, and brand palette in ${toolName}.`;
    case "existing-design-redesign":
      return `Modernize the visual hierarchy, typography, and spacing of an existing design in ${toolName}.`;
    case "brand-design":
      return `Enforce brand consistency across logo placement, corporate color tokens, typography scales, and guidelines in ${toolName}.`;
    case "multi-format-design":
      return `Create a primary creative and seamlessly resize it across Instagram, Facebook, and Web formats with safe-area auditing in ${toolName}.`;
    default:
      return `Follow this structured walkthrough to generate, refine, verify, and export your design in ${toolName}.`;
  }
}

/**
 * Resolves the dynamic design workflow config for a given template.
 */
export function resolveDesignWorkflow(
  template: Template,
  activeToolName?: string
): DesignWorkflowConfig {
  if (template.designWorkflow) {
    return {
      ...template.designWorkflow,
      tool: activeToolName || template.designWorkflow.tool,
    };
  }

  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();
  const prompt = (template.promptText || "").toLowerCase();

  let generationType: DesignGenerationType = "prompt-to-poster";
  let designType = "Event Poster";
  const assets: DesignAsset[] = [];
  let format = "A4 Poster (210 × 297 mm)";
  let requiresTextVerification = false;
  let requiresProductAccuracyCheck = false;
  let requiresBrandCheck = false;
  let requiresMultiFormatResize = false;
  const multiFormats: string[] = [];

  // Detect format & dimensions from prompt or name
  if (prompt.includes("--ar 1:1") || tags.includes("instagram") || name.includes("square")) {
    format = "Instagram Post (1080 × 1080 px)";
  } else if (prompt.includes("--ar 9:16") || tags.includes("story") || tags.includes("reel")) {
    format = "Instagram Story (1080 × 1920 px)";
  } else if (prompt.includes("--ar 16:9") || tags.includes("banner") || name.includes("banner")) {
    format = "Website Banner (1200 × 630 px)";
  } else if (prompt.includes("--ar 2:3") || prompt.includes("--ar 3:4") || tags.includes("poster") || tags.includes("flyer")) {
    format = "A4 Poster (210 × 297 mm)";
  }

  // Detect typography-heavy text verification need
  if (
    tags.includes("typography") ||
    tags.includes("swiss style") ||
    tags.includes("bauhaus") ||
    tags.includes("brutalist") ||
    prompt.includes("headline") ||
    prompt.includes("dates") ||
    prompt.includes("venue") ||
    prompt.includes("lineup") ||
    name.includes("festival") ||
    name.includes("exhibition") ||
    name.includes("flyer")
  ) {
    requiresTextVerification = true;
  }

  // 1. Detect Product to Poster
  if (
    tags.includes("product") ||
    name.includes("product") ||
    desc.includes("product") ||
    prompt.includes("product") ||
    prompt.includes("packaging") ||
    prompt.includes("bottle") ||
    prompt.includes("cosmetic")
  ) {
    generationType = "product-to-poster";
    designType = "Product Advertisement";
    requiresProductAccuracyCheck = true;
    assets.push({
      id: "asset-product-img",
      type: "product-image",
      label: "Hero Product Photograph",
      description: "High-resolution isolated photograph of the physical product or packaging on transparent/neutral background.",
      required: true,
      role: "Focal Product Asset",
      format: "PNG / High-Res JPEG",
    });
  }
  // 2. Detect Brand Assets / Identity
  else if (
    tags.includes("branding") ||
    tags.includes("identity") ||
    name.includes("brand") ||
    desc.includes("brandboard") ||
    prompt.includes("brand identity") ||
    prompt.includes("monogram")
  ) {
    generationType = "brand-design";
    designType = "Brand Identity Graphic";
    requiresBrandCheck = true;
    assets.push({
      id: "asset-brand-logo",
      type: "logo",
      label: "Official Vector Brand Logo",
      description: "Vector logo mark and typography lockup with transparent background.",
      required: true,
      role: "Brand Signature",
      format: "SVG / Transparent PNG",
    });
  }
  // 3. Detect Social Media / Multi-Format
  else if (
    tags.includes("social") ||
    tags.includes("instagram") ||
    tags.includes("multi-format") ||
    name.includes("social") ||
    desc.includes("social")
  ) {
    generationType = "multi-format-design";
    designType = "Social Media Campaign";
    requiresMultiFormatResize = true;
    multiFormats.push(
      "Instagram Square Post (1:1 — 1080×1080px)",
      "Instagram Story / Reel (9:16 — 1080×1920px)",
      "Facebook / LinkedIn Banner (16:9 — 1200×630px)"
    );
  }
  // 4. Detect Flyer / Event Poster
  else if (tags.includes("flyer") || name.includes("flyer")) {
    generationType = "prompt-to-flyer";
    designType = "Event Flyer";
    format = "Print Flyer (A5 / 148 × 210 mm)";
    requiresTextVerification = true;
  }
  // 5. Detect Digital Banner
  else if (tags.includes("banner") || name.includes("banner")) {
    generationType = "prompt-to-banner";
    designType = "Web Display Banner";
    format = "Display Banner (1200 × 630 px)";
  }
  // 6. Detect Advertisement
  else if (tags.includes("ad") || tags.includes("advertisement") || name.includes("ad")) {
    generationType = "prompt-to-ad";
    designType = "Commercial Advertisement";
  }

  return {
    tool: activeToolName,
    generationType,
    designType,
    assets,
    format,
    prompt: template.promptText,
    requiresTextVerification,
    requiresProductAccuracyCheck,
    requiresBrandCheck,
    requiresMultiFormatResize,
    multiFormats: multiFormats.length > 0 ? multiFormats : undefined,
    supportedExportFormats: ["PNG", "JPG", "PDF (Print & Standard)", "SVG"],
  };
}

/**
 * Generates tailored step-by-step instructions for the given AI design tool and workflow.
 */
export function generateDesignGuide(
  workflow: DesignWorkflowConfig,
  toolName: string,
  modelName?: string,
  context?: {
    templateTitle?: string;
    promptText?: string;
    style?: string;
    mood?: string;
  }
): UsageStep[] {
  return generateCategoryToolSteps("poster-design", toolName, modelName, {
    name: context?.templateTitle,
    promptText: context?.promptText || workflow.prompt,
    style: context?.style,
    mood: context?.mood,
    tags: [workflow.generationType],
  });
}
