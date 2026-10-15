import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12B04ChongdeMid6} from "../site/assets/js/p12-b04-chongde-mid-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json");
const review=read("data/review/p12-b04-chongde-mid6-science-kp-source-acceptance-v1.json");
const original=read("data/source-archive/p12-art9-114-chongde-g04s1-mid16-original-questions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const yongan=read("site/data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json");
test("Chongde six are exact source questions with independent Science/KP, PDF BBox and no duplicate lotus stem",()=>{
 const result=validateAndConvertP12B04ChongdeMid6(bank,authority);
 assert.equal(result.answerSlots,6);
 const index=new Map(original.original_question_records.map(x=>[x.source_id,x]));
 const ledger=new Map(review.records.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const s=index.get(b.source_slot_id),l=ledger.get(b.source_slot_id);
  assert.ok(s&&l);
  assert.equal(s.full_original_stem,b.stem);
  assert.deepEqual(s.full_original_options_in_order.map(o=>o.label+o.text),b.options??[]);
  assert.deepEqual(s.answer_marker_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(s.primary_canonical_kp_id_proposed,b.canonical_kp_id);
  assert.equal(s.science_review_status,"MODEL_SCIENCE_PASS");
  assert.equal(s.kp_review_status,"KP_STRONG_CANDIDATE");
  assert.equal(b.answer,l.science_answer);
  assert.equal(b.answer_explanation,l.science_answer_reason);
  assert.equal(s.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
 }
 assert.ok(review.duplicate_not_published.some(x=>x.source_slot_id==="SCI_G04_S1_114_MID_003|S02|MC|002"));
 assert.equal(bank.blocks.some(x=>x.stem===yongan.blocks.find(y=>y.source_slot_id==="SCI_G04_S1_114_MID_001|MC|S02|010").stem),false);
});
test("Chongde release fails closed on tampered answer, source, rights or dependency",()=>{
 for(const action of [
  b=>b.blocks[0].answer="O",
  b=>b.blocks[0].canonical_kp_id="sci_g04s1_02_01",
  b=>b.blocks[0].source_pdf_bbox_pts_top_left=null,
  b=>b.blocks[0].source_pdf_sha256="bad",
  b=>b.blocks[0].operator_publication_approval=false,
  b=>b.blocks[0].dependency_review_verified=false,
  b=>b.blocks[0].stem=""
 ]){
  const clone=structuredClone(bank);action(clone);
  assert.throws(()=>validateAndConvertP12B04ChongdeMid6(clone,authority));
 }
});
