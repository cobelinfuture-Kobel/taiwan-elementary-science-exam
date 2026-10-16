import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_MID11_PATH="../data/question-bank/p12-g04s1-113-mid11-selective-public-v1.json";
export const P12_113_MID11_SCHEMA="SCIENCE_P12_G04S1_113_MID11_SELECTIVE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-mid11-selective-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_ANHE_MID_MC_007","1edf62891f80cc8a"],["P12_113_G04S1_ANHE_MID_MC_009","7307b04e66c8368a"],["P12_113_G04S1_ANHE_MID_MC_012","1e62697a83680ed7"],["P12_113_G04S1_ANHE_MID_MC_013","9af2b619f29a89be"],["P12_113_G04S1_ANHE_MID_MC_014","e4091c3f60167f90"],["P12_113_G04S1_MINGYI_MID_MC_004","76f6cae9c3698067"],["P12_113_G04S1_MINGYI_MID_MC_007","b11aa04150468667"],["P12_113_G04S1_MINGYI_MID_MC_009","09ed4d241a81d3c7"],["P12_113_G04S1_GUANGXING_MID_MC_002","868131aaea4c40a2"],["P12_113_G04S1_GUANGXING_MID_MC_006","d84e71a5844774b3"],["P12_113_G04S1_GUANGXING_MID_MC_008","9b478d1847ada002"]]);
const MASK=(1n<<64n)-1n;
const fp=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_MID11_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113Mid11(doc,authority){
  fail(doc?.schema_version===P12_113_MID11_SCHEMA&&doc.public_site_integrated===true
    &&doc.expected_blocks===11&&doc.expected_answer_slots===11&&doc.expected_standalone_true_false===0
    &&doc.expected_standalone_choice===11&&doc.original_teacher_answer_key_authenticated===false
    &&doc.original_cropped_images_included===false&&doc.source_image_geometry_verified==="NATIVE_PDF_GLYPH_BBOX_SHA256_AND_MODEL_QA"
    &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===11,"header");
  let seen=new Set(),slots=new Set();
  for(const b of doc.blocks){
    fail(b&&EXPECTED.has(b.id)&&!seen.has(b.id)&&!slots.has(b.source_slot_id),"unique source and certified id");
    seen.add(b.id);slots.add(b.source_slot_id);
    fail(fp(JSON.stringify(b))===EXPECTED.get(b.id),"immutable stem/options/answer/source/BBox/KP/rights");
    fail(b.type==="mcq"&&b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1
      &&Array.isArray(b.options)&&b.options.length===4
      &&b.options.every((x,i)=>typeof x==="string"&&x.startsWith(["①","②","③","④"][i]))
      &&["①","②","③","④"].includes(b.answer),"four-option source original");
    fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
      &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
      &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights and operator gate");
    const unit=resolveUnit(authority,b.unit);
    fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen KP");
  }
  fail(seen.size===11,"count");
  return {admission:"P12_113_G04S1_MID11_CERTIFIED",blocks:doc.blocks,answerSlots:11,standaloneTf:0,standaloneChoice:11,contextGroups:0};
}
