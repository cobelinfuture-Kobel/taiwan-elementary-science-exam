import {resolveUnit} from "./authority-adapter.mjs";
export const P12_E01_PUREN_FINAL16_PATH="../data/question-bank/p12-e01-puren-final16-public-v1.json";
export const P12_E01_PUREN_FINAL16_SCHEMA="SCIENCE_P12_E01_PUREN_FINAL16_PUBLIC_V1";
const EVIDENCE="data/review/p12-e01-puren-final16-pixel-bbox-formal-science-kp-acceptance-v1.json";
const SOURCE="SCI_G04_S1_114_FINAL_010";
const SHA="2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690";
// Independent immutable exact-source comparison: never derive expected values from supplied bank at runtime.
const EXPECTED=new Map([["SCI_G04_S1_114_FINAL_010|S1|TF|001",["P12_E01_PUREN_FINAL_TF_001","X","sci_g04s1_03_06","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,135.625,78.125,149.375],"雷射筆射出的光是直線行進，太陽的光則不是。",[],"雷射筆與太陽發出的光，在均勻透明介質中均沿直線行進。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S1|TF|002",["P12_E01_PUREN_FINAL_TF_002","X","sci_g04s1_03_05","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,170,78.125,183.75],"光源是指本身能發光的物體，例如鏡子、反光背心都是光源。",[],"鏡子與反光背心是反射光，不是本身發光的光源。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S1|TF|004",["P12_E01_PUREN_FINAL_TF_003","X","sci_g04s1_04_06","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,279.375,78.125,293.125],"設計電路時，電池的並聯或串聯與燈泡的亮度沒有關係，只是為了達到燈泡不會同時全部不亮的目的。",[],"電池串聯與並聯的電壓特性不同，會影響燈泡亮度。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_010|S1|TF|005",["P12_E01_PUREN_FINAL_TF_004","O","sci_g04s1_03_01","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,331.25,78.125,345],"運動會大鼓表演，表演者敲擊得越用力，鼓面的振動越大，發出的聲音也越大。",[],"較用力敲擊鼓面通常使振動幅度增加、聲音較大。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S1|TF|006",["P12_E01_PUREN_FINAL_TF_005","O","sci_g04s1_04_10","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,365.625,78.125,379.375],"小馬達的轉動方向並不會因為電池數量而改變。",[],"在極性方向相同且電壓適當的通常情況下，增加電池數量不改變小馬達轉向；轉向與極性相關。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_010|S1|TF|007",["P12_E01_PUREN_FINAL_TF_006","X","sci_g04s1_03_03","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,400.625,78.125,415],"在海邊聽到海浪聲是聲音經由液體傳播的例子。",[],"海浪聲雖源於海水運動，但海邊聽見的聲音主要經空氣傳入耳朵。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S2|MC|001",["P12_E01_PUREN_FINAL_MC_007","②","sci_g04s1_04_12","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,506.25,78.125,521.25],"小普要參加正確用電安全的海報比賽，他應該選擇哪一個宣導內容？",["①使用電器時，電線捲在一起可以省空間","②不可用手直接拉扯電線","③電線有塑膠皮保護，不需要隨時檢查","④延長線同時連接多個電器較為省電"],"拔插頭時應握插頭本體，不可直接拉扯電線。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_010|S2|MC|003",["P12_E01_PUREN_FINAL_MC_008","③","sci_g04s1_03_09","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,686.25,78.125,700],"下列哪一個選項中的物品都具有警示的功能？",["①元宵節天燈、聖誕燈飾","②聲光玩具、火災警報器","③行人穿越號誌、消防車鳴笛聲","④國家級警報、遊樂園的聲光旋轉木馬"],"行人穿越號誌和消防車鳴笛均具有警示功能。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S2|MC|004",["P12_E01_PUREN_FINAL_MC_009","④","sci_g04s1_03_03","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,775,78.125,788.125],"關於聲音的敘述，哪一項正確？",["①陽光可以穿越太空照射到地球，聲音也可以在真空的太空中傳播","②泳池中無法產生聲音","③物體振動的大小，不會影響聲音的大小","④同一個聲音透過不同物體傳播出來，聽起來可能不一樣"],"聲音在不同介質中傳播方式與聽感可能有所不同。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S2|MC|005",["P12_E01_PUREN_FINAL_MC_010","①","sci_g04s1_04_04","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[30,884.375,78.125,898.125],"以下電器用品開關的敘述，何者正確？",["①開關裝置的設計包含了電的良導體與不良導體","②開關外部多半會使用良導體","③設計開關最主要是為了控制電力的強弱","④關上開關，形成通路，電腦關機"],"開關可由良導體完成導通、絕緣部分提供操作安全。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_010|S2|MC|006",["P12_E01_PUREN_FINAL_MC_011","③","sci_g04s1_04_08","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[361.25,114.375,416.875,131.875],"自然老師：「在原本連接一個電池和一個燈泡的通路中再增加一個燈泡，有什麼方法能讓這兩個燈泡都維持原來的亮度？」",["①將電池顛倒放置","②Sorry，沒有辦法","③將燈泡並聯","④將燈泡串聯"],"原電池電壓下，將兩個相同燈泡並聯通常能維持接近單燈時的亮度。","4-S1-U04"]],["SCI_G04_S1_114_FINAL_010|S2|MC|007",["P12_E01_PUREN_FINAL_MC_012","①","sci_g04s1_03_01","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",1,[361.25,205,416.875,222.5],"將塑膠尺的一端固定在桌面上，用手指撥動尺的另一端，哪種作法會讓尺發出的聲音最大？",["①將尺往下壓10公分","②將尺往下壓1公分","③不要撥動尺","④將尺往下壓5公分"],"在其他條件相同的情況下，撥動尺的振幅較大通常聲音較大。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S3|G04|014",["P12_E01_PUREN_FINAL_TF_013","X","sci_g04s1_03_04","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",2,[39.375,184.375,82.5,200],"下列關於光的特性，正確的打√，不正確的打 X。\n即使沒有光，我們也能看見物體。",[],"若沒有光進入眼睛，便無法用視覺看見物體。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S3|G04|015",["P12_E01_PUREN_FINAL_TF_014","O","sci_g04s1_03_06","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",2,[39.375,206.875,82.5,221.25],"下列關於光的特性，正確的打√，不正確的打 X。\n光沒有被阻擋時，不會形成影子。",[],"影子形成需要光被不透明物體阻擋。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S3|G04|016",["P12_E01_PUREN_FINAL_TF_015","O","sci_g04s1_03_07","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",2,[39.375,228.125,82.5,242.5],"下列關於光的特性，正確的打√，不正確的打 X。\n當光反射後，它反射的方向也會改變。",[],"光照到反射面後可能改變其傳播方向。","4-S1-U03"]],["SCI_G04_S1_114_FINAL_010|S3|G04|017",["P12_E01_PUREN_FINAL_TF_016","X","sci_g04s1_03_06","2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690",2,[39.375,249.375,82.5,265.625],"下列關於光的特性，正確的打√，不正確的打 X。\n當光照射到透明玻璃時，會形成明顯的影子。",[],"透明玻璃通常容許多數光通過，不會形成明顯深色的影子。","4-S1-U03"]]]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=(ok,msg)=>{if(!ok)throw Error("P12_E01_PUREN_FINAL16_FAIL_CLOSED: "+msg);};
export function validateAndConvertP12E01PurenFinal16(bank,authority){
 fail(bank?.schema_version===P12_E01_PUREN_FINAL16_SCHEMA
  &&bank.public_site_integrated===true&&bank.source_paper_id===SOURCE
  &&bank.source_pdf_sha256===SHA&&bank.expected_blocks===16&&bank.expected_answer_slots===16
  &&bank.expected_standalone_true_false===10&&bank.expected_standalone_choice===6
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false
  &&bank.source_image_geometry_verified==="MODEL_DIRECT_RASTER_VISUAL_REVIEW"
  &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===16,"metadata");
 const seenIDs=new Set(),seenSources=new Set(),seenText=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const orig=EXPECTED.get(b.source_slot_id);
  fail(!!orig&&!seenSources.has(b.source_slot_id),"unknown/duplicate source ID");
  seenSources.add(b.source_slot_id);
  fail(b.id===orig[0]&&!seenIDs.has(b.id),"public ID");
  seenIDs.add(b.id);
  fail(b.source_id===SOURCE&&b.source_pdf_sha256===orig[3]&&b.source_page_pdf_1_based===orig[4]
   &&same(b.source_pdf_bbox_pts_top_left,orig[5])
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)&&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3]
   &&b.source_bbox_raster_proof_ref===EVIDENCE,"source original PDF and visually checked pixel-derived BBox");
  fail(b.stem===orig[6]&&b.answer===orig[1]&&b.canonical_kp_id===orig[2]
   &&b.answer_explanation===orig[8]&&b.unit===orig[9]
   &&typeof b.answer_assumption==="string"&&b.answer_assumption.trim(),"unique science and original text");
  fail(!seenText.has(b.stem),"exact student stem duplicated in E01");seenText.add(b.stem);
  const u=resolveUnit(authority,b.unit);
  fail(u?.grade===4&&u.semester===1&&u.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"KP");
  if(b.type==="tf"){
   tf++;fail(["O","X"].includes(b.answer)&&orig[7].length===0&&!("options" in b),"TF");
  }else{
   mc++;fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&same(b.options,orig[7])&&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((v,i)=>typeof v==="string"&&v.startsWith(["①","②","③","④"][i])),"MC original choices");
  }
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false
   &&b.original_cropped_assets_included===false&&b.dependency_review_verified===true
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"
   &&b.evidence_ref===EVIDENCE,"operator/rights/publication");
 }
 fail(seenIDs.size===16&&seenSources.size===16&&seenText.size===16&&tf===10&&mc===6,"16 unique/10 TF/6 MC");
 return {admission:"P12_E01_PUREN_FINAL16_CERTIFIED",blocks:bank.blocks,answerSlots:16,standaloneTf:10,standaloneChoice:6,contextGroups:0};
}
