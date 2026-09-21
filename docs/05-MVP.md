# AWA — MVP Definition and Validation

**Status:** MVP baseline. No UX flows, screens, wireframes, architecture, database, API, or technology decisions are made here.
**Sources of truth:** `docs/01-PROBLEM.md` (PROBLEM), `docs/02-USER-RESEARCH.md` (RESEARCH), `docs/03-REQUIREMENTS.md` (REQUIREMENTS), `docs/04-FEATURES.md` (FEATURES).
**Rule applied throughout:** the MVP is the smallest feature set that demonstrates AWA's core value and completes one primary user journey — not the full list of P0 features. Every inclusion is justified against the primary journey, not against a priority label alone.

```text
01-PROBLEM → 02-USER-RESEARCH → 03-REQUIREMENTS → 04-FEATURES → 05-MVP (this document)
```

---

## 1. MVP Objective

**The MVP must prove that a person who doesn't know which AI tool to use or what to write can go from a category selection to a usable, tool-matched prompt with zero prompt-writing effort, and find enough value in that to want continued access.**

This connects: **Primary User** (someone pursuing an AI creation task who lacks tool/prompt knowledge, PROBLEM §3) → **Core Problem** (doesn't know which tool fits, what to write, or how to use it once there, PROBLEM §3–§4) → **AWA Value** (an instant, admin-authored prompt plus a matched tool recommendation and usage steps, PROBLEM §10) → **Desired Outcome** (the user successfully uses the prompt externally and is willing to keep using/paying for AWA, PROBLEM §14, §20).

No technology or implementation is referenced in this objective.

---

## 2. Core Product Hypothesis

> **We believe that a person who wants to create something using AI (an image, video, website, presentation, or poster) but doesn't know which tool to use or what to write will use AWA to browse a category, select a template, and receive an instant, expert-written prompt with a matched tool recommendation and short usage steps, because it removes the need for prompt-writing skill and tool-selection guesswork, resulting in them successfully using that prompt on an external AI tool and expressing willingness to continue using (and paying for) AWA.**

Status of each clause:
- **Target user experiences the stated problem** — **FACT** at the general level, and across all five categories (PROBLEM §3–§4, §6 confirm the problem and the five launch categories). **UNKNOWN** which category is highest-demand (PROBLEM §18) — this is precisely why the MVP now launches with all five rather than betting on one (see Section 5).
- **User will use AWA this way** — **ASSUMPTION**. This is the flow AWA is built to support (PROBLEM §9), but no usage data confirms people will actually follow it, in any category.
- **Removes prompt-writing/tool-selection burden** — **FACT** as a confirmed design intent (PROBLEM §10); **UNKNOWN** whether it is sufficient in practice (RESEARCH §16, Critical Question 1).
- **Willingness to continue/pay** — **ASSUMPTION**, explicitly flagged as unvalidated in both source documents (PROBLEM §17; RESEARCH §14).

---

## 3. MVP Scope — Feature Classification

Every feature in `04-FEATURES.md` is classified below. **P0 status alone is not the reason for inclusion** — see the "Why" column, which ties each decision back to whether the feature is required for one complete journey.

**Category scope decision:** the MVP launches with all five confirmed categories (Image Generation, Video Generation, Website Making, Slides/Presentations, Poster/Design) rather than one, each seeded with a small, minimal template set that is expected to be built out and improved over time. This is a **content-breadth** decision, not a feature-scope one — it does not add any new capability to the list below; it changes how much admin-authored content (Section 7, Section 13) is needed before launch, spread across five categories instead of concentrated in one. See Section 5 for the reasoning and trade-offs.

### MVP — Included (21)

| Feature | Why Included (not just "it's P0") |
|---|---|
| FEAT-001 Category & Subcategory Browsing | Entry point; no journey is reachable without it. |
| FEAT-002 Template Discovery & Filtering *(scoped down — see §3 note)* | The "view template description before selecting" part (FR-004) is required so a non-subscriber can judge relevance before paying — this is what makes the paywall test (§10, Business Signal) meaningful rather than a blind ask. |
| FEAT-004 Template Selection | The confirmed transition point from browsing to receiving the core deliverable. |
| FEAT-006 Instant Base Prompt Display | This *is* the core value proposition (PROBLEM §10) — zero-effort, expert-quality prompt. Without it there is nothing to validate. |
| FEAT-007 Subscriber Prompt Preview (Blur Gate) | Needed to run the actual, confirmed monetization model (PROBLEM §11) rather than a freebie that can't test payment willingness. |
| FEAT-008 Full Prompt View | The paid deliverable itself. |
| FEAT-009 Prompt Copy | The action that lets the user act on AWA's value externally — without it, nothing leaves AWA. |
| FEAT-017 AI Tool/Model Recommendation | One of AWA's three confirmed deliverables (PROBLEM §1: "get the right AI tool"). Directly addresses the tool-selection half of the core problem. |
| FEAT-018 Usage Steps *(written steps only — video excluded, see §3 note)* | The third confirmed deliverable (PROBLEM §1: "the steps to use it"). Addresses the tool-usage half of the core problem. |
| FEAT-020 Prompt Feedback Capture | **Elevated beyond its P1 label.** Without any feedback mechanism, the MVP has no way to gather the evidence Section 10 (Validation Success) requires. A hypothesis-testing MVP needs a signal channel even though feedback isn't part of the core value-delivery loop itself. |
| FEAT-021 Feedback-to-Prompt-Version Linkage *(scoped down — see §3 note)* | With no customization in the MVP, "version" collapses to "template," so this is a light dependency of FEAT-020, not a separate build effort. |
| FEAT-022 Free Browsing Access | Confirmed scope boundary (browsing is free); required for the evaluate-before-paying flow. |
| FEAT-023 Subscription Paywall Enforcement | The confirmed monetization gate; required to test payment willingness (§10 Business Signal). |
| FEAT-024 Subscription Plan Selection | Without a way to actually subscribe, the paywall (FEAT-023) is a dead end, not a test. |
| FEAT-025 Prompt Share Protection | **Satisfied automatically by omission** — this requirement is "do not build a share feature," so it costs nothing extra and is inherently included by not building FEAT-010's excluded siblings or any export feature. |
| FEAT-029 Category & Subcategory Management (Admin) | Without admin-authored structure, FEAT-001 has nothing to show. Foundational content dependency. |
| FEAT-030 Template & Prompt Authoring (Admin) | Without hand-authored prompts, FEAT-006 has no content. Foundational content dependency. |
| FEAT-031 Tool/Model Assignment (Admin) | Required so FEAT-017's recommendations aren't empty. |
| FEAT-032 AI Tool/Model Master List (Admin) | Required so FEAT-031 has tools/models to assign from. |
| FEAT-033 Usage Content Management (Admin) *(scoped to written steps only)* | Required so FEAT-018 has content to display. |
| FEAT-038 Payment Provider Management (Admin) *(scoped to Razorpay only — see §3 note)* | Required so FEAT-024 can actually process a payment. The broader "add providers later without a rebuild" flexibility is not needed for a first working version. |

### MVP — Excluded (7)

| Feature | Why Excluded |
|---|---|
| FEAT-003 AI Model Filter | Each of the five categories launches with a deliberately small, curated initial template set (Section 5), so a dedicated filter adds discovery machinery the volume doesn't yet justify anywhere in the catalog. The underlying tool/model tagging (FEAT-031/032) still exists and still powers FEAT-017, and each template's tagged tool/model is visible in FEAT-002's description view — only the filter *UI* is deferred. **Flagged as the top candidate for early fast-follow**, since Video Generation (in scope from launch) is the one category with a confirmed, directly-stated model-mismatch failure mode (PROBLEM §4); if the Video catalog grows quickly, this should be revisited first. |
| FEAT-005 Blank Start Option | An alternate path for when no template fits. Each category's initial curated set is small by design (Section 5), so this fallback isn't needed to complete the primary journey in any of the five categories at launch. |
| FEAT-019 Usage Video | PROBLEM §9 states steps "and/or" a video — written steps alone satisfy the confirmed requirement. Video adds production overhead without adding a new capability. |
| FEAT-026 Device Session Limit | An account-sharing/revenue-protection measure relevant at scale. It doesn't affect whether one user can complete the core journey, which is what the MVP exists to prove. |
| FEAT-034 Language & Translation Management (Admin) | No confirmed launch-language requirement exists beyond the general admin capability being named once (PROBLEM §21). A single-language MVP fully supports the core hypothesis test. |
| FEAT-039 Non-Subscriber Visibility Configuration (Admin) | The MVP ships the confirmed default behavior (blurred preview, PROBLEM §9) as a fixed behavior rather than building an admin-configurable toggle between blur and hard block. Building the *toggle* is deferred; the underlying blur-vs-block question itself remains open (see Requires Validation, and REQUIREMENTS Conflict C-1). |
| FEAT-040 Favourite Templates | A confirmed but secondary convenience/retention feature (P2). Not required to demonstrate or protect the core value proposition once. |

### Requires Validation — Not Built for This MVP (12)

These make up the entire **customization/credits engine** and its admin controls. They are excluded not because they're unimportant — the customization step is literally part of AWA's own one-line value statement (PROBLEM §1) — but because building them now would mean committing engineering effort against the single most urgent, explicitly unresolved question in the source material: *what does one customization actually cost, and which providers will deliver it* (PROBLEM §19 Q1). Until that's answered, credit pricing, the spending cap, and even whether the feature is used enough to justify its cost are all unknown. The MVP is deliberately scoped to validate the base-prompt/recommendation/guidance hypothesis first, cheaply, before taking on this dependency.

| Feature | What Needs Validating First |
|---|---|
| FEAT-010 Typed Customization Request | Whether users actually need to alter the base prompt at all, or whether a well-curated base prompt is "good enough" most of the time (RESEARCH §16, Critical Question 1). |
| FEAT-011 Voice Customization Request | Same as above, plus whether voice specifically matters enough to justify a second provider dependency. |
| FEAT-012 AI Prompt Rewrite Engine | Provider selection and per-call cost (PROBLEM §19 Q1) — the most urgent open question in the entire source material. |
| FEAT-013 Revert to Original Prompt | Only relevant once customization exists. |
| FEAT-014 Customization Version History | Only relevant once customization exists. |
| FEAT-015 Customization Credit Metering | Depends on FEAT-012's cost being known before pricing can be set. |
| FEAT-016 Credit Exhaustion Handling | **Moot without a credit system.** There is nothing to "exhaust" if FEAT-010–015 aren't built — this is why FEAT-016 is excluded from the MVP even though `04-FEATURES.md` marks it P0. Its P0 status there reflects its importance *if* customization ships; it has no MVP role otherwise. |
| FEAT-027 Free Customization Allotment | Depends on FEAT-015; free-allotment size is itself explicitly undecided (PROBLEM §18). |
| FEAT-028 Credit Pack Purchase | Depends on FEAT-012's cost being known; pack pricing is explicitly undecided. |
| FEAT-035 Customization Insights Report (Admin) | Has nothing to aggregate without FEAT-010–012 in production. |
| FEAT-036 AI Rewriting Instruction Configuration (Admin) | Only relevant once a rewriting provider (FEAT-012) is selected. |
| FEAT-037 Customization Engine Configuration (Admin) | Only relevant once FEAT-010–015 exist to configure. |

---

## 4. MVP Feature Set

| Feature ID | Feature | Requirement(s) | Why Needed for MVP | User Served | Priority | Dependency |
|---|---|---|---|---|---|---|
| FEAT-001 | Category & Subcategory Browsing | FR-001 | Entry point of the only journey the MVP supports | Primary user | P0 | FEAT-029 |
| FEAT-002 | Template Discovery & Detail View *(scoped: basic browse/tag filter + free description view)* | FR-002, FR-004 | Lets a non-subscriber judge relevance before paying, making the paywall test meaningful | Primary user (incl. non-subscribers) | P0 | FEAT-001, FEAT-030 |
| FEAT-004 | Template Selection | FR-005 | Confirmed transition into the core deliverable | Primary user | P0 | FEAT-002 |
| FEAT-006 | Instant Base Prompt Display | FR-007 | The core, zero-effort value proposition itself | Primary user | P0 | FEAT-004, FEAT-030 |
| FEAT-007 | Subscriber Prompt Preview (Blur Gate) | FR-008 | Runs the real, confirmed monetization model rather than giving the prompt away | Non-subscribed primary user | P0 | FEAT-006, FEAT-023 |
| FEAT-008 | Full Prompt View | FR-009 | The paid deliverable | Subscribed primary user | P0 | FEAT-023 |
| FEAT-009 | Prompt Copy | FR-010 | Lets the user act on the prompt outside AWA | Subscribed primary user | P0 | FEAT-008 |
| FEAT-017 | AI Tool/Model Recommendation | FR-019 | Confirmed second deliverable; addresses tool-selection half of the core problem | Primary user | P0 | FEAT-031, FEAT-032 |
| FEAT-018 | Usage Steps *(written only)* | FR-020 | Confirmed third deliverable; addresses tool-usage half of the core problem | Primary user | P0 | FEAT-033 |
| FEAT-020 | Prompt Feedback Capture | FR-022, FR-023, FR-024 | Only channel producing evidence for MVP validation (Section 10) | Primary user | P1 (elevated for evidence) | FEAT-009 |
| FEAT-021 | Feedback-to-Template Linkage *(scoped: template-level, not version-level)* | FR-025 (partial) | Makes feedback attributable to a specific template for review | Administrator | P1 (elevated) | FEAT-020, FEAT-030 |
| FEAT-022 | Free Browsing Access | FR-026 | Confirmed free-evaluation boundary | All primary users | P0 | FEAT-001, FEAT-002 |
| FEAT-023 | Subscription Paywall Enforcement | FR-027 | The confirmed monetization gate under test | Primary user; business | P0 | FEAT-024 |
| FEAT-024 | Subscription Plan Selection | FR-028 | Without this, the paywall is a dead end, not a test | Primary user; business | P0 | FEAT-038 |
| FEAT-025 | Prompt Share Protection | FR-029 | Satisfied automatically by not building any sharing feature | Business | P1 (free) | None |
| FEAT-029 | Category & Subcategory Management (Admin) | FR-035 | Foundational content dependency for FEAT-001 | Administrator | P0 | None |
| FEAT-030 | Template & Prompt Authoring (Admin) | FR-036 | Foundational content dependency for FEAT-006 | Administrator | P0 | FEAT-029 |
| FEAT-031 | Tool/Model Assignment (Admin) | FR-037 | Required so FEAT-017 has content to recommend | Administrator | P0 | FEAT-030, FEAT-032 |
| FEAT-032 | AI Tool/Model Master List (Admin) | FR-038 | Required so FEAT-031 has tools/models to assign | Administrator | P0 | None |
| FEAT-033 | Usage Content Management (Admin) *(steps only)* | FR-039 (partial) | Required so FEAT-018 has content to display | Administrator | P1 (elevated, scoped) | FEAT-030 |
| FEAT-038 | Payment Provider Management (Admin) *(Razorpay only)* | FR-044 (partial) | Required so FEAT-024 can process a real payment | Administrator; business | P1 (elevated, scoped) | None |

The MVP contains the minimum set required for **one** complete journey: browse → view a template → hit the paywall → subscribe → read the full prompt → see the recommended tool → read usage steps → copy → (use externally) → optionally give feedback.

---

## 5. Primary MVP User

- **Primary user:** A person who wants to create something using AI — an image, video, website, presentation, or poster — but doesn't know which AI tool to use or what to write as a prompt. This matches the Primary User already defined in `02-USER-RESEARCH.md` §1/§17 without narrowing it to a single category.
- **Their goal:** Get a usable, expert-quality prompt matched to a tool they can actually use, without needing prompt-writing skill — whichever of the five categories their task falls into.
- **Their starting problem:** They know AI tools exist for their kind of task but don't know which one fits, what to type, or what to do once they have a prompt (PROBLEM §3–§4).
- **What they need from AWA:** A relevant template within their category, an instantly available finished prompt, a tool recommendation with a reason, and short usage steps.
- **What successful completion looks like:** The user finds a relevant template in their category, subscribes, reads the full prompt, copies it, understands which tool to use it with and how, and (ideally) reports back that it worked.

**Category scope: all five at launch, each intentionally minimal.** No source document ranks the five launch categories by demand or priority (PROBLEM §18: "which categories are highest priority... UNKNOWN"). Rather than guess at one category to bet the whole MVP on, the MVP launches with a small, curated set of templates in **each** of the five categories (Image, Video, Website, Presentation, Poster/Design), with the explicit expectation that each category's content will be built out and improved over time as demand signal comes in. This has one direct benefit the single-category version didn't: it generates the very category-priority evidence that's currently UNKNOWN (PROBLEM §18), rather than assuming an answer.

**Trade-off, stated plainly:** this is a content-authoring scope increase, not a feature-scope increase (Section 3) — the same FEAT-029–033 admin capabilities are used, just to author a minimum-viable set of templates five times over instead of once. This raises Content Risk (Section 14): a thin initial catalog spread across five categories is more exposed to any single weak template than a deeper single-category catalog would be. Each category should launch with only as many templates as can be genuinely well-authored, not padded for coverage.

---

## 6. Primary MVP User Flow

The same flow structure applies within any of the five launch categories; the walkthrough below is written category-agnostically, with an image-generation instance used as the illustrative example in Section 9.

```text
User has a creation goal (image, video, website, presentation, or poster)
        ↓
Enters AWA, browses their relevant category
        ↓
Views a template's description (free)
        ↓
Selects the template
        ↓
Sees a blurred prompt preview + subscribe prompt (not yet subscribed)
        ↓
Subscribes
        ↓
Sees the full, finished prompt
        ↓
Sees a recommended AI tool with a one-line reason
        ↓
Reads short usage steps for that tool
        ↓
Copies the prompt
        ↓
Uses the prompt on the external AI tool (outside AWA)
        ↓
Returns to AWA and optionally submits feedback
```

| Step | User Action | AWA Response | Input | Output | Requirement(s) | Feature(s) |
|---|---|---|---|---|---|---|
| 1 | Opens AWA, browses their relevant category (any of the five) | Shows category/subcategory structure | None (browsing) | Category/subcategory list | FR-001 | FEAT-001 |
| 2 | Opens a template to preview it | Shows description, tags, associated tool/model — no subscription required | Selection of a template to preview | Template description | FR-002, FR-004 | FEAT-002 |
| 3 | Selects the template | Loads that template's prompt context | Selection action | Active template context | FR-005 | FEAT-004 |
| 4 | Views the prompt (not subscribed) | Shows a blurred prompt with a subscribe call-to-action | None | Blurred prompt view | FR-008 | FEAT-007 |
| 5 | Subscribes | Processes payment via Razorpay, activates subscription | Payment details, plan choice | Active subscription | FR-027, FR-028 | FEAT-023, FEAT-024, FEAT-038 |
| 6 | Views the prompt (subscribed) | Shows the full, finished prompt text | None | Full prompt text | FR-009 | FEAT-008 |
| 7 | Reviews the tool recommendation | Shows 1–3 recommended tools/models with a one-line reason each | None | Tool/model recommendation | FR-019 | FEAT-017 |
| 8 | Reads the usage steps | Shows short, tool-specific steps | None | Usage steps | FR-020 | FEAT-018 |
| 9 | Copies the prompt | Makes the exact displayed text available for external use | Copy action | Copied prompt text | FR-010 | FEAT-009 |
| 10 | Uses the prompt on the external tool | *(Outside AWA — no AWA response)* | N/A | The user's generated output — image, video, website, presentation, or poster (outside AWA's control) | N/A | N/A |
| 11 | Returns and submits feedback (optional) | Records rating, optional comment, optional tool used, linked to the template | Thumbs up/down, optional comment, optional tool used | Stored feedback record | FR-022, FR-023, FR-024, FR-025 | FEAT-020, FEAT-021 |

