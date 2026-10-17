import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113DongguangTF003} from "../site/assets/js/p12-g04s1-113-dongguang-mid-tf003-after110-release.mjs";
const load=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=load("site/data/question-bank/p12-g04s1-113-dongguang-mid-tf003-after110-public-v1.json");
const evidence=load("data/review/p12-g04s1-113-dongguang-mid-tf003-after110-exact-source-science-kp-v1.json");
const authority=load("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Dongguang original 113 native TF003 source science unique answer direct KP and glyph BBox",()=>{
 const r=validateAndConvertP12113DongguangTF003(bank,authority);
 assert.deepEqual([r.answerSlots,r.standaloneTf,r.standaloneChoice,r.contextGroups],[1,1,0,0]);
 const b=r.blocks[0];
 assert.equal(evidence.original_source_slot_id,b.source_slot_id);
 assert.equal(evidence.original_pdf_sha256,b.source_pdf_sha256);
 assert.deepEqual(evidence.printed_answer_parenthesis_pdf_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
 assert.equal(evidence.original_pdf_page_1_based,1);
 assert.equal(evidence.canonical_direct_kp_id,b.canonical_kp_id);
 assert.equal(norm(evidence.original_full_stem),norm(b.stem));
 assert.equal(evidence.independent_model_science_answer,b.answer);
 assert.equal(evidence.teacher_original_answer_key_authenticated,false);
 assert.equal(evidence.baseline_113_published_source_count,110);
 assert.equal(evidence.pre_existing_public_student_answer_slots,746);
 assert.equal(evidence.formal_science_kp_approved_new,1);
 assert.equal(evidence.admission_ready_new,1);
 assert.equal(evidence.published_new_before_main_pages_e2e,0);
 assert.equal(evidence.excluded_neighbor_slots.filter(x=>x.reason.startsWith("ALREADY_PUBLISHED_PR136")).length,3);
});
test("Dongguang TF003 original source immutable fail-closed for wrong science answer/ KP / source / bbox / operator gate",()=>{
 const edits=[
  j=>j.blocks[0].stem+="？",
  j=>j.blocks[0].answer="O",
  j=>j.blocks[0].canonical_kp_id="sci_g04s1_02_07",
  j=>j.blocks[0].source_slot_id="SCI_G04_S1_113_MID_004|S02|TF|002",
  j=>j.blocks[0].source_pdf_bbox_pts_top_left[1]+=1,
  j=>j.blocks[0].operator_publication_approval=false,
  j=>j.expected_standalone_true_false=2
 ];
 for(const change of edits){const j=structuredClone(bank);change(j);assert.throws(()=>validateAndConvertP12113DongguangTF003(j,authority));}
});
test("No published duplicate original source identity/stem across all existing active student banks",()=>{
 const b=bank.blocks[0];
 for(const name of readdirSync("site/data/question-bank").filter(n=>n.endsWith(".json")&&n!=="p12-g04s1-113-dongguang-mid-tf003-after110-public-v1.json")){
  const j=load("site/data/question-bank/"+name);
  for(const x of (j.blocks||[]).flatMap(q=>q.type==="group"?q.items||[]:[q])){
   assert.notEqual(x.source_slot_id,b.source_slot_id,"Published slot duplicate in "+name);
   if(x.stem)assert.notEqual(norm(x.stem),norm(b.stem),"Published exact source text duplicate in "+name);
  }
 }
});
