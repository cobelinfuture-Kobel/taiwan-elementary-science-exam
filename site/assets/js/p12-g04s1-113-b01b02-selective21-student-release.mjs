import { resolveUnit } from "./authority-adapter.mjs";

export const SELECTIVE21_BANK_PATH="../data/question-bank/p12-g04s1-113-b01b02-selective21-prepublication-candidate-v1.json";
export const SELECTIVE21_GATE_PATH="../data/question-bank/p12-g04s1-113-b01b02-selective21-operator-release-gate-v1.json";
export const SELECTIVE21_SCHEMA="SCIENCE_P12_G04S1_113_B01B02_SELECTIVE21_PREPUBLICATION_CANDIDATE_V1";
export const SELECTIVE21_GATE_SCHEMA="P12_G04S1_113_B01_B02_SELECTIVE21_EXISTING_ADMISSION_GATE_RELEASE_APPROVAL_V1";
export const SELECTIVE21_FROZEN_CONTENT_FINGERPRINT="692509b881a264dd";
export const SELECTIVE21_APPROVAL_VERBATIM="直接收斂 PR #186 的 38 個來源 ID／21 個作答位置，完成最後原卷去重及一次精確發布簽核，接著合併 `main`、驗證 Pages 實站，再以真正增加的 `PUBLISHED` 結案；不再重新啟動 B01、B02 的初審。";
export const SELECTIVE21_TARGET_DEDUP_EVIDENCE="data/review/p12-g04s1-113-b01b02-selective21-target-exact-source-11329-11425-full-semantic-dedup-v1.json";
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_B01B02_SELECTIVE21_FAIL_CLOSED: "+msg);};
const MASK=(1n<<64n)-1n;
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const distinct=a=>Array.isArray(a)&&new Set(a).size===a.length;
const slots=b=>b.reduce((n,x)=>n+(x.type==="group"?x.items.length:1),0);
const positive=()=>({admission:"P12_113_B01_B02_SELECTIVE21_GATED_NOT_PUBLIC",blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0});

function immutableFingerprint(doc){
 const proof=doc.source_evidence_rows.map(x=>[
  x.source_slot_id,x.original_child_verbatim,x.original_parent_verbatim,x.original_options_verbatim,
  x.source_answer_bbox_pts_top_left,x.independent_answer_not_school_key,x.direct_frozen48kp_id,
 ]);
 const blocks=doc.blocks.map(x=>[x.id,x.type,x.stem,x.options,x.answer,x.items?.map(y=>[y.id,y.stem,y.answer])]);
 return fnv(JSON.stringify({sourceProof:proof,rendered:blocks}));
}

