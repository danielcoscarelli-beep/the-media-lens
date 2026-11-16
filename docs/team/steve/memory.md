# Steve — permanent memory

Technical memory for Vulgis on M's side. Read at the start of every session; update at the end.
Never delete history: mark superseded entries and add new ones. `CLAUDE.md` remains the
authoritative description of the code; this file holds Steve's working context.

_Last updated: 2026-11-16 (created)._

## Mandate (from M, 2026-11-16)

- Build Vulgis from the current prototype into a system able to handle **millions of users**,
  eventually hosted on **AWS or Azure** (not yet chosen).
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

## Gap to the target (high level, not yet planned)

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
- GitHub GraphQL and account-wide endpoints are blocked in sessions; use repo-scoped REST
  (`gh api repos/danielcoscarelli-beep/the-media-lens/...`).

## Orders in flight

None yet.

## Session log

- 2026-11-16 — Memory created. No development orders worked yet.
