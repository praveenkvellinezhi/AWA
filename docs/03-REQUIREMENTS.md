# AWA — Product Requirements Definition

**Status:** Baseline requirements specification, derived exclusively from `docs/01-PROBLEM.md` (PROBLEM) and `docs/02-USER-RESEARCH.md` (RESEARCH).
**Scope of this document:** *What* AWA must accomplish. No technology stack, architecture, database design, API design, or UI design is specified here.
**Traceability rule:** Every confirmed requirement below cites the source section(s) that support it. Anything not directly traceable to a confirmed problem, user need, business need, desired outcome, workflow, or product boundary is placed under **Candidate Requirements — Requires Validation** (Section D) and is not part of confirmed scope.

---

## A. Requirements Principles Applied

- Requirements are derived only from confirmed (FACT) statements in PROBLEM and RESEARCH, or from statements the source documents themselves mark as a confirmed product decision (e.g., "the material states directly").
- Where a source item is marked ASSUMPTION or UNKNOWN in PROBLEM/RESEARCH, it is **not** converted into a confirmed requirement here. It is either omitted, or — if it represents a plausible future requirement — listed under Candidate Requirements.
- Numerical targets (response times, credit counts, prices, caps) are **only** included where the source states them as a concrete figure (e.g., ₹199/yr subscription price). Where the source explicitly says a figure is undecided or illustrative, this document marks it `Target: TBD` and cross-references the corresponding open question — it does not invent a number.
- AWA's product boundary (Section H below, and PROBLEM §21/§9) is preserved throughout: AWA prepares a prompt and points the user to an external AI tool; it does not generate, run, or control the final creative output.

---

## B. Functional Requirements

### B.1 AI Creation Discovery & Catalog Navigation

#### FR-001 — Browse Categories and Subcategories

- Type: Functional
- Description: The system must allow a user to browse a catalog of AI creation categories and subcategories (organized to unlimited depth) in order to locate content relevant to their intended creation task.
- User/Stakeholder: Person pursuing an AI creation task (primary user).
- Priority: P0
- Source: PROBLEM §9 (steps 1–2), §21 (In Scope); RESEARCH §7 (steps 1–2), §17
- Rationale: Category/subcategory browsing is the first confirmed step of AWA's intended user journey and the entry point for solving the discovery problem described in PROBLEM §2–§4.
- Acceptance Criteria:
  - Given a user opens AWA, when they browse the catalog, then they can see the five launch categories (Image Generation, Video Generation, Website Making, Slides/Presentations, Poster/Design) and their subcategories.
  - Given a category contains subcategories, when a user selects it, then the system shows the next level of the hierarchy.
  - Given no content exists yet in a category, when a user opens it, then the system indicates there is nothing available rather than failing silently.
- Dependencies: FR-035 (admin-authored category structure must exist).
- Assumptions: None beyond source material.
- Open Questions: None.

#### FR-002 — Search and Filter Templates

- Type: Functional
- Description: The system must allow a user to search and/or filter templates within a category using available attributes (e.g., tag, style, mood, difficulty).
- User/Stakeholder: Primary user.
- Priority: P0
- Source: PROBLEM §9 (step 3); RESEARCH §7 (step 3)
- Rationale: Filtering reduces discovery burden, a confirmed source of user pain (PROBLEM §13, "Discovery").
- Acceptance Criteria:
  - Given a category has multiple templates, when a user applies a filter, then only templates matching that filter are shown.
  - Given a filter matches no templates, when applied, then the system communicates that no matching templates were found.
  - Given a user clears filters, when they do so, then the full unfiltered template list for that category is shown again.
- Dependencies: FR-036.
- Assumptions: None.
- Open Questions: None.

#### FR-003 — Filter Templates by AI Model

- Type: Functional
- Description: The system must allow a user to filter templates specifically by the AI model(s) they are tagged for (e.g., Runway Gen-3, Sora, Pika 1.5), in addition to other filter attributes.
- User/Stakeholder: Primary user, particularly video creators.
- Priority: P1
- Source: PROBLEM §1, §2, §4, §9, §13; RESEARCH §4, §9 (Video Creation use case), §13
- Rationale: Model-level mismatch is a confirmed, directly stated failure mode ("someone with a Runway subscription wastes time on prompts written for Sora, and blames your prompts when the result is poor" — PROBLEM §4). This filter exists specifically to prevent that outcome. It is P1 rather than P0 because the core discovery/prompt-delivery flow (FR-001–FR-002, FR-007) can function without it, but the model filter directly addresses a confirmed, named user cost.
- Acceptance Criteria:
  - Given templates are tagged with one or more AI models, when a user filters by a specific model, then only templates tagged for that model are shown.
  - Given a user has not selected a model filter, when browsing, then templates are not restricted by model.
  - Given a template is tagged for multiple models, when any of those models is selected as a filter, then the template appears in the results.
- Dependencies: FR-037 (admin model tagging with inheritance).
- Assumptions: None.
- Open Questions: None.

#### FR-004 — View Template Details Before Selection

- Type: Functional
- Description: The system must allow a user to view descriptive information about a template (e.g., description, tags, associated tool/model) before selecting it, without requiring a subscription.
- User/Stakeholder: Primary user (including non-subscribers).
- Priority: P1
- Source: PROBLEM §21 (In Scope: "reading template descriptions... free and available without a subscription" per RESEARCH §14); RESEARCH §14 (Confirmed Expectations)
- Rationale: Confirmed expectation that browsing/reading template descriptions is free, supporting informed template selection before any paywall.
- Acceptance Criteria:
  - Given a user is not subscribed, when they view a template, then they can see its description and associated tool/model tags without being blocked.
  - Given a user views template details, when they proceed to select it, then they reach the prompt view (FR-007).
- Dependencies: FR-036.
- Assumptions: None.
- Open Questions: None.

#### FR-005 — Select a Template

- Type: Functional
- Description: The system must allow a user to select a specific template as the basis for their prompt.
- User/Stakeholder: Primary user.
- Priority: P0
- Source: PROBLEM §9 (step 4); RESEARCH §7 (step 4)
- Rationale: Template selection is the confirmed transition point from browsing to receiving a usable prompt, the central value of the product.
- Acceptance Criteria:
  - Given a user has browsed to a template, when they select it, then the system proceeds to display the associated prompt per FR-007/FR-008.
  - Given a user selects a different template, when they do so, then any prior template's prompt view is replaced (not merged) with the newly selected template's prompt.
- Dependencies: FR-001, FR-036.
- Assumptions: None.
- Open Questions: None.

#### FR-006 — Start Without a Template ("Blank" Option)

- Type: Functional
- Description: The system must allow a user to begin the prompt process without selecting a pre-made template ("starts blank"), as an alternative to FR-005.
- User/Stakeholder: Primary user, particularly experienced users.
- Priority: P1
- Source: PROBLEM §9 (step 4: "User selects a template (or starts blank)")
- Rationale: Directly stated as part of the confirmed step-4 flow, offering an alternative path for users whose need isn't covered by an existing template.
- Acceptance Criteria:
  - Given a user does not find a suitable template, when they choose to start blank, then the system provides a path forward that does not require an existing template.
  - Given a user starts blank, when they proceed, then subsequent steps (recommendation, guidance, feedback) remain available to them in a manner consistent with the templated flow, to the extent supported.
- Dependencies: None known.
- Assumptions: The exact mechanics of the "blank" path beyond its existence are not detailed in the source material.
- Open Questions: What content or interaction the "blank" path actually presents to the user is not specified in PROBLEM or RESEARCH beyond its existence being confirmed. (RESEARCH §11 notes this exact ambiguity.)

---

### B.2 Prompt Access

#### FR-007 — Display Finished Prompt Instantly

- Type: Functional
- Description: Upon selecting a template, the system must immediately display the associated finished, admin-authored prompt text, with no requirement-gathering form and no AI processing step in between.
- User/Stakeholder: Primary user (subscribers see full text; non-subscribers see a blurred version per FR-008).
- Priority: P0
- Source: PROBLEM §1, §9 (step 5), §16; RESEARCH §7 (step 5)
- Rationale: This is the core, zero-effort value proposition of AWA: removing prompt-writing burden entirely (PROBLEM §10).
- Acceptance Criteria:
  - Given a user selects a template, when the prompt view loads, then the finished prompt text is shown without any intermediate input form.
  - Given the prompt is admin-authored, when displayed, then it is identical for every user of that template (prior to any customization).
  - Given the base prompt does not require AI generation, when requested, then it is available even if the outside AI rewriting service is unavailable (see NFR-003).
- Dependencies: FR-036.
- Assumptions: None.
- Open Questions: None.

#### FR-008 — Safe Preview for Non-Subscribers

- Type: Functional
- Description: The system must present a safe preview or locked representation of the prompt to non-subscribed users — along with a subscribe call-to-action — instead of delivering the complete prompt text to them. The complete prompt text must not be delivered to a non-subscriber's client.
- User/Stakeholder: Non-subscribed primary users.
- Priority: P0
- Source: PROBLEM §9 (step 5); RESEARCH §7 (step 5), §11 (Subscription/Access), §14; SECURITY §2
- Rationale: Confirmed mechanism for monetizing prompt access while still letting non-subscribers evaluate relevance before paying. The specific form of the preview (blurred appearance vs. hard block vs. another safe representation) is a product/UX decision that remains open (see below); what is not open is that the full prompt text must not reach a non-subscriber's client regardless of which form is chosen.
- Acceptance Criteria:
  - Given a user without an active subscription views a template's prompt, when the prompt view loads, then the complete prompt text is not delivered to the user's client; only a safe preview or locked representation is shown.
  - Given the safe preview is displayed, when the user views it, then a visible subscribe call-to-action is presented.
  - Given a user subscribes, when they return to the same prompt, then the full prompt text becomes accessible.
- Dependencies: FR-027.
- Assumptions: None.
- Open Questions: The specific form of the non-subscriber experience — blurred preview, hard block, or another safe representation — is explicitly undecided in the source material (PROBLEM §18; see Section E, Conflict C-1). The requirement to withhold the full prompt text from non-subscribers is not open; only the presentation form is.

#### FR-009 — View Full Prompt Text (Subscribers)

