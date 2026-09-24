import {
  UsageStep,
  GuideStep,
  PresentationWorkflowPrompts,
  SlidePrompt,
  TemplateStep,
  TemplateWorkflow,
} from "./types";
import { normalizeTemplateStep } from "./template-workflow";
import { buildPresentationPromptSteps } from "./presentation-guide-generator";

export type CategoryKey =
  | "image-generation"
  | "video-generation"
  | "website-generation"
  | "slides"
  | "poster-design";

export interface FeatureHighlight {
  label: string;
  sublabel: string;
  iconName: string;
}

export interface DefaultToolConfig {
  toolName: string;
  modelName: string;
  reason: string;
  badge?: string;
}

export interface CategoryWorkflowConfig {
  key: CategoryKey;
  title: string;
  description: string;
  iconName: string;
  featureHighlights: FeatureHighlight[];
  defaultTools: DefaultToolConfig[];
  defaultSteps: UsageStep[];
}

export interface TemplateGuideContext {
  id?: string;
  name?: string;
  promptText?: string;
  style?: string;
  mood?: string;
  difficulty?: string;
  categoryId?: string;
  categoryName?: string;
  category?: string;
  tags?: string[];
  targetAudience?: string;
  objective?: string;
  slideCount?: number;
  presentationPrompts?: PresentationWorkflowPrompts;
  slidePrompts?: SlidePrompt[];
  recommendedTools?: Array<{
    toolName: string;
    modelName?: string;
    reason?: string;
    badge?: string;
  }>;
  workflow?: TemplateWorkflow;
  usageSteps?: UsageStep[];
}

/**
 * Determines the normalized category key for any given template.
 * Prioritizes explicit categoryId and categoryName over slug heuristics
 * to prevent false positives (e.g. pitch deck templates with 'saas' in slug).
 */
export function getTemplateCategoryKey(template: {
  categoryId?: string;
  categoryName?: string;
  category?: string;
  slug?: string;
  tags?: string[];
}): CategoryKey {
  const catId = (template.categoryId || "").toLowerCase().trim();
  const catName = (template.categoryName || "").toLowerCase().trim();
  const rawCat = (template.category || "").toLowerCase().trim();
  const tagsStr = (template.tags || []).join(" ").toLowerCase();

  // 1. Explicit Category ID matches
  if (catId === "cat-image-gen" || catId === "image-gen" || catId === "image-generation") {
    return "image-generation";
  }
  if (catId === "cat-video-gen" || catId === "video-gen" || catId === "video-generation") {
    return "video-generation";
  }
  if (
    catId === "cat-website-making" ||
    catId === "website-making" ||
    catId === "website-generation" ||
    catId === "cat-web"
  ) {
    return "website-generation";
  }
  if (
    catId === "cat-slides-presentations" ||
    catId === "slides-presentations" ||
    catId === "slides" ||
    catId === "presentations"
  ) {
    return "slides";
  }
  if (
    catId === "cat-poster-design" ||
    catId === "poster-design" ||
    catId === "poster" ||
    catId === "design"
  ) {
    return "poster-design";
  }

  // 2. Category Name matches
  if (catName.includes("image")) return "image-generation";
  if (catName.includes("video") || catName.includes("motion") || catName.includes("cinema"))
    return "video-generation";
  if (catName.includes("slide") || catName.includes("presentation") || catName.includes("pitch"))
    return "slides";
  if (catName.includes("poster") || catName.includes("design") || catName.includes("flyer"))
    return "poster-design";
  if (catName.includes("website") || catName.includes("web") || catName.includes("landing"))
    return "website-generation";

  // 3. raw category field matches
  if (rawCat === "image-generation" || rawCat === "image") return "image-generation";
  if (rawCat === "video-generation" || rawCat === "video") return "video-generation";
  if (rawCat === "website-generation" || rawCat === "website" || rawCat === "website-making")
    return "website-generation";
  if (rawCat === "slides" || rawCat === "slides-presentations") return "slides";
  if (rawCat === "poster-design" || rawCat === "poster" || rawCat === "posters-designs")
    return "poster-design";

  // 4. Tags inspection
  if (tagsStr.includes("video") || tagsStr.includes("cinematic") || tagsStr.includes("runway"))
    return "video-generation";
  if (tagsStr.includes("presentation") || tagsStr.includes("slides") || tagsStr.includes("pitch deck"))
    return "slides";
  if (tagsStr.includes("poster") || tagsStr.includes("flyer") || tagsStr.includes("banner"))
    return "poster-design";
  if (tagsStr.includes("website") || tagsStr.includes("landing page") || tagsStr.includes("saas web"))
    return "website-generation";
  if (tagsStr.includes("photo") || tagsStr.includes("portrait") || tagsStr.includes("image"))
    return "image-generation";

  // 5. Fallback based on slug
  const slug = (template.slug || "").toLowerCase();
  if (slug.includes("video") || slug.includes("cinema") || slug.includes("b-roll"))
    return "video-generation";
  if (slug.includes("slide") || slug.includes("deck") || slug.includes("presentation"))
    return "slides";
  if (slug.includes("poster") || slug.includes("flyer") || slug.includes("ad-"))
    return "poster-design";
  if (slug.includes("site") || slug.includes("landing") || slug.includes("page"))
    return "website-generation";

  return "image-generation";
}

/**
 * Normalizes tool name for pattern matching.
 */
function cleanToolName(name: string): string {
  return (name || "").toLowerCase().trim();
}

/**
 * Generates category-specific and tool-specific steps strictly honoring:
 * Category + AI Tool combination.
 */
