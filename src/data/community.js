// Simulated community activity, used by the homepage feed.
export const RATING_LABELS = ['Neutral', 'Slightly biased', 'Moderately biased', 'Strongly biased'];

export const REASONS = {
  emotional: 'Emotionally charged language',
  selective: 'Selective presentation of facts',
  misleading: 'Misleading framing',
  loaded: 'Loaded or politically charged terminology',
  context: 'Missing context',
  unbalanced: 'Unbalanced representation of perspectives',
  other: 'Other',
};

export const activity = [
  { user: 'datadesk_dan', level: 'Senior Analyst', articleId: 'fox-permitting', rating: 3, reason: 'emotional', mins: 4, note: 'The headline’s "choking" has no attribution.' },
  { user: 'watershed_w', level: 'Analyst', articleId: 'cnn-permitting', rating: 1, reason: 'loaded', mins: 9, note: 'Labeled analysis, and "guts" is attributed to critics.' },
  { user: 'mreyes_reads', level: 'Fellow', articleId: 'nyt-permitting', rating: 1, reason: 'loaded', mins: 15, note: '"Interests" is doing a lot of work.' },
  { user: 'oh_county_clerk', level: 'Contributor', articleId: 'cnn-water', rating: 2, reason: 'misleading', mins: 22, note: 'The advisory doesn’t confirm any threat to treatment.' },
  { user: 'tx_lineman', level: 'Analyst', articleId: 'wsj-permitting', rating: 1, reason: 'context', mins: 31, note: 'The "half" figure needs a source.' },
  { user: 'lena.k', level: 'Senior Analyst', articleId: 'guardian-methane', rating: 2, reason: 'emotional', mins: 47, note: 'Fine for analysis, but "toothless" is a verdict.' },
  { user: 'paralegal_pm', level: 'Analyst', articleId: 'ap-permitting', rating: 0, reason: null, mins: 58, note: 'Both sides named; figures attributed.' },
];

// Simulated "helpful" votes from other readers, keyed by reasoning quality (deterministic).
export const simulatedHelpful = (quality) => Math.max(0, Math.round((quality - 35) / 9));
