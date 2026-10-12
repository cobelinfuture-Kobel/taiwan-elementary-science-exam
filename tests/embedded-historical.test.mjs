import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertEmbeddedBank} from "../site/assets/js/historical-bank-ox-v6.mjs";
const db=JSON.parse(readFileSync("site/data/question-bank/approved-historical-ox-v4.json","utf8"));
const authority=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
test("approved seven historical school items are built in and have canonical IDs",()=>{
 const bank=validateAndConvertEmbeddedBank(db,authority);
 assert.equal(bank.admission,"EMBEDDED_CERTIFIED_HISTORICAL");
 assert.equal(bank.blocks.length,72);
 assert.equal(bank.blocks.filter(x=>x.answer==="O").length,35);
 assert.equal(bank.blocks.filter(x=>x.answer==="X").length,37);
 assert.equal(new Set(bank.blocks.map(x=>x.id)).size,72);
 assert.equal(bank.blocks.filter(x=>x.kp_mapping_quality==="KP_NEAREST_OPERATOR_ACCEPTED").length,6);
 assert.equal(bank.blocks.filter(x=>x.answer_assumption).length,72);
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

test("OX exam format is the canonical answer encoding, not Chinese true/false",()=>{
 assert.equal(db.answer_marker_contract,"OX_ORIGINAL_EXAM_LAYOUT_V1");
 assert.ok(db.blocks.every(x=>["O","X"].includes(x.answer)));
 const bank=validateAndConvertEmbeddedBank(db,authority);
 assert.deepEqual(new Set(bank.blocks.map(x=>x.answer)),new Set(["O","X"]));
 const invalid=structuredClone(db);invalid.blocks[0].answer="正確";
 assert.throws(()=>validateAndConvertEmbeddedBank(invalid,authority),/答案不完整/);
});

test("a deployed historical dataset must match its module revision",()=>{
  assert.equal(db.asset_revision,"SCIENCE_S3_P10_OX_V4");
  const older=structuredClone(db);delete older.asset_revision;
  assert.throws(()=>validateAndConvertEmbeddedBank(older,authority),/版本不相容/);
});

test("33 newly science-reviewed school exam questions retain provenance and six nearest KP",()=>{
 const bank=validateAndConvertEmbeddedBank(db,authority);
 const additions=db.blocks.filter(x=>x.science_answer_source==="GPT6_S3_P08_REASONED_REVIEW");
 assert.equal(additions.length,33);
 assert.equal(db.blocks.filter(x=>x.mapping_quality==="KP_NEAREST_OPERATOR_ACCEPTED").length,6);
 assert.ok(additions.every(x=>x.teacher_key_authenticated===false && x.model_science_answer_review_completed===true));
 assert.equal(new Set(db.blocks.map(x=>x.id)).size,72);
 const sha=new Set(db.blocks.map(x=>x.source_pdf_sha256));
 assert.equal(sha.size,8);
 assert.ok(bank.blocks.every(x=>x.stem&&!x.stem.includes("DEMO_ONLY")));
});

test("P10 four lower-semester papers yield eight independently science-reviewed O/X each",()=>{
 const bank=validateAndConvertEmbeddedBank(db,authority);
 const rows=db.blocks.filter(x=>x.science_answer_source==="GPT6_S3_P10_REASONED_REVIEW");
 assert.equal(rows.length,32);
 for(const src of ["G03-S2-MID","G03-S2-FINAL","G04-S2-MID","G04-S2-FINAL"]){
   const subset=rows.filter(x=>x.source_id===src);
   assert.equal(subset.length,8,src);
   assert.ok(subset.every(x=>x.source_visual_review_verified===true&&x.source_page_pdf_1_based===1&&x.teacher_key_authenticated===false));
   assert.ok(subset.every(x=>x.unit.endsWith("U01")||x.unit.endsWith("U02")||x.unit.endsWith("U03")||x.unit.endsWith("U04")));
   assert.ok(subset.every(x=>src.includes("MID")?/U0[12]$/.test(x.unit):/U0[34]$/.test(x.unit)));
 }
 assert.equal(bank.blocks.filter(x=>x.unit.includes("-S2-")).length,32);
 const bad=structuredClone(db);
 bad.blocks.find(x=>x.source_id==="G03-S2-MID").science_answer_source="UNREVIEWED_MODEL";
 assert.throws(()=>validateAndConvertEmbeddedBank(bad,authority),/認證未通過/);
});
