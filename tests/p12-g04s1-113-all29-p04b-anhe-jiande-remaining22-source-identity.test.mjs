import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read=f=>JSON.parse(fs.readFileSync(path.resolve('data/review',f),'utf8'));
const original=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const m=read('p12-g04s1-113-all29-master-ledger-v1.json');
const rem=read('p12-g04s1-113-p04b-remaining22-58page-original-source-geometry-gap-v1.json');
const papers=[
  read('p12-g04s1-113-p04b-anhe-final50-original-source-slot-ids-native-bbox-v1.json'),
  read('p12-g04s1-113-p04b-anhe-mid50-original-source-slot-ids-native-pdf-bbox-v1.json'),
  read('p12-g04s1-113-p04b-jiande-mid64-original-source-answer-ids-bbox-v1.json')
];
const baseline=new Map(original.original_source_records.map(x=>[x.source_id,x]));
const master=new Map(m.paper_records.map(x=>[x.paper_id,x]));
test('ALL29 P04B 3 more original semantic paper inventories conserve true source responses as 50+50+64=164',()=>{
 assert.deepEqual(papers.map(x=>x.paper_id),[
  'SCI_G04_S1_113_FINAL_006','SCI_G04_S1_113_MID_009','SCI_G04_S1_113_MID_011'
 ]);
 assert.deepEqual(papers.map(x=>x.records.length),[50,50,64]);
 assert.equal(papers.flatMap(x=>x.records).length,164);
 const ids=new Set();
 for(const item of papers){
  const originalRow=baseline.get(item.paper_id), row=master.get(item.paper_id);
  assert.ok(originalRow&&row);
  assert.equal(item.original_pdf_sha256,originalRow.original_pdf_sha256);
  assert.equal(item.original_pdf_pages??item.original_pages,originalRow.original_pdf_page_count);
  assert.equal(item.records.length,row.section_reconciled_positions);
  assert.equal(item.records.length,row.p04b_source_unique_slot_identifiers_itemized);
  assert.equal(row.inventory_certified,false);
  assert.equal(row.paper_closed,false);
  assert.equal(row.exact_total_slots,null);
  for(const x of item.records){
   assert.ok(!ids.has(x.source_slot_id),'must have original distinct source IDs');
   ids.add(x.source_slot_id);
   assert.equal(x.original_pdf_sha256,originalRow.original_pdf_sha256);
   assert.ok(x.original_pdf_page>=1&&x.original_pdf_page<=originalRow.original_pdf_page_count);
   const bbox=x.original_answer_marker_pdf_native_bbox_pt||
              x.original_response_marker_bbox_pt||
              x.original_answer_region_bbox_pt;
   assert.equal(bbox.length,4);
   const [x0,y0,x1,y1]=bbox;
   assert.ok(bbox.every(Number.isFinite) && x0>=0&&y0>=0&&x0<x1&&y0<y1 && x1<=728.52 && y1<=1031.76);
   assert.equal(x.admission_ready===false||x.admission_ready_new===false,true);
  }
 }
 assert.equal(ids.size,164);
});
test('ALL29 original Jiande 7 printed two-option circles must remain seven decisions, not fourteen responses',()=>{
 const d=papers[2];
 assert.equal(d.original_source_response_positions_itemized,64);
 assert.equal(d.original_section_answer_counts.CIRCLE_RESOURCE,3);
 assert.equal(d.original_section_answer_counts.CIRCLE_ENVIRONMENT,4);
 assert.equal(d.records.filter(x=>x.geometry_provenance==='ORIGINAL_PDF_NATIVE_CIRCLE_OPTION_PAIR_REGION').length,7);
 assert.equal(d.records.filter(x=>x.source_slot_id.includes('|S05|G01|')).length,6);
 assert.equal(d.records.filter(x=>x.source_slot_id.includes('|S05|G02|')).length,2);
 assert.ok(d.records.every(x=>x.published_identity_needs_lookup_in_existing_Published178_snapshot===true));
 assert.ok(d.records.every(x=>x.source_lineage_already_published_to_be_suppressed===undefined));
});
test('ALL29 source original Anhe final circuit shows printed check glyph ambiguity, NOT a teacher answer',()=>{
 const d=papers[0];
 assert.equal(d.source_original_answer_marker_native_pdf_boxes,50);
 assert.equal(d.original_pdf_preprinted_tick_like_glyphs_in_three_answer_fields,true);
 assert.equal(d.do_not_interpret_preprinted_tick_as_teacher_answer_key,true);
 assert.equal(d.records.filter(x=>x.source_slot_id.includes('|S03|G01|')).length,6);
 assert.equal(d.records.filter(x=>x.source_slot_id.includes('|S03|G02|')).length,8);
 assert.equal(d.records.filter(x=>x.source_slot_id.includes('|S03|G03|')).length,4);
 assert.equal(d.admission_ready_new,0);
 assert.equal(d.published_new,0);
});
test('ALL29 source original Anhe mid keeps 4 plant picture +4 fish labels + 3 quake action squares, no figure rights bypass',()=>{
 const d=papers[1];
 assert.equal(d.original_response_positions_itemized,50);
 assert.equal(d.source_sections.AQUATIC_PLANTS_FIGURE_FILL,4);
 assert.equal(d.source_sections.FISH_ANATOMY_FILL,4);
 assert.equal(d.source_sections.THREE_QUAKE_ACTION_ORDER,3);
 assert.equal(d.source_external_disaster_education_illustration_rights_pending,true);
 assert.equal(d.admission_ready_new,0);
 assert.equal(d.published_new,0);
});
test('ALL29 P04B verified scope shifts from 4/29 to 7/29 complete original response-ID lists, but formal 29 original source gates remain unclosed',()=>{
 assert.equal(m.paper_records.length,29);
 assert.equal(m.p04b_papers_with_fully_itemized_original_source_slot_ids,10);
 assert.equal(m.p04b_unique_original_source_slot_id_records_in_new_source_only_proofs,535);
 assert.equal(m.formally_closed_papers,0);
 assert.equal(m.all29_complete,false);
 assert.equal(m.source_position_universe_certified,false);
 assert.equal(rem.papers.length,22);
 assert.equal(rem.source_original_pdf_pages_rechecked,58);
 assert.equal(rem.original_section_working_response_regions_NONCERTIFIED,1401);
 assert.equal(rem.native_or_prior_visual_marker_candidate_count_NOT_CERTIFIED,970);
 assert.equal(rem.additional_pdf_vector_rectangle_candidates_NOT_CONFIRMED,176);
 assert.equal(rem.original_scan_only_papers,5);
 assert.equal(rem.original_scan_pages_requiring_individual_marker_raster_qa,16);
 assert.equal(rem.formal_admission_ready_new,0);
 assert.equal(rem.formal_published_new,0);
});
