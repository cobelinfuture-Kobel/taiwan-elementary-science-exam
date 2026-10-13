import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { buildAllKpSourceIndex, readRepoJSON } from "./p12-all-kp-source-mapping.mjs";

/**
 * Full 1623-source x 46-KP bounded RETRIEVAL evaluation.
 * Regexp signals are a candidate-generation sieve ONLY; this file never
 * certifies that a source semantically fits a KP.
 * Store both positive retrievals and all-KP review-denominator counts.
 */
export const TARGET_PREFIX="sci_g04s2_";
export const BENCHMARK_PATH="data/review/p12-g04s2-114-cross-scope-semantic-pilot-audit-v1.json";
export const OUTPUT_PATH="data/index/p12-g04s2-114-cross-scope-retrieval-pilot-v1.json";
const patterns=[
["01_01",["白天.*夜晚.*(景象|天空|不同)","夜晚.*白天.*(景象|天空|不同)","日夜.*(景象|比較)"]],
["01_02",["白天.*(月亮|太陽|星星|天體)","夜晚.*(月亮|星星|太陽|天體)","天空.*(月亮|星星)","可見.*(月亮|太陽|星星)"]],
["01_03",["望遠鏡.*(太陽|觀測)","(太陽|日光).*(眼睛|直視|安全|觀察)","(眼睛|直視|安全).*(太陽|日光)"]],
["01_04",["影子.*(方向|東方|西方|光源|陽光)","(光源|太陽|陽光).*(影子方向|影子位置|樹影|影子.*方向)","樹影.*(太陽|移動|東方|西方)"]],
["01_05",["影子.*(長度|長短|拉長|縮短)","高度.*影子.*(長|短)","(太陽|光源).*高度.*影子"]],
["01_06",["(太陽|日出|日落).*(東方|西方|移動|位置變化|正午)","(東方|西方|正午).*太陽.*(位置|高度|移動)"]],
["01_07",["月亮.*(方位|高度角|位置)","月.*(方位.*高度|高度.*方位)"]],
["01_08",["(指北針|方位測量).*月亮","月亮.*(指北針|方位|方向)","月亮方位"]],
["01_09",["月亮.*高度角","月高度角","高度角.*月亮","拳頭.*(高度角|角度).*月"]],
["01_10",["月亮.*(東升|西落|升起|落下|全天軌跡|一天.*(移動|運行)|方位.*不變)","月.*(東升西落|全天軌跡)"]],
["01_11",["月相.*(週期|變化|排列|推論|圓缺|循環|再次|幾天|四天|每周)","(滿月|朔月).*月相","相同月相.*(再|天)","29[.]5天"]],
["01_12",["農曆.*(月相|月亮|滿月|形狀)","(元宵節|七夕|中秋節|大年初一).*月相","月相.*(農曆|十五|初一|節日)"]],
["02_01",["水.*(由高處往低處|由高往低|由高流低|往低處流|向下流|順著斜坡流)","(高處|低處).*水.*流"]],
["02_02",["(吸水材料|紙巾|海綿|棉線).*(細縫|吸水)","細縫.*(吸水|材料)"]],
["02_03",["毛細現象","毛細作用","(紙巾|濾紙|棉線).*水.*上升","水.*沿.*細縫.*上升"]],
["02_04",["細縫.*(大小|寬度|粗細|寬窄).*毛細","毛細.*細縫.*(大小|寬|窄)"]],
["02_05",["毛細.*(生活|應用|吸水|紙巾|抹布|棉線|油燈)","(油燈|紙巾|抹布).*毛細"]],
["02_06",["虹吸現象","虹吸"]],
["02_07",["虹吸.*(條件|充滿|高低|水管|管子)","(水管|管子).*虹吸.*(條件|充滿)"]],
["02_08",["虹吸.*(換水|魚缸|抽水|引流)","(換水|魚缸).*虹吸"]],
["02_09",["水面.*(保持水平|維持水平|同一水平|水平面)","(水平|同高).*水面"]],
["02_10",["連通管","連通器"]],
["02_11",["連通管.*(應用|生活|水位|水塔|水管|水壺)"]],
["03_01",["昆蟲.*(頭胸腹|頭部|胸部|腹部|六隻腳|六腳|觸角|身體構造)","(紅娘華|螞蟻|蝴蝶|蜻蜓|蟬).*六(腳|隻腳)"]],
["03_02",["昆蟲.*(參考體|位置|前方|後方|左方|右方)","參考體.*昆蟲"]],
["03_03",["昆蟲.*(運動|行走|飛行|翅膀|腳運動|爬行)","(紅娘華|蝴蝶|蜻蜓|螞蟻).*?(腳運動|翅膀|飛行|運動方式)"]],
["03_04",["昆蟲.*(口器|攝食|吸蜜|吃什麼|食物攝取)","蝴蝶.*(吸蜜|口器)"]],
["03_05",["昆蟲.*(產卵|繁殖|求偶|築巢|交配)","蝴蝶.*產卵"]],
["03_06",["昆蟲.*(保護色|擬態|隱蔽|偽裝)"]],
["03_07",["昆蟲.*(棲地|食物|生活環境)","螞蟻.*(土堆|泥土|土壤|地下|操場|築巢)","水棲昆蟲.*(池|埤塘|水域)"]],
["03_08",["完全變態","(蝴蝶|甲蟲).*?(卵.*幼蟲|幼蟲.*蛹|蛹.*成蟲)"]],
["03_09",["不完全變態","(蟬|蝗蟲|蜻蜓).*?(若蟲|蛻皮|沒有蛹)"]],
["03_10",["昆蟲.*(授粉|食物鏈|生態重要|自然界重要)"]],
["03_11",["昆蟲.*(益蟲|害蟲|人類生活|疾病傳播|利與害)"]],
["03_12",["昆蟲.*(仿生|發明|創意)"]],
["04_01",["(太陽|太陽光).*?(主要能量|能量來源|能源來源|植物生長|生命能量)","生長能源.*太陽"]],
["04_02",["能量.*(做工|能力|意義|定義|讓.*發生變化)"]],
["04_03",["(能量|電能|聲能|光能|熱能).*?(形式|種類|轉換|轉成|轉為|變成)","(聲|光|電|熱).*能.*(轉換|變成)","(太陽能板|電池).*?(轉|聲能|電能|光能)"]],
["04_04",["能源","發電","太陽能","風能","水力能","燃料.*發電","天然氣.*能源","石油.*能源","核能"]],
["04_05",["燃料","煤炭","天然氣.*燃燒","汽油","柴油"]],
["04_06",["自然資源","海洋.*資源","水生資源","資源.*(種類|取得|提供)"]],
["04_07",["再生(能源|資源)","資源.*(保護|永續|再生|合理)","(過度捕撈|限季捕魚|永續利用)"]],
["04_08",["石油.*(用途|製品|原料|塑膠|燃料|使用)"]],
["04_09",["(自然資源|能源|資源).*?(有限|珍惜|枯竭|取之不盡|用之不竭)"]],
["04_10",["(過度開發|廢棄物|環境污染|空氣污染|水域污染|河川污染|廢水污染|土壤污染)","(污染|開發).*?(破壞|水域|森林|環境)"]],
["04_11",["節能","省電","節約能源","隨手關(燈|電|電器)","(省水|當省則省|當用則用)","(回收|省電).*?(電器|電池)"]]
];
export const RETRIEVAL_RULES=Object.fromEntries(patterns.map(([p,re])=>[TARGET_PREFIX+p,re]));
function compiled() {return new Map(Object.entries(RETRIEVAL_RULES).map(([k,arr])=>[k,arr.map(s=>new RegExp(s,"u"))]));}
const sha=o=>createHash("sha256").update(JSON.stringify(o)).digest("hex");

