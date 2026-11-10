// Inline the Vite build into self-contained HTML files:
//   dist-single/index.html        full document, opens directly from disk
//   dist-single/the-media-lens.html  body-only fragment for hosts that supply the document skeleton
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const cssHref = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/)[1];
const jsSrc = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/)[1];
const css = readFileSync(join(dist, cssHref), 'utf8');
const js = readFileSync(join(dist, jsSrc), 'utf8').replace(/<\/script/gi, '<\\/script');

const head = `<title>The Media Lens</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Compare how news organizations cover the same events, trace sources, and evaluate headline framing.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style>`;
const body = `<div id="root"></div>\n<script type="module">${js}</script>`;

mkdirSync('dist-single', { recursive: true });
writeFileSync('dist-single/the-media-lens.html', `${head}\n${body}\n`);
writeFileSync('dist-single/index.html', `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`);
console.log('wrote dist-single/index.html and dist-single/the-media-lens.html');