- Type: Functional
- Description: The system must deliver the complete, unobscured prompt text only to users whose subscription is verified as active at the time of the request. Access must be verified independently of any client-supplied subscription state.
- User/Stakeholder: Subscribed primary users.
- Priority: P0
- Source: PROBLEM §9 (step 5), §11; RESEARCH §2, §14; SECURITY §2
- Rationale: Reading the full prompt is the core item the subscription pays for (PROBLEM §10, §11). Because prompt content is the monetized asset, authorization must be confirmed at the point of delivery — a client-side flag indicating "subscribed" is not sufficient.
- Acceptance Criteria:
  - Given a user has an active subscription, when they request a template's prompt, then the full prompt text is returned and displayed.
  - Given a user's subscription has lapsed, when they request a prompt, then the full prompt text is not returned; the system treats the request as if the user is not subscribed, regardless of any cached or client-held subscription status.
  - Given the authorization check is performed, when it runs, then it uses the user's current subscription entitlement as recorded in the system, not a value supplied by the client.
- Dependencies: FR-027.
- Assumptions: None.
- Open Questions: The specific behavior shown to the user when a subscription lapses mid-session is explicitly undecided (PROBLEM §11, §18; see Section E).

#### FR-010 — Copy Prompt Text

- Type: Functional
- Description: The system must allow a subscribed user to copy the prompt text (base or customized) for use outside AWA. The ability to copy the full prompt text follows the same authorization boundary as viewing it: a user may copy only prompt content that has already been authorized for delivery to them.
- User/Stakeholder: Subscribed primary users.
- Priority: P0
- Source: PROBLEM §1, §9 (step 9); RESEARCH §3, §7 (step 9); SECURITY §2
- Rationale: Copying the prompt is the confirmed action that lets the user act on AWA's core value externally ("Pick a category → get an expert prompt → ... → get the right AI tool", PROBLEM §1). Because the copy action operates on the delivered prompt text, it inherits the same authorization requirement as FR-009 — disabling the Copy button in the UI is not a substitute for ensuring the full text was only delivered to authorized users in the first place.
- Acceptance Criteria:
  - Given a subscriber is authorized to view a prompt (FR-009), when they choose to copy it, then the exact currently displayed prompt text (including any active customization) is made available for external use.
  - Given a user is not authorized to receive the full prompt text, when the copy action is considered, then it is not available regardless of any UI state.
  - Given a subscriber has run out of customization credits, when they attempt to copy the existing prompt, then copying still succeeds (copying is never blocked by credit balance).
- Dependencies: FR-009, FR-033.
- Assumptions: None.
- Open Questions: None.

---

### B.3 Prompt Customization

#### FR-011 — Request a Prompt Change (Typed)

- Type: Functional
- Description: The system must allow a subscribed user to type a plain-language description of a desired change to the currently displayed prompt.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §1, §9 (step 6), §16; RESEARCH §3, §7 (step 6)
- Rationale: Confirmed premise of the customization engine — users can describe a desired change in their own words rather than needing prompt-writing skill (PROBLEM §10).
- Acceptance Criteria:
  - Given a subscriber is viewing a prompt, when they choose to customize, then they can enter free-text describing the desired change.
  - Given the subscriber submits a change request, when submitted, then the request is sent for processing per FR-013.
- Dependencies: FR-013, FR-016.
- Assumptions: None.
- Open Questions: How the system should handle a customization request that is very vague, extremely detailed, ambiguous, or self-contradictory is not addressed in the source material (RESEARCH §11).

#### FR-012 — Request a Prompt Change (Voice)

- Type: Functional
- Description: The system must allow a subscribed user to speak a plain-language description of a desired change to the currently displayed prompt, as an alternative to typing.
- User/Stakeholder: Subscribed primary users, particularly mobile users.
- Priority: P1
- Source: PROBLEM §1, §6, §9 (step 6), §15; RESEARCH §2, §12
- Rationale: Directly stated as important because "most of your users will be on a phone" (PROBLEM §6) — the one confirmed audience/behavior signal in the source material.
- Acceptance Criteria:
  - Given a subscriber is on the customization step, when they choose voice input, then they can speak their desired change instead of typing it.
  - Given a spoken request is captured, when transcribed, then it is processed through the same customization pathway as a typed request (FR-013), consuming the same single credit (FR-034).
  - Given voice input is disabled by an admin (FR-043), when a user opens customization, then voice input is not offered.
- Dependencies: FR-013, FR-034, FR-043.
- Assumptions: None.
- Open Questions: Which speech-to-text provider will be used is explicitly unresolved (PROBLEM §7, §18).

#### FR-013 — Generate Rewritten Prompt via Outside AI Service

- Type: Functional
- Description: The system must send the base (or currently active) prompt together with the user's change request to an outside AI rewriting service and return the resulting rewritten prompt to the user. Before sending any request to the external AI provider, the system must verify all of the following: (1) the user is authenticated; (2) the user has an active subscription; (3) the user is authorized to access the specific template being customized; (4) the user has sufficient customization usage entitlement remaining. A request that fails any of these checks must not result in a call to the external AI provider.
- User/Stakeholder: Subscribed primary users; indirectly, platform administrators (cost exposure).
- Priority: P1
- Source: PROBLEM §1, §9 (step 6), §16, §21; RESEARCH §7 (step 6); SECURITY §2, §7, §11
- Rationale: This is the confirmed mechanism by which AWA fulfills the "adjust a close-but-not-quite-right prompt" need without requiring user prompt-writing skill (PROBLEM §3, §10). Because each call to the external AI provider incurs real cost, the authorization and usage-entitlement checks must happen before the call — not after — so that unauthorized or over-limit requests never reach the provider.
- Acceptance Criteria:
  - Given a customization request is received, when it is processed, then the system verifies all four conditions (authenticated, active subscription, template access, sufficient usage entitlement) before calling the external AI provider.
  - Given any of those four conditions is not met, when the request is evaluated, then the request is rejected without calling the external AI provider.
  - Given all conditions are met and a valid change request exists, when submitted, then the system sends the base prompt and the request to the outside AI service and displays the rewritten prompt upon return.
  - Given the outside AI service is slow, down, or over its configured spending cap, when a customization is attempted, then base prompt browsing/reading/copying continues to function (see NFR-003) even though customization itself may be unavailable.
  - Given a rewrite is returned, when displayed, then it is shown alongside the original, preserving access to the original (FR-014).
- Dependencies: FR-011/FR-012, FR-016, FR-017, external AI rewriting service (stakeholder, provider UNKNOWN).
- Assumptions: None beyond the confirmed mechanism; whether the resulting rewrite reliably satisfies the user's intent is not confirmed (RESEARCH §14, "Assumed Expectations").
- Open Questions: Which AI rewriting provider will be used, and what a single call costs, is explicitly the most urgent open question in the source material (PROBLEM §11, §18, §19 Q1).

#### FR-014 — Revert to Original Prompt

- Type: Functional
- Description: The system must always allow the user to return to the original (pre-customization) base prompt, regardless of how many customizations have been made.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §9 (step 6); RESEARCH §7 (step 6), §11, §14
- Rationale: Confirmed safeguard ensuring customization never destructively overwrites the admin-authored base prompt.
- Acceptance Criteria:
  - Given a user has customized a prompt one or more times, when they select "Back to original," then the original admin-authored prompt is shown.
  - Given the user reverts to the original, when they do so, then no credit is charged for the reversion itself.
- Dependencies: FR-007, FR-013.
- Assumptions: None.
- Open Questions: None.

#### FR-015 — Session History of Customized Versions

- Type: Functional
- Description: The system must retain intermediate customized versions of a prompt for the duration of the user's session, allowing the user to step back through them.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §9 (step 6); RESEARCH §7 (step 6), §11
- Rationale: Confirmed feature supporting iterative refinement without losing earlier attempts.
- Acceptance Criteria:
  - Given a user has made multiple customization attempts in one session, when they navigate version history, then each prior version in that session is retrievable.
  - Given the session ends, when the user returns later, then persistence of that history beyond the session is not guaranteed (see Open Question).
- Dependencies: FR-013.
- Assumptions: None.
- Open Questions: Whether version history should persist beyond the current session is explicitly not addressed as a decision point in the source material (PROBLEM §18; RESEARCH §15). See Candidate Requirement CR-001.

#### FR-016 — Charge One Credit per Customization Attempt

- Type: Functional
- Description: The system must deduct one credit from the user's balance for each customization attempt that is successfully processed.
- User/Stakeholder: Subscribed primary users; platform administrators (cost control).
- Priority: P1
- Source: PROBLEM §9 (step 6), §11; RESEARCH §7 (step 6)
- Rationale: Confirmed metering mechanism protecting AWA's unit economics, since each rewrite call costs real money (PROBLEM §11).
- Acceptance Criteria:
  - Given a customization attempt completes successfully, when the rewritten prompt is returned, then exactly one credit is deducted from the user's balance.
  - Given a voice-based attempt is used, when it completes successfully, then only one credit is deducted (not two, despite the additional speech-to-text cost) — see FR-034.
- Dependencies: FR-013, FR-031/FR-032 (credit balance source).
- Assumptions: None.
- Open Questions: None.

#### FR-017 — No Charge on Failed or Timed-Out Customization

- Type: Functional
- Description: The system must not deduct a credit when a customization attempt fails or times out, and must leave the previously displayed prompt unchanged.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §9 (step 6); RESEARCH §7 (step 6), §11, §14
- Rationale: Confirmed fairness/reliability safeguard explicitly stated in the source material.
- Acceptance Criteria:
  - Given a customization attempt fails or times out, when this occurs, then no credit is deducted from the user's balance.
  - Given a customization attempt fails or times out, when this occurs, then the prompt shown to the user remains the version that was displayed before the attempt.
- Dependencies: FR-013, FR-016.
- Assumptions: None.
- Open Questions: None.

#### FR-018 — Redirect to Credit Purchase When Balance Is Zero

- Type: Functional
- Description: When a subscribed user has no remaining credits, the system must present a "Buy credits" option in place of the customization action, rather than attempting the customization.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: RESEARCH §10 (Scenario C), §11 (Subscription/Access), §14
- Rationale: Confirmed behavior ensuring users are never left in an unclear or failed state when out of credits; instead they are offered a clear next action.
- Acceptance Criteria:
  - Given a subscriber has zero credits, when they attempt to customize, then the system shows a "Buy credits" prompt instead of sending a request to the AI rewriting service.
  - Given the subscriber purchases credits, when the purchase completes, then the customization action becomes available again.
- Dependencies: FR-016, FR-032.
- Assumptions: None.
- Open Questions: None.

---

### B.4 AI Tool & Model Recommendations

#### FR-019 — Recommend Relevant AI Tools/Models

