import {resolveUnit} from "./authority-adapter.mjs";
export const P12_113_B06_NATIVE16_PATH="../data/question-bank/p12-g04s1-113-b06-native16-standalone-public-v1.json";
export const P12_113_B06_NATIVE16_SCHEMA="SCIENCE_P12_G04S1_113_B06_NATIVE16_STANDALONE_PUBLIC_V1";
const EVIDENCE="data/review/p12-g04s1-113-b06-exact16-operator-approved-formal-v1.json";
const EXPECTED=[["SCI_G04_S1_113_MID_018|S1|TF|3","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|03","P12_113_G04S1_B06_NATIVE16_001","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,138.47,79.52,154.01],"O","sci_g04s1_02_07","425d4a8803a49b7a"],["SCI_G04_S1_113_MID_018|S1|TF|9","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|09","P12_113_G04S1_B06_NATIVE16_002","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,440.42,79.52,455.96],"O","sci_g04s1_02_09","6b70fb8d82293eaf"],["SCI_G04_S1_113_MID_018|S1|TF|10","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|10","P12_113_G04S1_B06_NATIVE16_003","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,458.54,79.52,474.08],"X","sci_g04s1_02_04","7aaffdbc5806c292"],["SCI_G04_S1_113_MID_018|S1|TF|11","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|11","P12_113_G04S1_B06_NATIVE16_004","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,495.02,79.52,510.56],"X","sci_g04s1_02_02","993f884ca328236f"],["SCI_G04_S1_113_MID_018|S1|TF|12","SCI_G04_S1_113_MID_018|S01|TRUE_FALSE|12","P12_113_G04S1_B06_NATIVE16_005","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,531.5,79.52,547.04],"X","sci_g04s1_02_06","0b70f36f89037af4"],["SCI_G04_S1_113_MID_018|S2|MC|1","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|01","P12_113_G04S1_B06_NATIVE16_006","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,602.2,79.52,617.74],"②","sci_g04s1_02_04","49743292a414a041"],["SCI_G04_S1_113_MID_018|S2|MC|5","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|05","P12_113_G04S1_B06_NATIVE16_007","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,876.31,79.52,891.85],"④","sci_g04s1_02_02","aa0749eb45a48903"],["SCI_G04_S1_113_MID_018|S2|MC|6","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|06","P12_113_G04S1_B06_NATIVE16_008","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[49.32,951.07,79.52,966.61],"②","sci_g04s1_02_02","1313e68b2515c9dd"],["SCI_G04_S1_113_MID_018|S2|MC|9","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|09","P12_113_G04S1_B06_NATIVE16_009","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[395.83,234.47,426.03,250.01],"②","sci_g04s1_02_03","45adf57fb11fd0b0"],["SCI_G04_S1_113_MID_018|S2|MC|11","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|11","P12_113_G04S1_B06_NATIVE16_010","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[395.83,385.22,426.03,400.76],"③","sci_g04s1_02_14","fb8a7a092f52ce6d"],["SCI_G04_S1_113_MID_018|S2|MC|12","SCI_G04_S1_113_MID_018|S02|SINGLE_CHOICE|12","P12_113_G04S1_B06_NATIVE16_011","ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601",1,[395.83,499.46,426.03,515],"②","sci_g04s1_02_09","9529a1fca272c7b0"],["SCI_G04_S1_113_FINAL_010|S1|MC|5","SCI_G04_S1_113_FINAL_010|S01|SINGLE_CHOICE|05","P12_113_G04S1_B06_NATIVE16_012","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c",1,[56.64,562.08,89.78,573.12],"①","sci_g04s1_03_05","dcca3742357aa229"],["SCI_G04_S1_113_FINAL_010|S1|MC|8","SCI_G04_S1_113_FINAL_010|S01|SINGLE_CHOICE|08","P12_113_G04S1_B06_NATIVE16_013","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c",1,[56.64,759.63,89.78,770.67],"③","sci_g04s1_03_06","640780a1769fa9d4"],["SCI_G04_S1_113_FINAL_010|S1|MC|9","SCI_G04_S1_113_FINAL_010|S01|SINGLE_CHOICE|09","P12_113_G04S1_B06_NATIVE16_014","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c",1,[328.01,145.99,361.15,157.03],"④","sci_g04s1_03_03","95ca7b21b4a802bd"],["SCI_G04_S1_113_FINAL_010|S1|MC|15","SCI_G04_S1_113_FINAL_010|S01|SINGLE_CHOICE|15","P12_113_G04S1_B06_NATIVE16_015","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c",2,[66.48,138.43,99.62,149.47],"③","sci_g04s1_03_03","0682a9deb181e3e8"],["SCI_G04_S1_113_FINAL_010|S1|MC|20","SCI_G04_S1_113_FINAL_010|S01|SINGLE_CHOICE|20","P12_113_G04S1_B06_NATIVE16_016","c200d33865bfa48b3e39b9a03be33c17da207cf828e7d7a3c1883d0afa04257c",2,[66.48,508.92,99.62,519.96],"③","sci_g04s1_03_07","effef27c86764c28"]];
const fail=(ok,why)=>{if(!ok)throw Error("P12_B06_EXACT16_FAIL_CLOSED: "+why);};
const fnv=s=>{let h=0xcbf29ce484222325n;for(const c of s)h=((h^BigInt(c.codePointAt(0)))*0x100000001b3n)&((1n<<64n)-1n);return h.toString(16).padStart(16,"0");};
export function validateAndConvertP12113B06Native16(doc,authority){
 fail(doc?.schema_version===P12_113_B06_NATIVE16_SCHEMA&&doc.public_site_integrated===true
  &&doc.requires_operator_batch_manifest_approval===false&&doc.expected_blocks===16
  &&doc.expected_answer_slots===16&&doc.expected_standalone_true_false===5
  &&doc.expected_standalone_choice===11&&doc.expected_context_groups===0
  &&doc.original_teacher_answer_key_authenticated===false&&doc.original_cropped_images_included===false
  &&doc.source_image_geometry_verified==="ORIGINAL_2_113_PAPERS_PDF_SHA_NATIVE_ANSWER_BBOX_16_PLUS_SCAN5_DEDUP"
  &&doc.evidence_ref===EVIDENCE&&Array.isArray(doc.blocks)&&doc.blocks.length===16,
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
    &&b.source==="P12_113_B06_NATIVE16_OPERATOR_APPROVED_PUBLIC"
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
 fail(tf===5&&mc===11&&ids.size===16,"exact approved5TF 11MC cohort");
 return {admission:"P12_113_B06_NATIVE16_OPERATOR_APPROVED",blocks:doc.blocks,answerSlots:16,standaloneTf:5,standaloneChoice:11,contextGroups:0};
}
