import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExamQuestionReuseEligible,certificationGate} from "../site/assets/js/s3-admission.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const src=get("data/source-archive/p12-art9-114-anhe-g04s1-mid30-original-questions-v1.json");
const qa=get("data/review/p12-art9-114-anhe-mid30-science-kp-secondpass-v1.json");
const frozen=get("data/review/p12-g04s1-114-kanghsuan-anhe-mid-50-source-kp-first-v1.json");
const q=get("data/review/p12-standalone-all25-source-first-queue-v1.json");
const corpus=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v7.json");
const prev=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v6.json");
const auth=get("site/data/authority/science-g03-g04-selector-v2.json");
const kpSet=new Set(auth.units.flatMap(u=>u.knowledge_points.map(x=>x.canonical_kp_id)));
const paper="SCI_G04_S1_114_MID_006",rows=src.original_question_records;
const find=(type,n)=>rows.find(x=>x.source_id===paper+"|"+(type==="TF"?"S01|TF|":"S02|MC|")+String(n).padStart(3,"0"));
test("Anhe 114 school exam 2pp binary SHA and immutable 50 response positions with 30 standalone TF/MC",()=>{
 assert.equal(src.source_paper_id,paper);
 assert.equal(src.source_school,"新北市土城區安和國民小學");
 assert.equal(src.original_pdf_sha256,"f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb");
 assert.equal(src.original_pdf_sha256,frozen.source_exact_pdf_sha256);
 assert.equal(src.original_pdf_pages,2);
 assert.equal(src.original_raw_pdf_size_bytes,186792);
 assert.equal(src.original_full_paper_answer_positions_frozen,50);
 assert.equal(frozen.source_answer_positions,50);
 assert.equal(src.source_original_header_inspected,true);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice],[30,15,15]);
 assert.equal(rows.length,30);
 assert.deepEqual(rows.map(x=>x.source_id),frozen.items.slice(0,30).map(x=>x.source_slot_id));
 assert.equal(new Set(rows.map(x=>x.source_id)).size,30);
 assert.equal(rows.reduce((n,r)=>n+r.full_original_options_in_order.length,0),60);
 assert.deepEqual(rows.map(x=>x.source_id),qa.original_question_reviews.map(x=>x.source_id));
});
test("Printed source positions and four options: first MC on page1 left, MC2-13 right, MC14-15 page2",()=>{
 for(let i=0;i<30;i++){
  const r=rows[i],tf=i<15,n=tf?i+1:i-14,pg=i<28?1:2;
  assert.equal(r.source_id,paper+"|"+(tf?"S01|TF|":"S02|MC|")+String(n).padStart(3,"0"));
  assert.equal(r.question_type,tf?"TRUE_FALSE":"SINGLE_CHOICE");
  assert.equal(r.original_printed_number,n);
  assert.deepEqual(r.source_pdf_pages,[pg]);
  assert.equal(r.answer_marker_pdf_page,pg);
  assert.equal(r.original_scored_points,2);
  assert.ok(r.full_original_stem.length>=13);
  assert.deepEqual(r.full_original_options_in_order.map(x=>x.label),tf?[]:["①","②","③","④"]);
  assert.ok(r.full_original_options_in_order.every(x=>x.text.length>0));
  const [x0,y0,x1,y1]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>30&&x1>x0&&y0>50&&y1>y0&&y1<1025);
  assert.equal(x0,i<15?33.6:i===15||i>=28?40.34:381.48);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(r.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
  assert.equal(r.teacher_answer_authenticated,false);
  assert.equal(r.science_unique_answer_final_approved,false);
  assert.equal(r.operator_public_admission_approved,false);
  assert.equal(r.site_question_bank_admitted,false);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kpSet.has(r.primary_canonical_kp_id_proposed),r.source_id);
 }
 assert.deepEqual(find("MC",14).source_pdf_pages,[2]);
 assert.deepEqual(find("MC",15).source_pdf_pages,[2]);
 assert.equal(find("MC",1).full_original_options_in_order[1].text,"西瓜：溼潤的泥土");
 assert.equal(find("MC",11).full_original_options_in_order[3].text,"森林大火。");
});
test("Two separate scientifically underdetermined original MC questions HOLD, not invented teacher keys",()=>{
 assert.equal(qa.model_science_preliminary_pass,28);
 assert.equal(qa.model_science_hold,2);
 assert.deepEqual(qa.science_hold_source_ids,[paper+"|S02|MC|001",paper+"|S02|MC|011"]);
 assert.equal(src.source_science_model_preliminary_pass_count,28);
 assert.equal(src.source_science_hold_count,2);
 for(const id of qa.science_hold_source_ids){
   assert.equal(rows.find(r=>r.source_id===id).science_review_status,"SCIENCE_HOLD_UNDERDETERMINED_SINGLE_CHOICE");
   assert.equal(qa.original_question_reviews.find(r=>r.source_id===id).model_provisional_answer,null);
 }
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:29,KP_REVIEW:1,KP_NONMATCH_G04S1:0});
 assert.equal(qa.kp_strong_and_science_pass_count,27);
 assert.equal(find("TF",11).kp_review_status,"KP_REVIEW");
 assert.equal(qa.near_duplicate_stem_candidates.length,1);
 assert.equal(qa.near_duplicate_stem_candidates[0].related_source_id,"SCI_G04_S1_114_MID_004|S01|TF|005");
 assert.deepEqual(qa.same_normalized_stem_as_previous_145,[]);
 assert.equal(qa.teacher_key_authenticated_count,0);
 assert.equal(qa.formal_science_approved_count,0);
 assert.equal(qa.formal_kp_approved_count,0);
 assert.equal(qa.operator_public_site_admission_count,0);
});
test("Art9 school question text publication does not waive answer science KP or operator site gates",()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 assert.equal(src.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(src.original_teacher_answer_text_excluded,true);
 assert.equal(src.school_official_exact_question_download_url_verified,false);
 for(const r of rows){
  const c={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,
    source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:"ARCHIVED_SOURCE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",
    answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,
    mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,
    source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
  const g=certificationGate(c,auth);
  assert.equal(g.allowed,false);
  assert.ok(g.reasons.includes("ANSWER_UNVERIFIED"));
  assert.ok(g.reasons.includes("KP_REVIEW_PENDING"));
  assert.ok(g.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
});
test("Cumulative 145+30=175 source items; 25 exam/1623 original denominator and live 251/53 site unchanged",()=>{
 assert.equal(prev.cumulative_original_source_question_occurrences,145);
 assert.deepEqual([corpus.cumulative_original_source_question_occurrences,corpus.total_true_false,corpus.total_single_choice,corpus.original_single_choice_options],[175,82,93,372]);
 assert.equal(corpus.science_model_preliminary_pass,163);
 assert.equal(corpus.science_hold,12);
 assert.equal(corpus.current_public_source_paper_count,8);
 assert.equal(corpus.current_public_source_archive_files.length,8);
 assert.equal(corpus.site_question_bank_new_admissions,0);
 assert.equal(corpus.existing_live_bank_total_answer_positions,251);
 assert.equal(corpus.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(corpus.source_position_frozen_all25_total,1623);
 assert.equal(corpus.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
 assert.equal(q.source_papers_total,25);
 assert.ok(q.source_exact_standalone_private_completed>=175);
 assert.equal(q.science_model_reviewed_original_standalone_items,q.source_exact_standalone_private_completed);
 assert.ok(q.model_science_no_obvious_problem>=163);
 assert.ok(q.model_science_hold>=12);
 assert.equal(q.source_paper_queue.reduce((s,r)=>s+r.full_complete_standalone_tf_mc_private_source_count,0),q.source_exact_standalone_private_completed);
 assert.equal(q.fully_screened_all_25_standalone_papers,0);
 assert.equal(q.all25_before_publication_gate_preserved,true);
 assert.equal(q.public_items_new,0);
});