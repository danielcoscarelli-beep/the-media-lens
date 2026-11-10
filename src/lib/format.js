// Formatting helpers. All times are shown in the reader's local time zone.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Nov 10, 2026" from an ISO date string (YYYY-MM-DD…) or a timestamp. */
export function fmtDate(v, { year = true } = {}) {
  if (v === null || v === undefined || v === '') return '';
  let y, m, d;
  if (typeof v === 'number') { const x = new Date(v); y = x.getFullYear(); m = x.getMonth() + 1; d = x.getDate(); }
  else [y, m, d] = v.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}${year ? `, ${y}` : ''}`;
}
/** "Nov 10, 4:12 PM" from a timestamp. */
export function fmtDateTime(ts) {
  const x = new Date(ts);
  const h = x.getHours(), mm = String(x.getMinutes()).padStart(2, '0');
  return `${fmtDate(ts, { year: false })}, ${((h + 11) % 12) + 1}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}
/** "3h ago" / "in 2h 5m" relative to now. */
export function fmtRelative(ts, now) {
  const diff = ts - now, abs = Math.abs(diff);
  const s = abs < 60e3 ? 'under a minute' : fmtDuration(abs, { seconds: false });
  return diff < 0 ? `${s} ago` : `in ${s}`;
}
/** "22h 14m 05s" (or "14m 05s"). */
export function fmtDuration(ms, { seconds = true } = {}) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400), h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (d || h) parts.push(`${h}h`);
  parts.push(`${d || h ? String(m).padStart(2, '0') : m}m`);
  if (seconds && !d) parts.push(`${String(s).padStart(2, '0')}s`);
  return parts.join(' ');
}
export const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
export const num = (n) => n.toLocaleString('en-US');
export const score = (x) => (x === null || x === undefined ? '—' : Math.round(x));
