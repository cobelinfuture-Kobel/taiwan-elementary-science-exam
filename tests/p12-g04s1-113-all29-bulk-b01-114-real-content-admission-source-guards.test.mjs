import test from 'node:test';
import assert from 'node:assert/strict';
import {result} from '../scripts/review/p12-g04s1-113-all29-bulk-b01-original-content-dedup.mjs';
import {readJson,PLAN_PATH} from '../scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs';
const q=readJson('data/review/p12-g04s1-113-all29-bulk-b01-114-original-content-and-gate-routing-v1.json');
const text=readJson('data/review/p12-g04s1-113-all29-bulk-b01-authored-original-text-item-science-kp-v1.json');
const b=readJson(PLAN_PATH).batches[0];
const kps=new Set(readJson('site/data/authority/science-g03-g04-selector-v3.json').units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));

test('B01 exactly 114 in three existing original papers, 94 original text child references and 20 figure/drawing held pending',()=>{
 assert.equal(b.batch_id,'B01');
 assert.equal(b.source_work_count,114);
 assert.deepEqual(b.paper_unreviewed_count,{'SCI_G04_S1_113_MID_001':5,'SCI_G04_S1_113_FINAL_005':63,'SCI_G04_S1_113_FINAL_007':46});
 assert.equal(q.rows.length,114);
 assert.deepEqual(q.rows.map(r=>r.source_slot_id),b.source_slot_ids);
 assert.equal(new Set(q.rows.map(x=>x.source_slot_id)).size,114);
 assert.equal(q.records_with_PDF_original_question_or_child_text,94);
 assert.equal(q.records_pending_figure_dependent_stem_or_render,20);
 assert.equal(text.records.length,94);
 assert.equal(q.original_source_answer_bbox_refs_persisted,113);
 assert.equal(q.model_directKP_preliminary_count,67);
 assert.equal(q.operator_exact_roster_signed,false);
 assert.equal(result.total_original_source_work,114);
 assert.equal(result.source_text_evidence_rows,94);
 assert.equal(result.no_full_original_child_text_pending_figure_or_draw,20);
 assert.equal(result.original_source_page_and_bbox_nonnull,113);
});
test('B01 each named original source has inherited original page, parent, answer rectangle or explicit missing, never creates false public admission',()=>{
 const shas={
  'SCI_G04_S1_113_MID_001':'7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56',
  'SCI_G04_S1_113_FINAL_005':'94108a241a9833fda111ba7648ea4e1c424e5a64d84a090c42e4c9777c5218ec',
  'SCI_G04_S1_113_FINAL_007':'356d91fba36cd8b8bfe2e5a5e32a354b02d48e17782ce146e6cd8b5cf4881f12'
 };
 let bboxesMissing=0;
 for(const r of q.rows){
  assert.equal(r.original_pdf_sha256,shas[r.paper_id]);
  assert.ok([1,2].includes(r.original_pdf_page_1based));
  assert.ok(r.source_bbox_proof_ref.startsWith('data/review/'));
  assert.equal(r.official_FORMAL_SCIENCE_KP_APPROVED,false);
  assert.equal(r.operator_exact_source_approved,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
  assert.ok(r.next_short_step.length>5);
  assert.ok(r.source_text_evidence_stage);
  if(r.original_answer_bbox_pdf_points_top_left===null)bboxesMissing++;
  else assert.ok(r.original_answer_bbox_pdf_points_top_left.length===4&&r.original_answer_bbox_pdf_points_top_left.every(Number.isFinite));
  if(r.content_route==='TEXT_WITH_DIRECT_KP_CANDIDATE'){
   assert.ok(r.question_text_from_original_PDF);
   assert.ok(r.independent_answer_model_not_school_key);
   assert.ok(kps.has(r.model_direct_frozen48kp_id));
  }
  if(r.content_route==='PARENT_FIGURE_OR_DRAWING_REQUIRES_EXACT_VISUAL_ACCEPTANCE'){
   assert.equal(r.question_text_from_original_PDF,null);
   assert.equal(r.model_direct_frozen48kp_id,null);
   assert.equal(r.independent_answer_model_not_school_key,null);
  }
 }
 assert.equal(bboxesMissing,1);
});
test('24 original school sources and 114 originally UNREVIEWED positions never automatically promoted, 114 original source exact-match scanned',()=>{
 assert.equal(result.original_114_source_archives_checked,25);
 assert.equal(result.original_114_source_positions_checked,717);
 assert.ok(result.public_student_bank_item_blocks_scanned>=300);
 assert.equal(result.rows.length,114);
 assert.ok(result.preliminary_original_text_science_directkp_no_exact_source_match<=67);
 assert.equal(new Set(result.preliminary_shortlist_source_slot_ids).size,result.preliminary_shortlist_source_slot_ids.length);
 assert.equal(result.original_11329_semantic_parent_figure_review_complete,false);
 assert.equal(result.operator_source_roster_signed,false);
 assert.equal(result.new_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(result.new_ADMISSION_READY,0);
 assert.equal(result.new_PUBLISHED,0);
 assert.deepEqual(result.original_29_disjoint_remains,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 for(const r of result.rows){
  assert.equal(r.operator_eligible,false);
  assert.equal(r.full_11329_11425_semantic_duplicate_gate_accepted,false);
  assert.equal(r.ADMISSION_READY,false);
  assert.equal(r.PUBLISHED,false);
 }
});