Step 10 is explicitly outside AWA's boundary (Section 11) and is not something the MVP builds or controls.

---

## 7. MVP Inputs

### Required Inputs
- The user's browsing/selection choices (category, template) — not descriptive information, since no requirement-gathering form exists (PROBLEM §9 step 5, confirmed).
- Payment details to activate a subscription (processed via the configured provider; AWA does not itself define payment data beyond routing it to Razorpay).

### Optional Inputs
- A feedback rating (thumbs up/down).
- A free-text feedback comment.
- Which tool the user actually used.

**Note:** There is deliberately **no** "describe what you want" input step in the MVP. This is not an omission — it is the confirmed, central design of the current product (PROBLEM §9 step 5; the old guided-fields mechanism was removed, PROBLEM §7). The MVP tests exactly this: whether a zero-input, admin-authored prompt is valuable enough on its own.

### System/Content Inputs (supplied by the platform/admin)
- All five categories (Image Generation, Video Generation, Website Making, Slides/Presentations, Poster/Design), each with at least one subcategory.
- A small, curated set of finished-text templates/prompts within **each** category (admin-authored, no placeholders) — minimal at launch, expected to be expanded and improved over time (Section 5).
- At least one AI tool/model in the master list, assigned to each template across all five categories.
- Short, written usage steps per template or tool, across all five categories.
- Razorpay configured as the payment provider, with the two confirmed subscription plans (₹199/yr, ₹999 lifetime) available for purchase.

