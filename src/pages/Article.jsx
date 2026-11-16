// Article page: blind reading and rating, then the reveal.
// What may be shown is decided by vis(article) (lib/visibility.js). While the reveal
// animation runs, the publication waits for stage 4 and the next-step links for stage 5.
import { getArticleBundle } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { publications } from '../data/publications.js';
import { communityAt } from '../services/community.js';
import { windowFor } from '../lib/schedule.js';
import { fmtDateTime, fmtRelative } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import ArticleImage from '../components/ArticleImage.jsx';
import RatingPanel, { useReveal, shown } from '../components/RatingPanel.jsx';
import { ScoreBadge } from '../components/Rating.jsx';
import { Countdown, SealedPub, StatusBadge } from '../components/Status.jsx';
import { EmptyState, Headline, Icon, LabelBadge, PubName, SampleTag, Skeleton } from '../components/ui.jsx';

export default function Article() {
  const { param } = useRouter();
  const { now, vis } = useStore();
  const { data, loading } = useAsync(() => getArticleBundle(param, { now }), [param]);
  const reveal = useReveal();

  if (loading) return <div className="page"><Skeleton lines={3} /><Skeleton image lines={5} /></div>;
  if (!data) return <div className="page"><EmptyState title="Article not found" action={<Link to="explore" className="btn btn-ghost btn-sm">Explore news</Link>}>This article isn’t in the sample library.</EmptyState></div>;

  const { article: a, event, siblings } = data;
  const v = vis(a);
  if (!v.published) {
    return <div className="page"><EmptyState title="Not published yet" action={<Link to="explore" className="btn btn-ghost btn-sm">See published articles</Link>}>This sample article will be published {fmtRelative(windowFor(a.id).opensAt, now)}.</EmptyState></div>;
  }
  const p = publications[a.pub];
  const pubShown = v.revealed && shown(reveal.stage, 4);
  const nextShown = v.revealed && shown(reveal.stage, 5);
  const c = v.revealed ? communityAt(a.id, now, v.rating) : null;
  const w = windowFor(a.id);

  return (
    <div className={`page article ${v.sealed ? 'is-sealed' : ''}`}>
      <nav className="crumbs small"><Link to="compare" param={event.id}>{event.title}</Link> <span>/</span> {pubShown ? p.name : 'Article'}</nav>
      <div className="article-layout">
        <div className="article-main">
          <header className="art-head">
            <div className="meta-row">
              {pubShown ? <span className={reveal.stage ? 'reveal-pub' : ''}><PubName pub={a.pub} /></span> : <SealedPub />}
              {a.label !== 'News' && <LabelBadge label={a.label} />}
              <StatusBadge v={v} />
              <SampleTag />
            </div>
            <h1 className="art-title"><Headline text={a.headline} /></h1>
            <p className="art-dek">{a.dek}</p>
            <div className="art-byline small">
              {pubShown
                ? <>By <strong>{a.author}</strong> · {fmtDateTime(w.opensAt)} · <a href={p.homepage} target="_blank" rel="noreferrer">Original publication <Icon name="external" size={12} /></a></>
                : <>Published {fmtRelative(w.opensAt, now)} · <span className="muted">Byline hidden until you rate</span></>}
            </div>
          </header>
          <ArticleImage motif={a.image.motif} seed={a.id} label="Article illustration" />
          <div className="art-body">
            {a.body.map((para, i) => <p key={i}>{para}</p>)}
            <p className="tiny muted art-body-note">Sample text written for this prototype. It is not real reporting.</p>
          </div>

          <RatingPanel article={a} v={v} reveal={reveal} showHeadline={false} />

          {!v.revealed ? (
            <div className="locked-analysis">
              <Icon name="lock" size={16} />
              <div>
                <strong>The publication is revealed after you rate</strong>
                <p className="small muted">The outlet, byline and community score stay hidden until you submit your own rating. That way your judgment isn’t shaped by the outlet’s reputation or other readers.</p>
              </div>
            </div>
          ) : nextShown && (
            <div className="next-step fade-in"><span className="small">See how other publications covered the same event.</span><Link to="compare" param={event.id} className="btn btn-primary btn-sm">Compare coverage <Icon name="arrow" size={13} /></Link></div>
          )}
        </div>

        <aside className="article-side">
          <div className="side-box">
            <div className="kicker">Rating window</div>
            {v.status === 'open'
              ? <><div className="side-countdown"><Countdown until={w.closesAt} done="Closing…" /></div><p className="tiny muted">left to rate · closes {fmtDateTime(w.closesAt)}</p></>
              : <><div className="side-mean">Closed</div><p className="tiny muted">Closed to new ratings {fmtDateTime(w.closesAt)}. Results are final and public.</p></>}
          </div>
          <div className="side-box">
            <div className="kicker">Community score</div>
            {v.revealed && shown(reveal.stage, 3) ? (
              <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />
            ) : <p className="small muted"><Icon name="lock" size={12} /> Hidden until you rate.</p>}
          </div>
          <div className="side-box">
            <div className="kicker">Same event, other coverage</div>
            <ul className="side-list">
              {siblings.map((s) => {
                const sv = vis(s);
                return (
                  <li key={s.id}><Link to="article" param={s.id}>
                    {sv.sealed ? <span className="pubmark pubmark-xs pubmark-sealed" title="Publication hidden until you rate">?</span> : <span className="pubmark pubmark-xs">{publications[s.pub].short}</span>}
                    <Headline text={s.headline} />
                  </Link></li>
                );
              })}
              {!siblings.length && <li className="small muted">No other coverage published yet.</li>}
            </ul>
            <Link to="compare" param={event.id} className="textlink small">Compare side by side <Icon name="arrow" size={12} /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
