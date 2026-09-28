import { PromptType } from "../types/translation";

// Specialized translation dictionaries and patterns that preserve:
// - Variables: {{variable_name}}
// - Technical tags: --ar 16:9, --v 6.1, etc.
// - AI models: Midjourney v6.1, Kling 2.1, Flux.1 Pro, Runway Gen-3, DALL-E 3, etc.
// - URLs and code snippets

const LANGUAGE_PREFIXES: Record<string, { uiPrefix: string; contextPrefix: string }> = {
  es: {
    uiPrefix: "Generar con precisión fotográfica y estilo cinematográfico: ",
    contextPrefix: "Contexto del sistema e instrucciones de renderizado: ",
  },
  ar: {
    uiPrefix: "إنشاء بجودة سينمائية فائقة وتفاصيل دقيقة: ",
    contextPrefix: "سياق النظام وتعليمات المعالجة: ",
  },
  fr: {
    uiPrefix: "Générer avec une fidélité cinématographique et des détails raffinés : ",
    contextPrefix: "Contexte système et directives de composition : ",
  },
  de: {
    uiPrefix: "Erstellen mit kinoreifer Präzision und erstklassigen Details: ",
    contextPrefix: "Systemkontext und Rendering-Anweisungen: ",
  },
  hi: {
    uiPrefix: "सिनेमैटिक गुणवत्ता और सटीक विवरण के साथ बनाएं: ",
    contextPrefix: "सिस्टम संदर्भ और रेंडरिंग निर्देश: ",
  },
  ja: {
    uiPrefix: "シネマティックな高品質と精密なディテールで生成：",
    contextPrefix: "システムコンテキストと構成ガイドライン：",
  },
};

const COMMON_PHRASE_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    "cinematic lighting": "iluminación cinematográfica",
    "ultra realistic": "ultra realista",
    "hyper-detailed": "hiper detallado",
    "studio background": "fondo de estudio",
    "high resolution": "alta resolución",
    "centered composition": "composición centrada",
    "clean minimalist": "minimalista y limpio",
    "smooth transition": "transición suave",
    "vibrant colors": "colores vibrantes",
    "product showcase": "escaparate de producto",
  },
  ar: {
    "cinematic lighting": "إضاءة سينمائية",
    "ultra realistic": "واقعي للغاية",
    "hyper-detailed": "فائق التفاصيل",
    "studio background": "خلفية الاستوديو",
    "high resolution": "دقة عالية",
    "centered composition": "تكوين مركزي متوازن",
    "clean minimalist": "تصميم مبسط وأنيق",
    "smooth transition": "انتقال سلس",
    "vibrant colors": "ألوان نابضة بالحياة",
    "product showcase": "عرض المنتج الاحترافي",
  },
  fr: {
    "cinematic lighting": "éclairage cinématographique",
    "ultra realistic": "ultra réaliste",
    "hyper-detailed": "hyper détaillé",
    "studio background": "arrière-plan studio",
    "high resolution": "haute résolution",
    "centered composition": "composition centrée",
    "clean minimalist": "minimaliste épuré",
    "smooth transition": "transition fluide",
    "vibrant colors": "couleurs éclatantes",
    "product showcase": "vitrine de produit",
  },
  de: {
    "cinematic lighting": "kinematische Beleuchtung",
    "ultra realistic": "ultra-realistisch",
    "hyper-detailed": "extrem detailliert",
    "studio background": "Studiohintergrund",
    "high resolution": "hohe Auflösung",
    "centered composition": "zentrierte Komposition",
    "clean minimalist": "sauberer Minimalismus",
    "smooth transition": "flüssiger Übergang",
    "vibrant colors": "lebendige Farben",
    "product showcase": "Produktpräsentation",
  },
  hi: {
    "cinematic lighting": "सिनेमैटिक लाइटिंग",
    "ultra realistic": "अति यथार्थवादी",
    "hyper-detailed": "अत्यधिक विस्तृत",
    "studio background": "स्टूडियो बैकग्राउंड",
    "high resolution": "उच्च रेजोल्यूशन",
    "centered composition": "केंद्रित रचना",
    "clean minimalist": "स्वच्छ और न्यूनतम",
    "smooth transition": "सहज संक्रमण",
    "vibrant colors": "जीवंत रंग",
    "product showcase": "उत्पाद प्रदर्शन",
  },
  ja: {
    "cinematic lighting": "映画のような照明",
    "ultra realistic": "超リアル",
    "hyper-detailed": "非常に詳細な",
    "studio background": "スタジオの背景",
    "high resolution": "高解像度",
    "centered composition": "中央揃えの構図",
    "clean minimalist": "クリーンでミニマル",
    "smooth transition": "スムーズなトランジション",
    "vibrant colors": "鮮やかな色彩",
    "product showcase": "製品ショーケース",
  },
};

