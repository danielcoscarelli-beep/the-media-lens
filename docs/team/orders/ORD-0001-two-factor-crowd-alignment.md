# ORD-0001: Two-factor Crowd Alignment (accuracy + ordering)

**Status:** Issued
**Priority:** P1 (urgent)
**Issued by:** Walter, agreed with M on 2026-11-16
**Source decision:** `docs/team/walter/memory.md`, Decision register, 2026-11-16 ("Two-factor Crowd Alignment")
**Needs Daniel's approval:** Yes. It changes how the rank is calculated and what it means (`CLAUDE.md` §1.4, §9). Build it on a branch and open a PR; don't merge without Daniel. M sent Daniel the proposal memo on 2026-11-15.

## Business objective
Stop the ranking from rewarding readers who answer the same value without reading. Today always
answering 85 ranks at about the 44th percentile (`CLAUDE.md` §8). A rank that can be earned without
reading undermines the incentive to read carefully, which the mission depends on.

## User-facing outcome
A reader's Crowd Alignment reflects two skills: how close their ratings are to the crowd's final
average (**accuracy**, as today) and whether they put articles in the same order as the crowd
(**ordering**, new). Readers who give the same answer to everything fall to the bottom of the
ranking. The Profile and Methods pages explain both parts in plain language.

## Acceptance criteria
- [ ] **Ordering measure:** over every pair of the reader's eligible (closed, ≥ `MIN_CROWD`) articles whose final crowd averages differ by at least a threshold (5 points as a starting value; re-check it on the 1–100 slider and record the chosen value), the share of pairs the reader rated in the same order. A tie in the reader's ratings counts as half.
- [ ] **Small samples:** the ordering measure is shrunk toward the cohort's typical value when there are few qualifying pairs, the same way accuracy is shrunk today. A reader with no qualifying pairs is held at the typical value.
- [ ] **Combination:** accuracy and ordering are standardized against the cohort and combined into one score, which drives the percentile and tiers. The simulated cohort is scored by the same rules (leave-one-out, as today).
- [ ] **Hedging test:** simulated "always 50", "always 75" and "always 85" readers rank below the 10th percentile. A reader who matches the crowd closely ranks at or above the 95th. Record the actual numbers.
- [ ] **Explanation:** the Profile page's step-by-step calculation and the Methods page explain both parts and the combination; the Methods hedging limitation is updated with the new measured numbers.
- [ ] **Unchanged:** the rating flow, blind-rating rule, eligibility thresholds (5 provisional, 15 ranked), tiers and their percentile cut-offs.
- [ ] **Tests and docs:** unit tests cover the ordering measure (including ties, the constant answer and no-pairs cases) and the combination; `npm test`, `npm run build` and the E2E test pass; `CLAUDE.md` §5, §8 and §9 and `DEVELOPMENT_LOG.md` are updated.

## Constraints
- Product principles in `CLAUDE.md` §1 hold, especially §1.4 (Crowd Alignment stays the ranking system) and §1.5 (blind first).
- Desktop and phone layouts, both themes.
- No change to stored data shapes.

## Options discussed
- **Combination:** standardized scores (recommended; constant answer ≈ 2nd percentile in the 2026-11-15 simulation on the old 5-point scale) vs. averaging the two percentiles (≈ 20th). Re-run both on the slider and report.
- **Not in scope:** a separate "predict the crowd" question to address herding. That is open question Q2 in Walter's memory and may become a later order.

## Steve's record
- Started:
- Branch / PR:
- Development log entry:
- Verification:
- Deviations and notes:
