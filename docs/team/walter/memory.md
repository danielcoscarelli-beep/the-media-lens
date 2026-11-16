# Walter — permanent memory

Business strategy memory for Vulgis. Read in full at the start of every session; update at the end.
Never delete history: mark superseded entries and add new ones.

_Last updated: 2026-11-16 (sessions on herding and on what the rank should measure)._

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
| 2026-11-16 | **Forecast is a separate badge, not part of the rank**; all four prediction countermeasures adopted (different format, asked second with rating locked, Forecast badge, "you expected / it was" reveal) | M | Fifth session of 2026-11-16. Written up as PROP-0001 for M's and Daniel's approval |
| 2026-11-16 | **Two questions per article accepted:** an honest rating plus a prediction of how readers will rate | M | Fourth session of 2026-11-16; enables the "surprisingly popular" design (Q8) |
| 2026-11-16 | **Crowd only.** Vulgis relies on the crowd alone: no platform-produced content (rules out calibration articles), no expert panels, no outside verdicts as the yardstick. Reason: any producer brings its own biases | M | Third session of 2026-11-16. Rules out Q8 options A, C and D |
| 2026-11-16 | **ORD-0001 paused** (On hold) | M | The two-factor rank still measures anticipation of the crowd |
| 2026-11-16 | **M's position on the rank's purpose:** the rank should recognize readers who judge an article's neutrality and factuality well, not readers who anticipate the crowd. The crowd's job is to find such articles. This reverses Daniel's 2026-11-12 decision (`CLAUDE.md` §1.4) | M (not yet agreed with Daniel) | M, second session of 2026-11-16. Walter recommends calibration articles as the measure (see Q8) and pausing ORD-0001 |
| 2026-11-16 | **Two-factor Crowd Alignment**: rank = accuracy (closeness to the crowd's final average) + ordering (same order as the crowd), standardized and combined. Issued as ORD-0001 | M (Daniel's approval pending; memo sent 2026-11-15) | Removes the reward for constant answers. Walter's caveat: it fixes hedging but **not** herding (see Q2) |

## Assumptions register

| # | Assumption | Status | Evidence / how to test |
|---|---|---|---|
| A1 | Readers will rate blind before seeing the outlet, and find that valuable | Untested | Real-user pilot: completion rate of first rating, return rate |
| A2 | A rank (Crowd Alignment) motivates sustained rating | Untested | Retention of ranked vs. unranked users |
| A3 | Rewarding agreement with the crowd's final average still yields independent, honest ratings | **Doubtful** | See open question Q2 |
| A4 | Enough readers per article can be reached within a 24-hour window | Untested | Model of traffic per article vs. required sample size (Q3) |
| A5 | Adding an ordering measure removes the reward for constant answers | Supported (simulation, old 5-point scale, 2026-11-15) | Re-run on the 1–100 slider as part of ORD-0001 |
| A6 | The two-factor rank also removes the incentive to herd | **Refuted by reasoning** (2026-11-16) | Both factors still score agreement with the crowd, so reporting the crowd's expected view beats reporting one's own whenever the two differ. Test with real users: compare rating spread of ranked vs. unranked readers |

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
   _2026-11-16 update:_ M asked whether the two-factor rank (ORD-0001) resolves this. Walter's view:
   no. It removes lazy hedging but still rewards matching the crowd, now on order as well as level.
   Blind rating protects against social influence but not against the *incentive* to guess others.
   The distortion hits readers who see themselves as atypical, which is the diversity the crowd
   needs. **Walter's recommendation (not yet decided):** phase 2 = two questions per article,
   "your rating" (feeds the community score, never scored) and "what will readers say?" (scored by
   the two-factor Crowd Alignment). That keeps Crowd Alignment as the ranking system (§1.4) while
   keeping the community score honest. It also enables the "surprisingly popular" method (Prelec,
   Seung & McCoy, Nature 2017). Costs: one extra input per article and a risk that readers anchor
   their own rating on their prediction. Decide before the backend is built, and A/B test with real
   users if possible.
3. **Q3 — What does "statistically significant" mean here, and how many ratings per article does
   it take?** Working estimate: margin of error ≈ 1.96 × SD / √n. With an assumed SD of 20 points on
   the 1–100 scale, ±5 points needs ≈ 61 ratings and ±3 points ≈ 171. Real SD is unknown until a
   pilot. Then: how many daily active raters are needed to give every article that many in 24
   hours?
4. **Q4 — Hedging.** Measured 2026-11-15: always answering 85 without reading ranks at about the
   44th percentile of the simulated cohort. A memo (2026-11-15, written for the old 5-point scale)
   proposed adding an "ordering" measure: did the reader rank articles in the same order as the
   crowd? It needs re-running on the slider before it goes to Daniel.
   _2026-11-16:_ **Decided by M; addressed by ORD-0001**, pending Daniel's approval. The slider
   re-run is part of the order.
5. **Q5 — Sample bias and manipulation.** Who rates determines the average. How to keep the crowd
   diverse (not one political side), and how to resist brigading, bots and multiple accounts?
6. **Q6 — Content and licensing.** Showing real publications' articles needs a legal approach
   (licensing, excerpts and links, partnerships). Open in `CLAUDE.md` §9.
