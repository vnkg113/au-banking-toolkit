// ============================================================
//  AU BANKING TOOLKIT — DATA V5 (Reliability & Advanced Ops)
//  Covers CPS 230, CDR Action Initiation, and ASIC RG 271
// ============================================================

const V5_CATEGORIES = [
  { id: 'cps230', label: 'CPS 230: Ops Risk', icon: 'shield-check', groupId: 'regs' },
  { id: 'cdr_ai', label: 'CDR Action Initiation', icon: 'zap', groupId: 'regs' },
  { id: 'compliance_271', label: 'ASIC RG 271: Complaints', icon: 'scale', groupId: 'regs' }
];

const V5_PROMPTS = [
  {
    id: 'v5-reg01',
    category: 'cps230',
    title: 'CPS 230: Critical Business Service Assessment',
    when: 'When identifying and documenting "Critical Business Services" as required by APRA CPS 230.',
    prompt: `Act as a Senior Risk & Compliance BA. I need to perform a CPS 230 Critical Business Service Assessment for:
    
**Service Name:** [SERVICE_NAME]
**Business Unit:** [BUSINESS_UNIT]

Please analyze this service and provide:
1. **Criticality Criteria:** Justify why this is a "Critical Business Service" (e.g., impact on customers, financial stability, or safety).
2. **Tolerance Levels:** Define maximum allowable levels of disruption (Time, Data Loss, Service Quality).
3. **Internal & External Dependencies:** Identify key service providers (material suppliers) and internal systems.
4. **Step-by-Step Recovery Process:** High-level sequence to restore service within tolerance levels.

Focus on APRA's expectation for operational resilience and "straight-through" recovery.`,
    tags: ['CPS 230', 'risk', 'compliance', 'APRA', 'resilience']
  },
  {
    id: 'v5-reg02',
    category: 'cdr_ai',
    title: 'CDR Action Initiation: Payment Initiation Flow',
    when: 'When designing the user flow and requirements for CDR-initiated payments (Action Initiation).',
    prompt: `Act as a Technical BA specializing in Open Banking (CDR). I am designing a Payment Initiation flow.

**Payment Type:** [e.g., Once-off / Recurring]
**Destination:** [NPP / BSB-Account]

Please generate:
1. **Consent Flow Requirements:** Step-by-step UI requirements for obtaining "Action Initiation" consent from the consumer.
2. **Instruction Specification:** JSON structure for the payment instruction as per the Consumer Data Standards (CDS).
3. **Response Handling:** Requirements for handling 'Accepted', 'Rejected', or 'Pending' states from the Data Holder.
4. **Revocation Logic:** How a user can view and revoke an active initiation arrangement.

Ensure compliance with the CDR Customer Experience Guidelines (CXG).`,
    tags: ['CDR', 'Open Banking', 'NPP', 'Payments', 'API']
  },
  {
    id: 'v5-reg03',
    category: 'compliance_271',
    title: 'ASIC RG 271: IDR Response Generator',
    when: 'When drafting a formal Internal Dispute Resolution (IDR) response letter that meets ASIC RG 271 requirements.',
    prompt: `Act as a Dispute Resolution Specialist. I need to draft an IDR response for:

**Customer Complaint:** [COMPLAINT_SUMMARY]
**Bank Investigation Findings:** [FINDINGS]
**Outcome:** [Upheld / Partially Upheld / Rejected]

Generate a response letter that includes:
1. **The Outcome:** Clear statement of the decision and actions taken.
2. **The Reasons:** Clear explanation of why the decision was made.
3. **Internal Review:** Information about the internal review process.
4. **External Dispute Resolution (AFCA):** Mandatory disclosure about the right to go to AFCA, including contact details.

Adhere strictly to the timeframes and "fairness" principles outlined in ASIC RG 271.`,
    tags: ['dispute', 'IDR', 'RG 271', 'ASIC', 'compliance']
  }
];
