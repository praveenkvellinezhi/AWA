# AWA — 10-TECH-STACK.md

## Security & Architecture Alignment Changes

> Purpose: Update the technology-stack document so the selected technologies and their responsibilities are consistent with the requirements, architecture, API, database, and AI-design decisions.
>
> This document should describe **what technology is used and why**. Detailed security procedures belong in `13-SECURITY-REVIEW.md`, while endpoint behavior belongs in `08-API.md`.

---

# 1. Technology Stack Principles

AWA uses a full-stack Next.js architecture where the same application contains:

* Public customer-facing pages
* Authenticated user functionality
* Subscriber-only functionality
* Administrator functionality
* Backend API/Route Handlers
* External service integrations

The technology stack must therefore maintain a clear distinction between:

1. Client-side presentation
2. Server-side application logic
3. Database access
4. External service integrations
5. Secret credentials

The browser must never be treated as a trusted environment.

The server is responsible for authentication, authorization, validation, protected data access, payment verification, AI provider communication, and other privileged operations.

---

# 2. Core Technology Stack

## 2.1 Next.js

### Role

Next.js is the primary full-stack application framework.

It provides:

* Customer-facing pages
* Administrator pages
* Server Components
* Client Components
* Route Handlers
* Server-side application logic
* API endpoints
* Server-side integration with external services

### Architecture Rule

The application should use the Next.js server/client boundary intentionally.

### Client-side responsibilities

The client may handle:

* UI rendering
* User interaction
* Form input
* Loading/error states
* Public catalog browsing
* Subscriber UI after server authorization
* Sending requests to application APIs

The client must not be responsible for deciding whether a user is:

* Authenticated
* A subscriber
* An administrator
* Authorized to access a specific template
* Allowed to consume AI credits

Client-side state can improve the UI, but it is never the source of truth for authorization.

### Server-side responsibilities

Next.js Route Handlers/server-side code are responsible for:

* Authentication verification
* Authorization
* Subscription verification
* Administrator authorization
* Input validation
* Database access
* Rate limiting
* Payment verification
* AI provider calls
* Protected prompt retrieval
* Usage/credit checks
* External service communication

### Important

UI visibility is not an access-control mechanism.

Hiding a component, disabling a button, or checking a client-side subscription flag must never be considered sufficient protection.

---

# 3. Authentication and Authorization

## 3.1 Supabase Auth

Supabase Auth is responsible for user authentication.

It provides the authentication layer for AWA users and administrators.

The application should not implement its own password-storage or credential-management system.

### Application responsibility

After authentication, the application must determine the caller's authorization level.

AWA has four access levels:

| Access Level       | Description                                             |
| ------------------ | ------------------------------------------------------- |
| Public             | Anonymous or authenticated users can access public data |
| Authenticated User | Logged-in user and owner-scoped private data            |
| Subscriber         | User with an active subscription                        |
| Administrator      | Authorized platform administrator                       |

Authentication and authorization are separate concerns.

A valid authenticated session does not automatically grant subscriber or administrator access.

---

## 3.2 Server-Side Session Verification

Protected Route Handlers must verify the authenticated session on the server.

The server must not trust client-provided values such as:

```text
userId
isSubscriber
subscriptionStatus
isAdmin
role
```

These values may be displayed by the client for UI purposes but cannot be used as the authorization source.

The server obtains identity and authorization information from trusted server-side sources.

---

# 4. Supabase PostgreSQL

Supabase PostgreSQL is the primary relational database.

It stores application data such as:

* Categories
* Templates
* AI Tools
* Template/tool recommendations
* Usage steps
* Users
* Administrators
* Feedback
* Subscription/transaction state
* AI usage information
* Media/upload metadata (see Section 9)
* Future customization-related data

The database remains the source of truth for persistent application data.

---

# 5. Prisma

Prisma is the database access layer.

### Responsibilities

Prisma provides:

* Type-safe database access
* Query construction
* Relationship handling
* Schema management
* Parameterized database queries

### Database Access Rule

Application code should use Prisma's query builder rather than constructing SQL strings from user input.

User-controlled values include:

* Search terms
* Category IDs
* Template IDs
* Feedback text
* Customization requests
* Other free-text fields

Raw SQL should only be used when necessary and must remain parameterized.

Never concatenate user-controlled input directly into SQL.

---

# 6. Row Level Security

Supabase Row Level Security (RLS) provides an additional database-level access-control layer.

RLS should reflect the access model defined in the API and database documentation.

The four application access levels remain:

