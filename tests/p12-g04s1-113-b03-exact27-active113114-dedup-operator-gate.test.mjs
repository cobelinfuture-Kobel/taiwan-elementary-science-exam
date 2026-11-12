import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const review=p=>JSON.parse(readFileSync(new URL("../data/review/"+p,import.meta.url),"utf8"));
const main=p=>JSON.parse(readFileSync(new URL("../site/data/"+p,import.meta.url),"utf8"));
const checkpoint=review("p12-g04s1-113-b03-native50-post206-legacy7-27candidates-16hold-v2.json");
const source=review("p12-g04s1-113-native-tfmc-b03-50-original-pdf-text-preflight-v1.json");
const geometry=review("p12-g04s1-113-native-tfmc-b03-50-real-original-glyph-bbox-v1.json");
const science=review("p12-g04s1-113-native-tfmc-b03-50-science-kp-consolidated-v1.json");
const exact=review("p12-g04s1-113-b03-27exact-original-source-science-kp-operator-pending-v1.json");
const audit=review("p12-g04s1-113-b03-exact27-active113114-dedup-existinggate-operator-pending-v1.json");
const main206=review("p12-g04s1-113-main-published206-source-suppression-readback-v14.json");
const legacy=main("question-bank/approved-historical-ox-v4.json");
const active114=main("question-bank/p12-b04-b01-47-public-v1.json");
const authority=main("authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s||"").replace(/\s/gu,"");

test("B03 preserves all 50 original school source identities, 27 exact candidates, 16 HOLD and 7 legacy-public suppressions",()=>{
 assert.equal(checkpoint.records.length,50);
 assert.equal(new Set(checkpoint.records.map(x=>x.id)).size,50);
 assert.deepEqual(checkpoint.records.map(x=>x.id),source.records.map(x=>x.source_slot_id));
 assert.deepEqual(checkpoint.records.map(x=>x.id),geometry.source_marker_records.map(x=>x.original_source_slot_id));
 assert.deepEqual(checkpoint.records.map(x=>x.id),science.records.map(x=>x.source_slot_id));
 assert.deepEqual(audit.dispositions,{
   original_source_positions:50,proposed_exact27_ready_for_operator_gate:27,
   existing_science_KP_HOLD:15,similar_duplicate_uncertain_HOLD:1,total_HOLD:16,
   preexisting_legacy_public_suppressed:7,
   FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0
 });
 assert.equal(audit.exact27.length,27);
 assert.deepEqual(audit.exact27.map(x=>x.exact_source_id),exact.records.map(x=>x.source_id));
 assert.equal(main206.current_113_source_slots_published,206);
 assert.equal(audit.authoritative_main_sha,main206.public_main_commit);
 assert.equal(audit.site_live_preB03_answer_slots,842);
});

test("all 27 exact school texts, printed native BBoxes, full options, science answer, and frozen113 midterm KP are traceable",()=>{
 const allowed=new Map(authority.units.filter(x=>x.grade===4&&x.semester===1&&["U01","U02"].includes(x.unit_id))
   .flatMap(x=>x.knowledge_points.map(y=>[y.canonical_kp_id,x.unit_id])));
 assert.equal(allowed.size,26);
 let tf=0,mc=0;
 for(const [i,row] of audit.exact27.entries()){
  const e=exact.records[i],q=source.records.find(x=>x.source_slot_id===row.exact_source_id);
  const g=geometry.source_marker_records.find(x=>x.original_source_slot_id===row.exact_source_id);
  const s=science.records.find(x=>x.source_slot_id===row.exact_source_id);
  assert.ok(q&&g&&s);
  assert.equal(row.original_school_PDF_SHA256,q.source_pdf_sha256);
  assert.equal(q.source_pdf_sha256,g.source_exact_pdf_sha);
  assert.deepEqual(e.original_answer_BBox,g.pdf_bbox_pts_top_left);
  assert.equal(e.original_pdf_page,g.pdf_page_1_based);
  assert.equal(e.original_stem_exact,q.stem_pdf_text_layer);
  assert.deepEqual(e.original_options_exact,q.options_from_pdf_text_layer);
  assert.equal(e.direct_frozen_113KP_candidate,s.frozen_direct_kp_candidate);
  assert.equal(e.accepted_science_answer_proposal,s.model_independent_science_answer);
  assert.equal(row.canon_KP,s.frozen_direct_kp_candidate);
  assert.equal(row.canon_unit,allowed.get(row.canon_KP));
  assert.equal(s.route,"DIRECT");
  assert.equal(q.figure_or_diagram_dependency,false);
  assert.equal(e.operator_final_exact_question_approval,false);
  assert.equal(row.operator_exact_scope_gate,"PENDING");
  if(row.type==="TF"){
    tf++;assert.ok(["O","X"].includes(row.answer_from_independent_science_review_NOT_school_key));
    assert.equal(q.options_from_pdf_text_layer,null);
  }else{
    mc++;assert.ok(["①","②","③","④"].includes(row.answer_from_independent_science_review_NOT_school_key));
    assert.equal(q.options_from_pdf_text_layer.length,4);
  }
 }
 assert.deepEqual([tf,mc],[10,17]);
});

test("preexisting public Mingyi seven have the same original PDF SHA, question, science answer, no republishing",()=>{
 assert.equal(audit.prior_duplicate_legacy7.length,7);
 for(const x of audit.prior_duplicate_legacy7){
  const original=source.records.find(r=>r.source_slot_id===x.source_id);
  const decision=science.records.find(r=>r.source_slot_id===x.source_id);
  const already=legacy.blocks.find(b=>b.id===x.already_public_student_id);
  assert.ok(original&&decision&&already);
  assert.equal(original.source_pdf_sha256,already.source_pdf_sha256);
  assert.equal(norm(original.stem_pdf_text_layer),norm(already.stem));
  assert.equal(decision.model_independent_science_answer,already.answer);
  assert.equal(x.disposition,"SUPPRESS_NEW_PUBLIC_ITEM_KEEP_LINEAGE");
  assert.ok(!audit.exact27.some(r=>r.exact_source_id===x.source_id));
 }
});

test("114 source with same water-plant stem is NOT a reordered duplicate: independent correct option answer-object changes",()=>{
 const x=audit.crossyear_114_nearstem_reviewed[0];
 assert.equal(x.source113,"SCI_G04_S1_113_MID_008|S2|MC|11");
 assert.equal(x.published114,"SCI_G04_S1_114_MID_004|S02|MC|012");
 const prior=active114.blocks.find(b=>b.source_slot_id===x.published114);
 const this113=exact.records.find(r=>r.source_id===x.source113);
 assert.ok(prior&&this113);
 assert.deepEqual(prior.options,["①大萍","②浮萍","③水蘊草","④布袋蓮。"]);
 assert.deepEqual(this113.original_options_exact.map(y=>norm(y.text)),["大萍","浮萍","布袋蓮","睡蓮。"]);
 assert.equal(prior.answer,"③");
 assert.equal(this113.accepted_science_answer_proposal,"④");
 assert.equal(x.disposition,"DISTINCT_ORIGINAL_QUESTION_KEEP_AS_EXACT27_CANDIDATE");
 const HOLD="SCI_G04_S1_113_MID_009|S2|MC|15";
 assert.ok(!audit.exact27.some(r=>r.exact_source_id===HOLD));
 assert.equal(checkpoint.records.find(r=>r.id===HOLD).disposition,"HOLD_DUPLICATE_EVIDENCE");
});

test("no student-public release or false formal approval before B03 exact27 scope operator acceptance",()=>{
 assert.equal(audit.operator_exact27_manifest_approval,"PENDING");
 assert.equal(exact.operator_explicit_exact_cohort_approval,"PENDING");
 assert.equal(audit.PR_public_student_release,"NOT_CREATED_BEFORE_EXACT_OPERATOR_APPROVAL");
 assert.equal(audit.existing_formal_gate_not_relaxed,true);
 assert.equal(audit.new_secondary_science_or_KP_gate_added,false);
 assert.equal(audit.image_source_material_allowed_to_publish,false);
 assert.ok(audit.exact27.every(x=>x.operator_exact_scope_gate==="PENDING"));
});
