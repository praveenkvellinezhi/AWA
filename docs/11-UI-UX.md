# AWA — 11-UI-UX.md

## Security & Access-Control Alignment Changes

> Purpose: Update the UI/UX specification so that user-facing behavior correctly reflects AWA's access levels, subscription state, protected prompt content, private user data, administrator access, and AI customization boundaries.
>
> This document defines **what the user sees and how the interface behaves**. Server-side implementation details such as RLS, cookies, Prisma queries, API authorization, and secret management belong in the architecture, API, database, and security documents.

---

# 1. UI/UX Access Model

AWA has four user-facing access levels:

| Access Level       | UI Experience                                |
| ------------------ | -------------------------------------------- |
| Public             | Browse public catalog and evaluate templates |
| Authenticated User | Access logged-in user functionality          |
| Subscriber         | Access protected prompt functionality        |
| Administrator      | Access administration functionality          |

The UI should reflect the user's current access state, but the UI must never be treated as the mechanism that grants access.

The server determines what data is actually available to the UI.

---

# 2. Public Browsing Experience

AWA should allow non-subscribers to explore the product before subscribing.

Public users should be able to see approved discovery information such as:

* Categories
* Subcategories
* Template titles
* Template descriptions
* Tags
* Recommended AI tools/models
* Usage guidance
* Public aggregate counts (Likes/Saves — Section 16)
* Other approved public metadata

The public browsing experience should provide enough information for users to understand:

> What the template is for, whether it is relevant to them, and which tools it is intended for.

The interface must not reveal the complete protected base prompt to non-subscribers.

---

# 3. Template Detail Screen

The Template Detail Screen can contain both public and subscriber-only content.

### Public information

Examples:

```text
Template title
Description
Category
Tags
Recommended tools
Usage steps
Public like/save counts
Other public metadata
```

### Subscriber-only information

Examples:

```text
Complete base prompt
Customized prompt (AI customization is active — Section 18)
```

The page should visually communicate this distinction clearly.

---

# 4. Subscriber Prompt Preview

## Important UX Change

The previous concept of:

> "Show the complete prompt and blur it for non-subscribers"

must not be treated as the implementation model.

A non-subscriber must not receive the complete protected prompt simply because the UI intends to blur it.

### Confirmed UX behavior: Hard Lock

**Decision: AWA uses the Hard Lock treatment (Section 5, Option B).** No prompt text — not even a partial preview — is shown to non-subscribers.

```text
┌──────────────────────────────────┐
│                                  │
│       🔒 Premium Prompt          │
│                                  │
│  Subscribe to unlock the full    │
│  expert-written prompt.          │
│                                  │
│       [ Subscribe to Unlock ]    │
│                                  │
└──────────────────────────────────┘
```

No excerpt, snippet, or partial prompt text is sent to the client for a non-subscriber. This is a data-response requirement, not only a visual one — the server must not include any prompt text in the response payload for unauthorized callers (see `10-TECH-STACK.md` Section 17–18).

---

# 5. Locked Prompt Treatment — Hard Lock (Confirmed)

**Decision: Hard Lock.** The alternative "Safe Preview + Lock" approach (showing a deliberately truncated excerpt before the locked state) was considered and **not adopted**.

```text
🔒 Premium Prompt

This expert-written prompt is available
with an active subscription.

[ Subscribe to Unlock ]
```

### Security Principle

Regardless of visual treatment:

> The complete protected prompt must never be available to an unauthorized user through the UI, DOM, browser state, or client response.

Because Hard Lock is the confirmed approach, this principle is simpler to enforce here: the server should never include prompt text of any length in a non-subscriber response.

---

# 6. Subscriber Prompt View

When the user has an active subscription, the Template Detail Screen should show the complete base prompt.

Example:

```text
Expert Prompt

┌───────────────────────────────────────┐
│ Complete admin-authored prompt       │
│                                       │
│ ...                                   │
│ ...                                   │
│ ...                                   │
└───────────────────────────────────────┘

[ Copy Prompt ]   [ Customize ]
```

The interface should clearly identify this as the original/base prompt.

---

# 7. Prompt Copy

The `Copy Prompt` action should only be available when the user is authorized to access the complete prompt.

### Subscriber

```text
[ Copy Prompt ]
```

### Non-subscriber

```text
[ Subscribe to Unlock ]
```

The UI state is only a reflection of authorization.

A hidden or disabled copy button must not be considered the security boundary.

---

# 8. Subscription State

