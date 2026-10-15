import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01PurenFinal16} from "../site/assets/js/p12-e01-puren-final16-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const proof=read("data/review/p12-e01-puren-final16-pixel-bbox-formal-science-kp-acceptance-v1.json");
const bank=read("site/data/question-bank/p12-e01-puren-final16-public-v1.json");
const source=read(proof.source_archive_ref);
const review=[
 ...read("data/review/p12-b04-auto-batch50-b08-first50-science-kp-review-v1.json").records,
 ...read("data/review/p12-b04-auto-batch50-b09-last9-science-kp-review-v1.json").records
];
const closeout=read("data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
test("P12 E01 Puren original scan pixel geometry; 16 true standalone source positions; 56 BBox-only still HOLD",()=>{
 const p=validateAndConvertP12E01PurenFinal16(bank,authority);
 assert.deepEqual([p.answerSlots,p.standaloneTf,p.standaloneChoice],[16,10,6]);
 assert.equal(proof.evidence.length,16);
 assert.equal(proof.other_bbox_only_held,56);
 assert.equal(closeout.records.filter(x=>x.primary_route==="SCAN_PDF_BBOX_RECOVERY").length,72);
 assert.equal(closeout.records.filter(x=>x.scan_bbox_blocker).length,78);
 assert.equal(proof.source_pdf_sha256,source.original_pdf_sha256);
 assert.equal(proof.source_pdf_sha256,"2c74d5994ee670d3bb3594c12023a67058693fd154c1acc69092d6ad07d47690");
 assert.equal(proof.pixel_geometry_model_visual_overlay_reviewed,true);
 assert.equal(proof.source_binary_not_published,true);
 assert.equal(proof.native_glyph_bbox_claimed,false);
 const pageHashes={1:"75a9323fd100329e6b406338873ccef407469692ff36d055df2675e95d792d58",
  2:"c76bd4da5c2fdd93145a764fdd2ab4c30f90af8ea3a6c745263ea6c0ca382e5d"};
 const ids=new Set();
 for(const [i,b] of bank.blocks.entries()){
  const e=proof.evidence[i],r=review.find(z=>z.source_id===b.source_slot_id);
  const original=source.original_question_records.find(z=>z.source_id===b.source_slot_id);
  const held=closeout.records.find(z=>z.source_id===b.source_slot_id);
  assert.ok(e&&r&&original&&held,"all provenance linked");
  assert.equal(held.primary_route,"SCAN_PDF_BBOX_RECOVERY");
  assert.equal(held.secondary_blocker_flags.length,0);
  assert.equal(held.public_admitted,false,"immutable earlier closeout remains snapshot");
  assert.equal(original.full_original_stem,e.source_original_stem_exact);
  assert.equal(r.full_original_stem_including_parent_instructions,e.source_original_stem_exact);
  assert.deepEqual(original.full_original_options_in_order,e.source_original_options_exact);
  assert.equal(e.source_original_stem_exact,b.stem);
  assert.deepEqual(e.source_original_options_exact.map(x=>x.label+x.text),b.options??[]);
  assert.equal(e.independently_reasoned_unique_answer,b.answer);
  assert.equal(e.certified_canonical_kp_id,b.canonical_kp_id);
  assert.equal(e.source_pdf_page_1_based,b.source_page_pdf_1_based);
  assert.equal(e.source_no_figure_dependency,true);
  assert.equal(e.source_rights_text_only,"REGULATED_EXAM_QUESTION_ART9");
  assert.equal(e.teacher_answer_key_authenticated,false);
  assert.equal(e.duplicate_published_original_exact_stem_detected,false);
  assert.equal(e.render_geometry.pdf_page_rotation,0);
  assert.equal(e.render_geometry.matrix_scale,1.6);
  assert.equal(e.render_geometry.rendered_page_rgb_sha256,pageHashes[e.source_pdf_page_1_based]);
  assert.deepEqual(e.page_upright_size_px,[1166,1651]);
  assert.deepEqual(e.answer_marker_bbox_pts_top_left,e.answer_marker_bbox_upright_render_px.map(x=>Number((x/1.6).toFixed(3))));
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,e.answer_marker_bbox_pts_top_left);
  assert.equal(e.original_native_pdf_glyph_bbox_available,false);
  assert.ok(e.answer_marker_bbox_upright_render_px[2]<=1166&&e.answer_marker_bbox_upright_render_px[3]<=1651);
  assert.ok(!ids.has(b.source_slot_id));ids.add(b.source_slot_id);
 }
 assert.equal(ids.size,16);
 const candidates=review.filter(z=>z.source_paper_id===source.source_paper_id);
 assert.equal(candidates.length,16);
 assert.equal(candidates.every(z=>ids.has(z.source_id)),true);
});
test("P12 E01 fail closed on source/pixel BBox/science/KP/choices/rights tampering",()=>{
 const cases=[
  x=>x.blocks[0].answer="O",x=>x.blocks[0].stem="錯誤",
  x=>x.blocks[0].canonical_kp_id="sci_g04s1_04_01",
  x=>x.blocks[0].source_pdf_sha256="x",
  x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]=100,
  x=>x.blocks[0].source_page_pdf_1_based=3,
  x=>x.blocks.find(z=>z.type==="mcq").options[0]="①非法改字",
  x=>x.blocks[0].answer_explanation="tampered",
  x=>x.blocks[0].source_slot_id="NO_SOURCE",
  x=>x.blocks[0].operator_publication_approval=false,
  x=>x.blocks[0].original_cropped_assets_included=true,
  x=>x.blocks[0].copyright_path="MISSING"
 ];
 for(const edit of cases){const t=structuredClone(bank);edit(t);assert.throws(()=>validateAndConvertP12E01PurenFinal16(t,authority));}
});
test("P12 E01 16 original standalone stems not exact duplicates of previously published G04S1 bank",()=>{
 const previous=[
  "approved-historical-ox-v4","p12-b04-b01-47-public-v1","p12-b04-b02-41-public-v1",
  "p12-b04-b03-41-public-v1","p12-b04-b04-47-public-v1","p12-b04-b05-40-public-v1",
  "p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1",
  "p12-b04-g04s1-chongde-mid6-public-v1","p12-b04-g04s1-yongan-mid9-public-v1"];
 const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
 const known=new Set(previous.flatMap(name=>read("site/data/question-bank/"+name+".json").blocks.map(x=>norm(x.stem))));
 for(const b of bank.blocks)assert.ok(!known.has(norm(b.stem)),"old bank exact duplicate: "+b.source_slot_id);
});
