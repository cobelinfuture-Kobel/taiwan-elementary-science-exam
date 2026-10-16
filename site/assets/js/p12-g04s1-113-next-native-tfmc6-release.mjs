import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_NEXT_NATIVE6_PATH="../data/question-bank/p12-g04s1-113-next-native-tfmc6-public-v1.json";
export const P12_113_NEXT_NATIVE6_SCHEMA="SCIENCE_P12_G04S1_113_NEXT_NATIVE_TFMC6_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-next-native-tfmc6-formal-source-science-kp-v1.json";
const expected=new Map([["P12_113_G04S1_ZHONGXIAO_MID_TF_008","f4b31a814cb6ef93"],["P12_113_G04S1_ZHONGXIAO_MID_MC_005","9b0830c003140570"],["P12_113_G04S1_ZHONGXIAO_MID_MC_007","65a8b731e02865ae"],["P12_113_G04S1_DONGGUANG_FINAL_MC_001","105e91b6c24964e4"],["P12_113_G04S1_DONGGUANG_FINAL_MC_005","8f195f27cc017121"],["P12_113_G04S1_DONGGUANG_FINAL_TF_006","8c925c6cdc1c453c"]]);
const sha=new Map([["SCI_G04_S1_113_MID_003","ed7b11e5c0d0f06f55645c67ad67e6cf08bf4b4cd3eec7445837c93f5ad1d439"],["SCI_G04_S1_113_FINAL_003","ab493a979e72a24c9f2e1cbce2eb11295e783beb6f11723ca5ffcb73801f1dbc"]]);
const MASK=(1n<<64n)-1n;
const fp=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};
const fail=(ok,msg)=>{if(!ok)throw Error("P12_113_NEXT_NATIVE6_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113NextNative6(doc,authority){
 fail(doc?.schema_version===P12_113_NEXT_NATIVE6_SCHEMA&&doc.public_site_integrated===true&&doc.expected_blocks===6&&doc.expected_answer_slots===6&&doc.expected_standalone_true_false===2&&doc.expected_standalone_choice===4&&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false&&doc.source_image_geometry_verified==="ORIGINAL_PDF_SHA256_NATIVE_RAWDICT_PRINTED_ANSWER_BBOX"&&doc.evidence_ref===EVIDENCE&&doc.blocks?.length===6,"immutable header");
 const ids=new Set(),slots=new Set();let tf=0,mc=0;
 for(const b of doc.blocks){
  fail(expected.has(b.id)&&!ids.has(b.id)&&!slots.has(b.source_slot_id)&&sha.get(b.source_id)===b.source_pdf_sha256,"source and unique IDs");ids.add(b.id);slots.add(b.source_slot_id);
  fail(fp(JSON.stringify(b))===expected.get(b.id),"immutable source/stem/options/science/KP/rights");
  fail(b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1&&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4&&b.source_pdf_bbox_pts_top_left.every(Number.isFinite),"real PDF bbox");
  fail(b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"&&b.evidence_ref===EVIDENCE,"frozen operator & rights");
  const u=resolveUnit(authority,b.unit);fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"direct frozen KP");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!b.options,"TF source");}
  else if(b.type==="mcq"){mc++;fail(Array.isArray(b.options)&&b.options.length===4&&b.options.every((o,i)=>o.startsWith(["①","②","③","④"][i]))&&["①","②","③","④"].includes(b.answer),"MC source");}else fail(false,"type");
 }
 fail(ids.size===6&&slots.size===6&&tf===2&&mc===4,"frozen six release");
 return {admission:"P12_113_G04S1_NEXT_NATIVE6_CERTIFIED",blocks:doc.blocks,answerSlots:6,standaloneTf:2,standaloneChoice:4,contextGroups:0};
}
