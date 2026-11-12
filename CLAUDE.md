# The Media Lens — project reference

This is the permanent reference for anyone (human or Claude) working on this codebase.
The code is the source of truth. If this file and the code disagree, trust the code and update this file.

---

## 1. Purpose and vision

The Media Lens is a **media-literacy platform**, not a news aggregator. It helps people become more
discerning news consumers by letting them:

- **rate articles blind**, judging the headline and text before learning the outlet, its sources or other readers’ views;
- compare how different publications cover **the same event**, side by side;
- examine **framing and wording** (charged language, emphasis, perspectives, omissions, labeling);
- trace claims back to their **original sources** and see when many outlets rely on one origin;
- examine the **factual basis** of claims without the platform pretending to have fact-checked them;
- see **community scores** (the average of readers’ ratings) and how their own ratings compare;
- earn a **Crowd Alignment** rank for how well they anticipate the community’s eventual judgment.

Core principles (these are product rules, not just preferences — see §7):

1. **Rate articles, never outlets.** No publication gets a fixed bias label.
2. **Keep factual accuracy, framing and opinion distinguishable.** The five-point community scale deliberately combines bias, misleading presentation and factual accuracy (user decision, 2026-11-10). It must always be presented as *community perception*, never as a fact-check, and the article analysis keeps the dimensions separate.
3. **No invented fact-check verdicts.** Claims get a *sourcing status*, not a true/false ruling.
4. **Crowd Alignment is the ranking system.** Readers are ranked by how closely their ratings anticipate each article’s final community average. (User decision, 2026-11-12: the earlier “agreement with the majority is not accuracy” stance is abandoned. Don’t add disclaimers that undermine Crowd Alignment; the Methods page keeps factual limitations of community scores and the hedging weakness.)
5. **Blind first.** Before you rate an open article, nothing may reveal its outlet, byline, sources, analysis or community result — anywhere in the app.
6. **Repetition is not corroboration.** Several outlets citing one source = one source.
7. **Institutional prestige ≠ correctness** of any individual claim.
8. **Demographics are optional, private, and never used to judge rank or predict beliefs.**
9. **Sample and simulated content is always clearly labeled.** Never imply ratings are shared between real users.

---

## 2. Current status: what is real, what is simulated, what is planned

| Status | What |
|---|---|
| **Working (front-end, verified by unit tests and a browser E2E test)** | All 8 pages and navigation; blind five-option rating with staged reveal; 24-hour rating windows with live countdowns; Rating Mode / Browse Mode with the 3-ratings rule and next-day lock; app-wide hiding of outlet/byline/sources/analysis/scores for sealed articles; community scores out of 100 with 5-step distributions; Crowd Alignment with leave-one-out averages, eligibility threshold, shrinkage, percentiles and ranks; search/filter/sort (blind-safe); comparison views; source maps; claim cards; profile editing; local persistence across reloads; responsive layout; light and dark themes. |
| **Prototype / simulated** | All news content and article text (hypothetical). The publication schedule (relative to your first visit). 300 simulated participants, their ratings, timestamps and prior track records (`services/community.js`). The ranking cohort. The live activity count. A demo clock offset (Demo controls on the Methods page). Language-intensity values (hand-assigned). Trending sparkline values. Loading delays. |
| **Not built (planned only)** | Real news API, authentication, database/backend, real multi-user ratings, server-enforced windows and daily limits, moderation, editorial review of annotations, the aggregate demographic research view (opt-in checkbox exists only), safeguards against “always answer the middle” strategies in Crowd Alignment. |

There is **no backend**. Everything runs in the browser. Your own ratings are real but stored only in this browser; they are never shared.

---

## 3. Tech stack and dependencies

