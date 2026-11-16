# Development orders

Development orders are how **Walter** (business strategy) hands work to **Steve** (development).
Each order is one file, `ORD-NNNN-short-title.md`, numbered in sequence and never reused.

## Status values

| Status | Meaning | Set by |
|---|---|---|
| `Draft` | Being written; not ready for Steve | Walter |
| `Issued` | Agreed with M; Steve may start | Walter |
| `Needs clarification` | Steve has questions in the file | Steve |
| `In progress` | Steve is working on it | Steve |
| `Awaiting approval` | Built or proposed; waiting for Daniel's PR review or decision | Steve |
| `Done` | Acceptance criteria met, verified and merged | Steve |
| `Blocked` | Cannot proceed; reason in the file | Steve |
| `On hold` | Paused by M or Walter; Steve must not start or continue; reason in the file | Walter or M |
| `Cancelled` | No longer wanted; reason in the file | Walter or M |

## Index

| Order | Title | Priority | Status | Issued | PR |
|---|---|---|---|---|---|
| [ORD-0001](ORD-0001-two-factor-crowd-alignment.md) | Two-factor Crowd Alignment (accuracy + ordering) | P1 | **On hold** (paused by M, 2026-11-16) | 2026-11-16 | |
| [ORD-0002](ORD-0002-accounts-and-database-architecture.md) | Architecture proposal: accounts, login, profiles, database (proposal only) | P1 | Issued | 2026-11-16 | |

## Template

Copy this into a new `ORD-NNNN-short-title.md` and add a row to the index.

```markdown
# ORD-NNNN: Short title

**Status:** Draft
**Priority:** P1 (urgent) | P2 (next) | P3 (later)
**Issued by:** Walter, agreed with M on YYYY-MM-DD
**Source decision:** link or reference to the decision in docs/team/walter/memory.md
**Needs Daniel's approval:** Yes / No (why)

## Business objective
Why this matters for the mission (engagement, statistical significance, Wisdom of the Crowd) or the business.

## User-facing outcome
What a reader, partner or operator will be able to do or see afterward.

## Acceptance criteria
- [ ] Checkable criterion
- [ ] Checkable criterion

## Constraints
Product principles (CLAUDE.md §1), budget, timeline, platforms (desktop and mobile), anything not to change.

## Options discussed
Approaches Walter and M considered, if any. Steve chooses the implementation.

## Steve's record
- Started:
- Branch / PR:
- Development log entry:
- Verification:
- Deviations and notes:
```
