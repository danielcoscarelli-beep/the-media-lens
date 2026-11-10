import { useMemo, useState } from 'react';
import { getSource } from '../data/sources.js';
import { getClaim, CLAIM_STATUS } from '../data/claims.js';
import { publications } from '../data/publications.js';
import { plainHeadline } from '../lib/text.js';

const W = 900, ROW = 54, NODE_H = 42, TOP = 36;
const wrap = (s, n) => {
  const words = s.split(' '); const lines = ['']; 
  for (const w of words) {
    if ((lines[lines.length - 1] + ' ' + w).trim().length > n) { if (lines.length === 2) { lines[1] = lines[1].replace(/\s*$/, '…'); break; } lines.push(w); }
    else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + w).trim();
  }
  return lines;
};
const curve = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2; return `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`; };
const typeGroup = (t) => (['document', 'govdata'].includes(t) ? 'primary' : t === 'anonymous' ? 'anon' : ['study', 'expert'].includes(t) ? 'analysis' : t === 'outlet' ? 'outlet' : 'statement');

function NodeBox({ x, y, w, lines, kind, active, dim, onClick, onEnter, onLeave, badge, title }) {
  return (
    <g className={`sm-node sm-${kind} ${active ? 'active' : ''} ${dim ? 'dim' : ''}`} transform={`translate(${x},${y})`}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} tabIndex={onClick ? 0 : -1} role={onClick ? 'button' : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}>
      <title>{title}</title>
      <rect width={w} height={NODE_H} className="sm-box" />
      <rect width="4" height={NODE_H} className="sm-stripe" />
      {lines.map((l, i) => <text key={i} x="12" y={lines.length === 1 ? 26 : 17 + i * 15} className="sm-text">{l}</text>)}
      {badge && <g transform={`translate(${w - 30},${NODE_H / 2 - 9})`}><rect width="24" height="18" className="sm-badge" /><text x="12" y="13" textAnchor="middle" className="sm-badge-t">{badge}</text></g>}
    </g>
  );
}

/** Article mode: article → claims → sources. */
export function ArticleSourceMap({ article, onSource, onClaim }) {
  const [hover, setHover] = useState(null);
  const claims = article.claims.map(getClaim).filter(Boolean);
  const used = article.sourceUses.map((u) => u.id);
  const claimSrc = new Set(claims.flatMap((c) => [c.source, ...c.corroboratedBy, ...(c.contradicts || [])].filter(Boolean)));
  const srcIds = [...new Set([...claims.flatMap((c) => [c.source, ...c.corroboratedBy, ...(c.contradicts || [])].filter(Boolean)), ...used])];
  const rows = Math.max(claims.length, srcIds.length, 1);
  const H = TOP + rows * ROW + 10;
  const cx = 300, cw = 270, sx = 640, sw = 250, ax = 10, aw = 220;
  const cy = (i) => TOP + i * ROW + (rows - claims.length) * ROW / 2;
  const sy = (i) => TOP + i * ROW + (rows - srcIds.length) * ROW / 2;
  const ay = TOP + (rows * ROW) / 2 - NODE_H;
  const sIdx = Object.fromEntries(srcIds.map((id, i) => [id, i]));
  const edges = [];
  claims.forEach((c, i) => {
    edges.push({ k: `a-${c.id}`, d: curve(ax + aw, ay + NODE_H, cx, cy(i) + NODE_H / 2), cls: 'e-claim', keys: [c.id] });
    if (c.source) edges.push({ k: `${c.id}-${c.source}`, d: curve(cx + cw, cy(i) + NODE_H / 2, sx, sy(sIdx[c.source]) + NODE_H / 2), cls: 'e-origin', keys: [c.id, c.source] });
    c.corroboratedBy.forEach((s) => edges.push({ k: `${c.id}-c-${s}`, d: curve(cx + cw, cy(i) + NODE_H / 2, sx, sy(sIdx[s]) + NODE_H / 2), cls: 'e-corrob', keys: [c.id, s] }));
    (c.contradicts || []).forEach((s) => edges.push({ k: `${c.id}-x-${s}`, d: curve(cx + cw, cy(i) + NODE_H / 2, sx, sy(sIdx[s]) + NODE_H / 2), cls: 'e-contra', keys: [c.id, s] }));
  });
  srcIds.filter((id) => !claimSrc.has(id)).forEach((id) => edges.push({ k: `a-s-${id}`, d: curve(ax + aw, ay + NODE_H, sx, sy(sIdx[id]) + NODE_H / 2), cls: 'e-direct', keys: [id] }));
  const lit = (keys) => !hover || keys.includes(hover);

  return (
    <div className="smap-scroll">
      <svg className="smap" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 760 }} role="img" aria-label="Source map: article, its claims and their underlying sources">
        <text x={ax} y="16" className="sm-col">Article</text>
        <text x={cx} y="16" className="sm-col">Claims made</text>
        <text x={sx} y="16" className="sm-col">Underlying sources</text>
        {edges.map((e) => <path key={e.k} d={e.d} className={`sm-edge ${e.cls} ${lit(e.keys) ? '' : 'faded'} ${hover && e.keys.includes(hover) ? 'lit' : ''}`} />)}
        <NodeBox x={ax} y={ay} w={aw} kind="article" lines={wrap(`${publications[article.pub].short}: ${plainHeadline(article.headline)}`, 30).slice(0, 2)} title={plainHeadline(article.headline)} />
        {claims.map((c, i) => (
          <NodeBox key={c.id} x={cx} y={cy(i)} w={cw} kind={`claim st-${CLAIM_STATUS[c.status].tone}`} lines={wrap(`C${i + 1} · ${c.text}`, 38)} title={`${c.text} — ${CLAIM_STATUS[c.status].label}`}
            active={hover === c.id} dim={hover && hover !== c.id && !edges.some((e) => e.keys.includes(hover) && e.keys.includes(c.id))}
            onClick={() => onClaim?.(c.id)} onEnter={() => setHover(c.id)} onLeave={() => setHover(null)} />
        ))}
        {srcIds.map((id, i) => {
          const s = getSource(id); const use = article.sourceUses.find((u) => u.id === id);
          return <NodeBox key={id} x={sx} y={sy(i)} w={sw} kind={`src g-${typeGroup(s.type)} ${use ? '' : 'not-cited'}`} lines={wrap(s.name, 34)} title={`${s.name} (${s.publisher})${use ? '' : ' — not cited by this article'}`}
            active={hover === id} dim={hover && hover !== id && !edges.some((e) => e.keys.includes(hover) && e.keys.includes(id))}
            onClick={() => onSource?.(id)} onEnter={() => setHover(id)} onLeave={() => setHover(null)} />;
        })}
      </svg>
      <ul className="sm-legend">
        <li><span className="lg-line e-origin" />Claim originates here</li>
        <li><span className="lg-line e-corrob" />Corroborating record</li>
        <li><span className="lg-line e-contra" />Contrary or limiting evidence</li>
        <li><span className="lg-line e-direct" />Cited for context</li>
        <li><span className="lg-box g-primary" />Document / data</li>
        <li><span className="lg-box g-statement" />Statement / interview</li>
        <li><span className="lg-box g-analysis" />Study / expert</li>
        <li><span className="lg-box g-anon" />Anonymous</li>
      </ul>
    </div>
  );
}

