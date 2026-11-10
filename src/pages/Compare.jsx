// Compare Coverage. Blind-rating rules: a sealed article appears as "Publication hidden"
// with only its headline and summary. The comparison panel — whose hand-written summaries
// name outlets — unlocks only when every article in the event is published and revealed.
import { useEffect, useMemo, useState } from 'react';
import { getEventBundle, listEvents } from '../services/api.js';
import { useAsync } from '../lib/useAsync.js';
import { publications } from '../data/publications.js';
import { getClaim, CLAIM_STATUS } from '../data/claims.js';
import { getSource } from '../data/sources.js';
import { communityAt } from '../services/community.js';
import { windowFor, eventPublishedAt } from '../lib/schedule.js';
import { fmtDateTime, num } from '../lib/format.js';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { DistributionBar, ScoreBadge } from '../components/Rating.jsx';
import { SealedPub, StatusBadge } from '../components/Status.jsx';
import { SourceDrawer, UseBadge } from '../components/SourceParts.jsx';
import { EmptyState, Headline, Icon, LabelBadge, SampleTag, SectionHead, Skeleton, Tabs } from '../components/ui.jsx';
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
        <p className="page-sub">See several publications’ reports on the same event side by side, with a structured comparison of framing, language, emphasis, perspectives, omissions and labeling. Articles you haven’t rated yet stay anonymous.</p>
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
                  <div className="kicker">{e.topic}{e.featured && <span className="feat-tag">Full demonstration</span>}</div>
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

const DIMENSIONS = [
  { key: 'headline', label: 'Headline framing' },
  { key: 'language', label: 'Charged language' },
  { key: 'facts', label: 'Facts emphasized' },
  { key: 'perspectives', label: 'Perspectives' },
  { key: 'omissions', label: 'Omissions' },
  { key: 'opinion', label: 'Reporting vs. opinion' },
];

function CompareEvent({ id }) {
  const { now, vis, markJourney, boundaryKey } = useStore();
  const { data, loading } = useAsync(() => getEventBundle(id, { now }), [id, boundaryKey]);
  const [dim, setDim] = useState('headline');
  const [drawer, setDrawer] = useState(null);
  const articles = useMemo(() => (data ? stableOrder(data.articles) : []), [data]);
  const vs = articles.map((a) => vis(a));
  const sealedCount = vs.filter((v) => v.sealed).length;
  const unlocked = !!data && !sealedCount && data.articles.length === data.allCount;
  useEffect(() => { if (unlocked) markJourney('compared'); }, [unlocked, markJourney]);

  if (loading && !data) return <div className="page"><Skeleton lines={2} /><div className="cols-skel"><Skeleton image lines={6} /><Skeleton image lines={6} /><Skeleton image lines={6} /></div></div>;
  if (!data) return <div className="page"><EmptyState title="Event not found" action={<Link to="compare" className="btn btn-ghost btn-sm">All events</Link>}>This event isn’t in the sample library, or none of its articles are published yet.</EmptyState></div>;
  const { event } = data;
  const revealed = articles.filter((_, i) => !vs[i].sealed);

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
          <Link to="sources" param={event.id} className="textlink">View the source map <Icon name="arrow" size={13} /></Link>
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
                <Link to="article" param={a.id} className="lineup-hl"><Headline text={a.headline} highlight={unlocked} /></Link>
                {v.sealed ? <Link to="article" param={a.id} className="btn btn-primary btn-sm">Rate blind</Link> : <ScoreBadge score={c.mean} n={c.n} final={v.status === 'closed'} />}
              </li>
            );
          })}
        </ol>
        <p className="tiny muted">Scores are averages of readers’ ratings of each specific article, out of 100: community perception, not a fact-check. {unlocked ? 'Highlighted words are discussed in the comparison panel.' : ''}</p>
      </section>

      <section className="block">
        <SectionHead kicker="Side by side" title="How each publication reported it">Scroll horizontally to see all {articles.length} reports.{sealedCount ? ' Anonymous columns reveal their outlet, sources and analysis once you rate them.' : ''}</SectionHead>
        <div className="columns-scroll">
          <div className="columns" style={{ gridTemplateColumns: `repeat(${articles.length}, minmax(270px, 1fr))` }}>
            {articles.map((a, i) => (vs[i].sealed
              ? <SealedColumn key={a.id} a={a} v={vs[i]} />
              : <CoverageColumn key={a.id} a={a} v={vs[i]} onSource={(sid) => setDrawer({ sid, use: a.sourceUses.find((u) => u.id === sid) })} />))}
          </div>
        </div>
      </section>

      <section className="block comp-panel">
        <SectionHead kicker="Comparison panel" title="Where the coverage differs">These observations describe the text of each article. They are not ratings of the publications.</SectionHead>
        {unlocked ? (
          <>
            <Tabs id="dimensions" tabs={DIMENSIONS} value={dim} onChange={setDim} />
            <div className="dim-body fade-in" key={dim}>
              <p className="dim-summary">{event.comparison[dim]}</p>
              <DimensionDetail dim={dim} articles={revealed} />
            </div>
          </>
        ) : (
          <div className="locked-analysis">
            <Icon name="lock" size={16} />
            <div>
              <strong>The comparison unlocks when every article in this event is revealed to you</strong>
              <p className="small muted">{sealedCount ? `Rate the ${sealedCount} anonymous article${sealedCount === 1 ? '' : 's'} above, or wait for their rating windows to close.` : 'Some coverage of this event hasn’t been published yet.'} The comparison names each outlet, so showing it earlier would reveal who wrote the articles you haven’t rated.</p>
            </div>
          </div>
        )}
      </section>
      <SourceDrawer sourceId={drawer?.sid} use={drawer?.use} onClose={() => setDrawer(null)} />
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
      <div className="ccol-locked"><Icon name="lock" size={14} /> Outlet, sources, framing notes and community score are hidden until you rate this article.</div>
      <div className="ccol-foot"><Link to="article" param={a.id} className="btn btn-primary btn-sm">Read and rate blind</Link></div>
    </article>
  );
}

