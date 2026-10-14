# P12 B13｜臺中市翁子國小 114 四上期末原始考題來源與 Science/KP

## Frozen PDF identity

- Original: `114_康軒_四上_自然_期末評量卷_翁子國小.pdf`; heading: `臺中市翁子國民小學114學年度第一學期四年級自然科學領域第二次定期學習評量試卷`.
- Connected Google Drive file ID: `1-Mi19WvmR6dlDtmcWhVatnEjj35wOVWZ`.
- **4 pages, 463404 bytes, SHA-256 `0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049`**, independently computed from the actual source PDF, equals frozen `data/review/p12-g04s1-114-kanghsuan-wengzi-final-80-source-map-v1.json`.
- Entire original paper: **80 original answer positions / 100 printed points**. S1 5 TF /10 points; S2 10 MC /20 points; S3 60 fill-in, judgment and illustrated positions /60 points; S4 5 reading questions /10 points.
- First page **15 independent original text questions** only: 5 TRUE_FALSE and 10 four-choice SINGLE_CHOICE, 40 original printed choices. Each has its authentic PDF first-page raw-character answer-marker bbox (top-left points); school source IDs are retained. S3/S4 are not represented as full independent questions here.
- S3 page 2-4 includes picture-tied reflection tasks, signal/lighting figures, circuit diagrams, shared scenario; S4 page 4 has an illustrated fan-motor reading passage and dependencies. Defer all those original positions for individual full-stimulus and science/KP/rights review. Do **not** treat page 1 15 questions as full-paper acceptance.
- Article 9(1)(5) legal school examination question-text scope only; no unapproved original images, full original PDF, teacher keys, or third-party passages included in source archive. No exact original public school download URL independently verified.

## Source Science/KP initial model review, not formal approval

| Gate | This 15-source batch |
|---|---:|
| Original independent TF/MC | 5 / 10 |
| Original MC printed options | 40 |
| Model science preliminary no obvious issue | **11** |
| SCIENCE HOLD | **4** |
| Four-up U03/U04 canonical KP strong candidate | **14** |
| KP review | **1** |
| KP strong and model science prelim pass | **11** |
| Printed-choice-label HOLD | **0** |
| Original teacher key, independent formal science, formal KP, learner-site admitted | **0 / 0 / 0 / 0** |

Original science HOLDs:
- `S1|TF|005`: adding more series-connected batteries can speed a DC fan **within ratings**, but no number/voltage/motor limits provided; original absolute suggestion cannot be certified without qualification. Same source position remains KP source-evidence REVIEW.
- `S2|MC|003`: question asks which sound statement is correct. Option ② (underwater dancers hear sound) is correct; ③ (after stopping striking a drum sound still exists) can also be scientifically true while vibrations persist briefly after the last strike. No unconditional unique answer.
- `S2|MC|004`: question says light changes its travel direction when striking which object. A mirror gives clear specular reflection, but walls, wood and dark paper still undergo diffuse reflection; no explicit specular requirement, so model does not certify only one physical response.
- `S2|MC|008`: the stem asks which component is usually inside moving fan and toy car. **③ 小馬達** is textbook-intended, but **④ 電線** is also commonly present, so the wording may permit two options.

Canonical mapping from the frozen first pass: **14 KP_MATCH_CANDIDATE, 1 KP_MATCH_SOURCE_EVIDENCE_HOLD**. Validate each original canonical KP ID against `site/data/authority/science-g03-g04-selector-v2.json`, no forced nonmatch.

## Cross-paper duplicate screening

The full new 15 original stem texts were normalized and compared with all previous **347** original archived occurrences. **0 normalized exact**. Automated CJK bigram set overlap ≥0.50 produced **10 lexical-similarity links**, but inspection indicates these are generally boilerplate `關於…敘述，下列哪一項正確` frames across **unrelated** topics. No link has been accepted as semantically identical question. Do not count lexical-only matches as real question duplicates or automatically drop original school provenance.

## Cumulative source-only counters

| Measure | Previous v13 | B13 | v14 |
|---|---:|---:|---:|
| Original question occurrences | 347 | +15 | **362** |
| TF | 166 | +5 | **171** |
| MC | 181 | +10 | **191** |
| MC printed options | 724 | +40 | **764** |
| Model science preliminary pass | 313 | +11 | **324** |
| Science HOLD | 34 | +4 | **38** |

Preexisting 2 printed-choice marker anomaly HOLDS remain independently open. Now **15/25 school source PDFs** have an initial independent-text-section extraction (not full-paper certification); original 25-paper full response-position denominator remains **1623**. Student-facing practice bank remains **251 existing response positions, G04S1 53, zero newly admitted**.

## Hand-off artifacts

- `data/source-archive/p12-art9-114-wengzi-g04s1-final15-original-questions-v1.json`
- `data/review/p12-art9-114-wengzi-final15-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v14.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-wengzi-final15-source-science-kp.test.mjs`
- Prior `tests/p12-art9-mingyi-final28-source-science-kp.test.mjs` updates only additive all25 queue expectations.

NEXT: follow the remaining paper in frozen priority order after PR CI, squash merge, main exact readback and postmerge CI/Pages readback. Never treat Article9 source archiving as learner quiz acceptance.
