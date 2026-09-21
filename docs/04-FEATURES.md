# AWA — Product Feature Definition

**Status:** Baseline feature specification, derived exclusively from `docs/01-PROBLEM.md` (PROBLEM), `docs/02-USER-RESEARCH.md` (RESEARCH), and `docs/03-REQUIREMENTS.md` (REQUIREMENTS) — with one noted exception in Section A.10 (see the callout there).
**Scope of this document:** *What product capabilities* AWA requires to satisfy its confirmed requirements. No UX flows, screens, wireframes, architecture, database, API, or technology decisions are made here.
**Traceability rule:** Every confirmed feature maps to at least one requirement ID in REQUIREMENTS. A feature not traceable to a confirmed requirement is placed under **Candidate Features — Requires Validation** (Section D) and is not part of confirmed scope.

```text
Problem → User Need → Requirement → Feature
```

---

## A. Confirmed Features

### A.1 Discovery, Categories & Templates

#### FEAT-001 — Category & Subcategory Browsing

- Type: User-facing
- Requirement(s): FR-001
- Problem Solved: Users don't know where to start; AI creation use cases are scattered/unorganized (PROBLEM §2, §13 "Organization").
- User/Stakeholder: Primary user (all users, including non-subscribers).
- Goal: Locate a category/subcategory relevant to the creation task the user has in mind.
- Priority: P0
- Description: Presents AWA's catalog as a browsable hierarchy of categories and subcategories (unlimited depth), letting a user navigate from a broad creation type (e.g., Image Generation) down to a more specific area.
- Input: User navigation action (select category/subcategory); existing admin-authored catalog structure.
- Processing / Behavior: User opens AWA → sees top-level categories → selects one → sees its subcategories (if any) → repeats until reaching a level containing templates.
- Output: A navigable list of categories/subcategories; ultimately, a set of templates to choose from (hands off to FEAT-002/FEAT-004).
- Dependencies: FEAT-029 (admin-authored category structure must exist for this feature to have content).
- Acceptance Criteria:
  - Given the catalog has categories and subcategories, when a user opens AWA, then the top-level categories are visible without requiring sign-in or subscription.
  - Given a user selects a category with subcategories, when selected, then the next level is shown.
  - Given a category/subcategory has no content yet, when opened, then the user is informed rather than shown a blank or broken screen.
- Assumptions: None.
- Open Questions: None.

#### FEAT-002 — Template Discovery & Filtering

- Type: User-facing
- Requirement(s): FR-002, FR-004
- Problem Solved: Difficulty finding a template relevant to the specific need within a category; discovery burden (PROBLEM §2, §13).
- User/Stakeholder: Primary user (including non-subscribers).
- Goal: Narrow down to a specific, relevant template using search/filter attributes, and preview it before committing.
- Priority: P0
- Description: Lets a user search and/or filter templates within a category using attributes such as tag, style, mood, or difficulty, and view a template's description before selecting it — all without requiring a subscription.
- Input: User search text and/or filter selections; existing template metadata (tags, style, mood, difficulty, description).
- Processing / Behavior: User applies a search term or filter → matching templates are shown → user opens a template's details to read its description before deciding to select it.
- Output: A filtered/searched list of templates; a template detail view (description, tags, associated tool/model) available pre-selection.
- Dependencies: FEAT-001 (category context); FEAT-030 (admin-authored template content).
- Acceptance Criteria:
  - Given a category has multiple templates, when a filter or search term is applied, then only matching templates are shown.
  - Given no templates match, when a filter/search is applied, then the system communicates no matches were found.
  - Given a user views a template's details, when viewed, then the description is visible without requiring a subscription.
- Assumptions: None.
- Open Questions: None.

#### FEAT-003 — AI Model Filter

- Type: User-facing
- Requirement(s): FR-003
- Problem Solved: Model-level mismatch — a user with access to one AI model (e.g., Runway) wastes time on a template written for a different model (e.g., Sora) and blames the prompt for a poor result (PROBLEM §4, a directly stated failure mode).
- User/Stakeholder: Primary user, particularly video creators (RESEARCH §9, Video Creation use case).
- Goal: Find only templates written for the AI model(s) the user actually has access to.
- Priority: P1
- Description: Adds AI model as a distinct filter dimension alongside general template filters, using the model tag(s) assigned to each template.
- Input: User's selected model filter value(s); existing template-to-model tag assignments.
- Processing / Behavior: User selects a model filter (e.g., "Runway Gen-3") → only templates tagged for that model are shown; filter can be combined with other filters (FEAT-002).
- Output: A model-filtered template list.
- Dependencies: FEAT-002; FEAT-031 (admin tool/model tagging with inheritance).
- Acceptance Criteria:
  - Given templates are tagged with one or more models, when a user filters by a specific model, then only matching templates are shown.
  - Given a user clears the model filter, when cleared, then templates are no longer restricted by model.
  - Given a template is tagged for multiple models, when any of those is selected, then the template appears in results.
- Assumptions: None.
- Open Questions: None.

#### FEAT-004 — Template Selection

- Type: User-facing
- Requirement(s): FR-005
- Problem Solved: Transition from browsing to receiving a usable prompt — the central value delivery moment of AWA (PROBLEM §9).
- User/Stakeholder: Primary user.
- Goal: Commit to a specific template as the basis for the prompt they will use.
- Priority: P0
- Description: Lets a user select a template from a browsed/filtered list, moving them into the prompt-viewing experience.
- Input: User's selection of a specific template.
- Processing / Behavior: User selects a template → AWA loads that template's associated base prompt and hands off to FEAT-006/FEAT-007.
- Output: The selected template becomes the active context for the prompt view.
- Dependencies: FEAT-001, FEAT-002; FEAT-006/FEAT-007 (next step).
- Acceptance Criteria:
  - Given a user has browsed to a template, when selected, then the associated prompt view loads.
  - Given a user selects a different template afterward, when selected, then the new template's prompt replaces the prior one (no merging).
- Assumptions: None.
- Open Questions: None.

#### FEAT-005 — Blank Start Option

- Type: User-facing
- Requirement(s): FR-006
- Problem Solved: No existing template fits the user's specific need.
- User/Stakeholder: Primary user, particularly experienced users.
- Goal: Begin the AWA flow without an existing template.
- Priority: P1
- Description: Offers an alternative entry point to the flow that does not require selecting a pre-made template, as confirmed in AWA's stated step-4 flow ("selects a template (or starts blank)").
- Input: User's choice to start without a template.
- Processing / Behavior: User selects "start blank" instead of a template → AWA proceeds along the remainder of the flow (recommendation, guidance, feedback) in a manner consistent with the templated path, to the extent supported.
- Output: A blank-start path into the remaining flow.
- Dependencies: None known beyond the general flow.
- Acceptance Criteria:
  - Given a user cannot find a suitable template, when they choose "start blank," then they are not blocked from proceeding.
  - Given a blank start is chosen, when the user continues, then subsequent features (recommendation, guidance, feedback) remain reachable.
- Assumptions: The exact content/interaction shown on the "blank" path is not detailed in the source material beyond its existence.
- Open Questions: What content or interaction the "blank" path specifically presents is not specified in PROBLEM/RESEARCH (carried over from REQUIREMENTS FR-006 Open Questions).

---

### A.2 Prompt Access

#### FEAT-006 — Instant Base Prompt Display

- Type: User-facing / System-supported
- Requirement(s): FR-007
- Problem Solved: Users don't know what to write as a prompt (PROBLEM §2–§4); this is AWA's core zero-effort value proposition.
- User/Stakeholder: Primary user.
- Goal: Receive a usable, expert-quality prompt immediately, with no effort and no waiting.
- Priority: P0
- Description: Upon template selection, delivers the appropriate prompt content based on the user's access level — with no intermediate form and no AI processing step. A subscriber receives the full, finished, admin-authored prompt text. A non-subscriber receives only the safe preview or locked representation they are authorized to see (FEAT-007). The same admin-authored text is the source for every user of a given template, but only authorized users receive it in full.
- Input: Selected template (from FEAT-004); user's current authorization state.
- Processing / Behavior: Template selected → user's access level is determined → subscriber: the full finished prompt text is returned to the subscriber's client → non-subscriber: only the safe preview or locked representation is returned (full text is not included in the response). This path involves no AI service call.
- Output: For a subscriber: the base prompt text, ready for viewing (FEAT-008) and later copying (FEAT-009). For a non-subscriber: a safe preview or locked representation (FEAT-007).
- Dependencies: FEAT-004; FEAT-030 (admin-authored prompt content must exist); FEAT-023 (access determination).
- Acceptance Criteria:
  - Given a template is selected, when the prompt view loads, then the finished prompt appears without any requirement-gathering form.
  - Given the requesting user is a subscriber, when the prompt is loaded, then the full base prompt text is returned to that subscriber.
  - Given the requesting user is not a subscriber, when the prompt is loaded, then the full base prompt text is not returned; only the safe preview or locked representation is returned.
  - Given the base prompt requires no AI generation, when displayed, then it remains available even if the outside AI rewriting service is unavailable.
  - Given two subscribers open the same template and neither has customized it, when displayed, then both see identical base prompt text.
- Assumptions: None.
- Open Questions: None.

#### FEAT-007 — Safe Preview / Paywall State for Non-Subscribers

- Type: User-facing
- Requirement(s): FR-008
- Problem Solved: Non-subscribers need to evaluate whether AWA is relevant before paying, while AWA must protect full prompt access behind a subscription (PROBLEM §9, §11).
- User/Stakeholder: Non-subscribed primary users.
- Goal: Understand what subscribing unlocks, without the full prompt text being accessible to unauthorized users.
- Priority: P0
- Description: When a non-subscriber reaches the prompt view, presents a safe preview or locked representation of the prompt — paired with a clear subscribe call-to-action — without including the complete base prompt text in the response. The exact visual form (a blurred appearance, a hard block, or another safe representation) is a product/UX decision that remains open (see FEAT-039 and REQUIREMENTS Conflict C-1); what is not open is that the full prompt text must not be delivered to a non-subscriber's client, regardless of the form chosen. Inspecting the browser response at any point must not expose the protected prompt.
- Input: User's authorization state (not subscribed); the selected template's safe preview or locked state.
- Processing / Behavior: Non-subscriber reaches the prompt view → the system returns only the safe preview or locked representation, not the full prompt text → a subscribe call-to-action is shown alongside it.
- Output: A safe preview or locked representation with a subscribe call-to-action; full prompt text is not present in the response. Upon subscribing, transition to FEAT-008.
- Dependencies: FEAT-006 (access-aware prompt loading); FEAT-023 (subscription paywall enforcement); FEAT-039 (admin configuration of the visual form of this state).
- Acceptance Criteria:
  - Given a user has no active subscription and requests a template's prompt, when the response is returned, then the complete prompt text is not included in the response.
  - Given a non-subscriber views the prompt state, when displayed, then only the safe preview or locked representation is shown, along with a visible subscribe call-to-action.
  - Given a user subscribes, when they return to the same prompt, then the full text becomes available (FEAT-008).
  - Given the non-subscriber state is in use, when a browser response is inspected, then the full protected prompt text is not recoverable from it.
