import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B01_47} from "../site/assets/js/p12-b04-b01-47-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b01-47-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b01-first50-science-review-v1.json");
const acceptance=read("data/review/p12-b04-b01-47-formal-science-kp-acceptance-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B01 47 are exact original source TF/MC with answers, bbox, semantic KP and no held duplicates",()=>{
 const result=validateAndConvertP12B04B01_47(bank,authority);
 assert.equal(result.answerSlots,47);
 assert.equal(result.standaloneTf,25);
 assert.equal(result.standaloneChoice,22);
 assert.equal(acceptance.approved_items.length,47);
 const source=new Map();
 for(const f of new Set(review.records.map(x=>x.original_source_archive_ref))){
  const data=read(f);
  for(const r of data.original_question_records)source.set(r.source_id,{q:r,meta:data});
 }
 const checked=new Map(acceptance.approved_items.map(x=>[x.source_slot_id,x]));
 const reviewMap=new Map(review.records.map(x=>[x.source_id,x]));
 for(const b of bank.blocks){
  const {q,meta}=source.get(b.source_slot_id);
  const x=checked.get(b.source_slot_id),p=reviewMap.get(b.source_slot_id);
  assert.ok(x&&p);
  assert.equal(b.stem,q.full_original_stem);
  assert.deepEqual(b.options??[],q.full_original_options_in_order.map(o=>o.label+o.text));
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,q.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(b.source_pdf_sha256,meta.original_pdf_sha256);
  assert.equal(b.answer,p.model_proposed_answer);
  assert.equal(b.answer,x.science_answer_reviewed);
  assert.equal(b.answer_explanation,x.science_reasoning);
  assert.equal(b.canonical_kp_id,x.certified_kp_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(meta.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(meta.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.equal(p.holds.length,0);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.deepEqual(bank.blocks.filter(x=>x.canonical_kp_id!==reviewMap.get(x.source_slot_id).proposed_canonical_kp_id).map(x=>x.b01_review_ordinal),[18,19,37]);
 assert.deepEqual(acceptance.exception_source_ids.length,3);
});
test("B01 refuses wrong answer, mistaken KP, source geometry, unapproved ID, missing rights and missing explanation",()=>{
 for(const modify of [
  b=>{b.blocks[0].answer="X";},
  b=>{b.blocks[0].canonical_kp_id="sci_g04s1_01_01";},
  b=>{b.blocks[0].source_pdf_bbox_pts_top_left=null;},
  b=>{b.blocks[0].source_pdf_sha256="a".repeat(64);},
  b=>{b.blocks[0].source_slot_id="NOT_AUTHORIZED";},
  b=>{b.blocks[0].copyright_path="UNKNOWN";},
  b=>{b.blocks[0].answer_explanation="";},
  b=>{b.blocks[0].operator_publication_approval=false;}
 ]){
  const v=structuredClone(bank);modify(v);
  assert.throws(()=>validateAndConvertP12B04B01_47(v,authority));
 }
});
