# The Media Lens — Development Log

The permanent chronological record of how The Media Lens was built.

**How this log works**
- The newest entry is at the top. A new entry goes directly below this header section.
- Earlier entries are never erased or rewritten. Corrections are made by adding a new entry that
  refers to the earlier one by date and title. Fixing an obvious typo is the only in-place edit.
- Every entry has a **Status**: `Completed`, `Partially completed`, `Failed / reverted`, or
  `Proposed (not implemented)`. Anything described as future work is a proposal, not done work.
- Only files that were actually changed and tests that were actually run are recorded.
- `CLAUDE.md` describes the project as it is now. This log records how it got there.

**Entry template**

```

## YYYY-MM-DD: Short title
**Status:** Completed | Partially completed | Failed / reverted | Proposed (not implemented)
**Task / objective:** what was asked for and why
**Implementation:** what was done
**Technical explanation:** how it works (components, functions, data flow, interactions)
**Decision (if any):** what was decided, alternatives considered, and the reasoning
**Files:** created / modified / deleted, with paths
**Testing and results:** exactly what was run or checked, and what happened
**Limitations, open issues and follow-up:** known gaps; follow-ups marked as proposed
```

---

## 2026-11-16: Walter records the prototype-first question (Q12)

**Status:** Completed (documentation only)
**Task / objective:** Record M's request for a working prototype before a full AWS build, and
Walter's recommendation.
**Implementation:** Updated `docs/team/walter/memory.md` (Q12, session log).
**Technical explanation:** No code changed.
**Files:** Modified `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** No order issued yet; awaiting M's go-ahead.

---

## 2026-11-16: Record M's decisions on rating timing, sign-up and the login gate

**Status:** Completed (documentation only)
**Task / objective:** Record in Walter's memory M's decisions: rate the headline blind before
opening (Q10); easy sign-up that minimizes bots (Q9); keep the demo public until Steve's login is
built. Note the questions Steve's proposal raised for Walter (Q11).
**Implementation:** Updated `docs/team/walter/memory.md`. `collab/main` fast-forwarded to
`order/0002-0003-architecture` so the memory reflects Steve's proposal.
**Technical explanation:** No code changed.
**Files:** Modified `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** Steve's proposals await M's and Daniel's approval.

---

## 2026-11-16: Architecture proposal for accounts, database, headline ingestion and admin (ORD-0002, ORD-0003)

**Status:** Proposed (not implemented). Documentation only; no code changed, nothing built or provisioned.
**Task / objective:** Steve's proposals for ORD-0002 (accounts, login, profiles, database, headline
ingestion on AWS) and ORD-0003 (admin interface), within M's decisions: US only, AWS, headlines plus
a link to the source, an admin interface; and, decided during the work, headline-first blind rating
(Q10), low-friction layered account integrity (Q9), and a login gate as the first milestone.
**Implementation:** Wrote nine ADRs (0001–0009, all `Proposed`), the proposed target architecture
in `docs/architecture/README.md` (components, draft data model, scale path at 1k/100k/1M MAU,
monthly AWS cost estimates with assumptions and sources, phased build plan), an admin screen
list, and a US privacy and legal checklist. Updated both orders, the order index, Steve's memory
and the `CLAUDE.md` structure tree.
**Technical explanation:** Proposed stack: S3 + CloudFront (with WAF) on one domain; API Gateway
HTTP API + Lambda (Node.js, Arm); Cognito Essentials (Google, Apple, email one-time code,
passkeys); Aurora PostgreSQL Serverless v2 with demographics in a separate schema and database
roles that stop admins editing ratings; RSS ingestion through EventBridge Scheduler, Lambda and
SQS with embedding-based event grouping; a separate admin app, API and staff user pool with
required MFA and an append-only audit log. The API returns only two article shapes (sealed and
revealed) chosen by a server-side `visibilityFor()`, with a contract test for leaks. Ratings carry
`basis`, `opened_before_rating` and an optional prediction (PROP-0001).
**Decision (if any):** None accepted; every ADR awaits M's and Daniel's approval. Recommended
choices and alternatives are recorded in each ADR.
**Files:** Created `docs/architecture/adr/0001-aws-as-cloud.md`, `0002-authentication-and-login.md`,
`0003-account-integrity.md`, `0004-database.md`, `0005-api-layer.md`,
`0006-frontend-hosting-and-api-migration.md`, `0007-headline-ingestion.md`,
`0008-rating-flow-and-reading-at-source.md`, `0009-admin-interface.md`,
`docs/architecture/admin-interface.md`, `docs/privacy/us-privacy-and-legal-requirements.md`.
Modified `docs/architecture/README.md`, `docs/architecture/adr/README.md`,
`docs/team/orders/ORD-0002-accounts-and-database-architecture.md`,
`docs/team/orders/ORD-0003-admin-interface.md`, `docs/team/orders/README.md`,
`docs/team/steve/memory.md`, `CLAUDE.md` (§4 tree only), `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only). Cost totals re-added by hand. AWS
prices looked up on 2026-11-16: Cognito, API Gateway, CloudFront and WAF from AWS's pages; Lambda,
Aurora and SES from dated third-party summaries because the official pages could not be fetched.
RDS Proxy, ElastiCache, CloudWatch and other items are unpriced allowances.
**Limitations, open issues and follow-up:** Cost figures are estimates based on assumed usage.
Legal items need a lawyer (flagged in the checklist). Proposed next step: on approval, a build
order for milestone M1 (login gate, estimated 1–2 weeks).

---

## 2026-11-16: Record US focus, AWS and headlines-first decisions; issue ORD-0003 (admin interface)

**Status:** Completed (documentation only)
**Task / objective:** Record M's decisions (US market and news, AWS, v1 with headlines plus a link
to the source, an admin interface) and hand them to Steve.
**Implementation:** Updated ORD-0002's scope, issued ORD-0003 (admin interface design proposal),
updated the order index and Walter's memory.
**Technical explanation:** No code changed.
**Files:** Created `docs/team/orders/ORD-0003-admin-interface.md`. Modified
`docs/team/orders/ORD-0002-accounts-and-database-architecture.md`, `docs/team/orders/README.md`,
`docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** These decisions are M's; `CLAUDE.md` is unchanged until
Daniel agrees. Open question Q10 (rate the headline before or after reading at the source).

---

## 2026-11-16: Issue ORD-0002 (accounts and database architecture); record news-licensing research

