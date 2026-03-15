/**
 * How-To Guides & Knowledge Base for Business Analysts
 */

const HOWTO_CATEGORIES = [
    { id: 'howto_app', label: 'App Mastery', icon: '📱', groupId: 'guidance' },
    { id: 'howto_scrum', label: 'Scrum Events', icon: '🔄', groupId: 'guidance' },
    { id: 'howto_story', label: 'User Stories', icon: '📝', groupId: 'guidance' },
    { id: 'howto_banking', label: 'Banking BA 101', icon: '🏦', groupId: 'guidance' }
];

const HOWTO_PROMPTS = [
    {
        id: 'howto-app-shortcuts',
        category: 'howto_app',
        title: 'Keyboard Shortcuts & Navigation',
        when: 'New to AuPromptKit or looking to speed up your workflow.',
        prompt: `AuPromptKit Keyboard Shortcuts:
1. [Ctrl + /]: Collapse/Expand Sidebar.
2. [Esc]: Close any active modal.
3. [Ctrl + C] (on card): Quick copy prompt to clipboard.

Pro Tip: Use the "Favourites" category to star prompts you use daily for instant access.`,
        tips: ['Collapsing the sidebar gives more space for the prompt grid.'],
        tags: ['help', 'shortcuts', 'navigation']
    },
    {
        id: 'howto-scrum-refinement',
        category: 'howto_scrum',
        title: 'Facilitating a Refinement Session',
        when: 'Preparing to lead a backlog refinement with developers and testers.',
        prompt: `How to Facilitate Banking Refinement:
1. Preparation: Ensure the Epic has high-level solution design approval.
2. The Walkthrough: Explain the "Why" before the "What". In banking, this often includes the regulatory driver (e.g., APRA CPS 234).
3. INVEST Check: Verify the story is Independent, Negotiable, Valuable, Estimable, Small, and Testable.
4. Acceptance Criteria: Draft ACs using Gherkin (Given/When/Then) to reduce ambiguity.
5. Technical Spike: If the team is unsure about the NPP/Osko integration logic, call out a Spike immediately.`,
        tips: ['Always keep a Tester in the loop for edge case discovery.'],
        tags: ['agile', 'scrum', 'facilitation']
    },
    {
        id: 'howto-story-estimation',
        category: 'howto_story',
        title: 'How to Estimate User Stories',
        when: 'During Sprint Planning or Refinement sessions.',
        prompt: `Estimation Standards (Australian Banking Context):
1. Fibonacci Sizing: 1, 2, 3, 5, 8, 13.
2. Complexity Factors:
   - Data Security (Is PII involved?)
   - Compliance (ASIC/APRA reporting impact?)
   - Integration (New API vs existing?)
3. The "8" Rule: If a story is an 8 or above, it likely needs more decomposition to fit into a 2-week sprint safely.`,
        tips: ['Use T-Shirt sizing (S, M, L) for early-stage roadmap discovery.'],
        tags: ['estimation', 'agile', 'metrics']
    },
    {
        id: 'howto-banking-jargon',
        category: 'howto_banking',
        title: 'Essential AU Banking Jargon',
        when: 'New to the Australian banking sector or rotating to a new domain.',
        prompt: `Must-Know AU Banking Terms:
- ADI: Authorised Deposit-taking Institution (Your Bank/CU).
- CDR: Consumer Data Right (Open Banking).
- NPP: New Payments Platform (Real-time payments).
- PayID: Aliased payment addressing using mobile/email.
- KYC/AML: Know Your Customer / Anti-Money Laundering compliance.
- BSB: Bank State Branch number (6 digits).`,
        tips: ['Memorize these for smoother stakeholder meetings.'],
        tags: ['jargon', 'banking-101', 'training']
    }
];