---

## 8. MVP Outputs

| Output | Contains | Who Receives It | What They Do With It | Requirement |
|---|---|---|---|---|
| Blurred prompt preview | An obscured version of the prompt plus a subscribe call-to-action | Non-subscribers | Decide whether to subscribe | FR-008 |
| Full prompt text | The complete, admin-authored, finished prompt | Subscribers | Read it, decide to copy it | FR-009 |
| Copied prompt | The exact displayed prompt text | Subscribers | Paste it into the external AI tool | FR-010 |
| Tool/model recommendation | 1–3 tool/model names, each with a one-line reason | All users viewing an unlocked or blurred prompt context | Decide which external tool to use | FR-019 |
| Usage steps | A short, tool-specific sequence of steps | All users at the guidance step | Know what to click/do once at the external tool | FR-020 |
| Stored feedback record | Rating, optional comment, optional tool used, linked to the template | Administrators (as a report, not shown back to the submitting user beyond a confirmation) | Judge whether a template/prompt is working, or needs revision | FR-022–FR-025 |

No additional outputs (e.g., a generated image, a customized prompt, a credit balance) are produced by this MVP, consistent with its excluded/deferred feature set (Section 3).

---

## 9. MVP End-to-End Scenario

**Illustrative MVP Demo Scenario** — this is a constructed walkthrough to demonstrate AWA's confirmed capabilities. It is not based on real user research, interviews, or observed behavior. The MVP catalog spans all five categories (Section 5); Image Generation is used below as one concrete instance of the same flow that applies in Video, Website, Presentation, and Poster/Design as well.

