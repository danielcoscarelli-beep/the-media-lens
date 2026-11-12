// End-to-end check of the blind-rating system in a real browser.
// Requires Playwright + Chromium (preinstalled in the Claude Code cloud container).
// Usage: npm run build:single && node tests/e2e/rating-flow.e2e.cjs [screenshotDir]
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '../../dist-single/index.html');
const SHOTS = process.argv[2] || null;
const PUBS = ['The New York Times', 'Fox News', 'The Wall Street Journal', 'CNN', 'Associated Press', 'Reuters', 'BBC News', 'The Guardian', 'NPR', 'Bloomberg', 'Politico', 'The Washington Post'];
const results = []; let failed = 0;
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`); if (!ok) failed++; };

(async () => {
  const html = fs.readFileSync(ROOT);
  const server = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(html); }).listen(0);
  const URL = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const go = async (hash) => { await page.goto(URL + hash); await page.waitForTimeout(700); };
  const shot = async (name, p = page) => { if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true }); };

  // Facts about the sample data, read from the running app's own modules is not possible from
  // outside, so the test uses the stable public ids from src/data/articles.js.
  const AP = { id: 'kxfv', pub: 'Associated Press', author: 'Jordan Ellery', uniqueSource: 'Timelines Vary Widely', headline: 'Senate approves bill to speed permits' };
  const FOX = { id: 'h4mu', author: 'Brett Lancaster', headline: 'Senate Clears Bill to Slash Red Tape' };
  const GRID = { id: 'p527', author: 'Colby Rhodes', headline: 'Green Energy Failures Push Grid' }; // added 2026-11-12, open at start
  const TRANSIT = 'nf4s', AIHIRING = 'tz66'; // published at +20h and +34h
  const CARD_SELECTORS = '.acard, .ccol, .lineup li, .hl-table li, .open-list li, .feed-item, .side-list li, .contrast-list li, .ecard';

  await go('#home');
  await shot('01-home');
  check('Rating Mode by default', (await page.textContent('.modebar')).includes('Rating Mode'));
  check('Browse Mode locked before 3 ratings', await page.isDisabled('.mode-btn'));

  // ── Leak scan while AP and Fox permitting articles are sealed ─────────────
  const scan = async (label) => {
    const found = await page.evaluate(({ AP, FOX, GRID, PUBS, CARD_SELECTORS }) => {
      const issues = [];
      const exempt = (el) => !!el.closest('[data-leak-exempt]');
      const texts = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      for (let el = walker.currentNode; el; el = walker.nextNode()) {
        if (exempt(el)) continue;
        if (['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
        for (const attr of ['title', 'aria-label', 'href', 'alt']) if (el.getAttribute && el.getAttribute(attr)) texts.push(el.getAttribute(attr));
      }
      const visible = [...document.body.querySelectorAll('*')].filter((e) => !exempt(e) && e.children.length === 0 && !['SCRIPT', 'STYLE'].includes(e.tagName)).map((e) => e.textContent).join('\n');
      const all = `${visible}\n${texts.join('\n')}\n${location.hash}`;
      for (const s of [AP.pub, AP.author, AP.uniqueSource, FOX.author, GRID.author]) if (all.includes(s)) issues.push(`found "${s}"`);
      for (const el of document.querySelectorAll(CARD_SELECTORS)) {
        const t = el.innerText || '';
        if (!(t.includes(AP.headline) || t.includes(FOX.headline) || t.includes(GRID.headline))) continue;
        if (el.closest('.ecard')) continue; // event cards contain several articles; checked by the global scan
        for (const p of PUBS) if (t.includes(p)) issues.push(`card shows "${p}"`);
        if (/\d+\s*\/100/.test(t)) issues.push('card shows a score');
        const links = [...el.querySelectorAll('a')].map((a) => a.href).filter((h) => !h.includes(location.host));
        if (links.length) issues.push(`card links out: ${links[0]}`);
      }
      return issues;
    }, { AP, FOX, GRID, PUBS, CARD_SELECTORS });
    check(`no leak on ${label}`, found.length === 0, found.join('; '));
  };
  for (const h of ['#home', '#explore', '#explore-permitting', '#explore-senate', '#explore-grid', '#compare', '#compare-permitting-act', '#compare-grid-heat', `#article-${AP.id}`, `#article-${FOX.id}`, `#article-${GRID.id}`, '#sources-permitting-act', '#sources-grid-heat', `#sources-${AP.id}`, '#profile', '#methods']) { await go(h); await scan(h); }
  await go(`#article-${TRANSIT}`);
  check('transit article not published at start', (await page.textContent('.page')).includes('Not published yet'));
  await go('#explore'); await page.click('text=By event'); await page.selectOption('#sort', 'publication'); await page.waitForTimeout(600); await scan('explore sorted by publication');
  await page.check('[data-leak-exempt] input[type=checkbox] >> nth=4'); await page.waitForTimeout(600); // Associated Press filter
  check('publication filter excludes sealed AP article', !(await page.textContent('.results')).includes(AP.headline));
  await go('#ratings'); await scan('ratings queue');
  await page.click('.tab:has-text("Community scores")'); await page.waitForTimeout(300); await scan('ratings table');
  await page.click('.tab:has-text("Spread by publication")'); await page.waitForTimeout(300); await scan('ratings spread');

  // ── Sealed article page ──────────────────────────────────────────────────
  await go(`#article-${AP.id}`);
  await shot('02-article-sealed');
  check('sealed: article text visible', (await page.$$('.art-body p')).length >= 3);
  check('sealed: five rating options', (await page.$$('.rate-opt')).length === 5);
  check('sealed: submit disabled until a choice', await page.isDisabled('button:has-text("Submit rating")'));
  check('sealed: analysis tabs hidden', (await page.$$('#article-tabs-sources')).length === 0);
  check('sealed: no community score shown', (await page.$$('.score-badge')).length === 0);
  const cd1 = await page.textContent('.side-countdown'); await page.waitForTimeout(2100); const cd2 = await page.textContent('.side-countdown');
  check('countdown ticks', cd1 !== cd2, `${cd1} → ${cd2}`);

  // ── Rate five open articles, one with each option ─────────────────────────
  const openIds = await page.evaluate(async () => [...document.querySelectorAll('.side-list a')].map((a) => a.getAttribute('href').replace('#article-', '')));
  const targets = [AP.id, ...openIds].slice(0, 5);
  const labels = ['Neutral / Factual', 'Slightly Biased', 'Biased', 'Very Biased / Misleading', 'Nonfactual'];
  const points = [100, 75, 50, 25, 0];
  for (let i = 0; i < 5; i++) {
    await go(`#article-${targets[i]}`);
    await page.click(`.rate-opt:has(input[value="${points[i]}"])`);
    await page.click('button:has-text("Submit rating")');
    await page.waitForSelector('.res-num');
    if (i === 0) { await page.waitForTimeout(500); await shot('03-reveal-midway'); }
    await page.waitForTimeout(3300);
    const panel = await page.textContent('.rpanel');
    check(`option "${labels[i]}" locked in`, panel.includes(`Your rating: ${labels[i]}`));
    check(`reveal ${i + 1}: includes your rating`, panel.includes('1 from you'));
    const { pts, counts, shown, total } = await page.evaluate(() => ({
      pts: [...document.querySelectorAll('.rpanel .dl-pts')].map((e) => +e.textContent),
      counts: [...document.querySelectorAll('.rpanel .dl-n')].map((e) => +e.textContent.replace(/,/g, '')),
      shown: +document.querySelector('.res-num').textContent,
      total: +document.querySelector('.res-count strong').textContent.replace(/,/g, ''),
    }));
    const n = counts.reduce((a, b) => a + b, 0); const mean = counts.reduce((a, c, k) => a + c * pts[k], 0) / n;
    check(`reveal ${i + 1}: score = mean of points`, Math.round(mean) === shown && n === total, `computed ${mean.toFixed(2)}, shown ${shown}, n ${n}/${total}`);
    const head = await page.textContent('.art-head');
    check(`reveal ${i + 1}: publication revealed`, PUBS.some((p) => head.includes(p)) && !head.includes('Publication hidden'));
    check(`reveal ${i + 1}: sources tab unlocked`, (await page.$$('#article-tabs-sources')).length === 1);
    if (i === 0) await shot('04-revealed');
  }
  await go(`#article-${AP.id}`);
  check('AP article now shows its outlet', (await page.textContent('.art-head')).includes(AP.pub));
  check('rating is final (no form on revisit)', (await page.$$('.rate-opt')).length === 0);

  // ── Browse Mode ──────────────────────────────────────────────────────────
  check('Browse Mode unlocked after 3 ratings', !(await page.isDisabled('.mode-btn')));
  await page.click('.mode-btn'); await page.waitForSelector('.modal');
  await shot('05-browse-confirm');
  await page.click('button:has-text("Keep rating")');
  check('cancel keeps Rating Mode', (await page.textContent('.modebar')).includes('Rating Mode'));
  await page.click('.mode-btn'); await page.click('.modal button:has-text("Enter Browse Mode")'); await page.waitForTimeout(400);
  check('entered Browse Mode', (await page.textContent('.modebar')).includes('Browse Mode'));
  await page.reload(); await page.waitForTimeout(800);
  check('Browse Mode survives reload', (await page.textContent('.modebar')).includes('Browse Mode'));
  await go(`#article-${FOX.id}`);
  const foxRated = targets.includes(FOX.id);
  check('Browse Mode: no rating form', (await page.$$('.rate-opt')).length === 0);
  check('Browse Mode: outlet and live score visible', (await page.textContent('.art-head')).includes('Fox News') && (await page.$$('.res-num')).length === 1, foxRated ? '(Fox was rated)' : '');
  await go('#ratings'); await page.click('.tab:has-text("Rate blind")'); await page.waitForTimeout(200);
  check('queue paused in Browse Mode', (await page.textContent('.tab-pane')).includes('Rating is paused'));
  await go('#profile'); await shot('06-profile-pending');
  check('profile: unranked before windows close', (await page.textContent('.prof-score')).includes('Unranked'));

  // ── Time passes: windows close, new day ─────────────────────────────────
  await go('#methods');
  await page.click('button:has-text("+24 hours")'); await page.waitForTimeout(800);
  await go(`#article-${AP.id}`);
  check('after 24h: AP article closed', (await page.textContent('.article-side')).includes('Closed'));
  check('after 24h: final score labeled', (await page.textContent('.rpanel')).includes('Final community score'));
  await go(`#article-${TRANSIT}`);
  check('after 24h: transit article published and open', (await page.$$('.rate-opt')).length === 5);
  await go(`#article-${AIHIRING}`);
  check('after 24h: AI-hiring article still unpublished (opens at +34h)', (await page.textContent('.page')).includes('Not published yet'));
  await go(`#article-${AP.id}`);
  check('after 24h: new day returns to Rating Mode', (await page.textContent('.modebar')).includes('Rating Mode'));
  await go('#profile'); await shot('07-profile-provisional');
  const prof = await page.textContent('.page');
  check('profile: provisional rank after 5 eligible', prof.includes('Provisional') && /\d+(st|nd|rd|th) percentile/.test(prof), prof.match(/(\d+) of 5 eligible|Provisional/)?.[0]);
  await page.click('.tab:has-text("Rating history")'); await page.waitForTimeout(200);
  check('history shows distances', (await page.textContent('.history')).includes('pts away'));

  // ── Responsive + themes ─────────────────────────────────────────────────
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const h of ['#home', '#explore', '#compare-permitting-act', '#article-' + AP.id, '#ratings', '#profile', '#methods']) {
    await m.goto(URL + h); await m.waitForTimeout(700);
    const ov = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`390px no horizontal scroll ${h}`, ov <= 0, `${ov}px`);
  }
  await m.goto(URL + '#ratings'); await m.waitForTimeout(700); await shot('08-mobile-ratings', m);
  const d = await browser.newPage({ viewport: { width: 1360, height: 900 }, colorScheme: 'dark' });
  await d.goto(URL + '#article-' + AP.id); await d.waitForTimeout(800); await shot('09-dark-article', d);
  const bg = await d.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('dark theme applies', bg === 'rgb(18, 20, 22)', bg);

  // ── Restart timeline clears ratings ─────────────────────────────────────
  await go('#methods'); await page.click('button:has-text("Restart timeline")'); await page.click('button:has-text("Restart"):not(:has-text("timeline"))'); await page.waitForTimeout(500);
  await go('#profile');
  check('restart clears ratings', (await page.textContent('.stat-row')).includes('0Ratings submitted'));

  check('no page or console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  console.log(results.join('\n'));
  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  await browser.close(); server.close();
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
