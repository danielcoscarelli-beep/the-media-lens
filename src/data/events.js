// News events group related articles. Publication times come from lib/schedule.js.
export const TOPICS = ['Elections', 'International Affairs', 'Economy', 'Technology', 'Climate', 'National Security', 'Energy & Infrastructure'];

export const events = [
  {
    id: 'permitting-act',
    featured: true,
    title: 'Senate passes the Federal Permitting Modernization Act',
    topic: 'Energy & Infrastructure',
    summary: 'The Senate voted 58–41 to set deadlines on federal environmental reviews, shorten the window for legal challenges and speed up approval of interstate transmission lines. The bill now goes to the House.',
    people: ['Dana Whitfield', 'Marcus Oyelaran', 'Elena Marsh', 'Raymond Cho'],
    orgs: ['U.S. Senate', 'Congressional Budget Office', 'American Grid Council', 'Coalition for Public Lands', 'National Tribal Lands Association', 'White House'],
    tags: ['permitting', 'NEPA', 'environmental review', 'transmission', 'Congress', 'Senate', 'energy', 'infrastructure', 'bill', 'vote', 'lawsuits'],
    totalOutlets: 14,
  },
  {
    id: 'fed-holds',
    title: 'Federal Reserve holds rates steady, signals patience on cuts',
    topic: 'Economy', 
    summary: 'The Fed left its benchmark range unchanged for a second meeting. Two officials dissented in favor of a cut.',
    people: ['Fed Chair'], orgs: ['Federal Reserve', 'Bureau of Labor Statistics'],
    tags: ['interest rates', 'inflation', 'Fed', 'FOMC', 'monetary policy', 'economy'], totalOutlets: 22,
  },
  {
    id: 'methane-pact',
    title: '41 nations sign methane leak monitoring pact',
    topic: 'Climate', 
    summary: 'Signatories commit to satellite-verified methane leak reporting by 2028. The declaration has no binding penalties, and several major emitters did not join.',
    people: [], orgs: ['International Energy Agency', 'Climate Action Alliance'],
    tags: ['methane', 'climate', 'emissions', 'oil and gas', 'diplomacy', 'satellites'], totalOutlets: 17,
  },
  {
    id: 'chip-exports',
    title: 'Commerce Department tightens export rules on AI chips',
    topic: 'Technology', 
    summary: 'A new interim rule lowers the performance threshold that triggers export licensing for AI accelerators.',
    people: [], orgs: ['Department of Commerce', 'Bureau of Industry and Security'],
    tags: ['AI', 'semiconductors', 'chips', 'export controls', 'China', 'trade', 'technology'], totalOutlets: 19,
  },
  {
    id: 'pa-map',
    title: 'Pennsylvania Supreme Court strikes down congressional map',
    topic: 'Elections', 
    summary: 'In a 4–3 ruling, the court ordered a remedial congressional map within 45 days.',
    people: [], orgs: ['Pennsylvania Supreme Court'],
    tags: ['redistricting', 'gerrymandering', 'courts', 'elections', 'congressional map', 'Pennsylvania'], totalOutlets: 12,
  },
  {
    id: 'water-cyber',
    title: 'Hackers breached control systems at three U.S. water utilities, CISA says',
    topic: 'National Security', 
    summary: 'A joint federal advisory reports unauthorized access to operational technology at three municipal utilities. No changes to water treatment were confirmed.',
    people: [], orgs: ['CISA', 'FBI', 'EPA'],
    tags: ['cybersecurity', 'water', 'infrastructure', 'hacking', 'CISA', 'national security'], totalOutlets: 15,
  },
  {
    id: 'baltic-cables',
    title: 'EU and UK launch joint mission to protect Baltic undersea cables',
    topic: 'International Affairs', 
    summary: 'European governments announced naval patrols and a shared sensor network after a series of cable outages.',
    people: [], orgs: ['European Council', 'UK Ministry of Defence', 'NATO'],
    tags: ['Baltic', 'undersea cables', 'NATO', 'Europe', 'Russia', 'defense', 'infrastructure'], totalOutlets: 13,
  },
  {
    id: 'grid-heat',
    title: 'Grid operator issues emergency conservation appeal as record heat strains supply',
    topic: 'Climate', 
    summary: 'A regional grid operator asked millions of customers to cut electricity use during a record late-season heat wave. Rolling outages were avoided; wholesale prices briefly spiked.',
    people: [], orgs: ['Southwest Power Coordinating Council', 'National Weather Service'],
    tags: ['heat wave', 'power grid', 'electricity', 'blackouts', 'energy', 'climate', 'wind', 'solar', 'natural gas'], totalOutlets: 16,
  },
  {
    id: 'transit-strike',
    title: 'Regional transit workers strike, halting commuter rail',
    topic: 'Economy', 
    summary: 'Unionized operators and mechanics at a regional transit authority walked off the job after contract talks over pay and safety staffing broke down. Commuter rail service stopped; buses ran on a reduced schedule.',
    people: [], orgs: ['Lakeshore Regional Transit Authority', 'Amalgamated Rail and Transit Workers Local 412'],
    tags: ['strike', 'transit', 'labor', 'union', 'commuters', 'rail', 'wages', 'economy'], totalOutlets: 11,
  },
  {
    id: 'ai-hiring',
    title: 'State lawmakers pass bill requiring bias audits of AI hiring tools',
    topic: 'Technology', 
    summary: 'The bill would require employers that use automated tools to screen job applicants to commission annual independent bias audits and notify candidates. It now goes to the governor.',
    people: ['Rosa Delgado'], orgs: ['State Assembly', 'State Business Council', 'Workers’ Digital Rights Project'],
    tags: ['AI', 'artificial intelligence', 'hiring', 'algorithms', 'bias', 'employment', 'regulation', 'technology'], totalOutlets: 9,
  },
];

export const getEvent = (id) => events.find((e) => e.id === id) || null;
export const featuredEvent = events.find((e) => e.featured);
