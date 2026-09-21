# AWA — Problem Definition

**Status:** Foundational document. No product, feature, UX, architecture, or implementation decisions are made here.
**Source material (rephrased/updated project docs):** `features.md`, `architect.md`, `visualization.md`, `tech-stack.md`.
**Evidence key:** FACT = explicitly stated in the supplied material · ASSUMPTION = reasonable but unconfirmed · UNKNOWN = not addressed anywhere in the material.

**What changed since the previous version of this document:** the product now includes a real, paid AI capability — a **customization engine** that rewrites an admin-written prompt when a user asks for a change (by typing or speaking) — and a separate **credits** system that meters that usage. Prompts are no longer built from admin-defined "blanks"/guided fields; each template's prompt is finished text, and all personalization happens through the new customization step. Templates and tools are also now tagged by **AI model** (e.g., Runway Gen-3, Sora, Pika 1.5), which powers both tool recommendations and a new filter. This version supersedes the prior draft where it conflicts.

---

## 1. Core Product Concept

**FACT.** AWA is an AI Creation Guide Platform. People who want to make a poster, logo, short video, or website using AI know that AI tools exist but don't know which tool to use or what to type into it.

**FACT (updated flow).** The person picks a category, picks a ready-made template, and receives: (1) a finished prompt they can copy, (2) 1–3 recommended AI tools with a one-line reason each, and (3) a few short steps for using the chosen tool. If the prompt isn't quite right, they can now **customize it** — typing or speaking what they'd like changed — and the system rewrites the prompt for them. They then leave, use the tool, and can return to say whether it worked.

**One-line version (FACT):** "Pick a category → get an expert prompt → adjust it in your own words → get the right AI tool and the steps to use it."

**FACT.** AWA still does not generate the final image, video, website, or presentation — that happens on an external AI tool. This remains fundamental.

**FACT — this is the most significant confirmed change from the prior version.** AWA is no longer a purely non-AI system. It now uses an outside AI service in exactly one place: rewriting a prompt when a user requests a change via Customize. The base prompt a user first sees is still written entirely by hand by an admin, involves no AI, is instant, free to serve, and identical for every user of that template. Only the *optional* customization step calls an AI service, and that call costs real money each time.

---

## 2. Analysis of the Problem

- **FACT** — The core split remains: users know AI tools exist, but that alone doesn't solve tool selection or prompt-writing.
- **FACT (new nuance)** — Tool selection is now explicitly tied to a specific **AI model**, not just a tool brand: "A video prompt written for Sora is worded differently from one written for Runway or Pika." This means the discovery/selection problem includes model-level mismatch, not just tool-level mismatch — a user with only a Runway account is confirmed (per the material) to waste time and blame the prompt if given a Sora-oriented prompt.
- **FACT (new nuance)** — Prompt creation is no longer framed as "the user doesn't know which fields to fill in" (the guided-fields/blank mechanism has been removed). It is now framed as: an admin can't anticipate every variation a user might want, so the product lets the user ask, in their own words, for the specific change they need, via an AI rewrite. This reframes part of the problem from *structured input collection* to *natural-language refinement*.
- **ASSUMPTION** — Beginners and experienced users likely still need different levels of help (e.g., an experienced user may go straight to Customize with a precise request; a beginner may rely entirely on the unmodified base prompt). Not confirmed by user research in the material.
- **UNKNOWN** — Whether the primary problem is now discovery, prompt creation, prompt refinement (customization), or tool/model matching — the material does not rank these against each other.

---

## 3. Core User Problem Statement

> A **person who wants to create something (image, video, website, presentation, or poster) using AI** wants to **turn a simple idea into a finished, usable AI creation on the tool/model they actually have access to**, but struggles because **they don't know which AI tool or model fits their task, what to write as a prompt, and how to adjust a close-but-not-quite-right prompt without prompt-writing skill**, resulting in **UNKNOWN — impact is not quantified in the material; see Section 5**.

