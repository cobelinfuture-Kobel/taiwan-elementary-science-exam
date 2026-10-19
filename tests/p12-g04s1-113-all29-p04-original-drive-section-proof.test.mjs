import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('data/review');
const read=name=>JSON.parse(fs.readFileSync(path.join(base,name),'utf8'));
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const registered=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const evidence=read('p12-g04s1-113-p04-all16-drive-text-vs-original-printed-section-proof-v1.json');
const first=read('p12-g04s1-113-p04-remaining16-drive-pdf-textlayer-shard01-v1.json');
const second=read('p12-g04s1-113-p04-remaining16-drive-pdf-textlayer-shard02-v1.json');
const prior=read('p12-g04s1-113-all29-stage2-section-slot-reconciliation-v1.json');
const priorProof=read('p12-g04s1-113-remaining16-printed-score-proof-v2.json');
const snapshot=new Map(registered.original_source_records.map(x=>[x.source_id,x]));
const records=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('P04 all 16 directly readable Drive original PDFs correspond to known 29 registered SHA-locked source IDs',()=>{
 const ids=new Set();
 assert.equal(evidence.records.length,16);
 assert.deepEqual(new Set([...first.records,...second.records].map(x=>x.source_id)),new Set(evidence.records.map(x=>x.paper_id)));
 for(const x of evidence.records){
   assert.ok(!ids.has(x.paper_id));ids.add(x.paper_id);
   const s=snapshot.get(x.paper_id),m=records.get(x.paper_id);
   assert.ok(s&&m);
   assert.equal(x.source_drive_file_id,s.drive_file_id);
   assert.equal(x.source_pdf_sha256_from_prior_registry,s.original_pdf_sha256);
   assert.equal(x.title,s.source_title);
   assert.ok(x.source_extracted_text_chars>350);
   assert.ok(x.direct_pdf_text_layer_accessed);
   assert.equal(m.original_pdf_text_layer_source_readback_verified,true);
   assert.equal(m.previous_unverified_score_derived_positions,x.provisional_score_derived_total);
 }
 assert.equal(ids.size,16);
});
test('P04 previous per-section printed score proofs align with readback, and sum 100 per paper without treating points as answer slots',()=>{
 const priorBy=new Map(priorProof.records.map(x=>[x.source_id,x]));
 for(const x of evidence.records){
  assert.equal(x.source_proof_section_detail.reduce((sum,z)=>sum+z.printed_score_points_from_prior_source_proof,0),100);
  assert.equal(x.provisional_score_derived_total,priorBy.get(x.paper_id).scoring_derived_response_count_not_final);
  assert.equal(x.full_exact_answer_position_count,null);
  assert.equal(x.all_pdf_answer_marker_bbox_certified,false);
  assert.equal(records.get(x.paper_id).exact_total_slots,null);
  assert.equal(records.get(x.paper_id).inventory_certified,false);
 }
 assert.equal(evidence.records.reduce((s,x)=>s+x.provisional_score_derived_total,0),934);
});
test('P04 actual full paper status remains uncompleted; 13 older section tallies sum 821, 16 source text scans not silently promoted',()=>{
 const counted=master.paper_records.filter(x=>x.section_reconciled_positions!==null);
 assert.equal(counted.length,13);
 assert.equal(counted.reduce((s,x)=>s+x.section_reconciled_positions,0),821);
 assert.equal(prior.original_response_positions_section_reconciled,821);
 assert.equal(master.p04_remaining16_original_pdf_textlayer_readback,16);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.all29_complete,false);
 assert.equal(master.p04_full29_independent_answer_slot_count,null);
 assert.ok(master.paper_records.every(x=>x.exact_total_slots===null&&x.paper_closed===false));
});
test('P04 original source pagination/line-break exceptions are flagged, not forcibly renumbered',()=>{
 for(const id of ['SCI_G04_S1_113_MID_001','SCI_G04_S1_113_FINAL_011','SCI_G04_S1_113_MID_018']){
  const x=evidence.records.find(x=>x.paper_id===id);
  assert.ok(x?.source_text_layout_exception?.length);
  assert.equal(x.all_pdf_answer_marker_bbox_certified,false);
 }
});
test('P04 negative missing one of sixteen original PDF source IDs fails closure-source coverage',()=>{
 const damaged=structuredClone(evidence.records);damaged.pop();
 assert.notEqual(new Set(damaged.map(x=>x.paper_id)).size,16);
 assert.equal(master.paper_records.filter(x=>x.exact_total_slots!==null).length,0);
});

test('P04 Wende55 and Zhongxiao50 source text-layer itemization is exact within named section counts, but cannot bypass PDF page geometry',()=>{
 const reread=read('p12-g04s1-113-p04-wende-zhongxiao-mid-textlayer-response-markers-v1.json');
 assert.equal(reread.records.length,2);
 assert.equal(reread.records.reduce((sum,p)=>sum+p.textlayer_answer_position_total,0),105);
 assert.deepEqual(reread.records.map(x=>x.textlayer_answer_position_total),[55,50]);
 for(const p of reread.records){
   assert.equal(p.sections.reduce((sum,s)=>sum+s.count,0),p.textlayer_answer_position_total);
   assert.equal(p.original_visual_pdf_bbox_complete,false);
   const masterRow=records.get(p.paper_id);
   assert.equal(masterRow.original_text_layer_answer_position_recount,p.textlayer_answer_position_total);
   assert.equal(masterRow.exact_total_slots,null);
   assert.equal(masterRow.inventory_certified,false);
 }
 assert.equal(master.p04_source_text_layer_recount_papers,2);
 assert.equal(master.p04_source_text_layer_recount_response_positions,105);
});
