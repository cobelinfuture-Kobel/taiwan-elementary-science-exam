# P12 — ALL-KP G04-S2 Exact Source Recall/Precision & KP Routing Repair V2

## Execution scope and authority

User-approved next step: `P12_ALL_KP_CROSS_SCOPE_SEMANTIC_PROJECTION_V2_ExactSourceRecallPrecisionAndKPRoutingRepair`.

- Source baseline: 114 school year, **25 original G04-S1 papers, 1,623 original response positions**.
- Target: **46 canonical G04-S2 KPs**, four units, from unchanged `site/data/authority/science-g03-g04-selector-v2.json`.
- Retains V1 full **74,658 source-position × KP lexical candidate checks**. **Neither V1 nor V2 performed 74,658 source-exact full-semantic verifications.**
- Frozen source item IDs, original PDF identity, B01–B04 source science verdicts, 114 all-25-before-public-admission user policy, learner site counts total 251 / G04S1 53 remain unchanged.
- Original site/PDF/teacher answer keys/figures were not copied into new public bank.

## Source-exact evidence executed

Independent local PDF source readback was performed from original source files (PyMuPDF text plus source page inspection), with recomputed original PDF SHA-256. Each reviewed source-to-KP pair retains: original source ID, KP ID, PDF sha, page, short text anchor, primary topic, science/KP rationale, and the distinction between semantic plausibility and final publication.

Evidence: `data/review/p12-g04s2-v2-exact-source-kp-intent-challenge-v1.json`.

| Case status | Count | Meaning |
|---|---:|---|
| Original PDF source–KP pairs examined | **21** | Explicit source PDF page, short anchor and binary SHA |
| Primary KP plausible | 7 | Direct original assessed concept reasonably matches target KP, but no formal KP operator acceptance |
| Secondary KP plausible | 4 | Related concept appears but primary assessment belongs elsewhere |
| Exact-source nonmatches | 8 | Reject this KP without deleting the original source item or other eligible KP mappings |
| Exact-source HOLD | 2 | Question flawed or mixed-target ambiguity; do not use for publication |
| Original PDFs unavailable (summary-only) | **2** | Remain open; no original-source verification claim |
| Formal current KP and public acceptance | **0** | Out of scope in this work phase |

Original PDFs accessed in this session include:
- `114_翰林_四上_自然_期中評量卷_桃子腳國小.pdf` SHA `e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5`
- `114_南一_四上_自然_期末評量卷_崇德國小.pdf` SHA `8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84`
- `114_翰林_四上_自然_期中評量卷_大華國小.pdf` SHA `d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6`
- `114_康軒_四上_自然_期中評量卷_安和國小.pdf` SHA `f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb`

Two `SCI_G04_S1_114_MID_001` source pairs (lunar phase vs lunar date, pond habitat vs aquatic insect) have only historic first-pass summaries in the accessible working set; absent original `114_南一_四上_自然_期中評量卷_永安國小.pdf` cannot be promoted to SOURCE_EXACT.

### Concrete scientific routing decisions

- 桃子腳 MID Q02|005: Source animal movement table's D row explicitly contains **six legs, respiratory tube, swimming/crawling**, and the actual item asks if D could be **紅娘華**. G04-S2 `03_01` 昆蟲基本構造 is a **secondary plausible** match, with original primary G04S1 animal classification/aquatic movement; this is **not an independent formal KP admission**.
- 桃子腳 MID Q04|004: The **straw** belongs to manufacturing a **moon elevation-angle observer**, not to `G04S2 U02_07 虹吸形成條件`. Reject the wrong KP despite the word straw.
- 桃子腳 MID Q04|010: Source tests whether an **elevation-angle measurement tool** can measure lunar **azimuth**. Do not silently treat it as full competency with a magnetic compass and `G04S2 U01_08 月亮方位的測量`.
- 崇德 FINAL `S02|MC|005`: The exact question asks how many of **petroleum, coal, natural gas, nuclear energy are energy sources**. The assessed primary concept is `G04S2 U04_04 能源`, not `G04S2 U04_05 燃料`, despite coal and natural gas text.
- 大華 MID `S02|MC|004`: `中秋節過後...多久...再看見相同的月相` with 7/15/30/60 day choices, directly tests `G04S2 U01_11 月相變化週期`.
- 大華 MID `S02|MC|014`: Ocean resources concept remains **question-flaw HOLD**, because original environmental-resource options include a coral-reef construction-material trap that B03 already flagged as CORRECTABLE.
- 安和 MID TF `S01|002`: `栗喉蜂虎` is a **bird** nesting in soil, not an insect; nonmatching `G04S2 U03_07 昆蟲棲地與食物`.
- 安和 MID MC `S02|005`: Richter-scale earthquake energy is not proof of `G04S2 U04_02 能量的意義` merely because it says energy.

