import {resolveUnit} from "./authority-adapter.mjs";

export const P12_113_WENDE_NATIVE2_PATH="../data/question-bank/p12-g04s1-113-wende-mid-native2-after111-public-v1.json";
export const P12_113_WENDE_NATIVE2_SCHEMA="SCIENCE_P12_113_WENDE_MID_NATIVE2_AFTER111_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-wende-mid-native2-after111-formal-evidence-v1.json";
const PDF_SHA="7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56";
const ORIGINALS=[
  ["006","sci_g04s1_02_06",[28.56,366.42,60.52,379.37],"449bfa87b54d839e"],
  ["010","sci_g04s1_02_08",[28.56,652.39,60.52,665.34],"e0aa565893bd4f4d"]
];
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,reason)=>{if(!ok)throw Error("P12_113_WENDE_AFTER111_FAIL_CLOSED: "+reason);};

export function validateAndConvertP12113WendeNative2(doc,authority){
 fail(doc?.schema_version===P12_113_WENDE_NATIVE2_SCHEMA&&doc.public_site_integrated===true
   &&doc.expected_blocks===2&&doc.expected_answer_slots===2
   &&doc.expected_standalone_true_false===2&&doc.expected_standalone_choice===0
   &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
   &&doc.source_image_geometry_verified==="NATIVE_PDF_RAWDICT_PRINTED_BRACKET_SHA256_VERIFIED"
   &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===2,
   "exact two text-only school original source positions after 111");
 const seen=new Set();
 for(const [i,b] of doc.blocks.entries()){
   const [number,kp,bbox,proof]=ORIGINALS[i];
   fail(b?.id==="P12_113_G04S1_WENDE_MID_TF_"+number
     &&b.source_id==="SCI_G04_S1_113_MID_001"
     &&b.source_slot_id==="SCI_G04_S1_113_MID_001|S1|TF|"+number
     &&b.source_pdf_sha256===PDF_SHA&&b.original_question_number===number,
     "exact original Wende printed source identity");
   fail(fingerprint(JSON.stringify(b))===proof,"immutable original stem/answer/KP/BBox/operator/rights for "+number);
   fail(!seen.has(b.source_slot_id),"duplicate original source");
   seen.add(b.source_slot_id);
   fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"
      &&b.source_page_pdf_1_based===1&&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox),
      "exact native PDF original answer glyph bbox");
   fail(b.type==="tf"&&b.answer==="X"&&!Object.hasOwn(b,"options"),"science answer X and TF no options");
   fail(b.operator_publication_approval===true&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
      &&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
      &&b.original_cropped_assets_included===false
      &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
      &&b.evidence_ref===EVIDENCE,
      "existing operator/rights/source provenance");
   const unit=resolveUnit(authority,b.unit);
   fail(unit?.grade===4&&unit.semester===1
       &&b.canonical_kp_id===kp
       &&unit.knowledge_points.some(k=>k.canonical_kp_id===kp),
       "direct frozen 113 Kanghsuan U02 48 KP");
 }
 return {admission:"P12_113_G04S1_WENDE_NATIVE2_AFTER111",blocks:doc.blocks,
   answerSlots:2,standaloneTf:2,standaloneChoice:0,contextGroups:0};
}
