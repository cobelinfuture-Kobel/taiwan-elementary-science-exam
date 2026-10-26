import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const s05s06=read('p12-g04s1-113-zhongxiao-final002-s05s06-22-exact-raster-bbox-v1.json');
const p1=read('p12-g04s1-113-zhongxiao-final002-firstpage10-pair-bbox-drawing4-hold-v1.json');
const mc14=read('p12-g04s1-113-zhongxiao-final002-page2-mc14-exact-raster-bbox-v1.json');
const snap=read('p12-g04s1-113-scan5-source-marker-progress256-of262-v17.json');
const old=read('p12-g04s1-113-scan5-source-marker-progress224-of262-v16.json');
const SHA='bf53534200aeb5fb7756f89d1a0bb9d60dd72f9055d2202a200b872b91489bee';
const eq=(a,b)=>assert.ok(Math.abs(a-b)<0.03,'expected '+a+' vs '+b);
test('Zhongxiao S05 14 checkbox and S06 8 reading original physical printed marks are page-aware, SHA-matched, non OCR',()=>{
 assert.equal(s05s06.records.length,22);
 assert.equal(s05s06.summary.new_section5_individual_printed_parenthesis_BBoxes,14);
 assert.equal(s05s06.summary.new_section6_reading_original_parenthesis_BBoxes,8);
 for(const r of s05s06.records){
  assert.equal(r.original_source_pdf_sha256,SHA);
  const pg=r.source_pdf_page_1_based;
  assert.equal(r.original_page_image_xref,pg===2?14:20);
  assert.equal(r.rotation_to_student_upright_ccw_degrees,pg===2?90:270);
  assert.deepEqual(r.original_image_raw_size_px,[4960,3507]);
  const [x0,y0,x1,y1]=r.source_upright_pixel_bbox_px;
  assert.ok(x0>=0&&x1<=3507&&y0>=0&&y1<=4960&&x1>x0&&y1>y0);
  const raw=pg===2?[4960-y1,x0,4960-y0,x1]:[y0,3507-x1,y1,3507-x0];
  assert.deepEqual(raw,r.source_original_raw_pixel_bbox_px);
  raw.forEach((v,i)=>eq(r.original_landscape_pdf_top_left_bbox_pts[i],v*(i%2?841.8/3507:1190.52/4960)));
  assert.equal(r.ocr_used,false);
  assert.equal(r.original_parent_context_required,true);
  assert.equal(r.physical_source_marker_exact_bbox_verified,true);
  assert.equal(r.formal_science_kp_approved,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
 }
});
test('Zhongxiao first page 10 actual original TF/MC short answer ink pairs, drawing 4 remain HOLD',()=>{
 assert.equal(p1.records.length,10);
 assert.equal(p1.summary.printed_S01_MC_5_BBoxes,5);
 assert.equal(p1.summary.printed_S02_image_dependent_shortanswer5_BBoxes,5);
 assert.equal(p1.remaining_drawing_source_slots.length,4);
 assert.equal(new Set(p1.records.map(x=>x.source_slot_id_provisional)).size,10);
 for(const r of p1.records){
  assert.equal(r.source_original_pdf_sha256,SHA);
  assert.equal(r.source_page_pdf_1_based,1);
  assert.equal(r.original_embedded_JPEG_xref,8);
  assert.equal(r.original_image_to_student_upright_ccw_rotation_degrees,270);
  const [x0,y0,x1,y1]=r.student_readable_ink_pair_bbox_px;
  const raw=[y0,3507-x1,y1,3507-x0];
  assert.deepEqual(r.original_embedded_source_image_raw_bbox_px,raw);
  raw.forEach((v,i)=>eq(r.original_landscape_pdf_bbox_pts_top_left[i],v*(i%2?841.8/3507:1190.52/4960)));
  assert.equal(r.source_exact_original_raster_answer_pair_bbox_verified,true);
  assert.equal(r.source_ocr_used,false);
  assert.equal(r.formal_science_kp_approved,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
 }
 for(const hold of p1.remaining_drawing_source_slots){
  assert.equal(hold.status,'HOLD_DRAW_ON_ORIGINAL_FIGURE_NO_FABRICATED_ANSWER_BBOX');
  assert.equal(hold.source_geometry_independent_answer_bbox_formally_certified,false);
  assert.equal(hold.admission_ready,false);
  assert.equal(hold.published,false);
 }
 const all=new Set([...mc14.records.map(x=>x.source_slot_id_provisional),...s05s06.records.map(x=>x.source_slot_id_provisional),...p1.records.map(x=>x.source_slot_id_provisional)]);
 assert.equal(all.size,46);
});
test('5-scanned-paper source marker progress exact 224+32=256/262, 6 HOLD, 6 anchor-only are not full answer BBoxes',()=>{
 assert.equal(old.current_source_positions_with_physical_marker_or_answer_origin_evidence,224);
 assert.equal(old.remaining_without_source_pixel_evidence_or_composite_HOLD,38);
 assert.equal(snap.registered_section_response_positions,262);
 assert.equal(snap.prior_source_marker_verified,224);
 assert.equal(snap.new_zhongxiao_exact_answer_brackets_this_cycle,32);
 assert.equal(snap.current_source_marker_verified_including_partial_matching_dots,256);
 assert.equal(snap.independent_original_answer_region_geometry_verified_excluding_partial_matching_dots,250);
 assert.equal(snap.source_only_matching_start_dots_without_complete_target_line,6);
 assert.equal(snap.unresolved_source_geometry_or_frozen_count_granularity,6);
 assert.equal(snap.unresolved_breakdown.zhongxiao_firstPage_drawing_on_figure,4);
 assert.equal(snap.unresolved_breakdown.shihu_final_parent7_motor_circuit_composite,2);
 assert.equal(snap.paper_details.reduce((a,x)=>a+x.source_positions,0),262);
 assert.equal(snap.paper_details.reduce((a,x)=>a+x.verified_source_raster_pixel_bbox,0),256);
 assert.equal(snap.paper_details.reduce((a,x)=>a+x.remaining,0),6);
 const zx=snap.paper_details.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_002');
 assert.deepEqual([zx.source_positions,zx.verified_source_raster_pixel_bbox,zx.remaining],[50,46,4]);
 assert.equal(snap.formal_progress.ADMISSION_READY_new_in_scan_source_cycle,0);
 assert.equal(snap.formal_progress.PUBLISHED_new_in_scan_source_cycle,0);
 assert.equal(snap.formal_progress.PUBLISHED_113_current,152);
 assert.equal(snap.formal_progress.site_total_answer_slots_all_scopes,788);
});
