# ORD-0002: Architecture proposal for accounts, login, profiles and the database

**Status:** Issued
**Priority:** P1 (urgent)
**Issued by:** Walter, agreed with M on 2026-11-16
**Source decision:** `docs/team/walter/memory.md`, Decision register, 2026-11-16 ("Real users")
**Needs Daniel's approval:** Yes, before anything is built: a backend, database and authentication are architectural changes (`CLAUDE.md` §7.4). **This order is for the proposal only.** Building comes in a later order once M and Daniel approve.

## Business objective
Vulgis needs real, distinct people rating real articles. Every part of the mission (statistically
significant crowd scores, an honest and diverse crowd, resistance to manipulation) depends on
accounts that are cheap to create for real people and expensive to fake at scale.

## User-facing outcome
Readers can register, log in (desktop and mobile), keep a profile, and have their ratings, Insight
rank and history saved on the server and available on any device.

## Acceptance criteria (for the proposal)
- [ ] A set of ADRs in `docs/architecture/adr/` covering at least: cloud provider (AWS vs. Azure) for this phase; authentication service and login methods; database; API layer; how the front end moves from `services/` mocks to the API; hosting of the front end (stay on Cloudflare Pages or move).
- [ ] **Account integrity options** compared (email only, email + phone, passkeys, social login, stronger verification), with cost, friction and how well each resists duplicate and fake accounts. This is a business decision for M; give a recommendation.
- [ ] **Server-side rules:** rating windows and daily limits enforced by the server clock; the API never returns an article's outlet, byline or community score to a reader who hasn't rated it (blind first, `CLAUDE.md` §1.5).
- [ ] **Data model** draft: users, profiles (demographics optional, private, stored separately and never used in ranking, `CLAUDE.md` §1.6), articles, ratings. Ratings must allow both an honest rating and a prediction (PROP-0001, pending approval).
- [ ] **Privacy and legal requirements** listed: LGPD (Brazil), GDPR (EU) and US state privacy laws as they apply to where users will be; minimum age; consent; data export and deletion. Flag anything needing a lawyer.
- [ ] **Scale path:** what the design costs and handles at 1,000, 100,000 and 1,000,000+ users, and what changes between those stages.
- [ ] **Monthly cost estimates** at those stages, and portability between AWS and Azure noted.
- [ ] Architecture overview (`docs/architecture/README.md`) updated with the proposed target state, clearly marked as proposed.

## Constraints
- Product principles in `CLAUDE.md` §1. Crowd only (Walter's memory, 2026-11-16).
- Desktop and mobile web first; native apps are out of scope for now.
- Prefer managed services; the team is small.
- Don't build or provision anything yet.

## Options discussed
- Go straight to the eventual cloud (AWS or Azure) vs. a fast pilot on a portable managed Postgres + auth service and migrate later. Walter leans toward choosing the cloud now to avoid a second migration, unless the pilot path is much faster or cheaper.
- Login: email with passkeys or magic links, plus Google and Apple sign-in.

## Steve's record
- Started:
- Branch / PR:
- Development log entry:
- Verification:
- Deviations and notes:
