# AWA — User Research and User Journey Analysis

**Status:** Foundational document, built on top of `docs/01-PROBLEM.md`. No UI, technical architecture, or feature-scope decisions are made here.
**Primary source:** `docs/01-PROBLEM.md`. No additional information was provided in this conversation beyond that document.
**Evidence key:** FACT = explicitly supported by `docs/01-PROBLEM.md` · ASSUMPTION = reasonable but unconfirmed · UNKNOWN = information not currently available.

No user interviews, surveys, usability tests, behavioral data, demographics, or market research exist in the source material. Every claim below is either a direct carry-over of something `01-PROBLEM.md` states, or is explicitly marked as an assumption/unknown. This document does not manufacture confidence that isn't in the source.

---

## 1. User Classification

### Primary Users
- **People pursuing an AI creation task** (image, video, website, presentation, or poster) who don't know which AI tool/model fits their task, what to write as a prompt, or how to adjust a prompt that's close but not right. **FACT** — this is the central actor throughout `01-PROBLEM.md`, described as experiencing the core problem and receiving the platform's primary value.

### Secondary Users
- None are identified as a distinct secondary-user group in the source material. **UNKNOWN.**

### Administrative / Operational Users
- **Platform/content administrators** — write and maintain the catalog (categories, subcategories, templates, prompts), the AI tool/model master list, steps/videos, languages, payment provider settings, and the customization engine's controls (rewriting instructions, spending cap, free-customization count, credit packs). **FACT.**

### External Participants
- **Payment provider(s)** — Razorpay at launch; others addable later. **FACT.**
- **Outside AI rewriting service provider** — performs the actual prompt rewrite when a user customizes. Which specific provider is **UNKNOWN**; `01-PROBLEM.md` flags this as an open, unresolved, urgent question.
- **Speech-to-text service provider** — transcribes voice-based customization requests. Specific provider **UNKNOWN**.
- **AI tool/model providers** (Midjourney, Runway, Sora, Pika, Gamma, v0, etc.) — the external destinations users are pointed to. No formal relationship with AWA is confirmed. **FACT** that they are named as catalog entries; **UNKNOWN** what, if any, relationship exists beyond that.
- **Product owner / business operations** — implied by the existence of an admin role and a monetization model, but no named owner or operating entity is stated. **ASSUMPTION.**

No user group beyond the above is created; groups such as "designers," "marketers," "students," or "business users" are named only as candidate categories in `01-PROBLEM.md` and are explicitly marked there as UNKNOWN, so they are not elevated to a confirmed classification here.

---

## 2. User Profiles

### Primary User — Person pursuing an AI creation task

| Field | Status | Detail |
|---|---|---|
| User type | ASSUMPTION | Segmented only by intended output category: website, image, video, presentation, or poster/design — the five launch categories. No confirmed persona exists below this level. |
| Role | FACT | Someone who wants to make a creative output using an external AI tool but is not the one operating that tool's underlying AI model. |
| Primary objective | FACT | Turn a simple idea into a finished, usable AI creation on a tool/model they actually have access to. |
| Secondary objectives | ASSUMPTION | Find the tool/model that will actually accept their prompt as worded; adjust a close-but-not-quite-right prompt without prompt-writing skill. |
| Problems experienced | FACT/ASSUMPTION (mixed — see Section 4) | Not knowing which tool or model fits their task; not knowing what to write as a prompt; not knowing how to adjust a prompt that's close but not right; not always knowing how to use the chosen tool once there. |
| Motivations | UNKNOWN | Not stated. |
| Frustrations | UNKNOWN beyond the pain points in Section 4 | No user-voiced frustrations are recorded. |
| Expected outcomes | FACT | A usable prompt with zero prompt-writing effort; a personalized prompt when the base one isn't right; a tool/model recommendation with a stated rationale; short usage instructions. |
| AI experience level | UNKNOWN | Not segmented or confirmed. |
| Relevant behaviors | FACT (one signal only) | Most users are expected to be on a phone — stated directly as the reason voice-based customization input matters. |
| Relationship with AWA | FACT | Free to browse/search/read tool suggestions and steps; must subscribe to read/copy a prompt; must have credits to use the customization feature. |
| Frequency of interaction | UNKNOWN | Not addressed. |

