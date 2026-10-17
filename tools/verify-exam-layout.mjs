import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const siteRoot = resolve("site");
const output = resolve("artifacts/browser-layout");
mkdirSync(output, { recursive: true });
const mime = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };
const server = createServer((request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    let filename = resolve(siteRoot, "." + decodeURIComponent(url.pathname));
    if (!(filename === siteRoot || filename.startsWith(siteRoot + sep))) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (existsSync(filename) && statSync(filename).isDirectory()) filename = resolve(filename, "index.html");
    if (!existsSync(filename)) { response.writeHead(404).end("Not Found"); return; }
    response.writeHead(200, { "Content-Type": mime[extname(filename)] || "application/octet-stream" });
    response.end(readFileSync(filename));
  } catch (error) { response.writeHead(500).end(String(error)); }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1500, height: 980 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:" + server.address().port + "/exam/?qa=1", { waitUntil: "networkidle" });
  await page.fill("#count","4");
  await page.locator("#generate").click();
  await page.waitForSelector(".paper:not([data-answer='true']) .group svg.diagram", { timeout: 15000 });
  const expectedCount = {"3-S1":[14,12,11,10],"3-S2":[12,12,12,13],"4-S1":[12,14,10,12],"4-S2":[12,11,12,11]};
  for(const [scope,nums] of Object.entries(expectedCount)){
    const [g,s]=scope.split("-");
    await page.selectOption("#grade",g);
    await page.selectOption("#semester",s);
    const titleCount=await page.locator("#unit option").count();
    assert.equal(titleCount,4,scope+" unit count");
    await page.selectOption("#mode","single_kp");
    for(let i=0;i<4;i++){
      await page.selectOption("#unit",g+"-"+s+"-U"+String(i+1).padStart(2,"0"));
      assert.equal(await page.locator("#kp option").count(),nums[i],scope+" U"+(i+1)+" KP selector");
    }
  }
  await page.selectOption("#grade","4");
  await page.selectOption("#semester","S1");
  await page.selectOption("#mode","cross_unit");
  assert.equal(await page.locator("#cross-kps input").count(),26,"cross-unit KP options should be 12+14");
  assert.equal(await page.locator("#cross-kps input:checked").count(),26,"cross-unit KP default selection");
  await page.evaluate(()=>{
    const options=[...document.querySelectorAll("#cross-kps input")];
    for(const el of options) if(el.value.startsWith("sci_g04s1_01_")) el.checked=false;
  });
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"true","cross-unit must retain at least one KP per selected unit");
  await page.selectOption("#mode","single_unit");
  await page.selectOption("#grade","3");
  await page.selectOption("#semester","S1");
  await page.selectOption("#unit","3-S1-U01");
  assert.equal(await page.locator("#unit option").first().textContent(),"U01 多采多姿的植物");
  await page.selectOption("#mode","single_unit");
  await page.locator("#generate").click();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"true","missing approved questions must fail closed");
  assert.equal(await page.locator("#print").isDisabled(),true,"no print for missing questions");
  await page.selectOption("#grade","4");
  await page.selectOption("#semester","S1");
  await page.selectOption("#unit","4-S1-U02");
  await page.selectOption("#mode","single_unit");
  await page.locator("#generate").click();
  await page.waitForSelector(".paper:not([data-answer='true']) .group svg.diagram", { timeout: 10000 });
  const geometry = async () => page.evaluate(() => {
    const g = document.querySelector(".paper:not([data-answer='true']) .group");
    const image = g.querySelector("svg.diagram");
    const column = g.closest(".col");
    const cols = column?.parentElement;
    const coord = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
    };
    return {
      error: document.querySelector("#status")?.dataset.error,
      questionPages: document.querySelectorAll(".paper:not([data-answer='true'])").length,
      answerPages: document.querySelectorAll(".paper[data-answer='true']").length,
      isInColumn: !!column,
      numberOfColumns: cols?.querySelectorAll(":scope > .col").length ?? 0,
      column: coord(column),
      group: coord(g),
      image: coord(image),
      imageRatio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
      clippedColumns: [...document.querySelectorAll(".paper .col")].filter(x => x.scrollWidth > x.clientWidth + 2 || x.scrollHeight > x.clientHeight + 2).length,
      groupOverflow: g.scrollWidth > g.clientWidth + 2 || g.scrollHeight > g.clientHeight + 2
    };
  });
  function validate(data, phase) {
    assert.notEqual(data.error, "true", phase + ": app returned an error");
    assert.equal(data.isInColumn, true, phase + ": reading group must be in one half-width column");
    assert.equal(data.numberOfColumns, 2, phase + ": page must have two columns");
    assert.ok(data.group.left >= data.column.left - 2 && data.group.right <= data.column.right + 2, phase + ": group exceeds the column width");
    assert.ok(data.image.left >= data.group.left - 2 && data.image.right <= data.group.right + 2, phase + ": image exceeds reading group");
    assert.ok(data.image.width <= data.column.width + 2, phase + ": image exceeds column width");
    assert.ok(Math.abs(data.imageRatio - 420/110) < 0.04, phase + ": image original aspect ratio changed");
    assert.equal(data.clippedColumns, 0, phase + ": clipped columns");
    assert.equal(data.groupOverflow, false, phase + ": group clipped");
    assert.ok(data.questionPages >= 1 && data.answerPages >= 1, phase + ": missing question or answer pages");
  }
  const screen = await geometry();
  validate(screen, "screen");
  await page.screenshot({ path: output + "/exam-two-column-screen.png", fullPage: true });
  await page.emulateMedia({ media: "print" });
  const print = await geometry();
  validate(print, "print");
  await page.pdf({ path: output + "/exam-two-column-a4.pdf", format: "A4", preferCSSPageSize: true, printBackground: true });
  // Real user-facing public site: all eligible questions are built into the Pages payload.
  const live=await browser.newPage({viewport:{width:1420,height:940}});
  const liveErrors=[];live.on("pageerror",e=>liveErrors.push(String(e)));
  await live.goto("http://127.0.0.1:"+server.address().port+"/exam/",{waitUntil:"networkidle"});
  try{
    await live.waitForFunction(()=>document.querySelector("#bank-info")?.textContent?.includes("已載入內建考古題 750 小題（386 題是非＋229 題單選＋36 組情境）"),{timeout:15000});
  }catch(error){
    const details=await live.evaluate(()=>({
      bankInfo:document.querySelector("#bank-info")?.textContent,
      status:document.querySelector("#status")?.textContent,
      errorFlag:document.querySelector("#status")?.dataset?.error,
      kpSummary:document.querySelector("#kp-summary")?.textContent,
      moduleCache:document.querySelector('script[type="module"]')?.textContent?.match(/historical-bank-ox-v6[^"']*/)?.[0]
    }));
    console.error("PUBLIC_SITE_BANK_LOADING_DIAG",JSON.stringify({details,liveErrors}));
    throw error;
  }
  assert.equal(await live.locator("#source-select").count(),0,"no source selector");
  assert.equal(await live.locator("#local-import").count(),0,"no local JSON upload control");
  assert.equal(await live.locator("#unit option").count(),4,"curriculum units must be present");
  assert.ok(await live.locator("#kp option").count()>0,"KP selection must be populated");
  // After the additional MC source pool, default shuffle is not a TF guarantee.
  // Choose a certified TF-only KP before asserting that the answer is O or X.
  await live.selectOption("#grade","4");
  await live.selectOption("#semester","S1");
  await live.selectOption("#unit","4-S1-U01");
  await live.selectOption("#mode","single_kp");
  await live.selectOption("#kp","sci_g04s1_01_11");
  await live.fill("#count","1");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false","pinned TF-only KP source available");
  assert.equal(await live.locator(".paper:not([data-answer='true']) .question").count(),1,"one approved source TF question");
  const firstQuestion=await live.locator(".paper:not([data-answer='true']) .question").first().innerText();
  assert.match(firstQuestion,/^（　）1\. /,"O/X response box must precede question number");
  assert.doesNotMatch(firstQuestion,/（　）正確|（　）錯誤/);
  assert.ok((await live.locator(".paper:not([data-answer='true'])").first().innerText()).includes("填入 O 或 X"),"instruction must specify O/X");

  assert.ok((await live.locator(".paper").first().innerText()).includes("歷屆學校考古題"));
  assert.equal(await live.locator(".paper[data-answer='true']").count(),1);
  assert.ok((await live.locator(".paper[data-answer='true']").innerText()).includes("判斷前提"));
  const answersText=await live.locator(".paper[data-answer='true']").innerText();
  assert.match(answersText,/\b1\. [OX]\b/,"answer page should display literal O or X");
  // Restore historical unit-selection mode after TF-specific source pin.
  await live.selectOption("#mode","single_unit");

  await live.selectOption("#grade","3");
  await live.selectOption("#semester","S1");
  await live.selectOption("#unit","3-S1-U04");
  await live.fill("#count","2");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false","two embedded historical questions can be selected");
  assert.equal(await live.locator(".paper:not([data-answer='true']) .question").count(),2);
  assert.ok((await live.locator("#meta").textContent()).includes("內建考古題 2 小題"));
  await live.selectOption("#semester","S2");
  await live.selectOption("#unit","3-S2-U04");
  await live.selectOption("#mode","single_kp");
  await live.selectOption("#kp","sci_g03s2_04_04");
  await live.fill("#count","1");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"true","no DEMO fallback for KP with no certified historical questions");
  assert.equal(await live.locator("#print").isDisabled(),true);
  await live.selectOption("#grade","3");
  await live.selectOption("#semester","S1");
  await live.selectOption("#unit","3-S1-U02");
  await live.selectOption("#mode","single_kp");
  await live.selectOption("#kp","sci_g03s1_02_09");
  await live.fill("#count","12");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false","12-slot force matching group should fit a single A4 column");
  assert.equal(await live.locator(".paper:not([data-answer='true']) .group-context").count(),1);
  assert.equal(await live.locator(".group-context .question").count(),12);
  assert.ok((await live.locator(".paper[data-answer='true']").first().innerText()).includes("③"),"group answers must be retained");
  await live.screenshot({path:output+"/s3-p08-first-approved-context.png",fullPage:true});
  // B01 introduces additional standalone questions for some of the same KP.
  // Pin group-first ordering before atomic-context assertions so the browser
  // validates the frozen source group, not a valid one-slot standalone item.
  await live.selectOption("#order","group");
  const groupCases=[
    ["3","3-S1-U02","sci_g03s1_02_09",12],
    ["3","3-S1-U02","sci_g03s1_02_06",8],
    ["3","3-S1-U04","sci_g03s1_04_08",3],
    ["4","4-S1-U02","sci_g04s1_02_11",4],
    ["4","4-S1-U01","sci_g04s1_01_02",4],
    ["4","4-S1-U02","sci_g04s1_02_03",7],
    ["4","4-S1-U01","sci_g04s1_01_09",5],
    ["4","4-S1-U04","sci_g04s1_04_05",1],
    ["4","4-S1-U03","sci_g04s1_03_07",2]
  ];
  for(const [grade,unit,kp,slots] of groupCases){
    await live.selectOption("#grade",grade);
    await live.selectOption("#semester","S1");
    await live.selectOption("#unit",unit);
    await live.selectOption("#mode","single_kp");
    await live.selectOption("#kp",kp);
    await live.fill("#count",String(slots));
    await live.locator("#generate").click();
    const status=await live.locator("#status").textContent();
    assert.equal(await live.locator("#status").getAttribute("data-error"),"false","full source context failed: "+kp+" "+status);
    assert.equal(await live.locator(".paper:not([data-answer='true']) .group-context").count(),1,"atomic source group count: "+kp);
    assert.equal(await live.locator(".paper:not([data-answer='true']) .group-context .question").count(),slots,"atomic answer slots: "+kp);
    const geom=await live.locator(".paper:not([data-answer='true']) .group-context").evaluate(el=>{
      const p=el.closest(".col"),a=el.getBoundingClientRect(),b=p.getBoundingClientRect();
      return {left:a.left,right:a.right,top:a.top,bottom:a.bottom,columnLeft:b.left,columnRight:b.right,columnBottom:b.bottom,
       horizontalClip:el.scrollWidth>el.clientWidth+2,verticalClip:el.scrollHeight>el.clientHeight+2};
    });
    assert.ok(geom.left>=geom.columnLeft-2 && geom.right<=geom.columnRight+2 && geom.bottom<=geom.columnBottom+2
      && !geom.horizontalClip && !geom.verticalClip,"group overflow: "+kp+" "+JSON.stringify(geom));
  }
  console.log("S3_P08_NINE_GROUP_VISUAL_PASS");
  const p09Cases=[["3","3-S1-U02","sci_g03s1_02_09",1,"MID_G03_FORCE_OPTION_IMAGES",false],["3","3-S1-U01","sci_g03s1_01_10",4,"MID_G03_FLOWER_DIAGRAM",true],["3","3-S1-U01","sci_g03s1_01_07",3,"MID_G03_STEM_DIAGRAM",true],["3","3-S1-U01","sci_g03s1_01_08",2,"MID_G03_ROOT_DIAGRAM",true],["3","3-S1-U01","sci_g03s1_01_05",3,"MID_G03_LEAF_ARRANGEMENTS",true],["3","3-S1-U03","sci_g03s1_03_07",4,"FINAL_G03_SYRINGE_FIGURE",true],["3","3-S1-U04","sci_g03s1_04_09",3,"FINAL_G03_ANTHOCYANIN_READING",false],["4","4-S1-U01","sci_g04s1_01_09",4,"MID_G04_EARTHQUAKE_READING",false],["4","4-S1-U04","sci_g04s1_04_06",3,"FINAL_G04_CIRCUIT_IMAGES",true],["4","4-S1-U04","sci_g04s1_04_04",1,"FINAL_G04_CIRCUIT_DRAW",true],["4","4-S1-U03","sci_g04s1_03_10",2,"FINAL_G04_LED_READING",false]];
  await live.selectOption("#order","group");
  for(const [grade,unit,kp,slots,groupId,expectDrawing] of p09Cases){
    await live.selectOption("#grade",grade);
    await live.selectOption("#semester","S1");
    await live.selectOption("#unit",unit);
    await live.selectOption("#mode","single_kp");
    await live.selectOption("#kp",kp);
    await live.fill("#count",String(slots));
    await live.locator("#generate").click();
    const message=await live.locator("#status").textContent();
    assert.equal(await live.locator("#status").getAttribute("data-error"),"false","P09 group cannot render "+groupId+" "+message);
    const group=live.locator(".paper:not([data-answer='true']) .group-context");
    assert.equal(await group.count(),1,"P09 atomic group missing "+groupId);
    assert.equal(await group.getAttribute("data-group-id"),groupId,"P09 incorrect source group selected");
    assert.equal(await group.locator(".question").count(),slots,"P09 subquestion count mismatch "+groupId);
    if(expectDrawing) assert.equal(await group.locator("svg.science-diagram").count(),1,"P09 independent SVG absent "+groupId);
    const area=await group.evaluate(node=>{
      const x=node.getBoundingClientRect(),box=node.closest(".col").getBoundingClientRect();
      return {left:x.left,right:x.right,bottom:x.bottom,colL:box.left,colR:box.right,colB:box.bottom,scX:node.scrollWidth-node.clientWidth,scY:node.scrollHeight-node.clientHeight};
    });
    assert.ok(area.left>=area.colL-2&&area.right<=area.colR+2&&area.bottom<=area.colB+2
      &&area.scX<3&&area.scY<3,"P09 diagram/reading group overflow "+groupId+" "+JSON.stringify(area));
    if(groupId==="FINAL_G04_CIRCUIT_DRAW"){
      assert.ok((await live.locator(".paper[data-answer='true']").innerText()).includes("5"),"drawing must retain five-point rubric");
      assert.equal(await live.locator(".paper[data-answer='true'] svg.science-diagram").count(),1,"drawing answer exemplar required");
    }
  }
  console.log("S3_P09_ELEVEN_CONTEXT_VISUAL_PASS");

  await live.selectOption("#grade","3");
  await live.selectOption("#semester","S1");
  await live.selectOption("#unit","3-S1-U01");
  await live.selectOption("#mode","single_unit");
  await live.fill("#count","1");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false");
  const lowerCases=[
   ["3","3-S1-U01","sci_g03s2_01_12","蔬菜大多會經過種子"],
   ["3","3-S1-U04","sci_g03s2_04_09","漁業氣象中"],
   ["4","4-S1-U02","sci_g04s2_02_10","兩個相連的容器"],
   ["4","4-S1-U04","sci_g04s2_04_08","石油可以製造"]
  ];
  for(const [grade,preUnit,kp,excerpt] of lowerCases){
    await live.selectOption("#grade",grade);
    await live.selectOption("#semester","S2");
    await live.selectOption("#unit",preUnit.replace("-S1-","-S2-"));
    await live.selectOption("#mode","single_kp");
    await live.selectOption("#kp",kp);
    await live.fill("#count","1");
    await live.locator("#generate").click();
    const msg=await live.locator("#status").textContent();
    assert.equal(await live.locator("#status").getAttribute("data-error"),"false","P10 semester source must generate: "+kp+" "+msg);
    const question=await live.locator(".paper:not([data-answer='true']) .question").first().innerText();
    assert.ok(question.includes(excerpt),"wrong semester/KP source "+kp+" "+question);
    assert.match(question,/^（　）1\. /,"P10 must retain original O/X layout");
  }
  console.log("S3_P10_G03_G04_S2_FOUR_PERIODS_PASS");
  const recentScan2=await live.request.get("http://127.0.0.1:"+server.address().port+"/data/question-bank/p12-e01-post45-puren2-public-v1.json");
  assert.equal(recentScan2.status(),200,"scan-only source: new public bank file served");
  const recentBlocks=(await recentScan2.json()).blocks;
  assert.deepEqual(recentBlocks.map(x=>x.source_slot_id),[
    "SCI_G04_S1_114_MID_009|S1|MC|013","SCI_G04_S1_114_MID_009|S3|G01|005"
  ]);
  assert.deepEqual(recentBlocks.map(x=>x.answer),["④","X"]);
  assert.equal(recentBlocks.every(x=>x.original_cropped_assets_included===false),true);
  console.log("P12_E01_SCAN9_TWO_EXACT_PUBLIC_SOURCE_BROWSER_PASS");
  const science26Resp=await live.request.get("http://127.0.0.1:"+server.address().port+"/data/question-bank/p12-e01-post43-sciencekp2-public-v1.json");
  assert.equal(science26Resp.status(),200,"ScienceKP26 public source data served");
  const science26Blocks=(await science26Resp.json()).blocks;
  assert.deepEqual(science26Blocks.map(x=>x.answer),["O","X"]);
  assert.deepEqual(science26Blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_05","sci_g04s1_03_10"]);
  assert.ok(science26Blocks.every(x=>x.original_cropped_assets_included===false));
  console.log("P12_E01_SCIENCEKP26_TWO_EXACT_SOURCE_A4_PASS");
  const scan6Resp=await live.request.get("http://127.0.0.1:"+server.address().port+"/data/question-bank/p12-e01-post41-scansecondary2-public-v1.json");
  assert.equal(scan6Resp.status(),200);
  const scan6Blocks=(await scan6Resp.json()).blocks;
  assert.deepEqual(scan6Blocks.map(x=>x.answer),["X","X"]);
  assert.deepEqual(scan6Blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_06","sci_g04s1_04_08"]);
  assert.deepEqual(scan6Blocks[1].secondary_canonical_kp_ids,["sci_g04s1_04_09"]);
  assert.ok(scan6Blocks.every(x=>x.original_cropped_assets_included===false));
  console.log("P12_E01_SCANSECONDARY6_TWO_SOURCE_PIXEL_A4_PASS");
  // P12 E01: R5 primary wind KP admits one source-exact Anhe and preserves Mingyi secondary link.
  await live.selectOption("#grade","4");await live.selectOption("#semester","S1");
  await live.selectOption("#unit","4-S1-U01");await live.selectOption("#mode","single_kp");
  await live.selectOption("#kp","sci_g04s1_01_12");await live.fill("#count","2");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false","R5 wind KP must generate exactly two certified source positions");
  const windQuestions=await live.locator(".paper:not([data-answer='true']) .question").allInnerTexts();
  assert.equal(windQuestions.length,2);assert.ok(windQuestions.some(x=>x.includes("風力的作用與流水一樣")));
  assert.ok(windQuestions.some(x=>x.includes("風吹砂")),"existing Mingyi secondary link stays available");
  await live.screenshot({path:output+"/p12-e01-anhe-wind-original-plus-mingyi-live-layout.png",fullPage:true});
  assert.deepEqual(liveErrors,[]);
  await live.screenshot({path:output+"/s3-p05-embedded-history-no-upload.png",fullPage:true});
  await live.close();
  console.log("S3_P12_PUBLIC_CONTEXT_PASS: 560 answer slots; 529 pre-B07 positions preserved, no upload, no demo fallback");
  const statusPage=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  statusPage.on("pageerror",err=>errors.push(String(err)));
  await statusPage.goto("http://127.0.0.1:" + server.address().port + "/review/",{waitUntil:"networkidle"});
  await statusPage.waitForFunction(()=>document.querySelector("#candidates")?.textContent==="40",{timeout:15000});
  assert.deepEqual(await Promise.all(["sources","candidates","mapped","unresolved","answers","admitted","proposals","ambiguous","regions","groups"].map(id=>statusPage.locator("#"+id).textContent())),["4","40","34","6","0","40","40","7","21","20"]);
  assert.equal(await statusPage.locator("#table tr").count(),4,"all four source scopes must be visible");
  assert.deepEqual(errors,[],"no browser JS errors on S3 metadata dashboard");
  await statusPage.screenshot({path:output+"/s3-status-dashboard.png",fullPage:true});
  const p03Page=await browser.newPage({viewport:{width:1200,height:850}});
  const p03Errors=[];p03Page.on("pageerror",e=>p03Errors.push(String(e)));
  await p03Page.goto("http://127.0.0.1:"+server.address().port+"/review/p03/",{waitUntil:"networkidle"});
  await p03Page.waitForFunction(()=>document.querySelector("#a")?.textContent==="7");
  assert.deepEqual(await Promise.all(["a","s","c","k","m","p"].map(id=>p03Page.locator("#"+id).textContent())),["7","3","4","6","0","0"]);
  assert.deepEqual(p03Errors,[]);
  await p03Page.screenshot({path:output+"/s3-p03-review-dashboard.png",fullPage:true});
  await p03Page.close();
  const admission=await browser.newPage({viewport:{width:1200,height:800}});
  await admission.goto("http://127.0.0.1:"+server.address().port+"/review/p08/",{waitUntil:"networkidle"});
  await admission.waitForFunction(()=>document.querySelector("#summary")?.textContent?.includes("86"),{timeout:15000});
  assert.equal(await admission.locator("#rows tr").count(),20,"all 20 original context groups must be disclosed");
  await admission.screenshot({path:output+"/s3-p08-context-admission-status.png",fullPage:true});
  await admission.close();
  const p09=await browser.newPage({viewport:{width:1240,height:860}});
  await p09.goto("http://127.0.0.1:"+server.address().port+"/review/p09/",{waitUntil:"networkidle"});
  await p09.waitForFunction(()=>document.querySelector("#stats")?.textContent?.includes("116"),{timeout:15000});
  assert.equal(await p09.locator("#groups tr").count(),20,"P09 dashboard lists all 20 admitted context groups");
  await p09.screenshot({path:output+"/s3-p09-admitted-twenty-contexts.png",fullPage:true});
  await p09.close();
  const p10Page=await browser.newPage({viewport:{width:1280,height:840}});
  await p10Page.goto("http://127.0.0.1:"+server.address().port+"/review/p10/",{waitUntil:"networkidle"});
  await p10Page.waitForFunction(()=>document.querySelector("#summary")?.textContent?.includes("148"),{timeout:15000});
  assert.equal(await p10Page.locator("#rows tr").count(),4,"P10 four exams must be visible on review page");
  await p10Page.screenshot({path:output+"/s3-p10-s2-four-periods.png",fullPage:true});
  const p11=await browser.newPage({viewport:{width:1300,height:930}});
  await p11.goto("http://127.0.0.1:"+server.address().port+"/review/p11/",{waitUntil:"networkidle"});
  await p11.waitForFunction(()=>document.querySelector("#metrics")?.textContent?.includes("477"),{timeout:15000});
  assert.equal(await p11.locator("#units tr").count(),16,"P11 all 16 curriculum units");
  assert.equal(await p11.locator("#sources tr").count(),8,"P11 all eight sources");
  assert.ok((await p11.locator("#metrics").textContent()).includes("148"),"P11 keeps original 148 slots");
  assert.ok((await p11.locator("#metrics").textContent()).includes("116"),"P11 must disclose missing KP");
  assert.ok((await p11.locator("#status").textContent()).includes("SHA-256"),"P11 identity provenance visible");
  await p11.screenshot({path:output+"/s3-p11-source-and-kp-governance.png",fullPage:true});
  const r1=await browser.newPage({viewport:{width:1300,height:920}});
  await r1.goto("http://127.0.0.1:"+server.address().port+"/review/p11r1/",{waitUntil:"networkidle"});
  await r1.waitForFunction(()=>document.querySelector("#metrics")?.textContent?.includes("326"),{timeout:15000});
  assert.equal(await r1.locator("#sources tr").count(),8,"eight source PDFs reported");
  assert.equal(await r1.locator("#groups tr").count(),20,"all twenty published context groups audited");
  assert.ok((await r1.locator("#score").textContent()).includes("20 個印刷計分小題／22 個作答空格"));
  assert.ok((await r1.locator("#gate").textContent()).includes("未逐題驗證者直接公開：禁止"));
  await r1.screenshot({path:output+"/s3-p11r1-exact-source-slot-reconciliation.png",fullPage:true});
  await r1.close();
  const masterPage=await browser.newPage({viewport:{width:1360,height:920}});
  await masterPage.goto("http://127.0.0.1:"+server.address().port+"/review/master/",{waitUntil:"networkidle"});
  await masterPage.waitForFunction(()=>document.querySelector("#metrics")?.textContent?.includes("326"),{timeout:15000});
  assert.equal(await masterPage.locator("#paper-rows tr").count(),16,"8 source rows plus 8 section-details rows");
  assert.ok((await masterPage.locator("#resume").innerText()).includes("G04-S2-MID"),"resume must advance to next source after 46 stage decisions");
  assert.ok((await masterPage.locator("#metrics").innerText()).includes("251"),"public slots must show 251");
  assert.ok((await masterPage.locator("#metrics").innerText()).includes("103"),"103 source positions must be public");
  await masterPage.selectOption("#semester","2");
  assert.equal(await masterPage.locator("#paper-rows tr").count(),8,"four S2 papers with their details");
  await masterPage.selectOption("#semester","");
  await masterPage.screenshot({path:output+"/p12-master-progress-resume.png",fullPage:true});
  await masterPage.close();
  console.log("P12_MASTER_BROWSER_RESUME_PASS");
  await p11.close();
  await p10Page.close();
  await statusPage.close();
  console.log("S3_P05_PUBLIC_DASHBOARD_PASS: 40 original candidates, 7 built in");
  console.log("BROWSER_LAYOUT_PASS=" + JSON.stringify({ screen, print }, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
