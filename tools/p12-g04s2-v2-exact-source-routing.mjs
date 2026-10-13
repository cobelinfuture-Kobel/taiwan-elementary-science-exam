import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllKpSourceIndex, readRepoJSON } from "./p12-all-kp-source-mapping.mjs";
import { buildG04S2RetrievalPilot } from "./p12-g04s2-114-cross-scope-retrieval-pilot.mjs";

/** V2 is an auditable candidate+exact-case rerouter, NOT 46-KP certification. */
export const EXACT_REVIEW_PATH="data/review/p12-g04s2-v2-exact-source-kp-intent-challenge-v1.json";
export const OUTPUT_PATH="data/index/p12-g04s2-v2-exact-source-retrieval-routing-v1.json";
export const BACKCOMPAT_V1="data/index/p12-g04s2-114-cross-scope-retrieval-pilot-v1.json";
const digestPair=(s,k)=>s+"|"+k;
const normalize=s=>(typeof s==="string"?s:"").replace(/\s+/gu,"");
const newPatterns={
  "sci_g04s2_01_12":[/(?:月亮|月相).{0,12}(?:農曆|日期)/u,/(?:農曆|日期).{0,12}(?:月亮|月相)/u],
  "sci_g04s2_03_01":[/(?:六隻?腳|六腳).{0,16}(?:紅娘華|昆蟲|螞蟻|蚊子|蝴蝶)/u,/(?:紅娘華|昆蟲|螞蟻|蚊子|蝴蝶).{0,16}(?:六隻?腳|六腳)/u],
  "sci_g04s2_03_07":[/(?:埤塘|水域|水池).{0,16}水棲昆蟲/u,/水棲昆蟲.{0,16}(?:埤塘|水域|水池)/u]
};
function energySourceClassificationWithoutFuelAssessment(text){
  const s=normalize(text);
  return /(是否為能源|幾項是能源|屬於能源|能源分類)/u.test(s)
     && !/(燃料.*(燃燒|提供能量)|燃燒.*燃料|煤炭.*燃燒)/u.test(s);
}
function linksByKp(candidates,targetKP){
  const counts=new Map(targetKP.map(k=>[k.kp_id,{unit:k.unit_id,edges:0,sources:new Set()}]));
  for(const e of candidates){const q=counts.get(e.kp_id);q.edges++;q.sources.add(e.source_id);}
  return targetKP.map(k=>({kp_id:k.kp_id,unit_id:k.unit_id,kp_title:k.kp_title,
    candidate_pairs:counts.get(k.kp_id).edges,distinct_source_positions:counts.get(k.kp_id).sources.size,
    full_source_kp_coverage_certified:false,
    empty_means:counts.get(k.kp_id).edges?"CANDIDATES_REMAIN_UNVERIFIED":"NO_RETRIEVAL_CANDIDATE_NOT_PROVEN_MISSING"}));
}
export function buildG04S2V2({index=buildAllKpSourceIndex(),
  v1=buildG04S2RetrievalPilot({index}),audit=readRepoJSON(EXACT_REVIEW_PATH)}={}) {
  if(index.scope.source_answer_positions!==1623||v1.scope.target_kp_count!==46||v1.scope.source_kp_pairs_automatically_screened_for_retrieval!==74658)throw Error("Frozen baseline mismatch");
  const ids=new Map(index.original_source_items.map(x=>[x.source_id,x]));
  const kpList=index.authority_kps.filter(k=>k.grade===4&&k.semester===2);
  const kps=new Map(kpList.map(k=>[k.kp_id,k]));
  const prev=new Map(v1.candidate_edges.map(e=>[digestPair(e.source_id,e.kp_id),{...e,retrieval_origin:"V1_RETAINED",kp_target_confidence:"RULE_HIT_ONLY"}]));
  // New retrieval rules address *concept synonyms and word order*, not a hard-coded whitelist of source IDs.
  for(const source of index.original_source_items)for(const [kp_id,pats]of Object.entries(newPatterns)){
    if(pats.some(p=>p.test(normalize(source.source_excerpt)))){
      const key=digestPair(source.source_id,kp_id);
      if(!prev.has(key))prev.set(key,{source_id:source.source_id,kp_id,
        source_summary:source.source_excerpt,original_source_file_ref:source.original_source_item_file_ref,
        original_paper_id:source.original_paper_id,firstpass_g04s1_status:source.current_g04s1_firstpass_status,
        source_version_sha256:source.source_version_sha256,kp_version_sha256:kps.get(kp_id).authority_content_sha256,
        retrieval_origin:"V2_WORD_ORDER_SYNONYM_RECALL_REPAIR",kp_target_confidence:"RULE_HIT_ONLY",
        retrieval_status:"RETRIEVED_NOT_SEMANTICALLY_CERTIFIED",kp_verified:false,
        public_admission_approved:false,teacher_key_verified:false});
    }
  }
  const samples=new Map();
  for(const r of audit.items){
    const key=digestPair(r.source_id,r.kp_id);
    if(samples.has(key)||!ids.has(r.source_id)||!kps.has(r.kp_id))throw Error("Bad or duplicate exact audit case "+key);
    if(!r.source_readback_rationale||r.source_readback_rationale.length<12)throw Error("Missing independent reason "+key);
    if(r.evidence_tier==="SOURCE_EXACT_PDF"){
      const src=ids.get(r.source_id);
      if(!r.original_pdf_sha256||!r.exact_original_pdf_page||!r.exact_pdf_text_anchor)throw Error("Missing exact PDF proof "+key);
      if(src.original_pdf_sha256 && src.original_pdf_sha256!==r.original_pdf_sha256)throw Error("Original SHA differs from source ledger "+key);
    }else if(r.evidence_tier!=="FIRSTPASS_SUMMARY_ONLY"||r.adjudicated_relationship!=="SOURCE_PDF_UNAVAILABLE_PENDING_EXACT_REVIEW")throw Error("Invalid evidence tier "+key);
    samples.set(key,r);
  }
  const suppressed=[];
  for(const [key,e]of prev){
    const s=ids.get(e.source_id),auditItem=samples.get(key),text=normalize(s.source_excerpt);
    // Evidence supported broad rerouting: an energy-*category* question does not establish fuel KP
    // simply because its options contain coal/natural gas.
    const genericOff=e.kp_id==="sci_g04s2_04_05"&&energySourceClassificationWithoutFuelAssessment(text);
    const exactNonmatch=auditItem?.adjudicated_relationship==="SOURCE_EXACT_NONMATCH";
    if(genericOff||exactNonmatch){
      suppressed.push({...e,retrieval_status:"V2_REVIEW_EXCLUDED_FOR_THIS_KP",
        suppression_reason:exactNonmatch?"EXACT_ORIGINAL_PDF_SHOWS_DIFFERENT_ASSESSED_CONCEPT":"CONSERVATIVE_ENERGY_VS_FUEL_ROUTING_FILTER",
        suppression_evidence_ref:exactNonmatch?EXACT_REVIEW_PATH:null,original_pair_remains_traceable:true});
      prev.delete(key);
    }
  }
  const candidateEdges=[...prev.values()].sort((a,b)=>a.kp_id.localeCompare(b.kp_id)||a.source_id.localeCompare(b.source_id))
     .map(e=>{
       const r=samples.get(digestPair(e.source_id,e.kp_id));
       return {...e,
         source_intent_classification:r?.adjudicated_relationship??"UNREVIEWED_RETRIEVAL_CANDIDATE",
         evidence_tier:r?.evidence_tier??"FIRSTPASS_SOURCE_SUMMARY_ONLY",
         exact_source_pair_review_ref:r?EXACT_REVIEW_PATH:null,
         kp_verified:false,teacher_key_verified:false,figure_rights_approved:false,
         public_admission_approved:false};
     });
  const sampleResults=[];
  const kept=new Set(prev.keys());
  for(const row of audit.items) {
    const key=digestPair(row.source_id,row.kp_id);
    const src=ids.get(row.source_id);
    sampleResults.push({
      source_id:row.source_id,kp_id:row.kp_id,evidence_tier:row.evidence_tier,
      adjudicated_relationship:row.adjudicated_relationship,
      v1_retrieved:v1.candidate_edges.some(e=>e.source_id===row.source_id&&e.kp_id===row.kp_id),
      v2_retrieved:kept.has(key),source_excerpt:src.source_excerpt,
      source_pdf_sha256:row.original_pdf_sha256,original_source_pdf_page:row.exact_original_pdf_page,
      source_readback_rationale:row.source_readback_rationale,
      formal_kp_verified:false,public_admission_approved:false
    });
  }
  // Audit the V1 intentionally-curated summary-only challenge bank again. This is
  // a development test, NEVER an independent estimate of full-corpus precision/recall.
  const v1Cases=v1.audited_source_kp_pairs.map(row=>{
    const hit=kept.has(digestPair(row.source_id,row.kp_id));
    return {source_id:row.source_id,kp_id:row.kp_id,judgment:row.adjudication,v1_retrieved:row.retrieval_observed,v2_retrieved:hit};
  });
  const devPos=v1Cases.filter(x=>x.judgment==="ALIGNMENT_PLAUSIBLE_FROM_SOURCE_SUMMARY");
  const devNeg=v1Cases.filter(x=>x.judgment==="NONALIGNMENT_FROM_SOURCE_SUMMARY");
  const exactPos=sampleResults.filter(x=>x.evidence_tier==="SOURCE_EXACT_PDF"&&/PLAUSIBLE/.test(x.adjudicated_relationship));
  const exactNeg=sampleResults.filter(x=>x.adjudicated_relationship==="SOURCE_EXACT_NONMATCH");
  const targetKp=linksByKp(candidateEdges,kpList);
  const units=["U01","U02","U03","U04"].map(u=>{
    const d=targetKp.filter(x=>x.unit_id===u);
    return {unit:u,kps:d.length,with_candidates:d.filter(x=>x.candidate_pairs>0).length,
      without_candidates:d.filter(x=>x.candidate_pairs===0).length,
      retained_retrieval_candidate_pairs:d.reduce((n,x)=>n+x.candidate_pairs,0)};
  });
  const added=candidateEdges.filter(x=>x.retrieval_origin==="V2_WORD_ORDER_SYNONYM_RECALL_REPAIR");
  return {
    schema_version:"P12_ALL_KP_G04S2_V2_EXACT_SOURCE_ROUTING_REPAIR_V1",
    intent:"REAL_ORIGINAL_PDF_BOUNDED_CASE_ADJUDICATION_PLUS_GLOBAL_CANDIDATE_RETRIEVAL_REPAIR",
    baseline_index_ref:"tools/p12-all-kp-source-mapping.mjs",
    baseline_v1_runner_ref:"tools/p12-g04s2-114-cross-scope-retrieval-pilot.mjs",
    source_exact_case_ref:EXACT_REVIEW_PATH,
    source_corpus_denominator:1623,kp_target_denominator:46,source_kp_retrieval_evaluations:74658,
    source_pdf_originals_not_available_for_every_case:true,
    original_exact_source_pdf_pairs_attested:audit.items.filter(x=>x.evidence_tier==="SOURCE_EXACT_PDF").length,
    source_pdf_unavailable_holds:audit.items.filter(x=>x.evidence_tier!=="SOURCE_EXACT_PDF").length,
    source_semantics_full_corpus_certified:false,
    sample_design_random_blind_holdout:false,
    firstpass_summary_can_be_incomplete_or_incorrect:true,
    v1_retrieved_edges:v1.candidate_edges.length,
    v2_retrieved_edges:candidateEdges.length,
    v2_distinct_retrieved_source_positions:new Set(candidateEdges.map(x=>x.source_id)).size,
    added_generalized_recall_candidates:added.length,
    all_v2_added_candidate_edges:added,
    suppressed_prior_candidates:suppressed,
    suppressions_count:suppressed.length,
    original_excluded_pairs_preserved_in_audit:true,
    per_kp:targetKp,by_unit:units,
    development_sample_quality:{
      sample_is_curated_and_used_for_rule_repairs:true,
      positive_summary_pairs:devPos.length,
      positive_summary_retrieved_v1:devPos.filter(x=>x.v1_retrieved).length,
      positive_summary_retrieved_v2:devPos.filter(x=>x.v2_retrieved).length,
      negative_summary_pairs:devNeg.length,
      negative_summary_false_hits_v1:devNeg.filter(x=>x.v1_retrieved).length,
      negative_summary_false_hits_v2:devNeg.filter(x=>x.v2_retrieved).length,
      accuracy_claim_on_population:false
    },
    original_pdf_sample_quality:{
      exact_positive_or_secondary_pairs:exactPos.length,
      exact_positive_or_secondary_retrieved:exactPos.filter(x=>x.v2_retrieved).length,
      exact_nonmatching_pairs:exactNeg.length,
      exact_nonmatching_false_retrieved:exactNeg.filter(x=>x.v2_retrieved).length,
      exact_pdf_issue_holds:audit.items.filter(x=>x.evidence_tier==="SOURCE_EXACT_PDF"&&/HOLD/.test(x.adjudicated_relationship)).length,
      source_unavailable_holds:audit.items.filter(x=>x.evidence_tier!=="SOURCE_EXACT_PDF").length,
      independent_random_holdout_quality_established:false
    },
    exact_case_audit:sampleResults,
    v1_curated_comparison:v1Cases,
    reviewed_full_46_kp_certification_pairs:0,
    candidate_edges:candidateEdges,
    full_187kp_expansion_ready:false,
    publication_gate:"FAIL_CLOSED__114_ALL25_FINAL_APPROVAL_REQUIRED__ZERO_NEW_PUBLIC",
    public_total_questions_still:251,public_g04s1_still:53,new_public_admissions:0
  };
}
const isentry=process.argv[1]?resolve(process.argv[1]):"";
if(isentry===fileURLToPath(import.meta.url)){
  const v2=buildG04S2V2();
  const json=JSON.stringify(v2,null,2)+"\n";
  const cmd=process.argv[2]??"--summary";
  if(cmd==="--write"){mkdirSync(dirname(resolve(OUTPUT_PATH)),{recursive:true});writeFileSync(resolve(OUTPUT_PATH),json);}
  else if(cmd==="--check"){if(!existsSync(resolve(OUTPUT_PATH))||readFileSync(resolve(OUTPUT_PATH),"utf8")!==json)throw Error("V2 source-KP index readback mismatch");}
  else if(cmd!=="--summary")throw Error("Usage: --summary | --write | --check");
  console.log(JSON.stringify({
    command:cmd,baseline_retrieval:v2.v1_retrieved_edges,v2_candidates:v2.v2_retrieved_edges,
    added:v2.added_generalized_recall_candidates,suppressed:v2.suppressions_count,
    units:v2.by_unit,summary_challenge:v2.development_sample_quality,
    original_pdf_challenge:v2.original_pdf_sample_quality,
    public_additions:0
  },null,2));
}
