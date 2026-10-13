import test from "node:test";
import assert from "node:assert/strict";
import { buildV3FullSourceBlindBenchmark } from "../tools/p12-all-kp-v3-source-readiness-and-heldout.mjs";
const v3=buildV3FullSourceBlindBenchmark();
test("All 25 PDFs are accounted for without equating 22 available originals to fully captured source questions",()=>{
 const p=v3.pdf_evidence;
 assert.equal(p.expected_original_papers,25);
 assert.equal(p.available,22);
 assert.equal(p.missing,3);
 assert.equal(p.readable,18);
 assert.equal(p.image_only,4);
 assert.equal(p.pages,54);
 assert.equal(p.source_response_positions_total,1623);
 assert.equal(p.full_stem_options_and_shared_diagram_bound_positions,0);
 assert.equal(Object.values(p.source_position_evidence_stages).reduce((s,n)=>s+n,0),1623);
 assert.equal(v3.all_source_evidence_records.length,1623);
 const exactMissing=v3.all_source_evidence_records.filter(x=>x.source_pdf_evidence_stage==="PDF_UNAVAILABLE");
 assert.ok(exactMissing.length>0);
 assert.ok(v3.all_source_evidence_records.some(x=>x.source_pdf_evidence_stage==="IMAGE_ONLY_PDF_NEEDS_VISUAL_OR_CONTROLLED_OCR"));
 for(const r of v3.all_source_evidence_records){
  assert.equal(r.original_full_stem_and_options_verified,false);
  assert.equal(r.extracted_full_stem,null);
  assert.equal(r.extracted_full_options,null);
  assert.equal(r.shared_reading_text,null);
  assert.equal(r.figure_region_coordinates,null);
  assert.equal(r.source_id_to_exact_answer_box_geometry,null);
  assert.equal(r.public_release_approved,false);
 }
});
test("40 new exact-source KP cases are frozen, unique and separate from V1/V2 tuned data",()=>{
 assert.equal(v3.test.benchmark_pairs,40);
 assert.equal(v3.heldout_cases_with_frozen_predictions.length,40);
 assert.equal(v3.test.primary_or_secondary_plausible,12);
 assert.equal(v3.test.nonmatching_pairs,26);
 assert.equal(v3.test.unavailable_or_ambiguous_evidence_holds,2);
 const pairs=new Set(v3.heldout_cases_with_frozen_predictions.map(x=>JSON.stringify([x.source_id,x.kp_id])));
 assert.equal(pairs.size,40);
 assert.match(v3.heldout_sha256,/^[a-f0-9]{64}$/);
 assert.equal(v3.test.is_random_probability_sample,false);
 assert.equal(v3.test.used_for_frozen_v2_rule_tuning,false);
 assert.equal(v3.test.population_accuracy_guarantee,false);
 for(const x of v3.heldout_cases_with_frozen_predictions){
  assert.match(x.source_original_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.ok(x.source_original_pdf_page>=1);
  assert.equal(x.label_not_used_to_tune_v2,true);
  assert.equal(x.external_blind_adjudication_certified,false);
  assert.equal(x.formal_kp_verified,false);
  assert.equal(x.public_release_approved,false);
 }
});
test("Per-unit V3 benchmark is explicit about U02 having no matching positive samples and no missing-KP claims",()=>{
 assert.deepEqual(v3.test.per_unit.map(x=>x.unit),["U01","U02","U03","U04"]);
 assert.equal(v3.test.per_unit.reduce((s,x)=>s+x.sampled_pairs,0),40);
 const u02=v3.test.per_unit.find(x=>x.unit==="U02");
 assert.equal(u02.positive_and_secondary_labels,0);
 assert.equal(u02.no_positive_sample_cannot_test_recall,true);
 assert.equal(v3.full_46_kp_semantic_certification_complete,false);
 assert.equal(v3.KP_mapping_full_187_expansion_authorized,false);
 assert.equal(v3.public_new_admissions,0);
 assert.equal(v3.public_question_positions_unchanged,251);
 assert.equal(v3.public_g04s1_positions_unchanged,53);
});
test("V3 is deterministic; updated original PDFs or KP definitions cannot inherit admission by assumption",()=>{
 const again=buildV3FullSourceBlindBenchmark();
 assert.equal(JSON.stringify(v3),JSON.stringify(again));
 assert.equal(v3.next_gate_requirements.length,6);
 assert.equal(v3.source_pdf_artwork_copyright_clearance,false);
});
