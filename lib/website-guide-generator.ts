import {
  Template,
  UsageStep,
  WebsiteAsset,
  WebsiteAssetType,
  WebsiteGenerationType,
  WebsiteWorkflowConfig,
} from "./types";

/**
 * Normalizes tool name for matching.
 */
function normalizeTool(name: string): string {
  return (name || "").toLowerCase().trim();
}

/**
 * Checks if a template is an AI Website Making / Website Generation template.
 */
export function isWebsiteGenerationTemplate(template: {
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
    catId === "cat-web-code" ||
    catId === "cat-website-making" ||
    catId.includes("web") ||
    catName.includes("website") ||
    catName.includes("saas") ||
    catName.includes("portfolio") ||
    catName.includes("apps") ||
    catName.includes("hero") ||
    catName.includes("sections")
  ) {
    return true;
  }

  // Tag matching
  const webKeywords = [
    "landing page",
    "website",
    "web app",
    "saas",
    "portfolio",
    "ecommerce",
    "e-commerce",
    "dashboard",
    "web",
    "ui",
    "frontend",
    "fullstack",
    "v0",
    "bolt",
    "lovable",
    "framer",
    "stitch",
    "cursor",
    "replit",
    "antigravity",
    "webflow",
    "wix",
    "figma",
  ];

  if (tags.some((t) => webKeywords.some((kw) => t.includes(kw)))) {
    return true;
  }

  // Tool matching
  const webTools = [
    "v0",
    "lovable",
    "bolt",
    "framer",
    "stitch",
    "replit",
    "antigravity",
    "cursor",
    "webflow",
    "wix",
  ];

  const hasWebTool = (template.recommendedTools || []).some((tool) =>
    webTools.some((wt) => tool.toolName.toLowerCase().includes(wt))
  );
  if (hasWebTool) return true;

  // Name / description matching
  if (
    name.includes("landing page") ||
    name.includes("website") ||
    name.includes("portfolio") ||
    name.includes("dashboard") ||
    name.includes("saas") ||
    desc.includes("landing page") ||
    desc.includes("website")
  ) {
    return true;
  }

  return false;
}

/**
 * Human-readable title for each website generation workflow.
 */
export function getWebsiteWorkflowTitle(type: WebsiteGenerationType): string {
  switch (type) {
    case "prompt-to-website":
      return "Prompt → Website Generation";
    case "prompt-to-landing-page":
      return "Prompt → High-Converting Landing Page";
    case "prompt-to-web-app":
      return "Prompt → Interactive Web App";
    case "screenshot-to-website":
      return "Screenshot → Pixel-Accurate Website";
    case "image-to-website":
      return "Design Image → Website";
    case "figma-to-website":
      return "Figma Design → Production Website";
    case "existing-website-redesign":
      return "Existing Website → Modern Redesign";
    case "existing-code-modification":
      return "Existing Codebase → Feature Enhancement";
    case "multi-page-website":
      return "Multi-Page Website Architecture";
    case "functional-web-app":
      return "Full-Stack Web App with Backend & Auth";
    default:
      return "AI Website Generation";
  }
}

/**
 * Human-readable short description for each workflow type.
 */
export function getWebsiteWorkflowDescription(
  type: WebsiteGenerationType,
  toolName: string
): string {
  switch (type) {
    case "prompt-to-website":
      return `Generate a responsive, production-ready website from scratch using prompt directives in ${toolName}.`;
    case "prompt-to-landing-page":
      return `Build a conversion-focused landing page with hero, social proof, feature grid, and pricing in ${toolName}.`;
    case "prompt-to-web-app":
      return `Scaffold a dynamic web application with responsive UI, state management, and real-time telemetry in ${toolName}.`;
    case "screenshot-to-website":
      return `Transform reference UI screenshots into responsive, clean code matching layout and typography in ${toolName}.`;
    case "image-to-website":
      return `Convert visual mockups and layout graphics into functional, responsive web components in ${toolName}.`;
    case "figma-to-website":
      return `Import Figma design tokens, frames, and components directly into ${toolName} for rapid code generation.`;
    case "existing-website-redesign":
      return `Modernize the aesthetics, visual hierarchy, and responsiveness of an existing site while preserving core logic in ${toolName}.`;
    case "existing-code-modification":
      return `Enhance an existing repository or component tree with new interactive features and styling in ${toolName}.`;
    case "multi-page-website":
      return `Generate and connect multiple distinct pages (Home, About, Services, Products, Contact) with cohesive navigation in ${toolName}.`;
    case "functional-web-app":
      return `Build a full-stack web application with authentication, database connectivity, and backend APIs in ${toolName}.`;
    default:
      return `Follow this structured walkthrough to generate, refine, test, and deploy this project in ${toolName}.`;
  }
}

/**
 * Resolves the dynamic website workflow config for a given template.
 */