7. **Q8 — How do we measure good judgment of neutrality and factuality without an answer key?**
   (Raised 2026-11-16 after M's position above.) Any score based on agreement with other raters
   rewards reading the crowd, whatever its formula. Options: (a) **calibration articles**: the
   platform writes paired versions of a story, one neutral and accurate, one with deliberate
   slant or factual errors, mixed into the feed and revealed afterwards; known answers by
   construction, and the reveal teaches; (b) **peer-prediction mechanisms** (Bayesian Truth Serum,
   Prelec 2004) that make honest reporting the best strategy, but need a second question and are
   hard to explain; (c) **later external evidence** (corrections, retractions, independent
   fact-checks), slow and partial; (d) **expert panel**, which conflicts with the crowd mission.
   **Walter's recommendation:** (a) as the core of the reader rank, with community scores built
   from unscored honest ratings, and later skill-weighted community scores. Tension: calibration
   items are platform-authored, so they must be clearly disclosed and never applied to real
   outlets' articles (`CLAUDE.md` §1.2). Needs Daniel.
   _Later 2026-11-16:_ **M ruled out (a), (c) and (d): crowd only.** Walter's revised
   recommendation is (b) in its "surprisingly popular" form: each reader gives an honest rating and
   a prediction of how readers will rate. The community score uses only the honest ratings. The
   reader rank (working name "Insight") rewards honest answers that turn out **more common than the
   crowd predicted** (Bayesian Truth Serum information score, Prelec 2004). Echoing the expected
   majority earns about zero, so honesty is the best strategy. Open sub-questions: accept a second
   question per article; score on the slider grouped into its five labeled bands; minimum ratings
   per article for a stable score; how to explain it simply. A fallback with one question is
   peer-consistency scoring (agreement with others on the same article minus agreement on unrelated
   articles), which penalizes constant answers but resists herding less. Implication: with crowd
   only, **who the crowd is (Q5) becomes the decisive risk**, because nothing can correct a
   one-sided crowd.
   _Design notes (2026-11-16, M asked whether readers will just project their own rating):_
   projection (the "false consensus effect") is expected and is what the method relies on:
   holders of each view over-predict it, so the scoring compares actual shares with the
   **average** prediction across all readers. A reader who copies their rating into the
   prediction loses nothing on the Insight score, but if everyone did, predictions would carry no
   information. Countermeasures: (1) ask the prediction in a **different format** from the rating,
   e.g. "What share of readers will rate this Biased or worse?" (a percentage, which also turns the
   scoring into a simple yes/no question); (2) ask it after the rating, which then locks; (3) give
   a **small reward for accurate predictions** (the BTS prediction score), either inside the rank
   with a low weight or as a separate "Forecast" badge, which is M's call because it rewards
   anticipating the crowd, though separately from the honest rating; (4) after the window closes,
   show "you expected X%, it was Y%", which teaches readers how far their bubble extends.
8. **Q7 — Who is the customer?** Readers, schools and media-literacy programs, newsrooms,
   researchers, platforms? This drives both the business model and the incentive design.

## Proposals

- PROP-0001 — Replace Crowd Alignment with an Insight rank (two questions, crowd only, Forecast
  badge). Written 2026-11-16, awaiting M's and Daniel's approval. Repository copy:
  `docs/team/proposals/PROP-0001-insight-rank.md`; working copy for comments: a claude.ai doc
  shared by M. When approved: issue an order to Steve and cancel ORD-0001.

## Development orders issued

- ORD-0001 — Two-factor Crowd Alignment (accuracy + ordering), P1, issued 2026-11-16, needs
  Daniel's approval to merge. See `docs/team/orders/README.md`.

## Session log

- 2026-11-16 — Memory created with the mission, current state and initial open questions. No
  strategy session held yet.
- 2026-11-16 — First session with M, on herding. M decided to implement the two-factor rank;
  ORD-0001 issued. Walter argued it fixes hedging but not herding (A6) and recommended a phase-2
  "predict the crowd" question (Q2). Next: M's view on phase 2; Daniel's response to the memo.
- 2026-11-16 (later) — M rejected ranking by anticipation of the crowd: the rank should reward good
  judgment of neutrality and factuality. Walter opened Q8 (measuring judgment without an answer
  key), recommended calibration articles, and recommended pausing ORD-0001 pending M's and
  Daniel's decision. Awaiting M's answer on pausing and on a proposal for Daniel.
- 2026-11-16 (later) — M paused ORD-0001 and set the crowd-only principle, ruling out calibration
  articles. Walter recommended the "surprisingly popular" two-question design (Q8) and flagged crowd
  diversity (Q5) as the decisive risk. Awaiting M's view on the second question per article.
- 2026-11-16 (later) — M accepted two questions per article and asked about projection. Walter
  explained that projection is built into the method and proposed four countermeasures (Q8 design
  notes). Open for M: whether accurate predictions earn a small part of the rank or a separate badge.
- 2026-11-16 (later) — M chose a separate Forecast badge and all four countermeasures. Walter wrote
  PROP-0001 for M's and Daniel's approval. Next: their approval; then the order to Steve. Suggested
  next topic: crowd diversity and manipulation (Q5), now the decisive risk.