- **Starting Situation:** A person wants a clean product photo of a handmade candle for their online shop, and has heard AI image tools can do this, but has never used one.
- **User Problem:** They don't know which AI image tool to use, or what to type to get a professional-looking result rather than something generic or wrong.
- **AWA Journey:** They open AWA, browse to Image Generation, and find a "Product Photography" template. They read its free description, see it's tagged for Midjourney, and select it. The prompt is blurred with a subscribe prompt, so they subscribe (yearly plan). The full prompt appears — a detailed, professionally structured description covering lighting, background, and composition for product photography, with no editing needed.
- **AWA Result:** AWA shows Midjourney as the recommended tool with a one-line reason ("best for photorealistic product shots"), along with four short steps for pasting the prompt into Midjourney and adjusting aspect ratio.
- **External AI Tool:** The user copies the prompt, opens Midjourney, pastes it in following the steps, and generates the image.
- **Final Outcome:** The user gets a usable product photo without having written a single word of prompt themselves, and returns to AWA to leave a thumbs-up on the template.

This scenario demonstrates the full MVP value loop: discovery → zero-effort prompt → tool guidance → external success → feedback.

---

## 10. MVP Success Criteria

### Product Success
Can the user complete the intended journey end-to-end?
- The user can browse, preview, subscribe, read the full prompt, see a recommendation, read steps, and copy the prompt without being blocked by a missing capability.
- `Target: TBD` (no completion-rate figure is defined in the source material).

