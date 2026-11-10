import { useEffect, useState } from 'react';
import { getArticle, MARKERS } from '../data/articles.js';
import { publications } from '../data/publications.js';
import { RATING_LABELS, REASONS, simulatedHelpful } from '../data/community.js';
import { TOPICS } from '../data/events.js';
import { aggregate } from '../lib/stats.js';
import { reasoningQuality, LEVELS } from '../lib/reputation.js';
import { fmtDate } from '../lib/format.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { EmptyState, Headline, Icon, SectionHead, Tabs } from '../components/ui.jsx';

function Ring({ value }) {
  const r = 44, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width="108" height="108" viewBox="0 0 108 108" role="img" aria-label={`Credibility score ${value} of 100`}>
      <circle cx="54" cy="54" r={r} className="ring-bg" />
      <circle cx="54" cy="54" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 54 54)" />
      <text x="54" y="52" textAnchor="middle" className="ring-num">{value}</text>
      <text x="54" y="70" textAnchor="middle" className="ring-cap">CREDIBILITY</text>
    </svg>
  );
}

export default function Profile() {
  const { user, evaluations, reputation: rep, markJourney } = useStore();
  const [tab, setTab] = useState('overview');
  useEffect(() => { markJourney('profileViewed'); }, [markJourney]);
  const initials = (user.displayName || user.username).split(/[\s_.]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const pctToNext = rep.next ? ((rep.score - rep.level.min) / (rep.next.min - rep.level.min)) * 100 : 100;

  return (
    <div className="page profile">
      <header className="prof-head">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div className="prof-id">
          <div className="kicker">My Profile</div>
          <h1 className="page-title">{user.displayName || user.username}</h1>
          <p className="small muted">@{user.username} · {rep.level.name} · member since {fmtDate(user.joined)}</p>
          <div className="interest-row">{user.interests.map((t) => <span key={t} className="chip static">{t}</span>)}</div>
        </div>
        <div className="prof-score">
          <Ring value={rep.score} />
          <div>
            <div className="level-name">{rep.level.name}</div>
            <div className="level-track"><span style={{ width: `${pctToNext}%` }} /></div>
            <div className="tiny muted">{rep.next ? `${rep.next.min - rep.score} points to ${rep.next.name}` : 'Highest level'}</div>
            <div className="tiny muted">Confidence: {Math.round(rep.confidence * 100)}% ({rep.n}/10 evaluations)</div>
          </div>
        </div>
      </header>

      <div className="stat-row">
        <div className="stat"><span className="stat-v tabular">{rep.n}</span><span className="stat-k">Headlines evaluated</span></div>
        <div className="stat"><span className="stat-v tabular">{rep.components[0].value ?? '—'}</span><span className="stat-k">Avg. reasoning quality</span></div>
        <div className="stat"><span className="stat-v tabular">{rep.markers.present ? `${rep.markers.found}/${rep.markers.present}` : '—'}</span><span className="stat-k">Text markers identified</span></div>
        <div className="stat"><span className="stat-v tabular">{rep.helpful}</span><span className="stat-k">Helpful marks <em>(simulated)</em></span></div>
      </div>

      <Tabs id="profile-tabs" value={tab} onChange={setTab} tabs={[{ key: 'overview', label: 'Reputation' }, { key: 'history', label: 'Evaluation history', count: evaluations.length }, { key: 'trends', label: 'You vs. community' }, { key: 'settings', label: 'Profile & privacy' }]} />
      <div className="tab-pane fade-in" key={tab}>
        {tab === 'overview' && <Overview rep={rep} />}
        {tab === 'history' && <History />}
        {tab === 'trends' && <Trends />}
        {tab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

function Overview({ rep }) {
  return (
    <div className="overview">
      <SectionHead kicker="How your score is built" title="Credibility breakdown">Your score rewards careful, evidence-based reasoning. Agreeing with the majority earns nothing.</SectionHead>
      <ul className="components">
        {rep.components.map((c) => (
          <li key={c.key} className={c.weight === 0 ? 'zero' : ''}>
            <div className="comp-top"><strong>{c.label}</strong><span className="tiny muted">weight {Math.round(c.weight * 100)}%</span><span className="comp-v tabular">{c.value ?? (c.weight ? 'Not enough data' : '—')}</span></div>
            <div className="comp-track"><span style={{ width: `${c.value ?? 0}%` }} /></div>
            <p className="tiny muted">{c.explain}</p>
          </li>
        ))}
      </ul>
      <div className="levels">
        {LEVELS.map((l) => <div key={l.name} className={`lvl ${rep.level.name === l.name ? 'on' : ''}`}><span className="tabular">{l.min}+</span>{l.name}</div>)}
      </div>
      {rep.markers.detail.length > 0 && (
        <>
          <h3 className="mini-h">Framing detection detail</h3>
          <ul className="marker-list">
            {rep.markers.detail.map((d, i) => (
              <li key={i} className={d.hit ? 'hit' : ''}><span className="mk-dot">{d.hit ? <Icon name="check" size={11} /> : '–'}</span> {MARKERS[d.marker].label} <span className="tiny muted">· {publications[getArticle(d.articleId).pub].short}</span></li>
            ))}
          </ul>
        </>
      )}
      <p className="small"><Link to="methods">Read how the reputation model works and its limitations <Icon name="arrow" size={12} /></Link></p>
    </div>
  );
}

function History() {
  const { evaluations, dispatch } = useStore();
  if (!evaluations.length) return <EmptyState title="No evaluations yet" action={<Link to="ratings" className="btn btn-primary btn-sm">Rate your first headline</Link>}>Your evaluations and reasoning will appear here.</EmptyState>;
  return (
    <ul className="history">
      {evaluations.map((e) => {
        const a = getArticle(e.articleId); if (!a) return null;
        const q = reasoningQuality(e, a).score;
        return (
          <li key={e.id}>
            <div className="h-top">
              <span className={`feed-rating r${e.rating}`}>{RATING_LABELS[e.rating]}</span>
              <span className="tiny muted">{fmtDate(e.ts.slice(0, 10))}{e.seeded && ' · sample history'}</span>
              <span className="tiny">Reasoning <strong className="tabular">{q}</strong>/100 · {simulatedHelpful(q)} helpful</span>
            </div>
            <Link to="article" param={a.id} className="h-hl"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span><Headline text={a.headline} /></Link>
            {e.reasons.length > 0 && <div className="h-reasons">{e.reasons.map((r) => <span key={r} className="chip static sm">{REASONS[r]}</span>)}</div>}
            {e.text && <p className="h-text">“{e.text}”</p>}
            <div className="h-actions"><Link to="article" param={a.id} className="textlink tiny">Revise</Link><button className="linkish tiny" onClick={() => dispatch({ type: 'removeEvaluation', id: e.id })}>Delete</button></div>
          </li>
        );
      })}
    </ul>
  );
}

function Trends() {
  const { evaluations } = useStore();
  const rows = evaluations.map((e) => ({ e, a: getArticle(e.articleId) })).filter((r) => r.a)
    .map(({ e, a }) => ({ e, a, mean: aggregate(a, null).mean }));
  if (!rows.length) return <EmptyState title="Nothing to compare yet">Rate a few headlines to see how your judgments line up with community trends.</EmptyState>;
  const avgDiff = rows.reduce((s, r) => s + (r.e.rating - r.mean), 0) / rows.length;
  const x = (v) => `${(v / 3) * 100}%`;
  return (
    <div className="trends">
      <p className="trend-summary">On average you rate headlines <strong>{Math.abs(avgDiff) < 0.2 ? 'about the same as' : `${Math.abs(avgDiff).toFixed(2)} points ${avgDiff > 0 ? 'more critically than' : 'less critically than'}`}</strong> the community. That is neither good nor bad. Readers who see more framing than the average reader are often right.</p>
      <div className="dumbbells">
        <div className="db-axis"><span /><div className="db-scale">{['Neutral', 'Slight', 'Moderate', 'Strong'].map((l, i) => <span key={l} style={{ left: x(i) }}>{l}</span>)}</div></div>
        {rows.map(({ e, a, mean }) => {
          const lo = Math.min(mean, e.rating), hi = Math.max(mean, e.rating);
          return (
            <div key={e.id} className="db-row">
              <Link to="article" param={a.id} className="db-name"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span><Headline text={a.headline} /></Link>
              <div className="db-track">
                {[0, 1, 2, 3].map((i) => <span key={i} className="spread-grid" style={{ left: x(i) }} />)}
                <span className="db-line" style={{ left: x(lo), width: `${((hi - lo) / 3) * 100}%` }} />
                <span className="db-comm" style={{ left: x(mean) }} title={`Community ${mean.toFixed(2)}`} />
                <span className="db-you" style={{ left: x(e.rating) }} title={`You: ${RATING_LABELS[e.rating]}`} />
              </div>
            </div>
          );
        })}
        <ul className="legend-inline tiny"><li><span className="db-comm-l" />Community mean</li><li><span className="db-you-l" />Your rating</li></ul>
      </div>
      <div className="callout small"><Icon name="lock" size={15} /><span>This comparison uses community averages only. If you choose to share demographic information, it is used only in aggregate research groups of 50 or more people. It never affects your credibility score and is never used to predict your views.</span></div>
    </div>
  );
}

function Settings() {
  const { user, dispatch, reputation, evaluations, toast } = useStore();
  const [form, setForm] = useState(user);
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setD = (k, v) => setForm((f) => ({ ...f, demographics: { ...f.demographics, [k]: v } }));
  const toggleInterest = (t) => setForm((f) => ({ ...f, interests: f.interests.includes(t) ? f.interests.filter((x) => x !== t) : [...f.interests, t] }));
  const save = (e) => { e.preventDefault(); dispatch({ type: 'updateUser', patch: { ...form, username: form.username.trim().replace(/\s+/g, '_') || 'reader' } }); toast('Profile saved', 'success'); };
  const D = form.demographics;
  return (
    <div className="settings">
      <form onSubmit={save} className="settings-form">
        <fieldset className="fs">
          <legend>Public profile</legend>
          <div className="field-row">
            <label className="field"><span>Username</span><input id="pf-username" className="input" value={form.username} onChange={(e) => set('username', e.target.value)} maxLength={24} /></label>
            <label className="field"><span>Display name</span><input id="pf-display" className="input" value={form.displayName} onChange={(e) => set('displayName', e.target.value)} maxLength={40} /></label>
          </div>
          <label className="field"><span>Short bio (optional)</span><textarea id="pf-bio" className="textarea" rows={2} value={form.bio} onChange={(e) => set('bio', e.target.value)} maxLength={200} /></label>
          <div className="field"><span>Areas of interest</span><div className="reason-chips">{TOPICS.map((t) => <label key={t} className={`chip ${form.interests.includes(t) ? 'on' : ''}`}><input type="checkbox" checked={form.interests.includes(t)} onChange={() => toggleInterest(t)} />{t}</label>)}</div></div>
        </fieldset>

        <fieldset className="fs fs-private">
          <legend><Icon name="lock" size={14} /> Optional demographic information</legend>
          <p className="small muted">Every field is optional. This information is never shown on your profile or to other users, and it never affects your credibility. If you opt in below, it is used only in research summaries of groups with at least 50 people.</p>
          <div className="field-row">
            <label className="field"><span>Age range</span><select id="pf-age" className="input" value={D.ageRange} onChange={(e) => setD('ageRange', e.target.value)}><option value="">Prefer not to say</option>{['18–24', '25–34', '35–44', '45–54', '55–64', '65+'].map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="field"><span>Region</span><select id="pf-region" className="input" value={D.region} onChange={(e) => setD('region', e.target.value)}><option value="">Prefer not to say</option>{['Northeast US', 'Midwest US', 'South US', 'West US', 'Outside the US'].map((o) => <option key={o}>{o}</option>)}</select></label>
          </div>
          <div className="field-row">
            <label className="field"><span>Education</span><select id="pf-edu" className="input" value={D.education} onChange={(e) => setD('education', e.target.value)}><option value="">Prefer not to say</option>{['High school', 'Some college', 'Bachelor’s degree', 'Graduate degree', 'Other'].map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="field"><span>Main way you get news</span><select id="pf-habit" className="input" value={D.newsHabit} onChange={(e) => setD('newsHabit', e.target.value)}><option value="">Prefer not to say</option>{['Websites & apps', 'Television', 'Social media', 'Print', 'Radio & podcasts'].map((o) => <option key={o}>{o}</option>)}</select></label>
          </div>
          <label className="check consent"><input id="pf-consent" type="checkbox" checked={D.shareForResearch} onChange={(e) => setD('shareForResearch', e.target.checked)} /><span>Include my answers in aggregate research about how different readers perceive framing. I can withdraw at any time.</span></label>
        </fieldset>
        <div className="row-gap"><button type="submit" className="btn btn-primary">Save profile</button></div>
      </form>

      <aside className="public-preview">
        <div className="kicker">What other readers see</div>
        <div className="pp-card">
          <strong>@{form.username || 'reader'}</strong>
          <span className="small">{reputation.level.name} · credibility {reputation.score}</span>
          <span className="small muted">{evaluations.length} evaluations</span>
          {form.bio && <p className="small">{form.bio}</p>}
          <div className="interest-row">{form.interests.map((t) => <span key={t} className="chip static sm">{t}</span>)}</div>
          <p className="tiny muted"><Icon name="lock" size={11} /> Demographics hidden</p>
        </div>
        <div className="danger">
          <h4 className="mini-h">Demo data</h4>
          {confirmReset ? (
            <div className="row-gap"><span className="small">Reset all evaluations and profile edits?</span><button className="btn btn-sm btn-danger" onClick={() => { dispatch({ type: 'reset' }); setConfirmReset(false); toast('Demo data reset'); }}>Reset</button><button className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button></div>
          ) : <button className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(true)}>Reset demo data</button>}
        </div>
      </aside>
    </div>
  );
}
