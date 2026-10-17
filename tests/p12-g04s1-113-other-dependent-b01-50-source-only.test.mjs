import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {build, normalizeSlot} = require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const read = file => JSON.parse(fs.readFileSync(new URL('../data/review/' + file, import.meta.url), 'utf8'));
const review = read('p12-g04s1-113-other-dependent-b01-50-source-only-preflight-v1.json');
const published = read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');

test('OTHER_OR_DEPENDENT B01 checkpoint matches frozen deterministic 50 positions', () => {
  const b01 = build().lanes.find(x => x.name === 'OTHER_OR_DEPENDENT').batches[0];
  assert.equal(review.batch, 'OTHER_OR_DEPENDENT_B01');
  assert.equal(b01.count, 50);
  assert.equal(review.records.length, 50);
  assert.deepEqual(review.records.map(x => x.normalized_source_slot_id),
    b01.source_slots.map(x => x.normalized_source_slot_id));
  assert.equal(new Set(review.records.map(x => x.normalized_source_slot_id)).size, 50);
  assert.ok(review.records.every(x => x.source_pdf_sha256 === b01.source_slots.find(y => y.normalized_source_slot_id === x.normalized_source_slot_id)?.source_pdf_sha256));
});

test('first 50 source records are grouped by parent paper, with no image/text confusion', () => {
  const count = value => review.records.filter(x => x.preliminary_route === value).length;
  assert.equal(review.metrics.wende, 28);
  assert.equal(review.metrics.zhongxiao, 22);
  assert.equal(count('SCOPE_PRELIMINARY_OUTSIDE_113_G04S1_KP48_MOON'), 17);
  assert.equal(count('PARENT_OR_GRAPHIC_MATERIAL_REQUIRED'), 12);
  assert.equal(count('SOURCE_CONTEXT_AND_ANSWER_GATES_PENDING'), 21);
  assert.ok(review.records.every(x => x.exact_source_pdf_visual_and_answer_glyph_bbox_certified === false));
});

test('4 cross-paper identical-content candidates remain dedup risks and not new admission', () => {
  assert.equal(review.crosspaper_duplicate_candidate_pairs.length, 4);
  const src = new Set(review.records.map(x => x.normalized_source_slot_id));
  for (const pair of review.crosspaper_duplicate_candidate_pairs) {
    assert.ok(src.has(normalizeSlot(pair.wende)));
    assert.ok(src.has(normalizeSlot(pair.zhongxiao)));
    assert.notEqual(normalizeSlot(pair.wende), normalizeSlot(pair.zhongxiao));
  }
  assert.equal(review.records.filter(x => x.intrabatch_duplicate_candidate !== null).length, 8);
  assert.equal(review.metrics.FORMAL_SCIENCE_KP_APPROVED_NEW, 0);
  assert.equal(review.metrics.ADMISSION_READY_NEW, 0);
  assert.equal(review.metrics.PUBLISHED_NEW, 0);
  assert.ok(review.records.every(x => !x.admission_ready && !x.published && !x.science_unique_answer_certified));
});

test('published114 suppression and unchanged main student bank are preserved', () => {
  assert.equal(published.newly_published_113_slots, 114);
  assert.equal(published.public_total_answer_slots, 750);
  assert.equal(review.metrics.main_published_113, 114);
  assert.equal(review.metrics.main_total_public, 750);
  const alreadyPublished = new Set(published.all_unique_published_source_slot_ids.map(normalizeSlot));
  assert.ok(review.records.every(x => !alreadyPublished.has(x.normalized_source_slot_id)));
  assert.equal(review.draft_source_pr, 124);
});
