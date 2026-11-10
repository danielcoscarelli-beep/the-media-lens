// ─────────────────────────────────────────────────────────────────────────────
// Blind rating → reveal.
//
// Before submitting: five option cards and a Submit button. Nothing about the outlet,
// sources or community result is rendered.
// After submitting: the reveal sequence (see useReveal) shows the community score,
// distribution, rating count and — via the parent page — the publication and sources.
// When the reader can't rate (closed, Browse Mode, already rated, seen in Browse Mode),
// the panel shows the result view directly.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { RATING_OPTIONS, nearestOption, optionForPoints } from '../data/ratingScale.js';
import { communityAt } from '../services/community.js';
import { outcomeFor, MIN_CROWD } from '../lib/alignment.js';
import { num } from '../lib/format.js';
import { useStore } from '../state/store.jsx';
import { Link } from '../state/router.jsx';
import { DistributionBar, ScoreScale } from './Rating.jsx';
import { Countdown } from './Status.jsx';
import { Headline, Icon } from './ui.jsx';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveal stages: 1 rating locked · 2 score · 3 distribution & count · 4 publication · 5 sources & analysis.
 * stage === null means "not animating" (everything allowed to show).
 */
export function useReveal() {
  const [stage, setStage] = useState(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const start = () => {
    timers.current.forEach(clearTimeout);
    if (reducedMotion()) { setStage(5); return; }
    setStage(1);
    [[2, 450], [3, 1500], [4, 2200], [5, 2900]].forEach(([s, ms]) => timers.current.push(setTimeout(() => setStage(s), ms)));
  };
  return { stage, start, done: stage === null || stage >= 5 };
}
export const shown = (stage, k) => stage === null || stage >= k;

function CountUp({ to, run }) {
  const [v, setV] = useState(run ? 0 : to);
  useEffect(() => {
    if (!run || reducedMotion()) { setV(to); return undefined; }
    let raf; const t0 = performance.now();
    const step = (t) => { const p = Math.min(1, (t - t0) / 900); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return <>{Math.round(v)}</>;
}

export default function RatingPanel({ article, v, reveal: external, showHeadline = true }) {
  const { submitRating, now } = useStore();
  const internal = useReveal();
  const reveal = external || internal;
  const [choice, setChoice] = useState(null);
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (choice === null) return;
    const res = submitRating(article.id, choice);
    if (res.ok) { setError(null); reveal.start(); } else setError(res.error);
  };

  return (
    <section className="rpanel" aria-label="Rate this article">
      {v.canRate ? (
        <form className="rpanel-body" onSubmit={submit}>
          <div className="rpanel-head">
            <div className="kicker">Blind rating</div>
            {showHeadline && <p className="rpanel-hl"><Headline text={article.headline} /></p>}
            <p className="rpanel-q">How would you rate this article?</p>
            <p className="small muted">Judge the headline and text in front of you. The outlet, its sources and other readers’ ratings stay hidden until you submit.</p>
          </div>
          <fieldset className="rate-opts">
            <legend className="sr-only">Rating</legend>
            {RATING_OPTIONS.map((o, i) => (
              <label key={o.key} className={`rate-opt r${i} ${choice === o.points ? 'sel' : ''}`}>
                <input type="radio" name={`rate-${article.id}`} value={o.points} checked={choice === o.points} onChange={() => setChoice(o.points)} />
                <span className="ro-pts tabular">{o.points}<small> pts</small></span>
                <span className="ro-label">{o.label}</span>
                <span className="ro-help">{o.help}</span>
              </label>
            ))}
          </fieldset>
          <div className="rpanel-actions">
            <span className="small muted"><Icon name="lock" size={12} /> Ratings are final once submitted. <span className="nowrap">Window closes in <Countdown until={v.closesAt} done="moments" />.</span></span>
            <button type="submit" className="btn btn-primary" disabled={choice === null}>Submit rating</button>
          </div>
          {error && <p className="callout callout-warn small" role="alert">{error}</p>}
        </form>
      ) : (
        <Result article={article} v={v} now={now} stage={reveal.stage} />
      )}
    </section>
  );
}

function Result({ article, v, now, stage }) {
  const rating = v.rating;
  const c = communityAt(article.id, now, rating);
  const outcome = rating ? outcomeFor(rating, now) : null;
  const animating = stage !== null && stage < 5;
  const mine = rating ? optionForPoints(rating.points) : null;
  const closest = c.mean !== null ? nearestOption(c.mean) : null;

  return (
    <div className={`rpanel-body reveal ${animating ? 'is-revealing' : ''}`}>
      {rating && (
        <div className={`reveal-step lock ${shown(stage, 1) ? 'in' : ''}`}>
          <Icon name="check" size={15} />
          <span>Your rating: <strong>{mine.label}</strong> <span className="tabular">({mine.points} pts)</span>. Locked in.</span>
        </div>
      )}
      {!rating && v.reason === 'closed' && <p className="reveal-note"><Icon name="lock" size={14} /> This article is closed to new ratings. The results below are final.</p>}
      {!rating && v.reason === 'browse' && <p className="reveal-note"><Icon name="info" size={14} /> You’re in Browse Mode, so rating is paused until tomorrow. Live results are shown.</p>}
      {!rating && v.reason === 'seen-in-browse' && <p className="reveal-note"><Icon name="info" size={14} /> You saw this article’s live results in Browse Mode, so it can’t be rated blind anymore.</p>}

      <div className={`reveal-step ${shown(stage, 2) ? 'in' : ''}`}>
        <div className="res-head">
          <div className="kicker">{v.status === 'closed' ? 'Final community score' : 'Live community score'}</div>
          <span className={`status-pill ${v.status === 'closed' ? 'st-closed' : 'st-live'}`}>
            {v.status === 'closed' ? 'Final' : <>Live · closes in <Countdown until={v.closesAt} done="moments" /></>}
          </span>
        </div>
        {c.mean === null ? <p className="small muted">No ratings yet.</p> : (
          <div className="res-score">
            <span className={`res-num tabular r${RATING_OPTIONS.indexOf(closest)}`}><CountUp to={c.mean} run={animating} /></span>
            <span className="res-den">/100</span>
            <div className="res-meta">
              <span>Closest category: <strong>{closest.label}</strong></span>
              <span className="tiny muted">Average of submitted ratings. This is community perception, not a fact-check.</span>
            </div>
          </div>
        )}
      </div>

      {c.n > 0 && (
        <div className={`reveal-step ${shown(stage, 3) ? 'in' : ''}`}>
          <p className="small res-count">
            <strong className="tabular">{num(c.n)}</strong> ratings
            {' · '}<span className="muted">{num(c.simulatedN)} from simulated participants{c.includesYou ? ', 1 from you' : ''}</span>
            {c.divided && <span className="divided-tag">Readers divided</span>}
          </p>
          <DistributionBar dist={c.dist} highlightPoints={rating?.points ?? null} />
          <ScoreScale score={c.mean} you={rating?.points ?? null} />
          {rating && outcome && (
            <p className="compare-note">
              {outcome.state === 'pending' && <>Your Crowd Alignment for this article is calculated when its window closes, comparing your rating with the final average of <em>everyone else’s</em> ratings.</>}
              {outcome.state === 'thin' && <>Only {outcome.othersN} other people rated this article, fewer than the {MIN_CROWD} needed, so it doesn’t count toward your Crowd Alignment.</>}
              {outcome.state === 'scored' && <>Final average of the other {num(outcome.othersN)} raters: <strong className="tabular">{outcome.othersMean.toFixed(1)}</strong>. You were <strong className="tabular">{outcome.error.toFixed(1)} points</strong> away. This counts toward your <Link to="profile">Crowd Alignment</Link>.</>}
            </p>
          )}
        </div>
      )}
      {stage !== null && (
        <p className={`reveal-step reveal-next small ${shown(stage, 5) ? 'in' : ''}`}>
          <Icon name="arrow" size={13} /> The publication and its sources are now revealed. Compare how other outlets covered the same event, or trace where this article’s information came from.
        </p>
      )}
    </div>
  );
}
