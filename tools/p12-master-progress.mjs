import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {reconcileP11R1} from "./p11r1-reconcile.mjs";
import {buildP12Preflight} from "./p12-source-preflight.mjs";

const ROOT=resolve(fileURLToPath(new URL("..",import.meta.url)));
const EVENT_PATH="site/data/governance/p12-review-events.json";
const MASTER_PATH="site/data/governance/p12-master-progress.json";
const CSV_PATH="site/data/governance/p12-master-progress.csv";
const read=x=>JSON.parse(readFileSync(resolve(ROOT,x),"utf8"));
const fail=(c,m)=>{if(!c)throw new Error("SCIENCE_P12_MASTER_LEDGER_INVALID: "+m);};
const actions=new Set(["START","BLOCK","CERTIFY_STAGED","REJECT","REOPEN"]);
const pad=(n,width=2)=>String(n).padStart(width,"0");
const csvEscape=x=>'"'+String(x??"").replace(/"/g,'""')+'"';
const sortBySource=(a,b)=>a.source_order-b.source_order||a.section_order-b.section_order||a.source_part_number-b.source_part_number||a.part_slot_ordinal-b.part_slot_ordinal;

export function buildMaster({r1=reconcileP11R1(),queue=buildP12Preflight({r1}),events=read(EVENT_PATH)}={}){
 const source=read("site/data/governance/p11-source-sections.json");
 fail(source.source_papers.length===8&&queue.candidate_slots.length===326&&r1.reconciled_source_slots.length===477,"baseline count drift");
 fail(events.schema_version==="SCIENCE_EXAM_P12_REVIEW_EVENTS_V1"&&Array.isArray(events.events),"review journal missing");
 const priority=new Map(queue.batch_groups.map(x=>[x.source_id,x.queue_priority]));
 const sources=new Map(source.source_papers.map(p=>[p.source_id,{...p,source_order:priority.get(p.source_id)}]));
 const bySourceSlot=new Map(r1.reconciled_source_slots.map(x=>[x.source_slot_id,x]));
 const pending=new Map();
 for(const item of queue.candidate_slots){
  const paper=sources.get(item.source_id);
  const sectionOrder=paper?.sections.findIndex(x=>x.section_code===item.section_code);
  fail(!!paper&&sectionOrder>=0,"unregistered source or section "+item.source_slot_id);
  fail(paper.source_pdf_sha256===item.source_pdf_sha256,"source sha mismatch "+item.source_slot_id);
  fail(!pending.has(item.source_slot_id)&&bySourceSlot.get(item.source_slot_id)?.admission_status==="INVENTORIED_PENDING_INDIVIDUAL_QUESTION_REVIEW","candidate no longer pending or duplicated "+item.source_slot_id);
  pending.set(item.source_slot_id,{...item,source_order:paper.source_order,section_order:sectionOrder,state:"NOT_STARTED",
   last_event_id:null,last_event_at_utc:null,last_reviewer:null,review_evidence_ref:null,block_reason:null});
 }
 const observedEvents=new Set();
 for(const event of events.events){
  fail(event&&typeof event.event_id==="string"&&event.event_id.length>0&&!observedEvents.has(event.event_id),"event id invalid/duplicate");
  observedEvents.add(event.event_id);
  const item=pending.get(event.source_slot_id);
  fail(!!item,"event points to unknown source slot "+event.source_slot_id);
  fail(actions.has(event.action),"event action unknown "+event.action);
  fail(typeof event.recorded_at_utc==="string"&&!Number.isNaN(Date.parse(event.recorded_at_utc)),"event timestamp missing "+event.event_id);
  fail(typeof event.reviewer==="string"&&event.reviewer.trim(),"reviewer missing "+event.event_id);
  if(item.last_event_at_utc)fail(Date.parse(event.recorded_at_utc)>=Date.parse(item.last_event_at_utc),"event chronology reversed");
  if(event.action==="START")fail(["NOT_STARTED","BLOCKED","IN_PROGRESS"].includes(item.state),"START after final review requires REOPEN");
  if(event.action==="BLOCK")fail(["NOT_STARTED","IN_PROGRESS","BLOCKED"].includes(item.state)&&typeof event.reason==="string"&&event.reason.trim(),"BLOCK requires reason");
  if(event.action==="CERTIFY_STAGED")fail(["IN_PROGRESS","BLOCKED"].includes(item.state)&&event.source_question_text_verified===true
    &&event.science_answer_verified===true&&event.kp_mapping_verified===true
    &&event.visual_dependency_verified===true&&typeof event.review_evidence_ref==="string"&&event.review_evidence_ref.trim(),
    "CERTIFY_STAGED requires all question-level gates and evidence");
  if(event.action==="REJECT")fail(["IN_PROGRESS","BLOCKED"].includes(item.state)
    &&typeof event.reason==="string"&&event.reason.trim()&&typeof event.review_evidence_ref==="string"&&event.review_evidence_ref.trim(),
    "REJECT requires reason and evidence");
  if(event.action==="REOPEN")fail(["CERTIFIED_STAGED","REJECTED"].includes(item.state)
    &&typeof event.reason==="string"&&event.reason.trim(),"REOPEN only after terminal decision with rationale");
  const next={START:"IN_PROGRESS",BLOCK:"BLOCKED",CERTIFY_STAGED:"CERTIFIED_STAGED",REJECT:"REJECTED",REOPEN:"IN_PROGRESS"};
  item.state=next[event.action];
  item.last_event_id=event.event_id;item.last_event_at_utc=event.recorded_at_utc;item.last_reviewer=event.reviewer;
  item.review_evidence_ref=event.review_evidence_ref??null;item.block_reason=event.action==="BLOCK"?event.reason:null;
 }
 const candidates=[...pending.values()].sort((a,b)=>{
  const priority=x=>x.state==="IN_PROGRESS"?0:x.state==="NOT_STARTED"?1:x.state==="BLOCKED"?2:3;
  return priority(a)-priority(b)||sortBySource(a,b);
 });
 const next=candidates.find(x=>x.state==="IN_PROGRESS"||x.state==="NOT_STARTED")??null;
 const rows=[];
 for(const p of source.source_papers){
  const r=r1.per_source_summary.find(x=>x.source_id===p.source_id);
  fail(!!r&&r.source_pdf_sha256===p.source_pdf_sha256,"source PDF integrity "+p.source_id);
  const queueRows=[...pending.values()].filter(x=>x.source_id===p.source_id);
  const counts={not_started:queueRows.filter(x=>x.state==="NOT_STARTED").length,
    in_progress:queueRows.filter(x=>x.state==="IN_PROGRESS").length,
    blocked:queueRows.filter(x=>x.state==="BLOCKED").length,
    certified_staged:queueRows.filter(x=>x.state==="CERTIFIED_STAGED").length,
    rejected:queueRows.filter(x=>x.state==="REJECTED").length};
  fail(queueRows.length===r.remaining_candidate_positions,"source candidate ledger mismatch "+p.source_id);
  const left=counts.not_started+counts.in_progress+counts.blocked;
  const resolved=counts.certified_staged+counts.rejected;
  const rowNext=queueRows.filter(x=>x.state==="IN_PROGRESS"||x.state==="NOT_STARTED").sort(sortBySource)[0]??null;
  const year=113; // Recorded corpus batch only; does not imply all external papers discovered
  const sha=p.source_pdf_sha256;
  rows.push({
   paper_uid:"SCI-"+year+"-"+p.source_id+"-"+sha.slice(0,12),
   source_id:p.source_id,source_pdf_sha256:sha,source_year:year,
   school:p.school,grade:p.grade,semester:p.semester,exam:p.exam,
   original_source_pages:p.source_pdf_page_count,
   source_identity_status:"PDF_SHA256_VERIFIED",
   textbook_publisher:"NOT_VERIFIED_METADATA_ONLY",
   inclusion_policy:"PUBLISHER_NEUTRAL_KP_BASED",
   source_registration_status:"REGISTERED",
   paper_section_inventory_status:"PROVISIONAL_POSITIONAL_INVENTORY",
   full_paper_question_review_complete:left===0,
   source_original_positions:r.original_source_answer_positions,
   exact_original_TF_linked:r.published_original_TF,
   adapted_context_original_positions_linked:r.source_positions_linked_to_adapted_context,
   pending_before_p12:r.remaining_candidate_positions,
   pending_remaining:left,
   p12_events_recorded:queueRows.filter(x=>x.last_event_id).length,
   ...counts,
   completion_state:left>0?"PARTIALLY_CERTIFIED_REVIEW_PENDING":"ALL_REGISTERED_POSITIONS_DECIDED_NOT_AUTOMATIC_FINAL_ACCEPTANCE",
   sections:p.sections.map((sec,i)=>{
    const slotRows=[...queueRows].filter(x=>x.section_code===sec.section_code);
    const sOriginal=r1.reconciled_source_slots.filter(x=>x.source_id===p.source_id&&x.section_code===sec.section_code);
    return {section_code:sec.section_code,section_order:i+1,positions:sec.slot_count,
      originally_linked:sOriginal.filter(x=>x.admission_status!=="INVENTORIED_PENDING_INDIVIDUAL_QUESTION_REVIEW").length,
      not_started:slotRows.filter(x=>x.state==="NOT_STARTED").length,
      in_progress:slotRows.filter(x=>x.state==="IN_PROGRESS").length,
      blocked:slotRows.filter(x=>x.state==="BLOCKED").length,
      resolved:slotRows.filter(x=>["CERTIFIED_STAGED","REJECTED"].includes(x.state)).length};
   }),
   last_review_event_at_utc:queueRows.map(x=>x.last_event_at_utc).filter(Boolean).sort().at(-1)??null,
   next_source_slot_id:rowNext?.source_slot_id??null,
   next_original_section:rowNext?.section_code??null,
   next_source_page_start:rowNext?.source_page_start??null
  });
 }
 fail(rows.reduce((a,x)=>a+x.source_original_positions,0)===477
   &&rows.reduce((a,x)=>a+x.exact_original_TF_linked,0)===72
   &&rows.reduce((a,x)=>a+x.adapted_context_original_positions_linked,0)===79
   &&rows.reduce((a,x)=>a+x.pending_before_p12,0)===326,"source accounting drift");
 const inProgress=[...pending.values()].filter(x=>x.state==="IN_PROGRESS").sort(sortBySource);
 const blockers=[...pending.values()].filter(x=>x.state==="BLOCKED").sort(sortBySource);
 return {
  schema_version:"SCIENCE_EXAM_P12_MASTER_PROGRESS_V1",
  data_policy:"GENERATED_FROM_P11R1_SOURCE_LEDGER_PLUS_APPEND_ONLY_P12_REVIEW_EVENTS",
  sources_discovered_in_registered_corpus:8,
  external_drive_global_discovery_complete:false,
  external_sources_not_yet_registered_count:null,
  paper_uid_policy:"SOURCE_PDF_SHA256_IS_IDENTITY_NOT_PUBLISHER_OR_SCOPE_ONLY",
  publisher_filter_enabled:false,
  public_question_bank_answer_slots_unchanged:148,
  scanned_original_answer_positions:477,
  originally_linked_exact_TF:72,
  originally_linked_adapted_context_source_positions:79,
  candidate_position_baseline:326,
  position_status_counts:{not_started:[...pending.values()].filter(x=>x.state==="NOT_STARTED").length,
   in_progress:inProgress.length,blocked:blockers.length,
   certified_staged:[...pending.values()].filter(x=>x.state==="CERTIFIED_STAGED").length,
   rejected:[...pending.values()].filter(x=>x.state==="REJECTED").length},
  review_events_count:events.events.length,
  complete_papers:rows.filter(x=>x.full_paper_question_review_complete).length,
  incomplete_papers:rows.filter(x=>!x.full_paper_question_review_complete).length,
  resume_checkpoint:next?{
    next_task:"SCIENCE_EXAM_S3_P12_"+next.source_id.replaceAll("-","")+"_FullPaperCandidateScreening",
    source_id:next.source_id,
    source_pdf_sha256:next.source_pdf_sha256,
    source_slot_id:next.source_slot_id,
    source_section_code:next.section_code,
    original_pdf_page_range:[next.source_page_start,next.source_page_end],
    state:next.state,
    required_next_actions:["VERIFY_PDF_SHA","READ_ORIGINAL_QUESTION","CHECK_SCIENCE_ANSWER","MAP_CANONICAL_KP","VERIFY_FIGURE_CONTEXT","APPEND_REVIEW_EVENT_COMMIT"],
    note:"Resume exactly this original slot. Any screening transition must be appended as a committed, validated event; staging is not public admission."
  }:null,
  in_progress_slots:inProgress.map(x=>x.source_slot_id),
  blocked_slots:blockers.map(x=>({slot_id:x.source_slot_id,reason:x.block_reason})),
  paper_rows:rows
 };
}
export function csvForMaster(m){
 const cols=["paper_uid","source_id","school","source_year","grade","semester","exam","source_pdf_sha256","source_original_positions",
 "exact_original_TF_linked","adapted_context_original_positions_linked","pending_before_p12","not_started","in_progress","blocked",
 "certified_staged","rejected","pending_remaining","completion_state","next_source_slot_id","last_review_event_at_utc"];
 return "\ufeff"+[cols.join(","),...m.paper_rows.map(x=>cols.map(k=>csvEscape(x[k])).join(","))].join("\r\n")+"\r\n";
}
export function writeMaster({check=false}={}){
 const master=buildMaster(),obj=JSON.stringify(master,null,2)+"\n",csv=csvForMaster(master);
 for(const [path,bytes] of [[MASTER_PATH,obj],[CSV_PATH,csv]]){
  const full=resolve(ROOT,path);
  if(check)fail(existsSync(full)&&readFileSync(full,"utf8")===bytes,"generated master stale "+path);
  else writeFileSync(full,bytes);
 }
 return {papers:master.paper_rows.length,positions:master.scanned_original_answer_positions,
  tf:master.originally_linked_exact_TF,adaptedPositions:master.originally_linked_adapted_context_source_positions,
  pending:master.position_status_counts.not_started,liveItems:148,resume:master.resume_checkpoint?.source_slot_id??null};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log("P12_MASTER_RESUME_LEDGER_PASS",JSON.stringify(writeMaster({check:process.argv.includes("--check")})));
}
