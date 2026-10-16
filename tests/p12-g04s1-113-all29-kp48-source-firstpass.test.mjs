import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const ledger=read("data/review/p12-g04s1-113-all29-kp48-source-firstpass-v1.json");
const registry=read("data/source-registry/p12-g04s1-108114-drive-discovery-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const sum=(key)=>ledger.original_source_records.reduce((s,p)=>s+p[key],0);
test("113 four-grade natural source: exact 29 registries 18 mid 11 final and same Drive identities",()=>{
  const rows=registry.entries.filter(p=>p.year===113);
  assert.equal(rows.length,29);
  assert.equal(ledger.original_source_records.length,29);
  assert.equal(new Set(ledger.original_source_records.map(x=>x.source_id)).size,29);
  for(const x of ledger.original_source_records){
    const original=rows.find(v=>v.candidate_source_id===x.source_id);
    assert.ok(original);
    assert.equal(x.source_title,original.source_title);
    assert.equal(x.drive_file_id,original.files[0].drive_file_id);
    assert.equal(x.exam_type,original.exam_type);
    assert.equal(x.publisher_from_filename,original.publisher_from_filename);
    assert.match(x.original_pdf_sha256,/^[0-9a-f]{64}$/);
    assert.equal(x.independent_science_answers_certified,false);
    assert.equal(x.final_direct_kp_approved,false);
    assert.equal(x.exact_printed_answer_slot_inventory_certified,false);
    assert.equal(x.site_admission,false);
    assert.equal(x.native_text_layer_candidate_starts,
      x.provisional_current_kp_keyword_candidates+x.provisional_other_unit_signals+
      x.mixed_current_and_other_unit_signals+x.figure_or_context_dependent_kp_signals+
      x.not_yet_directly_matched_candidates);
  }
  assert.deepEqual([ledger.source_exams_mid,ledger.source_exams_final],[18,11]);
  assert.equal(ledger.original_source_records.filter(p=>p.exam_type==="MID").length,18);
  assert.equal(ledger.original_source_records.filter(p=>p.exam_type==="FINAL").length,11);
});
test("113 actual PDF readback 72 pages, 24 native and five scan PDFs, 771 noncertified text candidate starts",()=>{
  assert.equal(sum("original_pdf_page_count"),72);
  assert.equal(sum("native_text_layer_candidate_starts"),771);
  assert.equal(ledger.original_source_records.filter(p=>p.scan_only_pdf).length,5);
  assert.equal(ledger.native_text_pdf_count,24);
  assert.equal(ledger.actual_pdf_page_count,72);
  assert.equal(ledger.candidate_not_exact_answer_slot_count,true);
  assert.equal(ledger.source_column_splits_and_group_subquestions_require_page_visual_acceptance,true);
});
test("all 113 questions use current Kang Hsuan G04-S1 48-KP scope not original publisher label",()=>{
  assert.equal(authority.schema_version,"SCIENCE_G03_G04_PUBLIC_SELECTOR_V3");
  assert.equal(authority.publisher,"康軒");
  const units=authority.units.filter(u=>u.grade===4&&u.semester===1);
  assert.deepEqual(units.map(u=>u.knowledge_points.length),[12,14,10,12]);
  assert.equal(units.reduce((s,u)=>s+u.knowledge_points.length,0),48);
  assert.equal(ledger.active_kp_count_g04s1,48);
  assert.equal(ledger.all_publishers_admitted_for_source_review,true);
  assert.deepEqual(new Set(ledger.original_source_records.map(p=>p.publisher_from_filename)),new Set(["康軒","南一","翰林"]));
});
test("keyword first pass signals are not final student admission or school teacher answer approval",()=>{
  assert.equal(ledger.provisional_candidate_tallies.possible_current_kp_content_signals,387);
  assert.equal(ledger.provisional_candidate_tallies.possible_other_unit_signals,111);
  assert.equal(ledger.provisional_candidate_tallies.mixed_cross_unit_signals,11);
  assert.equal(ledger.provisional_candidate_tallies.visual_or_context_dependent_signals,31);
  assert.equal(ledger.provisional_candidate_tallies.unresolved_without_direct_match,231);
  assert.equal(ledger.all_formally_certified_source_questions_this_stage,0);
  assert.equal(ledger.public_bank_admissions_this_stage,0);
  assert.equal(ledger.frozen_existing_public_bank_slots_unchanged,636);
  assert.equal(ledger.no_updating_114_review_or_student_bank,true);
});
