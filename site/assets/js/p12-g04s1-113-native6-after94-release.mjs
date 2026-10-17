import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_NATIVE6_AFTER94_PATH="../data/question-bank/p12-g04s1-113-native6-after94-public-v1.json";
export const P12_113_NATIVE6_AFTER94_SCHEMA="SCIENCE_P12_G04S1_113_NATIVE6_AFTER94_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-native6-after94-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_MINQUAN_MID_TF_001","a02de7d51765c572"],["P12_113_G04S1_MINQUAN_MID_TF_003","b29554b1f4aff5ad"],["P12_113_G04S1_MINQUAN_MID_TF_012","0cb45bbb8c9dc9f5"],["P12_113_G04S1_MINQUAN_MID_MC_009","41b5fec7160eac83"],["P12_113_G04S1_YONGAN_MID_TF_002","1c5508dc6e069dc9"],["P12_113_G04S1_YONGAN_MID_TF_007","de1a8d666f60fed5"]]);
const SOURCE_SHA=new Map([["SCI_G04_S1_113_MID_007","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98"],["SCI_G04_S1_113_MID_008","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,m)=>{if(!ok)throw Error("P12_113_NATIVE6_AFTER94_FAIL_CLOSED: "+m);};
export function validateAndConvertP12113Native6After94(doc,authority){
 fail(doc?.schema_version===P12_113_NATIVE6_AFTER94_SCHEMA&&doc.public_site_integrated===true&&doc.expected_blocks===6&&doc.expected_answer_slots===6
 &&doc.expected_standalone_true_false===5&&doc.expected_standalone_choice===1&&doc.original_teacher_answer_key_authenticated===false
 &&doc.original_cropped_images_included===false&&doc.source_image_geometry_verified==="RAWDICT_ORIGINAL_GLYPH_BBOX_SHA256_VERIFIED"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===6,"source-evidence header");
 const ids=new Set(),slots=new Set();let tf=0,mc=0;
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id)&&SOURCE_SHA.get(b.source_id)===b.source_pdf_sha256,"source ID/sha/unique");
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"immutable original text, options, answer, direct KP, bbox, rights");
  ids.add(b.id);slots.add(b.source_slot_id);
  fail(b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1&&Array.isArray(b.source_pdf_bbox_pts_top_left)
    &&b.source_pdf_bbox_pts_top_left.length===4&&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"source original bbox");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.evidence_ref===EVIDENCE,"original question text rights and existing operator scope");
  const u=resolveUnit(authority,b.unit);fail(u?.grade===4&&u?.semester===1&&u?.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen 48KP direct");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"original TF");}
  else if(b.type==="mcq"){mc++;fail(Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((o,i)=>typeof o==="string"&&o.startsWith(["①","②","③","④"][i]))&&["①","②","③","④"].includes(b.answer),"original MC");}
  else fail(false,"unsupported type");
 }
 fail(ids.size===6&&slots.size===6&&tf===5&&mc===1,"six standalone source slots");
 return {admission:"P12_113_G04S1_NATIVE6_AFTER94_CERTIFIED",blocks:doc.blocks,answerSlots:6,standaloneTf:5,standaloneChoice:1,contextGroups:0};
}
