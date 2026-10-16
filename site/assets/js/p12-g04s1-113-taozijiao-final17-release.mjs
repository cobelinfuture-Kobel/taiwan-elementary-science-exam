import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_TAOZIJIAO_FINAL17_PATH="../data/question-bank/p12-g04s1-113-taozijiao-final17-public-v1.json";
export const P12_113_TAOZIJIAO_FINAL17_SCHEMA="SCIENCE_P12_G04S1_113_TAOZIJIAO_FINAL17_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-taozijiao-final17-formal-source-science-kp-v1.json";
const EXPECTED=new Map([["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G01_003","29abbeb83e2b725f"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G01_006","cb61e4c6ffcb344d"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G02_001","59ae4c0dfaccba16"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G02_004","593a077378516fa0"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G02_006","b13cb75afd53ec55"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G03_002","687a5614444e84e0"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G03_003","936cbcfd18fbb922"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G03_005","68bba42c685d0dde"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G03_007","5c8affc803835093"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G04_002","d37fd2eba31d6940"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G04_004","18219c7974e05781"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G04_005","94a96112f206c516"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G05_006","ed39d8ca8043e6f2"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G05_007","e8974c300d54e12d"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G06_004","d26fe2845bd89db8"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G06_006","6b7e9b5e9631a174"],["P12_113_G04S1_TAOZIJIAO_FINAL_TF_G06_007","9c9e33b0744c8352"]]);
const MASK=(1n<<64n)-1n;
const fingerprint=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_TAOZIJIAO_FINAL17_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113TaizijiaoFinal17(doc,authority){
 fail(doc?.schema_version===P12_113_TAOZIJIAO_FINAL17_SCHEMA&&doc.public_site_integrated===true
 &&doc.expected_blocks===17&&doc.expected_answer_slots===17&&doc.expected_standalone_true_false===17&&doc.expected_standalone_choice===0
 &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="ORIGINAL_PDF_RAWDICT_EXACT_BRACKET_GLYPH_BBOX"
 &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===17,"source certified header");
 const sourceIDs=new Set(),questionIDs=new Set();
 for(const b of doc.blocks){
  fail(b&&EXPECTED.has(b.id)&&!sourceIDs.has(b.source_slot_id)&&!questionIDs.has(b.id),"published identities cannot overlap");
  sourceIDs.add(b.source_slot_id);questionIDs.add(b.id);
  fail(fingerprint(JSON.stringify(b))===EXPECTED.get(b.id),"science/KP/source/original text and glyph/rights immutable");
  fail(b.type==="tf"&&b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1
    &&["O","X"].includes(b.answer)&&!Object.hasOwn(b,"options"),"original independent TF source");
  fail(b.source_id==="SCI_G04_S1_113_FINAL_008"&&b.source_pdf_sha256==="59a1b5ee713f6cc96e47f1db1c9111918f67c6fd9bacecd64c9ad56a16db6ed3","frozen PDF source");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights and operator");
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"frozen original KP");
 }
 fail(sourceIDs.size===17,"count");
 return {admission:"P12_113_G04S1_TAOZIJIAO_FINAL17_CERTIFIED",blocks:doc.blocks,answerSlots:17,standaloneTf:17,standaloneChoice:0,contextGroups:0};
}
