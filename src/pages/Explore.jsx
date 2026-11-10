import { useEffect, useState } from 'react';
import { searchArticles } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { pubList, publications } from '../data/publications.js';
import { TOPICS } from '../data/events.js';
import { fmtDateTime } from '../lib/format.js';
import { eventPublishedAt } from '../lib/schedule.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { SearchBox } from '../components/Shell.jsx';
import { ArticleCard } from '../components/Cards.jsx';
import { EmptyState, Icon, SampleTag, Skeleton } from '../components/ui.jsx';

export default function Explore() {
  const { param } = useRouter();
  const { markJourney, vis, now, mode, ratings, boundaryKey } = useStore();
  const q = param.replace(/-/g, ' ');
  const [pubs, setPubs] = useState([]);
  const [topic, setTopic] = useState('');
  const [range, setRange] = useState('any');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [view, setView] = useState('events');

  useEffect(() => { if (q) markJourney('searched'); }, [q, markJourney]);
  const { data, loading } = useAsync(() => searchArticles({ q, pubs, topic, range, sort, status, vis, now }), [q, pubs.join(), topic, range, sort, status, mode, ratings.length, boundaryKey]);
  const togglePub = (id) => setPubs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const active = pubs.length + (topic ? 1 : 0) + (range !== 'any' ? 1 : 0) + (status !== 'all' ? 1 : 0);
  const clear = () => { setPubs([]); setTopic(''); setRange('any'); setStatus('all'); };

  return (
    <div className="page explore">
      <header className="page-head">
        <div className="kicker">Explore News</div>
        <h1 className="page-title">{q ? <>Results for “{q}”</> : 'Browse coverage'}</h1>
        <p className="page-sub">Search sample coverage by event, person, organization or subject. Related articles are grouped into shared news events. Articles open for rating show only their headline and summary until you rate them.</p>
        <SearchBox size="lg" initial={q} />
      </header>

      <div className="explore-layout">
        <aside className="filters" aria-label="Filters">
          <details open className="filter-group">
            <summary>Rating window</summary>
            <div className="check-list">
              {[['all', 'All published'], ['open', 'Open for rating'], ['closed', 'Closed (final results)']].map(([val, l]) => (
                <label key={val} className="check"><input type="radio" name="status" checked={status === val} onChange={() => setStatus(val)} /><span>{l}</span></label>
              ))}
            </div>
          </details>
          <details open className="filter-group" data-leak-exempt>
            <summary>Publication {pubs.length > 0 && <span className="count-pill">{pubs.length}</span>}</summary>
            <div className="check-list">
              {pubList.map((p) => (
                <label key={p.id} className="check">
                  <input type="checkbox" checked={pubs.includes(p.id)} onChange={() => togglePub(p.id)} />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            {mode === 'rating' && <p className="tiny muted">Filtering by publication leaves out articles you haven’t rated yet, so it can’t reveal their outlets.</p>}
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
              {[['any', 'Any time'], ['24', 'Past 24 hours'], ['72', 'Past 3 days'], ['168', 'Past week']].map(([val, l]) => (
                <label key={val} className="check"><input type="radio" name="range" checked={range === val} onChange={() => setRange(val)} /><span>{l}</span></label>
              ))}
            </div>
            <p className="tiny muted">By publication time.</p>
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
                        <div className="kicker">{ev.topic} · {fmtDateTime(eventPublishedAt(ev.id))}</div>
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
          <p className="tiny muted">“Original” links go to each publication’s homepage; these sample stories were not published there. {Object.keys(publications).length} publications in the sample library. Unpublished sample articles appear as the timeline advances.</p>
        </section>
      </div>
    </div>
  );
}