export function buildG04S2RetrievalPilot({index=buildAllKpSourceIndex(),benchmark=readRepoJSON(BENCHMARK_PATH)}={}) {
  const target=index.authority_kps.filter(k=>k.kp_id.startsWith(TARGET_PREFIX));
  if(target.length!==46||index.original_source_items.length!==1623||index.scope.source_papers!==25)
    throw new Error("G04S2 pilot requires exactly the frozen 46-KP, 1623-source/25-paper baseline");
  const ruleMap=compiled();
  const kpSet=new Set(target.map(k=>k.kp_id));
  if(ruleMap.size!==46||[...ruleMap.keys()].some(id=>!kpSet.has(id)))throw new Error("Rule coverage mismatch for exactly 46 canonical KP IDs");
  const rows=[];
  for (const src of index.original_source_items) {
    const raw=typeof src.source_excerpt==="string"?src.source_excerpt.trim():"";
    for (const kp of target){
      const matches=ruleMap.get(kp.kp_id).map((pattern,i)=>pattern.test(raw)?i:null).filter(x=>x!==null);
      if(!matches.length)continue;
      rows.push({source_id:src.source_id,kp_id:kp.kp_id,source_summary:raw,
        original_source_file_ref:src.original_source_item_file_ref,
        original_paper_id:src.original_paper_id,
        firstpass_g04s1_status:src.current_g04s1_firstpass_status,
        source_version_sha256:src.source_version_sha256,
        kp_version_sha256:kp.authority_content_sha256,
        matched_rule_indices:matches,
        retrieval_status:"RETRIEVED_NOT_SEMANTICALLY_CERTIFIED",
        teacher_key_verified:false,source_exact_options_and_figure_verified:false,
        kp_verified:false,public_admission_approved:false});
    }
  }
  rows.sort((a,b)=>a.kp_id.localeCompare(b.kp_id)||a.source_id.localeCompare(b.source_id));
  const sourceById=new Map(index.original_source_items.map(s=>[s.source_id,s]));
  const found=new Set(rows.map(r=>r.kp_id+"|"+r.source_id));
  const bench=[];
  if(!Array.isArray(benchmark.cases))throw Error("Missing adjudication audit cases");
  for(const c of benchmark.cases) {
    const src=sourceById.get(c.source_id);
    if(!src || !kpSet.has(c.kp_id)||typeof c.science_boundary_rationale!=="string"||c.science_boundary_rationale.length<10)
      throw Error("Invalid audited case "+JSON.stringify(c));
    if(src.source_excerpt!==c.firstpass_source_summary)throw Error("Audited case source text drift "+c.source_id);
    if(!["ALIGNMENT_PLAUSIBLE_FROM_SOURCE_SUMMARY","NONALIGNMENT_FROM_SOURCE_SUMMARY","INSUFFICIENT_SOURCE_EVIDENCE"].includes(c.adjudication))
      throw Error("Unexpected independent pilot evidence state");
    if(typeof c.retrieval_expected!=="boolean")throw Error("Explicit expected retrieval missing");
    const was=found.has(c.kp_id+"|"+c.source_id);
    if(was!==c.retrieval_expected)throw Error("Pilot retrieval disagrees with independently annotated test "+c.source_id+"→"+c.kp_id);
    bench.push({...c,retrieval_observed:was,
      limitations:"FIRSTPASS_SOURCE_SUMMARY_ONLY__NOT_EXACT_ORIGINAL_QUESTION_AND_CHOICES"});
  }
  const perKp=target.map(k=>{
    const r=rows.filter(x=>x.kp_id===k.kp_id);
    return {kp_id:k.kp_id,unit_id:k.unit_id,kp_title:k.kp_title,
      source_positions_evaluated_for_retrieval:index.original_source_items.length,
      lexical_retrieval_count:r.length,
      lexical_retrieval_nonmatch_g04s1_count:r.filter(x=>x.firstpass_g04s1_status==="NONMATCH_G04S1_KP_ARCHIVE").length,
      top_ten_retrieved_source_ids:r.slice(0,10).map(x=>x.source_id),
      reviewed_pair_count:bench.filter(x=>x.kp_id===k.kp_id).length,
      exact_source_science_kp_verified_count:0,
      exhaustive_semantic_assessment_complete:false,
      zero_hit_interpretation:r.length?"RETRIEVED_ONLY_NO_KP_ACCEPTANCE":"NO_RULE_HIT_NOT_A_CONFIRMED_KP_MISSING"};
  });
  const byUnit=Object.entries(Object.groupBy?Object.groupBy(perKp,k=>k.unit_id):perKp.reduce((o,k)=>{(o[k.unit_id]??=[]).push(k);return o;},{}))
    .map(([unit,rs])=>({unit,kp_count:rs.length,with_any_rule_candidate:rs.filter(x=>x.lexical_retrieval_count>0).length,
      with_zero_rule_candidate:rs.filter(x=>x.lexical_retrieval_count===0).length,rule_retrieval_edges:rs.reduce((n,x)=>n+x.lexical_retrieval_count,0)}));
  const manualAligned=bench.filter(x=>x.adjudication==="ALIGNMENT_PLAUSIBLE_FROM_SOURCE_SUMMARY");
  const manualNegative=bench.filter(x=>x.adjudication==="NONALIGNMENT_FROM_SOURCE_SUMMARY");
  const manualUnknown=bench.filter(x=>x.adjudication==="INSUFFICIENT_SOURCE_EVIDENCE");
  return {
    schema_version:"P12_G04S2_114_CROSS_SCOPE_SEMANTIC_PILOT_V1",
    intent:"FIRSTPASS_WHOLE_CORPUS_RETRIEVAL_PLUS_BOUNDED_MANUALLY_ADJUDICATED_SEMANTIC_SAMPLE",
    source_catalog_ref:index.source_corpus_ref,
    kp_authority_ref:index.authoritative_kp_ref,
    prior_all_kp_index_builder:"tools/p12-all-kp-source-mapping.mjs",
    manually_curated_audit_ref:BENCHMARK_PATH,
    retrieval_rules_sha256:sha(RETRIEVAL_RULES),
    scope:{papers:25,source_response_positions:1623,target_kp_count:46,
      source_kp_pairs_automatically_screened_for_retrieval:1623*46,
      all_46_kp_have_rules:true,
      independently_science_reviewed_all_114_sources_so_far:145,
      full_original_question_option_figure_level_kp_pair_reviews_completed:0,
      exhaustive_semantic_recall_proven:false,
      source_summary_not_full_question:true,
      rule_nonhits_are_not_out_of_scope_certifications:true,
      no_public_admissions:true,
      frozen_public_total_answer_positions:251,frozen_public_g04s1_answer_positions:53},
    retrieved_candidate_pair_count:rows.length,
    distinct_candidate_source_positions:new Set(rows.map(x=>x.source_id)).size,
    distinct_kps_with_retrieved_candidates:perKp.filter(x=>x.lexical_retrieval_count>0).length,
    per_kp:perKp,per_unit:byUnit,
    adjudication_sample:{count:bench.length,
      alignment_plausible_summary_only:manualAligned.length,
      negative_nonalignment_summary_only:manualNegative.length,
      insufficient_original_evidence:manualUnknown.length,
      observed_rule_hit_in_positive_summary_samples:manualAligned.filter(x=>x.retrieval_observed).length,
      observed_false_hits_in_negative_summary_samples:manualNegative.filter(x=>x.retrieval_observed).length,
      externally_validated_true_recall_or_precision:false},
    audited_source_kp_pairs:bench,
    candidate_edges:rows,
    publication_gate:"CANDIDATES_AND_LIMITED_SOURCE_SUMMARY_AUDITS_ONLY_NO_KP_VERIFICATION_OR_PUBLIC_ADMISSION",
    full_187_kp_expansion_ready:false
  };
}
const called=process.argv[1]?resolve(process.argv[1]):"";
if(called===fileURLToPath(import.meta.url)){
  const result=buildG04S2RetrievalPilot();
  const rendered=JSON.stringify(result,null,2)+"\n";
  const command=process.argv[2]??"--summary";
  if(command==="--write"){
    mkdirSync(dirname(resolve(OUTPUT_PATH)),{recursive:true});writeFileSync(resolve(OUTPUT_PATH),rendered);
  }else if(command==="--check"){
    if(!existsSync(resolve(OUTPUT_PATH))||readFileSync(resolve(OUTPUT_PATH),"utf8")!==rendered)
      throw new Error("G04S2 retrieval pilot index out of sync");
  }else if(command!=="--summary")throw new Error("Expected --summary | --write | --check");
  console.log(JSON.stringify({mode:command,source_positions:result.scope.source_response_positions,
    target_kps:result.scope.target_kp_count,pairs:result.scope.source_kp_pairs_automatically_screened_for_retrieval,
    retrieved_candidate_pairs:result.retrieved_candidate_pair_count,
    distinct_source_positions:result.distinct_candidate_source_positions,
    kp_with_rule_hits:result.distinct_kps_with_retrieved_candidates,
    unit_summary:result.per_unit,adjudication_sample:result.adjudication_sample,
    original_question_level_verified:result.scope.full_original_question_option_figure_level_kp_pair_reviews_completed,
    new_public_additions:0},null,2));
}
