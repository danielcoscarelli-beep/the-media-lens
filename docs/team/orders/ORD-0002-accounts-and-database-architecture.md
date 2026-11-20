# ORD-0002: Architecture proposal for accounts, login, profiles and the database

**Status:** Awaiting approval
**Priority:** P1 (urgent)
**Issued by:** Walter, agreed with M on 2026-11-16
**Source decision:** `docs/team/walter/memory.md`, Decision register, 2026-11-16 ("Real users", "US focus", "AWS", "Headlines first")
**Updated:** 2026-11-16, after M's decisions: US market and US news only; AWS is the cloud; v1 shows headlines with a link to read at the source. Scope widened accordingly (see "Decisions already made").
**Needs Daniel's approval:** Yes, before anything is built: a backend, database and authentication are architectural changes (`CLAUDE.md` §7.4). **This order is for the proposal only.** Building comes in a later order once M and Daniel approve.

## Business objective
Vulgis needs real, distinct people rating real articles. Every part of the mission (statistically
significant crowd scores, an honest and diverse crowd, resistance to manipulation) depends on
accounts that are cheap to create for real people and expensive to fake at scale.

## User-facing outcome
Readers can register, log in (desktop and mobile), keep a profile, and have their ratings, Insight
rank and history saved on the server and available on any device.

## Decisions already made (2026-11-16, M)
- **Market:** the US, US news only, for now.
- **Cloud:** **AWS.** No AWS-vs-Azure comparison needed; choose AWS services and note anything that would be hard to move later.
- **Content in v1:** **headlines only, plus a link to read the article at the source** (a pop-up or new window). Vulgis stores and shows the headline and the URL, never the article text. The outlet stays hidden until the reader opens the article. Full-text licensing comes later.
- **Admin interface:** needed; its design is ORD-0003, to be proposed together with this order.

## Acceptance criteria (for the proposal)
- [ ] A set of ADRs in `docs/architecture/adr/` covering at least: AWS as the cloud (record M's decision); authentication service and login methods; database; API layer; how the front end moves from `services/` mocks to the API; hosting of the front end (stay on Cloudflare Pages or move to AWS); **headline ingestion** (how US headlines and URLs are collected, e.g. publishers' RSS feeds or a headlines API, and grouped by event, without copying article text).
- [ ] **Account integrity options** compared (email only, email + phone, passkeys, social login, stronger verification), with cost, friction and how well each resists duplicate and fake accounts. This is a business decision for M; give a recommendation.
- [ ] **Server-side rules:** rating windows and daily limits enforced by the server clock; the API never returns an article's outlet, byline or community score to a reader who hasn't rated it (blind first, `CLAUDE.md` §1.5).
- [ ] **Data model** draft: users, profiles (demographics optional, private, stored separately and never used in ranking, `CLAUDE.md` §1.6), outlets, events, articles (headline, URL, outlet, publication time; **no body text**), ratings, admin users and an audit log. Ratings must allow both an honest rating and a prediction (PROP-0001, pending approval). Record whether the reader opened the article before rating.
- [ ] **Reading at the source:** how the link opens (pop-up, new tab, or an in-app window), noting that many news sites forbid being shown inside another site's frame; how the outlet stays hidden until the reader opens it.
- [ ] **Privacy and legal requirements** for a US service: US state privacy laws (e.g. California's CCPA/CPRA), COPPA (children under 13) and the minimum age, consent, data export and deletion. Flag anything needing a lawyer.
- [ ] **Scale path:** what the design costs and handles at 1,000, 100,000 and 1,000,000+ users, and what changes between those stages.
- [ ] **Monthly AWS cost estimates** at those stages.
- [ ] Architecture overview (`docs/architecture/README.md`) updated with the proposed target state, clearly marked as proposed.

## Constraints
- Product principles in `CLAUDE.md` §1. Crowd only (Walter's memory, 2026-11-16).
- Desktop and mobile web first; native apps are out of scope for now.
- Prefer managed services; the team is small.
- Don't build or provision anything yet.

## Options discussed
- Cloud: decided, AWS (2026-11-16).
- **Open product question for M (design for both):** in v1, is the blind rating given on the **headline before** the reader opens the article (keeps "blind first"), or **after reading** at the source (the outlet is then known)? Walter recommends rating the headline blind first.
- Login: email with passkeys or magic links, plus Google and Apple sign-in.

## Further decisions by M (2026-11-16, relayed to Steve by the coordinator during the work)
- **Q10 decided:** the blind rating (honest rating + prediction) is given on the **headline before
  opening** the article; "Read at the source" comes after and reveals the outlet. Recorded in
  ADR 0008.
- **Q9 direction:** account creation must **not be hard for real people**, but must minimize the
  risk of bots: a low-friction, layered approach. Recorded in ADR 0003.
- **Login first:** the site goes behind a login as soon as possible (no Cloudflare Access
  stopgap); the build plan starts with a login gate. Recorded in `docs/architecture/README.md`
  (Phased build plan, M1).

## Steve's record
- Started: 2026-11-16 (Steve). Proposal delivered 2026-11-16; status `Awaiting approval`.
- Branch / PR: `order/0002-0003-architecture` (pushed; no pull request opened yet, at M's request,
  so M and Daniel can review first).
- Development log entry: "2026-11-16: Architecture proposal for accounts, database, headline
  ingestion and admin (ORD-0002, ORD-0003)".
- Deliverables:
  - ADRs 0001–0009 in `docs/architecture/adr/` (all `Proposed`): AWS (0001), login (0002), account
    integrity with options compared and a recommendation (0003), database (0004), API layer and
    server-side rules incl. blind-first response shapes (0005), front-end hosting and move from
    mocks (0006), headline ingestion and event grouping (0007), headline-first rating flow and
    reading at the source (0008), admin approach and security (0009).
  - `docs/architecture/README.md`: proposed target architecture, draft data model (ratings carry
    a prediction and `opened_before_rating`), scale path at 1k/100k/1M MAU, monthly cost
    estimates with assumptions and sources, phased build plan (M1 = login gate, 1–2 weeks).
  - `docs/privacy/us-privacy-and-legal-requirements.md`: US privacy/legal checklist, items for a
    lawyer flagged.
- Verification: documentation only; no code changed, nothing built or provisioned. Prices looked
  up on 2026-11-16 (sources listed in the README); the official Lambda and Aurora pages could not
  be fetched, so dated third-party summaries were used. Some items are unpriced allowances.
- Deviations and notes:
  - Decisions needed from M and Daniel: approve each ADR; backend language (TypeScript
    recommended, new to the project); the trust rule for counting ratings from flagged accounts
    (ADR 0003); headline-score wording on Methods (ADR 0008); 18+ minimum age for the pilot;
    whether deleted users' de-identified ratings stay in closed scores; DNS ownership for
    vulgis.com.
  - Questions for Walter: the daily article budget and selection rule (ADR 0007); no
    platform-written event titles (ADR 0007).
  - Cost finding: Cognito is the largest cost beyond the pilot (~70% at 1M MAU).
