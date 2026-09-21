import { CustomizationInsight } from "../types";

export const initialCustomizationInsights: CustomizationInsight[] = [
  {
    templateId: "template-candle-photo",
    templateName: "Product Photography — Handmade Candle",
    categoryName: "Image Generation",
    totalCustomizations: 142,
    recurringPatterns: [
      {
        patternText: "Dark / Black granite / Onyx background requests",
        count: 58,
        actionSuggestion: "Create a dedicated 'Dark Moody Product Studio' template to reduce custom rewrites.",
      },
      {
        patternText: "Lit flame / curling smoke details",
        count: 41,
        actionSuggestion: "Add an explicit parameter for flame illumination in the base prompt variant.",
      },
      {
        patternText: "Outdoor botanical garden setting",
        count: 24,
        actionSuggestion: "Consider subcategory addition for Outdoor Product Lifestyle.",
      },
    ],
  },
  {
    templateId: "template-web-saas-dark",
    templateName: "Dark Mode AI SaaS Landing Page with Pricing Matrix",
    categoryName: "Website Making",
    totalCustomizations: 96,
    recurringPatterns: [
      {
        patternText: "Light mode / Clean monochrome palette swap",
        count: 48,
        actionSuggestion: "Author a paired 'Light Minimalist SaaS' companion template.",
      },
      {
        patternText: "Adding Stripe checkout embed directive",
        count: 32,
        actionSuggestion: "Include billing integration copy directive in prompt notes.",
      },
    ],
  },
  {
    templateId: "template-video-drone-mountains",
    templateName: "Cinematic Misty Mountain Drone Sweep",
    categoryName: "Video Generation",
    totalCustomizations: 73,
    recurringPatterns: [
      {
        patternText: "Sunset / Twilight / Golden Hour color grade changes",
        count: 39,
        actionSuggestion: "Provide time-of-day selector tags in template metadata.",
      },
      {
        patternText: "FPV fast dive speed adjustments",
        count: 22,
        actionSuggestion: "Document motion brush parameter values in usage guidance.",
      },
    ],
  },
];
