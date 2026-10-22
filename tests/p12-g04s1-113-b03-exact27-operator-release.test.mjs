import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
import {validateAndConvertP12113B03Native27} from "../site/assets/js/p12-g04s1-113-b03-native27-standalone-release.mjs";

const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=read("../site/data/question-bank/p12-g04s1-113-b03-native27-standalone-public-v1.json");
const proof=read("../data/review/p12-g04s1-113-b03-exact27-operator-approved-formal-v1.json");
const authority=validateAuthority(read("../site/data/authority/science-g03-g04-selector-v3.json"));
test("B03 exact27 operator-authorized originals under existing Frozen48 KP and Article9",()=>{
 const result=validateAndConvertP12113B03Native27(bank,authority);
 assert.deepEqual([result.answerSlots,result.standaloneTf,result.standaloneChoice,result.contextGroups],[27,10,17,0]);
 assert.deepEqual([proof.formal_before_live.FORMAL_SCIENCE_KP_APPROVED_new,proof.formal_before_live.ADMISSION_READY_new,proof.formal_before_live.PUBLISHED_new],[27,27,0]);
 assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.source_id));
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,27);
 assert.equal(proof.count.existing_HOLD+proof.count.additional_similar_duplicate_HOLD+proof.count.legacy7_already_public_suppressed+proof.count.exact_approved_original_student_blocks,50);
 assert.equal(proof.B01_B02_closed_unchanged,true);
});
test("B03 no rewriting printed school answer, original source figures, or source score fields",()=>{
 for(const [i,b] of bank.blocks.entries()){
   const row=proof.records[i];
   assert.equal(b.source_pdf_sha256,row.original_school_pdf_sha256);
   assert.deepEqual(b.source_pdf_bbox_pts_top_left,row.original_answer_bbox);
   assert.equal(b.answer,row.accepted_independent_science_answer);
   assert.equal(b.canonical_kp_id,row.frozen_kp);
   assert.equal(b.stem,row.original_question_stem.replace(/\r\n|\r|\n/g,"").trim());
   if(b.type==="mcq"){
    assert.deepEqual(b.options,row.original_options.map((x,j)=>["①","②","③","④"][j]+x.text.replace(/\r\n|\r|\n/g,"").trim()));
   }
   assert.equal(b.operator_publication_approval,true);
   assert.equal(b.original_cropped_assets_included,false);
   assert.equal(b.original_teacher_answer_key_authenticated,false);
   assert.equal(b.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
   assert.ok(!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"));
 }
});
test("Any tamper of B03 source ID, full original stem, options, answer, KP or rights fails closed",()=>{
 for(const field of ["source_slot_id","stem","answer","canonical_kp_id","rights_license_status","source_pdf_sha256","source_pdf_bbox_pts_top_left","operator_publication_approval"]){
  const bad=structuredClone(bank);bad.blocks[0][field]=field==="operator_publication_approval"?false:"tampered";
  assert.throws(()=>validateAndConvertP12113B03Native27(bad,authority),/FAIL_CLOSED/);
 }
 const bad=structuredClone(bank);bad.blocks[0].options[2]+="已變更";
 assert.throws(()=>validateAndConvertP12113B03Native27(bad,authority),/FAIL_CLOSED/);
});
test("Only exact27 new B03 IDs, no 16 HOLD or 7 already published legacy sources, loaded on active R5 scope",()=>{
 assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_009|S2|MC|15"));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id.startsWith("SCI_G04_S1_113_MID_010|S1|TF|")));
 const source=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 assert.match(source,/activeR5\?validateAndConvertP12113B03Native27/);
 assert.match(source,/\.\.\.b03Native27.blocks/);
 assert.match(source,/\+b03Native27.answerSlots/);
 assert.match(source,/\+b03Native27.standaloneTf/);
 assert.match(source,/\+b03Native27.standaloneChoice/);
});
