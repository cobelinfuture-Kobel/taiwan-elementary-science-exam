import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_DONGGUANG_MID_NATIVE4_PATH="../data/question-bank/p12-g04s1-113-dongguang-mid-native4-after105-public-v1.json";
export const P12_113_DONGGUANG_MID_NATIVE4_SCHEMA="SCIENCE_P12_G04S1_113_DONGGUANG_MID_NATIVE4_AFTER105_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-dongguang-mid-native4-after105-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_DONGGUANG_MID_TF_002","857880403ca3fdc8"],["P12_113_G04S1_DONGGUANG_MID_TF_003","9c05dfcd64304306"],["P12_113_G04S1_DONGGUANG_MID_TF_012","83d08e2ec0067a25"],["P12_113_G04S1_DONGGUANG_MID_TF_015","7049af7ac83de0c7"]]);
const SOURCE_ID="SCI_G04_S1_113_MID_004";
const SOURCE_SHA="2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5";
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_DONGGUANG_MID_NATIVE4_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113DongguangMIDNative4(doc,authority){
 fail(doc?.schema_version===P12_113_DONGGUANG_MID_NATIVE4_SCHEMA&&doc.public_site_integrated===true
  &&doc.expected_blocks===4&&doc.expected_answer_slots===4&&doc.expected_standalone_true_false===4&&doc.expected_standalone_choice===0
  &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="ORIGINAL_PDF_RAWDICT_GLYPH_BBOX_SHA256_VERIFIED"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===4,"immutable source header");
 const ids=new Set(),slots=new Set();
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id)
   &&b.source_id===SOURCE_ID&&b.source_pdf_sha256===SOURCE_SHA,"source identification and unique original slot");
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"immutable stem, answer, original PDF BBox, direct KP, rights");
  ids.add(b.id);slots.add(b.source_slot_id);
  fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.source_page_pdf_1_based===1
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"verified PDF original page/bbox");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"&&b.evidence_ref===EVIDENCE,"operator approval and text-only rights");
  fail(b.type==="tf"&&["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"native standalone TF");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen 113 U02 direct KP");
 }
 fail(ids.size===4&&slots.size===4,"four source original standalone unique IDs");
 return {admission:"P12_113_G04S1_DONGGUANG_MID_NATIVE4_CERTIFIED",blocks:doc.blocks,answerSlots:4,standaloneTf:4,standaloneChoice:0,contextGroups:0};
}
