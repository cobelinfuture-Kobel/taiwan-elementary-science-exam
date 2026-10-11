import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {certificationGate,validateCandidateShape,assertNoUncertifiedQuestions} from "../site/assets/js/s3-admission.mjs";
const authority=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
const summary=JSON.parse(readFileSync("site/data/question-bank/s3-pilot-status.json","utf8"));
const fixture={candidate_id:"SYNTHETIC_TEST_001",source_id:"TEST",source_page_pdf_1_based:1,question_type:"TRUE_FALSE",raw_question_text:"DEMO_ONLY: synthetic proposition.",review_status:"ACCEPTED",admission_status:"CERTIFIED_PUBLIC",license_status:"PUBLIC_REUSE_AUTHORIZED",answer_evidence_status:"ANSWER_INDEPENDENTLY_VERIFIED",mapping_status:"KP_CERTIFIED",answer_normalized:"TRUE",answer_review_verified:true,source_visual_review_verified:true,kp_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM",primary_canonical_kp_id:"sci_g04s1_02_03"};
test("S3 pilot source census is metadata only",()=>{assert.equal(summary.source_count,4);assert.equal(summary.candidate_count,40);assert.equal(summary.exact_kp_proposed,36);assert.equal(summary.kp_unresolved,4);assert.equal(summary.unrendered_answer_hints,10);assert.equal(summary.answer_key_not_present,30);assert.equal(summary.verified_answers,0);assert.equal(summary.public_certified,0);assert.ok(!JSON.stringify(summary).includes("raw_question_text"));});
test("unrendered PDF markers cannot become verified answers",()=>{const x={...fixture,answer_evidence_status:"TEXT_LAYER_OX_NOT_VISIBLE_IN_RENDER",answer_normalized:"FALSE"};assert.throws(()=>validateCandidateShape(x));});
test("missing rights prevent publishing historical exam text",()=>{const x={...fixture,license_status:"REDISTRIBUTION_NOT_VERIFIED"};assert.deepEqual(certificationGate(x,authority).reasons,["REUSE_RIGHTS_NOT_VERIFIED"]);});
test("unverified answer never enters a certified public pool",()=>{const x={...fixture,answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null};assert.equal(certificationGate(x,authority).allowed,false);assert.throws(()=>assertNoUncertifiedQuestions([x],authority));});
test("unresolved exact-KP mapping cannot claim admitted status",()=>{const x={...fixture,mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null};assert.equal(certificationGate(x,authority).allowed,false);});
test("dependently illustrated questions must retain their figures",()=>{const x={...fixture,image_dependency:"SOURCE_FIGURE",assets_complete:false};assert.throws(()=>certificationGate(x,authority),/dependent image required/);});
test("only fully certified and authorized synthetic question can pass",()=>{assert.equal(certificationGate(fixture,authority).allowed,true);assert.equal(assertNoUncertifiedQuestions([fixture],authority).length,1);});

test("Taiwan Article 9 path permits only verified lawfully held exam question text",()=>{
 const source={...fixture,license_status:"REGULATED_EXAM_QUESTION_ART9",
    regulated_exam_identity_verified:true,third_party_content_clearance:"NO_THIRD_PARTY_COPY",
    public_material_scope:"EXAM_QUESTION_TEXT_ONLY",original_teacher_answer_text_excluded:true};
 assert.equal(certificationGate(source,authority).allowed,true);
 assert.equal(certificationGate({...source,regulated_exam_identity_verified:false},authority).allowed,false);
 assert.equal(certificationGate({...source,third_party_content_clearance:"UNCHECKED"},authority).allowed,false);
 assert.equal(certificationGate({...source,public_material_scope:"WHOLE_EXAM_SCAN"},authority).allowed,false);
 assert.equal(certificationGate({...source,original_teacher_answer_text_excluded:false},authority).allowed,false);
 assert.equal(certificationGate({...source,answer_review_verified:false},authority).allowed,false);
});
test("Article 9 never waives unresolved KP or missing figure safeguards",()=>{
 const base={...fixture,license_status:"REGULATED_EXAM_QUESTION_ART9",
    regulated_exam_identity_verified:true,third_party_content_clearance:"NO_THIRD_PARTY_COPY",
    public_material_scope:"EXAM_QUESTION_TEXT_ONLY",original_teacher_answer_text_excluded:true};
 assert.equal(certificationGate({...base,kp_review_verified:false},authority).allowed,false);
 assert.throws(()=>certificationGate({...base,image_dependency:"SOURCE_FIGURE",assets_complete:false}),/dependent image required/);
});

test("science answer accepted by operator with documented limitations can replace missing teacher key",()=>{
 const x={...fixture,answer_evidence_status:"SCIENCE_REASONED_OPERATOR_ACCEPTED",operator_answer_accepted:true,
 science_answer_source:"S3_P03_SCIENCE_REVIEW",science_review_reason:"Independent science evidence",science_review_qualification:"Under normal classroom conditions",answer_normalized:"TRUE",
 mapping_status:"KP_NEAREST_OPERATOR_ACCEPTED",operator_kp_accepted:true,nearest_relation_reason:"Related, non-exact educational concept"};
 assert.equal(certificationGate(x,authority).allowed,true);
 assert.equal(certificationGate({...x,operator_answer_accepted:false},authority).allowed,false);
 assert.equal(certificationGate({...x,science_review_qualification:""},authority).allowed,false);
 assert.equal(certificationGate({...x,operator_kp_accepted:false},authority).allowed,false);
});
