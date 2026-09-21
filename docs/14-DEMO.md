# AWA — Product Demonstration Script

**Status:** Demo baseline for the production MVP as confirmed in `01-PROBLEM.md` through `13-SECURITY.md`. This document sequences and narrates the already-built product; it introduces no new requirement, feature, capability, or claim.
**Sources of truth:** `01-PROBLEM.md` through `13-SECURITY.md`.
**Audience:** A presenter demonstrating the real, running AWA product to stakeholders, prospective users, or reviewers.

---

## 1. Demo Objective

By the end of this demonstration, a viewer should understand:

1. What problem AWA solves.
2. Who experiences that problem.
3. How AWA addresses it.
4. How the real, working product behaves, end to end.
5. What the user provides to AWA.
6. What AWA produces for the user.
7. What the user does next, outside AWA.
8. Why that workflow is valuable.
9. How the product is expected to evolve.

This is a demonstration of a real production application's confirmed MVP behavior — not a pitch for a hypothetical future version, and not a competition presentation.

---

## 2. Presentation Time Guidance

No presentation duration has been specified in the source material or conversation. This script is written as a complete, self-contained demo with a suggested timing breakdown (Section 12) that can be scaled up or down once an actual time limit is known. The Live Product Workflow (Section 6) should always receive the largest share of whatever total time is available, since it is the only section that provides direct evidence of how the product works — everything else compresses more gracefully than the live walkthrough does.

---

## 3. Problem

**What users are trying to accomplish:** A person wants to create something with AI — an image, video, website, presentation, or poster — but has never really used the underlying AI tools before.

**What makes it difficult:** They know AI creation tools exist, but that knowledge alone doesn't tell them which tool or model actually fits their task, what to type into it, or how to fix a prompt that's close but not quite right. A prompt written for one AI model can read very differently — and work very differently — from a prompt written for another; someone with access to only one tool can waste time and blame the prompt itself when the real issue is a model mismatch.

**Where the friction shows up:** Tool and model selection, prompt writing, and — once they finally have a prompt and a tool — knowing what to actually click and do to get a result.

**Why it matters:** Every one of these frictions sits between a person's idea and a finished creation. AWA's own documentation is candid that the size of this impact hasn't been measured in user research — what's confirmed is the mechanism of the problem, not a quantified cost of it. That's an honest starting point, not a weakness to hide: it's exactly what this MVP exists to generate evidence about.

---

## 4. Who It Affects

**Primary user:** A person pursuing an AI creation task — image, video, website, presentation, or poster — who doesn't know which AI tool or model fits their task, what to write as a prompt, or how to use the result once they have it. This is the single confirmed user type the entire product is built around; no distinct secondary user group is established in the source research.

**What they want:** A usable, expert-quality prompt matched to a tool they actually have access to, without needing prompt-writing skill themselves.

**Why AWA is relevant to them:** AWA removes the two hardest parts of that journey — writing the prompt and picking the tool — and replaces them with something they can evaluate for free before paying anything.

No demographic detail, survey data, or interview quotes exist in the source research, and none are used here. The user description above is the confirmed profile as written in `02-USER-RESEARCH.md` — nothing more specific is invented for this demo.

---

## 5. AWA Solution

AWA is a guide, not a generator. It does not create the final image, video, website, presentation, or poster itself — that step always happens on an external AI tool the user is pointed to.

What AWA actually does, in the MVP as built:

- Organizes AI creation tasks into five categories — Image Generation, Video Generation, Website Making, Slides/Presentations, and Poster/Design — each with subcategories and a small, curated set of templates.
- Instantly shows a finished, expert-written prompt for the selected template. This prompt is written entirely by an administrator ahead of time; nothing about it is generated at the moment the user views it.
- Recommends one to three AI tools or models for that prompt, each with a one-line reason, so the user isn't guessing which tool the prompt was written for.
- Shows short, written usage steps for the recommended tool, so the user knows what to actually do once they get there.
- Lets the user copy the prompt and take it to the external tool themselves.
- Captures a simple thumbs-up/thumbs-down (plus optional comment) once the user has used the prompt, so the team can tell whether a given prompt is actually working.

**The product boundary, stated plainly:** AWA prepares the prompt and the guidance. The user pastes that prompt into Midjourney, Runway, or whichever tool was recommended, and that external tool produces the actual creative output. AWA has no system-to-system connection to any of these tools and does not claim credit for what happens after the copy action.

---

## 6. Live Product Workflow

