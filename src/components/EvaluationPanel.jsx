import { useEffect, useMemo, useState } from 'react';
import { RATING_LABELS, REASONS } from '../data/community.js';
import { aggregate, meanLabel } from '../lib/stats.js';
import { reasoningQuality } from '../lib/reputation.js';
import { num } from '../lib/format.js';
import { useStore } from '../state/store.jsx';
import { Link } from '../state/router.jsx';
import { DistributionBar, ReasonBars, ScaleMarker } from './Rating.jsx';
import { Headline, Icon } from './ui.jsx';

const RATING_HELP = [
  'Describes what happened without evaluative wording.',
  'Mostly descriptive, with a word or emphasis that tilts it.',
  'Framing or wording clearly favors one interpretation.',
  'Language or framing works to persuade rather than inform.',
];

export default function EvaluationPanel({ article, compact = false }) {
  const { evalFor, submitEvaluation, reputation } = useStore();
  const existing = evalFor(article.id);
  const [step, setStep] = useState(existing ? 'results' : 'rate');
  const [rating, setRating] = useState(existing?.rating ?? null);
  const [reasons, setReasons] = useState(existing?.reasons ?? []);
  const [text, setText] = useState(existing?.text ?? '');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const e = evalFor(article.id);
    setStep(e ? 'results' : 'rate'); setRating(e?.rating ?? null); setReasons(e?.reasons ?? []); setText(e?.text ?? ''); setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.id]);

  const quality = useMemo(() => reasoningQuality({ rating, reasons, text }, article), [rating, reasons, text, article]);
  const toggle = (k) => setReasons((r) => (r.includes(k) ? r.filter((x) => x !== k) : [...r, k]));
  const canSubmit = rating !== null && text.trim().length >= 15;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const r = submitEvaluation({ articleId: article.id, rating, reasons, text: text.trim() });
    setResult(r);
    setStep('results');
  };

  return (
    <section className={`evalp ${compact ? 'evalp-compact' : ''}`} aria-label="Evaluate this headline">
      <div className="evalp-head">
        <div className="kicker">Community bias evaluation</div>
        <blockquote className="evalp-headline"><Headline text={article.headline} /></blockquote>
        <ol className="evalp-steps" aria-label="Progress">
          {['Rate', 'Explain', 'Compare'].map((s, i) => {
            const idx = { rate: 0, explain: 1, results: 2 }[step];
            return <li key={s} className={i < idx ? 'done' : i === idx ? 'current' : ''}><span>{i < idx ? <Icon name="check" size={12} /> : i + 1}</span>{s}</li>;
          })}
        </ol>
      </div>

      {step === 'rate' && (
        <div className="evalp-body fade-in">
          <p className="evalp-q">How would you describe this headline’s framing?</p>
          <p className="small muted">Judge the wording and framing of this headline. Your view of the outlet or the issue shouldn’t decide your rating.</p>
          <div className="rating-scale" role="radiogroup" aria-label="Bias rating">
            {RATING_LABELS.map((l, i) => (
              <button key={l} type="button" role="radio" aria-checked={rating === i} className={`rating-opt r${i} ${rating === i ? 'sel' : ''}`} onClick={() => setRating(i)}>
                <span className="ro-dot" />
                <span className="ro-label">{l}</span>
                <span className="ro-help">{RATING_HELP[i]}</span>
              </button>
            ))}
          </div>
          <div className="evalp-actions">
            {existing && <button type="button" className="btn btn-ghost" onClick={() => setStep('results')}>Cancel</button>}
            <button type="button" className="btn btn-primary" disabled={rating === null} onClick={() => setStep('explain')}>Continue <Icon name="arrow" size={14} /></button>
          </div>
        </div>
      )}

      {step === 'explain' && (
        <form className="evalp-body fade-in" onSubmit={submit}>
          <p className="evalp-q">Why did you rate it <strong>{RATING_LABELS[rating].toLowerCase()}</strong>?</p>
          <fieldset className="reason-chips">
            <legend className="small muted">Select any that apply (optional)</legend>
            {Object.entries(REASONS).map(([k, l]) => (
              <label key={k} className={`chip ${reasons.includes(k) ? 'on' : ''}`}>
                <input type="checkbox" checked={reasons.includes(k)} onChange={() => toggle(k)} />{l}
              </label>
            ))}
          </fieldset>
          <label className="field-label" htmlFor={`why-${article.id}`}>Your reasoning</label>
          <textarea id={`why-${article.id}`} className="textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={'Point to specific words, sources or omissions. For example: "The headline says ‘choking’ without attributing it, and the jobs figure comes from a trade group."'} />
          <div className="quality">
            <div className="quality-top">
              <span className="small">Reasoning quality preview</span>
              <span className="quality-score tabular">{quality.score}<span className="muted">/100</span></span>
            </div>
            <div className="quality-track"><span style={{ width: `${quality.score}%` }} /></div>
            <ul className="quality-parts">
              {quality.parts.map((p) => (
                <li key={p.key} className={p.got >= p.max * 0.9 ? 'ok' : ''}>
                  <span className="qp-dot">{p.got >= p.max * 0.9 ? <Icon name="check" size={11} /> : null}</span>
                  <span>{p.label}</span>
                  {p.hint && text.trim() && <span className="qp-hint">{p.hint}</span>}
                </li>
              ))}
            </ul>
            <p className="tiny muted">This score reflects how well your reasoning is supported. It doesn’t depend on whether you agree with other readers.</p>
          </div>
          <div className="evalp-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setStep('rate')}><Icon name="back" size={14} /> Back</button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>Submit evaluation</button>
          </div>
          {!canSubmit && <p className="tiny muted right">Write at least a short sentence to submit.</p>}
        </form>
      )}

      {step === 'results' && <Results article={article} result={result} reputation={reputation} onRevise={() => setStep('rate')} />}
    </section>
  );
}