## Before/after CI proof

Source `tools/p12-g04s2-v2-exact-source-routing.mjs`, generated as **nonpublic CI artifact** `p12-g04s2-v2-exact-source-routing-v1`. This is an append-only V2 review layer; V1 and all first-pass source documents remain intact.

| CI measurement | V1 | V2 |
|---|---:|---:|
| Provisional retrieval edges | 271 | **276** |
| Additional generalized word-order/synonym hits | — | **+7** |
| Explicitly suppressed concept misroutes | — | **−2** |
| U01 retrieved edges | 176 | **180** |
| U02 retrieved edges | 0 | **0** |
| U03 retrieved edges | 3 | **5** |
| U04 retrieved edges | 92 | **91** |
| KPs with any candidate | 22 | **23** |

V1 curated 45-pair *development* challenge set (29 summary-level positive, 13 negative, 3 unresolved):
- V1 caught **26/29** summary-positive references, with **1/13** negative reference falsely retrieved.
- V2 caught **29/29** known positive references, with **0/13** known negative references retrieved.
- These examples **informed the repair rules**; do not report either fraction as blind precision/recall of the full population.

New original-PDF-backed (also deliberately selected, **not** blind random) challenge:
- **10/11** primary-or-secondary plausible source-KP pairs retrieved, **1 known miss** (original source table expresses movement but historic summary omits this detail);
- **0/8** source-exact negative pairs retrieved after rerouting;
- 2 original PDF question-quality holds and 2 missing-PDF source holds remain.
- Coverage of original source text/options/figures across all 1,623 source items is not established, so estimated field precision, field recall and closed-world KPI `MISSING` are **NOT** certified.

## V2 deficiencies and recommended repair sequence

1. **Primary bottleneck is incomplete source semantics.** The 桃子腳紅娘華 table asks about the six-legged swimming animal; but its first-pass short summary omits movement. This is a concrete missed secondary KP still present after generalized V2 rules. Exact original question text, options, stimulus, table/diagram and family grouping must be materialized, versioned and made queryable before a full all-KP semantic search.
2. **The known-rule QA set is contaminated by tuning.** 29/29 on the previously used development positives is not external validation; set aside a stratified, randomly selected and blinded holdout for true sensitivity/precision on multiple KP difficulty levels, especially multiple grade/semester and hard negatives.
3. **Source scope is narrow.** U02 水的移動 has no candidates for all 11 KPs, U03 昆蟲大解密 only 3 KPs/5 edges. These are from **G04S1 exam originals**, not a representative G04S2 source corpus. Cannot conclude that U02, U03 are truly missing.
4. **Source paper availability incomplete.** At least the original 永安 MID PDF for two known cross-scope source positions is unavailable locally; targeted retrieval/download and exact PDF/figure readback needed to raise evidence tier. Do not substitute a summary for an original PDF.
5. **Question concept versus source response position.** Multiple response boxes from one parent image/text must be indexed as linked children with the assessed objective in the shared stimulus. Parent-child dedup and multistage primary/secondary KP routing are not yet certified for 1,623 slots.
6. **Separate all acceptance gates.** Provisional lexical retrieval, source-exact intent plausibility, formal KP authority match, original science-answer verdict, teacher key, figure redraw rights and operator admission are distinct. All new V2 edges explicitly `kp_verified=false` and `public_admission_approved=false`.
7. **No unbiased quality thresholds.** Before expansion to 187 KP, require independent reviewer-blind source-exact test samples, an explicit acceptable false positive/negative error budget and per-unit/KP diagnostic review. Current V2 proves repair on bounded known cases but not reliable autonomous mass mapping.
8. **Audit preservation and incremental reruns.** V2 stores suppressed edges as evidence rather than deleting original source lineage. New source/KP authority versions must rerun source-intent review and invalidate stale candidate promotions.

## Verified freeze

- No source PDFs, previous V17/B01–B04 verdicts, canonical KP definitions, website or public bank have been modified.
- 114 source admission still requires 25/25 full source screening + final consolidated candidate list + **separate explicit user approval**. B05 source-science work remains independently schedulable.
- Full 187-KP semantic expansion: **NOT YET ACCEPTED**.

NEXT_RECOMMENDED_STEP = `P12_ALL_KP_CROSS_SCOPE_V3_FullSourceEvidenceMaterializationAndBlindSemanticBenchmark`.
Goal: build exact source/question/option/diagram indexing and a reliable blind benchmark, then test enhanced retrieval on U01–U04 before authorizing broad rollout.
