import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113WendeNative2} from "../site/assets/js/p12-g04s1-113-wende-mid-native2-after111-release.mjs";

const load=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=load("site/data/question-bank/p12-g04s1-113-wende-mid-native2-after111-public-v1.json");
const evidence=load("data/review/p12-g04s1-113-wende-mid-native2-after111-formal-evidence-v1.json");
const authority=load("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\\s+/gu,"");

test("Wende after111 both native page1 original source glyph, unique science, KP48 and rights parity",()=>{
 const accepted=validateAndConvertP12113WendeNative2(bank,authority);
 assert.deepEqual([accepted.answerSlots,accepted.standaloneTf,accepted.standaloneChoice,accepted.contextGroups],[2,2,0,0]);
 assert.equal(evidence.pre_existing_113_published_sources,111);
 assert.equal(evidence.pre_existing_public_answer_slots,747);
 assert.equal(evidence.formal_science_kp_approved_new,2);
 assert.equal(evidence.admission_ready_new,2);
 assert.equal(evidence.published_new_before_merge_main_and_live_pages_e2e,0);
 assert.equal(evidence.original_teacher_answer_key_authenticated,false);
 assert.equal(evidence.original_pdf_sha256,"7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56");
 for(const b of accepted.blocks){
  const a=evidence.records.find(x=>x.source_slot_id===b.source_slot_id);
  assert.ok(a);
  assert.equal(a.source_page_pdf_1_based,b.source_page_pdf_1_based);
  assert.deepEqual(a.printed_answer_parenthesis_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(norm(a.original_full_stem),norm(b.stem));
  assert.equal(a.independent_science_answer,b.answer);
  assert.equal(a.canonical_direct_kp_id,b.canonical_kp_id);
  assert.equal(a.formal_gate,"ADMISSION_READY");
 }
});

test("Wende immutable original two TFs fail-closed for source/answer/BBox/KP/operator tampering",()=>{
 const changes=[
  v=>v.blocks[0].stem+="？",v=>v.blocks[1].answer="O",
  v=>v.blocks[0].source_slot_id="SCI_G04_S1_113_MID_001|S1|TF|014",
  v=>v.blocks[1].source_pdf_bbox_pts_top_left[0]++,
  v=>v.blocks[1].canonical_kp_id="sci_g04s1_02_07",
  v=>v.blocks[0].operator_publication_approval=false,
  v=>v.expected_answer_slots=3,
  v=>v.blocks.reverse()
 ];
 for(const edit of changes){const copy=structuredClone(bank);edit(copy);assert.throws(()=>validateAndConvertP12113WendeNative2(copy,authority));}
});

test("Wende both answer events: no source ID or verbatim source text duplicates of existing released files",()=>{
 const newSlots=new Set(bank.blocks.map(b=>b.source_slot_id));
 const newTexts=new Set(bank.blocks.map(b=>norm(b.stem)));
 assert.equal(newSlots.size,2);
 assert.equal(newTexts.size,2);
 for(const name of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-wende-mid-native2-after111-public-v1.json")){
  const rows=load("site/data/question-bank/"+name);
  for(const b of (rows.blocks||[]).flatMap(x=>x.items||[x])){
   if(b.source_slot_id)assert.ok(!newSlots.has(b.source_slot_id),"published duplicate slot "+name);
   if(b.stem)assert.ok(!newTexts.has(norm(b.stem)),"published duplicate exact stem "+name);
  }
 }
});
