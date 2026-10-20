import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const source=d('p12-g04s1-113-p04b-remaining12-native267-scan94-dedup361-source-coverage-v2.json');
const old=d('p12-g04s1-113-p04b-remaining12-native265-scan94-dedup359-source-coverage-v1.json');
const tier=d('p12-g04s1-113-p04b-tier1-neihu4-zhongxiao4-shihu2-10-source-parent-holds-v1.json');
const reg=d('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const current=d('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
test('Already published Yongan 113 original BBoxes inherited, never new admission',()=>{
 assert.equal(source.source_only_marker_records.length,361);
 assert.equal(source.source_only_physical_marker_ids_total_in_remaining12,361);
 assert.equal(source.original_native_pdf_marker_ids_exact,267);
 assert.equal(source.scanned_pdf_ink_marker_or_start_dot_ids_exact,94);
 assert.equal(source.original_independent_answer_marker_boxes_source_only,355);
 assert.equal(source.original_matching_source_dot_not_full_response_boxes,6);
 assert.equal(source.previous_359_source_marker_evidence_preserved,359);
 assert.equal(source.main_existing_published_source_markers_recovered_not_new_publications,2);
 assert.equal(source.previously_published_original113_sources_in_remaining12_from_main_total,89);
 assert.equal(source.previously_published_original113_sources_already_covered_v1,87);
 assert.equal(source.all_89_already_published_remaining12_source_IDs_now_covered_in_source_marker_evidence,true);
 assert.equal(source.duplicate_provenance_rows_collapsed_into_359_ids,109);
 assert.equal(source.existing_113_source_positions_unchanged||source.site_original113_previously_published_positions_unchanged,178);
 const b=new Map(old.source_only_marker_records.map(x=>[x.id,x]));
 for(const x of old.source_only_marker_records) assert.deepEqual(source.source_only_marker_records.find(y=>y.id===x.id),b.get(x.id));
 const newRows=source.source_only_marker_records.filter(x=>!b.has(x.id));
 assert.deepEqual(newRows.map(x=>x.id).sort(),['SCI_G04_S1_113_MID_008|S01|TF|002','SCI_G04_S1_113_MID_008|S01|TF|007']);
 for(const z of newRows){
  assert.equal(z.already_main_published,true);
  assert.ok(current.all_unique_published_source_slot_ids.includes(z.id));
  assert.equal(z.original_pdf_sha256,reg.original_source_records.find(x=>x.source_id===z.paper_id).original_pdf_sha256);
  assert.equal(z.source_evidences.length,1);
  assert.equal(z.source_evidences[0].original_pdf_page_1_based,1);
  assert.equal(z.source_evidences[0].source_type,'MAIN_ALREADY_PUBLISHED_OPERATOR_APPROVED_EXACT_SOURCE_BBOX');
 }
 assert.equal(source.PUBLISHED_new,0);
 assert.equal(source.ADMISSION_READY_new,0);
 assert.equal(source.FORMAL_SCIENCE_KP_APPROVED_new,0);
});
test('Tier1 exact 10 child positions use parent ROI and approximate visual boxes without false answer BBoxes',()=>{
 assert.equal(tier.sources.length,10);
 assert.equal(tier.missing_children_total_original_WORKING_HOLD,10);
 assert.equal(tier.neihu_four_raster_render_candidates,4);
 assert.equal(tier.zhongxiao_four_draw_on_original_figure,4);
 assert.equal(tier.shihu_two_composite_parent_rows,2);
 assert.equal(tier.official_new_independent_answer_bboxes_certified_this_cycle,0);
 assert.equal(tier.prior_verified_parent_figure_roi_locations_reused,6);
 assert.equal(tier.neihu_display_rendered_bbox_is_NOT_exact_source_ink_bbox,true);
 assert.equal(tier.never_infer_student_answer_count_from_parent_rows_or_printed_score,true);
 assert.equal(new Set(tier.sources.map(x=>x.original_source_slot_id_provisional)).size,10);
 const s=new Map(reg.original_source_records.map(x=>[x.source_id,x]));
 for(const z of tier.sources){
  assert.equal(z.source_pdf_sha256,s.get(z.paper_id).original_pdf_sha256);
  assert.equal(z.original_figures_public_rights_verified??z.source_figure_rights_cleared,false);
  assert.ok(z.disposition.startsWith('HOLD_'));
  if(z.paper_id.endsWith('FINAL_011')){
   assert.equal(z.original_pdf_page,3);
   assert.equal(z.original_response_bbox_pdf_pt_exact,null);
   assert.equal(z.physical_source_original_pixel_ink_components_exact_certified,false);
   assert.equal(z.candidate_pdf_visual_target_bbox_pt_NONCERTIFIED.length,4);
   assert.equal(z.grid_position.row>=1&&z.grid_position.row<=2,true);
  }else{
   assert.equal(z.parent_figure_bbox_NOT_INDEPENDENT_ANSWER_BOX,true);
   assert.equal(z.parent_figure_roi_original_pdf_top_left_pt.length,4);
   if(z.paper_id.endsWith('FINAL_002'))assert.equal(z.independent_printed_answer_marker_bbox,null);
   if(z.paper_id.endsWith('FINAL_009'))assert.equal(z.original_printed_child_answer_box_count_certified,null);
  }
 }
 for(const k of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new'])assert.equal(tier[k],0);
});
