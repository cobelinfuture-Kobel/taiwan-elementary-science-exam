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
  await page.goto("http://127.0.0.1:" + server.address().port + "/exam/", { waitUntil: "networkidle" });
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
  const statusPage=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  statusPage.on("pageerror",err=>errors.push(String(err)));
  await statusPage.goto("http://127.0.0.1:" + server.address().port + "/review/",{waitUntil:"networkidle"});
  await statusPage.waitForFunction(()=>document.querySelector("#candidates")?.textContent==="40",{timeout:15000});
  assert.deepEqual(await Promise.all(["sources","candidates","mapped","unresolved","answers","admitted"].map(id=>statusPage.locator("#"+id).textContent())),["4","40","36","4","0","0"]);
  assert.equal(await statusPage.locator("#table tr").count(),4,"all four source scopes must be visible");
  assert.deepEqual(errors,[],"no browser JS errors on S3 metadata dashboard");
  await statusPage.screenshot({path:output+"/s3-status-dashboard.png",fullPage:true});
  await statusPage.close();
  console.log("S3_PUBLIC_METADATA_DASHBOARD_PASS: 4 sources, 40 candidates, 0 admitted");
  console.log("BROWSER_LAYOUT_PASS=" + JSON.stringify({ screen, print }, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
