import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildMaster } from "../tools/p12-master-progress.mjs";
import { evaluateG04S1114CorpusAdmission } from "../tools/p12-g04s1-114-corpus-admission-preflight.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const p="data/review/p12-g04s1-114-";
const paper=read(p+"kanghsuan-anhe-mid-50-source-kp-first-v1.json");
const batch=read(p+"b04-anhe-mid-science-figure-50-verdicts-v1.json");
const fixes=read(p+"b04-three-rewrites-and-fish-source-summary-correction-draft-v1.json");
const progress=read(p+"b04-science-figure-progress-v4.json");
const prior=read(p+"b03-science-figure-acceptance-progress-v3.json");
const v17=read(p+"all25-kp-first-progress-v17.json");
const b15=read(p+"secondpass-all25-hold-and-kp-review-queue-v1.json");
const gov=read("data/governance/p12-g04s1-114-full25-screen-before-public-admission-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const validKps=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
const slot=tail=>batch.items.find(x=>x.source_slot_id.endsWith(tail));
test("B04 audits exactly all 50 original Anhe MID slots against binary SHA and original paper source map",()=>{
 assert.equal(validKps.size,45);
 assert.equal(batch.source_candidate_id,"SCI_G04_S1_114_MID_006");
 assert.equal(batch.actual_original_binary_sha_verified,true);
 assert.equal(batch.source_pdf_sha256,"f83a0f683654980c5f7757797b63222d1fd8517291e1fef4757cfe1fa5976acb");
 assert.equal(paper.source_exact_pdf_sha256,batch.source_pdf_sha256);
 assert.equal(paper.original_pdf_pages,2);
 assert.equal(paper.source_answer_positions,50);
 assert.equal(batch.source_slots_reviewed,50);
 assert.equal(batch.items.length,50);
 assert.equal(new Set(batch.items.map(x=>x.source_slot_id)).size,50);
 const sourceRows=new Map(paper.items.map(x=>[x.source_slot_id,x]));
 for(const x of batch.items){
  const o=sourceRows.get(x.source_slot_id);
  assert.ok(o,"unknown source slot "+x.source_slot_id);
  assert.equal(x.source_firstpass_decision,o.kp_first_decision);
  assert.deepEqual(x.source_firstpass_kp_ids,o.matched_canonical_kp_ids);
  assert.ok(x.source_firstpass_kp_ids.every(id=>validKps.has(id)));
  assert.equal(x.source_pdf_original_page,o.original_pdf_visual_page);
  assert.equal(x.source_pdf_sha256,paper.source_exact_pdf_sha256);
  assert.equal(x.source_original_score_points,2);
  assert.equal(x.original_figure_required,o.original_figure_required);
  assert.ok(x.independent_science_reason.length>=10);
  assert.equal(x.original_pdf_exact_science_and_visual_readback,true);
 }
 assert.deepEqual(batch.firstpass_source_strata,{KP_MATCH_CANDIDATE:26,KP_MATCH_SOURCE_EVIDENCE_HOLD:21,REVIEW_KP_UNCERTAIN:3});
 assert.equal(batch.original_paper_printed_score_total,100);
 assert.equal(batch.original_source_score_point_parity_preserved,true);
});
test("50 B04 evaluations have 47 science FULL_PASS and 3 CORRECTABLE without teacher/public rights gates",()=>{
 const cats=["FULL_PASS","CORRECTABLE","HOLD","REJECT"];
 assert.deepEqual(Object.fromEntries(cats.map(x=>[x,batch.items.filter(i=>i.independent_science_verdict===x).length])),{FULL_PASS:47,CORRECTABLE:3,HOLD:0,REJECT:0});
 assert.equal(batch.figure_dependent_science_positions_reviewed,20);
 for(const x of batch.items){
  assert.equal(x.source_teacher_answer_key_authenticated,false);
  assert.equal(x.learner_diagram_redraw_accepted,false);
  assert.equal(x.source_figure_copyright_clearance,false);
  assert.equal(x.operator_public_admission_approved,false);
  assert.equal(x.public_release_approved,false);
  if(x.independent_science_verdict==="FULL_PASS")assert.ok(x.science_answer_if_full_pass!==null);
  else assert.equal(x.science_answer_if_full_pass,null);
 }
 assert.equal(batch.new_public_admitted_source_positions,0);
 assert.equal(batch.public_site_total_answer_positions_unchanged,251);
 assert.equal(batch.public_site_g04s1_answer_positions_unchanged,53);
});
test("B04 source page 2 illustrates 8 aquatic water-level figures with original slot order and calibrated science answers",()=>{
 const wanted={"S03|G01A|001":"A","S03|G01A|002":"√","S03|G01A|003":"√","S03|G01A|004":"×",
  "S03|G01B|005":"B","S03|G01B|006":"√","S03|G01B|007":"×","S03|G01B|008":"√"};
 for(const [tail,a] of Object.entries(wanted)){
  const row=slot(tail);
  assert.ok(row,tail);
  assert.equal(row.science_answer_if_full_pass,a);
  assert.equal(row.original_figure_required,true);
  assert.equal(row.source_pdf_original_page,2);
 }
});
test("Original survival three-step and fish directional fin are read from source graphic, not first-pass mistaken summary",()=>{
 const wanted={"009":"B","010":"A","011":"C"};
 for(const [tail,a]of Object.entries(wanted))assert.equal(slot("S03|G02|"+tail)?.science_answer_if_full_pass,a);
 assert.equal(slot("S03|G03|012")?.science_answer_if_full_pass,"D");
 assert.equal(slot("S03|G03|013")?.science_answer_if_full_pass,"E");
 assert.equal(slot("S03|G03|014")?.science_answer_if_full_pass,"A");
 const mismatch=slot("S03|G03|013");
 assert.match(mismatch.source_summary_verbatim_firstpass,/尾鰭/);
 assert.match(mismatch.independent_science_reason,/胸鰭/);
 assert.equal(mismatch.kp_acceptance_disposition,"SOURCE_SUMMARY_MISMATCH_TAILFIN_VS_PECTORAL_FIN__FIX_BEFORE_FINAL_ACCEPTANCE");
 assert.equal(fixes.firstpass_source_description_discrepancy[0].source_slot_id,mismatch.source_slot_id);
 assert.equal(fixes.firstpass_source_description_discrepancy[0].public_admission_allowed,false);
});
test("B04 earthquake schematic preserves six independent score boxes (not three), original 甲乙丙 semantics",()=>{
 const expect={"015":"丙","016":"震源","017":"乙","018":"震源深度","019":"甲","020":"震央"};
 for(const [n,a] of Object.entries(expect)){
  const row=slot("S03|G04|"+n);
  assert.ok(row);
  assert.equal(row.science_answer_if_full_pass,a);
  assert.equal(row.source_pdf_original_page,2);
  assert.equal(row.original_figure_required,true);
 }
});
test("Exactly three rewrite proposals reconcile ambiguous source material without silently publishing",()=>{
 const ids=new Set(batch.items.filter(x=>x.independent_science_verdict==="CORRECTABLE").map(x=>x.source_slot_id));
 assert.equal(fixes.rewrite_proposals.length,3);
 assert.deepEqual(new Set(fixes.rewrite_proposals.map(x=>x.source_slot_id)),ids);
 for(const x of fixes.rewrite_proposals){
  assert.ok(x.risk.length>12);
  assert.ok(x.expected_answer);
  assert.ok(x.proposed_stem);
  assert.match(x.operator_revision_state,/^DRAFT_/);
 }
 assert.equal(fixes.all_rewrites_draft_unapproved,true);
 assert.equal(fixes.original_teacher_key_authenticated,false);
 assert.equal(fixes.source_original_pdf_question_text_modified,false);
 assert.equal(fixes.public_admission_approved,false);
});
test("B01–B04 cumulative invariants and 114 complete-25-first public admission lock are unchanged",()=>{
 assert.equal(prior.model_independent_science_reviewed_positions_total,95);
 assert.equal(progress.model_independent_science_reviewed_positions_total,145);
 assert.deepEqual(progress.science_verdict_counts_cumulative,{FULL_PASS:121,CORRECTABLE:13,HOLD:10,REJECT:1});
 assert.equal(progress.original_440_hold_kp_queue_reviewed_distinct,99);
 assert.equal(progress.original_440_hold_kp_queue_not_yet_reviewed,341);
 assert.equal(progress.original_845_kp_candidates_reviewed_distinct,46);
 assert.equal(progress.original_845_kp_candidates_not_yet_reviewed,799);
 assert.equal(progress.remaining_original_1285_source_positions_without_independent_science_review,1140);
 assert.equal(v17.all_identified_source_answer_positions_count,1623);
 assert.equal(v17.papers_with_all_textually_identifiable_answer_positions_mapped,25);
 assert.equal(b15.review_queue_count,440);
 assert.equal(progress.new_public_admissions_from_batch04,0);
 assert.equal(progress.public_site_total_answer_positions_unchanged,251);
 assert.equal(progress.public_site_g04s1_answer_positions_unchanged,53);
 assert.equal(buildMaster().public_question_bank_answer_slots_current,251);
 const simulatedCurrent={...progress,
    public_answer_positions_still:251,public_g04s1_answer_positions_still:53};
 const gate=evaluateG04S1114CorpusAdmission(gov,
  {...v17,g04s1_live_answer_slots_still:53},simulatedCurrent);
 assert.equal(gate.publication_ready,false);
 assert.ok(gate.failed_gate_ids.includes("ALL25_SCIENCE_BATCHES_COMPLETE"));
 assert.ok(gate.failed_gate_ids.includes("NEW_EXPLICIT_OPERATOR_APPROVAL"));
});
