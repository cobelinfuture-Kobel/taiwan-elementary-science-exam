# P12 B11｜新北市土城區安和國民小學 114 四上期末 Article9 Source/Science/KP

## Source verification
- Frozen ID: `SCI_G04_S1_114_FINAL_007`; exact school PDF `114_康軒_四上_自然_期末評量卷_安和國小.pdf`, stored in connected Drive as `1dRJk3FJ_Ua_FFl8tla30iMbMzgcQfbGz`.
- Original school: **新北市土城區安和國民小學**, 114學年度第一學期第二次定期考查，自然與生活科技（四年級）。
- Verified 2 PDF pages, 365111 bytes and SHA-256 `5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2`, identical to frozen `data/review/p12-g04s1-114-kanghsuan-anhe-final-50-source-kp-first-v1.json`.
- The complete original paper has **50 answer positions, 100 points**: section 1 **15 TF ×2**, section 2 **20 MC ×2**, section 3 **13 diagram/experiment positions ×2**, section 4 **two Edison reading positions ×2**. Archive here is only **35 independent complete TF/MC source questions**, with 80 original choice alternatives and actual first/second-page answer-marker PDF character boxes.
- Image-based reflection and circuit diagrams and shared Edison reading passages are deferred. Do not falsely call this a complete 50-position paper admission.
- Rights: school-examination original question text only, pursuant to Taiwan Copyright Act Article 9(1)(5); do not publish the entire PDF, graphics, third-party text or teacher answers. No official exact school download URL has been confirmed. Preserved connected-source ID and exact PDF hash.

## Independent science and KP model screening

| Review | This source |
|---|---:|
| Original independent complete TF / MC | 15 / 20 |
| MC alternatives | 80 |
| Model science prelim pass | 29 |
| Science HOLD | **6** |
| KP strong candidate | **29** |
| KP review | **4** |
| KP nonmatch G04S1 | **2** |
| Science pass intersect KP strong | **24** |
| Teacher-key / formal science / formal KP / learner-site newly admitted | **0 / 0 / 0 / 0** |

Six science holds:
- `S01|TF|006`: nonuse duration not given, so battery left in appliance depends on storage period.
- `S01|TF|008`: extension-cord overload cannot be inferred from the number of appliances alone; total wattage and the rated load matter.
- `S02|MC|009`: an unconditional brightest-lamp connection needs circuit and battery specification.
- `S02|MC|010`: square-block shadow varies with 3-D block geometry, light direction and screen orientation.
- `S02|MC|016`: clamping a paper-cup telephone cord may damp vibration, but does not invariably eliminate all sound.
- `S02|MC|020`: failed-cell and series/parallel brightness depend on actual electrical specifications and comparison.

**Separate original printed-source anomaly:** MC008 visibly prints circled answer labels **① ② ③ ③ ④** with an extra ③ after the second choice, though there are only four substantive text options. Preserve original wording, original five printed marker appearances and Source ID; do not auto-normalize print inconsistency. This is a SOURCE PRINT HOLD independently of science decisions.

The frozen first-pass KP mapping has 30 initial matching candidates and three uncertain cases plus two nonmatches. The already-reviewed second pass deliberately places **MC017** in KP REVIEW rather than automatically upgrading it; resulting totals **29 strong /4 review /2 nonmatch**. Recomputing intersections from each of the 35 records gives **24** (the earlier precommit review field said 23 by mistake).

## Cross-paper duplication and traceability

Compared all earlier **284** original school-question occurrences with all 35 original stems. **1 normalized exact** pair: Anhe `SCI_G04_S1_114_FINAL_007|S02|MC|017` vs Dadun final `SCI_G04_S1_114_FINAL_005|S2|MC|001`, both on reversing a small motor by changing battery polarity. **Four distinct near matches** (same original school IDs preserved), detailed in `data/review/p12-art9-114-anhe-final35-science-kp-secondpass-v1.json`. An exact duplicate is not a reason to discard either original source appearance from the provenance archive.

## Source-only cumulative vs learner site

| Counter | Previous v11 | Added | New v12 |
|---|---:|---:|---:|
| Source-original question occurrences | 284 | 35 | **319** |
| True/false | 136 | 15 | **151** |
| Four-choice | 148 | 20 | **168** |
| Printed choice alternatives | 592 | 80 | **672** |
| Preliminary model-science pass | 259 | 29 | **288** |
| Science HOLD | 25 | 6 | **31** |

Printed-choice-marker anomalies cumulative **1→2**. Initial stand-alone text-screened school PDFs now **13/25**, with full original 25-school **1623 answer positions** unchanged. **Learner-facing bank remains 251 total, G04S1 53, zero new admissions**. All25 / independent source, science, KP, operator review gates are preserved.

## Source files and code acceptance

- `data/source-archive/p12-art9-114-anhe-g04s1-final35-original-questions-v1.json`
- `data/review/p12-art9-114-anhe-final35-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v12.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-anhe-final35-source-science-kp.test.mjs`
- Previous Minquan `tests/p12-art9-minquan-final31-source-science-kp.test.mjs` changed only its globally additive all25 count assertions.

Next task after PR CI, merge and current-main readback: `P12_STANDALONE_B12_NextTextLayerPaper_Art9CompleteTFMC_SourceScienceKP`.
