// SAMPLE ARTICLES — hypothetical coverage written for this prototype.
// None of these headlines or stories were published by the named outlets.
//
// id      = opaque public id used in URLs. It must never reveal the outlet (blind rating).
// ref     = internal, human-readable reference for developers. Never render it.
// body    = article text (see articleBodies.js), attached below.
// crowd   = parameters for the SIMULATED participants (services/community.js):
//           center = typical rating 1–100, spread = how much simulated raters disagree,
//           traffic = relative share of simulated participants who rate it (0–1).
// Publication time and the 24-hour rating window come from lib/schedule.js, not from this file.

import { BODIES } from './articleBodies.js';

const featured = [
  {
    id: 'kxfv', ref: 'ap-permitting', eventId: 'permitting-act', pub: 'ap', author: 'Jordan Ellery', label: 'News',
    headline: 'Senate approves bill to speed permits for energy projects, sending it to House',
    dek: 'The Senate voted 58–41 for a bipartisan bill that sets deadlines for environmental reviews and limits the time to file lawsuits. Supporters say it will speed construction of power lines and pipelines; opponents say it reduces public oversight.',
    crowd: { center: 88, spread: 22, traffic: 0.89 },
    image: { motif: 'capitol' },
  },
  {
    id: '5z2s', ref: 'reuters-permitting', eventId: 'permitting-act', pub: 'reuters', author: 'Priya Natarajan', label: 'News',
    headline: 'US Senate passes energy permitting reform in 58-41 vote',
    dek: 'The bill would set two-year deadlines on most federal environmental reviews and speed approvals for interstate transmission lines. Utility shares rose modestly after the vote.',
    crowd: { center: 88, spread: 21, traffic: 0.78 },
    image: { motif: 'grid' },
  },
  {
    id: '2ynm', ref: 'wsj-permitting', eventId: 'permitting-act', pub: 'wsj', author: 'Catherine Doyle', label: 'News',
    headline: 'Senate Passes Permitting Bill Limiting Lawsuits Against Infrastructure Projects',
    dek: 'The measure would cut the window to challenge federal approvals from six years to 150 days, a change business groups have sought for more than a decade.',
    crowd: { center: 81, spread: 25, traffic: 0.81 },
    image: { motif: 'gavel' },
  },
  {
    id: 'fum9', ref: 'nyt-permitting', eventId: 'permitting-act', pub: 'nyt', author: 'Samuel Okafor', label: 'News',
    headline: 'Senate Passes Permitting Overhaul, Handing Clean-Energy Backers and Fossil Fuel Interests a Rare Shared Win',
    dek: 'The bill would speed approval of both power lines and pipelines, an unusual pairing that split environmental groups and drew support from nine Democrats.',
    crowd: { center: 74, spread: 27, traffic: 0.81 },
    image: { motif: 'turbine' },
  },
  {
    id: 'h4mu', ref: 'fox-permitting', eventId: 'permitting-act', pub: 'fox', author: 'Brett Lancaster', label: 'News',
    headline: 'Senate Clears Bill to Slash Red Tape Choking American Energy Projects',
    dek: 'Lawmakers passed a bipartisan measure aimed at ending years-long delays for pipelines, power plants and transmission lines. Supporters say it could add tens of thousands of construction jobs.',
    crowd: { center: 46, spread: 28, traffic: 1.0 },
    image: { motif: 'pipeline' },
  },
  {
    id: 'upue', ref: 'cnn-permitting', eventId: 'permitting-act', pub: 'cnn', author: 'Alicia Moreno', label: 'Analysis',
    headline: 'Analysis: Senate’s Permitting Deal Guts Key Environmental Protections, Critics Warn',
    dek: 'Environmental and tribal groups say the bill would let some major projects skip full review and leave communities near pipelines with less time to go to court.',
    crowd: { center: 51, spread: 29, traffic: 0.94 },
    image: { motif: 'river' },
  },
];

// Articles for the other events.
const mk = (o) => ({ label: 'News', ...o });

