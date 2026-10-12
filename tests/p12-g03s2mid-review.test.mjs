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
 assert.equal(ev.events.length,320);
 assert.equal(ev.events.filter(x=>x.action==="START").length,104);
 assert.equal(ev.events.filter(x=>x.action==="CERTIFY_STAGED").length,103);
 assert.equal(ev.events.filter(x=>x.action==="PUBLIC_ADMIT").length,103);
 assert.equal(ev.events.filter(x=>x.action==="BLOCK").length,10);
 assert.ok(ev.events.every(x=>x.review_evidence_ref?.startsWith("site/data/governance/p12-g03s2mid-")||x.review_evidence_ref?.startsWith("site/data/question-bank/p12-g03s2mid-approved-six-v1.json#")||x.review_evidence_ref?.startsWith("site/data/question-bank/p12-g03s2mid-remaining51-public-v1.json#")||x.review_evidence_ref?.startsWith("data/review/p12-g03s2final-fullpaper-candidate-screening-v1.json#")||x.review_evidence_ref?.startsWith("data/review/p12-g03s2final-mc06-referenced-reading-resolution-v1.json#")));
 const scientificHolds=d.items.filter(x=>x.issue_type).map(x=>x.source_slot_id).sort();
 assert.deepEqual(scientificHolds,ev.events.slice(0,114).filter(x=>x.action==="BLOCK").map(x=>x.source_slot_id).sort());
 assert.equal(ev.events.slice(0,114).filter(x=>x.action==="CERTIFY_STAGED").length,51);
});

const r2=JSON.parse(readFileSync("site/data/governance/p12-g03s2mid-six-blocker-adjudication.json","utf8"));
test("round two reconciles 6 scientific questions as three conditional candidates and three source defects",()=>{
 assert.equal(r2.items.length,6);
 assert.equal(new Set(r2.items.map(x=>x.source_slot_id)).size,6);
 assert.equal(r2.conditional_stage,3);assert.equal(r2.persistent_holds,3);
 assert.equal(r2.items.filter(x=>x.status==="CONDITIONAL_STAGE").length,3);
 assert.equal(r2.items.filter(x=>x.status==="SOURCE_DEFECT_HOLD").length,3);
 assert.ok(r2.items.every(x=>x.publication_approved===false&&x.external_evidence.startsWith("https://")&&x.required_edit));
 assert.deepEqual(new Set(r2.items.map(x=>x.source_slot_id)),new Set(scienceInitial()));
 const tail=ev.events.slice(114,120);
 assert.deepEqual(tail.map(x=>x.source_slot_id),r2.items.map(x=>x.source_slot_id));
 assert.equal(tail.filter(x=>x.action==="CERTIFY_STAGED").length,3);
 assert.equal(tail.filter(x=>x.action==="BLOCK").length,3);
 assert.ok(tail.every(x=>x.publication_approved===false));
 const newEvents=ev.events.slice(120,129);
 assert.deepEqual(newEvents.map(x=>x.action),[...Array(3).fill("CERTIFY_STAGED"),...Array(6).fill("PUBLIC_ADMIT")]);
 assert.equal(new Set(newEvents.slice(3).map(x=>x.source_slot_id)).size,6);
 assert.ok(newEvents.slice(3).every(x=>x.publication_approved===true));
 const admitted51=ev.events.slice(129,180);
 assert.equal(admitted51.length,51);
 assert.ok(admitted51.every(x=>x.action==="PUBLIC_ADMIT"&&x.publication_approved===true));
 assert.equal(new Set(admitted51.map(x=>x.source_slot_id)).size,51);
});
function scienceInitial(){return d.items.filter(x=>x.issue_type).map(x=>x.source_slot_id)}
