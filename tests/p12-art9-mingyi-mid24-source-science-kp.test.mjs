import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isExamQuestionReuseEligible,certificationGate} from "../site/assets/js/s3-admission.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const s=get("data/source-archive/p12-art9-114-mingyi-g04s1-mid24-original-questions-v1.json");
const q=get("data/review/p12-art9-114-mingyi-mid24-science-kp-secondpass-v1.json");
const frozen=get("data/review/p12-g04s1-114-kanghsuan-mingyi-mid-39-source-kp-first-v1.json");
const idx=get("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v8.json");
const queue=get("data/review/p12-standalone-all25-source-first-queue-v1.json");
const auth=get("site/data/authority/science-g03-g04-selector-v2.json");
const kp=new Set(auth.units.flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
const id="SCI_G04_S1_114_MID_007";
test("Mingyi binary source SHA and 39-position frozen paper; exact 12TF plus 12MC text",()=>{
 assert.equal(s.source_paper_id,id);
 assert.equal(s.source_school,"花蓮縣花蓮市明義國民小學");
 assert.equal(s.original_pdf_sha256,frozen.source_exact_original_pdf_sha256);
 assert.equal(s.original_pdf_sha256,"65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6");
 assert.equal(s.original_raw_pdf_size_bytes,322600);
 assert.deepEqual(s.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(s.original_full_paper_answer_positions_frozen,39);
 assert.equal(s.original_full_paper_scored_points_frozen,100);
 assert.equal(s.source_archived_count,24);
 assert.deepEqual([s.true_false,s.four_option_choice],[12,12]);
 const ids=frozen.items.filter(x=>x.source_slot_id.includes("|S01|TF|")||x.source_slot_id.includes("|S02|MC|")).map(x=>x.source_slot_id);
 assert.deepEqual(s.original_question_records.map(x=>x.source_id),ids);
 assert.equal(s.original_question_records.reduce((n,x)=>n+x.full_original_options_in_order.length,0),48);
});
test("Printed full original words, four options, scores and 24 PDF answer-marker bboxes; no figure dependency",()=>{
 for(let i=0;i<24;i++){
  const r=s.original_question_records[i],tf=i<12,n=tf?i+1:i-11;
  assert.equal(r.source_id,id+"|"+(tf?"S01|TF|":"S02|MC|")+String(n).padStart(3,"0"));
  assert.equal(r.original_scored_points,tf?2:3);
  assert.deepEqual(r.source_pdf_pages,[1]);
  assert.equal(r.answer_marker_pdf_page,1);
  assert.ok(r.full_original_stem.trim().length>=5);
  assert.deepEqual(r.full_original_options_in_order.map(x=>x.label),tf?[]:["①","②","③","④"]);
  const [a,b,c,d]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(a>=54&&a<=444&&c>a&&b>110&&d>b&&d<1020,r.source_id);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(r.teacher_answer_authenticated,false);
  assert.equal(r.science_unique_answer_final_approved,false);
  assert.equal(r.site_question_bank_admitted,false);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kp.has(r.primary_canonical_kp_id_proposed),r.source_id);
 }
 assert.ok(s.original_question_records[14].full_original_stem.includes("土推"));
});
test("Independent conservative model science decisions: seven HOLD, 22 KP strong and two unresolved",()=>{
 assert.equal(s.source_science_model_preliminary_pass_count,17);
 assert.equal(s.source_science_hold_count,7);
 assert.equal(s.original_question_records.filter(x=>x.science_review_status==="MODEL_SCIENCE_PASS").length,17);
 assert.equal(s.original_question_records.filter(x=>x.science_review_status.startsWith("SCIENCE_HOLD")).length,7);
 assert.equal(s.original_question_records.filter(x=>x.kp_review_status==="KP_STRONG_CANDIDATE").length,22);
 assert.equal(s.original_question_records.filter(x=>x.kp_review_status==="KP_REVIEW").length,2);
 assert.equal(q.model_science_preliminary_pass,17);
 assert.equal(q.model_science_hold,7);
 assert.deepEqual(q.hold_tf,[1,2,4,11]);
 assert.deepEqual(q.hold_mc,[3,5,9]);
 assert.equal(Object.keys(q.science_hold_reasons).length,7);
 assert.equal(q.kp_strong_and_science_pass_count,15);
 assert.equal(q.cross_paper_near_duplicates.length,1);
 assert.equal(q.teacher_key_authenticated,0);
 assert.equal(q.site_admissions,0);
});
test("No unauthorized student-site questions and frozen 25-school denominator",()=>{
 assert.equal(isExamQuestionReuseEligible(s),true);
 for(const row of s.original_question_records){
 const c={...s,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,source_page_pdf_1_based:1,review_status:"ARCHIVED_SOURCE_ONLY",admission_status:"ARCHIVED_SOURCE_ONLY",answer_evidence_status:"ANSWER_KEY_NOT_PRESENT",answer_review_verified:false,answer_normalized:null,mapping_status:"KP_UNRESOLVED",primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:"NONE_FOR_THIS_ITEM"};
 const gate=certificationGate(c,auth);
 assert.equal(gate.allowed,false);
 assert.ok(gate.reasons.includes("ANSWER_UNVERIFIED"));
 assert.ok(gate.reasons.includes("KP_REVIEW_PENDING"));
 }
 assert.equal(idx.cumulative_original_source_question_occurrences,199);
 assert.deepEqual([idx.total_true_false,idx.total_single_choice,idx.original_single_choice_options],[94,105,420]);
 assert.deepEqual([idx.science_model_preliminary_pass,idx.science_hold],[180,19]);
 assert.equal(idx.existing_live_bank_total_answer_positions,251);
 assert.equal(idx.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(idx.site_question_bank_new_admissions,0);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_exact_standalone_private_completed,199);
 assert.equal(queue.model_science_no_obvious_problem,180);
 assert.equal(queue.model_science_hold,19);
 assert.equal(queue.source_paper_queue.reduce((n,r)=>n+r.full_complete_standalone_tf_mc_private_source_count,0),199);
 assert.equal(queue.fully_screened_all_25_standalone_papers,0);
});
