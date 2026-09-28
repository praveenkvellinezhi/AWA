import { TemplateEngagementItem, EngagementDateRange } from "../types/template-engagement";
import { initialTemplates } from "./templates";
import { initialAdminCollections } from "./collections";

// Build a map of template ID -> collection names
const templateCollectionMap = new Map<string, string[]>();
initialAdminCollections.forEach((col) => {
  col.templates.forEach((t) => {
    const existing = templateCollectionMap.get(t.id) || [];
    if (!existing.includes(col.name)) {
      existing.push(col.name);
    }
    templateCollectionMap.set(t.id, existing);
  });
});

// Base engagement records derived from template catalog
export const initialTemplateEngagement: TemplateEngagementItem[] = [
  {
    templateId: "template-instagram-campaign",
    templateName: "Instagram Campaign",
    category: "Social Media",
    categoryId: "cat-poster-design",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    likes: 2482,
    saves: 1204,
    totalEngagement: 3686,
    likeSaveRatio: 2.06,
    createdAt: "2026-03-16T10:00:00Z",
    updatedAt: "2026-09-27T16:15:00Z",
    associatedCollections: ["Social Media Content", "Marketing Ideas"],
  },
  {
    templateId: "template-product-advertisement",
    templateName: "Product Advertisement",
    category: "Marketing",
    categoryId: "cat-poster-design",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
    likes: 2104,
    saves: 1982,
    totalEngagement: 4086,
    likeSaveRatio: 1.06,
    createdAt: "2026-02-14T08:30:00Z",
    updatedAt: "2026-09-28T09:40:00Z",
    associatedCollections: ["Marketing Ideas", "Product Photography"],
  },
  {
    templateId: "template-business-presentation",
    templateName: "Business Presentation",
    category: "Presentation",
    categoryId: "cat-presentation",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    likes: 1842,
    saves: 1105,
    totalEngagement: 2947,
    likeSaveRatio: 1.67,
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-09-26T14:20:00Z",
    associatedCollections: ["Business Templates", "Presentation Templates"],
  },
  {
    templateId: "template-luxury-product-shoot",
    templateName: "Luxury Product Shoot",
    category: "Image Generation",
    categoryId: "cat-image-gen",
    thumbnail: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    likes: 2400,
    saves: 1650,
    totalEngagement: 4050,
    likeSaveRatio: 1.45,
    createdAt: "2026-03-21T10:00:00Z",
    updatedAt: "2026-09-28T11:00:00Z",
    associatedCollections: ["Business Templates", "Product Photography"],
  },
  {
    templateId: "template-saas-landing-page",
    templateName: "SaaS Landing Page",
    category: "Website Making",
    categoryId: "cat-website-making",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    likes: 3200,
    saves: 2150,
    totalEngagement: 5350,
    likeSaveRatio: 1.49,
    createdAt: "2026-03-18T10:00:00Z",
    updatedAt: "2026-09-28T14:30:00Z",
    associatedCollections: ["Business Templates", "Marketing Ideas"],
  },
  {
    templateId: "template-cinematic-product-video",
    templateName: "Cinematic Product Video",
    category: "Video Generation",
    categoryId: "cat-video-gen",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    likes: 3850,
    saves: 2640,
    totalEngagement: 6490,
    likeSaveRatio: 1.46,
    createdAt: "2026-03-10T15:00:00Z",
    updatedAt: "2026-09-27T18:22:00Z",
    associatedCollections: ["Video Generation"],
  },
  {
    templateId: "template-animated-explainer-reel",
    templateName: "Animated Explainer Reel",
    category: "Video Generation",
    categoryId: "cat-video-gen",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80",
    likes: 1950,
    saves: 1804,
    totalEngagement: 3754,
    likeSaveRatio: 1.08,
    createdAt: "2026-03-14T09:15:00Z",
    updatedAt: "2026-09-25T17:40:00Z",
    associatedCollections: ["Video Generation", "Social Media Content", "Marketing Ideas"],
  },
  {
    templateId: "template-modern-interior-design",
    templateName: "Modern Interior Design",
    category: "Image Generation",
    categoryId: "cat-image-gen",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    likes: 1800,
    saves: 1240,
    totalEngagement: 3040,
    likeSaveRatio: 1.45,
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-09-24T12:00:00Z",
    associatedCollections: ["Product Photography"],
  },
  {
    templateId: "template-quarterly-business-review",
    templateName: "Quarterly Business Review",
    category: "Presentation",
    categoryId: "cat-presentation",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    likes: 1420,
    saves: 960,
    totalEngagement: 2380,
    likeSaveRatio: 1.48,
    createdAt: "2026-03-05T11:20:00Z",
    updatedAt: "2026-09-26T16:00:00Z",
    associatedCollections: ["Business Templates", "Presentation Templates"],
  },
  {
    templateId: "template-cyberpunk-streetwear",
    templateName: "Cyberpunk Streetwear Drop",
    category: "Poster & Design",
    categoryId: "cat-poster-design",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    likes: 1250,
    saves: 680,
    totalEngagement: 1930,
    likeSaveRatio: 1.84,
    createdAt: "2026-03-08T14:40:00Z",
    updatedAt: "2026-09-23T10:30:00Z",
    associatedCollections: ["Social Media Content"],
  },
  {
    templateId: "template-minimalist-portfolio",
    templateName: "Minimalist Portfolio",
    category: "Website Making",
    categoryId: "cat-website-making",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80",
    likes: 1100,
    saves: 850,
    totalEngagement: 1950,
    likeSaveRatio: 1.29,
    createdAt: "2026-02-28T16:00:00Z",
    updatedAt: "2026-09-22T15:10:00Z",
    associatedCollections: [],
  },
  {
    templateId: "template-3d-character-concept",
    templateName: "3D Character Concept",
    category: "Image Generation",
    categoryId: "cat-image-gen",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    likes: 980,
    saves: 720,
    totalEngagement: 1700,
    likeSaveRatio: 1.36,
    createdAt: "2026-02-18T13:30:00Z",
    updatedAt: "2026-09-21T09:20:00Z",
    associatedCollections: [],
  },
  {
    templateId: "template-video-storyboard",
    templateName: "Video Storyboard",
    category: "Video Generation",
    categoryId: "cat-video-gen",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
    likes: 1032,
    saves: 1520,
    totalEngagement: 2552,
    likeSaveRatio: 0.68,
    createdAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-09-27T11:00:00Z",
    associatedCollections: ["Video Generation"],
  },
  {
    templateId: "template-brand-guidelines-deck",
    templateName: "Brand Guidelines Deck",
    category: "Presentation",
    categoryId: "cat-presentation",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80",
    likes: 840,
    saves: 610,
    totalEngagement: 1450,
    likeSaveRatio: 1.38,
    createdAt: "2026-02-12T11:00:00Z",
    updatedAt: "2026-09-20T17:15:00Z",
    associatedCollections: ["Business Templates"],
  },
  {
    templateId: "template-editorial-magazine-cover",
    templateName: "Editorial Magazine Cover",
    category: "Poster & Design",
    categoryId: "cat-poster-design",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80",
    likes: 670,
    saves: 430,
    totalEngagement: 1100,
    likeSaveRatio: 1.56,
    createdAt: "2026-02-25T14:10:00Z",
    updatedAt: "2026-09-19T13:40:00Z",
    associatedCollections: [],
  },
  {
    templateId: "template-ai-startup-pitch",
    templateName: "AI Startup Pitch",
    category: "Presentation",
    categoryId: "cat-presentation",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    likes: 1680,
    saves: 1420,
    totalEngagement: 3100,
    likeSaveRatio: 1.18,
    createdAt: "2026-03-12T10:30:00Z",
    updatedAt: "2026-09-28T08:00:00Z",
    associatedCollections: ["Presentation Templates"],
  },
];

// Helper to scale engagement values realistically based on selected date range
export function applyDateRangeFactor(
  items: TemplateEngagementItem[],
  dateRange: EngagementDateRange = "allTime"
): TemplateEngagementItem[] {
  let factor = 1.0;
  switch (dateRange) {
    case "today":
      factor = 0.035; // ~3.5% of total
      break;
    case "last7days":
      factor = 0.16; // ~16%
      break;
    case "last30days":
      factor = 0.42; // ~42%
      break;
    case "last90days":
      factor = 0.74; // ~74%
      break;
    case "thisYear":
      factor = 0.92; // ~92%
      break;
    case "allTime":
    default:
      factor = 1.0;
      break;
  }

  return items.map((item) => {
    const likes = Math.round(item.likes * factor);
    const saves = Math.round(item.saves * factor);
    const totalEngagement = likes + saves;
    const likeSaveRatio = Number((likes / (saves || 1)).toFixed(2));
    return {
      ...item,
      likes,
      saves,
      totalEngagement,
      likeSaveRatio,
    };
  });
}