- Assumptions: None.
- Open Questions: The specific visual form of the non-subscriber state — blurred appearance, hard block, or another safe representation — is unresolved. See REQUIREMENTS Conflict C-1 and FEAT-039. The form is a product/UX decision; all valid forms must follow the same rule: the complete prompt text is not returned to an unauthorized client.

#### FEAT-008 — Full Prompt View

- Type: User-facing
- Requirement(s): FR-009
- Problem Solved: Delivering the core paid value of AWA — a complete, readable, expert-quality prompt.
- User/Stakeholder: Subscribed primary users.
- Goal: Read the complete prompt text to evaluate and use it.
- Priority: P0
- Description: Delivers the full, unobscured prompt text (base or currently active customized version) to users whose subscription is confirmed as active at the time of the request. Full prompt access is determined by the system's current record of subscription status — not by client-supplied state. A lapsed subscription must not continue to receive the full prompt. The client cannot grant itself subscription access.
- Input: User's current authorization state (verified as an active subscriber); active prompt version (base or customized).
- Processing / Behavior: User requests a prompt → the system verifies the user has an active subscription at that moment → if confirmed: the full text of the currently active version is returned → if not confirmed (not subscribed, or subscription lapsed): the full text is not returned and the user receives the non-subscriber state (FEAT-007).
- Output: Fully readable prompt text (for an authorized subscriber). Non-subscribers and lapsed subscribers do not receive this output.
- Dependencies: FEAT-006; FEAT-023.
- Acceptance Criteria:
  - Given a user has an active subscription, when they request a prompt, then the full text is returned and displayed.
  - Given a user is not subscribed, when they request a prompt, then the full text is not returned, regardless of any client-side state indicating otherwise.
  - Given a user's subscription has lapsed, when they request a prompt, then the full text is not returned; the system treats the request as if the user is not subscribed.
  - Given the active version is a customization (FEAT-012), when displayed, then the full customized text is what is shown to the authorized subscriber.
- Assumptions: None.
- Open Questions: The specific behavior and user-facing message when a subscription lapses mid-session is unresolved (REQUIREMENTS Conflict C-6).

#### FEAT-009 — Prompt Copy

- Type: User-facing
- Requirement(s): FR-010
- Problem Solved: The user needs to take the prompt out of AWA and into the external AI tool.
- User/Stakeholder: Subscribed primary users.
- Goal: Get the exact prompt text they are authorized to view into a form they can paste elsewhere.
- Priority: P0
- Description: Lets a subscriber copy the currently displayed prompt (base or customized) for use outside AWA. Copy access follows the same authorization boundary as viewing the full prompt — a user can copy only what they have been authorized to receive. A disabled or hidden Copy button is not the authorization control; the protection is that unauthorized users never receive the full prompt text to begin with (FEAT-006/FEAT-007/FEAT-008).
- Input: Currently displayed prompt text (already delivered to the authorized subscriber); user's copy action.
- Processing / Behavior: Authorized subscriber triggers copy → the exact currently displayed text is made available to paste externally. Zero customization credits do not affect reading or copying.
- Output: Prompt text available for external use.
- Dependencies: FEAT-008 (full prompt text must already have been authorized for delivery); FEAT-016 (copy must remain available even with zero customization credits).
- Acceptance Criteria:
  - Given a subscriber is authorized to view the full prompt (FEAT-008), when they copy it, then the exact displayed text (including any active customization) is made available for external use.
  - Given a user has not been authorized to receive the full prompt text, when the copy action is considered, then it is not available regardless of UI state.
  - Given a subscriber has zero customization credits, when they copy the existing prompt, then copying still succeeds.
- Assumptions: None.
- Open Questions: None.

---

### A.3 Prompt Customization

#### FEAT-010 — Typed Customization Request

- Type: User-facing
- Requirement(s): FR-011
- Problem Solved: The base prompt is close but not exactly right, and the user cannot rewrite it themselves without prompt-writing skill (PROBLEM §4, §10).
- User/Stakeholder: Subscribed primary users.
- Goal: Describe, in their own words, a change they want made to the prompt.
- Priority: P1
- Description: Provides a text input where a subscriber types a plain-language description of a desired change to the currently displayed prompt. The typed request is user-provided content and is treated as such. Before the request proceeds to rewriting (FEAT-012), the system verifies that the user is authenticated, has an active subscription, is authorized to access the specific template being customized, and has sufficient usage entitlement remaining.
- Input: Subscriber's free-text change request (user-provided content); the currently active prompt; the user's current authorization state.
- Processing / Behavior: Subscriber opens Customize → types a request → submits it → the system verifies all four conditions (authenticated, active subscription, template access, available usage entitlement) → if all conditions are met, the request is passed to the rewrite process (FEAT-012); if any condition fails, the request does not proceed to FEAT-012.
- Output: A validated, authorized change request ready for AI rewriting (on success), or an appropriate response indicating why the request cannot proceed (on failure).
- Dependencies: FEAT-008 (must be viewing a full prompt they are authorized for); FEAT-012; FEAT-015 (credit/usage check).
- Acceptance Criteria:
  - Given a subscriber is viewing a prompt they are authorized to access and has usage entitlement, when they open Customize and submit a typed request, then the request is passed to the rewrite process.
  - Given any of the four conditions is not met (not authenticated, no active subscription, not authorized for the template, or no usage entitlement), when a request is submitted, then it does not proceed to FEAT-012.
- Assumptions: None.
- Open Questions: How the system should handle a request that is very vague, extremely detailed, ambiguous, or self-contradictory is not addressed in the source material.

#### FEAT-011 — Voice Customization Request

- Type: User-facing
- Requirement(s): FR-012
- Problem Solved: Typing a detailed change request is harder on a phone; most AWA users are expected to be mobile (PROBLEM §6, the one confirmed audience signal).
- User/Stakeholder: Subscribed primary users, particularly mobile users.
- Goal: Speak a desired change instead of typing it.
- Priority: P1
- Description: Offers a voice-input alternative to typing on the customization step, transcribing spoken input into the same request pathway as typed input. Voice input is user-provided content and is treated as such. The same four authorization checks that apply to typed requests (FEAT-010) apply equally to voice requests: authenticated, active subscription, authorized for the specific template, and available usage entitlement — all verified before the transcribed request proceeds to rewriting. Voice input does not bypass or reduce the authorization requirements.
- Input: Subscriber's spoken change request (audio, user-provided); admin setting for whether voice input is enabled (FEAT-037).
- Processing / Behavior: Subscriber selects voice input → speaks the request → the request is transcribed → the same four authorization conditions are verified → if all conditions are met, the transcribed text proceeds through the same pathway as a typed request (FEAT-010/FEAT-012).
- Output: A transcribed, authorized change request, functionally equivalent to a typed one.
- Dependencies: FEAT-010 (shares the downstream pathway and authorization model); FEAT-012; FEAT-015 (single-credit metering per FR-034); FEAT-037 (admin voice on/off toggle); an outside speech-to-text service.
- Acceptance Criteria:
  - Given a subscriber is on the customization step, voice input is enabled, and all four authorization conditions are met, when they choose to speak, then their speech is captured, transcribed, and proceeds through the rewrite pathway.
  - Given the transcription completes, when processed, then it proceeds through the same rewrite pathway as a typed request, consuming the same single credit.
  - Given any of the four authorization conditions is not met, when a voice request is submitted, then it does not proceed to FEAT-012, just as a typed request would not.
  - Given an administrator has disabled voice input, when a subscriber opens Customize, then voice input is not offered.
- Assumptions: None.
- Open Questions: Which speech-to-text provider will be used is unresolved (PROBLEM §7, §18).

#### FEAT-012 — AI Prompt Rewrite Engine

- Type: System-supported / User-facing (result)
- Requirement(s): FR-013
- Problem Solved: An admin cannot anticipate every variation a user might want; the user needs their described change turned into working prompt wording without needing prompt-writing skill.
- User/Stakeholder: Subscribed primary users (result); platform administrators (cost exposure).
- Goal: Turn a plain-language change request into a rewritten, ready-to-use prompt.
- Priority: P1
- Description: Sends the currently active prompt together with the user's change request to an outside AI rewriting service, and returns the resulting rewritten prompt to the user. The user's customization request is user-provided content and is treated as such — not as a trusted system instruction. Before calling the AI provider, the system verifies all of the following: (1) the user is authenticated; (2) the user has an active subscription; (3) the user is authorized to access the specific template being customized; (4) the user has sufficient usage entitlement remaining. A request that fails any of these conditions must not result in a call to the AI provider. The resulting AI output is treated as plain text and does not overwrite the original admin-authored base prompt — both remain accessible (FEAT-013).
- Input: Active prompt text; user's change request (typed or transcribed, treated as user-provided content); the admin-configured standing rewriting instruction (FEAT-036); current authorization state; available usage entitlement.
- Processing / Behavior: Change request submitted → all four authorization conditions are verified → if any condition fails, the request is rejected without calling the AI provider → if all conditions pass, the active prompt and the change request are sent to the outside AI service, guided by the standing rewriting instruction → service returns a rewritten prompt → the rewritten prompt is displayed as the new active version alongside the original; credit deduction is handled by FEAT-015 upon success.
- Output: A rewritten prompt, displayed as the new active version alongside the recoverable original (FEAT-013); credit deduction on success (FEAT-015).
- Dependencies: FEAT-010/FEAT-011; FEAT-013 (revert must remain available); FEAT-014 (version history); FEAT-015; FEAT-036; an outside AI rewriting service (provider UNKNOWN).
- Acceptance Criteria:
  - Given all four conditions are met and a valid change request is present, when submitted, then the system sends the authorized prompt and the change request to the outside AI service and displays the rewritten result.
  - Given any of the four authorization conditions is not met, when a request is evaluated, then it is rejected and the AI provider is not called.
  - Given the outside AI service is slow, down, or over its spending cap, when a customization is attempted, then base prompt browsing/reading/copying continues to function even if the rewrite itself is unavailable.
  - Given a rewrite is returned, when displayed, then it is shown alongside the original, which remains accessible via FEAT-013.
- Assumptions: Whether the resulting rewrite reliably satisfies user intent is not confirmed by research.
- Open Questions: Which AI rewriting provider will be used, and what a single call costs, is explicitly the most urgent open item in the source material.

#### FEAT-013 — Revert to Original Prompt

