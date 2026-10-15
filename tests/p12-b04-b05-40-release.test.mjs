import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B05_40} from "../site/assets/js/p12-b04-b05-40-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b05-40-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b05-first50-science-kp-review-v1.json");
const proof=read("data/review/p12-b04-b05-40-formal-science-kp-acceptance-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B05 40 accepted originals preserve full source stems, choices, BBox, unique science and KP, hold 10",()=>{
 const release=validateAndConvertP12B04B05_40(bank,auth);
 assert.deepEqual([release.answerSlots,release.standaloneTf,release.standaloneChoice],[40,15,25]);
 assert.equal(proof.approved_items.length,40);
 assert.equal(proof.held_items.length,10);
 assert.deepEqual(proof.held_items.map(x=>x.ordinal),[1,3,9,16,17,18,23,33,43,46]);
 const archived=new Map();
 for(const p of new Set(review.records.map(x=>x.original_source_archive_ref))){
  const source=read(p);
  for(const q of source.original_question_records) archived.set(q.source_id,{q,source});
 }
 const reviewed=new Map(review.records.map(x=>[x.source_id,x]));
 const accepted=new Map(proof.approved_items.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const {q,source}=archived.get(b.source_slot_id),r=reviewed.get(b.source_slot_id),e=accepted.get(b.source_slot_id);
  assert.ok(r&&e);
  assert.equal(q.full_original_stem,b.stem);
  assert.deepEqual(q.full_original_options_in_order.map(o=>o.label+o.text),b.options??[]);
  assert.deepEqual(q.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(source.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.model_proposed_answer,b.answer);
  assert.equal(r.science_independent_explanation,b.answer_explanation);
  assert.equal(e.science_unique_answer,b.answer);
  assert.equal(e.KP,b.canonical_kp_id);
  assert.equal(source.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(source.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.equal(bank.blocks.some(x=>x.stem===read("site/data/question-bank/p12-b04-b04-47-public-v1.json").blocks.find(x=>x.source_slot_id==="SCI_G04_S1_114_FINAL_006|S1|TF|010")?.stem),false);
});
test("B05 rejects tampering with source, geometry, answer, KP, rights and authorization",()=>{
 for(const mutate of [
  x=>x.blocks[0].answer="①",
  x=>x.blocks[0].canonical_kp_id="sci_g04s1_01_01",
  x=>x.blocks[0].source_pdf_bbox_pts_top_left=null,
  x=>x.blocks[0].source_pdf_sha256="bad",
  x=>x.blocks[0].source_slot_id="unknown",
  x=>x.blocks[0].answer_explanation="",
  x=>x.blocks[0].operator_publication_approval=false,
  x=>x.blocks[0].copyright_path="UNKNOWN",
  x=>x.blocks.find(y=>y.type==="mcq").options=["①bad"]
 ]){
  const v=structuredClone(bank);mutate(v);
  assert.throws(()=>validateAndConvertP12B04B05_40(v,auth));
 }
});
