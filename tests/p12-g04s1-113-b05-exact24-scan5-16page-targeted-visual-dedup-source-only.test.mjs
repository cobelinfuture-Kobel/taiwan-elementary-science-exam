import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const visual=read('data/review/p12-g04s1-113-b05-scan5-exact24-original-pdf-16page-targeted-visual-dedup-v1.json');
const proposal=read('data/review/p12-g04s1-113-b05-exact24-source-science-kp-rights-operator-PENDING-v1.json');
const registered=read('data/review/p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const source=read('data/review/p12-g04s1-113-native-tfmc-b05-50-pdf-text-source-v2.json');
const norm=x=>String(x||'').normalize('NFKC').replace(/\s+/g,'').replace(/[，。！？]/g,'');

test('5 scanned original school PDFs exactly match registered full binary SHA and page counts (16 total)',()=>{
  assert.equal(visual.scanned_source_papers.length,5);
  const set=new Set();
  let n=0;
  for(const p of visual.scanned_source_papers){
    const registeredPaper=registered.original_source_records.find(q=>q.source_id===p.id);
    assert.ok(registeredPaper);
    assert.equal(registeredPaper.scan_only_pdf,true);
    assert.equal(registeredPaper.original_pdf_sha256,p.sha);
    assert.equal(registeredPaper.original_pdf_page_count,p.pages);
    assert.equal(p.registered_sha256_verified,true);
    assert.equal(p.downloaded_original_full_binary,true);
    assert.deepEqual(p.actual_original_pages_rendered_and_visually_viewed,Array.from({length:p.pages},(_,i)=>i+1));
    assert.equal(p.full_native_text_layer_available,false);
    assert.equal(p.b05_exact24_targeted_visual_comparison,'COMPLETE_NO_EXACT_FULL_QUESTION_OR_ONLY_CHOICES_REORDERED_DUPLICATE');
    n+=p.pages;set.add(p.id);
  }
  assert.equal(set.size,5);
  assert.equal(n,16);
  assert.equal(visual.scope.original_pdf_pages,16);
});

test('Targeted B05 visual dedup exactly covers 24 inherited original items with unchanged PDF/bbox evidence',()=>{
  const V=visual.source_item_decisions;
  assert.equal(V.length,24);
  assert.equal(new Set(V.map(x=>x.original_source_slot_id)).size,24);
  const S=new Map(source.source_records.map(x=>[x.source_slot_id,x]));
  for(const item of V){
    const prior=proposal.exact24_operator_cohort_records.find(x=>x.original_source_slot_id===item.original_source_slot_id);
    assert.ok(prior,item.original_source_slot_id);
    assert.deepEqual(item.original_native_answer_bbox_pdf_pt,prior.original_native_answer_bbox_pdf_pt);
    assert.equal(item.source_pdf_sha256,prior.source_pdf_sha256);
    assert.equal(item.original_source_pdf_page,prior.original_pdf_page);
    assert.ok(S.has(item.original_source_slot_id));
    assert.equal(item.scan5_targeted_duplicate_decision,'NO_IDENTICAL_FULL_ITEM_OR_ONLY_CHOICE_ORDER_CHANGE_IN_VISUALLY_INSPECTED_SCAN5');
    assert.equal(item.comparison_papers.length,item.original_registered_exam_scope==='MIDTERM_U01_U02'?2:3);
    assert.equal(item.admission_ready,false);
    assert.equal(item.published,false);
  }
  assert.equal(visual.scope.individual_B05_existing_exact24_proposal_items_compared,24);
  assert.equal(visual.scope.exact_verbatim_or_choice_reordered_matches_found_in_scan5,0);
});

test('Similar scan items including exact stem are NOT silently collapsed when full actual MC options differ',()=>{
  const p=visual.relevant_visual_comparison_examples;
  assert.equal(p.length,5);
  const similar=p.find(x=>x.original_scan_paper_id==='SCI_G04_S1_113_FINAL_002');
  assert.equal(similar.original_scan_page,2);
  assert.equal(norm(similar.scan_actual_stem),norm('下列何者不是光源？'));
  const target=source.source_records.find(x=>x.source_slot_id===similar.b05_comparison_source_id);
  assert.equal(norm(target.original_pdf_text_layer_stem),norm(similar.scan_actual_stem));
  assert.equal(similar.decision,'SAME_STEM_DIFFERENT_ACTUAL_OPTIONS_NOT_EXACT_ALIAS');
  assert.equal(visual.duplicate_application.includes('all ordered original options'),true);
});

test('No operator release, extra Science/KP gate or reopening B01-B04: 24+24+1+1=50',()=>{
  assert.equal(visual.operator_exact24_approval_received,false);
  assert.equal(visual.selective_publication_allowed,false);
  assert.equal(visual.other_gate_coverage.new_FORMAL_SCIENCE_KP_APPROVED,0);
  assert.equal(visual.other_gate_coverage.new_ADMISSION_READY,0);
  assert.equal(visual.other_gate_coverage.new_PUBLISHED,0);
  assert.equal(visual.exclusions_unchanged.prior24HOLD.length,24);
  const groups=[...visual.exclusions_unchanged.prior24HOLD,
    visual.exclusions_unchanged.science_qualifier_new_hold,
    visual.exclusions_unchanged.one_114_already_public_alias,
    ...visual.source_item_decisions.map(x=>x.original_source_slot_id)];
  assert.equal(groups.length,50);
  assert.equal(new Set(groups).size,50);
  assert.equal(visual.source_draft_PR,124);
  assert.equal(visual.scope.main_public_question_slots_added,0);
});
