import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113NextNative6} from "../site/assets/js/p12-g04s1-113-next-native-tfmc6-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-next-native-tfmc6-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-next-native-tfmc6-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Two native school PDFs: six exact original response bboxes and direct frozen Science/KP admission",()=>{
 const r=validateAndConvertP12113NextNative6(bank,authority);
 assert.deepEqual([r.answerSlots,r.standaloneTf,r.standaloneChoice,r.contextGroups],[6,2,4,0]);
 assert.deepEqual([evidence.pre_public_answer_slots,evidence.pre_113_published_source_positions,evidence.formal_science_kp_approved_new,evidence.admission_ready_new,evidence.published_new_after_pages_success],[724,88,6,6,6]);
 assert.equal(evidence.records.length,6);
 assert.equal(new Set(evidence.records.map(r=>r.source_slot_id)).size,6);
 for(const b of bank.blocks){
  const x=evidence.records.find(r=>r.source_slot_id===b.source_slot_id);
  assert.ok(x);
  assert.equal(norm(x.original_stem),norm(b.stem));
  assert.deepEqual(x.original_options_in_order,b.options??null);
  assert.equal(x.model_independently_reasoned_answer,b.answer);
  assert.equal(x.canonical_direct_kp_id,b.canonical_kp_id);
  assert.deepEqual(x.original_answer_parenthesis_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(x.source_pdf_sha256,b.source_pdf_sha256);
  assert.equal(x.source_page_pdf_1_based,1);
  assert.equal(x.teacher_original_answer_key_verified,false);
 }
});
test("Six school original exam questions immutably fail-closed on source, options, answer, KP, rights and operator",()=>{
 const edits=[
  j=>j.blocks[0].stem+="？",j=>j.blocks[1].options[1]="②水生植物全無",
  j=>j.blocks[2].answer="③",j=>j.blocks[3].canonical_kp_id="sci_g04s1_03_06",
  j=>j.blocks[4].source_pdf_bbox_pts_top_left[1]+=1,j=>j.blocks[5].operator_publication_approval=false,
  j=>j.blocks.splice(0,1),j=>j.expected_answer_slots=7
 ];
 for(const edit of edits){const j=structuredClone(bank);edit(j);assert.throws(()=>validateAndConvertP12113NextNative6(j,authority));}
});
test("Six original source identifiers and exact normalized stems never duplicate currently published banks",()=>{
 const ids=new Set(bank.blocks.map(b=>b.source_slot_id));
 const stems=new Set(bank.blocks.map(b=>norm(b.stem)));
 for(const p of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-next-native-tfmc6-public-v1.json")){
  const j=read("site/data/question-bank/"+p);
  for(const b of j.blocks??[]){
   if(b.type==="group"){
    for(const q of b.items??[]){
     assert.equal(ids.has(q.source_slot_id),false,"Source duplicate: "+p);
     if(q.stem)assert.equal(stems.has(norm(q.stem)),false,"Stem duplicate: "+p);
    }
   }else{
    assert.equal(ids.has(b.source_slot_id),false,"Source duplicate: "+p);
    if(b.stem)assert.equal(stems.has(norm(b.stem)),false,"Stem duplicate: "+p);
   }
  }
 }
});
