// ─────────────────────────────────────────────────────────────────────────────
// SIMULATED REPUTATION MODEL (prototype)
//
// Goal: reward careful, evidence-based reasoning, NOT agreement with the majority.
// Agreement with the community average has zero weight anywhere in this file.
//
// Components
//   1. Reasoning quality (40%): heuristics on the written explanation. Is it
//      substantive, does it cite specific wording, does it point to evidence,
//      do the chosen reasons match the text, is it civil?
//   2. Consistency (25%): do you rate headlines with more loaded language as more
//      biased, regardless of outlet? Measured as the correlation between your
//      ratings and a lexicon-based language-intensity index.
//   3. Framing detection (20%): of the objective textual markers present in
//      headlines you rated (e.g. an unattributed figure), how many did your
//      chosen reasons identify? This is the only "accuracy" measured.
//   4. Constructive participation (15%): volume with diminishing returns, plus
//      simulated "helpful" marks from other readers.
//
// Limitations are listed in LIMITATIONS below and shown in the UI.
// ─────────────────────────────────────────────────────────────────────────────
import { getArticle, MARKERS } from '../data/articles.js';
import { simulatedHelpful } from '../data/community.js';
import { contentWords } from './text.js';
import { pearson } from './stats.js';

const REASON_WORDS = {
  emotional: ['emotion', 'charged', 'feel', 'alarm', 'dramatic', 'metaphor', 'intens', 'verb', 'fear', 'urgen'],
  selective: ['emphas', 'select', 'leaves out', 'left out', 'omit', 'only', 'cherry', 'buried', 'end of'],
  misleading: ['mislead', 'impl', 'suggest', 'frame', 'framing', 'overstat', 'exaggerat', 'verdict', 'judgment'],
  loaded: ['loaded', 'term', 'word', 'phrase', 'connot', 'label', 'language'],
  context: ['context', 'omit', 'missing', 'leaves out', 'background', 'baseline', 'doesn’t mention', "doesn't mention", 'no mention'],
  unbalanced: ['side', 'quote', 'voices', 'balance', 'perspective', 'one-sided', 'opponent', 'supporter', 'critic'],
  other: [''],
};
const EVIDENCE = /\b(source|sourc|cite|cited|attribut|quot|data|document|study|report|evidence|according|figure|number|bill text|press release|cbo|gao|advisory|record)\w*|\d/gi;
const INCIVIL = /\b(idiot|stupid|liar|lying|propaganda|fake news|trash|garbage|shill|moron)\b/i;