### Administrative User — Platform/content administrator

| Field | Status | Detail |
|---|---|---|
| User type | FACT | Operator of the AWA admin panel. |
| Role | FACT | Authors and maintains categories, subcategories, templates, base prompts, the AI tool/model master list, steps/videos, translations, payment settings, and the customization engine's configuration. |
| Primary objective | FACT | Keep the catalog and prompt library accurate, current, and monetizable without needing a developer. |
| Secondary objectives | FACT | Control AI-related cost exposure (spending cap, free-customization allotment, credit pack pricing); use aggregated customization-request data to identify and fill content gaps. |
| Problems experienced | FACT | Cannot anticipate every prompt variation a user might want (this is the stated justification for the customization engine); needs to keep tool/model assignments current as external AI tools change. |
| Motivations | UNKNOWN | Business motivations beyond the stated monetization model are not detailed. |
| Frustrations | UNKNOWN | Not addressed. |
| Expected outcomes | FACT | Edits appear to users within seconds; version history lets them tell whether a prompt change helped or hurt; customization-request reports show what content is missing. |
| AI experience level | UNKNOWN | Not addressed. |
| Relevant behaviors | UNKNOWN | Not addressed. |
| Relationship with AWA | FACT | Operates the admin panel; not a paying subscriber in the same sense as an end user (not stated either way). |
| Frequency of interaction | UNKNOWN | Not addressed. |

No demographic detail (age, gender, location, income, profession, education) is invented for either profile, consistent with the source material containing none.

---

## 3. User Goals

### Functional Goals (FACT, from `01-PROBLEM.md`)
- Find a category/subcategory/template relevant to the intended creation task, including by AI model.
- Read and copy a finished prompt.
- Request a change to that prompt in plain language (typed or spoken).
- See recommended AI tools/models with a stated reason.
- See short usage steps and/or a short video.
- Submit feedback (thumbs up/down, optional comment, optional tool used).

### Outcome Goals (FACT)
- Produce the desired creative output (image, video, website, presentation, or poster) on an external AI tool, without needing prompt-writing skill.
- Get a prompt that actually matches the tool/model the user has access to, rather than one written for a different model.

### Experience Goals (ASSUMPTION unless noted)
- **ASSUMPTION** — Wants the process to feel fast and low-effort (implied by the design emphasis on an instantly visible prompt, a maximum of three tool options, and 4–7 steps, but not stated as a user-voiced preference).
- **ASSUMPTION** — Wants to feel confident that a recommended tool/model will actually work with the prompt as worded (implied by the model-filter rationale).
- **FACT** — Wants to describe a desired change in their own words rather than needing to know prompt-writing technique — this is the explicit premise of the customization feature.

Per the brief's example distinction: "find an image-generation prompt" (functional) is different from "create the desired image without spending significant time figuring out how to write the prompt" (outcome) — both are represented above, and neither is restated as a feature.

---

## 4. User Frustrations and Pain Points

### AI Tool Discovery
- Difficulty determining which AI tool fits a task — **ASSUMPTION** (implied by the tool-recommendation feature, not user-research-confirmed).
- Difficulty determining which specific AI **model** (not just tool/brand) a prompt is written for — **FACT**. `01-PROBLEM.md` states directly that "someone with a Runway subscription wastes time on prompts written for Sora, and blames your prompts when the result is poor."

### Prompt Creation
- Not knowing what to write as a prompt from scratch — **ASSUMPTION** (now largely absorbed by admin-authored, finished-text base prompts, per `01-PROBLEM.md`).
- Not knowing how much detail to provide — **UNKNOWN**; the prior guided-fields mechanism (which addressed this) has been removed, and no replacement mechanism for expressing detail is described beyond free-form customization requests.

### Requirement Definition
- Knowing what they want but struggling to express it as a well-formed prompt — **FACT (design inference)**. This is the explicit premise of the customization engine: "an admin can't anticipate every variation a user might want," so the user expresses a change in plain language and an AI service converts it into prompt wording.
- Not knowing which information matters to a given AI tool/model — **UNKNOWN**; not addressed now that guided fields are gone.

