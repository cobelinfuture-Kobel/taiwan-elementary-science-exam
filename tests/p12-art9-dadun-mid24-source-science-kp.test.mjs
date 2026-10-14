import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExamQuestionReuseEligible,certificationGate} from "../site/assets/js/s3-admission.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const source=get("data/source-archive/p12-art9-114-dadun-g04s1-mid24-original-questions-v1.json");
const science=get("data/review/p12-art9-114-dadun-mid24-science-kp-secondpass-v1.json");
const frozen=get("data/review/p12-g04s1-114-kanghsuan-dadun-mid-62-source-kp-first-v1.json");
const queue=get("data/review/p12-standalone-all25-source-first-queue-v1.json");
const now=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v5.json");
const previous=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v4.json");
const authority=get("site/data/authority/science-g03-g04-selector-v2.json");
const kpSet=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const rows=source.original_question_records;
const id="SCI_G04_S1_114_MID_004";
const find=(grp,n)=>rows.find(r=>r.source_id===id+"|"+(grp==="TF"?"S01|TF|":"S02|MC|")+String(n).padStart(3,"0"));

test("大墩四上期中2頁原始PDF SourceExact SHA，8 TF+16 MC不拆共用題組",()=>{
 assert.equal(source.source_paper_id,id);
 assert.equal(source.source_school,"臺中市南屯區大墩國民小學");
 assert.equal(source.original_pdf_sha256,"8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104");
 assert.equal(source.original_pdf_sha256,frozen.source_original_pdf_sha256);
 assert.equal(source.original_raw_pdf_size_bytes,308426);
 assert.equal(source.original_pdf_pages,2);
 assert.equal(source.source_original_total_answer_positions_unchanged,62);
 assert.equal(source.source_original_header_inspected,true);
 assert.equal(source.source_pdf_sha256_verified,true);
 assert.equal(source.original_text_transcription_verified_from_pdf,true);
 assert.deepEqual(source.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(source.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.equal(source.source_archived_count,24);
 assert.equal(source.true_false,8);
 assert.equal(source.four_option_choice,16);
 assert.equal(rows.length,24);
 assert.deepEqual(rows.map(r=>r.source_id),frozen.items.filter(r=>r.source_slot_id.startsWith(id+"|S01|TF|")||r.source_slot_id.startsWith(id+"|S02|MC|")).map(r=>r.source_slot_id));
 assert.deepEqual(rows.map(r=>r.source_id),science.original_question_reviews.map(r=>r.source_id));
 assert.equal(new Set(rows.map(r=>r.source_id)).size,24);
 assert.equal(rows.reduce((n,r)=>n+r.full_original_options_in_order.length,0),64);
});
test("24個原文作答括號為真實PDF字元bbox、MC選項按原卷保留而非補正",()=>{
 for(let i=0;i<24;i++){
  const row=rows[i],isTf=i<8;
  assert.equal(row.original_printed_number,i<8?i+1:i-7);
  assert.equal(row.question_type,isTf?"TRUE_FALSE":"SINGLE_CHOICE");
  assert.equal(row.original_scored_points,2);
  assert.deepEqual(row.source_pdf_pages,[1]);
  assert.equal(row.answer_marker_pdf_page,1);
  assert.ok(typeof row.full_original_stem==="string"&&row.full_original_stem.length>12);
  assert.equal(row.full_original_options_in_order.length,isTf?0:4);
  const coords=row.answer_marker_pdf_bbox_pts_top_left;
  assert.equal(coords.length,4);
  const [x0,y0,x1,y1]=coords;
  assert.ok(x1>x0&&y1>y0&&y0>90&&y1<1032&&x0>30&&x1<730,row.source_id);
  assert.ok(row.full_original_options_in_order.every(c=>c.text.length>0));
  assert.equal(row.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(row.third_party_content_in_this_item,"NONE_IDENTIFIED_TEXT_ONLY");
  assert.equal(row.teacher_answer_authenticated,false);
  assert.equal(row.science_unique_answer_final_approved,false);
  assert.equal(row.operator_public_admission_approved,false);
  assert.equal(row.site_question_bank_admitted,false);
  if(row.primary_canonical_kp_id_proposed)assert.ok(kpSet.has(row.primary_canonical_kp_id_proposed),row.source_id);
 }
 assert.ok(find("TF",3).full_original_stem.includes("從土推上方澆水"));
 assert.equal(find("TF",3).original_source_print_anomaly,"PRINTED_TYPO_TU_TUI_NOT_TU_DUI");
 assert.deepEqual(find("MC",9).full_original_options_in_order.map(x=>x.label),["①","②","②","④"]);
 assert.deepEqual(find("MC",9).full_original_options_in_order.map(x=>x.text),["海洋","河流","池塘","草原"]);
 assert.equal(find("MC",9).source_print_review_status,"SOURCE_HOLD_DUPLICATE_OPTION_LABEL");
 for(let n=1;n<=16;n++)if(n!==9)assert.deepEqual(find("MC",n).full_original_options_in_order.map(x=>x.label),["①","②","③","④"]);
});
test("科學模型HOLD土壤非單一粒徑 + 獨立印刷選項碰撞HOLD，兩者不得混成一項",()=>{
 assert.equal(science.independent_model_science_provisional_pass,23);
 assert.equal(science.model_science_hold,1);
 assert.equal(science.source_print_choice_label_hold,1);
 assert.equal(science.science_and_source_print_pass_count,22);
 assert.deepEqual(science.science_hold_source_ids,[id+"|S02|MC|001"]);
 assert.deepEqual(science.source_print_hold_source_ids,[id+"|S02|MC|009"]);
 assert.deepEqual(science.source_print_typo_source_ids,[id+"|S01|TF|003"]);
 assert.equal(science.original_question_reviews.find(r=>r.source_id===id+"|S02|MC|001").model_provisional_answer,null);
 assert.equal(science.original_question_reviews.find(r=>r.source_id===id+"|S02|MC|009").model_provisional_answer,"④");
 assert.equal(source.source_science_hold_count,1);
 assert.equal(source.source_print_label_hold_count,1);
 assert.deepEqual(science.kp_secondpass_count,{KP_STRONG_CANDIDATE:21,KP_REVIEW:3,KP_NONMATCH_G04S1:0});
 assert.equal(science.kp_strong_and_science_pass_count,20);
 assert.equal(science.kp_strong_and_science_and_source_print_pass_count,19);
 assert.equal(science.teacher_answer_key_authenticated_count,0);
 assert.equal(science.formal_science_acceptance_count,0);
 assert.equal(science.formal_kp_approval_count,0);
 assert.equal(science.operator_public_learner_admission_count,0);
});
test("Article 9 原題來源公開並不代表正式抽題資格，source-only無答案或KP驗收禁止",()=>{
 assert.equal(isExamQuestionReuseEligible(source),true);
 assert.equal(source.regulated_exam_identity_verified,true);
 assert.equal(source.public_material_scope,"EXAM_QUESTION_TEXT_ONLY");
 assert.equal(source.original_teacher_answer_text_excluded,true);
 assert.equal(source.school_official_exact_question_download_url_verified,false);
 for(const r of rows){
  const candidate={...source,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,
     source_page_pdf_1_based:1,review_status:"SOURCE_ARCHIVED",admission_status:"ARCHIVED_SOURCE_ONLY",
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
test("原卷來源累積96→120；52TF、68MC、272個原選項；251/53網站數不變",()=>{
 assert.equal(previous.cumulative_original_source_question_occurrences,96);
 assert.equal(now.cumulative_original_source_question_occurrences,120);
 assert.deepEqual([now.total_true_false,now.total_single_choice,now.original_single_choice_options],[52,68,272]);
 assert.equal(now.science_model_preliminary_pass,111);
 assert.equal(now.science_hold,9);
 assert.equal(now.source_print_duplicate_choice_label_hold_total,1);
 assert.equal(now.current_public_source_paper_count,6);
 assert.equal(now.current_public_source_archive_files.length,6);
 assert.equal(now.site_question_bank_new_admissions,0);
 assert.equal(now.existing_live_bank_total_answer_positions,251);
 assert.equal(now.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(now.source_position_frozen_all25_total,1623);
 assert.equal(now.all_114_25_exams_must_screen_before_final_public_practice_admission,true);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_exact_standalone_private_completed,120);
 assert.equal(queue.science_model_reviewed_original_standalone_items,120);
 assert.equal(queue.model_science_no_obvious_problem,111);
 assert.equal(queue.model_science_hold,9);
 assert.equal(queue.source_paper_queue.reduce((sum,p)=>sum+p.full_complete_standalone_tf_mc_private_source_count,0),120);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
});
