import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,readJson} from '../scripts/review/p12-g04s1-113-all29-bulk-admission-fullfix.mjs';
const P='data/review/p12-g04s1-113-all29-';
const roster=readJson(P+'bulk-b01-exact62-preliminary-operator-cohort-roster-PENDING-v1.json');
const audit=readJson(P+'bulk-b01-114-original-content-and-gate-routing-v1.json');
const event=readJson(P+'bulk-b01-mingyi10-existing-legacy-exact9alias1science-hold-overlay-v1.json');
const base=analyze({batch:'all'});
test('one B01 62-source exact review cohort is distinct by source ID but neither signed nor formally released',()=>{
 assert.equal(roster.source_id_rows.length,62);
 assert.equal(roster.source_ids_exact.length,62);
 assert.equal(new Set(roster.source_ids_exact).size,62);
 assert.deepEqual(roster.source_work_count_by_paper,{
  'SCI_G04_S1_113_MID_001':4,
  'SCI_G04_S1_113_FINAL_005':33,
  'SCI_G04_S1_113_FINAL_007':25
 });
 const blocked=new Set(event.records.map(r=>r.source_slot_id));
 for(const c of roster.source_id_rows){
  const orig=audit.rows.find(x=>x.source_slot_id===c.source_slot_id);
  assert.ok(orig,'candidate must belong to B01 original 114');
  assert.equal(orig.content_route,'TEXT_WITH_DIRECT_KP_CANDIDATE');
  assert.ok(!blocked.has(c.source_slot_id),'do not re-admit previously public original: '+c.source_slot_id);
  assert.equal(c.original_answer_bbox_pdf_points_top_left.length,4);
  assert.equal(c.source_pdf_sha256,orig.original_pdf_sha256);
  assert.equal(c.independent_model_science_answer_NOT_TEACHER_KEY,orig.independent_answer_model_not_school_key);
  assert.equal(c.model_direct_kp_id,orig.model_direct_frozen48kp_id);
  assert.equal(c.operator_exact_source_approval,false);
  assert.equal(c.formal_science_kp_approved,false);
  assert.equal(c.full_11329_scanned_parent_and_option_semantic_duplicate_final_accepted,false);
  assert.equal(c.original_question_component_article9_rights_final_accepted,false);
  assert.equal(c.ADMISSION_READY,false);
  assert.equal(c.PUBLISHED,false);
 }
 assert.equal(roster.B01_model_candidate_exact_stem_alias_suppressed_count,5);
 assert.equal(roster.source_only_roster_not_authorized_to_publish,true);
 assert.equal(roster.operator_exact_source_roster_approved,false);
});
test('post-B01 evidence overlay updates 29-paper source work positions only, no rewrite to frozen initial nine batches',()=>{
 assert.equal(base.this_run_scoped_source_work_positions,1122);
 assert.deepEqual(base.original_disjoint_effective,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 assert.deepEqual(base.post_B01_content_evidence_projection,{PUBLISHED:333,HOLD:292,ALIAS:25,UNREVIEWED:1112});
 assert.equal(base.post_B01_total_remaining_unreviewed,1112);
 assert.equal(base.B01_preexisting_public_exact_alias9_and_science_conflict_HOLD1_count,10);
 assert.equal(base.batches.find(b=>b.batch_id==='B01').input_source_work_positions,114);
 assert.equal(base.batches.find(b=>b.batch_id==='B01').unresolved_existing_gates,104);
 assert.equal(base.batches.find(b=>b.batch_id==='B01').already_public_alias_sources_suppressed,9);
 assert.equal(base.batches.find(b=>b.batch_id==='B01').original_answer_conflict_source_HOLD,1);
 assert.equal(base.formal_science_kp_approved_new,0);
 assert.equal(base.ADMISSION_READY_new,0);
 assert.equal(base.PUBLISHED_new,0);
});
