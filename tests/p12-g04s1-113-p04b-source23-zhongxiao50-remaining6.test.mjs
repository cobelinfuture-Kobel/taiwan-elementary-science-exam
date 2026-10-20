import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const v8=rd('p12-g04s1-113-p04b-22papers-1288-sourcegroup-7remaining-v8.json');
const v9=rd('p12-g04s1-113-p04b-23papers-1338-remaining6-sourcegroup-v9.json');
const z=rd('p12-g04s1-113-p04b-zhongxiao-final002-46markers-4drawparents-source50-v1.json');
const p=rd('p12-g04s1-113-scan5-remaining6-actual-original-parent-figure-rois-v18.json');
const reg=rd('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
test('P04B 23 source-response-mode original papers: 1338 noncertified target anchors and six original papers remain',()=>{
 assert.equal(v8.completed_original_papers_source_target_and_response_mode_reconciled,22);
 assert.equal(v8.completed_source_response_target_IDs_not_student_question_count,1288);
 assert.equal(v9.original_papers_with_source_ID_response_mode_geometry_reconciled,23);
 assert.equal(v9.original_source_response_target_IDs_working_NOT_certified_question_count,1338);
 assert.equal(v9.newly_source_group_mode_reconciled_Zhongxiao_FINAL002,50);
 assert.equal(v9.remaining_original_school_papers,6);
 assert.equal(v9.remaining_original_PDF_pages,16);
 assert.equal(v9.remaining_NONCERTIFIED_working_response_target_regions,424);
 assert.equal(v9.remaining_existing_physical_source_marker_or_matching_start_dot_anchors,154);
 assert.equal(v9.remaining_independent_printed_answer_marker_BBoxes,148);
 assert.equal(v9.remaining_matching_partial_start_dots_without_target_line,6);
 assert.deepEqual(v9.remaining_paper_ids,v8.remaining_paper_ids.filter(x=>x!=='SCI_G04_S1_113_FINAL_002'));
 assert.equal(v9.previous_main_published_113_source_ids_unchanged,178);
 assert.equal(v9.formal_original_entire_papers_passed_SOURCE_EXACT_Science_KP_Rights_Duplicate_Admission,0);
 for(const f of ['NEW_FORMAL_SCIENCE_KP_APPROVED','NEW_ADMISSION_READY','NEW_PUBLISHED'])assert.equal(v9[f],0);
});
test('Zhongxiao: 46 exact original printed scan answer marks plus four real source draw-on-figure parents NOT fabricated answer boxes',()=>{
 assert.equal(z.original_PDF_sha256,reg.original_source_records.find(x=>x.source_id===z.source_original_PDF_id).original_pdf_sha256);
 assert.equal(z.original_46_exact_independent_scanned_original_ink_answer_marker_bboxes,46);
 assert.equal(z.remaining_4_original_direct_on_figure_drawing_responses_without_independent_printed_answer_boxes,4);
 assert.equal(z.original_response_working_targets_NONCERTIFIED,50);
 assert.equal(z.original_four_drawing_full_parent_source_types.length,4);
 const sourceParent=p.records.filter(x=>x.source_id===z.source_original_PDF_id);
 const map=new Map(sourceParent.map(x=>[x.source_slot_id_provisional,x]));
 for(const r of z.original_four_drawing_full_parent_source_types){
  assert.equal(r.independent_printed_answer_bbox_exists,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.original_image_publication_rights_verified,false);
  assert.deepEqual(r.source_original_figure_roi_bbox_pts_top_left,map.get(r.id).source_pdf_parent_roi_bbox_pts_top_left);
 }
 assert.equal(z.new_formal_science_KP48_duplicates_operator_admission_passed,0);
 assert.equal(z.new_published,0);
});
