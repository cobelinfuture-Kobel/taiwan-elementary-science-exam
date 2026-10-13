import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * Preflight-only gate. This function never changes the public question bank.
 * Every missing evidence field fails closed; 108–113 status is deliberately
 * absent from the predicate, per the operator's 114-year sequencing decision.
 */
export function evaluateG04S1114CorpusAdmission(policy, source, science, evidence = {}) {
  const failures = [];
  const requireGate = (id, ok) => { if (!ok) failures.push(id); };
  const is = (obj, key, value) => obj?.[key] === value;

  requireGate("CORRECT_114_OPERATOR_AUTHORITY",
    policy?.effective_year === 114 &&
    policy?.exact_source_paper_count === 25 &&
    policy?.current_kp_authority_count === 45 &&
    policy?.no_automatic_public_release === true &&
    policy?.scope_barrier?.years_explicitly_not_required?.join(",") === "108,109,110,111,112,113"
  );
  requireGate("ALL25_EXACT_SOURCE_POSITION_INVENTORY",
    is(source, "papers_with_all_textually_identifiable_answer_positions_mapped", 25) &&
    is(source, "all_identified_source_answer_positions_count", 1623) &&
    source?.source_papers?.length === 25);
  requireGate("ALL25_SCIENCE_BATCHES_COMPLETE",
    is(science, "source_papers_with_independent_model_science_review", 25));
  requireGate("ALL1285_KP_CANDIDATE_AND_UNCERTAIN_POSITIONS_REVIEWED",
    is(science, "model_independent_science_reviewed_positions_total", 1285));
  requireGate("ALL440_HOLD_KP_POSITIONS_REVIEWED",
    is(science, "original_440_hold_kp_queue_reviewed_distinct", 440) &&
    is(science, "original_440_hold_kp_queue_not_yet_reviewed", 0));
  requireGate("ALL845_GENERAL_KP_CANDIDATES_REVIEWED",
    is(science, "original_845_kp_candidates_reviewed_distinct", 845) &&
    is(science, "original_845_kp_candidates_not_yet_reviewed", 0));
  requireGate("FINAL25_SOURCE_PDF_HASHES_VERIFIED",
    evidence?.final_114_pdf_sha_verified_count === 25 &&
    typeof evidence?.sha_verification_manifest_ref === "string" &&
    evidence.sha_verification_manifest_ref.length > 0);
  requireGate("ALL_KP_DISPOSITIONS_AND_CORRECTIONS_TERMINAL",
    evidence?.all_1285_source_dispositions_final === true &&
    evidence?.unresolved_hold_public_admission_count === 0 &&
    evidence?.correctable_not_reexamined_public_admission_count === 0 &&
    evidence?.out_of_scope_public_admission_count === 0);
  requireGate("SCORING_GAPS_AND_SOURCE_EVIDENCE_TREATED_NONFABRICATED",
    evidence?.all_21_printed_score_points_reconciled_or_explicitly_excluded === true &&
    evidence?.no_fabricated_source_slot_ids === true);
  requireGate("FROZEN_114_CANDIDATE_MANIFEST_AND_DEDUP",
    evidence?.candidate_manifest_frozen === true &&
    evidence?.cross_paper_dedup_and_kp_coverage_checked === true &&
    typeof evidence?.final_114_candidate_manifest_ref === "string" &&
    evidence.final_114_candidate_manifest_ref.length > 0);
  requireGate("ALL_PROPOSED_LEARNER_ITEMS_PASS_ANSWER_RIGHTS_AND_PRINT",
    evidence?.all_proposed_answers_science_and_option_rechecked === true &&
    evidence?.all_proposed_images_redrawn_or_rights_cleared === true &&
    evidence?.all_proposed_A4_two_column_print_acceptance === true);
  requireGate("NEW_EXPLICIT_OPERATOR_APPROVAL",
    evidence?.explicit_operator_approved_final_candidate_manifest === true &&
    typeof evidence?.operator_approval_evidence_ref === "string" &&
    evidence.operator_approval_evidence_ref.length > 0);
  requireGate("PUBLIC_BANK_FROZEN_BEFORE_ADMISSION",
    source?.live_exam_answer_slots_still === 251 &&
    source?.g04s1_live_answer_slots_still === 53 &&
    science?.public_answer_positions_still === 251 &&
    science?.public_g04s1_answer_positions_still === 53);
  return {
    schema_version: "P12_G04S1_114_CORPUS_ADMISSION_PREFLIGHT_RESULT_V1",
    publication_ready: failures.length === 0,
    failed_gate_ids: failures,
    corpus_114_firstpass_complete: source?.papers_with_all_textually_identifiable_answer_positions_mapped === 25,
    current_science_reviewed_source_positions: science?.model_independent_science_reviewed_positions_total ?? 0,
    review_target: 1285,
    publication_mutation_performed: false
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const prefix = "data/review/p12-g04s1-114-";
  const read = p => JSON.parse(readFileSync(p, "utf8"));
  const policy = read("data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json");
  const source = read(prefix + "all25-kp-first-progress-v17.json");
  const science = read(prefix + "b02-science-figure-acceptance-progress-v2.json");
  // A standalone readback/preflight report. No public bank writes are made.
  process.stdout.write(JSON.stringify(evaluateG04S1114CorpusAdmission(policy, source, science), null, 2) + "\n");
}
