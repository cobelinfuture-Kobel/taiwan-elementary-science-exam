import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
import {validateAndConvertP12113B04Native36} from "../site/assets/js/p12-g04s1-113-b04-native36-standalone-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=read("../site/data/question-bank/p12-g04s1-113-b04-native36-standalone-public-v1.json");
const proof=read("../data/review/p12-g04s1-113-b04-exact36-operator-approved-formal-v1.json");
const authority=validateAuthority(read("../site/data/authority/science-g03-g04-selector-v3.json"));
test("B04 fixed50 operator-approved exact36 school test items, 13 HOLD and one published duplicate",()=>{
 const r=validateAndConvertP12113B04Native36(bank,authority);
 assert.deepEqual([r.answerSlots,r.standaloneTf,r.standaloneChoice,r.contextGroups],[36,22,14,0]);
 assert.deepEqual([proof.formal_before_live.FORMAL_SCIENCE_KP_APPROVED_new,proof.formal_before_live.ADMISSION_READY_new,proof.formal_before_live.PUBLISHED_new],[36,36,0]);
 assert.equal(proof.counts.source_work_positions,50);
 assert.equal(proof.counts.total_HOLD,13);
 assert.equal(proof.counts.already_public_exact_duplicate_suppressed,1);
 assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.source_id));
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,36);
 assert.equal(proof.B01_B02_B03_closed_unchanged,true);
});
test("source, original MC choice text, answer, PDF source SHA/BBox and frozen KP are independently preserved",()=>{
 const norm=s=>String(s).replace(/\r\n|\r|\n/g,"").trim();
 for(const [i,b] of bank.blocks.entries()){
  const p=proof.records[i];
  assert.equal(b.source_slot_id,p.source_id);
  assert.equal(b.source_original_slot_id,p.original_source_slot_id);
  assert.equal(b.source_pdf_sha256,p.original_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,p.original_pdf_page);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.original_native_answer_bbox);
  assert.equal(b.stem,norm(p.original_exact_stem));
  assert.equal(b.answer,p.independent_answer);
  assert.equal(b.canonical_kp_id,p.canonical_frozen_kp);
  assert.ok(b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.operator_publication_approval===true&&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
   &&!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"));
  if(b.type==="mcq")assert.deepEqual(b.options,p.original_printed_option_labels_and_text.map((o,j)=>["①","②","③","④"][j]+norm(o.text)));
 }
});
test("every change of exact original question content, rights or science answer fails closed",()=>{
 for(const field of ["source_slot_id","stem","answer","canonical_kp_id","source_pdf_sha256","source_pdf_bbox_pts_top_left","rights_license_status","operator_publication_approval"]){
  const x=structuredClone(bank);x.blocks[0][field]=field==="operator_publication_approval"?false:"TAMPER";
  assert.throws(()=>validateAndConvertP12113B04Native36(x,authority),/FAIL_CLOSED/);
 }
 const x=structuredClone(bank),choice=x.blocks.find(b=>b.type==="mcq");choice.options[0]+="已變更";
 assert.throws(()=>validateAndConvertP12113B04Native36(x,authority),/FAIL_CLOSED/);
});
test("current 113 R5 loader includes exact36, excludes 13 hold and one prior exact public source",()=>{
 const code=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 assert.match(code,/activeR5\?validateAndConvertP12113B04Native36/);
 for(const s of ["...b04Native36.blocks","+b04Native36.answerSlots","+b04Native36.standaloneTf","+b04Native36.standaloneChoice"])assert.ok(code.includes(s));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_014|S1|TF|2"));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_015|S1|TF|5"));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id.startsWith("SCI_G04_S1_113_MID_010|S1|TF|")));
});
