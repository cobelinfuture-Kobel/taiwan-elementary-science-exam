import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const score=load('data/review/p12-all25-b02-sixpdf-scoregap27-original-visual-evidence-v1.json');
const triage=load('data/review/p12-all25-b02-science73-kp81-human-triage-control-v1.json');
const shards=[1,2,3].map(i=>load('data/review/p12-all25-b02-human-triage-shard0'+i+'-v1.json'));
const original=load('data/review/p12-all25-b01-source-score-gap27-evidence-ledger-v1.json');
const idx=load('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v24.json');
const q=load('data/review/p12-standalone-all25-source-first-queue-v1.json');
test('B02 six user-owned original raw PDF SHA readbacks exactly match source archive frozen originals and 27-point historical six-school gaps',()=>{
 assert.equal(score.original_pdf_sha256_recomputed_count,6);
 assert.equal(score.source_records.length,6);
 assert.equal(score.known_gap_total_unchanged,27);
 assert.equal(score.operator_formal_score_authority_approved_papers,0);
 assert.equal(score.all_source_score_gaps_resolved,false);
 assert.deepEqual(score.source_records.map(x=>x.unreconciled_printed_score_points),[4,8,2,3,4,6]);
 assert.deepEqual(score.source_records.map(x=>x.paper_id),original.source_review_cases.map(x=>x.paper_id));
 let reviewed=0;
 for(const z of score.source_records){
  assert.equal(z.original_source_not_modified,true);
  assert.equal(z.formal_score_authority_acceptance,false);
  assert.equal(z.operator_requires_original_pdf_manual_approval,true);
  assert.equal(z.source_figure_public_copy_excluded,true);
  assert.match(z.source_pdf_sha256_recomputed_original,/^[0-9a-f]{64}$/);
  assert.ok(z.source_original_inspected_page_numbers_1based.length>=1);
  assert.ok(z.visual_readback_specific_findings.length>30);
  assert.equal(z.review_status,'SOURCE_VISUAL_EVIDENCE_RECONFIRMED_SCORE_GAP_HOLD');
  const match=original.source_review_cases.find(x=>x.paper_id===z.paper_id);
  assert.equal(z.source_map_ref,match.source_map_ref);
  const row=idx.current_public_source_archive_files.map(load).find(x=>x.source_paper_id===z.paper_id);
  assert.ok(row,z.paper_id);
  assert.equal(row.original_pdf_sha256,z.source_pdf_sha256_recomputed_original,z.paper_id);
  reviewed+=z.source_original_inspected_page_numbers_1based.length;
 }
 assert.equal(reviewed,10);
 const p=score.source_records.at(-1);
 assert.equal(p.paper_id,'SCI_G04_S1_114_FINAL_010');
 assert.ok(p.original_printed_quoted_instruction_excerpt.includes('每答1分'));
 assert.equal(p.unreconciled_printed_score_points,6);
});
test('B02 all 73 Science and 81 KP original source records individually classified for human review, 8 distinct intersection and six frozen wrong-family cases',()=>{
 const sc=shards.flatMap(x=>x.science_hold_review_rows),kp=shards.flatMap(x=>x.kp_review_review_rows);
 assert.equal(sc.length,73);
 assert.equal(kp.length,81);
 assert.equal(new Set(sc.map(x=>x.source_id)).size,73);
 assert.equal(new Set(kp.map(x=>x.source_id)).size,81);
 assert.deepEqual(shards.map(x=>[x.science_hold_original_source_count,x.kp_review_original_source_count]),[[12,23],[31,21],[30,37]]);
 const ks=new Set(kp.map(x=>x.source_id));
 assert.equal(sc.filter(x=>ks.has(x.source_id)).length,8);
 assert.equal(triage.overlap_source_occurrences,8);
 assert.equal(triage.distinct_source_occurrences_across_gates,146);
 assert.equal(triage.model_human_triage_is_not_operator_acceptance,undefined);
 assert.equal(triage.human_review_approved,false);
 assert.equal(triage.science_rows_without_inline_prior_QA_reason,sc.filter(x=>!x.science_reason).length);
 assert.equal(triage.science_rows_without_inline_prior_QA_reason,26);
 assert.equal(triage.kp_review_state_summary.requires_source_floating_plant_family_correction,6);
 assert.equal(triage.kp_review_state_summary.source_kp_proposed,45);
 assert.equal(triage.kp_review_state_summary.kp_candidate_missing,36);
 assert.equal(triage.science_revised_to_pass_count,0);
 assert.equal(triage.kp_formally_approved_count,0);
 const originalItems=new Set(idx.current_public_source_archive_files.flatMap(p=>load(p).original_question_records.map(x=>x.source_id)));
 for(const x of sc){
  assert.ok(originalItems.has(x.source_id),x.source_id);
  assert.ok(x.model_issue_category.length>8);
  assert.ok(x.model_triage_recommendation.includes('KEEP_SCIENCE_HOLD'));
  assert.equal(x.formally_teacher_key_verified,false);
  assert.equal(x.operator_accepted,false);
 }
 for(const x of kp){
  assert.ok(originalItems.has(x.source_id),x.source_id);
  assert.equal(x.formal_kp_approved,false);
  assert.equal(x.operator_accepted,false);
  assert.ok(x.review_action);
 }
 const f=kp.filter(x=>x.review_priority==='P0_WRONG_FROZEN_KP_FAMILY');
 assert.equal(f.length,6);
 for(const x of f){
  assert.equal(x.source_kp_firstpass_legacy_if_known,'sci_g04s1_02_05');
  assert.equal(x.source_corrected_proposal_if_known,'sci_g04s1_02_04');
  assert.equal(x.paper_id,'SCI_G04_S1_114_MID_009');
 }
});
test('B02 evidence and triage may not change 25 source original papers, Science, KP or student practice admissions',()=>{
 assert.equal(idx.current_public_source_paper_count,25);
 assert.equal(idx.cumulative_original_source_question_occurrences,717);
 assert.equal(idx.total_true_false,426);
 assert.equal(idx.total_single_choice,291);
 assert.deepEqual([idx.science_model_preliminary_pass,idx.science_hold],[644,73]);
 assert.equal(idx.source_position_frozen_all25_total,1623);
 assert.equal(q.source_papers_total,25);
 assert.equal(q.source_response_slots_unchanged,1623);
 assert.equal(q.first_pass_all25_operator_final_acceptance,false);
 assert.equal(idx.formal_science_answer_approved_count,0);
 assert.equal(idx.formal_kp_approved_count,0);
 assert.equal(idx.site_question_bank_new_admissions,0);
 assert.deepEqual([idx.existing_live_bank_total_answer_positions,idx.existing_live_bank_g04s1_answer_positions],[251,53]);
});
