import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const src=get("data/review/p12-g04s1-114-nanyi-chongde-final-65-source-kp-first-v1.json");
const prev=get("data/review/p12-g04s1-114-all25-kp-first-progress-v7.json");
const curr=get("data/review/p12-g04s1-114-all25-kp-first-progress-v8.json");
const authority=get("site/data/authority/science-g03-g04-selector-v2.json");
test("Nanyi Chongde original FINAL exactly accounts for 65 response slots and 100 printed score points",()=>{
 assert.equal(src.source_pdf_pages,2);
 assert.match(src.source_original_pdf_sha256,/^[a-f0-9]{64}$/);
 assert.equal(src.items.length,65);
 assert.equal(new Set(src.items.map(x=>x.source_slot_id)).size,65);
 assert.deepEqual(src.source_sections.map(x=>x.positions),[8,11,46]);
 assert.deepEqual(src.source_sections.map(x=>x.score),[16,22,62]);
 assert.equal(src.items.reduce((a,x)=>a+x.printed_score_points,0),100);
 assert.deepEqual(src.third_section_group_positions,{G01:6,G02:3,G03:2,G04:4,G05:3,G06:4,G07:3,G08:3,G09:5,G10:3,G11:2,G12:4,G13:4});
 assert.equal(src.source_score_to_position_unverified_points,0);
 assert.equal(src.source_score_to_position_weight_parity_confirmed,true);
});
test("KP first original source keeps matches regardless of printed FINAL and captures all evidence gates",()=>{
 const allowed=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allowed.size,45);
 const keys=["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"];
 assert.deepEqual(keys.map(k=>src.items.filter(x=>x.kp_first_decision===k).length),[28,14,5,18]);
 for(const i of src.items){assert.ok(i.matched_canonical_kp_ids.every(k=>allowed.has(k)));if(keys.slice(0,2).includes(i.kp_first_decision))assert.ok(i.matched_canonical_kp_ids.length);assert.equal(i.public_release_approved,false);assert.equal(i.science_answer_verified,false);assert.equal(i.original_teacher_key_authenticated,false);}
 assert.equal(src.source_teacher_key_authenticated,false);
 assert.equal(src.public_admission_approved,false);
});
test("v8 adds exactly 65 mapped source slots while live bank unchanged",()=>{
 assert.equal(prev.all_identified_source_answer_positions_count,392);
 assert.equal(curr.all_identified_source_answer_positions_count,457);
 assert.equal(curr.textually_identifiable_answer_positions_count,451);
 assert.equal(curr.original_source_visual_only_positions_identified,6);
 assert.equal(curr.papers_with_all_textually_identifiable_answer_positions_mapped,6);
 assert.equal(curr.other_papers_with_source_outline_only,19);
 assert.equal(curr.source_file_sha_complete_count,22);
 assert.equal(Object.values(curr.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),457);
 assert.equal(curr.provisional_matched_kp_positions,300);
 assert.deepEqual(Object.keys(src.preliminary_kp_decisions).map(k=>curr.source_text_position_kp_decisions[k]-prev.source_text_position_kp_decisions[k]),Object.values(src.preliminary_kp_decisions));
 assert.equal(curr.public_question_positions_added,0);
 assert.equal(curr.live_exam_answer_slots_still,251);
 assert.equal(curr.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
