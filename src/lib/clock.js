// ─────────────────────────────────────────────────────────────────────────────
// The app clock and the demo timeline.
//
// now() = real time + a demo offset. Every time-dependent rule (rating windows,
// countdowns, the "today" used for Browse Mode) reads this one function, so the
// whole app stays consistent. The demo offset exists ONLY so the prototype can be
// fast-forwarded; a production app would use server time and no offset.
//
// epoch = the moment this browser first opened the prototype. The sample articles'
// publication times are scheduled relative to it (lib/schedule.js), so every new
// visitor starts with some articles closed, some open and some still to come.
// Persisted in localStorage (key below) so refreshes keep the same timeline.
// ─────────────────────────────────────────────────────────────────────────────
const KEY = 'media-lens:clock:v1';
const listeners = new Set();
let state = null;

function load() {
  if (state) return state;
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && Number.isFinite(s.epoch) && Number.isFinite(s.offsetMs)) state = s;
  } catch { /* storage unavailable */ }
  if (!state) { state = { epoch: Date.now(), offsetMs: 0 }; save(); }
  return state;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  listeners.forEach((fn) => fn(state));
}

export const getEpoch = () => load().epoch;
export const getOffset = () => load().offsetMs;
export const now = () => Date.now() + load().offsetMs;

/** Demo control: move the clock forward. */
export function advance(ms) { load(); state = { ...state, offsetMs: state.offsetMs + ms }; save(); }
/** Demo control: start a brand-new timeline from the real current time. */
export function restartTimeline() { state = { epoch: Date.now(), offsetMs: 0 }; save(); }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
/** Ask subscribers to re-read the clock now (e.g. right after a rating is submitted). */
export function notify() { load(); listeners.forEach((fn) => fn(state)); }

/** Testing hook: replace the stored clock state (used by unit tests only). */
export function __setClockForTests(s) { state = s; }

export const HOUR = 3600e3;
export const DAY = 24 * HOUR;

/** Local calendar date as YYYY-MM-DD (uses the device's time zone). */
export function localDayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** Timestamp of the next local midnight after ts. */
export function nextLocalMidnight(ts) {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}
