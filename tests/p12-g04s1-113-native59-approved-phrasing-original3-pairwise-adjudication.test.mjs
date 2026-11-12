import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const old=read('p12-g04s1-113-native59-approved-phrasing-variant-retriage-v2.json');
const now=read('p12-g04s1-113-native59-original-wording-3pair-verified-v3.json');
const prev=read('p12-g04s1-113-native59-published499-semantic-dedup-source-watch-v1.json');
const publicSource=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');

test('operator-approved phrasing Gate: original full-source comparison retains 2 genuinely reworded, suppresses 1 exact',()=>{
 assert.equal(now.records.length,59);
 assert.deepEqual(new Set(now.records.map(r=>r.source_slot_id)),new Set(old.records.map(r=>r.source_slot_id)));
 assert.equal(now.summary.source_pairwise_verified,3);
 assert.equal(now.summary.verified_exact_duplicate_to_merge,1);
 assert.equal(now.summary.verified_distinct_wording_candidate,2);
 assert.equal(now.summary.other_seven_near_candidates,7);
 assert.equal(now.summary.other_forty_nine_waiting,49);
 const mapped=new Map(now.records.map(x=>[x.source_slot_id,x]));
 const exact=mapped.get('SCI_G04_S1_113_FINAL_005|S1|TF|008');
 assert.equal(exact.pair_adjudication.main_block,'P12_B04_G04S1_B04_TF_049');
 assert.equal(exact.pair_adjudication.original_pdf_normalized_text_identical_to_main,true);
 assert.equal(exact.current_duplicate_handling,'VERIFIED_IDENTICAL_ORIGINAL_STEM_SUPPRESS_DUPLICATE');
 assert.equal(exact.source_lineage_only,true);
 for(const id of ['SCI_G04_S1_113_MID_017|S1|TF|012','SCI_G04_S1_113_FINAL_003|S2|TF|015']){
  const a=mapped.get(id);
  assert.equal(a.current_duplicate_handling,'VERIFIED_DIFFERENT_PHRASING_SAME_SCIENCE_CANDIDATE');
  assert.equal(a.pair_adjudication.original_pdf_normalized_text_identical_to_main,false);
  assert.equal(a.source_lineage_only,false);
  assert.equal(a.admission_ready,false);
 }
});
test('prior source history and frozen published totals preserved; no automatic admission',()=>{
 assert.equal(prev.records.length,10);
 assert.equal(now.summary.complete_student_bank_duplicate_gate_new,0);
 assert.equal(now.summary.admission_ready_new,0);
 assert.equal(now.summary.published_new,0);
 assert.equal(publicSource.newly_published_113_slots,114);
 assert.equal(publicSource.public_total_answer_slots,750);
 assert.ok(now.records.every(x=>x.full_original_gates_unchanged));
 assert.ok(now.records.every(x=>!x.admission_ready&&!x.published));
});
