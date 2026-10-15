import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B02_41} from "../site/assets/js/p12-b04-b02-41-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b02-41-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b02-first50-science-kp-review-v1.json");
const approval=read("data/review/p12-b04-b02-41-formal-science-kp-acceptance-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B02 41 admitted match full original stems, all choices, PDF pages/BBox, source SHA, independent science and canonical KP",()=>{
 const val=validateAndConvertP12B04B02_41(bank,auth);
 assert.deepEqual([val.answerSlots,val.standaloneTf,val.standaloneChoice],[41,23,18]);
 assert.equal(approval.approved_items.length,41);
 const original=new Map();
 for(const p of [...new Set(review.records.map(x=>x.source_archive_ref))]){
  const source=read(p);
  for(const r of source.original_question_records)original.set(r.source_id,{r,source});
 }
 const map=new Map(review.records.map(x=>[x.source_id,x]));
 const accepted=new Map(approval.approved_items.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const {r,source}=original.get(b.source_slot_id);
  const v=map.get(b.source_slot_id),e=accepted.get(b.source_slot_id);
  assert.ok(v&&e);
  assert.equal(b.stem,r.full_original_stem);
  assert.deepEqual(b.options??[],r.full_original_options_in_order.map(o=>o.label+o.text));
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,r.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(b.source_pdf_sha256,source.original_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,r.answer_marker_pdf_page);
  assert.equal(b.answer,v.model_proposed_answer);
  assert.equal(b.answer_explanation,v.independent_science_reasoning);
  assert.equal(b.canonical_kp_id,v.kp_candidate);
  assert.equal(b.canonical_kp_id,e.canonical_kp_semantic_match);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(source.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(source.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.deepEqual(v.exception_flags,[]);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.deepEqual(approval.held_items.map(x=>x.ordinal),[18,26,29,30,31,32,33,41,44]);
 assert.equal(approval.duplicates_exact_stem_across_25_source_papers,0);
});
test("B02 fail-closed on wrong answer, KP, BBox, rights, missing source, erroneous options",()=>{
 for(const fn of [
  v=>v.blocks[0].answer="④",
  v=>v.blocks[0].canonical_kp_id="sci_g04s1_01_01",
  v=>v.blocks[0].source_pdf_bbox_pts_top_left=null,
  v=>v.blocks[0].source_pdf_sha256="broken",
  v=>v.blocks[0].stem="",
  v=>v.blocks[0].options=["①bad"],
  v=>v.blocks[0].operator_publication_approval=false,
  v=>v.blocks[0].dependency_review_verified=false
 ]){
  const copy=structuredClone(bank);fn(copy);
  assert.throws(()=>validateAndConvertP12B04B02_41(copy,auth));
 }
});
