import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const review=JSON.parse(readFileSync(new URL('../data/review/p12-g04s1-113-b01-directcloud-original9-inherited301-114717-exactpreflight-noadmission-v1.json',import.meta.url),'utf8'));
test('B01 inherits exact 9/9 original text and preserves 50-position conservation',()=>{
  assert.equal(review.scope.includes('B01 Wende'),true);
  const p=review.source_positions;
  assert.equal(p.total,50);
  assert.equal(p.already_published_suppressed+p.hold+p.model_candidate_source_positions,50);
  assert.equal(p.standalone_question_blocks,7);
  assert.equal(p.shared_parent_question_blocks,2);
  assert.equal(p.shared_parent_child_marks,9);
  assert.equal(p.standalone_question_blocks+p.shared_parent_child_marks,16);
  assert.equal(p.unique_potential_student_question_blocks,9);
  assert.equal(review.live_original_text_readback.standalone.length,7);
  assert.equal(review.live_original_text_readback.shared_parent_groups.length,2);
  assert.ok(review.live_original_text_readback.standalone.every(x=>x.original_pdf_text_exact_normalized_match && x.answer_marker_bbox_inherited));
  assert.ok(review.live_original_text_readback.shared_parent_groups.every(x=>x.original_pdf_text_exact_normalized_match && x.original_child_bbox_inherited));
});
test('Two exact cross-school aliases do not create extra learner questions',()=>{
  const a=review.known_exact_cross_school_unpublished_aliases;
  assert.equal(a.length,2);
  const origins=a.map(x=>x.owner_source_id).sort();
  assert.deepEqual(origins,[
    'SCI_G04_S1_113_MID_001|S01|TF|015',
    'SCI_G04_S1_113_MID_001|S02|MC|011'
  ].sort());
  assert.ok(a.every(x=>x.not_main_published_pair));
  assert.ok(review.live_original_text_readback.standalone.every(x=>!x.existing_114all25_717_original_exact_match_flag));
  assert.ok(review.live_original_text_readback.shared_parent_groups.every(x=>!x.existing_public_exact_fingerprint_finished));
});
test('Source-only evidence must never be silently promoted into formal Admission or B02',()=>{
  const p=review.publication_status;
  assert.equal(p.new_FORMAL_SCIENCE_KP_APPROVED,0);
  assert.equal(p.new_ADMISSION_READY,0);
  assert.equal(p.new_PUBLISHED,0);
  assert.equal(p.B01_formal_closeout,false);
  assert.equal(p.B02_not_started,true);
  assert.equal(review.no_student_release_from_this_checkpoint,true);
  assert.ok(review.live_original_text_readback.standalone.every(x=>!x.rights_final_signed&&!x.operator_final_signoff));
  assert.ok(review.live_original_text_readback.shared_parent_groups.every(x=>!x.rights_final_signed&&!x.operator_final_signoff));
});
