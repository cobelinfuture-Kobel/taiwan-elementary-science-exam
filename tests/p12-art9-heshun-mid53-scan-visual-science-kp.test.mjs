import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-heshun-g04s1-mid53-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-heshun-mid53-science-kp-visual-v1.json');
const frozen=load('data/review/p12-g04s1-114-nanyi-heshun-mid-70-source-map-v1.json');
const v20=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v20.json');
const v21=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v21.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const authority=load('site/data/authority/science-g03-g04-selector-v2.json');
const id='SCI_G04_S1_114_MID_002',kpIds=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B20 real original scan-only PDF is 2 sideways image pages, verified frozen 70 positions and 100 points',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'臺南市和順國民小學');
 assert.equal(src.original_pdf_sha256,frozen.source_pdf_sha256);
 assert.equal(src.original_pdf_sha256,'3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f');
 assert.equal(src.original_raw_pdf_size_bytes,1071058);
 assert.equal(src.original_pdf_pages,2);
 assert.deepEqual(src.original_pdf_visual_reviewed_pages,[1,2]);
 assert.equal(src.original_full_paper_response_positions_frozen,70);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.equal(frozen.total_source_response_positions,70);
 assert.equal(frozen.source_printed_total_score,100);
 assert.equal(frozen.score_position_parity_confirmed,true);
 assert.deepEqual(frozen.source_section_response_positions,[12,15,40,3]);
 assert.deepEqual(frozen.source_section_score_totals,[24,30,40,6]);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.source_pdf_text_layer_available,false);
 assert.equal(src.source_pdf_is_scan_only,true);
 assert.equal(src.native_text_glyph_bboxes_available,false);
 assert.equal(src.source_answer_marker_bboxes_status,'VISUAL_ESTIMATES_ONLY_REQUIRE_MANUAL_PIXEL_EXACT_ACCEPTANCE');
});
test('B20 original complete standalone 53 visual transcriptions, four exact MC choices, all print instructions, explicit raster bbox caveat',()=>{
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[53,41,12,48]);
 assert.equal(src.original_question_records.length,53);
 assert.equal(src.original_question_records.reduce((n,x)=>n+x.original_score_points,0),80);
 assert.deepEqual(src.source_deferred_sections.map(x=>x.answer_positions),[6,4,4,3]);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,17);
 const old=new Map(frozen.items.map(x=>[x.source_slot_id,x])),seen=new Set(),grp={};
 for(const q of src.original_question_records){
  assert.ok(!seen.has(q.source_id),q.source_id);seen.add(q.source_id);
  const f=old.get(q.source_id);assert.ok(f,q.source_id);
  assert.equal(q.answer_marker_pdf_page,f.source_original_page,q.source_id);
  assert.equal(q.original_score_points,f.printed_score_points,q.source_id);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(q.question_type==='SINGLE_CHOICE'?q.full_original_options_in_order.length:0,q.question_type==='SINGLE_CHOICE'?4:0);
  assert.deepEqual(q.full_original_options_in_order.map(o=>o.label),q.question_type==='SINGLE_CHOICE'?['①','②','③','④']:[]);
  assert.ok(q.original_item_stem.trim().length>=7,q.source_id);
  assert.equal(q.answer_marker_pdf_bbox_type,'RASTER_VISUAL_ESTIMATE_UPRIGHT_COORDS_NOT_NATIVE_GLYPH');
  const [x0,y0,x1,y1]=q.answer_marker_pdf_bbox_pts_upright_visual_estimate;
  assert.ok(x0>=10&&x1>x0&&x1<728.2&&y0>5&&y1>y0&&y1<1031.3,q.source_id);
  if(q.section==='S3'){assert.ok(q.original_parent_prompt?.length>20);assert.equal(q.full_original_stem,q.original_parent_prompt+'\n'+q.original_item_stem);}
  if(q.primary_canonical_kp_id_proposed)assert.ok(kpIds.has(q.primary_canonical_kp_id_proposed),q.source_id);
  assert.equal(q.teacher_answer_authenticated,false);
  assert.equal(q.site_question_bank_admitted,false);
  const key=q.source_id.split('|').slice(1,3).join('|');grp[key]=(grp[key]||0)+1;
 }
 assert.equal(seen.size,53);
 assert.deepEqual(grp,{'S1|MC':12,'S2|TF':15,'S3|G02':4,'S3|G03':4,'S3|G05':5,'S3|G06':5,'S3|G07':4,'S3|G09':4});
 assert.equal(src.original_question_records.some(x=>x.source_id.includes('|S3|G01|')||x.source_id.includes('|S3|G04|')||x.source_id.includes('|S3|G08|')||x.source_id.includes('|S4|READ|')),false);
});
test('B20 Science 44 model preliminary PASS and 9 ambiguity HOLD; KP21 strong 5 review 27 nonmatch',()=>{
 assert.equal(qa.original_question_reviews.length,53);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[44,9]);
 assert.equal(qa.science_hold_source_ids.length,9);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:21,KP_REVIEW:5,KP_NONMATCH_G04S1:27});
 assert.equal(qa.kp_strong_and_science_pass_count,18);
 assert.equal(qa.normalized_exact_stem_matches_prior584.length,0);
 assert.equal(qa.cross_paper_lexical_near_matches_prior584.length,0);
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
 for(const [i,q] of src.original_question_records.entries()){
  const r=qa.original_question_reviews[i];
  assert.equal(r.source_id,q.source_id);
  assert.deepEqual(r.answer_marker_pdf_bbox_pts_upright_visual_estimate,q.answer_marker_pdf_bbox_pts_upright_visual_estimate);
  assert.equal(r.source_pdf_bbox_status,'VISUAL_RASTER_ESTIMATE_REQUIRES_EXACT_ACCEPTANCE');
  if(r.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(r.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE','①','②','③','④'].includes(r.model_provisional_answer),r.source_id);
  assert.equal(r.site_admitted,false);
 }
});
test('B20 scan school source text is never mistaken for answer-key-certified student practice',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const row={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:false,assets_complete:false,image_dependency:'SCANNED_SOURCE_RASTER_BBOX_PENDING_EXACT_ACCEPTANCE'};
  const gate=certificationGate(row,authority);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('DEPENDENCIES_INCOMPLETE'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B20 source v21 additive 637 with 22/25 first screened and all 1623 frozen original positions retained',()=>{
 assert.equal(v20.cumulative_original_source_question_occurrences,584);
 assert.deepEqual([v21.cumulative_original_source_question_occurrences,v21.total_true_false,v21.total_single_choice,v21.original_single_choice_options],[637,383,254,1016]);
 assert.deepEqual([v21.science_model_preliminary_pass,v21.science_hold],[569,68]);
 assert.equal(v21.current_public_source_paper_count,22);
 assert.equal(v21.current_public_source_archive_files.length,22);
 assert.equal(v21.full_standalone_initial_text_screened_source_papers,22);
 assert.equal(v21.remaining_source_papers_without_standalone_text_screen,3);
 assert.equal(v21.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.equal(queue.source_exact_standalone_private_completed,637);
 assert.equal(queue.science_model_reviewed_original_standalone_items,637);
 assert.deepEqual([queue.model_science_no_obvious_problem,queue.model_science_hold],[569,68]);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),637);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
 assert.deepEqual([v21.existing_live_bank_total_answer_positions,v21.existing_live_bank_g04s1_answer_positions,v21.site_question_bank_new_admissions],[251,53,0]);
});
