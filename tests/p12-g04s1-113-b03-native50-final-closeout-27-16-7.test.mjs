import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const parse=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const receipt=parse("../data/review/p12-g04s1-113-b03-native50-final-closeout-27published-16hold-7legacy-v1.json");
const bank=parse("../site/data/question-bank/p12-g04s1-113-b03-native27-standalone-public-v1.json");
const legacy=parse("../site/data/question-bank/approved-historical-ox-v4.json");
test("B03 preserves all 50 original source IDs in frozen order: 27 Pages-published, 15+1 HOLD and 7 pre-public",()=>{
 assert.equal(receipt.status,"CLOSED");
 assert.equal(receipt.rows.length,50);
 assert.deepEqual(receipt.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+101));
 assert.equal(new Set(receipt.rows.map(x=>x.source_id)).size,50);
 assert.deepEqual(receipt.original_50_dispositions,{
  PUBLISHED_B03_EXACT27_MAIN_PAGES_VERIFIED:27,
  HOLD_PRIOR_SCIENCE_OR_KP:15,
  HOLD_NEAR_DUPLICATE_SOURCE:1,
  SUPPRESSED_ALREADY_PUBLISHED_LEGACY_MINGYI:7
 });
 assert.equal(receipt.not_all29_papers_closed,true);
 assert.equal(receipt.B01_B02_closed_and_unchanged,true);
 assert.equal(receipt.B04_not_started,true);
});
test("27 live exact new originals are precisely main bank IDs, with Pages 3/3 pass and preserved existing HOLD",()=>{
 assert.deepEqual(receipt.rows.filter(x=>x.state==="PUBLISHED_B03_EXACT27_MAIN_PAGES_VERIFIED").map(x=>x.source_id),
   bank.blocks.map(x=>x.source_slot_id));
 assert.deepEqual(receipt.formal_three_metrics,{
  FORMAL_SCIENCE_KP_APPROVED_new:27,
  ADMISSION_READY_new:27,
  PUBLISHED_new:27
 });
 assert.equal(receipt.pages_run,39722474838);
 assert.equal(receipt.pages_test,"PASS");
 assert.equal(receipt.pages_deploy,"PASS");
 assert.equal(receipt.pages_actual_chromium_E2E,"PASS");
 assert.equal(receipt.previous_site_answer_slots,842);
 assert.equal(receipt.live_verified_site_answer_slots,869);
 assert.equal(receipt.before_113_published_source_ids,206);
 assert.equal(receipt.after_113_published_source_ids_expected,233);
 assert.equal(receipt.retained_HOLD_16_can_recover_only_under_existing_gates,true);
});
test("seven Mingyi originals already public, not reissued as B03 new items",()=>{
 const prior=receipt.rows.filter(x=>x.state==="SUPPRESSED_ALREADY_PUBLISHED_LEGACY_MINGYI");
 assert.equal(prior.length,7);
 for(const row of prior){
  assert.ok(legacy.blocks.some(b=>b.id===row.legacy_public_student_id));
  assert.ok(!bank.blocks.some(b=>b.source_slot_id===row.source_id));
 }
 assert.equal(receipt.school_teacher_answer_not_authenticated,true);
 assert.equal(receipt.source_original_PDFs_not_published,true);
});
