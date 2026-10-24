import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const cohort=get('p12-g04s1-113-existingformal-batch01-four-source-model-candidates-operator-pending-v1.json');
const y=get('p12-g04s1-113-p04b-existingformal-yonganfinal-6-source-science-kp-dedup-rights-candidates-v1.json');
const m=get('p12-g04s1-113-existingformal-minquan-final004-tf3to6-sciencekp-1candidate-3hold-v1.json');
const t=get('p12-g04s1-113-p04b-taozijiao-s01-mc5-option-wording-duplicate-hold-v2.json');
const pub=get('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
test('P12 113 initial exact original candidate cohort four source IDs and candidate answers are copied from reviewed sources, NOT signed or admitted',()=>{
 assert.equal(cohort.candidates.length,4);
 assert.equal(cohort.original_school_TFMC_unpublished_exam_source_records_this_cycle,10);
 assert.equal(cohort.science_direct_KP_candidates_new,4);
 assert.equal(cohort.exact114_public_duplicates_suppressed,2);
 assert.equal(cohort.original_scope_HOLD_items,4);
 assert.equal(cohort.taozijiao_MC002_NOT_only_reorder_word_change_duplicate_HOLD,true);
 assert.equal(t.Q2_all_four_options_exact_identical_under_reorder,false);
 assert.equal(new Set(cohort.candidates.map(x=>x.source_slot_id)).size,4);
 const all=[...y.records.map(x=>({id:x.source_slot_id,stem:x.original_stem,answer:x.science_candidate_not_teacher_key,kp:x.direct_frozen48KP_candidate})),
 ...m.records.map(x=>({id:x.original_source_slot_id,stem:x.original_school_question_stem_EXACT_preserves_original_typo,answer:x.science_answer_independent_candidate_NOT_TEACHER_ANSWER,kp:x.frozen_direct48KP_candidate}))];
 const byId=new Map(all.map(x=>[x.id,x]));
 for(const c of cohort.candidates){
  const original=byId.get(c.source_slot_id);assert.ok(original);
  assert.equal(c.original_stem,original.stem);
  assert.equal(c.science_answer_candidate,original.answer);
  assert.equal(c.canonical_KP_candidate,original.kp);
  assert.ok(c.original_answer_bbox.length===4&&c.original_answer_bbox[2]>c.original_answer_bbox[0]&&c.original_answer_bbox[3]>c.original_answer_bbox[1]);
  assert.equal(c.operator_exact_cohort_release_signoff_pending,true);
  assert.equal(c.student_bank_question_admission_ready,false);
 }
 assert.equal(pub.all_unique_published_source_slot_ids.length,178);
 assert.equal(cohort.main_113_already_published_source_IDs_preserved,178);
 assert.equal(cohort.specific_operator_four_item_cohort_approval_NOT_RECEIVED,true);
 assert.equal(cohort.source_article9_school_exam_text_only_rights_NOT_formally_release_signed,true);
 assert.equal(cohort.all_original_29_duplicate_verification_final_NOT_closed,true);
 for(const k of ['new_FORMAL_SCIENCE_KP_APPROVED','new_ADMISSION_READY','new_PUBLISHED'])assert.equal(cohort[k],0);
});
