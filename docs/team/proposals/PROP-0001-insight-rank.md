# Proposal: Replace Crowd Alignment with an Insight rank

**PROP-0001** · 2026-11-16 · Written by Walter for M and Daniel · **Status: Awaiting approval**

_The working copy for comments and approval is a claude.ai doc; this is the copy for review in the repository._

## Summary

We propose retiring Crowd Alignment and ranking readers by **Insight**: credit for honest judgments that turn out more common than the crowd expected. Each reader answers two questions per article, an honest rating and a prediction of how others will rate. Vulgis stays **crowd only**: no editors, experts or platform-made content decide what is biased.

**Decisions requested from M and Daniel:**

1. Retire Crowd Alignment and adopt Insight as the reader rank.
2. Add a prediction question to every rating.
3. Adopt "crowd only" as a product principle.
4. Show prediction accuracy as a separate Forecast badge, not part of the rank.

## Why change

Crowd Alignment rewards readers for **predicting the crowd**, not for judging the article well. That creates two problems:

- **Hedging.** Answering the same value without reading pays off. Always answering 85 ranks at about the 44th percentile of the simulated cohort (measured 2026-11-15).
- **Herding.** A reader who expects the crowd to disagree with them earns more by reporting the crowd's view than their own. That drains the independence and diversity a wise crowd depends on. It hits hardest the readers who see themselves as outside the mainstream. Blind rating stops copying, but not this incentive.

A fix such as adding an ordering factor (the 2026-11-15 memo, ORD-0001, now on hold) cures hedging but not herding, because it still scores agreement with the crowd.

**What we want instead:** the crowd decides which articles are neutral and factual, and the rank recognizes readers whose honest judgment the crowd confirms, without paying anyone to guess the crowd.

## The design

The reader still rates blind, before seeing the outlet or any score. Then:

1. **Question 1, the honest rating:** "How biased is this article?" on today's 1–100 slider. It is locked once submitted.
2. **Question 2, the prediction:** "What share of readers will rate this Biased or worse (50 or below)?" from 0 to 100%. A different format from the rating, so it takes a second thought rather than a copy.

| Output | Built from | Purpose |
| --- | --- | --- |
| **Community score** | Honest ratings only (average, as today) | The crowd's verdict on the article. Nothing about it is scored, so there is no reason not to be honest. |
| **Insight rank** | Honest ratings compared with everyone's predictions | Recognizes readers who saw what the crowd underestimated. Replaces Crowd Alignment and keeps its tiers (Bronze to Grandmaster). |
| **Forecast badge** | Prediction accuracy | A reason to predict carefully. Shown separately and never part of the rank. |

**The reveal** gains one line when the window closes: "You expected 70% to call this biased. It was 35%." It shows readers how far their own bubble extends, a media-literacy lesson in itself.

## How Insight is calculated

For each closed article, a reader's honest rating falls on one side of the line: **Biased or worse** (50 or below) or **better than Biased** (above 50). Their Insight points for that article are:

```
points = ln( actual share of readers on your side / average predicted share for your side )
```

Your side being **more common than readers predicted** earns positive points. Less common earns negative points. As predicted earns about zero. This is the information score of Prelec's Bayesian Truth Serum (*Science*, 2004), simplified to one yes/no line. The "average" is the geometric mean of the predictions, as the method specifies.

**Worked example.** Readers predicted, on average, that 20% would call an article Biased or worse. Actually 35% did.

| Reader's honest rating | Side | Points |
| --- | --- | --- |
| 40 | Biased or worse | ln(0.35 ÷ 0.20) = **+0.56** |
| 80 | Better than Biased | ln(0.65 ÷ 0.80) = **−0.21** |

The 40-rater saw something the crowd underestimated and earns Insight. If the next article goes the other way (predicted 60%, actual 40%), the 80-rater earns +0.41 and the 40-rater −0.41.

**From points to rank:** a reader's Insight is the average of their points over eligible articles, shrunk toward the typical reader when they have few articles (as today). It is then turned into a percentile and the existing tiers. Eligibility thresholds (5 articles for provisional, 15 for ranked, a minimum number of ratings per article) carry over and will be re-tested.

The prediction itself never affects Insight. It only feeds the crowd's average prediction and the reader's Forecast badge.

## Changes to the product principles

| Principle (`CLAUDE.md` §1) | Today | Proposed |
| --- | --- | --- |
| §1.4 Ranking | Crowd Alignment ranks readers by how closely they anticipate the crowd's final average (Daniel, 2026-11-12) | **Insight** ranks readers by honest judgments that prove more common than the crowd predicted. Prediction accuracy is a separate Forecast badge |
| New: Crowd only | Not stated | **The crowd alone decides.** No editors, expert panels, platform-made test content or outside verdicts are used to judge articles or readers |
| §1.2 No platform opinion | Unchanged | Unchanged, and reinforced by "crowd only" |
| §1.5 Blind first | Unchanged | Applies to both questions: nothing is revealed until both are submitted |
| §1.6 Demographics | Unchanged | Unchanged: never used in Insight, Forecast or the community score |

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| **A second question lowers engagement** | Keep it to one tap-and-drag; measure completion and return rates in the prototype and pilot |
| **Readers project their own view into the prediction** | Expected, and the method relies on it: each group over-predicts its own view, and scoring uses the average across everyone. A different format (a share, not a rating), asking it second and the Forecast badge keep predictions thoughtful |
| **Hard to explain** | A plain one-paragraph explanation and a worked example on the Methods page and in the reveal |
| **Noisy with few ratings per article** | Score only articles above a minimum number of ratings (to be set by testing); shrink small samples |
| **Constant answers** | A reader who always lands on one side earns only when that side happens to be under-predicted, and loses when it is over-predicted. Expected to average near zero; to be verified in simulation |
| **A one-sided crowd** | No scoring rule can correct it, so crowd-only makes **who the crowd is** the decisive risk. Recruiting a diverse readership and resisting coordinated or fake accounts become top business priorities |
| **Untested in this setting** | The method has published evidence (Prelec, Seung & McCoy, *Nature*, 2017) but not on news bias. The prototype simulation and a real pilot must confirm it before launch |

## Rollout plan

Once both partners approve, Walter issues one development order to Steve, and ORD-0001 is cancelled.

1. **Prototype (front end, simulated readers).** Add the prediction question after the rating; give simulated readers predictions that include projection; compute Insight and the Forecast badge; replace Crowd Alignment on Profile, the nav rank chip and Methods; add the "you expected / it was" line to the reveal. Saved ratings gain a prediction field, which needs a storage migration (`CLAUDE.md` §7.12).
2. **Verify in simulation.** Constant answers average near zero; honest readers who see what the crowd under-predicts rank highest; set the minimum ratings per article. Report the numbers before release.
3. **Real-user pilot,** once there is a backend. Measure completion of the second question, prediction copying, and Insight stability over time.

Steve documents it per project rules: development log, `CLAUDE.md` updates, tests, and a pull request for Daniel.

## Approval

Approve in the pull request or the claude.ai doc, item by item.

| Item | M | Daniel |
| --- | --- | --- |
| 1. Retire Crowd Alignment; adopt Insight as the reader rank | ☐ | ☐ |
| 2. Add the prediction question to every rating | ☐ | ☐ |
| 3. Adopt "crowd only" as a product principle | ☐ | ☐ |
| 4. Prediction accuracy as a separate Forecast badge | ☐ | ☐ |