The subject, activity, and root-cause clauses are supported by the material (FACT, including the new model-matching and refinement elements). The **impact clause remains UNKNOWN**.

---

## 4. Root Cause Analysis

### AI Tool & Model Discovery
- **ASSUMPTION** — Users struggle to determine which tool fits their task (carried over).
- **FACT (new)** — Users can also be blocked by *model*-level mismatch: a template written for one model reads differently and may not work well on another. This is stated directly, not inferred: "someone with a Runway subscription wastes time on prompts written for Sora, and blames your prompts when the result is poor" (architecture rationale for the model filter).

### Prompt Creation
- **ASSUMPTION** — Users don't inherently know good prompt-writing technique (carried over, now addressed by admin-authored finished prompts rather than user-filled fields).
- **FACT (new)** — The product's own design premise is that an admin "can't anticipate every variation" a user might want — implying prompt personalization is a real, ongoing problem serious enough to justify an AI-rewrite feature, not just a nice-to-have.

### Workflow Knowledge
- **FACT** — The product still provides short steps for what to click once at the external tool, implying a confirmed belief that post-prompt usage guidance is a real gap.

### Information Organization
- **ASSUMPTION** — AI creation use cases, tools, and prompt sources remain scattered (carried over; unchanged by this update).

### Prompt Refinement (new candidate root cause)
- **FACT (design inference, not user-research-confirmed)** — Even with a well-written base prompt, users may want something adjusted (framing, subject, format, mood) that the admin didn't anticipate, and cannot articulate that adjustment as a well-formed prompt themselves — hence the need for an AI intermediary. This is a confirmed product decision but not a confirmed, validated user pain point.

**Overall:** as before, none of these are confirmed by direct user research; they are inferred from what the product is now built to do, with one new category (prompt refinement) added by this version.

---

## 5. Why the Problem Matters

- **UNKNOWN** — No quantified consequences (time wasted, poor results, lost confidence) are stated.
- **FACT (design inference)** — The product's constraints (max 3 tool options, 4–7 steps, one required description field previously, now a single finished prompt with optional refinement) continue to reflect a stated belief that too much unguided complexity is itself a problem.
- **FACT (new)** — A stated business risk exists if refinement isn't controlled: "A ₹199 yearly subscriber who customizes 500 times would cost more than they paid" — this quantifies a *cost* risk to the business, not a user-side impact, but it is a real, confirmed consequence of the underlying problem (users wanting many prompt adjustments).
- Metrics not yet measured, to track going forward: time to find a relevant template, prompt copy rate, customization usage rate, tool click-through rate, feedback ratio, repeat usage (see Section 20).

---

## 6. Target Users

Still inferred from launch categories rather than confirmed personas; the model-filter addition slightly sharpens (but does not fully resolve) this picture.

| Group | Status | What's known |
|---|---|---|
| Website builders | ASSUMPTION | From the "Website Making" category. |
| Image creators | ASSUMPTION | From "Image Generation." |
| Video creators | ASSUMPTION | From "Video Generation" — this group now has a **confirmed** extra need: matching a prompt to the specific model/tool they have access to (e.g., Runway vs. Sora vs. Pika), since the material explicitly discusses this case. |
| Presentation/pitch-deck creators | ASSUMPTION | From "Slides / Presentations." |
| Poster/flyer/banner creators | ASSUMPTION | From "Poster / Design." |
| Mobile-first users | **FACT** (new, explicit) — "most of your users will be on a phone," stated directly as the reason voice input for customization matters. This is the one piece of confirmed audience information in the material. |
| AI beginners | ASSUMPTION | Implied by the low-friction, no-prompt-skill-required design; not confirmed by testing. |
| Designers, marketers, content creators, students, business users | UNKNOWN | Not addressed. |

For every group: familiarity level, detailed pain points, and expected outcomes remain **UNKNOWN** beyond the category-level and mobile-first inferences above (see Section 18).