export function generateCategoryToolSteps(
  category: CategoryKey,
  toolName: string,
  modelName?: string,
  context?: TemplateGuideContext
): UsageStep[] {
  const tool = cleanToolName(toolName);
  const promptExcerpt = context?.promptText ? " the provided prompt" : " the prompt";
  const templateTitle = context?.name || "your asset";
  const effectiveModel = modelName ? ` (${modelName})` : "";

  // =========================================================================
  // 1. IMAGE GENERATION WORKFLOWS
  // =========================================================================
  if (category === "image-generation") {
    // 1A. Midjourney
    if (tool.includes("midjourney")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Image Tool",
          instruction:
            "Open Discord and navigate to the Midjourney Bot or your designated creation channel (or visit midjourney.com if you have web creation access).",
          tip: "Using a dedicated direct message channel with the Midjourney Bot keeps your generation iterations clean and organized.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Image Generation",
          instruction:
            "Type `/imagine` in the chat input bar and select the command to activate the prompt parameter field.",
          tip: "On midjourney.com, click the 'Imagine' search bar located at the top of the interface.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Image Prompt",
          instruction: `Copy${promptExcerpt} from AWA and paste it into the \`/imagine prompt:\` field. The prompt specifies key photographic parameters including subject details, composition, lighting dynamics, and atmospheric depth.`,
          tip: "Keep all technical photographic descriptors (e.g. lens focal length, aperture f-stops, and studio lighting references) intact for optimal realism.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Adjust Available Settings",
          instruction:
            "Verify that Midjourney parameters are appended to your prompt, including the target aspect ratio (`--ar 4:5` or `--ar 16:9`), model version (`--v 6.1`), and `--style raw` for unbiased photographic realism.",
          tip: "You can type `/settings` in Discord at any time to toggle Raw Style and High Quality as your persistent default configuration.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Image",
          instruction:
            "Press Enter or Return to send your prompt to the Midjourney GPU generation queue and generate the initial 4-quadrant image grid.",
          tip: "Fast mode typically renders the initial 4-quadrant preview in 30 to 50 seconds.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Result",
          instruction:
            "Review the 4 generated candidate images (arranged clockwise: top-left 1, top-right 2, bottom-left 3, bottom-right 4). Evaluate subject anatomy, texture sharpness, lighting reflections, and fidelity against the prompt.",
          tip: "Click on the 4-grid image to inspect details at higher resolution before committing to an upscale.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Result",
          instruction:
            "Click V1–V4 to create 4 new variations based on your preferred quadrant, or click 'Vary (Subtle)' / 'Vary (Region)' on an upscaled image to inpaint and refine specific elements.",
          tip: "'Vary (Subtle)' maintains the composition and color harmony while regenerating micro-textures.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Save the Final Image",
          instruction:
            "Click U1–U4 to upscale your chosen variation, then click the image to open it at full resolution, right-click, and select 'Save Image' (or click the Download icon on the web app).",
          tip: "Midjourney upscales export in uncompressed high-resolution format ready for professional design or commercial deployment.",
        },
      ];
    }

    // 1B. ChatGPT / DALL-E
    if (tool.includes("chatgpt") || tool.includes("dall-e") || tool.includes("gpt")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Image Tool",
          instruction:
            "Navigate to chatgpt.com or open the ChatGPT desktop/mobile app and sign in with your account credentials.",
          tip: "Ensure your workspace has active access to the GPT-4o model or the specialized DALL-E image generation interface.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Image Generation",
          instruction:
            "Start a new conversation in ChatGPT and ensure the model selector is set to GPT-4o (or select the dedicated DALL·E GPT from Explore GPTs).",
          tip: "Starting a fresh chat thread prevents conversational context from unintentionally modifying your image aesthetic.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Image Prompt",
          instruction: `Paste${promptExcerpt} from AWA directly into the ChatGPT message box. The prompt describes the core subject, composition, visual style, ambient environment, and lighting mood.`,
          tip: "Prefixing your prompt with 'Generate a photorealistic photograph:' encourages ChatGPT to adhere strictly to realistic rendering without cartoonish exaggeration.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Adjust Available Settings",
          instruction:
            "Specify your desired aspect ratio and styling directly in your instructions (e.g. 'Use wide landscape format 1792x1024' or 'Use portrait 1024x1792 with natural lighting').",
          tip: "DALL-E 3 supports Square (1024x1024), Wide Landscape (1792x1024), and Tall Portrait (1024x1792) resolutions.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Image",
          instruction:
            "Click the Send button or press Enter to trigger the generation workflow. Allow the AI model to synthesize and display the initial result.",
          tip: "Image generation in ChatGPT usually takes 15 to 30 seconds to complete.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Result",
          instruction:
            "Inspect the generated image in the chat. Verify that the subject, lighting, perspective, color balance, and textures match your expectations.",
          tip: "Click on the image to view it full-screen and check for any background inconsistencies or unwanted details.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Result",
          instruction:
            "Use conversational refinement to improve the image. Type specific follow-up instructions (e.g. 'Make the morning sunlight softer' or 'Change the background stone to dark granite') or click the Select tool to edit specific image areas.",
          tip: "Referencing specific regions of the image allows ChatGPT to modify only the targeted elements while preserving the rest of the composition.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Save the Final Image",
          instruction:
            "Click on the final refined image to expand it, then click the Download button in the top-right corner to save the high-resolution PNG file to your computer.",
          tip: "ChatGPT saves full-fidelity uncompressed PNG files directly to your downloads folder.",
        },
      ];
    }

    // 1C. Ideogram
    if (tool.includes("ideogram")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Image Tool",
          instruction:
            "Navigate to ideogram.ai in your browser and sign in to access your creation dashboard.",
          tip: "Ideogram is renowned for exceptional typography and graphic composition rendering.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Image Generation",
          instruction:
            "Click into the prompt input box at the top of the Ideogram workspace to activate the generation controls.",
          tip: "Ensure the model toggle is set to Ideogram 2.0 or the latest available generation model.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Image Prompt",
          instruction: `Copy${promptExcerpt} from AWA into the prompt input field. The prompt covers subject composition, style, environmental lighting, and any integrated typography.`,
          tip: "Place any exact text strings you want rendered inside quotation marks (e.g. 'LUXURY ESSENCE') for crisp typography.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Adjust Available Settings",
          instruction:
            "Configure available settings in the tool bar below the prompt: select the desired aspect ratio (e.g. 10:16, 1:1, or 16:9), choose a Style preset (Realistic, Design, 3D, or Anime), and toggle Magic Prompt as desired.",
          tip: "For photographic templates, select the 'Realistic' style preset for natural lighting and authentic material textures.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Image",
          instruction:
            "Click the 'Generate' button to begin synthesis. Ideogram will generate a set of 4 candidate outputs based on your prompt and settings.",
          tip: "The generation queue typically returns the 4 variations in approximately 20 to 30 seconds.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Result",
          instruction:
            "Review the 4 generated cards. Check text legibility, subject accuracy, shadow positioning, and overall aesthetic alignment with your target benchmark.",
          tip: "Click into each card to inspect fine typographic lines and texture sharpness.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Result",
          instruction:
            "Select your favorite variation and click 'Remix' to adjust prompt weights, refine wording, or modify the style preset without starting from scratch.",
          tip: "You can adjust the Image Weight slider during Remix to stay close to the initial layout or allow greater variation.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Save the Final Image",
          instruction:
            "Select the final winning image and click the Download icon to save the high-resolution file to your device.",
          tip: "Ideogram provides high-resolution downloads ready for both digital publishing and print layouts.",
        },
      ];
    }

    // 1D. Flux / Stable Diffusion
    if (tool.includes("flux") || tool.includes("stable diffusion") || tool.includes("sdxl")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Image Tool",
          instruction: `Open ${toolName}${effectiveModel} via your preferred generation platform, web UI, or cloud workspace.`,
          tip: "Ensure your generation workspace has access to the appropriate Flux or Stable Diffusion model checkpoint.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Image Generation",
          instruction:
            "Navigate to the Text-to-Image creation interface to open the prompt canvas and generation settings.",
          tip: "Clear any leftover positive or negative prompts from previous sessions before starting.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Image Prompt",
          instruction: `Enter${promptExcerpt} from AWA into the positive prompt box. The prompt defines subject characteristics, camera perspective, lighting, color mood, and textural quality.`,
          tip: "Flux excels at natural language understanding—keep descriptions concise and focused on tangible visual properties.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Adjust Available Settings",
          instruction:
            "Set the generation parameters: configure the aspect ratio (or exact pixel dimensions such as 1024x1024 or 1280x720), inference steps (20–30 steps), and guidance scale (typically 3.5–7.0 depending on the model).",
          tip: "Using recommended step counts ensures maximum detail convergence without introducing over-sharpening artifacts.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Image",
          instruction:
            "Click 'Generate' to run the diffusion process and produce the initial high-fidelity rendering.",
          tip: "Rendering time varies based on step count and GPU allocation, typically taking 10 to 30 seconds.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Result",
          instruction:
            "Examine the output image carefully. Verify subject proportions, fine micro-details, lighting highlights, and compositional balance against the prompt intent.",
          tip: "Zoom in to check critical regions such as object edges, reflections, and material finishes.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Result",
          instruction:
            "Refine the image by adjusting prompt tokens, tweaking guidance scale, or using inpainting/image-to-image to adjust specific regions while locking the random seed.",
          tip: "Locking the seed allows you to iterate on subtle prompt adjustments while preserving the core composition.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Save the Final Image",
          instruction:
            "Click the Save or Download button to export the final uncompressed image file (PNG) to your local storage.",
          tip: "Keep the generation metadata and seed recorded if you need to reproduce or batch-expand this visual later.",
        },
      ];
    }

    // 1E. Generic Image Tool Fallback
    return [
      {
        stepNumber: 1,
        title: "Step 01 — Open the AI Image Tool",
        instruction: `Open ${toolName}${effectiveModel} in your browser or application workspace.`,
        tip: "Log in and verify you have sufficient generation credits or access for high-resolution image rendering.",
      },
      {
        stepNumber: 2,
        title: "Step 02 — Start Image Generation",
        instruction:
          "Navigate to the image creation or text-to-image workflow within the tool's interface.",
        tip: "Locate the main text prompt field where image prompts are accepted.",
      },
      {
        stepNumber: 3,
        title: "Step 03 — Enter the Image Prompt",
        instruction: `Copy${promptExcerpt} from AWA and enter it into the tool's prompt field. The prompt covers subject, composition, style, environment, lighting, and mood.`,
        tip: "Avoid editing out technical lighting tags or atmosphere keywords, as they directly dictate the final aesthetic quality.",
      },
      {
        stepNumber: 4,
        title: "Step 04 — Adjust Available Settings",
        instruction:
          "Configure any relevant settings provided by the tool, such as aspect ratio (e.g. 16:9, 4:5, or 1:1), output resolution, style preset, or model version.",
        tip: "Only configure parameters supported by this specific tool; default settings can be used if advanced options are unavailable.",
      },
      {
        stepNumber: 5,
        title: "Step 05 — Generate the Image",
        instruction:
          "Click the Generate or Create button to render the initial image output.",
        tip: "Wait for the synthesis to complete before attempting further prompt modifications.",
      },
      {
        stepNumber: 6,
        title: "Step 06 — Review the Result",
        instruction:
          "Check whether the generated image matches the prompt's subject, lighting, composition, and visual tone.",
        tip: "Identify any elements that need enhancement, re-coloring, or repositioning.",
      },
      {
        stepNumber: 7,
        title: "Step 07 — Refine the Result",
        instruction:
          "Refine the result by modifying specific prompt details, generating alternative variations, or using the tool's editing/inpainting features.",
        tip: "Incremental prompt adjustments produce more predictable improvements than completely rewriting the prompt.",
      },
      {
        stepNumber: 8,
        title: "Step 08 — Save the Final Image",
        instruction:
          "Download or save the final approved image in full resolution using the tool's export option.",
        tip: "Save your asset in PNG format when available to preserve maximum visual clarity.",
      },
    ];
  }

  // =========================================================================
  // 2. VIDEO GENERATION WORKFLOWS
  // =========================================================================
  if (category === "video-generation") {
    const isStartEndFrame =
      (context?.tags || []).some(
        (t) =>
          t.toLowerCase().includes("start-end") ||
          t.toLowerCase().includes("keyframe") ||
          t.toLowerCase().includes("interpolation")
      ) ||
      (context?.name || "").toLowerCase().includes("start and end") ||
      (context?.promptText || "").toLowerCase().includes("end frame");

    const isImageToVideo =
      (context?.tags || []).some(
        (t) =>
          t.toLowerCase().includes("image-to-video") ||
          t.toLowerCase().includes("i2v") ||
          t.toLowerCase().includes("reference")
      ) ||
      (context?.name || "").toLowerCase().includes("image-to-video") ||
      (context?.promptText || "").toLowerCase().includes("initial frame") ||
      (context?.promptText || "").toLowerCase().includes("start frame");

    // 2A-1. Start/End Frame Keyframe Interpolation Workflow (8 steps)
    if (isStartEndFrame) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Video Tool",
          instruction: `Open ${toolName}${effectiveModel} and navigate to the keyframe interpolation workspace.`,
          tip: "Confirm your workspace supports multi-frame transition and optical flow interpolation.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Add Start Frame",
          instruction: "Upload or assign the initial reference keyframe image to establish the starting state.",
          tip: "The opening keyframe anchors subject position, lighting temperature, and camera view.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Add End Frame",
          instruction: "Upload your target final keyframe image to define the concluding composition.",
          tip: "Ensure both keyframes share identical aspect ratios for seamless continuity.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Define Transition",
          instruction: `Enter${promptExcerpt} from AWA to direct the camera trajectory and physical evolution between both frames.`,
          tip: "Clarify whether the interpolation is a morph, continuous pan, zoom, or camera roll.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Configure Video Settings",
          instruction: "Set transition duration (e.g. 5s or 10s), motion pacing, and output resolution.",
          tip: "A 5-second duration provides balanced optical flow without sudden warping.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Generate the Video",
          instruction: "Click Generate to synthesize the intermediate temporal frames connecting start and end states.",
          tip: "The AI diffusion model computes smooth motion vectors between the two keyframe anchors.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Review Motion",
          instruction: "Play back the sequence and scrub the timeline midpoint to verify natural kinematic progression.",
          tip: "Check that subject anatomy and background elements transition smoothly without temporal stutter.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Video",
          instruction: "Download and export the completed interpolation sequence in full 1080p MP4 resolution.",
          tip: "The resulting video forms a seamless transition or perfectly looping visual asset.",
        },
      ];
    }

    // 2A-2. Image-to-Video Workflow (9 steps)
    if (isImageToVideo) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Video Tool",
          instruction: `Open ${toolName}${effectiveModel} and navigate to your video generation workspace.`,
          tip: "Confirm that your account has active rendering credits for video generation.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Select Image-to-Video",
          instruction:
            "Select the Image-to-Video creation workflow in the tool's interface to enable reference frame input.",
          tip: "This mode locks the initial frame composition and uses AI to simulate motion from that visual anchor.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Upload or Use Provided Image",
          instruction:
            "Upload the reference initial frame image provided in the AWA template into the tool's image slot.",
          tip: "Ensure the uploaded reference image is sharp and matches the intended video aspect ratio to avoid distortion.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Enter the Motion Prompt",
          instruction: `Copy${promptExcerpt} from AWA and enter it into the motion prompt field. Focus the prompt on subject movement, camera dynamics, and environmental shifts.`,
          tip: "Describe how elements should move relative to the frame rather than re-describing what is already visible in the image.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Configure Video Settings",
          instruction:
            "Configure video parameters: select duration (e.g. 5s or 10s), motion scale/intensity, aspect ratio, and camera direction controls if supported.",
          tip: "A moderate motion scale (around 4–6 out of 10) produces fluid, cinematic results without warping artifacts.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Generate the Video",
          instruction:
            "Click Generate to start the video rendering process and let the AI compute temporal frame consistency.",
          tip: "Video rendering typically takes between 1 and 3 minutes depending on server queue and clip duration.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Review the Motion",
          instruction:
            "Play back the generated video clip. Check subject movement fluidity, camera stability, scene consistency across frames, and verify there are no unwanted morphing artifacts.",
          tip: "Watch the video loop multiple times at normal speed and scrub frame-by-frame through fast transitions.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Refine",
          instruction:
            "Refine the video by adjusting motion intensity, tweaking camera movement keywords, or using tool-specific features such as motion brush or camera control.",
          tip: "If the subject drifts unnaturally, reduce motion scale or add explicit camera trajectory keywords (e.g. 'steady slow pan right').",
        },
        {
          stepNumber: 9,
          title: "Step 09 — Export the Video",
          instruction:
            "Export and download the final video file in full resolution (1080p or 4K MP4) using the tool's download option.",
          tip: "Store the downloaded MP4 master file for your video editing timeline, social post, or campaign.",
        },
      ];
    }

    // 2B. Text-to-Video Workflow (8 steps) — Tool-Tailored
    // Runway
    if (tool.includes("runway")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Video Tool",
          instruction:
            "Open Runway (runwayml.com) in your browser and log into your dashboard.",
          tip: "Runway Gen-3 Alpha provides state-of-the-art camera fidelity and temporal motion control.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Video",
          instruction:
            "Select 'Gen-3 Alpha' or 'Gen-2' from the dashboard and choose the Text to Video creation mode.",
          tip: "Make sure your creation workspace is set to Text mode rather than Image mode.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Video Prompt",
          instruction: `Copy${promptExcerpt} from AWA into the Runway prompt input box. The prompt describes scene environment, subject action, camera movement, motion pacing, and cinematic style.`,
          tip: "Structure your prompt with camera movement first (e.g. 'FPV drone sweep...'), followed by subject action, environment, and lighting.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Configure Video Settings",
          instruction:
            "Configure your video settings: set clip duration (5s or 10s), select aspect ratio (16:9 for landscape or 9:16 for vertical reels), and adjust Camera Control settings.",
          tip: "Use the Camera Control panel to lock in precise Pan, Tilt, Zoom, or Roll movements for predictable cinematography.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Video",
          instruction:
            "Click the 'Generate' button to send the request to Runway's video rendering cluster.",
          tip: "Generation usually takes 60 to 90 seconds for a 5-second Gen-3 clip.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Motion",
          instruction:
            "Review the generated video playback. Check subject kinetics, camera trajectory smoothness, lighting consistency across frames, and ensure there are no temporal distortions.",
          tip: "Inspect edges and background elements for any unnatural morphing or texture swimming.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine",
          instruction:
            "Refine the clip by modifying motion prompt descriptors, adjusting the camera motion speed slider, or using Runway's '+5s' Extend tool to continue the camera flight.",
          tip: "Extending the video maintains the visual world and actor consistency seamlessly into the next segment.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Video",
          instruction:
            "Click the Download button in the top right of the video player to export the final high-definition MP4 clip.",
          tip: "Runway exports uncompressed 1080p MP4 files ready for timeline editing in Premiere, DaVinci, or Final Cut.",
        },
      ];
    }

    // Kling
    if (tool.includes("kling")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Video Tool",
          instruction:
            "Navigate to klingai.com and sign into your Kling AI creation account.",
          tip: "Kling AI is recognized for high physical simulation realism and expressive human motion.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Video",
          instruction:
            "Navigate to the AI Video section and select the 'Text to Video' creation tab.",
          tip: "Ensure the creation mode is set to 'Professional' if you have access, or 'Standard' for faster rendering.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Video Prompt",
          instruction: `Paste${promptExcerpt} from AWA into Kling's prompt field. The prompt outlines scene composition, subject dynamics, camera motion trajectory, and atmospheric lighting.`,
          tip: "Include camera direction tags (e.g. 'cinematic dolly forward, slow motion, shallow depth of field') to guide the lens path.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Configure Video Settings",
          instruction:
            "Configure available video parameters: choose duration (5s or 10s), select aspect ratio (16:9, 9:16, or 1:1), and set Camera Movement parameters if needed.",
          tip: "Selecting Professional mode enhances frame fidelity and temporal adherence to prompt details.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Video",
          instruction:
            "Click the 'Generate' button to begin video synthesis in the Kling rendering engine.",
          tip: "Generation times typically range from 2 to 5 minutes depending on queue load and quality mode.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Motion",
          instruction:
            "Play back the rendered video. Inspect subject physics, facial/object consistency, fluid camera transitions, and visual clarity throughout the clip.",
          tip: "Check that subject movements adhere to natural physical weight and momentum.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine",
          instruction:
            "Fine-tune the output by adjusting motion relevance sliders, revising camera keywords, or adding negative prompt tokens to eliminate unwanted artifacts.",
          tip: "Adding negative prompts like 'jitter, blurry, distorted anatomy, morphing' helps clean up fast-moving shots.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Video",
          instruction:
            "Hover over the completed video card and click the Download icon to save the high-resolution MP4 video.",
          tip: "Kling exports crisp 1080p MP4 files ready for direct publishing or post-production.",
        },
      ];
    }

    // Veo
    if (tool.includes("veo")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open Google Veo",
          instruction:
            "Open Google DeepMind Veo via VideoFX or your authorized Google Cloud video studio workspace.",
          tip: "Veo excels at cinematic photorealism, accurate lighting physics, and complex motion prompts.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Video Generation",
          instruction:
            "Select the high-definition video generation canvas and ensure your prompt mode is active.",
          tip: "Veo produces native 1080p video with consistent spatial physics.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter Video Prompt",
          instruction: `Enter${promptExcerpt} from AWA into Veo's prompt input bar. Detail visual style, lens focal length, camera movement, and lighting.`,
          tip: "Veo accurately respects cinematic directives such as 'anamorphic lens, shallow depth of field, 24fps film grain'.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Configure Settings",
          instruction:
            "Configure video parameters: select duration (5s or 10s), aspect ratio (16:9 widescreen or 9:16 vertical), and cinematic visual tone.",
          tip: "Widescreen 16:9 provides expansive cinematic framing for landscape and narrative shots.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate Video",
          instruction:
            "Click Generate to initiate the Veo generative diffusion process and render temporal video frames.",
          tip: "Veo calculates temporal coherence across lighting, reflections, and subject kinematics.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review Motion",
          instruction:
            "Examine playback to evaluate motion realism, camera fluidity, and scene coherence from beginning to end.",
          tip: "Check foreground and background parallax to confirm depth authenticity.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine",
          instruction:
            "Refine the video with targeted prompt modifiers or camera direction keywords to hone the final aesthetic.",
          tip: "Fine-tuning lighting temperature or atmosphere tokens can dramatically elevate visual fidelity.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export Video",
          instruction:
            "Export and download the final high-definition MP4 video clip in full 1080p resolution.",
          tip: "Veo exports clean uncompressed video ready for production workflows and client presentations.",
        },
      ];
    }

    // Luma Dream Machine
    if (tool.includes("luma")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open Luma Dream Machine",
          instruction:
            "Navigate to lumalabs.ai/dream-machine and sign into your Luma creation account.",
          tip: "Luma Dream Machine provides fast, high-quality cinematic video with realistic physical momentum.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start Video Generation",
          instruction:
            "Click into the prompt bar on the Dream Machine interface to start a new video creation session.",
          tip: "Ensure your account has generation credits available for high-speed rendering.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter Video Prompt",
          instruction: `Paste${promptExcerpt} from AWA into Luma's generation bar. Detail the action, camera trajectory, and atmosphere.`,
          tip: "Specify camera movement early in the prompt (e.g. 'cinematic orbiting shot, smooth dolly push') for maximum impact.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Configure Settings",
          instruction:
            "Set aspect ratio (16:9, 9:16, or 1:1) and configure camera motion keyframing if desired.",
          tip: "Dream Machine maintains high frame rates and natural physical momentum.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate Video",
          instruction:
            "Click the arrow or press Enter to submit your generation request to Luma's render engine.",
          tip: "Generation typically completes within 60 to 120 seconds.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review Motion",
          instruction:
            "Play the clip to inspect camera trajectory, subject kinetics, and temporal smoothness.",
          tip: "Look for realistic weight, lighting reflections, and absence of visual morphing.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine",
          instruction:
            "Use Luma's 'Extend' feature to continue the camera flight or adjust the prompt and regenerate for alternative motion paths.",
          tip: "Extending allows you to seamlessly lengthen your scene while preserving subject consistency.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export Video",
          instruction:
            "Click the Download button to export the high-definition MP4 video clip to your computer.",
          tip: "Luma exports high-bitrate MP4 files ready for editing timelines or social delivery.",
        },
      ];
    }

    // Generic Video Tool Fallback
    return [
      {
        stepNumber: 1,
        title: "Step 01 — Open the AI Video Tool",
        instruction: `Open ${toolName}${effectiveModel} in your web browser or video production platform.`,
        tip: "Confirm that your account is logged in and ready for AI video generation.",
      },
      {
        stepNumber: 2,
        title: "Step 02 — Start a New Video",
        instruction:
          "Navigate to the new video creation interface and select the text-to-video workflow.",
        tip: "Locate the primary video prompt bar and generation control settings.",
      },
      {
        stepNumber: 3,
        title: "Step 03 — Enter the Video Prompt",
        instruction: `Copy${promptExcerpt} from AWA and enter it into the video prompt field. The prompt describes the scene environment, subject action, camera movement, motion pacing, and visual style.`,
        tip: "Ensure camera movements (e.g. pan, tilt, zoom, tracking shot) are explicitly stated to steer visual dynamics.",
      },
      {
        stepNumber: 4,
        title: "Step 04 — Configure Video Settings",
        instruction:
          "Configure video settings: set duration (e.g. 5s or 10s), select aspect ratio (16:9 widescreen or 9:16 vertical), resolution, and model version.",
        tip: "Choose the aspect ratio matching your intended delivery platform (e.g. 9:16 for Reels/TikTok, 16:9 for YouTube).",
      },
      {
        stepNumber: 5,
        title: "Step 05 — Generate the Video",
        instruction:
          "Click Generate to submit the prompt and allow the AI video model to render the sequence.",
        tip: "Wait for rendering to finish without refreshing the browser tab.",
      },
      {
        stepNumber: 6,
        title: "Step 06 — Review the Motion",
        instruction:
          "Examine the generated video playback. Check subject movement realism, camera movement stability, scene consistency across frames, and check for unwanted visual artifacts.",
        tip: "Evaluate whether the motion speed matches your intended pacing.",
      },
      {
        stepNumber: 7,
        title: "Step 07 — Refine",
        instruction:
          "Modify the prompt or use available refinement features (such as adjusting motion intensity, extending clip duration, or tweaking camera keywords) to improve the result.",
        tip: "Refining camera speed or lighting descriptors can dramatically improve motion clarity.",
      },
      {
        stepNumber: 8,
        title: "Step 08 — Export the Video",
        instruction:
          "Download and export the final video in high quality (MP4) using the tool's export option.",
        tip: "Save the exported MP4 master video to your local project directory.",
      },
    ];
  }

  // =========================================================================
  // 3. WEBSITE GENERATION WORKFLOWS
  // =========================================================================
  if (category === "website-generation") {
    // 3A. Lovable
    if (tool.includes("lovable")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Website Builder",
          instruction:
            "Open Lovable (lovable.dev) in your browser and sign into your creator account.",
          tip: "Lovable is designed for full-stack React and Tailwind web application development with live code editing.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Project",
          instruction:
            "Click 'New Project' from the dashboard to initialize a clean web workspace with a live preview container.",
          tip: "Starting from an empty project gives the AI full freedom to scaffold optimal architectural components.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Website Prompt",
          instruction: `Paste${promptExcerpt} from AWA into the Lovable generation input box. The prompt specifies website purpose, target audience, layout sections, interactive components, styling theme, and technical stack requirements.`,
          tip: "Lovable reads comprehensive system prompts effectively—keep all specifications for header, hero, features, and footer intact.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Generate the Website",
          instruction:
            "Submit the prompt and allow Lovable to scaffold the initial multi-component website, package dependencies, and render the interactive preview.",
          tip: "Lovable will generate clean React code with Tailwind CSS and Shadcn UI components automatically.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Review the Generated Website",
          instruction:
            "Inspect the live interactive preview. Review overall layout balance, header navigation, hero section impact, feature card grids, typography hierarchy, and color contrast.",
          tip: "Toggle between the desktop and mobile viewport controls to verify responsive layout adaptation.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Refine the Website",
          instruction:
            "Use Lovable's chat interface to iterate on the design. Submit targeted follow-up prompts to refine copy, adjust spacing, customize color hex codes, or add micro-animations.",
          tip: "You can click directly on preview elements to give Lovable context-specific edit instructions.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Test the Website",
          instruction:
            "Test interactive features in the preview: click navigation links, test responsive drawer menus, verify button hover states, and test form inputs or interactive toggles.",
          tip: "Confirm that all CTAs and interactive widgets respond smoothly without layout shift.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Publish or Export",
          instruction:
            "Click the 'Publish' button to deploy your live website instantly to a Lovable sub-domain, or connect to GitHub to export the full source repository.",
          tip: "Connecting to GitHub allows seamless continuous deployment to Vercel, Netlify, or your custom production domain.",
        },
      ];
    }

    // 3B. Bolt
    if (tool.includes("bolt")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Website Builder",
          instruction:
            "Navigate to bolt.new in your web browser and sign in with your GitHub or email account.",
          tip: "Bolt executes full-stack Node.js environments directly inside WebContainers in your browser.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Project",
          instruction:
            "Click the prompt box on the Bolt home screen to start a new web project workspace.",
          tip: "Bolt will automatically configure Vite, React, and Tailwind CSS for rapid prototyping.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Website Prompt",
          instruction: `Paste${promptExcerpt} from AWA into Bolt's prompt input bar. The prompt defines site architecture, navigation structure, hero layout, feature components, styling, and interactivity.`,
          tip: "Include any desired UI libraries like Lucide icons or Framer Motion directly in your prompt text.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Generate the Website",
          instruction:
            "Press Enter to initiate code generation. Bolt will create project files, install npm packages, and boot the live development server in the preview pane.",
          tip: "Watch the terminal output in Bolt to see packages and build steps completing in real time.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Review the Generated Website",
          instruction:
            "Review the rendered website in the preview panel. Check section structure, typography, button styling, visual hierarchy, and overall visual polish.",
          tip: "Inspect the file tree on the left to verify modular component organization.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Refine the Website",
          instruction:
            "Submit follow-up prompts in the chat panel to adjust layout elements, update placeholder content, or refine styling.",
          tip: "Bolt can also edit code files directly in the built-in code editor if you prefer manual tweaks.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Test the Website",
          instruction:
            "Test responsive behavior by resizing the preview window, check mobile navigation, test interactive states, and ensure no console errors occur.",
          tip: "Open the built-in browser developer tools inside Bolt to verify clean console logs.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Publish or Export",
          instruction:
            "Click 'Deploy' to publish your project live with one click (via Netlify), or click 'Download' / 'Push to GitHub' to export the complete repository.",
          tip: "The downloaded zip contains standard production-ready Vite and React source code.",
        },
      ];
    }

    // 3C. v0 by Vercel
    if (tool.includes("v0")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Website Builder",
          instruction:
            "Navigate to v0.dev and sign in using your Vercel account credentials.",
          tip: "v0 specializes in generating accessible, modern React components using Tailwind CSS and Shadcn UI.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Project",
          instruction:
            "Click into the prompt input bar on the v0 home screen to start a new generative UI session.",
          tip: "Ensure your session is set to generate full-page layouts rather than isolated micro-components.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Enter the Website Prompt",
          instruction: `Enter${promptExcerpt} from AWA into the v0 prompt box. The prompt describes the page purpose, hero section, navigation bar, feature grids, dark mode aesthetic, and UI components.`,
          tip: "Mentioning specific design tokens like 'Tailwind CSS, Lucide icons, glassmorphism card borders' helps v0 nail the aesthetic on the first pass.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Generate the Website",
          instruction:
            "Submit the prompt and allow v0 to synthesize the React JSX code, style classes, and render the interactive preview.",
          tip: "v0 generates multiple design iterations you can toggle between at the bottom of the canvas.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Review the Generated Website",
          instruction:
            "Examine the rendered live preview. Review the layout balance, check typography hierarchy, card alignments, and switch between Desktop and Mobile preview tabs.",
          tip: "Toggle the Code view tab at any time to inspect the underlying React components and Tailwind utility classes.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Refine the Website",
          instruction:
            "Use the 'Select & Edit' tool to click specific UI sections in the preview, then type targeted revision instructions into the chat to adjust copy, colors, or layout.",
          tip: "Targeted component revisions update only the selected section without rewriting the entire page.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Test the Website",
          instruction:
            "Test interactive features in the interactive preview mode: test accordion menus, mobile drawer menus, interactive buttons, and hover transitions.",
          tip: "Verify responsive responsiveness across phone, tablet, and desktop breakpoints.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Publish or Export",
          instruction:
            "Copy the code directly, deploy to Vercel with one click, or use the `npx v0 add` command to integrate the components directly into your local Next.js project.",
          tip: "`npx v0 add` automatically installs required dependencies and copies clean TypeScript files into your project components directory.",
        },
      ];
    }

    // 3D. Generic Website Builder
    return [
      {
        stepNumber: 1,
        title: "Step 01 — Open the AI Website Builder",
        instruction: `Open ${toolName}${effectiveModel} in your web browser or development environment.`,
        tip: "Sign into your account and ensure your project workspace is active.",
      },
      {
        stepNumber: 2,
        title: "Step 02 — Start a New Project",
        instruction:
          "Create a new website or web application project within the builder's workspace.",
        tip: "Choose an empty or modern template starter that aligns with your tech stack.",
      },
      {
        stepNumber: 3,
        title: "Step 03 — Enter the Website Prompt",
        instruction: `Copy${promptExcerpt} from AWA and enter it into the tool's prompt input bar. The prompt describes the site purpose, target audience, layout sections, design theme, components, and interactive requirements.`,
        tip: "Keep structural and styling requirements clear so the builder scaffolds complete pages.",
      },
      {
        stepNumber: 4,
        title: "Step 04 — Generate the Website",
        instruction:
          "Allow the AI website builder to generate the initial site structure, component code, styling, and preview.",
        tip: "Wait for initial code compilation and preview rendering to finish.",
      },
      {
        stepNumber: 5,
        title: "Step 05 — Review the Generated Website",
        instruction:
          "Review the generated website in the live preview. Check page layout, navigation structure, typography hierarchy, component alignment, and visual aesthetics.",
        tip: "Switch viewports to check both mobile and desktop screen presentation.",
      },
      {
        stepNumber: 6,
        title: "Step 06 — Refine the Website",
        instruction:
          "Use follow-up prompts to refine styling, adjust component layouts, update copy, or add requested functionality.",
        tip: "Focus follow-up requests on one section at a time for optimal precision.",
      },
      {
        stepNumber: 7,
        title: "Step 07 — Test the Website",
        instruction:
          "Test site functionality: check links, test button clicks, verify form inputs, and ensure responsive behavior works properly across all screen sizes.",
        tip: "Test on actual mobile viewport dimensions to confirm touch target usability.",
      },
      {
        stepNumber: 8,
        title: "Step 08 — Publish or Export",
        instruction:
          "Use the tool's available publish or export option to deploy the website live or download the clean source code.",
        tip: "Connect your custom domain or export to your preferred hosting provider.",
      },
    ];
  }

  // =========================================================================
  // 4. SLIDES & PRESENTATIONS WORKFLOWS
  // =========================================================================
  // Slides category is an ACTUAL PROMPT-GENERATION WORKFLOW:
  // Prompt 01 Presentation Strategy
  // Prompt 02 Presentation Structure
  // Prompt 03 Individual Slide Planning
  // Prompt 04 Slide Content Generation
  // Prompt 05 Visual Direction
  // Prompt 06 Slide-by-Slide Generation
  // Prompt 07 Data / Charts / Visuals
  // Prompt 08 Consistency & Refinement
  // Prompt 09 Final Presentation Review
  if (category === "slides") {
    return buildPresentationPromptSteps(context, toolName, effectiveModel);
  }

  // =========================================================================
  // 5. POSTERS & DESIGNS WORKFLOWS
  // =========================================================================
  if (category === "poster-design") {
    // 5A. Canva
    if (tool.includes("canva")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Design Tool",
          instruction:
            "Open canva.com in your web browser and sign into your account.",
          tip: "Canva offers versatile graphic templates, vector graphics, and AI Magic Design tools.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Design",
          instruction:
            "Click 'Create a design' from the top right of the dashboard and search for your required format (e.g. Poster, Flyer, or Social Media Post).",
          tip: "Selecting a preset format sets up standard bleed margins and optimal canvas resolution.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Select the Design Format",
          instruction:
            "Choose your required format or set custom dimensions (e.g. Portrait Poster 18x24 in, A3/A4 for print, or 1080x1350 for social feeds).",
          tip: "For print posters, ensure the dimensions are set in inches or millimeters at high DPI.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Enter the Design Prompt",
          instruction: `Paste${promptExcerpt} from AWA into Canva Magic Design or use it to guide your visual assembly. The prompt details the core headline message, visual style, typography, color palette, composition, and CTA.`,
          tip: "Include color mood and stylistic adjectives (e.g. 'Swiss typography, brutalist grid, neon accents') for targeted results.",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Design",
          instruction:
            "Generate the initial design layout with typographic hierarchy, graphic elements, and background treatment.",
          tip: "Browse the generated design variations to select the strongest compositional foundation.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Design",
          instruction:
            "Inspect the design canvas. Check layout balance, typography legibility, contrast against the background, visual hierarchy, and brand presence.",
          tip: "Zoom out to 50% to verify that the headline is instantly readable at a glance.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Design",
          instruction:
            "Refine the design: adjust font kerning and tracking, fine-tune element alignments, swap graphic stickers or background textures, and calibrate color accents.",
          tip: "Use Canva's 'Tidy up' and alignment guides to ensure strict grid precision.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Final Design",
          instruction:
            "Click 'Share' > 'Download' and export in high-resolution PNG (for digital) or PDF Print with crop marks and bleeds (for commercial printing).",
          tip: "Choose CMYK color profile during PDF Print export when preparing files for physical press printing.",
        },
      ];
    }

    // 5B. Adobe Express
    if (tool.includes("adobe") || tool.includes("express") || tool.includes("firefly")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Design Tool",
          instruction:
            "Navigate to new.express.adobe.com and sign in with your Adobe ID.",
          tip: "Adobe Express combines Adobe Firefly generative AI with professional typography and Adobe Fonts.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Design",
          instruction:
            "Click 'Start from scratch' or select 'Generative AI' > 'Text to Template' on the home dashboard.",
          tip: "Text to Template automatically creates layered, fully editable graphic designs based on your prompt.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Select the Design Format",
          instruction:
            "Select your target canvas size from presets (e.g. Poster, Flyer, Instagram Story, or Custom Dimensions at 300 DPI).",
          tip: "Standard poster presets automatically configure standard print margins.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Enter the Design Prompt",
          instruction: `Enter${promptExcerpt} from AWA into the prompt input field. The prompt covers the headline copy, typography style, color scheme, visual composition, and graphic accents.`,
          tip: "Adobe Express excels at pairing fonts with imagery—mention desired font mood (e.g. 'bold sans-serif', 'editorial serif').",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Design",
          instruction:
            "Click 'Generate' to create layered design variations featuring background art, editable text layers, and layout styling.",
          tip: "Browse through the generated variations to select the strongest visual layout.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Design",
          instruction:
            "Review the generated poster on the canvas. Check headline emphasis, readability of secondary copy, visual contrast, and aesthetic harmony.",
          tip: "Verify that text elements are cleanly separated into editable layers.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Design",
          instruction:
            "Refine the design: double-click text to adjust copy, browse Adobe Fonts to customize typography, adjust layer effects, and use Firefly generative fill for custom accents.",
          tip: "Adjust letter spacing and line height in the text panel for maximum editorial impact.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Final Design",
          instruction:
            "Click 'Download' in the top right and export as high-resolution PNG, JPG, or PDF (print-ready) for publication or commercial printing.",
          tip: "Select PDF format for vector text preservation and maximum print sharpness.",
        },
      ];
    }

    // 5C. Ideogram (for posters/graphic design with text)
    if (tool.includes("ideogram")) {
      return [
        {
          stepNumber: 1,
          title: "Step 01 — Open the AI Design Tool",
          instruction:
            "Open ideogram.ai in your browser and sign into your account.",
          tip: "Ideogram is specialized in rendering crisp, coherent typographic posters and graphic designs.",
        },
        {
          stepNumber: 2,
          title: "Step 02 — Start a New Design",
          instruction:
            "Click into the prompt creation bar at the top of the Ideogram workspace.",
          tip: "Ensure Ideogram 2.0 or Design mode is selected for graphic poster layouts.",
        },
        {
          stepNumber: 3,
          title: "Step 03 — Select the Design Format",
          instruction:
            "Select the aspect ratio matching your poster or design format (e.g. 10:16 for vertical posters, 1:1 for album art/social, or 16:9 for banners).",
          tip: "The 10:16 aspect ratio matches standard vertical poster and flyer proportions.",
        },
        {
          stepNumber: 4,
          title: "Step 04 — Enter the Design Prompt",
          instruction: `Paste${promptExcerpt} from AWA into the prompt field. Keep text strings inside quotes (e.g. 'FESTIVAL 2026') and describe visual style, colors, composition, and layout geometry.`,
          tip: "Specify typography placement (e.g. 'bold title at the top, event details at the bottom in clean grid').",
        },
        {
          stepNumber: 5,
          title: "Step 05 — Generate the Design",
          instruction:
            "Select the 'Design' or 'Typography' style preset and click 'Generate' to synthesize 4 initial poster variations.",
          tip: "Ideogram will integrate the headline text directly into the graphic artwork.",
        },
        {
          stepNumber: 6,
          title: "Step 06 — Review the Design",
          instruction:
            "Inspect the 4 generated poster designs. Check text spelling accuracy, typographic hierarchy, visual contrast, colors, and overall graphic punch.",
          tip: "Verify that the text is sharp and legible against the background art.",
        },
        {
          stepNumber: 7,
          title: "Step 07 — Refine the Design",
          instruction:
            "Select your favorite poster variation and click 'Remix' to refine prompt text, tweak typographic styling, or adjust color saturation.",
          tip: "Use the Magic Prompt feature to explore refined stylistic variations.",
        },
        {
          stepNumber: 8,
          title: "Step 08 — Export the Final Design",
          instruction:
            "Select the winning poster and click the Download icon to save the uncompressed high-resolution file to your device.",
          tip: "Ideogram exports clean high-resolution artwork suitable for digital showcases or print scaling.",
        },
      ];
    }

    // 5D. Generic Design Tool Fallback
    return [
      {
        stepNumber: 1,
        title: "Step 01 — Open the AI Design Tool",
        instruction: `Open ${toolName}${effectiveModel} in your web browser or design suite.`,
        tip: "Sign into your account and ensure your design canvas is ready.",
      },
      {
        stepNumber: 2,
        title: "Step 02 — Start a New Design",
        instruction:
          "Choose the design or poster creation workflow to initialize a fresh graphic project.",
        tip: "Select a blank canvas or AI prompt generator depending on the tool's interface.",
      },
      {
        stepNumber: 3,
        title: "Step 03 — Select the Design Format",
        instruction:
          "Choose the required format or dimensions (e.g. Poster, Flyer, Social Media Post, Story, or Banner).",
        tip: "Setting correct canvas dimensions at the start ensures proper composition scaling.",
      },
      {
        stepNumber: 4,
        title: "Step 04 — Enter the Design Prompt",
        instruction: `Copy${promptExcerpt} from AWA into the tool's prompt field. The prompt defines the main message, visual style, typography, color palette, composition, imagery, branding, and CTA.`,
        tip: "Maintain all color hex codes, font styles, and composition guidelines for design fidelity.",
      },
      {
        stepNumber: 5,
        title: "Step 05 — Generate the Design",
        instruction:
          "Submit the prompt to generate the initial design layout and visual elements.",
        tip: "Allow the design engine to assemble fonts, graphics, and backgrounds.",
      },
      {
        stepNumber: 6,
        title: "Step 06 — Review the Design",
        instruction:
          "Review the design layout. Check typography legibility, visual hierarchy, color harmony, graphic alignment, and brand feel.",
        tip: "Verify that the primary headline and call to action stand out clearly.",
      },
      {
        stepNumber: 7,
        title: "Step 07 — Refine the Design",
        instruction:
          "Make adjustments using the tool's editing tools or AI refinement features to optimize spacing, typography, and element placement.",
        tip: "Fine-tune contrast and alignments for a professional, finished aesthetic.",
      },
      {
        stepNumber: 8,
        title: "Step 08 — Export the Final Design",
        instruction:
          "Download and export the final design in the appropriate format (high-resolution PNG or print-ready PDF).",
        tip: "Save your asset in high quality for digital publishing or professional printing.",
      },
    ];
  }

  // Fallback to Image Generation steps if somehow not matched
  return [
    {
      stepNumber: 1,
      title: "Step 01 — Open the AI Tool",
      instruction: `Open ${toolName}${effectiveModel} to begin your creation session.`,
    },
    {
      stepNumber: 2,
      title: "Step 02 — Start Generation",
      instruction: "Navigate to the creation or prompt input interface in the tool.",
    },
    {
      stepNumber: 3,
      title: "Step 03 — Enter the Prompt",
      instruction: `Copy${promptExcerpt} from AWA and enter it into the tool.`,
    },
    {
      stepNumber: 4,
      title: "Step 04 — Configure Settings",
      instruction: "Configure available settings such as aspect ratio, style, and quality.",
    },
    {
      stepNumber: 5,
      title: "Step 05 — Generate Result",
      instruction: "Trigger the generation and allow the model to produce the initial result.",
    },
    {
      stepNumber: 6,
      title: "Step 06 — Review the Result",
      instruction: "Examine whether the generated output aligns with the prompt and visual benchmark.",
    },
    {
      stepNumber: 7,
      title: "Step 07 — Refine the Result",
      instruction: "Use follow-up prompt instructions or editing features to polish the output.",
    },
    {
      stepNumber: 8,
      title: "Step 08 — Save Final Asset",
      instruction: "Download or save the final output using the tool's available options.",
    },
  ];
}

