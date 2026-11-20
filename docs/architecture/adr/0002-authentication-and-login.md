# 0002: Authentication and login methods

**Status:** Proposed
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002 (account integrity layers: ADR 0003)

## Context

Readers must register and log in on desktop and mobile web, keep a profile, and have their ratings
on any device. Account creation must be easy for real people (M, 2026-11-16) and resistant to bots
(ADR 0003). Passwords are the weakest and highest-support option. Admin login is separate
(ADR 0009).

## Options considered

1. **Amazon Cognito user pools, Essentials plan.** Managed sign-up/sign-in, email one-time codes
   (passwordless), passkeys, Google and Apple sign-in, hosted "managed login" pages, JWT tokens.
   Price (aws.amazon.com/cognito/pricing, retrieved 2026-11-16): first 10,000 monthly active users
   (MAU) free, then **$0.015 per MAU**. A user counts as active in a month in which they sign in or
   refresh a session; inactive registered users cost nothing.
2. **Cognito Lite plan.** Cheaper (from the same page: $0.0055 per MAU for the first 90,000 billable
   MAU, then $0.0046), but the page lists **passkeys only for Essentials and Plus**. Password-based.
3. **Cognito Plus.** $0.020 per MAU, no free tier; adds threat protection (risk-based adaptive
   authentication, compromised-credential checks).
4. **Third-party identity (Auth0, Clerk, Stytch).** Polished; usually more expensive per MAU at
   scale (not priced for this ADR); data leaves AWS.
5. **Self-built auth** in the API (WebAuthn and email codes with open-source libraries). Cheapest
   at a million users; the team carries all security risk. Not for launch.

## Decision (proposed)

**Cognito Essentials**, one user pool for readers, with:

- **Sign in with Google** and **Sign in with Apple** (one tap on phones; Apple is expected by
  iPhone users).
- **Email with a one-time code** (passwordless; no password to forget or leak).
- **Passkeys** offered right after the first sign-in ("Sign in faster next time") — optional.
- No passwords and no SMS login. Phone verification is used only as a step-up check (ADR 0003).
- Sessions: short-lived access token (1 hour) and a refresh token (30 days), kept in an
  **HttpOnly, Secure, SameSite=Lax cookie on vulgis.com** set by the API, never in localStorage,
  so page scripts cannot read them.
- **Minimum age** asked neutrally at sign-up (see `docs/privacy/us-privacy-and-legal-requirements.md`).
- Cognito's user `sub` is the only link between Cognito and the database's `users` table.

## Consequences

- Cost is the main issue at scale: about **$1,350/month at 100k MAU** and **$14,850/month at 1M
  MAU** on Essentials (see `docs/architecture/README.md`). Review at ~200k MAU: options are
  negotiating with AWS, Lite plus self-built passkeys, or self-built auth.
- Easier: no password storage, resets or breaches; strong phishing resistance with passkeys.
- Harder: Apple sign-in needs an Apple Developer account ($99/year, not verified here) and its
  "Hide My Email" relay addresses (one person can create several). Account-integrity layers
  (ADR 0003) handle duplicates; login methods alone do not.
- Reversible: users can be exported and re-invited to another provider; passkeys would need
  re-enrolment.
