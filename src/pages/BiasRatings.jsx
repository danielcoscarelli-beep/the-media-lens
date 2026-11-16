// Bias Ratings: community scores (1–100) for every published article, the spread of
// article scores per publication, and a queue for rating blind. Sealed articles never show
// their outlet or score here, and publication filters/sorts skip them.
import { useMemo, useState } from 'react';
import { articles } from '../data/articles.js';
import { getEvent, TOPICS } from '../data/events.js';
import { publications, pubList } from '../data/publications.js';
import { SCALE_MARKS, toneStyle } from '../data/ratingScale.js';
import { communityAt, SIM_PARTICIPANTS } from '../services/community.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { ScaleLegend, ScoreBadge, YourRating, trackPct } from '../components/Rating.jsx';
import RatingPanel, { useReveal, shown } from '../components/RatingPanel.jsx';
import { SealedPub, StatusBadge } from '../components/Status.jsx';
import { EmptyState, Headline, Icon, SampleTag, Tabs } from '../components/ui.jsx';

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 3);

export default function BiasRatings() {
  const { mode } = useStore();
  const [tab, setTab] = useState(mode === 'rating' ? 'queue' : 'scores');
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Bias Ratings</div>
        <h1 className="page-title">Community scores for individual articles</h1>
        <p className="page-sub">Readers rate each article on a slider from 1 (Nonfactual) to 100 (Nonbiased). An article’s community score is the average of those ratings, shown with a color from gray (least biased) to red (most biased). <SampleTag>{SIM_PARTICIPANTS} simulated participants</SampleTag></p>
        <div className="principle"><Icon name="info" size={16} /><p><strong>Articles, not outlets, and perception, not proof.</strong> A score is what readers thought of one article. No publication gets a fixed label, and no score is a fact-check. The scale also combines bias and accuracy in one number; the <Link to="methods">Methods</Link> page explains why that matters.</p></div>
      </header>
      <Tabs id="ratings-tabs" value={tab} onChange={setTab} tabs={[{ key: 'queue', label: 'Rate blind' }, { key: 'scores', label: 'Community scores' }, { key: 'spread', label: 'Spread by publication' }]} />
      <div className="tab-pane fade-in" key={tab}>
        {tab === 'scores' && <ScoreTable />}
        {tab === 'spread' && <PublicationSpread />}
        {tab === 'queue' && <RateQueue />}
      </div>
    </div>
  );
}

