// News events group related articles. `date` is the event's ORIGINAL sample date; it is used only to
// shift sample source-document dates (lib/schedule.js). Displayed publication times come from the schedule.
// News events group related articles. `comparison` holds editor-written summaries for each
// of the six comparison dimensions. Per-outlet detail is derived from the article records.
export const TOPICS = ['Elections', 'International Affairs', 'Economy', 'Technology', 'Climate', 'National Security', 'Energy & Infrastructure'];

export const events = [
  {
    id: 'permitting-act',
    featured: true,
    title: 'Senate passes the Federal Permitting Modernization Act',
    topic: 'Energy & Infrastructure',
    date: '2026-10-29',
    summary: 'The Senate voted 58–41 to set deadlines on federal environmental reviews, shorten the window for legal challenges and speed up approval of interstate transmission lines. The bill now goes to the House.',
    people: ['Dana Whitfield', 'Marcus Oyelaran', 'Elena Marsh', 'Raymond Cho'],
    orgs: ['U.S. Senate', 'Congressional Budget Office', 'American Grid Council', 'Coalition for Public Lands', 'National Tribal Lands Association', 'White House'],
    tags: ['permitting', 'NEPA', 'environmental review', 'transmission', 'Congress', 'Senate', 'energy', 'infrastructure', 'bill', 'vote', 'lawsuits'],
    totalOutlets: 14,
    comparison: {
      headline: 'All six headlines report passage, but they describe its meaning differently: as a procedural step (AP, Reuters), a legal change (WSJ), an unusual coalition (NYT), a deregulatory win (Fox) or an environmental loss (CNN).',
      language: 'The most charged words appear in the Fox and CNN headlines: "slash," "choking" and "guts." CNN attributes "guts" to critics; Fox states "choking" without attribution. Wire copy uses "approves" and "passes."',
      facts: 'Every outlet reports the vote count. Wires and WSJ lead with what the bill does. NYT and CNN put climate effects higher. Fox leads with project delays and the jobs estimate.',
      perspectives: 'AP and Reuters quote supporters and opponents in similar proportion. Fox quotes mostly supporters; CNN quotes mostly opponents. Only NYT and CNN include tribal nations; only AP cites the GAO data on how long reviews actually take.',
      omissions: 'Fox does not mention the advocacy analysis of exclusions; CNN does not mention the CBO deficit estimate or the transmission provisions sought by Democrats. Four outlets repeat the "cut review times in half" figure without noting it comes only from the sponsor’s release.',
      opinion: 'CNN’s piece is labeled Analysis, and its headline carries an evaluative judgment. The other five are news reports. NYT’s "rare shared win" is interpretive, but the body supports it with vote data and quotes from both sides.',
    },
  },
  {
    id: 'fed-holds',
    title: 'Federal Reserve holds rates steady, signals patience on cuts',
    topic: 'Economy', date: '2026-10-28',
    summary: 'The Fed left its benchmark range unchanged for a second meeting. Two officials dissented in favor of a cut.',
    people: ['Fed Chair'], orgs: ['Federal Reserve', 'Bureau of Labor Statistics'],
    tags: ['interest rates', 'inflation', 'Fed', 'FOMC', 'monetary policy', 'economy'], totalOutlets: 22,
    comparison: {
      headline: 'Financial outlets frame the decision around market expectations; general outlets frame it around borrowing costs for households.',
      language: 'Mostly measured. One headline uses "defies," implying the Fed was obligated to act.',
      facts: 'All report the hold; emphasis differs between the dissents and the Chair’s comments.',
      perspectives: 'Economists and traders dominate. Few outlets quote borrowers.',
      omissions: 'Some coverage omits that inflation remains above the 2% target.',
      opinion: 'All four are news reports.',
    },
  },
  {
    id: 'methane-pact',
    title: '41 nations sign methane leak monitoring pact',
    topic: 'Climate', date: '2026-10-27',
    summary: 'Signatories commit to satellite-verified methane leak reporting by 2028. The declaration has no binding penalties, and several major emitters did not join.',
    people: [], orgs: ['International Energy Agency', 'Climate Action Alliance'],
    tags: ['methane', 'climate', 'emissions', 'oil and gas', 'diplomacy', 'satellites'], totalOutlets: 17,
    comparison: {
      headline: 'Framed as progress (Reuters, BBC), insufficient (Guardian) or costly for producers (WSJ).',
      language: 'The Guardian headline says "toothless"; the WSJ headline says "burden."',
      facts: 'Coverage differs on whether to lead with signatories or with non-signatories.',
      perspectives: 'Advocacy groups and industry both appear, with different weight.',
      omissions: 'Few outlets explain how satellite verification works.',
      opinion: 'The Guardian piece is labeled Analysis.',
    },
  },
  {
    id: 'chip-exports',
    title: 'Commerce Department tightens export rules on AI chips',
    topic: 'Technology', date: '2026-10-30',
    summary: 'A new interim rule lowers the performance threshold that triggers export licensing for AI accelerators.',
    people: [], orgs: ['Department of Commerce', 'Bureau of Industry and Security'],
    tags: ['AI', 'semiconductors', 'chips', 'export controls', 'China', 'trade', 'technology'], totalOutlets: 19,
    comparison: {
      headline: 'Security framing (Fox, NYT) versus commercial framing (Bloomberg, Reuters).',
      language: 'Fox uses "crackdown"; others use "tightens" or "expands."',
      facts: 'Financial outlets emphasize affected company revenue.',
      perspectives: 'Unnamed officials appear in three of four articles.',
      omissions: 'Few explain the technical threshold.',
      opinion: 'All four are news reports.',
    },
  },
  {
    id: 'pa-map',
    title: 'Pennsylvania Supreme Court strikes down congressional map',
    topic: 'Elections', date: '2026-10-26',
    summary: 'In a 4–3 ruling, the court ordered a remedial congressional map within 45 days.',
    people: [], orgs: ['Pennsylvania Supreme Court'],
    tags: ['redistricting', 'gerrymandering', 'courts', 'elections', 'congressional map', 'Pennsylvania'], totalOutlets: 12,
    comparison: {
      headline: 'Two headlines include partisan reactions; two describe the ruling only.',
      language: '"Overreach" and "fair maps" appear only inside quotation marks.',
      facts: 'All report the 4–3 split and the 45-day deadline.',
      perspectives: 'Both party chairs are quoted in three of four outlets.',
      omissions: 'The dissent’s reasoning is rarely summarized.',
      opinion: 'All four are news reports.',
    },
  },
  {
    id: 'water-cyber',
    title: 'Hackers breached control systems at three U.S. water utilities, CISA says',
    topic: 'National Security', date: '2026-10-30',
    summary: 'A joint federal advisory reports unauthorized access to operational technology at three municipal utilities. No changes to water treatment were confirmed.',
    people: [], orgs: ['CISA', 'FBI', 'EPA'],
    tags: ['cybersecurity', 'water', 'infrastructure', 'hacking', 'CISA', 'national security'], totalOutlets: 15,
    comparison: {
      headline: 'Ranges from procedural ("CISA says") to alarming ("threatens drinking water").',
      language: '"Threatens" implies a risk the advisory does not confirm.',
      facts: 'Attribution to a state-linked group comes only from unnamed officials.',
      perspectives: 'One outlet interviews a utility manager; the others rely on the advisory.',
      omissions: 'Several omit that no water treatment changes were confirmed.',
      opinion: 'All four are news reports.',
    },
  },
  {
    id: 'baltic-cables',
    title: 'EU and UK launch joint mission to protect Baltic undersea cables',
    topic: 'International Affairs', date: '2026-10-29',
    summary: 'European governments announced naval patrols and a shared sensor network after a series of cable outages.',
    people: [], orgs: ['European Council', 'UK Ministry of Defence', 'NATO'],
    tags: ['Baltic', 'undersea cables', 'NATO', 'Europe', 'Russia', 'defense', 'infrastructure'], totalOutlets: 13,
    comparison: {
      headline: 'Some name Russia in the headline; others do not.',
      language: '"Sabotage" is used by two outlets although investigations are ongoing.',
      facts: 'Mission scope is reported consistently.',
      perspectives: 'The Russian statement appears in two of four.',
      omissions: 'Investigations into the earlier outages are unresolved.',
      opinion: 'All four are news reports.',
    },
  },
];

export const getEvent = (id) => events.find((e) => e.id === id) || null;
export const featuredEvent = events.find((e) => e.featured);
