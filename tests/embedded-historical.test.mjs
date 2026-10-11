import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertEmbeddedBank} from "../site/assets/js/historical-bank.mjs";
const db=JSON.parse(readFileSync("site/data/question-bank/approved-historical-v1.json","utf8"));
const authority=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
test("approved seven historical school items are built in and have canonical IDs",()=>{
 const bank=validateAndConvertEmbeddedBank(db,authority);
 assert.equal(bank.admission,"EMBEDDED_CERTIFIED_HISTORICAL");
 assert.equal(bank.blocks.length,7);
 assert.equal(bank.blocks.filter(x=>x.answer==="正確").length,5);
 assert.equal(bank.blocks.filter(x=>x.answer==="錯誤").length,2);
 assert.equal(new Set(bank.blocks.map(x=>x.id)).size,7);
 assert.equal(bank.blocks.filter(x=>x.kp_mapping_quality==="KP_NEAREST_OPERATOR_ACCEPTED").length,2);
 assert.equal(bank.blocks.filter(x=>x.answer_assumption).length,7);
});
test("embedded bank fails closed on missing source, stale KP and no rights",()=>{
 const clone=()=>structuredClone(db);
 const a=clone();a.blocks[0].license_status="NOT_VERIFIED";
 assert.throws(()=>validateAndConvertEmbeddedBank(a,authority),/認證未通過/);
 const b=clone();b.blocks[0].canonical_kp_id="sci_nonexistent";
 assert.throws(()=>validateAndConvertEmbeddedBank(b,authority),/不存在的 KP/);
 const c=clone();c.blocks[0].operator_science_answer_accepted=false;
 assert.throws(()=>validateAndConvertEmbeddedBank(c,authority),/認證未通過/);
});
test("embedded bank blocks duplicate IDs, missing reasons and unapproved quantity",()=>{
 const a=structuredClone(db);a.blocks[1].id=a.blocks[0].id;
 assert.throws(()=>validateAndConvertEmbeddedBank(a,authority),/重複題目 ID/);
 const b=structuredClone(db);b.blocks[0].science_reasoning="";
 assert.throws(()=>validateAndConvertEmbeddedBank(b,authority),/認證未通過/);
 const c=structuredClone(db);c.blocks.pop();
 assert.throws(()=>validateAndConvertEmbeddedBank(c,authority),/核准題數/);
});
