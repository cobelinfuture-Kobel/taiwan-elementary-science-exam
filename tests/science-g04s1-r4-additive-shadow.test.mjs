import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const selector=load('site/data/authority/science-g03-g04-selector-v2.json');
const v2=load('data/governance/science-g04s1-kp-additive-r4-shadow-v1.json');
const remap=load('data/review/science-g04s1-kp-additive-r4-remap-queue-v1.json');
const original=selector.units.filter(u=>u.grade===4&&u.semester===1);
const rows=selector.units.flatMap(u=>u.knowledge_points);
test('R4 preserves the frozen 187 selector and 45 G04S1 canonical IDs',()=>{
  assert.equal(selector.schema_version,'SCIENCE_G03_G04_PUBLIC_SELECTOR_V2');
  assert.equal(rows.length,187);
  assert.deepEqual(original.map(u=>u.knowledge_points.length),[11,12,10,12]);
  assert.equal(v2.baseline.kp_count,45);
  assert.equal(v2.baseline.sha256,'ac2122b09caa56afec373303c8a6169b57353bff06794831b508c3a3f5b5e4d5');
  assert.equal(v2.runtime_activation.enabled,false);
  assert.equal(v2.runtime_activation.existing_student_questions_untouched,true);
});
test('three independently assessable KPs are additive with unique IDs',()=>{
  assert.equal(v2.status,'OPERATOR_APPROVED_SHADOW_ONLY_NOT_ACTIVE');
  assert.equal(v2.private_v2.kp_count,48);
  assert.equal(v2.private_v2.four_semester_future_total,190);
  assert.match(v2.private_v2.sha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(v2.added_kps.map(x=>x.canonical_kp_id),['sci_g04s1_01_12','sci_g04s1_02_13','sci_g04s1_02_14']);
  assert.deepEqual(v2.added_kps.map(x=>x.source_pdf_pages),[[21],[45,46],[46]]);
  const old=new Set(rows.map(x=>x.canonical_kp_id)),ids=new Set(rows.map(x=>x.kp_id));
  for(const kp of v2.added_kps){
    assert.equal(old.has(kp.canonical_kp_id),false);
    assert.equal(ids.has(kp.kp_id),false);
    assert.equal(kp.approved,true);
    assert.deepEqual(Object.keys(kp).sort(),['activity','approved','canonical_kp_id','kp_id','r3_case','source_pdf_pages','title','unit_id']);
    old.add(kp.canonical_kp_id);ids.add(kp.kp_id);
  }
  assert.equal(old.size,190);assert.equal(ids.size,190);
  assert.equal(v2.do_not_publish_full_statements,true);
});
test('source remap remains on hold until original scan science and KP gates pass',()=>{
  assert.equal(remap.known_exact_candidate_matches.length,1);
  const row=remap.known_exact_candidate_matches[0];
  assert.equal(row.source_id,'SCI_G04_S1_114_MID_002|S1|MC|010');
  assert.equal(row.old_proposed_canonical_kp_id,'sci_g04s1_02_02');
  assert.equal(row.new_proposed_canonical_kp_id,'sci_g04s1_02_13');
  assert.equal(row.source_visual_bbox_certified,false);
  assert.equal(row.site_admitted,false);
  assert.equal(remap.public_admission_count,0);
  assert.equal(remap.published_question_changes,0);
  assert.equal(remap.reinspection_not_claimed_complete,true);
});
