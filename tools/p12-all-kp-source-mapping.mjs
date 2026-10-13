import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

export const SOURCE_V17 = "data/review/p12-g04s1-114-all25-kp-first-progress-v17.json";
export const AUTHORITY_V2 = "site/data/authority/science-g03-g04-selector-v2.json";
export const PROJECTION_RULES = "data/governance/p12-all-kp-source-projection-authority-v1.json";
export const OVERLAY_V1 = "data/review/p12-all-kp-114-semester-cross-candidate-overlay-v1.json";
export const OUTPUT_V1 = "data/index/p12-all-kp-114-source-index-v1.json";
const ALLOWED_DECISIONS = new Set(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"]);
const fields = (row, names) => { for (const n of names) if (row[n] !== undefined && row[n] !== null) return row[n]; return null; };
const digest = v => createHash("sha256").update(JSON.stringify(v)).digest("hex");
export const readRepoJSON = (path, root=process.cwd()) => JSON.parse(readFileSync(resolve(root,path),"utf8"));
function normalizeSourceRow(row, paper, file) {
  const source_id = fields(row,["source_slot_id","source_position_id"]);
  if (typeof source_id !== "string" || !source_id.startsWith(paper.source_candidate_id+"|"))
    throw new Error("Unrecognized or wrong-paper source ID: "+JSON.stringify(source_id)+" at "+file);
  const firstpass = row.kp_first_decision;
  if (firstpass==="SCORE_POINT_GAP_NOT_A_CERTIFIED_SOURCE_POSITION") return null;
  if (!ALLOWED_DECISIONS.has(firstpass)) throw new Error("Unknown firstpass status "+firstpass+" on "+source_id);
  const legacy_kp_ids = fields(row,["matched_canonical_kp_ids","canonical_kp_ids","kp_ids"]) ?? [];
  if (!Array.isArray(legacy_kp_ids)) throw new Error("Non-array KP IDs on "+source_id);
  const source_excerpt = fields(row,["source_text_summary","source_summary","source_description","original_summary"]) ?? null;
  const raw_sha = fields(row,["source_pdf_sha256","original_pdf_sha256","source_original_pdf_sha256","original_pdf_binary_sha256","source_sha256"]);
  const source_page = fields(row,["source_original_pdf_page","original_pdf_page","source_original_page","source_pdf_page","source_page","original_source_pdf_page","source_visual_page"]);
  const figure = fields(row,["original_figure_required","source_image_required","source_figure_required","original_diagram_required","source_diagram_required","source_figure_needed","source_picture_required","source_image_required_for_answer","original_image_required_for_answer","original_figure_needed","original_image_required"]);
  const item = {
    source_id, original_paper_id:paper.source_candidate_id,
    original_paper_title:paper.source_title,
    original_exam_type:paper.original_exam_type,
    original_academic_year:114,
    original_paper_source_map_ref:paper.original_source_position_text_map_ref,
    original_source_item_file_ref:file,
    original_pdf_sha256:paper.source_pdf_sha256 ?? raw_sha ?? null,
    original_binary_sha_verified:paper.original_pdf_binary_sha_verified===true,
    original_source_page:source_page,
    original_figure_required:figure===null?null:!!figure,
    source_excerpt,
    excerpt_source:"EXISTING_FIRSTPASS_SUMMARY_NOT_COMPLETE_SOURCE_QUESTION",
    current_g04s1_firstpass_status:firstpass,
    current_g04s1_kp_ids:[...new Set(legacy_kp_ids)].sort(),
    science_certified:false,
    teacher_answer_key_authenticated:false,
    public_release_approved:false
  };
  item.source_version_sha256=digest([
    item.source_id,item.original_pdf_sha256,item.source_excerpt,item.current_g04s1_firstpass_status,item.current_g04s1_kp_ids,item.original_source_page,item.original_figure_required
  ]);
  return item;
}
function rowsFromPaper(paper, root) {
  const path=paper.original_source_position_text_map_ref;
  if (!path) throw new Error("No map ref for "+paper.source_candidate_id);
  const doc=readRepoJSON(path,root);
  if(doc.source_candidate_id!==paper.source_candidate_id)throw new Error("Source manifest mismatch "+path);
  const data=[...(doc.items??[]),...(doc.first_16_items??[])].map(row=>({row,file:path}));
  const refs=[...(doc.first_16_tf_mc_file?[doc.first_16_tf_mc_file]:[]),
     ...(doc.remaining_group_files??[]),...(doc.source_records_parts??[]),...(doc.source_parts??[])];
  for (const file of refs) {
    const part=readRepoJSON(file,root);
    if (part.source_candidate_id!==paper.source_candidate_id)throw new Error("Source split fragment mismatch "+file);
    const rows=[...(part.items??[]),...(part.first_16_items??[])];
    if(rows.length===0)throw new Error("Empty split source part "+file);
    data.push(...rows.map(row=>({row,file})));
  }
  return data.map(({row,file})=>normalizeSourceRow(row,paper,file)).filter(Boolean);
}
function currentAuthorityUnits(authority) {
  if (!Array.isArray(authority.units)) throw new Error("KP Authority has no units");
  const out=[];
  for(const unit of authority.units)for(const k of unit.knowledge_points??[]) {
    const id=k.canonical_kp_id;
    if (typeof id!=="string"||!id)throw new Error("KP without canonical ID");
    const u={kp_id:id,grade:unit.grade,semester:unit.semester,unit_id:unit.unit_id,
       unit_name:unit.unit_title,kp_title:k.title,kp_description:k.description??null};
    u.authority_content_sha256=digest(u);
    out.push(u);
  }
  out.sort((a,b)=>a.kp_id.localeCompare(b.kp_id));
  if(new Set(out.map(x=>x.kp_id)).size!==out.length)throw new Error("Duplicate canonical KP ID");
  return out;
}
function edgeId(source_id,kp_id,kind) {return digest([source_id,kp_id,kind]).slice(0,32);}
function readOverlay(root) {
  const overlay=readRepoJSON(OVERLAY_V1,root);
  if(!Array.isArray(overlay.edges))throw new Error("Overlay edges must be an array");
  return overlay;
}
/**
 * Evidence-index construction only. The graph stores historical G04-S1
 * provisional edges and explicitly sourced cross-semester proposals. No NLP
 * guess is silently marked verified; absence does NOT mean curriculum MISSING.
 */
export function buildAllKpSourceIndex({root=process.cwd(),authority=readRepoJSON(AUTHORITY_V2,root),
  baseline=readRepoJSON(SOURCE_V17,root), overlay=readOverlay(root)}={}) {
  const kp= currentAuthorityUnits(authority);
  const kpById=new Map(kp.map(x=>[x.kp_id,x]));
  const source=baseline.source_papers.flatMap(p=>rowsFromPaper(p,root)).sort((a,b)=>a.source_id.localeCompare(b.source_id));
  const sourceById=new Map(source.map(x=>[x.source_id,x]));
  if(sourceById.size!==source.length)throw new Error("Duplicate source IDs in original paper fragments");
  if(source.length!==baseline.all_identified_source_answer_positions_count)throw new Error("Original 114 source count discrepancy: "+source.length+" != "+baseline.all_identified_source_answer_positions_count);
  if(source.length!==1623 || baseline.source_papers.length!==25)throw new Error("114 frozen full25 source denominator changed: "+source.length);
  const stats=Object.fromEntries([...ALLOWED_DECISIONS].map(k=>[k,0]));
  for(const q of source)stats[q.current_g04s1_firstpass_status]++;
  if(JSON.stringify(stats)!==JSON.stringify(Object.fromEntries([...ALLOWED_DECISIONS].map(k=>[k,baseline.source_text_position_kp_decisions[k]]))))
    throw new Error("Original firstpass decision parity "+JSON.stringify(stats));
  const edges=[];
  for(const item of source)for(const kp_id of item.current_g04s1_kp_ids){
    if(!kpById.has(kp_id))throw new Error("Legacy source maps unknown KP "+kp_id);
    if(!kp_id.startsWith("sci_g04s1_"))throw new Error("Historic G04-S1-only source mapped to non-G04-S1 KP: "+kp_id);
    edges.push({edge_id:edgeId(item.source_id,kp_id,"LEGACY_FIRSTPASS"),source_id:item.source_id,
      kp_id,source_version_sha256:item.source_version_sha256,kp_version_sha256:kpById.get(kp_id).authority_content_sha256,
      projection:"LEGACY_FIRSTPASS",decision:item.current_g04s1_firstpass_status,
      verification:"NOT_VERIFIED_FOR_ADMISSION",evidence_ref:item.original_source_item_file_ref,
      public_release_approved:false});
  }
  for(const row of overlay.edges){
    if(!sourceById.has(row.source_id))throw new Error("Cross-semester overlay unknown source "+row.source_id);
    if(!kpById.has(row.kp_id))throw new Error("Overlay unknown KP "+row.kp_id);
    if(row.status!=="CANDIDATE_REQUIRES_SOURCE_AND_KP_REVIEW")throw new Error("Overlay cannot assert KP verification: "+row.source_id);
    if(typeof row.rationale!=="string" || row.rationale.length<8 || !row.evidence_ref)throw new Error("Overlay missing traceable reason/evidence");
    const item=sourceById.get(row.source_id);
    if(item.current_g04s1_kp_ids.includes(row.kp_id))throw new Error("Overlay duplicates legacy KP edge");
    edges.push({edge_id:edgeId(row.source_id,row.kp_id,"MANUAL_CROSS_SCOPE_PROPOSAL"),
      source_id:row.source_id,kp_id:row.kp_id,source_version_sha256:item.source_version_sha256,
      kp_version_sha256:kpById.get(row.kp_id).authority_content_sha256,
      projection:"MANUAL_CROSS_SCOPE_PROPOSAL",decision:row.status,
      verification:"NOT_VERIFIED_FOR_ADMISSION",evidence_ref:row.evidence_ref,
      rationale:row.rationale,public_release_approved:false});
  }
  edges.sort((a,b)=>a.edge_id.localeCompare(b.edge_id));
  if(new Set(edges.map(e=>e.edge_id)).size!==edges.length)throw new Error("Duplicate KP graph edges");
  const coverage=kp.map(k=>{
    const related=edges.filter(e=>e.kp_id===k.kp_id);
    const ids=[...new Set(related.map(e=>e.source_id))].sort();
    return {kp_id:k.kp_id,indexed_firstpass_or_projection_candidate_source_count:ids.length,
      known_source_ids:ids,verified_source_count:0,exhaustive_full_corpus_review_complete:false,
      coverage_status:ids.length?"PROVISIONAL_CANDIDATES_EXIST_NOT_CERTIFIED":"NOT_YET_MAPPED_NOT_EVIDENCE_OF_MISSING",
      original_question_bank_publicly_admitted_from_this_index:0};
  });
  const target_count=source.length*kp.length;
  return {schema_version:"P12_ALL_KP_SOURCE_QUESTION_INDEX_V1",index_role:"INTERNAL_SOURCE_TO_KP_LOOKUP_NOT_PUBLIC_QUESTION_BANK",
   source_corpus_ref:SOURCE_V17,authoritative_kp_ref:AUTHORITY_V2,operator_policy_ref:PROJECTION_RULES,
   operator_114_public_admission_gate_ref:"data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json",
   projection_overlay_ref:OVERLAY_V1,
   scope:{source_papers:baseline.source_papers.length,source_answer_positions:source.length,authoritative_kps:kp.length,
     possible_source_to_kp_review_pairs:target_count,
     existing_firstpass_scope:"G04-S1 45 KP ONLY",
     all_authority_kps_indexed_for_reverse_lookup:true,
     cross_grade_semester_matching_completed:false,
     full_187_kp_exhaustive_semantic_review_completed:false,
     future_kps_supported_by_authority_extension_and_remap:true},
   firstpass_114_decision_counts:stats,authority_kps:kp,
   original_source_items:source,mapping_edges:edges,by_kp:coverage,
   public_admission_lock:{no_source_items_publicly_added:true,teacher_keys_unverified:true,
     source_artwork_not_republished:true,live_public_question_positions:251,live_g04s1_positions:53}};
}
/** Only compare fingerprints: changed authority KP IDs remap against ALL source IDs. */
export function planIncrementalProjection(previous,next) {
  const beforeKp=new Map((previous?.authority_kps??[]).map(k=>[k.kp_id,k.authority_content_sha256]));
  const afterKp=new Map(next.authority_kps.map(k=>[k.kp_id,k.authority_content_sha256]));
  const beforeSource=new Map((previous?.original_source_items??[]).map(s=>[s.source_id,s.source_version_sha256]));
  const afterSource=new Map(next.original_source_items.map(s=>[s.source_id,s.source_version_sha256]));
  const changed_kp_ids=[...afterKp].filter(([k,v])=>beforeKp.get(k)!==v).map(([k])=>k);
  const added_kp_ids=changed_kp_ids.filter(k=>!beforeKp.has(k));
  const modified_kp_ids=changed_kp_ids.filter(k=>beforeKp.has(k));
  const changed_source_ids=[...afterSource].filter(([k,v])=>beforeSource.get(k)!==v).map(([k])=>k);
  const new_source_ids=changed_source_ids.filter(k=>!beforeSource.has(k));
  const removed_kp_ids=[...beforeKp.keys()].filter(k=>!afterKp.has(k));
  const removed_source_ids=[...beforeSource.keys()].filter(k=>!afterSource.has(k));
  const pair_work_count=changed_kp_ids.length*afterSource.size+
    (afterKp.size-changed_kp_ids.length)*changed_source_ids.length;
  return {schema_version:"P12_ALL_KP_INCREMENTAL_REMAP_PLAN_V1",
    changed_kp_ids,added_kp_ids,modified_kp_ids,changed_source_ids,new_source_ids,
    removed_kp_ids,removed_source_ids,review_pairs_requiring_projection:pair_work_count,
    all_unchanged_pairs_can_reuse_prior_versioned_projection:true,
    no_auto_approval_or_public_release:true};
}
export function lookupByKp(index,kp_id) {
  const authority=index.authority_kps.find(k=>k.kp_id===kp_id);
  if(!authority)throw new Error("Unknown current KP "+kp_id);
  const links=index.mapping_edges.filter(e=>e.kp_id===kp_id);
  const byId=new Map(index.original_source_items.map(q=>[q.source_id,q]));
  return {kp:authority,candidates:links.map(e=>({edge:e,source:byId.get(e.source_id)})),
    exhaustive_full_corpus_review_complete:false,
    missing_status:links.length?"UNVERIFIED_CANDIDATES_EXIST":"UNASSESSED_NOT_PROVEN_MISSING"};
}
export function lookupBySource(index,source_id) {
  const item=index.original_source_items.find(x=>x.source_id===source_id);
  if(!item)throw new Error("Unknown source ID "+source_id);
  return {source:item,projections:index.mapping_edges.filter(x=>x.source_id===source_id)};
}
const entry=process.argv[1] ? resolve(process.argv[1]) : "";
if(entry && fileURLToPath(import.meta.url)===entry){
  const root=process.cwd();
  const index=buildAllKpSourceIndex({root});
  const json=JSON.stringify(index,null,2)+"\n";
  const command=process.argv[2]??"--summary";
  if(command==="--write"){
    mkdirSync(dirname(resolve(root,OUTPUT_V1)),{recursive:true});
    writeFileSync(resolve(root,OUTPUT_V1),json,"utf8");
  }else if(command==="--check"){
    if(!existsSync(resolve(root,OUTPUT_V1))||readFileSync(resolve(root,OUTPUT_V1),"utf8")!==json)
      throw new Error("Materialized KP index out of sync: run npm run kp:index:build");
  }else if(command!=="--summary")throw new Error("Usage: --write | --check | --summary");
  process.stdout.write(JSON.stringify({command,kps:index.scope.authoritative_kps,source_positions:index.scope.source_answer_positions,
    firstpass:index.firstpass_114_decision_counts,edges:index.mapping_edges.length,
    projection_pairs:index.scope.possible_source_to_kp_review_pairs,
    cross_semester_candidates:index.mapping_edges.filter(x=>x.projection==="MANUAL_CROSS_SCOPE_PROPOSAL").length,
    new_public_positions:0},null,2)+"\n");
}
