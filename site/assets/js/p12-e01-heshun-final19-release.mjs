import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_HESHUN_FINAL19_PATH="../data/question-bank/p12-e01-heshun-final21-public-v1.json";
export const P12_E01_HESHUN_FINAL19_SCHEMA="SCIENCE_P12_E01_HESHUN_FINAL19_PUBLIC_V1";
const PAPER="SCI_G04_S1_114_FINAL_002";
const PDF_SHA="b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e";
const EVIDENCE="data/review/p12-e01-heshun-final21-raster-pixelbbox-science-kp-admission-v2.json";
// Immutable source evidence is independent of the incoming public-bank object.
const EXPECTED=new Map([["SCI_G04_S1_114_FINAL_002|S1|TF|002",["P12_E01_HESHUN_FINAL_TF_001","X","sci_g04s1_03_07","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,154.375,61.875,176.25],"當光照在光滑的物體上時會產生反射，被反射的光會以曲線前進。",[],"反射改變光的方向，並不使光在均勻介質中改成曲線傳播。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_002|S1|TF|003",["P12_E01_HESHUN_FINAL_TF_002","O","sci_g04s1_03_07","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,193.75,61.875,214.375],"在太陽下，利用鏡子調整光的行進方向，可以使光照進陰暗的角落。",[],"鏡面改變反射光行進方向，可以把日光照到陰暗處。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_002|S1|TF|008",["P12_E01_HESHUN_FINAL_TF_003","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,385.625,61.875,408.75],"在通路的電路中加入連接物，燈泡仍然可以發亮，則這個連接物就稱為電的良導體。",[],"連接物接入原先斷開的電路而使燈泡發亮，表示它可導電。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S1|TF|009",["P12_E01_HESHUN_FINAL_TF_004","X","sci_g04s1_04_08","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,426.875,61.875,445.625],"在燈泡串聯的情況下，如果其中一個燈泡故障了，其他的燈泡仍然會發光。",[],"燈泡串聯電路中任一處斷路，正常情況下其他燈泡也不會亮。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S2|MC|001",["P12_E01_HESHUN_FINAL_MC_001","④","sci_g04s1_03_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,637.5,63.125,659.375],"關於光源的描述，哪一項敘述是正確的？",["①會發出聲音","②必須是黃色的","③只有在夜晚看得到","④會發光"],"光源的定義是本身能發出光的物體。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_002|S2|MC|002",["P12_E01_HESHUN_FINAL_MC_002","③","sci_g04s1_03_07","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[23.125,710.625,63.125,730.625],"光照在下列哪一種物品上無法形成清楚的影像？",["①大樓的玻璃","②光滑的不鏽鋼餐具","③柔軟的窗簾","④平靜的湖泊水面"],"柔軟窗簾表面通常形成散射而非鏡面反射，難以映出清楚影像。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_002|S2|MC|006",["P12_E01_HESHUN_FINAL_MC_004","②","sci_g04s1_03_07","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[321.875,101.875,360.625,121.25],"下列哪個現象主要是和光的反射現象有關？",["①蠟燭點燃後會發光","②從靜止的水面看見倒影","③陽光照進房間後，房間會變亮","④打開檯燈可以照亮環境"],"平靜水面可以反射光形成倒影。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_002|S2|MC|008",["P12_E01_HESHUN_FINAL_MC_005","④","sci_g04s1_04_01","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[321.875,254.375,360.625,273.75],"下列有關電池的敘述，哪一項是錯誤的？",["①凸的那一端稱為正極","②平的那一端稱為負極","③正極代表符號為「＋」","④負極代表符號為「＝」"],"一般乾電池負極標記是負號「－」，不是等號「＝」。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S2|MC|009",["P12_E01_HESHUN_FINAL_MC_006","②","sci_g04s1_04_11","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[321.875,330.625,360.625,352.5],"處理「沒有電的廢電池」方式，哪個不適當？",["①拿到超商回收","②直接丟一般垃圾桶","③拿給資源回收車回收","④丟到學校的電池回收筒"],"廢電池應分類回收，不應丟一般垃圾。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S2|MC|010",["P12_E01_HESHUN_FINAL_MC_007","③","sci_g04s1_04_04","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[321.875,393.125,360.625,413.125],"電路接好後，發現燈泡不亮，下列哪一項不可能是燈泡不亮的原因？",["①電池連接方式","②燈泡連接方式","③電池顏色","④電池電力"],"電池的顏色通常不影響燈泡是否發亮。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S2|MC|012",["P12_E01_HESHUN_FINAL_MC_008","①","sci_g04s1_04_12","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",1,[321.875,503.75,360.625,526.25],"有關用電的敘述，哪一項正確？",["①用插座防護塞蓋住不用的插座","②用潮溼的手插電器插座","③延長線同時接上好幾種電器並同時使用","④利用拉電線拔插頭"],"未使用的插座以防護塞隔離，能降低幼兒觸電風險。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|001",["P12_E01_HESHUN_FINAL_TF_005","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[46.875,443.75,84.375,467.5],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n鐵製螺絲釘",[],"鐵製螺絲釘可導電並接通電路。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|002",["P12_E01_HESHUN_FINAL_TF_006","X","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[191.25,443.75,230,467.5],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n木製免洗筷",[],"乾木筷通常是電的不良導體。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|003",["P12_E01_HESHUN_FINAL_TF_007","X","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[46.875,466.875,84.375,488.75],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n橡皮擦",[],"一般橡皮擦不易導電。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|004",["P12_E01_HESHUN_FINAL_TF_008","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[191.25,466.875,230,488.75],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n鐵製便當盒",[],"鐵製便當盒的裸露金屬部分可導電。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|005",["P12_E01_HESHUN_FINAL_TF_009","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[46.875,488.125,84.375,510.625],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n長尾夾",[],"一般長尾夾的金屬部分可以導電，須確保導電接觸面不是絕緣塗層。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|006",["P12_E01_HESHUN_FINAL_TF_010","X","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[191.25,488.125,230,510.625],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n塑膠牙刷",[],"塑膠牙刷柄通常是電的不良導體。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|007",["P12_E01_HESHUN_FINAL_TF_011","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[46.875,510,84.375,532.5],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n錫箔紙",[],"錫箔紙屬金屬材料，可以導電。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_002|S5|G01|008",["P12_E01_HESHUN_FINAL_TF_012","O","sci_g04s1_04_05","b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e",2,[191.25,510,230,532.5],"五、若電路的電線斷裂了，連接哪些物品可再形成通路使燈泡發光？可以的請打ˇ，不可以的打╳。\n鐵製迴紋針",[],"鐵製迴紋針的裸露金屬部分能導電。","4-S1-U04"]]]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(ok,why)=>{if(!ok)throw Error("P12_E01_HESHUN_FINAL19_FAIL_CLOSED: "+why);};
const HELD=new Set(["SCI_G04_S1_114_FINAL_002|S2|MC|003","SCI_G04_S1_114_FINAL_002|S2|MC|013"]);
export function validateAndConvertP12E01HeshunFinal19(bank,authority){
 gate(bank?.schema_version===P12_E01_HESHUN_FINAL19_SCHEMA&&bank.public_site_integrated===true
  &&bank.source_paper_id===PAPER&&bank.source_pdf_sha256===PDF_SHA
  &&bank.expected_blocks===19&&bank.expected_answer_slots===19
  &&bank.expected_standalone_true_false===12&&bank.expected_standalone_choice===7
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false
  &&bank.source_image_geometry_verified==="SOURCE_ORIGINAL_ROTATED_SCAN_MANUAL_PIXEL_BBOX"
  &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===19,"immutable public gate metadata");
 const sourceIDs=new Set(),publicIDs=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const ex=EXPECTED.get(b.source_slot_id);
  gate(!!ex&&!HELD.has(b.source_slot_id)&&!sourceIDs.has(b.source_slot_id),"frozen source slot / hold exclusion");
  sourceIDs.add(b.source_slot_id);
  gate(b.id===ex[0]&&!publicIDs.has(b.id),"immutable unique public ID");publicIDs.add(b.id);
  gate(b.source_id===PAPER&&b.source_pdf_sha256===ex[3]&&b.source_page_pdf_1_based===ex[4]
    &&eq(b.source_pdf_bbox_pts_top_left,ex[5])&&b.source_bbox_raster_proof_ref===EVIDENCE
    &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
    &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
    &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
    &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],"original PDF + rotated scanned image exact pixel marker");
  gate(b.stem===ex[6]&&b.answer===ex[1]&&b.canonical_kp_id===ex[2]&&b.unit===ex[9]
    &&b.answer_explanation===ex[8]&&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"source text, independent science, canonical KP");
  gate(!stems.has(b.stem),"duplicate printed stem");stems.add(b.stem);
  const unit=resolveUnit(authority,b.unit);
  gate(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical authority");
  if(b.type==="tf"){
   tf++;gate(["O","X"].includes(b.answer)&&ex[7].length===0&&!("options" in b),"original true/false type");
  }else{
   mc++;gate(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
     &&eq(b.options,ex[7])&&Array.isArray(b.options)&&b.options.length===4
     &&b.options.every((s,i)=>typeof s==="string"&&s.startsWith(["①","②","③","④"][i])),"full original 4 choices");
  }
  gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
    &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
    &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights and source operator scope");
 }
 gate(publicIDs.size===19&&sourceIDs.size===19&&stems.size===19&&tf===12&&mc===7,"19 positions exactly, 12TF+7MC");
 return {admission:"P12_E01_HESHUN_FINAL19_CERTIFIED",blocks:bank.blocks,answerSlots:19,standaloneTf:12,standaloneChoice:7,contextGroups:0};
}
