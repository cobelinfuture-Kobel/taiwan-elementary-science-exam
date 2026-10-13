import test from "node:test";
import assert from "node:assert/strict";
import { buildG04S2V2,EXACT_REVIEW_PATH } from "../tools/p12-g04s2-v2-exact-source-routing.mjs";
import { readRepoJSON } from "../tools/p12-all-kp-source-mapping.mjs";
const pilot=buildG04S2V2(),audit=readRepoJSON(EXACT_REVIEW_PATH);
const has=(source,kp)=>pilot.candidate_edges.some(x=>x.source_id===source&&x.kp_id===kp);
const get=(s,k)=>pilot.exact_case_audit.find(x=>x.source_id===s&&x.kp_id===k);
const p="SCI_G04_S1_114_";
test("V2 preserves 46-KP × 1623-source exact corpus denominator and public freeze",()=>{
 assert.equal(pilot.source_corpus_denominator,1623);
 assert.equal(pilot.kp_target_denominator,46);
 assert.equal(pilot.source_kp_retrieval_evaluations,74658);
 assert.equal(pilot.original_exact_source_pdf_pairs_attested,21);
 assert.equal(pilot.source_pdf_unavailable_holds,2);
 assert.equal(audit.items.length,23);
 assert.equal(pilot.per_kp.length,46);
 assert.equal(pilot.by_unit.length,4);
 assert.equal(pilot.full_187kp_expansion_ready,false);
 assert.equal(pilot.source_semantics_full_corpus_certified,false);
 assert.equal(pilot.reviewed_full_46_kp_certification_pairs,0);
 assert.equal(pilot.public_total_questions_still,251);
 assert.equal(pilot.public_g04s1_still,53);
 assert.equal(pilot.new_public_admissions,0);
});
test("V1 frozen 45-case summary challenge now retrieves its 3 known semantic positives and excludes the known false hit",()=>{
 const s=pilot.development_sample_quality;
 assert.equal(s.sample_is_curated_and_used_for_rule_repairs,true);
 assert.equal(s.positive_summary_pairs,29);
 assert.equal(s.positive_summary_retrieved_v1,26);
 assert.equal(s.positive_summary_retrieved_v2,29);
 assert.equal(s.negative_summary_pairs,13);
 assert.equal(s.negative_summary_false_hits_v1,1);
 assert.equal(s.negative_summary_false_hits_v2,0);
 assert.equal(s.accuracy_claim_on_population,false);
 assert.equal(has(p+"MID_001|TF|S01|003","sci_g04s2_01_12"),true);
 assert.equal(has(p+"MID_011|Q02|005","sci_g04s2_03_01"),true);
 assert.equal(has(p+"MID_001|CHECK|S04|009","sci_g04s2_03_07"),true);
 assert.equal(has(p+"FINAL_004|S02|MC|005","sci_g04s2_04_05"),false);
 assert.equal(has(p+"FINAL_004|S02|MC|005","sci_g04s2_04_04"),true);
});
test("Exact original 21 bounded cases are fully linked and separate primary / secondary / negative / HOLD",()=>{
 const source=new Map(pilot.candidate_edges.map(x=>[x.source_id,x]));
 assert.equal(pilot.exact_case_audit.length,23);
 for(const r of pilot.exact_case_audit){
  assert.ok(r.source_id.startsWith(p));
  assert.ok(r.kp_id.startsWith("sci_g04s2_"));
  assert.equal(r.formal_kp_verified,false);
  assert.equal(r.public_admission_approved,false);
  assert.ok(r.source_readback_rationale.length>=12);
  if(r.evidence_tier==="SOURCE_EXACT_PDF"){
   assert.match(r.source_pdf_sha256,/^[a-f0-9]{64}$/);
   assert.ok(r.original_source_pdf_page>=1);
  }else{
   assert.equal(r.adjudicated_relationship,"SOURCE_PDF_UNAVAILABLE_PENDING_EXACT_REVIEW");
   assert.equal(r.source_pdf_sha256,null);
  }
 }
 assert.equal(get(p+"MID_011|Q02|005","sci_g04s2_03_01").adjudicated_relationship,"SOURCE_EXACT_SECONDARY_PLAUSIBLE");
 assert.equal(get(p+"FINAL_004|S02|MC|005","sci_g04s2_04_05").adjudicated_relationship,"SOURCE_EXACT_NONMATCH");
 assert.equal(get(p+"MID_010|S02|MC|014","sci_g04s2_04_06").adjudicated_relationship,"SOURCE_EXACT_HOLD_QUESTION_FLAW");
});
test("Source-exact negative evidence takes precedence over lexical retrieval but never discards historical edges",()=>{
 assert.equal(has(p+"MID_011|Q04|004","sci_g04s2_02_07"),false);
 assert.equal(has(p+"MID_006|S01|TF|002","sci_g04s2_03_07"),false);
 assert.equal(has(p+"MID_011|Q04|010","sci_g04s2_01_08"),false);
 const rejected=pilot.suppressed_prior_candidates;
 assert.ok(rejected.some(x=>x.source_id===p+"FINAL_004|S02|MC|005"&&x.kp_id==="sci_g04s2_04_05"));
 assert.ok(rejected.every(x=>x.original_pair_remains_traceable===true));
 assert.ok(rejected.every(x=>x.retrieval_status==="V2_REVIEW_EXCLUDED_FOR_THIS_KP"));
 for(const x of pilot.candidate_edges){
  assert.equal(x.kp_verified,false);
  assert.equal(x.public_admission_approved,false);
  assert.equal(x.teacher_key_verified,false);
  assert.ok(x.source_version_sha256);
  assert.ok(x.kp_version_sha256);
 }
});
test("Original PDFs absent for 永安 do not gain source-exact classification from repaired retrieval",()=>{
 const id=p+"MID_001|TF|S01|003",kp="sci_g04s2_01_12";
 const row=get(id,kp);
 assert.equal(row.evidence_tier,"FIRSTPASS_SUMMARY_ONLY");
 assert.equal(row.adjudicated_relationship,"SOURCE_PDF_UNAVAILABLE_PENDING_EXACT_REVIEW");
 assert.equal(row.v2_retrieved,true);
 assert.equal(row.source_pdf_sha256,null);
 const pair=pilot.candidate_edges.find(x=>x.source_id===id&&x.kp_id===kp);
 assert.equal(pair.kp_verified,false);
 assert.equal(pair.evidence_tier,"FIRSTPASS_SUMMARY_ONLY");
});
test("Candidate retrieval is deterministic and zero-hit KP is not misrepresented as absent from source corpus",()=>{
 const again=buildG04S2V2();
 assert.equal(JSON.stringify(again),JSON.stringify(pilot));
 assert.equal(pilot.candidate_edges.length,pilot.v2_retrieved_edges);
 assert.equal(pilot.v2_retrieved_edges,
  pilot.v1_retrieved_edges+pilot.added_generalized_recall_candidates-pilot.suppressions_count);
 for(const row of pilot.per_kp){
  assert.equal(row.full_source_kp_coverage_certified,false);
  if(row.candidate_pairs===0)assert.equal(row.empty_means,"NO_RETRIEVAL_CANDIDATE_NOT_PROVEN_MISSING");
 }
 assert.equal(pilot.original_pdf_sample_quality.independent_random_holdout_quality_established,false);
});
