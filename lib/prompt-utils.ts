/**
 * Prompt Utilities for Template Detail Page
 * Provides standardized prompt combination, parsing, and AI refinement.
 */

export interface TemplatePrompts {
  uiPrompt: string;
  contextPrompt: string;
}

export interface PromptRefinementResult {
  success: boolean;
  refinedUiPrompt?: string;
  refinedContextPrompt?: string;
  customizedPrompt?: string;
  error?: string;
}

/**
 * Combines UI Prompt and Context Prompt into a single standard structured prompt.
 */
export function combinePrompts(uiPrompt: string, contextPrompt: string): string {
  const cleanUi = (uiPrompt || "").trim();
  const cleanContext = (contextPrompt || "").trim();

  return `[UI PROMPT]

${cleanUi}

[CONTEXT PROMPT]

${cleanContext}`.trim();
}

/**
 * Combines refined UI Prompt and refined Context Prompt into a single standard structured prompt.
 */
export function combineRefinedPrompts(refinedUiPrompt: string, refinedContextPrompt: string): string {
  const cleanUi = (refinedUiPrompt || "").trim();
  const cleanContext = (refinedContextPrompt || "").trim();

  return `[REFINED UI PROMPT]

${cleanUi}

[REFINED CONTEXT PROMPT]

${cleanContext}`.trim();
}

/**
 * Splits a combined prompt string back into UI Prompt and Context Prompt.
 * Gracefully handles both standard [UI PROMPT] and [REFINED UI PROMPT] headers.
 */
export function splitCombinedPrompt(text: string): {
  uiPrompt: string;
  contextPrompt: string;
  isRefined: boolean;
} {
  if (!text || typeof text !== "string") {
    return { uiPrompt: "", contextPrompt: "", isRefined: false };
  }

  const trimmed = text.trim();

  // Check for [REFINED UI PROMPT] / [REFINED CONTEXT PROMPT]
  const refinedMatch = trimmed.match(
    /\[REFINED UI PROMPT\]([\s\S]*?)\[REFINED CONTEXT PROMPT\]([\s\S]*)$/i
  );
  if (refinedMatch) {
    return {
      uiPrompt: refinedMatch[1].trim(),
      contextPrompt: refinedMatch[2].trim(),
      isRefined: true,
    };
  }

  // Check for [UI PROMPT] / [CONTEXT PROMPT]
  const standardMatch = trimmed.match(
    /\[UI PROMPT\]([\s\S]*?)\[CONTEXT PROMPT\]([\s\S]*)$/i
  );
  if (standardMatch) {
    return {
      uiPrompt: standardMatch[1].trim(),
      contextPrompt: standardMatch[2].trim(),
      isRefined: false,
    };
  }

  // Fallback if no explicit headers found
  return {
    uiPrompt: trimmed,
    contextPrompt: "",
    isRefined: false,
  };
}

/**
 * Resolves UI Prompt and Context Prompt from template data.
 * Gracefully handles legacy templates containing only a single prompt field.
 */
export function getTemplatePrompts(template: {
  uiPrompt?: string;
  contextPrompt?: string;
  promptText?: string;
  prompt?: string;
  name?: string;
  description?: string;
  style?: string;
  categoryName?: string;
  tags?: string[];
  websiteWorkflow?: any;
  videoWorkflow?: any;
  presentationWorkflow?: any;
  designWorkflow?: any;
  [key: string]: any;
}): TemplatePrompts {
  const existingUi = (template.uiPrompt || "").trim();
  const existingCtx = (template.contextPrompt || "").trim();

  // Both explicitly provided
  if (existingUi && existingCtx) {
    return {
      uiPrompt: existingUi,
      contextPrompt: existingCtx,
    };
  }

  // Check if legacy prompt has headers already
  const singlePrompt = (template.promptText || template.prompt || "").trim();
  if (singlePrompt) {
    const parsed = splitCombinedPrompt(singlePrompt);
    if (parsed.uiPrompt && parsed.contextPrompt) {
      return {
        uiPrompt: parsed.uiPrompt,
        contextPrompt: parsed.contextPrompt,
      };
    }
  }

  // If UI prompt provided but context missing
  if (existingUi && !existingCtx) {
    return {
      uiPrompt: existingUi,
      contextPrompt: synthesizeContextPrompt(template, singlePrompt),
    };
  }

  // If Context prompt provided but UI missing
  if (!existingUi && existingCtx) {
    return {
      uiPrompt: singlePrompt || synthesizeUiPrompt(template),
      contextPrompt: existingCtx,
    };
  }

  // Legacy single prompt fallback: Synthesize clean UI and Context prompts
  if (singlePrompt) {
    return {
      uiPrompt: extractUiDirectives(singlePrompt, template),
      contextPrompt: synthesizeContextPrompt(template, singlePrompt),
    };
  }

  // Absolute default fallback
  return {
    uiPrompt: synthesizeUiPrompt(template),
    contextPrompt: synthesizeContextPrompt(template, ""),
  };
}