/** Event mode: every outlet → the sources it relies on. Highlights shared dependence. */
export function EventSourceMap({ articles, onSource, onArticle }) {
  const [hover, setHover] = useState(null);
  const { srcIds, users } = useMemo(() => {
    const users = {};
    articles.forEach((a) => a.sourceUses.forEach((u) => { (users[u.id] ||= []).push({ a: a.id, cls: u.cls }); }));
    const srcIds = Object.keys(users).sort((x, y) => users[y].length - users[x].length);
    return { srcIds, users };
  }, [articles]);
  const rows = Math.max(srcIds.length, articles.length);
  const H = TOP + rows * ROW + 10;
  const ax = 10, aw = 240, sx = 560, sw = 320;
  const ay = (i) => TOP + i * ROW + (rows - articles.length) * ROW / 2;
  const sy = (i) => TOP + i * ROW + (rows - srcIds.length) * ROW / 2;
  const shared = (id) => users[id].length >= 3;
  const isLit = (aId, sId) => !hover || hover === aId || hover === sId;

  return (
    <div className="smap-scroll">
      <svg className="smap" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 760 }} role="img" aria-label="Which sources each outlet relies on">
        <text x={ax} y="16" className="sm-col">Outlet coverage</text>
        <text x={sx} y="16" className="sm-col">Sources relied on (number of outlets)</text>
        {articles.map((a, i) => a.sourceUses.map((u) => {
          const j = srcIds.indexOf(u.id);
          const lit = isLit(a.id, u.id);
          return <path key={a.id + u.id} d={curve(ax + aw, ay(i) + NODE_H / 2, sx, sy(j) + NODE_H / 2)}
            className={`sm-edge ${shared(u.id) ? 'e-shared' : 'e-direct'} ${u.cls === 'unverified' ? 'e-unverified' : ''} ${u.cls === 'anonymous' ? 'e-anon' : ''} ${lit ? (hover ? 'lit' : '') : 'faded'}`} />;
        }))}
        {articles.map((a, i) => (
          <NodeBox key={a.id} x={ax} y={ay(i)} w={aw} kind="article" lines={[publications[a.pub].name, `${a.sourceUses.length} sources cited`]} title={plainHeadline(a.headline)}
            active={hover === a.id} dim={hover && hover !== a.id && !(users[hover] || []).some((x) => x.a === a.id)}
            onClick={() => onArticle?.(a.id)} onEnter={() => setHover(a.id)} onLeave={() => setHover(null)} />
        ))}
        {srcIds.map((id, i) => {
          const s = getSource(id);
          return <NodeBox key={id} x={sx} y={sy(i)} w={sw} kind={`src g-${typeGroup(s.type)} ${shared(id) ? 'shared' : ''}`} lines={wrap(s.name, 40)} badge={String(users[id].length)} title={`${s.name}: relied on by ${users[id].length} outlets`}
            active={hover === id} dim={hover && hover !== id && !users[id].some((x) => x.a === hover)}
            onClick={() => onSource?.(id)} onEnter={() => setHover(id)} onLeave={() => setHover(null)} />;
        })}
      </svg>
      <ul className="sm-legend">
        <li><span className="lg-line e-shared" />Source shared by 3+ outlets</li>
        <li><span className="lg-line e-unverified" />Used as fact without attribution</li>
        <li><span className="lg-line e-anon" />Anonymous source</li>
        <li className="muted">Hover an outlet or source to trace its connections. Click to open it.</li>
      </ul>
    </div>
  );
}
