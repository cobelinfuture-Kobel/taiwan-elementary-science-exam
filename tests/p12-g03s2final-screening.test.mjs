import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const review=read("data/review/p12-g03s2final-fullpaper-candidate-screening-v1.json");
const events=read("site/data/governance/p12-review-events.json").events;
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const original=read("site/data/question-bank/approved-historical-ox-v4.json");
const canonical=new Set(authority.units.filter(u=>u.grade===3&&u.semester===2&&["U03","U04"].includes(u.unit_id))
  .flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const source="G03-S2-FINAL",root=source+"|";
test("frozen 54 original answer positions and eight preexisting true-false questions remain distinct",()=>{
 const published=original.blocks.filter(b=>b.source_id===source);
 assert.deepEqual(published.map(x=>x.id).sort(),Array.from({length:8},(_,i)=>`G03-S2-FINAL-TF-${String(i+2).padStart(2,"0")}`).sort());
 assert.equal(review.original_answer_positions,54);
 assert.deepEqual(review.previously_published_original_tf_positions,[2,3,4,5,6,7,8,9]);
 assert.equal(review.candidate_positions,46);
 assert.equal(review.items.length,46);
 const seen=new Set(review.items.map(x=>x.source_slot_id));
 assert.equal(seen.size,46);
 assert.ok([...seen].every(x=>x.startsWith(root)));
 assert.ok(Array.from({length:8},(_,i)=>`${root}TF|P01|${String(i+2).padStart(3,"0")}`).every(x=>!seen.has(x)));
});
test("46 source positions map exactly six TF, fourteen MC, 22 composite, four reading, on U03/U04 only",()=>{
 assert.deepEqual(review.section_counts,{TF:6,MC:14,COMPOSITE:22,READ:4});
 const counts=Object.fromEntries(["TF","MC","COMPOSITE","READ"].map(k=>[k,review.items.filter(x=>x.section===k).length]));
 assert.deepEqual(counts,review.section_counts);
 assert.deepEqual(review.items.filter(x=>x.section==="COMPOSITE").reduce((a,x)=>{a[x.part]=(a[x.part]||0)+1;return a},{}),{"1":4,"2":3,"3":4,"4":4,"5":3,"6":4});
 assert.deepEqual(review.items.filter(x=>x.section==="READ").reduce((a,x)=>{a[x.part]=(a[x.part]||0)+1;return a},{}),{"1":2,"2":2});
 assert.ok(review.items.every(x=>canonical.has(x.canonical_kp_id)&&x.source_pdf_sha256===review.source_pdf_sha256
  &&x.original_teacher_key_authenticated===false&&x.public_release_authorized===false
  &&x.source_visual_review_verified===true&&x.kp_mapping_verified===true));
 assert.equal(review.source_pdf_sha256,"078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793");
});
test("all source figures keep non-public image dependencies, including all four wind subitems",()=>{
 const figures=review.items.filter(x=>x.section==="COMPOSITE");
 assert.ok(figures.every(x=>x.asset_dependency!=="NONE"&&x.requires_context_group));
 const winds=figures.filter(x=>x.part===4);
 assert.deepEqual(winds.map(x=>x.model_proposed_answer),["B","A","D","F"]);
 assert.deepEqual(winds.map(x=>x.asset_dependency),Array(4).fill("FOUR_WIND_INSTRUMENT_DRAWINGS"));
 assert.ok(figures.every(x=>x.published===false));
});
test("source-dependence holds the unattached cloud reading rather than inventing a teacher answer",()=>{
 const held=review.items.filter(x=>x.decision==="BLOCK_SOURCE_CONTEXT_MISSING");
 assert.equal(held.length,1);
 assert.equal(held[0].source_slot_id,"G03-S2-FINAL|MC|P01|006");
 assert.equal(held[0].issue_type,"MISSING_REFERENCED_READING_ARTICLE");
 assert.equal(held[0].science_answer_verified,false);
 assert.equal(held[0].model_proposed_answer,"①");
 assert.equal(review.items.filter(x=>x.decision==="CERTIFIED_STAGED_NOT_PUBLIC").length,45);
 assert.equal(review.bulk_publication_approved,false);
});
test("append-only event trail contains original 180, then 46 START and 45 STAGED/1 BLOCK decisions",()=>{
 assert.equal(events.length,274);
 const tail=events.slice(180,272);
 assert.equal(tail.length,92);
 assert.equal(tail.filter(x=>x.action==="START").length,46);
 assert.equal(tail.filter(x=>x.action==="CERTIFY_STAGED").length,45);
 assert.equal(tail.filter(x=>x.action==="BLOCK").length,1);
 assert.equal(tail.filter(x=>x.action==="PUBLIC_ADMIT").length,0);
 assert.equal(new Set(tail.filter(x=>x.action==="START").map(x=>x.source_slot_id)).size,46);
 assert.ok(tail.every(x=>x.review_evidence_ref?.startsWith("data/review/p12-g03s2final-fullpaper-candidate-screening-v1.json#")));
});
test("source review count, publication count and blocker resume are reconciled without changing 205 public slots",()=>{
 const master=buildMaster();
 const row=master.paper_rows.find(x=>x.source_id===source);
 assert.equal(row.pending_before_p12,46);
 assert.equal(row.certified_staged,46);assert.equal(row.blocked,0);
 assert.equal(row.not_started,0);assert.equal(row.published,0);
 assert.equal(row.pending_remaining,0);
 assert.equal(master.position_status_counts.published,57);
 assert.equal(master.position_status_counts.certified_staged,46);
 assert.equal(master.position_status_counts.not_started,223);
 assert.equal(master.position_status_counts.blocked,0);
 assert.equal(master.public_question_bank_answer_slots_current,205);
 assert.equal(master.p12_not_publicly_released_source_positions,269);
 assert.ok(master.resume_checkpoint.source_slot_id.startsWith("G04-S2-MID|"));
 assert.equal(master.resume_checkpoint.state,"NOT_STARTED");
 assert.equal(master.next_unstarted_screening_source_id,"G04-S2-MID");
});
