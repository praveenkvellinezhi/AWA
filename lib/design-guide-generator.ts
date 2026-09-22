import {
  DesignWorkflowConfig,
  DesignGenerationType,
  DesignAsset,
  UsageStep,
  Template,
} from "./types";

/**
 * Checks if a given template is an AI Poster or Graphic Design tutorial.
 */
export function isDesignGenerationTemplate(template: Template): boolean {
  if (template.designWorkflow) return true;

  const catId = (template.categoryId || "").toLowerCase();
  const catName = (template.categoryName || "").toLowerCase();
  const subcatId = (template.subcategoryId || "").toLowerCase();
  const subcatName = (template.subcategoryName || "").toLowerCase();
  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();

  // Exclude templates that are explicitly other generators unless they are posters
  if (
    template.videoWorkflow ||
    template.websiteWorkflow ||
    template.presentationWorkflow
  ) {
    return false;
  }

  // Category matching
  if (
    catId === "cat-poster-design" ||
    catName.includes("poster") ||
    catName.includes("design") ||
    catName.includes("graphic") ||
    subcatId.includes("poster") ||
    subcatName.includes("events") ||
    subcatName.includes("branding") ||
    subcatName.includes("retro")
  ) {
    return true;
  }

  // Tag matching
  const posterKeywords = [
    "poster",
    "flyer",
    "banner",
    "ad",
    "advertisement",
    "graphic design",
    "social post",
    "instagram",
    "social media",
    "brandboard",
    "brand identity",
    "packaging",
    "swiss style",
    "bauhaus",
    "brutalist",
    "synthwave",
    "event poster",
    "billboard",
    "brochure",
    "album art",
    "cover art",
  ];

  if (tags.some((t) => posterKeywords.some((kw) => t.includes(kw)))) {
    return true;
  }

  // Tool matching
  const designTools = [
    "canva",
    "adobe express",
    "firefly",
    "ideogram",
    "kittl",
    "designer",
    "microsoft designer",
  ];

  const hasDesignTool = (template.recommendedTools || []).some((tool) =>
    designTools.some((dt) => tool.toolName.toLowerCase().includes(dt))
  );
  if (hasDesignTool) return true;

  // Name / description matching
  if (
    name.includes("poster") ||
    name.includes("flyer") ||
    name.includes("banner") ||
    name.includes("graphic design") ||
    name.includes("brandboard") ||
    name.includes("advertisement") ||
    desc.includes("poster") ||
    desc.includes("flyer") ||
    desc.includes("banner") ||
    desc.includes("graphic design")
  ) {
    return true;
  }

  return false;
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
  const tName = toolName.toLowerCase();
  const genType = workflow.generationType;
  const prompt = context?.promptText || workflow.prompt || "";
  const formatStr = workflow.format || "A4 Poster (210 × 297 mm)";
  const designType = workflow.designType || "Graphic Design";

  // 1. CANVA MAGIC STUDIO
  if (tName.includes("canva")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Canva & Select Design Format",
        instruction: `Open Canva and click 'Create a design'. Select the '${formatStr}' preset or input custom dimensions matching your project requirements.`,
        tip: "Setting the exact canvas dimensions before generating ensures typography and card grids scale proportionally without awkward cropping.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Upload Required Assets to Canva",
        instruction: `Navigate to the 'Uploads' tab on the left sidebar. Upload the required tutorial assets: ${workflow.assets.map((a) => a.label).join(", ")}.`,
        tip: "For logos and cutouts, upload transparent PNG or SVG files to allow smooth compositing over gradient and photo backgrounds.",
      });
    }

    if (workflow.brandAssets) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Activate Brand Kit Tokens",
        instruction: "Open the 'Brand' sidebar in Canva. Ensure your official brand color palette, heading/body font pairings, and vector logo lockups are loaded.",
        tip: "Canva's Brand Kit automatically enforces high-contrast pairings and locks brand guidelines across all generated elements.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Enter Design Prompt in Magic Design",
      instruction: `Select 'Magic Design' or the Canva AI Assistant bar. Enter the prompt describing the ${designType}, visual style (${context?.style || "Modern"}), and mood (${context?.mood || "Impactful"}):`,
      examplePrompt: prompt,
      tip: "Include explicit layout instructions such as 'centered hero graphic, bold sans-serif headline, minimal whitespace, high-contrast palette'.",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Generate & Select Best Layout Composition",
      instruction: "Review the AI-generated layout variations. Select the composition with the strongest visual hierarchy, clear focal point, and balanced spacing.",
      tip: "Click through 3–5 style variations. Look for designs where the primary message instantly catches the eye within 1.5 seconds.",
    });

    if (workflow.requiresProductAccuracyCheck) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Check Product Accuracy & Lighting",
        instruction: "Audit the product image on the canvas. Ensure the physical product silhouette, packaging typography, and brand colors have not been warped or distorted.",
        tip: "Use Canva's 'Edit photo' → 'Shadows' tool to cast realistic drop shadows or ambient floor contact shadows under the product.",
      });
    }

    if (workflow.requiresBrandCheck) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Audit Brand Consistency",
        instruction: "Verify that the company logo adheres to clearspace guidelines (minimum 24px padding), colors match exact brand hex codes, and typography matches the brand kit.",
        tip: "Click 'Shuffle' in the Brand Kit palette section to cycle through approved brand color arrangements on the active layout.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Refine Typography & Element Spacing",
      instruction: "Fine-tune font sizes, letter spacing (tracking), and line height. Align text elements to the visual grid using Canva's smart alignment guides (snapping).",
      tip: "Keep headlines under 7 words. Group supporting copy with generous whitespace to prevent visual crowding.",
    });

    if (workflow.requiresTextVerification) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify All Text & Details",
        instruction: "Carefully inspect every word, date, price, phone number, address, URL, and call-to-action (CTA). AI generation can introduce spelling errors and placeholder text.",
        tip: "Read phone numbers and dates out loud backward to catch subtle transposition mistakes that spell-checkers miss.",
      });
    }

    if (workflow.requiresMultiFormatResize && workflow.multiFormats && workflow.multiFormats.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Resize for Additional Formats via Magic Switch",
        instruction: `Click 'Magic Switch' in the top menu. Select the target campaign formats: ${workflow.multiFormats.join(", ")}. Click 'Continue' → 'Copy & resize'. Reposition elements within the safe zones of each new canvas.`,
        tip: "In 9:16 Story format, keep text and logos at least 150px away from the top and bottom margins to avoid UI overlap from Instagram/TikTok.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Export Final Creative",
      instruction: "Click 'Share' → 'Download'. Select 'PNG' for digital social posts or 'PDF Print' (with 'Crop marks and bleed' checked) for commercial physical printing.",
      tip: "For digital ads, export at 2x resolution to ensure crisp rendering on high-DPI Retina and OLED smartphone screens.",
    });

    return steps;
  }

  // 2. ADOBE EXPRESS / ADOBE FIREFLY
  if (tName.includes("adobe") || tName.includes("express") || tName.includes("firefly")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Adobe Express & Set Canvas Dimensions",
        instruction: `Launch Adobe Express. Select 'Create from scratch' and pick the '${formatStr}' preset or enter precise millimeter/pixel specifications.`,
        tip: "Adobe Express provides precise print bleed and pixel-perfect vector alignment grids for professional publishing.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Upload Asset Media",
        instruction: `Import your source assets via the 'Media' panel: ${workflow.assets.map((a) => a.label).join(", ")}.`,
        tip: "Use Adobe Express's integrated 'Remove Background' quick action to instantly extract clean product cutouts.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Input Generative Prompt with Firefly Engine",
      instruction: `Select 'Text to Image' or 'Generate Template' powered by Adobe Firefly. Enter the prompt specifying composition, lighting, and mood (${context?.mood || "Commercial Premium"}):`,
      examplePrompt: prompt,
      tip: "Firefly supports Structure Reference and Style Reference sliders to guide artistic composition without copying copyrighted pixels.",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Review & Select Generative Layouts",
      instruction: "Inspect the 4 Firefly layout variations. Choose the visual direction with the strongest subject framing and natural negative space for headline copy.",
      tip: "Click 'Similar' on your favorite result to generate 3 refined iterations with the same color harmony and texture.",
    });

    if (workflow.requiresProductAccuracyCheck) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Product Integrity",
        instruction: "Inspect the product layer. Ensure Firefly generative fills have not modified your product's real-world geometry, branding, or color fidelity.",
        tip: "Keep the original product image on a locked top layer while generating background elements underneath.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Apply Adobe Fonts & Vector Hierarchy",
      instruction: "Browse the curated Adobe Fonts library to pair high-contrast display typography with neutral grotesque body copy. Apply text effects like curved path or drop shadow.",
      tip: "Limit the design to 2 typeface families: one expressive display font for headlines, and one clean geometric sans for secondary information.",
    });

    if (workflow.requiresTextVerification) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify All Text & Copy Details",
        instruction: "Carefully check headline spelling, event dates, pricing, contact numbers, and website links. Replace any placeholder filler text with finalized copy.",
        tip: "Verify that font kerning is balanced on large display letters, especially letter pairs like 'AV', 'WA', and 'To'.",
      });
    }

    if (workflow.requiresMultiFormatResize) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Multi-Format Resize & Safe Margins",
        instruction: "Use the 'Resize' tool to generate alternate aspect ratios (1:1, 9:16, 16:9). Reposition focal subjects and typography within safe margins.",
        tip: "Adobe Express automatically anchors key elements during resize, but manually check that text doesn't touch canvas edges.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Export Final Creative",
      instruction: "Click 'Download' in the top-right corner. Choose PNG / JPG for digital screens or PDF (with CMYK color conversion) for print shops.",
      tip: "Adobe Express lets you schedule social posts directly to Instagram, Facebook, and LinkedIn via Content Scheduler.",
    });

    return steps;
  }

  // 3. IDEOGRAM
  if (tName.includes("ideogram")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Ideogram & Configure Canvas Ratio",
        instruction: "Sign in to Ideogram.ai. In the aspect ratio selector, pick the target ratio (e.g., 10:16 for vertical posters, 1:1 for social posts, or 16:9 for landscape banners).",
        tip: "Ideogram specializes in rendering coherent, legible typography directly inside generative images without post-processing.",
      },
      {
        stepNumber: 2,
        title: "Activate Typography & Poster Style Tags",
        instruction: "Enable the 'Typography', 'Poster', and 'Design' style tags beneath the prompt bar. Select your desired color palette preset or specify hex codes.",
        tip: "Activating 'Typography' instructs Ideogram's model to prioritize letterform precision, clean kerning, and crisp text contours.",
      },
      {
        stepNumber: 3,
        title: "Enter Prompt with Quoted Headline Text",
        instruction: "Paste the detailed poster prompt. Enclose all exact words, headlines, and subheadings in quotation marks (e.g. \"FESTIVAL 2026\", \"OCTOBER 24\"): ",
        examplePrompt: prompt,
        tip: "Ideogram recognizes text inside quotes as literal strings to render. Keep quotes concise (1–4 words per line) for optimal legibility.",
      },
      {
        stepNumber: 4,
        title: "Generate Initial 4 Poster Compositions",
        instruction: "Click Generate. Ideogram will render a batch of 4 compositions exploring different typographic layouts, color distributions, and visual treatments.",
        tip: "Examine the 4 thumbnails side-by-side. Zoom in to check letterform sharpness, kerning consistency, and visual balance.",
      },
      {
        stepNumber: 5,
        title: "Verify Lettering & Spelling Accuracy",
        instruction: "Inspect every letter in the generated words. Check for missing glyphs, unintended ligatures, duplicate letters, or blurred text edges.",
        tip: "If a letter is slightly imperfect, use Ideogram's 'Remix' feature with a lower weight to fix specific characters without changing the overall composition.",
      },
      {
        stepNumber: 6,
        title: "Remix or Inpaint for Refined Details",
        instruction: "Click 'Remix' on your favorite result. Adjust the image weight slider (between 40% and 60%) to generate refined variations while locking the layout structure.",
        tip: "Use Inpainting if you need to replace or re-render a specific text block or focal illustration.",
      },
      {
        stepNumber: 7,
        title: "Upscale to High-Resolution Master",
        instruction: "Select the winning poster and click 'Upscale'. This increases resolution to print-grade dimensions and sharpens vector-like contours.",
        tip: "Upscaling removes generative grain and produces crisp 4K-equivalent imagery suitable for physical posters and displays.",
      },
      {
        stepNumber: 8,
        title: "Download Clean PNG Asset",
        instruction: "Download the uncompressed PNG file. If vector text or official vector logos are needed, import into Illustrator/Figma as a background plate.",
        tip: "Ideogram PNGs make outstanding hero artwork for print campaigns, magazine covers, and digital exhibition banners.",
      },
    ];

    return steps;
  }

  // 4. KITTL
  if (tName.includes("kittl")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Kittl & Set Project Dimensions",
        instruction: `Launch Kittl and click 'New Project'. Select '${formatStr}' or specify custom dimensions with 300 DPI resolution enabled.`,
        tip: "Kittl is built for advanced vector typography, badges, textured t-shirt graphics, and commercial poster design.",
      },
      {
        stepNumber: 2,
        title: "Choose Template Base or Blank Canvas",
        instruction: "Choose whether to start from a curated Kittl design template or create from a blank canvas with custom grid guides.",
        tip: "Starting from a Kittl typography template gives you pre-configured text warping curves, drop shadows, and ornamental borders.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Upload Supporting Assets",
        instruction: `Upload your brand assets or product images via the left sidebar: ${workflow.assets.map((a) => a.label).join(", ")}.`,
        tip: "Kittl automatically creates vector clipping masks so you can frame photos inside geometric shapes or typography.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Input AI Text/Layout Prompt in Kittl AI",
      instruction: `Open 'Kittl AI' and input the design concept prompt (${context?.style || "Vintage / Modern"}):`,
      examplePrompt: prompt,
      tip: "Use Kittl AI's 'Quote Generator' to produce complementary catchphrases and badge copy that fit your design theme.",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Apply Advanced Vector Typography & Text Warping",
      instruction: "Select the primary headline. In the text panel, experiment with 'Warp' (Wave, Arc, Rise), 'Transform', 'Extrusion', and 'Inline/Outline' shadow layers.",
      tip: "Stacking a 3D extrusion shadow with a contrasting outline gives headlines immense depth and vintage editorial character.",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Apply Texture Overlays & Color Palette",
      instruction: "Browse the 'Textures' library to add subtle paper fold creases, risograph halftone grain, or vintage dust overlays. Lock the color palette to 3–4 harmonized tones.",
      tip: "Keep texture opacity between 15% and 25% so the artwork feels tactile without muddying headline legibility.",
    });

    if (workflow.requiresTextVerification) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify All Text & Lineup Information",
        instruction: "Audit every text box on the canvas: check festival dates, venue names, ticket links, artist billing order, and fine print.",
        tip: "Ensure small secondary text remains legible against textured backgrounds by increasing font weight or placing a solid pill shape behind it.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Export Print-Ready 300 DPI Asset",
      instruction: "Click 'Export' in the top right. Select 'PDF' (Print Ready 300 DPI) for physical posters or 'PNG' (High-res 2x/3x) for digital channels.",
      tip: "Kittl can export vector SVG files, allowing you to scale typography infinitely without pixelation.",
    });

    return steps;
  }

  // 5. MICROSOFT DESIGNER
  if (tName.includes("designer") || tName.includes("microsoft")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Microsoft Designer & Select Size",
        instruction: `Sign in to Microsoft Designer. Choose '${formatStr}' from the canvas size options or select custom sizing.`,
        tip: "Microsoft Designer uses DALL-E 3 and Copilot to generate layout suggestions, headlines, and matching visual assets simultaneously.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Upload Media Assets",
        instruction: `Click 'My media' and upload your project assets: ${workflow.assets.map((a) => a.label).join(", ")}.`,
        tip: "Use the built-in 'Remove background' tool to separate subjects from unwanted backdrops with one click.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Describe the Design in the Copilot Bar",
      instruction: `Enter the detailed prompt describing your desired poster theme, headline, colors, and layout:`,
      examplePrompt: prompt,
      tip: "Mention the purpose of the poster (e.g. 'Conference announcement poster with bold modern typography and clean gradient background').",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Explore AI Layout Proposals",
      instruction: "Browse the dynamic layout proposals generated by Copilot. Pick the design that offers the cleanest balance of imagery and readability.",
      tip: "Click 'Explore more' if you want variations with different font pairings or color palettes.",
    });

    if (workflow.requiresProductAccuracyCheck) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Inspect Product Geometry",
        instruction: "Verify that your product photo looks natural within the AI composition. Check edge blending, drop shadows, and scale relative to other elements.",
        tip: "Adjust the 'Blur background' slider to keep the focal product razor-sharp while softening busy background elements.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Customize Typography & Accents",
      instruction: "Click on text blocks to adjust font pairings, line spacing, and color contrast. Add graphic shapes, lines, or badge containers to highlight key info.",
      tip: "Ensure the primary headline is the largest element on the canvas, followed by subheadings at roughly 40% of the headline size.",
    });

    if (workflow.requiresTextVerification) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify All Text & Contact Information",
        instruction: "Check all dates, website links, social handles, and promotional discount codes for accuracy.",
        tip: "Double check that numbers and special characters like '@', '#', and '$' render cleanly in your chosen font.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Download & Share",
      instruction: "Click 'Download'. Choose PNG for digital displays or PDF for printing. You can also export as MP4 if your design includes animated text.",
      tip: "Microsoft Designer enables direct sharing to social media or saving to OneDrive for cross-team collaboration.",
    });

    return steps;
  }

  // 6. FIGMA / FIGMA AI
  if (tName.includes("figma")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Figma & Create Frame with Target Dimensions",
        instruction: `Create a new Figma file and press 'F' to insert a Frame. Set the dimensions to '${formatStr}' and configure grid layout columns.`,
        tip: "Using an 8pt or 12-column grid in Figma ensures consistent padding, typography alignment, and responsive scalability.",
      },
      {
        stepNumber: 2,
        title: "Activate Figma AI First Draft",
        instruction: "Launch Figma AI (Cmd/Ctrl + K → 'First Draft'). Input your graphic design prompt specifying the visual layout, typography style, and color variables:",
        examplePrompt: prompt,
        tip: "Figma AI generates editable auto-layout frames with native vector shapes, typography layers, and color styles.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Import Vector Assets & Brand Tokens",
        instruction: `Drag and drop your project assets into the canvas: ${workflow.assets.map((a) => a.label).join(", ")}. Connect color variables to your local design system.`,
        tip: "Use SVG vector logos rather than raster bitmaps to ensure zero loss of fidelity at large physical print scales.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Refine Auto-Layout Grids & Hierarchy",
      instruction: "Adjust auto-layout padding, gap spacing, and vertical alignment. Ensure the headline, visual focal element, and call-to-action follow a clear visual hierarchy.",
      tip: "Set auto-layout containers to 'Fill container' horizontally to make the design responsive across multiple screen dimensions.",
    });

    if (workflow.requiresBrandCheck) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Audit Brand Color & Type Styles",
        instruction: "Check that all fills and typography use official brand tokens. Verify that logo clearspace rules and minimum sizing are respected.",
        tip: "Use Figma's 'Selection colors' panel to batch-replace any rogue hex colors with official design system tokens in one click.",
      });
    }

    if (workflow.requiresTextVerification) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify All Text & Copy Elements",
        instruction: "Audit headline text, dates, prices, and URLs. Use Figma's spell check or proofreading plugins to catch any typos.",
        tip: "Check text truncation and line wrapping across different viewport widths.",
      });
    }

    if (workflow.requiresMultiFormatResize && workflow.multiFormats && workflow.multiFormats.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Duplicate & Adapt Frames for Multi-Format Campaign",
        instruction: `Duplicate the primary frame for: ${workflow.multiFormats.join(", ")}. Adjust auto-layout direction (e.g. from vertical column to horizontal row) to fit each aspect ratio.`,
        tip: "Componentizing the core card or illustration allows updates to propagate automatically across all campaign frames.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Export Production Assets",
      instruction: "Select the frame(s) and open the 'Export' panel in the right sidebar. Export as PNG @2x for web, SVG for vector art, or PDF for commercial print.",
      tip: "Figma allows batch exporting all campaign formats simultaneously with descriptive file naming.",
    });

    return steps;
  }

  // 7. MIDJOURNEY (+ DESIGN/EDITING TOOL COMBO)
  if (tName.includes("midjourney")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Generate Base Key Artwork in Midjourney v6.1",
        instruction: `Open Discord or the Midjourney web alpha. Enter \`/imagine\` with your descriptive visual prompt. Add the required aspect ratio flag matching your format:`,
        examplePrompt: prompt,
        tip: "In Midjourney, generate background artwork and central illustrations WITHOUT complex text. Clean, text-free imagery provides the perfect base plate for sharp vector typography later.",
      },
      {
        stepNumber: 2,
        title: "Evaluate Grid & Select Best Composition",
        instruction: "Review the 4 initial generations. Look for strong visual balance, clear negative space for text placement, and rich lighting contrast. Click U1–U4 to upscale your favorite.",
        tip: "Use 'Vary (Subtle)' or 'Vary (Region)' if you want to tweak a specific part of the image while keeping the overall layout intact.",
      },
      {
        stepNumber: 3,
        title: "Download High-Resolution Artwork Master",
        instruction: "Open the upscaled image in full resolution and save the lossless PNG to your workstation.",
        tip: "Midjourney v6.1 produces high-detail 1024×1024 or 1536×1024 images. For physical poster prints, consider a 2x/4x external AI upscale.",
      },
      {
        stepNumber: 4,
        title: "Open Design/Layout Tool (Canva, Kittl, or Figma)",
        instruction: `Open your preferred graphic design tool (Canva, Kittl, Adobe Express, or Figma). Create a canvas matching the final format: '${formatStr}'.`,
        tip: "A dedicated design tool gives you full vector control over typography, letter spacing, drop shadows, and logo placement.",
      },
      {
        stepNumber: 5,
        title: "Import Midjourney Artwork as Focal Layer",
        instruction: "Place the downloaded Midjourney image onto the canvas. Scale and crop to fit, positioning the focal subject to leave generous space for headlines and body copy.",
        tip: "Add a subtle dark or light gradient overlay over the image if you need to boost text contrast and readability.",
      },
      {
        stepNumber: 6,
        title: "Add Vector Typography, Headline & Badges",
        instruction: "Add your headline, subheadings, dates, and callout badges using crisp vector typography. Choose high-contrast font pairings that complement the visual mood.",
        tip: "Vector typography renders with 100% crisp edges at any resolution and will never exhibit AI spelling hallucinations or blurred letters.",
      },
    ];

    if (workflow.assets && workflow.assets.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Incorporate Logos & Supporting Brand Assets",
        instruction: `Add official vector logos and supporting assets: ${workflow.assets.map((a) => a.label).join(", ")}. Align with visual grid margins.`,
        tip: "Ensure logos have sufficient clearspace and contrast against the Midjourney background art.",
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: "Verify All Text & Final Quality Check",
      instruction: "Inspect every piece of copy, date, URL, and credential. Ensure all text is 100% accurate and aligned to the visual margin guides.",
      tip: "Check the design at 100% zoom to ensure that typography and background elements blend harmoniously.",
    });

    steps.push({
      stepNumber: steps.length + 1,
      title: "Export Final High-Resolution Poster",
      instruction: "Export the completed design as a high-resolution PNG (for digital displays) or PDF Print with bleed (for physical printing).",
      tip: "For commercial printing, verify that colors are within the CMYK printable gamut and resolution is at least 300 DPI.",
    });

    return steps;
  }

  // 8. UNKNOWN / GENERIC TOOL FALLBACK
  const steps: UsageStep[] = [
    {
      stepNumber: 1,
      title: `Open ${toolName} & Choose Design Format`,
      instruction: `Launch ${toolName} and create a new project. Select the '${formatStr}' format or configure custom canvas dimensions.`,
      tip: "Selecting the correct aspect ratio at the start prevents awkward stretching, cropping, or repositioning later in the workflow.",
    },
  ];

  if (workflow.assets && workflow.assets.length > 0) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Upload Required Source Assets",
      instruction: `Import the tutorial assets into ${toolName}: ${workflow.assets.map((a) => a.label).join(", ")}.`,
      tip: "Ensure all source images and logos are high-resolution and have clean transparent backgrounds where appropriate.",
    });
  }

  if (workflow.brandAssets) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Apply Brand Identity Specifications",
      instruction: "Configure your official brand colors, typography pairings, and logo assets according to the brand guidelines.",
      tip: "Locking brand guidelines early ensures all generated elements remain cohesive and aligned with corporate identity.",
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: `Enter Prompt in ${toolName}`,
    instruction: `Copy and paste the detailed design prompt describing the ${designType}, composition, style (${context?.style || "Modern"}), and mood:`,
    examplePrompt: prompt,
    tip: "Be specific about headline copy, color palette, lighting, texture, and visual focal points in your prompt.",
  });

  steps.push({
    stepNumber: steps.length + 1,
    title: "Generate & Review Layout Compositions",
    instruction: `Allow ${toolName} to generate initial design variations. Evaluate layout balance, visual hierarchy, and headline impact.`,
    tip: "Select the variation where the viewer's eye naturally flows from the headline to the focal visual and finally to the call to action.",
  });

  if (workflow.requiresProductAccuracyCheck) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Audit Product Shape & Packaging Accuracy",
      instruction: "Verify that the product shape, packaging text, logo, and colors have not been altered or distorted during generation.",
      tip: "If product details are altered, lock the original product layer and regenerate only the background and graphic accents.",
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: "Refine Typography, Spacing & Visual Elements",
    instruction: "Fine-tune font sizes, kerning, line spacing, and margins. Ensure generous whitespace around text and high contrast against the background.",
    tip: "Avoid placing dark text directly over busy, high-contrast areas of background imagery.",
  });

  if (workflow.requiresTextVerification) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Verify All Text & Copy Details",
      instruction: "Carefully inspect every word, date, price, URL, address, and CTA. Correct any typos or AI-generated placeholder text.",
      tip: "Accurate information is critical for event posters and commercial advertisements.",
    });
  }

  if (workflow.requiresMultiFormatResize && workflow.multiFormats && workflow.multiFormats.length > 0) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Resize for Additional Formats",
      instruction: `Generate alternate campaign dimensions for: ${workflow.multiFormats.join(", ")}. Reposition elements within safe margins.`,
      tip: "Keep critical content centered and away from extreme edges to prevent cropping across mobile and web viewports.",
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: "Export Final Creative",
    instruction: `Download the completed design in the appropriate format (PNG/JPG for digital, PDF for print) from ${toolName}.`,
    tip: "Save a master editable project file in addition to the exported image for future updates and revisions.",
  });

  return steps;
}
