import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const seven=read('p12-g04s1-113-native59-seven-nearmatch-original-full-stem-adjudication-v1.json');
const three=read('p12-g04s1-113-native59-original-wording-3pair-verified-v3.json');
const proposal=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const pub=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
test('all seven original printed near matches are actually different question wording or format',()=>{
 assert.equal(seven.records.length,7);
 assert.equal(new Set(seven.records.map(x=>x.unpublished_source_slot_id)).size,7);
 const pool=new Set(proposal.records.map(x=>x.source_slot_id));
 const prior=new Map(three.records.map(x=>[x.source_slot_id,x]));
 for(const r of seven.records){
  assert.ok(pool.has(r.unpublished_source_slot_id));
  assert.equal(prior.get(r.unpublished_source_slot_id).current_duplicate_handling,'MATCHED_CONCEPT_FULL_STEM_OPTIONS_COMPARISON_PENDING');
  assert.ok(r.existing_public_question_id);
  assert.ok(r.original_school_pdf_sha256.match(/^[0-9a-f]{64}$/));
  assert.equal(r.original_pdf_and_existing_public_question_checked,true);
  assert.equal(r.original_full_printed_question_and_options_context_compared,true);
  assert.equal(r.source_wording_different,true);
  assert.equal(r.only_option_reorder_or_punctuation,false);
  assert.equal(r.duplicate_gate_pair_status,'VERIFIED_DISTINCT_ORIGINAL_PHRASING_VARIANT_ELIGIBLE_FOR_OTHER_GATES');
  assert.equal(r.student_item_admitted,false);
 }
});
test('nine independent wording variants plus one exact duplicate, zero premature admissions',()=>{
 const distinct3=three.records.filter(x=>x.current_duplicate_handling==='VERIFIED_DIFFERENT_PHRASING_SAME_SCIENCE_CANDIDATE');
 const duplicate3=three.records.filter(x=>x.current_duplicate_handling==='VERIFIED_IDENTICAL_ORIGINAL_STEM_SUPPRESS_DUPLICATE');
 assert.equal(distinct3.length,2);
 assert.equal(duplicate3.length,1);
 assert.equal(seven.records.length+distinct3.length,9);
 assert.equal(seven.summary.native59_exact_duplicate_lineage_only,1);
 assert.equal(seven.summary.native59_still_need_full_public_bank_compare,49);
 assert.equal(seven.summary.new_formal_science_kp_approved,0);
 assert.equal(seven.summary.new_admission_ready,0);
 assert.equal(seven.summary.new_published,0);
 assert.equal(pub.newly_published_113_slots,114);
 assert.equal(pub.public_total_answer_slots,750);
});