- Type: Functional
- Description: The system must display 1 to 3 recommended AI tools/models relevant to the selected (or customized) prompt, each accompanied by a one-line reason.
- User/Stakeholder: Primary users.
- Priority: P0
- Source: PROBLEM §1, §9 (step 7), §10; RESEARCH §3, §7 (step 7)
- Rationale: Directly addresses the confirmed tool/model-selection problem (PROBLEM §2–§4) and is one of the three deliverables described in AWA's one-line value statement (PROBLEM §1).
- Acceptance Criteria:
  - Given a user has selected a template (or produced a customized prompt), when the recommendation step is reached, then between one and three tools/models are shown, each with a one-line rationale.
  - Given a template/prompt has an associated model tag, when recommendations are generated, then the recommended tools/models are consistent with that tag.
  - Given no tool/model is configured for a template, when the recommendation step is reached, then the system does not fail silently (see Open Question).
- Dependencies: FR-037, FR-038.
- Assumptions: None.
- Open Questions: Expected behavior when no AI tool/model is configured for a given template is not addressed in PROBLEM or RESEARCH (RESEARCH §11).

---

### B.5 Usage Guidance

#### FR-020 — Provide Short Usage Steps

- Type: Functional
- Description: The system must display short, step-by-step guidance (4–7 steps) for using the recommended AI tool with the provided prompt.
- User/Stakeholder: Primary users.
- Priority: P0
- Source: PROBLEM §1, §4, §9 (step 8), §10; RESEARCH §4, §7 (step 8)
- Rationale: Directly addresses the confirmed "doesn't know how to use the tool once there" pain point (PROBLEM §4, §13).
- Acceptance Criteria:
  - Given a user has reached the guidance step, when displayed, then a short sequence of usage steps is shown for the recommended tool.
  - Given the steps are shown, when read, then they are specific to the recommended tool (not generic across all tools).
- Dependencies: FR-039.
- Assumptions: None.
- Open Questions: None.

#### FR-021 — Provide Optional Short Video

- Type: Functional
- Description: The system must support displaying a short instructional video alongside or instead of written usage steps, where one has been provided by an administrator.
- User/Stakeholder: Primary users.
- Priority: P1
- Source: PROBLEM §9 (step 8); RESEARCH §7 (step 8)
- Rationale: Confirmed as part of the usage-guidance deliverable, offered as an alternative/supplementary format to text steps.
- Acceptance Criteria:
  - Given an administrator has attached a video to a template's guidance, when the user reaches the guidance step, then the video is available to play.
  - Given no video has been attached, when the guidance step is reached, then written steps are shown without an error.
- Dependencies: FR-039.
- Assumptions: None.
- Open Questions: None.

---

### B.6 Feedback

#### FR-022 — Submit Thumbs Up/Down Feedback

- Type: Functional
- Description: The system must allow a user to submit a thumbs up or thumbs down rating on the prompt (base or customized) they used.
- User/Stakeholder: Primary users; indirectly, administrators.
- Priority: P1
- Source: PROBLEM §9 (step 10); RESEARCH §3, §7 (step 10)
- Rationale: Confirmed feedback mechanism that creates the signal loop described as the platform's most valuable report (PROBLEM §9).
- Acceptance Criteria:
  - Given a user has copied and used a prompt, when they return to AWA, then they can submit a thumbs up or thumbs down for that prompt.
  - Given feedback is submitted, when recorded, then it is associated with the specific prompt version used (FR-025).
- Dependencies: FR-010, FR-025.
- Assumptions: None.
- Open Questions: None.

#### FR-023 — Submit Optional Feedback Comment

- Type: Functional
- Description: The system must allow a user to optionally include a free-text comment with their feedback.
- User/Stakeholder: Primary users.
- Priority: P1
- Source: PROBLEM §9 (step 10); RESEARCH §7 (step 10)
- Rationale: Confirmed optional field enriching the feedback signal for admin review.
- Acceptance Criteria:
  - Given a user is submitting feedback, when the comment field is present, then providing it is optional (feedback can be submitted with rating alone).
  - Given a comment is provided, when submitted, then it is stored with the associated feedback record.
- Dependencies: FR-022.
- Assumptions: None.
- Open Questions: None.

#### FR-024 — Record Which Tool Was Used (Optional)

- Type: Functional
- Description: The system must allow a user to optionally indicate which recommended tool they actually used, as part of feedback submission.
- User/Stakeholder: Primary users; administrators (recommendation quality tracking).
- Priority: P1
- Source: PROBLEM §9 (step 10); RESEARCH §3, §7 (step 10)
- Rationale: Confirmed optional field supporting evaluation of recommendation usefulness.
- Acceptance Criteria:
  - Given a user is submitting feedback, when the "tool used" field is present, then providing it is optional.
  - Given a tool is selected, when submitted, then it is stored with the feedback record.
- Dependencies: FR-022, FR-019.
- Assumptions: None.
- Open Questions: None.

#### FR-025 — Associate Feedback with Exact Prompt Version

- Type: Functional
- Description: The system must associate submitted feedback with the exact prompt version the user acted on, including capturing the underlying customization request when the version used was a customized one.
- User/Stakeholder: Administrators (content quality analysis).
- Priority: P1
- Source: PROBLEM §9 (step 10), §16, §20; RESEARCH §7 (step 10)
- Rationale: Confirmed as enabling the "what people are asking for" report — explicitly called the platform's most valuable content-planning signal.
- Acceptance Criteria:
  - Given feedback is submitted for a base prompt, when recorded, then it is linked to that base prompt/template.
  - Given feedback is submitted for a customized prompt, when recorded, then it is linked to both the base template and the specific customization request text that produced it.
- Dependencies: FR-013, FR-022.
- Assumptions: None.
- Open Questions: None.

---

### B.7 Access & Subscription

#### FR-026 — Free Browsing Without Subscription

- Type: Functional
- Description: The system must allow browsing, searching, filtering (including by model), viewing template descriptions, viewing tool recommendations, and viewing usage steps without requiring a subscription.
- User/Stakeholder: All primary users, including non-subscribers.
- Priority: P0
- Source: PROBLEM §21 (In Scope); RESEARCH §14 (Confirmed Expectations)
- Rationale: Confirmed scope boundary distinguishing what is free (discovery/evaluation) from what is paid (reading/copying the prompt, and customization).
- Acceptance Criteria:
  - Given a user has no subscription, when they browse, search, filter, and view template descriptions/recommendations/steps, then none of these actions are blocked.
  - Given a non-subscriber reaches the prompt itself, when displayed, then only the prompt text is gated (per FR-008), not the surrounding discovery and guidance content.
- Dependencies: FR-001–FR-004, FR-019–FR-021.
- Assumptions: None.
- Open Questions: None.

#### FR-027 — Require Subscription to Read/Copy the Prompt

- Type: Functional
- Description: The system must require an active subscription before a user can view the full prompt text or copy it.
- User/Stakeholder: Primary users; the business (monetization).
- Priority: P0
- Source: PROBLEM §9 (step 5), §11, §21; RESEARCH §2 (Relationship with AWA), §14
- Rationale: Confirmed core monetization gate — subscription is what pays for reading/copying prompts (PROBLEM §11).
- Acceptance Criteria:
  - Given a user has no active subscription, when they attempt to view or copy the full prompt, then the action is blocked and the blurred/subscribe experience (FR-008) is shown instead.
  - Given a user's subscription becomes active, when they revisit a prompt, then full access is granted.
- Dependencies: FR-008, FR-009.
- Assumptions: None.
- Open Questions: None.

#### FR-028 — Offer Two Subscription Plans

- Type: Functional
- Description: The system must offer subscribers a choice between a yearly subscription (₹199/yr) and a lifetime subscription (₹999), both granting the ability to read/copy prompts and to use customizations (subject to credits).
- User/Stakeholder: Subscribed primary users; the business.
- Priority: P0
- Source: PROBLEM §7 (Stakeholders), §11
- Rationale: Confirmed, explicitly priced business model detail directly stated in the source material.
- Acceptance Criteria:
  - Given a non-subscriber chooses to subscribe, when presented with options, then both a yearly (₹199) and a lifetime (₹999) plan are offered.
  - Given either plan is purchased, when active, then it grants the same prompt-reading/copying access described in FR-009/FR-010.
- Dependencies: FR-044 (payment provider).
- Assumptions: None.
- Open Questions: Whether the yearly plan auto-renews or requires manual renewal is explicitly undecided (PROBLEM §18, §19 Q7).

#### FR-029 — No Shareable Link Exposing a Paid Prompt

- Type: Functional
- Description: The system must not provide a mechanism to generate a shareable link or export that exposes a subscriber-only prompt to a non-subscriber.
- User/Stakeholder: The business (revenue protection); subscribers (fairness of the paywall).
- Priority: P1
- Source: PROBLEM §11, §21 (Out of Scope: "AWA does not provide a share link that exposes a paid prompt to non-subscribers.")
- Rationale: Confirmed, deliberate design decision to prevent the paid prompt from reaching non-payers.
- Acceptance Criteria:
  - Given a subscriber views a full prompt, when looking for sharing options, then no feature exists to generate a link that would show the full prompt to a non-subscriber.
  - Given the constraint is enforced, when reviewed, then it applies uniformly across templates and customized versions.
- Dependencies: None.
- Assumptions: None.
- Open Questions: None.

#### FR-030 — Enforce Single Active Device Session

- Type: Functional
- Description: The system must restrict a subscriber's account to being signed in on a limited number of devices at a time, such that a new sign-in affects an existing session.
- User/Stakeholder: Subscribed primary users; the business (account-sharing prevention).
- Priority: P1
- Source: PROBLEM §15, §18; RESEARCH §11
- Rationale: Confirmed constraint stated directly in the source material, framed as "a real trade-off, not a free win."
- Acceptance Criteria:
  - Given a subscriber is signed in on one device, when they sign in on another device, then the system applies the configured device-limit policy (see Open Question for exact count).
  - Given the device limit is reached, when a new sign-in occurs, then the user is informed of the restriction rather than failing silently.
- Dependencies: None.
- Assumptions: None.
- Open Questions: Whether the limit is one device or two devices is explicitly undecided (PROBLEM §11, §18, §19 Q8).

---

### B.8 Customization & Credits (Monetization of the AI Rewrite)

#### FR-031 — Grant Free Customization Allotment to New Subscribers

- Type: Functional
- Description: The system must grant each new subscriber a starting allotment of free customization credits upon subscribing.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §11, §18, §19 (Q3)
- Rationale: Confirmed that a free allotment exists as a product decision; exact size is explicitly undecided.
- Acceptance Criteria:
  - Given a user subscribes, when their account is activated, then they receive a starting balance of free customization credits.
  - Given the free allotment is exhausted, when a customization is attempted, then the behavior described in FR-018 applies.
