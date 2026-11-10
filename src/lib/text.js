// Headlines may contain [[highlighted]] spans marking wording the analysis discusses.
export function parseHeadline(h) {
  const parts = [];
  const re = /\[\[(.+?)\]\]/g;
  let last = 0, m;
  while ((m = re.exec(h))) {
    if (m.index > last) parts.push({ text: h.slice(last, m.index), hl: false });
    parts.push({ text: m[1], hl: true });
    last = m.index + m[0].length;
  }
  if (last < h.length) parts.push({ text: h.slice(last), hl: false });
  return parts;
}
export const plainHeadline = (h) => h.replace(/\[\[(.+?)\]\]/g, '$1');

const STOP = new Set('the a an and or of to in on for with by at from as is are was were be its it this that after into over under than then has have had will would could says said say new'.split(' '));
export const contentWords = (s) =>
  plainHeadline(s).toLowerCase().replace(/[^a-z0-9\s’'-]/g, ' ').split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w));

export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
