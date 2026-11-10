// Profile: Crowd Alignment rank, rating history, you vs. the community, profile & privacy.
// All rank math lives in lib/alignment.js; this page only displays it.
import { useEffect, useState } from 'react';
import { getArticle } from '../data/articles.js';
import { publications } from '../data/publications.js';
import { RATING_OPTIONS, optionForPoints } from '../data/ratingScale.js';
import { TOPICS } from '../data/events.js';
import { communityAt, finalOthers } from '../services/community.js';
import { TIERS, MIN_CROWD, PROVISIONAL_MIN, RANK_MIN, SHRINK_K } from '../lib/alignment.js';
import { statusAt, windowFor } from '../lib/schedule.js';
import { fmtDate, fmtDateTime } from '../lib/format.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { Countdown } from '../components/Status.jsx';
import { EmptyState, Headline, Icon, SampleTag, SectionHead, Tabs } from '../components/ui.jsx';

const ord = (n) => { const r = Math.round(n); const s = ['th', 'st', 'nd', 'rd'], v = r % 100; return `${r}${s[(v - 20) % 10] || s[v] || s[0]}`; };

function Ring({ value }) {
  const r = 44, c = 2 * Math.PI * r;
  return (
    <svg className="ring" width="108" height="108" viewBox="0 0 108 108" role="img" aria-label={value === null ? 'Crowd Alignment not yet available' : `Crowd Alignment ${Math.round(value)} of 100`}>
      <circle cx="54" cy="54" r={r} className="ring-bg" />
      {value !== null && <circle cx="54" cy="54" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 54 54)" />}
      <text x="54" y="52" textAnchor="middle" className="ring-num">{value === null ? '—' : Math.round(value)}</text>
      <text x="54" y="70" textAnchor="middle" className="ring-cap">ALIGNMENT</text>
    </svg>
  );
}

