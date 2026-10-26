import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const proof=read('p12-g04s1-113-b08-50source-17proposals-33exceptions-admission-notready-v1.json');
const cross=read('p12-g04s1-113-b08-native50-original-bbox-id-crosswalk-v1.json');
const dup=read('p12-g04s1-113-b08-native24-crossyear114-public749-dedup-bounded-v1.json');
test('B08 source50 scanned corpus accounting stays distinct from final admission',()=>{
 assert.equal(proof.original_worklist_positions,50);
 assert.equal(proof.original_PDF_answer_BBox_verified,50);
 assert.deepEqual([proof.source_position_ordinal_start,proof.source_position_ordinal_end],[351,400]);
 assert.equal(proof.original_school_exam_papers,3);
 assert.equal(proof.original_native_113_exam_text_screened,24);
 assert.equal(proof.original_113_scanned_5_visual_semantic_dedup_gate_complete,false);
 assert.equal(proof.original_114_source_question_occurrences_screened,717);
 assert.equal(proof.public_113_114_G04S1_records_screened,749);
 assert.equal(proof.lexical_stem_ge_078_hits_in17,0);
 assert.equal(dup.original114_or_public_context17_high_near_stem_hits,0);
 assert.equal(proof.full_original_options_parent_semantic_duplicate_certified,false);
 assert.equal(proof.records.length,50);
 const statuses=proof.records.reduce((m,x)=>(m[x.status]=(m[x.status]||0)+1,m),{});
 assert.deepEqual(statuses,{
  HOLD_ORIGINAL_EXISTING_EXCEPTION:33,
  CANDIDATE_7_ORIGINAL_MC_WITH_SHARED_TEXT_PARENT_GATE:7,
  CANDIDATE_10_ORIGINAL_MATCHING_WITH_FORMAT_AND_PARENT_GATE:10
 });
 for(const x of proof.records){
  const y=cross.records.find(z=>z.ordinal===x.ordinal);
  assert.ok(y,'original B08 school source must be accounted');
  assert.equal(x.original_source_id,y.original_school_source_slot_id);
  assert.equal(x.source_pdf_page,y.pdf_page_1_based);
  assert.deepEqual(x.native_bbox_pdf_pts,y.bbox_pdf_pts);
  assert.equal(x.formal_science_kp_approved,false);
  assert.equal(x.admission_ready,false);assert.equal(x.published,false);
 }
 assert.deepEqual(proof.original_ANHE_ambiguous_matches,[368,369]);
 assert.equal(proof.has_user_exact_operator_approval_for_a_verified_final_B08_candidate_group,false);
 assert.equal(proof.current_113_approved_published_original_sourceIDs,316);
 assert.equal(proof.current_site_answer_slots,952);
 assert.equal(proof.prior_B01_B07_closeouts_unmodified,true);
 assert.equal(proof.B08_newly_student_published,0);
 assert.equal(proof.B08_ADMISSION_READY_new,0);
 assert.equal(proof.B08_FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(proof.not_student_PR_or_Pages_E2E_for_new_B08,true);
});