**Status:** Completed (documentation only)
**Task / objective:** M asked to start the infrastructure for real users and to understand what
Vulgis may use from news outlets.
**Implementation:** Issued ORD-0002 (an architecture proposal for accounts, login, profiles and the
database; nothing is built until M and Daniel approve). Recorded Walter's legal research summary
(Q6), the account-integrity question (Q9) and the decisions in Walter's memory.
**Technical explanation:** No code changed.
**Files:** Created `docs/team/orders/ORD-0002-accounts-and-database-architecture.md`. Modified
`docs/team/orders/README.md`, `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** The legal summary is research, not legal advice; a
media/IP lawyer is needed before real articles are shown.

---

## 2026-11-16: Walter writes PROP-0001 (Insight rank) for approval

**Status:** Completed (documentation only; the proposal is not approved or implemented)
**Task / objective:** M asked Walter to write a proposal for M and Daniel to approve: replace Crowd
Alignment with an Insight rank based on an honest rating plus a prediction, crowd only, with a
separate Forecast badge.
**Implementation:** Added the repository copy of the proposal and recorded M's decision and the
proposal in Walter's memory. A working copy for comments was created as a claude.ai doc.
**Technical explanation:** No code changed. The proposal specifies the scoring (Bayesian Truth Serum
information score on a yes/no split at 50), the outputs, principle changes, risks and a rollout plan.
**Files:** Created `docs/team/proposals/PROP-0001-insight-rank.md`. Modified
`docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Worked-example arithmetic checked by hand. No simulation of the new method
has been run yet; the proposal lists that as rollout step 2.
**Limitations, open issues and follow-up:** Needs approval from both partners before any order is
issued. `CLAUDE.md` is unchanged until then.

---

## 2026-11-16: Record the two-question decision and prediction design notes

**Status:** Completed (documentation only)
**Task / objective:** Record M's acceptance of two questions per article and Walter's answer on
readers projecting their own rating onto the crowd.
**Implementation:** Updated `docs/team/walter/memory.md` (decision register, Q8 design notes,
session log).
**Technical explanation:** No code changed.
**Files:** Modified `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** Whether accurate predictions count toward the rank is
undecided. Daniel has not yet agreed to the change of what the rank measures.

---

## 2026-11-16: Pause ORD-0001; record the crowd-only principle

**Status:** Completed (documentation only)
**Task / objective:** M paused ORD-0001 and decided Vulgis relies on the crowd alone (no
platform-produced calibration content, expert panels or outside verdicts).
**Implementation:** ORD-0001 status set to `On hold`; `On hold` added to the order status table;
Walter's memory updated (decision register, Q8 revised recommendation, session log).
**Technical explanation:** No code changed.
**Files:** Modified `docs/team/orders/ORD-0001-two-factor-crowd-alignment.md`,
`docs/team/orders/README.md`, `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** `CLAUDE.md` is unchanged until Daniel agrees, since
the crowd-only principle and the rank's purpose affect §1.

---

## 2026-11-16: Walter session on what the reader rank should measure

