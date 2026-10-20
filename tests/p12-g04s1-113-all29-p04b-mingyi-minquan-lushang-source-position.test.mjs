import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read=x=>JSON.parse(fs.readFileSync(path.join('data/review',x),'utf8'));
const base=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const todo=read('p12-g04s1-113-p04b-remaining19-51page-original-source-geometry-gap-v1.json');
const docs=[
 read('p12-g04s1-113-p04b-mingyi-mid50-original-answer-ids-native-checkbox-matching-anchor-v1.json'),
 read('p12-g04s1-113-p04b-minquan-mid74-native-source-marker-matching-parent-v1.json'),
 read('p12-g04s1-113-p04b-lushang-mid50-native-answer-and-matching-bbox-v1.json')
];
const byBase=new Map(base.original_source_records.map(q=>[q.source_id,q]));
const byMaster=new Map(master.paper_records.map(q=>[q.paper_id,q]));
test('Original P04B three further school source response identity lists are SHA/Page/Count exact with 174 source positions',()=>{
 assert.deepEqual(docs.map(x=>x.records.length),[50,74,50]);
 assert.equal(docs.flatMap(x=>x.records).length,174);
 const global=new Set();
 for(const d of docs){
   const orig=byBase.get(d.paper_id),row=byMaster.get(d.paper_id);
   assert.ok(orig && row);
   assert.equal(orig.original_pdf_sha256,d.source_pdf_sha256||d.original_pdf_sha256);
   assert.equal(row.original_pdf_sha256,d.source_pdf_sha256||d.original_pdf_sha256);
   assert.equal(row.section_reconciled_positions,d.records.length);
   assert.equal(row.p04b_source_unique_slot_identifiers_itemized,d.records.length);
   assert.equal(row.inventory_certified,false);
   assert.equal(row.paper_closed,false);
   for(const x of d.records){
     assert.ok(!global.has(x.source_slot_id),'no duplicate original source ID');
     global.add(x.source_slot_id);
     assert.equal(x.source_pdf_sha256||x.original_pdf_sha256,d.source_pdf_sha256||d.original_pdf_sha256);
     assert.ok(x.original_pdf_page>=1&&x.original_pdf_page<=orig.original_pdf_page_count);
     const box=x.original_source_anchor_bbox_pt||x.original_printed_marker_bbox_pt||x.original_source_marker_bbox_pt;
     assert.equal(box?.length,4);
     const [a,b,c,e]=box;
     const size=x.original_pdf_page_size_pt;
     assert.ok(box.every(Number.isFinite));
     assert.ok(a>=0 && b>=0 && a<c && b<e && c<=size[0] && e<=size[1]);
     assert.equal(x.admission_ready,false);
   }
 }
 assert.equal(global.size,174);
});
test('Printed choice boxes differ from matching-source endpoints; keep original parent figure/source-rights holds',()=>{
 const [m,q,l]=docs;
 assert.equal(m.original_native_PDF_answer_bracket_geometry,24);
 assert.equal(m.original_native_PDF_square_checkbox_geometry,6);
 assert.equal(m.original_matching_source_label_anchors_not_full_response_bbox,20);
 assert.equal(m.records.filter(x=>x.original_answer_location_exact_bbox_accepted).length,30);
 assert.equal(q.native_PDF_printed_answer_bracket_locations,64);
 assert.equal(q.original_matching_source_label_anchor_not_answer_line_bbox_count,10);
 assert.equal(q.records.filter(x=>x.source_answer_area_exact_geometry_accepted).length,64);
 assert.equal(l.native_printed_answer_marker_bboxes,47);
 assert.equal(l.original_matching_label_anchors_not_complete_answer_paths,3);
 assert.equal(l.records.filter(x=>x.source_answer_marker_geometry_verified).length,47);
 assert.equal(q.original_source_printer_repeated_subnumber.includes('(2)'),true);
 for(const d of docs){
  assert.equal(d.admission_ready_new??0,0);
  assert.equal(d.published_new??0,0);
 }
});
test('ALL29 P04B 10/29 complete semantic source-ID lists do not close formal original figure/rights/answer Gate',()=>{
 assert.equal(master.paper_records.length,29);
 assert.equal(master.p04b_papers_with_fully_itemized_original_source_slot_ids,10);
 assert.equal(master.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs,535);
 assert.equal(todo.papers.length,19);
 assert.equal(todo.source_original_pdf_pages_rechecked,51);
 assert.equal(todo.original_section_working_response_regions_NONCERTIFIED,1227);
 assert.equal(todo.original_scan_only_papers,5);
 assert.equal(todo.original_scan_pages_requiring_individual_marker_raster_qa,16);
 assert.equal(535+1227,master.section_positions_reconciled_noncertified_sum);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
});
test('ALL29 fail-close: replacing a native BBox with a matching start label cannot certify drawn answer line',()=>{
 for(const d of docs){
  const matching=d.records.filter(x=>x.geometry_provenance?.includes('MATCHING'));
  assert.ok(matching.length>0);
  assert.ok(matching.every(x=>x.admission_ready===false));
 }
});