export function inspectP12113B01B02Selective21Candidate(doc,authority){
 fail(doc?.schema_version===SELECTIVE21_SCHEMA
   &&doc?.NEXT_RESUME_TASK==="B01_B02_SELECTIVE_STUDENT_BANK_RELEASE_FULLFIX"
   &&doc?.source_slots_total===38&&doc.source_slots_B01===28&&doc.source_slots_B02===10
   &&doc.student_answer_slots_proposed===21&&doc.student_blocks_proposed===16
   &&doc.exact_operator_cohort_approved===false&&doc.public_site_integrated===false
   &&doc.PUBLISHED_new===0&&doc.ADMISSION_READY_new===0
   &&doc.already_public_333_unchanged===true
   &&doc.original_teacher_key_authenticated!==true
   &&Array.isArray(doc.source_evidence_rows)&&doc.source_evidence_rows.length===38
   &&Array.isArray(doc.exact_source_slot_ids)&&doc.exact_source_slot_ids.length===38
   &&distinct(doc.exact_source_slot_ids)
   &&Array.isArray(doc.blocks)&&doc.blocks.length===16
   &&immutableFingerprint(doc)===SELECTIVE21_FROZEN_CONTENT_FINGERPRINT,
  "immutable 38 source slots / 21 answer positions and draft flags");
 const source=new Map();
 for(const [i,r] of doc.source_evidence_rows.entries()){
  fail(r.source_slot_id===doc.exact_source_slot_ids[i]
    &&/^[a-f0-9]{64}$/.test(r.source_pdf_sha256)
    &&Number.isInteger(r.source_pdf_page_1based)&&r.source_pdf_page_1based>=1
    &&Array.isArray(r.source_answer_bbox_pts_top_left)&&r.source_answer_bbox_pts_top_left.length===4
    &&r.source_answer_bbox_pts_top_left.every(Number.isFinite)
    &&typeof r.original_child_verbatim==="string"&&r.original_child_verbatim.trim()
    &&["O","X","A","B","C","①","②","③","④"].includes(r.independent_answer_not_school_key)
    &&r.science_direct_kp_component_accepted===true
    &&r.article9_question_text_only_rights_component_accepted===true
    &&r.scan5_semantic_dedup_formally_accepted===false
    &&r.operator_exact_approval===false&&!r.published,
    "original source and never-promoted safety flag #"+i);
  const u="4-S1-U"+r.direct_frozen48kp_id?.match(/^sci_g04s1_(\d{2})_/ )?.[1];
  const authorityUnit=resolveUnit(authority,u);
  fail(authorityUnit?.grade===4&&authorityUnit.semester===1
    &&authorityUnit.knowledge_points.some(k=>k.canonical_kp_id===r.direct_frozen48kp_id),
    "113 frozen48 direct KP for "+r.source_slot_id);
  source.set(r.source_slot_id,r);
 }
 fail(source.size===38,"source aliases within the selected roster");
 const blockIds=new Set(),represented=new Set();
 for(const b of doc.blocks){
  fail(b.id&&!blockIds.has(b.id)&&b.grade===4&&b.semester===1
    &&["multi","tf","mcq","group"].includes(b.type)
    &&b.operator_publication_approval===false
    &&b.certification_status==="OPERATOR_APPROVAL_PENDING"
    &&b.original_cropped_assets_included===false
    &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&typeof b.stem==="string"&&b.stem.trim(), "Exam candidate block contract");
  blockIds.add(b.id);
  fail(distinct(b.source_lineage_ids)&&b.source_lineage_ids.length>=1,"source lineage disjoint");
  const first=source.get(b.source_lineage_ids[0]);
  fail(first?.source_slot_id===b.source_slot_id
    &&first.original_source_paper===b.source_id
    &&first.source_pdf_sha256===b.source_pdf_sha256
    &&first.source_pdf_page_1based===b.source_page_pdf_1_based
    &&JSON.stringify(first.source_answer_bbox_pts_top_left)===JSON.stringify(b.source_pdf_bbox_pts_top_left)
    &&first.direct_frozen48kp_id===b.canonical_kp_id
    &&b.unit==="4-S1-U"+b.canonical_kp_id.match(/^sci_g04s1_(\d{2})_/ )?.[1],
    "full immutable original source identity and direct KP for rendered block");
  const secondary=[...new Set(b.source_lineage_ids.map(id=>source.get(id)?.direct_frozen48kp_id))].filter(k=>k!==b.canonical_kp_id);
  fail(JSON.stringify(secondary)===JSON.stringify(b.secondary_canonical_kp_ids),"every original child direct KP lineage preserved");
  for(const id of b.source_lineage_ids){
    fail(source.has(id)&&!represented.has(id),"all and only exact original 38 source IDs once");
    represented.add(id);
  }
  if(b.type==="tf")fail(["O","X"].includes(b.answer)
   &&b.source_lineage_ids.length===1
   &&b.answer===first.independent_answer_not_school_key,
    "original TF unique answer");
  if(b.type==="mcq")fail(Array.isArray(b.options)&&b.options.length===4&&["①","②","③","④"].includes(b.answer)
   &&b.answer===first.independent_answer_not_school_key
   &&b.source_lineage_ids.length===1,
    "original MC unique answer and full ordered options");
  if(b.type==="multi"){
    const d=["①","②","③","④","⑤","⑥","⑦","⑧","⑨"];
    const expected=b.source_lineage_ids.map((id,i)=>source.get(id).independent_answer_not_school_key==="O"?d[i]:"").join("");
    fail(b.source_lineage_ids.length===b.options?.length
     &&[...b.answer].length>=1&&/^([①②③④⑤⑥⑦⑧⑨])+$/.test(b.answer)
     &&b.answer===expected
     &&b.source_lineage_ids.every(id=>source.get(id).original_parent_verbatim===first.original_parent_verbatim),
     "all original positive-only checkbox answers and parent preserved");
  }
  if(b.type==="group"){
    fail(b.items?.length===6&&b.shared?.instructions&&Array.isArray(b.shared.choiceBank),"original parent and six child short answer slots");
    for(const item of b.items){
      const original=source.get(item.source_slot_id);
      fail(item.type==="short"&&["A","B","C"].includes(item.answer)&&
       item.source_lineage_ids?.length===1&&item.operator_publication_approval===false
       &&item.answer===original?.independent_answer_not_school_key
       &&item.canonical_kp_id===original?.direct_frozen48kp_id,
       "original code bank fill slots");
    }
  }
 }
 fail(represented.size===38&&slots(doc.blocks)===21
   &&doc.blocks.filter(x=>x.type==="tf").length===8
   &&doc.blocks.filter(x=>x.type==="mcq").length===3
   &&doc.blocks.filter(x=>x.type==="multi").length===4,
   "21 printable student positions, 38 source lineage rows, exact answer types");
 return {sourceSlots:38,proposedAnswerSlots:21,blocks:doc.blocks.length,contentFingerprint:immutableFingerprint(doc)};
}

