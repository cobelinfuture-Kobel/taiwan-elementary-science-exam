import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B05_NATIVE24_PATH="../data/question-bank/p12-g04s1-113-b05-native24-standalone-public-v1.json";
export const P12_113_B05_NATIVE24_SCHEMA="SCIENCE_P12_G04S1_113_B05_NATIVE24_STANDALONE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b05-exact24-operator-approved-formal-v1.json";
const EXPECTED=[["SCI_G04_S1_113_MID_015|S1|TF|6","SCI_G04_S1_113_MID_015|S01|TRUE_FALSE|06","P12_113_G04S1_B05_NATIVE24_001","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[28.32,226.09,58.32,238.09],"X","sci_g04s1_01_10","0a9ed3a64c48b897"],["SCI_G04_S1_113_MID_015|S1|TF|7","SCI_G04_S1_113_MID_015|S01|TRUE_FALSE|07","P12_113_G04S1_B05_NATIVE24_002","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[28.32,244.09,58.32,256.09],"X","sci_g04s1_02_07","ffb5260eb1ebe6b1"],["SCI_G04_S1_113_MID_015|S1|TF|11","SCI_G04_S1_113_MID_015|S01|TRUE_FALSE|11","P12_113_G04S1_B05_NATIVE24_003","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[28.32,334.12,58.32,346.12],"X","sci_g04s1_02_02","7bd4150e09a8fd71"],["SCI_G04_S1_113_MID_015|S2|MC|1","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|01","P12_113_G04S1_B05_NATIVE24_004","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[28.32,370.12,58.32,382.12],"①","sci_g04s1_02_09","3151b6fa6f95ea4c"],["SCI_G04_S1_113_MID_015|S2|MC|3","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|03","P12_113_G04S1_B05_NATIVE24_005","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[28.32,442.12,58.32,454.12],"①","sci_g04s1_02_08","3869f654b1391eb4"],["SCI_G04_S1_113_MID_015|S2|MC|9","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|09","P12_113_G04S1_B05_NATIVE24_006","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[297.77,136.09,327.77,148.09],"①","sci_g04s1_02_02","b69758fc7abeaf50"],["SCI_G04_S1_113_MID_015|S2|MC|10","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|10","P12_113_G04S1_B05_NATIVE24_007","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[297.77,190.09,327.77,202.09],"③","sci_g04s1_02_04","90b07f598177c9d5"],["SCI_G04_S1_113_MID_015|S2|MC|15","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|15","P12_113_G04S1_B05_NATIVE24_008","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[297.77,478.14,327.77,490.14],"③","sci_g04s1_01_09","4e4cd6621af5725f"],["SCI_G04_S1_113_MID_015|S2|MC|16","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|16","P12_113_G04S1_B05_NATIVE24_009","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[297.77,532.14,327.77,544.14],"①","sci_g04s1_01_10","54e5d16a3156bf29"],["SCI_G04_S1_113_MID_015|S2|MC|17","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|17","P12_113_G04S1_B05_NATIVE24_010","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",1,[297.77,586.14,327.77,598.14],"②","sci_g04s1_01_02","eab226b8c8d4c7ba"],["SCI_G04_S1_113_MID_015|S2|MC|20","SCI_G04_S1_113_MID_015|S02|SINGLE_CHOICE|20","P12_113_G04S1_B05_NATIVE24_011","a41182e3c4058c91b48bb5e017b944fa7fabb2f32c85673a2e8d2154261d2c7e",2,[28.32,31.31,58.32,43.31],"①","sci_g04s1_02_07","b0f6db48be239f95"],["SCI_G04_S1_113_FINAL_006|S1|TF|1","SCI_G04_S1_113_FINAL_006|S01|TRUE_FALSE|01","P12_113_G04S1_B05_NATIVE24_012","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[30.12,189.41,65.22,203.45],"X","sci_g04s1_03_03","4718722236ede023"],["SCI_G04_S1_113_FINAL_006|S1|TF|7","SCI_G04_S1_113_FINAL_006|S01|TRUE_FALSE|07","P12_113_G04S1_B05_NATIVE24_013","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[30.12,426.2,65.22,440.24],"X","sci_g04s1_04_01","c629d032615dcb2f"],["SCI_G04_S1_113_FINAL_006|S1|TF|14","SCI_G04_S1_113_FINAL_006|S01|TRUE_FALSE|14","P12_113_G04S1_B05_NATIVE24_014","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[30.12,735.82,65.22,749.86],"X","sci_g04s1_03_06","8cc78606c6c3eb6d"],["SCI_G04_S1_113_FINAL_006|S1|TF|15","SCI_G04_S1_113_FINAL_006|S01|TRUE_FALSE|15","P12_113_G04S1_B05_NATIVE24_015","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[30.12,790.45,65.22,804.49],"X","sci_g04s1_04_02","7f583f480633858d"],["SCI_G04_S1_113_FINAL_006|S2|MC|3","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|03","P12_113_G04S1_B05_NATIVE24_016","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,335.12,412.93,349.16],"②","sci_g04s1_03_08","3d3ab6ab383b72ef"],["SCI_G04_S1_113_FINAL_006|S2|MC|4","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|04","P12_113_G04S1_B05_NATIVE24_017","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,389.72,412.93,403.76],"①","sci_g04s1_03_07","6103b5534c713d01"],["SCI_G04_S1_113_FINAL_006|S2|MC|5","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|05","P12_113_G04S1_B05_NATIVE24_018","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,462.56,412.93,476.6],"③","sci_g04s1_03_09","e5bdcfb0a5beac5b"],["SCI_G04_S1_113_FINAL_006|S2|MC|7","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|07","P12_113_G04S1_B05_NATIVE24_019","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,590.14,412.93,604.18],"④","sci_g04s1_04_03","4e71c463c45e7f4a"],["SCI_G04_S1_113_FINAL_006|S2|MC|9","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|09","P12_113_G04S1_B05_NATIVE24_020","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,681.1,412.93,695.14],"②","sci_g04s1_04_04","2ae6ddc327cfa5de"],["SCI_G04_S1_113_FINAL_006|S2|MC|11","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|11","P12_113_G04S1_B05_NATIVE24_021","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",1,[377.83,808.69,412.93,822.73],"②","sci_g04s1_04_10","1563657e31306bb0"],["SCI_G04_S1_113_FINAL_006|S2|MC|13","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|13","P12_113_G04S1_B05_NATIVE24_022","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",2,[36.84,58.23,71.94,72.27],"③","sci_g04s1_03_07","5903e7e3ed026f37"],["SCI_G04_S1_113_FINAL_006|S2|MC|14","SCI_G04_S1_113_FINAL_006|S02|SINGLE_CHOICE|14","P12_113_G04S1_B05_NATIVE24_023","4869f4f4331e8eacbde0909f945380ab7178a2c81d38cef2eb4b9fd484e72d89",2,[36.84,131.09,71.94,145.13],"②","sci_g04s1_03_05","5bf8f1b76c67cb5f"],["SCI_G04_S1_113_MID_018|S1|TF|2","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|02","P12_113_G04S1_B05_NATIVE24_024","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,101.99,79.52,117.53],"X","sci_g04s1_02_07","180f4b26e7676ac2"]];
const fail=(ok,why)=>{if(!ok)throw Error("P12_B05_EXACT24_FAIL_CLOSED: "+why);};
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&((1n<<64n)-1n);return h.toString(16).padStart(16,"0");};
export function validateAndConvertP12113B05Native24(doc,authority){
 fail(doc?.schema_version===P12_113_B05_NATIVE24_SCHEMA&&doc.public_site_integrated===true
  &&doc.requires_operator_batch_manifest_approval===false&&doc.expected_blocks===24
  &&doc.expected_answer_slots===24&&doc.expected_standalone_true_false===8
  &&doc.expected_standalone_choice===16&&doc.expected_context_groups===0
  &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="ORIGINAL_3_113_PAPERS_PDF_SHA_NATIVE_ANSWER_BBOX_24_PLUS_SCAN5_DEDUP"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===24,
  "operator-approved exact24 source and rights scope");
 const ids=new Set();let tf=0,mc=0;
 for(const [i,b] of doc.blocks.entries()){
  const [sourceSlot,sourceOriginal,id,pdfSha,pdfPage,bbox,answer,kp,hash]=EXPECTED[i];
  const isTF=sourceSlot.includes("|TF|"),unit="4-S1-U"+kp.split("_")[2],num=sourceSlot.split("|").at(-1);
  fail(!ids.has(sourceSlot),"repeated source ID");ids.add(sourceSlot);
  fail(b?.id===id&&b.source_id===sourceSlot.split("|")[0]&&b.source_slot_id===sourceSlot
    &&b.source_original_slot_id===sourceOriginal&&b.source_pdf_sha256===pdfSha
    &&b.source_page_pdf_1_based===pdfPage&&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
    &&b.original_question_number===num.padStart(3,"0")
    &&b.grade===4&&b.semester===1&&b.unit===unit&&b.canonical_kp_id===kp
    &&b.answer===answer&&b.type===(isTF?"tf":"mcq"),"original source SHA/native BBox, Science unique answer and direct 113 frozen KP #"+i);
  fail(typeof b.stem==="string"&&b.stem.trim().length>3
    &&typeof b.answer_explanation==="string"&&b.answer_explanation.length>0
    &&typeof b.answer_assumption==="string"&&b.answer_assumption.includes("非原校教師答案表")
    &&b.source==="P12_113_B05_NATIVE24_OPERATOR_APPROVED_PUBLIC"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
    &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&b.evidence_ref===EVIDENCE&&!Object.hasOwn(b,"score")&&!Object.hasOwn(b,"points"),
    "operator approval and Article9 school QUESTION TEXT ONLY #"+i);
  fail(isTF?!Object.hasOwn(b,"options")&&["O","X"].includes(answer):
    Array.isArray(b.options)&&b.options.length===4&&b.options.every((x,j)=>typeof x==="string"&&x.startsWith(["①","②","③","④"][j]))
     &&["①","②","③","④"].includes(answer),"full original TF or ordered MC four options #"+i);
  fail(fnv(JSON.stringify(b))===hash,"original full question/options/correct answer/KP/rights immutable hash #"+i);
  const ku=resolveUnit(authority,unit);
  const allowed=isTF||!isTF;
  fail(allowed&&ku?.grade===4&&ku.semester===1
    &&(sourceSlot.includes("_MID_")?["U01","U02"]:["U03","U04"]).includes(ku.unit_id)
    &&ku.knowledge_points.some(x=>x.canonical_kp_id===kp),"proper MID or FINAL direct 113 frozen KP #"+i);
  isTF?tf++:mc++;
 }
 fail(tf===8&&mc===16&&ids.size===24,"exact approved8TF 16MC cohort");
 return {admission:"P12_113_B05_NATIVE24_OPERATOR_APPROVED",blocks:doc.blocks,answerSlots:24,standaloneTf:8,standaloneChoice:16,contextGroups:0};
}
