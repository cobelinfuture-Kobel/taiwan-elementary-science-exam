# P12 B12｜花蓮縣花蓮市明義國小 114 四上期末原始題目來源與 Science/KP

## Source identity / exact PDF

Original: `114_康軒_四上_自然_期末評量卷_明義國小.pdf`; original PDF school heading `花蓮縣花蓮市明義國民小學 114 學年度第一學期 四年級自然科期末定期評量試卷`.

- Connected Drive ID `1pwlIRa40MeeVMlAYAyhufNchGEqbL6oT`.
- 3 pages; **350499 bytes**; SHA-256 **`023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd`** verified from actual PDF and equals frozen `data/review/p12-g04s1-114-kanghsuan-mingyi-final-50-source-kp-first-v1.json`.
- Full original paper: **50 response positions, 100 printed points**, broken into TF 15×2 (30), MC 15×2 (30), S03 grouped match/drawing diagrams 38, S04 dolphin reading 2.
- Source text archive contains **only 15 complete independent TF + 13 MC = 28 original occurrences** and **52 printed choices**; two image-dependent MC08 (depicted open/closed lamp circuit) and MC09 (test objects inserted into depicted circuit) excluded from text-only batch. S03 illustrated bulb component matching, drawn wires, sound-medium matching and circuit brightness, and S04 source-reading questions also deferred separately.
- Every collected record preserves full question words, original printed choice order, exact original Source ID, original PDF page, and 28 original answer-marker raw-character bounding rectangles in points. Visual inspection of all 3 PDF pages performed, without OCR, and exact binary fingerprint kept.

## Science and canonical G04S1 U03/U04 KP second pass

| Review | This original school paper |
|---|---:|
| Full original TF / MC | 15 / 13 |
| Printed MC choices | 52 |
| Model preliminary science no obvious problem | 25 |
| SCIENCE HOLD | **3** |
| Canonical KP strong candidate | 26 |
| KP review | **2** |
| Both model-science pass and KP strong | 24 |
| Teacher key / formal science acceptance / formal KP / operator learner admission | **0 / 0 / 0 / 0** |

SCIENCE HOLD original IDs:
1. `SCI_G04_S1_114_FINAL_008|S01|TF|003`: shadow shape is not necessarily similar to three-dimensional object's physical outline for arbitrary light direction and orientation; original lacks conditions.
2. `SCI_G04_S1_114_FINAL_008|S02|MC|012`: brightness when a single cell drives different numbers of bulbs in series or parallel depends on bulb electrical specification and actual circuit conditions; no unconditional science uniqueness recognized.
3. `SCI_G04_S1_114_FINAL_008|S02|MC|014`: connecting more batteries in series may speed a fan only within the motor's rated voltage; overvoltage may cause damage, no fixed bounded safe count.

First-pass KP mapping is **26 KP_MATCH_CANDIDATE, 2 KP_REVIEW** (TF009 battery long-storage safety and MC014 small-motor series cell assumptions). Proposed canonical owners are verified against `site/data/authority/science-g03-g04-selector-v2.json`; nothing nonmatched was forced into a KP. Student-facing source words retained unchanged even for any questionable science.

Compared all previously archived **319** complete original source occurrences against the new 28 normalized stems:
- **2 exact**: new TF012 vs 民權期末 TF010 (battery terminal polarity statement); new MC007 vs 崇德期末 MC001 (places to see a shadow).
- **8 near** additional high-overlap source relationships (including TF013 vs 大墩期末 TF014). Reuse preserves original per-school provenance and does not deduplicate source occurrences.
- Original print anomaly HOLD for new source: **0**; earlier accumulated printed-choice marker HOLD **2** remains tracked independently of model science HOLD.

## Cumulative source-only ledger

| Counter | Prior v12 | Mingyi B12 | Current v13 |
|---|---:|---:|---:|
| Complete school original question occurrences | 319 | 28 | **347** |
| TF | 151 | 15 | **166** |
| MC | 168 | 13 | **181** |
| Printed MC alternatives | 672 | 52 | **724** |
| Model preliminary science pass | 288 | 25 | **313** |
| Model science HOLD | 31 | 3 | **34** |

**14/25** original school exam PDFs have first-pass stand-alone text-screened sections; this is not 14 completely authorized exam papers. All25 frozen response-position denominator stays **1623**. Existing learner site **251 answer positions / G04S1 53**, **0 admitted** in this batch. Do not release entire original school PDF, figures/third-party reading content, or teacher answers as part of the Article 9 question-text scope. No official school direct-download URL independently verified.

## GitHub artifacts

- `data/source-archive/p12-art9-114-mingyi-g04s1-final28-original-questions-v1.json`
- `data/review/p12-art9-114-mingyi-final28-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v13.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-mingyi-final28-source-science-kp.test.mjs`
- Historical previous `tests/p12-art9-anhe-final35-source-science-kp.test.mjs` global queue assertions made monotonic, no changes to its fixed 35 source fixtures.

NEXT_RESUME_TASK = `P12_STANDALONE_B13_NextTextLayerPaper_Art9CompleteTFMC_SourceScienceKP` after PR CI, merge, postmerge CI and main readback.
