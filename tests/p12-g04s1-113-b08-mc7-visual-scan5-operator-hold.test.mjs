import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL("../" + p, import.meta.url), "utf8"));
const dossier = read("data/review/p12-g04s1-113-b08-mc7-originalvisual-scan5-article9-frozen48-operator-PENDING-v1.json");
const inherited = read("data/review/p12-g04s1-113-b08-50source-17proposals-33exceptions-admission-notready-v1.json");

test("B08 Chenggong source matches original two-page PDF and seven question set", () => {
  assert.equal(dossier.source_pdf.sha256,"ac43ffabb331d4b1da78f2991724c27be4bf0710b25eb25e6a9434f586c27601");
  assert.deepEqual(dossier.records.map(x=>x.ordinal),[387,388,389,390,391,392,393]);
  assert.deepEqual(Object.keys(dossier.parent_visual).includes("table_column_alignment_accepted"),true);
  assert.equal(dossier.parent_visual.table_column_alignment_accepted,true);
  assert.equal(dossier.parent_visual.speaker_text_alignment_accepted,true);
  assert.equal(dossier.records.filter(x=>x.source_exact&&x.source_native_bbox&&x.parent_visual&&x.unique_science_answer&&x.direct_frozen_kp).length,7);
});
test("B08 only source-exact duplicate checks; all 16 scanned pages retained by hash", () => {
  assert.equal(dossier.scan5.papers.reduce((n,p)=>n+p.pages,0),16);
  assert.equal(new Set(dossier.scan5.papers.map(p=>p.sha256)).size,5);
  assert.ok(dossier.scan5.papers.every(p=>p.exact_child_with_equivalent_parent_and_options_found===false));
  assert.equal(dossier.inherited_duplicate.native_113_papers_with_normalized_exact_stem_screening,24);
  assert.equal(dossier.inherited_duplicate.original_114_source_occurrences_screened,717);
  assert.equal(dossier.inherited_duplicate.public_113_114_rows_screened,749);
});
test("B08 exact seven science KP does NOT bypass operator / renderer / release", () => {
  assert.deepEqual(dossier.formal_metrics_new,{FORMAL_SCIENCE_KP_APPROVED:7,ADMISSION_READY:0,PUBLISHED:0});
  assert.equal(dossier.operator.status,"PENDING_FINAL_OPERATOR_ELIGIBLE_COHORT_SIGNOFF");
  assert.ok(dossier.records.every(x=>x.formal_science_kp_approved && !x.admission_ready && !x.published));
  assert.ok(dossier.records.every(x=>x.rights_text_only_eligible));
  assert.equal(dossier.operator.student_renderer,"PENDING_TWO_INTACT_PARENT_GROUPS");
  assert.equal(dossier.operator.student_PR,"NOT_STARTED");
  assert.equal(dossier.operator.focused_CI,"NOT_RUN");
  assert.equal(dossier.operator.PagesE2E,"NOT_STARTED");
  assert.equal(dossier.original_pdf_image_not_committed,true);
});
test("B08 inherited matching10, 33 HOLD and B01-B07 remain frozen", () => {
  assert.equal(inherited.original_worklist_positions,50);
  assert.equal(inherited.priority_MC7_not_formal.length,7);
  assert.equal(inherited.matching10_source_only.length,10);
  assert.equal(inherited.other_33_HOLD_including_2_multiple_plausible_light_answer_codes.length,33);
  assert.equal(dossier.matching10_unchanged,true);
  assert.equal(dossier.hold33_unchanged,true);
  assert.equal(dossier.B01_to_B07_unchanged,true);
});
