import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const load=p=>JSON.parse(readFileSync(p,"utf8"));
const prefix="data/review/p12-g04s1-114-";
const source=load(prefix+"nanyi-dongguang-final-source-visual-v2.json");
const batch=load(prefix+"b01-dongguang-final-science-figure-verdict-v1.json");
const progress=load(prefix+"b01-science-figure-acceptance-progress-v1.json");
const v17=load(prefix+"all25-kp-first-progress-v17.json");
const base=load(prefix+"secondpass-all25-hold-and-kp-review-queue-v1.json");
const authority=load("site/data/authority/science-g03-g04-selector-v2.json");
test("Independent science B01 has 30 precise existing source IDs and exact full-PDF SHA",()=>{
 assert.equal(batch.batch_total,30);
 assert.equal(batch.items.length,30);
 assert.equal(new Set(batch.items.map(i=>i.source_slot_id)).size,30);
 assert.equal(batch.source_original_pdf_sha256,"147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819");
 assert.equal(source.source_pdf_sha256,batch.source_original_pdf_sha256);
 const sourceRows=new Map(source.items.map(x=>[x.source_slot_id,x]));
 const allowed=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allowed.size,45);
 for(const x of batch.items){
  const original=sourceRows.get(x.source_slot_id);
  assert.ok(original,"missing original slot "+x.source_slot_id);
  assert.equal(x.source_first_pass_decision,original.kp_first_decision);
  assert.deepEqual(x.source_provisional_kp_ids,original.matched_canonical_kp_ids);
  assert.ok(x.source_provisional_kp_ids.every(k=>allowed.has(k)));
  assert.ok([1,2,3,4].includes(x.source_original_pdf_page));
  assert.equal(x.source_original_pdf_sha256,batch.source_original_pdf_sha256);
  assert.equal(x.model_independent_science_review_completed,true);
  assert.ok(x.original_science_reasoning.length>15);
 }
});
test("B01 verdicts strictly distinguish model science success from correctable/reject and teacher/public gates",()=>{
 const kinds=["FULL_PASS","CORRECTABLE","HOLD","REJECT"];
 assert.deepEqual(Object.fromEntries(kinds.map(k=>[k,batch.items.filter(x=>x.independent_model_science_verdict===k).length])),{FULL_PASS:24,CORRECTABLE:5,HOLD:0,REJECT:1});
 assert.deepEqual(batch.original_screening_input_counts,{source_evidence_hold:19,kp_uncertain:2,ordinary_kp_candidate:9});
 assert.equal(batch.items.filter(x=>x.source_image_dependency&&x.independent_model_science_verdict==="FULL_PASS").length,15);
 for(const x of batch.items){
  assert.equal(x.source_teacher_key_authenticated,false);
  assert.equal(x.source_copyright_public_use_cleared,false);
  assert.equal(x.learner_figure_redraw_verified,false);
  assert.equal(x.operator_public_admission_approved,false);
  assert.equal(x.public_release_approved,false);
  if(x.independent_model_science_verdict==="FULL_PASS")assert.ok(x.science_solution_if_full_pass!==null);
  else assert.equal(x.science_solution_if_full_pass,null);
 }
 assert.equal(batch.public_admissions_this_batch,0);
 assert.equal(batch.publication_state,"BLOCKED_ALL_ITEMS");
});
test("Six grounded materials in original Dongguang page2 are resolved with correct conductance and no reused image released",()=>{
 const want={"033":"√","034":"×","035":"√","036":"√","037":"×","038":"√"};
 for(const [tail,answer] of Object.entries(want)){
  const item=batch.items.find(x=>x.source_slot_id.endsWith("|S03|FIG|"+tail));
  assert.ok(item,tail);
  assert.equal(item.source_original_pdf_page,2);
  assert.equal(item.source_image_dependency,true);
  assert.equal(item.science_solution_if_full_pass,answer);
  assert.equal(item.independent_model_science_verdict,"FULL_PASS");
  assert.deepEqual(item.source_provisional_kp_ids,["sci_g04s1_04_05"]);
 }
});
test("Picture-dependent shadow and series/parallel claims are tied to original PDF page 2",()=>{
 const expected={"001":"甲","002":"甲","003":"乙","004":"乙","005":"甲","006":"甲","007":"丁","008":"乙","009":"丙"};
 for(const [tail,answer]of Object.entries(expected)){
  const item=batch.items.find(x=>x.source_slot_id.endsWith("|S03|FIG|"+tail));
  assert.ok(item);
  assert.equal(item.source_original_pdf_page,2);
  assert.equal(item.source_image_science_interpretation_reviewed,true);
  assert.equal(item.science_solution_if_full_pass,answer);
 }
});
test("Source ambiguity is kept CORRECTABLE rather than authoritatively inventing MC/relation or 110V truths",()=>{
 const correctable=new Set(["S02|MC|002","S02|MC|003","S02|MC|008","S04|CHECK|006","S05|READ|002"]);
 for(const t of correctable){
  const x=batch.items.find(i=>i.source_slot_id.endsWith(t));
  assert.ok(x);
  assert.equal(x.independent_model_science_verdict,"CORRECTABLE");
  assert.equal(x.science_solution_if_full_pass,null);
 }
 const noKp=batch.items.find(x=>x.source_slot_id.endsWith("S01|TF|001"));
 assert.equal(noKp.independent_model_science_verdict,"REJECT");
 assert.equal(noKp.kp_disposition,"OUT_OF_SCOPE");
});
test("B01 leaves all 25 original papers, 1623 V17 source anchors and 251 live site answers unchanged",()=>{
 assert.equal(v17.all_identified_source_answer_positions_count,1623);
 assert.equal(v17.papers_with_all_textually_identifiable_answer_positions_mapped,25);
 assert.equal(base.review_queue_count,440);
 assert.equal(progress.original_440_review_queue_positions_touched,21);
 assert.equal(progress.original_440_review_queue_positions_not_yet_independently_reviewed,419);
 assert.equal(progress.original_845_candidate_positions_touched,9);
 assert.equal(progress.original_845_candidate_positions_not_yet_independently_reviewed,836);
 assert.equal(progress.science_full_pass_without_teacher_or_learner_release,24);
 assert.equal(progress.requires_educational_rewrite,5);
 assert.equal(progress.scientific_or_scope_reject,1);
 assert.equal(progress.source_teacher_key_authenticated_count,0);
 assert.equal(progress.public_admission_this_stage,0);
 assert.equal(progress.site_total_answer_positions_unchanged,251);
 assert.equal(progress.site_g04s1_answer_positions_unchanged,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
