import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../data/review/"+p,import.meta.url),"utf8"));
const bank=p=>JSON.parse(readFileSync(new URL("../site/data/"+p,import.meta.url),"utf8"));
const checkpoint=read("p12-g04s1-113-b04-native50-post233-legacy7-36candidates-13hold-1duplicate-v1.json");
const roster=read("p12-g04s1-113-b04-exact36-source-science-kp-rights-operator-pending-v1.json");
const source=read("p12-g04s1-113-native-tfmc-b04-50-source-checkpoint-v1.json");
const original=read("p12-g04s1-113-native-tfmc-b04-50-original-pdf-text-layer-v3.json");
const geom=read("p12-g04s1-113-native-tfmc-b04-50-original-real-glyph-bbox-v1.json");
const model=read("p12-g04s1-113-native-tfmc-b04-50-science-kp-consolidated-v2.json");
const pub=read("p12-g04s1-113-main-published233-source-suppression-readback-v15.json");
const authority=bank("authority/science-g03-g04-selector-v3.json");
const previous=bank("question-bank/p12-g04s1-113-native38-public-v1.json");
const strip=s=>String(s||"").replace(/[\s\p{P}\p{S}]/gu,"");

test("B04 exact frozen source50 original order 151-200 with identical PDF SHAs and native real BBoxes preserved",()=>{
 assert.equal(checkpoint.rows.length,50);
 assert.deepEqual(checkpoint.rows.map(x=>x.ordinal),Array.from({length:50},(_,i)=>i+151));
 assert.deepEqual(checkpoint.rows.map(x=>x.source_id),source.records.map(x=>x.source_slot_id));
 assert.deepEqual(checkpoint.rows.map(x=>x.source_id),original.records.map(x=>x.source_slot_id));
 assert.deepEqual(checkpoint.rows.map(x=>x.source_id),geom.source_positions.map(x=>x.source_slot_id));
 assert.deepEqual(checkpoint.rows.map(x=>x.source_id),model.records.map(x=>x.source_slot_id));
 assert.equal(new Set(checkpoint.rows.map(x=>x.source_id)).size,50);
 for(const [i,x] of checkpoint.rows.entries()){
  assert.equal(x.source_pdf_sha256,original.records[i].source_pdf_sha256);
  assert.equal(x.source_pdf_sha256,geom.source_positions[i].source_pdf_sha256);
  assert.equal(x.source_pdf_page_1_based,geom.source_positions[i].pdf_page_1_based);
  assert.deepEqual(x.source_original_native_answer_bbox,geom.source_positions[i].printed_answer_parenthesis_bbox_pdf_pt_top_left);
  assert.equal(x.original_source_full_question_text_layer,original.records[i].full_question_text);
  assert.deepEqual(x.original_source_choice_label_and_text,original.records[i].options);
  assert.equal(x.prior_route,model.records[i].route);
 }
});
test("B04 exact36 direct source+science+scope candidates, all separately await same operator admission gate",()=>{
 const groups={};for(const x of checkpoint.rows)groups[x.source_disposition]=(groups[x.source_disposition]||0)+1;
 assert.deepEqual(groups,{
  HOLD_EXISTING_SCIENCE_KP_EXCEPTION:12,
  SOURCE_SCIENCE_KP_CANDIDATE_OPERATOR_PENDING:36,
  SUPPRESS_SAME_PUBLIC_ORIGINAL_EXACT_STEM:1,
  HOLD_SCIENCE_QUALIFIER_INDETERMINATE:1
 });
 assert.equal(roster.records.length,36);
 assert.equal(roster.final_exact36_operator_approval,"PENDING");
 assert.deepEqual([roster.counts.TF,roster.counts.MC,roster.counts.total_HOLD],[22,14,13]);
 assert.deepEqual([roster.counts.FORMAL_SCIENCE_KP_APPROVED_new,roster.counts.ADMISSION_READY_new,roster.counts.PUBLISHED_new],[0,0,0]);
 assert.deepEqual(roster.records.map(x=>x.source_id),checkpoint.rows.filter(x=>x.source_disposition==="SOURCE_SCIENCE_KP_CANDIDATE_OPERATOR_PENDING").map(x=>x.source_id));
 const known=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1&&["U01","U02"].includes(x.unit_id)).flatMap(x=>x.knowledge_points.map(x=>x.canonical_kp_id)));
 assert.equal(known.size,26);
 assert.ok(roster.records.every(x=>known.has(x.canonical_direct_frozen_KP_candidate)&&x.original_answer_native_bbox?.length===4
    &&x.original_school_pdf_sha256?.length===64&&x.original_page_1_based>=1
    &&x.original_stem_exact_PDF_text?.length>4
    &&x.source_no_figure_dependency===true&&x.original_school_teacher_answer_key_authenticated===false
    &&x.operator_final_exact_cohort_approval===false));
 assert.ok(roster.records.filter(x=>x.question_type==="MC").every(x=>x.original_four_options_exact_PDF_text?.length===4&&["①","②","③","④"].includes(x.independent_science_answer_proposal)));
 assert.ok(roster.records.filter(x=>x.question_type==="TF").every(x=>x.original_four_options_exact_PDF_text===null&&["O","X"].includes(x.independent_science_answer_proposal)));
});
test("Published233 current source IDs plus seven earlier Mingyi legacy sources, B04 one exact already-public same stem suppresses",()=>{
 assert.equal(pub.current_113_source_slots_published,233);
 assert.equal(pub.public_site_all_answer_slots,869);
 const duplicate=checkpoint.rows.find(x=>x.source_disposition==="SUPPRESS_SAME_PUBLIC_ORIGINAL_EXACT_STEM");
 assert.equal(duplicate.source_id,"SCI_G04_S1_113_MID_014|S1|TF|2");
 assert.equal(duplicate.duplicate_alias_to,"SCI_G04_S1_113_MID_005|S1|TF|010");
 const old=previous.blocks.find(x=>x.source_slot_id===duplicate.duplicate_alias_to);
 assert.ok(old);
 assert.equal(strip(old.stem),strip(duplicate.original_source_stem_text_layer));
 assert.equal(old.answer,duplicate.science_prior_independent_answer_candidate);
 assert.equal(roster.no_double_count_Mingyi7_legacy_already_public,true);
 assert.equal(checkpoint.legacy7_source_ids.length,7);
 assert.equal(new Set(roster.records.map(x=>x.source_id)).size,36);
 assert.ok(!roster.records.some(x=>x.source_id===duplicate.source_id));
});
test("Hold source specific qualifier instead of promoting prior textbook O as uniquely proven fact",()=>{
 const hold=checkpoint.rows.find(x=>x.source_id==="SCI_G04_S1_113_MID_015|S1|TF|5");
 assert.equal(hold.source_disposition,"HOLD_SCIENCE_QUALIFIER_INDETERMINATE");
 assert.ok(hold.specific_reason.includes("necessarily"));
 assert.ok(!roster.records.some(x=>x.source_id===hold.source_id));
 assert.equal(checkpoint.b01_b02_b03_CLOSED_no_changes,true);
 assert.equal(checkpoint.B04_batched_closeout,false);
 assert.equal(roster.no_student_release_PR_before_applicable_final_operator_gate,true);
});
