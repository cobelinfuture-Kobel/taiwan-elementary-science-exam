import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B03_41} from "../site/assets/js/p12-b04-b03-41-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b03-41-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b03-first50-science-kp-review-v1.json");
const acceptance=read("data/review/p12-b04-b03-41-formal-science-kp-acceptance-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B03 41 exact source admissions preserve stem/options/PDF BBox/Science/KP and hold nine exceptional sources",()=>{
 const release=validateAndConvertP12B04B03_41(bank,auth);
 assert.deepEqual([release.answerSlots,release.standaloneTf,release.standaloneChoice],[41,21,20]);
 assert.equal(review.records.length,50);
 assert.equal(acceptance.approved_items.length,41);
 assert.equal(acceptance.held_items.length,9);
 const sources=new Map();
 for(const path of new Set(review.records.map(x=>x.original_source_archive_ref))){
  const paper=read(path);for(const q of paper.original_question_records)sources.set(q.source_id,{q,paper});
 }
 const reviewed=new Map(review.records.map(x=>[x.source_id,x]));
 const accepted=new Map(acceptance.approved_items.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const {q,paper}=sources.get(b.source_slot_id),r=reviewed.get(b.source_slot_id),e=accepted.get(b.source_slot_id);
  assert.ok(r&&e);
  assert.equal(b.stem,q.full_original_stem);
  assert.deepEqual(b.options??[],q.full_original_options_in_order.map(x=>x.label+x.text));
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,q.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(b.source_pdf_sha256,paper.original_pdf_sha256);
  assert.equal(b.answer,r.provisional_unique_answer);
  assert.equal(b.answer,e.science_answer);
  assert.equal(b.answer_explanation,r.science_independent_rationale);
  assert.equal(b.canonical_kp_id,e.canonical_kp_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(paper.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(paper.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.deepEqual(r.exception_flags,[]);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.deepEqual(acceptance.held_items.map(x=>x.ordinal),[4,5,10,20,21,26,27,28,32]);
 assert.equal(acceptance.known_cross_source_future_duplicate.primary_slot_id,"SCI_G04_S1_114_MID_008|S02|MC|012");
});
test("B03 refuses edits to answer, KP, PDF geometry, identity, choices, rights or explanation",()=>{
 for(const mutate of [
  b=>{b.blocks[0].answer="①";},
  b=>{b.blocks[0].canonical_kp_id="sci_g04s1_01_01";},
  b=>{b.blocks[0].source_pdf_bbox_pts_top_left=null;},
  b=>{b.blocks[0].source_pdf_sha256="corrupt";},
  b=>{b.blocks[0].source_slot_id="fake";},
  b=>{b.blocks[0].options=["①one"];},
  b=>{b.blocks[0].operator_publication_approval=false;},
  b=>{b.blocks[0].answer_explanation="";}
 ]){
  const clone=structuredClone(bank);mutate(clone);
  assert.throws(()=>validateAndConvertP12B04B03_41(clone,auth));
 }
});
