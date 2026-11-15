// Score display and the rating slider.
// Every score is shown as one number (1–100, 100 = least biased) with a color that runs from
// pure gray (least biased) to pure red (most biased); see colorForScore in data/ratingScale.js.
import { useId } from 'react';
import { SCALE_MARKS, MIN_POINTS, MAX_POINTS, nearestMark, colorForScore, toneStyle } from '../data/ratingScale.js';
import { num } from '../lib/format.js';

/** Small square in the score's color. */
export function ScoreSwatch({ score }) {
  return <span className="swatch" style={toneStyle(score)} aria-hidden="true" />;
}

/** Compact "61/100" badge in the score's color. */
export function ScoreBadge({ score, n = null, final = false }) {
  if (score === null || score === undefined) return <span className="score-badge empty">No ratings yet</span>;
  const s = Math.round(score);
  return (
    <span className="score-badge" style={toneStyle(score)} title={`Community score ${s}/100 (100 = least biased; closest mark: ${nearestMark(score).label}). Community perception, not a fact-check.`}>
      <ScoreSwatch score={score} />
      <span className="sb-num tabular">{s}</span><span className="sb-den">/100</span>
      {n !== null && <span className="sb-n tabular">{num(n)} ratings{final ? ', final' : ''}</span>}
    </span>
  );
}

/** A reader's own rating, e.g. "You: 62". */
export function YourRating({ points, prefix = 'You: ' }) {
  return <span className="you-rating" style={toneStyle(points)}>{prefix}{points}</span>;
}

/** Position of a value on the slider track, in percent. */
export const trackPct = (p) => ((p - MIN_POINTS) / (MAX_POINTS - MIN_POINTS)) * 100;

/** Gray-to-red legend of the scale with its five labeled marks. */
export function ScaleLegend() {
  return (
    <div className="scale-legend" aria-hidden="true">
      <div className="scale-legend-bar" />
      <div className="slider-marks">{SCALE_MARKS.map((m) => <span key={m.points} className="slider-mark" style={{ left: `${trackPct(m.points)}%` }}><b className="tabular">{m.points}</b>{m.label}</span>)}</div>
    </div>
  );
}

/**
 * Rating slider, 1–100. `value` is null until the reader moves it: the thumb is hidden and
 * nothing is selected, so no starting position nudges the rating.
 */
export function RatingSlider({ value, onChange, name }) {
  const id = useId();
  const set = (e) => onChange(Number(e.target.value));
  const unset = value === null;
  const mark = unset ? null : nearestMark(value);
  return (
    <div className={`slider ${unset ? 'is-unset' : ''}`}>
      <div className="slider-readout" aria-live="polite">
        {unset
          ? <span className="muted">Move the slider to choose your rating.</span>
          : <><span className="slider-value tabular" style={toneStyle(value)}>{value}</span><span className="slider-den">/100</span><span className="slider-mark-label">Closest mark: <strong>{mark.label}</strong> <span className="muted">· {mark.help}</span></span></>}
      </div>
      <label htmlFor={id} className="sr-only">Rating from 1 (most biased) to 100 (least biased)</label>
      <input
        id={id} name={name} type="range" className="slider-input" min={MIN_POINTS} max={MAX_POINTS} step={1}
        value={unset ? 50 : value}
        style={unset ? undefined : { '--fill': colorForScore(value) }}
        aria-valuetext={unset ? 'Not set' : `${value}, closest to ${mark.label}`}
        onChange={set} onClick={set}
        onKeyDown={(e) => { if (unset && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) { e.preventDefault(); onChange(e.key === 'Home' ? MIN_POINTS : e.key === 'End' ? MAX_POINTS : 50); } }}
      />
      <div className="slider-marks">
        {SCALE_MARKS.map((m) => (
          <button type="button" key={m.points} className="slider-mark" style={{ left: `${trackPct(m.points)}%` }} onClick={() => onChange(m.points)} title={m.help}>
            <b className="tabular">{m.points}</b>{m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
