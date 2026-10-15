import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_HESHUN_MID15_PATH="../data/question-bank/p12-e01-heshun-mid15-public-v1.json";
export const P12_E01_HESHUN_MID15_SCHEMA="SCIENCE_P12_E01_HESHUN_MID15_PUBLIC_V1";
const SOURCE="SCI_G04_S1_114_MID_002";
const PDF_SHA="3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f";
const EVIDENCE="data/review/p12-e01-heshun-mid17-pixel-bbox-15accept-2hold-v1.json";
const EXPECTED=new Map([["SCI_G04_S1_114_MID_002|S1|MC|005",["P12_E01_HESHUN_MID_MC_001","③","sci_g04s1_02_04","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,340,60,358.75],"下列哪一組水生植物的根部沒有長在土裡，且整株漂在水面上？",["①蓮花和荷花","②大萍和睡蓮","③布袋蓮和大萍","④水蘊草和布袋蓮"],"布袋蓮和大萍通常是整株漂浮的水生植物，根不固定在底泥。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S1|MC|006",["P12_E01_HESHUN_MID_MC_002","④","sci_g04s1_03_06","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,396.25,60,416.875],"太陽移動和影子的方位改變有什麼關係？",["①沒有關係","②太陽移動方向和影子方位改變一樣","③太陽會移動但影子的方位改變不會改變","④太陽移動方向和影子方位改變相反"],"當太陽照射方向改變時，影子方向一般在物體另一側。","4-S1-U03"]],["SCI_G04_S1_114_MID_002|S1|MC|009",["P12_E01_HESHUN_MID_MC_003","①","sci_g04s1_02_02","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,551.25,60,570],"珊瑚會生長在哪一種水域環境中？",["①海洋","②埤塘","③溪流","④河海口交界"],"造礁珊瑚主要生活於適宜的海水環境。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S1|MC|010",["P12_E01_HESHUN_MID_MC_004","④","sci_g04s1_02_02","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,586.875,60,605.625],"下列哪些資料是進行水域環境調查時要紀錄的？",["①水生生物","②水域類型","③天氣","④以上都要"],"水生物、環境類型和天氣都有助調查水域狀況。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S1|MC|011",["P12_E01_HESHUN_MID_MC_005","③","sci_g04s1_02_03","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,635.625,60,658.125],"下列哪一種植物沒有通氣組織？",["①荷花","②布袋蓮","③椰子樹","④睡蓮"],"荷花、布袋蓮與睡蓮有水生通氣構造；椰子樹非典型水生植物。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S1|MC|012",["P12_E01_HESHUN_MID_MC_006","③","sci_g04s1_02_09","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,676.875,60,698.125],"下列那個水生動物不用鰓呼吸？",["①鯉魚","②蓋斑鬥魚","③海豚","④蝌蚪"],"海豚使用肺而非鰓呼吸。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S2|TF|004",["P12_E01_HESHUN_MID_TF_001","O","sci_g04s1_03_06","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[21.875,809.375,60,827.5],"我們觀測太陽的位置變化時發現大樹上午的影子在西方。",[],"一般上午太陽在東側，大樹影子位於相反西側。","4-S1-U03"]],["SCI_G04_S1_114_MID_002|S2|TF|009",["P12_E01_HESHUN_MID_TF_002","X","sci_g04s1_02_11","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",1,[322.5,92.5,360,112.5],"輪船在海上漏油後，只要清除掉海面上的油汙就不會影響水生生物的生存。",[],"漏油可傷害海洋生物，清除可見海面油污也無法保證沒有後續影響。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G05|019",["P12_E01_HESHUN_MID_TF_003","O","sci_g04s1_02_11","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[46.875,520,85,540.625],"可以做哪些事情，愛護水域環境裡的各種生物呢？請在（ ）裡打ˇ，錯誤的打╳：\n不隨意丟垃圾。",[],"不往水域亂丟垃圾有利維護環境。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G05|020",["P12_E01_HESHUN_MID_TF_004","X","sci_g04s1_02_11","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[46.875,539.375,85,560],"可以做哪些事情，愛護水域環境裡的各種生物呢？請在（ ）裡打ˇ，錯誤的打╳：\n工廠汙水直接排到河流。",[],"未處理工廠廢水直接入河可能污染水質及危害生物。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G05|022",["P12_E01_HESHUN_MID_TF_005","O","sci_g04s1_02_11","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[46.875,577.5,85,598.75],"可以做哪些事情，愛護水域環境裡的各種生物呢？請在（ ）裡打ˇ，錯誤的打╳：\n參加淨灘活動。",[],"參與淨灘可協助移除垃圾保護海岸生態。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G07|029",["P12_E01_HESHUN_MID_TF_006","O","sci_g04s1_02_04","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[40.625,860.625,82.5,881.25],"在水中擠壓布袋蓮的葉柄，可以看到氣泡跑出來，這個發現能說明布袋蓮有哪些特性？請在（ ）裡打ˇ，錯誤的打╳：\n布袋蓮的葉柄含有空氣。",[],"布袋蓮膨大葉柄內部含有氣體。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G07|030",["P12_E01_HESHUN_MID_TF_007","O","sci_g04s1_02_04","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[40.625,879.375,82.5,901.875],"在水中擠壓布袋蓮的葉柄，可以看到氣泡跑出來，這個發現能說明布袋蓮有哪些特性？請在（ ）裡打ˇ，錯誤的打╳：\n布袋蓮的葉柄可以幫助它在水面上漂浮。",[],"含氣葉柄提供浮力，幫助布袋蓮漂浮。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G07|031",["P12_E01_HESHUN_MID_TF_008","X","sci_g04s1_02_04","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[40.625,900,82.5,923.125],"在水中擠壓布袋蓮的葉柄，可以看到氣泡跑出來，這個發現能說明布袋蓮有哪些特性？請在（ ）裡打ˇ，錯誤的打╳：\n布袋蓮的葉柄可以幫助它在水面上噴氣移動。",[],"布袋蓮不是依靠葉柄噴氣作動力在水面移動。","4-S1-U02"]],["SCI_G04_S1_114_MID_002|S3|G07|032",["P12_E01_HESHUN_MID_TF_009","X","sci_g04s1_02_04","3afb0337ad33c064819d299311d1b225c7ab5cc46f6127fc56bd81087f2c4c6f",2,[40.625,933.75,82.5,955],"在水中擠壓布袋蓮的葉柄，可以看到氣泡跑出來，這個發現能說明布袋蓮有哪些特性？請在（ ）裡打ˇ，錯誤的打╳：\n布袋蓮的葉柄遇到水容易爛掉。",[],"水生葉柄並非遇水便容易腐爛的構造。","4-S1-U02"]]]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(pass,reason)=>{if(!pass)throw Error("P12_E01_HESHUN_MID15_FAIL_CLOSED: "+reason);};
export function validateAndConvertP12E01HeshunMid15(bank,authority){
 gate(bank?.schema_version===P12_E01_HESHUN_MID15_SCHEMA&&bank.public_site_integrated===true
 &&bank.source_paper_id===SOURCE&&bank.source_pdf_sha256===PDF_SHA
 &&bank.expected_blocks===15&&bank.expected_answer_slots===15
 &&bank.expected_standalone_true_false===9&&bank.expected_standalone_choice===6
 &&bank.original_teacher_answer_key_authenticated===false&&bank.original_cropped_images_included===false
 &&bank.source_image_geometry_verified==="ROTATED_SOURCE_RASTER_PIXEL_BBOX_MANUAL_VISUAL"
 &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===15,"immutable publication metadata");
 const sourceIDs=new Set(),publicIDs=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const a=EXPECTED.get(b.source_slot_id);
  gate(!!a&&!sourceIDs.has(b.source_slot_id),"known unique original source");
  sourceIDs.add(b.source_slot_id);
  gate(b.id===a[0]&&!publicIDs.has(b.id),"unique immutable public id");publicIDs.add(b.id);
  gate(b.source_id===SOURCE&&b.source_pdf_sha256===a[3]&&b.source_page_pdf_1_based===a[4]
   &&eq(b.source_pdf_bbox_pts_top_left,a[5])&&b.source_bbox_raster_proof_ref===EVIDENCE
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"original raster transformed pixel box and original PDF SHA");
  gate(b.stem===a[6]&&b.answer===a[1]&&b.canonical_kp_id===a[2]
   &&b.answer_explanation===a[8]&&b.unit===a[9]
   &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"original text, Science answer and KP");
  gate(!stems.has(b.stem),"duplicate stem");stems.add(b.stem);
  const unit=resolveUnit(authority,b.unit);
  gate(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP");
  if(b.type==="tf"){
   tf++;gate(["O","X"].includes(b.answer)&&a[7].length===0&&!("options" in b),"true/false original");
  }else{
   mc++;gate(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&eq(b.options,a[7])&&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i])),"four full original choices");
  }
  gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","operator/public rights");
 }
 gate(publicIDs.size===15&&sourceIDs.size===15&&stems.size===15&&tf===9&&mc===6,"15/9TF/6MC immutable admission");
 return {admission:"P12_E01_HESHUN_MID15_CERTIFIED",blocks:bank.blocks,answerSlots:15,standaloneTf:9,standaloneChoice:6,contextGroups:0};
}