- Dependencies: FR-016, FR-043.
- Assumptions: None.
- Open Questions: The exact number of free customizations (5 or 10) is explicitly undecided (PROBLEM §11, §18, §19 Q3). Whether credits expire is also explicitly undecided (PROBLEM §11, §18, §19 Q3) — `Target: TBD` for both.

#### FR-032 — Purchase Additional Credit Packs

- Type: Functional
- Description: The system must allow a subscriber to purchase additional customization credits in packs once their free/existing balance is exhausted or low.
- User/Stakeholder: Subscribed primary users; the business.
- Priority: P1
- Source: PROBLEM §11, §18, §19 (Q9)
- Rationale: Confirmed second monetization mechanism, deliberately separated from subscription revenue to protect unit economics.
- Acceptance Criteria:
  - Given a subscriber wants more credits, when they choose to buy a pack, then a purchase flow is available via the configured payment provider.
  - Given a purchase completes, when confirmed, then the credit balance is updated accordingly.
- Dependencies: FR-018, FR-044.
- Assumptions: None.
- Open Questions: Final credit pack sizes and prices are explicitly undecided pending confirmation of true AI cost-per-customization (PROBLEM §11, §18, §19 Q1, Q9). Whether non-subscribers may purchase credits at all is also explicitly undecided (PROBLEM §11, §18, §19 Q4).

#### FR-033 — Never Block Reading/Copying Due to Credit Balance

- Type: Functional
- Description: The system must ensure that a zero or low credit balance never prevents a user from reading or copying the currently available prompt text; only the customization action is affected.
- User/Stakeholder: Subscribed primary users.
- Priority: P0
- Source: RESEARCH §10 (Scenario C), §11, §14
- Rationale: Confirmed design principle protecting the core, already-paid-for value (reading/copying) from being affected by the separate credits system.
- Acceptance Criteria:
  - Given a subscriber has zero credits, when they view or copy their current prompt (base or last successful customization), then the action succeeds without restriction.
  - Given credits are exhausted, when the user interacts with anything other than the Customize action, then no functionality other than Customize is restricted.
- Dependencies: FR-009, FR-010, FR-018.
- Assumptions: None.
- Open Questions: None.

#### FR-034 — Single Credit Charge Regardless of Input Method

- Type: Functional
- Description: The system must charge exactly one credit for a customization attempt regardless of whether the request was typed or spoken, even though voice input incurs an additional speech-to-text service cost.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §15
- Rationale: Confirmed, explicit design decision "so as not to confuse users with two charges for one action."
- Acceptance Criteria:
  - Given a user submits a voice-based customization request, when it completes successfully, then only one credit is deducted, matching the charge for a typed request.
  - Given the underlying cost includes both AI rewriting and speech-to-text, when billed internally, then this is not reflected as a separate user-facing charge.
- Dependencies: FR-012, FR-013, FR-016.
- Assumptions: None.
- Open Questions: None.

---

### B.9 Content Management (Administration of Catalog and Prompt Content)

#### FR-035 — Manage Categories and Subcategories

- Type: Functional
- Description: The system must allow an administrator to create, edit, reorganize, and remove categories and subcategories, to unlimited depth, without developer involvement.
- User/Stakeholder: Platform/content administrators.
- Priority: P0
- Source: PROBLEM §7, §15, §21; RESEARCH §1, §2
- Rationale: Without this capability, no browsable catalog (FR-001) can exist; this is foundational to the entire product.
- Acceptance Criteria:
  - Given an administrator is authoring the catalog, when they create a category or subcategory at any depth, then it becomes available for user browsing.
  - Given an administrator edits or removes a category/subcategory, when saved, then the change is reflected in what users see.
- Dependencies: None.
- Assumptions: None.
- Open Questions: None.

#### FR-036 — Manage Templates and Base Prompts

- Type: Functional
- Description: The system must allow an administrator to author, edit, publish, and remove templates, each consisting of finished, ready-to-use prompt text (not fields/blanks).
- User/Stakeholder: Platform/content administrators.
- Priority: P0
- Source: PROBLEM §7, §16, §21; RESEARCH §2
- Rationale: Confirmed authorship model — every base prompt a user sees is entirely hand-written by an admin; this is a foundational content-management capability.
- Acceptance Criteria:
  - Given an administrator authors a template, when published, then its finished prompt text becomes visible to users per FR-007/FR-008.
  - Given an administrator edits a published template's prompt, when saved, then users subsequently see the updated text.
  - Given a template uses no guided input fields/placeholders, when authored, then the system does not require or expose such fields (this mechanism has been removed from the product).
- Dependencies: FR-035.
- Assumptions: None.
- Open Questions: None.

#### FR-037 — Assign AI Tool(s)/Model(s) to Templates

- Type: Functional
- Description: The system must allow an administrator to tag a template with one or more AI tools/models it is written for, with the ability to assign this once and have it inherit down the category tree.
- User/Stakeholder: Platform/content administrators.
- Priority: P0
- Source: PROBLEM §7, §16, §19
- Rationale: This tagging is what powers both tool/model recommendations (FR-019) and the model filter (FR-003); without it neither can function correctly.
- Acceptance Criteria:
  - Given an administrator tags a template or category with a model, when saved, then templates within that scope inherit the tag unless overridden.
  - Given a template's tags change, when saved, then recommendation (FR-019) and filtering (FR-003) results reflect the update.
- Dependencies: FR-036, FR-038.
- Assumptions: None.
- Open Questions: None.

#### FR-038 — Manage AI Tool/Model Master List

- Type: Functional
- Description: The system must allow an administrator to maintain a master list of AI tools and their specific models (e.g., Runway Gen-3, Sora, Pika 1.5), including adding, editing, and retiring entries.
- User/Stakeholder: Platform/content administrators.
- Priority: P0
- Source: PROBLEM §7, §15, §21
- Rationale: Confirmed ongoing maintenance need, since external tools/models change or are retired over time.
- Acceptance Criteria:
  - Given an administrator adds a new tool/model, when saved, then it becomes available for template tagging (FR-037) and recommendation.
  - Given an administrator retires a tool/model, when saved, then it is no longer offered in new recommendations, without requiring a code change.
- Dependencies: None.
- Assumptions: None.
- Open Questions: None.

#### FR-039 — Manage Usage Steps and Videos

- Type: Functional
- Description: The system must allow an administrator to author and edit short usage steps and, optionally, attach a short instructional video, per template or tool.
- User/Stakeholder: Platform/content administrators.
- Priority: P1
- Source: PROBLEM §7, §9 (step 8), §21
- Rationale: Confirmed content-management need to support FR-020/FR-021.
- Acceptance Criteria:
  - Given an administrator authors usage steps for a template/tool, when saved, then they display to users per FR-020.
  - Given an administrator attaches or removes a video, when saved, then availability of the video updates for users per FR-021.
- Dependencies: FR-036, FR-038.
- Assumptions: None.
- Open Questions: None.

#### FR-040 — Manage Languages/Translations

- Type: Functional
- Description: The system must allow an administrator to manage supported languages and translated content.
- User/Stakeholder: Platform/content administrators; primary users (non-English speakers).
- Priority: P1
- Source: PROBLEM §7, §21
- Rationale: Confirmed admin responsibility listed among catalog/content controls.
- Acceptance Criteria:
  - Given an administrator adds a supported language, when content is translated, then users can access that content in the added language.
  - Given translated content is incomplete for a language, when a user requests it, then the system does not fail; it falls back in a defined manner (mechanism not specified in source).
- Dependencies: FR-036.
- Assumptions: None.
- Open Questions: Fallback behavior for incomplete translations is not specified in the source material.

#### FR-041 — View Aggregated Customization-Request Reports

- Type: Functional
- Description: The system must provide administrators with an aggregated view of user customization requests, to identify what content/templates are systematically insufficient.
- User/Stakeholder: Platform/content administrators.
- Priority: P1
- Source: PROBLEM §9 (step 10), §14, §16
- Rationale: Explicitly called out in the source material as the platform's most valuable report, closing the content feedback loop.
- Acceptance Criteria:
  - Given customization requests have been recorded, when an administrator views the report, then requests are aggregated in a way that surfaces common/recurring requests.
  - Given a base prompt receives recurring similar customization requests, when reviewed, then the administrator can identify it as a candidate for revision or for splitting into a new template.
- Dependencies: FR-025.
- Assumptions: None.
- Open Questions: How frequently admins are expected to review this report, and what workflow converts findings into new templates, is not specified (PROBLEM §19 Q14; RESEARCH §15).

#### FR-042 — Configure Standing AI Rewriting Instruction

- Type: Functional
- Description: The system must allow an administrator to define and update the standing instruction given to the outside AI service that governs how it rewrites prompts during customization.
- User/Stakeholder: Platform/content administrators.
- Priority: P1
- Source: PROBLEM §7, §16, §18
- Rationale: Confirmed admin-panel control over the customization engine's behavior.
- Acceptance Criteria:
  - Given an administrator edits the standing rewriting instruction, when saved, then subsequent customization requests (FR-013) use the updated instruction.
  - Given no instruction has been set, when a customization is attempted, then the system does not fail (a default/fallback exists, though its content is not specified in source).
- Dependencies: FR-013, FR-043.
- Assumptions: None.
- Open Questions: How quality/consistency of the rewriting instruction is validated across templates is not addressed in the source material (RESEARCH §15).

---

### B.10 Administration

#### FR-043 — Configure Customization Engine Controls

- Type: Functional
- Description: The system must allow an administrator to configure the customization engine's operational parameters: on/off (globally or per category), number of free customizations granted, credit pack definitions, monthly AI spending cap, and whether voice input is enabled.
- User/Stakeholder: Platform/content administrators.
- Priority: P1
- Source: PROBLEM §7, §15, §16
- Rationale: Confirmed admin control set directly protecting the business from uncontrolled AI-service cost exposure.
- Acceptance Criteria:
  - Given an administrator disables customization for a category, when a user in that category views a prompt, then the Customize action is not offered.
  - Given an administrator sets a monthly spending cap, when that cap is reached, then new customization attempts are blocked platform-wide (or for the affected scope) while base prompt access continues (NFR-003).
  - Given an administrator disables voice input, when a user opens customization, then only typed input is offered.