- **React 18.3.1** + **react-dom 18.3.1** (function components and hooks, plain JavaScript/JSX — no TypeScript).
- **Vite 5.4.11** with **@vitejs/plugin-react 4.3.4** (dev server and build). `vite.config.js` sets `base: './'` so the build works from any path.
- **No other runtime libraries.** No router library, no state library, no CSS framework, no chart library. Routing, state, charts and the source map are hand-written.
- **Fonts:** Google Fonts — Source Serif 4 (headlines, article text), IBM Plex Sans (UI/body), IBM Plex Mono (numbers/data). Loaded via `<link>` in `index.html` and in `scripts/inline.mjs`, with system fallbacks in CSS.
- **Tests:** unit tests with Node’s built-in runner (`npm test`, no extra dependencies) and a browser end-to-end script (`tests/e2e/rating-flow.e2e.cjs`) that uses the Playwright + Chromium preinstalled in the cloud container (Playwright is *not* a project dependency). No linter, formatter or CI. (Some files contain `// eslint-disable-next-line` comments, but ESLint is not installed.)
- **Git / GitHub:** git repository on branch `main`, pushed to GitHub at **https://github.com/danielcoscarelli-beep/the-media-lens** (remote `origin`, since 2026-11-10). See §10. `.gitignore` excludes `node_modules/`, `dist/`, `dist-single/` and the root `the-media-lens.html` (all regenerable).

### Commands

```bash
npm install            # install dependencies
npm run dev            # dev server with hot reload (Vite prints the URL/port)
npm test               # unit tests (tests/unit/*.test.mjs)
npm run build          # production build → dist/
npm run build:single   # build + inline everything into dist-single/
npm run preview        # serve dist/ locally
node tests/e2e/rating-flow.e2e.cjs [screenshotDir]   # browser E2E (run build:single first)
```

`npm run build:single` runs `scripts/inline.mjs`, which writes:
- `dist-single/index.html` — a complete, self-contained HTML document (opens from disk).
- `dist-single/the-media-lens.html` — the same app without `<!doctype>/<html>/<head>/<body>`, for hosts that supply their own document skeleton (used for the published claude.ai artifact).

