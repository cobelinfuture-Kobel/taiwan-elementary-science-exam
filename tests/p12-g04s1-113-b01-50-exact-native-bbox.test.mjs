import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {build,normalizeSlot}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const load=x=>JSON.parse(fs.readFileSync('data/review/'+x,'utf8'));
const b01=load('p12-g04s1-113-native-tfmc-b01-50-original-native-glyph-bbox-readback-v1.json');
const origin=load('p12-g04s1-113-wende-mid27-real-original-answer-glyph-bbox-v1.json');
const source=load('p12-g04s1-113-native-tfmc-b01-50-pdf-text-model-kp-preflight-v1.json');

test('B01 all 50 original SHA-bounded printed answer markers have real original PDF native BBox',()=>{
 assert.equal(b01.b01_source_positions,50);
 assert.equal(b01.inherited_bbox_count,21);
 assert.equal(b01.new_bbox_recovered_from_original_pdfs,29);
 assert.equal(b01.source_positions.length,50);
 const planned=build().lanes[0].batches[0];
 assert.deepEqual(b01.source_positions.map(x=>x.source_slot_id),planned.source_slots.map(x=>x.normalized_source_slot_id));
 assert.deepEqual(b01.source_positions.map(x=>x.source_slot_id),source.rows.map(x=>x.normalized_source_slot_id));
 assert.ok(b01.source_positions.every(x=>x.source_page_pdf_1_based===1&&x.original_printed_answer_parenthesis_bbox_pts_top_left.length===4));
 for(const row of b01.source_positions) {
  const [x0,y0,x1,y1]=row.original_printed_answer_parenthesis_bbox_pts_top_left;
  assert.ok(x0>=0&&y0>=0&&x1>x0&&y1>y0&&x1<1000&&y1<1200,row.source_slot_id);
  assert.match(row.source_pdf_sha256,/^[0-9a-f]{64}$/);
  assert.equal(row.admission_ready,false);
  assert.equal(row.published,false);
 }
});

test('B01 21 Wende BBoxes are inherited unmodified from existing accepted evidence',()=>{
 const originById=new Map(origin.position_records.map(x=>[normalizeSlot(x.source_slot_id),x]));
 const wende=b01.source_positions.filter(x=>x.paper_id==='SCI_G04_S1_113_MID_001');
 assert.equal(wende.length,21);
 for(const row of wende)assert.deepEqual(row.original_printed_answer_parenthesis_bbox_pts_top_left,
  originById.get(row.source_slot_id).printed_answer_marker_parenthesis_pdf_bbox_pts_top_left);
 assert.deepEqual(wende.find(x=>x.source_slot_id.endsWith('|S1|TF|006'))?.original_printed_answer_parenthesis_bbox_pts_top_left,
 [28.56,366.42,60.52,379.37]);
});
