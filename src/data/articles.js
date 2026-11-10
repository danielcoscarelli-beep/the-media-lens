// SAMPLE ARTICLES — hypothetical coverage written for this prototype.
// None of these headlines or stories were published by the named outlets.
//
// id      = opaque public id used in URLs. It must never reveal the outlet (blind rating).
// ref     = internal, human-readable reference for developers. Never render it.
// body    = article text (see articleBodies.js), attached below.
// Headline markup: [[word]] marks wording the comparison view highlights (shown only after reveal).
// crowd   = parameters for the SIMULATED participants (services/community.js):
//           center = typical rating 0–100, spread = how much simulated raters disagree,
//           traffic = relative share of simulated participants who rate it (0–1).
// intensity = hand-assigned 0–1 language-intensity value shown in the Compare view. Not a bias verdict.
// Publication time and the 24-hour rating window come from lib/schedule.js, not from this file.

import { BODIES } from './articleBodies.js';

const featured = [
  {
    id: 'kxfv', ref: 'ap-permitting', eventId: 'permitting-act', pub: 'ap', author: 'Jordan Ellery', label: 'News',
    headline: 'Senate [[approves]] bill to speed permits for energy projects, sending it to House',
    dek: 'The Senate voted 58–41 for a bipartisan bill that sets deadlines for environmental reviews and limits the time to file lawsuits. Supporters say it will speed construction of power lines and pipelines; opponents say it reduces public oversight.',
    emphasis: ['What the bill changes: review deadlines, lawsuit window, transmission designation', 'Vote breakdown and next steps in the House', 'GAO data showing review timelines vary widely'],
    framing: 'Procedural and descriptive. Supporters’ claims are attributed ("sponsors say"), and the sponsor’s figure on review times is presented as a claim, not a fact.',
    charged: [],
    perspectives: { supporters: 3, opponents: 3, independent: 1, affected: 0 },
    omissions: ['Does not include tribal nations’ concerns about the consultation deadline.'],
    opinionNote: 'Straight news report. Characterizations are attributed to named speakers.',
    sourceUses: [
      { id: 'rollcall-287', cls: 'primary', usage: 'Vote tally and the names of the nine Democrats who voted yes.' },
      { id: 'billtext-2214', cls: 'primary', usage: 'Summarizes the three main provisions directly from the bill text.' },
      { id: 'whitfield-release', cls: 'primary', usage: 'Quotes the "cut review times in half" figure, attributed as "sponsors say."' },
      { id: 'oyelaran-floor', cls: 'primary', usage: 'Quotes the Democratic co-sponsor on transmission lines.' },
      { id: 'gao-nepa', cls: 'primary', usage: 'Gives context: median review times are about 2.2 years but vary widely.' },
      { id: 'cpl-analysis', cls: 'secondary', usage: 'Quotes the opposing advocacy group; does not repeat its 40% figure.' },
      { id: 'speaker-spox', cls: 'primary', usage: 'House timing remains unclear.' },
    ],
    claims: ['vote-tally', 'litigation-150', 'review-halved', 'house-uncertain'],
    crowd: { center: 88, spread: 22, traffic: 0.89 },
    markers: [], intensity: 0.05, image: { motif: 'capitol' },
  },
  {
    id: '5z2s', ref: 'reuters-permitting', eventId: 'permitting-act', pub: 'reuters', author: 'Priya Natarajan', label: 'News',
    headline: 'US Senate [[passes]] energy permitting reform in 58-41 vote',
    dek: 'The bill would set two-year deadlines on most federal environmental reviews and speed approvals for interstate transmission lines. Utility shares rose modestly after the vote.',
    emphasis: ['Market and utility-sector reaction', 'Transmission provisions and the interconnection backlog', 'White House support, from an unnamed official'],
    framing: 'Concise and market-oriented. Uses "reform," a word that carries a slight positive connotation, but otherwise descriptive.',
    charged: [{ term: 'reform', note: 'Common shorthand for legislative change, but implies improvement. "Overhaul" or "bill" would be more neutral.', attributed: false }],
    perspectives: { supporters: 2, opponents: 1, independent: 1, affected: 0 },
    omissions: ['Mentions opposition from environmental groups in one sentence, without specifics.', 'No tribal perspective.'],
    opinionNote: 'Straight news report.',
    sourceUses: [
      { id: 'rollcall-287', cls: 'primary', usage: 'Vote tally in the headline.' },
      { id: 'lab-queue', cls: 'primary', usage: 'Cites the 2,600 GW interconnection backlog, noting many projects are speculative.' },
      { id: 'wh-official', cls: 'anonymous', usage: '"Intends to sign," attributed to a senior White House official speaking on condition of anonymity.' },
      { id: 'cho-expert', cls: 'expert', usage: '"Necessary but not sufficient" quote on transmission.' },
      { id: 'cpl-analysis', cls: 'secondary', usage: 'One-sentence reference to environmental opposition.' },
    ],
    claims: ['vote-tally', 'queue-2600', 'president-sign'],
    crowd: { center: 88, spread: 21, traffic: 0.78 },
    markers: ['charged-language'], intensity: 0.08, image: { motif: 'grid' },
  },
  {
    id: '2ynm', ref: 'wsj-permitting', eventId: 'permitting-act', pub: 'wsj', author: 'Catherine Doyle', label: 'News',
    headline: 'Senate Passes Permitting Bill [[Limiting Lawsuits]] Against Infrastructure Projects',
    dek: 'The measure would cut the window to challenge federal approvals from six years to 150 days, a change business groups have sought for more than a decade.',
    emphasis: ['Litigation limits as the bill’s most consequential change', 'Investment certainty for developers', 'CBO deficit estimate'],
    framing: 'Puts the legal mechanism in the headline. Calm language overall, though it repeats the sponsor’s review-time figure without saying where it comes from.',
    charged: [],
    perspectives: { supporters: 3, opponents: 1, independent: 2, affected: 0 },
    omissions: ['Repeats "cut review times in half" in the body without attribution.', 'Environmental objections receive one paragraph near the end.'],
    opinionNote: 'News report from the news section, not the editorial page.',
    sourceUses: [
      { id: 'billtext-2214', cls: 'primary', usage: 'Explains Sec. 311 litigation change in detail.' },
      { id: 'cbo-2214', cls: 'primary', usage: 'Reports the $1.2B deficit reduction and notes the estimate excludes economic effects.' },
      { id: 'whitfield-release', cls: 'unverified', usage: 'Review-time figure appears without attribution, as if established fact.' },
      { id: 'marsh-expert', cls: 'expert', usage: 'Law professor calls the litigation window "the most consequential change."' },
      { id: 'politico-prior', cls: 'secondary', usage: 'References earlier reporting on how the deal was negotiated.' },
    ],
    claims: ['litigation-150', 'deficit-1-2b', 'review-halved'],
    crowd: { center: 81, spread: 25, traffic: 0.81 },
    markers: ['unattributed-figure', 'one-sided-sourcing'], intensity: 0.2, image: { motif: 'gavel' },
  },
  {
    id: 'fum9', ref: 'nyt-permitting', eventId: 'permitting-act', pub: 'nyt', author: 'Samuel Okafor', label: 'News',
    headline: 'Senate Passes Permitting Overhaul, Handing Clean-Energy Backers and [[Fossil Fuel Interests]] a [[Rare Shared Win]]',
    dek: 'The bill would speed approval of both power lines and pipelines, an unusual pairing that split environmental groups and drew support from nine Democrats.',
    emphasis: ['The unusual coalition behind the bill', 'Climate implications of faster transmission and pipeline approvals', 'Split among environmental groups'],
    framing: 'Interpretive headline built around the politics of the coalition. "Fossil fuel interests" is a somewhat loaded phrase, though the article uses "clean-energy backers" in parallel.',
    charged: [
      { term: 'fossil fuel interests', note: '"Interests" can imply narrow self-dealing. "Producers" or "companies" would be more neutral.', attributed: false },
      { term: 'rare shared win', note: 'An interpretive judgment. The body supports it with the vote breakdown, but some clean-energy groups opposed the bill.', attributed: false },
    ],
    perspectives: { supporters: 3, opponents: 3, independent: 1, affected: 1 },
    omissions: ['CBO deficit estimate not mentioned.', 'Repeats the review-time figure, attributed to sponsors.'],
    opinionNote: 'News report with an interpretive headline. Not labeled analysis.',
    sourceUses: [
      { id: 'rollcall-287', cls: 'primary', usage: 'Breaks down the vote by party.' },
      { id: 'oyelaran-floor', cls: 'primary', usage: 'Democratic co-sponsor’s rationale.' },
      { id: 'whitfield-release', cls: 'primary', usage: 'Review-time figure attributed to the sponsors.' },
      { id: 'tribal-statement', cls: 'primary', usage: 'Quotes tribal concerns about the consultation deadline.' },
      { id: 'cpl-analysis', cls: 'secondary', usage: 'Quotes the advocacy group; mentions the 40% estimate as "up to."' },
      { id: 'politico-prior', cls: 'secondary', usage: 'Background on how the deal was negotiated.' },
    ],
    claims: ['vote-tally', 'rare-coalition', 'tribal-weakened', 'review-halved'],
    crowd: { center: 74, spread: 27, traffic: 0.81 },
    markers: ['charged-language', 'evaluative-headline'], intensity: 0.32, image: { motif: 'turbine' },
  },
  {
    id: 'h4mu', ref: 'fox-permitting', eventId: 'permitting-act', pub: 'fox', author: 'Brett Lancaster', label: 'News',
    headline: 'Senate Clears Bill to [[Slash]] [[Red Tape]] [[Choking]] American Energy Projects',
    dek: 'Lawmakers passed a bipartisan measure aimed at ending years-long delays for pipelines, power plants and transmission lines. Supporters say it could add tens of thousands of construction jobs.',
    emphasis: ['Delays faced by energy projects', 'Industry jobs estimate', 'Energy independence and costs'],
    framing: 'Evaluative headline. "Slash," "red tape" and "choking" present the outcome as an obvious good and describe current reviews as an obstruction, without attribution.',
    charged: [
      { term: 'slash', note: 'An intensifying verb. "Shorten" or "limit" would describe the change without implying it is purely beneficial.', attributed: false },
      { term: 'red tape', note: 'Characterizes environmental review as needless bureaucracy. That is contested and not attributed to any speaker.', attributed: false },
      { term: 'choking', note: 'Emotionally charged metaphor that implies the projects are being harmed. Not attributed.', attributed: false },
    ],
    perspectives: { supporters: 4, opponents: 1, independent: 0, affected: 0 },
    omissions: ['Does not report the advocacy group’s exclusion analysis or tribal concerns.', 'Gives the 50,000-jobs estimate without noting it is industry-funded.'],
    opinionNote: 'Presented as news, but the headline contains evaluative language normally associated with opinion writing.',
    sourceUses: [
      { id: 'rollcall-287', cls: 'primary', usage: 'Vote tally.' },
      { id: 'whitfield-release', cls: 'unverified', usage: 'Review-time figure presented as fact, without attribution.' },
      { id: 'agc-jobs', cls: 'secondary', usage: '"Tens of thousands of jobs," from the trade association study; funding source not disclosed.' },
      { id: 'wh-official', cls: 'anonymous', usage: '"A White House official" says the President will sign.' },
      { id: 'lab-queue', cls: 'primary', usage: 'Cites the backlog without noting speculative applications.' },
    ],
    claims: ['red-tape-choking', 'jobs-50k', 'review-halved', 'president-sign'],
    crowd: { center: 46, spread: 28, traffic: 1.0 },
    markers: ['charged-language', 'evaluative-headline', 'unattributed-figure', 'one-sided-sourcing'], intensity: 0.78, image: { motif: 'pipeline' },
  },
  {
    id: 'upue', ref: 'cnn-permitting', eventId: 'permitting-act', pub: 'cnn', author: 'Alicia Moreno', label: 'Analysis',
    headline: 'Analysis: Senate’s Permitting Deal [[Guts]] Key Environmental Protections, [[Critics Warn]]',
    dek: 'Environmental and tribal groups say the bill would let some major projects skip full review and leave communities near pipelines with less time to go to court.',
    emphasis: ['Effects on frontline communities and tribal nations', 'Advocacy estimate that up to 40% of projects could skip full review', 'The 150-day litigation window'],
    framing: 'Labeled analysis. The headline’s "guts" is attributed to critics, but putting it in the headline makes the critics’ view the main frame. The body gives supporters two paragraphs.',
    charged: [
      { term: 'guts', note: 'A strongly evaluative verb. Attributed to critics ("critics warn"), but it sets the headline frame.', attributed: true },
      { term: 'critics warn', note: '"Warn" lends urgency and credibility to one side. "Critics say" would be more neutral.', attributed: true },
    ],
    perspectives: { supporters: 1, opponents: 4, independent: 1, affected: 2 },
    omissions: ['Leaves out the CBO estimate and the transmission provisions Democrats sought.', 'Gives the 40% estimate with "up to," but not the dispute over the bill’s definitions.'],
    opinionNote: 'Labeled Analysis, which tells readers it includes interpretation. The label appears in the headline.',
    sourceUses: [
      { id: 'cpl-analysis', cls: 'secondary', usage: 'Central source: the 40% exclusion estimate and the "guts" characterization.' },
      { id: 'tribal-statement', cls: 'primary', usage: 'Extended quotes from tribal leaders.' },
      { id: 'marsh-expert', cls: 'expert', usage: 'Litigation-window concerns.' },
      { id: 'billtext-2214', cls: 'primary', usage: 'Quotes the 150-day provision.' },
      { id: 'wh-official', cls: 'anonymous', usage: 'President expected to sign, per an unnamed official.' },
      { id: 'whitfield-release', cls: 'primary', usage: 'Sponsor’s quote, attributed.' },
    ],
    claims: ['guts-protections', 'bypass-40', 'litigation-150', 'tribal-weakened', 'president-sign'],
    crowd: { center: 51, spread: 29, traffic: 0.94 },
    markers: ['charged-language', 'evaluative-headline', 'one-sided-sourcing', 'omitted-context', 'label-analysis'], intensity: 0.7, image: { motif: 'river' },
  },
];