- Type: User-facing
- Requirement(s): FR-014
- Problem Solved: Customization must never destructively lose the admin-authored base prompt.
- User/Stakeholder: Subscribed primary users.
- Goal: Return to the original prompt at any point, regardless of how many customizations have been made.
- Priority: P1
- Description: Provides a "Back to original" action that restores the admin-authored base prompt as the active version. "Original" always means the admin-authored base prompt for that template — not an earlier customized version. Reverting never modifies, replaces, or deletes the base prompt itself; it only changes which version is currently active. No customization credit is consumed for a reversion.
- Input: User's request to revert; the stored original admin-authored base prompt for the template.
- Processing / Behavior: User selects "Back to original" → the active version is set back to the unmodified admin-authored base prompt → the base prompt is not altered by this action; only the active-version state changes.
- Output: The admin-authored base prompt, restored as the active version.
- Dependencies: FEAT-006; FEAT-012; FEAT-014.
- Acceptance Criteria:
  - Given a user has customized a prompt one or more times, when they select "Back to original," then the original admin-authored text is shown as the active version.
  - Given the user reverts, when this occurs, then no credit is charged for the reversion.
  - Given the reversion completes, when reviewed, then the admin-authored base prompt content is unchanged — reverting is a view-state change, not a content modification.
- Assumptions: None.
- Open Questions: None.

#### FEAT-014 — Customization Version History

- Type: User-facing
- Requirement(s): FR-015
- Problem Solved: Users iterating on a prompt need to step back through prior attempts without losing them mid-session.
- User/Stakeholder: Subscribed primary users.
- Goal: Review or return to a previous customized version made earlier in the same session.
- Priority: P1
- Description: Retains each intermediate customized version produced during the current session, letting the user navigate between them. Version history holds **customized prompt versions only** — user-specific versions generated from authorized customization requests. The **base prompt** — the original admin-authored catalog prompt — is a separate, distinct thing and is always recoverable via FEAT-013 regardless of version history. Version history never modifies the base prompt. Each stored customization version remains associated with the correct user, session, and template context — it is not shared with other users or sessions.
- Input: Sequence of customization results produced in the session (FEAT-012).
- Processing / Behavior: Each successful customization produces a customized prompt version that is added to a session-scoped list → user can select an earlier customized version to make it active again → selecting a version does not alter the base prompt or any other stored version.
- Output: A navigable, session-scoped list of customized prompt versions, distinct from the base prompt.
- Dependencies: FEAT-012; FEAT-013.
- Assumptions: None.
- Open Questions: Whether session-scoped customization history should persist beyond the current session is unresolved — see Candidate Feature CR-001 in Section D.

#### FEAT-015 — Customization Credit Metering

- Type: System-supported
- Requirement(s): FR-016, FR-017, FR-034
- Problem Solved: Each AI rewrite call costs AWA real money; unmetered use could make a subscriber unprofitable (PROBLEM §11's explicit unit-economics concern).
- User/Stakeholder: Subscribed primary users; the business (cost protection).
- Goal: Ensure each customization attempt is fairly and consistently authorized and charged.
- Priority: P1
- Description: Verifies available usage entitlement before calling the AI provider, and deducts exactly one credit for each successfully completed customization attempt, regardless of whether it originated from typed or voice input. A failed or timed-out attempt does not result in a credit deduction. Usage entitlement is checked and reserved before the AI provider is called — not determined after the call returns. Client-side manipulation of credit balances does not affect what the system records or authorizes.
- Input: Outcome of a customization attempt (success, failure, or timeout); input method used (typed or voice); current authorized usage entitlement.
- Processing / Behavior: Customization request submitted → usage entitlement is verified before calling the AI provider → if no entitlement: request is rejected, AI provider is not called → if entitlement exists: the AI provider is called → if successful: one credit is deducted → if failed or timed-out: no deduction, previously displayed prompt is left unchanged.
- Output: An updated credit balance (on success) or an unchanged balance and prompt (on failure/timeout); no AI provider call on insufficient entitlement.
- Dependencies: FEAT-012; FEAT-027 (source of free credits); FEAT-028 (source of purchased credits).
- Acceptance Criteria:
  - Given a customization succeeds, when completed, then exactly one credit is deducted.
  - Given a customization fails or times out, when this occurs, then no credit is deducted and the prior prompt version remains displayed.
  - Given a voice-based attempt succeeds, when completed, then only one credit is deducted, matching a typed attempt.
  - Given usage entitlement is checked, when it runs, then it happens before the AI provider is called, not after.
- Assumptions: None.
- Open Questions: What numeric timeout threshold defines a "timeout" is not specified.

#### FEAT-016 — Credit Exhaustion Handling

- Type: User-facing
- Requirement(s): FR-018, FR-033
- Problem Solved: A user with no remaining credits needs a clear next action, and must never lose access to what they already have (reading/copying).
- User/Stakeholder: Subscribed primary users.
- Goal: Understand what to do when out of credits, without losing access to the current prompt.
- Priority: P0
- Description: When a subscriber's credit balance is zero, the Customize action does not trigger an AI rewrite request — neither from the UI nor from any other path. Offering "Buy credits" instead of a rewrite is a user-facing affordance, not the authorization control: the system must not call the AI provider when usage entitlement is exhausted, regardless of any UI state. Prompt reading and copying remain fully available regardless of credit balance.
- Input: Subscriber's current usage entitlement; attempted action (customize vs. read/copy).
- Processing / Behavior: Subscriber has zero credits and the Customize action is invoked → the system does not call the AI provider → a "Buy credits" prompt is offered instead. Subscriber reads or copies the prompt → this succeeds regardless of credit balance.
- Output: A "Buy credits" prompt (on zero-balance customization attempt, without an AI call) or normal read/copy access (unaffected by balance).
- Dependencies: FEAT-015; FEAT-028 (credit purchase); FEAT-008; FEAT-009.
- Acceptance Criteria:
  - Given a subscriber has zero credits, when a customization is attempted, then no AI provider call is made and a "Buy credits" prompt is shown instead.
  - Given a subscriber has zero credits, when they read or copy their current prompt, then the action succeeds without restriction.
  - Given the subscriber purchases credits, when the purchase completes, then Customize becomes available again.
- Assumptions: None.
- Open Questions: None.

---

### A.4 AI Tool Recommendation & Usage Guidance

#### FEAT-017 — AI Tool/Model Recommendation

- Type: User-facing
- Requirement(s): FR-019
- Problem Solved: Users don't know which AI tool — or which specific model — fits their task (PROBLEM §2–§4, §13).
- User/Stakeholder: Primary users.
- Goal: Know which external tool(s)/model(s) to use with the prompt they now have, and why.
- Priority: P0
- Description: Displays 1 to 3 recommended AI tools/models relevant to the active prompt (base or customized), each with a one-line reason, drawn from the tool/model tags associated with the template.
- Input: Active template and its tool/model tag(s) (from FEAT-031); active prompt version.
- Processing / Behavior: Prompt view reached → tags associated with the template are used to select up to three tool/model recommendations, each paired with a short rationale.
- Output: A short list (1–3) of recommended tools/models with rationale text.
- Dependencies: FEAT-004; FEAT-031; FEAT-032 (tool/model master list).
- Acceptance Criteria:
  - Given a template has tool/model tags, when the recommendation step is reached, then between one and three recommendations are shown, each with a one-line rationale.
  - Given a template's tag is a specific model, when recommendations are generated, then they are consistent with that tag.
  - Given no tool/model is configured for a template, when the step is reached, then the system does not fail silently.
- Assumptions: None.
- Open Questions: Expected behavior when no tool/model is configured for a given template is not addressed in the source material — see Candidate Feature CR-004.

#### FEAT-018 — Usage Steps

- Type: User-facing
- Requirement(s): FR-020
- Problem Solved: Users don't know how to use the recommended tool once they get there (PROBLEM §4, §13).
- User/Stakeholder: Primary users.
- Goal: Know what to do, step by step, once they reach the external tool.
- Priority: P0
- Description: Displays a short (4–7 step), tool-specific sequence of usage instructions alongside the recommendation.
- Input: The recommended tool/model (from FEAT-017); admin-authored step content for that tool (FEAT-033).
- Processing / Behavior: Recommendation step reached → the steps authored for the recommended tool are displayed.
- Output: A short list of usage steps specific to the recommended tool.
- Dependencies: FEAT-017; FEAT-033.
- Acceptance Criteria:
  - Given a tool is recommended, when the guidance step is reached, then a short sequence of steps specific to that tool is shown.
  - Given multiple tools are recommended, when guidance is shown, then steps are distinguishable per tool (not a single generic set).
- Assumptions: None.
- Open Questions: None.

#### FEAT-019 — Usage Video

- Type: User-facing
- Requirement(s): FR-021
- Problem Solved: Some users prefer a visual walkthrough over written steps.
- User/Stakeholder: Primary users.
- Goal: Watch a short video demonstrating tool usage, when available.
- Priority: P1
- Description: Displays a short instructional video alongside or instead of written steps, when an administrator has attached one for the relevant tool/template.
- Input: Admin-attached video (FEAT-033); the recommended tool/template context.
- Processing / Behavior: Guidance step reached → if a video exists for the context, it is made available to play alongside the written steps.
- Output: A playable short video (when available).
- Dependencies: FEAT-018; FEAT-033.
- Acceptance Criteria:
  - Given an admin has attached a video, when the guidance step is reached, then the video is available to play.
  - Given no video has been attached, when the guidance step is reached, then written steps are still shown without error.
- Assumptions: None.
- Open Questions: None.

---

### A.5 Feedback

#### FEAT-020 — Prompt Feedback Capture

- Type: User-facing
- Requirement(s): FR-022, FR-023, FR-024
- Problem Solved: AWA has no signal on whether a prompt actually worked for the user, or which tool they ended up using.
- User/Stakeholder: Primary users (submit feedback); administrators (receive signal, via FEAT-021/FEAT-035).
- Goal: Report whether the prompt they used worked, with optional detail.
- Priority: P1
- Description: Lets a user submit a thumbs up/down rating on the prompt they used, with an optional free-text comment and an optional indication of which recommended tool they actually used.
- Input: User's rating (up/down); optional comment text; optional tool-used selection.
- Processing / Behavior: User returns to AWA after using a prompt externally → submits a rating, optionally adding a comment and/or the tool they used.
- Output: A recorded feedback entry (rating, optional comment, optional tool used).
- Dependencies: FEAT-009 (user must have copied/used a prompt); FEAT-021 (linkage to the specific version).
- Acceptance Criteria:
  - Given a user has used a prompt, when they return, then they can submit a thumbs up or thumbs down.
  - Given the comment and tool-used fields are present, when submitting, then both are optional — feedback can be submitted with rating alone.
- Assumptions: None.
- Open Questions: None.

#### FEAT-021 — Feedback-to-Prompt-Version Linkage

- Type: System-supported
- Requirement(s): FR-025
- Problem Solved: Feedback is only useful for content improvement if it is tied to the exact prompt (and, if applicable, exact customization request) it refers to.
- User/Stakeholder: Platform/content administrators.
- Goal: Know exactly which prompt version — and which customization request, if any — a piece of feedback refers to.
- Priority: P1
- Description: Associates every feedback submission with the exact prompt version used: the base template, or the base template plus the specific customization request text that produced the version used.
- Input: Feedback submission (FEAT-020); the active prompt version and its origin (base vs. customized, with request text if applicable).
- Processing / Behavior: Feedback submitted → the system records which template and, if relevant, which customization request text the feedback pertains to.
- Output: Feedback records with accurate version/request linkage, feeding FEAT-035 (customization insights report).
- Dependencies: FEAT-020; FEAT-012 (source of customization request text).
- Acceptance Criteria:
  - Given feedback is submitted for a base prompt, when recorded, then it is linked to that template.
  - Given feedback is submitted for a customized prompt, when recorded, then it is linked to both the template and the specific customization request text.
- Assumptions: None.
- Open Questions: None.

---

### A.6 Access & Subscription

#### FEAT-022 — Free Browsing Access

- Type: User-facing
- Requirement(s): FR-026
- Problem Solved: Users need to evaluate whether AWA is relevant before committing to a subscription.
- User/Stakeholder: All primary users, including non-subscribers.
- Goal: Explore categories, templates, recommendations, and guidance without paying first.
- Priority: P0
- Description: Ensures browsing, searching, filtering (including by model), template descriptions, tool recommendations, and usage steps/video are all available without a subscription — only the full prompt text is gated.
- Input: None beyond normal navigation; applies as a standing access rule across FEAT-001–FEAT-005, FEAT-017–FEAT-019.
- Processing / Behavior: A non-subscriber uses any of the browsing/discovery/recommendation/guidance features → none of these are blocked; only reaching the full prompt text triggers the paywall (FEAT-023).
- Output: Full access to discovery, recommendation, and guidance content regardless of subscription status.
- Dependencies: FEAT-001–FEAT-005, FEAT-017–FEAT-019, FEAT-023.
- Acceptance Criteria:
  - Given a non-subscriber browses, searches, filters, or views template descriptions/recommendations/steps, when they do so, then none of these actions are blocked.
  - Given a non-subscriber reaches the prompt itself, when displayed, then only the prompt text is gated, not the surrounding content.
- Assumptions: None.
- Open Questions: None.

#### FEAT-023 — Subscription Paywall Enforcement

- Type: User-facing / System-supported
- Requirement(s): FR-027
- Problem Solved: AWA's core monetization depends on gating full prompt access behind a subscription (PROBLEM §11).
- User/Stakeholder: Primary users; the business.
- Goal: (User) Understand that a subscription is required to read/copy prompts. (Business) Ensure that requirement is enforced.
- Priority: P0
- Description: Requires an active subscription before a user can view the full prompt text or copy it; otherwise routes them to the blur/subscribe experience (FEAT-007).
- Input: User's subscription status.
- Processing / Behavior: User without an active subscription attempts to view/copy a full prompt → action is blocked and the blurred/subscribe experience is shown instead. User's subscription becomes active → full access is granted on return.
- Output: Either full prompt access (subscribed) or the blur/subscribe experience (not subscribed).
- Dependencies: FEAT-007, FEAT-008, FEAT-024.
- Acceptance Criteria:
  - Given a user has no active subscription, when they attempt to view or copy the full prompt, then the action is blocked and FEAT-007 is shown.
  - Given a user's subscription becomes active, when they revisit a prompt, then full access (FEAT-008) is granted.
- Assumptions: None.
- Open Questions: None.

#### FEAT-024 — Subscription Plan Selection

- Type: User-facing
- Requirement(s): FR-028
- Problem Solved: Users need a way to actually become a subscriber.
- User/Stakeholder: Primary users; the business.
- Goal: Choose and purchase a subscription plan.
- Priority: P0
- Description: Offers a choice between a yearly (₹199) and a lifetime (₹999) subscription plan, either of which grants prompt-reading/copying access and the ability to use customizations (subject to credits).
- Input: User's plan choice; payment details (handled via FEAT-038's configured provider).
- Processing / Behavior: Non-subscriber selects a plan → completes payment via the configured provider → subscription becomes active, unlocking FEAT-008/FEAT-009 and customization eligibility.
- Output: An active subscription of the chosen type.
- Dependencies: FEAT-038 (payment provider).
- Acceptance Criteria:
  - Given a non-subscriber chooses to subscribe, when presented with options, then both the yearly and lifetime plans are offered.
  - Given either plan is purchased, when active, then it grants the same prompt access described in FEAT-008/FEAT-009.
