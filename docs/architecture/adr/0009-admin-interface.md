# 0009: Admin interface — approach and security

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0003 (screen list: `docs/architecture/admin-interface.md`)

## Context

Operators need to keep the headline feed healthy, handle users, reports and privacy requests,
watch integrity signals and see mission numbers, on desktop and phone. The admin area holds the
most powerful access in the system, so it is the most attractive target. Crowd-only guardrails
(ORD-0003): admins cannot edit ratings or scores, rank readers or label articles; headline
selection follows written, system-applied rules.

## Options considered

1. **Custom admin web app** (React, reusing the Vulgis design tokens) on its own subdomain with its
   own API. Full control of guardrails and audit; more work.
2. **Internal-tool builder (Retool, Appsmith) on the database.** Fast to build; per-seat costs;
   connects directly to data, making guardrails depend on tool configuration; data flows to a
   third party (for hosted versions).
3. **Library-based admin (react-admin)** inside option 1. Speeds up tables and forms; adds a
   runtime dependency (needs approval).
4. **Direct database console.** Rejected: no guardrails, no audit.

## Decision (proposed)

**Option 1**, a separate admin app and API:

- **Where it runs:** `admin.vulgis.com`, a separate static build on its own CloudFront
  distribution; a separate API Gateway API (`/admin/*`) with its own Lambda functions and database
  role. Nothing admin-related ships in the reader bundle.
- **Login:** a separate Cognito user pool for staff, no self sign-up, **MFA required** (passkey or
  authenticator app; no SMS). Short sessions (8 hours), re-authentication for destructive actions.
- **Network:** WAF on the admin distribution with rate limits; optional IP allow-list for the
  owner role.
- **Roles (least privilege):**

  | Capability | Owner | Operator | Analyst (read-only) |
  |---|---|---|---|
  | Mission dashboard (aggregates) | Yes | Yes | Yes |
  | Headline feed: hide item (fixed reasons), fix link, regroup/merge/split events | Yes | Yes | No |
  | Outlet list and feeds (add/remove) | Yes, logged and published on Methods | No | No |
  | Users: search, view activity, suspend/reinstate | Yes | Yes (reason required) | No |
  | Delete account, complete data export/deletion requests | Yes | Yes | No |
  | Integrity signals: investigate, clear, suspend | Yes | Yes | View only |
  | Settings (window length, thresholds, budget rules) | Yes, logged, published | No | No |
  | Manage admin users and roles | Yes | No | No |
  | Edit ratings or scores, rank or label articles | **No one** | **No one** | **No one** |
  | View an individual's demographics | **No one** (privacy jobs only) | No | No |

- **Guardrails enforced in the database, not only the UI:** the admin DB role has no UPDATE or
  DELETE on `ratings`, `article_stats` or `user_scores`, no SELECT on the `private` schema, and
  INSERT-only on `audit_log`.
- **Insider herding:** community scores of articles whose window is still open are hidden in the
  admin app (counts only); staff reader accounts follow the same blind rules as everyone.
- **Audit log:** every admin request that changes anything writes actor, time, action, target,
  before/after values, reason and IP to `audit_log` in the same transaction, and a copy to
  CloudWatch Logs exported to an S3 bucket with Object Lock (tamper-evident). Reads of personal
  data (opening a user's activity) are logged too.
- **Settings:** versioned rows with an effective time; the public `GET /public/settings` feeds the
  Methods page, so readers see the rules in force and their change history.
- **Bulk actions** (suspending more than 10 accounts at once, removing an outlet) require a second
  owner's approval.
- **Mobile:** the dashboard, queues and user lookup work at 390px; dense tables scroll inside their
  container, as in the reader app.

## Consequences

- More build effort than a tool builder, but the crowd-only rules are guaranteed by the system.
- Suspension excluding an account's ratings changes scores indirectly; this is allowed only through
  the published rule in ADR 0003 (decision for M and Daniel), with a public count of excluded
  accounts (transparency).
- Follow-up: incident-response runbook and an admin onboarding/offboarding checklist when built.
