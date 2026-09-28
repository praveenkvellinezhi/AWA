import { ConfiguredLanguage, TemplateTranslation } from "../types/translation";

export const initialConfiguredLanguages: ConfiguredLanguage[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    status: "default",
    isDefault: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    status: "enabled",
    isDefault: false,
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-09-20T14:30:00Z",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    status: "enabled",
    isDefault: false,
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-09-25T11:00:00Z",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    flag: "🇮🇳",
    status: "enabled",
    isDefault: false,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-09-24T16:00:00Z",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    status: "enabled",
    isDefault: false,
    createdAt: "2026-04-12T12:00:00Z",
    updatedAt: "2026-09-18T10:15:00Z",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    status: "disabled",
    isDefault: false,
    createdAt: "2026-05-01T14:00:00Z",
    updatedAt: "2026-09-15T09:30:00Z",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    status: "disabled",
    isDefault: false,
    createdAt: "2026-06-01T15:00:00Z",
    updatedAt: "2026-09-10T12:00:00Z",
  },
];

export const initialTemplateTranslations: TemplateTranslation[] = [
  // 1. template-luxury-product-shoot (Spanish - Published)
  {
    id: "trans-es-luxury-001",
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Perfume Commercial Still",
    promptVersionId: "pv-luxury-v3",
    promptVersionNumber: 3,
    languageCode: "es",
    uiPrompt:
      "Generar con precisión fotográfica y estilo cinematográfico: Fotografía de estudio de primer plano de {{product_name}} de lujo sobre un pedestal de mármol negro texturizado, microgotas de agua, iluminación de borde dorada suave, niebla sutil, 8k, bokeh exquisito con Midjourney v6.1 --ar 16:9 --style raw",
    contextPrompt:
      "Contexto del sistema e instrucciones de renderizado: Mantenga el frasco de perfume centrado con reflejos hiperrealistas en las facetas de cristal. No altere el logotipo {{brand}} ni las proporciones de la botella.",
    status: "published",
    published: true,
    createdAt: "2026-09-15T10:00:00Z",
    updatedAt: "2026-09-20T12:00:00Z",
    reviewedBy: "Admin Maria",
    reviewedAt: "2026-09-20T12:00:00Z",
  },
  // template-luxury-product-shoot (Arabic - Published)
  {
    id: "trans-ar-luxury-001",
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Perfume Commercial Still",
    promptVersionId: "pv-luxury-v3",
    promptVersionNumber: 3,
    languageCode: "ar",
    uiPrompt:
      "إنشاء بجودة سينمائية فائقة وتفاصيل دقيقة: لقطة استوديو مقربة لزجاجة عطر {{product_name}} فاخرة على قاعدة من الرخام الأسود، قطرات ماء دقيقة، إضاءة ذهبية حافية، ضباب خفيف مع Midjourney v6.1 --ar 16:9 --style raw",
    contextPrompt:
      "سياق النظام وتعليمات المعالجة: حافظ على الزجاجة في المنتصف تماماً مع مراعاة الانعكاسات الكريستالية الفاخرة، مع الحفاظ الكامل على اسم العلامة {{brand}}.",
    status: "published",
    published: true,
    createdAt: "2026-09-18T11:00:00Z",
    updatedAt: "2026-09-22T14:00:00Z",
    reviewedBy: "Admin Tariq",
    reviewedAt: "2026-09-22T14:00:00Z",
  },
  // template-luxury-product-shoot (German - Needs Update)
  {
    id: "trans-de-luxury-001",
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Perfume Commercial Still",
    promptVersionId: "pv-luxury-v2",
    promptVersionNumber: 2,
    languageCode: "de",
    uiPrompt:
      "Erstellen mit kinoreifer Präzision und erstklassigen Details: Studioaufnahme eines {{product_name}} Luxusparfüms auf schwarzem Marmorsockel, Wassertröpfchen, weiches goldenes Randlicht mit Midjourney v6.1 --ar 16:9",
    contextPrompt:
      "Systemkontext und Rendering-Anweisungen: Parfümflakon zentriert halten, {{brand}} nicht modifizieren.",
    status: "needs_update",
    published: false,
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-09-25T08:00:00Z",
  },

  // 2. template-cinematic-product-video (Spanish - Completed, Pending Admin Publish)
  {
    id: "trans-es-cinematic-002",
    templateId: "template-cinematic-product-video",
    templateName: "Cinematic Product Video Reveal",
    promptVersionId: "pv-cinematic-v1",
    promptVersionNumber: 1,
    languageCode: "es",
    uiPrompt:
      "Generar con precisión fotográfica y estilo cinematográfico: Vídeo cinematográfico fluido en cámara lenta de {{product_name}} levitando en un entorno minimalista oscuro, haces de luz volumétricos girando alrededor, renderizado con Kling 2.1 a 60 fps.",
    contextPrompt:
      "Contexto del sistema e instrucciones de renderizado: La cámara debe describir un movimiento orbital suave de 360 grados alrededor de {{product_name}}, manteniendo la nitidez en el acabado metálico.",
    status: "completed",
    published: false,
    createdAt: "2026-09-22T14:00:00Z",
    updatedAt: "2026-09-22T14:05:00Z",
  },
  // template-cinematic-product-video (Spanish - Failed example to demonstrate retry)
  {
    id: "trans-es-saas-failed-003",
    templateId: "template-saas-landing-page",
    templateName: "Modern SaaS Landing Page Hero",
    promptVersionId: "pv-saas-v1",
    promptVersionNumber: 1,
    languageCode: "es",
    uiPrompt: "",
    contextPrompt: "",
    status: "failed",
    published: false,
    errorMessage: "Network timeout: Simulated translation pipeline exceeded 4500ms limit.",
    lastRetriedAt: "2026-09-24T18:30:00Z",
    createdAt: "2026-09-24T18:00:00Z",
    updatedAt: "2026-09-24T18:30:00Z",
  },
  // template-social-media-ad (Spanish - Pending)
  {
    id: "trans-es-social-004",
    templateId: "template-social-media-ad",
    templateName: "High-Conversion Instagram Reel Prompt",
    promptVersionId: "pv-social-v1",
    promptVersionNumber: 1,
    languageCode: "es",
    uiPrompt: "",
    contextPrompt: "",
    status: "pending",
    published: false,
    createdAt: "2026-09-26T09:00:00Z",
    updatedAt: "2026-09-26T09:00:00Z",
  },

  // 3. Arabic templates (Arabic has high completion)
  {
    id: "trans-ar-saas-005",
    templateId: "template-saas-landing-page",
    templateName: "Modern SaaS Landing Page Hero",
    promptVersionId: "pv-saas-v1",
    promptVersionNumber: 1,
    languageCode: "ar",
    uiPrompt:
      "إنشاء بجودة سينمائية فائقة وتفاصيل دقيقة: تصميم صفحة هبوط SaaS لمنتج تقني ذكي، بطاقات واجهة مستخدم متوهجة بزجاج شبكي، أزرار تفاعلية بنمط عصري متقدم.",
    contextPrompt:
      "سياق النظام وتعليمات المعالجة: تنظيم الواجهة بمحاذاة من اليمين إلى اليسار (RTL) متوافقة مع اللغة العربية مع الحفاظ على أكواد الأيقونات والروابط.",
    status: "published",
    published: true,
    createdAt: "2026-09-12T10:00:00Z",
    updatedAt: "2026-09-15T12:00:00Z",
    reviewedBy: "Admin Tariq",
    reviewedAt: "2026-09-15T12:00:00Z",
  },
  {
    id: "trans-ar-cinematic-006",
    templateId: "template-cinematic-product-video",
    templateName: "Cinematic Product Video Reveal",
    promptVersionId: "pv-cinematic-v1",
    promptVersionNumber: 1,
    languageCode: "ar",
    uiPrompt:
      "إنشاء بجودة سينمائية فائقة وتفاصيل دقيقة: فيديو سينمائي بحركة بطيئة متدفقة لـ {{product_name}} مع مؤثرات بصرية استثنائية ونموذج Kling 2.1.",
    contextPrompt:
      "سياق النظام وتعليمات المعالجة: حركة كاميرا انسيابية مع الحفاظ على نقاء الإضاءة المحيطية.",
    status: "published",
    published: true,
    createdAt: "2026-09-14T15:00:00Z",
    updatedAt: "2026-09-16T09:00:00Z",
    reviewedBy: "Admin Tariq",
    reviewedAt: "2026-09-16T09:00:00Z",
  },

  // 4. Hindi templates
  {
    id: "trans-hi-luxury-007",
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Perfume Commercial Still",
    promptVersionId: "pv-luxury-v3",
    promptVersionNumber: 3,
    languageCode: "hi",
    uiPrompt:
      "सिनेमैटिक गुणवत्ता और सटीक विवरण के साथ बनाएं: काले संगमरमर पर रखे {{product_name}} परफ्यूम की क्लोज़-अप स्टूडियो फोटोग्राफी, पानी की बारीक बूंदें, स्वर्णिम किनारा प्रकाश, Midjourney v6.1 --ar 16:9",
    contextPrompt:
      "सिस्टम संदर्भ और रेंडरिंग निर्देश: बोतल को हमेशा केंद्र में रखें और {{brand}} लोगो में कोई बदलाव न करें।",
    status: "published",
    published: true,
    createdAt: "2026-09-10T12:00:00Z",
    updatedAt: "2026-09-14T11:00:00Z",
    reviewedBy: "Admin Vikram",
    reviewedAt: "2026-09-14T11:00:00Z",
  },
  {
    id: "trans-hi-cinematic-008",
    templateId: "template-cinematic-product-video",
    templateName: "Cinematic Product Video Reveal",
    promptVersionId: "pv-cinematic-v1",
    promptVersionNumber: 1,
    languageCode: "hi",
    uiPrompt:
      "सिनेमैटिक गुणवत्ता और सटीक विवरण के साथ बनाएं: डार्क मिनिमल बैकग्राउंड में {{product_name}} का स्लो-मोशन वीडियो, Kling 2.1 मॉडल के साथ 60 fps स्मूथ रेंडर।",
    contextPrompt:
      "सिस्टम संदर्भ और रेंडरिंग निर्देश: 360-डिग्री ऑर्बिटल कैमरा मूवमेंट बनाए रखें।",
    status: "completed",
    published: false,
    createdAt: "2026-09-21T10:00:00Z",
    updatedAt: "2026-09-21T10:04:00Z",
  },
  {
    id: "trans-hi-saas-009",
    templateId: "template-saas-landing-page",
    templateName: "Modern SaaS Landing Page Hero",
    promptVersionId: "pv-saas-v1",
    promptVersionNumber: 1,
    languageCode: "hi",
    uiPrompt: "",
    contextPrompt: "",
    status: "pending",
    published: false,
    createdAt: "2026-09-26T10:00:00Z",
    updatedAt: "2026-09-26T10:00:00Z",
  },

  // 5. French templates (disabled language, preserves data)
  {
    id: "trans-fr-luxury-010",
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Perfume Commercial Still",
    promptVersionId: "pv-luxury-v3",
    promptVersionNumber: 3,
    languageCode: "fr",
    uiPrompt:
      "Générer avec une fidélité cinématographique et des détails raffinés : Photographie studio gros plan du parfum {{product_name}} sur socle en marbre noir, micro-gouttelettes, éclairage doré feutré, Midjourney v6.1 --ar 16:9",
    contextPrompt:
      "Contexte système et directives de composition : Maintenir le flacon centré, préserver la marque {{brand}} et les reflets du verre.",
    status: "completed",
    published: false,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-05T14:00:00Z",
  },
];
