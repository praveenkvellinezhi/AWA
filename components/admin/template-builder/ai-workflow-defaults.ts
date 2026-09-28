import {
  StepAiWorkflowConfig,
  StepGenerationType,
  VideoGenerationMethod,
  ImageGenerationMethod,
  StepOutputConfig,
  StepMotionInstructions,
  StepSettings,
  StepInputAsset,
  StepReferenceImage,
  StepStoryboardImage,
} from "@/lib/types";

export const AI_VIDEO_TOOLS = [
  "Kling",
  "Runway Gen-3",
  "Luma Dream Machine",
  "Veo",
  "Pika 2.0",
  "Sora",
  "Hailuo (Minimax)",
  "Haiper AI",
  "AnimateDiff",
];

export const AI_IMAGE_TOOLS = [
  "Midjourney v6.1",
  "FLUX.1 [dev]",
  "FLUX.1 [pro]",
  "Stable Diffusion 3.5",
  "DALL-E 3",
  "Ideogram 2.0",
  "Recraft V3",
  "Google Imagen 3",
];

export const VIDEO_METHODS: { id: VideoGenerationMethod; label: string; badge: string; description: string }[] = [
  {
    id: "text-to-video",
    label: "Text to Video",
    badge: "Text → Video",
    description: "Generate video purely from a descriptive prompt, camera directives, and cinematic settings.",
  },
  {
    id: "image-to-video",
    label: "Image to Video",
    badge: "Image → Video",
    description: "Animate an existing or previously generated still image using motion controls and physics prompts.",
  },
  {
    id: "reference-image-to-video",
    label: "Reference Image to Video",
    badge: "Ref Image → Video",
    description: "Guide video generation using reference images for character, environment, or style fidelity.",
  },
  {
    id: "multiple-images-to-video",
    label: "Multiple Images to Video",
    badge: "Multi Image → Video",
    description: "Chain opening, middle, and ending keyframes with storyboard transitions and pacing.",
  },
  {
    id: "video-to-video",
    label: "Video to Video",
    badge: "Video → Video",
    description: "Restyle or transform an existing source video (clothing, environment, cinematic look, animation).",
  },
  {
    id: "text-image-to-video",
    label: "Text + Image to Video",
    badge: "Text + Image → Video",
    description: "Synthesize both an input hero image and an explicit descriptive prompt simultaneously.",
  },
  {
    id: "text-reference-images-to-video",
    label: "Text + Reference Images to Video",
    badge: "Text + Multi Ref → Video",
    description: "Combine a narrative prompt with multiple role-assigned reference images (character, lighting, scene).",
  },
];

export const IMAGE_METHODS: { id: ImageGenerationMethod; label: string; badge: string; description: string }[] = [
  {
    id: "text-to-image",
    label: "Text to Image",
    badge: "Text → Image",
    description: "Generate high-resolution still imagery directly from text descriptions and camera specs.",
  },
  {
    id: "image-to-image",
    label: "Image to Image",
    badge: "Image → Image",
    description: "Restyle, evolve, or vary an existing source image with transformation strength controls.",
  },
  {
    id: "reference-image-to-image",
    label: "Reference Image to Image",
    badge: "Ref → Image",
    description: "Transfer character identity, environment, or composition from a reference benchmark.",
  },
  {
    id: "multiple-reference-images",
    label: "Multiple Reference Images",
    badge: "Multi Ref → Image",
    description: "Synthesize multiple distinct references (e.g. character + environment + product).",
  },
  {
    id: "text-reference-image",
    label: "Text + Reference Image",
    badge: "Text + Ref → Image",
    description: "Guide text generation with specific reference constraints.",
  },
];

export const REFERENCE_PURPOSES = [
  { value: "character", label: "Character Reference", helper: "Preserve subject facial features, hairstyle, body, and wardrobe." },
  { value: "environment", label: "Environment Reference", helper: "Anchor the spatial setting, background architecture, and atmosphere." },
  { value: "style", label: "Style Reference", helper: "Transfer color palette, film grain, lighting aesthetic, or artistic medium." },
  { value: "product", label: "Product Reference", helper: "Maintain exact packaging, brand emblems, and product geometry." },
  { value: "composition", label: "Composition Reference", helper: "Guide spatial layout, camera perspective, framing, and golden ratio balance." },
  { value: "pose", label: "Pose Reference", helper: "Replicate exact body posture, gesture, head tilt, and physical stance." },
  { value: "lighting", label: "Lighting Reference", helper: "Match directional key lights, fill shadows, rim glow, and color temperature." },
  { value: "other", label: "Custom Reference", helper: "Specific contextual guideline reference." },
];

