import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const R=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const a=R('p12-g04s1-113-heshun-final001-standalone23-science-directkp-screen-v1.json');
const b=R('p12-g04s1-113-neian-mid006-standalone24-science-directkp-screen-v1.json');
const du=R('p12-g04s1-113-heshun-neian23-published-bank-duplicate-variants-v1.json');
const work=R('p12-g04s1-113-two-school47-gated-admission-worklist-v1.json');
const publicMC=JSON.parse(readFileSync(new URL('../site/data/question-bank/p12-b04-b01-47-public-v1.json',import.meta.url),'utf8')).blocks;
const pub=R('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');

test('114 MC reorder-only published duplicate must suppress Neian original 113 MC002 student answer while preserving lineage',()=>{
 const dup=du.decisions.find(x=>x.decision==='SUPPRESS_PUBLIC_DUPLICATE_RETAIN_SOURCE_LINEAGE');
 assert.ok(dup);
 assert.equal(dup.source_slot_id,'SCI_G04_S1_113_MID_006|S2|MC|002');
 const original=b.source_science_kp_records.find(x=>x.source_slot_id===dup.source_slot_id);
 const current=publicMC.find(x=>x.source_slot_id===dup.matched_published_source_slot_id);
 assert.ok(original&&current);
 const norm=x=>String(x).normalize('NFKC').replace(/[0-9①②③④()（）\s，。、「」：？！]/g,'');
 assert.equal(norm(original.source_exact_stem_no_score),norm(current.stem));
 assert.deepEqual(original.source_exact_options_in_printed_order.map(norm).sort(),current.options.map(norm).sort());
 assert.equal(original.science_independent_answer_not_school_key,3);
 assert.equal(current.answer,'④');
 assert.equal(dup.admission_ready,false);
 assert.equal(dup.published,false);
 assert.equal(work.already_published_do_not_reimport_source.length,1);
 assert.equal(work.already_published_do_not_reimport_source[0].extra_student_answer_slots,0);
});
test('23 supported source science KP cases reduced to 22 distinct unreleased candidates, 24 holds persist',()=>{
 assert.equal(a.summary.source_stem_options_and_science_directkp_clear_this_batch,8);
 assert.equal(b.summary.science_direct_kp_candidates_verified,15);
 assert.equal(du.summary.distinct_remaining_source_scienceKP_candidates,22);
 assert.equal(work.counts.independent_tfmc_positions_reviewed,47);
 assert.equal(work.counts.science_and_direct_kp_supported_source_candidates,23);
 assert.equal(work.counts.source_science_or_direct_KP_HOLD,24);
 assert.equal(work.counts.identical_public_114_source_suppression,1);
 assert.equal(work.counts.distinct_candidates_needing_remaining_gates,22);
 assert.equal(work.distinct_source_candidates_pending_admission.length,22);
 assert.equal(work.holds_not_blocking_other_candidates.length,24);
 assert.equal(new Set(work.distinct_source_candidates_pending_admission.map(x=>x.source_slot_id)).size,22);
 const published=new Set(pub.all_unique_published_source_slot_ids);
 assert.equal(published.size,152);
 for(const x of work.distinct_source_candidates_pending_admission){
  assert.ok(!published.has(x.source_slot_id));
  assert.equal(x.science_directKP_evidence_verified,true);
  assert.equal(x.final_admission_ready,false);
  assert.equal(x.operator_final_manifest_approved,false);
  assert.equal(x.published,false);
 }
 assert.equal(work.counts.formal_science_kp_new_operator_approved_this_iteration,0);
 assert.equal(work.counts.admission_ready_new,0);
 assert.equal(work.counts.published_new,0);
});
test('near-same KP but different original wording/options cannot be falsely suppressed',()=>{
 assert.ok(du.decisions.some(x=>x.source_slot_id.endsWith('MID_006|S2|MC|003')&&x.decision==='RETAIN_DISTINCT_WORDING_OPTIONS_CANDIDATE'));
 assert.ok(du.decisions.some(x=>x.source_slot_id.endsWith('MID_006|S1|TF|001')&&x.decision==='RETAIN_DIFFERENT_ORIGINAL_WORDING_CANDIDATE'));
 assert.ok(du.decisions.some(x=>x.source_slot_id.endsWith('MID_006|S1|TF|008')&&x.decision==='RETAIN_REAL_SOURCE_WORDING_VARIANT_CANDIDATE'));
 assert.equal(work.counts.unresolved_complex_image_source_positions,6);
 assert.equal(work.counts.verified_scanned_five_source_markers_prior,256);
 assert.equal(du.full_original_113_114_unpublished_crossyear_and_all_788_final_comparison_completed,false);
 assert.equal(work.next_work_items.find(x=>x.gate==='ADMISSION_GATE').needs_operator_rule_change,false);
});
