# Admin interface — screen list (proposed)

_Owner: Steve. Written 2026-11-16 for ORD-0003. **Proposed, not built.** Approach and security:
ADR 0009. Roles: Owner, Operator, Analyst (read-only)._

Layout: a left navigation on desktop that becomes a bottom menu on phones (390px); one task per
screen; every destructive action opens a confirmation that requires a reason chosen from a fixed
list plus optional notes, and is written to the audit log.

| # | Screen | Who | What it shows | Actions |
|---|---|---|---|---|
| 1 | **Sign in** | All staff | Staff login (separate from readers), MFA prompt | Sign in with passkey or authenticator code |
| 2 | **Mission dashboard** (home) | All | Today and 30-day trends: ratings per article vs. target (share of closed articles that reached the minimum; distribution), daily active raters, ratings per rater, prediction-question completion, new sign-ups, day-1/7/30 retention, feed health summary, open alerts | Drill into any number; no editing |
| 3 | **Headline feed** | Owner, Operator | Items ingested in the last 48h: headline, outlet, event, status (pending / in pool / excluded by rule / hidden), link status, window and rating count. Open articles show counts, never scores | Hide item (reasons: not news, broken link, duplicate, names its own outlet, breaks rules); fix URL; move to another event |
| 4 | **Events** | Owner, Operator | Events with outlets covering each, article count, pool status | Merge two events; split an event (pick articles); view history |
| 5 | **Article detail** | All (actions: Owner, Operator) | Headline, outlet, URL, event, window countdown, ratings received vs. target, opens count; community score only after the window closes | Same as feed; no score or rating editing exists |
| 6 | **Outlets and feeds** | Owner (Analyst: view) | Published outlet list with date added, feeds, last fetch, errors, items/day | Add/remove outlet (second owner approves; change published on Methods); pause a broken feed |
| 7 | **Users** | Owner, Operator | Search by email, display name or id; account: created, sign-in method, status, risk score, rating counts, recent activity timeline (opening it is logged) | Suspend / reinstate (reason), delete account, trigger step-up verification |
| 8 | **Reports** | Owner, Operator | Queue of reader reports (on headlines or display names) with status and age | Resolve, dismiss, act via screens 3 or 7 |
| 9 | **Privacy requests** | Owner, Operator | Export and deletion requests with legal deadline countdown (e.g. 45 days under CCPA) and status | Verify identity (signed-in request), run export or deletion job, record completion |
| 10 | **Integrity** | Owner, Operator (Analyst: view) | Signals: sign-up bursts by network/time, accounts with near-identical rating patterns, abnormal rating speed; clusters of linked accounts | Mark investigated / cleared; suspend (bulk >10 needs second owner); export case notes |
| 11 | **Settings** | Owner (others: view) | Current values: window length, ratings per day before Browse Mode, eligibility thresholds, minimum ratings per article, daily article budget rule, rating flow; history of changes | Propose change with effective time and reason; change is published to Methods |
| 12 | **Audit log** | Owner (Operator: own actions) | Every admin action and personal-data view, filterable by actor, action, target, date | Export (read-only; no deletion possible) |
| 13 | **Admin team** | Owner | Staff accounts, roles, MFA status, last sign-in | Invite, change role, disable (second owner for owner role) |

**Deliberately absent:** editing ratings or community scores; ranking, rewarding or labeling
readers or articles by hand; writing event titles or summaries; viewing any individual's
demographics; choosing individual headlines for the pool (only hiding by fixed reasons).
