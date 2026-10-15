import {certificationGate} from "./s3-admission.mjs";
import {resolveUnit} from "./authority-adapter.mjs";
export const EMBEDDED_BANK_SCHEMA="SCIENCE_S3_P08_CUMULATIVE_EXAM_BANK_V1";
export const EMBEDDED_BANK_PATH="../data/question-bank/approved-historical-ox-v3.json";
const normalizedAnswers={"O":"TRUE","X":"FALSE"};
function normalize(row,authority){
 if(!row||row.type!=="tf"||!["O","X"].includes(row.answer)||!row.stem?.trim())
  throw Error("歷屆題目題型／答案不完整");
 const unit=resolveUnit(authority,row.unit);
 const kp=unit?.knowledge_points.find(k=>k.canonical_kp_id===row.canonical_kp_id);
 if(!kp)throw Error("歷屆題目指向不存在的 KP："+row.id);
 if(row.grade!==unit.grade||row.semester!==unit.semester)throw Error("題目學期與 KP 不一致："+row.id);
 const c={
  candidate_id:row.id,source_id:row.source_id,source_page_pdf_1_based:row.source_page_pdf_1_based,
  question_type:"TRUE_FALSE",raw_question_text:row.stem,
  review_status:"P04_OPERATOR_ACCEPTED",admission_status:row.admission_status,
  license_status:row.license_status,regulated_exam_identity_verified:row.regulated_exam_identity_verified,
  third_party_content_clearance:row.third_party_content_clearance,public_material_scope:row.public_material_scope,
  original_teacher_answer_text_excluded:row.original_teacher_answer_text_excluded,
  answer_evidence_status:row.answer_evidence_status,science_answer_source:row.science_answer_source??"S3_P03_SCIENCE_REVIEW",
  model_science_answer_review_completed:row.model_science_answer_review_completed===true,
  operator_answer_accepted:row.operator_science_answer_accepted,answer_normalized:normalizedAnswers[row.answer],
  answer_review_verified:row.answer_review_verified,
  science_review_reason:row.science_reasoning,science_review_qualification:row.answer_qualification,
  mapping_status:row.mapping_quality,
  primary_canonical_kp_id:row.canonical_kp_id,kp_review_verified:row.kp_review_verified,
  operator_kp_accepted:row.mapping_quality==="KP_NEAREST_OPERATOR_ACCEPTED",
  nearest_relation_reason:row.nearest_kp_relation_reason??null,
  source_visual_review_verified:row.source_visual_review_verified,
  dependency_review_verified:row.dependency_review_verified,assets_complete:row.assets_complete,
  image_dependency:row.image_dependency
 };
 const v=certificationGate(c,authority);
 if(!v.allowed)throw Error("題目認證未通過："+row.id+"："+v.reasons.join(","));
 return {id:row.id,unit:row.unit,canonical_kp_id:row.canonical_kp_id,type:"tf",
  stem:row.stem,answer:row.answer,kp_mapping_quality:row.mapping_quality,
  answer_explanation:row.science_reasoning,answer_assumption:row.answer_qualification,
  source_id:row.source_id,source_page_pdf_1_based:row.source_page_pdf_1_based,source:"SCHOOL_HISTORICAL_APPROVED"};
}
export function validateAndConvertEmbeddedBank(payload,authority){
 if(payload?.schema_version!==EMBEDDED_BANK_SCHEMA||payload.public_site_integrated!==true
 ||payload.asset_revision!=="SCIENCE_S3_P08_OX_V3"||payload.answer_marker_contract!=="OX_ORIGINAL_EXAM_LAYOUT_V1"||payload.question_bank_status!=="SCIENCE_REASONED_OPERATOR_ACCEPTED_NOT_TEACHER_KEY"
 ||!Array.isArray(payload.blocks))throw Error("內建考古題庫版本不相容");
 const ids=new Set();
 const blocks=payload.blocks.map(row=>{
  if(ids.has(row.id))throw Error("重複題目 ID："+row.id);
  ids.add(row.id);return normalize(row,authority);
 });
 if(blocks.length!==40||payload.blocks.length!==40||payload.expected_count!==40)throw Error("核准題數與封存版本不一致");
 return {admission:"EMBEDDED_CERTIFIED_HISTORICAL",blocks};
}
export const CONTEXT_BANK_PATH="../data/question-bank/certified-context-groups-content-v3.json";
export const CONTEXT_BANK_SCHEMA="SCIENCE_EXAM_S3_P09_CONTEXT_GROUPS_CONTENT_ONLY_V3";
export function validateAndConvertContextGroups(value,authority){
 if(value?.schema_version!==CONTEXT_BANK_SCHEMA||value.expected_group_count!==20
 ||value.expected_answer_slots!==76||value.source_visual_crops_published!==false
 ||!Array.isArray(value.groups)||value.groups.length!==20)
   throw Error("公開題組契約不符合 20 組 P09");
 const ids=new Set(),items=new Set();
 const blocks=value.groups.map(group=>{
  if(!group?.id||ids.has(group.id)||group.certification_status!=="CERTIFIED_PUBLIC"
  ||group.source!=="CERTIFIED_CONTEXT_RECONSTRUCTED"
  ||group.source_review_status!=="GPT6_SCIENCE_CONTEXT_REVIEWED"
  ||group.dependencies_complete!==true||group.original_cropped_assets_included!==false
  ||group.copyright_path!=="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
  ||group.teacher_answer_key_authenticated!==false
  ||!/^[a-f0-9]{64}$/.test(group.source_pdf_sha256)
  ||!Number.isInteger(group.source_page_pdf_1_based)||group.source_page_pdf_1_based<1)
    throw Error("圖文情境來源、權利或來源資料不完整："+group?.id);
  ids.add(group.id);
  const unit=resolveUnit(authority,group.unit);
  if(!unit||unit.grade!==group.grade||unit.semester!==group.semester
   ||!unit.knowledge_points.some(k=>k.canonical_kp_id===group.canonical_kp_id))
    throw Error("圖文情境 KP 或單元不相符："+group.id);
  if(group.type!=="group"||typeof group.title!=="string"||!group.title.trim()
    ||!group.shared||!Array.isArray(group.shared.choiceBank)||!Array.isArray(group.items)||!group.items.length)
    throw Error("題組共用情境不完整："+group.id);
  if(group.shared.table!=null){
   const table=group.shared.table;
   if(!Array.isArray(table.headers)||!Array.isArray(table.rows)
   ||table.headers.length<2||table.rows.some(r=>r.length!==table.headers.length))throw Error("情境表格不完整："+group.id);
  }
  for(const [i,item] of group.items.entries()){
   const key=group.id+"#"+(i+1);
   if(items.has(key)||!["tf","short","mcq","multi","draw"].includes(item.type)
    ||typeof item.stem!=="string"||!item.stem.trim()
    ||typeof item.answer!=="string"||!item.answer.trim()
    ||!item.answer_explanation?.trim())throw Error("情境子題答案不完整："+key);
   if(item.type==="tf"&&!["O","X"].includes(item.answer))throw Error("題組是非題必須 O/X");
   if((item.type==="mcq"||item.type==="multi")&&(!Array.isArray(item.options)||item.options.length<2))throw Error("選項缺失："+key);
   items.add(key);
  }
  return {...group,items:group.items.map((item,i)=>({...item,group_item_id:group.id+"#"+String(i+1).padStart(2,"0")}))};
 });
 if(blocks.reduce((n,b)=>n+b.items.length,0)!==76)throw Error("題組 76 小題覆蓋數不符");
 const drawn=blocks.filter(b=>b.diagram_kind!=null);
 const allowed=new Set(["FLOWER","STEM","ROOT","LEAF","SYRINGE","CIRCUIT_COMPARE","DRAW_CIRCUIT"]);
 if(drawn.length!==7||drawn.some(b=>!allowed.has(b.diagram_kind)))throw Error("P09 向量圖品項未核准");
 if(blocks.some(b=>b.items.some(item=>item.type==="draw") && (b.diagram_kind!=="DRAW_CIRCUIT"||b.assessment_method!=="MANUAL_VISUAL_CORRECTNESS_CHECK"||("automatic_grading" in b))))
   throw Error("作圖題應以圖形正確性核對，不提供分數或自動計分");
 const original=blocks.filter(b=>b.diagram_kind==null&&b.id!=="MID_G03_FORCE_OPTION_IMAGES").length;
 if(original!==12)throw Error("圖文資料群組路由異常");
 return {admission:"EMBEDDED_CERTIFIED_CONTEXT",blocks};
}
export async function loadEmbeddedHistoricalBank(authority,url=EMBEDDED_BANK_PATH,contextUrl=CONTEXT_BANK_PATH){
 const [questions,contexts]=await Promise.all([fetch(url,{cache:"no-cache"}),fetch(contextUrl,{cache:"no-cache"})]);
 if(!questions.ok||!contexts.ok)throw Error("公開內建考古題或情境題組載入失敗");
 const singles=validateAndConvertEmbeddedBank(await questions.json(),authority);
 const groups=validateAndConvertContextGroups(await contexts.json(),authority);
 return {admission:"EMBEDDED_CERTIFIED_HISTORICAL",blocks:[...singles.blocks,...groups.blocks],
  certifiedTrueFalse:singles.blocks.length,certifiedGroupCount:groups.blocks.length,
  certifiedAnswerSlots:singles.blocks.length+groups.blocks.reduce((n,b)=>n+b.items.length,0)};
}
