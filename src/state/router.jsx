// Minimal hash router. Routes are encoded as `#page` or `#page-param` (letters,
// digits and hyphens only) so links stay shareable in restrictive embeds.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const PAGES = ['home', 'explore', 'compare', 'article', 'ratings', 'sources', 'profile', 'methods'];

function parse() {
  const h = decodeURIComponent((window.location.hash || '').replace(/^#\/?/, ''));
  const i = h.indexOf('-');
  const page = i === -1 ? h : h.slice(0, i);
  const param = i === -1 ? '' : h.slice(i + 1);
  return PAGES.includes(page) ? { page, param } : { page: 'home', param: '' };
}

const Ctx = createContext(null);

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const navigate = useCallback((page, param = '') => {
    const next = page === 'home' && !param ? '#home' : `#${page}${param ? `-${param}` : ''}`;
    if (window.location.hash === next) { window.scrollTo({ top: 0 }); return; }
    window.location.hash = next;
  }, []);
  return <Ctx.Provider value={{ ...route, navigate }}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

/** Anchor that routes internally. */
export function Link({ to, param, children, className, ...rest }) {
  const { navigate } = useRouter();
  const href = `#${to}${param ? `-${param}` : ''}`;
  return (
    <a href={href} className={className} onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); navigate(to, param); }} {...rest}>
      {children}
    </a>
  );
}
