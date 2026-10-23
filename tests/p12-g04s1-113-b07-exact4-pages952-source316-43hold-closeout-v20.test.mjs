import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../data/review/'+name,import.meta.url),'utf8'));
const v19=read('p12-g04s1-113-main-published312-source-suppression-readback-v19.json');
const v20=read('p12-g04s1-113-main-published316-source-suppression-readback-v20.json');
const prior=read('p12-g04s1-113-b07-dependent50-exact3-published-47hold-pages-live-closeout-v1.json');
const result=read('p12-g04s1-113-b07-original50-7published-43hold-pages-live-closeout-v2.json');
const source=read('p12-g04s1-113-b07-dependent50-originalpdf-ninepages-nativebbox-science-kp-hold-v1.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
test('113 B07 v19 immutable 312 -> v20 316 exact source suppression and 952 Pages approved source IDs',()=>{
 assert.equal(v19.current_113_source_slots_published,312);assert.equal(v19.public_site_all_answer_slots,948);
 assert.equal(v20.predecessor_append_only,'data/review/p12-g04s1-113-main-published312-source-suppression-readback-v19.json');
 assert.equal(v20.current_113_source_slots_published,316);assert.equal(v20.public_site_all_answer_slots,952);
 assert.deepEqual(v20.all_unique_published_source_slot_ids.slice(0,312),v19.all_unique_published_source_slot_ids);
 assert.deepEqual(v20.all_unique_published_source_slot_ids.slice(312),v20.incremental_b07_exact4_source_ids);
 assert.equal(new Set(v20.all_unique_published_source_slot_ids).size,316);
 assert.deepEqual(v20.incremental_b07_exact4_source_ids,[
  'SCI_G04_S1_113_MID_013|S07|G02|MC|002',
  'SCI_G04_S1_113_MID_014|S03|G07|MC|001',
  'SCI_G04_S1_113_MID_014|S03|G07|MC|002',
  'SCI_G04_S1_113_MID_014|S03|G07|MC|003']);
 assert.equal(v20.public_main_commit,'feacc1c031f0c5edd73c7cd1e7954ecad355ee2f');
 assert.equal(v20.public_Pages_live_run_id,39931840976);assert.equal(v20.public_Pages_live_E2E_success,true);
 assert.deepEqual([v20.site_current_TF,v20.site_current_MC,v20.site_context_groups],[476,341,36]);
 assert.equal(v20.B01_B06_prior_closeouts_unchanged,true);
 assert.equal(v20.source_PR124_not_merged,true);
 assert.equal(v20.B07_original50_retained_HOLD,43);
});
test('B07 original 50 conserved 7 released, 43 held, Q305 Q325 six figures and separate TFMC1 not published',()=>{
 assert.equal(source.records.length,50);assert.equal(prior.remaining_HOLD,47);
 assert.equal(result.original50_count,50);assert.equal(result.published_total_in50,7);assert.equal(result.remaining_HOLD_in50,43);
 assert.equal(result.dispositions.length,50);
 const published=result.dispositions.filter(x=>x.public_status==='PUBLISHED_VERIFIED_MAIN_PAGES_E2E');
 const held=result.dispositions.filter(x=>x.public_status==='RETAIN_FROZEN_HOLD');
 assert.deepEqual(published.map(x=>x.worklist_ordinal),[306,324,326,327,335,336,337]);
 assert.equal(held.length,43);
 for(const x of result.dispositions){const s=source.records.find(y=>y.worklist_ordinal===x.worklist_ordinal);assert.ok(s);
  assert.equal(x.original_native_source_slot_id,s.original_native_source_slot_id);
  if(x.public_status==='PUBLISHED_VERIFIED_MAIN_PAGES_E2E')assert.ok(v20.all_unique_published_source_slot_ids.includes(x.original_native_source_slot_id));
  else assert.ok(!v20.incremental_b07_exact4_source_ids.includes(x.original_native_source_slot_id));
 }
 for(const n of [305,325,314,315,316,317,318,319,320,321,322,323,328,329,330])assert.ok(held.some(x=>x.worklist_ordinal===n),'frozen hold missing ordinal '+n);
 assert.equal(result.separate_B07_FINAL_TFMC1_not_in_50_HOLD,'SCI_G04_S1_113_FINAL_010|S3|TF|7');
 assert.equal(result.B01_B06_not_reopened,true);assert.equal(result.source_PR124_draft_unmerged,true);
});
test('ALL29 source master updates precisely Shihu +1 Lushang +3, never all29 certified',()=>{
 assert.equal(master.published_main_sha,v20.public_main_commit);
 assert.equal(master.published_snapshot_ref,'data/review/p12-g04s1-113-main-published316-source-suppression-readback-v20.json');
 assert.equal(master.known_published_source_positions,316);
 assert.equal(master.paper_records.reduce((n,x)=>n+x.published_count,0),316);
 assert.equal(master.paper_records.find(x=>x.paper_id==='SCI_G04_S1_113_MID_013').published_count,21);
 assert.equal(master.paper_records.find(x=>x.paper_id==='SCI_G04_S1_113_MID_014').published_count,22);
 assert.equal(master.all29_complete,false);assert.equal(master.formally_closed_papers,0);
 assert.equal(master.last_public_closeout.retained_B07_HOLD,43);
});