---

## 7. Stakeholders

| Stakeholder | Status | Basis |
|---|---|---|
| End users / prompt users | FACT | Central actor throughout. |
| Subscribers | FACT | Pay ₹199/yr or ₹999 lifetime to read/copy prompts and use customizations. |
| Platform/content administrators | FACT | Extensive confirmed admin capability set, now including customization-engine controls (rewriting instructions, spending cap, free-customization count, credit packs). |
| Payment provider(s) | FACT | Razorpay at launch; others addable later. |
| **Outside AI rewriting service provider** | **FACT (new)** — A confirmed, named-category stakeholder: "an outside AI service" performs the actual prompt rewrite. Which specific provider is **UNKNOWN** — the material explicitly flags "Which AI service does the rewriting" as an open, unresolved, urgent question. |
| **Speech-to-text service provider** | **FACT (new)** — A confirmed second outside service, used for voice-based customization requests. Specific provider is **UNKNOWN** (also an open question). |
| AI tool/model providers (Midjourney, Runway, Sora, Pika, etc.) | FACT | Named as entries in an admin-managed master list; no formal relationship confirmed. |
| Product owner / business operations | ASSUMPTION | Implied by the admin role and monetization model; no named owner. |

---

## 8. Current User Journey (Before AWA)

**UNKNOWN**, unchanged from the prior version — no current-state research is included. The hypotheses listed previously (search engines/social media → separate tool search → comparison → prompt search/copying → trial and error → separate tutorial-learning → repeat if poor) remain unvalidated and are not restated as fact here.

---

## 9. AWA's Intended User Journey

**FACT (updated, confirmed flow):**

1. User discovers an AI creation use case.
2. User selects a category and navigates subcategories (unlimited depth).
3. User filters/searches — now including a filter by AI model, not just tag/style/mood/difficulty.
4. User selects a template (or starts blank).
5. User sees the finished prompt immediately — no requirement form to fill in first. Subscribers see it in full; non-subscribers see it blurred with a Subscribe prompt.
6. **(New, optional)** If the prompt isn't quite right, the user clicks Customize and types or speaks the desired change; the system sends the base prompt plus the request to an outside AI service, which returns a rewritten prompt a few seconds later. This step: is optional, costs one credit per attempt, always preserves a "Back to original" option, keeps a session history of intermediate customized versions, and does not charge a credit if it fails or times out.
7. User sees 1–3 recommended AI tools/models with a one-line reason each.
8. User sees short usage steps and/or a short video.
9. User copies the (possibly customized) prompt and leaves to use it externally.
10. User may return to give feedback (thumbs up/down, optional comment, optional tool used); if the prompt used was a customized version, the feedback also implicitly captures what the user asked to change.

**Value creation by stage:**
- Steps 2–4 (browse/filter/template, now including model filtering): reduce discovery burden, including *model-fit* burden, not just tool-brand burden.
- Step 5 (instant finished prompt): removes prompt-writing burden entirely for users the base prompt already satisfies.
- Step 6 (customization): removes prompt-writing burden for users whose need differs from the base prompt, without requiring prompt-writing skill.
- Step 7 (tool/model recommendation): reduces tool-selection burden.
- Step 8 (steps/video): reduces tool-usage burden.
- Step 10 (feedback, now including customization-request data): creates a signal loop that tells admins which base prompts are systematically insufficient — explicitly called out in the material as the platform's most valuable report.

---

## 10. Value Proposition

**User Problem → AWA Value → Desired User Outcome**

