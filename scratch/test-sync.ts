import {
  getTemplateWorkflowSteps,
  combineFullTemplatePrompt,
  normalizeTemplateStep,
} from "../lib/template-workflow";
import {
  resolveTemplateGuide,
  mapToGuideSteps,
} from "../lib/category-guide-config";

console.log("Testing unified workflow single-source-of-truth with detailed step how-to text...");

// 1. Create a 5-step test template
const testTemplate: any = {
  id: "template-test-sync-1",
  name: "Master AI Creation Pipeline",
  slug: "master-ai-creation-pipeline",
  categoryId: "cat-image-generation",
  categoryName: "Image Generation",
  description: "Testing 5-step synchronization across all surfaces",
  promptText: "Ultra photorealistic master generation prompt for commercial studio setup.",
  tags: ["sync", "test", "workflow"],
  workflow: {
    steps: [
      {
        id: "step-1",
        order: 1,
        title: "Step 01 — Define Concept",
        shortTitle: "Concept",
        description: "Open Midjourney web interface or Discord. Specify the main subject in a clean studio environment.",
        purpose: "Anchor the visual subject clearly before adding lighting.",
        instructions: ["Specify subject", "Set environment"],
        image: {
          url: "https://images.unsplash.com/photo-1.jpg",
          alt: "Concept Alt",
        },
        example: { output: "Concept preview render" },
        tips: ["Keep subject centered"],
      },
      {
        id: "step-2",
        order: 2,
        title: "Step 02 — Art Direction & Camera",
        shortTitle: "Camera",
        description: "Set camera to 85mm portrait focal length with f/1.8 aperture and soft diffused north window lighting.",
        purpose: "Establish visual quality and depth of field.",
        instructions: ["Pick lens", "Set f-stop"],
        image: {
          url: "https://images.unsplash.com/photo-2.jpg",
          alt: "Lighting Alt",
        },
        example: { output: "Lighting reference render" },
        tips: ["Use Rembrandt lighting"],
      },
      {
        id: "step-3",
        order: 3,
        title: "Step 03 — Composition & Framing",
        shortTitle: "Framing",
        description: "Align key elements along the rule-of-thirds grid with 30% negative space on the right.",
        purpose: "Achieve balanced spatial depth.",
        instructions: ["Apply grid", "Position focus"],
        image: {
          url: "https://images.unsplash.com/photo-3.jpg",
          alt: "Composition Alt",
        },
        example: { output: "Composition preview render" },
        tips: ["Avoid centered horizons"],
      },
      {
        id: "step-4",
        order: 4,
        title: "Step 04 — Render Candidate Seeds",
        shortTitle: "Render",
        description: "Execute generation batch and evaluate the 4 rendered candidate quadrants for anatomical correctness.",
        purpose: "Produce candidate seed images.",
        instructions: ["Queue generation", "Evaluate 4-grid"],
        image: {
          url: "https://images.unsplash.com/photo-4.jpg",
          alt: "Render Alt",
        },
        example: { output: "4-candidate seed matrix" },
        tips: ["Select best anatomy seed"],
      },
      {
        id: "step-5",
        order: 5,
        title: "Step 05 — Refine & Upscale",
        shortTitle: "Upscale",
        description: "Inpaint any edge artifacts and apply subtle 4K upscale retaining microscopic skin texture.",
        purpose: "Produce print-ready asset.",
        instructions: ["Mask blemishes", "Apply 4x upscale"],
        image: {
          url: "https://images.unsplash.com/photo-5.jpg",
          alt: "Upscale Alt",
        },
        example: { output: "Final 4096x4096 master render" },
        tips: ["Retain subtle noise"],
      },
    ],
  },
};

// Test 1: getTemplateWorkflowSteps retrieves all 5 steps
const workflowSteps = getTemplateWorkflowSteps(testTemplate);
console.log("Workflow Steps Count:", workflowSteps.length);
if (workflowSteps.length !== 5) throw new Error("Expected 5 steps");

// Test 2: resolveTemplateGuide resolves the same 5 steps
const resolvedGuide = resolveTemplateGuide(testTemplate, "Midjourney", "v6.1");
console.log("Resolved Guide Steps Count:", resolvedGuide.steps.length);
if (resolvedGuide.steps.length !== 5) throw new Error("Expected 5 guide steps");

// Test 3: mapToGuideSteps preserves all properties without data loss
const guideSteps = mapToGuideSteps(workflowSteps);
console.log("Guide Steps Count:", guideSteps.length);
if (guideSteps.length !== 5) throw new Error("Expected 5 mapped guide steps");
if (guideSteps[2].title !== "Step 03 — Composition & Framing")
  throw new Error("Step 3 title mismatch");
if (!guideSteps[2].description.includes("rule-of-thirds grid"))
  throw new Error("Step 3 description mismatch");
if (guideSteps[2].image !== "https://images.unsplash.com/photo-3.jpg")
  throw new Error("Step 3 image mismatch");

// Test 4: Combined prompt contains template prompt
const combined = combineFullTemplatePrompt(testTemplate);
console.log("Combined template prompt exists:", combined.includes("Ultra photorealistic master generation prompt"));
if (!combined.includes("Ultra photorealistic master generation prompt"))
  throw new Error("Template prompt missing");

// Test 5: Modify Step 03 in builder
testTemplate.workflow.steps[2].title = "Step 03 — Modified Dynamic Composition";
testTemplate.workflow.steps[2].description = "Updated detailed text: Position subject at 1/3 grid intersection with 50mm anamorphic lens.";

// Re-verify that everywhere reads the updated Step 03 immediately
const updatedWorkflowSteps = getTemplateWorkflowSteps(testTemplate);
const updatedGuide = resolveTemplateGuide(testTemplate, "Midjourney");
const updatedGuideSteps = mapToGuideSteps(updatedWorkflowSteps);

console.log("Updated Step 03 Title in Workflow:", updatedWorkflowSteps[2].title);
console.log("Updated Step 03 Description in Workflow:", updatedWorkflowSteps[2].description);
console.log("Updated Step 03 Title in Guide:", updatedGuide.steps[2].title);
console.log("Updated Step 03 Description in Guide:", updatedGuide.steps[2].description);
console.log("Updated Step 03 Title in Mapped Canvas:", updatedGuideSteps[2].title);
console.log("Updated Step 03 Description in Mapped Canvas:", updatedGuideSteps[2].description);

if (updatedWorkflowSteps[2].title !== "Step 03 — Modified Dynamic Composition")
  throw new Error("Sync failed in workflow title");
if (!updatedWorkflowSteps[2].description?.includes("Position subject at 1/3 grid intersection"))
  throw new Error("Sync failed in workflow description");
if (updatedGuide.steps[2].title !== "Step 03 — Modified Dynamic Composition")
  throw new Error("Sync failed in guide title");
if (!updatedGuide.steps[2].description?.includes("Position subject at 1/3 grid intersection"))
  throw new Error("Sync failed in guide description");
if (updatedGuideSteps[2].title !== "Step 03 — Modified Dynamic Composition")
  throw new Error("Sync failed in mapped canvas title");
if (!updatedGuideSteps[2].description?.includes("Position subject at 1/3 grid intersection"))
  throw new Error("Sync failed in mapped canvas description");

console.log("\n>>> ALL DETAILED TEXT SYNCHRONIZATION TESTS PASSED WITH 100% SUCCESS! <<<");
