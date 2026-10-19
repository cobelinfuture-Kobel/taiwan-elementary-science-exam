import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_HN22_PATH="../data/question-bank/p12-g04s1-113-hn22-public-v1.json";
export const P12_113_HN22_SCHEMA="SCIENCE_P12_G04S1_113_HN22_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-hn22-operator-approved-formal-v3.json";
const EXPECTED=new Map([["P12_113_G04S1_HN22_001","8a59ab58a99db05c"],["P12_113_G04S1_HN22_002","ec097e4c93de1d2f"],["P12_113_G04S1_HN22_003","2fc921e0092bb5ca"],["P12_113_G04S1_HN22_004","c10ecb877f9fba91"],["P12_113_G04S1_HN22_005","c3545acd0514cf10"],["P12_113_G04S1_HN22_006","d44fc53a3c863ddb"],["P12_113_G04S1_HN22_007","fb54efba64b0fbd3"],["P12_113_G04S1_HN22_008","4a700114465aeb66"],["P12_113_G04S1_HN22_009","0a38fdaa6f0b2a9a"],["P12_113_G04S1_HN22_010","bef7d7aea5da4fe5"],["P12_113_G04S1_HN22_011","c826720f06808d6c"],["P12_113_G04S1_HN22_012","bd5ef3f958cfe6cc"],["P12_113_G04S1_HN22_013","4430d85f754fab58"],["P12_113_G04S1_HN22_014","00361933bd9745d0"],["P12_113_G04S1_HN22_015","6597e31acc873ee1"],["P12_113_G04S1_HN22_016","332eedf6a2d7316b"],["P12_113_G04S1_HN22_017","b031e224703b8265"],["P12_113_G04S1_HN22_018","f1a3a87f78510050"],["P12_113_G04S1_HN22_019","b956ce12bc77f635"],["P12_113_G04S1_HN22_020","e8b686db2a673d00"],["P12_113_G04S1_HN22_021","bbc4639dd212daf7"],["P12_113_G04S1_HN22_022","906736b7f5746b3d"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_HN22_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113HN22(doc,authority){
 fail(doc?.schema_version===P12_113_HN22_SCHEMA&&doc.public_site_integrated===true
  &&doc.requires_operator_batch_manifest_approval===false&&doc.expected_blocks===22
  &&doc.expected_answer_slots===22&&doc.expected_standalone_true_false===11
  &&doc.expected_standalone_choice===11&&doc.original_teacher_answer_key_authenticated===false
  &&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="TWO_ORIGINAL_SCHOOL_PDF_SHA256_RASTER_PIXEL_BBOX_AND_PAGE_VISUAL_22"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===22,"operator cohort header");
 const ids=new Set(),slots=new Set(),types={tf:0,mcq:0},schools=new Set(),answer={tf:new Set(["O","X"]),mcq:new Set(["①","②","③","④"])};
 for(const b of doc.blocks){
  fail(b?.id&&EXPECTED.has(b.id)&&!ids.has(b.id)&&b.source_slot_id&&!slots.has(b.source_slot_id),"approved source identity unique");
  ids.add(b.id);slots.add(b.source_slot_id);schools.add(b.source_id);
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"frozen source stem/options answer KP SHA/BBox and rights fingerprint");
  fail(["SCI_G04_S1_113_FINAL_001","SCI_G04_S1_113_MID_006"].includes(b.source_id)
   &&b.source_slot_id.startsWith(b.source_id+"|")
   &&/^[a-f0-9]{64}$/.test(b.source_pdf_sha256)
   &&b.source_page_pdf_1_based===1
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(n=>Number.isFinite(n))
   &&b.source_pdf_bbox_pts_top_left[2]>b.source_pdf_bbox_pts_top_left[0]
   &&b.source_pdf_bbox_pts_top_left[3]>b.source_pdf_bbox_pts_top_left[1],"exact school source PDF raster geometry");
  fail(b.grade===4&&b.semester===1&&["tf","mcq"].includes(b.type)
   &&typeof b.stem==="string"&&b.stem.trim().length>=4
   &&b.answer_explanation?.trim()&&b.answer_assumption?.trim()
   &&b.operator_publication_approval===true&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.source==="P12_113_G04S1_HN22_OPERATOR_APPROVED_PUBLIC"
   &&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
   &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&b.evidence_ref===EVIDENCE,"operator and exact Article 9 exam question TEXT only");
  fail(answer[b.type].has(b.answer),"school-independent scientific unique answer");
  if(b.type==="tf")fail(!Object.hasOwn(b,"options"),"no TF choice fabrication");
  else fail(Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((o,i)=>typeof o==="string"&&o.startsWith(["①","②","③","④"][i])),"all four original options");
  const u=resolveUnit(authority,b.unit);
  fail(u?.grade===4&&u.semester===1
   &&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen 48 direct canonical KP");
  types[b.type]++;
 }
 fail(ids.size===22&&slots.size===22&&schools.size===2&&types.tf===11&&types.mcq===11
  &&!slots.has("SCI_G04_S1_113_MID_006|S2|MC|002"),"precise 22 and no reordered 114 duplicate");
 return {admission:"P12_113_HN22_CERTIFIED_OPERATOR_APPROVED",blocks:doc.blocks,answerSlots:22,standaloneTf:11,standaloneChoice:11,contextGroups:0};
}
