import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_EXACT4_PATH="../data/question-bank/p12-g04s1-113-exact4-public-v1.json";
export const P12_113_EXACT4_SCHEMA="SCIENCE_P12_G04S1_113_EXACT4_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-exact4-operator-approved-formal-v3.json";
const EXPECTED=new Map([["P12_113_G04S1_EXACT4_001","6aa996ce1e5a667e"],["P12_113_G04S1_EXACT4_002","7a629831a645d4d5"],["P12_113_G04S1_EXACT4_003","fba5c87938bb2835"],["P12_113_G04S1_EXACT4_004","a2e7375520425541"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_EXACT4_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113Exact4(doc,authority){
 fail(doc?.schema_version===P12_113_EXACT4_SCHEMA&&doc.public_site_integrated===true
  &&doc.requires_operator_batch_manifest_approval===false&&doc.expected_blocks===4
  &&doc.expected_answer_slots===4&&doc.expected_standalone_true_false===0
  &&doc.expected_standalone_choice===4&&doc.original_teacher_answer_key_authenticated===false
  &&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="ORIGINAL_THREE_SCHOOL_PDFS_SHA256_RASTER_AND_NATIVE_BBOX_VISUAL_4"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===4,"operator exact4 batch header");
 const ids=new Set(),slots=new Set(),schools=new Set(),answer=new Set(["①","②","③","④"]);
 for(const b of doc.blocks){
  fail(b?.id&&EXPECTED.has(b.id)&&!ids.has(b.id)&&b.source_slot_id&&!slots.has(b.source_slot_id),"frozen four source IDs");
  ids.add(b.id);slots.add(b.source_slot_id);schools.add(b.source_id);
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"exact approved stem/options science answer KP geometry and rights fingerprint");
  fail(["SCI_G04_S1_113_MID_005","SCI_G04_S1_113_FINAL_001","SCI_G04_S1_113_MID_006"].includes(b.source_id)
    &&b.source_slot_id.startsWith(b.source_id+"|")
    &&/^[a-f0-9]{64}$/.test(b.source_pdf_sha256)&&b.source_page_pdf_1_based===1
    &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
    &&b.source_pdf_bbox_pts_top_left.every(n=>Number.isFinite(n))
    &&b.source_pdf_bbox_pts_top_left[2]>b.source_pdf_bbox_pts_top_left[0]
    &&b.source_pdf_bbox_pts_top_left[3]>b.source_pdf_bbox_pts_top_left[1],"source original pdf identity and BBox");
  fail(b.grade===4&&b.semester===1&&b.type==="mcq"&&typeof b.stem==="string"
   &&b.stem.trim().length>=8&&b.answer_explanation?.trim()&&b.answer_assumption?.trim()
   &&Array.isArray(b.options)&&b.options.length===4&&b.options.every((o,i)=>typeof o==="string"&&o.startsWith(["①","②","③","④"][i]))
   &&answer.has(b.answer)
   &&b.operator_publication_approval===true&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.source==="P12_113_G04S1_EXACT4_OPERATOR_APPROVED_PUBLIC"
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
   &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
   &&b.evidence_ref===EVIDENCE,"four text-only MC answer and rights operator gate");
  const u=resolveUnit(authority,b.unit);
  fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"exact direct frozen48 kp");
 }
 fail(ids.size===4&&slots.size===4&&schools.size===3,"operator exact four immutable cohort");
 return {admission:"P12_113_EXACT4_CERTIFIED_OPERATOR_APPROVED",blocks:doc.blocks,answerSlots:4,standaloneTf:0,standaloneChoice:4,contextGroups:0};
}
