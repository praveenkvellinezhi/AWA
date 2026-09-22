import {
  PresentationAsset,
  PresentationAssetType,
  PresentationGenerationType,
  PresentationWorkflowConfig,
  Template,
  UsageStep,
} from "./types";

/**
 * Normalizes tool name for matching.
 */
function normalizeTool(name: string): string {
  return (name || "").toLowerCase().trim();
}

/**
 * Checks if a template is an AI Presentation / Slide Generation template.
 */
export function isPresentationGenerationTemplate(template: {
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
  recommendedTools?: { toolName: string }[];
  description?: string;
  name?: string;
}): boolean {
  const catId = (template.categoryId || "").toLowerCase();
  const catName = (template.categoryName || "").toLowerCase();
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();
  const tags = (template.tags || []).map((t) => t.toLowerCase());

  // Category matching
  if (
    catId === "cat-slides-presentations" ||
    catId.includes("slide") ||
    catId.includes("presentation") ||
    catName.includes("slide") ||
    catName.includes("presentation")
  ) {
    return true;
  }

  // Tag matching
  const slideKeywords = [
    "presentation",
    "slide",
    "slides",
    "pitch deck",
    "deck",
    "keynote",
    "qbr",
    "fundraising",
    "powerpoint",
    "gamma",
    "canva",
    "beautiful.ai",
    "tome",
    "pitch",
    "slidesai",
    "plus ai",
    "prezi",
  ];

  if (tags.some((t) => slideKeywords.some((kw) => t.includes(kw)))) {
    return true;
  }

  // Tool matching
  const slideTools = [
    "gamma",
    "canva",
    "beautiful.ai",
    "powerpoint",
    "copilot",
    "google slides",
    "gemini",
    "tome",
    "pitch",
    "plus ai",
    "slidesai",
    "prezi",
  ];

  const hasSlideTool = (template.recommendedTools || []).some((tool) =>
    slideTools.some((st) => tool.toolName.toLowerCase().includes(st))
  );
  if (hasSlideTool) return true;

  // Name / description matching
  if (
    name.includes("slide") ||
    name.includes("pitch deck") ||
    name.includes("presentation") ||
    name.includes("keynote") ||
    desc.includes("presentation deck") ||
    desc.includes("pitch deck") ||
    desc.includes("slide structure")
  ) {
    return true;
  }

  return false;
}

/**
 * Human-readable title for each presentation generation workflow.
 */
export function getPresentationWorkflowTitle(type: PresentationGenerationType): string {
  switch (type) {
    case "prompt-to-presentation":
      return "Prompt → Complete Slide Deck";
    case "topic-to-presentation":
      return "Topic → Structured Presentation";
    case "outline-to-slides":
      return "Slide Outline → Polished Presentation";
    case "document-to-presentation":
      return "Document → Multi-Slide Presentation";
    case "pdf-to-presentation":
      return "PDF Report → Executive Slide Deck";
    case "data-to-presentation":
      return "Data & Financials → Visual Presentation";
    case "reference-to-presentation":
      return "Reference Deck → New Presentation";
    case "template-to-presentation":
      return "Template → Custom Presentation";
    case "existing-presentation-redesign":
      return "Existing Deck → Modern Redesign";
    case "image-to-slides":
      return "Slide Screenshots → Editable Presentation";
    case "branded-presentation":
      return "Brand Assets → Consistent Corporate Deck";
    default:
      return "AI Presentation Generation";
  }
}

/**
 * Human-readable short description for each workflow type.
 */
export function getPresentationWorkflowDescription(
  type: PresentationGenerationType,
  toolName: string
): string {
  switch (type) {
    case "prompt-to-presentation":
      return `Generate a complete, narrative-driven presentation deck from a descriptive prompt in ${toolName}.`;
    case "topic-to-presentation":
      return `Transform a high-level topic into a structured, multi-slide presentation with strong visual pacing in ${toolName}.`;
    case "outline-to-slides":
      return `Convert a numbered slide outline into professionally formatted slides while preserving slide sequence in ${toolName}.`;
    case "document-to-presentation":
      return `Summarize and convert text, DOCX, or research notes into a cohesive slide presentation in ${toolName}.`;
    case "pdf-to-presentation":
      return `Extract core takeaways, tables, and executive summaries from a PDF document into slides in ${toolName}.`;
    case "data-to-presentation":
      return `Synthesize complex numbers, tables, and metrics into clear visual charts and stat callouts in ${toolName}.`;
    case "reference-to-presentation":
      return `Use an existing presentation as aesthetic and layout reference to generate fresh, original content in ${toolName}.`;
    case "template-to-presentation":
      return `Apply proven narrative frameworks and slide layouts to your specific content in ${toolName}.`;
    case "existing-presentation-redesign":
      return `Modernize the visual hierarchy, typography, and spacing of an existing presentation in ${toolName}.`;
    case "image-to-slides":
      return `Reconstruct layout grids, card styles, and visual direction from slide screenshots into ${toolName}.`;
    case "branded-presentation":
      return `Apply custom brand guidelines, color palettes, typography, and logo lockups across all slides in ${toolName}.`;
    default:
      return `Follow this structured walkthrough to generate, refine, review, and export your presentation in ${toolName}.`;
  }
}

/**
 * Resolves the dynamic presentation workflow config for a given template.
 */
