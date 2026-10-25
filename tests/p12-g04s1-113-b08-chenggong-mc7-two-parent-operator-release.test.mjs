import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12113B08ChenggongMC7} from "../site/assets/js/p12-g04s1-113-b08-chenggong-mc7-two-parent-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-b08-chenggong-mc7-two-parent-public-v1.json");
const receipt=read("data/review/p12-g04s1-113-b08-chenggong-mc7-exact7-operator-approved-formal-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const convert=v=>validateAndConvertP12113B08ChenggongMC7(v,authority);
const children=bank.blocks.flatMap(b=>b.items);
test("B08 exact operator seven original answer positions, not 10 matching or 33 HOLD",()=>{
 assert.deepEqual(receipt.eligible_source_positions,[387,388,389,390,391,392,393]);
 assert.deepEqual(receipt.groups.map(x=>x.child_source_ids.length),[3,4]);
 assert.equal(receipt.records.length,7);
 assert.deepEqual(receipt.official_metrics_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:7,ADMISSION_READY_new:7,PUBLISHED_new:0});
 assert.equal(receipt.excluded_matching10_ordinals.length,10);
 assert.equal(receipt.excluded_other33_count,33);
 assert.equal(receipt.protected_prior_batches.join(","),"B01,B02,B03,B04,B05,B06,B07");
 assert.equal(bank.source_evidence_ref,"data/review/p12-g04s1-113-b08-chenggong-mc7-exact7-operator-approved-formal-v1.json");
});
test("B08 two original source parents and seven MC children are inseparable",()=>{
 const result=convert(bank);
 assert.equal(result.blocks.length,2);assert.deepEqual(result.blocks.map(g=>g.items.length),[3,4]);
 assert.deepEqual([result.contextGroups,result.answerSlots,result.standaloneChoice],[2,7,0]);
 assert.deepEqual(result.blocks.map(g=>g.shared.table?.rows?.length??0),[3,0]);
 assert.deepEqual(result.blocks[0].secondary_canonical_kp_ids,["sci_g04s1_02_14"]);
 assert.ok(result.blocks[1].shared.passage.includes("書鴻"));
 assert.ok(result.blocks[1].shared.passage.includes("雅萍"));
 assert.ok(children.every(c=>c.type==="mcq"&&c.source_page_pdf_1_based===2));
 assert.ok(children.every(c=>c.options.some(s=>s.startsWith(c.answer))));
 assert.ok(children.every(c=>c.answer_assumption.includes("非原校教師答案表")));
 assert.ok(children.every(c=>!Object.hasOwn(c,"score")&&!Object.hasOwn(c,"points")));
});
test("B08 immutable school stem, options, BBox, answer, direct canonical KP fail-closed",()=>{
 for(const [groupIdx,itemIdx,field] of [[0,0,"stem"],[0,1,"options"],[0,2,"source_pdf_bbox_pts_top_left"],[1,0,"answer"],[1,1,"canonical_kp_id"]]){
  const copy=structuredClone(bank);
  copy.blocks[groupIdx].items[itemIdx][field]=field==="options"?["①甲","②乙","③丙"]:"TAMPERED";
  assert.throws(()=>convert(copy),/FAIL_CLOSED/);
 }
 const copy=structuredClone(bank);copy.blocks[0].shared.table.rows[1][1]="水流湍急";
 assert.throws(()=>convert(copy),/FAIL_CLOSED/);
});
test("B08 Exam loader and A4 grouped renderer preserve both groups and exactly seven answer slots",()=>{
 const loader=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 const html=readFileSync(new URL("../site/exam/index.html",import.meta.url),"utf8");
 assert.ok(loader.includes("...b08ChenggongMC7.blocks"));
 assert.ok(loader.includes("+b08ChenggongMC7.contextGroups"));
 assert.ok(loader.includes("+b08ChenggongMC7.answerSlots"));
 assert.ok(loader.includes("validateAndConvertP12113B08ChenggongMC7"));
 assert.ok(html.includes("white-space:pre-line"));
 assert.ok(html.includes("function sourceContextGroup(b,start)"));
 assert.ok(html.includes("b.shared.table.rows.forEach"));
 assert.ok(html.includes("b.items.forEach((item,i)=>"));
 assert.ok(html.includes("if(!mounted)throw Error('題目內容過高，拒絕裁切')"));
 assert.ok(html.includes("20261025-p12-113-b08-mc7-two-parent-release"));
});
