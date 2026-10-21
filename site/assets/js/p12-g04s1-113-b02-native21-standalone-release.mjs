import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B02_NATIVE21_PATH="../data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json";
export const P12_113_B02_NATIVE21_SCHEMA="SCIENCE_P12_G04S1_113_B02_NATIVE21_STANDALONE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b02-exact21-operator-approved-formal-v1.json";
const EXPECTED=[["SCI_G04_S1_113_MID_004|S2|TF|6","SCI_G04_S1_113_MID_004|S02|TRUE_FALSE|06","2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5",1,[371.35,263.65,403.31,276.93],"tf","sci_g04s1_02_02","4-S1-U02","X","fc672e1239785e7b"],["SCI_G04_S1_113_MID_004|S2|TF|8","SCI_G04_S1_113_MID_004|S02|TRUE_FALSE|08","2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5",1,[371.35,336.52,403.31,349.8],"tf","sci_g04s1_02_02","4-S1-U02","O","e37d09cee9b3112e"],["SCI_G04_S1_113_MID_004|S2|TF|16","SCI_G04_S1_113_MID_004|S02|TRUE_FALSE|16","2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5",1,[371.35,627.9,403.31,641.18],"tf","sci_g04s1_02_14","4-S1-U02","O","b787579a412025ca"],["SCI_G04_S1_113_MID_004|S2|TF|18","SCI_G04_S1_113_MID_004|S02|TRUE_FALSE|18","2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5",1,[371.35,700.74,403.31,714.02],"tf","sci_g04s1_02_09","4-S1-U02","O","ccaa3f11aaf2ded7"],["SCI_G04_S1_113_MID_007|S1|TF|2","SCI_G04_S1_113_MID_007|S01|TRUE_FALSE|02","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,155.62,87.74,169.62],"tf","sci_g04s1_02_02","4-S1-U02","O","070fbf9ab138be7a"],["SCI_G04_S1_113_MID_007|S1|TF|6","SCI_G04_S1_113_MID_007|S01|TRUE_FALSE|06","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,381.46,87.74,395.46],"tf","sci_g04s1_02_14","4-S1-U02","O","983b096a2aa097c5"],["SCI_G04_S1_113_MID_007|S1|TF|8","SCI_G04_S1_113_MID_007|S01|TRUE_FALSE|08","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,472.49,87.74,486.49],"tf","sci_g04s1_02_02","4-S1-U02","X","2d4a781d80fdbfc8"],["SCI_G04_S1_113_MID_007|S1|TF|9","SCI_G04_S1_113_MID_007|S01|TRUE_FALSE|09","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,518.09,87.74,532.09],"tf","sci_g04s1_02_13","4-S1-U02","O","25be7194aca8a300"],["SCI_G04_S1_113_MID_007|S1|TF|13","SCI_G04_S1_113_MID_007|S01|TRUE_FALSE|13","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,700.12,84.6,714.12],"tf","sci_g04s1_02_02","4-S1-U02","X","f703aeb8e206451b"],["SCI_G04_S1_113_MID_007|S2|MC|1","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|01","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,777.28,80.01,792.77],"mcq","sci_g04s1_01_01","4-S1-U01","①","eb5599e960b1963f"],["SCI_G04_S1_113_MID_007|S2|MC|4","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|04","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[42.6,919.31,80.01,934.8],"mcq","sci_g04s1_01_04","4-S1-U01","②","52fe127d8e437130"],["SCI_G04_S1_113_MID_007|S2|MC|5","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|05","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[375.1,104.15,412.51,119.64],"mcq","sci_g04s1_02_02","4-S1-U02","③","455925cf4d8a0a21"],["SCI_G04_S1_113_MID_007|S2|MC|6","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|06","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[375.1,191.58,412.51,207.07],"mcq","sci_g04s1_02_08","4-S1-U02","①","7d07784c5256a8e6"],["SCI_G04_S1_113_MID_007|S2|MC|8","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|08","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[375.1,351.81,412.51,367.3],"mcq","sci_g04s1_02_04","4-S1-U02","②","e287e676ee9dc1cd"],["SCI_G04_S1_113_MID_007|S2|MC|13","SCI_G04_S1_113_MID_007|S02|SINGLE_CHOICE|13","6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",1,[382.3,899.7,419.5,915.19],"mcq","sci_g04s1_02_14","4-S1-U02","③","70e24a5b1e6253e5"],["SCI_G04_S1_113_MID_008|S1|TF|1","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|01","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,114.45,90.36,126.97],"tf","sci_g04s1_01_02","4-S1-U01","X","47c7cbd3d485380f"],["SCI_G04_S1_113_MID_008|S1|TF|4","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|04","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,205.53,90.36,218.05],"tf","sci_g04s1_02_14","4-S1-U02","O","ae1ad580a0dfb8ae"],["SCI_G04_S1_113_MID_008|S1|TF|5","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|05","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,241.89,90.36,254.41],"tf","sci_g04s1_02_02","4-S1-U02","O","74ca94d35d2d70c0"],["SCI_G04_S1_113_MID_008|S1|TF|6","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|06","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,278.37,90.36,290.89],"tf","sci_g04s1_02_07","4-S1-U02","O","20fcc12f320412a9"],["SCI_G04_S1_113_MID_008|S1|TF|10","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|10","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[36.72,387.6,84.72,400.12],"tf","sci_g04s1_02_14","4-S1-U02","O","ce427fe6e0485699"],["SCI_G04_S1_113_MID_008|S1|TF|11","SCI_G04_S1_113_MID_008|S01|TRUE_FALSE|11","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[36.72,424.08,84.72,436.6],"tf","sci_g04s1_02_08","4-S1-U02","O","a145a76d778fea29"]];
const FAIL=(condition,details)=>{if(!condition)throw Error("P12_113_B02_NATIVE21_FAIL_CLOSED: "+details);};
const MASK=(1n<<64n)-1n;
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&MASK;return h.toString(16).padStart(16,"0");};

