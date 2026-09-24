import {
  Template,
  TemplateStep,
  TemplateWorkflow,
  TemplateVariable,
  TemplateStepImage,
  TemplateStepExample,
  UsageStep,
  GuideStep,
} from "./types";
import { getTemplateCategoryKey, CategoryKey } from "./category-guide-config";

/**
 * Normalizes any step data (legacy UsageStep, GuideStep, or Builder item)
 * into a canonical TemplateStep preserving ALL rich fields.
 */
export function normalizeTemplateStep(
  raw: any,
  index: number = 0
): TemplateStep {
  const order =
    typeof raw.order === "number"
      ? raw.order
      : typeof raw.stepNumber === "number"
      ? raw.stepNumber
      : typeof raw.step === "number"
      ? raw.step
      : index + 1;

  const id =
    raw.id && String(raw.id).trim().length > 0
      ? String(raw.id)
      : `step-${order}`;

  const title =
    raw.title && String(raw.title).trim().length > 0
      ? String(raw.title)
      : `Step ${String(order).padStart(2, "0")}`;

  const shortTitle = raw.shortTitle || undefined;

  const description =
    raw.description || raw.instruction || raw.directive || "";

  const prompt = raw.prompt || raw.examplePrompt || "";

  const purpose = raw.purpose || raw.objective || undefined;

  // Preserve instructions array
  const instructions: string[] = Array.isArray(raw.instructions)
    ? raw.instructions
    : raw.instructionList && Array.isArray(raw.instructionList)
    ? raw.instructionList
    : [];

  // Parse or normalize variables
  let variables: TemplateVariable[] = [];
  if (Array.isArray(raw.variables) && raw.variables.length > 0) {
    variables = raw.variables.map((v: any) =>
      typeof v === "string"
        ? { name: v.replace(/[\[\]]/g, "") }
        : {
            name: v.name?.replace(/[\[\]]/g, "") || "VARIABLE",
            description: v.description,
            defaultValue: v.defaultValue,
          }
    );
  } else if (Array.isArray(raw.promptVariables) && raw.promptVariables.length > 0) {
    variables = raw.promptVariables.map((v: any) => ({
      name: v.name?.replace(/[\[\]]/g, "") || "VARIABLE",
      description: v.description,
      defaultValue: v.defaultValue,
    }));
  } else if (Array.isArray(raw.inputVariables) && raw.inputVariables.length > 0) {
    variables = raw.inputVariables.map((v: any) => ({
      name: String(v).replace(/[\[\]]/g, ""),
    }));
  } else if (prompt) {
    // Extract [VARIABLE] patterns automatically from prompt if not specified
    const matches = prompt.match(/\[[A-Z0-9_\-\s]{2,}\]/g);
    if (matches) {
      const uniqueNames = Array.from(new Set(matches.map((m: string) => m.replace(/[\[\]]/g, ""))));
      variables = uniqueNames.map((name) => ({ name: String(name) }));
    }
  }

  // Preserve image
  let image: TemplateStepImage | undefined = undefined;
  const rawImgUrl = raw.image?.url || raw.imageUrl || (typeof raw.image === "string" ? raw.image : undefined);
  if (rawImgUrl) {
    image = {
      url: rawImgUrl,
      alt: raw.image?.alt || title,
      caption: raw.image?.caption || raw.imageCaption || undefined,
    };
  }

  // Preserve example
  let example: TemplateStepExample | undefined = undefined;
  const rawInput = raw.example?.input || raw.exampleInput || undefined;
  const rawOutput = raw.example?.output || raw.output || (typeof raw.example === "string" ? raw.example : undefined);
  if (rawInput || rawOutput) {
    example = {
      input: rawInput,
      output: rawOutput,
    };
  }

  // Preserve tips
  let tips: string[] = [];
  if (Array.isArray(raw.tips) && raw.tips.length > 0) {
    tips = raw.tips.filter(Boolean);
  } else if (raw.tip && String(raw.tip).trim().length > 0) {
    tips = [String(raw.tip).trim()];
  } else if (raw.notes && String(raw.notes).trim().length > 0) {
    tips = [String(raw.notes).trim()];
  }

  const metadata = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : undefined;

  return {
    id,
    order,
    title,
    shortTitle,
    description,
    prompt,
    purpose,
    instructions: instructions.length > 0 ? instructions : undefined,
    variables: variables.length > 0 ? variables : undefined,
    image,
    example,
    tips: tips.length > 0 ? tips : undefined,
    metadata,

    // Backward compatibility aliases
    stepNumber: order,
    step: order,
    instruction: description,
    tip: tips[0] || undefined,
    imageUrl: image?.url || undefined,
    imageCaption: image?.caption || undefined,
    promptCategory: raw.promptCategory || undefined,
    promptVariables: variables.length > 0 ? variables : undefined,
    slideNumber: raw.slideNumber || undefined,
    slideTitle: raw.slideTitle || undefined,
    visualDirection: raw.visualDirection || undefined,
    layout: raw.layout || undefined,
    output: example?.output || undefined,
    notes: tips[0] || undefined,
  };
}

