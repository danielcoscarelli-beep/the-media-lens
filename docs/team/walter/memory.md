# Walter — permanent memory

Business strategy memory for Vulgis. Read in full at the start of every session; update at the end.
Never delete history: mark superseded entries and add new ones.

_Last updated: 2026-11-16 (created)._

## Mission (from M, 2026-11-16)

Regardless of for-profit status, the mission of Vulgis is to achieve a level of user engagement
that provides **statistical significance to the crowd rating**, with a **user incentive structure
that genuinely promotes the Wisdom of the Crowd**.

## The venture

- **Partners:** M (GitHub `mcoscarelli`) and Daniel (GitHub `danielcoscarelli-beep`, repository
  owner). Roles, ownership split and decision rights between them: _not yet recorded_.
- **Legal form:** for-profit or not-for-profit — **undecided**.
- **Name:** Vulgis (temporary, adopted 2026-11-15). Domain vulgis.com, live since 2026-11-15 on
  Cloudflare Pages.
- **Product today (2026-11-16):** front-end prototype, no backend. Readers rate news articles
  blind on a 1–100 slider, then see the community average, the outlet and other outlets' coverage
  of the same event. **Crowd Alignment** ranks readers by how closely their ratings anticipate the
  final community average. All content and all other "readers" are simulated. Framing analysis
  and source tracing were removed on 2026-11-15 so the platform never judges articles itself.
  See `CLAUDE.md` §1–2 for the authoritative description.

## Decision register

| Date | Decision | Decided by | Reasoning / source |
|---|---|---|---|
| 2026-11-10 | One 1–100 (originally 5-point) scale combines bias, misleading presentation and accuracy | Daniel | `CLAUDE.md` §1.2 |
| 2026-11-12 | Crowd Alignment is the ranking system; no disclaimers undermining it | Daniel | `CLAUDE.md` §1.4 |
| 2026-11-15 | Product renamed Vulgis (temporary); slider replaces 5 options; framing and sourcing features removed | Daniel | `DEVELOPMENT_LOG.md` |
| 2026-11-15 | vulgis.com hosted on Cloudflare Pages from M's fork | M | Deployment session |
| 2026-11-16 | Walter (strategy) and Steve (development) agents created; Walter issues development orders to Steve | M | This file's creation |

## Assumptions register

| # | Assumption | Status | Evidence / how to test |
|---|---|---|---|
| A1 | Readers will rate blind before seeing the outlet, and find that valuable | Untested | Real-user pilot: completion rate of first rating, return rate |
| A2 | A rank (Crowd Alignment) motivates sustained rating | Untested | Retention of ranked vs. unranked users |
| A3 | Rewarding agreement with the crowd's final average still yields independent, honest ratings | **Doubtful** | See open question Q2 |
| A4 | Enough readers per article can be reached within a 24-hour window | Untested | Model of traffic per article vs. required sample size (Q3) |

## Open questions (highest priority first)

1. **Q1 — Legal form and funding.** For-profit, non-profit, or a hybrid (e.g. public-benefit
   company, or a non-profit with an earned-revenue arm)? Depends on funding sources, independence
   from advertisers and outlets, and the partners' goals.
2. **Q2 — Does Crowd Alignment undermine the Wisdom of the Crowd?** Crowds are wise when ratings are
   independent and diverse. Ranking people by how well they *predict the crowd* invites rating what
   others will say rather than one's own judgment, which is herding. Options to examine: score each
   rating against a crowd that excludes it (already done), add a separate "predict the crowd"
   question (Bayesian Truth Serum–style), reward calibration or discrimination rather than
   closeness, or reward participation and consistency instead of agreement. Needs a decision from
   the partners because it touches `CLAUDE.md` §1.4.
3. **Q3 — What does "statistically significant" mean here, and how many ratings per article does
   it take?** Working estimate: margin of error ≈ 1.96 × SD / √n. With an assumed SD of 20 points on
   the 1–100 scale, ±5 points needs ≈ 61 ratings and ±3 points ≈ 171. Real SD is unknown until a
   pilot. Then: how many daily active raters are needed to give every article that many in 24
   hours?
4. **Q4 — Hedging.** Measured 2026-11-15: always answering 85 without reading ranks at about the
   44th percentile of the simulated cohort. A memo (2026-11-15, written for the old 5-point scale)
   proposed adding an "ordering" measure: did the reader rank articles in the same order as the
   crowd? It needs re-running on the slider before it goes to Daniel.
5. **Q5 — Sample bias and manipulation.** Who rates determines the average. How to keep the crowd
   diverse (not one political side), and how to resist brigading, bots and multiple accounts?
6. **Q6 — Content and licensing.** Showing real publications' articles needs a legal approach
   (licensing, excerpts and links, partnerships). Open in `CLAUDE.md` §9.
7. **Q7 — Who is the customer?** Readers, schools and media-literacy programs, newsrooms,
   researchers, platforms? This drives both the business model and the incentive design.

## Development orders issued

None yet. See `docs/team/orders/README.md`.

## Session log

- 2026-11-16 — Memory created with the mission, current state and initial open questions. No
  strategy session held yet.
