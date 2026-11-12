import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {normalizeSlot}=require('../scripts/review/p12-g04s1-113-wholecorpus-resume.cjs');
const read=name=>JSON.parse(fs.readFileSync(new URL('../data/review/'+name,import.meta.url),'utf8'));
const a=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardA-v1.json');
const b=read('p12-g04s1-113-missing15-published-lineage-main-bbox-shardB-v1.json');
const pub=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
const gap=read('p12-g04s1-113-missing15-paper-inventory-gap-checkpoint-v1.json');
const txt=read('p12-g04s1-113-missing15-native5-107-tfmc-text-anchor-readback-v1.json');
const summary=read('p12-g04s1-113-postB09-missing15-source-recovery-readback-v1.json');
const rows=[...a.rows,...b.rows];
test('all 51 previously published source positions across missing15 have exact main page/glyph bbox and SHA',()=>{
  const paperSHAs=new Map(gap.records.map(p=>[p.paper_id,p.source_pdf_sha256]));
  const expected=new Set(pub.all_unique_published_source_slot_ids.filter(id=>paperSHAs.has(id.split('|')[0])).map(normalizeSlot));
  assert.equal(expected.size,51);
  assert.equal(rows.length,51);
  assert.equal(new Set(rows.map(r=>r.normalized_source_slot_id)).size,51);
  assert.deepEqual(new Set(rows.map(r=>r.normalized_source_slot_id)),expected);
  for(const r of rows) {
    assert.ok(expected.has(normalizeSlot(r.original_source_slot_id)));
    assert.equal(r.source_pdf_sha256,paperSHAs.get(r.source_paper_id));
    assert.ok(Number.isInteger(r.source_page_pdf_1_based)&&r.source_page_pdf_1_based>=1);
    assert.equal(r.actual_source_pdf_bbox_pts_top_left.length,4);
    assert.ok(r.actual_source_pdf_bbox_pts_top_left.every(Number.isFinite));
    assert.ok(r.actual_source_pdf_bbox_pts_top_left[2]>r.actual_source_pdf_bbox_pts_top_left[0]);
    assert.ok(r.actual_source_pdf_bbox_pts_top_left[3]>r.actual_source_pdf_bbox_pts_top_left[1]);
    assert.ok(r.science_answer_present);
    assert.ok(r.canonical_kp_id);
    assert.equal(r.retain_only_no_new_release,true);
  }
});
test('native-five readback locates 107 real numbered print markers, suppressing 19 inherited releases',()=>{
  const groups=txt.records;
  const s=groups.flatMap(x=>x.sections);
  const all=s.flatMap(x=>x.markers);
  const previously=new Set(rows.map(x=>x.normalized_source_slot_id));
  assert.equal(groups.length,5);
  assert.equal(s.length,9);
  assert.equal(all.length,107);
  assert.equal(new Set(all.map(x=>x.normalized_id)).size,107);
  assert.equal(all.filter(x=>x.is_published_already).length,19);
  assert.equal(all.filter(x=>!x.is_published_already).length,88);
  assert.equal(all.filter(x=>x.prior_411_candidate_ids.length>0).length,59);
  assert.ok(all.filter(x=>x.is_published_already).every(x=>previously.has(x.normalized_id)));
  for(const group of groups) {
    assert.equal(group.registered_original_pdf_sha256,gap.records.find(x=>x.paper_id===group.source_id).source_pdf_sha256);
    for(const section of group.sections) {
      assert.deepEqual(section.recovered_marker_numbers,Array.from({length:section.original_numbered_count},(_,i)=>i+1));
      assert.equal(section.original_numbered_count,section.markers.length);
      assert.ok(section.markers.every(x=>x.printed_answer_parenthesis_observed));
      assert.ok(section.markers.every(x=>!x.answer_glyph_pdf_bbox_certified&&!x.original_stem_and_options_pdf_visual_verified));
    }
  }
});
test('the 15-paper mixed-quality section count is an estimate, not new exact per-child slot inventory',()=>{
  const m=summary.summary;
  assert.equal(summary.records.length,15);
  assert.equal(m.scan_previous_visual_section_inventory_count,5);
  assert.equal(m.native_previous_section_reconciled_count,5);
  assert.equal(m.native_printed_score_estimate_only_count,5);
  assert.equal(m.five_scan_section_positions_prior_visually_counted,262);
  assert.equal(m.five_native_section_positions_prior_reconciled,395);
  assert.equal(m.five_native_score_derived_positions_unverified,326);
  assert.equal(m.partial_section_planning_positions_total_not_certified,983);
  assert.equal(m.source_published_114_existing_with_exact_main_pdf_bbox_inherited,51);
  assert.equal(m.new_native_source_TFMC_numbered_text_anchors,107);
  assert.equal(m.unpublished_native_TFMC_numbered_text_anchors_still_hold,88);
  assert.equal(m.all_original_15_papers_exact_child_bbox_certified_new,0);
  assert.ok(summary.records.every(r=>r.full_original_answer_slot_inventory_completed===false));
  assert.equal(m.formal_science_kp_approved_new,0);
  assert.equal(m.admission_ready_new,0);
  assert.equal(m.published_new,0);
  assert.equal(pub.newly_published_113_slots,114);
  assert.equal(pub.public_total_answer_slots,750);
});
