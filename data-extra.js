// ============================================================
//  AU BANKING TOOLKIT — DATA EXTRA
//  Migrated from ba-prompt-library. All specific bank references removed.
//  Covers: Mobile Apps, Tech Spikes, Integration, UI/UX,
//          Discovery, Software Dev, Business English, BA Cert,
//          Command Rules, Product Mgmt, Agile
// ============================================================

const EXTRA_CATEGORIES = [
  { id: 'mobile_apps',   label: 'Mobile & Digital',      icon: '📱' },
  { id: 'tech_spikes',   label: 'Spikes & Tech Debt',    icon: '🛠️' },
  { id: 'integration',   label: 'Architecture & NFRs',   icon: '🏗️' },
  { id: 'uiux',          label: 'UI/UX Design',          icon: '🎨' },
  { id: 'discovery',     label: 'Product Discovery',     icon: '🔭' },
  { id: 'software_dev',  label: 'Software Development',  icon: '💻' },
  { id: 'english',       label: 'Business English',      icon: '🗣️' },
  { id: 'ba_cert',       label: 'BA Certification',      icon: '🎓' },
  { id: 'cmd_rules',     label: 'Command Rules',         icon: '⚙️'  },
  { id: 'product_mgmt',  label: 'Product Management',    icon: '🚀' },
  { id: 'agile',         label: 'Agile & Scrum',         icon: '🔄' },
];

