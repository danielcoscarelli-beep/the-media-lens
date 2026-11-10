// App state: user profile, evaluations and demo-journey progress.
// Persisted to localStorage when available. Replace with an auth provider + API later.
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { defaultUser, seedEvaluations } from '../data/user.js';
import { computeReputation, reasoningQuality } from '../lib/reputation.js';
import { getArticle } from '../data/articles.js';

const KEY = 'media-lens:v1';
const initial = {
  user: defaultUser,
  evaluations: seedEvaluations.map((e, i) => ({ id: `seed-${i}`, ...e })),
  journey: { searched: false, compared: false, opened: false, sources: false, rated: false, explained: false, contributed: false, profileViewed: false },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const s = JSON.parse(raw);
    return { ...initial, ...s, user: { ...defaultUser, ...s.user, demographics: { ...defaultUser.demographics, ...(s.user?.demographics || {}) } }, journey: { ...initial.journey, ...s.journey } };
  } catch { return initial; }
}

function reducer(state, action) {
  switch (action.type) {
    case 'submitEvaluation': {
      const others = state.evaluations.filter((e) => e.articleId !== action.evaluation.articleId);
      return { ...state, evaluations: [action.evaluation, ...others], journey: { ...state.journey, rated: true, explained: !!action.evaluation.text.trim() || state.journey.explained, contributed: true } };
    }
    case 'removeEvaluation':
      return { ...state, evaluations: state.evaluations.filter((e) => e.id !== action.id) };
    case 'updateUser':
      return { ...state, user: { ...state.user, ...action.patch, demographics: { ...state.user.demographics, ...(action.patch.demographics || {}) } } };
    case 'journey':
      return state.journey[action.step] ? state : { ...state, journey: { ...state.journey, [action.step]: true } };
    case 'reset':
      return initial;
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state]);

  const reputation = useMemo(() => computeReputation(state.evaluations), [state.evaluations]);

  const toast = useCallback((msg, tone = 'default') => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const submitEvaluation = useCallback((ev) => {
    const before = computeReputation(state.evaluations).score;
    const evaluation = { id: `ev-${Date.now()}`, ts: new Date().toISOString(), ...ev };
    const after = computeReputation([evaluation, ...state.evaluations.filter((e) => e.articleId !== ev.articleId)]).score;
    dispatch({ type: 'submitEvaluation', evaluation });
    const q = reasoningQuality(evaluation, getArticle(ev.articleId)).score;
    const delta = after - before;
    toast(`Evaluation recorded · reasoning ${q}/100 · credibility ${delta >= 0 ? '+' : ''}${delta}`, 'success');
    return { before, after, quality: q };
  }, [state.evaluations, toast]);

  const value = useMemo(() => ({
    ...state, reputation, toasts, toast, dispatch, submitEvaluation,
    evalFor: (articleId) => state.evaluations.find((e) => e.articleId === articleId) || null,
    markJourney: (step) => dispatch({ type: 'journey', step }),
  }), [state, reputation, toasts, toast, submitEvaluation]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
