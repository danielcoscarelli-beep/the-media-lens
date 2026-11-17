# ORD-0004: Working prototype on Supabase (before the full AWS build)

**Status:** In progress (P0 done)
**Priority:** P1 (urgent)
**Issued by:** Walter, agreed with M on 2026-11-17
**Source decision:** `docs/team/walter/memory.md`, Decision register, 2026-11-17 ("Prototype first", Q12)
**Needs Daniel's approval:** To merge into `main`, yes (it adds a backend, `CLAUDE.md` §7.4). Building and testing on a separate branch and a preview address does not need it; keep Daniel informed through the pull request.

## Business objective
Before spending on the full AWS build (ORD-0002/ORD-0003, ADRs 0001–0009), learn from real people:
do they come back, do they answer the second question, and does the rating flow feel fair? The
prototype must be real (real accounts, real shared ratings, real headlines), small, cheap and fast.

## User-facing outcome
Invited testers sign in, see real US headlines blind, give an honest rating and a prediction,
then read the article at the source. Their ratings are saved to their account and shared with
other testers. Nobody without an invitation can see the site.

## Milestones
1. **P0 — Setup checklist (first, before any code):** a short, plain-language checklist for M:
   create the Supabase project, the Google sign-in key, and the settings Steve needs (which values,
   where to paste them, what is safe to share). Also: how to allow package installs for this
   workspace (see Constraints).
2. **P1 — Login gate:** the whole site behind sign-in (Supabase Auth: Google, plus a one-time code
   or magic link by email). **Invite-only**: only addresses M approves can sign in.
3. **P2 — Real accounts and ratings:** ratings saved in Supabase (PostgreSQL) per account; the
   **two-question rating** (honest 1–100 rating, then "What share of readers will rate this Biased
   or worse?"); community averages computed from testers' real ratings; blind first enforced by
   the database (row-level security or server functions): outlet, link and score are returned only
   after the reader has rated; then **"Read at [Outlet]" opens a new tab**.
4. **P3 — Real US headlines:** a small, published list of US outlets across the spectrum; headlines
   and links from their RSS feeds, grouped by event; **no article text stored or shown**. Simple
   scheduled ingestion. Do not invite anyone outside the team until a lawyer has reviewed (Q6).

## Acceptance criteria
- [x] P0 checklist delivered to M before code starts (`docs/setup/prototype-supabase-setup.md`, 2026-11-17).
- [ ] The data model follows ADR 0004 (as a subset) so a later move to AWS is mostly a database copy. Record the mapping and any differences in a new ADR ("Prototype on Supabase").
- [ ] Uninvited visitors and signed-out visitors see only a sign-in page; this covers the preview address too.
- [ ] Blind first holds at the API level: an automated test shows the outlet, link and score are not returned before rating.
- [ ] Each tester can rate a headline once; ratings are final; the prediction is saved with the rating.
- [ ] Insight scoring (PROP-0001) may be computed and shown only if clearly labeled **experimental**, since Daniel has not yet approved PROP-0001. Crowd Alignment remains in the code until he does.
- [ ] Works on desktop and phone (390px), light and dark themes.
- [ ] Runs on Supabase's free tier and the existing Cloudflare Pages: no AWS, no paid services without M's approval.
- [ ] Documentation per project rules: `DEVELOPMENT_LOG.md`, `CLAUDE.md` (marked as prototype), Steve's memory, this order's record, a PR description for Daniel.
- [ ] Tests and build pass (`npm test`, `npm run build`, E2E), or Steve states exactly what could not be run.

## Constraints
- Product principles (`CLAUDE.md` §1), crowd-only, rate the headline before opening (M, 2026-11-16).
- **Branch and preview:** build on `prototype/supabase`. vulgis.com is built by Cloudflare from M's fork (`mcoscarelli/the-media-lens`), so a preview address needs the branch pushed to the fork too; ask M before attaching the fork to the session.
- **Secrets:** never commit Supabase service keys or OAuth secrets. Only the public (anon) key may be in the front end, protected by row-level security.
- **Environment blocker (2026-11-17):** this workspace cannot reach the npm registry, so packages (including the project's own Vite and React) cannot be installed, and the build and tests cannot run here. M must allow package installs in the network settings and continue in a new chat, or Steve's code will be unverified.
- vulgis.com production keeps showing the current prototype until M decides to switch.

## Options discussed
- Supabase vs. AWS Amplify vs. Cloudflare Workers + D1 for the prototype. Supabase chosen
  (Walter's recommendation, M agreed): PostgreSQL like the AWS plan, auth included, free tier,
  fastest path.

## Steve's record
- Started: 2026-11-17
- Branch / PR: `prototype/supabase` (created from `collab/main`; `collab/main` fast-forwarded to it). No PR yet (none requested for P0).
- Development log entry: "2026-11-17: ORD-0004 P0, Supabase prototype setup checklist for M"
- Verification: P0 is documentation only. Supabase, Google Cloud, Cloudflare Pages and Claude
  settings steps were checked against the official documentation listed at the end of the
  checklist (fetched 2026-11-17); screens themselves could not be seen. The npm registry block was
  re-confirmed (`npm view react` → ENOTFOUND; proxy CONNECT → 403).
- **P0 delivered 2026-11-17:** `docs/setup/prototype-supabase-setup.md` (Parts A–I: Supabase project,
  Google sign-in, email code template, redirect URLs, sign-ups off, tester invites, Cloudflare
  previews and variables, values to send, workspace network access).
- Deviations and notes:
  - `VITE_SUPABASE_ANON_KEY` will hold Supabase's **publishable** key (`sb_publishable_...`):
    Supabase's documentation says the legacy anon/service_role keys are deprecated by the end of
    2026. The variable name is kept as specified.
  - Supabase's built-in email only reaches members of the Supabase team, 2 emails per hour. Testers
    sign in with Google until a custom SMTP provider is chosen; Steve will propose a free one for
    M's approval (no paid service without approval).
  - Invite-only (P1 plan): sign-ups off now; in P1 an `invited_emails` table plus a "Before User
    Created" auth hook (Postgres function) refuses any email not on the list. Free-plan
    availability of the hook is unverified; fallback is sign-ups off with accounts created in
    advance.
  - Preview builds need `prototype/supabase` in M's fork `mcoscarelli/the-media-lens`; Steve will
    ask M before attaching the fork.
  - Blocker for P1 onwards: the workspace cannot reach the npm registry; M must enable network
    access (checklist Part I) and continue in a new chat.
