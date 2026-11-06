import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
import {
 inspectP12113B01B02Selective21Candidate,
 validateAndConvertP12113B01B02Selective21,
 SELECTIVE21_BANK_PATH,
 SELECTIVE21_GATE_PATH,
 SELECTIVE21_FROZEN_CONTENT_FINGERPRINT
} from "../site/assets/js/p12-g04s1-113-b01b02-selective21-student-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const source=read("../site/data/question-bank/p12-g04s1-113-b01b02-selective21-prepublication-candidate-v1.json");
const gate=read("../site/data/question-bank/p12-g04s1-113-b01b02-selective21-operator-release-gate-v1.json");
const authority=validateAuthority(read("../site/data/authority/science-g03-g04-selector-v3.json"));

test("Actual source-backed student bank shape: 38 exact original sources -> 21 printable answer slots",()=>{
 const a=inspectP12113B01B02Selective21Candidate(source,authority);
 assert.equal(a.sourceSlots,38);
 assert.equal(a.proposedAnswerSlots,21);
 assert.equal(a.blocks,16);
 assert.equal(a.contentFingerprint,SELECTIVE21_FROZEN_CONTENT_FINGERPRINT);
 assert.equal(source.source_slots_B01,28);
 assert.equal(source.source_slots_B02,10);
 assert.deepEqual(source.answer_types,{tf:8,mcq:3,multi:4,short:6});
 assert.equal(SELECTIVE21_BANK_PATH,"../data/question-bank/p12-g04s1-113-b01b02-selective21-prepublication-candidate-v1.json");
 assert.equal(SELECTIVE21_GATE_PATH,"../data/question-bank/p12-g04s1-113-b01b02-selective21-operator-release-gate-v1.json");
});
test("Original checkboxes become multi-select with original parent; six sound-medium fill items keep parent",()=>{
 const multi=source.blocks.filter(b=>b.type==="multi");
 assert.equal(multi.length,4);
 assert.ok(multi.every(b=>Array.isArray(b.options)&&b.options.length===b.source_lineage_ids.length));
 assert.ok(multi.some(b=>b.answer==="②④"));
 assert.ok(multi.some(b=>b.answer==="①③⑤⑥"));
 const sound=source.blocks.find(b=>b.type==="group");
 assert.equal(sound.items.length,6);
 assert.ok(sound.shared.instructions.includes("A 氣體"));
 assert.deepEqual(sound.items.map(i=>i.answer),["C","B","A","A","C","A"]);
});
test("Before full existing Gate and exact-source approval, even an Exam loader call returns zero new students",()=>{
 const output=validateAndConvertP12113B01B02Selective21(source,authority,gate);
 assert.equal(output.answerSlots,0);
 assert.equal(output.blocks.length,0);
 assert.equal(source.public_site_integrated,false);
 assert.equal(gate.exact_operator_source_roster_approval,false);
 assert.equal(gate.public_student_release_allowed,false);
});
test("Forged approval lacking original visual or exact 38 source IDs fails closed",()=>{
 const withoutProof={...gate,public_student_release_allowed:true,exact_operator_source_roster_approval:true};
 assert.throws(()=>validateAndConvertP12113B01B02Selective21(source,authority,withoutProof),/FAIL_CLOSED/);
 const wrong={...withoutProof,original_pdf_question_parent_stem_and_options_visual_verified:true,full_113_29_papers_with_5_scan_full_parent_semantic_duplicate_accepted:true,complete_114_25_and_main_duplicate_accepted:true,operator_approval_verbatim:"核准 21 38",approved_source_slot_ids:source.exact_source_slot_ids.slice(1)};
 assert.throws(()=>validateAndConvertP12113B01B02Selective21(source,authority,wrong),/FAIL_CLOSED/);
});
test("Dry-run signed in memory can convert all 21 without marking a real user approval",()=>{
 const mock={...gate,original_pdf_question_parent_stem_and_options_visual_verified:true,
 full_113_29_papers_with_5_scan_full_parent_semantic_duplicate_accepted:true,
 complete_114_25_and_main_duplicate_accepted:true,
 exact_operator_source_roster_approval:true,
 public_student_release_allowed:true,
 operator_approval_verbatim:"TEST ONLY 非真實核准 21 道學生作答位置，38 個精確來源ID",
 approved_source_slot_ids:source.exact_source_slot_ids};
 const converted=validateAndConvertP12113B01B02Selective21(source,authority,mock);
 assert.equal(converted.answerSlots,21);
 assert.equal(converted.standaloneTf,8);
 assert.equal(converted.standaloneChoice,3);
 assert.equal(converted.contextGroups,1);
 assert.equal(converted.blocks.length,16);
 assert.equal(converted.blocks.find(b=>b.type==="group").source,"CERTIFIED_CONTEXT_RECONSTRUCTED");
 assert.ok(converted.blocks.every(b=>b.operator_publication_approval===true));
 assert.equal(gate.public_student_release_allowed,false);
});
test("Immutable original source+rendered answer fingerprint detects any stem, option, answer, KP or geometry change",()=>{
 const row=structuredClone(source);row.source_evidence_rows[0].source_answer_bbox_pts_top_left[0]+=1;
 assert.throws(()=>inspectP12113B01B02Selective21Candidate(row,authority),/FAIL_CLOSED/);
 for(const field of ["answer","stem","canonical_kp_id"]){
   const doc=structuredClone(source);doc.blocks[0][field]="TAMPERED";
   if(field==="canonical_kp_id"){
      doc.blocks[0][field]="sci_g04s1_04_12";
   }
   assert.throws(()=>inspectP12113B01B02Selective21Candidate(doc,authority),/FAIL_CLOSED/);
 }
});
