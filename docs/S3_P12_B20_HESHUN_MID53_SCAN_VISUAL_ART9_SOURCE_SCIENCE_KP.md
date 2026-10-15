# P12 B20 | 臺南市和順國小 114 四上期中 Scan Visual Original Source / Science / KP

## Frozen source identity and real original PDF

- School / publisher: **臺南市和順國民小學 / 南一**. Source paper `SCI_G04_S1_114_MID_002`, original filename `114_南一_四上_自然_期中評量卷_和順國小.pdf`. Google Drive ID `1UxbTZOQo6gMXexzs57V26ycUmcSwjcaO`.
- Exact PDF **1,071,058 bytes**, SHA256 `3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f` matches original frozen visual map; 2 pages, each landscape scan image (1031.24×728.18 original PDF points). PDF text layer is **empty**, only one page-wide image per page; no OCR has been used or relied upon. Both pages rotated **90° clockwise** for upright visual transcription.
- Frozen source paper contains **70 scored response positions / 100 total points**: S1 12 MC×2=24; S2 15 TF×2=30; S3 40 responses×1=40; S4 shared reading 3×2=6. 100/100 original printed score parity is preserved, no invented positions.

## First independent text-only source extraction
- **53 independent and visually legible school-original items:** S1 12 complete four-choice MC (48 original alternatives); S2 15 true/false; S3 G02 four compass judgments, G03 four moon-path judgments, G05 five water-protection judgments, G06 five moon-tracking judgments, G07 four water-hyacinth judgments, G09 four calendar/moon-phase judgments (26 S3 judgments). Each S3 record attaches full printed parent prompt before the original individual statement so the learner can interpret the original marking protocol. This intake is **53 source occurrences, 41 TF +12 MC**, worth 80/100 original printed points.
- **17 dependent/complex positions separately deferred:** S3 G01 six source moon-phase picture sequence, S3 G04 four shared aquatic-plant response-bank positions, S3 G08 four shared animal-breathing response-bank positions, S4 three positions requiring the adapted Taiwan fiddler crab reading passage. No source figure or third-party adapted reading is silently copied into an isolated text question.
- **Important scanned PDF BBox limitation:** There are no source PDF text glyphs to extract. `answer_marker_pdf_bbox_pts_upright_visual_estimate` are **estimated visual marker bounding boxes** expressed in the corrected upright-page coordinate frame (728.18×1031.24 points) from inspected rendered scan pixels. They are **NOT native text-character coordinates** and are not represented as exact verified source-glyph BBoxes. Precise per-marker pixel acceptance is a later independent gate; current source text can be archived as **visual original question transcription** without falsely asserting text-layer exactness or learner admission.
- Preserve the original school wording/choices even where unusual; ambiguous science is a separate model HOLD rather than rewriting the source.

## Science model review independent of canonical KP
| Metric | B20 |
|---|---:|
| Visually complete independent TF / MC | 41 / 12 |
| Science model preliminary pass | **44** |
| Science model HOLD | **9** |
| Frozen KP strong candidate | **21** |
| KP review | **5** |
| KP nonmatch current G04S1 | **27** |
| Science pass ∩ KP strong | **18** |
| Authenticated school key / formal Science / formal KP / student admission | **0 / 0 / 0 / 0** |

- Science HOLDs: `S1|MC|002` observational interval not uniquely specified; `S1|MC|008` indigenous fish habitat may overlap river and pond choices; `S2|TF|001` visibility of shadow behind a transparent object depends on conditions; `S2|TF|010` exact referent of waterweed stem “changes with water level” unclear; `S2|TF|015` generalized indigenous ritual on the lunar new-moon date lacks sufficient specificity; and `S3|G09|037`–`040` four inferred lunar dates from one “did not see moon” observation are not uniquely determined. Null model answer for all nine.
- The other 44 are tentative scientifically reasoned answers, not an authenticated answer sheet or formal school answer/skill verification. Source publisher 南一 is not reason to force lunar-astronomy questions into frozen Kanghsuan G04S1 Units 1–4.

## Cross-paper source duplication
- Against 584 prior independently archived original source occurrences in 21 source files, comparison based on Unicode NFKC and punctuation/space stripped stems shows **0 exact**. Character-bigram Jaccard threshold 0.50 yielded **0 lexical-near** candidate pairs. Separate school provenance IDs would be retained even on a near match.

## Cumulative source-only ledger (v21)
| Metric | Prior v20 | B20 | New v21 |
|---|---:|---:|---:|
| Source-original question occurrences | 584 | 53 | **637** |
| TF / judgment | 342 | 41 | **383** |
| Four-choice MC | 242 | 12 | **254** |
| Original choice alternatives | 968 | 48 | **1016** |
| Model Science preliminary pass | 525 | 44 | **569** |
| Science HOLD | 59 | 9 | **68** |

**22/25 school PDFs** have a first standalone source intake; **3 remaining are image-only**. Original frozen exam identities 25 and **1623 original scored answer positions** remain unchanged. Student practice website remains **251 already admitted answer positions / G04S1 53**; B20 student admissions **0**. Article9 source-only eligibility is not equivalent to authenticated answer, formal Science approval, KP certification, or student-facing admission.

## Files
- `data/source-archive/p12-art9-114-heshun-g04s1-mid53-original-questions-v1.json`
- `data/review/p12-art9-114-heshun-mid53-science-kp-visual-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v21.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-heshun-mid53-scan-visual-science-kp.test.mjs`

NEXT after PR/CI/merge/main readback: `P12_STANDALONE_B21_HESHUN_FINAL_IMAGE_ONLY_VisualTFMC_SourceScienceKP`, original `SCI_G04_S1_114_FINAL_002`.
