import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Native5After105} from "../site/assets/js/p12-g04s1-113-dongguang-dahua-native5-after105-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-dongguang-dahua-native5-after105-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-dongguang-dahua-native5-after105-formal-evidence-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Two exact original PDFs: 5 answer glyph BBoxes, exact stems/options and direct 113 frozen 48 KP",()=>{
 const a=validateAndConvertP12113Native5After105(bank,authority);
 assert.deepEqual([a.answerSlots,a.standaloneTf,a.standaloneChoice,a.contextGroups],[5,3,2,0]);
 assert.deepEqual([evidence.base_public_answer_slots,evidence.published_113_before,evidence.native_pdf_rawdict_bbox_proven_count,evidence.formal_science_kp_approved_new,evidence.admission_ready_new,evidence.published_new_before_main_and_pages],[741,105,5,5,5,0]);
 assert.equal(evidence.records.length,5);
 assert.equal(evidence.original_pdfs.length,2);
 assert.equal(new Set(evidence.records.map(e=>e.source_slot_id)).size,5);
 for(const b of bank.blocks){
  const r=evidence.records.find(e=>e.source_slot_id===b.source_slot_id);
  assert.ok(r,"source lineage exact");
  assert.equal(norm(r.original_stem),norm(b.stem));
  assert.deepEqual(r.original_full_ordered_options,b.options||null);
  assert.equal(r.model_science_unique_answer,b.answer);
  assert.equal(r.direct_canonical_kp_id,b.canonical_kp_id);
  assert.deepEqual(r.original_printed_answer_parenthesis_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(r.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(r.source_pdf_page_1_based,b.source_page_pdf_1_based);
  assert.equal(r.teacher_answer_not_authenticated,true);
  assert.equal(r.formal_science_kp_approved,true);
  assert.equal(r.admission_ready,true);
 }
});
test("Original source science and rights fields fail closed on mutation",()=>{
 const edits=[
  d=>d.blocks[0].stem+="？",d=>d.blocks[1].answer="X",
  d=>d.blocks[2].canonical_kp_id="sci_g04s1_02_11",
  d=>d.blocks[3].options[2]="③鏡子",
  d=>d.blocks[4].source_pdf_bbox_pts_top_left[2]+=1,
  d=>d.blocks[0].operator_publication_approval=false,
  d=>d.blocks[3].source_slot_id="SCI_G04_S1_113_FINAL_010|S02|MC|016",
  d=>d.expected_answer_slots=6
 ];
 for(const edit of edits){const j=structuredClone(bank);edit(j);assert.throws(()=>validateAndConvertP12113Native5After105(j,authority));}
});
test("No duplicate source ID or identical normalized original stem in active public student banks",()=>{
 const slots=new Set(bank.blocks.map(b=>b.source_slot_id));
 const stems=new Set(bank.blocks.map(b=>norm(b.stem)));
 for(const file of readdirSync("site/data/question-bank").filter(f=>f.endsWith(".json")&&f!=="p12-g04s1-113-dongguang-dahua-native5-after105-public-v1.json")){
  const j=read("site/data/question-bank/"+file);
  const rows=(j.blocks||[]).flatMap(b=>b.type==="group"?(b.items||[]):[b]);
  for(const r of rows){
   assert.equal(slots.has(r.source_slot_id),false,"Repeat public source "+file);
   if(r.stem)assert.equal(stems.has(norm(r.stem)),false,"Repeat same original stem "+file);
  }
 }
});
