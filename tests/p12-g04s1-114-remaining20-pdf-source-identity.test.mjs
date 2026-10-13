import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const m=get("data/review/p12-g04s1-114-remaining20-rawpdf-identity-b04-v1.json");
const s=get("data/review/p12-g04s1-114-all25-kp-first-progress-v7.json");
const before=get("data/review/p12-g04s1-114-all25-kp-first-progress-v6.json");
test("all remaining 20 raw PDFs have immutable 64-hex original sha and page identities",()=>{
 assert.equal(m.source_count,20);assert.equal(m.records.length,20);
 assert.equal(new Set(m.records.map(x=>x.source_candidate_id)).size,20);
 assert.equal(new Set(m.records.map(x=>x.exact_original_pdf_sha256)).size,20);
 assert.ok(m.records.every(x=>/^[a-f0-9]{64}$/.test(x.exact_original_pdf_sha256)));
 assert.equal(m.records.reduce((a,x)=>a+x.original_pdf_page_count,0),48);
 assert.equal(m.records.filter(x=>x.source_has_selectable_text).length,16);
 assert.equal(m.records.filter(x=>!x.source_has_selectable_text).length,4);
 assert.ok(m.records.every(x=>x.raw_source_binary_verified&&!x.all_individual_response_slots_mapped&&!x.public_admission_approved));
});
test("v7 source PDF authenticity extends prior five-paper mapping, not public items",()=>{
 assert.equal(s.source_file_sha_complete_count,22);
 assert.equal(s.raw_original_pdf_readback_remaining20_complete_count,20);
 assert.equal(s.raw_original_pdf_source_pages_remaining20,48);
 assert.equal(s.papers_with_all_textually_identifiable_answer_positions_mapped,5);
 assert.equal(s.other_papers_with_source_outline_only,20);
 assert.equal(s.all_identified_source_answer_positions_count,392);
 assert.equal(s.provisional_matched_kp_positions,258);
 assert.deepEqual(s.source_text_position_kp_decisions,before.source_text_position_kp_decisions);
 assert.equal(s.source_papers.length,25);
 for(const x of m.records){const p=s.source_papers.find(y=>y.source_candidate_id===x.source_candidate_id);assert.ok(p);assert.equal(p.source_pdf_sha256,x.exact_original_pdf_sha256);assert.equal(p.original_pdf_binary_sha_verified,true);assert.equal(p.original_pdf_page_count,x.original_pdf_page_count);assert.ok(!p.original_source_position_text_map_ref)}
 assert.equal(s.public_question_positions_added,0);
 assert.equal(s.live_exam_answer_slots_still,251);
 assert.equal(s.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