/**
 * Returns the canonical workflow steps for any template.
 * SINGLE SOURCE OF TRUTH:
 * 1. template.workflow.steps if present
 * 2. Fallbacks to normalized template.usageSteps
 * 3. Fallbacks to starter category steps
 */
export function getTemplateWorkflowSteps(
  template: Partial<Template> | null | undefined
): TemplateStep[] {
  if (!template) {
    return getDefaultWorkflowStepsForCategory("image");
  }

  // 1. Primary canonical source of truth
  if (
    template.workflow?.steps &&
    Array.isArray(template.workflow.steps) &&
    template.workflow.steps.length > 0
  ) {
    return [...template.workflow.steps]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s, idx) => normalizeTemplateStep(s, idx));
  }

  // 2. Backward compatibility fallback from usageSteps
  if (
    template.usageSteps &&
    Array.isArray(template.usageSteps) &&
    template.usageSteps.length > 0
  ) {
    return [...template.usageSteps]
      .sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0))
      .map((s, idx) => normalizeTemplateStep(s, idx));
  }

  // 3. Fallback to default starter steps for category
  const catKey = getTemplateCategoryKey(template);
  return getDefaultWorkflowStepsForCategory(catKey);
}

/**
 * Category-specific canonical workflow starter steps.
 * Aligns strictly with Section 8 of requirement:
 * - Image: Concept -> Prompt -> Visual Direction -> Generate -> Refine
 * - Video: Scene -> Subject & Action -> Camera Movement -> Motion -> Generate -> Refine
 * - Website: Project Context -> Structure -> UI -> Components -> Functionality -> Refine
 * - Slides: Strategy -> Structure -> Plan Slides -> Slide Content -> Visual Direction -> Generate Slides -> Review & Refine
 * - Posters: Design Concept -> Content -> Composition -> Visual Direction -> Generate -> Refine
 */
