import { POINT_VALUES, indexForPoints } from '../data/ratingScale.js';

/**
 * Summarize a list of point values (each 0, 25, 50, 75 or 100).
 * mean = arithmetic mean (the community score, 0–100).
 * dist = counts per option in RATING_OPTIONS order [100, 75, 50, 25, 0].
 * entropy = normalized 0 (everyone agrees) … 1 (evenly split across all five options).
 */
export function summarize(points) {
  const dist = POINT_VALUES.map(() => 0);
  let sum = 0;
  for (const p of points) { dist[indexForPoints(p)] += 1; sum += p; }
  const n = points.length;
  const mean = n ? sum / n : null;
  const shares = dist.map((c) => (n ? c / n : 0));
  const entropy = n ? -shares.reduce((a, s) => a + (s > 0 ? s * Math.log(s) : 0), 0) / Math.log(POINT_VALUES.length) : 0;
  return { n, sum, mean, dist, shares, entropy, divided: n >= 10 && entropy > 0.8 };
}

/** Mean of everyone except one rating ("leave-one-out"). Returns null if nobody else rated. */
export const leaveOneOutMean = (sum, n, own) => (n > 1 ? (sum - own) / (n - 1) : null);

export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