### AI Tool Usage
- Not knowing how to use the selected AI tool once there — **FACT**, directly addressed by the confirmed steps/video feature.
- Not knowing where to apply the prompt or which settings to change — **FACT**, same basis.

### Result Quality
- Getting a prompt that is close but not quite right — **FACT (design inference)** — the stated justification for Customize.
- Uncertainty about what went wrong with a poor result — **UNKNOWN**; not addressed in the source material.

### Discovery and Organization
- Prompts/tools/tutorials scattered across sources — **ASSUMPTION** (carried over from the problem doc, unconfirmed by research).
- Difficulty returning to useful prompts/workflows — partially addressed by favourites (**FACT** that favourites exist), but whether users find this sufficient is **UNKNOWN**.

### New pain point not in the brief's category list: Cost/Access Confusion
- Not understanding the difference between what a subscription unlocks (reading/copying prompts) and what credits unlock (changing prompts) — **FACT** as a *named business risk*: `01-PROBLEM.md` states "users must never be confused about which is which." This is a confirmed design concern, not a confirmed observed user frustration.

---

## 5. Current Workflow — Before AWA

### Confirmed Current Workflow
- **UNKNOWN.** `01-PROBLEM.md` explicitly states no current-state user research exists and that the hypothesized pre-AWA workflow "remain[s] unvalidated."

### Likely / Assumed Workflow
The following is carried over from `01-PROBLEM.md` as an explicitly unconfirmed hypothesis, not a fact:
1. User identifies something they want to create.
2. User searches for an appropriate AI tool.
3. User evaluates/compares available tools.
4. User searches for prompts or examples.
5. User attempts to write or modify a prompt.
6. User enters the prompt into an external AI tool.
7. User evaluates the result.
8. User modifies the prompt and repeats if the result is poor.

**Status: ASSUMPTION in its entirety.** None of these steps are confirmed by the source material.

