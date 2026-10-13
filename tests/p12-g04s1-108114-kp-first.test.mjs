import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildG04S1KPIndex,classifyG04S1SourcePosition,validateG04S1KPFirstQueue} from "../tools/p12-g04s1-kp-first.mjs";
import {buildMaster} from "../tools/p12-master-progress.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const auth=read("site/data/authority/science-g03-g04-selector-v2.json");
const policy=read("data/governance/p12-g04s1-108114-kp-first-authority-v1.json");
const registry=read("data/source-registry/p12-g04s1-108114-drive-discovery-v1.json");
const queue=read("data/source-registry/p12-g04s1-108114-all-papers-kp-first-queue-v1.json");
const pilot=read("data/review/p12-g04s1-114-nanyi-yongan-mid-kp-first-80-position-pilot-v1.json");
const historic=read("data/review/p12-g04s1-108114-kp-first-historic-pilot-overlay-v1.json");
test("operator KP-first authority freezes exactly four upper units and all 45 canonical KPs",()=>{
 const idx=buildG04S1KPIndex(auth);
 assert.equal(idx.size,45);
 assert.deepEqual(policy.canonical_scope.kp_by_unit,{U01:11,U02:12,U03:10,U04:12});
 assert.deepEqual(policy.canonical_scope.unit_ids,["U01","U02","U03","U04"]);
 assert.equal(policy.no_bulk_admission,true);
 assert.equal(policy.existing_public_answers_unchanged,251);
 assert.equal(policy.existing_g04s1_public_answers_unchanged,53);
 assert.ok(policy.invalid_exclusion_gates.includes("printed_exam_type"));
 assert.ok(policy.invalid_exclusion_gates.includes("publisher_label"));
 assert.ok(policy.invalid_exclusion_gates.includes("paper_level_scope_rating"));
});
test("all seven academic years and 273 candidate filenames/429 original Drive IDs remain queued for every source answer position",()=>{
 const r=validateG04S1KPFirstQueue(queue,registry,auth);
 assert.equal(r.source_papers,273);
 assert.equal(r.source_drive_file_ids,429);
 assert.deepEqual(r.years,[108,109,110,111,112,113,114]);
 assert.equal(queue.work_items.length,273);
 assert.equal(queue.work_items[0].academic_year,114);
 assert.equal(queue.work_items.at(-1).academic_year,108);
 assert.ok(queue.work_items.every(x=>x.cross_exam_unit_match_is_kept));
 assert.ok(queue.work_items.every(x=>x.excluded_if_publisher_mismatch===false&&x.excluded_if_paper_mismatch===false));
 assert.equal(queue.currently_completed_full_question_mapping_papers,0);
});
test("an original mid-term shadow question maps to U03 current final, even on a paper rated REJECT with a different publisher",()=>{
 const q={source_slot_id:"114_fake_mid_06",matched_canonical_kp_ids:["sci_g04s1_03_06"],
   original_paper_exam_type:"MID",original_publisher_label:"南一",original_paper_scope_rating:"REJECT"};
 const result=classifyG04S1SourcePosition(q,auth);
 assert.equal(result.decision,"KP_MATCH_CANDIDATE");
 assert.equal(result.retain_source,true);
 assert.deepEqual(result.units,["U03"]);
 assert.deepEqual(result.new_curriculum_exam_routing,["CURRENT_FINAL"]);
 assert.equal(result.cross_original_exam_period,true);
 assert.equal(result.publication_allowed,false);
 for(const publisher of ["康軒","南一","翰林",null])
  for(const rating of ["FULL","NEAR_FULL","REJECT","WRONG_SCOPE",null]){
   const next=classifyG04S1SourcePosition({...q,original_publisher_label:publisher,original_paper_scope_rating:rating},auth);
   assert.equal(next.decision,"KP_MATCH_CANDIDATE");
  }
});
test("uncertain mapping and visual/science holds retain the source; only individually verified nonmatches archive",()=>{
 const match={matched_canonical_kp_ids:["sci_g04s1_04_09"],original_paper_exam_type:"MID",source_figure_missing:true};
 const r=classifyG04S1SourcePosition(match,auth);
 assert.equal(r.decision,"KP_MATCH_SOURCE_EVIDENCE_HOLD");
 assert.deepEqual(r.units,["U04"]);
 assert.equal(r.retain_source,true);
 assert.equal(classifyG04S1SourcePosition({matched_canonical_kp_ids:["sci_g04s1_04_88"]},auth).decision,"REVIEW_KP_UNCERTAIN");
 assert.equal(classifyG04S1SourcePosition({matched_canonical_kp_ids:[]},auth).decision,"REVIEW_KP_UNCERTAIN");
 const a=classifyG04S1SourcePosition({matched_canonical_kp_ids:[],exact_question_text_read:true,independently_reviewed_as_no_matching_kp:true},auth);
 assert.equal(a.decision,"NONMATCH_G04S1_KP_ARCHIVE");
 assert.equal(a.retain_source,true);
});
test("the first 114 Nanyi MID 80 source positions include 4 cross-period U03 positions and 60 explicitly pending",()=>{
 assert.equal(pilot.original_source_answer_positions,80);
 assert.equal(pilot.items.length,80);
 assert.deepEqual(pilot.original_source_section_totals,[10,10,9,13,8,7,23]);
 assert.equal(new Set(pilot.items.map(x=>x.source_position_id)).size,80);
 assert.deepEqual(pilot.preliminary_kp_decisions,{
   KP_MATCH_CANDIDATE:10,NONMATCH_G04S1_KP_ARCHIVE:6,REVIEW_KP_UNCERTAIN:3,KP_MATCH_SOURCE_EVIDENCE_HOLD:1,PENDING_FULL_SOURCE_POSITION_EXTRACTION:60
 });
 assert.equal(pilot.cross_exam_KP_match_positions,4);
 assert.ok(pilot.items.filter(x=>x.routing_by_current_kp==="CURRENT_FINAL").every(x=>x.original_exam_type==="MID"&&x.kp_first_decision==="KP_MATCH_CANDIDATE"));
 assert.equal(pilot.items.filter(x=>x.source_text_reviewed).length,20);
 assert.equal(pilot.items.filter(x=>!x.source_text_reviewed).length,60);
 assert.equal(pilot.public_admission_approved,false);
});
test("20 prior-source sample statuses are preserved; prior WRONG_PERIOD shadow is now eligible U03",()=>{
 assert.equal(historic.source_text_samples_reviewed,20);
 assert.equal(historic.items.length,20);
 assert.equal(historic.cross_period_matching_items_retained,1);
 assert.deepEqual(historic.counts,{NONMATCH_G04S1_KP_ARCHIVE:5,KP_MATCH_CANDIDATE:13,KP_MATCH_SOURCE_EVIDENCE_HOLD:1,REVIEW_KP_UNCERTAIN:1});
 const old=historic.items.find(x=>x.old_pilot_decision==="WRONG_PERIOD");
 assert.ok(old);
 assert.equal(old.new_kp_first_decision,"KP_MATCH_CANDIDATE");
 assert.equal(old.canonical_kp_id,"sci_g04s1_03_06");
 assert.equal(old.new_target_unit,"U03");
 assert.equal(old.new_curriculum_exam_type,"FINAL");
 assert.equal(old.original_exam_type,"MID");
 assert.equal(historic.do_not_mutate_previous_pilot_status,true);
});
test("authorizing KP-first screening does not publish 114 unreviewed candidates or change 251 live answers",()=>{
 const master=buildMaster();
 assert.equal(master.public_question_bank_answer_slots_current,251);
 assert.equal(master.p12_operator_published_slots,103);
 assert.equal(master.position_status_counts.not_started,223);
 assert.equal(queue.initial_published_slots_unchanged,251);
 assert.equal(pilot.public_admission_approved,false);
 assert.equal(historic.public_admission_approved,false);
});
