import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const r=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const x=r('p12-g04s1-113-p04b-neihu-final71-source-identity-67exact-4approx-hold-v1.json');
const a=r('p12-g04s1-113-p04b-neihu-final61-native-answer-marker-bbox-v1.json');
const b=r('p12-g04s1-113-p04b-neihu-final10-image-vector-response-regions-v1.json');
const m=r('p12-g04s1-113-all29-master-ledger-v1.json');
const v=r('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');
test('Neihu original FINAL011 complete semantic 71 IDs, only 67 physical exact marker BBoxes and 4 raster approximate HOLD',()=>{
 const orig=m.paper_records.find(y=>y.paper_id===x.original_paper_id);
 assert.ok(orig);
 assert.equal(x.original_pdf_sha256,orig.original_pdf_sha256);
 assert.equal(a.source_pdf_sha256,x.original_pdf_sha256);
 assert.equal(b.source_pdf_sha256,x.original_pdf_sha256);
 assert.equal(x.original_semantic_response_slot_IDs_itemized,71);
 assert.equal(x.inherited_native_physical_BBox_count,61);
 assert.equal(x.inherited_pdf_vector_answer_rectangle_count,6);
 assert.equal(x.inherited_raster_image_approximate_render_answer_marker_count_HOLD,4);
 assert.equal(x.records.length,71);
 assert.equal(new Set(x.records.map(y=>y.source_slot_id)).size,71);
 assert.equal(x.records.filter(y=>y.position_type==='ORIGINAL_NATIVE_TEXT_ANSWER_GLYPH_EXACT').length,61);
 assert.equal(x.records.filter(y=>y.position_type==='ORIGINAL_PDF_VECTOR_ANSWER_RECT_EXACT').length,6);
 assert.equal(x.records.filter(y=>y.position_type==='ORIGINAL_RASTER_RENDER_MARKER_RECT_APPROX').length,4);
 for(const y of x.records){
  assert.ok(y.source_slot_id.startsWith(x.original_paper_id+'|'));
  assert.ok(y.original_pdf_page>=1&&y.original_pdf_page<=x.original_pdf_pages);
  if(y.position_type==='ORIGINAL_RASTER_RENDER_MARKER_RECT_APPROX'){
   assert.equal(y.original_response_bbox_pdf_pt,null);
   assert.ok(Array.isArray(y.original_page_render_bbox_px));
   assert.equal(y.source_partial_geometry_status,'HOLD_APPROX_RASTER_MARKER_NOT_NATIVE_PDF_BBOX');
  } else assert.ok(Array.isArray(y.original_response_bbox_pdf_pt)&&y.original_response_bbox_pdf_pt.length===4);
  assert.equal(y.admission_ready,false);
 }
 assert.equal(x.source_all_actual_pdf_answer_markers_exact,false);
 assert.equal(x.admission_ready_new,0);
 assert.equal(x.published_new,0);
 assert.ok(v.remaining_paper_ids.includes(x.original_paper_id),'Neihu must remain within 12 missing exact source geometry papers');
});
