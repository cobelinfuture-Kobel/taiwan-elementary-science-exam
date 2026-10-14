# P12 B14｜桃園市蘆竹區大華國小 114 四上期中 Article9 Source + Science/KP

## Source authority

- Original PDF: `114_翰林_四上_自然_期中評量卷_大華國小.pdf`. Original heading: 桃園市蘆竹區大華國小114學年度上學期四年級自然科學期中評量試卷.
- Connected Google Drive file ID: `1Tf8dvnMnaw1DJoZQQXTptRfcjt2Krbor`.
- Actual PDF binary **291280 bytes, 2 pages, SHA-256 `d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6`**, matches frozen `data/review/p12-g04s1-114-hanlin-dahua-mid-50-source-kp-first-v1.json`. Both pages rendered and visually inspected.
- Frozen 50 school-original positions/100 printed points: S01 10 TF ×2 =20, S02 14 MC ×2 =28, S03 21 scored source subitems =42, S04 5 reading positions =10.
- Independent complete textual Article9 original questions in first page: **S01 10 TF + S02 13 MC =23 source occurrences**, all 52 original four-choice alternatives, immutable per-school IDs, physical page-one answer-marker raw-character PDF bounding rectangles.
- S02 MC006 reads "回到家後，鈺晴提醒她可以利用網路查詢，請問應該到哪一個網站查詢呢？" and uses the prior MC005 context about why one cannot see the Moon; without that antecedent the queried subject is missing. It is a valid source question but **excluded from self-standing text** and remains frozen for later shared-narrative handling.
- S03 figure-dependent lunar-phase arrangement, organism and plant identification, fish anatomy and S04 grouped `地球上最孤獨的鯨魚` reading passage are deferred. The passage is attributed to Wikipedia and is **not copied** into the Article9 public question-text source archive.
- Preserve original printed wording including MC002 option① `面相月亮` typo, never silently rewrite source wording based on science model meaning. Preserve native ①–④ labels and PDF source geometry.
- The school question text is archived only within qualifying Article9(1)(5) scope; no full original PDF, third-party images or Wikipedia passage, and no unauthenticated original teacher answer key. School-specific direct public PDF URL has not been independently verified.

## Model Science and frozen canonical KP review

| Gate | Dahua MID010 batch |
|---|---:|
| Complete original text TF / MC | 10 / 13 |
| Printed MC alternatives | 52 |
| Science model preliminary no obvious problem | 18 |
| **SCIENCE HOLD** | **5** |
| G04S1 KP strong candidate | 8 |
| KP REVIEW | 4 |
| KP NONMATCH current authority | 11 |
| Both model-science pass and KP strong | 5 |
| Source printed choice HOLD | 0 |
| Teacher-key authenticated / formal science / formal KP / site admissions | 0 / 0 / 0 / 0 |

The five **independent science HOLDS**, all preserving the original exact stem:
- `S01|TF|006`: The joint wording places both water hyacinth and a baseball floating because of "its" air-tissue petiole. Water hyacinth has aerated petioles but the ball does not; intended referent/scope is ambiguous.
- `S01|TF|009`: A universal statement that *any* natural/artificial water body at or below six metres at low tide is automatically a Ramsar wetland overextends the precise scope of the marine low-tide six-metre provision.
- `S02|MC|007`: Noon Sun elevation at Taoyuan changes with date/season. No observation date is supplied, so 20/40/60/80 degree choices cannot form an unconditional single answer.
- `S02|MC|011`: Flexible waterweed is related to submerged growth, but reducing water depth does not guarantee the *entire* plant remains submerged independent of plant height/water level.
- `S02|MC|013`: Tadpole-to-frog metamorphosis affects breathing, movement, habitat and skin physiology; "skin state" is not sufficiently defined as a definite invariant.

KP distribution is materially different from the prior 康軒 source-paper line: this is **翰林** publisher and contains many lunar/astronomy questions. Follow the frozen current G04S1 Canonical KP: 8 matches, 4 uncertain review and 11 nonmatches. **Do not invent KP mappings** by redefining lunar astronomy as existing Kanghsuan U01 or U02 topics. Retain all 23 as original-source provenance; none is automatically admitted to the student website.

## Cross-school compare and source-only cumulative

- Compared exact and CJK-bigram set lexical overlap ≥0.50 for all 23 new stems against the preceding **362** full-original source occurrences; **0 normalized exact and 0 above the threshold**. The source archive counts originals by appearance, not deduplicated concept.
- Cumulative `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v15.json`:

| Measure | Before v14 | Dahua | After v15 |
|---|---:|---:|---:|
| School original source occurrences | 362 | 23 | **385** |
| TF | 171 | 10 | 181 |
| MC | 191 | 13 | 204 |
| Printed MC choices | 764 | 52 | 816 |
| Model science preliminary pass | 324 | 18 | **342** |
| Model science HOLD | 38 | 5 | **43** |

- Pre-existing separately categorized printed-choice-marker HOLDs stay at **2**. Now **16/25** paper sources have partial independent-text extraction only; this does *not* constitute full-paper screening of pictures, reading or source-response positions.
- Frozen all25 **1,623 school answer positions** retained. Learner website stays **251 total/G04S1 53 answer positions**, zero new learner admissions.

## Durable files

- `data/source-archive/p12-art9-114-dahua-g04s1-mid23-original-questions-v1.json`
- `data/review/p12-art9-114-dahua-mid23-science-kp-secondpass-v1.json`
- `data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v15.json`
- `data/review/p12-standalone-all25-source-first-queue-v1.json`
- `tests/p12-art9-dahua-mid23-source-science-kp.test.mjs`
- Predecessor Wengzi test adjusted only for additive global-queue counts.

Next after PR CI/main exact readback: `P12_STANDALONE_B15_TAOZIJIAO_MID_Art9CompleteTFMC_SourceScienceKP`.
