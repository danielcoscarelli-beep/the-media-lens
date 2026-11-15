// Compare Coverage: each publication's report on one event, side by side, with its community
// score. Blind-rating rule: a sealed article appears as "Publication hidden" with only its
// headline and summary, and no score.
import { useEffect, useMemo } from 'react';
import { getEventBundle, listEvents } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { publications } from '../data/publications.js';
import { communityAt } from '../services/community.js';
import { windowFor, eventPublishedAt } from '../lib/schedule.js';
import { fmtDateTime, num } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { ScoreBadge } from '../components/Rating.jsx';
import { StatusBadge } from '../components/Status.jsx';
import { EmptyState, Headline, Icon, LabelBadge, SampleTag, SectionHead, Skeleton } from '../components/ui.jsx';
import ArticleImage from '../components/ArticleImage.jsx';

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 5);
const stableOrder = (list) => [...list].sort((x, y) => hash(x.id) - hash(y.id));

export default function Compare() {
  const { param } = useRouter();
  return param ? <CompareEvent id={param} /> : <CompareIndex />;
}

function CompareIndex() {
  const { now, vis, boundaryKey } = useStore();
  const { data, loading } = useAsync(() => listEvents({ now }), [boundaryKey]);
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Compare Coverage</div>
        <h1 className="page-title">Choose an event to compare</h1>
        <p className="page-sub">See several publications’ reports on the same event side by side, with each article’s community score. Articles you haven’t rated yet stay anonymous.</p>
      </header>
      {loading || !data ? <div className="stack"><Skeleton lines={2} /><Skeleton lines={2} /></div> : (
        <div className="event-index">
          {data.map((e) => {
            const vs = e.articles.map((a) => vis(a));
            const sealed = vs.filter((v) => v.sealed).length;
            const unlocked = !sealed && e.articles.length === e.allCount;
            const open = vs.filter((v) => v.status === 'open').length;
            const means = unlocked ? e.articles.map((a, i) => communityAt(a.id, now, vs[i].rating).mean).filter((m) => m !== null) : [];
            const spread = means.length ? Math.max(...means) - Math.min(...means) : 0;
            return (
              <Link key={e.id} to="compare" param={e.id} className={`eindex ${e.featured ? 'is-featured' : ''}`}>
                <div className="eindex-img"><ArticleImage motif={e.articles[0].image.motif} seed={e.id} label="Event illustration" /></div>
                <div className="eindex-body">
                  <div className="kicker">{e.topic}</div>
                  <h2 className="eindex-title">{e.title}</h2>
                  <p className="small muted">{e.summary}</p>
                  <div className="eindex-meta small">
                    <span>{e.articles.length} outlets{e.allCount > e.articles.length ? ` (${e.allCount - e.articles.length} more coming)` : ''}</span>
                    <span>{fmtDateTime(eventPublishedAt(e.id))}</span>
                    <span>{open ? `${open} open for rating` : 'All closed'}</span>
                    {unlocked
                      ? <span title="Gap between the highest and lowest community score in this event">Score spread <span className="div-meter"><span style={{ width: `${spread}%` }} /></span> <span className="tabular">{Math.round(spread)} pts</span></span>
                      : <span className="sealed-note"><Icon name="lock" size={11} /> {sealed ? `${sealed} awaiting your blind rating` : 'Waiting for remaining coverage'}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareEvent({ id }) {
  const { now, vis, markJourney, boundaryKey } = useStore();
  const { data, loading } = useAsync(() => getEventBundle(id, { now }), [id, boundaryKey]);
  const articles = useMemo(() => (data ? stableOrder(data.articles) : []), [data]);
  const vs = articles.map((a) => vis(a));
  const sealedCount = vs.filter((v) => v.sealed).length;
  const unlocked = !!data && !sealedCount && data.articles.length === data.allCount;
  useEffect(() => { if (unlocked) markJourney('compared'); }, [unlocked, markJourney]);

  if (loading && !data) return <div className="page"><Skeleton lines={2} /><div className="cols-skel"><Skeleton image lines={6} /><Skeleton image lines={6} /><Skeleton image lines={6} /></div></div>;
  if (!data) return <div className="page"><EmptyState title="Event not found" action={<Link to="compare" className="btn btn-ghost btn-sm">All events</Link>}>This event isn’t in the sample library, or none of its articles are published yet.</EmptyState></div>;
  const { event } = data;

  return (
    <div className="page compare">
      <nav className="crumbs small"><Link to="compare">Compare Coverage</Link> <span>/</span> {event.topic}</nav>
      <header className="page-head">
        <div className="kicker">{event.topic} · {fmtDateTime(eventPublishedAt(event.id))} <SampleTag /></div>
        <h1 className="page-title">{event.title}</h1>
        <p className="page-sub">{event.summary}</p>
        <div className="head-meta small">
          <span><strong>{event.totalOutlets}</strong> publications covering</span>
          <span><strong>{articles.length}</strong> compared below{data.allCount > articles.length ? ` (${data.allCount - articles.length} not yet published)` : ''}</span>
          {sealedCount > 0 && <span className="sealed-note"><Icon name="lock" size={12} /> {sealedCount} awaiting your blind rating</span>}
        </div>
      </header>

      <section className="lineup" aria-label="Headline lineup">
        <h2 className="mini-h">Headline lineup</h2>
        <ol>
          {articles.map((a, i) => {
            const v = vs[i];
            const c = v.revealed ? communityAt(a.id, now, v.rating) : null;
            return (
              <li key={a.id}>
                {v.sealed ? <span className="lineup-pub sealed" title="Publication hidden until you rate">Hidden</span> : <span className="lineup-pub">{publications[a.pub].short}</span>}
                <Link to="article" param={a.id} className="lineup-hl"><Headline text={a.headline} /></Link>
                {v.sealed ? <Link to="article" param={a.id} className="btn btn-primary btn-sm">Rate blind</Link> : <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />}
              </li>
            );
          })}
        </ol>
        <p className="tiny muted">Scores are averages of readers’ ratings of each specific article, from 1 to 100 (100 = least biased; gray = least biased, red = most biased): community perception, not a fact-check.</p>
      </section>

      <section className="block">
        <SectionHead kicker="Side by side" title="How each publication reported it">Scroll horizontally to see all {articles.length} reports.{sealedCount ? ' Anonymous columns reveal their outlet and score once you rate them.' : ''}</SectionHead>
        <div className="columns-scroll">
          <div className="columns" style={{ gridTemplateColumns: `repeat(${articles.length}, minmax(270px, 1fr))` }}>
            {articles.map((a, i) => (vs[i].sealed
              ? <SealedColumn key={a.id} a={a} v={vs[i]} />
              : <CoverageColumn key={a.id} a={a} v={vs[i]} />))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SealedColumn({ a, v }) {
  return (
    <article className="ccol ccol-sealed">
      <header className="ccol-head">
        <span className="pubmark pubmark-sm pubmark-sealed" aria-hidden="true">?</span>
        <div><div className="ccol-pub">Publication hidden</div><div className="tiny muted"><StatusBadge v={v} compact /></div></div>
        {a.label !== 'News' && <LabelBadge label={a.label} />}
      </header>
      <h3 className="ccol-hl"><Link to="article" param={a.id}><Headline text={a.headline} /></Link></h3>
      <p className="ccol-dek">{a.dek}</p>
      <div className="ccol-locked"><Icon name="lock" size={14} /> Outlet and community score are hidden until you rate this article.</div>
      <div className="ccol-foot"><Link to="article" param={a.id} className="btn btn-primary btn-sm">Read and rate blind</Link></div>
    </article>
  );
}

function CoverageColumn({ a, v }) {
  const { now } = useStore();
  const c = communityAt(a.id, now, v.rating);
  const p = publications[a.pub];
  return (
    <article className="ccol">
      <header className="ccol-head">
        <span className="pubmark pubmark-sm">{p.short}</span>
        <div><div className="ccol-pub">{p.name}</div><div className="tiny muted">{fmtDateTime(windowFor(a.id).opensAt)}</div></div>
        <LabelBadge label={a.label} />
      </header>
      <h3 className="ccol-hl"><Link to="article" param={a.id}><Headline text={a.headline} /></Link></h3>
      <p className="ccol-dek">{a.dek}</p>
      <div className="ccol-sec"><h4>Community score</h4>
        <div className="ccol-assess"><ScoreBadge score={c.mean} final={v.status === 'closed'} /><span className="tiny muted">{num(c.n)} ratings · {v.status === 'closed' ? 'final' : 'live'}</span></div>
        {v.rating && <p className="tiny muted">Your rating: <strong className="tabular">{v.rating.points}</strong></p>}
      </div>
      <div className="ccol-foot">
        <Link to="article" param={a.id} className="btn btn-primary btn-sm">Read article</Link>
        <a href={p.homepage} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" title="Sample article: links to the publication’s homepage">Original <Icon name="external" size={12} /></a>
      </div>
    </article>
  );
}
