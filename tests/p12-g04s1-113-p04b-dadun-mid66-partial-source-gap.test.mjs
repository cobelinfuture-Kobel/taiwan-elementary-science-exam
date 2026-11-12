import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL('../data/review/'+name,import.meta.url),'utf8'));
const a=read('p12-g04s1-113-p04b-dadun-mid66-partial-source-id-parent-geometry-gap-v1.json');
const old=read('p12-g04s1-113-p04b-dadun-mid29-native-answer-marker-bbox-v1.json');
const m=read('p12-g04s1-113-all29-master-ledger-v1.json');
const cp=read('p12-g04s1-113-p04b-inherited2-itemized14-remaining15-source-resume-v2.json');

test('113 DaDun 66 section working regions conserve 29 native original markers plus 37 noncertified region gaps',()=>{
 const paper=m.paper_records.find(x=>x.paper_id===a.original_paper_id);
 assert.ok(paper);
 assert.equal(paper.original_pdf_sha256,a.original_pdf_sha256);
 assert.equal(old.source_original_pdf_sha256,a.original_pdf_sha256);
 assert.equal(old.records.length,29);
 assert.equal(a.planned_remaining_original_working_region_records.length,37);
 assert.deepEqual(a.original_printed_section_breakdown_working,{S01:15,S02:14,S03:16,S04:17,S05:4});
 assert.equal(Object.values(a.original_printed_section_breakdown_working).reduce((n,x)=>n+x,0),66);
 assert.equal(a.working_section_responses_TOTAL_NOT_CERTIFIED,66);
 assert.equal(paper.section_reconciled_positions,66);
 assert.equal(a.newly_separated_working_regions_NOT_FORMAL_SOURCE_ID,37);
 assert.equal(a.original_printed_section_breakdown_working.S03,16);
 assert.equal(a.historical_known_published_source_positions_for_paper,paper.published_count);
 assert.equal(new Set(a.planned_remaining_original_working_region_records.map(x=>x.local_working_region_id)).size,37);
 for(const row of a.planned_remaining_original_working_region_records){
  assert.equal(row.working_answer_bbox_pt,null);
  assert.equal(row.source_id_accepted,false);
  assert.equal(row.original_visual_region_accepted,false);
  assert.equal(row.source_or_science_admission_gate,'HOLD_SOURCE_GEOMETRY_AND_PARENT');
  assert.ok(row.original_parent_context);
 }
 assert.equal(a.paper_source_ids_fully_itemized,false);
 assert.equal(a.paper_full_source_bbox_parent_gate_passed,false);
 assert.equal(a.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(a.ADMISSION_READY_new,0);
 assert.equal(a.PUBLISHED_new,0);
 assert.equal(cp.active_source_ids_itemized_papers,14);
});
