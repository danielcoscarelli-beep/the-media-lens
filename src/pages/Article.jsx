import { useEffect, useState } from 'react';
import { getArticleBundle } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { publications } from '../data/publications.js';
import { CLAIM_STATUS } from '../data/claims.js';
import { MARKERS } from '../data/articles.js';
import { aggregate, meanLabel } from '../lib/stats.js';
import { fmtDate, num } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import ArticleImage from '../components/ArticleImage.jsx';
import EvaluationPanel from '../components/EvaluationPanel.jsx';
import { ArticleSourceMap } from '../components/SourceMap.jsx';
import { ClaimCard, SourceDrawer, TypeBadge, USE_CLASS, UseBadge } from '../components/SourceParts.jsx';
import { DistributionBar } from '../components/Rating.jsx';
import { EmptyState, Headline, Icon, LabelBadge, SampleTag, Skeleton, Tabs } from '../components/ui.jsx';

export default function Article() {
  const { param } = useRouter();
  const { data, loading } = useAsync(() => getArticleBundle(param), [param]);
  const { markJourney, evalFor } = useStore();
  const [tab, setTab] = useState('analysis');
  const [drawer, setDrawer] = useState(null);
  useEffect(() => setTab('analysis'), [param]);
  useEffect(() => { if (data) markJourney('opened'); }, [data, markJourney]);
  useEffect(() => { if (tab === 'sources') markJourney('sources'); }, [tab, markJourney]);

  if (loading) return <div className="page"><Skeleton lines={3} /><Skeleton image lines={5} /></div>;
  if (!data) return <div className="page"><EmptyState title="Article not found" action={<Link to="explore" className="btn btn-ghost btn-sm">Explore news</Link>}>This article isn’t in the sample library.</EmptyState></div>;

  const { article: a, event, siblings, sources, claims } = data;
  const p = publications[a.pub];
  const agg = aggregate(a, evalFor(a.id));
  const openSource = (sid) => setDrawer({ sid, use: a.sourceUses.find((u) => u.id === sid) });
  const statusCounts = claims.reduce((m, c) => ({ ...m, [c.status]: (m[c.status] || 0) + 1 }), {});
  const useCounts = a.sourceUses.reduce((m, u) => ({ ...m, [u.cls]: (m[u.cls] || 0) + 1 }), {});

  return (
    <div className="page article">
      <nav className="crumbs small"><Link to="compare" param={event.id}>{event.title}</Link> <span>/</span> {p.name}</nav>
      <div className="article-layout">
        <div className="article-main">
          <header className="art-head">
            <div className="meta-row"><span className="pubname"><span className="pubmark pubmark-sm">{p.short}</span><span>{p.name}</span></span><LabelBadge label={a.label} /><SampleTag /></div>
            <h1 className="art-title"><Headline text={a.headline} highlight={tab === 'analysis'} /></h1>
            <p className="art-dek">{a.dek}</p>
            <div className="art-byline small">By <strong>{a.author}</strong> · {fmtDate(a.date)}, {a.time} · <a href={p.homepage} target="_blank" rel="noreferrer">Original publication <Icon name="external" size={12} /></a></div>
          </header>
          <ArticleImage motif={a.image.motif} seed={a.id} label={`Illustration for ${p.name} article`} />

          <div className="sticky-tabs">
            <Tabs id="article-tabs" value={tab} onChange={setTab} tabs={[
              { key: 'analysis', label: 'Framing analysis' },
              { key: 'sources', label: 'Sources', count: sources.length },
              { key: 'facts', label: 'Facts & evidence', count: claims.length },
              { key: 'evaluate', label: evalFor(a.id) ? 'Your evaluation' : 'Evaluate headline' },
            ]} />
          </div>

          {tab === 'analysis' && (
            <div className="tab-pane fade-in">
              <div className="dims3">
                <div className="dim3"><div className="dim3-k">Factual basis</div><div className="dim3-v">{claims.length} claims traced</div>
                  <ul className="tiny">{Object.entries(statusCounts).map(([s, n]) => <li key={s}><span className={`dot-status status-${CLAIM_STATUS[s].tone}`} /> {n} {CLAIM_STATUS[s].label.toLowerCase()}</li>)}</ul>
                  <button className="linkish small" onClick={() => setTab('facts')}>Examine evidence</button></div>
                <div className="dim3"><div className="dim3-k">Framing</div><div className="dim3-v">{meanLabel(agg.mean)}</div>
                  <p className="tiny muted">Community view from {num(agg.n)} readers · {a.charged.length} flagged term{a.charged.length === 1 ? '' : 's'}</p>
                  <button className="linkish small" onClick={() => setTab('evaluate')}>Add your rating</button></div>
                <div className="dim3"><div className="dim3-k">Opinion vs. reporting</div><div className="dim3-v">{a.label}</div><p className="tiny muted">{a.opinionNote}</p></div>
              </div>
              <p className="tiny muted">These are separate questions. A report can be factually accurate and still framed one-sidedly, and an openly labeled opinion piece can be well sourced.</p>

              <section className="an-sec"><h2 className="an-h">Central emphasis</h2><ul className="an-list">{a.emphasis.map((e) => <li key={e}>{e}</li>)}</ul></section>
              <section className="an-sec"><h2 className="an-h">Language and framing</h2><p>{a.framing}</p>
                {a.charged.length ? (
                  <div className="term-cards">{a.charged.map((c) => (
                    <div key={c.term} className="term-card"><div className="term-card-top"><mark className="hl">{c.term}</mark>{c.attributed ? <span className="tiny attr-tag">Attributed to a speaker</span> : <span className="tiny unattr-tag">Reporter’s own wording</span>}</div><p className="small">{c.note}</p></div>
                  ))}</div>
                ) : <p className="small muted">No charged or loaded terms were flagged in the headline or lede.</p>}
              </section>
              <section className="an-sec"><h2 className="an-h">Perspectives represented</h2>
                <dl className="persp-kv">{Object.entries({ 'Supporters': a.perspectives.supporters, 'Opponents': a.perspectives.opponents, 'Independent experts / data': a.perspectives.independent, 'Affected communities': a.perspectives.affected }).map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="tabular">{v}</dd></div>)}</dl>
              </section>
              <section className="an-sec"><h2 className="an-h">Omitted or underplayed</h2><ul className="an-list">{a.omissions.length ? a.omissions.map((o) => <li key={o}>{o}</li>) : <li className="muted">Nothing significant noted relative to other coverage.</li>}</ul></section>
              {a.markers.length > 0 && <section className="an-sec"><h2 className="an-h">Objective text markers</h2><ul className="an-list">{a.markers.map((m) => <li key={m}>{MARKERS[m].label}</li>)}</ul><p className="tiny muted">These features can be checked directly in the text. They inform, but do not decide, a bias judgment.</p></section>}
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
                      <span className="sr-main"><strong>{s.name}</strong><span className="small muted">{s.publisher} · {fmtDate(s.date)}</span><span className="small">{s.use.usage}</span></span>
                      <span className="sr-badges"><TypeBadge type={s.type} /><UseBadge cls={s.use.cls} /></span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="next-step"><span className="small">Compare these sources with other outlets’ coverage.</span><Link to="sources" param={a.id} className="btn btn-ghost btn-sm">Open in Source Explorer</Link><button className="btn btn-primary btn-sm" onClick={() => setTab('evaluate')}>Evaluate the headline <Icon name="arrow" size={13} /></button></div>
            </div>
          )}

          {tab === 'facts' && (
            <div className="tab-pane fade-in">
              <h2 className="an-h">Facts and evidence</h2>
              <div className="callout small"><Icon name="info" size={15} /> <span><strong>No independent fact-check.</strong> The Media Lens has not checked these sample claims. Each claim shows what sourcing the article gives and what the cited record contains. Factual accuracy, framing and opinion are assessed separately.</span></div>
              <ul className="status-legend tiny">{Object.entries(CLAIM_STATUS).map(([k, s]) => <li key={k}><span className={`status status-${s.tone}`}>{s.label}</span> {s.help}</li>)}</ul>
              <div className="claims">{claims.map((c, i) => <ClaimCard key={c.id} claim={c} index={i} onSource={openSource} />)}</div>
            </div>
          )}

          {tab === 'evaluate' && <div className="tab-pane fade-in"><EvaluationPanel article={a} /></div>}
        </div>

        <aside className="article-side">
          <div className="side-box">
            <div className="kicker">Community assessment</div>
            <div className="side-mean">{meanLabel(agg.mean)}</div>
            <DistributionBar dist={agg.dist} highlight={evalFor(a.id)?.rating ?? null} />
            <button className="btn btn-primary btn-sm full" onClick={() => setTab('evaluate')}>{evalFor(a.id) ? 'See how you compare' : 'Evaluate this headline'}</button>
          </div>
          <div className="side-box">
            <div className="kicker">Same event, other outlets</div>
            <ul className="side-list">
              {siblings.map((s) => (
                <li key={s.id}><Link to="article" param={s.id}><span className="pubmark pubmark-xs">{publications[s.pub].short}</span><Headline text={s.headline} /></Link></li>
              ))}
            </ul>
            <Link to="compare" param={event.id} className="textlink small">Compare all side by side <Icon name="arrow" size={12} /></Link>
          </div>
        </aside>
      </div>
      <SourceDrawer sourceId={drawer?.sid} use={drawer?.use} onClose={() => setDrawer(null)} />
    </div>
  );
}
