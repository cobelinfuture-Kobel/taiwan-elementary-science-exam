import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
import {validateAndConvertP12113B02Native21,P12_113_B02_NATIVE21_PATH} from "../site/assets/js/p12-g04s1-113-b02-native21-standalone-release.mjs";
const json=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=json("../site/data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json");
const proof=json("../data/review/p12-g04s1-113-b02-exact21-operator-approved-formal-v1.json");
const authority=validateAuthority(json("../site/data/authority/science-g03-g04-selector-v3.json"));
test("B02 exact21 operator approval inherited from user: 15 TF and 6 original MC, source+BBox and Frozen48 KP",()=>{
 const result=validateAndConvertP12113B02Native21(bank,authority);
 assert.equal(P12_113_B02_NATIVE21_PATH,"../data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json");
 assert.deepEqual([result.answerSlots,result.standaloneTf,result.standaloneChoice,result.contextGroups],[21,15,6,0]);
 assert.equal(proof.operator_input_verbatim,"核准, 下一步");
 assert.equal(proof.formal_before_merge.FORMAL_SCIENCE_KP_APPROVED_new,21);
 assert.equal(proof.formal_before_merge.ADMISSION_READY_new,21);
 assert.equal(proof.formal_before_merge.PUBLISHED_new,0);
 assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.source_id));
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,21);
 assert.equal(proof.counts.HOLD_original_26+proof.counts.HOLD_specific_new_2+proof.counts.duplicate_B01_source_only+proof.counts.exact_operator_approved_student_blocks,50);
});
test("full original question text and MC options preserved modulo non-semantic PDF line wrapping; no printed scores or school figure images",()=>{
 const unbreak=s=>s.replace(/\r\n|\r|\n/g,"").trim();
 for(const [i,b] of bank.blocks.entries()){
   const p=proof.records[i];
   const split=p.original_full_question_PDF_text_layer.split(/[①②③④○]\d?/);
   assert.ok(b.stem.length>=5);
   assert.equal(b.source_pdf_sha256,p.original_school_pdf_sha256);
   assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.original_answer_BBox);
   if(b.type==="tf"){
     assert.equal(b.stem,unbreak(p.original_full_question_PDF_text_layer));
     assert.equal(b.options,undefined);
     assert.ok(["O","X"].includes(b.answer));
   }else{
     assert.equal(b.options.length,4);
     assert.deepEqual(b.options,p.original_choices_PDF_text_layer.map((x,j)=>["①","②","③","④"][j]+unbreak(x.original_text)));
   }
   assert.equal(b.answer,p.accepted_science_answer);
   assert.equal(b.canonical_kp_id,p.canonical_frozen_KP);
   assert.equal(b.operator_publication_approval,true);
   assert.equal(b.original_cropped_assets_included,false);
   assert.equal(b.original_teacher_answer_key_authenticated,false);
   assert.equal(b.rights_license_status,"REGULATED_EXAM_QUESTION_ART9");
 }
});
test("B02 exact21 tamper of any source, answer, KP, MC option or rights fails closed",()=>{
 for(const field of ["stem","answer","canonical_kp_id","source_pdf_sha256","source_pdf_bbox_pts_top_left","rights_license_status","operator_publication_approval"]){
  const bad=structuredClone(bank);
  bad.blocks[0][field]=field==="operator_publication_approval"?false:"CHANGED";
  assert.throws(()=>validateAndConvertP12113B02Native21(bad,authority),/FAIL_CLOSED/);
 }
 const bad=structuredClone(bank);
 const choice=bad.blocks.find(x=>x.type==="mcq");choice.options[2]+="不是原文";
 assert.throws(()=>validateAndConvertP12113B02Native21(bad,authority),/FAIL_CLOSED/);
});
test("cumulative exam loads B02 21 on 113 Frozen48 R5 only, no 28 HOLD nor crossschool B01 duplicate",()=>{
 const code=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 assert.match(code,/validateAndConvertP12113B02Native21/);
 assert.match(code,/\.\.\.b02Native21.blocks/);
 assert.match(code,/\+b02Native21.answerSlots/);
 assert.match(code,/\+b02Native21.standaloneTf/);
 assert.match(code,/\+b02Native21.standaloneChoice/);
 assert.match(code,/activeR5\?validateAndConvertP12113B02Native21/);
 assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_004|S2|TF|11"));
 assert.equal(proof.B02_28_HOLD_unmodified,true);
 assert.equal(proof.B01_closeout_preserved,true);
});
