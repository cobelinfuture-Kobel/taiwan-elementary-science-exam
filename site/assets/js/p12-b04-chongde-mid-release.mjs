import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_CHONGDE_MID6_PATH="../data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json";
export const P12_B04_CHONGDE_MID6_SCHEMA="SCIENCE_P12_B04_G04S1_CHONGDE_MID6_PUBLIC_V1";
const source="SCI_G04_S1_114_MID_003";
const sha="90967222348a95719ee1263240e5ae943e9d4f4d4cc15b7ea576191d0f618335";
const review="data/review/p12-b04-chongde-mid6-science-kp-source-acceptance-v1.json";
const accepted=new Map([
 ["S01|TF|001",["X","sci_g04s1_03_06"]],
 ["S01|TF|006",["O","sci_g04s1_02_09"]],
 ["S01|TF|008",["O","sci_g04s1_02_11"]],
 ["S02|MC|003",["①","sci_g04s1_03_06"]],
 ["S02|MC|007",["①","sci_g04s1_02_07"]],
 ["S02|MC|008",["④","sci_g04s1_02_08"]]
]);
const check=(v,s)=>{if(!v)throw Error("P12 B04 崇德六題未通過："+s);};
const text=x=>typeof x==="string"&&x.trim();
export function validateAndConvertP12B04ChongdeMid6(payload,authority){
 assertScorelessMetadata(payload);
 check(payload?.schema_version===P12_B04_CHONGDE_MID6_SCHEMA&&payload.public_site_integrated===true
  &&payload.source_paper_id===source&&payload.source_pdf_sha256===sha
  &&payload.operator_review_ref===review&&payload.expected_blocks===6
  &&payload.expected_answer_slots===6&&payload.original_teacher_answer_key_authenticated===false
  &&payload.source_cropped_images_included===false
  &&Array.isArray(payload.blocks)&&payload.blocks.length===6,"原卷版本或數量");
 const seen=new Set(),ids=new Set();
 for(const b of payload.blocks){
  const slot=b.source_slot_id?.slice(source.length+1);
  const truth=accepted.get(slot),kind=slot?.includes("|TF|")?"TF":"MC";
  check(truth&&!seen.has(slot)&&b.source_slot_id===source+"|"+slot
   &&b.id===`P12_B04_G04S1_CHONGDE_MID_${kind}_${slot.slice(-3)}`
   &&!ids.has(b.id),"題號／來源身份");
  seen.add(slot);ids.add(b.id);
  check(b.source_id===source&&b.source_pdf_sha256===sha
   &&b.source_page_pdf_1_based===1&&Array.isArray(b.source_pdf_bbox_pts_top_left)
   &&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(n=>Number.isFinite(n))
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"來源 PDF");
  check(b.answer===truth[0]&&b.canonical_kp_id===truth[1]
   &&text(b.stem)&&text(b.answer_explanation)&&text(b.answer_assumption)
   &&b.evidence_ref===review,"科學答案或KP證據");
  if(kind==="TF")check(b.type==="tf"&&!('options' in b),"是非型式");
  else check(b.type==="mcq"&&Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((x,i)=>text(x)&&x.startsWith(["①","②","③","④"][i])),"選項完整");
  const unit=resolveUnit(authority,b.unit);
  check(unit?.grade===4&&unit.semester===1
   &&unit.knowledge_points.some(x=>x.canonical_kp_id===b.canonical_kp_id),"KP Authority");
  check(b.dependency_review_verified===true&&b.original_cropped_assets_included===false
   &&b.original_teacher_answer_key_authenticated===false
   &&b.operator_publication_approval===true
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","發布／圖文依賴");
 }
 check(seen.size===6&&!seen.has("S02|MC|002"),"不得重複收錄荷花同題");
 return {admission:"P12_B04_G04S1_CHONGDE_MID6_CERTIFIED",blocks:payload.blocks,
 answerSlots:6,standaloneTf:3,standaloneChoice:3,contextGroups:0};
}
