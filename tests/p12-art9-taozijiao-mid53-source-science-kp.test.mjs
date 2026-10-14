import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const original=read('data/source-archive/p12-art9-114-taozijiao-g04s1-mid53-original-questions-v1.json');
const review=read('data/review/p12-art9-114-taozijiao-mid53-science-kp-secondpass-v1.json');
const frozen=read('data/review/p12-g04s1-114-hanlin-taozijiao-mid-100-source-map-v1.json');
const idx=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v16.json');
const prev=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v15.json');
const queue=read('data/review/p12-standalone-all25-source-first-queue-v1.json');
const authority=read('site/data/authority/science-g03-g04-selector-v2.json');
const kpids=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const SID='SCI_G04_S1_114_MID_011';
test('Original 桃子腳 114 翰林期中 PDF authority: 100 school positions, 2 pages and immutable SHA',()=>{
 assert.equal(original.source_paper_id,SID);
 assert.equal(original.original_pdf_sha256,frozen.source_original_pdf_sha256);
 assert.equal(original.original_pdf_sha256,'e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5');
 assert.equal(original.original_raw_pdf_size_bytes,660485);
 assert.equal(original.original_pdf_pages,2);
 assert.equal(original.original_full_paper_answer_positions_frozen,100);
 assert.equal(original.original_full_paper_scored_points_frozen,100);
 assert.equal(frozen.original_response_positions,100);
 assert.deepEqual(original.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(original.visible_or_hidden_prefilled_original_answer_marks_present_but_not_authenticated,true);
 assert.equal(original.source_inline_pronunciation_annotation_review_count,1);
});
test('53 complete original stand-alone ○/〤 response positions with their own original source parent prompts and native answer marker bboxes',()=>{
 const records=original.original_question_records;
 assert.equal(records.length,53);
 assert.equal(original.true_false,53);
 assert.equal(original.four_option_choice,0);
 assert.equal(original.original_mc_option_entries,0);
 assert.equal(records.reduce((n,r)=>n+r.original_scored_points,0),53);
 assert.equal(records.reduce((n,r)=>n+r.full_original_options_in_order?.length||0,0),0);
 const byGroup={Q01:8,Q03:9,Q04:13,Q06:5,Q07:5,Q09:5,Q13:8};
 for(const [name,num] of Object.entries(byGroup))assert.equal(records.filter(r=>r.original_question_group===name).length,num,name);
 const frozenIds=new Map(frozen.items.map(x=>[x.source_slot_id,x]));
 const ids=new Set();
 for(const x of records){
  const slot=frozenIds.get(x.source_id);
  assert.ok(slot,x.source_id);
  assert.equal(slot.source_score_points,1);
  assert.equal(x.original_scored_points,1);
  assert.equal(x.question_type,'TRUE_FALSE');
  assert.equal(x.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(x.answer_marker_pdf_page,slot.original_pdf_page);
  assert.deepEqual(x.source_pdf_pages,[slot.original_pdf_page]);
  const [x0,y0,x1,y1]=x.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>=45&&x0<620&&x1>x0&&y0>75&&y1>y0&&y1<1000,x.source_id);
  assert.ok(x.full_original_stem.includes(x.original_parent_prompt));
  assert.ok(x.full_original_stem.includes(x.original_item_stem));
  assert.equal(x.teacher_answer_authenticated,false);
  assert.equal(x.site_question_bank_admitted,false);
  if(x.primary_canonical_kp_id_proposed)assert.ok(kpids.has(x.primary_canonical_kp_id_proposed),x.source_id);
  if(x.original_question_group==='Q04'){assert.ok(x.original_subsection_number);assert.ok(x.original_item_printed_label);}
  ids.add(x.source_id);
 }
 assert.equal(ids.size,53);
 assert.equal(frozen.items.length,100);
 assert.equal(original.source_figure_table_reading_dependent_remaining_positions,47);
 assert.equal(original.source_deferred_groups.length,8);
 assert.equal(records.some(r=>r.source_id===SID+'|Q04|014'),false);
 assert.equal(records.some(r=>r.source_id.startsWith(SID+'|Q14|')),false);
});
test('Independent science QA 44 pass, 9 holds; KP14 strong/11 review/28 nonmatch',()=>{
 assert.equal(review.original_question_reviews.length,53);
 assert.equal(review.model_science_preliminary_pass,44);
 assert.equal(review.model_science_hold,9);
 assert.equal(review.science_hold_source_ids.length,9);
 assert.equal(Object.keys(review.science_hold_reason_by_source_id).length,9);
 assert.deepEqual(review.kp_secondpass_count,{KP_STRONG_CANDIDATE:14,KP_REVIEW:11,KP_NONMATCH_G04S1:28});
 assert.equal(review.kp_strong_and_science_pass_count,14);
 assert.equal(review.original_question_reviews.filter(r=>r.model_provisional_answer===null).length,9);
 assert.equal(original.original_question_records.filter(r=>r.science_review_status==='MODEL_SCIENCE_PASS').length,44);
 assert.equal(original.original_question_records.filter(r=>r.kp_review_status==='KP_STRONG_CANDIDATE').length,14);
 assert.deepEqual(review.normalized_exact_stem_matches_prior385,[]);
 assert.deepEqual(review.bigram_near_matches_prior385_at_least_0_5,[]);
 assert.equal(review.source_original_teacher_answers_visible_in_pdf_text_layer_but_not_authenticated,true);
 for(let i=0;i<53;i++){
  assert.equal(review.original_question_reviews[i].source_id,original.original_question_records[i].source_id);
  assert.deepEqual(review.original_question_reviews[i].answer_marker_pdf_bbox_pts_top_left,original.original_question_records[i].answer_marker_pdf_bbox_pts_top_left);
 }
});
test('Every Article9 original source question fails learner admission despite provenance',()=>{
 assert.equal(isExamQuestionReuseEligible(original),true);
 for(const row of original.original_question_records){
  const c={...original,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,source_page_pdf_1_based:row.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(c,authority);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('Immutable 25 papers/1623 positions; source-only 385+53=438, old student 251 and G04S1 53 unchanged',()=>{
 assert.equal(prev.cumulative_original_source_question_occurrences,385);
 assert.deepEqual([idx.cumulative_original_source_question_occurrences,idx.total_true_false,idx.total_single_choice,idx.original_single_choice_options],[438,234,204,816]);
 assert.deepEqual([idx.science_model_preliminary_pass,idx.science_hold],[386,52]);
 assert.equal(idx.source_print_duplicate_choice_label_hold_total,2);
 assert.equal(idx.current_public_source_paper_count,17);
 assert.equal(idx.current_public_source_archive_files.length,17);
 assert.equal(idx.source_position_frozen_all25_total,1623);
 assert.equal(idx.existing_live_bank_total_answer_positions,251);
 assert.equal(idx.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(idx.site_question_bank_new_admissions,0);
 assert.equal(queue.source_papers_total,25);
 assert.ok(queue.source_exact_standalone_private_completed>=438);
 assert.equal(queue.science_model_reviewed_original_standalone_items,queue.source_exact_standalone_private_completed);
 assert.ok(queue.model_science_no_obvious_problem>=386);
 assert.ok(queue.model_science_hold>=52);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),queue.source_exact_standalone_private_completed);
 assert.equal(queue.public_items_new,0);
 assert.equal(queue.all25_before_publication_gate_preserved,true);
});
