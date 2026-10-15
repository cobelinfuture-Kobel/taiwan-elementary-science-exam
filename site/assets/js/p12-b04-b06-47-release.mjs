import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B06_47_PATH="../data/question-bank/p12-b04-b06-47-public-v1.json";
export const P12_B04_B06_47_SCHEMA="SCIENCE_P12_B04_B06_47_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b06-47-formal-science-kp-acceptance-v1.json";
const EXPECTED=new Map([
 ["SCI_G04_S1_114_MID_010|S01|TF|007",["O","sci_g04s1_02_02","d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6",1]],
 ["SCI_G04_S1_114_MID_010|S02|MC|001",["③","sci_g04s1_02_01","d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6",2]],
 ["SCI_G04_S1_114_MID_010|S02|MC|012",["①","sci_g04s1_02_07","d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6",3]],
 ["SCI_G04_S1_114_MID_011|Q01|006",["O","sci_g04s1_02_11","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",4]],
 ["SCI_G04_S1_114_MID_011|Q03|001",["O","sci_g04s1_02_05","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",7]],
 ["SCI_G04_S1_114_MID_011|Q03|002",["O","sci_g04s1_02_06","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",8]],
 ["SCI_G04_S1_114_MID_011|Q03|003",["O","sci_g04s1_02_07","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",9]],
 ["SCI_G04_S1_114_MID_011|Q03|004",["X","sci_g04s1_02_03","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",10]],
 ["SCI_G04_S1_114_MID_011|Q03|006",["X","sci_g04s1_02_04","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",11]],
 ["SCI_G04_S1_114_MID_011|Q06|001",["O","sci_g04s1_02_01","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",12]],
 ["SCI_G04_S1_114_MID_011|Q06|002",["O","sci_g04s1_02_02","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",13]],
 ["SCI_G04_S1_114_MID_011|Q06|003",["O","sci_g04s1_02_02","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",14]],
 ["SCI_G04_S1_114_MID_011|Q06|005",["X","sci_g04s1_02_02","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",15]],
 ["SCI_G04_S1_114_MID_011|Q09|002",["X","sci_g04s1_03_06","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",16]],
 ["SCI_G04_S1_114_MID_011|Q09|004",["X","sci_g04s1_03_06","e680a27f10845df9eafa61cef26d4a9bf50613d6c58750254adae17a34c084b5",17]],
 ["SCI_G04_S1_114_MID_012|S1|TF|002",["O","sci_g04s1_02_11","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",18]],
 ["SCI_G04_S1_114_MID_012|S1|TF|008",["X","sci_g04s1_02_08","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",19]],
 ["SCI_G04_S1_114_MID_012|S2|MC|001",["①","sci_g04s1_02_03","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",20]],
 ["SCI_G04_S1_114_MID_012|S2|MC|002",["②","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",21]],
 ["SCI_G04_S1_114_MID_012|S2|MC|004",["①","sci_g04s1_02_02","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",22]],
 ["SCI_G04_S1_114_MID_012|S2|MC|010",["③","sci_g04s1_02_07","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",23]],
 ["SCI_G04_S1_114_MID_012|S5|G01|001",["X","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",24]],
 ["SCI_G04_S1_114_MID_012|S5|G01|002",["O","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",25]],
 ["SCI_G04_S1_114_MID_012|S5|G01|003",["O","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",26]],
 ["SCI_G04_S1_114_MID_012|S5|G01|004",["X","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",27]],
 ["SCI_G04_S1_114_MID_012|S5|G01|005",["O","sci_g04s1_02_09","92dfbf4e2b3808600963b253d8b08cde0cdfbf5253d447ecdbb0b24065c73026",28]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|001",["O","sci_g04s1_03_03","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",29]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|002",["X","sci_g04s1_03_08","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",30]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|003",["O","sci_g04s1_03_05","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",31]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|004",["O","sci_g04s1_03_06","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",32]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|005",["O","sci_g04s1_03_07","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",33]],
 ["SCI_G04_S1_114_FINAL_011|S1|TF|006",["O","sci_g04s1_03_09","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",34]],
 ["SCI_G04_S1_114_FINAL_011|S2|MC|002",["④","sci_g04s1_03_06","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",35]],
 ["SCI_G04_S1_114_FINAL_011|S2|MC|005",["③","sci_g04s1_03_08","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",36]],
 ["SCI_G04_S1_114_FINAL_011|S2|MC|006",["②","sci_g04s1_03_09","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",37]],
 ["SCI_G04_S1_114_FINAL_011|S2|MC|017",["①","sci_g04s1_03_06","41206d81b2a7620143fe2b772ce27b77b85a5193b8a81284e69bcde53df0beb0",38]],
 ["SCI_G04_S1_114_FINAL_012|Q03|001",["O","sci_g04s1_03_06","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",39]],
 ["SCI_G04_S1_114_FINAL_012|Q03|004",["X","sci_g04s1_03_06","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",40]],
 ["SCI_G04_S1_114_FINAL_012|Q03|005",["O","sci_g04s1_03_05","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",41]],
 ["SCI_G04_S1_114_FINAL_012|Q03|007",["X","sci_g04s1_03_05","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",42]],
 ["SCI_G04_S1_114_FINAL_012|Q03|008",["X","sci_g04s1_03_04","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",43]],
 ["SCI_G04_S1_114_FINAL_012|Q05|001",["O","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",44]],
 ["SCI_G04_S1_114_FINAL_012|Q05|002",["O","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",45]],
 ["SCI_G04_S1_114_FINAL_012|Q05|003",["X","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",46]],
 ["SCI_G04_S1_114_FINAL_012|Q05|004",["O","sci_g04s1_03_03","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",47]],
 ["SCI_G04_S1_114_FINAL_012|Q05|005",["O","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",48]],
 ["SCI_G04_S1_114_FINAL_012|Q05|007",["X","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",49]]
]);
const fail=(ok,why)=>{if(!ok)throw Error("P12 B04 B06 47 admission refused: "+why)};
const txt=x=>typeof x==="string"&&x.trim().length>0;
const norm=x=>String(x??"").normalize("NFKC").replace(/\s+/g,"").replace(/[，,。．？！!?：「」『（）、]/g,"");
export function validateAndConvertP12B04B06_47(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B06_47_SCHEMA&&bank.public_site_integrated===true
  &&bank.frozen_batch_id==="B06"&&bank.source_count_reviewed===50
  &&bank.original_source_positions_approved===47&&bank.exceptions_held===3
  &&bank.expected_blocks===47&&bank.expected_answer_slots===47
  &&bank.expected_standalone_true_false===37&&bank.expected_standalone_choice===10
  &&bank.parent_instruction_projection_count===11
  &&bank.parent_instruction_original_review_count===12
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false&&bank.evidence_ref===EVIDENCE
  &&Array.isArray(bank.blocks)&&bank.blocks.length===47,"frozen source/release metadata");
 const ids=new Set(),slots=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const original=EXPECTED.get(b.source_slot_id);
  fail(original&&!slots.has(b.source_slot_id),"unapproved or duplicate source slot");slots.add(b.source_slot_id);
  fail(b.id===`P12_B04_G04S1_B06_${b.type==="tf"?"TF":"MC"}_${String(b.b06_review_ordinal).padStart(3,"0")}`
    &&!ids.has(b.id),"unique public ID");ids.add(b.id);
  fail(b.source_id===b.source_slot_id.split("|")[0]&&b.source_pdf_sha256===original[2]
    &&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===original[2]
    &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1
    &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
    &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
    &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
    &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"PDF provenance/page/BBox");
  fail(b.answer===original[0]&&b.canonical_kp_id===original[1]
    &&b.b06_review_ordinal===original[3]&&txt(b.stem)
    &&txt(b.answer_explanation)&&txt(b.answer_assumption),"Science answer/KP/rationale");
  fail(!stems.has(norm(b.stem)),"duplicate stems");stems.add(norm(b.stem));
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP Authority");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!("options" in b),"O/X TF");}
  else {mc++;fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((x,i)=>txt(x)&&x.startsWith(["①","②","③","④"][i])),"original MC choices");}
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights/admission authority");
 }
 fail(slots.size===47&&ids.size===47&&stems.size===47&&tf===37&&mc===10,"total exact 47");
 return {admission:"P12_B04_B06_47_CERTIFIED",blocks:bank.blocks,answerSlots:47,standaloneTf:37,standaloneChoice:10,contextGroups:0};
}
