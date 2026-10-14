import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const j=p=>JSON.parse(readFileSync(p,'utf8'));
const a=j('data/source-archive/p12-art9-114-anhe-g04s1-final35-original-questions-v1.json');
const r=j('data/review/p12-art9-114-anhe-final35-science-kp-secondpass-v1.json');
const f=j('data/review/p12-g04s1-114-kanghsuan-anhe-final-50-source-kp-first-v1.json');
const q=j('data/review/p12-standalone-all25-source-first-queue-v1.json');
const ix=j('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v12.json');
const prev=j('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v11.json');
const auth=j('site/data/authority/science-g03-g04-selector-v2.json');
const kpIds=new Set(auth.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const sourceId='SCI_G04_S1_114_FINAL_007';
test('Original Anhe FINAL source identity and all 35 exact original independent answer slots',()=>{
 assert.equal(a.source_paper_id,sourceId);
 assert.equal(a.original_pdf_sha256,f.source_pdf_sha256);
 assert.equal(a.original_pdf_sha256,'5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2');
 assert.equal(a.original_raw_pdf_size_bytes,365111);
 assert.equal(a.original_pdf_pages,2);
 assert.equal(a.original_full_paper_answer_positions_frozen,50);
 assert.equal(a.original_full_paper_scored_points_frozen,100);
 assert.deepEqual(a.original_pdf_page_visual_reviewed,[1,2]);
 assert.equal(a.original_question_records.length,35);
 assert.equal(a.true_false,15);assert.equal(a.four_option_choice,20);
 assert.equal(a.original_question_records.reduce((n,x)=>n+x.full_original_options_in_order.length,0),80);
 const immutable=new Map(f.items.map(x=>[x.source_slot_id,x]));
 const ids=new Set();
 for(const x of a.original_question_records){
  assert.ok(immutable.has(x.source_id),x.source_id);
  assert.equal(immutable.get(x.source_id).source_original_pdf_page,x.answer_marker_pdf_page);
  assert.equal(x.original_scored_points,2);
  const [a0,b0,c0,d0]=x.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(a0>45&&a0<400&&b0>55&&b0<950&&c0>a0&&d0>b0,x.source_id);
  assert.ok(x.full_original_stem.length>8);
  assert.deepEqual(x.full_original_options_in_order.map(o=>o.label),x.question_type==='TRUE_FALSE'?[]:['①','②','③','④']);
  assert.equal(x.site_question_bank_admitted,false);
  assert.equal(x.standalone_without_shared_figure_or_stimulus,true);
  ids.add(x.source_id);
 }
 assert.equal(ids.size,35);
});
test('Original printed duplicate ③ stays a separate source-print HOLD',()=>{
 const x=a.original_question_records.find(x=>x.source_id===sourceId+'|S02|MC|008');
 assert.deepEqual(x.original_source_print_anomaly.original_printed_markers_in_visual_order,['①','②','③','③','④']);
 assert.equal(x.full_original_options_in_order.length,4);
 assert.equal(r.source_print_hold_count,1);
 assert.deepEqual(r.source_print_hold_source_ids,[x.source_id]);
 assert.equal(ix.source_print_duplicate_choice_label_hold_total,2);
});
test('29 model science prelim pass, six independent holds, KP 29/4/2 and exact source cross-paper comparison',()=>{
 assert.equal(a.original_question_records.filter(x=>x.science_review_status==='MODEL_SCIENCE_PASS').length,29);
 assert.equal(r.science_hold_source_ids.length,6);
 assert.equal(Object.keys(r.science_hold_reason_by_id).length,6);
 assert.deepEqual(r.kp_secondpass_count,{KP_STRONG_CANDIDATE:29,KP_REVIEW:4,KP_NONMATCH_G04S1:2});
 assert.equal(r.kp_strong_and_model_science_pass_count,24);
 assert.equal(r.source_question_reviews.length,35);
 assert.equal(r.normalized_exact_stem_links_prior284.length,1);
 assert.equal(r.cross_paper_near_stem_candidates_prior284.length,4);
 assert.equal(r.teacher_key_authenticated_count,0);
 assert.equal(r.formal_science_approved_count,0);
 assert.equal(r.formal_kp_approved_count,0);
 assert.equal(r.operator_site_admitted_count,0);
});
test('School exam original source legality cannot bypass student-site answer or KP certification',()=>{
 assert.equal(isExamQuestionReuseEligible(a),true);
 for(const row of a.original_question_records){
  const c={...a,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,source_page_pdf_1_based:row.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(c,auth);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
});
test('Frozen cumulative source only: 284+35=319, 288 model science prelim passes, 31 holds; learner bank unchanged',()=>{
 assert.equal(prev.cumulative_original_source_question_occurrences,284);
 assert.deepEqual([ix.cumulative_original_source_question_occurrences,ix.total_true_false,ix.total_single_choice,ix.original_single_choice_options],[319,151,168,672]);
 assert.deepEqual([ix.science_model_preliminary_pass,ix.science_hold],[288,31]);
 assert.equal(ix.current_public_source_paper_count,13);
 assert.equal(ix.current_public_source_archive_files.length,13);
 assert.equal(ix.existing_live_bank_total_answer_positions,251);
 assert.equal(ix.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(ix.site_question_bank_new_admissions,0);
 assert.equal(ix.source_position_frozen_all25_total,1623);
 assert.equal(q.source_papers_total,25);
 assert.ok(q.source_exact_standalone_private_completed>=319);
 assert.equal(q.science_model_reviewed_original_standalone_items,q.source_exact_standalone_private_completed);
 assert.ok(q.model_science_no_obvious_problem>=288);
 assert.ok(q.model_science_hold>=31);
 assert.equal(q.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),q.source_exact_standalone_private_completed);
 assert.equal(q.all25_before_publication_gate_preserved,true);
 assert.equal(q.public_items_new,0);
});
