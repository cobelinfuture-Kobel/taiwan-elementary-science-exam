import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const ROOT=path.resolve('data/review');
const read=(name)=>JSON.parse(fs.readFileSync(path.join(ROOT,name),'utf8'));
const f=read('p12-g04s1-113-p04b-all29-binary-sha-and-geometry-candidate-coverage-v1.json');
const master=read('p12-g04s1-113-all29-master-ledger-v1.json');
const original=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const index=new Map(original.original_source_records.map(x=>[x.source_id,x]));
const byPaper=new Map(master.paper_records.map(x=>[x.paper_id,x]));
test('ALL29: actually downloaded original SHA256 evidence is aligned to all 29 frozen source documents and 72 pages',()=>{
 assert.equal(f.papers.length,29);
 assert.equal(new Set(f.papers.map(x=>x.paper_id)).size,29);
 assert.equal(f.original_pdf_sha_verified,29);
 assert.equal(f.original_pdf_page_count,72);
 assert.equal(f.papers.reduce((x,p)=>x+p.original_pdf_page_count,0),72);
 for(const p of f.papers){
  const reg=index.get(p.paper_id),row=byPaper.get(p.paper_id);
  assert.ok(reg && row);
  assert.equal(p.source_pdf_sha256_verified_against_original_file,reg.original_pdf_sha256);
  assert.equal(p.original_pdf_page_count,reg.original_pdf_page_count);
  assert.equal(row.original_pdf_sha256,reg.original_pdf_sha256);
  assert.equal(row.p04b_actual_original_pdf_binary_sha256_verification,'PASS');
 }
});
test('ALL29: every paper has at least one geometry candidate without passing exact source slot/parent/figure gates',()=>{
 assert.equal(f.source_papers_with_any_first_answer_region_geometry_candidate,29);
 assert.equal(f.source_papers_with_native_text_marker_candidates,24);
 assert.equal(f.source_papers_scanned_image_approx_first_marker,5);
 assert.equal(f.papers.filter(x=>x.native_text_layer_pages===0).length,5);
 for(const p of f.papers){
  const bb=p.first_page_geometry_example_bbox_pt;
  assert.ok(bb?.length===4 && bb.every(Number.isFinite),'candidate bbox numerically valid');
  assert.ok(bb[0]>=0&&bb[1]>=0&&bb[0]<bb[2]&&bb[1]<bb[3]);
  const row=byPaper.get(p.paper_id);
  assert.equal(row.p04b_at_least_one_answer_marker_candidate,true);
  assert.equal(row.p04b_candidate_not_formal_full_answer_slot_bbox,true);
  assert.equal(row.inventory_certified,false);
  assert.equal(row.paper_closed,false);
  assert.equal(row.exact_total_slots,null);
  assert.equal(p.individual_answer_geometry_formal_accepted,false);
  assert.equal(p.unique_printed_source_slot_and_parent_verified,false);
 }
 assert.equal(master.p04b_first_answer_area_geometry_candidate_papers,29);
 assert.equal(master.formally_closed_papers,0);
 assert.equal(master.source_position_universe_certified,false);
 assert.equal(master.all29_complete,false);
});
test('ALL29: native numbered, unnumbered and vector square candidates remain independent counting units and NOT student questions',()=>{
 assert.equal(f.native_numbered_marker_candidates,553);
 assert.equal(f.native_unnumbered_bracket_candidates,729);
 assert.equal(f.native_square_glyph_candidates,38);
 assert.equal(f.papers.reduce((x,p)=>x+p.native_numbered_answer_parenthesis_candidates,0),553);
 assert.equal(f.papers.reduce((x,p)=>x+p.native_unnumbered_blank_candidates,0),729);
 assert.equal(f.papers.reduce((x,p)=>x+p.native_square_glyph_candidates,0),38);
 assert.equal(f.formal_original_source_slot_identity_parent_and_bbox_accepted_new,0);
 assert.equal(f.admission_ready_new,0);
 assert.equal(f.published_new,0);
});
test('ALL29: scanned source images cannot silently pass exact BBox or drawing rights gate',()=>{
 const scan=f.papers.filter(p=>p.native_text_layer_pages===0);
 assert.equal(scan.length,5);
 for(const s of scan){
  assert.ok(s.first_marker_type.startsWith('scan_'));
  assert.ok(byPaper.get(s.paper_id).p04b_is_scan_original_requiring_visual_full_slot_acceptance);
  assert.equal(s.individual_answer_geometry_formal_accepted,false);
 }
});
test('ALL29 negative: replacing one exact original by a forged SHA or dropping a PDF breaks coverage',()=>{
 const tampered=structuredClone(f.papers);
 tampered[0].source_pdf_sha256_verified_against_original_file='0'.repeat(64);
 assert.notEqual(tampered[0].source_pdf_sha256_verified_against_original_file,index.get(tampered[0].paper_id).original_pdf_sha256);
 const truncated=f.papers.slice(1);
 assert.notEqual(truncated.length,original.original_source_records.length);
 assert.notEqual(new Set(truncated.map(p=>p.paper_id)).size,29);
});
