import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B06_47} from "../site/assets/js/p12-b04-b06-47-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b06-47-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b06-first50-science-kp-review-v1.json");
const proof=read("data/review/p12-b04-b06-47-formal-science-kp-acceptance-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const squish=s=>String(s??"").replace(/\s+/g,"");
const noScore=s=>squish(s).replace(/\(\d+分\)/g,"");
test("B06 47 source-exact Science/KP admits 37 TF 10 MC; all 12 original score annotations remain archived",()=>{
 const result=validateAndConvertP12B04B06_47(bank,authority);
 assert.deepEqual([result.answerSlots,result.standaloneTf,result.standaloneChoice],[47,37,10]);
 assert.equal(proof.approved_items.length,47);
 assert.equal(proof.held_items.length,3);
 assert.deepEqual(proof.held_items.map(x=>x.ordinal),[5,6,50]);
 assert.deepEqual([proof.scoreless_admitted_source_count,proof.score_annotation_original_review_count],[11,12]);
 const sources=new Map();
 for(const path of new Set(review.records.map(x=>x.original_source_archive_ref))){
  const p=read(path);for(const q of p.original_question_records)sources.set(q.source_id,{q,p});
 }
 const byR=new Map(review.records.map(x=>[x.source_id,x]));
 const byP=new Map(proof.approved_items.map(x=>[x.source_slot_id,x]));
 let scored=0;
 for(const b of bank.blocks){
  const {q,p}=sources.get(b.source_slot_id),r=byR.get(b.source_slot_id),e=byP.get(b.source_slot_id);
  assert.ok(e&&r);
  assert.equal(noScore(q.full_original_stem),noScore(b.stem));
  assert.deepEqual(q.full_original_options_in_order.map(o=>o.label+o.text),b.options??[]);
  assert.deepEqual(q.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(p.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.model_proposed_unique_answer,b.answer);
  assert.equal(r.independent_science_reasoning,b.answer_explanation);
  assert.equal(e.KP,b.canonical_kp_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(p.license_status,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(p.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
  assert.deepEqual(r.exception_flags,[]);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  if(r.source_score_annotation_intentionally_excluded){
   scored++;
   assert.equal(e.full_original_stem_exact,q.full_original_stem);
   assert.equal(e.original_parent_scoring_instruction_preserved,q.full_original_stem);
   assert.equal(e.scoreless_stem_projection_verified,true);
  } else assert.equal(squish(q.full_original_stem),squish(b.stem));
 }
 assert.equal(scored,11);
});
test("B06 refuses changes to Science answer, KP, original options, source PDF geometry, rights or admission",()=>{
 for(const edit of [
  b=>b.blocks[0].answer="X",
  b=>b.blocks[0].canonical_kp_id="sci_g04s1_01_01",
  b=>b.blocks[0].source_pdf_bbox_pts_top_left=null,
  b=>b.blocks[0].source_pdf_sha256="wrong",
  b=>b.blocks[0].source_slot_id="UNKNOWN",
  b=>b.blocks.find(x=>x.type==="mcq").options=["①incorrect"],
  b=>b.blocks[0].answer_explanation="",
  b=>b.blocks[0].operator_publication_approval=false,
  b=>b.blocks[0].copyright_path="UNKNOWN"
 ]){
  const v=structuredClone(bank);edit(v);
  assert.throws(()=>validateAndConvertP12B04B06_47(v,authority));
 }
});
