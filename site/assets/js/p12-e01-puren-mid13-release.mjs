import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_PUREN_MID13_PATH="../data/question-bank/p12-e01-puren-mid13-public-v1.json";
export const P12_E01_PUREN_MID13_SCHEMA="SCIENCE_P12_E01_PUREN_MID13_PUBLIC_V1";
const EVIDENCE="data/review/p12-e01-puren-mid18-raster-pixelbbox-13accept-5hold-v1.json";
const PAPER="SCI_G04_S1_114_MID_009";
const PDF_SHA="6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351";
// Immutable admission comparison is independent of loaded public JSON.
const EXPECTED=new Map([["SCI_G04_S1_114_MID_009|S1|MC|003",["P12_E01_PUREN_MID_MC_001","④","sci_g04s1_02_01","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,206.25,85,223.75],"下列關於水田和潮間帶這兩種水域環境的敘述，哪一項是正確的？",["①水田中找不到水生植物","②潮間帶中找不到水生動物","③水田的水是鹹水","④水田是人為建造的水域環境，潮間帶是天然形成的水域環境"],"水田屬人工水域，潮間帶是自然形成的水域。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|005",["P12_E01_PUREN_MID_MC_002","③","sci_g04s1_02_04","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,367.5,85,385],"小華說：「水滴在荷花葉面上會形成水珠，葉面不易被水沾溼。」小美說：「布袋蓮的葉柄裡有孔洞，可以儲存空氣，所以它能在水面上漂浮。」請問他們兩人誰說得對？",["①小華","②小美","③兩人都對","④兩人都不對"],"荷葉疏水性與布袋蓮葉柄含氣構造的敘述都成立。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|006",["P12_E01_PUREN_MID_MC_003","④","sci_g04s1_02_04","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,468.75,85,486.25],"下列哪一項不可能是漂浮性水生植物的特徵？",["①葉面有蠟質","②葉柄有儲存空氣的構造","③葉面有細毛","④根生長在水底的泥土裡"],"漂浮植物的根通常不固定在水底泥土裡。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|007",["P12_E01_PUREN_MID_MC_004","①","sci_g04s1_02_09","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,541.875,85,559.375],"下列哪一種水生動物在水中的主要運動方式和其他三者不同？",["①螺","②蝌蚪","③蛙","④龜"],"螺類通常以足緩慢爬行，與其他動物主要游動方式不同。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|008",["P12_E01_PUREN_MID_MC_005","②","sci_g04s1_01_05","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,590.625,85,608.125],"下列哪一項是造成河川砂石往下移動形成土石流的可能原因？",["①打雷","②下大雨","③強風","④動物遷移"],"大量降雨會使土砂含水與流動增加，可能誘發土石流。","4-S1-U01"]],["SCI_G04_S1_114_MID_009|S1|MC|009",["P12_E01_PUREN_MID_MC_006","①","sci_g04s1_02_04","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[50,647.5,85,665],"把水族箱中的大萍壓入水底再放手，會發生什麼情形？",["①大萍會立刻浮起來","②大萍會一直沉在水底","③手將大萍壓到什麼地方，大萍就會停在那個地方","④大萍會上下顛倒的在水面下漂浮移動"],"大萍漂浮組織提供浮力，放開後通常浮回水面。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|014",["P12_E01_PUREN_MID_MC_007","②","sci_g04s1_02_02","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[391.875,185,427.5,203.75],"大雄調查水域環境時，發現了苔蘚、浮萍和蛙，下列哪一個最不可能是大雄調查的水域環境？",["①溪流","②海洋","③生態池","④水田"],"苔蘚、浮萍與蛙的組合不符合高鹽度海洋水域。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S1|MC|015",["P12_E01_PUREN_MID_MC_008","①","sci_g04s1_02_04","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",1,[391.875,256.25,427.5,275],"下列哪一種不是布袋蓮葉柄膨大的功能？",["①增加重量","②增加浮力","③儲存空氣","④幫助漂浮"],"膨大的含氣葉柄增加浮力而非重量。","4-S1-U02"]],["SCI_G04_S1_114_MID_009|S3|G01|001",["P12_E01_PUREN_MID_TF_001","O","sci_g04s1_01_09","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",2,[38.125,683.75,78.125,701.25],"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n平時準備避難救生包。",[],"地震前備妥避難救生包屬基本防災準備。","4-S1-U01"]],["SCI_G04_S1_114_MID_009|S3|G01|002",["P12_E01_PUREN_MID_TF_002","O","sci_g04s1_01_09","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",2,[38.125,703.75,78.125,721.25],"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n平時應進行防震演練。",[],"定期演練可使人更熟悉地震應變。","4-S1-U01"]],["SCI_G04_S1_114_MID_009|S3|G01|003",["P12_E01_PUREN_MID_TF_003","X","sci_g04s1_01_10","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",2,[38.125,723.75,78.125,741.25],"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n地震發生時應搭電梯盡速下樓。",[],"地震時應就地採取趴下、掩護、穩住，不宜搭電梯。","4-S1-U01"]],["SCI_G04_S1_114_MID_009|S3|G01|004",["P12_E01_PUREN_MID_TF_004","X","sci_g04s1_01_09","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",2,[38.125,742.5,78.125,760],"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n人們現在已能準確預測地震的發生。",[],"目前無法準確預測特定地震發生的時間、地點與規模。","4-S1-U01"]],["SCI_G04_S1_114_MID_009|S3|G01|006",["P12_E01_PUREN_MID_TF_005","O","sci_g04s1_01_11","6a244bd24ed0317ca9d2d12b6d0f84281df4bc382bc9d8b783a1d244ebd8f351",2,[38.125,782.5,78.125,800],"臺灣經常發生地震，關於防災準備及應對觀念，正確的請打✓，錯誤的請打×。\n地震後應該檢查瓦斯、水、電等設備。",[],"震後在確認環境安全下，應留意瓦斯、水與電力設備異常。","4-S1-U01"]]]);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const gate=(good,msg)=>{if(!good)throw Error("P12_E01_PUREN_MID13_RELEASE_GATE: "+msg);};
export function validateAndConvertP12E01PurenMid13(bank,authority){
 gate(bank?.schema_version===P12_E01_PUREN_MID13_SCHEMA&&bank.public_site_integrated===true
   &&bank.source_paper_id===PAPER&&bank.source_pdf_sha256===PDF_SHA
   &&bank.expected_blocks===13&&bank.expected_answer_slots===13
   &&bank.expected_standalone_true_false===5&&bank.expected_standalone_choice===8
   &&bank.original_teacher_answer_key_authenticated===false&&bank.original_cropped_images_included===false
   &&bank.source_image_geometry_verified==="DIRECT_RASTER_PIXEL_BBOX_MANUAL_VISUAL"
   &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===13,"frozen admission metadata");
 const ids=new Set(),sourceIds=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
   const proof=EXPECTED.get(b.source_slot_id);
   gate(proof&&!sourceIds.has(b.source_slot_id),"unknown or duplicate original source");
   sourceIds.add(b.source_slot_id);
   gate(b.id===proof[0]&&!ids.has(b.id),"immutable public ID");ids.add(b.id);
   gate(b.source_id===PAPER&&b.source_pdf_sha256===proof[3]&&b.source_page_pdf_1_based===proof[4]
     &&eq(b.source_pdf_bbox_pts_top_left,proof[5])
     &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
     &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
     &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
     &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3]
     &&b.source_bbox_raster_proof_ref===EVIDENCE,"original scanned PDF + manually verified pixel-derived BBox");
   gate(b.answer===proof[1]&&b.canonical_kp_id===proof[2]&&b.stem===proof[6]
     &&b.answer_explanation===proof[8]&&b.unit===proof[9]
     &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"unique science answer, source text and KP");
   gate(!stems.has(b.stem),"duplicate original stem");stems.add(b.stem);
   const unit=resolveUnit(authority,b.unit);
   gate(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(x=>x.canonical_kp_id===b.canonical_kp_id),"canonical KP authority");
   if(b.type==="tf"){
     tf++;gate(["O","X"].includes(b.answer)&&proof[7].length===0&&!("options" in b),"true-false source");
   }else{
     mc++;gate(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
       &&eq(b.options,proof[7])&&b.options.length===4
       &&b.options.every((t,i)=>typeof t==="string"&&t.startsWith(["①","②","③","④"][i])),"printed four-choice source");
   }
   gate(b.source==="P12_OPERATOR_APPROVED_QUESTION"
      &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
      &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
      &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
      &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES","rights and operator approval");
 }
 gate(ids.size===13&&sourceIds.size===13&&stems.size===13&&tf===5&&mc===8,"frozen 13/5TF/8MC exact positions");
 return {admission:"P12_E01_PUREN_MID13_CERTIFIED",blocks:bank.blocks,answerSlots:13,standaloneTf:5,standaloneChoice:8,contextGroups:0};
}
