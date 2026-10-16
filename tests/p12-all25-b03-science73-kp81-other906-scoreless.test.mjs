import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripScoringMetadata,assertScorelessMetadata,removePrintedScoringInstructions} from '../site/assets/js/scoreless-contract.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='data/review/p12-all25-b03-';
const science=read(root+'science-last30-full-original-readback-v1.json');
const kp=[1,2,3].flatMap(i=>read(root+'kp81-precise-authority-shard0'+i+'-v1.json').review_rows);
const other=read(root+'other-formats-906-inventory-index-v1.json');
const shards=other.source_format_evidence_refs.map(read);
const authority=read('site/data/authority/science-g03-g04-selector-v2.json');
const kpIds=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(z=>z.canonical_kp_id)));
const active=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
const approval=read('data/review/p12-standalone-all25-source-content-only-queue-v2.json');
test('B03 remaining 30 Science HOLD inspect exact source stems/options individually without hidden answer promotion',()=>{
 assert.equal(science.original_question_records.length,30);
 assert.equal(science.overall_science_hold_input_count,73);
 assert.equal(new Set(science.original_question_records.map(x=>x.source_id)).size,30);
 for(const r of science.original_question_records){
  assert.ok(r.source_display_stem_without_assessment_annotation.length>8,r.source_id);
  assert.ok(Array.isArray(r.all_original_options_readback));
  assert.ok(r.independent_science_rationale.length>15,r.source_id);
  assert.ok(r.next_required_evidence.length>8);
  assert.equal(r.science_status_after_review,'SCIENCE_HOLD');
  assert.equal(r.operator_acceptance,false);
  assert.equal(r.public_admission,false);
  assert.equal(r.source_text_unchanged,true);
  assert.ok(r.original_verbatim_source_remains_in.includes('/source-archive/'));
  assert.doesNotMatch(r.source_display_stem_without_assessment_annotation,/每(?:題|格|答|個答案)\s*\d+\s*分|[（(]\s*\d+\s*分/);
 }
});
test('B03 all 81 original KP questions inspected against exact authoritative 45 G04S1 KPs, retain source and science gates',()=>{
 assert.equal(kp.length,81);assert.equal(new Set(kp.map(x=>x.source_id)).size,81);assert.equal(kpIds.size,45);
 for(const r of kp){
  if(r.strict_reviewer_candidate_kp)assert.ok(kpIds.has(r.strict_reviewer_candidate_kp));
  assert.ok(r.source_grounded_reason.length>=15);
  assert.ok(r.source_display_stem_without_assessment_annotation.length>3);
  assert.equal(r.canonical_kp_formally_approved,false);
  assert.equal(r.operator_approval,false);assert.equal(r.site_release,false);
  assert.ok(r.original_verbatim_source_remains_in.includes('source-archive/'));
  assert.doesNotMatch(r.source_display_stem_without_assessment_annotation,/每(?:題|格|答|個答案)\s*\d+\s*分|[（(]\s*\d+\s*分/);
 }
 const plants=kp.filter(x=>x.prior_firstpass_wrong_family_if_known);
 assert.equal(plants.length,6);
 assert.ok(plants.every(x=>x.strict_reviewer_candidate_kp==='sci_g04s1_02_04'&&x.prior_firstpass_wrong_family_if_known==='sci_g04s1_02_05'));
});
test('B03 25 original papers, remaining 906 positions = 774 ID-bound format hints and 132 await original individual source maps',()=>{
 const papers=shards.flatMap(s=>s.paper_rows),labels=papers.flatMap(p=>p.classified_rows||p.map_individual_format_candidates||[]);
 assert.equal(papers.length,25);
 assert.equal(papers.reduce((n,x)=>n+(x.remaining_original_positions_count??x.remaining_position_count),0),906);
 assert.equal(labels.length,774);
 assert.equal(other.original_source_response_positions,1623);
 assert.equal(other.already_archived_independent_fulltext_question_occurrences,717);
 assert.equal(other.positions_exactly_linked_to_frozen_source_map_ids,774);
 assert.equal(other.positions_not_yet_bound_to_individual_map_entry,132);
 assert.equal(other.strict_image_and_parent_acceptance_completed,0);
 assert.equal(other.source_papers_with_missing_individual_map.length,3);
 assert.deepEqual(other.source_papers_with_missing_individual_map.map(x=>x.remaining_unbound).sort((a,b)=>a-b),[34,48,50]);
 const categories=other.source_derived_initial_format_categories;
 assert.equal(Object.values(categories).reduce((n,x)=>n+x,0),774);
 assert.equal(new Set(labels.map(x=>x.source_position_id)).size,774);
});
test('Global score-free policy in active Exam question data, not historical source archives',()=>{
 assert.equal(active.current_public_source_archive_files.length,25);
 assert.equal(active.cumulative_original_source_question_occurrences,717);
 assert.match(approval.next_execution,/^P12_ALL25_B04_/);
 for(const file of active.current_public_source_archive_files){
  const obj=read(file);assertScorelessMetadata(obj);
  for(const row of obj.original_question_records)assert.doesNotMatch(row.stem,/每(?:題|格|答|個答案)\s*\d+\s*分|[（(]\s*\d+\s*分/);
 }
 const drawing=read('site/data/question-bank/certified-context-groups-v2.json').groups.find(x=>x.id==='FINAL_G04_CIRCUIT_DRAW');
 assert.equal(drawing.assessment_method,'MANUAL_VISUAL_CORRECTNESS_CHECK');
 assert.equal('automatic_grading' in drawing,false);
 assert.doesNotMatch(drawing.items[0].answer_explanation,/配分|\d+\s*分/);
 assert.equal(removePrintedScoringInstructions('題意（每答1分，共6分）'),'題意');
 assert.deepEqual(stripScoringMetadata({grade:4,question_count:2,scoring_points:4,questions:[{stem:'測試',point_value:2}]}),{grade:4,question_count:2,questions:[{stem:'測試'}]});
});
