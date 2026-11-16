# 0003: Account integrity (resisting fake and duplicate accounts)

**Status:** Proposed. Direction decided by M on 2026-11-16 (relayed by the coordinator): **account
creation must not be hard for real people, but the solution must minimize the risk of bots** — a
low-friction, layered approach.
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002 (Walter's open question Q9; linked to Q5, crowd diversity)

## Context

Vulgis is crowd only: nothing corrects a crowd packed with fake or duplicate accounts. One person
with many accounts can move community scores and the rank. But every step of friction loses real
readers, and the mission needs many of them. No method short of identity documents guarantees
one account per person.

## Options compared

| Method | Friction for real people | Stops | Does not stop | Cost (sources below) |
|---|---|---|---|---|
| Email only (verified by code) | Low | Typos, simplest scripts | Bulk accounts with cheap/disposable addresses | SES ~$0.10 per 1,000 emails |
| Social login (Google, Apple) | Lowest (one tap) | Most scripted sign-ups: Google/Apple already filter bots | Determined people with several Google accounts; Apple relay addresses | Included in Cognito MAU price |
| Passkeys | Low after setup | Credential stuffing, phishing, account takeover | Duplicate accounts (a person can make many) | Included (Cognito Essentials) |
| Phone (SMS code) for everyone | Medium; privacy concern; some people refuse | Cheap bulk accounts (one number each) | Bought virtual numbers; costs per SMS | SNS per-message pricing (not looked up) |
| Identity documents (e.g. Persona, ID.me, Stripe Identity) | High; heavy privacy burden | Nearly all duplicates | Little, but excludes many real readers | Typically dollars per check (not verified) |
| Invisible bot challenge (AWS WAF Challenge/CAPTCHA) | None for most people | Headless browsers and scripts | Humans running many accounts | WAF request pricing (Challenge rate not verified) |
| Behavior and risk signals | None | Bursts, rings, identical rating patterns | Patient, careful operators | Our own compute; small |

## Decision (proposed): low-friction layers, step-up only when suspicious

1. **Easy front door.** Sign in with Google or Apple, or email + one-time code (ADR 0002). Passkey
   offered after sign-up. No phone number or ID asked of normal users.
2. **Edge protection on sign-up and sign-in only:** AWS WAF (included in the CloudFront flat-rate
   plan, ADR 0006) with rate limits per IP, the **Challenge action** (an invisible browser check,
   no puzzle for most people) and, from the 100k stage, **Bot Control (common bots)** and **Account
   Creation Fraud Prevention** scoped to the sign-up path only, to keep request charges small.
   *Stops:* scripts, headless browsers, sign-up floods.
3. **Email hygiene:** verified email required; known disposable-email domains refused; one account
   per normalized email (Gmail dots and `+tags` folded). *Stops:* cheap bulk email accounts.
4. **Risk signals (server side, ADR 0009 integrity screen):** sign-up bursts by IP range/network,
   device and timing; accounts that rate the same articles with near-identical values; rating
   speed. Signals raise a **risk score** on the account; they never change a rating.
5. **Step-up verification only when the risk score is high:** an SMS code (Cognito/SNS) or a
   CAPTCHA puzzle. Normal readers never see it. *Stops:* most farms that got past layers 1–3.
6. **Trust rule for counting ratings (needs M and Daniel, because it affects which ratings make up
   the community score):** ratings from accounts with a verified email count immediately; ratings
   from accounts flagged and not yet cleared are held out of the public score until cleared;
   suspended accounts' ratings are excluded. The rule is applied by the system, never by hand, and
   published on Methods (crowd-only guardrail, ORD-0003).

Identity documents are **not** proposed for v1.

## Consequences

- Real readers sign up in under a minute on a phone; only suspicious accounts meet extra checks.
- Residual risk: a patient person running a handful of real-looking accounts. Mitigated by the
  minimum ratings per article, risk signals, and later by research on rating-pattern detection.
- Costs: WAF in the flat-rate plan at first; Bot Control $10/month per web ACL plus $1 per
  million requests after 10M free; Account Creation Fraud Prevention $10/month plus tiered
  per-request charges (aws.amazon.com/waf/pricing, retrieved 2026-11-16; the tier table did not
  load, so verify before enabling). SMS step-up charges per message (not looked up).
- Privacy: risk signals (IP, device) are personal data; keep them 90 days, then delete
  (`docs/privacy/us-privacy-and-legal-requirements.md`).