export const IMAGE_USAGES = [
  { value: "starting-frame", label: "Starting Frame", helper: "First frame the video animates from." },
  { value: "ending-frame", label: "Ending Frame", helper: "Final target frame the video transitions into." },
  { value: "character-reference", label: "Character Reference", helper: "Keep the person/avatar consistent throughout the motion." },
  { value: "scene-reference", label: "Scene Reference", helper: "Maintain environmental background and spatial context." },
  { value: "composition-reference", label: "Composition Reference", helper: "Preserve the camera angle, framing, and rule of thirds." },
  { value: "source-video", label: "Source Video", helper: "Primary footage to restyle or transform." },
  { value: "style-reference", label: "Style Reference", helper: "Transfer visual grade, grading, and textures." },
];

export const TRANSFORMATION_OPTIONS = [
  "Change visual style (e.g. Photorealistic to Anime / 3D)",
  "Change environment & lighting",
  "Maintain character appearance & identity",
  "Change wardrobe / clothing / accessories",
  "Cinematic 35mm film transformation",
  "Stylized 3D clay / stop-motion animation",
];

export function getDefaultInstructionsForVideoMethod(method: VideoGenerationMethod, toolName: string = "AI Video Tool"): string[] {
  switch (method) {
    case "text-to-video":
      return [
        `Open the selected AI video tool (${toolName}).`,
        "Select Text-to-Video generation mode.",
        "Enter the provided prompt into the prompt box.",
        "Configure the recommended settings (aspect ratio, duration, motion strength).",
        "Generate multiple variations (3-4 renders).",
        "Compare the results for temporal coherence and artifact-free physics.",
        "Select and download the final video.",
      ];
    case "image-to-video":
      return [
        "Take the specified input image asset.",
        `Upload it to ${toolName} and select Image-to-Video mode.`,
        "Paste the provided video motion prompt.",
        "Configure the motion sliders and camera movement settings.",
        "Generate 2-3 variations to find the smoothest movement dynamics.",
        "Select the strongest result with natural physics.",
        "Export the video and prepare it for the next workflow step.",
      ];
    case "reference-image-to-video":
      return [
        `Open ${toolName} and enable Multi-Reference / Character Consistency mode.`,
        "Upload Reference Image 01 assigned as Character Reference.",
        "Upload Reference Image 02 assigned as Environment Reference.",
        "Enter the descriptive video prompt describing the action and scene.",
        "Configure duration, camera movement, and consistency weight.",
        "Generate test batches to verify reference preservation.",
        "Select the output with highest visual fidelity to all references.",
      ];
    case "multiple-images-to-video":
      return [
        "Upload Image 01 as the opening scene keyframe.",
        "Upload Image 02 as the middle scene transition keyframe.",
        "Upload Image 03 as the ending scene keyframe.",
        "Arrange them in sequential order in the storyboard editor.",
        "Enter the video prompt describing transition flow and camera travel.",
        "Configure duration per image and transition smoothness.",
        "Generate video and review continuity between shots.",
        "Export the seamless final multi-frame video.",
      ];
    case "video-to-video":
      return [
        "Upload the source video asset into the tool.",
        "Attach the reference / style image (if specified) to guide aesthetic transfer.",
        "Select Video-to-Video / Stylize mode.",
        "Enter the transformation prompt specifying the target aesthetic.",
        "Configure transformation strength (balance between original motion and new style).",
        "Generate preview render and inspect temporal consistency.",
        "Export the finalized transformed video.",
      ];
    case "text-image-to-video":
      return [
        "Upload the designated hero image asset into the tool.",
        "Select Image-to-Video mode.",
        "Enter the accompanying descriptive text prompt in conjunction with the image.",
        "Configure camera movement and subject action constraints.",
        "Generate variations observing how text and image combine.",
        "Select the best result and download the output asset.",
      ];
    case "text-reference-images-to-video":
      return [
        "Upload all provided reference images to their respective reference slots.",
        "Assign the purpose for each reference (character, environment, style).",
        "Enter the detailed text prompt referencing the assigned elements.",
        "Configure cinematic motion, frame rate, and aspect ratio.",
        "Generate variations and evaluate character and environment preservation.",
        "Select the final video render for handoff to the next step.",
      ];
    default:
      return [
        `Open ${toolName}.`,
        "Configure inputs and settings.",
        "Generate asset variations.",
        "Export final result.",
      ];
  }
}

