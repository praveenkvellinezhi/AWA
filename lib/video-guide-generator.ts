import {
  Template,
  UsageStep,
  VideoAsset,
  VideoAssetType,
  VideoGenerationType,
  VideoWorkflowConfig,
} from "./types";

/**
 * Normalizes tool name for matching.
 */
function normalizeTool(name: string): string {
  return (name || "").toLowerCase().trim();
}

/**
 * Checks if a template is an AI Video Generation template.
 */
export function isVideoGenerationTemplate(template: {
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
  recommendedTools?: { toolName: string }[];
}): boolean {
  const catId = (template.categoryId || "").toLowerCase();
  const catName = (template.categoryName || "").toLowerCase();
  if (catId.includes("video") || catName.includes("video")) return true;

  const videoTools = [
    "runway",
    "sora",
    "pika",
    "kling",
    "luma",
    "veo",
    "hailuo",
    "minimax",
    "kaiber",
    "stable video",
  ];

  return (template.recommendedTools || []).some((tool) =>
    videoTools.some((vt) => tool.toolName.toLowerCase().includes(vt))
  );
}

/**
 * Human-readable title for each video generation workflow.
 */
export function getWorkflowTitle(type: VideoGenerationType): string {
  switch (type) {
    case "text-to-video":
      return "Text → Video Generation";
    case "image-to-video":
      return "Image → Video Animation";
    case "multiple-images":
      return "Multiple Images → Video";
    case "image-text-to-video":
      return "Image + Text Prompt → Video";
    case "start-end-frame":
      return "Start Frame → End Frame Interpolation";
    case "reference-image-to-video":
      return "Reference Image → Video";
    case "character-reference":
      return "Character Reference → Video";
    case "product-image-to-video":
      return "Product Image → Cinematic Video";
    case "video-to-video":
      return "Existing Video → AI Video Editing";
    case "multiple-references":
      return "Multiple References → Video";
    default:
      return "AI Video Generation";
  }
}

/**
 * Human-readable short description for each workflow type.
 */
export function getWorkflowDescription(type: VideoGenerationType, toolName: string): string {
  switch (type) {
    case "text-to-video":
      return `Generate a fluid, cinematic scene entirely from a descriptive prompt in ${toolName}.`;
    case "image-to-video":
      return `Animate a still image into a dynamic video using motion prompts and camera control in ${toolName}.`;
    case "multiple-images":
      return `Combine multiple visual inputs (subject, environment, lighting) to synthesize a coherent video in ${toolName}.`;
    case "image-text-to-video":
      return `Use a base image for subject fidelity paired with detailed motion instructions in ${toolName}.`;
    case "start-end-frame":
      return `Provide initial and final keyframes; ${toolName} will smoothly interpolate the transition in between.`;
    case "reference-image-to-video":
      return `Use an image to guide lighting and aesthetic mood without forcing it as the starting frame in ${toolName}.`;
    case "character-reference":
      return `Lock character facial and attire identity across frames using reference image guidance in ${toolName}.`;
    case "product-image-to-video":
      return `Create a commercial product video from your product photo while preserving logos, packaging, and colors in ${toolName}.`;
    case "video-to-video":
      return `Transform or restyle existing video footage with new backgrounds or aesthetics in ${toolName}.`;
    case "multiple-references":
      return `Assign multiple reference assets to distinct roles (character, environment, style) in ${toolName}.`;
    default:
      return `Create cinematic AI video using ${toolName}.`;
  }
}

/**
 * Intelligently resolves the VideoWorkflowConfig for a template if not explicitly defined.
 */
