// Sample data is anchored to this reference date so relative filters stay meaningful.
export const SAMPLE_NOW = new Date('2026-11-01T12:00:00Z');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function fmtDate(iso, { year = true } = {}) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}${year ? `, ${y}` : ''}`;
}
export const daysAgo = (iso) => Math.floor((SAMPLE_NOW - new Date(iso.slice(0, 10) + 'T12:00:00Z')) / 86400000);
export function relTime(mins) {
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  return `${h} hr ago`;
}
export const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
export const num = (n) => n.toLocaleString('en-US');
