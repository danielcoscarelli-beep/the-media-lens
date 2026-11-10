# The Media Lens — prototype

A media-literacy platform for comparing how news organizations cover the same events, tracing claims to their sources, and evaluating headline framing. Front-end only; all content is hypothetical sample data.

## Run

```
npm install
npm run dev          # local dev server
npm run build:single # self-contained dist-single/index.html (opens from disk)
```

## Structure

```
src/
  data/        sample publications, events, articles, sources, claims, community seeds
  services/    api.js: the only data-access layer (swap for a real news API / DB)
  state/       store.jsx (profile, evaluations, journey; localStorage) · router.jsx (hash routes)
  lib/         reputation.js (simulated credibility model + limitations) · stats.js · text.js
  components/  Shell, Cards, Rating charts, EvaluationPanel, SourceMap, SourceParts, ui primitives
  pages/       Home, Explore, Compare, Article, BiasRatings, SourceExplorer, Profile, Methods
```

## Integration points
- **News data**: reimplement `src/services/api.js` with the same return shapes.
- **Auth/profile**: replace `StoreProvider` persistence with an auth provider + user API.
- **Evaluations**: `submitEvaluation` in `store.jsx` → POST to a backend; `aggregate()` would then read server counts.
- **Annotations** (sources, claims, framing notes) are editorial data and would need human review in production.
