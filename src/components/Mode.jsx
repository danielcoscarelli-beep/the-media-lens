// Rating Mode / Browse Mode controls. Rules live in lib/modes.js; state in the store.
import { useEffect, useRef, useState } from 'react';
import { articles } from '../data/articles.js';
import { MIN_DAILY_RATINGS } from '../lib/modes.js';
import { nextLocalMidnight } from '../lib/clock.js';
import { useStore } from '../state/store.jsx';
import { Countdown } from './Status.jsx';
import { Icon } from './ui.jsx';

export function ModeDialog({ onClose }) {
  const { enterBrowse, vis, now } = useStore();
  const ref = useRef(null);
  const openUnrated = articles.filter((a) => { const v = vis(a); return v.status === 'open' && v.canRate; }).length;
  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mode-dialog-title" ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="kicker">Switch modes</div>
        <h2 id="mode-dialog-title" className="modal-title">Enter Browse Mode for the rest of today?</h2>
        <ul className="modal-list">
          <li>You’ll see live community scores, publications and sources for every article.</li>
          <li><strong>You won’t be able to submit any ratings until tomorrow</strong> (local midnight, in <Countdown until={nextLocalMidnight(now)} />).</li>
          {openUnrated > 0 && <li>The {openUnrated} open article{openUnrated === 1 ? '' : 's'} you haven’t rated can’t be rated later, even after Browse Mode ends, because you’ll have seen {openUnrated === 1 ? 'its' : 'their'} results.</li>}
        </ul>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Keep rating</button>
          <button className="btn btn-primary" onClick={() => { if (enterBrowse()) onClose(); }}>Enter Browse Mode</button>
        </div>
      </div>
    </div>
  );
}

/** Persistent bar under the navigation: which mode you're in and how to switch. */
export function ModeBar() {
  const { mode, ratedToday, canEnterBrowse, now } = useStore();
  const [open, setOpen] = useState(false);
  const left = Math.max(0, MIN_DAILY_RATINGS - ratedToday);
  return (
    <div className={`modebar ${mode === 'browse' ? 'is-browse' : 'is-rating'}`} role="region" aria-label="Current mode">
      <div className="modebar-inner">
        <span className="mode-name"><span className="mode-dot" aria-hidden="true" />{mode === 'browse' ? 'Browse Mode' : 'Rating Mode'}</span>
        {mode === 'rating' ? (
          <>
            <span className="mode-desc">Outlets, sources and community scores stay hidden until you rate each article.</span>
            <span className="mode-progress" aria-label={`${Math.min(ratedToday, MIN_DAILY_RATINGS)} of ${MIN_DAILY_RATINGS} ratings today`}>
              {Array.from({ length: MIN_DAILY_RATINGS }).map((_, i) => <span key={i} className={`mp-dot ${i < ratedToday ? 'on' : ''}`} />)}
              <span className="tabular">{ratedToday} rated today</span>
            </span>
            <button className="btn btn-sm mode-btn" disabled={!canEnterBrowse} onClick={() => setOpen(true)} title={canEnterBrowse ? '' : `Rate ${left} more article${left === 1 ? '' : 's'} today to unlock Browse Mode`}>
              {canEnterBrowse ? 'Enter Browse Mode' : `Rate ${left} more to unlock Browse Mode`}
            </button>
          </>
        ) : (
          <>
            <span className="mode-desc">Live scores, publications and sources are visible. Rating is paused.</span>
            <span className="mode-progress"><Icon name="lock" size={12} /> Rating resumes in <Countdown until={nextLocalMidnight(now)} /></span>
          </>
        )}
      </div>
      {open && <ModeDialog onClose={() => setOpen(false)} />}
    </div>
  );
}
