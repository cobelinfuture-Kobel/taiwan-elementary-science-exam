import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_TAOZIJIAO_FINAL_REMAINING8_PATH="../data/question-bank/p12-g04s1-113-taozijiao-final-remaining8-public-v1.json";
export const P12_113_TAOZIJIAO_FINAL_REMAINING8_SCHEMA="SCIENCE_P12_G04S1_113_TAOZIJIAO_FINAL_REMAINING8_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-taozijiao-final-remaining8-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G01_001","a41df9a1557300fd"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G01_002","acae997f78d2f62b"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G01_007","0edae215417d82ef"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G04_001","bee654db447361df"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G04_003","1096525a7d8435a6"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G04_006","6f687e132f4db39a"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G05_005","ada8e9416b93dda6"],["P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING_TF_G06_003","fd11cbc94e326526"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_TAOZIJIAO_REMAINING8_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113TaizijiaoRemaining8(doc,authority){
 fail(doc?.schema_version===P12_113_TAOZIJIAO_FINAL_REMAINING8_SCHEMA&&doc.public_site_integrated===true
  &&doc.expected_blocks===8&&doc.expected_answer_slots===8&&doc.expected_standalone_true_false===8&&doc.expected_standalone_choice===0
  &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="ORIGINAL_PDF_RAWDICT_EXACT_BRACKET_GLYPH_BBOX"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===8,"source certified header");
 const sourceIDs=new Set(),questionIDs=new Set();
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!sourceIDs.has(b.source_slot_id)&&!questionIDs.has(b.id),"published identities cannot overlap");
  sourceIDs.add(b.source_slot_id);questionIDs.add(b.id);
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"science/KP/source/text/bbox/rights immutable");
  fail(b.type==="tf"&&b.grade===4&&b.semester===1&&b.unit==="4-S1-U03"&&b.source_page_pdf_1_based===1
     &&["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"original independent TF source");
  fail(b.source_id==="SCI_G04_S1_113_FINAL_008"&&b.source_pdf_sha256==="59a1b5ee713f6cc96e47f1db1c9111918f67c6fd9bacecd64c9ad56a16db6ed3","frozen original PDF");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
     &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
     &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights and operator");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen direct canonical KP");
 }
 fail(sourceIDs.size===8,"unique source count");
 return {admission:"P12_113_G04S1_TAOZIJIAO_FINAL_REMAINING8_CERTIFIED",blocks:doc.blocks,answerSlots:8,standaloneTf:8,standaloneChoice:0,contextGroups:0};
}
