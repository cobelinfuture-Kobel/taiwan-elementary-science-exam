import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const first=get('p12-g04s1-113-heshun-final001-first23-exact-original-raster-bbox-v1.json');
const last=get('p12-g04s1-113-heshun-final001-last27-exact-original-raster-bbox-v1.json');
const previous=get('p12-g04s1-113-scan5-original-marker-progress160-of262-v14.json');
const latest=get('p12-g04s1-113-scan5-original-marker-progress210-of262-v15.json');
const SHA='3fc18d09fe6a9b4b43cdd28b17497d5a21b4962c24f859965ca8f22945ed932e';
const check=(b,raw,pts)=>{
 assert.deepEqual(raw,[b[1],3035-b[2],b[3],3035-b[0]]);
 assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=3035&&b[3]<=4299&&b[0]<b[2]&&b[1]<b[3]);
 b.forEach((v,i)=>assert.ok(Math.abs(pts[i]-v*(i%2?1031/4299:728/3035))<0.03));
};
test('Heshun FINAL 50 original black source markers map exact +90 rotated embedded JPEG, do not treat red writing as teacher key',()=>{
 assert.equal(first.records.length,23);
 assert.equal(last.records.length,27);
 assert.equal(first.summary.new_full_source_marker_boxes,23);
 assert.equal(last.summary.new_original_physical_answer_areas,27);
 assert.equal(last.summary.original_response_marker_total_50,50);
 const ids=new Set();
 for(const r of first.records){
  assert.equal(r.source_original_pdf_sha256,SHA);
  assert.equal(r.source_embedded_image_xref,5);
  assert.equal(r.actual_pdf_page_rotation_degrees,90);
  assert.equal(r.original_teacher_answer_key_authenticated,false);
  assert.equal(r.source_exact_marker_bbox_verified,true);
  check(r.source_display_upright_exact_printed_open_close_bracket_bbox_px,r.original_raw_pixel_bbox_px,r.mapped_pdf_page_bbox_pts_top_left);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
  assert.ok(!ids.has(r.provisional_source_slot_id));ids.add(r.provisional_source_slot_id);
 }
 for(const r of last.records){
  assert.equal(r.original_pdf_sha256,SHA);
  assert.equal(r.original_source_image_xref,r.original_pdf_page_1_based===1?5:7);
  assert.equal(r.pdf_page_rotation_degrees,90);
  assert.equal(r.source_geometry_certified,true);
  assert.equal(r.original_red_answers_are_unverified_teacher_key,true);
  check(r.source_upright_ink_bbox_px,r.source_original_raw_image_pixel_bbox_px,r.source_pdf_top_left_bbox_pts);
  assert.equal(r.formal_science_kp_approved,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published,false);
  assert.ok(!ids.has(r.provisional_source_slot_id));ids.add(r.provisional_source_slot_id);
 }
 assert.equal(ids.size,50);
 assert.equal(last.records.filter(x=>x.source_ink_pixel_method.includes('DIAGRAM_ANSWER')).length,4);
});
test('frozen 262 source positions: 127 + Shihu33 + Heshun50=210 marker evidence, remaining 52 including six dot anchors and two Shihu holds',()=>{
 assert.equal(previous.current_source_positions_with_exact_physical_marker_or_start_dot_evidence,160);
 assert.equal(previous.current_unlocated_or_granularity_hold_positions,102);
 assert.equal(latest.source_positions,262);
 assert.equal(latest.source_markers_verified_total,210);
 assert.equal(latest.source_positions_remaining_without_verified_markers_or_with_original_granularity_HOLD,52);
 assert.equal(latest.scanned_papers.reduce((a,p)=>a+p.source_positions,0),262);
 assert.equal(latest.scanned_papers.reduce((a,p)=>a+p.verified_source_raster_pixel_bbox,0),210);
 assert.equal(latest.scanned_papers.reduce((a,p)=>a+p.remaining,0),52);
 assert.equal(latest.source_marker_qualification.fully_certified_independent_physical_answer_regions_excluding_source_only_matching_dots,204);
 assert.equal(latest.source_marker_qualification.source_only_matching_anchor_dots_without_complete_response_line,6);
 assert.equal(latest.source_marker_qualification.source_parent_composite_slots_shihu_hold,2);
 const h=latest.scanned_papers.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_001');
 assert.deepEqual([h.source_positions,h.verified_source_raster_pixel_bbox,h.remaining],[50,50,0]);
 assert.equal(latest.formal_progress.FORMAL_SCIENCE_KP_APPROVED_new_from_scan_geometry,0);
 assert.equal(latest.formal_progress.ADMISSION_READY_new,0);
 assert.equal(latest.formal_progress.PUBLISHED_new,0);
 assert.equal(latest.formal_progress.PUBLISHED_113_current,152);
 assert.equal(latest.formal_progress.student_site_total_all_scopes,788);
});
