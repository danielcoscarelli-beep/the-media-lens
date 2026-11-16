# Steve — permanent memory

Technical memory for Vulgis on M's side. Read at the start of every session; update at the end.
Never delete history: mark superseded entries and add new ones. `CLAUDE.md` remains the
authoritative description of the code; this file holds Steve's working context.

_Last updated: 2026-11-16 (ORD-0002/ORD-0003 architecture proposal)._

## Mandate (from M, 2026-11-16)

- Build Vulgis from the current prototype into a system able to handle **millions of users**,
  eventually hosted on **AWS or Azure** (not yet chosen). _Superseded 2026-11-16: M chose **AWS**._
- Interface optimized for **desktop and mobile**.
- Take development orders from Walter (`docs/team/orders/`); document at corporate standards.

## Current state (2026-11-16)

- **Code:** front-end-only React 18 + Vite 5 prototype, plain JavaScript, no backend, no
  database, no authentication. All content and the 300 other readers are simulated. Details in
  `CLAUDE.md`.
- **Latest `main`:** `6db1dc8` — PR #2 (slider rating 1–100, single colored scores, sourcing and
  framing analysis removed) and PR #1 (rename to Vulgis).
- **Branches:** `collab/main` = M's working branch, created 2026-11-15 from `main` and
  fast-forwarded to `6db1dc8` on 2026-11-16.
- **Deployment:** vulgis.com on Cloudflare Pages, built from the fork `mcoscarelli/the-media-lens`
  (`main`, `npm run build` → `dist`, `NODE_VERSION=20`). The fork must be synced on GitHub after
  Daniel merges. Daniel's own claude.ai artifact copy also exists (see `CLAUDE.md` §3).

## Decisions from M recorded in the proposal (2026-11-16)

- US market and US news only; AWS; v1 = headlines + link to the source, no article text.
- Q10: blind rating (honest rating + prediction) on the **headline before opening**; "Read at
  [Outlet]" afterwards (ADR 0008).
- Q9: easy sign-up for people, layered against bots, step-up only when suspicious (ADR 0003).
- Login gate first: the whole site behind sign-in as milestone M1 (no Cloudflare Access stopgap).
- These reached Steve partly as coordinator messages relaying M; treat them as M's decisions but
  confirm with M when the PR is opened.

## Gap to the target (high level; _2026-11-16: now proposed in ADRs 0001–0009, not approved_)

Backend API, database, authentication and accounts, server-enforced rating windows and limits,
real news ingestion and licensing, moderation and anti-abuse, observability, CI/CD, automated
security checks, load testing, privacy and data-protection compliance. No architecture has been
proposed or approved yet. First step when ordered: an architecture overview and ADRs.

## Technical debt and risks noted

- No linter, type checking or CI (`CLAUDE.md` §8).
- E2E test depends on the container's preinstalled Playwright.
- Rules (windows, Browse Mode, blind hiding) run only in the browser and can be bypassed.

## Environment notes

- The cloud checkout may be at `/home/claude/the-media-lens` (2026-11-16 session), not the
  `/home/user/the-media-lens` path in `CLAUDE.md` §10.
- Some sessions have no network for `npm install`. On 2026-11-15 a preview was bundled with the
  preinstalled `/opt/npm-tools/node_modules/esbuild` and React 19 instead; that is not a substitute
  for the project build.
- Official AWS pricing pages for Lambda and Aurora are not on the session's fetch allowlist
  (2026-11-16); Cognito, API Gateway, CloudFront and WAF pages are.
- GitHub GraphQL and account-wide endpoints are blocked in sessions; use repo-scoped REST
  (`gh api repos/danielcoscarelli-beep/the-media-lens/...`).

## Proposed target (2026-11-16, awaiting approval; see `docs/architecture/README.md`)

CloudFront + S3 (one domain, `/api/*` to API Gateway) · Lambda (Node.js, Arm) · Cognito
Essentials (Google, Apple, email code, passkeys) · Aurora PostgreSQL Serverless v2 (demographics
in a `private` schema; admin DB role cannot edit ratings) · RSS ingestion via EventBridge/SQS ·
separate admin app/API/staff pool with MFA · SES · WAF. Estimates: ~$150–200/month at 1k MAU,
~$2,400 at 100k, ~$21,000 at 1M; Cognito is the largest cost beyond the pilot.
Build plan: M1 login gate (1–2 weeks) → M2 backend → M3 real headlines (lawyer first) → M4 admin
→ M5 pilot readiness.

## Orders in flight

- ORD-0002 and ORD-0003: proposals delivered on branch `order/0002-0003-architecture` (pushed,
  no PR yet, at M's request). Status `Awaiting approval`. Next: M and Daniel review; then a build
  order for M1 (login gate).
- ORD-0001: On hold (M).

## Open decisions awaiting M/Daniel (from the proposal)

Each ADR; TypeScript for the backend; trust rule for ratings from flagged accounts; "headline"
score wording; 18+ pilot age; de-identified ratings after deletion; vulgis.com DNS ownership;
Walter: daily article budget rule and no platform-written event titles.

## Session log

- 2026-11-16 — Memory created. No development orders worked yet.
- 2026-11-16 — ORD-0002 and ORD-0003 worked (proposal only): ADRs 0001–0009, architecture
  overview with data model, scale path, costs and phased plan; admin screen list; US privacy
  checklist. M's Q10, Q9 and login-first decisions arrived mid-task and were built in. Both
  orders set to `Awaiting approval`. Lesson: get prices from official pages where allowed and
  label third-party figures with their dates.
