import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const a=read(root+'scan4-182-existing-raster-sourceid-bbox-parent-crosswalk-v1.json');
const base=read(root+'known-atomic-disjoint-source-ledger-v8.json');
const heshunHold=read(root+'scan5-heshun-final001-mc008-unique-answer-hold-overlay-v1.json');
const four=new Set(['SCI_G04_S1_113_MID_002','SCI_G04_S1_113_FINAL_002','SCI_G04_S1_113_MID_006','SCI_G04_S1_113_FINAL_009']);
test('all 182 original scan4 positions have disjoint proof IDs, existing parent and physical source response regions',()=>{
 assert.equal(a.total_unreviewed_crosswalk_rows,182);
 assert.equal(a.rows.length,182);
 assert.equal(new Set(a.rows.map(r=>r.source_slot_id)).size,182);
 const originals=base.known_atomic_source_dispositions.filter(r=>four.has(r.paper_id));
 assert.equal(originals.length,212);
 const expected=new Set(originals.filter(r=>r.disposition==='UNREVIEWED').map(r=>r.source_slot_id));
 assert.equal(expected.size,182);
 assert.deepEqual(new Set(a.rows.map(r=>r.source_slot_id)),expected);
 assert.equal(a.total_original_source_id_geometry_proof_coverage,212);
 assert.equal(a.original_source_response_region_bbox_available_for_unreviewed,182);
 assert.equal(a.original_response_region_bbox_unavailable_for_unreviewed,0);
 const authority=new Map(base.original_papers.map(r=>[r.source_paper_id,r]));
 for(const r of a.rows){
  assert.equal(r.prior_disposition,'UNREVIEWED');
  assert.ok(four.has(r.source_paper_id));
  assert.equal(r.has_bounded_source_response_region,true);
  assert.match(r.geometry_proof_blob_sha,/^[a-f0-9]{40}$/);
  assert.ok(r.geometry_proof_file.endsWith('.json'));
  assert.ok(Number.isInteger(r.source_pdf_page_1based));
  assert.ok(r.source_pdf_page_1based>=1&&r.source_pdf_page_1based<=authority.get(r.source_paper_id).original_pdf_pages);
  const rect=r.original_source_response_region_bbox_pdf_points_top_left;
  assert.ok(Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite),r.source_slot_id);
  assert.ok(rect[0]>=0&&rect[1]>=0&&rect[2]>rect[0]&&rect[3]>rect[1]);
  assert.match(r.pdf_sha256,/^[a-f0-9]{64}$/);
  assert.equal(r.full_original_stem_options_accepted,false);
  assert.equal(r.science_unique_answer_formal,false);
  assert.equal(r.direct_frozen48kp_formal,false);
  assert.equal(r.full_11329_11425_semantic_dedup_accepted,false);
  assert.equal(r.article9_component_rights_accepted,false);
  assert.equal(r.operator_eligible,false);
  assert.equal(r.admission_ready,false);
  assert.equal(r.published_new,false);
 }
 for(const record of a.per_original_paper){
  assert.equal(record.original_unreviewed_source_ids_unmatched,0);
  assert.equal(record.full_evidence_id_coverage,true);
  assert.equal(record.original_source_response_bbox_complete,true);
  assert.equal(record.bbox_available,record.unreviewed_positions_mapped);
 }
});
test('source-work positions are not student questions and scan4 does not re-review released333 or override science HOLD',()=>{
 assert.deepEqual(base.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
 assert.deepEqual(heshunHold.effect_source_work_disjoint,{PUBLISHED:333,HOLD:284,ALIAS:15,UNREVIEWED:1130});
 assert.equal(a.original_333_published_untouched,true);
 assert.equal(a.frozen_48_kp_untouched,true);
 assert.equal(a.existing_disposition_maintained,true);
 assert.equal(a.previous_single_Heshun_FINAL001_MC008_HOLD_overlay_preserved,true);
 assert.equal(a.formal_science_kp_approved_new,0);
 assert.equal(a.admission_ready_new,0);
 assert.equal(a.published_new,0);
 assert.equal(a.pdf_scan_source_full_exact_transcription_accepted_new,0);
 assert.equal(a.full_11329_11425_semantic_dedup_accepted_new,0);
 assert.deepEqual(Object.fromEntries(a.per_original_paper.map(r=>[r.paper.split('113_')[1],r.unreviewed_positions_mapped])),{MID_002:46,FINAL_002:46,MID_006:47,FINAL_009:43});
 assert.equal(a.original_region_kind_counts.ORIGINAL_SCANNED_TABLE_RESPONSE_CELL,21);
 assert.equal(Object.values(a.original_region_kind_counts).reduce((a,b)=>a+b,0),182);
});
