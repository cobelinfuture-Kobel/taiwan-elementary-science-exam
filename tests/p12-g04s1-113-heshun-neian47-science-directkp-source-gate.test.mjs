import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=(n)=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const he=file('p12-g04s1-113-heshun-final001-standalone23-science-directkp-screen-v1.json');
const ne=file('p12-g04s1-113-neian-mid006-standalone24-science-directkp-screen-v1.json');
const hg=file('p12-g04s1-113-heshun-final001-first23-exact-original-raster-bbox-v1.json');
const ng=file('p12-g04s1-113-neian-mid006-scan24-exact-raster-bbox-v1.json');
const pub=file('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
const authority=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
const frozen=authority.units.filter(x=>x.grade===4&&x.semester===1);
const kpIDs=new Map(frozen.flatMap(x=>x.knowledge_points.map(k=>[k.canonical_kp_id,x.unit_id])));
const published=new Set(pub.all_unique_published_source_slot_ids);
const banned=/^\d+\s*分$|每題\s*\d+\s*分/;

test('one exact original science-direct KP source-screen per of Heshun FINAL 23, all unreleased',()=>{
 assert.equal(he.summary.source_independent_slots_targeted,23);
 assert.equal(he.summary.source_stem_options_and_science_directkp_clear_this_batch,8);
 assert.equal(he.individual_holds.length,15);
 assert.equal(he.source_science_directkp_evidence_records.length,8);
 assert.equal(hg.records.length,23);
 const geom=new Map(hg.records.map(x=>[x.provisional_source_slot_id,x.mapped_pdf_page_bbox_pts_top_left]));
 const ids=new Set();
 for(const rec of [...he.source_science_directkp_evidence_records,...he.individual_holds]){
  assert.ok(!ids.has(rec.source_slot_id));ids.add(rec.source_slot_id);
  assert.ok(geom.has(rec.source_slot_id));
  assert.equal(rec.admission_ready,false);
  assert.equal(rec.published,false);
  assert.ok(!published.has(rec.source_slot_id));
 }
 for(const rec of he.source_science_directkp_evidence_records){
  assert.ok(kpIDs.has(rec.canonical_kp_id));
  assert.ok(['U03','U04'].includes(kpIDs.get(rec.canonical_kp_id)));
  assert.equal(rec.source_original_sha256,hg.source_id_sha256||rec.source_original_sha256);
  assert.deepEqual(rec.original_pdf_bbox_pts_top_left,geom.get(rec.source_slot_id));
  assert.equal(rec.science_unique_answer_and_direct_kp_evidence_reviewed,true);
  assert.equal(rec.final_duplicate_full_gate_complete,false);
  assert.equal(rec.final_rights_gate_complete,false);
  assert.equal(rec.operator_batch_manifest_final_approval,false);
  assert.ok(!banned.test(rec.source_exact_printed_stem_no_scoring));
  if(rec.source_slot_id.includes('|MC|')){assert.equal(rec.original_choice_text_in_printed_order.length,4);assert.ok(Number.isInteger(rec.science_answer_not_teacher_key)&&rec.science_answer_not_teacher_key>=1&&rec.science_answer_not_teacher_key<=4)}
 }
 assert.equal(ids.size,23);
});

test('Neian source-science direct KP 15 candidate records, nine exceptions, all unmapped to student public',()=>{
 assert.equal(ne.summary.source_slots_screened,24);
 assert.equal(ne.summary.science_direct_kp_candidates_verified,15);
 assert.equal(ne.hold_records.length,9);
 assert.equal(ng.records.length,24);
 const geom=new Map(ng.records.map(x=>[x.source_slot_id_provisional,x]));
 const ids=new Set();
 for(const rec of [...ne.source_science_kp_records,...ne.hold_records]){
  assert.ok(!ids.has(rec.source_slot_id));ids.add(rec.source_slot_id);
  assert.ok(geom.has(rec.source_slot_id));
  assert.ok(!published.has(rec.source_slot_id));
  assert.equal(rec.admission_ready,false);
  assert.equal(rec.published,false);
 }
 for(const rec of ne.source_science_kp_records){
  assert.ok(kpIDs.has(rec.canonical_kp_id));
  assert.ok(['U01','U02'].includes(kpIDs.get(rec.canonical_kp_id)));
  assert.deepEqual(rec.source_original_pdf_bbox_pts_top_left,geom.get(rec.source_slot_id).mapped_pdf_page_bbox_pts_top_left);
  assert.equal(rec.science_direct_kp_source_evidence_verified,true);
  assert.equal(rec.dedup_full_crossyear_options_review_complete,false);
  assert.equal(rec.rights_formal,false);
  assert.equal(rec.operator_manifest_approved,false);
  assert.ok(!banned.test(rec.source_exact_stem_no_score));
  if(rec.source_slot_id.includes('|MC|'))assert.equal(rec.source_exact_options_in_printed_order.length,4);
 }
 assert.equal(ids.size,24);
});

test('two school snapshots preserve 152 published and avoid artificial new gates or invented approvals',()=>{
 assert.equal(kpIDs.size,48);
 assert.equal(pub.all_unique_published_source_slot_ids.length,152);
 assert.equal(he.summary.new_formal_admission_ready,0);
 assert.equal(he.summary.new_published,0);
 assert.equal(ne.summary.formal_admission_ready,0);
 assert.equal(ne.summary.new_published,0);
 assert.equal(he.summary.source_stem_options_and_science_directkp_clear_this_batch+ne.summary.science_direct_kp_candidates_verified,23);
 assert.equal(he.individual_holds.length+ne.hold_records.length,24);
 assert.equal(he.source_science_directkp_evidence_records.length+ne.source_science_kp_records.length+he.individual_holds.length+ne.hold_records.length,47);
});
