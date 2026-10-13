import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isExamQuestionReuseEligible, certificationGate } from "../site/assets/js/s3-admission.mjs";

const read=p=>JSON.parse(readFileSync(p,"utf8"));
const prefix="data/source-archive/";
const mid=read(prefix+"p12-art9-114-yongan-g04s1-mid20-original-questions-v1.json");
const fin=read(prefix+"p12-art9-114-yongan-g04s1-final22-original-questions-v1.json");
const index=read(prefix+"p12-art9-114-yongan-g04s1-42-index-v1.json");
const midQa=read("data/review/p12-standalone-yongan-mid20-safe-science-kp-v1.json");
const finalQa=read("data/review/p12-standalone-yongan22-science-kp-secondpass-v1.json");
const finalOriginal=read("data/review/p12-standalone-source-first-yongan-final-22-safe-manifest-v1.json");
const all=[...mid.original_question_records,...fin.original_question_records];
const paperData=[
  [mid,midQa.source_records,"SCI_G04_S1_114_MID_001",10,10,"4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe"],
  [fin,finalQa.records,"SCI_G04_S1_114_FINAL_001",8,14,"88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf"]
];

test("public Article9 source archive is complete 20+22, no child-group flattening or duplicated source IDs",()=>{
  assert.equal(all.length,42);
  assert.equal(index.question_source_archive_total,42);
  assert.equal(index.true_false_total,18);
  assert.equal(index.four_choice_total,24);
  assert.equal(index.total_original_choice_options,96);
  assert.equal(new Set(all.map(x=>x.source_id)).size,42);
  for(const [paper,qa,id,tf,mc,sha] of paperData){
    assert.equal(paper.source_paper_id,id);
    assert.equal(paper.original_pdf_sha256,sha);
    assert.equal(paper.source_archived_count,tf+mc);
    assert.equal(paper.true_false,tf);
    assert.equal(paper.four_option_choice,mc);
    assert.equal(paper.source_original_header_inspected,true);
    assert.equal(paper.source_pdf_sha256_verified,true);
    assert.equal(paper.original_text_transcription_verified_from_pdf,true);
    assert.equal(paper.public_repository_source_archive_only,true);
    assert.equal(paper.public_learner_site_not_yet_admitted,true);
    assert.deepEqual(paper.original_question_records.map(x=>x.source_id),qa.map(x=>x.source_id));
    assert.equal(paper.original_question_records.filter(x=>x.question_type==="TRUE_FALSE").length,tf);
    assert.equal(paper.original_question_records.filter(x=>x.question_type==="SINGLE_CHOICE").length,mc);
  }
  assert.deepEqual(fin.original_question_records.map(x=>x.source_id),finalOriginal.original_question_records.map(x=>x.source_id));
});
test("each article9 archive contains full question stems, 4-choice option order, PDF marker geometry and no teacher materials",()=>{
  for(const paper of [mid,fin]){
    assert.equal(paper.license_status,"REGULATED_EXAM_QUESTION_ART9");
    assert.equal(paper.regulated_exam_identity_verified,true);
    assert.equal(paper.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
    assert.equal(paper.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
    assert.equal(paper.original_teacher_answer_text_excluded,true);
    assert.equal(paper.school_official_exact_question_download_url_verified,false);
    assert.equal(isExamQuestionReuseEligible(paper),true);
    for(const r of paper.original_question_records){
      assert.equal(r.article9_exam_question_text_only,true);
      assert.equal(r.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
      assert.equal(r.source_pdf_page,1);
      assert.equal(r.original_scored_points,2);
      assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
      assert.ok(typeof r.full_original_stem==="string"&&r.full_original_stem.length>5,r.source_id);
      assert.ok(r.full_original_stem.endsWith("。")||r.full_original_stem.endsWith("？"),r.source_id);
      assert.ok(Array.isArray(r.full_original_options_in_order));
      const expected=r.question_type==="TRUE_FALSE"?0:4;
      assert.equal(r.full_original_options_in_order.length,expected,r.source_id);
      assert.deepEqual(r.full_original_options_in_order.map(o=>o.label),expected===0?[]:["①","②","③","④"]);
      assert.ok(r.full_original_options_in_order.every(o=>typeof o.text==="string"&&o.text.length>0),r.source_id);
      assert.ok(Array.isArray(r.answer_marker_pdf_bbox_pts_top_left),r.source_id);
      const [x1,y1,x2,y2]=r.answer_marker_pdf_bbox_pts_top_left;
      assert.ok(x1>=0&&y1>=0&&x2>x1&&y2>y1&&x2<=850&&y2<=1200,r.source_id);
      assert.equal(r.teacher_answer_authenticated,false);
      assert.equal(r.science_unique_answer_final_approved,false);
      assert.equal(r.operator_public_admission_approved,false);
      assert.equal(r.site_question_bank_admitted,false);
      assert.equal(Object.hasOwn(r,"teacher_original_answer_text"),false);
      assert.equal(Object.hasOwn(r,"teacher_original_solution"),false);
    }
  }
});
test("two MID and two FINAL science defects remain held even after legal source archive classification",()=>{
 const holds=all.filter(x=>x.science_review_status.startsWith("SCIENCE_HOLD"));
 assert.deepEqual(holds.map(x=>x.source_id),[
 "SCI_G04_S1_114_MID_001|TF|S01|004",
 "SCI_G04_S1_114_MID_001|MC|S02|007",
 "SCI_G04_S1_114_FINAL_001|TF|S01|005",
 "SCI_G04_S1_114_FINAL_001|MC|S02|004"
 ]);
 assert.equal(all.length-holds.length,38);
 assert.equal(index.science_holds_total,4);
 assert.equal(index.model_science_preliminary_pass_total,38);
 for(const r of holds)assert.equal(r.site_question_bank_admitted,false);
});
test("Article9 text legality does not bypass strict learner site admission",()=>{
 const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
 for(const paper of [mid,fin]){
   const r=paper.original_question_records[0];
   const shape={
      ...paper,
      candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,
      raw_question_text:r.full_original_stem,
      source_page_pdf_1_based:1,review_status:"SOURCE_ONLY",
      admission_status:"ARCHIVED_SOURCE_ONLY",
      answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,
      answer_normalized:null,mapping_status:"KP_UNRESOLVED",
      primary_canonical_kp_id:null,
      source_visual_review_verified:true,kp_review_verified:false,
      dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"
   };
   assert.equal(isExamQuestionReuseEligible(shape),true);
   const gate=certificationGate(shape,authority);
   assert.equal(gate.allowed,false);
   assert.ok(gate.reasons.includes("ANSWER_UNVERIFIED"));
   assert.ok(gate.reasons.includes("KP_REVIEW_PENDING"));
   assert.ok(gate.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
 assert.equal(index.new_learner_site_question_admissions,0);
 assert.equal(index.operator_learner_public_admission_approved_count,0);
 assert.equal(index.keep_114_all25_before_publication_rule,true);
 assert.equal(index.keep_1623_original_response_denominator,true);
 assert.equal(index.live_bank_baseline_answer_positions_total,251);
 assert.equal(index.live_bank_baseline_answer_positions_g04s1,53);
});
