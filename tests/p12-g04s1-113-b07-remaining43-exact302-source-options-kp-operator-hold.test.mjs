import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const exact=read('p12-g04s1-113-b07-remaining43-exact302-targeted-full-source-42hold-v1.json');
const source=read('p12-g04s1-113-b07-dependent50-originalpdf-ninepages-nativebbox-science-kp-hold-v1.json');
const closeout=read('p12-g04s1-113-b07-original50-7published-43hold-pages-live-closeout-v2.json');
const duplicate=require('../scripts/review/p12-g04s1-113-b07-original-stem-dedup-preflight.cjs');
test('B07 original 50 conservation: published7 retained43, only 302 text-only potential; other42 remain frozen and TFMC1 separate HOLD',()=>{
 assert.equal(source.records.length,50);
 assert.equal(exact.existing_b07_published_original50,7);
 assert.equal(exact.remaining_original50_HOLD_before,43);
 assert.equal(exact.remaining_original50_HOLD_after,43);
 assert.equal(closeout.remaining_HOLD_in50,43);
 assert.equal(closeout.published_total_in50,7);
 const holds=closeout.dispositions.filter(x=>x.public_status==='RETAIN_FROZEN_HOLD');
 assert.equal(holds.length,43);
 const grouped=Object.values(exact.other_42_HOLD_by_existing_gate).flat();
 assert.equal(grouped.length,42);
 assert.equal(new Set(grouped).size,42);
 assert.ok(!grouped.includes(302));
 assert.ok(grouped.every(n=>holds.some(x=>x.worklist_ordinal===n)));
 assert.ok(holds.some(x=>x.worklist_ordinal===302));
 for(const n of [305,325,314,315,316,317,318,319,320,321,322,323,328,329,330])
  assert.ok(grouped.includes(n),'protected HOLD '+n);
 assert.equal(exact.B07_SEPARATE_TFMC1_HOLD,'SCI_G04_S1_113_FINAL_010|S3|TF|7');
 assert.equal(exact.frozen_113_48KP_unmodified,true);
 assert.equal(exact.source_review_PR124_DRAFT_not_merged,true);
 assert.deepEqual([exact.FORMAL_SCIENCE_KP_APPROVED_NEW,exact.ADMISSION_READY_NEW,exact.PUBLISHED_NEW],[0,0,0]);
});
test('B07 exact original native page3 right question and four options preserved, direct KP01_08 but operator still pending',()=>{
 const x=exact.exact_source_302_operator_pending;
 const q=source.records.find(x=>x.worklist_ordinal===302);
 assert.equal(x.original_source_slot_id,q.original_native_source_slot_id);
 assert.equal(x.original_source_slot_id,'SCI_G04_S1_113_MID_013|S07|G01|MC|001');
 assert.equal(x.source_pdf_sha256,'f11b6245253aa0aa84ddcbcb84603ff6275d4945b2494645d2ff721715fc25fe');
 assert.equal(x.source_pdf_sha256,q.original_pdf_sha256);
 assert.equal(x.pdf_page_1based,3);
 assert.deepEqual(x.original_answer_bbox_pdf_pts_top_left,[316.87,46.71,358.99,61.24]);
 assert.deepEqual(x.original_answer_bbox_pdf_pts_top_left,q.original_physical_bbox_pdf_pts_top_left);
 assert.equal(x.original_answer_bbox_method,'PDF_NATIVE_TEXT_ANSWER_BRACKET');
 assert.deepEqual(x.source_pdf_original_question_right_column_bbox_pt,[307,39,591,218]);
 assert.equal(x.source_pdf_native_text_clip_sha256_utf8,'85f1bacefc57c1a25509aec8c6933aec79f14e398adb2ff3a6fe5d80da03f134');
 assert.equal(x.original_full_question_stem_verbatim,'這次地震位於最大震度達到6強的民眾，地震發生時可能會感受或看見哪些現象？');
 assert.equal(x.original_four_choices_ordered.length,4);
 assert.deepEqual(x.original_four_choices_ordered,[
 '搖晃劇烈無法站穩，部分房屋可能損壞或倒塌，部分地面出現裂痕',
 '難以走動，少數桌椅移動或翻倒',
 '可以感覺到搖晃，懸掛物產生小搖晃',
 '可以感覺到微小搖晃。']);
 assert.equal(x.model_unique_answer_not_original_teacher_key,'①');
 assert.equal(x.frozen113_direct_kp,'sci_g04s1_01_08');
 assert.equal(x.frozen113_direct_kp_name,'地震造成地表變動與災害');
 assert.equal(x.pdf_page_1based,q.source_page_1_based);
 assert.equal(x.parent_article_originality_verified,false);
 assert.equal(x.parent_text_reproduced_in_student_bank,false);
 assert.equal(x.formal_science_kp_approved,false);
 assert.equal(x.operator_exact_302_explicit_publication_approval,false);
 assert.equal(x.ADMISSION_READY,false);assert.equal(x.PUBLISHED,false);
});
test('114 original 717 + current 113/114 public 749: 302 lexical dedup preflight has no >=0.78 high near, without treating this as full semantic admission',()=>{
 const d=duplicate.build();
 assert.equal(d.comparison_114_original_positions,717);
 assert.equal(d.comparison_public_g04s1_module_rows,749);
 const q=d.rows.find(x=>x.ordinal===302);
 assert.ok(q);
 assert.equal(q.exact_or_high_near_stem_hits.length,0);
 assert.equal(q.student_admission_allowed,false);
 assert.equal(d.semantic_duplicate_certified,false);
 assert.equal(exact.full_113_114_duplicate_status.includes('final applicable'),true);
});