This is the core of the demonstration. It walks through one complete, realistic user journey exactly as confirmed in `05-MVP.md` §6, `11-UI-UX.md`, and `12-IMPLEMENTATION-PLAN.md` — nothing is skipped, and nothing beyond this confirmed flow is shown.

**Scenario used:** the illustrative product-photography scenario from `05-MVP.md` §9 — a person wants a clean product photo of a handmade candle for their online shop and has never used an AI image tool before. This is a constructed walkthrough for demonstration purposes, not a captured real-user session; it is presented as such.

### Step 1 — Browse Screen: Entry

**What the Presenter Does**
Opens AWA directly into the Browse Screen. No sign-in, no setup screen, no account creation shown first.

**What the Presenter Says**
"Here's someone who wants a product photo for their online shop but has never touched an AI image tool. They open AWA — no account needed yet."

**What the Viewer Should Notice**
Browsing is completely free and requires no identity at all. The five launch categories are visible immediately: Image Generation, Video Generation, Website Making, Slides/Presentations, Poster/Design.

**Expected Result**
The five top-level categories are visible with no login prompt anywhere on screen.

---

### Step 2 — Browse Screen: Category and Template Selection

**What the Presenter Does**
Selects Image Generation, drills into the relevant subcategory, and opens the "Product Photography" template from the resulting list.

**What the Presenter Says**
"They pick Image Generation, and find a template already built for exactly this — product photography."

**What the Viewer Should Notice**
The template list only shows published, admin-authored content — nothing is generated on the fly at this stage.

**Expected Result**
Selecting the template navigates to the Template Detail Screen.

---

### Step 3 — Template Detail Screen: Free Evaluation

**What the Presenter Does**
Shows the template's description, tags, and the tool it's tagged for — all visible without any subscription.

**What the Presenter Says**
"Before paying for anything, they can read exactly what this template is for and see it's tagged for Midjourney — so they know up front whether it's even relevant to them."

**What the Viewer Should Notice**
This free-evaluation step exists specifically so a non-subscriber can judge relevance before being asked to pay — it's what makes the paywall a real, informed decision rather than a blind ask.

**Expected Result**
Description, tags, and the associated tool tag are fully visible with no subscription.

---

### Step 4 — Template Detail Screen: Prompt Access Gate

**What the Presenter Does**
Scrolls to the prompt panel, showing it in its blurred state with a visible "Subscribe to unlock" call-to-action.

**What the Presenter Says**
"The actual prompt text is what AWA charges for. Right now it's blurred — they can see something is there, but not read it."

**What the Viewer Should Notice**
Nothing about the prompt is guessable or partially visible — this is the confirmed monetization gate, not a soft nudge.

**Expected Result**
The prompt is fully obscured; the subscribe call-to-action is clearly visible.

---

### Step 5 — Subscription Screen: Subscribing

**What the Presenter Does**
Selects "Subscribe to unlock," which opens the Subscription Screen. Picks a plan (yearly, ₹199, or lifetime, ₹999), enters a contact identifier, and proceeds to Razorpay checkout, completing a test-mode payment.

**What the Presenter Says**
"They pick the yearly plan and pay through Razorpay. Notice the pay button locks while this processes — that's deliberate, so a double-tap can't cause a duplicate charge."

**What the Viewer Should Notice**
The system never shows an ambiguous access state: the user is either clearly not yet subscribed, or clearly subscribed, with nothing in between — even if payment fails.

**Expected Result**
On confirmed success, the screen returns to the Template Detail Screen, now in its full, unlocked state.

---

### Step 6 — Template Detail Screen: Full Prompt Delivery

**What the Presenter Does**
Shows the complete, unblurred prompt text — the finished, expert-written description covering lighting, background, and composition for a product photo.

**What the Presenter Says**
"This is the whole point of AWA. They didn't write a single word of this prompt — it's ready to use, exactly as an admin wrote it."

**What the Viewer Should Notice**
The prompt is static, admin-authored content retrieved as-is — AWA does not generate or transform it in any way at this step.

**Expected Result**
The full prompt is visible, scrollable if long, and never truncated.

---

### Step 7 — Template Detail Screen: Tool Recommendation and Usage Steps

**What the Presenter Does**
Points out the tool recommendation card (Midjourney, with the one-line reason "best for photorealistic product shots") and the short written usage steps beneath it.

**What the Presenter Says**
"AWA doesn't just hand over a prompt and leave them guessing — it tells them exactly which tool to use, why, and what to click once they get there."

**What the Viewer Should Notice**
This directly answers the two hardest parts of the original problem: which tool, and what to do with it.

**Expected Result**
One tool recommendation with a stated reason, and a short numbered sequence of usage steps, are both visible together with the prompt.