### User Success
Does AWA help the user accomplish the intended task?
- The user obtains a prompt they consider usable and successfully applies it on the external tool.
- `Target: TBD`.

### Validation Success
Does the MVP provide evidence the core hypothesis is worth pursuing?
- Evidence that users complete the journey, find the prompt useful (via feedback), and subscribe.
- `Target: TBD` — this MVP is designed to *generate* this evidence, not assume it in advance.

### Business Signal
Early signals worth watching, none with invented numeric targets:
- User willingness to continue (repeat visits/template use) — `Target: TBD`.
- Subscription interest (conversion from preview to subscribe) — `Target: TBD`.
- Feedback volume and sentiment (thumbs up/down ratio) — `Target: TBD`.
- Prompt copy rate (of those who subscribe) — `Target: TBD`.

### MVP Success Criteria vs. Long-Term Product KPIs
This MVP does **not** need to hit mature-product metrics (e.g., the full success-metric set in PROBLEM §20 — retention, lifetime value, renewal rate, content-gap resolution rate) to be considered a success. Those require scale, time, and features (subscription lapse handling, renewal, customization) not built here. The MVP's job is narrower: generate enough real evidence on the questions in Section 15 to justify — or reject — further investment, particularly in the deferred customization engine.

---

## 11. What Is Explicitly NOT Being Built

