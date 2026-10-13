# P12 ALL-KP V3 — 25-source PDF evidence materialization and frozen unseen KP benchmark

## Scope and disposition

User-approved task: `P12_ALL_KP_CROSS_SCOPE_V3_FullSourceEvidenceMaterializationAndBlindSemanticBenchmark`.

**V3 architecture, page-level private source evidence extraction, exact PDF availability census, and 40 previously-unused original-source KP-pair evaluation have been executed. Full item-level materialization for all 1,623 response positions is NOT complete; broad semantic KP admission and all-187-KP expansion remain blocked.**

There are three distinct evidence concepts:
1. **Original PDF available and SHA verified**: a verified binary; NOT the same as question text and answer boxes extracted correctly.
2. **Full page-level text/layout available**: actual extracted page contents and coordinates; not guaranteed to be segmented or associated 1:1 with the frozen source answer ID.
3. **Full source-item evidence verified**: complete stem, every option, shared stimulus, figure geometry, one-to-one answer-slot coordinate and source ID lineage with independent science review. **Zero of 1,623 source positions meet this last comprehensive V3 bar.**

### 25-paper original PDF census and source denominator

Original 114 G04S1 V17: 25 PDFs, 1,623 original **response positions**, not 1,623 unique isolated questions.

| Availability class | PDF files | Original response positions |
|---|---:|---:|
| Original binary available, text layer extractable | **18** | **1,126** |
| Original binary available, image-only PDF | **4** | **243** |
| Original PDF missing from local source environment | **3** | **254** |
| **Total** | **25** | **1,623** |

- 22 available PDFs have SHA-256 checks matching the original source baseline where previously recorded.
- **54 original pages** available; private page-level materialization extracted **65,077 text characters** and **1,605 text/layout blocks**, including coordinates. Textual content and actual source images were **not committed to the public GitHub repo**.
- Four image-only originals needing visual review or controlled OCR (OCR only if unavoidable): `MID_002`, `FINAL_002`, `MID_009`, `FINAL_010`.
- Three original PDFs unavailable here: `MID_001`, `FINAL_001`, `FINAL_012`.
- Page text itself is meaningful source evidence, but is not yet accurate answer-slot segmentation, answer key authentication, diagram anchor acceptance, or KP certification.
- Public safe SHA/status ledger: `data/review/p12-all-kp-v3-114-pdf-binary-and-text-access-ledger-v1.json`.
- Private source page text/layout package (session output, **not a GitHub file**): `P12_V3_private_source_page_evidence.zip`, SHA-256 `6e242e4ee98350ef522a3b9b82143c5d3e17a25e46d55b848e0b18591a941efa`. It contains a full page-level layout text JSON and a PDF SHA/page metadata manifest; no source artwork copies.
- All 1,623 source positions receive `source_pdf_evidence_stage` and null/fail-closed slots for unbound full stem/options/shared stimulus/figure location. CI writes the complete index to Actions private evidence artifact, not Pages.

## Previously unseen source–KP case benchmark

To avoid evaluating only the 45 V1 and 23 V2 pairs used to tune routing, V3 froze **40 other source-to-G04S2 KP challenge pairs** before inspecting each pair's V2 candidate result. Original PDF page and short source text anchors were recorded for these cases; the evaluator's label did not use the per-pair V2 retrieval flags. No V2 retrieval rules were changed.

**Important:** This is an *untuned, previously unseen, purposively difficult benchmark*, not a randomized or independently human-adjudicated blind validation. The model derived the labels and the corpus is G04S1-skewed.

| Frozen V3 labeled relationship | Pairs | Frozen V2 outcome |
|---|---:|---|
| Primary or secondary KP plausibly aligned on original PDF | **12** | **1 retrieved, 11 missed** |
| KP does not align with original assessed concept | **26** | **25 correctly excluded, 1 falsely retrieved** |
| Source question/figure intent uncertain | **2** | Neither auto certified |
| **Total** | **40** | Formally KP-certified: **0** |

**These proportions describe this chosen sample only, not true corpus precision or recall.** The low detection of plausible positive relationships is nevertheless enough to block claiming that the rules reliably generalize beyond the previous 45 development pairs.

### Per-unit held-out diagnosis

