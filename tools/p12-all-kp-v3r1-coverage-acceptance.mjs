import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllKpSourceIndex,readRepoJSON } from "./p12-all-kp-source-mapping.mjs";

export const COVERAGE_MANIFEST="data/review/p12-all-kp-v3r1-114-all25-source-slot-evidence-coverage-v1.json";
const SHA=/^[a-f0-9]{64}$/;
export const APPROVED_STATUSES=new Set([
  "STEM_OPTIONS_LOCATED_PENDING_VISUAL_REVIEW",
  "PARTIAL_STEM_LOCATED_REQUIRES_SOURCE_REVIEW",
  "PARENT_GROUP_LOCATED_CHILD_UNBOUND",
  "TEXT_LAYER_SLOT_UNBOUND",
  "AMBIGUOUS_NUMBER_OR_SECTION",
  "IMAGE_ONLY_PENDING_VISUAL"
]);
const sum=xs=>xs.reduce((x,y)=>x+y,0);
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const invariant=(ok,msg)=>{if(!ok)throw new Error("P12 V3R1 coverage gate: "+msg);};
export function verifyPublicV3R1Coverage(index=buildAllKpSourceIndex(),manifest=readRepoJSON(COVERAGE_MANIFEST)){
 const rows=index.original_source_items;
 const byPaper=new Map();
 for(const item of rows)byPaper.set(item.original_paper_id,(byPaper.get(item.original_paper_id)??0)+1);
 invariant(rows.length===1623 && byPaper.size===25,"source baseline changed");
 invariant(manifest.schema_version==="P12_ALL_KP_V3R1_114_ALL25_SOURCE_SLOT_EVIDENCE_COVERAGE_V1","unexpected schema");
 invariant(manifest.original_paper_count===25 && manifest.source_answer_position_count===1623,"original denominator drift");
 invariant(manifest.original_pdf_binary_sha_verified_count_from_private_runtime===25,"25 original PDF hashes not backed by local evidence");
 invariant(manifest.original_pdf_missing_count_after_recovery===0 && manifest.source_positions_missing_original_after_recovery===0,"stale missing original count");
 invariant(manifest.original_pdf_text_layer_count+manifest.original_pdf_image_only_count===25,"modality paper denominator mismatch");
 invariant(manifest.source_positions_with_text_layer+manifest.source_positions_image_only===1623,"source modality denominator mismatch");
 invariant(manifest.original_pdf_text_layer_count===21&&manifest.source_positions_with_text_layer===1380,"text source state discrepancy");
 invariant(manifest.original_pdf_image_only_count===4&&manifest.source_positions_image_only===243,"raster original state discrepancy");
 const recovered=manifest.recovered_since_v3_papers??[];
 invariant(recovered.length===3 && new Set(recovered.map(x=>x.id)).size===3,"original recoveries missing/duplicate");
 for(const file of recovered){
   invariant(byPaper.get(file.id)===file.source_response_positions,"recovered source positions do not match frozen original "+file.id);
   invariant(SHA.test(file.raw_pdf_sha256)&&file.drive_file_id?.length>12,"original recovered PDF hash or drive provenance invalid");
 }
 invariant(sum(recovered.map(x=>x.source_response_positions))===254,"recovered 254 source positions mismatch");
 const raster=manifest.image_only_papers??[];
 invariant(raster.length===4 && new Set(raster.map(x=>x.id)).size===4,"image-only PDFs incomplete");
 for(const file of raster)invariant(byPaper.get(file.id)===file.positions,"image-only source slot count mismatch "+file.id);
 invariant(sum(raster.map(x=>x.positions))===243,"four original image-only sources incorrect");
 const statuses=manifest.source_slot_binding_status_counts;
 invariant(Object.keys(statuses).every(k=>APPROVED_STATUSES.has(k)) && Object.keys(statuses).length===APPROVED_STATUSES.size,"invalid source stages");
 invariant(Object.values(statuses).every(x=>Number.isSafeInteger(x)&&x>=0),"invalid count");
 invariant(sum(Object.values(statuses))===1623,"source evidence partition not 1623");
 invariant(statuses.IMAGE_ONLY_PENDING_VISUAL===243,"scanned source allocation invalid");
 invariant(sum(Object.entries(statuses).filter(([k])=>k!=="IMAGE_ONLY_PENDING_VISUAL").map(([,v])=>v))===1380,"text evidence allocation invalid");
 invariant(statuses.STEM_OPTIONS_LOCATED_PENDING_VISUAL_REVIEW+statuses.PARTIAL_STEM_LOCATED_REQUIRES_SOURCE_REVIEW===manifest.printed_question_number_source_locator_candidate_count,"direct printed number bind discrepancy");
 invariant(manifest.parent_group_text_candidate_count===statuses.PARENT_GROUP_LOCATED_CHILD_UNBOUND,"shared group candidate discrepancy");
 invariant(manifest.strict_full_source_question_stem_all_options_parent_diagram_and_answer_box_verified===0,"unapproved full question source admission");
 invariant(manifest.original_answer_box_coordinates_verified===0,"fabricated source-to-answer box binding");
 invariant(manifest.primary_or_secondary_kp_formally_verified_by_v3r1===0,"fabricated formal KP match");
 invariant(manifest.original_teacher_key_authenticated_by_v3r1===0,"fabricated teacher key");
 invariant(manifest.learner_repainted_images_rights_cleared_by_v3r1===false,"false rights approval");
 invariant(manifest.no_source_question_text_or_artwork_committed===true,"copyrighted source text published");
 invariant(manifest.new_public_question_admissions===0,"public source bank changed");
 invariant(manifest.public_total_source_answer_positions_unchanged===251&&manifest.public_g04s1_answer_positions_unchanged===53,"previous public paper bank changed");
 invariant(manifest.original_114_all25_science_screen_before_public_admission_policy_preserved===true,"frozen operator admission policy changed");
 invariant(SHA.test(manifest.private_artifact_sha256),"private evidence ZIP digest absent");
 return {papers:25,slots:1623,recovered_papers:3,recovered_source_slots:254,
   text_slots:1380,image_only_slots:243,direct_locus_candidates:manifest.printed_question_number_source_locator_candidate_count,
   parent_group_candidates:manifest.parent_group_text_candidate_count,
   full_stem_options_figure_and_answer_box_certified:0,new_public_admissions:0};
}
/**
 * Run additionally with a locally unzipped PRIVATE binder, never in public CI.
 * Checks one-to-one SOURCE_ID lineage, statuses and SHA provenance. It intentionally
 * never exports the copyrighted source stems, options, shared text or pictures.
 */
