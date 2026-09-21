# AWA — Security Review

**Status:** Security review, scoped to the confirmed MVP as defined in `05-MVP.md` through `12-IMPLEMENTATION-PLAN.md`, as revised for the Next.js/Supabase stack and the now-required AI prompt-customization capability, **and further revised for three additional scope changes confirmed since the previous version of this document: active Cloudflare R2 file uploads (template thumbnails), a fully live second payment provider (Stripe, alongside Razorpay), and a Likes/Saves feature.**
**Scope of this document:** What can actually go wrong in *this* system, given its confirmed architecture (Next.js full-stack app + Supabase Postgres/Auth + Redis/Upstash + Cloudflare R2 [active upload feature] + Razorpay **and** Stripe [both live] + a single-step, backend-mediated AI customization service + Likes/Saves), and what to do about it before launch. This is not a generic OWASP checklist — items that don't apply to AWA's confirmed MVP are named and dismissed rather than padded out.
**Sources:** `01-PROBLEM.md`, `03-REQUIREMENTS.md`, `09-AI-DESIGN.md` (AI: REQUIRED), `10-TECH-STACK.md` (Next.js/Supabase/Redis/R2 **[ACTIVE]**/Razorpay+Stripe **[BOTH ACTIVE]**), `11-UI-UX.md` (Likes/Saves **[ACTIVE]**), `12-IMPLEMENTATION-PLAN.md` (most current, superseding task-level detail — see §15 on why `06`/`07`/`08` are treated as stale on these points).

---

## 1. Authentication

**What exists:** Two identities only — **User** (subscriber) and **Administrator** — via **Supabase Auth**, not hand-rolled credential storage (`10-TECH-STACK.md` §3.1, chosen specifically to avoid hand-rolled credential handling under time pressure). Anonymous browsing needs no authentication at all.

**Considerations specific to AWA:**
- **First-Administrator provisioning is now consistently constrained, and this is a real fix from the prior version of this document.** `03-REQUIREMENTS.md` Conflict C-7, `07-DATABASE.md` §8, `08-API.md` §11, `10-TECH-STACK.md` §21, and `11-UI-UX.md` §14 all now independently state the same rule: the first Administrator must be created through a controlled, non-public, one-time provisioning mechanism (e.g., a server-side/database seed step, `12-IMPLEMENTATION-PLAN.md` TASK-002/TASK-025), and **no public self-registration or self-promotion endpoint for Administrators may exist**. This closes the gap the previous version of this document flagged as open. What remains genuinely unresolved — and this is fine to leave open — is the *exact* one-time procedure (script vs. console vs. deployment step); that's an implementation detail, not a security gap, as long as no public path exists.
- **Session tokens are managed by Supabase Auth, but how the frontend holds them still matters.** Use Supabase's `httpOnly`, `Secure`, `SameSite=Lax` cookie-based session helpers for the Next.js App Router rather than reading the session token into client-side JavaScript state. This app now has more free-text and user-generated surfaces than before (feedback comments, the AI customization request field) that could otherwise carry an injected script capable of exfiltrating a client-held token.
- **No password/credential design work is needed from this team** — that's delegated to Supabase Auth. The remaining team responsibility is: verify the Supabase session on every Route Handler server-side (§2), and never trust a client-supplied user ID, subscription flag, admin flag, or `provider` selector (§11).
- **RLS is a second authentication-adjacent layer, not a substitute for it.** RLS policies are necessary but not sufficient — always confirm identity server-side in the Route Handler too, consistent with `10-TECH-STACK.md` §6's own stated principle ("RLS is defense-in-depth... does not replace server-side authorization").
- **Not applicable:** MFA, OAuth social login, password reset flows, account lockout policy — none are specified anywhere in the source material and none are required for the MVP's two narrowly-scoped identities.

---

## 2. Authorization

**What exists:** Four access levels per endpoint — **Public**, **Authenticated User**, **Subscriber**, **Administrator** — enforced via Next.js middleware plus Supabase Row Level Security (RLS) policies (`10-TECH-STACK.md` §3, §6). This now governs a materially larger endpoint surface than the previous version of this document covered: the original ~29 endpoints plus API-030–039 (`12-IMPLEMENTATION-PLAN.md` §1) for AI customization, Like/Save, and thumbnail upload.