export function resolvePresentationWorkflow(
  template: Template,
  activeToolName?: string
): PresentationWorkflowConfig {
  if (template.presentationWorkflow) {
    return {
      ...template.presentationWorkflow,
      tool: activeToolName || template.presentationWorkflow.tool,
    };
  }

  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();
  const prompt = (template.promptText || "").toLowerCase();

  let generationType: PresentationGenerationType = "prompt-to-presentation";
  let presentationType = "Business Presentation";
  const assets: PresentationAsset[] = [];
  let slideCount = 10;
  let hasDataVerification = false;
  let requiresSpeakerNotes = false;
  let requiresAnimations = false;
  const outline: string[] = [];

  // Detect slide count from name or prompt
  const countMatch = (template.name + " " + template.promptText).match(/(\d+)[\s-]slide/i);
  if (countMatch) {
    slideCount = parseInt(countMatch[1], 10);
  }

  // Detect presentation type
  if (tags.includes("pitch deck") || name.includes("pitch deck") || desc.includes("pitch deck")) {
    presentationType = "Pitch Deck & Fundraising";
  } else if (tags.includes("qbr") || name.includes("qbr") || name.includes("quarterly")) {
    presentationType = "Quarterly Business Review (QBR)";
  } else if (tags.includes("keynote") || name.includes("keynote") || name.includes("launch")) {
    presentationType = "Keynote & Product Launch";
  } else if (tags.includes("investor") || name.includes("series a") || name.includes("seed")) {
    presentationType = "Investor Growth Presentation";
  } else if (tags.includes("sales") || name.includes("sales")) {
    presentationType = "Sales & Client Proposal";
  } else if (tags.includes("educational") || tags.includes("training")) {
    presentationType = "Educational & Training Workshop";
  }

  // Detect data verification need
  if (
    tags.includes("analytics") ||
    tags.includes("fintech") ||
    tags.includes("okr") ||
    name.includes("arr") ||
    name.includes("qbr") ||
    name.includes("growth") ||
    prompt.includes("tam") ||
    prompt.includes("arr") ||
    prompt.includes("revenue") ||
    prompt.includes("metric") ||
    prompt.includes("chart")
  ) {
    hasDataVerification = true;
  }

  // 1. Detect Document / PDF to Presentation
  if (
    tags.includes("document") ||
    tags.includes("pdf") ||
    name.includes("document") ||
    name.includes("pdf") ||
    desc.includes("pdf")
  ) {
    generationType = tags.includes("pdf") || name.includes("pdf") ? "pdf-to-presentation" : "document-to-presentation";
    assets.push({
      id: "asset-source-doc",
      type: tags.includes("pdf") || name.includes("pdf") ? "pdf" : "document",
      label: `${template.name} Source Document`,
      description: "Upload this source document or report. The AI will extract core findings and structure slides.",
      required: true,
      role: "Source Material",
      fileFormat: tags.includes("pdf") || name.includes("pdf") ? "PDF" : "DOCX / Text",
    });
  }
  // 2. Detect Data to Presentation
  else if (
    tags.includes("data") ||
    name.includes("data") ||
    prompt.includes("financial highlights") ||
    prompt.includes("cohort retention")
  ) {
    generationType = "data-to-presentation";
    hasDataVerification = true;
    assets.push({
      id: "asset-data-file",
      type: "data-file",
      label: `${template.name} Metrics & Financial Table`,
      description: "Provide the quantitative dataset, CSV, or spreadsheet to generate verified charts and tables.",
      required: true,
      role: "Financial & Quantitative Data",
      fileFormat: "CSV / Excel / Table",
    });
  }
  // 3. Detect Branded Presentation
  else if (
    tags.includes("brand") ||
    tags.includes("branded") ||
    name.includes("branded") ||
    prompt.includes("brand guidelines")
  ) {
    generationType = "branded-presentation";
    assets.push(
      {
        id: "asset-brand-logo",
        type: "logo",
        label: "Corporate Brand Logo",
        description: "Vector logo mark (SVG or high-res PNG) for slide master headers and title cards.",
        required: true,
        role: "Brand Identity",
        fileFormat: "SVG / PNG",
      },
      {
        id: "asset-brand-palette",
        type: "brand-assets",
        label: "Brand Colors & Typography Guidelines",
        description: "Primary brand hex codes and typography pairings to enforce visual consistency.",
        required: true,
        role: "Style Guide",
      }
    );
  }
  // 4. Detect Existing Presentation Redesign
  else if (
    tags.includes("redesign") ||
    name.includes("redesign") ||
    desc.includes("redesign")
  ) {
    generationType = "existing-presentation-redesign";
    assets.push({
      id: "asset-existing-deck",
      type: "existing-presentation",
      label: "Legacy Presentation File",
      description: "Upload the existing presentation to modernize layout hierarchy while keeping core content intact.",
      required: true,
      role: "Original Slide Deck",
      fileFormat: "PPTX / PDF",
    });
  }
  // 5. Detect Outline to Slides
  else if (
    prompt.includes("slide 1") ||
    prompt.includes("slide sequence:") ||
    prompt.includes("slides required:")
  ) {
    generationType = "outline-to-slides";
  }
  // 6. Default: Prompt to Presentation
  else {
    generationType = "prompt-to-presentation";
  }

  // Extract slide outline from prompt if present
  const slideRegex = /(?:Slide\s*\d+\s*[:—\)]\s*|(\d+\)\s*))([^\.\n\d\)]+)/gi;
  let match;
  const promptToScan = template.promptText || template.uiPrompt || "";
  while ((match = slideRegex.exec(promptToScan)) !== null) {
    if (match[2] && match[2].trim().length > 3 && outline.length < 15) {
      outline.push(match[2].trim().replace(/[:—].*$/, ""));
    }
  }

  return {
    tool: activeToolName,
    generationType,
    presentationType,
    assets: assets.length > 0 ? assets : undefined,
    slideCount,
    prompt: template.promptText,
    outline: outline.length > 0 ? outline : undefined,
    hasDataVerification,
    requiresSpeakerNotes,
    requiresAnimations,
    exportFormats: ["PPTX", "PDF", "Shareable Link", "Presenter View"],
  };
}