export function getDefaultWorkflowStepsForCategory(
  categoryKey: string
): TemplateStep[] {
  const normKey = (categoryKey || "").toLowerCase();

  if (normKey.includes("video")) {
    return [
      normalizeTemplateStep({
        order: 1,
        title: "Define Scene & Environment",
        description: "Establish the setting, environmental lighting, and visual atmosphere for the video generation.",
        purpose: "Anchor the spatial foundation before adding action and character movement.",
        prompt: "Cinematic establishing shot of [LOCATION / SCENE], [TIME_OF_DAY], [LIGHTING_CONDITIONS], [ATMOSPHERE_MOOD], 8K UHD filmic quality.",
        variables: [{ name: "LOCATION" }, { name: "TIME_OF_DAY" }, { name: "LIGHTING_CONDITIONS" }, { name: "ATMOSPHERE_MOOD" }],
        example: { output: "Sun-drenched Mediterranean coastal highway at golden hour." },
        tips: ["Be specific about environmental conditions like haze, rain, or dust particles."],
      }, 0),
      normalizeTemplateStep({
        order: 2,
        title: "Define Subject & Action",
        description: "Specify the main subject, clothing, styling, and the exact physical action happening.",
        purpose: "Give the AI model a clear subject trajectory so it doesn't wander or distort.",
        prompt: "A [SUBJECT] performing [ACTION], wearing [WARDROBE_STYLING], showing [FACIAL_EXPRESSION / EMOTION]. Realistic physical weight and natural movement dynamics.",
        variables: [{ name: "SUBJECT" }, { name: "ACTION" }, { name: "WARDROBE_STYLING" }, { name: "FACIAL_EXPRESSION" }],
        example: { output: "Vintage red coupe accelerating past camera with realistic tire smoke." },
        tips: ["Describe action verbs with speed and intention (e.g. 'accelerates smoothly' instead of 'moves')."],
      }, 1),
      normalizeTemplateStep({
        order: 3,
        title: "Define Camera Movement",
        description: "Program cinematic camera movement, lens characteristics, and angle changes.",
        purpose: "Replicate professional director camera rigs (crane, drone, dolly, tracking).",
        prompt: "Camera starts [STARTING_ANGLE], executes a [CAMERA_MOVEMENT: pan / tilt / dolly / crane / orbit] following the subject at [CAMERA_SPEED], 35mm anamorphic cinema lens, shallow depth of field, natural motion blur.",
        variables: [{ name: "STARTING_ANGLE" }, { name: "CAMERA_MOVEMENT" }, { name: "CAMERA_SPEED" }],
        example: { output: "Low-angle tracking dolly sweeping left to right, maintaining focus on wheel rim." },
        tips: ["Keep camera trajectory single-directional to prevent motion warp."],
      }, 2),
      normalizeTemplateStep({
        order: 4,
        title: "Define Motion Intensity & Physics",
        description: "Tune speed, temporal coherence, and physical reaction forces.",
        purpose: "Avoid rubbery AI artifacts by setting clear motion constraints.",
        prompt: "Motion intensity [MOTION_INTENSITY: 1-10], smooth temporal coherence between frames, accurate fluid dynamics and cloth simulation, no morphing or sudden frame jumps.",
        variables: [{ name: "MOTION_INTENSITY" }],
        example: { output: "Motion intensity 4: Steady smooth acceleration without distortion." },
        tips: ["Lower motion values (3-5) yield higher photorealistic stability on Runway & Sora."],
      }, 3),
      normalizeTemplateStep({
        order: 5,
        title: "Generate Video Output",
        description: "Execute the generative video render using the optimized multi-parameter prompt.",
        purpose: "Produce the core high-definition candidate video clip.",
        prompt: "[FULL_SCENE_DIRECTIVE]: [SCENE_PROMPT] + [SUBJECT_ACTION] + [CAMERA_MOVEMENT] + [RENDER_PRESETS: 24fps, 4K, 16:9 widescreen].",
        variables: [{ name: "SCENE_PROMPT" }, { name: "SUBJECT_ACTION" }, { name: "CAMERA_MOVEMENT" }],
        example: { output: "5-second 4K video sequence ready for timeline placement." },
        tips: ["Generate 2-3 seed variations to select the cleanest temporal pass."],
      }, 4),
      normalizeTemplateStep({
        order: 6,
        title: "Refine & Extend Video",
        description: "Upscale resolution, interpolate frame rate, or extend timeline duration.",
        purpose: "Polish the generated clip into broadcast or social-ready commercial assets.",
        prompt: "Extend video sequence by 4 seconds maintaining identical character consistency, lighting direction, and camera inertia. Upscale to crystal clear 4K UHD.",
        variables: [{ name: "EXTEND_SECONDS" }],
        example: { output: "Smoothly extended 9-second seamless video render." },
        tips: ["Use keyframe locking at the seam when extending clips."],
      }, 5),
    ];
  }

  if (normKey.includes("website") || normKey.includes("web")) {
    return [
      normalizeTemplateStep({
        order: 1,
        title: "Define Project Context",
        description: "Specify business domain, target audience, core value proposition, and tech stack requirements.",
        purpose: "Ground the AI engineer in product goals, conversion objectives, and brand tone.",
        prompt: "Build a production-grade [PROJECT_TYPE] for [TARGET_AUDIENCE]. The core value proposition is [VALUE_PROPOSITION]. Tech stack: Next.js 15, Tailwind CSS, Lucide icons, accessible ARIA patterns, TypeScript.",
        variables: [{ name: "PROJECT_TYPE" }, { name: "TARGET_AUDIENCE" }, { name: "VALUE_PROPOSITION" }],
        example: { output: "B2B SaaS Analytics Dashboard for enterprise engineering teams." },
        tips: ["State non-functional requirements such as dark mode support and keyboard navigation early."],
      }, 0),
      normalizeTemplateStep({
        order: 2,
        title: "Define Website Structure",
        description: "Outline the page layout, sitemap hierarchy, navigation system, and section breakdown.",
        purpose: "Create the architectural skeleton before implementing styling or components.",
        prompt: "Structure the application with the following pages: [PAGES_LIST]. The main landing page must feature: Sticky Header with Navigation, Hero Section with Live Metric Card, Feature Matrix, Social Proof Logo Wall, Interactive Pricing Table, and Footer.",
        variables: [{ name: "PAGES_LIST" }],
        example: { output: "5-page structure: Home, Features, Pricing, Docs, and Contact." },
        tips: ["Ensure each section has a single primary conversion goal."],
      }, 1),
      normalizeTemplateStep({
        order: 3,
        title: "Generate UI & Design Tokens",
        description: "Generate the visual design tokens, modern color palette, typography hierarchy, and glassmorphism cards.",
        purpose: "Establish a cohesive premium aesthetic matching industry leaders.",
        prompt: "Design a high-end UI in [DESIGN_THEME: Dark Mode / Neo-Brutalist / Clean Minimal]. Primary accent [ACCENT_COLOR], slate dark background (#0B0F19), frosted glass blur cards (backdrop-blur-md border-white/10), Inter typography, smooth hover transitions.",
        variables: [{ name: "DESIGN_THEME" }, { name: "ACCENT_COLOR" }],
        example: { output: "Deep obsidian theme with emerald glowing accents and micro-borders." },
        tips: ["Define consistent spacing scale (4, 8, 12, 16, 24, 32, 48px)."],
      }, 2),
      normalizeTemplateStep({
        order: 4,
        title: "Generate Modular Components",
        description: "Implement reusable, composable React components with clean props interfaces.",
        purpose: "Keep code maintainable and prevent monolithic page files.",
        prompt: "Create isolated modular components: [COMPONENT_LIST: HeroSection, FeatureCard, MetricBadge, PricingToggle, TestimonialCarousel]. Include TypeScript interfaces, responsive breakpoint utilities, and loading skeleton states.",
        variables: [{ name: "COMPONENT_LIST" }],
        example: { output: "Self-contained FeatureCard component with Lucide icon and hover tilt effect." },
        tips: ["Always request mock fallback data for every component state."],
      }, 3),
      normalizeTemplateStep({
        order: 5,
        title: "Add Functionality & State",
        description: "Connect client-side interactivity, state management, form validation, and reactive calculations.",
        purpose: "Transform static visuals into an interactive, functional web application.",
        prompt: "Implement interactive client state: [INTERACTIONS: Monthly/Annual billing toggle with discount calculation, live search filter with instant debouncing, responsive mobile drawer menu, modal dialogs].",
        variables: [{ name: "INTERACTIONS" }],
        example: { output: "Working pricing toggle updating price amounts dynamically with discount pill." },
        tips: ["Use React useState and useMemo for silky smooth UI feedback."],
      }, 4),
      normalizeTemplateStep({
        order: 6,
        title: "Refine, Test & Optimize",
        description: "Audit responsiveness on mobile, tablet, and desktop, improve Lighthouse score, and finalize code.",
        purpose: "Deliver production-ready code suitable for immediate deployment on Vercel or Netlify.",
        prompt: "Audit layout responsiveness across 375px mobile, 768px tablet, and 1440px desktop. Ensure all touch targets >= 44px, zero horizontal overflow, accessible color contrast ratios, and clean semantic HTML5 markup.",
        variables: [{ name: "TARGET_DEVICES" }],
        example: { output: "100/100 Lighthouse accessibility compliance report." },
        tips: ["Verify all interactive elements have visible focus-visible rings."],
      }, 5),
    ];
  }

  if (normKey.includes("slide") || normKey.includes("presentation")) {
    return [
      normalizeTemplateStep({
        order: 1,
        title: "Presentation Strategy",
        description: "Define the core pitch thesis, narrative arc, executive audience expectations, and desired decision outcome.",
        purpose: "Establish the persuasion framework before designing any individual slides.",
        prompt: "Act as an elite presentation strategist. Build a high-stakes presentation strategy for [TOPIC] targeting [AUDIENCE]. The core objective is [OBJECTIVE]. Establish a narrative arc: Hook -> Tension/Problem -> Unique Solution -> Defensible Proof -> Clear Call to Action.",
        variables: [{ name: "TOPIC" }, { name: "AUDIENCE" }, { name: "OBJECTIVE" }],
        example: { output: "Series A Seed Pitch strategy for enterprise cybersecurity SaaS." },
        tips: ["Focus on the single decision you want the audience to make at the end of the meeting."],
      }, 0),
      normalizeTemplateStep({
        order: 2,
        title: "Presentation Structure & Outline",
        description: "Map out the slide-by-slide storyline with specific purpose and key takeaway per slide.",
        purpose: "Ensure logical pacing and eliminate redundant or weak slides.",
        prompt: "Generate a sequenced [SLIDE_COUNT]-slide presentation outline for [TOPIC]. For each slide, define: 1. Slide Title, 2. Core Takeaway (one sentence), 3. Data Point or Evidence Required, 4. Strategic Narrative Function.",
        variables: [{ name: "SLIDE_COUNT" }, { name: "TOPIC" }],
        example: { output: "10-slide outline: Vision, Problem, Solution, Traction, Market, Moat, Business Model, Team, Financials, Ask." },
        tips: ["Limit each slide to one core idea or takeaway."],
      }, 1),
      normalizeTemplateStep({
        order: 3,
        title: "Individual Slide Planning",
        description: "Determine exact layout archetype (Hero Stat, 3-Column Split, Comparison, Timeline) for every slide.",
        purpose: "Avoid repetitive bullet lists by pairing each slide's content with an optimal visual pattern.",
        prompt: "For each slide in the outline, assign the highest-converting visual layout archetype: [LAYOUTS: Big Metric Callout / Split Screen Comparison / Process Flow / Feature Grid / Milestone Roadmap]. Define spatial zones for headline, supporting narrative, and data visualization.",
        variables: [{ name: "LAYOUT_SYSTEM" }],
        example: { output: "Slide 04 Traction: Three oversized stat counters with subtle upward trend graph." },
        tips: ["Alternate high-density slides with spacious visual breathers."],
      }, 2),
      normalizeTemplateStep({
        order: 4,
        title: "Generate Slide Content & Copy",
        description: "Draft punchy, executive-level slide copy, scannable headlines, and concise supporting proof points.",
        purpose: "Write slide content that commands attention without overwhelming readers with paragraphs.",
        prompt: "Write presentation slide copy for [SLIDE_TITLE]. Requirements: Action-oriented 6-8 word headline, 3 crisp bullet points starting with strong verbs (max 12 words per bullet), 1 prominent quantified metric callout, and speaker notes.",
        variables: [{ name: "SLIDE_TITLE" }],
        example: { output: "'184% YoY Net Retention Powered by Network Moat' with 3 supporting proof metrics." },
        tips: ["Headlines should declare the conclusion, not just describe the topic."],
      }, 3),
      normalizeTemplateStep({
        order: 5,
        title: "Define Visual Direction & Theme",
        description: "Establish typography pairs, brand color palette, data visualization rules, and slide aspect ratio.",
        purpose: "Ensure the deck looks bespoke, polished, and unmistakably executive.",
        prompt: "Define presentation visual styling: 16:9 widescreen format, [COLOR_PALETTE: e.g. Midnight Navy #0A1128, Electric Teal #00E8C6, Crisp Slate #64748B], modern sans-serif typography (Plus Jakarta Sans header, Inter body), 40% generous negative space, high-contrast charts.",
        variables: [{ name: "COLOR_PALETTE" }],
        example: { output: "Executive dark-mode deck styling with high-contrast glowing data charts." },
        tips: ["Keep brand color usage to 1 dominant background, 1 text color, and 1 accent highlight."],
      }, 4),
      normalizeTemplateStep({
        order: 6,
        title: "Generate Slides in AI Presentation Tool",
        description: "Execute generation in Gamma, Beautiful.ai, Tome, or SlidesGPT using structured markdown prompts.",
        purpose: "Produce the visual deck with styled components, cards, and diagrams.",
        prompt: "Generate presentation deck in [TOOL_NAME: Gamma / Pitch / Beautiful.ai] using this structured deck prompt: Theme: [THEME_NAME], Tone: [TONE], Output: [SLIDE_COUNT] slides with custom icons, clean cards, and no generic stock photography.",
        variables: [{ name: "TOOL_NAME" }, { name: "THEME_NAME" }, { name: "SLIDE_COUNT" }],
        example: { output: "Fully editable 10-slide deck loaded directly into Gamma or Pitch." },
        tips: ["Import markdown directly into Gamma for instantaneous structured formatting."],
      }, 5),
      normalizeTemplateStep({
        order: 7,
        title: "Review & Refine Narrative Flow",
        description: "Verify speaker notes, audit visual hierarchy, check data accuracy, and export to PDF / PPTX.",
        purpose: "Final quality assurance pass before executive presentation delivery.",
        prompt: "Conduct an executive review of the presentation: 1. Does the first 60 seconds hook the room? 2. Is every chart clearly labeled? 3. Are speaker notes conversational and timing-annotated? 4. Prepare export in native editable PPTX and vector PDF.",
        variables: [{ name: "EXPORT_FORMAT" }],
        example: { output: "Flawless investor-ready deck with speaker notes and PDF export." },
        tips: ["Read the deck aloud using only the headlines to verify narrative flow."],
      }, 6),
    ];
  }

  if (normKey.includes("poster") || normKey.includes("design")) {
    return [
      normalizeTemplateStep({
        order: 1,
        title: "Define Design Concept & Message",
        description: "Clarify the single primary message, target demographic, and emotional tone.",
        purpose: "Focus graphic impact on one memorable idea rather than cluttered messaging.",
        prompt: "Create a design concept for a [DESIGN_TYPE: Event Poster / Social Banner / Product Ad / Billboard] promoting [SUBJECT]. The core message is [CORE_MESSAGE]. Desired mood: [MOOD: Bold & Futuristic / Warm & Artisanal / Brutalist High-Energy].",
        variables: [{ name: "DESIGN_TYPE" }, { name: "SUBJECT" }, { name: "CORE_MESSAGE" }, { name: "MOOD" }],
        example: { output: "International Electronic Music Festival poster with hypnotic cybernetic visual theme." },
        tips: ["A poster must communicate its message in less than 3 seconds at a glance."],
      }, 0),
      normalizeTemplateStep({
        order: 2,
        title: "Define Content & Text Hierarchy",
        description: "Structure copy into primary headline, supporting subhead, key details, and call to action.",
        purpose: "Guide the viewer's eye systematically from most important to fine print details.",
        prompt: "Organize design typography hierarchy: 1. Main Headline: '[HEADLINE]', 2. Sub-headline: '[SUBHEADLINE]', 3. Event Details: [DATE_TIME_VENUE], 4. Call to Action: '[CTA_TEXT]'. Maintain strict size contrast ratios.",
        variables: [{ name: "HEADLINE" }, { name: "SUBHEADLINE" }, { name: "CTA_TEXT" }],
        example: { output: "Massive brutalist headline 'FUTURE SOUNDS 2026' with compact venue details below." },
        tips: ["Limit font sizes to no more than 3 distinct tiers (Headline, Supporting, Details)."],
      }, 1),
      normalizeTemplateStep({
        order: 3,
        title: "Define Composition & Grid System",
        description: "Establish layout grid (Golden Ratio, Asymmetric Rule of Thirds, Radial, or Swiss Column Grid).",
        purpose: "Create balance, focal pull, and deliberate negative space.",
        prompt: "Structure composition using a [GRID_TYPE: Asymmetric Swiss 12-Column / Radial Center / Split Horizon] layout. Aspect ratio: [ASPECT_RATIO: 4:5 / 9:16 / 1:1 / A2 Poster]. Ensure 25% minimum negative space to give typography breathing room.",
        variables: [{ name: "GRID_TYPE" }, { name: "ASPECT_RATIO" }],
        example: { output: "Bold asymmetric Swiss grid with heavy typography anchoring bottom left." },
        tips: ["Leave adequate margin padding so text doesn't get clipped on physical prints or social crops."],
      }, 2),
      normalizeTemplateStep({
        order: 4,
        title: "Define Visual Direction & Color Palette",
        description: "Set color harmony, textures, lighting treatment, and illustrative or photographic style.",
        purpose: "Evoke strong emotional resonance through coordinated visual art direction.",
        prompt: "Art direction: [VISUAL_STYLE: 3D Glossy Render / Vintage Halftone / Cyberpunk Neon / Bauhaus Geometric]. Color palette: [PRIMARY_COLOR], [SECONDARY_COLOR], and [ACCENT_HIGHLIGHT]. Include [TEXTURE: grain / metallic sheen / paper fold / chromatic aberration].",
        variables: [{ name: "VISUAL_STYLE" }, { name: "PRIMARY_COLOR" }, { name: "ACCENT_HIGHLIGHT" }],
        example: { output: "Midnight obsidian background with acid lime typography and Risograph paper grain." },
        tips: ["Use high-contrast complementary colors for maximum visibility in social feeds."],
      }, 3),
      normalizeTemplateStep({
        order: 5,
        title: "Generate Design Artwork",
        description: "Execute the generative graphic render using Midjourney, Ideogram, or Canva Magic Studio.",
        purpose: "Produce the core high-resolution visual artwork with legible integrated typography.",
        prompt: "Master graphic design prompt for [AI_TOOL: Ideogram v2 / Midjourney v6.1]: [POSTER_PROMPT_DIRECTIVE] with integrated text '[HEADLINE]' rendered in bold clean typography, 300 DPI print-ready quality.",
        variables: [{ name: "AI_TOOL" }, { name: "POSTER_PROMPT_DIRECTIVE" }, { name: "HEADLINE" }],
        example: { output: "High-resolution 300 DPI poster graphic with crisp integrated vector-grade typography." },
        tips: ["Use Ideogram v2 when accurate text spelling inside the image is critical."],
      }, 4),
      normalizeTemplateStep({
        order: 6,
        title: "Refine & Multi-Format Export",
        description: "Verify text readability, balance contrast, and adapt to multiple aspect ratios.",
        purpose: "Deliver multi-channel campaign assets ready for Instagram, Twitter, Print, and Web.",
        prompt: "Finalize design assets: 1. Check color CMYK / sRGB gamut compliance, 2. Resize and adapt layout to [FORMATS: 9:16 Story, 1:1 Feed, 16:9 Landscape Banner], 3. Export lossless PNG and vector PDF.",
        variables: [{ name: "TARGET_FORMATS" }],
        example: { output: "Complete campaign package: 9:16 Instagram Story, 1:1 Square, and A2 Print PDF." },
        tips: ["Ensure headline remains legible when scaled down to a small thumbnail on mobile."],
      }, 5),
    ];
  }

  // Default: Image Generation
  return [
    normalizeTemplateStep({
      order: 1,
      title: "Define Image Concept & Subject",
      description: "Establish the core subject, focal center, and narrative concept for the image.",
      purpose: "Define the fundamental hero element before adding styling or environmental modifiers.",
      prompt: "Ultra-detailed [SHOT_TYPE: close-up / medium shot / wide angle] of [SUBJECT], positioned in [COMPOSITION_PLACEMENT]. Crisp focal clarity, realistic textures.",
      variables: [{ name: "SHOT_TYPE" }, { name: "SUBJECT" }, { name: "COMPOSITION_PLACEMENT" }],
      example: { output: "Macro portrait of an artisan watchmaker examining gear mechanism with loupe." },
      tips: ["Be specific about material properties (e.g. brushed titanium, frosted glass, aged leather)."],
    }, 0),
    normalizeTemplateStep({
      order: 2,
      title: "Build Image Prompt with Environment",
      description: "Place the subject inside a rich, atmospheric environment with complementary contextual props.",
      purpose: "Provide visual context so the AI doesn't render an isolated floating subject.",
      prompt: "The [SUBJECT] is located in [ENVIRONMENT / SETTING]. In the background, [BACKGROUND_DETAILS]. Natural atmospheric depth of field, gentle [ATMOSPHERE: mist / dust motes / bokeh / sunbeams].",
      variables: [{ name: "ENVIRONMENT" }, { name: "BACKGROUND_DETAILS" }, { name: "ATMOSPHERE" }],
      example: { output: "Sunlit Scandinavian timber workshop with wood shavings and morning fog outside window." },
      tips: ["Layer foreground, midground, and background to create 3D visual depth."],
    }, 1),
    normalizeTemplateStep({
      order: 3,
      title: "Define Visual Direction & Lighting",
      description: "Specify camera lens, f-stop aperture, lighting type, color grading, and film stock aesthetics.",
      purpose: "Give the render professional photographic quality rather than an AI plastic look.",
      prompt: "Photographed on [CAMERA: Hasselblad H6D-100c / Sony A7R V], [LENS: 85mm portrait lens], aperture [APERTURE: f/1.8]. Lighting: [LIGHTING: golden hour diffused sunlight / dramatic Rembrandt studio lighting / soft overcast window light]. Color grade: [COLOR_GRADE: editorial Vogue / Kodak Portra 400].",
      variables: [{ name: "CAMERA" }, { name: "LENS" }, { name: "LIGHTING" }, { name: "COLOR_GRADE" }],
      example: { output: "Hasselblad 85mm f/1.8 with diffused northern studio light and organic skin tones." },
      tips: ["Include specific lighting angles (e.g. 45-degree key light with subtle golden rim light)."],
    }, 2),
    normalizeTemplateStep({
      order: 4,
      title: "Generate Image & Evaluate Seeds",
      description: "Execute the generative render in Midjourney, DALL-E, Flux, or Stable Diffusion.",
      purpose: "Produce 4 initial candidate seeds to evaluate anatomy, composition, and texture.",
      prompt: "[COMBINED_PROMPT]: [SUBJECT] in [ENVIRONMENT], [LIGHTING], [CAMERA_SETTINGS], photorealistic, 8k resolution, award-winning editorial quality --ar [ASPECT_RATIO: 16:9 / 4:5 / 1:1] --style raw --v 6.1.",
      variables: [{ name: "ASPECT_RATIO" }],
      example: { output: "Four high-fidelity candidate renders ready for seed selection." },
      tips: ["Use --style raw in Midjourney to reduce oversaturated AI aesthetic."],
    }, 3),
    normalizeTemplateStep({
      order: 5,
      title: "Refine Result & Upscale",
      description: "Vary regions with inpainting, correct small artifacts, and upscale to ultra-high resolution.",
      purpose: "Achieve commercial-grade production finish ready for print or web publication.",
      prompt: "Vary region / inpaint [AREA_TO_REFINE] with instruction: [REFINEMENT_DIRECTIVE]. Execute subtle upscale (2x / 4x) preserving fine microscopic surface details, no over-sharpening.",
      variables: [{ name: "AREA_TO_REFINE" }, { name: "REFINEMENT_DIRECTIVE" }],
      example: { output: "Flawlessly upscaled 4096x2304 commercial master render." },
      tips: ["Upscale with subtle noise retention to maintain organic analog texture."],
    }, 4),
  ];
}

