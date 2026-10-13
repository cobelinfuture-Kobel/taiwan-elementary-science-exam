import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildMaster } from "../tools/p12-master-progress.mjs";
const read = path => JSON.parse(readFileSync(path, "utf8"));
const p = "data/review/p12-g04s1-114-";
const batch = read(p+"b03-dahua-mid-science-figure-verdict-v1.json");
const first = read(p+"hanlin-dahua-mid-50-source-kp-first-v1.json");
const figure = read(p+"b03-dahua-fish-eight-box-geometry-hold-evidence-v1.json");
const rewrites = read(p+"b03-dahua-four-correctable-rewrite-proposals-v1.json");
const progress = read(p+"b03-science-figure-acceptance-progress-v3.json");
const prior = read(p+"b02-science-figure-acceptance-progress-v2.json");
const queue = read(p+"secondpass-all25-hold-and-kp-review-queue-v1.json");
const v17 = read(p+"all25-kp-first-progress-v17.json");
const govt = read("data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json");
const authority = read("site/data/authority/science-g03-g04-selector-v2.json");
const kps = new Set(authority.units.filter(x=>x.grade===4 && x.semester===1).flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
const get = tail => batch.items.find(x=>x.source_slot_id.endsWith(tail));
test("B03 is exactly 33 real source-ID question positions in the verified two-page Dahua original", () => {
 assert.equal(kps.size,45);
 assert.equal(batch.source_candidate_id, "SCI_G04_S1_114_MID_010");
 assert.equal(batch.source_pdf_sha256, "d476e8bae13884d75dc1c386aedf716630f70e3c6b579d840c5c308a629676d6");
 assert.equal(first.original_pdf_sha256,batch.source_pdf_sha256);
 assert.equal(first.source_positions_identified,50);
 assert.equal(first.source_pdf_pages,2);
 assert.equal(batch.batch_reviewed_positions,33);
 assert.equal(batch.items.length,33);
 assert.equal(new Set(batch.items.map(x=>x.source_slot_id)).size,33);
 const originals = new Map(first.items.map(x=>[x.source_slot_id,x]));
 for(const r of batch.items) {
   const src = originals.get(r.source_slot_id);
   assert.ok(src,"unknown original slot: "+r.source_slot_id);
   assert.equal(r.source_first_pass_decision,src.kp_first_decision);
   assert.deepEqual(r.first_pass_matched_canonical_kp_ids,src.matched_canonical_kp_ids);
   assert.ok(r.first_pass_matched_canonical_kp_ids.every(id=>kps.has(id)));
   assert.equal(r.source_pdf_page,src.original_pdf_page);
   assert.equal(r.source_score_points,2);
   assert.equal(r.source_pdf_sha256,batch.source_pdf_sha256);
   assert.ok(r.source_visual_anchor);
   assert.ok(r.science_reason_and_issue.length>=12);
   assert.equal(r.original_pdf_source_page_verified,true);
 }
 assert.deepEqual(batch.source_firstpass_classifications_reviewed,{
   KP_MATCH_CANDIDATE:8,KP_MATCH_SOURCE_EVIDENCE_HOLD:16,REVIEW_KP_UNCERTAIN:9
 });
 assert.equal(batch.other_original_out_of_45kp_source_positions_archived_unchanged,17);
});
test("B03 never confuses 19 model science FULL_PASS with teacher answer acceptance or publication",()=>{
 const statuses=["FULL_PASS","CORRECTABLE","HOLD","REJECT"];
 assert.deepEqual(Object.fromEntries(statuses.map(k=>[k,batch.items.filter(x=>x.independent_science_verdict===k).length])),{FULL_PASS:19,CORRECTABLE:4,HOLD:10,REJECT:0});
 assert.equal(batch.source_figure_evidence_positions_with_diagrams,16);
 for(const x of batch.items){
   if(x.independent_science_verdict==="FULL_PASS")assert.notEqual(x.science_answer_if_full_pass,null);
   else assert.equal(x.science_answer_if_full_pass,null);
   assert.equal(x.original_source_teacher_key_authenticated,false);
   assert.equal(x.source_figure_rights_cleared,false);
   assert.equal(x.learner_figure_redraw_verified,false);
   assert.equal(x.operator_public_admission_approved,false);
   assert.equal(x.public_release_approved,false);
 }
 assert.equal(batch.public_new_admissions,0);
 assert.equal(batch.existing_live_site_total_answers,251);
 assert.equal(batch.existing_live_site_g04s1_answers,53);
});
test("Image readback resolves fish and aquatic plant semantics only where original diagram ID mapping allows",()=>{
 for(const n of ["006","007","008"]){
  const r=get("S03|G02|"+n);
  assert.equal(r.independent_science_verdict,"FULL_PASS");
  assert.equal(r.science_answer_if_full_pass,"圈選");
  assert.equal(r.figure_dependent,true);
  assert.equal(r.source_pdf_page,2);
 }
 assert.equal(get("S03|G03|009").science_answer_if_full_pass,"塗色");
 const plants={"010":"D","011":"D","012":"C","013":"B"};
 for(const [n,answer] of Object.entries(plants)){
  const r=get("S03|G04|"+n);
  assert.equal(r.science_answer_if_full_pass,answer);
  assert.equal(r.figure_dependent,true);
 }
});
test("Eight fish anatomy diagram IDs stay HOLD without inventing what ordinal source box means",()=>{
 assert.equal(figure.visible_diagram_boxes_count,8);
 assert.equal(figure.source_slot_id_geometry_binding_status,"NOT_FROZEN_IN_INITIAL_SOURCE_MAP");
 assert.equal(figure.no_automatic_id_mapping,true);
 assert.equal(figure.science_anatomical_identifications_from_original_arrows.length,8);
 assert.deepEqual(new Set(figure.science_anatomical_identifications_from_original_arrows.map(x=>x.answer_label)),new Set(["A","B","C","D","E","F","G","H"]));
 for(let n=14;n<=21;n++){
  const id="SCI_G04_S1_114_MID_010|S03|G05|"+String(n).padStart(3,"0");
  const row=batch.items.find(x=>x.source_slot_id===id);
  assert.ok(row);
  assert.equal(row.independent_science_verdict,"HOLD");
  assert.equal(row.science_answer_if_full_pass,null);
  assert.ok(figure.source_slots_awaiting_1_to_1_geometry_anchor.includes(id));
 }
 assert.equal(figure.source_original_image_copied_to_public_repo,false);
});
test("Whale passage flaws and two non-unique open-answer blanks stay blocked",()=>{
 const corrected=new Set(["S02|MC|013","S02|MC|014","S04|READ|001","S04|READ|003"].map(x=>"SCI_G04_S1_114_MID_010|"+x));
 assert.equal(rewrites.correction_count,4);
 assert.deepEqual(new Set(rewrites.items.map(x=>x.source_slot_id)),corrected);
 for(const id of corrected){
   const r=batch.items.find(x=>x.source_slot_id===id);
   assert.ok(r);
   assert.equal(r.independent_science_verdict,"CORRECTABLE");
   assert.equal(r.science_answer_if_full_pass,null);
 }
 assert.equal(get("S04|READ|002").science_answer_if_full_pass,"④");
 for(const n of ["004","005"]) {
  const r=get("S04|READ|"+n);
  assert.equal(r.independent_science_verdict,"HOLD");
  assert.equal(r.science_answer_if_full_pass,null);
 }
 for(const x of rewrites.items) {
  assert.equal(x.rewrite_state,"DRAFT_NO_PUBLIC_RELEASE");
  assert.equal(x.operator_approved,false);
 }
});
test("B01+B02+B03 cumulative source count, queue partition, corpus-first rule and site are unchanged",()=>{
 assert.equal(prior.model_independent_science_reviewed_positions_total,62);
 assert.equal(progress.model_independent_science_reviewed_positions_total,95);
 assert.deepEqual(progress.science_verdict_counts_cumulative,{FULL_PASS:74,CORRECTABLE:10,HOLD:10,REJECT:1});
 assert.equal(progress.original_440_hold_kp_queue_reviewed_distinct,75);
 assert.equal(progress.original_440_hold_kp_queue_not_yet_reviewed,365);
 assert.equal(progress.original_845_kp_candidates_reviewed_distinct,20);
 assert.equal(progress.original_845_kp_candidates_not_yet_reviewed,825);
 assert.equal(progress.remaining_original_1285_source_positions_without_independent_science_review,1190);
 assert.equal(queue.review_queue_count,440);
 assert.equal(v17.all_identified_source_answer_positions_count,1623);
 assert.equal(v17.papers_with_all_textually_identifiable_answer_positions_mapped,25);
 assert.equal(govt.scope_barrier.years_explicitly_not_required.join(","),"108,109,110,111,112,113");
 assert.equal(progress.publication_ready,false);
 assert.equal(progress.new_public_answer_positions_added,0);
 assert.equal(progress.public_site_total_answer_positions_invariant,251);
 assert.equal(progress.public_site_g04s1_answer_positions_invariant,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
});