---

### Step 8 — Template Detail Screen: Copy Action

**What the Presenter Does**
Clicks the copy action. A brief "Copied" confirmation appears, and the feedback section becomes visible below it.

**What the Presenter Says**
"One click, and the exact prompt text is on their clipboard — ready to paste into Midjourney."

**What the Viewer Should Notice**
This is the moment AWA's value has actually been delivered — everything from here happens outside AWA.

**Expected Result**
The prompt text is copied verbatim; the confirmation and feedback section both appear.

---

### Step 9 — External AI Tool: User Action (Outside AWA)

**What the Presenter Does**
Switches to Midjourney (or the applicable external tool), pastes the copied prompt, and follows the usage steps shown in AWA to generate the image.

**What the Presenter Says**
"This part happens entirely outside AWA — AWA has no connection to Midjourney at all. It just made sure they had the right prompt and knew what to do with it."

**What the Viewer Should Notice**
This step makes the product boundary undeniable: AWA's job ends at the copy action; everything after that is the external tool's responsibility.

**Expected Result**
The external tool produces a result from the copied prompt. The result's quality is outside AWA's control and isn't a pass/fail signal for AWA itself.

---

### Step 10 — Template Detail Screen: Feedback (Optional)

**What the Presenter Does**
Returns to AWA, and on the same template's page, submits a thumbs-up with an optional short comment.

**What the Presenter Says**
"They come back and leave a quick thumbs-up. That's the signal that tells the team this prompt is actually working."

**What the Viewer Should Notice**
Feedback is the only evidence channel this MVP has — without it, there's no way to know whether a prompt is genuinely useful or just tolerated.

**Expected Result**
The rating (and optional comment) is recorded against the correct template, with a brief confirmation shown to the user.

---

### The Transformation, Made Visible

```text
User's Goal (a usable product photo)
↓
Category and Template Selection (no requirements form — nothing to fill in)
↓
AWA's Stored, Admin-Authored Prompt (retrieved, not generated)
↓
Matched Tool Recommendation + Usage Steps
↓
User's Next Action (copy → paste into Midjourney, outside AWA)
```

There is deliberately no "describe what you want" step anywhere in this journey. The MVP tests whether a zero-input, expert-authored prompt is valuable enough on its own — this is a confirmed, intentional design decision, not a missing feature.

---

## 7. Technology / AI

Kept brief, on purpose — this is a product demonstration, not an architecture review.

**AI capability in this MVP: none.** Every prompt the user sees is 100% static, admin-authored text. Every tool/model "recommendation" is an admin-curated tag lookup — a person decided which tools go with which template and why — not a model computing or generating a suggestion. This MVP makes zero calls to any AI service.

This is a deliberate, confirmed product decision, not an oversight: AWA's own AI-design documentation states plainly that the one real AI capability on the roadmap — a prompt-customization feature that would let a user ask, in their own words, for a specific change — is intentionally deferred until an AI provider and its per-call cost are actually selected, and until early evidence shows users genuinely want to alter the base prompt rather than use it as-is.

**What does exist under the hood, briefly:** a responsive web application (one codebase, routed for both the end-user journey shown above and a separate administrator content-management surface), a conventional backend enforcing the subscription paywall and recommendation lookups, a relational database holding the catalog and prompt content, and Razorpay as the one external integration, used only for payment.

---

## 8. Result

**What the user started with:** A creation goal (a product photo) and no prompt-writing or tool-selection knowledge.

**What AWA processed:** Nothing generated — AWA retrieved an existing, expert-written prompt and its associated tool/step guidance for the template the user selected.

**What AWA produced:** A complete, ready-to-use prompt; a specific tool recommendation with a stated reason; and short usage steps for that tool.

**What the user did with it:** Copied the prompt, pasted it into the recommended external tool, and generated the image there — entirely outside AWA.

**How this addresses the original problem:** The user never had to know which tool to use or what to type — both of those decisions were made for them by an admin ahead of time, and delivered instantly.

```text
Problem (doesn't know which tool or what to write)
↓
User Input (category and template selection only — no description required)
↓
AWA (instant, admin-authored prompt + matched tool + usage steps)
↓
Output (a copyable prompt, ready for the recommended tool)
↓
User Action (paste into Midjourney)
↓
Outcome (a usable product photo, produced on the external tool)
```

---

## 9. Product Value / Impact

