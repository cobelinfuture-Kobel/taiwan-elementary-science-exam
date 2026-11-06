#!/usr/bin/env node
/**
 * P12 113 G4S1 ALL29 FullFix bulk admission worklist executor.
 * Source work slots != certified independent questions. Runs the EXISTING
 * Admission Gate as evidence inventory; never signs an operator approval,
 * upgrades a model answer to formal, or writes the student question bank.
 * 9 frozen paper-complete batches, 100..150 initial UNREVIEWED slots each.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
export const ROOT=path.resolve(HERE,'../..');
const P='data/review/p12-g04s1-113-all29-';
export const PLAN_PATH=P+'bulk-admission-fullfix-1122-nine-batch-frozen-plan-v1.json';
export const BASE_PATH=P+'known-atomic-disjoint-source-ledger-v8.json';
export const GATE_ORDER=['SOURCE_EXACT','PDF_PAGE_BBOX','SCIENCE_UNIQUE_ANSWER','CANONICAL_KP','DUPLICATE','RIGHTS','OPERATOR_EXACT_SCOPE'];
export function readJson(p){return JSON.parse(readFileSync(path.join(ROOT,p),'utf8'));}
export function invariant(ok,message){if(!ok)throw Error('BULK_ADMISSION_FAIL_CLOSED: '+message);}
const tally=records=>records.reduce((o,r)=>(o[r.effective_disposition]=(o[r.effective_disposition]||0)+1,o),{PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0});
const gitBlobSha=content=>{const bytes=Buffer.from(content,'utf8');return createHash('sha1').update('blob '+bytes.byteLength+'\0').update(bytes).digest('hex');};

function originalSourceStatus(){
 const plan=readJson(PLAN_PATH),ledger=readJson(BASE_PATH);
 const bytes=readFileSync(path.join(ROOT,BASE_PATH),'utf8');
 invariant(gitBlobSha(bytes)===plan.immutable_source_ledger_blob_sha,'source v8 blob SHA mismatch');
 invariant(plan.target_batch_count===9&&plan.minimum_batch_positions===100&&plan.maximum_batch_positions===150,'unapproved batch sizing');
 invariant(ledger.original_papers.length===29&&ledger.known_atomic_source_dispositions.length===1762,'29-paper source registry drift');
 invariant(ledger.source_position_count_distinct_known===1762,'original source position count drift');
 invariant(plan.preexisting_approved_public_113_sources_unchanged===333,'public333 preflight drift');
 const one=readJson(P+'scan5-heshun-final001-mc008-unique-answer-hold-overlay-v1.json');
 const moon=readJson(P+'scan4-heshun-mid002-moonphase7-scope-hold-overlay-v1.json');
 const alias=readJson(P+'final005-tf007-exact-public114-alias-overlay-v1.json');
 const changes=new Map();
 function add(id,status,why){
  invariant(!changes.has(id),'same source position appears twice in append-only overlay: '+id);
  changes.set(id,{status,why});
 }
 add(one.source_slot_id,'HOLD',one.existing_gate_reason);
 invariant(moon.exact_seven_original_source_slots.length===7,'seven moon-phase scope Hold drift');
 for(const r of moon.exact_seven_original_source_slots)add(r.source_slot_id,'HOLD',r.existing_gate_failure);
 add(alias.source_slot_id,'ALIAS','ALREADY_PUBLISHED_114_EXACT_STEM');
 invariant(changes.size===9,'expected one science Hold, seven moon Holds and one 114 exact alias');
 const seen=new Set();
 const effective=ledger.known_atomic_source_dispositions.map(r=>{
  invariant(!seen.has(r.source_slot_id),'duplicate original position '+r.source_slot_id);
  seen.add(r.source_slot_id);
  const change=changes.get(r.source_slot_id);
  if(change)invariant(r.disposition==='UNREVIEWED','overlay attempted to reopen '+r.source_slot_id);
  return {...r,effective_disposition:change?.status||r.disposition,existing_gate_exception:change?.why||null};
 });
 invariant([...changes.keys()].every(id=>seen.has(id)),'overlay referenced nonexistent original source');
 const counts=tally(effective);
 invariant(JSON.stringify(counts)===JSON.stringify(plan.source_work_disjoint_effective),'effective 1762 disjoint drift');
 invariant(counts.PUBLISHED===333&&counts.HOLD===291&&counts.ALIAS===16&&counts.UNREVIEWED===1122,'unexpected effective disposition counts');
 const allUnreviewed=effective.filter(x=>x.effective_disposition==='UNREVIEWED');
 const seenPlanned=new Set(),paperToBatch=new Map(),batchToIds=new Map();
 for(const b of plan.batches){
  invariant(/^B0[1-9]$/.test(b.batch_id),'bad batch key '+b.batch_id);
  invariant(b.source_slot_ids.length===b.source_work_count&&b.source_work_count>=100&&b.source_work_count<=150,'batch size outside approved 100..150');
  const paperCounts={};
  const ids=new Set();
  for(const id of b.source_slot_ids){
   invariant(!seenPlanned.has(id),'source work slot appears in multiple batches '+id);
   seenPlanned.add(id);
   ids.add(id);
   const p=id.split('|')[0];
   invariant(b.original_paper_ids.includes(p),'source work paper ID absent from batch '+id);
   invariant(!paperToBatch.has(p)||paperToBatch.get(p)===b.batch_id,'original paper split across batches '+p);
   paperToBatch.set(p,b.batch_id);
   paperCounts[p]=(paperCounts[p]||0)+1;
  }
  invariant(JSON.stringify(paperCounts)===JSON.stringify(b.paper_unreviewed_count),'batch per-paper row counts drift '+b.batch_id);
  invariant([...new Set(b.original_paper_ids)].length===b.original_paper_ids.length,'duplicate original paper grouping '+b.batch_id);
  batchToIds.set(b.batch_id,ids);
 }
 invariant(seenPlanned.size===1122&&allUnreviewed.every(x=>seenPlanned.has(x.source_slot_id)),'frozen plan no longer covers exact 1122 source slots');
 const a=new Map(effective.map(x=>[x.source_slot_id,x]));
 invariant([...seenPlanned].every(id=>a.get(id)?.effective_disposition==='UNREVIEWED'),'plan included already published/held/alias source');
 const authority=readJson('site/data/authority/science-g03-g04-selector-v3.json');
 const kps=authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points);
 invariant(kps.length===48&&new Set(kps.map(x=>x.canonical_kp_id)).size===48,'113 G4S1 frozen 48 KP drift');
 return {plan,ledger,effective,byId:a,batchToIds,validKps:new Map(kps.map(x=>[x.canonical_kp_id,x.title])),counts};
}
function exactSeven(){
 const signed=readJson(P+'exact7-item-gate-operator-approval-roster-PENDING-v1.json');
 invariant(signed.candidates_count===7&&signed.sources.length===7,'operator cohort must be exact7');
 invariant(signed.operator_exact_7_source_ids_approved===false&&signed.public_student_bank_release_authorized===false,'candidate roster unexpectedly claims approval; stop');
 const dadun=readJson(P+'exact2-source-science-kp-rights-operator-pending-v1.json');
 const neian=readJson(P+'neian-mid006-page1-three-scanned-exact-source-science-kp-gate-v1.json');
 const yongan=readJson(P+'yongan-final005-five-lighttf-original-source-kp-dedup-v1.json');
 const inputs=[...dadun.records,...neian.rows,...yongan.rows];
 const recordMap=new Map(inputs.map(x=>[x.source_slot_id,x]));
 const candidates=new Map();
 for(const q of signed.sources){
  invariant(!candidates.has(q.id),'repeated candidate ID');
  const e=recordMap.get(q.id);
  invariant(e,'candidate lacks original source evidence: '+q.id);
  const stem=e.original_stem_verbatim;
  const bbox=e.original_native_answer_bbox_pdf_points_top_left||e.original_source_response_bbox_pdf_pts_top_left||e.original_answer_bracket_bbox_pdf_pts_top_left;
  invariant(typeof stem==='string'&&stem.trim().length>=6,'not full original stem: '+q.id);
  invariant(Array.isArray(bbox)&&bbox.length===4&&bbox.every(Number.isFinite),'not physical source answer rectangle: '+q.id);
  const originalOptions=e.original_four_ordered_options||e.original_options||[];
  const type=e.original_question_type||e.original_type;
  invariant(type==='MC'?originalOptions.length===4:originalOptions.length===0,'original ordered choices missing '+q.id);
  invariant(q.kp===(e.direct_113_frozen48kp_id||e.model_proposed_direct_frozen48kp),'candidate KP mismatch '+q.id);
  invariant(e.operator_exact_source_roster_approved===false||e.operator_approved===false||e.exact_operator_cohort_approval===false,'candidate has unexpectedly signed release '+q.id);
  candidates.set(q.id,{id:q.id,paper_id:q.id.split('|')[0],source_proof_path:q.source,stem,ordered_options:originalOptions,source_page:e.original_pdf_page_1based||e.original_pdf_page_1_based||e.original_source_page_1_based,bbox,model_answer:q.answer,model_direct_kp:q.kp,model_kp_title:e.direct_113_frozen48kp_title||e.direct_frozen_title||e.model_proposed_direct_frozen48kp_title,source_identity_verified:true,geometry_verified_source_proof:true,model_science_supported:true,model_direct_kp_supported:true,rights_article9_exam_text_only_preliminary:true,formal_duplicate_complete:false,formal_operator_approved:false});
 }
 invariant(candidates.size===7,'only 7 source evidence candidates');
 return candidates;
}
function evidenceFor(row,candidates,scan4){
 const c=candidates.get(row.source_slot_id);
 const scan=scan4.get(row.source_slot_id);
 const geometryPath=c?.source_proof_path||scan?.geometry_proof_file||row.source_geometry_proof||null;
 const geometryState=c?'EXACT_SOURCE_BBOX_PROVENANCE':scan?'EXACT_RASTER_BBOX_PROVENANCE':geometryPath?'EXISTING_SOURCE_GEOMETRY_PROVENANCE':'NEEDS_ORIGINAL_SOURCE_LOCATION';
 const gates={
  SOURCE_EXACT:c?'EVIDENCE_ORIGINAL_FULL_STEM_OPTIONS_PARENT':'PENDING_FULL_STEM_AND_OPTIONS_PARENT',
  PDF_PAGE_BBOX:c||scan?'EVIDENCE_EXACT_ORIGINAL_SOURCE_GEOMETRY':geometryPath?'PROVENANCE_LINK_ONLY_NEEDS_BBOX_ACCEPTANCE':'PENDING_PHYSICAL_GLYPH_BBOX',
  SCIENCE_UNIQUE_ANSWER:c?'MODEL_CANDIDATE_NOT_FORMAL':'PENDING_ORIGINAL_SCIENCE_ANSWER',
  CANONICAL_KP:c?'MODEL_DIRECT_FROZEN48_NOT_FORMAL':'PENDING_DIRECT_FROZEN48_KP',
  DUPLICATE:c?'PARTIAL_NO_PUBLIC_OR_114_EXACT;FULL_11329_SEMANTIC_PENDING':'PENDING_FULL_11329_11425_SEMANTIC_DEDUP',
  RIGHTS:c?'ARTICLE9_EXAM_TEXT_ONLY_CANDIDATE':'PENDING_COMPONENT_RIGHTS',
  OPERATOR_EXACT_SCOPE:'PENDING_EXACT_SOURCE_COHORT_SIGNOFF'
 };
 const missing=GATE_ORDER.filter(g=>!gates[g].startsWith('ACCEPTED'));
 // 'EVIDENCE_*' is not admission accepted; only an auditable source evidence lineage.
 invariant(missing.length===7,'do not mark any Gate formally passed based solely on a source listing/model');
 return {
  source_slot_id:row.source_slot_id,paper_id:row.paper_id,original_source_page:row.source_page??scan?.source_pdf_page_1based??null,
  immutable_original_disposition:row.disposition,effective_disposition:row.effective_disposition,
  provenance_tier:row.evidence_tier||null,geometry_source_proof_ref:geometryPath,
  source_geometry_kind:geometryState,
  original_response_bbox_pdf_pts_top_left:c?.bbox||scan?.original_source_response_region_bbox_pdf_points_top_left||row.source_geometry_bbox_pts||row.original_native_bbox_pts_top_left||row.original_source_bbox_pts_top_left||null,
  original_stem_held_in_evidence_ref:c?.source_proof_path||null,
  original_source_text_disclosed_in_execution_summary:false,
  original_parent_or_figure_dependency:row.source_parent_group||row.source_parent||row.source_response_mode||scan?.original_parent_dependency||null,
  knowledge_point_model_candidate:c?.model_direct_kp||null,
  source_candidate_stage:c?'MODEL_SOURCE_SCIENCE_KP_SUPPORTED_NOT_OPERATOR_APPROVED':'SOURCE_PROVENANCE_REGISTERED_UNREVIEWED',
  gate_results:gates,missing_formal_gates:missing,
  next_short_step:c?'EXACT_OPERATOR_ELIGIBLE_REVIEW_AFTER_FULL_SEMANTIC_ACCEPTANCE':'ORIGINAL_EXACT_FULL_QUESTION_OPTIONS_PARENT_AND_GATE_INHERITED_EVIDENCE',
  admission_ready:false,published_new:false
 };
}
export function analyze({batch='all'}={}){
 const s=originalSourceStatus();
 const candidates=exactSeven();
 const b01Resolution=readJson(P+'bulk-b01-mingyi10-existing-legacy-exact9alias1science-hold-overlay-v1.json');
 invariant(b01Resolution.records.length===10,'B01 legacy-original source count unexpected');
 invariant(b01Resolution.source_ALIASES_reconciled===9&&b01Resolution.source_SCIENCE_CONFLICT_HOLD_reconciled===1,'B01 alias and hold mismatch');
 invariant(JSON.stringify(b01Resolution.prior_effective_all29)===JSON.stringify(s.counts),'B01 overlay previous effective snapshot is not frozen source ledger projection');
 const b01SourceEvents=new Map();
 const postContentCounts={...s.counts};
 for(const e of b01Resolution.records){
  invariant(!b01SourceEvents.has(e.source_slot_id),'duplicate B01 content event '+e.source_slot_id);
  invariant(s.byId.get(e.source_slot_id)?.effective_disposition==='UNREVIEWED','B01 attempted to reopen already classified source '+e.source_slot_id);
  invariant(e.source_status_after==='ALIAS'||e.source_status_after==='HOLD','bad B01 source post-disposition');
  b01SourceEvents.set(e.source_slot_id,e);
  postContentCounts.UNREVIEWED--;
  postContentCounts[e.source_status_after]++;
 }
 invariant(JSON.stringify(postContentCounts)===JSON.stringify(b01Resolution.after_effective_all29),'B01 content disposition conservation failed');
 const b01Interpaper=readJson(P+'bulk-b01-crossoriginal-two-duplicate-safety-children-HOLD-overlay-v1.json');
 invariant(JSON.stringify(b01Interpaper.previous_effective_all29)===JSON.stringify(postContentCounts),'B01 interpaper duplicate overlay previous status drift');
 invariant(b01Interpaper.records.length===2&&b01Interpaper.source_original_duplicate_child_HOLD_count===2,'expected two identical source child duplicates held');
 for(const r of b01Interpaper.records){
  const id=r.source_slot_id_to_hold;
  invariant(!b01SourceEvents.has(id),'duplicate cross-overlay B01 source ID '+id);
  invariant(s.byId.get(id)?.effective_disposition==='UNREVIEWED','attempted reopen previously frozen original source position '+id);
  invariant(r.source_stems_identical&&r.original_parent_instructions_equivalent_for_correct_statement_check,'unproven interpaper duplicate '+id);
  b01SourceEvents.set(id,{source_slot_id:id,source_status_after:'HOLD',event_source_type:'UNPUBLISHED_CANONICAL_DUPLICATE'});
  postContentCounts.UNREVIEWED--;
  postContentCounts.HOLD++;
 }
 invariant(JSON.stringify(postContentCounts)===JSON.stringify(b01Interpaper.current_effective_all29),'post B01 cross-school 2 HOLD ledger not conserved');
 const b01Exception42=readJson(P+'bulk-b01-existing-gate-42-source-hold-exception-overlay-v1.json');
 invariant(JSON.stringify(b01Exception42.before_all29_effective)===JSON.stringify(postContentCounts),'B01 42 exception overlay predecessor drift');
 invariant(b01Exception42.records.length===42&&b01Exception42.additional_existing_gate_exception_HOLD===42,'expected exactly 42 source-work documented blocker HOLDs');
 for(const r of b01Exception42.records){
  const id=r.source_slot_id;
  invariant(!b01SourceEvents.has(id),'B01 42 exception source overlaps existing classification '+id);
  invariant(s.byId.get(id)?.effective_disposition==='UNREVIEWED','B01 42 exception tried reopening previously completed source '+id);
  invariant(r.source_status_after==='HOLD'&&r.hold_reason.startsWith('HOLD_')&&r.original_source_proof_ref,'unproven B01 source exception '+id);
  b01SourceEvents.set(id,{source_slot_id:id,source_status_after:'HOLD',event_source_type:'B01_EXISTING_GATE_EXCEPTION'});
  postContentCounts.UNREVIEWED--;
  postContentCounts.HOLD++;
 }
 invariant(JSON.stringify(postContentCounts)===JSON.stringify(b01Exception42.after_all29_effective),'B01 completed exception disposition is not conserved');
 const scan4Rows=readJson(P+'scan4-182-existing-raster-sourceid-bbox-parent-crosswalk-v1.json').rows;
 const scan4=new Map(scan4Rows.map(x=>[x.source_slot_id,x]));
 invariant(scan4.size===182,'existing four scanned original PDF proof crosswalk drift');
 for(const id of candidates.keys())invariant(s.byId.get(id)?.effective_disposition==='UNREVIEWED','candidate source no longer unreviewed: '+id);
 const selected=batch==='all'?s.plan.batches:s.plan.batches.filter(b=>b.batch_id===batch);
 invariant(selected.length>0,'unknown batch ID: '+batch);
 const batches=selected.map(b=>{
  const rows=b.source_slot_ids.map(id=>{
   const source=evidenceFor(s.byId.get(id),candidates,scan4);
   const event=b01SourceEvents.get(id);
   return {
    ...source,
    post_B01_content_effective_disposition:event?.source_status_after||source.effective_disposition,
    existing_public_source_duplicate_suppressed:event?.source_status_after==='ALIAS'||false,
    existing_public_science_answer_disagreement_HOLD:event?.source_status_after==='HOLD'&&!event?.event_source_type||false,
    B01_unpublished_canonical_duplicate_HOLD:event?.event_source_type==='UNPUBLISHED_CANONICAL_DUPLICATE'||false,
    B01_existing_gate_exception_HOLD:event?.event_source_type==='B01_EXISTING_GATE_EXCEPTION'||false,
    post_content_source_disposition_evidence:event?.event_source_type==='B01_EXISTING_GATE_EXCEPTION'?'data/review/p12-g04s1-113-all29-bulk-b01-existing-gate-42-source-hold-exception-overlay-v1.json':event?.event_source_type==='UNPUBLISHED_CANONICAL_DUPLICATE'?'data/review/p12-g04s1-113-all29-bulk-b01-crossoriginal-two-duplicate-safety-children-HOLD-overlay-v1.json':event?'data/review/p12-g04s1-113-all29-bulk-b01-mingyi10-existing-legacy-exact9alias1science-hold-overlay-v1.json':null
   };
  });
  const nCandidate=rows.filter(r=>r.source_candidate_stage.startsWith('MODEL_SOURCE')).length;
  const nBbox=rows.filter(r=>r.source_geometry_kind==='EXACT_RASTER_BBOX_PROVENANCE'||r.source_geometry_kind==='EXACT_SOURCE_BBOX_PROVENANCE').length;
  const nGeometryRefs=rows.filter(r=>!!r.geometry_source_proof_ref).length;
  const reports=Object.entries(b.paper_unreviewed_count).map(([paper_id,count])=>({paper_id,source_work_positions_scoped:count,source_ids_examined:rows.filter(x=>x.paper_id===paper_id).length,formal_admission_paper_closeout:false}));
  return {
   schema_version:'P12_G04S1_113_BULK_ADMISSION_EXECUTION_BATCH_V1',batch_id:b.batch_id,original_paper_ids:b.original_paper_ids,
   input_source_work_positions:b.source_work_count,
   source_ids_evidence_gates_screened:rows.length,source_geometry_provenance_links:nGeometryRefs,
   exact_original_physical_bbox_evidence_attached:nBbox,
   model_supported_exact_source_candidates_pending_operator_and_full_duplicate:nCandidate,
   unresolved_existing_gates:rows.filter(r=>r.post_B01_content_effective_disposition==='UNREVIEWED').length,
   already_public_alias_sources_suppressed:rows.filter(r=>r.post_B01_content_effective_disposition==='ALIAS').length,
   original_answer_conflict_source_HOLD:rows.filter(r=>r.existing_public_science_answer_disagreement_HOLD).length,
   original_interpaper_duplicate_source_HOLD:rows.filter(r=>r.B01_unpublished_canonical_duplicate_HOLD).length,
   original_existing_gate_exception_source_HOLD:rows.filter(r=>r.B01_existing_gate_exception_HOLD).length,
   changed_ledger_dispositions_by_this_automated_run:0,
   formal_science_kp_approved_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,
   original_paper_level_progress:reports,
   rows
  };
 });
 const r={
  schema_version:'P12_G04S1_113_BULK_ADMISSION_FULLFIX_RUN_SUMMARY_V1',
  operation:'EVIDENCE_GATE_SCREENING_NO_AUTO_PROMOTION',
  selected_batches:batches.map(b=>b.batch_id),
  planned_total_source_work_positions:1122,
  this_run_scoped_source_work_positions:batches.reduce((x,b)=>x+b.source_ids_evidence_gates_screened,0),
  whole_paper_not_split:true,
  all_29_original_papers_registered:29,
  original_disjoint_effective:s.counts,
  post_B01_content_evidence_projection:postContentCounts,
  post_B01_total_remaining_unreviewed:postContentCounts.UNREVIEWED,
  B01_preexisting_public_exact_alias9_and_science_conflict_HOLD1_count:b01Resolution.records.length,
  B01_new_cross_school_same_parent_duplicate_HOLD_count:b01Interpaper.records.length,
  B01_additional_exact_existing_gate_exception_HOLD_count:b01Exception42.records.length,
  B01_final_preliminary_exact_source_operator_cohort_count:60,
  B01_source_dispositions_classified_total:b01SourceEvents.size,
  sourced_evidence_guide:'Existing Frozen PDF/SHA and PR124/PR183 geometry inherited; full original text, Science/KP, semantic duplicate, Article9 and exact operator acceptance are independent required Gate proofs.',
  candidate_exact7_model_stage_by_batch:batches.map(b=>({batch_id:b.batch_id,source_work:b.input_source_work_positions,candidates:b.model_supported_exact_source_candidates_pending_operator_and_full_duplicate})),
  formal_science_kp_approved_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,
  automated_run_does_not_sign_formal_admission:true,
  no_reopen_333_published_source_slots:true,
  frozen_48_kp_unchanged:true,
  next_step:'In each paper-complete batch, review pending exact original source text/parent and all missing formal Gate evidence; emit operator exact eligible roster only for fully accepted items, then selective student PR/CI/main/Pages E2E.',
  batches
 };
 invariant(r.this_run_scoped_source_work_positions===(batch==='all'?1122:selected[0].source_work_count),'screened batch source total drift');
 return r;
}
export function runCLI(args=process.argv.slice(2)){
 const options={batch:'all',outDir:null,check:false};
 for(const a of args){
  if(a==='--all')options.batch='all';
  else if(a==='--check')options.check=true;
  else if(a.startsWith('--batch='))options.batch=a.slice(8);
  else if(a.startsWith('--out-dir='))options.outDir=a.slice(10);
  else throw Error('unknown flag (fail closed): '+a);
 }
 invariant(options.check||options.outDir,'provide --check or --out-dir');
 invariant(!options.outDir||!path.resolve(ROOT,options.outDir).startsWith(path.join(ROOT,'site/data/question-bank/')),'never write student bank');
 const result=analyze({batch:options.batch});
 if(options.outDir){
  const dir=path.resolve(ROOT,options.outDir);
  mkdirSync(dir,{recursive:true});
  for(const b of result.batches)writeFileSync(path.join(dir,b.batch_id+'.json'),JSON.stringify(b,null,2)+'\n');
  const summary={...result,batches:undefined};
  writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 }
 process.stdout.write(JSON.stringify({mode:options.check?'check':'emit',batches:result.selected_batches,source_work_scoped:result.this_run_scoped_source_work_positions,post_B01_remaining_unreviewed:result.post_B01_total_remaining_unreviewed,one_gate_model_candidates:result.candidate_exact7_model_stage_by_batch.reduce((x,b)=>x+b.candidates,0),FORMAL_SCIENCE_KP_APPROVED_new:result.formal_science_kp_approved_new,ADMISSION_READY_new:0,PUBLISHED_new:0})+'\n');
 return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{runCLI();}catch(e){console.error(String(e.stack||e));process.exitCode=1;}
}
