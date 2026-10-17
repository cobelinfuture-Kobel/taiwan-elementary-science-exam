import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113Native6After94} from "../site/assets/js/p12-g04s1-113-native6-after94-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-native6-after94-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-native6-after94-formal-source-science-kp-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("113 minquan + yongan original PDF exact native six; source, science, and frozen 48 KP",()=>{
 const v=validateAndConvertP12113Native6After94(bank,authority);
 assert.deepEqual([v.answerSlots,v.standaloneTf,v.standaloneChoice,v.contextGroups],[6,5,1,0]);
 assert.deepEqual([evidence.baseline_public_answer_slots,evidence.baseline_113_published_source_slots,evidence.formal_science_kp_approved_new,evidence.admission_ready_new,evidence.before_live_E2E_new_published],[730,94,6,6,0]);
 assert.equal(evidence.evidence_rows.length,6);
 assert.equal(new Set(evidence.evidence_rows.map(x=>x.source_slot_id)).size,6);
 for(const b of bank.blocks){
  const p=evidence.evidence_rows.find(r=>r.source_slot_id===b.source_slot_id);
  assert.ok(p,"immutable source lineage present");
  assert.equal(norm(p.original_full_stem),norm(b.stem));
  assert.deepEqual(p.original_ordered_options,b.options??null);
  assert.equal(p.model_answer_not_teacher_key,b.answer);
  assert.equal(p.direct_frozen_canonical_kp_id,b.canonical_kp_id);
  assert.deepEqual(p.original_printed_answer_parenthesis_bbox_pts_top_left,b.source_pdf_bbox_pts_top_left);
  assert.equal(p.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(p.source_pdf_page_1_based,1);
  assert.equal(p.original_illustration_dependency,false);
  assert.equal(p.formal_science_kp_approved,true);
  assert.equal(p.admission_ready,true);
 }
 assert.equal(bank.blocks.find(x=>x.type==="mcq").source_slot_id,"SCI_G04_S1_113_MID_007|S02|MC|009");
});
test("six source-scientific KB blocks immutable fail-closed on source, bbox, options, answers, direct KP, operator rights",()=>{
 const mutations=[
  x=>x.blocks[0].stem+="？",x=>x.blocks[1].answer="O",
  x=>x.blocks[2].canonical_kp_id="sci_g04s1_02_08",
  x=>x.blocks[3].options[3]="④浮葉性。",x=>x.blocks[4].source_pdf_bbox_pts_top_left[0]+=1,
  x=>x.blocks[5].operator_publication_approval=false,
  x=>x.blocks[3].source_slot_id="SCI_G04_S1_113_MID_007|S01|MC|009",
  x=>x.expected_answer_slots=7
 ];
 for(const m of mutations){const x=structuredClone(bank);m(x);assert.throws(()=>validateAndConvertP12113Native6After94(x,authority));}
});
test("Source suppression all 94 previous published slots, plus exact public bank stem/source dedup",()=>{
 const ids=new Set(bank.blocks.map(b=>b.source_slot_id));
 const stems=new Set(bank.blocks.map(b=>norm(b.stem)));
 for(const p of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-native6-after94-public-v1.json")){
  const doc=read("site/data/question-bank/"+p);
  const all=(doc.blocks||[]).flatMap(b=>b.type==="group"?(b.items||[]):[b]);
  for(const r of all){
   assert.equal(ids.has(r.source_slot_id),false,"Duplicate source "+p);
   if(r.stem)assert.equal(stems.has(norm(r.stem)),false,"Duplicate exact source-text "+p);
  }
 }
});