function ScoreTable() {
  const { vis, now, mode } = useStore();
  const [topic, setTopic] = useState('');
  const [pub, setPub] = useState('');
  const [sort, setSort] = useState('rated');
  const rows = useMemo(() => {
    const r = articles.map((a) => ({ a, v: vis(a) })).filter(({ v }) => v.published)
      .map((x) => ({ ...x, c: x.v.revealed ? communityAt(x.a.id, now, x.v.rating) : null }))
      .filter(({ a, v }) => (!topic || getEvent(a.eventId).topic === topic) && (!pub || (!v.sealed && a.pub === pub)));
    const key = { rated: (x) => x.c.n, high: (x) => x.c.mean ?? -1, low: (x) => -(x.c.mean ?? 101) }[sort];
    // Sealed rows have no visible score: keep them together at the end, in a neutral order.
    return r.sort((x, y) => (x.v.sealed - y.v.sealed) || (x.v.sealed ? hash(x.a.id) - hash(y.a.id) : key(y) - key(x)));
  }, [topic, pub, sort, vis, now]);
  return (
    <>
      <div className="toolbar">
        <div className="toolbar-ctrls wrap">
          <label className="select-wrap"><span className="sr-only">Topic</span><select id="rt-topic" value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">All topics</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="select-wrap" data-leak-exempt><span className="sr-only">Publication</span><select id="rt-pub" value={pub} onChange={(e) => setPub(e.target.value)}><option value="">All publications</option>{pubList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="select-wrap"><span className="sr-only">Sort</span><select id="rt-sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="rated">Most ratings</option><option value="high">Highest score</option><option value="low">Lowest score</option></select></label>
        </div>
        <span className="small muted">{rows.length} articles{mode === 'rating' && pub ? ' (unrated articles excluded from publication filter)' : ''}</span>
      </div>
      {!rows.length ? <EmptyState title="No articles match">Try another topic or publication.</EmptyState> : (
        <ul className="hl-table">
          {rows.map(({ a, v, c }) => (
            <li key={a.id} className={v.sealed ? 'is-sealed' : ''}>
              {v.sealed ? <span className="pubmark pubmark-sm pubmark-sealed" aria-hidden="true">?</span> : <span className="pubmark pubmark-sm">{publications[a.pub].short}</span>}
              <div className="hlt-main">
                <Link to="article" param={a.id} className="hlt-hl"><Headline text={a.headline} /></Link>
                <div className="tiny muted row-gap">
                  {v.sealed ? 'Publication hidden' : publications[a.pub].name} · {getEvent(a.eventId).topic}
                  <StatusBadge v={v} compact />
                  {v.rating && <YourRating points={v.rating.points} />}
                </div>
              </div>
              <div className="hlt-dist">
                {v.sealed ? (
                  <Link to="article" param={a.id} className="btn btn-primary btn-sm">Rate blind to see score</Link>
                ) : (
                  <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <ScaleLegend />
    </>
  );
}

function PublicationSpread() {
  const { vis, now } = useStore();
  const rows = pubList.map((p) => ({
    p,
    items: articles.filter((a) => a.pub === p.id).map((a) => ({ a, v: vis(a) })).filter(({ v }) => v.revealed)
      .map(({ a, v }) => ({ a, mean: communityAt(a.id, now, v.rating).mean })).filter((x) => x.mean !== null),
  })).filter((r) => r.items.length);
  const x = (val) => `${trackPct(val)}%`;
  return (
    <div className="spread">
      <p className="small">Each dot is one article’s community score. A wide spread shows that a publication’s articles vary from story to story. Only articles revealed to you are included, and with so few sample articles per outlet this shows variation, not an average to rely on.</p>
      {!rows.length ? <EmptyState title="Nothing revealed yet">Rate articles or wait for windows to close to see scores here.</EmptyState> : (
        <>
          <div className="spread-axis"><span /><div className="spread-scale">{SCALE_MARKS.slice().reverse().map((m) => <span key={m.points} style={{ left: x(m.points) }}>{m.points}{m.points === 1 || m.points === 100 ? ` ${m.label}` : ''}</span>)}</div></div>
          {rows.map(({ p, items }) => {
            const ms = items.map((i) => i.mean); const lo = Math.min(...ms), hi = Math.max(...ms);
            return (
              <div key={p.id} className="spread-row">
                <span className="spread-name"><span className="pubmark pubmark-xs">{p.short}</span>{p.name}<span className="tiny muted"> · {items.length}</span></span>
                <div className="spread-track">
                  {SCALE_MARKS.map((m) => <span key={m.points} className="spread-grid" style={{ left: x(m.points) }} />)}
                  <span className="spread-range" style={{ left: x(lo), width: `${trackPct(hi) - trackPct(lo)}%` }} />
                  {items.map(({ a, mean }) => <Link key={a.id} to="article" param={a.id} className="spread-dot" style={{ left: x(mean), ...toneStyle(mean) }} title={`${a.headline} (${Math.round(mean)}/100)`} aria-label={`${a.headline}, score ${Math.round(mean)}`} />)}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function RateQueue() {
  const { vis, mode } = useStore();
  const reveal = useReveal();
  const eligible = articles.filter((a) => vis(a).canRate).sort((x, y) => hash(x.id) - hash(y.id));
  const [currentId, setCurrentId] = useState(() => eligible[0]?.id || null);
  const current = articles.find((a) => a.id === currentId) || eligible[0] || null;
  const next = () => {
    const nxt = eligible.find((a) => a.id !== current?.id);
    setCurrentId(nxt ? nxt.id : null);
  };
  if (mode === 'browse') return <EmptyState title="Rating is paused in Browse Mode">You can rate again tomorrow. Meanwhile, the Community scores tab shows live results for every article.</EmptyState>;
  if (!current) return <EmptyState title="Nothing left to rate right now" action={<Link to="profile" className="btn btn-ghost btn-sm">See your Crowd Alignment</Link>}>You’ve rated every open article. New sample articles are published as the timeline advances.</EmptyState>;
  const v = vis(current);
  return (
    <div className="queue">
      <div className="queue-head">
        <span className="small muted">{eligible.length} article{eligible.length === 1 ? '' : 's'} open for your blind rating</span>
        <div className="row-gap">
          <Link to="article" param={current.id} className="btn btn-ghost btn-sm">Open full article</Link>
          <button className={`btn btn-sm ${v.rating ? 'btn-primary' : 'btn-ghost'}`} onClick={next} disabled={!v.rating && eligible.length < 2}>{v.rating ? 'Next article' : 'Skip'} <Icon name="arrow" size={13} /></button>
        </div>
      </div>
      <article className="queue-article">
        <div className="meta-row">{!v.sealed && shown(reveal.stage, 4) ? <span className="pubname reveal-pub"><span className="pubmark pubmark-sm">{publications[current.pub].short}</span>{publications[current.pub].name}</span> : <SealedPub />}<StatusBadge v={v} /></div>
        <h2 className="queue-hl"><Headline text={current.headline} /></h2>
        <p className="art-dek">{current.dek}</p>
        <div className="art-body">{current.body.map((para, i) => <p key={i}>{para}</p>)}</div>
      </article>
      <RatingPanel key={current.id} article={current} v={v} reveal={reveal} showHeadline={false} />
    </div>
  );
}
