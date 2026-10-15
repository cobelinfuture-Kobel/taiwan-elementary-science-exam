import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {assertScorelessMetadata,stripScoringMetadata,removePrintedScoringInstructions,isScoringMetadataKey,sourceQuestionContentOnly} from "../site/assets/js/scoreless-contract.mjs";
import {validateAndConvertContextGroups} from "../site/assets/js/historical-bank-ox-v6.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const policy=read("data/governance/science-global-no-scoring-authority-v1.json");
const routes=read("data/governance/science-active-content-only-routing-v1.json");
const v25=read(routes.active_source_index);
const q=read(routes.active_review_queue);
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("Global scoreless authority covers all science grades, semesters, exam types and operator admission flows",()=>{
 assert.equal(policy.scope,"GLOBAL_ALL_GRADES_SEMESTERS_EXAMS_SOURCES_REVIEW_PRACTICE_AND_PRINTED_OUTPUT");
 assert.equal(policy.no_score_gate,true);
 assert.equal(policy.no_scoring_blockers,true);
 assert.equal(policy.no_scoring_output,true);
 assert.equal(routes.scope,"ALL_GRADES_ALL_SEMESTERS_ALL_EXAMS_AND_KP_UNITS");
 assert.equal(routes.operator_review_mode,"QUESTION_TEXT_SCIENCE_KP_DEPENDENCIES_AND_QUALITY");
 assert.equal(routes.question_selection_basis,"QUESTION_COUNT");
 assert.equal(routes.answer_evaluation_basis,"CORRECT_ANSWER_WITH_EXPLANATION");
 assert.equal(routes.historical_examination_maps_are_evidence_not_active_processing,true);
 assert.equal(q.next_execution,"P12_ALL25_B03_Science73_KP81_SourceQuestionQualityReview_NoScoring");
 assert.equal(q.per_question_required_fields.some(x=>isScoringMetadataKey(x)),false);
 assert.equal(q.source_paper_queue.length,25);
 assert.equal(q.source_exact_standalone_private_completed,717);
 assert.equal(v25.current_public_source_paper_count,25);
 assert.equal(v25.cumulative_original_source_question_occurrences,717);
 assert.equal(v25.source_position_frozen_all25_total,1623);
 assert.equal(v25.current_public_source_archive_files.length,25);
 assert.equal(v25.original_source_archive_evidence_refs.length,25);
 assert.ok(v25.current_public_source_archive_files.every(x=>x.startsWith("data/content-only/")));
 assertScorelessMetadata(v25);
 assertScorelessMetadata(q);
 assertScorelessMetadata(routes);
});
test("The 25 active source projections have zero grading metadata or printed score instructions, preserve all 717 original Source IDs and 1164 four-choice alternatives",()=>{
 const seen=new Set(); let n=0,tf=0,mc=0,choices=0;
 for(let i=0;i<v25.current_public_source_archive_files.length;i++){
  const file=v25.current_public_source_archive_files[i];
  assert.ok(existsSync(file),file);
  const x=read(file);
  const old=read(v25.original_source_archive_evidence_refs[i]);
  assert.equal(x.paper_id,old.source_paper_id);
  assert.equal(x.original_source_archive_ref,v25.original_source_archive_evidence_refs[i]);
  assert.equal(x.original_pdf_sha256,old.original_pdf_sha256);
  assert.equal(x.question_occurrences,old.original_question_records.length);
  assertScorelessMetadata(x);
  for(let j=0;j<x.original_question_records.length;j++){
   const r=x.original_question_records[j],o=old.original_question_records[j];
   assert.equal(r.source_id,o.source_id);
   assert.ok(!seen.has(r.source_id),r.source_id);seen.add(r.source_id);
   assert.equal(r.student_site_admitted,false);
   assert.equal(r.source_only,true);
   assert.ok(r.stem.trim().length>3,r.source_id);
   assert.doesNotMatch(r.stem,/每(?:個)?(?:題|格|答|小題|答案).{0,18}分|共\s*\d+\s*分|配分|得分|總分|分數|計分|評分/u,r.source_id);
   assert.deepEqual(r.options,o.full_original_options_in_order||[],r.source_id);
   if(r.question_type==="TRUE_FALSE"){tf++;assert.equal(r.options.length,0,r.source_id);}
   else if(r.question_type==="SINGLE_CHOICE"){mc++;assert.equal(r.options.length,4,r.source_id);choices+=4;}
   else assert.fail("Unexpected question type "+r.question_type+" "+r.source_id);
   n++;
  }
 }
 assert.deepEqual([n,tf,mc,choices],[717,426,291,1164]);
 assert.equal(seen.size,717);
});
test("Scoreless adapter strips scoring keys but never removes educational grade, answer choice or PDF geometric coordinates",()=>{
 const input={grade:4,academic_year:114,question_count:3,answer_slots:2,source_pdf_bbox_pts_top_left:[1,2,3,4],source_id:"SCI_TEST|S01|TF|001",score_points:3,total_score:100,manual_scoring:true,nested:{weighting:0.6,answer:"O",kp_review:"KP_REVIEW"}};
 const output=stripScoringMetadata(input);
 assert.deepEqual(output,{grade:4,academic_year:114,question_count:3,answer_slots:2,source_pdf_bbox_pts_top_left:[1,2,3,4],source_id:"SCI_TEST|S01|TF|001",nested:{answer:"O",kp_review:"KP_REVIEW"}});
 assertScorelessMetadata(output);
 assert.throws(()=>assertScorelessMetadata(input),/不允許配分欄位/);
 const stem="下列關於光的敘述（每答1分，共6分）：光照到鏡子會反射。";
 assert.equal(removePrintedScoringInstructions(stem),"下列關於光的敘述：光照到鏡子會反射。");
 assert.equal(sourceQuestionContentOnly({full_original_stem:stem,original_scored_points:2,source_id:"abc"}).full_original_stem,"下列關於光的敘述：光照到鏡子會反射。");
});
test("Drawing exercise and public Exam keep science correctness guidance without numeric marking rubric",()=>{
 const context=read("site/data/question-bank/certified-context-groups-v2.json");
 const published=validateAndConvertContextGroups(context,authority);
 const drawing=published.blocks.find(x=>x.id==="FINAL_G04_CIRCUIT_DRAW");
 assert.ok(drawing);
 assert.equal(drawing.assessment_method,"MANUAL_VISUAL_CORRECTNESS_CHECK");
 assert.ok(!("automatic_grading" in drawing));
 assert.doesNotMatch(drawing.items[0].answer_explanation,/配分|計分|每.+分|得分|總分|分數/u);
 assertScorelessMetadata(published.blocks);
 const status=read("site/data/question-bank/s3-p09-status.json");
 assert.equal(status.drawing_groups_for_visual_correctness_review,1);
 assert.equal(status.groups.filter(x=>x.manual_visual_review).length,1);
 assertScorelessMetadata(status);
 const page=readFileSync("site/exam/index.html","utf8");
 assert.match(page,/assertScorelessMetadata\(bank\.blocks\)/);
 assert.match(page,/removePrintedScoringInstructions\(q\.stem\)/);
 assert.doesNotMatch(page,/配分[:：]|總分[:：]|得分[:：]/);
});