### Demonstrated
What the current, running product actually does, as shown in Section 6:
- Delivers a finished, expert-written prompt with zero prompt-writing effort from the user.
- Matches that prompt to a specific tool with a stated reason, rather than leaving tool selection to the user.
- Provides short, actionable usage steps for that tool.
- Lets a non-subscriber fully evaluate a template's relevance before paying.
- Runs a real monetization flow (Razorpay subscription) end to end, including honest failure handling — a failed payment never leaves the user in an ambiguous access state.
- Captures a lightweight feedback signal tied to the specific template used.

### Expected
What the product is designed to achieve, but has not yet been validated with evidence:
- That removing prompt-writing and tool-selection burden is, on its own, valuable enough for users to subscribe and keep using AWA — the source material is explicit that this is an assumption the MVP exists to test, not a confirmed result.
- That users will actually return to submit feedback after using a prompt externally.
- That a static, non-customizable prompt is "good enough" for most users, rather than something they'll want to adjust.

### Validated
No measurable business or user outcome (conversion rate, retention, completion rate) is established anywhere in the source documentation — every numeric target in the project's own MVP success criteria is explicitly marked `Target: TBD`. This demo does not claim validated metrics that don't exist. The MVP's job, as defined in its own source documents, is to generate this evidence going forward, not to already have it.

---

## 10. Future Direction

Based only on confirmed future scope, out-of-scope functionality, and open questions already documented — not on new ideas introduced here.

**Prompt customization.** The single most-anticipated next capability: letting a subscriber describe, in their own words (typed or spoken), a change they'd like made to the base prompt, with an outside AI service handling the rewrite. This is deliberately not in the current product. It's gated on two things: selecting an AI rewriting provider with a known per-call cost, and seeing real evidence — from feedback on this very MVP — that users actually want to alter the base prompt rather than use it as-is.

**Deeper catalog content.** The MVP launches with a small, intentionally minimal set of templates in each of the five categories, specifically so early usage data can reveal which categories deserve deeper investment first — rather than guessing at that priority in advance.

**Model-based filtering.** The underlying tool/model tagging already exists and already powers today's recommendations; a dedicated filter UI for browsing by specific AI model is a confirmed candidate for an early fast-follow, particularly for Video Generation, where a prompt written for one model is known to read very differently on another.

**Additional payment providers.** Razorpay is the only integration today; supporting additional providers without a rebuild is confirmed future scope, not built now.

This is intentionally a short list of the most meaningful, already-confirmed directions — not a comprehensive roadmap.

---

## 11. Production-Demo Considerations

Because this is a real production application, the demonstration reflects production expectations, not a stripped-down prototype:

- **Clear user feedback at every step** — loading indicators while catalog or prompt content resolves, and an explicit "Copied" / feedback-submitted confirmation after each user action.
- **Honest error handling** — a template with no assigned tool/model shows a clear fallback message rather than a broken section; a failed payment shows a clear failure state and never grants access it didn't earn.
- **Input validation** — plan selection and contact identifier are validated before a payment attempt proceeds.
- **Reliable state transitions** — subscription status is always read from AWA's own backend as the source of truth, never assumed from the identity provider alone; the browsing and free-preview experience keeps working even if something else in the system is degraded.
- **Clear boundary between AWA and the external AI tool** — nothing in the interface implies AWA generated the final image, video, website, presentation, or poster; the handoff to the external tool is shown explicitly, not glossed over.

These points are mentioned only where they strengthen the viewer's understanding of the product — this demo does not turn into a security or architecture review.

---

## 12. Demo Failure / Contingency Plan

Realistic risks that could interrupt a live demonstration, identified from `08-API.md`, `09-AI-DESIGN.md`, `12-IMPLEMENTATION-PLAN.md`, and `13-SECURITY.md`, with an honest fallback for each:

| Risk | Why It Could Happen | Fallback |
|---|---|---|
| Razorpay checkout unavailable or slow | External payment provider dependency; the only external integration in the MVP | Use Razorpay's test/sandbox mode, already verified working ahead of time (per `10-TECH-STACK.md` §3.5's own recommended practice); if live checkout genuinely fails, say so plainly and continue from a previously confirmed subscribed account rather than faking a success state |
| Backend cold start on first request | Some hosting tiers sleep the backend after inactivity | Load the app and complete one full pass through it a few minutes before presenting, so the instance is already warm |
| Catalog or prompt content fails to load | Standard API/network failure | Show the defined error state and retry action live — this is itself a real, confirmed piece of product behavior worth demonstrating on purpose, not something to hide |
| A template has no assigned tool/model | Admin content gap | Pre-select a fully-authored template (verified ahead of time) for the live walkthrough; if it happens live anyway, show the defined graceful fallback message rather than treating it as a bug |
| External AI tool (Midjourney, etc.) is slow, down, or produces an unexpected result | Entirely outside AWA's control and system boundary — AWA has no connection to it | State plainly that this is outside AWA's boundary; if the external tool is unavailable, narrate the expected paste-and-generate step using a previously generated result rather than presenting a failed live generation as if it succeeded |
| AI-related failure of any kind | Not applicable — this MVP makes no AI service calls | No AI-specific contingency is needed for the current product; this row is intentionally absent from the live risk set |

