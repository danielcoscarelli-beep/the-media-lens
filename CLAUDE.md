# The Media Lens — project reference

This is the permanent reference for anyone (human or Claude) working on this codebase.
The code is the source of truth. If this file and the code disagree, trust the code and update this file.

---

## 1. Purpose and vision

The Media Lens is a **media-literacy platform**, not a news aggregator. It helps people become more
discerning news consumers by letting them:

- compare how different publications cover **the same event**, side by side;
- examine **framing and wording** (charged language, emphasis, perspectives, omissions, labeling);
- trace claims back to their **original sources** and see when many outlets rely on one origin;
- examine the **factual basis** of claims without the platform pretending to have fact-checked them;
- rate individual **headlines** for bias, explain their reasoning, and see community results;
- build a **reputation** based on the quality of their reasoning, not on agreeing with the majority.

Core principles (these are product rules, not just preferences — see §7):

1. **Rate headlines and articles, never outlets.** No publication gets a fixed bias label.
2. **Factual accuracy, framing, and opinion are separate dimensions** and are never merged into one score.
3. **No invented fact-check verdicts.** Claims get a *sourcing status*, not a true/false ruling.
4. **Agreement with the majority is not accuracy.** It has zero weight in reputation.
5. **Repetition is not corroboration.** Several outlets citing one source = one source.
6. **Institutional prestige ≠ correctness** of any individual claim.
7. **Demographics are optional, private, and never used to judge credibility or predict beliefs.**
8. **Sample content is always clearly labeled as sample content.**

---

## 2. Current status: what is real, what is simulated, what is planned

| Status | What |
|---|---|
| **Working (front-end, verified in a headless browser)** | All 8 pages and navigation; search/filter/sort; side-by-side comparison; six-dimension comparison panel; article analysis tabs; source drawer; source maps; claim cards; rating → reasoning → results flow; community aggregates that update with your rating; reputation score that updates; profile editing; local persistence; responsive layout (phone/tablet/desktop); light and dark themes. |
| **Prototype / simulated** | All news content (hypothetical, written for this prototype). Community rating counts, reasons and comments (static seeds; only *your* rating is added on top, only in your browser). Other users and the activity feed. "Helpful" marks (derived by formula). Reputation model (text heuristics). Language-intensity index (hand-assigned numbers in data, not computed). Trending-topic sparkline values. 3 seeded "sample history" evaluations in the profile. Loading delays (artificial `setTimeout`). |
| **Not built (planned only)** | Real news API, real authentication, database/backend, multi-user community, moderation, human editorial review of annotations, automated framing/claim extraction, an aggregate demographic research view (the opt-in checkbox exists; no research view exists), notifications, any server. |

There is **no backend**. Everything runs in the browser.

---

## 3. Tech stack and dependencies

- **React 18.3.1** + **react-dom 18.3.1** (function components and hooks, plain JavaScript/JSX — no TypeScript).
- **Vite 5.4.11** with **@vitejs/plugin-react 4.3.4** (dev server and build). `vite.config.js` sets `base: './'` so the build works from any path.
- **No other runtime libraries.** No router library, no state library, no CSS framework, no chart library. Routing, state, charts and the source map are hand-written.
- **Fonts:** Google Fonts — Source Serif 4 (headlines), IBM Plex Sans (UI/body), IBM Plex Mono (numbers/data). Loaded via `<link>` in `index.html` and in `scripts/inline.mjs`, with system fallbacks in CSS.
- **No tests, no linter, no formatter, no CI.** (Some files contain `// eslint-disable-next-line` comments, but ESLint is *not* installed.)
- **Git / GitHub:** git repository on branch `main`, pushed to GitHub at **https://github.com/danielcoscarelli-beep/the-media-lens** (remote `origin`, since 2026-11-10). See §10. `.gitignore` excludes `node_modules/`, `dist/`, `dist-single/` and the root `the-media-lens.html` (all regenerable).

### Commands

```bash
npm install            # install dependencies
npm run dev            # dev server with hot reload (Vite prints the URL/port)
npm run build          # production build → dist/
npm run build:single   # build + inline everything into dist-single/
npm run preview        # serve dist/ locally
```