- Assumptions: None.
- Open Questions: Whether the yearly plan auto-renews or requires manual renewal is unresolved.

#### FEAT-025 — Prompt Share Protection

- Type: System-supported
- Requirement(s): FR-029
- Problem Solved: A shareable link could let the paid prompt reach non-payers, undermining the subscription model.
- User/Stakeholder: The business (revenue protection); subscribers (fairness of the paywall).
- Goal: N/A (this is a protective absence-of-feature requirement rather than a user-initiated action).
- Priority: P1
- Description: Ensures no mechanism exists anywhere in the product to generate a link or export that would expose a subscriber-only prompt to a non-subscriber.
- Input: N/A — this feature is defined by the deliberate absence of a sharing capability.
- Processing / Behavior: No share/export action is offered for full prompt text anywhere in the product, for base or customized versions.
- Output: No shareable artifact is ever produced for a paywalled prompt.
- Dependencies: FEAT-008, FEAT-012.
- Acceptance Criteria:
  - Given a subscriber views a full prompt, when looking for sharing options, then none exist that would expose the full text to a non-subscriber.
  - Given this constraint is reviewed, when checked, then it applies uniformly to base and customized prompts.
- Assumptions: None.
- Open Questions: None.

#### FEAT-026 — Device Session Limit

- Type: System-supported
- Requirement(s): FR-030
- Problem Solved: Prevents a single subscription from being shared indefinitely across many simultaneous devices (an account-sharing/revenue-protection concern).
- User/Stakeholder: Subscribed primary users; the business.
- Goal: (User) Sign in and use AWA normally on their own device(s). (Business) Prevent uncontrolled account sharing.
- Priority: P1
- Description: Restricts a subscriber's account to being actively signed in on a limited number of devices, such that a new sign-in affects an existing session per the configured policy.
- Input: Sign-in attempts and their associated device.
- Processing / Behavior: Subscriber signs in on a device → if the device limit is reached, signing in on an additional device triggers the configured restriction behavior (e.g., signing out an older session).
- Output: An enforced device-session state consistent with the configured limit.
- Dependencies: None beyond account/session state.
- Acceptance Criteria:
  - Given a subscriber is signed in on the maximum allowed number of devices, when they sign in on another, then the system applies the configured policy rather than allowing unlimited concurrent sessions.
  - Given the limit is enforced, when triggered, then the user is informed rather than experiencing a silent failure.
- Assumptions: None.
- Open Questions: Whether the limit is one device or two is explicitly undecided.

---

### A.7 Customization Monetization

#### FEAT-027 — Free Customization Allotment

- Type: System-supported
- Requirement(s): FR-031
- Problem Solved: New subscribers need a way to try customization without an immediate additional purchase.
- User/Stakeholder: Subscribed primary users.
- Goal: Use customization a few times without needing to buy credits right away.
- Priority: P1
- Description: Grants each new subscriber a starting balance of free customization credits upon subscribing.
- Input: New subscription event.
- Processing / Behavior: Subscription becomes active → a starting free-credit balance is granted to the account.
- Output: An initial non-zero credit balance for new subscribers.
- Dependencies: FEAT-024; FEAT-015; FEAT-016.
- Acceptance Criteria:
  - Given a user subscribes, when activated, then they receive a starting balance of free customization credits.
  - Given the free allotment is exhausted, when a customization is attempted, then FEAT-016 behavior applies.
- Assumptions: None.
- Open Questions: The exact number of free customizations (5 or 10) and whether they expire are both explicitly undecided.

#### FEAT-028 — Credit Pack Purchase

- Type: User-facing
- Requirement(s): FR-032
- Problem Solved: Subscribers who want more customizations than their free allotment need a way to buy more, without AWA absorbing unlimited cost.
- User/Stakeholder: Subscribed primary users; the business.
- Goal: Buy additional customization credits.
- Priority: P1
- Description: Lets a subscriber purchase additional customization credits in packs via the configured payment provider.
- Input: User's choice to purchase a credit pack; payment details.
- Processing / Behavior: Subscriber selects "Buy credits" (from FEAT-016 or proactively) → completes a purchase via the configured payment provider → credit balance is updated.
- Output: An increased credit balance.
- Dependencies: FEAT-016; FEAT-038.
- Acceptance Criteria:
  - Given a subscriber wants more credits, when they buy a pack, then a purchase flow is available via the configured provider.
  - Given a purchase completes, when confirmed, then the credit balance updates accordingly.
- Assumptions: None.
- Open Questions: Final credit pack sizes/prices are undecided pending true AI cost-per-customization; whether non-subscribers may purchase credits at all is also undecided (see Candidate Feature CR-010).

---

### A.8 Content Management (Administration)

#### FEAT-029 — Category & Subcategory Management (Admin)

- Type: Admin
- Requirement(s): FR-035
- Problem Solved: Without admin-authored catalog structure, users have nothing to browse (foundational dependency of FEAT-001).
- User/Stakeholder: Platform/content administrators.
- Goal: Build and maintain the category/subcategory hierarchy without developer involvement.
- Priority: P0
- Description: Lets an administrator create, edit, reorganize, and remove categories and subcategories to unlimited depth.
- Input: Administrator's create/edit/remove actions on category/subcategory structure.
- Processing / Behavior: Administrator authors or edits the hierarchy → changes are reflected in what users can browse (FEAT-001).
- Output: An up-to-date category/subcategory structure.
- Dependencies: None (foundational).
- Acceptance Criteria:
  - Given an administrator creates a category/subcategory at any depth, when saved, then it becomes browsable by users.
  - Given an administrator edits or removes one, when saved, then the change is reflected for users.
- Assumptions: None.
- Open Questions: None.

#### FEAT-030 — Template & Prompt Authoring (Admin)

- Type: Admin
- Requirement(s): FR-036
- Problem Solved: Without hand-authored templates and finished prompt text, AWA has no core deliverable (foundational dependency of FEAT-006).
- User/Stakeholder: Platform/content administrators.
- Goal: Author and maintain finished, ready-to-use prompt text for each template, without developer involvement.
- Priority: P0
- Description: Lets an administrator create, edit, publish, and remove templates, each consisting of finished prompt text (no guided input fields/placeholders — that mechanism has been removed from the product).
- Input: Administrator's authored/edited template content.
- Processing / Behavior: Administrator authors a template's finished prompt text → publishes it → it becomes visible to users per FEAT-006/FEAT-007.
- Output: Published, user-visible templates with finished prompt text.
- Dependencies: FEAT-029 (category context).
- Acceptance Criteria:
  - Given an administrator authors a template, when published, then its prompt becomes visible to users.
  - Given an administrator edits a published template's prompt, when saved, then users subsequently see the updated text.
  - Given templates use no guided fields, when authored, then the system does not require or expose such fields.
- Assumptions: None.
- Open Questions: None.

#### FEAT-031 — Tool/Model Assignment (Admin)