### Out of Scope for MVP
- **The entire customization/credits engine** (typed and voice requests, AI rewrite, revert, version history, credit metering, free allotment, credit packs, and all associated admin configuration) — deferred pending resolution of the unit-economics question (PROBLEM §19 Q1) and validation of whether users need it at all (Section 3, "Requires Validation").
- **AI model filter (FEAT-003)** — not needed at the MVP's intentionally small catalog scale.
- **Blank-start option (FEAT-005)** — an alternate path not required when the MVP catalog is curated to cover its one demo category.
- **Usage video (FEAT-019)** — written steps alone satisfy the confirmed "steps and/or video" requirement.
- **Device session limit (FEAT-026)** — an account-sharing protection relevant at scale, not to completing one journey.
- **Multi-language support (FEAT-034)** — no confirmed launch-language requirement beyond a single admin-capability mention.
- **Configurable non-subscriber visibility (FEAT-039)** — the MVP ships the confirmed default (blur) as fixed behavior rather than building a toggle.
- **Favourites (FEAT-040)** — a secondary convenience/retention feature, not required for the core journey.
- **Multi-payment-provider flexibility** — the MVP integrates Razorpay only; the broader "add providers later" capability is deferred.

Each of these is a valid, confirmed part of AWA's eventual scope (per `04-FEATURES.md`) — none are rejected outright, only deferred because they are not necessary to prove the core hypothesis once.

---

## 12. MVP vs. Full Product

| Area | MVP | Future Product |
|---|---|---|
| Primary user | Anyone pursuing an AI creation task across all five launch categories | Same, with usage data now informing which categories/segments to invest in further |
| Core workflow | Browse → template → paywall → subscribe → prompt → recommendation → steps → copy → feedback | Same, plus optional Customize (typed/voice) with credits, version history, and revert |
| Categories | All five (Image, Video, Website, Presentation, Poster/Design), each minimal at launch | All five, each built out to a fuller library based on demand signal from the MVP itself |
| Templates | A small, curated set within **each** category | An expanded library across all categories, with content-gap-driven growth (via the deferred FEAT-035 report) |
| Prompt experience | Static, admin-authored, instantly displayed | Static base prompt **plus** AI-powered natural-language customization |
| Tool guidance | Tool/model recommendation + written steps | Same, plus optional video, plus AI model filtering for discovery |
| Feedback | Thumbs up/down + optional comment/tool, linked to template | Same, linked to exact prompt *version* including customized versions, feeding the aggregated customization-insights report |
| Access control | Single-device enforcement not built; blur is fixed | Configurable device-limit policy; configurable blur-vs-hard-block |
| Payments | Razorpay only | Razorpay plus additional providers, addable without a rebuild |

Every "Future Product" entry above is either an existing confirmed capability in `04-FEATURES.md` or explicit Potential Future Scope from `01-PROBLEM.md` §21 — nothing here is a newly invented roadmap item.

---

## 13. MVP Dependencies

### Required for MVP
- Admin-authored category structure for all five categories, each with at least one subcategory — FEAT-029.
- A curated set of finished-text templates with prompts in **each** of the five categories — FEAT-030.
- At least one AI tool/model in the master list, assigned to each MVP template across all five categories — FEAT-031, FEAT-032.
- Written usage steps per MVP template, across all five categories — FEAT-033 (scoped).
- Razorpay configured as the payment provider, with both confirmed subscription plans available — FEAT-038 (scoped), FEAT-024.
- A working subscription/paywall gate — FEAT-023.
- A working feedback capture mechanism — FEAT-020, FEAT-021 (scoped).

### Not Required for MVP
- An outside AI rewriting service or speech-to-text provider (both currently unselected — PROBLEM §7).
- A credit/metering system or spending cap.
- Multi-language content.
- Multi-payment-provider support beyond Razorpay.
- Device-session-limit enforcement.
- Video usage guidance content.
- An AI model filter UI.
- A favourites system.

---

## 14. MVP Risks

- **User Risk:** The target user may not have the assumed problem, or may not experience it strongly enough to seek out a tool like AWA. Supported as a real possibility by PROBLEM §17/§18 (no confirmed user research exists) — **ASSUMPTION**, to be tested by the MVP itself.
- **Value Risk:** Users may not find a static, admin-written prompt valuable enough to subscribe for, especially without the ability to adjust it (since Customize is deferred). This is a direct, foreseeable consequence of the MVP's own scoping decision (Section 3) and should be watched closely via Business Signal data (Section 10).
- **Content Risk:** Because every prompt is entirely hand-authored with no fallback (guided fields were removed, PROBLEM §7), the MVP's value is fully bottlenecked on the quality of the curated template sets built for it. **This risk is amplified by the five-category launch decision (Section 5):** content-authoring effort is now spread across five categories instead of concentrated in one, so any given category is more likely to launch with a thinner set of templates. A weak template set in any one category could produce a false-negative signal for that category specifically, unrelated to the underlying hypothesis.
- **Tool Risk:** The external AI tools recommended (across image, video, website, presentation, and poster tools) may change their interface, pricing, or behavior at any time, since AWA does not control them (PROBLEM §15) — and this risk now applies across a wider set of external tools than a single-category MVP would carry.
- **Adoption Risk:** Users may prefer existing free alternatives (search engines, prompt libraries, tutorials) — explicitly unvalidated in the source material (PROBLEM §12: "no competitive or alternative-solution analysis is present").
- **Business Risk:** Users may not perceive enough value in a static prompt to pay, particularly given the customization capability — arguably the more novel differentiator — is not in this MVP. This is the central trade-off the MVP's scoping decision accepts in exchange for avoiding the unresolved customization cost risk (Section 3).
- **Scope Risk:** Section 3 already resolves the largest scope-risk (the customization engine); the remaining risk is that spreading the same feature set across five categories, rather than deepening one, could dilute both content quality (see Content Risk above) and the clarity of the evidence gathered — five thin data sets are harder to read confidently than one solid one. This is a deliberate trade-off in exchange for early category-priority signal (Section 5), not a resolved question.

