import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const q=rd('p12-g04s1-113-existingadmission-fixed29-b01-onegate-7standalone-2parents16positions-rights-dedup-v3.json');
const v2=rd('p12-g04s1-113-existingadmission-fixed29-b01-50-modeltriage-closeout-nonformal-v2.json');
const tfmc=rd('p12-g04s1-113-existingadmission-fixed29-b01-wende-tf15-mc12-model-science-kp-triage-v1.json');
const group=rd('p12-g04s1-113-existingadmission-fixed29-b01-wende-s03-g01-g07-23-parent-model-triage-v1.json');
const old=rd('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const auth=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
const kp=new Map(auth.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>[k.canonical_kp_id,u.unit_id])));
test('B01 formal Gate: exactly 50 original work positions remain distinct from independent pupil items, no proceeding to B02',()=>{
 assert.equal(q.B01_original_source_work_positions,50);
 assert.equal(q.source_work_position_status_rows.length,50);
 assert.equal(new Set(q.source_work_position_status_rows.map(x=>x.source_original_ID)).size,50);
 assert.deepEqual(new Set(q.source_work_position_status_rows.map(x=>x.source_original_ID)),new Set(v2.source_work_positions.map(x=>x.original_source_slot_id)));
 assert.equal(q.B01_existing_main_published_suppressed,3);
 assert.equal(q.B01_proposed_independent_TFMC_question_bodies,7);
 assert.equal(q.B01_proposed_shared_parent_questions,2);
 assert.equal(q.B01_proposed_parent_child_response_marks,9);
 assert.equal(q.B01_proposed_source_response_target_positions_NOT_student_questions,16);
 assert.equal(q.B01_exception_HOLD_source_work_positions,31);
 assert.equal(q.main_113_published_source_IDs_preexisting_retained,178);
 assert.equal(old.all_unique_published_source_slot_ids.length,178);
 assert.equal(q.B01_STILL_OPEN,true);
 assert.equal(q.DO_NOT_PROCEED_B02_UNTIL_B01_OPERATOR_AND_SELECTIVE_RELEASE_FINISHED,true);
 assert.equal(q.B01_NEW_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(q.B01_NEW_ADMISSION_READY,0);
 assert.equal(q.B01_NEW_PUBLISHED,0);
});
test('Original seven full text-layer single items direct Frozen U02, parent groups G05 four and G06 five child answer slots; never invented as 9 standalone questions',()=>{
 assert.equal(q.candidate_independent_tfmc_items.length,7);
 assert.deepEqual(q.candidate_shared_parent_question_groups.map(x=>x.original_parent_id),['S03-G05','S03-G06']);
 assert.deepEqual(q.candidate_shared_parent_question_groups.map(x=>x.NOT_a_number_of_independent_student_questions),[4,5]);
 for(const x of q.candidate_independent_tfmc_items){
  let o=tfmc.actual_question_statuses.find(y=>y.source_slot_id===x.source_id);
  assert.ok(o);
  assert.equal(x.original_question_native_text,o.original_PDF_native_text_layer_question_raw_with_original_line_breaks);
  assert.equal(x.model_answer_not_teacher_key,o.scientific_model_verdict_NOT_original_teacher_key);
  assert.equal(x.canonical_direct_KP_candidate,o.model_directKP_candidate_NOT_OPERATOR_ACCEPTED);
  assert.equal(kp.get(x.canonical_direct_KP_candidate),'U02');
  assert.equal(x.original_bbox_pdf_pts_top_left.length,4);
  assert.equal(x.operator_admission_ready,false);
 }
 for(const y of q.candidate_shared_parent_question_groups){
  const src=group.groups.find(g=>g.original_source_parent_group===y.original_parent_id);
  assert.ok(src);
  assert.equal(y.original_parent_raw_native_text,src.original_parent_PDF_native_text_layer_as_printed_line_breaks);
  assert.deepEqual(y.original_child_source_ids,src.original_evidence_source_IDs);
  assert.ok(y.per_child_direct_KP_candidates.every(k=>kp.get(k)==='U02'));
  assert.equal(y.shared_parent_question_count,1);
  assert.equal(y.student_published,false);
 }
 assert.equal(q.public_114_B04_data_files_looked_up,7);
 assert.equal(q.public_114_B04_student_blocks_screened,294);
 assert.equal(q.cross_original_29_school_exact_option_duplicate_entire_corpus_formal_finished,false);
 assert.equal(q.all_student_main_public_113_114_question_content_final_fingerprint_comparison_formal_finished,false);
 assert.equal(q.original_PDF_school_regular_assessment_header_NATIVE_TEXT_VERIFIED,true);
 assert.equal(q.original_PDF_school_header_VISUAL_BBOX_RENDER_VERIFIED_NOT_SIGNED,true);
 assert.ok(q.admission_blocking_remaining_requirements.some(x=>x.includes('operator')));
});
