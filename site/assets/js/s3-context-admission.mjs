export const CONTEXT_SCHEMA="SCIENCE_S3_P02_CONTEXT_ADMISSION_V1";
const shaPattern=/^[a-f0-9]{64}$/;
export function validateAtomicContext(group){
 if(!group||typeof group!=="object"||!group.context_group_id||!Array.isArray(group.regions)||group.regions.length===0)throw Error("context missing");
 if(!Array.isArray(group.question_ids)||group.question_ids.length===0)throw Error("context questions missing");
 if(new Set(group.question_ids).size!==group.question_ids.length)throw Error("duplicate question in context");
 const sources=new Set(),parts=new Set();
 for(const reg of group.regions){
  if(!Number.isInteger(reg.source_page_pdf_1_based)||reg.source_page_pdf_1_based<1)throw Error("invalid source page");
  if(!shaPattern.test(reg.source_pdf_sha256)||!shaPattern.test(reg.asset_sha256))throw Error("source or asset hash invalid");
  if(!reg.source_id)throw Error("source id missing");
  if(!Array.isArray(reg.bbox_pdf_pt)||reg.bbox_pdf_pt.length!==4||reg.bbox_pdf_pt.some(x=>!Number.isFinite(x)))throw Error("invalid bbox");
  const [left,top,right,bottom]=reg.bbox_pdf_pt;
  if(left>=right||top>=bottom)throw Error("empty bounding box");
  if(parts.has(reg.part))throw Error("duplicate source region part");
  parts.add(reg.part);sources.add(reg.source_id);
 }
 if(sources.size!==1)throw Error("context crossed unrelated source documents");
 if(group.regions.length>1&&(group.regions.some(x=>!/^PART_[A-Z]$/.test(x.part))||group.regions.length!==parts.size))
   throw Error("multi-region context must have labeled contiguous parts");
 return group;
}
export function contextPublicAdmission(group){
 validateAtomicContext(group);
 const reasons=[];
 if(group.source_visual_review_verified!==true)reasons.push("SOURCE_CONTEXT_REVIEW_PENDING");
 if(group.dependencies_complete!==true)reasons.push("CONTEXT_DEPENDENCIES_INCOMPLETE");
 if(group.answer_review_verified!==true)reasons.push("CONTEXT_ANSWER_REVIEW_PENDING");
 if(group.kp_review_verified!==true)reasons.push("CONTEXT_KP_REVIEW_PENDING");
 if(group.public_reuse_rights_verified!==true)reasons.push("CONTEXT_REUSE_RIGHTS_MISSING");
 if(group.regions.some(x=>x.asset_review_verified!==true))reasons.push("CONTEXT_REGION_REVIEW_PENDING");
 if(group.admission_status!=="CERTIFIED_PUBLIC")reasons.push("CONTEXT_NOT_CERTIFIED_PUBLIC");
 return {allowed:reasons.length===0,reasons};
}
