import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const get = (p) => JSON.parse(readFileSync(new URL('../'+p, import.meta.url), 'utf8'));
const rights=get('data/review/p12-g04s1-113-b01b02-fullfix-article9-exam-text61-rights-component-9storyparent-hold-v1.json');
const science=get('data/review/p12-g04s1-113-b01b02-fullfix-science-directKP-existing-gate70-accepted-4specific-hold-v1.json');
test('61 original text-only rights components accepted for verified school regular examinations; nine parent story rights remain HOLD',()=>{
  assert.equal(rights.rows_rights_accepted.length,61);
  assert.equal(rights.rows_rights_parent_hold.length,9);
  assert.deepEqual(rights.accepted_breakdown,{B01:51,B02:10});
  assert.deepEqual(rights.parent_hold_breakdown,{B01_MingyiLake5:5,B02_ZhongxiaoCamping4:4});
  const src=new Set(science.rows_accepted.map(x=>x.source_slot_id));
  assert.equal(src.size,70);
  const rows=[...rights.rows_rights_accepted,...rights.rows_rights_parent_hold];
  assert.equal(new Set(rows.map(x=>x.source_slot_id)).size,70);
  assert.ok(rows.every(x=>src.has(x.source_slot_id)));
  assert.ok(rights.rows_rights_accepted.every(x=>x.rights_component_accepted &&
    x.rights_license_status==='REGULATED_EXAM_QUESTION_ART9' &&
    x.school_original_regulated_exam_identity_derived_from_connected_original_pdf_text_layer));
  assert.ok(rights.rows_rights_parent_hold.every(x=>!x.rights_component_accepted &&
    x.rights_exception?.endsWith('NOT_VERIFIED')));
});
test('No scan image/third-party/teacher key copied, no operator signature or admission upgrade',()=>{
  assert.equal(rights.source_pdf_or_image_republished,false);
  assert.equal(rights.original_school_teacher_answer_reproduced,false);
  assert.equal(rights.operator_exact_source_consent,false);
  assert.equal(rights.admission_ready_new,0);
  assert.equal(rights.published_new,0);
  assert.ok([...rights.rows_rights_accepted,...rights.rows_rights_parent_hold].every(x=>!x.admission_ready&&!x.published_new&&!x.operator_exact_release_approved));
});
