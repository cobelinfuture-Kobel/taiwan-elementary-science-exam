import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";

export const P12_B04_YONGAN_MID9_PATH="../data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json";
export const P12_B04_YONGAN_MID9_SCHEMA="SCIENCE_P12_B04_G04S1_YONGAN_MID9_PUBLIC_V1";
const PDF_SHA="4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe";
const SOURCE_PAPER="SCI_G04_S1_114_MID_001";
const EVIDENCE_REF="data/review/p12-b04-yongan-mid9-science-kp-source-acceptance-v1.json";
const ACCEPTED=new Map([
 ["TF|S01|001",["X","sci_g04s1_03_06"]],
 ["TF|S01|006",["O","sci_g04s1_03_06"]],
 ["TF|S01|008",["O","sci_g04s1_03_06"]],
 ["TF|S01|009",["X","sci_g04s1_02_09"]],
 ["MC|S02|002",["④","sci_g04s1_03_06"]],
 ["MC|S02|006",["③","sci_g04s1_02_09"]],
 ["MC|S02|008",["③","sci_g04s1_02_06"]],
 ["MC|S02|009",["②","sci_g04s1_02_04"]],
 ["MC|S02|010",["①","sci_g04s1_02_07"]]
]);
const fail=(ok,s)=>{if(!ok)throw Error("P12 B04 永安九題驗收失敗："+s);};
const text=x=>typeof x==="string"&&x.trim().length>0;
export function validateAndConvertP12B04YonganMid9(payload,authority){
 assertScorelessMetadata(payload);
 fail(payload?.schema_version===P12_B04_YONGAN_MID9_SCHEMA
   &&payload.public_site_integrated===true&&payload.source_paper_id===SOURCE_PAPER
   &&payload.source_pdf_sha256===PDF_SHA
   &&payload.operator_review_ref===EVIDENCE_REF
   &&payload.original_teacher_answer_key_authenticated===false
   &&payload.source_cropped_images_included===false
   &&payload.expected_blocks===9&&payload.expected_answer_slots===9
   &&Array.isArray(payload.blocks)&&payload.blocks.length===9,"來源或總數");
 const seen=new Set();
 for(const b of payload.blocks){
  const tail=b.source_slot_id?.slice(SOURCE_PAPER.length+1);
  const acceptance=ACCEPTED.get(tail);
  fail(acceptance&&!seen.has(tail)&&b.source_slot_id===SOURCE_PAPER+"|"+tail,"來源身份或重複");
  seen.add(tail);
  fail(text(b.id)&&b.id===`P12_B04_G04S1_YONGAN_MID_${tail.startsWith("TF")?"TF":"MC"}_${tail.slice(-3)}`,"公開ID");
  fail(b.source_id===SOURCE_PAPER&&b.source_pdf_sha256===PDF_SHA
    &&b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1
    &&Array.isArray(b.source_answer_marker_bbox_pts_top_left)
    &&b.source_answer_marker_bbox_pts_top_left.length===4
    &&b.source_answer_marker_bbox_pts_top_left.every(n=>Number.isFinite(n))
    &&b.source_answer_marker_bbox_pts_top_left[0]<b.source_answer_marker_bbox_pts_top_left[2]
    &&b.source_answer_marker_bbox_pts_top_left[1]<b.source_answer_marker_bbox_pts_top_left[3],"PDF來源頁碼或BBox");
  fail(text(b.stem)&&text(b.answer_explanation)&&text(b.answer_assumption)
    &&b.answer===acceptance[0]&&b.canonical_kp_id===acceptance[1]
    &&b.evidence_ref===EVIDENCE_REF,"答案理由或來源KP");
  if(tail.startsWith("TF"))fail(b.type==="tf"&&!('options' in b),"是非題格式");
  else fail(b.type==="mcq"&&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((x,i)=>text(x)&&x.startsWith(["①","②","③","④"][i])),"選項");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1
    &&unit.knowledge_points.some(x=>x.canonical_kp_id===b.canonical_kp_id),"Authority KP");
  fail(b.dependency_review_verified===true
    &&b.original_cropped_assets_included===false
    &&b.original_teacher_answer_key_authenticated===false
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
    &&b.operator_publication_approval===true
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&b.source==="P12_OPERATOR_APPROVED_QUESTION","圖文權利與發布閘");
 }
 fail(seen.size===9,"不足九道");
 return {admission:"P12_B04_G04S1_YONGAN_MID9_CERTIFIED",blocks:payload.blocks,
 answerSlots:9,standaloneTf:4,standaloneChoice:5,contextGroups:0};
}
