import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const q=rd('p12-g04s1-113-p04b-remaining12-gap-routing-native359-v1.json');
const x=rd('p12-g04s1-113-p04b-remaining12-native265-scan94-dedup359-source-coverage-v1.json');
const v3=rd('p12-g04s1-113-p04b-inherited3-scan-raster162-active17-resume-v3.json');

test('remaining12 source gaps correctly preserve original paper scope, source-only BBoxes and existing gates',()=>{
 assert.equal(q.candidate_original_school_papers,12);
 assert.equal(q.exceptions.length,12);
 assert.equal(new Set(q.exceptions.map(x=>x.paper_id)).size,12);
 assert.deepEqual(new Set(q.exceptions.map(x=>x.paper_id)),new Set(v3.remaining_paper_ids));
 assert.equal(q.source_only_independent_printed_answer_marker_bboxes,353);
 assert.equal(q.partial_matching_start_dots_NOT_CERTIFIED,6);
 assert.equal(q.section_working_regions_NOT_EXACT_SOURCE_UNIVERSE,808);
 assert.equal(q.exceptions.reduce((n,x)=>n+x.source_only_independent_printed_answer_marker_count,0),353);
 assert.equal(q.exceptions.reduce((n,x)=>n+x.source_only_matching_dot_count,0),6);
 assert.equal(q.exceptions.reduce((n,x)=>n+x.original_section_working_regions_NOT_CERTIFIED,0),808);
 assert.equal(q.source_only_checkpoints_completed,17);
 assert.equal(x.source_only_physical_marker_ids_total_in_remaining12,359);
 assert.equal(q.additional_mandatory_review_passes_added,false);
 assert.equal(q.user_approved_operator_gates_are_reused_not_extended,true);
 for(const p of q.exceptions){
  const ref=x.paper_summary.find(y=>y.paper_id===p.paper_id);
  assert.ok(ref);
  assert.equal(p.source_only_independent_printed_answer_marker_count,ref.printed_independent_answer_marker_bboxes_source_only);
  assert.equal(p.source_only_matching_dot_count,ref.matching_source_dots_partial_not_independent_answer_bboxes);
  assert.equal(p.diagnostic_section_count_minus_independent_marker_COUNT_ONLY_NOT_ACTUAL_MISSING_SLOTS, p.original_section_working_regions_NOT_CERTIFIED-p.source_only_independent_printed_answer_marker_count);
  assert.equal(p.source_fullgate_accepted,false);
  assert.equal(p.ADMISSION_GATE,'BLOCKED_NO_COMPLETE_SOURCE');
  assert.equal(p.no_auto_operator_release,true);
 }
 for(const t of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new'])assert.equal(q[t],0);
 assert.equal(q.already_published_113_unchanged,178);
});
