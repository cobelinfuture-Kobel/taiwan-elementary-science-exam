import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const q=read('p12-g04s1-113-existingadmission-b01-9question-operator-cohort-proposal-PENDING-v1.json');
const dup=read('p12-g04s1-113-existingadmission-b01-wende-dongguang-zhongxiao-two-crossschool-exact-duplicates-v1.json');
const b=read('p12-g04s1-113-existingadmission-fixed29-b01-onegate-7standalone-2parents16positions-rights-dedup-v3.json');
test('B01 operator exact cohort is 7 independent TFMC and two intact parent question blocks, never 16 student question blocks',()=>{
 assert.equal(q.batch,'B01');
 assert.equal(q.source_work_positions_total,50);
 assert.equal(q.main_published_prior_suppressed_source_work_positions,3);
 assert.equal(q.exception_HOLD_work_positions,31);
 assert.equal(q.source_work_candidate_positions,16);
 assert.equal(q.proposed_unique_student_question_blocks,9);
 assert.equal(q.source_item_7_candidate_list.length,7);
 assert.equal(q.source_shared_parent_2_candidate_list.length,2);
 assert.deepEqual(q.source_shared_parent_2_candidate_list.map(x=>x.original_child_answer_count),[4,5]);
 assert.equal(q.proposed_shared_parent_child_response_work_positions,9);
 assert.equal(q.proposed_standalone_question_blocks+q.proposed_shared_parent_child_response_work_positions+q.main_published_prior_suppressed_source_work_positions+q.exception_HOLD_work_positions,50);
 assert.deepEqual(new Set(q.source_item_7_candidate_list.map(x=>x.original_source_ID_owner)),new Set(b.candidate_independent_tfmc_items.map(x=>x.source_id)));
 assert.equal(q.all_50_source_positions_FORMAL_BATCH_CLOSEOUT,false);
 assert.equal(q.B02_NOT_AUTHORIZED_TO_EXECUTE,true);
 for(const key of ['new_FORMAL_SCIENCE_KP_APPROVED','new_ADMISSION_READY','new_PUBLISHED'])assert.equal(q[key],0);
});
test('Two exact other-school source identities attach to original question owners as lineage, not duplicate published student questions',()=>{
 const tagged=q.source_item_7_candidate_list.filter(x=>x.other_original_SOURCE_ID_alias_if_exact_unissued);
 assert.equal(tagged.length,2);
 assert.equal(dup.groups.length,2);
 for(const x of tagged){
  const ref=dup.groups.find(y=>y.owner_source_id===x.original_source_ID_owner);
  assert.ok(ref);
  assert.equal(x.other_original_SOURCE_ID_alias_if_exact_unissued,ref.other_source_id);
 }
 assert.equal(q.current_existing_113_student_bank_original_source_IDs_unchanged,178);
 assert.equal(q.all29_original_papers_full_cross_school_duplicate_evidence_closed,false);
 assert.equal(q.all_existing_113_114_public_student_bank_final_exact_fingerprint_closed,false);
 assert.equal(q.rights_article9_per_item_final_release_verified,false);
 assert.equal(q.existing_operator_specific_cohort_signoff_received,false);
 assert.ok(q.source_item_7_candidate_list.every(x=>!x.student_bank_question_ready));
 assert.ok(q.source_shared_parent_2_candidate_list.every(x=>!x.student_bank_question_ready));
});
