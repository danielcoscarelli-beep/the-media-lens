// The rating scale: a slider from 1 to 100, where 100 = least biased.
// Readers can pick any whole number. Five labeled marks give the scale its meaning.
// NOTE: the scale deliberately combines perceived bias, misleading presentation and factual
// accuracy in one dimension (product decision, 2026-11-10). The Methods page discloses this.
// A community score is an average of perceptions, not a fact-check.

export const MIN_POINTS = 1;
export const MAX_POINTS = 100;

/** Labeled marks on the slider, from least to most biased. */
export const SCALE_MARKS = [
  { points: 100, label: 'Nonbiased', help: 'Reports what happened in measured language, with claims you could check.' },
  { points: 75, label: 'Slightly biased', help: 'Mostly straight, but a word choice or emphasis tilts the reader.' },
  { points: 50, label: 'Biased', help: 'Framing, wording or selection clearly favors one interpretation.' },
  { points: 25, label: 'Very biased / Misleading', help: 'Built to persuade, or likely to leave readers with a false impression.' },
  { points: 1, label: 'Nonfactual', help: 'Central claims appear false or unsupported, as far as you can judge.' },
];

export const isValidPoints = (p) => Number.isInteger(p) && p >= MIN_POINTS && p <= MAX_POINTS;
export const clampPoints = (x) => Math.min(MAX_POINTS, Math.max(MIN_POINTS, Math.round(x)));

/** The labeled mark closest to a score (ties go to the less biased mark). */
export function nearestMark(score) {
  return SCALE_MARKS.reduce((best, m) => (Math.abs(m.points - score) < Math.abs(best.points - score) ? m : best));
}

/**
 * Color for a score: pure gray (#808080) at 100, least biased → pure red (#ff0000) at 1, most biased.
 * Linear blend in between, so every score has its own shade.
 */
export function colorForScore(score) {
  const t = Math.min(1, Math.max(0, (MAX_POINTS - score) / (MAX_POINTS - MIN_POINTS)));
  const mix = (a, b) => Math.round(a + (b - a) * t);
  return `rgb(${mix(128, 255)}, ${mix(128, 0)}, ${mix(128, 0)})`;
}

/** Inline style that sets --rc (the rating color used by score badges and markers). */
export const toneStyle = (score) => (score === null || score === undefined ? undefined : { '--rc': colorForScore(score) });
