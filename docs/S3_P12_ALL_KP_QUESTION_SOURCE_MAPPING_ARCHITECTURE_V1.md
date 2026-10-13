# P12 ALL-KP QUESTION-SOURCE MAPPING ARCHITECTURE V1

## Operator-approved direction

**One immutable original response-position source catalog; all current and future science KP are independently searchable across all available original questions.** Original exam title / publisher / year / grade / semester are provenance; the learner's eligible KP target is separate. One source item can map to zero, one or many KP; one KP can map to many original source items. A newly introduced KP must be eligible for a complete existing source-corpus semantic review **without re-downloading or re-extracting evidence-complete original PDFs**.

**A first-pass source map and a KP search hit do not constitute science verification, original teacher-answer-key verification, legal image use, pedagogical acceptance or approved public admission.**

Approved policy: \`data/governance/p12-all-kp-source-projection-authority-v1.json\`.

## Existing authoritative input, reconciled

- \`site/data/authority/science-g03-g04-selector-v2.json\`: **187 existing canonical KP**, graded G03-S1=47, G03-S2=49, G04-S1=45, G04-S2=46.
- \`data/review/p12-g04s1-114-all25-kp-first-progress-v17.json\`: 114 academic-year Grade4 Upper original **25 papers**, **1,623 distinguishable source answer positions** (source response positions, not necessarily distinct stand-alone exam questions).
- Keep all **338** archived \`NONMATCH_G04S1_KP_ARCHIVE\`, all **115** uncertain and **325** evidence-held source positions visible for every *other* KP now or added later; a legacy G04S1 nonmatch is **not** a G04S2 nonmatch.
- The pre-existing split paper fragments are consulted via their unchanged manifest paths. No rewriting their original ID or source PDF hash. Four \`SCORE_POINT_GAP_NOT_A_CERTIFIED_SOURCE_POSITION\` placeholders from 永安 final are **not** indexed as genuine question slots.
- Separate B01–B04 source-ID science outcome annotations are joined **without changing first-pass KP decisions**: 145 independently science reviewed; cumulative 121 \`FULL_PASS\`, 13 \`CORRECTABLE\`, 10 \`HOLD\`, 1 \`REJECT\`.
- Existing public bank remains **251 overall / 53 G04S1**; zero new public question positions. User-approved 114 full-25-screening-before-admission rule remains frozen.

## Architecture, query semantics and evidence states

\`tools/p12-all-kp-source-mapping.mjs\` builds the internal, deterministic \`P12_ALL_KP_SOURCE_QUESTION_INDEX_V1\` containing:

| Namespace | Contents |
|---|---|
| \`authority_kps\` | Every current Authority KP ID, grade/semester/unit/title and content version SHA256, even when no candidate exists |
| \`original_source_items\` | All 1,623 original source IDs, exact paper identity, exact containing source JSON ref, original excerpt (may be just a summary), PDF SHA if known, unverified figure/source fields, original G04S1 first-pass decision and version fingerprint, independently judged science verdict evidence from B01–B04 |
| \`mapping_edges\` | Many-to-many (source ID, KP ID, projection kind, immutable source and KP fingerprints, decision, evidence ref, \`NOT_VERIFIED_FOR_ADMISSION\`) |
| \`by_kp\` | Reverse lookup for **all 187 KP**, candidate source IDs, completeness flags and no unsupported zero-coverage claims |
| \`scope\` | 25 sources, 1,623 original positions, 187 KP, potential full-review matrix **303,501** pairs, science B01–B04 reviewed count |
| \`public_admission_lock\` | Zero public additions; no teacher key or copyright/diagram acceptance inferred |

**Important status distinction:** Existing G04S1 links are **legacy first-pass candidates only**. The four new G04S2 links are \`MANUAL_CROSS_SCOPE_PROPOSAL\` / \`CANDIDATE_REQUIRES_SOURCE_AND_KP_REVIEW\`; they exist only to verify cross-semester connectivity. **The 303,501 source–KP semantic comparisons have NOT been performed.** The graph provides a source corpus and KP-indexed review mechanism. It does not claim every relevant possible edge has been found, nor that any KP has been exhaustively searched.

A KP returning zero candidates currently returns \`NOT_YET_MAPPED_NOT_EVIDENCE_OF_MISSING\`, not \`MISSING\`. To mark a KP genuinely missing from the available source corpus requires a subsequent, separately evidenced, complete scoped review.

### Concrete cross-semester examples

\`data/review/p12-all-kp-114-semester-cross-candidate-overlay-v1.json\` keeps four source IDs **from an original fourth-grade upper paper** and points to separate G04S2 KP candidates:

- \`SCI_G04_S1_114_MID_010|S02|MC|003\` → \`sci_g04s2_01_12\` (lunar date and phase)
- \`SCI_G04_S1_114_MID_010|S02|MC|004\` → \`sci_g04s2_01_11\` (recurrent moon phase)
- \`SCI_G04_S1_114_MID_010|S02|MC|002\` → \`sci_g04s2_01_08\` (moon-direction measurement)
- \`SCI_G04_S1_114_MID_010|S01|TF|002\` → \`sci_g04s2_01_02\` (day/night visible celestial bodies)

These associations are grounded in existing first-pass original **summaries**, **not** confirmed source exact-text/diagram option-level review. Source paper retains G04-S1 metadata regardless of the candidate KP semester.

## Build, query, incremental update

Within the repo:

\`\`\`bash
npm test
npm run kp:index:summary
npm run kp:index:build
npm run kp:index:check
\`\`\`

The build writes the internal artifact \`data/index/p12-all-kp-114-source-index-v1.json\`, and check recomputes the entire index and compares bytes. The CI workflow builds and checks this artifact on PR/main, then publishes an **Actions artifact named \`p12-all-kp-114-source-index-v1\`**, separate from the Pages site. Not a public-bank deploy.

Exports for future internal tooling:
- \`buildAllKpSourceIndex()\`
- \`lookupByKp(index, canonical_kp_id)\`
- \`lookupBySource(index, exact_original_source_id)\`
- \`planIncrementalProjection(previousIndex, updatedIndex)\`

The plan compares exact source-version and KP-definition SHA fingerprints. New or changed KP → all unchanged and new source IDs are scheduled as KP/source pairs for the separate semantic assessment. Changed source evidence → all unchanged/new KP IDs are potentially affected. Completely unchanged version pairs may reuse prior human-reviewed evidence. Removed IDs produce tombstone lists. **The incremental planner produces a work queue and does not purport to perform language-model semantic certification automatically.**

Example: adding one fifth-grade KP to the current 1,623 sources creates **1,623 potential semantic-review pairs** without requiring any existing PDF to be re-downloaded.

## Stop gates and what V1 does not do

- Existing source summaries can be incomplete or erroneous (for example Batch04 mislabels source fish chest fin as tail fin); high-fidelity semantic review must return to the exact original PDF/visual evidence when needed.
- Do not reclassify or mutate 108–114 historical decisions, original source PDFs, or the 114 full-corpus admission decision.
- Do not turn matching into automatic publication or copyright clearance.
- V1 implements **searchable architecture, source indexing, candidate-edge representation, and future incremental assessment planning**. V2 still needs item-level, source-evidenced cross-grade-semester semantic assessment of all relevant original sources, and candidate promotion rules. In particular, **all 187 KP do not yet have completed matches**.
- Follow the already-approved 114 rule: no newly sourced public admission until all 114 25 originals are screened, a consolidated eligible candidate manifest is accepted, and operator gives separate explicit approval.
- The next source-science screening is \`P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch05\`; this new index does not alter Batch01–Batch04 or that queue.
