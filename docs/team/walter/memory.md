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
| 2026-11-17 | **Prototype first (Q12):** build a small, invite-only working prototype on Supabase + Cloudflare Pages before the full AWS build. ORD-0004 issued | M | Session of 2026-11-17 |
| 2026-11-16 | **Q10 decided: rate the headline blind before opening** (honest rating + prediction); "Read at the source" afterwards reveals the outlet | M | Eighth session of 2026-11-16 |
| 2026-11-16 | **Q9 decided: sign-up must be easy for people but minimize bots** (layered protection, step-up checks only when suspicious) | M | Eighth session of 2026-11-16 |
| 2026-11-16 | **Public demo keeps real outlet names; the site goes behind a login as soon as possible**, via Steve's design (no Cloudflare Access stopgap) | M | Eighth session of 2026-11-16 |
| 2026-11-16 | **US focus:** Vulgis targets the US market and US news for now | M | Seventh session of 2026-11-16 |
| 2026-11-16 | **AWS** is the cloud | M | Seventh session of 2026-11-16 |
| 2026-11-16 | **Headlines first (v1):** show headlines with a link to read the article at the source (pop-up or window); no article text stored or shown; the outlet stays hidden until the reader opens the article. Licensing later, if Vulgis grows | M | Lower legal risk (Q6) |
| 2026-11-16 | **Admin interface** to be designed and built. ORD-0003 issued (design proposal, with ORD-0002) | M | Seventh session of 2026-11-16 |
| 2026-11-16 | **Real users:** start the infrastructure for accounts, login, profiles and a database. ORD-0002 issued to Steve for an architecture proposal (ADRs) before anything is built | M | Sixth session of 2026-11-16 |
| 2026-11-16 | **Real articles:** move from sample to real articles; legal approach being researched (Q6) | M | Sixth session of 2026-11-16 |
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
   _2026-11-16 research (Walter, not legal advice; a media/IP lawyer is needed before launch):_
   - Vulgis's core feature, full text shown **without the outlet**, is the riskiest use: it is a
     full copy, and stripping author and title can be a separate US violation (DMCA §1202,
     "copyright management information").
   - US fair use is a case-by-case defense, not a permission. *AP v. Meltwater* (S.D.N.Y. 2013):
     a commercial service excerpting headlines and ledes was not fair use.
   - EU press publishers' right (DSM Directive Art. 15): only individual words and "very short
     extracts" are free; some argue even long headlines can be covered.
   - Brazil (Lei 9.610/98) has no general fair use; Art. 46 exceptions are narrow, and the STJ held
     commercial news clipping falls outside them.
   - Options: (1) **license full text** with terms that allow showing it without attribution until
     the reader has rated (Guardian Open Platform free for non-commercial use; aggregators such as
     Newstex, LexisNexis, NewsCatcher; direct deals); (2) **headline-only rating** (US: short
     phrases are generally not copyrightable; EU less clear); (3) **publisher partnerships**;
     (4) a browser-extension reader that masks branding on the publisher's own page (no copy by
     Vulgis; blindness imperfect).
   - **Immediate risk:** the public vulgis.com shows invented articles attributed to real outlets
     (AP, Fox, CNN…). Labeled as sample, but Walter recommends switching to fictional outlet names
     while the site is public. Raised with M 2026-11-16.
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
8. **Q10 — Is the v1 rating given on the headline before opening, or after reading at the source?**
   _Decided 2026-11-16 by M: before opening._
   Rating after reading means the outlet is known, which weakens "blind first" (`CLAUDE.md` §1.5).
   Walter recommends rating the headline blind first, then "Read at the source". Asked M
   2026-11-16; ORD-0002 designs for both.
   Also: selecting which headlines appear is an editorial act; prefer transparent, rule-based
   selection from a published, balanced list of US outlets (ORD-0003).
9. **Q9 — Account integrity.** _Decided 2026-11-16 by M: easy for people, minimize bots; Steve's
   ADR 0003 proposes the layers._ How hard should it be to create an account? Email only is easy to
   fake at scale; phone, passkeys or stronger verification cost friction. Crowd-only makes this a
   core business decision (link to Q5). Options to be compared in ORD-0002.
10. **Q11 — From Steve's proposal (2026-11-16), for Walter and M:** how many headlines enter
    rating per day (a cap keeps ratings per article high enough to be significant), and whether
    events carry no platform-written titles (crowd-only). Also: the community score now describes
    the headline, not the full article; the Methods wording must say so (needs Daniel).
11. **Q12 — Working prototype before the full AWS build?** (M, 2026-11-16 evening.) Walter's
    recommendation: yes. Build a small working prototype on a backend-as-a-service (Supabase:
    PostgreSQL + auth; hosted on the existing Cloudflare Pages), using the same data model as ADR
    0004 so a later move to AWS is mostly a database copy. Invite-only, behind login. Purpose:
    validate engagement and the two-question rating with real people before spending on AWS. M also
    asked why Steve's timeframes (1–2 weeks for M1, 3–4 weeks per later milestone) are so long.
    Walter's view: they read as conventional team estimates. With agents writing code, coding is
    days; the real bottlenecks are approvals, accounts and keys only M can create, a lawyer's review
    before going public, and this workspace's package-install restrictions. Awaiting M's go-ahead
    for an order.
    _2026-11-17: Decided by M; ORD-0004 issued._ Blocker found: this workspace cannot reach the
    npm registry, so nothing can be built or tested here until M allows package installs.
12. **Q13 — Competitor reference: Ground News** (researched 2026-11-17). Shows headlines and its
    own AI-written summaries, links out to the original articles, and labels **outlets** (not
    articles) with bias and factuality ratings taken from third parties (AllSides, Ad Fontes,
    Media Bias/Fact Check). It does not host full articles. It does not disclose its publisher
    arrangements. Lessons for Vulgis: headline + link-out is a proven model; its AI summaries are
    platform-authored text, which Vulgis's crowd-only and no-platform-opinion principles rule out;
    Vulgis's differentiators are blind rating of individual articles and crowd-only judgment.
13. **Q7 — Who is the customer?** Readers, schools and media-literacy programs, newsrooms,
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
- 2026-11-16 (later) — M sent PROP-0001 to Daniel. M opened two workstreams: real users (ORD-0002
  issued for an architecture proposal) and real articles (Q6 legal research summarized; lawyer
  needed; fictional outlet names recommended for the public demo). Open for M: Q9 account
  integrity, where the company and first users are, licensing vs. headline-only.
- 2026-11-16 (later) — M set US focus, AWS, headlines-first v1 and an admin interface. ORD-0002
  updated, ORD-0003 issued, Steve started on both (proposals only). Open for M: Q10 (rate the
  headline before or after reading), Q9 account integrity, fictional outlet names on the public
  demo. Q6 jurisdiction answered: US.
- 2026-11-16 (later) — M decided Q10 (rate before opening), Q9 (easy but bot-resistant) and to keep
  the demo public until Steve's login (no stopgap). Steve delivered the ORD-0002/0003 proposals
  (9 ADRs, phased plan with the login gate as M1, cost estimates). Awaiting M's and Daniel's review.
- 2026-11-16 (evening) — M asked for a working prototype before committing to a full AWS build and
  questioned the timeframes. Walter recommended a Supabase-based prototype (Q12) and explained the
  real bottlenecks. Awaiting M's go-ahead.
- 2026-11-17 — M approved the prototype; ORD-0004 issued and Steve started on P0 (setup
  checklist). Package installs are blocked in this workspace (flagged). M asked how Ground News
  sources articles; research recorded as Q13.
