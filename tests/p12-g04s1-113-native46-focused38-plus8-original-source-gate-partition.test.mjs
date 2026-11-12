import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const prior=read('p12-g04s1-113-native46-focused27-science-unique-directkp-source-evidence-v1.json');
const more=read('p12-g04s1-113-native46-next11-science-kp-source-evidence-plus8-exceptions-v1.json');
const live=read('p12-g04s1-113-native46-post750-source-originaltext-options-gate-v1.json');
const authority=JSON.parse(fs.readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
test('27+11 direct source-reviewed science/KP evidence and 8 exception cases partition all 46 source items',()=>{
 const full=new Set(live.records.map(r=>r.source_slot_id));
 const rows=[...prior.records,...more.records,...more.remaining_exceptions];
 assert.equal(rows.length,46);
 assert.equal(new Set(rows.map(r=>r.source_slot_id)).size,46);
 assert.deepEqual(new Set(rows.map(r=>r.source_slot_id)),full);
 assert.equal(prior.records.length,27);
 assert.equal(more.records.length,11);
 assert.equal(more.remaining_exceptions.length,8);
 const kps=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(kps.size,48);
 for(const row of prior.records) {
  assert.ok(kps.has(row.direct_canonical_kp_id));
  assert.equal(row.formal_science_kp_approved,false);
  assert.equal(row.admission_ready,false);
 }
 for(const row of more.records) {
  assert.ok(kps.has(row.direct_KP_id));
  assert.equal(row.formal_science_kp_approved,false);
  assert.equal(row.admission_ready,false);
  assert.equal(row.rights_gate_cleared,false);
 }
});
test('only narrow original source exceptions held: two text columns, three direct KP, three science assumptions',()=>{
 const issues=more.remaining_exceptions;
 assert.equal(issues.filter(x=>x.first_missing_evidence.startsWith('SOURCE_EXACT_')).length,2);
 assert.equal(issues.filter(x=>x.first_missing_evidence.startsWith('DIRECT_')).length,3);
 assert.equal(issues.filter(x=>x.first_missing_evidence.startsWith('SCIENCE_')).length,3);
 assert.ok(issues.every(x=>x.disposition==='HOLD_ONLY_THIS_ITEM_NO_NEW_MANDATORY_REVIEW_ROUND'));
 assert.equal(more.summary.combined_independent_science_direct_kp_source_evidence,38);
 assert.equal(more.summary.new_formal_science_kp_approved,0);
 assert.equal(more.summary.new_admission_ready,0);
 assert.equal(more.summary.new_published,0);
});