export function resolveVideoWorkflow(
  template: Template,
  activeToolName?: string
): VideoWorkflowConfig {
  if (template.videoWorkflow) {
    return template.videoWorkflow;
  }

  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = template.name.toLowerCase();
  const subcategory = (template.subcategoryName || "").toLowerCase();
  const prompt = (template.promptText || "").toLowerCase();

  let generationType: VideoGenerationType = "text-to-video";
  const assets: VideoAsset[] = [];

  // Detect Start Frame -> End Frame
  if (
    tags.includes("start-end-frame") ||
    tags.includes("keyframes") ||
    prompt.includes("first frame") ||
    prompt.includes("end frame")
  ) {
    generationType = "start-end-frame";
    assets.push(
      {
        id: "asset-start-frame",
        type: "start-frame",
        label: "Starting Frame Image",
        description: "Represents the initial state/first frame of the video sequence.",
        url: template.imageUrl || "/images/categories/video-gen.jpg",
        required: true,
        role: "Start Frame",
        dimensions: "1920x1080 (16:9)",
      },
      {
        id: "asset-end-frame",
        type: "end-frame",
        label: "Ending Frame Image",
        description: "Represents the desired final state/destination frame of the video.",
        url: template.galleryImages?.[0] || "/images/categories/video-gen.jpg",
        required: true,
        role: "End Frame",
        dimensions: "1920x1080 (16:9)",
      }
    );
  }
  // Detect Product Image -> Video
  else if (
    tags.includes("product") ||
    subcategory.includes("product") ||
    subcategory.includes("commercial") ||
    name.includes("product") ||
    name.includes("espresso") ||
    name.includes("coffee")
  ) {
    generationType = "product-image-to-video";
    assets.push({
      id: "asset-product",
      type: "product-image",
      label: "Product Photograph",
      description: "High-resolution clean product image. Used as the main visual subject.",
      url: template.imageUrl || "/images/categories/video-gen.jpg",
      required: true,
      role: "Main Product Input",
      dimensions: "1080x1350 (4:5) or 1920x1080",
    });
  }
  // Detect Character Reference -> Video
  else if (
    tags.includes("character") ||
    tags.includes("fashion") ||
    name.includes("fashion") ||
    name.includes("character")
  ) {
    generationType = "character-reference";
    assets.push({
      id: "asset-character",
      type: "character-reference",
      label: "Character Reference Image",
      description: "Clear reference photo of the character/model to maintain facial & attire consistency.",
      url: template.imageUrl || "/images/categories/video-gen.jpg",
      required: true,
      role: "Character Identity",
      dimensions: "1024x1024 (1:1)",
    });
  }
  // Detect Video-to-Video
  else if (
    tags.includes("video-to-video") ||
    tags.includes("edit") ||
    name.includes("restyle")
  ) {
    generationType = "video-to-video";
    assets.push({
      id: "asset-source-video",
      type: "source-video",
      label: "Source Video Footage",
      description: "Original MP4/MOV footage to be restyled or modified.",
      url: template.videoUrl,
      required: true,
      role: "Source Video",
    });
  }
  // Default: Text-to-Video
  else {
    generationType = "text-to-video";
  }

  return {
    generationType,
    assets: assets.length > 0 ? assets : undefined,
    motionPrompt: template.promptText,
    settings: {
      aspectRatio: "16:9",
      durationSeconds: 5,
      motionIntensity: 4,
      resolution: "1080p",
      cameraMovement: "Forward Pan / Tracking",
      fps: 24,
    },
  };
}

/**
 * Builds the full step-by-step video guide dynamically adapted to tool, generation method, and required assets.
 */
