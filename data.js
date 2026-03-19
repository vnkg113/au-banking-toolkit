// ============================================================
//  AU BANKING TOOLKIT — DATA
//  Focus: Australian Banking & Financial Services Domain
//  Regulations: APRA, ASIC, CDR/Open Banking, AUSTRAC, NPP
// ============================================================

const GROUPS = [
  { id: 'core',        label: 'Core Frameworks',   icon: 'folder' },
  { id: 'regs',        label: 'Banking Regulations',icon: 'scale' },
  { id: 'domains',     label: 'Banking Domains',   icon: 'landmark' },
  { id: 'tools',       label: 'Tools & Internal',  icon: 'wrench' },
  { id: 'guidance',    label: 'Guidance & Knowledge', icon: 'book-open' },
];

const CATEGORIES = [
  { id: 'all',          label: 'All Prompts',         icon: 'layers', groupId: 'core' },
  { id: 'requirements', label: 'Requirements',         icon: 'clipboard-list', groupId: 'core' },
  { id: 'diagrams',     label: 'Diagrams & Flows',     icon: 'component', groupId: 'core' },
  { id: 'api',          label: 'API Specifications',   icon: 'link', groupId: 'core' },
  { id: 'documentation',label: 'PRD & Docs',           icon: 'file-text', groupId: 'core' },
  { id: 'data',         label: 'Data & SQL',            icon: 'bar-chart-3', groupId: 'core' },
  
  { id: 'apra',         label: 'APRA & Prudential',    icon: 'building-2', groupId: 'regs' },
  { id: 'aml',          label: 'AML & Compliance',     icon: 'shield-check', groupId: 'regs' },
  { id: 'cdr',          label: 'CDR / Open Banking',   icon: 'unlock', groupId: 'regs' },
  { id: 'fraud',        label: 'Fraud & Risk',         icon: 'alert-triangle', groupId: 'regs' },

  { id: 'loans',        label: 'Lending & Mortgages',  icon: 'home', groupId: 'domains' },
  { id: 'mobile',       label: 'Mobile Banking',       icon: 'smartphone', groupId: 'domains' },
  { id: 'npp',          label: 'NPP & Payments',       icon: 'banknote', groupId: 'domains' },

  { id: 'prototyping',  label: 'Prototyping & UI',     icon: 'palette', groupId: 'tools' },
  { id: 'stakeholder',  label: 'Stakeholder Comms',    icon: 'handshake', groupId: 'tools' },
  { id: 'testing',      label: 'Test Cases & QA',      icon: 'beaker', groupId: 'tools' },
  { id: 'ai_setup',     label: 'AI Context Setup',     icon: 'bot', groupId: 'tools' },
  { id: 'favourites',   label: 'Favourites',           icon: 'star', groupId: 'core' },
];

