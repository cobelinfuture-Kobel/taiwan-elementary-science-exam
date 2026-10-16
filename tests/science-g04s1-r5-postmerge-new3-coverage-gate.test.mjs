import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/science-g04s1-r5-postmerge-new3-kp-coverage-sourcegate-v1.json");
const published=[
 ...read("site/data/question-bank/p12-e01-heshun-mid15-public-v1.json").blocks,
 ...read("site/data/question-bank/p12-e01-post49-source2-public-v1.json").blocks
];
const newIds=["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"];
test("R5 coverage screens frozen 25 papers and all 717 archived source slots without claiming automatic admission",()=>{
 assert.equal(review.review_scope.source_archive_papers_screened,25);
 assert.equal(review.review_scope.source_archive_answer_positions_screened,717);
 assert.equal(review.current_public_source_positions,629);
 assert.equal(review.candidates.length,12);
 assert.equal(new Set(review.candidates.map(x=>x.source_slot_id)).size,12);
 assert.equal(review.admission_gate.pending_nonpublished_candidates,10);
 assert.equal(review.admission_gate.new_independent_public_admission_approved,0);
 assert.equal(review.admission_gate.remap_existing_published,2);
 assert.equal(review.student_question_count_increment,0);
 assert.deepEqual(review.kp_coverage.map(x=>x.canonical_kp_id),newIds);
 assert.deepEqual(review.kp_coverage.map(x=>x.direct_published_source_slots),[1,1,0]);
});
test("R5 each source candidate keeps its original PDF, answer position, science and traceability",()=>{
 for(const row of review.candidates){
  const doc=read(row.source_ref);
  const orig=doc.original_question_records.find(x=>x.source_id===row.source_slot_id);
  assert.ok(orig,row.source_slot_id);
  assert.equal(doc.original_pdf_sha256,row.source_pdf_sha256,row.source_slot_id);
  assert.equal(row.source_page,orig.answer_marker_pdf_page??row.source_page);
  if(row.source_bbox)assert.deepEqual(row.source_bbox,orig.answer_marker_pdf_bbox_pts_top_left,row.source_slot_id);
  assert.ok(row.new_kps.length>=1&&row.new_kps.every(x=>newIds.includes(x)));
  assert.ok(row.provisional_answer);
  assert.equal(orig.site_question_bank_admitted,false,"Frozen source archive snapshot retained as originally archived");
 }
});
test("R5 published pair is already admitted and its source IDs must not be released a second time",()=>{
 const publishedRows=review.candidates.filter(x=>x.status.startsWith("PUBLISHED_SOURCE"));
 assert.equal(publishedRows.length,2);
 for(const x of publishedRows){
  const bank=published.find(b=>b.source_slot_id===x.source_slot_id);
  assert.ok(bank);
  assert.equal(bank.source_pdf_sha256,x.source_pdf_sha256);
  assert.equal(bank.answer,x.provisional_answer);
  assert.equal(bank.operator_publication_approval,true);
  assert.equal(bank.original_teacher_answer_key_authenticated,false);
  assert.deepEqual(bank.source_pdf_bbox_pts_top_left,x.source_bbox);
  assert.equal(bank.canonical_kp_id,x.old_kps[0]);
  assert.ok(!newIds.includes(bank.canonical_kp_id),"Existing certified historical primary KP stays frozen");
 }
});
test("R5 has semantic-overlap but no automatically published new slot",()=>{
 const items=review.candidates.filter(x=>!x.status.startsWith("PUBLISHED_SOURCE"));
 assert.equal(items.length,10);
 assert.ok(items.every(x=>x.status.startsWith("HOLD")));
 assert.equal(review.duplicate_policy.similarity_pairs.length,1);
 assert.equal(review.policies.question_bank_auto_admission_forbidden,true);
 assert.equal(review.policies.already_published_question_never_duplicate,true);
});
