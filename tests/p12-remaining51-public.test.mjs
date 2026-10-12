import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12Remaining51} from "../site/assets/js/p12-remaining51-release.mjs";
import {chooseExactBlocks} from "../site/assets/js/worksheet-nonrepeat-selection.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const published=read("site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json");
const approval=read("site/data/governance/p12-g03s2mid-remaining51-operator-public-approval-v1.json");
test("51 public answer positions match exact operator-approved source, answer and KP lineage",()=>{
 const x=validateAndConvertP12Remaining51(published,approval,authority);
 assert.equal(x.answerSlots,51);assert.equal(x.blocks.length,27);
 assert.equal(x.standaloneTf,10);assert.equal(x.standaloneChoice,11);
 assert.equal(x.contextGroups,6);
 assert.deepEqual(x.blocks.filter(b=>b.type==="group").map(b=>b.items.length),[5,4,7,7,3,4]);
 assert.equal(new Set(approval.approved_items.map(x=>x.source_slot_id)).size,51);
});
test("changing a source answer, canonical KP, rights or provenance fails closed",()=>{
 const copy=x=>structuredClone(x);
 const a=copy(published);a.blocks[0].answer=a.blocks[0].answer==="O"?"X":"O";
 assert.throws(()=>validateAndConvertP12Remaining51(a,approval,authority),/答案或 KP/);
 const b=copy(published);b.blocks[0].canonical_kp_id="NOT_AUTHORIZED";
 assert.throws(()=>validateAndConvertP12Remaining51(b,approval,authority),/KP/);
 const c=copy(published);c.blocks[0].operator_publication_approval=false;
 assert.throws(()=>validateAndConvertP12Remaining51(c,approval,authority),/核准/);
 const d=copy(published);d.blocks.pop();
 assert.throws(()=>validateAndConvertP12Remaining51(d,approval,authority),/數量/);
 const e=copy(approval);e.approved_items[0].answer="UNKNOWN";
 assert.throws(()=>validateAndConvertP12Remaining51(published,e,authority),/答案或 KP/);
});
test("both seaweed source questions remain individually available, never both on the same worksheet",()=>{
 const blocks=published.blocks;
 const pair=blocks.filter(b=>b.same_worksheet_exclusion_group==="SEAWEED_MOISTURE");
 assert.deepEqual(pair.map(x=>x.source_slot_id).sort(),[
  "G03-S2-MID|MC|P01|008","G03-S2-MID|TF|P01|008"
 ]);
 for(const ordered of [blocks,[...blocks].reverse()]){
  for(let n=1;n<=50;n++){
   const chosen=chooseExactBlocks(ordered,n);
   if(!chosen)continue;
   assert.equal(chosen.reduce((k,b)=>k+(b.type==="group"?b.items.length:1),0),n);
   assert.ok(chosen.filter(b=>b.same_worksheet_exclusion_group==="SEAWEED_MOISTURE").length<=1);
  }
 }
 assert.equal(chooseExactBlocks(blocks,51),null,"51 items cannot be on a single worksheet without duplicating the same fact");
 assert.ok(chooseExactBlocks([pair[0]],1)?.includes(pair[0]));
 assert.ok(chooseExactBlocks([pair[1]],1)?.includes(pair[1]));
 assert.equal(chooseExactBlocks(pair,2),null);
});
