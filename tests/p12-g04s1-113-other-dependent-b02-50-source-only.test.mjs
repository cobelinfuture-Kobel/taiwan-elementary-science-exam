import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {build, normalizeSlot} = require('../scripts/review/p12-g04s1-113-wholecorpus-legacy-snapshot.cjs');
const read = file => JSON.parse(fs.readFileSync(new URL('../data/review/' + file, import.meta.url), 'utf8'));
const d = read('p12-g04s1-113-other-dependent-b02-50-source-only-preflight-v1.json');
test('B02 50 source positions exactly follow frozen 408 other/dependent queue', () => {
  const lane = build().lanes.find(x => x.name === 'OTHER_OR_DEPENDENT');
  assert.equal(lane.position_count, 408);
  const b01 = lane.batches[0], b02 = lane.batches[1];
  assert.equal(b01.count, 50);
  assert.equal(b02.count, 50);
  assert.deepEqual(d.records.map(x => x.normalized_source_slot_id),
    b02.source_slots.map(x => x.normalized_source_slot_id));
  assert.equal(new Set(d.records.map(x => x.normalized_source_slot_id)).size, 50);
  assert.deepEqual(d.records.map(x => x.global_other_queue_ordinal), Array.from({length:50},(_,i)=>i+51));
});
test('B02 scope/parent classification keeps all items pending and first 100 unique', () => {
  const counts = d.records.reduce((o,x)=>(o[x.preliminary_route]=(o[x.preliminary_route]||0)+1,o),{});
  assert.equal(counts.SCOPE_PRELIMINARY_MOON_OUTSIDE_G04S1_KP48,19);
  assert.equal(counts.MIDTERM_U03_SHADOW_MISMATCH_PARENT_PENDING,4);
  assert.equal(counts.ORIGINAL_PARENT_FIGURE_BBOX_REQUIRED,5);
  assert.equal(counts.SOURCE_PARENT_AND_CONTEXT_GATES_PENDING,22);
  assert.equal(d.metrics.zhongxiao,10);
  assert.equal(d.metrics.dongguang,27);
  assert.equal(d.metrics.minquan,13);
  assert.ok(d.records.every(x=>!x.original_visual_parent_and_answer_bbox_certified&&!x.admission_ready&&!x.published));
  const a = read('p12-g04s1-113-other-dependent-b01-50-source-only-preflight-v1.json');
  const ids=[...a.records.map(x=>x.normalized_source_slot_id),...d.records.map(x=>x.normalized_source_slot_id)];
  assert.equal(ids.length,100);
  assert.equal(new Set(ids).size,100);
});
test('B02 does not change Science/KP formal approval, published suppression or site', () => {
  const published=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
  assert.equal(published.newly_published_113_slots,114);
  assert.equal(published.public_total_answer_slots,750);
  assert.equal(d.metrics.site_published113_unchanged,114);
  assert.equal(d.metrics.site_total_unchanged,750);
  assert.equal(d.metrics.FORMAL_SCIENCE_KP_APPROVED_NEW,0);
  assert.equal(d.metrics.ADMISSION_READY_NEW,0);
  assert.equal(d.metrics.PUBLISHED_NEW,0);
  const already=new Set(published.all_unique_published_source_slot_ids.map(normalizeSlot));
  assert.ok(d.records.every(x=>!already.has(x.normalized_source_slot_id)));
});