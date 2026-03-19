// ============================================================
//  AU BANKING TOOLKIT — DATA V4 (User Stories & Scans)
//  Covers deeply drafted User Stories (UI, BFF, Backend, Spike)
//  and Advanced BA Analysis (Req Scans, Solution Scans).
// ============================================================

const V4_CATEGORIES = [
  { id: 'us_ui',              label: 'US: Frontend / UI',     icon: 'monitor', groupId: 'tools' },
  { id: 'us_bff',             label: 'US: BFF / Orchestration', icon: 'link', groupId: 'tools' },
  { id: 'us_backend',         label: 'US: Backend / Core',    icon: 'settings', groupId: 'tools' },
  { id: 'us_spike',           label: 'US: Tech Spike',        icon: 'microscope', groupId: 'tools' },
  { id: 'us_techdebt',        label: 'US: Tech Debt',         icon: 'eraser', groupId: 'tools' },
  { id: 'us_deploy',          label: 'US: Deployment',        icon: 'rocket', groupId: 'tools' },
  { id: 'us_compliance',      label: 'User Story: Regulatory', icon: 'scale', groupId: 'regs' },
  
  { id: 'feature_breakdown',  label: 'Feature Breakdown Scan', icon: 'puzzle', groupId: 'tools' },
  { id: 'requirements_scan',  label: 'Requirements Scan',     icon: 'search', groupId: 'tools' },
  { id: 'solution_design',    label: 'Solution Design Scan',  icon: 'building', groupId: 'tools' },
  { id: 'ba_analysis',        label: 'Gap Analysis',          icon: 'bar-chart-3', groupId: 'tools' },
  { id: 'api_nfr',            label: 'API & NFR Specs',       icon: 'timer', groupId: 'core' }
];