const EXTRA_PROMPTS = [

  // ─── MOBILE & DIGITAL ──────────────────────────────────────
  {
    id: 'xmob-001',
    category: 'mobile_apps',
    title: 'Mobile App Permissions Strategy',
    when: 'When writing requirements for a feature that needs access to device hardware (camera, location, contacts).',
    prompt: `Create a Mobile Permissions Strategy and requirement breakdown for a feature requiring: [e.g., Location Services and Camera].

Include requirements for:
1. **Pre-prompt / Prime the user:** When and how do we explain WHY we need the permission before invoking the OS modal?
2. **OS Prompt:** The fallback text for the iOS (Info.plist) and Android manifest strings.
3. **Granted State:** Expected behavior when permitted.
4. **Denied / Degraded State:** Exact graceful degradation behavior if the user denies the permission.
5. **Change Mind Flow:** How do we guide a user who previously denied the permission to the OS Settings app to turn it back on?

Write this as a series of User Stories with Acceptance Criteria.`,
    tips: [
      'Apple and Google both reject apps that do not clearly explain why a permission is needed.',
      'The "Change Mind Flow" is the most commonly forgotten requirement by BAs.',
    ],
    tags: ['mobile', 'permissions', 'ios', 'android', 'ux'],
  },
  {
    id: 'xmob-002',
    category: 'mobile_apps',
    title: 'Push Notification Matrix',
    when: 'When designing a notification system and you need to map out triggers, payloads, and behaviors.',
    prompt: `Define a Push Notification and In-App Message matrix for: [FEATURE NAME e.g., Fraud alert on a card transaction].

Generate a table:
- **Trigger Event:** What backend event fires this?
- **Notification Type:** Push, In-App, or both?
- **Title (Short):** Max 30 chars
- **Body / Message:** Max 100 chars
- **Deep Link Destination:** Which exact screen does tapping open?
- **Payload Data Requirements:** JSON data the payload must contain
- **Opt-out Category:** Which settings toggle controls this?
- **Edge Case:** What if they tap after the issue was resolved?

Provide 3 distinct scenarios.`,
    tips: [
      'Deep links fail if the app is killed vs in background — account for both states.',
      'Always define the Payload Data — frontend devs need to know what IDs to expect.',
    ],
    tags: ['notifications', 'push', 'deep linking', 'mobile', 'messaging'],
  },
  {
    id: 'xmob-003',
    category: 'mobile_apps',
    title: 'Offline Mode & Data Syncing Requirements',
    when: 'When designing an app that must handle poor network connectivity elegantly.',
    prompt: `Draft technical requirements for Offline Mode resilience for: [e.g., Viewing account balances and initiating a transfer].

Address:
1. **Network Drop:** User loses connection mid-flow. What UI state is shown?
2. **Stale Data:** How do we indicate cached data (e.g., "Last updated 2 hours ago")?
3. **Write Actions Offline:** Action buffering — blocked, or placed in an outbox/queue?
4. **Conflict Resolution:** Background sync logic when connectivity restores.
5. **Timeouts:** Show spinner for 5s → "Slow connection" toast → timeout at 15s.

Write Acceptance Criteria covering these negative paths.`,
    tips: [
      'Account for "Lie-Fi" — connected to WiFi but no actual internet.',
      'For financial transfers, blocking the action offline is safer than queueing.',
    ],
    tags: ['offline', 'sync', 'resilience', 'mobile', 'caching'],
  },
  {
    id: 'xmob-004',
    category: 'mobile_apps',
    title: 'Biometric Auth & Tokenization',
    when: 'When implementing FaceID, TouchID, or Android Biometric Prompt for login or payments.',
    prompt: `Write business logic requirements and sequence for integrating Native Biometrics (FaceID/TouchID) for [Login / Payment Authorization].

Cover:
1. **Enrollment:** User opting into biometrics. Storing token in secure enclave / keystore.
2. **Successful Auth:** Biometric pass, exchanging token for short-lived session token.
3. **Fallback Flow:** Biometrics fail 3 times → fallback to PIN / Password.
4. **Device Change / Invalidation:** New fingerprint added to OS — detect and invalidate stored token.
5. **App Backgrounding:** Re-authenticate immediately, or after a timeout?

Output as a detailed acceptance specification.`,
    tips: [
      'Device Change Invalidation is a critical security requirement in banking — new OS biometrics MUST force a password login.',
      'Differentiate between "App PIN" and "Device Biometrics" in your specs.',
    ],
    tags: ['biometrics', 'security', 'faceid', 'authentication', 'mobile'],
  },
  {
    id: 'xmob-005',
    category: 'mobile_apps',
    title: 'Mobile App Accessibility (WCAG) Assessment',
    when: 'When writing acceptance criteria for UI components to ensure WCAG 2.1 AA accessibility compliance.',
    prompt: `Draft Accessibility (WCAG 2.1 AA) compliance requirements for: [FEATURE — e.g., A multi-step account opening form].

Requirements covering:
1. **Screen Readers (VoiceOver/TalkBack):** Aria-labels, reading order, state announcements.
2. **Color Contrast & Dynamic Type:** Minimum 4.5:1 contrast ratio, UI must not break at 200% OS font size.
3. **Touch Targets:** Minimum 44x44pt (iOS) / 48x48dp (Android) for all interactive elements.
4. **Focus Management:** Where does focus start when screen opens? Where goes when modal closes?
5. **Error Identification:** How validation errors are conveyed to visually impaired users.

Output as testable Acceptance Criteria for developers and QA.`,
    tips: [
      'WCAG 2.1 AA is mandatory for CDR Data Holder portals in Australia.',
      'Ask the AI to generate actual VoiceOver scripts for complex custom components.',
    ],
    tags: ['mobile', 'accessibility', 'wcag', 'ux', 'compliance', 'CDR'],
  },

  // ─── TECH SPIKES & TECH DEBT ────────────────────────────────
  {
    id: 'xspike-001',
    category: 'tech_spikes',
    title: 'Technical Spike Charter',
    when: 'When developers need time to research a technical unknown before estimating a complex feature.',
    prompt: `Structure a Technical Spike Charter for the backlog.

Research topic: [e.g., Evaluating an OCR library for ID scanning / GraphQL for the dashboard]

Generate the spike ticket:
1. **Problem Statement:** Why can't we estimate or build this right now?
2. **Timebox:** Strictly enforced maximum time (e.g., 3 days).
3. **Specific Questions to Answer:** 3-5 concrete technical questions the spike MUST answer.
4. **Deliverables:** What is the output? (e.g., ADR, Confluence doc, throwaway codebase)
5. **Throwaway Rule:** Explicit statement that spike code will NOT be pushed to production.

Ready to paste into Jira.`,
    tips: [
      'A spike without a Timebox and Output Deliverables is a black hole for developer time.',
      'Always enforce the "throwaway code" rule so devs do not build production features without tests.',
    ],
    tags: ['spike', 'research', 'jira', 'agile', 'tech debt'],
  },
  {
    id: 'xspike-002',
    category: 'tech_spikes',
    title: 'Tech Debt Business Case',
    when: 'When you need to convince Product Owners to allocate sprint capacity to fix technical debt.',
    prompt: `I need to pitch fixing Technical Debt to non-technical business stakeholders.

The tech debt: [e.g., Deprecated payment library causing security gaps / No database indexes slowing dashboards]

Business case structure:
1. **Risk to Business (Do nothing):** Impact in business terms — revenue loss, downtime, security breach.
2. **Interest Rate (Cost of delay):** How does this debt slow delivery of features the business wants?
3. **The Proposal:** What is the fix and how much sprint capacity?
4. **ROI:** What becomes faster, cheaper, or safer after fixing it?
5. **Analogy:** A simple non-tech analogy (car maintenance) for stakeholder understanding.`,
    tips: [
      'Stakeholders care about speed, risk, and cost — not clean code. Speak their language.',
      'Reference APRA CPS 230 operational risk if the debt creates a compliance risk — this lands hard.',
    ],
    tags: ['tech debt', 'business case', 'stakeholders', 'refactoring'],
  },
  {
    id: 'xspike-003',
    category: 'tech_spikes',
    title: 'System Cutover / Migration Strategy',
    when: 'When moving from a legacy system to a new system and planning the rollout strategy.',
    prompt: `Outline a deployment and cutover strategy for moving from [LEGACY SYSTEM] to [NEW SYSTEM].

Evaluate:
- Big Bang deployment
- Blue/Green deployment
- Canary release (percentage-based rollout)
- Dark launching / Shadow traffic

For the recommended approach, define:
1. **Feature Flags / Toggles:** Controls needed to route traffic
2. **Data Consistency:** How data stays in sync during transition
3. **Monitoring & Alerting:** Metrics that signal successful launch vs rollback
4. **Rollback Plan:** Step-by-step requirements to route back to legacy

Format as a strategy document for a Go/No-Go technical meeting.`,
    tips: [
      'Data consistency is usually the hardest part of cutovers — ask specifically about database syncing.',
      'Never accept Big Bang for critical banking payment flows without extreme justification.',
    ],
    tags: ['migration', 'cutover', 'deployment', 'canary', 'infrastructure'],
  },
  {
    id: 'xspike-004',
    category: 'tech_spikes',
    title: 'Legacy Mainframe API Wrapper Design',
    when: 'When modernizing a system by putting REST APIs in front of a legacy mainframe (e.g., AS400).',
    prompt: `Outline architectural considerations and BA requirements for wrapping a Legacy Mainframe with a modern API layer.

Context:
- Legacy: [e.g., AS400 / CICS Mainframe]
- Modern: [e.g., Java Spring Boot API serving React Native mobile app]

Analysis on:
1. **Synchronous vs Asynchronous:** API is fast, mainframe is slow — design the response (e.g., 202 Accepted with polling).
2. **Data Caching Strategy:** Cache read-heavy data in Redis? TTL and cache invalidation rules.
3. **Data Translation / Mapping:** Legacy 2-char codes to modern full words — translation layer requirement.
4. **Rate Limiting:** Protect fragile legacy system from digital traffic spikes.

Format as Architectural Discussion Document for tech grooming.`,
    tips: [
      'Mainframes bill by CPU cycles — caching reduces MIPS costs, win with architects.',
      'Consider the impedance mismatch between modern high-concurrency apps and constrained legacy systems.',
    ],
    tags: ['spike', 'mainframe', 'modernization', 'api', 'caching'],
  },

  // ─── ARCHITECTURE & NFRS ────────────────────────────────────
  {
    id: 'xint-001',
    category: 'integration',
    title: 'System Integration NFRs',
    when: 'When defining Non-Functional Requirements between two systems.',
    prompt: `Generate detailed NFR clauses for the integration between [System A] and [System B].

Covering:
1. **Latency & Response Times:** P95 and P99 response time limits.
2. **Throughput:** Expected Requests Per Second (RPS) during normal and peak load.
3. **Availability:** SLA percentage and allowed downtime windows.
4. **Payload Size Limits:** Max JSON size and pagination requirements.
5. **Timeouts:** Connection and read timeout values, and client response requirements.
6. **Error Rates:** Acceptable error threshold percentages before alerts trigger.

Format as measurable, testable statements. "The system must be fast" is banned.`,
    tips: [
      'If an NFR cannot be tested by an automated script, it is an opinion, not an NFR.',
      'Always define Peak Load behavior — requests exceeding X RPS must receive 429.',
    ],
    tags: ['NFR', 'integration', 'performance', 'SLA', 'architecture'],
  },
  {
    id: 'xint-002',
    category: 'integration',
    title: 'Idempotency & Retry Requirements',
    when: 'When writing API requirements for actions that mutate data (payments, creation) over unreliable networks.',
    prompt: `Write technical requirements for API Idempotency and Retry Logic for: [POST /v1/payments/transfer].

Define:
1. **Idempotency Key:** How the client generates it (UUID-v4), passed via Header, lifespan (e.g., 24 hours).
2. **Server-Side Handling:** First request vs duplicated request with same key.
3. **Race Conditions:** Second identical request while first is still processing → 409 Conflict.
4. **Client Retry Strategy:** Exponential Backoff with Jitter for 5xx errors.
5. **Non-Retryable Errors:** Status codes the client MUST NOT retry (400, 401, 403, 422).

Output as a structured technical section for an API specification.`,
    tips: [
      'Idempotency = doing it twice has the same effect as once. Golden rule of payment APIs.',
      'Without "jitter" in retry logic, a recovering server will be DDoS\'d by synchronized retries.',
    ],
    tags: ['idempotency', 'retry', 'integration', 'API', 'payments'],
  },
  {
    id: 'xint-003',
    category: 'integration',
    title: 'Event-Driven Architecture (EDA) Specification',
    when: 'When defining a message or event to be published to an event bus (Kafka, SNS, RabbitMQ).',
    prompt: `Define the data contract and requirements for an asynchronous Event published to [Kafka / SNS].

Event: [e.g., CustomerAddressUpdated / PaymentCompleted]

Specification including:
1. **Topic Name / Routing Key:** Naming convention structure.
2. **Trigger:** The exact business event that causes this message.
3. **Payload / Schema:** Sample JSON structure — Event Notification vs Event-Carried State Transfer.
4. **Ordering Constraints:** Does message order matter? What is the Partition Key?
5. **Consumer Behavior:** Who consumes this? What if the message is malformed?
6. **Dead Letter Queue (DLQ):** Failed messages routed to DLQ after X retries.

Format for both Data Engineers and Backend Developers.`,
    tips: [
      'Ordering is tricky in distributed systems — defining the right Partition Key is critical.',
      'Event Notification (just the ID) vs Event-Carried State Transfer (full object) is an important design decision.',
    ],
    tags: ['kafka', 'events', 'pub-sub', 'asynchronous', 'messaging'],
  },
  {
    id: 'xint-004',
    category: 'integration',
    title: 'Circuit Breaker Fallback Strategies',
    when: 'When defining how a system should behave when a downstream dependency goes offline.',
    prompt: `Design Circuit Breaker pattern requirements and fallback UX for:

Our system: [e.g., Mobile App Dashboard]
Failing dependency: [e.g., Reward Points Balance API]

Three Circuit Breaker states:
1. **Closed (Normal):** Failure threshold to trip the breaker (e.g., 50% failure rate over 10 seconds).
2. **Open (Failing):** Breaker tripped — explicit UX fallback (hide widget / show cached data with banner).
3. **Half-Open (Testing Recovery):** After timeout (60 seconds), how do we test if dependency is back?

Focus on the UX during "Open" state — graceful degradation, not a dead screen.`,
    tips: [
      'Graceful degradation is a core BA skill — "Show an error popup" is usually the worst option.',
      'Use this to drive discussions with UX designers on how to handle missing data states.',
    ],
    tags: ['circuit breaker', 'resilience', 'fallback', 'integration', 'ux'],
  },
  {
    id: 'xint-005',
    category: 'integration',
    title: 'Webhook Signature Security (HMAC)',
    when: 'When defining how a third-party webhook payload must be secured and verified.',
    prompt: `Draft technical requirements for HMAC-SHA256 signature verification for incoming webhooks.

Third party sending webhook: [e.g., KYC Provider / AUSTRAC API callback]
Our system receiving: [e.g., Registration Service]

Requirements:
1. **Secret Management:** Stored in AWS Secrets Manager / Azure Key Vault and rotation schedule.
2. **Header Parsing:** Signature in specific header (e.g., X-Signature), extract timestamp.
3. **Payload Hashing:** Steps to recreate hash using raw HTTP request body.
4. **Replay Attack Prevention:** Timestamp tolerance (e.g., reject if >5 minutes old).
5. **Constant-Time Comparison:** Mandatory to prevent timing attacks.

Output as technical acceptance criteria for backend developers.`,
    tips: [
      'Using regular == to compare hashes is a critical security flaw. Always specify constant-time comparison.',
      'Raw HTTP body must be hashed before any JSON parsing alters whitespace.',
    ],
    tags: ['integration', 'webhooks', 'security', 'hmac', 'api'],
  },

  // ─── UI/UX DESIGN ───────────────────────────────────────────
  {
    id: 'xuiux-001',
    category: 'uiux',
    title: 'Heuristic Evaluation of a Screen',
    when: 'When auditing an existing UI design for usability problems before a redesign or release.',
    prompt: `Conduct a heuristic evaluation for:

Screen: [DESCRIBE THE SCREEN]
Product: [e.g., Mobile banking app / Web dashboard]
Target users: [e.g., Non-technical retail banking customers aged 25–60]

Evaluate against Nielsen's 10 Usability Heuristics:
1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognise, diagnose, and recover from errors
10. Help and documentation

For each heuristic:
- **Severity rating**: 0 (N/A) / 1 (cosmetic) / 2 (minor) / 3 (major) / 4 (catastrophic)
- **Issue found**
- **Recommendation**

Conclude with a prioritised top-5 fix list.`,
    tips: [
      'Describe the screen in detail — layout, labels, error states, and flows.',
      'Ask to "generate a usability test script for these issues" as a follow-up.',
    ],
    tags: ['UX', 'heuristics', 'usability', 'audit', 'Nielsen'],
  },
  {
    id: 'xuiux-002',
    category: 'uiux',
    title: 'User Interview Script',
    when: 'When planning user research sessions and need structured interview questions.',
    prompt: `Create a User Interview script for:

Research goal: [e.g., Understand how users currently manage savings goals]
Product: [e.g., Mobile banking app]
Participant profile: [e.g., 25-40-year-old digital banking users]
Duration: [e.g., 45 minutes]

Structure:
1. **Introduction (5 min):** Welcome, consent, ground rules, recording consent.
2. **Warm-up Questions (5 min):** 3 open-ended questions about background habits.
3. **Core Questions (25 min):** 8 exploratory questions — include follow-up probes.
4. **Task Observation (5 min):** 1-2 think-aloud tasks if testing a prototype.
5. **Closing (5 min):** Summary check, what else to know, thank you.

Include a "What NOT to say" guide with leading question examples to avoid.`,
    tips: [
      'Never ask "Would you use this feature?" — it gives false positives.',
      'Focus on past behaviour ("Tell me about the last time you…") not hypotheticals.',
    ],
    tags: ['UX research', 'user interview', 'qualitative', 'discovery'],
  },
  {
    id: 'xuiux-003',
    category: 'uiux',
    title: 'UX Copy & Microcopy Review',
    when: 'When auditing UI text (button labels, error messages, empty states) for clarity and tone.',
    prompt: `Review and rewrite the UX copy for:

Screen/component: [DESCRIBE OR PASTE CURRENT UI COPY]
Brand voice: [e.g., Professional and trustworthy / Warm and conversational]
Target user: [e.g., Non-technical banking customer]

Review against:
1. **Clarity** — immediately understood by the target user?
2. **Conciseness** — can it be shorter?
3. **Actionability** — do button labels tell users what will happen?
4. **Error messages** — do they explain what went wrong AND how to fix it?
5. **Tone consistency** — matches brand voice?
6. **Jargon** — replace banking/technical terms with plain English.

Output format:
| Location | Original | Issue | Rewritten | Principle Fixed |

Then provide 5 general UX copy rules for this product's voice.`,
    tips: [
      'Error messages are the most important — "An error occurred" is never acceptable.',
      'Button labels should start with a verb: "Submit" → "Send Money".',
    ],
    tags: ['microcopy', 'UX writing', 'content design', 'copy', 'tone'],
  },
  {
    id: 'xuiux-004',
    category: 'uiux',
    title: 'Design System Component Spec',
    when: 'When documenting behaviour specification for a reusable UI component.',
    prompt: `Write a Component Specification for:

Component: [e.g., Primary Button / Input Field / Data Table / Toast]
Platform: [Web / iOS / Android / All]

Document:
1. **Overview:** Purpose, when to use, when NOT to use.
2. **Variants:** List visual variants + State matrix: Default/Hover/Focused/Active/Disabled/Loading/Error.
3. **Anatomy:** Label all slots/parts, which are required vs optional.
4. **Interaction Behaviour:** On click/tap, keyboard interactions (Tab, Enter, Escape), touch targets (44×44pt).
5. **Accessibility:** ARIA role, attributes, screen reader announcement text.
6. **Content Guidelines:** Max/min character counts, casing rules.
7. **Do / Don't examples:** 3 correct uses, 3 incorrect uses.`,
    tips: [
      'Include the Do/Don\'t section — it is the most referenced part by developers.',
      'Accessibility attributes are non-negotiable for banking apps — include every ARIA property.',
    ],
    tags: ['design system', 'component', 'UX', 'accessibility', 'specification'],
  },

  // ─── PRODUCT DISCOVERY ──────────────────────────────────────
  {
    id: 'xdisc-001',
    category: 'discovery',
    title: 'Opportunity Assessment Canvas',
    when: 'When evaluating whether a new product idea is worth pursuing before any development begins.',
    prompt: `Complete an Opportunity Assessment for:

Idea: [PRODUCT OR FEATURE IDEA]
Market: [Target market and geography — Australian banking context]
Company context: [Your organisation's current position and strengths]

Answer Marty Cagan's 10 Opportunity Assessment questions:
1. What problem does this solve? (customer problem, not a feature)
2. For whom? (target persona)
3. How big is this market opportunity? (TAM/SAM/SOM estimate)
4. What alternatives exist today?
5. Why are we well suited to pursue this?
6. Why now? (market timing, regulatory trigger — e.g., CDR, APRA changes)
7. How will we measure success?
8. What is the minimum viable version?
9. What other opportunities will we miss? (opportunity cost)
10. What is the risk if we get this wrong? (financial, reputational, regulatory)

Conclude: Proceed / Investigate further / Do not proceed — with 2-sentence rationale.`,
    tips: [
      'Question 9 (opportunity cost) is the most important and most skipped.',
      '"Why now?" is powerful when linked to a regulatory change — frame it that way.',
    ],
    tags: ['discovery', 'opportunity', 'product strategy', 'assessment'],
  },
  {
    id: 'xdisc-002',
    category: 'discovery',
    title: 'Customer Jobs-to-be-Done Analysis',
    when: 'When deeply understanding what customers are truly trying to achieve beyond the surface-level feature request.',
    prompt: `Conduct a Jobs-to-be-Done (JTBD) analysis for:

Customer type: [e.g., Small business owner using Australian business banking]
Context of use: [e.g., Managing payroll for 10 employees via mobile app]

Apply JTBD framework:
1. **Functional Jobs** — 5 specific practical tasks
2. **Emotional Jobs** — how they want to feel, what anxiety to avoid
3. **Social Jobs** — how they want to be perceived
4. **Job Statements** — "When I [situation], I want to [motivation], so I can [outcome]." (3 statements)
5. **Desired Outcomes** — what success looks, sounds, and feels like
6. **Underserved Needs** — where existing solutions fail

Format as a discovery document for a sprint zero session.`,
    tips: [
      'JTBD shifts thinking from features to outcomes — that is the entire point.',
      'The emotional job is often more powerful than the functional one.',
    ],
    tags: ['JTBD', 'discovery', 'customer insight', 'product strategy', 'outcomes'],
  },
  {
    id: 'xdisc-003',
    category: 'discovery',
    title: 'Problem Statement Workshop Facilitation',
    when: 'When facilitating a team session to define the core problem before jumping to solutions.',
    prompt: `Facilitate a Problem Statement workshop for:

Context: [Describe the situation / pain observed]
Stakeholders: [e.g., Product Manager, BA, UX, Engineering Lead, Business Sponsor]
Time: [e.g., 90 minutes]

Workshop guide:
**Activity 1 — Problem Framing (20 min)**
- 5 "How Might We…" reframes
- Silent dot-vote instructions

**Activity 2 — Root Cause Analysis (25 min)**
- 5 Whys exercise template
- Fishbone diagram prompts (People/Process/Technology/Environment)

**Activity 3 — User Impact Assessment (20 min)**
- Who is affected and how badly?
- Frequency × severity matrix

**Activity 4 — Problem Statement Crafting (15 min)**
- Template: "We have observed that [users] struggle to [action] because [root cause], resulting in [impact]."
- 3 draft statements to vote on

**Facilitator tips** for each activity.`,
    tips: [
      'Never allow solution ideas in the first 45 minutes of a problem workshop.',
      '"How Might We" reframes problem as opportunity — unlocks creative thinking.',
    ],
    tags: ['discovery', 'problem statement', 'workshop', 'facilitation', 'HMW'],
  },

  // ─── SOFTWARE DEVELOPMENT ────────────────────────────────────
  {
    id: 'xdev-001',
    category: 'software_dev',
    title: 'Code Review Checklist Generator',
    when: 'When you need a thorough code review checklist for a pull request.',
    prompt: `Generate a Code Review Checklist for:

PR type: [e.g., New feature / Bug fix / Refactoring / Payment API endpoint]
Language/Framework: [e.g., Java Spring Boot / TypeScript React Native]
Special concerns: [e.g., Payment processing / PII data handling / APRA audit logging]

Checklist covering:
1. **Correctness** — logic errors, null pointers, edge cases, happy/error paths tested
2. **Security** — input validation, no secrets in code, SQL injection/XSS prevention, auth checks
3. **Performance** — N+1 queries, unnecessary loops, caching opportunities, DB indexes
4. **Maintainability** — single responsibility, naming clarity, no commented-out code, DRY
5. **Testing** — unit tests present, test coverage, tests test behaviour not implementation
6. **Documentation** — complex logic commented, API changes in OpenAPI spec, CHANGELOG

Format as a copy-paste checklist for a GitHub PR template.`,
    tips: [
      'Add this as a PR template so it appears automatically on every pull request.',
      'The security section is mandatory for any code touching payment flows or PII.',
    ],
    tags: ['code review', 'pull request', 'quality', 'developer', 'checklist'],
  },
  {
    id: 'xdev-002',
    category: 'software_dev',
    title: 'Architecture Decision Record (ADR)',
    when: 'When documenting an important architectural decision for current and future teams.',
    prompt: `Write an Architecture Decision Record (ADR) for:

Decision title: [e.g., Use PostgreSQL instead of DynamoDB for Transaction Service]
Status: [Proposed / Accepted / Deprecated]
Date: [Date]
Decision makers: [Who was involved?]

Structure:
**Context** — What situation is driving this decision?
**Decision Drivers** — 3-5 key requirements/constraints (e.g., APRA compliance, team expertise, cost)
**Considered Options** — Option 1, Option 2, Option 3
**Decision** — The chosen option stated clearly.
**Pros and Cons of Each Option** — Pros, Cons, Risks
**Consequences** — Positive, Negative / trade-offs accepted
**Compliance and Security Considerations** — (essential for banking projects)`,
    tips: [
      'Store ADRs in /docs/adr/ in the repository so they are versioned with the code.',
      'An ADR is a historical record — even "wrong" decisions should be preserved, not deleted.',
    ],
    tags: ['ADR', 'architecture', 'documentation', 'decision', 'software design'],
  },
  {
    id: 'xdev-003',
    category: 'software_dev',
    title: 'Production Incident Post-Mortem',
    when: 'When documenting a production incident to drive systematic process improvement.',
    prompt: `Write a blameless Post-Mortem for:

Incident: [TITLE / DATE]
Severity: [P1 Critical / P2 High / P3 Medium]
Services affected: [What was impacted?]
Customer impact: [e.g., X customers could not transact for Y minutes]
Timeline: [Describe events or paste timeline]

Structure:
1. **Executive Summary** (5 sentences max)
2. **Timeline of Events** — Time | Event | Who Detected/Acted
3. **Root Cause Analysis** — 5 Whys technique
4. **Contributing Factors** — What made this worse?
5. **What Went Well** — Blameless acknowledgement of effective responses
6. **What Went Poorly** — Gaps in detection, communication, response
7. **Action Items** — Action | Owner | Priority | Due Date | Success Criteria
8. **Preventive Measures** — Long-term systemic changes

Include a blameless principle statement at the top.`,
    tips: [
      'Blameless = focus on the system, not the person who made the change.',
      'Action items without an owner and due date are just wishes.',
    ],
    tags: ['incident', 'post-mortem', 'DevOps', 'reliability', 'SRE'],
  },
  {
    id: 'xdev-004',
    category: 'software_dev',
    title: 'CI/CD Pipeline Requirements',
    when: 'When defining the automation pipeline requirements for a new service or application.',
    prompt: `Define CI/CD pipeline requirements for:

Service: [e.g., Payment Microservice / Mobile App]
Tech stack: [e.g., Java Spring Boot / React Native]
Cloud: [e.g., AWS / Azure]
Environments: [e.g., DEV / SIT / UAT / PROD]
Deployment frequency: [e.g., Multiple times per day / Weekly]

Pipeline stages:
1. **Source Control Triggers** — branch strategy, PR merge rules
2. **Build Stage** — compile, dependency scanning (Snyk/OWASP), static analysis (SonarQube)
3. **Test Stage** — unit tests, coverage threshold (e.g., 80%), integration tests
4. **Security Scan** — SAST, container image scanning, secrets detection
5. **Artifact Management** — storage, versioning/tagging
6. **Deployment** — automated promotion rules, post-deployment smoke tests, rollback triggers
7. **Notifications** — who gets notified on failure, dashboard requirements`,
    tips: [
      'Security scanning gates are non-negotiable for Australian banking services — enforce them.',
      'Ask to "generate a GitHub Actions workflow YAML" based on these requirements.',
    ],
    tags: ['CI/CD', 'DevOps', 'pipeline', 'automation', 'deployment'],
  },

  // ─── BUSINESS ENGLISH ────────────────────────────────────────
  {
    id: 'xeng-001',
    category: 'english',
    title: 'Professional Email Rewriter',
    when: 'When you want to improve the clarity, tone, and professionalism of a business email.',
    prompt: `Review and rewrite the following email:

---
[PASTE YOUR DRAFT EMAIL HERE]
---

Goals:
1. **Clarity** — one idea per sentence, remove ambiguity
2. **Conciseness** — remove filler words
3. **Tone** — [Formal / Semi-formal / Assertive / Collaborative / Empathetic]
4. **Structure** — clear opening, body, and call to action
5. **Subject line** — generate 3 alternatives

After rewriting:
- Note what you changed and why
- Flag any phrases that could be misinterpreted
- 3 synonym options for key words

Audience: [e.g., Senior executive / Regulator / Project team / Regulatory contact]`,
    tips: [
      'Use this before any high-stakes email: escalations, regulator communications, rejection notices.',
      'For Australian banking regulators (APRA, ASIC, AUSTRAC), formal tone is always appropriate.',
    ],
    tags: ['email', 'writing', 'professional English', 'communication', 'editing'],
  },
  {
    id: 'xeng-002',
    category: 'english',
    title: 'Meeting Vocabulary & Phrases Cheat Sheet',
    when: 'When preparing to lead or participate in English-language meetings.',
    prompt: `Generate a Business Meeting English Cheat Sheet for:

Meeting type: [e.g., Sprint Review / Stakeholder Update / Requirements Workshop]
My role: [e.g., Presenter / Facilitator / Participant]
My English level: [e.g., Intermediate — I understand well but struggle to speak spontaneously]

Phrases for:
**Opening and Introducing** — 5 phrases to start/introduce agenda items
**Expressing Opinions** — 5 to share your view, 3 to respectfully disagree, 3 to build on ideas
**Asking for Clarification** — 5 phrases to ask for clarity, 3 to check understanding
**Managing Time** — 5 phrases to move discussion forward, 3 to wrap up, 3 to table for later
**Closing** — 3 to summarise actions, 3 to close professionally
**Handling Difficult Moments** — 3 when you don't know the answer, 3 when you need thinking time

Include pronunciation tips for the trickiest phrases.
Add "Australian business English specific phrases" for banking culture.`,
    tips: [
      'Practice these phrases aloud before the meeting — reading is not the same as saying them.',
      'The "I don\'t know the answer" phrases are the most important — use them confidently.',
    ],
    tags: ['English', 'meetings', 'phrases', 'communication', 'vocabulary'],
  },
  {
    id: 'xeng-003',
    category: 'english',
    title: 'Technical Jargon → Plain English Translator',
    when: 'When explaining a technical concept to non-technical stakeholders.',
    prompt: `Translate the following technical content into plain English:

---
[PASTE THE TECHNICAL PARAGRAPH OR SPECIFICATION]
---

Audience: [e.g., CFO / Branch Manager / APRA Relationship Manager / Board member]
Their background: [What they understand / What they definitely do not understand]

Produce:
1. **Plain English version** — same meaning, zero jargon
2. **Analogy** — one high-quality real-world analogy
3. **Key takeaways** — 3 bullet points the audience needs to remember
4. **FAQ** — 3 questions this audience would likely ask
5. **Do not use these words:** [List jargon that always confuses your audience]

Explain: what assumptions did you make about the audience's knowledge level?`,
    tips: [
      'A good analogy replaces 500 words of explanation.',
      'Use Australian spelling throughout: "authorise" not "authorize", "organisation" not "organization".',
    ],
    tags: ['plain English', 'communication', 'stakeholders', 'simplification'],
  },
  {
    id: 'xeng-004',
    category: 'english',
    title: 'Presentation Script & Speaker Notes',
    when: 'When preparing to present in English and you want a polished, natural-sounding script.',
    prompt: `Write a presentation script with speaker notes for:

Title: [PRESENTATION TITLE]
Audience: [e.g., Executive leadership / APRA / Development team]
Duration: [e.g., 10 minutes]
Key message: [Single most important takeaway]
Slides/content summary: [Describe each slide briefly]

For each slide:
- **Opening hook** for the first slide
- **Speaker notes** — natural conversational English to say aloud
- **Transition phrases** between slides
- **[PAUSE]** markers where to stop for effect

Then provide:
- An opening 30 seconds that grabs attention
- A closing 60 seconds that lands the key message
- 5 responses to likely audience questions (Q&A prep)
- Words I might mispronounce with phonetic spellings

Tone: [Confident and engaging / Formal and precise / Story-driven]`,
    tips: [
      'Read the script aloud twice before presenting — written and spoken English are different.',
      'The opening 30 seconds determine whether people pay attention for the next 10 minutes.',
    ],
    tags: ['presentation', 'public speaking', 'English', 'script', 'communication'],
  },

  // ─── BA CERTIFICATION ────────────────────────────────────────
  {
    id: 'xcert-001',
    category: 'ba_cert',
    title: 'CBAP Exam Study Guide Generator',
    when: 'When preparing for the CBAP (Certified Business Analysis Professional) exam from IIBA.',
    prompt: `Create a personalised CBAP exam study guide for:

Knowledge Area: [e.g., Business Analysis Planning & Monitoring / Elicitation & Collaboration / Requirements Life Cycle Management / Strategy Analysis / Requirements Analysis & Design Definition / Solution Evaluation]
My experience level: [e.g., 3 years BA experience in Agile banking environment]
Study time: [e.g., 8 weeks, 10 hours per week]

Guide covering:
1. **Knowledge Area Overview** — purpose, scope, BABOK v3 connections
2. **Key Tasks** — all tasks, plain English explanation + banking real-world example
3. **Key Terms** — 15 essential definitions + how they differ from commonly confused terms
4. **Practice Questions** — 10 scenario-based questions with answer explanations
5. **Exam Traps** — 5 tricks/traps specific to this knowledge area
6. **Flashcard Set** — 20 Q&A pairs for spaced repetition`,
    tips: [
      'The CBAP exam is scenario-based — always ask "what would a SENIOR BA do?"',
      'Focus on BABOK v3 language — the exam uses terminology that differs from common usage.',
    ],
    tags: ['CBAP', 'IIBA', 'certification', 'study guide', 'BABOK'],
  },
  {
    id: 'xcert-002',
    category: 'ba_cert',
    title: 'BABOK v3 Knowledge Area Deep Dive',
    when: 'When studying a specific BABOK v3 knowledge area in depth.',
    prompt: `Give a comprehensive deep dive into BABOK v3 Knowledge Area: [e.g., Elicitation and Collaboration]

Structure:
1. **Purpose & Scope** — why this exists and what it achieves
2. **All Tasks** — for each task: inputs, elements, outputs, guidelines & tools
3. **Techniques** — 10 common techniques: name, when used, advantages/limitations, Australian banking context
4. **Stakeholder Interactions** — who the BA interacts with, what they need, communication challenges
5. **Applied Example** — walk through the knowledge area for: "An Australian bank building an instant payment feature"
6. **Key Competencies Required** — BA skills and behaviours for excellence`,
    tips: [
      'Every task in BABOK has "Inputs → Elements → Outputs" — learn this structure cold.',
      'Ask for "comparison of BABOK v3 vs Agile Extension to BABOK" in your area.',
    ],
    tags: ['BABOK', 'IIBA', 'certification', 'knowledge area', 'professional development'],
  },
  {
    id: 'xcert-003',
    category: 'ba_cert',
    title: 'Elicitation Technique Selector',
    when: 'When choosing the right elicitation technique for a specific situation and stakeholder type.',
    prompt: `Help me select the best elicitation technique for:

Situation: [e.g., "I need to understand the current state of loan approval from 6 SMEs in 3 different states"]
Stakeholder type: [e.g., Senior executive / Operational staff / Technical team / Compliance officer]
Time available: [e.g., 2 hours total / 1 week]
Participants: [e.g., 1 / 5-8 / Large group]
Requirements state: [Nothing documented / Partial / Existing system being replaced]

Evaluate from: Interviews / Workshops / Observation / Document Analysis / Prototyping / Surveys / Brainstorming / Process Analysis

For each top-3 recommendation:
- Why it suits this situation
- How to run it step-by-step
- What to prepare in advance
- Expected output and risks

Then provide a combined approach using 2 techniques in sequence.`,
    tips: [
      'The best elicitation rarely uses a single technique — combine 2-3 for completeness.',
      'Observation is underused — watching someone do their job reveals more than interviewing them.',
    ],
    tags: ['elicitation', 'techniques', 'requirements', 'BABOK', 'stakeholders'],
  },

  // ─── COMMAND RULES ───────────────────────────────────────────
  {
    id: 'xcmd-001',
    category: 'cmd_rules',
    title: 'The Golden Prompt Formula',
    when: 'When you want a reference for how to write high-quality prompts that get great results every time.',
    prompt: `Use this formula for every prompt to get consistently excellent AI output:

[ROLE] + [CONTEXT] + [TASK] + [FORMAT] + [CONSTRAINTS]

─────────────────────────────────────────
ROLE: "You are a [title] with [X] years of experience in [domain]…"
→ Sets the AI's expertise level and perspective

CONTEXT: "I am working on [project]. My audience is [who]. The goal is [what]…"
→ Gives background so answers are targeted and relevant

TASK: "Generate / Create / Analyse / Review / Draft / Compare…" + specific ask
→ Use action verbs. Be specific about what you want.

FORMAT: "Output as [markdown / table / YAML / list / code block]…"
→ Specify structure so output is immediately usable

CONSTRAINTS: "Must not exceed [X]. Must include [Y]. Do not include [Z]…"
→ Reduces back-and-forth by ruling things out upfront

─────────────────────────────────────────
EXAMPLE (Australian Banking):

"You are a Senior Business Analyst with 10 years in Australian retail banking, specialising in CDR and NPP payments. [ROLE]
I am documenting the PayTo mandate creation flow for a home loan direct debit replacement feature. [CONTEXT]
Draft 5 User Stories in Gherkin format: success, mandate rejected, mandate paused, cancelled, dispute. [TASK]
Output as markdown with bold headers for each story. [FORMAT]
Each story must have 3+ ACs referencing ePayments Code obligations. [CONSTRAINTS]"
─────────────────────────────────────────`,
    tips: [
      'You do not need every element every time — ROLE + TASK + FORMAT is the minimum.',
      'If you get a bad answer, identify which element was missing or vague.',
      'Save your best prompts using the "Add Custom Prompt" button in this toolkit.',
    ],
    tags: ['formula', 'prompt engineering', 'best practice', 'how-to'],
  },
  {
    id: 'xcmd-002',
    category: 'cmd_rules',
    title: 'Output Format Control Commands',
    when: 'When you want to control exactly how the AI structures its response.',
    prompt: `Output format commands for Business Analysts — append to any prompt:

─── TABLE FORMAT ───
"Format as a markdown table with columns: [Col1 | Col2 | Col3]"
"Sort by [column] in descending order"
"Add a Summary row at the bottom"

─── LIST FORMAT ───
"Output as a numbered list, one item per line"
"Use bullet points. Maximum 10 words per bullet."
"Group items under bold category headings"

─── DOCUMENT FORMAT ───
"Structure as formal document: Title, Executive Summary, sections 1-N, Conclusion"
"Use heading levels: # for title, ## for sections, ### for sub-sections"
"Add a TL;DR box at top — 3 bullet points max"

─── CODE/SPEC FORMAT ───
"Output valid YAML only — no prose"
"Wrap all code in fenced code blocks with the language label"
"Add inline comments explaining each section"

─── LENGTH CONTROL ───
"Be concise — max 300 words total"
"Comprehensive — do not skip details"
"Executive summary version: fit on one slide (max 150 words)"

─── ITERATION COMMANDS ───
"Make it more formal / casual"
"Expand section [X] with 3 more examples"
"Simplify — remove jargon, use plain English"
"Add a column for [new data] to the existing table"`,
    tips: [
      'Bookmark this reference for when AI output format is not quite right.',
      'Combine multiple format instructions — they stack well.',
      '"Add inline comments" is especially useful for YAML/JSON specs and Mermaid diagrams.',
    ],
    tags: ['format', 'output control', 'commands', 'reference'],
  },
  {
    id: 'xcmd-003',
    category: 'cmd_rules',
    title: 'Multi-Persona Review (5 Perspectives)',
    when: 'When you want the AI to pressure-test your requirements from multiple expert perspectives.',
    prompt: `Review the following from 5 different expert perspectives:

My requirement/proposal:
[PASTE YOUR REQUIREMENT OR IDEA]

Review sequentially from each perspective:

**🧑‍💻 As a Senior Developer:**
- What is technically complex or risky?
- What is ambiguous and needs clarification?
- What will take longer than expected?

**🧪 As a QA Lead:**
- What edge cases are missing?
- What is difficult to test?
- What are the automated test risks?

**👤 As an Australian Banking Customer:**
- What is confusing about this flow?
- What would frustrate me?
- What is missing that I would expect?

**⚖️ As a Compliance Officer (Australian regulatory context):**
- What APRA/ASIC/AUSTRAC regulatory risks exist?
- What audit evidence is required?
- What data privacy concerns under the Privacy Act?

**💰 As a Business Stakeholder:**
- Does this meet the business goal?
- What is the ROI justification?
- What would I change as the person funding this?

After all 5 reviews: prioritised list of the top 5 issues to address.`,
    tips: [
      'The "Compliance Officer" persona is especially valuable in Australian banking.',
      'Run this before any major refinement or design review session.',
      'Add "Security Architect" as a 6th persona for features touching CPS 234.',
    ],
    tags: ['personas', 'review', 'multi-perspective', 'pressure-test', 'compliance'],
  },
  {
    id: 'xcmd-004',
    category: 'cmd_rules',
    title: 'Chain-of-Thought — Step by Step Reasoning',
    when: 'When you need the AI to solve complex problems without jumping to conclusions.',
    prompt: `Work through this problem step by step before giving a final answer.

Problem: [DESCRIBE YOUR PROBLEM OR QUESTION]

Instructions:
1. Restate the problem in your own words to confirm understanding
2. List all factors / variables to consider
3. Work through each factor one at a time, showing reasoning
4. Identify assumptions being made
5. Flag any areas of uncertainty
6. Then give your final answer/recommendation

Do not skip to the answer. Show your full reasoning chain.

Context:
- This is for [domain / Australian banking project]
- Stakes: [e.g., This will be presented to APRA / This goes into production]
- My initial thinking: [optional — share what you already think]`,
    tips: [
      'Use for complex decisions: build vs buy, architecture choices, regulatory interpretations.',
      'The "show your reasoning" approach also helps you spot where the AI is wrong.',
      'Add "challenge your own conclusion at the end" for extra rigour.',
    ],
    tags: ['reasoning', 'step-by-step', 'analysis', 'decision making'],
  },

  // ─── PRODUCT MANAGEMENT ─────────────────────────────────────
  {
    id: 'xpm-001',
    category: 'product_mgmt',
    title: 'Prioritisation Framework — RICE / MoSCoW',
    when: 'When you need to prioritise a backlog and justify the order to stakeholders.',
    prompt: `Prioritise the following backlog items using [RICE / MoSCoW / WSJF]:

Items to prioritise:
[List your features/stories — e.g.:
- Feature A: CDR Phase 4 compliance
- Feature B: PayTo migration
- Feature C: Biometric login enhancement
- Feature D: Transaction search improvement]

For RICE scoring, calculate for each item:
- **Reach:** How many users/customers affected per quarter?
- **Impact:** Effect per user: Massive(3) / High(2) / Medium(1) / Low(0.5)
- **Confidence:** % confidence in estimates: High(100%) / Medium(80%) / Low(50%)
- **Effort:** Person-quarters to build

RICE Score = (Reach × Impact × Confidence) / Effort

Output as a scored, ranked table.
Then highlight which items have regulatory/compliance drivers that override score-based prioritisation.`,
    tips: [
      'Regulatory compliance items (APRA deadlines, CDR phases) override RICE scores — flag these separately.',
      'Always show your scoring assumptions — stakeholders will challenge the numbers.',
    ],
    tags: ['prioritisation', 'RICE', 'MoSCoW', 'backlog', 'product'],
  },
  {
    id: 'xpm-002',
    category: 'product_mgmt',
    title: 'Roadmap — Quarterly Planning',
    when: 'When creating or updating a product roadmap for stakeholder alignment.',
    prompt: `Build a Product Roadmap for [PRODUCT / TEAM]:

Time horizon: [e.g., Q3 2025 — Q2 2026]
Strategic themes: [List 2-4 themes, e.g., Regulatory Compliance, Customer Experience, Platform Stability]

Format as a Now / Next / Later roadmap:
- **Now (Current Quarter):** Committed, in delivery
- **Next (Following Quarter):** Planned, dependencies being resolved
- **Later (Future):** Directional, subject to change

For each item:
- Theme
- Initiative name
- Business value / regulatory driver
- Estimated size (S/M/L/XL)
- Dependencies
- Confidence level (High / Medium / Exploratory)

Include:
- A separate "Regulatory Commitments" section with APRA/ACCC/AUSTRAC deadlines
- 3 risks that could derail the roadmap
- A "What's NOT on the roadmap" section for stakeholder expectation management`,
    tips: [
      'A "What\'s NOT on the roadmap" section prevents scope creep and manages expectations.',
      'Regulatory commitment rows should be red if the deadline is within 60 days.',
    ],
    tags: ['roadmap', 'planning', 'quarterly', 'strategy', 'product'],
  },
  {
    id: 'xpm-003',
    category: 'product_mgmt',
    title: 'Go-to-Market (GTM) Strategy',
    when: 'When planning how to launch a new feature — communication, rollout, and success measurement.',
    prompt: `Create a Go-to-Market strategy for:

Feature: [FEATURE NAME]
Target users: [Who will use this?]
Launch date: [Target date]
Channels: [e.g., Mobile App, Internet Banking, Branch notification]
Rollout approach: [All users at once / Phased by region / Beta first]

GTM plan:
1. **Launch Phases** — Beta/Soft launch (who, when), full rollout criteria, monitoring period
2. **User Communication** — in-app copy (max 100 words), push notification (max 50 chars), email subject lines (3 options), support team FAQ
3. **Readiness** — teams to brief, support talking points, post-launch escalation path
4. **Success Metrics** — D+7 targets, D+30 targets, continue/iterate/rollback decision criteria
5. **Risk & Rollback** — top 3 risks with monitoring triggers, rollback procedure

For features with compliance implications: add APRA/ASIC notification timing.`,
    tips: [
      'Always define rollback criteria before launch — not after something goes wrong.',
      'The "Support team talking points" section prevents a flood of tier-1 escalations.',
    ],
    tags: ['GTM', 'launch', 'rollout', 'communication', 'product'],
  },

  // ─── AGILE & SCRUM ───────────────────────────────────────────
  {
    id: 'xagile-001',
    category: 'agile',
    title: 'Sprint Retrospective Facilitation',
    when: 'When facilitating a sprint retrospective and want actionable outcomes beyond "what went well".',
    prompt: `Facilitate a Sprint Retrospective for:

Team: [Team name / composition]
Sprint: Sprint [NUMBER]
Sprint Goal: [What was the sprint trying to achieve?]
Outcome: [Did we meet the goal? Velocity? Major incidents?]
Format: [4Ls / Start-Stop-Continue / Mad-Sad-Glad]
Time: [e.g., 60 minutes]
Team size: [e.g., 8 people]

Generate:
1. **Ice-breaker question** (30 seconds per person, fun and energising)
2. **Data review prompt** — sprint metrics to show the team
3. **Individual reflection prompts** (5 minutes silent writing)
4. **Group discussion structure** — how to group and vote on themes
5. **Action item format** — Owner | Action | Done By date
6. **Closing ritual** — end on a positive note

Also generate:
- 5 powerful questions to surface hidden issues (psychological safety considered)
- How to handle if someone dominates the discussion`,
    tips: [
      'Open with ground rules: "no blame, no rank".',
      'Check previous retro actions at the start — accountability builds trust.',
    ],
    tags: ['retrospective', 'agile', 'scrum', 'facilitation', 'team'],
  },
  {
    id: 'xagile-002',
    category: 'agile',
    title: 'Backlog Refinement Preparation',
    when: 'When preparing User Stories before refinement to ensure the session is productive.',
    prompt: `Help me prepare for a backlog refinement session.

Sprint refinement date: [DATE]
Stories to refine: [List story titles/IDs]
Team capacity: [e.g., 2-week sprint, team of 5 devs = 40 points]

For each User Story, generate a Definition of Ready checklist:
☐ As a / I want / So that format
☐ Acceptance criteria are clear and testable
☐ Story has been sized (or needs estimation)
☐ Dependencies identified
☐ UI/UX designs attached (if applicable)
☐ API contracts defined (if applicable)
☐ Regulatory compliance requirements flagged

**For each story NOT ready:**
- What is missing?
- Who is the owner to resolve?

**Refinement session agenda:**
- Story 1: [estimated time]
- Buffer for questions: 15 min

**Questions to prepare for the team:**
[Generate 3 questions per story]`,
    tips: [
      'Stories that fail Definition of Ready should be pulled from the session — don\'t waste the team\'s time.',
      'Send prepared questions to the team 24 hours before the session.',
    ],
    tags: ['backlog', 'refinement', 'definition of ready', 'agile', 'scrum'],
  },
  {
    id: 'xagile-003',
    category: 'agile',
    title: 'Definition of Done & Definition of Ready',
    when: 'When your team needs to agree on quality standards for "done" and "ready".',
    prompt: `Create a Definition of Done (DoD) and Definition of Ready (DoR) for:

Team context:
- Product: [e.g., Digital banking mobile app / Compliance portal]
- Team: [e.g., 2 BAs, 4 developers, 1 QA, 1 UX]
- Release frequency: [e.g., Continuous / Monthly]
- Regulatory requirements: [e.g., Australian financial services — APRA audit logging, CDR conformance]

**Definition of Ready (story can enter sprint):**
Checklist all stories must pass — business, technical, UX, compliance criteria.

**Definition of Done (multi-level):**
- Done for Development
- Done for QA
- Done for BA sign-off
- Done for Release

**Team Agreement format:**
- Simple language, maximum 10 items per level
- Traffic light status: 🟢 Met / 🟡 Partially / 🔴 Not met
- How to handle exceptions

Include a "Compliance Gate" — additional items for stories touching APRA/CDR/AUSTRAC obligations.`,
    tips: [
      'Review DoD/DoR every 3-4 sprints — evolve it as the team matures.',
      'The Compliance Gate is unique to Australian banking — add it to every banking team\'s DoD.',
    ],
    tags: ['DoD', 'DoR', 'quality', 'agile', 'team agreements', 'compliance'],
  },
];

// ── Merge into base CATEGORIES and PROMPTS ──────────────────
if (typeof CATEGORIES !== 'undefined') {
  const favIdx = CATEGORIES.findIndex(c => c.id === 'favourites');
  if (favIdx > -1) {
    CATEGORIES.splice(favIdx, 0, ...EXTRA_CATEGORIES);
  } else {
    CATEGORIES.push(...EXTRA_CATEGORIES);
  }
}

if (typeof PROMPTS !== 'undefined') {
  PROMPTS.push(...EXTRA_PROMPTS);
}
