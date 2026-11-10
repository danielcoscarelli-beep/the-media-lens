// ─────────────────────────────────────────────────────────────────────────────
// Rating Mode / Browse Mode rules (pure functions, unit-tested).
//
// - Everyone starts each local calendar day in Rating Mode.
// - Entering Browse Mode requires at least MIN_DAILY_RATINGS ratings submitted today.
// - Browse Mode lasts until the next local midnight. During it, no ratings can be submitted.
// - Any article whose rating window overlapped a Browse Mode session (and that you hadn't
//   already rated) can never be rated by you: you may have seen its live results.
// All "today" checks use the app clock (lib/clock.js), so they survive refreshes and restarts.
// ─────────────────────────────────────────────────────────────────────────────
import { localDayKey, nextLocalMidnight } from './clock.js';
import { windowFor } from './schedule.js';

export const MIN_DAILY_RATINGS = 3;

export const ratedTodayCount = (ratings, now) =>
  ratings.filter((r) => localDayKey(new Date(r.submittedAt).getTime()) === localDayKey(now)).length;

export const modeFor = (browseSessions, now) =>
  (browseSessions.some((s) => s.day === localDayKey(now)) ? 'browse' : 'rating');

export function canEnterBrowse(ratings, browseSessions, now) {
  return modeFor(browseSessions, now) === 'rating' && ratedTodayCount(ratings, now) >= MIN_DAILY_RATINGS;
}

export const browseIntervals = (browseSessions) =>
  browseSessions.map((s) => ({ start: s.enteredAt, end: nextLocalMidnight(s.enteredAt) }));

/** True if the article was open at some moment while you were in Browse Mode (and not rated before that). */
export function seenInBrowse(articleId, browseSessions, rating) {
  const w = windowFor(articleId);
  if (!w) return false;
  const ratedAt = rating ? new Date(rating.submittedAt).getTime() : Infinity;
  return browseIntervals(browseSessions).some((iv) => iv.start < w.closesAt && iv.end > w.opensAt && ratedAt > iv.start);
}