export class AiTranslationService {
  /**
   * Simulates AI translation with prompt structure preservation.
   * Protects {{variables}}, model names, technical flags (--ar, --v), URLs, and JSON keys.
   */
  async translatePrompt(
    promptText: string,
    targetLanguageCode: string,
    promptType: PromptType
  ): Promise<{
    translatedText: string;
    estimatedTokens: number;
    estimatedCost: number;
  }> {
    if (!promptText || targetLanguageCode === "en") {
      return {
        translatedText: promptText,
        estimatedTokens: Math.ceil((promptText?.length || 0) / 4),
        estimatedCost: 0,
      };
    }

    // Step 1: Extract and replace placeholders to guarantee they are never touched
    const placeholderMap: Map<string, string> = new Map();
    let tokenIndex = 0;

    // Preserve {{variable_name}}
    let masked = promptText.replace(/\{\{[^}]+\}\}/g, (match) => {
      const token = `__AWA_VAR_${tokenIndex++}__`;
      placeholderMap.set(token, match);
      return token;
    });

    // Preserve technical flags like --ar 16:9, --stylize 250, etc.
    masked = masked.replace(/--[a-z0-9]+(\s+[a-z0-9.:]+)?/gi, (match) => {
      const token = `__AWA_PARAM_${tokenIndex++}__`;
      placeholderMap.set(token, match);
      return token;
    });

    // Preserve known AI model names
    const modelRegex = /(Midjourney(\s+v[\d.]+)?|Runway(\s+Gen-[\d]+)?|Kling(\s+[\d.]+)?|Flux(\.1)?(\s+Pro)?|DALL-E\s+3|Claude(\s+[\d.]+(\s+Sonnet)?)?|GPT-4o?)/gi;
    masked = masked.replace(modelRegex, (match) => {
      const token = `__AWA_MODEL_${tokenIndex++}__`;
      placeholderMap.set(token, match);
      return token;
    });

    // Step 2: Apply phrase replacements based on target language
    const phraseDict = COMMON_PHRASE_TRANSLATIONS[targetLanguageCode] || {};
    let translated = masked;

    for (const [enPhrase, transPhrase] of Object.entries(phraseDict)) {
      const regex = new RegExp(`\\b${enPhrase}\\b`, "gi");
      translated = translated.replace(regex, transPhrase);
    }

    // Step 3: Add natural localized phrasing if not already prefixed
    const langConfig = LANGUAGE_PREFIXES[targetLanguageCode];
    if (langConfig) {
      const prefix = promptType === "ui" ? langConfig.uiPrefix : langConfig.contextPrefix;
      // If short prompt, adapt smoothly
      if (!translated.startsWith(prefix.trim().slice(0, 8))) {
        translated = `${prefix}${translated}`;
      }
    }

    // Step 4: Restore all preserved tokens with original variables/models/flags
    for (const [token, original] of placeholderMap.entries()) {
      translated = translated.replace(token, original);
    }

    // Calculate realistic tokens and cost
    const tokenCount = Math.ceil(translated.length / 3.8) + 40;
    const cost = Number(((tokenCount / 1000) * 0.002).toFixed(5));

    return {
      translatedText: translated,
      estimatedTokens: tokenCount,
      estimatedCost: cost,
    };
  }
}

export const aiTranslationService = new AiTranslationService();
