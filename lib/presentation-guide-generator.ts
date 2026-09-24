import {
  PresentationAsset,
  PresentationAssetType,
  PresentationGenerationType,
  PresentationWorkflowConfig,
  PresentationWorkflowPrompts,
  SlidePrompt,
  Template,
  UsageStep,
} from "./types";
import { getTemplateCategoryKey } from "./category-guide-config";

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
  category?: string;
  slug?: string;
  tags?: string[];
  recommendedTools?: { toolName: string }[];
}): boolean {
  return getTemplateCategoryKey(template) === "slides";
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
      return `Generate a complete, narrative-driven presentation deck from a sequence of specialized AI prompts in ${toolName}.`;
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
      return `Execute this 9-step prompt pipeline to generate, structure, design, refine, and review your presentation in ${toolName}.`;
  }
}

/**
 * Standard default slide-by-slide prompts for complete pitch deck & presentation generation.
 * Each individual slide has its own copyable, production-grade prompt.
 */
export const defaultSlidePrompts: SlidePrompt[] = [
  {
    slideNumber: 1,
    title: "Cover & Strategic Hook",
    purpose: "Establish high-conviction first impression, brand identity, and core mission",
    prompt: `Generate Slide 01 (Title Card) for [COMPANY/TOPIC].

Headline: [NAME / PRODUCT] — [ONE-LINE COMPELLING MISSION]
Subtitle: [TARGET MARKET / STRATEGIC PROPOSITION]
Presenter: [PRESENTER NAME / FOUNDERS] | [DATE / SERIES]

Visual Direction:
- Minimalist high-contrast obsidian background (#090A0F) with electric cyan (#00F5D4) accent glow.
- Centered typography hierarchy with prominent bold hero headline.
- Subtle geometric grid watermark and clean logo lockup in top-left.

Tone: Authoritative, visionary, uncluttered.`,
    layout: "Hero Title Center",
  },
  {
    slideNumber: 2,
    title: "The Problem & Pain Point",
    purpose: "Articulate the acute friction, cost of inaction, and market inefficiency",
    prompt: `Generate Slide 02 (The Problem) for [TOPIC].

Headline: The Critical Pain in [INDUSTRY]
Core Message: Traditional approaches are costing enterprises millions in wasted hours and operational friction.

Visual Structure:
- 3 distinct acute friction points formatted as equal comparison cards.
- Bold stat callout on each card (e.g. "68% of teams struggle with...", "$4.2M average annual loss").
- Warning accent indicators (#F59E0B) on critical friction points.

Avoid paragraphs—use 1-line headlines with 2-line supporting bullets per card.`,
    layout: "3-Column Pain Matrix",
  },
  {
    slideNumber: 3,
    title: "The Solution & Value Proposition",
    purpose: "Present the core product paradigm shift and immediate customer benefits",
    prompt: `Generate Slide 03 (The Solution) for [PRODUCT].

Headline: [PRODUCT]: The New Operating System for [DOMAIN]
Core Message: Autonomous, AI-driven workflows that eliminate manual friction.

Visual Structure:
- Split layout: Left side highlights 3 primary pillars of value (Speed, Accuracy, Automation).
- Right side displays clean, stylized product UI wireframe/architecture preview.
- High-contrast electric cyan highlights on key technological differentiators.`,
    layout: "Split Value & Architecture",
  },
  {
    slideNumber: 4,
    title: "Product Architecture & Workflow",
    purpose: "Show how the technology actually works with clear visual flow",
    prompt: `Generate Slide 04 (Product Workflow) for [PRODUCT].

Headline: End-to-End Autonomous Pipeline
Workflow Stages:
1. Ingestion: Seamless API & data ingestion from enterprise sources.
2. AI Context Engine: Autonomous context processing & intent parsing.
3. Verification Matrix: Real-time validation and compliance check.
4. Production Action: Immediate execution and automated reporting.

Visual: 4 connected glowing process cards with directional flow arrows and icon markers.`,
    layout: "4-Stage Flowchart",
  },
  {
    slideNumber: 5,
    title: "Market Opportunity (TAM / SAM / SOM)",
    purpose: "Prove venture-scale addressable market with credible sizing breakdown",
    prompt: `Generate Slide 05 (Market Opportunity) for [INDUSTRY].

Headline: Sizing a [TOTAL TAM] Market In Transition
Data Callouts:
- TAM: $[TOTAL]B (Total Global Addressable Market)
- SAM: $[SERVEABLE]B (Serviceable Addressable Market in target verticals)
- SOM: $[OBTAINABLE]M (Immediate 24-Month Target Beachhead)

Visual: 3 nested concentric metric cards with proportional font scaling and authoritative market research citations.`,
    layout: "3-Tier Market Sizing Cards",
  },
  {
    slideNumber: 6,
    title: "Business Model & Monetization",
    purpose: "Explain unit economics, pricing tiers, and land-and-expand revenue model",
    prompt: `Generate Slide 06 (Business Model) for [COMPANY].

Headline: High-Margin SaaS with Usage-Based Expansion
Tiers:
1. Platform Starter: Base annual subscription for core workflow routing.
2. Enterprise Pro: Advanced security, custom AI models, and dedicated SLAs.
3. Volume Expansion: Usage-based consumption meter on automated actions.

Visual: Clean 3-tier comparison matrix with highlighted recommended Enterprise tier and land-and-expand ARR illustration.`,
    layout: "Pricing Tier Matrix",
  },
  {
    slideNumber: 7,
    title: "Early Traction & Proof Points",
    purpose: "Demonstrate verified adoption, revenue velocity, and customer love",
    prompt: `Generate Slide 07 (Traction & Metrics) for [COMPANY].

Headline: Rapid Enterprise Adoption & Revenue Velocity
Key Metrics:
- Monthly Revenue: $[MRR] MRR (+[MOM]% Month-over-Month Growth)
- Enterprise Pilots: [NUMBER] active multi-year deployments
- Net Retention: [RETENTION]% Net Revenue Retention (NRR)

Visual: 3 bold KPI counter blocks with upward trend green pill badges (#10B981) and customer logo row below.`,
    layout: "KPI Metric Counter Grid",
  },
  {
    slideNumber: 8,
    title: "Competitive Moat & Defensibility",
    purpose: "Highlight proprietary advantages, network effects, and switching barriers",
    prompt: `Generate Slide 08 (Competitive Moat) for [COMPANY].

Headline: Why [COMPANY] Wins and Retains Market Dominance
Comparison:
- Legacy Competitors: Slow manual setup, rigid rule engines, high deployment overhead.
- Generic Point AI Tools: Superficial wrapper interfaces, zero enterprise integrations.
- [COMPANY]: Deep bi-directional API orchestrations, fine-tuned proprietary models, compounding data flywheel.

Visual: 2x2 competitive positioning quadrant or 3-column feature comparison matrix with checkmark indicators.`,
    layout: "2x2 Positioning Matrix",
  },
  {
    slideNumber: 9,
    title: "Founding Team & Key Leaders",
    purpose: "Build investor trust in founders' domain expertise and track record",
    prompt: `Generate Slide 09 (Founding Team) for [COMPANY].

Headline: World-Class Engineering & Domain Leadership
Team Cards:
1. CEO: Prior founder with successful exit in enterprise SaaS; ex-[NOTABLE COMPANY].
2. CTO: PhD in Machine Learning; former Principal AI Architect at [NOTABLE COMPANY].
3. Head of Product: 10+ years scaling enterprise developer tools and UX.

Visual: 3 modern team cards with photo slots, LinkedIn badges, previous exit credentials, and top university badges.`,
    layout: "3-Card Team Grid",
  },
  {
    slideNumber: 10,
    title: "The Ask & Capital Allocation",
    purpose: "State funding target, valuation, and 18-month strategic milestones",
    prompt: `Generate Slide 10 (The Investment Opportunity) for [COMPANY].

Headline: Raising $[AMOUNT] to Accelerate Market Capture
Use of Funds:
- 60% Engineering & Core Model Infrastructure
- 30% Enterprise Go-To-Market & Sales Expansion
- 10% Operations, Compliance & Security Certifications

18-Month Milestones:
- Scale from $[CURRENT MRR] to $[TARGET ARR] ARR
- Expand active enterprise logos from [CURRENT] to 150+
Contact: [FOUNDER EMAIL / PHONE] | [INVESTOR PORTAL LINK]

Visual: Clean donut allocation chart on left side, milestone timeline roadmap on right side.`,
    layout: "Split Allocation & Roadmap",
  },
];