Fallbacks are honest by design: a previously validated result is clearly presented as such, and a genuinely failed live operation is never described as a success.

---

## 13. Timing Breakdown

No fixed presentation duration has been provided. Below is a proportional suggested breakdown that keeps the Live Product Workflow dominant; scale every row by the same factor once an actual total time is known (shown here against a 12-minute reference total, purely as a scaling anchor).

| Section | Suggested Time |
|---|---:|
| Problem | 1 min |
| Who It Affects | 1 min |
| AWA Solution | 1 min |
| Live Product Workflow | 5 min |
| Technology / AI | 1 min |
| Result | 1 min |
| Product Value | 1 min |
| Future Direction | 1 min |

The Live Product Workflow should always receive the largest single share of total time available — it is the only section that provides direct evidence of how the product actually works. If time must be cut, compress Technology/AI and Future Direction first; do not shorten the live workflow below one complete pass through Steps 1–10.

---

## 14. Presenter Checklist

- [ ] Production environment is accessible and reachable before the presentation starts.
- [ ] The Image Generation / "Product Photography" scenario (or an equivalent, fully-authored template) is confirmed ready in the live catalog.
- [ ] A test-mode (or confirmed working live-mode) Razorpay payment path has been exercised end to end beforehand.
- [ ] The core workflow (Steps 1–10 in Section 6) has been run through at least once immediately before presenting.
- [ ] The recommended tool/step content for the demo template has been verified present (no missing-recommendation fallback expected, though the fallback itself is known and can be shown intentionally if useful).
- [ ] No AI-service dependency needs verification — this MVP makes no AI calls.
- [ ] External-tool access (e.g., a logged-in Midjourney account) is ready for the live paste-and-generate step.
- [ ] Loading and error states have been checked at least once, so the presenter recognizes them if they appear live.
- [ ] The final result (a generated image from the external tool) is ready to show, with a previously generated backup available per Section 12's contingency plan.
- [ ] The presenter has reviewed Section 12's fallback plan and will use it honestly if something fails live.
- [ ] Every claim in the script has been checked against Section 15's traceability table — nothing said in the demo goes beyond what the source documents confirm.

---

## 15. Traceability

| Demo Section | Source Document(s) | Relevant Requirement / Feature / MVP Step |
|---|---|---|
| Problem | `01-PROBLEM.md` §2–§4 | Core problem statement; tool/model discovery, prompt creation, usage-guidance gaps |
| Who It Affects | `02-USER-RESEARCH.md` §1–§2, §17 | Primary User classification and profile |
| AWA Solution | `01-PROBLEM.md` §1, §21; `06-ARCHITECTURE-DECISION.md` §2, §5 | One-line value statement; confirmed product boundary; admin-authored/curated content model |
| Live Product Workflow | `05-MVP.md` §6, §9; `11-UI-UX.md` §1, §3; `12-IMPLEMENTATION-PLAN.md` TASK-006–017 | Primary MVP User Flow, Steps 1–11; Browse/Template Detail/Subscription screen designs; corresponding implementation tasks |
| Technology / AI | `09-AI-DESIGN.md` (AI Decision: NOT REQUIRED); `10-TECH-STACK.md` §3, FINAL STACK | Confirmed absence of AI capability in the MVP; confirmed technology selections |
| Result | `05-MVP.md` §8–§9 | MVP Outputs table; illustrative end-to-end scenario |
| Product Value / Impact | `05-MVP.md` §10, §14, §15 | MVP Success Criteria (all `Target: TBD`); MVP Risks; Validation Questions |
| Future Direction | `05-MVP.md` §3 ("Requires Validation"), §11–§12; `06-ARCHITECTURE-DECISION.md` "Future Considerations" | Deferred customization engine; MVP vs. Full Product comparison; confirmed future architecture items |

Every product claim in this demo traces to one of the project's own confirmed documents. No capability, metric, user-research finding, or future feature is presented here that is not already established in `01-PROBLEM.md` through `13-SECURITY.md`.

---

**This document is the demo baseline for AWA's production MVP. Per the defined scope, work stops here — no application code was written, no prior document was modified, and no additional document was created.**
