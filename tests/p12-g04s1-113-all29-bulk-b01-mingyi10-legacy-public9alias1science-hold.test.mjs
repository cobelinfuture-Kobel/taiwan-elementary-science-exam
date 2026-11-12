import test from 'node:test';
import assert from 'node:assert/strict';
import {readJson} from '../scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs';
const o=readJson('data/review/p12-g04s1-113-all29-bulk-b01-mingyi10-existing-legacy-exact9alias1science-hold-overlay-v1.json');
const audit=readJson('data/review/p12-g04s1-113-all29-bulk-b01-114-original-content-and-gate-routing-v1.json');
const bank=readJson('site/data/question-bank/approved-historical-ox-v4.json');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s（）、，。！？：；「」『』()、.,!?;:—-]/g,'');
test('source readback: 10 Mingyi original numbered first-page TF are already published in legacy site bank with identical PDF SHA and exact normalized stem',()=>{
 assert.equal(bank.public_site_integrated,true);
 assert.equal(o.records.length,10);
 assert.equal(o.source_10_exam_items_same_original_PDF_verified,10);
 const seen=new Set();
 for(let i=0;i<10;i++){
  const x=o.records[i],b=bank.blocks.find(b=>b.id===x.preexisting_main_legacy_student_id),src=audit.rows.find(q=>q.source_slot_id===x.source_slot_id);
  assert.ok(src&&b);
  assert.equal(x.source_slot_id,'SCI_G04_S1_113_FINAL_007|S01|TF|'+String(i+1).padStart(3,'0'));
  assert.equal(b.source_pdf_sha256,x.source_original_pdf_sha256);
  assert.equal(src.original_pdf_sha256,x.source_original_pdf_sha256);
  assert.equal(b.source_page_pdf_1_based,x.source_original_page_1based);
  assert.equal(src.original_pdf_page_1based,x.source_original_page_1based);
  assert.equal(norm(src.question_text_from_original_PDF),norm(b.stem));
  assert.equal(b.answer,x.legacy_student_answer);
  assert.equal(b.canonical_kp_id,x.legacy_student_canonical_kp_preserve);
  assert.ok(!seen.has(x.source_slot_id));seen.add(x.source_slot_id);
  assert.equal(x.source_status_before,'UNREVIEWED');
  assert.equal(x.no_new_student_publication,true);
  assert.equal(x.do_not_change_existing_student_answer_or_kp,true);
 }
});
test('nine exact already-public originals are ALIAS; published O vs candidate X tenth original stays HOLD science dispute, does not edit old answer',()=>{
 assert.equal(o.source_ALIASES_reconciled,9);
 assert.equal(o.source_SCIENCE_CONFLICT_HOLD_reconciled,1);
 assert.equal(o.records.filter(x=>x.source_status_after==='ALIAS').length,9);
 const h=o.records.filter(x=>x.source_status_after==='HOLD');
 assert.equal(h.length,1);
 assert.equal(h[0].source_slot_id,'SCI_G04_S1_113_FINAL_007|S01|TF|010');
 assert.equal(h[0].legacy_student_answer,'O');
 assert.equal(h[0].current_independent_model_answer,'X');
 assert.equal(o.SCIENCE_CONFLICT_NOT_AUTO_RESOLVED,true);
 assert.deepEqual(o.prior_effective_all29,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 assert.deepEqual(o.after_effective_all29,{PUBLISHED:333,HOLD:292,ALIAS:25,UNREVIEWED:1112});
 assert.equal(Object.values(o.after_effective_all29).reduce((s,n)=>s+n,0),1762);
 assert.equal(o.b01_post_B01_UNREVIEWED,104);
 assert.equal(o.legacy_main_student_question_items_not_reopened,true);
 assert.equal(o.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(o.ADMISSION_READY_new,0);
 assert.equal(o.PUBLISHED_new,0);
});