/**
 * Builds the 9-Step Prompt Workflow for Slides & Presentations.
 * Every step is an ACTUAL USABLE AI PROMPT that users can copy directly into Gamma, Canva, Claude, ChatGPT, or PowerPoint.
 */
export function buildPresentationPromptSteps(
  templateContext?: {
    name?: string;
    description?: string;
    promptText?: string;
    style?: string;
    tags?: string[];
    presentationPrompts?: PresentationWorkflowPrompts;
    slidePrompts?: SlidePrompt[];
    targetAudience?: string;
    objective?: string;
    slideCount?: number;
  },
  toolName: string = "Gamma",
  modelName: string = "Gamma Presentation AI"
): UsageStep[] {
  const name = templateContext?.name || "B2B AI SaaS Pitch Deck";
  const tags = (templateContext?.tags || []).map((t) => t.toLowerCase());
  const custom = templateContext?.presentationPrompts;

  // Infer smart defaults from template context
  const isPitch = tags.includes("pitch") || tags.includes("fundraising") || name.toLowerCase().includes("pitch");
  const isQBR = tags.includes("qbr") || name.toLowerCase().includes("qbr") || name.toLowerCase().includes("review");
  const isKeynote = tags.includes("keynote") || name.toLowerCase().includes("keynote") || name.toLowerCase().includes("launch");

  const defaultTopic = name;
  const defaultAudience = templateContext?.targetAudience || (
    isPitch
      ? "Tier-1 Venture Capitalists & Angel Investors"
      : isQBR
      ? "Executive Board & Department Leadership"
      : isKeynote
      ? "Industry Conference Attendees & Prospective Enterprise Customers"
      : "Executive Decision Makers & Stakeholders"
  );
  const defaultObjective = templateContext?.objective || (
    isPitch
      ? "Secure $3M Seed funding by validating market urgency, autonomous product architecture, and rapid customer velocity"
      : isQBR
      ? "Report quarterly ARR performance, highlight operational efficiencies, and lock in next quarter OKR roadmap"
      : isKeynote
      ? "Introduce breakthrough platform capabilities and convert audience into beta enterprise pilots"
      : "Deliver a compelling, data-backed presentation that drives clear organizational alignment"
  );
  const defaultStyle = templateContext?.style || "Minimalist Obsidian (#090A0F) with Electric Cyan (#00F5D4) accents";

  return [
    // ------------------------------------------------------------------------
    // PROMPT 01 — Presentation Strategy
    // ------------------------------------------------------------------------
    {
      stepNumber: 1,
      title: "Step 01 — Generate Presentation Strategy",
      instruction:
        "Instructs the AI to establish target audience, strategic objectives, narrative tone, and optimal slide count.",
      tip: "Copy this prompt into your AI model first to establish the strategic guardrails before drafting any slide content.",
      promptCategory: "Strategy",
      promptVariables: [
        { name: "[TOPIC]", description: "The core subject of the presentation", defaultValue: defaultTopic },
        { name: "[TARGET AUDIENCE]", description: "Who will receive this presentation", defaultValue: defaultAudience },
        { name: "[OBJECTIVE]", description: "The desired business outcome", defaultValue: defaultObjective },
      ],
      prompt: custom?.strategy || `Create a presentation strategy for [TOPIC].

The presentation is intended for [TARGET AUDIENCE].

The primary objective is [OBJECTIVE].

Define:
- the core message
- audience expectations
- presentation tone
- key information that must be communicated
- recommended presentation length
- recommended number of slides
- desired audience takeaway

Keep the strategy focused and suitable for a professional presentation.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 02 — Presentation Structure
    // ------------------------------------------------------------------------
    {
      stepNumber: 2,
      title: "Step 02 — Generate Presentation Structure",
      instruction:
        "Generates a complete slide-by-slide sequence with narrative flow, titles, purposes, and layout archetypes.",
      tip: "Paste your output from Prompt 01 into [PASTE PRESENTATION STRATEGY]. This ensures each slide advances the storyline logically.",
      promptCategory: "Structure",
      promptVariables: [
        { name: "[PASTE PRESENTATION STRATEGY]", description: "The strategy generated in Prompt 01" },
      ],
      prompt: custom?.structure || `Based on the presentation strategy below, create a complete slide-by-slide presentation structure.

Presentation Strategy:
[PASTE PRESENTATION STRATEGY]

Create an appropriate sequence of slides.

For every slide provide:
- Slide number
- Slide title
- Purpose of the slide
- Main message
- Key information to communicate
- Recommended visual type
- Recommended layout

Do not force a fixed number of slides.

The structure should follow a logical narrative from introduction to conclusion.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 03 — Individual Slide Planning
    // ------------------------------------------------------------------------
    {
      stepNumber: 3,
      title: "Step 03 — Generate Individual Slide Specifications",
      instruction:
        "Produces an exhaustive blueprint defining content, typography, visuals, statistics, and speaker notes for every slide.",
      tip: "This blueprint prevents redundant content across slides and guarantees every slide has one distinct purpose.",
      promptCategory: "Slide Planning",
      promptVariables: [
        { name: "[PASTE PRESENTATION STRUCTURE]", description: "The slide structure generated in Prompt 02" },
      ],
      prompt: custom?.slidePlanning || `Using the presentation structure below, create a detailed specification for every individual slide.

Presentation Structure:
[PASTE PRESENTATION STRUCTURE]

For each slide define:
1. Slide number
2. Slide title
3. Primary objective
4. Main message
5. Supporting content
6. Visual requirements
7. Recommended layout
8. Typography hierarchy
9. Data or statistics required
10. Image or illustration requirements
11. Call-to-action, if applicable
12. Speaker notes, if required

Make every slide serve a distinct purpose.

Avoid repeating the same information across multiple slides.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 04 — Slide Content Generation
    // ------------------------------------------------------------------------
    {
      stepNumber: 4,
      title: "Step 04 — Generate Slide Content",
      instruction:
        "Generates concise, punchy presentation copy without filler or long text blocks for any specific slide.",
      tip: "Run this prompt for each slide number. It enforces short headlines and scannable bullet points suitable for slides.",
      promptCategory: "Content",
      promptVariables: [
        { name: "[SLIDE NUMBER]", description: "e.g. 1, 2, 3..." },
        { name: "[PRESENTATION CONTEXT]", description: "Brief summary of the deck" },
        { name: "[SLIDE PURPOSE]", description: "Primary goal of this slide" },
        { name: "[SLIDE TITLE]", description: "The slide's working title" },
      ],
      prompt: custom?.contentGeneration || `Create the content for Slide [SLIDE NUMBER] of the presentation.

Presentation context:
[PRESENTATION CONTEXT]

Slide purpose:
[SLIDE PURPOSE]

Slide title:
[SLIDE TITLE]

Create concise, presentation-ready content.

Include only information that supports the primary message of this slide.

Use:
- short headlines
- concise supporting text
- meaningful statistics where relevant
- short bullet points when appropriate

Avoid long paragraphs and unnecessary filler content.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 05 — Visual Direction
    // ------------------------------------------------------------------------
    {
      stepNumber: 5,
      title: "Step 05 — Generate Visual Direction",
      instruction:
        "Defines layout, typography hierarchy, image treatment, color accents, and spacing for visual design tools.",
      tip: "Use this prompt with Gamma, Canva, Figma, or PowerPoint to guide the aesthetic execution of the slide.",
      promptCategory: "Visual Direction",
      promptVariables: [
        { name: "[SLIDE CONTENT]", description: "Content produced in Prompt 04" },
        { name: "[PRESENTATION STYLE]", description: defaultStyle },
      ],
      prompt: custom?.visualDirection || `Create the visual direction for this presentation slide.

Slide content:
[SLIDE CONTENT]

Define:
- layout
- visual hierarchy
- typography hierarchy
- image placement
- image treatment
- color usage
- spacing
- icons or illustrations
- charts or diagrams if required
- background treatment

The visual design should support the slide's main message rather than simply decorating the slide.

Maintain consistency with the overall presentation style: [PRESENTATION STYLE].`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 06 — Slide-by-Slide Generation
    // ------------------------------------------------------------------------
    {
      stepNumber: 6,
      title: "Step 06 — Generate Individual Slides",
      instruction:
        "Assembles the complete presentation slide combining copy, layout, data visualization, and typography hierarchy.",
      tip: "The flagship production prompt: produces complete, standalone slide cards that integrate seamlessly into the master deck.",
      promptCategory: "Slide Generation",
      promptVariables: [
        { name: "[SLIDE NUMBER]", description: "e.g. 1, 2, 3..." },
        { name: "[PRESENTATION CONTEXT]", description: defaultTopic },
        { name: "[SLIDE SPECIFICATION]", description: "Slide blueprint from Prompt 03 & 04" },
      ],
      prompt: custom?.slideGeneration || `Create Slide [SLIDE NUMBER] for the following presentation.

Presentation:
[PRESENTATION CONTEXT]

Slide specification:
[SLIDE SPECIFICATION]

Generate a complete presentation slide based on the specification.

Include:
- slide title
- slide content
- visual hierarchy
- layout
- imagery or illustration direction
- charts/data visualization when required
- typography hierarchy
- spacing
- supporting elements

The slide should communicate one clear primary idea.

Do not add unnecessary content.

Ensure the slide can visually stand on its own while remaining consistent with the rest of the presentation.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 07 — Data / Charts / Visuals
    // ------------------------------------------------------------------------
    {
      stepNumber: 7,
      title: "Step 07 — Generate Data Visualizations & Charts",
      instruction:
        "Analyzes numerical data and selects the highest-impact visual chart, table, timeline, or stat callout.",
      tip: "Critical for metrics slides, financial highlights, market sizing (TAM/SAM/SOM), and roadmap schedules.",
      promptCategory: "Visuals / Data",
      promptVariables: [
        { name: "[SLIDE CONTENT]", description: "Raw metrics, revenue numbers, or timeline dates" },
      ],
      prompt: custom?.dataVisualization || `Analyze the following slide content and determine the most effective way to visually communicate the information.

Content:
[SLIDE CONTENT]

Determine whether the slide should use:
- KPI / statistics callouts
- bar chart
- line chart
- pie / donut chart
- comparison table
- timeline / roadmap
- process flow diagram
- infographic cards
- comparison matrix
- visual illustration

Then provide the recommended visual structure and explain how the information should be arranged.

Prioritize clarity and fast comprehension.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 08 — Presentation Consistency & Refinement
    // ------------------------------------------------------------------------
    {
      stepNumber: 8,
      title: "Step 08 — Refine Visual Consistency",
      instruction:
        "Audits all generated slides as a complete visual system, aligning typography, margins, colors, and styling.",
      tip: "Run this across your assembled slides before final review to ensure the deck looks designed by one expert agency.",
      promptCategory: "Consistency",
      promptVariables: [
        { name: "[PRESENTATION SLIDES]", description: "The list of assembled slide cards or summaries" },
      ],
      prompt: custom?.consistency || `Review the following presentation slides as a complete visual system.

[PRESENTATION SLIDES]

Identify and refine inconsistencies in:
- typography
- spacing
- alignment
- colors
- visual hierarchy
- image treatment
- card styles
- icon styles
- chart styles
- margins
- layouts

Preserve the unique purpose of each slide while ensuring the entire presentation feels like one cohesive design system.`,
    },

    // ------------------------------------------------------------------------
    // PROMPT 09 — Final Presentation Review
    // ------------------------------------------------------------------------
    {
      stepNumber: 9,
      title: "Step 09 — Review Final Presentation",
      instruction:
        "Performs an executive audit evaluating narrative flow, information density, readability, and audience impact.",
      tip: "Provides targeted surgical improvements without rewriting slides that are already working well.",
      promptCategory: "Review",
      promptVariables: [
        { name: "[PRESENTATION]", description: "The complete presentation content from Slide 1 to end" },
      ],
      prompt: custom?.finalReview || `Review the complete presentation below.

[PRESENTATION]

Evaluate every slide for:
- clarity
- narrative flow
- content quality
- visual hierarchy
- readability
- information density
- consistency
- unnecessary repetition
- missing information
- weak transitions

Suggest specific improvements for individual slides.

Do not rewrite the entire presentation unnecessarily.

Only modify slides where improvement is required.`,
    },
  ];
}

/**
 * Resolves the dynamic presentation workflow config for a given template.
 */
export function resolvePresentationWorkflow(
  template: Template,
  activeToolName?: string
): PresentationWorkflowConfig {
  const customPrompts = template.presentationPrompts;
  const customSlides = template.slidePrompts;

  if (template.presentationWorkflow) {
    return {
      ...template.presentationWorkflow,
      tool: activeToolName || template.presentationWorkflow.tool,
      prompts: customPrompts || template.presentationWorkflow.prompts,
      slides: customSlides || template.presentationWorkflow.slides || defaultSlidePrompts,
    };
  }

  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();

  let generationType: PresentationGenerationType = "prompt-to-presentation";
  let presentationType = "Business Presentation";
  const assets: PresentationAsset[] = [];
  let slideCount = 10;
  let hasDataVerification = false;

  // Detect slide count from name or prompt
  const countMatch = (template.name + " " + (template.promptText || "")).match(/(\d+)[\s-]slide/i);
  if (countMatch) {
    slideCount = parseInt(countMatch[1], 10);
  }

  // Detect presentation type
  if (tags.includes("pitch deck") || name.includes("pitch deck") || desc.includes("pitch deck")) {
    presentationType = "Pitch Deck & Fundraising";
    hasDataVerification = true;
  } else if (tags.includes("qbr") || name.includes("qbr") || name.includes("quarterly")) {
    presentationType = "Quarterly Business Review (QBR)";
    hasDataVerification = true;
  } else if (tags.includes("keynote") || name.includes("keynote") || name.includes("launch")) {
    presentationType = "Keynote & Product Launch";
  } else if (tags.includes("investor") || name.includes("series a") || name.includes("seed")) {
    presentationType = "Investor Growth Presentation";
    hasDataVerification = true;
  } else if (tags.includes("sales") || name.includes("sales")) {
    presentationType = "Sales & Client Proposal";
  } else if (tags.includes("educational") || tags.includes("training")) {
    presentationType = "Educational & Training Workshop";
  }

  return {
    generationType,
    presentationType,
    slideCount,
    assets,
    theme: template.style || "Minimalist Obsidian (#090A0F) with Electric Cyan (#00F5D4) Accents",
    prompts: customPrompts,
    slides: customSlides || defaultSlidePrompts,
    hasDataVerification,
    requiresSpeakerNotes: true,
    supportedExportFormats: ["PPTX", "PDF", "Shareable Link", "Presenter Mode"],
  };
}

/**
 * Dynamically generates tool-specific, presentation-tailored prompt steps for AI Slide Generation.
 */
export function generatePresentationGuide(
  workflow: PresentationWorkflowConfig,
  toolName: string,
  modelName?: string,
  context?: {
    templateName?: string;
    promptText?: string;
    style?: string;
    categoryId?: string;
    targetAudience?: string;
    objective?: string;
    slideCount?: number;
    presentationPrompts?: PresentationWorkflowPrompts;
    slidePrompts?: SlidePrompt[];
  }
): UsageStep[] {
  return buildPresentationPromptSteps(
    {
      name: context?.templateName,
      promptText: context?.promptText || workflow.prompt,
      style: context?.style,
      targetAudience: context?.targetAudience,
      objective: context?.objective,
      slideCount: context?.slideCount || workflow.slideCount,
      presentationPrompts: context?.presentationPrompts || workflow.prompts,
      slidePrompts: context?.slidePrompts || workflow.slides,
    },
    toolName,
    modelName
  );
}
