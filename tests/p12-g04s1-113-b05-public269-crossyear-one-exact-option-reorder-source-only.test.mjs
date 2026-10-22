import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => JSON.parse(readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
const proof = read('data/review/p12-g04s1-113-b05-native50-published269-crossyear-fullchoice-dedup-source-only-v1.json');
const work = read('data/review/p12-g04s1-113-native-tfmc-b05-50-source-checkpoint-v1.json');
const science = read('data/review/p12-g04s1-113-native-tfmc-b05-50-science-kp-parent-exception-routing-v1.json');
const source = read('data/review/p12-g04s1-113-native-tfmc-b05-50-pdf-text-source-v2.json');
const bbox = read('data/review/p12-g04s1-113-native-tfmc-b05-50-original-native-glyph-bbox-v1.json');
const public269 = read('data/review/p12-g04s1-113-main-published269-source-suppression-readback-v16.json');
const public114 = read('site/data/question-bank/p12-b04-b05-40-public-v1.json');

test('B05 source50 retains exact identity, real page+BBox, 269 public suppressions and no unauthorized admission', () => {
  assert.equal(proof.rows.length, 50);
  assert.equal(work.records.length, 50);
  assert.deepEqual(proof.rows.map(r => r.source_id), work.records.map(r => r.source_slot_id));
  assert.equal(proof.source_count_partition.existing_ScienceKP_DIRECT_candidate_total, 26);
  assert.equal(proof.source_count_partition.remaining_direct_unapproved_candidates, 25);
  assert.equal(proof.source_count_partition.existing_HOLD_all_categories, 24);
  assert.equal(proof.rows.filter(r=>r.disposition.startsWith('SUPPRESS_NEW')).length, 1);
  assert.equal(proof.rows.filter(r=>r.disposition.startsWith('DIRECT_CANDIDATE')).length, 25);
  assert.equal(proof.rows.filter(r=>r.disposition.startsWith('RETAIN_EXISTING_HOLD')).length, 24);
  assert.equal(public269.all_unique_published_source_slot_ids.length, 269);
  const already = new Set(public269.all_unique_published_source_slot_ids);
  const bboxes = new Map(bbox.source_positions.map(r => [r.source_slot_id,r]));
  const scienceRows = new Map(science.items.map(r => [r.source_slot_id,r]));
  for (const r of proof.rows) {
    assert.equal(r.already_public_113269_exact_source_id, already.has(r.source_id));
    assert.equal(r.already_public_113269_exact_source_id, false);
    assert.deepEqual(r.original_native_answer_bbox,bboxes.get(r.source_id).original_answer_parenthesis_bbox_pts_top_left);
    assert.equal(r.original_pdf_sha256,bboxes.get(r.source_id).source_pdf_sha256);
    assert.ok(Number.isInteger(r.original_pdf_page) && r.original_pdf_page > 0);
    assert.equal(r.prior_existing_science_kp_route,scienceRows.get(r.source_id).route);
    assert.equal(r.formal_science_kp_approved_new, false);
    assert.equal(r.admission_ready_new, false);
    assert.equal(r.published_new, false);
  }
  assert.equal(proof.metrics_this_checkpoint.FORMAL_SCIENCE_KP_APPROVED_new, 0);
  assert.equal(proof.metrics_this_checkpoint.ADMISSION_READY_new, 0);
  assert.equal(proof.metrics_this_checkpoint.PUBLISHED_new, 0);
  assert.equal(proof.b05_selective_release_authorized,false);
});

test('B05 MC10 already public 114: exact same stem and four choices only reordered; retain lineage', () => {
  const alias=proof.new_confirmed_duplicate;
  const original=source.source_records.find(r=>r.source_slot_id===alias.original_source_id);
  const published=public114.blocks.find(r=>r.source_slot_id===alias.already_public_source_id);
  assert.ok(original && published);
  const norm=s=>String(s??'').normalize('NFKC').replace(/\\s+/g,'').replace(/[，。！？]/g,'');
  const option=s=>norm(s).replace(/^[①②③④1234]/,'');
  assert.equal(norm(original.original_pdf_text_layer_stem),norm(published.stem));
  assert.deepEqual(original.original_ordered_choices.map(x=>option(x.text)).sort(),published.options.map(option).sort());
  assert.equal(alias.source_model_answer,'③');
  assert.equal(alias.current_public_answer,'②');
  assert.equal(alias.direct_kp,published.canonical_kp_id);
  assert.equal(proof.rows.find(r=>r.source_id===alias.original_source_id).disposition,'SUPPRESS_NEW_PUBLIC_ITEM_PRESERVE_113_ORIGINAL_SOURCE_LINEAGE');
});