```text
PUBLIC
AUTHENTICATED
SUBSCRIBER
ADMINISTRATOR
```

RLS is defense-in-depth.

It does not replace server-side authorization in Next.js Route Handlers.

---

# 7. Supabase Service-Role Key

The Supabase service-role key has elevated database privileges and bypasses RLS.

Therefore:

* It must remain server-side.
* It must never be exposed to the browser.
* It must never use a `NEXT_PUBLIC_*` environment variable.
* It must not be treated as an authorization mechanism.
* Any Route Handler using it must perform explicit authorization before accessing protected data.

The service-role key should only be used where elevated server privileges are actually required — including issuing short-lived signed upload URLs for R2 (Section 9).

Where possible, use the normal authorization-aware database access path instead.

---

# 8. Redis / Upstash

Upstash Redis is used for application-level temporary/stateful infrastructure such as:

* Rate limiting
* Request throttling
* Temporary counters
* AI usage-related support where appropriate

Redis should not become the authoritative source for permanent business data unless explicitly defined elsewhere.

### Rate Limiting Responsibilities

Rate limiting should be applied particularly to:

* Authentication endpoints
* AI customization endpoints
* Payment endpoints
* Feedback endpoints
* Upload endpoints (Section 9)

Public browsing may use lighter or optional rate limiting depending on traffic requirements.

Rate limiting is an abuse-prevention layer and does not replace authorization.

---

# 9. Cloudflare R2

**Status: ACTIVE — confirmed in current scope.**

Cloudflare R2 is the object storage backend for an active file-upload feature, including:

* Template thumbnails
* Tutorial media
* Other application assets defined in `08-API.md`

### Upload Architecture

Because R2 now backs a live upload workflow, the application must implement the full upload security model rather than treating R2 as passive/reserved infrastructure:

* **File-type validation** — server-side MIME/type checks, not just file extension.
* **File-size limits** — enforced server-side before/at upload time.
* **Content inspection** — validate that uploaded content matches the declared type; reject unexpected payloads.
* **Restricted upload permissions** — only authorized roles (e.g. Administrator, or owner-scoped users where applicable) may request an upload URL. Upload authorization follows the same server-side authorization rules as every other protected operation (Section 3).
* **Short-lived signed upload URLs** — the Next.js server requests a signed upload URL from R2 using the service-role/R2 credentials; the browser never receives R2 secret credentials directly. Signed URLs must expire quickly and be scoped to a single object/operation.
* **Safe media serving** — served media must not be trusted as executable content; response headers and content-type handling must prevent stored files from being interpreted as scripts.

### Flow

```text
Browser
   ↓ (request upload)
Next.js Route Handler
   ↓
Authentication + Authorization
   ↓
Validation (file type/size)
   ↓
Generate short-lived signed R2 upload URL
   ↓
Browser uploads directly to R2 using signed URL
   ↓
Next.js confirms/records metadata in PostgreSQL
```

R2 secret credentials remain server-only at all times (Section 16). Detailed upload threat modeling belongs in `13-SECURITY-REVIEW.md`.

---

# 10. Payment Providers

## 10.1 Razorpay

Razorpay is the launch payment provider.

Razorpay handles payment processing.

AWA should store payment state and transaction information required for application functionality rather than raw payment credentials.

### Key distinction

Public Razorpay configuration may be exposed where required by the payment SDK.

Secret credentials must remain server-side.

---

## 10.2 Stripe

**Status: SCAFFOLDED — provider abstraction built now, not deferred.**

Stripe is being integrated now as a second payment provider behind the same provider-abstraction layer as Razorpay, even though Razorpay remains the primary/launch provider.

### Architecture Rule

The payment layer must be built as:

```text
Payment Service
        ↓
Payment Provider Adapter (interface)
        ↓
Razorpay Adapter   |   Stripe Adapter
```

* Business/subscription logic must call the abstraction, never a provider SDK directly.
* Both adapters must independently implement the verification rules in Section 11 (server-side verification, webhook signature validation).
* Stripe secret credentials follow the same server-only rule as Razorpay (Section 16), even while Stripe is not yet the default provider shown to users.
* Which provider is active/default for checkout is an application-configuration decision, not something the client selects arbitrarily.

---

# 11. Payment Verification

Payment success must not be determined merely from:

* A client-side success callback
* A browser redirect
* A user-provided payment ID
* A request claiming that payment succeeded

The backend must independently verify payment status with the payment provider — for whichever provider (Razorpay or Stripe) handled the transaction.

If provider webhooks are used:

