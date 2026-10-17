import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113HanlinNative5} from "../site/assets/js/p12-g04s1-113-hanlin-native5-after100-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-hanlin-native5-after100-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-hanlin-native5-after100-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Three original 113 Hanlin native paper Science KP admission exactly five source BBoxes",()=>{
 const a=validateAndConvertP12113HanlinNative5(bank,authority);
 assert.deepEqual([a.answerSlots,a.standaloneTf,a.standaloneChoice,a.contextGroups],[5,4,1,0]);
 assert.deepEqual([evidence.prior_suppressed_published_113,evidence.prior_student_answer_slots,evidence.formal_science_kp_approved,evidence.admission_ready,evidence.student_published_before_main_pages_e2e],[100,736,5,5,0]);
 assert.equal(evidence.original_pdf_verified.length,3);
 assert.equal(evidence.records.length,5);
 assert.equal(evidence.native_pdf_rawdict_printed_answer_bbox_verified,5);
 assert.equal(evidence.records.filter(x=>x.source_id==="SCI_G04_S1_113_MID_016").length,2);
 assert.equal(evidence.records.filter(x=>x.source_id==="SCI_G04_S1_113_MID_017").length,2);
 assert.equal(evidence.records.filter(x=>x.source_id==="SCI_G04_S1_113_MID_018").length,1);
 for(const b of bank.blocks){
  const e=evidence.records.find(x=>x.source_slot_id===b.source_slot_id);
  assert.ok(e,"evidence original source slot");
  assert.equal(norm(e.original_full_stem),norm(b.stem));
  assert.deepEqual(e.original_ordered_options,b.options??null);
  assert.equal(e.model_independently_reasoned_answer,b.answer);
  assert.equal(e.canonical_direct_kp_id,b.canonical_kp_id);
  assert.equal(e.original_pdf_sha256,b.source_pdf_sha256);
  assert.deepEqual(e.original_answer_parenthesis_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(e.original_pdf_page_1_based,1);
  assert.equal(e.teacher_original_answer_key_authenticated,false);
  assert.equal(e.formal_science_kp_approved,true);
  assert.equal(e.admission_ready,true);
 }
});
test("Hanlin native5 original stem / source / answer / KP / rights / operator acceptance fail-closed",()=>{
 const mutations=[
  d=>d.blocks[0].stem+="？",
  d=>d.blocks[1].options[1]="②油",
  d=>d.blocks[2].answer="O",
  d=>d.blocks[3].canonical_kp_id="sci_g04s1_02_02",
  d=>d.blocks[4].source_pdf_bbox_pts_top_left[0]+=1,
  d=>d.blocks[0].operator_publication_approval=false,
  d=>d.blocks[4].source_slot_id="SCI_G04_S1_113_MID_018|S02|TF|008",
  d=>d.expected_answer_slots=6
 ];
 for(const m of mutations){const d=structuredClone(bank);m(d);assert.throws(()=>validateAndConvertP12113HanlinNative5(d,authority));}
});
test("Exact-stem plus source-slot duplication never enters any existing active student public bank",()=>{
 const ids=new Set(bank.blocks.map(b=>b.source_slot_id));
 const stems=new Set(bank.blocks.map(b=>norm(b.stem)));
 for(const filename of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-hanlin-native5-after100-public-v1.json")){
  const data=read("site/data/question-bank/"+filename);
  for(const b of data.blocks??[]){
   const children=b.type==="group"?(b.items||[]):[b];
   for(const x of children){
    assert.equal(ids.has(x.source_slot_id),false,filename+" exact published source duplicate");
    if(x.stem)assert.equal(stems.has(norm(x.stem)),false,filename+" exact published stem duplicate");
   }
  }
 }
});
