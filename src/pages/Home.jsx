import { useMemo } from 'react';
import { listEvents } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { getArticle, articles as allArticles } from '../data/articles.js';
import { getEvent, featuredEvent, TOPICS } from '../data/events.js';
import { publications } from '../data/publications.js';
import { activity, RATING_LABELS, REASONS } from '../data/community.js';
import { aggregate, meanLabel } from '../lib/stats.js';
import { fmtDate, relTime, num } from '../lib/format.js';
import { slugify } from '../lib/text.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { SearchBox } from '../components/Shell.jsx';
import { EventCard } from '../components/Cards.jsx';
import { Headline, Icon, SampleTag, SectionHead, Skeleton } from '../components/ui.jsx';

const JOURNEY = [
  { key: 'searched', label: 'Search for a news event', to: 'explore', param: 'permitting' },
  { key: 'searched', label: 'See every publication covering it', to: 'explore', param: 'permitting', alias: true },
  { key: 'compared', label: 'Compare headlines and framing', to: 'compare', param: 'permitting-act' },
  { key: 'opened', label: 'Open an individual article', to: 'article', param: 'fox-permitting' },
  { key: 'sources', label: 'Investigate its sources', to: 'sources', param: 'fox-permitting' },
  { key: 'rated', label: 'Evaluate its headline', to: 'article', param: 'fox-permitting' },
  { key: 'explained', label: 'Explain your reasoning', to: 'article', param: 'fox-permitting' },
  { key: 'contributed', label: 'Add to community statistics', to: 'ratings' },
  { key: 'profileViewed', label: 'See your profile and reputation update', to: 'profile' },
];

// Simulated attention index (share of sample-week coverage) for trending topics.
const TREND = { 'Energy & Infrastructure': [3, 4, 4, 6, 9, 14, 18], Economy: [8, 7, 9, 8, 12, 11, 10], Technology: [5, 6, 5, 7, 6, 9, 12], Climate: [4, 4, 6, 9, 8, 7, 6], 'National Security': [3, 3, 4, 3, 5, 6, 11], Elections: [9, 10, 8, 11, 12, 9, 8], 'International Affairs': [7, 6, 7, 8, 9, 10, 9] };

function Spark({ data }) {
  const max = Math.max(...data), w = 84, h = 26;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
  const [lx, ly] = pts.split(' ').pop().split(',');
  return <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx={lx} cy={ly} r="2.5" fill="var(--accent)" /></svg>;
}

