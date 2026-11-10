// Article and event cards. Every card asks the store's vis() before showing outlet,
// byline, link or community data, so sealed articles never leak through a card.
import { publications } from '../data/publications.js';
import { getEvent } from '../data/events.js';
import { windowFor, eventPublishedAt } from '../lib/schedule.js';
import { communityAt } from '../services/community.js';
import { fmtDateTime, fmtRelative } from '../lib/format.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import ArticleImage from './ArticleImage.jsx';
import { DistributionBar, ScoreBadge } from './Rating.jsx';
import { SealedPub, StatusBadge } from './Status.jsx';
import { Headline, Icon, LabelBadge, PubName } from './ui.jsx';

export function ArticleCard({ article, variant = 'row', showEvent = false }) {
  const { vis, now } = useStore();
  const v = vis(article);
  const pub = publications[article.pub];
  const ev = getEvent(article.eventId);
  const c = v.revealed ? communityAt(article.id, now, v.rating) : null;
  return (
    <article className={`acard acard-${variant} ${v.sealed ? 'is-sealed' : ''}`}>
      {variant !== 'text' && (
        <Link to="article" param={article.id} className="acard-img" tabIndex={-1} aria-hidden="true">
          <ArticleImage motif={article.image.motif} seed={article.id} label="Article illustration" />
        </Link>
      )}
      <div className="acard-body">
        <div className="meta-row">
          {v.sealed ? <SealedPub /> : <PubName pub={article.pub} />}
          {article.label !== 'News' && <LabelBadge label={article.label} />}
          <StatusBadge v={v} compact={variant === 'row' ? false : true} />
        </div>
        <h3 className="acard-title"><Link to="article" param={article.id}><Headline text={article.headline} /></Link></h3>
        <p className="acard-dek">{article.dek}</p>
        {showEvent && <p className="acard-event">Part of: <Link to="compare" param={ev.id}>{ev.title}</Link></p>}
        <div className="acard-foot">
          <span className="muted small">{!v.sealed && article.author ? `By ${article.author} · ` : ''}Published {fmtRelative(windowFor(article.id).opensAt, now)}</span>
          {v.sealed ? (
            <Link to="article" param={article.id} className="btn btn-primary btn-sm">Read and rate blind</Link>
          ) : (
            <>
              <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />
              <a className="small ext" href={pub.homepage} target="_blank" rel="noreferrer" title="Sample article: links to the publication’s homepage">Original <Icon name="external" size={12} /></a>
            </>
          )}
        </div>
        {variant === 'row' && c && c.n > 0 && <DistributionBar dist={c.dist} compact highlightPoints={v.rating?.points ?? null} />}
      </div>
    </article>
  );
}

/** Event card. Outlet lists appear only when no article in the event is sealed for this reader. */
export function EventCard({ event, articles, lead = false }) {
  const { vis, now } = useStore();
  const vs = articles.map((a) => vis(a));
  const sealed = articles.filter((_, i) => vs[i].sealed);
  const anySealed = sealed.length > 0;
  const first = articles[0];
  return (
    <article className={`ecard ${lead ? 'ecard-lead' : ''}`}>
      <Link to="compare" param={event.id} className="ecard-img" tabIndex={-1} aria-hidden="true">
        <ArticleImage motif={first.image.motif} seed={event.id} label="Event illustration" />
      </Link>
      <div className="ecard-body">
        <div className="kicker">{event.topic}</div>
        <h3 className={lead ? 'ecard-title-lead' : 'ecard-title'}><Link to="compare" param={event.id}>{event.title}</Link></h3>
        <p className="ecard-sum">{event.summary}</p>
        <div className="ecard-meta">
          {!anySealed && <span className="outlet-stack">{articles.slice(0, 6).map((a) => <span key={a.id} className="pubmark pubmark-xs" title={publications[a.pub].name}>{publications[a.pub].short}</span>)}</span>}
          <span className="small muted">{event.totalOutlets} publications covering · {articles.length} compared here · {fmtDateTime(eventPublishedAt(event.id))}</span>
        </div>
        {anySealed
          ? <p className="small ecard-lead-src"><span className="pulse" aria-hidden="true" /> {sealed.length} article{sealed.length === 1 ? '' : 's'} waiting for your blind rating</p>
          : <p className="small muted ecard-lead-src">Lead report: {publications[first.pub].name}, “<Headline text={first.headline} />”</p>}
        <div className="row-gap">
          {anySealed && <Link to="article" param={sealed[0].id} className="btn btn-primary btn-sm">Rate blind</Link>}
          <Link to="compare" param={event.id} className={`btn btn-sm ${anySealed ? 'btn-ghost' : 'btn-primary'}`}><Icon name="compare" size={14} /> Compare coverage</Link>
        </div>
      </div>
    </article>
  );
}