export default function Profile() {
  const { user, ratings, alignment: al, markJourney } = useStore();
  const [tab, setTab] = useState('alignment');
  useEffect(() => { markJourney('profileViewed'); }, [markJourney]);
  const initials = (user.displayName || user.username).split(/[\s_.]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const ranked = al.status !== 'unranked';
  const tierPct = ranked && al.next ? ((al.percentile - al.tier.min) / (al.next.min - al.tier.min)) * 100 : ranked ? 100 : (al.eligible / PROVISIONAL_MIN) * 100;

  return (
    <div className="page profile">
      <header className="prof-head">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div className="prof-id">
          <div className="kicker">My Profile</div>
          <h1 className="page-title">{user.displayName || user.username}</h1>
          <p className="small muted">@{user.username} · {ranked ? `${al.tier.name}${al.status === 'provisional' ? ' (provisional)' : ''}` : 'Unranked'}{user.joined ? ` · member since ${fmtDate(user.joined)}` : ''}</p>
          <div className="interest-row">{user.interests.map((t) => <span key={t} className="chip static">{t}</span>)}</div>
        </div>
        <div className="prof-score">
          <Ring value={al.score} />
          <div>
            <div className="level-name">{ranked ? al.tier.name : 'Unranked'}{al.status === 'provisional' && <span className="prov-tag">Provisional</span>}</div>
            <div className="small">{ranked ? `${ord(al.percentile)} percentile` : `${al.eligible} of ${PROVISIONAL_MIN} eligible ratings for a provisional rank`}</div>
            <div className="level-track"><span style={{ width: `${Math.max(0, Math.min(100, tierPct))}%` }} /></div>
            <div className="tiny muted">{ranked ? (al.next ? `${(al.next.min - al.percentile).toFixed(1)} percentile points to ${al.next.name}` : 'Highest rank') : 'Ratings become eligible when their articles close'}</div>
          </div>
        </div>
      </header>

      <div className="stat-row">
        <div className="stat"><span className="stat-v tabular">{al.eligible}</span><span className="stat-k">Eligible evaluations{al.status !== 'ranked' && ` (${RANK_MIN} for a permanent rank)`}</span></div>
        <div className="stat"><span className="stat-v tabular">{ranked ? ord(al.percentile) : '—'}</span><span className="stat-k">Percentile</span></div>
        <div className="stat"><span className="stat-v tabular">{al.score === null ? '—' : al.score.toFixed(1)}</span><span className="stat-k">Crowd Alignment score</span></div>
        <div className="stat"><span className="stat-v tabular">{ratings.length}</span><span className="stat-k">Ratings submitted · {al.pending} awaiting close</span></div>
      </div>

      <Tabs id="profile-tabs" value={tab} onChange={setTab} tabs={[{ key: 'alignment', label: 'Crowd Alignment' }, { key: 'history', label: 'Rating history', count: ratings.length }, { key: 'trends', label: 'You vs. community' }, { key: 'settings', label: 'Profile & privacy' }]} />
      <div className="tab-pane fade-in" key={tab}>
        {tab === 'alignment' && <Alignment al={al} />}
        {tab === 'history' && <History al={al} />}
        {tab === 'trends' && <Trends />}
        {tab === 'settings' && <Settings key={JSON.stringify(user)} />}
      </div>
    </div>
  );
}

function CohortChart({ al }) {
  const scores = al.cohort.members.map((m) => m.score);
  const lo = Math.floor(Math.min(...scores, al.score ?? 100) / 2) * 2, hi = Math.ceil(Math.max(...scores, al.score ?? 0) / 2) * 2;
  const bins = Math.max(1, (hi - lo) / 2);
  const counts = Array.from({ length: bins }, () => 0);
  scores.forEach((s) => { counts[Math.min(bins - 1, Math.floor((s - lo) / 2))] += 1; });
  const W = 640, H = 170, P = 28, T = 24, max = Math.max(...counts);
  const x = (v) => P + ((v - lo) / (hi - lo || 1)) * (W - 2 * P);
  return (
    <figure className="cohort">
      <svg viewBox={`0 0 ${W} ${H + 26}`} role="img" aria-label={`Crowd Alignment scores of ${scores.length} simulated participants${al.score !== null ? `; yours is ${al.score.toFixed(1)}` : ''}`}>
        {[0.5, 1].map((f) => <line key={f} x1={P} x2={W - P} y1={H - f * (H - T)} y2={H - f * (H - T)} className="grid" />)}
        {counts.map((c, i) => { const bw = (W - 2 * P) / bins; const h = (c / max) * (H - T); return <rect key={i} x={P + i * bw + 1} y={H - h} width={Math.max(1, bw - 2)} height={h} className="bar" />; })}
        <line x1={P} x2={W - P} y1={H} y2={H} className="axis" />
        {[lo, Math.round((lo + hi) / 2), hi].map((v) => <text key={v} x={x(v)} y={H + 16} textAnchor="middle" className="lbl">{v}</text>)}
        {al.score !== null && <g><line x1={x(al.score)} x2={x(al.score)} y1={T - 6} y2={H} className="you" /><text x={x(al.score)} y={T - 10} textAnchor="middle" className="you-lbl">You {al.score.toFixed(1)}</text></g>}
      </svg>
      <figcaption className="tiny muted">Crowd Alignment scores of the {scores.length} simulated participants in the ranking cohort. <SampleTag>Simulated</SampleTag></figcaption>
    </figure>
  );
}

function Alignment({ al }) {
  return (
    <div className="overview">
      <div className={`rank-status rs-${al.status}`}>
        <Icon name="info" size={16} />
        <p className="small">
          {al.status === 'unranked' && <>You need <strong>{PROVISIONAL_MIN} eligible evaluations</strong> for a provisional rank; you have {al.eligible}. A rating becomes eligible when its article closes with at least {MIN_CROWD} other ratings. {al.pending > 0 && <>{al.pending} of your ratings are waiting for their windows to close.</>}</>}
          {al.status === 'provisional' && <>Your rank is <strong>provisional</strong>. {al.toRanked} more eligible evaluation{al.toRanked === 1 ? '' : 's'} until it becomes permanent at {RANK_MIN}. Until then it can move a lot.</>}
          {al.status === 'ranked' && <>Your rank is based on {al.eligible} eligible evaluations, compared with {al.cohort.size} simulated participants.</>}
        </p>
      </div>

      <SectionHead kicker="Rank ladder" title="Percentile ranks">Ranks depend on how your Crowd Alignment compares with other participants, not on how many articles you’ve rated.</SectionHead>
      <div className="ladder">
        {TIERS.map((t, i) => {
          const upper = TIERS[i + 1]?.min ?? 100;
          const on = al.tier?.name === t.name;
          return (
            <div key={t.name} className={`rung ${on ? 'on' : ''}`} style={{ flexGrow: upper - t.min }}>
              <span className="rung-name">{t.name}</span>
              <span className="rung-range tabular">{t.min}–{upper === 100 ? '100' : upper}</span>
              {on && <span className="rung-you" style={{ left: `${((al.percentile - t.min) / (upper - t.min)) * 100}%` }} title={`You: ${ord(al.percentile)} percentile`} />}
            </div>
          );
        })}
      </div>

      <SectionHead kicker="How your score is calculated" title="Crowd Alignment, step by step" />
      <ol className="calc">
        <li><span>For each closed article you rated with at least {MIN_CROWD} other ratings, distance = |your rating − final average of everyone else|</span><strong className="tabular">{al.eligible} articles</strong></li>
        <li><span>Average distance across those articles</span><strong className="tabular">{al.rawError === null ? '—' : `${al.rawError.toFixed(1)} pts`}</strong></li>
        <li><span>Adjusted toward the cohort’s typical distance ({al.cohort.cohortMean.toFixed(1)} pts), as if you had {SHRINK_K} extra average results. This stops a few lucky guesses from ranking at the top.</span><strong className="tabular">{al.adjustedError === null ? '—' : `${al.adjustedError.toFixed(1)} pts`}</strong></li>
        <li><span>Crowd Alignment = 100 − adjusted distance</span><strong className="tabular">{al.score === null ? '—' : al.score.toFixed(1)}</strong></li>
        <li><span>Percentile = share of the {al.cohort.size} ranked participants whose adjusted distance is larger than yours</span><strong className="tabular">{al.status === 'unranked' || al.percentile === null ? `— (needs ${PROVISIONAL_MIN})` : ord(al.percentile)}</strong></li>
      </ol>
      <CohortChart al={al} />
      <p className="small callout"><Icon name="info" size={15} /><span>Crowd Alignment measures how well you anticipate the community’s eventual judgment. It doesn’t measure whether you were right: a careful reader who correctly disagrees with the crowd will score lower. <Link to="methods">Limitations</Link></span></p>
    </div>
  );
}

function History({ al }) {
  if (!al.entries.length) return <EmptyState title="No ratings yet" action={<Link to="ratings" className="btn btn-primary btn-sm">Rate your first article</Link>}>Your ratings and how close they came to the final community average will appear here.</EmptyState>;
  const sorted = [...al.entries].sort((x, y) => y.rating.submittedAt.localeCompare(x.rating.submittedAt));
  return (
    <ul className="history">
      {sorted.map((e) => {
        const a = getArticle(e.rating.articleId); const o = optionForPoints(e.rating.points);
        return (
          <li key={a.id}>
            <div className="h-top">
              <span className={`feed-rating r${RATING_OPTIONS.indexOf(o)}`}>{o.label} · {o.points}</span>
              <span className="tiny muted">Rated {fmtDateTime(new Date(e.rating.submittedAt).getTime())}</span>
              <span className="tiny h-outcome">
                {e.state === 'pending' && <>Scored when the window closes, in <Countdown until={windowFor(a.id).closesAt} done="moments" /></>}
                {e.state === 'thin' && <>Not counted: only {e.othersN} other ratings (needs {MIN_CROWD})</>}
                {e.state === 'scored' && <>Others’ final average <strong className="tabular">{e.othersMean.toFixed(1)}</strong> · you were <strong className="tabular">{e.error.toFixed(1)} pts</strong> away</>}
              </span>
            </div>
            <Link to="article" param={a.id} className="h-hl"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span><Headline text={a.headline} /></Link>
          </li>
        );
      })}
      <li className="tiny muted">Ratings are final once submitted, so they can’t be edited or deleted.</li>
    </ul>
  );
}

function Trends() {
  const { ratings, now } = useStore();
  const rows = ratings.map((r) => {
    const a = getArticle(r.articleId); const closed = statusAt(a.id, now) === 'closed';
    const others = closed ? finalOthers(a.id) : communityAt(a.id, now);
    return { r, a, closed, mean: others.mean };
  }).filter((x) => x.mean !== null);
  if (!rows.length) return <EmptyState title="Nothing to compare yet">Rate a few articles to see how your ratings line up with everyone else’s.</EmptyState>;
  const avgDiff = rows.reduce((s, x) => s + (x.r.points - x.mean), 0) / rows.length;
  const x = (v) => `${v}%`;
  return (
    <div className="trends">
      <p className="trend-summary">On average your ratings are <strong>{Math.abs(avgDiff) < 3 ? 'about the same as' : `${Math.abs(avgDiff).toFixed(1)} points ${avgDiff > 0 ? 'higher (more favorable) than' : 'lower (more critical) than'}`}</strong> other readers’ averages. That on its own isn’t good or bad.</p>
      <div className="dumbbells">
        <div className="db-axis"><span /><div className="db-scale">{['0 Nonfactual', '50 Biased', '100 Neutral'].map((l, i) => <span key={l} style={{ left: x(i * 50) }}>{l}</span>)}</div></div>
        {rows.map(({ r, a, closed, mean }) => {
          const lo = Math.min(mean, r.points), hi = Math.max(mean, r.points);
          return (
            <div key={a.id} className="db-row">
              <Link to="article" param={a.id} className="db-name"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span><Headline text={a.headline} /></Link>
              <div className="db-track">
                {[0, 25, 50, 75, 100].map((g) => <span key={g} className="spread-grid" style={{ left: x(g) }} />)}
                <span className="db-line" style={{ left: x(lo), width: `${hi - lo}%` }} />
                <span className={`db-comm ${closed ? '' : 'live'}`} style={{ left: x(mean) }} title={`${closed ? 'Final' : 'Live'} average of others: ${mean.toFixed(1)}`} />
                <span className="db-you" style={{ left: x(r.points) }} title={`You: ${r.points}`} />
              </div>
            </div>
          );
        })}
        <ul className="legend-inline tiny"><li><span className="db-comm-l" />Others’ average (hollow = still live)</li><li><span className="db-you-l" />Your rating</li></ul>
      </div>
      <div className="callout small"><Icon name="lock" size={15} /><span>This comparison uses community averages only. Optional demographic information, if you share it, is used only in aggregate research groups of 50 or more people. It never affects your rank and is never used to predict your views.</span></div>
    </div>
  );
}

function Settings() {
  const { user, dispatch, alignment, ratings, toast, demo } = useStore();
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
          <span className="small">{alignment.status === 'unranked' ? 'Unranked' : `${alignment.tier.name}${alignment.status === 'provisional' ? ' (provisional)' : ''} · ${Math.round(alignment.percentile)}th percentile`}</span>
          <span className="small muted">{ratings.length} ratings · {alignment.eligible} eligible</span>
          {form.bio && <p className="small">{form.bio}</p>}
          <div className="interest-row">{form.interests.map((t) => <span key={t} className="chip static sm">{t}</span>)}</div>
          <p className="tiny muted"><Icon name="lock" size={11} /> Demographics hidden</p>
        </div>
        <div className="danger">
          <h4 className="mini-h">Demo data</h4>
          {confirmReset ? (
            <div className="row-gap"><span className="small">Delete your ratings and profile edits, and restart the sample timeline?</span><button className="btn btn-sm btn-danger" onClick={() => { demo.restart(); dispatch({ type: 'resetAll' }); setConfirmReset(false); toast('Demo data reset'); }}>Reset</button><button className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button></div>
          ) : <button className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(true)}>Reset demo data</button>}
        </div>
      </aside>
    </div>
  );
}
