// ─────────────────────────────────────────────────────────────────────────────
// Mock data service. Pages read article/event data through this module, so a real
// news API or database can replace it later with the same return shapes.
// The artificial latency exercises loading states.
//
// Blind-rating rule: callers pass `vis` (visibility function from the store). For a
// SEALED article, the outlet name and byline are not searchable, publication filters
// exclude it, and publication sorting puts it in a separate "hidden" group — otherwise
// search results would reveal which outlet wrote it.
// ─────────────────────────────────────────────────────────────────────────────
import { articles, getArticle, articlesForEvent } from '../data/articles.js';
import { events, getEvent } from '../data/events.js';
import { publications } from '../data/publications.js';
import { getSource } from '../data/sources.js';
import { getClaim } from '../data/claims.js';
import { isPublished, windowFor } from '../lib/schedule.js';

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));
const tokenize = (q) => q.toLowerCase().split(/[^a-z0-9.]+/).filter((t) => t.length > 1);
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);

function scoreArticle(a, tokens, sealed) {
  if (!tokens.length) return 1;
  const ev = getEvent(a.eventId);
  const pub = publications[a.pub];
  const fields = [
    [a.headline.replace(/\[|\]/g, ''), 5],
    [ev.title, 4],
    [[...ev.tags, ...ev.people, ...ev.orgs].join(' '), 3],
    [ev.topic, 3],
    [a.dek, 2],
    sealed ? ['', 0] : [`${pub.name} ${pub.short}`, 2],
    sealed ? ['', 0] : [a.author || '', 2],
    [ev.summary, 1],
  ].map(([s, w]) => [s.toLowerCase(), w]);
  let total = 0;
  for (const t of tokens) {
    let best = 0;
    for (const [s, w] of fields) if (w && s.includes(t)) best = Math.max(best, w);
    if (!best) return 0; // every term must match somewhere
    total += best;
  }
  return total;
}

/**
 * Search + filter + sort published articles.
 * @param opts.vis     visibility function (required)
 * @param opts.now     app time (ms)
 * @param opts.status  'all' | 'open' | 'closed'
 * @param opts.range   'any' | hours as string ('24', '72', '168'), by publication time
 */
export async function searchArticles({ q = '', pubs = [], topic = '', range = 'any', sort = 'relevance', status = 'all', vis, now }) {
  await delay();
  const tokens = tokenize(q);
  const rows = articles
    .map((a) => ({ a, v: vis(a) }))
    .filter(({ v }) => v.published)
    .map((r) => ({ ...r, score: scoreArticle(r.a, tokens, r.v.sealed) }))
    .filter(({ a, v, score }) => score > 0
      && (!pubs.length || (!v.sealed && pubs.includes(a.pub)))
      && (!topic || getEvent(a.eventId).topic === topic)
      && (status === 'all' || v.status === status)
      && (range === 'any' || now - windowFor(a.id).opensAt <= Number(range) * 3600e3));
  const byTime = (x, y) => windowFor(y.a.id).opensAt - windowFor(x.a.id).opensAt;
  if (sort === 'recency') rows.sort(byTime);
  else if (sort === 'publication') {
    rows.sort((x, y) => (x.v.sealed - y.v.sealed)
      || (x.v.sealed ? hash(x.a.id) - hash(y.a.id) : publications[x.a.pub].name.localeCompare(publications[y.a.pub].name))
      || byTime(x, y));
  } else rows.sort((x, y) => y.score - x.score || byTime(x, y));
  const list = rows.map((r) => r.a);
  const eventIds = [...new Set(list.map((a) => a.eventId))];
  return { articles: list, events: eventIds.map(getEvent) };
}

const publishedFor = (eventId, now) => articlesForEvent(eventId).filter((a) => isPublished(a.id, now));

export async function listEvents({ now }) {
  await delay(200);
  return events.map((e) => ({ ...e, articles: publishedFor(e.id, now), allCount: articlesForEvent(e.id).length }))
    .filter((e) => e.articles.length);
}

export async function getEventBundle(id, { now }) {
  await delay(240);
  const event = getEvent(id);
  if (!event) return null;
  const list = publishedFor(id, now);
  if (!list.length) return null;
  return { event, articles: list, allCount: articlesForEvent(id).length };
}

export async function getArticleBundle(id, { now }) {
  await delay(220);
  const article = getArticle(id);
  if (!article) return null;
  return {
    article,
    published: isPublished(article.id, now),
    event: getEvent(article.eventId),
    siblings: publishedFor(article.eventId, now).filter((a) => a.id !== id),
    sources: article.sourceUses.map((u) => ({ ...getSource(u.id), use: u })),
    claims: article.claims.map(getClaim).filter(Boolean),
  };
}
