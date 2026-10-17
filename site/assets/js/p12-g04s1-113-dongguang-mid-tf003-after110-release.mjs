import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_DONGGUANG_TF003_PATH="../data/question-bank/p12-g04s1-113-dongguang-mid-tf003-after110-public-v1.json";
export const P12_113_DONGGUANG_TF003_SCHEMA="SCIENCE_P12_113_DONGGUANG_MID_TF003_AFTER110_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-dongguang-mid-tf003-after110-exact-source-science-kp-v1.json";
const EXPECTED_FINGERPRINT="5026ffe3a8a20808";
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(pass,message)=>{if(!pass)throw Error("P12_113_DONGGUANG_TF003_FAIL_CLOSED: "+message);};
export function validateAndConvertP12113DongguangTF003(doc,authority){
 fail(doc?.schema_version===P12_113_DONGGUANG_TF003_SCHEMA&&doc.public_site_integrated===true
  &&doc.expected_blocks===1&&doc.expected_answer_slots===1
  &&doc.expected_standalone_true_false===1&&doc.expected_standalone_choice===0
  &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="NATIVE_PDF_RAWDICT_PRINTED_BRACKET_SHA256_VERIFIED"
  &&doc.evidence_ref===EVIDENCE&&doc.blocks?.length===1,"immutable one original slot header");
 const b=doc.blocks[0];
 fail(b.id==="P12_113_G04S1_DONGGUANG_MID_TF_003"&&b.source_id==="SCI_G04_S1_113_MID_004"
  &&b.source_slot_id==="SCI_G04_S1_113_MID_004|S02|TF|003"
  &&b.source_pdf_sha256==="2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5","exact source slot SHA");
 fail(fingerprint(JSON.stringify(b))===EXPECTED_FINGERPRINT,"immutable original source stem, science answer, geometry, KP, rights");
 fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.source_page_pdf_1_based===1
  &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
  &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"native original PDF page and bbox");
 fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
  &&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
  &&b.evidence_ref===EVIDENCE,"existing operator rights & evidence");
 fail(b.type==="tf"&&b.answer==="X"&&!Object.hasOwn(b,"options"),"original TF science unique answer");
 const unit=resolveUnit(authority,b.unit);
 fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"direct frozen 113 48KP");
 return {admission:"P12_113_G04S1_DONGGUANG_TF003_AFTER110",blocks:[b],answerSlots:1,standaloneTf:1,standaloneChoice:0,contextGroups:0};
}
