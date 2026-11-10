// ─────────────────────────────────────────────────────────────────────────────
// THE single source of truth for what a reader may see about an article.
// Every page and component must ask visibilityFor() instead of deciding locally,
// so outlet, source and community information never leaks before a blind rating.
//
//   sealed   → open article, Rating Mode, not yet rated by you. Only the headline,
//              summary and article text may be shown. No outlet, byline, link,
//              sources, editorial analysis or community data.
//   revealed → you rated it, OR its window closed, OR you are in Browse Mode,
//              OR it was open during one of your Browse Mode sessions.
//   canRate  → open, not rated, Rating Mode, and not seen in Browse Mode.
// ─────────────────────────────────────────────────────────────────────────────
import { statusAt, windowFor } from './schedule.js';
import { seenInBrowse } from './modes.js';

/**
 * @param article the article record
 * @param viewer  { now, mode: 'rating'|'browse', ratingFor(id) → rating|null, browseSessions }
 */
export function visibilityFor(article, viewer) {
  const { now, mode, ratingFor, browseSessions } = viewer;
  const status = statusAt(article.id, now);
  const w = windowFor(article.id);
  const rating = ratingFor(article.id);
  const seen = !rating && seenInBrowse(article.id, browseSessions, rating);
  const published = status !== 'upcoming';
  const revealed = published && (status === 'closed' || !!rating || mode === 'browse' || seen);
  const sealed = published && !revealed;
  let reason = null;
  if (status === 'upcoming') reason = 'upcoming';
  else if (rating) reason = 'rated';
  else if (status === 'closed') reason = 'closed';
  else if (mode === 'browse') reason = 'browse';
  else if (seen) reason = 'seen-in-browse';
  return {
    status, published, sealed, revealed, rating,
    canRate: reason === null,
    reason,
    opensAt: w?.opensAt ?? null,
    closesAt: w?.closesAt ?? null,
    msLeft: w ? Math.max(0, w.closesAt - now) : 0,
  };
}
