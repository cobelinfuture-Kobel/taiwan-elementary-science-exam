import {resolveUnit} from "./authority-adapter.mjs";

export const P12_113_B01_WENDE7_PATH="../data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json";
export const P12_113_B01_WENDE7_SCHEMA="SCIENCE_P12_G04S1_113_B01_WENDE7_STANDALONE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b01-7standalone-operator-approved-formal-v1.json";
const PDF_SHA="7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56";
const SOURCE="SCI_G04_S1_113_MID_001";
const IDs=[
  ["S01|TF|004","sci_g04s1_02_02","X",[28.56,256.39,60.52,269.34]],
  ["S01|TF|012","sci_g04s1_02_11","X",[28.56,740.47,60.52,753.4200000000001]],
  ["S01|TF|014","sci_g04s1_02_13","O",[28.56,850.39,60.52,863.34]],
  ["S01|TF|015","sci_g04s1_02_14","O",[28.56,916.39,60.52,929.34]],
  ["S02|MC|007","sci_g04s1_02_09","②",[428.04,546.19,460,559.1400000000001]],
  ["S02|MC|008","sci_g04s1_02_05","②",[428.04,612.19,460,625.1400000000001]],
  ["S02|MC|011","sci_g04s1_02_14","③",[428.04,942.19,460,955.1400000000001]]
];
const PROOFS=["3e3543c205ce8c5f","d9080ed4b9b42a28","d6b89156c045242e","5763f836b4deae4e","61f626271a2fb7a8","665950ed826c4625","9b6782a77c77f20a"];
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_B01_WENDE7_FAIL_CLOSED: "+msg);};

export function validateAndConvertP12113B01Wende7(doc,authority){
  fail(doc?.schema_version===P12_113_B01_WENDE7_SCHEMA
    &&doc.public_site_integrated===true
    &&doc.requires_operator_batch_manifest_approval===false
    &&doc.expected_blocks===7&&doc.expected_answer_slots===7
    &&doc.expected_standalone_true_false===4&&doc.expected_standalone_choice===3
    &&doc.original_teacher_answer_key_authenticated===false
    &&doc.original_cropped_images_included===false
    &&doc.source_image_geometry_verified==="ORIGINAL_WENDE_PDF_SHA256_NATIVE_ANSWER_BBOX_VISUAL_7"
    &&doc.evidence_ref===EVIDENCE
    &&Array.isArray(doc.blocks)&&doc.blocks.length===7,"7 operator-accepted original B01 school exam items");
  const ids=new Set(),sources=new Set(),choiceNames=["①","②","③","④"];
  for(const [i,b] of doc.blocks.entries()){
    const [suffix,kp,answer,bbox]=IDs[i];
    const [section,mode,number]=suffix.split("|");
    const type=mode==="TF"?"tf":"mcq";
    fail(b?.id==="P12_113_G04S1_B01_WENDE7_"+String(i+1).padStart(3,"0")
      &&b.source_id===SOURCE
      &&b.source_slot_id===SOURCE+"|"+suffix
      &&b.source_pdf_sha256===PDF_SHA
      &&b.original_question_number===number
      &&b.source_page_pdf_1_based===1
      &&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
      &&b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"
      &&b.type===type&&b.canonical_kp_id===kp
      &&b.answer===answer,"original exact source ID, original BBox, direct KP and unique answer #"+i);
    fail(!ids.has(b.id)&&!sources.has(b.source_slot_id),"duplicate original question ID");
    ids.add(b.id);sources.add(b.source_slot_id);
    fail(typeof b.stem==="string"&&b.stem.trim().length>=10
      &&typeof b.answer_explanation==="string"&&b.answer_explanation.trim()
      &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim()
      &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
      &&b.operator_publication_approval===true
      &&b.source==="P12_113_B01_WENDE7_OPERATOR_APPROVED_PUBLIC"
      &&b.original_teacher_answer_key_authenticated===false
      &&b.original_cropped_assets_included===false
      &&b.dependency_review_verified===true
      &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
      &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
      &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
      &&b.evidence_ref===EVIDENCE,"formal science and Article9 text-only rights");
    fail(type==="tf"?(!Object.hasOwn(b,"options")&&["O","X"].includes(b.answer)):
      (Array.isArray(b.options)&&b.options.length===4
       &&b.options.every((opt,j)=>typeof opt==="string"&&opt.startsWith(choiceNames[j]))
       &&choiceNames.includes(b.answer)),"exact original TF/MC options");
    const expectedAliases=i===3?[SOURCE+"|"+suffix,"SCI_G04_S1_113_MID_004|S02|TF|011"]
      :i===6?[SOURCE+"|"+suffix,"SCI_G04_S1_113_MID_003|S02|MC|004"]:null;
    fail(expectedAliases?JSON.stringify(b.source_lineage_ids)===JSON.stringify(expectedAliases):
      !Object.hasOwn(b,"source_lineage_ids"),"two true unissued cross-school duplicate source aliases");
    fail(fingerprint(JSON.stringify(b))===PROOFS[i],"immutable approved stem/options/answer/KP/rights for "+suffix);
    const unit=resolveUnit(authority,b.unit);
    fail(unit?.grade===4&&unit.semester===1
      &&unit.knowledge_points.some(point=>point.canonical_kp_id===kp),"frozen 113 G04 S1 48 KP direct link");
  }
  return {admission:"P12_113_B01_WENDE7_CERTIFIED_OPERATOR_APPROVED",
    blocks:doc.blocks,answerSlots:7,standaloneTf:4,standaloneChoice:3,contextGroups:0};
}
