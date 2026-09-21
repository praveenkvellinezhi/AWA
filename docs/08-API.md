# AWA — MVP API Contract Definition

**Status:** API contract definition stage. No technology stack, API framework, database technology, AI provider, or external vendor is selected here.
**Sources of truth:** `01-PROBLEM.md`, `02-USER-RESEARCH.md`, `03-REQUIREMENTS.md`, `04-FEATURES.md`, `05-MVP.md`, `06-ARCHITECTURE-DECISION.md`, `07-DATABASE.md`, `13-SECURITY-REVIEW.md`.
**Scope:** Only the 21-feature, 5-category, no-customization MVP, restricted to the persistent entities `07-DATABASE.md` already confirmed. This document does not re-open any architecture or data-model decision — it defines the contracts needed to read and write that already-confirmed data, and — per this revision — the authorization boundary that governs every one of those contracts.

```text
Problem → User Need → Requirement → Feature → MVP Flow → API Endpoint → Authorization Boundary
```

### Critical API Rule

> The API is responsible for enforcing data visibility and authorization. The client must never receive data it is not authorized to access. Public metadata, authenticated private data, subscriber-protected content, and administrator data must be separated at the API response boundary — never in the frontend, never by hiding a UI element, never by returning everything and trusting the client to withhold part of it.

Every section below exists to make that one rule concrete for a specific endpoint or data type.

---

## API Decision

API: REQUIRED

### Reason

`06-ARCHITECTURE-DECISION.md` §4 confirms an API Layer is REQUIRED: the end-user/admin interfaces and the backend are separate REQUIRED components (§1–2) that must exchange catalog, prompt, subscription, and feedback data, and the backend must separately communicate with the payment provider (FR-044). `13-SECURITY-REVIEW.md` further confirms the API is where AWA's primary server-to-client trust boundary is actually enforced — the frontend is never that boundary. This document defines that contract accordingly.

---

## 1. API Boundary

### A. Frontend → AWA Backend
Endpoints exposed by AWA for its own end-user and admin clients (`06-ARCHITECTURE-DECISION.md` §1: "two interface surfaces, one component type"). See Section 6.

### B. AWA Backend → External Services
Exactly one external system participates in the MVP: the payment provider (Razorpay, per `01-PROBLEM.md` and confirmed as the only REQUIRED external integration in `06-ARCHITECTURE-DECISION.md` §7). No other external service (analytics, notification, etc.) is required for the MVP. See Section 6.

### C. AWA Backend → AI Service
**Not required for the MVP.** `06-ARCHITECTURE-DECISION.md` §5 confirms AI Capability is NOT REQUIRED: every MVP prompt is static, admin-authored text, and tool/model "recommendations" are an admin-curated tag lookup, not model output (FEAT-006, FEAT-017). No AI service contract is defined for the confirmed MVP surface. Section 19 records, separately, what such an endpoint would have to satisfy *if and when* customization is formally promoted into scope — its presence there is not a promotion of that scope.

---

## 2. API Access Levels

Every endpoint in this document declares one of four access levels. These are the same four conceptual levels defined in `07-DATABASE.md` §0, applied here to the API surface specifically.

### PUBLIC
No authentication required. Can access public catalog/discovery information: categories, subcategories, published template metadata, descriptions, tags, AI tool/model information, recommendations, usage guidance.

### AUTHENTICATED USER
Requires a valid authenticated session. Can access: public data; the authenticated user's own private data; other explicitly authorized authenticated-user operations. **Cannot** access: another user's private data; subscriber-only prompt content without an active subscription; administrator data.

### SUBSCRIBER
Requires (1) a valid authenticated session, (2) a currently active subscription, and (3) authorization for the specific requested resource. Can additionally access protected base prompt content and any other subscriber-only resource the product defines. Being a subscriber does **not** provide access to other users' private data, administrator data, internal configuration, or payment secrets.

### ADMINISTRATOR
Requires (1) a valid authenticated session and (2) verified Administrator authorization. Can access authorized administrative operations and management data. Administrator access is always checked server-side — see Section 10.

### Authentication Is Not Authorization

A valid authenticated session establishes *who* is calling. It does not by itself establish *what they may do*:

```text
Authenticated User
        │
        ├── Public catalog        → YES
        ├── Own account           → YES
        ├── Protected prompt      → only if Subscriber
        ├── Other user's account  → NO
        └── Admin API             → NO
```

Every endpoint definition in Section 6 states both its Access Level and, where relevant, the further ownership/entitlement check layered on top of authentication.

---

## 3. API Data Visibility

The API must distinguish four visibility categories for the data it returns, matching `07-DATABASE.md` §0 and §18:

```text
PUBLIC DATA      → returned to any caller, authenticated or not
PRIVATE DATA     → returned only to the data's owner or an explicitly authorized system actor
SUBSCRIBER DATA  → returned only after current-subscription authorization
ADMIN DATA       → returned only to authorized administrators
```

A single database entity can, and in AWA's case does, contain fields belonging to different levels. `Template` is the canonical example:

```text
Template
PUBLIC:
  template_id, name, description, category, tags,
  tool recommendations, usage steps

SUBSCRIBER:
  prompt_text

ADMIN:
  is_published and other draft/unpublished management data
```

The API must never be designed around "fetch the whole database object, then let the frontend remove the private fields." The only acceptable shape is:

```text
Caller access level
       ↓
Authorization
       ↓
Select permitted fields
       ↓
Return response
```

This principle governs every endpoint below, and is why `GET /templates/{templateId}` (API-003) and `GET /templates/{templateId}/prompt` (API-004) remain two separate endpoints rather than one endpoint returning a variably-populated `Template` object.

---

## 4. Authentication & Authorization Model (applies throughout)

Two identities exist in the MVP data model (`07-DATABASE.md` §3): **User** (subscriber) and **Administrator**. No other role is invented. The four access levels in Section 2 are resolved as follows for every protected request:

```text
Request
  ↓
Verify the authenticated session server-side (Supabase Auth)
  ↓
Identify the authenticated user (from the verified session, never from a client-supplied ID)
  ↓
Determine role/subscription from trusted server-side data
  ↓
Authorize the specific endpoint and the specific requested resource
  ↓
Perform the operation
```

**Server-side verification is mandatory on every protected Route Handler.** Middleware, frontend route guards, hidden UI, and client-side auth state are not substitutes for this — each Route Handler independently verifies the caller, because a direct request to the endpoint (bypassing the frontend entirely) must be rejected exactly the same way a normal request through the UI would be.

The exact authentication mechanism (session token, bearer credential, etc.) is not specified anywhere in the source material and is not decided here — see Section 24 (Unknowns). What *is* decided here is that whatever the mechanism, it is checked independently by the API on every request that needs it — never inferred from the frontend having already checked it.

### Values Never Trusted From the Client

Restated from `07-DATABASE.md` §13, because it governs the API layer directly: the following must never be accepted from the client as a basis for authorization, under any circumstance —

```text
userId
subscriptionStatus
isSubscriber
isAdmin
role
```

Identity comes from the verified session. Subscription and administrative authorization are always resolved by loading trusted server-side state for that verified identity.

---

## 5. AWA Prompt Workflow (conceptual)

```text
User
 ↓
AWA Frontend
 ↓
AWA Backend
 ↓
Retrieve stored Template + prompt_text (no generation)
 ↓
Resolve caller's current entitlement server-side (Section 4)
 ↓
Retrieve stored TemplateToolRecommendation(s) + UsageStep(s)
 ↓
Shape a response containing only authorized fields (Section 3)
 ↓
Return prompt + recommendation + guidance
 ↓
User
```

No AI Service participates in this workflow for the MVP. The backend's role is retrieval, entitlement resolution, and response-shaping — never generation or assembly — consistent with `06-ARCHITECTURE-DECISION.md` §2 ("Generate or assemble prompts — **no**").

---

## 6. MVP API Surface

### Frontend → Backend

