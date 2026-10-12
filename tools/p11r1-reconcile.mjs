import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {buildP11} from "./p11-governance.mjs";

const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const path="site/data/governance/p11r1-reconciled-ledger.json";
const parse=x=>JSON.parse(readFileSync(resolve(root,x),"utf8"));
const hash=x=>createHash("sha256").update(x).digest("hex");
const pad=(x,n=2)=>String(x).padStart(n,"0");
function requireResult(condition,error){if(!condition)throw new Error("P11R1_EVIDENCE_GATE: "+error);}
const mapPath="site/data/governance/p11r1-reviewed-source-map.json";
export function reconcileP11R1({sourceMap=parse(mapPath),baseline=buildP11()}={}){
 const previous=baseline["p11-full-corpus-ledger.json"];
 const identities=baseline["p11-question-identities.json"];
 const groups=parse("site/data/question-bank/certified-context-groups-v2.json").groups;
 const sourceSections=parse("site/data/governance/p11-source-sections.json");
 requireResult(sourceMap.schema_version==="SCIENCE_EXAM_P11R1_HAND_REVIEWED_SOURCE_MAP_V1","map schema mismatch");
 requireResult(sourceMap.context_mappings?.length===20&&sourceMap.recorded_public_context_items===76,"all 20 contexts must be reviewed");
 const groupById=new Map(groups.map(x=>[x.id,x]));
 const paperById=new Map(sourceSections.source_papers.map(x=>[x.source_id,x]));
 const srcSlots=new Map(previous.source_slots.map(x=>[x.source_slot_id,structuredClone(x)]));
 const originalSlots=new Set(),pubItems=new Set(),links=[],siteCorrections=[];
 for(const m of sourceMap.context_mappings){
  const g=groupById.get(m.group_id);
  requireResult(!!g&&m.source_id===g.source_id&&m.published_item_count===g.items.length,"group/source/count mismatch "+m.group_id);
  requireResult(m.source_subitem_links.length===g.items.length,"incomplete children "+m.group_id);
  const paper=paperById.get(g.source_id);
  requireResult(!!paper&&paper.source_pdf_sha256===g.source_pdf_sha256,"wrong PDF sha "+m.group_id);
  const section=paper.sections.find(x=>x.section_code===m.source_section_code);
  requireResult(!!section,"source section not registered "+m.group_id);
  requireResult(m.source_page_pdf_1_based_verified_from_original>=section.source_page_start
   &&m.source_page_pdf_1_based_verified_from_original<=section.source_page_end,"verified source page outside source section "+m.group_id);
  if(g.source_page_pdf_1_based!==m.source_page_pdf_1_based_verified_from_original)
    siteCorrections.push({group_id:g.id,published_page:g.source_page_pdf_1_based,actual_source_page:m.source_page_pdf_1_based_verified_from_original,
      remedy:"SOURCE_EVIDENCE_OVERLAY_NO_MUTATION_OF_P09_FROZEN_QUESTION"});
  const childOrdinals=new Set();
  for(const child of m.source_subitem_links){
   requireResult(Number.isInteger(child.published_subitem_ordinal)&&child.published_subitem_ordinal>0&&child.published_subitem_ordinal<=g.items.length,"child out of range "+g.id);
   requireResult(!childOrdinals.has(child.published_subitem_ordinal),"child mapped twice "+g.id);
   childOrdinals.add(child.published_subitem_ordinal);
   requireResult(Number.isInteger(child.source_part_number)&&child.source_part_number>0
    &&child.source_part_number<=section.part_slot_counts.length,"bad source part "+g.id);
   requireResult(Array.isArray(child.source_part_slot_ordinals)&&child.source_part_slot_ordinals.length>0,
    "source answer slots missing "+g.id);
   const pubId=g.id+"#"+pad(child.published_subitem_ordinal);
   requireResult(!pubItems.has(pubId),"duplicated public item "+pubId);
   pubItems.add(pubId);
   const known=identities.questions.find(x=>x.identity_id===pubId);
   requireResult(known?.source_id===g.source_id&&known.origin_status==="PUBLISHED_RECONSTRUCTED_CONTEXT",
    "P11 published item identity not found "+pubId);
   const candidateSlots=[];
   for(const ordinal of child.source_part_slot_ordinals){
    requireResult(Number.isInteger(ordinal)&&ordinal>0&&ordinal<=section.part_slot_counts[child.source_part_number-1],
      "source part ordinal beyond PDF slot inventory "+pubId);
    const slotId=paper.source_id+"|"+m.source_section_code+"|P"+pad(child.source_part_number)+"|"+pad(ordinal,3);
    const sourceSlot=srcSlots.get(slotId);
    requireResult(!!sourceSlot&&sourceSlot.source_pdf_sha256===paper.source_pdf_sha256,"source slot/sha absent "+slotId);
    requireResult(!originalSlots.has(slotId),"two published items claim the same original source slot "+slotId);
    originalSlots.add(slotId);candidateSlots.push(slotId);
    requireResult(sourceSlot.exact_published_question_id===null,"original TF source slot overlapped "+slotId);
    sourceSlot.admission_status="ANCHOR_LINKED_TO_ADAPTED_PUBLIC_CONTEXT";
    sourceSlot.adapted_published_item_id=pubId;
    sourceSlot.original_pdf_page_verified=m.source_page_pdf_1_based_verified_from_original;
    sourceSlot.source_subitem_anchor_review="PDF_PAGE_SECTION_PART_SLOT_VERIFIED";
    sourceSlot.stem_equivalence_to_original="NOT_ASSERTED_ADAPTED_PARAPHRASED_OR_REDRAWN";
    sourceSlot.manual_review_required=false; // position link verified; answer/source-fidelity reviews are separate
   }
   links.push({published_item_id:pubId,source_id:paper.source_id,
    original_pdf_sha256:paper.source_pdf_sha256,
    original_pdf_page:m.source_page_pdf_1_based_verified_from_original,
    original_source_slot_ids:candidateSlots,source_anchor_verified:true,
    verbatim_question_equality_verified:false,diagram_copy_verified:false,
    original_answer_key_verified:false,source_relationship:m.relation});
  }
  requireResult(childOrdinals.size===g.items.length,"group child coverage incomplete "+g.id);
 }
 requireResult(pubItems.size===76&&originalSlots.size===79,"must link exactly 76 adapted answers to 79 unique source slots");
 requireResult(siteCorrections.length===1&&siteCorrections[0].group_id==="FINAL_G04_CIRCUIT_IMAGES"
 &&siteCorrections[0].actual_source_page===1,"unexpected page discrepancy not adjudicated");
 const score=sourceMap.score_issue;
 requireResult(score.source_id==="G03-S2-MID"&&score.source_section_code==="COMPOSITE"&&score.source_part_number===2
  &&score.printed_question_numbers===20&&score.visible_answer_blanks===22
  &&score.question_blanks.length===20,"original printed-score evidence inconsistent");
 const printNums=new Set(),blankOrdinals=new Set();
 for(const q of score.question_blanks){
  requireResult(!printNums.has(q.printed_question_number)&&q.printed_question_number>=1
   &&q.printed_question_number<=20,"duplicate/invalid printed question number");
  printNums.add(q.printed_question_number);
  for(const i of q.source_part_slot_ordinals){
   requireResult(i>0&&i<=22&&!blankOrdinals.has(i),"duplicate/invalid source blank");
   blankOrdinals.add(i);
   const id="G03-S2-MID|COMPOSITE|P02|"+pad(i,3);
   const slot=srcSlots.get(id);
   requireResult(!!slot,"missing composite water-state blank "+id);
   slot.printed_scoring_question_number=q.printed_question_number;
   slot.original_blanks_per_printed_question=q.source_part_slot_ordinals.length;
  }
 }
 requireResult(printNums.size===20&&blankOrdinals.size===22
  &&score.question_blanks[0].source_part_slot_ordinals.length===2
  &&score.question_blanks[1].source_part_slot_ordinals.length===2,
  "printed 20 one-point questions vs 22 answer blanks not proven");
 let countExact=0,countLinked=0,countCandidate=0;
 for(const s of srcSlots.values()){
  if(s.admission_status==="ADMITTED_PUBLIC_EXACT_TF")countExact++;
  else if(s.admission_status==="ANCHOR_LINKED_TO_ADAPTED_PUBLIC_CONTEXT")countLinked++;
  else {s.admission_status="INVENTORIED_PENDING_INDIVIDUAL_QUESTION_REVIEW";countCandidate++;}
 }
 requireResult(countExact===72&&countLinked===79&&countCandidate===326&&srcSlots.size===477,
 "reconciled source slot partition failed");
 const originalHash=hash(readFileSync(resolve(root,mapPath)));
 const perPaper=[];
 for(const p of sourceSections.source_papers){
  const rows=[...srcSlots.values()].filter(x=>x.source_id===p.source_id);
  perPaper.push({source_id:p.source_id,source_pdf_sha256:p.source_pdf_sha256,
   original_source_answer_positions:rows.length,
   published_original_TF:rows.filter(x=>x.admission_status==="ADMITTED_PUBLIC_EXACT_TF").length,
   source_positions_linked_to_adapted_context:rows.filter(x=>x.admission_status==="ANCHOR_LINKED_TO_ADAPTED_PUBLIC_CONTEXT").length,
   remaining_candidate_positions:rows.filter(x=>x.admission_status==="INVENTORIED_PENDING_INDIVIDUAL_QUESTION_REVIEW").length});
 }
 return {
  schema_version:"SCIENCE_EXAM_P11R1_SOURCE_SLOT_RECONCILIATION_V1",
  source_evidence_manifest_sha256:originalHash,
  no_change_to_public_question_bank:true,baseline_public_answer_slots:148,
  original_source_papers:8,original_source_answer_positions:477,
  baseline_original_TF_source_links:72,
  adapted_published_subitems_with_verified_original_source_anchors:76,
  original_source_answer_positions_linked_to_76_adapted_subitems:79,
  original_source_answer_positions_remaining_for_candidate_review:326,
  gross_source_slot_links_accounting:"72 + 79 + 326 = 477",
  page_metadata_corrections:siteCorrections,
  water_state_printed_scoring_reconciliation:{
   source_id:"G03-S2-MID",section:"COMPOSITE",part:2,page:2,
   score_question_count:20,actual_blanks:22,
   first_two_questions_each_have_two_blanks:true,
   printable_scoring_total_points:20,
   discrepancy_status:"EXPLAINED_BY_PRINTED_QUESTION_VERSUS_ANSWER_BLANK_DISTINCTION",
   partial_credit_rule:"NOT_ESTABLISHED_FROM_SOURCE_PDF",
   source_printed_number_to_blanks:score.question_blanks
  },
  review_completeness:{
    original_source_slot_inventory_accounted_for:477,
    adapted_context_source_anchor_position_reconciliation_complete:true,
    unchanged_preexisting_original_TF_source_identity_pass:true,
    per_remaining_326_questions_answer_and_KP_certification_completed:false,
    verbatim_identity_for_adapted_passages_or_redrawn_diagrams:false
  },
  admission_gate:{
   controlled_p12_candidate_screening_enabled:true,
   direct_bulk_publication_without_individual_answer_KP_visual_gates_enabled:false,
   reason:"All source slots have a unique registered locator; 76 published adaptations linked to 79 original positions; score-versus-blank tally explained; remaining 326 are explicitly pending individual screening."
  },
  per_source_summary:perPaper,published_adapted_source_links:links,
  reconciled_source_slots:[...srcSlots.values()]
 };
}
export function materializeP11R1({check=false}={}){
 const result=reconcileP11R1();const dst=resolve(root,path);
 const bytes=JSON.stringify(result,null,2)+"\n";
 if(check){requireResult(existsSync(dst),"R1 ledger not generated");
  requireResult(readFileSync(dst,"utf8")===bytes,"R1 ledger stale or source map changed");}
 else writeFileSync(dst,bytes);
 return {sources:8,original:477,tf:72,adaptedPublished:76,adaptedSourceSlots:79,pendingCandidates:326,
  scorePrinted:20,scoreBlanks:22,p12ScreeningAllowed:true};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log("P11R1_EXACT_SLOT_RECONCILIATION_PASS",JSON.stringify(materializeP11R1({check:process.argv.includes("--check")})));
}