const PROMPTS = [

  // ─── REQUIREMENTS ──────────────────────────────────────────
  {
    id: 'req-001',
    category: 'requirements',
    title: 'User Story with Full AC (Australian Banking)',
    when: 'When drafting a complete User Story for an Australian banking feature, with APRA/ASIC-aware acceptance criteria.',
    prompt: `Act as a Senior Business Analyst for an Australian Authorised Deposit-taking Institution (ADI).

I need a User Story for the following feature:
[FEATURE DESCRIPTION]

Please generate:

1. **User Story** (As a / I want / So that format)
2. **Acceptance Criteria** using Gherkin (Given / When / Then):
   - Happy path (success scenario)
   - Failure paths (at least 3 edge cases)
   - Boundary conditions
3. **Out of Scope** — 3 items explicitly excluded
4. **Dependencies** — systems or APIs this story depends on
5. **Definition of Done** checklist
6. **Regulatory Considerations** — relevant APRA, ASIC, or Privacy Act obligations

Context:
- Platform: [Mobile App / Internet Banking / Both]
- Users: [Retail Customer / Business Customer / Staff]
- Regulatory constraints: [e.g., APRA CPS 234, ePayments Code, Privacy Act 1988]`,
    tips: [
      'Always specify whether the feature is subject to the ePayments Code — it affects liability requirements',
      'Include AFCA (Australian Financial Complaints Authority) dispute resolution requirement where relevant',
      'For any feature touching CDR data, add the Consumer Data Rules obligations',
    ],
    tags: ['user story', 'gherkin', 'APRA', 'acceptance criteria', 'ADI'],
  },
  {
    id: 'req-002',
    category: 'requirements',
    title: 'Edge Case Discovery — Australian Context',
    when: 'When stress-testing requirements to find gaps specific to Australian banking scenarios.',
    prompt: `You are a skeptical Senior QA Engineer reviewing requirements for an Australian bank.

Here are my requirements for [FEATURE NAME]:
[PASTE YOUR REQUIREMENTS]

Identify issues across these Australian-specific dimensions:

1. **Missing edge cases** — scenarios not considered
2. **Regulatory gaps** — APRA prudential standards, ASIC RG/PS, ePayments Code, Privacy Act 1988, AML/CTF Act
3. **CDR/Open Banking gaps** — if feature involves data sharing, check CDR Consumer Data Rules compliance
4. **NPP-specific risks** — if instant payments involved, check PayID, Osko, and mistaken payment scenarios
5. **AUSTRAC obligations** — AML/CTF reporting, threshold transaction reports (TTR), suspicious matter reports (SMR)
6. **Accessibility** — WCAG 2.1 AA compliance for digital channels
7. **Ambiguous language** — terms developers might interpret differently

For each issue: problem statement | risk if left unresolved | suggested requirement`,
    tips: [
      'Run this before sprint refinement — especially for any payments or data-sharing features',
      'The AUSTRAC section is often skipped by BAs but catches significant compliance gaps',
      'For mortgage features, add "check NCCP Act (responsible lending)" to regulatory gaps',
    ],
    tags: ['edge cases', 'APRA', 'CDR', 'NPP', 'AUSTRAC', 'review'],
  },
  {
    id: 'req-003',
    category: 'requirements',
    title: 'Epic Decomposition — Australian Banking',
    when: 'When breaking a large banking epic into sprint-sized stories, accounting for regulatory and compliance work.',
    prompt: `You are a Business Analyst facilitating epic decomposition for an Australian bank.

Epic: [EPIC TITLE]
Epic Description: [Brief description]
Target Users: [Who uses this feature]
Business Goal: [What business problem it solves]
Regulatory Driver: [e.g., APRA CPS 230 compliance, CDR Phase 4 rollout, AFCA requirements]

Please decompose this epic into:
1. A list of User Stories (minimum 5, maximum 12)
2. For each story:
   - Story title
   - Priority: Must Have / Should Have / Could Have (MoSCoW)
   - Story points estimate (Fibonacci: 1,2,3,5,8,13)
   - Key acceptance criterion (one sentence)
   - Regulatory/compliance dependency (if any)
   - Dependencies on other stories

Then provide:
- Suggested sprint allocation across [NUMBER] sprints
- Compliance stories that must be completed before go-live
- Identified risks for the epic`,
    tags: ['epic', 'decomposition', 'MoSCoW', 'planning', 'compliance'],
    tips: [
      'Always include a dedicated "Compliance & Audit Logging" story in banking epics',
      'Regulatory stories (e.g., APRA attestation, AUSTRAC reporting) often block go-live — flag them early',
      'Check if the epic requires an ASIC breach notification pathway',
    ],
  },

  // ─── DIAGRAMS ──────────────────────────────────────────────
  {
    id: 'dia-001',
    category: 'diagrams',
    title: 'Sequence Diagram — Australian Payment Flow',
    when: 'When documenting how systems interact for Australian payment processing (NPP, direct entry, BPAY).',
    prompt: `Create a Mermaid.js Sequence Diagram for the following Australian payment flow:

Payment Type: [e.g., NPP Instant Payment / BPAY / Direct Entry / EFTPOS]
Feature: [FEATURE NAME]
Actors/Systems: [e.g., Mobile App, API Gateway, Payment Hub, NPP Infrastructure, Reserve Bank FSS, Beneficiary ADI]

Flow description:
[Describe the flow step by step]

Requirements:
- Show the happy path in full
- Show the main failure/rejection path
- Include NPP clearing and settlement steps if applicable
- Show AUSTRAC reporting trigger if threshold is crossed
- Add ePayments Code obligations (notification of payment)
- Use proper Mermaid sequenceDiagram syntax

Output the Mermaid code block only, ready to render.`,
    tips: [
      'For NPP flows, always include the PayID resolution step before the payment instruction',
      'The Reserve Bank FSS (Fast Settlement Service) settles NPP transactions — include it as an actor',
      'Add "BECS" or "SWIFT" labels to message types for technical accuracy',
    ],
    tags: ['sequence', 'mermaid', 'NPP', 'BPAY', 'payments', 'flow'],
  },
  {
    id: 'dia-002',
    category: 'diagrams',
    title: 'User Journey Map — Australian Banking Customer',
    when: 'When mapping a customer journey through a digital banking feature for an Australian retail banking context.',
    prompt: `Create a User Journey Map for:

Persona: [e.g., "[User] — [Age]-year-old [City] professional, [Major Bank] customer"]
Journey: [e.g., "Applying for a home loan via the mobile app" / "Setting up CDR data sharing"]

Map each stage with:
1. **Stages** (steps the user goes through)
2. **User Actions** (what they physically do)
3. **Touchpoints** (channel: mobile app / internet banking / branch / phone)
4. **Emotions** (😀 Happy / 😐 Neutral / 😟 Frustrated — use emojis)
5. **Pain Points** (frustrations specific to Australian banking UX)
6. **Regulatory Moments** (where T&Cs, disclosure docs, or consent must be presented)
7. **Opportunities** (how to improve experience, referencing comparable fintech benchmarks)

Format as a markdown table for sharing with design and product teams.`,
    tips: [
      'Reference market-leading UX benchmarks (Neobanks, Tier 1 apps) as UI guidelines',
      'Regulatory moments (disclosure, consent, verification) are often the biggest friction points in AU banking UX',
      'Include the "7-day bank switch" window for home loans as a regulatory moment',
    ],
    tags: ['user journey', 'UX', 'persona', 'Australian customer', 'experience'],
  },
  {
    id: 'dia-003',
    category: 'diagrams',
    title: 'ERD — Core Banking Data Model',
    when: 'When designing or documenting database structures for Australian banking entities.',
    prompt: `Create a Mermaid.js ERD for the following Australian banking domain:

Domain: [e.g., Retail Account Management / Mortgage Origination / CDR Consent Management]

Entities to model: [List, e.g., Customer, Account, Transaction, Loan, CDR Consent, Beneficiary]

Australian-specific rules to reflect:
- Customer must have: TFN indicator, residency status, AFCA eligibility flag
- Account must have: BSB (6-digit), Account Number, account type (per Banking Act 1959)
- Transaction must have: transaction reference number, NPP UE (if applicable), BSB routing
- [Add your own rules]

For each entity include:
- Primary key
- Key attributes (min 5 fields)
- Australian-specific regulatory fields

Use Mermaid erDiagram syntax with proper cardinality notation.
Output Mermaid code block only.`,
    tips: [
      'Always include BSB and Account Number as separate fields — they are Australia-specific routing identifiers',
      'Add TFN (Tax File Number) handling fields with a privacy indicator — TFN is sensitive under Privacy Act',
      'CDR consent entities require: consent_id, data_holder_brand, sharing_duration, cdr_arrangement_id',
    ],
    tags: ['ERD', 'database', 'BSB', 'CDR', 'data model', 'mermaid'],
  },

  // ─── API SPECIFICATIONS ─────────────────────────────────────
  {
    id: 'api-001',
    category: 'api',
    title: 'CDR / Open Banking API Specification',
    when: 'When implementing Consumer Data Right (CDR) APIs that must conform to the Australian CDR Standards.',
    prompt: `Draft a CDR-compliant OpenAPI 3.0 specification for an Australian Open Banking endpoint.

CDR API Category: [e.g., Get Accounts / Get Transactions / Get Customer Detail]
CDR Standards Version: [e.g., v1.29 — check https://consumerdatastandardsaustralia.github.io/standards/]
Endpoint path: [e.g., /cdr-au/v1/banking/accounts]
Data Holder Brand: [Your bank name]

Business rules:
- Must implement x-fapi-interaction-id header (tracking ID)
- Must implement x-fapi-auth-date for FAPI compliance
- Must enforce CDR arrangement ID validation
- Data must align to CDR Common Object definitions (BankingAccount, BankingTransaction)
- Must handle sharing period expiry (403 response when consent expired)

Error scenarios to include:
- 400: Invalid request format
- 401: Expired/invalid access token
- 403: Consent expired or scope mismatch
- 404: Resource not found
- 429: Rate limited (CDR mandates rate limit headers)
- 422: CDR-specific business rule violation

Output valid OpenAPI 3.0 YAML. Include CDR-specific headers and response schemas.`,
    tips: [
      'Always reference the latest CDR Standards version — the ACCC updates them regularly',
      'CDR requires FAPI 1.0 Advanced security profile — ensure auth flows reflect this',
      'Include x-v (version) and x-min-v (minimum version) headers — they are mandatory in CDR',
    ],
    tags: ['CDR', 'Open Banking', 'OpenAPI', 'FAPI', 'ACCC', 'API'],
  },
  {
    id: 'api-002',
    category: 'api',
    title: 'NPP PayID API — Specification',
    when: 'When designing API endpoints for NPP PayID registration, lookup, or routing.',
    prompt: `Draft an OpenAPI 3.0 specification for NPP PayID operations.

Operation: [e.g., Register PayID / Lookup PayID / Transfer PayID / Close PayID]
PayID Types supported: [e.g., Mobile Number / Email / ABN / Organisation ID]

Business rules per NPP PayID framework:
- PayID must be validated against NPPA PayID directory
- Locked PayID status must block transfers (24-hour security lock)
- PayID details must not expose account number in lookup response (return masked name only)
- Portability: PayID transfer must complete within 3 business days
- Dispute: PayID dispute process must initiate within 1 business day

Request/Response requirements:
[Describe the specific fields needed]

Error scenarios:
- 400: Invalid PayID format
- 404: PayID not registered
- 409: PayID already registered to another account
- 423: PayID locked (security hold)
- 503: NPPA directory unavailable

Output valid OpenAPI 3.0 YAML.`,
    tips: [
      'PayID lookup must NEVER return the BSB/account number — only a masked name as per NPPA rules',
      'Include the 24-hour lock mechanism in the PayID transfer flow — it is mandatory per NPPA regulations',
      'The NPP PayID directory is operated by NPPA — treat it as an external dependency with SLA requirements',
    ],
    tags: ['NPP', 'PayID', 'OpenAPI', 'NPPA', 'instant payments'],
  },
  {
    id: 'api-003',
    category: 'api',
    title: 'Error Code Catalogue — Australian Banking APIs',
    when: 'When standardising error responses across APIs in an Australian ADI context.',
    prompt: `Create a comprehensive Error Code Catalogue for [SYSTEM NAME] APIs at an Australian bank.

Domain: [e.g., Retail Payments / Mortgage Servicing / CDR Data Access]

Generate a table with columns:
- Error Code (e.g., PAY-4001)
- HTTP Status
- Error Name
- Technical Description
- User-Facing Message (plain English, AFCA-friendly language)
- Recovery Action
- Regulatory Reference (if applicable)

Cover categories:
1. Authentication & Authorisation (5 codes) — including CDR consent errors
2. Payment Validation errors (6 codes) — NPP, BPAY, direct entry specific
3. Business Rule Violations (8 codes) — daily limits, account restrictions, ePayments Code
4. AUSTRAC Triggers (3 codes) — threshold transaction, SMR hold
5. External Service errors (4 codes) — NPP infrastructure, BPAY Biller, credit bureau
6. System errors (3 codes)

Then provide a JSON schema for the standard error response body that complies with CDR error format.`,
    tips: [
      'CDR mandates a specific error response format — your error schema must match the CDR Standards meta error structure',
      'User-facing messages for payment blocks must be AFCA-compliant — avoid language that could be construed as accusatory',
      'AUSTRAC holds (SMR/TTR triggers) require careful user messaging — consult your legal team for approved copy',
    ],
    tags: ['error codes', 'API', 'CDR', 'AUSTRAC', 'ePayments Code'],
  },

  // ─── APRA & PRUDENTIAL ─────────────────────────────────────
  {
    id: 'apra-001',
    category: 'apra',
    title: 'CPS 234 — Information Security Requirements',
    when: 'When defining security requirements for a new system or feature that must comply with APRA CPS 234.',
    prompt: `You are a Senior BA at an Australian ADI. Define information security requirements based on APRA Prudential Standard CPS 234 (Information Security).

System/Feature: [SYSTEM OR FEATURE NAME]
Data Classification: [e.g., Customer PII / Financial Data / Authentication Credentials]

Generate requirements across these CPS 234 obligations:

1. **Information Security Capability** (Para 15-22)
   - Security controls commensurate with vulnerabilities and threats
   - Roles & responsibilities for information security

2. **Policy Framework** (Para 23-25)
   - Required security policies and standards for this system

3. **Information Asset Identification** (Para 26)
   - Data assets the system creates, holds, or transmits

4. **Implementation of Controls** (Para 27-33)
   - Technical controls required (encryption, access control, logging)
   - Physical controls if applicable

5. **Incident Management** (Para 34-36)
   - Detection, response, and APRA notification requirements
   - Timeframe: notify APRA within 72 hours of material incident

6. **Testing** (Para 37-41)
   - Penetration testing, vulnerability scanning requirements

Output as User Stories and NFRs (Non-Functional Requirements) ready for backlog.`,
    tips: [
      'CPS 234 applies to ALL APRA-regulated entities — including banks, insurers, and superannuation funds',
      'Para 36 is critical: material information security incidents must be reported to APRA within 72 hours',
      'If using a third-party cloud provider, add CPS 231 (Outsourcing) requirements to this checklist',
    ],
    tags: ['CPS 234', 'APRA', 'information security', 'cybersecurity', 'compliance'],
  },
  {
    id: 'apra-002',
    category: 'apra',
    title: 'CPS 230 — Operational Risk Requirements',
    when: 'When designing systems or processes that must comply with APRA CPS 230 (Operational Risk Management).',
    prompt: `Define operational risk requirements for an Australian ADI under APRA CPS 230 (Operational Risk Management — effective 1 July 2025).

System/Process: [SYSTEM OR PROCESS NAME]
Risk Category: [e.g., Technology Risk / Third-Party Risk / Business Continuity]

Generate requirements for:

1. **Operational Risk Management** (Para 15-25)
   - Risk appetite statements relevant to this system
   - Control library for identified operational risks
   - Key Risk Indicators (KRIs) to monitor

2. **Business Continuity** (Para 26-41)
   - Recovery Time Objective (RTO) requirements
   - Recovery Point Objective (RPO) requirements
   - Critical operations identification

3. **Service Provider Management** (Para 42-57)
   - If using third parties: due diligence, ongoing monitoring, exit planning
   - Material service provider notification to APRA

4. **Incident & Problem Management**
   - Operational incident thresholds for APRA notification
   - Business disruption scenarios and responses

Format as:
- Non-Functional Requirements (NFRs) table
- Risk register entries (Risk | Likelihood | Impact | Control | Residual Risk)
- APRA notification trigger matrix`,
    tips: [
      'CPS 230 replaced CPS 231 and CPG 234 — effective 1 July 2025. Use the new standard.',
      'Material third-party arrangements must be notified to APRA — define "material" threshold in your NFRs',
      'Map your RTO/RPO to the "critical operations" definition in CPS 230 Attachment A',
    ],
    tags: ['CPS 230', 'APRA', 'operational risk', 'BCP', 'third-party'],
  },
  {
    id: 'apra-003',
    category: 'apra',
    title: 'BEAR / FAR — Accountable Persons Requirements',
    when: 'When designing governance features or documenting accountability obligations under the Banking Executive Accountability Regime (BEAR) or Financial Accountability Regime (FAR).',
    prompt: `Define requirements for compliance with the Financial Accountability Regime (FAR) — Australia's successor to BEAR, effective 2024-2025.

Feature/System: [e.g., Executive Accountability Register / Responsibilities Map / FAR Notifications]
Entity Type: [ADI / General Insurer / Life Insurer / RSE Licensee]

Generate requirements covering:

1. **Accountability Obligations** (FARA s.22-29)
   - Accountable Person registration with APRA and ASIC
   - Responsibilities Map maintenance and submission
   - Deferred remuneration requirements

2. **Notification Obligations**
   - APRA/ASIC notification triggers (within 30 days of event)
   - Disqualification events and prohibition orders

3. **Register Requirements**
   - Internal accountability register data model
   - Audit trail for register changes

4. **System Requirements** for compliance tooling:
   - User Stories for register management
   - Notification workflow automation
   - Reporting dashboard for accountable persons

Include a Responsibilities Map template aligned to FAR Schedule 2 prescribed responsibilities.`,
    tips: [
      'FAR extends BEAR to insurers and superannuation — check which entities are in scope for your organisation',
      'The Responsibilities Map is a living document — system must support versioning and history',
      'APRA and ASIC jointly administer FAR — both regulators may request the register',
    ],
    tags: ['FAR', 'BEAR', 'APRA', 'ASIC', 'accountability', 'governance'],
  },

  // ─── CDR / OPEN BANKING ────────────────────────────────────
  {
    id: 'cdr-001',
    category: 'cdr',
    title: 'CDR Consent Management — Full Flow',
    when: 'When designing the CDR (Consumer Data Right) consent flow for a Data Holder or Data Recipient.',
    prompt: `Design the complete CDR Consent Management flow for an Australian Open Banking implementation.

Role: [Data Holder (bank) / Data Recipient (accredited fintech)]
CDR Sector: [Banking / Energy / Telecommunications]
Consumer Type: [Individual / Business / Non-individual]

Generate:
1. **CDR Consent Journey** — step by step from authentication to data sharing
2. **Mermaid Sequence Diagram** — Consumer, Data Recipient App, Data Holder Auth Server, CDR Register, Resource Server
3. **Consent Dashboard Requirements** — what consumers must be able to see and manage
4. **Required Disclosure Elements** (per CDR Rules):
   - Purpose of data collection
   - Data clusters requested
   - Sharing duration
   - Third-party disclosure notice
5. **Consent States** — state machine: Active | Expired | Withdrawn | Amended
6. **FAPI 1.0 Advanced Security Requirements** — PAR, RAR, DCR endpoints
7. **Withdrawal Flow** — how consumer withdraws consent (must be possible at any time)
8. **User Stories** — 5 stories covering: grant consent, view consent, amend consent, withdraw consent, expired consent

Align to CDR Rules 4.14-4.25 and CDR Standards v1.29+.`,
    tips: [
      'CDR consumers can withdraw consent at any time — the withdrawal flow must be prominently accessible',
      'Data Holders must present a CDR Receipt within 24 hours of consent being granted',
      'Check the CDR Register for your accreditation status before implementing Data Recipient functions',
    ],
    tags: ['CDR', 'Open Banking', 'consent', 'FAPI', 'ACCC', 'data sharing'],
  },
  {
    id: 'cdr-002',
    category: 'cdr',
    title: 'CDR Data Holder — Compliance Checklist',
    when: 'When performing a gap analysis for your ADI\'s obligations as a CDR Data Holder.',
    prompt: `Conduct a CDR Data Holder compliance gap analysis for an Australian ADI.

Bank Name: [BANK NAME]
CDR Phase: [Phase 1 (Big 4) / Phase 2 (Mutuals) / Phase 3 (Non-bank lenders) / Phase 4]
Products in scope: [e.g., Transaction accounts, savings accounts, home loans, credit cards]

Analyse compliance across:

1. **Technical Obligations**
   - Endpoint availability (99.5% uptime for CDR APIs per standards)
   - API versioning support (must support x-v and x-min-v)
   - FAPI 1.0 Advanced security profile implementation
   - CDR Register integration (software statement assertions)

2. **Consumer Experience Obligations** (CDR Rules Part 4)
   - Consent dashboard accessibility (WCAG 2.1 AA)
   - Withdrawal mechanism (<3 clicks from login)
   - CDR receipts and notifications

3. **Data Quality Obligations**
   - Data accuracy requirements
   - Freshness requirements (transaction data within 24 hours)

4. **Reporting Obligations**
   - Performance metrics to ACCC (quarterly)
   - Incident reporting

Output as:
- Gap table: Obligation | Current State | Gap | Remediation Action | Priority
- Roadmap of remediation items by quarter`,
    tips: [
      'The ACCC publishes CDR performance dashboards publicly — your bank\'s uptime is visible to consumers',
      'Phase non-compliance can result in ACCC enforcement action — prioritise by risk',
      'Use DSB tooling (Data Standards Body) for CDR conformance testing',
    ],
    tags: ['CDR', 'Data Holder', 'compliance', 'ACCC', 'gap analysis'],
  },

  // ─── NPP & PAYMENTS ────────────────────────────────────────
  {
    id: 'npp-001',
    category: 'npp',
    title: 'NPP Instant Payment — End-to-End Specification',
    when: 'When designing NPP (New Payments Platform) transaction flows, including Osko and PayTo.',
    prompt: `Design the complete end-to-end specification for an NPP payment flow.

Payment Type: [NPP Osko P2P / NPP Osko Bill Payment / PayTo Agreement / PayTo Initiated Payment]
Initiator: [Customer via mobile app / Merchant via PayTo / Bulk payment batch]

Generate:
1. **Mermaid Sequence Diagram** — Mobile App, Payments API, Payments Hub, NPP Gateway, RBA Fast Settlement Service (FSS), Beneficiary ADI
2. **Pre-Payment Checks** (list all: balance, daily limit, PayID validation, sanctions screening, AUSTRAC TTR check)
3. **NPP Message Format** — ISO 20022 pacs.008 key fields for this flow
4. **Settlement Timeline** — NPP settles in near real-time (seconds); include FSS settlement confirmation
5. **PayID Resolution Step** — lookup, masked name confirmation by payer before send
6. **Failure Scenarios** — 6 types: insufficient funds, PayID not found, beneficiary ADI offline, TTR threshold, sanctions hit, duplicate detection
7. **Mistaken Payment Recovery** — process per ePayments Code (24-hour same-day, 10-business-day claim windows)
8. **Push Payment Fraud (ScamWatch)** — Confirmation of Payee (CoP) check requirements
9. **User Notifications** — push notification content at each stage
10. **Regulatory Requirements** — ePayments Code, NPPA rules, AUSTRAC TTR ($10,000+ threshold)`,
    tips: [
      'NPP uses ISO 20022 messaging — familiarise yourself with pacs.008 (credit transfer) and pacs.002 (status)',
      'The RBA FSS settles NPP transactions — it is a critical external dependency with its own SLA',
      'Mistaken Internet Payments (MIPs) procedure is mandatory under the ePayments Code — must be designed in from the start',
    ],
    tags: ['NPP', 'Osko', 'PayTo', 'ISO 20022', 'ePayments Code', 'FSS'],
  },
  {
    id: 'npp-002',
    category: 'npp',
    title: 'PayTo — Agreement Management Requirements',
    when: 'When designing PayTo mandate (agreement) creation, management, and payment initiation flows.',
    prompt: `Define requirements for PayTo Agreement Management for an Australian ADI or Payment Initiator.

Role: [Payer ADI (managing payer consent) / Payment Initiator (merchant/biller)]
Use Case: [e.g., Subscription billing / Loan repayment direct debit replacement / Insurance premium]

Generate:
1. **PayTo Agreement Lifecycle** — states: Created | Active | Paused | Cancelled | Expired
2. **Mermaid Sequence Diagram** — Payer App, PayTo API, Payer ADI, NPP PayTo Infrastructure, Payment Initiator
3. **Agreement Attributes** — all fields required in a PayTo Agreement (per NPPA PayTo specs)
4. **Consumer Protections** — 24-hour review window before first payment, pause/cancel rights
5. **Funds Availability Check** — real-time balance check before PayTo initiated payment
6. **Dispute & Unauthorised Payment** — recovery process per ePayments Code
7. **User Stories** — 5 stories: create agreement, authorise agreement, pause agreement, cancel agreement, dispute payment
8. **Notification Requirements** — what notifications payer must receive at each stage

Note: PayTo replaces the old direct debit (BECS) regime.`,
    tips: [
      'PayTo is replacing BECS direct debit — frame requirements around the migration path for existing direct debits',
      'Payers have 24 hours to review a PayTo agreement before it activates — design the UX accordingly',
      'Payment Initiators must be NPPA approved — include this as a dependency in your requirements',
    ],
    tags: ['PayTo', 'NPP', 'BECS', 'direct debit', 'mandate', 'NPPA'],
  },

  // ─── AML & COMPLIANCE ──────────────────────────────────────
  {
    id: 'aml-001',
    category: 'aml',
    title: 'AML/CTF Programme — Requirements',
    when: 'When defining requirements for AML/CTF systems under Australia\'s Anti-Money Laundering and Counter-Terrorism Financing Act 2006.',
    prompt: `You are a BA at an Australian Reporting Entity under the AML/CTF Act 2006.

Define requirements for AML/CTF compliance covering:

Entity Type: [ADI / Remittance Dealer / Digital Currency Exchange / Financial Services Provider]
Business Activity: [e.g., Retail banking / International remittance / Crypto exchange]

Generate requirements across:

1. **Customer Due Diligence (CDD)** — Section 32-44 AML/CTF Act
   - Standard CDD requirements
   - Enhanced CDD for PEPs (Politically Exposed Persons)
   - Beneficial ownership verification (threshold: 25%+ control)
   - Digital verification via Australian Document Verification Service (DVS)

2. **Transaction Monitoring Rules** — at least 10 rules:
   - Threshold Transaction Reports (TTRs) — $10,000 AUD or foreign equivalent
   - Suspicious Matter Reports (SMRs) — subjective trigger criteria
   - Structuring (smurfing) detection
   - High-risk jurisdiction monitoring

3. **AUSTRAC Reporting**
   - TTR submission: within 10 business days
   - SMR submission: within 3 business days (24 hours for terrorism financing)
   - IFTI (International Funds Transfer Instructions): within 10 business days

4. **Record Keeping** — 7-year retention requirement

5. **User Stories** — 3 stories for: CDD onboarding, TTR generation, SMR workflow`,
    tips: [
      'AUSTRAC is the Australian AML/CTF regulator — all reporting entities must be enrolled with AUSTRAC',
      'The "tipping off" prohibition means staff cannot inform customers an SMR has been filed',
      'DVS (Document Verification Service) is the Australian government\'s identity document checker — use it for CDD',
    ],
    tags: ['AML', 'CTF', 'AUSTRAC', 'KYC', 'CDD', 'TTR', 'SMR', 'compliance'],
  },
  {
    id: 'aml-002',
    category: 'aml',
    title: 'Regulatory Reporting — AUSTRAC Submission',
    when: 'When designing automated regulatory reporting for AUSTRAC submissions (TTR, SMR, IFTI).',
    prompt: `Define requirements for automated AUSTRAC regulatory report generation.

Report Type: [TTR (Threshold Transaction Report) / SMR (Suspicious Matter Report) / IFTI (International Funds Transfer Instruction)]
Submission method: AUSTRAC Online portal / Direct API
Submission frequency: [Real-time / Within N business days]

Generate:
1. **Report Trigger Criteria** — exact business rules for when this report is generated
2. **Data Fields Required** — complete field list per AUSTRAC reporting obligations:
   Field name | Type | Mandatory? | Source System | AUSTRAC field reference
3. **Workflow** — from trigger to submission: detection → review → approve → submit → acknowledge
4. **Maker-Checker Process** — who reviews and approves before AUSTRAC submission
5. **Suppression Rules** — cases where a triggered report should not be submitted
6. **Audit Trail** — what must be logged for AUSTRAC inspection
7. **Data Extraction SQL** — draft queries to pull required data
8. **User Stories** — 3 stories: auto-generate report, compliance review, AUSTRAC submission

Note: Tipping-off prohibition (s.123A AML/CTF Act) — do NOT communicate report filing to subject.`,
    tips: [
      'AUSTRAC has strict submission timelines — late filings are a breach; build alerts into the workflow',
      'SMRs require a narrative field — the quality of the narrative affects AUSTRAC\'s ability to act',
      'IFTI applies to ALL international transfers, not only suspicious ones — often overlooked',
    ],
    tags: ['AUSTRAC', 'TTR', 'SMR', 'IFTI', 'regulatory reporting', 'AML'],
  },

  // ─── LENDING & MORTGAGES ───────────────────────────────────
  {
    id: 'loan-001',
    category: 'loans',
    title: 'Home Loan Application — Digital Origination Flow',
    when: 'When designing the digital home loan application and origination workflow for an Australian ADI.',
    prompt: `Design the complete digital home loan origination system requirements for an Australian ADI.

Loan Type: [Owner-Occupied / Investment Property / Refinance / Construction]
Channel: [Mobile App / Internet Banking / Broker Portal / Branch + Digital]
Target Segment: [First Home Buyer / Existing Property Owner / Investor]

Generate:
1. **Customer Journey** — from application to settlement
2. **Mermaid Sequence Diagram** — Applicant, Digital Portal, Origination System, Credit Bureau (Equifax/Experian/illion), HEMS (Household Expenditure Measure), ATO, Core Banking, Solicitor Portal
3. **NCCP Responsible Lending Obligations** (National Consumer Credit Protection Act 2009):
   - Unsuitability assessment requirements
   - Income verification (ATO pre-fill, payslips, bank statements)
   - HEM analysis and living expenses assessment
   - "Not unsuitable" determination documentation
4. **Serviceability Assessment** — buffer rate (currently APRA-mandated 3% above loan rate)
5. **LVR and LMI** — Loan-to-Value Ratio thresholds, Lenders Mortgage Insurance trigger (>80% LVR)
6. **Document Requirements** — ID, payslips, bank statements, contract of sale, council rates
7. **First Home Buyer Incentives** — FHBG, FHSS, stamp duty concessions (state-specific)
8. **Approval Workflow** — Auto-approve / Credit Officer review / Reject
9. **User Stories** — 5 stories: apply, document upload, credit assessment, conditional approval, settlement`,
    tips: [
      'The APRA 3% serviceability buffer is mandatory — hardcode it as a system constraint, not a configuration',
      'NCP Act responsible lending obligations require documented assessment — audit trail is essential',
      'First Home Buyer incentives vary by state — use a lookup service, not hardcoded rules',
    ],
    tags: ['mortgage', 'home loan', 'NCCP', 'APRA', 'responsible lending', 'origination'],
  },

  // ─── MOBILE BANKING ────────────────────────────────────────
  {
    id: 'mob-001',
    category: 'mobile',
    title: 'Mobile Banking App — Security Requirements',
    when: 'When defining security requirements for an Australian mobile banking app (iOS/Android).',
    prompt: `Define comprehensive security requirements for an Australian mobile banking application.

Platform: [iOS / Android / Both]
Authentication Methods: [Biometric / PIN / Password / Step-up OTP]
Minimum OS Supported: [iOS 16+ / Android 10+]

Generate requirements across:

1. **Authentication & Session Management**
   - Biometric authentication (Face ID, fingerprint) per APRA CPS 234
   - Session timeout: [inactivity timeout — typically 5 minutes for banking]
   - Concurrent session handling
   - Device binding and registration flow

2. **OWASP Mobile Top 10** — requirements addressing each:
   M1: Improper Platform Usage
   M2: Insecure Data Storage (no sensitive data in logs, screenshots blocked)
   M3: Insecure Communication (TLS 1.2+ mandatory, certificate pinning)
   M4: Insecure Authentication
   M5: Insufficient Cryptography
   M6: Insecure Authorisation
   M7: Client Code Quality
   M8: Code Tampering (jailbreak/root detection)
   M9: Reverse Engineering (obfuscation requirements)
   M10: Extraneous Functionality

3. **Australian-Specific Requirements**
   - Scam detection warnings (ABA Scam-Safe Accord obligations)
   - PayID Confirmation of Payee display
   - CDR authentication (FAPI 1.0 Advanced) if CDR-enabled

4. **Incident Response** — app-level security incident reporting to APRA`,
    tips: [
      'The ABA Scam-Safe Accord (2023) imposes new obligations on all major Australian banks — include scam warning UX',
      'Certificate pinning reduces MITM risk significantly — make it a mandatory NFR, not optional',
      'Jailbreak/root detection is important in Australian mobile banking — discuss bypass resilience with security team',
    ],
    tags: ['mobile', 'security', 'OWASP', 'biometrics', 'APRA CPS 234', 'iOS', 'Android'],
  },
  {
    id: 'mob-002',
    category: 'mobile',
    title: 'Mobile Banking App UX Audit — Australian Standards',
    when: 'When auditing the user experience of an Australian mobile banking app against local benchmarks and consumer expectations.',
    prompt: `You are a Lead UX Consultant specializing in the Australian Digital Banking sector.
    
Audit the following mobile banking feature/screen: [DESCRIBE SCREEN OR FEATURE]

Reference Tier 1 banking benchmarks and assess against:

1. **Information Hierarchy:** Is the Australian BSB/Account number clearly separated and easily copyable?
2. **Payment UX (NPP/Osko):** Does the flow proactively surface PayID vs. BSB/Account options? How is 'Confirmation of Payee' handled?
3. **Regulatory Friction:** Are mandatory disclosures (T&Cs, ePayments Code notifications) integrated smoothly or do they break the flow?
4. **Accessibility (WCAG 2.1 AA):** Is the contrast and hit-area sizing appropriate for high-stress financial tasks (e.g. urgent payments)?
5. **Security Perception:** Does the app use appropriate biometrics (FaceID/TouchID) without creating unnecessary hurdles?
6. **Mobile Banking Standards:** Assess against the ABA Scam-Safe Accord (e.g., are links removed from SMS/Email alerts?).

Provide:
- **Major Wins:** 3 things done well.
- **Critical Fails:** High friction points or regulatory risks.
- **Benchmark Comparison:** How this compares to the "Big 4" vs. "Neobanks" in Australia.
- **Remediation Plan:** Actionable steps to improve the score.`,
    tips: [
      'Australian users expect "Instant" payments as the default — always prioritize NPP/Osko labels',
      'The "Share" button for account details is a high-usage feature in Australia — check its placement',
      'Reference the latest Forrester or JD Power Australian Mobile Banking rankings for weightings'
    ],
    tags: ['mobile', 'UX audit', 'digital banking', 'benchmarking', 'NPP', 'Osko'],
  },

  // ─── FRAUD & RISK ──────────────────────────────────────────
  {
    id: 'fraud-001',
    category: 'fraud',
    title: 'Scam Detection — ABA Scam-Safe Accord Requirements',
    when: 'When defining requirements for scam detection and prevention under the ABA Scam-Safe Accord.',
    prompt: `You are a BA at an Australian bank subject to the ABA Scam-Safe Accord (November 2023).

Define requirements for scam detection and prevention across:

Scam Categories to address:
- Authorised Push Payment (APP) scams (investment scams, romance scams)
- Business Email Compromise (BEC)
- Impersonation scams (bank impersonation, government impersonation)

Generate:
1. **Scam-Safe Accord Obligations** — 7 commitments and what they mean for your systems:
   1. Name checking (Confirmation of Payee / PayID name match)
   2. Warning messages with friction for suspicious payments
   3. Delay (24-hour hold) on first-time large payments to new payees
   4. Customer education and alerts
   5. Industry intelligence sharing (ABA ScamWatch integration)
   6. Removal of links from SMS/email
   7. Specialist scam teams

2. **Payment Warning Rules** — rule catalogue for triggering scam warnings:
   Rule ID | Trigger Condition | Warning Type | Hold Period | Override?

3. **Mermaid Decision Tree** — scam risk scoring and intervention decision

4. **User Experience Requirements** — friction vs. false positive balance

5. **AFCA Considerations** — how scam handling affects dispute resolution outcomes

6. **Reimbursement Policy Requirements** — under emerging Australian scam reimbursement legislation

7. **User Stories** — 3 stories: scam warning display, 24-hour payment hold, victim reporting`,
    tips: [
      'The ABA Scam-Safe Accord is a voluntary industry commitment but is increasingly backed by regulatory pressure',
      'Confirmation of Payee (name matching) is now an industry expectation — align to NPP infrastructure',
      'Australia is developing a mandatory scam reimbursement framework (similar to UK\'s PSR Model) — design for it now',
    ],
    tags: ['fraud', 'scam', 'ABA Scam-Safe Accord', 'APP fraud', 'Confirmation of Payee', 'NPP'],
  },
  {
    id: 'fraud-002',
    category: 'fraud',
    title: 'Fraud Detection Rules — Real-Time Transaction Monitoring',
    when: 'When defining business rules for a real-time fraud detection system at an Australian bank.',
    prompt: `Define fraud detection business rules for an Australian retail bank.

Customer Segment: [Retail / Business / High-Net-Worth]
Transaction Types: [NPP payments / Card / BPAY / International SWIFT]

Generate:
1. **Fraud Rule Catalogue** — 12 rules, each with:
   - Rule ID
   - Rule Name
   - Description
   - Trigger Condition (if/then logic)
   - Action (block / step-up authentication / alert / allow with warning)
   - Risk Score (1-10)
   - Australian context (e.g., common AU scam patterns, ScamWatch categories)

2. **Velocity Rules** — per hour, per day thresholds (reference ABA and RBA guidance)

3. **Geo-anomaly Rules** — impossible travel, overseas card use patterns

4. **Device Risk Rules** — new device, rooted/jailbroken device

5. **Mermaid Decision Flowchart** — fraud scoring and action decision tree

6. **False Positive Handling** — dispute process, ePayments Code obligations

7. **ScamWatch Integration** — data sharing with ACCC ScamWatch / National Anti-Scam Centre (NASC)

8. **Performance KPIs** — precision, recall, false positive rate targets`,
    tips: [
      'Reference ScamWatch categories from ACCC — your fraud rules should map to real AU scam types',
      'The National Anti-Scam Centre (NASC) launched 2023 — consider intelligence sharing integration',
      'False positives in Australian banking often trigger AFCA complaints — minimise with customer-friendly override flows',
    ],
    tags: ['fraud', 'rules engine', 'ScamWatch', 'NASC', 'transaction monitoring', 'risk'],
  },

  // ─── AI CONTEXT SETUP ──────────────────────────────────────
  {
    id: 'ai-001',
    category: 'ai_setup',
    title: 'Gemini — Australian Banking BA Context Setup',
    when: 'Use at the start of every AI session to prime the model with Australian banking context.',
    prompt: `You are my expert AI assistant. Here is the context you need to help me effectively:

**My Role:** Business Analyst / Technical Business Analyst
**Organisation Type:** [e.g., Major Bank (Big 4) / Regional Bank / Credit Union / Fintech / Neobank]
**Domain:** [e.g., Payments / Lending / CDR / AML Compliance / Mobile Banking]

**Australian Regulatory Context:**
- Prudential regulator: APRA (Australian Prudential Regulation Authority)
- Conduct regulator: ASIC (Australian Securities and Investments Commission)
- AML/CTF regulator: AUSTRAC
- Open Banking: CDR administered by ACCC, standards by DSB
- Payments: RBA, NPP Australia (NPPA), ABA
- Consumer protection: AFCA (Australian Financial Complaints Authority), ACCC

**Key Standards & Frameworks I work within:**
- APRA: CPS 234 (Security), CPS 230 (Op Risk), APS 001 (Capital), LPS 117
- CDR: CDR Rules, CDR Standards v1.29+, FAPI 1.0 Advanced
- Payments: ePayments Code, NPP rules, BECS procedures, SWIFT standards
- AML/CTF: AML/CTF Act 2006, AUSTRAC guidance
- Consumer Credit: NCCP Act 2009, responsible lending obligations

**Tools I use:** Jira, Confluence, Figma, Postman, Mermaid.js, SQL, Azure DevOps

**My preferences:**
- Use markdown (headers, bullets, tables, code blocks)
- Always reference specific Australian regulation/section numbers
- Flag AFCA dispute implications where relevant
- Default to Mermaid.js for diagrams, OpenAPI 3.0 for API specs
- Use Australian spelling (e.g., "authorise" not "authorize", "organisation" not "organization")

Respond as a Senior BA Consultant who knows Australian financial services regulations deeply.
Confirm you have understood this context in one sentence.`,
    tips: [
      'Update [Organisation Type] and [Domain] at the start of each project for targeted responses',
      'The list of Australian regulators helps the AI give jurisdiction-specific advice — don\'t skip it',
      'Add "Current APRA/ACCC consultation paper: [title]" if working on a regulatory change project',
    ],
    tags: ['AI setup', 'context', 'Gemini', 'Australian banking', 'session start'],
  },
  {
    id: 'ai-002',
    category: 'ai_setup',
    title: 'Project Context — Australian Banking Project Brief',
    when: 'When starting a new Australian banking project and need to give full context to AI for the entire engagement.',
    prompt: `I am starting a new project. Retain this context for our entire conversation.

**PROJECT BRIEF**
Project Name: [PROJECT NAME]
Target Go-Live: [DATE]
Regulatory Driver: [e.g., APRA CPS 230 compliance / CDR Phase 3 rollout / NPP PayTo migration]

**BUSINESS CONTEXT**
Problem: [Describe the business pain point]
Sponsor: [Role/Name]
Success looks like: [1-2 measurable outcomes]

**TECHNICAL CONTEXT**
Systems: [e.g., Core Banking (Temenos/Flexcube/FBT), Mobile App (iOS/Android), NPP Gateway, CDR Resource Server]
Architecture: [e.g., Microservices on AWS / On-premise / Hybrid]
Integration: [e.g., REST APIs, ISO 20022, BECS files, Kafka events]

**REGULATORY CONTEXT**
Primary regulation: [e.g., CDR Rules, APRA CPS 234, AML/CTF Act]
APRA/ASIC notification required: [Yes / No / TBD]
AUSTRAC reporting: [Yes / No]

**PROJECT CONSTRAINTS**
- Must not change: [e.g., existing BSB/account number format]
- External dependencies: [e.g., NPPA certification, ACCC accreditation, credit bureau]
- Data classification: [e.g., Customer PII / financial data / CDR data]

**MY ROLE:** [Your specific BA responsibilities]

Use this context in every response. Start by summarising this brief in 3 bullet points.`,
    tips: [
      'Listing the core banking system (Temenos, Flexcube, etc.) helps AI give system-specific guidance',
      'The "Regulatory Driver" field is the most important — it shapes every requirement and NFR',
      'Update "External Dependencies" with APRA/ACCC approval timelines to shape your sprint planning',
    ],
    tags: ['project brief', 'context', 'Australian banking', 'kickoff', 'AI setup'],
  },

  // ─── STAKEHOLDER COMMS ─────────────────────────────────────
  {
    id: 'sth-001',
    category: 'stakeholder',
    title: 'Regulatory Change Impact Assessment',
    when: 'When a new APRA standard, ASIC guidance, or CDR rule update is released and you need to assess the impact on your systems.',
    prompt: `Conduct a Regulatory Change Impact Assessment for:

Regulatory Change: [e.g., APRA CPS 230 effective 1 July 2025 / CDR Standards v1.30 update / AUSTRAC revised AML/CTF rules]
Source: [APRA Prudential Standard / ASIC Regulatory Guide / ACCC CDR Rules / AUSTRAC AML/CTF Rules]
Effective Date: [DATE]
Grace Period: [If applicable]

Assess impact across:

1. **Change Summary** — what is changing in plain English (3 sentences max)
2. **Obligations Analysis** — table of new/changed obligations:
   Obligation | Our Current State | Gap | Estimated Effort | Priority
3. **System Impact** — which systems and APIs are affected
4. **Process Impact** — which business processes need updating
5. **Policy Impact** — which internal policies need a review
6. **People Impact** — training required, new roles/responsibilities
7. **Timeline to Compliance** — working backwards from effective date
8. **APRA/ASIC Notification Requirements** — do we need to notify the regulator of our remediation plan?
9. **Risk if Non-Compliant** — enforcement actions, penalty regime
10. **Recommendation** — prioritised remediation roadmap

Format as a formal assessment document suitable for Board Risk Committee.`,
    tips: [
      'Always link to the specific regulation section/paragraph — vague references get challenged in governance forums',
      'APRA expects a remediation plan for significant gaps — proactively engaging APRA is better than being found non-compliant',
      'Check the ASIC breach reporting obligations — some regulatory gaps trigger mandatory ASIC notification',
    ],
    tags: ['regulatory change', 'impact assessment', 'APRA', 'ASIC', 'CDR', 'compliance'],
  },
  {
    id: 'sth-002',
    category: 'stakeholder',
    title: 'Sprint Demo Script — Banking Audience',
    when: 'When presenting completed sprint work to banking business stakeholders or risk/compliance teams.',
    prompt: `Write a Sprint Demo script for banking stakeholders.

Sprint: Sprint [NUMBER] — [Sprint Goal]
Audience: [e.g., Chief Risk Officer / Head of Digital / APRA Relationship Team / Product Owner]
Stories completed: [List completed features/stories]

For each story, script:
1. Business context — why we built this (reference regulatory or business driver)
2. Demo walkthrough narration (what to say while clicking through)
3. Compliance/regulatory requirements met (prove it)
4. Known limitations / decisions deferred

Include:
- Opening: Recap sprint goal and regulatory context
- Risk & Compliance section: any items that need risk committee sign-off
- Metrics: velocity, stories delivered vs planned, regulatory milestone progress
- Closing: next sprint preview and upcoming regulatory deadlines
- FAQ: prepare answers for: "Is this APRA compliant?", "How does this affect our AFCA exposure?", "When can we go to AUSTRAC?"

Tone: Professional, structured, compliance-aware. Reference specific Australian regulations.`,
    tips: [
      'Australian banking stakeholders, particularly risk and compliance, respond to regulatory references — name the standard',
      'CROs and risk committees need explicit answers on APRA implications — prepare these upfront',
      'If a feature was descoped for compliance reasons, explain it in the demo — transparency builds trust',
    ],
    tags: ['sprint demo', 'presentation', 'stakeholders', 'compliance', 'banking'],
  },

  // ─── TESTING ───────────────────────────────────────────────
  {
    id: 'test-001',
    category: 'testing',
    title: 'Test Cases — Australian Banking Compliance Feature',
    when: 'When generating comprehensive test cases for a banking feature with regulatory compliance requirements.',
    prompt: `Act as a Senior QA Engineer. Generate a compliance-aware test case suite.

Feature: [FEATURE NAME]
User Story: [PASTE USER STORY AND ACCEPTANCE CRITERIA]
Regulatory Obligations: [e.g., CDR Standards, ePayments Code, AML/CTF Act, CPS 234]

Generate test cases covering:
1. **Functional Tests** — test each acceptance criterion
2. **Regulatory Compliance Tests**:
   - APRA obligation coverage
   - CDR conformance tests (if applicable — reference DSB test suite)
   - ePayments Code scenarios (mistaken payments, unauthorised transactions)
   - AUSTRAC reporting trigger tests
3. **Boundary Value Tests** — min/max amounts, date boundaries (e.g., 10-business-day windows)
4. **Negative Tests** — invalid inputs, expired consents, insufficient funds
5. **Security Tests** — OWASP Mobile Top 10 for mobile features, FAPI for CDR
6. **Performance Tests** — NPP latency (<5 seconds per NPPA requirements)
7. **Accessibility Tests** — WCAG 2.1 AA (required for CDR Data Holders)

Table format: Test ID | Category | Title | Pre-condition | Test Steps | Expected Result | Regulatory Reference | Priority

Generate at least 20 test cases.`,
    tips: [
      'CDR conformance testing requires using the DSB\'s official test suite — reference it in your test plan',
      'NPP payment latency requirements are specified in NPPA rules — make them explicit NFR test cases',
      'WCAG 2.1 AA compliance is mandated for CDR Data Holder portals — include accessibility test cases',
    ],
    tags: ['test cases', 'QA', 'CDR', 'APRA', 'ePayments Code', 'compliance testing'],
  },

  // ─── DOCUMENTATION ─────────────────────────────────────────
  {
    id: 'doc-001',
    category: 'documentation',
    title: 'Product Requirements Document — Australian Banking Feature',
    when: 'When launching a new banking feature and need a complete PRD aligned to Australian regulatory standards.',
    prompt: `Write a comprehensive Product Requirements Document (PRD) for:

Feature Name: [NAME]
Author: [Your Name]
Date: [Date]
Regulatory Driver: [e.g., CDR Phase 3, APRA CPS 230, ABA Scam-Safe Accord]

PRD Sections:
1. **Executive Summary** (3-4 sentences with regulatory context)
2. **Goals & Non-Goals** (what we will and will not build)
3. **Regulatory Obligations** — specific APRA/ASIC/ACCC/AUSTRAC requirements this feature addresses
4. **User Personas** — 2 Australian banking personas (e.g., "[Name], [Age], [City], [Bank] customer")
5. **User Stories** (at least 6, As a / I want / So that format)
6. **Functional Requirements** (numbered, detailed, measurable)
7. **Non-Functional Requirements**:
   - Performance (e.g., NPP latency <5s, CDR API uptime 99.5%)
   - Security (APRA CPS 234 controls)
   - Accessibility (WCAG 2.1 AA)
   - Data retention (7-year AUSTRAC requirement, CDR data deletion obligations)
8. **API/Integration Requirements** — systems including CDR Register, NPPA, AUSTRAC Online if applicable
9. **Data Requirements** — PII handling, CDR data clusters, TFN sensitivity
10. **Success Metrics & KPIs** (measurable, time-bound)
11. **APRA/ASIC Engagement** — does this feature require regulator notification?
12. **Open Questions** (3-5 unresolved decisions)

Domain: Australian banking. All requirements must be specific and measurable.`,
    tips: [
      'Add a "Regulatory Sign-off Required" section — many AU banking features need Risk & Compliance approval before go-live',
      'The "APRA/ASIC Engagement" section is unique to Australian banking — always include it',
      'Reference the AFCA jurisdiction threshold — features that affect remediation liability need AFCA context',
    ],
    tags: ['PRD', 'documentation', 'APRA', 'CDR', 'Australian banking'],
  },
  
  // ─── NEW PROFESSIONAL ADDITIONS ────────────────────────────
  {
    id: 'dia-001',
    category: 'diagrams',
    title: 'NPP / Osko Payment Sequence (Mermaid)',
    when: 'When visualizing the real-time payment flow between a Payer, ADI, and the NPP Infrastructure.',
    prompt: `Act as a Solution Architect specializing in Australian Payments (NPP).

Generate a Mermaid.js Sequence Diagram for:
[SPECIFIC SCENARIO e.g., A real-time PayID transfer from CommBank to ANZ]

Include the following participants:
- **Payer App:** User interface / Mobile banking.
- **Originating ADI (O-ADI):** The payer's bank core systems.
- **NPP Infrastructure (NPPI):** Central settlement / orchestration.
- **Receiving ADI (R-ADI):** The payee's bank core systems.

Sequence should cover:
1. PayID Lookup (Alias resolution).
2. Fraud & Limit check by O-ADI.
3. Instruction submission to NPPI.
4. Real-time settlement (RITS).
5. Notification to R-ADI and Crediting of the Payee.

Use standard Mermaid syntax and include detailed notes on data payloads (e.g. End-to-End ID).`,
    tips: [
      'Real-time payments are settled individually in the NPP, unlike deferred net settlement (BECS).',
      'Ensure the PayID lookup happens BEFORE the payment instruction is confirmed by the user.',
    ],
    tags: ['npp', 'payments', 'sequence diagram', 'mermaid', 'architecture'],
  },
  {
    id: 'api-001',
    category: 'api',
    title: 'CDR Data Holder: Get Accounts API Spec',
    when: 'When designing a CDS-compliant API for sharing account data as a Data Holder.',
    prompt: `Act as an API Designer for an Australian Bank. 

Draft a Swagger/OpenAPI 3.0 snippet for the following CDR (Consumer Data Standards) endpoint:
**GET /banking/accounts**

Include:
1. **Request Headers:** x-v, x-fapi-interaction-id, etc.
2. **Query Parameters:** product-category, is-owned, page, page-size.
3. **Response Body (200 OK):** Using the "BankingAccountV2" schema.
4. **Key Fields:** accountId, displayName, nickname, maskedNumber, openStatus, accountOwnership.

Adhere strictly to the latest Australian Consumer Data Standards (CDS).`,
    tips: [
      'The x-v header (versioning) is mandatory in CDR and must be incremented thoughtfully.',
      'MaskedNumber must follow the exact syntax of the standards (e.g. 1234-XXXX-XXXX-4321).',
    ],
    tags: ['api', 'cdr', 'openapi', 'swagger', 'banking'],
  },
  {
    id: 'doc-001',
    category: 'documentation',
    title: 'Agile Story Map: International Payments',
    when: 'When mapping out the rollout of a complex new feature like SWIFT Go or real-time FX.',
    prompt: `Generate a 3-Phase Agile Story Map for:
**Feature:** [e.g., Cross-Border Payments for SME Customers]

Structure:
- **Phase 1 (MVP/Foundation):** Essential connectivity, FX rates, and manual clearing.
- **Phase 2 (Scalability):** Automated tracking (SWIFT gpi), additional currencies.
- **Phase 3 (Premium):** Real-time tracking portal, hedging tools, and bulk payments.

For each Phase, list:
1. **Backbone Tasks:** Search, Authorise, Send, Track.
2. **User Stories:** 3-4 example stories with "So that" value statements.

Use a Markdown table for the mapping.`,
    tips: [
      'Always prioritize "Sanctions Screening" in Phase 1 for any international payment flow.',
      'Think about the "Correspondent Banking" chain and how it impacts "Track" requirements.',
    ],
    tags: ['story map', 'agile', 'international payments', 'swift', 'roadmap'],
  },
  {
    id: 'dat-001',
    category: 'data',
    title: 'Customer PII Data Dictionary (Privacy Act)',
    when: 'When cataloging Customer Data (PII) for an Australian bank, aligning with the Privacy Act 1988.',
    prompt: `Create a Data Dictionary / Mapping for Customer PII (Personally Identifiable Information) for: [FEATURE NAME e.g., Onboarding].

Provide a table with:
- **Field Name:** (e.g., Full Name, DOB, TFN, Passport No).
- **Data Classification:** (e.g., Restricted / Sensitive / Internal).
- **Encryption Requirement:** (At rest / In transit / Field-level).
- **Retention Period:** (How many years as per AML/CTF rules?).
- **Regulatory Requirement:** (Which clause of the Privacy Act or AML Act applies?).

List at least 10 critical banking PII fields.`,
    tips: [
      'Tax File Numbers (TFN) have extremely strict handling rules in Australia — never store them in plain text.',
      'Refer to "Privacy Principle 11" for data security obligations.',
    ],
    tags: ['data dictionary', 'pii', 'privacy act', 'compliance', 'security'],
  },
  {
    id: 'reg-001',
    category: 'apra',
    title: 'CPS 230: Critical Business Service Mapping',
    when: 'When mapping out critical services and their dependencies as required by APRA CPS 230.',
    prompt: `Act as a Risk & Continuity BA. Generate a Dependency Map for a Critical Business Service.

**Service Name:** [e.g., Real-time Payment Settlement]

Identify:
1. **Upstream Dependencies:** What data/events trigger this?
2. **Internal Dependencies:** Core systems, databases, internal teams.
3. **External Dependencies:** Material service providers (e.g., NPP, Cloud Hosting).
4. **Tolerance Levels:** Max allowable disruption (Time/Data/Service).

Structure as a nested list or a simple Mermaid diagram.`,
    tips: [
      'APRA expects you to know exactly which Cloud Provider and specific availability zone you depend on.',
      'The "Impact Tolerance" is the most critical metric for CPS 230.',
    ],
    tags: ['apra', 'cps 230', 'risk', 'continuity', 'mapping'],
  },
  {
    id: 'loan-001',
    category: 'loans',
    title: 'Home Loan Serviceability Calculation Logic',
    when: 'When defining the calculation engine requirements for a retail mortgage product.',
    prompt: `Define the Business Logic for a Home Loan Serviceability assessment.

**Product:** [e.g., Principal & Interest Investment Loan]

Include logic for:
1. **Net Income Verification:** Base salary vs Bonus vs Rental income haircut.
2. **Living Expenses:** HEM (Household Expenditure Measure) vs Declared Actuals.
3. **Repayment Buffers:** Current Rate + 3% test rate (APRA requirement).
4. **Other Liabilities:** Personal loans, Credit cards (using 3.8% limit rule).

Provide the output as a set of logical "If/Then" rules for developers.`,
    tips: [
      'The APRA serviceability buffer (currently ~3%) is a mandatory requirement for ADIs.',
      'Haircut rules for rental income (usually 20-25%) are standard to account for vacancy risk.',
    ],
    tags: ['loans', 'mortgages', 'serviceability', 'apra', 'logic'],
  },
  {
    id: 'qa-001',
    category: 'testing',
    title: 'Core Banking Regression Strategy',
    when: 'When planning testing for a major core system upgrade or patch.',
    prompt: `Develop a Regression Test Strategy for a [Core Banking System Name] version upgrade.

Identify:
1. **Priority 1 (Critical Flows):** Transaction posting, interest calc, balance inquiry.
2. **Priority 2 (Standard Flows):** Account opening, statement generation.
3. **Data Migration Verification:** Sampling strategy for checking DB record integrity.
4. **API Backward Compatibility:** Mocking strategies for downstream consumers.

Provide a high-level test plan with 10 critical test scenarios.`,
    tips: [
      'In core banking upgrades, "End-of-Day (EOD) Processing" is the most likely failure point.',
      'Always test interest calculation to at least 4 decimal places.',
    ],
    tags: ['testing', 'regression', 'core banking', 'qa', 'strategy'],
  },
  {
    id: 'proto-001',
    category: 'prototyping',
    title: 'High-Fidelity Mobile UI Logic & Haptics',
    when: 'When defining exactly how a mobile banking interaction should FEEL and BEHAVE.',
    prompt: `Define the detailed UI Interaction Logic and Haptic Feedback for: [FEATURE NAME e.g., Swipe-to-Pay].

Detail:
1. **Initial State:** Visual cues (shadows, icons).
2. **Active Interaction:** Gesture tracking (displacement threshold).
3. **Success State:** Micro-animation, celebratory haptics (iOS/Android specific).
4. **Error/Failure State:** "Shake" animation, heavy haptic feedback.
5. **Accessibility:** Screen reader announcements for each state change.

Focus on creating a "Premium" and secure digital experience.`,
    tips: [
      'Haptics provide confidence in digital banking transactions where visual confirmation might be subtle.',
      'Ensure the swipe threshold is consistent with standard OS patterns.',
    ],
    tags: ['prototyping', 'ui', 'ux', 'haptics', 'mobile'],
  }
];
