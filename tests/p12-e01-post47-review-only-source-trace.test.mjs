import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const prev=read("data/review/p12-e01-postcloseout-remaining49-science-kp-source-sweep-v1.json");
const accepted=read("data/review/p12-e01-post49-mingyi-taozijiao-two-source-exact-science-kp-acceptance-v1.json");
const review=read("data/review/p12-e01-postcloseout-remaining47-complete-exception-reroute-v1.json");
const evidence=read("data/review/p12-e01-post47-dongguang-stream-lily-source-exact-unique-science-kp-v1.json");
const source=read("data/source-archive/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("P12 E01 review-only: exact 49 minus 2 merged admissions is 47 distinct held source slots",()=>{
 const done=new Set(accepted.records.map(x=>x.source_slot_id));
 assert.equal(done.size,2);
 assert.deepEqual(
  review.records.map(x=>x.source_slot_id).sort(),
  prev.records.map(x=>x.source_slot_id).filter(id=>!done.has(id)).sort()
 );
 assert.equal(review.records.length,47);
 assert.equal(review.selective_candidate_count,1);
 assert.equal(review.original_frozen_115_exceptions_unchanged,true);
 assert.equal(review.review_only_publication,false);
 assert.equal(review.public_slots_actual_until_live_success,628);
 assert.equal(review.unadmitted_actual_until_live_success,47);
 assert.equal(review.records.filter(x=>x.post110_current_status==="ONE_SOURCE_TEXT_NATIVE_BBOX_RELATIVE_LIKELIHOOD_RECHECK").length,1);
 const routes=review.by_previous_exception_route;
 assert.deepEqual([routes.SCIENCE_OR_KP_SEMANTIC_HOLD,routes.SCAN_IMAGE_BBOX_RECOVERED_SCIENCE_KP_HOLD,routes.SCAN_AND_SECONDARY_SEMANTIC_OR_DUPLICATE_HOLD,routes.DUPLICATE_LINEAGE_ONLY_NO_PUBLIC_SECOND_COPY,routes.SOURCE_PRINTED_OPTION_LABEL_ANOMALY_HOLD],[28,9,6,3,1]);
 assert.equal(review.records.every(x=>x.student_public_admitted===false),true);
});
test("P12 E01 conditional Dongguang native PDF evidence is traceable but unadmitted",()=>{
 assert.equal(evidence.review_only,true);
 assert.equal(evidence.formal_public_admission_completed,false);
 assert.equal(evidence.source_exception_count_current_verified,47);
 assert.equal(evidence.student_public_answer_slots_current_verified,628);
 assert.equal(evidence.records.length,1);
 const e=evidence.records[0],orig=source.original_question_records.find(x=>x.source_id===e.source_slot_id);
 assert.ok(orig);
 assert.equal(source.original_pdf_sha256,e.original_pdf_sha256);
 assert.equal(source.original_raw_pdf_size_bytes,e.source_pdf_bytes);
 assert.equal(source.original_source_drive_file_id,e.source_drive_file_id);
 assert.equal(orig.full_original_stem,e.source_question_stem_exact);
 assert.deepEqual(orig.full_original_options_in_order,e.source_options_exact);
 assert.deepEqual(orig.answer_marker_pdf_bbox_pts_top_left,e.native_pdf_glyph_bbox_pts_top_left);
 assert.equal(e.original_page_rgb_sha256,"449dba44a37925774abd3e7de58251ec7a4e946adf4d5a41c5ca745d547fe710");
 assert.equal(e.source_pdf_page_rotation_degrees,0);
 assert.deepEqual(e.original_page_raster_size_px,[1166,1652]);
 assert.equal(e.independent_unique_answer,"③");
 assert.equal(e.explicit_resolved_scope,"relative_likelihood_not_absolute_absence");
 assert.equal(e.cannot_claim_water_lilies_never_in_streams,true);
 assert.equal(e.school_teacher_key_authenticated,false);
 const canonical=authority.units.flatMap(u=>u.knowledge_points).find(x=>x.canonical_kp_id===e.primary_existing_canonical_kp_id);
 assert.equal(canonical.title,"水域環境條件差異");
});
