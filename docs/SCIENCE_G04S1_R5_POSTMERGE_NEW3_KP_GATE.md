# SCIENCE_G04S1_KP_GAP_R5_POSTMERGE — deployment readback, 3-KP coverage, selective mapping

## Post-merge verification (2026-10-16)

- PR #113 merged, `294003b21ed76f0008c5277712dc36484b6e9723`; original CI run `38845962232`: **SUCCESS**.
- Original PR #113 Pages run `38845962243`: **FAIL** (A4 two-column browser layout gate, deployment was skipped). Do not claim it passed.
- A subsequent main SHA `896eea811914a00fa331835d5fd46f2f5192e2ef` has CI `38847232942` **SUCCESS**, Pages `38847233100` **SUCCESS**, and deployed Chromium Exam verification **SUCCESS** (HTTP 200, 629 answer slots, a real KP can generate correct student+answer pages).
- Previous browser verification only checked KP options were present, not that all three new KPI codes load or fail closed. This PR adds explicit *live* tests of `sci_g04s1_01_12`, `sci_g04s1_02_13`, and empty `sci_g04s1_02_14`.

## New KP source scan

- All **25** recorded original G04S1 114 school source JSON papers screened, **717** archived answer-position stems; 12 topic candidates were selected for detailed review. This is first-pass title/stem retrieval, not a guarantee that all implicit or picture-dependent questions were adjudicated.
- Found the **two exact already-published** historical questions formerly erroneously shown as pending in the R4 frozen snapshot:
  - Heshun MID `...|S1|MC|010`, recorded items: `sci_g04s1_02_02`; source-pixel BBox and answer ④ were subsequently certified in `p12-e01-heshun-mid17-pixel-bbox-15accept-2hold-v1.json`; link additionally to survey-record `sci_g04s1_02_13`.
  - Mingyi MID `...|S01|TF|003`, recorded items: `sci_g04s1_01_05`; source glyph+BBox, answer X, science reasoning and public release previously certified; link additionally to wind `sci_g04s1_01_12`.
- The historical release validators intentionally freeze the initial certified `canonical_kp_id` and answer. Do **not** overwrite those records or release a second student entry. This PR therefore adds only immutable **secondary KP links at runtime**, after existing release validators finish, with strict source slot/public ID/text/answer/SHA/BBox/old KP checks. The old selector V2 mode receives unmodified blocks.
- New KP `sci_g04s1_02_14` (water-survey safety) has zero certified publicly mapped sources at this stage and **must fail closed** instead of using another KP's pool.

## Exact science/source/geometry spot checks and admission decision

Obtained five original 114 PDF exams from the connected Drive (Dadun MID, Minquan MID, Anhe MID, Mingyi MID, YongAn MID). File byte SHA-256 values match immutable original source archives. PyMuPDF native text search positions confirm archived 1-based page and text/answer-marker geometry on representative candidate source positions. The PDFs are *not published* to site.

Examples:

| Source position | Potential KP | independently reasoned answer | Gate |
| --- | --- | --- | --- |
| Dadun `MID_004|S02|MC|004` (survey safety) | `02_14`, supplementary `02_13` | ② | HOLD new publication review |
| Minquan `MID_005|S02|MC|001` (survey tools) | `02_13` | ② | HOLD new publication review |
| Mingyi `MID_007|S02|MC|008` (visiting safety) | `02_14` | ④ | HOLD new publication review |
| YongAn `MID_001|MC|S02|005` (survey alone / safe observation) | `02_14` and `02_13` | ③ | HOLD new publication review |
| Anhe `MID_006|S01|TF|004` (wind and flowing water) | `01_12` | provisional O | HOLD final science exactness |
| Dongguang `MID_008|S01|TF|003` (move observed organisms elsewhere) | `02_14` | provisional X | HOLD source recheck |
| Shihu `MID_012|S1|TF|007` (take observed organisms home) | `02_14` | provisional X | HOLD source recheck |

Remaining details, 12 candidate slots, source SHA, native BBoxes when available, explicit negative controls, reasoned answers and semantic duplicate linkage in `data/review/science-g04s1-r5-postmerge-new3-kp-coverage-sourcegate-v1.json`.

Semantic near-duplicate: Dadun survey safety vs YongAn survey safety (both test visiting unsafe places alone). They are not identical source stems, but require same-worksheet anti-repeat handling before *any* new question is published. Habitat inference based on species remains `sci_g04s1_02_02`; rainy flowing-water transport remains `sci_g04s1_01_05`.

## Current PublicAdmission gate

- **Question admission: 0 additional answer slots** in this PR. Total remains 629 pending concurrent changes.
- **KP association only: 2 previously certified source slots** available to the 190-KP selector, preserving source ID, primary canonical ID, full stem, four answer options, independent science answer, A4 rendering, geometry provenance, rights and teacher-key caveat.
- **10 candidate source slots** remain held, pending original full source, exact answer and science, figure/geometry, original print rights, semantic duplicate, then explicit operator gate before public admission.
- Existing V1 187/45 frozen corpus and old source review decisions remain unchanged.

This PR only changes code adding two relationships, adds a non-mutating evidence ledger and focused tests, and extends the actual deployed Pages smoke test. It does **not** rewrite the historical answer/primary-KP validations or release another historical source question.
