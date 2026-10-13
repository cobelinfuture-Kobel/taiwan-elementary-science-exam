import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {classifyG04S1SourcePosition} from "../tools/p12-g04s1-kp-first.mjs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const mid=read("data/review/p12-g04s1-114-nanyi-yongan-mid-kp-first-80-text-map-v2.json");
const fin=read("data/review/p12-g04s1-114-nanyi-yongan-final-kp-first-text-map-v2.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("114 Nanyi MID: all 80 printed answer positions mapped by original selectable text without public certification",()=>{
 assert.equal(mid.original_source_answer_positions,80);
 assert.equal(mid.items.length,80);
 assert.equal(mid.additional_original_source_positions_text_mapped,60);
 assert.equal(mid.total_source_positions_with_textual_descriptions,80);
 assert.equal(new Set(mid.items.map(x=>x.source_position_id)).size,80);
 assert.deepEqual(mid.source_original_section_totals,[10,10,9,13,8,7,23]);
 assert.equal(mid.full_question_science_and_diagram_acceptance,false);
 assert.equal(mid.source_teacher_answer_key_authenticated,false);
 assert.equal(mid.public_admission_approved,false);
 assert.equal(mid.preliminary_kp_decisions.KP_MATCH_CANDIDATE,43);
 assert.equal(mid.preliminary_kp_decisions.KP_MATCH_SOURCE_EVIDENCE_HOLD,9);
 assert.equal(mid.preliminary_kp_decisions.NONMATCH_G04S1_KP_ARCHIVE,25);
 assert.equal(mid.preliminary_kp_decisions.REVIEW_KP_UNCERTAIN,3);
 assert.equal(mid.items.filter(x=>x.routing_by_current_kp==="CURRENT_FINAL").length,15);
 assert.ok(mid.items.filter(x=>x.original_figure_required).every(x=>x.original_diagram_verified===false&&x.publish_approved===false));
});
test("114 Nanyi FINAL: 78 printed points are not falsely claimed as 78 verified question positions",()=>{
 assert.equal(fin.source_original_printed_score_total,78);
 assert.equal(fin.potential_original_source_answer_positions_count,74);
 assert.equal(fin.unresolved_printed_score_minus_explicit_slots,4);
 assert.equal(fin.additional_text_mapped_positions,52);
 assert.equal(fin.items.length,78);
 assert.deepEqual(fin.source_original_section_totals,[8,14,4,24,10,12,6]);
 assert.equal(new Set(fin.items.map(x=>x.source_position_id)).size,78);
 const gaps=fin.items.filter(x=>x.kp_first_decision==="SCORE_POINT_GAP_NOT_A_CERTIFIED_SOURCE_POSITION");
 assert.equal(gaps.length,4);
 assert.deepEqual(gaps.map(x=>x.source_position_id),fin.not_verified_as_source_positions);
 assert.ok(gaps.every(x=>x.source_section_number===6&&x.source_text_reviewed===false&&x.model_provisional_answer===null&&!x.publish_approved));
 assert.equal(fin.items.filter(x=>x.source_text_reviewed).length,74);
 assert.equal(fin.all_question_science_answer_and_figure_certified,false);
 assert.equal(fin.public_admission_approved,false);
});
test("114 new text mapped rows never route KP matches by the original exam period",()=>{
 const all=[...mid.items,...fin.items];
 const sourceMatched=all.filter(x=>x.matched_canonical_kp_ids.length);
 assert.ok(sourceMatched.length>50);
 for(const x of sourceMatched){
  assert.ok(x.matched_canonical_kp_ids.every(k=>/^sci_g04s1_(0[1-4])_\d{2}$/.test(k)));
  const decision=classifyG04S1SourcePosition({
   matched_canonical_kp_ids:x.matched_canonical_kp_ids,
   original_paper_exam_type:x.original_exam_type,
   original_publisher_label:"南一",
   original_paper_scope_rating:"WRONG_SCOPE",
   source_figure_missing:x.original_figure_required===true||x.figure_dependent===true
  },authority);
  assert.ok(["KP_MATCH_CANDIDATE","KP_MATCH_SOURCE_EVIDENCE_HOLD"].includes(decision.decision));
  assert.equal(decision.retain_source,true);
  assert.equal(decision.publication_allowed,false);
  assert.deepEqual(decision.new_curriculum_exam_routing,[x.routing_by_current_kp]);
 }
});
test("source title/figure/science holds do not alter existing 251 publicly released answer positions",()=>{
 assert.ok(mid.items.every(x=>x.publish_approved===false&&x.teacher_key_authenticated===false));
 assert.ok(fin.items.every(x=>x.publish_approved===false&&x.teacher_key_authenticated===false));
 const current=buildMaster();
 assert.equal(current.public_question_bank_answer_slots_current,251);
 assert.equal(current.p12_operator_published_slots,103);
});

test("negative choices about moon/sun in water-survey shared context are still U02 KP checks",()=>{
 for(const i of [2,5]){
  const x=mid.items.find(q=>q.source_section_number===4&&q.section_slot_index===i);
  assert.equal(x.previous_text_only_classification,"NONMATCH_G04S1_KP_ARCHIVE");
  assert.equal(x.kp_first_decision,"KP_MATCH_CANDIDATE");
  assert.deepEqual(x.matched_canonical_kp_ids,["sci_g04s1_02_02"]);
  assert.equal(x.model_provisional_answer,"X");
  assert.equal(x.routing_by_current_kp,"CURRENT_MID");
  assert.equal(x.publish_approved,false);
 }
});
test("all 25 PDF record progress aggregates two 114 text maps without conflating source excerpts with science certification",()=>{
 const p=read("data/review/p12-g04s1-114-all25-kp-first-progress-v2.json");
 assert.equal(p.source_pdf_file_count,25);
 assert.equal(p.original_text_readable_files,21);
 assert.equal(p.original_binary_visual_text_holds,4);
 assert.equal(p.papers_with_all_textually_identifiable_answer_positions_mapped,2);
 assert.equal(p.other_papers_with_source_outline_only,23);
 assert.equal(p.textually_identifiable_answer_positions_count,154);
 assert.equal(p.source_score_points_not_proven_as_distinct_questions,4);
 assert.equal(p.provisional_matched_kp_positions,106);
 assert.deepEqual(p.source_text_position_kp_decisions,{KP_MATCH_CANDIDATE:75,NONMATCH_G04S1_KP_ARCHIVE:34,REVIEW_KP_UNCERTAIN:14,KP_MATCH_SOURCE_EVIDENCE_HOLD:31});
 assert.equal(p.original_all_paper_item_screening_complete_count,0);
 assert.equal(p.public_question_positions_added,0);
 assert.equal(p.live_exam_answer_slots_still,251);
 assert.equal(p.g04s1_live_answer_slots_still,53);
 assert.equal(p.source_papers.length,25);
 assert.equal(p.source_papers.filter(x=>x.original_source_position_text_map_ref).length,2);
 assert.equal(p.source_papers.filter(x=>x.next_operation==="RAW_PDF_VISUAL_READBACK_BEFORE_QUESTION_EXTRACTION").length,4);
 const sourceIds=new Set(p.source_papers.map(x=>x.source_candidate_id));
 assert.equal(sourceIds.size,25);
 assert.ok(p.source_papers.every(x=>x.public_admission_approved===false&&x.kp_matching_screens_original_exam_and_publisher===false));
});
