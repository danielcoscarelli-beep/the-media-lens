/**
 * Summarize a list of point values (each a whole number 1–100).
 * mean = arithmetic mean (the community score).
 */
export function summarize(points) {
  let sum = 0;
  for (const p of points) sum += p;
  const n = points.length;
  return { n, sum, mean: n ? sum / n : null };
}

/** Mean of everyone except one rating ("leave-one-out"). Returns null if nobody else rated. */
export const leaveOneOutMean = (sum, n, own) => (n > 1 ? (sum - own) / (n - 1) : null);

export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
