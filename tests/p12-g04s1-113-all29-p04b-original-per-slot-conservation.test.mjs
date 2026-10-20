import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const rd=x=>JSON.parse(fs.readFileSync(path.join('data/review',x),'utf8'));
const reg=rd('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const m=rd('p12-g04s1-113-all29-master-ledger-v1.json');
const g=rd('p12-g04s1-113-p04b-all29-all72pages-original-source-slot-conservation-gap-audit-v1.json');
const audit=[
 rd('p12-g04s1-113-p04b-wende-mid55-exact-source-subanswers-and-geometry-v1.json'),
 rd('p12-g04s1-113-p04b-dahua-final38-source-slots-native-marker-matching-anchors-v1.json')
];
const registry=new Map(reg.original_source_records.map(z=>[z.source_id,z]));
const master=new Map(m.paper_records.map(z=>[z.paper_id,z]));
test('P04B all72 original pages have defensible source marker candidate and scan raster diagnostics; not Admission',()=>{
 assert.equal(g.original_paper_count,29);
 assert.equal(g.original_page_count,72);
 assert.equal(g.papers.length,29);
 assert.equal(g.original_scan_only_pages_with_fullpage_raster_placement_verified,16);
 assert.equal(g.working_section_response_regions_NOT_CERTIFIED,1762);
 assert.equal(g.native_marker_candidates_total_NOT_CERTIFIED,1320);
 assert.equal(g.preexisting_individually_located_partial_source_marker_records,188);
 assert.equal(g.complete_exact_fullpaper_source_slot_gate_new,0);
 assert.equal(g.source_exact_new,0);
 assert.equal(g.admission_ready_new,0);
 assert.equal(g.published_new,0);
 for(const p of g.papers){
  assert.equal(p.original_pdf_sha256,registry.get(p.paper_id)?.original_pdf_sha256);
  assert.equal(p.original_pages,registry.get(p.paper_id)?.original_pdf_page_count);
  assert.equal(p.page_candidate_breakdown.length,p.original_pages);
  assert.equal(p.page_candidate_breakdown.reduce((n,x)=>n+x.source_geometry_candidates_total,0),p.raw_text_marker_candidates);
  assert.equal(p.original_section_parent_all_slots_confirmed,false);
  assert.equal(p.formal_exact_all_position_geometry_accepted,false);
  assert.equal(p.formal_paper_closed,false);
 }
 assert.equal(g.full_page_scan_image_provenance.length,16);
 assert.equal(g.full_page_scan_image_provenance.filter(x=>x.individual_answer_marker_geometry_certified).length,0);
 assert.equal(g.papers.find(p=>p.paper_id.endsWith('FINAL_008')).page_candidate_breakdown[2].original_page_role,
  'THIRD_PARTY_READING_APPENDIX_CONTEXT_ONLY_NO_ANSWER_MARKER_DETECTED');
});
test('P04B first actual two school source inventories preserve exact 55 and 38 canonical source ids, source SHA, geometry origin',()=>{
 assert.equal(audit[0].itemized_individual_source_slot_ids,55);
 assert.equal(audit[1].itemized_original_subanswer_id_count,38);
 const unique=new Set();let n=0;
 for(const d of audit){
  const orig=registry.get(d.paper_id),root=master.get(d.paper_id);
  assert.equal(d.source_pdf_sha256||d.original_pdf_sha256,orig.original_pdf_sha256);
  assert.equal(root.section_reconciled_positions,d.records.length);
  assert.equal(root.p04b_source_unique_slot_identifiers_itemized,d.records.length);
  assert.equal(root.inventory_certified,false);
  assert.equal(root.paper_closed,false);
  assert.equal(root.exact_total_slots,null);
  for(const z of d.records){
   assert.equal(z.original_pdf_sha256,orig.original_pdf_sha256);
   assert.ok(z.source_slot_id.startsWith(d.paper_id+'|'));
   assert.ok(!unique.has(z.source_slot_id),'no duplicate source ID');
   unique.add(z.source_slot_id);
   const bbox=z.answer_location_bbox_pt||z.answer_marker_or_anchor_bbox_pt;
   assert.ok(Array.isArray(bbox)&&bbox.length===4);
   assert.ok(bbox.every(Number.isFinite));
   assert.ok(bbox[0]>=0&&bbox[1]>=0&&bbox[0]<bbox[2]&&bbox[1]<bbox[3]);
   assert.ok(z.original_pdf_page>=1&&z.original_pdf_page<=orig.original_pdf_page_count||z.page>=1&&z.page<=orig.original_pdf_page_count);
   assert.equal(z.admission_ready,false);
   n++;
  }
 }
 assert.equal(n,93);
 assert.equal(unique.size,93);
 assert.equal(m.p04b_papers_with_fully_itemized_original_source_slot_ids,2);
 assert.equal(m.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs,93);
 assert.equal(m.p04b_formal_new_completed_original_papers,0);
});
test('P04B Wende: 3 false positives excluded and 3 missed nonbracket replies restored, including drawings',()=>{
 const w=audit[0];
 assert.equal(w.original_section_working_position_count,55);
 assert.deepEqual(w.source_section_breakdown.map(x=>x.original_answer_positions),[15,12,28]);
 assert.equal(w.non_answers_excluded_from_native_raw_28_candidate_brackets.length,3);
 assert.equal(w.original_answer_slots_missing_from_raw_candidate_geometry_reinstated.length,3);
 assert.equal(w.original_native_text_answer_marker_bboxes,52);
 assert.equal(w.original_vector_answer_writing_line_bbox,1);
 assert.equal(w.original_figure_parent_placement_bboxes_NOT_EXACT_ANSWER_CROP,2);
 assert.equal(w.source_independent_full_exact_answer_area_geometry_certified,false);
 assert.equal(w.records.filter(x=>x.geometry_provenance==='ORIGINAL_PDF_EMBEDDED_FIGURE_PARENT_BBOX_ONLY').length,2);
});
test('P04B Dahua: matching dots are not drawn answers, reading passage retains full parent gate',()=>{
 const d=audit[1];
 assert.deepEqual(d.section_original_positions,[24,7,7]);
 assert.equal(d.source_native_answer_bracket_bboxes,31);
 assert.equal(d.original_native_matching_dots_for_seven_responses,7);
 assert.equal(d.original_matching_destinations_and_student_drawn_lines_pending,7);
 assert.equal(d.source_paper_full_individual_location_exact_gate_pass,false);
 assert.equal(d.full_reading_source_parent_and_rights_pending,true);
 assert.equal(d.records.filter(x=>x.geometry_provenance==='ORIGINAL_NATIVE_PDF_MATCHING_START_DOT_ANCHOR').length,7);
});
test('P04B conservation locks 29 original paper scope while proof of 2 per-paper lists does not claim 29 closes',()=>{
 assert.equal(m.paper_records.length,29);
 assert.equal(m.section_positions_reconciled_noncertified_sum,1762);
 assert.equal(m.source_position_universe_certified,false);
 assert.equal(m.all29_complete,false);
 assert.equal(m.formally_closed_papers,0);
 assert.equal(m.p04b_all29_source_itemization_complete,false);
});
