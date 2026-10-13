import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest=JSON.parse(readFileSync("data/review/p12-standalone-source-first-yongan-final-22-safe-manifest-v1.json","utf8"));
const baseline=JSON.parse(readFileSync("data/review/p12-g04s1-114-nanyi-yongan-final-kp-first-text-map-v2.json","utf8"));
const byId=new Map(baseline.items.map(x=>[x.source_position_id??x.source_slot_id,x]));
const records=manifest.original_question_records;
test("22 first-page standalone source IDs map 1:1 to original frozen 114 paper answer positions",()=>{
 assert.equal(manifest.original_22_standalone_items_with_private_complete_source,22);
 assert.equal(manifest.true_false,8);
 assert.equal(manifest.four_option_choice,14);
 assert.equal(records.length,22);
 assert.equal(new Set(records.map(x=>x.source_id)).size,22);
 assert.match(manifest.source_original_pdf_sha256,/^[a-f0-9]{64}$/);
 assert.equal(manifest.source_original_pdf_sha256,"88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf");
 assert.equal(manifest.scope_excludes_grouped_children_diagrams_reading_shared_context,true);
 for(const r of records){
   assert.ok(byId.has(r.source_id),"Unregistered source "+r.source_id);
   assert.equal(r.pdf_page,1);
   assert.equal(r.marker_pdf_pts.length,4);
   assert.ok(r.marker_pdf_pts[0]<r.marker_pdf_pts[2] && r.marker_pdf_pts[1]<r.marker_pdf_pts[3]);
   assert.equal(r.options_expected,r.type==="TRUE_FALSE"?0:4);
   assert.equal(byId.get(r.source_id).source_section_type,r.type==="TRUE_FALSE"?"TF":"MC");
   assert.equal(r.model_source_visual_bbox_checked,true);
 }
});
test("Page 1 two-column answer-number geometry and original section prefix cannot collide",()=>{
 for(const r of records){
   const n=Number(r.source_id.split("|").at(-1));
   if(r.type==="SINGLE_CHOICE"&&n>=12)assert.ok(r.marker_pdf_pts[0]>400);
   else assert.ok(r.marker_pdf_pts[0]<100);
 }
 assert.equal(records[0].source_id,"SCI_G04_S1_114_FINAL_001|TF|S01|001");
 assert.equal(records[8].source_id,"SCI_G04_S1_114_FINAL_001|MC|S02|001");
 assert.equal(records[21].source_id,"SCI_G04_S1_114_FINAL_001|MC|S02|014");
});
test("Single-choice with multiple false options and temporally dependent TF are quarantined before science/KP admission",()=>{
 const flaws=records.filter(x=>x.quality_issue);
 assert.deepEqual(flaws.map(x=>x.source_id),[
  "SCI_G04_S1_114_FINAL_001|TF|S01|005",
  "SCI_G04_S1_114_FINAL_001|MC|S02|004"
 ]);
 assert.deepEqual(flaws.map(x=>x.quality_issue),["TEMPORAL_SOURCE_FACT","MULTIPLE_INCORRECT_OPTIONS"]);
 assert.equal(manifest.science_issue_marked,2);
 assert.equal(manifest.model_science_no_obvious_issue_yet,20);
 assert.equal(manifest.operator_source_qa_pending,22);
});
test("Private source completeness never promotes teacher answers, KP or public bank and leaves 114 all25 hold intact",()=>{
 assert.equal(manifest.public_answer_positions_total_unchanged,251);
 assert.equal(manifest.public_answer_positions_g04s1_unchanged,53);
 assert.equal(manifest.new_public_admissions,0);
 assert.equal(manifest.teacher_key_authenticated,0);
 assert.equal(manifest.formal_kp_approved,0);
 assert.equal(manifest.operator_public_admission_approved,0);
 assert.equal(manifest.operator_114_all25_before_publication_rule_unchanged,true);
 assert.equal(manifest.existing_1623_source_id_denominator_unchanged,true);
 assert.equal(manifest.no_full_original_exam_stems_options_copyrighted_images_in_public_repository,true);
 assert.match(manifest.private_source_artifact_sha256,/^[a-f0-9]{64}$/);
 for(const r of records){
  assert.equal(r.teacher_key_authenticated,false);
  assert.equal(r.science_unique_answer_final_approved,false);
  assert.equal(r.kp_mapping_formally_approved,false);
  assert.equal(r.source_use_rights_cleared,false);
  assert.equal(r.public_admitted,false);
 }
});
