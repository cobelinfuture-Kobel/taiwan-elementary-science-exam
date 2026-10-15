import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B02_41_PATH="../data/question-bank/p12-b04-b02-41-public-v1.json";
export const P12_B04_B02_41_SCHEMA="SCIENCE_P12_B04_B02_41_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b02-41-formal-science-kp-acceptance-v1.json";
const EXPECTED=new Map([
 ["SCI_G04_S1_114_MID_004|S02|MC|013",["①","sci_g04s1_01_07","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",1]],
 ["SCI_G04_S1_114_MID_004|S02|MC|014",["②","sci_g04s1_02_07","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",2]],
 ["SCI_G04_S1_114_MID_004|S02|MC|015",["②","sci_g04s1_02_11","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",3]],
 ["SCI_G04_S1_114_MID_004|S02|MC|016",["②","sci_g04s1_02_12","8357b09d65d6cfcf6783b61a4034c777b55378f639a674f2383034467d276104",4]],
 ["SCI_G04_S1_114_MID_005|S01|TF|001",["O","sci_g04s1_01_06","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",5]],
 ["SCI_G04_S1_114_MID_005|S01|TF|002",["O","sci_g04s1_01_02","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",6]],
 ["SCI_G04_S1_114_MID_005|S01|TF|003",["X","sci_g04s1_02_11","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",7]],
 ["SCI_G04_S1_114_MID_005|S01|TF|004",["X","sci_g04s1_01_08","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",8]],
 ["SCI_G04_S1_114_MID_005|S01|TF|005",["O","sci_g04s1_02_08","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",9]],
 ["SCI_G04_S1_114_MID_005|S01|TF|006",["O","sci_g04s1_02_02","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",10]],
 ["SCI_G04_S1_114_MID_005|S01|TF|007",["O","sci_g04s1_01_06","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",11]],
 ["SCI_G04_S1_114_MID_005|S01|TF|008",["O","sci_g04s1_02_09","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",12]],
 ["SCI_G04_S1_114_MID_005|S01|TF|009",["O","sci_g04s1_02_07","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",13]],
 ["SCI_G04_S1_114_MID_005|S01|TF|010",["O","sci_g04s1_02_04","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",14]],
 ["SCI_G04_S1_114_MID_005|S01|TF|011",["X","sci_g04s1_02_04","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",15]],
 ["SCI_G04_S1_114_MID_005|S01|TF|012",["O","sci_g04s1_02_10","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",16]],
 ["SCI_G04_S1_114_MID_005|S01|TF|013",["O","sci_g04s1_01_07","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",17]],
 ["SCI_G04_S1_114_MID_005|S01|TF|015",["X","sci_g04s1_02_03","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",19]],
 ["SCI_G04_S1_114_MID_005|S02|MC|003",["①","sci_g04s1_01_04","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",20]],
 ["SCI_G04_S1_114_MID_005|S02|MC|004",["②","sci_g04s1_02_06","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",21]],
 ["SCI_G04_S1_114_MID_005|S02|MC|005",["④","sci_g04s1_02_09","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",22]],
 ["SCI_G04_S1_114_MID_005|S02|MC|007",["④","sci_g04s1_02_09","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",23]],
 ["SCI_G04_S1_114_MID_005|S02|MC|008",["②","sci_g04s1_02_07","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",24]],
 ["SCI_G04_S1_114_MID_005|S02|MC|009",["①","sci_g04s1_02_04","ce68729f178d69436388cae0d073ffa0b08da7e5c00c00d280cd396ef551f76a",25]],
 ["SCI_G04_S1_114_MID_006|S01|TF|001",["O","sci_g04s1_01_04","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",27]],
 ["SCI_G04_S1_114_MID_006|S01|TF|002",["O","sci_g04s1_01_02","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",28]],
 ["SCI_G04_S1_114_MID_006|S01|TF|008",["O","sci_g04s1_02_02","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",34]],
 ["SCI_G04_S1_114_MID_006|S01|TF|009",["X","sci_g04s1_02_08","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",35]],
 ["SCI_G04_S1_114_MID_006|S01|TF|010",["O","sci_g04s1_02_05","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",36]],
 ["SCI_G04_S1_114_MID_006|S01|TF|012",["O","sci_g04s1_02_11","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",37]],
 ["SCI_G04_S1_114_MID_006|S01|TF|013",["O","sci_g04s1_02_02","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",38]],
 ["SCI_G04_S1_114_MID_006|S01|TF|014",["X","sci_g04s1_02_03","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",39]],
 ["SCI_G04_S1_114_MID_006|S01|TF|015",["O","sci_g04s1_02_10","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",40]],
 ["SCI_G04_S1_114_MID_006|S02|MC|003",["③","sci_g04s1_01_05","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",42]],
 ["SCI_G04_S1_114_MID_006|S02|MC|004",["③","sci_g04s1_01_07","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",43]],
 ["SCI_G04_S1_114_MID_006|S02|MC|006",["③","sci_g04s1_01_10","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",45]],
 ["SCI_G04_S1_114_MID_006|S02|MC|007",["②","sci_g04s1_02_07","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",46]],
 ["SCI_G04_S1_114_MID_006|S02|MC|008",["②","sci_g04s1_02_04","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",47]],
 ["SCI_G04_S1_114_MID_006|S02|MC|009",["③","sci_g04s1_02_02","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",48]],
 ["SCI_G04_S1_114_MID_006|S02|MC|010",["①","sci_g04s1_02_01","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",49]],
 ["SCI_G04_S1_114_MID_006|S02|MC|012",["①","sci_g04s1_02_04","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",50]]
]);
const fail=(v,s)=>{if(!v)throw Error("P12 B04 B02 rejected: "+s)};
const txt=s=>typeof s==="string"&&s.trim().length>0;
const norm=s=>String(s??"").replace(/\s+/g,"").replace(/[，,。．！？!?：:、「」『』（）、]/g,"");
export function validateAndConvertP12B04B02_41(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B02_41_SCHEMA&&bank.public_site_integrated===true
   &&bank.frozen_batch_id==="B02"&&bank.source_count_reviewed===50
   &&bank.original_source_positions_approved===41&&bank.exceptions_held===9
   &&bank.expected_blocks===41&&bank.expected_answer_slots===41
   &&bank.expected_standalone_true_false===23&&bank.expected_standalone_choice===18
   &&bank.original_teacher_answer_key_authenticated===false
   &&bank.original_cropped_images_included===false&&bank.evidence_ref===EVIDENCE
   &&Array.isArray(bank.blocks)&&bank.blocks.length===41,"frozen B02 exact release contract");
 const ids=new Set(),slots=new Set(),stems=new Set(),byType={tf:0,mcq:0};
 for(const b of bank.blocks){
   const ex=EXPECTED.get(b.source_slot_id);
   fail(ex&&!slots.has(b.source_slot_id),"unapproved or repeated source slot");
   slots.add(b.source_slot_id);
   const expectedId=`P12_B04_G04S1_B02_${b.type==="tf"?"TF":"MC"}_${String(b.b02_review_ordinal).padStart(3,"0")}`;
   fail(b.id===expectedId&&!ids.has(b.id),"source public ID");
   ids.add(b.id);
   fail(b.source_id===b.source_slot_id.split("|")[0]
     &&b.source_pdf_sha256===ex[2]
     &&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===ex[2]
     &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1
     &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
     &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
     &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
     &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"PDF identity and source marker BBox");
   fail(b.answer===ex[0]&&b.canonical_kp_id===ex[1]
     &&b.b02_review_ordinal===ex[3]&&txt(b.stem)&&txt(b.answer_explanation)&&txt(b.answer_assumption),
     "answer, rationale, source index or canonical KP");
   const u=resolveUnit(authority,b.unit);
   fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"KP authority");
   let stem=norm(b.stem);fail(!stems.has(stem),"duplicate public stem");stems.add(stem);
   if(b.type==="tf")fail(["O","X"].includes(b.answer)&&!('options' in b),"TF format");
   else fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
     &&Array.isArray(b.options)&&b.options.length===4
     &&b.options.every((x,i)=>txt(x)&&x.startsWith(["①","②","③","④"][i])),"MC source options");
   byType[b.type]++;
   fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
     &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
     &&b.operator_publication_approval===true&&b.original_teacher_answer_key_authenticated===false
     &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
     &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
     &&b.evidence_ref===EVIDENCE,"rights or operator release gate");
 }
 fail(slots.size===41&&ids.size===41&&stems.size===41&&byType.tf===23&&byType.mcq===18,"41 admissions");
 return {admission:"P12_B04_B02_41_CERTIFIED",blocks:bank.blocks,answerSlots:41,standaloneTf:23,standaloneChoice:18,contextGroups:0};
}
