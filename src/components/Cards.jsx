import { publications } from '../data/publications.js';
import { getEvent } from '../data/events.js';
import { fmtDate, num } from '../lib/format.js';
import { aggregate } from '../lib/stats.js';
import { Link } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import ArticleImage from './ArticleImage.jsx';
import { Headline, Icon, LabelBadge, PubName } from './ui.jsx';
import { DistributionBar } from './Rating.jsx';

export function ArticleCard({ article, variant = 'row', showEvent = false }) {
  const { evalFor } = useStore();
  const agg = aggregate(article, evalFor(article.id));
  const pub = publications[article.pub];
  const ev = getEvent(article.eventId);
  return (
    <article className={`acard acard-${variant}`}>
      {variant !== 'text' && (
        <Link to="article" param={article.id} className="acard-img" tabIndex={-1} aria-hidden="true">
          <ArticleImage motif={article.image.motif} seed={article.id} />
        </Link>
      )}
      <div className="acard-body">
        <div className="meta-row">
          <PubName pub={article.pub} />
          {article.label !== 'News' && <LabelBadge label={article.label} />}
        </div>
        <h3 className="acard-title"><Link to="article" param={article.id}><Headline text={article.headline} /></Link></h3>
        <p className="acard-dek">{article.dek}</p>
        {showEvent && <p className="acard-event">Part of: <Link to="compare" param={ev.id}>{ev.title}</Link></p>}
        <div className="acard-foot">
          <span className="muted small">{article.author ? `By ${article.author} · ` : ''}{fmtDate(article.date)}</span>
          <span className="acard-evals small"><Icon name="chat" size={13} /> {num(agg.n)} evaluations</span>
          <a className="small ext" href={pub.homepage} target="_blank" rel="noreferrer" title="Sample article: links to the publication’s homepage">Original <Icon name="external" size={12} /></a>
        </div>
        {variant === 'row' && <DistributionBar dist={agg.dist} compact />}
      </div>
    </article>
  );
}

export function EventCard({ event, articles, lead = false }) {
  const first = articles[0];
  return (
    <article className={`ecard ${lead ? 'ecard-lead' : ''}`}>
      <Link to="compare" param={event.id} className="ecard-img" tabIndex={-1} aria-hidden="true">
        <ArticleImage motif={first.image.motif} seed={event.id} />
      </Link>
      <div className="ecard-body">
        <div className="kicker">{event.topic}</div>
        <h3 className={lead ? 'ecard-title-lead' : 'ecard-title'}><Link to="compare" param={event.id}>{event.title}</Link></h3>
        <p className="ecard-sum">{event.summary}</p>
        <div className="ecard-meta">
          <span className="outlet-stack">{articles.slice(0, 6).map((a) => <span key={a.id} className="pubmark pubmark-xs" title={publications[a.pub].name}>{publications[a.pub].short}</span>)}</span>
          <span className="small muted">{event.totalOutlets} publications covering · {articles.length} compared here · {fmtDate(event.date)}</span>
        </div>
        <p className="small muted ecard-lead-src">Lead report: {publications[first.pub].name}, “<Headline text={first.headline} />”</p>
        <Link to="compare" param={event.id} className="btn btn-primary btn-sm"><Icon name="compare" size={14} /> Compare coverage</Link>
      </div>
    </article>
  );
}
