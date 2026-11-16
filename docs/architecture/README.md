# Vulgis architecture

_Owner: Steve. Last updated: 2026-11-16 (target architecture proposed for ORD-0002 and ORD-0003)._

This folder holds the architecture overview and the Architecture Decision Records (ADRs).
`CLAUDE.md` describes the code in detail; this overview describes the system and where it is going.

## Current state (prototype)

- **Client only.** A React 18 single-page app built with Vite 5. All data (articles, events,
  simulated readers and their ratings) is bundled into the client. There is no server, database
  or authentication.
- **Persistence:** the reader's own ratings and settings live in the browser's localStorage.
- **Hosting:** static files on Cloudflare Pages (vulgis.com), built from M's fork of the repository.
- **Data-access seam:** `src/services/api.js` and `src/services/community.js` are the only modules
  that read articles and ratings, so a real API can replace them.

## Target state — PROPOSED (2026-11-16), not approved, nothing built or provisioned

> Everything below this line is a **proposal** awaiting M's and Daniel's approval. Decisions
> already made by M: US market and US news only; AWS; v1 shows headlines with a link to read at
> the source (no article text); an admin interface; the blind rating is given on the headline
> before opening (Q10); account creation easy for people but layered against bots (Q9); the site
> goes behind a login as the first milestone.

### Components

```
 Reader (phone/desktop browser)                  Staff (admin.vulgis.com)
        │ https://vulgis.com                              │
        ▼                                                 ▼
 CloudFront + WAF (flat-rate plan) ──────────┐   CloudFront + WAF (admin)
   ├─ /*      → S3: React app (static)       │     ├─ /*       → S3: admin app
   ├─ /api/*  → API Gateway (HTTP API)       │     └─ /admin/* → API Gateway (admin API)
   └─ /go/*   → API (redirect to publisher)  │                      │
        │                                    │                      │
        ▼                                    │                      ▼
 Lambda (Node.js, Arm): reader API ◄─── Cognito (readers)   Lambda: admin API ◄── Cognito (staff, MFA)
        │                                                           │
        └────────────► Aurora PostgreSQL Serverless v2 ◄────────────┘
                         (public schema │ private schema: demographics, consents)
                                ▲
 EventBridge Scheduler → fetch Lambda → SQS → normalize/cluster Lambda   (headline ingestion)
 Scheduled jobs: window close → article_stats, user_scores (rank/Insight), data exports/deletions
 SES (email codes, notices) · CloudWatch/X-Ray · CloudTrail · GuardDuty · KMS · Secrets Manager
 From 1M stage: ElastiCache (Valkey) for hot counters/rate limits; S3 + Athena for analytics
```

### Decisions (ADRs, all `Proposed`)

| ADR | Decision |
|---|---|
| [0001](adr/0001-aws-as-cloud.md) | AWS, `us-east-1`, separate prod/staging accounts, CDK, GitHub Actions |
| [0002](adr/0002-authentication-and-login.md) | Cognito Essentials: Google, Apple, email one-time code, optional passkeys; no passwords |
| [0003](adr/0003-account-integrity.md) | Low-friction layers: social/email login, WAF challenge and rate limits, email hygiene, risk signals, step-up only when suspicious |
| [0004](adr/0004-database.md) | Aurora PostgreSQL Serverless v2; principles enforced by schemas and DB roles |
| [0005](adr/0005-api-layer.md) | API Gateway + Lambda; server clock; two response shapes (sealed/revealed) with a leak test |
| [0006](adr/0006-frontend-hosting-and-api-migration.md) | S3 + CloudFront on one domain; staged move from mocks to the API |
| [0007](adr/0007-headline-ingestion.md) | RSS from a published outlet list; embedding-based event grouping; rule-based daily budget |
| [0008](adr/0008-rating-flow-and-reading-at-source.md) | Headline-first blind rating (M), then "Read at [Outlet]" in a new tab via `/go/{id}`; no framing |
| [0009](adr/0009-admin-interface.md) | Separate admin app/API/user pool, MFA, roles, DB-enforced guardrails, audit log |

Admin screens: [admin-interface.md](admin-interface.md). Privacy and legal requirements:
[`docs/privacy/us-privacy-and-legal-requirements.md`](../privacy/us-privacy-and-legal-requirements.md).

### Draft data model (PostgreSQL)

`id` columns for articles and events are random opaque strings; other ids are UUIDs. All times
are `timestamptz` (UTC). Statuses such as open/closed are **computed**, not stored.

