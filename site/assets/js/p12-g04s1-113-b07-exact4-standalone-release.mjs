import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B07_EXACT4_PATH="../data/question-bank/p12-g04s1-113-b07-exact4-standalone-public-v1.json";
export const P12_113_B07_EXACT4_SCHEMA="SCIENCE_P12_G04S1_113_B07_EXACT4_CHILD_TEXT_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b07-exact4-operator-approved-formal-v1.json";
const EXPECTED=[["P12_113_G04S1_B07_EXACT4_TEXT_001","SCI_G04_S1_113_MID_013","SCI_G04_S1_113_MID_013|S7|G2|READING_SINGLE_CHOICE|2","SCI_G04_S1_113_MID_013|S07|G02|MC|002","f11b6245253aa0aa84ddcbcb84603ff6275d4945b2494645d2ff721715fc25fe",3,[318.91,664.17,342.16,678.21],"002","布袋蓮的氣室可以幫助葉片漂浮，與下列哪一種水生植物的構造類似？",["①睡蓮","②大萍","③水蘊草"],"②","sci_g04s1_02_04","大萍葉部氣室或疏鬆組織協助漂浮，與布袋蓮葉柄膨大含氣組織相似"],["P12_113_G04S1_B07_EXACT4_TEXT_002","SCI_G04_S1_113_MID_014","SCI_G04_S1_113_MID_014|S3|G7|SINGLE_CHOICE_SUB|1","SCI_G04_S1_113_MID_014|S03|G07|MC|001","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",3,[308.2,565,347.6,577.9],"001","玉黍螺適合在哪一種環境生存？",["①深海底","②低潮帶","③中潮帶","④高潮帶"],"④","sci_g04s1_02_02","原卷潮間帶條件下，玉黍螺適合高潮帶，能耐受較長時間離水"],["P12_113_G04S1_B07_EXACT4_TEXT_003","SCI_G04_S1_113_MID_014","SCI_G04_S1_113_MID_014|S3|G7|SINGLE_CHOICE_SUB|2","SCI_G04_S1_113_MID_014|S03|G07|MC|002","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",3,[308.2,617.2,347.6,630.2],"002","下列哪一種生物會利用羽毛狀的觸手捕食？",["①黑深蝦虎","②海蟑螂","③藤壺","④鯊魚"],"③","sci_g04s1_02_09","藤壺以羽狀蔓足濾食水中微小食物"],["P12_113_G04S1_B07_EXACT4_TEXT_004","SCI_G04_S1_113_MID_014","SCI_G04_S1_113_MID_014|S3|G7|SINGLE_CHOICE_SUB|3","SCI_G04_S1_113_MID_014|S03|G07|MC|003","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",3,[308.2,669.4,350.6,682.4],"003","哪一種環境在海水中的時間最長，有許多不能承受乾燥與高溫的生物生存？",["①低潮帶","②中潮帶","③高潮帶","④都一樣"],"①","sci_g04s1_02_02","低潮帶每次潮汐中的浸水時間最長，符合題幹條件"]];
const fail=(v,s)=>{if(!v)throw Error("P12_B07_EXACT4_FAIL_CLOSED: "+s)};
export function validateAndConvertP12113B07Exact4(d,a){
 fail(d?.schema_version===P12_113_B07_EXACT4_SCHEMA&&d.public_site_integrated===true
  &&d.requires_operator_batch_manifest_approval===false&&d.expected_blocks===4&&d.expected_answer_slots===4
  &&d.expected_standalone_true_false===0&&d.expected_standalone_choice===4&&d.expected_context_groups===0
  &&d.original_teacher_answer_key_authenticated===false&&d.source_exam_images_or_thirdparty_parent_included===false
  &&d.original_PDF_SHA_11348KP_NATIVE_BBOX_4_VERIFIED===true
  &&d.source_113_original_dups_and_114717_and_public745_checked===true
  &&JSON.stringify(d.source_original_answer_choices_counts)===JSON.stringify([3,4,4,4])
  &&d.evidence_ref===EVIDENCE&&d.blocks?.length===4,"public bank schema/count/rights");
 const ids=new Set(),originals=new Set();
 for(let i=0;i<4;i++){
  const b=d.blocks[i],[id,school,legacy,original,sha,page,bbox,no,stem,options,answer,kp,reason]=EXPECTED[i];
  fail(b?.id===id&&!ids.has(id),"immutable ID unique #"+i);ids.add(id);
  fail(b.source_id===school&&b.source_slot_id===legacy&&b.source_original_slot_id===original&&!originals.has(original)
   &&b.source_pdf_sha256===sha&&b.source_page_pdf_1_based===page
   &&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
   &&b.original_question_number===no,"original PDF SHA/source ID/native BBox #"+i);originals.add(original);
  fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.type==="mcq"
   &&b.canonical_kp_id===kp&&b.stem===stem&&JSON.stringify(b.options)===JSON.stringify(options)
   &&b.answer===answer&&b.answer_explanation===reason,"unchanged school question/choices/science/KP #"+i);
  fail(b.options.length===(i===0?3:4)
   &&b.options.every((o,j)=>o.startsWith(["①","②","③","④"][j]))
   &&b.options.some(o=>o.startsWith(b.answer)),"original 3/4 choices and answer #"+i);
  fail(b.answer_assumption==="依原卷題文和原始選項獨立科學判答，非原校教師答案；未展示原卷共用閱讀父題。"
   &&b.source==="P12_113_B07_EXACT4_TEXT_ONLY_OPERATOR_APPROVED_PUBLIC"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true
   &&b.copyright_path==="REGULATED_SCHOOL_EXAM_ARTICLE9_CHILD_TEXT_NO_SOURCE_PARENT_IMAGES"
   &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"&&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
   &&b.evidence_ref===EVIDENCE&&!Object.hasOwn(b,"reading_parent")&&!Object.hasOwn(b,"parent_original_text")
   &&!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"),"exam text-only no external parent, no teacher answers #"+i);
  const u=resolveUnit(a,b.unit);
  fail(u?.grade===4&&u.semester===1&&u.unit_id==="U02"&&u.knowledge_points.some(k=>k.canonical_kp_id===kp),"113 frozen48 direct KP #"+i);
 }
 const excluded=["SCI_G04_S1_113_MID_013|S07|G02|MC|001",
 "SCI_G04_S1_113_MID_014|S03|G04|MC|002",
 ...Array.from({length:6},(_,i)=>"SCI_G04_S1_113_MID_014|S03|G02|TF|"+String(i+1).padStart(3,"0")),
 "SCI_G04_S1_113_FINAL_010|S3|TF|7"];
 fail(ids.size===4&&originals.size===4&&!excluded.some(s=>originals.has(s)),"only exact authorized source IDs; Q305/Q325/G02six/TFMC1 held");
 return {admission:"P12_113_B07_EXACT4_OPERATOR_APPROVED",blocks:d.blocks,answerSlots:4,standaloneTf:0,standaloneChoice:4,contextGroups:0};
}