---

## 15. MVP Validation Questions

### Critical
1. Can users understand what AWA is for and complete the guided workflow without help?
2. Do users find the resulting (static, non-customized) prompt useful enough to act on externally?
3. Are users willing to subscribe based on a blurred preview and template description alone?
4. Does removing prompt-writing and tool-selection guesswork measurably reduce user-perceived friction, compared to what they'd otherwise do? (Directly tests PROBLEM §3's core claim.)

### Important
5. Do users read and rely on the usage steps, or skip straight to the external tool?
6. Do users who complete the journey return to give feedback, and what does that feedback say about content quality?
7. Does a single, well-curated category (Image Generation) generalize, or does user behavior differ meaningfully in ways that would change category prioritization?

### Future
8. Do users request or need the ability to customize a prompt (directly informing whether to build the deferred customization engine)?
9. Do users prefer this workflow over finding prompts independently, once more categories/content exist?
10. Is the resulting value strong enough to encourage continued, repeat use over time (a retention question, not answerable from a first MVP)?

None of these are answered in advance — the MVP exists specifically to generate evidence for them.

---

## 16. MVP Acceptance Criteria

The MVP is complete only when all of the following hold:

- A user can enter the intended workflow by browsing to the Image Generation category with no sign-in required.
- A user can view a template's description and complete template selection without a subscription.
- A user without a subscription sees a blurred prompt and a working subscribe path (via Razorpay).
- A subscribed user can view the full prompt text.
- A subscribed user can copy the prompt text.
- A tool/model recommendation with a stated reason is shown for the selected template.
- Written usage steps are shown for the recommended tool.
- A user can submit feedback (rating, optional comment, optional tool used) after using a prompt, and it is stored against the correct template.
- Important failure conditions are handled: a template with no assigned tool/model does not silently fail (falls back to a clear message rather than breaking); a failed payment does not leave the user in an ambiguous access state.
- The complete primary journey (Section 6, steps 1–9, plus optional step 11) can be demonstrated end-to-end without manual intervention.

No technical implementation criteria (response times, uptime, infrastructure) are specified here, consistent with this document's scope.

---

## 17. Demo Readiness

For a successful MVP demonstration, the following must be available:

