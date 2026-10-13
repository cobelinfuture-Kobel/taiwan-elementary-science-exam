import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=x=>JSON.parse(readFileSync(x,"utf8"));
const path="data/review/p12-g04s1-114-";
const s=read(path+"kanghsuan-mingyi-final-50-source-kp-first-v1.json");
const prev=read(path+"all25-kp-first-progress-v15.json");
const current=read(path+"all25-kp-first-progress-v16.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("Mingyi source identifiable 15 TF,15 MC,18 composed diagram/text,2 reading positions; two printed points held",()=>{
 assert.equal(s.items.length,50);
 assert.deepEqual(s.source_section_identified_position_scored_points.map(x=>x.position_count),[15,15,18,2]);
 assert.deepEqual(s.source_section_identified_position_scored_points.map(x=>x.provisional_accounted_score_points),[30,30,36,2]);
 assert.deepEqual(s.source_section_printed_score_totals,[30,30,38,2]);
 assert.equal(s.items.reduce((a,b)=>a+b.provisional_scored_points,0),98);
 assert.equal(s.printed_total_score,100);
 assert.equal(s.source_score_gap_points_not_proven_as_distinct_slots,2);
 assert.equal(s.source_score_position_parity_certified,false);
 assert.deepEqual(s.original_section3_source_box_counts,{G01:3,G02:1,G03:5,G04:4,G05:5});
 assert.equal(s.items.filter(i=>i.original_group==="G02"&&i.source_section===3).length,1);
 assert.equal(new Set(s.items.map(i=>i.source_slot_id)).size,50);
});
test("All initial KP claims use original frozen 45 points; science and original diagram remain held",()=>{
 const allowed=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allowed.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>s.items.filter(i=>i.kp_first_decision===k).length),[36,13,1,0]);
 for(const item of s.items){assert.ok(item.matched_canonical_kp_ids.every(k=>allowed.has(k)));assert.equal(item.independent_science_answer_verified,false);assert.equal(item.public_release_approved,false)}
 assert.equal(s.operator_public_admission_approved,false);
});
test("V16 893 response anchors with 14 papers/11 unreviewed, no website admission",()=>{
 assert.equal(prev.all_identified_source_answer_positions_count,843);
 assert.equal(current.all_identified_source_answer_positions_count,893);
 assert.equal(current.textually_identifiable_answer_positions_count,887);
 assert.equal(current.original_source_visual_only_positions_identified,6);
 assert.equal(current.provisional_matched_kp_positions,684);
 assert.equal(current.papers_with_all_textually_identifiable_answer_positions_mapped,14);
 assert.equal(current.other_papers_with_source_outline_only,11);
 assert.equal(current.source_score_points_not_proven_as_distinct_questions,14);
 assert.equal(current.unresolved_source_score_points_by_paper.SCI_G04_S1_114_FINAL_008,2);
 assert.equal(Object.values(current.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),893);
 assert.equal(current.source_file_sha_complete_count,22);
 assert.equal(current.live_exam_answer_slots_still,251);
 assert.equal(current.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
