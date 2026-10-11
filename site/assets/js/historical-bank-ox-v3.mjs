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
export async function loadEmbeddedHistoricalBank(authority,url=EMBEDDED_BANK_PATH){
 const response=await fetch(url,{cache:"no-cache"});
 if(!response.ok)throw Error("內建考古題資料載入失敗："+response.status);
 return validateAndConvertEmbeddedBank(await response.json(),authority);
}
