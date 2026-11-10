// Default local profile. In production this would come from an auth provider + database.
// The old written-evaluation "sample history" was removed with the 2026-11-10 rating redesign:
// all simulated activity now comes from clearly labeled simulated participants.
export const defaultUser = {
  username: 'new_reader',
  displayName: 'New Reader',
  joined: null, // set on first visit
  bio: '',
  interests: ['Energy & Infrastructure', 'Economy', 'Technology'],
  demographics: {
    ageRange: '', region: '', education: '', newsHabit: '',
    shareForResearch: false, // opt-in only; never displayed publicly
  },
};
