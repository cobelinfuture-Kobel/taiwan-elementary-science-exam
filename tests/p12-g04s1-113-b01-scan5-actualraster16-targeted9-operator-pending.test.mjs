import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL('../data/review/'+name,import.meta.url),'utf8'));
const scan=read('p12-g04s1-113-b01-scan5-16page-original-raster-targeted9-duplicate-v2.json');
const request=read('p12-g04s1-113-b01-exact9-original-scan5-rights-operator-cohort-request-PENDING-v2.json');
const previous=read('p12-g04s1-113-existingadmission-fixed29-b01-onegate-7standalone-2parents16positions-rights-dedup-v3.json');
const expected={
SCI_G04_S1_113_MID_002:'88f6f7eb5999652d95c0e3f8db8125fca4673db1552f2173a6156e78ddfc706b',
SCI_G04_S1_113_FINAL_001:'3fc18d09fe6a9b4b43cdd28b17497d5a21b4962c24f859965ca8f22945ed932e',
SCI_G04_S1_113_FINAL_002:'bf53534200aeb5fb7756f89d1a0bb9d60dd72f9055d2202a200b872b91489bee',
SCI_G04_S1_113_MID_006:'aec7ae8371c888e84da39653183050377c7dedf94dac71b112200cd9e78ba222',
SCI_G04_S1_113_FINAL_009:'0501c6a3157a6759a0e2ef8c3944917f2b6d58d1033d04751034f22f'
};
test('five original PDFs are SHA-checked, all sixteen actual raster pages inspected without fake OCR',()=>{
 assert.equal(scan.scanned_papers.length,5);
 assert.equal(scan.original_scanned_pdf_page_count,16);
 assert.equal(scan.original_scanned_pages_visual_inspection_count,16);
 assert.equal(scan.all_scanned_original_pdf_sha_match,true);
 assert.equal(scan.original_scanned_262_source_response_work_targets_FULL_TRANSCRIBED,false);
 const ids=new Set();
 for(const p of scan.scanned_papers){
  assert.equal(p.pdf_sha256,expected[p.source_id]);
  assert.equal(p.all_pages_visually_inspected,true);
  assert.equal(p.verified_original_pdf_sha,true);
  assert.equal(ids.has(p.source_id),false);
  ids.add(p.source_id);
 }
 assert.equal(scan.scanned_papers.reduce((n,p)=>n+p.pages,0),16);
 assert.equal(scan.original_pdf.original_school_exam_title_image_verified,true);
 assert.equal(scan.original_pdf.sha256,'7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56');
});
test('original cross-school same questions preserve lineage and intact two parents',()=>{
 assert.equal(scan.b01_candidate_exact9_visual_duplicate_decisions.length,9);
 assert.ok(scan.b01_candidate_exact9_visual_duplicate_decisions.every(x=>x.decision && /NO_EXACT|DISTINCT/.test(x.decision)));
 const p=request.exact9;
 assert.equal(p.length,9);
 assert.deepEqual(p.filter(x=>x.original_question_kind==='INSEPARABLE_SHARED_PARENT').map(x=>x.student_answer_positions),[4,5]);
 assert.deepEqual(p.filter(x=>x.original_question_kind!=='INSEPARABLE_SHARED_PARENT').map(x=>x.original_source_owner_id),previous.candidate_independent_tfmc_items.map(x=>x.source_id));
 assert.equal(p.filter(x=>x.exact_unpublished_native_same_question_other_lineage).length,2);
 assert.ok(p.every(x=>x.new_scan5_exact_duplicate_found===false&&x.new_public_814_exact_duplicate_found===false));
});
test('rights source is exam text only; do not publish teacher key, original figures or printed scoring',()=>{
 assert.equal(request.rights.original_printed_school_header_VISUAL_verified,true);
 assert.equal(request.rights.route,'REGULATED_EXAM_QUESTION_ART9');
 assert.equal(request.rights.release_scope,'EXAM_QUESTION_TEXT_AND_CHOICES_ONLY');
 assert.ok(request.rights.excluded.includes('TEACHER_ANSWER_KEY'));
 assert.ok(request.rights.excluded.includes('THIRD_PARTY_PUBLISHER_ORIGINAL_IMAGES'));
 assert.equal(request.rights.applicable_operator_rights_attestation_pending,true);
 assert.ok(request.exact9.every(x=>x.rights_mode==='ARTICLE9_FORMAL_EXAM_TEXT_ONLY'&&!x.original_external_figure_required));
});
test('exact nine candidate operator cohort still PENDING, no unapproved admission/release, B02 must stay locked',()=>{
 const s=request.status;
 assert.equal(request.approval_status,'PENDING_OPERATOR_EXACT_COHORT_SIGNOFF');
 assert.equal(s.operator_signoff_received,false);
 assert.equal(s.new_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(s.new_ADMISSION_READY,0);
 assert.equal(s.new_PUBLISHED,0);
 assert.equal(s.student_public_release_PR_created,false);
 assert.equal(s.b01_formal_closeout,false);
 assert.equal(s.b02_started,false);
 assert.equal(request.source_work_position_accounting.total,50);
 assert.equal(request.source_work_position_accounting.already_main_published_suppressed+request.source_work_position_accounting.exceptions_HOLD+request.source_work_position_accounting.model_candidate_response_positions,50);
 assert.equal(request.dedup_screening.current_site_113_original_published,178);
 assert.equal(request.dedup_screening.verified_site_total_public_answer_positions,814);
});
