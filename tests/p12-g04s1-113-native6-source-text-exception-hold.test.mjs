import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const review = n => JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url), 'utf8'));
const six = review('p12-g04s1-113-native6-original-text-science-kp-targeted-resolution-v1.json');
const published = review('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
const originalEight = review('p12-g04s1-113-native46-next11-science-kp-source-evidence-plus8-exceptions-v1.json');
const repairs = review('p12-g04s1-113-native46-two-original-visual-textcontamination-repairs-v1.json');
const authority = JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));

test('six science/direct-KP exceptions are traced to original 8 without elevating admission',()=>{
 assert.equal(six.records.length,6);
 assert.deepEqual(six.summary,{six_targeted_exception_cases:6,source_text_science_and_direct_kp_supported_provisionally:2,hold_direct_kp:3,hold_science_assumption:1,new_formal_science_kp_approved:0,new_admission_ready:0,new_published:0});
 const olds=new Set(originalEight.remaining_exceptions.map(x=>x.source_slot_id));
 const rep=new Set(repairs.records.map(x=>x.source_slot_id));
 const pub=new Set(published.all_unique_published_source_slot_ids);
 const canonical=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(canonical.size,48);
 for(const x of six.records){
  assert.ok(olds.has(x.source_slot_id));
  assert.ok(!rep.has(x.source_slot_id));
  assert.ok(!pub.has(x.source_slot_id));
  assert.ok(canonical.has(x.original_kp_candidate));
  assert.equal(x.source_sha256_independent_bytes_reverification,false);
  assert.equal(x.original_pdf_full_visual_item_readback_this_round,false);
  assert.equal(x.formal_science_kp_approved,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
 }
 assert.equal(six.records.filter(x=>x.triage.startsWith('SOURCE_TEXT_SCIENCE_DIRECT_KP_SUPPORTED_')).length,2);
 assert.equal(six.records.filter(x=>x.triage==='HOLD_DIRECT_KP_NOT_UNAMBIGUOUS').length,3);
 assert.equal(six.records.filter(x=>x.triage==='HOLD_SCIENCE_UNIQUE_ASSUMPTION').length,1);
});
