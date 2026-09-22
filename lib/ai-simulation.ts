/**
 * AI Prompt Customization Simulator
 * Fakes an expert AI rewrite with a realistic 1.8-2.4s delay, keyword synthesis,
 * parameter preservation, and optional error simulation.
 */

import { refinePromptsWithAI, splitCombinedPrompt } from "./prompt-utils";

export interface CustomizationResult {
  success: boolean;
  customizedPrompt?: string;
  error?: string;
}

export async function simulateAIPromptRewrite(
  basePrompt: string,
  userRequest: string,
  options?: {
    simulateError?: boolean;
    delayMs?: number;
  }
): Promise<CustomizationResult> {
  const parsed = splitCombinedPrompt(basePrompt);
  const uiPrompt = parsed.uiPrompt || basePrompt;
  const contextPrompt =
    parsed.contextPrompt ||
    "Project Context: Production-ready application adhering to modern design system standards, robust feature specifications, and seamless user experience.";

  const result = await refinePromptsWithAI(uiPrompt, contextPrompt, userRequest, options);

  return {
    success: result.success,
    customizedPrompt: result.customizedPrompt,
    error: result.error,
  };
}

/**
 * Simulates speech-to-text recording and transcription
 */
export async function simulateVoiceTranscription(templateId: string): Promise<string> {
  // Simulate 1.5s audio transcription delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const sampleTranscriptions: Record<string, string[]> = {
    "template-candle-photo": [
      "Make this suitable for a luxury dark cosmetics campaign with a black granite pedestal and gentle smoke from the wick.",
      "Change the lighting to warm twilight with dramatic gold rim light and dried lavender twigs.",
      "Add a lit flame with soft flickering glow and water droplets on the amber glass.",
    ],
    "template-luxury-watch": [
      "Switch the green dial to deep sunburst navy blue and add water droplets on the sapphire crystal.",
      "Change the background from carbon fiber to polished Italian marble with moody spotlighting.",
    ],
    "template-web-saas-dark": [
      "Convert this into a light minimalist aesthetic with soft pastel gradients and a live interactive chat widget.",
      "Add a customer testimonial marquee and an interactive ROI calculator card in the pricing section.",
    ],
    "template-video-drone-mountains": [
      "Make the camera descend into a canyon with stormy twilight lightning in the distance.",
      "Add an autumn color palette with golden orange pine forests and a winding river below.",
    ],
  };

  const pool = sampleTranscriptions[templateId] || [
    "Make this more cinematic with dramatic high-contrast lighting and deeper color saturation.",
    "Adapt this for an upscale commercial product advertisement with premium textures.",
  ];

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
