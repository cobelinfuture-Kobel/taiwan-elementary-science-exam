import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const last=read('p12-g04s1-113-neian-mid006-last26-exact-raster-bbox-v1.json');
const prior24=read('p12-g04s1-113-neian-mid006-scan24-exact-raster-bbox-v1.json');
const prior12=read('p12-g04s1-113-neian-mid006-scan-page4-12-exact-raster-bbox-v1.json');
const old=read('p12-g04s1-113-scan5-original-raster-bbox-progress74-of262-v11.json');
const now=read('p12-g04s1-113-scan5-original-raster-bbox-progress100-of262-v12.json');
const current=read('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
const expectedSHA='aec7ae8371c888e84da39653183050377c7dedf94dac71b112200cd9e78ba222';
const eq=(a,b)=>assert.ok(Math.abs(a-b)<=0.03,'MISMATCH: '+a+' ~ '+b);

test('Neian last26 printed original raster BBoxes mapped through verified alternating-page affine rotations',()=>{
 assert.equal(last.records.length,26);
 assert.deepEqual(last.summary.by_section,{S3:6,S4:6,S5:5,S6:9});
 assert.equal(prior24.records.length,24);
 assert.equal(prior12.records.length,12);
 const ids=new Set();
 for(const r of last.records) {
  assert.equal(r.original_source_PDF_sha256,expectedSHA);
  assert.ok([2,3].includes(r.original_PDF_page_1_based));
  assert.equal(r.source_embedded_image_xref,r.original_PDF_page_1_based===2?18:25);
  assert.deepEqual(r.original_source_image_size_px,[2866,2023]);
  assert.equal(r.actual_embedded_image_rotation_to_display_degrees,r.original_PDF_page_1_based===2?90:-90);
  assert.equal(r.visual_source_answer_position_verified,true);
  assert.equal(r.formal_science_kp_approved,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
  assert.equal(r.full_original_parent_material_must_remain_linked,true);
  assert.ok(!ids.has(r.source_slot_id_provisional));ids.add(r.source_slot_id_provisional);
  const [x0,y0,x1,y1]=r.raw_exact_original_raster_ink_pair_union_bbox_px;
  assert.ok(x0>=0&&y0>=0&&x1<=2866&&y1<=2023&&x0<x1&&y0<y1);
  const up=r.original_PDF_page_1_based===2?[y0,2866-x1,y1,2866-x0]:[2023-y1,x0,2023-y0,x1];
  const pdf=up.map((v,i)=>v*(i%2?1031.76/2866:728.28/2023));
  pdf.forEach((v,i)=>eq(v,r.mapped_original_PDF_top_left_bbox_pts[i]));
 }
 const priorIDs=new Set([...prior24.records.map(x=>x.source_slot_id_provisional),...prior12.records.map(x=>x.source_slot_id_provisional)]);
 for(const id of ids) assert.ok(!priorIDs.has(id),'overlap: '+id);
 assert.equal(priorIDs.size+ids.size,62);
});

test('append only scan5 74+26=100/262 exact pixel BBox, 162 remaining, no admissions',()=>{
 assert.equal(old.current_all_5_scan_original_exact_individual_BBox_verified,74);
 assert.equal(old.current_remaining_original_scanned_source_positions_without_individual_exact_bbox,188);
 assert.equal(now.source_exact_original_raster_pixel_bbox_previous_verified,74);
 assert.equal(now.source_exact_original_raster_pixel_bbox_added,26);
 assert.equal(now.source_exact_original_raster_pixel_bbox_current,100);
 assert.equal(now.source_exact_original_raster_pixel_bbox_remaining,162);
 assert.equal(now.scanned_papers.reduce((n,x)=>n+x.source_positions,0),262);
 assert.equal(now.scanned_papers.reduce((n,x)=>n+x.verified_source_raster_pixel_bbox,0),100);
 assert.equal(now.scanned_papers.reduce((n,x)=>n+x.remaining,0),162);
 const neian=now.scanned_papers.find(p=>p.source_id==='SCI_G04_S1_113_MID_006');
 assert.equal(neian.source_positions,62);assert.equal(neian.verified_source_raster_pixel_bbox,62);assert.equal(neian.remaining,0);
 assert.equal(now.formal_progress.ADMISSION_READY_new_this_run,0);
 assert.equal(now.formal_progress.PUBLISHED_113_new_this_run,0);
 assert.equal(now.formal_progress.student_site_all_scopes,788);
 assert.equal(current.newly_published_113_slots,152);
});
