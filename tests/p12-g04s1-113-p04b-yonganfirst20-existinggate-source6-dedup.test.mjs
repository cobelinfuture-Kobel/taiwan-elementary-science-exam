import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=(p)=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const site=(p)=>JSON.parse(readFileSync(new URL('../site/data/question-bank/'+p,import.meta.url),'utf8'));
const manifest=data('p12-g04s1-113-p04b-existingformal-yonganfinal-6-source-science-kp-dedup-rights-candidates-v1.json');
const published=data('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const registry=data('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const originalInventory=data('p12-g04s1-113-p04b-all29-1762-noncertified-source-modes-v15.json');
const b4=site('p12-b04-b04-47-public-v1.json');
const b5=site('p12-b04-b05-40-public-v1.json');
const authority=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
const simplify=s=>s.replace(/^[①②③④]/,'').replace(/[。．\s]/g,'');
test('P12 113 G04S1 YongAn original 20 first-page independent questions: 14 already MAIN sources, exact six source-only Gate candidates',()=>{
 assert.equal(manifest.original_school_exam_firstpage_independent_TF10_MC10_source_question_count,20);
 assert.equal(manifest.already_MAIN_PUBLISHED_same_113_school_original14_suppress,14);
 assert.equal(manifest.not_yet_published_same_113_school_source_questions_6,6);
 assert.equal(manifest.records.length,6);
 assert.equal(manifest.among6_exact_or_option_reorder_duplicates_with_114_public,2);
 assert.equal(manifest.among6_DIRECT48KP_SCOPE_HOLD,1);
 assert.equal(manifest.among6_science_and_direct_KP_clearly_grounded_candidates_for_later_existing_gates,3);
 assert.equal(manifest.among6_final_ready_to_publish_now,0);
 assert.equal(published.all_unique_published_source_slot_ids.length,178);
 assert.equal(manifest.registered_source_pdf_sha256,registry.original_source_records.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_005').original_pdf_sha256);
 assert.equal(originalInventory.original_113_G04S1_school_exam_PDFs_source_work_response_ID_parent_mode_itemized,29);
 const firstpageAlready=published.all_unique_published_source_slot_ids.filter(s=>s.startsWith('SCI_G04_S1_113_FINAL_005|')&&(/\|TF\|/.test(s)||/\|MC\|/.test(s)));
 assert.equal(firstpageAlready.length,14);
 const normalizeSlot=s=>s.replace(/\|S0([12])\|/g,'|S$1|');
 const seen=new Set(firstpageAlready.map(normalizeSlot));
 for(const x of manifest.records){
   assert.equal(seen.has(normalizeSlot(x.source_slot_id)),false);
   assert.equal(x.source_pdf_sha256,manifest.registered_source_pdf_sha256);
   assert.equal(x.source_pdf_page_1_based,1);
   assert.equal(x.admission_ready,false);
   assert.equal(x.published,false);
   assert.equal(x.operator_batch_approval_for_this_new_item,false);
   assert.equal(x.formal_science_KP_approved,false);
   assert.equal(x.student_site_original_pdf_or_diagrams_included,false);
   assert.equal(x.teacher_key_claimed,false);
   assert.equal(x.exam_student_response_mode_interpreted_not_literal_source_text,x.original_type==='tf'?'ORIGINAL_TRUE_FALSE_PARENS':'ORIGINAL_FOUR_CHOICE_SINGLE_SELECT_PARENS');
   const b=x.original_pdf_native_actual_open_close_paren_glyph_union_bbox_pts_top_left;
   assert.ok(b.length===4&&b.every(Number.isFinite)&&b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]);
   if(x.original_type==='mc')assert.equal(x.original_options_printed_order_1to4.length,4);
 }
 for(const k of ['new_FORMAL_SCIENCE_KP_APPROVED','new_ADMISSION_READY','new_PUBLISHED'])assert.equal(manifest[k],0);
});
test('2026-10-19 operator duplicate rule: YongAn TF8 exact stem and MC7 same printed option set under reordering — SUPPRESS with sources',()=>{
 const tf=manifest.records.find(x=>x.source_slot_id.endsWith('|TF|008'));
 const mc=manifest.records.find(x=>x.source_slot_id.endsWith('|MC|007'));
 const tfpublic=b4.blocks.find(x=>x.id==='P12_B04_G04S1_B04_TF_049');
 const mcpublic=b5.blocks.find(x=>x.id==='P12_B04_G04S1_B05_MC_007');
 assert.equal(tf.original_stem,tfpublic.stem);
 assert.equal(tf.already_public_duplicate_source,tfpublic.source_slot_id);
 assert.equal(mc.original_stem,mcpublic.stem);
 assert.deepEqual(mc.original_options_printed_order_1to4.map(simplify).sort(),mcpublic.options.map(simplify).sort());
 assert.notDeepEqual(mc.original_options_printed_order_1to4.map(simplify),mcpublic.options.map(simplify));
 assert.equal(mc.already_public_duplicate_source,mcpublic.source_slot_id);
 assert.equal(tf.previous_gate_materiality_status,'SUPPRESS_EXACT_FULL_STEM_ALREADY_114_B04_PUBLIC');
 assert.equal(mc.previous_gate_materiality_status,'SUPPRESS_EXACT_STEM_AND_ORDER_ONLY_OPTIONS_114_B04_PUBLIC');
});
test('Three YongAn standalone original unique-answer/direct frozen48KP candidates keep rights, crossoriginal duplicate and operator release pending; TF10 holds no direct KP',()=>{
 const kps=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(kps.size,48);
 assert.deepEqual(manifest.three_science_directKP_prelim_candidates.sort(),[
 'SCI_G04_S1_113_FINAL_005|S01|TF|007',
 'SCI_G04_S1_113_FINAL_005|S02|MC|009',
 'SCI_G04_S1_113_FINAL_005|S02|MC|010'
 ].sort());
 for(const id of manifest.three_science_directKP_prelim_candidates){
  const q=manifest.records.find(x=>x.source_slot_id===id);
  assert.ok(kps.has(q.direct_frozen48KP_candidate));
  assert.equal(q.previous_gate_materiality_status,'SCIENCE_AND_DIRECT48KP_CANDIDATE_PENDING_COMPLETE_DUP_RIGHTS_OPERATOR');
  assert.equal(q.duplicate_full_comparison_across_all_registered_original_schools_NOT_FORMALLY_CLOSED,true);
  assert.equal(q.admission_ready,false);
 }
 const hold=manifest.records.find(x=>x.source_slot_id.endsWith('|TF|010'));
 assert.equal(hold.direct_frozen48KP_candidate,null);
 assert.equal(hold.previous_gate_materiality_status,'HOLD_NO_DIRECT_FROZEN48KP_AND_CONDITIONAL_SCIENCE_SCOPE');
 assert.equal(manifest.existing_final_operator_approved_cohort_manifest_for_three_new_questions,false);
});
