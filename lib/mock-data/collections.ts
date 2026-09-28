import { AdminCollection, UserCollection, CollectionTemplateItem } from "../types/collection";

// Privacy-safe template catalogue for selection
export const mockTemplatesCatalog: CollectionTemplateItem[] = [
  {
    id: "template-luxury-product-shoot",
    name: "Luxury Product Shoot",
    category: "Image Generation",
    thumbnail: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    description: "Create stunning product photos with premium look and realistic studio lighting.",
  },
  {
    id: "template-modern-interior-design",
    name: "Modern Interior Design",
    category: "Image Generation",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    description: "Generate realistic interior design concepts and Japandi architectural spaces.",
  },
  {
    id: "template-saas-landing-page",
    name: "SaaS Landing Page",
    category: "Website Making",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    description: "Beautiful landing page design for B2B SaaS products and high-converting apps.",
  },
  {
    id: "template-social-media-ad",
    name: "Social Media Ad",
    category: "Poster & Design",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    description: "Engaging social media advertisement designs with bold typographic layouts.",
  },
  {
    id: "template-cinematic-product-video",
    name: "Cinematic Product Video",
    category: "Video Generation",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    description: "Create cinematic slow-motion product videos and anamorphic macro camera sweeps.",
  },
  {
    id: "template-pitch-deck-presentation",
    name: "Pitch Deck Presentation",
    category: "Presentation",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    description: "Clean venture capital investor deck with clear typography and financial metrics.",
  },
  {
    id: "template-ecommerce-brand-identity",
    name: "E-Commerce Brand Identity",
    category: "Poster & Design",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
    description: "Cohesive brand visual system with typography, logo placement, and packaging.",
  },
  {
    id: "template-3d-character-concept",
    name: "3D Character Concept",
    category: "Image Generation",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    description: "Stylized game character and digital avatar design with studio lighting.",
  },
  {
    id: "template-animated-explainer-reel",
    name: "Animated Explainer Reel",
    category: "Video Generation",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80",
    description: "Dynamic kinetic typography and 2D motion graphics for viral short-form reels.",
  },
  {
    id: "template-minimalist-portfolio",
    name: "Minimalist Portfolio",
    category: "Website Making",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80",
    description: "Sleek editorial portfolio for creative directors, designers, and photographers.",
  },
  {
    id: "template-quarterly-business-review",
    name: "Quarterly Business Review",
    category: "Presentation",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    description: "Executive presentation template for quarterly performance and strategic goals.",
  },
  {
    id: "template-cyberpunk-streetwear",
    name: "Cyberpunk Streetwear Drop",
    category: "Poster & Design",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    description: "Neon futuristic apparel promotional poster with high contrast glitch effects.",
  },
];

// Initial Realistic Admin Collections
export const initialAdminCollections: AdminCollection[] = [
  {
    id: "col-admin-001",
    name: "Business Templates",
    description: "Curated templates for business workflows, executive presentations, and B2B SaaS landing pages.",
    status: "active",
    templates: [
      mockTemplatesCatalog[0], // Luxury Product Shoot
      mockTemplatesCatalog[2], // SaaS Landing Page
      mockTemplatesCatalog[5], // Pitch Deck Presentation
      mockTemplatesCatalog[10], // Quarterly Business Review
    ],
    templateCount: 4,
    createdAt: "2026-09-10T08:30:00Z",
    updatedAt: "2026-09-28T10:15:00Z",
  },
  {
    id: "col-admin-002",
    name: "Marketing Ideas",
    description: "High-converting social campaigns, advertising posters, and viral engagement concepts.",
    status: "active",
    templates: [
      mockTemplatesCatalog[3], // Social Media Ad
      mockTemplatesCatalog[2], // SaaS Landing Page
      mockTemplatesCatalog[8], // Animated Explainer Reel
    ],
    templateCount: 3,
    createdAt: "2026-09-12T09:00:00Z",
    updatedAt: "2026-09-27T14:40:00Z",
  },
  {
    id: "col-admin-003",
    name: "Social Media Content",
    description: "Curated collection for content creators and brands looking to produce short-form viral visuals.",
    status: "active",
    templates: [
      mockTemplatesCatalog[3], // Social Media Ad
      mockTemplatesCatalog[8], // Animated Explainer Reel
      mockTemplatesCatalog[11], // Cyberpunk Streetwear Drop
    ],
    templateCount: 3,
    createdAt: "2026-09-14T11:20:00Z",
    updatedAt: "2026-09-26T16:05:00Z",
  },
  {
    id: "col-admin-004",
    name: "Video Generation",
    description: "Advanced generative video workflows, cinematic sweeps, and camera motion prompts.",
    status: "active",
    templates: [
      mockTemplatesCatalog[4], // Cinematic Product Video
      mockTemplatesCatalog[8], // Animated Explainer Reel
    ],
    templateCount: 2,
    createdAt: "2026-09-15T13:45:00Z",
    updatedAt: "2026-09-28T09:20:00Z",
  },
  {
    id: "col-admin-005",
    name: "Product Photography",
    description: "Studio-grade lighting setups, travertine marble pedestals, and cosmetics commercial renders.",
    status: "inactive", // Inactive for demonstrating the filter & recommendation exclusion
    templates: [
      mockTemplatesCatalog[0], // Luxury Product Shoot
      mockTemplatesCatalog[1], // Modern Interior Design
      mockTemplatesCatalog[6], // E-Commerce Brand Identity
    ],
    templateCount: 3,
    createdAt: "2026-09-18T10:00:00Z",
    updatedAt: "2026-09-25T11:30:00Z",
  },
  {
    id: "col-admin-006",
    name: "Presentation Templates",
    description: "Executive keynotes, investor pitch decks, and company roadmap slide designs.",
    status: "active",
    templates: [
      mockTemplatesCatalog[5], // Pitch Deck Presentation
      mockTemplatesCatalog[10], // Quarterly Business Review
    ],
    templateCount: 2,
    createdAt: "2026-09-20T14:10:00Z",
    updatedAt: "2026-09-27T17:50:00Z",
  },
];

