import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST47_DONGGUANG_MC1_PATH="../data/question-bank/p12-e01-post47-dongguang-mid-mc1-public-v1.json";
export const P12_E01_POST47_DONGGUANG_MC1_SCHEMA="SCIENCE_P12_E01_POST47_DONGGUANG_MID_MC1_PUBLIC_V1";
const PAPER="SCI_G04_S1_114_MID_008";
const EVIDENCE="data/review/p12-e01-post47-dongguang-stream-lily-source-exact-unique-science-kp-v1.json";
const EXPECTED=["P12_E01_POST47_DONGGUANG_MID_MC_004","SCI_G04_S1_114_MID_008|S02|MC|004","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",[413.23,233.57,455.29,247.61],"進行溪流調查時，比較不可能觀察到下列哪一種水生生物？",["①龜","②蟹","③睡蓮","④蝦"],"③","sci_g04s1_02_02","題目問的是「比較不可能」，不是絕對不可能。龜、蟹和蝦可在溪流環境出現；睡蓮通常適合水流緩慢或靜止的水域，因此在一般溪流調查中相對較不常見。緩流區仍可能有睡蓮，不應解釋成溪流絕不可能看見睡蓮。","4-S1-U02","此題「比較不可能」為一般水域環境的相對比較，而不是聲稱溪流絕不會有睡蓮。答案為模型獨立科學判斷，非原校教師答案鍵。","4"];
const equal=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const gate=(ok,why)=>{if(!ok)throw Error("P12_E01_POST47_DONGGUANG_MC1_FAIL_CLOSED: "+why);};
export function validateAndConvertP12E01Post47DongguangMC1(bank,authority){
 gate(bank?.schema_version===P12_E01_POST47_DONGGUANG_MC1_SCHEMA
   &&bank.public_site_integrated===true
   &&bank.source_paper_id===PAPER
   &&bank.source_pdf_sha256===EXPECTED[2]
   &&bank.expected_blocks===1&&bank.expected_answer_slots===1
   &&bank.expected_standalone_true_false===0&&bank.expected_standalone_choice===1
   &&bank.original_teacher_answer_key_authenticated===false
   &&bank.original_cropped_images_included===false
   &&bank.source_image_geometry_verified==="NATIVE_PDF_TEXT_GLYPH_BBOX_RAW_SHA_RGB_VISUAL"
   &&bank.evidence_ref===EVIDENCE
   &&Array.isArray(bank.blocks)&&bank.blocks.length===1,"immutable source metadata");
 const b=bank.blocks[0];
 gate(b?.id===EXPECTED[0]&&b.source_id===PAPER&&b.source_slot_id===EXPECTED[1],"frozen printed exam and unique student block");
 gate(b.source_pdf_sha256===EXPECTED[2]&&b.source_page_pdf_1_based===1
   &&equal(b.source_pdf_bbox_pts_top_left,EXPECTED[3])
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],
   "original native glyph bounding coordinates");
 gate(b.stem===EXPECTED[4]&&equal(b.options,EXPECTED[5])&&b.answer===EXPECTED[6]
   &&b.canonical_kp_id===EXPECTED[7]&&b.answer_explanation===EXPECTED[8]
   &&b.unit===EXPECTED[9]&&b.answer_assumption===EXPECTED[10]
   &&b.original_question_number===EXPECTED[11],
   "original printed stem, options, unique relative answer and existing KP");
 gate(b.type==="mcq"&&b.grade===4&&b.semester===1
   &&Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i]))
   &&b.answer==="③"&&b.options[2]==="③睡蓮","four-choice original answer");
 const unit=resolveUnit(authority,b.unit);
 gate(unit?.grade===4&&unit.semester===1
   &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id&&k.title==="水域環境條件差異"),
   "direct canonical U02 habitat conditions");
 gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.evidence_ref===EVIDENCE,"source, independent answer and rights release gate");
 return {admission:"P12_E01_POST47_DONGGUANG_MC1_CERTIFIED",blocks:[b],answerSlots:1,standaloneTf:0,standaloneChoice:1,contextGroups:0};
}