**Considerations specific to AWA:**
- **The paywall is still the core monetized asset, and the rule is unchanged: never send the full base prompt to a non-subscriber's browser at all** — not sent-and-hidden. `10-TECH-STACK.md` Rule 2 restates this explicitly ("Protected data is never sent merely to be hidden"). Verify this is implemented as "don't send it," not "send it and hide it in the DOM."
- **The AI customization endpoint requires independent per-template authorization, not just a general Subscriber check.** `09-AI-DESIGN.md` §5 is explicit and gives the required order: (1) valid session → (2) active subscription via a **live** lookup, never cached → (3) the *specific requested template* is authorized for *this* caller → (4) validate the request → (5) usage/credit check → (6) rate-limit check — **all six must pass before the AI provider is ever called.** A caller manipulating `templateId` must not be able to trigger a customization against content they haven't actually unlocked.
- **Concurrent AI requests are a genuine, newly-identified authorization-adjacent risk.** `09-AI-DESIGN.md` §6 flags this directly: if two customization requests from the same user arrive simultaneously, both could pass a "credits available" check before either records consumption, over-spending the user's allowance (and, at the margin, doubling AI provider cost for a single intended request). The exact locking/transaction mechanism is an implementation decision, but the requirement itself — usage consumption must be atomic with the availability check — needs to be a concrete build task, not an assumption that the credit check "just works."
- **Admin routes still need authorization at the Route Handler level, not just Next.js middleware.** `12-IMPLEMENTATION-PLAN.md` TASK-025 confirms this two-layer pattern (middleware protecting the whole `admin/` route group, *plus* per-endpoint checks) is retained for the expanded admin surface — including the new AI configuration endpoint (API-032) and the two new thumbnail-upload endpoints (API-038/039), both of which must independently verify Administrator status rather than relying on being "under `/admin`."
- **Like/Save actions require authentication, and the toggle logic itself needs an ownership check, not just a login check.** `12-IMPLEMENTATION-PLAN.md` TASK-012 requires that `GET /templates/{templateId}/interactions` "correctly reflects current state for the calling user only, never another user's" — i.e., the interaction-state lookup must be scoped to the caller's own `userId`, not any `userId` the client might pass. Unauthenticated calls to all three Like/Save endpoints must be rejected cleanly, not silently no-op'd (a silent no-op could let a client falsely believe an action succeeded).
- **Thumbnail upload authorization is Administrator-only, both to request the signed URL and to confirm the upload** (`12-IMPLEMENTATION-PLAN.md` TASK-005, API-038/039). This is the one place a non-admin authorization bug would translate directly into a live file-upload vulnerability (§9) rather than just a data-exposure one — worth treating as a priority authorization check to test explicitly.
- **Subscription-lapse behavior remains an explicit open question** (unchanged from the prior version). Whatever is decided, the authorization check must be a live `subscription_status` lookup on each request, not a cached client-side flag.

---

## 3. Secrets and API Keys

**What exists:** Razorpay public/secret keys, **Stripe public/secret keys and webhook signing secret — now a fully active credential set, not a reserved placeholder** (`12-IMPLEMENTATION-PLAN.md` TASK-002), Supabase project keys (URL, anon key, service-role key), Upstash Redis REST URL/token, **Cloudflare R2 access credentials — now backing a live signed-upload workflow** (§9), and an AI provider API key.

