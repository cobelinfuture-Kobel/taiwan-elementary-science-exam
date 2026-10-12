import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {reconcileP11R1,materializeP11R1} from "../tools/p11r1-reconcile.mjs";
const evidence=JSON.parse(readFileSync("site/data/governance/p11r1-reviewed-source-map.json","utf8"));
const clone=()=>structuredClone(evidence);
test("R1 links all 76 published adapted children to 79 nonoverlapping original source slots",()=>{
 const x=reconcileP11R1();
 assert.equal(x.published_adapted_source_links.length,76);
 assert.equal(x.original_source_answer_positions_linked_to_76_adapted_subitems,79);
 assert.equal(new Set(x.published_adapted_source_links.map(y=>y.published_item_id)).size,76);
 assert.equal(new Set(x.published_adapted_source_links.flatMap(y=>y.original_source_slot_ids)).size,79);
 assert.equal(x.page_metadata_corrections.length,1);
 assert.equal(x.page_metadata_corrections[0].group_id,"FINAL_G04_CIRCUIT_IMAGES");
 assert.equal(x.page_metadata_corrections[0].actual_source_page,1);
});
test("R1 accounts for 477 original slots without treating adapted texts as verbatim",()=>{
 const x=reconcileP11R1();
 assert.equal(x.original_source_answer_positions,477);
 assert.equal(x.baseline_original_TF_source_links,72);
 assert.equal(x.original_source_answer_positions_linked_to_76_adapted_subitems,79);
 assert.equal(x.original_source_answer_positions_remaining_for_candidate_review,326);
 assert.equal(x.reconciled_source_slots.length,477);
 assert.equal(x.per_source_summary.reduce((n,p)=>n+p.remaining_candidate_positions,0),326);
 assert.ok(x.published_adapted_source_links.every(q=>q.source_anchor_verified&&!q.verbatim_question_equality_verified&&!q.original_answer_key_verified));
 assert.equal(x.admission_gate.direct_bulk_publication_without_individual_answer_KP_visual_gates_enabled,false);
});
test("R1 resolves 20 printed numbered 1-point questions and 22 physical blanks without inventing partial marks",()=>{
 const s=reconcileP11R1().water_state_printed_scoring_reconciliation;
 assert.equal(s.score_question_count,20);assert.equal(s.actual_blanks,22);
 assert.deepEqual(s.source_printed_number_to_blanks.slice(0,2).map(x=>x.source_part_slot_ordinals),[[1,2],[3,4]]);
 assert.equal(s.source_printed_number_to_blanks.flatMap(x=>x.source_part_slot_ordinals).length,22);
 assert.equal(s.partial_credit_rule,"NOT_ESTABLISHED_FROM_SOURCE_PDF");
});
test("R1 fails closed when evidence is duplicated, incomplete or refers to a nonexistent slot",()=>{
 let x=clone();x.context_mappings[0].source_subitem_links.pop();
 assert.throws(()=>reconcileP11R1({sourceMap:x}),/incomplete children/);
 x=clone();x.context_mappings[0].source_subitem_links[1].source_part_slot_ordinals=[1];
 assert.throws(()=>reconcileP11R1({sourceMap:x}),/same original source slot/);
 x=clone();x.context_mappings[0].source_subitem_links[0].source_part_slot_ordinals=[999];
 assert.throws(()=>reconcileP11R1({sourceMap:x}),/beyond PDF slot inventory/);
 x=clone();x.score_issue.question_blanks[0].source_part_slot_ordinals=[1];
 assert.throws(()=>reconcileP11R1({sourceMap:x}),/printed 20 one-point/);
});
test("R1 JSON is deterministically generated, checked, and kept separate from the frozen published bank",()=>{
 assert.deepEqual(materializeP11R1({check:true}),{
 sources:8,original:477,tf:72,adaptedPublished:76,adaptedSourceSlots:79,pendingCandidates:326,
 scorePrinted:20,scoreBlanks:22,p12ScreeningAllowed:true});
});
