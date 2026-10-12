import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const stage=read("data/staging/p12-g03s2final-46-learner-blocks-v1.json");
const original=read("data/review/p12-g03s2final-46-final-source-acceptance-v1.json");
const fig=read("data/review/p12-g03s2final-figure-reconstruction-v1.json");
const reading=read("data/review/p12-g03s2final-reading-groups-v1.json");
const cloud=read("data/review/p12-g03s2final-mc06-referenced-reading-resolution-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const flat=stage.blocks.flatMap(b=>(b.type==="group"?b.items:[b]).map(item=>({...item,block_id:b.id,block_unit:b.unit})));
const roots=new Map(original.items.map(x=>[x.source_slot_id,x]));
const authorized=new Set(authority.units.flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test("46 source slots are carried exactly once through 28 learner-facing blocks",()=>{
 assert.equal(stage.public_site_integrated,false);
 assert.equal(stage.operator_public_release_approved,false);
 assert.equal(stage.expected_blocks,28);
 assert.equal(stage.expected_answer_slots,46);
 assert.equal(stage.expected_singles,20);
 assert.equal(stage.expected_figure_groups,6);
 assert.equal(stage.expected_reading_groups,2);
 assert.equal(stage.blocks.length,28);
 assert.equal(flat.length,46);
 assert.equal(new Set(flat.map(x=>x.source_slot_id)).size,46);
 assert.ok(flat.every(x=>roots.has(x.source_slot_id)));
 assert.ok(original.items.every(x=>flat.some(y=>y.source_slot_id===x.source_slot_id)));
});
test("all answers and primary canonical KPs retain original final source acceptance, no inferred teacher key",()=>{
 for(const b of stage.blocks){
  assert.ok(b.unit==="3-S2-U03"||b.unit==="3-S2-U04",b.id);
  assert.equal(b.source_pdf_sha256,original.source_pdf_sha256);
  assert.equal(b.source_original_teacher_key_authenticated,false);
  assert.equal(b.public_release_authorized,false);
  assert.ok(authorized.has(b.canonical_kp_id));
  if(b.type==="group")assert.ok(b.items.length>=2);
 }
 for(const item of flat){
  const o=roots.get(item.source_slot_id);
  assert.equal(item.answer,o.independent_science_answer,item.source_slot_id);
  assert.equal(item.canonical_kp_id,o.source_canonical_kp_id,item.source_slot_id);
  assert.ok(item.stem?.trim());
  assert.ok(item.answer_explanation?.trim());
  if(item.type==="mcq")assert.equal(item.options?.length,4);
 }
});
test("6 figure groups render as original-vector-only, with complete source subitems and explicit scalable viewBox",()=>{
 const groups=stage.blocks.filter(x=>x.type==="group"&&x.figure_spec);
 assert.equal(groups.length,6);
 assert.deepEqual(groups.map(b=>b.items.length),[4,3,4,4,3,4]);
 assert.deepEqual(groups.map(b=>b.figure_spec.kind),fig.figure_groups.map(g=>g.kind));
 assert.equal(fig.expected_source_slots,22);
 for(const b of groups){
  assert.equal(b.figure_spec.viewBox,"0 0 460 236");
  assert.equal(b.figure_spec.preserveAspectRatio,"xMidYMid meet");
  assert.equal(b.figure_spec.scale_policy,"MAX_WIDTH_100_PERCENT_AUTO_HEIGHT");
  assert.equal(b.figure_spec.labels.length,b.items.length);
  assert.equal(b.source_pdf_cropped_images_included,false);
 }
 const wind=groups.find(b=>b.figure_spec.kind==="wind-directions");
 assert.deepEqual(wind.items.map(x=>x.answer),["B","A","D","F"]);
 assert.match(wind.figure_spec.labels[1],/箭頭朝東/);
 assert.match(wind.figure_spec.labels[3],/下垂/);
});
test("two shared-reading blocks preserve answer slots, context and source-limited rainfall statistics",()=>{
 const groups=stage.blocks.filter(x=>x.type==="group"&&!x.figure_spec);
 assert.equal(groups.length,2);
 assert.equal(reading.expected_source_slots,4);
 assert.deepEqual(groups.map(x=>x.items.length),[2,2]);
 assert.ok(groups[0].shared.passage.includes("赤腹松鼠"));
 assert.ok(groups[1].shared.passage.includes("西北雨"));
 assert.ok(groups[1].shared.passage.includes("41.4%"));
 assert.ok(groups[1].shared.passage.includes("不表示每一年都完全相同"));
 assert.deepEqual(groups.map(x=>x.items.map(y=>y.answer)),[["③","①"],["②","④"]]);
});
test("cloud-reading MC06 uses approved self-contained rewrite while original question remains unmodified",()=>{
 const b=stage.blocks.find(x=>x.source_slot_id==="G03-S2-FINAL|MC|P01|006");
 assert.ok(b);
 assert.equal(b.answer,"①");
 assert.equal(b.stem,cloud.learner_revision.stem);
 assert.deepEqual(b.options,cloud.learner_revision.options.map(x=>x.replace(/^([①②③④])\s*/,"$1 ")));
 assert.equal(b.editorial_status,"SELF_CONTAINED_CLOUD_READING_RECONSTRUCTION");
 assert.equal(cloud.original_source_unchanged,true);
});
test("48th source item or already published eight TF cannot silently join staged release",()=>{
 assert.equal(new Set(flat.map(x=>x.source_slot_id)).size,46);
 for(let n=2;n<=9;n++)assert.ok(!flat.some(x=>x.source_slot_id===`G03-S2-FINAL|TF|P01|${String(n).padStart(3,"0")}`));
});
