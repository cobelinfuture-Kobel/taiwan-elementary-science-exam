import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";
const r=x=>JSON.parse(readFileSync(x,"utf8")),p="data/review/p12-g04s1-114-",m=r(p+"kanghsuan-anhe-mid-50-source-kp-first-v1.json"),before=r(p+"all25-kp-first-progress-v9.json"),after=r(p+"all25-kp-first-progress-v10.json"),authority=r("site/data/authority/science-g03-g04-selector-v2.json");
test("Anhe first semester MID original 50 source slots + 100 score points match printed two-page PDF",()=>{
 assert.equal(m.source_answer_positions,50);assert.equal(m.items.length,50);
 assert.deepEqual(m.section_position_counts.map(x=>x.slots),[15,15,20]);
 assert.deepEqual(m.section_position_counts.map(x=>x.score_points),[30,30,40]);
 assert.equal(m.items.reduce((a,b)=>a+b.source_original_scored_points,0),100);
 assert.equal(m.score_slot_weight_parity_verified,true);
 assert.equal(new Set(m.items.map(x=>x.source_slot_id)).size,50);
 assert.deepEqual(m.group3_subgroup_counts,{G01A:4,G01B:4,G02:3,G03:3,G04:6});
});
test("Anhe original graph and KP-first scientific question boundary holds are not published",()=>{
 const k=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
 assert.equal(k.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(key=>m.items.filter(x=>x.kp_first_decision===key).length),[26,21,3,0]);
 for(const item of m.items){assert.ok(item.matched_canonical_kp_ids.every(x=>k.has(x)));assert.equal(item.science_answer_verified,false);assert.equal(item.public_release_approved,false);assert.equal(item.teacher_answer_key_authenticated,false)}
 assert.equal(m.kp_associated_source_positions,47);
 assert.equal(m.operator_public_admission_approved,false);
});
test("V10 is additive +50 to previous 519, eight prelim mapped, live bank still 251",()=>{
 assert.equal(before.all_identified_source_answer_positions_count,519);assert.equal(after.all_identified_source_answer_positions_count,569);
 assert.equal(after.textually_identifiable_answer_positions_count,563);assert.equal(after.original_source_visual_only_positions_identified,6);
 assert.equal(after.provisional_matched_kp_positions,405);
 assert.equal(after.papers_with_all_textually_identifiable_answer_positions_mapped,8);
 assert.equal(after.other_papers_with_source_outline_only,17);
 assert.equal(Object.values(after.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),569);
 assert.equal(after.source_file_sha_complete_count,22);
 assert.equal(after.public_question_positions_added,0);assert.equal(after.live_exam_answer_slots_still,251);
 assert.equal(after.g04s1_live_answer_slots_still,53);assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
