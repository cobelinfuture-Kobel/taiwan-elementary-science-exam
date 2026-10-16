import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST47_DONGGUANG1_PATH="../data/question-bank/p12-e01-post47-dongguang1-public-v1.json";
export const P12_E01_POST47_DONGGUANG1_SCHEMA="SCIENCE_P12_E01_POST47_DONGGUANG1_PUBLIC_V1";
const expected={"id":"P12_E01_POST47_DONGGUANG_MID_MC_004","source_id":"SCI_G04_S1_114_MID_008","source_slot_id":"SCI_G04_S1_114_MID_008|S02|MC|004","source_pdf_sha256":"0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7","source_page_pdf_1_based":1,"source_pdf_bbox_pts_top_left":[413.23,233.57,455.29,247.61],"original_question_number":"004","grade":4,"semester":1,"unit":"4-S1-U02","canonical_kp_id":"sci_g04s1_02_02","type":"mcq","stem":"進行溪流調查時，比較不可能觀察到下列哪一種水生生物？","options":["①龜","②蟹","③睡蓮","④蝦"],"answer":"③","answer_explanation":"一般溪流的水流通常較急；龜、蟹、蝦可在溪流環境出現，睡蓮多生長於靜水或緩流水域，因此本題在「比較不可能」的相對語意下選③。緩流區仍可能有睡蓮，不能解讀為溪流絕不會有睡蓮。","answer_assumption":"依一般溪流環境的相對可能性進行模型獨立科學判讀，非原校教師答案；緩流區可能發現睡蓮。","source":"P12_OPERATOR_APPROVED_QUESTION","certification_status":"OPERATOR_APPROVED_PUBLIC","operator_publication_approval":true,"original_teacher_answer_key_authenticated":false,"original_cropped_assets_included":false,"dependency_review_verified":true,"copyright_path":"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","evidence_ref":"data/review/p12-e01-post47-dongguang1-formal-source-science-kp-acceptance-v1.json"};
const EVIDENCE="data/review/p12-e01-post47-dongguang1-formal-source-science-kp-acceptance-v1.json";
const fail=(ok,label)=>{if(!ok)throw Error("P12_E01_POST47_DONGGUANG1_FAIL_CLOSED: "+label)};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validateAndConvertP12E01Post47Dongguang1(v,authority){
fail(v?.schema_version===P12_E01_POST47_DONGGUANG1_SCHEMA&&v.public_site_integrated===true&&v.expected_blocks===1&&v.expected_answer_slots===1&&v.expected_standalone_true_false===0&&v.expected_standalone_choice===1&&v.original_teacher_answer_key_authenticated===false&&v.original_cropped_images_included===false&&v.evidence_ref===EVIDENCE&&Array.isArray(v.blocks)&&v.blocks.length===1,"header");
const b=v.blocks[0];fail(eq(b,expected),"exact original source, unique science answer, bounding box, rights or KP contract");
const unit=resolveUnit(authority,b.unit);
fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen compatible canonical KP");
return {admission:"P12_E01_POST47_DONGGUANG1_CERTIFIED",blocks:v.blocks,answerSlots:1,standaloneTf:0,standaloneChoice:1,contextGroups:0};
}