| ID | Method | Endpoint | Purpose | Access Level | Priority |
|---|---|---|---|---|---|
| API-001 | GET | `/categories` | Browse categories/subcategories | Public | P0 |
| API-002 | GET | `/templates` | Browse/filter templates within a category (published only) | Public | P0 |
| API-003 | GET | `/templates/{templateId}` | View a template's free details (description, tags, tool recommendations, usage steps) | Public | P0 |
| API-004 | GET | `/templates/{templateId}/prompt` | Retrieve prompt access state; full `promptText` only for an active subscriber | Public (blurred/locked response) / Subscriber (full `promptText`) | P0 |
| API-005 | POST | `/auth/session` | Identify/authenticate a User (subscriber) | Public (establishes the session) | P0 |
| API-006 | GET | `/users/me` | Retrieve the *caller's own* subscription state | Authenticated User (owner-scoped) | P0 |
| API-007 | POST | `/subscriptions` | Purchase a subscription plan | Authenticated User | P0 |
| API-008 | POST | `/templates/{templateId}/feedback` | Submit rating/comment/tool-used feedback | Authenticated User | P1 |
| API-009 | POST | `/admin/auth/session` | Identify/authenticate an Administrator | Public (credential-gated; establishes the session) | P0 |
| API-010 | POST | `/admin/categories` | Create a category/subcategory | Administrator | P0 |
| API-011 | PUT | `/admin/categories/{categoryId}` | Edit/reorganize a category | Administrator | P0 |
| API-012 | DELETE | `/admin/categories/{categoryId}` | Remove a category | Administrator | P0 |
| API-013 | GET | `/admin/templates` | List all templates, including drafts | Administrator | P0 |
| API-014 | POST | `/admin/templates` | Create a template (draft) | Administrator | P0 |
| API-015 | PUT | `/admin/templates/{templateId}` | Edit/publish a template | Administrator | P0 |
| API-016 | DELETE | `/admin/templates/{templateId}` | Remove a template | Administrator | P0 |
| API-017 | GET | `/admin/tools` | List AI tools/models, including retired | Administrator | P0 |
| API-018 | POST | `/admin/tools` | Add an AI tool/model | Administrator | P0 |
| API-019 | PUT | `/admin/tools/{toolId}` | Edit/retire an AI tool/model | Administrator | P0 |
| API-020 | POST | `/admin/templates/{templateId}/recommendations` | Assign a tool + reason to a template | Administrator | P0 |
| API-021 | PUT | `/admin/recommendations/{recommendationId}` | Edit a tool assignment/reason | Administrator | P0 |
| API-022 | DELETE | `/admin/recommendations/{recommendationId}` | Remove a tool assignment | Administrator | P0 |
| API-023 | POST | `/admin/templates/{templateId}/steps` | Add a usage step | Administrator | P1 |
| API-024 | PUT | `/admin/steps/{stepId}` | Edit/reorder a usage step | Administrator | P1 |
| API-025 | DELETE | `/admin/steps/{stepId}` | Remove a usage step | Administrator | P1 |
| API-026 | PUT | `/admin/settings/payment-provider` | Configure the (Razorpay) payment provider | Administrator | P1 |
| API-027 | GET | `/admin/templates/{templateId}/feedback` | Review feedback submitted for a template | Administrator | P1 |

### Backend → External Services

| ID | Method | Endpoint | Purpose | Access Level | Priority |
|---|---|---|---|---|---|
| API-028 | POST | *(to payment provider)* Initiate payment transaction | Start a checkout for a chosen plan | System-to-system (not user-facing) | P0 |
| API-029 | POST | *(from payment provider)* Payment confirmation | Learn that a payment succeeded/failed and update subscription state, only after independent verification | System-to-system, provider-authenticity verified | P0 |

### Backend → AI Service

None in the confirmed MVP surface. See Section 19.

---

## 7. API Response Access Matrix

| API Data | Anonymous | Authenticated Non-Subscriber | Subscriber | Administrator |
|---|---|---|---|---|
| Categories | YES | YES | YES | YES |
| Subcategories | YES | YES | YES | YES |
| Published template metadata | YES | YES | YES | YES |
| Template description | YES | YES | YES | YES |
| Template tags | YES | YES | YES | YES |
| AI tools/models | YES | YES | YES | YES |
| Recommendations | YES | YES | YES | YES |
| Usage steps | YES | YES | YES | YES |
| Full prompt (`prompt_text`) | NO | NO | YES | YES |
| Own user data | NO | YES | YES | Authorized |
| Other user's data | NO | NO | NO | Only when authorized |
| Subscription data | NO | Own only | Own only | Authorized |
| Feedback comments | NO | NO | NO | YES |
| Draft templates | NO | NO | NO | YES |
| Admin configuration | NO | NO | NO | YES |

This matrix is the source of truth for every endpoint's response shape in Section 8; where an individual endpoint definition and this matrix could be read as disagreeing, the matrix governs.

---

## 8. Endpoint Definitions

Each endpoint below follows the same shape: Access Level, Purpose, Requirement/Feature traceability, Request, Response (per authorization outcome, where more than one applies), Validation, Error Cases, Rate Limiting, Side Effects, Dependencies, Assumptions, and Open Questions. Endpoints unaffected in substance by this revision keep their original contract; the six flagged **[SECURITY-REVISED]** below contain the substantive change.

## API-001 — Browse Categories

**Access Level:** Public

### Endpoint
`GET /categories`

### Purpose
Return the categories/subcategories a user can browse, at a given level of the hierarchy.

### Requirement / Feature Traceability
FR-001 / FEAT-001.

### Request
Query: `parentCategoryId` (optional).

### Response
```json
{
  "categories": [
    { "categoryId": "cat-014", "name": "Product Photography", "hasSubcategories": false }
  ]
}
```

### Validation Rules
`parentCategoryId`, when provided, must reference an existing Category.

### Error Cases
Not Found (unknown `parentCategoryId`); Server Error.

### Rate Limiting
Optional.

### Side Effects
None (read only).

### Data Visibility
PUBLIC — entire response.

---

## API-002 — Browse/Filter Templates

**Access Level:** Public

### Endpoint
`GET /templates`

### Purpose
Return published templates within a category, optionally filtered by tag.

### Requirement / Feature Traceability
FR-002, FR-026 / FEAT-002, FEAT-022.

### Request
Query: `categoryId` (required), `tag` (optional).

### Response
```json
{
  "templates": [
    { "templateId": "tpl-231", "name": "Product Photography — Studio Light", "tags": ["minimal", "studio"] }
  ]
}
```

### Validation Rules
`categoryId` must reference an existing Category. Only templates with `is_published = true` are ever returned — unpublished/draft templates must not appear here or in any other public-facing listing, regardless of query parameters (Section 15).

### Error Cases
Not Found (`categoryId`); Server Error.

### Rate Limiting
Optional.

### Side Effects
None (read only).

### Data Visibility
PUBLIC — entire response. `prompt_text` is never included in a listing response under any circumstance, including ORM/query patterns that might otherwise pull related fields automatically (Section 16).

---

## API-003 — View Template Details

**Access Level:** Public

### Endpoint
`GET /templates/{templateId}`

### Purpose
Return a template's free-to-view content: description, tags, its tool/model recommendation(s) with reasons, and its usage steps. Per FR-026, all of this is explicitly free — only the prompt text itself is gated, and it is served by a *different* endpoint (API-004), never by this one.

### Requirement / Feature Traceability
FR-004, FR-019, FR-020, FR-026 / FEAT-002, FEAT-017, FEAT-018, FEAT-022.

### Request
Path: `templateId` (required).

### Response
```json
{
  "templateId": "tpl-231",
  "name": "Product Photography — Studio Light",
  "description": "A finished prompt for clean, studio-lit product shots...",
  "tags": ["minimal", "studio"],
  "recommendations": [
    { "toolName": "Midjourney", "reason": "Best for photorealistic product shots." }
  ],
  "usageSteps": [
    { "order": 1, "text": "Open Midjourney and paste the prompt." },
    { "order": 2, "text": "Set aspect ratio to 1:1." }
  ]
}
```

