import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const mid= r('p12-g04s1-113-p04b-dongguang-mid004-last28-original-source-pdf-bbox-parent-v1.json');
const prev=r('p12-g04s1-113-p04b-dongguang-mid63-semantic-source-ids-35bbox-28hold-v1.json');
const v6=r('p12-g04s1-113-p04b-dongguang-mid63-active19-remaining10-resume-v6.json');
const fin=r('p12-g04s1-113-p04b-dongguang-final003-four-native-short-answers-parent-linked-v1.json');
const bboxProof=r('p12-g04s1-113-dongguang-final-p2-four-original-blank-bbox-v1.json');
test('Dongguang MID original PDF source 35 + 28 physical response places, not Science KP admission',()=>{
 assert.equal(prev.records.length,63);
 assert.equal(prev.actual_original_native_pdf_answer_marker_bboxes_inherited,35);
 assert.equal(mid.records.length,28);
 assert.equal(mid.original_16_S03_checkbox_pair_native_printed_glyphs,16);
 assert.equal(mid.original_4_S04_drawing_source_canvas_or_PDF_vector_rectangles,4);
 assert.equal(mid.original_4_S05_plant_classification_native_answer_parenthesis_blanks,4);
 assert.equal(mid.original_4_S05_original_PDF_horizontal_answer_lines,4);
 assert.equal(mid.original_pdf_binary_sha256_locally_reverified,true);
 assert.equal(new Set(mid.records.map(x=>x.source_slot_id_provisional)).size,28);
 for(const x of mid.records){
  const old=prev.records.find(y=>y.source_slot_id_provisional===x.source_slot_id_provisional);
  assert.ok(old);
  assert.equal(old.original_native_answer_bbox_pdf_pt,null);
  assert.ok(Array.isArray(x.exact_original_pdf_source_answer_glyph_or_response_canvas_bbox_pts_top_left));
  assert.equal(x.exact_original_pdf_source_answer_glyph_or_response_canvas_bbox_pts_top_left.length,4);
  assert.ok(x.source_original_pdf_page>=1&&x.source_original_pdf_page<=2);
  assert.equal(x.admission_ready,false);
 }
 assert.equal(v6.original_papers_with_complete_source_ID_and_physical_original_answer_marker_or_drawing_region_geometry,19);
 assert.equal(v6.active_complete_original_source_response_IDs_total,1088);
 assert.equal(v6.remaining_original_papers,10);
 assert.equal(v6.remaining_original_pdf_pages,26);
 assert.equal(v6.remaining_noncertified_section_working_regions,674);
 assert.equal(v6.completed_new_paper.original_63_unique_source_position_IDs.length,63);
 assert.equal(new Set(v6.completed_new_paper.original_63_unique_source_position_IDs.map(x=>x.id)).size,63);
 for(const k of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new'])assert.equal(v6[k],0);
});
test('Dongguang FINAL four original page2 glyph boxes source-native Y lines map to source S06 context without false student admission',()=>{
 assert.equal(fin.four_original_source_response_IDs_semantically_positionally_matched,4);
 assert.equal(fin.prior_native_page1_MC14_TF15_marker_count,29);
 assert.equal(fin.now_original_source_marker_IDs_with_exact_BBox,33);
 assert.equal(fin.other_source_section_granularity_and_canvas_figure_BBoxes_pending,true);
 assert.equal(fin.registered_original_PDF_sha256,bboxProof.source_pdf_sha256);
 assert.equal(fin.original_PDF_binary_sha256_locally_reverified,true);
 assert.equal(fin.records.length,4);
 assert.deepEqual(fin.records.map(x=>x.original_pdf_native_answer_glyph_bbox_pt_top_left),bboxProof.boxes);
 assert.equal(new Set(fin.records.map(x=>x.original_source_slot_id_provisional)).size,4);
 for(const x of fin.records){
  assert.equal(x.original_pdf_page_1_based,2);
  assert.equal(x.source_exact_independent_answer_marker_location_verified,true);
  assert.equal(x.admission_ready,false);
 }
 assert.equal(fin.ADMISSION_READY_new,0);
 assert.equal(fin.PUBLISHED_new,0);
});
