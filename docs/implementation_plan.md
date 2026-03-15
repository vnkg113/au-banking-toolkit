# Phase 5: Knowledge Base & BA Intelligence (COMPLETED)

This phase focuses on empowering the user with educational content and automated quality checks for User Stories, while refining the UI for better design alignment.

## User Review Required
> [!IMPORTANT]
> **US Scanner Mode:** Should the scanner be a separate modal or integrated into the existing "Feature Breakdown" tool as a "Quality Check" tab?
> **Content Focus:** Are there specific Australian banking regulations (beyond APRA/CDR) you want the "How-To" guides to emphasize?

## Proposed Changes

### 1. Knowledge Base (How-To Guides)
- [NEW] `data-howto.js`: Add a structured library of guidance cards.
  - **Proposed Guides:**
    - *App Mastery:* Using placeholders, library navigation, and custom prompt management.
    - *Scrum Facilitation:* Effective Refinement, Planning, and Demos in Banking.
    - *Estimation:* Fibonacci and T-Shirt sizing for high-compliance tasks.
    - *Stakeholder Management:* Navigating APRA, ASIC, and Internal Audit.
- [MODIFY] `data.js`: Add a "GUIDANCE & KNOWLEDGE" group to the sidebar.

### 2. User Story Scanner (Intelligence)
- [NEW] `scanner.js` (or logic in `app.js`): Implement a linter that evaluates draft stories.
  - **Ruleset:**
    - **INVEST Check:** Evaluates Independence, Negotiability, etc.
    - **Gherkin Formatter:** Auto-converts draft text into standard `Given/When/Then`.
    - **AU Reg Scan:** Highlights keywords requiring extra compliance review (e.g., "PII", "Consent", "Direct Entry").
- [MODIFY] `index.html`: Add a new modal or tab for the "BA Scanner".

### 3. UI Refinement (Design Polish)
- [MODIFY] `style.css`: 
  - Increase padding for `.topbar-title` and `.m-title`.
  - Standardize vertical rhythm between headings and content blocks.
  - Adjust icon alignment within nav items and chips.

## Verification Plan
### Automated Tests
- Verify "How-To" cards appear correctly in the new sidebar group.
- Test the US Scanner with a "bad" story and confirm it identifies missing criteria.
- Verify Gherkin conversion output quality.

### Manual Verification
- Visual inspection of heading padding across all modals.
- Check sidebar group toggling for the new Knowledge Base section.
