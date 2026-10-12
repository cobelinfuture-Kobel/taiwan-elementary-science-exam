import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const audit=read("data/review/p12-g03s2mid-remaining51-source-editorial-audit-v1.json");
const staged=read("data/staging/p12-g03s2mid-remaining51-staged-v1.json");
const release=read("site/data/question-bank/p12-g03s2mid-approved-six-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const canon=new Set(authority.units.flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
const flatten=x=>x.blocks.flatMap(b=>b.type==="group"?b.items.map(q=>({...q,block:b})): [{...b,block:b}]);
test("51 original source candidates are recovered with true PDF source locations and unchanged answers",()=>{
 assert.equal(audit.stage_review_positions,51);
 assert.equal(audit.distinct_source_slots,51);
 assert.equal(audit.records.length,51);
 assert.deepEqual(audit.section_counts,{TF:10,MC:11,COMPOSITE:26,READ:4});
 const ids=audit.records.map(x=>x.source_slot_id);
 assert.equal(new Set(ids).size,51);
 assert.ok(audit.records.every(x=>x.source_pdf_sha256===audit.source_pdf_sha256 && x.public_release_authorized===false &&
 x.source_original_stem && x.science_review_answer!=null && canon.has(x.verified_canonical_kp_id)));
 assert.equal(audit.editorial_modification_required_count,6);
 assert.equal(audit.near_duplicate_watch_count,10);
 assert.equal(audit.records.filter(x=>x.additional_review_flag).length,6);
});
test("51 staged learner candidates have precisely 51 source slots with six original six excluded",()=>{
 assert.equal(staged.public_site_integrated,false);
 assert.equal(staged.operator_approval_received,false);
 assert.equal(staged.candidate_source_positions,51);
 assert.equal(staged.expected_question_blocks,27);
 assert.equal(staged.expected_context_groups,6);
 assert.equal(staged.blocks.length,27);
 const items=flatten(staged),slots=new Set(items.map(x=>x.source_slot_id));
 assert.equal(items.length,51);
 assert.equal(slots.size,51);
 assert.equal(new Set(audit.records.map(x=>x.source_slot_id)).size,51);
 assert.ok(audit.records.every(x=>slots.has(x.source_slot_id)));
 const releasedSlots=new Set(flatten(release).map(x=>x.source_slot_id));
 assert.equal(releasedSlots.size,6);
 assert.ok([...slots].every(x=>!releasedSlots.has(x)));
 assert.ok(staged.blocks.every(b=>b.release_status==="EDITORIAL_REVIEW_STAGED_NOT_PUBLIC"&&b.operator_publication_approval===false));
 assert.ok(items.every(x=>canon.has(x.canonical_kp_id)));
});
test("all shared group dependencies are preserved with no 21-slot overlong atomic group",()=>{
 const groups=staged.blocks.filter(x=>x.type==="group");
 assert.deepEqual(groups.map(g=>g.items.length),[5,4,7,7,3,4]);
 assert.equal(groups.reduce((n,g)=>n+g.items.length,0),30);
 assert.ok(groups.every(g=>g.shared.instructions && Array.isArray(g.shared.choiceBank) && g.atomic_group_preserved_via_repeated_source_choice_bank));
 assert.equal(groups[0].shared.choiceBank.length,12);
 assert.ok(groups.slice(1,5).every(g=>g.shared.choiceBank.length===4));
 const hyd=groups.at(-1);
 assert.ok(hyd.shared.passage.includes("打氣機")&&hyd.shared.passage.includes("光照"));
 assert.deepEqual(hyd.items.map(x=>x.answer),["O","O","X","X"]);
});
test("science editorial revisions are targeted and do not mutate the original source text ledger",()=>{
 const itemById=new Map(flatten(staged).map(x=>[x.source_slot_id,x]));
 const modified=audit.records.filter(x=>x.additional_review_flag);
 assert.equal(modified.length,6);
 for(const original of modified){
  const revised=itemById.get(original.source_slot_id);
  assert.ok(revised);
  if(revised.type!=="mcq"){
   assert.notEqual(revised.stem,original.source_original_stem);
  }else{
   assert.notEqual(revised.options[0], "① "+original.source_original_options_or_shared_bank[0]);
   assert.ok(revised.stem===original.source_original_stem);
  }
 }
 assert.equal(staged.public_site_integrated,false);
 assert.equal(release.public_site_integrated,true);
});