**Considerations specific to AWA:**
- TASK-002 specifies the right pattern: environment-variable-based config, `.env.example` with placeholders only, fail-fast startup if any required variable is missing (including Stripe's, explicitly called out as "validated as present, not silently optional"), and no real secret ever committed.
- **Supabase's service-role key bypasses RLS entirely** and must live only in backend environment variables — including, now, the R2 signed-upload-URL generation path (`10-TECH-STACK.md` §7 explicitly calls this out as one of the legitimate reasons the service-role key is needed). A service-role key is not a substitute for the access-level checks in §2.
- **AWA now manages two independent sets of payment secrets with two independent verification schemes.** `10-TECH-STACK.md` §10.2 and `12-IMPLEMENTATION-PLAN.md` TASK-020 are explicit that "Razorpay's and Stripe's webhook/callback verification are not interchangeable — implement both correctly, not a shared shortcut that only really validates one." This is a real increase in secret-handling surface area versus the prior single-provider version of this document, and it's worth a dedicated check in review: confirm neither adapter's secret can leak through the other's error path or logging.
- **The AI provider API key** must be used exclusively inside the backend's AI-provider abstraction module — the client must never receive, hold, or extract it, including via a misconfigured `NEXT_PUBLIC_*` variable.
- **R2 credentials are now actively used on every thumbnail upload, not idle.** They must remain server-side at all times; only the short-lived, single-object-scoped signed upload URL ever reaches the browser (`10-TECH-STACK.md` §9, §29).
- Upstash and R2 credentials should be scoped as narrowly as each service allows, rather than account-wide.
- Add `.env`/`.env.local` to `.gitignore` before the first commit.

---

## 4. User Data Handling

**What exists:** `User.contact_identifier` (PII), `Feedback.comment` (free text), the AI customization request/response pair, and — unchanged in kind, new in fact — the **Like/Save relationship data**, which `11-UI-UX.md` §16 explicitly requires be treated as private even though its aggregate is public.

**Considerations specific to AWA:**
- `contact_identifier` remains the one PII field with no confirmed lower-sensitivity substitute. Don't expose it beyond what the owning user or an admin legitimately needs.
- `Feedback.comment` is untrusted free text on the way in; don't render it as raw HTML in the admin dashboard.
- **The AI customization request text leaves AWA's own system boundary**, transmitted to an external AI provider (`09-AI-DESIGN.md` §10). Confirm the chosen provider's data-retention/training-use policy before launch, and carry a one-line privacy disclosure that customization requests are processed by a third party.
- **Like/Save relationships are the one clearly-specified public/private split in this feature set, and it needs to be enforced as a real access rule, not just a UI convention.** `11-UI-UX.md` §16 states plainly: aggregate counts (`likeCount`, `saveCount`) are public; *who* liked or saved a given template is never exposed to other users; a user's own liked/saved list (`GET /users/me/liked-templates`, `GET /users/me/saved-templates`) is visible only to that user. Confirm no endpoint (e.g., an admin or debug endpoint) accidentally returns the per-user `Like`/`Save` join rows keyed by another user's identity — the public detail response should only ever surface the count, never the row.
- **Uploaded thumbnail images are platform-owned (admin-authored), not user data**, but still deserve the same "don't trust the content" posture as any file upload — see §9. This is a new category of stored content this document previously had no reason to address.
- **Payment data is out of AWA's hands almost entirely**, now for two providers instead of one; confirm neither integration ever receives or logs raw card/payment credentials.
- **Not applicable:** health data, biometric data, children's data, geolocation tracking.

---

## 5. Database Access

**What exists:** Supabase-managed PostgreSQL accessed via Prisma, with the original 8-entity schema plus confirmed additions: a usage-tracking structure for AI credits, `Like` and `Save` join tables (each with a `(userId, templateId)` unique constraint), and `Template.thumbnail_object_key`/`thumbnail_url` (`12-IMPLEMENTATION-PLAN.md` §1).

**Considerations specific to AWA:**
- Use Prisma's query builder throughout — never string-concatenate user input into raw SQL. This now explicitly includes Like/Save toggle calls and thumbnail-confirmation metadata, in addition to the previously-named surfaces.
- **Row Level Security (RLS) is doing real access-control work.** Every table reachable from a client-facing Route Handler — now including `Like`, `Save`, and the usage-tracking table — should have an explicit RLS policy matching its intended access level. Audit this explicitly before launch for each table; a table with RLS left at Supabase's default (which can be "disabled" for new tables in some configurations) is a silent way to accidentally expose data, and that risk is not smaller just because `Like`/`Save` feel like a "lightweight" feature — a leaked `Like` table would directly violate the privacy rule in §4.
- **The `Like`/`Save` unique constraint is doing real security work, not just data-integrity work.** `12-IMPLEMENTATION-PLAN.md` TASK-003/TASK-012 rely on it to prevent a race condition from double-inserting a row on rapid concurrent toggles — confirm this constraint is actually present in the schema before launch, since its absence would silently reintroduce the exact race condition it's meant to close.
- **The service-role key bypasses RLS entirely** — minimize which Route Handlers use it; the R2 signed-URL generation path is one of the few that legitimately needs to.
- Foreign-key constraints remain enforced at the DB level across all entities, including the new ones — this incidentally limits the damage of certain injection or logic-error bugs.
- **Not applicable:** multi-tenant row-level isolation beyond the User/Administrator RLS split, encryption-at-rest configuration beyond Supabase's default.

---

## 6. Input Validation

**What exists:** The confirmed API surface, validated with Zod per `10-TECH-STACK.md`, now covering AI customization requests, Like/Save toggle calls (effectively parameterless beyond `templateId`), and thumbnail-upload metadata (content-type, declared size).

**Considerations specific to AWA:**
- Every endpoint's validation rules should be enforced server-side via Zod, not just documented — client-side validation is a UX convenience only.
- Free-text fields remain the main injection surface: `Template.prompt_text` and tags (admin-authored), `Feedback.comment`, and the AI customization request text. Validate length limits and sanitize before storage/render.
- **The AI customization request needs a length cap enforced before it's ever sent to the AI provider** — both a cost control (§13) and a basic defense against attempts to pad the request with manipulation content (§7).
- **Thumbnail-upload metadata needs validation at two separate points, not one.** `12-IMPLEMENTATION-PLAN.md` TASK-005 requires the *requested* content-type/size to be validated against an allowlist (`image/jpeg`, `image/png`, `image/webp`) before a signed URL is issued, **and** the *actual* uploaded object to be re-validated (content-type as reported by R2, actual size) at confirmation time before it's written onto the `Template` row. Trusting only the pre-upload declaration would let a caller request a URL for a small PNG and then upload something else entirely.
- **`templateId` references in Like/Save and AI customization calls must be validated to exist**, consistent with the same rule already applied to every other reference field (`categoryId`, `toolId`, etc.).

---

## 7. AI Prompt Injection Risk

**This remains a live, real risk, unchanged in kind from the prior version of this document, with one addition worth restating plainly: the authorization-before-provider-call order in §2 is itself a prompt-injection mitigation, not just an access-control one** — capping how many crafted/exploratory injection attempts a single account can push through before usage limits or rate limits stop it (`09-AI-DESIGN.md` §6).

**The risk, specifically:** a user's customization request is untrusted input to an LLM call. A malicious or careless request could attempt to override the system instruction, attempt to make the AI service reveal its own configuration, or attempt to manipulate the rewriting service into producing unrelated or disallowed content.

**Required flow (`09-AI-DESIGN.md` §§3–5, §15):**
1. **Input:** length-capped (§6), clearly delimited from the standing system instruction — never blindly concatenated.
2. **Authorization:** the full six-step order in §2 completes before the provider is ever called.
3. **AI call:** through the backend's provider-abstraction module only — the client never has a path to call the AI provider directly.
4. **Output:** treated as untrustworthy on return — validated for length/shape (§8) before being stored or shown, never rendered as HTML, never executed.
5. **No human/admin approval step is required before display**, because AWA's confirmed product boundary is that it only ever *shows* a prompt for the user to copy — it never executes anything on an external AI tool or takes a real-world action based on the output.

**What remains correctly out of scope, and why:** multi-turn conversation injection (no multi-turn state — each request is single-step), tool-use/agentic injection (no tools the AI can invoke), and RAG-based data exfiltration (no retrieval or vector store) — `09-AI-DESIGN.md` §2.2 confirms none of these are in the confirmed architecture.

---

## 8. AI-Generated Output Handling

**Considerations specific to AWA:**
- **Validate before display, not just before storage.** Confirm the response is non-empty, within a reasonable size ceiling, and safe to render as plain text (`09-AI-DESIGN.md` §9). If validation fails, the user sees the defined AI Error State — never a partial or unvalidated response.
- **AI output is always plain text — never HTML, never executed, never interpreted as markup.**
- **Never let AI output silently become admin-authored content.** The customized prompt is user-session-scoped; it must never be written into `Template.prompt_text` or blended with admin-curated catalog content (recommendation tags, usage steps). The base prompt remains the recoverable source of truth (`09-AI-DESIGN.md` §9).
- **The tool/model recommendation remains explicitly non-AI output** and must never be presented as if generated alongside the customized prompt — a content-provenance concern as much as a security one.
- **Not applicable:** multi-step conversation consistency (no multi-turn state), a custom moderation layer beyond basic shape/length/plain-text validation (provider-level moderation, if offered, is the appropriate first line of defense at MVP scope).

---

## 9. File Uploads (Cloudflare R2)

**This section changes completely from the prior version of this document, and this is one of the three material scope changes driving this revision.** The previous version treated R2 as "provisioned but unused" and correctly deferred detailed controls. **That is no longer accurate: R2 now backs a live, active thumbnail-upload feature** (`10-TECH-STACK.md` §9, `12-IMPLEMENTATION-PLAN.md` TASK-005), and this section now needs to specify real controls, not flag a future risk pattern.

**What exists:** An Administrator-only, signed-upload-URL workflow for template thumbnails: `POST /admin/templates/{id}/thumbnail/upload-url` (API-038) issues a short-lived, single-object-scoped signed R2 upload URL after validating the requested content-type/size; the admin's client uploads directly to R2; `POST /admin/templates/{id}/thumbnail/confirm` (API-039) re-validates the actual uploaded object and records `thumbnail_object_key`/`thumbnail_url` on the `Template` row.

**Considerations specific to AWA:**
- **Confirm the full baseline is actually implemented, not just designed on paper:** server-side content-type validation by content inspection (not just the claimed MIME type or file extension); a size limit enforced both at signed-URL issuance and at confirmation; presigned URLs scoped to a single object key with a short (minutes, not hours) expiry; the browser never receiving R2 secret credentials at any point.
- **Malicious file content is now a real, not hypothetical, concern**, since arbitrary bytes could be uploaded to whatever object key the signed URL permits before the confirmation step re-validates it. The specific risks worth testing explicitly: an SVG file containing embedded script content (SVGs are XML and can carry script payloads that execute if served with the wrong content-type or rendered inline rather than as an `<img>`), and EXIF/metadata payloads in JPEG/PNG files. `10-TECH-STACK.md` §9's "safe media serving" requirement — response headers and content-type handling that prevent a stored file from being interpreted as a script — is the concrete mitigation; confirm it's actually applied to however R2's public read URLs are served, not just documented as a principle.
- **Only Administrators may request or confirm an upload** — this is the one place a broken authorization check turns directly into a live upload vulnerability rather than a data-exposure one (§2). Test this explicitly: a non-Administrator caller must be rejected by both API-038 and API-039, not just hidden from the admin UI.
- **Signed-URL expiry needs to be tested, not just configured.** A signed URL that doesn't actually expire (a misconfiguration, not a design flaw) would leave a live, unauthenticated write path to the bucket open indefinitely.
- **Not applicable:** end-user uploads of any kind — thumbnails are exclusively admin-authored content; there is still no user-facing upload surface anywhere in the confirmed MVP.

---

## 10. External URLs

**What exists:** Recommended AI tools/models are admin-curated tags with a one-line reason; the product does not link out to or automate the external tool. R2-served thumbnail URLs are the one new externally-servable AWA-hosted resource.

**Considerations specific to AWA:**
- If admin-entered tool descriptions ever include a URL, render it as a plain link with `rel="noopener noreferrer"` and don't let it be used for redirects or auto-navigation.
- **Not applicable:** AWA does not fetch, proxy, or render arbitrary user- or admin-supplied URLs server-side. The AI provider call goes to a fixed, admin-configured endpoint, never a URL derived from user input (`09-AI-DESIGN.md` §12 confirms no new SSRF surface). The R2 upload flow similarly uses fixed, server-generated object keys and signed URLs — the client never supplies an arbitrary destination URL for either uploads or provider calls.

---

## 11. Payment Providers (Razorpay and Stripe, Both Live)

**This is a new, dedicated section — the prior version of this document treated Stripe as a reserved key slot; it is now a fully built, live second adapter** (`10-TECH-STACK.md` §10.2, `12-IMPLEMENTATION-PLAN.md` TASK-019/020), which changes this from a single-provider concern into a dual-provider one.

**Considerations specific to AWA:**
- **The client's `provider` selection must never determine credentials, endpoints, or verification logic — only which pre-configured adapter handles the request.** `12-IMPLEMENTATION-PLAN.md` TASK-019 states this explicitly. A client sending `provider: "stripe"` should route to the Stripe adapter using AWA's own configured Stripe credentials; it must never be able to influence *which* credentials or endpoint that adapter uses.
- **Razorpay's and Stripe's webhook/callback signature verification are not interchangeable.** Both must be implemented correctly and independently — a shared shortcut that only really validates one provider's signature is a real, specific risk this dual-provider design introduces, called out directly in `12-IMPLEMENTATION-PLAN.md` TASK-020. This is the single most important new item in this section: confirm each adapter has its own, provider-correct signature check, tested against that provider's actual verification scheme.
- **Payment success must never be inferred from a client-side callback, redirect, or user-supplied payment ID, for either provider.** The backend must independently verify payment status with whichever provider handled the transaction before updating `subscription_status`.
- **Confirmation must be idempotent per provider.** Receiving the same confirmation twice (from either provider) must not double-apply the subscription update — this needs an explicit idempotency check (e.g., on the provider's transaction reference), not an assumption that duplicate webhooks won't happen.
- **The provider-unavailable path must not silently fall back to the other provider or leave state ambiguous.** A Razorpay or Stripe outage should return a clear error and leave any existing access state untouched, per `12-IMPLEMENTATION-PLAN.md` TASK-019's acceptance criteria.
- **Secrets for both providers must be handled with equal rigor** (§3) — it would be easy to treat Stripe's credentials as "less critical" simply because Razorpay is the default/launch provider; the source material is explicit that both are live and both need the same server-only handling.
- **Webhook vs. synchronous confirmation may legitimately differ per provider** (`12-IMPLEMENTATION-PLAN.md` TASK-020 treats this as an accepted implementation dependency, to be resolved per each provider's current documentation) — this is fine as an open implementation detail as long as whichever mechanism is chosen for each provider includes real signature/status verification, not a trust-the-payload shortcut for either.

---

## 12. Likes/Saves — Privacy and Abuse

**This is a new section.** Likes/Saves are a small feature but introduce a real privacy rule (§4) and a real abuse surface that didn't exist in the prior version of this document.

**Considerations specific to AWA:**
- **The public/private split must be enforced as an access rule, not a UI convention.** Aggregate counts are public; the underlying per-user relationship is not (§4, `11-UI-UX.md` §16). No endpoint — including any future admin or debug endpoint — should return the raw `Like`/`Save` rows in a way that exposes which specific user liked or saved a given template to anyone other than that user themselves or an admin acting in a legitimate administrative capacity not otherwise specified in the confirmed scope.
- **The toggle endpoints are cheap to call and authenticated-only, which makes them a plausible target for low-effort abuse** (e.g., scripted rapid toggling to inflate/deflate counts, or to probe which templates a specific account has interacted with via response timing). A basic per-user rate limit on the toggle endpoints is a reasonable, low-cost mitigation, consistent with the same logic already applied to feedback submission (§13).
- **Unauthenticated calls must be rejected explicitly, not silently no-op'd**, so the frontend (and any monitoring) can distinguish "not logged in" from "action failed" (`12-IMPLEMENTATION-PLAN.md` TASK-012's own acceptance criteria already requires this — worth restating here as a security property, not just a UX one, since a silent no-op on an unauthenticated write attempt is the kind of behavior that can mask a broken authorization check).
- **The `(userId, templateId)` unique constraint is the concrete defense against a double-count race** (§5) — confirm it's present, since its absence would be a subtle, hard-to-notice bug rather than an obvious failure.
- **Not applicable:** any sharing, following, or social-graph feature beyond the Like/Save aggregate/personal-list split — nothing else in the confirmed scope introduces user-to-user visibility.

---

## 13. API Abuse and Rate Limiting

**What exists:** The original endpoints carry the same rate-limiting posture as before; the AI customization, Like/Save, and thumbnail-upload endpoints are new additions to this table.

**Considerations specific to AWA:**
- **The two auth endpoints** (Supabase-backed session establishment for User and Administrator) still need a basic per-IP/per-identifier rate limit — the Administrator one doubly so, since a successful hit there now compromises the catalog, both payment providers' configuration, AI customization settings, and thumbnail-upload access.
- **The AI customization endpoint remains the single highest-cost-per-request endpoint in the system**, and still needs its own tight rate limit independent of the usage/credit allowance (§2, `09-AI-DESIGN.md` §6) — this is unchanged from the prior version and remains one of the most important controls in this document.
- **Payment endpoints (initiation and confirmation, for both providers) should be rate-limited**, and each provider's confirmation path must verify its own signature before trusting the payload (§11).
- **Feedback submission** keeps its existing basic per-user rate limit.
- **Like/Save toggles warrant a basic per-user rate limit**, newly added in this revision (§12) — cheap individually, but a plausible low-effort abuse target if left completely unthrottled.
- **Thumbnail-upload-URL requests (API-038) should be rate-limited per Administrator**, mostly as a sane operational safeguard rather than a critical control, since the endpoint is already privileged and low-volume by nature — but an unrate-limited signed-URL-issuance endpoint is still worth capping given it's a new write path to external storage.
- **Public browse/filter/like-count endpoints can reasonably stay unthrottled or loosely throttled** — read-only, cached, no business-cost risk. The cache itself provides some natural abuse resistance here too.

---

## 14. Logging

**What exists:** No logging requirements are specified anywhere in the base requirements — this remains a genuine gap, not a "not applicable" — now with two more categories to cover than the prior version (R2 upload metadata, and per-provider payment metadata for Stripe alongside Razorpay).

**Considerations specific to AWA:**
- At minimum, log: authentication attempts (success/failure, never the credential), admin content-management actions (including AI/payment-provider/thumbnail configuration changes), payment transaction outcomes **per provider** (success/failure/amount/provider, never full payment credentials), AI customization requests at a metadata level (user, template, timestamp, success/failure, usage-limit status — never the full request/response text), and **thumbnail-upload metadata** (file type, size, object key — never file content) per `10-TECH-STACK.md` §27.
- **Never log:** `User.contact_identifier` in plaintext alongside unrelated debug output, session tokens, the Supabase service-role key, Razorpay **and** Stripe secret keys/webhook signing secrets, the AI provider API key, R2 secret credentials or signed-URL secrets, or raw `Feedback.comment`/AI request-response content in a shared/public log stream.
- Startup should fail loudly when a required environment variable is missing — this now explicitly includes Stripe's credentials (`12-IMPLEMENTATION-PLAN.md` TASK-002), not just Razorpay's.
- **Not applicable at MVP scope:** structured audit trails for compliance, formal log retention policy, SIEM integration.

---

## 15. Document Consistency — A Real Risk Worth Naming

**This is a new section, and it's the one process-level finding of this revision rather than a technical one.** `05-MVP.md`, `06-ARCHITECTURE-DECISION.md`, `07-DATABASE.md`, and `08-API.md` still contain their original language describing AI customization, R2 uploads, and multi-provider payments as **deferred/not-required/out-of-scope** — e.g., `06-ARCHITECTURE-DECISION.md`'s Component Decision Matrix still marks "AI Capability: NOT REQUIRED," `07-DATABASE.md` still states "no customization/credits data exists in the MVP," and `08-API.md` still states "AI Customization: Not part of the confirmed MVP API surface" and lists Like/Save as "Explicitly P2, excluded from MVP." **This is stale, not current** — `09-AI-DESIGN.md` §0 and §20, and `12-IMPLEMENTATION-PLAN.md`'s own revision note, explicitly identify these four documents as needing updates and explicitly declare themselves the current, superseding versions on these specific points.

**Why this belongs in a security document, not just a documentation-hygiene note:** a team member, reviewer, or future contributor reading `06`, `07`, or `08` in isolation — which is exactly how a security review or onboarding read typically happens — would reasonably conclude AI, active R2 uploads, Stripe, and Likes/Saves are all out of scope, and could easily miss the entire set of controls in §§7–12 above as a result. **Recommendation: update `05-MVP.md`, `06-ARCHITECTURE-DECISION.md`, `07-DATABASE.md`, and `08-API.md`'s scope language before launch**, not as a cosmetic cleanup but because an out-of-date "not required" statement sitting next to a genuinely-required security control is itself a risk — it's the kind of gap that lets a security control get skipped by someone reasonably trusting the document in front of them.

---

## 16. Summary — What Actually Matters Here

The handful of things most worth deliberately getting right before launch are:

1. **Server-side paywall enforcement that never sends the full base prompt to a non-subscriber's browser** (§2) — unchanged, still the core monetized asset.
2. **Server-side, backend-mediated AI customization with the usage-limit check enforced *before* the AI provider is called, and made atomic against concurrent requests** (§2, §7, §13) — the concurrency requirement is a newly-identified refinement in this revision.
3. **Admin authorization checked at the Route Handler and RLS-policy level for the full admin surface, including the two new thumbnail-upload endpoints and the new AI-config endpoint** (§2, §5, §9).
4. **Real, tested file-upload controls for the now-active R2 thumbnail feature** (§9) — this is the single biggest substantive change in this revision: a previously-deferred, low-risk surface is now a live one, and needs content-type inspection, size limits, short-lived scoped signed URLs, and safe media serving actually implemented, not just designed.
5. **Two independently-correct payment-verification implementations, one per provider**, neither trusting an unverified client-side success signal (§11) — the second material change in this revision.
6. **The Like/Save public-aggregate/private-relationship split enforced as a real access rule** (§4, §12) — the third material change in this revision.
7. **Secrets in environment variables only, `.env` gitignored from commit one** — now covering two payment providers' full credential sets, plus R2 and AI provider keys, with particular care that none of them reach client-side code (§3).
8. **AI customization request delimited from the system instruction, and AI output rendered as plain text only, never HTML** (§7, §8).
9. **RLS enabled and correctly scoped on every Supabase table, including the two new `Like`/`Save` tables** (§5).
10. **Rate limiting on auth, payment (both providers), AI customization, and — newly — Like/Save and thumbnail-upload-URL requests** (§13).
11. **A resolved, non-public process for creating the first Administrator account** (§1) — this item is now closed as a documented requirement across every current source document; only the exact one-time implementation mechanic remains open, which is an acceptable, non-security-blocking unknown.
12. **Update `05-MVP.md`, `06-ARCHITECTURE-DECISION.md`, `07-DATABASE.md`, and `08-API.md`'s stale "deferred"/"not required" language before launch** (§15) — a documentation-consistency fix, but one with real security value, since a stale scope statement sitting next to a live control invites the control to be missed.

**Compared to the prior version of this document, three things moved from "deferred/not applicable" to "must be correctly implemented before launch": R2 file uploads (§9), the Stripe payment adapter (§11), and Likes/Saves (§12).** The admin-provisioning gap flagged in the prior version is now resolved at the requirements level (§1). Everything else — the AI prompt-injection and output-handling posture (§7, §8), the core paywall model (§2), and the general authentication/database/logging posture (§1, §5, §14) — carries forward unchanged and remains correctly implemented as previously described.