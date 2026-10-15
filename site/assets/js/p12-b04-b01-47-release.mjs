import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B01_47_PATH="../data/question-bank/p12-b04-b01-47-public-v1.json";
export const P12_B04_B01_47_SCHEMA="SCIENCE_P12_B04_B01_47_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b01-47-formal-science-kp-acceptance-v1.json";
const EXPECTED=new Map([
 ["SCI_G04_S1_114_FINAL_001|TF|S01|002",["O","sci_g04s1_03_05","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",1]],
 ["SCI_G04_S1_114_FINAL_001|TF|S01|003",["O","sci_g04s1_03_08","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",2]],
 ["SCI_G04_S1_114_FINAL_001|TF|S01|006",["O","sci_g04s1_04_01","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",3]],
 ["SCI_G04_S1_114_FINAL_001|TF|S01|007",["X","sci_g04s1_04_01","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",4]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|001",["③","sci_g04s1_03_04","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",5]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|002",["②","sci_g04s1_03_07","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",6]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|007",["④","sci_g04s1_04_04","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",7]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|008",["②","sci_g04s1_04_03","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",8]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|010",["①","sci_g04s1_04_09","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",9]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|012",["③","sci_g04s1_04_12","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",10]],
 ["SCI_G04_S1_114_FINAL_001|MC|S02|014",["④","sci_g04s1_04_12","88263e6dd1f40e8445127ef45a2741003395107486fd9d2e65e48d5fdbcde0bf",11]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|002",["X","sci_g04s1_04_04","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",12]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|003",["X","sci_g04s1_04_05","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",13]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|004",["X","sci_g04s1_04_08","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",14]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|005",["X","sci_g04s1_04_06","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",15]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|007",["O","sci_g04s1_03_06","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",16]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|008",["X","sci_g04s1_03_09","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",17]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|009",["X","sci_g04s1_04_05","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",18]],
 ["SCI_G04_S1_114_FINAL_003|S01|TF|010",["X","sci_g04s1_04_05","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",19]],
 ["SCI_G04_S1_114_FINAL_003|S02|MC|001",["①","sci_g04s1_03_06","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",20]],
 ["SCI_G04_S1_114_FINAL_003|S02|MC|005",["②","sci_g04s1_03_03","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",21]],
 ["SCI_G04_S1_114_FINAL_003|S02|MC|006",["①","sci_g04s1_03_03","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",22]],
 ["SCI_G04_S1_114_FINAL_003|S02|MC|007",["③","sci_g04s1_03_06","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",23]],
 ["SCI_G04_S1_114_FINAL_003|S02|MC|010",["①","sci_g04s1_04_07","147e2442528e681dc2e7a121ada8fbea532107d89673029c4bc5b1ac52a1e819",24]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|001",["O","sci_g04s1_04_12","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",25]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|002",["X","sci_g04s1_03_07","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",26]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|003",["O","sci_g04s1_04_05","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",27]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|005",["O","sci_g04s1_04_11","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",28]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|007",["O","sci_g04s1_04_06","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",29]],
 ["SCI_G04_S1_114_FINAL_004|S01|TF|008",["X","sci_g04s1_04_08","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",30]],
 ["SCI_G04_S1_114_FINAL_004|S02|MC|004",["①","sci_g04s1_03_07","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",31]],
 ["SCI_G04_S1_114_FINAL_004|S02|MC|008",["②","sci_g04s1_04_08","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",33]],
 ["SCI_G04_S1_114_FINAL_004|S02|MC|011",["②","sci_g04s1_04_12","8d7331a0839031ad150ba0dea9eba672d96e368d453251f3c3934bb4aac4df84",34]],
 ["SCI_G04_S1_114_MID_004|S01|TF|001",["O","sci_g04s1_01_01","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",35]],
 ["SCI_G04_S1_114_MID_004|S01|TF|002",["X","sci_g04s1_01_02","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",36]],
 ["SCI_G04_S1_114_MID_004|S01|TF|003",["O","sci_g04s1_01_06","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",37]],
 ["SCI_G04_S1_114_MID_004|S01|TF|004",["O","sci_g04s1_01_08","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",38]],
 ["SCI_G04_S1_114_MID_004|S01|TF|005",["O","sci_g04s1_01_04","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",39]],
 ["SCI_G04_S1_114_MID_004|S01|TF|006",["X","sci_g04s1_02_04","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",40]],
 ["SCI_G04_S1_114_MID_004|S01|TF|007",["X","sci_g04s1_02_02","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",41]],
 ["SCI_G04_S1_114_MID_004|S02|MC|002",["④","sci_g04s1_01_07","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",43]],
 ["SCI_G04_S1_114_MID_004|S02|MC|003",["②","sci_g04s1_01_07","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",44]],
 ["SCI_G04_S1_114_MID_004|S02|MC|005",["②","sci_g04s1_01_02","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",45]],
 ["SCI_G04_S1_114_MID_004|S02|MC|006",["③","sci_g04s1_02_06","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",46]],
 ["SCI_G04_S1_114_MID_004|S02|MC|007",["①","sci_g04s1_01_05","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",47]],
 ["SCI_G04_S1_114_MID_004|S02|MC|011",["③","sci_g04s1_02_09","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",49]],
 ["SCI_G04_S1_114_MID_004|S02|MC|012",["③","sci_g04s1_02_05","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",50]]
]);
const fail=(v,s)=>{if(!v)throw Error("P12 B04 B01 47 release rejected: "+s)};
const txt=s=>typeof s==="string"&&s.trim().length>0;
const norm=s=>String(s??"").replace(/\s+/g,"").replace(/[，,。．！？!?：:、「」『』（）、]/g,"");
export function validateAndConvertP12B04B01_47(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B01_47_SCHEMA&&bank.public_site_integrated===true
  &&bank.frozen_batch_id==="B01"&&bank.source_count_reviewed===50
  &&bank.original_source_positions_approved===47&&bank.exceptions_held===3
  &&bank.expected_blocks===47&&bank.expected_answer_slots===47
  &&bank.expected_standalone_true_false===25&&bank.expected_standalone_choice===22
  &&bank.teacher_answer_key_authenticated===false
  &&bank.original_pdf_embedded===false&&bank.original_cropped_images_included===false
  &&bank.evidence_ref===EVIDENCE
  &&Array.isArray(bank.blocks)&&bank.blocks.length===47,"frozen source/release contract");
 const ids=new Set(),slots=new Set(),stems=new Set(),bytype={tf:0,mcq:0};
 for(const b of bank.blocks){
  const correct=EXPECTED.get(b.source_slot_id);
  fail(correct&&!slots.has(b.source_slot_id),"unapproved/repeated source position");
  slots.add(b.source_slot_id);
  fail(txt(b.id)&&b.id===`P12_B04_G04S1_B01_${b.type==="tf"?"TF":"MC"}_${String(b.b01_review_ordinal).padStart(3,"0")}`
   &&!ids.has(b.id),"unique learner question ID");
  ids.add(b.id);
  fail(b.source_id===b.source_slot_id.split("|")[0]
   &&b.source_pdf_sha256===correct[2]
   &&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===correct[2]
   &&b.source_page_pdf_1_based>=1&&Number.isInteger(b.source_page_pdf_1_based)
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)
   &&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"original PDF SHA/page/BBox");
  fail(b.answer===correct[0]&&b.canonical_kp_id===correct[1]
   &&b.b01_review_ordinal===correct[3]&&txt(b.stem)
   &&txt(b.answer_explanation)&&txt(b.answer_assumption),"Science answer / canonical KP / explanation");
  const stem=norm(b.stem);
  fail(!stems.has(stem),"duplicate original stems");
  stems.add(stem);
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1
    &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP Authority");
  if(b.type==="tf")fail(["O","X"].includes(b.answer)&&!('options' in b),"TF O/X");
  else{
   fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((x,i)=>txt(x)&&x.startsWith(["①","②","③","④"][i])),"MC original four alternatives");
  }
  bytype[b.type]++;
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true
   &&b.evidence_ref===EVIDENCE
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","source rights, operator approval or dependencies");
 }
 fail(slots.size===47&&ids.size===47&&stems.size===47
  &&bytype.tf===25&&bytype.mcq===22
  &&!slots.has("SCI_G04_S1_114_FINAL_004|S02|MC|006")
  &&!slots.has("SCI_G04_S1_114_MID_004|S01|TF|008")
  &&!slots.has("SCI_G04_S1_114_MID_004|S02|MC|009"),"source counts or held items leaked");
 return {admission:"P12_B04_B01_47_CERTIFIED",blocks:bank.blocks,answerSlots:47,standaloneTf:25,standaloneChoice:22,contextGroups:0};
}