- Type: Admin
- Requirement(s): FR-037
- Problem Solved: Without tool/model tagging, neither recommendations (FEAT-017) nor the model filter (FEAT-003) can function correctly.
- User/Stakeholder: Platform/content administrators.
- Goal: Tag templates (or whole categories, with inheritance) with the AI tools/models they are written for.
- Priority: P0
- Description: Lets an administrator assign one or more tool/model tags to a template, with the ability to set this once at a category level and have it inherit down the tree unless overridden.
- Input: Administrator's tag assignment (template- or category-level).
- Processing / Behavior: Administrator assigns a tag → templates within that scope inherit it unless individually overridden → recommendations and the model filter reflect the assignment.
- Output: Tool/model tags attached to templates, feeding FEAT-003 and FEAT-017.
- Dependencies: FEAT-030; FEAT-032 (master list of tools/models to choose from).
- Acceptance Criteria:
  - Given an administrator tags a template or category, when saved, then templates in that scope inherit the tag unless overridden.
  - Given a tag changes, when saved, then recommendation and filter results reflect the update.
- Assumptions: None.
- Open Questions: None.

#### FEAT-032 — AI Tool/Model Master List (Admin)

- Type: Admin
- Requirement(s): FR-038
- Problem Solved: External AI tools and models change or are retired over time; the recommendation/filter system needs an up-to-date source list.
- User/Stakeholder: Platform/content administrators.
- Goal: Keep the list of available tools/models current without developer involvement.
- Priority: P0
- Description: Lets an administrator maintain a master list of AI tools and their specific models (e.g., Runway Gen-3, Sora, Pika 1.5), adding, editing, or retiring entries.
- Input: Administrator's add/edit/retire actions on the tool/model list.
- Processing / Behavior: Administrator adds a tool/model → it becomes available for tagging (FEAT-031) and recommendation (FEAT-017). Administrator retires one → it stops appearing in new recommendations.
- Output: An up-to-date tool/model master list.
- Dependencies: None (foundational to FEAT-031).
- Acceptance Criteria:
  - Given an administrator adds a tool/model, when saved, then it becomes available for tagging and recommendation.
  - Given an administrator retires one, when saved, then it no longer appears in new recommendations, without a code change.
- Assumptions: None.
- Open Questions: None.

#### FEAT-033 — Usage Content Management (Admin)

- Type: Admin
- Requirement(s): FR-039
- Problem Solved: Usage steps/video (FEAT-018/FEAT-019) need admin-authored content to display.
- User/Stakeholder: Platform/content administrators.
- Goal: Author and maintain usage steps and optional videos per template/tool.
- Priority: P1
- Description: Lets an administrator author, edit, and attach/remove usage steps and short instructional videos for a template or tool.
- Input: Administrator's authored steps text and/or attached video.
- Processing / Behavior: Administrator authors steps and/or attaches a video → content becomes visible to users per FEAT-018/FEAT-019.
- Output: Published usage guidance content.
- Dependencies: FEAT-030, FEAT-032.
- Acceptance Criteria:
  - Given an administrator authors steps, when saved, then they display per FEAT-018.
  - Given an administrator attaches or removes a video, when saved, then availability updates per FEAT-019.
- Assumptions: None.
- Open Questions: None.

#### FEAT-034 — Language & Translation Management (Admin)

- Type: Admin
- Requirement(s): FR-040
- Problem Solved: Non-English-speaking users need access to translated catalog/prompt content.
- User/Stakeholder: Platform/content administrators; non-English-speaking primary users.
- Goal: Manage which languages are supported and their translated content.
- Priority: P1
- Description: Lets an administrator add supported languages and manage translated versions of catalog/prompt content.
- Input: Administrator's added languages and translated content.
- Processing / Behavior: Administrator adds a language and provides translations → users can access content in that language.
- Output: Multi-language content availability.
- Dependencies: FEAT-030.
- Acceptance Criteria:
  - Given an administrator adds a language, when translations are provided, then users can access that content in the added language.
  - Given translations are incomplete for a language, when a user requests it, then the system does not fail (specific fallback mechanism not defined in source).
- Assumptions: None.
- Open Questions: Fallback behavior for incomplete translations is not specified in the source material.

#### FEAT-035 — Customization Insights Report (Admin)

- Type: Admin
- Requirement(s): FR-041
- Problem Solved: Admins need to know what content is systematically insufficient — explicitly named as the platform's most valuable report.
- User/Stakeholder: Platform/content administrators.
- Goal: See aggregated customization-request data to identify content gaps and candidates for new templates.
- Priority: P1
- Description: Provides administrators an aggregated view of recorded customization requests (linked to their originating templates via FEAT-021), surfacing common/recurring requests.
- Input: Feedback-linked customization request records (FEAT-021).
- Processing / Behavior: Customization requests accumulate over time → the report aggregates them by template/pattern → administrators review to identify prompts needing revision or splitting into new templates.
- Output: An aggregated report of customization requests, organized to surface recurring patterns.
- Dependencies: FEAT-021.
- Acceptance Criteria:
  - Given customization requests have been recorded, when an administrator views the report, then requests are aggregated to surface common/recurring patterns.
  - Given a base prompt receives recurring similar requests, when reviewed, then the administrator can identify it as a candidate for revision.
- Assumptions: None.
- Open Questions: Review cadence and the workflow for converting findings into new templates are not specified.

#### FEAT-036 — AI Rewriting Instruction Configuration (Admin)

- Type: Admin
- Requirement(s): FR-042
- Problem Solved: The AI rewriting service (FEAT-012) needs a standing instruction governing how it should behave when rewriting prompts.
- User/Stakeholder: Platform/content administrators.
- Goal: Define and update the standing instruction that governs the AI rewrite behavior.
- Priority: P1
- Description: Lets an administrator define and update the standing instruction sent to the outside AI service alongside every customization request.
- Input: Administrator's authored/edited instruction text.
- Processing / Behavior: Administrator edits the instruction → saved → subsequent customization requests (FEAT-012) use the updated instruction.
- Output: An up-to-date standing rewriting instruction.
- Dependencies: FEAT-012; FEAT-037 (broader customization engine controls).
- Acceptance Criteria:
  - Given an administrator edits the instruction, when saved, then subsequent customizations use the updated version.
  - Given no instruction has been set, when a customization is attempted, then the system does not fail (default/fallback content not specified in source).
- Assumptions: None.
- Open Questions: How quality/consistency of the instruction is validated across templates is not addressed in the source material.

---

### A.9 Administration (Platform-Level Controls)

#### FEAT-037 — Customization Engine Configuration (Admin)

- Type: Admin
- Requirement(s): FR-043
- Problem Solved: The business must control AI-related cost exposure and be able to turn customization on/off or tune its parameters without a code change.
- User/Stakeholder: Platform/content administrators; the business.
- Goal: Configure customization on/off (globally or per category), free-customization count, credit pack definitions, monthly AI spending cap, and voice on/off.
- Priority: P1
- Description: Provides administrators a set of controls governing whether and how customization operates: enabling/disabling it globally or per category, setting the free-customization allotment, defining credit packs, setting a monthly spending cap, and toggling voice input.
- Input: Administrator's configuration choices for each control.
- Processing / Behavior: Administrator sets a control → the corresponding behavior (FEAT-010–FEAT-016, FEAT-027, FEAT-028) reflects the new setting.
- Output: Updated customization-engine behavior across the product.
- Dependencies: FEAT-011 (voice toggle), FEAT-012, FEAT-015, FEAT-027, FEAT-028.
- Acceptance Criteria:
  - Given an administrator disables customization for a category, when a user in that category views a prompt, then Customize is not offered.
  - Given an administrator sets a monthly spending cap, when reached, then new customization attempts are blocked for the affected scope while base prompt access continues.
  - Given an administrator disables voice input, when a user opens Customize, then only typed input is offered.
- Assumptions: None.
- Open Questions: What a user sees when the monthly spending cap is reached is not specified.

#### FEAT-038 — Payment Provider Management (Admin)

- Type: Admin
- Requirement(s): FR-044
- Problem Solved: Subscription and credit purchases (FEAT-024, FEAT-028) need a way to actually process payment, and the business wants flexibility to add providers later.
- User/Stakeholder: Platform/content administrators; the business.
- Goal: Configure which payment provider(s) process AWA transactions.
- Priority: P1
- Description: Lets an administrator configure payment provider settings, supporting Razorpay at launch, with the ability to add other providers later without a rebuild.
- Input: Administrator's provider configuration.
- Processing / Behavior: Administrator configures Razorpay → subscription/credit transactions (FEAT-024, FEAT-028) route through it. Administrator adds a new provider later → it becomes available for transactions.
- Output: Configured, functioning payment processing for subscriptions and credit purchases.
- Dependencies: FEAT-024, FEAT-028.
- Acceptance Criteria:
  - Given Razorpay is configured, when a user subscribes or buys credits, then payment is processed through it.
  - Given an administrator adds a new provider, when configured, then it becomes usable for transactions without a rebuild.
- Assumptions: None.
- Open Questions: None.

#### FEAT-039 — Non-Subscriber Visibility Configuration (Admin)

- Type: Admin
- Requirement(s): FR-045
- Problem Solved: Whether non-subscribers should see a blurred preview or a hard block is explicitly unresolved in the source material — this feature exists to let the decision be made and changed via configuration rather than being hard-coded either way.
- User/Stakeholder: Platform/content administrators.
- Goal: Control whether non-subscribers see a blurred prompt preview or a hard block.
- Priority: P1
- Description: Lets an administrator set the prompt-visibility rule for non-subscribers to either "blurred preview" (FEAT-007) or "hard block" (no prompt text shown at all, only a subscribe call-to-action).
- Input: Administrator's chosen visibility rule.
- Processing / Behavior: Administrator sets the rule → non-subscriber prompt views (FEAT-007) follow the configured behavior.
- Output: The active non-subscriber visibility rule.
- Dependencies: FEAT-007.
- Acceptance Criteria:
  - Given the rule is set to "blurred preview," when a non-subscriber views a paywalled prompt, then FEAT-007 behavior applies.
  - Given the rule is set to "hard block," when a non-subscriber views a paywalled prompt, then no prompt text is shown, only a subscribe call-to-action.
- Assumptions: This requirement assumes the resolution will be admin-configurable rather than fixed; the source material confirms only that the choice itself is undecided, not that configurability is the intended resolution.
- Open Questions: Which behavior (or whether both, via configuration) is correct is unresolved — see REQUIREMENTS Conflict C-1.

---

### A.10 Personalization — Likes, Saves & Trending Discovery

> **Note on sourcing:** FEAT-040 through FEAT-044 below (and their requirement IDs FR-046 through FR-050) were added during a working session directly with the product owner and are not yet reflected in `docs/03-REQUIREMENTS.md`. Per this document's own traceability rule, `docs/03-REQUIREMENTS.md` should be updated with matching FR entries so these features carry the same source-of-truth backing as every other feature in this document. See also Section E, item G-6.

#### FEAT-040 — Save Template

*(Formerly named "Favourite Templates." Renamed and clarified as a distinct action from Like — see FEAT-041 — per product direction.)*

