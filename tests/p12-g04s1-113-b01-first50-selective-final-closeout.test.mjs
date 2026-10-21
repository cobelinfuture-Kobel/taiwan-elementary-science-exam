import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
const v=read("../data/review/p12-g04s1-113-b01-first50-final-closeout-seven-published-forty-hold-v1.json");
const b=read("../site/data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json");

test("operator B01 first 50 closeout conserves 7 new + 3 preexisting + 40 HOLD, never discarding exceptions",()=>{
 assert.equal(v.batch_closed,true);
 assert.equal(v.batch_first50_not_full_original_paper,true);
 assert.equal(v.closure_does_not_certify_Wende_full_55_source_positions,true);
 assert.equal(v.closure_does_not_close_ALL29_papers,true);
 assert.equal(v.original_paper_source_response_working_count,55);
 assert.equal(v.batch_source_work_position_count,50);
 assert.equal(v.rows.length,50);
 assert.deepEqual(v.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+1));
 assert.equal(new Set(v.rows.map(x=>x.source_slot_id)).size,50);
 assert.ok(v.rows.every(x=>x.source_slot_id.startsWith("SCI_G04_S1_113_MID_001|")));
 const classes={};
 for(const x of v.rows)classes[x.disposition]=(classes[x.disposition]||0)+1;
 assert.deepEqual(classes,{
 HOLD_PRIOR_EXCEPTION_RETAINED:31,
 PUBLISHED_B01_NEW_MAIN_PAGES_VERIFIED:7,
 SUPPRESSED_PREVIOUSLY_PUBLISHED:3,
 HOLD_ATOMIC_PARENT_9_CHILD_POSITIONS_RETAINED:9
 });
 assert.equal(v.source_position_partition.HOLD_total,40);
 assert.equal(v.HOLD_not_REJECT,true);
 assert.equal(v.no_B02_started,true);
});
test("seven actually authorized and main-published school source IDs identical to B01 student bank",()=>{
 const accepted=v.rows.filter(x=>x.disposition==="PUBLISHED_B01_NEW_MAIN_PAGES_VERIFIED");
 assert.deepEqual(accepted.map(x=>x.source_slot_id),b.blocks.map(x=>x.source_slot_id));
 assert.deepEqual(v.new_public_original_source_ids,b.blocks.map(x=>x.source_slot_id));
 assert.equal(new Set(b.blocks.map(x=>x.source_slot_id)).size,7);
 assert.equal(v.formal_three_metrics.FORMAL_SCIENCE_KP_APPROVED_new,7);
 assert.equal(v.formal_three_metrics.ADMISSION_READY_new,7);
 assert.equal(v.formal_three_metrics.PUBLISHED_new,7);
 assert.equal(v.formal_three_metrics.PUBLISHED_site_total,821);
 assert.equal(v.formal_three_metrics.PUBLISHED_113_source_positions_total_derived,185);
 assert.equal(v.new_7_formal_release_evidence.pages_e2e_run_id,39613159095);
 assert.equal(v.new_7_formal_release_evidence.pages_deploy_result,"SUCCESS");
 assert.equal(v.new_7_formal_release_evidence.actual_Pages_Chromium_E2E,"SUCCESS");
 assert.ok(b.blocks.every(x=>x.operator_publication_approval===true
   &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
   &&x.original_teacher_answer_key_authenticated===false
   &&x.original_cropped_assets_included===false));
});
test("31 original HOLD reasons and both intact parent group child positions survive final closeout",()=>{
 const original=v.rows.filter(x=>x.disposition==="HOLD_PRIOR_EXCEPTION_RETAINED");
 const parents=v.rows.filter(x=>x.disposition==="HOLD_ATOMIC_PARENT_9_CHILD_POSITIONS_RETAINED");
 assert.equal(original.length,31);assert.equal(parents.length,9);
 assert.ok(original.every(x=>x.original_hold_cause_code==="SOURCE_AUTHORITATIVE_SCOPE_OR_SCIENCE_OR_PARENT_EXCEPTION"));
 assert.equal(parents.filter(x=>x.source_slot_id.includes("|G05|")).length,4);
 assert.equal(parents.filter(x=>x.source_slot_id.includes("|G06|")).length,5);
 assert.equal(v.preserved_atomic_unpublished_parent_groups.length,2);
 assert.deepEqual(v.preserved_atomic_unpublished_parent_groups.map(x=>x.original_child_response_positions),[4,5]);
 assert.equal(v.HOLD_may_be_recovered_in_later_independent_batch_subject_to_same_frozen_gate,true);
 assert.equal(v.draft_source_PR124_remains_unmerged_and_preexisting_v12_ALL29_snapshot_requires_separate_append_only_refresh,true);
});
