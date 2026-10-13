import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const dir="data/review/p12-g04s1-114-",file=read(dir+"hanlin-dahua-mid-50-source-kp-first-v1.json"),prev=read(dir+"all25-kp-first-progress-v14.json"),cur=read(dir+"all25-kp-first-progress-v15.json"),authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("Dahua original four sections have 50 source answer slots at exactly 100 weighted printed points",()=>{
 assert.equal(file.items.length,50);
 assert.deepEqual(file.section_positions_and_scores.map(s=>s.positions),[10,14,21,5]);
 assert.deepEqual(file.section_positions_and_scores.map(s=>s.points),[20,28,42,10]);
 assert.deepEqual(file.section3_source_group_subitem_counts,{G01:5,G02:3,G03:1,G04:4,G05:8});
 assert.equal(file.items.reduce((a,b)=>a+b.source_score_points,0),100);
 assert.equal(new Set(file.items.map(x=>x.source_slot_id)).size,50);
 assert.equal(file.original_score_weight_parity_verified,true);
 assert.equal(file.source_pdf_pages,2);
});
test("KP is restricted to approved 45; astronomy archive and fish labels remain source-only",()=>{
 const allowed=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(allowed.size,45);
 assert.deepEqual(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD","REVIEW_KP_UNCERTAIN","NONMATCH_G04S1_KP_ARCHIVE"].map(k=>file.items.filter(x=>x.kp_first_decision===k).length),[8,16,9,17]);
 assert.equal(file.items.filter(x=>x.source_section===3&&x.source_group==="G01"&&x.kp_first_decision==="NONMATCH_G04S1_KP_ARCHIVE").length,5);
 const fish=file.items.filter(x=>x.source_group==="G05"&&x.source_section===3);
 assert.equal(fish.length,8);
 assert.ok(fish.every(x=>x.review_note.includes("尚未")||x.review_note.includes("獨立")));
 for(const item of file.items){assert.ok(item.matched_canonical_kp_ids.every(k=>allowed.has(k)));assert.equal(item.operator_public_admission_approved,false);assert.equal(item.independent_science_answer_certified,false)}
});
test("V15 readback adds exactly 50 source positions, live bank remains frozen",()=>{
 assert.equal(prev.all_identified_source_answer_positions_count,793);
 assert.equal(cur.all_identified_source_answer_positions_count,843);
 assert.equal(cur.textually_identifiable_answer_positions_count,837);
 assert.equal(cur.original_source_visual_only_positions_identified,6);
 assert.equal(cur.papers_with_all_textually_identifiable_answer_positions_mapped,13);
 assert.equal(cur.other_papers_with_source_outline_only,12);
 assert.equal(cur.provisional_matched_kp_positions,635);
 assert.equal(Object.values(cur.source_text_position_kp_decisions).reduce((a,b)=>a+b,0),843);
 assert.equal(cur.source_file_sha_complete_count,22);
 assert.equal(cur.live_exam_answer_slots_still,251);
 assert.equal(cur.g04s1_live_answer_slots_still,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
