import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from "node:fs";import{buildMaster}from "../tools/p12-master-progress.mjs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const p="data/review/p12-g04s1-114-";
const manifest=get(p+"kanghsuan-minquan-mid-75-source-manifest-v1.json");
const parts=manifest.source_records_parts.map(get);
const v11=get(p+"all25-kp-first-progress-v11.json"),v12=get(p+"all25-kp-first-progress-v12.json");
const authority=get("site/data/authority/science-g03-g04-selector-v2.json");
test("Minquan original 75 distinct response boxes and exact printed score 100",()=>{
 assert.deepEqual(parts.map(z=>z.source_answer_positions),[25,18,32]);
 const items=parts.flatMap(z=>z.items);
 assert.equal(items.length,75);
 assert.equal(new Set(items.map(z=>z.source_slot_id)).size,75);
 assert.equal(items.reduce((s,z)=>s+z.printed_score_points,0),100);
 assert.deepEqual(manifest.source_section_score_to_position_counts.map(x=>x.source_positions),[15,10,11,7,27,5]);
 assert.deepEqual(manifest.source_section_score_to_position_counts.map(x=>x.score_points),[30,20,11,7,27,5]);
 assert.equal(manifest.source_score_to_answer_position_parity_verified,true);
 assert.equal(manifest.operator_public_admission_approved,false);
});
test("All 75 positions retained by canonical KP first source authority, no answer/public certification",()=>{
 const ids=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(ids.size,45);
 const entries=parts.flatMap(z=>z.items);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>entries.filter(z=>z.kp_first_decision===k).length),[58,11,6,0]);
 for(const z of entries){assert.ok(z.matched_canonical_kp_ids.every(k=>ids.has(k)));assert.equal(z.public_release_approved,false);}
 assert.equal(manifest.kp_associated_positions,69);
});
test("V12 683 identified, 10 mapped source papers, 15 remaining and public bank fixed",()=>{
 assert.equal(v11.all_identified_source_answer_positions_count,608);
 assert.equal(v12.all_identified_source_answer_positions_count,683);
 assert.equal(v12.textually_identifiable_answer_positions_count,677);
 assert.equal(v12.original_source_visual_only_positions_identified,6);
 assert.equal(v12.papers_with_all_textually_identifiable_answer_positions_mapped,10);
 assert.equal(v12.other_papers_with_source_outline_only,15);
 assert.equal(v12.provisional_matched_kp_positions,509);
 assert.equal(Object.values(v12.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),683);
 assert.equal(v12.source_file_sha_complete_count,22);
 assert.equal(v12.public_question_positions_added,0);
 assert.equal(v12.live_exam_answer_slots_still,251);
 assert.equal(v12.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