export function getDefaultInstructionsForImageMethod(method: ImageGenerationMethod, toolName: string = "AI Image Tool"): string[] {
  switch (method) {
    case "text-to-image":
      return [
        `Open ${toolName}.`,
        "Select Text-to-Image mode.",
        "Enter the provided prompt with all camera, lighting, and styling parameters.",
        "Set aspect ratio, resolution, and stylistic model version.",
        "Generate 4 variations.",
        "Select and upscale the strongest variation.",
      ];
    case "image-to-image":
      return [
        "Upload the source image asset.",
        "Set Image-to-Image transformation strength (0.5 - 0.7 recommended).",
        "Enter the prompt describing the desired modifications.",
        "Generate variations and evaluate fidelity to original structure.",
        "Upscale and save the final modified image.",
      ];
    case "reference-image-to-image":
    case "multiple-reference-images":
    case "text-reference-image":
      return [
        "Upload reference image(s) to the assigned reference parameters.",
        "Set reference weights and purpose roles (character, style, composition).",
        "Enter the descriptive prompt specifying the scene action.",
        "Generate variations ensuring identity and lighting continuity.",
        "Select the final benchmark render.",
      ];
    default:
      return [
        `Open ${toolName}.`,
        "Enter prompt and parameters.",
        "Generate and select the best result.",
      ];
  }
}

export function createInitialAiWorkflow(
  generationType: StepGenerationType = "normal",
  stepNumber: number = 1
): StepAiWorkflowConfig {
  const stepNumStr = stepNumber.toString().padStart(2, "0");
  const nextNumStr = (stepNumber + 1).toString().padStart(2, "0");

  if (generationType === "normal") {
    return {
      generationType: "normal",
      expectedOutput: `Deliverable established for Step ${stepNumStr}`,
    };
  }

  if (generationType === "video") {
    const videoMethod: VideoGenerationMethod = "text-to-video";
    return {
      generationType: "video",
      videoMethod,
      aiTool: "Kling",
      prompt: "Cinematic shot of subject moving naturally, golden hour atmospheric haze, 35mm anamorphic lens, slow camera push-in, 8K UHD filmic resolution.",
      negativePrompt: "low quality, distorted face, jerky motion, morphing, flickering, blurry, watermark",
      motion: {
        cameraMovement: "Slow push-in toward subject",
        subjectMovement: "Natural subtle movement and posture shift",
        objectMovement: "Realistic physical weight and momentum",
        environmentalMovement: "Gentle breeze through foliage and ambient dust particles",
      },
      settings: {
        duration: "5 sec",
        aspectRatio: "16:9",
        resolution: "1080p",
        cameraMovement: "Slow push-in",
        motionStrength: "5",
        style: "Cinematic Photorealistic",
      },
      generationInstructions: getDefaultInstructionsForVideoMethod(videoMethod, "Kling"),
      output: {
        type: "video",
        format: "MP4",
        name: `scene-${stepNumStr}-video.mp4`,
        usage: `Download the selected video as MP4 and use it as the visual background in Step ${nextNumStr}.`,
        nextStepNumber: stepNumber + 1,
      },
    };
  }

  // Image Generation
  const imageMethod: ImageGenerationMethod = "text-to-image";
  return {
    generationType: "image",
    imageMethod,
    aiTool: "Midjourney v6.1",
    prompt: "Editorial portrait photograph, natural soft studio lighting, Hasselblad 80mm lens, f/2.8, shallow depth of field, authentic skin texture, neutral beige backdrop, 8K resolution.",
    negativePrompt: "plastic skin, extra fingers, cartoonish, oversaturated, deformed",
    settings: {
      aspectRatio: "16:9",
      resolution: "4K UHD",
      style: "Editorial Photorealism",
      quality: "High",
    },
    generationInstructions: getDefaultInstructionsForImageMethod(imageMethod, "Midjourney v6.1"),
    output: {
      type: "image",
      format: "PNG",
      name: `hero-${stepNumStr}-image.png`,
      usage: `Save this image in lossless PNG and use it as the starting frame in Step ${nextNumStr}.`,
      nextStepNumber: stepNumber + 1,
    },
  };
}
