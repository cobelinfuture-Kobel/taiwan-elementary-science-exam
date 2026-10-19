import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const ev=read('p12-g04s1-113-shihu-final009-33-exact-original-raster-marker-geometry-v1.json');
const prev=read('p12-g04s1-113-scan5-original-raster-bbox-progress127-of262-v13.json');
const now=read('p12-g04s1-113-scan5-original-marker-progress160-of262-v14.json');

test('Shihu 33 original physical markers are exact 180deg source JPEG component BBoxes',()=>{
 assert.equal(ev.summary.new_source_marker_pixel_geometry_positions,33);
 assert.equal(ev.summary.new_independently_certified_printed_answer_parentheses_pairs,27);
 assert.equal(ev.summary.new_matching_source_dot_anchors_exact,6);
 assert.equal(ev.summary.unresolved_parent7_composite_response_units_from_legacy_count,2);
 assert.equal(ev.remaining_parent7_hold.new_source_marker_positions_certified,0);
 assert.equal(ev.records.length,33);
 const ids=new Set();
 for(const r of ev.records){
   assert.equal(r.source_pdf_sha256,'0501c6a3157a6759a0e2b2101e02ef8c3944917f2b6d58d1033d04751034f22f');
   assert.ok(!ids.has(r.provisional_source_slot_id));ids.add(r.provisional_source_slot_id);
   assert.equal(r.source_pdf_rotation_degrees,180);
   assert.deepEqual(r.original_image_size_px,[3035,4299]);
   assert.equal(r.source_embedded_image_xref,({1:2,2:6,3:9})[r.source_pdf_page_1_based]);
   const b=r.source_page_upright_display_component_bbox_px,orig=r.original_unrotated_source_image_pixel_component_bbox;
   assert.deepEqual(orig,[3035-b[2],4299-b[3],3035-b[0],4299-b[1]]);
   assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=3035&&b[3]<=4299&&b[0]<b[2]&&b[1]<b[3]);
   b.forEach((v,i)=>assert.ok(Math.abs(r.source_display_pdf_bbox_pts_top_left[i]-v*(i%2?1031.76/4299:728.4/3035))<0.03));
   assert.equal(r.source_marker_pixel_bbox_certified,true);
   assert.equal(r.ocr_used,false);
   assert.equal(r.science_answer_formal,false);
   assert.equal(r.canonical_kp_formal,false);
   assert.equal(r.rights_formal,false);
   assert.equal(r.admission_ready,false);
   assert.equal(r.published,false);
   assert.equal(r.student_answer_completion_region_fully_certified,!r.physical_source_marker_type.includes('MATCHING'));
 }
 assert.deepEqual(ev.records.reduce((a,r)=>{a[r.source_pdf_page_1_based]=(a[r.source_pdf_page_1_based]||0)+1;return a;},{}),{'1':6,'2':24,'3':3});
 assert.equal(ev.records.filter(x=>x.physical_source_marker_type==='MATCHING_ITEM_SOURCE_DOT').length,6);
 assert.equal(ev.records.filter(x=>x.physical_source_marker_type==='PRINTED_ANSWER_PARENTHESIS_PAIR').length,27);
});

test('append-only source marker progress 127+27+6=160, 102 remain; 6 anchors not misreported as complete answers',()=>{
 assert.equal(prev.current_original_pixel_bbox_verified,127);
 assert.equal(prev.remaining_original_pixel_bbox_positions,135);
 assert.equal(now.prior_position_marker_evidence,127);
 assert.equal(now.new_exact_printed_answer_parentheses,27);
 assert.equal(now.new_matching_start_dot_anchors_only,6);
 assert.equal(now.current_source_positions_with_exact_physical_marker_or_start_dot_evidence,160);
 assert.equal(now.current_unlocated_or_granularity_hold_positions,102);
 assert.equal(now.current_original_source_position_legacy_section_slots,262);
 assert.equal(now.paper_counts.reduce((a,r)=>a+r.verified_source_raster_pixel_bbox,0),160);
 assert.equal(now.paper_counts.reduce((a,r)=>a+r.remaining,0),102);
 const shihu=now.paper_counts.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_009');
 assert.deepEqual([shihu.source_positions,shihu.verified_source_raster_pixel_bbox,shihu.remaining],[50,48,2]);
 assert.equal(now.among_current_new_source_anchor_only_pending_full_line_response_and_target_gate,6);
 assert.equal(now.formal_progress.FORMAL_SCIENCE_KP_APPROVED_new_this_batch,0);
 assert.equal(now.formal_progress.ADMISSION_READY_new_this_batch,0);
 assert.equal(now.formal_progress.PUBLISHED_new_this_batch,0);
 assert.equal(now.formal_progress.PUBLISHED_113_so_far,152);
 assert.equal(now.formal_progress.student_site_all_scopes,788);
});
