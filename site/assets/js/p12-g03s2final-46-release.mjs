import {resolveUnit} from "./authority-adapter.mjs";
export const P12_G03FINAL_46_SCHEMA="SCIENCE_EXAM_P12_G03S2FINAL_46_PUBLIC_V1";
export const P12_G03FINAL_46_PATH="../data/question-bank/p12-g03s2final-46-public-v1.json";
export const P12_G03FINAL_46_APPROVAL_PATH="../data/governance/p12-g03s2final-46-operator-public-approval-v1.json";
const approvalSchema="SCIENCE_P12_G03S2FINAL_46_OPERATOR_PUBLIC_APPROVAL_V1";
const sha="078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793";
const approvalPath="site/data/governance/p12-g03s2final-46-operator-public-approval-v1.json";
const releasePath="site/data/question-bank/p12-g03s2final-46-public-v1.json";
const fish="G03-S2-FINAL|COMPOSITE|P03|003",fishProof="data/review/p12-g03s2final-composite-p03-q03-science-correction-v1.json";
function ck(ok,msg){if(!ok)throw Error("P12 三下期末 46 題公開驗證失敗："+msg);}
const text=x=>typeof x==="string"&&x.trim().length>0;
export function validateAndConvertP12G03Final46(bank,approval,authority){
 ck(bank?.schema_version===P12_G03FINAL_46_SCHEMA
  &&bank.public_site_integrated===true&&bank.source_id==="G03-S2-FINAL"&&bank.source_pdf_sha256===sha
  &&bank.operator_review_ref===approvalPath
  &&bank.expected_deployed_bank_answer_slots===251
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_pdf_embedded===false&&bank.source_cropped_images_included===false,
  "完整來源與公開版本");
 ck(approval?.schema_version===approvalSchema
  &&approval.decision==="APPROVE_46_SOURCE_VERIFIED_LEARNER_POSITIONS_FOR_PUBLIC_ADMISSION"
  &&approval.source_pdf_sha256===sha&&approval.approved_release_path===releasePath
  &&approval.exact_prepublic_approval_ref==="data/review/p12-g03s2final-46-prepublic-acceptance-v1.json"
  &&approval.fishbowl_science_adjudication_ref==="data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json"
  &&approval.approved_slot_count===46&&approval.approved_block_count===28
  &&approval.preexisting_public_answer_slots===205&&approval.expected_total_public_answer_slots===251
  &&approval.original_p11_public_tf_excluded===8
  &&approval.teacher_answer_key_authenticated===false
  &&Array.isArray(approval.approved_items)&&approval.approved_items.length===46,"核准清冊不完整");
 ck(bank.expected_question_blocks===28&&bank.expected_answer_slots===46
  &&bank.expected_true_false===6&&bank.expected_single_choice===14
  &&bank.expected_figure_groups===6&&bank.expected_reading_groups===2
  &&Array.isArray(bank.blocks)&&bank.blocks.length===28,"來源數量");
 const sourceApproval=new Map();
 for(const x of approval.approved_items){
  ck(text(x.source_slot_id)&&!sourceApproval.has(x.source_slot_id)
   &&text(x.published_block_id)&&text(x.canonical_kp_id)&&text(x.unit)
   &&text(x.answer)&&x.original_source_review_preserved===true,
   "來源重複／未完整核准");
  sourceApproval.set(x.source_slot_id,x);
 }
 const idSet=new Set(),seen=new Set(),groupKinds={figure:0,reading:0},counts={tf:0,mcq:0};
 let total=0;
 const figs=new Set(["flying-animals","animal-habitats","rain-gauges","wind-directions","forecast-activities","warning-colors"]);
 for(const b of bank.blocks){
  ck(text(b.id)&&!idSet.has(b.id),"重複 block id");idSet.add(b.id);
  const unit=resolveUnit(authority,b.unit);
  ck(unit?.grade===3&&unit.semester===2&&["U03","U04"].includes(unit.unit_id)
   &&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"單元主 KP 不存在："+b.id);
  for(const k of b.secondary_canonical_kp_ids??[])ck(unit.knowledge_points.some(z=>z.canonical_kp_id===k),"次要 KP 無效："+b.id);
  ck(b.grade===3&&b.semester===2&&b.source_id==="G03-S2-FINAL"&&b.source_pdf_sha256===sha
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.operator_approval_ref===approvalPath
   &&b.operator_publication_approval===true
   &&b.release_status==="PUBLISHED_P12_G03S2FINAL_46"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
   &&b.source_page_pdf_1_based>=1&&b.source_page_pdf_1_based<=2,
   "單題來源和權利資料無效："+b.id);
  const items=b.type==="group"?b.items:[b];
  ck(Array.isArray(items)&&items.length>0,"沒有小題："+b.id);
  ck(Array.isArray(b.source_slot_ids)&&b.source_slot_ids.length===items.length
   &&items.every((x,i)=>b.source_slot_ids[i]===x.source_slot_id),"source slot 順序不同："+b.id);
  if(b.type==="group"){
   ck(b.source==="CERTIFIED_CONTEXT_RECONSTRUCTED"
    &&b.dependencies_complete===true&&text(b.title)
    &&text(b.shared?.instructions)&&Array.isArray(b.shared?.choiceBank)
    &&typeof b.shared?.passage==="string"&&b.shared.table===null,
    "題組共用脈絡不完整："+b.id);
   if(b.figure_spec){
    groupKinds.figure++;
    ck(figs.has(b.figure_spec.kind)&&b.figure_spec.viewBox==="0 0 460 236"
     &&b.figure_spec.preserveAspectRatio==="xMidYMid meet"
     &&b.figure_spec.scale_policy==="MAX_WIDTH_100_PERCENT_AUTO_HEIGHT"
     &&b.figure_spec.labels?.length===items.length,"SVG 圖形規格錯誤："+b.id);
    if(b.figure_spec.kind==="rain-gauges"){
     ck(b.figure_spec.labels[2]==="曲面小魚缸"
      &&items[2].source_slot_id===fish&&items[2].answer==="X"
      &&items.map(x=>x.answer).join(",")==="O,X,X,O","魚缸原圖和 O→X 裁定無效");
    }
    if(b.figure_spec.kind==="wind-directions")
     ck(items.map(x=>x.answer).join(",")==="B,A,D,F","風向源圖與答案漂移");
   }else{
    groupKinds.reading++;
    ck(text(b.shared.passage)&&items.length===2
     &&items.every(x=>x.type==="mcq"&&x.options?.length===4),"閱讀文章／四選一不完整："+b.id);
   }
  }else{
   ck(b.source==="P12_OPERATOR_APPROVED_QUESTION","單題來源標記錯誤："+b.id);
   ck(["tf","mcq"].includes(b.type)&&text(b.stem)&&text(b.answer_explanation),"單題型別和內容不完整："+b.id);
   counts[b.type]++;
  }
  for(const item of items){
   const id=item.source_slot_id,record=sourceApproval.get(id);
   ck(record&&!seen.has(id)&&record.published_block_id===b.id
    &&record.unit===b.unit&&record.answer===item.answer
    &&record.canonical_kp_id===item.canonical_kp_id
    &&unit.knowledge_points.some(x=>x.canonical_kp_id===item.canonical_kp_id),
    "46 來源位置與核准答案/KP 不一致："+id);
   ck(text(item.stem)&&text(item.answer)&&text(item.answer_explanation),"小題答案空白："+id);
   if(item.type==="tf")ck(["O","X"].includes(item.answer),"是非答案無效："+id);
   if(item.type==="mcq")ck(Array.isArray(item.options)&&item.options.length===4
    &&["①","②","③","④"].includes(item.answer)
    &&item.options.every((x,i)=>x.startsWith(["①","②","③","④"][i])),"選項或答案不完整："+id);
   if(item.type==="short")ck(b.type==="group"&&b.shared.choiceBank.some(x=>x.startsWith(item.answer+" ")),"配合題選項無效："+id);
   if(id===fish)ck(item.answer==="X"&&record.science_exception_ref===fishProof,"魚缸 X 裁定證據缺失");
   seen.add(id);total++;
  }
 }
 ck(total===46&&seen.size===46&&sourceApproval.size===46&&idSet.size===28
  &&groupKinds.figure===6&&groupKinds.reading===2
  &&counts.tf===6&&counts.mcq===14,"整包 28 區塊、46 作答位置不符");
 for(let n=2;n<=9;n++)ck(!seen.has("G03-S2-FINAL|TF|P01|"+String(n).padStart(3,"0")),"P11 原有八題不可重複入庫");
 return {admission:"P12_G03S2FINAL_46_OPERATOR_APPROVED_PUBLIC",blocks:bank.blocks,answerSlots:46,standaloneTf:6,standaloneChoice:14,contextGroups:8,figureGroups:6,readingGroups:2};
}
