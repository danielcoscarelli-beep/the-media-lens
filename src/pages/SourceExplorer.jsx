import { useEffect, useMemo, useState } from 'react';
import { events, getEvent } from '../data/events.js';
import { getArticle, articlesForEvent } from '../data/articles.js';
import { publications } from '../data/publications.js';
import { getSource, SOURCE_TYPES } from '../data/sources.js';
import { getClaim } from '../data/claims.js';
import { fmtDate, fmtDateTime } from '../lib/format.js';
import { shiftedSourceDate, eventPublishedAt, isPublished } from '../lib/schedule.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { ArticleSourceMap, EventSourceMap } from '../components/SourceMap.jsx';
import { SourceDrawer, TypeBadge, UseBadge, USE_CLASS } from '../components/SourceParts.jsx';
import { EmptyState, Headline, Icon, SampleTag, SectionHead } from '../components/ui.jsx';

export default function SourceExplorer() {
  const { param, navigate } = useRouter();
  const { markJourney, vis, now } = useStore();
  // A sealed article can't be focused: its sources would reveal it. Fall back to its event.
  const paramArticle = getArticle(param);
  const fromArticle = paramArticle && vis(paramArticle).revealed ? paramArticle : null;
  const eventId = paramArticle ? paramArticle.eventId : getEvent(param) ? param : 'permitting-act';
  const event = getEvent(eventId);
  const published = articlesForEvent(eventId).filter((a) => isPublished(a.id, now));
  const list = published.filter((a) => vis(a).revealed);
  const hiddenCount = published.length - list.length;
  const [focus, setFocus] = useState(fromArticle ? fromArticle.id : 'all');
  const [drawer, setDrawer] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  useEffect(() => { setFocus(fromArticle ? fromArticle.id : 'all'); }, [param]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (list.length) markJourney('sources'); }, [list.length, markJourney]);

  const article = focus === 'all' ? null : getArticle(focus);
  const usage = useMemo(() => {
    const m = {};
    list.forEach((a) => a.sourceUses.forEach((u) => { (m[u.id] ||= []).push({ a, u }); }));
    return m;
  }, [list]);

  // Convergence: claims repeated by 2+ outlets, traced to their origin.
  const convergence = useMemo(() => {
    const m = {};
    list.forEach((a) => a.claims.forEach((c) => { (m[c] ||= []).push(a); }));
    return Object.entries(m).filter(([, as]) => as.length >= 2).map(([cid, as]) => ({ claim: getClaim(cid), outlets: as })).sort((x, y) => y.outlets.length - x.outlets.length);
  }, [list]);

  const sourceRows = Object.entries(usage).map(([id, uses]) => ({ s: getSource(id), uses }))
    .filter(({ s, uses }) => (!typeFilter || s.type === typeFilter) && (!article || uses.some((x) => x.a.id === article.id)))
    .sort((x, y) => y.uses.length - x.uses.length);

  return (
    <div className="page sources-page">
      <header className="page-head">
        <div className="kicker">Source Explorer</div>
        <h1 className="page-title">Where the information comes from</h1>
        <p className="page-sub">Trace each article’s claims back to the documents, data, people and other reports behind them. See when several outlets rely on one original source instead of confirming a claim independently.</p>
        <div className="picker">
          <label className="select-wrap"><span className="small muted">Event</span>
            <select id="se-event" value={eventId} onChange={(e) => navigate('sources', e.target.value)}>
              {events.filter((e) => articlesForEvent(e.id).some((a) => isPublished(a.id, now))).map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </label>
          <div className="seg seg-wrap" role="group" aria-label="Focus">
            <button className={focus === 'all' ? 'on' : ''} onClick={() => setFocus('all')}>All coverage</button>
            {list.map((a) => <button key={a.id} className={focus === a.id ? 'on' : ''} onClick={() => setFocus(a.id)}>{publications[a.pub].short}</button>)}
          </div>
        </div>
        {hiddenCount > 0 && <p className="small sealed-note"><Icon name="lock" size={12} /> {hiddenCount} article{hiddenCount === 1 ? '' : 's'} in this event {hiddenCount === 1 ? 'is' : 'are'} left out until you rate {hiddenCount === 1 ? 'it' : 'them'} or {hiddenCount === 1 ? 'its window closes' : 'their windows close'}. Showing their sources would reveal who wrote them.</p>}
      </header>

      <section className="block">
        <SectionHead kicker="Source map" title={article ? <>{publications[article.pub].name}: claims and sources</> : 'Which sources each outlet relies on'} action={<SampleTag />}>
          {article ? <><Headline text={article.headline} /> · Select a claim to see its evidence, or a source to see its details.</> : 'Thicker accent lines mark sources that three or more outlets share. Shared reliance is common and often legitimate, but it means repetition is not independent confirmation.'}
        </SectionHead>
        {!list.length ? (
          <EmptyState title="No revealed coverage yet" action={<Link to="compare" param={eventId} className="btn btn-primary btn-sm">Rate this event’s articles</Link>}>Sources appear here once you’ve rated an article from this event, or once its rating window closes.</EmptyState>
        ) : article
          ? <ArticleSourceMap article={article} onSource={(sid) => setDrawer({ sid, use: article.sourceUses.find((u) => u.id === sid) })} onClaim={() => navigate('article', article.id)} />
          : <EventSourceMap articles={list} onSource={(sid) => setDrawer({ sid })} onArticle={(id) => setFocus(id)} />}
      </section>

      {!article && convergence.length > 0 && (
        <section className="block">
          <SectionHead kicker="Independent verification check" title="Claims repeated across outlets" >Does repetition reflect independent confirmation, or one source passed along?</SectionHead>
          <div className="table-wrap"><table className="dtable">
            <thead><tr><th>Claim</th><th>Reported by</th><th>Traces to</th><th>Independent confirmation</th></tr></thead>
            <tbody>{convergence.map(({ claim, outlets }) => {
              const src = claim.source ? getSource(claim.source) : null;
              const single = !claim.corroboratedBy.length;
              return (
                <tr key={claim.id}>
                  <td>{claim.text}</td>
                  <td><span className="outlet-stack">{outlets.map((a) => <span key={a.id} className="pubmark pubmark-xs" title={publications[a.pub].name}>{publications[a.pub].short}</span>)}</span></td>
                  <td>{src ? <button className="linkish" onClick={() => setDrawer({ sid: src.id })}>{src.publisher}</button> : <span className="muted">No source</span>}{src && <div className="tiny muted">{SOURCE_TYPES[src.type]}</div>}</td>
                  <td>{single
                    ? <span className={`verify ${outlets.length >= 3 ? 'verify-warn' : ''}`}>{outlets.length >= 3 ? `${outlets.length} outlets, 1 origin` : 'Single origin'}</span>
                    : <span className="verify verify-ok">Separate record: {claim.corroboratedBy.map((id) => getSource(id).publisher).join(', ')}</span>}</td>
                </tr>
              );
            })}</tbody>
          </table></div>
        </section>
      )}

      <section className="block">
        <SectionHead kicker="Source index" title={article ? 'Sources cited in this article' : 'All sources in this event’s coverage'}
          action={<label className="select-wrap"><span className="sr-only">Source type</span><select id="se-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="">All source types</option>{Object.entries(SOURCE_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>} />
        <div className="class-legend">{Object.entries(USE_CLASS).map(([k, v]) => <div key={k}><UseBadge cls={k} /><span className="tiny muted">{v.help}</span></div>)}</div>
        <ul className="source-list">
          {sourceRows.map(({ s, uses }) => {
            const mine = article ? uses.find((x) => x.a.id === article.id) : null;
            return (
              <li key={s.id}>
                <button className="source-row" onClick={() => setDrawer({ sid: s.id, use: mine?.u })}>
                  <span className="sr-main"><strong>{s.name}</strong><span className="small muted">{s.publisher} · {fmtDate(shiftedSourceDate(s.id, s.date))}</span>
                    {mine ? <span className="small">{mine.u.usage}</span> : <span className="small">{s.description}</span>}</span>
                  <span className="sr-badges">
                    <TypeBadge type={s.type} />
                    {mine ? <UseBadge cls={mine.u.cls} /> : <span className="outlet-stack">{uses.map(({ a }) => <span key={a.id} className="pubmark pubmark-xs" title={publications[a.pub].name}>{publications[a.pub].short}</span>)}</span>}
                  </span>
                </button>
              </li>
            );
          })}
          {!sourceRows.length && <li className="small muted">No sources of this type.</li>}
        </ul>
        <p className="tiny muted">A prestigious institution can still be wrong on a particular claim, and an obscure source can be right. Judge each source by what it shows and how the article uses it. {event && <>Event published {fmtDateTime(eventPublishedAt(event.id))}.</>} <Link to="compare" param={eventId}>Back to coverage comparison <Icon name="arrow" size={11} /></Link></p>
      </section>
      <SourceDrawer sourceId={drawer?.sid} use={drawer?.use} onClose={() => setDrawer(null)} />
    </div>
  );
}
