# AWA — MVP Architecture Decision

**Status:** This is still at the architecture-decision stage. No specific technology, framework, database engine, cloud provider, or AI model has been chosen anywhere in this document.
**Source material:** `01-PROBLEM.md` (PROBLEM), `02-USER-RESEARCH.md` (RESEARCH), `03-REQUIREMENTS.md` (REQUIREMENTS), `04-FEATURES.md` (FEATURES), `05-MVP.md` (MVP).
**Question this document answers:** *Which kinds of technical and system components does AWA's MVP actually need, and why?*
**Question this document does not answer:** *Which specific technologies should implement them?*

---

## Principles Guiding These Decisions

- **MVP first.** Each decision below is weighed against the MVP scope defined in `05-MVP.md` — a 21-feature, 5-category slice with no customization — rather than against AWA's eventual full product.
- **Minimum necessary complexity.** Whichever architecture is simplest while still satisfying the MVP wins, even if a more elaborate design would look more polished.
- **Requirement traceability.** Every component marked REQUIRED is tied back to specific FR-/NFR-/FEAT- IDs or MVP sections. Anything that can't be traced this way doesn't get marked REQUIRED.
- **No technology choices.** Only component *types* are decided here (e.g., "a persistent database," not a specific vendor or engine).
- **No premature scaling.** Microservices, queues, agents, and caching layers are not introduced just because they "might be useful eventually."
- **No architecture for show.** A component only earns REQUIRED status by solving a real, cited MVP need — not because it's standard practice, trendy, or looks good in a diagram.

---

## Component Decision Matrix