function CoverageColumn({ a, v, onSource }) {
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
      <h3 className="ccol-hl"><Link to="article" param={a.id}><Headline text={a.headline} highlight /></Link></h3>
      <p className="ccol-dek">{a.dek}</p>
      <div className="ccol-sec"><h4>Central emphasis</h4><ul>{a.emphasis.map((e) => <li key={e}>{e}</li>)}</ul></div>
      <div className="ccol-sec"><h4>Language &amp; framing</h4><p>{a.framing}</p>
        {a.charged.length > 0 && <div className="term-row">{a.charged.map((t) => <span key={t.term} className={`term ${t.attributed ? 'attr' : ''}`} title={t.note}>{t.term}{t.attributed && <small>quoted</small>}</span>)}</div>}
      </div>
      <div className="ccol-sec"><h4>Cited sources ({a.sourceUses.length})</h4>
        <ul className="ccol-sources">{a.sourceUses.map((u) => <li key={u.id}><button className="linkish" onClick={() => onSource(u.id)}>{getSource(u.id).publisher}</button> <UseBadge cls={u.cls} /></li>)}</ul>
      </div>
      <div className="ccol-sec"><h4>Community score</h4>
        <div className="ccol-assess"><ScoreBadge score={c.mean} final={v.status === 'closed'} /><span className="tiny muted">{num(c.n)} ratings · {v.status === 'closed' ? 'final' : 'live'}</span></div>
        {c.n > 0 && <DistributionBar dist={c.dist} compact highlightPoints={v.rating?.points ?? null} />}
      </div>
      <div className="ccol-foot">
        <Link to="article" param={a.id} className="btn btn-primary btn-sm">Detailed analysis</Link>
        <a href={p.homepage} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" title="Sample article: links to the publication’s homepage">Original <Icon name="external" size={12} /></a>
      </div>
    </article>
  );
}

