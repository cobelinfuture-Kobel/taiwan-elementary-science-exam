import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";const r=x=>JSON.parse(readFileSync(x,"utf8")),p="data/review/p12-g04s1-114-",m=r(p+"kanghsuan-mingyi-mid-39-source-kp-first-v1.json"),a=r("site/data/authority/science-g03-g04-selector-v2.json"),v10=r(p+"all25-kp-first-progress-v10.json"),v11=r(p+"all25-kp-first-progress-v11.json");
test("Mingyi original page 2 diagrams and report reserve correct six source sections?",()=>{
 assert.equal(m.items.length,39);
 assert.deepEqual(m.source_sections.map(x=>x.original_response_positions),[12,12,5,5,5]);
 assert.deepEqual(m.source_sections.map(x=>x.scored_points),[24,36,15,15,10]);
 assert.equal(m.items.reduce((x,y)=>x+y.printed_score_points,0),100);
 assert.equal(new Set(m.items.map(x=>x.source_slot_id)).size,39);
 assert.equal(m.source_response_slot_weight_parity_verified,true);
 assert.equal(m.source_pdf_pages,2);
});
test("KP-first within 45, science/teacher-key/figure no admission",()=>{
 const ids=new Set(a.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
 assert.equal(ids.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>m.items.filter(x=>x.kp_first_decision===k).length),[25,10,4,0]);
 assert.ok(m.items.some(x=>x.original_group==="G01"&&x.source_section===5&&x.source_text_summary.includes("芮氏規模")&&x.kp_first_decision==="KP_MATCH_SOURCE_EVIDENCE_HOLD"));
 for(const x of m.items){assert.ok(x.matched_canonical_kp_ids.every(k=>ids.has(k)));assert.equal(x.science_answer_verified,false);assert.equal(x.public_release_approved,false);}
 assert.equal(m.source_science_answers_certified,false);
 assert.equal(m.operator_public_admission_approved,false);
});
test("V11 exactly 608 source slots 9 mapped and still 251 live",()=>{
 assert.equal(v10.all_identified_source_answer_positions_count,569);
 assert.equal(v11.all_identified_source_answer_positions_count,608);
 assert.equal(v11.provisional_matched_kp_positions,440);
 assert.equal(v11.textually_identifiable_answer_positions_count,602);
 assert.equal(v11.original_source_visual_only_positions_identified,6);
 assert.equal(v11.papers_with_all_textually_identifiable_answer_positions_mapped,9);
 assert.equal(v11.other_papers_with_source_outline_only,16);
 assert.equal(Object.values(v11.source_text_position_kp_decisions).reduce((s,n)=>s+n,0),608);
 assert.equal(v11.source_file_sha_complete_count,22);
 assert.equal(v11.live_exam_answer_slots_still,251);
 assert.equal(v11.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
