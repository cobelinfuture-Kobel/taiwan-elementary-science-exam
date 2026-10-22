import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B03_NATIVE27_PATH="../data/question-bank/p12-g04s1-113-b03-native27-standalone-public-v1.json";
export const P12_113_B03_NATIVE27_SCHEMA="SCIENCE_P12_G04S1_113_B03_NATIVE27_STANDALONE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b03-exact27-operator-approved-formal-v1.json";
const EXPECTED=[["SCI_G04_S1_113_MID_008|S2|MC|3","P12_113_G04S1_B03_NATIVE27_001","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,567.6,90.36,580.12],"①","sci_g04s1_01_07","20020b60f48507db"],["SCI_G04_S1_113_MID_008|S2|MC|4","P12_113_G04S1_B03_NATIVE27_002","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,622.22,90.36,634.74],"③","sci_g04s1_01_01","60a5103e653376c8"],["SCI_G04_S1_113_MID_008|S2|MC|7","P12_113_G04S1_B03_NATIVE27_003","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,749.78,90.36,762.3],"②","sci_g04s1_02_02","08ad45e34c30bc05"],["SCI_G04_S1_113_MID_008|S2|MC|8","P12_113_G04S1_B03_NATIVE27_004","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,804.38,90.36,816.9],"③","sci_g04s1_02_14","e14fdf35696d0a24"],["SCI_G04_S1_113_MID_008|S2|MC|9","P12_113_G04S1_B03_NATIVE27_005","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[42.36,859.01,90.36,871.53],"②","sci_g04s1_02_02","020c1aacda7d66fe"],["SCI_G04_S1_113_MID_008|S2|MC|10","P12_113_G04S1_B03_NATIVE27_006","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[36.72,913.73,84.72,926.25],"④","sci_g04s1_02_04","bb84f07f5aa9c430"],["SCI_G04_S1_113_MID_008|S2|MC|11","P12_113_G04S1_B03_NATIVE27_007","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[36.72,968.33,84.72,980.85],"④","sci_g04s1_02_03","240bc1dc6246a87a"],["SCI_G04_S1_113_MID_008|S2|MC|12","P12_113_G04S1_B03_NATIVE27_008","2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105",1,[36.72,1039.01,84.72,1051.53],"③","sci_g04s1_02_10","6279ccd8eaaf202a"],["SCI_G04_S1_113_MID_009|S1|TF|1","P12_113_G04S1_B03_NATIVE27_009","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,189.41,61.62,203.45],"O","sci_g04s1_01_02","a3ccd767dc6aaa44"],["SCI_G04_S1_113_MID_009|S1|TF|2","P12_113_G04S1_B03_NATIVE27_010","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,225.89,61.62,239.93],"O","sci_g04s1_02_11","20d9ab25e5e49e9d"],["SCI_G04_S1_113_MID_009|S1|TF|3","P12_113_G04S1_B03_NATIVE27_011","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,280.49,61.62,294.53],"X","sci_g04s1_02_14","d72cd060a8788d13"],["SCI_G04_S1_113_MID_009|S1|TF|5","P12_113_G04S1_B03_NATIVE27_012","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,371.6,61.62,385.64],"X","sci_g04s1_01_05","2903c4ac2851c56a"],["SCI_G04_S1_113_MID_009|S1|TF|6","P12_113_G04S1_B03_NATIVE27_013","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,407.96,61.62,422],"X","sci_g04s1_02_02","e26e9591bdef2b44"],["SCI_G04_S1_113_MID_009|S1|TF|7","P12_113_G04S1_B03_NATIVE27_014","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,444.44,61.62,458.48],"X","sci_g04s1_01_02","8dda8c7a60a466d8"],["SCI_G04_S1_113_MID_009|S1|TF|9","P12_113_G04S1_B03_NATIVE27_015","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,517.3,61.62,531.34],"X","sci_g04s1_02_09","58855eafccd66fae"],["SCI_G04_S1_113_MID_009|S1|TF|10","P12_113_G04S1_B03_NATIVE27_016","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,553.66,61.62,567.7],"X","sci_g04s1_01_09","83f74296275a2ed3"],["SCI_G04_S1_113_MID_009|S1|TF|11","P12_113_G04S1_B03_NATIVE27_017","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,590.14,61.62,604.18],"X","sci_g04s1_02_14","b61296f1286892a7"],["SCI_G04_S1_113_MID_009|S1|TF|12","P12_113_G04S1_B03_NATIVE27_018","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[33.6,626.5,61.62,640.54],"X","sci_g04s1_02_03","bfdb6be351c42cc4"],["SCI_G04_S1_113_MID_009|S2|MC|4","P12_113_G04S1_B03_NATIVE27_019","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[381.41,173.69,409.45,187.73],"①","sci_g04s1_02_14","65a017a3d418bad8"],["SCI_G04_S1_113_MID_009|S2|MC|5","P12_113_G04S1_B03_NATIVE27_020","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[381.41,265.73,409.45,279.77],"③","sci_g04s1_01_05","a0bbe272180c2347"],["SCI_G04_S1_113_MID_009|S2|MC|6","P12_113_G04S1_B03_NATIVE27_021","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[381.41,357.8,409.45,371.84],"②","sci_g04s1_02_02","7a17e695a9200f94"],["SCI_G04_S1_113_MID_009|S2|MC|11","P12_113_G04S1_B03_NATIVE27_022","abcb3ca564a0afe3ef6f4533ecb1c906c67fac3017aabde4d9948602175f4461",1,[381.41,633.82,409.45,647.86],"④","sci_g04s1_01_04","f439afbbbfc5a9c0"],["SCI_G04_S1_113_MID_010|S2|MC|1","P12_113_G04S1_B03_NATIVE27_023","32706ffe6016a6f857244ee2b94f35b31e20e9b11d5beff103b86dfb3f5ba1f8",1,[42.24,653.1,90.26,665.1],"③","sci_g04s1_02_02","e1647ced9780ce23"],["SCI_G04_S1_113_MID_010|S2|MC|2","P12_113_G04S1_B03_NATIVE27_024","32706ffe6016a6f857244ee2b94f35b31e20e9b11d5beff103b86dfb3f5ba1f8",1,[42.24,734.94,90.26,746.94],"④","sci_g04s1_02_08","8e5a55737e27a259"],["SCI_G04_S1_113_MID_010|S2|MC|3","P12_113_G04S1_B03_NATIVE27_025","32706ffe6016a6f857244ee2b94f35b31e20e9b11d5beff103b86dfb3f5ba1f8",1,[42.24,798.57,90.26,810.57],"②","sci_g04s1_02_02","bc2167aa310b0b40"],["SCI_G04_S1_113_MID_010|S2|MC|6","P12_113_G04S1_B03_NATIVE27_026","32706ffe6016a6f857244ee2b94f35b31e20e9b11d5beff103b86dfb3f5ba1f8",1,[374.59,175.69,422.59,187.69],"③","sci_g04s1_02_03","6f24de98158a2c4a"],["SCI_G04_S1_113_MID_010|S2|MC|8","P12_113_G04S1_B03_NATIVE27_027","32706ffe6016a6f857244ee2b94f35b31e20e9b11d5beff103b86dfb3f5ba1f8",1,[374.59,357.52,422.59,369.52],"③","sci_g04s1_02_07","ab89ac32c59fe482"]];
const fail=(ok,why)=>{if(!ok)throw Error("P12_B03_EXACT27_FAIL_CLOSED: "+why)};
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&((1n<<64n)-1n);return h.toString(16).padStart(16,"0")};
export function validateAndConvertP12113B03Native27(doc,authority){
 fail(doc?.schema_version===P12_113_B03_NATIVE27_SCHEMA
 &&doc.public_site_integrated===true&&doc.requires_operator_batch_manifest_approval===false
 &&doc.expected_blocks===27&&doc.expected_answer_slots===27
 &&doc.expected_standalone_true_false===10&&doc.expected_standalone_choice===17
 &&doc.expected_context_groups===0
 &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
 &&doc.source_image_geometry_verified==="ORIGINAL_THREE_113_MID_PDF_SHA_NATIVE_ANSWER_BBOX_27"
 &&doc.evidence_ref===EVIDENCE&&doc.blocks?.length===27,"original 27 operator scope");
 const seen=new Set();let tf=0,mc=0;
 for(const [i,b] of doc.blocks.entries()){
  const [sourceSlot,id,pdfSha,pdfPage,bbox,answer,kp,hash]=EXPECTED[i];
  const isTF=sourceSlot.includes("|TF|"),unit="4-S1-U"+kp.split("_")[2];
  fail(!seen.has(sourceSlot),"duplicate source "+sourceSlot);seen.add(sourceSlot);
  fail(b?.source_slot_id===sourceSlot&&b.id===id&&b.source_id===sourceSlot.split("|")[0]
    &&b.source_pdf_sha256===pdfSha&&b.source_page_pdf_1_based===pdfPage
    &&JSON.stringify(b.source_pdf_bbox_pts_top_left)===JSON.stringify(bbox)
    &&b.grade===4&&b.semester===1&&b.unit===unit
    &&b.canonical_kp_id===kp&&b.answer===answer
    &&b.original_question_number===sourceSlot.split("|").at(-1).padStart(3,"0")
    &&b.type===(isTF?"tf":"mcq"),"exact immutable original source/answer/KP #"+i);
  fail(b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.source==="P12_113_B03_NATIVE27_OPERATOR_APPROVED_PUBLIC"
    &&b.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&b.original_teacher_answer_key_authenticated===false
    &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
    &&b.evidence_ref===EVIDENCE
    &&typeof b.stem==="string"&&b.stem.trim().length>4
    &&typeof b.answer_explanation==="string"&&b.answer_explanation.trim().length>0,
    "operator-rights science trace #"+i);
  fail(isTF?!Object.hasOwn(b,"options")&&["O","X"].includes(answer):
   Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((t,j)=>typeof t==="string"&&t.startsWith(["①","②","③","④"][j]))
    &&["①","②","③","④"].includes(answer),"original standalone choice #"+i);
  fail(fnv(JSON.stringify(b))===hash,"immutable original full stem+MC options+science source hash "+i);
  const resolved=resolveUnit(authority,unit);
  fail(resolved?.grade===4&&resolved.semester===1&&["U01","U02"].includes(resolved.unit_id)
     &&resolved.knowledge_points.some(q=>q.canonical_kp_id===kp),"current frozen113 midterm direct KP #"+i);
  isTF?tf++:mc++;
 }
 fail(tf===10&&mc===17&&seen.size===27,"count partition");
 return {admission:"P12_113_B03_NATIVE27_OPERATOR_APPROVED",blocks:doc.blocks,answerSlots:27,standaloneTf:10,standaloneChoice:17,contextGroups:0};
}
