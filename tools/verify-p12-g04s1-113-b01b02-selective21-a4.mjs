import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFileSync,existsSync,statSync,mkdirSync,writeFileSync} from "node:fs";
import {resolve,sep,extname} from "node:path";
import {chromium} from "playwright";

const data=JSON.parse(readFileSync("site/data/question-bank/p12-g04s1-113-b01b02-selective21-prepublication-candidate-v1.json","utf8"));
const gate=JSON.parse(readFileSync("site/data/question-bank/p12-g04s1-113-b01b02-selective21-operator-release-gate-v1.json","utf8"));
assert.equal(data.source_slots_total,38);
assert.equal(data.student_answer_slots_proposed,21);
assert.equal(data.blocks.length,16);
assert.equal(data.public_site_integrated,false);
assert.equal(gate.public_student_release_allowed,false);
assert.equal(gate.exact_operator_source_roster_approval,false);

const root=resolve("site"),out=resolve("artifacts/p12-113-b01b02-selective21-a4");
mkdirSync(out,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".mjs":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server=createServer((req,res)=>{
 try {
  const url=new URL(req.url,"http://localhost");
  let path=resolve(root,"."+decodeURIComponent(url.pathname));
  if(!(path===root||path.startsWith(root+sep))){res.writeHead(403).end("Forbidden");return;}
  if(existsSync(path)&&statSync(path).isDirectory())path=resolve(path,"index.html");
  if(!existsSync(path)){res.writeHead(404).end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[extname(path)]||"application/octet-stream"}).end(readFileSync(path));
 }catch(e){res.writeHead(500).end(String(e));}
});
let browser;
try {
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 const host="http://127.0.0.1:"+server.address().port;
 browser=await chromium.launch({headless:true});
 const report=[];
 for(const original of data.blocks) {
  const block=structuredClone(original);
  if(block.type==="group")block.source="CERTIFIED_CONTEXT_RECONSTRUCTED";
  const page=await browser.newPage({viewport:{width:1440,height:950}});
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  await page.route("**/data/layout-demo.json",route=>route.fulfill({
   status:200,contentType:"application/json",body:JSON.stringify({admission:"DEMO_ONLY",blocks:[block]})
  }));
  await page.goto(host+"/exam/?qa=p12-51-layout",{waitUntil:"networkidle",timeout:40000});
  await page.selectOption("#grade","4");
  await page.selectOption("#semester","S1");
  await page.selectOption("#unit",block.unit);
  await page.selectOption("#mode","single_unit");
  const expected=block.type==="group"?block.items.length:1;
  await page.fill("#count",String(expected));
  await page.locator("#generate").click();
  const status=await page.locator("#status").textContent();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false",block.id+" "+status);
  assert.equal(await page.locator(".paper:not([data-answer='true']) .question").count(),expected,block.id+" question slots");
  assert.equal(await page.locator(".paper[data-answer='true'] .answer").count(),expected,block.id+" answer slots");
  for(let i=0;i<expected;i++){
   const actual=await page.locator(".paper[data-answer='true'] .answer").nth(i).innerText();
   const ans=block.type==="group"?block.items[i].answer:block.answer;
   assert.ok(actual.startsWith(String(i+1)+". "+ans),block.id+" original answer index "+i+" "+actual);
  }
  if(block.type==="group"){
   const g=page.locator(".paper:not([data-answer='true']) .group-context");
   assert.equal(await g.count(),1,block.id+" original parent");
   assert.ok((await g.locator(".group-instructions").innerText()).includes("A 氣體"));
  }
  if(block.type==="multi"||block.type==="mcq"){
   assert.deepEqual(await page.locator(".paper:not([data-answer='true']) .question .opts div").allInnerTexts(),
    block.options,block.id+" original ordered checkbox/mcq options");
  }
  const geometry=()=>page.evaluate(()=>{
   const e=document.querySelector(".paper:not([data-answer='true']) .group-context")||
    document.querySelector(".paper:not([data-answer='true']) .question");
   const col=e.closest(".col"),paper=e.closest(".paper");
   const x=e.getBoundingClientRect(),c=col.getBoundingClientRect(),p=paper.getBoundingClientRect();
   return {left:x.left,right:x.right,top:x.top,bottom:x.bottom,colLeft:c.left,colRight:c.right,colTop:c.top,colBottom:c.bottom,
    paperBottom:p.bottom,overflowX:col.scrollWidth-col.clientWidth,overflowY:col.scrollHeight-col.clientHeight,
    columns:paper.querySelectorAll(".cols > .col").length,pages:document.querySelectorAll(".paper:not([data-answer='true'])").length};
  });
  const inside=g=>g.columns===2&&g.pages===1&&g.left>=g.colLeft-2&&g.right<=g.colRight+2&&
   g.top>=g.colTop-2&&g.bottom<=g.colBottom+2&&g.paperBottom>=g.bottom&&
   g.overflowX<=2&&g.overflowY<=2;
  const screen=await geometry();
  assert.ok(inside(screen),block.id+" A4 screen overflow "+JSON.stringify(screen));
  await page.emulateMedia({media:"print"});
  const print=await geometry();
  assert.ok(inside(print),block.id+" A4 print overflow "+JSON.stringify(print));
  const file=block.id.toLowerCase();
  await page.pdf({path:out+"/"+file+".pdf",format:"A4",preferCSSPageSize:true,printBackground:true});
  await page.screenshot({path:out+"/"+file+".png",fullPage:true});
  assert.deepEqual(errors,[],block.id+" runtime errors");
  report.push({id:block.id,type:block.type,answer_slots:expected,source_lineage_ids:block.source_lineage_ids,
   original_answer_key_verified:true,screen_two_column:true,print_two_column:true,pdf:true});
  await page.close();
 }
 assert.equal(report.length,16);
 assert.equal(report.reduce((n,x)=>n+x.answer_slots,0),21);
 assert.equal(report.reduce((n,x)=>n+x.source_lineage_ids.length,0),38);
 writeFileSync(out+"/acceptance.json",JSON.stringify({
  schema_version:"P12_113_B01B02_SELECTIVE21_STAGING_A4_BROWSER_REAL_RENDER_PASS_V1",
  actual_published_new:0,operator_exact_release_gate_still_false:true,
  original_source_slots:38,student_answer_slots:21,blocks:16,results:report
 },null,2)+"\n");
 console.log("P12_113_B01B02_SELECTIVE21_STAGING_A4_21PASS",JSON.stringify({
  renderedBlocks:report.length,sourceIds:38,answerSlots:21,allAnswers:true,
  noScreenOverflow:true,noPrintOverflow:true,pdfOutputs:16,published:0
 }));
}finally{
 await browser?.close();
 await new Promise(done=>server.close(done));
}
