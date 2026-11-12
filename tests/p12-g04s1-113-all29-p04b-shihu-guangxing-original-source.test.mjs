import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read=n=>JSON.parse(fs.readFileSync(path.join('data/review',n),'utf8'));
const reg=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const remaining=read('p12-g04s1-113-p04b-remaining17-45page-original-source-geometry-gap-v1.json');
const sources=[
  read('p12-g04s1-113-p04b-shihu-mid50-native-original-source-bbox-v1.json'),
  read('p12-g04s1-113-p04b-guangxing-mid54-original-native-plus-vector-answer-frames-v1.json'),
];
const frozen=new Map(reg.original_source_records.map(x=>[x.source_id,x]));
const live=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('P04B Shihu50 + Guangxing54 are 104 original semantic source-response identities with real original page geometry SHA',()=>{
 assert.deepEqual(sources.map(x=>x.records.length),[50,54]);
 const seen=new Set();
 for(const source of sources){
  const id=source.paper_id,orig=frozen.get(id),m=live.get(id);
  assert.ok(orig && m,'original registered');
  assert.equal(source.original_pdf_sha256||source.source_pdf_sha256,orig.original_pdf_sha256);
  assert.equal(source.original_pdf_pages,orig.original_pdf_page_count);
  assert.equal(source.records.length,m.section_reconciled_positions);
  assert.equal(source.records.length,m.p04b_source_unique_slot_identifiers_itemized);
  assert.equal(m.inventory_certified,false);
  assert.equal(m.paper_closed,false);
  assert.equal(m.exact_total_slots,null);
  for(const x of source.records){
   assert.equal(x.original_pdf_sha256||x.source_pdf_sha256,orig.original_pdf_sha256);
   assert.ok(!seen.has(x.source_slot_id),'unique original source ID across original school papers');
   seen.add(x.source_slot_id);
   assert.ok(x.original_pdf_page>=1&&x.original_pdf_page<=orig.original_pdf_page_count);
   const bb=x.original_source_marker_bbox_pt||x.original_answer_marker_or_frame_bbox_pt;
   assert.equal(bb?.length,4);
   const [a,b,c,d]=bb;
   assert.ok(bb.every(Number.isFinite)&&a>=0&&a<c&&c<=595.32&&b>=0&&b<d&&d<=841.92);
   assert.equal(x.admission_ready,false);
  }
 }
 assert.equal(seen.size,104);
});
test('P04B Shihu 47 actual brackets + 3 genuine matching-start dots require shared parent rights, not drawn student answer lines',()=>{
 const q=sources[0];
 assert.equal(q.complete_original_semantic_source_response_ids,50);
 assert.equal(q.native_original_pdf_bracket_response_bbox_count,47);
 assert.equal(q.original_matching_start_dot_bbox_not_student_line,3);
 assert.equal(q.records.filter(x=>x.source_geometry_provenance==='PDF_NATIVE_MATCHING_SOURCE_DOT_ONLY').length,3);
 assert.equal(Object.values(q.section_counts).reduce((a,b)=>a+b,0),50);
 assert.equal(q.external_original_source_article_and_image_rights_pending,true);
 assert.equal(q.full_exam_source_exact_rights_and_science_gate_accepted,false);
});
test('P04B Guangxing true PDF vector rectangles 3 freehand answers must not be lost because no printed parentheses',()=>{
 const q=sources[1];
 assert.equal(q.original_semantic_response_ids_itemized,54);
 assert.equal(q.original_PDF_native_text_response_bboxes,51);
 assert.equal(q.original_PDF_vector_printed_essay_draw_response_frames,3);
 const x=q.records.filter(v=>v.source_pdf_geometry==='PDF_VECTOR_EXACT_PRINTED_RESPONSE_RECTANGLE');
 assert.equal(x.length,3);
 assert.deepEqual(x.map(v=>v.original_answer_marker_or_frame_bbox_pt),[
  [316.13,118.34,570.58,173.42],
  [316.13,209.42,572.62,282.41],
  [316.13,318.41,572.62,373.37],
 ]);
 assert.equal(Object.values(q.original_section_counts).reduce((a,b)=>a+b,0),54);
 assert.equal(q.third_party_whale_article_and_photo_rights,'HOLD_OR_RECONSTRUCT_WITH_APPROVED_SOURCE');
 assert.equal(q.full_paper_formal_closeout,false);
});
test('P04B original 29-paper source working arithmetic is not the formal paper-source closeout',()=>{
 assert.equal(master.paper_records.length,29);
 assert.equal(master.p04b_papers_with_fully_itemized_original_source_slot_ids,12);
 assert.equal(master.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs,639);
 assert.equal(remaining.papers.length,17);
 assert.equal(remaining.source_original_pdf_pages_rechecked,45);
 assert.equal(remaining.original_section_working_response_regions_NONCERTIFIED,1123);
 assert.equal(remaining.original_scan_only_papers,5);
 assert.equal(remaining.original_scan_pages_requiring_individual_marker_raster_qa,16);
 assert.equal(639+1123,master.section_positions_reconciled_noncertified_sum);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
 assert.equal(remaining.formal_admission_ready_new,0);
 assert.equal(remaining.formal_published_new,0);
});
