import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible, certificationGate} from '../site/assets/js/s3-admission.mjs';
const load = p => JSON.parse(readFileSync(p, 'utf8'));
const src=load('data/source-archive/p12-art9-114-dahua-g04s1-final22-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-dahua-final22-science-kp-secondpass-v1.json');
const frozen=load('data/review/p12-g04s1-114-hanlin-dahua-final-42-source-map-v1.json');
const v17=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v17.json');
const v18=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v18.json');
const q=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const auth=load('site/data/authority/science-g03-g04-selector-v2.json');
const id='SCI_G04_S1_114_FINAL_011',kpIds=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const fullPath='data/source-archive/p12-art9-114-dahua-g04s1-final22-original-questions-v1.json';
test('B17 exact binary provenance, 42 scored original positions and 22 non-figure text originals',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'桃園市蘆竹區大華國小');
 assert.equal(src.original_pdf_sha256,frozen.source_original_pdf_sha256);
 assert.equal(src.original_pdf_sha256,'41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0');
 assert.equal(src.original_raw_pdf_size_bytes,266101);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(src.original_full_paper_answer_positions_frozen,42);
 assert.equal(frozen.original_independent_response_positions,42);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[22,6,16,64]);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,20);
 assert.equal(src.original_question_records.reduce((n,r)=>n+r.original_scored_points,0),44);
 assert.deepEqual(src.source_deferred_sections.map(x=>x.answer_positions),[1,16,3]);
 assert.equal(src.source_deferred_sections[0].question,'MC003');
 assert.equal(src.original_question_records.some(r=>r.source_id===id+'|S2|MC|003'),false);
});
test('B17 complete school text options and exact native PDF answer markers; image-dependent MC003 never promoted',()=>{
 const map=new Map(frozen.items.map(r=>[r.source_slot_id,r]));const seen=new Set();
 for(const r of src.original_question_records){
  assert.ok(map.has(r.source_id),r.source_id);
  assert.ok(!seen.has(r.source_id),r.source_id);seen.add(r.source_id);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.ok(r.full_original_stem.length>=15);
  assert.equal(r.original_scored_points,2);
  assert.deepEqual(r.source_pdf_pages,[r.answer_marker_pdf_page]);
  assert.deepEqual(r.full_original_options_in_order.map(o=>o.label),r.question_type==='TRUE_FALSE'?[]:['①','②','③','④']);
  const [x0,y0,x1,y1]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>40&&x1>x0&&x1<595&&y0>35&&y1>y0&&y1<842,r.source_id);
  if(r.source_id.includes('|S1|'))assert.equal(r.answer_marker_pdf_page,1);
  if(r.source_id.includes('|S2|MC|01')&&r.original_printed_number>=14)assert.equal(r.answer_marker_pdf_page,2);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kpIds.has(r.primary_canonical_kp_id_proposed),r.source_id);
  assert.equal(r.teacher_answer_authenticated,false);assert.equal(r.site_question_bank_admitted,false);
 }
 assert.equal(seen.size,22);
 const img=qa.source_figure_dependency_hold_not_archived;
 assert.equal(img.length,1);
 assert.equal(img[0].source_id,id+'|S2|MC|003');
 assert.equal(img[0].original_pdf_answer_marker_page,1);
 assert.ok(img[0].original_pdf_answer_marker_bbox_pts_top_left[0]>40);
});
test('B17 Science 21 prelim passes / 1 ambiguous light source HOLD, KP 11/1/10 and no operator approvals',()=>{
 assert.equal(qa.original_question_reviews.length,22);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[21,1]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S2|MC|016']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:11,KP_REVIEW:1,KP_NONMATCH_G04S1:10});
 assert.equal(qa.kp_strong_and_science_pass_count,10);
 assert.equal(src.original_question_records.filter(r=>r.science_review_status==='MODEL_SCIENCE_PASS').length,21);
 assert.equal(src.original_question_records.filter(r=>r.science_review_status==='MODEL_SCIENCE_HOLD').length,1);
 assert.equal(qa.normalized_exact_stem_matches_prior468.length,0);
 assert.equal(qa.cross_paper_lexical_near_matches_prior468.length,0);
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
 for(const [i,r] of src.original_question_records.entries()){
  assert.equal(r.source_id,qa.original_question_reviews[i].source_id);
  assert.deepEqual(r.answer_marker_pdf_bbox_pts_top_left,qa.original_question_reviews[i].answer_marker_pdf_bbox_pts_top_left);
  assert.equal(qa.original_question_reviews[i].site_admitted,false);
 }
});
test('B17 source archive never bypasses formal answer and KP gate',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const c={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const g=certificationGate(c,auth);
  assert.equal(g.allowed,false);assert.ok(g.reasons.includes('ANSWER_UNVERIFIED'));assert.ok(g.reasons.includes('KP_REVIEW_PENDING'));assert.ok(g.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B17 additive corpus v18 490, 19/25 first screened, 1623 total frozen original scored positions',()=>{
 assert.equal(v17.cumulative_original_source_question_occurrences,468);
 assert.deepEqual([v18.cumulative_original_source_question_occurrences,v18.total_true_false,v18.total_single_choice,v18.original_single_choice_options],[490,258,232,928]);
 assert.deepEqual([v18.science_model_preliminary_pass,v18.science_hold],[436,54]);
 assert.equal(v18.current_public_source_archive_files.length,19);
 assert.ok(v18.current_public_source_archive_files.includes(fullPath));
 assert.equal(v18.current_public_source_paper_count,19);
 assert.equal(v18.remaining_source_papers_without_standalone_text_screen,6);
 assert.equal(v18.source_position_frozen_all25_total,1623);
 assert.equal(v18.existing_live_bank_total_answer_positions,251);
 assert.equal(v18.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(v18.site_question_bank_new_admissions,0);
 assert.equal(q.source_exact_standalone_private_completed,490);
 assert.equal(q.science_model_reviewed_original_standalone_items,490);
 assert.deepEqual([q.model_science_no_obvious_problem,q.model_science_hold],[436,54]);
 assert.equal(q.source_paper_queue.reduce((n,r)=>n+r.full_complete_standalone_tf_mc_private_source_count,0),490);
 assert.equal(q.source_papers_total,25);
 assert.equal(q.source_response_slots_unchanged,1623);
 assert.equal(q.all25_before_publication_gate_preserved,true);
 assert.equal(q.public_items_new,0);
});
