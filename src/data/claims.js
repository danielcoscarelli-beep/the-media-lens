// Claim registry. A "status" here describes the SOURCING available in the sample record.
// It is not a verdict that a claim is true or false; nothing here has been independently fact-checked.
export const CLAIM_STATUS = {
  documented: { label: 'Matches cited primary record', tone: 'good', help: 'The claim can be traced to an original document or dataset that says the same thing.' },
  attributed: { label: 'Attributed, not corroborated', tone: 'info', help: 'The article says who made the claim, but no independent evidence is offered.' },
  projection: { label: 'Projection — assumption-dependent', tone: 'warn', help: 'A forecast or estimate. Its reliability depends on the method and assumptions behind it.' },
  contested: { label: 'Contested by other evidence', tone: 'alert', help: 'Other documented sources point in a different direction or limit the claim.' },
  unsupported: { label: 'No source given', tone: 'muted', help: 'The article states the claim without saying where it came from.' },
};

export const CLAIM_KIND = {
  factual: 'Factual claim',
  projection: 'Projection',
  interpretation: 'Interpretation',
  opinion: 'Opinion',
};

export const claims = {
  // ── Featured event ─────────────────────────────────────────────────────
  'vote-tally': {
    text: 'The Senate passed the bill 58–41.', kind: 'factual', status: 'documented', source: 'rollcall-287', corroboratedBy: ['billtext-2214'],
    evidence: 'Official roll call record lists 58 yeas and 41 nays, with one senator not voting.',
    limitations: 'None material. Outlets differ only in whether they name the nine Democrats who voted yes.',
  },
  'review-halved': {
    text: 'The bill will cut average environmental review times roughly in half.', kind: 'projection', status: 'projection', source: 'whitfield-release', corroboratedBy: [],
    evidence: 'Appears in the sponsor’s fact sheet. No methodology is published.',
    limitations: 'A GAO review found review timelines vary widely by agency and that data on the causes of delay is limited, so the baseline for "half" is unclear. Four outlets repeat this figure; all trace it to the same press release.',
    contradicts: ['gao-nepa'],
  },
  'deficit-1-2b': {
    text: 'The bill would reduce federal deficits by about $1.2 billion over ten years.', kind: 'projection', status: 'documented', source: 'cbo-2214', corroboratedBy: [],
    evidence: 'CBO cost estimate, Table 1.',
    limitations: 'CBO estimates are projections under current law. This one does not model the economic effects of faster construction, which both supporters and critics emphasize.',
  },
  'litigation-150': {
    text: 'The bill shortens the window to sue over project approvals from six years to 150 days.', kind: 'factual', status: 'documented', source: 'billtext-2214', corroboratedBy: [],
    evidence: 'Sec. 311 of the engrossed bill text.',
    limitations: 'The six-year figure is the general federal default; some statutes already set shorter windows, so the practical change varies by project type.',
  },
  'jobs-50k': {
    text: 'The bill could create up to 50,000 construction jobs.', kind: 'projection', status: 'contested', source: 'agc-jobs', corroboratedBy: [],
    evidence: 'Industry-funded analysis by a utility trade association.',
    limitations: 'Not peer reviewed. Assumes most queued projects get built, while national laboratory data shows most queued projects historically are withdrawn. "Up to" marks an upper bound, not an expected value.',
    contradicts: ['lab-queue'],
  },
  'bypass-40': {
    text: 'Up to 40% of major projects could skip full environmental review.', kind: 'projection', status: 'contested', source: 'cpl-analysis', corroboratedBy: [],
    evidence: 'Advocacy group analysis of Sec. 204 categorical exclusions.',
    limitations: 'Relies on a broad reading of the undefined phrase "substantially similar activities." Agencies have not issued implementing guidance. "Up to" marks an upper bound.',
    contradicts: ['billtext-2214'],
  },
  'president-sign': {
    text: 'The President intends to sign the bill if the House passes it unchanged.', kind: 'factual', status: 'attributed', source: 'wh-official', corroboratedBy: [],
    evidence: 'Unnamed official quoted in three outlets.',
    limitations: 'No on-record White House statement. Outlets do not say whether they spoke with the same person, so the repetition is not independent confirmation.',
  },
  'house-uncertain': {
    text: 'The bill faces an uncertain path in the House.', kind: 'interpretation', status: 'attributed', source: 'speaker-spox', corroboratedBy: ['politico-prior'],
    evidence: 'The Speaker’s office gave no timeline and said the House would "review the bill carefully."',
    limitations: 'Reasonable reading of the statement, but "uncertain" is the reporter’s characterization, not a quote.',
  },
  'queue-2600': {
    text: 'About 2,600 gigawatts of projects are waiting to connect to the grid.', kind: 'factual', status: 'documented', source: 'lab-queue', corroboratedBy: [],
    evidence: 'National laboratory queue dataset, 2026 edition.',
    limitations: 'The queue includes many speculative applications. Most queued capacity historically is never built.',
  },
  'tribal-weakened': {
    text: 'Tribal nations say the bill weakens consultation requirements.', kind: 'interpretation', status: 'attributed', source: 'tribal-statement', corroboratedBy: ['billtext-2214'],
    evidence: 'The bill adds a 90-day deadline for consultation (Sec. 207). Whether that "weakens" consultation is a matter of interpretation.',
    limitations: 'The text confirms the deadline; it does not settle whether the deadline is harmful. Supporters argue it prevents indefinite delays.',
  },
  'rare-coalition': {
    text: 'The vote reflects a rare alliance between clean-energy advocates and fossil-fuel producers.', kind: 'interpretation', status: 'attributed', source: 'politico-prior', corroboratedBy: ['oyelaran-floor'],
    evidence: 'Supported by the vote breakdown and statements from both industries.',
    limitations: 'Characterization by the reporter. Several clean-energy groups opposed the bill.',
  },
  'guts-protections': {
    text: 'The deal "guts" key environmental protections.', kind: 'opinion', status: 'attributed', source: 'cpl-analysis', corroboratedBy: [],
    evidence: 'Quoted characterization from advocacy groups opposed to the bill.',
    limitations: 'An evaluative judgment rather than a checkable fact. Appears in the headline of an article labeled Analysis.',
  },
  'red-tape-choking': {
    text: 'Red tape is "choking" American energy projects.', kind: 'opinion', status: 'unsupported', source: null, corroboratedBy: [],
    evidence: 'Stated in the headline without attribution.',
    limitations: 'Evaluative framing. The body cites GAO timelines only indirectly and does not mention their variation.',
  },

  // ── Other events (lighter profiles) ────────────────────────────────────
  'fed-hold': { text: 'The Fed left its target range unchanged.', kind: 'factual', status: 'documented', source: 'fomc-statement', corroboratedBy: [], evidence: 'FOMC statement.', limitations: 'None material.' },
  'fed-dissent': { text: 'Two officials dissented in favor of a cut.', kind: 'factual', status: 'documented', source: 'fomc-statement', corroboratedBy: [], evidence: 'Voting record in the statement.', limitations: 'None material.' },
  'cut-december': { text: 'Markets now expect a December cut.', kind: 'interpretation', status: 'projection', source: 'markets-pricing', corroboratedBy: [], evidence: 'Futures-implied probabilities.', limitations: 'Market pricing shifts daily and is not a Fed commitment.' },
  'methane-signed': { text: '41 countries signed the monitoring pact.', kind: 'factual', status: 'documented', source: 'pact-text', corroboratedBy: [], evidence: 'Signatory list.', limitations: 'Several of the largest emitters did not sign.' },
  'methane-no-penalty': { text: 'The pact contains no binding penalties.', kind: 'factual', status: 'documented', source: 'pact-text', corroboratedBy: ['ngo-climate'], evidence: 'Declaration text.', limitations: 'Voluntary pacts can still shape national rules.' },
  'chip-threshold': { text: 'The rule lowers the performance threshold for export licenses.', kind: 'factual', status: 'documented', source: 'bis-rule', corroboratedBy: [], evidence: 'Federal Register text.', limitations: 'Technical thresholds are complex; summaries simplify.' },
  'chip-market-share': { text: 'The rule could cost U.S. firms billions in sales.', kind: 'projection', status: 'attributed', source: 'semi-assoc', corroboratedBy: [], evidence: 'Industry association statement.', limitations: 'Estimate from an affected party; no method published.' },
  'map-struck': { text: 'The court struck down the map 4–3.', kind: 'factual', status: 'documented', source: 'court-opinion', corroboratedBy: [], evidence: 'Published opinion.', limitations: 'None material.' },
  'map-overreach': { text: 'The ruling is judicial overreach.', kind: 'opinion', status: 'attributed', source: 'gop-chair', corroboratedBy: [], evidence: 'Party statement.', limitations: 'Partisan characterization.' },
  'water-access': { text: 'Hackers accessed control systems at three utilities.', kind: 'factual', status: 'documented', source: 'cisa-advisory', corroboratedBy: ['utility-manager'], evidence: 'Joint advisory.', limitations: 'Advisory reports no confirmed changes to treatment.' },
  'water-state-actor': { text: 'A state-linked group carried out the intrusions.', kind: 'factual', status: 'attributed', source: 'intel-anon', corroboratedBy: [], evidence: 'Unnamed officials.', limitations: 'Not stated in the official advisory. Attribution may change.' },
  'cable-mission': { text: 'The EU and UK will run joint patrols to protect undersea cables.', kind: 'factual', status: 'documented', source: 'joint-communique', corroboratedBy: ['nato-spox'], evidence: 'Joint communiqué.', limitations: 'Mission size and rules of engagement not disclosed.' },
  // ── Added 2026-11-12 ───────────────────────────────────────────────────
  'grid-appeal': { text: 'The grid operator asked customers to cut electricity use during the evening peak.', kind: 'factual', status: 'documented', source: 'spcc-alert', corroboratedBy: [], evidence: 'Operator alert.', limitations: 'None material.' },
  'grid-renewables-blame': { text: 'Green energy failures caused the shortfall.', kind: 'opinion', status: 'contested', source: 'legislator-renewables', corroboratedBy: [], evidence: 'Legislator’s statement.', limitations: 'The operator cited low wind output and two gas-plant outages; it did not assign primary blame to either.', contradicts: ['spcc-alert'] },
  'grid-climate': { text: 'Climate change made the heat wave more likely.', kind: 'interpretation', status: 'attributed', source: 'climate-scientist', corroboratedBy: [], evidence: 'Expert comment.', limitations: 'No formal attribution study of this event exists.' },
  'transit-halted': { text: 'Commuter rail service stopped after workers walked out.', kind: 'factual', status: 'documented', source: 'lrta-statement', corroboratedBy: ['union-statement'], evidence: 'Statements from both sides.', limitations: 'None material.' },
  'transit-injuries': { text: 'Reported injuries at the authority rose 18% in two years.', kind: 'factual', status: 'documented', source: 'injury-reports', corroboratedBy: ['union-statement'], evidence: 'State injury filings.', limitations: 'Reporting rates may have changed over the period.' },
  'hiring-audits': { text: 'The bill requires annual independent bias audits of automated hiring tools.', kind: 'factual', status: 'documented', source: 'hiring-bill', corroboratedBy: [], evidence: 'Bill text.', limitations: 'Audit standards would be set later by regulation.' },
  'hiring-cost': { text: 'Audits could cost employers up to $75,000 per tool each year.', kind: 'projection', status: 'attributed', source: 'business-council', corroboratedBy: [], evidence: 'Industry estimate.', limitations: 'Upper bound from an affected party; method not published.' },
};

export const getClaim = (id) => (claims[id] ? { id, ...claims[id] } : null);
