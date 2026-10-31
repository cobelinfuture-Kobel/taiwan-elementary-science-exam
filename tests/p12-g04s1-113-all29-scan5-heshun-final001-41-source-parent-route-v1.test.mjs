import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const review=read('data/review/p12-g04s1-113-all29-scan5-heshun-final001-41-visual-parent-source-routing-v1.json');
const baseline=read('data/review/p12-g04s1-113-all29-known-atomic-disjoint-source-ledger-v8.json');
const paper='SCI_G04_S1_113_FINAL_001';
const baseRows=baseline.known_atomic_source_dispositions.filter(x=>x.paper_id===paper);
const expectedPublic=new Set(baseRows.filter(x=>x.disposition==='PUBLISHED').map(x=>x.source_slot_id));
const expectedUnreviewed=new Set(baseRows.filter(x=>x.disposition==='UNREVIEWED').map(x=>x.source_slot_id));

test('Heshun final original 50 position inheritance has 9 frozen published and 41 exclusive semantic-parent review records',()=>{
 assert.equal(review.original_total_proof_glyph_positions,50);
 assert.equal(baseRows.length,50);
 assert.equal(expectedPublic.size,9);
 assert.equal(expectedUnreviewed.size,41);
 assert.equal(review.rows.length,41);
 assert.equal(review.new_position_source_parent_visual_review_count,41);
 assert.deepEqual(new Set(review.existing_main_published_suppressed),expectedPublic);
 assert.deepEqual(new Set(review.rows.map(x=>x.source_slot_id)),expectedUnreviewed);
 assert.equal(review.source_parent_coverage_exact_41,true);
 const groupCounts=Object.fromEntries(Object.entries(review.parent_counts).map(([k,v])=>[k,review.rows.filter(x=>x.source_parent_id===k).length]));
 assert.deepEqual(groupCounts,review.parent_counts);
 assert.equal(review.first_page_unpublished_independent_TF_MC_visual_reviewed_count,14);
 assert.equal(review.first_page_and_second_page_parent_dependent_visual_reviewed_count,27);
 assert.equal(new Set(review.rows.map(x=>x.source_slot_id)).size,41);
});

test('native original source ink positions are exact PDF-point boxes, inherited source paper and no fake teacher key',()=>{
 assert.match(review.original_pdf_sha256,/^[a-f0-9]{64}$/);
 assert.equal(review.original_pdf_sha256,'3fc18d09fe6a9b4b43cdd28b17497d5a21b4962c24f859965ca8f22945ed932e');
 for(const r of review.rows){
  assert.ok(r.source_slot_id.startsWith(paper+'|'));
  assert.equal(r.disposition_unchanged,'UNREVIEWED');
  assert.ok([1,2].includes(r.original_pdf_page_1based));
  assert.deepEqual([r.original_source_original_coordinates].filter(Boolean),[]);
  assert.ok([5,7].includes(r.source_original_raw_embedded_jpeg_xref));
  assert.equal(r.source_original_raw_embedded_jpeg_xref,r.original_pdf_page_1based===1?5:7);
  const b=r.original_exact_answer_glyph_bbox_pdf_points_top_left;
  assert.equal(b.length,4);
  assert.ok(b.every(v=>Number.isFinite(v)));
  assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=728&&b[3]<=1031);
  assert.ok(b[0]<b[2]&&b[1]<b[3]);
  assert.equal(r.source_visual_scope,'ORIGINAL_PDF_PIXEL_AND_PARENT_CONTEXT_REVIEWED');
  assert.equal(r.original_stem_options_full_public_republication,false);
  assert.equal(r.exact_verbatim_full_question_and_options_gate_passed,false);
  assert.equal(r.pretrained_science_kp_gate_status,'PRELIMINARY_ROUTING_NOT_FORMAL');
  assert.equal(r.rights_per_item_and_thirdparty_figure_accepted,false);
  assert.equal(r.operator_eligible,false);
  assert.equal(r.formal_science_kp_approved_new,false);
  assert.equal(r.admission_ready_new,false);
  assert.equal(r.published_new,false);
  if(r.answer_mode==='IMAGE_CHECKBOX')assert.equal(r.parent_dependency,'FOUR_ORIGINAL_CIRCUIT_DIAGRAMS');
 }
});

test('cross-paper original source means full 29-paper and rights Admission remain open; SCIENCE/KP scope cannot be inflated',()=>{
 assert.equal(review.new_formal_science_kp_approved,0);
 assert.equal(review.new_admission_ready,0);
 assert.equal(review.new_published,0);
 assert.equal(review.formal_source_exact_accepted_new,0);
 assert.equal(review.original_333_published_unchanged,true);
 assert.equal(review.frozen48_unchanged,true);
 assert.equal(review.source_ledger_dispositions_unchanged,true);
 assert.deepEqual(baseline.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
 const amber=review.rows.filter(x=>x.frozen48_kp_routing_diagnostic==='SCIENCE_UNIQUE_AMBIGUITY');
 assert.equal(amber.length,1);
 assert.ok(amber[0].source_slot_id.endsWith('|S02|MC|008'));
 const recycle=review.rows.filter(x=>x.frozen48_kp_routing_diagnostic==='POSSIBLE_DIRECT_KP_04_11_CONTEXT_SPECIFIC');
 assert.equal(recycle.length,5);
 assert.ok(recycle.every(x=>x.source_parent_id.endsWith('|RECYCLE_BATTERY_LOCATIONS')));
});
