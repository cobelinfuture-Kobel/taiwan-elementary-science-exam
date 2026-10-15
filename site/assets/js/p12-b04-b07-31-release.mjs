import {resolveUnit} from "./authority-adapter.mjs";
import {assertScorelessMetadata} from "./scoreless-contract.mjs";
export const P12_B04_B07_31_PATH="../data/question-bank/p12-b04-b07-31-public-v1.json";
export const P12_B04_B07_31_SCHEMA="SCIENCE_P12_B04_B07_31_PUBLIC_V1";
const EVIDENCE="data/review/p12-b04-b07-31-formal-science-kp-acceptance-v1.json";
const EXPECTED=new Map([["SCI_G04_S1_114_FINAL_012|Q06|002",["O","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",1,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n鏡面變粗糙，反射影像會變模糊。",[],[388.18,321.53,416.03,336.48],1,"平滑鏡面變粗糙後反射方向更分散，清楚成像能力減弱。"]],["SCI_G04_S1_114_FINAL_012|Q06|003",["O","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",2,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n水面在陽光下閃亮，是因為反射光。",[],[388.18,340.13,416.03,355.08],1,"水面可反射陽光，在特定觀察角度造成閃爍亮點。"]],["SCI_G04_S1_114_FINAL_012|Q06|004",["O","sci_g04s1_03_08","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",3,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n站在兩面相對的鏡子中會產生許多影像。",[],[388.18,358.73,416.03,373.68],1,"兩面相對鏡子的重複反射可能產生多個影像。"]],["SCI_G04_S1_114_FINAL_012|Q06|005",["X","sci_g04s1_03_08","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",4,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n反光背心的亮條會吸收光，所以會發亮。",[],[388.18,377.33,416.03,392.28],1,"反光材料主要將光反射到觀察者方向，而不是因吸收光線發亮。"]],["SCI_G04_S1_114_FINAL_012|Q06|006",["X","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",5,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n反射後的光會沿著彎曲的路線前進。",[],[388.18,395.93,416.03,410.88],1,"反射改變傳播方向後，光在均勻介質中仍沿直線行進。"]],["SCI_G04_S1_114_FINAL_012|Q06|007",["O","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",6,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n能看到鏡中自己，是因為光反射進眼睛。",[],[388.18,414.53,416.03,429.48],1,"眼睛接收鏡子反射而來的光才能看到鏡中影像。"]],["SCI_G04_S1_114_FINAL_012|Q06|008",["O","sci_g04s1_03_08","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",7,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n不鏽鋼湯匙會反光，是因為表面光滑。",[],[388.18,433.13,416.03,448.08],1,"表面相對光滑的不鏽鋼湯匙可反射入射光。"]],["SCI_G04_S1_114_FINAL_012|Q06|009",["O","sci_g04s1_03_07","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",8,"下列關於「光的反射」敘述，正確畫○，不正確打〤。\n手電筒照鏡子的角度改變，反射方向也會改變。",[],[388.18,451.73,416.03,466.68],1,"改變入射方向或鏡面角度，可使光的反射方向改變。"]],["SCI_G04_S1_114_FINAL_012|Q08|001",["O","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",9,"下列關於「聲音」的敘述，正確畫○，不正確打〤。\n物體發出聲音時，發聲部位會有振動現象。",[],[388.18,653.95,416.03,668.9],1,"發聲物體的發聲部位一般會振動。"]],["SCI_G04_S1_114_FINAL_012|Q08|002",["O","sci_g04s1_03_03","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",10,"下列關於「聲音」的敘述，正確畫○，不正確打〤。\n太空中沒有空氣，太空人面對面說話時，無法像在地球上一樣直接聽見聲音。",[],[388.18,670.75,416.03,685.7],1,"沒有傳聲介質時無法像空氣中直接傳播說話聲，太空人需透過通訊設備。"]],["SCI_G04_S1_114_FINAL_012|Q08|003",["O","sci_g04s1_03_09","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",11,"下列關於「聲音」的敘述，正確畫○，不正確打〤。\n動物可以透過聲音來進行求偶、警告或溝通等行為。",[],[388.18,702.55,416.03,717.5],1,"動物可藉聲音求偶、溝通與發出警告。"]],["SCI_G04_S1_114_FINAL_012|Q08|004",["X","sci_g04s1_03_01","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",12,"下列關於「聲音」的敘述，正確畫○，不正確打〤。\n敲打造成的振動才能產生聲音，其他方式無法產生聲音。",[],[388.18,734.35,416.03,749.3],1,"撥動、吹氣、摩擦等也可引起振動發聲，不只有敲打。"]],["SCI_G04_S1_114_FINAL_012|Q08|006",["O","sci_g04s1_03_03","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",13,"下列關於「聲音」的敘述，正確畫○，不正確打〤。\n聲音一定要透過物質傳播，才能使人聽見。",[],[388.18,782.95,416.08,797.9],1,"聲音在介質中藉振動傳播，真空無法直接傳聲。"]],["SCI_G04_S1_114_FINAL_012|Q10|001",["O","sci_g04s1_03_09","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",14,"下列關於「聲音和光的應用」敘述，正確的畫○，不正確打〤。\n用手機的語音輸入搜尋資料。",[],[50.16,85.71,78.01,100.66],2,"語音輸入系統把聲音訊號轉換成文字搜尋指令。"]],["SCI_G04_S1_114_FINAL_012|Q10|003",["X","sci_g04s1_03_09","1cd2ec1143be44955d938efbbbdc20471258139a3a4e5eb6565fa43d9cdcf987",15,"下列關於「聲音和光的應用」敘述，正確的畫○，不正確打〤。\n手機地震速報的聲響是光的應用。",[],[50.16,119.31,78.01,134.26],2,"地震速報的警報聲屬聲音應用，不是光的應用。"]],["SCI_G04_S1_114_FINAL_013|S1|TF|002",["O","sci_g04s1_03_03","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",16,"水上芭蕾的表演者，在水中時可以聽到音樂，表示水可以傳播聲音。",[],[49.32,114.95,79.52,130.49],1,"聲音可以在水等液體中傳遞。"]],["SCI_G04_S1_114_FINAL_013|S1|TF|004",["O","sci_g04s1_03_03","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",17,"「根據資料顯示：月球上幾乎沒有空氣。」依此資訊判斷，月球上兩個人面對面說話時，無法像在地球上一樣直接傳播聲音。",[],[49.32,169.55,79.52,185.09],1,"月球近真空環境不適合聲音透過空氣直接傳播。"]],["SCI_G04_S1_114_FINAL_013|S1|TF|007",["O","sci_g04s1_03_09","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",18,"交通號誌的不同燈色，可以管制交通。",[],[49.32,297.02,79.52,312.56],1,"交通號誌以不同顏色光線指示行停。"]],["SCI_G04_S1_114_FINAL_013|S1|TF|010",["X","sci_g04s1_03_06","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",19,"進行「光的行進」實驗時，手電筒從排水軟管的一端照射，無論是彎曲或拉直排水軟管，光線都可以從另一端照射出來。",[],[49.32,464.9,79.52,480.44],1,"彎曲不透明軟管遮住直射路徑時，通常無法如直管透出照明光。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|001",["④","sci_g04s1_03_01","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",20,"如果阿忠將綠豆灑在正在發出聲音的鼓面上，可以觀察到哪一種現象？",["①鼓面膨脹","②鼓面改變顏色","③綠豆變重","④綠豆在鼓面上跳動。"],[49.32,592.24,79.52,607.78],1,"敲擊發聲時鼓面振動，綠豆會隨鼓面上下跳動。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|003",["③","sci_g04s1_03_07","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",21,"下列哪一種情況下可以觀察到明顯的反光情形？",["①汽車的燈光","②樹林間透出光線","③透明資料夾內頁在燈光下看起來亮亮的","④雷射筆的燈束呈一直線。"],[49.32,742.99,79.52,758.53],1,"透明資料夾光滑表面可將燈光反射到眼睛，看到反光。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|005",["②","sci_g04s1_03_03","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",22,"耳朵貼在門板，可以聽到門外的聲音，代表哪一種物質可以傳播聲音？",["①氣體","②固體","③液體","④以上都不是。"],[49.32,912.93,79.52,928.47],1,"聲音能藉門板等固體振動傳遞。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|006",["①","sci_g04s1_03_06","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",23,"光照到物體時會產生影子，光、影子和物體的位置有什麼關係？",["①光和影子的方向相反","②光和影子都在物體的右側","③光和影子都在物體的左側","④光和影子會在同一側。"],[395.83,92.03,426.03,107.57],1,"影子一般出現在物體背向光源的一側。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|008",["①","sci_g04s1_03_10","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",24,"下列哪一個是生活中光的應用？",["①廣告看板上的燈光能吸引路人注意","②鬧鈴會發出鈴響","③消防車開啟警示聲","④垃圾車用音樂提醒民眾倒垃圾。"],[395.83,260.87,426.03,276.41],1,"廣告燈光吸引注意是生活中利用光的例子。"]],["SCI_G04_S1_114_FINAL_013|S2|MC|010",["①","sci_g04s1_03_07","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",25,"甲、乙兩種物體同時放在太陽底下，甲不容易看到反光情形，乙容易看到反光情形，由此可以推測出哪一種結果？",["①甲物體表面比較粗糙、不平滑","②乙物體表面比較粗糙、不平滑","③甲、乙物體表面一樣粗糙、不平滑","④甲、乙物體表面一樣光滑。"],[395.83,449.06,426.03,464.6],1,"粗糙表面通常使光向多方向散射，較難形成明顯鏡面反光。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|008",["X","sci_g04s1_03_06","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",26,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n門縫中透出的燈光是光的反射效果。",[],[40.32,906.87,82.46,920.91],2,"門縫透出來的燈光主要直接通過空隙，非鏡面反射。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|009",["X","sci_g04s1_03_06","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",27,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n影子的形狀和物體的形狀相似，與光的直線前進無關。",[],[40.32,925.11,82.46,939.15],2,"遮光形成的影子與光直線傳播密切相關。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|010",["O","sci_g04s1_03_08","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",28,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n路上的反光裝置可以提醒用路人，避免發生事故。",[],[40.32,961.47,82.46,975.51],2,"道路反光裝置將車燈反射給駕駛或路人，提升夜間安全。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|011",["O","sci_g04s1_03_07","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",29,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n月光是月球表面反射太陽光而來。",[],[386.83,30.27,428.95,44.31],2,"月亮表面把太陽光反射到地球形成月光。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|012",["O","sci_g04s1_03_01","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",30,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n用手握住發出聲音的三角鐵，可讓三角鐵聲音停止。",[],[386.83,48.51,428.95,62.55],2,"握住三角鐵使振動受到抑制，原有敲擊聲逐漸停止。"]],["SCI_G04_S1_114_FINAL_013|S4|G02|014",["X","sci_g04s1_03_01","f380d19120002698a9ccc4e71a41d31867cba9d9fb00669af8b290c81f233764",31,"2.生活中有許多聲音和光的應用，正確的打ˇ，不正確的打╳。\n說話時，手放在喉嚨上不會有振動的感覺。",[],[386.83,103.13,428.95,117.17],2,"說話時聲帶振動，手摸喉嚨通常可感受振動。"]]]);
const fail=(yes,what)=>{if(!yes)throw Error("P12_B04_B07_31_RELEASE_GATE: "+what);};
const validText=x=>typeof x==="string"&&!!x.trim();
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validateAndConvertP12B04B07_31(bank,authority){
 assertScorelessMetadata(bank);
 fail(bank?.schema_version===P12_B04_B07_31_SCHEMA&&bank.public_site_integrated===true
  &&bank.frozen_batch_id==="B07"&&bank.source_count_reviewed===50
  &&bank.original_source_positions_approved===31&&bank.exceptions_held===19
  &&bank.expected_blocks===31&&bank.expected_answer_slots===31
  &&bank.expected_standalone_true_false===25&&bank.expected_standalone_choice===6
  &&bank.parent_instruction_projection_count===15
  &&bank.parent_instruction_original_review_count===15
  &&bank.original_teacher_answer_key_authenticated===false
  &&bank.original_cropped_images_included===false
  &&bank.evidence_ref===EVIDENCE&&Array.isArray(bank.blocks)&&bank.blocks.length===31,
  "frozen source, scoreless or publication metadata");
 const ids=new Set(),slots=new Set(),stems=new Set();let tf=0,mc=0;
 for(const b of bank.blocks){
  const original=EXPECTED.get(b.source_slot_id);
  fail(original&&!slots.has(b.source_slot_id),"unknown or duplicate source");slots.add(b.source_slot_id);
  fail(b.id===`P12_B04_G04S1_B07_${b.type==="tf"?"TF":"MC"}_${String(b.b07_review_ordinal).padStart(3,"0")}`
   &&!ids.has(b.id),"frozen unique public ID");ids.add(b.id);
  fail(b.source_id===b.source_slot_id.split("|")[0]&&b.source_pdf_sha256===original[2]
   &&bank.source_pdf_binary_hashes_by_paper?.[b.source_id]===original[2]
   &&b.source_page_pdf_1_based===original[7]
   &&same(b.source_pdf_bbox_pts_top_left,original[6])
   &&Array.isArray(b.source_pdf_bbox_pts_top_left)
   &&b.source_pdf_bbox_pts_top_left.length===4
   &&b.source_pdf_bbox_pts_top_left.every(Number.isFinite)
   &&b.source_pdf_bbox_pts_top_left[0]<b.source_pdf_bbox_pts_top_left[2]
   &&b.source_pdf_bbox_pts_top_left[1]<b.source_pdf_bbox_pts_top_left[3],
   "PDF binary/page/marker BBox exact");
  fail(b.answer===original[0]&&b.canonical_kp_id===original[1]
   &&b.b07_review_ordinal===original[3]&&b.stem===original[4]
   &&b.answer_explanation===original[8]
   &&validText(b.answer_assumption),"Science answer, original stem, KP, rationale");
  fail(!stems.has(b.stem),"duplicate stem");stems.add(b.stem);
  const unit=resolveUnit(authority,b.unit);
  fail(unit?.grade===4&&unit.semester===1&&unit.knowledge_points.some(k=>k.canonical_kp_id===b.canonical_kp_id),"canonical KP authority");
  if(b.type==="tf"){
   tf++;fail(["O","X"].includes(b.answer)&&original[5].length===0&&!("options" in b),"O/X TF original source");
  }else{
   mc++;fail(b.type==="mcq"&&["①","②","③","④"].includes(b.answer)
    &&same(b.options,original[5])
    &&Array.isArray(b.options)&&b.options.length===4
    &&b.options.every((x,i)=>validText(x)&&x.startsWith(["①","②","③","④"][i])),"printed MC choices");
  }
  fail(b.source==="P12_OPERATOR_APPROVED_QUESTION"
   &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"&&b.operator_publication_approval===true
   &&b.original_teacher_answer_key_authenticated===false&&b.original_cropped_assets_included===false
   &&b.dependency_review_verified===true&&b.evidence_ref===EVIDENCE
   &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES",
   "rights/source governance/public admission");
 }
 fail(slots.size===31&&ids.size===31&&stems.size===31&&tf===25&&mc===6,
  "31 strict accepted source positions/25 TF/6 MC");
 return {admission:"P12_B04_B07_31_CERTIFIED",blocks:bank.blocks,
  answerSlots:31,standaloneTf:25,standaloneChoice:6,contextGroups:0};
}
