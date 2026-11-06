import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const plan = read('data/review/p12-g04s1-113-all29-bulk-admission-fullfix-1122-nine-batch-frozen-plan-v1.json');
const b02 = plan.batches.find((b) => b.batch_id === 'B02');
const evidence = read('data/review/p12-g04s1-113-all29-bulk-b02-133-original-text-raster-source-gate-evidence-v1.json');
const overlay = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao4-wende-exact-child-parent-duplicate-HOLD-overlay-v1.json');
const lunar = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao19-lunar-no-direct-frozen48KP-HOLD-overlay-v1.json');
const b01 = read('data/review/p12-g04s1-113-all29-bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');
const normalize = (s) => (s || '').replace(/[\s，。！？、：（）()：．.]/g, '');

test('B02 retains exactly 133 frozen source IDs and all three complete original paper groups', () => {
  assert.equal(b02.source_work_count, 133);
  assert.equal(evidence.records.length, 133);
  assert.deepEqual(evidence.records.map((r) => r.source_slot_id), b02.source_slot_ids);
  assert.deepEqual(evidence.summary.by_paper, b02.paper_unreviewed_count);
  assert.equal(new Set(evidence.records.map((r) => r.source_slot_id)).size, 133);
});

test('Zhongxiao child original text readback is explicitly not a new Science/KP admission', () => {
  const z = evidence.records.filter((r) => r.original_source_paper_id === 'SCI_G04_S1_113_MID_003');
  assert.equal(z.length, 47);
  assert.equal(z.filter((r) => r.original_text_layer_joined).length, 43);
  assert.equal(z.filter((r) => r.original_text_layer_joined && !r.evidence_type.startsWith('FESTIVAL_LABEL')).length, 39);
  assert.equal(z.filter((r) => !r.original_text_layer_joined).length, 4);
  assert.ok(z.every((r) => r.text_layer_visual_verbatim_readback_pending === true));
});

test('Exactly 86 bounded scanned source positions; only three Neian existing visual children inherited', () => {
  const scan = evidence.records.filter((r) => r.original_source_paper_id !== 'SCI_G04_S1_113_MID_003');
  assert.equal(scan.length, 86);
  assert.ok(scan.every((r) => r.original_pdf_response_region_bbox_top_left_pts?.length === 4));
  assert.equal(scan.filter((r) => r.visual_evidence_ref).length, 3);
  assert.ok(scan.filter((r) => !r.visual_evidence_ref).every((r) => r.original_child_visual_text_pending === true));
});

test('Four exact duplicate child+parent secondary Zhongxiao positions are HOLD not published ALIAS', () => {
  assert.equal(overlay.rows.length, 4);
  assert.equal(new Set(overlay.source_ids_exact).size, 4);
  for (const o of overlay.rows) {
    const item = evidence.records.find((r) => r.source_slot_id === o.source_slot_id);
    const parent = b01.records.find((r) => r.source_slot_id === o.matching_primary_source_slot_id);
    assert.ok(item && parent);
    assert.equal(item.source_disposition_effective, 'HOLD');
    assert.equal(o.new_effective_disposition, 'HOLD');
    assert.equal(o.hold_type, 'HOLD_DUPLICATE_PENDING_CANONICAL');
    assert.equal(o.matching_primary_is_published, false);
    assert.equal(normalize(o.original_child_text_layer_joined), normalize(parent.original_stem_or_item_verbatim));
    assert.equal(o.formal_science_kp_approved, false);
    assert.equal(o.admission_ready, false);
    assert.equal(o.published, false);
  }
  assert.equal(evidence.records.filter((r) => r.source_disposition_effective === 'HOLD').length, 23);
  assert.equal(evidence.records.filter((r) => r.source_disposition_effective === 'UNREVIEWED').length, 110);
});

test('No B01 or frozen 333/KP48 or unsigned exact operator student release is reopened', () => {
  assert.deepEqual(evidence.admission_checkpoint.B02, { PUBLISHED: 0, HOLD: 23, ALIAS: 0, UNREVIEWED: 110 });
  assert.deepEqual(evidence.admission_checkpoint.all29, { PUBLISHED: 333, HOLD: 359, ALIAS: 25, UNREVIEWED: 1045 });
  assert.equal(Object.values(evidence.admission_checkpoint.all29).reduce((a, b) => a + b, 0), 1762);
  assert.ok(evidence.records.every((r) => !r.formal_science_kp_approved && !r.admission_ready && !r.published));
  assert.equal(evidence.admission_checkpoint.operator_exact_approval, false);
  assert.equal(evidence.admission_checkpoint.no_333_public_change, true);
  assert.equal(evidence.admission_checkpoint.no_frozen48_change, true);
});

test('Nineteen original Moon-topic source positions have no direct KP in frozen 48 and are HOLD only', () => {
  assert.equal(lunar.rows.length, 19);
  assert.equal(new Set(lunar.original_source_IDs_exact).size, 19);
  assert.equal(lunar.frozen_113_g04s1_kp_count, 48);
  assert.equal(lunar.direct_lunar_phase_or_moon_position_or_angle_kp_count, 0);
  const four = new Set(overlay.source_ids_exact);
  for (const row of lunar.rows) {
    assert.equal(four.has(row.source_slot_id), false);
    assert.equal(row.new_effective_disposition, 'HOLD');
    assert.equal(row.direct_frozen48kp_id, null);
    assert.ok(row.source_child_text_layer_joined || row.source_parent_topic_text_layer_joined);
    const linked = evidence.records.find((r) => r.source_slot_id === row.source_slot_id);
    assert.equal(linked?.source_disposition_effective, 'HOLD');
    assert.equal(linked?.formal_science_kp_approved, false);
    assert.equal(linked?.admission_ready, false);
    assert.equal(linked?.published, false);
  }
});
