import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path)=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const v1=read('../data/review/p12-g04s1-113-b01-existinggate-public814-rights-exact9-operator-pending-v1.json');
const source=read('../data/review/p12-g04s1-113-existingadmission-fixed29-b01-onegate-7standalone-2parents16positions-rights-dedup-v3.json');
const prior=read('../data/review/p12-g04s1-113-b01-directcloud-original9-inherited301-114717-exactpreflight-noadmission-v1.json');

test('B01 retains 7 original standalone plus 2 intact parents, nine source-question blocks and sixteen source answers',()=>{
  assert.equal(v1.operator_exact_list_cohort_size,9);
  assert.equal(v1.candidate_original_question_blocks.length,9);
  assert.equal(v1.candidate_original_question_blocks.filter(x=>x.question_kind==='INTACT_SHARED_PARENT').length,2);
  assert.equal(v1.candidate_original_question_blocks.filter(x=>x.question_kind!=='INTACT_SHARED_PARENT').length,7);
  assert.deepEqual(v1.candidate_original_question_blocks.filter(x=>x.question_kind==='INTACT_SHARED_PARENT').map(x=>x.child_source_ids.length),[4,5]);
  const standalone=v1.candidate_original_question_blocks.filter(x=>x.question_kind!=='INTACT_SHARED_PARENT');
  assert.deepEqual(standalone.map(x=>x.id),source.candidate_independent_tfmc_items.map(x=>x.source_id));
  assert.ok(standalone.every(x=>x.source_text_direct_GDrive_exact&&x.original_answer_bbox_pts.length===4));
  assert.equal(prior.live_original_text_readback.full_candidate_blocks_exact_9_of_9,true);
});
test('Current 41 live student-bank assets and expected 814 answer slots are explicitly enumerated',()=>{
  const m=v1.student_main_public_asset_inventory_read_from_GitHub_main;
  assert.equal(m.scanned_asset_count,41);
  assert.equal(m.student_answer_slots,814);
  assert.equal(Object.values(m.groups).reduce((n,x)=>n+x.asset_count,0),41);
  assert.equal(Object.values(m.groups).reduce((n,x)=>n+x.student_answer_slots,0),814);
  assert.equal(new Set(Object.values(m.groups).flatMap(x=>x.paths)).size,41);
  assert.equal(m.original_question_exact_text_collision_7_standalone,0);
});
test('Existing two non-public identical cross-school origins remain lineage, never duplicate student items',()=>{
  assert.equal(v1.already_recorded_source29_native_exact_lineage_pairs.length,2);
  assert.ok(v1.already_recorded_source29_native_exact_lineage_pairs.every(x=>x.student_learner_items===1));
  assert.equal(v1.candidate_original_question_blocks.length,9);
});
test('Rights are only school formal exam text and no third-party diagrams, teacher solutions, or student scoring',()=>{
  assert.equal(v1.source_pdf.regular_school_first_exam_title_in_original_text,true);
  assert.equal(v1.candidate_original_question_blocks.every(x=>x.rights.regulated_exam_title_verified_in_original_native_text&&x.rights.copy_scope==='EXAM_QUESTION_TEXT_ONLY'&&!x.rights.contains_outside_images_in_text&&!x.rights.includes_original_teacher_solution&&!x.rights.operator_public_release_signoff),true);
  assert.ok(v1.candidate_original_question_blocks.filter(x=>x.question_kind==='INTACT_SHARED_PARENT').every(x=>x.rights.site_must_remove_original_printed_scores_from_display===true));
});
test('Unresolved five scan originals and exact operator approval prevent admission, release, and B02',()=>{
  const s=v1.formal_gate_snapshot;
  assert.equal(s.school_original_5_scan_only_full_question_compare,'PENDING');
  assert.equal(s.operator_exact_9_cohort_signoff,'PENDING');
  assert.equal(s.new_FORMAL_SCIENCE_KP_APPROVED,0);
  assert.equal(s.new_ADMISSION_READY,0);
  assert.equal(s.new_PUBLISHED,0);
  assert.equal(s.B01_FORMAL_CLOSEOUT,false);
  assert.equal(s.B02_NOT_STARTED,true);
  assert.equal(v1.operator_approval,'NOT_GRANTED_BY_GENERIC_WORKFLOW_APPROVAL');
  assert.equal(v1.release_PR_not_opened,true);
  assert.equal(source.B01_STILL_OPEN,true);
});
