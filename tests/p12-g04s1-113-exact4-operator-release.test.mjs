import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Exact4} from "../site/assets/js/p12-g04s1-113-exact4-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-exact4-public-v1.json");
const approval=read("data/review/p12-g04s1-113-exact4-operator-approved-formal-v3.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const approvalBySource=new Map(approval.records.map(x=>[x.source_slot_id,x]));
test("four precise science unique direct frozen48 source MC operator approval and Art9 text-only, fail closed",()=>{
 const o=validateAndConvertP12113Exact4(bank,authority);
 assert.deepEqual([o.answerSlots,o.standaloneTf,o.standaloneChoice,o.contextGroups],[4,0,4,0]);
 assert.equal(approval.operator_approval_input_verbatim,"核准, 下一步");
 assert.equal(approval.operator_approval_is_explicit_followup_to_exact_four_release_request,true);
 assert.equal(approval.summary.new_formal_science_kp_approved,4);
 assert.equal(approval.summary.new_admission_ready,4);
 assert.equal(approval.summary.new_published_before_main_pages,0);
 const ids=new Set();
 for(const b of bank.blocks){
  assert.ok(!ids.has(b.source_slot_id));ids.add(b.source_slot_id);
  const item=approvalBySource.get(b.source_slot_id);
  assert.ok(item);
  assert.equal(item.canonical_kp_id,b.canonical_kp_id);
  assert.equal(item.source_pdf_sha256,b.source_pdf_sha256);
  assert.deepEqual(item.source_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(item.admission_ready,true);
  assert.equal(item.published,false);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
  assert.ok(!("points" in b)&&!("score" in b)&&!("scoring" in b));
  assert.deepEqual(b.options.map(x=>x[0]),["①","②","③","④"]);
 }
 assert.deepEqual(bank.blocks.map(x=>x.answer),["④","①","③","④"]);
 assert.equal(ids.size,4);
});
test("no published source identities repeated; immutable source/choices/rights/answer/geometry tampering fails",()=>{
 const slots=new Set(bank.blocks.map(x=>x.source_slot_id));
 const dir=new URL("../site/data/question-bank/",import.meta.url);
 for(const fname of readdirSync(dir).filter(x=>x.endsWith(".json")&&!x.includes("exact4-public"))){
  const d=JSON.parse(readFileSync(new URL(fname,dir),"utf8"));
  for(const q of (d.blocks||[]).flatMap(x=>x.items||[x]))
   if(q.source_slot_id)assert.ok(!slots.has(q.source_slot_id),"published duplicate "+fname+" "+q.source_slot_id);
 }
 const edits=[
  d=>d.blocks[0].stem+="！",d=>d.blocks[0].options[1]="②篡改",d=>d.blocks[0].answer="①",
  d=>d.blocks[0].canonical_kp_id="sci_g04s1_04_08",d=>d.blocks[0].source_pdf_sha256="0".repeat(64),
  d=>d.blocks[0].source_pdf_bbox_pts_top_left[0]+=2,d=>d.blocks[0].rights_license_status="UNKNOWN",
  d=>d.blocks[0].operator_publication_approval=false,d=>d.blocks[0].original_cropped_assets_included=true,
  d=>d.expected_blocks=5
 ];
 for(const change of edits){const x=structuredClone(bank);change(x);assert.throws(()=>validateAndConvertP12113Exact4(x,authority));}
});
