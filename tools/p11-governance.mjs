import {createHash} from "node:crypto";
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=resolve(fileURLToPath(new URL("..",import.meta.url)));
const read=path=>JSON.parse(readFileSync(resolve(ROOT,path),"utf8"));
const digest=value=>createHash("sha256").update(typeof value==="string"?value:JSON.stringify(value)).digest("hex");
const normalize=s=>String(s??"").normalize("NFKC").replace(/\s+/gu," ").trim();
const pad=(n,width=2)=>String(n).padStart(width,"0");
function invariant(ok,message){if(!ok)throw Error("P11_GOVERNANCE_BLOCKED: "+message);}

export function buildP11(){
 const lock=read("site/data/governance/p11-frozen-baseline.json");
 invariant(lock.schema_version==="SCIENCE_EXAM_P11_OPERATOR_APPROVED_FROZEN_BASELINE_V1","baseline lock invalid");
 for(const [path,expectedSha] of Object.entries(lock.file_git_blob_sha1)){
  const bytes=readFileSync(resolve(ROOT,path));
  const gitBlobHash=createHash("sha1").update("blob "+bytes.length+"\\0").update(bytes).digest("hex");
  invariant(gitBlobHash===expectedSha,"frozen source file changed without operator-authorized revision: "+path);
 }
 const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
 const bank=read("site/data/question-bank/approved-historical-ox-v4.json");
 const groups=read("site/data/question-bank/certified-context-groups-v2.json");
 const source=read("site/data/governance/p11-source-sections.json");
 const diagramBytes=readFileSync(resolve(ROOT,"site/assets/js/science-diagrams-p09.mjs"));
 const diagramBundleSha=digest(diagramBytes.toString("utf8"));
 invariant(authority.counts.knowledge_points===187&&authority.units.length===16,"canonical authority count drift");
 invariant(bank.blocks.length===72&&groups.groups.length===20&&groups.groups.reduce((n,g)=>n+g.items.length,0)===76,"P10/P09 public-bank preservation");
 invariant(source.source_papers.length===8&&source.expected_provisional_scored_slots===477,"eight-paper frozen source inventory changed");
 const sourceById=new Map(source.source_papers.map(s=>[s.source_id,s]));
 invariant(sourceById.size===8,"duplicate source IDs");
 for(const x of source.source_papers){
  invariant(/^[a-f0-9]{64}$/.test(x.source_pdf_sha256),"source PDF SHA format "+x.source_id);
  invariant(x.sections.every(z=>z.slot_count===z.part_slot_counts.reduce((a,b)=>a+b,0)&&z.slot_count>0),"source section count mismatch "+x.source_id);
 }
 const sourceSlots=[],byExactTF=new Map();
 for(const paper of source.source_papers)for(const section of paper.sections){
  let n=0;
  for(let p=0;p<section.part_slot_counts.length;p++)for(let i=1;i<=section.part_slot_counts[p];i++){
   n++;
   const exact=(section.section_code==="TF"||section.section_code==="MC"||section.section_code==="READ"&&section.part_slot_counts.length===1);
   const originalNumber=exact?String(n):null;
   const slotId=paper.source_id+"|"+section.section_code+"|P"+pad(p+1)+"|"+pad(i,3);
   const r={source_slot_id:slotId,source_id:paper.source_id,source_pdf_sha256:paper.source_pdf_sha256,
    source_page_start:section.source_page_start,source_page_end:section.source_page_end,
    section_code:section.section_code,original_question_number:originalNumber,
    source_part_number:p+1,part_slot_ordinal:i,source_section_ordinal:n,
    source_locator_quality:section.slot_mapping_status,
    evidence_basis:paper.slot_inventory_basis,
    exact_published_question_id:null,
    admission_status:"SOURCE_SLOT_NOT_EXACTLY_CERTIFIED",
    manual_review_required:!exact};
   sourceSlots.push(r);
   if(section.section_code==="TF"){
    const key=paper.source_id+"-TF-"+pad(n);
    invariant(!byExactTF.has(key),"TF source locator duplicates "+key);
    byExactTF.set(key,r);
   }
  }
 }
 invariant(sourceSlots.length===477,"source slot count mismatch: "+sourceSlots.length);
 const coveredSourceTF=new Set(),ids=new Set(),questionFingerprints=new Set(),identity=[];
 function register(row){
  invariant(!ids.has(row.identity_id),"duplicate question identity "+row.identity_id);
  ids.add(row.identity_id);
  const fk=row.content_sha256+":"+row.source_id;
  invariant(!questionFingerprints.has(fk),"duplicate source-local normalized question content "+row.identity_id);
  questionFingerprints.add(fk);
  identity.push(row);
 }
 for(const q of bank.blocks){
  const src=sourceById.get(q.source_id);invariant(!!src,"question source missing: "+q.id);
  invariant(q.source_pdf_sha256===src.source_pdf_sha256,"question PDF hash differs from source: "+q.id);
  const slot=byExactTF.get(q.id);invariant(!!slot,"cannot find original TF question position "+q.id);
  invariant(!coveredSourceTF.has(slot.source_slot_id),"duplicate exact TF source match");
  coveredSourceTF.add(slot.source_slot_id);
  slot.exact_published_question_id=q.id;slot.admission_status="ADMITTED_PUBLIC_EXACT_TF";
  slot.manual_review_required=false;
  const content={type:q.type,stem:normalize(q.stem),options:null,source_context:null};
  const released={...content,answer:q.answer,canonical_kp_id:q.canonical_kp_id,
    science_reasoning:normalize(q.science_reasoning),qualification:normalize(q.answer_qualification)};
  register({identity_id:q.id,published_item_id:q.id,source_id:q.source_id,
   source_pdf_sha256:src.source_pdf_sha256,source_page_pdf_1_based:q.source_page_pdf_1_based,
   source_slot_id:slot.source_slot_id,source_locator_quality:"EXACT_SOURCE_TF_NUMBER",
   content_sha256:digest(content),published_revision_sha256:digest(released),
   revision_label:"P11_BASELINE_UNMODIFIED",revision_history_available:false,
   exact_original_wording_in_public_bank:true,
   primary_canonical_kp_id:q.canonical_kp_id,secondary_canonical_kp_ids:[],
   type:q.type,origin_status:"PUBLISHED_ORIGINAL_TF",
   answer_evidence_status:q.answer_evidence_status,teacher_key_authenticated:q.teacher_key_authenticated===true});
 }
 // Context groups were independently redrawn or paraphrased. They are never promoted
 // to an exact source subquestion anchor by an automatic ordinal guess.
 const contextSection={
 "MID_G03_FORCES_MATCHING":"FILL","MID_G03_MAGNET_READING":"READ",
 "FINAL_G03_INDICATOR_TABLE":"COMPOSITE","MID_G04_WATER_ENV_MATCHING":"COMPOSITE",
 "MID_G04_HABITAT_MATCHING":"COMPOSITE","MID_G04_WATER_PLANT_MATCHING":"COMPOSITE",
 "MID_G04_EARTHQUAKE_MATCHING":"COMPOSITE","FINAL_G04_CONDUCTOR_OPTIONS":"COMPOSITE",
 "FINAL_G04_REFLECTION_READING":"LITERACY","MID_G03_FORCE_OPTION_IMAGES":"MC",
 "MID_G03_FLOWER_DIAGRAM":"FILL","MID_G03_STEM_DIAGRAM":"FILL",
 "MID_G03_ROOT_DIAGRAM":"FILL","MID_G03_LEAF_ARRANGEMENTS":"FILL",
 "FINAL_G03_SYRINGE_FIGURE":"COMPOSITE","FINAL_G03_ANTHOCYANIN_READING":"READ",
 "MID_G04_EARTHQUAKE_READING":"READ","FINAL_G04_CIRCUIT_IMAGES":"COMPOSITE",
 "FINAL_G04_CIRCUIT_DRAW":"DRAW","FINAL_G04_LED_READING":"READ"
 };
 const groupLineage=[];
 for(const g of groups.groups){
  const src=sourceById.get(g.source_id);
  invariant(!!src&&src.source_pdf_sha256===g.source_pdf_sha256,"context group PDF source mismatch "+g.id);
  const section=contextSection[g.id];
  invariant(!!section&&src.sections.some(s=>s.section_code===section),"context section lineage missing: "+g.id);
  groupLineage.push({group_id:g.id,source_id:g.source_id,section_code:section,
    published_slots:g.items.length,exact_source_subitem_map_completed:false,
    original_visual_reused:false,context_relation_status:"SOURCE_SECTION_LINK_ONLY_REVIEW_REQUIRED"});
  for(let i=0;i<g.items.length;i++){
   const q=g.items[i],content={type:q.type,stem:normalize(q.stem),
    options:(q.options??[]).map(normalize),
    context:{title:normalize(g.title),instructions:normalize(g.shared?.instructions),
     passage:normalize(g.shared?.passage),choiceBank:(g.shared?.choiceBank??[]).map(normalize),
     table:g.shared?.table??null,diagram_kind:g.diagram_kind??null}};
   const released={...content,answer:q.answer,explanation:normalize(q.answer_explanation),
    qualification:normalize(q.answer_assumption),primary_kp:g.canonical_kp_id,
    secondary_kps:g.secondary_canonical_kp_ids??[]};
   const id=g.id+"#"+pad(i+1);
   register({identity_id:id,published_item_id:id,source_id:g.source_id,
    source_pdf_sha256:src.source_pdf_sha256,source_page_pdf_1_based:g.source_page_pdf_1_based,
    source_slot_id:null,source_section_code:section,
    source_locator_quality:"ADAPTED_CONTEXT_SOURCE_SECTION_ONLY",
    content_sha256:digest(content),published_revision_sha256:digest(released),
    diagram_asset_bundle_sha256:g.diagram_kind?diagramBundleSha:null,
    diagram_kind:g.diagram_kind??null,
    revision_label:"P11_BASELINE_UNMODIFIED",revision_history_available:false,
    exact_original_wording_in_public_bank:false,
    primary_canonical_kp_id:g.canonical_kp_id,secondary_canonical_kp_ids:g.secondary_canonical_kp_ids??[],
    type:q.type,origin_status:"PUBLISHED_RECONSTRUCTED_CONTEXT",
    answer_evidence_status:g.answer_evidence_status,teacher_key_authenticated:false});
  }
 }
 invariant(identity.length===148&&coveredSourceTF.size===72,"public item count/TF source identity drift");
 const primaryCounts=new Map(),secondaryCounts=new Map(),kpOwners=new Map(),unitRows=[];
 for(const u of authority.units){
  const unitId=u.grade+"-S"+u.semester+"-"+u.unit_id;
  unitRows.push({unit_id:unitId,grade:u.grade,semester:u.semester,unit_title:u.unit_title,
   kp_total:u.knowledge_points.length,primary_kp_covered:0,primary_kp_missing:0,
   published_answer_slots:0,original_tf_slots:0,reconstructed_context_slots:0});
  for(const kp of u.knowledge_points)kpOwners.set(kp.canonical_kp_id,unitId);
 }
 invariant(kpOwners.size===187,"duplicate canonical KP in authority");
 for(const item of identity){
  invariant(kpOwners.has(item.primary_canonical_kp_id),"invalid primary KP "+item.identity_id);
  primaryCounts.set(item.primary_canonical_kp_id,(primaryCounts.get(item.primary_canonical_kp_id)??0)+1);
  const row=unitRows.find(x=>x.unit_id===kpOwners.get(item.primary_canonical_kp_id));
  row.published_answer_slots++;
  if(item.origin_status==="PUBLISHED_ORIGINAL_TF")row.original_tf_slots++;else row.reconstructed_context_slots++;
  for(const extra of item.secondary_canonical_kp_ids){
   invariant(kpOwners.has(extra),"invalid secondary KP "+item.identity_id);
   secondaryCounts.set(extra,(secondaryCounts.get(extra)??0)+1);
  }
 }
 const kpRows=[];
 for(const u of authority.units)for(const k of u.knowledge_points){
  const primary=primaryCounts.get(k.canonical_kp_id)??0;
  const secondary=secondaryCounts.get(k.canonical_kp_id)??0;
  kpRows.push({unit_id:kpOwners.get(k.canonical_kp_id),canonical_kp_id:k.canonical_kp_id,
   kp_name:k.title??k.name??k.kp_name??null,primary_answer_slots:primary,secondary_answer_slots:secondary,
   coverage_status:primary>0?"PRIMARY_COVERED":"PRIMARY_MISSING"});
 }
 for(const row of unitRows){row.primary_kp_covered=kpRows.filter(x=>x.unit_id===row.unit_id&&x.primary_answer_slots>0).length;
 row.primary_kp_missing=row.kp_total-row.primary_kp_covered;}
 const covered=kpRows.filter(x=>x.primary_answer_slots>0).length;
 invariant(covered===71&&unitRows.length===16,"P11 frozen baseline 71 of 187 KP changed unexpectedly");
 const coverage={schema_version:"SCIENCE_EXAM_P11_KP_COVERAGE_V1",
  source_authority_kp_total:187,total_units:16,units_with_published_answer_slots:unitRows.filter(u=>u.published_answer_slots>0).length,
  primary_kp_covered:covered,primary_kp_missing:187-covered,
  kp_primary_coverage_percent:Number((covered/187*100).toFixed(2)),
  public_answer_slots:identity.length,public_original_tf_slots:72,
  public_reconstructed_context_slots:76,published_context_groups:20,
  counts_are_independent_answer_slots_not_independently_mixable_questions:true,
  units:unitRows,knowledge_points:kpRows};
 const fullCorpus={schema_version:"SCIENCE_EXAM_P11_FULL_CORPUS_SLOT_LEDGER_V1",
  source_papers:8,original_source_slot_inventory_count:sourceSlots.length,
  exact_tf_source_slots_publicly_admitted:coveredSourceTF.size,
  source_slots_without_exact_public_item_link:sourceSlots.length-coveredSourceTF.size,
  published_adapted_context_answer_slots:76,
  group_lineage_mapping_status:"SECTION_ASSOCIATION_ONLY_NOT_SUBITEM_EXACT",
  figure_source_visual_verification_status:"OPERATOR_REVIEW_REQUIRED",
  score_conflict_requires_human_resolution:"G03-S2-MID_COMPOSITE_22_VISIBLE_BLANKS_VS_20_PRINTED_MARKS",
  source_count_and_locator_status:"SECTIONAL_INVENTORY_PROVISIONAL_NOT_FULL_TRANSCRIPTION",
  excluded_or_rejected_questions_not_yet_individually_classified:true,
  public_admission_changed:false,groups:groupLineage,source_slots:sourceSlots};
 const identities={schema_version:"SCIENCE_EXAM_P11_QUESTION_IDENTITIES_V1",
  no_new_items_verified:true,expected_public_items:148,
  all_source_pdfs_sha256_recorded:true,
  precise_source_subitem_lineage_for_reconstructed_groups:false,
  content_hash_algorithm:"sha256:JSON.stringify(canonical objects; Unicode NFKC; whitespace-collapse)",
  diagram_hash_granularity:"SINGLE_SHARED_DIAGRAM_MODULE_NOT_PER_FIGURE",
  revision_strategy:"immutable published hash; human-approved new revision record required on content changes",
  questions:identity};
 return {"p11-question-identities.json":identities,
  "p11-full-corpus-ledger.json":fullCorpus,"p11-kp-coverage.json":coverage};
}
export function writeP11({check=false}={}){
 const output=buildP11(),outDir=resolve(ROOT,"site/data/governance");
 mkdirSync(outDir,{recursive:true});
 for(const [filename,data] of Object.entries(output)){
  const target=resolve(outDir,filename),newContent=JSON.stringify(data,null,2)+"\n";
  if(check){invariant(existsSync(target),"missing generated "+filename);
   invariant(readFileSync(target,"utf8")===newContent,"generated report stale: "+filename);}
  else writeFileSync(target,newContent);
 }
 const c=output["p11-kp-coverage.json"],i=output["p11-question-identities.json"],f=output["p11-full-corpus-ledger.json"];
 return {items:i.questions.length,kpCovered:c.primary_kp_covered,kpTotal:187,originalSlots:f.original_source_slot_inventory_count,
  exactPublicTF:f.exact_tf_source_slots_publicly_admitted,adaptedSlots:f.published_adapted_context_answer_slots,
  unresolvedOriginalSlots:f.source_slots_without_exact_public_item_link,sourceCount:f.source_papers};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const arg=process.argv.includes("--check")?"--check":"--write";
 console.log("P11_GOVERNANCE_PASS",JSON.stringify(writeP11({check:arg==="--check"})));
}