/** Score one written evaluation. Returns 0–100 plus a breakdown for live feedback. */
export function reasoningQuality({ rating, reasons = [], text = '' }, article) {
  const t = text.trim();
  const lower = t.toLowerCase();
  const words = t ? t.split(/\s+/).length : 0;
  const parts = [];

  const substance = Math.round(Math.min(words / 35, 1) * 25);
  parts.push({ key: 'substance', label: 'Substantive explanation', got: substance, max: 25, hint: words < 12 ? 'Add a sentence or two explaining your judgment.' : null });

  const hlWords = article ? contentWords(article.headline) : [];
  const chargedTerms = article ? article.charged.map((c) => c.term.toLowerCase()) : [];
  const citesWording = [...hlWords, ...chargedTerms].some((w) => lower.includes(w)) || /["“”‘’']\w[^"“”]*["“”’']/.test(t);
  const specificity = t ? (citesWording ? 25 : 0) : 0;
  parts.push({ key: 'specificity', label: 'Points to specific wording', got: specificity, max: 25, hint: specificity ? null : 'Quote or name the word or phrase you are reacting to.' });

  const evMatches = (t.match(EVIDENCE) || []).length;
  const evidence = Math.min(evMatches * 7, 20);
  parts.push({ key: 'evidence', label: 'Refers to sourcing or evidence', got: evidence, max: 20, hint: evidence < 14 ? 'Mention what the article cites, omits or attributes.' : null });

  let coherence = 0;
  if (reasons.length) {
    const matched = reasons.some((r) => (REASON_WORDS[r] || []).some((w) => lower.includes(w)));
    coherence = t ? (matched ? 15 : 7) : 0;
  } else if (rating === 0 && t) coherence = 15;
  parts.push({ key: 'coherence', label: 'Reasons match the explanation', got: coherence, max: 15, hint: coherence < 15 ? (reasons.length ? 'Explain how your selected reasons show up in the text.' : 'Select at least one reason, or explain why the headline is neutral.') : null });

  const civility = t ? (INCIVIL.test(t) ? 0 : 15) : 0;
  parts.push({ key: 'civility', label: 'Constructive tone', got: civility, max: 15, hint: civility || !t ? null : 'Critique the wording, not the people.' });

  const score = Math.max(0, Math.min(100, parts.reduce((a, p) => a + p.got, 0)));
  return { score, parts };
}

function markerDetection(evals) {
  let present = 0, found = 0;
  const detail = [];
  evals.forEach((e) => {
    const a = getArticle(e.articleId);
    if (!a) return;
    a.markers.filter((m) => MARKERS[m].reasons.length).forEach((m) => {
      present += 1;
      const hit = MARKERS[m].reasons.some((r) => e.reasons.includes(r));
      if (hit) found += 1;
      detail.push({ articleId: a.id, marker: m, hit });
    });
  });
  return { value: present ? Math.round((found / present) * 100) : null, present, found, detail };
}

export const LEVELS = [
  { name: 'Observer', min: 0 },
  { name: 'Contributor', min: 35 },
  { name: 'Analyst', min: 50 },
  { name: 'Senior Analyst', min: 65 },
  { name: 'Fellow', min: 80 },
];
export const levelFor = (score) => [...LEVELS].reverse().find((l) => score >= l.min);
export const nextLevel = (score) => LEVELS.find((l) => l.min > score) || null;

export function computeReputation(evaluations) {
  const evals = evaluations.filter((e) => getArticle(e.articleId));
  const qualities = evals.map((e) => reasoningQuality(e, getArticle(e.articleId)).score);
  const avgQuality = qualities.length ? Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length) : null;

  const r = pearson(evals.map((e) => e.rating), evals.map((e) => getArticle(e.articleId).intensity));
  const consistency = r === null ? null : Math.round(Math.max(0, Math.min(100, 50 + 50 * r)));

  const md = markerDetection(evals);
  const helpful = qualities.reduce((a, q) => a + simulatedHelpful(q), 0);
  const participation = Math.round(Math.min(100, 100 * (1 - Math.exp(-evals.length / 6)) * 0.8 + Math.min(helpful, 20)));

  const components = [
    { key: 'quality', label: 'Reasoning quality', weight: 0.4, value: avgQuality, explain: 'Average quality of your written explanations: specificity, evidence and coherence.' },
    { key: 'consistency', label: 'Consistency', weight: 0.25, value: consistency, explain: 'Do you rate more loaded language as more biased, whichever outlet it comes from? Needs at least three evaluations with varied language.' },
    { key: 'detection', label: 'Framing detection', weight: 0.2, value: md.value, explain: 'Share of objective textual markers (for example, an unattributed figure) that your selected reasons identified.' },
    { key: 'participation', label: 'Constructive participation', weight: 0.15, value: evals.length ? participation : null, explain: 'Evaluation volume with diminishing returns, plus simulated "helpful" marks from other readers.' },
    { key: 'majority', label: 'Agreement with majority', weight: 0, value: null, explain: 'Deliberately weighted at zero. Disagreeing with the crowd never costs reputation.' },
  ];
  const active = components.filter((c) => c.weight > 0 && c.value !== null);
  const wsum = active.reduce((a, c) => a + c.weight, 0);
  const score = wsum ? Math.round(active.reduce((a, c) => a + c.value * c.weight, 0) / wsum) : 0;
  // Confidence grows with evidence; the displayed score is shrunk toward a neutral prior when n is small.
  const confidence = Math.min(1, evals.length / 10);
  const display = Math.round(score * (0.5 + 0.5 * confidence) + 30 * (0.5 - 0.5 * confidence));
  return { score: display, rawScore: score, confidence, level: levelFor(display), next: nextLevel(display), components, helpful, markers: md, n: evals.length, qualities };
}

export const LIMITATIONS = [
  'Reasoning quality is judged by text heuristics (length, quoted wording, evidence words). A fluent writer can game it, and a terse expert can be underrated. Production use would need human review or a validated model.',
  'The language-intensity index used for consistency comes from a word list. Word lists miss sarcasm, context and framing done through story selection, so consistency is an approximation.',
  'Framing detection only covers markers that can be checked objectively in the text. Most judgments about bias are subjective, and no score here says whether a rating is "correct."',
  'Helpful marks are simulated. In a live system they could become popularity contests, so they are capped and weighted lightly.',
  'Scores shrink toward a neutral prior until a reader has about ten evaluations, so a few early ratings cannot produce extreme scores.',
  'Agreement with the majority has zero weight. A reader who consistently dissents with well-supported reasoning can reach the top level.',
];
