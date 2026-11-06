#!/usr/bin/env node
/**
 * B01+B02 FullFix: project existing Admission gates, not a new review gate.
 * The projection can verify exact text collisions and source identity but cannot
 * authenticate raster-only parent semantics, school answer keys or operator consent.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'));
const norm = (s) => String(s ?? '').normalize('NFKC')
  .replace(/[\s，。？！、；：．,.!?（）()「」『』\u3000]/g, '').toLowerCase();
const setOfOptions = (a) => JSON.stringify((Array.isArray(a) ? a : []).map(norm).sort());
const hasRealText = (s) => typeof s === 'string' && s.trim().length > 0;
const all29 = read('data/review/p12-g04s1-113-all29-bulk-admission-fullfix-1122-nine-batch-frozen-plan-v1.json');
const B01 = read('data/review/p12-g04s1-113-all29-bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');
const B02 = read('data/review/p12-g04s1-113-all29-bulk-b02-133-original-text-raster-source-gate-evidence-v1.json');
const Z24 = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao24-original-science-directKP-model-prelim-v1.json');
const D4 = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao4-wende-exact-child-parent-duplicate-HOLD-overlay-v1.json');
const L19 = read('data/review/p12-g04s1-113-all29-bulk-b02-zhongxiao19-lunar-no-direct-frozen48KP-HOLD-overlay-v1.json');
const PUBLIC_ALIAS = read('data/review/p12-g04s1-113-all29-b01b02-fullfix-zhongxiao-mc004-existing-published-lineage-alias-overlay-v1.json');
const SCIENCE70 = read('data/review/p12-g04s1-113-b01b02-fullfix-science-directKP-existing-gate70-accepted-4specific-hold-v1.json');
const a = read('site/data/authority/science-g03-g04-selector-v3.json');
const kps = a.units.filter(x => x.grade === 4 && x.semester === 1)
  .flatMap(x => x.knowledge_points.map(k => k.canonical_kp_id));
assert.equal(kps.length, 48);
assert.equal(new Set(kps).size, 48);

const p02 = all29.batches.find(x => x.batch_id === 'B02');
assert.equal(p02.source_work_count, 133);
assert.deepEqual(B02.records.map(x => x.source_slot_id), p02.source_slot_ids);
assert.equal(B01.records.length, 60);
assert.equal(Z24.rows.length, 24);
assert.equal(new Set(Z24.rows.map(x => x.source_slot_id)).size, 24);
assert.equal(D4.rows.length, 4);
assert.equal(L19.rows.length, 19);
assert.equal(PUBLIC_ALIAS.disposition_after, 'ALIAS');
assert.deepEqual(PUBLIC_ALIAS.after_all29, {PUBLISHED:333,HOLD:359,ALIAS:26,UNREVIEWED:1044});
assert.deepEqual(PUBLIC_ALIAS.after_B02, {PUBLISHED:0,HOLD:23,ALIAS:1,UNREVIEWED:109});
assert.equal(B02.records.filter(x => x.source_disposition_effective === 'HOLD').length, 23);
assert.equal(B02.records.filter(x => x.source_disposition_effective === 'UNREVIEWED').length, 110);
assert.deepEqual(B02.admission_checkpoint.all29, {
  PUBLISHED: 333, HOLD: 359, ALIAS: 25, UNREVIEWED: 1045,
});
const b02Map = new Map(B02.records.map(x => [x.source_slot_id, x]));
const dups = new Set(D4.rows.map(x => x.source_slot_id));
const moon = new Set(L19.rows.map(x => x.source_slot_id));
assert.equal([...dups].filter(id => moon.has(id)).length, 0);
assert.ok([...dups, ...moon].every(id => b02Map.get(id)?.source_disposition_effective === 'HOLD'));

const manifest = read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
assert.equal(manifest.current_public_source_archive_files.length, 25);
const originals = manifest.current_public_source_archive_files.flatMap(p => {
  const j = read(p);
  assert.ok(Array.isArray(j.original_question_records), p);
  return j.original_question_records.map(x => ({
    source_id: x.source_id, paper_ref: p, stem: x.stem, options: x.options || [],
  }));
});
assert.equal(originals.length, 717);
const originalByStem = new Map();
for (const q of originals) {
  const key = norm(q.stem);
  if (!originalByStem.has(key)) originalByStem.set(key, []);
  originalByStem.get(key).push(q);
}

// Read only the bank versions explicitly in live manifests (public_site_integrated).
// This is a conservative extra text-level collision screen, not a total-333 assertion.
const pubDir = 'site/data/question-bank';
const pubFiles = readdirSync(path.join(ROOT, pubDir)).filter(x => x.endsWith('.json'));
const published = [];
for (const file of pubFiles) {
  const data = read(pubDir + '/' + file);
  if (data.public_site_integrated !== true || !Array.isArray(data.blocks)) continue;
  for (const block of data.blocks) {
    const kids = block.type === 'group' ? (block.items || []) : [block];
    for (const item of kids) {
      if (!hasRealText(item.stem)) continue;
      published.push({
        id: item.id, source_slot_id: item.source_slot_id || null,
        file, stem: item.stem, options: item.options || [],
        parent: block.type === 'group' ? (block.shared?.instructions || block.title || '') : '',
        source_lineage_ids: item.source_lineage_ids || [],
      });
    }
  }
}
const aliasPub = published.find(x => x.id === PUBLIC_ALIAS.already_public_student_id);
assert.ok(aliasPub, 'already published canonical Wende item missing');
assert.ok(aliasPub.source_lineage_ids.includes(PUBLIC_ALIAS.exact_source_slot_id), 'existing public lineage does not contain exact B02 secondary source');
const aliasChild = Z24.rows.find(x => x.source_slot_id === PUBLIC_ALIAS.exact_source_slot_id);
assert.ok(aliasChild, 'B02 exact alias does not match its original source-work row');
assert.equal(norm(aliasPub.stem), norm(aliasChild.original_child_text_layer_joined));
assert.equal(setOfOptions(aliasPub.options), setOfOptions(aliasChild.original_ordered_options_text_layer));
const publicByStem = new Map();
for (const q of published) {
  const key = norm(q.stem);
  if (!publicByStem.has(key)) publicByStem.set(key, []);
  publicByStem.get(key).push(q);
}

const b01Rows = B01.records.map(q => ({
  batch: 'B01', source_slot_id: q.source_slot_id, paper_id: q.source_paper_id,
  stem: q.original_stem_or_item_verbatim,
  parent: q.original_parent_verbatim || '',
  options: q.original_choice_options || [],
  source_pdf_sha256: q.source_pdf_sha256,
  bbox: q.original_answer_bbox_pdf_points_top_left,
  kp: q.model_direct_kp_id, answer: q.independent_model_science_answer_NOT_TEACHER_KEY,
  type: 'EXACT60_TEXT_MODEL_SUPPORTED',
}));
const b02Rows = Z24.rows.filter(q => q.source_slot_id !== PUBLIC_ALIAS.exact_source_slot_id).map(q => ({
  batch: 'B02', source_slot_id: q.source_slot_id, paper_id: q.original_paper_id,
  stem: q.original_child_text_layer_joined,
  parent: q.original_parent_text_layer_joined || '',
  options: q.original_ordered_options_text_layer || [],
  source_pdf_sha256: q.source_pdf_sha256, bbox: null,
  kp: q.model_direct_frozen48kp_candidate_id,
  answer: q.model_answer_not_teacher_key,
  type: q.source_stage,
}));
assert.equal(b01Rows.length + b02Rows.length, 83);
assert.equal(SCIENCE70.rows_accepted.length, 70);
assert.equal(SCIENCE70.rows_unaccepted_gated.length, 4);
assert.equal(SCIENCE70.operator_exact_release_signature_present, false);
const pendingTextIds = new Set([...b01Rows, ...b02Rows].map(x => x.source_slot_id));
assert.ok([...SCIENCE70.rows_accepted, ...SCIENCE70.rows_unaccepted_gated].every(x => pendingTextIds.has(x.source_slot_id)));
assert.equal(SCIENCE70.rows_accepted.filter(x => x.batch === 'B01').length, 56);
assert.equal(SCIENCE70.rows_accepted.filter(x => x.batch === 'B02').length, 14);
const candidateIds = new Set();
for (const c of [...b01Rows, ...b02Rows]) {
  assert.ok(!candidateIds.has(c.source_slot_id), 'repeated source slot ' + c.source_slot_id);
  candidateIds.add(c.source_slot_id);
  assert.ok(hasRealText(c.stem), c.source_slot_id);
  assert.equal(c.source_pdf_sha256?.length, 64);
  assert.ok(c.kp === null || kps.includes(c.kp), 'invalid direct KP candidate');
  if (c.batch === 'B01') assert.equal(c.bbox?.length, 4);
}
assert.equal(b02Rows.filter(c => c.type === 'MODEL_SUPPORTED_SCIENCE_AND_DIRECT_KP_PRELIMINARY').length, 14);
assert.equal(b01Rows.filter(x => !x.kp).length, 0);

const evaluated = [...b01Rows, ...b02Rows].map(c => {
  const orig = (originalByStem.get(norm(c.stem)) || []).map(x => ({
    source_id: x.source_id, paper_ref: x.paper_ref,
    original_full_stem_match: true,
    same_options_ignoring_order: setOfOptions(x.options) === setOfOptions(c.options),
  }));
  const pub = (publicByStem.get(norm(c.stem)) || []).map(x => ({
    id: x.id, source_slot_id: x.source_slot_id, file: x.file,
    original_full_stem_match: true,
    same_options_ignoring_order: setOfOptions(x.options) === setOfOptions(c.options),
    parent_must_be_compared_for_final_duplicate: true,
  }));
  return {
    source_slot_id: c.source_slot_id, batch: c.batch, source_paper_id: c.paper_id,
    existing_source_stem: c.stem, existing_parent: c.parent,
    preliminary_model_answer_not_school_key: c.answer,
    proposed_direct_frozen48kp: c.kp,
    original114_same_stem: orig,
    main_site_same_stem: pub,
    has_original_source_proof: true,
    original_pdf_bbox_captured_in_current_roster: c.bbox?.length === 4,
    previously_model_supported_science_kp: c.batch === 'B01' ||
      c.type === 'MODEL_SUPPORTED_SCIENCE_AND_DIRECT_KP_PRELIMINARY',
    unresolved_gates: [
      'SOURCE_EXACT_PARENT_OPTION_FIGURE_IF_APPLICABLE',
      'SCIENCE_DIRECT_FROZEN48KP_FORMAL_ACCEPTANCE',
      'DUPLICATE_ALL29_INCLUDING_FIVE_RASTER_PDFS',
      'RIGHTS_COMPONENT_ART9_OR_LICENSE',
      'OPERATOR_EXACT_RELEASE_APPROVAL',
    ],
    formal_science_kp_approved: false, admission_ready: false, published_new: false,
  };
});
const counts = {
  source_work_all29: 1762, previously_published_113_source_work_unchanged: 333,
  B01_exact_candidate_rows: 60, B02_source_work_rows: 133,
  B02_new_existing_disposition_hold_rows: 23,
  B02_remaining_source_work_rows: 109, B02_text_children_assessed: 23,
  B02_published_lineage_alias_from_previous_unreviewed: 1,
  B02_scan_source_work_still_visual_semantic_pending: 86,
  B01_B02_current_candidate_text_rows_for_exact_dedup: evaluated.length,
  candidate_model_science_kp_positive_not_formal: evaluated.filter(x => x.previously_model_supported_science_kp).length,
  source_level_science_and_directkp_components_explicitly_accepted: SCIENCE70.rows_accepted.length,
  B01_science_kp_components_accepted: 56,
  B02_science_kp_components_accepted: 14,
  B01_specific_science_or_source_context_risks_held: 4,
  original114_papers: 25, original114_answer_occurrences: originals.length,
  source_stem_exact114_hits: evaluated.filter(x => x.original114_same_stem.length).length,
  source_stem_exact_live_bank_hits: evaluated.filter(x => x.main_site_same_stem.length).length,
  previously_resolved_published_lineage_alias_count: 1,
  actual_live_bank_text_entries_seen_not_student_113_source_count: published.length,
  FORMAL_SCIENCE_KP_APPROVED_new: 0, ADMISSION_READY_new: 0, PUBLISHED_new: 0,
};
const report = {
  schema_version: 'P12_G04S1_113_B01_B02_FORMAL_ADMISSION_FULLFIX_EXISTING_GATE_PRECHECK_V1',
  date: '2026-11-06', existing_gate_only: true, creates_new_gate: false,
  frozen_113_g04s1_kp48_unchanged: true,
  original_333_published_unchanged: true,
  all29_work_disjoint: PUBLIC_ALIAS.after_all29,
  evidence_scope: 'Current PR185 B01 exact60 + B02 Zhongxiao24, cross114 25 original PDFs text corpus and public site visible bank JSON; does not replace raster-only five source exams or operator signature',
  important_limitations: [
    'A zero exact normalized stem match is not a full semantic / parent-dependent duplicate acceptance.',
    'The original 113 five raster-only exam source PDFs remain a full-semantic-text comparison gap.',
    'B01 56 and B02 14 have source-level independent Science/direct KP component acceptance, but not full distinct-question published Admission approval.',
    'No PDF scan, original image, external text or original teacher answers are published.',
    'No operator exact cohort signature was supplied by this batch-processing instruction.',
  ],
  counts, next_short_step:
    'B01_60_And_B02_110_CompleteOnlyUnresolvedFormalScienceKP_113Scan5ParentDedup_Rights_ExactOperatorOnce_ThenSelectiveStudentPR_Main_Pages_NoB03UntilReleaseGate',
  rows: evaluated,
};
if (process.argv.includes('--check')) {
  assert.equal(report.rows.length, 83);
  assert.equal(report.counts.source_level_science_and_directkp_components_explicitly_accepted, 70);
  assert.equal(report.counts.source_stem_exact114_hits, 0);
  assert.equal(report.counts.source_stem_exact_live_bank_hits, 0);
  assert.equal(report.counts.B02_scan_source_work_still_visual_semantic_pending, 86);
}
const arg = process.argv.find(x => x.startsWith('--out-dir='));
if (arg) {
  const dir = path.join(ROOT, arg.slice('--out-dir='.length));
  mkdirSync(dir, {recursive:true});
  writeFileSync(path.join(dir, 'b01-b02-formal-admission-fullfix-precheck.json'),
    JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({schema:report.schema_version,counts,public_same_stem_items:evaluated.filter(r=>r.main_site_same_stem.length).map(r=>({source_slot_id:r.source_slot_id,public_ids:r.main_site_same_stem.map(q=>({id:q.id,source_slot_id:q.source_slot_id,file:q.file,same_options:q.same_options_ignoring_order}))})),unfinished:[
  'SCIENCE_DIRECT_KP_FORMAL', 'ORIGINAL113_RASTER5_SEMANTIC_DEDUP',
  'RIGHTS_COMPONENT', 'OPERATOR_EXACT_SCOPE',
], output:arg ? arg.slice('--out-dir='.length) : 'none'}, null, 2));
