import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const d=read('p12-g04s1-113-p04b-dongguang-mid63-semantic-source-ids-35bbox-28hold-v1.json');
const inherited=read('p12-g04s1-113-p04b-dongguang-mid-final-64-native-answer-marker-bbox-v1.json');
const m=read('p12-g04s1-113-all29-master-ledger-v1.json');
const v3=read('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');

test('Dongguang 113 original MID63 source-only semantic IDs preserve physical 35 and 28 geometry gaps',()=>{
 const paper=m.paper_records.find(x=>x.paper_id===d.original_paper_id);
 assert.ok(paper);
 assert.equal(paper.original_pdf_sha256,d.original_pdf_sha256);
 assert.equal(paper.section_reconciled_positions,63);
 assert.equal(d.original_semantic_source_response_ids_itemized_provisional,63);
 assert.equal(d.actual_original_native_pdf_answer_marker_bboxes_inherited,35);
 assert.equal(d.original_text_semantic_regions_without_independent_BBox_HOLD,28);
 assert.deepEqual(d.original_sections_semantic_response_breakdown,{S01:15,S02:20,S03:16,S04:4,S05:8});
 assert.equal(d.records.length,63);
 assert.equal(new Set(d.records.map(x=>x.source_slot_id_provisional)).size,63);
 const exact=d.records.filter(x=>Array.isArray(x.original_native_answer_bbox_pdf_pt));
 const missing=d.records.filter(x=>x.original_native_answer_bbox_pdf_pt===null);
 assert.equal(exact.length,35);
 assert.equal(missing.length,28);
 const old=inherited.records.filter(x=>x.source_slot_id.startsWith(d.original_paper_id+'|'));
 assert.equal(old.length,35);
 for(const x of exact){
  const y=old.find(y=>y.source_slot_id===x.source_slot_id_provisional);
  assert.ok(y);
  assert.deepEqual(x.original_native_answer_bbox_pdf_pt,y.original_answer_marker_native_pdf_bbox_pt);
  assert.equal(x.original_pdf_page,y.original_pdf_page);
 }
 for(const x of missing){
  assert.equal(x.original_pdf_page,null);
  assert.equal(x.original_source_geometry_proof,'PENDING_ORIGINAL_PDF_PER_GLYPH_OR_RASTER_REGION');
  assert.ok(x.original_shared_parent);
 }
 assert.equal(d.old_113_published_source_positions_preserved,paper.published_count);
 assert.equal(d.source_exact_full_bbox_parent_gate_accepted,false);
 assert.equal(d.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(d.ADMISSION_READY_new,0);
 assert.equal(d.PUBLISHED_new,0);
 assert.equal(v3.source_itemized_original_papers_current,17, 'partial Dongguang MUST NOT promote certified 17/29');
});
