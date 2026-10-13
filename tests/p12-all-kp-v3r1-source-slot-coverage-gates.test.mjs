import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildAllKpSourceIndex } from "../tools/p12-all-kp-source-mapping.mjs";
import { verifyPublicV3R1Coverage,verifyPrivateV3R1Binding,COVERAGE_MANIFEST } from "../tools/p12-all-kp-v3r1-coverage-acceptance.mjs";
const base=buildAllKpSourceIndex();
const manifest=JSON.parse(readFileSync(COVERAGE_MANIFEST,"utf8"));
test("V3R1 preserves all 25 original 114 school-year sources and their 1623 immutable source positions",()=>{
 const r=verifyPublicV3R1Coverage(base,manifest);
 assert.deepEqual(r,{papers:25,slots:1623,recovered_papers:3,recovered_source_slots:254,
   text_slots:1380,image_only_slots:243,direct_locus_candidates:409,parent_group_candidates:192,
   full_stem_options_figure_and_answer_box_certified:0,new_public_admissions:0});
 assert.equal(base.original_source_items.length,1623);
 assert.equal(base.scope.authoritative_kps,187);
});
test("Recovered 3 original Google Drive PDF source IDs are audited without overwriting historical V17 or V3 metadata",()=>{
 const expected={"SCI_G04_S1_114_MID_001":"4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe",
 "SCI_G04_S1_114_FINAL_001":"88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",
 "SCI_G04_S1_114_FINAL_012":"1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987"};
 assert.equal(manifest.recovered_since_v3_papers.length,3);
 for(const row of manifest.recovered_since_v3_papers){
  assert.equal(row.raw_pdf_sha256,expected[row.id]);
  assert.ok(row.drive_file_id.length>15);
  const old=base.original_source_items.filter(x=>x.original_paper_id===row.id);
  assert.equal(old.length,row.source_response_positions);
  assert.ok(old.every(x=>x.original_pdf_sha256===null));
 }
 assert.equal(manifest.source_pdf_pages_after_recovery,60);
 assert.equal(manifest.original_pdf_missing_count_after_recovery,0);
});
test("Four image-only sources stay separate from 21 selectable-text PDFs and never claim OCR success",()=>{
 assert.equal(manifest.original_pdf_text_layer_count,21);
 assert.equal(manifest.source_positions_with_text_layer,1380);
 assert.equal(manifest.original_pdf_image_only_count,4);
 assert.equal(manifest.source_positions_image_only,243);
 assert.deepEqual(manifest.image_only_papers.map(x=>x.positions),[70,70,54,49]);
 assert.equal(manifest.original_answer_box_coordinates_verified,0);
 assert.equal(manifest.strict_full_source_question_stem_all_options_parent_diagram_and_answer_box_verified,0);
});
test("Direct and group candidate positions are traceable without being promoted to source-exact or formal KP acceptance",()=>{
 const x=manifest.source_slot_binding_status_counts;
 assert.equal(x.STEM_OPTIONS_LOCATED_PENDING_VISUAL_REVIEW,277);
 assert.equal(x.PARTIAL_STEM_LOCATED_REQUIRES_SOURCE_REVIEW,132);
 assert.equal(x.PARENT_GROUP_LOCATED_CHILD_UNBOUND,192);
 assert.equal(x.TEXT_LAYER_SLOT_UNBOUND,769);
 assert.equal(x.AMBIGUOUS_NUMBER_OR_SECTION,10);
 assert.equal(x.IMAGE_ONLY_PENDING_VISUAL,243);
 assert.equal(Object.values(x).reduce((a,b)=>a+b,0),1623);
 assert.equal(manifest.printed_question_number_source_locator_candidate_count,409);
 assert.equal(manifest.parent_group_text_candidate_count,192);
 assert.equal(manifest.primary_or_secondary_kp_formally_verified_by_v3r1,0);
 assert.equal(manifest.original_teacher_key_authenticated_by_v3r1,0);
 assert.equal(manifest.no_source_question_text_or_artwork_committed,true);
});
test("Fail closed on accidental source denial, false full-question certification or public admission",()=>{
 for(const edit of [
  m=>m.new_public_question_admissions=1,
  m=>m.strict_full_source_question_stem_all_options_parent_diagram_and_answer_box_verified=277,
  m=>m.source_slot_binding_status_counts.IMAGE_ONLY_PENDING_VISUAL=0,
  m=>m.source_positions_missing_original_after_recovery=254,
  m=>m.recovered_since_v3_papers[0].raw_pdf_sha256="f".repeat(64)]){
   const mutant=structuredClone(manifest);edit(mutant);
   assert.throws(()=>verifyPublicV3R1Coverage(base,mutant));
 }
});
test("Private provenance validator rejects missing slots and cannot infer source verification from page text",()=>{
 assert.throws(()=>verifyPrivateV3R1Binding({source_slot_bindings:[]},base,manifest),/not 1623 unique/);
 assert.equal(manifest.original_114_all25_science_screen_before_public_admission_policy_preserved,true);
 assert.equal(manifest.public_total_source_answer_positions_unchanged,251);
 assert.equal(manifest.public_g04s1_answer_positions_unchanged,53);
});
