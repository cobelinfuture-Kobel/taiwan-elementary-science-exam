import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {verifyG03S2FinalPrepublic} from "../tools/verify-p12-g03s2final-46-prepublic.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
test("source-curved fishbowl X is explicitly science-adjudicated; old O preserved, not a teacher-key claim",()=>{
 const a=read("data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json");
 const c=read("data/review/p12-g03s2final-composite-p03-q03-science-correction-v1.json");
 const original=read("data/review/p12-g03s2final-46-final-source-acceptance-v1.json");
 const old=original.items.find(x=>x.source_slot_id===a.approved_source_slot_id);
 assert.equal(old.independent_science_answer,"O");
 assert.equal(a.approved_learner_answer,"X");
 assert.equal(a.primary_canonical_kp_id,"sci_g03s2_04_06");
 assert.equal(a.decision,"APPROVE_CURVED_FISHBOWL_SCIENCE_ANSWER_X");
 assert.equal(a.bulk_46_public_admission_approved,false);
 assert.equal(c.operator_science_adjudication_received,true);
 assert.equal(c.operator_science_adjudication_ref,"data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json");
 assert.equal(c.original_science_review_preserved,true);
 assert.equal(c.public_release_approved,false);
});
test("all 46 staged positions prepublic fail-closed acceptance retains independent PDF source and frozen 205 public baseline",()=>{
 const result=verifyG03S2FinalPrepublic();
 assert.equal(result.prepublic,"PASS_READY_FOR_SEPARATE_OPERATOR_PUBLIC_ADMISSION");
 assert.equal(result.sourceAnswerSlots,46);
 assert.equal(result.blocks,28);
 assert.equal(result.correctedAnswer,"X");
 assert.equal(result.figureGroups,6);
 assert.equal(result.figureSlots,22);
 assert.equal(result.readingGroups,2);
 assert.equal(result.readingSlots,4);
 assert.equal(result.existingPublicSlots,205);
 assert.equal(result.targetIfSeparatelyApproved,251);
 assert.equal(result.publicAdmission,false);
 assert.equal(result.a4ProofRun,38262035029);
});


test("durable PrePublic acceptance report mirrors the gate, requires separate public authorization",()=>{
 const result=verifyG03S2FinalPrepublic();
 const report=read("data/review/p12-g03s2final-46-prepublic-acceptance-v1.json");
 assert.equal(report.decision,"PREPUBLIC_ACCEPTANCE_PASS__BULK_PUBLIC_RELEASE_NOT_AUTHORIZED");
 assert.equal(report.prepublic_candidate_blocks,result.blocks);
 assert.equal(report.prepublic_candidate_source_slots,result.sourceAnswerSlots);
 assert.equal(report.source_science_adjudication.operator_approved_learner_answer,result.correctedAnswer);
 assert.equal(report.source_science_adjudication.source_slot_id,result.explicitSourceException);
 assert.equal(report.a4_technical_review.block_count,result.blocks);
 assert.equal(report.a4_technical_review.source_answer_slots,result.sourceAnswerSlots);
 assert.equal(report.automated_acceptance.node_tests_failed,0);
 assert.ok(report.automated_acceptance.node_tests_passed>=106);
 assert.equal(report.public_boundary.public_answer_slots_before_and_after,result.existingPublicSlots);
 assert.equal(report.public_boundary.planned_additive_slots_only_after_separate_approval,result.sourceAnswerSlots);
 assert.equal(report.public_boundary.bulk_public_approval,false);
 assert.equal(report.public_boundary.no_46_public_admit_events,true);
 assert.equal(report.public_release_requires_separate_approval,true);
});