export interface GuideContext {
  templateName?: string;
  promptText?: string;
  style?: string;
  categoryId?: string;
  slideCount?: number;
  assets?: PresentationAsset[];
}

/**
 * Dynamically generates 8–10 tool-specific, presentation-tailored steps for AI Slide Generation.
 */
export function generatePresentationGuide(
  workflow: PresentationWorkflowConfig,
  toolName: string,
  modelName?: string,
  context?: GuideContext
): UsageStep[] {
  function buildSteps(): UsageStep[] {
    const norm = normalizeTool(toolName);
  const genType = workflow.generationType;
  const presType = workflow.presentationType || "Business Presentation";
  const slideCount = workflow.slideCount || context?.slideCount || 10;
  const hasAssets = !!(workflow.assets && workflow.assets.length > 0);
  const isDoc = genType === "document-to-presentation" || genType === "pdf-to-presentation";
  const isData = genType === "data-to-presentation" || workflow.hasDataVerification;
  const isBranded = genType === "branded-presentation" || !!workflow.brandAssets;
  const isRedesign = genType === "existing-presentation-redesign";
  const isOutline = genType === "outline-to-slides" || !!(workflow.outline && workflow.outline.length > 0);

  const basePrompt = context?.promptText || workflow.prompt || "the provided presentation prompt";

  // ----------------------------------------------------
  // 1. GAMMA WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("gamma")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Gamma App",
        instruction: "Navigate to gamma.app and sign in to your creator workspace.",
        tip: "Gamma formats presentation cards with responsive pacing, automatic stat cards, and clean typography scales.",
      },
      {
        stepNumber: 2,
        title: "Select Presentation Generator",
        instruction: isDoc
          ? "Click 'New with AI' and choose 'Paste in text / Import a document'. Select 'Presentation' as output."
          : "Click 'New with AI' → 'Generate' and select 'Presentation' as the output format.",
        tip: "Gamma automatically detects heading structures and converts them into sequential presentation cards.",
      },
    ];

    if (hasAssets || isDoc || isData) {
      steps.push({
        stepNumber: 3,
        title: isDoc
          ? "Upload Source Document / Report"
          : isData
          ? "Upload Quantitative Data & Metrics"
          : "Upload Reference Assets",
        instruction: isDoc
          ? `Upload the provided report (${(workflow.assets || []).map((a) => a.label).join(", ")}). Direct Gamma to extract core findings without losing key statistics.`
          : isData
          ? "Paste your financial table or upload your CSV dataset into Gamma's context input."
          : `Provide your reference assets (${(workflow.assets || []).map((a) => a.label).join(", ")}).`,
        tip: "Gamma preserves key numerical data points when instructed explicitly in the input brief.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter Presentation Prompt & Outline",
        instruction: `Paste the AWA prompt into Gamma. Direct the AI to generate a ${presType} with clean cards and high visual hierarchy.`,
        examplePrompt: `Create a ${slideCount}-card ${presType}. Tone: ${context?.style || "Executive & Authoritative"}. Requirements: ${workflow.outline?.join(" → ") || "clean stat cards, minimal bullet points, high-impact titles"}. Avoid text walls.`,
      },
      {
        stepNumber: steps.length + 1,
        title: `Configure Card Count (${slideCount} Cards) & Theme`,
        instruction: `Set the card count to exactly ${slideCount} cards. Select a high-contrast visual theme (such as obsidian dark, slate navy, or clean modern minimalist).`,
        tip: "Choosing 16:9 widescreen card dimensions ensures clean projection during live pitches and Zoom calls.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Presentation Deck",
        instruction:
          "Click Generate. Watch Gamma build each card sequentially, populating icons, stat callouts, and multi-column comparison grids in real time.",
        tip: "Review the generated card outline before confirming final generation to ensure all required sections are present.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Slide-by-Slide Content & Layout Refinement",
        instruction:
          "Click into individual cards. Use Gamma's AI card rewrite tool to reduce text density and convert long paragraphs into 3 concise bullet points.",
        examplePrompt:
          "Convert this paragraph into 3 punchy bullet points with bold lead-in keywords. Increase whitespace around the stat callouts.",
      }
    );

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data, Numbers & Chart Labels",
        instruction:
          "Audit every numerical metric: verify currency symbols ($), percentages (%), dates, and axis labels against your source data.",
        tip: "Double-check TAM/SAM/SOM concentric circles and revenue growth milestones for mathematical consistency.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Complete Deck Flow & Pacing",
        instruction:
          "Review the presentation from start to finish: verify smooth narrative transitions from Problem → Solution → Traction → Call to Action.",
        tip: "Ensure font sizes, icon styles, and accent colors remain unified across all cards.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export PPTX / PDF or Present Fullscreen",
        instruction:
          "Click the 'Share' menu in the top right. Export as a PowerPoint (.pptx) file, download as PDF, or click 'Present' for instant full-screen presentation mode.",
        tip: "Exported PPTX decks maintain clean vector text and editable shapes for PowerPoint or Google Slides.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 2. CANVA MAGIC STUDIO WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("canva")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Canva",
        instruction: "Navigate to canva.com and log in to your account.",
        tip: "Canva Magic Design generates multi-slide presentation decks paired with hundreds of thousands of design assets and Brand Kits.",
      },
      {
        stepNumber: 2,
        title: "Launch Magic Design for Presentations",
        instruction:
          "Click 'Presentations' on the Canva homepage, then select 'Magic Design for Presentations' or search for 'AI Presentation'.",
        tip: "Select 16:9 Presentation (1920x1080px) for standard modern display compatibility.",
      },
    ];

    if (isBranded || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Brand Assets & Activate Brand Kit",
        instruction:
          `Upload your corporate logo (${(workflow.assets || []).map((a) => a.label).join(", ")}) and select your Canva Brand Kit colors and font pairings.`,
        tip: "Setting brand colors early allows Canva Magic Design to automatically tint all generated slides with your brand palette.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter Presentation Prompt",
        instruction: `Paste the AWA prompt into Magic Design. Describe the presentation topic (${presType}), target audience, and desired ${slideCount}-slide structure.`,
        examplePrompt: `Create a ${slideCount}-slide ${presType}. Topic: ${context?.templateName || "Business Presentation"}. Style: ${context?.style || "Clean Minimalist"}. Include title, problem, solution, metrics, and conclusion slides.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate & Select Deck Style Variation",
        instruction:
          "Review the slide deck style variations generated by Magic Design. Choose the template with the strongest visual hierarchy and font balance.",
        tip: "You can click 'Apply style to all pages' to synchronize color palettes across the entire deck.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Slide-by-Slide Layout & Graphic Customization",
        instruction:
          "Inspect each slide. Use Canva's drag-and-drop editor to replace stock illustrations with authentic product photos, metric cards, and charts.",
        examplePrompt:
          "Replace generic graphics with crisp minimal vector icons. Increase letter-spacing on section titles and ensure margins are balanced.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Review Readability, Typography & Alignment",
        instruction:
          "Check that font sizes follow clear hierarchy (40pt+ slide titles, 18pt body text) and that all cards and icons align to Canva's smart guides.",
        tip: "Use Canva's 'Tidy Up' alignment tool to ensure equal spacing between metric cards and icon grids.",
      }
    );

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data & Interactive Charts",
        instruction:
          "Click on Canva chart elements to verify underlying spreadsheet numbers, labels, and percentage breakdowns.",
        tip: "Canva allows direct entry of numbers or importing data from Google Sheets into native bar, line, and donut charts.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Present with Presenter View or Export PPTX / PDF",
        instruction:
          "Click 'Present' in the top right to launch Presenter View (with speaker notes and timer) or click 'Share' → 'Download' to export as PPTX or Standard PDF.",
        tip: "Exporting as Microsoft PowerPoint (.pptx) preserves editable text boxes and individual shapes.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 3. BEAUTIFUL.AI WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("beautiful")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Beautiful.ai",
        instruction: "Navigate to beautiful.ai and open your presentation dashboard.",
        tip: "Beautiful.ai uses adaptive Smart Slide templates that automatically adjust typography and spacing as you add content.",
      },
      {
        stepNumber: 2,
        title: "Create New Presentation & Choose Smart Theme",
        instruction: `Click 'Create New Presentation' and select a professional theme. Set your presentation purpose to '${presType}'.`,
        tip: "Smart themes enforce 60-30-10 color rules, font constraints, and margins across every slide automatically.",
      },
    ];

    if (hasAssets || isDoc) {
      steps.push({
        stepNumber: 3,
        title: isDoc ? "Upload Source Document" : "Upload Brand Assets",
        instruction: isDoc
          ? `Upload the source document (${(workflow.assets || []).map((a) => a.label).join(", ")}). Direct DesignerBot to convert sections into slides.`
          : `Upload your brand logo and define color codes in the Theme settings.`,
        tip: "DesignerBot can summarize multi-page PDF/Word documents directly into discrete slide outlines.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Input Presentation Prompt into DesignerBot",
        instruction: `Prompt DesignerBot with the complete AWA presentation brief. Specify ${slideCount} slides with high-impact layouts.`,
        examplePrompt: `Build a ${slideCount}-slide ${presType} using Smart Slides. Structure: ${workflow.outline?.join(" → ") || "Hero, Problem, Solution, Data, Roadmap, Call to Action"}. Keep text concise and visual.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Smart Slides with Adaptive Layouts",
        instruction:
          "Allow DesignerBot to generate the complete deck. Watch Beautiful.ai calculate layout geometry, icon scaling, and card positions.",
        tip: "Notice how text wrapping never overflows slide margins thanks to automated layout constraints.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Customize Smart Charts & Metric Cards",
        instruction:
          "Select the metrics and traction slides. Use Beautiful.ai's smart data visualizers (pie charts, stat callouts, milestone timelines) to input your numbers.",
        examplePrompt:
          "Format this slide with 3 large metric cards: 10x Speed, 99.4% Uptime, $42B Market Size with icon accents.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Refine Slide-by-Slide Content & Spacing",
        instruction:
          "Audit individual slides: trim verbose sentences into bullet points, select relevant un-splash photography, and ensure titles are active statements.",
        tip: "Replace passive titles like 'Our Product' with active takeaways like 'Autonomous AI Engine Eliminates Manual Compliance'.",
      }
    );

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data & Numerical Accuracy",
        instruction:
          "Cross-reference all chart numbers, percentages, and financial milestone labels against your original source data.",
        tip: "Ensure chart legends clearly identify units (e.g. Millions USD, Percentage YoY).",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Export to Editable PowerPoint (.pptx) or PDF",
        instruction:
          "Click the Export icon in the top toolbar. Download as an editable Microsoft PowerPoint (.pptx) file or vector PDF.",
        tip: "Beautiful.ai exports clean PowerPoint shapes and fonts that can be edited in Microsoft Office or Google Slides.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 4. MICROSOFT COPILOT / POWERPOINT WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("powerpoint") || norm.includes("copilot")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Microsoft PowerPoint",
        instruction: "Launch Microsoft PowerPoint (desktop or web) and ensure Microsoft Copilot is enabled on your ribbon.",
        tip: "PowerPoint Copilot can generate complete presentations from text prompts or convert existing Word/PDF documents into slides.",
      },
      {
        stepNumber: 2,
        title: "Open Copilot Panel",
        instruction:
          "Click the 'Copilot' button on the Home ribbon to open the conversational AI task sidebar.",
        tip: "Copilot can generate new decks, add single slides, or summarize existing presentations.",
      },
    ];

    if (isDoc) {
      steps.push({
        stepNumber: 3,
        title: "Upload / Link Source Document (Word/PDF)",
        instruction:
          `In the Copilot chat box, click 'Create presentation from file' and select your source document (${(workflow.assets || []).map((a) => a.label).join(", ")}).`,
        tip: "Copilot reads the Word/PDF document's heading hierarchy and maps major sections into slide chapters.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter Presentation Generation Prompt",
        instruction: `Paste the AWA prompt into Copilot. Direct Copilot to build a ${slideCount}-slide ${presType} with high executive clarity.`,
        examplePrompt: `Create a ${slideCount}-slide ${presType} based on this prompt. Tone: ${context?.style || "Professional & Data-Driven"}. Include executive summary, problem, solution, metrics, and roadmap.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Initial Slide Draft",
        instruction:
          "Press Enter to run Copilot. Watch PowerPoint generate slides with title cards, content bullet points, and suggested imagery.",
        tip: "Copilot adds speaker notes to generated slides automatically based on the source context.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Refine Slide Layouts with PowerPoint Designer",
        instruction:
          "Click on each generated slide and open the 'Designer' panel on the Home ribbon to choose polished visual layouts and stat card arrangements.",
        tip: "Designer suggests high-end modern card layouts, asymmetric visual splits, and clean typography treatments with one click.",
      }
    );

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data & Excel-Linked Charts",
        instruction:
          "Audit all numerical data points in tables and charts. Right-click any chart to edit data in Excel and verify numbers against your records.",
        tip: "Ensure data labels, currency symbols, and growth percentages match your verified financial metrics.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Slide Hierarchy & Speaker Notes",
        instruction:
          "Review the complete deck in Slide Sorter view. Check that speaker notes provide talking points, proof metrics, and presentation cues.",
        tip: "Use PowerPoint's 'Rehearse with Coach' to test your presentation pacing and delivery.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Save & Export as PPTX or PDF",
        instruction:
          "Save the file to OneDrive or local storage as `.pptx`. Export as PDF for distribution or share a secure view-only PowerPoint link.",
        tip: "Use 'Package for CD' or 'Compress Media' if your presentation contains embedded high-resolution videos or heavy graphics.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 5. GOOGLE GEMINI / GOOGLE SLIDES WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("gemini") || norm.includes("google slides")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Google Slides",
        instruction: "Navigate to slides.google.com and open a new blank presentation.",
        tip: "Google Workspace with Gemini provides built-in presentation generation and image creation directly inside Google Slides.",
      },
      {
        stepNumber: 2,
        title: "Launch 'Help me create a presentation' (Gemini)",
        instruction:
          "Click the 'Help me create a presentation' pen/sparkle icon at the top of the canvas or in the Gemini side panel.",
        tip: "Gemini can generate entire decks or create custom AI images for specific slides.",
      },
      {
        stepNumber: 3,
        title: "Enter the Presentation Prompt",
        instruction: `Paste the AWA prompt into Gemini. Specify that you need a ${slideCount}-slide ${presType} with clean modern layout.`,
        examplePrompt: `Create a ${slideCount}-slide ${presType}. Topic: ${context?.templateName || "Business Presentation"}. Audience: Executives. Key sections: Problem, Solution, Market Opportunity, Product Architecture, Financial Metrics, Team.`,
      },
      {
        stepNumber: 4,
        title: "Generate Initial Slide Deck Draft",
        instruction:
          "Click 'Create'. Gemini will generate sequential slides complete with suggested titles, bulleted takeaways, and layout styles.",
        tip: "Review the initial draft to verify that slide order follows a logical narrative arc.",
      },
      {
        stepNumber: 5,
        title: "Refine Typography, Colors & Master Layouts",
        instruction:
          "Use the Slide → Edit Theme menu to set brand fonts (e.g. Plus Jakarta Sans, Inter) and uniform color palettes across all slides.",
        tip: "Harmonizing background tones and title font weights creates an immediate cohesive agency feel.",
      },
      {
        stepNumber: 6,
        title: "Slide-by-Slide Content Polish & Image Replacement",
        instruction:
          "Review individual slides: condense wordy sentences, add numeric callout boxes, and use Gemini to generate contextual editorial imagery.",
        examplePrompt:
          "Replace the generic bullet list on this slide with a 3-column comparative benefit grid with icon accents.",
      }
    ];

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Insert & Verify Linked Google Sheets Charts",
        instruction:
          "Insert charts linked directly to your Google Sheets data. Verify that numbers, percentages, and milestone labels match accurately.",
        tip: "Linked Google Sheets charts allow one-click updating when financial numbers change.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Complete Presentation Flow",
        instruction:
          "Run through the presentation in 'Slideshow' mode to test transition smoothness, readability, and visual hierarchy from an audience perspective.",
        tip: "Check that text contrast against slide backgrounds meets accessibility standards.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Present Live or Download as PPTX / PDF",
        instruction:
          "Present directly in Google Meet or click File → Download → Microsoft PowerPoint (.pptx) or PDF Document (.pdf).",
        tip: "Google Slides allows instant real-time collaborative editing with teammates via shareable link.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 6. TOME WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("tome")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Tome",
        instruction: "Navigate to tome.app and log in to your workspace.",
        tip: "Tome combines AI storytelling with dynamic, responsive multi-media canvas layouts that adapt seamlessly to mobile and desktop.",
      },
      {
        stepNumber: 2,
        title: "Click 'Create with AI'",
        instruction:
          "Press Ctrl+K (or Cmd+K) and select 'Create presentation about...' from the AI command palette.",
        tip: "Tome allows you to generate complete presentations from prompts or summarize long-form articles and documents.",
      },
      {
        stepNumber: 3,
        title: "Enter Presentation Narrative Prompt",
        instruction: `Paste the AWA prompt into Tome's prompt bar. Direct the AI to generate a ${slideCount}-page ${presType} with cinematic visual tone.`,
        examplePrompt: `Create a ${slideCount}-page ${presType}. Theme: ${context?.style || "Dark Modern"}. Focus on compelling storytelling, bold typography, and visual diagrams.`,
      },
      {
        stepNumber: 4,
        title: "Generate Presentation & Review Outline",
        instruction:
          "Tome generates an initial outline. Review the slide topics, re-order if necessary, and click 'Generate presentation'.",
        tip: "Watch Tome build full-bleed slides with integrated AI imagery, multi-column layouts, and interactive embeds.",
      },
      {
        stepNumber: 5,
        title: "Customize Modular Canvas Blocks",
        instruction:
          "Use Tome's modular blocks to add 3D model previews, live web embeds, or interactive data charts into your slides.",
        tip: "Drag and drop blocks to rearrange content without breaking layout alignment.",
      },
      {
        stepNumber: 6,
        title: "Refine Typography & Text Density",
        instruction:
          "Click into each slide to edit copy. Replace lengthy explanations with punchy headline takeaways and bulleted proof points.",
        examplePrompt:
          "Make this page more minimal: enlarge the headline, reduce body text to 2 lines, and emphasize the metric callout.",
      },
      {
        stepNumber: 7,
        title: "Review Responsive & Presentation View",
        instruction:
          "Test how the presentation looks on desktop and mobile. Tome automatically reflows content for vertical mobile scrolling.",
        tip: "Click the Play icon to enter distraction-free full-screen presentation mode.",
      },
      {
        stepNumber: 8,
        title: "Share Interactive Link or Export to PDF",
        instruction:
          "Click 'Share' to generate an interactive web link with custom access controls, or export as a high-resolution PDF document.",
        tip: "Interactive links allow viewers to interact with live embedded demos directly within the presentation.",
      }
    ];

    return steps;
  }

  // ----------------------------------------------------
  // 7. PITCH WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("pitch")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Pitch",
        instruction: "Navigate to pitch.com and sign in to your team workspace.",
        tip: "Pitch offers collaborative AI presentation creation with modular slide blocks, custom color palettes, and interactive team feedback.",
      },
      {
        stepNumber: 2,
        title: "Click 'Start with AI'",
        instruction:
          "Click the 'Start with AI' button on your dashboard to open the AI presentation builder.",
        tip: "Pitch will prompt you for topic, audience, and visual styling choices.",
      },
      {
        stepNumber: 3,
        title: "Enter Presentation Brief & Choose Palette",
        instruction: `Paste the AWA prompt into Pitch. Specify ${slideCount} slides and choose your preferred color palette (e.g. Obsidian Neon, Clean Minimalist).`,
        examplePrompt: `Build an institutional-grade ${slideCount}-slide ${presType}. Narrative structure: ${workflow.outline?.join(" → ") || "Problem, Solution, Traction, Market, Team, Ask"}. Use bold typography and generous whitespace.`,
      },
      {
        stepNumber: 4,
        title: "Generate Modular Slide Stack",
        instruction:
          "Click 'Generate presentation'. Pitch builds the complete slide stack with structured content blocks, icons, and placeholder charts.",
        tip: "Pitch organizes slides into structured narrative chapters with clear transition cards.",
      },
      {
        stepNumber: 5,
        title: "Fine-Tune Typographic Hierarchy & Slide Blocks",
        instruction:
          "Use the Pitch design bar to adjust font weights, align card containers, and apply consistent border radius across all slides.",
        tip: "Use the 'Replace slide' button to quickly swap any slide layout with an alternative from Pitch's template library.",
      },
      {
        stepNumber: 6,
        title: "Slide-by-Slide Content & Metric Polish",
        instruction:
          "Refine copy on individual slides: replace generic text with verified numbers, pilot customer logos, and clear visual diagrams.",
        examplePrompt:
          "Format this slide with 4 metric cards: ARR ($5M), YoY Growth (320%), NRR (140%), and CAC Payback (6mo).",
      }
    ];

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Financial Data & Chart Coordinates",
        instruction:
          "Click on chart blocks to verify data series, axis scales, and percentage labels against your source records.",
        tip: "Pitch supports direct Google Analytics and ChartMogul integrations for live data syncing.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Speaker Notes & Team Collaboration",
        instruction:
          "Add speaker notes to guide your talking points during live delivery. Invite teammates to review and leave comments on specific slides.",
        tip: "Use Pitch's built-in video recording feature to create an async video pitch deck for investors.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Present Live or Export PPTX / PDF",
        instruction:
          "Click 'Present' to launch live presentation mode, share a tracked presentation link with viewer analytics, or export as PPTX/PDF.",
        tip: "Tracked links show you how much time investors spend on each individual slide.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 8. PLUS AI / SLIDESAI WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("plus") || norm.includes("slidesai")) {
    const isPlus = norm.includes("plus");
    const toolLabel = isPlus ? "Plus AI" : "SlidesAI";

    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: `Open Google Slides & Launch ${toolLabel}`,
        instruction: `Open a new Google Slides presentation, navigate to Extensions → ${toolLabel}, and click 'Launch'.`,
        tip: `${toolLabel} runs directly inside Google Slides, allowing you to generate and edit slides using native Google Slides shapes and text boxes.`,
      },
      {
        stepNumber: 2,
        title: "Choose Generation Mode",
        instruction: isDoc
          ? `Select 'Document to Presentation' and upload or paste your source text (${(workflow.assets || []).map((a) => a.label).join(", ")}).`
          : "Select 'Prompt to Presentation' and set your target slide count.",
        tip: `You can specify slide count (${slideCount} slides) and select from pre-designed professional themes.`,
      },
      {
        stepNumber: 3,
        title: "Enter Presentation Prompt",
        instruction: `Paste the AWA prompt into ${toolLabel}. Specify your presentation purpose (${presType}) and audience expectations.`,
        examplePrompt: `Create a ${slideCount}-slide ${presType}. Topic: ${context?.templateName || "Presentation"}. Style: ${context?.style || "Clean Minimalist"}. Structure: Problem, Solution, Market, Traction, Team, Financials.`,
      },
      {
        stepNumber: 4,
        title: "Generate Presentation Deck",
        instruction:
          `Click 'Generate Presentation'. ${toolLabel} will generate the slide deck directly into your Google Slides presentation.`,
        tip: "Every element created is a native Google Slides shape or text box, making customization effortless.",
      },
      {
        stepNumber: 5,
        title: `Use ${toolLabel} 'Remix' to Optimize Layouts`,
        instruction:
          `Select any slide that feels overcrowded and use ${toolLabel}'s 'Remix' feature to convert text into cards, timelines, or multi-column grids.`,
        examplePrompt:
          "Remix this slide into a 3-column card layout with large metric numbers and minimal subtext.",
      },
      {
        stepNumber: 6,
        title: "Refine Slide-by-Slide Content & Visual Balance",
        instruction:
          "Inspect individual slides: ensure consistent font pairing, uniform card padding, and replace generic imagery with authentic brand assets.",
        tip: "Use Google Slides 'Format Options' to apply subtle drop shadows and rounded corners to image cards.",
      }
    ];

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data & Numerical Accuracy",
        instruction:
          "Check all numbers, percentages, and financial milestone labels against your original source records.",
        tip: "Ensure all currency units and date ranges are clearly documented on chart labels.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Complete Presentation Flow",
        instruction:
          "Enter Slideshow mode to test readability, visual hierarchy, and smooth pacing from an audience perspective.",
        tip: "Verify that speaker notes contain helpful presenter cues for each slide.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export PPTX / PDF or Present in Google Meet",
        instruction:
          "Present directly or export via File → Download → Microsoft PowerPoint (.pptx) or PDF Document (.pdf).",
        tip: "Native Google Slides integration ensures 100% compatibility across all devices and platforms.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 9. CHATGPT / CLAUDE WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("chatgpt") || norm.includes("claude") || norm.includes("gpt")) {
    const isClaude = norm.includes("claude");
    const aiName = isClaude ? "Claude" : "ChatGPT";

    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: `Open ${aiName}`,
        instruction: `Navigate to ${isClaude ? "claude.ai" : "chatgpt.com"} and select the latest reasoning model (${isClaude ? "Claude 3.7 Sonnet" : "GPT-4o"}).`,
        tip: `${aiName} can generate complete slide-by-slide markdown, VBA automation scripts, or Marp/Meme outlines with precise layout directives.`,
      },
      {
        stepNumber: 2,
        title: "Enter Structured Presentation Prompt",
        instruction: `Paste the AWA prompt into ${aiName}. Direct the model to generate a complete ${slideCount}-slide deck breakdown with slide titles, exact copy, and layout guidance.`,
        examplePrompt: `Generate a complete ${slideCount}-slide ${presType} based on this brief. For each slide provide: 1) Slide Title, 2) Visual Layout Description (card structure, diagrams), 3) Exact Body Copy / Bullet Points, 4) Speaker Notes. Zero fluff.`,
      },
    ];

    if (hasAssets || isDoc || isData) {
      steps.push({
        stepNumber: 3,
        title: isDoc
          ? "Attach Source Document / Report"
          : isData
          ? "Attach Data Table / Financial Metrics"
          : "Attach Reference Presentation",
        instruction:
          `Upload your source file (${(workflow.assets || []).map((a) => a.label).join(", ")}) and instruct ${aiName} to extract core findings, metrics, and quotes.`,
        tip: `Ask ${aiName} to highlight which quantitative figures belong on which slides.`,
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Generate Slide-by-Slide Content & Structure",
        instruction:
          `Run the prompt. ${aiName} will generate a comprehensive slide-by-slide script covering all ${slideCount} slides with layout recommendations.`,
        tip: "Review the outline: ensure each slide focuses on a single core message to prevent cognitive overload.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Transfer Content into Presentation Tool",
        instruction:
          "Copy the slide titles and bullet points into your preferred presentation software (PowerPoint, Keynote, Google Slides, or Gamma).",
        tip: "You can also ask the AI to generate a PowerPoint VBA script or Markdown file for instant automated slide creation.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Apply Visual Styling & Layout Directives",
        instruction:
          `Follow ${aiName}'s layout recommendations: convert bullet lists into 3-column cards, add large metric numbers, and format visual diagrams.`,
        examplePrompt:
          "How can I format the 'Traction' slide into a clean 4-metric grid with high visual impact in PowerPoint?",
      }
    );

    if (isData) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Data & Numerical Accuracy",
        instruction:
          "Audit every number, growth percentage, and market sizing calculation against your source material.",
        tip: "Verify that all currency conversions and growth rates are mathematically sound.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Review Complete Deck Flow & Speaker Notes",
        instruction:
          "Review the presentation end-to-end. Ensure speaker notes provide narrative context and that slide transitions feel natural.",
        tip: "Practice delivering the presentation aloud to check timing and clarity.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export or Present",
        instruction:
          "Save the presentation as PPTX or PDF, or launch full-screen presentation mode for your pitch meeting.",
        tip: "Keep a backup PDF version on a USB drive or cloud drive in case of technical issues during live presentations.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 10. UNKNOWN TOOL FALLBACK (Section 21/23 Strict Clean Workflow)
  // ----------------------------------------------------
  const fallbackSteps: UsageStep[] = [
    {
      stepNumber: 1,
      title: "Open the Tool",
      instruction: `Launch ${toolName} in your browser or open its desktop application.`,
      tip: "Ensure you are logged in to save your presentation progress.",
    },
    {
      stepNumber: 2,
      title: "Start a New Presentation",
      instruction: `Create a new presentation project in ${toolName} for '${context?.templateName || "AWA Presentation"}'.`,
      tip: "Select 16:9 widescreen format for standard modern display compatibility.",
    },
    {
      stepNumber: 3,
      title: "Enter the Presentation Prompt / Topic",
      instruction: `Copy the complete presentation prompt from this AWA tutorial and paste it into ${toolName}'s input field.`,
      examplePrompt: basePrompt,
    },
    {
      stepNumber: 4,
      title: "Upload Required References / Assets",
      instruction: hasAssets
        ? `Upload the provided tutorial assets (${(workflow.assets || []).map((a) => a.label).join(", ")}) before initiating generation.`
        : `If ${toolName} supports source documents or image references, upload any relevant material.`,
      tip: "Providing source documents or brand logos significantly improves slide quality and consistency.",
    },
    {
      stepNumber: 5,
      title: `Configure Slide Count (${slideCount} Slides)`,
      instruction: `Set the presentation to approximately ${slideCount} slides as specified in the tutorial.`,
      tip: "If the tool determines slide count automatically, review the generated outline to verify all topics are covered.",
    },
    {
      stepNumber: 6,
      title: "Generate the Presentation",
      instruction: `Initiate the AI generation process in ${toolName}. Allow the model to scaffold the slide structure, copy, and layout.`,
      tip: "Wait for all slides to finish generating before making individual edits.",
    },
    {
      stepNumber: 7,
      title: "Review Slide Structure & Storytelling Flow",
      instruction:
        "Check: Slide order, Content flow, Titles, Amount of text, Visual hierarchy, Storytelling, and Consistency across the deck.",
      tip: "Ensure the narrative moves logically from introduction to problem, solution, evidence, and conclusion.",
    },
    {
      stepNumber: 8,
      title: "Refine Individual Slides",
      instruction:
        "Review individual slides: reduce text density, convert long paragraphs into concise bullet points, and replace generic imagery.",
      examplePrompt:
        "Reduce the amount of text on this slide and convert the three paragraphs into three concise bullet points.",
    },
  ];

  if (isData) {
    fallbackSteps.push({
      stepNumber: 9,
      title: "Verify Data, Charts & Labels",
      instruction:
        "Check: Numbers, Percentages, Chart labels, Units, Dates, Sources, and Calculations against your source data.",
      tip: "Never present unverified AI-generated numbers or statistics.",
    });
  }

  fallbackSteps.push({
    stepNumber: fallbackSteps.length + 1,
    title: "Export or Present",
    instruction:
      `Depending on ${toolName}'s capabilities, export the presentation as PPTX, PDF, or shareable link, or launch full-screen presentation mode.`,
    tip: "Ensure all animations and transitions function smoothly before presenting live.",
  });

    return fallbackSteps;
  }

  return buildSteps().map((step, idx) => ({
    ...step,
    stepNumber: idx + 1,
  }));
}
