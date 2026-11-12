import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const R=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const rights=R('p12-g04s1-113-two-school22-article9-textonly-component-precheck-v1.json');
const work=R('p12-g04s1-113-two-school47-gated-admission-worklist-v1.json');
test('22 source questions only are under school regular exam Article9 TEXT-only component preflight, without original figures, teacher answer or admission',()=>{
 assert.equal(rights.registered_school_regular_exam_metadata.length,2);
 assert.equal(rights.items.length,22);
 assert.equal(rights.summary.text_only_question_component_candidates,22);
 assert.equal(rights.rights_operator_final_release_signoff,false);
 assert.equal(rights.final_rights_release_cleared,false);
 assert.equal(rights.source_original_pdf_image_republication,false);
 assert.equal(rights.source_original_handwritten_answers_as_teacher_keys,false);
 const ids=new Set();
 for(const x of rights.items){
  assert.ok(!ids.has(x.source_slot_id));ids.add(x.source_slot_id);
  assert.equal(x.regulated_exam_identity_from_original_exam_header_source_verified,true);
  assert.equal(x.article9_question_text_only_component_preflight_pass,true);
  assert.equal(x.independent_tf_or_mc_no_parent_image_required,true);
  assert.equal(x.original_page_image_replication_forbidden,true);
  assert.equal(x.original_teacher_answer_material_included,false);
  assert.equal(x.third_party_inserted_content_used,false);
  assert.equal(x.formal_public_release_rights_operator_gated,true);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
 }
 assert.deepEqual([...ids].sort(),work.distinct_source_candidates_pending_admission.map(x=>x.source_slot_id).sort());
 assert.ok(!ids.has('SCI_G04_S1_113_MID_006|S2|MC|002'));
 assert.equal(rights.summary.new_admission_ready,0);
 assert.equal(rights.summary.new_published,0);
});