export function verifyPrivateV3R1Binding(privateDoc,index=buildAllKpSourceIndex(),manifest=readRepoJSON(COVERAGE_MANIFEST)){
 const rows=privateDoc?.source_slot_bindings??[];
 const byId=new Map(index.original_source_items.map(x=>[x.source_id,x]));
 invariant(rows.length===1623&&new Set(rows.map(r=>r.source_id)).size===1623,"private source positions not 1623 unique frozen IDs");
 const counts=Object.fromEntries([...APPROVED_STATUSES].map(s=>[s,0]));
 const recovered=new Map(manifest.recovered_since_v3_papers.map(x=>[x.id,x.raw_pdf_sha256]));
 for(const row of rows){
   const old=byId.get(row.source_id);
   invariant(!!old,"unrecognized private original source ID "+row.source_id);
   invariant(row.source_version_sha256===old.source_version_sha256,"original source version drift "+row.source_id);
   invariant(row.public_release_approved===false&&row.teacher_key_verified===false&&row.kp_mapping_formally_verified===false,"unapproved source/KP/user admission");
   invariant(APPROVED_STATUSES.has(row.binding_status),"unapproved/unknown private source status");
   counts[row.binding_status]++;
   const sha=recovered.get(row.paper_id)??old.original_pdf_sha256;
   invariant(row.original_pdf_sha256===sha,"private original PDF SHA provenance differs "+row.source_id);
   if(row.binding_status==="IMAGE_ONLY_PENDING_VISUAL"||row.binding_status==="TEXT_LAYER_SLOT_UNBOUND"||row.binding_status==="AMBIGUOUS_NUMBER_OR_SECTION"){
      invariant(row.full_original_stem==null,"unreliable question falsely assigned a full original stem "+row.source_id);
   }
 }
 invariant(same(counts,manifest.source_slot_binding_status_counts),"private per-source status partition drift");
 return {private_exact_ids:1623,private_original_paper_count:new Set(rows.map(x=>x.paper_id)).size,reported_coverage:counts,public_admission:0};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=verifyPublicV3R1Coverage();
 if(process.argv[2]==="--verify-private"){
   const privatePath=process.argv[3];
   invariant(Boolean(privatePath),"usage: node tools/p12-all-kp-v3r1-coverage-acceptance.mjs --verify-private path/to/P12_V3R1_private_source_slot_stem_option_binding.json");
   console.log(JSON.stringify({public:report,private:verifyPrivateV3R1Binding(JSON.parse(readFileSync(privatePath,"utf8")))},null,2));
 }else if(!process.argv[2]||process.argv[2]==="--check")console.log(JSON.stringify(report,null,2));
 else throw new Error("Unknown operation");
}