This response **never contains `prompt_text` or any field derived from it**, for any caller, including a subscriber — a subscriber retrieves the prompt from API-004. This is a deliberate contract choice, not an oversight: keeping the protected field on a separate endpoint makes it structurally impossible for a change to this endpoint's field selection to accidentally leak `prompt_text` (Section 16).

### Validation Rules
`templateId` must reference an existing, published Template.

### Error Cases
Not Found (unknown or unpublished `templateId`); Server Error.

### Rate Limiting
Optional.

### Side Effects
None (read only).

### Data Visibility
PUBLIC — entire response.

### Open Questions
Behavior when a template has zero configured tool recommendations is explicitly undecided in `03-REQUIREMENTS.md` (FR-019 Open Question); this endpoint returns an empty `recommendations` list in that case rather than an error, pending that decision.

---

## API-004 — Retrieve Prompt (Gated) **[SECURITY-REVISED]**

**Access Level:** Public for the locked response; Subscriber for `promptText`.

### Endpoint
`GET /templates/{templateId}/prompt`

### Purpose
Return the template's prompt access state — locked for a non-subscriber, with full text only for an active subscriber. This is the MVP's core value-delivery endpoint, and the API's single most important authorization boundary.

### Requirement / Feature Traceability
FR-007, FR-008, FR-009 / FEAT-006, FEAT-007, FEAT-008.

### The Problem This Revision Fixes
The API must not return

```json
{ "templateId": "...", "promptText": "...", "locked": true }
```

to a non-subscriber on the theory that the frontend will blur or hide `promptText`. Once `promptText` has left the server, it is fully exposed to that caller via browser DevTools, the Network tab, direct API inspection, JavaScript state, or a cached response, regardless of anything the UI does with it. The full field must simply not be present in the response body sent to an unauthorized caller.

### Request
Path: `templateId` (required). Identity credential, if the caller has one (optional — an unauthenticated caller is treated as a non-subscriber and receives the locked response, not an error, so that free browsing/evaluation remains frictionless per FR-026).

### Processing
```text
Request
  ↓
Verify session server-side, if present (Section 4)
  ↓
Resolve current subscription_status from trusted server-side data
  (never from a client-supplied isSubscriber/subscriptionStatus value)
  ↓
subscription_status == active for THIS caller and THIS templateId?
  ↓
YES → include promptText in the response
NO  → omit promptText entirely; return locked: true
```

The check is resource-specific: authorization is evaluated against the exact `templateId` requested, not merely "is this caller a subscriber in general" — this prevents a pattern where an authorized response for one template is replayed or assumed to apply to another (Section 17, IDOR protection).

### Response — Non-Subscriber
```json
{
  "templateId": "tpl-231",
  "locked": true,
  "promptPreview": null
}
```
`promptText` (or any field carrying its content) is **absent from the response body**, not merely null-displayed or styled as hidden.

### Response — Subscriber
```json
{
  "templateId": "tpl-231",
  "locked": false,
  "promptText": "A clean, studio-lit product photograph of..."
}
```

### Validation Rules
`templateId` must reference an existing, published Template. `promptText` is populated only when the resolved caller's `subscription_status` is `active` for the current, live request — never from a cached prior response, frontend state, localStorage, or a client-controlled cookie.

### Error Cases
Not Found (unknown/unpublished `templateId`); Server Error.

### Rate Limiting
Optional.

### Side Effects
None (read only).

### Dependencies
`Template.prompt_text`, `User.subscription_status` (`07-DATABASE.md`); API-005/API-006 (identity/subscription must be resolvable).

### Assumptions
Client-side copying of the returned `promptText` (FR-010) requires no further backend call once it has been legitimately retrieved by an authorized subscriber (see also API-018-adjacent guidance in Section 18 on a hypothetical copy endpoint).

### Open Questions
Whether non-subscribers should instead receive a hard block rather than a locked/withheld response is explicitly undecided (`03-REQUIREMENTS.md` Conflict C-1); the MVP ships the fixed `locked: true` behavior per `05-MVP.md` §3 (FEAT-039 excluded). Either way, the answer changes only what the *locked* response looks like — it never changes whether `promptText` may be included for a non-subscriber, which is never.

### Data Visibility
Mixed — public `locked` state and (for non-subscribers) a safe `promptPreview`; `promptText` itself is SUBSCRIBER-ONLY.

---

## API-005 — Authenticate / Identify User

**Access Level:** Public (this endpoint establishes the session)

### Endpoint
`POST /auth/session`

### Purpose
Recognize a returning User, or establish a new User identity, so that subscription state can be attached to the caller across visits.

### Requirement / Feature Traceability
FR-027 (implied identity) / FEAT-023, FEAT-024.

### Request
Body: `contactIdentifier` (required), a credential proving ownership of it (required; mechanism not specified — see Section 24).

### Response
```json
{ "userId": "usr-118", "sessionToken": "..." }
```

### Validation Rules
`contactIdentifier` must be non-empty.

### Error Cases
Unauthorized (missing/invalid credential); Server Error.

### Rate Limiting
**Required.** Authentication endpoints are explicitly abuse-prone (brute-force attempts, credential stuffing, automated abuse) — see Section 20.

### Side Effects
Database: creates a new User record if this identifier hasn't been seen before, or recognizes an existing one. User State: a session/identity credential is established.

### Dependencies
`07-DATABASE.md` User entity (`auth_user_id`, not a stored application credential — Section 4 of that document).

### Assumptions
A single endpoint handles both first-time registration and returning sign-in.

### Open Questions
The exact authentication mechanism is not specified anywhere in the source material — flagged as a Critical Unknown throughout `06-ARCHITECTURE-DECISION.md` and `07-DATABASE.md`.

### Data Visibility
Establishes AUTHENTICATED / USER-PRIVATE identity; no credential is ever echoed back beyond the session token itself.

---

## API-006 — Get Current User **[SECURITY-REVISED]**

**Access Level:** Authenticated User, strictly owner-scoped.

### Endpoint
`GET /users/me`

### Purpose
Let the client determine the *caller's own* subscription state, to render the correct paywall/unlocked experience and plan information.

### Requirement / Feature Traceability
FR-027, FR-028 / FEAT-007, FEAT-008, FEAT-023, FEAT-024.

### The Problem This Revision Fixes
Any endpoint returning user information must return only the authenticated caller's own data. `GET /users/me` means "the identity resolved from my verified session," never a client-suppliable `{ userId: "..." }` value. There is no `GET /users/{arbitraryUserId}` endpoint in this API surface, and none should be added without an explicit ownership/authorization check — an ordinary authenticated User is never authorized to read another User's record.

### Request
Identity credential (required).

### Response
```json
{
  "userId": "usr-118",
  "subscriptionPlan": "yearly",
  "subscriptionStatus": "active"
}
```
`contact_identifier` is **not** included here or in any other response unless the authenticated owner specifically needs to see/edit their own contact info — it is private data, not returned unnecessarily even to its own owner in every response that happens to include the User record (Section 22).

### Validation Rules
The identity credential must resolve to an existing User; the returned record is always and only the one belonging to that resolved identity.

### Error Cases
Unauthorized (missing/invalid credential); Server Error.

### Rate Limiting
Not Required.

### Side Effects
None (read only).

### Dependencies
API-005 (identity must already be established).

### Data Visibility
AUTHENTICATED / USER-PRIVATE, owner-only. `subscriptionStatus`/`subscriptionPlan` are security-sensitive entitlement data (`07-DATABASE.md` §12) — readable here by their own owner, but writable only by the trusted server-side process described in API-029, never by this or any client-facing endpoint.

---

## API-007 — Purchase a Subscription Plan

**Access Level:** Authenticated User

### Endpoint
`POST /subscriptions`

### Purpose
Let an authenticated User choose a plan (yearly or lifetime) and begin the payment process for it.

### Requirement / Feature Traceability
FR-028 / FEAT-024.

### Request
Body: `planType` (required) — `yearly` or `lifetime`.