1. **A real creation goal:** the demo presenter frames a concrete image-creation need (Section 9's candle-photo scenario, or equivalent).
2. **The documented problem:** the demo makes clear the presenter doesn't know which tool to use or what to write.
3. **Entry into AWA:** the demo opens directly into category browsing, no setup shown.
4. **Minimum workflow completion:** browse → template → paywall → subscribe → prompt → recommendation → steps → copy, performed live.
5. **Core value delivered:** the full, finished prompt is visibly produced with no user-authored prompt text at any point.
6. **Expected output received:** the prompt text and the tool/step guidance are both visibly present together.
7. **Output taken into the external workflow:** the demo actually pastes the copied prompt into the recommended external tool.
8. **Outcome demonstrated:** the external tool produces a result from the copied prompt (the result's *quality* is outside AWA's control and is not itself a pass/fail criterion for AWA).

The demo should use real (even if minimal) admin-authored content — not placeholder or lorem-ipsum text — since the entire value proposition rests on prompt quality (Section 14, Content Risk).

---

## 18. MVP Scope Decision

### MVP Decision — Build
FEAT-001, FEAT-002 (scoped), FEAT-004, FEAT-006, FEAT-007, FEAT-008, FEAT-009, FEAT-017, FEAT-018 (written only), FEAT-020, FEAT-021 (scoped), FEAT-022, FEAT-023, FEAT-024, FEAT-025 (by omission), FEAT-029, FEAT-030, FEAT-031, FEAT-032, FEAT-033 (scoped), FEAT-038 (scoped).

### Do Not Build Yet
FEAT-003, FEAT-005, FEAT-019, FEAT-026, FEAT-034, FEAT-039, FEAT-040 — valid, confirmed features, deferred because they don't affect completion of the one primary journey.

### Validate Before Building
FEAT-010, FEAT-011, FEAT-012, FEAT-013, FEAT-014, FEAT-015, FEAT-016, FEAT-027, FEAT-028, FEAT-035, FEAT-036, FEAT-037 — the entire customization/credits engine. Do not begin building this until: (a) a rewriting AI provider and speech-to-text provider are selected with known per-call cost, and (b) initial MVP evidence (Section 15, Future Q8) shows users actually want to alter the base prompt.

### Core User Journey
Browse a category (any of the five) → preview a template for free → hit the subscription paywall → subscribe → read the full, zero-effort prompt → see a matched tool recommendation → read short usage steps → copy the prompt → use it externally → optionally give feedback.

### Core Hypothesis
Restated from Section 2: that removing prompt-writing and tool-selection burden through an instant, expert-authored prompt plus guided tool/step recommendations is, on its own, valuable enough for users to complete the journey, use the result externally, and want continued access — **without yet requiring AI-powered customization** — and that this holds across all five categories, not just one.

### Evidence Required to Move to the Next Phase
- Users complete the primary journey at a meaningful rate, in at least some categories (no numeric bar is defined here — `Target: TBD`).
- Subscription conversion from preview to paid access occurs at a rate suggesting real willingness to pay (`Target: TBD`).
- Feedback signal (Section 15, Q2, Q6) indicates the static prompt is genuinely useful, not merely tolerated.
- **Category-level comparison** — since all five categories launch together, relative engagement/conversion across them becomes early evidence toward the currently-UNKNOWN category-priority question (PROBLEM §18), informing where to invest content-authoring effort next.
- If feedback or qualitative signal shows users frequently wanting to change the base prompt (Section 15, Future Q8), this becomes the trigger to begin resolving the customization engine's open questions (provider selection, cost) rather than an assumption to build around in advance.

---

## MVP Discipline Compliance Check

1. Solves the core documented problem — yes (Section 1, 2).
2. Serves a clearly identified primary user — yes; the user type is the same across all five categories (Section 5), with the relative importance of each category explicitly flagged as UNKNOWN and left for the MVP itself to help answer.
3. Every MVP feature maps to a confirmed requirement — yes (Section 4 table cites FR IDs throughout).
4. No feature included merely because it is P0 — FEAT-016 (P0 in `04-FEATURES.md`) is explicitly excluded (Section 3) because it is inapplicable without the deferred credit system; FEAT-020/021 (P1) are explicitly elevated on evidentiary grounds, not priority.
5. No feature included because it's easy to build — not applicable; no build-effort claims are made anywhere in this document.
6. No invented features — every included/excluded item traces to `04-FEATURES.md`.
7. No scope expansion because a feature "seems useful" — the entire customization engine, despite being central to AWA's value statement, is deferred pending validation (Section 3).
8. One complete journey preferred over many incomplete ones — Section 6 defines exactly one.
9. UI polish not conflated with validation — no UI/visual requirements appear anywhere in this document.
10–11. No technical architecture or technology stack introduced.
12. No invented business metrics — all numeric targets are marked `Target: TBD` (Section 10).
13. No invented user research findings — Section 2 and Section 14 explicitly separate FACT from ASSUMPTION.
14–15. Assumptions and unknowns are labeled throughout, not folded into confirmed statements.
16. AWA's boundary from external AI generation platforms is preserved (Section 6, step 10; Section 9).
17. The MVP demonstrates AWA's unique value (curated, tool-matched, zero-effort prompts) rather than reproducing an external AI tool — it produces no creative output itself.
18. Every included feature carries requirement traceability (Section 4); nothing without traceability was included.

---

## Source Traceability

| MVP Element | Requirement | Feature | User Need | Problem |
|---|---|---|---|---|
| Category browsing | FR-001 | FEAT-001 | Find a relevant starting point | Scattered discovery (PROBLEM §2, §13) |
| Template preview & selection | FR-002, FR-004, FR-005 | FEAT-002, FEAT-004 | Evaluate before paying; commit to a template | Discovery burden (PROBLEM §2–§4) |
| Blurred preview / paywall | FR-008, FR-026, FR-027 | FEAT-007, FEAT-022, FEAT-023 | Evaluate relevance; AWA needs to monetize | Confirmed monetization model (PROBLEM §11) |
| Subscription | FR-028 | FEAT-024 | A way to actually pay | Confirmed pricing decision (PROBLEM §11) |
| Full prompt + copy | FR-009, FR-010 | FEAT-008, FEAT-009 | Zero-effort usable prompt | Doesn't know what to write (PROBLEM §3–§4) |
| Tool/model recommendation | FR-019 | FEAT-017 | Know which tool to use | Doesn't know which tool fits (PROBLEM §3–§4) |
| Usage steps | FR-020 | FEAT-018 | Know how to use the tool | Doesn't know how to use the tool once there (PROBLEM §4, §13) |
| Feedback | FR-022–FR-025 | FEAT-020, FEAT-021 | Report whether it worked | No signal on prompt success (PROBLEM §9, §16) |
| Category/template/tool authoring (admin) | FR-035–FR-038 | FEAT-029–FEAT-032 | Content must exist for any of the above to work | Foundational dependency (PROBLEM §15, §21) |
| Usage content authoring (admin) | FR-039 (partial) | FEAT-033 | Content must exist for usage steps to display | Foundational dependency |
| Payment configuration (admin) | FR-044 (partial) | FEAT-038 | Subscriptions must be processable | Confirmed payment constraint (PROBLEM §15) |
| *(Deferred)* Customization engine | FR-011–FR-018, FR-031–FR-034, FR-042–FR-043 | FEAT-010–FEAT-016, FEAT-027–FEAT-028, FEAT-035–FEAT-037 | Adjust a close-but-not-quite-right prompt | The refinement half of the core problem (PROBLEM §4) — **deferred, not solved, by this MVP** |

Every row traces cleanly through PROBLEM → RESEARCH → REQUIREMENTS → FEATURES → this MVP document, and applies uniformly across all five categories. The one element without full confirmation is **how much content-authoring depth each category gets at launch** (Section 5) — the source material confirms the five categories themselves (PROBLEM §6) but not their relative priority (PROBLEM §18), so an even, minimal spread across all five is this document's reasoned default rather than a traceable, confirmed decision.