| Table | Key columns | Notes |
|---|---|---|
| `users` | id, cognito_sub (unique), email (normalized, unique), email_verified, status (active/suspended/deleted), timezone, timezone_changed_at, age_confirmed_at, risk_score, created_at, deleted_at | No birth date stored, only that the age check passed |
| `profiles` | user_id, display_name, settings (jsonb) | Public-facing name only |
| `private.demographics` | user_id, fields (each optional), research_opt_in, updated_at | Separate schema; ranking and admin roles cannot read it (`CLAUDE.md` §1.6) |
| `private.consents` | user_id, kind (terms, privacy, research, email), version, granted_at, withdrawn_at | Proof of consent |
| `outlets` | id, name, homepage, domains[], active, added_at, removed_at | Published list; no bias field, by design |
| `feeds` | id, outlet_id, url, etag, last_modified, last_fetched_at, status, error | Ingestion state |
| `events` | id, key_terms[], first_seen_at, status, merged_into | No platform-written title |
| `articles` | id, outlet_id, event_id, headline, url, canonical_url, byline (nullable), published_at (publisher), ingested_at, opens_at, window_hours (snapshot of the setting), pool_status, hidden_reason, link_status | **No body text, summary or image** |
| `article_opens` | user_id, article_id, opened_at, skipped_rating | "Read at the source" clicks |
| `ratings` | id, user_id, article_id, basis (`headline_blind` \| `after_reading`), points (1–100), opened_before_rating, submitted_at, prediction_pct (0–100, nullable), prediction_at, counted (bool), excluded_reason | Unique (user_id, article_id, basis); append-only; prediction per PROP-0001 |
| `browse_sessions` | user_id, local_date, started_at | Daily Rating/Browse Mode rule |
| `article_stats` | article_id, basis, n, sum, sum_sq, pred_log_sum, updated_at | Derived; rebuildable |
| `user_scores` | user_id, metric (crowd_alignment / insight / forecast), value, eligible_n, percentile, tier, computed_at | Derived by jobs |
| `settings` | key, value (jsonb), version, effective_at, changed_by, reason | Versioned; public endpoint for Methods |
| `admin_users` | id, cognito_sub, email, role (owner/operator/analyst), status, created_at | Separate staff pool |
| `audit_log` | id, at, actor_admin_id, action, target_type, target_id, before, after, reason, ip | INSERT-only; copied to locked S3 |
| `reports` | id, reporter_user_id, target_type, target_id, reason, status, handled_by, handled_at | Reader reports |
| `data_requests` | id, user_id, kind (export/delete/correct), status, requested_at, due_at, completed_at | Privacy rights |
| `integrity_signals` | id, kind, subject_ids[], score, details, status, created_at | Risk signals (kept 90 days) |

### Scale path

Assumptions used throughout: users counted as **monthly active users (MAU)**; 25% of them active on
a given day; ~50 API requests and ~20 static file requests per active user per day; Lambda 100 ms
at 512 MB on Arm per request; 4 sign-in emails per user per month.

| | **Pilot: ~1,000 MAU** | **Growth: ~100,000 MAU** | **Scale: 1,000,000+ MAU** |
|---|---|---|---|
| API requests / month | ~0.4 million | ~37.5 million | ~375 million |
| Ratings / day (3–10 per active user) | ~1–2.5 thousand | ~75–250 thousand | ~0.75–2.5 million |
| Database | 1 Aurora writer, 0.5–2 ACU | Writer + reader in 2nd zone, ~3 ACU average, RDS Proxy | Writer + 2 readers, ~16 ACU average; `ratings` partitioned by month; I/O-Optimized considered |
| API | Lambda | Lambda; edge-cached sealed feed | Lambda (re-evaluate Fargate); ElastiCache for counters and rate limits; SQS buffer for rating spikes |
| Edge | CloudFront Pro | CloudFront Business | CloudFront Premium or custom |
| Integrity | WAF rate limits + Challenge | + Bot Control, Account Creation Fraud Prevention on sign-up | + rating-pattern detection jobs |
| Operations | Alarms to email | Staging = production shape, on-call rota, load tests, DR backup copies to `us-west-2` | Analytics via S3 + Athena; AWS Savings Plans; Cognito pricing review |

### Monthly AWS cost estimates (rough, USD)

**These are estimates, not quotes.** They depend on the usage assumptions above, which are
guesses until a pilot measures real behavior. Prices were looked up on 2026-11-16; where an official
AWS page could not be fetched, a dated third-party summary was used and is marked. Items marked
"allowance" were **not** looked up and are order-of-magnitude placeholders. Taxes, AWS Support
plans, domain and Apple Developer fees are excluded.

