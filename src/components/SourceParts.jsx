import { useEffect } from 'react';
import { SOURCE_TYPES, getSource } from '../data/sources.js';
import { CLAIM_KIND, CLAIM_STATUS } from '../data/claims.js';
import { articles } from '../data/articles.js';
import { publications } from '../data/publications.js';
import { fmtDate } from '../lib/format.js';
import { Link } from '../state/router.jsx';
import { Icon } from './ui.jsx';

export const USE_CLASS = {
  primary: { label: 'Primary source', help: 'The original document, data, or a first-hand statement.' },
  secondary: { label: 'Secondary source', help: 'Another party’s account or analysis of the original.' },
  anonymous: { label: 'Anonymous source', help: 'Not named. Readers can’t judge the source’s position or motives.' },
  expert: { label: 'Expert commentary', help: 'Interpretation from a named specialist. Expertise is not proof.' },
  unverified: { label: 'Unverified / unsupported', help: 'Used as fact without attribution or support in the article.' },
};

export function UseBadge({ cls }) {
  return <span className={`use-badge use-${cls}`} title={USE_CLASS[cls].help}>{USE_CLASS[cls].label}</span>;
}

export function TypeBadge({ type }) {
  return <span className="type-badge">{SOURCE_TYPES[type]}</span>;
}

/** Which sample articles cite a given source. */
export const citingArticles = (sourceId) => articles.filter((a) => a.sourceUses.some((u) => u.id === sourceId));

export function SourceDrawer({ sourceId, use, onClose }) {
  const s = sourceId ? getSource(sourceId) : null;
  useEffect(() => {
    if (!s) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [s, onClose]);
  if (!s) return null;
  const citing = citingArticles(s.id);
  return (
    <div className="drawer-wrap" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={s.name} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn drawer-close" onClick={onClose} aria-label="Close source details"><Icon name="close" /></button>
        <div className="kicker">Source detail</div>
        <h3 className="drawer-title">{s.name}</h3>
        <dl className="kv">
          <dt>Publisher / institution</dt><dd>{s.publisher}</dd>
          <dt>Date</dt><dd>{fmtDate(s.date)}</dd>
          <dt>Source type</dt><dd><TypeBadge type={s.type} /></dd>
          {use && <><dt>How this article uses it</dt><dd><UseBadge cls={use.cls} /><p className="drawer-use">{use.usage}</p></dd></>}
        </dl>
        <p className="drawer-desc">{s.description}</p>
        {s.type === 'anonymous' && <p className="callout callout-warn small">Anonymous sources can be legitimate, but readers can’t assess their position or motives. When several outlets cite an unnamed official, that doesn’t mean they confirmed the claim independently.</p>}
        {s.type === 'study' && <p className="callout small">Check who funded the study and whether it was peer reviewed. An institution’s reputation doesn’t prove any single finding.</p>}
        <h4 className="mini-h">Cited by {citing.length} sample article{citing.length === 1 ? '' : 's'}</h4>
        <ul className="drawer-cites">
          {citing.map((a) => {
            const u = a.sourceUses.find((x) => x.id === s.id);
            return <li key={a.id}><span className="pubmark pubmark-xs">{publications[a.pub].short}</span><Link to="article" param={a.id} onClick={onClose}>{publications[a.pub].name}</Link><UseBadge cls={u.cls} /></li>;
          })}
        </ul>
        <div className="drawer-foot">
          {s.url
            ? <a className="btn btn-ghost btn-sm" href={s.url} target="_blank" rel="noreferrer">Institution website <Icon name="external" size={12} /></a>
            : <span className="small muted">No public link for this source.</span>}
          <p className="tiny muted">Sample source: this document is hypothetical. Links go to the institution’s real homepage only.</p>
        </div>
      </aside>
    </div>
  );
}

export function ClaimCard({ claim, onSource, index }) {
  const st = CLAIM_STATUS[claim.status];
  const src = claim.source ? getSource(claim.source) : null;
  return (
    <article className={`claim claim-${st.tone}`}>
      <header className="claim-head">
        <span className="claim-n tabular">C{index + 1}</span>
        <span className="claim-kind">{CLAIM_KIND[claim.kind]}</span>
        <span className={`status status-${st.tone}`} title={st.help}>{st.label}</span>
      </header>
      <p className="claim-text">“{claim.text}”</p>
      <dl className="claim-grid">
        <dt>Evidence offered</dt><dd>{claim.evidence}</dd>
        <dt>Original source</dt>
        <dd>{src ? <button className="linkish" onClick={() => onSource?.(src.id)}>{src.name}</button> : <span className="muted">None given</span>}<span className="muted small"> {src ? `· ${src.publisher}` : ''}</span></dd>
        <dt>Independent corroboration</dt>
        <dd>
          {claim.corroboratedBy.length
            ? claim.corroboratedBy.map((id) => <button key={id} className="linkish" onClick={() => onSource?.(id)}>{getSource(id).name}</button>).reduce((a, b) => [a, ', ', b])
            : <span>None in the sample record. Repeating a claim across outlets is not corroboration.</span>}
        </dd>
        <dt>Limitations / contrary evidence</dt><dd>{claim.limitations}</dd>
      </dl>
    </article>
  );
}
