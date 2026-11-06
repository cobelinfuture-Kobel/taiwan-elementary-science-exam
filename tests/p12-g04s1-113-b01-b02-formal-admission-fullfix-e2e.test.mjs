import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL('../' + p, import.meta.url), 'utf8'));
const evidence = read('data/review/p12-g04s1-113-all29-bulk-b02-133-original-text-raster-source-gate-evidence-v1.json');
const b01 = read('data/review/p12-g04s1-113-all29-bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');

test('FullFix B01 60 / B02 110 existing gate projection reads 717 original114 items and does not invent approvals', () => {
  const stdout = execFileSync(process.execPath, [
    new URL('../scripts/review/p12-g04s1-113-b01-b02-formal-admission-fullfix.mjs', import.meta.url).pathname,
    '--check',
  ], {encoding:'utf8',timeout:20000});
  const out = JSON.parse(stdout);
  assert.equal(out.counts.B01_exact_candidate_rows, 60);
  assert.equal(out.counts.B02_remaining_source_work_rows, 110);
  assert.equal(out.counts.B02_text_children_assessed, 24);
  assert.equal(out.counts.B02_scan_source_work_still_visual_semantic_pending, 86);
  assert.equal(out.counts.original114_papers, 25);
  assert.equal(out.counts.original114_answer_occurrences, 717);
  assert.equal(out.counts.B01_B02_current_candidate_text_rows_for_exact_dedup, 84);
  assert.equal(out.counts.candidate_model_science_kp_positive_not_formal, 74);
  assert.equal(out.counts.FORMAL_SCIENCE_KP_APPROVED_new, 0);
  assert.equal(out.counts.ADMISSION_READY_new, 0);
  assert.equal(out.counts.PUBLISHED_new, 0);
});
test('B01 exact60 and B02 sources are frozen and not silently promoted', () => {
  assert.equal(b01.records.length, 60);
  assert.equal(b01.operator_exact_source_publication_signoff, false);
  assert.equal(evidence.records.length, 133);
  assert.deepEqual(evidence.admission_checkpoint.B02, {
    PUBLISHED: 0,HOLD: 23,ALIAS: 0,UNREVIEWED: 110,
  });
  assert.deepEqual(evidence.admission_checkpoint.all29, {
    PUBLISHED: 333,HOLD: 359,ALIAS: 25,UNREVIEWED: 1045,
  });
});