- Dependencies: FR-011–FR-018, FR-031–FR-034.
- Assumptions: None.
- Open Questions: What a user sees when the monthly spending cap is reached is not specified (PROBLEM §18, §19 Q5).

#### FR-044 — Manage Payment Provider Settings

- Type: Functional
- Description: The system must allow an administrator to configure payment provider settings, supporting Razorpay at launch and allowing additional providers to be added later without a rebuild.
- User/Stakeholder: Platform/content administrators; the business.
- Priority: P1
- Source: PROBLEM §7, §15, §21
- Rationale: Confirmed constraint and admin capability directly stated in the source material.
- Acceptance Criteria:
  - Given Razorpay is configured, when a user subscribes or buys credits, then payment is processed through Razorpay.
  - Given an administrator adds a new payment provider, when configured, then it becomes available for transactions without requiring a system rebuild.
- Dependencies: FR-028, FR-032.
- Assumptions: None.
- Open Questions: None.

#### FR-045 — Configure Non-Subscriber Prompt Visibility Rule

- Type: Functional
- Description: The system must allow an administrator to control whether non-subscribers see a blurred prompt preview or a hard block when they reach a paywalled prompt.
- User/Stakeholder: Platform/content administrators.
- Priority: P1
- Source: PROBLEM §18 (explicitly undecided); RESEARCH §11 (documents blur as current confirmed flow, per PROBLEM §9)
- Rationale: The source material shows a confirmed current flow (blur, PROBLEM §9) alongside an explicit statement that this choice is undecided (PROBLEM §18). This requirement is included as a configuration point rather than hard-coding either behavior, given the unresolved status. See Conflict C-1 (Section E).
- Acceptance Criteria:
  - Given the administrator sets the visibility rule to "blurred preview," when a non-subscriber views a paywalled prompt, then FR-008 behavior applies.
  - Given the administrator sets the visibility rule to "hard block," when a non-subscriber views a paywalled prompt, then no prompt text (blurred or otherwise) is shown, only a subscribe call-to-action.
- Dependencies: FR-008.
- Assumptions: This requirement assumes the resolution will be admin-configurable rather than fixed; the source material does not confirm this assumption, only that the choice itself is undecided.
- Open Questions: Which behavior (or whether both, via configuration) is correct is unresolved (PROBLEM §18, §19 Q6).

#### FR-046 — Save/Favourite a Template

- Type: Functional
- Description: The system must allow a user to save a template as a favourite for quick return access.
- User/Stakeholder: Primary users.
- Priority: P2
- Source: RESEARCH §8 (Before vs. After Comparison, "Reusability... favourites let a user save a template")
- Rationale: Confirmed (FACT) that favourites exist as a feature, though it is a secondary convenience rather than core to the primary value delivery flow.
- Acceptance Criteria:
  - Given a user is viewing a template, when they mark it as a favourite, then it appears in a favourites list they can return to.
  - Given a user removes a favourite, when saved, then it no longer appears in that list.
- Dependencies: FR-005.
- Assumptions: None.
- Open Questions: Whether favourites require a subscription to use is not specified in the source material.

---

## C. Non-Functional Requirements

#### NFR-001 — Privacy of User-Provided Data

- Type: Non-Functional
- Category: Privacy
- Description: The system must appropriately protect user-provided data, including customization request text (typed or transcribed from voice) and account/subscription information. Customization request text is user-authored free-text content that is transmitted to an external AI service provider as part of fulfilling FR-013; users must be informed, in an appropriate and timely manner, that their customization request text may be transmitted to an external provider. The appropriate form and timing of this disclosure must be determined before launch.
- User/Stakeholder: All primary users.
- Priority: P0
- Source: PROBLEM §7 (outside AI/speech-to-text providers handle user-submitted text), §11 (account/subscription data); RESEARCH §1; SECURITY §4, §7
- Rationale: Customization requests are user-authored content that leave AWA's own infrastructure and are processed by a third-party AI provider. Users have a reasonable expectation of understanding where their input goes. The specific technical controls for handling this content are implementation details covered in the Security Review and AI Design documents; this requirement establishes only that a disclosure determination must be made at the product level before launch.
- Acceptance Criteria:
  - Given a user submits a customization request, when transmitted to the outside AI service, then only the data necessary for the rewrite is shared.
  - Given account data is stored, when accessed, then access is limited to what is necessary for account and subscription management.
  - Given the product is prepared for launch, when reviewed, then a decision has been made on what users are told about the transmission of their customization request text to an external provider, and that disclosure is in place.
- Target: TBD (no specific privacy controls, retention periods, or compliance regime are specified in the source material; the disclosure decision is an explicit open question).
- Dependencies: FR-013, FR-028.
- Assumptions: None.
- Open Questions: What specific privacy/data-handling policies apply, what users are told about their customization request text being transmitted to an external provider, and when/how that disclosure is made are not addressed in the source material and must be decided before launch.

#### NFR-002 — Security of Payment Transactions

- Type: Non-Functional
- Category: Security
- Description: The system must securely process subscription and credit-pack payments through the configured payment provider(s).
- User/Stakeholder: Subscribed primary users; the business.
- Priority: P0
- Source: PROBLEM §7, §15, §21 (Razorpay at launch)
- Rationale: Payment processing is a confirmed part of the product; secure handling is a baseline expectation for any monetized transaction.
- Acceptance Criteria:
  - Given a user completes a payment, when processed, then it is routed through the configured payment provider using that provider's standard secure transaction mechanism.
  - Given a payment fails, when this occurs, then the user is informed and no partial/ambiguous charge state results.
- Target: TBD (no specific security standard, e.g., PCI-DSS scope, is specified in the source material).
- Dependencies: FR-028, FR-032, FR-044.
- Assumptions: None.
- Open Questions: None beyond Target: TBD.

#### NFR-003 — Core Functionality Independent of the Outside AI Service

- Type: Non-Functional
- Category: Reliability
- Description: Browsing, template selection, base prompt display, tool/model recommendations, usage guidance, and prompt copying must continue to function even if the outside AI rewriting service (or the speech-to-text service) is unavailable, slow, or over its configured spending cap.
- User/Stakeholder: All primary users.
- Priority: P0
- Source: PROBLEM §15 (explicit constraint: customization "is explicitly designed as optional so the 'core product' ... keeps working even if the outside AI service is down, slow, or over budget")
- Rationale: This is a directly and explicitly stated constraint in the source material, not an inference.
- Acceptance Criteria:
  - Given the outside AI rewriting service is unavailable, when a user browses, selects a template, views the base prompt, sees recommendations/steps, or copies the prompt, then all of these actions succeed normally.
  - Given only the Customize action is affected, when the AI service is unavailable, then the system communicates this specifically for that action rather than presenting a general error.
- Target: Core functionality listed above must have zero dependency on the outside AI service's availability.
- Dependencies: FR-007, FR-009, FR-010, FR-013, FR-019, FR-020.
- Assumptions: None.
- Open Questions: None.

#### NFR-004 — Customization Response Time

- Type: Non-Functional
- Category: Performance
- Description: A customization request should return a rewritten prompt to the user within a short, human-perceptible waiting period.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §9 (step 6: "returns a rewritten prompt a few seconds later"); RESEARCH §7 (step 6)
- Rationale: The source material states an approximate expectation ("a few seconds") as part of the confirmed flow description, though this is descriptive rather than a formally committed service-level target.
- Acceptance Criteria:
  - Given a customization request is submitted, when processed under normal conditions, then the user receives a rewritten prompt or a clear failure/timeout indication within a short waiting period.
  - Given the wait exceeds an acceptable threshold, when this occurs, then the attempt is treated as a timeout per FR-017 (no credit charged).
- Target: Approximately "a few seconds," as descriptively stated in the source material; no formal numeric SLA is defined. `Target: TBD` for a precise, committed figure.
- Dependencies: FR-013, FR-017.
- Assumptions: None.
- Open Questions: What numeric timeout threshold constitutes a "timeout" for FR-017 purposes is not specified.

#### NFR-005 — AI Cost Exposure Control

- Type: Non-Functional
- Category: Reliability / Cost Control
- Description: The system must prevent the cumulative cost of outside AI rewriting (and speech-to-text) calls from exceeding an administrator-configured monthly spending cap.
- User/Stakeholder: The business; platform administrators.
- Priority: P0
- Source: PROBLEM §11 (explicit unit-economics concern: "A ₹199 yearly subscriber who customizes 500 times would cost more than they paid"), §15, §21
- Rationale: This is an explicitly stated, business-critical constraint driving the entire credits/spending-cap design; without it the confirmed monetization model is not sustainable.
- Acceptance Criteria:
  - Given a monthly spending cap is configured, when cumulative AI-service spend approaches or reaches that cap, then the system prevents further customization calls from being made (globally or per configured scope).
  - Given the cap is reached, when reached, then core functionality (NFR-003) is unaffected.
- Target: TBD (the cap value itself, and behavior shown to users at the cap, are explicitly undecided — PROBLEM §18, §19 Q5).
- Dependencies: FR-013, FR-043.
- Assumptions: None.
- Open Questions: What the monthly cap should be, and what the user sees when it is reached, are explicitly open (PROBLEM §19 Q5).

#### NFR-006 — Consistent Credit Metering Across Input Methods

- Type: Non-Functional
- Category: Compatibility
- Description: The credit-metering behavior must be identical regardless of whether a customization request originates from typed or spoken input.
- User/Stakeholder: Subscribed primary users.
- Priority: P1
- Source: PROBLEM §15
- Rationale: Directly stated design intent to avoid confusing users with inconsistent charges for functionally equivalent actions.
- Acceptance Criteria:
  - Given a typed and a spoken customization request produce equivalent outcomes, when each completes, then both consume exactly one credit.
  - Given the system displays credit balance changes, when either input method is used, then the same UI/behavior applies.
- Target: 100% metering consistency between input methods.
- Dependencies: FR-012, FR-034.
- Assumptions: None.
- Open Questions: None.

#### NFR-007 — No Prompt-Writing Skill Required

- Type: Non-Functional
- Category: Usability
- Description: The end-to-end flow (template selection through customization) must not require the user to know prompt-writing technique or syntax; all interactions must be possible through category/template selection and plain-language descriptions.
- User/Stakeholder: Primary users, especially those with limited AI experience.
- Priority: P0
- Source: PROBLEM §1, §3, §10; RESEARCH §2, §3, §12
- Rationale: This is the central, repeatedly confirmed value proposition of the entire product — not an inferred nicety.
- Acceptance Criteria:
  - Given a user has never written an AI prompt before, when they use the base prompt, then no prompt-writing input is required from them at all.
  - Given a user wants to adjust the prompt, when they use Customize, then they provide their request in plain language, not prompt syntax.
