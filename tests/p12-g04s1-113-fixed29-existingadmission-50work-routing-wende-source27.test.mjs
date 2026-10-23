import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const req=createRequire(import.meta.url);
const {build}=req('../scripts/review/p12-g04s1-113-fixed29-admission-routing.cjs');
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const ctrl=read('p12-g04s1-113-existingadmission-fixed29-all1762-control-v1.json');
const b01=read('p12-g04s1-113-existingadmission-fixed29-b01-wende50-sourceID-reconciliation-v1.json');
const triage=read('p12-g04s1-113-existingadmission-fixed29-b01-wende-tf15-mc12-model-science-kp-triage-v1.json');
const pub=read('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const frozen=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
test('113 29-paper immutable work budget and publication-lineage conservation; no paper falsely closed',()=>{
 assert.equal(ctrl.papers.length,29);
 assert.equal(ctrl.original_papers_total,29);
 assert.equal(ctrl.original_papers_formally_closed,0);
 assert.equal(ctrl.original_source_work_position_budget_NONCERTIFIED,1762);
 assert.equal(ctrl.formal_source_question_denominator_NOT_YET_ESTABLISHED,true);
 assert.equal(ctrl.original_main_113_published_source_id_count,178);
 assert.equal(ctrl.original_main_113_published_source_IDs_immutable.length,178);
 assert.deepEqual(ctrl.original_main_113_published_source_IDs_immutable,pub.all_unique_published_source_slot_ids);
 assert.equal(ctrl.papers.reduce((n,p)=>n+p.noncertified_source_work_position_budget,0),1762);
 assert.equal(ctrl.papers.reduce((n,p)=>n+p.main_published_count,0),178);
 assert.equal(ctrl.papers.reduce((n,p)=>n+p.reviewed_but_not_admitted_source_ids.length,0),10);
 for(let i=0;i<29;i++){
  const a=ctrl.papers[i],b=master.paper_records[i];
  assert.equal(a.original_paper_id,b.paper_id);
  assert.equal(a.source_pdf_sha256,b.original_pdf_sha256);
  assert.equal(a.noncertified_source_work_position_budget,b.section_reconciled_positions);
  // Frozen old 178-source controller stays historical; current main appends B01 Wende7,
  // B02 Dongguang4 Minquan11 Yongan6 without rewriting that old controller.
  const delta={SCI_G04_S1_113_MID_001:7,SCI_G04_S1_113_MID_004:4,SCI_G04_S1_113_MID_007:11,SCI_G04_S1_113_MID_008:14,SCI_G04_S1_113_MID_009:14,SCI_G04_S1_113_MID_010:5,SCI_G04_S1_113_MID_011:5,SCI_G04_S1_113_MID_013:20,SCI_G04_S1_113_MID_014:7,SCI_G04_S1_113_MID_015:15,SCI_G04_S1_113_MID_018:12,SCI_G04_S1_113_FINAL_006:12,SCI_G04_S1_113_FINAL_010:5};
  assert.equal(b.published_count,a.main_published_count+(delta[a.original_paper_id]||0));
  assert.equal(a.full_formal_admission_paper_closeout,false);
  assert.equal(a.active_admission_disposition,'PAPER_OPEN_NOT_COMPLETE');
  assert.equal(a.unresolved_question_count,null);
 }
 const kps=frozen.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points);
 assert.equal(kps.length,48);
 for(const field of ['NEW_FORMAL_SCIENCE_KP_APPROVED','NEW_ADMISSION_READY','NEW_PUBLISHED'])assert.equal(ctrl[field],0);
});
test('All 1762 are stable processing work pointers, not fictitious student source IDs: 36 batches and 12 fully-itemized school papers 639 source IDs',()=>{
 const {summary,batches}=build();
 assert.equal(summary.source_papers,29);
 assert.equal(summary.source_work_budget_noncertified,1762);
 assert.equal(summary.source_IDs_proven_in_current_dynamic_queue,639);
 assert.equal(summary.source_IDs_unresolved_in_dynamic_queue,1123);
 assert.equal(summary.batch_count,36);
 assert.equal(batches.length,36);
 assert.ok(batches.slice(0,-1).every(b=>b.rows.length===50));
 assert.equal(batches.at(-1).rows.length,12);
 assert.equal(batches.reduce((n,b)=>n+b.rows.length,0),1762);
 const all=batches.flatMap(b=>b.rows);
 assert.equal(new Set(all.map(x=>x.routing_work_pointer)).size,1762);
 assert.equal(new Set(all.filter(x=>x.exact_original_source_slot_id_or_null).map(x=>x.exact_original_source_slot_id_or_null)).size,639);
 assert.ok(all.filter(x=>!x.exact_original_source_slot_id_or_null).every(x=>x.source_ID_verification==='WORKING_BUDGET_ONLY_NOT_A_SOURCE_SLOT_ID'));
 assert.ok(all.every(x=>x.admission_disposition==='NOT_FORMALLY_ADMITTED_FROM_ROUTING'&&!x.admission_ready));
 assert.equal(batches[0].exact_original_source_id_evidence_count,50);
 assert.equal(batches[0].original_paper_ids_in_sequence.length,1);
 assert.deepEqual(batches[1].original_paper_ids_in_sequence,['SCI_G04_S1_113_MID_001','SCI_G04_S1_113_MID_002']);
 assert.equal(batches[1].exact_original_source_id_evidence_count,5);
 assert.equal(batches[1].unidentified_source_work_budget_count,45);
 assert.equal(summary.currently_main_published_113_source_IDs_retained,178);
 assert.equal(summary.ALL29_FULL_FORMAL_COMPLETE,false);
});
test('B01 source proof has first fifty actual Wende PDF source IDs, 3 already main, 47 require full gate; no premature release',()=>{
 assert.equal(b01.rows.length,50);
 assert.equal(b01.B01_source_position_count,50);
 assert.equal(b01.B01_original_source_ids_actually_proven_from_original_PDF,50);
 assert.equal(b01.B01_already_main_published_and_suppressed,3);
 assert.equal(b01.B01_UNREVIEWED_formal_sourcetext_science_kp_rights_operator,47);
 assert.equal(b01.paper_last5_positions_reserved_for_NEXT_batch,5);
 assert.equal(b01.rows.filter(x=>x.original_source_slot_geometry_verified).length,48);
 const canonical=s=>s.replace(/\|S0(\d)\|/g,'|S$1|');
 const known=new Set(pub.all_unique_published_source_slot_ids.map(canonical));
 assert.equal(b01.rows.filter(x=>known.has(canonical(x.source_slot_id_exact_original))).length,3);
 assert.equal(b01.rows.filter(x=>x.disposition==='ALREADY_MAIN_PUBLISHED_SUPPRESS_NEW').length,3);
 assert.ok(b01.rows.every(x=>x.new_admission_ready===false));
 for(const k of ['B01_formal_science_kp_newly_approved','B01_admission_ready_new','B01_new_published'])assert.equal(b01[k],0);
});
test('B01 source-native text layer TF15+MC12 original 27 independently parsed; only model science/KP, no lunar KP scope hijack and no SourceEqualsAdmission',()=>{
 assert.equal(triage.actual_question_statuses.length,27);
 assert.equal(triage.original_pdf_native_text_layer_full_question_count_15TF_12MC,27);
 assert.equal(triage.already_main_published_113_source_count_in_these27,3);
 assert.equal(triage.currently_unpublished_27_subset,24);
 assert.equal(triage.currently_unpublished_model_Science_AND_direct_Frozen48_KP_candidate_count,7);
 assert.equal(triage.currently_unpublished_model_or_scope_HOLD_count,17);
 assert.equal(triage.original_midterm_frozen_current_KP_units.length,2);
 assert.deepEqual(triage.original_midterm_frozen_current_KP_units,['U01','U02']);
 assert.equal(new Set(triage.actual_question_statuses.map(x=>x.source_slot_id)).size,27);
 for(const x of triage.actual_question_statuses){
  assert.equal(x.original_PDF_native_text_layer_question_raw_with_original_line_breaks.length>0,true);
  assert.ok(x.original_pdf_answer_bbox_pts_top_left.length===4);
  if(x.original_question_type==='MC')assert.equal(x.original_PDF_native_option_segments_unmodified.length,4);
  if(x.original_source_question_determination.startsWith('HOLD'))assert.equal(x.model_directKP_candidate_NOT_OPERATOR_ACCEPTED,null);
  assert.equal(x.formal_science_kp_approved_now,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.original_source_full_pdf_visual_question_context_still_requires_gate,true);
 }
 for(const k of ['NEW_FORMAL_SCIENCE_KP_APPROVED','NEW_ADMISSION_READY','NEW_PUBLISHED'])assert.equal(triage[k],0);
});
