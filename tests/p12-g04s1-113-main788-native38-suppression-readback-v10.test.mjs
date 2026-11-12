import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const review = (name) => JSON.parse(readFileSync(new URL('../data/review/' + name, import.meta.url), 'utf8'));
const previous = review('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
const latest = review('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
const repaired = review('p12-g04s1-113-native46-two-original-visual-textcontamination-repairs-v1.json');

test('PR143 Native38+PR144 live deployed 788 suppression is append-only, disjoint and exact', () => {
  const oldIds = previous.all_unique_published_source_slot_ids;
  const allIds = latest.all_unique_published_source_slot_ids;
  const native38 = latest.incremental_pr143_published_source_slot_ids;
  assert.equal(previous.newly_published_113_slots, 114);
  assert.equal(previous.public_total_answer_slots, 750);
  assert.equal(latest.pre_113_public_baseline, 636);
  assert.equal(latest.newly_published_113_slots, 152);
  assert.equal(latest.public_total_answer_slots, 788);
  assert.equal(latest.prior_113_published_slots, 114);
  assert.equal(latest.incremental_native38_published_slots, 38);
  assert.equal(oldIds.length, 114);
  assert.equal(native38.length, 38);
  assert.equal(allIds.length, 152);
  assert.equal(new Set(allIds).size, 152);
  assert.deepEqual(allIds.slice(0, 114), oldIds);
  assert.deepEqual(allIds.slice(114), native38);
  assert.ok(native38.every(id => !new Set(oldIds).has(id)));
  assert.ok(latest.approved_batches.some(batch => batch.pr === 143 && batch.count === 38 && batch.pages_e2e_fix_pr === 144));
  assert.equal(latest.main_commit, '2229627cf5aa5acc395ef47f66cddbe8c5da2e5e');
  assert.equal(latest.public_pages_live_e2e_success, true);
  assert.match(latest.live_pages_verification_run, /39186358481/);
  assert.match(latest.science_ci_run, /39186358516/);
});

test('unpublished repairs and six source-science KP exceptions remain on HOLD', () => {
  const pending = latest.next_exception_gate;
  assert.equal(repaired.summary.new_formal_science_direct_kp_verified, 2);
  assert.equal(pending.post143_source_visual_science_kp_repaired_unpublished, 2);
  assert.deepEqual(pending.repaired_unpublished_source_slot_ids, repaired.records.map(x=>x.source_slot_id));
  assert.equal(pending.remaining_unresolved_count, 6);
  assert.equal(new Set(pending.remaining_unresolved_source_slot_ids).size, 6);
  assert.equal(pending.scan5_remaining_exact_raster_pixel_bbox_slots, 239);
  assert.equal(pending.repaired2_operator_final_release_batch_approval, false);
  assert.equal(pending.no_new_admission_ready_or_published_on_source_branch, true);
  const published = new Set(latest.all_unique_published_source_slot_ids);
  for (const id of [...pending.repaired_unpublished_source_slot_ids, ...pending.remaining_unresolved_source_slot_ids]) {
    assert.ok(!published.has(id), 'exception must not be inadvertently published: ' + id);
  }
  assert.equal(latest.source_branch_is_draft_and_not_merged, true);
  assert.equal(latest.do_not_auto_admit_unverified_review_candidates, true);
  assert.equal(latest.legacy_exception_priority_preserved_from_v9.length, previous.latest_exception_priority.length);
  assert.match(latest.duplicate_policy, /genuinely different original wording/);
  assert.match(latest.duplicate_policy, /superficial option\/order\/punctuation\/layout permutations/);
});
