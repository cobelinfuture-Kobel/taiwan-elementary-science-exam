import test from "node:test";import assert from "node:assert/strict";
import {buildP12Preflight,materializeP12Preflight} from "../tools/p12-source-preflight.mjs";
test("P12 preflight queues exactly 326 pending original source answer positions, not 326 certified questions",()=>{
 const q=buildP12Preflight();
 assert.equal(q.candidate_slots.length,326);assert.equal(q.batch_groups.length,8);
 assert.equal(new Set(q.candidate_slots.map(x=>x.source_slot_id)).size,326);
 assert.equal(q.batch_groups.reduce((n,g)=>n+g.candidate_answer_positions,0),326);
 assert.equal(q.public_answer_slots_frozen,148);assert.equal(q.no_additions_in_this_phase,true);
 assert.ok(q.candidate_slots.every(x=>!x.question_stem_extracted&&!x.answer_science_verified&&!x.kp_mapping_verified&&!x.release_permission));
 assert.equal(q.first_batch_source,"G03-S2-MID");
});
test("P12 queue byte readback is deterministic, and source-first next step is bounded",()=>{
 assert.deepEqual(materializeP12Preflight({check:true}),{sourcePapers:8,candidateSlots:326,publicItemsUnchanged:148,firstSource:"G03-S2-MID"});
 const q=buildP12Preflight();
 assert.equal(q.p12_next_execution_task,"SCIENCE_EXAM_S3_P12_G03S2MID_FullPaperCandidateScreening");
 assert.equal(q.retained_review_gate,"NEVER_AUTO_RELEASE_WITHOUT_EXACT_SOURCE_ANSWER_KP_AND_ASSET_CHECKS");
});
