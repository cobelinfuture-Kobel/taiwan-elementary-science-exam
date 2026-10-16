import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_POST41_SCANSECONDARY2_PATH="../data/question-bank/p12-e01-post41-scansecondary2-public-v1.json";
const e=[
["SCI_G04_S1_114_MID_002|S2|TF|013","X","sci_g04s1_02_06","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",[366.25,209.375,402.5,231.25],[586,335,644,370],"睡蓮的葉背有氣孔可以輸送空氣。"],
["SCI_G04_S1_114_FINAL_002|S1|TF|011","X","sci_g04s1_04_08","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",[22.5,523.125,68.75,549.375],[36,837,110,879],"相同數量的電池和燈泡，在電池接法相同但燈泡接法不同的情況下，單個燈泡的亮度仍然會相同。"]
];
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(ok)=>{if(!ok)throw Error("P12_E01_SCANSECONDARY2_SOURCE_GATE")};
export function validateAndConvertP12E01Post41ScanSecondary2(v,a){
 gate(v?.schema_version==="SCIENCE_P12_E01_POST41_SCANSECONDARY_TWO_PUBLIC_V1"&&v.public_site_integrated===true&&v.expected_answer_slots===2&&v.expected_blocks===2&&v.expected_standalone_true_false===2&&v.expected_standalone_choice===0&&v.original_teacher_answer_key_authenticated===false&&v.original_cropped_images_included===false&&v.source_image_geometry_verified==="DIRECT_RASTER_SOURCE_PIXEL_BBOX"&&v.evidence_ref==="data/review/p12-e01-post41-scansecondary6-source-science-kp-dedup-v1.json"&&v.blocks?.length===2);
 for(let i=0;i<2;i++){const b=v.blocks[i],x=e[i],u=resolveUnit(a,b.unit);
  gate(eq([b.source_slot_id,b.answer,b.canonical_kp_id,b.source_pdf_sha256,b.source_pdf_bbox_pts_top_left,b.source_image_answer_marker_pixel_bbox_upright,b.stem],x));
  gate(b.type==="tf"&&b.operator_publication_approval===true&&b.dependency_review_verified===true&&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false&&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES");
  gate(u?.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id));
  gate(eq(b.secondary_canonical_kp_ids||[],i?["sci_g04s1_04_09"]:[]));
 }
 return {blocks:v.blocks,answerSlots:2,standaloneTf:2,standaloneChoice:0,contextGroups:0};
}
