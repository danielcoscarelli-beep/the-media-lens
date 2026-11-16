# 0005: API layer and server-side rules

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002

## Context

Today every rule runs in the browser and can be bypassed (`CLAUDE.md` §8): rating windows, the
daily Rating/Browse Mode rule, blind hiding. With real users the **server** must enforce them,
using the server clock. The API must never send a reader an article's outlet, byline, URL or
community score before that reader has rated it (blind first, `CLAUDE.md` §1.5).

## Options considered

1. **API Gateway (HTTP API) + AWS Lambda (Node.js, Arm).** Pay per request, scales to zero and to
   millions, no servers. Price: HTTP API $1.00 per million requests for the first 300 million,
   $0.90 after (aws.amazon.com/api-gateway/pricing, retrieved 2026-11-16); Lambda $0.20 per
   million requests and $0.0000133334 per GB-second on Arm, with 1M requests and 400,000 GB-s free
   each month (cloudburn.io, 2026-10-12). Cons: cold starts, database connection pooling.
2. **Containers on ECS Fargate behind a load balancer.** Steady cost (always running), no cold
   starts, simpler DB pooling. Cheaper only at sustained high traffic.
3. **AppSync (GraphQL).** Flexible queries; harder to guarantee that sealed articles never expose
   hidden fields; more AWS-specific.

## Decision (proposed)

**API Gateway HTTP API + Lambda (Node.js 22, Arm)**, written so the same handlers can later run in
a container on Fargate if cost or latency at the 1M stage favors it.

- **Language:** TypeScript for the backend is recommended (types make "a sealed article has no
  outlet field" a compile-time check). This is a new language in the project, so it needs
  Daniel's approval; plain JavaScript with JSDoc checks is the fallback.
- **Shared rules:** the pure rule modules (`visibility`, `modes`, `alignment`/Insight, scale) move
  to a shared package used by both front end and API, so both apply identical rules. This is a
  folder restructure (`CLAUDE.md` §7.4) and is part of the build order, not this proposal.
- **Blind-first contract:** two response shapes only. `SealedArticle` = opaque id, headline, event
  id, window times and status. `RevealedArticle` adds outlet, byline, URL and community score.
  The serializer picks the shape from the server-side `visibilityFor()`; an automated contract
  test scans every endpoint's responses for sealed articles and fails on any outlet name, domain,
  byline or score.
- **Opaque ids:** random, non-sequential ids (e.g. 10 characters base32) so articles can't be
  enumerated or matched to outlets.
- **Server clock:** windows (`opens_at`, `closes_at` = `opens_at` + window length setting) and
  statuses computed from the database clock. The demo clock exists only in a non-production demo
  environment.
- **Daily rules:** "local day" uses the time zone saved on the account at sign-up; changes are
  limited (once per 7 days) so the day boundary can't be gamed. Browse sessions and the
  3-ratings rule are checked in the same transaction that writes a rating.
- **Rating submission:** one transaction checks `canRate`, inserts the rating (unique per user,
  article and basis), and updates `article_stats` (n, sum, sum of squares). The prediction
  (PROP-0001, if approved) is a second call that is accepted only after the rating; the reveal is
  returned only after both are in (or the prediction is skipped, if the partners allow skipping).
- **Caching:** the sealed list of open articles is identical for everyone, so it is served
  through CloudFront with a 60-second cache; personal data (my ratings, reveals) is never cached
  at the edge. From the 1M stage, ElastiCache (Valkey) holds hot counters and rate limits.
- **Rate limits:** per account and per IP (WAF + API Gateway throttling).
- **Endpoints (draft):** `GET /feed`, `GET /articles/{id}`, `POST /articles/{id}/rating`,
  `POST /articles/{id}/prediction`, `GET /go/{id}` (read at the source, ADR 0008), `GET /events/{id}`,
  `GET /me`, `PATCH /me`, `GET /me/ratings`, `POST /me/browse`, `GET /me/export`,
  `DELETE /me`, `GET /public/settings` (rules shown on Methods). Admin API is separate (ADR 0009).
- **Observability:** structured JSON logs to CloudWatch (no personal data beyond user id), X-Ray
  tracing, alarms on errors, latency and database load.

## Consequences

- Rules become enforceable; blind hiding no longer depends on the browser.
- Lambda costs stay small (~$27/month at 100k MAU, ~$325 at 1M under the stated assumptions);
  API Gateway ~$37 and ~$368.
- Risks: cold starts on rarely used endpoints (mitigated by Arm, small bundles); connection limits
  (RDS Proxy/Data API).
