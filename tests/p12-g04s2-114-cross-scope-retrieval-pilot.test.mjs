import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildAllKpSourceIndex } from "../tools/p12-all-kp-source-mapping.mjs";
import { buildG04S2RetrievalPilot, RETRIEVAL_RULES, TARGET_PREFIX, BENCHMARK_PATH } from "../tools/p12-g04s2-114-cross-scope-retrieval-pilot.mjs";

const index=buildAllKpSourceIndex();
const pilot=buildG04S2RetrievalPilot({index});
const sha=(id)=>index.original_source_items.find(q=>q.source_id===id)?.source_version_sha256;
test("Full original source × every 46 grade-four second-semester KP is eligible for noncertifying pilot retrieval",()=>{
 assert.equal(Object.keys(RETRIEVAL_RULES).length,46);
 assert.equal(pilot.scope.papers,25);
 assert.equal(pilot.scope.source_response_positions,1623);
 assert.equal(pilot.scope.target_kp_count,46);
 assert.equal(pilot.scope.source_kp_pairs_automatically_screened_for_retrieval,74658);
 assert.equal(pilot.scope.all_46_kp_have_rules,true);
 assert.equal(pilot.per_kp.length,46);
 assert.equal(pilot.scope.full_original_question_option_figure_level_kp_pair_reviews_completed,0);
 assert.equal(pilot.scope.exhaustive_semantic_recall_proven,false);
 assert.equal(pilot.scope.source_summary_not_full_question,true);
 assert.equal(pilot.scope.no_public_admissions,true);
 assert.equal(pilot.scope.frozen_public_total_answer_positions,251);
 assert.equal(pilot.scope.frozen_public_g04s1_answer_positions,53);
 assert.deepEqual(pilot.per_unit.map(x=>[x.unit,x.kp_count]),[["U01",12],["U02",11],["U03",12],["U04",11]]);
 for(const k of pilot.per_kp){
   assert.ok(k.kp_id.startsWith(TARGET_PREFIX));
   assert.equal(k.source_positions_evaluated_for_retrieval,1623);
   assert.equal(k.exhaustive_semantic_assessment_complete,false);
   assert.equal(k.exact_source_science_kp_verified_count,0);
   assert.ok(k.lexical_retrieval_count>=0);
 }
});
test("Candidate edges are source- and KP-version bound, not teacher certified or accepted",()=>{
 assert.ok(pilot.candidate_edges.length>45);
 assert.equal(pilot.candidate_edges.length,pilot.retrieved_candidate_pair_count);
 assert.equal(new Set(pilot.candidate_edges.map(e=>e.source_id+"|"+e.kp_id)).size,pilot.candidate_edges.length);
 assert.equal(new Set(pilot.candidate_edges.map(e=>e.source_id)).size,pilot.distinct_candidate_source_positions);
 const kp=new Map(index.authority_kps.map(k=>[k.kp_id,k]));
 for(const e of pilot.candidate_edges){
  assert.equal(e.retrieval_status,"RETRIEVED_NOT_SEMANTICALLY_CERTIFIED");
  assert.equal(e.kp_verified,false);
  assert.equal(e.teacher_key_verified,false);
  assert.equal(e.public_admission_approved,false);
  assert.equal(e.source_exact_options_and_figure_verified,false);
  assert.equal(e.source_version_sha256,sha(e.source_id));
  assert.equal(e.kp_version_sha256,kp.get(e.kp_id).authority_content_sha256);
  assert.ok(e.matched_rule_indices.length>=1);
 }
});
test("V1 cross-semester four moon candidate sources continue to be retrievable",()=>{
 const list=[
 ["SCI_G04_S1_114_MID_010|S02|MC|003","sci_g04s2_01_12"],
 ["SCI_G04_S1_114_MID_010|S02|MC|004","sci_g04s2_01_11"],
 ["SCI_G04_S1_114_MID_010|S02|MC|002","sci_g04s2_01_08"],
 ["SCI_G04_S1_114_MID_010|S01|TF|002","sci_g04s2_01_02"]
 ];
 const set=new Set(pilot.candidate_edges.map(e=>e.source_id+"|"+e.kp_id));
 for(const [source,kp] of list)assert.ok(set.has(source+"|"+kp),source+" → "+kp);
});
test("Manual semantic challenge set records known lexical false negatives and broad-match false positive, without claiming corpus-wide accuracy",()=>{
 const counts=pilot.adjudication_sample;
 assert.equal(counts.count,45);
 assert.equal(counts.alignment_plausible_summary_only,29);
 assert.equal(counts.negative_nonalignment_summary_only,13);
 assert.equal(counts.insufficient_original_evidence,3);
 assert.equal(counts.observed_rule_hit_in_positive_summary_samples,26);
 assert.equal(counts.observed_false_hits_in_negative_summary_samples,1);
 assert.equal(counts.externally_validated_true_recall_or_precision,false);
 assert.equal(pilot.audited_source_kp_pairs.filter(x=>x.adjudication==="ALIGNMENT_PLAUSIBLE_FROM_SOURCE_SUMMARY"&&!x.retrieval_observed).length,3);
 assert.equal(pilot.audited_source_kp_pairs.filter(x=>x.adjudication==="NONALIGNMENT_FROM_SOURCE_SUMMARY"&&x.retrieval_observed).length,1);
 const semanticWrong=pilot.audited_source_kp_pairs.find(x=>x.source_id==="SCI_G04_S1_114_FINAL_004|S02|MC|005"&&x.kp_id==="sci_g04s2_04_05");
 assert.equal(semanticWrong.adjudication,"NONALIGNMENT_FROM_SOURCE_SUMMARY");
 assert.equal(semanticWrong.retrieval_observed,true);
 const lexicalMiss=pilot.audited_source_kp_pairs.find(x=>x.source_id==="SCI_G04_S1_114_MID_001|TF|S01|003"&&x.kp_id==="sci_g04s2_01_12");
 assert.equal(lexicalMiss.adjudication,"ALIGNMENT_PLAUSIBLE_FROM_SOURCE_SUMMARY");
 assert.equal(lexicalMiss.retrieval_observed,false);
});
test("Wrong semester title and nearby vocabulary cannot suppress or certify a genuine semantic relation",()=>{
 const moon=pilot.candidate_edges.find(e=>e.source_id==="SCI_G04_S1_114_MID_010|S02|MC|004" && e.kp_id==="sci_g04s2_01_11");
 assert.equal(moon.firstpass_g04s1_status,"NONMATCH_G04S1_KP_ARCHIVE");
 assert.equal(moon.retrieval_status,"RETRIEVED_NOT_SEMANTICALLY_CERTIFIED");
 const unrelated=pilot.audited_source_kp_pairs.find(x=>x.source_id==="SCI_G04_S1_114_MID_006|S01|TF|002"&&x.kp_id==="sci_g04s2_03_07");
 assert.equal(unrelated.adjudication,"NONALIGNMENT_FROM_SOURCE_SUMMARY");
 assert.equal(unrelated.retrieval_observed,false); // 栗喉蜂虎 is a bird, not an insect
});
test("Regeneration of pilot is deterministic and source data stays original",()=>{
 const replay=buildG04S2RetrievalPilot({index});
 assert.equal(JSON.stringify(pilot),JSON.stringify(replay));
 assert.equal(pilot.publication_gate,"CANDIDATES_AND_LIMITED_SOURCE_SUMMARY_AUDITS_ONLY_NO_KP_VERIFICATION_OR_PUBLIC_ADMISSION");
 assert.equal(pilot.full_187_kp_expansion_ready,false);
 assert.ok(BENCHMARK_PATH.startsWith("data/review/"));
});
