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
  if(candidate.answer_evidence_status!==EVIDENCE_STATES.VERIFIED||candidate.answer_review_verified!==true||candidate.answer_normalized==null)
    reasons.push("ANSWER_UNVERIFIED");
  if(candidate.source_visual_review_verified!==true)reasons.push("SOURCE_VISUAL_REVIEW_PENDING");
  if(candidate.kp_review_verified!==true||candidate.mapping_status!=="KP_CERTIFIED")reasons.push("KP_REVIEW_PENDING");
  if(candidate.dependency_review_verified!==true||candidate.assets_complete!==true)reasons.push("DEPENDENCIES_INCOMPLETE");
  if(candidate.license_status!=="PUBLIC_REUSE_AUTHORIZED")reasons.push("REUSE_RIGHTS_NOT_VERIFIED");
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
