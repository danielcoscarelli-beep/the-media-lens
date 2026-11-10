// Article page: blind reading and rating, then the reveal and the full analysis.
// What may be shown is decided by vis(article) (lib/visibility.js). While the reveal
// animation runs, the publication waits for stage 4 and the analysis for stage 5.
import { useEffect, useState } from 'react';
import { getArticleBundle } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { publications } from '../data/publications.js';
import { CLAIM_STATUS } from '../data/claims.js';
import { MARKERS } from '../data/articles.js';
import { communityAt } from '../services/community.js';
import { windowFor, shiftedSourceDate } from '../lib/schedule.js';
import { fmtDate, fmtDateTime, fmtRelative, num } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import ArticleImage from '../components/ArticleImage.jsx';
import RatingPanel, { useReveal, shown } from '../components/RatingPanel.jsx';
import { ArticleSourceMap } from '../components/SourceMap.jsx';
import { ClaimCard, SourceDrawer, TypeBadge, USE_CLASS, UseBadge } from '../components/SourceParts.jsx';
import { DistributionBar, ScoreBadge } from '../components/Rating.jsx';
import { Countdown, SealedPub, StatusBadge } from '../components/Status.jsx';
import { EmptyState, Headline, Icon, LabelBadge, PubName, SampleTag, Skeleton, Tabs } from '../components/ui.jsx';