### Unknown Workflow
- Whether users currently seek out AI-assisted prompt-rewriting tools (comparable to AWA's customization engine) as part of this process — **UNKNOWN**.
- How users currently decide which AI model (not just tool) to target — **UNKNOWN**.
- What causes users to abandon this process today — **UNKNOWN**.

---

## 6. Current Workflow Pain Points

Because the current (pre-AWA) workflow itself is unconfirmed (Section 5), the table below documents the pain points **that would apply if the assumed workflow is accurate**, all marked ASSUMPTION, alongside the one workflow-adjacent pain point that is FACT.

| Workflow Step | User Objective | User Problem | Impact | Status |
|---|---|---|---|---|
| Search for a tool | Find something that can do the task | Difficulty comparing tools/models | Wasted time; possible wrong choice | ASSUMPTION |
| Search for prompts | Get a usable starting point | Prompts scattered across sources | Extra searching, inconsistent quality | ASSUMPTION |
| Write/modify a prompt | Express the requirement | Doesn't know prompt-writing technique or what detail matters | Poor or inconsistent results | ASSUMPTION |
| Use the AI tool | Generate the output | Doesn't know tool-specific settings/steps | Wasted attempts, frustration | FACT that this specific gap is real enough that AWA's steps/video feature exists to address it — though the *pre-AWA* user experience of it is not itself confirmed by research |
| Evaluate result | Decide if it worked | Uncertainty about what to change | Repeated trial and error | ASSUMPTION |
| Get the wrong tool/model for the prompt | Use a prompt as-is | Prompt was written for a different model | Poor result, blames the prompt rather than the mismatch | FACT (stated directly as the Runway/Sora example) but as a *stated design rationale*, not as observed pre-AWA user behavior |

---

## 7. Proposed Workflow — With AWA

**FACT (confirmed product-level flow, per `01-PROBLEM.md` Section 9):**

1. User discovers an AI creation use case.
2. User selects a category and navigates subcategories (unlimited depth).
3. User filters/searches, including by AI model (in addition to tag/style/mood/difficulty).
4. User selects a template, or starts blank.
5. User sees the finished prompt immediately — subscribers see it in full; non-subscribers see it blurred with a Subscribe prompt. There is no requirement-gathering form before this step.
6. **(Optional)** If the prompt isn't quite right, the user clicks Customize and types or speaks the desired change. The system sends the base prompt plus the request to an outside AI service, which returns a rewritten version a few seconds later. The original is always retrievable ("Back to original"); intermediate versions are kept for the session; each attempt costs one credit; a failed/timed-out attempt does not consume a credit.
7. User sees 1–3 recommended AI tools/models with a stated reason each.
8. User sees short usage steps and/or a short video.
9. User copies the (possibly customized) prompt and leaves to use it on the external tool.
10. User may return to give feedback (thumbs up/down, optional comment, optional tool used); if a customized prompt was used, the request behind that customization is also implicitly captured.

**Steps that remain assumptions rather than finalized requirements**, per `01-PROBLEM.md`'s own framing:
- Whether users will engage with Customize at a meaningful rate, or mostly use the unmodified base prompt, is **UNKNOWN**.
- Whether users understand and accept the subscription/credits distinction in practice is an **ASSUMPTION**, explicitly flagged as needing validation.
- Whether the model filter meaningfully changes tool/model selection behavior is an **ASSUMPTION**.

---

## 8. Before vs. After Comparison

| Area | Current Experience | With AWA | Expected Improvement |
|---|---|---|---|
| Tool discovery | ASSUMPTION — search engines/social media, manual comparison | FACT — curated 1–3 tool/model recommendations with a stated reason, filterable by model | Not quantified. **TBD** |
| Prompt creation | ASSUMPTION — write or copy/modify prompts from scattered sources | FACT — instant, admin-authored finished prompt | Not quantified. **TBD** |
| Requirement expression | ASSUMPTION — user must translate their idea into prompt wording themselves | FACT — user expresses a desired *change* in plain language (typed or spoken); an AI service does the prompt-wording work | Not quantified. **TBD** |
| AI-tool/model selection | ASSUMPTION — user guesses or compares manually | FACT — recommendation includes model, plus a filter to see only templates for a model the user actually has | Not quantified. **TBD** |
| Learning tool usage | ASSUMPTION — separate tutorials | FACT — 4–7 short steps and/or a short video bundled with the prompt | Not quantified. **TBD** |
| Trial and error | ASSUMPTION — repeated manual prompt rewriting | FACT — a bounded, credit-metered customization loop with an always-available "back to original" | Not quantified. **TBD** |
| Time/effort | UNKNOWN | UNKNOWN — no time-to-completion data exists for either side | **TBD** |
| Confidence | UNKNOWN | ASSUMPTION — tool/model rationale and steps are intended to increase confidence | **TBD** |
| Result quality | UNKNOWN | UNKNOWN — AWA does not control or measure the external tool's output quality | **TBD** |
| Reusability | UNKNOWN | FACT — favourites let a user save a template; version history lets an admin track prompt quality over time | **TBD** |

No measurable improvement is claimed anywhere in this table, since `01-PROBLEM.md` defines no baseline metrics or targets (all marked TBD there as well).

---

## 9. Important Use Cases

Only categories explicitly present in `01-PROBLEM.md` (the five launch categories) are used. No use case is treated as confirmed product scope beyond what the source states.

### Use Case: Image Creation
- **User:** Person wanting an AI-generated image (product photo, illustration, logo, social post). ASSUMPTION-level persona, FACT-level category.
- **Trigger:** Wants an image but doesn't know what to type into an image-generation tool.
- **User goal:** Get a usable prompt and a suitable tool/model recommendation.
- **Starting condition:** Arrives at AWA, browses or searches the Image Generation category.
- **Main journey:** Category → template → instant prompt → optional customization → tool/model recommendation → steps → copy → use externally.
- **Expected outcome:** A usable image-generation prompt matched to a tool/model the user can access.
- **Dependencies:** A live template with an assigned tool/model exists for the desired image type.
- **Known limitations:** AWA does not generate the image itself.
- **Assumptions:** That the user's core blocker is prompt/tool knowledge rather than something else (ASSUMPTION).

### Use Case: Video Creation
- **User:** Person wanting an AI-generated video (ad, intro, explainer, reel).
- **Trigger:** Wants a video but doesn't know which tool/model to target or how to word the prompt for it.
- **User goal:** Get a prompt worded correctly for the specific model they have access to (e.g., Runway vs. Sora vs. Pika).
- **Starting condition:** Arrives at the Video Generation category, optionally filters by model.
- **Main journey:** Category → filter by model → template → instant prompt → optional customization → tool/model recommendation → steps → copy → use externally.
- **Expected outcome:** A prompt that works with the model the user actually has, avoiding the confirmed failure mode of a model-mismatched prompt.
- **Dependencies:** Templates tagged for the relevant model exist.
- **Known limitations:** AWA does not run or preview the video itself.
- **Assumptions:** That model-level mismatch is a meaningful source of poor results for this group (this specific rationale is FACT-stated in the source, but its frequency/impact is not measured).

### Use Case: Website Creation
- **User:** Person wanting to use AI to build a landing page, portfolio, or business site.
- **Trigger:** Wants a website but doesn't know how to express requirements to an AI website-builder.
- **User goal:** Get a usable prompt and a matching tool.
- **Starting condition:** Arrives at the Website Making category.
- **Main journey:** Same general flow as above.
- **Expected outcome:** A usable website-generation prompt.
- **Dependencies:** Live templates exist for the desired site type.
- **Known limitations:** AWA does not build the website.
- **Assumptions:** ASSUMPTION-level persona detail; category itself is FACT.

### Use Case: Presentation Creation
- **User:** Person wanting an AI-generated pitch deck or teaching slides.
- **Trigger:** Wants a presentation but doesn't know how to structure a prompt for it.
- **User goal:** Get a usable slide-generation prompt and matching tool.
- **Starting condition:** Arrives at the Slides / Presentations category.
- **Main journey:** Same general flow.
- **Expected outcome:** A usable presentation-generation prompt.
- **Dependencies:** Live templates exist.
- **Known limitations:** AWA does not build the presentation.
- **Assumptions:** ASSUMPTION-level persona detail; category itself is FACT.

### Use Case: Poster / Design Creation
- **User:** Person wanting an event poster, flyer, or banner.
- **Trigger / goal / journey / outcome / dependencies / limitations:** Same structure as above, applied to the Poster / Design category (FACT-level category, ASSUMPTION-level persona detail).

No use case beyond these five is introduced, since `01-PROBLEM.md` does not confirm any additional category.

---

## 10. User Scenarios

All scenarios below are hypothetical illustrations built from confirmed product mechanics in `01-PROBLEM.md`. None represent an actual interview, observed session, or research finding. **All are marked ASSUMPTION.**

**Scenario A (ASSUMPTION).**
*Context:* A user wants a vertical Instagram video ad. *User intent:* Get a working prompt for the AI video tool they already have (Runway). *Problem encountered:* A template's base prompt is written for a general audience and doesn't specify vertical format or the product being advertised. *User action:* Filters templates by the Runway model, opens a matching template, sees the base prompt, then clicks Customize and types "make it a vertical video for Instagram, more cinematic, and change the product to a leather wallet." *AWA interaction:* Sends the base prompt plus the request to the AI rewriting service; returns an updated prompt a few seconds later; one credit is used. *Expected result:* User copies the rewritten prompt and pastes it into Runway.

**Scenario B (ASSUMPTION).**
*Context:* A first-time AI user wants a simple logo. *User intent:* Get something usable without needing to understand prompt-writing at all. *Problem encountered:* Uncertainty about whether to trust the process. *User action:* Picks the Image Generation category, opens a logo template, reads the base prompt as-is (does not customize), copies it after subscribing. *AWA interaction:* Serves the finished prompt instantly with no AI involvement; shows 1–3 recommended tools with a one-line reason each; shows short usage steps. *Expected result:* User pastes the prompt into the recommended tool without ever using Customize.

**Scenario C (ASSUMPTION).**
*Context:* A subscriber has used all their free customizations. *User intent:* Wants to try one more refinement. *Problem encountered:* Clicking Customize now shows "Buy credits" instead of running the rewrite. *User action:* Either buys a credit pack or copies the last prompt version they already have (reading/copying is never blocked by lack of credits). *AWA interaction:* Prompt remains fully readable and copyable regardless of credit balance. *Expected result:* User either purchases credits or proceeds with the existing prompt.

---

## 11. Edge Cases

Only edge cases with a basis in confirmed AWA mechanics (per `01-PROBLEM.md`) are included; each is marked by how directly it is supported.

### User Input
- User's customization request is very vague, extremely detailed, ambiguous, or self-contradictory — **UNKNOWN** how the AI rewriting service or AWA is expected to handle this; not addressed in the source material.
- User doesn't know what to ask for and never uses Customize — **ASSUMPTION**, consistent with Scenario B above.

### Template
- No suitable template exists for a user's need — **ASSUMPTION**; the "start from blank" option (still confirmed to exist per the underlying product, though not itself re-stated in `01-PROBLEM.md`'s summary) would be the fallback, but this document does not confirm current behavior beyond what `01-PROBLEM.md` states.
- User picks a template written for a different AI model than they have — **FACT** as a named failure mode (the Runway/Sora example), explicitly why the model filter exists.

