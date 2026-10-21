import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const parse=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const receipt=parse("../data/review/p12-g04s1-113-b02-native50-final-closeout-21published-28hold-1dedup-v1.json");
const bank=parse("../site/data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json");
test("B02 exactly 50 immutable native source positions close: 21 public, 26 old HOLD, 2 new HOLD, 1 B01 duplicate",()=>{
 assert.equal(receipt.batch_closed,true);
 assert.equal(receipt.original_ALL29_papers_closed,false);
 assert.equal(receipt.ALL29_complete,false);
 assert.equal(receipt.rows.length,50);
 assert.deepEqual(receipt.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+1));
 assert.equal(new Set(receipt.rows.map(x=>x.source_id)).size,50);
 assert.deepEqual(receipt.original_50_dispositions,{
  HOLD_EXISTING_26_GATE_EXCEPTION:26,
  PUBLISHED_B02_EXACT21_MAIN_PAGES_VERIFIED:21,
  SUPPRESSED_ALREADY_B01_IDENTICAL:1,
  HOLD_NEW_2_SCIENCE_KP:2
 });
 assert.equal(receipt.all_28_HOLD_retained_for_possible_later_recovery,true);
 assert.equal(receipt.old_26_HOLD_reasons_preserved,true);
 assert.equal(receipt.two_extra_specific_HOLD_reasons_preserved,true);
 assert.equal(receipt.preexisting_B01_first50_CLOSEOUT_preserved,true);
 assert.equal(receipt.any_B03_started,false);
});
test("PUBLISHED is measured by exact operator 21 student IDs and real Pages Chromium E2E; no 28 HOLD student question",()=>{
 assert.deepEqual(receipt.rows.filter(x=>x.disposition==="PUBLISHED_B02_EXACT21_MAIN_PAGES_VERIFIED").map(x=>x.source_id),
  bank.blocks.map(x=>x.source_slot_id));
 assert.deepEqual(receipt.published_source_21_ordered_ids,bank.blocks.map(x=>x.source_slot_id));
 assert.deepEqual([receipt.formal_three_metrics.FORMAL_SCIENCE_KP_APPROVED_new,
 receipt.formal_three_metrics.ADMISSION_READY_new,
 receipt.formal_three_metrics.PUBLISHED_new],[21,21,21]);
 assert.equal(receipt.after_B02_site_answer_positions,842);
 assert.equal(receipt.before_B02_site_answer_positions,821);
 assert.equal(receipt.after_B02_public_113_source_ids_expected,206);
 assert.equal(receipt.before_B02_public_113_source_ids,185);
 assert.equal(receipt.live_github_pages_E2E_run,39627974319);
 assert.equal(receipt.github_pages_CI_test,"PASS");
 assert.equal(receipt.github_pages_deploy,"PASS");
 assert.equal(receipt.github_pages_chromium_E2E,"PASS");
 assert.equal(bank.blocks.filter(x=>x.type==="tf").length,15);
 assert.equal(bank.blocks.filter(x=>x.type==="mcq").length,6);
 assert.ok(!bank.blocks.some(x=>receipt.rows.filter(r=>r.disposition.startsWith("HOLD")).some(r=>r.source_id===x.source_slot_id)));
});
test("B01 identical original source kept as crossschool lineage only, no duplicate publicly added",()=>{
 const dupe=receipt.rows.filter(x=>x.disposition==="SUPPRESSED_ALREADY_B01_IDENTICAL");
 assert.equal(dupe.length,1);
 assert.equal(dupe[0].source_id,"SCI_G04_S1_113_MID_004|S2|TF|11");
 assert.equal(receipt.B01_canonical_public_source_of_duplicate,"SCI_G04_S1_113_MID_001|S01|TF|015");
 assert.ok(!bank.blocks.some(x=>x.source_slot_id===dupe[0].source_id));
 assert.equal(receipt.source_PDF_images_excluded,true);
 assert.equal(receipt.school_teacher_answer_key_not_claimed,true);
 assert.equal(receipt.original_frozen_KP_unmodified,true);
});
