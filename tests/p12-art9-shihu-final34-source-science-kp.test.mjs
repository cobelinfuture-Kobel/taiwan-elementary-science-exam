import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-shihu-g04s1-final34-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-shihu-final34-science-kp-secondpass-v1.json');
const frozen=load('data/review/p12-g04s1-114-hanlin-shihu-final-62-source-map-v1.json');
const v19=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v19.json');
const v20=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v20.json');
const q=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const auth=load('site/data/authority/science-g03-g04-selector-v2.json');
const id='SCI_G04_S1_114_FINAL_013';
const kpIds=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B19 original 高雄獅湖 identity and unaltered 62-slot 97/100 score discrepancy',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'高雄市三民區獅湖國民小學');
 assert.equal(src.original_school_character_verified,'獅湖_NOT_石湖');
 assert.equal(src.original_pdf_sha256,frozen.source_pdf_sha256);
 assert.equal(src.original_pdf_sha256,'f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764');
 assert.equal(src.original_raw_pdf_size_bytes,387034);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(src.original_full_paper_answer_positions_frozen,62);
 assert.equal(src.original_full_paper_scored_points_printed,100);
 assert.equal(src.source_score_points_attributable_frozen,97);
 assert.equal(src.source_score_points_unreconciled_frozen,3);
 assert.equal(src.source_score_parity_certified,false);
 assert.equal(frozen.source_answer_positions,62);
 assert.equal(frozen.unreconciled_score_points,3);
 assert.equal(frozen.source_score_parity_certified,false);
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[34,24,10,40]);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,28);
 assert.deepEqual(src.source_deferred_sections.map(z=>z.answer_positions),[1,15,8,4]);
 assert.equal(src.original_question_records.reduce((n,r)=>n+r.original_scored_points,0),68);
});
test('B19 exact 34 standalone source + native glyph BBoxes; 1 original reflection diagram excluded',()=>{
 const map=new Map(frozen.items.map(z=>[z.source_slot_id,z]));
 assert.equal(src.original_question_records.length,34);
 const ids=new Set();
 for(const r of src.original_question_records){
  assert.ok(map.has(r.source_id),r.source_id);
  assert.ok(!ids.has(r.source_id),r.source_id);ids.add(r.source_id);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(r.original_scored_points,2);
  assert.ok(r.original_item_stem.trim().length>8);
  assert.equal(r.full_original_options_in_order.length,r.question_type==='SINGLE_CHOICE'?4:0);
  assert.deepEqual(r.full_original_options_in_order.map(o=>o.label),r.question_type==='SINGLE_CHOICE'?['①','②','③','④']:[]);
  assert.deepEqual(r.source_pdf_pages,[r.answer_marker_pdf_page]);
  const [x0,y0,x1,y1]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>25&&x1>x0&&x1<728.64&&y0>20&&y1>y0&&y1<1032,r.source_id);
  if(r.section==='S1'||r.section==='S2')assert.equal(r.answer_marker_pdf_page,1);
  if(r.section==='S4')assert.equal(r.answer_marker_pdf_page,2);
  if(r.section==='S4')assert.equal(r.full_original_stem,r.original_parent_prompt+'\n'+r.original_item_stem);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kpIds.has(r.primary_canonical_kp_id_proposed),r.source_id);
  assert.equal(r.teacher_answer_authenticated,false);assert.equal(r.site_question_bank_admitted,false);
 }
 assert.equal(ids.size,34);
 assert.deepEqual([src.original_question_records.filter(z=>z.section==='S1').length,src.original_question_records.filter(z=>z.section==='S2').length,src.original_question_records.filter(z=>z.section==='S4').length],[10,10,14]);
 assert.ok(!ids.has(id+'|S1|TF|008'));
 assert.ok(!src.original_question_records.some(z=>z.section==='S3'||z.section==='S5'||z.section==='S6'));
});
test('B19 Science 33/1, KP 17/2/15 and independent original-source duplicate evidence',()=>{
 assert.equal(qa.original_question_reviews.length,34);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[33,1]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S1|TF|003']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:17,KP_REVIEW:2,KP_NONMATCH_G04S1:15});
 assert.equal(qa.kp_strong_and_science_pass_count,16);
 assert.equal(qa.normalized_exact_stem_matches_prior550.length,0);
 assert.deepEqual(qa.cross_paper_lexical_near_matches_prior550,[{source_id:id+'|S1|TF|004',prior_source_id:'SCI_G04_S1_114_FINAL_005|S1|TF|009',lexical_bigram_jaccard:0.6531}]);
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
 for(const [i,r] of src.original_question_records.entries()){
  const z=qa.original_question_reviews[i];assert.equal(z.source_id,r.source_id);
  assert.deepEqual(z.answer_marker_pdf_bbox_pts_top_left,r.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(z.science_review_status,r.science_review_status);
  if(z.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(z.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE','①','②','③','④'].includes(z.model_provisional_answer));
  assert.equal(z.site_admitted,false);
 }
});
test('B19 exact Article9 school question source archive never implies learner site certification',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const c={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(c,auth);
  assert.equal(gate.allowed,false);assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B19 additive v20 source 584, all21 text-layer source papers, 4 image-only pending; all25 slot/source & student bank freeze',()=>{
 assert.equal(v19.cumulative_original_source_question_occurrences,550);
 assert.deepEqual([v20.cumulative_original_source_question_occurrences,v20.total_true_false,v20.total_single_choice,v20.original_single_choice_options],[584,342,242,968]);
 assert.deepEqual([v20.science_model_preliminary_pass,v20.science_hold],[525,59]);
 assert.equal(v20.current_public_source_paper_count,21);
 assert.equal(v20.current_public_source_archive_files.length,21);
 assert.equal(v20.full_standalone_initial_text_screened_source_papers,21);
 assert.equal(v20.remaining_source_papers_without_standalone_text_screen,4);
 assert.equal(v20.source_position_frozen_all25_total,1623);
 assert.equal(v20.existing_live_bank_total_answer_positions,251);
 assert.equal(v20.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(v20.site_question_bank_new_admissions,0);
 assert.equal(q.source_papers_total,25);assert.equal(q.source_response_slots_unchanged,1623);
 assert.ok(q.source_exact_standalone_private_completed>=584);
 assert.ok(q.science_model_reviewed_original_standalone_items>=584);
 assert.ok(q.model_science_no_obvious_problem>=525);assert.ok(q.model_science_hold>=59);
 assert.equal(q.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),q.source_exact_standalone_private_completed);
 assert.equal(q.all25_before_publication_gate_preserved,true);assert.equal(q.public_items_new,0);
});
