import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B07_LUSHANG_EXACT3_PATH="../data/question-bank/p12-g04s1-113-b07-lushang-exact3-standalone-public-v1.json";
export const P12_113_B07_LUSHANG_EXACT3_SCHEMA="SCIENCE_P12_G04S1_113_B07_LUSHANG_EXACT3_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b07-lushang-exact3-operator-approved-formal-v1.json";
const EXPECTED=[["P12_113_G04S1_B07_LUSHANG_TEXT3_001","SCI_G04_S1_113_MID_014|S3|G4|SINGLE_CHOICE_SUB|1","SCI_G04_S1_113_MID_014|S03|G04|MC|001","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",2,[308.2,514.4,346.6,527.4],"001","魚的鰓位於身體的哪一個部位呢？",["①尾巴","②軀幹","③頭","④鰭"],"③","sci_g04s1_02_08","魚的鰓位於頭部兩側的鰓腔內。"],["P12_113_G04S1_B07_LUSHANG_TEXT3_002","SCI_G04_S1_113_MID_014|S3|G4|SINGLE_CHOICE_SUB|3","SCI_G04_S1_113_MID_014|S03|G04|MC|003","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",2,[308.2,638.3,346.6,651.3],"003","在蝌蚪變成蛙的過程中，從來沒有使用下列哪一種構造呼吸呢？",["①呼吸管","②潮溼的皮膚","③肺","④鰓"],"①","sci_g04s1_02_09","蛙類生命史涉及蝌蚪鰓呼吸、成蛙肺與皮膚呼吸；題目所述外露呼吸管屬紅娘華等昆蟲，非蛙類。"],["P12_113_G04S1_B07_LUSHANG_TEXT3_003","SCI_G04_S1_113_MID_014|S3|G4|SINGLE_CHOICE_SUB|4","SCI_G04_S1_113_MID_014|S03|G04|MC|004","21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732",2,[308.2,719.7,346.6,732.6],"004","浮潛使用的呼吸管，和下列哪一種動物的呼吸構造相似？",["①蝦","②蝌蚪","③鯨","④紅娘華"],"④","sci_g04s1_02_09","紅娘華利用腹端細長的呼吸管伸至水面接觸空氣，和浮潛呼吸管功能相似。"]];
const fail=(ok,msg)=>{if(!ok)throw Error("P12_B07_LUSHANG_EXACT3_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12113B07LushangExact3(doc,authority){
 fail(doc?.schema_version===P12_113_B07_LUSHANG_EXACT3_SCHEMA
  &&doc.public_site_integrated===true&&doc.requires_operator_batch_manifest_approval===false
  &&doc.expected_blocks===3&&doc.expected_answer_slots===3
  &&doc.expected_standalone_true_false===0&&doc.expected_standalone_choice===3
  &&doc.expected_context_groups===0
  &&doc.original_teacher_answer_key_authenticated===false
  &&doc.source_exam_images_or_thirdparty_parent_included===false
  &&doc.source_original_pdf_SHA_NATIVE_BBOX_3_PLUS_SCAN5_DEDUP===true
  &&doc.evidence_ref===EVIDENCE&&doc.blocks?.length===3,
  "schema, admitted exact3 cohort or source rights");
 const ids=new Set(),sources=new Set();
 for(let i=0;i<3;i++){
  const b=doc.blocks[i],e=EXPECTED[i],[
   id,legacy,original,pdfSha,page,bbox,number,stem,options,answer,kp,reason
  ]=e;
  fail(b?.id===id&&!ids.has(b.id),"unique immutable student id #"+i);ids.add(b.id);
  fail(b.source_id==="SCI_G04_S1_113_MID_014"&&b.source_slot_id===legacy
     &&b.source_original_slot_id===original&&!sources.has(original)
     &&b.source_pdf_sha256===pdfSha
     &&b.source_page_pdf_1_based===page&&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
     &&b.original_question_number===number,"source SHA, native answer bbox and printed question #"+i);
  sources.add(original);
  fail(b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"
     &&b.canonical_kp_id===kp&&b.type==="mcq"
     &&b.stem===stem&&JSON.stringify(b.options)===JSON.stringify(options)
     &&b.answer===answer&&b.answer_explanation===reason,
     "unaltered complete original question, four options, unique science answer, frozen113 48 KP #"+i);
  fail(Array.isArray(b.options)&&b.options.length===4
     &&b.options.every((o,j)=>o.startsWith(["①","②","③","④"][j]))
     &&["①","②","③","④"].includes(b.answer)
     &&b.options.some(o=>o.startsWith(b.answer)),"four choices and keyed answer #"+i);
  fail(b.answer_assumption==="依113學年度原始學校考題與四個原始選項獨立推導科學答案；非原校教師答案表。沒有公開原文共用閱讀說明。"
    &&b.source==="P12_113_B07_LUSHANG_EXACT3_OPERATOR_APPROVED_PUBLIC"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false
    &&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_PARENT_OR_IMAGES"
    &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&b.evidence_ref===EVIDENCE
    &&!Object.hasOwn(b,"reading_parent")
    &&!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"),
    "operator approval, original question text-only Article9, no third party parent #"+i);
  const u=resolveUnit(authority,b.unit);
  fail(u?.grade===4&&u.semester===1&&u.unit_id==="U02"
   &&u.knowledge_points.some(x=>x.canonical_kp_id===kp),
   "113 48-KP direct midterm U02 authority #"+i);
 }
 fail(ids.size===3&&sources.size===3
   &&!Array.from(sources).some(s=>s.endsWith("|002")),
   "exact3 only, Q325 and all G02 image dependent remain excluded");
 return {admission:"P12_113_B07_LUSHANG_EXACT3_OPERATOR_APPROVED",blocks:doc.blocks,
  answerSlots:3,standaloneTf:0,standaloneChoice:3,contextGroups:0};
}
