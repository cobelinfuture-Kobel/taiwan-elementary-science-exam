import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_SELECTIVE_FINAL16_PATH="../data/question-bank/p12-g04s1-113-selective-final16-public-v1.json";
export const P12_113_SELECTIVE_FINAL16_SCHEMA="SCIENCE_P12_G04S1_113_SELECTIVE_FINAL16_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-selective-final16-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_ANHE_FINAL_TF_002","128f959dd69286c6"],["P12_113_G04S1_ANHE_FINAL_TF_003","04af9ed351f1f16c"],["P12_113_G04S1_ANHE_FINAL_TF_004","84eabefadd2da070"],["P12_113_G04S1_ANHE_FINAL_TF_005","c8540641d98c68e2"],["P12_113_G04S1_ANHE_FINAL_TF_006","4bc4a4fd69c598ac"],["P12_113_G04S1_ANHE_FINAL_TF_008","989de2a398412d05"],["P12_113_G04S1_ANHE_FINAL_TF_009","65ca4ac1ae1e01d6"],["P12_113_G04S1_ANHE_FINAL_TF_010","36749f11a533523e"],["P12_113_G04S1_ANHE_FINAL_TF_012","715cdb2971539a34"],["P12_113_G04S1_ANHE_FINAL_TF_013","dd5db8d11b1ede14"],["P12_113_G04S1_YONGAN_FINAL_TF_002","124ffce138de3322"],["P12_113_G04S1_YONGAN_FINAL_TF_003","d1901ee5000c5f90"],["P12_113_G04S1_YONGAN_FINAL_TF_004","16be02097cd33e8a"],["P12_113_G04S1_YONGAN_FINAL_TF_005","0f371789e040d512"],["P12_113_G04S1_YONGAN_FINAL_TF_006","f7c33366ba3eaad6"],["P12_113_G04S1_MINQUAN_FINAL_TF_001","1e9da28b653739ec"]]);
const MASK=(1n<<64n)-1n;
const fp=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,why)=>{if(!ok)throw Error("P12_113_FINAL16_FAIL_CLOSED: "+why);};
export function validateAndConvertP12113Final16(doc,authority){
fail(doc?.schema_version===P12_113_SELECTIVE_FINAL16_SCHEMA&&doc.public_site_integrated===true
&&doc.expected_blocks===16&&doc.expected_answer_slots===16&&doc.expected_standalone_true_false===16
&&doc.expected_standalone_choice===0&&doc.original_teacher_answer_key_authenticated===false
&&doc.original_cropped_images_included===false&&doc.source_image_geometry_verified==="NATIVE_PDF_GLYPH_BBOX_SHA256_AND_MODEL_QA"
&&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===16,"header");
const ids=new Set(),sources=new Set();
for(const b of doc.blocks){
fail(b&&EXPECTED.has(b.id)&&!ids.has(b.id)&&!sources.has(b.source_slot_id),"immutable unique source ids");
ids.add(b.id);sources.add(b.source_slot_id);
fail(fp(JSON.stringify(b))===EXPECTED.get(b.id),"immutable SHA/answer/KP/stem/BBox/rights/explanation");
fail(b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1
&&b.type==="tf"&&["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"original standalone TF");
fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&
b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","operator/source rights");
const unit=resolveUnit(authority,b.unit);
fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(x=>x.canonical_kp_id===b.canonical_kp_id),"KP authority");
}
fail(ids.size===16,"item count");
return {admission:"P12_113_G04S1_FINAL16_CERTIFIED",blocks:doc.blocks,answerSlots:16,standaloneTf:16,standaloneChoice:0,contextGroups:0};
}