* The webhook signature must be verified per-provider.
* The payload must not be trusted before verification.
* Subscription entitlement should only be updated after successful verification.

The application should maintain a separation between:

```text
Payment Provider (Razorpay or Stripe)
        ↓
Verified Payment State
        ↓
AWA Subscription Entitlement
```

---

# 12. AI Provider

**Status: IN SCOPE — AI customization is part of the current build, not deferred.**

AI customization uses a backend-mediated architecture.

The browser must never call the AI provider directly.

### Correct flow

```text
Browser
   ↓
Next.js Route Handler
   ↓
Authentication
   ↓
Subscription Authorization
   ↓
Template Authorization
   ↓
Usage/Credit Check
   ↓
Input Validation
   ↓
AI Provider
   ↓
Output Validation
   ↓
Browser
```

The AI provider API key must remain exclusively on the server.

It must never be placed in:

```text
NEXT_PUBLIC_*
```

environment variables.

---

# 13. AI Provider Abstraction

The application should communicate with the AI provider through a server-side abstraction rather than spreading provider-specific implementation throughout the application.

Conceptually:

```text
AI Customization Service
        ↓
AI Provider Adapter
        ↓
Configured AI Provider
```

This allows the provider to be changed without coupling the rest of the application directly to provider-specific APIs.

The provider endpoint must be application-controlled.

User input must never determine an arbitrary AI provider URL.

---

# 14. AI Scope and MVP Boundary

**Decision: AI customization is formally promoted into the active product scope for the current build.**

This means the full architecture defined in `09-AI-DESIGN.md` applies now, including:

* Authorization checks (subscription + template)
* Usage/credit checks
* Input validation and length/usage constraints
* Rate limiting on AI endpoints
* Output validation and safe handling
* Separation between admin-authored base prompt and user-specific customized prompt (Section 25)

Because AI customization is active:

* AI credentials must be configured and kept server-only (Section 16).
* The AI customization endpoint(s) defined in `08-API.md` are active, not placeholder.
* AI usage billing/credit logic, if defined elsewhere, is in scope.

> If AI scope changes again later (e.g. temporarily disabled), that change must be made explicitly in this document and reflected consistently in `08-API.md` and `09-AI-DESIGN.md` — scope must not drift silently.

---

# 15. Environment Variables and Secrets

All sensitive configuration must be supplied through environment variables.

Examples include:

```text
Supabase credentials
Upstash credentials
R2 credentials
Razorpay secret credentials
Stripe secret credentials
AI provider API key
Database credentials
```

Use:

```text
.env
.env.local
```

for local development as appropriate.

These files must be excluded from version control.

The repository should contain placeholder configuration such as:

```text
.env.example
```

but must never contain real production secrets.

---

# 16. Next.js Environment Variable Rule

Next.js exposes environment variables prefixed with:

```text
NEXT_PUBLIC_
```

to client-side code.

Therefore:

### Safe for client exposure only when explicitly intended

Public configuration such as certain public provider identifiers may use client-exposed variables when required.

### Never client-expose

The following must remain server-only:

```text
Supabase service-role key
Razorpay secret key
Stripe secret key
Upstash credentials
R2 secret credentials
AI provider API key
Database secrets
```

The AI provider key and R2 secret credentials in particular must never use a `NEXT_PUBLIC_*` variable.

---

# 17. Protected Prompt Architecture

The technology stack must support field-level data visibility.

A Template is not simply entirely public or entirely private.

### Public template data

Examples:

```text
title
description
category
tags
tools
usage steps
thumbnail media
other approved discovery metadata
```

### Subscriber-only data

Examples:

```text
complete base prompt
customized prompt (AI customization is active — see Section 14)
```

### Important implementation rule

The application must not send the complete base prompt to a non-subscriber and then hide it using CSS blur.

The server must return only the fields the caller is authorized to receive.

Conceptually:

```text
Non-subscriber
→ metadata + safe preview/locked state

Subscriber
→ metadata + complete base prompt
```

This is a technology-stack requirement because the Next.js server/client boundary is responsible for enforcing the data boundary.

---

# 18. Data Response Shaping

API responses should be constructed according to authorization level.

The server should not retrieve protected data merely to hide it later in the UI.

The preferred model is:

```text
Request
   ↓
Authenticate
   ↓
Authorize
   ↓
Determine permitted fields
   ↓
Query required data
   ↓
Return authorized response
```

This supports the four-level data model:

```text
PUBLIC
AUTHENTICATED
SUBSCRIBER
ADMINISTRATOR
```