- Target: TBD (no measurable usability target, e.g., task success rate for prompt-writing novices, is defined in the source material).
- Dependencies: FR-007, FR-011, FR-012.
- Assumptions: None.
- Open Questions: None beyond Target: TBD.

#### NFR-008 — Content Maintainable Without Developer Involvement

- Type: Non-Functional
- Category: Maintainability
- Description: Administrators must be able to create, update, and remove catalog content, prompts, tool/model assignments, and customization-engine configuration without requiring code changes or developer involvement.
- User/Stakeholder: Platform/content administrators.
- Priority: P0
- Source: PROBLEM §15, §21; RESEARCH §2
- Rationale: Explicitly stated constraint: categories/subcategories/templates remain configurable "without developer involvement," and payment providers are addable "without a rebuild."
- Acceptance Criteria:
  - Given an administrator needs to add, edit, or remove content (categories, templates, tools/models, steps, languages), when they do so through the admin panel, then no code deployment is required.
  - Given an administrator adds a new payment provider, when configured, then no rebuild is required.
- Target: Zero developer/code-change dependency for the listed content and configuration operations.
- Dependencies: FR-035–FR-044.
- Assumptions: None.
- Open Questions: None.

#### NFR-009 — Feedback/Version Data Integrity

- Type: Non-Functional
- Category: Data Integrity
- Description: The link between a feedback submission and the exact prompt version (base or customized, including the originating customization request) it refers to must remain accurate and must not be altered after the fact.
- User/Stakeholder: Platform/content administrators (report accuracy); primary users (trust in the feedback mechanism).
- Priority: P1
- Source: PROBLEM §9 (step 10), §16; RESEARCH §7 (step 10)
- Rationale: The confirmed value of the customization-request report (FR-041) depends entirely on this linkage remaining accurate.
- Acceptance Criteria:
  - Given feedback is recorded for a specific prompt version, when later queried, then it continues to reference that exact version and (if applicable) customization request text.
  - Given a base prompt is edited by an admin after feedback was submitted on an earlier version, when the report is viewed, then historical feedback is not silently reattributed to the edited version.
- Target: No data loss or misattribution of feedback-to-version linkage.
- Dependencies: FR-025, FR-036, FR-041.
- Assumptions: None.
- Open Questions: None.

#### NFR-010 — Payment Provider Extensibility

- Type: Non-Functional
- Category: Compatibility
- Description: The system must support adding new payment providers beyond the launch provider (Razorpay) through administrator configuration.
- User/Stakeholder: Platform administrators; the business.
- Priority: P2
- Source: PROBLEM §7, §15, §21
- Rationale: Explicitly stated as a future-facing constraint ("other providers addable later via the admin panel without a rebuild"); lower priority because it is not required for initial launch, which confirms only Razorpay.
- Acceptance Criteria:
  - Given a new payment provider needs to be added post-launch, when configured by an administrator, then it becomes usable for transactions.
  - Given the launch provider is Razorpay, when the system ships initially, then no other provider is required to be functional at that time.
- Target: TBD (no specific list of future providers is defined in the source material).
- Dependencies: FR-044.
- Assumptions: None.
- Open Questions: None.

#### NFR-011 — Administrator Operations Require Independent Server-Side Authorization

- Type: Non-Functional
- Category: Security
- Description: Every administrative operation — including category and template management, prompt authoring, tool/model management, usage content management, translation management, customization engine configuration, AI rewriting instruction configuration, and payment provider management — must require an authenticated Administrator identity. Authorization must be enforced independently on the server for every such operation. Concealing administrative screens or routes in the user interface is not a substitute for server-side authorization.
- User/Stakeholder: Platform administrators; the business (data and content integrity).
- Priority: P0
- Source: SECURITY §1, §2; PROBLEM §7 (Administrator role)
- Rationale: Administrator operations control every piece of paid catalog content, pricing, and AI customization configuration. Limiting access to the UI layer only — hiding admin routes — is not sufficient authorization. Each operation must verify the Administrator identity at the point where the operation is performed, independently of whatever routing or navigation restrictions are in place.
- Acceptance Criteria:
  - Given a request reaches any administrator operation endpoint, when it is processed, then the system independently verifies an authenticated Administrator session before performing the operation.
  - Given no valid Administrator session is present, when any administrative operation is attempted, then the operation is rejected, regardless of how the request arrived or what the UI has shown to the requester.
  - Given administrative screens or routes are hidden from non-administrator users in the UI, when this is considered, then it is treated as a usability measure only, not as an authorization control.
- Target: Zero administrative operations that rely solely on UI-level hiding for access control.
- Dependencies: FR-035–FR-044.
- Assumptions: None.
- Open Questions: The process for creating the first Administrator account is not defined in the source material (see Section E, Conflict C-7).

#### NFR-012 — Authentication and Session Boundary

- Type: Non-Functional
- Category: Security
- Description: Protected operations must require an authenticated session. The system must verify the authenticated identity server-side for every protected request. Client-supplied values — including user identifiers, subscription status, and Administrator status — must not be trusted as an authorization input.
- User/Stakeholder: All authenticated users; platform administrators.
- Priority: P0
- Source: SECURITY §1, §2; PROBLEM §7, §11
- Rationale: The system has two distinct protected identities (User/subscriber and Administrator), and protected content (prompt text, customization capability, administrator operations) must be accessible only to correctly authenticated and authorized principals. Accepting client-supplied authorization claims instead of verifying them server-side creates a bypass path for every protected operation in the system. How session tokens are stored and transmitted is a technical implementation detail covered in the Security Review; the requirement here is that the server-side verification boundary exists and is applied.
- Acceptance Criteria:
  - Given a request arrives for a protected operation, when it is processed, then the system verifies the caller's authenticated identity server-side before proceeding.
  - Given a request includes a client-supplied claim of subscription status or Administrator status, when the authorization check runs, then the system uses its own authoritative record of that status, not the client-supplied claim.
  - Given an unauthenticated request arrives for a protected operation, when it is processed, then the operation is rejected.
- Target: No protected operation that accepts client-supplied authorization claims in place of server-side verification.
- Dependencies: FR-009, FR-010, FR-013, FR-027, FR-035–FR-044, NFR-011.
- Assumptions: None.
- Open Questions: None at requirements level; implementation choices (session mechanism, token handling) are covered in the technical documents.

---

## D. Candidate Requirements — Requires Validation

These are potentially valuable but are **not** confirmed requirements. Each is unsupported by a confirmed problem/need/outcome in PROBLEM or RESEARCH, or is explicitly marked ASSUMPTION/UNKNOWN in the source material. They must not be treated as in-scope until validated.

| Candidate ID | Proposed Requirement | Why It May Be Useful | Supporting Assumption | Information Needed to Validate |
|---|---|---|---|---|
| CR-001 | Persistent prompt/customization history beyond the current session (not just favourites) | Would let users return to past customization work across sessions/devices | Users want to revisit past customizations, not just favourite templates | RESEARCH §15, §18: whether this is wanted is an explicit open question; no confirmed user need exists yet |
| CR-002 | Differentiated guidance/onboarding for beginners vs. experienced users (e.g., experienced users skip templates and go straight to a free-form request) | Could reduce friction for experienced users and increase support for beginners | Beginners and experienced users need meaningfully different levels of help | PROBLEM §4, §17: explicitly marked ASSUMPTION, "not confirmed by user research" |
| CR-003 | Defined handling for vague, ambiguous, or self-contradictory customization requests (e.g., clarifying prompts, rejection with guidance) | Could improve customization success rate and avoid wasted credits | Users will sometimes submit unclear requests that a raw AI rewrite may handle poorly | RESEARCH §11: explicitly marked UNKNOWN, "not addressed in the source material" |
| CR-004 | Defined fallback behavior when no AI tool/model is configured for a template | Prevents a dead-end in the recommendation step (FR-019) | Some templates may exist without a configured recommendation | RESEARCH §11: explicitly marked UNKNOWN; a prior product draft addressed this but it is not restated as confirmed in current source |
| CR-005 | In-flow help for judging whether the base prompt is "good enough" before spending a credit on customization | Could reduce wasted credits and improve satisfaction | Users cannot judge prompt quality without trying it externally | RESEARCH §13 (User Decision Points): identified as a real decision point, but no mechanism is confirmed in the source |
| CR-006 | Accessibility support beyond voice input (visual, motor, hearing, cognitive accessibility) | Would broaden usability for users with additional accessibility needs | Users with these needs are part of the target audience | RESEARCH §12: explicitly marked UNKNOWN, "not addressed anywhere in `01-PROBLEM.md`" |
| CR-007 | A free trial of the prompt-reading experience before requiring subscription | Could increase conversion by letting users experience value before paying | Trial access would meaningfully affect conversion | PROBLEM §18: raised only as an undecided policy question, not a confirmed requirement |
| CR-008 | Richer "success" measurement beyond thumbs up/down (e.g., structured outcome categories) | Could produce more actionable content-quality data than binary feedback | Thumbs up/down alone may not capture what "success" means to users | RESEARCH §15, §18: explicitly marked UNKNOWN what determines a "successful" prompt beyond thumbs up/down |
| CR-009 | Retry a customization attempt without consuming an additional credit when the result technically succeeded but did not satisfy the user | Could reduce user frustration around a "succeeded but unsatisfying" outcome | Users distinguish between a failed rewrite and a rewrite that succeeded but wasn't what they wanted | RESEARCH §11: explicitly marked UNKNOWN whether this distinction is handled |
| CR-010 | Non-subscriber credit purchase (customization access without a reading subscription) | Could open a secondary revenue path | Some users might want customization without full subscription | PROBLEM §11, §18: explicitly undecided, with a stated recommendation of "no" |

---

## E. Requirement Conflicts / Clarifications Needed

#### C-1 — Blurred Preview vs. Hard Block for Non-Subscribers

- What conflicts: PROBLEM §9 and RESEARCH §7 describe the confirmed flow as "non-subscribers see it blurred with a Subscribe prompt" (stated as FACT). However, PROBLEM §18 and RESEARCH §11 both explicitly list "blurred preview vs. hard block for non-subscribers" as an undecided open question.
- Where it occurs: PROBLEM §9 (flow) vs. PROBLEM §18 (open questions); RESEARCH §7 vs. RESEARCH §11 and §14.
- Why it matters: FR-008 and FR-045 depend on knowing whether blur is the final confirmed behavior or merely the current placeholder assumption pending a decision.
- What needs to be clarified: Whether the blurred-preview behavior described as FACT in the flow sections is the finalized product decision, or whether it remains subject to change pending resolution of the open question in PROBLEM §18/§19 Q6.

