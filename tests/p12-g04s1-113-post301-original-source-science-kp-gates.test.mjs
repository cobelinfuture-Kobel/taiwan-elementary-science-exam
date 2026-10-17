import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync('data/review/'+n,'utf8'));
const progress=read('p12-g04s1-113-post301-source-science-kp-dedup-closeout-checkpoint-v1.json');
const sci=[
 read('p12-g04s1-113-native-tfmc-b05-50-science-kp-parent-exception-routing-v1.json'),
 read('p12-g04s1-113-native-tfmc-b06-50-science-kp-context-routing-v1.json'),
 read('p12-g04s1-113-native-tfmc-b07-1-science-kp-context-routing-v1.json')
];
const text=[
 read('p12-g04s1-113-native-tfmc-b05-50-pdf-text-source-v2.json'),
 read('p12-g04s1-113-native-tfmc-b06-50-pdf-text-source-v2.json'),
 read('p12-g04s1-113-native-tfmc-b07-1-pdf-text-source-v1.json')
];
const bbox=[
 read('p12-g04s1-113-native-tfmc-b05-50-original-native-glyph-bbox-v1.json'),
 read('p12-g04s1-113-native-tfmc-b06-50-original-native-glyph-bbox-v1.json'),
 read('p12-g04s1-113-native-tfmc-b07-1-original-native-glyph-bbox-v1.json')
];
const shards=['01','02','03'].map(n=>read('p12-g04s1-113-native-b05b07-101-vs114-source-shard'+n+'-v1.json'));
const semantic=read('p12-g04s1-113-b03b04-five-crossyear-source-semantic-adjudications-v1.json');
const kp=JSON.parse(fs.readFileSync('site/data/authority/science-g03-g04-selector-v3.json','utf8'));
test('113 native B05-B07 all 101 full exact source-ID/BBox and science queues remain aligned',()=>{
 const ids=[];
 for(let i=0;i<3;i++){
  const sourceIds=text[i].source_records.map(x=>x.source_slot_id);
  assert.deepEqual(sourceIds,bbox[i].source_positions.map(x=>x.source_slot_id));
  assert.deepEqual(sourceIds,sci[i].items?.map(x=>x.source_slot_id) || sci[i].records.map(x=>x.source_slot_id));
  ids.push(...sourceIds);
 }
 assert.equal(ids.length,101);
 assert.equal(new Set(ids).size,101);
 assert.deepEqual(sci.map(x=>x.counts?.direct_answer_kp_text_candidates??x.direct_science_and_KP_text_candidates),[26,18,0]);
 assert.equal(sci[0].counts.hold_or_wrong_scope,24);
 assert.equal(sci[1].hold_and_outscope,32);
 assert.equal(sci[2].hold_and_outscope,1);
 const known=new Set(kp.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(x=>x.canonical_kp_id)));
 for(const [i,s]of sci.entries())for(const x of s.items||s.records){
  const item=text[i].source_records.find(z=>z.source_slot_id===x.source_slot_id);
  const k=x.provisional_direct_frozen_kp??x.canonical_kp_candidate;
  assert.ok(!k||known.has(k),x.source_slot_id);
  if(k)assert.match(k,item.source_scope==='FINAL_U03_U04'?/_0[34]_/:/_0[12]_/);
  assert.equal(x.formal_science_kp_approved,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
 }
});
test('B06 original moon figure and 12 reading children do not become independent published claims',()=>{
 const moon=text[1].source_records.find(x=>x.source_slot_id==='SCI_G04_S1_113_MID_018|S2|MC|2');
 assert.equal(moon.source_context_dependency,'ORIGINAL_PDF_GRAPHIC_CHOICES');
 assert.equal(moon.original_option_graphics_missing_in_text_layer.length,3);
 assert.equal(text[1].metrics.mc_choices_graphic_hold,1);
 const children=text.flatMap(x=>x.source_records).filter(x=>x.source_context_dependency==='SHARED_READING_PARENT');
 assert.equal(children.length,12);
 assert.ok(children.every(x=>x.parent_ref));
 assert.ok(children.every(x=>!x.admission_ready&&!x.published));
});
test('B05 raw footer fix preserves original v1 and does not contaminate final options',()=>{
 const last=text[0].source_records.find(x=>x.source_slot_id==='SCI_G04_S1_113_FINAL_006|S2|MC|12');
 assert.ok(!last.original_ordered_choices[3].text.includes('新北市'));
 assert.equal(text[0].source_text_corruptions_corrected.length,3);
 assert.equal(text[1].source_text_footer_and_narrative_corrections.length,6);
});
test('Source-only all301 crossyear all25/717 comparison and active-bank Gate remain separate',()=>{
 const p=progress.source_progress,d=progress.all_114_original_exam_archive_source_duplicate_screen;
 assert.equal(p.native_source_position_queue_301,301);
 assert.equal(p.native_printed_marker_bbox_readback,301);
 assert.equal(p.other_or_dependent_source_lane_not_yet_processed,408);
 assert.equal(d.original114_papers,25);
 assert.equal(d.original114_records,717);
 assert.equal(d.all_301_crossyear_exact,6);
 assert.equal(d.all_301_crossyear_near,10);
 assert.equal(d.all_301_internal_original_exact_duplicate_pairs,6);
 assert.equal(shards.reduce((n,x)=>n+x.original114_answer_items,0),717);
 assert.equal(new Set(shards.flatMap(x=>x.original114_papers)).size,25);
 assert.equal(semantic.candidates.length,5);
 assert.equal(d.full_active_learner_bank_semantic_duplicate_gate_completed,false);
 assert.equal(progress.formal_gate.FORMAL_SCIENCE_KP_APPROVED_NEW,0);
 assert.equal(progress.formal_gate.ADMISSION_READY_NEW,0);
 assert.equal(progress.formal_gate.PUBLISHED_NEW,0);
 assert.equal(progress.public_site_unchanged.existing_site_public_answer_slots||progress.public_site_unchanged.all_public_answer_slots,750);
});
