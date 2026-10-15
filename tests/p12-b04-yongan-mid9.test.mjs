import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {validateAndConvertP12B04YonganMid9} from "../site/assets/js/p12-b04-yongan-mid-release.mjs";
import {loadEmbeddedHistoricalBank} from "../site/assets/js/historical-bank-ox-v6.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(readFileSync(resolve(root,p),"utf8"));
const bankPath="site/data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json";
const reviewPath="data/review/p12-b04-yongan-mid9-science-kp-source-acceptance-v1.json";
const sourcePath="data/source-archive/p12-art9-114-yongan-g04s1-mid20-original-questions-v1.json";
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("B04 nine release matches original source text, ordered options, answers, KP and exact marker geometry",()=>{
 const bank=read(bankPath),review=read(reviewPath),source=read(sourcePath);
 assert.equal(validateAndConvertP12B04YonganMid9(bank,authority).answerSlots,9);
 assert.equal(review.source_question_count,9);
 const original=new Map(source.original_question_records.map(x=>[x.source_id,x]));
 const reviewed=new Map(review.records.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const s=original.get(b.source_slot_id),r=reviewed.get(b.source_slot_id);
  assert.ok(s&&r,"source/review missing");
  assert.equal(b.stem,s.full_original_stem);
  assert.deepEqual(b.options??[],s.full_original_options_in_order.map(o=>o.label+o.text));
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,s.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(b.canonical_kp_id,s.primary_canonical_kp_id_proposed);
  assert.equal(b.answer,r.answer_independently_reviewed);
  assert.equal(b.stem,r.original_full_stem);
  assert.equal(b.answer_explanation,r.science_answer_reason);
  assert.equal(s.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(s.science_review_status,"MODEL_SCIENCE_PASS");
  assert.equal(s.kp_review_status,"KP_STRONG_CANDIDATE");
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
});
test("B04 fails closed on answer, KP, geometry, source or rights tampering",()=>{
 const base=read(bankPath);
 for(const mutate of [
  b=>{b.blocks[0].answer="O";},
  b=>{b.blocks[0].canonical_kp_id="sci_g04s1_02_01";},
  b=>{b.blocks[0].source_pdf_bbox_pts_top_left=null;},
  b=>{b.blocks[0].source_pdf_sha256="0".repeat(64);},
  b=>{b.blocks[0].dependency_review_verified=false;},
  b=>{b.blocks[0].options=["①A"];}
 ]){
  const value=structuredClone(base);mutate(value);
  if(value.blocks[0].type==="tf"&&value.blocks[0].options)assert.throws(()=>validateAndConvertP12B04YonganMid9(value,authority));
  else assert.throws(()=>validateAndConvertP12B04YonganMid9(value,authority));
 }
});
test("B04 runtime integrates with existing certified bank and preserves 251 prior slots",async()=>{
 const originalFetch=globalThis.fetch;
 const files={
  "../data/question-bank/approved-historical-ox-v4.json":"site/data/question-bank/approved-historical-ox-v4.json",
  "../data/question-bank/certified-context-groups-content-v3.json":"site/data/question-bank/certified-context-groups-content-v3.json",
  "../data/question-bank/p12-g03s2mid-approved-six-v1.json":"site/data/question-bank/p12-g03s2mid-approved-six-v1.json",
  "../data/question-bank/p12-g03s2mid-remaining51-public-v1.json":"site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json",
  "../data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json":"site/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json",
  "../data/question-bank/p12-g03s2final-46-public-v1.json":"site/data/question-bank/p12-g03s2final-46-public-v1.json",
  "../data/governance/p12-g03s2final-46-operator-public-approval-v1.json":"site/data/governance/p12-g03s2final-46-operator-public-approval-v1.json",
  "../data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json":bankPath,
  "../data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json":"site/data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json",
  "../data/question-bank/p12-b04-b01-47-public-v1.json":"site/data/question-bank/p12-b04-b01-47-public-v1.json"
 };
 // Isolated fake fetch, no browser or external network.
 globalThis.fetch=async url=>{
  const file=files[url];
  return {ok:!!file, json:async()=>read(file)};
 };
 try{
  const result=await loadEmbeddedHistoricalBank(authority);
  assert.equal(result.certifiedAnswerSlots,313);
  assert.equal(result.blocks.filter(x=>x.source_id==="SCI_G04_S1_114_MID_001").length,9);
 }finally{globalThis.fetch=originalFetch;}
});
