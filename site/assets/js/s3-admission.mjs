export const RIGHTS_POLICY_VERSION="SCIENCE_EXAM_S3_P03_TAIWAN_ART9_V1";
// Article 9 covers qualifying lawfully held exam questions, not copied third-party
// readings, illustrations, teacher explanations, or unrelated proprietary assets.
// These fields must be affirmed for the *particular* question; never infer from filename.
export function isExamQuestionReuseEligible(row){
  if(row?.license_status==="PUBLIC_REUSE_AUTHORIZED")return true;
  return row?.license_status==="REGULATED_EXAM_QUESTION_ART9"
    && row.regulated_exam_identity_verified===true
    && row.third_party_content_clearance==="NO_THIRD_PARTY_COPY"
    && row.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    && row.original_teacher_answer_text_excluded===true;
}

export function hasAcceptedScienceAnswer(row){
  if(row?.answer_evidence_status==="SCIENCE_REASONED_GPT6_REVIEWED"
    && row.model_science_answer_review_completed===true
    && row.science_answer_source==="GPT6_S3_P08_REASONED_REVIEW"
    && ["TRUE","FALSE"].includes(row.answer_normalized)
    && typeof row.science_review_reason==="string"&&row.science_review_reason.trim()
    && typeof row.science_review_qualification==="string"&&row.science_review_qualification.trim())return true;
  return row?.answer_evidence_status==="SCIENCE_REASONED_OPERATOR_ACCEPTED"
    && row.operator_answer_accepted===true
    && row.science_answer_source==="S3_P03_SCIENCE_REVIEW"
    && ["TRUE","FALSE"].includes(row.answer_normalized)
    && typeof row.science_review_reason==="string"&&row.science_review_reason.trim().length>0
    && typeof row.science_review_qualification==="string"&&row.science_review_qualification.trim().length>0;
}
export function hasAcceptedKPMapping(row){
  if(["KP_CERTIFIED","KP_EXACT_SCIENCE_REVIEWED"].includes(row?.mapping_status))return true;
  if(row?.mapping_status==="KP_NEAREST_OPERATOR_ACCEPTED")
    return row.operator_kp_accepted===true&&typeof row.nearest_relation_reason==="string"&&row.nearest_relation_reason.trim().length>0;
  if(row?.mapping_status==="KP_RELATED_SCIENCE_REVIEWED")
    return typeof row.science_review_qualification==="string"&&row.science_review_qualification.trim().length>0;
  return false;
}
export const S3_POLICY_VERSION="SCIENCE_S3_QUESTION_ADMISSION_V1";
export const EVIDENCE_STATES=Object.freeze({
  NO_KEY:"ANSWER_KEY_NOT_PRESENT",
  HIDDEN_OX:"TEXT_LAYER_OX_NOT_VISIBLE_IN_RENDER",
  VERIFIED:"ANSWER_INDEPENDENTLY_VERIFIED"
});
const requiredText=(v,name)=>{if(typeof v!=="string"||!v.trim())throw Error(name+" missing");return v;};
const requiredPositive=(v,name)=>{if(!Number.isInteger(v)||v<1)throw Error(name+" invalid");return v;};
export function validateCandidateShape(row){
  if(!row||typeof row!=="object")throw Error("candidate missing");
  for(const field of ["candidate_id","source_id","question_type","raw_question_text","review_status","admission_status","license_status","answer_evidence_status","mapping_status"])
    requiredText(row[field],field);
  requiredPositive(row.source_page_pdf_1_based,"PDF page");
  if(row.answer_evidence_status===EVIDENCE_STATES.HIDDEN_OX&&row.answer_normalized!==null)
    throw Error("hidden PDF O/X marker cannot be promoted into verified answer");
  if(row.mapping_status==="KP_UNRESOLVED"&&row.primary_canonical_kp_id!==null)
    throw Error("unresolved KP must not claim an exact KP id");
  if(row.image_dependency!=="NONE_FOR_THIS_ITEM"&&row.assets_complete!==true)
    if(row.admission_status==="CERTIFIED_PUBLIC")throw Error("dependent image required");
  return row;
}
export function certificationGate(candidate, authority){
  validateCandidateShape(candidate);
  const reasons=[];
  if(!(candidate.answer_evidence_status===EVIDENCE_STATES.VERIFIED||hasAcceptedScienceAnswer(candidate))||candidate.answer_review_verified!==true||candidate.answer_normalized==null)
    reasons.push("ANSWER_UNVERIFIED");
  if(candidate.source_visual_review_verified!==true)reasons.push("SOURCE_VISUAL_REVIEW_PENDING");
  if(candidate.kp_review_verified!==true||!hasAcceptedKPMapping(candidate))reasons.push("KP_REVIEW_PENDING");
  if(candidate.dependency_review_verified!==true||candidate.assets_complete!==true)reasons.push("DEPENDENCIES_INCOMPLETE");
  if(!isExamQuestionReuseEligible(candidate))reasons.push("REUSE_RIGHTS_NOT_VERIFIED");
  if(candidate.primary_canonical_kp_id==null||!authority?.units?.some(u=>u.knowledge_points?.some(k=>k.canonical_kp_id===candidate.primary_canonical_kp_id)))reasons.push("AUTHORITY_KP_NOT_FOUND");
  if(candidate.admission_status!=="CERTIFIED_PUBLIC")reasons.push("NOT_CERTIFIED_FOR_PUBLIC");
  return {allowed:reasons.length===0,reasons};
}
export function assertNoUncertifiedQuestions(candidateList,authority){
  if(!Array.isArray(candidateList))throw Error("question list must be an array");
  for(const row of candidateList){
    const result=certificationGate(row,authority);
    if(!result.allowed)throw Error("candidate rejected "+row.candidate_id+": "+result.reasons.join(","));
  }
  return candidateList;
}
