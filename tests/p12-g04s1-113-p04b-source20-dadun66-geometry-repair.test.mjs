import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const d33=load('p12-g04s1-113-p04b-dadun-mid005-33native-table-exact-four-raster-image-hold-v1.json');
const d4=load('p12-g04s1-113-p04b-dadun-mid005-four-original-embedded-landform-answer-ink-bboxes-v1.json');
const d66=load('p12-g04s1-113-p04b-dadun66-active20-remaining9-resume-v7.json');
const d19=load('p12-g04s1-113-p04b-dongguang-mid63-active19-remaining10-resume-v6.json');
const registry=load('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const master=load('p12-g04s1-113-all29-master-ledger-v1.json');
test('DaDun corrected original page2 printed source response grammar: plant 8 / quake 4 / photo 4; 17 checkbox / 4 MC; 29 inherited',()=>{
 assert.equal(d33.original_table_8_cells_pdf_vector_exact,8);
 assert.equal(d33.earthquake_native_printed_parens_exact,4);
 assert.equal(d33.original_four_landform_photo_label_parentheses_raster_source_img_HOLD,4);
 assert.equal(d33.original_s04_native_17_check_exact,17);
 assert.equal(d33.original_s05_native_4_mc_exact,4);
 assert.equal(d33.original_this_cycle_new_exact_physical_original_source_region_bboxes,33);
 assert.equal(d33.verified_original_source_response_regions.length,33);
 assert.equal(d33.figure_label_raster_4_provisional_holds.length,4);
 assert.equal(d33.prior_29_original_native_pdf_exact_tfmc_source_bboxes_preserved,29);
 assert.equal(d33.corrected_original_section3_16_answers_8PLANTcells_4EARTHterms_4LANDFORMpicture_slots,true);
 assert.equal(d33.no_immutable_frozen_master_historical_region_counts_changed,true);
 assert.equal(d33.source_ids_full_66_final_accepted,false);
 const ids=new Set(d33.verified_original_source_response_regions.map(x=>x.source_slot_id_provisional));
 assert.equal(ids.size,33);
 for(const x of d33.verified_original_source_response_regions){
  assert.equal(x.original_pdf_page,2);
  const b=x.original_source_answer_or_table_cell_bbox_pdf_pt;
  assert.ok(Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3]);
  assert.equal(x.admission_ready,false);
 }
 const plant=d33.verified_original_source_response_regions.filter(x=>x.source_slot_id_provisional.includes('|S03|G01|'));
 assert.equal(plant.length,8);
 assert.deepEqual(plant.filter(x=>x.source_slot_id_provisional.includes('GROWTH_FEATURE')).map(x=>x.source_slot_id_provisional.split('|').at(-1)),['001','002','003','004']);
 assert.deepEqual(plant.filter(x=>x.source_slot_id_provisional.includes('PLANT_EXAMPLE')).map(x=>x.source_slot_id_provisional.split('|').at(-1)),['001','002','003','004']);
});
test('DaDun four printed source photo parentheses use actual original pixel / PDF image affine, not approximate rendered boxes',()=>{
 assert.equal(d4.original_pdf_SHA256_locally_reverified,true);
 assert.deepEqual(d4.original_image_pixels,[265,341]);
 assert.equal(d4.source_only_markers.length,4);
 assert.equal(d4.newly_certified_exact_original_printed_image_ink_parenthesis_pairs,4);
 assert.equal(d4.source_geometry_29_prior_native_plus_33_new_native_vector_plus_4_actual_raster_complete,66);
 for(const x of d4.source_only_markers){
  assert.equal(x.original_image_xref,41);
  assert.equal(x.source_original_pdf_page_1_based,2);
  assert.equal(x.student_site_source_image_copied,false);
  assert.equal(x.admission_ready,false);
  const p=x.original_answer_ink_pixel_bbox_px,t=x.original_image_transform_pdf_points,b=x.original_pdf_page_answer_bbox_pt_top_left;
  const transformed=[t[4]+p[0]*t[0]/265,t[5]+p[1]*t[3]/341,t[4]+p[2]*t[0]/265,t[5]+p[3]*t[3]/341];
  assert.ok(transformed.every((v,i)=>Math.abs(v-b[i])<0.003),'actual original raster ink transform must round to <0.003 pt');
 }
 assert.equal(d4.ADMISSION_READY_new,0);
});
test('Whole corpus source only completion 20/29 = 1154 original response region identity and geometry; 9 school originals still incomplete',()=>{
 assert.equal(d19.original_papers_with_complete_source_ID_and_physical_original_answer_marker_or_drawing_region_geometry,19);
 assert.equal(d19.active_complete_original_source_response_IDs_total,1088);
 assert.equal(d66.original_papers_with_complete_source_ID_and_exact_original_answer_glyph_table_photo_box_or_drawing_geometry,20);
 assert.equal(d66.original_response_ID_records_with_per_source_physical_geometry_total,1154);
 assert.equal(d66.source_previous_complete_19_original_IDs,1088);
 assert.equal(d66.original_newly_completed_source_IDs_exact_geometry,66);
 assert.equal(d66.remaining_original_source_geometry_papers,9);
 assert.equal(d66.remaining_original_pdf_pages,24);
 assert.equal(d66.remaining_working_section_positions_NOT_CERTIFIED,608);
 assert.equal(d66.remaining_original_physical_native_raster_response_marker_or_start_dot_evidence_source_only,231);
 assert.equal(d66.remaining_actual_printed_answer_marker_geometry_source_only,225);
 assert.equal(d66.remaining_partial_matching_dots_NOT_independent_student_answer_boxes,6);
 assert.equal(d66.complete_new_paper.source_response_positions.length,66);
 assert.equal(new Set(d66.complete_new_paper.source_response_positions.map(x=>x.source_slot_id)).size,66);
 const orig=registry.original_source_records.find(x=>x.source_id===d66.original_newly_completed_school_paper);
 const row=master.paper_records.find(x=>x.paper_id===d66.original_newly_completed_school_paper);
 assert.equal(d66.complete_new_paper.original_pdf_sha256,orig.original_pdf_sha256);
 assert.equal(d66.complete_new_paper.original_response_IDs_exact_geometry_count,row.section_reconciled_positions);
 assert.equal(d66.complete_new_paper.already_main_published_source_positions_retained,row.published_count);
 assert.equal(d66.remaining_original_paper_ids.length,9);
 assert.equal(d66.remaining_source_only_physical_marker_or_partial_start_dot_rows.length,231);
 for(const row of d66.complete_new_paper.source_response_positions){
  assert.ok(row.source_slot_id.startsWith(d66.original_newly_completed_school_paper+'|'));
  assert.ok([1,2].includes(row.original_pdf_page));
  const b=row.original_actual_source_answer_bbox_pts_top_left;
  assert.ok(b.length===4&&b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]);
  assert.equal(row.full_source_and_science_KP_dup_rights_admission_pending,true);
 }
 assert.equal(d66.all29_full_source_stem_options_figures_rights_science_KP_operator_admission_formal_complete_papers,0);
 assert.equal(d66.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(d66.ADMISSION_READY_new,0);
 assert.equal(d66.PUBLISHED_new,0);
 assert.equal(d66.main_113_already_published_source_positions_unchanged,178);
});
