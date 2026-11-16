# 0004: Database — PostgreSQL on Aurora Serverless v2

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002

## Context

The data is relational: users, outlets, events, articles, ratings (each linked to a user and an
article), derived scores, settings, admin users and an audit log (data model in
`docs/architecture/README.md`). Queries include "articles open now that this user has not rated",
per-article averages, cohort percentiles, and admin searches. Writes are modest even at a million
users (estimate: ~2 million ratings/day ≈ 25 writes/second on average, a few hundred at peaks).
Demographics must be stored separately and be unreadable by ranking code (`CLAUDE.md` §1.6).

## Options considered

1. **Aurora PostgreSQL Serverless v2.** Scales capacity up and down automatically (in 0.5 ACU
   steps) without migrating; add read replicas later; Multi-AZ; point-in-time restore. Standard
   PostgreSQL, so portable. Price: ~$0.12 per ACU-hour, storage $0.10/GB-month, I/O $0.20 per
   million (us-east-1 list prices per factualminds.com, updated 2026-10-28; verify on AWS's page).
   A minimum of 0.5 ACU ≈ $44/month.
2. **RDS for PostgreSQL (fixed instance).** Cheaper at steady load (e.g. db.t4g.medium about
   $53/month compute, per bytebase.com, 2026-11-09); resizing means a brief restart.
3. **DynamoDB.** Effortless scale and pay-per-request; but relational queries (joins, averages,
   admin search, percentiles) become hand-built indexes and pipelines. Poor fit for a small team.
4. **Hosted Postgres outside AWS (Neon, Supabase).** Good developer experience; contradicts the
   AWS decision.

## Decision (proposed)

**Aurora PostgreSQL Serverless v2**, one writer (min 0.5 ACU) at the pilot; a reader in a second
availability zone from the 100k stage. Rules:

- **Schemas and roles enforce the principles, not only code:**
  - `private` schema for demographics and consents; the API's normal role and the scoring job's
    role have **no access** to it. Only the privacy-request job and an opt-in, aggregate research
    job may read it.
  - The admin API's role has **no UPDATE/DELETE on `ratings` or derived scores**, and only INSERT
    on `audit_log` (ADR 0009).
- Ratings are append-only: one row per user, article and rating basis; never edited.
- Derived data (`article_stats`, `user_scores`) is recomputed by jobs from ratings, so it can
  always be rebuilt.
- Connections from Lambda go through **RDS Proxy** or the **RDS Data API** (to be chosen when
  built; pricing not looked up for this ADR).
- Encryption at rest with KMS; automated backups 14 days; snapshots copied to `us-west-2` from the
  100k stage.
- Migrations as versioned SQL files in the repository, run by CI.

## Consequences

- Easier: one familiar database for the whole product; SQL for admin dashboards; portable.
- Harder: Lambda + PostgreSQL needs connection pooling; very high scale needs read replicas,
  caching (ADR 0005) and partitioning of `ratings` by month.
- Analytics and research queries go to an export (S3 + Athena) from the 1M stage, not to the
  production database.
