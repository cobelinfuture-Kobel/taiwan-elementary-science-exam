import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const source=read("data/review/p12-g03s2final-fullpaper-candidate-screening-v1.json");
const evidence=read("data/review/p12-g03s2final-mc06-referenced-reading-resolution-v1.json");
const accepted=read("data/review/p12-g03s2final-46-final-source-acceptance-v1.json");
const events=read("site/data/governance/p12-review-events.json").events;
test("matched reading is verifiable bibliographically, not misrepresented as assigned school attachment",()=>{
 assert.equal(evidence.source_slot_id,"G03-S2-FINAL|MC|P01|006");
 assert.equal(evidence.original_teacher_answer_key_authenticated,false);
 assert.equal(evidence.original_source_unchanged,true);
 assert.match(evidence.reference_match.source_textbook_citation,/康軒 111 年 2 月初版/);
 assert.match(evidence.reference_match.source_textbook_citation,/P.136–137/);
 assert.equal(evidence.reference_match.document_pdf_page_number_1_based,23);
 assert.equal(evidence.reference_match.document_answer_pdf_page_number_1_based,24);
 assert.match(evidence.reference_match.status,/NOT_PROVEN_EXAM_ATTACHED_ARTICLE/);
 assert.deepEqual(evidence.reference_match.matched_concepts.map(x=>x.option_as_original_reading),[
  "CONTRADICTS_REFERENCED_EDUCATIONAL_READING","SUPPORTED","SUPPORTED","SUPPORTED"
 ]);
 assert.equal(evidence.learner_revision.answer,"①");
 assert.equal(evidence.learner_revision.options.length,4);
 assert.match(evidence.learner_revision.options[0],/一定.*馬上/);
 assert.equal(evidence.learner_revision.independent_of_unavailable_original_reading,true);
 assert.equal(evidence.publication_approved,false);
});
test("46 accepted source positions align with unchanged 46 original screening slots and KPs",()=>{
 assert.equal(source.items.length,46);
 assert.equal(accepted.items.length,46);
 assert.equal(accepted.assessed_source_answer_slots,46);
 assert.equal(accepted.scientifically_accepted_staged_slots,46);
 assert.equal(accepted.source_context_holds_remaining,0);
 assert.equal(accepted.original_pdf_answer_slots,54);
 assert.equal(accepted.previously_published_source_tf_count,8);
 assert.deepEqual(accepted.section_counts,{TF:6,MC:14,COMPOSITE:22,READ:4});
 const originals=new Map(source.items.map(i=>[i.source_slot_id,i]));
 const seen=new Set();
 for(const item of accepted.items){
  const old=originals.get(item.source_slot_id);
  assert.ok(old&&!seen.has(item.source_slot_id),item.source_slot_id);
  seen.add(item.source_slot_id);
  assert.equal(item.source_pdf_sha256,source.source_pdf_sha256);
  assert.equal(item.source_canonical_kp_id,old.canonical_kp_id);
  assert.equal(item.independent_science_answer,old.model_proposed_answer);
  assert.equal(item.final_source_acceptance,"PASS");
  assert.equal(item.original_pdf_text_replaced,false);
  assert.equal(item.published,false);
  assert.equal(item.public_admission_approved,false);
 }
 assert.equal(seen.size,46);
});
test("all six figure groups and two reading groups retain pending learner assets",()=>{
 assert.equal(accepted.source_group_count,8);
 assert.equal(accepted.image_dependent_source_slots,22);
 assert.equal(accepted.reading_passage_dependent_source_slots,4);
 assert.equal(accepted.text_only_independent_source_slots,20);
 assert.equal(accepted.source_groups.filter(g=>g.type==="COMPOSITE_FIGURE_OR_SHARED_CHOICE").length,6);
 assert.equal(accepted.source_groups.filter(g=>g.type==="READING_SHARED_PASSAGE").length,2);
 assert.equal(accepted.source_groups.reduce((n,g)=>n+g.source_answer_slots,0),26);
 assert.equal(accepted.a4_double_column_actual_pilot_status,"NOT_RUN");
 assert.equal(accepted.operator_public_approval,false);
});
test("append-only resolution stages MC06 exactly once and advances screening to G04 S2 MID",()=>{
 assert.equal(events.length,274);
 const two=events.slice(-2);
 assert.deepEqual(two.map(x=>x.action),["START","CERTIFY_STAGED"]);
 assert.ok(two.every(x=>x.source_slot_id===evidence.source_slot_id));
 assert.ok(two.every(x=>x.review_evidence_ref?.includes("mc06-referenced-reading-resolution-v1.json")));
 assert.equal(two[1].science_answer_verified,true);
 assert.equal(two[1].publication_approved,false);
 const master=buildMaster();
 const row=master.paper_rows.find(x=>x.source_id==="G03-S2-FINAL");
 assert.equal(row.certified_staged,46);
 assert.equal(row.blocked,0);
 assert.equal(row.pending_remaining,0);
 assert.equal(master.complete_papers,2);
 assert.equal(master.position_status_counts.certified_staged,46);
 assert.equal(master.position_status_counts.blocked,0);
 assert.equal(master.position_status_counts.not_started,223);
 assert.equal(master.public_question_bank_answer_slots_current,205);
 assert.equal(master.p12_operator_published_slots,57);
 assert.equal(master.resume_checkpoint.source_id,"G04-S2-MID");
 assert.equal(master.review_events_count,274);
});
