import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const review=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const native=review('p12-g04s1-113-neian-mid006-scan24-exact-raster-bbox-v1.json');
const dependent=review('p12-g04s1-113-neian-mid006-scan-page4-12-exact-raster-bbox-v1.json');
const total=review('p12-g04s1-113-scan5-original-raster-bbox-progress74-of262-v11.json');
const latest=review('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
const originalSHA='aec7ae8371c888e84da39653183050377c7dedf94dac71b112200cd9e78ba222';
const eq=(a,b,tol=0.03)=> assert.ok(Math.abs(a-b)<=tol, 'Expected '+a+' ~ '+b);

test('Neian 24 individually detected original glyph pair boxes have exact rotation and PDF mapping',()=>{
 assert.equal(native.records.length,24);
 assert.equal(native.summary.TF,9);
 assert.equal(native.summary.MC,15);
 assert.equal(native.summary.new_source_original_raster_bbox_verified,24);
 for (const x of native.records){
  assert.equal(x.source_original_pdf_sha256,originalSHA);
  assert.equal(x.source_geometry_verified,true);
  assert.equal(x.ocr_used,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
  const [u0,v0,u1,v1]=x.original_embedded_raw_raster_bracket_bbox_px;
  const up=x.original_pdf_page_1_based===1?[2023-v1,u0,2023-v0,u1]:[v0,2866-u1,v1,2866-u0];
  assert.deepEqual(x.display_upright_raster_pixel_bbox_px,up);
  const pts=up.map((v,i)=>v*(i%2?1031.76/2866:728.28/2023));
  pts.forEach((v,i)=>eq(v,x.mapped_pdf_page_bbox_pts_top_left[i]));
  assert.equal(x.original_embedded_image_xref,x.original_pdf_page_1_based===1?8:18);
 }
 assert.equal(new Set(native.records.map(x=>x.source_slot_id_provisional)).size,24);
 assert.equal(native.records.filter(x=>x.original_pdf_page_1_based===1).length,23);
 assert.equal(native.records.filter(x=>x.original_pdf_page_1_based===2).length,1);
});

test('Neian page4 12 marker boxes preserve figure dependencies and original transform',()=>{
 assert.equal(dependent.records.length,12);
 assert.equal(dependent.summary.figure_dependent_original_parent_boxes,6);
 assert.equal(dependent.summary.standalone_original_truefalse_boxes,6);
 for(const x of dependent.records){
  const [u0,v0,u1,v1]=x.exact_raw_original_raster_parenthesis_pair_bbox_px;
  const upright=[v0,2866-u1,v1,2866-u0];
  assert.deepEqual(x.exact_upright_display_raster_parenthesis_pair_bbox_px,upright);
  const pdf=upright.map((v,i)=>v*(i%2?1031.76/2866:728.28/2023));
  pdf.forEach((v,i)=>eq(v,x.mapped_original_pdf_bbox_pts_top_left[i]));
  assert.equal(x.original_pdf_sha256,originalSHA);
  assert.equal(x.original_scan_image_xref,31);
  assert.equal(x.source_geometry_verified,true);
  assert.equal(x.ocr_used,false);
  assert.equal(x.formal_science_kp_approved,false);
  assert.equal(x.admission_ready,false);
 }
 assert.equal(new Set(dependent.records.map(x=>x.source_slot_id_provisional)).size,12);
 assert.equal(native.records.some(x=>dependent.records.some(y=>x.source_slot_id_provisional===y.source_slot_id_provisional)),false);
});

test('scan5 prior 23 + Shihu 15 + Neian 36 = 74 original-pixel BBoxes; remaining 188, no unauthorized release',()=>{
 assert.equal(total.registered_source_section_slots,262);
 assert.equal(total.original_exact_scan_parentheses_BBox_prior_breakpoint,23);
 assert.equal(total.pre_existing_shihu_new_after_that_breakpoint,15);
 assert.equal(total.new_neian_source_BBox_this_run,36);
 assert.equal(total.current_all_5_scan_original_exact_individual_BBox_verified,74);
 assert.equal(total.current_remaining_original_scanned_source_positions_without_individual_exact_bbox,188);
 assert.deepEqual(total.scanned_papers.map(p=>p.verified_source_raster_pixel_bbox),[23,0,0,36,15]);
 for(const p of total.scanned_papers)assert.equal(p.source_positions,p.verified_source_raster_pixel_bbox+p.remaining);
 assert.equal(total.scanned_papers.reduce((v,p)=>v+p.source_positions,0),262);
 assert.equal(total.scanned_papers.reduce((v,p)=>v+p.remaining,0),188);
 assert.equal(latest.newly_published_113_slots,152);
 assert.equal(total.formal_progress.PUBLISHED_new_this_run,0);
 assert.equal(total.formal_progress.ADMISSION_READY_new_this_run,0);
 assert.equal(total.formal_progress.all_scope_site_published_answer_slots,788);
});