#### C-2 — Device Session Limit: One vs. Two

- What conflicts: PROBLEM §15 states a confirmed constraint ("Session constraint: one device signed in at a time (or possibly two — still explicitly undecided)"), mixing a stated default with an acknowledged unresolved variant.
- Where it occurs: PROBLEM §15, §18, §19 (Q8); RESEARCH §11.
- Why it matters: FR-030's acceptance behavior (what happens on a second sign-in) cannot be fully specified until this is resolved.
- What needs to be clarified: Whether the launch policy is strictly one device, or whether two devices will be supported.

#### C-3 — Free Customization Allotment Size

- What conflicts: The product confirms a free-customization mechanism exists (PROBLEM §11, §18), but two candidate values (5 or 10) are both presented without a decision.
- Where it occurs: PROBLEM §18, §19 (Q3).
- Why it matters: FR-031's acceptance criteria and NFR-005's cost-control target cannot be finalized until this number, and whether credits expire, are set.
- What needs to be clarified: The exact free-customization count and expiry policy.

#### C-4 — Requirement-Detail Gap Created by Removing Guided Fields

- What conflicts: The product previously let users specify "how much detail" via guided input fields; this mechanism has been removed in favor of free-form customization requests (PROBLEM §7, "updated" note). However, RESEARCH §4 flags "not knowing how much detail to provide" and "not knowing which information matters to a given tool/model" as gaps with **no replacement mechanism described**.
- Where it occurs: PROBLEM §7 (change note) vs. RESEARCH §4 (Prompt Creation, Requirement Definition).
- Why it matters: It is unclear whether the base prompt alone is expected to fully replace the need for user-provided detail, or whether users are now expected to supply missing detail entirely through Customize (which is optional and paid via credits).
- What needs to be clarified: Whether "detail sufficiency" is considered fully solved by admin-authored base prompts, or whether a gap remains that the current confirmed requirements (FR-007–FR-018) do not close.

#### C-5 — Non-Subscriber Credit Purchase Recommendation vs. Undecided Status

- What conflicts: PROBLEM §18 states a recommendation of "no" for whether non-subscribers can buy credits, but also lists this as "not decided."
- Where it occurs: PROBLEM §18.
- Why it matters: FR-032's scope (subscriber-only vs. open to all) depends on this being finalized; a recommendation is not the same as a confirmed decision.
- What needs to be clarified: Whether the "no" recommendation should be treated as the launch decision or remains genuinely open.

#### C-6 — Subscription Lapse: Access Behavior Is Undefined

- What conflicts: FR-009 and FR-010 require that protected prompt content be available only to users with an active subscription, and that a lapsed subscription must not continue to grant access. However, the specific behavior a user experiences when their subscription lapses — what they see, whether they are immediately reverted to the non-subscriber state, and what happens to a session that was active at the moment of lapse — is explicitly undecided in the source material (PROBLEM §11, §18).
- Where it occurs: PROBLEM §11, §18, §19 (Q7); FR-009 (Open Questions); FR-028 (Open Questions on auto-renewal).
- Why it matters: The authorization requirement (access must reflect current entitlement, not a cached state) is clear and not open, but the user-facing behavior that fulfills it in each lapse scenario — mid-session lapse, lapse before a customization request, return visit after lapse — must be decided before the access control can be specified in full.
- What needs to be clarified: (1) What a user sees mid-session if their subscription lapses. (2) What happens to any in-progress or queued customization request at the moment of lapse. (3) What a returning user with a lapsed subscription sees when they open a previously accessible prompt.

#### C-7 — First Administrator Account Provisioning Is Undefined

- What conflicts: Administrator capabilities are defined across FR-035–FR-044 and FR-043, and those capabilities require an authenticated Administrator identity. However, the process by which the first Administrator account is created is not defined anywhere in the source material (SECURITY §1 flags this as "an open gap").
- Where it occurs: SECURITY §1; PROBLEM §7 (Stakeholders, Administrator).
- Why it matters: Without a controlled provisioning process, the initial Administrator account cannot be created safely. A public "create admin" registration endpoint would be a critical vulnerability — it must not exist.
- What needs to be clarified: The provisioning process for the first Administrator account must be defined before build. It must be a controlled, non-public mechanism. No self-registration endpoint for administrators may exist.

---

## F. Out-of-Scope Requirements

The following are explicitly excluded from AWA's product boundary per PROBLEM §21 and must not be treated as requirements at this stage:

- Building or hosting AWA's own generative AI model for producing the final creative output (image, video, website, presentation, or poster).
- AWA automatically generating the final creative output itself (this remains the responsibility of the external AI tool — see Section H, AWA-Specific Product Boundary).
- Teaching a full course on AI creation.
- Allowing users to submit their own templates (would require a review/approval workflow that is not confirmed as in scope).
- One-click "run this on the AI tool for me" automation on an external platform.
- A whole-project mode bundling a full project's prompts.
- More than two subscription plans, team accounts, or coupons at this stage.
- Comparing results across different AI tools (would require storing user-generated outputs, which is deliberately not done).
- A share link or export that exposes a paid prompt to non-subscribers (see also FR-029, which formalizes this as a negative requirement).

---

## G. AWA-Specific Product Boundary

Preserved throughout this specification, per PROBLEM §1, §10, §21 and RESEARCH §1, §9:

```
User
  ↓
AWA
  ├── Helps identify the appropriate creation workflow (FR-001–FR-006)
  ├── Serves an instant, admin-authored base prompt (FR-007–FR-010)
  ├── Optionally refines that prompt via an outside AI service (FR-011–FR-018)
  ├── Recommends relevant AI tools/models (FR-019)
  └── Provides usage guidance (FR-020–FR-021)
        ↓
External AI Platform (outside AWA's control; AWA does not operate or guarantee it)
        ↓
Final Generated Output (image, video, website, presentation, poster — produced entirely outside AWA)
```

**AWA Responsibilities:** Catalog/template presentation; base prompt authorship and delivery; the customization request/response cycle with the outside AI rewriting service; tool/model recommendation; usage guidance; feedback collection; subscription and credit management; admin content and configuration tools.

**External AI Tool/Model Provider Responsibilities:** Actually generating the final creative output from the prompt the user pastes in; the availability, pricing, and behavior of their own service (outside AWA's control, per PROBLEM §15's confirmed statement that tools/models "can change or be retired over time").

**Outside AI Rewriting / Speech-to-Text Service Provider Responsibilities:** Performing the prompt rewrite and voice transcription when a user requests a customization (PROBLEM §7). Provider identity is UNKNOWN and explicitly flagged as an urgent open question.

**User Responsibilities:** Selecting a category/template or starting blank; describing desired changes in their own words if using Customize; copying the resulting prompt and using it on the external AI tool of their choice; optionally returning to provide feedback.

---

## H. Requirement Traceability Matrix

