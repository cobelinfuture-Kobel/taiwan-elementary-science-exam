import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01HeshunFinal19} from "../site/assets/js/p12-e01-heshun-final19-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-e01-heshun-final21-public-v1.json");
const proof=read("data/review/p12-e01-heshun-final21-raster-pixelbbox-science-kp-admission-v2.json");
const source=read("data/source-archive/p12-art9-114-heshun-g04s1-final35-original-questions-v1.json");
const review=[...read("data/review/p12-b04-auto-batch50-b07-first50-science-kp-review-v1.json").records,
 ...read("data/review/p12-b04-auto-batch50-b08-first50-science-kp-review-v1.json").records];
const ledger=read("data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
const paper="SCI_G04_S1_114_FINAL_002",sha="b899662eb8c535d56b2b1464f47b891403aeb966d6574be4c38da3a990139b5e";
test("P12 E01 Heshun FINAL original 21 page image markers; 19 strict admission and two direct-KP HOLDs",()=>{
 const adm=validateAndConvertP12E01HeshunFinal19(bank,authority);
 assert.deepEqual([adm.answerSlots,adm.standaloneTf,adm.standaloneChoice,adm.contextGroups],[19,12,7,0]);
 assert.deepEqual([proof.reviewed_source_count,proof.records.length,proof.formally_admitted_candidate_count,proof.held_items.length],[21,19,19,2]);
 assert.equal(proof.source_pdf_sha256,source.original_pdf_sha256);
 assert.equal(proof.source_pdf_sha256,sha);
 assert.equal(proof.source_binary_size_bytes,351361);
 assert.equal(proof.source_pdf_sha256_verified,true);
 assert.equal(proof.source_pdf_scan_only,true);
 assert.equal(proof.original_source_images_publicly_included,false);
 assert.equal(proof.native_pdf_glyph_bbox_certified,false);
 assert.equal(proof.original_21_positions_all_image_geometry_recovered,true);
 assert.equal(proof.teacher_answer_key_authenticated,false);
 assert.equal(proof.cumulative_public_pre_release,604);
 assert.equal(proof.cumulative_public_post_success,623);
 assert.equal(ledger.records.filter(x=>x.source_paper_id===paper&&x.primary_route==="SCAN_PDF_BBOX_RECOVERY").length,21);
 const known=new Set(),pages={1:"7a6677faafa73e58110a89462af361a89ad9710d08845acfc3fe9822aaf9935a",2:"bfe6e03f8c9aa1ca1ed7e31010cd72631e06c4128927772d168484924775777d"};
 for(const b of bank.blocks){
  const q=source.original_question_records.find(x=>x.source_id===b.source_slot_id);
  const e=proof.records.find(x=>x.source_slot_id===b.source_slot_id);
  const v=review.find(x=>x.source_id===b.source_slot_id);
  const closed=ledger.records.find(x=>x.source_id===b.source_slot_id);
  assert.ok(q&&e&&v&&closed,b.source_slot_id);
  assert.equal(closed.primary_route,"SCAN_PDF_BBOX_RECOVERY");
  assert.equal(closed.public_admitted,false,"historic frozen snapshot must not be modified");
  assert.equal(q.full_original_stem,b.stem);
  assert.equal(v.student_scoreless_stem_projection,b.stem);
  assert.equal(e.full_original_stem_exact,b.stem);
  assert.deepEqual(q.full_original_options_in_order.map(x=>x.label+x.text),b.options??[]);
  assert.deepEqual(e.all_original_options_exact.map(x=>x.label+x.text),b.options??[]);
  assert.equal(v.model_independently_reasoned_answer,b.answer);
  assert.equal(e.model_unique_science_answer,b.answer);
  assert.equal(e.certified_canonical_kp_id,b.canonical_kp_id);
  if(b.source_slot_id!==paper+"|S2|MC|002")assert.equal(v.proposed_canonical_kp_id,b.canonical_kp_id);
  assert.equal(b.source_page_pdf_1_based,e.pdf_page_1_based);
  assert.equal(e.original_pdf_page_rotation_degrees,90);
  assert.equal(e.raster_upright_rotation,"PIL_ROTATE_90_COUNTERCLOCKWISE");
  assert.deepEqual(e.unrotated_page_render_size_px,[1651,1166]);
  assert.deepEqual(e.upright_page_size_px,[1166,1651]);
  assert.equal(e.upright_page_rgb_sha256,pages[e.pdf_page_1_based]);
  assert.equal(e.source_scan_only_no_native_text_glyph_bbox,true);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,e.answer_marker_original_image_pixel_bbox_upright.map(x=>Number((x/1.6).toFixed(3))));
  assert.equal(e.no_shared_media_dependency,true);
  assert.equal(e.article9_regulated_school_exam_question_text_only,true);
  assert.equal(e.original_teacher_answer_key_authenticated,false);
  assert.equal(e.student_site_image_assets_published,false);
  assert.ok(!known.has(b.source_slot_id));known.add(b.source_slot_id);
 }
 assert.equal(known.size,19);
 const hold=proof.held_items[0];
 assert.equal(hold.source_slot_id,paper+"|S2|MC|003");
 assert.equal(hold.public_admitted,false);
 assert.equal(hold.admission_state,"SCIENCE_KP_EXCEPTION_HOLD");
 assert.equal(hold.source_image_pixel_geometry_recovered,true);
 assert.equal(bank.blocks.some(x=>x.source_slot_id===hold.source_slot_id),false);
 assert.equal(proof.held_items.length,2);
 for(const held of proof.held_items){
  assert.equal(held.admission_state,"SCIENCE_KP_EXCEPTION_HOLD");
  assert.equal(held.public_admitted,false);
  assert.equal(bank.blocks.some(x=>x.source_slot_id===held.source_slot_id),false);
  assert.equal(held.source_image_pixel_geometry_recovered,true);
 }
 assert.equal(proof.held_items.some(x=>x.source_slot_id===paper+"|S2|MC|013"),true);
 const correction=proof.kp_reassessed_corrections[0];
 assert.equal(correction.source_slot_id,paper+"|S2|MC|002");
 assert.equal(correction.from,"sci_g04s1_03_06");
 assert.equal(correction.to,"sci_g04s1_03_07");
 assert.equal(bank.blocks.find(x=>x.source_slot_id===correction.source_slot_id).canonical_kp_id,correction.to);
});
test("P12 E01 Heshun FINAL fails closed for tampering with source, science, KP, raster BBox, printed choices and rights",()=>{
 const mutate=[b=>b.blocks[0].answer="O",b=>b.blocks[0].stem="wrong",
 b=>b.blocks[0].canonical_kp_id="sci_g04s1_04_01",
 b=>b.blocks[0].source_pdf_sha256="WRONG",b=>b.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
 b=>b.blocks[0].source_page_pdf_1_based=3,
 b=>b.blocks.find(x=>x.type==="mcq").options[0]="①wrong",
 b=>b.blocks[0].answer_explanation="tampered",
 b=>b.blocks[0].source_slot_id="not_found",b=>b.blocks[0].operator_publication_approval=false,
 b=>b.blocks[0].copyright_path="MISSING",
 b=>b.blocks[0].original_cropped_assets_included=true,
 b=>b.expected_blocks=21];
 for(const edit of mutate){const b=structuredClone(bank);edit(b);assert.throws(()=>validateAndConvertP12E01HeshunFinal19(b,authority));}
});
test("P12 E01 Heshun FINAL source-exact school questions do not duplicate current live bank stems",()=>{
 const prior=["approved-historical-ox-v4","p12-b04-b01-47-public-v1","p12-b04-b02-41-public-v1",
 "p12-b04-b03-41-public-v1","p12-b04-b04-47-public-v1","p12-b04-b05-40-public-v1",
 "p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1",
 "p12-b04-g04s1-chongde-mid6-public-v1","p12-b04-g04s1-yongan-mid9-public-v1",
 "p12-e01-puren-final16-public-v1","p12-e01-puren-mid13-public-v1","p12-e01-heshun-mid15-public-v1"];
 const previous=new Set(prior.flatMap(p=>read("site/data/question-bank/"+p+".json").blocks.map(x=>norm(x.stem))));
 for(const b of bank.blocks)assert.equal(previous.has(norm(b.stem)),false,b.source_slot_id);
});