/**
 * Centralized Category Guide Configuration dictionary.
 * Maps every category key to its default workflow, titles, descriptions, and feature highlights.
 */
export const categoryGuideConfig: Record<CategoryKey, CategoryWorkflowConfig> = {
  "image-generation": {
    key: "image-generation",
    title: "Image Generation",
    description:
      "Follow these tool-calibrated image synthesis steps to generate photorealistic or artistic assets.",
    iconName: "Camera",
    featureHighlights: [
      { label: "Aspect Ratio", sublabel: "Preset & Custom", iconName: "Ratio" },
      { label: "High Resolution", sublabel: "2K – 4K Output", iconName: "Sparkles" },
      { label: "Style Fidelity", sublabel: "Photoreal / Studio", iconName: "Camera" },
      { label: "Commercial Use", sublabel: "Full Rights", iconName: "ShieldCheck" },
    ],
    defaultTools: [
      {
        toolName: "Midjourney",
        modelName: "v6.1",
        reason: "Best for photorealistic studio lighting and material textures.",
        badge: "Flagship Match",
      },
      {
        toolName: "ChatGPT",
        modelName: "GPT-4o",
        reason: "Conversational prompt refinement and direct styling.",
      },
      {
        toolName: "Ideogram",
        modelName: "Ideogram 2.0",
        reason: "Unmatched typographic clarity and graphic composition.",
      },
    ],
    defaultSteps: generateCategoryToolSteps("image-generation", "Midjourney"),
  },

  "video-generation": {
    key: "video-generation",
    title: "Video Generation",
    description:
      "Temporal coherence, motion direction, and high-fidelity video rendering workflow.",
    iconName: "Film",
    featureHighlights: [
      { label: "Duration", sublabel: "5s – 10s Pacing", iconName: "Clock" },
      { label: "Resolution", sublabel: "1080p / 4K MP4", iconName: "Sparkles" },
      { label: "Camera Control", sublabel: "Pan, Zoom & Drone", iconName: "Video" },
      { label: "Commercial Use", sublabel: "Full Rights", iconName: "ShieldCheck" },
    ],
    defaultTools: [
      {
        toolName: "Runway",
        modelName: "Gen-3 Alpha",
        reason: "Industry standard for cinematic motion control and camera dynamics.",
        badge: "Flagship Match",
      },
      {
        toolName: "Kling",
        modelName: "Kling 1.5",
        reason: "Hyper-realistic human physics and scene fluidity.",
      },
      {
        toolName: "Veo",
        modelName: "Google Veo",
        reason: "High spatial consistency and cinematic visual rendering.",
      },
    ],
    defaultSteps: generateCategoryToolSteps("video-generation", "Runway"),
  },

  "website-generation": {
    key: "website-generation",
    title: "Website Generation",
    description:
      "Full-stack code generation, responsive styling, and modern web application scaffolding.",
    iconName: "Globe",
    featureHighlights: [
      { label: "Framework", sublabel: "React / Next.js / Tailwind", iconName: "Code" },
      { label: "Responsive", sublabel: "Mobile, Tablet, Desktop", iconName: "Smartphone" },
      { label: "Ready to Deploy", sublabel: "Vercel / GitHub", iconName: "Globe" },
      { label: "Commercial Use", sublabel: "Production Code", iconName: "ShieldCheck" },
    ],
    defaultTools: [
      {
        toolName: "Lovable",
        modelName: "Full-Stack Web Agent",
        reason: "Autonomous multi-file React application generation.",
        badge: "Flagship Match",
      },
      {
        toolName: "Bolt",
        modelName: "Bolt.new",
        reason: "In-browser live Node container and rapid web generation.",
      },
      {
        toolName: "v0 by Vercel",
        modelName: "Generative UI",
        reason: "Tailwind CSS & Shadcn component generation.",
      },
    ],
    defaultSteps: generateCategoryToolSteps("website-generation", "Lovable"),
  },

  "slides": {
    key: "slides",
    title: "Slides & Presentations",
    description:
      "Executive presentation decks, pitch decks, and visual storytelling workflows.",
    iconName: "Presentation",
    featureHighlights: [
      { label: "Slide Deck", sublabel: "8 – 12 Slide Flow", iconName: "Layers" },
      { label: "Export Formats", sublabel: "PDF / PPTX / Link", iconName: "Share2" },
      { label: "Visual Hierarchy", sublabel: "Executive Pitch", iconName: "Presentation" },
      { label: "Commercial Use", sublabel: "Client Ready", iconName: "ShieldCheck" },
    ],
    defaultTools: [
      {
        toolName: "Gamma",
        modelName: "Gamma AI 2.0",
        reason: "Fastest deck creation with responsive cards and narrative structure.",
        badge: "Flagship Match",
      },
      {
        toolName: "Canva",
        modelName: "Magic Presentations",
        reason: "Extensive asset library and brand kit alignment.",
      },
      {
        toolName: "PowerPoint Copilot",
        modelName: "Microsoft 365 Copilot",
        reason: "Native enterprise PowerPoint slide generation.",
      },
    ],
    defaultSteps: generateCategoryToolSteps("slides", "Gamma"),
  },

  "poster-design": {
    key: "poster-design",
    title: "Posters & Designs",
    description:
      "Graphic poster, branding, social media creative, and event flyer workflows.",
    iconName: "Palette",
    featureHighlights: [
      { label: "Format", sublabel: "Print & Social (300 DPI)", iconName: "Layers" },
      { label: "Typography", sublabel: "Bold Editorial Layout", iconName: "Sparkles" },
      { label: "Aspect Ratio", sublabel: "Poster / Story / 4:5", iconName: "Ratio" },
      { label: "Commercial Use", sublabel: "Royalty Free", iconName: "ShieldCheck" },
    ],
    defaultTools: [
      {
        toolName: "Canva",
        modelName: "Magic Design",
        reason: "Drag-and-drop vector layout and multi-format resizing.",
        badge: "Flagship Match",
      },
      {
        toolName: "Adobe Express",
        modelName: "Firefly Generative AI",
        reason: "Professional typography, fonts, and print-ready output.",
      },
      {
        toolName: "Ideogram",
        modelName: "Ideogram 2.0",
        reason: "Flawless integrated text rendering inside poster artwork.",
      },
    ],
    defaultSteps: generateCategoryToolSteps("poster-design", "Canva"),
  },
};

