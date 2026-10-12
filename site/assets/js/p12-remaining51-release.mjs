import {resolveUnit} from "./authority-adapter.mjs";
export const P12_REMAINING51_SCHEMA="SCIENCE_EXAM_P12_G03S2MID_REMAINING51_PUBLIC_V1";
export const P12_REMAINING51_PATH="../data/question-bank/p12-g03s2mid-remaining51-public-v1.json";
export const P12_REMAINING51_APPROVAL_PATH="../data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json";
const approvalSchema="SCIENCE_P12_G03S2MID_REMAINING51_OPERATOR_PUBLIC_APPROVAL_V1";
const sourceSha="372db8a4016eec03e6910b4ea617c32c7e27f14d01c12a37447b2d8f5830eb71";
const operatorRef="site/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json";
const releaseRef="site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json";
const clean=x=>typeof x==="string"&&x.trim().length>0;
const verify=(yes,msg)=>{if(!yes)throw Error("P12 51 題公開入庫驗證失敗："+msg);};
const actualSlots=b=>b.type==="group"?b.items.map(x=>x.source_slot_id):[b.source_slot_id];
const tffamily=["G03-S2-MID|TF|P01|008","G03-S2-MID|MC|P01|008"];
export function validateAndConvertP12Remaining51(bank,approval,authority){
 verify(bank?.schema_version===P12_REMAINING51_SCHEMA&&bank.public_site_integrated===true
   &&bank.source_id==="G03-S2-MID"&&bank.source_pdf_sha256===sourceSha
   &&bank.operator_review_ref===operatorRef&&bank.expected_deployed_bank_answer_slots===205
   &&bank.original_teacher_answer_key_authenticated===false&&bank.original_pdf_embedded===false,
   "公開內容版本或原卷來源不符");
 verify(approval?.schema_version===approvalSchema
   &&approval.decision==="APPROVE_REMAINING51_FOR_PUBLIC_ADMISSION"
   &&approval.approved_release_path===releaseRef
   &&approval.source_pdf_sha256===sourceSha
   &&approval.approved_slot_count===51&&approval.approved_block_count===27
   &&approval.expected_total_public_answer_slots===205
   &&approval.original_p11_public_slots_preserved===148
   &&approval.original_p12_six_public_slots_preserved===6
   &&Array.isArray(approval.approved_items)&&approval.approved_items.length===51,
   "operator 公開核准清冊不完整");
 verify(bank.expected_question_blocks===27&&bank.expected_answer_slots===51
   &&bank.expected_true_false===10&&bank.expected_single_choice===11&&bank.expected_context_groups===6
   &&Array.isArray(bank.blocks)&&bank.blocks.length===27&&bank.same_worksheet_exclusion_group==="SEAWEED_MOISTURE",
   "51 題精確數量與同卷排除政策不符");
 const authorized=new Map();
 for(const x of approval.approved_items){
  verify(clean(x.source_slot_id)&&!authorized.has(x.source_slot_id)
    &&clean(x.published_block_id)&&clean(x.answer)&&clean(x.canonical_kp_id)&&clean(x.unit)
    &&x.source_original_preserved_in_nonpublic_audit===true,"核准來源位置重複或不完整");
  authorized.set(x.source_slot_id,x);
 }
 const ids=new Set(),seen=new Set(),blockedFamily=new Set();
 let tf=0,mcq=0,groups=0,slots=0;
 for(const b of bank.blocks){
  verify(clean(b.id)&&!ids.has(b.id),"重複／缺少 block ID");
  ids.add(b.id);
  const unit=resolveUnit(authority,b.unit);
  verify(unit&&unit.grade===3&&unit.semester===2&&["U01","U02"].includes(unit.unit_id)
    &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"單元及主 KP 不在正式 authority");
  verify(b.source_pdf_sha256===sourceSha&&b.source_id==="G03-S2-MID"&&b.grade===3&&b.semester===2
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&Number.isInteger(b.source_page_pdf_1_based)&&b.source_page_pdf_1_based>=1&&b.source_page_pdf_1_based<=3
    &&b.operator_publication_approval===true&&b.operator_approval_ref===operatorRef
    &&b.release_status==="PUBLISHED_P12_REMAINING51"&&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES",
    "題目來源／權利／公開核准不完整："+b.id);
  for(const kp of b.secondary_canonical_kp_ids??[])
   verify(unit.knowledge_points.some(x=>x.canonical_kp_id===kp),"次要 canonical KP 無效："+b.id);
  const slotIds=actualSlots(b);
  verify(Array.isArray(b.source_slot_ids)&&b.source_slot_ids.length===slotIds.length
    &&b.source_slot_ids.every((x,i)=>x===slotIds[i]),"原卷位置及組內順序不同："+b.id);
  if(b.type==="group"){
   ++groups;
   verify(b.source==="CERTIFIED_CONTEXT_RECONSTRUCTED"&&b.dependencies_complete===true
     &&Array.isArray(b.items)&&b.items.length>0&&clean(b.title)
     &&clean(b.shared?.instructions)&&typeof b.shared?.passage==="string"
     &&Array.isArray(b.shared?.choiceBank)&&b.shared.table===null,"共用情境缺失："+b.id);
   for(const sub of b.items){
    verify(["tf","short"].includes(sub.type)&&clean(sub.stem)&&clean(sub.answer)
      &&clean(sub.answer_explanation)&&unit.knowledge_points.some(k=>k.canonical_kp_id===sub.canonical_kp_id),
      "子題資料或 KP 不完整："+b.id);
    if(sub.type==="tf")verify(["O","X"].includes(sub.answer),"組內 O/X 不完整");
   }
  }else{
   verify(b.source==="P12_OPERATOR_APPROVED_QUESTION"&&clean(b.stem)&&clean(b.answer)
     &&clean(b.answer_explanation),"獨立題目內容不足："+b.id);
   if(b.type==="tf"){++tf;verify(["O","X"].includes(b.answer),"是非答案無效");}
   else if(b.type==="mcq"){++mcq;verify(Array.isArray(b.options)&&b.options.length===4&&
     ["①","②","③","④"].includes(b.answer)&&b.options.every((o,i)=>o.startsWith(["①","②","③","④"][i])),"四選一答案不完整");}
   else verify(false,"未知單題型別："+b.type);
  }
  for(const id of slotIds){
   const a=authorized.get(id),item=b.type==="group"?b.items.find(x=>x.source_slot_id===id):b;
   verify(a&&!seen.has(id)&&a.published_block_id===b.id&&a.unit===b.unit
     &&a.answer===item.answer&&a.canonical_kp_id===item.canonical_kp_id,
     "答案或 KP 未獲逐位置核准："+id);
   seen.add(id);slots++;
   if(tffamily.includes(id)){
    verify(b.same_worksheet_exclusion_group==="SEAWEED_MOISTURE"
      &&b.same_worksheet_exclusion_policy==="MUTUALLY_EXCLUSIVE",
      "海苔跨題型重複排除宣告缺失："+id);
    blockedFamily.add(id);
   }
  }
 }
 verify(slots===51&&seen.size===51&&authorized.size===51
   &&tf===10&&mcq===11&&groups===6&&blockedFamily.size===2
   &&approval.published_same_worksheet_exclusion?.length===2
   &&approval.published_same_worksheet_exclusion.every(x=>blockedFamily.has(x)),
   "題數、重複控制或源位置總表無法對帳");
 const groupNames=bank.blocks.filter(x=>x.type==="group").map(x=>x.id);
 verify(groupNames.join("|")===[
   "P12_REMAIN51_VEGETABLE_5","P12_REMAIN51_WATER_01",
   "P12_REMAIN51_WATER_02","P12_REMAIN51_WATER_03",
   "P12_REMAIN51_WATER_04","P12_REMAIN51_HYDROPONIC_4"].join("|"),
   "不可遺漏原卷六組共用情境");
 verify(bank.blocks.filter(x=>x.type==="group").map(x=>x.items.length).join(",")==="5,4,7,7,3,4",
   "共用題組作答位置 30 不完整");
 return {admission:"P12_REMAINING51_OPERATOR_CERTIFIED",blocks:bank.blocks,answerSlots:51,standaloneTf:10,standaloneChoice:11,contextGroups:6};
}