export function generateVideoGuide(
  workflow: VideoWorkflowConfig,
  toolName: string,
  modelName?: string,
  context?: { templateName?: string; promptText?: string }
): UsageStep[] {
  const norm = normalizeTool(toolName);
  const type = workflow.generationType;
  const assets = workflow.assets || [];
  const model = modelName || "";
  const motionPrompt = context?.promptText || workflow.motionPrompt || "the provided motion prompt";

  // Helper to extract tool-specific terminology
  const isRunway = norm.includes("runway");
  const isKling = norm.includes("kling");
  const isLuma = norm.includes("luma");
  const isPika = norm.includes("pika");
  const isSora = norm.includes("sora");
  const isVeo = norm.includes("veo");
  const isMinimax = norm.includes("minimax") || norm.includes("hailuo");

  const toolDisplay = toolName || "AI Video Tool";

  // ==========================================================================
  // 1. TEXT-TO-VIDEO WORKFLOW
  // ==========================================================================
  if (type === "text-to-video") {
    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: isRunway
          ? "Log in to your RunwayML dashboard at app.runwayml.com."
          : isKling
          ? "Open Kling AI at klingai.com and navigate to the creation workspace."
          : isLuma
          ? "Open Luma Dream Machine at lumalabs.ai/dream-machine and sign into your account."
          : isPika
          ? "Navigate to pika.art and log in to the Pika creation studio."
          : isSora
          ? "Open OpenAI Sora at sora.com and start a new video creation session."
          : `Open ${toolDisplay} in your web browser or desktop application and log in.`,
        tip: isRunway
          ? `Select '${model || "Gen-3 Alpha"}' from the model picker for cinematic temporal coherence.`
          : `Ensure you have available generation credits on ${toolDisplay}.`,
      },
      {
        stepNumber: 2,
        title: "Select Text-to-Video Mode",
        instruction: isRunway
          ? "Click 'Text to Video' on the left navigation bar or generation dashboard."
          : isKling
          ? "Ensure the 'Text to Video' tab is selected above the prompt box."
          : isPika
          ? "Select the 'Text' creation toggle on the bottom prompt bar."
          : `Select the 'Text to Video' or 'Generate from Prompt' option in ${toolDisplay}.`,
        tip: "Text-to-video synthesizes motion, lighting, and physics directly from your textual description.",
      },
      {
        stepNumber: 3,
        title: "Enter the Video Prompt",
        instruction: `Copy the provided video prompt from AWA and paste it into the prompt input field in ${toolDisplay}.`,
        tip: "Keep all camera motion cues ('FPV drone dive', 'slow 24fps motion', 'volumetric god rays') intact.",
      },
      {
        stepNumber: 4,
        title: "Configure Video Settings",
        instruction: isRunway
          ? "Set Duration to 5s or 10s, Aspect Ratio to 16:9, and adjust Camera Control (Pan Forward, Speed 3)."
          : isKling
          ? "Select 'Standard Mode' or 'Professional Mode', Aspect Ratio (16:9), and Duration (5s or 10s)."
          : isLuma
          ? "Set your desired aspect ratio (16:9 widescreen) and toggle 'Enhance Prompt' if desired."
          : isPika
          ? "Set Aspect Ratio to 16:9, Frame Rate to 24fps, and adjust Motion slider to 3–4."
          : `Configure settings: Aspect Ratio (16:9), Duration (5 seconds), and resolution (1080p).`,
        tip: "Moderate motion settings (levels 3–4 out of 10) prevent surreal warping while maintaining fluid dynamics.",
      },
      {
        stepNumber: 5,
        title: "Generate the Video",
        instruction: isRunway
          ? "Click the 'Generate' button to submit your clip to the Gen-3 rendering queue."
          : isKling
          ? "Click the 'Generate' button (displays credit cost) to start rendering."
          : `Click 'Generate' or 'Create' to begin processing the video in ${toolDisplay}.`,
        tip: "Rendering typically takes between 1 and 3 minutes depending on server queue traffic.",
      },
      {
        stepNumber: 6,
        title: "Review Movement & Quality",
        instruction:
          "Play the generated video in full screen. Check camera glide stability, cloud/particle physics, and subject integrity across all seconds.",
        tip: "Look for smooth pacing without sudden jitter or unexpected morphing in the background scenery.",
      },
      {
        stepNumber: 7,
        title: "Refine Camera Motion & Prompt",
        instruction: isRunway
          ? "Use the 'Extend' feature to add 5 more seconds to the clip, or tweak the Camera Control direction and re-roll."
          : isKling
          ? "Adjust the 'Creativity vs Relevance' slider or tweak camera trajectory keywords in the prompt and generate again."
          : `Tweak descriptive keywords in the prompt or adjust camera velocity sliders to refine the motion.`,
        tip: "Subtle prompt additions like 'stabilized cinematic gimbal' help smooth out aggressive camera shake.",
      },
      {
        stepNumber: 8,
        title: "Export Final Video",
        instruction: `Click the 'Download' or 'Export' button in ${toolDisplay} to save the high-definition MP4 video to your computer.`,
        tip: "Download in 1080p or 4K resolution at 24fps for smooth playback in video editing software.",
      },
    ];
  }

  // ==========================================================================
  // 2. IMAGE-TO-VIDEO WORKFLOW
  // ==========================================================================
  if (type === "image-to-video") {
    const mainAsset = assets.find((a) => a.type === "single-image" || a.type === "product-image") || assets[0];
    const assetLabel = mainAsset?.label || "Base Image";

    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and sign into your account to access the video creation workspace.`,
        tip: `Ensure your ${toolDisplay} account has sufficient credits for video rendering.`,
      },
      {
        stepNumber: 2,
        title: "Select Image-to-Video Mode",
        instruction: isRunway
          ? "Click 'Image to Video' or select the Gen-3 Image-to-Video canvas."
          : isKling
          ? "Select the 'Image to Video' tab above the prompt area."
          : isLuma
          ? "Click the '+' or image icon inside the Dream Machine prompt bar."
          : `Select the 'Image to Video' or 'Animate Image' feature in ${toolDisplay}.`,
        tip: "Image-to-video locks the visual composition from your uploaded still and animates motion from it.",
      },
      {
        stepNumber: 3,
        title: `Upload ${assetLabel}`,
        instruction: `Upload the ${assetLabel.toLowerCase()} provided with this tutorial into the image input slot.`,
        tip: "Ensure your image is high resolution with clear edges and no compression artifacts.",
        asset: mainAsset,
      },
      {
        stepNumber: 4,
        title: "Add the Motion Prompt",
        instruction: `Paste the provided motion prompt into the text field: "${motionPrompt.slice(0, 140)}..."`,
        tip: "Describe how elements should move and how the camera should travel rather than re-describing what is already in the image.",
      },
      {
        stepNumber: 5,
        title: "Configure Motion & Camera Settings",
        instruction: isRunway
          ? "Select Camera Control (e.g., Zoom In, Pan Right) or use the Motion Brush to paint specific moving areas."
          : isKling
          ? "Set Camera Movement speed to 2–3 and configure Motion Brush over animated regions."
          : `Set motion strength (recommended: 3–4), duration (5s), and aspect ratio to match the uploaded image.`,
        tip: "Using a moderate motion strength prevents the subject from deforming during animation.",
      },
      {
        stepNumber: 6,
        title: "Generate the Video",
        instruction: `Click 'Generate' to create the animated video from your uploaded ${assetLabel.toLowerCase()}.`,
        tip: "The AI will analyze depth and surface textures in your still image before synthesizing motion.",
      },
      {
        stepNumber: 7,
        title: "Review Subject & Camera Movement",
        instruction:
          "Inspect the video playback. Confirm that the main subject remains sharp and that the camera moves naturally.",
        tip: "Check that edges between foreground and background do not stretch or warp unnaturally.",
      },
      {
        stepNumber: 8,
        title: "Refine & Export Final Video",
        instruction:
          `If satisfied, click 'Download' to save the MP4. If adjustments are needed, tweak motion intensity and re-generate.`,
        tip: "Export at native resolution (1080p) for clean integration into your project timeline.",
      },
    ];
  }

  // ==========================================================================
  // 3. START FRAME → END FRAME WORKFLOW
  // ==========================================================================
  if (type === "start-end-frame") {
    const startAsset = assets.find((a) => a.type === "start-frame") || assets[0];
    const endAsset = assets.find((a) => a.type === "end-frame") || assets[1];

    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and access the advanced video generation interface.`,
        tip: isRunway
          ? "Runway Gen-3 Keyframes mode supports precise Start and End frame anchoring."
          : isLuma
          ? "Luma Dream Machine natively supports Start and End keyframes."
          : isKling
          ? "Kling AI provides dedicated 'Start Frame' and 'End Frame' upload inputs."
          : `${toolDisplay} supports keyframe interpolation between two images.`,
      },
      {
        stepNumber: 2,
        title: "Select Start & End Frame Mode",
        instruction: isRunway
          ? "In Gen-3 Image-to-Video, click 'Keyframes' and enable both 'First Frame' and 'Last Frame' slots."
          : isKling
          ? "In the Image-to-Video tab, upload your first image and click 'Add End Frame' to reveal the second slot."
          : isLuma
          ? "In the Dream Machine bar, attach the first image into 'Start' and the second into 'End'."
          : `Select the Start Frame → End Frame or Keyframe interpolation feature in ${toolDisplay}.`,
        tip: "This workflow tells the AI exactly where the camera and scene must begin and end.",
      },
      {
        stepNumber: 3,
        title: "Upload the Start Image (First Frame)",
        instruction: "Upload the starting image provided with this tutorial into the first frame slot.",
        tip: "This image defines the initial composition, camera angle, and lighting state.",
        asset: startAsset,
      },
      {
        stepNumber: 4,
        title: "Upload the End Image (Final State)",
        instruction: "Upload the ending image provided with this tutorial into the last frame slot.",
        tip: "This image represents the final destination state that the AI must smoothly transition toward.",
        asset: endAsset,
      },
      {
        stepNumber: 5,
        title: "Add Transition Motion Prompt",
        instruction: `Paste the transition prompt: "Smooth cinematic transition between start and end states with natural camera movement."`,
        tip: "Describe the nature of the transformation (e.g., 'liquid flows smoothly into glass', 'camera glides from left to right').",
      },
      {
        stepNumber: 6,
        title: "Configure Duration & Transition Pacing",
        instruction: "Set Duration to 5s or 10s and select a smooth linear or ease-in-out transition curve if available.",
        tip: "A 5-second duration is ideal for product transformations; 10 seconds is best for scenic landscape shifts.",
      },
      {
        stepNumber: 7,
        title: "Generate Keyframe Interpolation",
        instruction: `Click 'Generate' in ${toolDisplay} to render the seamless transition between the two frames.`,
        tip: "The diffusion model calculates intermediate vector paths between corresponding elements in both images.",
      },
      {
        stepNumber: 8,
        title: "Review the Transition Coherence",
        instruction:
          "Play the video at full speed and in slow motion. Verify that the transition feels fluid and that objects do not dissolve into artifacts.",
        tip: "Pay close attention to the midpoint (around 2.5s) where the AI bridges the two images.",
      },
      {
        stepNumber: 9,
        title: "Refine Transition Dynamics",
        instruction:
          "If the transformation appears too abrupt, adjust the transition prompt to describe intermediate milestones or adjust motion strength.",
        tip: "Adding 'seamless continuous camera glide' helps stabilize the camera across the transition.",
      },
      {
        stepNumber: 10,
        title: "Save the Final Video",
        instruction: `Export the final interpolated MP4 video from ${toolDisplay} to your local device.`,
        tip: "Download in full resolution (1080p or 4K) for zero compression loss.",
      },
    ];
  }

  // ==========================================================================
  // 4. PRODUCT IMAGE → PRODUCT VIDEO WORKFLOW
  // ==========================================================================
  if (type === "product-image-to-video") {
    const productAsset = assets.find((a) => a.type === "product-image") || assets[0];

    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and access the video creation canvas.`,
        tip: isRunway
          ? "Runway Gen-3 Alpha excels at preserving product packaging and specular highlights."
          : isKling
          ? "Kling AI Professional Mode delivers ultra-sharp commercial product textures."
          : `${toolDisplay} will create a commercial video from your product photo.`,
      },
      {
        stepNumber: 2,
        title: "Select Image-to-Video Mode",
        instruction: `Navigate to the 'Image to Video' feature in ${toolDisplay}.`,
        tip: "Starting from a clean product photograph ensures the product's geometry and branding are anchored.",
      },
      {
        stepNumber: 3,
        title: "Upload Product Image",
        instruction: "Upload the high-resolution product image provided with this tutorial as the main video input.",
        tip: "The product should be cleanly isolated on its pedestal with clear label visibility.",
        asset: productAsset,
      },
      {
        stepNumber: 4,
        title: "Add Product Motion Prompt",
        instruction: `Paste the commercial product motion prompt: "${motionPrompt.slice(0, 140)}..."`,
        tip: "Explicitly request camera movements such as: 'Slow 360 orbit around the product, warm studio lighting, maintain exact label and packaging.'",
      },
      {
        stepNumber: 5,
        title: "Configure Aspect Ratio & Motion Controls",
        instruction: isRunway
          ? "Set Camera Control to 'Orbit' or 'Horizontal Pan' (Speed 2), and use Motion Brush to keep the product label static while background moves."
          : isKling
          ? "Set Camera Movement to subtle Horizontal Pan (Speed 2), and set Motion Brush over background light rays."
          : `Set Aspect Ratio (16:9 for landscape or 9:16 for Reels/TikTok) and set motion intensity to a low value (2–3).`,
        tip: "Lower motion values (2–3) preserve fine typography on bottles, boxes, and candle jars.",
      },
      {
        stepNumber: 6,
        title: "Generate Product Video",
        instruction: `Click 'Generate' to render your cinematic product commercial in ${toolDisplay}.`,
        tip: "The engine will calculate 3D reflections across glass, stone, and metallic surfaces.",
      },
      {
        stepNumber: 7,
        title: "Check Product Consistency Checklist",
        instruction:
          "Carefully inspect the generated video against the checklist: 1) Logo fidelity, 2) Packaging shape, 3) Brand colors, 4) Label text readability, 5) Proportions.",
        tip: "If the product shape warps during camera rotation, reduce camera speed or use Motion Brush to anchor the product body.",
      },
      {
        stepNumber: 8,
        title: "Refine with Motion Brush if Needed",
        instruction:
          "If label text drifts, paint over the product with the Motion Brush, set its motion to 0 (pinned), and only animate the ambient lighting.",
        tip: "Pinning the product while moving the lighting creates a luxury commercial gleam effect.",
      },
      {
        stepNumber: 9,
        title: "Export Commercial-Ready Video",
        instruction: `Download the final product commercial in 1080p or 4K resolution at 24fps from ${toolDisplay}.`,
        tip: "The video is ready for immediate deployment on Shopify storefronts, Instagram Reels, and YouTube ads.",
      },
    ];
  }

  // ==========================================================================
  // 5. CHARACTER REFERENCE → VIDEO WORKFLOW
  // ==========================================================================
  if (type === "character-reference") {
    const charAsset = assets.find((a) => a.type === "character-reference") || assets[0];

    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and navigate to the video generation studio.`,
        tip: isRunway
          ? "Runway Gen-3 with Act-One or Character Reference preserves facial performance and attire."
          : `${toolDisplay} will use your reference image to maintain character identity.`,
      },
      {
        stepNumber: 2,
        title: "Select Character / Image Mode",
        instruction: `Select 'Image to Video' or the dedicated 'Character Reference' mode in ${toolDisplay}.`,
        tip: "Character reference mode anchors facial features, hair, and clothing across all generated frames.",
      },
      {
        stepNumber: 3,
        title: "Upload Character Reference Image",
        instruction: "Upload the provided character image into the reference input slot.",
        tip: "Use an image with clear front-facing lighting and distinct facial features for maximum identity lock.",
        asset: charAsset,
      },
      {
        stepNumber: 4,
        title: "Add Scene & Motion Prompt",
        instruction: `Enter the scene action prompt describing what the character does: "${motionPrompt.slice(0, 140)}..."`,
        tip: "Focus on actions and camera motion (e.g., 'character strides forward confidently, coat billows subtly, camera tracks backwards').",
      },
      {
        stepNumber: 5,
        title: "Configure Character Consistency Settings",
        instruction: "Set identity weight to high (0.8–0.9), motion intensity to 4, and select your camera direction.",
        tip: "Avoid setting motion intensity too high, which can cause facial expressions to distort.",
      },
      {
        stepNumber: 6,
        title: "Generate the Character Video",
        instruction: `Click 'Generate' to synthesize the sequence featuring your character in ${toolDisplay}.`,
        tip: "The AI maps the reference identity onto the dynamic skeletal movement of the prompt.",
      },
      {
        stepNumber: 7,
        title: "Review Character Consistency",
        instruction:
          "Scrub through the video frame-by-frame. Verify that the character's facial features, eye color, hairstyle, and outfit remain consistent throughout.",
        tip: "Ensure hands and clothing folds maintain natural anatomy during movement.",
      },
      {
        stepNumber: 8,
        title: "Refine & Export Final Video",
        instruction: `Tweak the motion cadence if needed and download the final high-definition video from ${toolDisplay}.`,
        tip: "Export at 1080p/24fps for cinematic realism.",
      },
    ];
  }

  // ==========================================================================
  // 6. MULTIPLE IMAGES → VIDEO WORKFLOW
  // ==========================================================================
  if (type === "multiple-images" || type === "multiple-references") {
    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and access the multi-asset or storyboard video interface.`,
        tip: `Ensure ${toolDisplay} supports multiple image inputs for composite scene generation.`,
      },
      {
        stepNumber: 2,
        title: "Select Multi-Image Video Workflow",
        instruction: `Select the multi-reference or composite video creation mode in ${toolDisplay}.`,
        tip: "This allows you to separate the subject, environment, and style into distinct visual inputs.",
      },
      {
        stepNumber: 3,
        title: "Upload Required Images",
        instruction: `Upload each required image provided with this tutorial: 1) Subject/Product image, 2) Environment/Background image, 3) Style reference.`,
        tip: "Clearly label each image to ensure it is mapped to the correct slot in the tool.",
      },
      {
        stepNumber: 4,
        title: "Assign Image Roles & Slots",
        instruction: "Assign Image 1 to 'Subject / Foreground', Image 2 to 'Background / Environment', and Image 3 to 'Style'.",
        tip: "Role assignment guides the AI on how to composite elements in 3D space.",
      },
      {
        stepNumber: 5,
        title: "Enter the Motion Prompt",
        instruction: `Paste the composite motion prompt describing how the elements interact: "${motionPrompt.slice(0, 140)}..."`,
        tip: "Describe camera navigation through the environment around the subject.",
      },
      {
        stepNumber: 6,
        title: "Configure Scene & Camera Settings",
        instruction: "Set Aspect Ratio, Duration (5s or 10s), and depth-of-field parameters.",
        tip: "Choose a smooth tracking or crane shot to showcase the depth between subject and background.",
      },
      {
        stepNumber: 7,
        title: "Generate Composite Video",
        instruction: `Click 'Generate' to synthesize the multi-image video in ${toolDisplay}.`,
        tip: "The model will blend the lighting of the environment onto the surfaces of the subject.",
      },
      {
        stepNumber: 8,
        title: "Review Multi-Asset Integration",
        instruction:
          "Check contact shadows, lighting consistency, and edge blending between the subject and the environment.",
        tip: "Look for natural ambient light bounce from the background onto the foreground object.",
      },
      {
        stepNumber: 9,
        title: "Refine & Re-roll",
        instruction: "Adjust role weights or refine lighting keywords in the prompt to perfect the composite.",
        tip: "Increasing environment weight helps harmonize the overall color grading.",
      },
      {
        stepNumber: 10,
        title: "Export Final Video",
        instruction: `Download the completed composite video in full resolution from ${toolDisplay}.`,
        tip: "Save the project file or seed number for future extensions.",
      },
    ];
  }

  // ==========================================================================
  // 7. EXISTING VIDEO → AI VIDEO EDITING / VIDEO-TO-VIDEO
  // ==========================================================================
  if (type === "video-to-video") {
    const videoAsset = assets.find((a) => a.type === "source-video") || assets[0];

    return [
      {
        stepNumber: 1,
        title: `Open ${toolDisplay}`,
        instruction: `Open ${toolDisplay} and access the AI Video Editing / Video-to-Video workspace.`,
        tip: isRunway
          ? "Runway Gen-1 and Gen-3 Video-to-Video allow full stylistic and background replacement."
          : `${toolDisplay} will transform your source video footage with AI styling.`,
      },
      {
        stepNumber: 2,
        title: "Select Video-to-Video Mode",
        instruction: `Click 'Video to Video' or 'Edit Video' in the ${toolDisplay} dashboard.`,
        tip: "Video-to-video takes existing camera motion and body physics, applying new styles or environments.",
      },
      {
        stepNumber: 3,
        title: "Upload the Source Video",
        instruction: "Upload the source MP4 video file provided with this tutorial into the input slot.",
        tip: "Trim the clip to the exact 5–10 second segment you wish to transform.",
        asset: videoAsset,
      },
      {
        stepNumber: 4,
        title: "Describe Desired Changes",
        instruction: `Enter the transformation prompt: "${motionPrompt.slice(0, 140)}..."`,
        tip: "Example: 'Replace the background with a luxury Scandinavian interior while keeping the subject and motion unchanged.'",
      },
      {
        stepNumber: 5,
        title: "Configure Transformation Strength",
        instruction: "Set Motion Weight / Structural Weight to 0.7–0.8 to preserve original movement while applying the new aesthetic.",
        tip: "A higher structural weight prevents the original motion from jittering or morphing.",
      },
      {
        stepNumber: 6,
        title: "Generate / Process Video",
        instruction: `Click 'Generate' or 'Process' in ${toolDisplay} to render the restyled video.`,
        tip: "The diffusion model processes frame-by-frame optical flow to ensure temporal coherence.",
      },
      {
        stepNumber: 7,
        title: "Review Temporal Consistency",
        instruction:
          "Play the video at normal speed. Check that the new style remains stable without flickering across frame transitions.",
        tip: "Verify that edges around the subject track smoothly against the new environment.",
      },
      {
        stepNumber: 8,
        title: "Refine & Export Final Video",
        instruction: `If satisfied, click 'Download' to save your transformed video in 1080p MP4 format.`,
        tip: "Export with the original audio track preserved if applicable.",
      },
    ];
  }

  // ==========================================================================
  // 8. IMAGE + TEXT / REFERENCE IMAGE → VIDEO (Default Image Variant)
  // ==========================================================================
  const refAsset = assets[0];
  return [
    {
      stepNumber: 1,
      title: `Open ${toolDisplay}`,
      instruction: `Open ${toolDisplay} in your browser and sign into your account.`,
      tip: `Ensure ${toolDisplay} is updated to the latest model version for optimal video generation.`,
    },
    {
      stepNumber: 2,
      title: "Select Image-to-Video Workflow",
      instruction: `Select the 'Image to Video' or 'Text + Image' generation mode in ${toolDisplay}.`,
      tip: "This mode pairs a visual reference image with descriptive motion instructions.",
    },
    {
      stepNumber: 3,
      title: "Upload Reference Image",
      instruction: "Upload the reference image provided with this tutorial to guide the scene's visual appearance.",
      tip: "This image anchors lighting, color palette, and textures without restricting camera movement.",
      asset: refAsset,
    },
    {
      stepNumber: 4,
      title: "Enter Scene & Motion Prompt",
      instruction: `Paste the motion prompt into the prompt field: "${motionPrompt.slice(0, 140)}..."`,
      tip: "Describe what should happen to the image rather than re-describing the static picture.",
    },
    {
      stepNumber: 5,
      title: "Configure Camera & Duration Settings",
      instruction: "Set Duration to 5s, Aspect Ratio to 16:9, and configure camera motion (Smooth Pan / Orbit).",
      tip: "Keep camera speed at moderate levels to ensure natural cinematic pacing.",
    },
    {
      stepNumber: 6,
      title: "Generate Video",
      instruction: `Click 'Generate' in ${toolDisplay} to render the video sequence.`,
      tip: "Wait for the rendering queue to complete the generation process.",
    },
    {
      stepNumber: 7,
      title: "Review the Result",
      instruction:
        "Watch the generated video and compare the motion, subject consistency, and lighting with the reference preview.",
      tip: "Check for fluid motion and physical plausibility in environmental elements.",
    },
    {
      stepNumber: 8,
      title: "Refine & Export Final Video",
      instruction: `Tweak the motion prompt or camera direction if needed, then click 'Download' to save the finished MP4 video.`,
      tip: "Save in 1080p resolution at 24fps for production use.",
    },
  ];
}
