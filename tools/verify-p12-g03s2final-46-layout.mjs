import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFileSync,existsSync,statSync,mkdirSync} from "node:fs";
import {resolve,sep,extname} from "node:path";
import {chromium} from "playwright";

// QA ONLY: intercept the localhost DEMO_ONLY fixture request. The 46 staged
// candidates are NEVER served as a static website asset or added to public load.
const stage=JSON.parse(readFileSync("data/staging/p12-g03s2final-46-learner-blocks-v1.json","utf8"));
assert.equal(stage.public_site_integrated,false);
assert.equal(stage.operator_public_release_approved,false);
const blocks=stage.blocks;
const groups=blocks.filter(b=>b.type==="group");
assert.equal(groups.length,8);
const output=resolve("artifacts/p12-g03s2final-46-layout");
mkdirSync(output,{recursive:true});
const root=resolve("site");
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".mjs":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server=createServer((req,res)=>{
 try{
  const url=new URL(req.url,"http://localhost");
  let file=resolve(root,"."+decodeURIComponent(url.pathname));
  if(!(file===root||file.startsWith(root+sep))){res.writeHead(403).end("Forbidden");return;}
  if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,"index.html");
  if(!existsSync(file)){res.writeHead(404).end("Missing");return;}
  res.writeHead(200,{"Content-Type":mime[extname(file)]??"application/octet-stream"}).end(readFileSync(file));
 }catch(e){res.writeHead(500).end(String(e))}
});
let browser;
try{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 browser=await chromium.launch({headless:true});
 const host="http://127.0.0.1:"+server.address().port;
 const results=[];
 const trials=[...groups,...blocks.filter(b=>b.type!=="group")];
 assert.equal(trials.length,28,"all 46 staged source slots must be browser-tested");
 for(const block of trials){
  const page=await browser.newPage({viewport:{width:1470,height:950}});
  const errors=[];page.on("pageerror",e=>errors.push(String(e)));
  const fixture={admission:"DEMO_ONLY",blocks:[{
   ...block,
   ...(block.type==="group"?{source:"CERTIFIED_CONTEXT_RECONSTRUCTED"}:{}),
   ...(block.type==="tf"?{answer:block.answer==="O"?"正確":"錯誤"}:{})
  }]};
  await page.route("**/data/layout-demo.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(fixture)}));
  await page.goto(host+"/exam/?qa=p12-g03s2final-46-layout",{waitUntil:"networkidle"});
  await page.selectOption("#grade","3");
  await page.selectOption("#semester","S2");
  await page.selectOption("#unit",block.unit);
  await page.selectOption("#mode","single_unit");
  const slots=block.type==="group"?block.items.length:1;
  await page.fill("#count",String(slots));
  await page.locator("#generate").click();
  const status=await page.locator("#status").textContent();
  assert.equal(await page.locator("#status").getAttribute("data-error"),"false",block.id+": "+status);
  assert.equal(await page.locator(".paper:not([data-answer='true']) .question").count(),slots,"exact learner slots "+block.id);
  assert.equal(await page.locator(".paper[data-answer='true'] .answer").count(),slots,"exact answer slots "+block.id);
  for(let i=0;i<slots;i++){
    const actual=await page.locator(".paper[data-answer='true'] .answer").nth(i).innerText();
    const expected=block.type==="group"?block.items[i].answer:block.answer;
    assert.ok(actual.startsWith(String(i+1)+". "+expected),block.id+" answer index "+i+" expected "+expected+" actual "+actual);
  }
  if(block.type==="group"){
    const g=page.locator(".paper:not([data-answer='true']) .group-context");
    assert.equal(await g.count(),1,"group must be indivisible "+block.id);
    assert.equal(await g.getAttribute("data-group-id"),block.id);
    assert.equal(await g.locator(".question").count(),slots);
    const bank=await g.locator(".choice-bank div").allInnerTexts();
    assert.deepEqual(bank,block.shared.choiceBank,block.id+" common choice bank");
    if(block.shared.passage)assert.ok((await g.locator(".group-passage").innerText()).includes(block.id.endsWith("P01")?"赤腹松鼠":"西北雨"));
    if(block.figure_spec){
      const figure=g.locator("svg.p12-figure-svg");
      assert.equal(await figure.count(),1,block.id+" figure must render");
      assert.equal(await figure.getAttribute("viewBox"),"0 0 460 236");
      assert.equal(await figure.getAttribute("preserveAspectRatio"),"xMidYMid meet");
      assert.equal(await figure.locator("g > rect").count()>0,true);
      const geo=await figure.evaluate(svg=>{const b=svg.getBoundingClientRect();return {w:b.width,h:b.height,col:svg.closest(".col")?.getBoundingClientRect().width}});
      assert.ok(geo.w>0&&geo.w<=geo.col+2&&Math.abs(geo.w/geo.h-460/236)<0.035,block.id+" svg aspect ratio / column fit "+JSON.stringify(geo));
    }
  }else if(block.type==="mcq"){
    const texts=await page.locator(".paper:not([data-answer='true']) .question .opts div").allInnerTexts();
    assert.deepEqual(texts,block.options,block.id+" single-choice labels");
  }else {
    assert.equal(block.type,"tf","non-group question should be O/X or single-choice");
    assert.match((await page.locator(".paper:not([data-answer='true']) .question").innerText()),/^（　）1\. /);
  }
  async function geometry(){
   return page.evaluate(()=>{
    const el=document.querySelector(".paper:not([data-answer='true']) .group-context")||
      document.querySelector(".paper:not([data-answer='true']) .question");
    const c=el?.closest(".col"),p=el?.closest(".paper");
    const a=el?.getBoundingClientRect(),b=c?.getBoundingClientRect(),pg=p?.getBoundingClientRect();
    return {left:a?.left,right:a?.right,top:a?.top,bottom:a?.bottom,colLeft:b?.left,colRight:b?.right,colTop:b?.top,colBottom:b?.bottom,
      paperTop:pg?.top,paperBottom:pg?.bottom,overflowX:c?.scrollWidth-c?.clientWidth,overflowY:c?.scrollHeight-c?.clientHeight,
      columnCount:p?.querySelectorAll(".cols > .col").length,
      questionPages:document.querySelectorAll(".paper:not([data-answer='true'])").length};
   });
  }
  const screen=await geometry();
  const inside=g=>g.columnCount===2&&g.questionPages===1&&g.left>=g.colLeft-2&&g.right<=g.colRight+2
    &&g.top>=g.colTop-2&&g.bottom<=g.colBottom+2&&g.paperBottom>=g.bottom
    &&g.overflowX<=2&&g.overflowY<=2;
  assert.ok(inside(screen),"screen A4 double-column overflow "+block.id+" "+JSON.stringify(screen));
  const filename=block.id.toLowerCase().replace(/[^a-z0-9_-]/g,"-");
  await page.screenshot({path:output+"/"+filename+".png",fullPage:true});
  await page.emulateMedia({media:"print"});
  const print=await geometry();
  assert.ok(inside(print),"print A4 double-column overflow "+block.id+" "+JSON.stringify(print));
  await page.pdf({path:output+"/"+filename+".pdf",format:"A4",preferCSSPageSize:true,printBackground:true});
  assert.deepEqual(errors,[],"browser runtime exceptions "+block.id);
  results.push({block_id:block.id,slots,screen,print,answer_check:"PASS",one_column:"PASS",pdf:"PASS"});
  await page.close();
 }
 const observed=results.filter(x=>x.block_id.startsWith("P12_G03S2FINAL_")&&groups.some(g=>g.id===x.block_id));
 assert.equal(observed.length,8);
 assert.equal(observed.reduce((n,x)=>n+x.slots,0),26);
 assert.equal(results.length,28);
 assert.equal(results.reduce((n,x)=>n+x.slots,0),46);
 console.log("P12_G03S2FINAL_46_A4_TWO_COLUMN_PILOT_PASS",JSON.stringify({groupCount:observed.length,groupSlots:26,allSourceSlots:46,trials:results.length,results:results.map(x=>({id:x.block_id,slots:x.slots,layout:"PASS"}))}));
}finally{
 await browser?.close();
 await new Promise(done=>server.close(done));
}
