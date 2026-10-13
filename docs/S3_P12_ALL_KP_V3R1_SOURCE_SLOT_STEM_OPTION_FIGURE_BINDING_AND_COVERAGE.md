# P12 ALL-KP V3R1 — Source ID / stem / option / figure evidence binding

## User-approved execution and verified source recovery

V3R1 processed every frozen original source answer-position ID in 114 Grade4-S1 25 original papers. The last three unavailable original PDFs were retrieved from the file IDs already recorded in V17, not from guessed web links.

| Previously missing source | Slots | Original SHA-256 |
|---|---:|---|
| 南一 永安 MID_001 | 80 | 4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe |
| 南一 永安 FINAL_001 | 74 | 88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf |
| 翰林 桃子腳 FINAL_012 | 100 | 1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987 |

Local original-binary SHA readback **25/25**; raw PDF page total **60**. Text-selectable PDFs now **21 / 1,380 source response positions**; four image-only PDFs now **4 / 243 source positions**. Original missing PDFs **0**. The historical V3 snapshot showing 3 missing originals is not overwritten; V3R1 records the recovered SHA and source status as a new provenance layer.

## Boundaries of actually materialized question evidence

A privacy-preserving local source binder used 60 pages of original-PDF text, original page-coordinate text blocks, exact original Source IDs, printed section/question numbers and group parents. It evaluated all 1,623 positions, without OCR or fabricating answers.

| Source ID evidence stage | Count | Interpretation |
|---|---:|---|
| STEM_OPTIONS_LOCATED_PENDING_VISUAL_REVIEW | 277 | Single numbered source-text candidate and tentative stem/choices or TF sentence, not final figure or answer-box acceptance |
| PARTIAL_STEM_LOCATED_REQUIRES_SOURCE_REVIEW | 132 | Printed number found but original stem/options not fully reconciled |
| PARENT_GROUP_LOCATED_CHILD_UNBOUND | 192 | Qnn parent text found, separately graded child source positions unbound |
| TEXT_LAYER_SLOT_UNBOUND | 769 | Source paper has selectable text, exact source answer position still unbound |
| AMBIGUOUS_NUMBER_OR_SECTION | 10 | Several plausible source number/section anchors; fail closed |
| IMAGE_ONLY_PENDING_VISUAL | 243 | Original raster pages present, no individual visually validated answer-slot mapping |
| **Total** | **1,623** | Every frozen Source ID retained |

**409** tentative direct printed question-number candidates (277 + 132) plus **192** parent-group text candidates = **601 partial candidate associations**. These are not 601 certified learner questions and cannot be promoted to grade/semester KP matches. Source excerpts are never assumed equivalent to the exact printed question.

The source figure evidence census also extracted candidate PDF images/vector drawings on all 60 pages. **No original answer box or original figure is yet independently geometrically bound to a specific frozen Source ID.** Strict full stem+options+shared stimulus+diagram+answer-box certification remains **0 / 1,623**. User-facing redrawing, teacher answer keys, rights and original science correctness remain distinct gates.

## Reproducible artifacts and CI

Public GitHub only contains provenance, frozen original source ID coverage and tests; no full copyrighted original stems, choices, tables, source PDF images or original PDFs are committed.

- data/review/p12-all-kp-v3r1-114-all25-source-slot-evidence-coverage-v1.json — source slots, recovered PDF hashes, image-only paper identities and status counts.
- tools/p12-all-kp-v3r1-coverage-acceptance.mjs — validates all 1,623 original source positions and 25 paper/3 recovery/4 image-only partitions against frozen main source index. When the user privately provides the original per-slot binding JSON, its optional private mode additionally checks each of the 1,623 original Source IDs, version hashes and evidence stages without publishing source text.
- tests/p12-all-kp-v3r1-source-slot-coverage-gates.test.mjs — six fail-closed source and admission tests.
- npm run kp:v3r1:coverage:check — CI source-slot/governance validation.
- User-private bundle: P12_V3R1_private_all25_source_binding_evidence.zip (SHA-256 82851f218e06707c7f472f6c242c4b99b9c0c10745538e749c59d3f7393690c7). Contains executable binding scripts, page-text coordinate evidence and all 1,623 per-source candidate/hold evidence; **not** stored in the public repo.

## Gating and next shortest step

The 187-KP expansion is **NOT** authorized: source geometry and full question reconstruction are not independently accepted. The 114 admission rule remains unchanged: all 25 original papers must finish scientific answer/figure/KP/rights review and a separate operator-approved final candidate manifest before any publication. Public exam bank stays **251 overall / G04S1 53**; new public admissions **0**. Independent G04S1 114 Batch05 can continue without conflict.

Suggested next: P12_ALL_KP_V3R2_TextQuestionNumberToExactAnswerBoxAndParentFigureGeometryAcceptance. First visually adjudicate 277 strongest text candidates, 132 partial, 10 ambiguous, 192 grouped parent-child links, 769 unbound selectable-text source positions, then four 243-slot image-only source papers (OCR only when unavoidable and independently verified). Do not conflate presence of page text or provisional source ID alignment with complete source question acceptance.