export function validateAndConvertP12113B02Native21(doc,authority){
 FAIL(doc?.schema_version===P12_113_B02_NATIVE21_SCHEMA
   &&doc.public_site_integrated===true&&doc.requires_operator_batch_manifest_approval===false
   &&doc.expected_blocks===21&&doc.expected_answer_slots===21
   &&doc.expected_standalone_true_false===15&&doc.expected_standalone_choice===6
   &&doc.expected_context_groups===0
   &&doc.original_teacher_answer_key_authenticated===false
   &&doc.original_cropped_images_included===false
   &&doc.source_image_geometry_verified==="ORIGINAL_THREE_113_MID_PDF_SHA_NATIVE_ANSWER_BBOX_SIXPAGES_21"
   &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===21,
   "all 21 explicitly operator-approved school exams");
 const ids=new Set(),sources=new Set();
 for(const [i,b] of doc.blocks.entries()){
  const [sourceSlot,sourceOriginal,pdfSha,pdfPage,bbox,type,kp,unit,answer,hash]=EXPECTED[i];
  const id="P12_113_G04S1_B02_NATIVE21_"+String(i+1).padStart(3,"0");
  FAIL(b?.id===id&&b.source_slot_id===sourceSlot
   &&b.source_original_slot_id===sourceOriginal
   &&b.source_id===sourceSlot.split("|")[0]
   &&b.source_pdf_sha256===pdfSha
   &&b.source_page_pdf_1_based===pdfPage
   &&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
   &&b.original_question_number===sourceSlot.split("|").at(-1).padStart(3,"0")
   &&b.grade===4&&b.semester===1&&b.unit===unit
   &&b.type===type&&b.canonical_kp_id===kp&&b.answer===answer,
   "original school exact PDF SHA/native BBox, scope KP and science unique answer #"+i);
  FAIL(!ids.has(id)&&!sources.has(sourceSlot),"duplicate student or source ID");
  ids.add(id);sources.add(sourceSlot);
  FAIL(typeof b.stem==="string"&&b.stem.trim().length>=5
   &&typeof b.answer_explanation==="string"&&b.answer_explanation.trim().length>0
   &&typeof b.answer_assumption==="string"&&b.answer_assumption.includes("非原校教師答案表")
   &&b.source==="P12_113_B02_NATIVE21_OPERATOR_APPROVED_PUBLIC"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
   &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
   &&b.evidence_ref===EVIDENCE,
   "Article9 original exam question text only and one exact21 operator cohort");
  FAIL(type==="tf"?(!Object.hasOwn(b,"options")&&["O","X"].includes(answer)):
   (Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((text,j)=>typeof text==="string"&&text.startsWith(["①","②","③","④"][j]))
    &&["①","②","③","④"].includes(answer)),
   "full independent TF/MC options and answer #"+i);
  FAIL(fnv(JSON.stringify(b))===hash,"immutable exact source stem/options/Science/rights hash #"+i);
  const known=resolveUnit(authority,unit);
  FAIL(known?.grade===4&&known.semester===1
    &&["U01","U02"].includes(known.unit_id)
    &&known.knowledge_points.some(x=>x.canonical_kp_id===kp),
    "direct 113 G04S1 frozen 48KP U01 or U02 link #"+i);
 }
 return {admission:"P12_113_B02_NATIVE21_OPERATOR_APPROVED",
    blocks:doc.blocks,answerSlots:21,standaloneTf:15,standaloneChoice:6,contextGroups:0};
}
