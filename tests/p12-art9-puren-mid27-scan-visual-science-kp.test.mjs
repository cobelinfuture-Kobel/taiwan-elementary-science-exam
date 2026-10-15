import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-puren-g04s1-mid27-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-puren-mid27-science-kp-visual-v1.json');
const frozen=load('data/review/p12-g04s1-114-kanghsuan-puren-mid-54-source-map-v1.json');
const authority=load('site/data/authority/science-g03-g04-selector-v2.json');
const v22=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v22.json');
const v23=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v23.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const id='SCI_G04_S1_114_MID_009';
const kpids=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B22 authentic original 114 Kanghsuan 普仁 mid scan 2 pages, score 96/100 not falsely reconciled',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'桃園市普仁國民小學');
 assert.equal(src.original_pdf_sha256,'6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351');
 assert.equal(src.original_pdf_sha256,frozen.source_exact_pdf_sha256);
 assert.equal(src.original_raw_pdf_size_bytes,1166576);
 assert.equal(src.original_pdf_pages,2);
 assert.deepEqual(src.original_pdf_visual_reviewed_pages,[1,2]);
 assert.equal(src.source_pdf_text_layer_available,false);
 assert.equal(src.native_text_glyph_bboxes_available,false);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_full_paper_response_positions_frozen,54);
 assert.equal(src.original_full_paper_scored_points_printed,100);
 assert.equal(src.source_original_position_points_attributable,96);
 assert.equal(src.unreconciled_source_points,4);
 assert.equal(frozen.source_identified_positions,54);
 assert.equal(frozen.source_score_to_position_gap_points,4);
 assert.equal(frozen.source_parity_certified,false);
 assert.equal(src.source_answer_marker_bboxes_status,'RASTER_ESTIMATES_REQUIRE_MANUAL_PIXEL_EXACT_ACCEPTANCE');
});
test('B22 15 independent original MC with all choices + 12 source true/false; diagram/shared 27 separately held',()=>{
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[27,12,15,60]);
 assert.equal(src.original_question_records.length,27);
 assert.equal(src.source_scored_points_archived,42);
 assert.equal(src.source_scored_points_deferred_identified,54);
 assert.equal(src.source_scored_points_unreconciled,4);
 assert.equal(src.original_question_records.reduce((n,x)=>n+x.original_scored_points,0),42);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,27);
 assert.deepEqual(src.source_deferred_sections.map(x=>x.answer_positions),[19,5,3]);
 const ids=new Set(),map=new Map(frozen.items.map(x=>[x.source_slot_id,x])),group={};
 for(const q of src.original_question_records){
  assert.ok(!ids.has(q.source_id),q.source_id);ids.add(q.source_id);
  const old=map.get(q.source_id);assert.ok(old,q.source_id);
  assert.equal(q.original_scored_points,old.source_printed_score_points,q.source_id);
  assert.equal(q.answer_marker_pdf_page,old.source_original_pdf_page,q.source_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.ok(q.original_item_stem.trim().length>3,q.source_id);
  assert.deepEqual(q.full_original_options_in_order.map(x=>x.label),q.section==='S1'?['①','②','③','④']:[]);
  assert.deepEqual(q.source_pdf_pages,[q.answer_marker_pdf_page]);
  assert.equal(q.answer_marker_pdf_bbox_type,'RASTER_ESTIMATE_NOT_NATIVE_GLYPH');
  const [x0,y0,x1,y1]=q.answer_marker_pdf_bbox_pts_upright_visual_estimate;
  assert.ok(x0>=20&&x1>x0&&x1<728.5&&y0>15&&y1>y0&&y1<1031.8,q.source_id);
  if(q.section==='S3')assert.equal(q.full_original_stem,q.original_parent_prompt+'\n'+q.original_item_stem);
  if(q.primary_canonical_kp_id_proposed)assert.ok(kpids.has(q.primary_canonical_kp_id_proposed),q.source_id);
  assert.equal(q.teacher_answer_authenticated,false);
  assert.equal(q.site_question_bank_admitted,false);
  const groupkey=q.source_id.split('|').slice(1,3).join('|');group[groupkey]=(group[groupkey]||0)+1;
 }
 assert.deepEqual(group,{'S1|MC':15,'S3|G01':6,'S3|G02':6});
 assert.equal(ids.size,27);
});
test('B22 six floating plant statements visibly incompatible with frozen submerged KP; provenance preserved and review gated',()=>{
 const affected=src.original_question_records.filter(x=>x.source_id.includes('|S3|G02|'));
 assert.equal(affected.length,6);
 assert.equal(src.frozen_firstpass_submerged_floating_kp_mismatch_requiring_review,6);
 for(const q of affected){
  assert.ok(q.original_parent_prompt.includes('漂浮性水生植物'));
  assert.deepEqual(q.source_firstpass_kp_ids_preserved,['sci_g04s1_02_05']);
  assert.deepEqual(q.canonical_kp_ids_proposed,['sci_g04s1_02_04']);
  assert.equal(q.kp_review_status,'KP_REVIEW');
  assert.ok(q.source_kp_firstpass_mismatch);
 }
 assert.equal(qa.source_kp_authority_family_correction.affected_original_positions,6);
 assert.equal(qa.source_kp_authority_family_correction.status,'HUMAN_REVIEW_KP_REQUIRED_NO_AUTHORITY_MUTATION');
});
test('B22 model Science 26 provisional pass and MC10 two-wrong-answer HOLD; KP21 strong 6 review',()=>{
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[26,1]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S1|MC|010']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:21,KP_REVIEW:6,KP_NONMATCH_G04S1:0});
 assert.equal(qa.kp_strong_and_science_pass_count,20);
 assert.equal(qa.original_question_reviews.length,27);
 for(const [i,r] of src.original_question_records.entries()){
  const z=qa.original_question_reviews[i];
  assert.equal(z.source_id,r.source_id);
  assert.equal(z.science_review_status,r.science_review_status);
  assert.deepEqual(z.answer_marker_pdf_bbox_pts_upright_visual_estimate,r.answer_marker_pdf_bbox_pts_upright_visual_estimate);
  assert.ok(z.model_science_reason.length>=8,z.source_id);
  if(z.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(z.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE','①','②','③','④'].includes(z.model_provisional_answer));
  assert.equal(z.site_admitted,false);
 }
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
});
test('B22 exact one cross-school stem link and one nonexact lexical near, each original source distinct',()=>{
 assert.deepEqual(qa.normalized_exact_stem_matches_prior672,[{source_id:id+'|S1|MC|004',prior_source_id:'SCI_G04_S1_114_MID_008|S02|MC|012'}]);
 assert.deepEqual(qa.cross_paper_lexical_near_nonexact_matches_prior672,[{source_id:id+'|S1|MC|010',prior_source_id:'SCI_G04_S1_114_MID_008|S02|MC|011',lexical_bigram_jaccard:0.7647}]);
 assert.equal(v23.new_source_paper.original_school_source_occurrences_not_deduplicated,true);
});
test('B22 Article9 original scan records never bypass teacher-key, KP and operator learner-site gates',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const row={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:false,assets_complete:false,image_dependency:'SCANNED_RASTER_BBOX_PIXEL_ACCEPTANCE_PENDING'};
  const gate=certificationGate(row,authority);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('DEPENDENCIES_INCOMPLETE'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B22 additive v23 source 699/24 papers, retained all25/1623 original slots and unchanged learner bank',()=>{
 assert.equal(v22.cumulative_original_source_question_occurrences,672);
 assert.deepEqual([v23.cumulative_original_source_question_occurrences,v23.total_true_false,v23.total_single_choice,v23.original_single_choice_options],[699,415,284,1136]);
 assert.deepEqual([v23.science_model_preliminary_pass,v23.science_hold],[628,71]);
 assert.equal(v23.current_public_source_paper_count,24);
 assert.equal(v23.current_public_source_archive_files.length,24);
 assert.equal(v23.full_standalone_initial_text_screened_source_papers,24);
 assert.equal(v23.remaining_source_papers_without_standalone_text_screen,1);
 assert.equal(v23.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.ok(queue.source_exact_standalone_private_completed>=699);
 assert.ok(queue.model_science_no_obvious_problem>=628);assert.ok(queue.model_science_hold>=71);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),queue.source_exact_standalone_private_completed);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
 assert.deepEqual([v23.existing_live_bank_total_answer_positions,v23.existing_live_bank_g04s1_answer_positions,v23.site_question_bank_new_admissions],[251,53,0]);
});
