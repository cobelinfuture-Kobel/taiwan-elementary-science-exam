import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
import {validateAndConvertP12113B05Native24} from "../site/assets/js/p12-g04s1-113-b05-native24-standalone-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=read("../site/data/question-bank/p12-g04s1-113-b05-native24-standalone-public-v1.json");
const proof=read("../data/review/p12-g04s1-113-b05-exact24-operator-approved-formal-v1.json");
const authority=validateAuthority(read("../site/data/authority/science-g03-g04-selector-v3.json"));
const norm=s=>String(s).replace(/\r\n|\r|\n/g,"").trim();

test("B05 existing 50-source routing: 24 exact school questions, 25 HOLD and 1 already-public 114 reordered-choice alias",()=>{
 const r=validateAndConvertP12113B05Native24(bank,authority);
 assert.deepEqual([r.answerSlots,r.standaloneTf,r.standaloneChoice,r.contextGroups],[24,8,16,0]);
 assert.deepEqual(Object.values(proof.formal_before_live),[24,24,0]);
 assert.equal(proof.operator_input_verbatim,"核准 B05 精確 24 題清冊，依既有 Gate 選擇性發布。");
 assert.equal(proof.counts.source_work_positions,50);
 assert.equal(proof.counts.total_HOLD,25);
 assert.equal(proof.counts.already_public_crossyear_option_reorder_alias,1);
 assert.equal(proof.operator_exact24_approved,true);
 assert.equal(proof.no_B01_B04_reopen,true);
 assert.equal(new Set(bank.blocks.map(x=>x.source_slot_id)).size,24);
 assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.original_source_slot_id));
 const all=[...bank.blocks.map(x=>x.source_slot_id),...proof.excluded_prior24_hold_ids,proof.excluded_science_qualifier_HOLD.source_id,proof.excluded_crossyear_published_alias.original_source_id];
 assert.equal(all.length,50);
 assert.equal(new Set(all).size,50);
});

test("B05 exact24 original school PDF/native answer BBox/full choices/science/48KP preserved, no printed scores",()=>{
 for(const [i,b] of bank.blocks.entries()){
  const p=proof.records[i];
  assert.equal(b.source_slot_id,p.original_source_slot_id);
  assert.equal(b.source_original_slot_id,p.original_source_legacy_id);
  assert.equal(b.source_pdf_sha256,p.source_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,p.original_pdf_page);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.original_native_answer_bbox_pdf_pt);
  assert.equal(b.stem,norm(p.original_exact_stem));
  assert.equal(b.answer,p.independent_answer);
  assert.equal(b.canonical_kp_id,p.canonical_frozen_kp);
  assert.equal(b.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.operator_publication_approval,true);
  assert.ok(!Object.hasOwn(b,"points")&&!Object.hasOwn(b,"score"));
  if(b.type==="mcq")assert.deepEqual(b.options,p.original_printed_option_labels_and_text.map(o=>o.original_marker+norm(o.text)));
 }
});

test("B05 release adapter fails closed on source/answer/rights/options tampering",()=>{
 for(const field of ["stem","source_pdf_sha256","source_pdf_bbox_pts_top_left","answer","canonical_kp_id","rights_license_status","operator_publication_approval"]){
  const x=structuredClone(bank);
  x.blocks[0][field]=field==="operator_publication_approval"?false:"TAMPER";
  assert.throws(()=>validateAndConvertP12113B05Native24(x,authority),/FAIL_CLOSED/);
 }
 const mc=structuredClone(bank);
 mc.blocks.find(x=>x.type==="mcq").options[0]+="被竄改";
 assert.throws(()=>validateAndConvertP12113B05Native24(mc,authority),/FAIL_CLOSED/);
});

test("B05 loader wiring: exact24 to active R5 and 24 answers; do not reopen B01-B04",()=>{
 const code=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 assert.match(code,/activeR5\?validateAndConvertP12113B05Native24/);
 for(const key of ["...b05Native24.blocks","+b05Native24.standaloneTf","+b05Native24.standaloneChoice","+b05Native24.answerSlots"])
  assert.ok(code.includes(key));
 assert.equal(bank.blocks.filter(x=>x.source_id==="SCI_G04_S1_113_MID_015").length,11);
 assert.equal(bank.blocks.filter(x=>x.source_id==="SCI_G04_S1_113_FINAL_006").length,12);
 assert.equal(bank.blocks.filter(x=>x.source_id==="SCI_G04_S1_113_MID_018").length,1);
 assert.ok(!bank.blocks.some(x=>x.source_slot_id===proof.excluded_crossyear_published_alias.original_source_id));
 assert.ok(!bank.blocks.some(x=>x.source_slot_id===proof.excluded_science_qualifier_HOLD.source_id));
});
