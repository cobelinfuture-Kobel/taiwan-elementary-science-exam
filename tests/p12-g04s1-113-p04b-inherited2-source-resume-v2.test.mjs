import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL('../data/review/' + name, import.meta.url), 'utf8'));
const cp = read('p12-g04s1-113-p04b-inherited2-itemized14-remaining15-source-resume-v2.json');
const master = read('p12-g04s1-113-all29-master-ledger-v1.json');
const prior = read('p12-g04s1-113-p04b-remaining17-45page-original-source-geometry-gap-v1.json');
const tz = read('p12-g04s1-113-taozijiao-mid012-100-child-original-pdf-geometry-v1.json');
const tzVector = read('p12-g04s1-113-taozijiao-mid012-14-original-vector-blank-bboxes-v1.json');
const cg = read('p12-g04s1-113-p04b-chenggong-mid53-native-vector-source-answer-ids-v1.json');

test('P04B v2 inherits old full source-ID identity without inventing 153 new approvals', () => {
  assert.equal(master.p04b_papers_with_fully_itemized_original_source_slot_ids, 12);
  assert.equal(master.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs, 639);
  assert.equal(prior.papers.length, 17);
  assert.equal(cp.active_source_ids_itemized_papers, 14);
  assert.equal(cp.active_source_ids_itemized_records, 792);
  assert.equal(cp.remaining_source_id_itemization_papers, 15);
  assert.equal(cp.original_existing_proofs_inherited.length, 2);
  assert.equal(cp.FORMAL_SCIENCE_KP_APPROVED_new, 0);
  assert.equal(cp.ADMISSION_READY_new, 0);
  assert.equal(cp.PUBLISHED_new, 0);
  assert.equal(cp.formally_closed_complete_papers, 0);
  assert.equal(cp.previous_published_113_source_positions_unchanged, 178);
  assert.equal(cp.working_section_response_regions_NONCERTIFIED, 1762);
  assert.equal(cp.active_source_ids_itemized_records + cp.remaining_working_section_response_regions_NONCERTIFIED, 1762);
  assert.equal(cp.remaining_original_pdf_pages, 41);
  assert.equal(cp.original_scan_only_papers_still_pending, 5);
});

test('P04B v2 100 桃子腳 identities reconcile 86 original glyphs + 14 original vector cells', () => {
  const inherited = cp.original_existing_proofs_inherited.find(x => x.paper_id.endsWith('MID_012'));
  assert.ok(inherited);
  assert.equal(tz.original_source_pdf_sha256, inherited.original_pdf_sha256);
  assert.equal(tz.records.length, 100);
  assert.equal(new Set(tz.records.map(x=>x.source_slot_id)).size, 100);
  assert.equal(tz.records.filter(x=>Array.isArray(x.original_page_bbox_pts_top_left)).length, 86);
  assert.equal(tzVector.records.length, 14);
  const vec = new Map(tzVector.records.map(x=>[x.source_slot_id,x]));
  assert.equal(vec.size, 14);
  for (const a of tz.records) {
    assert.ok(a.source_slot_id.startsWith(inherited.paper_id+'|'));
    assert.ok(a.original_page_pdf_1_based >= 1 && a.original_page_pdf_1_based <= 2);
    if (!Array.isArray(a.original_page_bbox_pts_top_left)) {
      const b = vec.get(a.source_slot_id);
      assert.ok(b, 'missing exact vector cell for '+a.source_slot_id);
      assert.ok(Array.isArray(b.original_pdf_vector_response_cell_bbox_pts_top_left));
    }
    assert.equal(a.formal_science_unique_answer_and_direct48kp_new,false);
  }
});

test('P04B v2 53 成功 identities reconcile native printed and vector answer marks', () => {
  const inherited = cp.original_existing_proofs_inherited.find(x => x.paper_id.endsWith('MID_018'));
  assert.ok(inherited);
  assert.equal(cg.original_pdf_sha256, inherited.original_pdf_sha256);
  assert.equal(cg.records.length, 53);
  assert.equal(new Set(cg.records.map(x=>x.source_slot_id)).size, 53);
  assert.equal(cg.records.filter(x=>x.geometry_provenance==='PDF_NATIVE_PRINTED_ANSWER_BRACKET').length,45);
  assert.equal(cg.records.filter(x=>x.geometry_provenance?.startsWith('ORIGINAL_PDF_VECTOR_')).length,8);
  for(const a of cg.records){
    assert.ok(a.source_slot_id.startsWith(inherited.paper_id+'|'));
    assert.ok(a.original_pdf_page>=1 && a.original_pdf_page<=2);
    assert.ok(Array.isArray(a.original_answer_region_bbox_pt));
    assert.equal(a.admission_ready,false);
  }
});

test('remaining15 are exactly historical17 minus inherited two, preserve original SHA, paper order and no certified final denominator', () => {
  const inherited = new Set(cp.original_existing_proofs_inherited.map(x=>x.paper_id));
  assert.deepEqual(cp.remaining_original_papers_in_original_registry_order.map(x=>x.paper_id),
    prior.papers.filter(x=>!inherited.has(x.original_paper_id)).map(x=>x.original_paper_id));
  assert.equal(cp.remaining_original_papers_in_original_registry_order.length,15);
  const masterById = new Map(master.paper_records.map(x=>[x.paper_id,x]));
  for (const p of cp.remaining_original_papers_in_original_registry_order) {
    assert.equal(p.original_pdf_sha256,masterById.get(p.paper_id).original_pdf_sha256);
    assert.equal(p.formal_source_gate_closed,false);
    assert.ok(p.working_section_response_regions_NONCERTIFIED>=0);
  }
  assert.equal(cp.remaining_original_papers_in_original_registry_order.reduce((n,x)=>n+x.original_pdf_pages,0),41);
  assert.equal(cp.remaining_original_papers_in_original_registry_order.reduce((n,x)=>n+x.working_section_response_regions_NONCERTIFIED,0),970);
  assert.equal(master.source_position_universe_certified,false);
  assert.equal(cp.original_full_source_parent_figures_rights_science_gate_complete,false);
});
