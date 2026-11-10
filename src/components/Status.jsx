import { useEffect, useState } from 'react';
import { now as clockNow } from '../lib/clock.js';
import { fmtDuration } from '../lib/format.js';
import { Icon } from './ui.jsx';

/** Ticks once per second using the app clock. */
export function useTick(ms = 1000) {
  const [t, setT] = useState(clockNow);
  useEffect(() => { const id = setInterval(() => setT(clockNow()), ms); return () => clearInterval(id); }, [ms]);
  return t;
}

/** Live countdown to `until`. */
export function Countdown({ until, prefix = '', done = 'Closed' }) {
  const t = useTick();
  const left = until - t;
  return <span className="tabular countdown">{left > 0 ? `${prefix}${fmtDuration(left)}` : done}</span>;
}

/** Status of an article's rating window, from a visibility object. */
export function StatusBadge({ v, compact = false }) {
  if (!v.published) return <span className="status-pill st-upcoming">Not yet published</span>;
  if (v.status === 'closed') return <span className="status-pill st-closed"><Icon name="lock" size={11} /> Closed to new ratings</span>;
  const label = v.rating ? 'You rated' : v.canRate ? 'Open for blind rating' : 'Open';
  return (
    <span className={`status-pill ${v.canRate ? 'st-open' : 'st-live'}`}>
      <span className="pulse" aria-hidden="true" />{label}{!compact && ' · '}{!compact && <Countdown until={v.closesAt} done="closing…" />}{!compact && ' left'}
    </span>
  );
}

/** Placeholder shown wherever a sealed article's publication would appear. */
export function SealedPub({ size = 'sm' }) {
  return (
    <span className="pubname sealed-pub" title="The publication is hidden until you rate this article">
      <span className={`pubmark pubmark-${size} pubmark-sealed`} aria-hidden="true">?</span>
      <span>Publication hidden</span>
    </span>
  );
}
