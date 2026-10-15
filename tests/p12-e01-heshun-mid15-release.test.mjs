import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01HeshunMid15} from "../site/assets/js/p12-e01-heshun-mid15-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const bank=read("site/data/question-bank/p12-e01-heshun-mid15-public-v1.json");
const proof=read("data/review/p12-e01-heshun-mid17-pixel-bbox-15accept-2hold-v1.json");
const source=read(proof.original_source_archive_ref);
const review=read("data/review/p12-b04-auto-batch50-b07-first50-science-kp-review-v1.json").records;
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const closeout=read("data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
test("Heshun MID actual 17 original raster answer locations; 15 Science/KP admission and 2 independent exceptions",()=>{
 const v=validateAndConvertP12E01HeshunMid15(bank,authority);
 assert.deepEqual([v.answerSlots,v.standaloneTf,v.standaloneChoice,v.contextGroups],[15,9,6,0]);
 assert.deepEqual([proof.positions_recovered,proof.admission_candidates,proof.quarantined_count],[17,15,2]);
 assert.deepEqual([proof.records.length,proof.held_items.length],[15,2]);
 assert.equal(proof.source_pdf_sha256,source.original_pdf_sha256);
 assert.equal(proof.source_image_sha_verified,true);
 assert.equal(proof.raw_scan_images_not_public,true);
 assert.equal(proof.native_pdf_glyph_bbox_certified,false);
 const hashes={1:"3fdba6bdca23ca017da18f19a3267543c9f7abe02e1b67f36d62a313228c5ff0",
  2:"91d994d369d446d20745a3e32183d0fa167b721e0094524235eb1f7b0b4047a4"};
 for(const b of bank.blocks){
  const p=proof.records.find(x=>x.source_slot_id===b.source_slot_id);
  const q=source.original_question_records.find(x=>x.source_id===b.source_slot_id);
  const r=review.find(x=>x.source_id===b.source_slot_id);
  const originalHold=closeout.records.find(x=>x.source_id===b.source_slot_id);
  assert.ok(p&&q&&r&&originalHold);
  assert.equal(originalHold.primary_route,"SCAN_PDF_BBOX_RECOVERY");
  assert.equal(originalHold.public_admitted,false,"snapshot must remain untouched");
  assert.equal(norm(q.full_original_stem),norm(b.stem));
  assert.equal(b.stem,p.source_exact_full_original_stem);
  assert.equal(b.answer,p.science_independently_reasoned_answer);
  assert.equal(b.canonical_kp_id,p.certified_canonical_kp_id);
  assert.equal(b.canonical_kp_id,r.proposed_canonical_kp_id);
  assert.deepEqual(b.options??[],q.full_original_options_in_order.map(x=>x.label+x.text));
  assert.equal(b.source_page_pdf_1_based,p.source_pdf_page_1_based);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,p.answer_marker_pixel_bbox_upright.map(x=>Number((x/1.6).toFixed(3))));
  assert.equal(p.page_upright_rgb_sha256,hashes[p.source_pdf_page_1_based]);
  assert.deepEqual(p.upright_page_image_size_px,[1166,1650]);
  assert.deepEqual(p.rendered_page_landscape_size_px,[1650,1166]);
  assert.equal(p.original_pdf_rotation_degrees,0);
  assert.equal(p.native_pdf_glyph_bbox_available,false);
  assert.equal(p.source_rights_question_text_only,true);
  assert.equal(p.standalone_no_figure_dependency,true);
  assert.equal(p.original_teacher_answer_key_authenticated,false);
 }
 for(const h of proof.held_items){
  assert.equal(h.public_admitted,false);
  assert.ok(h.exception_reason);
  assert.ok(!bank.blocks.some(b=>b.source_slot_id===h.source_slot_id));
 }
 assert.deepEqual(proof.held_items.map(x=>x.source_slot_id),[
 "SCI_G04_S1_114_MID_002|S2|TF|007",
 "SCI_G04_S1_114_MID_002|S2|TF|011"]);
});
test("Heshun MID release fails closed for answer, text, KP, original source, raster BBox, rights and operator claim",()=>{
 const changes=[b=>b.blocks[0].answer="④",
 b=>b.blocks[0].stem="改字",
 b=>b.blocks[0].canonical_kp_id="sci_g04s1_04_01",
 b=>b.blocks[0].source_pdf_sha256="z",
 b=>b.blocks[0].source_pdf_bbox_pts_top_left[0]=333,
 b=>b.blocks[0].source_page_pdf_1_based=3,
 b=>b.blocks.find(x=>x.type==="mcq").options[0]="①ab",
 b=>b.blocks[0].answer_explanation="missing",
 b=>b.blocks[0].operator_publication_approval=false,
 b=>b.blocks[0].source_slot_id="NO",
 b=>b.blocks[0].copyright_path="DENY",
 b=>b.blocks[0].original_cropped_assets_included=true];
 for(const mut of changes){const b=structuredClone(bank);mut(b);assert.throws(()=>validateAndConvertP12E01HeshunMid15(b,authority));}
});
test("Heshun MID 15 source stems remain unique against already-published historical bank",()=>{
 const prior=["approved-historical-ox-v4","p12-b04-b01-47-public-v1",
 "p12-b04-b02-41-public-v1","p12-b04-b03-41-public-v1",
 "p12-b04-b04-47-public-v1","p12-b04-b05-40-public-v1",
 "p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1",
 "p12-b04-g04s1-chongde-mid6-public-v1","p12-b04-g04s1-yongan-mid9-public-v1",
 "p12-e01-puren-final16-public-v1","p12-e01-puren-mid13-public-v1"];
 const known=new Set(prior.flatMap(p=>read("site/data/question-bank/"+p+".json").blocks.map(x=>norm(x.stem))));
 for(const b of bank.blocks)assert.equal(known.has(norm(b.stem)),false,b.source_slot_id);
});