| User Problem | AWA Value (per material) | Desired Outcome |
|---|---|---|
| Doesn't know what to write as a prompt | Admin-authored, finished, expert-quality prompt served instantly | Usable prompt with zero prompt-writing effort |
| The finished prompt is close but not exactly right | **(New)** Customize: describe the change in plain language (typed or spoken); an AI service rewrites the prompt | Personalized prompt without needing prompt-writing skill |
| Doesn't know which tool — or which specific model — fits the task | Tool/model recommendations (max 3) with a reason, now also filterable by model | Picks a tool/model with a stated rationale and confidence it will actually accept the prompt as worded |
| Doesn't know how to use the tool once there | Short steps and/or a short video | Can act immediately without a separate tutorial |
| Ideas/tools/prompts scattered across sources | Single organized, browsable, filterable (incl. by model) catalog | Finds relevant guidance in one place |

**FACT** — Reading/copying the prompt remains the item the subscription pays for; customization is now confirmed as a **second, separate** paid dimension (credits), explicitly kept distinct so users are never confused about "what lets me read" versus "what lets me change."

**FACT** — "You don't have to anticipate every variation — that's the point of the change [feature]" is stated directly as part of the value proposition to the admin/business, not only the end user: it reduces the content-authoring burden as well as the user's prompt-writing burden.

---

## 11. Business Problem

- **FACT** — Two confirmed revenue mechanisms now exist, deliberately separated:
  - **Subscription** (₹199/yr, ₹999 lifetime) = pays for the ability to read/copy prompts and to use favourites/customizations at all.
  - **Credits** = pays for (or is granted for) each individual AI-powered customization, because each one costs AWA real money via the outside AI service.
- **FACT** — The stated reason credits exist: an unmetered customization feature bundled into a flat ₹199/year subscription would let a heavy user's AI costs exceed what they paid ("A ₹199 yearly subscriber who customizes 500 times would cost more than they paid"). This is a confirmed, explicit unit-economics concern driving product design.
- **FACT** — No share/link feature exists, by deliberate design, to prevent the paid prompt reaching non-payers.
- **UNKNOWN** — What a single customization actually costs AWA in AI-service fees. The material explicitly flags this as the single most urgent open question, since credit-pack pricing cannot be set correctly without it.
- **UNKNOWN / undecided in the material:**
  - Number of free customizations granted per subscriber (5 or 10).
  - Whether credits expire (recommended: no, but not decided).
  - Credit pack prices (₹99/25, ₹299/100, ₹999/500 are offered only as an illustrative starting shape, explicitly marked "not decided").
  - Whether a non-subscriber can purchase credits at all (recommended: no, not decided).
  - Whether free trial credits are given to everyone or subscribers only (recommended: subscribers only, not decided).
  - What happens when a yearly subscription lapses; whether renewal is automatic or manual; one-device vs. two-device login policy — all carried over as still undecided.
- **UNKNOWN** — Revenue projections, market size, target subscriber/customization volumes, CAC/LTV. None are invented here.

---

## 12. Current Alternatives

**UNKNOWN / ASSUMPTION**, unchanged from the prior version. No competitive or alternative-solution analysis is present in the updated material either. Plausible alternatives (search engines, prompt libraries, tutorials, forums, individual AI tool docs, manual trial-and-error) remain unvalidated against AWA specifically, and the customization feature does not change this — no comparison to, e.g., ChatGPT-based prompt help or other AI prompt-rewriting tools is present in the material.

---

## 13. Pain Points

| Category | Pain Point | Status |
|---|---|---|
| Discovery | Finding the right AI tool | ASSUMPTION |
| Discovery (new) | Finding the right AI **model**, not just tool/brand | FACT — directly stated rationale for the model filter |
| Prompt Creation | Not knowing what to write from scratch | ASSUMPTION (now largely absorbed by admin-authored base prompts) |
| Prompt Refinement (new) | Getting a close-but-not-quite-right prompt to match what's actually wanted | FACT (design inference) — this is the entire justification for the customization engine |
| Tool Usage | Not knowing how to use the tool once there | FACT — addressed directly by the steps/video feature |
| Cost Confusion (new) | Not understanding the difference between "what I can read" (subscription) and "what I can change" (credits) | FACT (business risk, explicitly called out: "users must never be confused about which is which") |
| Organization | Prompts/tools/tutorials scattered | ASSUMPTION |
| Confidence | Uncertainty whether a prompt/tool/model choice is "right" | ASSUMPTION |
| Accessibility | Approachability across skill levels, and across input method (typing vs. speaking, especially on mobile) | FACT for the mobile/voice angle (explicitly stated); ASSUMPTION for the broader accessibility claim |

