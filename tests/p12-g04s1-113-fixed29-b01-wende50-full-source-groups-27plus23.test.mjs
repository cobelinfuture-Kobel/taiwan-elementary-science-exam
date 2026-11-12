import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const b=d('p12-g04s1-113-existingadmission-fixed29-b01-wende50-sourceID-reconciliation-v1.json');
const tfmc=d('p12-g04s1-113-existingadmission-fixed29-b01-wende-tf15-mc12-model-science-kp-triage-v1.json');
const parents=d('p12-g04s1-113-existingadmission-fixed29-b01-wende-s03-g01-g07-23-parent-model-triage-v1.json');
const known=new Set(b.rows.map(x=>x.source_slot_id_exact_original));
test('Batch B01 exhaustive source fifty (Wende MID001) original ID reconciliation includes 27 TFMC and 23 original group response positions, no silent unreviewed first-page switch',()=>{
 assert.equal(b.rows.length,50);
 assert.equal(tfmc.actual_question_statuses.length,27);
 assert.equal(parents.groups.length,7);
 assert.equal(parents.groups.reduce((n,x)=>n+x.original_per_position_annotations.length,0),23);
 assert.equal(parents.original_S03_work_position_count_in_B01,23);
 assert.equal(parents.source_original_native_PDF_ink_bbox_count_in23,21);
 assert.equal(parents.original_figure_only_nonprinted_answer_marker_ROIs_in23,2);
 const all=[...tfmc.actual_question_statuses.map(x=>x.source_slot_id),...parents.groups.flatMap(g=>g.original_per_position_annotations.map(x=>x.source_slot_id))];
 assert.equal(all.length,50);
 assert.equal(new Set(all).size,50);
 assert.deepEqual(new Set(all),known);
 assert.equal(tfmc.already_main_published_113_source_count_in_these27,3);
 assert.equal(tfmc.currently_unpublished_model_Science_AND_direct_Frozen48_KP_candidate_count,7);
 assert.equal(tfmc.currently_unpublished_model_or_scope_HOLD_count,17);
 assert.equal(parents.nonpublic_science_directKP_initial_candidate_positions9_not_9_standalone_student_questions,9);
 assert.equal(parents.original_child_source_groups_which_hold_due_figure_or_KP_in_B01,14);
 assert.equal(3+7+17+9+14,50);
 assert.equal(parents.original_S03_last5_to_B02_5_of_55_parent_dependence_preserved,true);
 for(const g of parents.groups){
   assert.ok(g.original_parent_PDF_native_text_layer_as_printed_line_breaks.length>5);
   for(const r of g.original_per_position_annotations){
      assert.equal(r.formal_science_kp_approved,false);
      assert.equal(r.admission_ready,false);
      assert.equal(r.publicly_released,false);
   }
 }
 for(const key of ['NEW_FORMAL_SCIENCE_KP_APPROVED','NEW_ADMISSION_READY','NEW_PUBLISHED'])assert.equal(parents[key],0);
});
test('Wende child statement/same parent family 4+5 is not nine independent standalone pupil questions',()=>{
 const g5=parents.groups.find(x=>x.original_parent_ordinal===5);
 const g6=parents.groups.find(x=>x.original_parent_ordinal===6);
 assert.equal(g5.original_per_position_annotations.length,4);
 assert.equal(g6.original_per_position_annotations.length,5);
 assert.deepEqual(g5.original_per_position_annotations.map(x=>x.preliminary_model_answer_not_teacher_key),['ㄇ','ㄆ','ㄅ','ㄈ']);
 assert.deepEqual(g6.original_per_position_annotations.map(x=>x.preliminary_model_answer_not_teacher_key),['✓','╳','✓','✓','╳']);
 assert.ok(parents.groups.find(x=>x.original_parent_ordinal===7).original_parent_PDF_native_text_layer_as_printed_line_breaks.includes('光源'));
 assert.equal(g5.grouped_response_modes_not_student_independent_question_count,true);
 assert.equal(g6.grouped_response_modes_not_student_independent_question_count,true);
});
