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
 const fullyIdentified=new Map();
 for(const paper of ctrl.papers){
  const ref=paper.source_exact_native_slot_evidence_ref;
  if(!ref)continue;
  const proof=read(ref);
  const exact=proof.records;
  if(!Array.isArray(exact)||exact.length!==paper.noncertified_source_work_position_budget)
   throw new Error('Proven source ID coverage changed: '+paper.original_paper_id);
  const ids=new Set();
  for(const x of exact){
   if(!x.source_slot_id||!x.source_slot_id.startsWith(paper.original_paper_id+'|'))
    throw new Error('Source slot provenance mismatched: '+paper.original_paper_id);
   if(ids.has(x.source_slot_id))throw new Error('Duplicate provenance ID: '+x.source_slot_id);
   ids.add(x.source_slot_id);
  }
  fullyIdentified.set(paper.original_paper_id,{ref,records:exact});
 }
 if(fullyIdentified.size!==12)throw new Error('12 fully source-ID itemized paper evidence baseline changed');
 const rows=[];
 let workOrdinal=0;
 for(const p of ctrl.papers){
  const proven=fullyIdentified.get(p.original_paper_id);
  for(let i=0;i<p.noncertified_source_work_position_budget;i++){
   const source =proven?proven.records[i]:null;
   const sourceHash=source&&(source.original_pdf_sha256||source.source_pdf_sha256||source.registered_original_pdf_sha256);
   if(sourceHash&&sourceHash!==p.source_pdf_sha256)throw new Error('Original PDF mismatch');
   workOrdinal++;
   rows.push({
    routing_work_pointer:'P12_G04S1_113_WORK_'+String(workOrdinal).padStart(4,'0'),
    original_paper_id:p.original_paper_id,
    original_pdf_sha256:p.source_pdf_sha256,
    paper_ordinal:p.ordinal,
    paper_work_position_index:i+1,
    exact_original_source_slot_id_or_null:source?source.source_slot_id:null,
    source_ID_verification:source?'ORIGINAL_PDF_PROOF_CONFIRMED':'WORKING_BUDGET_ONLY_NOT_A_SOURCE_SLOT_ID',
    original_pdf_page_or_null:source?(source.original_pdf_page??source.page??null):null,
    source_geometry_evidence_ref_or_null:proven?proven.ref:null,
    existing_published_lineage_is_separately_preserved:true,
    admission_disposition:'NOT_FORMALLY_ADMITTED_FROM_ROUTING',
    science_KP_formal_accepted:false,
    admission_ready:false
   });
  }
 }
 if(rows.length!==1762||new Set(rows.map(x=>x.routing_work_pointer)).size!==1762||rows.filter(x=>x.exact_original_source_slot_id_or_null).length!==639)
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
 // A 50-position SOURCE/MODEL screen is not a BATCH CLOSEOUT. The operator
 // explicitly requires existing Admission, selective release and Pages acceptance
 // for each previous batch before beginning the next batch. This is execution
 // sequencing, NOT a new Science/KP gate. A default --out-dir inventory can still
 // generate all future work-shards, but --batch=N may not execute the next shard.
 if(batchArg){
  const n=Number(batchArg.slice(8));
  for(let prior=1;prior<n;prior++){
   const key='B'+String(prior).padStart(2,'0');
   const relative='data/review/p12-g04s1-113-existingadmission-fixed29-'+key.toLowerCase()+'-formal-admission-closeout-v1.json';
   const absolute=path.join(ROOT,relative);
   if(!fs.existsSync(absolute))throw new Error(key+'_NOT_FORMALLY_CLOSED: no existing Admission and main/Pages release receipt; do not start B'+String(n).padStart(2,'0'));
   const receipt=read(relative);
   if(receipt.batch!==key||receipt.source_work_positions_total!==batches[prior-1].source_work_pointer_count||
      receipt.all_source_positions_final_disposition_complete!==true||
      receipt.existing_operator_admission_gate_accepted!==true||
      receipt.selective_release_main_and_live_pages_verified_or_no_eligible_items!==true||
      receipt.batch_formal_closeout_verified!==true)
    throw new Error(key+'_NOT_FORMALLY_CLOSED: source work-only or incomplete Admission/Pages receipt');
  }
 }
 if(arg){
  const out=path.resolve(arg.slice(10));
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(summary,null,2)+'\n');
  for(const b of selected)fs.writeFileSync(path.join(out,b.batch.toLowerCase()+'.json'),JSON.stringify(b,null,2)+'\n');
 }else process.stdout.write(JSON.stringify({...summary,generated_batches:selected.map(x=>({batch:x.batch,start:x.position_start,end:x.position_end,proven:x.exact_original_source_id_evidence_count,pending:x.unidentified_source_work_budget_count}))},null,2)+'\n');
}
module.exports={build};
