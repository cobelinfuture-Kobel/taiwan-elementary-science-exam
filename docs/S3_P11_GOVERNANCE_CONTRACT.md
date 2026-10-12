# P11｜治理停點：Identity / Full Corpus / 187 KP

## Scope frozen
- Exactly 72 original O/X items, 20 context groups containing 76 answer slots, 148 published answer slots total.
- Exactly 16 units / 187 canonical knowledge points; no semantic or content edits to previous bank, no new questions.
- 8 exact source PDF hashes were recomputed from the mounted original PDF bytes and match repository source records.
- All generated governance outputs live under `site/data/governance/` and are deterministically built by `node tools/p11-governance.mjs --write`; `--check` byte-compares readback.
- CI and Pages both regenerate reports, verify readback, then test/ship them.

## Precise and provisional
- Source-level SHA-256: **8/8 present and independently checked from original PDF bytes during this governance pass**, but the source PDFs are not committed, so CI checks only recorded hash equality, not original bytes.
- Question identity: **148/148** unique; content and released-revision SHA-256 per question. A diagram-source bundle SHA is used for reconstructed diagrams; *per-diagram hash still needs separation*.
- Exact source-subitem position: **72 O/X** registered against printed numbered questions.
- Adapted group lineage: **76 context answer slots across 20 groups**, accurately attached to original PDF and broad section, but not claimed as 76 exact, text-identical, one-to-one source subquestions.
- Provisional source slot inventory: **477 positions** across all eight source papers; **405 positions not yet exactly matched** to a published item (some are represented by adapted group material, so this is NOT the count of unreviewed educational content).
- Exception: three-lower-mid water-state blanks have 22 visible response positions although printed section claims 20 points. Requires operator/visual adjudication.
- Source original long passages, graphics, choices and unreleased item stems have NOT been fully transcribed into the ledger; full exact per-subitem closeout remains OPEN. Do not report source corpus fully certified.
- All source positions without exact published mapping remain `SOURCE_SLOT_NOT_EXACTLY_CERTIFIED`; these are not automatically marked rejected.

## KP coverage
- 71 distinct *primary* KP covered / 187 total (37.97%, rounded to 38.0%); 116 primary KP missing.
- Every 16 unit currently has at least one question, but not every KP does.
- Source group secondary KP may be tallied separately but never substituted as a primary teaching coverage claim.

## Gates to reopen bulk admission
1. Fix mixed/source-version ambiguity and complete exact original subitem anchors for 405 positions or explicitly adjudicate acceptable exclusions/merges.
2. Resolve G03-S2-MID printed-score mismatch.
3. Add semantic near-duplicate detection and stronger independent answer verification when publishing substantially larger cohorts.
4. Reuse the P11 builder and CI readback for all future batches; do not overwrite source identity/history silently.
