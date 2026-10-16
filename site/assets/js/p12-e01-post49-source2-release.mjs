import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST49_SOURCE2_PATH="../data/question-bank/p12-e01-post49-source2-public-v1.json";
export const P12_E01_POST49_SOURCE2_SCHEMA="SCIENCE_P12_E01_POST49_SOURCE2_PUBLIC_V1";
const EVIDENCE="data/review/p12-e01-post49-mingyi-taozijiao-two-source-exact-science-kp-acceptance-v1.json";
const EXPECTED=new Map([["SCI_G04_S1_114_MID_007|S01|TF|003",["P12_E01_POST49_MINGYI_MID_TF_003","X","sci_g04s1_01_05","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",1,[54.6,267.65,108.39,281.69],"著名的地形景觀「風吹砂」，代表只有風會改變墾丁國家公園海邊沙丘的樣貌，雨水不會。","單純排除雨水影響的全稱斷言為錯；降雨形成地表逕流，能搬運沙土，與流水搬運地表物質的 KP 直接相關。","4-S1-U01"]],["SCI_G04_S1_114_FINAL_012|Q06|001",["P12_E01_POST49_TAOZIJIAO_FINAL_TF_001","O","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",1,[388.18,302.93,416.03,317.88],"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n萬花筒能看到對稱圖案，是因為光的反射。","萬花筒利用鏡面多次反射光線產生對稱或重複圖案，屬於光的反射與方向改變；不同於原提案的生活反光器材 KP 判讀。","4-S1-U03"]]]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(ok,label)=>{if(!ok)throw Error("P12_E01_POST49_SOURCE2_FAIL_CLOSED: "+label);};
export function validateAndConvertP12E01Post49Source2(bank,authority){
 gate(bank?.schema_version===P12_E01_POST49_SOURCE2_SCHEMA
  &&bank.public_site_integrated===true
  &&bank.expected_blocks===2&&bank.expected_answer_slots===2
  &&bank.expected_standalone_true_false===2&&bank.expected_standalone_choice===0
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false
  &&bank.source_image_geometry_verified==="TWO_SHA_VERIFIED_NATIVE_TEXT_PDF_GLYPH_BBOX_AND_RASTER"
  &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===2,"immutable metadata");
 let tf=0;const sourceIDs=new Set(),publicIDs=new Set(),stems=new Set();
 for(const b of bank.blocks){
  const known=EXPECTED.get(b.source_slot_id);
  gate(known&&!sourceIDs.has(b.source_slot_id),"allowed original source ID");
  sourceIDs.add(b.source_slot_id);
  gate(b.id===known[0]&&!publicIDs.has(b.id),"public ID");publicIDs.add(b.id);
  gate(b.source_id===b.source_slot_id.split("|")[0]
   &&b.source_pdf_sha256===known[3]
   &&b.source_page_pdf_1_based===known[4]
   &&eq(b.source_pdf_bbox_pts_top_left,known[5])
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)
   &&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"source original native PDF glyph bbox and SHA");
  gate(b.stem===known[6]&&b.answer===known[1]
   &&b.canonical_kp_id===known[2]&&b.unit===known[8]
   &&b.answer_explanation===known[7]
   &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"unchanged student scoreless text, model science answer and KP");
  gate(!stems.has(b.stem),"printed stem duplicate");stems.add(b.stem);
  const unit=resolveUnit(authority,b.unit);
  gate(unit?.grade===4&&unit?.semester===1
   &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"existing canonical KP title and semester");
  tf++;gate(b.type==="tf"&&["O","X"].includes(b.answer)&&!("options" in b),"two original standalone true-false");
  gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.operator_publication_approval===true&&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.evidence_ref===EVIDENCE,"rights evidence and publication governance");
 }
 gate(sourceIDs.size===2&&publicIDs.size===2&&stems.size===2&&tf===2,"exact 2 unique source positions");
 return {admission:"P12_E01_POST49_SOURCE2_CERTIFIED",blocks:bank.blocks,answerSlots:2,standaloneTf:2,standaloneChoice:0,contextGroups:0};
}
