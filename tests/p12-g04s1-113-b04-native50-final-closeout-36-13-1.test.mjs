import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const r=read("../data/review/p12-g04s1-113-b04-native50-final-closeout-36published-13hold-1duplicate-v1.json");
const bank=read("../site/data/question-bank/p12-g04s1-113-b04-native36-standalone-public-v1.json");
test("B04 exact first 50 source positions close and original source order 151-200 conserved",()=>{
 assert.equal(r.status,"CLOSED");
 assert.equal(r.rows.length,50);
 assert.deepEqual(r.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+151));
 assert.equal(new Set(r.rows.map(x=>x.source_id)).size,50);
 assert.deepEqual(r.original_50_dispositions,{
 HOLD_ORIGINAL_SCIENCE_OR_KP:12,PUBLISHED_B04_EXACT36_MAIN_PAGES_VERIFIED:36,
 SUPPRESSED_ALREADY_PUBLIC_ALIAS:1,HOLD_SCIENCE_QUALIFIER:1});
 assert.equal(r.ALL29_source_papers_not_all_closed,true);
 assert.equal(r.existing_B01_B02_B03_closed_unchanged,true);
 assert.equal(r.B05_not_started,true);
});
test("only exact36 operator sources become 36 Pages-published student items; 13 HOLD and one exact alias retained",()=>{
 assert.deepEqual(r.rows.filter(x=>x.source_disposition==="PUBLISHED_B04_EXACT36_MAIN_PAGES_VERIFIED").map(x=>x.source_id),
 bank.blocks.map(x=>x.source_slot_id));
 assert.deepEqual(r.formal_metrics,{FORMAL_SCIENCE_KP_APPROVED_new:36,ADMISSION_READY_new:36,PUBLISHED_new:36});
 assert.equal(r.pages_live_run_id,39771361871);
 assert.deepEqual([r.pages_CI,r.pages_deploy,r.pages_real_browser_E2E],["PASS","PASS","PASS"]);
 assert.equal(r.PUBLISHED_gate_checked_only_after_actual_E2E,true);
 assert.deepEqual([r.before_113_canonical_source_count,r.after_113_canonical_source_count_expected],[233,269]);
 assert.deepEqual([r.before_site_answer_slots,r.after_live_site_answer_slots,r.after_live_site_TF,r.after_live_site_MC,r.after_live_context_groups],[869,905,463,307,36]);
 assert.equal(r.all_13_HOLD_retained,true);
 assert.equal(r.one_legacy_source_alias_retained,true);
 assert.ok(!bank.blocks.some(x=>r.rows.filter(y=>y.source_disposition.startsWith("HOLD")||y.source_disposition.startsWith("SUPPRESSED")).some(y=>y.source_id===x.source_slot_id)));
});
test("identical Roadside hot wastewater question source alias does not add second student question, rights unchanged",()=>{
 const dupe=r.rows.filter(x=>x.source_disposition==="SUPPRESSED_ALREADY_PUBLIC_ALIAS");
 assert.equal(dupe.length,1);
 assert.equal(dupe[0].source_id,"SCI_G04_S1_113_MID_014|S1|TF|2");
 assert.equal(dupe[0].alias_to,"SCI_G04_S1_113_MID_005|S1|TF|010");
 assert.equal(r.B04_no_scanned_original_PDF_or_third_party_figure_published,true);
 assert.equal(r.original_teacher_answer_not_authenticated,true);
 assert.equal(r.existing_frozen_113_48KP_not_modified,true);
});
