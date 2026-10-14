import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isExamQuestionReuseEligible,certificationGate} from '../site/assets/js/s3-admission.mjs';
const get=p=>JSON.parse(readFileSync(p,'utf8'));
const a=get('data/source-archive/p12-art9-114-dadun-g04s1-final28-original-questions-v1.json');
const qa=get('data/review/p12-art9-114-dadun-final28-science-kp-secondpass-v1.json');
const freeze=get('data/review/p12-g04s1-114-kanghsuan-dadun-final-64-source-map-v1.json');
const idx=get('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v10.json');
const queue=get('data/review/p12-standalone-all25-source-first-queue-v1.json');
const authority=get('site/data/authority/science-g03-g04-selector-v2.json');
const ids=new Set(freeze.items.map(x=>x.source_slot_id));
test('source SHA, 4 pages, 64 original slots and exactly 28 independent original questions',()=>{
 assert.equal(a.original_pdf_sha256,freeze.source_pdf_sha256);
 assert.equal(a.original_raw_pdf_size_bytes,561337);
 assert.equal(a.original_pdf_pages,4);
 assert.equal(a.original_full_paper_answer_positions_frozen,64);
 assert.equal(a.original_question_records.length,28);
 assert.equal(a.original_question_records.filter(x=>x.question_type==='TRUE_FALSE').length,14);
 assert.equal(a.original_question_records.filter(x=>x.question_type==='SINGLE_CHOICE').length,14);
 assert.equal(a.original_question_records.reduce((n,x)=>n+x.full_original_options_in_order.length,0),56);
 assert.deepEqual(a.source_excluded_standalone_visual_dependencies,['SCI_G04_S1_114_FINAL_005|S1|TF|001','SCI_G04_S1_114_FINAL_005|S2|MC|006']);
 for(const x of a.source_excluded_standalone_visual_dependencies)assert(!a.original_question_records.some(r=>r.source_id===x));
 for(const row of a.original_question_records){
  assert(ids.has(row.source_id));
  assert.equal(row.answer_marker_pdf_page,row.source_pdf_pages[0]);
  assert.equal(row.original_scored_points,2);
  const [x0,y0,x1,y1]=row.answer_marker_pdf_bbox_pts_top_left;
  assert.ok(x0>40&&y0>40&&x1>x0&&y1>y0);
  assert.ok(row.full_original_stem.trim().length>5);
  assert.deepEqual(row.full_original_options_in_order.map(x=>x.label),row.question_type==='TRUE_FALSE'?[]:['(1)','(2)','(3)','(4)']);
  assert.equal(row.teacher_answer_authenticated,false);
  assert.equal(row.site_question_bank_admitted,false);
 }
});
test('science and KP provisional holds, original hidden answer text never authenticated',()=>{
 assert.deepEqual([qa.model_science_preliminary_pass,qa.model_science_hold],[26,2]);
 assert.deepEqual([qa.kp_secondpass_count.KP_STRONG_CANDIDATE,qa.kp_secondpass_count.KP_REVIEW],[26,2]);
 assert.equal(qa.teacher_key_authenticated_count,0);
 assert.equal(Object.keys(qa.source_science_hold_reasons).length,2);
 assert.equal(a.hidden_answer_text_layer_found_but_not_used_for_teacher_key_authentication,true);
 assert.equal(qa.model_answers.length,28);
});
test('Article9 source rights not student admission; cumulative census immutable',()=>{
 assert.equal(isExamQuestionReuseEligible(a),true);
 for(const row of a.original_question_records){
  const c={...a,candidate_id:row.source_id,source_id:row.source_id,question_type:row.question_type,raw_question_text:row.full_original_stem,source_page_pdf_1_based:row.answer_marker_pdf_page,review_status:'ARCHIVED_SOURCE_ONLY',admission_status:'ARCHIVED_SOURCE_ONLY',answer_evidence_status:'ANSWER_KEY_NOT_PRESENT',answer_review_verified:false,answer_normalized:null,mapping_status:'KP_UNRESOLVED',primary_canonical_kp_id:null,kp_review_verified:false,source_visual_review_verified:true,dependency_review_verified:true,assets_complete:true,image_dependency:'NONE_FOR_THIS_ITEM'};
  const gate=certificationGate(c,authority);
  assert.equal(gate.allowed,false);
  assert.ok(gate.reasons.includes('ANSWER_UNVERIFIED'));
  assert.ok(gate.reasons.includes('KP_REVIEW_PENDING'));
  assert.ok(gate.reasons.includes('NOT_CERTIFIED_FOR_PUBLIC'));
 }
 assert.deepEqual([idx.cumulative_original_source_question_occurrences,idx.total_true_false,idx.total_single_choice,idx.original_single_choice_options],[253,122,131,524]);
 assert.deepEqual([idx.science_model_preliminary_pass,idx.science_hold],[229,24]);
 assert.equal(queue.source_exact_standalone_private_completed,253);
 assert.equal(queue.source_paper_queue.reduce((n,x)=>n+x.full_complete_standalone_tf_mc_private_source_count,0),253);
 assert.equal(queue.source_papers_total,25);
 assert.equal(idx.source_position_frozen_all25_total,1623);
 assert.equal(idx.existing_live_bank_total_answer_positions,251);
 assert.equal(idx.existing_live_bank_g04s1_answer_positions,53);
 assert.equal(idx.site_question_bank_new_admissions,0);
});
