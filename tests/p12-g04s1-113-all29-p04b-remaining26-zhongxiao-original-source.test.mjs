import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('data/review');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const reg=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const mid=read('p12-g04s1-113-p04b-zhongxiao-mid50-source-markers-parent-figure-v1.json');
const rem=read('p12-g04s1-113-p04b-remaining26-66page-original-source-geometry-gap-v1.json');
const byOriginal=new Map(reg.original_source_records.map(x=>[x.source_id,x]));
const byMaster=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('P04B Zhongxiao MID exactly 50 original independently addressable subanswer source identities with 42 PDF native and 8 PDF vector rectangles',()=>{
 assert.equal(mid.paper_id,'SCI_G04_S1_113_MID_003');
 assert.equal(mid.original_pdf_sha256,byOriginal.get(mid.paper_id)?.original_pdf_sha256);
 assert.equal(mid.printed_original_response_slot_count,50);
 assert.equal(mid.records.length,50);
 assert.equal(new Set(mid.records.map(x=>x.source_slot_id)).size,50);
 const rows=mid.records;
 assert.equal(rows.filter(x=>x.geometry_provenance==='ORIGINAL_PDF_NATIVE_TEXT_ANSWER_BRACKET').length,42);
 assert.equal(rows.filter(x=>x.geometry_provenance==='ORIGINAL_PDF_VECTOR_DRAWN_ANSWER_RECT').length,8);
 assert.equal(Object.values(mid.section_source_slot_counts).reduce((n,c)=>n+c,0),50);
 for(const s of rows){
  assert.equal(s.original_pdf_sha256,mid.original_pdf_sha256);
  assert.ok([1,2].includes(s.original_pdf_page));
  const [a,b,c,d]=s.original_response_marker_bbox_pt;
  assert.ok([a,b,c,d].every(Number.isFinite)&&a>=0&&b>=0&&a<c&&b<d&&c<=841.92&&d<=1190.52);
  assert.equal(s.admission_ready,false);
  assert.equal(s.full_original_question_context_figure_and_rights_gate_accepted,false);
 }
 assert.equal(byMaster.get(mid.paper_id)?.p04b_source_unique_slot_identifiers_itemized,50);
 assert.equal(byMaster.get(mid.paper_id)?.inventory_certified,false);
 assert.equal(byMaster.get(mid.paper_id)?.paper_closed,false);
});
test('P04B remaining26 all original PDF SHA and pages are reconciled, but candidate outlines are not identities',()=>{
 assert.equal(rem.papers.length,26);
 assert.equal(new Set(rem.papers.map(x=>x.original_paper_id)).size,26);
 assert.equal(rem.source_original_pdfs_rechecked_binary_SHA256,26);
 assert.equal(rem.source_original_pdf_pages_rechecked,66);
 assert.equal(rem.original_section_working_response_regions_NONCERTIFIED,1619);
 assert.equal(rem.native_or_prior_visual_marker_candidate_count_NOT_CERTIFIED,1191);
 assert.equal(rem.additional_pdf_vector_rectangle_candidates_NOT_CONFIRMED,237);
 assert.equal(rem.original_scan_only_papers,5);
 assert.equal(rem.original_scan_pages_requiring_individual_marker_raster_qa,16);
 assert.equal(rem.papers.reduce((n,x)=>n+x.original_pdf_pages,0),66);
 assert.equal(rem.papers.reduce((n,x)=>n+x.native_or_previous_visual_bbox_candidate_count_NOT_CERTIFIED,0),1191);
 assert.equal(rem.papers.reduce((n,x)=>n+x.new_pdf_vector_rectangle_candidate_count_NOT_CERTIFIED,0),237);
 for(const x of rem.papers){
  assert.equal(x.source_pdf_sha256,byOriginal.get(x.original_paper_id)?.original_pdf_sha256);
  assert.equal(x.original_pdf_pages,byOriginal.get(x.original_paper_id)?.original_pdf_page_count);
  assert.equal(x.original_section_working_response_region_count_NOT_CERTIFIED,byMaster.get(x.original_paper_id)?.section_reconciled_positions);
  assert.equal(x.per_page.length,x.original_pdf_pages);
  assert.equal(x.exact_all_original_subanswer_ID_and_parent_Certified,false);
  assert.ok(x.per_page.every(y=>y.original_page_exact_subanswer_BBox_parent_certified===false));
 }
});
test('P04B 2+1 full original independent source-id lists do NOT grant all29 closure',()=>{
 assert.equal(master.p04b_papers_with_fully_itemized_original_source_slot_ids,4);
 assert.equal(master.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs,197);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.all29_complete,false);
 assert.equal(rem.formal_source_exact_accepted_new,0);
 assert.equal(rem.formal_admission_ready_new,0);
 assert.equal(rem.formal_published_new,0);
});
test('P04B negative: a rejected table rectangle is not allowed to be counted as source slot identity',()=>{
 const first=rem.papers.find(x=>x.new_pdf_vector_rectangle_candidate_count_NOT_CERTIFIED>0);
 assert.ok(first);
 assert.ok(first.per_page.some(x=>x.extra_PDF_vector_rectangles_NOT_ACCEPTED>0));
 assert.equal(first.exact_all_original_subanswer_ID_and_parent_Certified,false);
});