// Initial Realistic User Collections (Saved by platform users - Read Only for admins)
export const initialUserCollections: UserCollection[] = [
  {
    id: "col-user-001",
    userId: "usr-101",
    userName: "John Doe",
    userEmail: "john.doe@creativestudio.ai",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    name: "My Marketing Ideas",
    description: "Saved templates for our agency's Q4 client pitch deck and landing page sprints.",
    templates: [
      mockTemplatesCatalog[2], // SaaS Landing Page
      mockTemplatesCatalog[3], // Social Media Ad
      mockTemplatesCatalog[5], // Pitch Deck Presentation
      mockTemplatesCatalog[8], // Animated Explainer Reel
    ],
    templateCount: 4,
    createdAt: "2026-09-28T08:14:00Z",
    updatedAt: "2026-09-28T10:30:00Z",
  },
  {
    id: "col-user-002",
    userId: "usr-102",
    userName: "Sarah Smith",
    userEmail: "sarah.smith@novamedia.io",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    name: "Video References",
    description: "Motion references for Gen-3 and Kling video experiments.",
    templates: [
      mockTemplatesCatalog[4], // Cinematic Product Video
      mockTemplatesCatalog[8], // Animated Explainer Reel
    ],
    templateCount: 2,
    createdAt: "2026-09-26T11:20:00Z",
    updatedAt: "2026-09-26T15:45:00Z",
  },
  {
    id: "col-user-003",
    userId: "usr-103",
    userName: "Michael Chang",
    userEmail: "m.chang@apexwear.com",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    name: "E-Commerce Visuals",
    description: "Product photography shots and streetwear drop posters for our shop.",
    templates: [
      mockTemplatesCatalog[0], // Luxury Product Shoot
      mockTemplatesCatalog[6], // E-Commerce Brand Identity
      mockTemplatesCatalog[11], // Cyberpunk Streetwear Drop
    ],
    templateCount: 3,
    createdAt: "2026-09-24T16:00:00Z",
    updatedAt: "2026-09-25T09:12:00Z",
  },
  {
    id: "col-user-004",
    userId: "usr-104",
    userName: "Elena Rostova",
    userEmail: "elena@rostovadesign.eu",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    name: "Brand Identity Concepts",
    description: "Curated styles for luxury packaging and modern interior clients.",
    templates: [
      mockTemplatesCatalog[0], // Luxury Product Shoot
      mockTemplatesCatalog[1], // Modern Interior Design
      mockTemplatesCatalog[6], // E-Commerce Brand Identity
      mockTemplatesCatalog[9], // Minimalist Portfolio
    ],
    templateCount: 4,
    createdAt: "2026-09-21T13:40:00Z",
    updatedAt: "2026-09-27T12:00:00Z",
  },
  {
    id: "col-user-005",
    userId: "usr-105",
    userName: "David Kim",
    userEmail: "david.kim@seoultech.kr",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    name: "Architectural Renders",
    description: "Spatial and lighting reference guides for architectural concept models.",
    templates: [
      mockTemplatesCatalog[1], // Modern Interior Design
      mockTemplatesCatalog[9], // Minimalist Portfolio
    ],
    templateCount: 2,
    createdAt: "2026-09-18T10:05:00Z",
    updatedAt: "2026-09-20T14:22:00Z",
  },
  {
    id: "col-user-006",
    userId: "usr-102",
    userName: "Sarah Smith",
    userEmail: "sarah.smith@novamedia.io",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    name: "Podcast Snippets & Social",
    description: "Fast assets for audio snippet audiograms and reels.",
    templates: [
      mockTemplatesCatalog[3], // Social Media Ad
      mockTemplatesCatalog[8], // Animated Explainer Reel
    ],
    templateCount: 2,
    createdAt: "2026-09-15T09:30:00Z",
    updatedAt: "2026-09-22T18:10:00Z",
  },
];