### Prompt / Customization
- Generated (customized) prompt still doesn't satisfy the user's intent — **UNKNOWN** whether the user can retry within the same credit or must spend another; `01-PROBLEM.md` states each *attempt* costs a credit and a failed/timed-out one is refunded, but does not address a "succeeded but still unsatisfying" case.
- Customization fails or times out — **FACT**: credit is not charged, and the previous prompt remains on screen untouched.
- User wants to step back through earlier customized versions in the same session — **FACT**, explicitly supported.
- User wants to return fully to the original base prompt — **FACT**, via "Back to original."

### External AI Tool
- Recommended tool/model becomes unavailable or changes — **FACT** as a named constraint: "AI tools and their specific models can change or be retired over time," requiring ongoing admin maintenance. Whether this is handled gracefully for an in-progress user session is **UNKNOWN**.
- No AI tool/model is configured for a given template — **UNKNOWN** in this document's source; not addressed in `01-PROBLEM.md` (was addressed in the prior product-feature material with a neutral fallback message, but that specific detail is not restated as confirmed fact here since this document is scoped strictly to `01-PROBLEM.md`).

### User Experience
- First-time AI user vs. experienced AI user — **ASSUMPTION** that they need different levels of help; not confirmed.
- User wants maximum guidance vs. user skips all guidance (never customizes, never reads steps) — **ASSUMPTION**, plausible under the optional design of Customize and steps, not validated.

