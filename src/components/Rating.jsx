// Charts for the five-option scale. Tone classes r0…r4 map to RATING_OPTIONS order
// (r0 = Neutral/Factual 100 … r4 = Nonfactual 0) and use the --r0…--r4 color tokens.
import { RATING_OPTIONS, indexForPoints, nearestOption, toneForScore } from '../data/ratingScale.js';
import { pct, num } from '../lib/format.js';

export function DistributionBar({ dist, compact = false, highlightPoints = null }) {
  const n = dist.reduce((a, b) => a + b, 0) || 1;
  const hi = highlightPoints === null ? -1 : indexForPoints(highlightPoints);
  return (
    <div className={`dist ${compact ? 'dist-compact' : ''}`}>
      <div className="dist-bar" role="img" aria-label={dist.map((c, i) => `${RATING_OPTIONS[i].label} ${pct(c, n)}%`).join(', ')}>
        {dist.map((c, i) => (
          <span key={i} className={`dist-seg r${i} ${hi === i ? 'is-you' : ''}`} style={{ width: `${(c / n) * 100}%` }} title={`${RATING_OPTIONS[i].label}: ${pct(c, n)}%`} />
        ))}
      </div>
      {!compact && (
        <ul className="dist-legend">
          {dist.map((c, i) => (
            <li key={i} className={hi === i ? 'is-you' : ''}>
              <span className={`swatch r${i}`} />
              <span className="dl-label">{RATING_OPTIONS[i].label}{hi === i && <em className="you-chip">you</em>}</span>
              <span className="dl-pts tabular">{RATING_OPTIONS[i].points}</span>
              <span className="dl-val tabular">{pct(c, n)}%</span>
              <span className="dl-n tabular">{num(c)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 0–100 axis with the community score and (optionally) your rating. */
export function ScoreScale({ score, you = null }) {
  const x = (v) => `${v}%`;
  return (
    <div className="scale">
      <div className="scale-track">
        {[0, 25, 50, 75, 100].map((v) => <span key={v} className="scale-tick" style={{ left: x(v) }} />)}
        {score !== null && <span className="scale-mean" style={{ left: x(score) }} title={`Community score ${Math.round(score)}`}><span>Community {Math.round(score)}</span></span>}
        {you !== null && <span className="scale-you" style={{ left: x(you) }} title={`Your rating ${you}`}><span>You {you}</span></span>}
      </div>
      <div className="scale-labels"><span>0 Nonfactual</span><span>50 Biased</span><span>100 Neutral</span></div>
    </div>
  );
}

/** Compact "61/100" badge colored by the nearest category. */
export function ScoreBadge({ score, n = null, final = false }) {
  if (score === null || score === undefined) return <span className="score-badge empty">No ratings yet</span>;
  const opt = nearestOption(score);
  return (
    <span className={`score-badge r${toneForScore(score)}`} title={`Community score ${Math.round(score)}/100, closest to “${opt.label}”. Community perception, not a fact-check.`}>
      <span className="sb-num tabular">{Math.round(score)}</span><span className="sb-den">/100</span>
      <span className="sb-label">{opt.short}</span>
      {n !== null && <span className="sb-n tabular">{num(n)} ratings{final ? ', final' : ''}</span>}
    </span>
  );
}
