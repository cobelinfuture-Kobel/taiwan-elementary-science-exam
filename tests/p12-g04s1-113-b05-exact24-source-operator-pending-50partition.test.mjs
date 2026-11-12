import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = p => JSON.parse(readFileSync(new URL('../'+p, import.meta.url), 'utf8'));
const p = read('data/review/p12-g04s1-113-b05-exact24-source-science-kp-rights-operator-PENDING-v1.json');
const source = read('data/review/p12-g04s1-113-native-tfmc-b05-50-pdf-text-source-v2.json');
const bbox = read('data/review/p12-g04s1-113-native-tfmc-b05-50-original-native-glyph-bbox-v1.json');
const science = read('data/review/p12-g04s1-113-native-tfmc-b05-50-science-kp-parent-exception-routing-v1.json');
const bank = read('site/data/question-bank/p12-b04-b05-40-public-v1.json');
const published = read('data/review/p12-g04s1-113-main-published269-source-suppression-readback-v16.json');
const authority = read('site/data/authority/science-g03-g04-selector-v3.json');
const normal = x => String(x??'').normalize('NFKC').replace(/\s+/g,'').replace(/[，。！？]/g,'');
const option = x => normal(x).replace(/^[①②③④1234]/g,'');

test('B05 exact24 pending, 24 prior HOLD, one added qualifier HOLD and one published alias conserve exactly 50 source positions',()=>{
  assert.equal(p.status,'EXACT24_COHORT_PROPOSED_NOT_OPERATOR_APPROVED');
  assert.equal(science.items.length,50);
  assert.equal(p.exact24_operator_cohort_records.length,24);
  assert.equal(p.prior24_hold_ids.length,24);
  assert.equal(new Set(p.prior24_hold_ids).size,24);
  const all=new Set(science.items.map(x=>x.source_slot_id));
  const groups=[...p.exact24_operator_cohort_records.map(x=>x.original_source_slot_id),...p.prior24_hold_ids,p.additional_unique_answer_hold.source_id,p.confirmed_alias.original_source_id];
  assert.equal(groups.length,50);
  assert.equal(new Set(groups).size,50);
  assert.deepEqual(new Set(groups),all);
  assert.equal(science.items.filter(x=>x.route==='DIRECT').length,26);
  assert.equal(science.items.find(x=>x.source_slot_id===p.additional_unique_answer_hold.source_id).route,'DIRECT');
  assert.equal(p.operator_status.exact24_scope_approval_received,false);
  assert.equal(p.operator_status.source_original_scan5_full_duplicate_clearance_received,false);
  assert.equal(p.formal_metrics_new.FORMAL_SCIENCE_KP_APPROVED,0);
  assert.equal(p.formal_metrics_new.ADMISSION_READY,0);
  assert.equal(p.formal_metrics_new.PUBLISHED,0);
  assert.equal(p.public_main_113_source_ids_unchanged,269);
  assert.equal(p.public_site_answer_slots_unchanged,905);
});

test('Every proposed source is registered, exact original source text/choices+native BBox and period direct KP; never already main-published',()=>{
  const S=new Map(source.source_records.map(x=>[x.source_slot_id,x]));
  const B=new Map(bbox.source_positions.map(x=>[x.source_slot_id,x]));
  const known=new Set(published.all_unique_published_source_slot_ids);
  const kps=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(z=>z.canonical_kp_id)));
  assert.equal(known.size,269);
  for(const x of p.exact24_operator_cohort_records){
    const s=S.get(x.original_source_slot_id),b=B.get(x.original_source_slot_id);
    assert.ok(s && b, x.original_source_slot_id);
    assert.equal(s.source_pdf_sha256,x.source_pdf_sha256);
    assert.equal(b.source_pdf_sha256,x.source_pdf_sha256);
    assert.equal(x.source_original_stem_verbatim,s.original_pdf_text_layer_stem);
    assert.deepEqual(x.source_original_ordered_options_verbatim,s.original_ordered_choices);
    assert.deepEqual(x.original_native_answer_bbox_pdf_pt,b.original_answer_parenthesis_bbox_pts_top_left);
    assert.equal(x.original_pdf_page,b.pdf_page_1_based);
    assert.ok(x.original_pdf_page>0);
    assert.ok(Array.isArray(x.original_native_answer_bbox_pdf_pt)&&x.original_native_answer_bbox_pdf_pt.length===4);
    assert.equal(s.source_context_dependency,'ORIGINAL_SINGLE_QUESTION_TEXT');
    assert.equal(s.parent_ref,null);
    assert.equal(s.original_figure_mentioned,false);
    assert.equal(known.has(x.original_source_slot_id),false);
    assert.ok(kps.has(x.canonical_113_frozen_kp_PROPOSED));
    assert.ok(x.independent_science_answer_PROPOSED_NOT_SCHOOL_KEY);
    if(x.source_question_kind==='MC')assert.equal(x.source_original_ordered_options_verbatim.length,4);
    if(x.period_scope==='MIDTERM_U01_U02')assert.match(x.canonical_113_frozen_kp_PROPOSED,/sci_g04s1_0[12]_/);
    if(x.period_scope==='FINAL_U03_U04')assert.match(x.canonical_113_frozen_kp_PROPOSED,/sci_g04s1_0[34]_/);
    assert.equal(x.rights_approval_and_operator_exact_cohort,'PENDING');
    assert.equal(x.formal_science_kp_approved,false);
    assert.equal(x.admission_ready,false);
    assert.equal(x.published,false);
  }
});

test('The already-public 114 item is verbatim except MC options reordered, and cannot be republished',()=>{
  const s=source.source_records.find(x=>x.source_slot_id===p.confirmed_alias.original_source_id);
  const b=bank.blocks.find(x=>x.source_slot_id===p.confirmed_alias.already_public_114);
  assert.ok(s&&b);
  assert.equal(normal(s.original_pdf_text_layer_stem),normal(b.stem));
  assert.deepEqual(s.original_ordered_choices.map(x=>option(x.text)).sort(),b.options.map(option).sort());
  assert.equal(p.confirmed_alias.disposition,'SUPPRESS_NEW_STUDENT_ITEM_PRESERVE_BOTH_ORIGINAL_SCHOOL_SOURCE_IDS');
});

test('Do not upgrade scan-only source inspection or exact24 proposal to admission/publication',()=>{
  assert.equal(p.dedup_coverage.original_114_original_source_occurrences_scanned,717);
  assert.equal(p.dedup_coverage.original_113_native_text_layer_papers_checked,24);
  assert.equal(p.dedup_coverage.original_113_scanned_only_5_source_papers_without_native_readable_text,5);
  assert.equal(p.dedup_coverage.scan5_all_B05_items_visually_certified,false);
  assert.equal(p.b01_to_b04_untouched,true);
});
