import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/p12-g04s1-113-all29-stage2-section-slot-reconciliation-v1.json");
const jiande=read("data/review/p12-g04s1-113-jiande-mid64-provisional-answer-kp48-v1.json");
const prev=read("data/review/p12-g04s1-113-all29-kp48-source-firstpass-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
test("113 source 29 exact PDF hashes and source IDs retained; current Kang Hsuan 48 KP unchanged",()=>{
 assert.equal(review.records.length,29);
 assert.equal(new Set(review.records.map(x=>x.source_id)).size,29);
 for(const x of review.records){
  const pre=prev.original_source_records.find(y=>y.source_id===x.source_id);
  assert.ok(pre);
  assert.equal(x.source_pdf_sha256,pre.original_pdf_sha256);
  assert.equal(x.pdf_pages,pre.original_pdf_page_count);
  assert.equal(x.scan_only,pre.scan_only_pdf);
  assert.equal(x.site_admission_eligible_now,false);
 }
 assert.equal(authority.schema_version,"SCIENCE_G03_G04_PUBLIC_SELECTOR_V3");
 assert.deepEqual(authority.units.filter(x=>x.grade===4&&x.semester===1).map(x=>x.knowledge_points.length),[12,14,10,12]);
 assert.equal(review.no_student_public_bank_changes,true);
 assert.equal(review.existing_public_636_answers_remain_unchanged,true);
});
test("Five source scan-only original exam papers visually reviewed by printed response section, no zero-text dropout",()=>{
 const s=review.records.filter(x=>x.scan_only);
 assert.equal(s.length,5);
 assert.deepEqual(s.map(x=>x.original_visual_section_answer_positions).sort((a,b)=>a-b),[50,50,50,50,62]);
 assert.equal(s.reduce((sum,x)=>sum+x.original_visual_section_answer_positions,0),262);
 for(const x of s){
  assert.ok(Array.isArray(x.visually_counted_source_sections));
  assert.equal(x.visually_counted_source_sections.reduce((n,a)=>n+a.answer_positions,0),x.original_visual_section_answer_positions);
  assert.equal(x.direct_current48kp_and_unique_science_completed,false);
 }
});
test("Native 建德 source exact 64 = 10 TF + 10 MC + 7 circle + 7 matching + 8 figure + 22 group checkbox",()=>{
 const x=review.records.find(x=>x.source_id===jiande.source_paper_id);
 assert.deepEqual(x.visually_counted_source_sections.map(x=>x.answer_positions),[10,10,7,7,8,22]);
 assert.equal(x.original_visual_section_answer_positions,64);
 assert.equal(jiande.records.length,64);
 assert.equal(new Set(jiande.records.map(x=>x.original_source_slot_id)).size,64);
 const ids=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
 for(const a of jiande.records){
  if(a.provisional_direct_48kp_id) assert.ok(ids.has(a.provisional_direct_48kp_id),a.original_source_slot_id);
  assert.equal(a.public_student_admission,false);
  assert.equal(a.source_geometry_for_answer_marker_complete,false);
 }
 assert.equal(jiande.records.filter(x=>x.provisional_science_answer!==null).length,54);
 assert.equal(jiande.records.filter(x=>x.provisional_science_answer===null).length,10);
 assert.equal(jiande.confirmed_student_bank_admissions,0);
});
test("Original section-level native reconstruction includes Taozijiao100 Shihu50 Lushang50",()=>{
  const ids=["SCI_G04_S1_113_MID_012","SCI_G04_S1_113_MID_013","SCI_G04_S1_113_MID_014"];
  const rows=ids.map(id=>review.records.find(x=>x.source_id===id));
  assert.deepEqual(rows.map(x=>x.original_visual_section_answer_positions),[100,50,50]);
  assert.deepEqual(rows.map(x=>x.visually_counted_source_sections.length),[16,7,9]);
  assert.equal(rows.reduce((n,x)=>n+x.visually_counted_source_sections.reduce((m,s)=>m+s.answer_positions,0),0),200);
  assert.ok(rows.every(x=>x.direct_current48kp_and_unique_science_completed===false));
});
test("Four complex native paper subsection counters reconciled, no source/SciKP publication assumption",()=>{
 const ids=["SCI_G04_S1_113_FINAL_007","SCI_G04_S1_113_FINAL_008","SCI_G04_S1_113_FINAL_004","SCI_G04_S1_113_MID_017"];
 const expected=[54,92,81,68];
 const rows=ids.map(id=>review.records.find(x=>x.source_id===id));
 assert.deepEqual(rows.map(x=>x.original_visual_section_answer_positions),expected);
 assert.ok(rows.every(x=>x.section_count_status==="NATIVE_SOURCE_TEXT_PRINTED_SUBRESPONSE_INVENTORY_RECONCILED__ORIGINAL_PAGE_GEOMETRY_PENDING"));
 assert.ok(rows.every(x=>x.site_admission_eligible_now===false));
 assert.equal(rows.reduce((n,r)=>n+r.original_visual_section_answer_positions,0),295);
});
test("Remaining16 header quantities are speculative and must never satisfy 29-paper source exact certification",()=>{
 const guesses=read("data/review/p12-g04s1-113-remaining16-header-estimate-only-v1.json");
 assert.equal(guesses.remaining_original_source_papers,16);
 assert.equal(guesses.records.length,16);
 assert.equal(guesses.unverified_estimated_source_answer_positions,929);
 assert.equal(guesses.combined_numerical_planning_estimate_all29,1750);
 assert.ok(guesses.records.every(x=>x.exact_printed_subanswer_inventory_complete===false&&x.public_admission===false));
 for(const x of guesses.records){
   const current=review.records.find(r=>r.source_id===x.source_id);
   assert.ok(current);
   assert.equal(current.original_visual_section_answer_positions,null);
   assert.equal(current.source_pdf_sha256,x.pdf_sha256);
 }
});
test("All remaining 16 original PDF section scoring totals reconcile to 100 without certifying original answer slots",()=>{
 const score=read("data/review/p12-g04s1-113-remaining16-printed-score-proof-v2.json");
 const prior=read("data/review/p12-g04s1-113-remaining16-header-estimate-only-v1.json");
 assert.equal(score.paper_count,16);
 assert.equal(score.records.length,16);
 assert.equal(new Set(score.records.map(x=>x.source_id)).size,16);
 assert.equal(score.original_printed_score_total_verified_each_100,true);
 assert.equal(score.previous_unverified_score_derived_estimate,929);
 assert.equal(score.updated_unverified_score_derived_estimate,934);
 assert.equal(prior.unverified_estimated_source_answer_positions,929);
 assert.equal(score.estimated_correction_delta,5);
 assert.equal(score.all29_response_positions_planning_estimate_not_actual_exact,1755);
 let inferred=0;
 for(const x of score.records){
  const old=review.records.find(r=>r.source_id===x.source_id);
  assert.ok(old,x.source_id);
  assert.equal(old.source_pdf_sha256,x.source_original_pdf_sha256);
  assert.equal(old.original_visual_section_answer_positions,null,"do not misrepresent header estimate as exact verified positions");
  assert.equal(x.original_section_score_proofs.reduce((n,s)=>n+s.printed_score_points,0),100);
  assert.equal(x.original_section_score_proofs.reduce((n,s)=>n+s.scoring_derived_response_count_not_final,0),x.scoring_derived_response_count_not_final);
  assert.ok(x.original_section_score_proofs.every(s=>s.actual_marker_bbox_certified===false));
  assert.equal(x.student_bank_admission_permitted,false);
  assert.equal(x.cross_year_113_114_dedup_complete,false);
  inferred+=x.scoring_derived_response_count_not_final;
 }
 assert.equal(inferred,934);
 const wende=score.records.find(r=>r.source_id==="SCI_G04_S1_113_MID_001");
 assert.equal(wende.scoring_derived_response_count_not_final,55);
});
test("Remaining16 corrected scoring proof is anchored in original SHA and remains strictly non-release",()=>{
 const score=read("data/review/p12-g04s1-113-remaining16-printed-score-proof-v2.json");
 assert.equal(score.paper_count,16);
 assert.equal(score.original_printed_score_total_verified_each_100,true);
 assert.equal(score.updated_unverified_score_derived_estimate,934);
 assert.equal(score.previous_unverified_score_derived_estimate,929);
 assert.equal(score.estimated_correction_delta,5);
 assert.equal(score.all29_response_positions_planning_estimate_not_actual_exact,1755);
 const pending=new Set(review.records.filter(r=>r.original_visual_section_answer_positions===null).map(r=>r.source_id));
 assert.equal(pending.size,16);
 assert.equal(new Set(score.records.map(r=>r.source_id)).size,16);
 let positions=0;
 for(const r of score.records){
  const baseline=review.records.find(x=>x.source_id===r.source_id);
  assert.ok(baseline);
  assert.ok(pending.has(r.source_id));
  assert.equal(r.source_original_pdf_sha256,baseline.source_pdf_sha256);
  assert.equal(r.printed_scoring_total_points,100);
  assert.equal(r.original_section_score_proofs.reduce((s,x)=>s+x.printed_score_points,0),100);
  assert.equal(r.original_section_score_proofs.reduce((s,x)=>s+x.scoring_derived_response_count_not_final,0),r.scoring_derived_response_count_not_final);
  assert.equal(r.per_mark_original_pdf_bbox_confirmed,false);
  assert.equal(r.student_bank_admission_permitted,false);
  positions+=r.scoring_derived_response_count_not_final;
 }
 assert.equal(positions,934);
 assert.equal(score.records.find(x=>x.source_id==="SCI_G04_S1_113_MID_001").scoring_derived_response_count_not_final,55);
});
test("550 native source text-phrase positions must not be confused with 934 real student answer-marker coordinates",()=>{
 const anchor=read("data/review/p12-g04s1-113-remaining16-pdf-native-text-firstphrase-geometry-qa-v1.json");
 assert.equal(anchor.native_pdf_text_candidate_starts_examined,550);
 assert.equal(anchor.single_matching_source_phrase_bbox,542);
 assert.equal(anchor.source_phrase_bbox_unlocatable,8);
 assert.equal(anchor.single_matching_source_phrase_bbox+anchor.source_phrase_bbox_unlocatable,550);
 assert.equal(anchor.source_start_counts_by_exam.length,16);
 assert.equal(anchor.source_start_counts_by_exam.reduce((s,x)=>s+x.native_candidate_starts,0),550);
 assert.equal(anchor.unlocated_native_anchor_ids.length,8);
 assert.equal(anchor.exact_student_original_answer_markers_verified_by_this_stage,0);
 assert.equal(anchor.fully_source_verified_exact_answer_slots_this_stage,0);
 assert.equal(anchor.public_student_answer_slots_unchanged,636);
 assert.equal(anchor.all_113_114_semantic_dedup_still_pending,true);
});
test("Wende original PDF page1 all 15 true-false and 12 multiple-choice printed answer glyph bboxes, no source-marker inferred from text phrase",()=>{
 const w=read("data/review/p12-g04s1-113-wende-mid27-real-original-answer-glyph-bbox-v1.json");
 assert.equal(w.source_pdf_sha256,review.records.find(x=>x.source_id===w.source_id).source_pdf_sha256);
 assert.equal(w.actual_source_answer_marker_glyph_bboxes_count,27);
 assert.equal(w.original_tf_printed_marker_count,15);
 assert.equal(w.original_mc_printed_marker_count,12);
 assert.equal(w.position_records.length,27);
 assert.equal(new Set(w.position_records.map(x=>x.source_slot_id)).size,27);
 assert.ok(w.position_records.every(x=>{
  const [x1,y1,x2,y2]=x.printed_answer_marker_parenthesis_pdf_bbox_pts_top_left;
  return x.source_page_pdf_1_based===1 && x1>=0 && y1>=0 && x2>x1 && y2>y1 && x.full_printed_source_qa_complete===false;
 }));
 assert.equal(w.position_records.filter(x=>x.original_question_type==="tf").length,15);
 assert.equal(w.position_records.filter(x=>x.original_question_type==="mcq").length,12);
 assert.equal(w.page2_grouped_response_positions_scoring_estimate,28);
 assert.equal(w.all55_exam_original_response_positions_exactly_verified,false);
 assert.equal(w.independent_science_answers_certified,false);
 assert.equal(w.operator_release_admission_eligible_count,0);
});
test("One-batch 29 remaining source work must not misstate 771 candidate starts or the 636 public baseline",()=>{
 assert.equal(review.original_response_positions_section_reconciled,821);
 assert.equal(review.section_reconciled_source_papers,13);
 assert.equal(review.remaining_native_source_papers_to_exactly_count,16);
 assert.equal(review.all29_exact_source_position_closeout,false);
 assert.equal(review.all29_science_unique_answer_and_direct_kp_certified,false);
 assert.equal(review.cross_year_114_exact_duplicate_fully_checked,false);
 assert.equal(review.legacy_native_text_question_starts_not_answer_slots,771);
});
