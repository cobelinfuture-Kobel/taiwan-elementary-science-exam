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
  const expectedCount = {"3-S1":[14,12,11,10],"3-S2":[12,12,12,13],"4-S1":[11,12,10,12],"4-S2":[12,11,12,11]};
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
  assert.equal(await page.locator("#cross-kps input").count(),23,"cross-unit KP options should be 11+12");
  assert.equal(await page.locator("#cross-kps input:checked").count(),23,"cross-unit KP default selection");
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
  await live.waitForFunction(()=>document.querySelector("#bank-info")?.textContent?.includes("已載入內建考古題 86 小題（40 題是非＋9 組情境）"),{timeout:15000});
  assert.equal(await live.locator("#source-select").count(),0,"no source selector");
  assert.equal(await live.locator("#local-import").count(),0,"no local JSON upload control");
  assert.equal(await live.locator("#unit option").count(),4,"curriculum units must be present");
  assert.ok(await live.locator("#kp option").count()>0,"KP selection must be populated");
  assert.equal(await live.locator(".paper:not([data-answer='true']) .question").count(),1,"one approved question at default setting");
  const firstQuestion=await live.locator(".paper:not([data-answer='true']) .question").first().innerText();
  assert.match(firstQuestion,/^（　）1\. /,"O/X response box must precede question number");
  assert.doesNotMatch(firstQuestion,/（　）正確|（　）錯誤/);
  assert.ok((await live.locator(".paper:not([data-answer='true'])").first().innerText()).includes("填入 O 或 X"),"instruction must specify O/X");

  assert.ok((await live.locator(".paper").first().innerText()).includes("歷屆學校考古題"));
  assert.equal(await live.locator(".paper[data-answer='true']").count(),1);
  assert.ok((await live.locator(".paper[data-answer='true']").innerText()).includes("判斷前提"));
  const answersText=await live.locator(".paper[data-answer='true']").innerText();
  assert.match(answersText,/\b1\. [OX]\b/,"answer page should display literal O or X");

  await live.selectOption("#grade","3");
  await live.selectOption("#semester","S1");
  await live.selectOption("#unit","3-S1-U04");
  await live.fill("#count","2");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false","two embedded historical questions can be selected");
  assert.equal(await live.locator(".paper:not([data-answer='true']) .question").count(),2);
  assert.ok((await live.locator("#meta").textContent()).includes("內建考古題 2 小題"));
  await live.selectOption("#semester","S2");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"true","no DEMO fallback for semesters without approved questions");
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
  await live.selectOption("#unit","3-S1-U01");
  await live.selectOption("#mode","single_unit");
  await live.fill("#count","1");
  await live.locator("#generate").click();
  assert.equal(await live.locator("#status").getAttribute("data-error"),"false");
  assert.deepEqual(liveErrors,[]);
  await live.screenshot({path:output+"/s3-p05-embedded-history-no-upload.png",fullPage:true});
  await live.close();
  console.log("S3_P08_PUBLIC_CONTEXT_PASS: 40 OX plus nine groups and 46 slots, no upload, no demo fallback");
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
  await statusPage.close();
  console.log("S3_P05_PUBLIC_DASHBOARD_PASS: 40 original candidates, 7 built in");
  console.log("BROWSER_LAYOUT_PASS=" + JSON.stringify({ screen, print }, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