---

## 14. Desired Outcomes

- Users can find a tool **and model** appropriate to what they actually have access to (new, supported by the confirmed model filter).
- Users get a usable, expert-quality prompt with zero prompt-writing effort (supported by the finished-text base-prompt design).
- Users who want something different can get it in their own words, without needing prompt-writing skill (supported by the confirmed customization engine).
- Users understand what to do once they reach the external tool (supported by the confirmed steps/video feature).
- Admins learn what their base prompts are missing, via aggregated customization requests (supported by the confirmed "what people are asking for" report).
- Numerical targets for any of the above: **TBD** — none are defined in the material.

---

## 15. Constraints

**FACT — confirmed constraints stated directly in the material:**
- AWA does not generate the final creative output; that happens on an external AI tool.
- AWA does not host or run its own AI model.
- The **only** AI usage in the product is the customization rewrite step, and it is explicitly designed as optional so the "core product" (browsing, reading, copying the base prompt) keeps working even if the outside AI service is down, slow, or over budget.
- Every customization call to the outside AI service costs real money; this must be metered (credits) and capped (a monthly spending cap) to avoid uncontrolled cost.
- Voice-based customization additionally costs money for speech-to-text, on top of the rewrite cost — the material states both together should still consume only one credit, so as not to confuse users with two charges for one action.
- Prompt quality for the *base* prompt still depends entirely on manual admin authorship; the customization engine does not remove this dependency, it only extends it.
- AI tools and their specific models can change or be retired over time; the tool/model list and its assignments require ongoing admin maintenance.
- Subscription access controls visibility of the base and customized prompt; credits separately control ability to run a customization.
- Categories/subcategories/templates remain configurable to unlimited depth by admins without developer involvement.
- Payments: Razorpay only at launch; other providers addable later via the admin panel without a rebuild.
- Session constraint: one device signed in at a time (or possibly two — still explicitly undecided).

---

## 16. Confirmed Facts

- AWA guides a user from category → subcategory → template (browsable and filterable, including by AI model) → an immediately visible, admin-written finished prompt → an optional AI-powered customization step (type or speak a requested change) → 1–3 recommended AI tools/models with reasons → short usage steps/video → external use → optional feedback.
- The base prompt involves no AI, is instant, free to serve, and identical for every user of a template; only the customization step invokes an outside AI service and costs money per use.
- Templates no longer use admin-defined "blanks"/placeholders or guided input fields; prompts are authored as finished text.
- Customization: user requests a change by typing or speaking; the system sends the original prompt plus the request to an outside AI service; the original is always retained ("Back to original"); intermediate customized versions are kept for the session; each attempt costs one credit; a failed/timed-out attempt does not consume a credit.
- Two separate monetization mechanisms exist: subscription (₹199/yr or ₹999 lifetime) unlocks reading/copying the prompt and the ability to use customizations at all; credits (free starter allotment, then purchased packs) meter each individual customization.
- Running out of credits never blocks reading or copying the base prompt — only the customization action becomes unavailable, converting to a "Buy credits" prompt.
- AI tools now have associated **models** (e.g., Runway Gen-3, Sora, Pika 1.5); templates are tagged with the model(s) they're written for; this same tagging powers both tool recommendations and a new model-based filter, assigned once with inheritance down the category tree.
- Feedback is tied to the exact prompt version used, including customized versions, and aggregated customization requests are explicitly identified as the platform's most valuable content-planning report.
- No share/link feature exists for prompts, by deliberate design.
- Admin can configure the customization engine directly: on/off (globally or per category), number of free customizations granted, credit pack definitions, the standing AI rewriting instruction, a monthly spending cap, and whether voice input is enabled.
- Explicit out-of-scope items for version 1: user-submitted templates, one-click "run this for me" tool automation, whole-project mode, team accounts/coupons/more than two plans, cross-tool result comparison, and prompt sharing by link.
- A previously stated exclusion — free-form requests like "make it more cinematic" — is **no longer excluded**; it is now the primary use case the customization feature exists to serve. This is a direct scope change from the prior version of the product definition.

