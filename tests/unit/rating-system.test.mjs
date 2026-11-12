// Unit tests for the rating system's pure logic. Run with: npm test
// Uses Node's built-in test runner (no extra dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { __setClockForTests, HOUR, DAY, localDayKey } from '../../src/lib/clock.js';

const EPOCH = new Date(2026, 10, 10, 9, 0, 0).getTime(); // Nov 10 2026, 09:00 local
__setClockForTests({ epoch: EPOCH, offsetMs: 0 });

const { RATING_OPTIONS, POINT_VALUES, nearestOption } = await import('../../src/data/ratingScale.js');
const { summarize, leaveOneOutMean } = await import('../../src/lib/stats.js');
const { windowFor, statusAt, WINDOW_MS } = await import('../../src/lib/schedule.js');
const { communityAt, finalOthers, simulatedRatings } = await import('../../src/services/community.js');
const { ratedTodayCount, modeFor, canEnterBrowse, seenInBrowse } = await import('../../src/lib/modes.js');
const { visibilityFor } = await import('../../src/lib/visibility.js');
const A = await import('../../src/lib/alignment.js');
const { articles } = await import('../../src/data/articles.js');

const byRef = (ref) => articles.find((a) => a.ref === ref);
const rating = (articleId, points, ts) => ({ articleId, points, submittedAt: new Date(ts).toISOString() });

test('five options with the required point values', () => {
  assert.deepEqual(RATING_OPTIONS.map((o) => [o.label, o.points]), [
    ['Neutral / Factual', 100], ['Slightly Biased', 75], ['Biased', 50], ['Very Biased / Misleading', 25], ['Nonfactual', 0]]);
  assert.deepEqual(POINT_VALUES, [100, 75, 50, 25, 0]);
});

test('nearest category bands', () => {
  const k = (s) => nearestOption(s).key;
  assert.equal(k(100), 'neutral'); assert.equal(k(87.5), 'neutral'); assert.equal(k(87.4), 'slight');
  assert.equal(k(62.5), 'slight'); assert.equal(k(62.4), 'biased'); assert.equal(k(37.5), 'biased');
  assert.equal(k(12.5), 'very'); assert.equal(k(12.4), 'nonfactual'); assert.equal(k(0), 'nonfactual');
});

test('community score is the arithmetic mean of point values', () => {
  const s = summarize([100, 75, 50, 25, 0]);
  assert.equal(s.mean, 50); assert.deepEqual(s.dist, [1, 1, 1, 1, 1]); assert.ok(Math.abs(s.entropy - 1) < 1e-9);
  assert.equal(summarize([100, 100, 75, 50]).mean, 81.25);
  assert.equal(summarize([]).mean, null);
  assert.equal(leaveOneOutMean(250, 3, 100), 75);
  assert.equal(leaveOneOutMean(100, 1, 100), null);
});

test('24-hour windows: exact boundaries', () => {
  const a = byRef('ap-permitting');
  const w = windowFor(a.id);
  assert.equal(w.closesAt - w.opensAt, WINDOW_MS); assert.equal(WINDOW_MS, DAY);
  assert.equal(statusAt(a.id, w.opensAt - 1), 'upcoming');
  assert.equal(statusAt(a.id, w.opensAt), 'open');
  assert.equal(statusAt(a.id, w.closesAt - 1), 'open');
  assert.equal(statusAt(a.id, w.closesAt), 'closed');
});

test('demo schedule at first visit: some closed, featured open, some upcoming', () => {
  assert.equal(statusAt(byRef('npr-map').id, EPOCH), 'closed');
  assert.equal(statusAt(byRef('fox-permitting').id, EPOCH), 'open');
  assert.equal(statusAt(byRef('ap-water').id, EPOCH), 'upcoming');
});

test('live community grows over the window; your rating only counts after you submit', () => {
  const a = byRef('nyt-permitting'); const w = windowFor(a.id);
  const early = communityAt(a.id, w.opensAt + HOUR), late = communityAt(a.id, w.opensAt + 20 * HOUR), end = communityAt(a.id, w.closesAt + DAY);
  assert.ok(early.n <= late.n && late.n <= end.n);
  assert.equal(end.n, finalOthers(a.id).n);
  const mine = rating(a.id, 0, w.opensAt + 2 * HOUR);
  assert.equal(communityAt(a.id, w.opensAt + HOUR, mine).includesYou, false);
  const after = communityAt(a.id, w.closesAt, mine);
  assert.equal(after.includesYou, true); assert.equal(after.n, end.n + 1);
});

test('daily count uses the local calendar day', () => {
  const late = new Date(2026, 10, 10, 23, 59).getTime(), early = new Date(2026, 10, 11, 0, 1).getTime();
  const rs = [rating('x', 100, late), rating('y', 100, late - HOUR), rating('z', 100, early)];
  assert.equal(ratedTodayCount(rs, late), 2);
  assert.equal(ratedTodayCount(rs, early), 1);
  assert.notEqual(localDayKey(late), localDayKey(early));
});

test('Browse Mode needs 3 ratings today and lasts until local midnight', () => {
  const t = new Date(2026, 10, 10, 15, 0).getTime();
  const two = [rating('a', 100, t - 1), rating('b', 75, t - 2)];
  assert.equal(canEnterBrowse(two, [], t), false);
  const three = [...two, rating('c', 50, t - 3)];
  assert.equal(canEnterBrowse(three, [], t), true);
  const sessions = [{ day: localDayKey(t), enteredAt: t }];
  assert.equal(modeFor(sessions, t + HOUR), 'browse');
  assert.equal(canEnterBrowse(three, sessions, t + HOUR), false);
  const nextDay = new Date(2026, 10, 11, 0, 0, 1).getTime();
  assert.equal(modeFor(sessions, nextDay), 'rating');
});

