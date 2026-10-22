import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const r=read("../data/review/p12-g04s1-113-b05-native50-final-closeout-24published-25hold-1alias-v1.json");
const b=read("../site/data/question-bank/p12-g04s1-113-b05-native24-standalone-public-v1.json");
test("B05 201–250 frozen original source positions conserved with 24 Pages-live, 25 HOLD, one 114 choice alias",()=>{
 assert.equal(r.status,"CLOSED");assert.equal(r.rows.length,50);
 assert.deepEqual(r.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+201));
 assert.equal(new Set(r.rows.map(x=>x.source_id)).size,50);
 assert.deepEqual(r.original_50_dispositions,{
  PUBLISHED_B05_EXACT24_MAIN_PAGES_VERIFIED:24,
  HOLD_ORIGINAL_SCIENCE_KP_PARENT_RIGHTS:24,
  HOLD_SCIENCE_QUALIFIER_CONTEXT:1,
  SUPPRESSED_ALREADY_PUBLIC_114_OPTION_REORDER_ALIAS:1});
 assert.deepEqual(r.rows.filter(x=>x.source_disposition.startsWith("PUBLISHED")).map(x=>x.source_id),b.blocks.map(x=>x.source_slot_id));
 assert.equal(r.all_25_HOLD_retained,true);
 assert.equal(r.one_114_exact_alias_retained,true);
});
test("Formal Gate three metrics, PR main readback, live Pages browser and source/rights scopes are explicit",()=>{
 assert.deepEqual(r.formal_metrics,{FORMAL_SCIENCE_KP_APPROVED_new:24,ADMISSION_READY_new:24,PUBLISHED_new:24});
 assert.deepEqual([r.before_113_canonical_source_count,r.after_113_canonical_source_count],[269,293]);
 assert.deepEqual([r.before_site_answer_slots,r.after_live_site_answer_slots,r.after_live_site_TF,r.after_live_site_MC,r.after_live_context_groups],[905,929,471,323,36]);
 assert.equal(r.formal_release_pr,160);assert.equal(r.pages_live_run_id,39801726428);
 assert.deepEqual([r.CI_main,r.pages_test,r.pages_deploy,r.pages_real_browser_E2E],["PASS","PASS","PASS","PASS"]);
 assert.equal(r.PUBLISHED_gate_checked_only_after_actual_E2E,true);
 assert.equal(r.original_teacher_answer_not_authenticated,true);
 assert.equal(r.source_original_PDFs_scans_third_party_figure_not_published,true);
 assert.equal(r.original_113_frozen_48_KP_not_modified,true);
 assert.equal(r.prior_B01_B02_B03_B04_closed_unchanged,true);
 assert.equal(r.all29_source_papers_not_all_closed,true);
 assert.equal(r.B06_not_started,true);
 assert.ok(r.rows.filter(x=>!x.source_disposition.startsWith("PUBLISHED")).every(x=>x.student_id===null));
});
