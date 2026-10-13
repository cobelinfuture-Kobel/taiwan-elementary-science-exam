import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";const r=x=>JSON.parse(readFileSync(x,"utf8")),p="data/review/p12-g04s1-114-";const m=r(p+"kanghsuan-dongguang-mid-60-source-manifest-v1.json"),items=m.source_parts.flatMap(x=>r(x).items),v12=r(p+"all25-kp-first-progress-v12.json"),v13=r(p+"all25-kp-first-progress-v13.json"),a=r("site/data/authority/science-g03-g04-selector-v2.json");
test("3-page Dongguang original main 100 points and separately 2 bonus, 60 distinct source positions",()=>{
 assert.equal(items.length,60);assert.equal(new Set(items.map(x=>x.source_slot_id)).size,60);
 assert.deepEqual(m.sections.map(x=>x.positions),[14,12,16,15,2,1]);
 assert.deepEqual(m.sections.map(x=>x.score_points),[28,24,16,30,2,2]);
 assert.equal(m.sections.slice(0,5).reduce((n,x)=>n+x.score_points,0),100);
 assert.equal(m.main_exam_answer_positions,59);
 assert.equal(m.bonus_answer_positions,1);
 assert.equal(m.bonus_score_points,2);
 assert.equal(m.original_quake_report_star_marker_figure_pending,true);
});
test("45 KP-first authority; figure and original answer/public holds preserved",()=>{
 const ks=new Set(a.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));assert.equal(ks.size,45);
 for(const x of items){assert.ok(x.matched_canonical_kp_ids.every(k=>ks.has(k)));assert.equal(x.public_release_approved??x.operator_public_admission_approved,false);}
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>items.filter(x=>x.kp_first_decision===k).length),[49,9,2,0]);
 assert.equal(m.source_science_answers_certified,false);
 assert.equal(m.operator_public_admission_approved,false);
});
test("V13 provenance and public source counts are exactly additive",()=>{
 assert.equal(v12.all_identified_source_answer_positions_count,683);assert.equal(v13.all_identified_source_answer_positions_count,743);
 assert.equal(v13.textually_identifiable_answer_positions_count,737);assert.equal(v13.original_source_visual_only_positions_identified,6);
 assert.equal(v13.provisional_matched_kp_positions,567);assert.equal(v13.papers_with_all_textually_identifiable_answer_positions_mapped,11);assert.equal(v13.other_papers_with_source_outline_only,14);
 assert.equal(Object.values(v13.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),743);
 assert.equal(v13.source_file_sha_complete_count,22);
 assert.equal(v13.live_exam_answer_slots_still,251);assert.equal(v13.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