### Response
```json
{ "checkoutReference": "chk-9931", "planType": "yearly", "amount": "₹199" }
```

### Validation Rules
`planType` must be one of the two confirmed plans.

### Error Cases
Bad Request (invalid `planType`); Unauthorized; Service Unavailable (payment provider unreachable — existing access, if any, unaffected); Server Error.

### Rate Limiting
Required — see Section 20 (payment-related endpoint).

### Side Effects
No database subscription-state change here — `subscription_plan`/`subscription_status` are updated only on confirmed, independently verified payment (API-029), never at initiation. External: initiates a transaction with the payment provider (API-028).

### Dependencies
`07-DATABASE.md` User entity; API-028/API-029.

### Open Questions
Whether the yearly plan auto-renews or requires manual renewal is explicitly undecided (`03-REQUIREMENTS.md` Open Question 7); this endpoint's contract for a renewal purchase versus a first purchase is not distinguished pending that decision.

### Data Visibility
Request/response concern only the caller's own subscription attempt; no other user's data is involved.

---

## API-008 — Submit Feedback **[SECURITY-REVISED]**

**Access Level:** Authenticated User

### Endpoint
`POST /templates/{templateId}/feedback`

### Purpose
Capture a user's rating (and optional comment/tool-used) for a template, linked to that template.

### Requirement / Feature Traceability
FR-022, FR-023, FR-024, FR-025 / FEAT-020, FEAT-021.

### Request
Path: `templateId` (required). Body: `rating` (required, `up`/`down`), `comment` (optional, free text), `toolUsed` (optional, AITool identifier).

### Processing
```text
1. Identify the authenticated caller (server-side session check)
2. Validate the template exists
3. Validate rating is present and one of the two allowed values
4. Validate comment (if present) against type/length rules — see below
5. Validate toolUsed (if present) references an existing AITool
6. Store the feedback
```

`comment` is **untrusted user-generated free text** from the moment it is received. It is stored as opaque text; it is never interpreted as HTML, executed as code, or concatenated into a query. This mirrors `07-DATABASE.md` §22 exactly — the API is the point where that rule is actually enforced, by validating type/length and passing the value only through parameterized storage operations (Section 21, 37).

### Response
```json
{ "feedbackId": "fb-552", "templateId": "tpl-231", "rating": "up" }
```

### Validation Rules
`templateId` must reference an existing Template. `rating` required, one of `up`/`down`. `toolUsed`, when present, must reference an existing AITool. `comment`, when present, has a defined maximum length and is treated as plain text only (never rendered as HTML on any admin review surface).

### Error Cases
Not Found (`templateId`); Bad Request (invalid `rating`); Unauthorized; Server Error.

### Rate Limiting
Optional (submission is low individual cost but still abuse-prone at volume; no numeric limit defined in source material).

### Side Effects
Database: creates one Feedback record.

### Dependencies
`07-DATABASE.md` Feedback, Template, AITool (optional).

### Assumptions
The caller need only be an identified User, not necessarily one with a currently active subscription (feedback can reasonably follow a lapsed subscription).

### Data Visibility
The submission itself is a write by its authenticated author; the stored `comment` is never public and is readable only by Administrators (API-027) — see Section 8's API-027 entry and Section 22 below.

---

## API-009 — Authenticate Administrator

**Access Level:** Public (credential-gated; establishes the session)

### Endpoint
`POST /admin/auth/session`

### Purpose
Recognize an Administrator so that content-management actions can be authorized.

### Requirement / Feature Traceability
FR-035–FR-038 / FEAT-029–033, FEAT-038.

### Request
Body: `loginIdentifier` (required), a credential proving ownership (required; mechanism not specified).

### Response
```json
{ "adminId": "adm-002", "sessionToken": "..." }
```

### Validation Rules
`loginIdentifier` must be provided.

### Error Cases
Unauthorized (missing/invalid credential); Server Error.

### Rate Limiting
**Required, with particular attention.** This endpoint deserves stronger protection than ordinary user authentication, because a successful compromise here affects the entire content-management surface, not one account (Section 20).

### Side Effects
None (an Administrator record must already exist — see Open Questions and Section 11; this endpoint never creates one).

### Dependencies
`07-DATABASE.md` Administrator entity (`auth_user_id`, no stored application credential).

### Open Questions
The provisioning mechanism for Administrator accounts is intentionally not decided here — see Section 11.

### Data Visibility
Establishes ADMIN-ONLY identity for subsequent requests.

---

## API-010 — Create Category

**Access Level:** Administrator

### Endpoint
`POST /admin/categories`

### Purpose
Create a new category or subcategory at any depth.

### Requirement / Feature Traceability
FR-035 / FEAT-029.

### Request
Body: `name` (required), `parentCategoryId` (optional), `displayOrder` (optional).

### Response
```json
{ "categoryId": "cat-014", "name": "Product Photography" }
```

### Validation Rules
`name` non-empty; `parentCategoryId`, when present, must reference an existing Category.

### Error Cases
Not Found (`parentCategoryId`); Bad Request (missing `name`); Unauthorized (no/invalid session); **Forbidden (authenticated but not an Administrator)**; Server Error.

### Rate Limiting
Not Required (privileged, low-volume, authenticated actor).

### Side Effects
Database: creates one Category record.

### Data Visibility
Write access is ADMIN-ONLY. This endpoint's authorization is checked at the Route Handler independently of whether the caller could reach an admin UI page at all — see Section 10.

*(API-011 through API-025 follow this identical Administrator-only pattern for their respective Category, Template, AITool, TemplateToolRecommendation, and UsageStep operations, each requiring independent server-side verification of both a valid session and Administrator authorization, and each returning Forbidden — not merely omitting a UI control — for an authenticated non-administrator caller. Their individual request/response shapes are otherwise unchanged from the original contract: edit/reorganize/remove for Category (API-011/012), list/create/edit-publish/remove for Template (API-013–016), list/add/edit-retire for AITool (API-017–019), assign/edit/remove for TemplateToolRecommendation (API-020–022), and add/edit-reorder/remove for UsageStep (API-023–025).)*

---

## API-013 — List All Templates (Admin)

**Access Level:** Administrator

### Endpoint
`GET /admin/templates`

### Purpose
Let an administrator see all templates, including unpublished drafts, for content management.

### Requirement / Feature Traceability
FR-036 / FEAT-030.

### Data Visibility
This is the one place `is_published = false` (draft) templates are ever returned. No public or subscriber-facing endpoint (API-002, API-003) ever includes unpublished content, under any query parameter (Section 15/16). `prompt_text` is appropriately visible here to its own author/administrator.

*(Remaining fields — request, response shape, validation, error cases — are unchanged from the original contract.)*

---

## API-014 — Create Template

**Access Level:** Administrator

### Endpoint
`POST /admin/templates`

### Purpose
Author a new template as a draft (`is_published = false`) with its finished prompt text.

### Requirement / Feature Traceability
FR-036 / FEAT-030.

*(Request/response/validation unchanged from the original contract — see prior version for full field list: `categoryId`, `name`, `description`, `tags`, `promptText`, all Administrator-only.)*

### Data Visibility
Writing `prompt_text` is an ADMIN-ONLY operation; reading it back through this admin surface is appropriate for the record's own author/administrator, and is a structurally separate concern from API-004's subscriber-gated read path.

---

## API-015 through API-025

Unchanged in substance from the original contract (edit/publish/remove Template; list/add/edit-retire AITool; assign/edit/remove TemplateToolRecommendation; add/edit-reorder/remove UsageStep) — all Administrator-only, all independently authorization-checked at the Route Handler per Section 10, all returning Forbidden rather than a silently-empty result for an unauthorized authenticated caller.

---

## API-026 — Configure Payment Provider **[SECURITY-REVISED]**

**Access Level:** Administrator

### Endpoint
`PUT /admin/settings/payment-provider`

### Purpose
Let an administrator configure the (Razorpay-only, per MVP scoping) payment provider settings needed to process subscriptions.

### Requirement / Feature Traceability
FR-044 (partial) / FEAT-038.

