import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildMaster } from "../tools/p12-master-progress.mjs";
const read=(p)=>JSON.parse(readFileSync(p,"utf8"));
const p="data/review/p12-g04s1-114-";
const b02=read(p+"b02-dadun-final-science-figure-verdict-v1.json");
const source=read(p+"kanghsuan-dadun-final-64-source-map-v1.json");
const v17=read(p+"all25-kp-first-progress-v17.json");
const b15=read(p+"secondpass-all25-hold-and-kp-review-queue-v1.json");
const b01=read(p+"b01-science-figure-acceptance-progress-v1.json");
const progress=read(p+"b02-science-figure-acceptance-progress-v2.json");
const rewrite=read(p+"b02-dadun-final-reading-causal-rewrite-draft-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const kps=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const find=(s)=>b02.items.find(i=>i.source_slot_id.endsWith(s));
test("B02 is 32 unique actual original PDF science-verdict positions and uses the SHA-confirmed four-page Dadun source",()=>{
 assert.equal(kps.size,45);
 assert.equal(b02.source_candidate_id,"SCI_G04_S1_114_FINAL_005");
 assert.equal(b02.source_pdf_sha256,"7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542");
 assert.equal(b02.source_pdf_sha256,source.source_pdf_sha256);
 assert.equal(b02.source_pdf_sha256_verified_against_raw_original,true);
 assert.equal(b02.original_pdf_pages,4);
 assert.equal(b02.batch_source_positions,32);
 assert.equal(b02.items.length,32);
 assert.equal(new Set(b02.items.map(x=>x.source_slot_id)).size,32);
 const m=new Map(source.items.map(x=>[x.source_slot_id,x]));
 for(const x of b02.items){
  const r=m.get(x.source_slot_id);
  assert.ok(r,"unknown original source position "+x.source_slot_id);
  assert.equal(x.source_first_pass_decision,r.kp_first_decision);
  assert.deepEqual(x.source_first_pass_kp_ids,r.matched_canonical_kp_ids);
  assert.ok(x.source_science_precise_kp_ids_for_future_authority_review.every(id=>kps.has(id)));
  assert.equal(x.source_original_page,r.source_pdf_page);
  assert.equal(x.source_pdf_sha256,b02.source_pdf_sha256);
  assert.ok(x.original_science_reasoning.length>=8);
  assert.equal(x.original_pdf_visual_and_text_examined,true);
 }
 assert.deepEqual(b02.original_first_pass_strata,{"KP_MATCH_SOURCE_EVIDENCE_HOLD":25,"REVIEW_KP_UNCERTAIN":4,"KP_MATCH_CANDIDATE":3});
});
test("B02 independent science classifications are 31 FULL_PASS and one CORRECTABLE, not original teacher certification",()=>{
 assert.deepEqual(b02.independent_model_science_verdict_counts,{FULL_PASS:31,CORRECTABLE:1,HOLD:0,REJECT:0});
 assert.equal(b02.original_figure_dependent_positions_reviewed,24);
 for(const x of b02.items){
  assert.ok(["FULL_PASS","CORRECTABLE","HOLD","REJECT"].includes(x.model_independent_science_verdict));
  if(x.model_independent_science_verdict==="FULL_PASS")assert.notEqual(x.science_answer_if_full_pass,null);
  else assert.equal(x.science_answer_if_full_pass,null);
  assert.equal(x.original_source_teacher_key_authenticated,false);
  assert.equal(x.learner_figure_redraw_verified,false);
  assert.equal(x.source_copyright_public_use_cleared,false);
  assert.equal(x.operator_public_admission_approved,false);
  assert.equal(x.public_release_approved,false);
 }
 assert.equal(b02.original_teacher_key_authenticated,false);
 assert.equal(b02.public_admission_this_batch,0);
});
test("Original smoke laser figure maintains six actual checkboxes but only one 2-point parent score",()=>{
 const wanted={"001":"×","002":"√","003":"×","004":"×","005":"√","006":"×"};
 const positions=[];
 for(const [num,ans] of Object.entries(wanted)){
  const v=find("|S3|G01A|"+num);
  assert.ok(v);
  assert.equal(v.source_original_page,2);
  assert.equal(v.science_answer_if_full_pass,ans);
  assert.equal(v.original_source_checkbox_score_points,null);
  assert.equal(v.original_source_group_parent_score_points,2);
  assert.equal(v.original_figure_required,true);
  positions.push(v.source_slot_id);
 }
 assert.equal(new Set(positions).size,6);
 assert.equal(b02.original_scoring_group_s3_g01a.parent_group_printed_score_points,2);
 assert.equal(b02.original_scoring_group_s3_g01a.per_checkbox_points_reconciled,false);
 assert.equal(b02.original_scoring_group_s3_g01a.child_score_points_added_to_paper_total,0);
});
test("Original shadow, 3-bulb A/B, electrical faults and diagram series/parallel are image-specific",()=>{
 const blocks=[
  ["S3|G01B",{"007":"×","008":"√","009":"×","010":"√"},2],
  ["S3|G02",{"013":"A","014":"B","015":"B","016":"A"},3],
  ["S3|G03",{"017":"×","018":"×","019":"√","020":"×"},3],
  ["S3|G04",{"021":"A","022":"B","023":"D","024":"C"},3],
 ];
 for(const [part,lookup,page] of blocks)for(const [num,answer] of Object.entries(lookup)){
  const x=find("|"+part+"|"+num);
  assert.ok(x,part+" "+num);
  assert.equal(x.source_original_page,page);
  assert.equal(x.science_answer_if_full_pass,answer);
  assert.equal(x.original_figure_required,true);
 }
 assert.match(find("S3|G03|017").original_science_reasoning,/電池負極/);
 assert.deepEqual(["sci_g04s1_04_08","sci_g04s1_04_09","sci_g04s1_04_07","sci_g04s1_04_06"],["021","022","023","024"].map(x=>find("S3|G04|"+x).source_science_precise_kp_ids_for_future_authority_review[0]));
});
test("Two-source lighthouse/ocean causal ambiguity stays unaccepted, and image/pitch conceptual scope stays pending",()=>{
 const r=find("S4|READ1|001");
 assert.equal(r.model_independent_science_verdict,"CORRECTABLE");
 assert.equal(r.science_answer_if_full_pass,null);
 assert.equal(rewrite.source_slot_id,r.source_slot_id);
 assert.equal(rewrite.operator_rewrite_approved,false);
 assert.equal(rewrite.original_teacher_answer_authenticated,false);
 assert.equal(rewrite.public_release_approved,false);
 assert.deepEqual(new Set(b02.kp_scope_review_required_for),new Set(["SCI_G04_S1_114_FINAL_005|S2|MC|015","SCI_G04_S1_114_FINAL_005|S4|READ1|002","SCI_G04_S1_114_FINAL_005|S4|READ1|003"]));
 assert.equal(b02.science_answer_verdict_not_equal_formal_kp_admission,true);
});
test("B01+B02 add up to 62 science reviews, without changing source inventory, holds or live learner site",()=>{
 assert.equal(b01.source_positions_reviewed_independent_science,30);
 assert.equal(progress.model_independent_science_reviewed_positions_total,62);
 assert.deepEqual(progress.science_verdict_counts_cumulative,{FULL_PASS:55,CORRECTABLE:6,HOLD:0,REJECT:1});
 assert.equal(progress.original_440_hold_kp_queue_reviewed_distinct,50);
 assert.equal(progress.original_440_hold_kp_queue_not_yet_reviewed,390);
 assert.equal(progress.original_845_kp_candidates_reviewed_distinct,12);
 assert.equal(progress.original_845_kp_candidates_not_yet_reviewed,833);
 assert.equal(v17.all_identified_source_answer_positions_count,1623);
 assert.equal(v17.source_score_points_not_proven_as_distinct_questions,21);
 assert.equal(b15.review_queue_count,440);
 assert.equal(progress.public_question_positions_added,0);
 assert.equal(progress.public_answer_positions_still,251);
 assert.equal(progress.public_g04s1_answer_positions_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