### Subscription / Access
- Non-subscriber reaches the prompt: sees it blurred, with a Subscribe button — **FACT**.
- Subscriber runs out of credits: Customize becomes "Buy credits"; reading/copying the prompt is never blocked — **FACT**.
- What happens when a yearly subscription lapses (full lock vs. keep-what-they-made) — **UNKNOWN / explicitly undecided** in the source.
- One-device-at-a-time login is triggered by a second sign-in — **FACT** that this restriction exists; whether it should be one or two devices is **explicitly undecided**.

---

## 12. Accessibility and Inclusivity Considerations

- **Users with limited AI knowledge / unfamiliar with prompt terminology** — the product's core design premise (instant finished prompts, no prompt-writing required, natural-language customization instead of technical prompt syntax) is consistent with lowering this barrier, but no research confirms it actually does so for this group. **ASSUMPTION.**
- **Users who prefer speaking over typing, particularly on mobile** — **FACT** that voice input for customization exists specifically because "most of your users will be on a phone" and speaking is faster than typing on one. This is the one directly stated accessibility-adjacent consideration in the source material.
- **Users with limited digital literacy generally** — **UNKNOWN**; not addressed.
- **Users with other accessibility needs (visual, motor, hearing, cognitive)** — **UNKNOWN**; not addressed anywhere in `01-PROBLEM.md`. This is a validation gap, not a confirmed non-requirement.

