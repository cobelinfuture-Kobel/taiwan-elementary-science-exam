import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-puren-g04s1-final18-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-puren-final18-science-kp-visual-v1.json');
const fm=load('data/review/p12-g04s1-114-kanghsuan-puren-final-49-source-map-v1.json');
const v23=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v23.json');
const v24=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v24.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const auth=load('site/data/authority/science-g03-g04-selector-v2.json');
const id='SCI_G04_S1_114_FINAL_010';
const kps=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B23 exact three-page original source scan identity SHA and frozen 49 printed positions',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'桃園市普仁國民小學');
 assert.equal(src.original_pdf_sha256,'2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690');
 assert.equal(src.original_pdf_sha256,fm.source_pdf_sha256);
 assert.equal(src.original_pdf_pages,3);
 assert.equal(src.original_raw_pdf_size_bytes,1335789);
 assert.deepEqual(src.source_pdf_visual_reviewed_pages,[1,2,3]);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_full_paper_response_positions_frozen,49);
 assert.equal(fm.source_positions,49);
 assert.equal(src.original_printed_section_total_points,100);
 assert.equal(src.source_pdf_text_layer_available,false);
 assert.equal(src.native_text_glyph_bboxes_available,false);
 assert.equal(src.source_answer_marker_bboxes_status,'RASTER_ESTIMATES_NEED_PIXEL_EXACT_REVIEW');
});
test('B23 6-point source map score misattribution held; do not manufacture score or overwrite frozen source',()=>{
 assert.equal(fm.source_original_score_section_parity_verified,true);
 assert.equal(fm.items.reduce((n,r)=>n+r.score_points,0),100);
 assert.equal(src.original_source_visually_verified_position_points,94);
 assert.equal(src.source_score_points_unreconciled_visually,6);
 assert.equal(src.source_score_position_parity_visually_certified,false);
 assert.equal(src.original_page2_s3_g05_individual_printed_score,1);
 assert.equal(src.frozen_source_map_s3_g05_individual_score,2);
 assert.equal(fm.items.filter(r=>r.source_slot_id.includes('|S3|G05|')).length,6);
 assert.equal(qa.source_score_conflict.original_six_answer_positions,6);
 assert.equal(qa.source_score_conflict.visually_attributable_section_points,40);
 assert.equal(qa.source_score_conflict.printed_section_total,46);
 assert.equal(qa.source_score_conflict.no_frozen_map_mutation,true);
 assert.deepEqual([src.source_original_scored_points_archived,src.source_deferred_scored_points_visually,src.source_deferred_score_gap_unreconciled],[36,58,6]);
});
test('B23 original complete standalone 7 TF+7 MC+4 TF, 31 graphic-dependent deferred with verified frozen lineage',()=>{
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[18,11,7,28]);
 assert.equal(src.original_question_records.length,18);
 assert.equal(src.original_question_records.reduce((n,x)=>n+x.original_scored_points,0),36);
 assert.equal(src.source_deferred_figure_shared_stimulus_positions,31);
 assert.equal(src.source_deferred_sections.reduce((n,x)=>n+x.answer_positions,0),31);
 assert.equal(src.source_deferred_sections.reduce((n,x)=>n+x.original_attributable_points,0),58);
 const ids=new Set(),frozen=new Map(fm.items.map(x=>[x.source_slot_id,x]));
 const groups={};
 for(const x of src.original_question_records){
  assert.ok(!ids.has(x.source_id),x.source_id);ids.add(x.source_id);
  const old=frozen.get(x.source_id);assert.ok(old,x.source_id);
  assert.equal(x.original_scored_points,old.score_points);
  assert.equal(x.answer_marker_pdf_page,old.source_page);
  assert.deepEqual(x.source_pdf_pages,[x.answer_marker_pdf_page]);
  assert.ok(x.standalone_without_shared_figure_or_stimulus);
  assert.ok(x.original_item_stem.length>=10,x.source_id);
  assert.equal(x.full_original_options_in_order.length,x.section==='S2'?4:0);
  assert.deepEqual(x.full_original_options_in_order.map(c=>c.label),x.section==='S2'?['①','②','③','④']:[]);
  assert.equal(x.answer_marker_pdf_bbox_type,'RASTER_ESTIMATE_NOT_NATIVE_GLYPH');
  const [x0,y0,x1,y1]=x.answer_marker_pdf_bbox_pts_upright_visual_estimate;
  assert.ok(x0>0&&x1>x0&&x1<728.5&&y0>0&&y1>y0&&y1<1031.8,x.source_id);
  assert.equal(x.source_firstpass_kp_decision,old.kp_first_decision);
  if(x.primary_canonical_kp_id_proposed)assert.ok(kps.has(x.primary_canonical_kp_id_proposed),x.source_id);
  if(x.section==='S3')assert.equal(x.full_original_stem,x.original_parent_prompt+'\n'+x.original_item_stem);
  assert.equal(x.site_question_bank_admitted,false);
  const key=x.source_id.split('|').slice(1,3).join('|');groups[key]=(groups[key]||0)+1;
 }
 assert.equal(ids.size,18);
 assert.deepEqual(groups,{'S1|TF':7,'S2|MC':7,'S3|G04':4});
 assert.ok(!ids.has(id+'|S1|TF|008'));
 assert.ok(!ids.has(id+'|S2|MC|008'));
 assert.equal(src.original_question_records.some(x=>x.answer_marker_pdf_page===3),false);
});
test('B23 Science16 model pass, two ambiguous holds, KP18 strong without teacher or site approval',()=>{
 assert.equal(qa.original_question_reviews.length,18);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[16,2]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S1|TF|003',id+'|S2|MC|002']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:18,KP_REVIEW:0,KP_NONMATCH_G04S1:0});
 assert.equal(qa.kp_strong_and_science_pass_count,16);
 for(const [i,x] of src.original_question_records.entries()){
  const y=qa.original_question_reviews[i];assert.equal(x.source_id,y.source_id);
  assert.equal(y.science_review_status,x.science_review_status);
  assert.deepEqual(y.answer_marker_pdf_bbox_pts_upright_visual_estimate,x.answer_marker_pdf_bbox_pts_upright_visual_estimate);
  assert.ok(y.model_science_reason.length>=12);
  if(y.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(y.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE','①','②','③','④'].includes(y.model_provisional_answer),x.source_id);
  assert.equal(y.site_admitted,false);
 }
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
});
test('B23 original source normalization 0 exact and two lexical-near pairs against prior699',()=>{
 assert.deepEqual(qa.normalized_exact_stem_matches_prior699,[]);
 assert.deepEqual(qa.cross_paper_lexical_near_nonexact_matches_prior699,[{source_id:id+'|S2|MC|004',prior_source_id:'SCI_G04_S1_114_FINAL_003|S02|MC|005',lexical_bigram_jaccard:0.6667},{source_id:id+'|S2|MC|004',prior_source_id:'SCI_G04_S1_114_FINAL_009|S2|MC|003',lexical_bigram_jaccard:0.5294}]);
});
test('B23 source-only Article9 remains outside teacher-key KP and learner admission gate',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const x of src.original_question_records){
  const row={...src,candidate_id:x.source_id,source_id:x.source_id,question_type:x.question_type,raw_question_text:x.full_original_stem,source_page_pdf_1_based:x.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:false,assets_complete:false,image_dependency:'SOURCE_SCANNED_RASTER_BBOX_EXACT_ACCEPTANCE_PENDING'};
  const gate=certificationGate(row,auth);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('DEPENDENCIES_INCOMPLETE'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('P12 v24 completes first-pass all25 sources 717 occurrences while frozen positions and learner site remain unchanged',()=>{
 assert.equal(v23.cumulative_original_source_question_occurrences,699);
 assert.deepEqual([v24.cumulative_original_source_question_occurrences,v24.total_true_false,v24.total_single_choice,v24.original_single_choice_options],[717,426,291,1164]);
 assert.deepEqual([v24.science_model_preliminary_pass,v24.science_hold],[644,73]);
 assert.equal(v24.current_public_source_paper_count,25);
 assert.equal(v24.current_public_source_archive_files.length,25);
 assert.equal(v24.full_standalone_initial_text_screened_source_papers,25);
 assert.equal(v24.remaining_source_papers_without_standalone_text_screen,0);
 assert.equal(v24.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.equal(queue.source_exact_standalone_private_completed,717);
 assert.equal(queue.science_model_reviewed_original_standalone_items,717);
 assert.deepEqual([queue.model_science_no_obvious_problem,queue.model_science_hold],[644,73]);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),717);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
 assert.equal(queue.first_pass_all25_completed,true);
 assert.equal(queue.first_pass_all25_operator_final_acceptance,false);
 assert.deepEqual([v24.existing_live_bank_total_answer_positions,v24.existing_live_bank_g04s1_answer_positions,v24.site_question_bank_new_admissions],[251,53,0]);
});
