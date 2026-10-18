import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const prefixes=['113','114-b04','114-e01','g03-context'];
const shardNames=prefixes.map(p=>'p12-g04s1-113-main750-sourcefiles-'+p+'-shard-v1.json');
const screenNames=['p12-g04s1-113-native59-vs-public113-114-stemfingerprint-screen-v1.json','p12-g04s1-113-native59-vs-public114-b04-309-stemfingerprint-screen-v1.json','p12-g04s1-113-native59-vs-public114-e01-76-stemfingerprint-screen-v1.json','p12-g04s1-113-native59-vs-public-g03-context251-stemfingerprint-screen-v1.json'];
const shards=shardNames.map(read),screens=screenNames.map(read);
const source=read('p12-g04s1-113-native59-original-source-private-wording-fingerprints-v1.json');
const global=read('p12-g04s1-113-native59-all750-original-stem-collisions-and-legacylineage-v1.json');
const historical=read('p12-g04s1-113-legacy20-already-public-exact-originalpdf-lineage-v1.json');
const original=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
test('actual current main has 750 publicly represented answer slots in four frozen sets of files',()=>{
 assert.deepEqual(shards.map(z=>z.summary.answer_slots),[114,309,76,251]);
 assert.equal(shards.reduce((a,z)=>a+z.summary.answer_slots,0),750);
 assert.deepEqual(shards.map(z=>z.summary.files),[13,9,11,5]);
 assert.equal(shards.flatMap(z=>z.files).length,38);
 assert.equal(new Set(shards.flatMap(z=>z.files.map(f=>f.path))).size,38);
 for(const z of shards) {
  assert.equal(z.snapshot_main_sha,'4d56dd077919ce4ca1a5e2cfeaa7f214942c82d8');
  assert.equal(z.files.reduce((sum,f)=>sum+f.answer_slots,0),z.summary.answer_slots);
 }
 assert.equal(shards[3].files.find(f=>f.path.includes('certified-context-groups-content')).answer_slots,76);
});
test('59 original question source fingerprint screens compare every one of 750 active public answer slots',()=>{
 assert.equal(source.records.length,59);
 assert.deepEqual(screens.map(x=>x.summary.published_original_answer_slots),[114,309,76,251]);
 assert.ok(screens.every(z=>z.records.length===59));
 assert.equal(screens.reduce((sum,z)=>sum+z.summary.source_compare_pairs,0),59*750);
 assert.deepEqual(screens.map(z=>z.summary.exact_normalized_stem_pair_matches),[0,7,0,7]);
 assert.ok(screens.every(z=>z.summary.formal_duplicate_gate_completed_new===0));
});
test('14 exact normalized stems include 13 truly already-public exam items and one substantive MC distractor variant',()=>{
 assert.equal(global.records.length,14);
 assert.equal(new Set(global.records.map(z=>z.unpublished113_source_slot_id)).size,14);
 assert.equal(global.summary.all_confirmed_duplicate_suppression,13);
 assert.equal(global.summary.legacy_113_same_original_pdf_duplicate_suppression,7);
 assert.equal(global.summary.newer_114_duplicate_suppression,6);
 assert.equal(global.summary.same_stem_but_different_distractor_options_retain_candidate,1);
 assert.equal(global.summary.native59_not_current_exact_duplicate_after_750_audit,46);
 assert.ok(global.records.filter(z=>z.main_student_bank_action==='SOURCE_LINEAGE_ONLY_DO_NOT_REPUBLISH'||z.result==='SOURCE_LINEAGE_ONLY_DO_NOT_REPUBLISH').length===13);
 assert.equal(global.records.filter(z=>z.main_student_bank_action==='RETAIN_CANDIDATE_OTHER_GATES_STILL_OPEN').length,1);
 assert.equal(global.summary.admission_ready_new,0);
 assert.equal(global.summary.published_new,0);
});
test('historical G04 legacy TF questions from two registered 113 PDFs remain published and are never reimported',()=>{
 assert.equal(historical.rows.length,20);
 assert.equal(new Set(historical.rows.map(z=>z.source_slot_id_with_113_identity)).size,20);
 assert.equal(historical.summary.matching_registered_113_pdfs,2);
 const shaMap=new Map(original.original_source_records.map(z=>[z.source_id,z.original_pdf_sha256]));
 for(const row of historical.rows) {
  assert.equal(row.original_pdf_sha256,shaMap.get(row.original_source_registry_id));
  assert.equal(row.already_main_public,true);
  assert.equal(row.not_new_admission,true);
 }
 assert.equal(historical.summary.native59_same_pdf_previously_published,7);
 assert.equal(historical.summary.new_published,0);
});
