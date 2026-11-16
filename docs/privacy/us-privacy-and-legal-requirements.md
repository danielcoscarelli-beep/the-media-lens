# US privacy and legal requirements (proposed checklist)

_Owner: Steve. Written 2026-11-16 for ORD-0002. **This is an engineering checklist, not legal
advice.** Items marked **LAWYER** need a qualified US privacy/media lawyer before launch. Facts
were checked against the sources listed at the end on 2026-11-16._

## What Vulgis will hold

Email address and sign-in identifiers; display name; time zone; ratings and predictions with
timestamps; which articles a reader opened; optional demographics; consent records; security
signals (IP address, device, timing) for anti-abuse. Ratings of political news, taken together,
**may reveal a person's political views**, and some demographics (e.g. race, religion) are
"sensitive" under state laws. Treat the whole rating history as sensitive.

## Requirements

| # | Requirement | How the design meets it | LAWYER? |
|---|---|---|---|
| 1 | **Which laws apply.** CCPA/CPRA applies to for-profit businesses doing business in California that meet a threshold: annual gross revenue over $26.625M (adjusted every odd year), **or** buying/selling/sharing personal information of 100,000+ California consumers or households, or 50%+ of revenue from selling/sharing it. As of 2026-10-28, about **24 states** have comprehensive privacy laws, with lower thresholds in some (e.g. Delaware 10,000 consumers; Vermont 35,000). | Design to the strictest common standard from day one rather than tracking thresholds. | **Yes**: applicability depends on the legal form (for-profit vs. non-profit, Walter's Q1) and growth; some state laws reportedly cover non-profits too |
| 2 | **Minimum age and COPPA.** COPPA covers children under 13. The amended COPPA Rule (published 2025-04-22, compliance date **2026-04-22**) requires, among other things, a written data-retention policy and a written security program, and for mixed-audience sites, age screening "in a neutral manner". | **Recommendation: 18+ for the pilot** (avoids COPPA and state teen-privacy/design-code laws); a neutral age question at sign-up (no pre-filled age); store only that the check passed; accounts found to be underage are deleted. Schools and teens (Q7) later, with legal advice. | **Yes**: confirm 18+ vs. 13+ and what a future schools product needs |
| 3 | **Notice and consent.** Privacy policy and terms shown at sign-up; acceptance recorded with version and time (`private.consents`). Demographics and research use: separate, unticked opt-ins, withdrawable at any time. | Data model and sign-up flow | **Yes**: write the policy and terms |
| 4 | **Sensitive data.** Several state laws require opt-in consent to process sensitive data; CCPA gives a right to limit its use. | Demographics in a separate schema, opt-in only, never used in ranking (`CLAUDE.md` §1.6); no selling or sharing for advertising | **Yes**: whether rating history counts as inferred political opinion or sensitive data |
| 5 | **No sale or sharing; GPC.** If Vulgis never sells or shares data for cross-context advertising, it should say so; honor the Global Privacy Control browser signal anyway. | No third-party ad or tracking scripts in v1; first-party, essential cookies only (sign-in) | Confirm wording |
| 6 | **Access and export.** A reader can download their data (profile, ratings, predictions, opens, consents) in a machine-readable file. | `GET /me/export` (self-service) plus the admin privacy-requests queue | Confirm deadlines (CCPA: 45 days, extendable) |
| 7 | **Deletion and correction.** Delete the account and personal data on request, including backups on their normal expiry. | `DELETE /me`, deletion job, 14-day backup expiry | **Yes**, and a product decision for M and Daniel: may de-identified ratings stay in closed articles' community scores (scores stay stable) or must they be removed (past scores change)? |
| 8 | **Retention.** Written policy: security signals 90 days; logs 1 year; deleted accounts purged within 30 days plus backup expiry. | Settings and scheduled jobs | Review |
| 9 | **Security.** "Reasonable security" (CCPA allows private lawsuits after breaches caused by its absence); breach-notification laws in every state. | ADR 0001 baseline: encryption, MFA for staff, least privilege, audit log, GuardDuty; a written security program and an incident-response plan | **Yes**: breach-response plan review |
| 10 | **Vendors.** AWS data processing terms; Google and Apple sign-in terms; any future email or analytics vendor needs a contract with privacy terms. | US region only | Review |
| 11 | **Email and SMS.** Sign-in codes are transactional. Marketing email needs CAN-SPAM compliance (opt-out, address). SMS step-up codes: TCPA considerations. | Separate email-consent flag | Light review |
| 12 | **Accessibility.** US web-accessibility lawsuits (ADA Title III) are common. | Target WCAG 2.2 AA in the reader and admin apps | Optional |
| 13 | **Content (headlines and links).** Headlines plus links are lower risk than full text, but *AP v. Meltwater* (2013) found excerpting headlines and ledes not fair use; feeds may carry terms limiting commercial use; outlet names are trademarks. | Store headline and URL only (ADR 0007); link to the publisher's page; no framing (ADR 0008) | **Yes**: before M3 (real headlines) |
| 14 | **Research use.** Any sharing of aggregate data with universities may need de-identification standards and ethics review. | Aggregates only, never individual demographics | Later |

## Sources (retrieved 2026-11-16)

- CCPA thresholds and 2026 regulations: Jackson Lewis, "Navigating the California Consumer Privacy
  Act: 30 Essential FAQs" (2026-01-21), jacksonlewis.com.
- Number of state laws and thresholds: MultiState, "Twenty-four states now have comprehensive
  consumer privacy laws" (2026-10-28), multistate.us.
- COPPA amendments: Hunton, "FTC Publishes Final COPPA Rule Amendments", hunton.com; Federal
  Register, 2025-04-22, document 2025-05904.
- Not verified from a source in this session: the CCPA 45-day response deadline, which states'
  laws cover non-profits, TCPA and ADA details. They are listed as items for the lawyer.
