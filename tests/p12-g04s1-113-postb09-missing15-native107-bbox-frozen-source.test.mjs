import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const crosswalk=read("data/review/p12-g04s1-113-postb09-missing42-15allPDF-sha41p-native107-88hold-authority-v1.json");
const glyph=read("data/review/p12-g04s1-113-missing15-native5-107-original-glyph-bbox-19suppressed-88hold-v1.json");
const b09=read("data/review/p12-g04s1-113-b09-real8-native-parent-bbox-frozen48-scope-hold-v1.json");
const b08=read("data/review/p12-g04s1-113-b08-source50-17published-33hold-complete-closeout-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");

test("B09 actual Frozen original8 cannot be inflated to requested50 by renumbering unrelated source IDs",()=>{
 assert.equal(crosswalk.B09_source_scope.actual_frozen_B09_ledger_positions,8);
 assert.equal(crosswalk.B09_source_scope.requested_50_target,50);
 assert.equal(crosswalk.B09_source_scope.unidentified_non_frozen_gap,42);
 assert.equal(crosswalk.B09_source_scope.verified_additional_B09_approved_source_IDs,0);
 assert.equal(crosswalk.B09_source_scope.never_reassign_other_source_question_IDs_into_B09_without_authority,true);
 assert.deepEqual(crosswalk.B09_source_scope.fixed_ledger_ordinals,[401,402,403,404,405,406,407,408]);
 assert.deepEqual(crosswalk.B09_source_scope.existing_8_exact_source_IDs,b09.records.map(x=>x.source_id));
});

test("Fifteen originals are SHA/page matched; 983 old printed planning positions are NOT admitted answers",()=>{
 const records=crosswalk.source_rows;
 assert.equal(records.length,15);
 assert.equal(new Set(records.map(x=>x.original_source_ID)).size,15);
 assert.ok(records.every(x=>x.source_sha256.length===64&&x.sha256_of_actual_original_bytes_verified));
 assert.equal(records.reduce((sum,x)=>sum+x.PDF_pages_verified,0),41);
 assert.equal(records.filter(x=>x.scan_only).length,5);
 assert.equal(records.filter(x=>!x.scan_only).length,10);
 assert.ok(records.filter(x=>x.scan_only).every(x=>x.PDF_native_text_chars===0));
 assert.equal(records.reduce((sum,x)=>sum+x.prior_partial_section_or_print_score_positions_NOT_CERTIFIED,0),983);
 assert.ok(records.every(x=>x.complete_original_paper_question_or_slot_inventory_certified===false));
 assert.equal(crosswalk.prior_15paper_section_counts_derive_from_PR124_not_exact_slot_admission,true);
});

test("Exactly 107 original PDF-native answer glyph boxes; exclude 19 previously released and keep 88 HOLD",()=>{
 assert.equal(glyph.source_records.length,107);
 assert.equal(glyph.summary.source_markers_with_original_answer_glyph_bbox,107);
 assert.equal(glyph.summary.already_published_suppressed,19);
 assert.equal(glyph.summary.unpublished_source_markers_now_with_original_glyph_bbox,88);
 assert.equal(new Set(glyph.source_records.map(x=>x.source_slot_id)).size,107);
 assert.equal(glyph.source_records.filter(x=>x.already_published_source_suppression).length,19);
 assert.equal(glyph.source_records.filter(x=>!x.already_published_source_suppression).length,88);
 assert.ok(glyph.source_records.every(x=>x.original_pdf_sha256.length===64&&x.original_pdf_page>=1));
 assert.ok(glyph.source_records.every(x=>x.bbox_provenance==="ORIGINAL_PDF_NATIVE_CHAR_PARENTHESES_ONLY_PYMUPDF_RAWDICT"));
 assert.ok(glyph.source_records.every(x=>x.original_blank_glyph_bbox_pdf_pts_top_left.length===4));
 assert.ok(glyph.source_records.every(x=>{const [x0,y0,x1,y1]=x.original_blank_glyph_bbox_pdf_pts_top_left;return [x0,y0,x1,y1].every(Number.isFinite)&&x0<x1&&y0<y1;}));
 assert.ok(glyph.source_records.every(x=>!x.admission_ready&&!x.published_this_batch&&!x.science_unique_answer_formal));
});

test("Seven original child gates and Frozen48 stay intact; B01-B08 published and PR124 draft unmodified",()=>{
 assert.equal(crosswalk.no_frozen_113_48KP_change,true);
 assert.equal(crosswalk.no_B01_to_B08_published_reopen,true);
 assert.equal(crosswalk.separate_non_B09_original_source_ledger.not_a_B09_extension,true);
 assert.deepEqual([crosswalk.missing15_summary.new_FORMAL_SCIENCE_KP_APPROVED,crosswalk.missing15_summary.new_ADMISSION_READY,crosswalk.missing15_summary.new_PUBLISHED],[0,0,0]);
 assert.equal(b08.formal_B08_cumulative.PUBLISHED,17);
 assert.equal(b08.all_hold33_ordinals.length,33);
 assert.equal(authority.counts.knowledge_points,190);
 assert.deepEqual(authority.units.filter(x=>x.grade===4&&x.semester===1).map(x=>x.unit_id),["U01","U02","U03","U04"]);
});