function Results({ article, result, reputation, onRevise }) {
  const { evalFor } = useStore();
  const mine = evalFor(article.id);
  const agg = aggregate(article, mine);
  const diff = mine ? mine.rating - agg.mean : 0;
  const examples = useMemo(() => {
    const seen = new Set();
    return article.community.comments.filter((c) => (seen.has(c.rating) ? false : seen.add(c.rating)));
  }, [article]);

  return (
    <div className="evalp-body fade-in eval-results">
      {result && (
        <div className="contrib-note">
          <Icon name="check" size={16} />
          <div>
            <strong>Your evaluation is now part of the community record.</strong>
            <span className="small"> Reasoning quality {result.quality}/100 · credibility {result.before} → {result.after}{' '}
              (<Link to="profile">view profile</Link>)</span>
          </div>
        </div>
      )}
      <div className="results-grid">
        <div>
          <div className="res-big">
            <span className="res-label">{meanLabel(agg.mean)}</span>
            <span className="small muted">Community assessment · {num(agg.n)} evaluations{agg.entropy > 0.8 ? ' · readers are divided' : ''}</span>
          </div>
          <DistributionBar dist={agg.dist} highlight={mine?.rating ?? null} />
          <ScaleMarker mean={agg.mean} you={mine?.rating ?? null} />
          {mine && (
            <p className="compare-note">
              {Math.abs(diff) < 0.35
                ? 'Your rating is close to the community average.'
                : diff > 0
                  ? `You rated this ${diff.toFixed(1)} points more critically than the community average.`
                  : `You rated this ${Math.abs(diff).toFixed(1)} points less critically than the community average.`}
              {' '}Your credibility is based on the quality of your reasoning, not on agreeing with other readers.
            </p>
          )}
        </div>
        <div>
          <h4 className="mini-h">Most cited reasons</h4>
          <ReasonBars reasons={agg.topReasons} mine={mine?.reasons || []} />
        </div>
      </div>
      <div className="interps">
        <h4 className="mini-h">Differing interpretations</h4>
        <div className="interp-list">
          {mine && (
            <figure className="interp interp-you">
              <figcaption><span className={`swatch r${mine.rating}`} /> You · {RATING_LABELS[mine.rating]}</figcaption>
              <p>{mine.text}</p>
            </figure>
          )}
          {examples.map((c) => (
            <figure key={c.user} className="interp">
              <figcaption><span className={`swatch r${c.rating}`} /> {c.user} · {RATING_LABELS[c.rating]}</figcaption>
              <p>{c.text}</p>
            </figure>
          ))}
          {!examples.length && !mine && <p className="small muted">No written interpretations yet.</p>}
        </div>
      </div>
      <div className="evalp-actions">
        <span className="small muted">Your level: <strong>{reputation.level.name}</strong> · credibility {reputation.score}</span>
        <button type="button" className="btn btn-ghost" onClick={onRevise}>{mine ? 'Revise my evaluation' : 'Evaluate this headline'}</button>
      </div>
    </div>
  );
}
