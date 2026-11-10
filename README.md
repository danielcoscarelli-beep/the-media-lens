# The Media Lens — prototype

A media-literacy platform for comparing how news organizations cover the same events, tracing claims to their sources, and evaluating headline framing. Front-end only; all content is hypothetical sample data.

## Run

```
npm install
npm run dev          # local dev server
npm run build:single # self-contained dist-single/index.html (opens from disk)
npm test             # unit tests (node:test, no extra dependencies)
node tests/e2e/rating-flow.e2e.cjs   # browser test; needs Playwright + Chromium installed
```

## Structure

```
src/
  data/        sample publications, events, articles + article text, rating scale, sources, claims
  services/    api.js (articles/events) · community.js (SIMULATED participants and ratings)
  state/       store.jsx (profile, your ratings, Browse Mode, app time, vis()) · router.jsx (hash routes)
  lib/         clock.js · schedule.js (24h windows) · visibility.js (blind rule) · modes.js ·
               alignment.js (Crowd Alignment, percentiles) · stats.js · text.js · format.js
  components/  Shell, Mode bar, RatingPanel (blind rating + reveal), Rating charts, Status,
               Cards, SourceMap, SourceParts, DemoControls, ui primitives
  pages/       Home, Explore, Compare, Article, BiasRatings, SourceExplorer, Profile, Methods
tests/         unit/ (node:test) · e2e/ (Playwright browser test with leak scan)
```

See `CLAUDE.md` for the full architecture and `DEVELOPMENT_LOG.md` for the project history.

## Integration points
- **News data**: reimplement `src/services/api.js` with the same return shapes.
- **Ratings**: replace `src/services/community.js` with a ratings API (`communityAt`, `finalOthers`); move `submitRating` (store) to a server call; enforce windows and daily limits on the server.
- **Auth/profile**: replace `StoreProvider` persistence with an auth provider + user API.
- **Annotations** (sources, claims, framing notes) are editorial data and would need human review in production.
