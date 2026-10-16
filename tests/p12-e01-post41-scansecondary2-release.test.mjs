import test from "node:test";import assert from "node:assert/strict";import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12E01Post41ScanSecondary2 as validate} from "../site/assets/js/p12-e01-post41-scansecondary2-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const proof=read("data/review/p12-e01-post41-scansecondary6-source-science-kp-dedup-v1.json"), bank=read("site/data/question-bank/p12-e01-post41-scansecondary2-public-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v3.json");
test("six exact scan slots 2 admission 4 holds, correct source and upright pixel box",()=>{
 assert.equal(proof.records.length,6);assert.equal(proof.records.filter(x=>x.decision==="ADMIT").length,2);
 assert.equal(proof.records.filter(x=>x.decision.startsWith("HOLD")).length,4);
 assert.deepEqual([proof.public_before,proof.conditional_public_after,proof.exception_before,proof.conditional_exception_after],[634,636,41,39]);
 for(const x of proof.records){assert.equal(x.original_pdf_sha256,read(x.source_archive_ref).original_pdf_sha256);
 assert.deepEqual(x.certified_bbox_pts_top_left,x.exact_upright_source_marker_pixel_bbox.map(v=>Number((v/1.6).toFixed(3))));}
});
test("formal two exact original full text science answers direct canonical KP",()=>{
 assert.equal(validate(bank,auth).answerSlots,2);
 assert.deepEqual(bank.blocks.map(x=>x.answer),["X","X"]);
 assert.deepEqual(bank.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_06","sci_g04s1_04_08"]);
 for(const b of bank.blocks){const x=proof.records.find(x=>x.source_slot_id===b.source_slot_id);
 const origin=read(x.source_archive_ref).original_question_records.find(q=>q.source_id===b.source_slot_id);
 assert.equal(origin.full_original_stem,b.stem);assert.equal(b.source_pdf_sha256,x.original_pdf_sha256);assert.equal(Object.hasOwn(b,"source_image_answer_marker_pixel_bbox_upright"),false,"pixel evidence must remain in source audit, not public global schema");}
});
test("fail closed tampered provenance answer KP or source geometry",()=>{
 for(const change of [v=>v.blocks[0].answer="O",v=>v.blocks[0].source_pdf_sha256="wrong",v=>v.blocks[0].source_image_answer_marker_pixel_bbox_upright=[586,335,644,370],v=>v.blocks[1].canonical_kp_id="sci_g04s1_04_06",v=>v.blocks[1].stem="changed",v=>v.blocks[0].original_cropped_assets_included=true]){
 const copy=structuredClone(bank);change(copy);assert.throws(()=>validate(copy,auth));}
});
test("both exact same-stem held sources already present",()=>{
 const h=proof.records.filter(x=>x.decision==="HOLD_EXACT_STEM_DUPLICATE");
 assert.equal(h.length,2);
 for(const x of h)assert.equal(bank.blocks.some(b=>b.source_slot_id===x.source_slot_id),false);
});