`npm run build:single` runs `scripts/inline.mjs`, which writes:
- `dist-single/index.html` — a complete, self-contained HTML document (opens from disk).
- `dist-single/the-media-lens.html` — the same app without `<!doctype>/<html>/<head>/<body>`, for hosts that supply their own document skeleton (used for the published claude.ai artifact).

`the-media-lens.html` in the project root is a **manual copy** of `dist-single/the-media-lens.html`
that was published as a claude.ai artifact (https://claude.ai/artifact/C4wwgv2iJE9KyyPAETrWPQ). It is
not regenerated automatically — after rebuilding, copy it again if you want to republish.
`dist/`, `dist-single/` and `the-media-lens.html` are **generated files**; never edit them by hand.

---

## 4. Project structure

```
the-media-lens/
├── index.html              Vite entry HTML (fonts, #root)
├── vite.config.js
├── package.json
├── README.md               Short run/structure notes
├── CLAUDE.md               This file
├── DEVELOPMENT_LOG.md      Permanent chronological record of development (newest first); see §11
├── scripts/inline.mjs      Inlines the Vite build into single-file HTML
├── .claude/agents/         Project agent definitions
└── src/
    ├── main.jsx            Mounts <App/>, imports styles.css
    ├── App.jsx             Providers + shell + page switch (PAGES map)
    ├── styles.css          ALL styling (~one file, design tokens at top)
    ├── data/               Sample data (the "database")
    │   ├── publications.js 12 outlets (id, name, short code, kind, homepage). No bias field — by design.
    │   ├── events.js       7 events + TOPICS list; `comparison` = hand-written summary per dimension
    │   ├── articles.js     30 articles (6 fully annotated featured + 24 lighter via mk()); MARKERS
    │   ├── sources.js      35 sources + SOURCE_TYPES
    │   ├── claims.js       25 claims + CLAIM_STATUS + CLAIM_KIND
    │   ├── community.js    RATING_LABELS, REASONS, activity feed, simulatedHelpful()
    │   └── user.js         defaultUser, seedEvaluations (3, flagged seeded:true)
    ├── services/api.js     The ONLY async data-access layer (mock, artificial latency)
    ├── state/
    │   ├── store.jsx       React context + useReducer: user, evaluations, journey; toasts; localStorage
    │   └── router.jsx      Hand-written hash router + <Link>
    ├── lib/
    │   ├── reputation.js   Simulated credibility model, LEVELS, LIMITATIONS
    │   ├── stats.js        aggregate() of ratings, meanLabel(), pearson()
    │   ├── text.js         [[highlight]] parsing, contentWords(), slugify()
    │   ├── format.js       Dates (SAMPLE_NOW), pct, num
    │   └── useAsync.js     Loader hook → { data, loading, error }
    ├── components/
    │   ├── Shell.jsx       NavBar, SearchBox, SampleBanner, Footer
    │   ├── ui.jsx          SampleTag, PubMark, PubName, Headline, LabelBadge, SectionHead,
    │   │                   Skeleton, EmptyState, Tabs, Toasts, Icon (inline SVG set)
    │   ├── Cards.jsx       ArticleCard, EventCard
    │   ├── Rating.jsx      DistributionBar, ScaleMarker, ReasonBars
    │   ├── EvaluationPanel.jsx  Rate → Explain → Compare flow + Results
    │   ├── SourceParts.jsx USE_CLASS, UseBadge, TypeBadge, SourceDrawer, ClaimCard, citingArticles()
    │   ├── SourceMap.jsx   ArticleSourceMap (article→claims→sources), EventSourceMap (outlets→sources)
    │   └── ArticleImage.jsx Generated SVG line illustrations keyed by `image.motif`
    └── pages/
        ├── Home.jsx         Hero + guided walkthrough, top stories, trending, contrasts, activity
        ├── Explore.jsx      Search + filters + sort, grouped by event or flat list
        ├── Compare.jsx      CompareIndex (event list) and CompareEvent (side-by-side + panel)
        ├── Article.jsx      Article header + tabs: Framing analysis / Sources / Facts & evidence / Evaluate
        ├── BiasRatings.jsx  Headline table, spread by publication, rating queue
        ├── SourceExplorer.jsx Source maps, verification check, source index
        ├── Profile.jsx      Reputation, history, you-vs-community, profile & privacy settings
        └── Methods.jsx      Methods & limitations page
```

---

## 5. How the application works

### Routing (`state/router.jsx`)
- Hash-based: `#page` or `#page-param`. Pages: `home, explore, compare, article, ratings, sources, profile, methods`.
- Parsing splits on the **first** hyphen: `#article-fox-permitting` → page `article`, param `fox-permitting`.
  Page names must therefore never contain hyphens. IDs may.
- Hash routes use only letters, digits and hyphens (required by the claude.ai artifact host, which only passes plain `#name` hashes; no `#/path`, no query strings).
- `explore` param is a slugified query (`#explore-permitting-bill` → query "permitting bill").
- `sources` param may be an **event id or an article id**; unknown → defaults to `permitting-act`.
- Unknown pages fall back to Home. Route change scrolls to top.
- `App.jsx` keys pages by `page + param` (except Explore) so pages remount on param change.
- Tab state inside pages (article tabs, profile tabs, etc.) is local React state and **not** in the URL.

### State (`state/store.jsx`)
- `useReducer` with `{ user, evaluations, journey }`, persisted to `localStorage` key **`media-lens:v1`** (all access wrapped in try/catch; the app works without storage).
- Actions: `submitEvaluation`, `removeEvaluation`, `updateUser`, `journey`, `reset`.
- One evaluation per article: submitting again replaces the previous one.
- `journey` flags drive the Home "Guided walkthrough": `searched, compared, opened, sources, rated, explained, contributed, profileViewed`.
- `reputation` is recomputed with `useMemo` from `evaluations`.
- `submitEvaluation` computes the before/after score and shows a toast.
- If you change the stored shape, bump the key (e.g. `media-lens:v2`) or add migration in `load()`.

### Data access (`services/api.js`)
- `searchArticles({q, pubs, topic, range, sort})`, `listEvents()`, `getEventBundle(id)`, `getArticleBundle(id)`.
- Search: lower-cased substring matching of query tokens across weighted fields (headline 5, event title 4, tags/people/orgs 3, topic 3, dek 2, publication 2, author 2, event summary 1). **Every token must match somewhere.** No stemming or typo tolerance.
- Date filter is relative to `SAMPLE_NOW` = 2026-11-01 (`lib/format.js`), not the real current date.
- Some components also import data modules directly (e.g. Home, BiasRatings, SourceExplorer, Cards). Home, Explore, Compare and Article load their main data through `api.js`; BiasRatings, SourceExplorer, Profile and several components read data modules synchronously. A real backend migration would need to cover those direct imports too.

### Data model highlights
- **Article**: `id, eventId, pub, author, date, time, label ('News'|'Analysis'), headline, dek, emphasis[], framing, charged[{term,note,attributed}], perspectives{supporters,opponents,independent,affected}, omissions[], opinionNote, sourceUses[{id, cls, usage}], claims[ids], community{dist[4], reasons{}, comments[]}, markers[], intensity (0–1), image{motif}`.
- Headlines mark discussed wording with `[[double brackets]]`; `<Headline highlight>` renders them as highlights.
- `sourceUses[].cls` is how *this article* uses the source: `primary | secondary | anonymous | expert | unverified`.
- **Source** `type` is what the source *is*: `document | govdata | statement | interview | anonymous | study | expert | outlet`. Source `url`s point only to real institution homepages; documents are hypothetical.
- **Claim**: `text, kind (factual|projection|interpretation|opinion), status (documented|attributed|projection|contested|unsupported), source, corroboratedBy[], contradicts[]?, evidence, limitations`.
- `community.dist` = counts for `[Neutral, Slightly, Moderately, Strongly biased]`.
- `MARKERS` (in articles.js) = objective text features and which reason categories count as identifying them.
- The featured event `permitting-act` has 6 fully annotated articles (AP, Reuters, WSJ, NYT, Fox, CNN). The other 6 events have 4 lighter articles each, built with `mk()` defaults.
- Sample content deliberately varies within outlets (e.g. Fox's Fed story is neutral, its permitting headline is loaded; CNN, NYT, Guardian, WSJ also vary). Keep this property when adding content.

### Features by page
- **Home**: dateline, hero search, guided walkthrough (9 steps, live progress), top stories (featured lead + 4), trending topics (tiles link to Explore), "Coverage differences" (3 hand-picked contrasts), community activity (your recent non-seeded evaluations + seeded feed), featured-analysis aside.
- **Explore**: search box, publication checkboxes, topic radios, date range, "By event"/"All articles" view, sort (relevance/recency/publication), skeleton loading, empty state.
- **Compare**: index of events with "framing divergence" meter; event page with headline lineup, horizontally scrolling columns (emphasis, framing, flagged terms, cited sources, community assessment), and a 6-tab comparison panel (headline framing table, charged language + intensity, claim × outlet matrix, perspectives bars, omissions incl. "claims others report that this one doesn't", reporting vs opinion).
- **Article**: three-dimension summary (factual basis / framing / opinion vs reporting), framing analysis, source transparency (use-class tiles, article source map, source list → drawer), facts & evidence (claim cards, explicit no-fact-check notice), evaluation panel; sidebar with community assessment and same-event links.
- **Evaluation flow** (`EvaluationPanel`): pick 1 of 4 ratings → optional reason chips + required explanation (**≥ 15 characters**) with live reasoning-quality preview → results: distribution (yours highlighted), mean vs your rating on a 0–3 scale, top reasons, differing interpretations, comparison note that explicitly says agreement doesn't matter.
- **Bias Ratings**: headline table (filter by topic/publication; sort by most evaluated, most divided = normalized entropy, most/least critical), "Spread by publication" strip plot (one dot per article), rating queue.
- **Source Explorer**: event selector, focus on all coverage or a single outlet, event map (outlets → sources; shared by 3+ highlighted) or article map, "Claims repeated across outlets" verification table, filterable source index.
- **Profile**: credibility ring, level and progress, stats, reputation breakdown (incl. the 0%-weighted "Agreement with majority" row), framing-detection detail, history (revise/delete), you-vs-community dumbbell chart, profile & privacy form with optional demographics and opt-in consent, "what others see" preview, reset demo data (in-page confirmation).
- **Methods**: plain-language explanation of sample data, the three dimensions, statuses, classifications, reputation model and limitations.

### Reputation model (`lib/reputation.js`) — simulated
- Per-evaluation **reasoning quality** 0–100: substance (25), specific wording cited (25), evidence words (20), reasons match text (15), civility (15).
- Score = weighted mean of available components: reasoning quality 40%, consistency 25% (Pearson correlation of your ratings with each article's `intensity`, needs ≥3 evaluations with variance), framing detection 20% (markers identified via reasons), participation 15%. **Majority agreement: 0%.**
- Shrinks toward 30 until 10 evaluations (`confidence`).
- Levels: Observer 0, Contributor 35, Analyst 50, Senior Analyst 65, Fellow 80.
- `LIMITATIONS` array is displayed in the UI; keep it honest and updated when the model changes.

---

## 6. Design language and UX

Editorial / research-desk feel: white and off-white paper, charcoal ink, one restrained ink-blue accent.
Inspired by serious news design and data journalism; it should read as credible and analytical.

- **Tokens:** all colors are CSS custom properties at the top of `styles.css` on `:root`, redefined for dark mode in both `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and `:root[data-theme="dark"]`. **Never hard-code a color in a component rule**; add or reuse a token and define it in all three blocks.
- **Bias rating colors** `--r0…--r3` are a single warm ordinal ramp (neutral grey → deep rust). They are reserved for bias ratings and must not be used as general UI accents. Status colors (`--good/--info/--warn/--alert` + `-soft`) are for sourcing statuses and semantics.
- **Typography:** `--serif` for headlines, article text, quotes; `--sans` for UI; `--mono` + `.tabular` for numbers. Uppercase `.kicker` / `.mini-h` labels with letter-spacing.
- **Shapes:** square-ish corners (2px), hairline rules (`--rule`), thick 2px ink rule under section heads. Avoid rounded "card soup", gradients, emoji, and heavy shadows. Pills are used only for chips and small counts.
- **Patterns:** `SectionHead` for section titles; `Tabs` for in-page views; `SampleTag` and the sample banner for disclosure; `Skeleton`/`EmptyState` for loading/empty; drawer for source detail; toasts for confirmations.
- **Responsive:** breakpoints at 1080, 900 and 760px (see end of `styles.css`). Phone: hamburger menu, single column, stacked tables. Wide content (tables, source maps at min-width 760px, comparison columns) scrolls inside its own `overflow-x:auto` container — the page body must never scroll horizontally. Side gutters use `max(16px, env(safe-area-inset-*))`.
- **Accessibility in place:** skip link, focus-visible outline, ARIA roles on tabs/radios/dialog, Escape closes drawer, `prefers-reduced-motion` disables animation, keyboard-activatable source-map nodes.
- **Copy voice:** plain, direct, specific; explains why rather than lecturing; never tells the reader what to believe about an issue.

---

## 7. Rules for making changes

1. **Treat the existing app as the foundation.** Extend; don't rebuild or replace working features.
2. **Read the relevant code before changing it**, and explain the planned approach before significant changes.
3. **Preserve existing behaviour** unless the user explicitly asks to change it. Check every page that uses a component, data field or CSS class you touch (`grep` for it).
4. **No major architectural change without explaining why and getting approval** — e.g. adding a router/state/CSS library, TypeScript, a backend, changing the route format, restructuring folders, or changing the localStorage shape.
5. **Keep the product principles in §1.** In particular: never add an outlet-level bias rating, never present sample content as real, never invent fact-check verdicts, never let majority agreement raise reputation, never expose or use demographics for credibility.
6. **Sample data rules:** new content must be clearly hypothetical, attributed to real outlets only as sample, linked only to homepages, and varied within outlets. New articles need every field the UI reads (use `mk()` for lighter ones). New source/claim ids must exist in their registries — `getSource`/`getClaim` return `null` for unknown ids and some components assume they exist.
7. **Route format:** page names without hyphens; hashes ASCII letters/digits/hyphens only.
8. **Data access:** add new async reads to `services/api.js` rather than importing data in new pages, so a real backend can replace it later.
9. **Styling:** use existing tokens and classes; keep both themes working; check 390px width for horizontal overflow.
10. **Storage:** wrap any new `localStorage`/`sessionStorage` use in try/catch; the app must work without it.
11. **Generated files** (`dist/`, `dist-single/`, root `the-media-lens.html`) are never edited by hand.
12. **Verify before claiming.** At minimum run `npm run build`. For UI changes, exercise the change in a browser (Playwright + Chromium are available in the cloud container: `require('playwright')`, `chromium.launch()`). Report exactly what was and wasn't tested.
13. **Update this file** when architecture, features, data shapes or known limitations change.
14. **Log and report every development task** as described in §11: add a `DEVELOPMENT_LOG.md` entry and give the six-heading end-of-task report.

---

## 8. Known limitations and rough edges (verified in code)

- Home "Featured analysis" numbers (6 outlets, 15 sources, 13 claims) are **hard-coded** in `Home.jsx`, as are the 3 "Coverage differences" article ids, the walkthrough step targets, the trending `TREND` values and the dateline date. Changing sample data will not update them.
- Community numbers are static seeds plus the current user's own evaluation; nothing is shared between users or devices.
- Each article's `intensity` is a hand-entered number described in the UI as a lexicon-based index; no lexicon or computation exists in the code.
- Reasoning-quality scoring is heuristic and easy to game (see `LIMITATIONS`).
- Search has no stemming, synonyms or typo tolerance; punctuation in queries is dropped by the slug in the URL.
- Article/Profile/Ratings tab selections are not in the URL (not bookmarkable).
- After "Reset demo data", the Profile settings form keeps showing the old values until the page is reopened (its form state is initialized once).
- `fade-in` animations start from near-zero opacity (brief).
- Lighter-profile events have less complete annotations than the featured event (e.g. generic `perspectives` defaults from `mk()`).
- "Original" article links go to publication homepages because the articles are not real.
- No automated tests, linting, type-checking or CI.

## 9. Unclear / undecided (ask the user before assuming)

- Which real news API, auth provider, database and hosting to use — none chosen.
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
