import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B08_MATCHING10_PATH="../data/question-bank/p12-g04s1-113-b08-matching10-two-parent-public-v1.json";
export const P12_113_B08_MATCHING10_SCHEMA="SCIENCE_P12_G04S1_113_B08_MATCHING10_TWO_PARENTS_PUBLIC_V1";
const AUTHORISED_INSTRUCTION="P12_G04S1_113_B08_Matching10_OriginalParentCodebank_ScienceUnique_KP48_Dedup_Rights_ExactOperatorEligibleOnly_ThenSelectivePR_CI_Main_PagesE2E_33HOLD_NoB01ToB07Reopen";
const SOURCE_GROUP_IDS=["P12_113_G04S1_B08_ANHE_MATCHING6_PARENT","P12_113_G04S1_B08_CHENGGONG_MATCHING4_PARENT"];
const GROUP_SIZES=[6,4];
const SOURCE_PARENT_HASHES=["3d35601fc9fd0bfb","a4af17c1c2781b2c"];
const ORIGINAL_10_IDS=["SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|001","SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|002","SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|003","SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|004","SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|005","SCI_G04_S1_113_FINAL_006|S03|G02|MATCH|006","SCI_G04_S1_113_MID_018|S04|G01|MATCH|001","SCI_G04_S1_113_MID_018|S04|G01|MATCH|002","SCI_G04_S1_113_MID_018|S04|G01|MATCH|003","SCI_G04_S1_113_MID_018|S04|G01|MATCH|004"];
const QUESTION_CONTENT_HASHES=["09444203279c2403","c78c2a0952203fb0","d0666d615164f3af","0491f16fcfa5c4aa","c518bc14075245f5","659e1b457abb6cc3","968980ee003eaf79","25f2c41ed326fed1","ce1099fee4bca435","a681c83f3e6a924a"];
const fail=(ok,m)=>{if(!ok)throw Error("B08_MATCHING10_FAIL_CLOSED: "+m);};
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&((1n<<64n)-1n);return h.toString(16).padStart(16,"0");};
export function validateAndConvertP12113B08Matching10(d,authority){
 fail(d?.schema_version===P12_113_B08_MATCHING10_SCHEMA&&d.public_site_integrated===true
  &&d.requires_operator_batch_manifest_approval===false&&d.operator_instruction_verbatim===AUTHORISED_INSTRUCTION
  &&d.expected_blocks===2&&d.expected_answer_slots===10&&d.expected_context_groups===2
  &&d.expected_standalone_true_false===0&&d.expected_standalone_choice===0
  &&d.original_teacher_answer_key_authenticated===false&&d.original_cropped_images_included===false
  &&d.source_image_geometry_verified==="ORIGINAL_ANHE6_NATIVE_BBOX_CHENGGONG4_VECTOR_LABEL_BOX_P2_SCAN5_DEDUP"
  &&d.source_evidence_ref==="data/review/p12-g04s1-113-b08-matching10-originaltwo-parent-science-kp-rights-dedup-operator-eligible-v1.json"
  &&Array.isArray(d.blocks)&&d.blocks.length===2,"exact operator scope and 2 groups 10 positions");
 fail(authority?.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3","frozen 113 48KP selector");const ids=new Set();let count=0;
 for(const [idx,g] of d.blocks.entries()){
  const unit=resolveUnit(authority,idx===0?"4-S1-U03":"4-S1-U02");
  fail(g?.id===SOURCE_GROUP_IDS[idx]&&g.source==="CERTIFIED_CONTEXT_RECONSTRUCTED"&&g.type==="group"
   &&g.certification_status==="OPERATOR_APPROVED_PUBLIC"&&g.operator_publication_approval===true
   &&g.grade===4&&g.semester===1&&g.unit===(idx===0?"4-S1-U03":"4-S1-U02")
   &&g.source_page_pdf_1_based===2&&g.original_cropped_assets_included===false&&g.teacher_answer_key_authenticated===false
   &&g.dependencies_complete===true&&g.dependency_review_verified===true
   &&g.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"&&g.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
   &&g.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&Array.isArray(g.shared?.choiceBank)&&g.shared.choiceBank.length===(idx===0?4:2)
   &&Array.isArray(g.items)&&g.items.length===GROUP_SIZES[idx]
   &&unit?.grade===4&&unit?.semester===1
   &&unit.knowledge_points.some(k=>k.canonical_kp_id===g.canonical_kp_id),"unmodified original parent and rights "+idx);
  fail(fingerprint(JSON.stringify([g.id,g.source_pdf_sha256,g.source_parent_original_id,g.title,g.shared,g.canonical_kp_id,g.secondary_canonical_kp_ids]))===SOURCE_PARENT_HASHES[idx],"source parent or code bank mutated "+idx);
  for(const [i,item] of g.items.entries()){
   fail(item?.source_slot_id===ORIGINAL_10_IDS[count]&&item.source_original_slot_id===item.source_slot_id
     &&!ids.has(item.source_slot_id)&&item.type==="short"&&item.unit===g.unit
     &&item.grade===4&&item.semester===1&&item.source_page_pdf_1_based===2
     &&item.source_pdf_sha256===g.source_pdf_sha256&&item.original_question_number===String(i+1).padStart(3,"0")
     &&unit.knowledge_points.some(k=>k.canonical_kp_id===item.canonical_kp_id)
     &&item.operator_publication_approval===true&&item.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
     &&item.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&item.original_teacher_answer_key_authenticated===false
     &&item.original_cropped_assets_included===false&&!Object.hasOwn(item,"options")
     &&!Object.hasOwn(item,"score")&&!Object.hasOwn(item,"points")
     &&typeof item.answer_explanation==="string"&&item.answer_explanation.length>8
     &&item.answer_assumption.includes("非原校教師答案表")
     &&g.shared.choiceBank.some(x=>x.startsWith(item.answer+".")),
     "original matching code child, unambiguous Science, KP, rights "+count);
   fail(fingerprint(JSON.stringify([item.source_slot_id,item.source_pdf_sha256,item.source_pdf_bbox_pts_top_left,item.source_bbox_kind,item.original_question_number,item.stem,item.answer,item.answer_explanation,item.canonical_kp_id]))===QUESTION_CONTENT_HASHES[count],
     "original source text and BBox, independent answer, KP tampering "+count);
   ids.add(item.source_slot_id);count++;
  }
 }
 fail(count===10&&ids.size===10,"exact 10 child cohort");
 return {admission:"P12_113_B08_MATCHING10_EXACT_OPERATOR_APPROVED",blocks:d.blocks,answerSlots:10,standaloneTf:0,standaloneChoice:0,contextGroups:2};
}
