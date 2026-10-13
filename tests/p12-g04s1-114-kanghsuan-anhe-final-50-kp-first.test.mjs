import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";const read=x=>JSON.parse(readFileSync(x,"utf8")),p="data/review/p12-g04s1-114-",src=read(p+"kanghsuan-anhe-final-50-source-kp-first-v1.json"),v13=read(p+"all25-kp-first-progress-v13.json"),v14=read(p+"all25-kp-first-progress-v14.json"),a=read("site/data/authority/science-g03-g04-selector-v2.json");
test("Anhe FINAL has 50 original slots across 15 TF, 20 MC, 13 groups and 2 reading, 100 pts",()=>{
 assert.equal(src.items.length,50);assert.equal(src.source_total_response_positions,50);
 assert.deepEqual(src.source_sections.map(z=>z.original_response_positions),[15,20,13,2]);
 assert.deepEqual(src.source_sections.map(z=>z.original_printed_score_points),[30,40,26,4]);
 assert.equal(src.items.reduce((s,z)=>s+z.original_scored_points,0),100);
 assert.equal(new Set(src.items.map(z=>z.source_slot_id)).size,50);
 assert.equal(src.source_score_to_response_position_parity_verified,true);
 assert.equal(src.items.filter(z=>z.source_section===2&&Number(z.printed_subitem)>=14&&z.source_original_pdf_page===2).length,7);
});
test("Canonical 45 KP match and all source figure + science answer gates remain closed",()=>{
 const ks=new Set(a.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));assert.equal(ks.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>src.items.filter(z=>z.kp_first_decision===k).length),[37,7,4,2]);
 for(const z of src.items){assert.ok(z.matched_canonical_kp_ids.every(k=>ks.has(k)));assert.equal(z.science_answer_verified,false);assert.equal(z.public_release_approved,false);}
 assert.equal(src.operator_public_admission_approved,false);
});
test("Additive V14 counts source 793, mapped 12/25 and leaves website unchanged",()=>{
 assert.equal(v13.all_identified_source_answer_positions_count,743);assert.equal(v14.all_identified_source_answer_positions_count,793);
 assert.equal(v14.provisional_matched_kp_positions,611);
 assert.equal(v14.papers_with_all_textually_identifiable_answer_positions_mapped,12);
 assert.equal(v14.other_papers_with_source_outline_only,13);
 assert.equal(v14.textually_identifiable_answer_positions_count,787);
 assert.equal(v14.original_source_visual_only_positions_identified,6);
 assert.equal(Object.values(v14.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),793);
 assert.equal(v14.source_file_sha_complete_count,22);
 assert.equal(v14.live_exam_answer_slots_still,251);assert.equal(v14.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
