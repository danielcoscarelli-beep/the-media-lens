// ─────────────────────────────────────────────────────────────────────────────
// SIMULATED COMMUNITY (prototype stand-in for a real ratings backend).
//
// There is no server, so other participants are simulated: 300 "simulated readers"
// with different habits (careful, erratic, leaning high or low). Everything is
// generated from fixed seeds, so the same timeline always produces the same results.
// Each simulated rating gets a moment inside the article's 24-hour window, so live
// counts and averages grow while a window is open.
//
// The genuine user's ratings are NEVER mixed into these arrays; they are added on top
// where the UI shows a community score (see communityAt). That keeps simulated and
// genuine activity distinguishable, and makes "exclude your own rating" exact.
//
// A real backend would replace this module with API calls that return the same shapes.
// ─────────────────────────────────────────────────────────────────────────────
import { articles, getArticle } from '../data/articles.js';
import { POINT_VALUES } from '../data/ratingScale.js';
import { windowFor, WINDOW_MS } from '../lib/schedule.js';
import { summarize } from '../lib/stats.js';

export const SIM_PARTICIPANTS = 300;

// Small deterministic PRNG (mulberry32) + string hashing.
function seedOf(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
function rng(seed) { let a = seedOf(seed); return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(r) { const u = Math.max(r(), 1e-12), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const snap = (x) => POINT_VALUES.reduce((best, p) => (Math.abs(p - x) < Math.abs(best - x) ? p : best), 100);

let participantsCache = null;
/** The simulated cohort. Labels make clear these are not real people. */
export function participants() {
  if (participantsCache) return participantsCache;
  participantsCache = Array.from({ length: SIM_PARTICIPANTS }, (_, i) => {
    const r = rng(`participant-${i}`);
    const p = {
      id: `sim-${String(i + 1).padStart(3, '0')}`,
      name: `Simulated reader ${String(i + 1).padStart(3, '0')}`,
      noise: 3 + 21 * Math.pow(r(), 1.5), // how erratic their judgments are
      lean: gauss(r) * 5,                  // tendency to rate high or low
      activity: 0.35 + 0.55 * r(),         // how often they rate
      priorCount: Math.floor(15 + 110 * r()),
    };
    // Simulated track record from before this sample timeline (needed so percentiles exist
    // on day one). Each prior error = distance from that article's (simulated) crowd average.
    const errs = [];
    for (let k = 0; k < p.priorCount; k++) {
      const center = 25 + 70 * r(), spread = 8 + 22 * r();
      const own = snap(center + p.lean + gauss(r) * Math.sqrt((0.6 * spread) ** 2 + (0.6 * p.noise) ** 2));
      const crowd = center + gauss(r) * 3;
      errs.push(Math.abs(own - crowd));
    }
    p.priorErrSum = errs.reduce((a, b) => a + b, 0);
    return p;
  });
  return participantsCache;
}

const ratingsCache = new Map();
/** All simulated ratings for one article: [{ pid, points, frac }], frac = position in the window 0–1. */
export function simulatedRatings(articleId) {
  if (ratingsCache.has(articleId)) return ratingsCache.get(articleId);
  const a = getArticle(articleId);
  const out = [];
  if (a) {
    const { center, spread, traffic } = a.crowd;
    const reach = traffic < 0.1 ? traffic : 0.35 + 0.65 * traffic;
    for (const p of participants()) {
      const r = rng(`${a.ref}|${p.id}`);
      if (r() > p.activity * reach) continue;
      const points = snap(center + p.lean + gauss(r) * Math.sqrt((0.6 * spread) ** 2 + (0.6 * p.noise) ** 2));
      out.push({ pid: p.id, points, frac: Math.pow(r(), 1.8) }); // more ratings early in the window
    }
  }
  ratingsCache.set(articleId, out);
  return out;
}

/**
 * Community ratings visible at time t: simulated ratings submitted by t, plus the genuine
 * user's rating if it exists and was submitted by t. Returns summarize() output plus
 * `simulatedN` and `includesYou`.
 */
export function communityAt(articleId, t, userRating = null) {
  const w = windowFor(articleId);
  if (!w || t < w.opensAt) return { ...summarize([]), simulatedN: 0, includesYou: false };
  const until = Math.min(t, w.closesAt);
  const pts = simulatedRatings(articleId).filter((x) => w.opensAt + x.frac * WINDOW_MS <= until).map((x) => x.points);
  const simulatedN = pts.length;
  const includesYou = !!(userRating && new Date(userRating.submittedAt).getTime() <= t);
  if (includesYou) pts.push(userRating.points);
  return { ...summarize(pts), simulatedN, includesYou };
}

/** Final ratings of everyone except the genuine user (used for Crowd Alignment). */
export const finalOthers = (articleId) => summarize(simulatedRatings(articleId).map((x) => x.points));

/** Number of simulated ratings submitted across all articles in [t0, t1). For the live activity line. */
export function simulatedActivity(t0, t1) {
  let n = 0;
  for (const a of articles) {
    const w = windowFor(a.id); if (!w) continue;
    for (const x of simulatedRatings(a.id)) { const ts = w.opensAt + x.frac * WINDOW_MS; if (ts >= t0 && ts < t1) n++; }
  }
  return n;
}