/**
 * Resolves the complete guide configuration and steps for any given template and active tool.
 * Handles custom template-specific steps if provided and appropriate.
 */
export function resolveTemplateGuide(
  template: TemplateGuideContext,
  activeToolName?: string,
  activeModelName?: string
) {
  const categoryKey = getTemplateCategoryKey(template);
  const config = categoryGuideConfig[categoryKey];

  // Tool determination:
  // Use passed activeToolName or first recommended tool or config default
  const effectiveToolName =
    activeToolName ||
    template.recommendedTools?.[0]?.toolName ||
    config.defaultTools[0]?.toolName ||
    "AI Tool";

  const effectiveModelName =
    activeModelName ||
    template.recommendedTools?.find(
      (t) => t.toolName.toLowerCase() === effectiveToolName.toLowerCase()
    )?.modelName ||
    config.defaultTools.find(
      (t) => t.toolName.toLowerCase() === effectiveToolName.toLowerCase()
    )?.modelName ||
    "";

  // 1. CANONICAL SINGLE SOURCE OF TRUTH:
  // If template has explicit workflow.steps created by the admin builder, USE THEM DIRECTLY!
  if (template.workflow?.steps && template.workflow.steps.length > 0) {
    const canonicalSteps = template.workflow.steps.map((s, idx) =>
      normalizeTemplateStep(s, idx)
    );
    return {
      categoryKey,
      config,
      toolName: effectiveToolName,
      modelName: effectiveModelName,
      steps: canonicalSteps,
    };
  }

  // Check if template has custom usageSteps defined
  // Only use template.usageSteps if it exists AND does NOT contain leaked website steps for non-website categories
  let steps: UsageStep[];
  const hasCustomSteps = template.usageSteps && template.usageSteps.length > 0;

  if (hasCustomSteps && template.usageSteps) {
    const isLeakedWebsiteStep =
      categoryKey !== "website-generation" &&
      template.usageSteps.some((s) => {
        const text = `${s.title} ${s.instruction}`.toLowerCase();
        return (
          text.includes("website") ||
          text.includes("v0") ||
          text.includes("responsive") ||
          text.includes("pricing toggle") ||
          text.includes("deploy to your preferred platform") ||
          text.includes("choose a website framework") ||
          text.includes("create page structure") ||
          text.includes("build components") ||
          text.includes("add responsive layouts") ||
          text.includes("connect apis") ||
          text.includes("deploy the website") ||
          text.includes("figma") ||
          text.includes("choose your tool") ||
          text.includes("customize content") ||
          text.includes("implement features") ||
          text.includes("make it responsive") ||
          text.includes("launch your project")
        );
      });

    const isGenericEducationalSlideStep =
      categoryKey === "slides" &&
      template.usageSteps.some((s) => {
        const text = `${s.title} ${s.instruction}`.toLowerCase();
        return (
          !s.prompt ||
          text.includes("define presentation goal") ||
          text.includes("identify audience") ||
          text.includes("plan your presentation") ||
          text.includes("design your slides") ||
          text.includes("open the ai presentation tool") ||
          text.includes("start a new presentation")
        );
      });

    if (!isLeakedWebsiteStep && !isGenericEducationalSlideStep) {
      steps = template.usageSteps.map((s, idx) => normalizeTemplateStep(s, idx));
    } else {
      steps = generateCategoryToolSteps(
        categoryKey,
        effectiveToolName,
        effectiveModelName,
        template
      );
    }
  } else {
    steps = generateCategoryToolSteps(
      categoryKey,
      effectiveToolName,
      effectiveModelName,
      template
    );
  }

  return {
    categoryKey,
    config,
    toolName: effectiveToolName,
    modelName: effectiveModelName,
    steps,
  };
}

/**
 * Transforms an array of UsageStep or TemplateStep objects into standard GuideStep objects
 * for the animated workflow canvas, strictly preserving ALL prompt directives and metadata.
 */
export function mapToGuideSteps(steps: (UsageStep | TemplateStep)[]): GuideStep[] {
  return steps.map((s: any, idx) => {
    const canonical = normalizeTemplateStep(s, idx);
    return {
      ...canonical,
      id: canonical.id,
      step: canonical.order,
      order: canonical.order,
      stepNumber: canonical.order,
      title: canonical.title,
      description: canonical.description || canonical.instruction || "",
      tip: canonical.tips?.[0] || canonical.tip,
      image: canonical.image?.url || canonical.imageUrl,
      imageCaption: canonical.image?.caption || canonical.imageCaption,
      prompt: canonical.prompt,
      promptCategory: canonical.promptCategory,
      promptVariables: canonical.variables || canonical.promptVariables,
      slideNumber: canonical.slideNumber,
      slideTitle: canonical.slideTitle,
    };
  });
}
