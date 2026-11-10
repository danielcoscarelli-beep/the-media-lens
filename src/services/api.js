// ─────────────────────────────────────────────────────────────────────────────
// Mock data service. Every UI read goes through this module, so swapping in a
// real news API or database means reimplementing these functions with the same
// return shapes. The artificial latency exercises loading states.
// ─────────────────────────────────────────────────────────────────────────────
import { articles, getArticle, articlesForEvent } from '../data/articles.js';
import { events, getEvent } from '../data/events.js';
import { publications } from '../data/publications.js';
import { getSource } from '../data/sources.js';
import { getClaim } from '../data/claims.js';
import { daysAgo } from '../lib/format.js';

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

const tokenize = (q) => q.toLowerCase().split(/[^a-z0-9.]+/).filter((t) => t.length > 1);

function scoreArticle(a, tokens) {
  if (!tokens.length) return 1;
  const ev = getEvent(a.eventId);
  const pub = publications[a.pub];
  const fields = [
    [a.headline.replace(/\[|\]/g, ''), 5],
    [ev.title, 4],
    [[...ev.tags, ...ev.people, ...ev.orgs].join(' '), 3],
    [ev.topic, 3],
    [a.dek, 2],
    [`${pub.name} ${pub.short}`, 2],
    [a.author || '', 2],
    [ev.summary, 1],
  ].map(([s, w]) => [s.toLowerCase(), w]);
  let total = 0;
  for (const t of tokens) {
    let best = 0;
    for (const [s, w] of fields) if (s.includes(t)) best = Math.max(best, w);
    if (!best) return 0; // every term must match somewhere
    total += best;
  }
  return total;
}

/** Search + filter + sort. Returns articles and the events they belong to. */
export async function searchArticles({ q = '', pubs = [], topic = '', range = 'any', sort = 'relevance' } = {}) {
  await delay();
  const tokens = tokenize(q);
  let rows = articles
    .map((a) => ({ a, score: scoreArticle(a, tokens) }))
    .filter(({ a, score }) => score > 0
      && (!pubs.length || pubs.includes(a.pub))
      && (!topic || getEvent(a.eventId).topic === topic)
      && (range === 'any' || daysAgo(a.date) <= Number(range)));
  const byDate = (x, y) => (y.a.date + y.a.time).localeCompare(x.a.date + x.a.time);
  if (sort === 'recency') rows.sort(byDate);
  else if (sort === 'publication') rows.sort((x, y) => publications[x.a.pub].name.localeCompare(publications[y.a.pub].name) || byDate(x, y));
  else rows.sort((x, y) => y.score - x.score || byDate(x, y));
  const list = rows.map((r) => r.a);
  const eventIds = [...new Set(list.map((a) => a.eventId))];
  return { articles: list, events: eventIds.map(getEvent) };
}

export async function listEvents() {
  await delay(200);
  return events.map((e) => ({ ...e, articles: articlesForEvent(e.id) }));
}

export async function getEventBundle(id) {
  await delay(260);
  const event = getEvent(id);
  if (!event) return null;
  return { event, articles: articlesForEvent(id) };
}

export async function getArticleBundle(id) {
  await delay(240);
  const article = getArticle(id);
  if (!article) return null;
  return {
    article,
    event: getEvent(article.eventId),
    siblings: articlesForEvent(article.eventId).filter((a) => a.id !== id),
    sources: article.sourceUses.map((u) => ({ ...getSource(u.id), use: u })),
    claims: article.claims.map(getClaim).filter(Boolean),
  };
}
