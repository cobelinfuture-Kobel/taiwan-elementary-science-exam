import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExamQuestionReuseEligible,certificationGate} from "../site/assets/js/s3-admission.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const src=get("data/source-archive/p12-art9-114-minquan-g04s1-mid25-original-questions-v1.json");
const review=get("data/review/p12-art9-114-minquan-mid25-science-kp-secondpass-v1.json");
const frozen=get("data/review/p12-g04s1-114-minquan-mid-tfmc-25-v1.json");
const parent=get("data/review/p12-g04s1-114-kanghsuan-minquan-mid-75-source-manifest-v1.json");
const queue=get("data/review/p12-standalone-all25-source-first-queue-v1.json");
const previous=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v5.json");
const current=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v6.json");
const auth=get("site/data/authority/science-g03-g04-selector-v2.json");
const kpIds=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const id="SCI_G04_S1_114_MID_005",items=src.original_question_records;
const item=(type,n)=>items.find(x=>x.source_id===id+"|"+(type==="TF"?"S01|TF|":"S02|MC|")+String(n).padStart(3,"0"));
test("民權國小原始2頁PDF binary/frozen V1 exact SHA and 25 original TF/MC response IDs",()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,"臺北市民權國民小學");
 assert.equal(src.original_pdf_sha256,"ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a");
 assert.equal(src.original_pdf_sha256,parent.source_pdf_sha256);
 assert.equal(src.original_pdf_sha256,frozen.source_pdf_sha256);
 assert.equal(src.original_raw_pdf_size_bytes,386737);
 assert.equal(src.original_pdf_pages,2);
 assert.equal(src.original_full_paper_answer_positions_frozen,75);
 assert.equal(parent.original_source_answer_positions,75);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.equal(src.source_original_header_inspected,true);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_text_transcription_verified_from_pdf,true);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(src.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.equal(src.source_archived_count,25);
 assert.equal(src.true_false,15);assert.equal(src.four_option_choice,10);
 assert.equal(items.length,25);
 assert.deepEqual(items.map(x=>x.source_id),frozen.items.map(x=>x.source_slot_id));
 assert.deepEqual(items.map(x=>x.source_id),review.original_question_reviews.map(x=>x.source_id));
 assert.equal(new Set(items.map(x=>x.source_id)).size,25);
 assert.equal(items.reduce((sum,x)=>sum+x.full_original_options_in_order.length,0),40);
});
test("25 exact printed stems/options and all answer-marker original PDF character bboxes",()=>{
 for(let i=0;i<25;i++){
  const r=items[i],tf=i<15,expectedNumber=tf?i+1:i-14;
  assert.equal(r.source_id,id+"|"+(tf?"S01|TF|":"S02|MC|")+String(expectedNumber).padStart(3,"0"));
  assert.equal(r.original_printed_number,expectedNumber);
  assert.equal(r.original_scored_points,2);
  assert.equal(r.question_type,tf?"TRUE_FALSE":"SINGLE_CHOICE");
  assert.deepEqual(r.source_pdf_pages,[1]);assert.equal(r.answer_marker_pdf_page,1);
  assert.ok(typeof r.full_original_stem==="string"&&r.full_original_stem.length>12,r.source_id);
  assert.deepEqual(r.full_original_options_in_order.map(x=>x.label),tf?[]:["①","②","③","④"]);
  assert.ok(r.full_original_options_in_order.every(x=>typeof x.text==="string"&&x.text.length>0));
  const [x1,y1,x2,y2]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(y1>70&&y2>y1&&y2<840&&x1>=36&&x2>x1&&x2<=570,r.source_id);
  assert.equal(x1,i<18?(i>=9&&i<=14?36.48:42.12):(i===24?302.35:307.99));
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(r.article9_exam_question_text_only,true);
  assert.equal(r.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
  assert.equal(r.teacher_answer_authenticated,false);
  assert.equal(r.science_unique_answer_final_approved,false);
  assert.equal(r.site_question_bank_admitted,false);
  assert.equal(r.operator_public_admission_approved,false);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kpIds.has(r.primary_canonical_kp_id_proposed),r.source_id);
 }
 assert.equal(item("MC",6).full_original_options_in_order[2].text,"岩石>沙>土壤");
 assert.equal(item("TF",8).full_original_stem,"蟹有八隻腳及一對螯，能在水中爬行，用鰓呼吸。");
 assert.equal(item("MC",10).full_original_options_in_order[2].text,"水位低時，葉仍會浮在水面上");
});
test("一項土壤混合物粒徑未定義的科學HOLD、不偽稱已核原教師解答；KP 23強 2待審",()=>{
 assert.equal(review.model_science_preliminary_pass,24);
 assert.equal(review.model_science_hold,1);
 assert.equal(src.source_science_model_preliminary_pass_count,24);
 assert.equal(src.source_science_hold_count,1);
 assert.deepEqual(review.science_hold_source_ids,[id+"|S02|MC|006"]);
 assert.equal(item("MC",6).science_review_status,"SCIENCE_HOLD_SOIL_GRANULARITY_UNDEFINED");
 assert.equal(review.original_question_reviews.find(x=>x.source_id===id+"|S02|MC|006").model_provisional_answer,null);
 assert.deepEqual(review.kp_secondpass_count,{KP_STRONG_CANDIDATE:23,KP_REVIEW:2,KP_NONMATCH_G04S1:0});
 assert.equal(review.kp_strong_and_science_pass_count,22);
 assert.equal(item("MC",1).kp_review_status,"KP_REVIEW");
 assert.equal(item("MC",2).kp_review_status,"KP_REVIEW");
 assert.deepEqual(review.exact_normalized_stem_matches_against_previous_120,[]);
 assert.equal(review.cross_paper_similar_stem_candidates.length,1);
 assert.equal(review.cross_paper_similar_stem_candidates[0].source_id,id+"|S01|TF|007");
 assert.equal(review.formal_teacher_key_authentication_count,0);
 assert.equal(review.formal_science_acceptance_count,0);
 assert.equal(review.formal_kp_approval_count,0);
 assert.equal(review.operator_public_site_admissions,0);
});
test("Article9 source text legality does not bypass ANSWER/KP/operator learner admission",()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 assert.equal(src.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(src.original_teacher_answer_text_excluded,true);
 assert.equal(src.school_official_exact_question_download_url_verified,false);
 for(const r of items){
  const c={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,
    raw_question_text:r.full_original_stem,source_page_pdf_1_based:1,
    review_status:"ARCHIVED_SOURCE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",
    answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,
    mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,
    source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
  const gate=certificationGate(c,auth);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes("ANSWER_UNVERIFIED"));
  assert.ok(gate.reasons.includes("KP_REVIEW_PENDING"));
  assert.ok(gate.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
});
test("25-paper/1623 original frozen: cumulative 120+25=145 source-only not live 251/53",()=>{
 assert.equal(previous.cumulative_original_source_question_occurrences,120);
 assert.equal(current.cumulative_original_source_question_occurrences,145);
 assert.equal(current.total_true_false,67);
 assert.equal(current.total_single_choice,78);
 assert.equal(current.original_single_choice_options,312);
 assert.equal(current.science_model_preliminary_pass,135);
 assert.equal(current.science_hold,10);
 assert.equal(current.source_print_duplicate_choice_label_hold_total,1);
 assert.equal(current.current_public_source_paper_count,7);
 assert.equal(current.current_public_source_archive_files.length,7);
 assert.equal(current.site_question_bank_new_admissions,0);
 assert.equal(current.existing_live_bank_total_answer_positions,251);
 assert.equal(current.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(current.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
 assert.equal(current.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.ok(queue.source_exact_standalone_private_completed>=145);
 assert.equal(queue.science_model_reviewed_original_standalone_items,queue.source_exact_standalone_private_completed);
 assert.ok(queue.model_science_no_obvious_problem>=135);
 assert.ok(queue.model_science_hold>=10);
 assert.equal(queue.model_science_hold+queue.model_science_no_obvious_problem,queue.science_model_reviewed_original_standalone_items);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),queue.source_exact_standalone_private_completed);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
});
