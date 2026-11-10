// ─────────────────────────────────────────────────────────────────────────────
// Publication schedule and 24-hour rating windows (SIMULATED for the prototype).
//
// Each event is "published" at a fixed offset from the timeline epoch (lib/clock.js);
// its articles follow at stable 0–60 minute intervals. An article's rating window
// opens when it is published and closes exactly 24 hours later.
//
//   status: 'upcoming' (not yet published — hidden everywhere)
//           'open'     (opensAt <= now < closesAt — can be rated)
//           'closed'   (now >= closesAt — results public, no more ratings)
//
// Status is always COMPUTED from timestamps, never stored, so a refresh can never
// leave it out of date. A real backend would store opensAt/closesAt per article.
// ─────────────────────────────────────────────────────────────────────────────
import { articles } from '../data/articles.js';
import { events } from '../data/events.js';
import { getEpoch, HOUR, DAY } from './clock.js';

export const WINDOW_MS = DAY;

/** Hours relative to the epoch at which each event's first article is published. */
export const EVENT_OFFSET_HOURS = {
  'pa-map': -70,          // closed at start
  'fed-holds': -50,       // closed at start
  'chip-exports': -20,    // open, ~4h left at start
  'methane-pact': -13,    // open, ~11h left at start
  'permitting-act': -1.5, // open, ~22h left at start (featured)
  'water-cyber': 3,       // published 3h after first visit
  'baltic-cables': 9,     // published 9h after first visit
};

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

let cache = { epoch: null, map: null };
function windows() {
  const epoch = getEpoch();
  if (cache.epoch === epoch) return cache.map;
  const map = new Map();
  for (const ev of events) {
    const base = epoch + (EVENT_OFFSET_HOURS[ev.id] ?? 0) * HOUR;
    // Stable but non-alphabetical order inside an event, so order doesn't hint at the outlet.
    const list = articles.filter((a) => a.eventId === ev.id).sort((x, y) => hash(x.id) - hash(y.id));
    list.forEach((a, i) => {
      const opensAt = base + i * 12 * 60e3 + (hash(a.ref) % 7) * 60e3; // within ~1 hour of each other
      map.set(a.id, { opensAt, closesAt: opensAt + WINDOW_MS });
    });
  }
  cache = { epoch, map };
  return map;
}

export const windowFor = (articleId) => windows().get(articleId);

export function statusAt(articleId, t) {
  const w = windowFor(articleId);
  if (!w) return 'upcoming';
  return t < w.opensAt ? 'upcoming' : t < w.closesAt ? 'open' : 'closed';
}
export const isPublished = (articleId, t) => statusAt(articleId, t) !== 'upcoming';

/** Publication time of an event = its earliest article. */
export function eventPublishedAt(eventId) {
  return Math.min(...articles.filter((a) => a.eventId === eventId).map((a) => windowFor(a.id).opensAt));
}

/** All window boundaries, used to re-render exactly when any article opens or closes. */
export function boundaries() {
  return [...windows().values()].flatMap((w) => [w.opensAt, w.closesAt]);
}

// Sample source documents carry fixed sample dates written relative to each event's original
// sample date (events.js `date`). Shift them by the same amount the event moved on this timeline,
// so a press release still appears on the day of the vote, not weeks earlier.
let sourceEventMap = null;
function eventForSource(sourceId) {
  if (!sourceEventMap) {
    sourceEventMap = new Map();
    for (const a of articles) for (const u of a.sourceUses) if (!sourceEventMap.has(u.id)) sourceEventMap.set(u.id, a.eventId);
  }
  return sourceEventMap.get(sourceId);
}
export function shiftedSourceDate(sourceId, isoDate) {
  const ev = events.find((e) => e.id === eventForSource(sourceId));
  if (!ev || !isoDate) return null;
  const [y, m, d] = ev.date.split('-').map(Number);
  const shift = eventPublishedAt(ev.id) - new Date(y, m - 1, d, 12).getTime();
  const [sy, sm, sd] = isoDate.split('-').map(Number);
  return new Date(sy, sm - 1, sd, 12).getTime() + shift;
}
