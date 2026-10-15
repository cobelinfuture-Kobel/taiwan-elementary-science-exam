import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-heshun-g04s1-final35-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-heshun-final35-science-kp-visual-v1.json');
const map=load('data/review/p12-g04s1-114-nanyi-heshun-final-70-source-map-v1.json');
const v21=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v21.json');
const v22=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v22.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const auth=load('site/data/authority/science-g03-g04-selector-v2.json');
const kpids=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const id='SCI_G04_S1_114_FINAL_002';
test('B21 authentic original scanned 南一和順114四上期末; 2 image-only pages, frozen 70 responses/100 points',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'臺南市和順國民小學');
 assert.equal(src.original_pdf_sha256,'b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e');
 assert.equal(src.original_pdf_sha256,map.source_exact_pdf_sha256);
 assert.equal(src.original_raw_pdf_size_bytes,351361);
 assert.equal(src.original_pdf_pages,2);
 assert.deepEqual(src.original_pdf_visual_reviewed_pages,[1,2]);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.source_pdf_text_layer_available,false);
 assert.equal(src.source_pdf_is_scan_only,true);
 assert.equal(src.native_text_glyph_bboxes_available,false);
 assert.equal(src.source_original_pdf_page_rotation_degrees,90);
 assert.equal(src.source_answer_marker_bboxes_status,'VISUAL_ESTIMATES_ONLY_REQUIRE_MANUAL_PIXEL_EXACT_ACCEPTANCE');
 assert.equal(src.original_full_paper_response_positions_frozen,70);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.equal(map.original_position_count,70);
 assert.equal(map.original_score_total,100);
 assert.equal(map.score_position_parity_verified,true);
 assert.deepEqual(map.original_position_section_counts.map(x=>x.n),[12,15,4,10,8,6,6,6,3]);
});
test('B21 exact original section census: 12 TF, 15 complete four-choice MC, 8 conduction judgments; 35 figure/shared stimuli positions held',()=>{
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[35,20,15,60]);
 assert.equal(src.original_question_records.length,35);
 assert.deepEqual([src.source_scored_points_archived,src.source_scored_points_deferred],[62,38]);
 assert.equal(src.original_question_records.reduce((n,x)=>n+x.original_scored_points,0),62);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,35);
 assert.deepEqual(src.source_deferred_sections.map(x=>x.answer_positions),[4,10,6,6,6,3]);
 const originalMap=new Map(map.items.map(x=>[x.source_slot_id,x])),seen=new Set();
 const c={S1:0,S2:0,S5:0};
 for(const q of src.original_question_records){
  assert.ok(!seen.has(q.source_id),q.source_id);seen.add(q.source_id);
  const original=originalMap.get(q.source_id);assert.ok(original,q.source_id);
  assert.equal(original.source_image_required,false);
  assert.equal(q.original_scored_points,original.score_points);
  assert.equal(q.answer_marker_pdf_page,original.source_original_page);
  assert.deepEqual(q.source_pdf_pages,[q.answer_marker_pdf_page]);
  assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
  assert.ok(q.original_item_stem?.trim().length>3,q.source_id);
  assert.equal(q.question_type==='SINGLE_CHOICE'?q.full_original_options_in_order.length:0,q.section==='S2'?4:0);
  assert.deepEqual(q.full_original_options_in_order.map(x=>x.label),q.section==='S2'?['①','②','③','④']:[]);
  if(q.section==='S5'){assert.ok(q.original_parent_prompt?.length>25);assert.equal(q.full_original_stem,q.original_parent_prompt+'\n'+q.original_item_stem);}
  const [x0,y0,x1,y1]=q.answer_marker_pdf_bbox_pts_upright_visual_estimate;
  assert.ok(x0>5&&x1>x0&&x1<728.4&&y0>5&&y1>y0&&y1<1031.76,q.source_id);
  assert.equal(q.answer_marker_pdf_bbox_type,'RASTER_VISUAL_ESTIMATE_UPRIGHT_COORDS_NOT_NATIVE_GLYPH');
  if(q.primary_canonical_kp_id_proposed)assert.ok(kpids.has(q.primary_canonical_kp_id_proposed),q.source_id);
  assert.equal(q.teacher_answer_authenticated,false);
  assert.equal(q.site_question_bank_admitted,false);
  c[q.section]++;
 }
 assert.deepEqual(c,{S1:12,S2:15,S5:8});
 assert.equal(seen.size,35);
 assert.equal(src.original_question_records.some(x=>['S3','S4','S6','S7','S8','S9'].includes(x.section)),false);
});
test('B21 Science 33 pass/2 scientifically ambiguous HOLDS; KP frozen 24 strong/2 review/9 nonmatch',()=>{
 assert.equal(qa.original_question_reviews.length,35);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[33,2]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|S1|TF|005',id+'|S2|MC|011']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:24,KP_REVIEW:2,KP_NONMATCH_G04S1:9});
 assert.equal(qa.kp_strong_and_science_pass_count,24);
 for(const [i,x] of src.original_question_records.entries()){
  const z=qa.original_question_reviews[i];
  assert.equal(z.source_id,x.source_id);
  assert.equal(z.science_review_status,x.science_review_status);
  assert.deepEqual(z.answer_marker_pdf_bbox_pts_upright_visual_estimate,x.answer_marker_pdf_bbox_pts_upright_visual_estimate);
  assert.equal(z.source_pdf_bbox_status,'RASTER_VISUAL_ESTIMATE_NOT_NATIVE_PDF_GLYPH_EXACT');
  assert.ok(z.model_science_reason?.length>15,x.source_id);
  if(z.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(z.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE','①','②','③','④'].includes(z.model_provisional_answer),x.source_id);
  assert.equal(z.site_admitted,false);
 }
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
});
test('B21 cross-paper exact 2 and nonexact near 2; provenance occurrences are not deduplicated',()=>{
 assert.deepEqual(qa.normalized_exact_stem_matches_prior637,[{source_id:id+'|S2|MC|015',prior_source_id:'SCI_G04_S1_114_FINAL_001|MC|S02|010'},{source_id:id+'|S2|MC|015',prior_source_id:'SCI_G04_S1_114_FINAL_004|S02|MC|006'}]);
 assert.deepEqual(qa.cross_paper_lexical_near_nonexact_matches_prior637,[{source_id:id+'|S2|MC|008',prior_source_id:'SCI_G04_S1_114_FINAL_003|S02|MC|010',lexical_bigram_jaccard:0.5},{source_id:id+'|S5|G01|008',prior_source_id:'SCI_G04_S1_114_MID_011|Q04|005',lexical_bigram_jaccard:0.5}]);
 assert.equal(src.original_question_records.filter(x=>x.source_id.includes('|S2|MC|015')).length,1);
 assert.equal(v22.new_source_paper.original_school_source_occurrences_not_deduplicated,true);
});
test('B21 scanned original source archive may meet Article9 provenance but never bypasses formal student admission',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const x of src.original_question_records){
  const candidate={...src,candidate_id:x.source_id,source_id:x.source_id,question_type:x.question_type,raw_question_text:x.full_original_stem,source_page_pdf_1_based:x.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:false,assets_complete:false,image_dependency:'SCANNED_RASTER_BBOX_EXACT_ACCEPTANCE_PENDING'};
  const g=certificationGate(candidate,auth);
  assert.equal(g.allowed,false);
  assert.ok(g.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(g.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(g.reasons.includes('DEPENDENCIES_INCOMPLETE'));
  assert.ok(g.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B21 v22 672 additive original school occurrences, 23/25 initially screened, old 25/1623 frozen and learner site unchanged',()=>{
 assert.equal(v21.cumulative_original_source_question_occurrences,637);
 assert.deepEqual([v22.cumulative_original_source_question_occurrences,v22.total_true_false,v22.total_single_choice,v22.original_single_choice_options],[672,403,269,1076]);
 assert.deepEqual([v22.science_model_preliminary_pass,v22.science_hold],[602,70]);
 assert.equal(v22.current_public_source_paper_count,23);
 assert.equal(v22.current_public_source_archive_files.length,23);
 assert.equal(v22.full_standalone_initial_text_screened_source_papers,23);
 assert.equal(v22.remaining_source_papers_without_standalone_text_screen,2);
 assert.equal(v22.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.equal(queue.source_exact_standalone_private_completed,672);
 assert.equal(queue.science_model_reviewed_original_standalone_items,672);
 assert.deepEqual([queue.model_science_no_obvious_problem,queue.model_science_hold],[602,70]);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),672);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
 assert.deepEqual([v22.existing_live_bank_total_answer_positions,v22.existing_live_bank_g04s1_answer_positions,v22.site_question_bank_new_admissions],[251,53,0]);
});