const V4_PROMPTS = [

  // ─── DRAFT USER STORIES ──────────────────────────────────
  {
    id: 'v4-us01',
    category: 'us_ui',
    title: 'Draft User Story: Frontend / UI',
    when: 'When defining a front-end ticket focusing on user interaction, validation, and accessibility.',
    prompt: `Act as a Senior Technical Business Analyst. I need a comprehensive Frontend / UI User Story drafted for the following feature:

**Feature Topic:** [FEATURE OR SCREEN NAME]
**Target Platform:** [e.g., iOS App / React Web Dashboard]
**User Persona:** [e.g., Retail Banking Customer]

Provide the following structure (use Markdown):
1. **Overview / Scenario:** High-level context of what the user is trying to achieve.
2. **User Narrative:** As a... I want to... So that...
3. **In Scope & Out of Scope:** Clear boundaries.
4. **UI Behavior & Interactions:** Loading states, empty states, and error states.
5. **Acceptance Criteria (BDD / Gherkin format):**
   - Happy Path
   - Form Validation errors
   - Network failure / API timeout UX
6. **Accessibility (A11y):** WCAG 2.1 AA requirements specific to this UI element.

Focus on digital banking standards, where clarity and error prevention are critical.`,
    tags: ['user story', 'frontend', 'ui', 'ux', 'agile'],
    tips: ['In digital banking, the "Network failure UX" is critical — avoid generic error messages.']
  },
  {
    id: 'v4-us02',
    category: 'us_bff',
    title: 'Draft User Story: BFF (Backend For Frontend)',
    when: 'When defining an API orchestration layer that translates backend services for the UI app.',
    prompt: `Act as a Technical BA. I need a User Story for a BFF (Backend-For-Frontend) endpoint implementation.

**BFF Endpoint:** [e.g., GET /mobile/v2/dashboard]
**Client App:** [e.g., React Native App]
**Downstream APIs to Orchestrate:** [e.g., Core Banking Account API, Reward Points API]

Structure the story as follows:
1. **Narrative:** As the [Client App], I need to call [BFF Endpoint], so that I can render the screen with a single network request.
2. **In Scope / Out of Scope:** Include what the BFF should NOT do (e.g., business logic).
3. **Data Mapping & Transformation:** How the downstream payloads are filtered/combined to create the BFF response payload.
4. **Acceptance Criteria:**
   - Happy path (All downstreams succeed)
   - Partial degradation (e.g. Reward system is down, but Accounts succeed)
   - Downstream timeout / 5xx handling
   - Caching rules (if applicable)
5. **Security Requirements:** Token validation (BFF translating JWT to downstream headers).

Do not include frontend UI specifics, focus purely on the API contract and orchestration logic.`,
    tags: ['user story', 'bff', 'api', 'orchestration', 'microservices']
  },
  {
    id: 'v4-us03',
    category: 'us_backend',
    title: 'Draft User Story: Backend Core Service',
    when: 'When writing a story for the core backend system handling logic, transactions, or state changes.',
    prompt: `Act as a Technical BA. Draft a complex Backend / Core Service User Story for:

**Service Name:** [e.g., Payment Execution Service]
**Business Capability:** [e.g., Internal Bank Transfer Processing]
**Trigger Event:** [e.g., POST Request from API Gateway or Kafka Event consumed]

Format structure:
1. **Business Narrative:** As a [System/Actor], I want to [Perform Action], so that [Business Value].
2. **Core Business Rules:** Bulleted list of logic checks (e.g., sufficient funds check, limit check).
3. **Database Constraints / State Changes:** Which tables/statuses are updated.
4. **Idempotency & Concurrency:** How the service handles duplicate requests safely.
5. **Acceptance Criteria (Gherkin):**
   - Successful execution and state change
   - Business rule violation (e.g., insufficient funds)
   - Concurrency collision handling
6. **Audit & Logging:** specific APRA/Compliance requirements for logging this transaction.

Be precise about transactional boundaries and failure rollbacks.`,
    tags: ['user story', 'backend', 'core banking', 'transaction', 'logic']
  },
  {
    id: 'v4-us04',
    category: 'us_spike',
    title: 'Draft User Story: Technical Spike',
    when: 'When the development team needs a strictly timeboxed ticket to research an unknown technical solution.',
    prompt: `Act as an Agile Business Analyst. Draft a Technical Spike Charter for the backlog.

**Topic to investigate:** [e.g., Evaluating replacing RabbitMQ with Kafka for notifications]
**Why we can't build it yet (The Unknown):** [e.g., We don't know the exact latency differences or migration cost]
**Timebox length:** [e.g., 2 developer days]

Draft the Spike Story including:
1. **Problem Statement:** What risk or unknown are we trying to eliminate?
2. **Specific Questions to Answer:** Must provide 3-4 highly specific technical questions this spike will resolve.
3. **Timebox Constraint:** Strict enforcement rule.
4. **Deliverables Output:** E.g., An ADR (Architecture Decision Record), a summary Confluence page, or a Proof of Concept repo.
5. **Acceptance Criteria:** 
   - Code written in this spike MUST NOT be deployed to production.
   - The selected questions have documented answers.
   - A subsequent implementation story is drafted and sized based on these findings.`,
    tags: ['user story', 'spike', 'research', 'agile', 'tech debt']
  },
  {
    id: 'v4-us05',
    category: 'us_techdebt',
    title: 'Draft User Story: Technical Debt',
    when: 'When creating a ticket solely to refactor code, update a library, or fix systemic architecture flaws.',
    prompt: `Act as a Product Owner / BA. I need a User Story specifically formatted to justify and execute a Technical Debt fix.

**Tech Debt Description:** [e.g., Upgrade legacy payment parser to new standard]
**Affected System:** [e.g., Transaction Ingestion Worker]

Format this carefully so business stakeholders understand why capacity is being used on this:
1. **Business Justification (Why do this now?):** Explain the cost of delay, the risk (e.g., security vulns), or how it's slowing the team down.
2. **Current State vs Target State:** Brief summary of the underlying change.
3. **In Scope & Out of Scope:** Strictly limit the scope to prevent feature-creep during refactoring.
4. **Acceptance Criteria:**
   - The refactor is completed without changing the external API contract.
   - Mention the specific automated regression tests that MUST pass.
   - Performance baseline is maintained or improved.
5. **Rollback Plan:** What happens if the refactored code fails in production?`,
    tags: ['user story', 'tech debt', 'refactor', 'maintenance', 'product']
  },
  {
    id: 'v4-us06',
    category: 'us_deploy',
    title: 'Draft User Story: Deployment / Release',
    when: 'When tracking the operational tasks of cutting over a major feature into production environments.',
    prompt: `Act as a DevOps BA. Create a Deployment / Cutover User Story for the upcoming release.

**Release/Epic Name:** [e.g., Osko NPP Phase 2]
**Target Environment:** Production
**Feature Toggle Name:** [e.g., ENABLE_OSKO_PHASE2]

Structure the deployment checklist story:
1. **Narrative:** As the Release Manager, I want to deploy [Release Name] safely, so that customers can access the new feature without disruption.
2. **Pre-Deployment Checklist:** Data migrations, environment variable setups, third-party API configurations.
3. **Cutover Steps:** The exact sequence (e.g., 1. Deploy DB script, 2. Deploy Backend, 3. Deploy Frontend).
4. **Acceptance Criteria (Post-Deployment Verification):**
   - The smoke tests verify the system is stable with the toggle OFF.
   - The feature toggle is flipped to ON for pilot users.
   - Monitoring alarms are active and not firing.
5. **Rollback Trigger / Runbook:** Exact constraints (e.g., "If error rate exceeds 2% for 5 mins, turn feature toggle OFF").

This prevents deployment chaos by making cutovers a trackable backlog item.`,
    tags: ['user story', 'deployment', 'release', 'devops', 'cutover']
  },
  {
    id: 'v4-us07',
    category: 'us_compliance',
    title: 'Draft User Story: Compliance / Regulatory Gate',
    when: 'When implementing a ticket required purely to meet a legal, privacy, or APRA/AUSTRAC regulation.',
    prompt: `Act as a Compliance/Regulatory Business Analyst in Australian Banking. Draft a User Story for a compliance obligation.

**Regulation / Standard:** [e.g., APRA CPS 234 Information Security / Privacy Act 1988]
**Impacted Feature:** [e.g., Customer Address Update Flow]
**Specific Requirement:** [e.g., Must securely log who made the change for audit purposes]

Provide the following:
1. **Narrative / Legal Driver:** "As the Bank, I must comply with [Regulation], so that we avoid penalties and maintain our banking license."
2. **Detailed Obligation:** Plain English translation of the legal clause.
3. **Acceptance Criteria:**
   - E.g., the specific data fields that must be sent to the audit log.
   - Retention period constraints.
   - Access control (who is allowed to view the log).
4. **Validation Evidence Required:** What artifact must QA or Dev provide to prove to Risk/Audit that this was done correctly before Sign-off?`,
    tags: ['user story', 'compliance', 'regulatory', 'apra', 'austrac']
  },

  // ─── ANALYSIS & SCANS ────────────────────────────────────
  {
    id: 'v4-an01',
    category: 'feature_breakdown',
    title: 'Feature / Epic Breakdown Matrix',
    when: 'When you have a massive Epic and need the AI to suggest sensible, horizontal slices (User Stories).',
    prompt: `Act as a Senior Agile Coach and BA. I have a large Epic that needs to be decomposed into investable, deliverable User Stories.

**Epic Name / Goal:** [EPIC DESCRIPTION E.g., Implement Biometric Login for Mobile App]
**Platform Constraints:** [e.g., iOS and Android via React Native]

Decompose this Epic using the "Thin Vertical Slices" approach (avoid purely technical slicing like "DB story" then "API story").

Output a Markdown Table with the following columns:
| Story Title | User / Actor | Brief Description | Complexity (S/M/L) | Dependency / Sequence |

After the table, provide 3 questions or risks the team must resolve before sprint planning this Epic.`,
    tags: ['analysis', 'epic', 'breakdown', 'slicing', 'agile planner']
  },
  {
    id: 'v4-an02',
    category: 'requirements_scan',
    title: 'Business Requirements Edge-Case Scanner',
    when: 'When you drafted Requirements/ACs and want the AI to aggressively hunt for logical holes and missing permutations.',
    prompt: `Act as a critical QA Lead and Senior BA. I want you to pressure-test my drafted requirements for edge cases, missing logic, and contradictions.

**Focus Area:** [e.g., Financial Calculation / Timeout handling / Multi-device concurrency]

**My Drafted Requirements:**
"""
[PASTE YOUR RAW REQUIREMENTS OR CURRENT USER STORY HERE]
"""

Perform a strict critique based on standard Australian digital banking systems. Look for:
1. What happens if the user force-closes the app mid-flow?
2. What happens if the upstream core system takes 30 seconds to respond?
3. What if the user does this action twice simultaneously (double-tap)?
4. Are there any timezone / DST issues?

Provide a bulleted list of "Missing Requirements" or "Ambiguities" that I need to clarify with the business. Identify the gaps clearly.`,
    tags: ['analysis', 'requirements', 'qa', 'edge cases', 'review']
  },
  {
    id: 'v4-an03',
    category: 'solution_design',
    title: 'Review Solution Architecture for Failure Scenarios',
    when: 'When reviewing a developer\'s technical Sol-Design document and you want to ask intelligent, probing NFR questions.',
    prompt: `Act as a Principal Solutions Architect. I am reviewing a technical design propsoed by my developers. Help me generate strong probing questions focusing on resilience, security, and scalability.

**Proposed Solution Summary:**
[E.g. We will use AWS SNS to publish to a Node JS worker, which updates the on-prem SQL server over a VPN]

Analyse this approach and generate 5 tough technical questions I should ask the lead developer in the workshop tomorrow. Focus heavily on:
- Error handling & Retries (What happens when it breaks?)
- Idempotency (What happens if a message arrives twice?)
- Rate Limits & Back-pressure (What happens under 10x traffic spikes?)
- Data Consistency

Format as:
1. **[Focus Area] Question:** ...
   *Why I should ask this:* (Brief BA rationale)
   *Red flag answer:* (What answer from the dev should worry me)`,
    tags: ['analysis', 'solution design', 'architecture', 'nfr', 'resilience']
  },
  {
    id: 'v4-an04',
    category: 'ba_analysis',
    title: 'Current State vs Future State Gap Analysis',
    when: 'When documenting a process change or migration and you need a structured matrix of the differences.',
    prompt: `Conduct a structured Gap Analysis between the Current State and the Proposed Future State.

**Business Process:** [e.g., Disputes lodgement and resolution]
**Current State System/Process:** [e.g., Manual paper forms scanned by branch staff, emailed to back office]
**Future State System:** [e.g., Fully digital straight-through processing via mobile app API]

Generate a Gap Analysis matrix containing the following columns:
| Dimension | Current State | Future State | Identified Gap | Action Required |

Include the following dimensions as rows in the table:
1. Customer Experience (UX)
2. Staff / Operational impact
3. Technology / Data Storage
4. Regulatory Auditability (APRA/ASIC)
5. Processing Time (SLA)

Conclude with the top 3 Change Management risks this migration will cause for staff.`,
    tags: ['analysis', 'gap analysis', 'process mapping', 'change management']
  }
];

// ── Merge into base ─────────────────────────────────────────
if (typeof CATEGORIES !== 'undefined') {
  // Find where to insert safely (e.g. after 'General' or just unshift/push)
  const insertIndex = CATEGORIES.findIndex(c => c.id === 'requirements');
  if (insertIndex > -1) {
    CATEGORIES.splice(insertIndex, 0, ...V4_CATEGORIES);
  } else {
    CATEGORIES.push(...V4_CATEGORIES);
  }
}

if (typeof PROMPTS !== 'undefined') {
  PROMPTS.push(...V4_PROMPTS);
}
