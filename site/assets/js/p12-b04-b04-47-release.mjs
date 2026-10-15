import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B04_47_PATH="../data/question-bank/p12-b04-b04-47-public-v1.json";
export const P12_B04_B04_47_SCHEMA="SCIENCE_P12_B04_B04_47_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b04-47-formal-science-kp-native-source-acceptance-v1.json";
const ACCEPTED=new Map([
 ["SCI_G04_S1_114_FINAL_005|S1|TF|014",["X","sci_g04s1_04_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",1]],
 ["SCI_G04_S1_114_FINAL_005|S1|TF|015",["X","sci_g04s1_04_01","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",2]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|001",["(3)","sci_g04s1_04_10","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",3]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|002",["(1)","sci_g04s1_04_01","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",4]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|003",["(2)","sci_g04s1_04_05","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",5]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|004",["(3)","sci_g04s1_04_05","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",6]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|005",["(4)","sci_g04s1_04_04","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",7]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|009",["(1)","sci_g04s1_04_01","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",8]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|010",["(2)","sci_g04s1_03_03","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",9]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|011",["(1)","sci_g04s1_03_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",10]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|012",["(3)","sci_g04s1_03_06","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",11]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|013",["(2)","sci_g04s1_03_07","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",12]],
 ["SCI_G04_S1_114_FINAL_005|S2|MC|014",["(1)","sci_g04s1_03_06","7a02cb1c21c27fa4ef795c38e5023619c5f0f6b45dfd145eab7da18077987542",13]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|001",["O","sci_g04s1_03_01","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",14]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|002",["X","sci_g04s1_03_01","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",15]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|003",["O","sci_g04s1_03_03","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",16]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|004",["X","sci_g04s1_03_04","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",17]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|005",["O","sci_g04s1_03_07","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",18]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|006",["X","sci_g04s1_03_03","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",19]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|007",["O","sci_g04s1_03_08","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",20]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|008",["X","sci_g04s1_04_06","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",21]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|009",["X","sci_g04s1_04_10","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",22]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|010",["X","sci_g04s1_04_01","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",23]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|012",["O","sci_g04s1_04_02","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",24]],
 ["SCI_G04_S1_114_FINAL_006|S1|TF|013",["O","sci_g04s1_04_04","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",25]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|001",["③","sci_g04s1_03_07","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",26]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|002",["②","sci_g04s1_03_06","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",27]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|004",["④","sci_g04s1_03_06","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",29]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|005",["①","sci_g04s1_03_03","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",30]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|006",["③","sci_g04s1_03_05","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",31]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|007",["③","sci_g04s1_03_07","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",32]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|009",["③","sci_g04s1_03_09","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",33]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|010",["②","sci_g04s1_04_06","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",34]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|012",["①","sci_g04s1_04_03","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",36]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|013",["③","sci_g04s1_04_04","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",37]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|014",["④","sci_g04s1_04_10","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",38]],
 ["SCI_G04_S1_114_FINAL_006|S2|MC|016",["④","sci_g04s1_04_12","04069880c0f3985d7ad2c30ae643e649b3fe4eef1282e156dbd6ef623023fc1f",39]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|001",["O","sci_g04s1_03_06","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",40]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|003",["X","sci_g04s1_03_06","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",42]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|004",["X","sci_g04s1_03_01","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",43]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|005",["X","sci_g04s1_04_12","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",44]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|007",["X","sci_g04s1_03_03","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",45]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|009",["X","sci_g04s1_04_09","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",46]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|010",["O","sci_g04s1_04_02","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",47]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|011",["O","sci_g04s1_03_08","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",48]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|012",["O","sci_g04s1_04_11","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",49]],
 ["SCI_G04_S1_114_FINAL_007|S01|TF|013",["O","sci_g04s1_04_05","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",50]]
]);
const fail=(ok,why)=>{if(!ok)throw Error("P12 B04 B04 47 rejected: "+why);};
const valid=s=>typeof s==="string"&&s.trim().length>0;
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/g,"").replace(/[，,。．？！!?：「」『』（）、]/g,"");
export function validateAndConvertP12B04B04_47(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B04_47_SCHEMA&&bank.public_site_integrated===true
 &&bank.frozen_batch_id==="B04"&&bank.source_count_reviewed===50&&bank.original_source_positions_approved===47
 &&bank.exceptions_held===3&&bank.expected_blocks===47&&bank.expected_answer_slots===47
 &&bank.expected_standalone_true_false===24&&bank.expected_standalone_choice===23
 &&bank.expected_parenthetical_source_choices===11&&bank.source_choice_labels_are_immutable===true
 &&bank.original_teacher_answer_key_authenticated===false&&bank.original_cropped_images_included===false
 &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===47,"frozen source bank");
 const ids=new Set(),sources=new Set(),stems=new Set();let tf=0,mc=0,native=0;
 for(const b of bank.blocks){
  const expected=ACCEPTED.get(b.source_slot_id);
  fail(expected&&!sources.has(b.source_slot_id),"source ID not certified or duplicate");sources.add(b.source_slot_id);
  const id=`P12_B04_G04S1_B04_${b.type==="tf"?"TF":"MC"}_${String(b.b04_review_ordinal).padStart(3,"0")}`;
  fail(b.id===id&&!ids.has(b.id),"original printed ordinal/public identity");ids.add(b.id);
  fail(b.source_id===b.source_slot_id.split("|")[0]
    &&b.source_pdf_sha256===expected[2]
    &&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===expected[2]
    &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1
    &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
    &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
    &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
    &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"original SHA, PDF page, answer BBox");
  fail(b.answer===expected[0]&&b.canonical_kp_id===expected[1]&&b.b04_review_ordinal===expected[3]
    &&valid(b.stem)&&valid(b.answer_explanation)&&valid(b.answer_assumption),"science unique answer/explanation/KP");
  const signature=norm(b.stem);fail(!stems.has(signature),"duplicate stem");stems.add(signature);
  const u=resolveUnit(authority,b.unit);
  fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP authority");
  if(b.type==="tf"){tf++;fail(["O","X"].includes(b.answer)&&!("options" in b),"TF format");}
  else{
    mc++;
    const markers=b.options?.[0]?.startsWith("(1)")?["(1)","(2)","(3)","(4)"]:["①","②","③","④"];
    if(markers[0]==="(1)")native++;
    fail(b.type==="mcq"&&Array.isArray(b.options)&&b.options.length===4
      &&b.options.every((o,i)=>valid(o)&&o.startsWith(markers[i]))
      &&markers.includes(b.answer),"complete original native choice labels and exact answer marker");
  }
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","release rights/dependencies");
 }
 fail(ids.size===47&&sources.size===47&&stems.size===47&&tf===24&&mc===23&&native===11,"source/type/native marker parity");
 return {admission:"P12_B04_B04_47_CERTIFIED",blocks:bank.blocks,answerSlots:47,standaloneTf:24,standaloneChoice:23,contextGroups:0};
}
