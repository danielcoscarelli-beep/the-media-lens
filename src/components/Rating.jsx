import { RATING_LABELS } from '../data/community.js';
import { pct } from '../lib/format.js';

export function DistributionBar({ dist, compact = false, highlight = null }) {
  const n = dist.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className={`dist ${compact ? 'dist-compact' : ''}`}>
      <div className="dist-bar" role="img" aria-label={dist.map((c, i) => `${RATING_LABELS[i]} ${pct(c, n)}%`).join(', ')}>
        {dist.map((c, i) => (
          <span key={i} className={`dist-seg r${i} ${highlight === i ? 'is-you' : ''}`} style={{ width: `${(c / n) * 100}%` }} title={`${RATING_LABELS[i]}: ${pct(c, n)}%`} />
        ))}
      </div>
      {!compact && (
        <ul className="dist-legend">
          {dist.map((c, i) => (
            <li key={i} className={highlight === i ? 'is-you' : ''}>
              <span className={`swatch r${i}`} />
              <span className="dl-label">{RATING_LABELS[i]}</span>
              <span className="dl-val">{pct(c, n)}%</span>
              <span className="dl-n">{c.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 0–3 scale with community mean and, optionally, the user's own rating. */
export function ScaleMarker({ mean, you = null, spread = null }) {
  const x = (v) => `${(v / 3) * 100}%`;
  return (
    <div className="scale">
      <div className="scale-track">
        {[0, 1, 2, 3].map((i) => <span key={i} className="scale-tick" style={{ left: x(i) }} />)}
        {spread && <span className="scale-spread" style={{ left: x(spread[0]), width: `${((spread[1] - spread[0]) / 3) * 100}%` }} />}
        <span className="scale-mean" style={{ left: x(mean) }} title={`Community mean ${mean.toFixed(2)}`}><span>Community {mean.toFixed(2)}</span></span>
        {you !== null && <span className="scale-you" style={{ left: x(you) }} title="Your rating"><span>You</span></span>}
      </div>
      <div className="scale-labels">{['Neutral', 'Slight', 'Moderate', 'Strong'].map((l) => <span key={l}>{l}</span>)}</div>
    </div>
  );
}

export function ReasonBars({ reasons, mine = [], limit = 5 }) {
  const max = Math.max(...reasons.map((r) => r.count), 1);
  return (
    <ul className="reason-bars">
      {reasons.slice(0, limit).map((r) => (
        <li key={r.key} className={mine.includes(r.key) ? 'is-you' : ''}>
          <div className="rb-top"><span>{r.label}{mine.includes(r.key) && <em className="you-chip">you</em>}</span><span className="tabular">{Math.round(r.share * 100)}%</span></div>
          <div className="rb-track"><span style={{ width: `${(r.count / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}
