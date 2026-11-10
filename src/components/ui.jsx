import { publications } from '../data/publications.js';
import { parseHeadline } from '../lib/text.js';
import { useStore } from '../state/store.jsx';

export function SampleTag({ children = 'Sample', title = 'Hypothetical sample content created for this prototype. Not real reporting.' }) {
  return <span className="sample-tag" title={title}>{children}</span>;
}

export function PubMark({ pub, size = 'md' }) {
  const p = publications[pub];
  return <span className={`pubmark pubmark-${size}`} aria-hidden="true">{p.short}</span>;
}

export function PubName({ pub, withMark = true }) {
  const p = publications[pub];
  return (
    <span className="pubname">
      {withMark && <PubMark pub={pub} size="sm" />}
      <span>{p.name}</span>
    </span>
  );
}

export function Headline({ text, highlight = false, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={className}>
      {parseHeadline(text).map((p, i) => (p.hl && highlight ? <mark key={i} className="hl">{p.text}</mark> : <span key={i}>{p.text}</span>))}
    </Tag>
  );
}

export function LabelBadge({ label }) {
  return <span className={`label-badge label-${label.toLowerCase()}`}>{label}</span>;
}

export function SectionHead({ kicker, title, children, action }) {
  return (
    <div className="section-head">
      <div>
        {kicker && <div className="kicker">{kicker}</div>}
        <h2 className="section-title">{title}</h2>
        {children && <p className="section-sub">{children}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}

export function Skeleton({ lines = 3, image = false }) {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Loading">
      {image && <div className="sk sk-img" />}
      <div className="sk sk-line w40" />
      {Array.from({ length: lines }).map((_, i) => <div key={i} className={`sk sk-line ${i === lines - 1 ? 'w60' : ''}`} />)}
    </div>
  );
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="empty">
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><circle cx="19" cy="19" r="12" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M28 28l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M14 19h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Tabs({ tabs, value, onChange, id = 'tabs' }) {
  return (
    <div className="tabs" role="tablist" aria-label={id}>
      {tabs.map((t) => (
        <button key={t.key} role="tab" id={`${id}-${t.key}`} aria-selected={value === t.key} className={`tab ${value === t.key ? 'active' : ''}`} onClick={() => onChange(t.key)}>
          {t.label}{t.count !== undefined && <span className="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.msg}</div>)}
    </div>
  );
}

export function Icon({ name, size = 16 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  switch (name) {
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
    case 'external': return <svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg>;
    case 'compare': return <svg {...p}><rect x="3" y="4" width="7" height="16" /><rect x="14" y="4" width="7" height="16" /></svg>;
    case 'arrow': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'back': return <svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case 'close': return <svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'menu': return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'check': return <svg {...p}><path d="M5 12l5 5 9-10" /></svg>;
    case 'doc': return <svg {...p}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>;
    case 'chat': return <svg {...p}><path d="M4 5h16v11H9l-5 4z" /></svg>;
    case 'lock': return <svg {...p}><rect x="5" y="11" width="14" height="9" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>;
    case 'info': return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>;
    default: return null;
  }
}