| Target G04S2 unit | Sampled pairs | Plausible primary/secondary | Plausible missed | Nonmatching | False hits | Holds |
|---|---:|---:|---:|---:|---:|---:|
| U01 白天和夜晚的天空 | 9 | 3 | 3 | 5 | 1 | 1 |
| U02 水的移動 | 8 | **0** | — | 8 | 0 | 0 |
| U03 昆蟲大解密 | 9 | 1 | 1 | 8 | 0 | 0 |
| U04 自然資源與利用 | 14 | 8 | 7 | 5 | 0 | 1 |
| **Total** | **40** | **12** | **11** | **26** | **1** | **2** |

The U02 held-out cohort contains **no positive examples**. Zero false positives for this set is useful negative control but **does not measure U02 recall** and **does not establish that G04S2 U02's 11 KP are missing from existing or future source exams**.

### Failure mechanisms confirmed

1. **Cross-curriculum meaning absent from legacy summary.** e.g. a hand-light/shadow-orientation question can correspond to G04S2 `sci_g04s2_01_04` even when the summary contains no exact regex string `影子方向`.
2. **Secondary KP is particularly under-retrieved.** e.g. rock materials as usable resources; fish ladder as sustainable aquatic resource management; school-ground ant habitat as insect habitat. Simply insisting the whole question must be a lower-semester main question will drop legitimate secondary candidates.
3. **Need stronger intent constraints on hard negatives.** e.g. light-source detection `≠` astronomical visibility, plant stem bending `≠` connecting vessels, snail and frogs `≠` insect body motion.
4. **Missing response-level source boundaries.** Full page text does not identify which particular numbered source answer slot inherits which diagram, option or shared stimulus. A visually legible arrow does not permit invented source ID to box geometry.
5. **Original corpus is semester-skewed.** 114 G04S1 papers do not contain a balanced sample of G04S2 physics, insect life-cycle, etc.
6. **Benchmark quality not yet externally independent.** Need random or probability-stratified frozen holdout chosen without lexical-rule and content-target handpicking, *then* independent reviewer labels made with original source, with adjudicator disagreements resolved.
7. **PDF source missing/image-only.** 3 missing originals and 4 image-only require source procurement/visual readback (OCR as last resort). Full item reconstruction should distinguish source-document completeness from separate science correctness, rights and operator admission.
8. **No KP or learner admission authorization.** Candidate retrieval and diagnostic pair classification do not replace formal KP authority, science-answer key, drawing redraft, teacher key, A4 two-column check and separate operator release approval.

## Machine-executed gates and files

- `tools/p12-all-kp-v3-source-readiness-and-heldout.mjs`: every source ID and original binary availability, V2 frozen predictions applied to previously unused cases, completeness nulls (no unsupported full source claim), official KP authority/lineage and pending next gates.
- `data/review/p12-all-kp-v3-g04s2-frozen-unseen-source-exact-benchmark-v1.json`: 40 previously unused source-KP evidence-labeled cases; all page/source IDs auditable, labels are model interpretations and not formal KP approvals.
- `data/review/p12-all-kp-v3-114-pdf-binary-and-text-access-ledger-v1.json`: 25 originals SHA and text-layer availability.
- `tests/p12-all-kp-v3-fullsource-evidence-heldout.test.mjs`: no leaked V1/V2 pairs, all 1,623 exact source IDs accounted for, source PDF bounds, no invented student answers, deterministic reproducibility.
- GitHub Actions generated `p12-all-kp-v3-source-readiness-heldout-v1`: complete **nonpublic** source evidence availability index plus 40 pair evaluation.

## Closeout decision

**V3 is completed as a baseline evidence-materialization and unseen-rule diagnostic, and FAILED as a full item evidence/quality-admission gate.** No mass source-to-KP semantic certification, 187-KP rollout, or 114 public question admission is authorized.

The next shortest technically necessary work is **V3R1 `P12_ALL_KP_V3R1_SourceSlotStemOptionFigureBindingAndEvidenceCoverage`**: prioritize the 18 text-layer originals (1,126 slots), actually associate each exact source ID with full stem/options/shared group/figure, introduce geometry evidence and human-review exceptions, then process 4 image-only PDFs (243 slots) and procure 3 missing originals (254 slots). Independently random holdout/KP human acceptance comes after verified source completeness.

The original `P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch05` may continue independently; source-science work does not alter any V3 source/KP contracts or the 114 all-25-before-publication gate. Public answers unchanged **251 total / 53 G04S1**, new public admissions **0**.
