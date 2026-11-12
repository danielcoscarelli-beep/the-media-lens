// Source registry. Every entry is SAMPLE data describing hypothetical documents.
// `url` points to the institution's real homepage only; the specific documents do not exist.
// `type` is what the source is; how a given article *uses* it is recorded on the article.
export const SOURCE_TYPES = {
  document: 'Original document',
  govdata: 'Government data',
  statement: 'Official statement',
  interview: 'Named interview',
  anonymous: 'Anonymous source',
  study: 'Study / research',
  expert: 'Expert commentary',
  outlet: 'Other publication',
};

export const sources = {
  // ── Featured event: Federal Permitting Modernization Act ───────────────
  'rollcall-287': {
    name: 'Senate Roll Call Vote No. 287 (S. 2214)', publisher: 'U.S. Senate', date: '2026-10-29',
    type: 'document', url: 'https://www.senate.gov',
    description: 'Official tally of the vote on final passage: 58 yeas, 41 nays, 1 not voting.',
  },
  'billtext-2214': {
    name: 'S. 2214, Federal Permitting Modernization Act — engrossed text', publisher: 'Congress.gov', date: '2026-10-29',
    type: 'document', url: 'https://www.congress.gov',
    description: 'Full legislative text as passed. Sets a two-year default deadline for environmental impact statements, a 150-day statute of limitations for legal challenges, and "national interest" designation for interstate transmission lines.',
  },
  'cbo-2214': {
    name: 'Cost Estimate for S. 2214', publisher: 'Congressional Budget Office', date: '2026-10-21',
    type: 'govdata', url: 'https://www.cbo.gov',
    description: 'Projects the bill would reduce federal deficits by $1.2 billion over 2027–2036, mainly through fee collections. Does not model broader economic effects.',
  },
  'whitfield-release': {
    name: 'Press release and fact sheet: "Whitfield–Oyelaran Permitting Act Passes Senate"', publisher: 'Office of Sen. Dana Whitfield (R)', date: '2026-10-29',
    type: 'statement', url: 'https://www.senate.gov',
    description: 'Sponsor’s office statement. Asserts the bill will "cut average review times in half." The fact sheet does not describe the method behind this figure.',
  },
  'oyelaran-floor': {
    name: 'Floor remarks of Sen. Marcus Oyelaran (D)', publisher: 'Congressional Record', date: '2026-10-29',
    type: 'interview', url: 'https://www.congress.gov',
    description: 'Co-sponsor’s floor speech arguing faster permitting is needed to build transmission lines for renewable power.',
  },
  'wh-official': {
    name: 'Unnamed senior White House official', publisher: 'Not disclosed', date: '2026-10-29',
    type: 'anonymous', url: null,
    description: 'Quoted without a name in several outlets, saying the President "intends to sign" the bill if the House passes it unchanged. Outlets do not say whether they spoke to the same person.',
  },
  'agc-jobs': {
    name: '"Building the Grid": Construction Employment Effects of Permitting Reform', publisher: 'American Grid Council (utility trade association)', date: '2026-09-14',
    type: 'study', url: null,
    description: 'Industry-funded analysis projecting up to 50,000 construction jobs. Not peer reviewed; assumptions about project completion rates are not published in full.',
  },
  'cpl-analysis': {
    name: 'Bypassing Review: How S. 2214 Narrows Environmental Oversight', publisher: 'Coalition for Public Lands (advocacy group)', date: '2026-10-02',
    type: 'study', url: null,
    description: 'Advocacy analysis estimating that "up to 40%" of major projects could qualify for categorical exclusions. Relies on a broad reading of an undefined term in Sec. 204.',
  },
  'lab-queue': {
    name: 'Interconnection Queue Data, 2026 Edition', publisher: 'U.S. Department of Energy national laboratory', date: '2026-04-30',
    type: 'govdata', url: 'https://www.energy.gov',
    description: 'Reports roughly 2,600 gigawatts of generation and storage awaiting grid connection. Historically most queued projects are never built.',
  },
  'gao-nepa': {
    name: 'Environmental Reviews: Timelines Vary Widely Across Agencies', publisher: 'U.S. Government Accountability Office', date: '2025-06-11',
    type: 'govdata', url: 'https://www.gao.gov',
    description: 'Found median environmental impact statement completion of about 2.2 years with wide variation; noted limited agency data on causes of delay.',
  },
  'marsh-expert': {
    name: 'Prof. Elena Marsh, environmental law', publisher: 'Lakeshore University School of Law', date: '2026-10-29',
    type: 'expert', url: null,
    description: 'Comments that the 150-day litigation window is "the most consequential change" and may push challenges into earlier, less-informed stages.',
  },
  'cho-expert': {
    name: 'Dr. Raymond Cho, energy economist', publisher: 'Midland Energy Policy Institute', date: '2026-10-29',
    type: 'expert', url: null,
    description: 'Says transmission constraints, not permits alone, limit new clean-energy capacity; describes the bill as "necessary but not sufficient."',
  },
  'tribal-statement': {
    name: 'Statement on S. 2214 consultation provisions', publisher: 'National Tribal Lands Association', date: '2026-10-29',
    type: 'statement', url: null,
    description: 'Argues the new 90-day consultation deadline could shortchange government-to-government consultation on projects crossing tribal lands.',
  },
  'speaker-spox': {
    name: 'Statement from the House Speaker’s spokesperson', publisher: 'Office of the Speaker of the House', date: '2026-10-29',
    type: 'statement', url: 'https://www.house.gov',
    description: 'Says the House will "review the Senate bill carefully" and gives no timeline for a vote.',
  },
  'politico-prior': {
    name: 'Earlier report on closed-door permitting negotiations', publisher: 'Politico', date: '2026-10-17',
    type: 'outlet', url: 'https://www.politico.com',
    description: 'Prior reporting describing a trade between transmission provisions sought by Democrats and litigation limits sought by Republicans.',
  },

  // ── Fed rates ──────────────────────────────────────────────────────────
  'fomc-statement': { name: 'FOMC policy statement, October 2026', publisher: 'Federal Reserve Board', date: '2026-10-28', type: 'document', url: 'https://www.federalreserve.gov', description: 'Announces the target range is unchanged; two members dissent in favor of a cut.' },
  'fed-presser': { name: 'Chair’s press conference transcript', publisher: 'Federal Reserve Board', date: '2026-10-28', type: 'interview', url: 'https://www.federalreserve.gov', description: 'Chair describes inflation progress as "real but incomplete."' },
  'bls-cpi': { name: 'Consumer Price Index, September 2026', publisher: 'Bureau of Labor Statistics', date: '2026-10-14', type: 'govdata', url: 'https://www.bls.gov', description: 'Headline CPI up 2.9% year over year; core 3.1%.' },
  'markets-pricing': { name: 'Futures-implied rate probabilities', publisher: 'Exchange data (aggregated)', date: '2026-10-28', type: 'govdata', url: null, description: 'Market pricing of the probability of a December cut. Market data, not a forecast by any agency.' },

  // ── Methane pact ───────────────────────────────────────────────────────
  'pact-text': { name: 'Joint Declaration on Methane Leak Monitoring', publisher: 'Signatory governments (41)', date: '2026-10-27', type: 'document', url: null, description: 'Commits signatories to satellite-verified leak reporting by 2028. Contains no binding penalties.' },
  'iea-methane': { name: 'Global Methane Tracker 2026', publisher: 'International Energy Agency', date: '2026-03-05', type: 'study', url: 'https://www.iea.org', description: 'Estimates energy-sector methane emissions and abatement potential.' },
  'ngo-climate': { name: 'Statement from climate advocacy network', publisher: 'Climate Action Alliance (advocacy)', date: '2026-10-27', type: 'statement', url: null, description: 'Calls the pact "a monitoring promise, not a reduction target."' },

  // ── Chip export rules ──────────────────────────────────────────────────
  'bis-rule': { name: 'Interim final rule: advanced computing export controls', publisher: 'Bureau of Industry and Security, Dept. of Commerce', date: '2026-10-30', type: 'document', url: 'https://www.bis.gov', description: 'Lowers the performance threshold for licensing requirements on AI accelerators.' },
  'semi-assoc': { name: 'Statement from semiconductor industry association', publisher: 'Semiconductor trade association', date: '2026-10-30', type: 'statement', url: null, description: 'Warns the rule could cost U.S. firms market share abroad.' },
  'commerce-anon': { name: 'Unnamed Commerce Department officials', publisher: 'Not disclosed', date: '2026-10-30', type: 'anonymous', url: null, description: 'Described the rule’s intent on background in a briefing call.' },

  // ── Redistricting ruling ───────────────────────────────────────────────
  'court-opinion': { name: 'Majority and dissenting opinions', publisher: 'Pennsylvania Supreme Court', date: '2026-10-26', type: 'document', url: 'https://www.pacourts.us', description: 'Strikes down the congressional map 4–3, ordering a remedial map within 45 days.' },
  'gop-chair': { name: 'State Republican Party chair statement', publisher: 'State Republican Party', date: '2026-10-26', type: 'statement', url: null, description: 'Calls the ruling "judicial overreach."' },
  'dem-chair': { name: 'State Democratic Party chair statement', publisher: 'State Democratic Party', date: '2026-10-26', type: 'statement', url: null, description: 'Calls the ruling "a win for fair representation."' },
  'redistrict-expert': { name: 'Redistricting scholar comment', publisher: 'University election law center', date: '2026-10-26', type: 'expert', url: null, description: 'Notes the remedial timeline is tight ahead of filing deadlines.' },

  // ── Water utility intrusions ───────────────────────────────────────────
  'cisa-advisory': { name: 'Joint cybersecurity advisory on water-sector intrusions', publisher: 'CISA / FBI / EPA', date: '2026-10-30', type: 'govdata', url: 'https://www.cisa.gov', description: 'Reports unauthorized access to operational technology at three utilities; no confirmed changes to water treatment.' },
  'utility-manager': { name: 'Interview with a municipal utility general manager', publisher: 'Named utility official', date: '2026-10-30', type: 'interview', url: null, description: 'Describes switching to manual operations for 36 hours as a precaution.' },
  'intel-anon': { name: 'Officials familiar with the investigation (unnamed)', publisher: 'Not disclosed', date: '2026-10-30', type: 'anonymous', url: null, description: 'Attribute the intrusions to a state-linked group. Not stated in the official advisory.' },

  // ── Baltic cable mission ───────────────────────────────────────────────
  'joint-communique': { name: 'EU–UK joint communiqué on undersea infrastructure', publisher: 'European Council / UK Ministry of Defence', date: '2026-10-29', type: 'document', url: 'https://www.consilium.europa.eu', description: 'Announces patrol mission and shared sensor network.' },
  'nato-spox': { name: 'NATO spokesperson remarks', publisher: 'NATO', date: '2026-10-29', type: 'statement', url: 'https://www.nato.int', description: 'Welcomes the mission and describes coordination arrangements.' },
  'russia-mfa': { name: 'Russian foreign ministry statement', publisher: 'Russian Ministry of Foreign Affairs', date: '2026-10-29', type: 'statement', url: null, description: 'Calls the mission "provocative militarization."' },

  // ── Grid heat wave ─────────────────────────────────────────────────────
  'spcc-alert': { name: 'Energy Emergency Alert and conservation appeal', publisher: 'Southwest Power Coordinating Council (fictional grid operator)', date: '2026-11-05', type: 'document', url: null, description: 'Asks customers to reduce use from 3 to 8 p.m.; cites record demand, lower-than-forecast wind output and two unplanned gas-plant outages.' },
  'nws-records': { name: 'Daily temperature records', publisher: 'National Weather Service', date: '2026-11-05', type: 'govdata', url: 'https://www.weather.gov', description: 'Lists record highs set at 14 stations in the region.' },
  'legislator-renewables': { name: 'State legislator’s statement on renewable mandates', publisher: 'Office of a state senator', date: '2026-11-05', type: 'statement', url: null, description: 'Argues renewable mandates left the grid short of reliable capacity.' },
  'climate-scientist': { name: 'Climate scientist comment on late-season heat', publisher: 'University climate research center', date: '2026-11-05', type: 'expert', url: null, description: 'Says warming makes heat waves like this more likely; does not attribute this specific event.' },
  'price-data': { name: 'Real-time wholesale power prices', publisher: 'Grid market data (aggregated)', date: '2026-11-05', type: 'govdata', url: null, description: 'Shows prices briefly reaching the market cap during the evening peak.' },

  // ── Transit strike ─────────────────────────────────────────────────────
  'lrta-statement': { name: 'Transit authority statement and final contract offer', publisher: 'Lakeshore Regional Transit Authority (fictional)', date: '2026-11-06', type: 'statement', url: null, description: 'Describes a 9% raise over three years and cites a $140 million operating deficit.' },
  'union-statement': { name: 'Union strike announcement', publisher: 'Amalgamated Rail and Transit Workers Local 412 (fictional)', date: '2026-11-06', type: 'statement', url: null, description: 'Cites unfilled safety positions and a rise in reported on-the-job injuries.' },
  'injury-reports': { name: 'Workplace injury filings, past two years', publisher: 'State occupational safety agency', date: '2026-11-01', type: 'govdata', url: null, description: 'Shows reported injuries at the authority rose 18% over two years.' },
  'rider-interview': { name: 'Interview with a commuter', publisher: 'Named rider', date: '2026-11-06', type: 'interview', url: null, description: 'Describes a two-hour commute on replacement buses.' },

  // ── AI hiring law ──────────────────────────────────────────────────────
  'hiring-bill': { name: 'Automated Employment Decision Tools Accountability Act — passed text', publisher: 'State legislature', date: '2026-11-07', type: 'document', url: null, description: 'Requires annual independent bias audits of automated hiring tools, public audit summaries and notice to applicants.' },
  'business-council': { name: 'Business council statement and cost estimate', publisher: 'State Business Council (industry group)', date: '2026-11-07', type: 'statement', url: null, description: 'Estimates audits could cost employers $20,000–$75,000 per tool per year. Method not published.' },
  'hiring-study': { name: 'Study of résumé-screening tools', publisher: 'University computer science department', date: '2026-06-12', type: 'study', url: null, description: 'Peer-reviewed audit finding that two commercial screening tools ranked equally qualified applicants differently by inferred gender.' },
  'sponsor-delgado': { name: 'Floor remarks of the bill’s sponsor, Assemblymember Rosa Delgado', publisher: 'State Assembly record', date: '2026-11-07', type: 'interview', url: null, description: 'Says applicants should know when software is judging them.' },
  'governor-spox': { name: 'Governor’s spokesperson', publisher: 'Office of the Governor', date: '2026-11-07', type: 'statement', url: null, description: 'Says the governor will review the bill; no position given.' },
};

export const getSource = (id) => (sources[id] ? { id, ...sources[id] } : null);
