import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file) => JSON.parse(readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
const x = read('data/review/p12-g04s1-113-b01b02-fullfix-science-directKP-existing-gate70-accepted-4specific-hold-v1.json');
const origB01 = read('data/review/p12-g04s1-113-all29-bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');
const origB02 = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao24-original-science-directKP-model-prelim-v1.json');
const author = read('site/data/authority/science-g03-g04-selector-v3.json');
const kps = new Set(author.units.filter(u => u.grade === 4 && u.semester === 1)
  .flatMap(u => u.knowledge_points.map(k => k.canonical_kp_id)));

test('Exactly 70 accepted source-level science and direct KP components, 4 explicitly held source science risks', () => {
  assert.equal(kps.size, 48);
  assert.equal(x.rows_accepted.length, 70);
  assert.equal(x.rows_unaccepted_gated.length, 4);
  assert.equal(new Set(x.rows_accepted.map(r => r.source_slot_id)).size, 70);
  assert.equal(x.rows_accepted.filter(r => r.batch === 'B01').length, 56);
  assert.equal(x.rows_accepted.filter(r => r.batch === 'B02').length, 14);
  assert.ok(x.rows_accepted.every(r => r.independent_science_directkp_acceptance === true &&
    r.formal_science_kp_component_acceptance === true &&
    kps.has(r.direct_frozen48_kp) && r.independent_science_answer_not_school_key &&
    r.independent_science_explanation && r.original_child_exact_text));
  assert.ok(x.rows_unaccepted_gated.every(r => !r.independent_science_directkp_acceptance &&
    !r.formal_science_kp_component_acceptance && r.acceptance_hold_reason));
});
test('Science acceptance cannot silently grant operator release, Rights or public PUBLISHED', () => {
  assert.equal(x.rights_article9_component_formally_accepted, false);
  assert.equal(x.operator_exact_release_signature_present, false);
  assert.equal(x.original113_5_raster_pdfs_complete_semantic_duplicate_accepted, false);
  assert.deepEqual(x.formal_mainline_new, {FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
  assert.ok([...x.rows_accepted, ...x.rows_unaccepted_gated].every(r =>
    !r.admission_ready && !r.published && !r.disposition_change));
});
test('Review acceptance does not lose or add original B01/B02 source IDs', () => {
  const b1 = new Set(origB01.records.map(r => r.source_slot_id));
  const b2 = new Set(origB02.rows.filter(r => r.model_science_and_kp_supported_preliminary).map(r => r.source_slot_id));
  assert.equal(b1.size, 60);
  assert.equal(b2.size, 14);
  const all = [...x.rows_accepted, ...x.rows_unaccepted_gated];
  assert.equal(all.length, 74);
  assert.ok(all.every(r => (r.batch === 'B01' ? b1 : b2).has(r.source_slot_id)));
});
