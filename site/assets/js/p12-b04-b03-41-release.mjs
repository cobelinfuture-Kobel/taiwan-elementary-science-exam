import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B03_41_PATH="../data/question-bank/p12-b04-b03-41-public-v1.json";
export const P12_B04_B03_41_SCHEMA="SCIENCE_P12_B04_B03_41_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b03-41-formal-science-kp-acceptance-v1.json";
const ACCEPTED=new Map([
 ["SCI_G04_S1_114_MID_006|S02|MC|013",["③","sci_g04s1_02_10","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",1]],
 ["SCI_G04_S1_114_MID_006|S02|MC|014",["②","sci_g04s1_02_09","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",2]],
 ["SCI_G04_S1_114_MID_006|S02|MC|015",["④","sci_g04s1_02_11","f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb",3]],
 ["SCI_G04_S1_114_MID_007|S01|TF|006",["O","sci_g04s1_01_11","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",6]],
 ["SCI_G04_S1_114_MID_007|S01|TF|007",["O","sci_g04s1_01_02","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",7]],
 ["SCI_G04_S1_114_MID_007|S01|TF|009",["O","sci_g04s1_02_04","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",8]],
 ["SCI_G04_S1_114_MID_007|S01|TF|010",["O","sci_g04s1_02_09","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",9]],
 ["SCI_G04_S1_114_MID_007|S02|MC|001",["①","sci_g04s1_01_02","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",11]],
 ["SCI_G04_S1_114_MID_007|S02|MC|002",["②","sci_g04s1_01_04","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",12]],
 ["SCI_G04_S1_114_MID_007|S02|MC|004",["④","sci_g04s1_02_11","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",13]],
 ["SCI_G04_S1_114_MID_007|S02|MC|006",["②","sci_g04s1_01_09","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",14]],
 ["SCI_G04_S1_114_MID_007|S02|MC|007",["③","sci_g04s1_02_01","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",15]],
 ["SCI_G04_S1_114_MID_007|S02|MC|010",["②","sci_g04s1_02_09","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",16]],
 ["SCI_G04_S1_114_MID_007|S02|MC|011",["③","sci_g04s1_02_10","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",17]],
 ["SCI_G04_S1_114_MID_007|S02|MC|012",["④","sci_g04s1_02_11","65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",18]],
 ["SCI_G04_S1_114_MID_008|S01|TF|002",["O","sci_g04s1_02_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",19]],
 ["SCI_G04_S1_114_MID_008|S01|TF|006",["X","sci_g04s1_02_09","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",22]],
 ["SCI_G04_S1_114_MID_008|S01|TF|007",["O","sci_g04s1_02_09","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",23]],
 ["SCI_G04_S1_114_MID_008|S01|TF|009",["O","sci_g04s1_02_11","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",24]],
 ["SCI_G04_S1_114_MID_008|S01|TF|010",["X","sci_g04s1_01_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",25]],
 ["SCI_G04_S1_114_MID_008|S01|TF|014",["X","sci_g04s1_02_04","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",29]],
 ["SCI_G04_S1_114_MID_008|S02|MC|001",["④","sci_g04s1_01_07","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",30]],
 ["SCI_G04_S1_114_MID_008|S02|MC|003",["③","sci_g04s1_02_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",31]],
 ["SCI_G04_S1_114_MID_008|S02|MC|005",["②","sci_g04s1_02_01","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",33]],
 ["SCI_G04_S1_114_MID_008|S02|MC|006",["③","sci_g04s1_02_05","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",34]],
 ["SCI_G04_S1_114_MID_008|S02|MC|007",["③","sci_g04s1_02_07","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",35]],
 ["SCI_G04_S1_114_MID_008|S02|MC|008",["④","sci_g04s1_02_09","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",36]],
 ["SCI_G04_S1_114_MID_008|S02|MC|009",["②","sci_g04s1_02_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",37]],
 ["SCI_G04_S1_114_MID_008|S02|MC|010",["④","sci_g04s1_02_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",38]],
 ["SCI_G04_S1_114_MID_008|S02|MC|012",["④","sci_g04s1_02_02","0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",39]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|003",["O","sci_g04s1_03_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",40]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|004",["X","sci_g04s1_03_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",41]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|005",["O","sci_g04s1_03_01","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",42]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|006",["X","sci_g04s1_03_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",43]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|007",["X","sci_g04s1_03_05","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",44]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|008",["O","sci_g04s1_03_03","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",45]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|009",["O","sci_g04s1_03_03","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",46]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|010",["X","sci_g04s1_04_06","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",47]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|011",["X","sci_g04s1_04_08","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",48]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|012",["X","sci_g04s1_04_12","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",49]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|013",["O","sci_g04s1_04_12","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",50]]
]);
const fail=(condition,why)=>{if(!condition)throw Error("P12 B04 B03 41 release rejected: "+why);};
const validString=s=>typeof s==="string"&&s.trim().length>0;
const normalize=s=>String(s??"").normalize("NFKC").replace(/\s+/g,"").replace(/[，,。．？！!?：「」『』（）、]/g,"");
export function validateAndConvertP12B04B03_41(payload,authority) {
 assertScorelessMetadata(payload);
 fail(payload?.schema_version===P12_B04_B03_41_SCHEMA
  &&payload.public_site_integrated===true&&payload.frozen_batch_id==="B03"
  &&payload.source_count_reviewed===50&&payload.original_source_positions_approved===41
  &&payload.exceptions_held===9&&payload.expected_blocks===41
  &&payload.expected_answer_slots===41
  &&payload.expected_standalone_true_false===21&&payload.expected_standalone_choice===20
  &&payload.original_teacher_answer_key_authenticated===false
  &&payload.original_cropped_images_included===false&&payload.evidence_ref===EVIDENCE
  &&Array.isArray(payload.blocks)&&payload.blocks.length===41,"source release header");
 const sourceIds=new Set(),publicIds=new Set(),stems=new Set();let tf=0,choice=0;
 for(const b of payload.blocks){
   const e=ACCEPTED.get(b.source_slot_id);
   fail(e&&!sourceIds.has(b.source_slot_id),"unknown/repeated source ID");
   sourceIds.add(b.source_slot_id);
   fail(b.id===`P12_B04_G04S1_B03_${b.type==="tf"?"TF":"MC"}_${String(b.b03_review_ordinal).padStart(3,"0")}`
     &&!publicIds.has(b.id),"public ID or review ordinal");
   publicIds.add(b.id);
   fail(b.source_id===b.source_slot_id.split("|")[0]
     &&b.source_pdf_sha256===e[2]
     &&payload.source_pdf_binary_hashes_by_paper?.[b.source_id]===e[2]
     &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1
     &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
     &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
     &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
     &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"PDF hash/page/bbox");
   fail(b.answer===e[0]&&b.canonical_kp_id===e[1]&&b.b03_review_ordinal===e[3]
     &&validString(b.stem)&&validString(b.answer_explanation)&&validString(b.answer_assumption),
    "independent science answer/KP/rationale");
   let stem=normalize(b.stem);fail(!stems.has(stem),"repeated source question stem");stems.add(stem);
   const unit=resolveUnit(authority,b.unit);
   fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"KP authority");
   if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!('options' in b),"TF O/X");}
   else {choice++;fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
     &&Array.isArray(b.options)&&b.options.length===4
     &&b.options.every((x,i)=>validString(x)&&x.startsWith(["①","②","③","④"][i])),"original complete four choices");}
   fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false
    &&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
    &&b.evidence_ref===EVIDENCE,"release authorization and rights");
 }
 fail(tf===21&&choice===20&&sourceIds.size===41&&publicIds.size===41&&stems.size===41,"41 total");
 return {admission:"P12_B04_B03_41_CERTIFIED",blocks:payload.blocks,answerSlots:41,standaloneTf:21,standaloneChoice:20,contextGroups:0};
}