These are raised here as considerations and open questions, not as confirmed requirements.

---

## 13. User Decision Points

| Decision | Information Needed | Potential Uncertainty | Consequence of a Wrong Decision |
|---|---|---|---|
| Which category/subcategory to choose | Which category matches the intended output | User may not know how AWA has organized categories | Wasted browsing time; may miss a relevant template |
| Which template to choose (or start blank) | Whether a template matches the specific need | Templates may look similar; model-fit may not be obvious without filtering | Gets a base prompt not well-suited to the task |
| Whether to filter/select by AI model | Which tool/model the user actually has access to | User may not know their tool's exact model name (e.g., "Runway" vs. "Runway Gen-3") | May pick a template written for a model they can't use, per the confirmed Runway/Sora failure mode |
| Whether the base prompt is "good enough" as-is | Understanding of what the prompt will actually produce | User may not be able to judge this without trying it externally | Either wastes a customization credit unnecessarily, or uses an unsuitable prompt externally |
| Whether to use Customize, and what to ask for | How to phrase the desired change in plain language | User may not know how to describe what they want; result of the rewrite is not guaranteed to satisfy them | Spends a credit without getting a satisfying result (though a failed/timed-out attempt itself is not charged) |
| Whether to subscribe | Whether the (currently blurred) prompt is worth paying for | Cannot read the full prompt before subscribing | May subscribe and be dissatisfied, or may decline and never experience the core value |
| Whether to buy a credit pack | What one credit is worth to them; pack pricing is currently undecided in the source material | Pricing/value not yet finalized even by the product's own material | **UNKNOWN** — cannot be assessed until pricing is decided |
| Which recommended tool to actually use | Which of the 1–3 recommended tools/models fits their access/budget | Recommendation reasons are one line each; may not cover all relevant factors | May pick a tool that's paid when the user wanted free, or vice versa |

---

## 14. User Expectations

### Confirmed Expectations (FACT)
- That browsing categories, searching, filtering (including by model), reading template descriptions, seeing tool suggestions, and reading steps are free and available without a subscription.
- That the base prompt, once unlocked by subscription, is instant and requires no additional form-filling.
- That running out of credits will never prevent reading or copying a prompt — only customization is affected.
- That a customization attempt that fails or times out will not cost a credit and will leave the existing prompt untouched.
- That the original (pre-customization) prompt is always recoverable.

### Assumed Expectations (ASSUMPTION)
- That a recommended tool/model will actually produce a good result from the given prompt.
- That the customization feature will understand and correctly act on a plain-language request.
- That the subscription and credits systems are easy to tell apart in practice (explicitly the opposite of what `01-PROBLEM.md` treats as a risk to be managed, not a guarantee).
- That users will return to give feedback after using a prompt externally.

### Unknown Expectations (UNKNOWN)
- Whether users expect to be able to compare multiple tool outputs before choosing (a feature explicitly out of scope).
- Whether users expect prompt/customization history to persist beyond a session.
- Whether users expect a free trial of the prompt-reading experience before subscribing (the source material discusses this as an undecided question, not a stated user expectation).

`01-PROBLEM.md` explicitly does not assume users will automatically trust recommendations, subscribe, return, or achieve successful results — this document preserves that same caution and does not assert any of those outcomes as expected or guaranteed.

---

## 15. User Research Gaps

Directly carried over and extended from `01-PROBLEM.md`'s Unknowns section, reframed as user-research questions:

- Who is the highest-value (most likely to pay and stay subscribed) user? **UNKNOWN.**
- What AI creation tasks are most common among the five launch categories? **UNKNOWN.**
- How do users currently discover AI tools and models? **UNKNOWN.**
- How do users currently find prompts? **UNKNOWN.**
- What makes a prompt (or a customization) valuable enough to pay for? **UNKNOWN.**
- How much guidance do users actually want, now that guided input fields have been removed in favor of free-form customization? **UNKNOWN — this is a new gap created by the recent product change.**
- Do experienced users prefer templates, or would they prefer to skip straight to a free-form request? **UNKNOWN.**
- What causes users to abandon the process — at browsing, at the paywall, or after a customization? **UNKNOWN.**
- What determines successful output on the external AI tool, from the user's perspective? **UNKNOWN.**
- Which categories or models have the strongest demand? **UNKNOWN.**
- Do users understand, mentally, the difference between subscription and credits? **UNKNOWN — a new gap created by the credits system.**
- How often does a customization actually satisfy the user, versus requiring another attempt or being abandoned? **UNKNOWN.**