`the-media-lens.html` in the project root is a **manual copy** of `dist-single/the-media-lens.html`
that is published as a claude.ai artifact (https://claude.ai/artifact/C4wwgv2iJE9KyyPAETrWPQ). It is
not regenerated automatically — after rebuilding, copy it again if you want to republish.
`dist/`, `dist-single/` and `the-media-lens.html` are **generated files**; never edit them by hand.

---

## 4. Project structure

```
the-media-lens/
├── index.html              Vite entry HTML (fonts, #root)
├── vite.config.js
├── package.json            scripts: dev, build, build:single, preview, test
├── README.md               Short run/structure notes
├── CLAUDE.md               This file
├── DEVELOPMENT_LOG.md      Permanent chronological record of development (newest first); see §11
├── scripts/inline.mjs      Inlines the Vite build into single-file HTML
├── tests/
│   ├── unit/rating-system.test.mjs   Scale, averages, windows, modes, visibility, alignment (node:test)
│   └── e2e/rating-flow.e2e.cjs       Browser test incl. an app-wide leak scan (needs Playwright)
├── .claude/agents/         Project agent definitions
└── src/
    ├── main.jsx            Mounts <App/>, imports styles.css
    ├── App.jsx             Providers + shell (NavBar, ModeBar, SampleBanner) + page switch
    ├── styles.css          ALL styling (design tokens at top)
    ├── data/               Sample data (the "database")
    │   ├── publications.js 12 outlets (id, name, short code, kind, homepage). No bias field — by design.
    │   ├── events.js       10 events + TOPICS; `date` = ORIGINAL sample date (only used to shift source dates)
    │   ├── articles.js     42 articles (6 fully annotated featured + 36 lighter via mk()); MARKERS
    │   ├── articleBodies.js Article text keyed by `ref` (never names the outlet)
    │   ├── ratingScale.js  The five options and point values; nearestOption(), toneForScore()
    │   ├── sources.js      49 sources + SOURCE_TYPES
    │   ├── claims.js       32 claims + CLAIM_STATUS + CLAIM_KIND
    │   └── user.js         defaultUser
    ├── services/
    │   ├── api.js          Async article/event access (mock latency); blind-safe search
    │   └── community.js    SIMULATED participants and ratings; communityAt(), finalOthers()
    ├── state/
    │   ├── store.jsx       Context + useReducer: user, ratings, browseSessions, journey; app time; vis(); alignment
    │   └── router.jsx      Hand-written hash router + <Link>
    ├── lib/
    │   ├── clock.js        App clock = real time + demo offset; timeline epoch; local-day helpers
    │   ├── schedule.js     Publication times and 24-hour windows; statusAt(); shifted source dates
    │   ├── visibility.js   visibilityFor(): THE rule for sealed / revealed / canRate
    │   ├── modes.js        Rating/Browse Mode rules (3 ratings/day, next-day lock, seen-in-browse)
    │   ├── alignment.js    Crowd Alignment, cohort, percentiles, TIERS and thresholds
    │   ├── stats.js        summarize() (mean, distribution, entropy), leaveOneOutMean()
    │   ├── text.js         [[highlight]] parsing, contentWords(), slugify()
    │   ├── format.js       Dates/times, durations, relative times, numbers
    │   └── useAsync.js     Loader hook → { data, loading, error }
    ├── components/
    │   ├── Shell.jsx       NavBar (rank chip), SearchBox, SampleBanner, Footer
    │   ├── Mode.jsx        ModeBar (under the nav) and the Browse Mode confirmation dialog
    │   ├── RatingPanel.jsx Five-option blind rating → staged reveal (useReveal) → results
    │   ├── Rating.jsx      DistributionBar (5 steps), ScoreScale (0–100), ScoreBadge
    │   ├── Status.jsx      Countdown, StatusBadge, SealedPub, useTick
    │   ├── DemoControls.jsx Prototype-only clock controls (+1h/+6h/+24h, restart timeline)
    │   ├── ui.jsx          SampleTag, PubMark, PubName, Headline, LabelBadge, SectionHead,
    │   │                   Skeleton, EmptyState, Tabs, Toasts, Icon (inline SVG set)
    │   ├── Cards.jsx       ArticleCard, EventCard (both visibility-aware)
    │   ├── SourceParts.jsx USE_CLASS, UseBadge, TypeBadge, SourceDrawer, ClaimCard, citingArticles()
    │   ├── SourceMap.jsx   ArticleSourceMap (article→claims→sources), EventSourceMap (outlets→sources)
    │   └── ArticleImage.jsx Generated SVG line illustrations keyed by `image.motif`
    └── pages/
        ├── Home.jsx         Hero, walkthrough, open-for-rating list, top stories, trending, contrasts, results
        ├── Explore.jsx      Search + filters (window status, publication, topic, time) + sort
        ├── Compare.jsx      CompareIndex and CompareEvent (sealed columns; panel locks until all revealed)
        ├── Article.jsx      Article text, RatingPanel, reveal, analysis tabs, window/score sidebar
        ├── BiasRatings.jsx  Rate blind (queue), community scores table, spread by publication
        ├── SourceExplorer.jsx Source maps, verification check, source index (revealed articles only)
        ├── Profile.jsx      Crowd Alignment, rating history, you vs. community, profile & privacy
        └── Methods.jsx      Methods & limitations + DemoControls
```

---

## 5. How the application works

### Time, schedule and rating windows (`lib/clock.js`, `lib/schedule.js`)
- **App time** = `Date.now()` + a demo offset. Every time-based rule reads `clock.now()`. The offset only changes through Demo controls.
- **Timeline epoch** = the moment this browser first opened the app (localStorage `media-lens:clock:v2`; bumping the key restarts every visitor’s timeline). Events are published at fixed hour offsets from it (`EVENT_OFFSET_HOURS`: two closed at start, four open, four published later at +3h, +9h, +20h and +34h; the last window closes about 58h after the first visit); articles follow within about an hour, in a stable non-alphabetical order.
- Each article’s window: `opensAt` = publication, `closesAt` = `opensAt` + 24 h. `statusAt()` → `upcoming | open | closed`, **always computed**, never stored.
- Unpublished (`upcoming`) articles are hidden everywhere; opening one directly shows “Not published yet”.
- Displayed publication times come from the schedule. Sample source-document dates are shifted by the same amount as their event (`shiftedSourceDate`).
- The store re-renders at every window boundary, at local midnight, after demo-clock changes, and every 15 s. Countdowns tick every second on their own (`useTick`). `boundaryKey` (number of boundaries passed) is used as a dependency for data loads.

### Visibility — the blind-rating rule (`lib/visibility.js`)
`visibilityFor(article, viewer)` returns `{ status, published, sealed, revealed, canRate, reason, rating, opensAt, closesAt, msLeft }`. The store exposes it as **`vis(article)`**.
- **sealed** = open + Rating Mode + not rated by you (+ not seen in Browse Mode). Show only headline, summary (dek), article text, label (News/Analysis) and the window status.
- **revealed** = rated by you, or closed, or Browse Mode, or open during one of your Browse sessions.
- **canRate** = open, not rated, Rating Mode, not seen in Browse Mode. `reason` explains why not: `upcoming | rated | closed | browse | seen-in-browse`.
- Places that enforce it: cards, event cards (outlet list hidden if any article sealed), Home lists, Explore search (sealed outlet/byline not searchable; publication filter excludes sealed; publication sort groups sealed separately), Compare (sealed columns; comparison panel locked until every article in the event is published and revealed), Article page, Bias Ratings (table, spread, queue), Source Explorer (sealed articles excluded; sealed article ids fall back to their event), Source drawer (“cited by” lists revealed articles only), image `aria-label`s (generic).
- **Article ids are opaque** (e.g. `kxfv`) so URLs never reveal the outlet. The readable `ref` (e.g. `ap-permitting`) is internal only — never render it.

### Rating Mode / Browse Mode (`lib/modes.js`)
- Every local calendar day starts in Rating Mode. Entering Browse Mode needs ≥ 3 ratings submitted that day, plus confirmation in a dialog.
- Browse Mode = `browseSessions` contains an entry for today’s local date. It ends at local midnight. No ratings can be submitted during it.
- Any article that was open during a Browse session (and not already rated) can never be rated later (`seenInBrowse`).
- Persisted in the store, so it survives reloads and browser restarts (same browser only).

### State (`state/store.jsx`)
- `useReducer` with `{ user, ratings, browseSessions, journey }`, persisted to localStorage key **`media-lens:v3`** (all access in try/catch). Older keys (`v1`, `v2`) are ignored, not migrated. Bump this key together with the clock key whenever the timeline is reset.
- `ratings: [{ articleId, points, submittedAt }]`. One per article and **final** (the reducer ignores duplicates).
- `submitRating(id, points)` re-checks `canRate` against `clock.now()` at submission time, then calls `clock.notify()` so the new rating is counted immediately.
- Exposes: `now`, `boundaryKey`, `mode`, `vis`, `ratingFor`, `ratedToday`, `canEnterBrowse`, `enterBrowse`, `alignment`, `demo` (`advance`, `restart`), `toast`, `markJourney`.
- Journey flags: `searched, rated, ratedThree, compared, sources, browsed, profileViewed`.
- Actions: `rate`, `enterBrowse`, `updateUser`, `journey`, `resetActivity` (used by restart timeline), `resetAll`.

### Simulated community (`services/community.js`)
- 300 simulated participants generated from fixed seeds (careful to erratic, leaning high or low, different activity levels), each with a simulated prior record of errors for the ranking cohort.
- Each article’s `crowd: { center, spread, traffic }` drives its simulated ratings. Each rating has a position in the 24-hour window, so live counts and averages grow while it’s open. One article (`bbg-chips`, traffic 0.06) intentionally gets fewer than 20 ratings to demonstrate “not enough ratings”.
- `communityAt(id, t, yourRating)` = simulated ratings submitted by `t`, plus your rating. `finalOthers(id)` = all simulated ratings, **never** including yours. `simulatedActivity(t0, t1)` = count for the live line on Home.
- Your genuine ratings are never mixed into the simulated arrays.

### Ratings, scores and Crowd Alignment
- Scale (`data/ratingScale.js`): Neutral / Factual 100 · Slightly Biased 75 · Biased 50 · Very Biased / Misleading 25 · Nonfactual 0.
- Community score = arithmetic mean of points (`lib/stats.js summarize`), shown out of 100 with the nearest category and the 5-step distribution; “Readers divided” when normalized entropy > 0.8 (n ≥ 10).
- Crowd Alignment (`lib/alignment.js`), after an article closes:
  - error = |your points − final mean of everyone else|;
  - the article counts only if ≥ `MIN_CROWD` = 20 other ratings;
  - adjusted error = (n·raw + `SHRINK_K`=5·cohort mean) / (n + 5);
  - score = 100 − adjusted error;
  - percentile = share of the cohort with larger adjusted error (ties half).
- Status: < `PROVISIONAL_MIN`=5 eligible → unranked; < `RANK_MIN`=15 → provisional; else ranked. Tiers by percentile: Bronze 0, Silver 20, Gold 40, Platinum 60, Diamond 75, Master 90, Grandmaster 97.
- The cohort = simulated participants scored by the same rules with leave-one-out means, recomputed (cached) whenever the set of closed articles changes.

### Data access (`services/api.js`)
- `searchArticles({ q, pubs, topic, range, sort, status, vis, now })`, `listEvents({ now })`, `getEventBundle(id, { now })`, `getArticleBundle(id, { now })`. Lists include published articles only.
- Search: lower-cased substring matching across weighted fields; every token must match. No stemming or typo tolerance.
- Rating data is read synchronously from `services/community.js`, not through `api.js`. A real backend would make both asynchronous.

### Data model highlights
- **Article**: `id (opaque), ref (internal), eventId, pub, author, label, headline, dek, body[], emphasis[], framing, charged[], perspectives{}, omissions[], opinionNote, sourceUses[{id, cls, usage}], claims[ids], crowd{center, spread, traffic}, markers[], intensity, image{motif}`. No date fields: times come from the schedule.
- Headlines mark discussed wording with `[[double brackets]]`. Highlights are shown only on revealed articles.
- `sourceUses[].cls`: `primary | secondary | anonymous | expert | unverified`. Source `type`: `document | govdata | statement | interview | anonymous | study | expert | outlet`. Source URLs are real institution homepages only.
- **Claim**: `text, kind, status, source, corroboratedBy[], contradicts[]?, evidence, limitations`.
- Featured event `permitting-act`: 6 fully annotated articles (AP, Reuters, WSJ, NYT, Fox, CNN). The other 9 events have 4 lighter articles each (grid-heat, transit-strike and ai-hiring were added 2026-11-12). Sample content deliberately varies within outlets — keep it that way.

### Features by page
- **Home**: dateline (app date), hero, 8-step walkthrough, “Articles waiting for your rating” (sealed list with countdowns; paused message in Browse Mode), top stories, trending, coverage contrasts (only from fully revealed events), recent results (closed articles) + your ratings + live simulated activity count, featured-event aside (locked until its articles are revealed).
- **Explore**: search; filters for rating window (all/open/closed), publication (excludes sealed), topic, time since publication; by event / all articles; sort relevance/recency/publication.
- **Compare**: index (outlets, open count, score spread only when unlocked); event page with lineup, side-by-side columns (sealed columns anonymous), six-tab comparison panel (locked until all revealed).
- **Article**: sealed masthead, article text, RatingPanel, staged reveal (score → distribution → publication → analysis), then Framing analysis / Sources / Facts & evidence tabs; sidebar with window countdown, community score (hidden until revealed) and same-event coverage.
- **Bias Ratings**: Rate blind (default in Rating Mode), community scores table (sealed rows show no score and sort last), spread by publication (revealed only).
- **Source Explorer**: event selector, maps, verification table and source index built from revealed articles only.
- **Profile**: Crowd Alignment ring, rank and percentile, stats, provisional/unranked guidance, rank ladder, step-by-step calculation, cohort histogram, rating history with outcome per rating, you-vs-community chart, profile & privacy (Settings remounts when the profile changes; “Reset demo data” also restarts the timeline).
- **Methods**: sample/simulated disclosure, five options table, averaging with worked example, blind rating, windows, modes, Crowd Alignment, percentiles and thresholds with justification, limitations of crowd ratings, sourcing statuses, demographics, toward production, **Demo controls**.

---

## 6. Design language and UX

Editorial / research-desk feel: white and off-white paper, charcoal ink, one restrained ink-blue accent.
Inspired by serious news design and data journalism; it should read as credible and analytical.

- **Tokens:** all colors are CSS custom properties at the top of `styles.css` on `:root`, redefined for dark mode in both `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and `:root[data-theme="dark"]`. **Never hard-code a color in a component rule**; add or reuse a token and define it in all three blocks.
- **Rating colors** `--r0…--r4` are one ordinal ramp: `r0` Neutral/Factual (cool grey) → `r4` Nonfactual (deep brown; salmon in dark mode). Class `.rN` sets `--rc`. Reserved for ratings — not general UI accents. Status colors (`--good/--info/--warn/--alert` + `-soft`) are for sourcing statuses and semantics.
- **Sealed state:** dashed “?” publication mark (`.pubmark-sealed`), “Publication hidden” text, lock icons, dashed `.locked-analysis` panels. **Modes:** `.modebar` is light accent in Rating Mode and inverted (ink) in Browse Mode.
- **Typography:** `--serif` for headlines, article text, quotes; `--sans` for UI; `--mono` + `.tabular` for numbers. Uppercase `.kicker` / `.mini-h` labels with letter-spacing.
- **Shapes:** square-ish corners (2px), hairline rules (`--rule`), thick 2px ink rule under section heads. Avoid rounded "card soup", gradients, emoji and heavy shadows. Pills only for chips, status and small counts.
- **Motion:** the reveal is the one orchestrated animation (count-up score, staged sections, publication fade-in). All animation is disabled under `prefers-reduced-motion`.
- **Responsive:** breakpoints at 1080, 900 and 760px. On phones the five rating options stack vertically. Wide content scrolls inside its own container; the page body must never scroll horizontally (checked at 390px by the E2E test).
- **Accessibility:** skip link, focus-visible outlines, native radio inputs for rating options (arrow-key navigation), ARIA roles for tabs/dialogs, Escape closes the drawer and the mode dialog, keyboard-activatable source-map nodes.
- **Copy voice:** plain, direct, specific; explains why rather than lecturing; never tells the reader what to believe about an issue.

---

## 7. Rules for making changes

1. **Treat the existing app as the foundation.** Extend; don't rebuild or replace working features.
2. **Read the relevant code before changing it**, and explain the planned approach before significant changes.
3. **Preserve existing behaviour** unless the user explicitly asks to change it. Check every page that uses a component, data field or CSS class you touch (`grep` for it).
4. **No major architectural change without explaining why and getting approval** — e.g. adding a router/state/CSS library, TypeScript, a backend, changing the route format, restructuring folders, or changing the localStorage shape.
5. **Keep the product principles in §1.** In particular: never add an outlet-level rating, never present sample or simulated content as real, never invent fact-check verdicts, never present community scores as fact-checks, never expose or use demographics.
6. **Blind-rating rule:** any new UI that shows an outlet, byline, link to the outlet, source, analysis or community number for an article must check `vis(article)` first. Search, filters and sorts must not let a sealed article be matched or ordered by outlet. After such a change, run the E2E test (its leak scan covers every page).
7. **Sample data rules:** new content must be clearly hypothetical, attributed to real outlets only as sample, linked only to homepages, and varied within outlets. New articles need every field the UI reads (use `mk()` for lighter ones), an opaque `id`, a `ref`, a `crowd` entry and a `BODIES[ref]` text that never names the outlet. New source/claim ids must exist in their registries.
8. **Route format:** page names without hyphens; hashes ASCII letters/digits/hyphens only.
9. **Time:** always use `clock.now()` / the store’s `now`, never `Date.now()` directly in feature code. Statuses must be computed from timestamps, not stored.
10. **Data access:** add new article/event reads to `services/api.js` and rating reads to `services/community.js`, so a real backend can replace them later.
11. **Styling:** use existing tokens and classes; keep both themes working; check 390px width for horizontal overflow.
12. **Storage:** wrap any new `localStorage`/`sessionStorage` use in try/catch; the app must work without it. Changing the stored shape requires bumping the key or adding a migration.
13. **Generated files** (`dist/`, `dist-single/`, root `the-media-lens.html`) are never edited by hand.
14. **Verify before claiming.** Run `npm test` and `npm run build`. For UI changes, run `npm run build:single && node tests/e2e/rating-flow.e2e.cjs` and look at screenshots. Report exactly what was and wasn't tested.
15. **Update this file** when architecture, features, data shapes or known limitations change.
16. **Log and report every development task** as described in §11: add a `DEVELOPMENT_LOG.md` entry and give the six-heading end-of-task report.

---

## 8. Known limitations and rough edges (verified in code)

- **All other participants are simulated.** No ratings are shared between people or devices; percentiles compare you with simulated participants.
- **Rules run in the browser.** Windows, the daily Browse rule and blind hiding can be bypassed by clearing site data, changing the device clock or reading the page source. A real version needs a server.
- **Crowd Alignment rewards hedging.** Measured on 2026-11-10: always answering 75 scored at about the 49th percentile of the simulated cohort, without reading anything (disclosed on Methods).
- **The five-point scale mixes bias, misleading presentation and factual accuracy** (user decision; disclosed on Methods).
- **Blind rating is imperfect:** article text names some of its sources, and headline style can hint at an outlet.
- **Demo timeline:** sample articles publish relative to your first visit, and the library runs out about 58 hours later (Restart timeline resets it). Up to 33 of the 42 articles can be rated and become eligible, so a permanent rank (15) is reachable in about two days of rating.
- The simulated cohort’s prior records are generated from a simplified model.
- Home trending sparkline values (`TREND`) and the featured event choice are hard-coded. The featured-analysis stats are now computed.
- Each article’s `intensity` is hand-entered; no lexicon or computation exists.
- Search has no stemming, synonyms or typo tolerance; punctuation in queries is dropped by the slug in the URL.
- Article/Profile/Ratings tab selections are not in the URL.
- `fade-in` animations start from near-zero opacity (brief).
- Lighter-profile events have less complete annotations than the featured event.
- No linting, type-checking or CI. The E2E test depends on the container’s preinstalled Playwright.

## 9. Unclear / undecided (ask the user before assuming)

- Which real news API, auth provider, database and hosting to use — none chosen.
- How to guard Crowd Alignment against middle-of-the-scale hedging (e.g. compare against a constant-answer baseline).
- Whether the five-point scale should later be split into separate bias and accuracy questions.
- How community moderation and human editorial review of annotations would work.
- Whether and how the aggregate demographic research view should be built.
- Whether to keep publishing as a single-file claude.ai artifact or deploy elsewhere.
- Licensing and the legal approach to displaying real publications' content.

## 10. Environment notes

- GitHub repository: `danielcoscarelli-beep/the-media-lens` (default branch `main`). In cloud sessions the checkout lives at `/home/user/the-media-lens`. The container is ephemeral: **only work that is committed and pushed to GitHub is safe.** (An older, superseded working copy may exist at `/home/user/media-lens` in the original session's container; don't work there.)
- Git workflow: commit after each completed development task, with a message describing the change, and push it (`git push -u origin <branch>`). Run `git status` at the start of a session to check for uncommitted or unpushed work. Ask the user before force-pushing or rewriting history.
- `node_modules/` is installed locally; run `npm install` in a fresh checkout.

## 11. Documentation, development log and reporting

The project keeps three kinds of written record. Each has a different job:

| File | Job | How it changes |
|---|---|---|
| `CLAUDE.md` | Describes the project **as it is now**: vision, architecture, features, rules, limitations. | Edited in place whenever reality changes, so it stays current. |
| `DEVELOPMENT_LOG.md` | Records **how the project got here**: what was done, when, why, and how it was tested. | Append-only. Each new entry goes at the top; earlier entries are never erased or rewritten. |
| `.claude/agents/media-lens-developer.md` | Defines **how the developer agent works**: its role, rules and reporting duties. | Edited when the way of working changes. |

A **development task** is any work that creates, modifies or deletes project files (code, styles, data, config, build scripts, or documentation). Questions and investigations that change no files are not development tasks.

**Before a significant change** (new feature, several or shared files, data shapes or stored data, existing behavior, or architecture), explain the intended implementation (goal, approach, files, interactions, alternatives, test plan) and get the user's go-ahead.

**After every completed development task:**

1. Give a technical explanation: what changed and why, how it works technically, which files, components, functions and systems are involved, how it interacts with the existing app, the decisions and trade-offs, and its limitations. Use accessible language without leaving out the technical substance.
2. Add a `DEVELOPMENT_LOG.md` entry at the top with these fields: Date, Status (`Completed` / `Partially completed` / `Failed / reverted` / `Proposed (not implemented)`), Task / objective, Implementation, Technical explanation, Files, Testing and results, and Limitations, open issues and follow-up. Add a Decision note for architectural choices. Record failed attempts that matter. Correct mistakes in earlier entries with a new entry, not by rewriting the old one.
3. Update this file if architecture, features, data shapes or limitations changed.
4. Give the end-of-task report under these exact headings: **1. What I did · 2. How it works technically · 3. Files changed · 4. Testing and verification · 5. Development log updated · 6. Things to consider next.**

**Accuracy and accountability:** never claim something is implemented or tested unless it actually is. State explicitly what could not be verified. Keep this file and the log consistent with the code. When they conflict, the code wins, and the conflict is reported and corrected.
