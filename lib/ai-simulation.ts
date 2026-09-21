/**
 * AI Prompt Customization Simulator
 * Fakes an expert AI rewrite with a realistic 1.8-2.4s delay, keyword synthesis,
 * parameter preservation, and optional error simulation.
 */

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
  const delay = options?.delayMs ?? 1800 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (options?.simulateError) {
    return {
      success: false,
      error: "We couldn't customize this prompt. Please check your connection and try again.",
    };
  }

  const cleanRequest = userRequest.trim();
  if (!cleanRequest) {
    return {
      success: false,
      error: "Please enter instructions for how you'd like to modify the prompt.",
    };
  }

  // Preserve technical parameters at the end (e.g. --ar 4:5 --v 6.1 --style raw)
  const paramRegex = /(--[a-zA-Z0-9_-]+(\s+[a-zA-Z0-9_.:]+)?)+$/;
  const paramMatch = basePrompt.match(paramRegex);
  const parameters = paramMatch ? paramMatch[0] : "";
  const corePrompt = paramMatch
    ? basePrompt.substring(0, paramMatch.index).trim()
    : basePrompt.trim();

  // Keyword extraction and smart transformation
  const lowerReq = cleanRequest.toLowerCase();

  let modifiedCore = corePrompt;

  // Background/surface replacements
  if (lowerReq.includes("dark") || lowerReq.includes("black") || lowerReq.includes("obsidian") || lowerReq.includes("granite")) {
    modifiedCore = modifiedCore.replace(
      /travertine stone pedestal|rough-hewn travertine|limestone pedestal|white surface|cream paper/i,
      "rough-hewn dark polished black obsidian pedestal"
    );
    if (!modifiedCore.toLowerCase().includes("dark") && !modifiedCore.toLowerCase().includes("obsidian")) {
      modifiedCore += ", set against a deep atmospheric obsidian backdrop";
    }
  }

  if (lowerReq.includes("flame") || lowerReq.includes("lit") || lowerReq.includes("smoke") || lowerReq.includes("burning")) {
    modifiedCore = modifiedCore.replace(
      /delicate window shadows/i,
      "delicate window shadows, gently burning warm flickering wick flame with a thin wispy plume of aromatic incense smoke curling upward"
    );
    if (!modifiedCore.toLowerCase().includes("flame") && !modifiedCore.toLowerCase().includes("smoke")) {
      modifiedCore += ", glowing burning wick with delicate wisps of fragrant smoke";
    }
  }

  if (lowerReq.includes("luxury") || lowerReq.includes("cosmetics") || lowerReq.includes("premium")) {
    modifiedCore = modifiedCore.replace(
      /minimalist handmade/i,
      "ultra-luxurious bespoke apothecary"
    );
    modifiedCore += ", high-end luxury cosmetic campaign aesthetic with subtle gold leaf foil accents";
  }

  if (lowerReq.includes("cyberpunk") || lowerReq.includes("neon") || lowerReq.includes("teal") || lowerReq.includes("magenta")) {
    modifiedCore += ", bathed in volumetric neon rim lighting with deep teal and electric magenta reflections";
  }

  if (lowerReq.includes("sunset") || lowerReq.includes("golden hour") || lowerReq.includes("dusk")) {
    modifiedCore = modifiedCore.replace(
      /morning sunlight|morning window light|diffused morning/i,
      "dramatic warm golden hour sunset lighting with long amber cast shadows"
    );
  }

  // If no specific keyword triggered a direct replacement, intelligently blend user's exact phrase
  if (modifiedCore === corePrompt) {
    const formattedDirective = cleanRequest.replace(/^make\s+(it|this)\s+/i, "");
    modifiedCore = `${corePrompt}, customized with ${formattedDirective}, maintaining consistent camera depth and exposure`;
  }

  // Re-attach technical parameters seamlessly
  const finalPrompt = parameters ? `${modifiedCore} ${parameters}` : modifiedCore;

  return {
    success: true,
    customizedPrompt: finalPrompt,
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
