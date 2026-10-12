import {resolveUnit} from "./authority-adapter.mjs";
export const P12_SIX_SCHEMA="SCIENCE_EXAM_P12_G03S2MID_SIX_OPERATOR_PUBLIC_V1";
export const P12_SIX_BANK_PATH="../data/question-bank/p12-g03s2mid-approved-six-v1.json";
const pdfSHA="372db8a4016eec03e6910b4ea617c32c7e27f14d01c12a37447b2d8f5830eb71";
const required=new Set([
  "G03-S2-MID|TF|P01|013","G03-S2-MID|TF|P01|019",
  "G03-S2-MID|MC|P01|012","G03-S2-MID|COMPOSITE|P02|012",
  "G03-S2-MID|READ|P01|003","G03-S2-MID|READ|P01|004"
]);
const fail=(ok,reason)=>{if(!ok)throw Error("P12 六題未通過入庫驗證："+reason);};
const usable=x=>typeof x==="string"&&x.trim().length>0;
export function validateAndConvertP12Six(payload,authority){
  fail(payload?.schema_version===P12_SIX_SCHEMA&&payload.public_site_integrated===true,
    "資料版本或公開核准狀態不正確");
  fail(payload.source_pdf_sha256===pdfSHA&&payload.source_id==="G03-S2-MID",
    "原卷來源 SHA 不相符");
  fail(payload.expected_blocks===5&&payload.expected_answer_slots===6&&
    payload.expected_context_groups===2&&payload.teacher_answer_key_authenticated===false&&
    payload.original_pdf_embedded===false&&Array.isArray(payload.blocks)&&payload.blocks.length===5,
    "題數、題組或原卷保護契約不符");
  const ids=new Set(),slots=new Set();
  let contextGroups=0,answerSlots=0;
  for(const row of payload.blocks){
    fail(usable(row.id)&&!ids.has(row.id),"題目 ID 缺漏或重複");
    ids.add(row.id);
    fail(row.source_id==="G03-S2-MID"&&row.source_pdf_sha256===pdfSHA
      &&row.grade===3&&row.semester===2&&row.original_teacher_answer_key_authenticated===false
      &&row.operator_approval_ref===payload.operator_review_ref,
      "題目來源和核准憑據不相符："+row.id);
    fail(Number.isInteger(row.source_page_pdf_1_based)&&row.source_page_pdf_1_based>=1
      &&row.source_page_pdf_1_based<=2,"題目頁碼不正確："+row.id);
    const u=resolveUnit(authority,row.unit);
    fail(!!u&&u.grade===3&&u.semester===2&&["U01","U02"].includes(u.unit_id)
      &&u.knowledge_points.some(k=>k.canonical_kp_id===row.canonical_kp_id),
      "來源單元或 canonical KP 錯誤："+row.id);
    for(const id of row.secondary_canonical_kp_ids??[]){
      fail(u.knowledge_points.some(k=>k.canonical_kp_id===id),"題組次要 KP 不存在："+id);
    }
    fail(row.copyright_path==="REGULATED_EXAM_QUESTION_ART9_WITH_RECONSTRUCTED_SHARED_CONTEXT"
      ||row.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES",
      "題材再使用權利路徑未聲明："+row.id);
    if(row.type==="group"){
      ++contextGroups;
      fail(row.source==="CERTIFIED_CONTEXT_RECONSTRUCTED"
        &&row.certification_status==="CERTIFIED_PUBLIC"
        &&row.dependencies_complete===true&&row.original_cropped_assets_included===false
        &&row.teacher_answer_key_authenticated===false
        &&usable(row.shared?.instructions)&&typeof row.shared?.passage==="string"
        &&Array.isArray(row.shared?.choiceBank)&&Array.isArray(row.items)&&row.items.length>=1,
        "情境題組來源、共用內容或附件依賴不完整："+row.id);
      fail(row.id!=="P12_G03S2MID_READ_003_004"||(
        row.items.length===2&&usable(row.shared.passage)
        &&row.rights_review==="RECONSTRUCTED_SHARED_PASSAGE_NOT_VERBATIM_SOURCE_ARTICLE"),
        "水耕閱讀題不得缺少改編共同短文");
      fail(row.id!=="P12_G03S2MID_COMPOSITE_010"||(
        row.items.length===1&&row.operator_exception===true&&row.scientific_qualification_required===true
        &&row.shared.choiceBank.length===4&&row.items[0].answer==="④"
        &&usable(row.items[0].answer_assumption)),
        "高山下雪須保留原答案④與科學資格註記");
      for(const item of row.items){
        fail(usable(item.stem)&&usable(item.answer)&&usable(item.answer_explanation)
          &&["tf","short"].includes(item.type)
          &&(!item.canonical_kp_id||u.knowledge_points.some(k=>k.canonical_kp_id===item.canonical_kp_id)),
          "子題文字、答案或 KP 缺失："+row.id);
        if(item.type==="tf")fail(["O","X"].includes(item.answer),"題組是非答案非 O/X");
        fail(required.has(item.source_slot_id)&&!slots.has(item.source_slot_id),"來源位置重複或超出範圍："+item.source_slot_id);
        slots.add(item.source_slot_id);
      }
      answerSlots+=row.items.length;
    }else{
      fail(row.source==="P12_OPERATOR_APPROVED_QUESTION"
        &&row.certification_status==="OPERATOR_APPROVED_PUBLIC"
        &&["tf","mcq"].includes(row.type)&&usable(row.stem)
        &&usable(row.answer)&&usable(row.answer_explanation),
        "單題類型、科學判答或核准狀態不完整："+row.id);
      if(row.type==="tf")fail(["O","X"].includes(row.answer),"單題 O/X 答案不正確");
      if(row.type==="mcq")fail(Array.isArray(row.options)&&row.options.length===4
        &&row.options[2].startsWith("③")&&row.answer==="③"
        &&row.revision_scope==="SOURCE_OPTION_3_ONLY","選擇題③改寫未保留");
      fail(required.has(row.source_slot_id)&&!slots.has(row.source_slot_id),
        "單題來源位置重複或超出核准範圍："+row.source_slot_id);
      slots.add(row.source_slot_id);
      ++answerSlots;
    }
  }
  fail(answerSlots===6&&contextGroups===2&&slots.size===required.size
    &&[...slots].every(x=>required.has(x)),"六題原卷定位／數量未通過");
  return {admission:"P12_SIX_OPERATOR_CERTIFIED",blocks:payload.blocks,answerSlots,contextGroups};
}