| Item | Unit price used (source) | ~1k MAU | ~100k MAU | ~1M MAU |
|---|---|---|---|---|
| Cognito Essentials | 10k MAU free, then $0.015/MAU (AWS) | $0 | $1,350 | $14,850 |
| API Gateway HTTP API | $1.00/M first 300M, $0.90/M after (AWS; 12-month free tier ignored) | <$1 | $38 | $368 |
| Lambda (Arm) | $0.20/M requests, $0.0000133334/GB-s, monthly free tier (cloudburn.io, 2026-10-12) | $0 | $27 | $325 |
| Aurora PostgreSQL Serverless v2 | $0.12/ACU-h, $0.10/GB-month, $0.20/M I/O (factualminds.com, 2026-10-28) | $70 | $310 | $1,850 |
| CloudFront flat-rate (incl. WAF, DDoS, Route 53) | Pro $15, Business $200, Premium $1,000 (AWS) | $15 | $200 | $1,000–1,500 |
| WAF Bot Control / fraud prevention (sign-up paths only) | $10/month + per-request (AWS; tiers to verify) | $0 | $50 | $300 |
| SES email | $0.10 per 1,000 (cloudburn.io, 2026-10-12) | <$1 | $40 | $400 |
| RDS Proxy / Data API | allowance (not looked up) | $0–20 | $50 | $200 |
| ElastiCache (Valkey) | allowance (not looked up) | — | — | $300 |
| CloudWatch, X-Ray, CloudTrail, GuardDuty, KMS, Secrets Manager | allowance (not looked up) | $20 | $150 | $1,000 |
| Staging environment, backups, DR copies | allowance | $50 | $150 | $500 |
| **Total (rounded)** | | **≈ $150–200** | **≈ $2,400** | **≈ $21,000** |

Reading the table: at every stage beyond the pilot, **login (Cognito) is the largest cost**
(~55% at 100k, ~70% at 1M). Moving to Cognito Lite (no passkeys) would cut the 1M figure by about
$10,000; self-built login more. That trade-off should be revisited at ~200k MAU (ADR 0002).

Sources (retrieved 2026-11-16): aws.amazon.com/cognito/pricing, aws.amazon.com/api-gateway/pricing,
aws.amazon.com/cloudfront/pricing, aws.amazon.com/waf/pricing; cloudburn.io/blog/aws-lambda-pricing;
cloudburn.io/blog/amazon-ses-pricing; factualminds.com/blog/amazon-aurora-pricing-io-optimized-serverless-v2-global.
The official Lambda and Aurora pricing pages could not be fetched from this session.

### Phased build plan (proposed)

M decided (2026-11-16) that the site should go **behind a login as soon as possible**, waiting for
this design rather than a stopgap. A working login that gates the whole app is therefore the
**first milestone**. Each milestone is its own order and pull request for Daniel's review.

Time estimates assume one developer (Steve) working with M, approvals within a few days, and no
lawyer time; they are elapsed calendar time, not effort.

| Milestone | What readers get | Minimum pieces | Estimate |
|---|---|---|---|
| **M1 — Login gate** | vulgis.com shows only a sign-in page until you sign up/sign in; then today's prototype, unchanged (ratings still in the browser) | AWS account set-up (Organizations, budgets, CloudTrail); **Cognito user pool** (Essentials, email one-time code + Google; Apple when M's Apple Developer account exists) with managed login pages; **S3 (private) + CloudFront** serving the app; an **edge check** (Lambda@Edge on viewer requests) that lets a request through only with a valid Cognito session cookie and otherwise redirects to sign-in, plus the small sign-in callback/sign-out handlers; optional **sign-up allow-list** (Cognito pre-sign-up trigger) while invite-only; WAF rate limits; DNS pointed at CloudFront; CDK code and a deploy workflow. **No database or API yet.** | **1–2 weeks** after approval, plus however long it takes M to create the AWS account, Google OAuth client and DNS access |
| M2 — Backend foundation | Ratings and profile saved to the account, on any device; rules enforced by the server | Aurora, reader API, `users`/`profiles`/`ratings`/`browse_sessions`, server-side visibility and modes, shared rule package, front end switched to the API (still sample content) | 3–4 weeks |
| M3 — Real headlines | Real US headlines, headline-first rating, "Read at [Outlet]" | Ingestion pipeline, outlet list, event grouping, `/go/{id}`, new rating screens; **gated on lawyer review** (feeds' terms, Q6) | 3–4 weeks |
| M4 — Admin v1 | Staff can run the feed and handle users | Admin pool with MFA, admin API, screens 1–7, 11–12, audit log | 3–4 weeks (can overlap M3) |
| M5 — Pilot readiness | Safe to open to real readers beyond invitees | Integrity layers (ADR 0003), privacy requests and policies, Insight/prediction if PROP-0001 approved, monitoring, load test | 2–3 weeks |

M1 notes: the gate makes the prototype's sample articles (attributed to real outlets) private,
which also reduces Walter's Q6 risk. Cognito is free under 10,000 MAU, so M1 costs roughly the
CloudFront plan ($15/month) plus small Lambda@Edge and logging charges (not looked up; expected to
be a few dollars).

## Architecture Decision Records

See `adr/README.md` for the index and template.
