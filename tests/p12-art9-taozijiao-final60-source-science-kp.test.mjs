import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const src=load('data/source-archive/p12-art9-114-taozijiao-g04s1-final60-original-questions-v1.json');
const qa=load('data/review/p12-art9-114-taozijiao-final60-science-kp-secondpass-v1.json');
const frozen=load('data/review/p12-g04s1-114-hanlin-taozijiao-final-100-kp-first-text-map-v1.json');
const v18=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v18.json');
const v19=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v19.json');
const queue=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
const auth=load('site/data/authority/science-g03-g04-selector-v2.json');
const id='SCI_G04_S1_114_FINAL_012',kps=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('B18 authentic 桃子腳 PDF and all 100 frozen answer positions, text-only Q02–Q10 60 judgments',()=>{
 assert.equal(src.source_paper_id,id);
 assert.equal(src.source_school,'新北市立桃子腳國民中小學');
 assert.equal(src.original_pdf_sha256,'1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987');
 assert.equal(src.original_raw_pdf_size_bytes,376368);
 assert.equal(src.original_pdf_pages,2);
 assert.equal(src.original_full_paper_answer_positions_frozen,100);
 assert.equal(src.original_full_paper_scored_points_frozen,100);
 assert.deepEqual(src.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(src.source_pdf_sha256_verified,true);
 assert.equal(src.original_answer_marker_raw_character_pdf_geometry_verified,true);
 assert.equal(frozen.source_answer_positions_identified,100);
 assert.equal(frozen.items.length,100);
 assert.deepEqual([src.source_archived_count,src.true_false,src.four_option_choice,src.original_mc_option_entries],[60,60,0,0]);
 assert.equal(src.source_deferred_figure_matching_shared_stimulus_positions,40);
 assert.deepEqual(src.source_deferred_sections.map(s=>s.answer_positions),[9,4,4,4,5,6,8]);
 assert.equal(src.original_question_records.reduce((n,r)=>n+r.original_scored_points,0),60);
});
test('B18 all 60 original parent instructions, individual complete statements and raw PDF marker bboxes',()=>{
 const map=new Map(frozen.items.map(x=>[x.source_slot_id,x]));const seen=new Set(),sectionCounts={};
 for(const r of src.original_question_records){
  assert.ok(!seen.has(r.source_id),r.source_id);seen.add(r.source_id);
  const f=map.get(r.source_id);assert.ok(f,r.source_id);
  const sec=Number(r.section.slice(1));sectionCounts[sec]=(sectionCounts[sec]||0)+1;
  assert.ok(sec>=2&&sec<=10);
  assert.equal(r.question_type,'TRUE_FALSE');
  assert.equal(r.original_scored_points,1);
  assert.deepEqual(r.full_original_options_in_order,[]);
  assert.equal(r.full_original_stem,r.original_parent_prompt+'\n'+r.original_item_stem);
  assert.ok(r.original_parent_prompt.includes('畫○')||r.original_parent_prompt.includes('畫○，'));
  assert.ok(r.original_item_stem.length>4);
  assert.equal(r.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(r.answer_marker_pdf_page,sec===10?2:1);
  assert.deepEqual(r.source_pdf_pages,[r.answer_marker_pdf_page]);
  const [x0,y0,x1,y1]=r.answer_marker_pdf_bbox_pts_top_left;
  assert.equal(x0,sec>=5&&sec<=9?388.18:50.16);
  assert.ok(x1>x0&&x1<728.53&&y0>50&&y1>y0&&y1<1032,r.source_id);
  assert.ok(Math.abs((y1-y0)-14.95)<0.02,r.source_id);
  assert.equal(r.original_teacher_answer_key_authenticated,undefined);
  assert.equal(r.teacher_answer_authenticated,false);
  assert.equal(r.site_question_bank_admitted,false);
  if(r.primary_canonical_kp_id_proposed)assert.ok(kps.has(r.primary_canonical_kp_id_proposed),r.source_id);
 }
 assert.equal(seen.size,60);
 assert.deepEqual(sectionCounts,{2:8,3:8,4:6,5:7,6:9,7:5,8:6,9:6,10:5});
 assert.ok(!src.original_question_records.some(r=>r.section==='Q01'||Number(r.section.slice(1))>=11));
});
test('B18 independent Science/KP: 56 provisional /4 science HOLD; KP 29/6/25; 1 near but no exact source duplicates',()=>{
 assert.equal(qa.original_question_reviews.length,60);
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[56,4]);
 assert.deepEqual(qa.science_hold_source_ids,[id+'|Q03|006',id+'|Q04|001',id+'|Q05|006',id+'|Q08|005']);
 assert.deepEqual(qa.kp_secondpass_count,{KP_STRONG_CANDIDATE:29,KP_REVIEW:6,KP_NONMATCH_G04S1:25});
 assert.equal(qa.kp_strong_and_science_pass_count,27);
 assert.equal(qa.normalized_exact_stem_matches_prior490.length,0);
 assert.deepEqual(qa.cross_paper_lexical_near_matches_prior490,[{source_id:id+'|Q08|002',prior_source_id:'SCI_G04_S1_114_FINAL_005|S1|TF|009',lexical_bigram_jaccard:0.5714}]);
 assert.deepEqual([qa.teacher_key_authenticated_count,qa.formal_science_approved_count,qa.formal_kp_approved_count,qa.operator_site_admitted_count],[0,0,0,0]);
 for(const [i,r] of src.original_question_records.entries()){
  const j=qa.original_question_reviews[i];assert.equal(j.source_id,r.source_id);
  assert.deepEqual(j.answer_marker_pdf_bbox_pts_top_left,r.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(j.science_review_status,r.science_review_status);
  if(j.science_review_status==='MODEL_SCIENCE_HOLD')assert.equal(j.model_provisional_answer,null);
  else assert.ok(['TRUE','FALSE'].includes(j.model_provisional_answer));
  assert.equal(j.site_admitted,false);
 }
});
test('Source-only B18 Article9 records are not certified learner questions',()=>{
 assert.equal(isExamQuestionReuseEligible(src),true);
 for(const r of src.original_question_records){
  const c={...src,candidate_id:r.source_id,source_id:r.source_id,question_type:r.question_type,raw_question_text:r.full_original_stem,source_page_pdf_1_based:r.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(c,auth);
  assert.equal(gate.allowed,false);assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('B18 v19 cumulative 550 original occurrences and frozen 25-paper/1623-position/site controls',()=>{
 assert.equal(v18.cumulative_original_source_question_occurrences,490);
 assert.deepEqual([v19.cumulative_original_source_question_occurrences,v19.total_true_false,v19.total_single_choice,v19.original_single_choice_options],[550,318,232,928]);
 assert.deepEqual([v19.science_model_preliminary_pass,v19.science_hold],[492,58]);
 assert.equal(v19.current_public_source_paper_count,20);
 assert.equal(v19.current_public_source_archive_files.length,20);
 assert.equal(v19.full_standalone_initial_text_screened_source_papers,20);
 assert.equal(v19.remaining_source_papers_without_standalone_text_screen,5);
 assert.equal(v19.source_position_frozen_all25_total,1623);
 assert.equal(queue.source_papers_total,25);
 assert.equal(queue.source_response_slots_unchanged,1623);
 assert.equal(queue.source_exact_standalone_private_completed,550);
 assert.equal(queue.science_model_reviewed_original_standalone_items,550);
 assert.deepEqual([queue.model_science_no_obvious_problem,queue.model_science_hold],[492,58]);
 assert.equal(queue.source_paper_queue.reduce((n,r)=>n+r.full_complete_standalone_tf_mc_private_source_count,0),550);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
 assert.equal(queue.public_items_new,0);
 assert.deepEqual([v19.existing_live_bank_total_answer_positions,v19.existing_live_bank_g04s1_answer_positions,v19.site_question_bank_new_admissions],[251,53,0]);
});
