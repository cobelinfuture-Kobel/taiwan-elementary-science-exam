import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B08_MC7_PATH="../data/question-bank/p12-g04s1-113-b08-chenggong-mc7-two-parent-public-v1.json";
export const P12_113_B08_MC7_SCHEMA="SCIENCE_P12_G04S1_113_B08_MC7_TWO_PARENT_PUBLIC_V1";
const FROZEN_SOURCE_SHA="ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601";
const ORIGINAL_SLOT_IDS=["SCI_G04_S1_113_MID_018|S03|G04|MC|001","SCI_G04_S1_113_MID_018|S03|G04|MC|002","SCI_G04_S1_113_MID_018|S03|G04|MC|003","SCI_G04_S1_113_MID_018|S03|G05|MC|001","SCI_G04_S1_113_MID_018|S03|G05|MC|002","SCI_G04_S1_113_MID_018|S03|G05|MC|003","SCI_G04_S1_113_MID_018|S03|G05|MC|004"];
const ORIGINAL_ITEM_HASHES=["c47720f561c586b4","760aec02e8ced734","79ead3bce8192e25","4b09fb7d0e338c87","48f8237c4ba1a13c","25da0c3391345d82","6034eec078df0637"];
const ORIGINAL_PARENT_HASHES=["237e7ade43e87495","fe3cd66509c6caf8"];
const ORIGINAL_GROUP_IDS=["P12_113_G04S1_B08_CHENGGONG_PARENT_G04","P12_113_G04S1_B08_CHENGGONG_PARENT_G05"];
const ORIGINAL_GROUP_SIZES=[3,4];
const ORIGINAL_PARENT_IDS=["CHENGGONG_S03_G04","CHENGGONG_S03_G05"];
const FROZEN_KPS=["sci_g04s1_02_02","sci_g04s1_02_02","sci_g04s1_02_14","sci_g04s1_02_09","sci_g04s1_02_09","sci_g04s1_02_09","sci_g04s1_02_09"];
const fail=(ok,m)=>{if(!ok)throw Error("P12_B08_MC7_TWO_PARENT_FAIL_CLOSED: "+m);};
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&((1n<<64n)-1n);return h.toString(16).padStart(16,"0");};
export function validateAndConvertP12113B08ChenggongMC7(d,authority){
 fail(d?.schema_version===P12_113_B08_MC7_SCHEMA&&d.public_site_integrated===true
  &&d.requires_operator_batch_manifest_approval===false
  &&d.operator_instruction_verbatim==="P12_G04S1_113_B08_MC7_ExactOperatorCohort387to393_TwoParentStudentRenderer_ThenSelectiveStudentPR_FocusedCI_MainReadback_PagesE2E_Matching10Separate_33HOLD_NoB01ToB07Reopen"
  &&JSON.stringify(d.operator_scope_ordinals)==="[387,388,389,390,391,392,393]"
  &&d.expected_blocks===2&&d.expected_answer_slots===7
  &&d.expected_standalone_true_false===0&&d.expected_standalone_choice===0&&d.expected_context_groups===2
  &&d.original_teacher_answer_key_authenticated===false&&d.original_cropped_images_included===false
  &&d.source_image_geometry_verified==="ORIGINAL_CHENGGONG_P2_7_NATIVE_ANSWER_BBOX_AND_TWO_PARENT_VISUAL_SCAN5_DEDUP"
  &&Array.isArray(d.blocks)&&d.blocks.length===2,
  "exact operator, source and group contract");
 const unit=resolveUnit(authority,"4-S1-U02");
 fail(authority?.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3"
  &&unit?.grade===4&&unit.semester===1&&unit.unit_id==="U02", "active 113 Frozen 48 authority");
 let counter=0;const seen=new Set();
 for(let gi=0;gi<2;gi++){
  const g=d.blocks[gi];
  fail(g?.id===ORIGINAL_GROUP_IDS[gi]&&g.type==="group"&&g.source==="CERTIFIED_CONTEXT_RECONSTRUCTED"
    &&g.unit==="4-S1-U02"&&g.grade===4&&g.semester===1
    &&g.source_id==="SCI_G04_S1_113_MID_018"&&g.source_pdf_sha256===FROZEN_SOURCE_SHA&&g.source_page_pdf_1_based===2
    &&g.source_parent_original_id===ORIGINAL_PARENT_IDS[gi]
    &&g.certification_status==="OPERATOR_APPROVED_PUBLIC"&&g.operator_publication_approval===true
    &&g.source_image_geometry_verified===true&&g.dependencies_complete===true
    &&g.original_cropped_assets_included===false&&g.teacher_answer_key_authenticated===false
    &&g.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&g.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&g.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
    &&Array.isArray(g.items)&&g.items.length===ORIGINAL_GROUP_SIZES[gi],
    "original school exam parent provenance and rights "+gi);
  fail(gi===0?JSON.stringify(g.secondary_canonical_kp_ids)==="[\"sci_g04s1_02_14\"]":!g.secondary_canonical_kp_ids?.length,"group contains exactly the original child KP links");
  fail(fnv(JSON.stringify([g.shared,g.title,g.source_parent_original_id]))===ORIGINAL_PARENT_HASHES[gi],
   "parent text, group-4 exact table or group-5 speaker descriptions changed");
  fail(unit.knowledge_points.some(k=>k.canonical_kp_id===g.canonical_kp_id),"group canonical 48 KP");
  for(const [i,b] of g.items.entries()){
   fail(b?.type==="mcq"&&b.source_slot_id===ORIGINAL_SLOT_IDS[counter]&&!seen.has(b.source_slot_id)
     &&b.source_original_slot_id===b.source_slot_id&&b.source_page_pdf_1_based===2
     &&b.original_question_number===String(i+1).padStart(3,"0")
     &&b.unit==="4-S1-U02"&&b.canonical_kp_id===FROZEN_KPS[counter]
     &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id)
     &&b.operator_publication_approval===true&&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
     &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
     &&b.original_teacher_answer_key_authenticated===false
     &&b.answer_assumption.includes("非原校教師答案表")
     &&Array.isArray(b.options)&&b.options.length===(gi===0?3:4)&&b.options.some(o=>o.startsWith(b.answer))
     &&!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"),
     "exact original question, answer, KP, options, rights "+counter);
   fail(fnv(JSON.stringify([b.source_slot_id,b.source_pdf_bbox_pts_top_left,b.stem,b.options,b.answer,b.canonical_kp_id]))===ORIGINAL_ITEM_HASHES[counter],
     "immutable source text, original choice order, science answer or native source BBox "+counter);
   seen.add(b.source_slot_id);counter++;
  }
 }
 fail(counter===7&&seen.size===7,"only seven distinct MC children");
 return {admission:"P12_113_B08_MC7_TWO_PARENT_OPERATOR_APPROVED",blocks:d.blocks,
  answerSlots:7,standaloneTf:0,standaloneChoice:0,contextGroups:2};
}
