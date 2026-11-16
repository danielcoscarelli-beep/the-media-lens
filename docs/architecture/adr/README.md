# Architecture Decision Records

An ADR records one significant technical decision: its context, the options considered, what was
decided and the consequences. Once accepted, an ADR is never edited except to mark it superseded;
a later ADR replaces it. Files are numbered `NNNN-short-title.md`.

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-aws-as-cloud.md) | AWS as the cloud provider | Proposed | 2026-11-16 |
| [0002](0002-authentication-and-login.md) | Authentication and login methods | Proposed | 2026-11-16 |
| [0003](0003-account-integrity.md) | Account integrity (fake and duplicate accounts) | Proposed | 2026-11-16 |
| [0004](0004-database.md) | Database: PostgreSQL on Aurora Serverless v2 | Proposed | 2026-11-16 |
| [0005](0005-api-layer.md) | API layer and server-side rules | Proposed | 2026-11-16 |
| [0006](0006-frontend-hosting-and-api-migration.md) | Front-end hosting and the move from mocks to the API | Proposed | 2026-11-16 |
| [0007](0007-headline-ingestion.md) | Headline ingestion and event grouping | Proposed | 2026-11-16 |
| [0008](0008-rating-flow-and-reading-at-source.md) | Rating flow (headline first) and reading at the source | Proposed | 2026-11-16 |
| [0009](0009-admin-interface.md) | Admin interface: approach and security | Proposed | 2026-11-16 |

Status values: `Proposed`, `Accepted`, `Rejected`, `Superseded by NNNN`.

## Template

```markdown
# NNNN: Title

**Status:** Proposed
**Date:** YYYY-MM-DD
**Deciders:** M, Daniel
**Related order:** ORD-NNNN (if any)

## Context
The problem, forces and constraints (scale, cost, AWS/Azure portability, privacy, team skills).

## Options considered
1. Option A: pros, cons, rough cost
2. Option B: pros, cons, rough cost

## Decision
What was chosen and why.

## Consequences
What becomes easier or harder, risks, follow-up work, how to reverse it.
```
