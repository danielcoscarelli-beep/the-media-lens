// ─────────────────────────────────────────────────────────────────────────────
// CROWD ALIGNMENT and percentile ranks.
//
// Crowd Alignment is The Media Lens's measure of rating skill: how closely your ratings
// anticipate the eventual community average (the "wisdom of the crowd").
//
// Per article (only after its window closes):
//   othersMean = final mean of everyone else's ratings (your own is always excluded)
//   error      = |your points − othersMean|
// The article counts ("eligible") only if at least MIN_CROWD other people rated it.
//
// Per person:
//   rawError      = mean error over eligible articles
//   adjustedError = (n·rawError + K·cohortMean) / (n + K)   ← shrinks small samples toward
//                   the cohort's typical error, so a few lucky guesses can't top the table
//   score         = 100 − adjustedError                     ← "Crowd Alignment", 0–100
//   percentile    = share of the ranked cohort with a larger adjustedError (ties count half)
// Rank status: < PROVISIONAL_MIN eligible → unranked; < RANK_MIN → provisional; else ranked.
//
// The cohort is the SIMULATED participants (services/community.js). They are scored by the
// same rule, using leave-one-out averages, plus a simulated prior track record.
// ─────────────────────────────────────────────────────────────────────────────
import { articles } from '../data/articles.js';
import { statusAt } from './schedule.js';
import { finalOthers, participants, simulatedRatings } from '../services/community.js';
import { leaveOneOutMean, mean } from './stats.js';

export const MIN_CROWD = 20;
export const PROVISIONAL_MIN = 5;
export const RANK_MIN = 15;
export const SHRINK_K = 5;

export const TIERS = [
  { name: 'Bronze', min: 0 },
  { name: 'Silver', min: 20 },
  { name: 'Gold', min: 40 },
  { name: 'Platinum', min: 60 },
  { name: 'Diamond', min: 75 },
  { name: 'Master', min: 90 },
  { name: 'Grandmaster', min: 97 },
];
export const tierFor = (pct) => [...TIERS].reverse().find((t) => pct >= t.min);
export const nextTier = (pct) => TIERS.find((t) => t.min > pct) || null;

export const shrink = (n, rawError, cohortMean) => (n * rawError + SHRINK_K * cohortMean) / (n + SHRINK_K);

/** Percentile of `value` among `others` where SMALLER is better (ties count half). */
export function percentileOf(value, others) {
  if (!others.length) return null;
  let worse = 0, equal = 0;
  for (const o of others) { if (o > value + 1e-9) worse++; else if (Math.abs(o - value) <= 1e-9) equal++; }
  return (100 * (worse + equal / 2)) / others.length;
}

const closedIds = (now) => articles.filter((a) => statusAt(a.id, now) === 'closed').map((a) => a.id);

let cohortCache = { key: null, value: null };
/** Score every simulated participant on the currently closed articles + their prior record. */
export function cohort(now) {
  const ids = closedIds(now);
  const key = ids.join(',');
  if (cohortCache.key === key) return cohortCache.value;
  const people = participants().map((p) => ({ id: p.id, errSum: p.priorErrSum, n: p.priorCount }));
  const byId = new Map(people.map((p) => [p.id, p]));
  for (const id of ids) {
    const f = finalOthers(id);
    if (f.n - 1 < MIN_CROWD) continue;
    for (const r of simulatedRatings(id)) {
      const loo = leaveOneOutMean(f.sum, f.n, r.points);
      const p = byId.get(r.pid); p.errSum += Math.abs(r.points - loo); p.n += 1;
    }
  }
  const ranked = people.filter((p) => p.n >= RANK_MIN).map((p) => ({ ...p, rawError: p.errSum / p.n }));
  const cohortMean = mean(ranked.map((p) => p.rawError));
  ranked.forEach((p) => { p.adjustedError = shrink(p.n, p.rawError, cohortMean); p.score = 100 - p.adjustedError; });
  const value = { members: ranked, cohortMean, size: ranked.length };
  cohortCache = { key, value };
  return value;
}

/** Outcome of one of YOUR ratings at time `now`. */
export function outcomeFor(rating, now) {
  const status = statusAt(rating.articleId, now);
  if (status !== 'closed') return { state: 'pending' };
  const f = finalOthers(rating.articleId); // never includes your own rating
  if (f.n < MIN_CROWD) return { state: 'thin', othersN: f.n };
  return { state: 'scored', othersN: f.n, othersMean: f.mean, error: Math.abs(rating.points - f.mean) };
}

/** Your Crowd Alignment, percentile and rank. */
export function userAlignment(ratings, now) {
  const c = cohort(now);
  const entries = ratings.map((r) => ({ rating: r, ...outcomeFor(r, now) }));
  const scored = entries.filter((e) => e.state === 'scored');
  const n = scored.length;
  const rawError = n ? mean(scored.map((e) => e.error)) : null;
  const adjustedError = n ? shrink(n, rawError, c.cohortMean) : null;
  const score = n ? 100 - adjustedError : null;
  const percentile = n ? percentileOf(adjustedError, c.members.map((m) => m.adjustedError)) : null;
  const status = n < PROVISIONAL_MIN ? 'unranked' : n < RANK_MIN ? 'provisional' : 'ranked';
  const tier = status === 'unranked' ? null : tierFor(percentile);
  const next = status === 'unranked' ? null : nextTier(percentile);
  return {
    entries, eligible: n, rawError, adjustedError, score, percentile, status, tier, next,
    pending: entries.filter((e) => e.state === 'pending').length,
    thin: entries.filter((e) => e.state === 'thin').length,
    toProvisional: Math.max(0, PROVISIONAL_MIN - n),
    toRanked: Math.max(0, RANK_MIN - n),
    cohort: c,
  };
}
