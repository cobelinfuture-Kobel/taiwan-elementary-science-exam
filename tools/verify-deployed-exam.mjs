import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
import {chromium} from "playwright";
const base="https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam";
const rev="SCIENCE_S3_P10_OX_V4";
mkdirSync("artifacts/deployed-browser",{recursive:true});
let browser;
try {
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1024}});
  const errors=[];
  const assetUrls=[];
  page.on("pageerror",e=>errors.push(String(e)));
  page.on("request",r=>{if(r.url().includes("historical-bank")||r.url().includes("approved-historical"))assetUrls.push(r.url());});
  const resp=await page.goto(base+"/exam/?smoke=p12-113-g04s1-b08-mc7-two-parent-live959-20261025",{waitUntil:"networkidle",timeout:45000});
  assert.equal(resp?.status(),200,"public Exam HTTP response");
  await page.screenshot({path:"artifacts/deployed-browser/after-load.png",fullPage:true});
  const info=await page.locator("#bank-info").textContent();
  const status=await page.locator("#status").textContent();
  assert.ok(info.includes("已載入內建考古題 959 小題（476 題是非＋341 題單選＋38 組情境）"),"Live site must load certified 113 G04S1 sources: "+info+"; status="+status);
  const native38Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-native38-public-v1.json",{cache:"no-cache"});
  assert.equal(native38Response.status(),200,"Published Pages must serve approved native38 original exam cohort");
  const native38=await native38Response.json();
  assert.deepEqual([native38.expected_blocks,native38.expected_answer_slots,native38.expected_standalone_true_false,native38.expected_standalone_choice],[38,38,15,23]);
  assert.equal(new Set(native38.blocks.map(b=>b.source_slot_id)).size,38);
  assert.equal(new Set(native38.blocks.map(b=>b.source_id)).size,8);
  assert.ok(native38.blocks.every(b=>b.operator_publication_approval===true
    &&b.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&b.source_pdf_sha256.length===64&&b.source_page_pdf_1_based===1
    &&b.source_pdf_bbox_pts_top_left.length===4
    &&b.original_teacher_answer_key_authenticated===false
    &&b.original_cropped_assets_included===false
    &&b.copyright_path==="SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES"));
  assert.ok(native38.blocks.filter(b=>b.type==="mcq").every(b=>b.options.length===4&&["①","②","③","④"].includes(b.answer)));
  // Two prior wind KP questions persist alongside one directly operator-approved source.
  const native38Wind=native38.blocks.filter(b=>b.canonical_kp_id==="sci_g04s1_01_12");
  assert.equal(native38Wind.length,1);
    const hn22Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-hn22-public-v1.json",{cache:"no-cache"});
  assert.equal(hn22Response.status(),200,"Live Pages must serve exact 22 operator-approved Heshun/Neian original texts");
  const hn22=await hn22Response.json();
  assert.deepEqual([hn22.expected_blocks,hn22.expected_answer_slots,hn22.expected_standalone_true_false,hn22.expected_standalone_choice],[22,22,11,11]);
  assert.equal(hn22.public_site_integrated,true);
  assert.equal(hn22.requires_operator_batch_manifest_approval,false);
  assert.equal(new Set(hn22.blocks.map(x=>x.source_slot_id)).size,22);
  assert.deepEqual(new Set(hn22.blocks.map(x=>x.source_id)),new Set(["SCI_G04_S1_113_FINAL_001","SCI_G04_S1_113_MID_006"]));
  assert.ok(hn22.blocks.every(x=>x.operator_publication_approval===true
    &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&x.original_teacher_answer_key_authenticated===false
    &&x.original_cropped_assets_included===false
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.source_pdf_bbox_pts_top_left?.length===4
    &&x.source_pdf_sha256?.length===64));
  assert.ok(hn22.blocks.every(x=>x.type==="tf"&&["O","X"].includes(x.answer)
     ||x.type==="mcq"&&["①","②","③","④"].includes(x.answer)&&x.options?.length===4));
  assert.ok(!hn22.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_006|S2|MC|002"),"Reordered 114 duplicate must remain excluded");
  const exact4Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-exact4-public-v1.json",{cache:"no-cache"});
  assert.equal(exact4Response.status(),200,"Live Pages must serve all 4 original school operator-approved exam question texts");
  const exact4=await exact4Response.json();
  assert.deepEqual([exact4.expected_blocks,exact4.expected_answer_slots,exact4.expected_standalone_true_false,exact4.expected_standalone_choice],[4,4,0,4]);
  assert.equal(exact4.public_site_integrated,true);
  assert.equal(exact4.requires_operator_batch_manifest_approval,false);
  assert.equal(new Set(exact4.blocks.map(x=>x.source_slot_id)).size,4);
  assert.deepEqual(exact4.blocks.map(x=>x.answer),["④","①","③","④"]);
  assert.ok(exact4.blocks.every(x=>x.operator_publication_approval===true&&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&x.original_teacher_answer_key_authenticated===false&&x.original_cropped_assets_included===false
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&x.source_pdf_sha256?.length===64
    &&x.source_pdf_bbox_pts_top_left?.length===4&&x.options?.length===4));
  // B01 Wende MID001 selective 7 original source questions, Article9 text-only, per-asset live Pages check.
  const b01Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b01Response.status(),200,"Live Pages delivers seven original B01 Wende standalone questions");
  const b01=await b01Response.json();
  assert.equal(b01.schema_version,"SCIENCE_P12_G04S1_113_B01_WENDE7_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b01.expected_blocks,b01.expected_answer_slots,b01.expected_standalone_true_false,b01.expected_standalone_choice],[7,7,4,3]);
  const source="SCI_G04_S1_113_MID_001";
  assert.deepEqual(b01.blocks.map(x=>x.source_slot_id),[
   source+"|S01|TF|004",source+"|S01|TF|012",source+"|S01|TF|014",source+"|S01|TF|015",
   source+"|S02|MC|007",source+"|S02|MC|008",source+"|S02|MC|011"]);
  assert.deepEqual(b01.blocks.map(x=>x.answer),["X","X","O","O","②","②","③"]);
  assert.deepEqual(b01.blocks.map(x=>x.canonical_kp_id),[
   "sci_g04s1_02_02","sci_g04s1_02_11","sci_g04s1_02_13","sci_g04s1_02_14",
   "sci_g04s1_02_09","sci_g04s1_02_05","sci_g04s1_02_14"]);
  assert.ok(b01.blocks.every(x=>x.source_id===source&&x.unit==="4-S1-U02"&&x.grade===4&&x.semester===1
   &&x.source_pdf_sha256==="7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56"
   &&x.source_page_pdf_1_based===1&&x.source_pdf_bbox_pts_top_left?.length===4
   &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"&&x.operator_publication_approval===true
   &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
   &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&x.original_cropped_assets_included===false
   &&x.original_teacher_answer_key_authenticated===false&&x.dependency_review_verified===true));
  assert.ok(b01.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.equal(b01.blocks.filter(x=>x.type==="tf").length,4);
  assert.equal(b01.blocks.filter(x=>x.source_lineage_ids?.length===2).length,2,
   "exact identical unpublished cross-school question retains two source lineages, one student question");
  // B02: only 21 precisely operator-approved original native school texts, no 28 HOLD, no duplicate B01 source release.
  const b02Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b02Response.status(),200,"Published Pages must serve approved B02 21 exact school exam texts");
  const b02=await b02Response.json();
  assert.equal(b02.schema_version,"SCIENCE_P12_G04S1_113_B02_NATIVE21_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b02.expected_blocks,b02.expected_answer_slots,b02.expected_standalone_true_false,b02.expected_standalone_choice],[21,21,15,6]);
  assert.equal(new Set(b02.blocks.map(x=>x.source_slot_id)).size,21);
  assert.deepEqual(b02.blocks.map(x=>x.source_id).reduce((counts,key)=>(counts[key]=(counts[key]||0)+1,counts),{}),{
    "SCI_G04_S1_113_MID_004":4,
    "SCI_G04_S1_113_MID_007":11,
    "SCI_G04_S1_113_MID_008":6
  },"Dongguang4 Minquan11 Yongan6 exact original source identities");
  assert.deepEqual(b02.blocks.map(x=>x.answer),["X","O","O","O","O","O","X","O","X","①","②","③","①","②","③","X","O","O","O","O","O"]);
  assert.ok(b02.blocks.every(x=>x.operator_publication_approval===true
    &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&x.grade===4&&x.semester===1&&["4-S1-U01","4-S1-U02"].includes(x.unit)
    &&x.source_pdf_sha256?.length===64&&x.source_page_pdf_1_based===1
    &&x.source_pdf_bbox_pts_top_left?.length===4
    &&x.canonical_kp_id?.startsWith("sci_g04s1_0")
    &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.original_cropped_assets_included===false
    &&x.original_teacher_answer_key_authenticated===false
    &&x.dependency_review_verified===true));
  assert.ok(b02.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.equal(b02.blocks.filter(x=>x.type==="tf").length,15);
  assert.ok(!b02.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_004|S2|TF|11"),
    "B01 already published exact identical Dongguang crossschool lineage not added twice");
  // B03: exact 27 original school texts, choices, science answers and directly mapped 113 frozen KPs.
  const b03Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b03-native27-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b03Response.status(),200,"Live Pages must serve precisely 27 operator-approved B03 source questions");
  const b03=await b03Response.json();
  assert.equal(b03.schema_version,"SCIENCE_P12_G04S1_113_B03_NATIVE27_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b03.expected_blocks,b03.expected_answer_slots,b03.expected_standalone_true_false,b03.expected_standalone_choice],[27,27,10,17]);
  assert.deepEqual(b03.blocks.map(x=>x.source_slot_id),["SCI_G04_S1_113_MID_008|S2|MC|3","SCI_G04_S1_113_MID_008|S2|MC|4","SCI_G04_S1_113_MID_008|S2|MC|7","SCI_G04_S1_113_MID_008|S2|MC|8","SCI_G04_S1_113_MID_008|S2|MC|9","SCI_G04_S1_113_MID_008|S2|MC|10","SCI_G04_S1_113_MID_008|S2|MC|11","SCI_G04_S1_113_MID_008|S2|MC|12","SCI_G04_S1_113_MID_009|S1|TF|1","SCI_G04_S1_113_MID_009|S1|TF|2","SCI_G04_S1_113_MID_009|S1|TF|3","SCI_G04_S1_113_MID_009|S1|TF|5","SCI_G04_S1_113_MID_009|S1|TF|6","SCI_G04_S1_113_MID_009|S1|TF|7","SCI_G04_S1_113_MID_009|S1|TF|9","SCI_G04_S1_113_MID_009|S1|TF|10","SCI_G04_S1_113_MID_009|S1|TF|11","SCI_G04_S1_113_MID_009|S1|TF|12","SCI_G04_S1_113_MID_009|S2|MC|4","SCI_G04_S1_113_MID_009|S2|MC|5","SCI_G04_S1_113_MID_009|S2|MC|6","SCI_G04_S1_113_MID_009|S2|MC|11","SCI_G04_S1_113_MID_010|S2|MC|1","SCI_G04_S1_113_MID_010|S2|MC|2","SCI_G04_S1_113_MID_010|S2|MC|3","SCI_G04_S1_113_MID_010|S2|MC|6","SCI_G04_S1_113_MID_010|S2|MC|8"]);
  assert.deepEqual(b03.blocks.map(x=>x.answer),["①","③","②","③","②","④","④","③","O","O","X","X","X","X","X","X","X","X","①","③","②","④","③","④","②","③","③"]);
  assert.deepEqual(b03.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_01_07","sci_g04s1_01_01","sci_g04s1_02_02","sci_g04s1_02_14","sci_g04s1_02_02","sci_g04s1_02_04","sci_g04s1_02_03","sci_g04s1_02_10","sci_g04s1_01_02","sci_g04s1_02_11","sci_g04s1_02_14","sci_g04s1_01_05","sci_g04s1_02_02","sci_g04s1_01_02","sci_g04s1_02_09","sci_g04s1_01_09","sci_g04s1_02_14","sci_g04s1_02_03","sci_g04s1_02_14","sci_g04s1_01_05","sci_g04s1_02_02","sci_g04s1_01_04","sci_g04s1_02_02","sci_g04s1_02_08","sci_g04s1_02_02","sci_g04s1_02_03","sci_g04s1_02_07"]);
  assert.equal(new Set(b03.blocks.map(x=>x.source_slot_id)).size,27);
  assert.ok(b03.blocks.every(x=>x.grade===4&&x.semester===1
    &&["4-S1-U01","4-S1-U02"].includes(x.unit)
    &&x.source_pdf_sha256?.length===64&&x.source_page_pdf_1_based>=1
    &&x.source_pdf_bbox_pts_top_left?.length===4
    &&x.operator_publication_approval===true
    &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.original_teacher_answer_key_authenticated===false
    &&x.original_cropped_assets_included===false
    &&x.dependency_review_verified===true));
  assert.equal(b03.blocks.filter(x=>x.type==="tf").length,10);
  assert.ok(b03.blocks.filter(x=>x.type==="mcq").length===17
    &&b03.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.ok(!b03.blocks.some(x=>x.source_slot_id?.startsWith("SCI_G04_S1_113_MID_010|S1|TF|")),
    "Already-public legacy Mingyi seven must not be republished");
  assert.ok(!b03.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_009|S2|MC|15"),
    "Anhe near duplicate remains HOLD");
  // B04 exact original 36: full list, independently reasoned answers, direct frozen KP and Article9.
  const b04R=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b04-native36-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b04R.status(),200,"Live public Pages must serve exact36 approved B04 school questions");
  const b04=await b04R.json();
  assert.equal(b04.schema_version,"SCIENCE_P12_G04S1_113_B04_NATIVE36_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b04.expected_blocks,b04.expected_answer_slots,b04.expected_standalone_true_false,b04.expected_standalone_choice],[36,36,22,14]);
  assert.deepEqual(b04.blocks.map(x=>x.source_slot_id),["SCI_G04_S1_113_MID_011|S1|TF|6","SCI_G04_S1_113_MID_011|S1|TF|10","SCI_G04_S1_113_MID_011|S2|MC|7","SCI_G04_S1_113_MID_011|S2|MC|9","SCI_G04_S1_113_MID_011|S2|MC|10","SCI_G04_S1_113_MID_013|S1|TF|1","SCI_G04_S1_113_MID_013|S1|TF|2","SCI_G04_S1_113_MID_013|S1|TF|3","SCI_G04_S1_113_MID_013|S1|TF|5","SCI_G04_S1_113_MID_013|S1|TF|7","SCI_G04_S1_113_MID_013|S1|TF|9","SCI_G04_S1_113_MID_013|S1|TF|10","SCI_G04_S1_113_MID_013|S1|TF|11","SCI_G04_S1_113_MID_013|S1|TF|12","SCI_G04_S1_113_MID_013|S1|TF|13","SCI_G04_S1_113_MID_013|S1|TF|14","SCI_G04_S1_113_MID_013|S1|TF|15","SCI_G04_S1_113_MID_013|S2|MC|1","SCI_G04_S1_113_MID_013|S2|MC|4","SCI_G04_S1_113_MID_013|S2|MC|5","SCI_G04_S1_113_MID_013|S2|MC|6","SCI_G04_S1_113_MID_013|S2|MC|7","SCI_G04_S1_113_MID_013|S2|MC|8","SCI_G04_S1_113_MID_013|S2|MC|9","SCI_G04_S1_113_MID_013|S2|MC|10","SCI_G04_S1_113_MID_014|S1|TF|4","SCI_G04_S1_113_MID_014|S1|TF|5","SCI_G04_S1_113_MID_014|S1|TF|9","SCI_G04_S1_113_MID_014|S1|TF|10","SCI_G04_S1_113_MID_014|S2|MC|1","SCI_G04_S1_113_MID_014|S2|MC|7","SCI_G04_S1_113_MID_014|S2|MC|8","SCI_G04_S1_113_MID_015|S1|TF|1","SCI_G04_S1_113_MID_015|S1|TF|2","SCI_G04_S1_113_MID_015|S1|TF|3","SCI_G04_S1_113_MID_015|S1|TF|4"]);
  assert.deepEqual(b04.blocks.map(x=>x.answer),["O","X","①","①","②","O","X","O","O","O","O","X","X","O","X","X","O","②","②","②","①","③","④","②","④","O","O","O","X","③","②","④","X","X","X","X"]);
  assert.deepEqual(b04.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_01_06","sci_g04s1_01_05","sci_g04s1_02_07","sci_g04s1_01_02","sci_g04s1_01_01","sci_g04s1_01_02","sci_g04s1_01_02","sci_g04s1_01_02","sci_g04s1_01_07","sci_g04s1_01_07","sci_g04s1_02_07","sci_g04s1_02_05","sci_g04s1_02_02","sci_g04s1_02_02","sci_g04s1_02_09","sci_g04s1_01_03","sci_g04s1_01_05","sci_g04s1_02_13","sci_g04s1_02_11","sci_g04s1_01_02","sci_g04s1_02_09","sci_g04s1_02_09","sci_g04s1_02_02","sci_g04s1_02_14","sci_g04s1_01_09","sci_g04s1_02_05","sci_g04s1_02_09","sci_g04s1_02_02","sci_g04s1_02_10","sci_g04s1_01_07","sci_g04s1_01_04","sci_g04s1_02_07","sci_g04s1_02_03","sci_g04s1_02_04","sci_g04s1_02_09","sci_g04s1_02_02"]);
  assert.equal(new Set(b04.blocks.map(x=>x.source_slot_id)).size,36);
  assert.ok(b04.blocks.every(x=>x.grade===4&&x.semester===1
    &&["4-S1-U01","4-S1-U02"].includes(x.unit)
    &&x.source_pdf_sha256?.length===64&&x.source_page_pdf_1_based>=1
    &&x.source_pdf_bbox_pts_top_left?.length===4
    &&x.operator_publication_approval===true
    &&x.certification_status==="OPERATOR_APPROVED_PUBLIC"
    &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.original_teacher_answer_key_authenticated===false
    &&x.original_cropped_assets_included===false
    &&x.dependency_review_verified===true));
  assert.equal(b04.blocks.filter(x=>x.type==="tf").length,22);
  assert.ok(b04.blocks.filter(x=>x.type==="mcq").length===14
    &&b04.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.ok(!b04.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_014|S1|TF|2"),"already-public duplicate suppressed");
  assert.ok(!b04.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_015|S1|TF|5"),"science qualifier HOLD retained");
  // B05 independently authorized exact24: 25 HOLD + 1 already public 114 choice-order alias not student bank.
  const b05R=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b05-native24-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b05R.status(),200,"live Pages must serve 24 B05 exact original school exam items");
  const b05=await b05R.json();
  assert.equal(b05.schema_version,"SCIENCE_P12_G04S1_113_B05_NATIVE24_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b05.expected_blocks,b05.expected_answer_slots,b05.expected_standalone_true_false,b05.expected_standalone_choice],[24,24,8,16]);
  assert.equal(new Set(b05.blocks.map(x=>x.source_slot_id)).size,24);
  assert.deepEqual([11,12,1],["SCI_G04_S1_113_MID_015","SCI_G04_S1_113_FINAL_006","SCI_G04_S1_113_MID_018"].map(id=>b05.blocks.filter(x=>x.source_id===id).length));
  assert.ok(b05.blocks.every(x=>x.operator_publication_approval===true&&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&x.original_cropped_assets_included===false
    &&x.original_teacher_answer_key_authenticated===false&&x.dependency_review_verified===true
    &&x.source_pdf_sha256?.length===64&&x.source_pdf_bbox_pts_top_left?.length===4));
  assert.equal(b05.blocks.filter(x=>x.type==="tf").length,8);
  assert.ok(b05.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.ok(!b05.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_FINAL_006|S2|MC|10"),"114 publicly duplicated option-order alias must remain suppressed");
  assert.ok(!b05.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_015|S2|MC|5"),"science context qualifier HOLD remains excluded");
  // B06 exact16 newly operator-approved original independent school exam texts; 34 HOLD excluded.
  const b06R=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b06-native16-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b06R.status(),200,"live Pages must serve B06 16 authorized original school exam questions");
  const b06=await b06R.json();
  assert.equal(b06.schema_version,"SCIENCE_P12_G04S1_113_B06_NATIVE16_STANDALONE_PUBLIC_V1");
  assert.deepEqual([b06.expected_blocks,b06.expected_answer_slots,b06.expected_standalone_true_false,b06.expected_standalone_choice],[16,16,5,11]);
  assert.equal(new Set(b06.blocks.map(x=>x.source_slot_id)).size,16);
  assert.deepEqual([11,5],["SCI_G04_S1_113_MID_018","SCI_G04_S1_113_FINAL_010"].map(id=>b06.blocks.filter(x=>x.source_id===id).length));
  assert.ok(b06.blocks.every(x=>x.operator_publication_approval===true
    &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.original_cropped_assets_included===false
    &&x.original_teacher_answer_key_authenticated===false
    &&x.dependency_review_verified===true
    &&x.source_pdf_sha256?.length===64&&x.source_pdf_bbox_pts_top_left?.length===4));
  assert.equal(b06.blocks.filter(x=>x.type==="tf").length,5);
  assert.ok(b06.blocks.filter(x=>x.type==="mcq").every(x=>x.options?.length===4&&["①","②","③","④"].includes(x.answer)));
  assert.ok(!b06.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_FINAL_010|S1|MC|22"),"B06 114-year name-only near match retained HOLD");
  assert.ok(!b06.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_FINAL_010|S1|MC|24"),"B06 semantic-ambiguous school question retained HOLD");
  // B07 Lushang exact3 original subquestions only. G04 #2 and G02 image-dependent set remain HOLD.
  const b07LushangResponse=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b07-lushang-exact3-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b07LushangResponse.status(),200,"actual Pages serves B07 exact3 approved original exam MCs");
  const b07Lushang=await b07LushangResponse.json();
  assert.deepEqual([b07Lushang.expected_blocks,b07Lushang.expected_answer_slots,b07Lushang.expected_standalone_true_false,b07Lushang.expected_standalone_choice],[3,3,0,3]);
  assert.deepEqual(b07Lushang.blocks.map(x=>x.source_original_slot_id),[
    "SCI_G04_S1_113_MID_014|S03|G04|MC|001",
    "SCI_G04_S1_113_MID_014|S03|G04|MC|003",
    "SCI_G04_S1_113_MID_014|S03|G04|MC|004"]);
  assert.deepEqual(b07Lushang.blocks.map(x=>x.answer),["③","①","④"]);
  assert.deepEqual(b07Lushang.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_08","sci_g04s1_02_09","sci_g04s1_02_09"]);
  assert.deepEqual(b07Lushang.blocks.map(x=>x.stem),[
    "魚的鰓位於身體的哪一個部位呢？",
    "在蝌蚪變成蛙的過程中，從來沒有使用下列哪一種構造呼吸呢？",
    "浮潛使用的呼吸管，和下列哪一種動物的呼吸構造相似？"]);
  assert.ok(b07Lushang.blocks.every(x=>x.options?.length===4
    &&x.source_pdf_bbox_pts_top_left?.length===4
    &&x.operator_publication_approval===true&&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
    &&x.original_cropped_assets_included===false&&x.original_teacher_answer_key_authenticated===false));
  assert.ok(!b07Lushang.blocks.some(x=>x.source_original_slot_id==="SCI_G04_S1_113_MID_014|S03|G04|MC|002"),"parent-dependent Q325 excluded");
  // B07 exact four original school child-only exam MCs; parent reading passage and third party assets are not published.
  const b07Exact4Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b07-exact4-standalone-public-v1.json",{cache:"no-cache"});
  assert.equal(b07Exact4Resp.status(),200,"live Pages serves exactly B07 original four child text MCs");
  const b07NewExact4=await b07Exact4Resp.json();
  assert.deepEqual([b07NewExact4.expected_blocks,b07NewExact4.expected_answer_slots,b07NewExact4.expected_standalone_true_false,b07NewExact4.expected_standalone_choice],[4,4,0,4]);
  assert.deepEqual(b07NewExact4.blocks.map(x=>x.source_original_slot_id),[
    "SCI_G04_S1_113_MID_013|S07|G02|MC|002",
    "SCI_G04_S1_113_MID_014|S03|G07|MC|001",
    "SCI_G04_S1_113_MID_014|S03|G07|MC|002",
    "SCI_G04_S1_113_MID_014|S03|G07|MC|003"]);
  assert.deepEqual(b07NewExact4.blocks.map(x=>x.answer),["②","④","③","①"]);
  assert.deepEqual(b07NewExact4.blocks.map(x=>x.canonical_kp_id),[
    "sci_g04s1_02_04","sci_g04s1_02_02","sci_g04s1_02_09","sci_g04s1_02_02"]);
  assert.deepEqual(b07NewExact4.blocks.map(x=>x.options.length),[3,4,4,4]);
  assert.deepEqual(b07NewExact4.blocks.map(x=>x.stem),[
    "布袋蓮的氣室可以幫助葉片漂浮，與下列哪一種水生植物的構造類似？",
    "玉黍螺適合在哪一種環境生存？",
    "下列哪一種生物會利用羽毛狀的觸手捕食？",
    "哪一種環境在海水中的時間最長，有許多不能承受乾燥與高溫的生物生存？"]);
  assert.ok(b07NewExact4.blocks.every(x=>x.source_pdf_bbox_pts_top_left?.length===4
    &&x.operator_publication_approval===true&&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
    &&x.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"&&x.original_cropped_assets_included===false
    &&x.original_teacher_answer_key_authenticated===false
    &&!Object.hasOwn(x,"reading_parent")&&!Object.hasOwn(x,"original_parent_text")));
  const excluded=["SCI_G04_S1_113_MID_013|S07|G02|MC|001","SCI_G04_S1_113_MID_014|S03|G04|MC|002"];
  assert.ok(!b07NewExact4.blocks.some(x=>excluded.includes(x.source_original_slot_id)),"Q305/Q325 stay HOLD");
  const loaderResponse=await page.request.get(base+"/assets/js/historical-bank-ox-v6.mjs",{cache:"no-cache"});
  assert.equal(loaderResponse.status(),200,"live Pages serves cumulative historical loader");
  const liveLoader=await loaderResponse.text();
  assert.ok(liveLoader.includes("...b05Native24.blocks")&&liveLoader.includes("+b05Native24.answerSlots"),"live loader must retain B05");
  assert.ok(liveLoader.includes("...b06Native16.blocks")&&liveLoader.includes("+b06Native16.answerSlots"),"live loader must integrate B06 approved 16, not just serve its JSON file");
  assert.ok(liveLoader.includes("...b07LushangExact3.blocks")&&liveLoader.includes("+b07LushangExact3.answerSlots"),"live loader must integrate 3 B07 original questions, not just their JSON");
  assert.ok(liveLoader.includes("...b07Exact4.blocks")&&liveLoader.includes("+b07Exact4.answerSlots"),"live loader integrates exactly 4 new B07 original child-only MCs");

  const b08Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-b08-chenggong-mc7-two-parent-public-v1.json",{cache:"no-cache"});
  assert.equal(b08Resp.status(),200,"B08 live MC7 two parents must be on deployed Pages");
  const b08=await b08Resp.json();
  assert.deepEqual([b08.expected_blocks,b08.expected_context_groups,b08.expected_answer_slots],[2,2,7]);
  assert.deepEqual(b08.blocks.map(g=>g.items.length),[3,4]);
  assert.deepEqual(b08.blocks.map(g=>g.source_parent_original_id),["CHENGGONG_S03_G04","CHENGGONG_S03_G05"]);
  assert.ok(b08.blocks[0].shared.table.rows[0].includes("水淺"));
  assert.ok(b08.blocks[1].shared.passage.includes("雅萍"));
  assert.ok(b08.blocks.every(g=>g.operator_publication_approval===true&&g.original_cropped_assets_included===false));
  assert.deepEqual(b08.blocks.flatMap(g=>g.items.map(x=>x.answer)),["①","②","③","③","②","④","①"]);
  assert.ok(liveLoader.includes("...b08ChenggongMC7.blocks")&&liveLoader.includes("+b08ChenggongMC7.contextGroups")&&liveLoader.includes("+b08ChenggongMC7.answerSlots"),"B08 is integrated into live loader rather than JSON-only");

  assert.ok(liveLoader.includes("...b01Wende7.blocks")&&liveLoader.includes("b01Wende7.answerSlots"),
   "live loader must actually integrate seven new B01 items, not merely upload their JSON asset");
  assert.ok(liveLoader.includes("...b02Native21.blocks")&&liveLoader.includes("b02Native21.answerSlots"),
    "actual cumulative public Pages loader must include 21 B02 approved source questions");
  assert.ok(liveLoader.includes("...b03Native27.blocks")&&liveLoader.includes("b03Native27.answerSlots"),
    "Actual live cumulative loader must include exact B03 27 operator-approved items");
  assert.ok(liveLoader.includes("...b04Native36.blocks")&&liveLoader.includes("b04Native36.answerSlots"),"real live cumulative loader must include approved B04 36");
  const native6Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-next-native-tfmc6-public-v1.json",{cache:"no-cache"});
  assert.equal(native6Response.status(),200,"Live Pages delivers 113 next native six new source bank");
  const native6=await native6Response.json();
  assert.deepEqual([native6.expected_blocks,native6.expected_answer_slots,native6.expected_standalone_true_false,native6.expected_standalone_choice],[6,6,2,4]);
  assert.deepEqual(native6.blocks.map(b=>b.source_slot_id),[
   "SCI_G04_S1_113_MID_003|S1|TF|008","SCI_G04_S1_113_MID_003|S2|MC|005","SCI_G04_S1_113_MID_003|S2|MC|007",
   "SCI_G04_S1_113_FINAL_003|S1|MC|001","SCI_G04_S1_113_FINAL_003|S1|MC|005","SCI_G04_S1_113_FINAL_003|S2|TF|006"]);
  assert.deepEqual(native6.blocks.map(b=>b.answer),["O","②","②","④","③","O"]);
  assert.ok(native6.blocks.every(b=>b.source_page_pdf_1_based===1&&b.source_pdf_bbox_pts_top_left?.length===4&&b.grade===4&&b.semester===1&&b.original_cropped_assets_included===false));
  const after94Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-native6-after94-public-v1.json",{cache:"no-cache"});
  assert.equal(after94Resp.status(),200,"Live Pages must serve six original Minquan/Yongan school slots");
  const after94=await after94Resp.json();
  assert.deepEqual([after94.expected_blocks,after94.expected_answer_slots,after94.expected_standalone_true_false,after94.expected_standalone_choice],[6,6,5,1]);
  assert.deepEqual(after94.blocks.map(b=>b.source_slot_id),[
   "SCI_G04_S1_113_MID_007|S01|TF|001","SCI_G04_S1_113_MID_007|S01|TF|003","SCI_G04_S1_113_MID_007|S01|TF|012",
   "SCI_G04_S1_113_MID_007|S02|MC|009","SCI_G04_S1_113_MID_008|S01|TF|002","SCI_G04_S1_113_MID_008|S01|TF|007"]);
  assert.deepEqual(after94.blocks.map(b=>b.answer),["X","X","X","④","X","X"]);
  assert.deepEqual(after94.blocks.map(b=>b.canonical_kp_id),["sci_g04s1_01_01","sci_g04s1_01_02","sci_g04s1_02_11","sci_g04s1_02_07","sci_g04s1_01_07","sci_g04s1_01_02"]);
  assert.ok(after94.blocks.every(b=>b.grade===4&&b.semester===1&&b.source_page_pdf_1_based===1&&b.source_pdf_bbox_pts_top_left?.length===4&&!b.original_cropped_assets_included));
  const hanlin5Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-hanlin-native5-after100-public-v1.json",{cache:"no-cache"});
  assert.equal(hanlin5Resp.status(),200,"Live Pages must deliver Hanlin native original five");
  const hanlin5=await hanlin5Resp.json();
  assert.deepEqual([hanlin5.expected_blocks,hanlin5.expected_answer_slots,hanlin5.expected_standalone_true_false,hanlin5.expected_standalone_choice],[5,5,4,1]);
  assert.deepEqual(hanlin5.blocks.map(b=>b.source_slot_id),[
   "SCI_G04_S1_113_MID_016|S01|TF|007","SCI_G04_S1_113_MID_016|S02|MC|014",
   "SCI_G04_S1_113_MID_017|S01|TF|009","SCI_G04_S1_113_MID_017|S01|TF|015",
   "SCI_G04_S1_113_MID_018|S01|TF|008"]);
  assert.deepEqual(hanlin5.blocks.map(b=>b.answer),["O","②","X","O","O"]);
  assert.deepEqual(hanlin5.blocks.map(b=>b.canonical_kp_id),["sci_g04s1_02_11","sci_g04s1_02_10","sci_g04s1_02_03","sci_g04s1_02_01","sci_g04s1_02_02"]);
  assert.ok(hanlin5.blocks.every(b=>b.grade===4&&b.semester===1&&b.unit==="4-S1-U02"&&b.source_page_pdf_1_based===1&&b.source_pdf_bbox_pts_top_left?.length===4&&!b.original_cropped_assets_included));
  const wendeNative2Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-wende-mid-native2-after111-public-v1.json",{cache:"no-cache"});
  assert.equal(wendeNative2Resp.status(),200,"Live Pages serves two exact Wende native post111 source items");
  const wendeNative2=await wendeNative2Resp.json();
  assert.deepEqual([wendeNative2.expected_blocks,wendeNative2.expected_answer_slots,wendeNative2.expected_standalone_true_false,wendeNative2.expected_standalone_choice],[2,2,2,0]);
  assert.deepEqual(wendeNative2.blocks.map(b=>b.source_slot_id),["SCI_G04_S1_113_MID_001|S1|TF|006","SCI_G04_S1_113_MID_001|S1|TF|010"]);
  assert.deepEqual(wendeNative2.blocks.map(b=>b.answer),["X","X"]);
  assert.deepEqual(wendeNative2.blocks.map(b=>b.canonical_kp_id),["sci_g04s1_02_06","sci_g04s1_02_08"]);
  assert.deepEqual(wendeNative2.blocks.map(b=>b.source_pdf_bbox_pts_top_left),[[28.56,366.42,60.52,379.37],[28.56,652.39,60.52,665.34]]);
  assert.ok(wendeNative2.blocks.every(b=>b.original_cropped_assets_included===false&&b.source_page_pdf_1_based===1));
  const mc010Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-wende-mid-mc010-after113-public-v1.json",{cache:"no-cache"});
  assert.equal(mc010Response.status(),200,"Live Pages serves new Wende native standalone four-option MC010");
  const mc010=await mc010Response.json();
  assert.deepEqual([mc010.expected_blocks,mc010.expected_answer_slots,mc010.expected_standalone_true_false,mc010.expected_standalone_choice],[1,1,0,1]);
  assert.equal(mc010.blocks[0].source_slot_id,"SCI_G04_S1_113_MID_001|S2|MC|010");
  assert.equal(mc010.blocks[0].canonical_kp_id,"sci_g04s1_02_02");
  assert.equal(mc010.blocks[0].answer,"③");
  assert.deepEqual(mc010.blocks[0].source_pdf_bbox_pts_top_left,[428.04,788.23,460,801.18]);
  assert.equal(mc010.blocks[0].options.length,4);
  const tf003Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-dongguang-mid-tf003-after110-public-v1.json",{cache:"no-cache"});
  assert.equal(tf003Response.status(),200,"Live Pages serves distinct Dongguang MID004 TF003 after published110");
  const tf003=await tf003Response.json();
  assert.deepEqual([tf003.expected_blocks,tf003.expected_answer_slots,tf003.expected_standalone_true_false,tf003.expected_standalone_choice],[1,1,1,0]);
  assert.equal(tf003.blocks[0].source_slot_id,"SCI_G04_S1_113_MID_004|S02|TF|003");
  assert.deepEqual([tf003.blocks[0].stem,tf003.blocks[0].answer,tf003.blocks[0].canonical_kp_id],["埤塘是淡水水域，而且水流速度非常快。","X","sci_g04s1_02_02"]);
  assert.deepEqual(tf003.blocks[0].source_pdf_bbox_pts_top_left,[371.35,190.81,403.31,204.09]);
  assert.equal(tf003.blocks[0].source_page_pdf_1_based,1);
  const new5Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-dongguang-dahua-native5-after105-public-v1.json",{cache:"no-cache"});
  assert.equal(new5Response.status(),200,"Live Pages must deliver 5 native standalone original school answer slots");
  const new5=await new5Response.json();
  assert.deepEqual([new5.expected_blocks,new5.expected_answer_slots,new5.expected_standalone_true_false,new5.expected_standalone_choice],[5,5,3,2]);
  assert.deepEqual(new5.blocks.map(b=>b.source_slot_id),[
   "SCI_G04_S1_113_MID_004|S02|TF|002","SCI_G04_S1_113_MID_004|S02|TF|012","SCI_G04_S1_113_MID_004|S02|TF|015",
   "SCI_G04_S1_113_FINAL_010|S01|MC|016","SCI_G04_S1_113_FINAL_010|S01|MC|021"]);
  assert.deepEqual(new5.blocks.map(b=>b.answer),["O","O","O","③","②"]);
  assert.deepEqual(new5.blocks.map(b=>b.canonical_kp_id),["sci_g04s1_02_13","sci_g04s1_02_05","sci_g04s1_02_13","sci_g04s1_03_08","sci_g04s1_03_08"]);
  assert.ok(new5.blocks.every(b=>b.grade===4&&b.semester===1&&b.source_pdf_bbox_pts_top_left?.length===4&&[1,2].includes(b.source_page_pdf_1_based)&&!b.original_cropped_assets_included));
  const remaining8Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-taozijiao-final-remaining8-public-v1.json",{cache:"no-cache"});
  assert.equal(remaining8Response.status(),200,"Pages must deploy eight additional original TF");
  const remaining8Bank=await remaining8Response.json();
  assert.deepEqual([remaining8Bank.expected_blocks,remaining8Bank.expected_answer_slots,remaining8Bank.expected_standalone_true_false],[8,8,8]);
  assert.equal(remaining8Bank.blocks.length,8);
  assert.equal(new Set(remaining8Bank.blocks.map(b=>b.source_slot_id)).size,8);
  assert.ok(remaining8Bank.blocks.every(b=>b.source_id==="SCI_G04_S1_113_FINAL_008"&&b.source_page_pdf_1_based===1
     &&b.source_pdf_bbox_pts_top_left?.length===4&&b.original_cropped_assets_included===false));
  const new113Response=await page.request.get(base+"/data/question-bank/p12-g04s1-113-selective27-public-v1.json",{cache:"no-cache"});
  assert.equal(new113Response.status(),200,"public Pages serves 113 G04S1 selective 27 source bank");
  const new113=await new113Response.json();
  assert.equal(new113.expected_blocks,27,"113 G04S1 new source answer positions");
  assert.equal(new113.blocks.length,27);
  assert.deepEqual([new113.blocks.filter(b=>b.type==="tf").length,new113.blocks.filter(b=>b.type==="mcq").length],[15,12]);
  assert.ok(new113.blocks.every(b=>b.source_id?.includes("SCI_G04_S1_113_")&&b.grade===4&&b.semester===1&&b.source_pdf_sha256?.length===64&&b.original_cropped_assets_included===false));
  assert.ok(new113.blocks.every(b=>!["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"].includes(b.canonical_kp_id)),"preserve R5 frozen selector-only newly added KPs");
  const nextResp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-selective-final16-public-v1.json",{cache:"no-cache"});
  assert.equal(nextResp.status(),200,"Pages serves source-verified additive 113 final-term 16 TF bank");
  const final16=await nextResp.json();
  assert.deepEqual([final16.expected_blocks,final16.expected_answer_slots,final16.expected_standalone_true_false],[16,16,16]);
  assert.equal(final16.blocks.length,16);
  assert.equal(new Set(final16.blocks.map(b=>b.source_slot_id)).size,16);
  assert.ok(final16.blocks.every(b=>b.type==="tf"&&["O","X"].includes(b.answer)&&b.grade===4&&b.semester===1&&b.source_pdf_sha256?.length===64&&b.original_cropped_assets_included===false));
  assert.ok(final16.blocks.every(b=>!["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"].includes(b.canonical_kp_id)),"final16 does not auto-admit R5 selector-only KPs");
  const mid11Resp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-mid11-selective-public-v1.json",{cache:"no-cache"});
  assert.equal(mid11Resp.status(),200,"Pages serves the eleven source-certified midterm school originals");
  const mid11=await mid11Resp.json();
  assert.deepEqual([mid11.expected_blocks,mid11.expected_answer_slots,mid11.expected_standalone_choice],[11,11,11]);
  assert.equal(mid11.blocks.length,11);
  assert.equal(new Set(mid11.blocks.map(b=>b.source_slot_id)).size,11);
  assert.ok(mid11.blocks.every(b=>b.type==="mcq"&&["①","②","③","④"].includes(b.answer)&&b.options?.length===4
   &&b.original_cropped_assets_included===false&&b.source_pdf_sha256?.length===64&&b.grade===4&&b.semester===1));
  assert.ok(mid11.blocks.every(b=>!["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"].includes(b.canonical_kp_id)),"R5 selector-only KP guard preserved");
  const nextMCResp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-final-mc9-selective-public-v1.json",{cache:"no-cache"});
  assert.equal(nextMCResp.status(),200,"Pages serves formally admitted nine 113 final term MC school originals");
  const nextMC=await nextMCResp.json();
  assert.deepEqual([nextMC.expected_blocks,nextMC.expected_answer_slots,nextMC.expected_standalone_choice],[9,9,9]);
  assert.equal(nextMC.blocks.length,9);
  assert.equal(new Set(nextMC.blocks.map(b=>b.source_slot_id)).size,9);
  assert.ok(nextMC.blocks.every(b=>b.type==="mcq"&&["①","②","③","④"].includes(b.answer)&&b.options?.length===4&&b.grade===4&&b.semester===1&&b.source_pdf_sha256?.length===64&&b.original_cropped_assets_included===false));
  assert.ok(nextMC.blocks.every(b=>!["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"].includes(b.canonical_kp_id)),"R5 frozen selector KP no auto-admission");
  const tjResp=await page.request.get(base+"/data/question-bank/p12-g04s1-113-taozijiao-final17-public-v1.json",{cache:"no-cache"});
  assert.equal(tjResp.status(),200,"Pages serves certified 113 final school 17 original TF");
  const tj=await tjResp.json();
  assert.deepEqual([tj.expected_blocks,tj.expected_answer_slots,tj.expected_standalone_true_false],[17,17,17]);
  assert.equal(tj.blocks.length,17);
  assert.equal(new Set(tj.blocks.map(b=>b.source_slot_id)).size,17);
  assert.ok(tj.blocks.every(b=>b.type==="tf"&&["O","X"].includes(b.answer)&&b.grade===4&&b.semester===1
    &&b.source_pdf_sha256==="59a1b5ee713f6cc96e47f1db1c9111918f67c6fd9bacecd64c9ad56a16db6ed3"
    &&b.original_cropped_assets_included===false&&b.source_page_pdf_1_based===1));
  assert.ok(tj.blocks.every(b=>!["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"].includes(b.canonical_kp_id)),"frozen R5 newly added KP not auto-admitted");
  assert.equal(await page.locator("#unit option").count(),4,"live unit selector present");
  assert.ok(await page.locator("#kp option").count()>0,"live KP selector populated");
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","public default question can generate: "+status);
  // Pin certified TF-only KP; mixed default public pool can select MC.
  await page.selectOption("#grade","4");
  await page.selectOption("#semester","S1");
  await page.selectOption("#unit","4-S1-U01");
  await page.selectOption("#mode","single_kp");
  await page.selectOption("#kp","sci_g04s1_01_11");
  await page.fill("#count","1");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","deployed certified TF O/X source available");
  const question=(await page.locator(".paper:not([data-answer='true']) .question").first().innerText()).trim();
  assert.match(question,/^（　）1\. /,"O/X bracket must precede question number");
  const answer=await page.locator(".paper[data-answer='true']").innerText();
  assert.match(answer,/\b1\. [OX]\b/,"answer page must use O or X");
  await page.selectOption("#grade","4");
  await page.selectOption("#semester","S2");
  await page.selectOption("#unit","4-S2-U04");
  await page.selectOption("#mode","single_kp");
  await page.selectOption("#kp","sci_g04s2_04_08");
  await page.fill("#count","1");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","deployed four-lower science bank selection");
  assert.ok((await page.locator(".paper:not([data-answer='true'])").innerText()).includes("石油可以製造"));
  const g=await page.request.get(base+"/data/governance/p11-kp-coverage.json",{cache:"no-cache"});
  const i=await page.request.get(base+"/data/governance/p11-question-identities.json",{cache:"no-cache"});
  const c=await page.request.get(base+"/data/governance/p11-full-corpus-ledger.json",{cache:"no-cache"});
  assert.equal(g.status(),200,"P11 KP report deployed");
  assert.equal(i.status(),200,"P11 identity report deployed");
  assert.equal(c.status(),200,"P11 corpus ledger deployed");
  assert.equal((await g.json()).primary_kp_covered,71);
  assert.equal((await i.json()).questions.length,148);
  assert.equal((await c.json()).source_slots.length,477);
  const rr=await page.request.get(base+"/data/governance/p11r1-reconciled-ledger.json",{cache:"no-cache"});
  assert.equal(rr.status(),200,"P11R1 source-to-content reconciliation is live");
  const revision=await rr.json();
  assert.equal(revision.published_adapted_source_links.length,76);
  assert.equal(revision.original_source_answer_positions_remaining_for_candidate_review,326);
  assert.equal(revision.admission_gate.direct_bulk_publication_without_individual_answer_KP_visual_gates_enabled,false);
  const p12=await page.request.get(base+"/data/governance/p12-frozen-candidate-queue.json",{cache:"no-cache"});
  assert.equal(p12.status(),200,"controlled P12 screening queue publicly archived");
  const pq=await p12.json();
  assert.equal(pq.candidate_slots.length,326);
  assert.equal(pq.first_batch_source,"G03-S2-MID");
  assert.equal(pq.no_additions_in_this_phase,true);
  const master=await page.request.get(base+"/data/governance/p12-master-progress.json",{cache:"no-cache"});
  const csv=await page.request.get(base+"/data/governance/p12-master-progress.csv",{cache:"no-cache"});
  assert.equal(master.status(),200,"public master progress JSON exists");
  assert.equal(csv.status(),200,"public master progress CSV exists");
  const progress=await master.json();
  assert.equal(progress.paper_rows.length,8);
  assert.equal(progress.candidate_position_baseline,326);
  assert.equal(progress.resume_checkpoint.source_id,"G04-S2-MID");
  assert.equal(progress.p11_frozen_public_baseline_answer_slots,148);
  assert.equal(progress.public_question_bank_answer_slots_current,251);
  assert.equal(progress.p12_operator_published_slots,103);
  assert.equal(progress.p12_not_publicly_released_source_positions,223);
  assert.equal(progress.position_status_counts.certified_staged,0);
  assert.equal(progress.position_status_counts.not_started,223);
  assert.equal(progress.position_status_counts.published,103);
  assert.equal(progress.position_status_counts.blocked,0);
  assert.equal(progress.review_events_count,320);
  const audit=await page.request.get(base+"/data/governance/p12-g03s2mid-candidate-review.json",{cache:"no-cache"});
  assert.equal(audit.status(),200,"G03-S2-MID science screening decisions live");
  const auditData=await audit.json();
  assert.equal(auditData.items.length,57);
  assert.equal(auditData.decisions.staged,51);
  assert.equal(auditData.decisions.blocked,6);
  const adjudication=await page.request.get(base+"/data/governance/p12-g03s2mid-six-blocker-adjudication.json",{cache:"no-cache"});
  assert.equal(adjudication.status(),200,"second-round science audit available");
  const round2=await adjudication.json();
  assert.equal(round2.conditional_stage,3);
  assert.equal(round2.persistent_holds,3);
  assert.ok(round2.items.every(x=>x.publication_approved===false));
  const masterPage=await page.request.get(base+"/review/master/");
  assert.equal(masterPage.status(),200,"public master dashboard exists");
  assert.deepEqual(errors,[],"No JavaScript runtime errors");
  assert.ok(assetUrls.some(x=>x.includes("historical-bank-ox-v6.mjs")),"Actual browser must load v2 JS module");
  assert.ok(assetUrls.some(x=>x.includes("approved-historical-ox-v4.json")),"Actual browser must load v2 JSON");
  const ctx=await page.request.get(base+"/data/question-bank/certified-context-groups-v2.json");
  assert.equal(ctx.status(),200,"source-reconstructed group data accessible");
  assert.equal((await ctx.json()).expected_group_count,20);
  const asset=await page.request.get(base+"/data/question-bank/approved-historical-ox-v4.json");
  assert.equal(asset.status(),200,"Live JSON directly accessible");
  assert.equal((await asset.json()).asset_revision,rev,"Live JSON revision");
  const p12New=await page.request.get(base+"/data/question-bank/p12-g03s2mid-approved-six-v1.json",{cache:"no-cache"});
  assert.equal(p12New.status(),200,"P12 approved six data accessible on Pages");
  const release=await p12New.json();
  assert.equal(release.expected_answer_slots,6);
  assert.equal(release.blocks.reduce((n,b)=>n+(b.type==="group"?b.items.length:1),0),6);
  assert.equal(release.blocks.find(x=>x.id==="P12_G03S2MID_COMPOSITE_010").items[0].answer,"④");
  const approval=await page.request.get(base+"/data/governance/p12-g03s2mid-six-operator-import-approval-v1.json",{cache:"no-cache"});
  assert.equal(approval.status(),200,"P12 operator approval evidence available");
  assert.equal((await approval.json()).approved_slot_count,6);
  const newBankResp=await page.request.get(base+"/data/question-bank/p12-g03s2mid-remaining51-public-v1.json",{cache:"no-cache"});
  const newApprovalResp=await page.request.get(base+"/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json",{cache:"no-cache"});
  assert.equal(newBankResp.status(),200,"51 public question data deployed");
  assert.equal(newApprovalResp.status(),200,"51 public approval data deployed");
  const remaining=await newBankResp.json(),approval51=await newApprovalResp.json();
  assert.equal(remaining.expected_answer_slots,51);
  assert.equal(remaining.blocks.length,27);
  assert.equal(approval51.approved_slot_count,51);
  assert.equal(remaining.blocks.reduce((n,b)=>n+(b.type==="group"?b.items.length:1),0),51);
  await page.selectOption("#grade","3");
  await page.selectOption("#semester","S2");
  await page.selectOption("#mode","single_kp");
  await page.selectOption("#unit","3-S2-U01");
  await page.selectOption("#kp","sci_g03s2_01_05");
  await page.fill("#count","1");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","new G03 S2 MID question can generate");
  assert.ok((await page.locator(".paper:not([data-answer='true'])").innerText()).includes("番茄"));
  const finalBankResponse=await page.request.get(base+"/data/question-bank/p12-g03s2final-46-public-v1.json",{cache:"no-cache"});
  const finalApprovalResponse=await page.request.get(base+"/data/governance/p12-g03s2final-46-operator-public-approval-v1.json",{cache:"no-cache"});
  assert.equal(finalBankResponse.status(),200,"new 46 final question bank deployed");
  assert.equal(finalApprovalResponse.status(),200,"new 46 operator public approval deployed");
  const public46=await finalBankResponse.json(),finalApproved=await finalApprovalResponse.json();
  assert.equal(public46.public_site_integrated,true);
  assert.equal(public46.expected_answer_slots,46);
  assert.equal(public46.blocks.length,28);
  assert.equal(public46.blocks.reduce((n,b)=>n+(b.type==="group"?b.items.length:1),0),46);
  assert.equal(finalApproved.approved_slot_count,46);
  assert.equal(finalApproved.expected_total_public_answer_slots,251);
  const fishbowl=public46.blocks.find(b=>b.id==="P12_G03S2FINAL_COMPOSITE_P03");
  assert.deepEqual(fishbowl.items.map(x=>x.answer),["O","X","X","O"]);
  assert.equal(fishbowl.figure_spec.labels[2],"曲面小魚缸");
  assert.equal(finalApproved.approved_items.find(x=>x.source_slot_id==="G03-S2-FINAL|COMPOSITE|P03|003").answer,"X");
  await page.selectOption("#grade","3");
  await page.selectOption("#semester","S2");
  await page.selectOption("#mode","single_kp");
  await page.selectOption("#unit","3-S2-U04");
  await page.selectOption("#kp","sci_g03s2_04_06");
  await page.fill("#count","4");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","deployed G03 final rain-gauge question group must generate");
  const svg=page.locator(".paper:not([data-answer='true']) .group svg.p12-figure-svg").first();
  assert.equal(await svg.count(),1,"curved-fishbowl figure group actually selected");
  assert.equal(await svg.getAttribute("preserveAspectRatio"),"xMidYMid meet");
  assert.ok((await svg.textContent()).includes("曲面小魚缸"));
  const dims=await svg.evaluate(x=>{const r=x.getBoundingClientRect();return {width:r.width,height:r.height,col:x.closest(".col")?.getBoundingClientRect().width}});
  assert.ok(dims.width>0&&dims.width<=dims.col+2&&Math.abs(dims.width/dims.height-460/236)<0.035,"live figure must be proportionally scaled "+JSON.stringify(dims));
  const answerText=await page.locator(".paper[data-answer='true']").innerText();
  assert.match(answerText,/3\. X/,"third source fishbowl must be marked X on answer page");
  await page.screenshot({path:"artifacts/deployed-browser/p12-g03s2final-46-fishbowl-live.png",fullPage:true});
  const screen=await page.screenshot({path:"artifacts/deployed-browser/p12-remaining51-live.png",fullPage:true});
  // R5 exact deployed 190-KP selector and source-safe nonduplicating KP overlays.
  const r5response=await page.request.get(base+"/data/authority/science-g03-g04-selector-v3.json",{cache:"no-cache"});
  assert.equal(r5response.status(),200,"R5 public 190-KP selector HTTP 200");
  const r5auth=await r5response.json();
  assert.equal(r5auth.counts.knowledge_points,190,"actual Pages serves V3, not cached legacy V2");
  assert.deepEqual(r5auth.units.filter(x=>x.grade===4&&x.semester===1).map(x=>x.knowledge_points.length),[12,14,10,12]);
  await page.selectOption("#grade","4");await page.selectOption("#semester","S1");
  await page.selectOption("#unit","4-S1-U01");await page.selectOption("#mode","single_kp");
  await page.selectOption("#kp","sci_g04s1_01_12");await page.fill("#count","4");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","live R5 wind KP must select four independently certified original source questions");
  const windPageText=await page.locator(".paper:not([data-answer='true'])").innerText();
  assert.ok(windPageText.includes("風吹砂"),"R5 wind KP retains existing Mingyi source");
  assert.ok(windPageText.includes("風力的作用與流水一樣"),"R5 wind KP adds source-exact Anhe TF4");
  assert.equal(await page.locator(".paper:not([data-answer='true']) .question").count(),4,"four independently certified wind KP sources: 2 legacy + 1 Native38 + 1 exact HN22");
   assert.ok(windPageText.includes("風會將沙或土壤搬到其他地方"),"native38 wind deposition original source remains selectable");
   assert.ok(windPageText.includes("下列哪一項不是改變地表樣貌的力量"),"HN22 Neian source originally printed wind/earth alteration source remains selectable");
  await page.selectOption("#unit","4-S1-U02");await page.selectOption("#mode","single_kp");
  await page.selectOption("#kp","sci_g04s1_02_13");await page.fill("#count","6");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","live R5 survey-record KP must select all six approved independent original sources");
   const surveyPaper=await page.locator(".paper:not([data-answer='true'])").innerText();
   assert.ok(surveyPaper.includes("哪些資料是進行水域環境調查"),"R5 survey KP preserves existing Heshun source");
   assert.ok(surveyPaper.includes("將水生動物適應環境的資料用圖形或表格整理時"),"R5 survey KP includes Dongguang exact TF002");
   assert.ok(surveyPaper.includes("如果想知道埤塘內有什麼水生生物"),"R5 survey KP includes Dongguang exact TF015");
   assert.ok(surveyPaper.includes("伊成在蒐集水生生物如何適應環境"),"B01 Wende survey KP adds independently operator-approved original TF014");
   assert.ok(surveyPaper.includes("進行水域環境調查時，可以帶圖鑑"),"B02 Minquan original survey equipment record source newly available");
   assert.ok(surveyPaper.includes("拜訪水域環境時，攜帶下列哪一物品可以幫助我們對照水生生物的資料"),"B04 Shihu original field guide source remains independently selectable");
   assert.equal(await page.locator(".paper:not([data-answer='true']) .question").count(),6,"six independent R5 survey original sources including B04 Shihu");
  await page.selectOption("#kp","sci_g04s1_02_14");await page.fill("#count","4");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","two Native38 original water-safety questions were explicitly certified and admitted");
  // Existing KP now contains multiple independent school sources; a 4-item randomized
  // selection is NOT guaranteed to contain specific source stems. Verify all four
  // immutable original source stems in their actual LIVE fetched school-bank assets
  // (native38 and B01), then separately verify the browser generated four items.
  assert.ok(native38.blocks.some(x=>x.canonical_kp_id==="sci_g04s1_02_14"&&x.stem.includes("捕捉了幾隻魚")),
    "actual Pages native38 keeps original Dadun water investigation item");
  assert.ok(native38.blocks.some(x=>x.canonical_kp_id==="sci_g04s1_02_14"&&x.stem.includes("不是保護水域環境的行為")),
    "actual Pages native38 keeps original Dadun water protection item");
  assert.ok(b01.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_001|S01|TF|015"
    &&x.canonical_kp_id==="sci_g04s1_02_14"&&x.stem.includes("為了讓水生生物能永續生存")),
    "actual Pages B01 keeps new Wende TF015");
  assert.ok(b01.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_001|S02|MC|011"
    &&x.canonical_kp_id==="sci_g04s1_02_14"&&x.stem.includes("愛護環境大家一起動起來")),
    "actual Pages B01 keeps new Wende MC011");
  assert.equal(await page.locator(".paper:not([data-answer='true']) .question").count(),4,
    "real Pages browser generates four valid water-safety questions from the expanded independently accepted pool");
  await page.screenshot({path:"artifacts/deployed-browser/r5-190kp-explicit-native38-water-safety-success.png",fullPage:true});
  const scan9resp=await page.request.get(base+"/data/question-bank/p12-e01-post45-puren2-public-v1.json",{cache:"no-cache"});
  assert.equal(scan9resp.status(),200,"actual Pages serves Scan9 2-source selective bank");
  const scan9bank=await scan9resp.json();
  assert.deepEqual(scan9bank.blocks.map(x=>x.source_slot_id),[
   "SCI_G04_S1_114_MID_009|S1|MC|013","SCI_G04_S1_114_MID_009|S3|G01|005"
  ]);
  assert.deepEqual(scan9bank.blocks.map(x=>x.answer),["④","X"]);
  assert.deepEqual(scan9bank.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_01_03","sci_g04s1_01_10"]);
  assert.ok(scan9bank.blocks.every(x=>x.original_cropped_assets_included===false));
  const science26Response=await page.request.get(base+"/data/question-bank/p12-e01-post43-sciencekp2-public-v1.json",{cache:"no-cache"});
  assert.equal(science26Response.status(),200,"Pages serves exact ScienceKP26 2-source selective file");
  const science26Blocks=(await science26Response.json()).blocks;
  assert.deepEqual(science26Blocks.map(x=>x.source_slot_id),[
    "SCI_G04_S1_114_MID_008|S01|TF|004",
    "SCI_G04_S1_114_FINAL_008|S01|TF|005"
  ]);
  assert.deepEqual(science26Blocks.map(x=>x.answer),["O","X"]);
  assert.deepEqual(science26Blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_05","sci_g04s1_03_10"]);
  assert.ok(science26Blocks.every(x=>!x.original_cropped_assets_included));
  const scan6Resp=await page.request.get(base+"/data/question-bank/p12-e01-post41-scansecondary2-public-v1.json",{cache:"no-cache"});
  assert.equal(scan6Resp.status(),200,"new ScanSecondary6 original school data served");
  const scan6Blocks=(await scan6Resp.json()).blocks;
  assert.deepEqual(scan6Blocks.map(x=>x.source_slot_id),["SCI_G04_S1_114_MID_002|S2|TF|013","SCI_G04_S1_114_FINAL_002|S1|TF|011"]);
  assert.deepEqual(scan6Blocks.map(x=>x.answer),["X","X"]);
  assert.deepEqual(scan6Blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_06","sci_g04s1_04_08"]);
  assert.ok(scan6Blocks.every(x=>!x.original_cropped_assets_included));
  console.log("PUBLIC_GITHUB_PAGES_LIVE_EXAM_PASS; B08 Chenggong two original parents and seven MCs LIVE; 959 answer slots (476 TF, 341 MC, 38 context groups)");
} catch(e) {
  console.error("PUBLIC_GITHUB_PAGES_LIVE_EXAM_FAILED:",e);
  throw e;
} finally {
  await browser?.close();
}
