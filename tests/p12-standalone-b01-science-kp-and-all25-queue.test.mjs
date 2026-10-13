import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const qa=read("data/review/p12-standalone-yongan22-science-kp-secondpass-v1.json");
const pilot=read("data/review/p12-standalone-source-first-yongan-final-22-safe-manifest-v1.json");
const first=read("data/review/p12-g04s1-114-nanyi-yongan-final-kp-first-text-map-v2.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const queue=read("data/review/p12-standalone-all25-source-first-queue-v1.json");
const kpIds=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test("full-text Drive model science pass does not confer public approval or teacher authenticated answer",()=>{
 assert.equal(qa.records.length,22);
 assert.deepEqual(qa.records.map(x=>x.source_id),pilot.original_question_records.map(x=>x.source_id));
 assert.equal(qa.source_original_pdf_sha256,pilot.source_original_pdf_sha256);
 assert.equal(qa.source_pilot_private_bundle_sha256,pilot.private_source_artifact_sha256);
 assert.equal(qa.records.filter(x=>x.science_model_review==="MODEL_SCIENCE_PASS").length,20);
 assert.equal(qa.records.filter(x=>x.science_model_review==="SCIENCE_HOLD").length,2);
 for(const r of qa.records){
  assert.equal(r.formal_kp_approved,false);
  assert.equal(r.teacher_key_authenticated,false);
  assert.equal(r.operator_public_admission_approved,false);
  assert.equal(r.original_question_source_rights_cleared,false);
  assert.equal(r.original_scored_points,2);
  assert.ok(r.science_reason_without_copyrighted_original_text.length>12);
  assert.ok(first.items.some(i=>(i.source_position_id??i.source_slot_id)===r.source_id));
 }
 assert.equal(qa.public_items_added,0);
 assert.equal(qa.formal_kp_certified,0);
 assert.equal(qa.formal_science_educational_signoff,0);
 assert.equal(qa.original_114_all25_screen_before_publication_rule_preserved,true);
});
test("two source defects are held and not silently graded as single unique answers",()=>{
 const flaw=new Map(qa.records.filter(r=>r.science_model_review==="SCIENCE_HOLD").map(r=>[r.source_id,r]));
 const tf5=flaw.get("SCI_G04_S1_114_FINAL_001|TF|S01|005");
 const mc4=flaw.get("SCI_G04_S1_114_FINAL_001|MC|S02|004");
 assert.equal(tf5.model_answer_if_unique,"X");
 assert.equal(mc4.model_answer_if_unique,null);
 assert.ok(tf5.science_reason_without_copyrighted_original_text.includes("時間"));
 assert.ok(mc4.science_reason_without_copyrighted_original_text.includes("③"));
 assert.ok(mc4.science_reason_without_copyrighted_original_text.includes("④"));
 assert.equal(flaw.size,2);
});
test("science-correct does not imply matched 45-KP; exact KP routing remains provisional",()=>{
 assert.equal(qa.kp_strong_candidate,11);
 assert.equal(qa.kp_nonmatch_g04s1,6);
 assert.equal(qa.kp_review,5);
 for(const r of qa.records){
   if(r.kp_secondpass_disposition==="KP_STRONG_CANDIDATE")assert.ok(kpIds.has(r.kp_primary_proposal),r.source_id);
   else assert.equal(r.kp_primary_proposal,null);
 }
 assert.equal(qa.records.find(r=>r.source_id.endsWith("|MC|S02|001")).kp_primary_proposal,"sci_g04s1_03_04");
 assert.equal(qa.records.find(r=>r.source_id.endsWith("|TF|S01|008")).kp_secondpass_disposition,"KP_REVIEW");
 assert.equal(qa.records.find(r=>r.source_id.endsWith("|MC|S02|005")).kp_secondpass_disposition,"KP_NONMATCH_G04S1");
});
test("25 papers queued; only actual 22 complete-source items are counted; all25 publication remains blocked",()=>{
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.equal(queue.source_paper_queue.length,25);
 assert.equal(new Set(queue.source_paper_queue.map(x=>x.original_source_paper_id)).size,25);
 assert.equal(queue.source_paper_queue.filter(x=>x.original_pdf_access_type==="TEXT_LAYER").length,21);
 assert.equal(queue.source_paper_queue.filter(x=>x.original_pdf_access_type==="IMAGE_ONLY").length,4);
 assert.equal(queue.source_paper_queue.find(p=>p.original_source_paper_id==="SCI_G04_S1_114_FINAL_001").full_complete_standalone_tf_mc_private_source_count,22);
 assert.ok(queue.source_paper_queue.reduce((n,p)=>n+p.full_complete_standalone_tf_mc_private_source_count,0)>=22);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
 assert.equal(queue.public_items_new,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(qa.existing_site_counts.all_answer_positions,251);
 assert.equal(qa.existing_site_counts.g04s1_answer_positions,53);
});