---

## 17. Assumptions

| Assumption | Why it is being assumed | How to validate |
|---|---|---|
| Users struggle to choose between AI tools/models without help | Implied by tool recommendations and the new model filter; not backed by cited user research | User interviews on how they currently pick a tool/model |
| Users often want something different from a template's base prompt, but can't write that request as a well-formed prompt themselves | This is the entire premise of the customization engine, but it isn't validated with user data in the material | Track customization usage rate and qualitative content of requests once live |
| Users are willing to pay separately for subscription (reading) and credits (changing) without confusion | Explicitly designed as two distinct things, but whether users actually keep them mentally separate is untested | Usability testing of the pricing/UX split; monitor support tickets about confusion |
| Most users are on mobile, making voice input for customization valuable | Stated directly as the reason voice input matters, but not backed by measured device-usage data in the material | Track device/browser mix and voice-vs-typed customization ratio post-launch |
| A one-device-at-a-time (or two-device) login restriction is an acceptable trade-off | Explicitly framed as "a real trade-off, not a free win" | Monitor churn/support tickets after launch; consider A/B test |
| Admins can reliably identify, from customization-request reports, which base prompts to rewrite or split into new templates | Stated as the intended workflow ("you should write that as its own template") but not validated with real usage | Track how often admin content changes are traced back to a customization report |

---

## 18. Unknowns / Information Gaps

### Users
- Who is the primary paying user, and what is their AI experience level? **UNKNOWN**
- Beyond "mobile-first," what are users' actual devices, contexts, and jobs-to-be-done? **UNKNOWN**

### Market
- What existing products solve a similar problem (including other AI prompt-rewriting tools)? **UNKNOWN**
- What alternatives are users currently using? **UNKNOWN**

### Business
- What does one customization actually cost in AI-service fees? **UNKNOWN — explicitly flagged as the single most urgent open question, since credit pricing depends on it.**
- Which AI service performs the prompt rewrite, and which speech-to-text service is used? **UNKNOWN — both explicitly open.**
- Final credit pack prices and free-customization count (5 or 10). **Explicitly undecided.**
- Whether credits expire. **Explicitly undecided (recommendation: no).**
- Whether non-subscribers can buy credits. **Explicitly undecided (recommendation: no).**
- Whether free trial credits go to everyone or subscribers only. **Explicitly undecided (recommendation: subscribers only).**
- What the monthly AI spending cap should be, and what users see when it's hit. **UNKNOWN / undecided.**
- Blurred preview vs. hard block for non-subscribers. **Explicitly undecided.**
- Whether the yearly plan auto-renews. **Explicitly undecided.**
- One device or two. **Explicitly undecided.**

### Product
- Which categories/models are highest priority beyond the five launch categories and example models named (Sora, Runway, Pika, Veo, Midjourney, Gamma, v0)? **UNKNOWN**
- How much customization users actually need in practice (i.e., is the base prompt usually "good enough," or is customization the norm)? **UNKNOWN**
- Whether prompt history for users (beyond favourites and in-session customization steps) will be added. Not mentioned as a decision point in the updated material — status **UNKNOWN**.

### Content
- Who authors base prompts, and how are the AI's standing "rewriting instructions" validated for quality/consistency across templates? **UNKNOWN** beyond the confirmed admin-panel setting existing.
- How is prompt/model information kept current as AI tools evolve? **UNKNOWN** beyond the confirmed admin-maintained master list.

