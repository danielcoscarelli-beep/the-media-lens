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