Only authorized information crosses the server-to-client boundary.

---

# 19. User Private Data

User-specific information must remain owner-scoped.

Examples include:

* Contact identifier
* User-specific customization requests
* Customized prompts
* Usage information
* Uploaded media a user owns (if user-level uploads are introduced)
* Private saved/liked relationships when implemented

A user must not be able to access another user's private information simply by changing an ID in a request.

Authorization and ownership checks belong on the server.

---

# 20. Administrator Architecture

The application uses the same Next.js application for public/user and administrator functionality.

The stack therefore requires a clear server-side separation between:

```text
Customer Application
        ↓
User Authorization

Administrator Application
        ↓
Administrator Authorization
```

Administrator UI hiding is not sufficient.

Every administrator API operation must independently verify administrator authorization.

RLS should provide an additional database-level restriction.

---

# 21. First Administrator Provisioning

The technology stack should not expose a public "create administrator" endpoint.

The first Administrator account must be provisioned through a controlled process such as a one-time server-side/database provisioning procedure.

After provisioning:

```text
Administrator Authentication
        ↓
Administrator Authorization
        ↓
Admin Operations
```

The exact provisioning procedure belongs in the implementation/deployment documentation rather than being treated as a public product feature.

---

# 22. Validation Technology

Zod should be used for server-side validation of API inputs.

Validation is particularly important for:

* Authentication-related input
* Template IDs
* Category IDs
* Feedback
* Search/filter parameters
* Payment identifiers (Razorpay and Stripe)
* AI customization requests
* Upload requests (file metadata, declared type/size)
* Administrator configuration

The browser may also perform client-side validation for UX.

However:

> Client-side validation is never a replacement for server-side validation.

---

# 23. AI Input Boundary

AI customization requests are user-controlled input.

The technology stack must therefore treat them as untrusted data.

The server should:

1. Receive the request.
2. Validate it with Zod.
3. Apply length/usage constraints.
4. Verify authorization.
5. Retrieve the authorized base prompt.
6. Keep system instructions separate from user input.
7. Send the request through the server-side AI abstraction.

The user must not be able to redefine the application's system instruction through the customization field.

---

# 24. AI Output Boundary

AI-generated customized prompts are also untrusted external data.

The application should:

* Validate the response
* Apply reasonable size limits
* Treat the result as plain text
* Never execute it
* Never render it as trusted HTML
* Never silently write it into the admin-authored base template

The original base prompt remains separate from the customized prompt.

---

# 25. Database and AI Data Separation

The technology stack must maintain the distinction between:

```text
Admin-authored Base Prompt
```

and:

```text
User-specific Customized Prompt
```

A customized prompt must not overwrite the original template's base prompt.

The base prompt remains the canonical admin-authored content.

---

# 26. External Service Trust Boundaries

AWA communicates with external services including:

```text
Supabase
Upstash
Cloudflare R2
Razorpay
Stripe
AI Provider
```

The application server acts as the controlled integration boundary.

User input must not directly control:

* Payment-provider credentials
* AI provider credentials
* Database credentials
* Arbitrary server-side URLs
* R2 upload destinations/keys
* Service-role operations

The application should use fixed/configured provider endpoints.

---

# 27. Logging

Application logging should avoid sensitive information.

Do not log:

```text
Session tokens
Passwords
Service-role keys
Payment secrets (Razorpay and Stripe)
AI provider API keys
R2 secret credentials / signed URL secrets
Raw payment credentials
Complete AI request/response payloads
Sensitive user data unnecessarily
```

Logs should instead contain useful operational metadata such as:

```text
Request ID
Operation
User/actor reference where appropriate
Success/failure state
Provider transaction reference (Razorpay or Stripe)
AI usage metadata
Upload metadata (file type, size, object key — not content)
Error category
```

Detailed logging policy belongs in the security/operations documentation.

---

# 28. Technology Responsibility Matrix

| Technology          | Primary Responsibility                                   |
| ------------------- | -----------------------------------------------------------|
| Next.js             | Full-stack application, UI, server logic, Route Handlers |
| React               | Client-side UI                                            |
| TypeScript          | Type safety                                                |
| Tailwind CSS        | Styling                                                    |
| shadcn/ui           | UI components                                              |
| GSAP/animations     | Presentation/interaction                                   |
| Supabase Auth       | Authentication                                              |
| Supabase PostgreSQL | Persistent relational data                                  |
| Prisma              | Type-safe database access                                   |
| Supabase RLS        | Database-level access control                                |
| Upstash Redis       | Rate limiting / temporary state                              |
| Cloudflare R2       | **Active** media/object storage with signed-upload workflow |
| Razorpay            | Launch payment processing                                    |
| Stripe              | **Active (scaffolded)** second payment provider behind shared abstraction |
| AI Provider         | **Active** — AI customization is in current scope             |
| Zod                 | Server-side input validation                                  |

