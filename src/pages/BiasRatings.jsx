import { useMemo, useState } from 'react';
import { articles } from '../data/articles.js';
import { getEvent, TOPICS } from '../data/events.js';
import { publications, pubList } from '../data/publications.js';
import { RATING_LABELS } from '../data/community.js';
import { aggregate, meanLabel } from '../lib/stats.js';
import { num } from '../lib/format.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { DistributionBar } from '../components/Rating.jsx';
import EvaluationPanel from '../components/EvaluationPanel.jsx';
import { EmptyState, Headline, Icon, SampleTag, Tabs } from '../components/ui.jsx';
import { plainHeadline } from '../lib/text.js';

export default function BiasRatings() {
  const [tab, setTab] = useState('headlines');
  const { evaluations } = useStore();
  const total = articles.reduce((s, a) => s + a.community.dist.reduce((x, y) => x + y, 0), 0) + evaluations.filter((e) => !e.seeded).length;
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Bias Ratings</div>
        <h1 className="page-title">Community ratings of individual headlines</h1>
        <p className="page-sub">Readers rate the wording and framing of specific headlines and explain why. {num(total)} evaluations so far. <SampleTag /></p>
        <div className="principle"><Icon name="info" size={16} /><p><strong>We rate headlines, not outlets.</strong> No publication gets a fixed bias label. The same outlet can publish a carefully neutral report one day and a loaded headline the next, and the publication view shows that spread.</p></div>
      </header>
      <Tabs id="ratings-tabs" value={tab} onChange={setTab} tabs={[{ key: 'headlines', label: 'All headlines' }, { key: 'spread', label: 'Spread by publication' }, { key: 'queue', label: 'Rate headlines' }]} />
      <div className="tab-pane fade-in" key={tab}>
        {tab === 'headlines' && <HeadlineTable />}
        {tab === 'spread' && <PublicationSpread />}
        {tab === 'queue' && <RateQueue />}
      </div>
    </div>
  );
}

function HeadlineTable() {
  const { evalFor } = useStore();
  const [topic, setTopic] = useState('');
  const [pub, setPub] = useState('');
  const [sort, setSort] = useState('evaluated');
  const rows = useMemo(() => {
    let r = articles.map((a) => ({ a, agg: aggregate(a, evalFor(a.id)), mine: evalFor(a.id) }))
      .filter(({ a }) => (!topic || getEvent(a.eventId).topic === topic) && (!pub || a.pub === pub));
    const s = { evaluated: (x, y) => y.agg.n - x.agg.n, divided: (x, y) => y.agg.entropy - x.agg.entropy, critical: (x, y) => y.agg.mean - x.agg.mean, neutral: (x, y) => x.agg.mean - y.agg.mean }[sort];
    return r.sort(s);
  }, [topic, pub, sort, evalFor]);
  return (
    <>
      <div className="toolbar">
        <div className="toolbar-ctrls wrap">
          <label className="select-wrap"><span className="sr-only">Topic</span><select id="rt-topic" value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">All topics</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="select-wrap"><span className="sr-only">Publication</span><select id="rt-pub" value={pub} onChange={(e) => setPub(e.target.value)}><option value="">All publications</option>{pubList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="select-wrap"><span className="sr-only">Sort</span><select id="rt-sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="evaluated">Most evaluated</option><option value="divided">Most divided</option><option value="critical">Rated most biased</option><option value="neutral">Rated most neutral</option></select></label>
        </div>
        <span className="small muted">{rows.length} headlines</span>
      </div>
      {!rows.length ? <EmptyState title="No headlines match">Try another topic or publication.</EmptyState> : (
        <ul className="hl-table">
          {rows.map(({ a, agg, mine }) => (
            <li key={a.id}>
              <span className="pubmark pubmark-sm">{publications[a.pub].short}</span>
              <div className="hlt-main">
                <Link to="article" param={a.id} className="hlt-hl"><Headline text={a.headline} /></Link>
                <div className="tiny muted">{publications[a.pub].name} · {getEvent(a.eventId).topic}{agg.entropy > 0.85 && <span className="divided-tag">Readers divided</span>}{mine && <span className={`you-rating r${mine.rating}`}>You: {RATING_LABELS[mine.rating]}</span>}</div>
              </div>
              <div className="hlt-dist"><DistributionBar dist={agg.dist} compact /><div className="tiny"><strong>{meanLabel(agg.mean)}</strong> <span className="muted">· {num(agg.n)}</span></div></div>
            </li>
          ))}
        </ul>
      )}
      <ul className="legend-inline tiny">{RATING_LABELS.map((l, i) => <li key={l}><span className={`swatch r${i}`} />{l}</li>)}</ul>
    </>
  );
}

