import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_NATIVE38_PATH="../data/question-bank/p12-g04s1-113-native38-public-v1.json";
export const P12_113_NATIVE38_SCHEMA="SCIENCE_P12_G04S1_113_NATIVE38_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-native38-consolidated-admission-formal-v2.json";
// Frozen exact student-facing question text, four ordered choices, independent answer,
// direct KP, physical PDF coordinates, SHA, rights and operator-approved cohort.
const FINGERPRINTS=new Map([["P12_113_G04S1_NATIVE38_MID_005_S1_TF_008","05e60ff22d0fbc8f"],["P12_113_G04S1_NATIVE38_MID_005_S1_TF_010","82fdc3c972baa6dc"],["P12_113_G04S1_NATIVE38_MID_005_S1_TF_015","72695196a6e23a42"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_002","db3af782c91192cf"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_004","a111f9fcdd4d2006"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_006","3865daf50041c717"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_008","ddec637c62d7669f"],["P12_113_G04S1_NATIVE38_FINAL_005_S1_TF_009","513e5fdf6dfa136d"],["P12_113_G04S1_NATIVE38_FINAL_005_S2_MC_002","549ed063d5cd9636"],["P12_113_G04S1_NATIVE38_FINAL_005_S2_MC_004","da4d3afabcac2191"],["P12_113_G04S1_NATIVE38_FINAL_007_S2_MC_001","8ded36bb057886ba"],["P12_113_G04S1_NATIVE38_FINAL_007_S2_MC_002","ea8f18d6649cff60"],["P12_113_G04S1_NATIVE38_FINAL_007_S2_MC_003","4cc1e816cf5baffa"],["P12_113_G04S1_NATIVE38_FINAL_007_S2_MC_004","9671d5ef1126222a"],["P12_113_G04S1_NATIVE38_MID_017_S1_TF_010","fffa2919f020c200"],["P12_113_G04S1_NATIVE38_MID_017_S1_TF_014","ac6a1118a42dced2"],["P12_113_G04S1_NATIVE38_MID_017_S2_MC_006","9f82108bf5075e6a"],["P12_113_G04S1_NATIVE38_MID_016_S1_TF_006","21369af60b1e9756"],["P12_113_G04S1_NATIVE38_MID_016_S2_MC_002","8f69fcb89220d791"],["P12_113_G04S1_NATIVE38_FINAL_003_S1_MC_007","f8b79309eb4efd22"],["P12_113_G04S1_NATIVE38_FINAL_003_S1_MC_010","992654002fba675d"],["P12_113_G04S1_NATIVE38_FINAL_003_S1_MC_012","2f19bb30d18cf6d6"],["P12_113_G04S1_NATIVE38_FINAL_003_S1_MC_014","9cda69177612fefa"],["P12_113_G04S1_NATIVE38_FINAL_003_S2_TF_007","031abe9fae83c9ac"],["P12_113_G04S1_NATIVE38_FINAL_003_S2_TF_010","2675f4a32adfed5b"],["P12_113_G04S1_NATIVE38_FINAL_003_S2_TF_011","10ef10d00d5edf74"],["P12_113_G04S1_NATIVE38_FINAL_003_S2_TF_015","60d08a9f7d02a879"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_005","b2a961bc01bccd43"],["P12_113_G04S1_NATIVE38_MID_005_S2_MC_011","771f48eae9189895"],["P12_113_G04S1_NATIVE38_FINAL_005_S1_TF_001","485213b7fece17a9"],["P12_113_G04S1_NATIVE38_FINAL_005_S2_MC_001","8349bd3102243d1c"],["P12_113_G04S1_NATIVE38_FINAL_005_S2_MC_005","b6d208c92e32e399"],["P12_113_G04S1_NATIVE38_FINAL_008_S1_MC_003","d9b8b682e2fb3ad7"],["P12_113_G04S1_NATIVE38_FINAL_008_S1_MC_004","3b1c2a9ed90a70d9"],["P12_113_G04S1_NATIVE38_MID_017_S1_TF_013","ce66eea5e1bbba67"],["P12_113_G04S1_NATIVE38_MID_016_S1_TF_008","d3930cf57b32b607"],["P12_113_G04S1_NATIVE38_MID_016_S2_MC_011","51844a73c05b9e2d"],["P12_113_G04S1_NATIVE38_FINAL_004_S1_TF_002","549a4ee8f15758e5"]]);
const MASK=(1n<<64n)-1n;
const fp=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_NATIVE38_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113Native38(doc,authority){
 fail(doc?.schema_version===P12_113_NATIVE38_SCHEMA&&doc.public_site_integrated===true
 &&doc.requires_operator_batch_manifest_approval===false
 &&doc.expected_blocks===38&&doc.expected_answer_slots===38&&doc.expected_standalone_true_false===15
 &&doc.expected_standalone_choice===23&&doc.original_teacher_answer_key_authenticated===false
 &&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="EIGHT_ORIGINAL_SCHOOL_PDF_SHA256_GLYPH_BBOX_AND_RENDER_VISUAL_38"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===38,"approved exact consolidated header");
 const ids=new Set(),slots=new Set(),types={tf:0,mcq:0},papers=new Set();
 for(const b of doc.blocks){
  fail(b?.id&&FINGERPRINTS.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id),"source/ID uniqueness");
  ids.add(b.id);slots.add(b.source_slot_id);papers.add(b.source_id);
  fail(fp(JSON.stringify(b))===FINGERPRINTS.get(b.id),"frozen original source wording/options answer KP geometry and rights");
  fail(b.source_id?.startsWith("SCI_G04_S1_113_")&&b.source_slot_id?.startsWith(b.source_id+"|")
  &&/^[a-f0-9]{64}$/.test(b.source_pdf_sha256)
  &&b.source_page_pdf_1_based===1&&Array.isArray(b.source_pdf_bbox_pts_top_left)
  &&b.source_pdf_bbox_pts_top_left.length===4
  &&b.source_pdf_bbox_pts_top_left.every(n=>Number.isFinite(n))
  &&b.source_pdf_bbox_pts_top_left[2]>b.source_pdf_bbox_pts_top_left[0]
  &&b.source_pdf_bbox_pts_top_left[3]>b.source_pdf_bbox_pts_top_left[1],"exact original PDF source geometry");
  fail(b.grade===4&&b.semester===1&&["tf","mcq"].includes(b.type)&&b.stem?.trim()
  &&b.answer_explanation?.trim()&&b.answer_assumption?.trim()
  &&b.operator_publication_approval===true&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
  &&b.source==="P12_113_G04S1_NATIVE38_OPERATOR_APPROVED_PUBLIC"
  &&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
  &&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
  &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
  &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&b.evidence_ref===EVIDENCE,"operator and original exam rights");
  if(b.type==="tf")fail(["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"TF original answer");
  else fail(Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i]))
   &&["①","②","③","④"].includes(b.answer),"MC original complete choices");
  types[b.type]++;
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1
   &&unit.knowledge_points.some(x=>x.canonical_kp_id===b.canonical_kp_id),"frozen 48 KP direct link");
 }
 fail(papers.size===8&&slots.size===38&&types.tf===15&&types.mcq===23,"exact eight-school consolidated count");
 return {admission:"P12_113_NATIVE38_CERTIFIED_OPERATOR_APPROVED",blocks:doc.blocks,
 answerSlots:38,standaloneTf:15,standaloneChoice:23,contextGroups:0};
}
