#!/usr/bin/env node
'use strict';
// Execution routing only. This does not add or bypass any Admission Gate.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
function read(p){return JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'))}
const ctrlPath='data/review/p12-g04s1-113-existingadmission-fixed29-all1762-control-v1.json';
const wendePath='data/review/p12-g04s1-113-p04b-wende-mid55-exact-source-subanswers-and-geometry-v1.json';
function build(){
 const ctrl=read(ctrlPath);
 const wende=read(wendePath);
 if(ctrl.papers.length!==29||ctrl.original_source_work_position_budget_NONCERTIFIED!==1762||wende.records.length!==55)
  throw new Error('Frozen source-work routing input changed: fail-closed');
 const published=ctrl.papers.reduce((n,p)=>n+p.main_published_count,0);
 if(published!==178||ctrl.exactly_ten_previously_triaged_unpublished_firstpage_original_source_IDs.length!==10)
  throw new Error('Existing public-lineage or reviewed10 baseline drift: fail-closed');
 const rows=[];
 let workOrdinal=0;
 for(const p of ctrl.papers){
  for(let i=0;i<p.noncertified_source_work_position_budget;i++){
   const source =p.original_paper_id===wende.paper_id?wende.records[i] : null;
   if(p.original_paper_id===wende.paper_id && !source)throw new Error('Missing Wende originally verified source identity');
   if(source && source.original_pdf_sha256!==p.source_pdf_sha256)throw new Error('Original PDF mismatch');
   workOrdinal++;
   rows.push({
    routing_work_pointer:'P12_G04S1_113_WORK_'+String(workOrdinal).padStart(4,'0'),
    original_paper_id:p.original_paper_id,
    original_pdf_sha256:p.source_pdf_sha256,
    paper_ordinal:p.ordinal,
    paper_work_position_index:i+1,
    exact_original_source_slot_id_or_null:source?source.source_slot_id:null,
    source_ID_verification:source?'ORIGINAL_PDF_PROOF_CONFIRMED':'WORKING_BUDGET_ONLY_NOT_A_SOURCE_SLOT_ID',
    original_pdf_page_or_null:source?source.original_pdf_page:null,
    source_geometry_evidence_ref_or_null:source?wendePath:null,
    existing_published_lineage_is_separately_preserved:true,
    admission_disposition:'NOT_FORMALLY_ADMITTED_FROM_ROUTING',
    science_KP_formal_accepted:false,
    admission_ready:false
   });
  }
 }
 if(rows.length!==1762||new Set(rows.map(x=>x.routing_work_pointer)).size!==1762)
  throw new Error('Routing not source-work budget complete');
 const batches=[];
 for(let start=0;start<rows.length;start+=50){
   const chunk=rows.slice(start,start+50);
   batches.push({
    batch:'B'+String(batches.length+1).padStart(2,'0'),
    processing_capacity:50,source_work_pointer_count:chunk.length,
    position_start:start+1,position_end:start+chunk.length,
    exact_original_source_id_evidence_count:chunk.filter(x=>x.exact_original_source_slot_id_or_null).length,
    unidentified_source_work_budget_count:chunk.filter(x=>!x.exact_original_source_slot_id_or_null).length,
    source_ID_pending_does_not_count_as_formally_reviewed:true,
    original_paper_ids_in_sequence:[...new Set(chunk.map(x=>x.original_paper_id))],
    rows:chunk
   });
 }
 if(batches.length!==36||batches.at(-1).source_work_pointer_count!==12)throw new Error('Unexpected B01-B36 50 work budget segmentation');
 const summary={
  schema_version:'P12_113_G04S1_EXISTING_ADMISSION_FIXED29_BATCH_ROUTING_V1',
  derived_from:ctrlPath,source_papers:ctrl.papers.length,
  source_work_budget_noncertified:rows.length,
  source_IDs_proven_in_current_dynamic_queue:rows.filter(x=>x.exact_original_source_slot_id_or_null).length,
  source_IDs_unresolved_in_dynamic_queue:rows.filter(x=>!x.exact_original_source_slot_id_or_null).length,
  source_budget_not_actual_question_denominator:true,
  batch_count:batches.length,
  processing_batch_capacity:50,
  batch_source_work_sizes:batches.map(x=>x.source_work_pointer_count),
  currently_main_published_113_source_IDs_retained:published,
  reviewed10_original_source_IDs_retained:10,
  ALL29_FULL_FORMAL_COMPLETE:false,
  FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,
  rule:'DO NOT equate a queue work pointer with an authenticated source_slot_id. Missing identity and child/group context remains UNREVIEWED until its original exact evidence is supplied. Existing 178 published source IDs are suppressed separately; never subtract them blindly from 1762 provisional work positions.'
 };
 return {summary,batches};
}
if(require.main===module){
 const {summary,batches}=build();
 const arg=process.argv.find(x=>x.startsWith('--out-dir='));
 const batchArg=process.argv.find(x=>x.startsWith('--batch='));
 const selected=batchArg?batches.filter(x=>Number(batchArg.slice(8))===Number(x.batch.slice(1))):batches;
 if(batchArg&&selected.length!==1)throw new Error('Unknown batch');
 if(arg){
  const out=path.resolve(arg.slice(10));
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(summary,null,2)+'\n');
  for(const b of selected)fs.writeFileSync(path.join(out,b.batch.toLowerCase()+'.json'),JSON.stringify(b,null,2)+'\n');
 }else process.stdout.write(JSON.stringify({...summary,generated_batches:selected.map(x=>({batch:x.batch,start:x.position_start,end:x.position_end,proven:x.exact_original_source_id_evidence_count,pending:x.unidentified_source_work_budget_count}))},null,2)+'\n');
}
module.exports={build};
