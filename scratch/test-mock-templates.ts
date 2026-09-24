import { initialTemplates } from "../lib/mock-data/templates";
import { getTemplateWorkflowSteps, combineFullTemplatePrompt } from "../lib/template-workflow";
import { resolveTemplateGuide } from "../lib/category-guide-config";

console.log(`Checking ${initialTemplates.length} templates in mock-data...`);

const slidesTemplate = initialTemplates.find((t) => t.id === "template-slides-seed-pitch");
if (!slidesTemplate) throw new Error("Slides template not found");

console.log("Found template:", slidesTemplate.name);
const workflowSteps = getTemplateWorkflowSteps(slidesTemplate);
console.log(`Workflow steps count: ${workflowSteps.length}`);

workflowSteps.forEach((s) => {
  console.log(`- Step ${s.order}: ${s.title} | Instructions length: ${(s.description || s.instruction || '').length}`);
});

if (workflowSteps.length !== 7) {
  throw new Error(`Expected 7 steps for presentation prompt workflow, got ${workflowSteps.length}`);
}

const resolvedGuide = resolveTemplateGuide(slidesTemplate, "Gamma");
console.log(`Resolved guide steps count: ${resolvedGuide.steps.length}`);
if (resolvedGuide.steps.length !== 7) {
  throw new Error(`Guide resolved ${resolvedGuide.steps.length} instead of 7`);
}

const fullPrompt = combineFullTemplatePrompt(slidesTemplate);
console.log("Full prompt combined length:", fullPrompt.length);
console.log("Contains Presentation Strategy:", fullPrompt.includes("Presentation Strategy"));
console.log("Contains Individual Slide Planning:", fullPrompt.includes("Individual Slide Planning"));

console.log("\n>>> MOCK TEMPLATES VALIDATION PASSED! <<<");