const others = [
  // Fed
  mk({ id: '99nz', ref: 'bbg-fed', eventId: 'fed-holds', pub: 'bloomberg', author: 'Helena Marsh-Yu', headline: 'Fed Holds Rates as Two Officials Dissent in Favor of Cut', dek: 'The split vote suggests growing pressure inside the Fed to ease policy as inflation cools.', crowd: { center: 93, spread: 18, traffic: 0.26 }, image: { motif: 'chart' } }),
  mk({ id: 'vr2p', ref: 'wsj-fed', eventId: 'fed-holds', pub: 'wsj', author: 'Nick Arden', headline: 'Fed Signals Patience on Rate Cuts Despite Cooling Inflation', dek: 'The Chair said progress on inflation was "real but incomplete."', crowd: { center: 90, spread: 20, traffic: 0.24 }, image: { motif: 'chart' } }),
  mk({ id: '52hf', ref: 'cnn-fed', eventId: 'fed-holds', pub: 'cnn', author: 'Rita Banerjee', headline: 'Fed Again Holds Off on Rate Relief for Struggling Borrowers', dek: 'Credit-card and auto-loan rates will stay high for now.', crowd: { center: 68, spread: 28, traffic: 0.23 }, image: { motif: 'chart' } }),
  mk({ id: 'vysu', ref: 'fox-fed', eventId: 'fed-holds', pub: 'fox', author: 'Megan Stroud', headline: 'Federal Reserve Keeps Interest Rates Unchanged, Two Members Push for Cut', dek: 'The central bank held its benchmark range steady for a second straight meeting.', crowd: { center: 94, spread: 17, traffic: 0.23 }, image: { motif: 'chart' } }),
  // Methane
  mk({ id: 'ge9f', ref: 'reuters-methane', eventId: 'methane-pact', pub: 'reuters', author: 'Oskar Lind', headline: '41 countries sign pact on satellite monitoring of methane leaks', dek: 'Signatories commit to verified reporting by 2028.', crowd: { center: 93, spread: 18, traffic: 0.18 }, image: { motif: 'globe' } }),
  mk({ id: 'gj2c', ref: 'guardian-methane', eventId: 'methane-pact', pub: 'guardian', author: 'Fiona Achebe', label: 'Analysis', headline: 'Toothless methane pact lets world’s biggest emitters off the hook', dek: 'The declaration has no penalties, and several major producers declined to sign.', crowd: { center: 52, spread: 29, traffic: 0.23 }, image: { motif: 'globe' } }),
  mk({ id: 'ck8s', ref: 'bbc-methane', eventId: 'methane-pact', pub: 'bbc', author: 'Tom Hargreaves', headline: 'Methane pact: What the new monitoring deal does and doesn’t do', dek: 'An explainer on the pledge, its satellites and its limits.', crowd: { center: 95, spread: 16, traffic: 0.2 }, image: { motif: 'globe' } }),
  mk({ id: 'bcfz', ref: 'wsj-methane', eventId: 'methane-pact', pub: 'wsj', author: 'Grant Whelan', headline: 'Methane Pact Adds New Reporting Burden for Oil and Gas Producers', dek: 'Producers in signatory countries face satellite-verified reporting.', crowd: { center: 75, spread: 26, traffic: 0.2 }, image: { motif: 'globe' } }),
  // Chips
  mk({ id: '399p', ref: 'reuters-chips', eventId: 'chip-exports', pub: 'reuters', author: 'Daniel Huang', headline: 'US tightens export rules on advanced AI chips', dek: 'A Commerce rule lowers the performance threshold for licensing.', crowd: { center: 94, spread: 17, traffic: 0.19 }, image: { motif: 'chip' } }),
  mk({ id: 'xhs7', ref: 'nyt-chips', eventId: 'chip-exports', pub: 'nyt', author: 'Lauren Pike', headline: 'U.S. Widens Curbs on A.I. Chips in Bid to Slow China’s Military Advances', dek: 'Officials described the rule as a response to evolving security risks.', crowd: { center: 84, spread: 23, traffic: 0.18 }, image: { motif: 'chip' } }),
  mk({ id: 'fcgu', ref: 'fox-chips', eventId: 'chip-exports', pub: 'fox', author: 'Kyle Benton', headline: 'Commerce Department Announces Crackdown on AI Chip Exports to China', dek: 'New licensing thresholds take effect in 30 days.', crowd: { center: 80, spread: 25, traffic: 0.19 }, image: { motif: 'chip' } }),
  mk({ id: '7rqc', ref: 'bbg-chips', eventId: 'chip-exports', pub: 'bloomberg', author: 'Mira Castellanos', headline: 'Chipmakers Face Billions in Lost Sales Under New US Export Rule', dek: 'Industry groups warn of lost market share abroad.', crowd: { center: 79, spread: 25, traffic: 0.06 }, image: { motif: 'chip' } }),
  // PA map
  mk({ id: 'w3e4', ref: 'politico-map', eventId: 'pa-map', pub: 'politico', author: 'Ben Szymanski', headline: 'Pennsylvania high court tosses congressional map, orders redraw in 45 days', dek: 'The 4–3 ruling could reshape several competitive districts.', crowd: { center: 92, spread: 19, traffic: 0.16 }, image: { motif: 'map' } }),
  mk({ id: 'acjn', ref: 'npr-map', eventId: 'pa-map', pub: 'npr', author: 'Alana Brooks', headline: 'Pennsylvania Supreme Court strikes down congressional map in 4-3 decision', dek: 'Both parties reacted sharply; a new map is due in 45 days.', crowd: { center: 92, spread: 18, traffic: 0.18 }, image: { motif: 'map' } }),
  mk({ id: 'e7g2', ref: 'fox-map', eventId: 'pa-map', pub: 'fox', author: 'Dale Kimura', headline: 'Republicans Decry ‘Judicial Overreach’ After Court Tosses Pennsylvania Map', dek: 'GOP leaders say the court usurped the legislature’s role.', crowd: { center: 71, spread: 27, traffic: 0.19 }, image: { motif: 'map' } }),
  mk({ id: '4ske', ref: 'wapo-map', eventId: 'pa-map', pub: 'wapo', author: 'Corinne Vale', headline: 'Pennsylvania court hands Democrats a win in redistricting fight', dek: 'The ruling could help Democrats in two swing districts.', crowd: { center: 73, spread: 27, traffic: 0.18 }, image: { motif: 'map' } }),
  // Water
  mk({ id: 'cgbv', ref: 'ap-water', eventId: 'water-cyber', pub: 'ap', author: 'Marcus Feld', headline: 'Hackers accessed control systems at 3 US water utilities, federal agencies say', dek: 'No changes to water treatment were confirmed, according to the advisory.', crowd: { center: 95, spread: 16, traffic: 0.17 }, image: { motif: 'water' } }),
  mk({ id: '7kva', ref: 'cnn-water', eventId: 'water-cyber', pub: 'cnn', author: 'Jenna Holt', headline: 'Foreign Hackers Threaten America’s Drinking Water, Officials Say', dek: 'Officials familiar with the probe point to a state-linked group.', crowd: { center: 62, spread: 29, traffic: 0.2 }, image: { motif: 'water' } }),
  mk({ id: '5wma', ref: 'fox-water', eventId: 'water-cyber', pub: 'fox', author: 'Ray Jensen', headline: 'Feds Warn Water Utilities After Hackers Breach Three Systems', dek: 'CISA urged utilities to change default passwords.', crowd: { center: 93, spread: 18, traffic: 0.16 }, image: { motif: 'water' } }),
  mk({ id: '7rg3', ref: 'nyt-water', eventId: 'water-cyber', pub: 'nyt', author: 'Ian Corbell', headline: 'Breaches at Water Utilities Expose Gaps in Small-Town Cyberdefenses', dek: 'Many small utilities lack dedicated security staff, the advisory notes.', crowd: { center: 91, spread: 19, traffic: 0.16 }, image: { motif: 'water' } }),
  // Baltic
  mk({ id: 'h3xr', ref: 'bbc-baltic', eventId: 'baltic-cables', pub: 'bbc', author: 'Eleanor Firth', headline: 'EU and UK launch Baltic patrol mission to protect undersea cables', dek: 'The move follows several unexplained cable outages.', crowd: { center: 95, spread: 16, traffic: 0.15 }, image: { motif: 'sea' } }),
  mk({ id: 'p6f4', ref: 'reuters-baltic', eventId: 'baltic-cables', pub: 'reuters', author: 'Annika Rask', headline: 'Europe steps up Baltic cable protection; Moscow calls move provocative', dek: 'Both sides’ statements included.', crowd: { center: 92, spread: 19, traffic: 0.15 }, image: { motif: 'sea' } }),
  mk({ id: 'zrgr', ref: 'guardian-baltic', eventId: 'baltic-cables', pub: 'guardian', author: 'Owen Tierney', headline: 'Europe moves to shield vital Baltic cables amid fears of Russian interference', dek: 'Officials have not formally attributed recent outages.', crowd: { center: 85, spread: 23, traffic: 0.15 }, image: { motif: 'sea' } }),
  mk({ id: 'azja', ref: 'fox-baltic', eventId: 'baltic-cables', pub: 'fox', author: 'Sean Whitlock', headline: 'Europe Deploys Warships After Suspected Russian Sabotage of Undersea Cables', dek: 'Investigations into the outages are ongoing.', crowd: { center: 68, spread: 28, traffic: 0.17 }, image: { motif: 'sea' } }),
  // Grid heat wave (added 2026-11-12)
  mk({ id: 'g4tg', ref: 'reuters-grid', eventId: 'grid-heat', pub: 'reuters', author: 'Tomás Ibarra', headline: 'Southwest grid operator issues emergency conservation appeal amid record heat', dek: 'Rolling outages were avoided as customers cut use during the evening peak.', crowd: { center: 93, spread: 17, traffic: 0.55 }, image: { motif: 'grid' } }),
  mk({ id: 'p527', ref: 'fox-grid', eventId: 'grid-heat', pub: 'fox', author: 'Colby Rhodes', headline: 'Green Energy Failures Push Grid to the Brink as Heat Wave Bakes Southwest', dek: 'A state senator says renewable mandates left the region short of reliable power.', crowd: { center: 44, spread: 26, traffic: 0.85 }, image: { motif: 'grid' } }),
  mk({ id: 'h9wd', ref: 'nyt-grid', eventId: 'grid-heat', pub: 'nyt', author: 'Hannah Okoye', headline: 'Climate-Fueled Heat Wave Tests a Strained Southwest Grid', dek: 'Record late-season temperatures pushed demand past forecasts.', crowd: { center: 72, spread: 24, traffic: 0.7 }, image: { motif: 'grid' } }),
  mk({ id: '73hq', ref: 'bbg-grid', eventId: 'grid-heat', pub: 'bloomberg', author: 'Arjun Mehta', headline: 'Power Prices Hit Market Cap as Southwest Grid Asks Customers to Conserve', dek: 'Wholesale prices briefly reached the cap during the evening peak.', crowd: { center: 90, spread: 18, traffic: 0.45 }, image: { motif: 'chart' } }),
  // Transit strike (added 2026-11-12)
  mk({ id: 'nf4s', ref: 'npr-transit', eventId: 'transit-strike', pub: 'npr', author: 'Delia Fontaine', headline: 'Transit workers walk off the job, halting commuter rail', dek: 'The union cites safety staffing; the authority cites a budget deficit.', crowd: { center: 93, spread: 16, traffic: 0.6 }, image: { motif: 'map' } }),
  mk({ id: 'ug9h', ref: 'wsj-transit', eventId: 'transit-strike', pub: 'wsj', author: 'Gregory Pell', headline: 'Union Walkout Strands Commuters as Transit Agency Faces $140 Million Gap', dek: 'The authority says it can’t afford the union’s demands.', crowd: { center: 70, spread: 24, traffic: 0.65 }, image: { motif: 'map' } }),
  mk({ id: 'sqqa', ref: 'guardian-transit', eventId: 'transit-strike', pub: 'guardian', author: 'Nell Ashworth', headline: 'Transit workers strike over unsafe conditions after injuries soar', dek: 'Workers say years of unfilled safety jobs have put them at risk.', crowd: { center: 55, spread: 26, traffic: 0.6 }, image: { motif: 'map' } }),
  mk({ id: 'tk9c', ref: 'cnn-transit', eventId: 'transit-strike', pub: 'cnn', author: 'Marcus Lyle', headline: 'Commuter rail halted as regional transit workers strike', dek: 'Buses are running on a reduced schedule; no new talks are scheduled.', crowd: { center: 92, spread: 17, traffic: 0.5 }, image: { motif: 'map' } }),
  // AI hiring law (added 2026-11-12)
  mk({ id: 'tz66', ref: 'ap-aihiring', eventId: 'ai-hiring', pub: 'ap', author: 'Simone Varga', headline: 'Lawmakers pass bill requiring bias audits of AI hiring tools', dek: 'Employers would have to tell applicants when software screens them.', crowd: { center: 94, spread: 16, traffic: 0.55 }, image: { motif: 'chip' } }),
  mk({ id: 'hydm', ref: 'wsj-aihiring', eventId: 'ai-hiring', pub: 'wsj', author: 'Lydia Crane', headline: 'Employers Face Costly AI Audit Mandate Under New State Bill', dek: 'Business groups say audits could cost up to $75,000 per tool each year.', crowd: { center: 66, spread: 24, traffic: 0.6 }, image: { motif: 'chip' } }),
  mk({ id: '2589', ref: 'cnn-aihiring', eventId: 'ai-hiring', pub: 'cnn', author: 'Jada Whitmore', headline: 'New state law would shield job seekers from biased AI screening', dek: 'Research has found some tools rank equally qualified applicants differently.', crowd: { center: 68, spread: 24, traffic: 0.6 }, image: { motif: 'chip' } }),
  mk({ id: 'uadw', ref: 'politico-aihiring', eventId: 'ai-hiring', pub: 'politico', author: 'Ezra Kamen', headline: 'AI hiring-audit bill heads to governor, who hasn’t said whether she’ll sign', dek: 'Business groups are lobbying for a veto; labor groups for a signature.', crowd: { center: 91, spread: 17, traffic: 0.4 }, image: { motif: 'capitol' } }),
];

export const articles = [...featured, ...others].map((a) => ({ ...a, body: BODIES[a.ref] || [a.dek] }));
export const getArticle = (id) => articles.find((a) => a.id === id) || null;
export const articlesForEvent = (eventId) => articles.filter((a) => a.eventId === eventId);

