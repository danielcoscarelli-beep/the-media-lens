// The five-option rating scale. Each submitted rating is stored as its point value.
// NOTE: this scale deliberately combines perceived bias, misleading presentation and factual
// accuracy in one dimension (product decision, 2026-11-10). The Methods page discloses this.
// A community score is an average of perceptions, not a fact-check.

export const RATING_OPTIONS = [
  { key: 'neutral', points: 100, label: 'Neutral / Factual', short: 'Neutral',
    help: 'Reports what happened in measured language, with claims you could check.' },
  { key: 'slight', points: 75, label: 'Slightly Biased', short: 'Slightly biased',
    help: 'Mostly straight, but a word choice or emphasis tilts the reader.' },
  { key: 'biased', points: 50, label: 'Biased', short: 'Biased',
    help: 'Framing, wording or selection clearly favors one interpretation.' },
  { key: 'very', points: 25, label: 'Very Biased / Misleading', short: 'Very biased',
    help: 'Built to persuade, or likely to leave readers with a false impression.' },
  { key: 'nonfactual', points: 0, label: 'Nonfactual', short: 'Nonfactual',
    help: 'Central claims appear false or unsupported, as far as you can judge.' },
];

export const POINT_VALUES = RATING_OPTIONS.map((o) => o.points); // [100, 75, 50, 25, 0]
export const isValidPoints = (p) => POINT_VALUES.includes(p);

/** Index 0–4 into RATING_OPTIONS (0 = Neutral/100 … 4 = Nonfactual/0). */
export const indexForPoints = (p) => POINT_VALUES.indexOf(p);
export const optionForPoints = (p) => RATING_OPTIONS[indexForPoints(p)] || null;

/** The option whose point value is nearest to an average score (ties go to the higher score). */
export function nearestOption(score) {
  const i = Math.min(4, Math.max(0, Math.round((100 - score) / 25 - 1e-9)));
  return RATING_OPTIONS[i];
}
/** Color step 0–4 for a score (same bands as nearestOption). */
export const toneForScore = (score) => RATING_OPTIONS.indexOf(nearestOption(score));
