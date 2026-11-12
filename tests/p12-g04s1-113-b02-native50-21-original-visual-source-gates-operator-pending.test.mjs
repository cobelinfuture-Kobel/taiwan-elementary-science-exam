import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>JSON.parse(readFileSync(new URL("../data/review/"+path,import.meta.url),"utf8"));
const d=read("p12-g04s1-113-b02-21visual-original-source-science-kp-dedup-rights-operator-PENDING-v1.json");
const source=read("p12-g04s1-113-native-tfmc-b02-50-source-checkpoint-v1.json");
const q=read("p12-g04s1-113-native-tfmc-b02-50-pdf-text-layer-source-qa-v2.json");
const geom=read("p12-g04s1-113-native-tfmc-b02-50-original-native-glyph-bbox-readback-v1.json");
const inherited=read("p12-g04s1-113-native-tfmc-b02-50-science-kp-exception-routing-v1.json");
const published=read("p12-g04s1-113-main-published185-source-suppression-readback-v13.json");

test("B02 50 exact identities, 3 actual original SHA papers and visual six-page PDFs; source evidence unchanged",()=>{
 assert.equal(d.rows.length,50);
 assert.equal(d.real_original_school_PDF_SHA256_downloaded_and_matches_registry,3);
 assert.equal(d.real_original_SCHOOL_PDF_pages_visually_checked,6);
 assert.equal(d.main_published_before_B02_count,185);
 assert.equal(d.site_answer_slots_before_B02,821);
 assert.deepEqual(d.rows.map(x=>x.source_id),source.source_position_records.map(x=>x.normalized_source_slot_id));
 assert.deepEqual(d.rows.map(x=>x.source_id),q.source_positions.map(x=>x.source_slot_id));
 assert.deepEqual(d.rows.map(x=>x.source_id),geom.source_positions.map(x=>x.source_slot_id));
 assert.deepEqual(d.rows.map(x=>x.source_id),inherited.records.map(x=>x.source_slot_id));
 assert.equal(new Set(d.rows.map(x=>x.source_id)).size,50);
 assert.deepEqual(Object.values(d.paper_registry).map(x=>x.sha256),[
  "2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5",
  "6bc0d26c5f6476b7c8e2aa2e0232ebd161c17e1f11129f2d4192935e27e4ed98",
  "2f9858729498ad472dad1545612a01866bba90b0dbce464a508c199d9b4b1105"
 ]);
 assert.ok(d.rows.every((x,i)=>x.original_pdf_sha256===geom.source_positions[i].source_pdf_sha256
  &&x.original_pdf_page===1
  &&JSON.stringify(x.original_answer_native_bbox_pts_top_left)===JSON.stringify(geom.source_positions[i].original_printed_answer_parenthesis_bbox_pts_top_left)
  &&x.original_exam_question_full_text_exact_PDF_text_layer===q.source_positions[i].pdf_text_layer_full_original_question
  &&x.original_exam_question_stem_exact_PDF_text_layer===q.source_positions[i].pdf_text_layer_stem));
});

test("B02 21 exact text-only source+science+KP candidates; one duplicate, 26 old and 2 new HOLD",()=>{
 const groups={};for(const x of d.rows)groups[x.B02_after_visual_disposition]=(groups[x.B02_after_visual_disposition]||0)+1;
 assert.deepEqual(groups,{
  HOLD_EXISTING_26_EXCEPTIONS_NOT_REOPENED:26,
  EVIDENCE_COMPLETE_NEEDS_SCOPE_OPERATOR_EXACT21_APPROVAL:21,
  EXACT_PUBLISHED_B01_DUPLICATE_LINEAGE_ONLY:1,
  HOLD_SOURCE_SCIENCE_OR_DIRECT_KP_REQUIRES_SPECIFIC_EVIDENCE:2
 });
 const exact=d.rows.filter(x=>x.B02_after_visual_disposition==="EVIDENCE_COMPLETE_NEEDS_SCOPE_OPERATOR_EXACT21_APPROVAL");
 assert.deepEqual(exact.map(x=>x.source_id),d.selected_exact21_question_IDs);
 assert.deepEqual([4,11,6],["MID_004","MID_007","MID_008"].map(s=>exact.filter(x=>x.original_school_id.endsWith(s)).length));
 assert.ok(exact.every(x=>x.scope_KP_direct_evidence_ready===true
  &&x.operator_exact_cohort_approval_pending===true
  &&x.figure_parent_dependency===false
  &&x.original_rights_exam_text_only_preflight===true
  &&x.prior_direct_KP_candidate?.startsWith("sci_g04s1_0")
  &&x.prior_independent_science_answer_candidate_NOT_TEACHER_KEY
  &&(x.question_type==="TF" || x.question_type==="MC"&&x.original_exam_four_MC_options_exact_PDF_text_layer?.length===4)));
 assert.equal(d.rows.filter(x=>x.figure_parent_dependency===true).length,4);
 assert.ok(d.rows.filter(x=>x.B02_after_visual_disposition==="HOLD_EXISTING_26_EXCEPTIONS_NOT_REOPENED")
  .every(x=>x.figure_parent_dependency===null||x.figure_parent_dependency===true));
 const holds=d.rows.filter(x=>x.B02_after_visual_disposition==="HOLD_SOURCE_SCIENCE_OR_DIRECT_KP_REQUIRES_SPECIFIC_EVIDENCE");
 assert.deepEqual(holds.map(x=>x.source_id),[
  "SCI_G04_S1_113_MID_007|S1|TF|4",
  "SCI_G04_S1_113_MID_008|S1|TF|8"
 ]);
 assert.deepEqual(d.rows.filter(x=>x.B02_after_visual_disposition==="EXACT_PUBLISHED_B01_DUPLICATE_LINEAGE_ONLY").map(x=>x.source_id),[
  "SCI_G04_S1_113_MID_004|S2|TF|11"
 ]);
 assert.equal(published.current_113_source_slots_published,185);
});

test("No prospective question auto-admission before exact cohort operator approval",()=>{
 assert.equal(d.operator_exact21_cohort_approval,"PENDING");
 assert.equal(d.no_student_site_release_before_exact_cohort_operator_approval,true);
 assert.equal(d.counts.formal_science_kp_approved_new,0);
 assert.equal(d.counts.admission_ready_new,0);
 assert.equal(d.counts.published_new,0);
 assert.ok(d.rows.every(x=>x.FORMAL_SCIENCE_KP_APPROVED_new===false&&x.ADMISSION_READY_new===false&&x.PUBLISHED_new===false));
 assert.equal(d.unchanged_B01_closeout,true);
 assert.equal(d.unchanged_existing_26_HOLD,true);
 assert.equal(d.unchanged_frozen_48KP,true);
 assert.equal(d.student_release_expected_blocks_after_operator_exact_approval,21);
 assert.equal(d.student_release_expected_answer_slots_after_operator_exact_approval,21);
});