/**
 * Synthesizes a dedicated UI Prompt from template metadata.
 */
function synthesizeUiPrompt(template: {
  name?: string;
  description?: string;
  style?: string;
  tags?: string[];
  categoryName?: string;
}): string {
  const title = template.name || "Modern Application Interface";
  const style = template.style || "Modern Minimalist";
  const tags = (template.tags || []).slice(0, 5).join(", ");

  return `Create a high-fidelity visual UI design and component layout for "${title}". Aesthetic style: ${style}. Visual hierarchy includes: 1) Prominent hero section with high-contrast typography and subtle radiant ambient lighting, 2) Polished card containers with crisp borders, subtle backdrop blur, and generous whitespace, 3) Cohesive color palette with primary accents and dark/light mode balance, 4) Accessible interactive elements, tactile button states, and micro-animations. Fully responsive layout optimized for mobile, tablet, and desktop viewports. Tags: ${tags}.`;
}

/**
 * Extracts and cleans visual UI instructions from a single legacy prompt.
 */
function extractUiDirectives(prompt: string, template: { style?: string; categoryName?: string }): string {
  // If prompt already looks like visual instructions, return it with responsive emphasis
  if (
    prompt.toLowerCase().includes("design") ||
    prompt.toLowerCase().includes("create") ||
    prompt.toLowerCase().includes("layout") ||
    prompt.toLowerCase().includes("theme") ||
    prompt.toLowerCase().includes("cinematic") ||
    prompt.toLowerCase().includes("editorial")
  ) {
    return prompt;
  }

  return `Visual UI & Styling: ${prompt}. Ensure polished responsive spacing, modern typography, crisp UI card surfaces, and accessible contrast according to ${template.style || "modern"} aesthetic standards.`;
}

/**
 * Synthesizes a dedicated Context Prompt from template metadata and legacy prompt.
 */
function synthesizeContextPrompt(
  template: {
    name?: string;
    description?: string;
    categoryName?: string;
    tags?: string[];
    websiteWorkflow?: {
      projectType?: string;
      techStack?: string[];
      features?: string[];
      pages?: string[];
    };
    presentationWorkflow?: {
      topic?: string;
      audience?: string;
      slideCount?: number;
    };
  },
  legacyPrompt: string
): string {
  const name = template.name || "Project";
  const desc = template.description || "A professional, production-ready implementation.";
  const cat = template.categoryName || "Digital Product";
  const stack = template.websiteWorkflow?.techStack?.join(", ") || "React, Tailwind CSS, TypeScript";
  const features = template.websiteWorkflow?.features?.join("; ") || "Intuitive navigation; Core workflow automation; Responsive accessibility";
  const audience = template.presentationWorkflow?.audience || "Product teams, developers, designers, and end users";

  return `Project Context & Requirements:
- Name & Purpose: ${name} (${cat}) — ${desc}
- Target Audience: ${audience}
- Core Functional Requirements: ${features}
- Technical Environment: ${stack}
- Business Objective: Deliver an engaging, high-conversion user experience with clear user flows, robust data presentation, and seamless user interactions without placeholders or broken states.`;
}

/**
 * Reusable mechanism for generating the customized/refined version from both prompts.
 * Applies user instructions across UI and Context dimensions while preserving original requirements.
 */
