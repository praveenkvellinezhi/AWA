import { AdminConfig } from "../types";

export const initialAdminConfig: AdminConfig = {
  voiceCustomizationEnabled: true,
  monthlySpendCap: 150, // $150 USD cap
  currentMonthlySpend: 34.2, // $34.20 USD used
  freeCreditsAllotment: 5, // 5 free customization credits for new subscribers
  creditPacks: [
    {
      id: "pack-10",
      credits: 10,
      priceInr: 49,
      label: "Starter Pack",
    },
    {
      id: "pack-25",
      credits: 25,
      priceInr: 99,
      label: "Creator Pack",
      popular: true,
    },
    {
      id: "pack-100",
      credits: 100,
      priceInr: 299,
      label: "Studio Pro Pack",
    },
  ],
  nonSubscriberVisibility: "hard_lock", // Confirmed default in 11-UI-UX.md
  standingSystemInstruction: `You are the AWA Expert AI Prompt Customization Engine.
Your task is to take the original admin-authored expert prompt and adapt it according to the user's specific typed or spoken request.
Core Rules:
1. Preserve technical fidelity: Retain camera lenses, lighting specifications, aspect ratio tags (--ar), and model parameters unless the user explicitly asks to alter them.
2. Adapt seamlessly: Integrate the user's requested subjects, materials, color palettes, or mood adjustments organically into the prompt syntax.
3. Keep concise: Never prepend meta-commentary like "Here is your prompt:". Output ONLY the ready-to-copy finished prompt text.
4. Output Plain Text only. Do not execute or evaluate external code.`,
  categoryCustomizationOverrides: {
    "cat-image-gen": true,
    "cat-video-gen": true,
    "cat-website-making": true,
    "cat-slides-presentations": true,
    "cat-poster-design": true,
  },
  razorpayConfig: {
    enabled: true,
    keyId: "rzp_test_9A8v72B1kL0xP",
    webhookUrl: "https://api.awa.guide/webhooks/razorpay",
    mode: "test",
  },
  stripeConfig: {
    enabled: true,
    publishableKey: "pk_test_51MzL82AWA491029Xyz",
    webhookUrl: "https://api.awa.guide/webhooks/stripe",
    mode: "test",
  },
  supportedLanguages: [
    { code: "en", name: "English", flag: "🇬🇧", completeness: 100 },
    { code: "hi", name: "Hindi (हिंदी)", flag: "🇮🇳", completeness: 88 },
    { code: "es", name: "Spanish (Español)", flag: "🇪🇸", completeness: 65 },
    { code: "fr", name: "French (Français)", flag: "🇫🇷", completeness: 50 },
    { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵", completeness: 40 },
  ],
};