| Component | Decision | Reason | Supporting Requirement / Feature |
|---|---|---|---|
| User Interface | **REQUIRED** | The whole primary user journey — browsing, previewing, hitting the paywall, subscribing, reading, getting recommendations, following guidance, copying text, giving feedback — is visual and interactive. Admins separately need an interface of their own so they can author content without a developer's help. | FEAT-001–009, 017, 018, 020; FEAT-029–033, 038; NFR-008 |
| Application / Backend Logic | **REQUIRED** | Enforcing the paywall/access rules, assembling recommendations, linking feedback, and tracking subscription state can't safely be left up to the client — something server-side has to own these rules. | FR-008, FR-009, FR-019, FR-025, FR-027, FR-028; NFR-008 |
| Persistent Database | **REQUIRED** | Catalog content, tool/model data, subscription state, and feedback all need to outlive a single interaction and be shared across many users and admin edits. | FEAT-029–033, FEAT-020/021, FEAT-023/024; NFR-008, NFR-009 |
| API Layer (communication boundary) | **REQUIRED** | The UI and the backend are separate responsibilities that need to exchange catalog, prompt, subscription, and feedback data; the backend also needs to talk to the payment provider. | FR-010, FR-019, FR-020, FR-028, FR-044 |
| AI Capability | **NOT REQUIRED** | The one MVP feature that touches AI (prompt rewriting) has been explicitly pushed out of scope; every prompt in the MVP is static, admin-written text, and the "recommendations" for tools/models are just admin-curated tags — not model output. | MVP §3, §11, §13, §18 — "Not Required for MVP: an outside AI rewriting service..."; FEAT-006, FEAT-017 |
| Agents / Multi-Step Tool-Using AI | **NOT REQUIRED** | Nothing confirmed in either the MVP or the full product calls for autonomous multi-step reasoning or AI-initiated tool use. Even the deferred rewrite engine is a single, direct call — there's no chaining — and "run this for me" automation is explicitly excluded. | PROBLEM §21; REQUIREMENTS §F; FEAT-012 |
| External Integrations | **REQUIRED** (payment only) | A working payment provider is the only system-to-system integration the journey actually depends on; recommending an external AI tool by name is just informational, not an integration. | FR-028, FR-044; FEAT-024, FEAT-038 |
| Authentication | **REQUIRED** (narrowly scoped) | Browsing itself is explicitly anonymous, but a subscriber's entitlement still needs to be recognized on later visits, and admins need a separate, elevated identity. | MVP §16 ("no sign-in required" for browsing — implying sign-in is needed elsewhere); PROBLEM §15; FR-027, FR-035–038 |
| Cloud Deployment | **REQUIRED** | Users reach AWA remotely (it's a mobile-first audience), and both the payment integration and ongoing admin content management require the backend to be reachable over the internet. | PROBLEM §6; FEAT-038; MVP §17, §18 |
| Background Processing | **NOT REQUIRED** | Every MVP interaction, payment confirmation included, is a synchronous request/response; nothing scheduled, queued, or asynchronous is needed to complete the journey. | MVP §16 (no infrastructure criteria specified) |

---

## 1. User Interface

**Decision: REQUIRED.**

The MVP's single supported journey (MVP §6) is a sequence someone needs to *see and interact with*: browse categories, read a template's description, pick one, hit a blurred preview, subscribe, read the full prompt, see a tool recommendation with its one-line rationale, follow the usage steps, copy the text, and optionally leave a thumbs-up/down with a comment. None of that reduces to something non-visual — nothing in the source material suggests a batch or programmatic use case. So the MVP needs a UI not by default assumption, but because the journey is inherently visual and interactive by nature.

A second, separate interface is needed for admins. NFR-008 requires that categories, templates, tool/model assignments, usage steps, and payment configuration be manageable "without developer involvement" — and that requirement only makes sense if admins have a real interface to work through, rather than raw data access. FEAT-029 through FEAT-033, along with FEAT-038, are all explicitly admin-facing capabilities.

**Two interface *surfaces*, one component *type*:** an end-user interface and an admin interface are both required, but they're the same kind of architectural component (a presentation/interaction layer talking to the same backend) — this isn't a case for building two separately engineered products.

**What this section deliberately leaves open:** whether that interface takes the form of a mobile app, a responsive website, or something else. PROBLEM §6 states plainly that most users will be on a phone — a real constraint worth carrying into design — but that's a UX/design input, not a technology choice, so this document stops short of picking a delivery mechanism.

---

## 2. Application / Backend Logic

**Decision: REQUIRED.**

Running through the standard checklist against the MVP:

- **Processing user input** — template selection, filter/browse queries, the subscribe action, the copy action, feedback submission. Yes.
- **Enforcing product/business rules** — the paywall rule (blurred vs. full prompt depending on subscription status, FR-008/FR-009) is a business rule that must be enforced somewhere users can't bypass by editing client-side state.
- **Generating or assembling prompts** — notably, **no**. Worth stating clearly, since it's an easy assumption to make: MVP prompts are entirely static, pre-written admin content (FEAT-006). The backend's job here is to *fetch and serve* a stored prompt, not build one.
- **Fetching product content** — categories, templates, tool/model tags, usage steps. Constantly, yes.
- **Applying access rules** — distinguishing subscriber, non-subscriber, and administrator. Yes (FR-027, FR-035–038).
- **Handling feedback** — capturing it and linking it to the right template (FR-025, kept at the template level in the MVP, since there's no prompt-version concept without customization). Yes.
- **Coordinating external services** — the payment provider's transaction flow (FR-044). Yes.
- **Guarding sensitive logic/data** — subscription status and admin permissions are exactly the sort of state that has to be authoritative on the server; if it lived only on the client, it could be trivially manipulated into unlocking a full prompt or an admin panel.

Every item above traces to a genuine, cited MVP need. Backend logic is REQUIRED — not because "most applications have one," but because specific, named MVP behaviors depend on server-side enforcement that a UI alone can't provide.

---

## 3. Persistent Database

**Decision: REQUIRED.**

Looking at what genuinely needs to survive beyond a single interaction:

### Data the MVP Needs to Persist
- **Category/subcategory structure** — admin-authored and editable without a developer (FR-035, NFR-008), which rules out baking it directly into the app.
- **Templates and their finished prompt text** — the core deliverable (FR-036); this has to persist and stay identical for every user of that template until an admin changes it.
- **AI tool/model master list** — FR-038, kept up over time as tools and models change or get retired.
- **Tool/model tag assignments per template** — FR-037; this is exactly what FEAT-017's recommendation display reads from.
- **Written usage steps per template/tool** — FR-039 (limited to written content in the MVP).
- **Subscription/account records** — plan type and status (FR-027, FR-028). Since plans are yearly or lifetime, this has to be recognized across many separate visits, not just one session.
- **Feedback records** — rating, optional comment, optional tool used, linked back to the template (FR-022–FR-025, kept at the template level rather than prompt-version level, since the MVP has no customization and therefore no distinct prompt "versions").

### Data That Doesn't Need to Persist
- In-progress browsing/filter selections — ordinary session state that the MVP has no reason to remember afterward.
- The in-flight payment handshake during checkout — only the *outcome* (an active subscription) needs to be stored; the transient checkout exchange itself isn't AWA's data to keep.

Nothing on this list is included just because "AWA obviously has data" — every item ties back to a requirement that specifically depends on it outliving one interaction, being shared across users, or being editable by admins without a rebuild (NFR-008). A database is REQUIRED.

---

## 4. API Layer

**Decision: REQUIRED.**

**Internal application communication:** the UI (both surfaces) and the backend are separate REQUIRED components with distinct responsibilities (Sections 1–2). Browsing needs catalog data from the backend; the prompt view needs prompt text and subscription status; the recommendation step needs tool/model data; feedback submission needs to write back to the backend. Whenever two REQUIRED components with different jobs need to exchange data, a defined interface between them is a structural necessity — not an assumption — so this is REQUIRED, and distinct from "APIs are just common practice."

**External API integration:** the backend also has to talk to the payment provider to process subscriptions and confirm transactions (FR-044) — a second, external instance of the same underlying need.

This document doesn't decide the *shape* of that boundary (REST-style, RPC-style, or otherwise) — only that a defined communication boundary is necessary in both directions.

---

## 5. AI Capability

**Decision: NOT REQUIRED for the MVP.**

This is the most consequential call in the document, and worth being explicit about, precisely because AWA brands itself as an "AI Creation Guide Platform" — so it would be easy to assume AI belongs in the architecture by default.

Walking through what the MVP actually does:

- **Does AWA need AI to understand what a user wants?** No — the MVP has no "describe what you want" input at all. The earlier guided-fields mechanism was removed from the product, and its AI-powered replacement (Customize) isn't part of this MVP.
- **Does AWA need AI to turn requirements into prompts?** No — nothing gets transformed. A template's prompt is finished text an admin wrote, and the system just displays it unchanged.
- **Could the MVP's prompt output be produced with predefined templates/rules instead?** Yes — that's *literally* how it already works. FEAT-006 is explicitly a zero-AI, admin-authored, identical-for-every-user display of stored text.
- **Is AI explicitly required by the product definition?** No. `05-MVP.md` says so directly, in its dependencies section: *"Not Required for MVP: An outside AI rewriting service or speech-to-text provider (both currently unselected — PROBLEM §7)"* (MVP §13).
- **Does AI add core product value here, or does it just make the product sound more advanced?** For this specific MVP, it adds zero product value — it isn't invoked anywhere in the MVP's build list. The "AI" in AWA's name refers to the eventual full product's customization capability, not this MVP.

**A related nuance worth flagging by name:** FEAT-017 ("AI Tool/Model Recommendation") sounds like it involves AI, but it doesn't. What a user sees is an admin-assigned tag lookup — an administrator tags a template with the tool(s)/model(s) it was written for (FEAT-031), and the system just displays those tags along with an admin-written one-line reason. No model runs to produce this; it's ordinary data retrieval, already covered under Application Logic (Section 2) and Persistent Database (Section 3).

**Where real AI does show up in the source material** is FEAT-012, the AI Prompt Rewrite Engine — sending a user's plain-language change request plus the active prompt to an outside AI service and getting back a rewritten prompt. This is the *only* generative-AI feature described anywhere across all five source documents. It sits entirely and explicitly within the deferred customization/credits engine (MVP §3, §11, §18) — not excluded because it's unimportant, but because building it now would commit engineering effort against the single most urgent unresolved question in the whole project: what one customization actually costs and which provider will deliver it (PROBLEM §19, Q1). The MVP's own stated Core Hypothesis is to validate the non-AI half of AWA's value first, "without yet requiring AI-powered customization" (MVP §18).

**If/when this capability eventually gets built** (outside this MVP's scope), the kind of AI capability involved would be a text-in/text-out natural-language rewriter — given existing text and a plain-language change request, produce revised text. It wouldn't need to classify, perceive, plan, or act — only transform text. That's a capability description, not a provider or model choice.

---

## 6. Agents / Multi-Step Tool-Using AI

**Decision: NOT REQUIRED.**

Staying conservative here, as instructed: nothing in the confirmed scope — MVP or full product — describes AI that reasons across multiple steps, picks which tool to use, or acts on a user's behalf.

Even the *deferred, non-MVP* prompt-rewrite engine (FEAT-012) is a single, direct exchange: send the current prompt plus the user's request to an outside service, get back a rewritten prompt. There's no decision loop, no AI-chosen tool calls, no chaining.

More tellingly, AWA's product boundary explicitly and permanently rules out the one capability that *would* actually require an agentic architecture: one-click "run this on the AI tool for me" automation is named as out of scope in `01-PROBLEM.md` §21 and formalized as an exclusion in `03-REQUIREMENTS.md` §F. AWA's confirmed role stops at hand-off — a person copies a prompt and pastes it into an external tool themselves (REQUIREMENTS §G, AWA-Specific Product Boundary). That's a deliberate, stated design boundary, not a gap waiting to be filled by an agent down the line.

Agents are NOT REQUIRED, and unlike AI Capability (Section 5), nothing in the source material suggests this changes even in AWA's imagined future state.

---

## 7. External Integrations

**Decision: REQUIRED — scoped to one integration: the payment provider.**

The reasoning framework itself draws a sharp, important line here, and it applies directly to AWA: *recommending* an external AI tool isn't the same as *integrating* with it. AWA's confirmed behavior is "use this AI tool and copy this prompt" (FEAT-017/018) — the user manually carries the prompt over to Midjourney, Runway, or whatever tool was recommended. No system-to-system communication with any of those platforms exists anywhere in the confirmed MVP or full-product scope; one-click automation is explicitly excluded (see Section 6).

Going candidate by candidate:

| Candidate Integration | Decision | Why |
|---|---|---|
| Payment provider (Razorpay at launch) | **REQUIRED** | A subscriber needs to actually be able to pay for the MVP's core monetization gate to be a real test rather than a mock-up (FR-028, FR-044; FEAT-024, FEAT-038). |
| External AI generation platforms (Midjourney, Runway, Sora, etc.) | **NOT REQUIRED** | Informational recommendation only — no system-to-system communication is confirmed anywhere; automation is explicitly out of scope. |
| Outside AI rewriting service | **NOT REQUIRED for MVP** | Entirely part of the deferred customization engine (MVP §13: "Not Required for MVP"). |
| Speech-to-text service | **NOT REQUIRED for MVP** | Only relevant to voice customization (FEAT-011), itself part of the deferred engine. |
| Analytics services | **NOT REQUIRED** (see Section 11) | No dedicated analytics platform is confirmed as necessary to gather the MVP's own evidence needs. |

---

## 8. Authentication

**Decision: REQUIRED, narrowly scoped.**

This one genuinely splits into two answers, and the split is well-supported by the source material rather than something layered on top of it.

- **Can the discovery portion of the journey work anonymously?** Yes, explicitly and confirmedly. MVP §16's acceptance criteria say a user can enter the workflow "with no sign-in required," and free browsing/searching/previewing is a confirmed scope boundary (FR-026).
- **Can the entire journey work anonymously, start to finish?** No. Subscription is the MVP's core monetization mechanism under test (MVP §10, "Business Signal"), and a subscription is inherently something that must be recognized *on a later visit* — a yearly or lifetime plan means nothing if the system can't tell, the next time this person opens AWA, that they've already paid. That calls for some persistent, recognizable identity for a subscriber, not just a same-session flag.
- **Is this actually confirmed, or is it an inference?** It's well-supported, not invented: MVP §16 draws the "no sign-in required" line specifically around *browsing*, which only makes sense if sign-in is required somewhere else in the journey. `01-PROBLEM.md` §15 separately confirms a "signed in" concept exists as a constraint ("one device signed in at a time"), and FR-030/FEAT-026 (device session limits) are only deferred in their *enforcement* — their presence in the confirmed (non-excluded) requirement set confirms sign-in itself is a real, standing product concept, not something introduced here.
- **Do admins need a separate identity?** Yes — the whole admin capability set (FEAT-029–033, 038) only makes sense if the system can distinguish an administrator from an anonymous visitor or a subscriber.

So: Authentication is REQUIRED, but only to recognize two identities — a subscriber (so paid access carries across visits) and an administrator (so content/config management stays restricted) — not to gate the free discovery journey, which is confirmed to work without it. The specific mechanism (what someone actually uses to prove that identity) is a technology decision and stays out of this document.

---

## 9. Cloud Deployment

**Decision: REQUIRED to run the product** (distinct from scaling infrastructure, which is not required).

- **Does it need to be reachable remotely?** Yes — the confirmed audience is mobile-first (PROBLEM §6), which implies real users reaching AWA from their own devices over the internet, not a tool run locally.
- **Server-side processing?** Yes, established in Sections 2–3.
- **External services?** Yes — the payment provider is itself an internet-based service the backend needs to reach (Section 7).
- **Is it meant for remote users on an ongoing basis, not just a one-off demo?** Yes. MVP §18's "Evidence Required to Move to the Next Phase" depends on real usage plus real conversion/feedback data across all five categories over time — which requires the product to stay continuously reachable by real external users, not just run once for a local audience.
- **Could the MVP's validation goal be met by running it locally?** No — the entire point is gathering evidence from real users completing a genuine subscription/payment flow (MVP §10, §14, §18), which a local-only deployment can't produce.

What this does **not** require: multi-region hosting, autoscaling, load balancing, or any other scaling infrastructure. Those would be exactly the kind of premature scaling the guiding principles rule out — nothing in the source material states or implies a user-volume target that would justify them.

---

## 10. Background Processing

**Decision: NOT REQUIRED.**

Checking each example category against the confirmed MVP:

- **Scheduled jobs / batch processing** — none confirmed. Admins manage content (categories, templates, tool list) through direct, synchronous CRUD actions (FEAT-029–033), not scheduled jobs.
- **Long-running processing** — none. Every MVP action (browse, view, subscribe, copy, give feedback) finishes within a normal request/response.
- **Queue-based work** — none identified anywhere in the source material.
- **Notifications** — none confirmed for the MVP (no renewal reminder, spending-cap alert, or similar requirement appears; those ideas only exist in the deferred customization engine or as explicitly undecided future policy questions).
- **Content synchronization / periodic external-tool updates** — the tool/model master list (FEAT-032) is manually maintained by an admin, not auto-synced from an external source.
- **Payment confirmation, specifically** — worth calling out directly, since payment flows can *look* asynchronous: even if confirming a transaction involves a callback or a server-to-server verification step, that's still synchronous coordination with an external service (falling under Section 2's "coordinate external services" and Section 7's integration) that completes within the user's live request — not decoupled, queued, or scheduled work independent of it.

For a genuinely simple request → response product like this MVP, background processing would add infrastructure the confirmed scope doesn't call for.

---

## 11. Other Architectural Components Considered

Beyond the ten primary categories above, the following were evaluated because they're common candidates for a product like this — each is included here specifically because it's addressed (directly or by clear implication) in the source material, not by default.

| Component | Decision | Why |
|---|---|---|
| Search (dedicated search infrastructure) | **NOT REQUIRED** | FR-002/FEAT-002's MVP-scoped "basic browse/tag filter" runs over a deliberately small, curated catalog (MVP §5) — ordinary database querying handles it fine. A dedicated search engine follows exactly the same reasoning the MVP itself uses to exclude the AI model filter (FEAT-003): discovery machinery the current catalog volume simply doesn't justify. |
| File / Object Storage | **NOT REQUIRED** | No confirmed MVP content is binary or media-based — prompts, descriptions, and usage steps are all text, and usage video (FEAT-019) is explicitly excluded from the MVP. |
| Caching | **NOT REQUIRED** | No performance, latency, or scale target appears anywhere in the source material (MVP §16 explicitly states no infrastructure criteria are specified). Adding it now would be exactly the kind of premature scaling the guiding principles rule out. |
| Analytics (dedicated platform) | **OPTIONAL** | The MVP's own evidence needs — subscription conversion, feedback sentiment, category-by-category comparison (MVP §10, §18) — can be read directly off the required persistent data (subscription and feedback records). A dedicated analytics layer would make that easier to read, but the MVP can gather its evidence without one. |
| Authorization (as a separate architectural layer) | **NOT REQUIRED as a separate component** | The access rules that exist (subscriber vs. non-subscriber vs. administrator) are simple, MVP-scoped rules that fit inside Application Logic (Section 2) alongside the Authentication identity check (Section 8) — not a standalone permissions architecture. |
| Notification System | **NOT REQUIRED** | No push/email/SMS requirement (renewal reminders, spending-cap alerts, etc.) appears in the MVP's confirmed scope; the concepts that would need this are either deferred with the customization engine or explicitly undecided future policy. |

---

## Minimum Required Architecture

```text
     Primary User                              Administrator
          |                                          |
          v                                          v
     User Interface                          Admin Interface
          |                                          |
          '------------------+------+----------------'
                              v
                Application / Backend Logic
        - catalog retrieval & basic browse/filter
        - paywall / access rule enforcement
        - tool & model recommendation assembly (tag lookup)
        - feedback capture & template linkage
        - subscription state management
        - admin content & configuration authoring
                              |
          +-------------------+--------------------+
          v                   v                     v
   Persistent           Authentication        External Payment
   Database             (subscriber &          Provider Integration
   - categories/         admin identity)             (Razorpay)
     templates
   - tool/model list
     & tag assignments
   - usage steps
   - subscriptions
   - feedback records

           — all of the above reachable via Cloud Deployment —

                              |
                              v
          User copies the finished prompt and pastes it
          into an External AI Tool of their choice —
          outside AWA's architecture; no system-to-system
          integration exists at this boundary.
```

This is the MVP's real shape, not an illustrative default: one UI component (two surfaces), one backend, one database, one narrowly-scoped authentication capability, one external integration, reachable over the internet. Nothing here is a microservice, a queue, an AI call, or an agent.

---

## Optional Components

### Analytics (dedicated reporting/analytics capability)
- **Why it could help:** MVP §18 specifically calls out that comparing engagement/conversion *across all five categories at once* generates evidence toward the currently-unresolved category-priority question (PROBLEM §18). A dedicated analytics layer would make that comparison easier to read at a glance.
- **Why the MVP doesn't need it:** the underlying data (subscription records, feedback records) is already captured by the REQUIRED database (Section 3) as a byproduct of normal operation — the evidence exists either way; analytics only changes how conveniently it can be read.
- **What would justify adding it later:** once real usage data exists across all five categories and the comparison in MVP §18 needs to happen repeatedly rather than just once informally, a dedicated capability becomes worth its cost.

Nothing else evaluated in this document met the "useful but not essential" bar — everything else either had a confirmed MVP need (making it REQUIRED) or offered no traceable MVP value at all (making it NOT REQUIRED — see above and Section 11).

---

## Not Required for the MVP

- **AI Capability** (Section 5) — the MVP's prompt delivery and tool recommendation are both fully static/admin-curated; the one place real AI appears (FEAT-012) is explicitly deferred pending unresolved cost and provider questions (PROBLEM §19, Q1).
- **Agents / multi-step tool-using AI** (Section 6) — no confirmed capability, now or in AWA's stated future, involves autonomous reasoning, AI-selected tool use, or AI acting on a user's behalf; "run this for me" automation is explicitly and permanently out of scope.
- **Background processing** (Section 10) — every MVP interaction is synchronous request/response.
- **Direct integrations with external AI tools** (Midjourney, Runway, Sora, etc.) — AWA recommends by name; the user manually copies and pastes. No system-to-system connection is confirmed anywhere.
- **Additional payment providers beyond Razorpay** — NFR-010 confirms this as explicitly future-facing; the MVP integrates Razorpay only.
- **Dedicated search infrastructure, caching, file/object storage, and a standalone notification system** (Section 11) — each evaluated individually above; none has a traceable MVP need.
- **Microservices or a split/multi-service backend** — never a live candidate here; one Application/Backend Logic component (Section 2) serves both the end-user and admin surfaces without needing to be broken apart.
- **A complex integration layer/abstraction** — with exactly one confirmed external integration (payment), there's no integration-orchestration problem worth abstracting yet.
- **Broad identity infrastructure** (multiple sign-in providers, federated identity, etc.) — Authentication (Section 8) is required, but only for two simple identities (subscriber, administrator); nothing in the source material calls for more than that.
- **Device session limit enforcement** — FEAT-026 exists as a confirmed *future* feature but is explicitly deferred out of the MVP (MVP §3, §11); the baseline Authentication capability above doesn't need to implement it yet.
- **Persistent storage beyond what's listed in Section 3** — nothing was over-scoped; every persistent data item cited traces to a specific requirement.

---

## Architecture Rationale

**1. What's the simplest architecture that can deliver the MVP?**
A user-facing interface plus an admin interface (one component type, two surfaces), talking through a defined communication boundary to a single application/backend logic component, backed by one persistent database, with a narrowly-scoped identity capability for subscribers and admins, one external integration (the payment provider), all reachable over the internet. That's the whole list.

**2. Which components are truly non-negotiable?**
The seven marked REQUIRED in the Component Decision Matrix: User Interface, Application/Backend Logic, Persistent Database, API Layer, External Integrations (payment only), Authentication (scoped), and Cloud Deployment.

**3. Which components were deliberately left out?**
AI Capability and Agents (Sections 5–6), Background Processing (Section 10), and — at a more granular level — dedicated Search, Caching, File/Object Storage, and a standalone Notification System (Section 11). Each exclusion is a specific, cited decision, not an oversight.

**4. What assumptions shaped these decisions?**
Two are worth naming directly, since they're inferences rather than quoted statements:
- That a persistent, recognizable identity is needed for subscribers (Section 8) — strongly implied by the "no sign-in required for browsing" phrasing and the confirmed "signed in" concept elsewhere, but not spelled out in those exact words anywhere in the source material.
- That the end-user and admin interfaces can be treated as one architectural component type without necessarily being separate deployable products — a minimum-complexity reading consistent with the guiding principles, but not something the source material explicitly confirms or rules out.

**5. What future developments could change these decisions?**
- Resolving the AI-rewrite provider and per-call cost question (PROBLEM §19, Q1) would move AI Capability from NOT REQUIRED to REQUIRED, likely bringing a second external integration (speech-to-text, for FEAT-011) and a case for Background Processing (to aggregate the customization-insights report, FEAT-035) along with it.
- Sustained catalog growth beyond the MVP's "small, curated" scope (MVP §5, §12) would strengthen the case for dedicated Search.
- Real usage volume, once live, could justify Caching.
- Resolving the device-session-limit policy (FR-030, currently undecided between one and two devices) would extend Authentication's scope without changing that it's REQUIRED.
- Resolving the renewal/lapse and spending-cap policy questions (PROBLEM §18–19) could introduce a genuine Notification need.

---

## Requirement-to-Architecture Traceability

| Requirement(s) | Feature(s) | MVP Capability | Required Component(s) |
|---|---|---|---|
| FR-001 | FEAT-001 | Browse categories/subcategories | User Interface, Application Logic, Database |
| FR-002, FR-004 | FEAT-002 | Preview/filter a template before paying | User Interface, Application Logic, Database |
| FR-005 | FEAT-004 | Select a template | User Interface, Application Logic |
| FR-007 | FEAT-006 | Instant static prompt display | User Interface, Application Logic, Database |
| FR-008 | FEAT-007 | Blurred preview for non-subscribers | User Interface, Application Logic, Authentication |
| FR-009 | FEAT-008 | Full prompt view for subscribers | User Interface, Application Logic, Database, Authentication |
| FR-010 | FEAT-009 | Copy prompt text | User Interface |
| FR-019 | FEAT-017 | Tool/model recommendation (tag lookup, not AI) | User Interface, Application Logic, Database |
| FR-020 | FEAT-018 | Usage steps | User Interface, Application Logic, Database |
| FR-022–FR-025 | FEAT-020, FEAT-021 | Feedback capture & template linkage | User Interface, Application Logic, Database |
| FR-026 | FEAT-022 | Free, anonymous browsing | User Interface, Application Logic |
| FR-027 | FEAT-023 | Subscription paywall enforcement | Application Logic, Database, Authentication |
| FR-028 | FEAT-024 | Subscription plan selection & payment | User Interface, Application Logic, Database, Authentication, External Integration (Razorpay) |
| FR-029 | FEAT-025 | No prompt-sharing mechanism | *(satisfied by omission — no component required)* |
| FR-035 | FEAT-029 | Manage categories (admin) | Admin Interface, Application Logic, Database, Authentication |
| FR-036 | FEAT-030 | Author templates/prompts (admin) | Admin Interface, Application Logic, Database, Authentication |
| FR-037, FR-038 | FEAT-031, FEAT-032 | Assign & maintain tool/model tags (admin) | Admin Interface, Application Logic, Database, Authentication |
| FR-039 (partial) | FEAT-033 | Author usage steps (admin) | Admin Interface, Application Logic, Database, Authentication |
| FR-044 (partial) | FEAT-038 | Configure payment provider (admin) | Admin Interface, Application Logic, Authentication, External Integration (Razorpay) |
| NFR-008 | *(quality attribute)* | Content maintainable without developer involvement | Admin Interface, Application Logic, Database |
| NFR-003 | *(quality attribute)* | Core functionality independent of any AI service | Confirms AI's absence doesn't break anything — moot for this MVP since AI isn't built at all |

Every REQUIRED component in the matrix appears in this table at least once; nothing was marked REQUIRED without a traceable reason showing up here.

---

## Architecture Risks and Unknowns

**Known**
- The five launch categories are confirmed (PROBLEM §6) and all five ship at MVP launch (MVP §5).
- The entire customization/credits engine — and with it, the product's only real AI capability — is deferred, not built, for this MVP (MVP §3, §11, §18).
- Razorpay is the confirmed launch payment provider (PROBLEM §7, §15, §21).
- The MVP ships blurred preview as fixed, non-configurable behavior, not an admin toggle (MVP §3, excluding FEAT-039).

**Assumption**
- That subscriber recognition requires a persistent identity mechanism (Section 8) — well-supported by indirect confirmation, but not stated in those exact words anywhere in the source material.
- That the end-user and admin interfaces can be built as one architectural component type rather than two separate products — consistent with minimum necessary complexity, but not something the source material confirms or rules out either way.

**Unknown**
- Expected user volume at launch — affects how soon (if ever) Caching or Search genuinely become necessary.
- Which outside AI rewriting and speech-to-text providers will eventually be used, and at what cost (PROBLEM §7, §18, §19 Q1) — this blocks not just pricing but the entire future AI Capability decision.
- Whether the device-session limit will land at one device or two (FR-030) — doesn't change that Authentication is REQUIRED, but affects its eventual scope.
- Whether payment confirmation will be resolved via a synchronous check or a callback-style mechanism — a technology decision correctly left out of scope here, but worth flagging as unresolved.

---

## Future Considerations

None of the following are part of the MVP architecture; each is noted only because a specific, confirmed future item in the source material would introduce it.

- **AI Capability** — once an AI rewriting provider is selected with a known per-call cost, and MVP evidence shows users actually want to alter the base prompt (MVP §15, Future Q8).
- **A second external integration (speech-to-text)** — only relevant alongside the above, for voice customization (FEAT-011).
- **Background Processing** — to aggregate the customization-insights report (FEAT-035) once the customization engine exists, and potentially for renewal/lapse or spending-cap notifications once those policies are resolved.
- **Dedicated Search** — if the catalog grows substantially beyond the MVP's intentionally minimal, curated set (MVP §5, §12).
- **Caching** — if real usage volume, once live, warrants it.
- **A dedicated Analytics capability** — to make the MVP's own category-comparison and conversion analysis (MVP §18) easier to repeat at scale.
- **Expanded Authentication scope** — actual device-session-limit enforcement (FEAT-026), once the one-vs-two-device policy is resolved.
- **Additional payment providers** — confirmed as future-facing (NFR-010), beyond Razorpay at launch.
- **Multi-language content management** (FEAT-034) and **File/Object storage** (only if usage video, FEAT-019, is ever built) — both confirmed, valid future features with no present architectural need.
- **A Notification system** — if renewal, lapse, or spending-cap user-facing messaging is defined in a future policy decision.

---

## Architecture Decision Summary

| Component | MVP Decision |
|---|---|
| UI | **REQUIRED** |
| Backend | **REQUIRED** |
| Persistent Database | **REQUIRED** |
| API | **REQUIRED** |
| AI | **NOT REQUIRED** |
| Agents | **NOT REQUIRED** |
| External Integrations | **REQUIRED** (payment provider only) |
| Authentication | **REQUIRED** (subscriber + admin identity only) |
| Cloud Deployment | **REQUIRED** |
| Background Processing | **NOT REQUIRED** |

### Minimum Architecture
User Interface (end-user + admin surfaces) → Application/Backend Logic → Persistent Database, with a narrowly-scoped Authentication capability and one External Integration (payment provider), all reachable via Cloud Deployment. Seven component types — nothing more.

### Deliberately Excluded
AI Capability, Agents, Background Processing, dedicated Search, Caching, File/Object Storage, and a standalone Notification System — each evaluated individually above and found to carry no traceable MVP need, unlike Analytics, which is genuinely useful-but-optional rather than unnecessary.

### Key Assumptions
That persistent subscriber identity is required (strongly implied, not verbatim-stated); that end-user and admin interfaces count as one architectural component type.

### Critical Unknowns
Expected launch user volume; which AI-rewrite and speech-to-text providers will eventually be selected and at what cost; the final one-vs-two-device session policy; the technical mechanism for payment confirmation.

### Future Considerations
AI Capability and its supporting integration, Background Processing, dedicated Search and Caching, a dedicated Analytics capability, expanded Authentication scope, additional payment providers, multi-language content management, and a Notification system — all confirmed as valid future scope, none required now.