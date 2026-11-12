import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const he=r('p12-g04s1-113-heshun-final001-standalone23-science-directkp-screen-v1.json');
const ne=r('p12-g04s1-113-neian-mid006-standalone24-science-directkp-screen-v1.json');
const queue=r('p12-g04s1-113-two-school24-science-directkp-hold-routing-after810-v1.json');
const pub=r('p12-g04s1-113-main-published174-source-suppression-readback-v11.json');
test('only old 24 science or direct KP holds routed, never previously published, retain exact original disposition',()=>{
 const previous=[...he.individual_holds.map(x=>({id:x.source_slot_id,status:x.disposition,why:x.science_kp_hold_reason})),...ne.hold_records.map(x=>({id:x.source_slot_id,status:x.status,why:x.reason}))];
 const byId=new Map(previous.map(x=>[x.id,x]));
 const published=new Set(pub.all_unique_published_source_slot_ids);
 assert.equal(queue.records.length,24);assert.equal(previous.length,24);
 assert.equal(new Set(queue.records.map(x=>x.slot)).size,24);
 assert.equal(queue.summary.school_heshun_HOLD,15);
 assert.equal(queue.summary.school_neian_HOLD,9);
 assert.equal(queue.summary.first_missing_direct_KP,16);
 assert.equal(queue.summary.first_missing_science_answer_uniqueness,8);
 assert.equal(queue.summary.new_published,0);
 assert.equal(queue.summary.new_admission_ready,0);
 assert.equal(queue.summary.new_formal_science_kp_approved,0);
 assert.equal(queue.publication_baseline.student_site_answer_slots,810);
 assert.equal(queue.publication_baseline.public_113_source_slots,174);
 for(const row of queue.records){
  assert.ok(!published.has(row.slot),'already published source mistakenly treated as new HOLD');
  assert.equal(row.current_status,'HOLD');
  assert.equal(row.ADMISSION_READY,false);
  assert.equal(row.PUBLISHED,false);
  assert.equal(row.operator_approval_to_overturn_previous_science_kp_hold,false);
  assert.equal(row.prior,byId.get(row.slot)?.status);
  assert.equal(row.reason,byId.get(row.slot)?.why);
  assert.equal(row.first_missing_gate,row.prior.includes('SCIENCE')?'SCIENCE_UNIQUE_ANSWER':'CANONICAL_KP_DIRECT');
 }
 assert.equal(queue.highest_priority_exception_order.length,8);
 assert.equal(new Set(queue.highest_priority_exception_order).size,8);
 assert.ok(queue.highest_priority_exception_order.every(id=>queue.records.find(x=>x.slot===id)?.first_missing_gate==='SCIENCE_UNIQUE_ANSWER'));
});
