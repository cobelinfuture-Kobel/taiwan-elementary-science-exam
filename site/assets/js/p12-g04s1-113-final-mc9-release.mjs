import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_FINAL_MC9_PATH="../data/question-bank/p12-g04s1-113-final-mc9-selective-public-v1.json";
export const P12_113_FINAL_MC9_SCHEMA="SCIENCE_P12_G04S1_113_FINAL_MC9_SELECTIVE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-final-mc9-selective-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_ANHE_FINAL_MC_001","77ec808cd9115411"],["P12_113_G04S1_ANHE_FINAL_MC_006","de601015f114f878"],["P12_113_G04S1_MINGYI_FINAL_MC_005","a664f737e1f615df"],["P12_113_G04S1_MINGYI_FINAL_MC_007","a6b92d72f5abd71a"],["P12_113_G04S1_MINGYI_FINAL_MC_008","a7558ab58a026c92"],["P12_113_G04S1_MINGYI_FINAL_MC_010","0a39a7c00a496d2c"],["P12_113_G04S1_YONGAN_FINAL_MC_003","abbad6ae531675c7"],["P12_113_G04S1_YONGAN_FINAL_MC_006","0dc568bbe565d7e5"],["P12_113_G04S1_YONGAN_FINAL_MC_008","b3c0b42c07db7343"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_FINAL_MC9_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113FinalMC9(doc,authority){
 fail(doc?.schema_version===P12_113_FINAL_MC9_SCHEMA&&doc.public_site_integrated===true
 &&doc.expected_blocks===9&&doc.expected_answer_slots===9&&doc.expected_standalone_true_false===0&&doc.expected_standalone_choice===9
 &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="NATIVE_PDF_GLYPH_BBOX_SHA256_AND_MODEL_QA"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===9,"frozen header");
 const seen=new Set(),slots=new Set();
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!seen.has(b.id)&&!slots.has(b.source_slot_id),"unique source/admission");
  seen.add(b.id);slots.add(b.source_slot_id);
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"original scientific answer KP source options bbox rights");
  fail(b.type==="mcq"&&b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1
  &&Array.isArray(b.options)&&b.options.length===4&&b.options.every((o,i)=>typeof o==="string"&&o.startsWith(["①","②","③","④"][i]))
  &&["①","②","③","④"].includes(b.answer),"source options");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
  &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
  &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights/operator");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen direct KP");
 }
 fail(seen.size===9,"count");
 return {admission:"P12_113_G04S1_FINAL_MC9_CERTIFIED",blocks:doc.blocks,answerSlots:9,standaloneTf:0,standaloneChoice:9,contextGroups:0};
}
