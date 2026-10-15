import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01PurenMid13} from "../site/assets/js/p12-e01-puren-mid13-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const proof=read("data/review/p12-e01-puren-mid18-raster-pixelbbox-13accept-5hold-v1.json");
const bank=read("site/data/question-bank/p12-e01-puren-mid13-public-v1.json");
const source=read("data/source-archive/p12-art9-114-puren-g04s1-mid27-original-questions-v1.json");
const review=read("data/review/p12-b04-auto-batch50-b08-first50-science-kp-review-v1.json");
const hold=read("data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
const strip=s=>String(s??"").replace(/[（(]每個答案\s*\d+\s*分[）)]/gu,"").replace(/[（(]\s*\d+\s*分[）)]/gu,"");
test("P12 E01 Puren MID 18 original-scan independent visual pixel BBoxes, 13 formal candidates, 5 Science/KP quarantine",()=>{
 const admitted=validateAndConvertP12E01PurenMid13(bank,authority);
 assert.deepEqual([admitted.answerSlots,admitted.standaloneTf,admitted.standaloneChoice,admitted.contextGroups],[13,5,8,0]);
 assert.equal(proof.source_review_positions,18);assert.equal(proof.formal_admission_candidates,13);
 assert.equal(proof.science_kp_quarantine,5);assert.equal(proof.evidence.length,13);
 assert.equal(proof.quarantined.length,5);assert.equal(source.original_pdf_sha256,proof.source_pdf_sha256);
 assert.equal(proof.source_image_unchanged_and_sha_verified,true);
 assert.equal(proof.no_original_pdf_images_published,true);
 const ids=new Set(bank.blocks.map(b=>b.source_slot_id));
 assert.equal(ids.size,13);
 const pageHashes={1:"0c3ec6dd81476068b43d7844697c480e1364bbf0456482d5d64ac7b7f41b0bb9",2:"fe57caf2381bfc66e9353a4c0608c4554de9cafdee9afe76032f1baf0fe4643f"};
 for(const [i,b] of bank.blocks.entries()){
  const r=review.records.find(x=>x.source_id===b.source_slot_id),
   q=source.original_question_records.find(x=>x.source_id===b.source_slot_id),
   p=proof.evidence.find(x=>x.source_slot_id===b.source_slot_id),
   h=hold.records.find(x=>x.source_id===b.source_slot_id);
  assert.ok(r&&q&&p&&h);assert.equal(h.primary_route,"SCAN_PDF_BBOX_RECOVERY");
  assert.equal(h.public_admitted,false,"historic closed ledger remains immutable");
  assert.equal(q.full_original_stem,p.original_source_full_stem);
  assert.equal(norm(strip(q.full_original_stem)),norm(b.stem));
  assert.equal(b.stem,r.student_scoreless_stem_projection);
  assert.deepEqual(q.full_original_options_in_order.map(x=>x.label+x.text),b.options??[]);
  assert.equal(b.answer,r.model_independently_reasoned_answer);
  assert.equal(b.canonical_kp_id,r.proposed_canonical_kp_id);
  assert.equal(b.source_page_pdf_1_based,p.source_pdf_page_1_based);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.answer_marker_pixel_bbox_on_original_image.map(x=>Number((x/1.6).toFixed(3))));
  assert.equal(p.pdf_image_render.rendered_page_rgb_sha256,pageHashes[p.source_pdf_page_1_based]);
  assert.deepEqual(p.pdf_image_render.page_image_size_px,[1166,1651]);
  assert.equal(p.pdf_image_render.page_rotation,0);
  assert.equal(p.native_pdf_text_glyph_bbox_available,false);
  assert.equal(p.precision_type,"DIRECT_SOURCE_IMAGE_PIXEL_RECTANGLE_VERIFIED_NOT_NATIVE_GLYPH");
  assert.equal(p.source_figure_dependency_absent,true);
  assert.equal(p.article9_school_exam_question_text_only,true);
  assert.equal(p.original_school_answer_key_authenticated,false);
 }
 for(const q of proof.quarantined){
  assert.equal(q.student_site_published,false);
  assert.equal(ids.has(q.source_slot_id),false);
  assert.equal(hold.records.find(x=>x.source_id===q.source_slot_id)?.primary_route,"SCAN_PDF_BBOX_RECOVERY");
  assert.ok(q.additional_blocker);
 }
 assert.equal(proof.quarantined.filter(x=>x.source_slot_id.includes("|S1|MC|")).length,4);
 assert.equal(proof.quarantined.filter(x=>x.source_slot_id.includes("|S3|G01|")).length,1);
});
test("P12 E01 Puren MID fail-closed public metadata/source SHA/BBox/KP/Science/printed options/rights",()=>{
 const cases=[b=>b.blocks[0].answer="①",b=>b.blocks[0].stem="tamper",
 b=>b.blocks[0].canonical_kp_id="sci_g04s1_04_11",
 b=>b.blocks[0].source_pdf_sha256="x",
 b=>b.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
 b=>b.blocks[0].source_page_pdf_1_based=3,
 b=>b.blocks.find(x=>x.type==="mcq").options[0]="①wrong",
 b=>b.blocks[0].answer_explanation="changed",
 b=>b.blocks[0].source_slot_id="WRONG",
 b=>b.blocks[0].operator_publication_approval=false,
 b=>b.blocks[0].original_cropped_assets_included=true,
 b=>b.blocks[0].copyright_path="MISSING"];
 for(const change of cases){const value=structuredClone(bank);change(value);assert.throws(()=>validateAndConvertP12E01PurenMid13(value,authority));}
});
test("P12 E01 Puren MID rejects original exact duplicates with existing public school bank",()=>{
 const previous=["approved-historical-ox-v4","p12-b04-b01-47-public-v1","p12-b04-b02-41-public-v1",
 "p12-b04-b03-41-public-v1","p12-b04-b04-47-public-v1","p12-b04-b05-40-public-v1",
 "p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1","p12-b04-g04s1-chongde-mid6-public-v1",
 "p12-b04-g04s1-yongan-mid9-public-v1","p12-e01-puren-final16-public-v1"];
 const known=new Set(previous.flatMap(p=>read("site/data/question-bank/"+p+".json").blocks.map(b=>norm(b.stem))));
 for(const b of bank.blocks)assert.equal(known.has(norm(b.stem)),false,b.source_slot_id);
});