| Requirement ID | Requirement (Short Name) | Source | Problem/User Need | Priority |
|---|---|---|---|---|
| FR-001 | Browse categories/subcategories | PROBLEM §9, §21; RESEARCH §7 | Discovery burden / scattered information | P0 |
| FR-002 | Search/filter templates | PROBLEM §9; RESEARCH §7 | Discovery burden | P0 |
| FR-003 | Filter templates by AI model | PROBLEM §1, §2, §4, §9, §13; RESEARCH §4, §9, §13 | Model-level mismatch | P1 |
| FR-004 | View template details pre-selection | PROBLEM §21; RESEARCH §14 | Informed template selection before paywall | P1 |
| FR-005 | Select a template | PROBLEM §9; RESEARCH §7 | Core journey transition to prompt delivery | P0 |
| FR-006 | Start without a template ("blank") | PROBLEM §9 | Alternative path when no template fits | P1 |
| FR-007 | Display finished prompt instantly | PROBLEM §1, §9, §16; RESEARCH §7 | Not knowing what to write as a prompt | P0 |
| FR-008 | Blurred preview for non-subscribers | PROBLEM §9; RESEARCH §7, §11, §14 | Monetization of prompt access | P0 |
| FR-009 | View full prompt (subscribers) | PROBLEM §9, §11; RESEARCH §2, §14 | Core paid deliverable | P0 |
| FR-010 | Copy prompt text | PROBLEM §1, §9; RESEARCH §3, §7 | Acting on the prompt externally | P0 |
| FR-011 | Request change (typed) | PROBLEM §1, §9, §16; RESEARCH §3, §7 | Close-but-not-quite-right prompt | P1 |
| FR-012 | Request change (voice) | PROBLEM §1, §6, §9, §15; RESEARCH §2, §12 | Mobile-first usage | P1 |
| FR-013 | AI rewrite via outside service | PROBLEM §1, §9, §16, §21; RESEARCH §7 | Prompt refinement without skill | P1 |
| FR-014 | Revert to original prompt | PROBLEM §9; RESEARCH §7, §11, §14 | Safeguard against destructive edits | P1 |
| FR-015 | Session history of versions | PROBLEM §9; RESEARCH §7, §11 | Iterative refinement | P1 |
| FR-016 | Charge one credit per attempt | PROBLEM §9, §11; RESEARCH §7 | Unit economics protection | P1 |
| FR-017 | No charge on failure/timeout | PROBLEM §9; RESEARCH §7, §11, §14 | Fairness safeguard | P1 |
| FR-018 | Redirect to credit purchase at zero balance | RESEARCH §10, §11, §14 | Clear next action when blocked | P1 |
| FR-019 | Recommend AI tools/models | PROBLEM §1, §9, §10; RESEARCH §3, §7 | Tool/model selection difficulty | P0 |
| FR-020 | Provide usage steps | PROBLEM §1, §4, §9, §10; RESEARCH §4, §7 | Not knowing how to use the tool | P0 |
| FR-021 | Provide optional video | PROBLEM §9; RESEARCH §7 | Alternative guidance format | P1 |
| FR-022 | Submit thumbs up/down | PROBLEM §9; RESEARCH §3, §7 | Feedback signal loop | P1 |
| FR-023 | Optional feedback comment | PROBLEM §9; RESEARCH §7 | Richer feedback signal | P1 |
| FR-024 | Record tool used | PROBLEM §9; RESEARCH §3, §7 | Recommendation quality tracking | P1 |
| FR-025 | Associate feedback with exact prompt version | PROBLEM §9, §16, §20; RESEARCH §7 | Content-planning report | P1 |
| FR-026 | Free browsing without subscription | PROBLEM §21; RESEARCH §14 | Evaluate before paying | P0 |
| FR-027 | Subscription required for full prompt | PROBLEM §9, §11, §21; RESEARCH §2, §14 | Monetization gate | P0 |
| FR-028 | Two subscription plans | PROBLEM §7, §11 | Confirmed business model | P0 |
| FR-029 | No shareable link for paid prompt | PROBLEM §11, §21 | Revenue protection | P1 |
| FR-030 | Enforce device session limit | PROBLEM §15, §18; RESEARCH §11 | Account-sharing prevention | P1 |
| FR-031 | Free customization allotment | PROBLEM §11, §18, §19 | Onboarding value for customization | P1 |
| FR-032 | Purchase credit packs | PROBLEM §11, §18, §19 | Secondary monetization | P1 |
| FR-033 | Never block reading due to credits | RESEARCH §10, §11, §14 | Protect already-paid-for value | P0 |
| FR-034 | Single credit charge across input methods | PROBLEM §15 | Avoid user confusion over charges | P1 |
| FR-035 | Manage categories/subcategories | PROBLEM §7, §15, §21; RESEARCH §1, §2 | Foundational catalog authorship | P0 |
| FR-036 | Manage templates/base prompts | PROBLEM §7, §16, §21; RESEARCH §2 | Foundational content authorship | P0 |
| FR-037 | Assign tools/models to templates | PROBLEM §7, §16, §19 | Powers recommendations + model filter | P0 |
| FR-038 | Manage AI tool/model master list | PROBLEM §7, §15, §21 | Keep recommendations current | P0 |
| FR-039 | Manage usage steps/videos | PROBLEM §7, §9, §21 | Content for FR-020/FR-021 | P1 |
| FR-040 | Manage languages/translations | PROBLEM §7, §21 | Confirmed admin control | P1 |
| FR-041 | View customization-request reports | PROBLEM §9, §14, §16 | Content gap identification | P1 |
| FR-042 | Configure standing AI rewriting instruction | PROBLEM §7, §16, §18 | Customization engine control | P1 |
| FR-043 | Configure customization engine controls | PROBLEM §7, §15, §16 | Cost/behavior control | P1 |
| FR-044 | Manage payment provider settings | PROBLEM §7, §15, §21 | Confirmed payment constraint | P1 |
| FR-045 | Configure non-subscriber visibility rule | PROBLEM §18; RESEARCH §11 | Unresolved blur-vs-block decision | P1 |
| FR-046 | Save/favourite a template | RESEARCH §8 | Confirmed reusability feature | P2 |
| NFR-001 | Privacy of user-provided data | PROBLEM §7, §11; RESEARCH §1 | Baseline data protection | P0 |
| NFR-002 | Security of payment transactions | PROBLEM §7, §15, §21 | Baseline transaction protection | P0 |
| NFR-003 | Core functionality independent of AI service | PROBLEM §15 | Explicit reliability constraint | P0 |
| NFR-004 | Customization response time | PROBLEM §9; RESEARCH §7 | Stated "a few seconds" expectation | P1 |
| NFR-005 | AI cost exposure control | PROBLEM §11, §15, §21 | Explicit business-critical cost risk | P0 |
| NFR-006 | Consistent credit metering across input methods | PROBLEM §15 | Avoid user confusion | P1 |
| NFR-007 | No prompt-writing skill required | PROBLEM §1, §3, §10; RESEARCH §2, §3, §12 | Central value proposition | P0 |
| NFR-008 | Content maintainable without developer involvement | PROBLEM §15, §21; RESEARCH §2 | Explicit maintainability constraint | P0 |
| NFR-009 | Feedback/version data integrity | PROBLEM §9, §16; RESEARCH §7 | Report accuracy dependency | P1 |
| NFR-010 | Payment provider extensibility | PROBLEM §7, §15, §21 | Future-facing confirmed constraint | P2 |
| NFR-011 | Administrator operations require independent server-side authorization | SECURITY §1, §2; PROBLEM §7 | Admin access control integrity | P0 |
| NFR-012 | Authentication and session boundary | SECURITY §1, §2; PROBLEM §7, §11 | Server-side authorization for all protected operations | P0 |

---

## I. Requirements Summary

### Functional Requirements
- Total: 46
- P0: 17 — FR-001, FR-002, FR-005, FR-007, FR-008, FR-009, FR-010, FR-019, FR-020, FR-026, FR-027, FR-028, FR-033, FR-035, FR-036, FR-037, FR-038
- P1: 28
- P2: 1 — FR-046

### Non-Functional Requirements
- Total: 12
- P0: 8 — NFR-001, NFR-002, NFR-003, NFR-005, NFR-007, NFR-008, NFR-011, NFR-012
- P1: 3 — NFR-004, NFR-006, NFR-009
- P2: 1 — NFR-010

### Candidate Requirements
10 candidate requirements identified (CR-001 through CR-010), spanning persistent history, differentiated user guidance, ambiguous-input handling, tool/model fallback behavior, in-flow "is this good enough" guidance, broader accessibility, free trials, richer success metrics, retry-without-charge handling, and non-subscriber credit purchase. None are confirmed; all require validation before entering scope (Section D).

### Critical Open Questions
(Consolidated from PROBLEM §19 and RESEARCH §16, as they directly block finalizing acceptance criteria/targets above.)
1. What does a single AI customization cost in provider fees, and which AI rewriting and speech-to-text providers will be used? (Blocks NFR-005 target and FR-032 pricing.)
2. Is the core user problem now primarily tool/model discovery, base-prompt creation, or prompt refinement — and does this differ by category? (Affects relative investment across FR-002/FR-003 vs. FR-011–FR-018.)
3. How many free customizations should a subscriber receive, and do credits expire? (Blocks FR-031 acceptance criteria.)
4. Should non-subscribers be able to purchase credits, and should free trial credits be subscriber-only? (Blocks FR-032 scope; relates to CR-010.)
5. What is an appropriate monthly AI spending cap, and what should users see when it is reached? (Blocks NFR-005 target and FR-043 behavior.)
6. Should non-subscribers see a blurred preview or a hard block? (Conflict C-1; blocks FR-008/FR-045 finalization — noting that either form is acceptable, but the full prompt text must not be delivered to the non-subscriber's client regardless of form.)
7. Should the yearly plan auto-renew or require manual renewal? (Blocks FR-028 acceptance criteria.)
8. Should account access allow one device or two? (Conflict C-2; blocks FR-030 acceptance criteria.)
9. Do users genuinely struggle to articulate prompt-refinement requests, validating the investment in the customization engine? (Validates FR-011–FR-018 as currently prioritized.)
10. Do users understand and accept the subscription-vs-credits distinction, or does it cause confusion? (Validates the overall monetization design underlying FR-027–FR-034.)
11. What is the specific behavior when a subscription lapses — mid-session, at the point of a customization request, and on a returning visit? (Conflict C-6; blocks full specification of FR-009 and FR-013 for the lapse scenario.)
12. What is the controlled provisioning process for the first Administrator account, and when will it be defined? (Conflict C-7; must be resolved before build. No public self-registration endpoint for administrators may be created as a placeholder.)

### Major Dependencies
- **Outside AI rewriting service provider** — not yet selected; FR-013, FR-042, NFR-004, NFR-005 all depend on this choice and its cost/latency characteristics.
- **Speech-to-text service provider** — not yet selected; FR-012, FR-034 depend on this.
- **Payment provider (Razorpay)** — required for FR-028, FR-032, FR-044.
- **Admin-authored content** — nearly all user-facing functional requirements (FR-001–FR-021) depend on content existing via FR-035–FR-042; AWA has no user value without administrator content authorship.
- **Resolution of open business-policy questions** (Section I, Critical Open Questions 1–8) — several acceptance criteria cannot be made fully specific until these are resolved.

### Major Risks
- **Unit economics risk:** Without a known per-customization AI cost (Open Question 1), credit pricing (FR-032) and the spending cap (NFR-005) cannot be set correctly, risking the exact scenario the source material warns about — heavy customization use costing more than a subscriber paid (PROBLEM §11).
- **User confusion risk:** The subscription/credits split is explicitly named as a risk the business must actively manage ("users must never be confused about which is which," PROBLEM §13) — this is not yet validated with users (RESEARCH §16, Critical Question 2).
- **Unvalidated core premise risk:** The customization engine's entire justification — that users can't articulate prompt-refinement requests themselves — is a confirmed *product decision* but an unconfirmed *user-research finding* (PROBLEM §4, §17; RESEARCH §16, Critical Question 1). If usage is low, a meaningful share of P1 requirements (FR-011–FR-018, FR-031–FR-034) may be over-built relative to actual need.
- **Content-authorship bottleneck risk:** Because every base prompt is entirely hand-authored (FR-036) with no user-fillable fields, catalog breadth and quality are fully bottlenecked on administrator throughput, with no confirmed process for managing this at scale beyond the customization-report feedback loop (FR-041).
- **Provider dependency risk:** Two required external providers (AI rewriting, speech-to-text) are unselected, leaving cost, latency (NFR-004), and reliability (NFR-003) partly unverifiable until providers are chosen.

---

## J. Final Validation Checklist

- [x] Every requirement has a unique ID (FR-001–FR-046, NFR-001–NFR-012, CR-001–CR-010).
- [x] Every requirement is classified as Functional or Non-Functional (or explicitly Candidate).
- [x] Every requirement has a priority (P0/P1/P2).
- [x] Every requirement has acceptance criteria.
- [x] Every requirement identifies its user/stakeholder.
- [x] Every confirmed requirement has a cited source.
- [x] Assumptions are labeled as such, not presented as facts (see individual "Assumptions" fields and Section D).
- [x] Unknown information is marked `Target: TBD` or as an Open Question rather than fabricated.
- [x] No technology stack, architecture, database design, or API design is specified anywhere in this document.
- [x] AWA's boundary from external AI generation platforms is preserved throughout (Section G).
- [x] All requirements are derived from PROBLEM and RESEARCH; none are invented.
- [x] Unsupported ideas are placed under Candidate Requirements (Section D), not the confirmed requirement list.
- [x] Contradictions are explicitly identified (Section E).

**This document is the requirements baseline for AWA. Per the defined scope, work stops here — no feature specification, user stories, UX/UI design, wireframes, architecture, database design, API design, technology selection, or implementation planning is undertaken.**