---

# 29. What Must Never Be Client-Side

The following responsibilities must remain server-side:

* Subscription authorization
* Administrator authorization
* Protected prompt retrieval
* AI provider API calls
* AI provider credentials
* Payment secret credentials (Razorpay and Stripe)
* Payment verification
* Service-role database operations
* Sensitive database queries
* Usage/credit authorization
* Security-sensitive rate-limit decisions
* R2 signed-upload URL generation and R2 secret credentials

The UI may reflect the result of these decisions, but it must not make the decisions itself.

---

# 30. Technology-Level Security Rules

The stack must follow these core rules:

### Rule 1 — Server is the authorization boundary

The browser is untrusted.

### Rule 2 — Protected data is never sent merely to be hidden

A non-subscriber must not receive the complete protected prompt.

### Rule 3 — Authentication does not equal authorization

Logged-in users are not automatically subscribers or administrators.

### Rule 4 — Service-role credentials are server-only

Supabase service-role access bypasses RLS.

### Rule 5 — AI credentials are server-only

The browser must never communicate directly with the AI provider using AWA's credentials.

### Rule 6 — Payment success must be independently verified

A client-side payment callback is not proof of payment, for either Razorpay or Stripe.

### Rule 7 — Database input must remain parameterized

Do not construct SQL from untrusted strings.

### Rule 8 — Server-side validation is mandatory

Client validation exists only for user experience.

### Rule 9 — RLS is defense-in-depth

RLS does not eliminate the need for Route Handler authorization.

### Rule 10 — Infrastructure does not automatically mean product scope

Reserved technologies must not be interpreted as active MVP features unless the product scope explicitly includes them. (R2, AI, and Stripe have now been explicitly confirmed in scope — see Sections 9, 10.2, and 14.)

### Rule 11 — Upload URLs are short-lived and scoped

R2 signed upload URLs must expire quickly and be scoped to a single object/operation; the browser never receives R2 secret credentials.

---

# 31. Technology Stack vs Security Documentation

The following should remain primarily in the Security Review rather than being duplicated in detail here:

* Detailed threat analysis
* Attack scenarios
* Security test cases
* Exact rate-limit values
* Detailed RLS policies
* Detailed cookie configuration
* Prompt-injection threat analysis
* Detailed file-upload threat model
* Incident-response procedures
* Compliance requirements

`10-TECH-STACK.md` should describe the technology and the security-relevant architectural boundary it provides.

`13-SECURITY-REVIEW.md` should describe the detailed security controls and threats.

---

# 32. Final Architecture

The resulting technology architecture is:

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    │ React / Next.js UI  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js Server  │
                    │   Route Handlers    │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Authentication     Authorization      Validation
       Supabase Auth      Access Level        Zod
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
       ┌───────────────┬───────┼───────┬────────────────┐
       │                │               │                │
       ▼                ▼               ▼                ▼
  PostgreSQL         Upstash          R2 (active)      External
  Supabase +         Redis            Signed Upload    Services
  Prisma                              URLs                 │
       │                                              ┌─────┼──────┐
       │                                              │      │      │
       │                                              ▼      ▼      ▼
       │                                          Razorpay  Stripe  AI Provider
       │                                                              (active)
       ▼
  Authorized Data
       │
       ▼
   Next.js UI
```

---

# 33. Final Technology Principle

AWA's technology stack is built around a server-controlled architecture.

The browser is responsible for presentation and interaction.

Next.js server-side logic is responsible for authentication, authorization, validation, protected data access, and external integrations.

Supabase PostgreSQL and Prisma provide the persistent data layer.

Supabase RLS provides database-level defense in depth.

Upstash provides rate-limiting infrastructure.

Razorpay provides launch payment processing, with Stripe now scaffolded behind a shared provider abstraction as a second active provider.

Cloudflare R2 is active infrastructure backing a live, authorization-gated, short-lived-signed-URL upload workflow.

AI provider integration is active: AI customization is formally in the current product scope, and the full authorization/usage/validation/output architecture from `09-AI-DESIGN.md` applies now.

The central rule is:

> **The server determines what the caller is allowed to access, and only authorized data is sent to the browser.**