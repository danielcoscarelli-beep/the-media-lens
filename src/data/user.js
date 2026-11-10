// Default local profile. In production this would come from an auth provider + database.
export const defaultUser = {
  username: 'new_reader',
  displayName: 'New Reader',
  joined: '2026-09-14',
  bio: '',
  interests: ['Energy & Infrastructure', 'Economy', 'Technology'],
  demographics: {
    ageRange: '', region: '', education: '', newsHabit: '',
    shareForResearch: false, // opt-in only; never displayed publicly
  },
};

// Seed evaluation history so the profile has a realistic starting point.
// Marked `seeded: true` so the UI can label it as sample history.
export const seedEvaluations = [
  { articleId: 'cnn-fed', rating: 2, reasons: ['emotional', 'context'], text: 'The words "struggling" and "relief" frame the hold as a harm. The article also leaves out that inflation is still above target.', ts: '2026-10-28T19:02:00Z', seeded: true },
  { articleId: 'bbc-methane', rating: 0, reasons: [], text: 'Explains what the pact does and doesn’t do, with sources on both sides.', ts: '2026-10-27T15:40:00Z', seeded: true },
  { articleId: 'fox-chips', rating: 1, reasons: ['loaded'], text: '"Crackdown" implies wrongdoing. Otherwise the article sticks to the rule text.', ts: '2026-10-30T17:15:00Z', seeded: true },
];
