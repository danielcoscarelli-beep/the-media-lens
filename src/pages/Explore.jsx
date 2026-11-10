import { useEffect, useState } from 'react';
import { searchArticles } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { pubList, publications } from '../data/publications.js';
import { TOPICS } from '../data/events.js';
import { fmtDate } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { SearchBox } from '../components/Shell.jsx';
import { ArticleCard } from '../components/Cards.jsx';
import { EmptyState, Icon, SampleTag, Skeleton } from '../components/ui.jsx';

export default function Explore() {
  const { param } = useRouter();
  const { markJourney } = useStore();
  const q = param.replace(/-/g, ' ');
  const [pubs, setPubs] = useState([]);
  const [topic, setTopic] = useState('');
  const [range, setRange] = useState('any');
  const [sort, setSort] = useState('relevance');
  const [view, setView] = useState('events');

  useEffect(() => { if (q) markJourney('searched'); }, [q, markJourney]);
  const { data, loading } = useAsync(() => searchArticles({ q, pubs, topic, range, sort }), [q, pubs.join(), topic, range, sort]);
  const togglePub = (id) => setPubs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const active = pubs.length + (topic ? 1 : 0) + (range !== 'any' ? 1 : 0);
  const clear = () => { setPubs([]); setTopic(''); setRange('any'); };

  return (
    <div className="page explore">
      <header className="page-head">
        <div className="kicker">Explore News</div>
        <h1 className="page-title">{q ? <>Results for “{q}”</> : 'Browse coverage'}</h1>
        <p className="page-sub">Search sample coverage by event, person, organization or subject. Related articles are grouped into shared news events.</p>
        <SearchBox size="lg" initial={q} />
      </header>

      <div className="explore-layout">
        <aside className="filters" aria-label="Filters">
          <details open className="filter-group">
            <summary>Publication {pubs.length > 0 && <span className="count-pill">{pubs.length}</span>}</summary>
            <div className="check-list">
              {pubList.map((p) => (
                <label key={p.id} className="check">
                  <input type="checkbox" checked={pubs.includes(p.id)} onChange={() => togglePub(p.id)} />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          </details>
          <details open className="filter-group">
            <summary>Topic</summary>
            <div className="check-list">
              <label className="check"><input type="radio" name="topic" checked={!topic} onChange={() => setTopic('')} /><span>All topics</span></label>
              {TOPICS.map((t) => <label key={t} className="check"><input type="radio" name="topic" checked={topic === t} onChange={() => setTopic(t)} /><span>{t}</span></label>)}
            </div>
          </details>
          <details open className="filter-group">
            <summary>Date</summary>
            <div className="check-list">
              {[['any', 'Any time'], ['2', 'Past 2 days'], ['4', 'Past 4 days'], ['7', 'Past week']].map(([v, l]) => (
                <label key={v} className="check"><input type="radio" name="range" checked={range === v} onChange={() => setRange(v)} /><span>{l}</span></label>
              ))}
            </div>
            <p className="tiny muted">Relative to the sample edition date, Nov 1, 2026.</p>
          </details>
          {active > 0 && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear {active} filter{active > 1 ? 's' : ''}</button>}
        </aside>

        <section className="results" aria-live="polite">
          <div className="toolbar">
            <span className="small">{loading ? 'Searching…' : <><strong>{data.articles.length}</strong> articles in <strong>{data.events.length}</strong> events</>} <SampleTag /></span>
            <div className="toolbar-ctrls">
              <div className="seg" role="group" aria-label="View">
                <button className={view === 'events' ? 'on' : ''} onClick={() => setView('events')}>By event</button>
                <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>All articles</button>
              </div>
              <label className="select-wrap"><span className="sr-only">Sort by</span>
                <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Sort: Relevance</option>
                  <option value="recency">Sort: Most recent</option>
                  <option value="publication">Sort: Publication A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="stack"><Skeleton image lines={3} /><Skeleton image lines={3} /><Skeleton image lines={3} /></div>
          ) : !data.articles.length ? (
            <EmptyState title="No matching coverage" action={<div className="row-gap">{active > 0 && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear filters</button>}<Link to="explore" className="btn btn-ghost btn-sm">Show everything</Link></div>}>
              Nothing in the sample library matches {q ? `“${q}”` : 'these filters'}. Try a broader term, such as “Senate”, “AI” or “water”.
            </EmptyState>
          ) : view === 'events' ? (
            <div className="event-groups">
              {data.events.map((ev) => {
                const list = data.articles.filter((a) => a.eventId === ev.id);
                return (
                  <section key={ev.id} className="egroup">
                    <header className="egroup-head">
                      <div>
                        <div className="kicker">{ev.topic} · {fmtDate(ev.date)}</div>
                        <h2 className="egroup-title"><Link to="compare" param={ev.id}>{ev.title}</Link></h2>
                        <p className="small muted">{ev.summary}</p>
                      </div>
                      <Link to="compare" param={ev.id} className="btn btn-primary btn-sm"><Icon name="compare" size={14} /> Compare {ev.totalOutlets} outlets</Link>
                    </header>
                    <div className="stack">{list.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="stack">{data.articles.map((a) => <ArticleCard key={a.id} article={a} showEvent />)}</div>
          )}
          <p className="tiny muted">Article links go to each publication’s homepage. These sample stories were not published there. {Object.keys(publications).length} publications in the sample library.</p>
        </section>
      </div>
    </div>
  );
}
