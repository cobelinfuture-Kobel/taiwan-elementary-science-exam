import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = n => JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const x=read('p12-g04s1-113-p04b-remaining12-native265-scan94-dedup359-source-coverage-v1.json');
const older=read('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const published=read('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');

test('original remaining12 marker evidence dedup conserves 265 native and 94 scanned without admitting',()=>{
 assert.equal(x.original_registered_papers_remaining_12,12);
 assert.equal(x.old_full_source_itemized_papers_remains,17);
 assert.equal(x.old_full_source_itemized_original_response_ids_remains,954);
 assert.equal(x.source_only_physical_marker_ids_total_in_remaining12,359);
 assert.equal(x.original_native_pdf_marker_ids_exact,265);
 assert.equal(x.scanned_pdf_ink_marker_or_start_dot_ids_exact,94);
 assert.equal(x.original_independent_answer_marker_boxes_source_only,353);
 assert.equal(x.original_matching_source_dot_not_full_response_boxes,6);
 assert.equal(x.duplicate_provenance_rows_collapsed_into_359_ids,109);
 assert.equal(x.same_ID_bbox_proof_conflicts_gt_0_21_pdf_pt,0);
 assert.equal(x.original_4_neihu_final_APPROX_raster_region_NOT_ADDED,4);
 assert.equal(x.original_figure_parent_roi_six_NOT_ADDED_TO_INDEPENDENT_ANSWER_BBOX,6);
 assert.equal(x.separately_existing_4_dongguang_final_page2_bbox_only_NOT_ADDED,4);
 assert.equal(x.site_original113_previously_published_positions_unchanged,published.current_113_source_slots_published);
 assert.equal(x.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(x.ADMISSION_READY_new,0);
 assert.equal(x.PUBLISHED_new,0);
 assert.equal(x.remaining_papers_with_all_full_parent_source_science_rights_complete,0);
 assert.equal(x.no_merge_no_publication,true);
 assert.equal(x.source_only_marker_records.length,359);
 assert.equal(x.paper_summary.length,12);
 assert.deepEqual(x.paper_summary.map(p=>p.paper_id),older.remaining_paper_ids);
});
test('every original exact marker has physical positive BBox, original SHA/1-based page and no duplicate source identity',()=>{
 const refs=new Set(),papers=new Map(master.paper_records.map(p=>[p.paper_id,p])),counts=new Map();
 for(const s of x.source_only_marker_records){
  assert.ok(!refs.has(s.id),'reused source ID '+s.id);
  refs.add(s.id);
  const p=papers.get(s.paper_id);
  assert.ok(p);
  assert.equal(s.original_pdf_sha256,p.original_pdf_sha256);
  assert.ok(s.source_evidences.length>0);
  counts.set(s.paper_id,(counts.get(s.paper_id)||0)+1);
  const fst=s.source_evidences[0];
  for(const t of s.source_evidences){
   assert.ok(Number.isInteger(t.original_pdf_page_1_based)&&t.original_pdf_page_1_based>=1&&t.original_pdf_page_1_based<=p.original_pdf_pages);
   const b=t.actual_source_marker_bbox_pdf_points_top_left;
   assert.ok(Array.isArray(b)&&b.length===4&&b.every(Number.isFinite));
   assert.ok(b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]);
   assert.equal(t.original_pdf_page_1_based,fst.original_pdf_page_1_based);
   assert.ok(Math.max(...b.map((v,i)=>Math.abs(v-fst.actual_source_marker_bbox_pdf_points_top_left[i])))<=0.21);
   assert.ok(t.provenance_ref.startsWith('data/review/p12-g04s1-113-'));
  }
  assert.ok(['INDEPENDENT_PRINTED_ANSWER_MARKER','MATCHING_SOURCE_DOT_TARGET_NOT_ACCEPTED'].includes(s.source_ink_anchor_role));
 }
 assert.equal(refs.size,359);
 for(const p of x.paper_summary){
  assert.equal(p.original_pdf_sha256,papers.get(p.paper_id).original_pdf_sha256);
  assert.equal(p.unique_original_physical_marker_IDs_recovered_exact_source_geometry,counts.get(p.paper_id)||0);
  assert.equal(p.original_answer_and_parent_gate_closed,false);
  assert.equal(p.original_public_published_source_count_unchanged,papers.get(p.paper_id).published_count);
 }
 assert.equal(x.paper_summary.reduce((n,p)=>n+p.repeated_proof_rows_reconciled,0),109);
 assert.equal(x.paper_summary.reduce((n,p)=>n+p.matching_source_dots_partial_not_independent_answer_bboxes,0),6);
});
test('packed rawdict source BBox evidence preserved, and scanned matching start dots not approved as full answers',()=>{
 const sha=new Map(master.paper_records.map(x=>[x.paper_id,x.original_pdf_sha256]));
 const compact=read('p12-g04s1-113-native5-originalpdf107-glyph-bbox-proof-v1.json');
 const records=new Map(x.source_only_marker_records.map(y=>[y.id,y]));
 let checked=0;
 for(const g of compact.groups){
  const ids=g.encoded_geometry.split(';');
  assert.equal(ids.length,g.count);
  for(let i=0;i<ids.length;i++){
   const normId=g.source_id+'|S'+Number(g.section.slice(1))+'|'+g.type+'|'+(i+1);
   const src=records.get(normId);
   if(!src)continue;
   const box=ids[i].split('.').map(z=>parseInt(z,36)/100);
   assert.equal(src.original_pdf_sha256,sha.get(g.source_id));
   assert.ok(src.source_evidences.some(v=>v.source_type==='RAWDICT_PDF_NATIVE_COMPRESSED'&&v.actual_source_marker_bbox_pdf_points_top_left.every((n,i)=>Math.abs(n-box[i])<0.001)));
   checked++;
  }
 }
 assert.ok(checked>70);
 const dots=x.source_only_marker_records.filter(x=>x.source_ink_anchor_role==='MATCHING_SOURCE_DOT_TARGET_NOT_ACCEPTED');
 assert.equal(dots.length,6);
 assert.ok(dots.every(x=>x.paper_id==='SCI_G04_S1_113_FINAL_009'));
 assert.ok(!x.source_only_marker_records.some(x=>x.source_ink_anchor_role==='ORIGINAL_PARENT_FIGURE_ROI'));
});
