import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_SELECTIVE27_PATH="../data/question-bank/p12-g04s1-113-selective27-public-v1.json";
export const P12_113_SELECTIVE27_SCHEMA="SCIENCE_P12_G04S1_113_SELECTIVE27_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-selective27-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_JIANDE_TF_001","b41983452aa513ec"],["P12_113_G04S1_JIANDE_TF_002","3e7e19e1eebded02"],["P12_113_G04S1_JIANDE_TF_003","e3a8b2d36fbe90af"],["P12_113_G04S1_JIANDE_TF_004","476f2c5fbf8515fd"],["P12_113_G04S1_JIANDE_TF_007","618cbbba121de327"],["P12_113_G04S1_JIANDE_TF_008","c33301d232e49d6f"],["P12_113_G04S1_JIANDE_TF_009","41fa1f46c14b6da9"],["P12_113_G04S1_JIANDE_MC_001","a8cfd307700af86e"],["P12_113_G04S1_JIANDE_MC_002","27178fe04155cff5"],["P12_113_G04S1_JIANDE_MC_003","41b78294e27e5f17"],["P12_113_G04S1_JIANDE_MC_005","ce80a49d4471e459"],["P12_113_G04S1_JIANDE_MC_006","4c0dbf365fd87bc4"],["P12_113_G04S1_LUSHANG_TF_003","03bd7e879e1c1d73"],["P12_113_G04S1_LUSHANG_TF_006","b71e808667535317"],["P12_113_G04S1_LUSHANG_MC_002","2c5e5aa2f241db36"],["P12_113_G04S1_LUSHANG_MC_004","430ca5010c45bcc3"],["P12_113_G04S1_LUSHANG_MC_005","179d99ddfad30a6a"],["P12_113_G04S1_LUSHANG_MC_006","0fa6a32499b70da6"],["P12_113_G04S1_LUSHANG_MC_009","3b8b4af1c108645a"],["P12_113_G04S1_DADUN_TF_003","1aaaa55276833b66"],["P12_113_G04S1_DADUN_TF_005","3b2638395718fe07"],["P12_113_G04S1_DADUN_TF_009","466dde26b5be17c4"],["P12_113_G04S1_DADUN_TF_012","f6393134e9fdef99"],["P12_113_G04S1_DADUN_TF_014","4486e262b0b93f79"],["P12_113_G04S1_DADUN_MC_002","756742b8a39aab80"],["P12_113_G04S1_DADUN_MC_004","150a8276edabff7f"],["P12_113_G04S1_DADUN_MC_012","b74bee397014437f"]]);
const MASK=(1n<<64n)-1n;
const fp=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0")};
const fail=(condition,reason)=>{if(!condition)throw Error("P12_113_SELECTIVE27_FAIL_CLOSED: "+reason)};
export function validateAndConvertP12113Selective27(doc,authority){
  fail(doc?.schema_version===P12_113_SELECTIVE27_SCHEMA
    &&doc.public_site_integrated===true&&doc.expected_blocks===27
    &&doc.expected_answer_slots===27&&doc.expected_standalone_true_false===14
    &&doc.expected_standalone_choice===13
    &&doc.original_teacher_answer_key_authenticated===false
    &&doc.original_cropped_images_included===false
    &&doc.source_image_geometry_verified==="NATIVE_PDF_GLYPH_BBOX_SHA256_AND_MODEL_QA"
    &&doc.evidence_ref===EVIDENCE
    &&Array.isArray(doc.blocks)&&doc.blocks.length===27,"frozen header");
  const seen=new Set();let tf=0,choice=0;
  for(const b of doc.blocks){
    fail(b&&typeof b.id==="string"&&!seen.has(b.id)&&EXPECTED.has(b.id),"unique approved id");
    seen.add(b.id);
    fail(fp(JSON.stringify(b))===EXPECTED.get(b.id),"immutable original/answer/KP/BBox/rights exact content");
    fail(b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1,"grade term and source page");
    fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
      &&b.original_teacher_answer_key_authenticated===false
      &&b.original_cropped_assets_included===false
      &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","source rights and operator authorization");
    const unit=resolveUnit(authority,b.unit);
    fail(unit?.grade===4&&unit?.semester===1
      &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen current 48KP authority");
    if(b.type==="tf"){fail((b.answer==="O"||b.answer==="X")&&!Object.hasOwn(b,"options"),"true-false answer");tf++;}
    else if(b.type==="mcq"){fail(["①","②","③","④"].includes(b.answer)
      &&Array.isArray(b.options)&&b.options.length===4
      &&b.options.every((x,i)=>typeof x==="string"&&x.startsWith(["①","②","③","④"][i])),"complete four choices");choice++;}
    else fail(false,"unsupported question type");
  }
  fail(tf===14&&choice===13&&seen.size===27,"release counts");
  return {admission:"P12_113_G04S1_SELECTIVE27_CERTIFIED",blocks:doc.blocks,answerSlots:27,standaloneTf:14,standaloneChoice:13,contextGroups:0};
}
