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
test("One-batch 29 remaining source work must not misstate 771 candidate starts or the 636 public baseline",()=>{
 assert.equal(review.original_response_positions_section_reconciled,326);
 assert.equal(review.section_reconciled_source_papers,6);
 assert.equal(review.remaining_native_source_papers_to_exactly_count,23);
 assert.equal(review.all29_exact_source_position_closeout,false);
 assert.equal(review.all29_science_unique_answer_and_direct_kp_certified,false);
 assert.equal(review.cross_year_114_exact_duplicate_fully_checked,false);
 assert.equal(review.legacy_native_text_question_starts_not_answer_slots,771);
});