function DimensionDetail({ dim, articles }) {
  const pubCell = (a) => <th scope="row"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span> <Link to="article" param={a.id}>{publications[a.pub].name}</Link></th>;
  const claimIds = useMemo(() => [...new Set(articles.flatMap((a) => a.claims))], [articles]);

  if (dim === 'headline') return (
    <div className="table-wrap"><table className="dtable"><thead><tr><th>Publication</th><th>Headline</th><th>How it frames the event</th></tr></thead>
      <tbody>{articles.map((a) => <tr key={a.id}>{pubCell(a)}<td className="serif"><Headline text={a.headline} highlight /></td><td>{a.framing}</td></tr>)}</tbody></table></div>
  );
  if (dim === 'language') return (
    <div className="table-wrap"><table className="dtable"><thead><tr><th>Publication</th><th>Flagged wording</th><th>Language intensity</th></tr></thead>
      <tbody>{articles.map((a) => (
        <tr key={a.id}>{pubCell(a)}
          <td>{a.charged.length ? a.charged.map((c) => <div key={c.term} className="term-note"><span className={`term ${c.attributed ? 'attr' : ''}`}>{c.term}{c.attributed && <small>quoted</small>}</span> {c.note}</div>) : <span className="muted">No flagged terms</span>}</td>
          <td className="intensity-cell"><div className="intensity"><span style={{ width: `${a.intensity * 100}%` }} /></div><span className="tiny muted tabular">{a.intensity.toFixed(2)}</span></td>
        </tr>))}</tbody></table>
      <p className="tiny muted">The language intensity index counts terms from a published word list in the headline and first paragraph. It is a rough, transparent measure, not a verdict. “Quoted” marks wording attributed to a speaker.</p></div>
  );
  if (dim === 'facts') return (
    <div className="table-wrap"><table className="dtable matrix"><thead><tr><th>Claim</th>{articles.map((a) => <th key={a.id} className="c">{publications[a.pub].short}</th>)}</tr></thead>
      <tbody>{claimIds.map((cid) => { const c = getClaim(cid); return (
        <tr key={cid}><td><span className={`dot-status status-${CLAIM_STATUS[c.status].tone}`} title={CLAIM_STATUS[c.status].label} /> {c.text}</td>
          {articles.map((a) => <td key={a.id} className="c">{a.claims.includes(cid) ? <span className="mx-yes" aria-label="Included">●</span> : <span className="mx-no" aria-label="Not included">·</span>}</td>)}</tr>); })}</tbody></table>
      <p className="tiny muted">● = the article makes or reports this claim. The dot beside each claim shows its sourcing status (see Facts &amp; evidence on any article).</p></div>
  );
  if (dim === 'perspectives') return (
    <div className="persp">
      {articles.map((a) => {
        const p = a.perspectives; const tot = p.supporters + p.opponents + p.independent + p.affected || 1;
        return (
          <div key={a.id} className="persp-row">
            <span className="persp-pub"><span className="pubmark pubmark-xs">{publications[a.pub].short}</span> {publications[a.pub].name}</span>
            <div className="persp-bar" role="img" aria-label={`Supporters ${p.supporters}, opponents ${p.opponents}, independent ${p.independent}, affected communities ${p.affected}`}>
              {[['supporters', 'p-sup'], ['opponents', 'p-opp'], ['independent', 'p-ind'], ['affected', 'p-aff']].map(([k, c]) => p[k] > 0 && <span key={k} className={c} style={{ width: `${(p[k] / tot) * 100}%` }}>{p[k]}</span>)}
            </div>
          </div>
        );
      })}
      <ul className="persp-legend small"><li><span className="p-sup" />Bill supporters</li><li><span className="p-opp" />Opponents</li><li><span className="p-ind" />Independent experts / data</li><li><span className="p-aff" />Affected communities</li></ul>
      <p className="tiny muted">Counts of distinct quoted or paraphrased voices in each article.</p>
    </div>
  );
  if (dim === 'omissions') return (
    <div className="table-wrap"><table className="dtable"><thead><tr><th>Publication</th><th>Receives less attention or is omitted</th><th>Claims others report that this article does not</th></tr></thead>
      <tbody>{articles.map((a) => {
        const missing = claimIds.filter((c) => !a.claims.includes(c) && articles.filter((x) => x.claims.includes(c)).length >= 2);
        return <tr key={a.id}>{pubCell(a)}<td><ul className="plain">{a.omissions.length ? a.omissions.map((o) => <li key={o}>{o}</li>) : <li className="muted">None noted</li>}</ul></td>
          <td><ul className="plain">{missing.length ? missing.map((c) => <li key={c} className="small">{getClaim(c).text}</li>) : <li className="muted small">None</li>}</ul></td></tr>;
      })}</tbody></table>
      <p className="tiny muted">Leaving something out is not automatically bias, since every story has limited space. The question is whether an omission changes what a reader would conclude.</p></div>
  );
  return (
    <div className="table-wrap"><table className="dtable"><thead><tr><th>Publication</th><th>Label</th><th>Observation</th></tr></thead>
      <tbody>{articles.map((a) => <tr key={a.id}>{pubCell(a)}<td><LabelBadge label={a.label} /></td><td>{a.opinionNote}</td></tr>)}</tbody></table>
      <p className="tiny muted">An article labeled analysis or opinion tells readers it includes interpretation. Evaluative language in an unlabeled news report deserves closer attention.</p></div>
  );
}