**Status:** Completed (documentation only)
**Task / objective:** Record M's position that the rank should reward good judgment of an article's
neutrality and factuality, not anticipation of the crowd, and Walter's analysis of how to measure it.
**Implementation:** Updated `docs/team/walter/memory.md`: decision register (M's position, not yet
agreed with Daniel), new open question Q8 with options and a recommendation (calibration articles),
session log.
**Technical explanation:** No code changed. ORD-0001 is unchanged; Walter recommends pausing it
pending M's answer.
**Files:** Modified `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** M's position reverses Daniel's 2026-11-12 decision
(`CLAUDE.md` §1.4), so `CLAUDE.md` is not changed until both partners agree.

---

## 2026-11-16: Walter session on herding; issue ORD-0001 (two-factor Crowd Alignment)

**Status:** Completed (documentation only; the order itself is not implemented yet)
**Task / objective:** Record M's decision to implement a two-factor Crowd Alignment (accuracy +
ordering) and hand it to Steve as a development order. Record Walter's analysis of whether it also
addresses herding.
**Implementation:** Created the first development order and updated Walter's memory (decision
register, assumptions A5–A6, open questions Q2 and Q4, orders issued, session log) and the order index.
**Technical explanation:** No code changed. ORD-0001 specifies the ordering measure (pairwise order
agreement with ties counted as half), small-sample shrinkage, a standardized combination with
accuracy, and testable acceptance criteria, including constant-answer readers ranking below the 10th
percentile.
**Decision:** M decided to implement the two-factor rank (2026-11-16). It needs Daniel's approval to
merge because it changes what the rank means (`CLAUDE.md` §1.4, §9).
**Files:** Created `docs/team/orders/ORD-0001-two-factor-crowd-alignment.md`. Modified
`docs/team/orders/README.md`, `docs/team/walter/memory.md`, `DEVELOPMENT_LOG.md`.
**Testing and results:** Not applicable (documentation only).
**Limitations, open issues and follow-up:** Walter's view is that the two-factor rank fixes hedging
but not herding; a phase-2 "predict the crowd" question is proposed in Q2 and not yet decided.

---

## 2026-11-16: Add the Walter (strategy) and Steve (development) agents with permanent memory

**Status:** Completed
**Task / objective:** M asked for two agents to support development on M's side of the partnership:
**Walter**, a senior business strategist who questions assumptions and develops the business model,
incentives and dynamics (legal form, for-profit or not, still undecided), and **Steve**, a developer
who takes development orders from Walter, documents at corporate standards and builds toward a
platform for millions of users on AWS or Azure, optimized for desktop and mobile. Both need
permanent memory.
**Implementation:** Added two agent definitions, one memory file per agent, a development-order
system for the Walter → Steve hand-off, and an architecture folder for ADRs. Updated `CLAUDE.md`
§4 and §11 to describe them. No application code changed.
**Technical explanation:** Claude Code loads agent definitions from `.claude/agents/*.md` (YAML
front matter with `name`, `description`, `model`, then the instructions). Agents cannot call each
other, so Walter writes orders as files in `docs/team/orders/` and Steve reads them; each order
carries a status, acceptance criteria and Steve's record of the work. "Permanent memory" is a
Markdown file per agent that the agent reads at the start of a session and updates, commits and
pushes at the end, because the cloud workspace is wiped between sessions. Walter's memory was
seeded with the mission, the decision history from `CLAUDE.md` and this log, an assumptions
register and seven open questions; Steve's with the current technical state, deployment setup and
environment quirks.
**Decision:** Steve works alongside Daniel's `media-lens-developer` agent and follows its rules
rather than replacing it (M's choice, 2026-11-16). The agents live in this repository, delivered by
pull request for Daniel's approval, rather than only in M's fork (M's choice), so they load in any
session on the project and Daniel can see decisions and orders. Alternatives: account-level skills
(not tied to the repo and unable to hold memory) and fork-only files (would drift from Daniel's repo).
**Files:**
- Created: `.claude/agents/walter.md`, `.claude/agents/steve.md`, `docs/team/README.md`,
  `docs/team/walter/memory.md`, `docs/team/steve/memory.md`, `docs/team/orders/README.md`,
  `docs/architecture/README.md`, `docs/architecture/adr/README.md`
- Modified: `CLAUDE.md` (§4 project structure, §11 records table), `DEVELOPMENT_LOG.md` (this entry)
**Testing and results:** Documentation-only change. Checked that both agent files have valid front
matter (`name`, `description`, `model`) in the same format as `media-lens-developer.md`. Did not run
`npm test` or the build because no code changed. Did not invoke the agents in a new session; they
load when a session starts on a checkout that contains them.
**Limitations, open issues and follow-up:** Memory persists only when the agents commit and push.
Two people working the same memory file in parallel could produce merge conflicts. Walter's open
question Q2 (whether ranking by agreement with the crowd encourages herding) and Q4 (re-running
the hedging proposal on the 1–100 slider) are proposed next topics.

---

## 2026-11-15: Slider rating (1–100), single colored scores, and removal of sourcing and framing analysis

- **Date:** 2026-11-15
- **Status:** Completed
- **Task / objective:** Focus the product on rating and comparing articles. (1) Remove the sourcing feature. (2) Remove the framing analysis, which made the site look like it was giving its own opinion on an article’s bias. (3) Replace the five rating buttons with a 1–100 slider (100 = least biased) that starts with no value and has labeled marks: Nonbiased, Slightly biased, Biased, Very biased / Misleading, Nonfactual. (4) Show each article’s score as one average number with a color from pure gray (least biased) to pure red (most biased), with no distribution chart. (5) Remove “Readers divided”. All five are user decisions.
- **Implementation:**
  - Removed: the Source Explorer page and route, `SourceMap.jsx`, `SourceParts.jsx`, `data/sources.js`, `data/claims.js`, the article page’s Framing analysis / Sources / Facts & evidence tabs, Compare’s six-tab comparison panel and its per-column emphasis/framing/cited-sources sections, the article fields `emphasis, framing, charged, perspectives, omissions, opinionNote, sourceUses, claims, markers, intensity`, `MARKERS`, the events’ `comparison` and `date` fields, `[[highlight]]` headline markup, `shiftedSourceDate`, and the related Home, Methods, footer and mode-bar text.
  - New scale (`data/ratingScale.js`): `SCALE_MARKS`, `isValidPoints` (whole numbers 1–100), `clampPoints`, `nearestMark`, `colorForScore` (linear blend `#808080` → `#ff0000`) and `toneStyle`.
  - New components (`components/Rating.jsx`): `RatingSlider`, `ScoreBadge` (number + color swatch), `ScoreSwatch`, `YourRating`, `ScaleLegend`, `trackPct`. `DistributionBar` and `ScoreScale` are gone.
  - Stats: `summarize()` now returns only `n, sum, mean`; distribution, entropy and “divided” were removed. Bias Ratings lost its “Most divided” sort.
  - Simulated readers now give any whole number 1–100 instead of snapping to the five options.
  - Store: saved ratings of 0 (the old Nonfactual) load as 1, and the obsolete `sources` journey flag is dropped on load. The storage key is unchanged, because the stored shape didn’t change.
  - CSS: removed the `--r0…--r4` palette and rules for deleted features (193 lines, each checked against the code first); added `--score-best` / `--score-worst` tokens and slider styles, with marks staggered on two rows at phone width.
- **Technical explanation:** A native `<input type="range">` (1–100) keeps keyboard and screen-reader support. Until the reader interacts, the component holds `null`: the thumb is hidden by CSS, the readout says “Move the slider…” and Submit stays disabled. Clicking the track, clicking a labeled mark, or pressing any arrow / Home / End key sets a value; an arrow press while unset sets 50, so keyboard users get a visible starting point by their own action. Score colors are computed per score in JS and passed as the `--rc` custom property, which badges, the reveal number, swatches, spread dots and “You:” chips already read.
- **Decision:** No default slider value (user decision), to avoid anchoring ratings. Crowd Alignment math is unchanged: it already worked on numeric distances.
- **Files:** Deleted `src/pages/SourceExplorer.jsx`, `src/components/SourceMap.jsx`, `src/components/SourceParts.jsx`, `src/data/sources.js`, `src/data/claims.js`. Modified `src/App.jsx`, `src/state/router.jsx`, `src/state/store.jsx`, `src/services/api.js`, `src/services/community.js`, `src/lib/schedule.js`, `src/lib/stats.js`, `src/lib/text.js`, `src/lib/visibility.js`, `src/data/ratingScale.js`, `src/data/articles.js`, `src/data/events.js`, `src/components/Rating.jsx`, `RatingPanel.jsx`, `Cards.jsx`, `Shell.jsx`, `Mode.jsx`, `ui.jsx`, `src/pages/Article.jsx`, `Compare.jsx`, `Home.jsx`, `BiasRatings.jsx`, `Profile.jsx`, `Methods.jsx`, `src/styles.css`, `tests/unit/rating-system.test.mjs`, `tests/e2e/rating-flow.e2e.cjs`, `CLAUDE.md`, `README.md`, `.claude/agents/media-lens-developer.md`, `DEVELOPMENT_LOG.md`.
- **Testing and results:**
  - The session couldn’t install npm packages, so the build used a stand-in: esbuild 0.28 with the machine’s React 19.2 (the project pins React 18.3.1 and Vite), followed by the project’s own `scripts/inline.mjs`. Before any change, the same stand-in build of `main` passed 81/82 E2E checks; the only failure was the Google Fonts request, which the sandbox blocks.
  - `npm test`: 16/16 pass, including new tests for the scale, nearest mark, the gray-to-red color, and continuous simulated ratings.
  - E2E (`tests/e2e/rating-flow.e2e.cjs`, rewritten for the slider): 103/104 pass. The one failure is again the blocked font request; a separate scan of every page found no other browser errors. New checks cover: slider 1–100 with five marks; no starting value; Submit disabled until set; five ways of setting a value (mark click, typing, arrow key while unset, mark then arrows, Nonfactual mark) giving 100, 83, 50, 37 and 1; the stored value; the shown score equalling the mean recomputed in Node with the app’s own modules on the page’s timeline; the score color matching `colorForScore`; no distribution chart; no analysis tabs; the Source Explorer page gone; the Compare page with no panel or sources. The leak scan still covers every page.
  - The TypeScript checker found no undefined names, and its unused-import findings were fixed.
  - Re-measured hedging on the new scale: always answering 75 now ranks at about the 24th percentile (it was about the 49th on the old scale), and always 85 at about the 44th. The Methods page and CLAUDE.md now use the 85 figure.
  - Screenshots reviewed: sealed article (desktop), reveal, Compare, slider at 390 px (labels staggered, no horizontal overflow), and the Methods legend.
- **Limitations, open issues and follow-up:**
  - Not yet built with the project’s real toolchain (Vite + React 18.3.1). Run `npm install && npm test && npm run build:single && node tests/e2e/rating-flow.e2e.cjs` before publishing.
  - Without a distribution, an average hides disagreement (disclosed on Methods).
  - Simulated ratings above 100 are clamped, so about a fifth of simulated ratings are exactly 100.

## 2026-11-15: Temporary rename to Vulgis

- **Date:** 2026-11-15
- **Status:** Completed (not build-tested; see Testing)
- **Task / objective:** Rename the product and prototype, for now, to **Vulgis** (the user owns vulgis.com) so it can be published under that name.
- **Implementation:** Replaced every user-visible "The Media Lens" with "Vulgis": the page `<title>` (`index.html` and the single-file build head in `scripts/inline.mjs`), the header and footer wordmarks and the home-link `aria-label` (`src/components/Shell.jsx`), the footer disclaimer, the fact-check callout (`src/pages/Article.jsx`) and two Methods page sentences (`src/pages/Methods.jsx`). Code comments, the README title and CLAUDE.md now use the new name.
- **Technical explanation:** Text-only changes. The old wordmark set "The" in italics through `.brand-the`; "Vulgis" has no article, so both wordmarks are now a single word, and the `.brand-the` CSS rule is unused but kept for an easy revert.
- **Decision:** Internal identifiers are deliberately unchanged: the repo name, the npm package name, the `media-lens:*` localStorage keys (changing them would reset every visitor's ratings and timeline), the build file names and the developer agent name. The rename is temporary, and none of these are visible to users.
- **Files:** `index.html`, `scripts/inline.mjs`, `src/components/Shell.jsx`, `src/pages/Article.jsx`, `src/pages/Methods.jsx`, `src/data/publications.js`, `src/lib/alignment.js`, `src/styles.css`, `README.md`, `CLAUDE.md`, `DEVELOPMENT_LOG.md`.
- **Testing and results:** `npm ci` failed because the session had no access to the npm registry, so `npm test`, `npm run build` and the E2E test were **not run**. A grep confirmed that no user-visible "Media Lens" text remains in `src/`, `index.html` or `scripts/`.
- **Limitations, open issues and follow-up:** Run `npm test`, `npm run build:single` and the E2E test before publishing. The published claude.ai artifact still shows the old name until it is rebuilt and republished.

## 2026-11-12: Reset the timeline and add three new hypothetical news events

**Status:** Completed

**Task / objective:** The user asked to rerun the prototype with the latest updates, reset the
timers, and add new hypothetical articles.

**Implementation:**
- **New sample content:** three new events, each covered by four outlets (12 new lighter-profile
  articles):
  - `grid-heat` (Climate): a grid operator’s emergency appeal during record heat. Reuters, Fox, NYT,
    Bloomberg.
  - `transit-strike` (Economy): a regional transit strike. NPR, WSJ, Guardian, CNN.
  - `ai-hiring` (Technology): a state bill requiring bias audits of AI hiring tools. AP, WSJ, CNN,
    Politico.
- The agencies, union and bill sponsor are fictional. Framing deliberately varies within outlets:
  - Fox is loaded on the grid story but was neutral on the Fed and water stories;
  - CNN is neutral on the strike but loaded on AI hiring;
  - the Guardian is loaded on the strike;
  - the WSJ is loaded on AI hiring and mild on the strike.
- Added 14 sources and 7 claims for the new events, plus article text (2 paragraphs each, never
  naming the outlet) and hand-written comparison summaries.
- **Schedule** (`EVENT_OFFSET_HOURS`): `grid-heat` opens 6h before the first visit, so about 18h are
  left at the start; `transit-strike` publishes at +20h and `ai-hiring` at +34h. The library now
  lasts about 58 hours.
- **Timer reset:** bumped the storage keys (`media-lens:clock:v1` → `v2`, `media-lens:v2` → `v3`).
  Every browser, including ones that had already opened the prototype, now starts a fresh timeline
  with no previous ratings, Browse sessions or walkthrough progress. The stored shape is unchanged.
- **Bug fix:** on Home, the “Recent results” score badges overflowed their 116px column and overlapped
  the outlet name. The bug was introduced in the 2026-11-10 redesign. Feed rows with a score badge
  now use an auto-width column with a 150px minimum, and the rating count moved into the text line.
- **Tests:** the E2E test now also checks the new Fox grid article for leaks on new page states, and
  checks the scheduled publication of the transit (+20h) and AI-hiring (+34h) articles.

**Technical explanation:** Each browser’s timeline starts from an `epoch` saved in localStorage the
first time the app runs. Changing the key name makes the app look for a key that doesn’t exist yet,
so it creates a new epoch from the current time. That’s a reset for everyone, with no code needed to
delete old data. The ratings key was bumped at the same time, so ratings made on the old timeline
don’t point at articles that are now scheduled differently. New articles plug into the existing
system through their data fields: an opaque `id`, a `ref`, `crowd` parameters for the simulation,
and a `BODIES[ref]` text. The simulation, visibility rules, search and rankings picked them up with
no code changes.

**Decision:** I added events rather than replacing the existing ones. This keeps the fully annotated
featured event and the closed-at-start events that show the reveal immediately, and it lengthens the
library, which addresses the limitation that permanent ranks were hard to reach.

**Files:**
- Created: none
- Modified:
  - `src/data/events.js`, `src/data/articles.js`, `src/data/articleBodies.js`,
    `src/data/sources.js`, `src/data/claims.js`
  - `src/lib/schedule.js`, `src/lib/clock.js`, `src/state/store.jsx`
  - `src/pages/Home.jsx`, `src/styles.css`
  - `tests/e2e/rating-flow.e2e.cjs`
  - `CLAUDE.md`, `DEVELOPMENT_LOG.md`
- Deleted: none

**Testing and results:**
- **Data validation script:** 42 articles and 10 events; no duplicate ids; every source and claim
  id resolves; every article has text; no article text contains an outlet name.
- **Simulated counts for the new articles:** 116–178 ratings each, so all are eligible for Crowd
  Alignment. Final averages range from 45 (Fox grid) to 93 (AP AI hiring).
- `npm test`: 14/14 passed. `npm run build:single`: succeeded.
- **E2E: 82/82 passed.** The 75 earlier checks plus:
  - leak scans on `#explore-grid`, `#compare-grid-heat`, the Fox grid article and
    `#sources-grid-heat`;
  - the transit article unpublished at the start and open after +24h;
  - the AI-hiring article still unpublished after +24h.
- **Screenshots:** the Home page at the start of the timeline shows the new grid articles in the
  lists (Climate: 2 events). The fixed “Recent results” layout was checked, with no horizontal
  scroll at 390px.
- **Not verified:** the +34h AI-hiring publication in a browser (the unit-level schedule logic is
  the same code path); Safari and Firefox.

**Limitations, open issues and follow-up:**
- Resetting by bumping keys leaves the old values in browser storage, unused.
- New events are lighter-profile, like the earlier non-featured ones: generic `perspectives`
  defaults and short bodies.
- *Proposed:* the decision on real articles (headline plus lede excerpt) is still open.

---

## 2026-11-12: Apply the user’s decisions on the rating redesign

**Status:** Completed

**Task / objective:** The user answered the nine open design questions from the 2026-11-10 plan.
Seven confirm what was already built:
- ratings can’t be changed;
- the demo timeline;
- the thresholds;
- analysis hidden until rating;
- articles open during Browse Mode can never be rated;
- old saved data discarded;
- small automated tests.

Three needed changes:
1. **Abandon the “majority isn’t accuracy” framing** and treat Crowd Alignment as *the* ranking
   system.
2. **Replace the editorial rank names** (“too on the nose”) with a conventional-sounding ladder.
3. **Make it explicit that entering Browse Mode forfeits rating** for the day.

**Implementation:**
- Rank tiers in `src/lib/alignment.js` are now Bronze (0), Silver (20), Gold (40), Platinum (60),
  Diamond (75), Master (90) and Grandmaster (97). The percentile boundaries are unchanged.
- Removed the Profile callout saying Crowd Alignment “doesn’t measure whether you were right” and
  replaced it with a plain description. Removed the Methods limitation “Crowd Alignment rewards
  predicting the crowd, not being right”, and reworded the Methods introduction so Crowd Alignment
  is presented as the platform’s ranking system.
- **Decision:** two Methods limitations were kept because they describe how the mechanics actually
  behave, not a stance:
  - “A community score is not a fact-check”, which concerns the score, not the ranking;
  - “Hedging toward the middle is rewarded”, which is a measured weakness of the formula.
- The Browse Mode dialog title is now “Forfeit rating for the rest of today?”, and it states that
  unrated open articles are forfeited.
- Updated:
  - `CLAUDE.md`: principle 4 rewritten as “Crowd Alignment is the ranking system”, rule 5, the §5
    tier list and the §8 hedging note;
  - agent rule 5;
  - the unit test’s tier names.

**Technical explanation:** Tier names are data in the `TIERS` array. The Profile ladder, the
navigation chip, the Methods table and the rank text all read from it, so renaming them there
updated every page. Nothing about the scoring, percentiles or thresholds changed.

**Files:**
- Created: none
- Modified: `src/lib/alignment.js`, `src/pages/Profile.jsx`, `src/pages/Methods.jsx`,
  `src/components/Mode.jsx`, `tests/unit/rating-system.test.mjs`, `CLAUDE.md`,
  `.claude/agents/media-lens-developer.md`, `DEVELOPMENT_LOG.md`
- Deleted: none

**Testing and results:**
- `npm test`: 14/14 passed, including the renamed tier boundaries.
- `npm run build:single`: succeeded.
- E2E: 75/75 passed.
- Screenshots reviewed: the forfeit dialog; and, after +24h on the demo clock with five ratings, the
  Profile showed “Gold (provisional), 49th percentile, 10.7 percentile points to Platinum”.
- A grep confirmed that no old rank names or “doesn’t measure whether you were right” wording
  remain in `src/`, `CLAUDE.md` or the agent file.

**Limitations, open issues and follow-up:**
- The 2026-11-10 entry above describes the old names and framing. It is historical and was
  intentionally not rewritten.
- *Proposed (not implemented):* how to use real articles without republishing them. Options were
  discussed with the user on 2026-11-12: headline plus a short lede excerpt for blind rating,
  licensing, and openly licensed sources. No decision has been made.

---

## 2026-11-10: Redesign the rating system (blind five-point ratings, 24-hour windows, Browse Mode, Crowd Alignment)

**Status:** Completed. All front-end behavior is implemented and tested. Multi-user behavior is
**simulated**: there is no backend.

**Task / objective:** Replace the four-level, written-reasoning rating system and reasoning-based
reputation with:
1. a five-option scale (100 / 75 / 50 / 25 / 0 points);
2. community scores as arithmetic means out of 100;
3. blind rating, with outlet, sources and community results revealed only after submitting;
4. 24-hour rating windows with countdowns;
5. Rating Mode and Browse Mode (3 ratings per day to unlock Browse; then locked until the next day);
6. a Crowd Alignment score (distance from the final average of everyone else);
7. percentile-based ranks.

All affected pages were to be updated, and the Methods page was to disclose the limitations.

**Decisions** (the plan was presented first; the user asked to proceed, so my recommended defaults
were used):
- *Article text:* sample bodies were written for all 30 articles: about 6 paragraphs for the 6
  featured articles and 2 for the rest. Readers need text to judge blind. No body names its outlet.
- *Principle changed:* “agreement with the majority is not accuracy” was replaced with “Crowd
  Alignment measures prediction of consensus, not correctness” (CLAUDE.md §1).
- *Ratings are final once submitted.* Allowing changes after the reveal would let people copy the
  crowd.
- *Demo timeline:* articles are published relative to the reader’s first visit, and labeled Demo
  controls (+1h / +6h / +24h, restart) sit on the Methods page. Real 24-hour windows based on the old
  fixed October dates would all have been closed.
- *Thresholds:* an article counts only with ≥20 other ratings; a provisional rank at 5 eligible
  evaluations, permanent at 15; shrinkage weight K = 5. The reasoning is on the Methods page.
- *Rank names:* Reader, Contributor, Analyst, Correspondent, Senior Correspondent, Editor, Fellow
  (percentile boundaries 0 / 20 / 40 / 60 / 75 / 90 / 97).
- *Analysis is hidden until you rate:* framing analysis and facts & evidence are revealed with the
  sources.
- *Browse Mode spoils later ratings:* any article that was open during a Browse session can never
  be rated by that reader afterwards.
- *Saved data reset:* old v1 data (four-level ratings with text) is ignored, not migrated. The 3
  seeded sample ratings were removed.
- *Article ids are now opaque* (`kxfv` instead of `ap-permitting`), so URLs don’t reveal outlets.
- *One visibility module:* every component asks `vis(article)`, so the hiding rule is defined once.
- *Tests:* unit tests use Node’s built-in test runner (no new dependencies). A browser E2E script
  uses the container’s preinstalled Playwright and is not a project dependency.

**Implementation:**
- **New:**
  - `lib/clock.js`: app time = real time + demo offset; timeline epoch.
  - `lib/schedule.js`: publication times, 24-hour windows, shifted source dates.
  - `lib/visibility.js`: the sealed / revealed / canRate rule.
  - `lib/modes.js`: Rating/Browse Mode rules.
  - `lib/alignment.js`: Crowd Alignment, cohort, percentiles, tiers.
  - `data/ratingScale.js`: the five options and their points.
  - `data/articleBodies.js`: article text.
  - `services/community.js`: 300 simulated participants with time-stamped ratings.
  - Components: `RatingPanel.jsx` (rating, reveal, results), `Mode.jsx` (mode bar and confirmation
    dialog), `Status.jsx` (countdowns, status badges, sealed publication), `DemoControls.jsx`.
  - Tests: `tests/unit/rating-system.test.mjs`, `tests/e2e/rating-flow.e2e.cjs`.
- **Rewritten:**
  - `state/store.jsx`: v2 storage, ratings, browse sessions, app time, `vis`, alignment.
  - `lib/stats.js`, `lib/format.js`, `services/api.js` (blind-safe search, publication and status
    filters), `components/Rating.jsx`, `components/Cards.jsx`.
  - Pages: Article, Home, BiasRatings, Profile, Methods, Compare (top half; the comparison tables
    were kept).
- **Updated:**
  - `Explore`: status and time filters, blind-safe filtering and sorting.
  - `SourceExplorer`: revealed articles only.
  - `SourceParts`: the drawer lists revealed articles only, with shifted dates.
  - `Shell`: rank chip and banner copy.
  - `App`: adds the ModeBar.
  - `data/articles.js`: opaque ids, `ref`, `crowd` parameters, removed dates and old community data.
  - `data/user.js`, `events.js` (comment), `styles.css` (five-step `--r0…--r4` ramp in both themes,
    new components, phone layouts).
- **Removed:** `components/EvaluationPanel.jsx`, `lib/reputation.js`, `data/community.js`. Reason
  chips, typed explanations, the reasoning-quality preview, "helpful" marks and the activity feed of
  written notes are gone.
- **Docs:** `CLAUDE.md` §1–§9 rewritten; README; agent rule 5.

**Technical explanation:**
- **Time and windows.** Everything time-based reads one clock (`clock.now()`). An article’s window
  is computed from its scheduled `opensAt`, so open or closed is a pure calculation on timestamps
  and can’t drift on refresh. The store re-renders exactly when any window opens or closes, at local
  midnight and after demo-clock changes. Countdowns tick every second on their own.
- **Blind hiding.** `visibilityFor()` combines window status, mode, your rating and your Browse
  sessions into `sealed` / `revealed` / `canRate`. Each page renders outlet, byline, links, sources,
  analysis and scores only if revealed. Search excludes outlet and byline text from matching for
  sealed articles; publication filters drop them; publication sort groups them separately. Compare’s
  hand-written summaries, which name outlets, stay locked until every article in the event is
  revealed.
- **Community numbers.** The simulated community generates each participant’s rating from the
  article’s `crowd` parameters plus that participant’s own noise and lean (fixed seeds, so the
  results repeat exactly), and gives each rating a moment in the window. `communityAt()` returns
  what had been submitted by a given time, plus your rating. `finalOthers()` never includes yours.
- **Crowd Alignment.** For each closed article with ≥20 other ratings: error = |your points − mean
  of the others|. Your average error is shrunk toward the cohort’s average (K = 5), then
  score = 100 − adjusted error. The percentile is computed among simulated participants, who are
  scored by the same rule using leave-one-out means plus a simulated prior record.
- **Reveal.** `useReveal()` steps through 5 stages over about 3 seconds: lock-in, score count-up,
  distribution, publication, analysis. The Article page uses the stage to hold back the masthead and
  tabs, so the reveal reads as one sequence. The animation is skipped under reduced motion.

**Files:**
- Created:
  - `src/lib/clock.js`, `src/lib/schedule.js`, `src/lib/visibility.js`, `src/lib/modes.js`,
    `src/lib/alignment.js`
  - `src/data/ratingScale.js`, `src/data/articleBodies.js`
  - `src/services/community.js`
  - `src/components/RatingPanel.jsx`, `src/components/Mode.jsx`, `src/components/Status.jsx`,
    `src/components/DemoControls.jsx`
  - `tests/unit/rating-system.test.mjs`, `tests/e2e/rating-flow.e2e.cjs`
- Modified:
  - `package.json` (adds the `test` script)
  - `src/App.jsx`, `src/state/store.jsx`, `src/services/api.js`
  - `src/lib/stats.js`, `src/lib/format.js`
  - `src/data/articles.js`, `src/data/events.js`, `src/data/user.js`
  - `src/components/Rating.jsx`, `src/components/Cards.jsx`, `src/components/Shell.jsx`,
    `src/components/SourceParts.jsx`
  - `src/pages/Home.jsx`, `src/pages/Explore.jsx`, `src/pages/Compare.jsx`, `src/pages/Article.jsx`,
    `src/pages/BiasRatings.jsx`, `src/pages/SourceExplorer.jsx`, `src/pages/Profile.jsx`,
    `src/pages/Methods.jsx`
  - `src/styles.css`
  - `CLAUDE.md`, `README.md`, `.claude/agents/media-lens-developer.md`, `DEVELOPMENT_LOG.md`
- Deleted: `src/components/EvaluationPanel.jsx`, `src/lib/reputation.js`, `src/data/community.js`

**Testing and results:**
- `npm test`: **14/14 passed.** Covered:
  - the five point values and nearest-category boundaries (87.5, 62.5, 37.5, 12.5);
  - means, including 81.25 for 100/100/75/50, and leave-one-out means;
  - window boundaries to the millisecond (opensAt − 1 upcoming, opensAt open, closesAt − 1 open,
    closesAt closed) and the starting schedule;
  - live counts growing over the window;
  - the local-midnight day boundary;
  - the Browse rule (2 ratings: refused; 3: allowed; locked after entering; free the next day);
  - seen-in-browse;
  - the full visibility matrix;
  - tier boundaries, shrinkage and percentile ties;
  - your own rating never moving the comparison average, and the 20-rating cutoff (`bbg-chips`);
  - rank status at 4, 5, 14 and 15 eligible;
  - a careful predictor (>80th percentile) outranking a contrarian (<5th).
- `npm run build` / `npm run build:single`: succeeded (JS about 362 kB, 112 kB gzipped).
- `node tests/e2e/rating-flow.e2e.cjs` (headless Chromium, served over local HTTP): **75/75
  passed.** Covered:
  - an app-wide **leak scan** on 16 page states while the AP and Fox permitting articles were
    sealed, checking visible text, `title`, `aria-label`, `href` and `alt` for the outlet name,
    byline and a source title used only by that article, plus each card containing a sealed headline
    for any outlet name, score or external link;
  - the publication filter;
  - the sealed article page (text visible, 5 options, submit disabled until a choice, no tabs, no
    score);
  - the countdown ticking;
  - all five options submitted on five articles, each checking that the shown score equals the mean
    computed from the shown distribution, the count includes you, the publication is revealed and
    the sources tab unlocks;
  - ratings being final;
  - Browse Mode: locked below 3; confirmation cancel and confirm; survives a reload; no rating form;
    queue paused;
  - after +24h on the demo clock: closed status, final scores, back to Rating Mode on the new day,
    a provisional rank with 5 eligible ratings, distances in the history;
  - no horizontal scroll at 390px on 7 pages;
  - the dark theme;
  - restart timeline clearing ratings;
  - no page or console errors.
- **Failures found and fixed during testing:**
  1. *Bug:* right after submitting, the reveal left out your own rating for up to 15 seconds,
     because the store’s clock lagged behind the rating’s timestamp. Fixed with `clock.notify()` on
     submit.
  2. The first leak scan reported false positives, because it scanned the page’s embedded
     JavaScript bundle. Scripts and styles were excluded.
  3. A test selector clicked “Slightly Biased” when it meant “Biased”. It now selects by value.
  4. Visual review showed an oversized cohort chart with a clipped label, clipped ladder rungs, and
     an ambiguous “76 final” badge text. All three were fixed.
- **Measured weakness (not fixed, disclosed):** answering 75 on every article scores at about the
  49th percentile of the simulated cohort. An earlier, noisier simulation put it at the 98th; the
  simulated participants were made more consistent, which is also more realistic.
- **Not verified:**
  - behavior across real devices or users (impossible without a backend);
  - Safari and Firefox (only Chromium was tested);
  - screen-reader announcements;
  - waiting through real 24-hour windows (demo-clock jumps were used instead);
  - time zones other than the container’s.

**Limitations, open issues and follow-up:** See `CLAUDE.md` §8 and §9. The main points:
- the rules can be bypassed in the browser;
- the simulated cohort;
- the hedging weakness;
- the mixed scale;
- imperfect blindness (in-text attributions, writing style);
- the demo library runs out after about 2 days.

*Proposed:*
- a constant-answer baseline for Crowd Alignment;
- splitting bias and accuracy into separate questions;
- a server-backed ratings API;
- more sample articles, so permanent ranks are easier to reach.

---

## 2026-11-10: Connect the project to GitHub

**Status:** Completed

**Task / objective:** Back the project up off the temporary cloud container by connecting it to the
user's GitHub repository `danielcoscarelli-beep/the-media-lens`.

**Implementation:**
- Attached the repository to the Claude Code session with push access, and cloned it to
  `/home/user/the-media-lens`. The repository was empty: no commits, only `.git`.
- Fetched the existing local commit `c71082c` from `/home/user/media-lens`, reset the new clone's
  `main` to it, and pushed with `git push -u origin main`.
- Installed dependencies (`npm ci`) and built (`npm run build:single`) in the new folder. Refreshed
  the ignored root `the-media-lens.html` copy from the build.
- Updated `CLAUDE.md`:
  - §3: GitHub URL and remote;
  - §4: tree root renamed to `the-media-lens/`;
  - §8: removed the "no remote" limitation;
  - §10: repository name, checkout path, push-after-each-task workflow, ask before force-pushing.
- Updated the agent's "Start of every session" step 3 to check for unpushed work and to commit and
  push after each task.

**Technical explanation:** A "remote" is a copy of the repository hosted elsewhere. Here it is
GitHub, named `origin`. Pushing uploads commits to it. `-u` makes local `main` "track"
`origin/main`, so `git status` reports when local work hasn't been pushed. Because the GitHub
repository was empty, the existing history was moved in unchanged: the commit hash `c71082c` is the
same locally and on GitHub. No history was rewritten.

**Decision:** The working copy moved from `/home/user/media-lens` to `/home/user/the-media-lens`,
the folder the session tooling registers for this repository, so future cloud sessions find the
project at the same path. The old folder was left in place and not deleted. It is superseded and
should not be used.

**Files:**
- Created: none tracked (the local clone folder and generated build output are untracked or ignored)
- Modified: `CLAUDE.md`, `.claude/agents/media-lens-developer.md`, `DEVELOPMENT_LOG.md`
- Deleted: none

**Testing and results:**
- After the first push, `git rev-parse HEAD` and `git ls-remote origin refs/heads/main` both
  returned `c71082c990efadb7d2c33eee63830440640934f5`, so GitHub matches the local copy.
- `npm ci` and `npm run build:single` succeeded in the new folder.
- `git status` showed a clean tree after the build, confirming the build outputs are ignored.
- This entry's own commit and push are verified in the same way after it is written.

**Limitations, open issues and follow-up:**
- `the-media-lens.html` (the published claude.ai artifact build) is intentionally not on GitHub.
  Regenerate it with `npm run build:single`.
- *Proposed:* the rating-system redesign is still waiting for the user's answers to the ten design
  questions.

---

## 2026-11-10: Put the project under git version control (local repository)

**Status:** Completed. The local repository exists. Pushing to GitHub was not possible (see Limitations).

**Task / objective:** Save the project to git so changes are tracked and can be undone, before the
planned rating-system redesign, which will touch most files.

**Implementation:**
- Added `.gitignore`.
- Ran `git init -b main`, staged every project file and made the first commit on branch `main`.
- Updated `CLAUDE.md` §3, §8 and §10, which previously said the project was not under git, and added
  a git workflow note to §10.

**Technical explanation:**
- Git keeps a history of snapshots ("commits") of the project in a hidden `.git` folder, so any
  earlier state can be inspected or restored.
- `.gitignore` lists files git should not track:
  - `node_modules/`: 43 MB of downloaded libraries, recreated with `npm install` (or `npm ci`) from
    `package-lock.json`;
  - build output: `dist/`, `dist-single/` and the root `the-media-lens.html`, recreated with
    `npm run build:single`;
  - OS and log clutter.
- Tracking only source files keeps the history small and avoids conflicts in generated files.
- The commit is signed by the container's configured git identity (`Claude`).

**Decision:**
- *Generated build files are not committed.* They can be rebuilt exactly from the source.
  Trade-off: someone who clones the repository must run a build to get the single-file HTML.
- *The user's personal email is not used as the commit author.* Commits use the container's existing
  git identity.

**Files:**
- Created: `.gitignore` (and the `.git/` repository folder)
- Modified: `CLAUDE.md`, `DEVELOPMENT_LOG.md`
- Deleted: none

**Testing and results:**
- `git status --short` after staging listed 44 files: all source, configuration and documentation.
  `git check-ignore -v` confirmed that `node_modules`, `dist`, `dist-single` and
  `the-media-lens.html` are ignored.
- Rebuild check: copied only the git-tracked files into an empty scratch folder, then ran `npm ci`
  and `vite build` there. The build succeeded (JS 319.75 kB, CSS 54.51 kB), so the repository alone
  is enough to reproduce the site.
- After committing: confirmed the commit with `git log`, and that `git status` was clean.
- No application code changed, so no browser tests were run.

**Limitations, open issues and follow-up:**
- **Not pushed anywhere.** `gh auth status` reported that the container's GitHub token is invalid,
  and no GitHub repository is attached to this session. The repository exists only inside this
  temporary cloud container. *Proposed:* the user creates an empty GitHub repository; it is attached
  to the session and `main` is pushed.
- The rating-system redesign plan (five-point scale, blind rating, 24-hour windows, Browse Mode,
  Crowd Alignment ranking) was presented to the user on 2026-11-10. It is **Proposed (not
  implemented)** and waiting for the user's answers to ten design questions.

---

## 2026-11-10: Expand the developer agent with explanation, logging and reporting duties

**Status:** Completed

**Task / objective:** Extend the existing `media-lens-developer` agent and `CLAUDE.md` so that every
development task produces a technical explanation, a permanent log entry and a standard
six-heading end-of-task report, under explicit accuracy rules. The website itself was not to change.

**Implementation:**
- Added sections to `.claude/agents/media-lens-developer.md`, keeping all existing content:
  - "What counts as a development task";
  - "Technical explanations" (explain before significant changes; explain after every task);
  - "Development log" (entry fields, status values, newest-first, no rewriting, decision notes,
    failed attempts);
  - "Accuracy and accountability";
  - "End-of-task report" (the six required headings).
- Also in the agent file: added step 4 to "Start of every session" (read recent log entries), and
  two items to "Definition of done" (log entry added; report given).
- Added to `CLAUDE.md`, keeping all existing content: the `DEVELOPMENT_LOG.md` line in the §4 file
  tree, rule 14 in §7, and a new §11 "Documentation, development log and reporting".
- Created this file with its header, template and three entries. The two entries below this one are
  retroactive: they were written on 2026-11-10 from the record of the earlier work in this Claude
  Code session.

**Technical explanation:** Claude Code loads `CLAUDE.md` automatically at the start of every session
in the project folder, so the logging and reporting rules apply even without the agent. The agent
file's YAML frontmatter (`name`, `description`, `model`) is unchanged, so the agent keeps the same
name and is started the same way (`claude --agent media-lens-developer`). Only its instruction text
grew. No application code, data, styles or build files were touched.

**Decision:** The log is append-only (newest first), and corrections are new entries rather than
edits. This keeps the history trustworthy: a reader can see what was believed at each point and
when it changed. `CLAUDE.md` stays editable in place because its job is to describe the present.

**Files:**
- Created: `DEVELOPMENT_LOG.md`
- Modified: `.claude/agents/media-lens-developer.md`, `CLAUDE.md`
- Deleted: none

**Testing and results:**
- Ran `find . -newer the-media-lens.html -type f -not -path './node_modules/*'` before creating this
  log. Only `CLAUDE.md` and `.claude/agents/media-lens-developer.md` were listed. Nothing under
  `src/`, `scripts/`, `index.html`, `package.json` or `vite.config.js` changed.
- Parsed the agent file's frontmatter with a Node one-liner. It is still valid, with keys `name`,
  `description` and `model`.
- Listed section headings with `grep`. All new sections are present in both files, and every
  original section is still there.
- Not run: `npm run build` and browser tests, because no application code changed (and building would
  regenerate `dist/`). Not verified: how a future Claude session interprets the new instructions; that
  can only be seen in use.

**Limitations, open issues and follow-up:**
- The project is still not under git, and the cloud container is temporary. *Proposed:* initialize
  git and push to a GitHub repository so the code, `CLAUDE.md`, the agent and this log persist.
- The rules depend on the agent following its instructions. Nothing enforces them automatically.
  *Proposed (optional):* a Claude Code hook that reminds the agent to update the log at the end of a
  task.

---

## 2026-11-10: Create the project reference (CLAUDE.md) and the developer agent

**Status:** Completed (retroactive entry)

**Task / objective:** Give the project persistent instructions and a dedicated Claude Code agent,
without changing the website.

**Implementation:**
- Inspected the codebase. Confirmed that no source file had changed since the 2026-11-01 build, and
  confirmed versions (React 18.3.1, Vite 5.4.11, @vitejs/plugin-react 4.3.4) and data counts.
- Wrote `CLAUDE.md`, covering:
  - vision and product principles;
  - working, simulated and planned features;
  - stack and commands;
  - file structure;
  - routing, state, data access, data model and the reputation model;
  - design language;
  - change rules;
  - known limitations;
  - undecided questions;
  - environment notes.
- Wrote `.claude/agents/media-lens-developer.md`, defining the primary-developer role,
  responsibilities, working rules, explanation style and definition of done.

**Technical explanation:** `CLAUDE.md` is read automatically by Claude Code in this project. The agent
file is a Markdown file with YAML frontmatter (`name: media-lens-developer`, `model: inherit`, no
`tools` restriction, so all tools are available) followed by its system instructions.

**Files:**
- Created: `CLAUDE.md`, `.claude/agents/media-lens-developer.md`
- Modified: none
- Deleted: none

**Testing and results:**
- Confirmed with `find -newer` that only these two files were added.
- Confirmed that the installed Claude Code CLI supports `--agent <agent>` (`claude --help`).

**Limitations, open issues and follow-up:** Inspection found these issues in the existing app. They
are recorded in `CLAUDE.md` §8 and were not fixed:
- Some Home page values are hard-coded (for example the 6 / 15 / 13 featured stats).
- The language-intensity index is hand-entered, not computed.
- The Profile settings form shows stale values after "Reset demo data".

*Proposed:* put the project under git.

---

## 2026-11-01: Build the initial prototype

**Status:** Completed (retroactive entry)

**Task / objective:** Build a polished, interactive front-end prototype of The Media Lens using local
sample data and no backend. It covers navigation and search, the homepage, news exploration,
comparative coverage analysis, community bias evaluation, the reputation system, the source
explorer, fact and evidence analysis, and user profiles. It demonstrates the full nine-step user
journey on one event.

**Implementation:**
- Vite + React project in `/home/user/media-lens`.
- Sample data:
  - 12 publications;
  - 7 events, including the featured fictional "Federal Permitting Modernization Act", with 6 fully
    annotated articles from AP, Reuters, WSJ, NYT, Fox and CNN;
  - 30 articles, 35 sources, 25 claims;
  - a seeded community feed and 3 seeded profile evaluations.
- Eight pages: Home, Explore, Compare (index and event), Article, Bias Ratings, Source Explorer,
  Profile, Methods.
- Shared components: navigation shell, cards, rating charts, evaluation panel, source drawer, claim
  card, SVG source maps and generated illustrations.
- Single-file build script (`scripts/inline.mjs`). The single-file output was published as a
  claude.ai artifact: https://claude.ai/artifact/C4wwgv2iJE9KyyPAETrWPQ

**Technical explanation:**
- **Routing:** a hand-written hash router (`#page-param`).
- **State:** a React context with `useReducer`, persisted to `localStorage` (`media-lens:v1`).
- **Data access:** a mock async service (`services/api.js`) with artificial latency, so loading states
  are exercised.
- **Ratings:** community aggregates are the seeded counts plus the user's own rating
  (`lib/stats.js`).
- **Reputation:** a simulated model (`lib/reputation.js`) weights reasoning quality 40%, consistency
  25%, framing detection 20% and participation 15%, and majority agreement 0%. It shrinks toward a
  prior until 10 evaluations.
- **Styling:** one CSS file with design tokens, light and dark themes, and breakpoints at 1080, 900
  and 760px.

**Decision:**
- *No router or state library.* A hand-written hash router was used because the claude.ai artifact
  host only passes plain `#name` hashes (letters, digits, hyphens), and the app needed few routes.
- *Runtime dependencies limited to React and react-dom* to keep the single-file build small and
  simple.
- *Ratings attach to headlines, never outlets.* Sample content deliberately varies within outlets so
  the prototype doesn't encode reputation-based bias labels.
- *Claims get sourcing statuses instead of true/false verdicts*, so the app never implies that sample
  claims were fact-checked.

**Files:**
- Created: `package.json`, `package-lock.json`, `index.html`, `vite.config.js`,
  `scripts/inline.mjs`, `README.md`, all files under `src/`, and the generated outputs `dist/`,
  `dist-single/` and `the-media-lens.html`.
- Modified: none
- Deleted: none

**Testing and results:**
- `vite build` succeeded.
- A Playwright script ran the full journey in headless Chromium:
  - Search "permitting bill" returned 6 articles in 1 event. The publication filter and empty state
    worked.
  - The compare page showed 6 columns, and all six comparison tabs opened. The source drawer opened.
  - The article's Sources and Facts tabs opened (4 claims shown).
  - Submitting an evaluation updated the community counts. Credibility went from 61 to 65 and the
    toast appeared.
  - The profile showed 4 evaluations. A username edit saved.
  - Bias Ratings, Source Explorer and Methods loaded. The walkthrough showed 9/9.
- No page errors or console errors were recorded.
- *Failure found and fixed:* the mobile article page (390px) overflowed horizontally by 175px. The
  cause was grid columns sizing to their content. The fix added
  `grid-template-columns: minmax(0, 1fr)` to `.article-main` and several other grids. A re-test showed
  0px overflow on Home, Compare, Article, Profile and Ratings at 390px.
- Screenshots of desktop, mobile and dark mode were reviewed by eye.

**Limitations, open issues and follow-up:** See `CLAUDE.md` §2 and §8. In short:
- all content and community data are simulated;
- there is no backend, authentication or real news API;
- there are no automated tests in the repository (the Playwright script lived in a temporary
  scratch folder and is not part of the project);
- the reputation model is heuristic.
