import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const approval=read("data/review/p12-g03s2mid-remaining51-final-acceptance-v1.json");
const source=read("data/review/p12-g03s2mid-remaining51-source-editorial-audit-v1.json");
const staged=read("data/staging/p12-g03s2mid-remaining51-staged-v1.json");
const released=read("site/data/question-bank/p12-g03s2mid-approved-six-v1.json");
const flatten=x=>x.blocks.flatMap(b=>b.type==="group"?b.items.map(y=>({...y,unit:b.unit,block_id:b.id})): [{...b,block_id:b.id}]);
test("P12 remaining 51 semantic final acceptance is grounded in exact original slots",()=>{
 assert.equal(approval.source_slots_total,51);
 assert.equal(approval.scientifically_accepted_answer_slots,51);
 assert.equal(approval.verified_canonical_kp_slots,51);
 assert.equal(approval.targeted_editorial_revisions,6);
 assert.equal(approval.semantic_near_duplicate_reviews,10);
 assert.equal(approval.same_fact_cross_format_pairs,1);
 const originals=new Map(source.records.map(r=>[r.source_slot_id,r]));
 const drafts=new Map(flatten(staged).map(r=>[r.source_slot_id,r]));
 const rows=approval.items;assert.equal(rows.length,51);
 assert.equal(new Set(rows.map(r=>r.source_slot_id)).size,51);
 for(const r of rows){
  const src=originals.get(r.source_slot_id),draft=drafts.get(r.source_slot_id);
  assert.ok(src&&draft,r.source_slot_id);
  assert.equal(r.answer,draft.answer);
  assert.equal(r.canonical_kp_id,src.verified_canonical_kp_id);
  assert.equal(r.source_original_preserved,true);
  assert.equal(r.approved_candidate_text,draft.stem);
  assert.equal(r.atomic_group_id,draft.block_id.startsWith("P12_REMAIN51_TF_")||draft.block_id.startsWith("P12_REMAIN51_MC_")?null:draft.block_id);
 }
});
test("semantic near-repeat groups are explicitly adjudicated without silently deleting any source slot",()=>{
 const near=approval.items.filter(x=>x.semantic_duplicate_family);
 assert.equal(near.length,10);
 const same=near.filter(x=>x.same_worksheet_constraint!=="NONE");
 assert.equal(same.length,2);
 assert.deepEqual(new Set(same.map(x=>x.semantic_duplicate_family)),new Set(["SEAWEED_MOISTURE"]));
 assert.equal(approval.exact_stem_duplicates_found,0);
 assert.equal(approval.duplicate_aware_public_selector_enabled,false);
});
test("acceptance cannot be mistaken for public publication approval or alter the frozen 154 baseline",()=>{
 assert.equal(approval.public_question_admission_approved,false);
 assert.equal(approval.original_public_answer_slots_preserved,154);
 assert.equal(staged.public_site_integrated,false);
 assert.equal(staged.operator_approval_received,false);
 assert.equal(released.expected_answer_slots,6);
 assert.equal(approval.actual_a4_layout_pilot,"PASS_CHROMIUM_ALL_27_BLOCKS_51_SLOTS");
 assert.equal(approval.actual_a4_layout_evidence.tested_block_count,27);
 assert.equal(approval.actual_a4_layout_evidence.tested_answer_slot_count,51);
 assert.equal(approval.final_acceptance_status,"FINAL_SCIENCE_AND_A4_ACCEPTED_STAGED_ONLY");
 assert.ok(approval.items.every(x=>x.layout_status==="ACTUAL_A4_SCREEN_PRINT_PDF_PASS"));
 assert.ok(approval.items.every(x=>x.publication_status==="STAGED_ONLY_NO_USER_PUBLIC_RELEASE_APPROVAL"));
});
