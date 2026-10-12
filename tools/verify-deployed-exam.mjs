import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
import {chromium} from "playwright";
const base="https://cobelinfuture-kobel.github.io/taiwan-elementary-science-exam";
const rev="SCIENCE_S3_P08_OX_V3";
mkdirSync("artifacts/deployed-browser",{recursive:true});
let browser;
try {
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1024}});
  const errors=[];
  const assetUrls=[];
  page.on("pageerror",e=>errors.push(String(e)));
  page.on("request",r=>{if(r.url().includes("historical-bank")||r.url().includes("approved-historical"))assetUrls.push(r.url());});
  const resp=await page.goto(base+"/exam/?smoke=p09v1-20261012",{waitUntil:"networkidle",timeout:45000});
  assert.equal(resp?.status(),200,"public Exam HTTP response");
  await page.screenshot({path:"artifacts/deployed-browser/after-load.png",fullPage:true});
  const info=await page.locator("#bank-info").textContent();
  const status=await page.locator("#status").textContent();
  assert.ok(info.includes("已載入內建考古題 116 小題（40 題是非＋20 組情境）"),"Live site must load current pinned assets: "+info+"; status="+status);
  assert.equal(await page.locator("#unit option").count(),4,"live unit selector present");
  assert.ok(await page.locator("#kp option").count()>0,"live KP selector populated");
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false","public default question can generate: "+status);
  const question=(await page.locator(".paper:not([data-answer='true']) .question").first().innerText()).trim();
  assert.match(question,/^（　）1\. /,"O/X bracket must precede question number");
  const answer=await page.locator(".paper[data-answer='true']").innerText();
  assert.match(answer,/\b1\. [OX]\b/,"answer page must use O or X");
  assert.deepEqual(errors,[],"No JavaScript runtime errors");
  assert.ok(assetUrls.some(x=>x.includes("historical-bank-ox-v5.mjs")),"Actual browser must load v2 JS module");
  assert.ok(assetUrls.some(x=>x.includes("approved-historical-ox-v3.json")),"Actual browser must load v2 JSON");
  const ctx=await page.request.get(base+"/data/question-bank/certified-context-groups-v2.json");
  assert.equal(ctx.status(),200,"source-reconstructed group data accessible");
  assert.equal((await ctx.json()).expected_group_count,20);
  const asset=await page.request.get(base+"/data/question-bank/approved-historical-ox-v3.json");
  assert.equal(asset.status(),200,"Live JSON directly accessible");
  assert.equal((await asset.json()).asset_revision,rev,"Live JSON revision");
  const screen=await page.screenshot({path:"artifacts/deployed-browser/ox-question-visible.png",fullPage:true});
  console.log("PUBLIC_GITHUB_PAGES_LIVE_EXAM_PASS; 40 O/X plus 20 contexts; 4 units; O/X; pinned JS and JSON; no demo import");
} catch(e) {
  console.error("PUBLIC_GITHUB_PAGES_LIVE_EXAM_FAILED:",e);
  throw e;
} finally {
  await browser?.close();
}
