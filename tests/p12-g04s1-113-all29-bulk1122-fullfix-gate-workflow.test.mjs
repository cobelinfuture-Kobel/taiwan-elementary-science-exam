import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {analyze,readJson,GATE_ORDER,PLAN_PATH,BASE_PATH} from '../scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs';

const plan=readJson(PLAN_PATH);
const base=readJson(BASE_PATH);
const all=analyze({batch:'all'});

test('FullFix plan covers 1122 remaining positions in exactly nine complete-paper 100–150 batches',()=>{
 assert.equal(plan.original_29_papers,29);
 assert.equal(base.original_papers.length,29);
 assert.equal(plan.original_total_source_work_positions,1762);
 assert.deepEqual(plan.source_work_disjoint_effective,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 assert.equal(plan.batches.length,9);
 assert.equal(all.selected_batches.length,9);
 const seen=new Set();
 const paper=new Map();
 for(const b of plan.batches){
  assert.ok(b.source_work_count>=100&&b.source_work_count<=150,b.batch_id);
  assert.equal(b.source_slot_ids.length,b.source_work_count);
  for(const source of b.source_slot_ids){
   assert.ok(!seen.has(source),'double assignment: '+source);
   seen.add(source);
   const name=source.split('|')[0];
   assert.equal(paper.get(name)||b.batch_id,b.batch_id,'original paper split across batches');
   paper.set(name,b.batch_id);
  }
 }
 assert.equal(seen.size,1122);
 assert.equal(all.this_run_scoped_source_work_positions,1122);
 assert.equal(all.candidate_exact7_model_stage_by_batch.reduce((s,b)=>s+b.candidates,0),7);
 assert.equal(plan.split_original_paper_across_batches,false);
});
test('Batch runner preserves raw paper evidence and records every existing Gate as non-formal until accepted',()=>{
 assert.equal(all.batches.length,9);
 assert.deepEqual(GATE_ORDER,['SOURCE_EXACT','PDF_PAGE_BBOX','SCIENCE_UNIQUE_ANSWER','CANONICAL_KP','DUPLICATE','RIGHTS','OPERATOR_EXACT_SCOPE']);
 const candidateIds=new Set();
 for(const b of all.batches){
  assert.equal(b.source_ids_evidence_gates_screened,b.input_source_work_positions);
  assert.equal(b.changed_ledger_dispositions_by_this_automated_run,0);
  assert.equal(b.formal_science_kp_approved_new,0);
  assert.equal(b.ADMISSION_READY_new,0);
  assert.equal(b.PUBLISHED_new,0);
  assert.ok(b.source_geometry_provenance_links>=b.exact_original_physical_bbox_evidence_attached);
  assert.equal(b.original_paper_level_progress.reduce((s,p)=>s+p.source_ids_examined,0),b.input_source_work_positions);
  for(const r of b.rows){
   assert.equal(r.immutable_original_disposition,'UNREVIEWED');
   assert.equal(r.effective_disposition,'UNREVIEWED');
   assert.equal(r.admission_ready,false);
   assert.equal(r.published_new,false);
   assert.ok(r.geometry_source_proof_ref);
   assert.deepEqual(Object.keys(r.gate_results),GATE_ORDER);
   assert.equal(r.missing_formal_gates.length,7);
   assert.ok(r.gate_results.SCIENCE_UNIQUE_ANSWER!=='ACCEPTED');
   assert.ok(r.gate_results.CANONICAL_KP!=='ACCEPTED');
   assert.equal(r.gate_results.OPERATOR_EXACT_SCOPE,'PENDING_EXACT_SOURCE_COHORT_SIGNOFF');
   if(r.knowledge_point_model_candidate)candidateIds.add(r.source_slot_id);
  }
 }
 assert.equal(candidateIds.size,7);
});
test('Repeatable per-batch resume is stable and does not leak source slots across different batch scopes',()=>{
 let total=0;
 const seen=new Set();
 for(const b of plan.batches){
  const r=analyze({batch:b.batch_id});
  assert.deepEqual(r.selected_batches,[b.batch_id]);
  assert.equal(r.batches.length,1);
  assert.equal(r.this_run_scoped_source_work_positions,b.source_work_count);
  assert.deepEqual(r.batches[0].rows.map(r=>r.source_slot_id),b.source_slot_ids);
  for(const x of r.batches[0].rows){
   assert.ok(!seen.has(x.source_slot_id));
   seen.add(x.source_slot_id);
  }
  total+=r.this_run_scoped_source_work_positions;
 }
 assert.equal(total,1122);
 assert.equal(seen.size,1122);
 assert.throws(()=>analyze({batch:'B10'}),/FAIL_CLOSED|unknown batch/);
 assert.throws(()=>analyze({batch:'B00'}),/FAIL_CLOSED|unknown batch/);
});
test('No authorization laundering: old exact7 remains operator pending; 333 frozen published intact',()=>{
 const pending=readJson('data/review/p12-g04s1-113-all29-exact7-item-gate-operator-approval-roster-PENDING-v1.json');
 assert.equal(pending.operator_exact_7_source_ids_approved,false);
 assert.equal(pending.public_student_bank_release_authorized,false);
 assert.equal(pending.sources.length,7);
 assert.deepEqual(all.original_disjoint_effective,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 assert.equal(all.formal_science_kp_approved_new,0);
 assert.equal(all.ADMISSION_READY_new,0);
 assert.equal(all.PUBLISHED_new,0);
 assert.equal(all.automated_run_does_not_sign_formal_admission,true);
 assert.equal(all.no_reopen_333_published_source_slots,true);
 assert.equal(all.frozen_48_kp_unchanged,true);
});