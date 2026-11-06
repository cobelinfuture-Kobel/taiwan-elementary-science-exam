import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,readJson} from '../scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs';
const P='data/review/p12-g04s1-113-all29-';
const original=readJson(P+'bulk-b01-exact62-preliminary-operator-cohort-roster-PENDING-v1.json');
const updated=readJson(P+'bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');
const cross=readJson(P+'bulk-b01-62-cross29-papers-exact-duplicate-consolidated-v1.json');
const events=readJson(P+'bulk-b01-crossoriginal-two-duplicate-safety-children-HOLD-overlay-v1.json');
const audit=readJson(P+'bulk-b01-114-original-content-and-gate-routing-v1.json');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s（）、，。！？：；「」『』().,!?;:—-]/g,'');

test('29 original PDF crosswalk genuinely places all 62 original items in their own school PDF and flags five scan-only',()=>{
 assert.equal(cross.original_exam_pdf_files_visited,29);
 assert.equal(cross.original_exam_pdf_with_text,24);
 assert.equal(cross.original_exam_pdf_scan_only.length,5);
 assert.equal(cross.exact_source_items,62);
 assert.equal(cross.original_pdf_own_verbatim_found,62);
 assert.equal(cross.all62_original_schools_present_in_source,true);
 assert.equal(cross.exact_cross_school_occurrences,19);
 assert.equal(cross.short_child_substring_matches_requiring_parent_check,11);
 assert.equal(cross.rows.length,62);
 for(const r of cross.rows){
  assert.equal(r.original_text_exact_own_PDF,true);
  assert.ok(r.original_paper.endsWith('.pdf'));
  assert.equal(r.exact_stem_found_other_source_pdf_count,r.other_source_pdf_names.length);
  assert.ok(!r.other_source_pdf_names.includes(r.original_paper));
 }
 assert.equal(cross.full_semantic_duplicate_accepted,false);
 assert.equal(cross.operator_approved,false);
});

test('two B01 same-context identical safety statements are held by exact original source ID, with Yongan candidate retained',()=>{
 assert.equal(events.records.length,2);
 assert.equal(events.source_new_ALIASES_count,0);
 assert.equal(events.source_original_duplicate_child_HOLD_count,2);
 for(const pair of events.records){
  const a=original.source_id_rows.find(r=>r.source_slot_id===pair.source_slot_id_to_hold);
  const b=original.source_id_rows.find(r=>r.source_slot_id===pair.canonical_source_slot_id_to_retain_preliminary);
  assert.ok(a&&b);
  assert.equal(norm(a.original_stem_or_item_verbatim),norm(b.original_stem_or_item_verbatim));
  assert.equal(a.independent_model_science_answer_NOT_TEACHER_KEY,b.independent_model_science_answer_NOT_TEACHER_KEY);
  assert.equal(a.model_direct_kp_id,b.model_direct_kp_id);
  assert.equal(pair.held_source_original_status,'UNREVIEWED');
  assert.equal(pair.held_source_effective_status,'HOLD');
  assert.equal(pair.student_question_canonical_NOT_YET_PUBLIC,true);
  assert.equal(pair.student_bank_modifications,0);
  assert.equal(updated.source_ids_exact.includes(pair.source_slot_id_to_hold),false);
  assert.equal(updated.source_ids_exact.includes(pair.canonical_source_slot_id_to_retain_preliminary),true);
 }
});

test('new B01 unsigned source reviewer cohort reduced from 62 to 60, not a publication, and remaining source status is 1110',()=>{
 assert.equal(updated.records.length,60);
 assert.equal(updated.source_ids_exact.length,60);
 assert.equal(new Set(updated.source_ids_exact).size,60);
 assert.deepEqual(updated.counts_by_original_paper,{
  'SCI_G04_S1_113_MID_001':4,
  'SCI_G04_S1_113_FINAL_005':33,
  'SCI_G04_S1_113_FINAL_007':23
 });
 for(const c of updated.records){
  assert.ok(audit.rows.some(r=>r.source_slot_id===c.source_slot_id));
  assert.equal(c.operator_exact_source_approval,false);
  assert.equal(c.formal_science_kp_approved,false);
  assert.equal(c.ADМISSION_READY,undefined);
  assert.equal(c.ADMISSION_READY,false);
  assert.equal(c.PUBLISHED,false);
 }
 const result=analyze({batch:'all'});
 assert.equal(result.this_run_scoped_source_work_positions,1122);
 assert.equal(result.post_B01_total_remaining_unreviewed,1110);
 assert.deepEqual(result.post_B01_content_evidence_projection,{PUBLISHED:333,HOLD:294,ALIAS:25,UNREVIEWED:1110});
 const b=result.batches.find(x=>x.batch_id==='B01');
 assert.equal(b.input_source_work_positions,114);
 assert.equal(b.unresolved_existing_gates,102);
 assert.equal(b.original_interpaper_duplicate_source_HOLD,2);
 assert.equal(result.FORMAL_SCIENCE_KP_APPROVED_new,undefined);
 assert.equal(result.formal_science_kp_approved_new,0);
 assert.equal(result.ADMISSION_READY_new,0);
 assert.equal(result.PUBLISHED_new,0);
});
