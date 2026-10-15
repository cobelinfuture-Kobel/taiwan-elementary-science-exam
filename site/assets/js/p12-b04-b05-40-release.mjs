import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B05_40_PATH="../data/question-bank/p12-b04-b05-40-public-v1.json";
export const P12_B04_B05_40_SCHEMA="SCIENCE_P12_B04_B05_40_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b05-40-formal-science-kp-acceptance-v1.json";
const EXPECTED=new Map([
 ["SCI_G04_S1_114_FINAL_007|S02|MC|001",["③","sci_g04s1_03_01","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",2]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|003",["④","sci_g04s1_04_12","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",4]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|004",["①","sci_g04s1_03_01","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",5]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|005",["④","sci_g04s1_04_05","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",6]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|006",["②","sci_g04s1_03_05","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",7]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|008",["④","sci_g04s1_03_07","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",8]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|013",["④","sci_g04s1_04_01","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",10]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|014",["①","sci_g04s1_04_03","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",11]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|018",["③","sci_g04s1_04_10","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",12]],
 ["SCI_G04_S1_114_FINAL_007|S02|MC|019",["②","sci_g04s1_04_08","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",13]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|001",["O","sci_g04s1_03_01","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",14]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|002",["O","sci_g04s1_03_07","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",15]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|007",["X","sci_g04s1_03_02","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",19]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|008",["X","sci_g04s1_04_10","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",20]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|010",["O","sci_g04s1_04_09","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",21]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|011",["X","sci_g04s1_04_12","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",22]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|013",["X","sci_g04s1_04_08","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",24]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|014",["O","sci_g04s1_04_05","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",25]],
 ["SCI_G04_S1_114_FINAL_008|S01|TF|015",["X","sci_g04s1_04_12","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",26]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|001",["②","sci_g04s1_03_03","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",27]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|002",["①","sci_g04s1_03_01","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",28]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|003",["③","sci_g04s1_03_07","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",29]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|004",["④","sci_g04s1_03_10","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",30]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|005",["①","sci_g04s1_03_07","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",31]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|006",["④","sci_g04s1_03_07","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",32]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|010",["①","sci_g04s1_04_04","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",34]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|011",["④","sci_g04s1_04_09","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",35]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|013",["②","sci_g04s1_04_10","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",36]],
 ["SCI_G04_S1_114_FINAL_008|S02|MC|015",["①","sci_g04s1_04_12","023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd",37]],
 ["SCI_G04_S1_114_FINAL_009|S1|TF|001",["O","sci_g04s1_03_03","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",38]],
 ["SCI_G04_S1_114_FINAL_009|S1|TF|002",["X","sci_g04s1_03_01","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",39]],
 ["SCI_G04_S1_114_FINAL_009|S1|TF|003",["O","sci_g04s1_03_05","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",40]],
 ["SCI_G04_S1_114_FINAL_009|S1|TF|004",["O","sci_g04s1_04_03","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",41]],
 ["SCI_G04_S1_114_FINAL_009|S2|MC|001",["③","sci_g04s1_03_01","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",42]],
 ["SCI_G04_S1_114_FINAL_009|S2|MC|005",["①","sci_g04s1_03_07","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",44]],
 ["SCI_G04_S1_114_FINAL_009|S2|MC|006",["②","sci_g04s1_04_04","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",45]],
 ["SCI_G04_S1_114_FINAL_009|S2|MC|009",["②","sci_g04s1_04_05","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",47]],
 ["SCI_G04_S1_114_FINAL_009|S2|MC|010",["④","sci_g04s1_04_10","0b7bdaee9630a557fbe72a5fdb1039b661905e1634884e73803e4365f41b4049",48]],
 ["SCI_G04_S1_114_MID_010|S01|TF|001",["O","sci_g04s1_03_06","d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6",49]],
 ["SCI_G04_S1_114_MID_010|S01|TF|005",["X","sci_g04s1_02_02","d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6",50]]
]);
const fail=(v,s)=>{if(!v)throw Error("P12 B04 B05 40 refused: "+s);};
const txt=s=>typeof s==="string"&&s.trim().length>0;
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/g,"").replace(/[，,。．？！!?：「」『（）、]/g,"");
export function validateAndConvertP12B04B05_40(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B05_40_SCHEMA&&bank.public_site_integrated===true
 &&bank.frozen_batch_id==="B05"&&bank.source_count_reviewed===50
 &&bank.original_source_positions_approved===40&&bank.exceptions_held===10
 &&bank.expected_blocks===40&&bank.expected_answer_slots===40
 &&bank.expected_standalone_true_false===15&&bank.expected_standalone_choice===25
 &&bank.original_teacher_answer_key_authenticated===false
 &&bank.original_cropped_images_included===false&&bank.evidence_ref===EVIDENCE
 &&Array.isArray(bank.blocks)&&bank.blocks.length===40,"source count and release metadata");
 const ids=new Set(),slots=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const accepted=EXPECTED.get(b.source_slot_id);
  fail(accepted&&!slots.has(b.source_slot_id),"source not approved or repeated");slots.add(b.source_slot_id);
  fail(b.id===`P12_B04_G04S1_B05_${b.type==="tf"?"TF":"MC"}_${String(b.b05_review_ordinal).padStart(3,"0")}`&&!ids.has(b.id),"learner ID");
  ids.add(b.id);
  fail(b.source_id===b.source_slot_id.split("|")[0]
   &&b.source_pdf_sha256===accepted[2]&&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===accepted[2]
   &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"PDF SHA and marker BBox");
  fail(b.answer===accepted[0]&&b.canonical_kp_id===accepted[1]
   &&b.b05_review_ordinal===accepted[3]&&txt(b.stem)&&txt(b.answer_explanation)&&txt(b.answer_assumption),"unique answer/KP explanation");
  const s=norm(b.stem);fail(!stems.has(s),"exact repeated published stem");stems.add(s);
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP semantic Authority");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!("options" in b),"TF O/X");}
  else {mc++;fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((x,i)=>txt(x)&&x.startsWith(["①","②","③","④"][i])),"ordered MC four original options");}
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false
    &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
    &&b.evidence_ref===EVIDENCE,"rights or operator admission");
 }
 fail(slots.size===40&&ids.size===40&&stems.size===40&&tf===15&&mc===25,"40 source/type counts");
 return {admission:"P12_B04_B05_40_CERTIFIED",blocks:bank.blocks,answerSlots:40,standaloneTf:15,standaloneChoice:25,contextGroups:0};
}
