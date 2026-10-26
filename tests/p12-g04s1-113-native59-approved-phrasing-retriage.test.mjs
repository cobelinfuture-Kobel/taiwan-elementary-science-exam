import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const source=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const previous=read('p12-g04s1-113-native59-published499-semantic-dedup-source-watch-v1.json');
const next=read('p12-g04s1-113-native59-approved-phrasing-variant-retriage-v2.json');
const pub=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
test('new operator-approved duplicate approach retains 59 source identities and reopens 3 + 7 variants',()=>{
 const older=new Map(previous.records.map(x=>[x.unpublished_113_source_slot_id,x]));
 assert.equal(source.records.length,59);
 assert.equal(next.records.length,59);
 assert.deepEqual(new Set(next.records.map(x=>x.source_slot_id)),new Set(source.records.map(x=>x.source_slot_id)));
 assert.equal(next.records.filter(x=>x.new_duplicate_triage==='REOPEN_SAME_PROPOSITION_DIFFERENT_PHRASING_CANDIDATE').length,3);
 assert.equal(next.records.filter(x=>x.new_duplicate_triage==='REOPEN_KP_OVERLAP_OR_CROSS_FORMAT_CANDIDATE').length,7);
 assert.equal(next.records.filter(x=>x.new_duplicate_triage==='NO_MATCH_FROM_499_SCREEN_BUT_COMPLETE_DUPLICATE_GATE_PENDING').length,49);
 assert.equal(next.summary.reopened_candidate_total,10);
 for(const x of next.records){
  assert.equal(x.only_kp_or_true_science_conclusion_is_not_duplicate,true);
  assert.equal(x.exact_same_or_option_order_only_still_suppress,true);
  assert.equal(x.semantic_duplicate_gate_final_complete,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
  if(x.previous_original_published_match){
   const y=older.get(x.source_slot_id);
   assert.equal(x.previous_original_published_match.old_status,y.status);
   assert.equal(x.previous_original_published_match.question_id,y.already_public_block_id);
  }
 }
});
test('original full-source science, KP and rights requirements remain unresolved, site totals unchanged',()=>{
 assert.equal(next.summary.automatic_new_admissions_by_policy,0);
 assert.equal(next.summary.semantic_duplicate_formal_completed_new,0);
 assert.equal(next.summary.formal_science_kp_approved_new,0);
 assert.equal(next.summary.admission_ready_new,0);
 assert.equal(next.summary.published_new,0);
 assert.equal(next.summary.published113_baseline_unchanged,114);
 assert.equal(next.summary.public_site_total_unchanged,750);
 assert.equal(pub.newly_published_113_slots,114);
 assert.equal(pub.public_total_answer_slots,750);
 assert.ok(next.records.every(x=>!x.science_unique_and_kp_formal_gate_complete&&!x.rights_gate_complete));
});
