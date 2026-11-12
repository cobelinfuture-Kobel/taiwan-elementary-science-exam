import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const prefix = 'data/review/p12-g04s1-113-all29-';
const review = read(prefix + 'final003-fourpending-original29-textlayer-dedup-rights-gap-v1.json');
const baseline = read(prefix + 'known-atomic-disjoint-source-ledger-v8.json');
const four = read(prefix + 'final003-fourpending-existing-gate-gap-v2.json');

test('all 29 original paper identities read back, but only 24 support direct text inspection', () => {
  assert.equal(review.source_pdf_count, 29);
  assert.equal(review.source_text_fetch_attempted, 29);
  assert.equal(review.source_text_fetch_succeeded, 29);
  assert.equal(review.original_paper_text_screen.length, 29);
  assert.equal(new Set(review.original_paper_text_screen.map(p => p.source_paper_id)).size, 29);
  assert.deepEqual(new Set(review.original_paper_text_screen.map(p => p.source_paper_id)), new Set(baseline.original_papers.map(p => p.source_paper_id)));
  const textPapers = review.original_paper_text_screen.filter(p => p.readable_text);
  const scans = review.original_paper_text_screen.filter(p => !p.readable_text);
  assert.equal(textPapers.length, 24);
  assert.equal(scans.length, 5);
  assert.equal(review.source_readable_pdf_count, 24);
  assert.equal(review.source_scan_no_text_count, 5);
  assert.deepEqual(new Set(scans.map(p => p.source_paper_id)), new Set(review.scan_paper_ids));
  for(const p of textPapers) assert.ok(p.raw_extracted_text_character_count>0);
  for(const p of scans) assert.equal(p.raw_extracted_text_character_count,0);
});

test('four pending remain source-only: keyword hits cannot imply full semantic dedup, rights, or admission', () => {
  assert.equal(review.target_candidate_lexical_findings.length,4);
  const originalFour = new Set(four.rows.map(x => x.source_slot_id));
  assert.deepEqual(new Set(review.target_candidate_lexical_findings.map(x => x.source_slot_id)),originalFour);
  assert.equal(review.original_29_target_fullsource_semantic_dedup_formally_accepted,false);
  assert.equal(review.source_extract_only_not_pdf_visual,true);
  assert.equal(review.original_pdf_visual_parent_exact_accepted_in_this_pass,0);
  assert.equal(review.source_exam_identity_evidence.rights_formally_accepted_new,0);
  assert.equal(review.original_29_paper_closeout_new,0);
  assert.deepEqual(review.metrics_this_pass,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0});
  for(const candidate of review.target_candidate_lexical_findings){
    assert.deepEqual(candidate.selected_anchor_only_original_paper_ids,['SCI_G04_S1_113_FINAL_003']);
    assert.equal(candidate.original_29_semantic_duplicate_gate,'PENDING_FULL_SEMANTIC_VISUAL_SCAN5');
  }
  assert.equal(baseline.source_position_count_distinct_known,1762);
  assert.deepEqual(baseline.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
  assert.equal(review.original_333_published_unchanged,true);
  assert.equal(review.original_frozen48_unchanged,true);
  assert.equal(review.governance_unchanged,true);
});
