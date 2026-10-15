/** 全域無配分契約：年級／學年度／題數／PDF 座標不是分數。
 * 歷史原卷原始文字及封存證據保持不變，僅在使用端做無配分投影。
 */
export const GLOBAL_SCORELESS_SOURCE_AUTHORITY="SCIENCE_GLOBAL_NO_SCORING_AUTHORITY_V1";
const SCORING_META=/(?:score|scoring|scored|points?|marks?|weight(?:s|ed|ing)?|rubric|manual_scoring|配分|得分|總分|分數|計分|評分)/iu;
const RESERVED=new Set(["grade","grade_level","academic_year","question_count","answer_slots","original_question_number","source_pdf_bbox_pts_top_left"]);
export function isScoringMetadataKey(key){
 if(RESERVED.has(key))return false;
 return SCORING_META.test(key);
}
export function stripScoringMetadata(value){
 if(Array.isArray(value))return value.map(stripScoringMetadata);
 if(!value||typeof value!=="object")return value;
 return Object.fromEntries(Object.entries(value)
   .filter(([key])=>!isScoringMetadataKey(key))
   .map(([key,v])=>[key,stripScoringMetadata(v)]));
}
export function assertScorelessMetadata(value,path="root"){
 if(Array.isArray(value)){value.forEach((v,i)=>assertScorelessMetadata(v,path+"["+i+"]"));return true;}
 if(!value||typeof value!=="object")return true;
 for(const [key,v] of Object.entries(value)){
  if(isScoringMetadataKey(key))throw Error("全域不允許配分欄位："+path+"."+key);
  assertScorelessMetadata(v,path+"."+key);
 }
 return true;
}
/** Remove only explicitly printed assessment weighting instructions, never conceptual text.
 * Keep untouched original PDF / verbatim source archived separately.
 */
export function removePrintedScoringInstructions(text){
 if(typeof text!=="string")return text;
 return text
  .replace(/[（(]\s*每(?:題|格|答|小題)\s*\d+\s*分\s*[、，,；;]?\s*共\s*\d+\s*分\s*[)）]/gu,"")
  .replace(/[（(]\s*(?:每(?:題|格|答|小題)\s*\d+\s*分|共\s*\d+\s*分)\s*[)）]/gu,"")
  .replace(/(?:每(?:題|格|答|小題)\s*\d+\s*分\s*[、，,；;]?\s*)?共\s*\d+\s*分[。．、，,；;]?/gu,"")
  .replace(/每(?:題|格|答|小題)\s*\d+\s*分[。．、，,；;]?/gu,"")
  .replace(/[ \t]{2,}/gu," ");
}
/** Source archive inputs are read-only; return a detached, non-scored question projection. */
export function sourceQuestionContentOnly(record){
 const safe=stripScoringMetadata(record);
 for(const key of ["full_original_stem","original_parent_prompt","original_item_stem","stem","shared_instructions"]){
  if(typeof safe[key]==="string")safe[key]=removePrintedScoringInstructions(safe[key]);
 }
 assertScorelessMetadata(safe);
 return safe;
}
