import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {classifyG04S1SourcePosition} from "../tools/p12-g04s1-kp-first.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const doc=read("data/review/p12-g04s1-114-nanyi-yongan-final-kp-first-78-position-pilot-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
const queue=read("data/source-registry/p12-g04s1-108114-all-papers-kp-first-queue-v1.json");
test("114 Nanyi FINAL 78 original position slots are inventoried, not all individually passed",()=>{
 assert.equal(doc.source_candidate_id,"SCI_G04_S1_114_FINAL_001");
 assert.deepEqual(doc.source_original_section_totals,[8,14,4,24,10,12,6]);
 assert.equal(doc.source_original_answer_positions,78);
 assert.equal(doc.first_22_text_questions_reviewed,22);
 assert.equal(doc.remaining_positions_pending_exact_source_readback,56);
 assert.equal(doc.items.length,78);
 assert.equal(new Set(doc.items.map(x=>x.source_position_id)).size,78);
 assert.deepEqual(doc.preliminary_kp_decisions,{
  REVIEW_KP_UNCERTAIN:5,KP_MATCH_CANDIDATE:12,NONMATCH_G04S1_KP_ARCHIVE:5,PENDING_FULL_SOURCE_POSITION_EXTRACTION:56
 });
 assert.ok(doc.items.filter(x=>!x.source_text_reviewed).every(x=>x.kp_first_decision==="PENDING_FULL_SOURCE_POSITION_EXTRACTION"));
 assert.equal(doc.public_admission_approved,false);
 assert.equal(doc.source_pdf_sha256,null);
});
test("moon-in-water reflection item retains U03 canonical KP instead of discarding moon-keyword",()=>{
 const x=doc.items.find(x=>x.source_section_type==="MC"&&x.section_slot_index===2);
 assert.equal(x.kp_first_decision,"KP_MATCH_CANDIDATE");
 assert.deepEqual(x.matched_canonical_kp_ids,["sci_g04s1_03_07"]);
 assert.equal(x.model_provisional_answer,"②");
 const evaluated=classifyG04S1SourcePosition({
  matched_canonical_kp_ids:x.matched_canonical_kp_ids,
  original_paper_exam_type:"FINAL",original_publisher_label:"南一",original_paper_scope_rating:"WRONG_SCOPE"
 },auth);
 assert.equal(evaluated.decision,"KP_MATCH_CANDIDATE");
 assert.deepEqual(evaluated.new_curriculum_exam_routing,["CURRENT_FINAL"]);
 assert.equal(evaluated.retain_source,true);
});
test("all first 22 individually reviewed positions are preserved and current 251 live learner slots unchanged",()=>{
 const reviewed=doc.items.filter(x=>x.source_text_reviewed);
 assert.equal(reviewed.length,22);
 assert.ok(reviewed.every(x=>x.original_printed_no&&x.teacher_key_authenticated===false&&!x.publish_approved));
 assert.ok(reviewed.every(x=>x.kp_first_decision==="NONMATCH_G04S1_KP_ARCHIVE"||x.kp_first_decision==="REVIEW_KP_UNCERTAIN"||x.kp_first_decision==="KP_MATCH_CANDIDATE"));
 assert.equal(queue.initial_published_slots_unchanged,251);
 assert.equal(queue.work_items.length,273);
 assert.ok(queue.work_items.some(x=>x.source_candidate_id===doc.source_candidate_id));
});
