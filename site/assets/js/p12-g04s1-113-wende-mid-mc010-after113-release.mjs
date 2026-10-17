import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_WENDE_MC010_AFTER113_PATH="../data/question-bank/p12-g04s1-113-wende-mid-mc010-after113-public-v1.json";
export const P12_113_WENDE_MC010_AFTER113_SCHEMA="SCIENCE_P12_113_G04S1_WENDE_MID_MC010_AFTER113_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-wende-mid-mc010-after113-formal-evidence-v1.json";
const SHA="7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56";
const SOURCE="SCI_G04_S1_113_MID_001|S2|MC|010";
const FINGERPRINT="5f595eb6e975d904";
const BBOX=[428.04,788.23,460,801.18];
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,m)=>{if(!ok)throw Error("P12_113_WENDE_MC010_AFTER113_FAIL_CLOSED: "+m);};
export function validateAndConvertP12113WendeMC010After113(doc,authority){
 fail(doc?.schema_version===P12_113_WENDE_MC010_AFTER113_SCHEMA&&doc.public_site_integrated===true&&doc.expected_blocks===1&&doc.expected_answer_slots===1&&doc.expected_standalone_true_false===0&&doc.expected_standalone_choice===1&&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false&&doc.source_image_geometry_verified==="NATIVE_PDF_RAWDICT_PRINTED_BRACKET_SHA256_VERIFIED"&&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===1,"frozen bank header");
 const b=doc.blocks[0];
 fail(b?.id==="P12_113_G04S1_WENDE_MID_MC_010"&&b.source_id==="SCI_G04_S1_113_MID_001"&&b.source_slot_id===SOURCE&&b.source_pdf_sha256===SHA&&fingerprint(JSON.stringify(b))===FINGERPRINT,"immutable source stem options answer KP rights and bbox");
 fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.source_page_pdf_1_based===1&&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(BBOX)&&b.canonical_kp_id==="sci_g04s1_02_02","original geometry and frozen direct KP");
 fail(b.type==="mcq"&&b.answer==="③"&&Array.isArray(b.options)&&b.options.length===4&&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i])),"original MC options answer");
 fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"&&b.evidence_ref===EVIDENCE,"existing rights operator gate");
 const u=resolveUnit(authority,b.unit);fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen KP authority");
 return {admission:"P12_113_G04S1_WENDE_MC010_AFTER113_CERTIFIED",blocks:[b],answerSlots:1,standaloneTf:0,standaloneChoice:1,contextGroups:0};
}
