import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04B04_47} from "../site/assets/js/p12-b04-b04-47-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-b04-47-public-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b04-first50-science-kp-review-v1.json");
const proof=read("data/review/p12-b04-b04-47-formal-science-kp-native-source-acceptance-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B04 47 admission preserves PDF original stem/options/native (1)-(4) markers, unique Science/KP and nine downstream proofs",()=>{
 const release=validateAndConvertP12B04B04_47(bank,auth);
 assert.deepEqual([release.answerSlots,release.standaloneTf,release.standaloneChoice],[47,24,23]);
 assert.equal(proof.approved_items.length,47);
 assert.equal(proof.held_items.length,3);
 assert.equal(bank.expected_parenthetical_source_choices,11);
 const raw=new Map();
 for(const path of new Set(review.records.map(r=>r.original_source_archive_ref))){
  const src=read(path);for(const q of src.original_question_records)raw.set(q.source_id,{q,src});
 }
 const byId=new Map(review.records.map(x=>[x.source_id,x]));
 const evidenced=new Map(proof.approved_items.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const {q,src}=raw.get(b.source_slot_id);
  const r=byId.get(b.source_slot_id),p=evidenced.get(b.source_slot_id);
  assert.ok(r&&p);
  assert.equal(q.full_original_stem,b.stem);
  assert.deepEqual(q.full_original_options_in_order.map(o=>o.label+o.text),b.options??[]);
  assert.deepEqual(q.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(b.source_pdf_sha256,src.original_pdf_sha256);
  assert.equal(b.answer,r.provisional_unique_answer);
  assert.equal(b.answer_explanation,r.independent_science_reasoning);
  assert.equal(b.canonical_kp_id,r.proposed_canonical_kp_id);
  assert.equal(p.full_source_stem_exact,true);
  assert.equal(p.original_source_options_exact,true);
  assert.equal(p.source_standalone_and_no_media_dependency,true);
  assert.equal(p.rights_text_only,true);
  assert.deepEqual(r.exception_flags,[]);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 const parentheses=bank.blocks.filter(x=>x.options?.[0].startsWith("(1)"));
 assert.equal(parentheses.length,11);
 for(const b of parentheses){
  assert.deepEqual(b.options.map(x=>x.slice(0,3)),["(1)","(2)","(3)","(4)"]);
  assert.match(b.answer,/^\([1-4]\)$/);
 }
 assert.deepEqual(proof.held_items.map(x=>x.batch_ordinal),[28,35,41]);
});
test("B04 admission closes on altered science answer, KP, raw choices, source BBox, rights or operator release",()=>{
 for(const mutate of [
  x=>{x.blocks[0].answer="O";},
  x=>{x.blocks[0].canonical_kp_id="sci_g04s1_01_01";},
  x=>{x.blocks[0].source_pdf_bbox_pts_top_left=null;},
  x=>{x.blocks[0].source_pdf_sha256="bad";},
  x=>{x.blocks[0].answer_explanation="";},
  x=>{x.blocks[0].copyright_path="UNKNOWN";},
  x=>{x.blocks[0].operator_publication_approval=false;},
  x=>{x.blocks.find(y=>y.options?.[0].startsWith("(1)")).options[0]="①"+x.blocks.find(y=>y.options?.[0].startsWith("(1)")).options[0].slice(3);}
 ]){
  const copy=structuredClone(bank);mutate(copy);
  assert.throws(()=>validateAndConvertP12B04B04_47(copy,auth));
 }
});
