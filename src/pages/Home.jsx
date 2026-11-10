import { useMemo } from 'react';
import { listEvents } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { articles as allArticles, articlesForEvent } from '../data/articles.js';
import { getEvent, featuredEvent, TOPICS } from '../data/events.js';
import { publications } from '../data/publications.js';
import { optionForPoints } from '../data/ratingScale.js';
import { communityAt, simulatedActivity } from '../services/community.js';
import { windowFor, isPublished } from '../lib/schedule.js';
import { HOUR } from '../lib/clock.js';
import { fmtRelative, num } from '../lib/format.js';
import { slugify } from '../lib/text.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { SearchBox } from '../components/Shell.jsx';
import { EventCard } from '../components/Cards.jsx';
import { ScoreBadge } from '../components/Rating.jsx';
import { Countdown } from '../components/Status.jsx';
import { Headline, Icon, SampleTag, SectionHead, Skeleton } from '../components/ui.jsx';

const JOURNEY = [
  { key: 'searched', label: 'Search for a news event', to: 'explore', param: 'permitting' },
  { key: 'rated', label: 'Read an article and rate it blind', to: 'ratings' },
  { key: 'rated', label: 'See the reveal: score, outlet and sources', to: 'ratings', alias: true },
  { key: 'ratedThree', label: 'Rate three articles today', to: 'ratings' },
  { key: 'compared', label: 'Compare how outlets covered the event', to: 'compare', param: 'permitting-act' },
  { key: 'sources', label: 'Investigate an article’s sources', to: 'sources', param: 'permitting-act' },
  { key: 'browsed', label: 'Switch to Browse Mode', to: 'explore' },
  { key: 'profileViewed', label: 'Check your Crowd Alignment rank', to: 'profile' },
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
  const { now, vis, journey, ratings, mode, boundaryKey } = useStore();
  const { data: events } = useAsync(() => listEvents({ now }), [boundaryKey]);
  const done = JOURNEY.filter((s) => journey[s.key]).length;
  const today = new Date(now).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const rateable = allArticles.map((a) => ({ a, v: vis(a) })).filter((x) => x.v.canRate).sort((x, y) => x.v.closesAt - y.v.closesAt);

  // Contrasts only from events with every article published and revealed, so nothing sealed leaks.
  const contrasts = useMemo(() => {
    const out = [];
    for (const ev of (events || [])) {
      const list = articlesForEvent(ev.id);
      if (!list.every((a) => isPublished(a.id, now) && vis(a).revealed)) continue;
      const scored = list.map((a) => ({ a, c: communityAt(a.id, now, vis(a).rating) })).filter((x) => x.c.mean !== null).sort((x, y) => y.c.mean - x.c.mean);
      if (scored.length < 2) continue;
      out.push({ ev, picks: [scored[0], scored[Math.floor(scored.length / 2)], scored[scored.length - 1]].filter((x, i, arr) => arr.indexOf(x) === i) });
    }
    return out.slice(0, 3);
  }, [events, now, vis]);

  const recentClosed = allArticles.map((a) => ({ a, v: vis(a) })).filter((x) => x.v.status === 'closed')
    .sort((x, y) => y.v.closesAt - x.v.closesAt).slice(0, 5);
  const myRecent = ratings.slice(0, 3);
  const lastHour = simulatedActivity(now - HOUR, now);

  const featuredList = articlesForEvent(featuredEvent.id).filter((a) => isPublished(a.id, now));
  const featuredSealed = featuredList.filter((a) => vis(a).sealed).length;
  const featuredSources = new Set(featuredList.flatMap((a) => a.sourceUses.map((u) => u.id))).size;
  const featuredClaims = new Set(featuredList.flatMap((a) => a.claims)).size;

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-main">
          <div className="dateline">{today} · <SampleTag>Sample edition</SampleTag></div>
          <h1 className="hero-title">Judge the story first.<br /><em>Then see who wrote it.</em></h1>
          <p className="hero-sub">Rate news articles blind, without knowing the outlet, its sources or what other readers think. Then the reveal: the community score, the publication, and how other outlets covered the same event.</p>
          <SearchBox size="lg" />
          <p className="small muted hero-try">Try: <Link to="explore" param="permitting">permitting bill</Link> · <Link to="explore" param="methane">methane</Link> · <Link to="explore" param="chips">AI chips</Link> · <Link to="explore" param="federal-reserve">Federal Reserve</Link></p>
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
        <SectionHead kicker={mode === 'browse' ? 'Browse Mode' : 'Open for blind rating'} title={mode === 'browse' ? 'Rating is paused until tomorrow' : 'Articles waiting for your rating'}
          action={<Link to="ratings" className="textlink">All community scores <Icon name="arrow" size={13} /></Link>}>
          {mode === 'browse' ? 'You can explore every article’s live results. New ratings open again at local midnight.' : 'Each article is open for 24 hours. You’ll see only the headline and text until you rate it.'}
        </SectionHead>
        {mode === 'rating' && (rateable.length ? (
          <ul className="open-list">
            {rateable.slice(0, 6).map(({ a, v }) => (
              <li key={a.id}>
                <span className="pubmark pubmark-sm pubmark-sealed" aria-hidden="true">?</span>
                <div className="ol-main">
                  <Link to="article" param={a.id} className="ol-hl"><Headline text={a.headline} /></Link>
                  <span className="tiny muted">{getEvent(a.eventId).topic} · closes in <Countdown until={v.closesAt} /></span>
                </div>
                <Link to="article" param={a.id} className="btn btn-primary btn-sm">Rate blind</Link>
              </li>
            ))}
          </ul>
        ) : <p className="small muted">No articles are open for you to rate right now. New sample articles are published over the course of the timeline.</p>)}
      </section>

      <section className="block">
        <SectionHead kicker="Top stories" title="Events with the widest coverage" action={<Link to="compare" className="textlink">All events <Icon name="arrow" size={13} /></Link>}>
          Each event groups reports from several publications. Outlets stay hidden on articles you haven’t rated yet.
        </SectionHead>
        {!events ? (
          <div className="top-grid"><Skeleton image lines={4} /><Skeleton image /><Skeleton image /><Skeleton image /></div>
        ) : (
          <div className="top-grid">
            {[events.find((e) => e.featured), ...events.filter((e) => !e.featured).slice(0, 4)].filter(Boolean).map((e, i) => <EventCard key={e.id} event={e} articles={e.articles} lead={i === 0} />)}
          </div>
        )}
      </section>

      <section className="block">
        <SectionHead kicker="Trending topics" title="Where attention is going">Share of sample coverage over the past seven days.</SectionHead>
        <div className="topics">
          {TOPICS.map((t) => {
            const evs = (events || []).filter((e) => e.topic === t);
            const n = allArticles.filter((a) => getEvent(a.eventId).topic === t && isPublished(a.id, now)).length;
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
        <SectionHead kicker="Coverage differences" title="One event, contrasting headlines">Highest, middle and lowest community scores within events whose ratings you can see. Highlighted words are the wording choices discussed in the analysis.</SectionHead>
        {contrasts.length ? (
          <div className="contrasts">
            {contrasts.map(({ ev, picks }) => (
              <article key={ev.id} className="contrast">
                <div className="contrast-head"><div className="kicker">{ev.topic}</div><h3 className="contrast-title">{ev.title}</h3></div>
                <ul className="contrast-list">
                  {picks.map(({ a, c }) => (
                    <li key={a.id}>
                      <span className="pubmark pubmark-sm">{publications[a.pub].short}</span>
                      <div>
                        <Link to="article" param={a.id} className="contrast-hl"><Headline text={a.headline} highlight /></Link>
                        <div className="small muted row-gap">{publications[a.pub].name} <ScoreBadge score={c.mean} n={c.n} final={vis(a).status === 'closed'} /></div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="compare" param={ev.id} className="btn btn-ghost btn-sm"><Icon name="compare" size={14} /> Compare all coverage</Link>
              </article>
            ))}
          </div>
        ) : <p className="small muted">Contrasts appear once an event’s articles are all closed or rated by you.</p>}
      </section>

      <section className="block two-col">
        <div>
          <SectionHead kicker="Community activity" title="Recent results" />
          <p className="small live-line"><span className="pulse" aria-hidden="true" /> <strong className="tabular">{num(lastHour)}</strong> ratings submitted by simulated participants in the past hour <SampleTag>Simulated</SampleTag></p>
          <ul className="feed">
            {myRecent.map((r) => {
              const a = allArticles.find((x) => x.id === r.articleId); const o = optionForPoints(r.points); const v = vis(a);
              return (
                <li key={r.articleId} className="feed-item feed-you">
                  <span className={`feed-rating r${[100, 75, 50, 25, 0].indexOf(r.points)}`}>{o.short} · {r.points}</span>
                  <div>
                    <div className="small"><strong>You</strong> · {fmtRelative(new Date(r.submittedAt).getTime(), now)} · {v.status === 'closed' ? 'closed' : <>closes in <Countdown until={v.closesAt} /></>}</div>
                    <Link to="article" param={a.id} className="feed-hl"><Headline text={a.headline} /></Link>
                  </div>
                </li>
              );
            })}
            {recentClosed.map(({ a, v }) => {
              const c = communityAt(a.id, now, v.rating);
              return (
                <li key={a.id} className="feed-item">
                  <ScoreBadge score={c.mean} n={c.n} final />
                  <div>
                    <div className="small"><strong>{publications[a.pub].name}</strong> · closed {fmtRelative(windowFor(a.id).closesAt, now)}</div>
                    <Link to="article" param={a.id} className="feed-hl"><Headline text={a.headline} /></Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="featured-aside">
          <div className="kicker">Featured analysis</div>
          <h3 className="fa-title">{featuredEvent.title}</h3>
          {featuredSealed > 0 ? (
            <>
              <p className="small">{featuredSealed} of {featuredList.length} articles about this event are waiting for your blind rating. The side-by-side comparison of their framing unlocks once you’ve rated them or their windows close.</p>
              <div className="fa-actions"><Link to="compare" param={featuredEvent.id} className="btn btn-primary btn-sm">Start rating</Link></div>
            </>
          ) : (
            <>
              <p className="small">{featuredEvent.comparison.headline}</p>
              <dl className="fa-stats">
                <div><dt>Outlets compared</dt><dd className="tabular">{featuredList.length}</dd></div>
                <div><dt>Distinct sources</dt><dd className="tabular">{featuredSources}</dd></div>
                <div><dt>Claims traced</dt><dd className="tabular">{featuredClaims}</dd></div>
              </dl>
              <div className="fa-actions">
                <Link to="compare" param={featuredEvent.id} className="btn btn-primary btn-sm">Open comparison</Link>
                <Link to="sources" param={featuredEvent.id} className="btn btn-ghost btn-sm">Source map</Link>
              </div>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
