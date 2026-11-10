import { useEffect, useState } from 'react';
import { Link, useRouter } from '../state/router.jsx';
import { useStore } from '../state/store.jsx';
import { slugify } from '../lib/text.js';
import { Icon } from './ui.jsx';

const NAV = [
  { page: 'home', label: 'Home' },
  { page: 'explore', label: 'Explore News' },
  { page: 'compare', label: 'Compare Coverage' },
  { page: 'ratings', label: 'Bias Ratings' },
  { page: 'sources', label: 'Source Explorer' },
  { page: 'profile', label: 'My Profile' },
];

export function SearchBox({ initial = '', size = 'md', autoFocus = false, onSubmitted }) {
  const { navigate } = useRouter();
  const { markJourney } = useStore();
  const [q, setQ] = useState(initial);
  useEffect(() => setQ(initial), [initial]);
  return (
    <form className={`searchbox searchbox-${size}`} role="search" onSubmit={(e) => {
      e.preventDefault();
      if (q.trim()) markJourney('searched');
      navigate('explore', slugify(q));
      onSubmitted?.();
    }}>
      <Icon name="search" size={size === 'lg' ? 20 : 16} />
      <input id={`search-${size}`} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={autoFocus}
        placeholder="Search events, people, organizations…" aria-label="Search news topics, events, people and organizations" />
      {size === 'lg' && <button type="submit" className="btn btn-primary">Search</button>}
    </form>
  );
}

export function NavBar() {
  const { page } = useRouter();
  const { alignment, user } = useStore();
  const ranked = alignment.status !== 'unranked';
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [page]);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="home" className="brand" aria-label="The Media Lens, home">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="13" cy="13" r="5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" /><path d="M1.5 13h6M18.5 13h6" stroke="currentColor" strokeWidth="1.5" /></svg>
          <span className="brand-word"><span className="brand-the">The</span> Media Lens</span>
        </Link>
        <div className="topbar-search"><SearchBox /></div>
        <Link to="profile" className="userchip" title={ranked ? `Crowd Alignment percentile: ${Math.round(alignment.percentile)}` : 'Unranked: rate articles and wait for them to close'}>
          <span className="userchip-score tabular">{ranked ? Math.round(alignment.percentile) : '—'}</span>
          <span className="userchip-name">{user.username}<small>{ranked ? `${alignment.tier.name}${alignment.status === 'provisional' ? ' (provisional)' : ''}` : 'Unranked'}</small></span>
        </Link>
        <button className="icon-btn menu-btn" aria-expanded={open} aria-controls="mainnav" aria-label="Menu" onClick={() => setOpen((o) => !o)}><Icon name={open ? 'close' : 'menu'} size={20} /></button>
      </div>
      <nav id="mainnav" className={`mainnav ${open ? 'open' : ''}`} aria-label="Main">
        <div className="mainnav-inner">
          <div className="mobile-search"><SearchBox onSubmitted={() => setOpen(false)} /></div>
          {NAV.map((n) => <Link key={n.page} to={n.page} className={`navlink ${page === n.page || (page === 'article' && n.page === 'compare') ? 'active' : ''}`} aria-current={page === n.page ? 'page' : undefined}>{n.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}

export function SampleBanner() {
  const [hide, setHide] = useState(() => { try { return sessionStorage.getItem('ml-banner') === '1'; } catch { return false; } });
  if (hide) return null;
  return (
    <div className="sample-banner" role="note">
      <div className="sample-banner-inner">
        <Icon name="info" size={15} />
        <p><strong>Prototype with sample content.</strong> All headlines, articles and sources are hypothetical, and other participants and their ratings are simulated. Nothing here is real reporting by the publications named, and nothing has been independently fact-checked. <Link to="methods">How this works</Link></p>
        <button className="icon-btn" aria-label="Dismiss notice" onClick={() => { setHide(true); try { sessionStorage.setItem('ml-banner', '1'); } catch { /* ignore */ } }}><Icon name="close" size={14} /></button>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand-word footer-brand"><span className="brand-the">The</span> Media Lens</div>
          <p className="small muted">A media literacy platform for comparing how news organizations cover the same events. This prototype uses local sample data only.</p>
        </div>
        <div className="footer-cols">
          <div><h4>Read</h4><Link to="explore">Explore News</Link><Link to="compare">Compare Coverage</Link><Link to="sources">Source Explorer</Link></div>
          <div><h4>Participate</h4><Link to="ratings">Bias Ratings</Link><Link to="profile">My Profile</Link><Link to="methods">Methods &amp; limitations</Link></div>
        </div>
      </div>
      <div className="footer-base small muted">Community scores are averages of readers’ perceptions of individual articles. They are not fact-checks, and The Media Lens does not rate publications as a whole.</div>
    </footer>
  );
}
