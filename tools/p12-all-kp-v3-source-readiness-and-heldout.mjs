import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { buildAllKpSourceIndex, readRepoJSON } from "./p12-all-kp-source-mapping.mjs";
import { buildG04S2V2 } from "./p12-g04s2-v2-exact-source-routing.mjs";

export const PDF_LEDGER="data/review/p12-all-kp-v3-114-pdf-binary-and-text-access-ledger-v1.json";
export const HELDOUT="data/review/p12-all-kp-v3-g04s2-frozen-unseen-source-exact-benchmark-v1.json";
export const PREVIOUS_V1_AUDIT="data/review/p12-g04s2-114-cross-scope-semantic-pilot-audit-v1.json";
export const PREVIOUS_V2_AUDIT="data/review/p12-g04s2-v2-exact-source-kp-intent-challenge-v1.json";
export const OUT="data/index/p12-all-kp-v3-fullsource-readiness-and-frozen-benchmark-v1.json";
const id=(s,k)=>JSON.stringify([s,k]);
const digest=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
function verifiedLedger(index, ledger) {
 if(ledger.source_papers!==25 || ledger.originals?.length!==25)throw Error("Not all 25 original PDFs accounted for");
 const byPaper=new Map(index.original_source_items.map(x=>[x.original_paper_id,x]));
 const seen=new Set();
 const stats={available:0,missing:0,readable:0,image_only:0,pages:0};
 const docById=new Map();
 for (const pdf of ledger.originals){
   const key=pdf.source_candidate_id,src=byPaper.get(key);
   if(seen.has(key)||!src)throw Error("PDF outside frozen 25 paper list or duplicate "+key);
   seen.add(key);
   if(pdf.pdf_local_access==="BINARY_AVAILABLE"){
     stats.available++;stats.pages+=pdf.page_count;
     if(!/^[a-f0-9]{64}$/.test(pdf.original_pdf_sha256_or_null)||pdf.page_count<1)throw Error("Missing binary original SHA/page "+key);
     if(src.original_pdf_sha256&&src.original_pdf_sha256!==pdf.original_pdf_sha256_or_null)
       throw Error("Local original PDF disagrees with source SHA: "+key);
     if(pdf.extracted_text_characters>0)stats.readable++;
     else stats.image_only++;
   }else{
     stats.missing++;
     if(pdf.original_pdf_sha256_or_null!==null||pdf.page_count!==0)throw Error("Missing PDF claims binary evidence "+key);
   }
   docById.set(key,pdf);
 }
 if(stats.available!==22||stats.missing!==3||stats.readable!==18||stats.image_only!==4||stats.pages!==54)
   throw Error("Original PDF availability denominators drift "+JSON.stringify(stats));
 return {stats,docById};
}
export function buildV3FullSourceBlindBenchmark({
  index=buildAllKpSourceIndex(),v2=buildG04S2V2({index}),
  pdfLedger=readRepoJSON(PDF_LEDGER),heldout=readRepoJSON(HELDOUT),
  priorV1=readRepoJSON(PREVIOUS_V1_AUDIT),priorV2=readRepoJSON(PREVIOUS_V2_AUDIT)}={}) {
 if(index.original_source_items.length!==1623||index.scope.source_papers!==25||v2.kp_target_denominator!==46)
  throw Error("Expected frozen V1/V2 source and KP denominators");
 const {stats,docById}=verifiedLedger(index,pdfLedger);
 const bySource=new Map(index.original_source_items.map(x=>[x.source_id,x]));
 const byKp=new Map(index.authority_kps.map(x=>[x.kp_id,x]));
 const alreadyUsed=new Set([...(priorV1.cases??[]),...(priorV2.items??[])].map(x=>id(x.source_id,x.kp_id)));
 const preds=new Set(v2.candidate_edges.map(x=>id(x.source_id,x.kp_id)));
 const sourceRecords=index.original_source_items.map(x=>{
   const pdf=docById.get(x.original_paper_id);
   let stage;
   if(pdf.pdf_local_access!=="BINARY_AVAILABLE")stage="PDF_UNAVAILABLE";
   else if(pdf.extracted_text_characters===0)stage="IMAGE_ONLY_PDF_NEEDS_VISUAL_OR_CONTROLLED_OCR";
   else stage="PAGE_TEXT_AVAILABLE__FULL_QUESTION_AND_PARENT_LINK_NOT_BOUND";
   return {source_id:x.source_id,source_version_sha256:x.source_version_sha256,
     source_paper_id:x.original_paper_id,source_paper_map_ref:x.original_paper_source_map_ref,
     source_item_map_ref:x.original_source_item_file_ref,original_pdf_sha256_or_null:pdf.original_pdf_sha256_or_null,
     source_pdf_evidence_stage:stage,source_firstpass_summary_available:typeof x.source_excerpt==="string"&&x.source_excerpt.trim().length>0,
     extracted_full_stem:null,extracted_full_options:null,shared_reading_text:null,
     figure_region_coordinates:null,source_id_to_exact_answer_box_geometry:null,original_question_geometry_verified:false,
     original_full_stem_and_options_verified:false,source_group_parent_id_verified:false,
     independent_science_verdict:x.model_independent_science_verdict,
     public_release_approved:false};
 });
 const recordStages={};for(const r of sourceRecords)recordStages[r.source_pdf_evidence_stage]=(recordStages[r.source_pdf_evidence_stage]??0)+1;
 const distinct=new Set(),records=[];
 if(!Array.isArray(heldout.originals)||heldout.originals.length!==40||heldout.selection.indexOf("NOT_IN_V1_45_PAIRS_OR_V2_23_PAIRS")<0)
  throw Error("Unexpected heldout definition or count");
 for(const row of heldout.originals){
   const k=id(row.source_id,row.kp_id),src=bySource.get(row.source_id),kp=byKp.get(row.kp_id);
   if(distinct.has(k)||alreadyUsed.has(k)||!src||!kp||kp.grade!==4||kp.semester!==2)
     throw Error("Nonheld-out / duplicate / unknown source-KP pair "+k);
   distinct.add(k);
   if(!["PRIMARY_PLAUSIBLE","SECONDARY_PLAUSIBLE","NOT_MATCH","SOURCE_EVIDENCE_HOLD"].includes(row.adjudication))
    throw Error("Unrecognized blinded source adjudication "+k);
   if(typeof row.source_text_level_rationale!=="string"||row.source_text_level_rationale.length<10||!row.short_source_anchor)
    throw Error("Missing source-evidence anchor/reason "+k);
   const pdf=docById.get(src.original_paper_id);
   if(pdf.pdf_local_access!=="BINARY_AVAILABLE"||row.original_pdf_page<1||row.original_pdf_page>pdf.page_count)
    throw Error("Heldout PDF not available or page outside original "+k);
   records.push({source_id:row.source_id,kp_id:row.kp_id,unit_id:kp.unit_id,
     heldout_label:row.adjudication,source_evidence_kind:row.source_evidence_kind,
     source_short_anchor:row.short_source_anchor,
     source_original_pdf_sha256:pdf.original_pdf_sha256_or_null,
     source_original_pdf_page:row.original_pdf_page,
     source_firstpass_summary:src.source_excerpt,
     source_semantic_label_rationale:row.source_text_level_rationale,
     frozen_v2_retrieved:preds.has(k),
     full_original_stem_options_figure_bound:false,
     label_not_used_to_tune_v2:true,external_blind_adjudication_certified:false,
     formal_kp_verified:false,public_release_approved:false});
 }
 const positives=records.filter(x=>["PRIMARY_PLAUSIBLE","SECONDARY_PLAUSIBLE"].includes(x.heldout_label));
 const negatives=records.filter(x=>x.heldout_label==="NOT_MATCH");
 const holds=records.filter(x=>x.heldout_label==="SOURCE_EVIDENCE_HOLD");
 const byUnit=["U01","U02","U03","U04"].map(u=>{
   const x=records.filter(y=>y.unit_id===u);
   const p=x.filter(y=>["PRIMARY_PLAUSIBLE","SECONDARY_PLAUSIBLE"].includes(y.heldout_label));
   const n=x.filter(y=>y.heldout_label==="NOT_MATCH");
   return {unit:u,sampled_pairs:x.length,positive_and_secondary_labels:p.length,
     missed_labeled_positive:p.filter(y=>!y.frozen_v2_retrieved).length,
     hard_negative_labels:n.length,false_positive_hits:n.filter(y=>y.frozen_v2_retrieved).length,
     ambiguous_or_figure_holds:x.filter(y=>y.heldout_label==="SOURCE_EVIDENCE_HOLD").length,
     no_positive_sample_cannot_test_recall:p.length===0};
 });
 return {schema_version:"P12_ALL_KP_G04S2_V3_FULLSOURCE_READINESS_AND_FROZEN_HELDOUT_BENCHMARK_V1",
   mode:"FROZEN_V2_PREDICTIONS_EVALUATED_AGAINST_PREANNOTATED_UNSEEN_SOURCE_EXACT_CHALLENGE__NO_ROUTING_RULE_TUNING",
   source_authority_ref:index.source_corpus_ref,kp_authority_ref:index.authoritative_kp_ref,
   original_pdf_ledger_ref:PDF_LEDGER,heldout_review_ref:HELDOUT,
   heldout_sha256:digest(heldout.originals),
   pdf_evidence:{...stats,expected_original_papers:25,available_paper_text_extractable:18,
     source_position_evidence_stages:recordStages,
     source_response_positions_total:1623,
     full_stem_options_and_shared_diagram_bound_positions:0,
     original_pdf_binary_availability_not_equivalent_to_full_question_materialization:true},
   test:{label_source:"MODEL_REVIEW_OF_SHORT_ORIGINAL_PDF_ANCHORS__NOT_INDEPENDENT_HUMAN_ADJUDICATION",
     is_random_probability_sample:false,used_for_frozen_v2_rule_tuning:false,
     population_accuracy_guarantee:false,benchmark_pairs:records.length,
     primary_or_secondary_plausible:positives.length,
     positive_retrieved:positives.filter(x=>x.frozen_v2_retrieved).length,
     positive_missed:positives.filter(x=>!x.frozen_v2_retrieved).length,
     nonmatching_pairs:negatives.length,
     false_positive_hits:negatives.filter(x=>x.frozen_v2_retrieved).length,
     correctly_excluded_negatives:negatives.filter(x=>!x.frozen_v2_retrieved).length,
     unavailable_or_ambiguous_evidence_holds:holds.length,
     sample_sensitivity_observed_only:positives.length?positives.filter(x=>x.frozen_v2_retrieved).length/positives.length:null,
     sample_negative_specificity_observed_only:negatives.length?negatives.filter(x=>!x.frozen_v2_retrieved).length/negatives.length:null,
     per_unit:byUnit},
   original_source_evidence_schema_example:sourceRecords.find(x=>x.source_pdf_evidence_stage==="PAGE_TEXT_AVAILABLE__FULL_QUESTION_AND_PARENT_LINK_NOT_BOUND"),
   all_source_evidence_records:sourceRecords,
   heldout_cases_with_frozen_predictions:records,
   next_gate_requirements:["Obtain 3 missing original PDFs and verify binary SHA",
     "Manual visual source review for four image-only original PDFs (OCR only where unavoidable)",
     "Bind original full stems, all options, shared reading/diagram stimulus and answer-slot geometry to immutable source IDs",
     "Measure stem-option-group evidence completeness before computing an honest full-KP recall denominator",
     "Create independently adjudicated randomized and stratified untouched source-exact benchmark (not this curated model set)",
     "Require per-unit thresholds and operator KP approval before 187-KP expansion"],
   KP_mapping_full_187_expansion_authorized:false,
   full_46_kp_semantic_certification_complete:false,
   source_pdf_artwork_copyright_clearance:false,
   public_new_admissions:0,public_question_positions_unchanged:251,public_g04s1_positions_unchanged:53};
}
const entry=process.argv[1]?resolve(process.argv[1]):"";
if(entry===fileURLToPath(import.meta.url)){
 const out=buildV3FullSourceBlindBenchmark(),serialized=JSON.stringify(out,null,2)+"\n",op=process.argv[2]??"--summary";
 if(op==="--write"){mkdirSync(dirname(resolve(OUT)),{recursive:true});writeFileSync(resolve(OUT),serialized);}
 else if(op==="--check"){if(!existsSync(resolve(OUT))||readFileSync(resolve(OUT),"utf8")!==serialized)throw Error("V3 materialized index readback mismatch");}
 else if(op!=="--summary")throw Error("Use --summary, --write or --check");
 console.log(JSON.stringify({mode:op,pdf:out.pdf_evidence,test:out.test,
    full_source_complete:out.full_46_kp_semantic_certification_complete,
    full_187_expansion_ready:out.KP_mapping_full_187_expansion_authorized,public_new:0},null,2));
}
