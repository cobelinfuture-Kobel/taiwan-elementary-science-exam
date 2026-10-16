import {validateAndConvertP12Six,P12_SIX_BANK_PATH} from "./p12-six-release.mjs";
import {validateAndConvertP12Remaining51,P12_REMAINING51_PATH,P12_REMAINING51_APPROVAL_PATH} from "./p12-remaining51-release.mjs";
import {validateAndConvertP12G03Final46,P12_G03FINAL_46_PATH,P12_G03FINAL_46_APPROVAL_PATH} from "./p12-g03s2final-46-release.mjs";
import {certificationGate} from "./s3-admission.mjs";
import {validateAndConvertP12B04B06_47,P12_B04_B06_47_PATH} from "./p12-b04-b06-47-release.mjs";
import {validateAndConvertP12B04B07_31,P12_B04_B07_31_PATH} from "./p12-b04-b07-31-release.mjs";
import {validateAndConvertP12E01PurenFinal16,P12_E01_PUREN_FINAL16_PATH} from "./p12-e01-puren-final16-release.mjs";
import {validateAndConvertP12E01PurenMid13,P12_E01_PUREN_MID13_PATH} from "./p12-e01-puren-mid13-release.mjs";
import {validateAndConvertP12E01HeshunMid15,P12_E01_HESHUN_MID15_PATH} from "./p12-e01-heshun-mid15-release.mjs";
import {validateAndConvertP12E01HeshunFinal19,P12_E01_HESHUN_FINAL19_PATH} from "./p12-e01-heshun-final19-release.mjs";
import {validateAndConvertP12E01Post52Anhe3,P12_E01_POST52_ANHE3_PATH} from "./p12-e01-post52-anhe3-release.mjs";
import {validateAndConvertP12E01Post49Source2,P12_E01_POST49_SOURCE2_PATH} from "./p12-e01-post49-source2-release.mjs";
import {validateAndConvertP12B04B05_40,P12_B04_B05_40_PATH} from "./p12-b04-b05-40-release.mjs";
import {validateAndConvertP12B04B04_47,P12_B04_B04_47_PATH} from "./p12-b04-b04-47-release.mjs";
import {validateAndConvertP12B04B03_41,P12_B04_B03_41_PATH} from "./p12-b04-b03-41-release.mjs";
import {validateAndConvertP12B04B02_41,P12_B04_B02_41_PATH} from "./p12-b04-b02-41-release.mjs";
import {validateAndConvertP12B04B01_47,P12_B04_B01_47_PATH} from "./p12-b04-b01-47-release.mjs";
import {validateAndConvertP12B04ChongdeMid6,P12_B04_CHONGDE_MID6_PATH} from "./p12-b04-chongde-mid-release.mjs";
import {validateAndConvertP12B04YonganMid9,P12_B04_YONGAN_MID9_PATH} from "./p12-b04-yongan-mid-release.mjs";
import {validateAndConvertP12E01Post47Dongguang1,P12_E01_POST47_DONGGUANG1_PATH} from "./p12-e01-post47-dongguang1-release.mjs";
import {validateAndConvertP12E01Post46AnheWind1,P12_E01_POST46_ANHE_WIND1_PATH} from "./p12-e01-post46-anhe-wind1-release.mjs";
import {validateAndConvertP12E01Post45Puren2,P12_E01_POST45_PUREN2_PATH} from "./p12-e01-post45-puren2-release.mjs";
import {resolveUnit} from "./authority-adapter.mjs";
import {applyG04S1R5ApprovedKPLinks} from "./science-g04s1-r5-approved-kp-links.mjs";
export const EMBEDDED_BANK_SCHEMA="SCIENCE_S3_P10_CUMULATIVE_EXAM_BANK_V1";
export const EMBEDDED_BANK_PATH="../data/question-bank/approved-historical-ox-v4.json";
const normalizedAnswers={"O":"TRUE","X":"FALSE"};
function normalize(row,authority){
 if(!row||row.type!=="tf"||!["O","X"].includes(row.answer)||!row.stem?.trim())
  throw Error("歷屆題目題型／答案不完整");
 const unit=resolveUnit(authority,row.unit);
 const kp=unit?.knowledge_points.find(k=>k.canonical_kp_id===row.canonical_kp_id);
 if(!kp)throw Error("歷屆題目指向不存在的 KP："+row.id);
 if(row.grade!==unit.grade||row.semester!==unit.semester)throw Error("題目學期與 KP 不一致："+row.id);
 const c={
  candidate_id:row.id,source_id:row.source_id,source_page_pdf_1_based:row.source_page_pdf_1_based,
  question_type:"TRUE_FALSE",raw_question_text:row.stem,
  review_status:"P04_OPERATOR_ACCEPTED",admission_status:row.admission_status,
  license_status:row.license_status,regulated_exam_identity_verified:row.regulated_exam_identity_verified,
  third_party_content_clearance:row.third_party_content_clearance,public_material_scope:row.public_material_scope,
  original_teacher_answer_text_excluded:row.original_teacher_answer_text_excluded,
  answer_evidence_status:row.answer_evidence_status,science_answer_source:row.science_answer_source??"S3_P03_SCIENCE_REVIEW",
  model_science_answer_review_completed:row.model_science_answer_review_completed===true,
  operator_answer_accepted:row.operator_science_answer_accepted,answer_normalized:normalizedAnswers[row.answer],
  answer_review_verified:row.answer_review_verified,
  science_review_reason:row.science_reasoning,science_review_qualification:row.answer_qualification,
  mapping_status:row.mapping_quality,
  primary_canonical_kp_id:row.canonical_kp_id,kp_review_verified:row.kp_review_verified,
  operator_kp_accepted:row.mapping_quality==="KP_NEAREST_OPERATOR_ACCEPTED",
  nearest_relation_reason:row.nearest_kp_relation_reason??null,
  source_visual_review_verified:row.source_visual_review_verified,
  dependency_review_verified:row.dependency_review_verified,assets_complete:row.assets_complete,
  image_dependency:row.image_dependency
 };
 const v=certificationGate(c,authority);
 if(!v.allowed)throw Error("題目認證未通過："+row.id+"："+v.reasons.join(","));
 return {id:row.id,unit:row.unit,canonical_kp_id:row.canonical_kp_id,type:"tf",
  stem:row.stem,answer:row.answer,kp_mapping_quality:row.mapping_quality,
  answer_explanation:row.science_reasoning,answer_assumption:row.answer_qualification,
  source_id:row.source_id,source_page_pdf_1_based:row.source_page_pdf_1_based,source:"SCHOOL_HISTORICAL_APPROVED"};
}
export function validateAndConvertEmbeddedBank(payload,authority){
 if(payload?.schema_version!==EMBEDDED_BANK_SCHEMA||payload.public_site_integrated!==true
 ||payload.asset_revision!=="SCIENCE_S3_P10_OX_V4"||payload.answer_marker_contract!=="OX_ORIGINAL_EXAM_LAYOUT_V1"||payload.question_bank_status!=="SCIENCE_REASONED_OPERATOR_ACCEPTED_NOT_TEACHER_KEY"
 ||!Array.isArray(payload.blocks))throw Error("內建考古題庫版本不相容");
 const ids=new Set();
 const blocks=payload.blocks.map(row=>{
  if(ids.has(row.id))throw Error("重複題目 ID："+row.id);
  ids.add(row.id);return normalize(row,authority);
 });
 if(blocks.length!==72||payload.blocks.length!==72||payload.expected_count!==72)throw Error("核准題數與封存版本不一致");

 if(payload.p10_added_science_reviewed!==32||payload.p10_source_count!==4)throw Error("P10 四份下學期來源清冊不完整");
 const p10=payload.blocks.filter(x=>x.science_answer_source==="GPT6_S3_P10_REASONED_REVIEW");
 if(p10.length!==32||new Set(p10.map(x=>x.source_id)).size!==4||
 p10.some(x=>x.semester!==2||x.source_page_pdf_1_based!==1||x.teacher_key_authenticated!==false))
   throw Error("P10 下學期來源與答案憑據不完整");
 return {admission:"EMBEDDED_CERTIFIED_HISTORICAL",blocks};
}
export const CONTEXT_BANK_PATH="../data/question-bank/certified-context-groups-content-v3.json";
export const CONTEXT_BANK_SCHEMA="SCIENCE_EXAM_S3_P09_CONTEXT_GROUPS_CONTENT_ONLY_V3";
export function validateAndConvertContextGroups(value,authority){
 if(value?.schema_version!==CONTEXT_BANK_SCHEMA||value.expected_group_count!==20
 ||value.expected_answer_slots!==76||value.source_visual_crops_published!==false
 ||!Array.isArray(value.groups)||value.groups.length!==20)
   throw Error("公開題組契約不符合 20 組 P09");
 const ids=new Set(),items=new Set();
 const blocks=value.groups.map(group=>{
  if(!group?.id||ids.has(group.id)||group.certification_status!=="CERTIFIED_PUBLIC"
  ||group.source!=="CERTIFIED_CONTEXT_RECONSTRUCTED"
  ||group.source_review_status!=="GPT6_SCIENCE_CONTEXT_REVIEWED"
  ||group.dependencies_complete!==true||group.original_cropped_assets_included!==false
  ||group.copyright_path!=="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
  ||group.teacher_answer_key_authenticated!==false
  ||!/^[a-f0-9]{64}$/.test(group.source_pdf_sha256)
  ||!Number.isInteger(group.source_page_pdf_1_based)||group.source_page_pdf_1_based<1)
    throw Error("圖文情境來源、權利或來源資料不完整："+group?.id);
  ids.add(group.id);
  const unit=resolveUnit(authority,group.unit);
  if(!unit||unit.grade!==group.grade||unit.semester!==group.semester
   ||!unit.knowledge_points.some(k=>k.canonical_kp_id===group.canonical_kp_id))
    throw Error("圖文情境 KP 或單元不相符："+group.id);
  if(group.type!=="group"||typeof group.title!=="string"||!group.title.trim()
    ||!group.shared||!Array.isArray(group.shared.choiceBank)||!Array.isArray(group.items)||!group.items.length)
    throw Error("題組共用情境不完整："+group.id);
  if(group.shared.table!=null){
   const table=group.shared.table;
   if(!Array.isArray(table.headers)||!Array.isArray(table.rows)
   ||table.headers.length<2||table.rows.some(r=>r.length!==table.headers.length))throw Error("情境表格不完整："+group.id);
  }
  for(const [i,item] of group.items.entries()){
   const key=group.id+"#"+(i+1);
   if(items.has(key)||!["tf","short","mcq","multi","draw"].includes(item.type)
    ||typeof item.stem!=="string"||!item.stem.trim()
    ||typeof item.answer!=="string"||!item.answer.trim()
    ||!item.answer_explanation?.trim())throw Error("情境子題答案不完整："+key);
   if(item.type==="tf"&&!["O","X"].includes(item.answer))throw Error("題組是非題必須 O/X");
   if((item.type==="mcq"||item.type==="multi")&&(!Array.isArray(item.options)||item.options.length<2))throw Error("選項缺失："+key);
   items.add(key);
  }
  return {...group,items:group.items.map((item,i)=>({...item,group_item_id:group.id+"#"+String(i+1).padStart(2,"0")}))};
 });
 if(blocks.reduce((n,b)=>n+b.items.length,0)!==76)throw Error("題組 76 小題覆蓋數不符");
 const drawn=blocks.filter(b=>b.diagram_kind!=null);
 const allowed=new Set(["FLOWER","STEM","ROOT","LEAF","SYRINGE","CIRCUIT_COMPARE","DRAW_CIRCUIT"]);
 if(drawn.length!==7||drawn.some(b=>!allowed.has(b.diagram_kind)))throw Error("P09 向量圖品項未核准");
 if(blocks.some(b=>b.items.some(item=>item.type==="draw") && (b.diagram_kind!=="DRAW_CIRCUIT"||b.assessment_method!=="MANUAL_VISUAL_CORRECTNESS_CHECK"||("automatic_grading" in b))))
   throw Error("作圖題應以圖形正確性核對，不提供分數或自動計分");
 const original=blocks.filter(b=>b.diagram_kind==null&&b.id!=="MID_G03_FORCE_OPTION_IMAGES").length;
 if(original!==12)throw Error("圖文資料群組路由異常");
 return {admission:"EMBEDDED_CERTIFIED_CONTEXT",blocks};
}
export async function loadEmbeddedHistoricalBank(authority,url=EMBEDDED_BANK_PATH,contextUrl=CONTEXT_BANK_PATH,p12Url=P12_SIX_BANK_PATH,p12RemainingUrl=P12_REMAINING51_PATH,p12ApprovalUrl=P12_REMAINING51_APPROVAL_PATH,final46Url=P12_G03FINAL_46_PATH,final46ApprovalUrl=P12_G03FINAL_46_APPROVAL_PATH,b04Url=P12_B04_YONGAN_MID9_PATH,chongdeUrl=P12_B04_CHONGDE_MID6_PATH,b01Url=P12_B04_B01_47_PATH,b02Url=P12_B04_B02_41_PATH,b03Url=P12_B04_B03_41_PATH,b04batchUrl=P12_B04_B04_47_PATH,b05Url=P12_B04_B05_40_PATH,b06Url=P12_B04_B06_47_PATH,b07Url=P12_B04_B07_31_PATH,e01Url=P12_E01_PUREN_FINAL16_PATH,e01MidUrl=P12_E01_PUREN_MID13_PATH,e01HeshunMidUrl=P12_E01_HESHUN_MID15_PATH,e01HeshunFinalUrl=P12_E01_HESHUN_FINAL19_PATH,post52AnheUrl=P12_E01_POST52_ANHE3_PATH,post49Source2Url=P12_E01_POST49_SOURCE2_PATH,post47DongguangUrl=P12_E01_POST47_DONGGUANG1_PATH,post46AnheWindUrl=P12_E01_POST46_ANHE_WIND1_PATH,post45Puren2Url=P12_E01_POST45_PUREN2_PATH){
 const activeR5=authority?.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3";
 const [questions,contexts,p12,remaining,approval,finalBank,finalApproval,b04Bank,chongdeBank,b01Bank,b02Bank,b03Bank,b04BatchBank,b05Bank,b06Bank,b07Bank,e01Bank,e01MidBank,e01HeshunMidBank,e01HeshunFinalBank,post52AnheBank,post49Source2Bank,post47DongguangBank,post46AnheWindBank,post45Puren2Bank]=await Promise.all([fetch(url,{cache:"no-cache"}),fetch(contextUrl,{cache:"no-cache"}),fetch(p12Url,{cache:"no-cache"}),fetch(p12RemainingUrl,{cache:"no-cache"}),fetch(p12ApprovalUrl,{cache:"no-cache"}),fetch(final46Url,{cache:"no-cache"}),fetch(final46ApprovalUrl,{cache:"no-cache"}),fetch(b04Url,{cache:"no-cache"}),fetch(chongdeUrl,{cache:"no-cache"}),fetch(b01Url,{cache:"no-cache"}),fetch(b02Url,{cache:"no-cache"}),fetch(b03Url,{cache:"no-cache"}),fetch(b04batchUrl,{cache:"no-cache"}),fetch(b05Url,{cache:"no-cache"}),fetch(b06Url,{cache:"no-cache"}),fetch(b07Url,{cache:"no-cache"}),fetch(e01Url,{cache:"no-cache"}),fetch(e01MidUrl,{cache:"no-cache"}),fetch(e01HeshunMidUrl,{cache:"no-cache"}),fetch(e01HeshunFinalUrl,{cache:"no-cache"}),fetch(post52AnheUrl,{cache:"no-cache"}),fetch(post49Source2Url,{cache:"no-cache"}),fetch(post47DongguangUrl,{cache:"no-cache"}),...(activeR5?[fetch(post46AnheWindUrl,{cache:"no-cache"})]:[Promise.resolve(null)]),fetch(post45Puren2Url,{cache:"no-cache"})]);
 if(!questions.ok||!contexts.ok||!p12.ok||!remaining.ok||!approval.ok||!finalBank.ok||!finalApproval.ok||!b04Bank.ok||!chongdeBank.ok||!b01Bank.ok||!b02Bank.ok||!b03Bank.ok||!b04BatchBank.ok||!b05Bank.ok||!b06Bank.ok||!b07Bank.ok||!e01Bank.ok||!e01MidBank.ok||!e01HeshunMidBank.ok||!e01HeshunFinalBank.ok||!post52AnheBank.ok||!post49Source2Bank.ok||!post47DongguangBank.ok||(activeR5&&!post46AnheWindBank?.ok)||!post45Puren2Bank?.ok)throw Error("公開內建考古題或 P12 51 題入庫核准資料載入失敗");
 const singles=validateAndConvertEmbeddedBank(await questions.json(),authority);
 const groups=validateAndConvertContextGroups(await contexts.json(),authority);
 const supplement=validateAndConvertP12Six(await p12.json(),authority);
 const admitted=validateAndConvertP12Remaining51(await remaining.json(),await approval.json(),authority);
 const final46=validateAndConvertP12G03Final46(await finalBank.json(),await finalApproval.json(),authority);
 const b04=validateAndConvertP12B04YonganMid9(await b04Bank.json(),authority);
 const chongde=validateAndConvertP12B04ChongdeMid6(await chongdeBank.json(),authority);
 const b01=validateAndConvertP12B04B01_47(await b01Bank.json(),authority);
 const b02=validateAndConvertP12B04B02_41(await b02Bank.json(),authority);
 const b03=validateAndConvertP12B04B03_41(await b03Bank.json(),authority);
 const b04batch=validateAndConvertP12B04B04_47(await b04BatchBank.json(),authority);
 const b05=validateAndConvertP12B04B05_40(await b05Bank.json(),authority);
 const b06=validateAndConvertP12B04B06_47(await b06Bank.json(),authority);
 const b07=validateAndConvertP12B04B07_31(await b07Bank.json(),authority);
 const e01=validateAndConvertP12E01PurenFinal16(await e01Bank.json(),authority);
 const e01Mid=validateAndConvertP12E01PurenMid13(await e01MidBank.json(),authority);
 const e01HeshunMid=validateAndConvertP12E01HeshunMid15(await e01HeshunMidBank.json(),authority);
 const e01HeshunFinal=validateAndConvertP12E01HeshunFinal19(await e01HeshunFinalBank.json(),authority);
 const post52Anhe=validateAndConvertP12E01Post52Anhe3(await post52AnheBank.json(),authority);
 const post49Source2=validateAndConvertP12E01Post49Source2(await post49Source2Bank.json(),authority);
 const post47Dongguang=validateAndConvertP12E01Post47Dongguang1(await post47DongguangBank.json(),authority);
 const post46AnheWind=activeR5?validateAndConvertP12E01Post46AnheWind1(await post46AnheWindBank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const post45Puren2=validateAndConvertP12E01Post45Puren2(await post45Puren2Bank.json(),authority);
 const combined=[...singles.blocks,...groups.blocks,...supplement.blocks,...admitted.blocks,...final46.blocks,...b04.blocks,...chongde.blocks,...b01.blocks,...b02.blocks,...b03.blocks,...b04batch.blocks,...b05.blocks,...b06.blocks,...b07.blocks,...e01.blocks,...e01Mid.blocks,...e01HeshunMid.blocks,...e01HeshunFinal.blocks,...post52Anhe.blocks,...post49Source2.blocks,...post47Dongguang.blocks,...post46AnheWind.blocks,...post45Puren2.blocks];
 if(new Set(combined.map(b=>b.id)).size!==combined.length)throw Error("累積題庫出現重複 ID");
 const mapped=applyG04S1R5ApprovedKPLinks(combined,authority);
 return {admission:"EMBEDDED_CERTIFIED_HISTORICAL",blocks:mapped,
  certifiedTrueFalse:singles.blocks.length+supplement.blocks.filter(b=>b.type==="tf").length+admitted.standaloneTf+final46.standaloneTf+b04.standaloneTf+chongde.standaloneTf+b01.standaloneTf+b02.standaloneTf+b03.standaloneTf+b04batch.standaloneTf+b05.standaloneTf+b06.standaloneTf+b07.standaloneTf+e01.standaloneTf+e01Mid.standaloneTf+e01HeshunMid.standaloneTf+e01HeshunFinal.standaloneTf+post52Anhe.standaloneTf+post49Source2.standaloneTf+post47Dongguang.standaloneTf+post46AnheWind.standaloneTf+post45Puren2.standaloneTf,
  certifiedGroupCount:groups.blocks.length+supplement.contextGroups+admitted.contextGroups+final46.contextGroups+b04.contextGroups+chongde.contextGroups+b01.contextGroups+b02.contextGroups+b03.contextGroups+b04batch.contextGroups+b05.contextGroups+b06.contextGroups+b07.contextGroups+e01.contextGroups+e01Mid.contextGroups+e01HeshunMid.contextGroups+e01HeshunFinal.contextGroups+post52Anhe.contextGroups+post49Source2.contextGroups+post47Dongguang.contextGroups+post46AnheWind.contextGroups+post45Puren2.contextGroups,
  certifiedStandaloneChoice:supplement.blocks.filter(b=>b.type==="mcq").length+admitted.standaloneChoice+final46.standaloneChoice+b04.standaloneChoice+chongde.standaloneChoice+b01.standaloneChoice+b02.standaloneChoice+b03.standaloneChoice+b04batch.standaloneChoice+b05.standaloneChoice+b06.standaloneChoice+b07.standaloneChoice+e01.standaloneChoice+e01Mid.standaloneChoice+e01HeshunMid.standaloneChoice+e01HeshunFinal.standaloneChoice+post52Anhe.standaloneChoice+post49Source2.standaloneChoice+post47Dongguang.standaloneChoice+post46AnheWind.standaloneChoice+post45Puren2.standaloneChoice,
  certifiedAnswerSlots:singles.blocks.length+groups.blocks.reduce((n,b)=>n+b.items.length,0)+supplement.answerSlots+admitted.answerSlots+final46.answerSlots+b04.answerSlots+chongde.answerSlots+b01.answerSlots+b02.answerSlots+b03.answerSlots+b04batch.answerSlots+b05.answerSlots+b06.answerSlots+b07.answerSlots+e01.answerSlots+e01Mid.answerSlots+e01HeshunMid.answerSlots+e01HeshunFinal.answerSlots+post52Anhe.answerSlots+post49Source2.answerSlots+post47Dongguang.answerSlots+post46AnheWind.answerSlots+post45Puren2.answerSlots};
}
