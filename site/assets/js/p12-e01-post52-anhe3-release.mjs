import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST52_ANHE3_PATH="../data/question-bank/p12-e01-post52-anhe-final3-public-v1.json";
export const P12_E01_POST52_ANHE3_SCHEMA="SCIENCE_P12_E01_POST52_ANHE_FINAL3_PUBLIC_V1";
const PAPER="SCI_G04_S1_114_FINAL_007";
const PDF_SHA="5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2";
const EVIDENCE="data/review/p12-e01-post52-anhe-final3-directkp-nativepdf-acceptance-v1.json";
const EXPECTED=new Map([["SCI_G04_S1_114_FINAL_007|S01|TF|002",["P12_E01_POST52_ANHE_TF_001","O","sci_g04s1_03_09","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",1,[56.64,257.68,93.83,276.59],"一氧化碳偵測警報器是一種具有警示功能的物品。",[],"一氧化碳偵測警報器會透過聲音或燈光提示一氧化碳危險，屬於聲與光的警示功能。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_007|S01|TF|014",["P12_E01_POST52_ANHE_TF_002","O","sci_g04s1_03_09","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",1,[56.53,657.6,93.72,676.51],"地震時，手機會用警報聲來提醒民眾注意，這是利用聲音來警示危險。",[],"地震警報可以利用手機發出聲響提醒民眾危險，是聲音警示的例子。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_007|S02|MC|002",["P12_E01_POST52_ANHE_MC_001","④","sci_g04s1_03_09","5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2",1,[56.28,841.67,104.28,853.67],"腳踏車加裝什麼物品可以增加騎乘的安全性?",["①反光板","②車鈴","③車燈","④以上皆是。"],"反光板反射光、車鈴發出聲響、車燈增加可見度，三者都能協助提醒與保護騎乘者，因此選④。","4-S1-U03"]]]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(ok,reason)=>{if(!ok)throw Error("P12_E01_POST52_ANHE3_FAIL_CLOSED: "+reason);};
export function validateAndConvertP12E01Post52Anhe3(bank,authority){
 gate(bank?.schema_version===P12_E01_POST52_ANHE3_SCHEMA
  &&bank.public_site_integrated===true&&bank.source_paper_id===PAPER
  &&bank.source_pdf_sha256===PDF_SHA
  &&bank.expected_blocks===3&&bank.expected_answer_slots===3
  &&bank.expected_standalone_true_false===2&&bank.expected_standalone_choice===1
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false
  &&bank.source_image_geometry_verified==="NATIVE_PDF_TEXT_GLYPH_BBOX_SHA_VISUAL"
  &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===3,"frozen source PDF metadata");
 const ids=new Set(),sources=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const e=EXPECTED.get(b.source_slot_id);
  gate(e&&!sources.has(b.source_slot_id),"original source slot");
  sources.add(b.source_slot_id);
  gate(b.id===e[0]&&!ids.has(b.id),"public unique immutable ID");
  ids.add(b.id);
  gate(b.source_id===PAPER&&b.source_pdf_sha256===e[3]
   &&b.source_page_pdf_1_based===1&&b.source_page_pdf_1_based===e[4]
   &&eq(b.source_pdf_bbox_pts_top_left,e[5])
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)
   &&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"native original PDF glyph marker");
  gate(b.stem===e[6]&&b.answer===e[1]&&b.canonical_kp_id===e[2]
   &&b.unit===e[9]&&b.answer_explanation===e[8]
   &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"printed stem, independently reasoned answer and KP");
  gate(!stems.has(b.stem),"duplicate printed stems");
  stems.add(b.stem);
  const unit=resolveUnit(authority,b.unit);
  gate(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id&&k.title==="聲與光的警示和指示用途"),"direct canonical warning KP title");
  if(b.type==="tf"){
    tf++;gate(["O","X"].includes(b.answer)&&e[7].length===0&&!("options" in b),"true/false source");
  }else{
    mc++;gate(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
      &&eq(b.options,e[7])&&Array.isArray(b.options)&&b.options.length===4
      &&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i])),"all four printed choices");
  }
  gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true
   &&b.evidence_ref===EVIDENCE
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","operator/rights/source");
 }
 gate(ids.size===3&&sources.size===3&&stems.size===3&&tf===2&&mc===1,"exact 3 source IDs, 2TF/1MC");
 return {admission:"P12_E01_POST52_ANHE3_CERTIFIED",blocks:bank.blocks,answerSlots:3,standaloneTf:2,standaloneChoice:1,contextGroups:0};
}
