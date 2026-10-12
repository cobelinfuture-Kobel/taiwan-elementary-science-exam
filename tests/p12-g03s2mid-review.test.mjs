import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const d=JSON.parse(readFileSync("site/data/governance/p12-g03s2mid-candidate-review.json","utf8"));
const ev=JSON.parse(readFileSync("site/data/governance/p12-review-events.json","utf8"));
const kp=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
const ids=new Set(kp.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test("P12 source-full first paper covers every one of 57 still-unpublished source positions",()=>{
 assert.equal(d.candidate_positions_total,57);assert.equal(d.items.length,57);
 assert.equal(new Set(d.items.map(x=>x.source_slot_id)).size,57);
 assert.ok(d.items.every(x=>x.source_pdf_sha256===d.paper_sha256&&ids.has(x.canonical_kp_id)));
 assert.deepEqual(d.decisions,{staged:51,blocked:6});
 assert.ok(d.items.every(x=>x.public_release_authorized===false&&x.teacher_key_authenticated===false));
});
test("full paper review preserves 20 printed water questions, 22 answer blanks, and grouped dependence",()=>{
 const water=d.items.filter(x=>x.original_section==="COMPOSITE"&&x.original_part===2);
 assert.equal(water.length,22);assert.equal(new Set(water.map(x=>x.printed_question_number)).size,20);
 assert.deepEqual(water.filter(x=>x.printed_question_number===1).map(x=>x.original_ordinal),[1,2]);
 assert.deepEqual(water.filter(x=>x.printed_question_number===2).map(x=>x.original_ordinal),[3,4]);
 assert.ok(water.every(x=>x.requires_context_group!==null));
 assert.ok(d.items.filter(x=>x.original_section==="READ").every(x=>x.requires_context_group!==null));
});
test("source science holds cannot silently auto-publish and every review event has immutable evidence",()=>{
 assert.equal(ev.events.length,114);
 assert.equal(ev.events.filter(x=>x.action==="START").length,57);
 assert.equal(ev.events.filter(x=>x.action==="CERTIFY_STAGED").length,51);
 assert.equal(ev.events.filter(x=>x.action==="BLOCK").length,6);
 assert.ok(ev.events.every(x=>x.review_evidence_ref?.startsWith("site/data/governance/p12-g03s2mid-candidate-review.json#")));
 const scientificHolds=d.items.filter(x=>x.issue_type).map(x=>x.source_slot_id).sort();
 assert.deepEqual(scientificHolds,ev.events.filter(x=>x.action==="BLOCK").map(x=>x.source_slot_id).sort());
});