export default function Home() {
  const { data: events, loading } = useAsync(listEvents, []);
  const { journey, evaluations, evalFor, user } = useStore();
  const done = JOURNEY.filter((s) => journey[s.key]).length;

  const contrasts = useMemo(() => [
    { eventId: 'permitting-act', ids: ['ap-permitting', 'fox-permitting', 'cnn-permitting'] },
    { eventId: 'water-cyber', ids: ['ap-water', 'cnn-water', 'nyt-water'] },
    { eventId: 'methane-pact', ids: ['bbc-methane', 'guardian-methane', 'wsj-methane'] },
  ], []);

  const myRecent = evaluations.filter((e) => !e.seeded).slice(0, 2);
  const today = new Date('2026-11-01T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-main">
          <div className="dateline">{today} · <SampleTag>Sample edition</SampleTag></div>
          <h1 className="hero-title">Same event. Different stories.<br /><em>See how the news is framed.</em></h1>
          <p className="hero-sub">Compare how news organizations cover the same events, trace claims back to their original sources, and rate the framing of individual headlines with other careful readers.</p>
          <SearchBox size="lg" />
          <p className="small muted hero-try">Try: <Link to="explore" param="permitting">permitting bill</Link> · <Link to="explore" param="cybersecurity">cybersecurity</Link> · <Link to="explore" param="federal-reserve">Federal Reserve</Link> · <Link to="explore" param="whitfield">Dana Whitfield</Link></p>
        </div>
        <aside className="journey" aria-label="Guided walkthrough">
          <div className="journey-head">
            <div className="kicker">Guided walkthrough</div>
            <span className="small tabular">{done}/{JOURNEY.length}</span>
          </div>
          <h3 className="journey-title">Follow one story through the lens</h3>
          <p className="small muted">Uses the featured sample event: the Senate permitting bill.</p>
          <div className="journey-track"><span style={{ width: `${(done / JOURNEY.length) * 100}%` }} /></div>
          <ol className="journey-list">
            {JOURNEY.map((s, i) => (
              <li key={i} className={journey[s.key] ? 'done' : ''}>
                <span className="j-dot">{journey[s.key] ? <Icon name="check" size={11} /> : i + 1}</span>
                <Link to={s.to} param={s.param}>{s.label}</Link>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="block">
        <SectionHead kicker="Top stories" title="Events with the widest coverage" action={<Link to="compare" className="textlink">All events <Icon name="arrow" size={13} /></Link>}>
          Each event groups reports from several publications. Open one to compare them side by side.
        </SectionHead>
        {loading ? (
          <div className="top-grid"><Skeleton image lines={4} /><Skeleton image /><Skeleton image /><Skeleton image /></div>
        ) : (
          <div className="top-grid">
            {[events.find((e) => e.featured), ...events.filter((e) => !e.featured).slice(0, 4)].map((e, i) => <EventCard key={e.id} event={e} articles={e.articles} lead={i === 0} />)}
          </div>
        )}
      </section>

      <section className="block">
        <SectionHead kicker="Trending topics" title="Where attention is going" >Share of sample coverage over the past seven days.</SectionHead>
        <div className="topics">
          {TOPICS.map((t) => {
            const evs = (events || []).filter((e) => e.topic === t);
            const n = allArticles.filter((a) => getEvent(a.eventId).topic === t).length;
            const d = TREND[t]; const ch = d[d.length - 1] - d[d.length - 2];
            return (
              <Link key={t} to="explore" param={slugify(t)} className="topic">
                <span className="topic-name">{t}</span>
                <Spark data={d} />
                <span className="small muted">{n} articles · {evs.length || '—'} event{evs.length === 1 ? '' : 's'}</span>
                <span className={`small tabular ${ch >= 0 ? 'up' : 'down'}`}>{ch >= 0 ? '▲' : '▼'} {Math.abs(ch)} pts</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="block">
        <SectionHead kicker="Coverage differences" title="One event, contrasting headlines">Highlighted words are the wording choices readers discuss most. Ratings come from community evaluations of each headline, not from the outlet’s reputation.</SectionHead>
        <div className="contrasts">
          {contrasts.map((c) => {
            const ev = getEvent(c.eventId);
            return (
              <article key={c.eventId} className="contrast">
                <div className="contrast-head">
                  <div className="kicker">{ev.topic}</div>
                  <h3 className="contrast-title">{ev.title}</h3>
                </div>
                <ul className="contrast-list">
                  {c.ids.map((id) => {
                    const a = getArticle(id); const agg = aggregate(a, evalFor(id));
                    return (
                      <li key={id}>
                        <span className="pubmark pubmark-sm">{publications[a.pub].short}</span>
                        <div>
                          <Link to="article" param={id} className="contrast-hl"><Headline text={a.headline} highlight /></Link>
                          <div className="small muted">{publications[a.pub].name} · <span className={`mean-chip m${Math.round(agg.mean)}`}>{meanLabel(agg.mean)}</span> · {num(agg.n)} ratings</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Link to="compare" param={ev.id} className="btn btn-ghost btn-sm"><Icon name="compare" size={14} /> Compare all coverage</Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="block two-col">
        <div>
          <SectionHead kicker="Community activity" title="Recently evaluated headlines" />
          <ul className="feed">
            {myRecent.map((e) => {
              const a = getArticle(e.articleId);
              return (
                <li key={e.id} className="feed-item feed-you">
                  <span className={`feed-rating r${e.rating}`}>{RATING_LABELS[e.rating]}</span>
                  <div>
                    <div className="small"><strong>{user.username}</strong> (you) · just now</div>
                    <Link to="article" param={a.id} className="feed-hl"><Headline text={a.headline} /></Link>
                    {e.text && <p className="feed-note">“{e.text}”</p>}
                  </div>
                </li>
              );
            })}
            {activity.map((x, i) => {
              const a = getArticle(x.articleId);
              return (
                <li key={i} className="feed-item">
                  <span className={`feed-rating r${x.rating}`}>{RATING_LABELS[x.rating]}</span>
                  <div>
                    <div className="small"><strong>{x.user}</strong> · {x.level} · {relTime(x.mins)}{x.reason && <> · <span className="muted">{REASONS[x.reason]}</span></>}</div>
                    <Link to="article" param={a.id} className="feed-hl"><Headline text={a.headline} /></Link>
                    <p className="feed-note">“{x.note}”</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="featured-aside">
          <div className="kicker">Featured analysis</div>
          <h3 className="fa-title">{featuredEvent.title}</h3>
          <p className="small">{featuredEvent.comparison.headline}</p>
          <dl className="fa-stats">
            <div><dt>Outlets compared</dt><dd className="tabular">6</dd></div>
            <div><dt>Distinct sources</dt><dd className="tabular">15</dd></div>
            <div><dt>Claims traced</dt><dd className="tabular">13</dd></div>
          </dl>
          <p className="small muted">Four of six outlets repeat one figure that traces back to a single press release.</p>
          <div className="fa-actions">
            <Link to="compare" param={featuredEvent.id} className="btn btn-primary btn-sm">Open comparison</Link>
            <Link to="sources" param="permitting-act" className="btn btn-ghost btn-sm">Source map</Link>
          </div>
          <p className="tiny muted">Published {fmtDate(featuredEvent.date)} · sample event</p>
        </aside>
      </section>
    </div>
  );
}
