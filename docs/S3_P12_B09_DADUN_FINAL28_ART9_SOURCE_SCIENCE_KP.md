# P12 B09｜大墩國小 114 四上期末 Article9 原題來源 / QA / GitHub PR

## Frozen identity and source

- Original PDF: `114_康軒_四上_自然_期末評量卷_大墩國小.pdf`; **臺中市南屯區大墩國民小學**，114學年度第一學期第二次定期評量，四年級自然，4頁，561337 bytes.
- SHA256: `7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542`. The binary SHA matches `data/review/p12-g04s1-114-kanghsuan-dadun-final-64-source-map-v1.json`.
- Original entire paper is **64** response positions, scored 100 points. First two sections are TF15 and MC15, each 2 points. Only **14 complete independent TF** and **14 complete independent MC** on original pages 1–2 are admitted into this source-only text archive, 28 original source IDs and 56 printed `(1)`–`(4)` options.
- TF001 requires mirror reflection image B; MC006 requires the battery/lamp wiring image. Both remain frozen source positions but are **excluded** from independent no-figure questions. Page3 diagram tasks and page4 shared reading remain separate.
- Original PDF has hidden `O/X` and choice-answer text in its text layer. Visually printed student-answer areas have no visible authenticated teacher key. These hidden characters were excluded from original-question text and do not prove a school teacher's correct key.
- Each original source ID has the PDF page and true answer-marker character bbox. The source question wording and printed choice label order are preserved; no normalization of scientifically problematic stems.
- Preserve only qualifying school exam question text under Taiwan Copyright Act Article9(1)(5). Do not reproduce original full PDF, graphics/third-party passages or school teacher-answer text in the public archive. School exact official download URL not independently confirmed; Drive ID `1KQesPj7fM1T5OUOiT79ePwnjZ4GLx1d3` and original PDF SHA retained for traceability.

## Independent second-pass science and KP

| Review | Dadun FINAL005 |
|---|---:|
| Full standalone original TF and MC | 14 + 14 = 28 |
| Original four-choice entries | 56 |
| Model preliminary science no obvious issue | 26 |
| Model science HOLD | **2** |
| Strong G04S1 U03/U04 KP candidates | 26 |
| KP REVIEW | 2 |
| Science-model pass AND KP-strong | 24 |
| Teacher-key authenticated / formal science / formal KP / learner site approved | **0 / 0 / 0 / 0** |

- `S1|TF|002` science HOLD: a mirror being 'left-right reversed' requires a precise observer/coordinate convention; original text kept.
- `S2|MC|008` science HOLD: '打開開關' may mean the appliance is turned on (closed conducting circuit) or an open switch (open circuit). Options (2) and (3) depend on reading; source text and original printed options retained.
- `S2|MC|007` KP REVIEW: prior source evidence HOLD; `S2|MC|015` KP REVIEW: frozen mapping uncertain; do not automatically upgrade.
- Cross-exam comparison with the **previous 225** complete original source occurrences: zero normalized exact or high-threshold similar original stems in this round (per previous full 225-source screening).
- Source model provisional answers are review notes, not authenticated teacher answers. No learner-facing admission.

## Source-only cumulative v10

Earlier v9 = **225** full original source occurrences (108TF,117MC,468 original options), model science 203 preliminary pass/22 HOLD. New Dadun final contributes 28 (=14TF+14MC,56 original options), model science 26 preliminary pass/2 HOLD.

New v10 = **253** occurrences, **122TF/131MC**, 524 options, **229** science model preliminary pass/**24** science HOLD. One earlier separately categorized source printed-choice-label HOLD remains open. Started standalone text-only screening in **11/25** original paper sources; does not mean eleven whole exams fully reviewed.

All25 frozen original denominator **1,623** answer positions remains unchanged. Student site still **251 total answer positions, G04S1 53**; B09 adds **0** learner questions.

## Durable PR changes

- `data/source-archive/p12-art9-114-dadun-g04s1-final28-original-questions-v1.json`
- `data/review/p12-art9-114-dadun-final28-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v10.json`
- Updated `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-dadun-final28-source-science-kp.test.mjs`
- Updated predecessor `tests/p12-art9-dongguang-mid26-source-science-kp.test.mjs` with monotonic global queue assertions, without changing Dongguang source semantic fixtures.

NEXT_RESUME_TASK = `P12_STANDALONE_B09_NextTextLayerPaper_Art9CompleteTFMC_ScienceKP`; first verify PR CI, merge, postmerge readback, then follow frozen queue, never conflate source archive and formally certified site questions.
