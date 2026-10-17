import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_HANLIN_NATIVE5_PATH="../data/question-bank/p12-g04s1-113-hanlin-native5-after100-public-v1.json";
export const P12_113_HANLIN_NATIVE5_SCHEMA="SCIENCE_P12_G04S1_113_HANLIN_NATIVE5_AFTER100_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-hanlin-native5-after100-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_DAHUA_MID_TF_007","089954b5b0736d81"],["P12_113_G04S1_DAHUA_MID_MC_014","9a6aec628122e69a"],["P12_113_G04S1_NEIHU_MID_TF_009","38041346735e757c"],["P12_113_G04S1_NEIHU_MID_TF_015","0518f1099a9e8b60"],["P12_113_G04S1_CHENGGONG_MID_TF_008","9613782cee0339fe"]]);
const SHA=new Map([["SCI_G04_S1_113_MID_016","06d7679909c6604c9daa3e838dd6d53a3470a0f5544261d1acebe59353c980b1"],["SCI_G04_S1_113_MID_017","e0ad91beef6d908d73cf7198769b844ce865cc00b66f5ab07bde1ea1ee9e4518"],["SCI_G04_S1_113_MID_018","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,m)=>{if(!ok)throw Error("P12_113_HANLIN_NATIVE5_FAIL_CLOSED: "+m);};
export function validateAndConvertP12113HanlinNative5(doc,authority){
 fail(doc?.schema_version===P12_113_HANLIN_NATIVE5_SCHEMA&&doc.public_site_integrated===true
 &&doc.expected_blocks===5&&doc.expected_answer_slots===5&&doc.expected_standalone_true_false===4&&doc.expected_standalone_choice===1
 &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="ORIGINAL_PDF_RAWDICT_EXACT_PRINTED_ANSWER_GLYPH_BBOX_SHA256"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===5,"exact source header");
 const ids=new Set(),slots=new Set();let tf=0,mc=0;
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id)&&SHA.get(b.source_id)===b.source_pdf_sha256,"source SHA+unique IDs");
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"original stem options scientific answer KP rights geometry immutable");
  ids.add(b.id);slots.add(b.source_slot_id);
  fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.source_page_pdf_1_based===1
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"PDF native original bbox");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.evidence_ref===EVIDENCE,"source-only operator and Article9 rights");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen 113 Kanghsuan direct 48KP");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"TF");}
  else if(b.type==="mcq"){mc++;fail(Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((x,i)=>typeof x==="string"&&x.startsWith(["①","②","③","④"][i]))
   &&["①","②","③","④"].includes(b.answer),"exact MC options");}
  else fail(false,"unsupported answer type");
 }
 fail(ids.size===5&&slots.size===5&&tf===4&&mc===1,"frozen five standalone source identities");
 return {admission:"P12_113_G04S1_HANLIN_NATIVE5_CERTIFIED",blocks:doc.blocks,answerSlots:5,standaloneTf:4,standaloneChoice:1,contextGroups:0};
}
