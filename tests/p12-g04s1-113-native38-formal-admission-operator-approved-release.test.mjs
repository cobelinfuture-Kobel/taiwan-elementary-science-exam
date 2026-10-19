import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Native38} from "../site/assets/js/p12-g04s1-113-native38-release.mjs";
const read=s=>JSON.parse(readFileSync(s,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-native38-public-v1.json");
const approved=read("data/review/p12-g04s1-113-native38-consolidated-admission-formal-v2.json");
const original=read("data/review/p12-g04s1-113-native38-consolidated-prepublic-v1.json");
const firstManifest=read("data/review/p12-g04s1-113-native38-consolidated-operator-admission-manifest-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s||"").normalize("NFKC").replace(/\s+/gu,"");
test("Native38 exact 8-school original exam school text, science answer, KP, rights and operator cohort released",()=>{
 const a=validateAndConvertP12113Native38(bank,authority);
 assert.deepEqual([a.answerSlots,a.standaloneTf,a.standaloneChoice,a.contextGroups],[38,15,23,0]);
 assert.equal(approved.summary.admission_ready_new,38);
 assert.equal(approved.summary.published_new,0);
 assert.equal(approved.summary.explicit_final_operator_cohort_manifest_release_signoff,true);
 assert.equal(approved.records.length,38);
 assert.equal(firstManifest.summary.admission_ready_new,0);
 assert.equal(original.blocks.length,38);
 const before=new Map(original.blocks.map(x=>[x.id,x]));
 const rights=new Map(approved.records.map(x=>[x.source_slot_id,x]));
 for(const b of bank.blocks){
  const was=before.get(b.id);
  assert.ok(was);
  for(const k of ["id","source_id","source_slot_id","source_pdf_sha256","source_page_pdf_1_based","original_question_number","canonical_kp_id","unit","stem","answer","answer_explanation","answer_assumption"])
   assert.deepEqual(b[k],was[k],b.id+" immutable "+k);
  assert.deepEqual(b.options??null,was.options??null);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,was.source_pdf_bbox_pts_top_left);
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(rights.get(b.source_slot_id).rights_verified,true);
  assert.equal(rights.get(b.source_slot_id).admission_ready,true);
  assert.equal(b.stem.includes("分："),false);
 }
});
test("all other published original source slots unique and no exact old full stem+options duplicate",()=>{
 const mine=new Set(bank.blocks.map(x=>x.source_slot_id));
 const exact=x=>norm(x.stem)+"|"+(x.options||[]).map(norm).join("|");
 const myExact=new Set(bank.blocks.map(exact));
 assert.equal(myExact.size,38);
 for(const name of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-native38-public-v1.json")){
  const data=read("site/data/question-bank/"+name);
  for(const x of (data.blocks||[]).flatMap(y=>y.items||[y])){
   if(x.source_slot_id)assert.ok(!mine.has(x.source_slot_id),"repeated source "+x.source_slot_id);
   if(x.stem)assert.ok(!myExact.has(exact(x)),"identical earlier source "+name+" "+x.id);
  }
 }
});
test("Native38 original response, option, answer and authority tampering all fail closed",()=>{
 const mutations=[
 b=>b.blocks[0].stem+="？",
 b=>b.blocks[0].answer="O",
 b=>b.blocks.find(x=>x.type==="mcq").options[1]="②篡改選項",
 b=>b.blocks[0].source_pdf_sha256="a".repeat(64),
 b=>b.blocks[0].source_pdf_bbox_pts_top_left[0]+=0.1,
 b=>b.blocks[0].canonical_kp_id="sci_g04s1_02_10",
 b=>b.blocks[0].operator_publication_approval=false,
 b=>b.blocks[0].rights_license_status="UNKNOWN",
 b=>b.expected_answer_slots=39,
 b=>b.blocks[0].source_slot_id=bank.blocks[1].source_slot_id,
 b=>b.public_site_integrated=false
 ];
 for(const change of mutations){
  const changed=structuredClone(bank);change(changed);
  assert.throws(()=>validateAndConvertP12113Native38(changed,authority));
 }
});
