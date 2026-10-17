import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_NATIVE5_AFTER105_PATH="../data/question-bank/p12-g04s1-113-dongguang-dahua-native5-after105-public-v1.json";
export const P12_113_NATIVE5_AFTER105_SCHEMA="SCIENCE_P12_G04S1_113_NATIVE5_AFTER105_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-dongguang-dahua-native5-after105-formal-evidence-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_DONGGUANG_MID_TF_002","dc3a19154f910c33"],["P12_113_G04S1_DONGGUANG_MID_TF_012","33c2417e2d4a3505"],["P12_113_G04S1_DONGGUANG_MID_TF_015","260e3e9985b53dad"],["P12_113_G04S1_DAHUA_FINAL_MC_016","fe9033d3ba197d3c"],["P12_113_G04S1_DAHUA_FINAL_MC_021","a99da5eff079253f"]]);
const SOURCE_SHA=new Map([["SCI_G04_S1_113_MID_004","2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5"],["SCI_G04_S1_113_FINAL_010","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,m)=>{if(!ok)throw Error("P12_113_NATIVE5_AFTER105_FAIL_CLOSED: "+m);};
export function validateAndConvertP12113Native5After105(doc,authority){
 fail(doc?.schema_version===P12_113_NATIVE5_AFTER105_SCHEMA&&doc.public_site_integrated===true
 &&doc.expected_blocks===5&&doc.expected_answer_slots===5&&doc.expected_standalone_true_false===3&&doc.expected_standalone_choice===2
 &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="EXACT_NATIVE_PDF_RAWDICT_PRINTED_ANSWER_GLYPH_BBOX_SHA256"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===5,"exact source header");
 const ids=new Set(),slots=new Set();let tf=0,mc=0;
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id)&&SOURCE_SHA.get(b.source_id)===b.source_pdf_sha256,"source IDs/SHA/unique");
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"immutable original full stem options answer KP geometry rights");
  ids.add(b.id);slots.add(b.source_slot_id);
  fail(b.grade===4&&b.semester===1&&[1,2].includes(b.source_page_pdf_1_based)
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"original PDF answer glyph BBox");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"&&b.evidence_ref===EVIDENCE,"source-only operator/rights");
  const unit=resolveUnit(authority,b.unit);fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen direct 48 KP");
  if(b.type==="tf"){tf++;fail(b.unit==="4-S1-U02"&&["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"MID original TF");}
  else if(b.type==="mcq"){mc++;fail(b.unit==="4-S1-U03"&&Array.isArray(b.options)&&b.options.length===4
   &&b.options.every((x,i)=>typeof x==="string"&&x.startsWith(["①","②","③","④"][i]))
   &&["①","②","③","④"].includes(b.answer),"FINAL original MC");}
  else fail(false,"invalid type");
 }
 fail(ids.size===5&&slots.size===5&&tf===3&&mc===2,"frozen five independent original sources");
 return {admission:"P12_113_G04S1_NATIVE5_AFTER105_CERTIFIED",blocks:doc.blocks,answerSlots:5,standaloneTf:3,standaloneChoice:2,contextGroups:0};
}