### The Problem This Revision Fixes
Provider account references and any configured secret must never be returned in any API response, to any caller, including the configuring administrator on a subsequent read — the response confirms that configuration succeeded, not what the configured values are. This mirrors the general secrets rule in Section 23.

### Request
Body: provider configuration values (conceptual; exact fields depend on the provider's own requirements, not specified in the source material).

### Response
```json
{ "configured": true }
```

### Validation Rules
Configuration values must be present in a form the provider accepts (exact rule set not specified).

### Error Cases
Bad Request; Unauthorized; Forbidden (non-administrator); Server Error.

### Rate Limiting
Not Required.

### Side Effects
Updates provider configuration (not a modeled entity in `07-DATABASE.md` — see Open Questions there).

### Dependencies
External service: payment provider.

### Data Visibility
ADMIN-ONLY to configure; the configured secret itself is never readable through any API response once stored (Section 23).

---

## API-027 — Review Template Feedback (Admin) **[SECURITY-REVISED]**

**Access Level:** Administrator

### Endpoint
`GET /admin/templates/{templateId}/feedback`

### Purpose
Let an administrator read the feedback submitted for a template.

### Requirement / Feature Traceability
FR-022–FR-025 / FEAT-020, FEAT-021.

### The Problem This Revision Fixes
There is no endpoint anywhere in this API surface that returns a template's feedback (including `comment`) to an ordinary authenticated User or to the public. Feedback comments are private by default; only this Administrator-scoped endpoint can read them. A future "public feedback browser" is out of MVP scope and would need its own explicit access-level decision, not an accidental opening of this one.

### Response
```json
{
  "templateId": "tpl-231",
  "feedback": [
    { "feedbackId": "fb-552", "rating": "up", "comment": "Worked great on the first try.", "toolUsed": "Midjourney" }
  ]
}
```

### Validation Rules
`templateId` must reference an existing Template.

### Error Cases
Not Found; Unauthorized; Forbidden (non-administrator); Server Error.

### Rate Limiting
Not Required.

### Side Effects
None (read only).

### Data Visibility
ADMIN-ONLY. `comment` in particular is never exposed through any other endpoint (Section 22).

---

## API-028 — Initiate Payment Transaction

**Access Level:** System-to-system (AWA backend → provider; not user-facing)

### Purpose
Start a checkout transaction with the payment provider for the plan a User selected (API-007).

### Requirement / Feature Traceability
FR-028, FR-044 / FEAT-024, FEAT-038.

### Request
Plan/amount information and a reference back to the initiating User/subscription attempt (exact shape defined by the provider, not by AWA).

### Error Cases
Provider unavailable/unreachable — checkout cannot proceed; the requesting User's existing access, if any, is unaffected.

### Side Effects
External: a checkout transaction is initiated with the payment provider. Database: none — no subscription state changes at initiation.

### Data Visibility
System-to-system; no end-user or admin client ever receives the provider credential used for this call (Section 23).

---

## API-029 — Payment Confirmation **[SECURITY-REVISED]**

**Access Level:** System-to-system, inbound; provider authenticity independently verified.

### Endpoint
*(External payment provider → Backend; exact mechanism TBD — see Open Questions)*

### Purpose
Learn that a previously initiated payment (API-028) succeeded or failed, and update the corresponding User's subscription state **only after independently verifying that evidence**.

### Requirement / Feature Traceability
FR-028, FR-044 / FEAT-024, FEAT-038.

### The Problem This Revision Fixes
Subscription state must never become active solely because the browser reports that payment succeeded:

```text
BAD:
Frontend → paymentSuccess=true → activate subscription
```

The only acceptable flow is:

```text
Payment Provider
       ↓
Server verifies payment (signature/provider-authenticity check)
       ↓
Verified result
       ↓
Database subscription state updated
       ↓
Subscriber access granted
```

If a webhook mechanism is used:

```text
Webhook
   ↓
Verify provider signature
   ↓
Validate event / transaction reference against a transaction AWA actually initiated (API-028)
   ↓
Process payment
   ↓
Update subscription
```

A random or forged `POST` to this endpoint must never be able to activate a subscription. The specific mechanism (webhook vs. synchronous provider verification vs. another approach) remains an integration decision left open below, but whichever is chosen, provider-authenticity verification happens *before* any write to `User.subscription_status`.

### Validation Rules
The confirmation must be verifiably from the configured provider before any subscription state is changed. The referenced checkout/transaction must correspond to a transaction AWA actually initiated (API-028).

### Error Cases
Unauthorized/rejected (confirmation cannot be verified as authentic) — no subscription state is changed. Not Found (unknown referenced transaction) — no subscription state is changed. Server Error.

### Rate Limiting
**Required.** This is an inbound endpoint reachable from outside AWA and warrants abuse protection specifically because of that exposure (Section 20).

### Side Effects
Database: updates `User.subscription_plan`, `subscription_status`, `subscription_start_date` — on successful, verified payment only. This is the *only* write path to those fields anywhere in the API (Section 4, `07-DATABASE.md` §12–13).

### Dependencies
API-028 (the transaction this confirms); `07-DATABASE.md` User entity.

### Open Questions
`06-ARCHITECTURE-DECISION.md` explicitly leaves open whether payment confirmation will be resolved via a synchronous check or a callback-style mechanism (webhook); this endpoint describes the conceptual capability required — provider-verified confirmation leading to a trusted state update — without deciding between them.

### Data Visibility
System-to-system inbound; no client ever calls this endpoint directly, and no client-supplied "success" flag is ever sufficient on its own.

---

## 9. End-to-End API Flow (Primary MVP Journey)

```text
User
  ↓
Frontend
  ↓
GET /categories (API-001)
  ↓
GET /templates?categoryId=... (API-002)
  ↓
GET /templates/{templateId} (API-003) — free description, recommendation, steps
  ↓
GET /templates/{templateId}/prompt (API-004) — locked: true (non-subscriber; promptText absent)
  ↓
POST /auth/session (API-005) — if not already identified
  ↓
POST /subscriptions (API-007) → Initiate Payment Transaction (API-028, external)
  ↓
[Payment Confirmation received and verified] (API-029, external → backend)
  ↓
GET /templates/{templateId}/prompt (API-004) — locked: false, full promptText, resolved fresh from current entitlement
  ↓
(Client-side: copy prompt — no API call, per FR-010)
  ↓
[User acts on the external AI tool — outside AWA's architecture]
  ↓
POST /templates/{templateId}/feedback (API-008) — optional
  ↓
User
```

No endpoint outside this list participates in the primary journey. Admin endpoints (API-009–API-027) are a separate, prerequisite content-authoring flow, independently authorization-checked, and not part of the end-user journey itself.

---

## 10. Admin API Authorization

Every `/admin/*` endpoint independently verifies Administrator authorization at the Route Handler — never relying only on `/admin` page-level UI protection or frontend routing middleware to keep it safe:

```text
Request
   ↓
Valid session?
   ↓
Administrator?
   ↓
Authorized operation?
   ↓
Database operation
```

A direct request to any admin API endpoint (bypassing the admin UI entirely — e.g., via a raw HTTP client) must be rejected identically to a request from an unauthorized page. These are independent, layered security checks, not one check expressed in two places:

```text
Admin UI route protection
+
Admin API authorization
+
Database/RLS protection (07-DATABASE.md §20)
```

Removing an admin link from the frontend does not protect the underlying API — the API's own authorization check is what protects it, and it exists whether or not the UI happens to expose a path to reach it.

The following are the confirmed write operations requiring Administrator authorization, matching Section 6's admin table exactly: create/update/delete/reorganize Category; create/update/publish/unpublish/delete Template (including any write to `prompt_text`); create/update/retire AITool; assign/update/delete TemplateToolRecommendation; create/update/delete UsageStep; configure the payment provider.

---

## 11. First Administrator Provisioning

The API must not expose a public endpoint such as `POST /admin/create` that lets an arbitrary user create or promote themselves into an Administrator account. Restated from `07-DATABASE.md` §8:

```text
The first Administrator must be created through a controlled,
non-public provisioning mechanism.

There must not be a publicly accessible operation that allows
an ordinary user to create or promote themselves into an
Administrator.
```

The exact implementation (a manual database action, a protected setup script, an invite-only elevation process) remains an implementation/deployment decision outside this document's scope — what belongs here is the negative contract: no endpoint in Section 6, present or future, may accept a client-supplied `role`, `isAdmin`, or equivalent value and act on it to grant Administrator status.

---

## 12. IDOR Protection

A user must not be able to access protected content simply by changing a resource identifier in a request — e.g., changing `templateId=123` to `templateId=124`, or (hypothetically) a `userId` in a request path. The API always checks authorization against the *specific requested resource*, not merely "is this caller generally the right kind of caller":

```text
Authenticated user
+
Active subscription
+
THIS specific requested template
=
Authorized access
```

This is why API-004's authorization check (Section 8) is written as "for THIS caller and THIS templateId," and why API-006 always resolves to the caller's own identity rather than accepting any supplied identifier (Section 7 of this document, restated from the earlier draft's Section 6).

---

## 13. Prompt Copy — Not a Separate Authorization Surface

If prompt copying is ever implemented as its own endpoint (e.g., a hypothetical `POST /templates/{templateId}/copy`, distinct from simply reusing the client-side text already retrieved via API-004), it must follow the identical authorization rule as prompt viewing — it must not allow an unauthorized caller to retrieve `prompt_text` through a second path that the API-004 fix doesn't cover. In the MVP's actual, confirmed contract, no such endpoint exists: copying is a client-side action performed on text that was only ever delivered to an already-authorized subscriber via API-004 (FR-010). The UI's "Copy" button is not itself a security mechanism — the security already happened when API-004 decided whether to include `promptText` at all.

---

## 14. Published vs. Unpublished Content

Public template endpoints (API-002, API-003, API-004) query and return `is_published = true` content only. Draft/unpublished templates are visible exclusively through the Administrator-scoped `GET /admin/templates` (API-013) and related admin endpoints. This is a query-level guarantee, not a response-filtering one — the public endpoints' underlying queries are scoped to published content from the start, so there is no code path where a draft could be fetched and then merely left out of the serialized response.

---

## 15. Public Listings Must Not Leak Protected Fields

Endpoints such as API-002 (`GET /templates`) and API-003 (`GET /templates/{templateId}`) must not accidentally include `prompt_text`, whether through a hand-written query or an ORM pattern that pulls related/full-entity fields by default. This is why `prompt_text` lives on a structurally separate endpoint (API-004) rather than as an optionally-populated field on the Template object returned by API-002/API-003 — there is no query against those two endpoints, correct or mistaken, that could return it, because their underlying data-access layer never selects that column in the first place.

---

## 16. Owner-Scoped User Data

Any endpoint returning User information returns only the authenticated caller's own record unless the caller is an explicitly authorized Administrator/system process (Section 8, API-006). `contact_identifier` in particular — email/phone or whatever identifier form is chosen — is never included in public template responses, recommendation responses, other users' responses, or any subscriber response beyond the user's own account view; it is returned only where the authenticated user themself, or an authorized administrator with a legitimate reason, needs to see it.

---

## 17. Feedback Privacy

Feedback (`rating`, `comment`, `toolUsed`) is never exposed through a public or ordinary-user-facing endpoint. There is no `GET /templates/{id}/feedback` reachable by anything less than Administrator authorization (Section 8, API-027) — the confirmed MVP has no public feedback browser, and none should be added without a separate, explicit access-level decision. `comment` specifically is treated as untrusted, potentially sensitive free text end-to-end (Section 8, API-008): validated on the way in, never rendered as HTML anywhere it is displayed, and readable only by Administrators reviewing template quality.

---

## 18. AI Provider Key Handling

Not applicable to the confirmed MVP surface, since no AI Service integration exists (Section 1.C). This section is retained as a standing constraint for if/when Section 19's conditions are met: an AI provider key, if one is ever introduced, is used only by backend code, is never exposed through a `NEXT_PUBLIC_*`-style client-visible variable or any API response, and the browser never calls the AI provider directly:

```text
Browser → AWA API → AI Provider     (correct)
Browser → AI Provider directly       (never)
```

---

## 19. AI Customization — Explicitly Out of MVP Scope

`13-SECURITY-REVIEW.md` describes security requirements for a hypothetical `POST /templates/{templateId}/customize` endpoint. **This document does not add that endpoint to the confirmed MVP API surface.** `05-MVP.md` and `06-ARCHITECTURE-DECISION.md` §5 are unambiguous that the entire customization/credits engine is deferred pending unresolved AI-provider cost and selection questions. Discussing an endpoint's security requirements in the Security Review is not the same as promoting that endpoint into active scope, and this document does not treat it as such.

If and when a product owner formally promotes AI customization into scope, the resulting endpoint must satisfy all of the following before it can be considered complete:

```text
Authenticate
   ↓
Check active subscription
   ↓
Check requested-template authorization (resource-specific, per Section 12 — a manipulated
   templateId must not be usable to reach content the caller isn't authorized for)
   ↓
Check usage/credit allowance — BEFORE calling the AI provider, never after
   ↓
Validate the request body as untrusted input
   ↓
Call the AI provider (key never exposed to any client, per Section 18)
   ↓
Validate the AI provider's output as untrusted generated text —
   never executed, interpreted as code, or rendered as trusted HTML
   ↓
Return the customized prompt as plain text
```

Specific points worth naming, so they aren't lost if this endpoint is built later:

- **Subscription alone is not sufficient authorization.** Checking `subscription_status === active` and proceeding is not enough — the requested template itself must also be authorized for that caller, or a manipulated `templateId` could be used to reach protected content indirectly.
- **Credit/usage checks happen before the provider call, not after.** This protects both cost and abuse — the provider is never called for a request that would exceed allowance.
- **Credit limits and rate limits are different controls.** A credit limit governs total permitted usage; a rate limit governs how quickly requests can be made. This endpoint would need its own request-rate protection distinct from its usage-credit accounting (Section 20).
- **User customization input is untrusted.** The system instruction, the protected base prompt, and the user's customization request must remain clearly separated in whatever is sent to the AI provider — never blindly concatenated. Detailed AI prompt architecture belongs in `09-AI-DESIGN.md`, not here.
- **AI output is untrusted generated text.** It is returned as plain text and never executed, interpreted as code, or injected into the DOM as trusted markup.

None of this is a contract this document is defining for the MVP — it is a record of what any future promotion of this endpoint into scope would need to satisfy, so that promotion doesn't silently skip the security requirements the Security Review already identified.

---

## 20. Rate Limiting

| Endpoint(s) | Requirement | Why |
|---|---|---|
| API-005 (`POST /auth/session`) | **Required** | Authentication endpoints are explicitly abuse-prone: brute-force, credential stuffing, automated abuse. |
| API-009 (`POST /admin/auth/session`) | **Required, with particular attention** | Compromise here affects the entire content-management surface, not one account. |
| API-029 (payment confirmation) | **Required** | Inbound endpoint reachable from outside AWA; must be protected against abuse independent of its provider-authenticity check. |
| API-007 (`POST /subscriptions`) and other payment-initiating calls | **Required** | Payment-related endpoints generally warrant rate limiting per the Security Review, distinct from their business validation. |
| Public read endpoints (API-001–API-004) | Optional | High-traffic by design; no numeric limit defined anywhere in the source material. |
| Feedback submission (API-008) | Optional | Low individual cost but still worth bounding at volume. |
| Authenticated, low-volume admin write endpoints (API-010–API-027, excluding auth/payment-config) | Not Required | Privileged, low-volume, already gated by Administrator authorization. |
| A future AI customization endpoint (Section 19), if introduced | Its own, tighter rate limit, distinct from usage/credit limits | Rate limiting controls request *speed*; credit limiting controls total *usage* — they are separate controls and both would be needed. |

No numeric limit is invented anywhere in this table; each row states only whether limiting is required, optional, or not required, consistent with the rest of this document's refusal to fabricate figures the source material doesn't provide.

---

## 21. Request Validation

All API inputs are validated server-side — never trusted because the frontend already validated them. This applies to category IDs, template IDs, search/filter parameters, ratings, comments, payment identifiers, subscription parameters, administrative fields, and (if ever introduced) AI customization requests. For each: is the field present when required; does a reference (`categoryId`, `templateId`, `toolId`, `recommendationId`, `stepId`) point to an existing record; does an enum-like field (`rating`, `planType`) take one of its confirmed values. The specific validation library or mechanism (e.g., a schema-validation tool) is an implementation detail left open here — what this document fixes is that invalid input is rejected server-side, unconditionally, regardless of what client-side validation exists.

User-generated free text specifically (`Feedback.comment` today; any future customization-request text) is defined with an allowed type, a maximum length, a required/optional status, and validation behavior, and is never assumed safe by default (Section 8, API-008; Section 36 concept carried from the Security Review).

---

## 22. Error Responses

API errors never expose protected data: not `prompt_text` to an unauthorized caller, not database credentials, not Supabase service-role credentials, not payment secrets, not AI provider keys, not an internal stack trace containing any of the above. A safe error response states only what the caller needs:

```json
{ "error": "Unauthorized" }
```

Status-code conventions used consistently across every protected endpoint in Section 8:

```text
No session                                → 401 Unauthorized
Authenticated but insufficient permission → 403 Forbidden
Resource does not exist / concealed       → Not Found (or an equivalent
                                              non-revealing not-found behavior,
                                              where distinguishing "doesn't
                                              exist" from "exists but you can't
                                              see it" would itself leak information)
```

Exact status-code numbering can be finalized at implementation time; the behavioral distinction above is fixed here.

---

## 23. Secrets and Service-Role Access

The API layer never exposes the Supabase service-role key, the Razorpay secret key, or any other payment-provider secret, AI provider key, or comparable credential — through a response body, an error message, or a client-visible environment variable. Public keys intended for browser use (if any) are a distinct category and are not covered by this restriction.

Where a Route Handler uses the Supabase service-role key, it bypasses Row-Level Security entirely (`07-DATABASE.md` §20). Service-role access is therefore never treated as a substitute for the Route Handler's own authentication and authorization checks — a handler using elevated database access still independently verifies the caller and the caller's authorization for the specific operation, exactly as if RLS were the only thing standing between the request and the data. Service-role usage is minimized to the cases that genuinely require it (e.g., the trusted, provider-verified write in API-029).

RLS and Route Handler authorization are deliberately layered as defense-in-depth, not as alternatives to each other:

```text
Route Handler authorization
+
Database RLS
```

Neither layer assumes the other will catch every case.

---

## 24. External URL / SSRF Boundary

AWA does not expose an endpoint that fetches an arbitrary URL supplied by a user or administrator (no generic `POST /fetch-url`-style capability exists or is planned in this contract). For the one place an external system is called — the payment provider (API-028) — the destination is a fixed, configured provider endpoint, never one dynamically selected from user input. If an AI provider integration is ever introduced (Section 19), the same rule applies: the provider endpoint is fixed and configured, not derived from arbitrary user-supplied input.

---

## 25. API Versioning

**API Versioning: Not Required for MVP.**

The MVP has exactly one client generation (the end-user and admin interfaces defined in `06-ARCHITECTURE-DECISION.md` §1) with no confirmed requirement for multiple concurrent API contract versions, external third-party consumers, or a public API product.

---

## 26. API Documentation Gaps

### Confirmed
- Database and API Layer are both REQUIRED (`06-ARCHITECTURE-DECISION.md` §3–4).
- AI Capability is NOT REQUIRED for the MVP; no AI Service endpoint exists in the confirmed surface (Section 19).
- Only one external integration (payment provider) is required (`06-ARCHITECTURE-DECISION.md` §7).
- Browsing, template descriptions, tool recommendations, and usage steps are free; only `prompt_text` is subscription-gated (FR-026, FR-008, FR-009), and it is served exclusively by API-004.
- Copying a prompt (FR-010) requires no backend call beyond the prompt retrieval that already occurred through an authorized API-004 response.

### Assumptions
- A single `/auth/session` endpoint handles both first-time registration and returning sign-in for Users.
- Feedback submission requires only an identified User, not necessarily a currently active subscription.
- API-027 (admin feedback review) is necessary to make API-008's capture endpoint useful, even though no distinct FEAT ID names a "view feedback" capability.

### Unknowns
- The exact authentication/credential mechanism for both User and Administrator identities.
- The Administrator account provisioning mechanism (constrained per Section 11, not fully specified).
- Whether payment confirmation (API-029) will be a provider-initiated webhook or a different mechanism.
- Whether the yearly plan auto-renews (affecting whether API-007 needs a distinct "renew" contract later).
- What happens to child categories/templates when a parent Category is deleted (API-012), and to existing Feedback when its Template is deleted (API-016).
- Where payment-provider configuration values (API-026) are persisted — not modeled as an entity in `07-DATABASE.md`.
- Behavior when a template has zero configured tool recommendations (API-003).

---

## 27. Candidate Endpoints — Requires Validation

| Endpoint | Potential Purpose | Why Not Needed for MVP |
|---|---|---|
| `POST /templates/{id}/customize` | Submit a typed/spoken prompt-change request | Entire customization/credits engine deferred; if promoted, must satisfy Section 19 in full before shipping |
| `GET /templates/{id}/prompt/history` | Retrieve prior customized versions | Only relevant once customization exists |
| `GET /users/me/credits` | Check remaining customization credits | Moot without a credit system; deferred with customization |
| `POST /credits/purchase` | Buy a credit pack | Depends on customization cost being known; deferred |
| `POST /users/me/favorites` / `GET /users/me/favorites` | Save/retrieve favorite templates | Explicitly P2, excluded from MVP; if introduced, the relationship (which templates User A liked/saved) is private to User A even though an aggregate count may be public — see below |
| `GET /templates?model=...` | Filter templates by AI model | Deferred; MVP catalog is small enough that tagged tools are visible via API-003 without a dedicated filter |
| `POST /templates/blank-start` | Begin without selecting a template | Deferred |
| `GET /admin/customization-reports` | Aggregated customization-request insights | Nothing to aggregate without the deferred customization engine |
| `PUT /admin/settings/visibility` | Toggle blurred-preview vs. hard block for non-subscribers | MVP ships the fixed blurred/locked behavior; no admin-configurable entity exists yet |
| `GET /users/me/devices` / `DELETE /users/me/devices/{id}` | Enforce/manage device session limits | Deferred; the one-vs-two-device policy is undecided |
| `POST /admin/languages` | Manage supported languages/translations | Deferred; MVP is single-language |
| `POST /admin/templates/{id}/video` | Attach a usage video | Deferred; MVP uses written steps only |

**Note on a future Like/Save API:** if ever implemented, `POST /templates/{templateId}/like` and `/save` must associate the action with the authenticated caller, and *which* templates a given user liked/saved remains private to that user (`GET /users/{id}/likes` is never public). An aggregate count (`{"likeCount": 2400, "saveCount": 850}`) may be public even though the underlying per-user relationship is not — the same public-aggregate-vs-private-relationship distinction `06-ARCHITECTURE-DECISION.md`'s data-visibility principles apply elsewhere. None of this is added to MVP scope by virtue of being described here.

None of the endpoints in this section are included in the confirmed MVP API surface (Section 6).

---

## 28. Requirement → API Coverage

| Requirement | Feature | API | Coverage |
|---|---|---|---|
| FR-001 | FEAT-001 | API-001 | Full |
| FR-002 | FEAT-002 | API-002 | Full |
| FR-004 | FEAT-002 | API-003 | Full |
| FR-005 | FEAT-004 | *(client-side selection; no dedicated endpoint)* | Not Applicable |
| FR-006 | FEAT-005 | — | Not Applicable (excluded from MVP) |
| FR-007 | FEAT-006 | API-004 | Full |
| FR-008 | FEAT-007 | API-004 | Full |
| FR-009 | FEAT-008 | API-004, API-006 | Full |
| FR-010 | FEAT-009 | *(client-side clipboard action on an already-authorized API-004 response)* | Not Applicable |
| FR-019 | FEAT-017 | API-003 | Full |
| FR-020 | FEAT-018 | API-003 | Full |
| FR-021 | FEAT-019 | — | Not Applicable (excluded from MVP) |
| FR-022, FR-023, FR-024 | FEAT-020 | API-008 | Full |
| FR-025 | FEAT-021 | API-008, API-027 | Full (template-level, per MVP scoping) |
| FR-026 | FEAT-022 | API-001, API-002, API-003 | Full |
| FR-027 | FEAT-023 | API-004, API-005, API-006 | Full |
| FR-028 | FEAT-024 | API-007, API-028, API-029 | Full |
| FR-029 | FEAT-025 | — | Not Applicable (no share endpoint exists) |
| FR-030 | FEAT-026 | — | Not Applicable (excluded from MVP) |
| FR-035 | FEAT-029 | API-010, API-011, API-012 | Full |
| FR-036 | FEAT-030 | API-013, API-014, API-015, API-016 | Full |
| FR-037 | FEAT-031 | API-020, API-021, API-022 | Full |
| FR-038 | FEAT-032 | API-017, API-018, API-019 | Full |
| FR-039 | FEAT-033 | API-023, API-024, API-025 | Full (written steps only) |
| FR-040 | FEAT-034 | — | Not Applicable (excluded from MVP) |
| FR-041 | FEAT-035 | — | Not Applicable (excluded from MVP) |
| FR-042, FR-043 | FEAT-036, FEAT-037 | — | Not Applicable (excluded from MVP) |
| FR-044 | FEAT-038 | API-026, API-028 | Partial (Razorpay-only) |
| FR-045 | FEAT-039 | — | Not Applicable (fixed behavior, no config endpoint) |
| FR-046 | FEAT-040 | — | Not Applicable (excluded from MVP) |

No Gap exists for any requirement confirmed in scope for the MVP.

---

## 29. Core API Access Flow

```text
                    API REQUEST
                         │
                         ▼
                Identify Caller
                         │
             ┌───────────┴───────────┐
             │                       │
        Anonymous              Authenticated
             │                       │
             ▼                       ▼
       PUBLIC DATA          Determine Entitlement
                                     │
                         ┌───────────┼───────────┐
                         │           │           │
                      USER       SUBSCRIBER    ADMIN
                      PRIVATE    PROTECTED    ADMIN
                         │           │           │
                         └───────────┴───────────┘
                                     │
                                     ▼
                           Authorize Operation
                                     │
                                     ▼
                         Query Only Allowed Data
                                     │
                                     ▼
                              Shape Response
                                     │
                                     ▼
                                CLIENT
```

Every endpoint in Section 8 is an instance of this flow; none skip identity resolution, entitlement determination, or response-shaping, regardless of how simple the underlying data looks.

---

## 30. Highest-Priority Security Changes

### P0 — Must Change
1. Define Public / Authenticated / Subscriber / Administrator access levels (Section 2).
2. Implement server-side authorization on every protected Route Handler (Section 4).
3. Never send complete `prompt_text` to an unauthorized caller (API-004).
4. Remove the "send the prompt, hide it with CSS" pattern entirely (API-004).
5. Shape every API response according to the caller's access level (Section 3, 7).
6. Make subscription authorization server-authoritative (Section 4, API-004/006/029).
7. Verify *current* subscription status for every protected-prompt request, never a cached/prior one (API-004).
8. Protect every Admin API at the Route Handler level, independent of UI routing (Section 10).
9. Never expose a public first-admin creation path (Section 11).
10. Verify payment independently before activating a subscription (API-029).
11. Protect private user data — owner-scoped only (API-006, Section 16).
12. Prevent arbitrary `userId`/`templateId` authorization bypass (Section 12).
13. Apply RLS as defense-in-depth alongside Route Handler checks (Section 23; `07-DATABASE.md` §20).
14. Protect and minimize service-role database access (Section 23).
15. Keep all secrets server-side (Section 23).

### P1 — Should Change
16. Rate-limit authentication endpoints (Section 20).
17. Rate-limit payment endpoints (Section 20).
18. Rate-limit a future AI customization endpoint independently of its usage/credit limit, if introduced (Section 19–20).
19. Validate all API inputs server-side (Section 21).
20. Treat feedback and any future free-text input as untrusted (Section 8/API-008, Section 21).
21. Prevent SQL injection through parameterized database access (implementation-level, referenced here).
22. Prevent sensitive information from appearing in error responses (Section 22).
23. Restrict unpublished content to Administrators (Section 14).
24. Document future AI request/output privacy requirements now, so they aren't skipped later (Section 19).
25. Document future Like/Save ownership rules now (Section 27).
26. Document the external URL/SSRF boundary (Section 24).

---

## 31. API Decision Summary

### API Required
Yes.

### Reason
`06-ARCHITECTURE-DECISION.md` §4 confirms an API Layer is REQUIRED; `13-SECURITY-REVIEW.md` confirms this API is where AWA's server-to-client trust boundary is actually enforced.

### MVP Endpoints
29 total (27 Frontend → Backend, 2 Backend ↔ External Service, 0 Backend → AI Service).

### Access Levels
Four: Public, Authenticated User, Subscriber, Administrator (Section 2) — applied per-endpoint in Section 6 and, for mixed entities like Template, per-field via Section 3/7's data-visibility rules.

### The One Structural Fix This Revision Makes
`prompt_text` is served exclusively by API-004, which resolves current, resource-specific entitlement server-side on every request and omits the field entirely for anyone not authorized — never returned-then-hidden. No other endpoint (API-002, API-003) ever selects that field, so no future change to those endpoints can accidentally leak it.

### Authentication
Required for: API-004's subscriber-gated content, API-006, API-007, API-008, and every admin endpoint (API-009–API-027). Not Required for: catalog/template browsing (API-001–API-003) and the two identity-establishing endpoints themselves (API-005, API-009), each of which is nonetheless rate-limited. Exact mechanism: TBD (Section 26).

### External Integrations
Required — scoped to one: the payment provider, with subscription state changed only after independent, provider-verified confirmation (API-029), never on a client-reported success flag.

### Rate Limiting
Required for both authentication endpoints, the inbound payment-confirmation endpoint, and payment-initiating calls; optional for public reads and feedback; not required for authenticated low-volume admin writes (Section 20).

### AI Customization
Not part of the confirmed MVP API surface. Section 19 records, without promoting, the full set of requirements such an endpoint would need to satisfy if the product owner formally brings it into scope.

### Major Dependencies
- `07-DATABASE.md`'s confirmed entities, fields, and visibility levels — every endpoint's shape and authorization rule is drawn directly from them.
- The payment provider (vendor not selected here).
- Resolution of the authentication-mechanism unknowns before API-005/API-009 can be implemented.
- RLS policies (`07-DATABASE.md` §20) as the database-layer counterpart to this document's Route Handler checks.

### Critical Open Questions
1. What authentication mechanism will identify Users and Administrators?
2. How will Administrator accounts be provisioned, beyond the "controlled, non-public" constraint already fixed here?
3. Will payment confirmation (API-029) be a provider webhook or another mechanism?
4. Does the yearly plan auto-renew, and if so, does API-007 need a distinct renewal contract?
5. What is the intended behavior when a Category is deleted with children, or a Template is deleted with existing Feedback?
6. What should API-003 return when a template has zero configured tool recommendations?

---

**This document is the API contract baseline for AWA's MVP, revised to make the API the actual enforcement point for the data-visibility boundaries defined in `07-DATABASE.md` and required by `13-SECURITY-REVIEW.md`. Per the defined scope, work stops here — no implementation, framework selection, database technology selection, AI provider selection, external service implementation, or infrastructure design is undertaken.**