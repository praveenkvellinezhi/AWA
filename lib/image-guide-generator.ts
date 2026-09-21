import { UsageStep } from "./types";

export interface GuideContext {
  templateName?: string;
  promptText?: string;
  style?: string;
  categoryId?: string;
  hasReferenceImage?: boolean;
}

/**
 * Normalizes tool name string for matching.
 */
function normalizeToolName(name: string): string {
  return (name || "").toLowerCase().trim();
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
 * Dynamically generates 8–10 tool-specific steps for AI image generation.
 */
export function generateImageGuide(
  toolName: string,
  modelName?: string,
  context?: GuideContext
): UsageStep[] {
  const norm = normalizeToolName(toolName);
  const effectiveModel = modelName || "";
  const promptExcerpt = context?.promptText ? " the provided prompt" : " the prompt";

  // 1. MIDJOURNEY WORKFLOW
  if (norm.includes("midjourney")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Midjourney",
        instruction:
          "Open Discord and go to the Midjourney Bot direct messages or your designated server (or visit midjourney.com if you have web creation access).",
        tip: "Inviting the Midjourney Bot to a private personal server keeps your generation history organized and clutter-free.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          "Type `/imagine` in the message bar and press Tab or Space to activate the prompt parameter input box.",
        tip: "On midjourney.com, click the 'Imagine' search bar at the very top of the Explore or Create page.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} from AWA into the \`/imagine prompt:\` field without removing any parameters.`,
        tip: "Keep all camera lenses, lighting tags, and material descriptions intact for maximum photorealism.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "If using a reference image, upload it to Discord, copy its direct image link, and paste the URL at the very start of your `/imagine` prompt.",
        tip: "Add `--iw 1.5` at the end of your prompt if you want Midjourney to weight the reference image more heavily.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Verify that the aspect ratio flag (e.g. `--ar 4:5` or `--ar 16:9`), model version `--v 6.1`, and `--style raw` remain at the end of the prompt.",
        tip: "Type `/settings` in Discord anytime to set 'Raw Style' and 'High Quality' as your permanent defaults.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Press Enter / Return to submit the prompt to the Midjourney rendering queue.",
        tip: "Fast GPU mode will generate the initial 4-image grid in approximately 30 to 60 seconds.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Review the 4 generated candidate images (arranged clockwise: 1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right) and compare with the expected preview.",
        tip: "Zoom in to evaluate fine textures like stone grain, glass reflections, and ambient morning sunlight.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Click 'Vary (Subtle)' for minor atmospheric adjustments, or click 'Vary (Region)' to inpaint and re-prompt specific areas like label text or background props.",
        tip: "'Vary (Subtle)' keeps the overall composition locked while regenerating micro-details.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Click V1, V2, V3, or V4 corresponding to your favorite quadrant to produce 4 new iterations based on that composition, or click 🔄 to re-roll completely.",
        tip: "Re-rolling with the same prompt explores alternative camera angles while retaining the core aesthetic.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click U1–U4 to upscale your chosen variation, then click 'Upscale (Subtle)' or open in full resolution, right-click, and select 'Save Image'.",
        tip: "On midjourney.com, click the Download icon to save the uncompressed 2048px resolution file directly to your disk.",
      },
    ];
    return steps;
  }

  // 2. CHATGPT / DALL-E 3 WORKFLOW
  if (norm.includes("chatgpt") || norm.includes("dall-e") || norm.includes("gpt")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open ChatGPT",
        instruction:
          "Navigate to chatgpt.com or open the ChatGPT desktop/mobile app and sign into your account.",
        tip: "Ensure you are using GPT-4o or have DALL-E 3 image generation enabled on your account.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          "Click 'New Chat' from the left sidebar and verify that GPT-4o is selected in the top model picker.",
        tip: "You can also choose the specialized 'DALL·E' GPT from the Explore GPTs menu for dedicated image prompting.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the main message input area at the bottom of the chat.`,
        tip: "Prepend 'Create a photorealistic image:' if you want ChatGPT to follow your prompt strictly without creative alterations.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "Click the '+' or paperclip attachment icon next to the prompt field to upload a reference image for style, composition, or subject matching.",
        tip: "Instruct ChatGPT: 'Use the attached image as visual reference for the lighting and travertine pedestal.'",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Specify your required aspect ratio directly in the prompt text, such as 'Aspect ratio: 4:5 portrait (1024x1280)' or 'Wide landscape (1792x1024)'.",
        tip: "DALL-E 3 natively supports Square (1024x1024), Wide (1792x1024), and Tall (1024x1792) formats.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the Send arrow button or press Enter to initiate image generation.",
        tip: "ChatGPT will display a progress indicator and typically delivers your generated image within 15–25 seconds.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Click the rendered image to open it in full view and compare the lighting, materials, and composition against the preview.",
        tip: "Check fine details like label typography and soft shadow gradients along the edges.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Click the 'Select' (brush) tool on the expanded image, highlight any area you want to modify, and describe your change in the pop-up prompt box.",
        tip: "For example, highlight the background and type 'make the morning sunlight warmer with softer window shadows'.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Reply in the chat with conversational adjustments, such as 'Generate 2 more variations with a slightly tighter macro angle'.",
        tip: "ChatGPT remembers the conversational context, allowing iterative, progressive refinements.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click the Download icon in the top-right corner of the expanded image viewer to save the full-resolution file to your device.",
        tip: "The image will be saved as a high-resolution WebP or PNG file ready for commercial and web use.",
      },
    ];
    return steps;
  }

  // 3. GOOGLE GEMINI (IMAGEN 3)
  if (norm.includes("gemini") || norm.includes("imagen") || norm.includes("google")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Google Gemini",
        instruction:
          "Navigate to gemini.google.com and log in with your Google account.",
        tip: "Gemini Advanced with Imagen 3 provides photorealistic studio lighting and natural material rendering.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          "Start a fresh conversation by clicking '+ New chat' in the left-hand sidebar.",
        tip: "Gemini automatically triggers the Imagen 3 generation pipeline when it receives visual scene prompts.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the 'Ask Gemini' message box at the bottom.`,
        tip: "Ensure the prompt begins with 'Generate an image of...' or 'Photorealistic photo of...' to ensure immediate image mode activation.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "Click the '+' (Upload image) button beside the prompt field to attach a reference photo if composition guidance is needed.",
        tip: "Add a short instruction: 'Match the lighting direction and raw stone texture shown in this reference photo.'",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Specify the desired orientation and aspect ratio in the prompt, such as 'in portrait 4:5 format' or 'in wide 16:9 ratio'.",
        tip: "Imagen 3 is optimized for 1:1, 3:4, 4:3, 9:16, and 16:9 aspect ratios.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the Submit arrow button or press Enter to begin generating images with Imagen 3.",
        tip: "Gemini will generate candidate images directly in the chat stream.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Click any generated thumbnail to open the high-resolution lightbox preview and evaluate realism and focal depth.",
        tip: "Inspect surface specular highlights and depth-of-field blur against the expected preview.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Reply in the chat with targeted refinements, like 'Keep the candle identical but soften the morning window shadows'.",
        tip: "Gemini can preserve key subjects while modifying surrounding environmental elements.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Click the 'Regenerate' or 'More options' button beneath the response to explore alternative variations.",
        tip: "You can also use 'Modify response' to select different creative interpretations.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Hover over the selected image, click the Download icon in the top corner, and save the original full-resolution file.",
        tip: "Images are saved at full native resolution with metadata preserved.",
      },
    ];
    return steps;
  }

  // 4. ADOBE FIREFLY
  if (norm.includes("firefly") || norm.includes("adobe")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Adobe Firefly",
        instruction:
          "Go to firefly.adobe.com and sign in with your Adobe ID.",
        tip: "Adobe Firefly is trained on commercially safe Adobe Stock assets, guaranteeing commercial clearance.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Text to Image",
        instruction:
          "Click 'Generate' on the 'Text to Image' card from the Firefly home dashboard to open the creation studio.",
        tip: "Make sure 'Firefly Image 3 Model' is selected in the left settings panel for modern photorealism.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the prompt bar at the bottom of the screen.`,
        tip: "Firefly does not require prompt parameter syntax; visual controls are handled through the sidebar.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "In the left panel under 'Structure' or 'Style', click 'Upload image' to guide scene composition or aesthetic palette.",
        tip: "Use the 'Strength' slider to balance reference fidelity with creative prompt adherence.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "In the left panel, set Aspect Ratio to 'Portrait (4:5)' or 'Landscape (16:9)', Content Type to 'Photo', and select Lighting effects like 'Studio' or 'Golden Hour'.",
        tip: "Expand 'Photo settings' to dial in exact Aperture (f/2.8), Shutter Speed, and Field of View.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the 'Generate' button in the bottom-right corner to start rendering.",
        tip: "Firefly will generate a set of 4 unique variations simultaneously.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Click through the 4 variations in the gallery view and evaluate texture realism, lighting direction, and composition.",
        tip: "Check travertine stone texture and morning sunlight angle against the reference preview.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Hover over your favorite candidate and click 'Edit' → 'Generative Fill' to brush over any element and replace or remove it.",
        tip: "Generative Fill is ideal for retouching labels or adding delicate botanical props without re-rolling.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Hover over the best candidate, click the '...' menu, and select 'Generate similar' to create subtle variations.",
        tip: "This locks the successful composition while exploring subtle lighting and prop nuances.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click the Download button at the top of the image to export the high-resolution file to your device.",
        tip: "Downloaded assets include Content Credentials verifying commercial usage rights.",
      },
    ];
    return steps;
  }

  // 5. LEONARDO AI
  if (norm.includes("leonardo")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Leonardo AI",
        instruction:
          "Go to leonardo.ai and click 'Launch App' or sign in to open the workspace.",
        tip: "Leonardo AI provides a generous daily free token allowance for high-end generations.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          "Click 'Image Generation' in the left-hand navigation menu to open the generation studio.",
        tip: `Select '${effectiveModel || "Leonardo Phoenix"}' or 'Leonardo Kino XL' as your finetuned model for maximum photographic realism.`,
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the main prompt text box at the top.`,
        tip: "Enable 'Add Negative Prompt' and type 'blurry, distorted text, plastic, cartoon, bad lighting' to prevent unwanted artifacts.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "Click 'Image Guidance' below the prompt field, upload your reference image, and choose 'Depth', 'Edge', or 'Pose'.",
        tip: "Set the Strength slider to 0.65 for tight structural alignment with creative flexibility.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "In the left settings panel, set 'Number of Images' to 4, Aspect Ratio to '4:5 (832x1040)', and toggle on 'Alchemy' and 'PhotoReal'.",
        tip: "Enabling Alchemy delivers ultra-crisp micro-textures on stone, glass, and paper labels.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the purple 'Generate' button on the right side of the prompt bar.",
        tip: "The button displays the exact token cost before you generate.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Scroll down to Generation History, click on each image to view full-screen, and evaluate lighting and composition.",
        tip: "Verify photorealistic depth of field and authentic waxy surface translucency.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Click 'Alchemy Upscaler' on your preferred image to upscale to 4K resolution while enhancing fine micro-details.",
        tip: "Alternatively, click 'Edit in Canvas' to paint in additional props or fix background elements.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Click 'Reuse Prompt' or slightly tweak the prompt and click Generate again to produce fresh variations.",
        tip: "Adjust the 'Guidance Scale' slider from 7 to 8.5 for tighter prompt adherence.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click the Download icon on the upscaled image card to save the uncompressed 4K asset to your computer.",
        tip: "The downloaded file is uncompressed and color-profiled for e-commerce and print.",
      },
    ];
    return steps;
  }

  // 6. IDEOGRAM
  if (norm.includes("ideogram")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Ideogram",
        instruction:
          "Visit ideogram.ai and log in with your Google or Apple account.",
        tip: "Ideogram v2 is widely celebrated for rendering coherent typography and precise text labels.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          "Click into the main prompt input bar at the top of the Ideogram home feed or personal dashboard.",
        tip: `Ensure the model toggle is set to '${effectiveModel || "Ideogram 2.0"}' or 'Ideogram 2.0 Turbo'.`,
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the prompt field.`,
        tip: "Enclose any specific label text in quotation marks (e.g., 'NOIR DE TERRE') for letter-for-letter accuracy.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "Click the image icon next to the prompt bar to upload a reference image if you want composition guidance.",
        tip: "Set image weight to 50% to balance your reference image with the prompt instructions.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Select the 'Realistic' style tag beneath the prompt bar, and click the Aspect Ratio selector to choose '4:5' (or your target ratio).",
        tip: "Set 'Magic Prompt' to 'Auto' or 'Off' so AWA's engineered camera parameters are preserved verbatim.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the 'Generate' button (or press Ctrl/Cmd + Enter) to start rendering.",
        tip: "Ideogram generates 4 high-quality candidate images per batch.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Click on each of the 4 rendered images to view full-screen and check label text, glass reflections, and lighting.",
        tip: "Zoom in on the candle label to confirm razor-sharp typography.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Click the 'Remix' button on your favorite candidate to tweak the prompt while maintaining the base composition.",
        tip: "Use the 'Color Palette' picker if you want to shift the warm golden tones cooler or more saturated.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Click the circular reload button on the generation card to re-roll with a new random seed.",
        tip: "Ideogram's fast queue allows quick back-to-back testing of alternative compositions.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click the Download icon in the top-right corner of the full-screen view to save the original high-resolution PNG/JPG.",
        tip: "Images are clean, artifact-free, and immediately ready for storefront display.",
      },
    ];
    return steps;
  }

  // 7. FLUX (BLACK FOREST LABS / FAL.AI / REPLICATE)
  if (norm.includes("flux") || norm.includes("black forest")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Flux Platform",
        instruction:
          "Open your preferred Flux web studio (such as fal.ai, Replicate, Black Forest Labs, or your local ComfyUI instance).",
        tip: "FLUX.1 [dev] delivers peak quality for commercial work, while FLUX.1 [schnell] generates in under 2 seconds.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          `Navigate to the Text-to-Image interface and select the ${effectiveModel || "FLUX.1 [dev]"} checkpoint.`,
        tip: "Ensure inference steps are set to 28–30 for optimal photorealism.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the main 'Prompt' input box.`,
        tip: "Flux excels at natural language descriptions of materials, studio lighting, and camera optics.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "If your interface supports Image-to-Image or ControlNet, upload your reference image into the 'Input Image' slot.",
        tip: "Set denoising strength to 0.65 to preserve composition while generating fresh textures.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Set the aspect ratio to 4:5 (e.g. 896x1152 or 1024x1280) and set Guidance Scale (CFG) to 3.0–3.5.",
        tip: "Flux requires lower CFG values (around 3.0) than older models to avoid over-saturation.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the 'Run' or 'Generate' button to initiate the diffusion process.",
        tip: "Watch the progressive denoising steps complete in real-time.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Open the generated image at 100% scale and inspect surface textures, ambient occlusion, and lighting falloff.",
        tip: "Flux excels at rendering realistic skin, waxy surfaces, and organic botanical shadows.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Adjust lighting or lens descriptions in the prompt text and re-generate to hone in on your ideal look.",
        tip: "Lock the 'Seed' number if you like the current layout and only want to change specific lighting nuances.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Set the batch size to 2 or 4, or click 'Randomize Seed' to generate diverse variations of the same scene.",
        tip: "Compare different camera angles and depth-of-field settings across seeds.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Click the 'Download' button or right-click the image and select 'Save Image As' to store the lossless PNG file.",
        tip: "Flux outputs crisp, high-bitrate images with zero compression artifacts.",
      },
    ];
    return steps;
  }

  // 8. STABLE DIFFUSION / SDXL
  if (norm.includes("stable diffusion") || norm.includes("sdxl") || norm.includes("comfyui")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Stable Diffusion Interface",
        instruction:
          "Launch your Stable Diffusion WebUI (Automatic1111, ComfyUI, or Fooocus).",
        tip: "Fooocus or ComfyUI provides the fastest and most beginner-friendly SDXL workflow.",
      },
      {
        stepNumber: 2,
        title: "Navigate to Image Generation",
        instruction:
          `Select an SDXL checkpoint (such as ${effectiveModel || "sd_xl_base_1.0"} or a photoreal fine-tune like Juggernaut XL).`,
        tip: "Pair with the SDXL Refiner for enhanced micro-details if supported by your UI.",
      },
      {
        stepNumber: 3,
        title: "Enter the Prompt",
        instruction: `Paste${promptExcerpt} into the positive prompt box, and add quality negative prompts into the negative box.`,
        tip: "Keep camera lens tags (85mm, f/2.8) in the positive prompt to guide focal depth.",
      },
      {
        stepNumber: 4,
        title: "Upload Reference Image — If Required",
        instruction:
          "If using ControlNet or Image-to-Image, drag your reference photo into the Image Prompt slot and select 'Depth' or 'Canny'.",
        tip: "Set ControlNet weight to 0.7 for accurate structural alignment.",
      },
      {
        stepNumber: 5,
        title: "Configure Generation Settings",
        instruction:
          "Set resolution to 832x1024 (4:5 ratio), Sampling Method to 'DPM++ 2M Karras', Steps to 30–35, and CFG Scale to 7.0.",
        tip: "SDXL is natively trained on 1024x1024 total pixel area; 832x1024 maintains optimal coherence.",
      },
      {
        stepNumber: 6,
        title: "Generate the Image",
        instruction:
          "Click the large 'Generate' button to start the diffusion inference.",
        tip: "Watch the step-by-step preview appear as the image resolves.",
      },
      {
        stepNumber: 7,
        title: "Review the Result",
        instruction:
          "Inspect the output at 100% zoom, verifying label text, travertine stone texture, and morning light.",
        tip: "Ensure reflections on the amber glass jar look natural and physically plausible.",
      },
      {
        stepNumber: 8,
        title: "Refine the Result",
        instruction:
          "Send the image to 'Inpaint', mask any imperfect elements (like twig placement), and click Generate to redraw that region.",
        tip: "Set Inpaint Denoising Strength to 0.4–0.5 for seamless blending.",
      },
      {
        stepNumber: 9,
        title: "Regenerate / Create Variations",
        instruction:
          "Enable 'Extra' options, set Variation Seed strength to 0.15, and click Generate to produce subtle variations.",
        tip: "Great for testing slight variations in candle flame or shadow angles.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Image",
        instruction:
          "Send the winning image to 'Extras' or click 'Hires. fix' / 'Upscale' to generate the final 4K export.",
        tip: "Save the exported PNG containing embedded generation parameters for future reproducibility.",
      },
    ];
    return steps;
  }

  // 9. DYNAMIC FALLBACK FOR ANY OTHER AI IMAGE TOOL
  const displayName = toolName || "AI Image Tool";
  const modelText = effectiveModel ? ` (${effectiveModel})` : "";

  return [
    {
      stepNumber: 1,
      title: `Open ${displayName}`,
      instruction: `Open ${displayName} in your browser or application and sign into your account.`,
      tip: `Ensure you have access to the latest generation engine${modelText} for peak visual quality.`,
    },
    {
      stepNumber: 2,
      title: "Navigate to Image Generation",
      instruction: `Locate and click the 'Create Image', 'Text to Image', or 'Generate' option in ${displayName}.`,
      tip: "Select the highest available model checkpoint for optimal lighting and material fidelity.",
    },
    {
      stepNumber: 3,
      title: "Enter the Prompt",
      instruction: `Paste${promptExcerpt} from AWA into the main prompt input field.`,
      tip: "Keep all camera specifications, lighting descriptions, and material tags intact.",
    },
    {
      stepNumber: 4,
      title: "Upload Reference Image — If Required",
      instruction:
        "If your workflow requires composition or style matching, upload your reference image to the image input slot.",
      tip: "Adjust reference strength so it guides composition without overpowering the text prompt.",
    },
    {
      stepNumber: 5,
      title: "Configure Generation Settings",
      instruction: `Configure the aspect ratio (e.g. 4:5 portrait or 16:9 landscape), resolution, and style presets in ${displayName}.`,
      tip: "Choose 'Photorealistic' or 'Commercial Photography' style presets if available.",
    },
    {
      stepNumber: 6,
      title: "Generate the Image",
      instruction: `Click 'Generate' or 'Create' to submit your prompt and begin the rendering process in ${displayName}.`,
      tip: "Wait for the rendering queue to finish generating your image batch.",
    },
    {
      stepNumber: 7,
      title: "Review the Result",
      instruction:
        "Examine the rendered outputs and compare the composition, lighting, and textures with the reference preview.",
      tip: "Zoom in to verify fine details such as textures, reflections, and shadow falloff.",
    },
    {
      stepNumber: 8,
      title: "Refine the Result",
      instruction:
        `Use ${displayName}'s inpainting, selective editing, or prompt tweaking tools to refine any minor imperfections.`,
      tip: "Tweak descriptive keywords in the prompt to adjust lighting warmth or background softness.",
    },
    {
      stepNumber: 9,
      title: "Regenerate / Create Variations",
      instruction:
        `Generate additional variations in ${displayName} to explore different angles, framing, or shadow subtleties.`,
      tip: "Generating a second batch often yields unexpected and compelling visual variations.",
    },
    {
      stepNumber: 10,
      title: "Save the Final Image",
      instruction:
        `Download the final full-resolution image from ${displayName} to your device.`,
      tip: "Export in PNG or highest-quality format for maximum fidelity in production use.",
    },
  ];
}
