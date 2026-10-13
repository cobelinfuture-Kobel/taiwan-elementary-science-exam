import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const x=read("data/review/p12-g04s1-114-nanyi-dongguang-final-kp-first-text-map-v1.json");
const s=read("data/review/p12-g04s1-114-all25-kp-first-progress-v4.json");
const prev=read("data/review/p12-g04s1-114-all25-kp-first-progress-v3.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("Dongguang: 68 traceable positions with six score points unresolved, not fabricated",()=>{
 assert.equal(x.text_identifiable_response_positions,68);
 assert.equal(x.items.length,68);
 assert.equal(new Set(x.items.map(i=>i.source_slot_id)).size,68);
 assert.deepEqual([1,2,3,4,5].map(n=>x.items.filter(i=>i.original_section===n).length),[10,10,32,8,8]);
 assert.equal(x.source_figure_group_G02_unverified_printed_score_points,6);
 assert.equal(x.total_original_response_positions,"UNKNOWN__SOURCE_VISUAL_READBACK_REQUIRED");
 assert.equal(x.source_score_to_position_parity_confirmed,false);
 assert.equal(x.source_original_sections.reduce((a,b)=>a+b.score_points,0),100);
 assert.equal(x.source_original_sections[3].text_positions,8);
 assert.equal(x.source_original_sections[3].score_points,6);
 assert.ok(x.items.every(i=>!i.science_answer_verified&&!i.source_image_verified&&!i.original_teacher_answer_key_authenticated&&!i.public_release_approved));
});
test("KP-first scope constrained to the original four upper canonical 45 KP",()=>{
 const allowed=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allowed.size,45);
 const counts={KP_MATCH_CANDIDATE:0,KP_MATCH_SOURCE_EVIDENCE_HOLD:0,REVIEW_KP_UNCERTAIN:0,NONMATCH_G04S1_KP_ARCHIVE:0};
 for(const item of x.items){counts[item.kp_first_decision]++;assert.ok(item.matched_canonical_kp_ids.every(k=>allowed.has(k)));if(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD"].includes(item.kp_first_decision))assert.ok(item.matched_canonical_kp_ids.length>0);if(item.kp_first_decision==="NONMATCH_G04S1_KP_ARCHIVE")assert.equal(item.matched_canonical_kp_ids.length,0);if(item.source_image_required)assert.equal(item.kp_first_decision,"KP_MATCH_SOURCE_EVIDENCE_HOLD")}
 assert.deepEqual(counts,x.preliminary_kp_decisions);
 assert.equal(x.items.filter(i=>i.original_section===3&&i.source_image_required).length,30);
});
test("v4 progression is additive, v3 254 remains frozen, no website admission",()=>{
 assert.equal(prev.textually_identifiable_answer_positions_count,254);
 assert.equal(s.textually_identifiable_answer_positions_count,322);
 assert.equal(s.papers_with_all_textually_identifiable_answer_positions_mapped,4);
 assert.equal(s.other_papers_with_source_outline_only,21);
 assert.equal(s.source_score_points_not_proven_as_distinct_questions,10);
 assert.equal(s.provisional_matched_kp_positions,s.source_text_position_kp_decisions.KP_MATCH_CANDIDATE+s.source_text_position_kp_decisions.KP_MATCH_SOURCE_EVIDENCE_HOLD);
 assert.deepEqual(Object.fromEntries(Object.keys(x.preliminary_kp_decisions).map(k=>[k,s.source_text_position_kp_decisions[k]-prev.source_text_position_kp_decisions[k]])),x.preliminary_kp_decisions);
 assert.equal(s.source_papers.length,25);
 assert.equal(s.source_papers.filter(x=>x.original_source_position_text_map_ref).length,4);
 assert.equal(s.public_question_positions_added,0);
 assert.equal(s.live_exam_answer_slots_still,251);
 assert.equal(s.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
