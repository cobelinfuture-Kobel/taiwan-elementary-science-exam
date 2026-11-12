import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const v13=r('p12-g04s1-113-p04b-27papers-1589-original-sourcegroup-remaining2-v13.json');
const v14=r('p12-g04s1-113-p04b-28papers-1670-one-remaining-taozijiao92-v14.json');
const v15=r('p12-g04s1-113-p04b-all29-1762-noncertified-source-modes-v15.json');
const m=r('p12-g04s1-113-p04b-minquan-final004-75new-native48-figure27-81source-v1.json');
const t=r('p12-g04s1-113-p04b-taozijiao-final008-all92-native73-figure19-article-rights-hold-v1.json');
const reg=r('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const master=r('p12-g04s1-113-all29-master-ledger-v1.json');
test('Minquan FINAL004 source-only 81 working positions: original6 TF, 48 new real native answer marks, 27 shared-picture/matching parents',()=>{
 assert.equal(m.records.length,75);
 assert.equal(m.prior_p1_s01_TF6_exact_original_PDF_native_answer_BBoxes,6);
 assert.equal(m.new_original_native_independent_printed_answer_markers_exact,48);
 assert.equal(m.new_original_figure_matching_circuit_LED_ORIGINAL_PARENT_regions_not_individual_printed_markers,27);
 assert.equal(m.total_original_source_work_targets_6plus75,81);
 assert.equal(m.records.filter(x=>x.exact_independent_printed_answer_marker_bbox).length,48);
 assert.equal(m.records.filter(x=>!x.exact_independent_printed_answer_marker_bbox).length,27);
 assert.equal(m.original_pdf_sha256,reg.original_source_records.find(x=>x.source_id===m.paper_id).original_pdf_sha256);
 assert.equal(master.paper_records.find(x=>x.paper_id===m.paper_id).section_reconciled_positions,81);
 for(const x of m.records){
  const b=x.original_source_box_or_parent_bbox_pts_top_left;
  assert.ok(Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[2]>b[0]&&b[3]>b[1]);
  assert.equal(x.admission_ready,false);
 }
 assert.equal(new Set(m.records.map(x=>x.original_response_source_id)).size,75);
 assert.equal(v14.original_school_papers_with_per_original_response_ID_source_marker_or_parent_location_reconciled,28);
 assert.equal(v14.source_original_work_response_target_IDs_NOT_formally_approved_questions,1670);
 assert.equal(v14.remaining_original_pdf_pages,3);
 assert.equal(v14.remaining_working_source_positions_NONCERTIFIED,92);
 assert.equal(v14.remaining_original_preexisting_native_source_answer_markers,30);
});
test('Taozijiao FINAL008 92 original working response modes: 47 native p1, 26 native p2, 19 original figure parent ROIs; article and drawing rights HOLD',()=>{
 assert.equal(t.original_source_mode_records.length,92);
 assert.equal(t.original_page1_five_MC_and_six_subgroups_seven_check_statements_each,47);
 assert.equal(t.physical_native_printed_answer_glyph_boxes_73,73);
 assert.equal(t.original_picture_parent_placement_rects_19_NOT_independent_ink_answer_boxes,19);
 assert.equal(t.original_page2_G08_one_free_draw_circuit_not_three_student_questions,1);
 assert.equal(t.original_page2_G12_six_picture_circuit_codes_plus_eight_native_text_answers,14);
 assert.equal(t.original_page2_S03_reading_six_native_multiple_choice_answers_WITH_one_page3_original_attached_article,6);
 assert.equal(t.original_article_page3_external_BoyoScience_source_rights_NOT_cleared,true);
 assert.equal(t.original_article_contains_nontrivial_science_claims_needing_science_unique_answer_review,true);
 assert.equal(t.source_registered_original_PDF_SHA256,reg.original_source_records.find(x=>x.source_id===t.original_paper_id).original_pdf_sha256);
 assert.equal(master.paper_records.find(x=>x.paper_id===t.original_paper_id).section_reconciled_positions,92);
 assert.equal(new Set(t.original_source_mode_records.map(x=>x.source_id)).size,92);
 assert.equal(t.original_source_mode_records.filter(x=>x.original_exact_printed_answer_glyph_bbox).length,73);
 assert.equal(t.original_source_mode_records.filter(x=>!x.original_exact_printed_answer_glyph_bbox).length,19);
 assert.equal(t.original_source_mode_records.filter(x=>x.mode==='SCIENCE_ARTICLE_MC').length,6);
 for(const x of t.original_source_mode_records){
  const b=x.bbox_pdf_top_left;
  assert.ok(b.length===4&&b.every(Number.isFinite)&&b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]);
  assert.equal(x.admission_ready,false);
 }
 for(const k of ['new_formal_science_KP_approved','new_admission_ready','new_published'])assert.equal(t[k],0);
});
test('ALL29 original PDF source-mode ID work position count reconciles 1762 NONCERTIFIED working positions; formal source science 48KP rights/admission unchanged',()=>{
 assert.equal(v13.original_school_papers_per_answer_source_ID_and_original_response_mode_location_reconciled,27);
 assert.equal(v13.original_noncertified_source_answer_work_target_identities_NOT_student_unique_question_count,1589);
 assert.equal(v14.original_school_papers_with_per_original_response_ID_source_marker_or_parent_location_reconciled,28);
 assert.equal(v14.source_original_work_response_target_IDs_NOT_formally_approved_questions,1670);
 assert.equal(v15.original_113_G04S1_school_exam_PDFs_source_work_response_ID_parent_mode_itemized,29);
 assert.equal(v15.original_exam_PDFs_in_scope_total,29);
 assert.equal(v15.original_PDFs_outstanding_for_source_work_mode_itemization,0);
 assert.equal(v15.original_work_response_target_IDs_total_PROVISIONAL_NONCERTIFIED,1762);
 assert.equal(v15.final_Taozijiao_FINAL008_original_work_targets,92);
 assert.equal(v15.final_Taozijiao_all73_original_native_printed_answer_brackets_exact,73);
 assert.equal(v15.final_Taozijiao_19_image_selection_or_graphic_drawing_parent_regions_not_printed_answer_bbox,19);
 assert.equal(v15.source_work_target_count_1762_is_NOT_independently_accepted_student_exam_question_count,true);
 assert.equal(v15.prior_natural_113_178_published_source_IDs_on_main_unchanged,178);
 assert.equal(v15.full_original_stem_options_parents_figures_context_exact_formal_rights_SCIENCE_UNIQUE_answer_direct48KP_DUPLICATE_operator_ADMISSION_29paper_closeouts,0);
 assert.equal(v15.original_moon_subject_cross_edition_frozen48KP_SCOPE_HOLD,true);
 assert.equal(v15.original_reading_article_BoyoScience_rights_HOLD,true);
 assert.deepEqual(v15.remaining_source_original_pdf_papers,[]);
 for(const k of ['NEW_FORMAL_SCIENCE_KP_APPROVED','NEW_ADMISSION_READY','NEW_PUBLISHED'])assert.equal(v15[k],0);
});
