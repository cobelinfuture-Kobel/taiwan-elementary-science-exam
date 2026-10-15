import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assertScorelessMetadata,stripScoringMetadata,removePrintedScoringInstructions,sourceQuestionContentOnly} from "../site/assets/js/scoreless-contract.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const index=read("data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json");
const queue=read("data/review/p12-standalone-all25-source-content-only-queue-v2.json");
const gov=read("data/governance/science-global-no-scoring-authority-v1.json");
const review=read("data/review/p12-all25-b03-science73-kp81-content-review-index-v1.json");
const dependencies=read("data/review/p12-all25-b03-figure-group-dependency-index-v1.json");
const sref=[1,2,3].map(n=>"data/review/p12-all25-b03-science-kp-content-review-shard0"+n+"-v1.json");
const dref=[1,2,3].map(n=>"data/review/p12-all25-b03-figure-group-dependency-shard0"+n+"-v1.json");
const shards=sref.map(read),deps=dref.map(read);
test("Global no-scoring authority is active for all grades and excludes numeric evaluation, while preserving source original PDFs separately",()=>{
 assert.equal(gov.no_score_gate,true);
 assert.equal(gov.no_scoring_blockers,true);
 assert.equal(gov.no_scoring_output,true);
 assert.equal(gov.question_quantity_tracking_allowed,true);
 assert.equal(gov.answer_page_allowed,true);
 assert.equal(index.current_public_source_archive_files.length,25);
 assert.equal(index.original_source_archive_evidence_refs.length,25);
 assert.equal(index.source_original_question_text_preserved,true);
 assert.equal(index.active_source_type,"SCORELESS_ORIGINAL_QUESTION_CONTENT");
 assert.equal(queue.per_question_science_and_kp_only,true);
 assert.equal(queue.first_pass_all25_operator_final_acceptance,false);
 assert.equal(queue.public_items_new,0);
 assert.equal(queue.next_execution,"P12_ALL25_B04_ScienceUniqueCandidateOperatorReview_KPDirectAndFloatingFamilyReview_ThenFigureSourceGroups");
});
test("Global content projection is 25 PDFs /717 original unique school occurrences without numeric scoring metadata or printed exam grade instructions",()=>{
 let count=0,tf=0,mc=0;
 const ids=new Set();
 for(let i=0;i<25;i++){
   const file=index.current_public_source_archive_files[i],a=read(file);
   assert.equal(a.schema_version,"SCIENCE_GLOBAL_CONTENT_ONLY_EXAM_SOURCE_V1");
   assert.equal(a.original_question_records.length,a.question_occurrences);
   assertScorelessMetadata(a);
   for(const row of a.original_question_records){
     assert.ok(row.source_id.startsWith(a.paper_id+"|"));
     assert.ok(!ids.has(row.source_id),row.source_id);
     ids.add(row.source_id);
     assert.ok(row.stem.trim().length>0);
     assert.equal(row.source_only,true);
     assert.equal(row.student_site_admitted,false);
     assert.ok(!/(?:配分|給分|共\s*\d+\s*分|每(?:題|格|答|小題|個答案)\s*\d+\s*分|[（(]\s*\d+\s*分\s*[）)]|得分|總分)/u.test(row.stem),row.source_id);
     assert.ok(Array.isArray(row.source_pdf_pages));
     if(row.question_type==="TRUE_FALSE"){tf++;assert.equal(row.options.length,0);}
     else {assert.equal(row.question_type,"SINGLE_CHOICE");mc++;assert.equal(row.options.length,4);}
     count++;
   }
 }
 assert.deepEqual([count,tf,mc],[717,426,291]);
 assert.equal(index.cumulative_original_source_question_occurrences,717);
 assert.equal(queue.source_exact_standalone_private_completed,717);
 assert.equal(queue.source_response_slots_unchanged,1623);
});
test("Global scoreless adapter is non-destructive to school year, grade, canonical KP, answer marker and source image locator",()=>{
 const src={grade:4,knowledge_points:[{canonical_kp_id:"sci_g04s1_02_04",title:"漂浮性植物的適應"}],original_answer_marker_pdf_bbox_or_approved_equivalent:[1,2,3,4],original_scored_points:2,grade_points:3,score:100,group:{manual_scoring:true,stem:"（每題2分，共10分）題目內容"}};
 const out=stripScoringMetadata(src);
 assert.equal(out.grade,4);
 assert.equal(out.knowledge_points[0].canonical_kp_id,"sci_g04s1_02_04");
 assert.deepEqual(out.original_answer_marker_pdf_bbox_or_approved_equivalent,[1,2,3,4]);
 assert.equal(out.original_scored_points,undefined);
 assert.equal(out.grade_points,undefined);
 assert.equal(out.score,undefined);
 assert.equal(out.group.manual_scoring,undefined);
 assertScorelessMetadata(out);
 assert.equal(removePrintedScoringInstructions("（每題2分，共10分）題目內容"),"題目內容");
 const c=sourceQuestionContentOnly({source_id:"X",full_original_stem:"（每題2分，共10分）這題正確嗎？",original_scored_points:4});
 assert.equal(c.full_original_stem,"這題正確嗎？");
 assert.equal(c.original_scored_points,undefined);
});
test("B03 exactly 73 original Science HOLD source statements and options individually reviewed with 26 distinct independent model reasons, but formal holds retained",()=>{
 const rows=shards.flatMap(x=>x.science_review_rows);
 assert.equal(rows.length,73);
 assert.equal(new Set(rows.map(x=>x.source_id)).size,73);
 assert.equal(rows.filter(x=>x.original_review_reason).length,47);
 assert.equal(rows.filter(x=>!x.original_review_reason).length,26);
 assert.equal(rows.filter(x=>x.model_answer_candidate).length,1);
 assert.equal(review.original_science_hold_unmodified,73);
 assert.equal(review.formal_science_approvals,0);
 assert.equal(review.model_science_holds_due_to_missing_unique_or_context,72);
 const raw=rows.find(x=>x.source_id==="SCI_G04_S1_114_MID_007|S02|MC|009");
 assert.equal(raw.model_answer_candidate,"①");
 assert.equal(raw.science_answer_uniqueness,"MODEL_SINGLE_OPTION_CANDIDATE_OPERATOR_CHECK_REQUIRED");
 assert.equal(raw.formal_science_approved,false);
 for(const row of rows){
   assert.ok(row.question_stem);
   assert.ok(row.independent_model_science_review_reason?.length>10,row.source_id);
   assert.ok(row.problem_category);
   assert.equal(row.formal_science_approved,false);
   assert.equal(row.operator_reviewed,false);
   assertScorelessMetadata(row);
 }
});
test("B03 exactly 81 source KP items compared against real 45 canonical KP titles; 17 direct candidates 6 floating-family corrections not yet formally accepted",()=>{
 const k=shards.flatMap(x=>x.kp_review_rows),sc=shards.flatMap(x=>x.science_review_rows),shared=new Set(sc.map(x=>x.source_id));
 assert.equal(k.length,81);
 assert.equal(new Set(k.map(x=>x.source_id)).size,81);
 assert.equal(k.filter(x=>shared.has(x.source_id)).length,8);
 assert.equal(review.distinct_sources_reviewed,146);
 assert.deepEqual(review.kp_model_alignment_census,{NO_DIRECT_MATCH:27,BOUNDARY_NOT_EXACT:29,MODEL_DIRECT_CANDIDATE:17,NEEDS_FULL_OPTIONS:2,MODEL_SOURCE_FAMILY_CORRECTION:6});
 assert.equal(review.formal_kp_approvals,0);
 const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
 const valid=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(z=>z.canonical_kp_id)));
 assert.equal(valid.size,45);
 for(const row of k){
  assert.ok(row.kp_alignment_review_reason?.length>12);
  if(row.model_kp_candidate)assert.ok(valid.has(row.model_kp_candidate),row.model_kp_candidate);
  assert.equal(row.formal_kp_approved,false);
  assert.equal(row.operator_reviewed,false);
  assertScorelessMetadata(row);
 }
 const six=k.filter(x=>x.model_kp_review_conclusion==="MODEL_SOURCE_FAMILY_CORRECTION");
 assert.equal(six.length,6);
 assert.ok(six.every(x=>x.model_kp_candidate==="sci_g04s1_02_04"&&x.original_proposed_kp==="sci_g04s1_02_04"));
});
test("B03 25 source map figure and shared-context dependency inventories preserve all 906 unresolved original positions, not invented independent questions",()=>{
 const rows=deps.flatMap(x=>x.source_paper_records);
 assert.equal(rows.length,25);
 assert.equal(rows.reduce((n,x)=>n+x.original_frozen_answer_positions,0),1623);
 assert.equal(rows.reduce((n,x)=>n+x.source_only_standalone_materialized,0),717);
 assert.equal(rows.reduce((n,x)=>n+x.original_positions_not_yet_in_complete_standalone_text,0),906);
 assert.equal(rows.reduce((n,x)=>n+x.map_explicit_diagram_dependency_flags,0),197);
 assert.equal(dependencies.other_original_positions_not_complete_standalone,906);
 assert.equal(dependencies.raw_source_map_explicit_diagram_dependency_flags,197);
 assert.equal(dependencies.original_paper_maps_without_items.length,3);
 assert.equal(dependencies.do_not_infer_unarchived_positions_are_independent_questions,true);
 assert.equal(dependencies.new_site_admissions,0);
 for(const row of rows){assertScorelessMetadata(row);assert.equal(row.acceptance_status,"SOURCE_ONLY_UNREVIEWED_NONSTANDALONE_POSITIONS");}
});
test("Learner-facing circuit diagram is visually checked for electrical correctness without a numerical grade rule",()=>{
 const db=read("site/data/question-bank/certified-context-groups-content-v3.json");
 const d=db.groups.find(x=>x.id==="FINAL_G04_CIRCUIT_DRAW");
 assert.equal(d.assessment_method,"MANUAL_VISUAL_CORRECTNESS_CHECK");
 assert.equal(Object.hasOwn(d,"automatic_grading"),false);
 assert.ok(!/配分|\d+\s*分|總分/.test(d.items[0].answer_explanation));
 assertScorelessMetadata(d);
});
