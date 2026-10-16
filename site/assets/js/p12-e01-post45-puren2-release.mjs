import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST45_PUREN2_PATH="../data/question-bank/p12-e01-post45-puren2-public-v1.json";
export const P12_E01_POST45_PUREN2_SCHEMA="SCIENCE_P12_E01_POST45_PUREN2_PUBLIC_V1";
const EVIDENCE="data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json";
const expected=[{"id":"P12_E01_POST45_PUREN_MID_MC_013","source_id":"SCI_G04_S1_114_MID_009","source_slot_id":"SCI_G04_S1_114_MID_009|S1|MC|013","source_pdf_sha256":"6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351","source_page_pdf_1_based":1,"source_pdf_bbox_pts_top_left":[391.875,92.5,427.5,114.375],"original_question_number":"013","grade":4,"semester":1,"unit":"4-S1-U01","canonical_kp_id":"sci_g04s1_01_03","type":"mcq","stem":"用手觸摸岩石、沙和土壤，下列哪一個是正確的？","answer":"④","answer_explanation":"比較常見的岩石、沙與土壤樣本，土壤顆粒通常較細、觸感較柔軟，岩石較硬、沙較粗糙，因此④最符合原題要求；實際土質有差異，不視為所有土壤都相同。","answer_assumption":"模型獨立科學判讀，非原校教師答案；依國小四上教材常見的岩石、沙、土壤比較樣本判斷，個別土樣實際觸感會受組成及含水量影響。","source":"P12_OPERATOR_APPROVED_QUESTION","certification_status":"OPERATOR_APPROVED_PUBLIC","operator_publication_approval":true,"original_teacher_answer_key_authenticated":false,"original_cropped_assets_included":false,"dependency_review_verified":true,"copyright_path":"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","evidence_ref":"data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json","source_bbox_raster_proof_ref":"data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json","options":["①岩石摸起來粗粗的、軟軟的","②沙摸起來細細的、軟軟的","③岩石、沙和土壤摸起來的感覺相同","④土壤摸起來細細的、軟軟的"]},{"id":"P12_E01_POST45_PUREN_MID_TF_005","source_id":"SCI_G04_S1_114_MID_009","source_slot_id":"SCI_G04_S1_114_MID_009|S3|G01|005","source_pdf_sha256":"6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351","source_page_pdf_1_based":2,"source_pdf_bbox_pts_top_left":[38.125,761.25,78.125,780],"original_question_number":"005","grade":4,"semester":1,"unit":"4-S1-U01","canonical_kp_id":"sci_g04s1_01_10","type":"tf","stem":"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n地震發生時可以大聲尖叫，舒緩緊張。","answer":"X","answer_explanation":"地震時應保持警覺、就地趴下、掩護、穩住，不能把大聲尖叫當成建議的防震應變方法，因此原句為錯誤。","answer_assumption":"模型獨立科學判讀，非原校教師答案；依地震避難教學指引判為錯誤。","source":"P12_OPERATOR_APPROVED_QUESTION","certification_status":"OPERATOR_APPROVED_PUBLIC","operator_publication_approval":true,"original_teacher_answer_key_authenticated":false,"original_cropped_assets_included":false,"dependency_review_verified":true,"copyright_path":"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","evidence_ref":"data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json","source_bbox_raster_proof_ref":"data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json"}];
const gate=(ok,description)=>{if(!ok)throw Error("P12_E01_POST45_PUREN2_FAIL_CLOSED: "+description)};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validateAndConvertP12E01Post45Puren2(value,authority){
 gate(value?.schema_version===P12_E01_POST45_PUREN2_SCHEMA &&
  value.public_site_integrated===true&&value.source_paper_id==="SCI_G04_S1_114_MID_009"&&
  value.source_pdf_sha256==="6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351"&&
  value.expected_blocks===2&&value.expected_answer_slots===2&&
  value.expected_standalone_true_false===1&&value.expected_standalone_choice===1&&
  value.expected_context_groups===0&&value.original_teacher_answer_key_authenticated===false&&
  value.original_cropped_images_included===false&&
  value.source_image_geometry_verified==="DIRECT_RASTER_PIXEL_BBOX_MANUAL_VISUAL"&&
  value.evidence_ref===EVIDENCE&&Array.isArray(value.blocks)&&value.blocks.length===2,"header");
 gate(equal(value.blocks,expected),"exact original paper stem/option/source ID/answer/KP/geometry/rights and original order");
 const ids=new Set(),positions=new Set();
 for(const b of value.blocks){
  gate(!ids.has(b.id)&&!positions.has(b.source_slot_id),"duplicate ID/source position");
  ids.add(b.id);positions.add(b.source_slot_id);
  const u=resolveUnit(authority,b.unit);
  gate(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),
   "direct existing canonical KP");
 }
 gate(new Set(value.blocks.map(b=>b.type)).size===2,"one MC and one TF");
 return {admission:"P12_E01_POST45_PUREN2_CERTIFIED",blocks:value.blocks,
  answerSlots:2,standaloneTf:1,standaloneChoice:1,contextGroups:0};
}
