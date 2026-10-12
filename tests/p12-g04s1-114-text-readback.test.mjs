import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=p=>JSON.parse(readFileSync(p,"utf8"));
const reg=load("data/source-registry/p12-g04s1-108114-drive-discovery-v1.json");
const mid=load("data/review/p12-g04s1-114mid-text-readback-preflight-v1.json");
const fin=load("data/review/p12-g04s1-114final-text-readback-preflight-v1.json");
const cases=load("data/review/p12-g04s1-114-exact-text-science-screening-examples-v1.json");
const auth=load("site/data/authority/science-g03-g04-selector-v2.json");
const p11=load("site/data/governance/p11-source-sections.json");
test("all 25 newly found 114 MID/FINAL PDFs are individually contacted without claiming full KP screening",()=>{
 assert.deepEqual([mid.candidate_count,fin.candidate_count],[12,13]);
 assert.deepEqual([mid.source_files_read,fin.source_files_read],[10,11]);
 assert.equal(mid.screening_level,"TEXT_READBACK_TOPIC_SIGNAL_ONLY_NOT_FULL_QUESTION_SCREENING");
 assert.equal(fin.screening_level,"TEXT_READBACK_TOPIC_SIGNAL_ONLY_NOT_FULL_QUESTION_SCREENING");
 const all=[...mid.papers,...fin.papers],byReg=new Map(reg.entries.filter(x=>x.year===114).map(x=>[x.candidate_source_id,x]));
 assert.equal(all.length,25);
 assert.equal(new Set(all.map(x=>x.drive_file_id)).size,25);
 assert.equal(byReg.size,25);
 for(const p of all){
  const b=byReg.get(p.candidate_source_id);
  assert.ok(b,p.title);
  assert.equal(p.title,b.source_title);
  assert.ok(b.files.some(x=>x.drive_file_id===p.drive_file_id));
  assert.equal(p.question_mapping_completed,false);
  assert.equal(p.teacher_answer_key_authenticated,false);
  assert.equal(p.source_pdf_sha256,null);
  assert.equal(p.scope_screening_status,"READBACK_DONE_PENDING_ITEM_BY_ITEM_KP_SCREENING");
  for(const k of ["U01","U02","U03","U04","legacy"])assert.ok(p.topic_signals[k]&&p.topic_signals[k].hits>=0);
 }
 assert.equal(all.filter(x=>x.readback_status==="SOURCE_SELECTABLE_TEXT_AVAILABLE").length,21);
 assert.equal(all.filter(x=>x.readback_status!=="SOURCE_SELECTABLE_TEXT_AVAILABLE").length,4);
 assert.ok(all.filter(x=>x.readback_status!=="SOURCE_SELECTABLE_TEXT_AVAILABLE").every(x=>x.text_character_count===0));
});
test("sample questions distinguish printed correctness, current term scope and unsupported diagram answers",()=>{
 assert.equal(cases.question_examples_reviewed,9);
 assert.deepEqual(cases.decision_counts,{OUT_OF_SCOPE:3,WRONG_PERIOD:1,POTENTIAL_IN_SCOPE:4,HOLD_SOURCE_FIGURE_REQUIRED:1});
 assert.equal(cases.teacher_answer_keys_verified_count,0);
 assert.equal(cases.answer_positions_publicly_admitted,0);
 const scopes={MID:["U01","U02"],FINAL:["U03","U04"]};
 const all=[...mid.papers,...fin.papers];const ids=new Set(all.map(x=>x.drive_file_id));
 for(const c of cases.cases){
  assert.ok(ids.has(c.source_file_id),c.source_file_id);
  if(c.period_decision==="POTENTIAL_IN_SCOPE"){
   const matching=auth.units.find(u=>u.knowledge_points.some(k=>k.canonical_kp_id===c.kp));
   assert.equal(matching.grade,4);
   assert.equal(matching.semester,1);
   assert.ok(scopes[c.title.includes("期中")?"MID":"FINAL"].includes(matching.unit_id));
  }else assert.equal(c.kp,null);
  assert.equal(c.original_pdf_sha256,null);
  assert.equal(c.exact_answer_position_certified,false);
 }
 const printed=cases.cases.find(x=>x.period_decision==="HOLD_SOURCE_FIGURE_REQUIRED");
 assert.match(printed.why,/圖/);
 assert.equal(printed.model_answer,null);
 assert.deepEqual(printed.possible_kps,["sci_g04s1_04_08","sci_g04s1_04_09"]);
});
test("114 preflight changes neither 113 G04 S1 source inventory nor live question bank",()=>{
 assert.equal(p11.source_papers.find(x=>x.source_id==="G04-S1-MID").sections.reduce((n,s)=>n+s.slot_count,0),50);
 assert.equal(p11.source_papers.find(x=>x.source_id==="G04-S1-FINAL").sections.reduce((n,s)=>n+s.slot_count,0),54);
 assert.equal(reg.known_baseline_public_learner_slots_g04s1,53);
 assert.equal(reg.known_baseline_canonical_kps_covered,22);
 assert.equal(cases.source_registry_ref,"data/source-registry/p12-g04s1-108114-drive-discovery-v1.json");
});
