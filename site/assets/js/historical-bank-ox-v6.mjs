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
import {validateAndConvertP12E01Post43ScienceKP2,P12_E01_POST43_SCIENCEKP2_PATH} from "./p12-e01-post43-sciencekp2-release.mjs";
import {validateAndConvertP12E01Post41ScanSecondary2,P12_E01_POST41_SCANSECONDARY2_PATH} from "./p12-e01-post41-scansecondary2-release.mjs";
import {resolveUnit} from "./authority-adapter.mjs";
import {applyG04S1R5ApprovedKPLinks} from "./science-g04s1-r5-approved-kp-links.mjs";
import {validateAndConvertP12113Selective27,P12_113_SELECTIVE27_PATH} from "./p12-g04s1-113-selective27-release.mjs";
import {validateAndConvertP12113Final16,P12_113_SELECTIVE_FINAL16_PATH} from "./p12-g04s1-113-selective-final16-release.mjs";
import {validateAndConvertP12113Mid11,P12_113_MID11_PATH} from "./p12-g04s1-113-mid11-selective-release.mjs";
import {validateAndConvertP12113FinalMC9,P12_113_FINAL_MC9_PATH} from "./p12-g04s1-113-final-mc9-release.mjs";
import {validateAndConvertP12113TaizijiaoFinal17,P12_113_TAOZIJIAO_FINAL17_PATH} from "./p12-g04s1-113-taozijiao-final17-release.mjs";
import {validateAndConvertP12113TaizijiaoRemaining8,P12_113_TAOZIJIAO_FINAL_REMAINING8_PATH} from "./p12-g04s1-113-taozijiao-final-remaining8-release.mjs";
import {validateAndConvertP12113NextNative6,P12_113_NEXT_NATIVE6_PATH} from "./p12-g04s1-113-next-native-tfmc6-release.mjs";
import {validateAndConvertP12113Native6After94,P12_113_NATIVE6_AFTER94_PATH} from "./p12-g04s1-113-native6-after94-release.mjs";
import {validateAndConvertP12113HanlinNative5,P12_113_HANLIN_NATIVE5_PATH} from "./p12-g04s1-113-hanlin-native5-after100-release.mjs";
import {validateAndConvertP12113Native5After105,P12_113_NATIVE5_AFTER105_PATH} from "./p12-g04s1-113-dongguang-dahua-native5-after105-release.mjs";
import {validateAndConvertP12113DongguangTF003,P12_113_DONGGUANG_TF003_PATH} from "./p12-g04s1-113-dongguang-mid-tf003-after110-release.mjs";
import {validateAndConvertP12113WendeNative2,P12_113_WENDE_NATIVE2_PATH} from "./p12-g04s1-113-wende-mid-native2-after111-release.mjs";
import {validateAndConvertP12113WendeMC010After113,P12_113_WENDE_MC010_AFTER113_PATH} from "./p12-g04s1-113-wende-mid-mc010-after113-release.mjs";
import {validateAndConvertP12113Native38,P12_113_NATIVE38_PATH} from "./p12-g04s1-113-native38-release.mjs";
import {validateAndConvertP12113HN22,P12_113_HN22_PATH} from "./p12-g04s1-113-hn22-release.mjs";
import {validateAndConvertP12113Exact4,P12_113_EXACT4_PATH} from "./p12-g04s1-113-exact4-release.mjs";
import {validateAndConvertP12113B01Wende7,P12_113_B01_WENDE7_PATH} from "./p12-g04s1-113-b01-wende7-standalone-release.mjs";
import {validateAndConvertP12113B02Native21,P12_113_B02_NATIVE21_PATH} from "./p12-g04s1-113-b02-native21-standalone-release.mjs";
import {validateAndConvertP12113B03Native27,P12_113_B03_NATIVE27_PATH} from "./p12-g04s1-113-b03-native27-standalone-release.mjs";
import {validateAndConvertP12113B04Native36,P12_113_B04_NATIVE36_PATH} from "./p12-g04s1-113-b04-native36-standalone-release.mjs";
import {validateAndConvertP12113B05Native24,P12_113_B05_NATIVE24_PATH} from "./p12-g04s1-113-b05-native24-standalone-release.mjs";
import {validateAndConvertP12113B06Native16,P12_113_B06_NATIVE16_PATH} from "./p12-g04s1-113-b06-native16-standalone-release.mjs";
import {validateAndConvertP12113B07LushangExact3,P12_113_B07_LUSHANG_EXACT3_PATH} from "./p12-g04s1-113-b07-lushang-exact3-standalone-release.mjs";
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
export async function loadEmbeddedHistoricalBank(authority,url=EMBEDDED_BANK_PATH,contextUrl=CONTEXT_BANK_PATH,p12Url=P12_SIX_BANK_PATH,p12RemainingUrl=P12_REMAINING51_PATH,p12ApprovalUrl=P12_REMAINING51_APPROVAL_PATH,final46Url=P12_G03FINAL_46_PATH,final46ApprovalUrl=P12_G03FINAL_46_APPROVAL_PATH,b04Url=P12_B04_YONGAN_MID9_PATH,chongdeUrl=P12_B04_CHONGDE_MID6_PATH,b01Url=P12_B04_B01_47_PATH,b02Url=P12_B04_B02_41_PATH,b03Url=P12_B04_B03_41_PATH,b04batchUrl=P12_B04_B04_47_PATH,b05Url=P12_B04_B05_40_PATH,b06Url=P12_B04_B06_47_PATH,b07Url=P12_B04_B07_31_PATH,e01Url=P12_E01_PUREN_FINAL16_PATH,e01MidUrl=P12_E01_PUREN_MID13_PATH,e01HeshunMidUrl=P12_E01_HESHUN_MID15_PATH,e01HeshunFinalUrl=P12_E01_HESHUN_FINAL19_PATH,post52AnheUrl=P12_E01_POST52_ANHE3_PATH,post49Source2Url=P12_E01_POST49_SOURCE2_PATH,post47DongguangUrl=P12_E01_POST47_DONGGUANG1_PATH,post46AnheWindUrl=P12_E01_POST46_ANHE_WIND1_PATH,post45Puren2Url=P12_E01_POST45_PUREN2_PATH,post43ScienceKP2Url=P12_E01_POST43_SCIENCEKP2_PATH,post41ScanSecondary2Url=P12_E01_POST41_SCANSECONDARY2_PATH,selective113Url=P12_113_SELECTIVE27_PATH,selectiveFinal16Url=P12_113_SELECTIVE_FINAL16_PATH,mid11Url=P12_113_MID11_PATH,finalMC9Url=P12_113_FINAL_MC9_PATH,taizijiaoFinal17Url=P12_113_TAOZIJIAO_FINAL17_PATH,remaining8Url=P12_113_TAOZIJIAO_FINAL_REMAINING8_PATH,nextNative6Url=P12_113_NEXT_NATIVE6_PATH,native6After94Url=P12_113_NATIVE6_AFTER94_PATH,hanlinNative5Url=P12_113_HANLIN_NATIVE5_PATH,native5After105Url=P12_113_NATIVE5_AFTER105_PATH,dongguangTF003Url=P12_113_DONGGUANG_TF003_PATH,wendeNative2Url=P12_113_WENDE_NATIVE2_PATH,wendeMC010Url=P12_113_WENDE_MC010_AFTER113_PATH,native38Url=P12_113_NATIVE38_PATH,hn22Url=P12_113_HN22_PATH,exact4Url=P12_113_EXACT4_PATH,b01Wende7Url=P12_113_B01_WENDE7_PATH,b02Native21Url=P12_113_B02_NATIVE21_PATH,b03Native27Url=P12_113_B03_NATIVE27_PATH,b04Native36Url=P12_113_B04_NATIVE36_PATH,b05Native24Url=P12_113_B05_NATIVE24_PATH,b06Native16Url=P12_113_B06_NATIVE16_PATH,b07LushangExact3Url=P12_113_B07_LUSHANG_EXACT3_PATH){
 const activeR5=authority?.schema_version==="SCIENCE_G03_G04_PUBLIC_SELECTOR_V3";
 const [questions,contexts,p12,remaining,approval,finalBank,finalApproval,b04Bank,chongdeBank,b01Bank,b02Bank,b03Bank,b04BatchBank,b05Bank,b06Bank,b07Bank,e01Bank,e01MidBank,e01HeshunMidBank,e01HeshunFinalBank,post52AnheBank,post49Source2Bank,post47DongguangBank,post46AnheWindBank,post45Puren2Bank,post43ScienceKP2Bank,post41ScanSecondary2Bank,selective113Bank,selectiveFinal16Bank,mid11Bank,finalMC9Bank,taizijiaoFinal17Bank,remaining8Bank,nextNative6Bank,native6After94Bank,hanlinNative5Bank,native5After105Bank,dongguangTF003Bank,wendeNative2Bank,wendeMC010Bank,native38Bank,hn22Bank,exact4Bank,b01Wende7Bank,b02Native21Bank,b03Native27Bank,b04Native36Bank,b05Native24Bank,b06Native16Bank,b07LushangExact3Bank]=await Promise.all([fetch(url,{cache:"no-cache"}),fetch(contextUrl,{cache:"no-cache"}),fetch(p12Url,{cache:"no-cache"}),fetch(p12RemainingUrl,{cache:"no-cache"}),fetch(p12ApprovalUrl,{cache:"no-cache"}),fetch(final46Url,{cache:"no-cache"}),fetch(final46ApprovalUrl,{cache:"no-cache"}),fetch(b04Url,{cache:"no-cache"}),fetch(chongdeUrl,{cache:"no-cache"}),fetch(b01Url,{cache:"no-cache"}),fetch(b02Url,{cache:"no-cache"}),fetch(b03Url,{cache:"no-cache"}),fetch(b04batchUrl,{cache:"no-cache"}),fetch(b05Url,{cache:"no-cache"}),fetch(b06Url,{cache:"no-cache"}),fetch(b07Url,{cache:"no-cache"}),fetch(e01Url,{cache:"no-cache"}),fetch(e01MidUrl,{cache:"no-cache"}),fetch(e01HeshunMidUrl,{cache:"no-cache"}),fetch(e01HeshunFinalUrl,{cache:"no-cache"}),fetch(post52AnheUrl,{cache:"no-cache"}),fetch(post49Source2Url,{cache:"no-cache"}),fetch(post47DongguangUrl,{cache:"no-cache"}),...(activeR5?[fetch(post46AnheWindUrl,{cache:"no-cache"})]:[Promise.resolve(null)]),fetch(post45Puren2Url,{cache:"no-cache"}),fetch(post43ScienceKP2Url,{cache:"no-cache"}),fetch(post41ScanSecondary2Url,{cache:"no-cache"}),...(activeR5?[fetch(selective113Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(selectiveFinal16Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(mid11Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(finalMC9Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(taizijiaoFinal17Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(remaining8Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(nextNative6Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(native6After94Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(hanlinNative5Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(native5After105Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(dongguangTF003Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(wendeNative2Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(wendeMC010Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(native38Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(hn22Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(exact4Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b01Wende7Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b02Native21Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b03Native27Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b04Native36Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b05Native24Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b06Native16Url,{cache:"no-cache"})]:[Promise.resolve(null)]),...(activeR5?[fetch(b07LushangExact3Url,{cache:"no-cache"})]:[Promise.resolve(null)])]);
 if(!questions.ok||!contexts.ok||!p12.ok||!remaining.ok||!approval.ok||!finalBank.ok||!finalApproval.ok||!b04Bank.ok||!chongdeBank.ok||!b01Bank.ok||!b02Bank.ok||!b03Bank.ok||!b04BatchBank.ok||!b05Bank.ok||!b06Bank.ok||!b07Bank.ok||!e01Bank.ok||!e01MidBank.ok||!e01HeshunMidBank.ok||!e01HeshunFinalBank.ok||!post52AnheBank.ok||!post49Source2Bank.ok||!post47DongguangBank.ok||(activeR5&&!post46AnheWindBank?.ok)||!post45Puren2Bank?.ok||!post43ScienceKP2Bank?.ok||!post41ScanSecondary2Bank?.ok||(activeR5&&!selective113Bank?.ok)||(activeR5&&!selectiveFinal16Bank?.ok)||(activeR5&&!mid11Bank?.ok)||(activeR5&&!finalMC9Bank?.ok)||(activeR5&&!taizijiaoFinal17Bank?.ok)||(activeR5&&!remaining8Bank?.ok)||(activeR5&&!nextNative6Bank?.ok)||(activeR5&&!native6After94Bank?.ok)||(activeR5&&!hanlinNative5Bank?.ok)||(activeR5&&!native5After105Bank?.ok)||(activeR5&&!dongguangTF003Bank?.ok)||(activeR5&&!wendeNative2Bank?.ok)||(activeR5&&!wendeMC010Bank?.ok)||(activeR5&&!native38Bank?.ok)||(activeR5&&!hn22Bank?.ok)||(activeR5&&!exact4Bank?.ok)||(activeR5&&!b01Wende7Bank?.ok)||(activeR5&&!b02Native21Bank?.ok)||(activeR5&&!b03Native27Bank?.ok)||(activeR5&&!b04Native36Bank?.ok)||(activeR5&&!b05Native24Bank?.ok)||(activeR5&&!b06Native16Bank?.ok)||(activeR5&&!b07LushangExact3Bank?.ok))throw Error("公開內建考古題或 P12 51 題入庫核准資料載入失敗");
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
 const post43ScienceKP2=validateAndConvertP12E01Post43ScienceKP2(await post43ScienceKP2Bank.json(),authority);
 const post41ScanSecondary2=validateAndConvertP12E01Post41ScanSecondary2(await post41ScanSecondary2Bank.json(),authority);
 const selective113=activeR5?validateAndConvertP12113Selective27(await selective113Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const selectiveFinal16=activeR5?validateAndConvertP12113Final16(await selectiveFinal16Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const mid11=activeR5?validateAndConvertP12113Mid11(await mid11Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const finalMC9=activeR5?validateAndConvertP12113FinalMC9(await finalMC9Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const taizijiaoFinal17=activeR5?validateAndConvertP12113TaizijiaoFinal17(await taizijiaoFinal17Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const remaining8=activeR5?validateAndConvertP12113TaizijiaoRemaining8(await remaining8Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const nextNative6=activeR5?validateAndConvertP12113NextNative6(await nextNative6Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const native6After94=activeR5?validateAndConvertP12113Native6After94(await native6After94Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const hanlinNative5=activeR5?validateAndConvertP12113HanlinNative5(await hanlinNative5Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const native5After105=activeR5?validateAndConvertP12113Native5After105(await native5After105Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const dongguangTF003=activeR5?validateAndConvertP12113DongguangTF003(await dongguangTF003Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const wendeNative2=activeR5?validateAndConvertP12113WendeNative2(await wendeNative2Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const wendeMC010=activeR5?validateAndConvertP12113WendeMC010After113(await wendeMC010Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const native38=activeR5?validateAndConvertP12113Native38(await native38Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const hn22=activeR5?validateAndConvertP12113HN22(await hn22Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const exact4=activeR5?validateAndConvertP12113Exact4(await exact4Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b01Wende7=activeR5?validateAndConvertP12113B01Wende7(await b01Wende7Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b02Native21=activeR5?validateAndConvertP12113B02Native21(await b02Native21Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b03Native27=activeR5?validateAndConvertP12113B03Native27(await b03Native27Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b04Native36=activeR5?validateAndConvertP12113B04Native36(await b04Native36Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b05Native24=activeR5?validateAndConvertP12113B05Native24(await b05Native24Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b06Native16=activeR5?validateAndConvertP12113B06Native16(await b06Native16Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const b07LushangExact3=activeR5?validateAndConvertP12113B07LushangExact3(await b07LushangExact3Bank.json(),authority):{blocks:[],answerSlots:0,standaloneTf:0,standaloneChoice:0,contextGroups:0};
 const combined=[...singles.blocks,...groups.blocks,...supplement.blocks,...admitted.blocks,...final46.blocks,...b04.blocks,...chongde.blocks,...b01.blocks,...b02.blocks,...b03.blocks,...b04batch.blocks,...b05.blocks,...b06.blocks,...b07.blocks,...e01.blocks,...e01Mid.blocks,...e01HeshunMid.blocks,...e01HeshunFinal.blocks,...post52Anhe.blocks,...post49Source2.blocks,...post47Dongguang.blocks,...post46AnheWind.blocks,...post45Puren2.blocks,...post43ScienceKP2.blocks,...post41ScanSecondary2.blocks,...selective113.blocks,...selectiveFinal16.blocks,...mid11.blocks,...finalMC9.blocks,...taizijiaoFinal17.blocks,...remaining8.blocks,...nextNative6.blocks,...native6After94.blocks,...hanlinNative5.blocks,...native5After105.blocks,...dongguangTF003.blocks,...wendeNative2.blocks,...wendeMC010.blocks,...native38.blocks,...hn22.blocks,...exact4.blocks,...b01Wende7.blocks,...b02Native21.blocks,...b03Native27.blocks,...b04Native36.blocks,...b05Native24.blocks,...b06Native16.blocks,...b07LushangExact3.blocks];
 if(new Set(combined.map(b=>b.id)).size!==combined.length)throw Error("累積題庫出現重複 ID");
 const mapped=applyG04S1R5ApprovedKPLinks(combined,authority);
 return {admission:"EMBEDDED_CERTIFIED_HISTORICAL",blocks:mapped,
  certifiedTrueFalse:singles.blocks.length+supplement.blocks.filter(b=>b.type==="tf").length+admitted.standaloneTf+final46.standaloneTf+b04.standaloneTf+chongde.standaloneTf+b01.standaloneTf+b02.standaloneTf+b03.standaloneTf+b04batch.standaloneTf+b05.standaloneTf+b06.standaloneTf+b07.standaloneTf+e01.standaloneTf+e01Mid.standaloneTf+e01HeshunMid.standaloneTf+e01HeshunFinal.standaloneTf+post52Anhe.standaloneTf+post49Source2.standaloneTf+post47Dongguang.standaloneTf+post46AnheWind.standaloneTf+post45Puren2.standaloneTf+post43ScienceKP2.standaloneTf+post41ScanSecondary2.standaloneTf+selective113.standaloneTf+selectiveFinal16.standaloneTf+mid11.standaloneTf+finalMC9.standaloneTf+taizijiaoFinal17.standaloneTf+remaining8.standaloneTf+nextNative6.standaloneTf+native6After94.standaloneTf+hanlinNative5.standaloneTf+native5After105.standaloneTf+dongguangTF003.standaloneTf+wendeNative2.standaloneTf+wendeMC010.standaloneTf+native38.standaloneTf+hn22.standaloneTf+exact4.standaloneTf+b01Wende7.standaloneTf+b02Native21.standaloneTf+b03Native27.standaloneTf+b04Native36.standaloneTf+b05Native24.standaloneTf+b06Native16.standaloneTf+b07LushangExact3.standaloneTf,
  certifiedGroupCount:groups.blocks.length+supplement.contextGroups+admitted.contextGroups+final46.contextGroups+b04.contextGroups+chongde.contextGroups+b01.contextGroups+b02.contextGroups+b03.contextGroups+b04batch.contextGroups+b05.contextGroups+b06.contextGroups+b07.contextGroups+e01.contextGroups+e01Mid.contextGroups+e01HeshunMid.contextGroups+e01HeshunFinal.contextGroups+post52Anhe.contextGroups+post49Source2.contextGroups+post47Dongguang.contextGroups+post46AnheWind.contextGroups+post45Puren2.contextGroups+post43ScienceKP2.contextGroups+post41ScanSecondary2.contextGroups+selective113.contextGroups+selectiveFinal16.contextGroups+mid11.contextGroups+finalMC9.contextGroups+taizijiaoFinal17.contextGroups+remaining8.contextGroups+nextNative6.contextGroups+native6After94.contextGroups+hanlinNative5.contextGroups+native5After105.contextGroups+dongguangTF003.contextGroups+wendeNative2.contextGroups+wendeMC010.contextGroups+native38.contextGroups+hn22.contextGroups+exact4.contextGroups+b01Wende7.contextGroups+b02Native21.contextGroups+b03Native27.contextGroups+b04Native36.contextGroups+b05Native24.contextGroups+b06Native16.contextGroups+b07LushangExact3.contextGroups,
  certifiedStandaloneChoice:supplement.blocks.filter(b=>b.type==="mcq").length+admitted.standaloneChoice+final46.standaloneChoice+b04.standaloneChoice+chongde.standaloneChoice+b01.standaloneChoice+b02.standaloneChoice+b03.standaloneChoice+b04batch.standaloneChoice+b05.standaloneChoice+b06.standaloneChoice+b07.standaloneChoice+e01.standaloneChoice+e01Mid.standaloneChoice+e01HeshunMid.standaloneChoice+e01HeshunFinal.standaloneChoice+post52Anhe.standaloneChoice+post49Source2.standaloneChoice+post47Dongguang.standaloneChoice+post46AnheWind.standaloneChoice+post45Puren2.standaloneChoice+post43ScienceKP2.standaloneChoice+post41ScanSecondary2.standaloneChoice+selective113.standaloneChoice+selectiveFinal16.standaloneChoice+mid11.standaloneChoice+finalMC9.standaloneChoice+taizijiaoFinal17.standaloneChoice+remaining8.standaloneChoice+nextNative6.standaloneChoice+native6After94.standaloneChoice+hanlinNative5.standaloneChoice+native5After105.standaloneChoice+dongguangTF003.standaloneChoice+wendeNative2.standaloneChoice+wendeMC010.standaloneChoice+native38.standaloneChoice+hn22.standaloneChoice+exact4.standaloneChoice+b01Wende7.standaloneChoice+b02Native21.standaloneChoice+b03Native27.standaloneChoice+b04Native36.standaloneChoice+b05Native24.standaloneChoice+b06Native16.standaloneChoice+b07LushangExact3.standaloneChoice,
  certifiedAnswerSlots:singles.blocks.length+groups.blocks.reduce((n,b)=>n+b.items.length,0)+supplement.answerSlots+admitted.answerSlots+final46.answerSlots+b04.answerSlots+chongde.answerSlots+b01.answerSlots+b02.answerSlots+b03.answerSlots+b04batch.answerSlots+b05.answerSlots+b06.answerSlots+b07.answerSlots+e01.answerSlots+e01Mid.answerSlots+e01HeshunMid.answerSlots+e01HeshunFinal.answerSlots+post52Anhe.answerSlots+post49Source2.answerSlots+post47Dongguang.answerSlots+post46AnheWind.answerSlots+post45Puren2.answerSlots+post43ScienceKP2.answerSlots+post41ScanSecondary2.answerSlots+selective113.answerSlots+selectiveFinal16.answerSlots+mid11.answerSlots+finalMC9.answerSlots+taizijiaoFinal17.answerSlots+remaining8.answerSlots+nextNative6.answerSlots+native6After94.answerSlots+hanlinNative5.answerSlots+native5After105.answerSlots+dongguangTF003.answerSlots+wendeNative2.answerSlots+wendeMC010.answerSlots+native38.answerSlots+hn22.answerSlots+exact4.answerSlots+b01Wende7.answerSlots+b02Native21.answerSlots+b03Native27.answerSlots+b04Native36.answerSlots+b05Native24.answerSlots+b06Native16.answerSlots+b07LushangExact3.answerSlots};
}
