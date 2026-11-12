import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const last=read('p12-g04s1-113-heshun-mid002-last27-exact-original-raster-bbox-v1.json');
const now=read('p12-g04s1-113-scan5-original-raster-bbox-progress127-of262-v13.json');
const old=read('p12-g04s1-113-scan5-original-raster-bbox-progress100-of262-v12.json');
const frozen=read('p12-g04s1-113-all29-stage2-section-slot-reconciliation-v1.json');
const sourceSHA='88f6f7eb5999652d95c0e3f8db8125fca4673db1552f2173a6156e78ddfc706b';

test('Heshun 27 original pixel table cell bounds / exact bracket components preserve 22 fill + 5 reading slots',()=>{
 assert.equal(last.records.length,27);
 assert.equal(last.summary.new_original_source_raster_answer_geometries,27);
 assert.equal(last.summary.animal_table_cell_regions,7);
 assert.equal(last.summary.water_plant_table_cell_regions,8);
 assert.equal(last.summary.moon_printed_parentheses,7);
 assert.equal(last.summary.reading_printed_parentheses,5);
 assert.equal(last.summary.source_exact_raster_bbox_total_of_50,50);
 const ids=new Set();
 for(const r of last.records){
   assert.ok(!ids.has(r.source_slot_id_provisional));
   ids.add(r.source_slot_id_provisional);
   assert.equal(r.original_pdf_sha256,sourceSHA);
   assert.ok([1,2].includes(r.source_page_pdf_1_based));
   assert.equal(r.original_scan_image_xref,r.source_page_pdf_1_based===1?8:14);
   assert.deepEqual(r.original_image_raster_pixels,[4960,3507]);
   assert.equal(r.source_raster_geometry_verified,true);
   assert.equal(r.source_requires_parent_visual_material,true);
   assert.equal(r.formal_science_kp_approved,false);
   assert.equal(r.admission_ready,false);
   assert.equal(r.published,false);
   const b=r.original_raw_raster_bbox_px;
   assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=4960&&b[3]<=3507&&b[0]<b[2]&&b[1]<b[3]);
   for(let i=0;i<4;i++){
    const val=b[i]*(i%2?841/3507:1190/4960);
    assert.ok(Math.abs(r.mapped_pdf_bbox_top_left_pts[i]-val)<=0.02,'original pixel -> PDF point: '+r.source_slot_id_provisional);
   }
 }
 assert.equal(last.records.filter(x=>x.original_response_geometry_type==='SCANNED_TABLE_RULED_CELL').length,15);
 assert.equal(last.records.filter(x=>x.original_response_geometry_type==='SCANNED_ORIGINAL_PRINTED_PARENTHESIS_COMPONENT_UNION').length,12);
 assert.equal(last.records.filter(x=>x.original_parent_context==='SOURCE_MOON_IMAGES').length,7);
 assert.equal(last.records.some(x=>x.source_slot_id_provisional==='SCI_G04_S1_113_MID_002|S01|ANIMAL_TABLE|RESPIRATION|01'),false, 'original preprinted answer cannot be silently counted as another blank');
});

test('scan5 127/262 and two completed papers are append-only, no fake science/admission/publication',()=>{
 assert.equal(old.source_exact_original_raster_pixel_bbox_current,100);
 assert.equal(old.source_exact_original_raster_pixel_bbox_remaining,162);
 assert.equal(now.prior_original_pixel_bbox_verified,100);
 assert.equal(now.new_exact_original_pixel_bbox_verified,27);
 assert.equal(now.current_original_pixel_bbox_verified,127);
 assert.equal(now.remaining_original_pixel_bbox_positions,135);
 assert.equal(now.source_section_answer_positions,262);
 assert.equal(now.source_papers.reduce((n,p)=>n+p.verified_source_raster_pixel_bbox,0),127);
 assert.equal(now.source_papers.reduce((n,p)=>n+p.remaining,0),135);
 assert.equal(now.source_papers.reduce((n,p)=>n+p.source_positions,0),262);
 const neian=now.source_papers.find(p=>p.source_id==='SCI_G04_S1_113_MID_006');
 const heshun=now.source_papers.find(p=>p.source_id==='SCI_G04_S1_113_MID_002');
 assert.equal(neian.verified_source_raster_pixel_bbox,62);
 assert.equal(neian.remaining,0);
 assert.equal(heshun.verified_source_raster_pixel_bbox,50);
 assert.equal(heshun.remaining,0);
 assert.equal(now.formal_status.ADMISSION_READY_new_this_batch,0);
 assert.equal(now.formal_status.PUBLISHED_new_this_batch,0);
 assert.equal(now.formal_status.PUBLISHED_113_so_far,152);
 assert.equal(now.formal_status.student_site_all_scope_slots,788);
 assert.equal(frozen.scan_pdf_section_response_positions,262);
});
