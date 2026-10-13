# P12 ALL-KP G04-S2 Cross-Scope Semantic Retrieval Pilot V1 — Acceptance and Limitations

## Operator-approved pilot objective and actual scope

Evaluate **all 1,623 original source response positions from 25 114-year G04-S1 source papers** against the **46 canonical G04-S2 KP** and independently assess a bounded set of challenging cross-semester semantic relationships. Preserve all source lineages, frozen source exams, first-pass G04-S1 decisions, B01–B04 science verdicts and the 114 all-25-before-public-admission requirement.

This execution completed **74,658 source × KP candidate retrieval checks**. They are **lexical/summary-based candidate checks**, NOT 74,658 full-original-PDF scientific semantic certifications. Original PDFs/options/diagrams were *not all reopened*. The index therefore cannot yet establish complete recall, all-pair negative certificates, teacher-key acceptance, image rights, or safe 187-KP expansion.

## Verified CI-generated pilot statistics

| Metric | Result |
|---|---:|
| Original source papers | 25 |
| Original source response positions (not necessarily distinct stand-alone questions) | 1,623 |
| Target G04-S2 canonical KPs | 46 |
| Candidate retrieval checks | 74,658 |
| Retrieved noncertified source-KP edges | **271** |
| Distinct original source response positions in retrieved edges | **196** |
| Target KPs with any retrieval signal | **22 / 46** |
| KPs with no retrieval signal (NOT confirmed missing from corpus) | **24 / 46** |
| Exact original question + option + figure level KP pair certifications | **0** |
| New public admissions | **0** |

Breakdown, verified by GitHub Actions V1 pilot runner:

| G04-S2 unit | KP total | KPs with retrieval candidates | Retrieved source-KP pairs |
|---|---:|---:|---:|
| U01 白天和夜晚的天空 | 12 | 11 | 176 |
| U02 水的移動 | 11 | 0 | 0 |
| U03 昆蟲大解密 | 12 | 2 | 3 |
| U04 自然資源與利用 | 11 | 9 | 92 |
| **Total** | **46** | **22** | **271** |

Source data file: `data/index/p12-g04s2-114-cross-scope-retrieval-pilot-v1.json`, **generated as a CI Actions artifact** rather than checked into the public site. Reproducible commands: `npm run kp:g04s2:pilot:build`, `npm run kp:g04s2:pilot:check`.

## Summary-level manually reviewed challenge cases (nonrandom)

Stored `data/review/p12-g04s2-114-cross-scope-semantic-pilot-audit-v1.json` contains **45 source-ID/KP-ID pairs**, intentionally mixing hard-to-match real positives, near-miss false matches, and information-deficient excerpts.

| Curated class | Number | Retrieval result |
|---|---:|---|
| Plausibly aligned based on first-pass summary | 29 | 26 hits / **3 missed** |
| Not aligned based on first-pass summary | 13 | **1 false hit** / 12 appropriately not hit |
| Not decidable without fuller original source | 3 | Retained as unresolved, no auto approval |
| **Total** | **45** | No corpus-generalizable recall or precision metric |

### Specific misses / false matches

1. **Moon-phase date inference miss:** `SCI_G04_S1_114_MID_001|TF|S01|003` summary `月亮圓缺與農曆日期有關` is plausibly G04-S2 U01 KP12 `農曆日期與月相`, but current narrow token-order rules do not retrieve it.
2. **Insect six-leg concept miss:** `SCI_G04_S1_114_MID_011|Q02|005` `D六腳呼吸管可能紅娘華` plausibly relates to `sci_g04s2_03_01` yet lexically misses because the organism and six-leg feature appear in the opposite order.
3. **Aquatic insect habitat miss:** `SCI_G04_S1_114_MID_001|CHECK|S04|009` `埤塘可能有水棲昆蟲` plausibly maps to `sci_g04s2_03_07`, but current lexical rule expects the insect term before the pond.
4. **Broad fossil-fuel false hit:** `SCI_G04_S1_114_FINAL_004|S02|MC|005` `石油煤炭天然氣核能是否為能源` lexically hits `sci_g04s2_04_05` **燃料** because of coal wording, but the question chiefly evaluates **能源分類** rather than the fuel definition; not a verified secondary KP.
5. **Correct rejection of spurious organism tag:** `SCI_G04_S1_114_MID_006|S01|TF|002` `栗喉蜂虎` is a bird, not an insect, so mere source-topic organism habitat does not justify `sci_g04s2_03_07`.
6. **Correctly retained unverified original:** `SCI_G04_S1_114_FINAL_005|S2|MC|009` `電池種類放置使用與回收` does not disclose whether source actually assesses appropriate resource economy KP11. Exact original PDF and options required.

