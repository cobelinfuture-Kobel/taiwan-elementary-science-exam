# P12｜Public Exam Source Art9 Governance R1（正式學校試題公開原文來源庫）

## Operator approval
User approved to stop treating **every original school exam question** as private solely because of its original wording. Keep `source_archive` and `learner_exam_bank` wholly separate. This R1 migrates two exact original papers' independent text-only TF and four-choice MC questions into a **public GitHub source archive only**. It does **not** authorize learner-site admission, modify the 187-KP authority, dissolve 114 all-25-papers release rules, or add grouped/image/reading questions.

## Statutory basis and limits
- Taiwan Copyright Act Article 9(1)(5) excludes qualifying **examination questions held pursuant to regulations** from copyright subject matter. TIPO's explanations specifically include Taiwan elementary/junior high school student assessments held pursuant to the school performance-assessment regulations. School exams commissioned to publishers can qualify, but a publisher's stand-alone commercial question collection is **not automatically** an Article 9 exam.
- TIPO also emphasizes **teacher answer keys and creative solution explanations are not covered merely by Article 9**. Previously protected third-party readings, photographs, drawings or original publisher works embedded in an exam require item-level scrutiny; placement in an exam does not terminate underlying rights. Article 9 is not an unrestricted license to reproduce arbitrary complete PDFs.
- Authority: [Statute](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0070017), [TIPO school exams](https://www.tipo.gov.tw/tw/copyright/692-12107.html), [TIPO nonqualifying commercial source](https://www.tipo.gov.tw/tw/copyright/692-17037.html), [TIPO examination third-party media](https://www.tipo.gov.tw/tw/copyright/692-76110.html).
- For these two school-name original PDFs the original exam-page headers, academic year, assessment type, subject and SHA were read back; the school's public 114 G04 science textbook selection corroborates the 南一 label. **The exact original exam-PDF school-domain direct-download URL was not independently verified**. The archive therefore preserves its actual verified source acquisition from the user's connected Google Drive and does not invent a school-hosted file URL.

## Frozen 114 Yong'an first-page text-only corpus
| Original | Original binary SHA256 | TF | 4-choice MC | Source-only complete |
|---|---|---:|---:|---:|
| 114 G04S1 MID | `4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe` | 10 | 10 | 20 |
| 114 G04S1 FINAL | `88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf` | 8 | 14 | 22 |

**Total 42 exact source-ID-linked items (18 TF, 24 MC), 96 original choice entries**, with full stem, all printed choice text in original order, printed section/number, original page/PDF SHA and original answer-marker bbox.

### Approved scope
**YES in source archive:** exact official exam-question textual stem and options, normalized physical line wraps; source ID, original school/academic year/publisher label, printed order, source SHA and page, safe bbox, provisional science/KP review statuses.
**NO in source archive in this batch:** entire scanned exam pages, PDF originals, diagrams or photographs, third-party reading passages, teacher original answer keys, teacher explanations. These are neither needed nor asserted to be Article 9-cleared.
**NO learner delivery in this batch:** all 42 records have `site_question_bank_admitted=false`, including 38 initial model-science-no-obvious-flaw and **4 science HOLD**. Read-only source archival status is not academic correctness approval.

### Paper-specific quality holds
- MID TF004: undefined comparison in “生物種類較多”.
- MID MC007: pollution type may support increased growth; “usually will not” lacks determinate scope.
- FINAL TF005: temporal electricity-generation assertion.
- FINAL MC004: more than one incorrect energy statement (③ and ④).

Other 38 items remain **model preliminary**, **not teacher-key certified** nor **KP formal**. Nonmatching 45-KP source items may keep proposed cross-semester destinations, not change original academic-year provenance.

## Files
- `data/source-archive/p12-art9-114-yongan-g04s1-mid20-original-questions-v1.json`
- `data/source-archive/p12-art9-114-yongan-g04s1-final22-original-questions-v1.json`
- `data/source-archive/p12-art9-114-yongan-g04s1-42-index-v1.json`
- Prior `data/review` files, frozen source IDs and original review decisions remain unchanged. Historic PR #43/#44/#45 notes saying “not in public repo” describe **their state at that date**; the new dedicated Article9 source archive supersedes that default for these scoped pure-text source records.

## Future gates
`ORIGINAL_SCHOOL_REGULATED_EXAM_IDENTITY` → `TEXT_ONLY_NO_THIRD_PARTY_COPY` → `SOURCE_FULL_STEM_OPTIONS_BBOX` → `PUBLIC_SOURCE_ARCHIVE` (allowed before science signoff) → **separate** `SCIENCE_UNIQUE_ANSWER` → `CANONICAL_KP_FINAL` → `PRINT/FIGURE_AS_NEEDED` → `114_25PAPERS_FINAL_CANDIDATE_LIST` → `USER_EXPLICIT_LEARNER_ADMISSION` → `SITE_BANK`.

A model provisional answer, a public original stem, or a legal-source classification must **never** flip `CERTIFIED_PUBLIC` or enter `site/data/question-bank` automatically.

## Next execution
Continue the next text-layer original paper's first-page independent TF/MC under R1, keeping context groups/image puzzles in a separate stream and explicitly reviewing third-party material before any public source-archive item.
