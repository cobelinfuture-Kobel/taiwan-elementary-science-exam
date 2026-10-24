import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = n => JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const recovery=read('p12-g04s1-113-missing15-legacy411-311-reuse-preflight-v1.json');
const gap=read('p12-g04s1-113-missing15-paper-inventory-gap-checkpoint-v1.json');
const union=read('p12-g04s1-113-all29-411-unique-question-review-union-v4.json');
const published=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
test('missing15 legacy provenance recovers 202 review keys and 102 model-only keys, not final slot admission',()=>{
  assert.equal(recovery.records.length,15);
  assert.equal(recovery.records.reduce((n,x)=>n+x.preexisting_411_paper_review_rows,0),202);
  assert.equal(recovery.records.reduce((n,x)=>n+x.preexisting_311_standalone_model_rows,0),102);
  assert.equal(recovery.records.filter(x=>x.scan_only).length,5);
  assert.equal(recovery.summary.legacy_review_rows_newly_certified_exact_slot,0);
  assert.equal(recovery.summary.legacy_review_rows_newly_formal_science_kp,0);
  assert.equal(recovery.summary.remaining_paper_full_exact_response_slots_certified,0);
  const keys=recovery.records.flatMap(x=>x.preexisting_review_identity_keys.map(y=>y.review_id));
  assert.equal(new Set(keys).size,202);
  const missingPapers=new Set(gap.records.map(x=>x.paper_id));
  assert.ok(recovery.records.every(x=>missingPapers.has(x.source_paper_id)));
  assert.equal(union.rows.filter(x=>missingPapers.has(x.paper_id)).length,202);
});
test('published provenance is preserved without importing legacy candidates',()=>{
  assert.equal(recovery.records.reduce((n,x)=>n+x.published_source_ids_count,0),51);
  assert.equal(recovery.summary.previously_published113_source_ids_in_missing15,51);
  assert.equal(published.all_unique_published_source_slot_ids.length,114);
  assert.equal(published.public_total_answer_slots,750);
  assert.equal(recovery.summary.legacy_review_rows_newly_formal_science_kp,0);
});
