import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12Six} from "../site/assets/js/p12-six-release.mjs";
import {loadEmbeddedHistoricalBank} from "../site/assets/js/historical-bank-ox-v6.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const supplement=read("site/data/question-bank/p12-g03s2mid-approved-six-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("operator-approved six have exactly six unique source slots, valid KP and two complete contexts",()=>{
 const result=validateAndConvertP12Six(supplement,authority);
 assert.equal(result.answerSlots,6);
 assert.equal(result.blocks.length,5);
 assert.equal(result.contextGroups,2);
 assert.equal(new Set(result.blocks.map(b=>b.id)).size,5);
 const group=result.blocks.find(b=>b.id==="P12_G03S2MID_READ_003_004");
 assert.equal(group.items.length,2);
 assert.ok(group.shared.passage.includes("人工")||group.shared.passage.includes("燈具"));
 assert.deepEqual(group.items.map(i=>i.answer),["O","X"]);
 assert.deepEqual(group.items.map(i=>i.source_checkbox_answer),["checked","unchecked"]);
 assert.deepEqual(group.secondary_canonical_kp_ids,["sci_g03s2_01_10"]);
 const snow=result.blocks.find(b=>b.id==="P12_G03S2MID_COMPOSITE_010");
 assert.equal(snow.items[0].stem,"冬天時高山下雪");
 assert.equal(snow.items[0].answer,"④");
 assert.match(snow.items[0].answer_explanation,/凝華/);
});
test("six-question loader fails closed for missing origin, duplicate slot and removed scientific qualification",()=>{
 const clone=()=>structuredClone(supplement);
 const a=clone();a.blocks[0].source_pdf_sha256="wrong";
 assert.throws(()=>validateAndConvertP12Six(a,authority),/來源和核准憑據/);
 const b=clone();b.blocks[1].source_slot_id=b.blocks[0].source_slot_id;
 assert.throws(()=>validateAndConvertP12Six(b,authority),/來源位置重複/);
 const c=clone();c.blocks[3].items[0].answer_assumption="";
 assert.throws(()=>validateAndConvertP12Six(c,authority),/科學資格註記/);
 const d=clone();d.blocks[4].shared.passage="";
 assert.throws(()=>validateAndConvertP12Six(d,authority),/改編共同短文/);
 const e=clone();e.blocks[4].canonical_kp_id="UNKNOWN";
 assert.throws(()=>validateAndConvertP12Six(e,authority),/canonical KP/);
 const f=clone();f.blocks.pop();
 assert.throws(()=>validateAndConvertP12Six(f,authority),/題數/);
});
test("P12 addition does not alter frozen 72 OX and 20 context group assets",async()=>{
 const old=read("site/data/question-bank/approved-historical-ox-v4.json");
 const contexts=read("site/data/question-bank/certified-context-groups-v2.json");
 const contentContexts=read("site/data/question-bank/certified-context-groups-content-v3.json");
 const remaining=read("site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json");
 const approval=read("site/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json");
 const g03Final=read("site/data/question-bank/p12-g03s2final-46-public-v1.json");
 const finalApproval=read("site/data/governance/p12-g03s2final-46-operator-public-approval-v1.json");
 const b04=read("site/data/question-bank/p12-b04-g04s1-yongan-mid9-public-v1.json");
 const chongde=read("site/data/question-bank/p12-b04-g04s1-chongde-mid6-public-v1.json");
 const b01=read("site/data/question-bank/p12-b04-b01-47-public-v1.json");
 const b02=read("site/data/question-bank/p12-b04-b02-41-public-v1.json");
 const b03=read("site/data/question-bank/p12-b04-b03-41-public-v1.json");
 const b04next=read("site/data/question-bank/p12-b04-b04-47-public-v1.json");
 assert.equal(old.blocks.length,72);
 assert.equal(contexts.groups.length,20);
 assert.equal(contexts.expected_answer_slots,76);
 const oldFetch=globalThis.fetch;
 globalThis.fetch=async url=>({
  ok:true,
  json:async()=>structuredClone(url.includes("approved-historical-ox-v4")?old:
   url.includes("certified-context-groups-content-v3")?contentContexts:url.includes("remaining51-public-v1")?remaining:url.includes("remaining51-operator-public-approval-v1")?approval:url.includes("p12-g03s2final-46-public-v1")?g03Final:url.includes("p12-g03s2final-46-operator-public-approval-v1")?finalApproval:url.includes("p12-b04-g04s1-yongan-mid9-public-v1")?b04:url.includes("p12-b04-g04s1-chongde-mid6-public-v1")?chongde:url.includes("p12-b04-b01-47-public-v1")?b01:url.includes("p12-b04-b02-41-public-v1")?b02:url.includes("p12-b04-b03-41-public-v1")?b03:url.includes("p12-b04-b04-47-public-v1")?b04next:supplement)
 });
 try{
  const all=await loadEmbeddedHistoricalBank(authority);
  assert.equal(all.admission,"EMBEDDED_CERTIFIED_HISTORICAL");
  assert.equal(all.certifiedAnswerSlots,442);
  assert.equal(all.certifiedTrueFalse,190);
  assert.equal(all.certifiedStandaloneChoice,117);
  assert.equal(all.certifiedGroupCount,36);
  assert.equal(all.blocks.length,72+20+5+27+28+9+6+47+41+41+47);
  assert.equal(new Set(all.blocks.map(b=>b.id)).size,all.blocks.length);
 }finally{globalThis.fetch=oldFetch}
});
