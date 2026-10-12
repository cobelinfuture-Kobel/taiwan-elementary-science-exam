import {existsSync,readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {reconcileP11R1} from "./p11r1-reconcile.mjs";
const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const outPath="site/data/governance/p12-frozen-candidate-queue.json";
const prefer=["G03-S2-MID","G03-S2-FINAL","G04-S2-MID","G04-S2-FINAL","G03-S1-MID","G03-S1-FINAL","G04-S1-MID","G04-S1-FINAL"];
const assert=(ok,message)=>{if(!ok)throw Error("P12_PREFLIGHT_BLOCKED "+message);};
export function buildP12Preflight({r1=reconcileP11R1()}={}){
 assert(r1.admission_gate.controlled_p12_candidate_screening_enabled
  &&!r1.admission_gate.direct_bulk_publication_without_individual_answer_KP_visual_gates_enabled,
  "P11R1 admission policy not frozen");
 const pending=r1.reconciled_source_slots.filter(s=>s.admission_status==="INVENTORIED_PENDING_INDIVIDUAL_QUESTION_REVIEW");
 assert(pending.length===326,"wrong candidate count");
 const groups=prefer.map((sourceId,i)=>{
  const sourceRows=pending.filter(s=>s.source_id===sourceId);
  const sections=[...new Set(sourceRows.map(s=>s.section_code))];
  return {queue_priority:i+1,source_id:sourceId,
    grade:Number(sourceId.slice(1,3)),semester:Number(sourceId.slice(5,6)),
    exam_period:sourceId.endsWith("MID")?"MIDTERM":"FINAL",
    candidate_answer_positions:sourceRows.length,
    source_sha256:sourceRows[0]?.source_pdf_sha256??null,
    remaining_section_codes:sections,
    source_locator_state:"SECTION_AND_POSITIONAL_ORDINAL; CONTENT_NOT_YET_CERTIFIED",
    task:"SOURCE_EXACT_QUESTION_TEXT_ASSET_EXTRACTION_AND_ONE_BY_ONE_ANSWER_KP_REVIEW",
    publish_state:"NOT_ADMITTED"}
 });
 assert(groups.length===8&&groups.reduce((n,g)=>n+g.candidate_answer_positions,0)===326
  &&groups.every(x=>x.candidate_answer_positions>0),"candidate source grouping invalid");
 const items=pending.slice().sort((a,b)=>{
  const pi=prefer.indexOf(a.source_id)-prefer.indexOf(b.source_id);
  if(pi)return pi;
  return a.source_slot_id.localeCompare(b.source_slot_id,"en");
 }).map(x=>({
  source_slot_id:x.source_slot_id,source_id:x.source_id,source_pdf_sha256:x.source_pdf_sha256,
  source_page_start:x.source_page_start,source_page_end:x.source_page_end,
  section_code:x.section_code,source_part_number:x.source_part_number,
  part_slot_ordinal:x.part_slot_ordinal,
  question_stem_extracted:false,answer_science_verified:false,kp_mapping_verified:false,
  visual_dependency_verified:false,release_permission:false,
  candidate_state:"AWAITING_EXACT_SOURCE_QUESTION_REVIEW"
 }));
 return {schema_version:"SCIENCE_EXAM_P12_SOURCE_PREFLIGHT_QUEUE_V1",
  source_of_truth:"P11R1_VERIFIED_477_SOURCE_SLOT_RECONCILIATION",
  candidate_answer_positions:326,source_papers:8,public_answer_slots_frozen:148,
  no_additions_in_this_phase:true,priority_rationale:"S2 first to address undercovered G03/G04 second semester; then S1",
  p12_next_execution_task:"SCIENCE_EXAM_S3_P12_G03S2MID_FullPaperCandidateScreening",
  first_batch_source:"G03-S2-MID",
  retained_review_gate:"NEVER_AUTO_RELEASE_WITHOUT_EXACT_SOURCE_ANSWER_KP_AND_ASSET_CHECKS",
  batch_groups:groups,candidate_slots:items};
}
export function materializeP12Preflight({check=false}={}){
 const d=buildP12Preflight(),loc=resolve(root,outPath),body=JSON.stringify(d,null,2)+"\n";
 if(check){assert(existsSync(loc),"missing P12 queue");assert(readFileSync(loc,"utf8")===body,"P12 queue not readback equivalent");}
 else writeFileSync(loc,body);
 return {sourcePapers:8,candidateSlots:326,publicItemsUnchanged:148,firstSource:d.first_batch_source};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
 console.log("P12_SOURCE_AUTHORITY_PREFLIGHT_PASS",JSON.stringify(materializeP12Preflight({check:process.argv.includes("--check")})));
