import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
import {validateAndConvertContextGroups,loadEmbeddedHistoricalBank} from "../site/assets/js/historical-bank-ox-v5.mjs";
const db=JSON.parse(readFileSync("site/data/question-bank/certified-context-groups-v2.json","utf8"));
const authority=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
test("20 atomic groups and 76 answer slots are certified",()=>{
 const bank=validateAndConvertContextGroups(db,authority);
 assert.equal(bank.blocks.length,20);
 assert.equal(bank.blocks.reduce((n,b)=>n+b.items.length,0),76);
 assert.equal(new Set(bank.blocks.map(x=>x.id)).size,9);
 assert.ok(bank.blocks.every(x=>x.items.length>=1&&x.original_cropped_assets_included===false));
});
test("group contracts fail closed on missing answers/partial context/altered rights",()=>{
 const clone=()=>structuredClone(db);
 const a=clone();a.groups[0].items[0].answer="";
 assert.throws(()=>validateAndConvertContextGroups(a,authority),/子題答案不完整/);
 const b=clone();b.groups[2].shared.table.rows[0].pop();
 assert.throws(()=>validateAndConvertContextGroups(b,authority),/表格不完整/);
 const c=clone();c.groups[1].original_cropped_assets_included=true;
 assert.throws(()=>validateAndConvertContextGroups(c,authority),/來源資料不完整/);
 const d=clone();d.groups[0].canonical_kp_id="bad_id";
 assert.throws(()=>validateAndConvertContextGroups(d,authority),/KP 或單元/);
});
test("source-based context groups include true O/X and explanation",()=>{
 const group=validateAndConvertContextGroups(db,authority).blocks.find(x=>x.id==="MID_G03_MAGNET_READING");
 assert.equal(group.items.length,8);
 assert.deepEqual(group.items.map(x=>x.answer),["X","X","O","X","X","O","X","X"]);
 const reflection=db.groups.find(x=>x.id==="FINAL_G04_REFLECTION_READING");
 assert.deepEqual(reflection.items.map(x=>x.answer),["②","①、④"]);
});

test("P09 seven diagrams and manual drawing scoring are source aligned",()=>{
 const rows=validateAndConvertContextGroups(db,authority).blocks.filter(g=>g.diagram_kind);
 assert.equal(rows.length,7);
 assert.ok(rows.every(g=>g.source_pdf_sha256.length===64));
 const drawing=rows.find(g=>g.id==="FINAL_G04_CIRCUIT_DRAW");
 assert.equal(drawing.items[0].type,"draw");
 assert.equal(drawing.automatic_grading,false);
 assert.equal(drawing.assessment_method,"MANUAL_RUBRIC_5_POINTS");
 const original=db.groups.find(x=>x.id==="FINAL_G04_CIRCUIT_IMAGES");
 assert.deepEqual(original.items.map(x=>x.answer),["甲","丙","乙"]);
});
test("P09 source-dependent reconstructed reading is never mislabeled verbatim original article",()=>{
 for(const id of ["FINAL_G03_ANTHOCYANIN_READING","MID_G04_EARTHQUAKE_READING","FINAL_G04_LED_READING"]){
  const group=db.groups.find(x=>x.id===id);
  assert.match(group.rights_review,/PARAPHRASE|PARAPHRASED/);
  assert.equal(group.original_cropped_assets_included,false);
 }
});