---

## 16. Validation Questions

### Critical
1. Do users actually struggle to articulate a desired prompt change well enough that an AI rewrite step is necessary — or would most be satisfied by the base prompt alone?
2. Do users understand the subscription-vs-credits split, or does it cause confusion/support burden as feared in the source material?
3. Is model-level mismatch (e.g., a Sora-worded prompt given to a Runway user) a common and costly failure mode in practice, validating the investment in model tagging and filtering?
4. What do users consider a successful outcome, and how would AWA measure it (thumbs up/down alone, or something richer)?

### Important
5. How much do users rely on the recommended tools/models versus choosing their own?
6. Do users read/use the provided steps and videos, or skip them?
7. How many customization attempts does a typical user need before being satisfied, and does this vary by category?
8. Do users prefer typing or speaking their customization requests, and does this differ meaningfully on mobile vs. desktop?

### Nice to Know
9. Which categories or templates generate the most engagement first?
10. Do users return to favourite templates, or mostly use each template once?
11. What proportion of users ever click Customize at all versus using the base prompt as-is?

---

## 17. User Research Summary

**Primary User:** A person pursuing an AI creation task (image, video, website, presentation, or poster) who knows AI tools exist but doesn't know which tool or model fits their task, what to write as a prompt, or how to adjust a prompt that's close but not quite right. This is the central actor `01-PROBLEM.md` is built around.

**Secondary Users:** None are confirmed as a distinct group; platform/content administrators are the only other confirmed user type, and they are classified here as administrative/operational rather than secondary.

**Core User Goal:** Turn a simple idea into a finished, usable AI creation on a tool/model they actually have access to, with no prompt-writing skill required.

**Core User Problem:** Not knowing which tool/model fits their task, what to write as a prompt, and — since the recent product change — not being able to express a desired refinement to a close-but-not-quite-right prompt without help.

**Current Workflow:** UNKNOWN/hypothetical only — no confirmed pre-AWA research exists; the commonly assumed pattern (search for tools, search for prompts, trial-and-error) is explicitly unvalidated.

**Proposed Workflow:** Browse/filter (including by AI model) → open a template → see an instant, admin-written prompt → optionally request a plain-language change (typed or spoken), refined by an AI service and metered by credits → see 1–3 recommended tools/models with reasons → see short steps/video → copy and use externally → optionally give feedback.

**Most Important Use Cases:** The five launch-category use cases — image, video, website, presentation, and poster/design creation — each following the same general flow, with video creation carrying the additional, explicitly confirmed model-matching concern.

**Major Pain Points:** Tool/model discovery difficulty (partly confirmed, partly assumed); inability to get a prompt personalized to a specific need without prompt-writing skill (the confirmed justification for Customize); not knowing how to use a tool once there (confirmed, addressed by steps); and a newly introduced risk of subscription/credits confusion (confirmed as a named design concern).

**Critical Edge Cases:** Model-mismatched templates; exhausted credits (must never block reading/copying); failed or timed-out customizations (must not charge a credit); and the still-undecided behavior for lapsed subscriptions and multi-device sign-in.

**Key Assumptions:** That users genuinely cannot phrase prompt-refinement requests themselves (hence need the AI intermediary); that the subscription/credits split will be understood rather than confusing; that most users are mobile-first, justifying voice input; and that beginners and experienced users need meaningfully different levels of guidance.

**Critical Research Questions:** Whether the customization feature is solving a real, common user need versus a hypothesized one; whether users understand and accept the subscription/credits distinction; whether model-level mismatch is a significant real-world failure mode; and what "success" should mean from the user's point of view before more detailed product, UX, or requirements work proceeds.