- Type: User-facing
- Requirement(s): FR-046
- Problem Solved: Users may want to bookmark a template to return to and reuse later, rather than re-browsing or re-searching for it.
- User/Stakeholder: Primary users.
- Goal: Bookmark a template into a personal, private collection for quick return access.
- Priority: P2
- Description: Lets a user save (bookmark) a template into a personal "Saved Templates" list, and view/manage that list at any time. Saving is a deliberate "keep this for later" action, distinct from Liking (FEAT-041), which is a lightweight signal of appreciation. A user may save a template, like it, both, or neither, independently.
- Input: User's save/unsave action on a template; the user's existing save history (for the list view).
- Processing / Behavior: User selects "Save" on a template → it is added to their personal Saved Templates list, and the template's aggregate save count increases (feeding FEAT-044, Mostly Saved) → user opens "My Saved Templates" to view the list and reopen any entry directly → unsaving removes it from the list and decrements the aggregate count.
- Output: A user-specific Saved Templates list; a contribution to the template's aggregate save count.
- Dependencies: FEAT-004.
- Acceptance Criteria:
  - Given a user saves a template, when saved, then it appears in their Saved Templates list and the template's aggregate save count increases by one.
  - Given a user removes a save, when unsaved, then it no longer appears in that list and the aggregate count decreases by one.
  - Given a user saves a template, when this occurs, then the template is not automatically liked (the two actions are independent).
  - Given a user has saved no templates, when they open My Saved Templates, then they are informed rather than shown a blank or broken screen.
- Assumptions: A user can save a given template at most once at any time (no duplicate entries); the previous "Favourite" terminology and this "Save" terminology refer to the same single underlying mechanism, not two separate lists.
- Open Questions: Whether saving requires a subscription is not specified in the source material.

#### FEAT-041 — Like Template

- Type: User-facing
- Requirement(s): FR-047
- Problem Solved: Users want a quick, lightweight way to signal that a template or prompt was good, without the deliberate commitment of bookmarking it for reuse (which FEAT-040 already covers).
- User/Stakeholder: Primary users.
- Goal: Express appreciation for a template with a single action, independent of saving it.
- Priority: P2
- Description: Lets a user "like" a template (e.g., via a heart/like icon) from wherever it appears — browse lists, search results, or the template's own view. Liking and saving are independent actions; either, both, or neither may apply to a given template for a given user.
- Input: User's like/unlike action on a template.
- Processing / Behavior: User likes a template → the like is recorded against that user and that template → it is added to the user's My Liked Templates list (FEAT-042) → the template's aggregate like count increases, feeding FEAT-043 (Mostly Liked). Unliking reverses all of this.
- Output: A recorded like; a contribution to the user's Liked Templates list and to the template's aggregate like count.
- Dependencies: FEAT-004.
- Acceptance Criteria:
  - Given a user likes a template, when liked, then it is added to their Liked Templates list and the template's aggregate like count increases by one.
  - Given a user unlikes a template, when unliked, then it is removed from their Liked Templates list and the aggregate count decreases by one.
  - Given a user likes a template, when this occurs, then the template is not automatically added to their Saved Templates list.
- Assumptions: A user can like a given template at most once at any time (no stacked/repeated likes).
- Open Questions: Whether liking requires a subscription, and whether non-subscribers may like templates during free browsing, is not specified in the source material.

#### FEAT-042 — My Liked Templates

- Type: User-facing
- Requirement(s): FR-048
- Problem Solved: A user who has liked templates over time needs a way to find them again without re-browsing.
- User/Stakeholder: Primary users.
- Goal: View and return to every template the user has personally liked.
- Priority: P2
- Description: Provides a personal, private list of every template the user currently has liked (FEAT-041), letting them reopen any of them directly.
- Input: The user's own like history (FEAT-041).
- Processing / Behavior: User opens "My Liked Templates" → currently-liked templates are listed → selecting one opens it directly (hands off to FEAT-004/FEAT-006).
- Output: A personal, user-specific list of liked templates.
- Dependencies: FEAT-041.
- Acceptance Criteria:
  - Given a user has liked one or more templates, when they open My Liked Templates, then all currently-liked templates are shown.
  - Given a user unlikes a template, when unliked, then it no longer appears in this list.
  - Given a user has liked no templates, when they open this list, then they are informed rather than shown a blank or broken screen.
- Assumptions: None.
- Open Questions: None.

#### FEAT-043 — Mostly Liked Templates (Trending)

- Type: User-facing
- Requirement(s): FR-049
- Problem Solved: Users deciding where to start benefit from social proof — seeing what other users found worth liking — as an added discovery path alongside category browsing and search.
- User/Stakeholder: Primary users, including non-subscribers.
- Goal: Discover templates many other users have liked, as a shortcut past browsing or searching.
- Priority: P2
- Description: Displays a platform-wide, publicly visible section ranking templates by aggregate like count (FEAT-041) across all users. Available without a subscription, under the same free-browsing rule as any other discovery surface (FEAT-022) — only the full prompt text of a selected template remains gated.
- Input: Aggregate like counts across all users and templates (FEAT-041).
- Processing / Behavior: Section is computed from aggregate like counts → templates are ranked highest-to-lowest → the top-ranked set is displayed → selecting a template opens it directly (FEAT-004).
- Output: A ranked, platform-wide "Mostly Liked" list of templates.
- Dependencies: FEAT-041; FEAT-022 (same free-browsing access rules apply).
- Acceptance Criteria:
  - Given templates have received likes from users, when a user opens Mostly Liked, then templates are shown ranked by aggregate like count, highest first.
  - Given a non-subscriber views this section, when viewed, then it is visible under the same free-browsing rule as other discovery surfaces (FEAT-022).
  - Given no templates have any likes yet, when opened, then the user is informed rather than shown a blank or broken screen.
- Assumptions: Ranking reflects total like count; a time-decayed or "trending this week" variant is not confirmed and would need separate validation.
- Open Questions: How many templates are shown, and whether ranking is all-time or time-windowed, is not specified in the source material.

#### FEAT-044 — Mostly Saved Templates (Trending)

- Type: User-facing
- Requirement(s): FR-050
- Problem Solved: A save reflects a stronger intent than a like (the user chose to keep it for reuse); surfacing what's most-saved helps new users discover templates already proven valuable enough to bookmark.
- User/Stakeholder: Primary users, including non-subscribers.
- Goal: Discover templates many other users have saved for reuse.
- Priority: P2
- Description: Displays a platform-wide, publicly visible section ranking templates by aggregate save count (FEAT-040) across all users, available without a subscription under the same rules as FEAT-043.
- Input: Aggregate save counts across all users and templates (FEAT-040).
- Processing / Behavior: Section is computed from aggregate save counts → templates are ranked highest-to-lowest → the top-ranked set is displayed → selecting a template opens it directly (FEAT-004).
- Output: A ranked, platform-wide "Mostly Saved" list of templates.
- Dependencies: FEAT-040; FEAT-022.
- Acceptance Criteria:
  - Given templates have been saved by users, when a user opens Mostly Saved, then templates are shown ranked by aggregate save count, highest first.
  - Given a non-subscriber views this section, when viewed, then it is visible under the same free-browsing rule as other discovery surfaces (FEAT-022).
  - Given no templates have any saves yet, when opened, then the user is informed rather than shown a blank or broken screen.
- Assumptions: An individual user's save contributes to the aggregate count only once per template while the save is active (no duplicate counting from repeated save/unsave cycles).
- Open Questions: How many templates are shown, and whether ranking is all-time or time-windowed, is not specified in the source material.

---

## B. Non-Functional Requirement Coverage

Non-functional requirements (NFRs) are quality attributes of the features above, not separate features in their own right. Each is mapped here to the feature(s) it constrains.

| NFR ID | Quality | Constrains Feature(s) | Coverage |
|---|---|---|---|
| NFR-001 | Privacy of user-provided data | FEAT-012 (data sent to outside AI service), FEAT-024/FEAT-028 (account/payment data) | Full (as a quality attribute; no dedicated feature needed) |
| NFR-002 | Security of payment transactions | FEAT-024, FEAT-028, FEAT-038 | Full (as a quality attribute) |
| NFR-003 | Core functionality independent of the outside AI service | FEAT-006, FEAT-008, FEAT-009, FEAT-016, FEAT-017, FEAT-018 | Full (explicit design constraint; verified via acceptance criteria on FEAT-012 and FEAT-016) |
| NFR-004 | Customization response time | FEAT-012 | Full, target descriptive only ("a few seconds"); precise SLA `Target: TBD` |
| NFR-005 | AI cost exposure control | FEAT-037, FEAT-015 | Full, numeric cap value `Target: TBD` |
| NFR-006 | Consistent credit metering across input methods | FEAT-015 | Full |
| NFR-007 | No prompt-writing skill required | FEAT-006, FEAT-010, FEAT-011 | Full (core value proposition; verified via acceptance criteria across these features) |
| NFR-008 | Content maintainable without developer involvement | FEAT-029 through FEAT-038 | Full |
| NFR-009 | Feedback/version data integrity | FEAT-021, FEAT-035 | Full |
| NFR-010 | Payment provider extensibility | FEAT-038 | Full |

---

## C. Requirement Traceability

