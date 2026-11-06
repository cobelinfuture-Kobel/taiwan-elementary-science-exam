import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dir='data/review/p12-g04s1-113-all29-';
const load=name=>JSON.parse(readFileSync(new URL('../'+dir+name,import.meta.url),'utf8'));
const m=load('paper-level-admission-master-v1.json');
const old=load('known-atomic-disjoint-source-ledger-v4.json');
const now=load('known-atomic-disjoint-source-ledger-v5.json');
const cross91=load('sourceid-crosswalk5-91-original-proof-identity-v1.json');
const cross44=load('mid018-final008-original-parent44-sourceid-bridge-v1.json');
const add65=load('taozijiao-final008-65-original-source-proof-residual-v1.json');
const add213=load('last4-213-source-proof-residual-v1.json');
const norm=id=>id.split('|').map(x=>/^[SG]\d+$/.test(x)?x[0]+Number(x.slice(1)):/^\d+$/.test(x)?String(Number(x)):x).join('|');
test('29 original papers source-only ledger v5 is disjoint and preserves all frozen 333 published IDs and review dispositions',()=>{
 assert.equal(now.source_position_count_distinct_known,1719);
 assert.equal(now.known_atomic_source_dispositions.length,1719);
 assert.equal(new Set(now.known_atomic_source_dispositions.map(x=>norm(x.source_slot_id))).size,1719);
 assert.deepEqual(now.known_disjoint_dispositions,{PUBLISHED:333,HOLD:269,ALIAS:10,UNREVIEWED:1107});
 assert.equal(now.original_papers.length,29);
 assert.equal(now.original_papers.filter(x=>x.source_response_identity_roster_full_paper_proof_known).length,27);
 assert.equal(now.source_response_identity_roster_other_original_papers_pending,2);
 const prev=new Map(old.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));
 for(const entry of now.known_atomic_source_dispositions){
  const before=prev.get(norm(entry.source_slot_id));
  if(before)assert.deepEqual(entry,before,'original source status and lineage must not change');
  else assert.equal(entry.disposition,'UNREVIEWED');
 }
 assert.equal(now.known_atomic_source_dispositions.filter(x=>x.disposition==='PUBLISHED').length,333);
 assert.deepEqual(now.formal_status_current_run,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,full_original_papers_Admission_closed:0});
 assert.equal(now.unresolved_coverage.all29_certified_independent_answer_position_denominator,null);
 assert.equal(now.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
 assert.equal(now.unresolved_coverage.whole_paper_disjoint_coverage_complete,false);
});
test('structural proof crosswalks reconcile same original sources without promoting B HOLD to public',()=>{
 assert.equal(cross91.rows.length,91);
 assert.equal(cross44.rows.length,44);
 assert.equal(cross44.rows.filter(x=>x.existing_disposition_unchanged==='PUBLISHED').length,27);
 assert.equal(cross44.rows.filter(x=>x.existing_disposition_unchanged==='HOLD').length,17);
 assert.equal(new Set(cross91.rows.map(x=>norm(x.original_pdf_proof_source_slot_id))).size,91);
 assert.equal(new Set(cross44.rows.map(x=>norm(x.original_pdf_proof_source_id))).size,44);
 for(const x of [...cross91.rows,...cross44.rows])assert.equal(x.admission_status_change??x.admission_status_changed,false);
});
test('final-source 92 source modes are not 92 newly published items: 27 old public and 65 pending original source work positions',()=>{
 assert.equal(add65.original_source_slots,92);
 assert.equal(add65.unchanged_published_main_source_ids,27);
 assert.equal(add65.records.length,65);
 assert.equal(new Set(add65.records.map(x=>norm(x.source_slot_id))).size,65);
 assert.equal(add65.new_published,0);
 assert.equal(now.original_papers.find(x=>x.source_paper_id==='SCI_G04_S1_113_FINAL_008').known_classified_source_positions,92);
 assert.equal(now.original_papers.find(x=>x.source_paper_id==='SCI_G04_S1_113_FINAL_008').disjoint_known_source_positions.PUBLISHED,27);
});
test('last-four source identity inventory preserves exact 43 evidence-region gaps, not certified unanswered-question estimates',()=>{
 assert.equal(add213.records.length,213);
 assert.equal(add213.remaining_per_paper_source_work_positions_without_specific_bboxes_or_approved_ID.SCI_G04_S1_113_MID_005,37);
 assert.equal(add213.remaining_per_paper_source_work_positions_without_specific_bboxes_or_approved_ID.SCI_G04_S1_113_FINAL_005,6);
 assert.deepEqual(now.remaining_provisional_source_work_regions_without_individual_accepted_source_ID,{SCI_G04_S1_113_MID_005:37,SCI_G04_S1_113_FINAL_005:6});
 assert.deepEqual(['MID_005','FINAL_005'].map(s=>now.original_papers.find(x=>x.source_paper_id.endsWith(s)).known_classified_source_positions),[29,74]);
 assert.equal(now.original_papers.find(x=>x.source_paper_id.endsWith('FINAL_004')).known_classified_source_positions,81);
 assert.equal(now.original_papers.find(x=>x.source_paper_id.endsWith('MID_017')).known_classified_source_positions,68);
 assert.equal(m.totals.certified_all29_distinct_answer_position_denominator,null);
 assert.equal(m.totals.certified_all29_total_unreviewed_questions,null);
 assert.equal(now.original_papers.reduce((total,x)=>total+x.disjoint_known_source_positions.PUBLISHED,0),333);
});