### Users & Feedback
- What determines whether a prompt (base or customized) is "successful" beyond thumbs up/down? **UNKNOWN**
- How admin will act at scale on the "what people are asking for" customization report? **UNKNOWN** beyond the stated intent to convert common requests into new templates.

---

## 19. Questions That Need Answers

### Critical
1. What does a single customization actually cost in AI-service fees, and which AI/speech-to-text providers will be used? (The material calls this the most urgent, business-blocking question — credit pricing cannot be set without it.)
2. Is the core problem now primarily tool/model discovery, base-prompt creation, or prompt refinement (customization) — and does this differ by category?
3. How many free customizations should a new subscriber receive (5 or 10), and should they expire?
4. Should non-subscribers be able to purchase credits, and should free trial credits be limited to subscribers only?
5. What is an appropriate monthly AI spending cap, and what should happen for users when it's reached?

### Important
6. Should non-subscribers see a blurred preview or a hard block?
7. Should the yearly plan auto-renew or require manual renewal?
8. Should account access allow one device or two?
9. What credit pack sizes and prices should launch with, once true AI cost-per-customization is known?
10. Should users get a persistent prompt/customization history beyond the current session, or do favourites cover this adequately?

### Nice to Know
11. Which categories or AI models are expected to see the most usage first?
12. What is the expected split between typed and spoken customization requests?
13. What acquisition channels will be used to reach initial users?
14. What cadence should admins use to review "what people are asking for" reports and convert them into new templates?

---

## 20. Success Criteria

### User Success
- Time to find a relevant template (including via the new model filter) — *Target: TBD*
- Prompt copy rate (subscribers who copy the base or a customized prompt) — *Target: TBD*
- Customization usage rate and average customizations per subscriber — *Target: TBD*
- Customization success rate (returned in time, passed validation) vs. failure/timeout rate — *Target: TBD*
- Tool/model recommendation click-through rate — *Target: TBD*
- Feedback submission rate and positive/negative ratio, for base vs. customized prompts — *Target: TBD*
- Repeat usage — *Target: TBD*

### Content Success
- Template usage distribution across categories and models — *Target: TBD*
- Prompt feedback scores by version, including whether customization correlates with better or worse ratings — *Target: TBD*
- Frequency with which common customization requests get converted into new templates — *Target: TBD*
- Content gaps resolved via the admin dashboard — *Target: TBD*

### Business Success
- Registration and subscription conversion rate — *Target: TBD*
- Renewal/retention rate — *Target: TBD*
- Credit pack purchase rate and average revenue per customizing user — *Target: TBD*
- **AI cost per customization vs. credit price** (margin) — *Target: TBD, and currently unmeasurable until Section 19, Q1 is answered*
- Lifetime vs. yearly plan uptake — *Target: TBD*
- Revenue — *Target: TBD*

No numerical targets are invented; all are marked TBD.

---

## 21. Scope Boundaries

### In Scope
- Helping a user choose a relevant category/subcategory/template, including by the specific AI tool/model they intend to use.
- Serving an instant, admin-authored, finished-text prompt with no AI involvement.
- **(New)** Letting a subscriber request a natural-language change to that prompt (typed or spoken), rewritten by an outside AI service, metered by credits.
- Recommending up to three relevant AI tools/models with a short rationale.
- Providing short usage steps and/or a short video.
- Collecting feedback (thumbs up/down, comment, tool used), including implicit signal from customization requests.
- Selling subscription access to read/copy prompts (two plans) and separately metering AI-powered customization via credits.
- Giving admins full non-technical control over the catalog, prompts, tool/model assignments, the customization engine's behavior and cost controls, steps, languages, and payment providers.

