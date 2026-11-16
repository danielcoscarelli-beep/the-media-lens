# 0008: Rating flow (headline first) and reading at the source

**Status:** Proposed. Rating flow decided by M on 2026-11-16 (relayed by the coordinator): **readers
give the blind rating (honest rating + prediction) on the headline before opening the article;
"Read at the source" comes after and reveals the outlet.** The opening method below needs approval.
**Date:** 2026-11-16
**Deciders:** M, Daniel
**Related order:** ORD-0002 (Walter's open question Q10, now answered)

## Context

v1 has no article text in Vulgis: only the headline and a link to the publisher's page. The
publisher's page shows its own name, so the outlet is revealed the moment the article is opened.
"Blind first" (`CLAUDE.md` §1.5) therefore means rating before opening. Many news sites forbid
being shown inside another site's frame (`X-Frame-Options` or `Content-Security-Policy:
frame-ancestors` headers), and framing someone else's page raises legal questions.

## Options considered — rating flow

1. **Headline first (chosen by M).** Rate the headline blind (1–100), then the prediction
   (PROP-0001, if approved), then the reveal (outlet, community score so far) and the "Read at the
   source" button. Keeps blind first; fast on phones; works for paywalled articles; every rating
   judges the same thing (the headline). Cost: the score describes the **headline**, not the full
   article; wording and Methods must say so (a change to what the score means, so Daniel must
   approve the wording).
2. **Read first, then rate.** Open the article, come back, rate it. Judges the full article, but
   the outlet is known (not blind), Vulgis can't confirm reading, paywalls block some readers, and
   tab switching on phones loses people.
3. **Hybrid (later experiment).** Headline rating blind, then an optional second "after reading"
   rating, kept as a separate number. The data model supports it (`ratings.basis`); not in v1.

## Options considered — opening the article

1. **New tab via a Vulgis redirect (`/go/{id}` → 302 to the publisher).** Works on every browser
   and phone; the publisher gets a normal visit; Vulgis records that the reader opened it.
2. **Sized pop-up window (`window.open`).** Blocked by pop-up blockers unless clicked directly;
   becomes a tab on phones anyway; no real advantage.
3. **In-app frame (iframe).** Many news sites refuse to load in a frame; looks like Vulgis
   republishing their page; legal risk. Rejected.

## Decision (proposed)

- **Flow:** headline only (no outlet, no image, no summary, no URL) → honest rating → prediction →
  reveal (outlet name and community score so far) → **"Read at [Outlet]"** button.
- **Opening:** a link to `https://vulgis.com/go/{opaque-id}` with `target="_blank"` and
  `rel="noopener"`. The API records `article_opens(user, article, opened_at)` and redirects
  (302). The publisher sees `vulgis.com` as the referrer (`Referrer-Policy: origin`).
- **Before rating, the link does not exist:** sealed responses contain no URL, so the outlet
  can't leak through the link. `/go/{id}` refuses (403) for a reader who can still rate the
  article, unless they choose **"Skip rating and read"**, which records the open and permanently
  removes the article from their rating queue (like "seen in Browse Mode" today).
- **Recorded on every rating:** `basis = 'headline_blind'` and `opened_before_rating` (always
  false under this flow; kept so other flows can be tested later).

## Consequences

- Blind first holds for everything Vulgis controls. Residual leak: a reader can paste the headline
  into a search engine to find the outlet (add to `CLAUDE.md` §8 limitations when built).
- The Methods page and the slider question change wording to "this headline" (needs Daniel).
- Publishers receive referral traffic from Vulgis, which may help future partnerships (Q6).
