import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01Post52Anhe3} from "../site/assets/js/p12-e01-post52-anhe3-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const proof=read("data/review/p12-e01-post52-anhe-final3-directkp-nativepdf-acceptance-v1.json");
const list=read("data/review/p12-e01-postcloseout-remaining52-source-classification-v1.json");
const bank=read("site/data/question-bank/p12-e01-post52-anhe-final3-public-v1.json");
const source=read("data/source-archive/p12-art9-114-anhe-g04s1-final35-original-questions-v1.json");
const frozen=read("data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const purenFinal=read("site/data/question-bank/p12-e01-puren-final16-public-v1.json");
const purenMid=read("data/review/p12-e01-puren-mid18-raster-pixelbbox-13accept-5hold-v1.json");
const heshunMid=read("data/review/p12-e01-heshun-mid17-pixel-bbox-15accept-2hold-v1.json");
const heshunFinal=read("data/review/p12-e01-heshun-final21-raster-pixelbbox-science-kp-admission-v2.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
const RAW_SHA="5be04233c46409c4b2c7161b4ea10feaec4e290ee0e6723cbf8bcbda30fe79a2";
test("P12 post-E01 immutable 115-63=52 exact lineage, 3 direct-KP candidates only",()=>{
 const published=[...purenFinal.blocks.map(b=>b.source_slot_id),
  ...purenMid.evidence.map(b=>b.source_slot_id),
  ...heshunMid.records.map(b=>b.source_slot_id),
  ...heshunFinal.records.map(b=>b.source_slot_id)];
 const pub=new Set(published);
 assert.equal(pub.size,63);assert.equal(published.length,63);
 assert.equal(frozen.records.length,115);
 assert.equal(list.source_exception_count_initial,115);
 assert.equal(list.e01_published_source_positions??list.e01_source_positions_formally_published,63);
 const expected=frozen.records.filter(x=>!pub.has(x.source_id)).map(x=>x.source_id).sort();
 const found=list.records.map(x=>x.source_slot_id).sort();
 assert.deepEqual(found,expected);
 assert.equal(found.length,52);assert.equal(new Set(found).size,52);
 assert.deepEqual(list.remaining_by_previous_route,{
  DEDUP_LINEAGE_ONLY:3,
  SCIENCE_KP_SEMANTIC_REVIEW:33,
  ORIGINAL_PRINTED_OPTIONS_REVIEW:1,
  SCAN_PDF_BBOX_RECOVERY:9,
  SCAN_WITH_SECONDARY_HOLDS:6});
 assert.equal(list.records.filter(x=>x.existing_e01_exception_proof_ref).length,9);
 assert.equal(list.records.filter(x=>x.priority_for_direct_review).length,3);
 assert.equal(list.no_student_bank_publication_by_classification_itself,true);
 assert.ok(list.records.every(x=>x.public_bank_admitted===false&&x.does_not_change_original_frozen_row===true));
 for(const x of list.records){
  const a=frozen.records.find(k=>k.source_id===x.source_slot_id);
  assert.equal(x.original_frozen_route,a.primary_route);
  assert.equal(x.source_archive_ref,a.original_source_archive_ref);
  assert.equal(x.original_pdf_sha256,a.source_pdf_sha256);
  assert.deepEqual(x.original_flags,a.exception_flags);
 }
});
test("P12 Anhe original PDF native text glyph marker, 3 independent source/answer/KP and rights gates",()=>{
 const accepted=validateAndConvertP12E01Post52Anhe3(bank,authority);
 assert.deepEqual([accepted.answerSlots,accepted.standaloneTf,accepted.standaloneChoice,accepted.contextGroups],[3,2,1,0]);
 assert.equal(proof.source_pdf_original_drive_file_id,source.original_source_drive_file_id);
 assert.equal(source.original_pdf_sha256,RAW_SHA);
 assert.equal(proof.original_pdf_sha256,RAW_SHA);
 assert.equal(proof.original_pdf_SHA256_from_raw_download_verified,true);
 assert.equal(proof.native_text_layer_glyph_bbox_verified,true);
 assert.equal(proof.original_pdf_pages,2);
 assert.equal(proof.source_exact_stems_and_options_verified,true);
 assert.equal(proof.published_image_assets,false);
 assert.equal(proof.original_school_teacher_key_authenticated,false);
 assert.equal(proof.baseline_remaining_source_slots,52);
 assert.equal(proof.remaining_if_verified_success,49);
 assert.equal(proof.public_answer_slots_pre,623);
 assert.equal(proof.public_answer_slots_post_success,626);
 assert.equal(proof.records.length,3);
 for(const row of bank.blocks){
  const x=proof.records.find(k=>k.source_slot_id===row.source_slot_id);
  const src=source.original_question_records.find(k=>k.source_id===row.source_slot_id);
  const cls=list.records.find(k=>k.source_slot_id===row.source_slot_id);
  assert.ok(x&&src&&cls);
  assert.equal(cls.latest_route,"DIRECT_KP_03_09_SOURCE_PDF_REVIEW_RELEASE_CANDIDATE");
  assert.equal(row.stem,src.full_original_stem);
  assert.equal(row.stem,x.original_printed_stem_exact);
  assert.equal(row.answer,x.model_science_unique_answer);
  assert.equal(row.canonical_kp_id,"sci_g04s1_03_09");
  assert.equal(row.canonical_kp_id,x.direct_kp_id);
  assert.equal(row.answer_explanation,x.independently_rechecked_science_reason);
  assert.deepEqual(row.options??[],src.full_original_options_in_order.map(c=>c.label+c.text));
  assert.deepEqual(row.options??[],x.original_full_options_exact.map(c=>c.label+c.text));
  assert.deepEqual(row.source_pdf_bbox_pts_top_left,src.answer_marker_pdf_bbox_pts_top_left);
  assert.deepEqual(row.source_pdf_bbox_pts_top_left,x.original_pdf_source_bbox_points_top_left);
  assert.equal(x.native_bbox_glyph_text_verified,true);
  assert.equal(x.original_pdf_raster_engine,"PyMuPDF Matrix(1.6,1.6)");
  assert.deepEqual(x.rendered_page_image_size_px,[1166,1651]);
  assert.equal(x.rendered_page_rgb_sha256,"437a99121f2a33ecc378e1f2caeb88dd369f2cbc3ec8362cd10ccdff0562a15e");
  assert.equal(src.standalone_without_shared_figure_or_stimulus,true);
  assert.equal(src.article9_exam_question_text_only,true);
  assert.equal(x.original_school_answer_key_authenticated,false);
  assert.equal(row.original_teacher_answer_key_authenticated,false);
 }
});
test("P12 post52 fail-closed tampering answer, stem, KP, printed options, source hash, bbox and rights",()=>{
 const changes=[x=>x.blocks[0].stem="other",
  x=>x.blocks[0].answer="X",
  x=>x.blocks[0].canonical_kp_id="sci_g04s1_03_08",
  x=>x.blocks[0].source_pdf_sha256="WRONG",
  x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
  x=>x.blocks[0].source_page_pdf_1_based=2,
  x=>x.blocks[2].options[3]="④其他",
  x=>x.blocks[0].answer_explanation="tamper",
  x=>x.blocks[0].source_slot_id="MISSING",
  x=>x.blocks[0].operator_publication_approval=false,
  x=>x.blocks[0].copyright_path="MISSING",
  x=>x.blocks[0].original_cropped_assets_included=true,
  x=>x.expected_answer_slots=4];
 for(const edit of changes){const clone=structuredClone(bank);edit(clone);assert.throws(()=>validateAndConvertP12E01Post52Anhe3(clone,authority));}
});
test("P12 Anhe exact stems do not duplicate any already published standalone bank",()=>{
 const prior=["approved-historical-ox-v4","p12-b04-b01-47-public-v1",
 "p12-b04-b02-41-public-v1","p12-b04-b03-41-public-v1","p12-b04-b04-47-public-v1",
 "p12-b04-b05-40-public-v1","p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1",
 "p12-b04-g04s1-chongde-mid6-public-v1","p12-b04-g04s1-yongan-mid9-public-v1",
 "p12-e01-puren-final16-public-v1","p12-e01-puren-mid13-public-v1",
 "p12-e01-heshun-mid15-public-v1","p12-e01-heshun-final21-public-v1"];
 const seen=new Set(prior.flatMap(p=>read("site/data/question-bank/"+p+".json").blocks.map(x=>norm(x.stem))));
 for(const b of bank.blocks)assert.equal(seen.has(norm(b.stem)),false,b.source_slot_id);
});
