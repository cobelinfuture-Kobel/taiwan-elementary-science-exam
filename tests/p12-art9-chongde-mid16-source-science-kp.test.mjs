import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isExamQuestionReuseEligible, certificationGate } from "../site/assets/js/s3-admission.mjs";

const read=p=>JSON.parse(readFileSync(p,"utf8"));
const source=read("data/source-archive/p12-art9-114-chongde-g04s1-mid16-original-questions-v1.json");
const qa=read("data/review/p12-art9-114-chongde-mid16-source-science-kp-secondpass-v1.json");
const prior=read("data/review/p12-g04s1-114-nanyi-chongde-mid-source-visual-preflight-v1.json");
const queue=read("data/review/p12-standalone-all25-source-first-queue-v1.json");
const index=read("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v2.json");
const first=read("data/source-archive/p12-art9-114-yongan-g04s1-42-index-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const kpSet=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));

test("original school PDF, 16 frozen source IDs and full text-option source geometry readback",()=>{
  assert.equal(source.source_paper_id,"SCI_G04_S1_114_MID_003");
  assert.equal(source.original_pdf_sha256,prior.source_pdf_sha256);
  assert.equal(source.original_pdf_sha256,"90967222348a95719ee1263240e5ae943e9d4f4d4cc15b7ea576191d0f618335");
  assert.equal(source.source_original_header_inspected,true);
  assert.equal(source.source_pdf_sha256_verified,true);
  assert.equal(source.original_text_transcription_verified_from_pdf,true);
  assert.equal(source.original_answer_marker_raw_character_pdf_geometry_verified,true);
  assert.equal(source.original_pdf_pages,2);
  assert.equal(source.source_archived_count,16);
  assert.equal(source.true_false,8);
  assert.equal(source.four_option_choice,8);
  assert.equal(source.original_question_records.length,16);
  assert.deepEqual(source.original_question_records.map(x=>x.source_id),prior.first_16_items.map(x=>x.source_slot_id));
  assert.equal(new Set(source.original_question_records.map(x=>x.source_id)).size,16);
  assert.deepEqual(source.original_question_records.map(x=>x.source_id),qa.original_question_reviews.map(x=>x.source_id));
  for(let i=0;i<16;i++){
    const r=source.original_question_records[i];
    assert.equal(r.original_printed_number,i%8+1);
    assert.equal(r.question_type,i<8?"TRUE_FALSE":"SINGLE_CHOICE");
    assert.equal(r.full_original_options_in_order.length,i<8?0:4);
    assert.deepEqual(r.full_original_options_in_order.map(o=>o.label),i<8?[]:["①","②","③","④"]);
    assert.ok(r.full_original_options_in_order.every(o=>typeof o.text==="string"&&o.text.length>1));
    assert.ok(r.full_original_stem.length>12);
    assert.equal(r.source_pdf_page,1);
    assert.equal(r.original_scored_points,2);
    const [x1,y1,x2,y2]=r.answer_marker_pdf_bbox_pts_top_left;
    assert.equal(x1,28.32);assert.equal(x2,60.28);
    assert.ok(y1>110&&y1<950&&y2>y1&&y2<1032);
    assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
    assert.equal(r.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
    assert.equal(r.site_question_bank_admitted,false);
    assert.equal(r.science_unique_answer_final_approved,false);
    assert.equal(r.teacher_answer_authenticated,false);
    assert.equal(r.operator_public_admission_approved,false);
    if(r.primary_canonical_kp_id_proposed)assert.ok(kpSet.has(r.primary_canonical_kp_id_proposed));
    if(r.cross_semester_kp_id_proposed)assert.ok(kpSet.has(r.cross_semester_kp_id_proposed));
  }
});
test("science 15 preliminary pass + one scientifically underspecified comparison HOLD; KP 8/7/1 and duplicate relationships",()=>{
  assert.equal(qa.model_science_preliminary_pass,15);
  assert.equal(qa.model_science_hold,1);
  assert.equal(source.source_science_model_preliminary_pass_count,15);
  assert.equal(source.source_science_hold_count,1);
  assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:8,KP_NONMATCH_G04S1:7,KP_REVIEW:1});
  assert.equal(qa.kp_strong_and_model_science_pass_count,7);
  const hold=source.original_question_records.filter(x=>x.science_review_status.startsWith("SCIENCE_HOLD"));
  assert.deepEqual(hold.map(x=>x.source_id),["SCI_G04_S1_114_MID_003|S01|TF|007"]);
  assert.equal(qa.original_question_reviews.find(x=>x.source_id===hold[0].source_id).model_provisional_answer,null);
  assert.equal(qa.source_exact_stem_duplicate_links.length,2);
  assert.equal(source.original_question_records[6].full_original_stem,"海洋是鹹水水域，鹽分較高，是世上最大的水域環境且生物種類較多。");
  assert.equal(source.original_question_records[9].full_original_options_in_order[1].text,"儲存空氣");
  assert.equal(qa.original_question_reviews[9].model_provisional_answer,"②");
  assert.equal(qa.original_question_reviews[8].model_provisional_answer,"③");
  assert.equal(qa.original_question_reviews[15].model_provisional_answer,"④");
});
test("Article9 text scope permits source archive but NEVER learner-site admission without independent science/KP and all25 operator gates",()=>{
 assert.equal(isExamQuestionReuseEligible(source),true);
 assert.equal(source.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(source.original_teacher_answer_text_excluded,true);
 assert.equal(source.school_official_exact_question_download_url_verified,false);
 for(const row of source.original_question_records){
   const x={...source,
      candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,
      source_page_pdf_1_based:1,review_status:"SOURCE_ARCHIVE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",
      answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,
      mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,
      source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
   const gate=certificationGate(x,authority);
   assert.equal(gate.allowed,false);
   assert.ok(gate.reasons.includes("ANSWER_UNVERIFIED"));
   assert.ok(gate.reasons.includes("KP_REVIEW_PENDING"));
   assert.ok(gate.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
 assert.equal(qa.formal_science_acceptance_count,0);
 assert.equal(qa.formal_kp_approval_count,0);
 assert.equal(qa.teacher_key_authenticated_count,0);
 assert.equal(qa.operator_public_learner_admission_count,0);
});
test("cumulative 42+16=58 original source occurrences, 251 site unchanged and original all25 denominator frozen",()=>{
  assert.equal(first.question_source_archive_total,42);
  assert.equal(index.cumulative_original_source_question_occurrences,58);
  assert.equal(index.total_true_false,26);
  assert.equal(index.total_single_choice,32);
  assert.equal(index.original_single_choice_options,128);
  assert.equal(index.science_model_preliminary_pass,53);
  assert.equal(index.science_hold,5);
  assert.equal(index.cross_school_same_original_stem_links_detected,2);
  assert.equal(index.current_public_source_paper_count,3);
  assert.equal(index.current_public_source_archive_files.length,3);
  assert.equal(index.site_question_bank_new_admissions,0);
  assert.equal(index.existing_live_bank_total_answer_positions,251);
  assert.equal(index.existing_live_bank_g04s1_answer_positions,53);
  assert.equal(index.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
  assert.equal(index.source_position_frozen_all25_total,1623);
  assert.equal(queue.source_papers_total,25);
  assert.equal(queue.source_exact_standalone_private_completed,58);
  assert.equal(queue.science_model_reviewed_original_standalone_items,58);
  assert.equal(queue.model_science_no_obvious_problem,53);
  assert.equal(queue.model_science_hold,5);
  assert.equal(queue.source_paper_queue.reduce((s,p)=>s+p.full_complete_standalone_tf_mc_private_source_count,0),58);
  assert.equal(queue.fully_screened_all_25_standalone_papers,0);
  assert.equal(queue.all25_before_publication_gate_preserved,true);
  assert.equal(queue.public_items_new,0);
});
