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
  assert.equal(out.counts.B02_remaining_source_work_rows, 109);
  assert.equal(out.counts.B02_published_lineage_alias_from_previous_unreviewed, 1);
  assert.equal(out.counts.B02_text_children_assessed, 23);
  assert.equal(out.counts.B02_scan_source_work_still_visual_semantic_pending, 86);
  assert.equal(out.counts.original114_papers, 25);
  assert.equal(out.counts.original114_answer_occurrences, 717);
  assert.equal(out.counts.B01_B02_current_candidate_text_rows_for_exact_dedup, 83);
  assert.equal(out.counts.candidate_model_science_kp_positive_not_formal, 74);
  assert.equal(out.counts.source_stem_exact114_hits, 0);
  assert.equal(out.counts.source_stem_exact_live_bank_hits, 0);
  assert.equal(out.counts.previously_resolved_published_lineage_alias_count, 1);
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

test('New one-source ALIAS overlay inherits a published question lineage without new student bank item', () => {
  const alias = read('data/review/p12-g04s1-113-all29-b01b02-fullfix-zhongxiao-mc004-existing-published-lineage-alias-overlay-v1.json');
  const publicBank = read('site/data/question-bank/p12-g04s1-113-b01-wende7-standalone-public-v1.json');
  const live = publicBank.blocks.find(x => x.id === alias.already_public_student_id);
  assert.ok(live?.source_lineage_ids?.includes(alias.exact_source_slot_id));
  assert.equal(alias.new_student_question_items, 0);
  assert.deepEqual(alias.after_B02, {PUBLISHED:0,HOLD:23,ALIAS:1,UNREVIEWED:109});
  assert.deepEqual(alias.after_all29, {PUBLISHED:333,HOLD:359,ALIAS:26,UNREVIEWED:1044});
});