| Requirement ID | Feature ID | Feature | Coverage |
|---|---|---|---|
| FR-001 | FEAT-001 | Category & Subcategory Browsing | Full |
| FR-002 | FEAT-002 | Template Discovery & Filtering | Full |
| FR-003 | FEAT-003 | AI Model Filter | Full |
| FR-004 | FEAT-002 | Template Discovery & Filtering | Full |
| FR-005 | FEAT-004 | Template Selection | Full |
| FR-006 | FEAT-005 | Blank Start Option | Full |
| FR-007 | FEAT-006 | Instant Base Prompt Display | Full |
| FR-008 | FEAT-007 | Subscriber Prompt Preview (Blur Gate) | Full |
| FR-009 | FEAT-008 | Full Prompt View | Full |
| FR-010 | FEAT-009 | Prompt Copy | Full |
| FR-011 | FEAT-010 | Typed Customization Request | Full |
| FR-012 | FEAT-011 | Voice Customization Request | Full |
| FR-013 | FEAT-012 | AI Prompt Rewrite Engine | Full |
| FR-014 | FEAT-013 | Revert to Original Prompt | Full |
| FR-015 | FEAT-014 | Customization Version History | Full |
| FR-016 | FEAT-015 | Customization Credit Metering | Full |
| FR-017 | FEAT-015 | Customization Credit Metering | Full |
| FR-018 | FEAT-016 | Credit Exhaustion Handling | Full |
| FR-019 | FEAT-017 | AI Tool/Model Recommendation | Full |
| FR-020 | FEAT-018 | Usage Steps | Full |
| FR-021 | FEAT-019 | Usage Video | Full |
| FR-022 | FEAT-020 | Prompt Feedback Capture | Full |
| FR-023 | FEAT-020 | Prompt Feedback Capture | Full |
| FR-024 | FEAT-020 | Prompt Feedback Capture | Full |
| FR-025 | FEAT-021 | Feedback-to-Prompt-Version Linkage | Full |
| FR-026 | FEAT-022 | Free Browsing Access | Full |
| FR-027 | FEAT-023 | Subscription Paywall Enforcement | Full |
| FR-028 | FEAT-024 | Subscription Plan Selection | Full |
| FR-029 | FEAT-025 | Prompt Share Protection | Full |
| FR-030 | FEAT-026 | Device Session Limit | Full (numeric policy TBD) |
| FR-031 | FEAT-027 | Free Customization Allotment | Full (allotment size/expiry TBD) |
| FR-032 | FEAT-028 | Credit Pack Purchase | Full (pricing TBD) |
| FR-033 | FEAT-016 | Credit Exhaustion Handling | Full |
| FR-034 | FEAT-015 | Customization Credit Metering | Full |
| FR-035 | FEAT-029 | Category & Subcategory Management (Admin) | Full |
| FR-036 | FEAT-030 | Template & Prompt Authoring (Admin) | Full |
| FR-037 | FEAT-031 | Tool/Model Assignment (Admin) | Full |
| FR-038 | FEAT-032 | AI Tool/Model Master List (Admin) | Full |
| FR-039 | FEAT-033 | Usage Content Management (Admin) | Full |
| FR-040 | FEAT-034 | Language & Translation Management (Admin) | Full |
| FR-041 | FEAT-035 | Customization Insights Report (Admin) | Full |
| FR-042 | FEAT-036 | AI Rewriting Instruction Configuration (Admin) | Full |
| FR-043 | FEAT-037 | Customization Engine Configuration (Admin) | Full |
| FR-044 | FEAT-038 | Payment Provider Management (Admin) | Full |
| FR-045 | FEAT-039 | Non-Subscriber Visibility Configuration (Admin) | Full (underlying blur-vs-block decision unresolved — see Section E, C-1) |
| FR-046 | FEAT-040 | Save Template | Full (pending formal entry in REQUIREMENTS — see Section E, G-6) |
| FR-047 | FEAT-041 | Like Template | Full (pending formal entry in REQUIREMENTS — see Section E, G-6) |
| FR-048 | FEAT-042 | My Liked Templates | Full (pending formal entry in REQUIREMENTS — see Section E, G-6) |
| FR-049 | FEAT-043 | Mostly Liked Templates (Trending) | Full (pending formal entry in REQUIREMENTS — see Section E, G-6) |
| FR-050 | FEAT-044 | Mostly Saved Templates (Trending) | Full (pending formal entry in REQUIREMENTS — see Section E, G-6) |
| NFR-001–NFR-010 | (see Section B) | — | Full, as quality attributes (no dedicated features required) |

Every requirement in REQUIREMENTS has at least one corresponding feature. No requirement is currently in "Not Yet Covered" status. Several features carry an explicit note where the underlying policy value (a number, a price, or a binary decision) remains open — these are tracked in Section E and in the requirement's own Open Questions, not treated as coverage gaps. FR-046 through FR-050 are the exception noted throughout this revision: they are used here as if confirmed, but still need to be written into `docs/03-REQUIREMENTS.md` itself (see Section E, G-6).

---

## D. Candidate Features — Requires Validation

These ideas are not supported by a confirmed requirement and are excluded from the confirmed feature list above. Some correspond to Candidate Requirements already flagged in REQUIREMENTS (CR-001–CR-010); others are common product ideas explicitly named in this document's own brief and are excluded because they fall outside AWA's confirmed scope entirely.

| Candidate | Why It Seems Useful | Missing Requirement | Why It Is Excluded |
|---|---|---|---|
| Persistent prompt/customization history beyond the session | Lets users return to past customization work across sessions/devices, not just within one session | No FR requires persistence beyond the session (FEAT-014 is session-scoped only) | REQUIREMENTS CR-001: explicitly flagged as an open question in PROBLEM §18/RESEARCH §15, not a confirmed need |
| Adaptive onboarding/guidance for beginners vs. experienced users | Could reduce friction for experienced users and increase support for beginners | No FR distinguishes user experience level | REQUIREMENTS CR-002: explicitly marked ASSUMPTION, not confirmed by research |
| Structured handling of vague/ambiguous/contradictory customization requests (e.g., clarifying prompts) | Could improve customization success rate and avoid wasted credits | No FR defines this handling | REQUIREMENTS CR-003: explicitly marked UNKNOWN, not addressed in source material |
| Defined fallback messaging when no tool/model is configured for a template | Prevents a dead end at FEAT-017 | No FR defines this fallback | REQUIREMENTS CR-004: explicitly marked UNKNOWN in current source |
| In-flow guidance for judging whether the base prompt is "good enough" before spending a credit | Could reduce wasted credits and improve satisfaction | No FR defines this mechanism | REQUIREMENTS CR-005: identified only as a user decision point, no confirmed mechanism |
| Expanded accessibility support (visual, motor, hearing, cognitive) beyond voice input | Would broaden usability for users with additional accessibility needs | No FR beyond voice input (FEAT-011) addresses accessibility | REQUIREMENTS CR-006: explicitly marked UNKNOWN, not addressed anywhere in the source material |
| Free trial of the prompt-reading experience before subscribing | Could increase conversion by letting users experience value before paying | No FR defines a trial mechanism | REQUIREMENTS CR-007: raised only as an undecided policy question, not a confirmed requirement |
| Structured/richer success metrics beyond thumbs up/down | Could produce more actionable content-quality data than binary feedback | No FR requires anything beyond FEAT-020's rating/comment/tool-used fields | REQUIREMENTS CR-008: explicitly marked UNKNOWN what "success" means beyond thumbs up/down |
| Free retry when a customization succeeded but didn't satisfy the user (vs. failed outright) | Could reduce frustration around a "succeeded but unsatisfying" outcome | No FR distinguishes this from a hard failure (FEAT-015/FEAT-017 only handle true failure/timeout) | REQUIREMENTS CR-009: explicitly marked UNKNOWN whether this distinction is handled |
| Non-subscriber credit purchase (customization access without a reading subscription) | Could open a secondary revenue path | FR-032 is scoped to subscribers; no FR authorizes non-subscriber purchase | REQUIREMENTS CR-010: explicitly undecided, with a stated recommendation of "no" |
| Prompt sharing (link/export to non-subscribers) | Superficially convenient for users wanting to share a result | Directly contradicted by FR-029 | Explicitly out of scope per REQUIREMENTS Section F; this is a confirmed exclusion, not merely unvalidated |
| Direct integrations / one-click "run this for me" on an external AI tool | Would remove the copy-paste step for the user | No FR authorizes AWA controlling or executing on an external platform | Explicitly out of scope per REQUIREMENTS Section F and the AWA product boundary (Section G there) |
| Community/user-submitted templates | Could expand catalog breadth faster than admin-only authoring | No FR authorizes user-submitted content or a review/approval workflow | Explicitly out of scope per REQUIREMENTS Section F |
| Cross-tool result comparison | Could help users judge which recommended tool produces better results | Would require storing user-generated outputs, which is deliberately not done | Explicitly out of scope per REQUIREMENTS Section F |
| Prompt versioning as a distinct, admin-facing content-management capability (beyond user-facing session history) | Could let admins track how a base prompt's authored text changed over time | No FR defines admin-facing prompt version history (only NFR-009's linkage-integrity requirement, which is a data-integrity constraint, not a versioning UI) | Not supported by a confirmed FR; would need to be validated as a distinct admin need before inclusion |
| Prompt ratings beyond binary thumbs up/down (e.g., star ratings) | Could capture more nuance than a binary signal | No FR defines a rating scale beyond thumbs up/down | Overlaps with CR-008 above; not supported by a confirmed FR |

---

## E. Feature Conflicts and Gaps

#### G-1 — Unclear Feature: Non-Subscriber Visibility Rule (FEAT-007 / FEAT-039)

- What the issue is: The underlying product decision — blurred preview vs. hard block — is explicitly unresolved in the source material (see REQUIREMENTS Conflict C-1), even though the *flow* described elsewhere treats blur as the current confirmed behavior.
- Which requirement/feature is affected: FR-008, FR-045; FEAT-007, FEAT-039.
- Why it matters: FEAT-039 assumes a configurable resolution (admin picks blur or block), but the source material does not confirm that configurability itself is the intended fix — it may simply be a fixed decision once made.
- What needs clarification: Whether the final product will support both modes via configuration, or whether one mode will be permanently chosen.

#### G-2 — Unclear Feature: Device Session Limit Value (FEAT-026)

- What the issue is: The confirmed constraint is "one device (or possibly two)," without a final decision.
- Which requirement/feature is affected: FR-030; FEAT-026.
- Why it matters: FEAT-026's acceptance criteria describe "the configured policy" generically because the actual number is unknown; UX design cannot finalize the sign-in/session-conflict experience until this is set.
- What needs clarification: Whether the launch policy is one device or two.

#### G-3 — Unclear Feature: Free Customization Allotment Size and Expiry (FEAT-027)

- What the issue is: The free-allotment mechanism is confirmed to exist, but its size (5 or 10) and whether credits expire are both explicitly undecided.
- Which requirement/feature is affected: FR-031; FEAT-027.
- Why it matters: This affects both user expectations at first subscription and the cost-control math behind NFR-005.
- What needs clarification: The exact free-customization count and expiry policy.

#### G-4 — Unclear Feature: Monthly Spending Cap Behavior (FEAT-037)

- What the issue is: A monthly AI spending cap is confirmed to be a required control, but its value and what the user sees when it is reached are both undecided.
- Which requirement/feature is affected: FR-043, NFR-005; FEAT-037.
- Why it matters: This affects both business cost protection and the user experience when customization becomes temporarily unavailable platform-wide.
- What needs clarification: The cap value and the corresponding user-facing message/state.

#### G-5 — Potential Requirement With No Feature: Detail-Sufficiency Gap (Carried Over from REQUIREMENTS Conflict C-4)

- What the issue is: REQUIREMENTS Conflict C-4 notes that removing guided input fields created a gap — users may not know how much detail to provide or which information matters to a given tool/model — without a confirmed replacement mechanism beyond free-form Customize (FEAT-010/FEAT-011).
- Which requirement/feature is affected: No specific FR currently addresses "detail sufficiency" as its own concern; it is only indirectly covered by Customize.
- Why it matters: If detail sufficiency is a real, unaddressed gap, FEAT-010/FEAT-011 may be insufficient on their own to fully replace the removed guided-fields mechanism.
- What needs clarification: Whether this gap is considered fully closed by the current base-prompt + Customize design, or whether a dedicated feature is needed — this should not be resolved by inventing a feature now.

#### G-6 — Sourcing Gap: Like/Save/Trending Features Added Outside the REQUIREMENTS Document (FEAT-040–FEAT-044)

