import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";
const r=x=>JSON.parse(readFileSync(x,"utf8")),p="data/review/p12-g04s1-114-";
const x=r(p+"kanghsuan-dadun-mid-62-source-kp-first-v1.json"),prior=r(p+"all25-kp-first-progress-v8.json"),now=r(p+"all25-kp-first-progress-v9.json"),canonical=r("site/data/authority/science-g03-g04-selector-v2.json");
test("D a D u n original MID scoring exactly 16+32+37+15=100 with 62 response slots",()=>{
 assert.equal(x.items.length,62);
 assert.equal(x.source_original_answer_positions,62);
 assert.deepEqual(x.source_section_positions_and_points.map(z=>z.positions),[8,16,23,15]);
 assert.deepEqual(x.source_section_positions_and_points.map(z=>z.score),[16,32,37,15]);
 assert.equal(x.items.reduce((s,z)=>s+z.original_scored_points,0),100);
 assert.equal(new Set(x.items.map(z=>z.source_slot_id)).size,62);
 assert.equal(x.score_to_response_position_parity_verified,true);
 assert.equal(x.original_pdf_page_count,2);
});
test("All mapped KPs constrained to frozen 45, no science-answer or public approval",()=>{
 const allow=new Set(canonical.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allow.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>x.items.filter(i=>i.kp_first_decision===k).length),[47,11,4,0]);
 for(const i of x.items){assert.ok(i.matched_canonical_kp_ids.every(k=>allow.has(k)));assert.equal(i.independent_science_answer_verified,false);assert.equal(i.teacher_key_authenticated,false);assert.equal(i.public_release_approved,false);}
 assert.equal(x.kp_associated_positions,58);
 assert.equal(x.public_admission_approved,false);
});
test("Additive V9 increases source to 519 with seven prelim mapped, live web still frozen",()=>{
 assert.equal(prior.all_identified_source_answer_positions_count,457);
 assert.equal(now.all_identified_source_answer_positions_count,519);
 assert.equal(now.textually_identifiable_answer_positions_count,513);
 assert.equal(now.original_source_visual_only_positions_identified,6);
 assert.equal(now.provisional_matched_kp_positions,358);
 assert.equal(now.papers_with_all_textually_identifiable_answer_positions_mapped,7);
 assert.equal(now.other_papers_with_source_outline_only,18);
 assert.equal(Object.values(now.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),519);
 assert.equal(now.source_file_sha_complete_count,22);
 assert.equal(now.public_question_positions_added,0);
 assert.equal(now.live_exam_answer_slots_still,251);
 assert.equal(now.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
