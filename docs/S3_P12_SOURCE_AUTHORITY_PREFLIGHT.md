# SCIENCE_EXAM_S3_P12_SourceAuthorityPreflight

This is a *queue-preparation* phase only. No questions are added, no answers are modified, and no KP definitions are changed.

R1 confirmed:
- 477 original source answer positions in 8 school PDFs.
- 72 already anchored O/X positions.
- 79 source positions connected to 76 published reconstructed context answers.
- 326 remaining source positions are candidates for P12 screening, **not 326 approved or independently mixable questions**.

P12 prioritizes G03-S2-MID, G03-S2-FINAL, G04-S2-MID, G04-S2-FINAL, followed by semester 1 sources. Candidate processing must keep source PDF SHA, exact original question location, canonical KP, correct science answer with assumptions, visual dependency check, near-duplicate check, grouping, and original-vs-paraphrase lineage. Pending questions must NOT auto-publish.

The frozen queue is created by `node tools/p12-source-preflight.mjs --write`, read back via `--check`, and archived in `site/data/governance/p12-frozen-candidate-queue.json`. Next execution task: `SCIENCE_EXAM_S3_P12_G03S2MID_FullPaperCandidateScreening`.
