# 0006: Front-end hosting and the move from mocks to the API

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002

## Context

vulgis.com is a static React build on Cloudflare Pages, built from M's fork. All data comes from
`src/services/api.js` (async, mock latency) and `src/services/community.js` (synchronous,
simulated). `CLAUDE.md` §7.10 keeps all data access there so a real API can replace it. With a
backend, login cookies and the API should sit on the same site as the pages.

## Options considered

1. **Stay on Cloudflare Pages**, API at `api.vulgis.com` on AWS. No hosting change now; but two
   providers, cross-site cookies/CORS, and two places to secure.
2. **S3 + CloudFront on AWS**, with `/api/*` routed by CloudFront to API Gateway on the same
   domain. One origin (first-party cookies, no CORS), WAF in front of both. CloudFront flat-rate
   plans (aws.amazon.com/cloudfront/pricing, retrieved 2026-11-16): Free $0 (1M requests, 100GB),
   **Pro $15/month** (10M requests, 50TB), Business $200 (125M requests), Premium $1,000 (500M
   requests); all include WAF, DDoS protection and Route 53 DNS, with no overage charges.
3. **AWS Amplify Hosting.** Simple Git-connected hosting; less control over routing and WAF.

## Decision (proposed)

**S3 + CloudFront (flat-rate Pro plan to start)** when the API launches; stay on Cloudflare Pages
until then. DNS for vulgis.com moves to Route 53 (included in the plan) or stays at Cloudflare as
a pointer — to be decided with whoever holds the domain.

Migration from mocks, in order (each a separate pull request):

1. Add an API client module behind `services/` (`fetch` with credentials, error handling) and a
   build-time switch `VITE_DATA_SOURCE=mock|api`, so the prototype keeps working.
2. Make `community.js` reads asynchronous (today they are synchronous; `CLAUDE.md` §5 notes a real
   backend needs this). Components already handle loading states via `useAsync`.
3. Replace the article body page with the headline-first flow (ADR 0008); stop rendering article
   text.
4. Move persistence from localStorage `media-lens:v3` to the account; on first sign-in, offer to
   import local ratings as "practice" (they were on sample articles, so they don't count).
5. Remove the simulated community from production builds; keep it for the demo build.

## Consequences

- One provider, one domain, one WAF; cookies stay first-party.
- The Cloudflare Pages deployment and the fork-sync step (Steve's memory) retire after cut-over.
- Mobile performance budget: keep the main bundle under ~150 KB gzipped and test on a low-end
  phone profile at 390px.
