import {resolveUnit,validateAuthority} from "./authority-adapter.mjs";
export const P12_E01_POST46_ANHE_WIND1_PATH="../data/question-bank/p12-e01-post46-anhe-wind1-public-v1.json";
export const P12_E01_POST46_ANHE_WIND1_SCHEMA="SCIENCE_P12_E01_POST46_ANHE_WIND1_PUBLIC_V1";
const EVIDENCE="data/review/p12-e01-post46-anhe-wind-original-pdf-science-r4-bbox-formal-acceptance-v1.json";
const expected={"id":"P12_E01_POST46_ANHE_MID_WIND_TF_004","source_id":"SCI_G04_S1_114_MID_006","source_slot_id":"SCI_G04_S1_114_MID_006|S01|TF|004","source_pdf_sha256":"f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb","source_page_pdf_1_based":1,"source_pdf_bbox_pts_top_left":[33.6,317.72,61.46,331.64],"original_question_number":"004","grade":4,"semester":1,"unit":"4-S1-U01","canonical_kp_id":"sci_g04s1_01_12","type":"tf","stem":"風力的作用與流水一樣，作用力越強，顆粒越小的物質會移動得越遠。","answer":"O","answer_explanation":"在同類、乾燥、可比較的鬆散地表物質實驗中，風和流水都能搬運並堆積顆粒；作用較強時通常能搬運較多或較遠，較細小顆粒一般較容易移動得遠，因此依四年級實驗概念判為○。實際搬運還受土壤含水量、顆粒密度與凝聚程度、風向及障礙物等影響，不能解讀成所有條件下顆粒越小必定越遠。","answer_assumption":"以課本常見的礫石、沙、土壤比較實驗與可比較的乾燥條件判讀；一般趨勢而非無條件物理定律。模型獨立科學判答，不是原校教師核定答案。","source":"P12_OPERATOR_APPROVED_QUESTION","certification_status":"OPERATOR_APPROVED_PUBLIC","operator_publication_approval":true,"original_teacher_answer_key_authenticated":false,"original_cropped_assets_included":false,"dependency_review_verified":true,"copyright_path":"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","evidence_ref":"data/review/p12-e01-post46-anhe-wind-original-pdf-science-r4-bbox-formal-acceptance-v1.json"};
const fail=(ok,what)=>{if(!ok)throw Error("P12_E01_POST46_ANHE_WIND1_FAIL_CLOSED: "+what)};
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
export function validateAndConvertP12E01Post46AnheWind1(value,authority){
fail(value?.schema_version===P12_E01_POST46_ANHE_WIND1_SCHEMA &&
 value.public_site_integrated===true&&value.expected_blocks===1 &&
 value.expected_answer_slots===1&&value.expected_standalone_true_false===1 &&
 value.expected_standalone_choice===0&&value.expected_context_groups===0 &&
 value.original_teacher_answer_key_authenticated===false &&
 value.original_cropped_images_included===false &&
 value.original_frozen47_exceptions_immutable===true &&
 value.existing_629_answer_slots_preserved===true &&
 value.evidence_ref===EVIDENCE&&Array.isArray(value.blocks)&&value.blocks.length===1,"metadata");
const b=value.blocks[0];
fail(same(b,expected),"immutable source exact stem, science answer, original bbox, provenance, rights and identity");
fail(authority?.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3","R5 V3 active authority required");
validateAuthority(authority);
const unit=resolveUnit(authority,b.unit);
fail(unit?.grade===4&&unit.semester===1 &&
 unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),
 "actual R4 additive wind KP in 190-KP selector");
return {admission:"P12_E01_POST46_ANHE_WIND1_CERTIFIED",blocks:value.blocks,
 answerSlots:1,standaloneTf:1,standaloneChoice:0,contextGroups:0};
}