export function resolveWebsiteWorkflow(
  template: Template,
  activeToolName?: string
): WebsiteWorkflowConfig {
  if (template.websiteWorkflow) {
    return {
      ...template.websiteWorkflow,
      tool: activeToolName || template.websiteWorkflow.tool,
    };
  }

  const tags = (template.tags || []).map((t) => t.toLowerCase());
  const name = (template.name || "").toLowerCase();
  const desc = (template.description || "").toLowerCase();
  const prompt = (template.promptText || "").toLowerCase();
  const subcategory = (template.subcategoryName || "").toLowerCase();

  let generationType: WebsiteGenerationType = "prompt-to-landing-page";
  const assets: WebsiteAsset[] = [];
  let projectType = "Landing Page";
  let techStack = ["Next.js", "Tailwind CSS", "TypeScript", "shadcn/ui"];
  let pages = ["Home"];
  let features: string[] = [];
  let requiresCodeExport = true;
  let requiresDeployment = true;

  // 1. Detect Screenshot -> Website
  if (
    tags.includes("screenshot") ||
    tags.includes("screenshot-to-code") ||
    name.includes("screenshot") ||
    desc.includes("screenshot")
  ) {
    generationType = "screenshot-to-website";
    projectType = "Pixel-Accurate Website from Screenshot";
    assets.push({
      id: "asset-screenshot",
      type: "screenshot",
      label: `${template.name} Reference Screenshot`,
      description: "Upload this UI screenshot as the primary visual reference for layout, spacing, and typography.",
      url: template.imageUrl || "/images/categories/website-making.jpg",
      required: true,
      role: "Visual Reference Screenshot",
      dimensions: "1920x1080 Desktop Viewport",
    });
  }
  // 2. Detect Figma / Design -> Website
  else if (
    tags.includes("figma") ||
    name.includes("figma") ||
    desc.includes("figma")
  ) {
    generationType = "figma-to-website";
    projectType = "Figma Design to Code";
    assets.push({
      id: "asset-figma",
      type: "figma-design",
      label: `${template.name} Figma File / Component Tokens`,
      description: "Link your Figma design file or exported SVG/frame assets for component conversion.",
      required: true,
      role: "Design System Source",
    });
  }
  // 3. Detect Existing Website -> Redesign
  else if (
    tags.includes("redesign") ||
    name.includes("redesign") ||
    desc.includes("redesign")
  ) {
    generationType = "existing-website-redesign";
    projectType = "Modern Website Redesign";
    assets.push({
      id: "asset-existing-site",
      type: "existing-website",
      label: "Existing Website URL / Wireframe",
      description: "Provide the existing URL or code structure to redesign with modern aesthetics.",
      required: true,
      role: "Legacy Base Structure",
    });
  }
  // 4. Detect Existing Code -> Modification
  else if (
    tags.includes("modification") ||
    tags.includes("refactor") ||
    desc.includes("existing code")
  ) {
    generationType = "existing-code-modification";
    projectType = "Codebase Enhancement";
    assets.push({
      id: "asset-existing-code",
      type: "existing-code",
      label: "Existing Repository / Component File",
      description: "Provide the target component or repo files requiring feature enhancements.",
      required: true,
      role: "Source Code Base",
    });
  }
  // 5. Detect Multi-Page Website / E-commerce
  else if (
    tags.includes("ecommerce") ||
    tags.includes("e-commerce") ||
    tags.includes("multi-page") ||
    name.includes("store") ||
    name.includes("jewelry") ||
    name.includes("shop") ||
    desc.includes("storefront") ||
    desc.includes("multi-page")
  ) {
    generationType = "multi-page-website";
    projectType = "Full E-Commerce Website";
    pages = ["Home", "Shop / Catalog", "Product Details", "Cart", "Checkout", "About", "Contact"];
    features = ["Product Catalog Grid", "Cart State Management", "Checkout Flow", "Category Filters", "Search"];
    assets.push(
      {
        id: "asset-brand-logo",
        type: "logo",
        label: "Brand Logo Vector (SVG)",
        description: "Vector logo asset for navigation header and footer branding.",
        required: true,
        role: "Brand Identity",
      },
      {
        id: "asset-product-images",
        type: "product-images",
        label: "High-Resolution Product Photography",
        description: "Curated product images for hero spotlight and catalog cards.",
        url: template.imageUrl || "/images/categories/website-making.jpg",
        required: true,
        role: "Catalog Imagery",
      }
    );
  }
  // 6. Detect Functional Web App
  else if (
    tags.includes("app") ||
    tags.includes("dashboard") ||
    tags.includes("cybersecurity") ||
    name.includes("telemetry") ||
    name.includes("dashboard") ||
    name.includes("consentinel") ||
    desc.includes("dashboard") ||
    desc.includes("telemetry")
  ) {
    generationType = "functional-web-app";
    projectType = "Interactive Web Application";
    pages = ["Overview Dashboard", "Live Telemetry", "Analytics", "Settings", "Auth Modal"];
    features = [
      "Real-time Telemetry / Charts",
      "Authentication / Protected Routes",
      "Interactive Filter Controls",
      "Dark / Light Mode Switching",
      "State Management",
    ];
  }
  // 7. Detect Prompt -> Landing Page
  else {
    generationType = "prompt-to-landing-page";
    projectType = "High-Converting SaaS Landing Page";
    pages = ["Hero Section", "Features Grid", "Live Telemetry / Demo", "Social Proof", "Pricing Calculator", "FAQ", "Footer"];
    features = [
      "Glassmorphic Telemetry Cards",
      "Interactive Pricing Switcher",
      "Responsive Navigation Bar",
      "Animated Hero Visuals",
    ];
  }

  // Detect tech stack from prompt
  if (prompt.includes("three.js") || prompt.includes("canvas")) {
    techStack = ["Next.js", "Three.js", "Tailwind CSS", "TypeScript"];
  } else if (prompt.includes("vite")) {
    techStack = ["React", "Vite", "Tailwind CSS", "TypeScript"];
  } else if (prompt.includes("next.js") || prompt.includes("react")) {
    techStack = ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "TypeScript"];
  }

  return {
    tool: activeToolName,
    generationType,
    assets: assets.length > 0 ? assets : undefined,
    projectType,
    techStack,
    pages,
    features,
    prompt: template.promptText,
    requiresCodeExport,
    requiresDeployment,
    targetAudience: "Designers, Developers, and Founders",
  };
}

export interface GuideContext {
  templateName?: string;
  promptText?: string;
  style?: string;
  categoryId?: string;
  assets?: WebsiteAsset[];
}

/**
 * Dynamically generates 8–10 tool-specific, project-tailored steps for AI Website Generation.
 */
