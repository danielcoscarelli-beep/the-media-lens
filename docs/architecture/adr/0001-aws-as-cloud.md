# 0001: AWS as the cloud provider

**Status:** Proposed (the choice of AWS itself was decided by M on 2026-11-16; this ADR records it and its consequences for Daniel's approval)
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002

## Context

Vulgis is a front-end-only prototype. Real users need a backend, database and authentication
(`CLAUDE.md` §2, §7.4). The team is small, so managed services are preferred. The service targets
the US market and US news only (M, 2026-11-16). The end state must serve millions of users.

## Options considered

1. **AWS.** Broadest set of managed services (Cognito, Aurora, Lambda, CloudFront, WAF, SES); US
   regions; strong serverless tooling. Cons: pricing is complex; some services (Cognito, API
   Gateway) are AWS-specific.
2. **Azure.** Comparable services (Entra External ID, Azure Database for PostgreSQL, Functions).
   No clear advantage for this product; the team has no Azure-specific need.
3. **A platform-as-a-service** (e.g. Vercel/Supabase/Cloudflare Workers + a hosted Postgres).
   Fastest to start; less control over security, compliance and costs at millions of users.

## Decision

**AWS** (M's decision, 2026-11-16). Proposed conventions:

- **Primary region:** `us-east-1` (N. Virginia): every service used here is available there, and
  most price quotes refer to it. Backups copied to `us-west-2` from the 100k-user stage (DR).
- **Accounts:** AWS Organizations with separate accounts for `prod`, `staging` and a `shared`
  account (logs, CI). Root user locked away with hardware MFA; people sign in through IAM Identity
  Center with MFA.
- **Baseline security services:** CloudTrail (all regions, to a locked S3 bucket), GuardDuty,
  AWS Config basic rules, KMS encryption at rest everywhere, Secrets Manager for credentials,
  AWS Budgets alerts from day one.
- **Infrastructure as code:** AWS CDK in JavaScript/TypeScript (same language as the app) or
  Terraform. Recommendation: **CDK**, because the team already writes JavaScript; Terraform is the
  alternative if multi-cloud ever matters. Nothing is created by hand in the console.
- **CI/CD:** GitHub Actions with OpenID Connect into AWS (no long-lived keys), deploying to
  `staging` on merge to `main` and to `prod` on an approved release.

## Consequences

- Easier: one provider for hosting, data, identity, email and security; one bill; US data residency.
- Lock-in, deliberately limited:
  - **Portable:** the database is plain PostgreSQL; the API is plain Node.js handlers; the front
    end is static files.
  - **Hard to move:** Cognito user pools (users can be exported, but sessions and passkeys would
    need re-enrolment) and API Gateway configuration. Choosing passwordless and social login
    (ADR 0002) means no password hashes are trapped in Cognito.
- The current Cloudflare Pages hosting of vulgis.com moves to AWS when the API launches (ADR 0006).
- Follow-up: a cost-alert budget and a named owner for the AWS account before anything is created.
