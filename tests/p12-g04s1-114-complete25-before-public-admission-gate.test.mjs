import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluateG04S1114CorpusAdmission } from "../tools/p12-g04s1-114-corpus-admission-preflight.mjs";
const read = p => JSON.parse(readFileSync(p,"utf8"));
const prefix = "data/review/p12-g04s1-114-";
const policy = read("data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json");
const source = read(prefix+"all25-kp-first-progress-v17.json");
const science = read(prefix+"b02-science-figure-acceptance-progress-v2.json");
const old = read("data/governance/p12-g04s1-108114-kp-first-authority-v1.json");
test("Operator-approved 114-only corpus closeout defers admissions but not future 108–113 source discovery",()=>{
 assert.equal(policy.effective_year,114);
 assert.equal(policy.exact_source_paper_count,25);
 assert.equal(policy.current_kp_authority_count,45);
 assert.deepEqual(policy.scope_barrier.years_required_before_114_public_release,[114]);
 assert.deepEqual(policy.scope_barrier.years_explicitly_not_required,[108,109,110,111,112,113]);
 assert.equal(policy.scope_barrier.original_108_114_candidate_eligibility_unchanged,true);
 assert.equal(policy.scope_barrier.no_revision_to_legacy_kp_screening_authority,true);
 assert.equal(old.canonical_scope.kp_count,45);
 assert.equal(old.no_bulk_admission,true);
 assert.deepEqual(policy.phase_sequence.map(x=>x.phase),["A","B","C","D"]);
 assert.equal(policy.phase_sequence[0].baseline_status,"COMPLETE");
 assert.equal(policy.phase_sequence[1].baseline_status,"IN_PROGRESS");
 assert.equal(policy.phase_sequence[3].baseline_status,"BLOCKED");
 assert.equal(policy.next_resume_task,"P12_G04S1_114_ALL25_ScienceAnswerVerdictAndFigureEvidence_Batch03");
});
test("Actual main B02 62/1285 is NOT sufficient to publicly admit from 114",()=>{
 const before=JSON.stringify({source,science});
 const r=evaluateG04S1114CorpusAdmission(policy,source,science);
 assert.equal(r.publication_ready,false);
 assert.equal(r.corpus_114_firstpass_complete,true);
 assert.equal(r.current_science_reviewed_source_positions,62);
 assert.equal(r.review_target,1285);
 assert.ok(r.failed_gate_ids.includes("ALL25_SCIENCE_BATCHES_COMPLETE"));
 assert.ok(r.failed_gate_ids.includes("ALL1285_KP_CANDIDATE_AND_UNCERTAIN_POSITIONS_REVIEWED"));
 assert.ok(r.failed_gate_ids.includes("ALL440_HOLD_KP_POSITIONS_REVIEWED"));
 assert.ok(r.failed_gate_ids.includes("ALL845_GENERAL_KP_CANDIDATES_REVIEWED"));
 assert.ok(r.failed_gate_ids.includes("NEW_EXPLICIT_OPERATOR_APPROVAL"));
 assert.equal(r.publication_mutation_performed,false);
 assert.equal(JSON.stringify({source,science}),before);
 assert.equal(source.all_identified_source_answer_positions_count,1623);
 assert.equal(science.original_440_hold_kp_queue_not_yet_reviewed,390);
 assert.equal(science.original_845_kp_candidates_not_yet_reviewed,833);
 assert.equal(science.public_answer_positions_still,251);
 assert.equal(science.public_g04s1_answer_positions_still,53);
});
test("Full 114 completion plus real operator admission evidence would be enough, even without 108–113 screening",()=>{
 const done={...science,
  source_papers_with_independent_model_science_review:25,
  model_independent_science_reviewed_positions_total:1285,
  original_440_hold_kp_queue_reviewed_distinct:440,
  original_440_hold_kp_queue_not_yet_reviewed:0,
  original_845_kp_candidates_reviewed_distinct:845,
  original_845_kp_candidates_not_yet_reviewed:0
 };
 const evidence={
  final_114_pdf_sha_verified_count:25,
  sha_verification_manifest_ref:"data/review/FINAL_114_ORIGINAL_SHA_PROOF.json",
  all_1285_source_dispositions_final:true,
  unresolved_hold_public_admission_count:0,
  correctable_not_reexamined_public_admission_count:0,
  out_of_scope_public_admission_count:0,
  all_21_printed_score_points_reconciled_or_explicitly_excluded:true,
  no_fabricated_source_slot_ids:true,
  candidate_manifest_frozen:true,
  cross_paper_dedup_and_kp_coverage_checked:true,
  final_114_candidate_manifest_ref:"data/review/FINAL_114_OPERATOR_CANDIDATE.json",
  all_proposed_answers_science_and_option_rechecked:true,
  all_proposed_images_redrawn_or_rights_cleared:true,
  all_proposed_A4_two_column_print_acceptance:true,
  explicit_operator_approved_final_candidate_manifest:true,
  operator_approval_evidence_ref:"data/review/FINAL_OPERATOR_APPROVAL.json"
 };
 // Synthetic future evidence is used only for logic tests, not asserted to exist.
 assert.equal(evaluateG04S1114CorpusAdmission(policy,source,done,evidence).publication_ready,true);
 assert.equal(evaluateG04S1114CorpusAdmission(policy,source,done,{...evidence,explicit_operator_approved_final_candidate_manifest:false}).publication_ready,false);
 assert.equal(evaluateG04S1114CorpusAdmission(policy,source,done,{...evidence,unresolved_hold_public_admission_count:1}).publication_ready,false);
 assert.equal(evaluateG04S1114CorpusAdmission(policy,source,done,{...evidence,final_114_pdf_sha_verified_count:22}).publication_ready,false);
});