export function generateWebsiteGuide(
  workflow: WebsiteWorkflowConfig,
  toolName: string,
  modelName?: string,
  context?: GuideContext
): UsageStep[] {
  function buildSteps(): UsageStep[] {
    const norm = normalizeTool(toolName);
  const genType = workflow.generationType;
  const projectType = workflow.projectType || "Website";
  const techStackStr = (workflow.techStack || ["Next.js", "Tailwind CSS"]).join(" + ");
  const pagesList = workflow.pages || ["Home"];
  const hasAssets = !!(workflow.assets && workflow.assets.length > 0);
  const hasMultiplePages = pagesList.length > 1;
  const isEcommerce = genType === "multi-page-website" || projectType.toLowerCase().includes("commerce");
  const isApp = genType === "functional-web-app" || genType === "prompt-to-web-app";
  const isScreenshot = genType === "screenshot-to-website";
  const isFigma = genType === "figma-to-website";
  const isRedesign = genType === "existing-website-redesign";

  // Prompt excerpts
  const basePrompt = context?.promptText || workflow.prompt || "the provided prompt";

  // ----------------------------------------------------
  // 1. GOOGLE STITCH WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("stitch")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Google Stitch",
        instruction:
          "Launch Google Stitch in your browser or open your Stitch MCP design workspace.",
        tip: "Google Stitch excels at generating design system tokens, screen variants, and consistent multi-screen interfaces.",
      },
      {
        stepNumber: 2,
        title: "Create Project & Set Device Canvas",
        instruction: `Create a new Stitch project named '${context?.templateName || "AWA Project"}' and select the primary viewport (${isApp ? "Desktop 1440px Web App" : "Desktop 1920px Responsive"}).`,
        tip: "Establishing the correct frame dimensions early ensures all generated layout containers scale cleanly.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Reference Screenshot & Assets",
        instruction: isScreenshot
          ? `Upload the reference screenshot (${context?.templateName || "UI Reference"}) directly to Stitch using the image input panel.`
          : `Upload the provided brand assets (${(workflow.assets || []).map((a) => a.label).join(", ")}) to inform Stitch's visual hierarchy.`,
        tip: "Stitch analyzes layout grids, contrast ratios, and component boundaries directly from reference images.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter the Generation Prompt",
        instruction: `Paste the AWA prompt into the prompt box. Direct Stitch to generate the layout with ${techStackStr} token structure.`,
        examplePrompt: `Create a modern ${projectType} featuring: ${workflow.features?.join(", ") || "clean layout, dark mode, responsive grid"}. Style: ${context?.style || "Clean Modern"} with strict design tokens.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Initial Screen",
        instruction:
          "Execute the generation. Stitch will synthesize the complete screen, defining color palettes, typography scales, and modular cards.",
        tip: "Review the initial layout for proper spacing units (4px/8px grid) and optical alignment.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Variants & Alternate Layouts",
        instruction:
          "Use Stitch's variant generator to produce 2–3 alternative card hierarchies and hero layouts to compare visual impact.",
        examplePrompt:
          "Generate 3 variants of the hero section: one with centered typography, one with split telemetry card, and one with glassmorphic glow.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Refine Design System & Component Hierarchy",
        instruction:
          "Apply design system tokens across all generated elements to ensure unified button radii, text colors, and card borders.",
        examplePrompt:
          "Enforce consistent 12px border radius, subtle obsidian border (#27272a), and vibrant gradient accents across all interactive components.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Test Responsive Breakpoints",
        instruction:
          "Preview the screen across Desktop (1440px), Tablet (768px), and Mobile (375px) in Stitch's multi-device preview.",
        tip: "Ensure hamburger navigation triggers properly on mobile viewports and multi-column grids collapse gracefully.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export Design Tokens & React/Tailwind Code",
        instruction:
          "Export the generated project as clean React components with Tailwind CSS utility classes or export design system tokens for your codebase.",
        tip: "Stitch allows copying individual component code blocks or downloading the full screen bundle.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 2. LOVABLE WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("lovable")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Lovable",
        instruction: "Navigate to lovable.dev and log in to your creator workspace.",
        tip: "Lovable provides a full-stack in-browser AI development environment with live React previews and instant Supabase backend integration.",
      },
      {
        stepNumber: 2,
        title: "Start a New Full-Stack Project",
        instruction: `Click 'Create New App' and name your project '${context?.templateName || "AWA Web Project"}'. Select ${techStackStr} as your framework foundation.`,
        tip: "Lovable automatically initializes a Git-backed Vite + React + Tailwind + shadcn/ui repository.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Reference Screenshot / Brand Assets",
        instruction: isScreenshot
          ? `Click the image attachment icon in Lovable's prompt bar and upload '${context?.templateName} Reference Screenshot'. Tell Lovable to reproduce this layout precisely.`
          : `Upload your brand assets (${(workflow.assets || []).map((a) => a.label).join(", ")}) so Lovable can inject them into the asset folder.`,
        tip: "Lovable analyzes the screenshot's color palette, card structure, and typography hierarchy automatically.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter the Project Prompt",
        instruction: `Paste the complete prompt into Lovable. Instruct the agent to build the full ${projectType} with modern animations and interactive state.`,
        examplePrompt: `Build a modern ${projectType} using React, Tailwind CSS, and Lucide icons. Key requirements: ${workflow.features?.join(", ") || "interactive components, responsive navigation, dark mode"}. Make all buttons and cards interactive.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Initial Full-Stack UI",
        instruction:
          "Click Generate. Watch Lovable scaffold the component tree, routing, and live preview in real time.",
        tip: "Examine the live preview pane immediately to confirm container widths, typography scaling, and dark mode background depth.",
      }
    );

    // If app or ecommerce, add backend/database step; if landing page, skip backend!
    if (isApp || isEcommerce) {
      steps.push({
        stepNumber: steps.length + 1,
        title: isEcommerce ? "Configure Cart State & Product Catalog" : "Connect Supabase Backend & Database",
        instruction: isEcommerce
          ? "Instruct Lovable to wire up interactive shopping cart state with local storage persistence, quantity toggles, and total calculation."
          : "Connect Lovable's integrated Supabase backend to enable user authentication, database tables, and real-time state synchronization.",
        examplePrompt: isEcommerce
          ? "Create a global cart context with addToCart, removeFromCart, quantity updates, and a slide-over cart drawer."
          : "Enable Supabase authentication with email/password login and create a database schema for user profiles and telemetry records.",
      });
    }

    // Conversational refinement
    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Iterative Conversational Refinement",
        instruction:
          "Use Lovable's chat panel to refine typography, micro-interactions, and visual polish.",
        examplePrompt:
          "Increase whitespace between sections, add subtle glassmorphism backdrop blur to the header, and add smooth hover zoom effects to cards.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Test Responsive Breakpoints & User Flows",
        instruction:
          "Toggle Lovable's mobile, tablet, and desktop preview modes. Test all navigation links, buttons, and forms.",
        tip: "Verify that mobile drawer menus close on link click and form validations display clear error states.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Publish to Custom Domain or Sync to GitHub",
        instruction:
          "Click 'Publish' in the top right to deploy instantly to a Lovable subdomain, connect your custom domain, or export the repository to GitHub.",
        tip: "Connecting to GitHub allows you to continue local development or trigger automated CI/CD pipelines via Vercel or Netlify.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 3. V0 BY VERCEL WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("v0")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open v0.dev",
        instruction: "Navigate to v0.dev and log in with your Vercel account.",
        tip: "v0 generates production-ready React, Tailwind CSS, and shadcn/ui components that integrate seamlessly into Next.js projects.",
      },
      {
        stepNumber: 2,
        title: "Start a New Generation",
        instruction: `Click 'New' to initialize a fresh prompt session. Name or tag the generation '${context?.templateName || "AWA Landing Page"}'.`,
        tip: "v0 supports iterative component evolution — start with the core layout and expand iteratively.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Reference Screenshot",
        instruction:
          "Attach the reference UI screenshot using the paperclip/image upload icon. Instruct v0 to match the layout and design aesthetic exactly.",
        examplePrompt:
          "Convert this uploaded UI screenshot into clean React + Tailwind CSS code. Match the exact card dimensions, typography, and dark theme colors.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter the Generation Prompt",
        instruction: `Paste the complete AWA prompt into v0. Include explicit component libraries: React, Tailwind CSS, Lucide icons, and Framer Motion.`,
        examplePrompt: `Create a ${projectType} featuring: ${workflow.features?.join(", ") || "modern hero, glassmorphic cards, responsive navigation"}. Use Tailwind CSS with dark mode obsidian background (#08090d).`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate First Version & Review",
        instruction:
          "Run the prompt. v0 will generate 3 visual variations. Click through each variant to review layout composition, spacing, and typography.",
        tip: "Choose the variant with the strongest structural grid and cleanest component breakdown.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Conversational UI & Responsive Refinement",
        instruction:
          "Use follow-up prompts to refine specific components, button hover transitions, and mobile viewport behavior.",
        examplePrompt:
          "Make the navbar sticky with glassmorphism backdrop blur. Ensure all cards on mobile stack in a single column with 16px padding.",
      }
    );

    if (hasMultiplePages) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Generate Additional Pages / Sections",
        instruction: `Prompt v0 to generate matching sub-components for additional views (${pagesList.slice(1).join(", ")}), maintaining identical theme tokens.`,
        examplePrompt: `Generate the '${pagesList[1] || "Features"}' section matching the exact same dark theme, border colors, and typography as the hero.`,
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Test Navigation, Forms & Responsiveness",
        instruction:
          "Use v0's built-in interactive preview to test responsive resizing, button click states, and modal dialogs.",
        tip: "Check desktop (1280px+), tablet (768px), and mobile (375px) in the top preview viewport switcher.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export Code via npx or Deploy to Vercel",
        instruction:
          "Copy the code or run `npx v0 add [block-id]` in your Next.js project terminal. Alternatively, click 'Deploy to Vercel' for instant live hosting.",
        tip: "Running `npx v0 add` automatically installs required shadcn/ui dependencies and adds the component to your local `/components` folder.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 4. BOLT.NEW WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("bolt")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Bolt.new",
        instruction: "Navigate to bolt.new in your browser.",
        tip: "Bolt runs full-stack Node.js / Vite environments directly inside your browser using WebContainers, providing instant hot-reloading.",
      },
      {
        stepNumber: 2,
        title: "Initialize WebContainer Project",
        instruction: `In the Bolt prompt bar, specify your framework: '${techStackStr}'. Name your workspace '${context?.templateName || "AWA Project"}'.`,
        tip: "Bolt will create `package.json`, install Tailwind CSS, Vite, and Lucide icons automatically.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Reference Assets & Screenshots",
        instruction:
          "Drag and drop reference screenshots and brand assets into Bolt's prompt box or the project file explorer.",
        tip: "Bolt can read image assets and inspect your file tree simultaneously.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter the Website Generation Prompt",
        instruction: `Paste the AWA prompt into Bolt's AI input. Direct Bolt to build out the complete file architecture for ${projectType}.`,
        examplePrompt: `Build a complete ${projectType} in React + Vite + Tailwind CSS. Requirements: ${workflow.features?.join(", ") || "responsive layout, clean components, interactive state"}. Write clean, modular components.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Generate Full-Stack Scaffolding & Live Preview",
        instruction:
          "Watch Bolt generate files in the left explorer, run `npm install`, and launch the live dev server in the right preview pane.",
        tip: "If any package resolution warning appears, Bolt will self-heal by adjusting dependency versions in `package.json`.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Refine Components & Styling via Chat",
        instruction:
          "Use the conversational prompt bar to request styling improvements, animations, or new components.",
        examplePrompt:
          "Add smooth Framer Motion entrance animations to the hero title and cards. Make the cards glow on hover with cyan/violet gradients.",
      }
    );

    if (hasMultiplePages || isEcommerce || isApp) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Configure Pages, Routing & State",
        instruction: `Ensure React Router is configured for pages: ${pagesList.join(", ")}. Verify global state works across routes.`,
        tip: "Bolt can generate separate route components in `/src/pages` with a shared navigation header.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Test Responsiveness & Interactive Controls",
        instruction:
          "Resize the browser preview pane to verify responsive flex/grid layouts across mobile, tablet, and widescreen viewports.",
        tip: "Open the Bolt integrated terminal to check for any console errors or hydration warnings.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Export to GitHub & Deploy to Netlify / Vercel",
        instruction:
          "Click the 'Deploy' button in the top right to deploy instantly to Netlify or click 'Export to GitHub' to push the entire repository.",
        tip: "You can also download the complete project as a ZIP archive for local development.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 5. FRAMER AI WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("framer")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Framer",
        instruction: "Open framer.com and click 'Start with AI' on your dashboard.",
        tip: "Framer AI generates responsive visual layouts on a freeform infinite canvas, allowing direct visual manipulation.",
      },
      {
        stepNumber: 2,
        title: "Enter the Site Generation Prompt",
        instruction: `Paste the AWA prompt into the Framer AI generator. Describe the brand aesthetic, target audience, and layout structure.`,
        examplePrompt: `Design a modern ${projectType} with a dark luxury aesthetic (#0a0a0c), glowing glass cards, bold typography, and sections for Hero, Features, Proof, and Pricing.`,
      },
      {
        stepNumber: 3,
        title: "Generate Site on Infinite Canvas",
        instruction:
          "Click Start. Framer AI will generate simultaneous layouts for Desktop (1200px+), Tablet (810px), and Mobile (390px).",
        tip: "Watch the canvas populate with responsive typography, color palettes, and interactive components.",
      },
      {
        stepNumber: 4,
        title: "Review & Adjust Responsive Breakpoints",
        instruction:
          "Inspect the generated breakpoints. Fine-tune card padding, text wrapping, and image aspect ratios for mobile and tablet views.",
        tip: "Framer uses responsive stacks and grids — changes made on Desktop cascade cleanly down to Mobile unless overridden.",
      },
      {
        stepNumber: 5,
        title: "Fine-Tune Typography, Colors & Shaders",
        instruction:
          "Use the Framer right sidebar to customize fonts (e.g. Inter, Plus Jakarta Sans), gradient meshes, and border radius.",
        tip: "Apply Framer's built-in Scroll and Hover effects to add subtle parallax and magnetic button interactions.",
      },
      {
        stepNumber: 6,
        title: "Configure Navigation & Interactive Links",
        instruction: `Set up smooth scroll links for sections or connect new canvas pages (${pagesList.join(", ")}) with Framer Page Routing.`,
        tip: "Ensure all navigation links are mapped to valid section IDs (#features, #pricing, #contact).",
      },
      {
        stepNumber: 7,
        title: "Preview & Test Interactions",
        instruction:
          "Click the Play button in the top right to enter full-screen interactive preview. Test scrolling, hover states, and mobile touch gestures.",
        tip: "Test on actual mobile devices using the Framer Preview QR code.",
      },
      {
        stepNumber: 8,
        title: "Publish with 1-Click to Custom Domain",
        instruction:
          "Click 'Publish' in the top right corner. Deploy instantly to a free .framer.app staging URL or connect your custom domain.",
        tip: "Framer automatically provides global CDN edge hosting, automatic SSL certificates, and 99.9% uptime.",
      }
    ];

    return steps;
  }

  // ----------------------------------------------------
  // 6. REPLIT WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("replit")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Replit",
        instruction: "Navigate to replit.com and open the Replit Agent dashboard.",
        tip: "Replit Agent can autonomously scaffold full-stack architectures, configure databases (PostgreSQL), and deploy in one seamless environment.",
      },
      {
        stepNumber: 2,
        title: "Start a New Project with Replit Agent",
        instruction: `Click 'Create with Agent' and name your project '${context?.templateName || "AWA Project"}'. Specify ${techStackStr}.`,
        tip: "Replit Agent manages dependencies, file structures, and server configuration automatically.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Upload Reference Assets",
        instruction:
          "Upload your UI reference screenshots or brand assets to the Replit prompt dialog so the agent can inspect colors, layouts, and logos.",
        tip: "The agent will extract styling rules and component dimensions directly from your uploaded images.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Provide Complete Architecture Prompt",
        instruction: `Paste the AWA prompt into Replit Agent. Detail the full application structure, pages (${pagesList.join(", ")}), and interactive features.`,
        examplePrompt: `Build a complete ${projectType} using ${techStackStr}. Pages: ${pagesList.join(", ")}. Features: ${workflow.features?.join(", ") || "responsive layout, modern styling"}. Include sample mock data.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Agent Scaffolding & Live Webview Preview",
        instruction:
          "Allow the Replit Agent to create components, install packages, and start the development server. Observe the live webview.",
        tip: "Replit Agent will execute terminal commands and resolve any dependency conflicts autonomously.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Conversational Bug Fixes & Refinements",
        instruction:
          "Review the generated pages. Use the Replit Agent chat to request visual polishes, smoother transitions, or layout corrections.",
        examplePrompt:
          "Refine the visual hierarchy: increase contrast on muted text, add glassmorphism to cards, and make the navigation responsive with a hamburger menu.",
      }
    );

    if (isApp || isEcommerce) {
      steps.push({
        stepNumber: steps.length + 1,
        title: "Verify Backend & Database Functionality",
        instruction:
          "Test database queries, API endpoints, and state mutations in Replit's console and webview.",
        tip: "Replit's built-in PostgreSQL database tool allows you to inspect tables and rows in real time.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Test Responsive Breakpoints",
        instruction:
          "Open the preview in a new tab and resize across desktop, tablet, and mobile dimensions to audit responsiveness.",
        tip: "Use DevTools device simulation to check touch targets and viewport meta tags.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Deploy via Replit Deployments",
        instruction:
          "Click 'Deploy' in the top right. Select 'Autoscale' or 'Reserved VM' to publish your application with automated SSL and custom domain support.",
        tip: "Replit handles build steps, environment secrets, and continuous hosting automatically.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 7. ANTIGRAVITY WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("antigravity")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Launch Antigravity",
        instruction: "Open your Antigravity environment and ensure your target workspace is active.",
        tip: "Antigravity provides an autonomous agentic pair-programming workflow capable of planning, executing, and testing multi-file web applications.",
      },
      {
        stepNumber: 2,
        title: "Initialize Project Workspace",
        instruction: `Ensure a clean workspace directory exists for '${context?.templateName || "AWA Web Project"}' with ${techStackStr} configured.`,
        tip: "Antigravity can scaffold new Next.js or Vite projects automatically via terminal execution if needed.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Provide Reference Assets & Screenshots",
        instruction:
          "Place reference screenshots or brand assets in the workspace or specify their paths so Antigravity can analyze visual requirements.",
        tip: "Antigravity examines reference images and design specifications to guide layout precision.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Submit Prompt & Review Implementation Plan",
        instruction: `Provide the AWA website prompt to Antigravity. The agent will analyze requirements and generate an architectural implementation plan.`,
        examplePrompt: `Create a modern ${projectType} with ${techStackStr}. Requirements: ${workflow.features?.join(", ") || "responsive layout, clean components"}. Pages: ${pagesList.join(", ")}. Follow modern design aesthetics.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Autonomous Code Scaffolding & Component Generation",
        instruction:
          "Approve the plan. Antigravity will autonomously create modular components, write styles in Tailwind CSS, and configure routing.",
        tip: "Antigravity maintains design tokens, clean file separation, and strict TypeScript types throughout execution.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Local Dev Server Verification",
        instruction:
          "Antigravity runs the local development server and verifies that all components compile without lint or type errors.",
        tip: "The agent checks browser rendering and console output to guarantee zero hydration or build issues.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Visual & Responsive Refinement",
        instruction:
          "Request iterative refinements for visual polish, micro-animations, and viewport responsiveness.",
        examplePrompt:
          "Add smooth hover animations to cards, ensure dark mode contrast meets WCAG standards, and optimize mobile navigation drawer.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Comprehensive Testing (Visual, Responsive, Functional)",
        instruction:
          "Verify the website across visual hierarchy (spacing, typography), responsive breakpoints (desktop, tablet, mobile), and interactive elements.",
        tip: "Click all buttons, test form inputs, and verify that navigation routes smoothly.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Git Commit & Production Deployment",
        instruction:
          "Antigravity creates a clean Git commit and guides you through deploying to Vercel, Netlify, or your preferred hosting platform.",
        tip: "Run a production build check (`npm run build`) before final deployment.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 8. CURSOR WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("cursor")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Cursor IDE",
        instruction: "Launch Cursor and open your web development project folder.",
        tip: "Cursor's Composer (Ctrl/Cmd + I) allows multi-file AI code generation and direct codebase context indexing.",
      },
      {
        stepNumber: 2,
        title: "Open Composer & Reference Codebase Context",
        instruction: `Press Ctrl+I (or Cmd+I) to open Composer. Set the mode to 'Agent' or 'Normal' and reference your project files using @ symbols.`,
        tip: "Type `@package.json` and `@components` to give Cursor full context on your installed packages and existing component styles.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Attach Reference Screenshot / Mockup",
        instruction:
          "Drag and drop your reference UI screenshot into Composer or use the image attachment button so Cursor can visually reference the design.",
        tip: "Claude 3.7 Sonnet in Cursor provides high-accuracy visual reproduction from screenshots.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter Website Generation Prompt",
        instruction: `Paste the AWA prompt into Composer. Direct Cursor to generate complete, production-ready files in ${techStackStr}.`,
        examplePrompt: `Build a modern ${projectType} using ${techStackStr}. Implement: ${workflow.features?.join(", ") || "clean layout, dark mode, responsive grid"}. Create clean, reusable components with full TypeScript typing.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Review Multi-File Diffs & Accept Changes",
        instruction:
          "Composer will stream changes across multiple files (`page.tsx`, components, styles). Review the inline diffs and click 'Accept All'.",
        tip: "Inspect file paths to ensure new components are placed into appropriate `/components` and `/lib` directories.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Run Local Dev Server & Browser Preview",
        instruction:
          "Open Cursor's integrated terminal (Ctrl+`) and run `npm run dev`. Open `http://localhost:3000` in your browser to inspect the result.",
        tip: "Use Cursor's terminal error auto-fix feature if any missing dependency or TypeScript error arises.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Prompt Refinement in Composer for Polish",
        instruction:
          "Use follow-up Composer prompts to refine spacing, add micro-interactions, and enhance responsiveness.",
        examplePrompt:
          "Make the navbar sticky with glassmorphism, add hover glow effects to feature cards, and ensure mobile padding is 16px.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Test Breakpoints & Interactive Features",
        instruction:
          "Test responsive viewports (375px, 768px, 1440px) in Chrome DevTools. Check all buttons, links, and forms.",
        tip: "Ensure no horizontal scrollbars occur on mobile widths.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Git Commit & Deploy to Vercel / Netlify",
        instruction:
          "Commit your changes via Cursor's Source Control tab (`git add . && git commit -m 'Initial website build'`) and push to GitHub for automated Vercel deployment.",
        tip: "Running `vercel` directly in Cursor's terminal provides instant preview deployment URLs.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 9. CLAUDE / CHATGPT WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("claude") || norm.includes("chatgpt") || norm.includes("gpt")) {
    const isClaude = norm.includes("claude");
    const aiName = isClaude ? "Claude" : "ChatGPT";

    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: `Open ${aiName}`,
        instruction: `Open ${isClaude ? "claude.ai" : "chatgpt.com"} and select the latest reasoning model (${isClaude ? "Claude 3.7 Sonnet" : "GPT-4o"}).`,
        tip: `${aiName} produces high-quality, production-ready code with complete component architectures and TypeScript types.`,
      },
      {
        stepNumber: 2,
        title: "Set Up Local Development Environment",
        instruction: `Initialize your local project using terminal commands (e.g. \`npx create-next-app@latest\` or \`npm create vite@latest\`) with ${techStackStr}.`,
        tip: "Having your local project initialized allows you to immediately test and preview code generated by the AI.",
      },
    ];

    if (isScreenshot || hasAssets) {
      steps.push({
        stepNumber: 3,
        title: "Attach Reference Screenshot / Assets",
        instruction:
          `Upload the reference screenshot (${context?.templateName || "UI Reference"}) to ${aiName} and ask it to analyze layout, spacing, and styling tokens.`,
        tip: "Ask the AI to output Tailwind CSS color tokens that match the screenshot before generating the full layout.",
      });
    }

    steps.push(
      {
        stepNumber: steps.length + 1,
        title: "Enter Structured Website Prompt",
        instruction: `Paste the AWA prompt into ${aiName}. Request a complete, modular component breakdown using ${techStackStr}.`,
        examplePrompt: `Create a modern ${projectType} using ${techStackStr}. Provide complete, copy-pasteable code for the page and components. Features: ${workflow.features?.join(", ") || "responsive layout, modern design"}. Do not use placeholders.`,
      },
      {
        stepNumber: steps.length + 1,
        title: "Copy & Paste Generated Components",
        instruction:
          "Copy the generated code blocks into your local files (`page.tsx`, `components/hero.tsx`, etc.). Install any referenced packages (e.g. `lucide-react`, `framer-motion`).",
        tip: "Use the copy code button at the top of each code block to preserve indentation.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Follow-Up Prompts for Polish & Refinement",
        instruction:
          `Use follow-up prompts in ${aiName} to refine visual polish, micro-interactions, and responsive behavior.`,
        examplePrompt:
          "Make the layout more minimal, increase whitespace, reduce card sizes, and ensure all cards stack vertically on mobile.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Test Navigation, Forms & Responsiveness",
        instruction:
          "Run your local dev server (`npm run dev`) and test responsive viewports across mobile (375px), tablet (768px), and desktop (1440px).",
        tip: "Verify that all interactive elements have proper hover and focus states.",
      },
      {
        stepNumber: steps.length + 1,
        title: "Build & Deploy to Vercel / Netlify",
        instruction:
          "Run `npm run build` to verify clean compilation, push code to your GitHub repository, and deploy via Vercel or Netlify.",
        tip: "Both Vercel and Netlify provide free tier hosting with automatic SSL and continuous deployment from Git.",
      }
    );

    return steps;
  }

  // ----------------------------------------------------
  // 10. WEBFLOW AI WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("webflow")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Webflow",
        instruction: "Navigate to webflow.com and open your Webflow Workspace.",
        tip: "Webflow AI combines prompt-based layout generation with professional visual CSS class control and clean HTML export.",
      },
      {
        stepNumber: 2,
        title: "Create New Site with Webflow AI",
        instruction: `Click 'New Site' and select 'Generate with Webflow AI'. Name your site '${context?.templateName || "AWA Webflow Site"}'.`,
        tip: "Webflow will initialize a clean responsive canvas with standard desktop, tablet, and mobile breakpoints.",
      },
      {
        stepNumber: 3,
        title: "Enter Site Prompt & Aesthetic Guidelines",
        instruction: `Paste the AWA prompt into the Webflow AI generator. Specify page structure (${pagesList.join(", ")}), color scheme, and typography style.`,
        examplePrompt: `Generate a modern ${projectType} with a dark obsidian theme (#08090d), neon accents, clean typography (Inter), and sections for Hero, Features, Proof, and Pricing.`,
      },
      {
        stepNumber: 4,
        title: "Generate Layout & Page Sections",
        instruction:
          "Execute the AI generation. Webflow will construct semantic HTML5 sections (header, main, section, footer) with responsive CSS classes.",
        tip: "Review the Navigator panel to verify clean class naming and container structures.",
      },
      {
        stepNumber: 5,
        title: "Refine Visual Styles in Webflow Designer",
        instruction:
          "Use the Webflow Designer styling panel to adjust padding, margins, flexbox alignments, and hover interactions.",
        tip: "Use Webflow's Client-First class naming conventions for scalable styling maintenance.",
      },
      {
        stepNumber: 6,
        title: "Audit Responsive Breakpoints",
        instruction:
          "Switch between Desktop (992px+), Tablet (768px-991px), Mobile Landscape (480px-767px), and Mobile Portrait (<479px) in the top bar.",
        tip: "Adjust font sizes and grid columns on tablet/mobile views without breaking desktop styling.",
      },
      {
        stepNumber: 7,
        title: "Test Interactions & Forms",
        instruction:
          "Test Webflow interactions (e.g. scroll reveals, navbar dropdowns) and verify form submission handlers.",
        tip: "Configure Webflow form notifications in Site Settings to receive test submission emails.",
      },
      {
        stepNumber: 8,
        title: "Publish to Webflow Staging & Custom Domain",
        instruction:
          "Click 'Publish' in the top right menu. Publish to your `.webflow.io` staging domain for review, or connect your custom domain.",
        tip: "Webflow provides enterprise-grade AWS hosting with multi-region CDN distribution.",
      }
    ];

    return steps;
  }

  // ----------------------------------------------------
  // 11. WIX AI / WIX STUDIO WORKFLOW
  // ----------------------------------------------------
  if (norm.includes("wix")) {
    const steps: UsageStep[] = [
      {
        stepNumber: 1,
        title: "Open Wix Studio",
        instruction: "Navigate to wix.com/studio and open your creator dashboard.",
        tip: "Wix Studio features an AI site generator with proportional fluid scaling across all screen sizes.",
      },
      {
        stepNumber: 2,
        title: "Start AI Site Generator",
        instruction: `Click 'Create New Site' and select 'Build with AI'. Enter '${context?.templateName || "AWA Project"}' as your site title.`,
        tip: "Wix AI creates complete multi-section pages with tailored copy, imagery, and interactive widgets.",
      },
      {
        stepNumber: 3,
        title: "Describe Website Type, Brand & Target Audience",
        instruction: `Paste the AWA prompt into the Wix AI chat. Detail your project type (${projectType}) and required sections (${pagesList.join(", ")}).`,
        examplePrompt: `Create a professional ${projectType} featuring: ${workflow.features?.join(", ") || "clean layout, interactive features, modern aesthetic"}. Include sections for ${pagesList.join(", ")}.`,
      },
      {
        stepNumber: 4,
        title: "Generate Complete Multi-Section Website",
        instruction:
          "Allow Wix AI to generate the complete website layout, typography palette, and responsive component tree.",
        tip: "Review the generated color palette and select your preferred visual tone before opening the editor.",
      },
      {
        stepNumber: 5,
        title: "Customize Layout & Typography in Studio Editor",
        instruction:
          "Open the Studio visual editor to fine-tune spacing, custom font pairings, and button styling.",
        tip: "Use Wix Studio's responsive fluid sizing to ensure text and cards scale smoothly across any screen width.",
      },
      {
        stepNumber: 6,
        title: "Configure Business Apps & Features",
        instruction: isEcommerce
          ? "Set up Wix Stores to manage products, pricing, and shopping cart checkout flows."
          : "Configure interactive forms, booking widgets, or CMS datasets as specified by the tutorial.",
        tip: "Wix provides out-of-the-box payment gateways and database collections.",
      },
      {
        stepNumber: 7,
        title: "Test Fluid Responsiveness",
        instruction:
          "Use the Studio breakpoint slider to drag between 320px and 1920px, checking for fluid scaling and clean element wrapping.",
        tip: "Check that touch targets on mobile meet minimum 44px height requirements.",
      },
      {
        stepNumber: 8,
        title: "Publish to Wix Hosting or Custom Domain",
        instruction:
          "Click 'Publish' in the top right header to make the website live on Wix cloud infrastructure or connect your custom domain.",
        tip: "Wix includes free SSL, automated backups, and 99.9% uptime monitoring.",
      }
    ];

    return steps;
  }

  // ----------------------------------------------------
  // 12. UNKNOWN TOOL FALLBACK (Section 18 Strict 10-Step Workflow)
  // ----------------------------------------------------
  const fallbackSteps: UsageStep[] = [
    {
      stepNumber: 1,
      title: "Open the Tool",
      instruction: `Launch ${toolName} in your browser or open its desktop application.`,
      tip: "Ensure you are logged in to your account so your project saves properly.",
    },
    {
      stepNumber: 2,
      title: "Start a New Website Project",
      instruction: `Create a new website or project in ${toolName} for '${context?.templateName || "AWA Project"}'.`,
      tip: `Configure the project using ${techStackStr} if the tool asks for a framework or technology stack.`,
    },
    {
      stepNumber: 3,
      title: "Add the Provided Prompt",
      instruction: `Copy the complete website generation prompt from this AWA tutorial and paste it into ${toolName}'s input field.`,
      examplePrompt: basePrompt,
    },
    {
      stepNumber: 4,
      title: "Upload Required References / Assets",
      instruction: hasAssets
        ? `Upload the provided tutorial assets (${(workflow.assets || []).map((a) => a.label).join(", ")}) before initiating generation.`
        : `If ${toolName} supports image references, upload any relevant screenshot or style guide.`,
      tip: "Providing reference images significantly improves visual fidelity and color matching.",
    },
    {
      stepNumber: 5,
      title: "Generate the Website",
      instruction: `Initiate the AI generation process in ${toolName}. Allow the model to scaffold the layout, components, and styling.`,
      tip: "Wait for the full generation to complete before inspecting individual sections.",
    },
    {
      stepNumber: 6,
      title: "Review the Result",
      instruction:
        "Check: Layout, Navigation, Typography, Spacing, Colors, Responsiveness, Content, Components, and Overall visual hierarchy.",
      tip: "Take note of any cards, font sizes, or alignment details that require adjustment.",
    },
    {
      stepNumber: 7,
      title: "Refine the Website",
      instruction:
        "Use follow-up prompts to improve the generated website. Address visual hierarchy, whitespace, and component styling.",
      examplePrompt:
        "Make the layout more minimal, increase whitespace, reduce card sizes, and improve the visual hierarchy.",
    },
    {
      stepNumber: 8,
      title: "Test Responsive Layout",
      instruction:
        "Check desktop, tablet, and mobile layouts. Ensure navigation collapses properly and cards stack cleanly.",
      tip: "Verify that no horizontal scrollbars appear on mobile viewports.",
    },
    {
      stepNumber: 9,
      title: "Test Functionality",
      instruction:
        `Test navigation links, buttons, forms, and interactive features (${workflow.features?.join(", ") || "navigation, buttons"}).`,
      tip: "Ensure all buttons have responsive click feedback and forms validate inputs.",
    },
    {
      stepNumber: 10,
      title: "Export or Publish",
      instruction:
        `Depending on ${toolName}'s capabilities, export the source code or publish/deploy the website live.`,
      tip: "Connect to GitHub or deploy to Vercel/Netlify if code export is supported.",
    },
  ];

    return fallbackSteps;
  }

  return buildSteps().map((step, idx) => ({
    ...step,
    stepNumber: idx + 1,
  }));
}