- What the issue is: FEAT-040 through FEAT-044 (Save, Like, My Liked Templates, Mostly Liked, Mostly Saved) and their requirement IDs FR-046 through FR-050 were introduced directly into this FEATURES document at the product owner's request, rather than being derived from `docs/03-REQUIREMENTS.md` as this document's own stated scope requires.
- Which requirement/feature is affected: FR-046–FR-050; FEAT-040–FEAT-044.
- Why it matters: This document's traceability rule exists so that every feature can be traced back to a confirmed user need in PROBLEM/RESEARCH and a confirmed requirement in REQUIREMENTS. Until FR-046–FR-050 are written into `docs/03-REQUIREMENTS.md`, these five features are the only ones in this document without that backing — a gap in process, not in the features' validity.
- What needs clarification: Whether `docs/03-REQUIREMENTS.md` will be updated to formally include FR-046–FR-050 (recommended, for consistency with the rest of the document), or whether this document's stated scope note should instead be permanently amended to acknowledge a secondary source for these five entries.

No duplicate features or features satisfying conflicting requirements were identified. Every confirmed FR maps to exactly one primary feature (some features serve more than one closely related FR, e.g., FEAT-002 serves FR-002 and FR-004, and FEAT-015 serves FR-016/FR-017/FR-034 as a single coherent metering capability).

---

## F. Feature Scope

### MVP / Initial Product (P0)
FEAT-001 Category & Subcategory Browsing · FEAT-002 Template Discovery & Filtering · FEAT-004 Template Selection · FEAT-006 Instant Base Prompt Display · FEAT-007 Subscriber Prompt Preview (Blur Gate) · FEAT-008 Full Prompt View · FEAT-009 Prompt Copy · FEAT-016 Credit Exhaustion Handling · FEAT-017 AI Tool/Model Recommendation · FEAT-018 Usage Steps · FEAT-022 Free Browsing Access · FEAT-023 Subscription Paywall Enforcement · FEAT-024 Subscription Plan Selection · FEAT-029 Category & Subcategory Management (Admin) · FEAT-030 Template & Prompt Authoring (Admin) · FEAT-031 Tool/Model Assignment (Admin) · FEAT-032 AI Tool/Model Master List (Admin)

*Rationale:* This set delivers AWA's minimum confirmed core value — browse, find a template, get an instant expert prompt, know what tool to use and how, and pay for full access — without which the product cannot solve its documented core problem (PROBLEM §22). Note that FEAT-016 is P0 not because credits/customization is core, but because *never blocking reading/copying due to credit balance* protects the P0 prompt-access value.

### Important Next Features (P1)
FEAT-003 AI Model Filter · FEAT-005 Blank Start Option · FEAT-010 Typed Customization Request · FEAT-011 Voice Customization Request · FEAT-012 AI Prompt Rewrite Engine · FEAT-013 Revert to Original Prompt · FEAT-014 Customization Version History · FEAT-015 Customization Credit Metering · FEAT-019 Usage Video · FEAT-020 Prompt Feedback Capture · FEAT-021 Feedback-to-Prompt-Version Linkage · FEAT-025 Prompt Share Protection · FEAT-026 Device Session Limit · FEAT-027 Free Customization Allotment · FEAT-028 Credit Pack Purchase · FEAT-033 Usage Content Management (Admin) · FEAT-034 Language & Translation Management (Admin) · FEAT-035 Customization Insights Report (Admin) · FEAT-036 AI Rewriting Instruction Configuration (Admin) · FEAT-037 Customization Engine Configuration (Admin) · FEAT-038 Payment Provider Management (Admin) · FEAT-039 Non-Subscriber Visibility Configuration (Admin)

*Rationale:* This set includes the entire customization engine (a confirmed, real product capability with real cost, but one explicitly designed to be optional so the P0 core still works without it) plus feedback, guidance enrichment, and administrative controls that materially improve the product and protect the business, but are not strictly required for the core problem to be solved once.

### Future Features (P2)
FEAT-040 Save Template · FEAT-041 Like Template · FEAT-042 My Liked Templates · FEAT-043 Mostly Liked Templates (Trending) · FEAT-044 Mostly Saved Templates (Trending)

*Rationale:* Confirmed but secondary personalization/discovery features. Useful for engagement and retention — and for surfacing proven templates to new users via social proof — but none are required to deliver or protect the core value proposition (finding a template, getting a prompt, knowing how to use it, and paying for full access).

---

## G. Feature-to-Outcome Mapping

| Feature | User Problem | Desired Outcome | Requirement |
|---|---|---|---|
| FEAT-001, FEAT-002, FEAT-003 | Doesn't know where to look; tool/model discovery and mismatch | Finds a tool/model appropriate to what they actually have access to | FR-001–FR-004 |
| FEAT-004, FEAT-005, FEAT-006 | Doesn't know what to write as a prompt | Usable, expert-quality prompt with zero prompt-writing effort | FR-005–FR-007 |
| FEAT-007, FEAT-008, FEAT-009 | Needs to actually use the prompt, and AWA needs to monetize access | Reads and copies the prompt after subscribing | FR-008–FR-010 |
| FEAT-010, FEAT-011, FEAT-012, FEAT-013, FEAT-014 | The base prompt is close but not exactly right; no prompt-writing skill | Personalized prompt in the user's own words, without prompt-writing skill | FR-011–FR-015 |
| FEAT-015, FEAT-016 | Business cost exposure from unmetered customization | Customization stays sustainable; reading/copying never blocked | FR-016–FR-018, FR-033–FR-034 |
| FEAT-017 | Doesn't know which tool/model fits the task | Picks a tool/model with a stated rationale | FR-019 |
| FEAT-018, FEAT-019 | Doesn't know how to use the tool once there | Can act immediately without a separate tutorial | FR-020–FR-021 |
| FEAT-020, FEAT-021 | AWA has no signal on prompt success or content gaps | Admins learn what content is missing from real usage | FR-022–FR-025 |
| FEAT-022, FEAT-023, FEAT-024 | Needs to evaluate before paying; AWA needs a monetization gate | Free evaluation, paid access to the core value | FR-026–FR-028 |
| FEAT-025, FEAT-026 | Revenue leakage risk from sharing/account-sharing | Paid prompt access stays protected | FR-029–FR-030 |
| FEAT-027, FEAT-028 | Needs an affordable path into and beyond customization | Tries customization free, buys more if needed | FR-031–FR-032 |
| FEAT-029–FEAT-038 | Content/catalog must stay current without developer involvement | Admins keep the catalog, prompts, and tool list accurate and monetizable | FR-035–FR-044 |
| FEAT-039 | Unresolved policy on non-subscriber prompt visibility | A configurable, changeable resolution rather than a hard-coded guess | FR-045 |
| FEAT-040, FEAT-041, FEAT-042 | Wants to keep or return to templates they valued, in two different ways (bookmark vs. lightweight appreciation) | Faster return to saved/liked content, tracked separately | FR-046–FR-048 |
| FEAT-043, FEAT-044 | Doesn't know what other users have found valuable | Discovers proven templates via social proof, without browsing/searching | FR-049–FR-050 |

---

## Feature Summary

### P0 — Must Have
FEAT-001, FEAT-002, FEAT-004, FEAT-006, FEAT-007, FEAT-008, FEAT-009, FEAT-016, FEAT-017, FEAT-018, FEAT-022, FEAT-023, FEAT-024, FEAT-029, FEAT-030, FEAT-031, FEAT-032
*(17 features)*

### P1 — Important
FEAT-003, FEAT-005, FEAT-010, FEAT-011, FEAT-012, FEAT-013, FEAT-014, FEAT-015, FEAT-019, FEAT-020, FEAT-021, FEAT-025, FEAT-026, FEAT-027, FEAT-028, FEAT-033, FEAT-034, FEAT-035, FEAT-036, FEAT-037, FEAT-038, FEAT-039
*(22 features)*

### P2 — Nice to Have
FEAT-040, FEAT-041, FEAT-042, FEAT-043, FEAT-044
*(5 features)*

### Candidate Features
14 candidate ideas identified in Section D, none confirmed: persistent cross-session history, adaptive onboarding, ambiguous-request handling, tool/model fallback messaging, in-flow "good enough" guidance, expanded accessibility support, free trials, richer success metrics, unsatisfying-but-successful retry handling, non-subscriber credit purchase, prompt sharing (excluded — contradicts FR-029), direct tool integrations (excluded — out of product boundary), community/user-submitted templates (excluded — out of scope), cross-tool result comparison (excluded — out of scope), admin-facing prompt versioning, and non-binary prompt ratings.

### Requirement Gaps
None in terms of feature coverage. Every functional requirement used in this document (FR-001–FR-050) and every non-functional requirement (NFR-001–NFR-010) has at least one corresponding feature or is mapped as a quality attribute of an existing feature (Section B). One process gap exists: FR-046–FR-050 (backing FEAT-040–FEAT-044) are not yet written into `docs/03-REQUIREMENTS.md` — see Section E, G-6.

### Feature Conflicts
Six items identified in Section E, all "Unclear Feature," "Potential Gap," or "Sourcing Gap" in nature rather than true duplication or contradiction: (G-1) non-subscriber visibility rule unresolved; (G-2) device session limit value unresolved; (G-3) free customization allotment size/expiry unresolved; (G-4) monthly spending cap value/behavior unresolved; (G-5) possible detail-sufficiency gap left by removing guided input fields; (G-6) FEAT-040–FEAT-044 need matching entries added to `docs/03-REQUIREMENTS.md`.

### Critical Open Questions
(Carried forward from REQUIREMENTS Section I, as they directly affect finalizing the features above before UX/product-flow design proceeds.)
1. What does a single AI customization cost, and which AI rewriting/speech-to-text providers will be used? (Affects FEAT-012, FEAT-028, NFR-005.)
2. Should non-subscribers see a blurred preview or a hard block? (Affects FEAT-007/FEAT-039 — see G-1.)
3. How many free customizations should a subscriber receive, and do credits expire? (Affects FEAT-027 — see G-3.)
4. Should non-subscribers be able to purchase credits? (Affects FEAT-028 scope; relates to Candidate CR-010.)
5. What is the monthly AI spending cap, and what should users see when it's reached? (Affects FEAT-037 — see G-4.)
6. Should account access allow one device or two? (Affects FEAT-026 — see G-2.)
7. Does the base prompt + Customize design fully close the "how much detail" gap left by removing guided input fields, or is a dedicated feature still needed? (See G-5.)
8. Do users genuinely need the customization engine as built, or would most be satisfied by the base prompt alone? (Affects the relative investment justification for the entire FEAT-010–FEAT-016 set.)
9. Should `docs/03-REQUIREMENTS.md` be formally updated with FR-046–FR-050 to close the sourcing gap for the new Like/Save/Trending features? (Affects G-6.)
10. Should Like and/or Save require an active subscription, or remain available to non-subscribers during free browsing (consistent with the rest of FEAT-022)? (Affects FEAT-040, FEAT-041.)
11. Should Mostly Liked / Mostly Saved rank by all-time totals or a time-windowed "trending" measure, and how many templates should each section show? (Affects FEAT-043, FEAT-044.)

---

**This document is the feature baseline for AWA. Per the defined scope, work stops here — no detailed user flows, screen definitions, wireframes, UI design, design system, database design, API design, system architecture, technology selection, or implementation planning is undertaken.**