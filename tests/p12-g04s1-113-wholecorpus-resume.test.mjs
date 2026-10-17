import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {build, normalizeSlot} = require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');

test('113 source identity aliases normalize without losing section/group', () => {
  assert.equal(
    normalizeSlot('SCI_G04_S1_113_MID_001|S01|TRUE_FALSE|006'),
    normalizeSlot('SCI_G04_S1_113_MID_001|S1|TF|6'));
  assert.equal(
    normalizeSlot('SCI_G04_S1_113_MID_011|S02|SINGLE_CHOICE|07'),
    normalizeSlot('SCI_G04_S1_113_MID_011|S2|MC|007'));
  assert.notEqual(
    normalizeSlot('SCI_G04_S1_113_MID_011|S06|G01|TRUE_FALSE_SUB|01'),
    normalizeSlot('SCI_G04_S1_113_MID_011|S06|G02|TRUE_FALSE_SUB|01'));
});

test('29 original source papers and published114 suppression are fail-closed', () => {
  const r = build();
  assert.equal(r.metrics.original_papers, 29);
  assert.equal(r.metrics.unique_identified_task_positions, 775);
  assert.equal(r.metrics.paper_count_in_these_three_ledgers, 14);
  assert.equal(r.metrics.papers_not_covered_by_these_three_ledgers, 15);
  assert.equal(r.metrics.published_113_all_sources, 114);
  assert.equal(r.metrics.published_alias_overlap_in_these_three_ledgers, 63);
  assert.equal(r.metrics.known_exception_holds_in_these_three_ledgers, 3);
  assert.equal(r.metrics.pending_identified_positions, 709);
  assert.equal(r.metrics.native_independent_pending, 301);
  assert.equal(r.metrics.other_or_dependent_pending, 408);
  assert.equal(r.metrics.formal_new_science_kp_approved_not_yet_certified, 0);
  assert.equal(r.metrics.new_admission_ready_not_yet_certified, 0);
  assert.equal(r.metrics.new_published_this_orchestration, 0);
  assert.ok(r.published_pages_live_e2e_run.includes('/actions/runs/'));
});

test('deterministic batch50 shards cover each pending task once, no tiny publish releases', () => {
  const r = build();
  const all = r.lanes.flatMap(l => l.batches);
  assert.deepEqual(r.lanes.map(x => x.batches.map(b => b.count)),
    [[50, 50, 50, 50, 50, 50, 1], [50, 50, 50, 50, 50, 50, 50, 50, 8]]);
  assert.equal(all.length, 16);
  const ids = all.flatMap(b => b.source_slots.map(x => x.normalized_source_slot_id));
  assert.equal(ids.length, 709);
  assert.equal(new Set(ids).size, 709);
  assert.equal(all[0].batch, 'NATIVE_TFMC_B01');
  assert.equal(all[0].count, 50);
  assert.ok(all[0].source_slots.every(s => s.lane === 'NATIVE_TFMC'));
  assert.ok(all.every(b => b.count <= 50));
  assert.deepEqual(build(), build());
});

test('all pending entries remain source-only, never certified or published', () => {
  const r = build();
  for (const item of r.lanes.flatMap(l => l.batches).flatMap(b => b.source_slots)) {
    assert.equal(item.queue_status, 'NEEDS_EXISTING_GATE_EVIDENCE');
    assert.ok(item.source_pdf_sha256?.match(/^[0-9a-f]{64}$/));
    assert.ok(item.mandatory_unverified_before_admission.includes('CROSSYEAR_SEMANTIC_DEDUP'));
    assert.ok(item.mandatory_unverified_before_admission.includes('SCIENCE_UNIQUE_ANSWER'));
  }
  assert.equal(r.purpose, 'SOURCE_ONLY_CONTINUATION_NOT_RELEASE_NOT_NEW_ADMISSION_GATE');
});