The 45 were **hand-selected and classed by source summary**; the ratios 26/29 and 1/13 are **not** unbiased field performance estimates.

## Explicit insufficiencies to resolve before extending to all 187 KP

**Gap A — Retrieval vs actual semantics.** Keyword/regex + summarized source text only produces retrieval candidates. It does **not** read full stem/choices/shared stimulus or visual geometry for all 1,623 positions. A robust next stage should run source-exact materialization, question type and diagram evidence, model-assisted intent-level semantic review, and record primary vs optional secondary KP. Do not promote the 271 retrieved edges to `MATCH_VERIFIED`.

**Gap B — Known false negatives.** Word-order and topic synonyms missed 3 deliberately selected aligned cases. Add semantics-based retrieval / normalized alternate phrasings and evaluate against genuinely independent holdout cases. Fix these only with explicit false-positive regression controls.

**Gap C — Known false positives and subject drift.** Words like `能源`, `煤炭`, `水流`, `昆蟲`, `月亮` can be incidental context instead of assessed learning objective. Require meaning and correct question intent, distinguish primary/secondary KP, and use negative examples for threshold selection.

**Gap D — Source evidence quality.** First-pass excerpts can be incomplete, wrong, or overly generic; Batch04's documented `胸鰭` vs incorrectly summarized `尾鰭` illustrates a real flaw. Original figure and answer identity remain separately gated. Collect source text/option/figure coverage statistics before labeling KP missing.

**Gap E — Sparse units not proven missing.** U02 (11 KPs) has zero lexical hits, U03 only 3 candidate edges. These are predominantly G04-S1 original exam papers, with no evidence that G04-S2 U02/U03 original exam corpora were collected. Zero lexical hits is NOT `MISSING`. Later add target-semester and multi-year source papers rather than compensate by inventing questions.

**Gap F — Statistical acceptance is not established.** 45 curated examples do not estimate true precision or recall for the 271 candidates or 74,658 comparisons. Introduce stratified random positive/negative review, independent blind adjudication and per-KP error bounds. Also sample candidate pairs that retrieval misses to detect hidden misses; do not claim zero negatives mean exhaustiveness.

**Gap G — Indexed source positions ≠ 1,623 fully reproducible questions.** Some positions are grouped answer boxes, some source PDFs have identity/source image holds, and there are original score ambiguity holds. Reconstruct exact source before learner-facing export. Keep question concept dedup separate.

**Gap H — Stable incremental remapping/review ledger.** Source and KP version SHA change queue creation exists in All-KP V1. The semantic-review workflow still needs reviewer identity/evidence, scored decisions and versioned append-only `MATCH_VERIFIED / NOT_MATCH / HOLD` ledgers with re-audit on change, plus the 114-corpus publication gate.

## Decision and next work boundary

**Pilot retrieval and diagnostic evidence = completed. Semantic mapping certification and expansion to all 187 KP = NOT ready.** This does not block ongoing `P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch05` because that source-science screening is separate.

Recommended *next distinct* task after discussing shortcomings:

`P12_ALL_KP_CROSS_SCOPE_SEMANTIC_PROJECTION_V2_ExactSourceRecallPrecisionAndKPRoutingRepair`

Scope: prepare full source question materialization for a stratified sample spanning G04-S2 U01–U04; address the 3 observed misses and 1 false-hit, validate independent positive and hard-negative cohorts; add explicit KP primary/secondary and source-level evidence. Run pilot again and require operator acceptance of measurable quality gates before scaling 187 KPs.

### Audit trail

- Runner: `tools/p12-g04s2-114-cross-scope-retrieval-pilot.mjs`
- Curated audit: `data/review/p12-g04s2-114-cross-scope-semantic-pilot-audit-v1.json`
- Regressions: `tests/p12-g04s2-114-cross-scope-retrieval-pilot.test.mjs`
- Frozen source/KP source: `tools/p12-all-kp-source-mapping.mjs`
- CI artifact: `p12-g04s2-114-cross-scope-retrieval-pilot-v1`
- Live public bank unchanged: total 251, G04-S1 53, 114 new admissions 0.