export async function refinePromptsWithAI(
  uiPrompt: string,
  contextPrompt: string,
  userRequest: string,
  options?: {
    simulateError?: boolean;
    delayMs?: number;
  }
): Promise<PromptRefinementResult> {
  const delay = options?.delayMs ?? 1800 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (options?.simulateError) {
    return {
      success: false,
      error: "We couldn't customize this prompt. Please check your connection and try again.",
    };
  }

  const cleanRequest = (userRequest || "").trim();
  if (!cleanRequest) {
    return {
      success: false,
      error: "Please enter instructions for how you'd like to customize the prompts.",
    };
  }

  const lowerReq = cleanRequest.toLowerCase();

  // Preserve technical parameters at the end of UI prompt if any (e.g., --ar 16:9 --v 6.1 --style raw)
  const paramRegex = /(--[a-zA-Z0-9_-]+(\s+[a-zA-Z0-9_.:]+)?)+$/;
  const paramMatch = uiPrompt.match(paramRegex);
  const parameters = paramMatch ? paramMatch[0] : "";
  const coreUi = paramMatch
    ? uiPrompt.substring(0, paramMatch.index).trim()
    : uiPrompt.trim();

  let modifiedUi = coreUi;
  let modifiedContext = (contextPrompt || "").trim();

  // --- UI-Specific Modifications ---
  const uiKeywords = [
    "dark", "light", "obsidian", "black", "white", "minimal", "minimalist",
    "glassmorphism", "neon", "cyan", "violet", "emerald", "gold", "amber",
    "gradient", "mesh", "border", "padding", "spacing", "grid", "bento",
    "typography", "font", "serif", "sans", "hero", "navbar", "footer",
    "card", "button", "animation", "framer", "responsive", "mobile",
    "candle", "wick", "flame", "smoke", "pedestal", "lighting", "cinematic"
  ];

  const hasUiChanges = uiKeywords.some((k) => lowerReq.includes(k));

  if (lowerReq.includes("dark") || lowerReq.includes("obsidian") || lowerReq.includes("black")) {
    if (!modifiedUi.toLowerCase().includes("obsidian") && !modifiedUi.toLowerCase().includes("dark mode")) {
      modifiedUi += ". Apply an immersive deep obsidian dark mode palette (#090a0f) with subtle neon accent highlights and high-contrast typography.";
    }
  }

  if (lowerReq.includes("light") || lowerReq.includes("clean white") || lowerReq.includes("cream")) {
    modifiedUi = modifiedUi.replace(/dark mode|deep obsidian|#08090d|#090a0f/gi, "clean warm light aesthetic");
    if (!modifiedUi.toLowerCase().includes("light")) {
      modifiedUi += ". Refactor visual theme to a serene, warm-white editorial layout with soft neutral borders and crisp charcoal typography.";
    }
  }

  if (lowerReq.includes("neon") || lowerReq.includes("cyan") || lowerReq.includes("cyber")) {
    if (!modifiedUi.toLowerCase().includes("neon")) {
      modifiedUi += ". Incorporate electric cyan (#00f2fe) and violet glow borders, holographic glass surfaces, and futuristic telemetry accents.";
    }
  }

  if (lowerReq.includes("minimal") || lowerReq.includes("clean") || lowerReq.includes("simple")) {
    modifiedUi += ". Streamline visual elements with generous whitespace, disciplined Swiss typographic scale, and borderless elevation.";
  }

  if (lowerReq.includes("3d") || lowerReq.includes("orb") || lowerReq.includes("glass")) {
    if (!modifiedUi.toLowerCase().includes("glassmorphic")) {
      modifiedUi += ". Feature a central interactive refractive 3D glass component with subtle ambient shadows and depth.";
    }
  }

  // --- Context-Specific Modifications ---
  const contextKeywords = [
    "pricing", "payment", "stripe", "razorpay", "subscription", "enterprise",
    "auth", "login", "signup", "role", "admin", "dashboard", "analytics",
    "telemetry", "ai agent", "api", "webhook", "database", "supabase",
    "ecommerce", "shop", "checkout", "cart", "b2b", "saas", "client",
    "portfolio", "investor", "pitch", "healthcare", "fintech", "travel"
  ];

  const hasContextChanges = contextKeywords.some((k) => lowerReq.includes(k));

  if (lowerReq.includes("stripe") || lowerReq.includes("payment") || lowerReq.includes("checkout") || lowerReq.includes("billing")) {
    modifiedContext += "\n- Payment & Billing: Seamless checkout flow supporting multi-currency billing, instant receipt generation, and enterprise invoicing options.";
    if (!modifiedUi.toLowerCase().includes("pricing") && !modifiedUi.toLowerCase().includes("checkout")) {
      modifiedUi += " Include a dedicated interactive pricing switcher and secure checkout modal preview.";
    }
  }

  if (lowerReq.includes("enterprise") || lowerReq.includes("b2b") || lowerReq.includes("compliance") || lowerReq.includes("security")) {
    modifiedContext += "\n- Enterprise Readiness: SOC2/GDPR compliance posture, role-based access control (RBAC), audit logging, and custom SLA tiers.";
    modifiedUi += " Integrate trust badges, security compliance seals, and enterprise contact drawer.";
  }

  if (lowerReq.includes("ai agent") || lowerReq.includes("agentic") || lowerReq.includes("workflow")) {
    modifiedContext += "\n- AI Capabilities: Multi-agent orchestration, streaming tool execution, latency tracking, and autonomous fallback handling.";
    modifiedUi += " Display an animated live agent execution telemetry visualizer with node status indicators.";
  }

  if (lowerReq.includes("mobile") || lowerReq.includes("responsive")) {
    modifiedContext += "\n- Device Support: Flawless touch gesture support and offline resilience on modern mobile web browsers.";
    modifiedUi += " Ensure sticky mobile bottom action sheet and adaptive drawer navigation.";
  }

  // If user directive wasn't fully matched by keyword heuristics, intelligently blend into both sections
  const formattedDirective = cleanRequest.replace(/^(please\s+|can\s+you\s+|make\s+(it|this)\s+)/i, "").trim();

  if (!hasUiChanges) {
    modifiedUi += ` (Customized styling requirement: ${formattedDirective})`;
  }

  if (!hasContextChanges) {
    modifiedContext += `\n- Customized Project Requirement: ${formattedDirective}`;
  }

  // Re-attach technical parameters if applicable
  const finalUi = parameters ? `${modifiedUi.trim()} ${parameters}` : modifiedUi.trim();
  const finalContext = modifiedContext.trim();

  const combinedCustomized = combineRefinedPrompts(finalUi, finalContext);

  return {
    success: true,
    refinedUiPrompt: finalUi,
    refinedContextPrompt: finalContext,
    customizedPrompt: combinedCustomized,
  };
}
