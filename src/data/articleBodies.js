// SAMPLE ARTICLE TEXT — hypothetical, written for this prototype. Not real reporting.
// Keyed by each article's internal `ref`. Readers see this text BEFORE rating, so it must
// never name or hint at the publishing outlet (no "told The Associated Press", no house style notes).
// In-text attributions ("according to the Congressional Budget Office") are part of the article
// and stay visible; the structured source-transparency data is revealed only after rating.

export const BODIES = {
  // ── Featured event: Federal Permitting Modernization Act ─────────────────
  'ap-permitting': [
    'WASHINGTON — The Senate on Thursday approved a bipartisan bill that would set deadlines for federal environmental reviews and shorten the time opponents have to challenge project approvals in court, sending the measure to the House.',
    'The vote was 58–41. Nine Democrats joined Republicans in supporting the bill, which would give agencies two years to complete most environmental impact statements and cut the window for lawsuits from six years to 150 days. It would also let regulators designate interstate power lines as being in the national interest, speeding their approval.',
    'Sponsors say the changes would cut average review times roughly in half. "We are trying to build a grid for this century with a permitting system from the last one," said Sen. Marcus Oyelaran, the Democratic co-sponsor.',
    'Opponents say the bill reduces public oversight. The Coalition for Public Lands, an environmental group, said it would let some large projects avoid full review.',
    'Federal data suggests review times vary widely. A Government Accountability Office report last year found that the median environmental impact statement took a little over two years, with large differences between agencies.',
    'A spokesperson for the House Speaker said the chamber would "review the Senate bill carefully" but did not give a timeline for a vote.',
  ],
  'reuters-permitting': [
    'WASHINGTON — The U.S. Senate on Thursday passed legislation to speed federal permitting for energy projects, voting 58–41 for a bill that sets two-year deadlines on most environmental reviews and fast-tracks interstate transmission lines.',
    'Shares of several listed utilities rose modestly after the vote. Developers have long said slow approvals hold back new power lines needed to connect wind and solar farms. About 2,600 gigawatts of generation and storage projects are waiting to connect to the grid, according to Department of Energy national laboratory data, though historically most such projects are never built.',
    'A senior White House official, speaking on condition of anonymity, said the President intends to sign the bill if the House passes it unchanged.',
    '"This is necessary but not sufficient," said Raymond Cho, an energy economist at the Midland Energy Policy Institute. "Permits are one bottleneck. Transmission planning and cost allocation are others."',
    'Environmental groups opposed the measure.',
  ],
  'wsj-permitting': [
    'The Senate passed a bill Thursday that would sharply limit lawsuits against federally approved infrastructure projects, a change business groups have pursued for more than a decade.',
    'Under the measure, which passed 58–41, challengers would have 150 days to sue over a federal approval, down from the six-year default that applies to many projects now. Supporters say the long window leaves developers unable to commit capital for years after a permit is granted.',
    '"The litigation window is the most consequential change in the bill," said Elena Marsh, a professor of environmental law at Lakeshore University. She said it could push challenges into earlier stages, when less information is available.',
    'The bill would also set two-year deadlines for most environmental reviews, which would cut average review times roughly in half. The Congressional Budget Office estimated the measure would reduce federal deficits by $1.2 billion over a decade, mainly through fee collections, though its estimate doesn’t account for broader economic effects.',
    'The deal pairs litigation limits sought by Republicans with transmission provisions sought by Democrats.',
    'Environmental groups said the bill would weaken oversight. The House hasn’t scheduled a vote.',
  ],
  'nyt-permitting': [
    'WASHINGTON — The Senate on Thursday passed a sweeping overhaul of how the federal government approves energy projects, in a vote that brought together two constituencies that rarely find themselves on the same side: advocates of clean energy and fossil fuel interests.',
    'The bill, approved 58 to 41 with the support of nine Democrats, would speed approval of both the long-distance transmission lines that renewable developers say they need and the pipelines favored by oil and gas producers.',
    '"You cannot decarbonize the grid without building it," Senator Marcus Oyelaran, the Democratic co-sponsor, said on the Senate floor.',
    'The measure split environmental groups. Some climate organizations quietly supported it as the price of new power lines, while others, including the Coalition for Public Lands, said it would allow up to 40 percent of major projects to skip a full environmental review.',
    'Tribal leaders raised a separate concern: a new 90-day deadline for consultation on projects crossing tribal lands. The National Tribal Lands Association said the deadline could shortchange a process that is supposed to be conducted government to government.',
    'Sponsors say the bill will cut average review times in half. Its fate in the House is uncertain.',
  ],
  'fox-permitting': [
    'The Senate on Thursday passed a bipartisan bill to cut through years of red tape that has stalled pipelines, power plants and transmission lines across the country.',
    'The legislation, approved 58–41, would cap most federal environmental reviews at two years and give opponents 150 days, instead of six years, to file lawsuits against approved projects. The changes will cut average review times in half.',
    '"Families are paying more for energy because we can’t build anything," said Sen. Dana Whitfield, the bill’s lead sponsor. "This bill says yes to American energy."',
    'Industry groups cheered the vote. A study by the American Grid Council found the reforms could support up to 50,000 construction jobs. More than 2,600 gigawatts of energy projects are currently stuck waiting to connect to the grid.',
    'A White House official said the President will sign the bill.',
    'Some environmental groups opposed the measure, arguing it would limit public input. The bill now heads to the House.',
  ],
  'cnn-permitting': [
    'Analysis — The permitting deal that cleared the Senate on Thursday is being sold as a way to build the power lines a cleaner grid will need. To environmental and tribal groups, it looks like something else: a rollback of protections that communities near pipelines and plants have relied on for half a century.',
    'The bill gives opponents 150 days to challenge a federal approval in court, down from six years. For communities that often learn about a project’s risks only after construction begins, critics warn, that window could close before they have the information to act.',
    '"The most consequential change is the litigation window," said Elena Marsh, an environmental law professor at Lakeshore University.',
    'An analysis by the Coalition for Public Lands estimates that up to 40% of major projects could qualify for exemptions that skip full environmental review. Tribal leaders object to a new 90-day deadline on consultation for projects that cross their lands.',
    'Supporters, led by Sen. Dana Whitfield, argue that the delays themselves cause harm by keeping clean-energy projects off the grid. An unnamed White House official said the President is expected to sign it.',
    'The House has not said when it will take up the bill.',
  ],

  // ── Fed holds rates ──────────────────────────────────────────────────────
  'bbg-fed': [
    'The Federal Reserve left its benchmark interest rate unchanged for a second straight meeting, but two officials dissented in favor of an immediate cut, the most visible sign yet of division over how quickly to ease policy.',
    'Futures markets moved to price in a higher chance of a December cut after the decision. Inflation has cooled this year but remains above the central bank’s 2% target.',
  ],
  'wsj-fed': [
    'Federal Reserve officials held interest rates steady and signaled they are in no hurry to cut, even as inflation continues to cool.',
    'The Fed chair described progress on inflation as "real but incomplete" at a press conference after the decision. Consumer prices rose 2.9% in the year through September, according to the Labor Department, while a core measure that excludes food and energy rose 3.1%.',
  ],
  'cnn-fed': [
    'Americans hoping for relief on credit card and auto loan rates will have to keep waiting. The Federal Reserve again held off on cutting interest rates on Wednesday, leaving struggling borrowers facing some of the highest financing costs in decades.',
    'The average credit card rate remains above 20%. Two Fed officials dissented in favor of a cut.',
  ],
  'fox-fed': [
    'The Federal Reserve kept its benchmark interest rate unchanged Wednesday, with two members of its policy committee voting instead for a quarter-point cut.',
    'The decision marks the second straight meeting without a change. Inflation rose 2.9% over the past year, according to the latest consumer price data, still above the Fed’s 2% goal.',
  ],

  // ── Methane pact ─────────────────────────────────────────────────────────
  'reuters-methane': [
    'Forty-one countries signed a pact on Tuesday committing to satellite-verified reporting of methane leaks from oil and gas operations by 2028.',
    'Methane is a potent greenhouse gas, and the energy sector is one of its largest sources, according to the International Energy Agency. The declaration does not include binding penalties.',
  ],
  'guardian-methane': [
    'Analysis — Another climate summit, another voluntary pledge. The methane monitoring pact signed by 41 countries this week contains no penalties for countries that miss its targets, and several of the world’s largest producers declined to sign at all.',
    'Climate campaigners called it "a monitoring promise, not a reduction target." Satellites can now spot large leaks from orbit, but spotting a leak is not the same as fixing it.',
  ],
  'bbc-methane': [
    'Forty-one countries have agreed to report methane leaks from oil and gas sites using satellite data by 2028. Here is what the deal does, and what it does not do.',
    'It does create a shared reporting standard, which researchers say could make emissions estimates more reliable. It does not set binding cuts or penalties, and several major producers did not sign. Campaigners welcomed the monitoring but said reductions must follow.',
  ],
  'wsj-methane': [
    'Oil and gas producers in 41 countries will face new reporting requirements under a methane monitoring pact signed Tuesday, adding compliance costs for companies already investing in leak detection.',
    'The pact requires satellite-verified reporting by 2028. Industry executives said the timeline is achievable for large operators but could burden smaller producers.',
  ],

  // ── Chip export rules ────────────────────────────────────────────────────
  'reuters-chips': [
    'The U.S. Commerce Department on Thursday tightened export controls on advanced AI chips, lowering the performance threshold at which sales abroad require a license.',
    'Department officials, briefing reporters on condition of anonymity, said the rule responds to advances in chip design since the last update. It takes effect in 30 days.',
  ],
  'nyt-chips': [
    'The United States widened its restrictions on advanced chips on Thursday, as the Commerce Department lowered the threshold for export licenses in an effort to slow China’s development of military artificial intelligence.',
    'Officials who briefed reporters on the condition of anonymity said the rule closes gaps exploited by newer chip designs. Industry objections came later in the day.',
  ],
  'fox-chips': [
    'The Commerce Department announced a crackdown on exports of advanced AI chips to China on Thursday, lowering the threshold for licenses and giving companies 30 days to comply.',
    'A semiconductor trade association warned the rule could cost U.S. firms billions in lost sales.',
  ],
  'bbg-chips': [
    'U.S. chipmakers could lose billions of dollars in overseas sales under a new export rule announced Thursday, according to an industry trade association.',
    'The rule lowers the performance threshold at which AI accelerators require an export license. Shares of several chip designers fell in after-hours trading.',
  ],

  // ── Pennsylvania map ─────────────────────────────────────────────────────
  'politico-map': [
    'The Pennsylvania Supreme Court on Monday threw out the state’s congressional map in a 4–3 ruling and ordered a new one within 45 days, a decision that could reshape several competitive House districts.',
    'Election law scholars said the timeline will be tight with candidate filing deadlines approaching.',
  ],
  'npr-map': [
    'Pennsylvania’s Supreme Court has struck down the state’s congressional map in a 4–3 decision, ordering a remedial map within 45 days.',
    'The state Republican Party chair called the ruling "judicial overreach." The state Democratic Party chair called it "a win for fair representation." The dissenting justices argued the legislature should have the first opportunity to redraw the lines.',
  ],
  'fox-map': [
    'Pennsylvania Republicans on Monday accused the state’s top court of judicial overreach after it threw out the congressional map in a 4–3 decision.',
    '"The court has usurped the role the constitution gives to the legislature," the state GOP chair said. The court ordered a new map within 45 days. Democrats praised the decision.',
  ],
  'wapo-map': [
    'Pennsylvania’s highest court handed Democrats a win on Monday, striking down a congressional map that party leaders said favored Republicans.',
    'The 4–3 ruling could improve Democrats’ chances in two swing districts. A new map is due in 45 days.',
  ],

  // ── Water utilities ──────────────────────────────────────────────────────
  'ap-water': [
    'Hackers gained access to control systems at three U.S. water utilities, federal agencies said Thursday in a joint advisory. No changes to water treatment were confirmed.',
    'One utility’s general manager said staff switched to manual operations for 36 hours as a precaution. The advisory urged utilities to change default passwords and limit internet exposure of control equipment.',
  ],
  'cnn-water': [
    'Foreign hackers have breached the systems that control water treatment at three American utilities, raising alarms about the safety of drinking water, according to officials familiar with the investigation who point to a state-linked group.',
    'A federal advisory released Thursday described unauthorized access to operational technology. It said investigators had not confirmed any changes to treatment.',
  ],
  'fox-water': [
    'Federal agencies warned water utilities Thursday after hackers breached control systems at three facilities.',
    'The joint advisory urged operators to change default passwords and disconnect control equipment from the open internet. Officials said no changes to water treatment were confirmed.',
  ],
  'nyt-water': [
    'The breaches disclosed this week at three water utilities point to a broader vulnerability: thousands of small systems run by towns with no dedicated cybersecurity staff.',
    'A federal advisory described intruders accessing control systems. Some officials, speaking anonymously, attributed the activity to a state-linked group, though the advisory itself did not.',
  ],

  // ── Baltic cables ────────────────────────────────────────────────────────
  'bbc-baltic': [
    'The EU and UK have launched a joint naval patrol mission in the Baltic Sea to protect undersea cables, following several unexplained outages this year.',
    'A shared sensor network will monitor the sea floor. NATO said it would coordinate with the mission.',
  ],
  'reuters-baltic': [
    'European governments announced a joint mission on Wednesday to step up protection of undersea cables in the Baltic Sea. Russia’s foreign ministry called the move "provocative militarization."',
    'The mission includes naval patrols and a shared sensor network. Investigations into earlier cable outages are continuing.',
  ],
  'guardian-baltic': [
    'Europe is moving to shield the cables that carry its data and electricity under the Baltic Sea, amid growing fears of Russian interference.',
    'Officials have not formally attributed the recent outages to any state. The new mission combines patrols with sea-floor sensors.',
  ],
  'fox-baltic': [
    'European nations are deploying warships to the Baltic Sea after suspected Russian sabotage of undersea cables that carry internet and power across the region.',
    'Investigations into the outages are ongoing. NATO welcomed the mission.',
  ],
};
