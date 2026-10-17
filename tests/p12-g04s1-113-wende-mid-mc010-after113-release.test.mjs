import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113WendeMC010After113} from "../site/assets/js/p12-g04s1-113-wende-mid-mc010-after113-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-wende-mid-mc010-after113-public-v1.json");
const evidence=read("data/review/p12-g04s1-113-wende-mid-mc010-after113-formal-evidence-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("113 Wende MID001 MC010 native original four-option source Science KP and rights Gate",()=>{
 const o=validateAndConvertP12113WendeMC010After113(bank,authority);
 assert.deepEqual([o.answerSlots,o.standaloneTf,o.standaloneChoice,o.contextGroups],[1,0,1,0]);
 assert.deepEqual([evidence.prior_113_published_source_ids,evidence.prior_site_answer_slots,evidence.formal_science_kp_approved_new,evidence.admission_ready_new,evidence.published_new_before_main_pages_e2e],[113,749,1,1,0]);
 assert.equal(evidence.record.source_slot_id,o.blocks[0].source_slot_id);
 assert.equal(norm(evidence.record.original_full_stem),norm(o.blocks[0].stem));
 assert.deepEqual(evidence.record.original_ordered_options,o.blocks[0].options);
 assert.equal(evidence.record.model_independently_reasoned_answer,o.blocks[0].answer);
 assert.deepEqual(evidence.record.printed_answer_parenthesis_pdf_bbox_pts_top_left,o.blocks[0].source_pdf_bbox_pts_top_left);
 assert.equal(evidence.record.original_pdf_sha256,o.blocks[0].source_pdf_sha256);
 assert.equal(evidence.record.direct_canonical_kp,o.blocks[0].canonical_kp_id);
 assert.equal(evidence.original_teacher_answer_key_authenticated,false);
});
test("Immutable original one-MC source answer KP BBox operator and rights fail closed",()=>{
 const mutations=[d=>d.blocks[0].stem+="?",d=>d.blocks[0].options[2]="③池塘",d=>d.blocks[0].answer="④",d=>d.blocks[0].canonical_kp_id="sci_g04s1_02_03",d=>d.blocks[0].source_pdf_bbox_pts_top_left[0]++,d=>d.blocks[0].operator_publication_approval=false,d=>d.blocks[0].source_slot_id="SCI_G04_S1_113_MID_001|S1|TF|006",d=>d.expected_answer_slots=2];
 for(const f of mutations){const v=structuredClone(bank);f(v);assert.throws(()=>validateAndConvertP12113WendeMC010After113(v,authority));}
});
test("No duplicate original question source ID or exact full stem in other published student-bank assets",()=>{
 const b=bank.blocks[0];
 for(const name of readdirSync("site/data/question-bank").filter(f=>f.endsWith(".json")&&f!=="p12-g04s1-113-wende-mid-mc010-after113-public-v1.json")){
  const j=read("site/data/question-bank/"+name);
  for(const x of (j.blocks||[]).flatMap(t=>t.items||[t])){
   assert.notEqual(x.source_slot_id,b.source_slot_id,"duplicate source "+name);
   if(x.stem)assert.notEqual(norm(x.stem),norm(b.stem),"duplicate stem "+name);
  }
 }
});