test('articles open during a Browse session can never be rated later', () => {
  const a = byRef('cnn-permitting'); const w = windowFor(a.id);
  const sessions = [{ day: localDayKey(w.opensAt + HOUR), enteredAt: w.opensAt + HOUR }];
  assert.equal(seenInBrowse(a.id, sessions, null), true);
  assert.equal(seenInBrowse(a.id, sessions, rating(a.id, 50, w.opensAt + 10 * 60e3)), false); // rated before browsing
  const later = [{ day: localDayKey(w.closesAt + DAY), enteredAt: w.closesAt + DAY }];
  assert.equal(seenInBrowse(a.id, later, null), false);
});

test('visibility matrix', () => {
  const a = byRef('wsj-permitting'); const w = windowFor(a.id); const t = w.opensAt + HOUR;
  const v = (over) => visibilityFor(a, { now: t, mode: 'rating', ratingFor: () => null, browseSessions: [], ...over });
  let x = v({});                       assert.deepEqual([x.sealed, x.revealed, x.canRate], [true, false, true]);
  x = v({ ratingFor: () => rating(a.id, 75, t - 1) }); assert.deepEqual([x.sealed, x.revealed, x.canRate, x.reason], [false, true, false, 'rated']);
  x = v({ mode: 'browse' });           assert.deepEqual([x.sealed, x.revealed, x.canRate, x.reason], [false, true, false, 'browse']);
  x = v({ now: w.closesAt });          assert.deepEqual([x.sealed, x.revealed, x.canRate, x.reason], [false, true, false, 'closed']);
  x = v({ now: w.opensAt - 1 });       assert.deepEqual([x.published, x.sealed, x.canRate], [false, false, false]);
  const nextMorning = w.opensAt + 20 * HOUR;
  x = v({ now: nextMorning, browseSessions: [{ day: localDayKey(t), enteredAt: t }] });
  assert.deepEqual([x.revealed, x.canRate, x.reason], [true, false, 'seen-in-browse']);
});

test('rank tiers, shrinkage and percentiles', () => {
  assert.equal(A.tierFor(19.99).name, 'Bronze'); assert.equal(A.tierFor(20).name, 'Silver');
  assert.equal(A.tierFor(96.9).name, 'Master'); assert.equal(A.tierFor(97).name, 'Grandmaster');
  assert.equal(A.nextTier(97), null);
  assert.equal(A.shrink(5, 10, 20), 15);                 // 5 ratings: halfway to the cohort mean
  assert.ok(Math.abs(A.shrink(45, 10, 20) - 11) < 1e-9);  // many ratings: close to own error
  assert.equal(A.percentileOf(10, [5, 10, 20, 30]), 62.5); // 2 worse + half of 1 tie
});

test('Crowd Alignment excludes your own rating and needs 20 other ratings', () => {
  const later = EPOCH + 10 * DAY; // everything closed
  const a = byRef('fox-permitting');
  const f = finalOthers(a.id);
  const o100 = A.outcomeFor(rating(a.id, 100, EPOCH), later), o0 = A.outcomeFor(rating(a.id, 0, EPOCH), later);
  assert.equal(o100.othersMean, f.mean); assert.equal(o0.othersMean, f.mean); // own rating never moves the comparison
  assert.ok(Math.abs(o100.error - Math.abs(100 - f.mean)) < 1e-9);
  assert.equal(A.outcomeFor(rating(byRef('bbg-chips').id, 75, EPOCH), later).state, 'thin');
  assert.equal(A.outcomeFor(rating(a.id, 75, EPOCH), EPOCH).state, 'pending');
});

test('cohort scores use leave-one-out averages', () => {
  const later = EPOCH + 10 * DAY;
  const c = A.cohort(later);
  assert.ok(c.size >= 250 && c.cohortMean > 5 && c.cohortMean < 30);
  const a = byRef('cnn-permitting'); const f = finalOthers(a.id); const r0 = simulatedRatings(a.id)[0];
  const loo = (f.sum - r0.points) / (f.n - 1);
  assert.notEqual(loo, f.mean);
});

test('rank status thresholds and a careful predictor outranks a contrarian', () => {
  const later = EPOCH + 10 * DAY;
  const eligible = articles.filter((a) => finalOthers(a.id).n >= A.MIN_CROWD);
  const snapTo = (m) => POINT_VALUES.reduce((b, p) => (Math.abs(p - m) < Math.abs(b - m) ? p : b), 100);
  const careful = eligible.map((a) => rating(a.id, snapTo(finalOthers(a.id).mean), EPOCH));
  const contrarian = eligible.map((a) => rating(a.id, finalOthers(a.id).mean > 50 ? 0 : 100, EPOCH));
  assert.equal(A.userAlignment(careful.slice(0, 4), later).status, 'unranked');
  assert.equal(A.userAlignment(careful.slice(0, 5), later).status, 'provisional');
  assert.equal(A.userAlignment(careful.slice(0, 14), later).status, 'provisional');
  assert.equal(A.userAlignment(careful.slice(0, 15), later).status, 'ranked');
  const good = A.userAlignment(careful, later), bad = A.userAlignment(contrarian, later);
  assert.ok(good.percentile > 80, `careful percentile ${good.percentile}`);
  assert.ok(bad.percentile < 5, `contrarian percentile ${bad.percentile}`);
  assert.ok(good.score > bad.score);
  // A few lucky guesses are pulled toward the cohort average.
  const lucky = A.userAlignment(careful.slice(0, 5), later);
  assert.ok(lucky.adjustedError > lucky.rawError);
});
