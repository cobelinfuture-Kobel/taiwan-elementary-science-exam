import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B05_41} from "../site/assets/js/p12-b04-b05-41-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b05-41-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b05-first50-science-kp-review-v1.json");
const evidence=read("data/review/p12-b04-b05-41-formal-source-science-kp-acceptance-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B05 exact 41 original TF/MC source, science, KP, BBox, rights and nine held source IDs",()=>{
 const release=validateAndConvertP12B04B05_41(bank,authority);
 assert.deepEqual([release.answerSlots,release.standaloneTf,release.standaloneChoice],[41,15,26]);
 assert.equal(evidence.approved_items.length,41);
 const source=new Map();
 for(const p of new Set(review.records.map(x=>x.original_source_archive_ref))){
  const paper=read(p);for(const q of paper.original_question_records)source.set(q.source_id,{paper,q});
 }
 const byReview=new Map(review.records.map(x=>[x.source_id,x]));
 const byEvidence=new Map(evidence.approved_items.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const {q,paper}=source.get(b.source_slot_id),r=byReview.get(b.source_slot_id),e=byEvidence.get(b.source_slot_id);
  assert.ok(r&&e);
  assert.equal(q.full_original_stem,b.stem);
  assert.deepEqual(q.full_original_options_in_order.map(x=>x.label+x.text),b.options??[]);
  assert.deepEqual(q.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(paper.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(b.answer,r.model_proposed_answer);
  assert.equal(b.answer_explanation,r.science_independent_explanation);
  assert.equal(b.canonical_kp_id,e.canonical_kp_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(paper.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(paper.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.deepEqual(r.exception_flags,[]);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.deepEqual(evidence.held_items.map(x=>x.ordinal),[1,3,9,16,17,18,23,33,46]);
 assert.equal(bank.blocks.find(x=>x.b05_review_ordinal===29).canonical_kp_id,"sci_g04s1_03_07");
 assert.equal(bank.blocks.some(x=>x.b05_review_ordinal===33||x.b05_review_ordinal===46),false);
});
test("B05 source Science/KP admission fails closed on tampered answer, identity, BBox, original choices, rights",()=>{
 for(const change of [
  v=>{v.blocks[0].answer="④";},
  v=>{v.blocks[0].canonical_kp_id="sci_g04s1_01_01";},
  v=>{v.blocks[0].source_slot_id="INVALID";},
  v=>{v.blocks[0].source_pdf_bbox_pts_top_left=null;},
  v=>{v.blocks[0].source_pdf_sha256="corrupt";},
  v=>{v.blocks[0].answer_explanation="";},
  v=>{v.blocks.find(x=>x.options).options[0]="wrong original label";},
  v=>{v.blocks[0].operator_publication_approval=false;},
  v=>{v.blocks[0].copyright_path="UNKNOWN";}
 ]){
  const copy=structuredClone(bank);change(copy);
  assert.throws(()=>validateAndConvertP12B04B05_41(copy,authority));
 }
});
