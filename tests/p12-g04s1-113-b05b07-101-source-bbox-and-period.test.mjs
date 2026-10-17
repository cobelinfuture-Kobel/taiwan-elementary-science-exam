import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const read=n=>JSON.parse(fs.readFileSync('data/review/'+n,'utf8'));
const paths=['b05-50','b06-50','b07-1'];
const prefixes=paths.map(k=>'p12-g04s1-113-native-tfmc-'+k);
const lists=prefixes.map(p=>read(p+'-source-checkpoint-v1.json'));
const texts=prefixes.map(p=>read(p+'-pdf-text-source-v1.json'));
const boxes=prefixes.map(p=>read(p+'-original-native-glyph-bbox-v1.json'));
test('B05 B06 B07 source-suppressed residual 101 native slots match exactly 301 frozen deterministic queue',()=>{
 let seen=[];
 for(let i=0;i<3;i++){
  const planned=build().lanes[0].batches[i+4].source_slots.map(x=>x.normalized_source_slot_id);
  const queued=lists[i].records.map(x=>x.source_slot_id);
  const recovered=texts[i].source_records.map(x=>x.source_slot_id);
  const native=boxes[i].source_positions.map(x=>x.source_slot_id);
  assert.deepEqual(planned,queued);
  assert.deepEqual(queued,recovered);
  assert.deepEqual(recovered,native);
  assert.equal(texts[i].metrics.original_stem_text_count,lists[i].source_positions);
  assert.equal(boxes[i].metrics.exact_source_native_glyph_markers,lists[i].source_positions);
  assert.ok(texts[i].source_records.every(x=>x.original_pdf_text_layer_stem.trim().length>0&&!x.admission_ready&&!x.published));
  assert.ok(texts[i].source_records.filter(x=>x.question_kind==='MC').every(x=>x.original_ordered_choices.length===4));
  assert.ok(boxes[i].source_positions.every(x=>x.source_pdf_sha256.match(/^[0-9a-f]{64}$/)&&x.pdf_page_1_based>=1&&x.pdf_page_1_based<=3));
  assert.ok(boxes[i].source_positions.every(x=>{const [a,b,c,d]=x.original_answer_parenthesis_bbox_pts_top_left;return a>=0&&b>=0&&c>a&&d>b&&c<1200&&d<1500}));
  seen.push(...queued);
 }
 assert.equal(seen.length,101);
 assert.equal(new Set(seen).size,101);
 assert.deepEqual(lists.map(x=>x.source_positions),[50,50,1]);
});
test('Midterm and final frozen unit period routing cannot be interchanged',()=>{
 assert.deepEqual(texts.map(x=>x.scope_routing),[
  {midterm_source_items:30,final_source_items:20},
  {midterm_source_items:22,final_source_items:28},
  {midterm_source_items:0,final_source_items:1}]);
 assert.ok(texts.flatMap(x=>x.source_records).every(x=>x.source_scope=== (x.source_slot_id.includes('|S')&&x.source_slot_id.includes('_FINAL_')?'FINAL_U03_U04':'MIDTERM_U01_U02')));
});
test('All 12 reading-child slots retain parent passage and do not auto-admit',()=>{
 const all=texts.flatMap(x=>x.source_records);
 const deps=all.filter(x=>x.source_context_dependency==='SHARED_READING_PARENT');
 assert.equal(deps.length,12);
 assert.equal(deps.filter(x=>x.source_slot_id.includes('_MID_015|S6|')).length,5);
 assert.equal(deps.filter(x=>x.source_slot_id.includes('_FINAL_010|S3|')).length,7);
 for(const record of deps){
  const parent=texts.flatMap(x=>x.shared_parent_reading_material).find(x=>x.id===record.parent_ref);
  assert.ok(parent&&parent.original_source_text_layer_parent.length>100);
  assert.equal(record.formal_science_kp_approved,false);
 }
});
test('B04 field correction preserves science and admission data',()=>{
 const v1=read('p12-g04s1-113-native-tfmc-b04-50-science-kp-consolidated-v1.json');
 const v2=read('p12-g04s1-113-native-tfmc-b04-50-science-kp-consolidated-v2.json');
 const old=v1.records.find(x=>x.source_slot_id.endsWith('MID_014|S1|TF|1'));
 const fixed=v2.records.find(x=>x.source_slot_id.endsWith('MID_014|S1|TF|1'));
 assert.equal(old.route,'01_02');
 assert.equal(fixed.route,'HOLD_LOCALITY_UNVERIFIED');
 assert.equal(fixed.answer_from_original_text,null);
 assert.equal(v2.routing_counts.DIRECT,38);
 assert.equal(v2.routing_counts.HOLD_LOCALITY_UNVERIFIED,1);
 assert.equal(Object.values(v2.routing_counts).reduce((a,b)=>a+b,0),50);
 assert.equal(v2.counts.new_formal_science_kp_approved,0);
 assert.equal(v2.counts.new_admission_ready,0);
 assert.equal(v2.counts.new_published,0);
});