The UI may display subscription information such as:

```text
Active
Inactive
Subscribe
Subscription required
```

However, the interface must handle subscription state dynamically.

A stale client state must not cause the UI to assume that a user still has access.

If the user's subscription is no longer active, protected content should return to the locked state.

---

# 9. Subscription Paywall UX

The subscription experience should follow:

```text
Browse
   ↓
Evaluate Template
   ↓
Protected Prompt
   ↓
Subscribe to Unlock
   ↓
Payment
   ↓
Payment Verification
   ↓
Active Subscription
   ↓
Full Prompt
```

The UI should not imply that payment is complete until the application confirms the subscription state.

---

# 10. Payment States

The payment UI should provide clear states.

### Initial

```text
Choose Subscription
[ Subscribe ]
```

### Processing

```text
Processing payment...
Please wait.
```

### Successful

```text
Payment successful

Your subscription is now active.

[ View Prompt ]
```

### Failed

```text
Payment could not be completed.

Please try again.
```

### Verification Pending

If the provider requires asynchronous confirmation:

```text
Payment received

We're confirming your subscription.
Please wait...
```

The application should not immediately expose subscriber-only content based solely on a client-side payment callback.

---

# 11. Authenticated User Experience

A logged-in user who is not subscribed should still have access to public browsing.

Authentication alone does not unlock premium prompts.

Example:

```text
Authenticated
        +
No Active Subscription
        ↓
Public Catalog Access
        +
Locked Premium Prompts
```

This distinction should be clear in the UI.

---

# 12. Administrator UI

Administrator screens must be visually separated from the customer experience.

Admin navigation may include:

```text
Dashboard
Categories
Templates
AI Tools
Recommendations
Usage Steps
Users
Feedback
Subscriptions
Payments
Media/Uploads
Customization Configuration
```

The exact modules should follow the feature scope defined elsewhere.

The interface should not expose administrator navigation to unauthorized users.

However:

> Hiding admin navigation is a UI behavior, not the actual authorization mechanism.

---

# 13. Administrator States

Unauthorized users should not be given an administrator experience.

For protected admin screens, the UI should provide a clear state such as:

```text
Access Restricted

You do not have permission to access
this area.
```

Do not expose administrator data in the page before displaying the restricted state.

---

# 14. First Administrator Setup

The UI should not contain a public:

```text
Create Administrator Account
```

registration flow.

First administrator provisioning is a controlled setup process and is not a public product screen.

---

# 15. Private User Data

User-specific information should only appear in the appropriate user's account context.

Examples:

* Contact information
* Personal customization requests
* Customized prompts
* Personal usage information
* Private saved items (Section 16)
* Private liked relationships (Section 16)

The UI should never provide an interface that allows one user to browse another user's private information.

---

# 16. Public Aggregate Counts — Likes/Saves (Confirmed In Scope)

**Decision: Likes and Saves are in scope for this build**, both as public aggregate counts and as a personal Saved/Liked list for authenticated users.

AWA displays public aggregate information such as:

```text
Likes: 1,245
Saves: 842
```

on public template detail and/or catalog views.

However, the underlying user relationship remains private.

For example:

```text
Public:
"1,245 users liked this template."

Private:
"Praveen liked this template."
```

The UI must distinguish aggregate discovery information from personal user data:

* Aggregate counts (numbers) → public, visible to anyone.
* Who liked/saved a specific template → private, never exposed to other users.
* A user's own list of liked/saved templates → visible only within that user's own account context ("My Liked Templates", "My Saved Templates" — Section 28).

Like/Save actions themselves require authentication (an anonymous visitor should be prompted to log in before the action is recorded), while viewing the aggregate count remains public.

---

# 17. Base Prompt vs Customized Prompt

The UI must clearly distinguish:

### Base Prompt

The original prompt authored/approved by the administrator.

Example:

```text
Original Expert Prompt
```

### Customized Prompt

A user-specific version produced through customization.

Example:

```text
Your Customized Prompt
```

The customized prompt must not visually imply that it replaced the original expert prompt.

---

# 18. AI Customization UI (Active)

**AI customization is confirmed in the active product scope** (per `10-TECH-STACK.md` Section 14). The customization interface follows:

```text
Authorized Subscriber
        ↓
Customize
        ↓
Typed / Voice Request
        ↓
Processing
        ↓
Customized Prompt
```

The user should understand that they are requesting a modification of the existing prompt.

Example:

