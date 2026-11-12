import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const path='data/review/';
const old=json(path+'p12-g04s1-113-two-school24-science-directkp-hold-routing-after810-v1.json');
const qa=json(path+'p12-g04s1-113-two-school-eight-original-science-unique-source-qa-v1.json');
const cross=json(path+'p12-g04s1-113-two-new-science-supported-113all29-114all25-source-duplicate-screen-v2.json');
const cohort=json(path+'p12-g04s1-113-two-science-supported-exact-operator-cohort-DRAFT-v1.json');
const pub=json(path+'p12-g04s1-113-main-published174-source-suppression-readback-v11.json');
const auth=json('site/data/authority/science-g03-g04-selector-v3.json');
const kpIDs=new Set(auth.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
const oldHold=new Map(old.records.map(x=>[x.slot,x]));
const published=new Set(pub.all_unique_published_source_slot_ids);
test('eight exact SHA original-page TFMC question+all options: two source science unique/direct 48KP supported, six scientifically ambiguous retain HOLD',()=>{
 assert.equal(qa.records.length,8);
 assert.equal(qa.summary.source_science_unique_and_frozenKP_supported_for_further_gate,2);
 assert.equal(qa.summary.old_science_HOLD_retained,6);
 assert.equal(qa.summary.new_published,0);
 assert.equal(qa.summary.new_admission_ready,0);
 assert.equal(qa.original_pdfs_checked_in_runtime.length,2);
 const ids=new Set();
 for(const x of qa.records){
  assert.ok(!ids.has(x.source_slot_id));ids.add(x.source_slot_id);
  assert.ok(oldHold.has(x.source_slot_id));
  assert.ok(!published.has(x.source_slot_id));
  assert.match(x.original_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.equal(x.original_pdf_page_1_based,1);
  assert.equal(x.exact_printed_answer_marker_pdf_bbox_pts.length,4);
  assert.equal(x.original_answer_not_authenticated,true);
  assert.equal(x.original_red_handwritten_marks_excluded,true);
  assert.equal(x.source_geometry_reused_not_redrawn,true);
  assert.equal(x.original_question_text_near_duplicate_over_threshold_in_891_checked_items,undefined);
  assert.equal(x.ADMISSION_READY,false);
  assert.equal(x.PUBLISHED,false);
  assert.equal(x.operator_formal_science_kp_approval_received,false);
  if(x.source_slot_id.includes('|MC|'))assert.equal(x.original_choice_text_full_printed_order.length,4);
  else assert.equal(x.original_choice_text_full_printed_order.length,0);
  if(x.source_science_evidence_supported){
   assert.ok(kpIDs.has(x.proposed_direct_frozen_canonical_KP));
   assert.ok([3,4].includes(x.science_reasoned_candidate_answer_one_based));
   assert.equal(x.reviewed_science_disposition,'SOURCE_SCIENCE_DIRECT_KP_SUPPORTED_PENDING_OTHER_GATES');
  }else{
   assert.equal(x.proposed_direct_frozen_canonical_KP,null);
   assert.equal(x.science_reasoned_candidate_answer_one_based,null);
   assert.match(x.reviewed_science_disposition,/^HOLD_SCIENCE_UNIQUE_/);
  }
 }
 assert.equal(ids.size,8);
});
test('crossyear complete 113 29 school PDF and 114 all25 717, public 113 174: no false pass as formal admission',()=>{
 assert.equal(cross.summary.source_duplications_discovered_in_two,0);
 assert.equal(cross.source_113_29_registry_count,29);
 assert.equal(cross.source_113_native_24_readable_original_pdf_text.count,24);
 assert.equal(cross.source_113_native_24_readable_original_pdf_text.all24_readable,true);
 assert.equal(cross.source_113_scan_5_visual.count,5);
 assert.equal(cross.source_113_scan_5_visual.other_scanned_original_page_visual_checked.length,3);
 assert.equal(cross.source_113_scan_5_visual.other_scanned_original_exam_pages_reviewed,10);
 assert.equal(cross.source_114_all25_archive.original_TFMC_school_exam_papers_compared,25);
 assert.equal(cross.source_114_all25_archive.original_school_source_question_records_compared,717);
 assert.equal(cross.source_113_published_current_main.published_113_source_ids_count,174);
 assert.equal(cross.source_113_published_current_main.student_bank_113_source_json_shards_examined,15);
 assert.equal(cross.reviewed_source_candidates.length,2);
 assert.equal(cross.summary.ADMISSION_READY_new,0);
 assert.equal(cross.summary.PUBLISHED_new,0);
});
test('exact 2 unadmitted draft remains source-only while six science ambiguity and sixteen direct KP HOLDS remain',()=>{
 assert.deepEqual(cohort.draft_records.map(x=>x.source_slot_id),
 ['SCI_G04_S1_113_FINAL_001|S02|MC|009','SCI_G04_S1_113_MID_006|S2|MC|012']);
 assert.deepEqual(cohort.draft_records.map(x=>x.science_independently_reasoned_answer_choice_1based),[3,4]);
 assert.deepEqual(cohort.draft_records.map(x=>x.canonical_kp_id),['sci_g04s1_04_04','sci_g04s1_02_08']);
 assert.equal(cohort.summary.remaining_science_uniqueness_HOLD,6);
 assert.equal(cohort.summary.remaining_direct_KP_HOLD,16);
 assert.equal(cohort.summary.total_remaining_prior_two_schools_HOLD,22);
 assert.equal(cohort.summary.ADMISSION_READY_new,0);
 assert.equal(cohort.summary.PUBLISHED_new,0);
 assert.equal(cohort.operator_exact_release_request_not_yet_accepted_by_user,true);
 assert.equal(cohort.rights_operator_final_release_approval,false);
 for(const r of cohort.draft_records){
  assert.ok(kpIDs.has(r.canonical_kp_id));
  assert.ok(!published.has(r.source_slot_id));
  assert.equal(r.original_options_four_print_order.length,4);
  assert.equal(r.scope_existing_Article9_lawfully_administered_exam_question_text_only_preflight,true);
  assert.equal(r.original_school_teacher_key_authenticated,false);
  assert.equal(r.original_source_pdf_images_not_republished,true);
  assert.equal(r.operator_exact_batch_release_approved,false);
  assert.equal(r.ADMISSION_READY,false);
  assert.equal(r.PUBLISHED,false);
 }
});
