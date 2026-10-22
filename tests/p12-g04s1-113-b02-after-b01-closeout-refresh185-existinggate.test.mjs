import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>JSON.parse(readFileSync(new URL("../data/review/"+path,import.meta.url),"utf8"));
const p=read("p12-g04s1-113-main-published185-source-suppression-readback-v13.json");
const master=read("p12-g04s1-113-all29-master-ledger-v1.json");
const current=read("p12-g04s1-113-main-published293-source-suppression-readback-v17.json");
const b=read("p12-g04s1-113-b02-first50-existinggate-native-source-preflight-after185-v1.json");
const original=read("p12-g04s1-113-native-tfmc-b02-50-source-checkpoint-v1.json");
const science=read("p12-g04s1-113-native-tfmc-b02-50-science-kp-exception-routing-v1.json");
const publishedOriginal=read("p12-g04s1-113-main-published178-source-suppression-readback-v12.json");
test("B01 seven confirmed additional public IDs reconcile APPEND-ONLY 178→185, main and Pages E2E",()=>{
 assert.equal(p.predecessor_append_only,"data/review/p12-g04s1-113-main-published178-source-suppression-readback-v12.json");
 assert.equal(p.current_113_source_slots_published,185);
 assert.equal(p.public_site_all_answer_slots,821);
 assert.equal(p.public_Pages_live_run_id,39614242450);
 assert.equal(p.public_Pages_live_E2E_success,true);
 assert.equal(new Set(p.all_unique_published_source_slot_ids).size,185);
 assert.deepEqual(p.all_unique_published_source_slot_ids.slice(0,178),publishedOriginal.all_unique_published_source_slot_ids);
 assert.equal(p.incremental_exact7_published_source_ids.length,7);
 assert.equal(master.published_snapshot_ref,"data/review/p12-g04s1-113-main-published293-source-suppression-readback-v17.json");
 assert.equal(master.published_main_sha,current.public_main_commit);
 assert.equal(master.known_published_source_positions,293);
 assert.equal(master.paper_records.reduce((n,x)=>n+x.published_count,0),293);
 assert.equal(master.paper_records.find(x=>x.paper_id==="SCI_G04_S1_113_MID_001").published_count,10);
 assert.equal(master.all29_complete,false);
 assert.equal(master.formally_closed_papers,0);
 assert.deepEqual(current.all_unique_published_source_slot_ids.slice(0,185),p.all_unique_published_source_slot_ids);
 assert.equal(current.incremental_exact21_published_source_ids.length,21);
 assert.equal(current.public_site_all_answer_slots,929);
 assert.equal(current.public_Pages_live_run_id,39803370304);
});
test("B02 exact known 50 source IDs: Dongguang17 Minquan22 Yongan11, original PDF answer BBox lineage",()=>{
 assert.equal(b.b01_first50_closed,true);
 assert.equal(b.b01_40_HOLD_retained,true);
 assert.equal(b.b02_started_as_source_preflight,true);
 assert.equal(b.rows.length,50);
 assert.deepEqual(b.paper_mix.map(x=>x.count),[17,22,11]);
 assert.deepEqual(b.rows.map(x=>x.source_slot_id),original.source_position_records.map(x=>x.normalized_source_slot_id));
 assert.deepEqual(b.rows.map(x=>x.source_slot_id),science.records.map(x=>x.source_slot_id));
 assert.deepEqual(b.rows.map(x=>x.previous_native_B02_worklist_number),Array.from({length:50},(_,i)=>i+51));
 assert.equal(new Set(b.rows.map(x=>x.source_slot_id)).size,50);
 assert.ok(b.rows.every(x=>x.source_pdf_sha256?.length===64
   &&x.source_pdf_page>0&&x.source_pdf_native_answer_bbox?.length===4
   &&x.source_question_exact_text_from_PDF_layer?.length>0
   &&x.formal_science_kp_approved===false&&x.admission_ready===false&&x.published_new===false));
});
test("B02 23 direct-KP model proposals not formal, 26 HOLD, 1 exact B01 duplicate source lineage",()=>{
 const outcomes=Object.fromEntries(Object.keys(b.counts).filter(x=>x!=="source_positions"&&!x.endsWith("_new")).map(x=>[x,b.counts[x]]));
 assert.deepEqual(outcomes,{
  "HOLD_EXISTING_EXCEPTION_NEEDS_ONLY_MISSING_EVIDENCE":26,
  "SCIENCE_KP_PROPOSED_NEEDS_EXISTING_FORMAL_GATE":23,
  "EXACT_DUPLICATE_LINEAGE_SUPPRESSED":1
 });
 assert.equal(b.counts.formal_science_kp_approved_new,0);
 assert.equal(b.counts.admission_ready_new,0);
 assert.equal(b.counts.published_new,0);
 assert.equal(b.no_new_mandatory_re_review,true);
 const dup=b.rows.find(x=>x.B02_current_disposition==="EXACT_DUPLICATE_LINEAGE_SUPPRESSED");
 assert.equal(dup.source_slot_id,"SCI_G04_S1_113_MID_004|S2|TF|11");
 assert.equal(dup.main_published_identical_other_source_lineage_B01,"SCI_G04_S1_113_MID_001|S01|TF|015");
 assert.equal(b.published_duplicate_alias_B01_lineage_count,1);
});
