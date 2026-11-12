import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=x=>JSON.parse(readFileSync(new URL("../data/review/"+x,import.meta.url),"utf8"));
const checkpoint=read("p12-g04s1-113-b03-native50-post206-legacy7-27candidates-16hold-v2.json");
const candidate=read("p12-g04s1-113-b03-27exact-original-source-science-kp-operator-pending-v1.json");
const source=read("p12-g04s1-113-native-tfmc-b03-50-original-pdf-text-preflight-v1.json");
const geometry=read("p12-g04s1-113-native-tfmc-b03-50-real-original-glyph-bbox-v1.json");
const science=read("p12-g04s1-113-native-tfmc-b03-50-science-kp-consolidated-v1.json");
const legacy=JSON.parse(readFileSync(new URL("../site/data/question-bank/approved-historical-ox-v4.json",import.meta.url),"utf8"));

test("B03 native original 50 kept in original order, 27 candidates + 15 old HOLD + 1 near-duplicate HOLD + 7 legacy public suppression",()=>{
 assert.equal(checkpoint.records.length,50);
 assert.deepEqual(checkpoint.records.map(x=>x.n),Array.from({length:50},(_,i)=>i+101));
 assert.equal(new Set(checkpoint.records.map(x=>x.id)).size,50);
 assert.deepEqual(checkpoint.records.map(x=>x.id),source.records.map(x=>x.source_slot_id));
 assert.deepEqual(checkpoint.records.map(x=>x.id),geometry.source_marker_records.map(x=>x.original_source_slot_id));
 assert.deepEqual(checkpoint.records.map(x=>x.id),science.records.map(x=>x.source_slot_id));
 const sums={};for(const row of checkpoint.records)sums[row.disposition]=(sums[row.disposition]||0)+1;
 assert.deepEqual(sums,{CANDIDATE_NEEDS_OPERATOR_AND_DEDUP:27,HOLD_SCIENCE_OR_KP:15,HOLD_DUPLICATE_EVIDENCE:1,SUPPRESSED_EXISTING_LEGACY_PUBLIC:7});
 assert.deepEqual(checkpoint.counts, {all_source_positions:50,existing_DIRECT_model_candidates:35,existing_HOLD:15,provisional_review_candidates:27,duplicate_uncertainty_HOLD:1,existing_legacy_public_suppressed:7,all_HOLD:16,FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0});
 assert.equal(checkpoint.prior_public_source_count,206);
 assert.equal(checkpoint.prior_site_answer_slots,842);
});
test("legacy Mingyi first seven original TF are already PUBLIC with exact PDF SHA, stem and independent answer: must suppress without new slot",()=>{
 const norm=s=>String(s||"").replace(/\s/gu,"");
 const prior=checkpoint.records.filter(x=>x.disposition==="SUPPRESSED_EXISTING_LEGACY_PUBLIC");
 assert.equal(prior.length,7);
 for(const r of prior){
  const exact=source.records.find(x=>x.source_slot_id===r.id);
  const scienceOld=science.records.find(x=>x.source_slot_id===r.id);
  const student=legacy.blocks.find(x=>x.id===r.legacy_public_student_id);
  assert.ok(student,"missing existing student question");
  assert.equal(student.source_pdf_sha256,exact.source_pdf_sha256);
  assert.equal(norm(student.stem),norm(exact.stem_pdf_text_layer));
  assert.equal(student.answer,scienceOld.model_independent_science_answer);
  assert.equal(student.canonical_kp_id,scienceOld.frozen_direct_kp_candidate);
 }
 assert.equal(checkpoint.legacy_public_7_not_second_student_copy,true);
});
test("exact27 original source and native real BBox evidence inherited, all science/KP are only proposed pending exact operator",()=>{
 assert.equal(candidate.records.length,27);
 assert.equal(candidate.operator_explicit_exact_cohort_approval,"PENDING");
 assert.equal(candidate.source_question_content_cannot_be_published_before_operator_scope_gate,true);
 assert.deepEqual(candidate.counts.current_27_proposed,27);
 assert.equal(candidate.counts.formal_science_kp_approved_new,0);
 assert.equal(candidate.counts.admission_ready_new,0);
 assert.equal(candidate.counts.published_new,0);
 assert.deepEqual(candidate.records.map(r=>r.source_id),checkpoint.records.filter(r=>r.disposition==="CANDIDATE_NEEDS_OPERATOR_AND_DEDUP").map(r=>r.id));
 for(const row of candidate.records){
  const text=source.records.find(x=>x.source_slot_id===row.source_id);
  const bbox=geometry.source_marker_records.find(x=>x.original_source_slot_id===row.source_id);
  const model=science.records.find(x=>x.source_slot_id===row.source_id);
  assert.equal(row.original_school_PDF_SHA256,text.source_pdf_sha256);
  assert.equal(row.original_pdf_page,bbox.pdf_page_1_based);
  assert.deepEqual(row.original_answer_BBox,bbox.pdf_bbox_pts_top_left);
  assert.equal(row.original_stem_exact,text.stem_pdf_text_layer);
  assert.deepEqual(row.original_options_exact,text.options_from_pdf_text_layer);
  assert.equal(row.accepted_science_answer_proposal,model.model_independent_science_answer);
  assert.equal(row.direct_frozen_113KP_candidate,model.frozen_direct_kp_candidate);
  assert.equal(model.route,"DIRECT");
  assert.equal(text.figure_or_diagram_dependency,false);
  assert.equal(row.operator_final_exact_question_approval,false);
 }
});
test("near-identical Anhe-Yongan same-batch plant question is HOLD, seven legacy source questions not counted as public additions",()=>{
 const potential=checkpoint.records.find(x=>x.id==="SCI_G04_S1_113_MID_009|S2|MC|15");
 assert.equal(potential.disposition,"HOLD_DUPLICATE_EVIDENCE");
 assert.ok(!candidate.records.some(x=>x.source_id===potential.id));
 assert.ok(!candidate.records.some(x=>x.source_id==="SCI_G04_S1_113_MID_010|S1|TF|1"));
 assert.equal(candidate.all_114_active_bank_dedup_gate_still_needed,true);
});
