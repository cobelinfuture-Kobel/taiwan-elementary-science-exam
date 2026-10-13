# P12 G04S1 — 114 年全 25 卷完成篩選後才正式入庫

## Operator approval, 2026-10-13

**Frozen decision:**「把正式入庫延後到 114 年這 25 份考卷全部完成篩選，而不是等 108～114 所有年度都完成。」

This is **a release sequencing decision**, NOT a revision to what source papers are eligible to be screened against the frozen four-upper **45 KP**. Preserve the global `data/governance/p12-g04s1-108114-kp-first-authority-v1.json`. Original publisher, printed examination period, and year among 108–114 still cannot be used to discard eligible source questions. The new decision scopes the **first consolidated publication checkpoint** to **114 academic-year 25-source corpus** and requires independent explicit operator approval after final candidate review.

Machine-readable authority: `data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json`.

### Sequence and stop gates

| Phase | Must achieve | Current status |
|---|---|---|
| A — source originals | Exactly 25 source paper inventories, 1,623 original response slots, preserve 338 archived nonmatches | COMPLETE in V17; not final science admission |
| B — exhaustive 114 review | 1,285 initial candidate/HOLD/KP-uncertain slots independently judged, every correction re-reviewed or excluded, all 25 papers closed at science/KP/figure level | **IN PROGRESS**, B01+B02 62 reviewed; 1,223 original candidate and uncertain positions not independently reviewed |
| C — final acceptance candidate freeze | Unresolved/rejected/out-of-scope source items excluded, duplicates linked, accepted answers rechecked, learner figures redrawn/rights cleared, A4 double-column print and coverage checked; final reviewable manifest | NOT STARTED |
| D — human-approved batch publication | Explicit *new* operator approval of actual frozen final 114 candidate manifest, then publish approved items and CI/Pages checks | BLOCKED |

**108–113 is not a prerequisite for phase D of 114**; it remains available for future separate screening. Do not wait for all 108–114 to be complete.

### Exact current denominator as of B02

- 25/25 source paper initial first-pass only, **1,623** source response positions including archived.
- Initially 845 KP candidates + 325 source-evidence HOLD + 115 KP uncertainty = **1,285** needing the independent science/KP screening disposition; **338** outside-current-45-KP preserved as original archive.
- After B01 and B02: independent model-science reviewed **62**, including 55 FULL_PASS, 6 CORRECTABLE, 1 REJECT; remaining **1,223** originally candidate/uncertain positions not science reviewed. Some reviewed cases still need corrected questions, KP authority, rights and print acceptance.
- Unreviewed original B15 second-pass queue **390** and unreviewed ordinary KP candidates **833**.
- Source printed-score uncertainty **21 points**; three legacy PDFs still need source SHA readback. Never create phantom source slots from printed point differences. Score discrepancy may be documented, rejected or excluded from usable candidates with evidence; do not silently fill.
- Until D approved and executed, public website answer positions **251 all grades, 53 G04S1**, **0** admissions from this wave.

### Publication readiness mechanism

`tools/p12-g04s1-114-corpus-admission-preflight.mjs` is a **read-only** fail-closed preflight. Running it on V17 and the B02 progress will return `publication_ready=false` with failed criteria. The helper must **not** write to the public bank; future admission scripts must verify readiness again and require explicit operator approval. This helper is a planning/admission preflight, **not yet wired into every runtime write path**. `tests/p12-g04s1-114-complete25-before-public-admission-gate.test.mjs` verifies policy, present gating, and the future success predicate without requiring 108–113 completion.

### Permitted intermediate operations

Continue `P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch03` and remaining Batches without asking to admit each batch. Preserve original PDF, exact source slot IDs and counts, all source figure/rubric complications. Track corrected cases separately; initial science `FULL_PASS` is not a teacher answer-key certification or public-admission permit.

**Next distinct operator review:** only when phase B and C are actually supported by complete evidence and the 114 final admission candidate list is ready. The user will decide which candidate items to batch admit; automatic public release remains disabled.