```text
Customize this prompt

How would you like to modify it?

┌─────────────────────────────────────┐
│ Make this suitable for a luxury     │
│ cosmetics product campaign...       │
└─────────────────────────────────────┘

[ Generate Customized Prompt ]
```

---

# 19. AI Customization Authorization UX

Customization should only be presented when the user is eligible.

### Eligible subscriber

```text
[ Customize ]
```

### Non-subscriber

```text
Customize with AI

Subscribe to unlock prompt customization.

[ Subscribe ]
```

### No available credits

If credit limits are part of the active scope:

```text
No customization credits remaining.

[ Get More Credits ]
```

The UI must accurately reflect the server's authorization result.

---

# 20. AI Processing State

During customization:

```text
Customizing your prompt...

Please wait.
```

Avoid exposing internal AI provider details unnecessarily.

Do not display:

* API keys
* Internal provider configuration
* Internal system instructions
* Internal prompts
* Server implementation details

---

# 21. AI Error State

If customization fails:

```text
We couldn't customize this prompt.

Please try again.
```

If appropriate:

```text
[ Try Again ]
```

Do not display raw provider errors, stack traces, credentials, internal configuration, or other sensitive server information.

---

# 22. AI Output Presentation

The customized prompt should be displayed as text.

Example:

```text
Your Customized Prompt

┌───────────────────────────────────────┐
│ Customized prompt text...             │
│                                       │
│ ...                                   │
└───────────────────────────────────────┘

[ Copy Prompt ]
```

AI-generated content should not be treated as trusted HTML or executable content.

---

# 23. AI Scope Clarification (Resolved)

**Resolved: AI customization is formally promoted into the active product scope.** This supersedes the earlier MVP-vs-later-capability distinction.

The current product includes:

* Static admin-authored prompts
* Curated AI-tool recommendations
* Usage guidance
* Prompt copying
* Feedback
* Likes/Saves (Section 16)
* **AI customization**, following the behavior defined in Sections 18–22 above and the architecture in `09-AI-DESIGN.md`

> If AI customization scope changes again later, this section and Sections 18–22, 31, and 34 must be updated together — do not let UI scope drift silently from the tech-stack/API documents.

---

# 24. Feedback UI

Feedback should remain lightweight.

Example:

```text
Was this prompt useful?

      👍        👎

Optional comment

┌─────────────────────────────────────┐
│ Tell us what you think...           │
└─────────────────────────────────────┘

[ Submit Feedback ]
```

Feedback comments are user-generated content.

The interface should not imply that user-entered content is trusted system content.

---

# 25. Loading and Error States

Protected content should have explicit loading and locked states.

Example:

### Loading

```text
Loading prompt access...
```

### Authorized

```text
Full Prompt
```

### Unauthorized

```text
🔒 Subscribe to unlock
```

### Error

```text
Unable to load this prompt.

[ Try Again ]
```

Do not temporarily render protected content while authorization is being determined.

---

# 26. Avoid Authorization Flicker

The UI should avoid patterns such as:

```text
Page loads
   ↓
Show complete prompt
   ↓
Check subscription
   ↓
Hide prompt
```

Instead:

```text
Page loads
   ↓
Determine authorized response
   ↓
Render appropriate state
```

This prevents protected content from briefly appearing to an unauthorized user.

---

# 27. Public vs Protected Template Detail

The Template Detail Screen should conceptually behave like:

```text
┌─────────────────────────────────────────┐
│ Template Title                          │
│ Description                             │
│ Category / Tags                         │
│ Likes: 1,245   Saves: 842               │
│                                         │
│ Recommended Tools                       │
│ Usage Steps                             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Prompt                              │ │
│ │                                     │ │
│ │ Subscriber → Full Prompt            │ │
│ │ Non-subscriber → 🔒 Hard Lock       │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [ Like ] [ Save ] [ Copy ] [ Customize ] │
└─────────────────────────────────────────┘
```

The protected area should adapt based on the server-authorized state.

---

# 28. Navigation Rules

### Public navigation

Users should be able to navigate:

```text
Home
Categories
Templates
Template Details
Tools
Usage Guidance
Subscription
Login / Signup
```

### Authenticated navigation

Includes:

```text
Profile
My Activity
My Saved Templates
My Liked Templates
Subscription
```

Saved/Liked Templates are active features (Section 16).

### Administrator navigation

Admin functionality should be available only within the administrator experience.

---

# 29. Mobile and Responsive Security UX

Responsive behavior must preserve access-control behavior.

For example:

* Mobile users must not receive protected prompt content before authorization.
* Desktop and mobile must use the same access rules.
* Locked states must remain clear on small screens.
* Subscription CTAs must remain accessible.
* Copy/customize actions must reflect the same authorization state.
* Like/Save actions must reflect the same authentication requirement on mobile as desktop.

Responsive design must never create a separate security behavior.

---

# 30. Accessibility

Protected and subscription-related states should remain accessible.

Examples:

* Lock states should have meaningful text, not only an icon.
* Subscription CTA should have an accessible label.
* Error states should be announced appropriately.
* Loading states should communicate that content is being loaded.
* Color should not be the only indicator of subscription/access state.
* Like/Save buttons should announce their current state (e.g. "Liked" vs "Like") to assistive technology.

Example:

```text
🔒 Premium prompt — subscription required
```

rather than relying only on a visual lock icon.

---

# 31. UI States by Access Level

| Feature               | Public | Authenticated | Subscriber |             Administrator |
| ---------------------- | -----: | ------------: | ---------: | -------------------------: |
| Browse categories      |      ✓ |             ✓ |          ✓ |                          ✓ |
| Browse templates       |      ✓ |             ✓ |          ✓ |                          ✓ |
| Template metadata      |      ✓ |             ✓ |          ✓ |                          ✓ |
| Tool recommendations   |      ✓ |             ✓ |          ✓ |                          ✓ |
| Usage guidance         |      ✓ |             ✓ |          ✓ |                          ✓ |
| Public like/save counts|      ✓ |             ✓ |          ✓ |                          ✓ |
| Like / Save action     |      — |             ✓ |          ✓ |                          ✓ |
| Complete base prompt   |      — |             — |          ✓ |  Based on admin permission |
| Prompt copy            |      — |             — |          ✓ |        Based on permission |
| AI customization       |      — |             — |          ✓ |   Configuration/management |
| Personal user data     |      — |           Own |        Own |    Authorized admin access |
| Admin configuration    |      — |             — |          — |                          ✓ |

---

# 32. UI Must Not Become the Security Boundary

The following UI techniques must never be considered protection:

```text
CSS blur
display: none
disabled button
hidden element
client-side role check
client-side subscription flag
hidden route
```

These are presentation behaviors only.

The server must determine whether the requested data or operation is allowed.

---

# 33. Important UX Rule for Protected Prompts

The most important UI rule in AWA is:

> **Never design the interface around the assumption that an unauthorized browser already possesses the protected prompt.**

Instead, design the UI around the response returned for the user's access level.

### Non-subscriber

```text
Public metadata
+
Hard-lock state (no prompt text)
+
Subscription CTA
```

### Subscriber

```text
Public metadata
+
Complete base prompt
+
Copy
+
Customization (active)
```

---

# 34. Final User Flow

The recommended AWA experience is:

```text
                    ┌──────────────┐
                    │    Browse    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Template   │
                    └──────┬───────┘
                           ↓
                 ┌────────────────────┐
                 │ Public Information │
                 │ Description/Tools  │
                 │ Usage Guidance     │
                 │ Likes / Saves      │
                 └─────────┬──────────┘
                           ↓
                  ┌───────────────────┐
                  │  Prompt Access    │
                  └─────────┬─────────┘
                            │
                 ┌──────────┴──────────┐
                 ↓                     ↓
          Non-subscriber           Subscriber
                 ↓                     ↓
           🔒 Hard Lock            Full Prompt
                 ↓                     ↓
             Subscribe              Copy
                 ↓                     ↓
        Payment Verification     Customize
                 ↓                     ↓
          Active Subscription     Customized
                 │                   Prompt
                 └──────────┬──────────┘
                            ↓
                         External
                       AI Tool/Model
```

---

# 35. Final UI/UX Principle

AWA's UI should make access states understandable without making the UI responsible for enforcing them.

The experience should clearly communicate:

* What anyone can explore
* What requires authentication
* What requires an active subscription
* What is private to the current user
* What is restricted to administrators
* What is the original expert-authored prompt
* What is a user-specific customized prompt
* What is a public aggregate signal (like/save counts) versus a private relationship (who liked/saved)

The most important protected-content rule is:

> **A non-subscriber should see a useful evaluation experience, but the complete subscriber-only prompt must never be delivered merely to create a blurred or hidden UI. AWA's confirmed approach is a Hard Lock: no prompt text of any length reaches a non-subscriber.**

The UI reflects authorization; the server enforces authorization.