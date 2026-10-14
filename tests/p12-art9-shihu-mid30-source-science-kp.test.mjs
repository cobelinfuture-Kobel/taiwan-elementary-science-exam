import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-shihu-g04s1-mid30-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-shihu-mid30-science-kp-secondpass-v1.json');
const frozen=load('data/review/p12-g04s1-114-hanlin-shihu-mid-60-source-map-v1.json');
const authority=load('site/data/authority/science-g03-g04-selector-v2.json');
const idx=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v17.json');
const prior=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v16.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const id='SCI_G04_S1_114_MID_012';
const kpIds=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('Verified original Kaohsiung 獅湖 (not 石湖) Hanlin 114 MID school PDF identity',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'高雄市獅湖國民小學');
 assert.equal(src.original_school_character_verified,'獅湖_NOT_石湖');
 assert.equal(src.original_pdf_sha256,frozen.source_exact_original_pdf_sha256);
 assert.equal(src.original_pdf_sha256,'92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026');
 assert.equal(src.original_raw_pdf_size_bytes,368755);
 assert.equal(src.original_pdf_pages,3);
 assert.equal(src.original_full_paper_answer_positions_frozen,60);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2,3]);
 assert.equal(frozen.source_answer_positions,60);
 assert.equal(src.source_pdf_sha256_verified,true);
});
test('Full original S1 TF8, S2 MC12, S5 TF10 with four original options and PDF raw-character bbox',()=>{
 const records=src.original_question_records,byId=new Map(frozen.items.map(x=>[x.source_slot_id,x]));
 assert.equal(records.length,30);
 assert.deepEqual([src.true_false,src.four_option_choice,src.original_mc_option_entries],[18,12,48]);
 assert.equal(records.filter(x=>x.section==='S1').length,8);
 assert.equal(records.filter(x=>x.section==='S2').length,12);
 assert.equal(records.filter(x=>x.section==='S5').length,10);
 assert.equal(records.reduce((n,x)=>n+x.full_original_options_in_order.length,0),48);
 assert.equal(records.reduce((n,x)=>n+x.original_scored_points,0),60);
 const used=new Set();
 for(const r of records){
  const f=byId.get(r.source_id);
  assert.ok(f,r.source_id);
  assert.equal(f.source_figure_required,false);
  assert.equal(f.printed_score_points,2);
  assert.equal(f.source_pdf_page,r.answer_marker_pdf_page);
  assert.deepEqual(r.source_pdf_pages,[r.answer_marker_pdf_page]);
  assert.equal(r.original_scored_points,2);
  assert.ok(r.full_original_stem.trim().length>9);
  assert.deepEqual(r.full_original_options_in_order.map(o=>o.label),r.question_type==='TRUE_FALSE'?[]:['①','②','③','④']);
  const [x0,y0,x1,y1]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>40&&x0<595&&x1>x0&&y0>65&&y0<850&&y1>y0&&y1<850,r.source_id);
  if(r.section==='S5')assert.ok(r.full_original_stem.includes(r.original_parent_prompt));
  if(r.primary_canonical_kp_id_proposed)assert.ok(kpIds.has(r.primary_canonical_kp_id_proposed),r.source_id);
  assert.equal(r.teacher_answer_authenticated,false);
  assert.equal(r.site_question_bank_admitted,false);
  used.add(r.source_id);
 }
 assert.equal(used.size,30);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,30);
 assert.ok(src.source_deferred_sections.length>=3);
});
test('Independently reviewed science 29 provisional pass and 1 absolute moon-visibility HOLD, KP 11 strong /4 review/15 nonmatch',()=>{
 assert.equal(qa.original_question_reviews.length,30);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[29,1]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S5|G02|009']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:11,KP_REVIEW:4,KP_NONMATCH_G04S1:15});
 assert.equal(qa.kp_strong_and_science_pass_count,11);
 assert.equal(qa.normalized_exact_stem_matches_prior438.length,0);
 assert.equal(qa.cross_paper_lexical_near_matches_prior438.length,5);
 assert.equal(src.original_question_records.filter(x=>x.science_review_status==='MODEL_SCIENCE_PASS').length,29);
 assert.equal(src.original_question_records.filter(x=>x.kp_review_status==='KP_STRONG_CANDIDATE').length,11);
 assert.equal(src.original_question_records.filter(x=>x.kp_review_status==='KP_REVIEW').length,4);
 assert.equal(src.original_question_records.filter(x=>x.kp_review_status==='KP_NONMATCH_G04S1_ARCHIVE').length,15);
 assert.equal(qa.teacher_key_authenticated_count,0);
 assert.equal(qa.formal_science_approved_count,0);
 assert.equal(qa.formal_kp_approved_count,0);
 assert.equal(qa.operator_site_admitted_count,0);
 for(let i=0;i<30;i++){
  assert.equal(qa.original_question_reviews[i].source_id,src.original_question_records[i].source_id);
  assert.deepEqual(qa.original_question_reviews[i].answer_marker_pdf_bbox_pts_top_left,src.original_question_records[i].answer_marker_pdf_bbox_pts_top_left);
 }
});
test('Article9 original exam source eligibility never substitutes for student answer+KP formal approval',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const x={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(x,authority);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('Source-only v16 438 +30 =468; 25 originals with 1623 positions retained, site 251/53 unchanged',()=>{
 assert.equal(prior.cumulative_original_source_question_occurrences,438);
 assert.deepEqual([idx.cumulative_original_source_question_occurrences,idx.total_true_false,idx.total_single_choice,idx.original_single_choice_options],[468,252,216,864]);
 assert.deepEqual([idx.science_model_preliminary_pass,idx.science_hold],[415,53]);
 assert.equal(idx.current_public_source_paper_count,18);
 assert.equal(idx.current_public_source_archive_files.length,18);
 assert.equal(idx.source_print_duplicate_choice_label_hold_total,2);
 assert.equal(idx.source_position_frozen_all25_total,1623);
 assert.equal(idx.existing_live_bank_total_answer_positions,251);
 assert.equal(idx.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(idx.site_question_bank_new_admissions,0);
 assert.equal(queue.source_papers_total,25);
 assert.ok(queue.source_exact_standalone_private_completed>=468);
 assert.ok(queue.science_model_reviewed_original_standalone_items>=468);
 assert.ok(queue.model_science_no_obvious_problem>=415);
 assert.ok(queue.model_science_hold>=53);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),queue.source_exact_standalone_private_completed);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
});
