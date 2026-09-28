import { SupportRequest } from "@/lib/types";

export const initialSupportRequests: SupportRequest[] = [
  {
    id: "SUP-000124",
    subject: "Image generation issue using reference image in Kling",
    category: "AI Generation",
    priority: "high",
    status: "in-progress",
    user: {
      id: "usr-101",
      name: "John Doe",
      email: "john.doe@creativestudio.ai",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "United States",
      deviceLimit: 3,
    },
    assignedTo: "adm-1",
    assignedAdminName: "Praveen (Lead Admin)",
    messages: [
      {
        id: "msg-1",
        sender: "John Doe",
        senderType: "user",
        message:
          "I am trying to generate a cinematic product video using the Image-to-Video guide with Kling. I uploaded the bottle reference image from Step 03, but the output video keeps distorting the label typography and introducing water-droplet artifacts that weren't in the prompt.",
        attachments: [
          {
            id: "att-1",
            name: "kling-artifact-frame.png",
            url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
            type: "image/png",
            sizeFormatted: "1.4 MB",
          },
        ],
        createdAt: "2026-09-28T09:15:00Z",
      },
      {
        id: "msg-2",
        sender: "Praveen (Lead Admin)",
        senderType: "admin",
        message:
          "Hi John, thanks for reaching out. We analyzed the frame you attached. In Kling 1.5, when Motion Strength is set above 6, fine typographic labels on curved surfaces tend to deform. Could you please check your Motion Strength slider and set it to 3 or 4 with 'Camera: Slow Push-in'?",
        createdAt: "2026-09-28T09:42:00Z",
      },
      {
        id: "msg-3",
        sender: "John Doe",
        senderType: "user",
        message:
          "Thanks for the fast reply! I lowered the motion strength to 3.5. The label stayed much sharper. However, is there a recommended negative prompt I should include for the reflections?",
        createdAt: "2026-09-28T10:05:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-1",
        author: "Praveen (Lead Admin)",
        note: "Verified user account: Pro subscriber active since July 2026. Checked generation telemetry: User ran 4 variations with motionStrength=8. Recommended lowering to 3.5.",
        createdAt: "2026-09-28T09:30:00Z",
      },
      {
        id: "note-2",
        author: "Sarah (Support)",
        note: "Followed up with product team to add a negative prompt preset for glass surface reflections in the Kling template.",
        createdAt: "2026-09-28T10:10:00Z",
      },
    ],
    attachments: [
      {
        id: "att-1",
        name: "kling-artifact-frame.png",
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        type: "image/png",
        sizeFormatted: "1.4 MB",
      },
    ],
    createdAt: "2026-09-28T09:15:00Z",
    updatedAt: "2026-09-28T10:05:00Z",
  },
  {
    id: "SUP-000125",
    subject: "Tax invoice / GST identification number needed for business expense",
    category: "Billing",
    priority: "medium",
    status: "open",
    user: {
      id: "usr-102",
      name: "Sarah Jenkins",
      email: "sarah.j@apexdesign.co.uk",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
      plan: "Lifetime Access",
      country: "United Kingdom",
      deviceLimit: 5,
    },
    assignedTo: "unassigned",
    assignedAdminName: "Unassigned",
    messages: [
      {
        id: "msg-101",
        sender: "Sarah Jenkins",
        senderType: "user",
        message:
          "Hello AWA Finance team, I purchased the Lifetime Access plan yesterday through Stripe, but the email receipt doesn't include our company's VAT/GST registration number (GB987654321). Could you please regenerate our official invoice showing our corporate tax ID?",
        attachments: [
          {
            id: "att-101",
            name: "stripe-receipt-oct2026.pdf",
            url: "#",
            type: "application/pdf",
            sizeFormatted: "184 KB",
          },
        ],
        createdAt: "2026-09-28T08:30:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-101",
        author: "Finance Bot",
        note: "Stripe transaction id: ch_3P92jxK199. Payment verified: £149.00 GBP. Awaiting admin invoice generation.",
        createdAt: "2026-09-28T08:32:00Z",
      },
    ],
    attachments: [
      {
        id: "att-101",
        name: "stripe-receipt-oct2026.pdf",
        url: "#",
        type: "application/pdf",
        sizeFormatted: "184 KB",
      },
    ],
    createdAt: "2026-09-28T08:30:00Z",
    updatedAt: "2026-09-28T08:30:00Z",
  },
  {
    id: "SUP-000126",
    subject: "Urgent: Lifetime Plan not unlocking AI Customization Panel",
    category: "Subscription",
    priority: "urgent",
    status: "in-progress",
    user: {
      id: "usr-103",
      name: "Marcus Vance",
      email: "marcus.v@hyperionagency.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
      plan: "Lifetime Access",
      country: "Germany",
      deviceLimit: 5,
    },
    assignedTo: "adm-2",
    assignedAdminName: "Alex (Engineering Lead)",
    messages: [
      {
        id: "msg-201",
        sender: "Marcus Vance",
        senderType: "user",
        message:
          "I completed payment for Lifetime Access 30 minutes ago, but the template customizer is still showing the paywall lock card: 'Subscribe to Unlock Customization'. My account shows Lifetime in the header, but the API seems to think I am on Free tier.",
        createdAt: "2026-09-28T07:45:00Z",
      },
      {
        id: "msg-202",
        sender: "Alex (Engineering Lead)",
        senderType: "admin",
        message:
          "Hello Marcus, our engineering team is actively investigating this. We noticed a brief webhook delay in token entitlement synchronization between Razorpay and our session cache. We are manually pushing an entitlement refresh to your account right now.",
        createdAt: "2026-09-28T08:05:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-201",
        author: "Alex (Engineering Lead)",
        note: "Redis session entitlement was cached with old JWT. Invalidated cache key `user:usr-103:entitlements`. User can now access customizer.",
        createdAt: "2026-09-28T08:12:00Z",
      },
    ],
    createdAt: "2026-09-28T07:45:00Z",
    updatedAt: "2026-09-28T08:05:00Z",
  },
  {
    id: "SUP-000127",
    subject: "Video-to-Video transformation prompt failing on 4K resolution exports",
    category: "Technical",
    priority: "high",
    status: "pending",
    user: {
      id: "usr-104",
      name: "Elena Rostova",
      email: "elena@cinecraft.studio",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "Canada",
      deviceLimit: 3,
    },
    assignedTo: "adm-1",
    assignedAdminName: "Praveen (Lead Admin)",
    messages: [
      {
        id: "msg-301",
        sender: "Elena Rostova",
        senderType: "user",
        message:
          "When executing Step 05 of the Cyberpunk Video-to-Video guide in Runway Gen-3, the upscale process timeouts at 92% when selecting 4K resolution with 60fps. Does AWA have a recommended intermediate resolution (like 1080p upscaled in Topaz)?",
        createdAt: "2026-09-27T16:20:00Z",
      },
      {
        id: "msg-302",
        sender: "Praveen (Lead Admin)",
        senderType: "admin",
        message:
          "Hi Elena, great question! Runway Gen-3 native 4K direct generation frequently hits memory limits on footage longer than 4 seconds. Our recommended production workflow is to render in 1080p ProRes 422 HQ, then run an AI upscale pass using Topaz Video AI. Could you try exporting in 1080p and let us know if that completes without timeout?",
        createdAt: "2026-09-27T17:10:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-301",
        author: "Praveen (Lead Admin)",
        note: "Waiting for Elena's reply on the 1080p test. We should also add a tooltip note in Step 05 settings.",
        createdAt: "2026-09-27T17:15:00Z",
      },
    ],
    createdAt: "2026-09-27T16:20:00Z",
    updatedAt: "2026-09-27T17:10:00Z",
  },
  {
    id: "SUP-000128",
    subject: "Request for French & Spanish localization in AI Rewriter Prompts",
    category: "Feature Request",
    priority: "low",
    status: "resolved",
    user: {
      id: "usr-105",
      name: "Claire Dubois",
      email: "c.dubois@atelierdesign.paris",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "France",
      deviceLimit: 2,
    },
    assignedTo: "adm-3",
    assignedAdminName: "Sarah (Support Specialist)",
    messages: [
      {
        id: "msg-401",
        sender: "Claire Dubois",
        senderType: "user",
        message:
          "Bonjour! We love the AWA platform. Is there any plan to support French and Spanish language output when customizing prompts via the AI Rewriter? Currently, all rewritten prompts default strictly to English.",
        createdAt: "2026-09-26T11:00:00Z",
      },
      {
        id: "msg-402",
        sender: "Sarah (Support Specialist)",
        senderType: "admin",
        message:
          "Bonjour Claire! We are delighted to share that in our latest release, the AI Rewriter now supports multi-language output! You can select French or Spanish from the new language selector in the prompt toolbar, or explicitly type 'Rewrite this in French' in your customization query.",
        createdAt: "2026-09-26T14:30:00Z",
      },
      {
        id: "msg-403",
        sender: "Claire Dubois",
        senderType: "user",
        message:
          "Magnifique! I just tested it on the Minimalist Architecture template and it rendered flawless French prompt syntax. Merci beaucoup!",
        createdAt: "2026-09-26T15:15:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-401",
        author: "Sarah (Support Specialist)",
        note: "Verified that Languages & i18n module was pushed to production. Feature confirmed functional by user.",
        createdAt: "2026-09-26T15:20:00Z",
      },
    ],
    resolutionSummary:
      "Informed user of the newly released Multi-Language support in the AI Rewriter. User tested and verified successful French output.",
    resolvedAt: "2026-09-26T15:20:00Z",
    createdAt: "2026-09-26T11:00:00Z",
    updatedAt: "2026-09-26T15:20:00Z",
  },
  {
    id: "SUP-000129",
    subject: "Active device limit reached on studio workstation",
    category: "Account",
    priority: "medium",
    status: "closed",
    user: {
      id: "usr-106",
      name: "David Kim",
      email: "david@seoulmotion.kr",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "South Korea",
      deviceLimit: 3,
    },
    assignedTo: "adm-1",
    assignedAdminName: "Praveen (Lead Admin)",
    messages: [
      {
        id: "msg-501",
        sender: "David Kim",
        senderType: "user",
        message:
          "I upgraded our Mac Studio workstation and when I try to log in, it says 'Device limit reached (3 of 3 devices active)'. Can you please clear my old inactive sessions so I can connect the new machine?",
        createdAt: "2026-09-25T04:10:00Z",
      },
      {
        id: "msg-502",
        sender: "Praveen (Lead Admin)",
        senderType: "admin",
        message:
          "Hi David, we have cleared the session tokens from your previous machines. You can now log into your new Mac Studio workstation without any restrictions.",
        createdAt: "2026-09-25T05:00:00Z",
      },
      {
        id: "msg-503",
        sender: "David Kim",
        senderType: "user",
        message: "Logged in successfully. Thank you!",
        createdAt: "2026-09-25T05:20:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-501",
        author: "Praveen (Lead Admin)",
        note: "Cleared device session tokens via user security tab. Reset active count to 1.",
        createdAt: "2026-09-25T05:00:00Z",
      },
    ],
    resolutionSummary:
      "Revoked stale device authentication sessions. User verified new workstation login.",
    resolvedAt: "2026-09-25T05:25:00Z",
    closedAt: "2026-09-25T05:30:00Z",
    createdAt: "2026-09-25T04:10:00Z",
    updatedAt: "2026-09-25T05:30:00Z",
  },
  {
    id: "SUP-000130",
    subject: "Text contrast issue in Step Builder light mode dropdowns",
    category: "Bug Report",
    priority: "high",
    status: "in-progress",
    user: {
      id: "usr-107",
      name: "Amina Al-Mansoor",
      email: "amina@dubaimedia.ae",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
      plan: "Lifetime Access",
      country: "United Arab Emirates",
      deviceLimit: 5,
    },
    assignedTo: "adm-2",
    assignedAdminName: "Alex (Engineering Lead)",
    messages: [
      {
        id: "msg-601",
        sender: "Amina Al-Mansoor",
        senderType: "user",
        message:
          "In the Template Guide Builder, when my browser is set to Light Mode, the dropdown selectors for 'Image Usage' and 'Reference Purpose' have white text on a very pale grey background, making them invisible until hovered.",
        attachments: [
          {
            id: "att-601",
            name: "light-mode-contrast-bug.png",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            type: "image/png",
            sizeFormatted: "920 KB",
          },
        ],
        createdAt: "2026-09-28T06:15:00Z",
      },
      {
        id: "msg-602",
        sender: "Alex (Engineering Lead)",
        senderType: "admin",
        message:
          "Thank you for the detailed bug report and screenshot, Amina. We identified the issue: some select triggers were using an explicit dark text class without semantic light-mode token fallbacks. Our patch is ready and deploying shortly.",
        createdAt: "2026-09-28T07:00:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-601",
        author: "Alex (Engineering Lead)",
        note: "Fix applied in `StepAiWorkflowEditor.tsx` using semantic `text-slate-900 dark:text-white` classes.",
        createdAt: "2026-09-28T07:05:00Z",
      },
    ],
    attachments: [
      {
        id: "att-601",
        name: "light-mode-contrast-bug.png",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        type: "image/png",
        sizeFormatted: "920 KB",
      },
    ],
    createdAt: "2026-09-28T06:15:00Z",
    updatedAt: "2026-09-28T07:00:00Z",
  },
  {
    id: "SUP-000131",
    subject: "Inquiry regarding custom MCP server configuration for corporate teams",
    category: "Template / Guide",
    priority: "medium",
    status: "open",
    user: {
      id: "usr-108",
      name: "Liam O'Connor",
      email: "liam@techventures.ie",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "Ireland",
      deviceLimit: 3,
    },
    assignedTo: "unassigned",
    assignedAdminName: "Unassigned",
    messages: [
      {
        id: "msg-701",
        sender: "Liam O'Connor",
        senderType: "user",
        message:
          "Hi team, does AWA provide an MCP (Model Context Protocol) connector that our engineering team can use inside Claude Desktop or Cursor to fetch our team's customized AWA prompt pipelines directly into our IDE?",
        createdAt: "2026-09-28T11:20:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-701",
        author: "Praveen (Lead Admin)",
        note: "Customer is asking about the MCP bridge. Send our MCP config documentation link and sample mcp_config.json snippet.",
        createdAt: "2026-09-28T11:25:00Z",
      },
    ],
    createdAt: "2026-09-28T11:20:00Z",
    updatedAt: "2026-09-28T11:20:00Z",
  },
  {
    id: "SUP-000132",
    subject: "Full refund request within 7-day money-back guarantee period",
    category: "Billing",
    priority: "high",
    status: "resolved",
    user: {
      id: "usr-109",
      name: "Rajesh Sharma",
      email: "rajesh@sharmaconsulting.in",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
      plan: "Monthly Unlimited",
      country: "India",
      deviceLimit: 2,
    },
    assignedTo: "adm-3",
    assignedAdminName: "Sarah (Support Specialist)",
    messages: [
      {
        id: "msg-801",
        sender: "Rajesh Sharma",
        senderType: "user",
        message:
          "Hello, I subscribed 3 days ago for ₹199 monthly plan, but our project scope has shifted away from AI video. Per your 7-day guarantee, could you please process a refund to my original payment UPI/card?",
        createdAt: "2026-09-25T14:00:00Z",
      },
      {
        id: "msg-802",
        sender: "Sarah (Support Specialist)",
        senderType: "admin",
        message:
          "Hello Rajesh, no problem at all! We have processed a 100% refund of ₹199.00 to your original Razorpay payment method. You should see it credited to your account within 2-4 business days. Thank you for trying AWA!",
        createdAt: "2026-09-25T14:45:00Z",
      },
      {
        id: "msg-803",
        sender: "Rajesh Sharma",
        senderType: "user",
        message: "Received the Razorpay refund confirmation email. Excellent service, thank you!",
        createdAt: "2026-09-25T15:00:00Z",
      },
    ],
    internalNotes: [
      {
        id: "note-801",
        author: "Sarah (Support Specialist)",
        note: "Refund processed on Razorpay Dashboard ARN: RZP_RF_9823471. Entitlements reverted to Free tier.",
        createdAt: "2026-09-25T14:40:00Z",
      },
    ],
    resolutionSummary:
      "Processed 100% prompt refund per 7-day policy via Razorpay. Customer confirmed receipt.",
    resolvedAt: "2026-09-25T15:05:00Z",
    createdAt: "2026-09-25T14:00:00Z",
    updatedAt: "2026-09-25T15:05:00Z",
  },
  {
    id: "SUP-000133",
    subject: "Camera physics and prompt structure questions for Sora and Veo",
    category: "AI Generation",
    priority: "low",
    status: "open",
    user: {
      id: "usr-110",
      name: "Taro Takahashi",
      email: "taro.t@tokyodesign.jp",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&h=120&fit=crop",
      plan: "Lifetime Access",
      country: "Japan",
      deviceLimit: 4,
    },
    assignedTo: "unassigned",
    assignedAdminName: "Unassigned",
    messages: [
      {
        id: "msg-901",
        sender: "Taro Takahashi",
        senderType: "user",
        message:
          "Which prompt keywords yield the most realistic camera momentum in Google Veo compared to Sora? In Veo, our drone flythrough shots sometimes exhibit slight perspective warping around the edges.",
        createdAt: "2026-09-28T12:00:00Z",
      },
    ],
    internalNotes: [],
    createdAt: "2026-09-28T12:00:00Z",
    updatedAt: "2026-09-28T12:00:00Z",
  },
];