### Out of Scope (confirmed by material)
- AWA does not generate the final creative output itself.
- AWA does not host its own AI model; it calls an outside service only for the customization rewrite (and, for voice, an outside speech-to-text service).
- AWA does not teach a full course.
- AWA does not let users submit their own templates (would need a review/approval process).
- AWA does not offer one-click "run this on the AI tool for me" automation.
- AWA does not offer a whole-project mode bundling a full project's prompts.
- AWA does not support more than two subscription plans, team accounts, or coupons at this stage.
- AWA does not compare results across different AI tools (would require storing user-generated outputs, which is deliberately not done).
- AWA does not provide a share link that exposes a paid prompt to non-subscribers.
- **Changed from the prior version:** open-ended requests like "make it more cinematic" are **now explicitly in scope**, handled via the customization engine — this is no longer excluded.

### Potential Future Scope (not confirmed, not to be treated as requirements)
- User-submitted templates with review/approval.
- One-click direct execution on a connected AI tool.
- Whole-project prompt bundles.
- Additional subscription tiers, team accounts, or coupons.
- Cross-tool result comparison.
- Persistent, user-facing customization/prompt history beyond the current session and favourites (not explicitly discussed as a future item in the updated material, but a natural extension of the new customization feature).

---

## 22. Core Problem Summary

**Problem:** People who want to create images, videos, websites, presentations, or posters using AI tools know such tools exist but don't know which tool or model fits their task, what to write as a prompt, or how to adjust a prompt that's close but not quite right — and, once they have a prompt, don't always know how to use the chosen tool.

**Target User:** People pursuing an AI creation task across five launch categories, most likely on mobile (the one confirmed audience signal in the material). Specific personas, experience levels, and the primary paying segment remain **UNKNOWN** (Section 6).

**Current Behavior:** **UNKNOWN/hypothetical** — unchanged from the prior version; not addressed by the updated material (Section 8).

**Root Cause:** A combination of tool/model-discovery difficulty, lack of prompt-writing skill, and — newly confirmed as a distinct cause — an admin's inability to anticipate every variation a user might want, which the customization engine exists specifically to solve (Section 4).

**Impact:** Still **UNKNOWN** in measured user terms. A new, confirmed *business*-side impact exists: unmetered AI usage could make a subscriber unprofitable, which is why credits exist (Section 5, 11).

**AWA's Intended Value:** A guided flow that instantly serves an expert-quality, ready-to-use prompt with zero prompt-writing effort, lets the user refine it in their own words (typed or spoken) when it isn't quite right, matches them to a tool *and model* they actually have, and tells them what to do next — replacing scattered searching, trial-and-error, and prompt-writing skill with one guided, adjustable path (Section 10).

**Desired Outcome:** Users go from idea to a usable, personalized AI prompt and a compatible recommended tool/model with less guesswork and no prompt-writing skill required, then act on it elsewhere; admins learn what their content is missing directly from aggregated customization requests (Section 14).

**Confirmed Facts:** The updated guided journey; the base-prompt/customization split (only one AI-dependent step); the subscription/credits separation and why it exists; the model-tagging system and its dual use for recommendations and filtering; the removal of the guided-fields/blanks mechanism; and the explicit new in-scope status of open-ended refinement requests (Section 16).

**Key Assumptions:** That users genuinely can't articulate prompt-refinement requests as well-formed prompts themselves (hence need the AI intermediary), that the subscription/credits split will be understood rather than confusing, and that mobile/voice usage will be significant enough to justify the investment (Section 17).

**Critical Unknowns:** The true cost of a single AI customization (blocking correct credit pricing), which AI and speech-to-text providers will be used, and several explicitly undecided policy questions spanning free customization allotments, credit expiry, non-subscriber credit purchases, spending caps, renewal, and device limits (Section 18).

**Critical Questions:** What does a customization actually cost, and which providers will deliver it; is the core problem now weighted toward discovery, base-prompt creation, or refinement; and how should the still-open credit/subscription policy questions be resolved, since they materially determine both the user experience and whether the business model is sustainable (Section 19).