/**
 * Combines workflow step prompts into a single ordered sequence.
 */
export function combineWorkflowStepPrompts(steps: TemplateStep[]): string {
  if (!steps || steps.length === 0) return "";
  return [...steps]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter((s) => Boolean(s.prompt && s.prompt.trim().length > 0))
    .map(
      (s) =>
        `### Step ${String(s.order).padStart(2, "0")}: ${s.title}\n${(s.prompt || "").trim()}`
    )
    .join("\n\n");
}

/**
 * SINGLE SOURCE OF TRUTH PROMPT COMBINER (Requirement 12 & 13)
 * Follows the canonical architecture:
 * CONTEXT
 * ↓
 * UI PROMPT
 * ↓
 * WORKFLOW PROMPTS
 */
export function combineFullTemplatePrompt(
  template: Partial<Template>
): string {
  const parts: string[] = [];

  const contextPrompt = (template.contextPrompt || "").trim();
  const uiPrompt = (template.uiPrompt || "").trim();
  const mainPrompt = (template.promptText || (template as any).prompt || "").trim();

  if (contextPrompt) {
    parts.push(`[CONTEXT PROMPT]\n\n${contextPrompt}`);
  }

  if (uiPrompt) {
    parts.push(`[UI PROMPT]\n\n${uiPrompt}`);
  }

  if (mainPrompt && mainPrompt !== uiPrompt && !uiPrompt.includes(mainPrompt)) {
    parts.push(mainPrompt);
  }

  // Fallback to legacy single prompt if nothing was accumulated
  if (parts.length === 0) {
    return mainPrompt;
  }

  return parts.join("\n\n");
}