// Lighter-profile articles for the other events.
const mk = (o) => ({
  label: 'News', charged: [], omissions: [], emphasis: [], markers: [], opinionNote: 'Straight news report.',
  perspectives: { supporters: 1, opponents: 1, independent: 1, affected: 0 }, ...o,
});

const others = [
  // Fed
  mk({ id: '99nz', ref: 'bbg-fed', eventId: 'fed-holds', pub: 'bloomberg', author: 'Helena Marsh-Yu', headline: 'Fed Holds Rates as Two Officials Dissent in Favor of Cut', dek: 'The split vote suggests growing pressure inside the Fed to ease policy as inflation cools.', framing: 'Descriptive; leads with the dissent.', emphasis: ['Internal division', 'Market pricing'], sourceUses: [{ id: 'fomc-statement', cls: 'primary', usage: 'Decision and dissents.' }, { id: 'markets-pricing', cls: 'primary', usage: 'December cut odds.' }], claims: ['fed-hold', 'fed-dissent', 'cut-december'], crowd: { center: 93, spread: 18, traffic: 0.26 }, intensity: 0.05, image: { motif: 'chart' } }),
  mk({ id: 'vr2p', ref: 'wsj-fed', eventId: 'fed-holds', pub: 'wsj', author: 'Nick Arden', headline: 'Fed Signals Patience on Rate Cuts Despite Cooling Inflation', dek: 'The Chair said progress on inflation was "real but incomplete."', framing: 'Leads with the Chair’s message.', emphasis: ['Chair’s guidance', 'Inflation data'], sourceUses: [{ id: 'fed-presser', cls: 'primary', usage: 'Chair quotes.' }, { id: 'bls-cpi', cls: 'primary', usage: 'Inflation figures.' }], claims: ['fed-hold'], crowd: { center: 90, spread: 20, traffic: 0.24 }, intensity: 0.06, image: { motif: 'chart' } }),
  mk({ id: '52hf', ref: 'cnn-fed', eventId: 'fed-holds', pub: 'cnn', author: 'Rita Banerjee', headline: 'Fed Again [[Holds Off]] on Rate Relief for [[Struggling]] Borrowers', dek: 'Credit-card and auto-loan rates will stay high for now.', framing: 'Household-centered; "struggling" adds emotional weight.', charged: [{ term: 'struggling', note: 'Generalizes borrowers’ circumstances and adds emotional weight.', attributed: false }, { term: 'rate relief', note: 'Frames a cut as relief, implying the hold is a harm.', attributed: false }], emphasis: ['Consumer borrowing costs'], omissions: ['Does not mention that inflation remains above target.'], sourceUses: [{ id: 'fomc-statement', cls: 'primary', usage: 'Decision.' }], claims: ['fed-hold'], crowd: { center: 68, spread: 28, traffic: 0.23 }, markers: ['charged-language', 'omitted-context'], intensity: 0.45, image: { motif: 'chart' } }),
  mk({ id: 'vysu', ref: 'fox-fed', eventId: 'fed-holds', pub: 'fox', author: 'Megan Stroud', headline: 'Federal Reserve Keeps Interest Rates Unchanged, Two Members Push for Cut', dek: 'The central bank held its benchmark range steady for a second straight meeting.', framing: 'Descriptive.', emphasis: ['Decision and dissent'], sourceUses: [{ id: 'fomc-statement', cls: 'primary', usage: 'Decision and dissents.' }, { id: 'bls-cpi', cls: 'primary', usage: 'Inflation context.' }], claims: ['fed-hold', 'fed-dissent'], crowd: { center: 94, spread: 17, traffic: 0.23 }, intensity: 0.04, image: { motif: 'chart' } }),
  // Methane
  mk({ id: 'ge9f', ref: 'reuters-methane', eventId: 'methane-pact', pub: 'reuters', author: 'Oskar Lind', headline: '41 countries sign pact on satellite monitoring of methane leaks', dek: 'Signatories commit to verified reporting by 2028.', framing: 'Descriptive.', emphasis: ['Commitments', 'Verification'], sourceUses: [{ id: 'pact-text', cls: 'primary', usage: 'Commitments.' }, { id: 'iea-methane', cls: 'primary', usage: 'Emissions context.' }], claims: ['methane-signed'], crowd: { center: 93, spread: 18, traffic: 0.18 }, intensity: 0.03, image: { motif: 'globe' } }),
  mk({ id: 'gj2c', ref: 'guardian-methane', eventId: 'methane-pact', pub: 'guardian', author: 'Fiona Achebe', label: 'Analysis', headline: '[[Toothless]] methane pact lets world’s biggest emitters [[off the hook]]', dek: 'The declaration has no penalties, and several major producers declined to sign.', framing: 'Labeled analysis; strongly evaluative headline.', charged: [{ term: 'toothless', note: 'Evaluative judgment of effectiveness.', attributed: false }, { term: 'off the hook', note: 'Implies culpability and evasion.', attributed: false }], emphasis: ['Absence of enforcement', 'Non-signatories'], omissions: ['Little on what monitoring changes in practice.'], sourceUses: [{ id: 'pact-text', cls: 'primary', usage: 'No-penalty provisions.' }, { id: 'ngo-climate', cls: 'secondary', usage: 'Advocacy reaction.' }], claims: ['methane-no-penalty'], crowd: { center: 52, spread: 29, traffic: 0.23 }, markers: ['charged-language', 'evaluative-headline', 'label-analysis'], intensity: 0.66, image: { motif: 'globe' } }),
  mk({ id: 'ck8s', ref: 'bbc-methane', eventId: 'methane-pact', pub: 'bbc', author: 'Tom Hargreaves', headline: 'Methane pact: What the new monitoring deal does and doesn’t do', dek: 'An explainer on the pledge, its satellites and its limits.', framing: 'Explanatory; balanced.', emphasis: ['How monitoring works', 'Limits'], sourceUses: [{ id: 'pact-text', cls: 'primary', usage: 'Provisions.' }, { id: 'iea-methane', cls: 'primary', usage: 'Data.' }, { id: 'ngo-climate', cls: 'secondary', usage: 'Critique.' }], claims: ['methane-signed', 'methane-no-penalty'], crowd: { center: 95, spread: 16, traffic: 0.2 }, intensity: 0.02, image: { motif: 'globe' } }),
  mk({ id: 'bcfz', ref: 'wsj-methane', eventId: 'methane-pact', pub: 'wsj', author: 'Grant Whelan', headline: 'Methane Pact Adds New Reporting [[Burden]] for Oil and Gas Producers', dek: 'Producers in signatory countries face satellite-verified reporting.', framing: 'Industry-cost framing; "burden" is mildly evaluative.', charged: [{ term: 'burden', note: 'Frames compliance as a cost only.', attributed: false }], emphasis: ['Compliance costs'], omissions: ['Little on emissions impact.'], sourceUses: [{ id: 'pact-text', cls: 'primary', usage: 'Requirements.' }], claims: ['methane-signed'], crowd: { center: 75, spread: 26, traffic: 0.2 }, markers: ['charged-language'], intensity: 0.28, image: { motif: 'globe' } }),
  // Chips
  mk({ id: '399p', ref: 'reuters-chips', eventId: 'chip-exports', pub: 'reuters', author: 'Daniel Huang', headline: 'US tightens export rules on advanced AI chips', dek: 'A Commerce rule lowers the performance threshold for licensing.', framing: 'Descriptive.', emphasis: ['Rule details'], sourceUses: [{ id: 'bis-rule', cls: 'primary', usage: 'Rule text.' }, { id: 'commerce-anon', cls: 'anonymous', usage: 'Intent of the rule.' }], claims: ['chip-threshold'], crowd: { center: 94, spread: 17, traffic: 0.19 }, intensity: 0.03, image: { motif: 'chip' } }),
  mk({ id: 'xhs7', ref: 'nyt-chips', eventId: 'chip-exports', pub: 'nyt', author: 'Lauren Pike', headline: 'U.S. Widens Curbs on A.I. Chips in Bid to Slow China’s Military Advances', dek: 'Officials described the rule as a response to evolving security risks.', framing: 'Security framing taken from unnamed officials.', emphasis: ['Security rationale'], omissions: ['Industry objections appear late.'], sourceUses: [{ id: 'bis-rule', cls: 'primary', usage: 'Rule.' }, { id: 'commerce-anon', cls: 'anonymous', usage: 'Motivation.' }], claims: ['chip-threshold'], crowd: { center: 84, spread: 23, traffic: 0.18 }, markers: ['one-sided-sourcing'], intensity: 0.12, image: { motif: 'chip' } }),
  mk({ id: 'fcgu', ref: 'fox-chips', eventId: 'chip-exports', pub: 'fox', author: 'Kyle Benton', headline: 'Commerce Department Announces [[Crackdown]] on AI Chip Exports to China', dek: 'New licensing thresholds take effect in 30 days.', framing: '"Crackdown" adds intensity.', charged: [{ term: 'crackdown', note: 'Implies enforcement against wrongdoing.', attributed: false }], emphasis: ['China'], sourceUses: [{ id: 'bis-rule', cls: 'primary', usage: 'Rule.' }, { id: 'semi-assoc', cls: 'secondary', usage: 'Industry reaction.' }], claims: ['chip-threshold', 'chip-market-share'], crowd: { center: 80, spread: 25, traffic: 0.19 }, markers: ['charged-language'], intensity: 0.25, image: { motif: 'chip' } }),
  mk({ id: '7rqc', ref: 'bbg-chips', eventId: 'chip-exports', pub: 'bloomberg', author: 'Mira Castellanos', headline: 'Chipmakers Face Billions in Lost Sales Under New US Export Rule', dek: 'Industry groups warn of lost market share abroad.', framing: 'Commercial impact; relies on industry estimate.', emphasis: ['Revenue impact'], omissions: ['Security rationale is brief.'], sourceUses: [{ id: 'semi-assoc', cls: 'secondary', usage: 'Lost-sales estimate.' }, { id: 'bis-rule', cls: 'primary', usage: 'Rule.' }], claims: ['chip-market-share', 'chip-threshold'], crowd: { center: 79, spread: 25, traffic: 0.06 }, markers: ['one-sided-sourcing'], intensity: 0.15, image: { motif: 'chip' } }),
  // PA map
  mk({ id: 'w3e4', ref: 'politico-map', eventId: 'pa-map', pub: 'politico', author: 'Ben Szymanski', headline: 'Pennsylvania high court tosses congressional map, orders redraw in 45 days', dek: 'The 4–3 ruling could reshape several competitive districts.', framing: 'Descriptive with political stakes.', emphasis: ['Competitive seats'], sourceUses: [{ id: 'court-opinion', cls: 'primary', usage: 'Ruling.' }, { id: 'redistrict-expert', cls: 'expert', usage: 'Timeline.' }], claims: ['map-struck'], crowd: { center: 92, spread: 19, traffic: 0.16 }, intensity: 0.06, image: { motif: 'map' } }),
  mk({ id: 'acjn', ref: 'npr-map', eventId: 'pa-map', pub: 'npr', author: 'Alana Brooks', headline: 'Pennsylvania Supreme Court strikes down congressional map in 4-3 decision', dek: 'Both parties reacted sharply; a new map is due in 45 days.', framing: 'Descriptive; both parties quoted.', emphasis: ['Ruling', 'Reactions'], sourceUses: [{ id: 'court-opinion', cls: 'primary', usage: 'Ruling.' }, { id: 'gop-chair', cls: 'primary', usage: 'Reaction.' }, { id: 'dem-chair', cls: 'primary', usage: 'Reaction.' }], claims: ['map-struck', 'map-overreach'], crowd: { center: 92, spread: 18, traffic: 0.18 }, intensity: 0.03, image: { motif: 'map' } }),
  mk({ id: 'e7g2', ref: 'fox-map', eventId: 'pa-map', pub: 'fox', author: 'Dale Kimura', headline: 'Republicans Decry ‘[[Judicial Overreach]]’ After Court Tosses Pennsylvania Map', dek: 'GOP leaders say the court usurped the legislature’s role.', framing: 'Leads with one party’s reaction (attributed).', charged: [{ term: 'judicial overreach', note: 'Attributed quote, but it sets the headline frame.', attributed: true }], emphasis: ['GOP reaction'], omissions: ['Democratic reaction appears late.'], sourceUses: [{ id: 'gop-chair', cls: 'primary', usage: 'Headline quote.' }, { id: 'court-opinion', cls: 'primary', usage: 'Ruling.' }], claims: ['map-struck', 'map-overreach'], crowd: { center: 71, spread: 27, traffic: 0.19 }, markers: ['one-sided-sourcing'], intensity: 0.3, image: { motif: 'map' } }),
  mk({ id: '4ske', ref: 'wapo-map', eventId: 'pa-map', pub: 'wapo', author: 'Corinne Vale', headline: 'Pennsylvania court [[hands Democrats a win]] in redistricting fight', dek: 'The ruling could help Democrats in two swing districts.', framing: 'Partisan-outcome framing.', charged: [{ term: 'hands Democrats a win', note: 'Frames a legal ruling as a partisan victory.', attributed: false }], emphasis: ['Partisan impact'], omissions: ['Legal reasoning is summarized briefly.'], sourceUses: [{ id: 'court-opinion', cls: 'primary', usage: 'Ruling.' }, { id: 'dem-chair', cls: 'primary', usage: 'Reaction.' }, { id: 'gop-chair', cls: 'primary', usage: 'Reaction.' }], claims: ['map-struck'], crowd: { center: 73, spread: 27, traffic: 0.18 }, markers: ['evaluative-headline'], intensity: 0.28, image: { motif: 'map' } }),
  // Water
  mk({ id: 'cgbv', ref: 'ap-water', eventId: 'water-cyber', pub: 'ap', author: 'Marcus Feld', headline: 'Hackers accessed control systems at 3 US water utilities, federal agencies say', dek: 'No changes to water treatment were confirmed, according to the advisory.', framing: 'Descriptive; includes the reassurance.', emphasis: ['Advisory findings'], sourceUses: [{ id: 'cisa-advisory', cls: 'primary', usage: 'Findings.' }, { id: 'utility-manager', cls: 'primary', usage: 'Local response.' }], claims: ['water-access'], crowd: { center: 95, spread: 16, traffic: 0.17 }, intensity: 0.04, image: { motif: 'water' } }),
  mk({ id: '7kva', ref: 'cnn-water', eventId: 'water-cyber', pub: 'cnn', author: 'Jenna Holt', headline: 'Foreign Hackers [[Threaten]] America’s Drinking Water, Officials Say', dek: 'Officials familiar with the probe point to a state-linked group.', framing: '"Threaten" overstates confirmed impact; attribution rests on anonymous officials.', charged: [{ term: 'threaten', note: 'Implies an active danger the advisory does not confirm.', attributed: true }], emphasis: ['Foreign attribution'], omissions: ['No-impact finding appears late.'], sourceUses: [{ id: 'intel-anon', cls: 'anonymous', usage: 'Attribution.' }, { id: 'cisa-advisory', cls: 'primary', usage: 'Findings.' }], claims: ['water-access', 'water-state-actor'], crowd: { center: 62, spread: 29, traffic: 0.2 }, markers: ['charged-language', 'omitted-context'], intensity: 0.5, image: { motif: 'water' } }),
  mk({ id: '5wma', ref: 'fox-water', eventId: 'water-cyber', pub: 'fox', author: 'Ray Jensen', headline: 'Feds Warn Water Utilities After Hackers Breach Three Systems', dek: 'CISA urged utilities to change default passwords.', framing: 'Descriptive; practical guidance.', emphasis: ['Guidance to utilities'], sourceUses: [{ id: 'cisa-advisory', cls: 'primary', usage: 'Findings and guidance.' }], claims: ['water-access'], crowd: { center: 93, spread: 18, traffic: 0.16 }, intensity: 0.06, image: { motif: 'water' } }),
  mk({ id: '7rg3', ref: 'nyt-water', eventId: 'water-cyber', pub: 'nyt', author: 'Ian Corbell', headline: 'Breaches at Water Utilities Expose Gaps in Small-Town Cyberdefenses', dek: 'Many small utilities lack dedicated security staff, the advisory notes.', framing: 'Systemic framing.', emphasis: ['Under-resourced utilities'], sourceUses: [{ id: 'cisa-advisory', cls: 'primary', usage: 'Findings.' }, { id: 'utility-manager', cls: 'primary', usage: 'Interview.' }, { id: 'intel-anon', cls: 'anonymous', usage: 'Attribution, caveated.' }], claims: ['water-access', 'water-state-actor'], crowd: { center: 91, spread: 19, traffic: 0.16 }, intensity: 0.08, image: { motif: 'water' } }),
  // Baltic
  mk({ id: 'h3xr', ref: 'bbc-baltic', eventId: 'baltic-cables', pub: 'bbc', author: 'Eleanor Firth', headline: 'EU and UK launch Baltic patrol mission to protect undersea cables', dek: 'The move follows several unexplained cable outages.', framing: 'Descriptive; "unexplained" keeps open questions open.', emphasis: ['Mission scope'], sourceUses: [{ id: 'joint-communique', cls: 'primary', usage: 'Announcement.' }, { id: 'nato-spox', cls: 'primary', usage: 'Coordination.' }], claims: ['cable-mission'], crowd: { center: 95, spread: 16, traffic: 0.15 }, intensity: 0.03, image: { motif: 'sea' } }),
  mk({ id: 'p6f4', ref: 'reuters-baltic', eventId: 'baltic-cables', pub: 'reuters', author: 'Annika Rask', headline: 'Europe steps up Baltic cable protection; Moscow calls move provocative', dek: 'Both sides’ statements included.', framing: 'Balanced.', emphasis: ['Mission', 'Russian reaction'], sourceUses: [{ id: 'joint-communique', cls: 'primary', usage: 'Announcement.' }, { id: 'russia-mfa', cls: 'primary', usage: 'Reaction.' }], claims: ['cable-mission'], crowd: { center: 92, spread: 19, traffic: 0.15 }, intensity: 0.05, image: { motif: 'sea' } }),
  mk({ id: 'zrgr', ref: 'guardian-baltic', eventId: 'baltic-cables', pub: 'guardian', author: 'Owen Tierney', headline: 'Europe moves to shield vital Baltic cables amid fears of Russian [[interference]]', dek: 'Officials have not formally attributed recent outages.', framing: 'Mentions fears while noting no attribution.', charged: [{ term: 'interference', note: 'Suggests hostile intent; tempered by "fears of."', attributed: false }], emphasis: ['Security concerns'], sourceUses: [{ id: 'joint-communique', cls: 'primary', usage: 'Announcement.' }], claims: ['cable-mission'], crowd: { center: 85, spread: 23, traffic: 0.15 }, markers: ['charged-language'], intensity: 0.18, image: { motif: 'sea' } }),
  mk({ id: 'azja', ref: 'fox-baltic', eventId: 'baltic-cables', pub: 'fox', author: 'Sean Whitlock', headline: 'Europe Deploys Warships After Suspected Russian [[Sabotage]] of Undersea Cables', dek: 'Investigations into the outages are ongoing.', framing: '"Sabotage" in the headline goes beyond the official findings.', charged: [{ term: 'sabotage', note: 'Asserts deliberate action not established by investigators. "Suspected" softens it.', attributed: false }], emphasis: ['Russian threat'], omissions: ['Ongoing investigation noted only in the subhead.'], sourceUses: [{ id: 'joint-communique', cls: 'primary', usage: 'Announcement.' }, { id: 'nato-spox', cls: 'primary', usage: 'Remarks.' }], claims: ['cable-mission'], crowd: { center: 68, spread: 28, traffic: 0.17 }, markers: ['charged-language', 'omitted-context'], intensity: 0.42, image: { motif: 'sea' } }),
];

export const articles = [...featured, ...others].map((a) => ({ ...a, body: BODIES[a.ref] || [a.dek] }));
export const getArticle = (id) => articles.find((a) => a.id === id) || null;
export const articlesForEvent = (eventId) => articles.filter((a) => a.eventId === eventId);

// Objective textual markers and which evaluation reasons count as identifying them.
export const MARKERS = {
  'charged-language': { label: 'Charged or loaded wording in the headline' },
  'evaluative-headline': { label: 'Headline states an evaluation, not just what happened' },
  'unattributed-figure': { label: 'A contested figure stated as fact without its source' },
  'one-sided-sourcing': { label: 'Quoted voices weighted heavily to one side' },
  'omitted-context': { label: 'Relevant documented context omitted' },
  'label-analysis': { label: 'Labeled as analysis, so interpretation is disclosed' },
};
