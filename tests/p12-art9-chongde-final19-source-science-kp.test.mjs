import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExamQuestionReuseEligible,certificationGate} from "../site/assets/js/s3-admission.mjs";
const j=p=>JSON.parse(readFileSync(p,"utf8"));
const src=j("data/source-archive/p12-art9-114-chongde-g04s1-final19-original-questions-v1.json");
const review=j("data/review/p12-art9-114-chongde-final19-science-kp-secondpass-v1.json");
const frozen=j("data/review/p12-g04s1-114-nanyi-chongde-final-65-source-kp-first-v1.json");
const queue=j("data/review/p12-standalone-all25-source-first-queue-v1.json");
const corpus=j("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v4.json");
const predecessor=j("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v3.json");
const auth=j("site/data/authority/science-g03-g04-selector-v2.json");
const kpSet=new Set(auth.units.flatMap(u=>u.knowledge_points.map(x=>x.canonical_kp_id)));

test("Chongde 114 G04S1 FINAL19 exact PDF source, 8 TF and 11 MC, no parent-child conversion",()=>{
 assert.equal(src.source_paper_id,"SCI_G04_S1_114_FINAL_004");
 assert.equal(src.source_school,"高雄市田寮區崇德國民小學");
 assert.equal(src.original_pdf_sha256,"8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84");
 assert.equal(src.original_pdf_sha256,frozen.source_original_pdf_sha256);
 assert.equal(src.original_raw_pdf_size_bytes,461199);
 assert.equal(src.original_pdf_pages,2);
 assert.equal(src.source_original_header_inspected,true);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_text_transcription_verified_from_pdf,true);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(src.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.equal(src.original_question_records.length,19);
 assert.deepEqual([src.true_false,src.four_option_choice],[8,11]);
 assert.deepEqual(src.original_question_records.map(x=>x.source_id),frozen.items.filter(x=>x.source_slot_id.startsWith("SCI_G04_S1_114_FINAL_004|S01|TF|")||x.source_slot_id.startsWith("SCI_G04_S1_114_FINAL_004|S02|MC|")).map(x=>x.source_slot_id));
 assert.equal(new Set(src.original_question_records.map(x=>x.source_id)).size,19);
 assert.deepEqual(src.original_question_records.map(x=>x.source_id),review.original_question_reviews.map(x=>x.source_id));
});
test("Exact question body, original order of every choice, original first-page two-column PDF marker coords",()=>{
 assert.equal(src.original_question_records.reduce((n,x)=>n+x.full_original_options_in_order.length,0),44);
 for(let i=0;i<19;i++){
  const row=src.original_question_records[i],tf=i<8,expectedNum=i<8?i+1:i-7;
  assert.equal(row.question_type,tf?"TRUE_FALSE":"SINGLE_CHOICE");
  assert.equal(row.original_printed_number,expectedNum);
  assert.equal(row.source_id,"SCI_G04_S1_114_FINAL_004|"+(tf?"S01|TF|":"S02|MC|")+String(expectedNum).padStart(3,"0"));
  assert.ok(typeof row.full_original_stem==="string"&&row.full_original_stem.length>12);
  assert.deepEqual(row.full_original_options_in_order.map(x=>x.label),tf?[]:["①","②","③","④"]);
  assert.ok(row.full_original_options_in_order.every(x=>typeof x.text==="string"&&x.text.length>0));
  const [x1,y1,x2,y2]=row.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(y1>90&&y2>y1&&y2<960&&x1>30&&x2>x1);
  assert.equal(x1,i<16?35.4:371.71);
  assert.deepEqual(row.source_pdf_pages,[1]);
  assert.equal(row.answer_marker_pdf_page,1);
  assert.equal(row.original_scored_points,2);
  assert.equal(row.article9_exam_question_text_only,true);
  assert.equal(row.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
  assert.equal(row.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(row.teacher_answer_authenticated,false);
  assert.equal(row.science_unique_answer_final_approved,false);
  assert.equal(row.operator_public_admission_approved,false);
  assert.equal(row.site_question_bank_admitted,false);
  if(row.primary_canonical_kp_id_proposed)assert.ok(kpSet.has(row.primary_canonical_kp_id_proposed));
  if(row.cross_semester_kp_id_proposed)assert.ok(kpSet.has(row.cross_semester_kp_id_proposed));
 }
});
test("Science review distinguishes laser MC003 multi-false hold from provisional 18 science passes",()=>{
 assert.equal(review.model_science_preliminary_pass,18);
 assert.equal(review.model_science_hold,1);
 assert.deepEqual(review.hold_source_ids,["SCI_G04_S1_114_FINAL_004|S02|MC|003"]);
 const held=review.original_question_reviews.find(x=>x.source_id===review.hold_source_ids[0]);
 assert.equal(held.model_provisional_answer,null);
 assert.ok(held.science_reason.includes("①")&&held.science_reason.includes("②"));
 assert.equal(src.source_science_hold_count,1);
 assert.equal(src.source_science_model_preliminary_pass_count,18);
 assert.deepEqual(review.kp_secondpass_count,{KP_STRONG_CANDIDATE:11,KP_REVIEW:3,KP_NONMATCH_G04S1:5});
 assert.equal(review.kp_strong_and_model_science_pass_count,10);
 assert.equal(review.formally_teacher_key_authenticated_count,0);
 assert.equal(review.formal_science_approved_count,0);
 assert.equal(review.formal_kp_approved_count,0);
 assert.equal(review.operator_public_learner_admission_count,0);
});
test("Cross-paper identical text retains per-paper answers and re-ordered options; coal millions-years differs from faulty centuries",()=>{
 const links=review.cross_exam_original_stem_links;
 assert.equal(links.length,4);
 assert.ok(links.every(x=>x.source_id.includes("|S02|MC|")));
 assert.ok(src.original_question_records.filter(x=>x.question_type==="TRUE_FALSE").every(x=>x.original_same_or_similar_stem_source_links.length===0));
 assert.equal(links.filter(x=>x.links[0].relation==="SAME_STEM_CHOICES_REORDERED").length,2);
 assert.equal(links.filter(x=>x.links[0].relation==="SAME_STEM_SAME_OPTIONS").length,1);
 assert.equal(links.filter(x=>x.links[0].relation==="NEAR_DUPLICATE_DIFFERENT_SCIENCE_VALIDITY").length,1);
 assert.equal(review.original_question_reviews.find(x=>x.source_id.endsWith("|MC|002")).model_provisional_answer,"④");
 assert.equal(review.original_question_reviews.find(x=>x.source_id.endsWith("|MC|006")).model_provisional_answer,"①");
 assert.equal(review.original_question_reviews.find(x=>x.source_id.endsWith("|MC|009")).model_provisional_answer,"①");
 assert.equal(review.original_question_reviews.find(x=>x.source_id.endsWith("|MC|010")).model_provisional_answer,"③");
 assert.ok(src.original_question_records.find(x=>x.source_id.endsWith("|MC|009")).full_original_options_in_order[2].text.includes("數百萬年"));
});
test("Art9 original stems enter source-only GitHub; still fail closed at scientific/KP/25-paper student-exam gate",()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 assert.equal(src.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(src.original_teacher_answer_text_excluded,true);
 assert.equal(src.school_official_exact_question_download_url_verified,false);
 for(const row of src.original_question_records){
   const candidate={...src,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,
     source_page_pdf_1_based:1,review_status:"ARCHIVED_SOURCE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",
     answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,
     mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,
     source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
   const verdict=certificationGate(candidate,auth);
   assert.equal(verdict.allowed,false);
   assert.ok(verdict.reasons.includes("ANSWER_UNVERIFIED"));
   assert.ok(verdict.reasons.includes("KP_REVIEW_PENDING"));
   assert.ok(verdict.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
});
test("Cumulative 77+19=96 source occurrences, science 88+8, 25-paper frozen 1623, live site 251/53 unchanged",()=>{
 assert.equal(predecessor.cumulative_original_source_question_occurrences,77);
 assert.equal(corpus.cumulative_original_source_question_occurrences,96);
 assert.equal(corpus.total_true_false,44);
 assert.equal(corpus.total_single_choice,52);
 assert.equal(corpus.original_single_choice_options,208);
 assert.equal(corpus.science_model_preliminary_pass,88);
 assert.equal(corpus.science_hold,8);
 assert.equal(corpus.current_public_source_paper_count,5);
 assert.equal(corpus.current_public_source_archive_files.length,5);
 assert.equal(corpus.site_question_bank_new_admissions,0);
 assert.equal(corpus.existing_live_bank_total_answer_positions,251);
 assert.equal(corpus.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(corpus.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
 assert.equal(corpus.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_exact_standalone_private_completed,96);
 assert.equal(queue.science_model_reviewed_original_standalone_items,96);
 assert.equal(queue.model_science_no_obvious_problem,88);
 assert.equal(queue.model_science_hold,8);
 assert.equal(queue.source_paper_queue.reduce((n,p)=>n+p.full_complete_standalone_tf_mc_private_source_count,0),96);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
});
