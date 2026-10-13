import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { certificationGate,isExamQuestionReuseEligible } from "../site/assets/js/s3-admission.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const source=get("data/source-archive/p12-art9-114-dongguang-g04s1-final19-original-questions-v1.json");
const qa=get("data/review/p12-art9-114-dongguang-final19-science-kp-secondpass-v1.json");
const frozen=get("data/review/p12-g04s1-114-nanyi-dongguang-final-source-visual-v2.json");
const queue=get("data/review/p12-standalone-all25-source-first-queue-v1.json");
const index=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v3.json");
const predecessor=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v2.json");
const authority=get("site/data/authority/science-g03-g04-selector-v2.json");
const canon=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const ids=source.original_question_records.map(r=>r.source_id);
test("東光原始4頁試卷binary SHA 與 frozen V2 source-ID 一致；完整獨立10TF與9MC但排除鏡面附圖MC003",()=>{
 assert.equal(source.source_paper_id,"SCI_G04_S1_114_FINAL_003");
 assert.equal(source.source_school,"基隆市東光國小");
 assert.equal(source.original_pdf_sha256,"147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819");
 assert.equal(source.original_pdf_sha256,frozen.source_pdf_sha256);
 assert.equal(source.original_pdf_pages,4);
 assert.equal(source.original_raw_pdf_size_bytes,672653);
 assert.equal(source.source_pdf_sha256_verified,true);
 assert.deepEqual(source.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(source.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.equal(source.source_archived_count,19);
 assert.deepEqual([source.true_false,source.four_option_choice],[10,9]);
 assert.equal(source.original_question_records.length,19);
 assert.equal(new Set(ids).size,19);
 const frozenFirst20=frozen.items.filter(r=>r.source_slot_id.startsWith("SCI_G04_S1_114_FINAL_003|S01|TF|")||r.source_slot_id.startsWith("SCI_G04_S1_114_FINAL_003|S02|MC|")).map(x=>x.source_slot_id);
 assert.equal(frozenFirst20.length,20);
 assert.deepEqual(ids,frozenFirst20.filter(id=>id!=="SCI_G04_S1_114_FINAL_003|S02|MC|003"));
 assert.deepEqual(source.source_excluded_figure_dependent_mc,["SCI_G04_S1_114_FINAL_003|S02|MC|003"]);
 assert.equal(source.original_question_records.reduce((n,r)=>n+r.full_original_options_in_order.length,0),36);
 assert.deepEqual(ids,qa.original_question_reviews.map(r=>r.source_id));
});
test("文字原題、四選一選項、真實括號bbox及跨頁MC010保留來源完整性",()=>{
 for(const r of source.original_question_records){
   assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(r.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
   assert.ok(typeof r.full_original_stem==="string"&&r.full_original_stem.length>15,r.source_id);
   assert.equal(r.answer_marker_pdf_page,1);
   assert.ok(Array.isArray(r.source_pdf_pages));
   const n=r.question_type==="TRUE_FALSE"?0:4;
   assert.equal(r.full_original_options_in_order.length,n,r.source_id);
   assert.deepEqual(r.full_original_options_in_order.map(x=>x.label),n?["①","②","③","④"]:[]);
   assert.ok(r.full_original_options_in_order.every(x=>typeof x.text==="string"&&x.text.trim()),r.source_id);
   const [x1,y1,x2,y2]=r.answer_marker_pdf_bbox_pts_top_left;
   assert.ok(x1>50&&x1<450&&x2>x1&&x2<500&&y1>140&&y2>y1&&y2<1032,r.source_id);
   assert.deepEqual(r.source_pdf_pages,r.source_id.endsWith("|MC|010")?[1,2]:[1]);
   assert.equal(r.site_question_bank_admitted,false);
   assert.equal(r.operator_public_admission_approved,false);
   assert.equal(r.science_unique_answer_final_approved,false);
   assert.equal(r.teacher_answer_authenticated,false);
   if(r.primary_canonical_kp_id_proposed){
     assert.ok(canon.has(r.primary_canonical_kp_id_proposed));
     assert.ok(r.primary_canonical_kp_id_proposed.startsWith("sci_g04s1_"));
   }
 }
 const mc10=source.original_question_records.find(r=>r.source_id.endsWith("|S02|MC|010"));
 assert.equal(mc10.full_original_options_in_order.length,4);
 assert.equal(mc10.full_original_options_in_order[0].text,"由兩個電池的正極連接負極、負極連接正極");
 assert.equal(mc10.full_original_options_in_order[3].text,"電池並聯時，電力可以持續較久");
 assert.equal(source.original_question_records.find(r=>r.source_id.endsWith("|S01|TF|010")).full_original_stem,"不良導體在電路中除了裝飾美觀以外，沒有其他的用途。");
});
test("2個科學唯一答案瑕疵HOLD、14強KP候選與5KP-review；只為模型初審",()=>{
 assert.equal(qa.model_science_preliminary_pass,17);
 assert.equal(qa.model_science_hold,2);
 assert.equal(qa.kp_secondpass_count.KP_STRONG_CANDIDATE,14);
 assert.equal(qa.kp_secondpass_count.KP_REVIEW,5);
 assert.equal(qa.kp_strong_and_model_science_pass_count,13);
 assert.deepEqual(qa.hold_source_ids,["SCI_G04_S1_114_FINAL_003|S02|MC|002","SCI_G04_S1_114_FINAL_003|S02|MC|008"]);
 for(const id of qa.hold_source_ids){
    assert.equal(qa.original_question_reviews.find(r=>r.source_id===id).model_provisional_answer,null);
    assert.equal(source.original_question_records.find(r=>r.source_id===id).science_review_status,"SCIENCE_HOLD_UNIQUE_ANSWER_UNDERDETERMINED");
 }
 assert.equal(qa.teacher_key_authenticated_count,0);
 assert.equal(qa.formal_kp_approval_count,0);
 assert.equal(qa.formal_science_acceptance_count,0);
 assert.equal(qa.operator_public_learner_admission_count,0);
});
test("Article9 依法考試純文字公開來源與正式學生網站抽題隔離",()=>{
 assert.equal(isExamQuestionReuseEligible(source),true);
 assert.equal(source.regulated_exam_identity_verified,true);
 assert.equal(source.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(source.original_teacher_answer_text_excluded,true);
 assert.equal(source.school_official_exact_question_download_url_verified,false);
 for(const row of source.original_question_records){
   const candidate={...source,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,
     source_page_pdf_1_based:1,review_status:"ARCHIVED_SOURCE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",
     answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,
     mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,
     source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
   const gate=certificationGate(candidate,authority);
   assert.equal(gate.allowed,false);
   assert.ok(gate.reasons.includes("ANSWER_UNVERIFIED"));
   assert.ok(gate.reasons.includes("KP_REVIEW_PENDING"));
   assert.ok(gate.reasons.includes("NOT_CERTIFIED_FOR_PUBLIC"));
 }
});
test("累積58+19=77答題來源；25卷、1623原始作答分母不變，公開網站251/53 unchanged",()=>{
 assert.equal(predecessor.cumulative_original_source_question_occurrences,58);
 assert.equal(index.cumulative_original_source_question_occurrences,77);
 assert.equal(index.total_true_false,36);
 assert.equal(index.total_single_choice,41);
 assert.equal(index.original_single_choice_options,164);
 assert.equal(index.science_model_preliminary_pass,70);
 assert.equal(index.science_hold,7);
 assert.equal(index.current_public_source_paper_count,4);
 assert.equal(index.current_public_source_archive_files.length,4);
 assert.equal(index.site_question_bank_new_admissions,0);
 assert.equal(index.existing_live_bank_total_answer_positions,251);
 assert.equal(index.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(index.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
 assert.equal(index.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.ok(queue.source_exact_standalone_private_completed>=77);
 assert.equal(queue.science_model_reviewed_original_standalone_items,queue.source_exact_standalone_private_completed);
 assert.ok(queue.model_science_no_obvious_problem>=70);
 assert.ok(queue.model_science_hold>=7);
 assert.equal(queue.model_science_hold+queue.model_science_no_obvious_problem,queue.science_model_reviewed_original_standalone_items);
 assert.equal(queue.source_paper_queue.reduce((s,p)=>s+p.full_complete_standalone_tf_mc_private_source_count,0),queue.source_exact_standalone_private_completed);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
});