function PublicationSpread() {
  const { evalFor } = useStore();
  const rows = pubList.map((p) => ({ p, items: articles.filter((a) => a.pub === p.id).map((a) => ({ a, mean: aggregate(a, evalFor(a.id)).mean })) })).filter((r) => r.items.length);
  const x = (v) => `${(v / 3) * 100}%`;
  return (
    <div className="spread">
      <p className="small">Each dot is one headline’s community mean rating. A wide spread shows that a publication’s headlines vary from article to article. With only a few sample articles per outlet, this view shows variation, not an average to rely on.</p>
      <div className="spread-axis"><span /><div className="spread-scale">{['Neutral', 'Slight', 'Moderate', 'Strong'].map((l, i) => <span key={l} style={{ left: x(i) }}>{l}</span>)}</div></div>
      {rows.map(({ p, items }) => {
        const ms = items.map((i) => i.mean); const lo = Math.min(...ms), hi = Math.max(...ms);
        return (
          <div key={p.id} className="spread-row">
            <span className="spread-name"><span className="pubmark pubmark-xs">{p.short}</span>{p.name}<span className="tiny muted"> · {items.length}</span></span>
            <div className="spread-track">
              {[0, 1, 2, 3].map((i) => <span key={i} className="spread-grid" style={{ left: x(i) }} />)}
              <span className="spread-range" style={{ left: x(lo), width: `${((hi - lo) / 3) * 100}%` }} />
              {items.map(({ a, mean }) => <Link key={a.id} to="article" param={a.id} className={`spread-dot m${Math.round(mean)}`} style={{ left: x(mean) }} title={`${plainHeadline(a.headline)} (${mean.toFixed(2)})`} aria-label={`${plainHeadline(a.headline)}, mean ${mean.toFixed(2)}`} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RateQueue() {
  const { evalFor } = useStore();
  const pending = articles.filter((a) => !evalFor(a.id));
  const [currentId, setCurrentId] = useState(() => pending[0]?.id || null);
  const current = articles.find((a) => a.id === currentId) || pending[0];
  const next = () => {
    const start = articles.findIndex((a) => a.id === current.id);
    const order = [...articles.slice(start + 1), ...articles.slice(0, start)];
    const nxt = order.find((a) => !evalFor(a.id));
    setCurrentId(nxt ? nxt.id : null);
  };
  if (!current) return <EmptyState title="You’ve evaluated every sample headline">Revise any evaluation from its article page, or check your profile to see how your reputation developed.</EmptyState>;
  const done = !!evalFor(current.id);
  return (
    <div className="queue">
      <div className="queue-head">
        <span className="small muted">{pending.length} headline{pending.length === 1 ? '' : 's'} left to rate</span>
        <div className="row-gap">
          <Link to="article" param={current.id} className="btn btn-ghost btn-sm">Read analysis first</Link>
          <button className={`btn btn-sm ${done ? 'btn-primary' : 'btn-ghost'}`} onClick={next}>{done ? 'Next headline' : 'Skip'} <Icon name="arrow" size={13} /></button>
        </div>
      </div>
      <p className="tiny muted">From {publications[current.pub].name}. The outlet is shown for transparency, but try to judge the wording alone.</p>
      <EvaluationPanel key={current.id} article={current} />
    </div>
  );
}
