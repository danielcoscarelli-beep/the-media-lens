import { REASONS } from '../data/community.js';

/** Combine seeded community counts with this user's evaluation (if any). */
export function aggregate(article, userEval) {
  const dist = [...article.community.dist];
  const reasons = { ...Object.fromEntries(Object.keys(REASONS).map((k) => [k, 0])), ...article.community.reasons };
  if (userEval) {
    dist[userEval.rating] += 1;
    userEval.reasons.forEach((r) => { reasons[r] = (reasons[r] || 0) + 1; });
  }
  const n = dist.reduce((a, b) => a + b, 0);
  const mean = n ? dist.reduce((a, c, i) => a + c * i, 0) / n : 0;
  const shares = dist.map((c) => (n ? c / n : 0));
  // Normalized entropy: 0 = everyone agrees, 1 = evenly split.
  const entropy = n ? -shares.reduce((a, p) => a + (p > 0 ? p * Math.log(p) : 0), 0) / Math.log(4) : 0;
  const modal = dist.indexOf(Math.max(...dist));
  const reasonTotal = Object.values(reasons).reduce((a, b) => a + b, 0);
  const topReasons = Object.entries(reasons).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: REASONS[key], count, share: reasonTotal ? count / reasonTotal : 0 }));
  return { dist, n, mean, shares, entropy, modal, topReasons };
}

export const meanLabel = (m) => (m < 0.5 ? 'Neutral' : m < 1.5 ? 'Slightly biased' : m < 2.5 ? 'Moderately biased' : 'Strongly biased');

export function pearson(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  if (sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}
