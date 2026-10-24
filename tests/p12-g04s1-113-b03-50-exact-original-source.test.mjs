import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('../scripts/review/p12-g04s1-113-wholecorpus-legacy-snapshot.cjs');
const read=f=>JSON.parse(fs.readFileSync('data/review/'+f,'utf8'));
const checkpoint=read('p12-g04s1-113-native-tfmc-b03-50-source-checkpoint-v1.json');
const source=read('p12-g04s1-113-native-tfmc-b03-50-original-pdf-text-preflight-v1.json');
const geometry=read('p12-g04s1-113-native-tfmc-b03-50-real-original-glyph-bbox-v1.json');
test('B03 follows B01/B02: all 50 identifiers, 3 PDF hashes, and no student admission',()=>{
 const planned=build().lanes[0].batches[2].source_slots.map(x=>x.normalized_source_slot_id);
 assert.equal(checkpoint.source_position_count,50);
 assert.deepEqual(checkpoint.records.map(x=>x.normalized_source_slot_id),planned);
 assert.deepEqual(source.records.map(x=>x.source_slot_id),planned);
 assert.deepEqual(geometry.source_marker_records.map(x=>x.original_source_slot_id),planned);
 assert.equal(source.metrics.full_original_question_text_layer,50);
 assert.equal(geometry.source_marker_count,50);
 assert.deepEqual(geometry.paper_mix.map(x=>x.positions),[12,22,16]);
 assert.equal(source.metrics.tf_positions,22);
 assert.equal(source.metrics.mc_positions,28);
 assert.equal(source.metrics.mc_ordered_4_options_readback,28);
 assert.equal(source.metrics.mc_option_incomplete,0);
 assert.equal(geometry.source_page2_count,1);
 assert.equal(geometry.new_admission_ready,0);
 assert.equal(geometry.new_published,0);
 assert.ok(source.records.every(x=>!x.admission_ready && !x.published));
});
test('B03 original Anhe question15 continues on actual PDF page2; no fabricated page1 BBox',()=>{
 const anhe=geometry.source_marker_records.find(x=>x.original_source_slot_id==='SCI_G04_S1_113_MID_009|S2|MC|15');
 assert.equal(anhe.pdf_page_1_based,2);
 assert.deepEqual(anhe.pdf_bbox_pts_top_left,[40.44,63.39,68.46,77.43]);
 assert.ok(geometry.source_marker_records.every(x=>x.source_exact_pdf_sha.match(/^[0-9a-f]{64}$/)));
 assert.ok(geometry.source_marker_records.every(x=>{
  const [x0,y0,x1,y1]=x.pdf_bbox_pts_top_left;
  return x0>=0&&x1>x0&&y0>=0&&y1>y0&&x1<1000&&y1<1200;
 }));
});
