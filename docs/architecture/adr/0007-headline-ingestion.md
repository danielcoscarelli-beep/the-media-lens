# 0007: Headline ingestion and event grouping

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002, ORD-0003

## Context

v1 shows real US headlines with a link to the article at its source; Vulgis stores and shows the
headline and URL, **never the article text** (M, 2026-11-16). Choosing which headlines appear is an
editorial act, so selection must follow published rules applied by the system (Walter, ORD-0003).
Statistical significance limits volume: with ~61 ratings needed per article for ±5 points (Walter's
Q3 working estimate), 1,000 readers rating 3 a day can support only ~50 articles a day.

## Options considered

1. **Publishers' RSS/Atom feeds** from a fixed, published list of US outlets. Free; provided by
   publishers for exactly this (headline + link); we choose the list transparently. Cons: feed
   formats vary; some feeds are partial or carry terms of use that must be checked.
2. **A commercial headlines API** (e.g. NewsAPI, NewsCatcher, Event Registry). One format, some
   offer event clustering. Cons: cost and licence terms (not priced here); their source selection
   is opaque, which conflicts with transparent selection.
3. **GDELT** (free, global event data). Broad; noisy, delayed, and not built for a curated list.
4. **Scraping news sites or aggregators.** Rejected: terms of service and legal risk.

## Decision (proposed)

**RSS/Atom from a published outlet list**, with a commercial API kept as a later fallback.

- **Pipeline:** EventBridge Scheduler (every 10 minutes) → *fetch* Lambda (conditional GET with
  ETag/Last-Modified, honest User-Agent, respects robots.txt) → SQS → *normalize* Lambda →
  PostgreSQL. Dead-letter queue and a feed-health alarm.
- **Stored per item:** outlet, headline (as published), canonical URL, publisher's publication
  time, byline only if in the feed, feed GUID. **Not stored:** description/summary, body text,
  images.
- **Outlet-name leaks:** headlines with a trailing " - Outlet" are trimmed of that suffix (it is
  feed metadata, not the headline); headlines that name their own outlet in the text (e.g. "AP
  Explains") are **excluded by rule**, not rewritten.
- **Event grouping:** headlines from the last 36 hours are compared using text embeddings (a small
  embedding model, e.g. Amazon Bedrock Titan Text Embeddings; cost negligible at ~1,000
  headlines/day, not priced) plus named entities and time; clusters covered by **at least 3
  outlets** become events. Admins can merge or split events; each action is logged (ADR 0009).
- **Event titles:** none written by the platform. The event is shown as the set of headlines, or
  with machine-extracted key terms. (A written title would be platform-authored content; Walter
  to confirm.)
- **Selection rule (proposal for Walter and M):** each day, the events covered by the most outlets
  on the list enter the rating pool until the **daily article budget** is reached; the budget is
  computed automatically from recent active raters so each article can reach the minimum ratings.
  All headlines from listed outlets in a selected event enter. The rule and the outlet list are
  published on Methods.
- **Allocation:** a reader's queue favors articles with the fewest ratings so far (rule-based), so
  ratings spread evenly across the pool.
- **Link health:** a scheduled check of URLs; broken links flagged to admins.
- **Rating window:** opens when the article enters the pool (`opens_at`), not at the publisher's
  publication time; length from settings (24h today).

## Consequences

- Costs are negligible (a few Lambda invocations per minute).
- The outlet list is the main editorial lever; changing it is an owner-only action, logged and
  published with a date (ADR 0009).
- Legal: headlines plus links carry far less risk than full text, but not zero (*AP v. Meltwater*,
  Walter's Q6 notes); feed terms must be reviewed per outlet by a lawyer before launch.
- Paywalls: some outlets' articles cannot be read without a subscription; with headline-first
  rating (ADR 0008) this does not block rating.