export default function Article() {
  const { param } = useRouter();
  const { now, vis, markJourney } = useStore();
  const { data, loading } = useAsync(() => getArticleBundle(param, { now }), [param]);
  const [tab, setTab] = useState('analysis');
  const [drawer, setDrawer] = useState(null);
  const reveal = useReveal();
  useEffect(() => setTab('analysis'), [param]);
  useEffect(() => { if (tab === 'sources' && data && vis(data.article).revealed) markJourney('sources'); }, [tab, data, vis, markJourney]);

  if (loading) return <div className="page"><Skeleton lines={3} /><Skeleton image lines={5} /></div>;
  if (!data) return <div className="page"><EmptyState title="Article not found" action={<Link to="explore" className="btn btn-ghost btn-sm">Explore news</Link>}>This article isn’t in the sample library.</EmptyState></div>;

  const { article: a, event, siblings, sources, claims } = data;
  const v = vis(a);
  if (!v.published) {
    return <div className="page"><EmptyState title="Not published yet" action={<Link to="explore" className="btn btn-ghost btn-sm">See published articles</Link>}>This sample article will be published {fmtRelative(windowFor(a.id).opensAt, now)}.</EmptyState></div>;
  }
  const p = publications[a.pub];
  const pubShown = v.revealed && shown(reveal.stage, 4);
  const analysisShown = v.revealed && shown(reveal.stage, 5);
  const c = v.revealed ? communityAt(a.id, now, v.rating) : null;
  const openSource = (sid) => setDrawer({ sid, use: a.sourceUses.find((u) => u.id === sid) });
  const statusCounts = claims.reduce((m, x) => ({ ...m, [x.status]: (m[x.status] || 0) + 1 }), {});
  const useCounts = a.sourceUses.reduce((m, u) => ({ ...m, [u.cls]: (m[u.cls] || 0) + 1 }), {});
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

          {!analysisShown ? (
            <div className="locked-analysis">
              <Icon name="lock" size={16} />
              <div>
                <strong>{v.revealed ? 'Revealing…' : 'Analysis unlocks after you rate'}</strong>
                <p className="small muted">The publication, its sources, the framing analysis and the evidence behind its claims stay hidden until you submit your own rating. That way your judgment isn’t shaped by the outlet’s reputation or other readers.</p>
              </div>
            </div>
          ) : (
            <section className="analysis fade-in" aria-label="Article analysis">
              <div className="sticky-tabs">
                <Tabs id="article-tabs" value={tab} onChange={setTab} tabs={[
                  { key: 'analysis', label: 'Framing analysis' },
                  { key: 'sources', label: 'Sources', count: sources.length },
                  { key: 'facts', label: 'Facts & evidence', count: claims.length },
                ]} />
              </div>

              {tab === 'analysis' && (
                <div className="tab-pane fade-in">
                  <div className="dims3">
                    <div className="dim3"><div className="dim3-k">Factual basis</div><div className="dim3-v">{claims.length} claims traced</div>
                      <ul className="tiny">{Object.entries(statusCounts).map(([s, n]) => <li key={s}><span className={`dot-status status-${CLAIM_STATUS[s].tone}`} /> {n} {CLAIM_STATUS[s].label.toLowerCase()}</li>)}</ul>
                      <button className="linkish small" onClick={() => setTab('facts')}>Examine evidence</button></div>
                    <div className="dim3"><div className="dim3-k">Community perception</div><div className="dim3-v">{c.mean === null ? '—' : `${Math.round(c.mean)}/100`}</div>
                      <p className="tiny muted">{num(c.n)} ratings · combines perceived bias and accuracy · not a fact-check</p></div>
                    <div className="dim3"><div className="dim3-k">Opinion vs. reporting</div><div className="dim3-v">{a.label}</div><p className="tiny muted">{a.opinionNote}</p></div>
                  </div>
                  <section className="an-sec"><h2 className="an-h">Headline wording</h2><p className="an-hl"><Headline text={a.headline} highlight /></p></section>
                  <section className="an-sec"><h2 className="an-h">Central emphasis</h2><ul className="an-list">{a.emphasis.map((e) => <li key={e}>{e}</li>)}</ul></section>
                  <section className="an-sec"><h2 className="an-h">Language and framing</h2><p>{a.framing}</p>
                    {a.charged.length ? (
                      <div className="term-cards">{a.charged.map((t) => (
                        <div key={t.term} className="term-card"><div className="term-card-top"><mark className="hl">{t.term}</mark>{t.attributed ? <span className="tiny attr-tag">Attributed to a speaker</span> : <span className="tiny unattr-tag">Reporter’s own wording</span>}</div><p className="small">{t.note}</p></div>
                      ))}</div>
                    ) : <p className="small muted">No charged or loaded terms were flagged in the headline or lede.</p>}
                  </section>
                  <section className="an-sec"><h2 className="an-h">Perspectives represented</h2>
                    <dl className="persp-kv">{Object.entries({ Supporters: a.perspectives.supporters, Opponents: a.perspectives.opponents, 'Independent experts / data': a.perspectives.independent, 'Affected communities': a.perspectives.affected }).map(([k, val]) => <div key={k}><dt>{k}</dt><dd className="tabular">{val}</dd></div>)}</dl>
                  </section>
                  <section className="an-sec"><h2 className="an-h">Omitted or underplayed</h2><ul className="an-list">{a.omissions.length ? a.omissions.map((o) => <li key={o}>{o}</li>) : <li className="muted">Nothing significant noted relative to other coverage.</li>}</ul></section>
                  {a.markers.length > 0 && <section className="an-sec"><h2 className="an-h">Objective text markers</h2><ul className="an-list">{a.markers.map((m) => <li key={m}>{MARKERS[m].label}</li>)}</ul><p className="tiny muted">These features can be checked directly in the text. They inform, but do not decide, a judgment about bias.</p></section>}
                  <div className="next-step"><span className="small">Next: see where this article’s information comes from.</span><button className="btn btn-primary btn-sm" onClick={() => setTab('sources')}>Investigate sources <Icon name="arrow" size={13} /></button></div>
                </div>
              )}

              {tab === 'sources' && (
                <div className="tab-pane fade-in">
                  <h2 className="an-h">Source transparency</h2>
                  <div className="use-summary">{Object.keys(USE_CLASS).map((k) => <div key={k} className={`use-tile ${useCounts[k] ? '' : 'zero'}`}><span className="tabular">{useCounts[k] || 0}</span><UseBadge cls={k} /></div>)}</div>
                  <ArticleSourceMap article={a} onSource={openSource} onClaim={() => setTab('facts')} />
                  <ul className="source-list">
                    {sources.map((s) => (
                      <li key={s.id}>
                        <button className="source-row" onClick={() => openSource(s.id)}>
                          <span className="sr-main"><strong>{s.name}</strong><span className="small muted">{s.publisher} · {fmtDate(shiftedSourceDate(s.id, s.date))}</span><span className="small">{s.use.usage}</span></span>
                          <span className="sr-badges"><TypeBadge type={s.type} /><UseBadge cls={s.use.cls} /></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="next-step"><span className="small">Compare these sources with other outlets’ coverage.</span><Link to="sources" param={a.id} className="btn btn-ghost btn-sm">Open in Source Explorer</Link><Link to="compare" param={event.id} className="btn btn-primary btn-sm">Compare coverage <Icon name="arrow" size={13} /></Link></div>
                </div>
              )}

              {tab === 'facts' && (
                <div className="tab-pane fade-in">
                  <h2 className="an-h">Facts and evidence</h2>
                  <div className="callout small"><Icon name="info" size={15} /> <span><strong>No independent fact-check.</strong> The Media Lens has not checked these sample claims. Each claim shows the sourcing the article gives and what the cited record contains. This is separate from the community score, which is an average of readers’ perceptions.</span></div>
                  <ul className="status-legend tiny">{Object.entries(CLAIM_STATUS).map(([k, s]) => <li key={k}><span className={`status status-${s.tone}`}>{s.label}</span> {s.help}</li>)}</ul>
                  <div className="claims">{claims.map((x, i) => <ClaimCard key={x.id} claim={x} index={i} onSource={openSource} />)}</div>
                </div>
              )}
            </section>
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
              <>
                <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />
                {c.n > 0 && <DistributionBar dist={c.dist} compact highlightPoints={v.rating?.points ?? null} />}
              </>
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
      <SourceDrawer sourceId={drawer?.sid} use={drawer?.use} onClose={() => setDrawer(null)} />
    </div>
  );
}
