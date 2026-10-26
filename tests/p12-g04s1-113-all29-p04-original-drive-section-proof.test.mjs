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
test('P04 full29 section counts sum 1762 but none of the exact original marker/BBox Admission Gates is prematurely certified',()=>{
 const counted=master.paper_records.filter(x=>x.section_reconciled_positions!==null);
 assert.equal(counted.length,29);
 assert.equal(counted.reduce((s,x)=>s+x.section_reconciled_positions,0),1762);
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
 // The two-paper frozen source proof remains 55+50; the accumulated master now covers eleven text-layer papers.
 assert.equal(master.p04_source_text_layer_recount_papers,11);
 assert.equal(master.p04_source_text_layer_recount_response_positions,629);
});

test('P04 direct original source text itemizations cover eleven papers / 629 printed response locations, not scored points',()=>{
 const docs=[
  'p12-g04s1-113-p04-wende-zhongxiao-mid-textlayer-response-markers-v1.json',
  'p12-g04s1-113-p04-minquan-yongan-mid-textlayer-response-markers-v1.json',
  'p12-g04s1-113-p04-anhe-dahua-final-textlayer-response-markers-v1.json',
  'p12-g04s1-113-p04-anhe-mingyi-guangxing-mid-textlayer-response-markers-v1.json',
  'p12-g04s1-113-p04-chenggong-yongan-final-textlayer-position-correction-v1.json'
 ];
 const seen=new Set();let count=0,delta=0;
 for(const name of docs){
  const source=read(name);
  for(const row of source.records){
    assert.ok(!seen.has(row.paper_id));seen.add(row.paper_id);
    const v=row.textlayer_answer_position_total??row.textlayer_original_answer_positions;
    assert.equal(row.sections.reduce((n,s)=>n+(s.count??s.individual_source_answer_locations),0),v);
    const current=records.get(row.paper_id);
    assert.ok(current);
    assert.equal(current.original_text_layer_answer_position_recount,v);
    assert.equal(current.inventory_certified,false);
    assert.equal(current.exact_total_slots,null);
    assert.equal(current.paper_closed,false);
    count+=v;
    delta+=v-current.previous_unverified_score_derived_positions;
  }
 }
 assert.equal(seen.size,11);
 assert.equal(count,629);
 assert.equal(delta,3);
 assert.equal(master.p04_source_text_layer_recount_papers,11);
 assert.equal(master.p04_source_text_layer_recount_response_positions,629);
 assert.equal(master.p04_source_text_layer_recount_vs_score_estimate_delta,3);
});
test('P04 five original SHA-verified visual page counts supersede score-derived estimates, but none is per-item BBox certified',()=>{
 const d=read('p12-g04s1-113-p04-five-original-visual-subanswer-denominator-exceptions-v1.json');
 assert.equal(d.records.length,5);
 for(const x of d.records){
   const paper=records.get(x.paper_id);
   assert.ok(paper);
   assert.equal(paper.original_text_layer_answer_position_recount,null);
   assert.equal(paper.inventory_certified,false);
   assert.equal(paper.exact_total_slots,null);
   assert.ok(paper.original_visual_source_count_ref?.length);
   assert.equal(typeof paper.section_reconciled_positions,'number');
 }
 assert.equal(master.p04_unresolved_visual_source_answer_denominator_papers,0);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.all29_complete,false);
});

test('P04 five original source-PDF binary SHA reverified and every page visually counted, with +4 source scoring-heuristic correction',()=>{
 const proof=read('p12-g04s1-113-p04-five-original-sha-verified-pdf-page-visual-count-v1.json');
 assert.equal(proof.source_papers,5);
 assert.equal(proof.full_pdf_binary_SHA_reverified_files,5);
 assert.equal(proof.original_pdf_pages_visually_read,12);
 assert.equal(proof.original_five_visual_answer_regions_sum,312);
 assert.equal(proof.source_original_section_response_count_correction_total,4);
 assert.deepEqual(proof.records.map(x=>x.printed_answer_regions_from_full_pdf_page_visual),[63,59,66,53,71]);
 const all=master.paper_records;
 for(const x of proof.records){
   const source=snapshot.get(x.paper_id),m=all.find(z=>z.paper_id===x.paper_id);
   assert.equal(x.original_pdf_sha256_binary_reverified,source.original_pdf_sha256);
   assert.equal(x.pdf_page_count_original_file_binary_verified,source.original_pdf_page_count);
   assert.equal(x.source_section_physical_response_groups.reduce((n,z)=>n+z.printed_answer_regions,0),x.printed_answer_regions_from_full_pdf_page_visual);
   assert.equal(m.section_reconciled_positions,x.printed_answer_regions_from_full_pdf_page_visual);
   assert.equal(m.exact_total_slots,null);
   assert.equal(m.inventory_certified,false);
   assert.equal(m.paper_closed,false);
 }
 assert.equal(master.p04_all29_revised_section_response_region_count_NONCERTIFIED,1762);
 assert.equal(master.p04_prior_29_source_scoring_derived_estimate,1755);
 assert.equal(master.p04_corrected_source_region_delta_vs_prior_planning,7);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
});
