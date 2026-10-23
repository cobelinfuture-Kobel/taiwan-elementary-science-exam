import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {buildAll29:build,normalizeSlot,validateMaster,assessCompletion}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const R='data/review/';
const read=file=>JSON.parse(fs.readFileSync(path.resolve(R,file),'utf8'));
const source=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const pub=read('p12-g04s1-113-main-published316-source-suppression-readback-v20.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const clone=x=>structuredClone(x);
const normSet=new Set(pub.all_unique_published_source_slot_ids.map(normalizeSlot));

test('P01 all29 original PDFs and 316 published source positions match current main snapshot',()=>{
  const v=validateMaster(master,source,pub,{requiredMainSha:pub.public_main_commit});
  assert.equal(v.paperIds.size,29);
  assert.equal(v.publishedIds.size,316);
  assert.equal(master.original_pdf_page_count,72);
  assert.equal(master.paper_records.filter(x=>x.paper_closed).length,0);
  assert.equal(master.paper_records.filter(x=>x.inventory_certified).length,0);
});
test('P02 generator includes all 29 paper inventory gaps, not only historical 14',()=>{
  const res=build();
  assert.equal(res.metrics.registered_papers,29);
  assert.equal(res.metrics.published_113,316);
  assert.equal(res.metrics.original_papers_with_any_initial_geometry_candidate,29);
  assert.equal(res.metrics.original_papers_with_full_answer_slot_geometry_certified,0);
  assert.equal(res.metrics.unique_legacy_source_positions,775);
  assert.equal(res.metrics.source_positions_after_native_p04b_union,1297);
  assert.ok(res.metrics.p04b_previously_unqueued_unpublished_source_positions<=480 && res.metrics.p04b_previously_unqueued_unpublished_source_positions>=464);
  assert.ok(res.metrics.unpublished_legacy_positions<=1077 && res.metrics.unpublished_legacy_positions>=1054);
  assert.equal(res.metrics.deterministic_work_tasks,res.metrics.unpublished_legacy_positions+29);
  assert.equal(res.metrics.papers_requiring_exact_inventory,29);
  assert.equal(res.metrics.section_papers_with_source_response_region_recount,29);
  assert.equal(res.metrics.source_section_response_region_count_NOT_EXACT,1762);
  assert.equal(res.metrics.certified_full29_original_answer_slot_BBox_universe,false);
  assert.equal(res.metrics.ALL29_COMPLETE,false);
  assert.equal(res.metrics.PUBLISHED_NEW,0);
  const tasks=res.batches.flatMap(x=>x.tasks);
  assert.equal(tasks.length,res.metrics.deterministic_work_tasks);
  assert.equal(new Set(tasks.filter(x=>x.kind==='PAPER_INVENTORY_GAP').map(x=>x.paper_id)).size,29);
  assert.equal(tasks.filter(x=>x.kind==='PAPER_INVENTORY_GAP').reduce((n,x)=>n+x.source_section_response_region_count_NOT_EXACT,0),1762);
  assert.ok(tasks.filter(x=>x.kind==='PAPER_INVENTORY_GAP').every(x=>x.requires_unique_original_source_slot_and_pdf_page_marker_bbox===true));
  assert.ok(res.batches.every(x=>x.count<=50));
  assert.deepEqual(res,build());
});
test('P02 normalized aliases retain exact section/group and never collide',()=>{
  assert.equal(normalizeSlot('SCI_G04_S1_113_MID_001|S01|TRUE_FALSE|006'),
    normalizeSlot('SCI_G04_S1_113_MID_001|S1|TF|6'));
  assert.notEqual(normalizeSlot('SCI_G04_S1_113_MID_011|S06|G01|TRUE_FALSE_SUB|01'),
    normalizeSlot('SCI_G04_S1_113_MID_011|S06|G02|TRUE_FALSE_SUB|01'));
});
test('P03 negative: missing one original paper must fail',()=>{
  const m=clone(master);m.paper_records.pop();
  assert.throws(()=>validateMaster(m,source,pub),/exactly 29/);
});
test('P03 negative: obsolete published114 baseline must fail',()=>{
  const m=clone(master);m.known_published_source_positions=114;
  assert.throws(()=>validateMaster(m,source,pub),/published snapshot stale/);
  assert.throws(()=>validateMaster(master,source,pub,{requiredMainSha:'0'.repeat(40)}),/main moved/);
});
test('P03 negative: false published count must fail',()=>{
  const m=clone(master);m.paper_records[0].published_count+=1;
  assert.throws(()=>validateMaster(m,source,pub),/published source count mismatch/);
});
function syntheticClosed(){
  // TEST-ONLY artificial slots: intentionally not a certification ledger or school exam source.
  const m=clone(master);
  m.paper_records.forEach((p,i)=>{
    const published=pub.all_unique_published_source_slot_ids.filter(id=>id.split('|')[0]===p.paper_id);
    const artificial=p.paper_id+'|S99|MC|'+String(i+1).padStart(3,'0');
    p.slot_dispositions=[
      ...published.map(id=>({source_slot_id:id,disposition:'PUBLISHED',
        source_evidence_ref:'TEST_ONLY_SOURCE',pdf_page_bbox_evidence_ref:'TEST_ONLY_GEO'})),
      {source_slot_id:artificial,disposition:'HOLD',reason:'TEST_ONLY_EXCEPTION',
        source_evidence_ref:'TEST_ONLY_SOURCE',pdf_page_bbox_evidence_ref:'TEST_ONLY_GEO',
        decision_evidence_ref:'TEST_ONLY_HOLD'}
    ];
    p.inventory_certified=true;p.exact_total_slots=p.slot_dispositions.length;p.paper_closed=true;
  });
  m.formally_closed_papers=29;m.all29_complete=true;
  return m;
}
test('P03 positive synthetic closeout: only complete, evidenced 29-paper statuses qualify',()=>{
  assert.equal(assessCompletion(syntheticClosed(),normSet).all29_complete,true);
});
test('P03 negative: one printed answer position missing blocks false closeout',()=>{
  const m=syntheticClosed();m.paper_records[0].slot_dispositions.pop();
  const a=assessCompletion(m,normSet);
  assert.equal(a.all29_complete,false);
  assert.ok(a.reasons.some(x=>x.includes('MISSING_EXACT_SLOT_DISPOSITIONS')));
});
test('P03 negative: PENDING cannot be called all29 complete',()=>{
  const m=syntheticClosed();m.paper_records[0].slot_dispositions.at(-1).disposition='PENDING';
  assert.equal(assessCompletion(m,normSet).all29_complete,false);
});
test('P03 negative: falsified published slot is rejected',()=>{
  const m=syntheticClosed();m.paper_records[0].slot_dispositions.at(-1).disposition='PUBLISHED';
  assert.ok(assessCompletion(m,normSet).reasons.some(x=>x.includes('FALSE_PUBLISHED')));
});
test('P03 negative: Admission Ready without accepted existing Gates is rejected',()=>{
  const m=syntheticClosed();m.paper_records[0].slot_dispositions.at(-1).disposition='ADMISSION_READY';
  assert.ok(assessCompletion(m,normSet).reasons.some(x=>x.includes('GATE_MISSING_')));
});
test('P03 negative: unsupported HOLD must not close a paper',()=>{
  const m=syntheticClosed();delete m.paper_records[0].slot_dispositions.at(-1).decision_evidence_ref;
  assert.ok(assessCompletion(m,normSet).reasons.some(x=>x.includes('UNSUPPORTED_HOLD')));
});
test('P03 running state is valid, but never masquerades as a completed original corpus',()=>{
  const c=assessCompletion(master,normSet);
  assert.equal(c.all29_complete,false);assert.equal(c.closed_papers,0);
  assert.ok(c.reasons.length>=29);
});
