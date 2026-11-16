# ORD-0003: Admin interface (design proposal)

**Status:** Issued
**Priority:** P1 (urgent)
**Issued by:** Walter, agreed with M on 2026-11-16
**Source decision:** `docs/team/walter/memory.md`, Decision register, 2026-11-16 ("Admin interface")
**Needs Daniel's approval:** Yes, before it is built (it depends on the backend in ORD-0002). **This order is for the design proposal only**, delivered together with ORD-0002.

## Business objective
Running Vulgis with real users and real headlines needs an operator console: to keep the headline
feed healthy, protect the crowd from abuse, and see whether the mission is working (enough
independent ratings per article).

## User-facing outcome
Authorized team members can log in to a separate, secured admin area and manage content, users and
settings, and see the key numbers, on desktop and on a phone.

## Acceptance criteria (for the proposal)
- [ ] **Roles and access:** who can do what (e.g. owner, operator, read-only analyst), separate admin login with multi-factor authentication, and an audit log of every admin action.
- [ ] **Content operations:** review the incoming headline feed, fix broken links or wrong outlet or event grouping, merge or split events, hide an item that is not news or breaks the rules, see each article's rating window.
- [ ] **User operations:** find a user, see their activity, suspend or delete an account, act on reports, handle data-export and deletion requests.
- [ ] **Integrity monitoring:** signals of fake or coordinated accounts (bursts of sign-ups or identical ratings), with actions to investigate.
- [ ] **Mission dashboard:** ratings per article against the target for a reliable score, daily active raters, completion of the prediction question, retention.
- [ ] **Settings:** rating-window length, eligibility thresholds and similar parameters, changed only by authorized roles and logged.
- [ ] **Crowd-only guardrails:** admins cannot edit ratings or scores, rank readers, or label articles. Any rule that chooses which headlines appear is written down, applied by the system and shown on the Methods page.
- [ ] Screens sketched (wireframes or a written screen list) and the technical approach (where it runs, how it is secured) recorded in an ADR.

## Constraints
- Product principles in `CLAUDE.md` §1 and the crowd-only principle (Walter's memory, 2026-11-16).
- AWS, US market (ORD-0002).
- Don't build or provision anything yet.

## Options discussed
- Walter's caution: **choosing which headlines appear is itself an editorial act** and a source of
  bias. Prefer transparent, rule-based selection (for example, every headline from a fixed,
  published list of US outlets across the spectrum, grouped by event), with admins limited to
  operations rather than curation.

## Steve's record
- Started:
- Branch / PR:
- Development log entry:
- Verification:
- Deviations and notes:
