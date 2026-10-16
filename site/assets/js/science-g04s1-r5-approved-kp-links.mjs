// R5: preserve frozen V1 source certification, attach independently reviewed V2 KP links only.
// Never mutate original source/answer/primary KP nor create another student question.
export const R5_G04S1_OVERLAY_REVISION="SCIENCE_G04S1_R5_APPROVED_ADDITIVE_KP_LINKS_V1";
const links=[
 {source_slot_id:"SCI_G04_S1_114_MID_002|S1|MC|010",id:"P12_E01_HESHUN_MID_MC_004",unit:"4-S1-U02",old:"sci_g04s1_02_02",additional:"sci_g04s1_02_13",answer:"④",stem:"下列哪些資料是進行水域環境調查時要紀錄的？",source_pdf_sha256:"3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",bbox:[21.875,586.875,60,605.625]},
 {source_slot_id:"SCI_G04_S1_114_MID_007|S01|TF|003",id:"P12_E01_POST49_MINGYI_MID_TF_003",unit:"4-S1-U01",old:"sci_g04s1_01_05",additional:"sci_g04s1_01_12",answer:"X",stem:"著名的地形景觀「風吹砂」，代表只有風會改變墾丁國家公園海邊沙丘的樣貌，雨水不會。",source_pdf_sha256:"65a32f80deada9a9d8ddfb03368b50536f78981e283a92c9d9b85c14173a72b6",bbox:[54.6,267.65,108.39,281.69]}
];
const gate=(pass,message)=>{if(!pass)throw Error("G04S1_R5_OVERLAY_FAIL_CLOSED: "+message);};
export function applyG04S1R5ApprovedKPLinks(blocks,authority){
 gate(Array.isArray(blocks)&&authority?.schema_version,"payload");
 // Legacy 187-KP contract must remain exactly unchanged.
 if(authority.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V2")return blocks;
 gate(authority.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3","expected 190-KP selector");
 const encountered=new Set();
 const converted=blocks.map(block=>{
  const link=links.find(x=>x.id===block.id||x.source_slot_id===block.source_slot_id);
  if(!link)return block;
  gate(block.id===link.id&&block.source_slot_id===link.source_slot_id&&!encountered.has(link.id),"exact unique certified source identity");
  gate(block.unit===link.unit&&block.canonical_kp_id===link.old&&block.answer===link.answer&&block.stem===link.stem,"immutable answer/stem/primary KP");
  gate(block.source_pdf_sha256===link.source_pdf_sha256&&JSON.stringify(block.source_pdf_bbox_pts_top_left)===JSON.stringify(link.bbox),"source PDF SHA and original coordinate parity");
  const unit=authority.units.find(u=>u.grade===4&&u.semester===1&&u.unit_id===link.unit.slice(-3));
  gate(unit?.knowledge_points.some(k=>k.canonical_kp_id===link.additional),"new authority KP target");
  const previous=block.secondary_canonical_kp_ids??[];
  gate(Array.isArray(previous)&&!previous.includes(link.additional),"duplicate additional link");
  encountered.add(link.id);
  return {...block,secondary_canonical_kp_ids:[...previous,link.additional],kp_overlay_revision:R5_G04S1_OVERLAY_REVISION};
 });
 gate(encountered.size===links.length,"both previously admitted sources must be present");
 gate(converted.length===blocks.length,"no new student question");
 return converted;
}
export const R5_APPROVED_ADDITIVE_KP_LINKS=links.map(x=>({source_slot_id:x.source_slot_id,base_canonical_kp_id:x.old,additional_canonical_kp_id:x.additional}));
