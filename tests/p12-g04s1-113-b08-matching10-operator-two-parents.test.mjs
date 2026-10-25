import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12113B08Matching10} from "../site/assets/js/p12-g04s1-113-b08-matching10-two-parent-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const evidence=read("data/review/p12-g04s1-113-b08-matching10-originaltwo-parent-science-kp-rights-dedup-operator-eligible-v1.json");
const bank=read("site/data/question-bank/p12-g04s1-113-b08-matching10-two-parent-public-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const convert=x=>validateAndConvertP12113B08Matching10(x,authority);
test("B08 exact 50 preserve already published MC7 and 33 HOLD, add only matching 10",()=>{
 assert.deepEqual(evidence.eligible_matching10,[362,363,364,365,366,367,394,395,396,397]);
 assert.equal(new Set([...evidence.eligible_matching10,...evidence.separate_HOLD33,...evidence.already_published_MC7]).size,50);
 assert.deepEqual(evidence.metrics_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:10,ADMISSION_READY_new:10,PUBLISHED_new:0});
 assert.equal(evidence.separate_HOLD33.length,33);
 assert.ok(evidence.separate_HOLD33.includes(368)&&evidence.separate_HOLD33.includes(369));
 assert.equal(evidence.excluded_priorB01_B07,true);
 assert.equal(evidence.source_review_pr_draft_unmerged,true);
});
test("B08 two original matching parents keep codebank and six/four short-answer code blanks",()=>{
 const z=convert(bank);
 assert.deepEqual([z.blocks.length,z.answerSlots,z.contextGroups,z.standaloneTf,z.standaloneChoice],[2,10,2,0,0]);
 assert.deepEqual(z.blocks.map(g=>g.items.length),[6,4]);
 assert.deepEqual(z.blocks.map(g=>g.shared.choiceBank.length),[4,2]);
 assert.deepEqual(z.blocks.map(g=>g.unit),["4-S1-U03","4-S1-U02"]);
 assert.deepEqual(z.blocks[0].secondary_canonical_kp_ids,
   ["sci_g04s1_03_09","sci_g04s1_03_06","sci_g04s1_03_10","sci_g04s1_03_08"]);
 assert.deepEqual(z.blocks.flatMap(g=>g.items.map(v=>v.answer)),["C","B","D","A","C","B","A","B","B","A"]);
 assert.ok(z.blocks.flatMap(g=>g.items).every(v=>v.type==="short"&&!Object.hasOwn(v,"options")));
 assert.ok(z.blocks.every(g=>g.original_cropped_assets_included===false&&g.operator_publication_approval===true));
});
test("B08 exact original text, native/figure caption BBox, unique science and KP are fail-closed",()=>{
 for(const [gi,i,key] of [[0,0,"stem"],[0,1,"answer"],[0,2,"canonical_kp_id"],[0,3,"source_pdf_bbox_pts_top_left"],[1,0,"stem"],[1,2,"source_bbox_kind"],[1,3,"answer"]]){
  const bad=structuredClone(bank);
  bad.blocks[gi].items[i][key]=key==="source_pdf_bbox_pts_top_left"?[0,0,0,0]:"CHANGED";
  assert.throws(()=>convert(bad),/FAIL_CLOSED/);
 }
 const bad=structuredClone(bank);bad.blocks[0].shared.choiceBank[2]="C.錯誤代號";
 assert.throws(()=>convert(bad),/FAIL_CLOSED/);
 const bad2=structuredClone(bank);bad2.blocks[1].original_cropped_assets_included=true;
 assert.throws(()=>convert(bad2),/FAIL_CLOSED/);
 const bad3=structuredClone(bank);bad3.blocks[0].items[0].options=["A","B"];
 assert.throws(()=>convert(bad3),/FAIL_CLOSED/);
});
test("B08 matching code bank is actually wired to the public R5 grouped Exam renderer",()=>{
 const src=readFileSync(new URL("../site/assets/js/historical-bank-ox-v6.mjs",import.meta.url),"utf8");
 const html=readFileSync(new URL("../site/exam/index.html",import.meta.url),"utf8");
 for(const s of ["validateAndConvertP12113B08Matching10","...b08Matching10.blocks","+b08Matching10.answerSlots","+b08Matching10.contextGroups"])assert.ok(src.includes(s));
 assert.ok(html.includes("if(b.shared.choiceBank?.length)"));
 assert.ok(html.includes("b.shared.choiceBank.forEach"));
 assert.ok(html.includes("q.type==='tf'||q.type==='short'||q.type==='mcq'"));
 assert.ok(html.includes("if(!mounted)throw Error('題目內容過高，拒絕裁切')"));
});