/**
 * This does not add new gates: pre-existing original Source/visual,
 * all-paper duplicate and exact operator approval must all be true.
 * A batch instruction alone is not a signed exact release roster.
 */
export function validateAndConvertP12113B01B02Selective21(doc,authority,operator){
 inspectP12113B01B02Selective21Candidate(doc,authority);
 fail(operator?.schema_version===SELECTIVE21_GATE_SCHEMA
   &&operator.candidate_source_and_render_fingerprint_fnv1a64===SELECTIVE21_FROZEN_CONTENT_FINGERPRINT
   &&operator.precise_source_slot_ids_total===38
   &&operator.proposed_student_answer_slots===21,"exact release gate identity");
 if(operator.public_student_release_allowed===false
   &&operator.exact_operator_source_roster_approval===false
   &&operator.actual_admission_ready_new===0
   &&operator.actual_published_new===0)return positive();
 fail(operator.original_science_direct_113_frozen48_kp_components_accepted===true
   &&operator.original_qualification_rights_article9_question_text_only_accepted===true
   &&operator.original_pdf_question_parent_stem_and_options_visual_verified===true
   &&operator.full_113_29_papers_with_5_scan_full_parent_semantic_duplicate_accepted===true
   &&operator.complete_114_25_and_main_duplicate_accepted===true
   &&operator.exact_operator_source_roster_approval===true
   &&operator.public_student_release_allowed===true
   &&Array.isArray(operator.approved_source_slot_ids)
   &&JSON.stringify(operator.approved_source_slot_ids)===JSON.stringify(doc.exact_source_slot_ids)
   &&typeof operator.operator_approval_verbatim==="string"
   &&operator.operator_approval_verbatim===SELECTIVE21_APPROVAL_VERBATIM
   &&operator.reviewed_target_dedup_evidence===SELECTIVE21_TARGET_DEDUP_EVIDENCE
   &&operator.reviewed_target_dedup_schema==="P12_G04S1_113_B01B02_SELECTIVE21_EXACT_TARGETED_SOURCE_11329_11425_DUPLICATE_GATE_V1"
   &&operator.actual_admission_ready_new===21
   &&[0,21].includes(operator.actual_published_new),
   "all already-frozen gate proofs and explicit 21 answer-slot / 38 source-slot operator approval");
 const exactSecondary=[1,2,3,4].map(i=>({
  secondary:"SCI_G04_S1_113_MID_003|S03|G01|TF|"+String(i).padStart(3,"0"),
  canonical:"SCI_G04_S1_113_MID_001|S03|G08|TF|"+String(i).padStart(3,"0"),
 }));
 fail(JSON.stringify(operator.duplicate_secondary_alias_pairs)===JSON.stringify(exactSecondary),
  "four original exact same-child-and-parent duplicate secondaries must be retained as source-only aliases");
 const blocks=doc.blocks.map(b=>{
  const newB={...b,certification_status:"OPERATOR_APPROVED_PUBLIC",operator_publication_approval:true,
    source:"P12_113_B01B02_SELECTIVE21_EXACT_OPERATOR_APPROVED"};
  if(b.id==="P12_113_G04S1_B01B02_SEL21_001"){
    fail(JSON.stringify(b.source_lineage_ids)===JSON.stringify(exactSecondary.map(x=>x.canonical)),
      "Wende source order must bind exact four Zhongxiao secondary ALIAS IDs");
    newB.source_lineage_ids=[...b.source_lineage_ids,...exactSecondary.map(x=>x.secondary)];
    newB.secondary_source_only_alias_ids=exactSecondary.map(x=>x.secondary);
  }
  if(b.type==="group"){
   newB.source="CERTIFIED_CONTEXT_RECONSTRUCTED";
   newB.source_review_status="GPT6_SCIENCE_CONTEXT_REVIEWED";
   newB.dependencies_complete=true;newB.teacher_answer_key_authenticated=false;
   newB.copyright_path="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES";
   newB.items=b.items.map(item=>({...item,certification_status:"OPERATOR_APPROVED_PUBLIC",operator_publication_approval:true}));
  }
  return newB;
 });
 return {admission:"P12_113_B01_B02_SELECTIVE21_EXACT_OPERATOR_APPROVED",blocks,
 answerSlots:21,standaloneTf:8,standaloneChoice:3,contextGroups:1,secondaryAliasSourceOnly:4};
}
