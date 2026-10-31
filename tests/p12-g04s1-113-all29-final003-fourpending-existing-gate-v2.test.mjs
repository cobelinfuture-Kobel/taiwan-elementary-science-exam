import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const base = 'data/review/p12-g04s1-113-all29-';
const gap = read(base + 'final003-fourpending-existing-gate-gap-v2.json');
const first = read(base + 'final003-18-onegate-science-kp-source-scope-v1.json');
const native = read('data/review/p12-g04s1-113-missing15-native88-original-text-sci-g04-s1-113-final-003-v1.json');
const frozen = read('site/data/authority/science-g03-g04-selector-v3.json');
const current = read(base + 'known-atomic-disjoint-source-ledger-v8.json');
const norm = s => s.split('|').map(v => /^[SG]\\d+$/.test(v) ? v[0] + Number(v.slice(1)) : /^\\d+$/.test(v) ? String(Number(v)) : v).join('|');
const byId = new Map(first.rows.map(v => [norm(v.source_slot_id), v]));
const byNative = new Map(native.source_questions.map(v => [norm(v.source_slot_id), v]));
const byDisjoint = new Map(current.known_atomic_source_dispositions.map(v => [norm(v.source_slot_id), v]));
const validKp = new Map(frozen.units.filter(u => u.grade === 4 && u.semester === 1)
  .flatMap(u => u.knowledge_points).map(k => [k.canonical_kp_id, k.title]));

test('four-pending evidence inherits the exact source and immutable Frozen48 without making a new admission stage', () => {
  assert.equal(gap.no_policy_change, true);
  assert.equal(gap.candidate_count, 4);
  assert.equal(gap.rows.length, 4);
  assert.equal(new Set(gap.rows.map(x => norm(x.source_slot_id))).size, 4);
  assert.equal(validKp.size, 48);
  assert.equal(gap.scientific_reasoning_supported_under_original_statement_count, 3);
  assert.equal(gap.science_context_conditional_count, 1);
  assert.equal(gap.rows.filter(x => x.science_answer_scope_diagnostic === 'SCIENCE_DETERMINATE').length, 3);
  assert.equal(gap.rows.filter(x => x.science_answer_scope_diagnostic === 'SCIENCE_CONTEXT_CONDITIONAL').length, 1);
  for (const row of gap.rows) {
    const id = norm(row.source_slot_id);
    const prior = byId.get(id);
    const source = byNative.get(id);
    assert.ok(prior, id);
    assert.ok(source, id);
    assert.equal(prior.source_only_disposition, 'DIRECT_KP_CANDIDATE_PENDING_FULL_GATE');
    assert.equal(row.original_pdf_sha256, prior.source_original_pdf_sha256);
    assert.equal(row.original_pdf_page_1based, source.source_page_pdf_1based);
    assert.deepEqual(row.inherited_exact_answer_bbox_pdf_points, source.answer_glyph_native_bbox_pdf_pts_top_left);
    assert.equal(row.inherited_parent_source_id, source.source_parent_id);
    assert.equal(row.figure_dependency_in_existing_text_inventory, false);
    assert.equal(row.original_visual_context_final_acceptance, false);
    assert.equal(row.independent_science_candidate_answer_NOT_FORMAL, prior.model_science_candidate_NOT_FORMAL);
    assert.equal(row.frozen_kp_proposal_only.canonical_kp_id, prior.direct_frozen48_kp_proposed_NOT_FORMAL);
    assert.equal(row.frozen_kp_proposal_only.title, validKp.get(prior.direct_frozen48_kp_proposed_NOT_FORMAL));
    assert.equal(byDisjoint.get(id).disposition, 'UNREVIEWED');
    for (const flag of ['formal_full_113_29_semantic_dedup_closed', 'individual_rights_acceptance',
      'exact_operator_eligible', 'FORMAL_SCIENCE_KP_APPROVED_new', 'ADMISSION_READY_new', 'PUBLISHED_new']) {
      assert.equal(row[flag], false, id + ':' + flag);
    }
  }
});

test('no silent promotion of the 333 public, 14 previously held, or provisional source positions', () => {
  assert.equal(current.source_position_count_distinct_known, 1762);
  assert.equal(current.original_papers.length, 29);
  assert.deepEqual(current.known_disjoint_dispositions, {
    PUBLISHED: 333, HOLD: 283, ALIAS: 15, UNREVIEWED: 1131,
  });
  for (const key of ['new_formal_science_kp_approved', 'new_admission_ready', 'new_published',
    'exact_component_rights_accepted_count', 'exact_operator_eligible_count',
    'full_source_visual_final_acceptance_count', 'exact_whole_11329_semantic_dedup_verified_count']) {
    assert.equal(gap[key], 0, key);
  }
  assert.equal(gap.existing_draft_v8_dispositions_unchanged, true);
  assert.equal(gap.previously_published_333_unchanged, true);
  assert.equal(gap.existing_14_hold_untouched, true);
  assert.equal(current.formal_status_current_run.full_original_papers_Admission_closed, 0);
});
